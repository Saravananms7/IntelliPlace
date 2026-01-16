import express from 'express';
import prisma from '../lib/prisma.js';
import { authenticateToken, authorizeCompany, authorizeStudent } from '../middleware/auth.js';
import axios from 'axios';

const router = express.Router();
const INTERVIEW_SERVICE_URL = process.env.INTERVIEW_SERVICE_URL || 'http://localhost:8001';

// Get all interviews for a job (Company)
router.get('/:jobId/interviews', authenticateToken, authorizeCompany, async (req, res) => {
  try {
    const companyId = req.user.id;
    const jobId = parseInt(req.params.jobId);

    // Verify job belongs to company
    const job = await prisma.job.findFirst({
      where: { id: jobId, companyId },
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const interviews = await prisma.interview.findMany({
      where: { jobId },
      include: {
        application: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        sessions: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: { interviews },
    });
  } catch (error) {
    console.error('Error fetching interviews:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch interviews' });
  }
});

// Start an interview session (Company)
router.post('/:jobId/interviews/:applicationId/start', authenticateToken, authorizeCompany, async (req, res) => {
  try {
    const companyId = req.user.id;
    const jobId = parseInt(req.params.jobId);
    const applicationId = parseInt(req.params.applicationId);
    const { mode } = req.body; // "TECH" or "HR"

    if (!mode || !['TECH', 'HR'].includes(mode.toUpperCase())) {
      return res.status(400).json({ success: false, message: 'Mode must be TECH or HR' });
    }

    // Verify job belongs to company
    const job = await prisma.job.findFirst({
      where: { id: jobId, companyId },
      include: {
        applications: {
          where: { id: applicationId },
          include: {
            student: true,
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const application = job.applications[0];
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Get or create interview
    let interview = await prisma.interview.findUnique({
      where: { applicationId },
    });

    if (!interview) {
      interview = await prisma.interview.create({
        data: {
          applicationId,
          jobId,
          date: new Date(),
          type: mode,
          status: 'IN_PROGRESS',
        },
      });
    } else {
      interview = await prisma.interview.update({
        where: { id: interview.id },
        data: { status: 'IN_PROGRESS' },
      });
    }

    // Create interview session
    const session = await prisma.interviewSession.create({
      data: {
        interviewId: interview.id,
        mode: mode.toUpperCase(),
        status: 'ACTIVE',
        questions: JSON.stringify([]),
        currentQuestionIndex: 0,
      },
    });

    // Send notification to student
    try {
      await prisma.notification.create({
        data: {
          studentId: application.studentId,
          title: 'Interview Started',
          message: `A ${mode === 'TECH' ? 'Technical' : 'HR'} interview for "${job.title}" has started. Click to join the interview.`,
          jobId: jobId,
          applicationId: applicationId,
        },
      });
      console.log(`[Interview Start] Notification sent to student ${application.studentId}`);
    } catch (notifError) {
      console.error(`[Interview Start] Failed to send notification:`, notifError);
      // Don't fail the request if notification fails
    }

    res.json({
      success: true,
      data: {
        interview,
        session,
        message: 'Interview session started',
      },
    });
  } catch (error) {
    console.error('Error starting interview:', error);
    res.status(500).json({ success: false, message: 'Failed to start interview' });
  }
});

// Generate next question (Company)
router.post('/:jobId/interviews/:applicationId/generate-question', authenticateToken, authorizeCompany, async (req, res) => {
  try {
    const companyId = req.user.id;
    const jobId = parseInt(req.params.jobId);
    const applicationId = parseInt(req.params.applicationId);

    // Verify job belongs to company
    const job = await prisma.job.findFirst({
      where: { id: jobId, companyId },
      include: {
        applications: {
          where: { id: applicationId },
          include: {
            student: true,
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const application = job.applications[0];
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Get active interview session
    const interview = await prisma.interview.findUnique({
      where: { applicationId },
      include: {
        sessions: {
          where: { status: { in: ['ACTIVE', 'STOPPED'] } },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!interview || interview.sessions.length === 0) {
      return res.status(404).json({ success: false, message: 'No active interview session found' });
    }

    const session = interview.sessions[0];
    const questions = JSON.parse(session.questions || '[]');
    const previousQuestions = questions.map((q) => q.question);

    // Prepare data for interview service
    // Safe JSON parsing - handle both JSON strings and plain strings
    let requiredSkills = [];
    if (job.requiredSkills) {
      try {
        requiredSkills = typeof job.requiredSkills === 'string' 
          ? JSON.parse(job.requiredSkills) 
          : job.requiredSkills;
        // If it's not an array after parsing, treat as single value
        if (!Array.isArray(requiredSkills)) {
          requiredSkills = requiredSkills ? [requiredSkills] : [];
        }
      } catch (e) {
        // If not valid JSON, treat as single string value
        requiredSkills = [job.requiredSkills];
      }
    }
    
    let candidateSkills = null;
    if (application.skills) {
      try {
        candidateSkills = typeof application.skills === 'string'
          ? JSON.parse(application.skills)
          : application.skills;
        // If it's not an array after parsing, treat as single value
        if (!Array.isArray(candidateSkills)) {
          candidateSkills = candidateSkills ? [candidateSkills] : null;
        }
      } catch (e) {
        // If not valid JSON, treat as single string value
        candidateSkills = [application.skills];
      }
    }

    const requestData = {
      mode: session.mode,
      job_title: job.title,
      job_description: job.description,
      required_skills: requiredSkills,
      candidate_skills: candidateSkills,
      candidate_profile: `Student with CGPA: ${application.cgpa || 'N/A'}, Backlogs: ${application.backlog || 0}`,
      previous_questions: previousQuestions,
    };

    // Call interview service to generate question
    const interviewServiceResponse = await axios.post(
      `${INTERVIEW_SERVICE_URL}/generate-question`,
      requestData,
      { timeout: 30000 }
    );

    if (!interviewServiceResponse.data.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate question',
      });
    }

    const newQuestion = {
      question: interviewServiceResponse.data.question,
      index: questions.length,
      timestamp: new Date().toISOString(),
    };

    questions.push(newQuestion);

    // Update session with new question
    await prisma.interviewSession.update({
      where: { id: session.id },
      data: {
        questions: JSON.stringify(questions),
        currentQuestionIndex: questions.length - 1,
      },
    });

    res.json({
      success: true,
      data: {
        question: newQuestion,
        sessionId: session.id,
      },
    });
  } catch (error) {
    console.error('Error generating question:', error);
    if (error.response) {
      return res.status(error.response.status || 500).json({
        success: false,
        message: error.response.data?.error || 'Failed to generate question',
      });
    }
    res.status(500).json({ success: false, message: 'Failed to generate question' });
  }
});

// Submit answer (Student or Company)
// Student submits audio/video, Company submits text notes
router.post('/:jobId/interviews/:applicationId/submit-answer', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.type; // 'student' or 'company'
    const jobId = parseInt(req.params.jobId);
    const applicationId = parseInt(req.params.applicationId);
    const { answer, questionIndex, audio_data, video_frames, question } = req.body;

    // Get active interview session
    const interview = await prisma.interview.findUnique({
      where: { applicationId },
      include: {
        application: {
          include: {
            student: true,
          },
        },
        job: true,
        sessions: {
          where: { status: { in: ['ACTIVE', 'STOPPED'] } },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!interview || interview.sessions.length === 0) {
      return res.status(404).json({ success: false, message: 'No active interview session found' });
    }

    // Verify permissions
    if (userType === 'company') {
      if (interview.job.companyId !== userId) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }
    } else if (userType === 'student') {
      if (interview.application.studentId !== userId) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }
    }

    const session = interview.sessions[0];
    const questions = JSON.parse(session.questions || '[]');
    const answers = JSON.parse(session.answers || '[]');

    const questionIdx = questionIndex !== undefined ? questionIndex : session.currentQuestionIndex;

    if (questionIdx < 0 || questionIdx >= questions.length) {
      return res.status(400).json({ success: false, message: 'Invalid question index' });
    }

    let analysisResult = null;

    // If student submitted audio/video, analyze it
    if (userType === 'student' && (audio_data || video_frames)) {
      try {
        const currentQuestion = questions[questionIdx]?.question || question;
        
        // Call interview service for analysis
        const analysisResponse = await axios.post(
          `${INTERVIEW_SERVICE_URL}/analyze-answer`,
          {
            question: currentQuestion,
            question_index: questionIdx,
            audio_data: audio_data,
            video_frames: video_frames || [],
            mode: session.mode,
          },
          { timeout: 60000 } // 60 second timeout for analysis
        );

        if (analysisResponse.data.success) {
          analysisResult = analysisResponse.data.data;
          
          // Store analysis in database
          await prisma.interviewQuestionAnswer.create({
            data: {
              sessionId: session.id,
              questionIndex: questionIdx,
              questionText: currentQuestion,
              transcribedText: analysisResult.transcribed_text,
              contentScore: analysisResult.content_score,
              confidenceScore: analysisResult.confidence_score,
              emotionScores: JSON.stringify(analysisResult.emotion_scores || {}),
              overallScore: analysisResult.overall_score,
              feedback: analysisResult.feedback,
              analysisData: JSON.stringify(analysisResult.analysis_data || {}),
            },
          });
        }
      } catch (analysisError) {
        console.error('Error analyzing answer:', analysisError);
        // Continue even if analysis fails
      }
    }

    // Add or update answer
    const answerData = {
      questionIndex: questionIdx,
      answer: answer || analysisResult?.transcribed_text || 'Audio/video submitted',
      timestamp: new Date().toISOString(),
      analysis: analysisResult,
    };

    // Update existing answer or add new one
    const existingAnswerIndex = answers.findIndex((a) => a.questionIndex === questionIdx);
    if (existingAnswerIndex >= 0) {
      answers[existingAnswerIndex] = answerData;
    } else {
      answers.push(answerData);
    }

    // Update session
    await prisma.interviewSession.update({
      where: { id: session.id },
      data: {
        answers: JSON.stringify(answers),
      },
    });

    res.json({
      success: true,
      data: {
        answer: answerData,
        analysis: analysisResult,
        message: 'Answer submitted successfully',
      },
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ success: false, message: 'Failed to submit answer' });
  }
});

router.post('/:jobId/interviews/:applicationId/stop', authenticateToken, authorizeCompany, async (req, res) => {
  try {
    const companyId = req.user.id;
    const jobId = parseInt(req.params.jobId);
    const applicationId = parseInt(req.params.applicationId);

    const job = await prisma.job.findFirst({
      where: { id: jobId, companyId },
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const interview = await prisma.interview.findUnique({
      where: { applicationId },
      include: {
        sessions: {
          where: { status: { in: ['ACTIVE', 'STOPPED'] } },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!interview || interview.sessions.length === 0) {
      return res.status(404).json({ success: false, message: 'No active interview session found' });
    }

    const session = interview.sessions[0];

    await prisma.interviewSession.update({
      where: { id: session.id },
      data: {
        status: 'STOPPED',
      },
    });

    res.json({
      success: true,
      data: {
        message: 'Interview stopped successfully',
      },
    });
  } catch (error) {
    console.error('Error stopping interview:', error);
    res.status(500).json({ success: false, message: 'Failed to stop interview' });
  }
});

router.get('/:jobId/interviews/:applicationId/student-session', authenticateToken, authorizeStudent, async (req, res) => {
  try {
    const studentId = req.user.id;
    const jobId = parseInt(req.params.jobId);
    const applicationId = parseInt(req.params.applicationId);

    // Verify application belongs to student
    const application = await prisma.application.findFirst({
      where: { id: applicationId, studentId, jobId },
      include: {
        job: true,
      },
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Get interview with active session
    const interview = await prisma.interview.findUnique({
      where: { applicationId },
      include: {
        sessions: {
          where: { status: { in: ['ACTIVE', 'STOPPED'] } },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!interview || interview.sessions.length === 0) {
      return res.status(404).json({ success: false, message: 'No active interview session found' });
    }

    const session = interview.sessions[0];
    const questions = JSON.parse(session.questions || '[]');
    const answers = JSON.parse(session.answers || '[]');

    const questionsWithAnswers = questions.map((q, idx) => {
      const qIndex = q.index !== undefined ? q.index : idx;
      const answer = answers.find((a) => a.questionIndex === qIndex);
      return {
        ...q,
        index: qIndex,
        answer: answer ? answer.answer : null,
        analysis: answer?.analysis || null,
      };
    });

    res.json({
      success: true,
      data: {
        interview,
        session: {
          ...session,
          questions: questionsWithAnswers,
        },
        job: application.job,
      },
    });
  } catch (error) {
    console.error('Error fetching student interview session:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch interview session' });
  }
});

// Get interview session details (Company)
router.get('/:jobId/interviews/:applicationId/session', authenticateToken, authorizeCompany, async (req, res) => {
  try {
    const companyId = req.user.id;
    const jobId = parseInt(req.params.jobId);
    const applicationId = parseInt(req.params.applicationId);

    // Verify job belongs to company
    const job = await prisma.job.findFirst({
      where: { id: jobId, companyId },
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Get interview with active session
    const interview = await prisma.interview.findUnique({
      where: { applicationId },
      include: {
        application: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
                cgpa: true,
                backlog: true,
              },
            },
          },
        },
        sessions: {
          where: { status: { in: ['ACTIVE', 'STOPPED'] } },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    const session = interview.sessions[0];
    if (!session) {
      return res.status(404).json({ success: false, message: 'No active session found' });
    }

    const questions = JSON.parse(session.questions || '[]');
    const answers = JSON.parse(session.answers || '[]');

    const questionsWithAnswers = questions.map((q, idx) => {
      const qIndex = q.index !== undefined ? q.index : idx;
      const answer = answers.find((a) => a.questionIndex === qIndex);
      return {
        ...q,
        index: qIndex,
        answer: answer ? answer.answer : null,
        analysis: answer?.analysis || null,
      };
    });

    res.json({
      success: true,
      data: {
        interview,
        session: {
          ...session,
          questions: questionsWithAnswers,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching interview session:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch interview session' });
  }
});

// Complete interview session (Company)
router.post('/:jobId/interviews/:applicationId/complete', authenticateToken, authorizeCompany, async (req, res) => {
  try {
    const companyId = req.user.id;
    const jobId = parseInt(req.params.jobId);
    const applicationId = parseInt(req.params.applicationId);

    // Verify job belongs to company
    const job = await prisma.job.findFirst({
      where: { id: jobId, companyId },
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Get active interview session
    const interview = await prisma.interview.findUnique({
      where: { applicationId },
      include: {
        sessions: {
          where: { status: { in: ['ACTIVE', 'STOPPED'] } },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!interview || interview.sessions.length === 0) {
      return res.status(404).json({ success: false, message: 'No active interview session found' });
    }

    const session = interview.sessions[0];

    // Update session to completed
    await prisma.interviewSession.update({
      where: { id: session.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    // Update interview status
    await prisma.interview.update({
      where: { id: interview.id },
      data: {
        status: 'COMPLETED',
      },
    });

    res.json({
      success: true,
      data: {
        message: 'Interview session completed',
      },
    });
  } catch (error) {
    console.error('Error completing interview:', error);
    res.status(500).json({ success: false, message: 'Failed to complete interview' });
  }
});

export default router;
