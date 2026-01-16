import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Play, Loader, CheckCircle, AlertCircle } from 'lucide-react';

const StudentInterview = ({ isOpen, onClose, jobId, applicationId, question, questionIndex, onAnswerSubmitted, session: initialSession }) => {
  const [session, setSession] = useState(initialSession || null);
  const [currentQuestion, setCurrentQuestion] = useState(question || null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(questionIndex !== undefined ? questionIndex : -1);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [loadingSession, setLoadingSession] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && jobId && applicationId) {
      if (!session) {
        fetchSession();
      } else {
        const questions = Array.isArray(session.questions) ? session.questions : JSON.parse(session.questions || '[]');
        const unansweredQ = questions.find((q, idx) => !q.answer);
        if (unansweredQ) {
          setCurrentQuestion(unansweredQ.question);
          setCurrentQuestionIndex(unansweredQ.index !== undefined ? unansweredQ.index : questions.indexOf(unansweredQ));
        }
      }
    }
    
    if (!isOpen) {
      setInterviewStarted(false);
      setCurrentQuestion(null);
      setCurrentQuestionIndex(-1);
      setAnswerText('');
      setSubmitted(false);
      setError(null);
    }
  }, [isOpen, jobId, applicationId]);
  
  const fetchSession = async () => {
    setLoadingSession(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:5000/api/jobs/${jobId}/interviews/${applicationId}/student-session`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.ok) {
        const data = await res.json();
        if (data.data?.session) {
          setSession(data.data.session);
        }
      } else if (res.status === 404) {
        setError('No active interview session found');
      }
    } catch (err) {
      console.error('Error fetching session:', err);
      setError('Failed to load interview session');
    } finally {
      setLoadingSession(false);
    }
  };
  
  const handleStartInterview = () => {
    if (!session) {
      setError('Interview session not loaded');
      return;
    }
    
    const questions = Array.isArray(session.questions) ? session.questions : JSON.parse(session.questions || '[]');
    const firstQuestion = questions[0];
    
    if (firstQuestion) {
      setCurrentQuestion(firstQuestion.question);
      setCurrentQuestionIndex(firstQuestion.index !== undefined ? firstQuestion.index : 0);
      setInterviewStarted(true);
      setAnswerText('');
      setSubmitted(false);
      setError(null);
    } else {
      setError('No questions available yet. Please wait for the interviewer to generate questions.');
    }
  };

  const handleSubmit = async () => {
    if (!answerText.trim()) {
      setError('Please enter your answer');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/jobs/${jobId}/interviews/${applicationId}/submit-answer`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            questionIndex: currentQuestionIndex,
            answer: answerText,
            question: currentQuestion,
          }),
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        setSubmitted(true);
        
        setTimeout(async () => {
          await fetchSession();
          const updatedSession = await fetch(`http://localhost:5000/api/jobs/${jobId}/interviews/${applicationId}/student-session`, {
            headers: { Authorization: `Bearer ${token}` }
          }).then(r => r.json());
          
          if (updatedSession.data?.session) {
            const questions = Array.isArray(updatedSession.data.session.questions) 
              ? updatedSession.data.session.questions 
              : JSON.parse(updatedSession.data.session.questions || '[]');
            const nextQuestion = questions.find((q, idx) => idx > currentQuestionIndex && !q.answer);
            
            if (nextQuestion) {
              setCurrentQuestion(nextQuestion.question);
              setCurrentQuestionIndex(nextQuestion.index !== undefined ? nextQuestion.index : questions.indexOf(nextQuestion));
              setAnswerText('');
              setSubmitted(false);
              setSession(updatedSession.data.session);
            } else {
              setError('All questions answered! Interview complete.');
            }
          }
        }, 2000);
        
        if (onAnswerSubmitted) {
          onAnswerSubmitted(data.data);
        }
      } else {
        setError(data.message || 'Failed to submit answer');
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError('Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">Interview</h3>
            {currentQuestion && (
              <p className="text-sm text-gray-600 mt-1">
                {session?.mode === 'TECH' ? 'Technical' : 'HR'} Interview - Question {currentQuestionIndex + 1}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loadingSession ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-indigo-600" />
              <span className="ml-3 text-gray-600">Loading interview session...</span>
            </div>
          ) : !session ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No interview session found.</p>
            </div>
          ) : !interviewStarted && !currentQuestion ? (
            <div className="space-y-6 text-center py-8">
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Interview Ready</h4>
                <p className="text-gray-600">
                  {session?.mode === 'TECH' ? 'Technical' : 'HR'} Interview Session
                </p>
              </div>
              
              <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  When you're ready, click the button below to start answering interview questions.
                  You can type your answers in the text box.
                </p>
              </div>
              
              <button
                onClick={handleStartInterview}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <Play className="w-5 h-5" />
                Start Interview
              </button>
            </div>
          ) : currentQuestion ? (
            <>
              <div className="mb-6 p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                <h4 className="font-semibold text-gray-800 mb-2">Question {currentQuestionIndex + 1}:</h4>
                <p className="text-gray-700">{currentQuestion}</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              {submitted && (
                <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Answer submitted successfully! Loading next question...
                </div>
              )}

              {!submitted && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Answer:
                    </label>
                    <textarea
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="Type your answer here..."
                      rows="8"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSubmit}
                      disabled={submitting || !answerText.trim()}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Submit Answer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No questions available yet. Please wait for the interviewer.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StudentInterview;
