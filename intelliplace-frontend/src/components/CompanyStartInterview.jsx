import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Code, Users, Play, Square, CheckCircle, Loader, MessageSquare } from 'lucide-react';

const CompanyStartInterview = ({ isOpen, onClose, jobId, applicationId, application, job, onRefresh }) => {
  const [mode, setMode] = useState(null);
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatingQuestion, setGeneratingQuestion] = useState(false);
  const [message, setMessage] = useState(null);
  const [interviewStatus, setInterviewStatus] = useState('STOPPED');

  useEffect(() => {
    if (isOpen && applicationId) {
      fetchSession();
      const interval = setInterval(fetchSession, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, applicationId]);

  const fetchSession = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:5000/api/jobs/${jobId}/interviews/${applicationId}/session`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.data?.session) {
          const sessionData = data.data.session;
          setSession(sessionData);
          setMode(sessionData.mode);
          setInterviewStatus(sessionData.status || 'ACTIVE');
          
          const questionsList = Array.isArray(sessionData.questions) 
            ? sessionData.questions 
            : JSON.parse(sessionData.questions || '[]');
          setQuestions(questionsList);
          
          const answers = Array.isArray(sessionData.answers)
            ? sessionData.answers
            : JSON.parse(sessionData.answers || '[]');
          
          const questionsWithAnswers = questionsList.map((q, idx) => {
            const answerData = answers.find(a => a.questionIndex === (q.index !== undefined ? q.index : idx));
            return {
              ...q,
              answer: answerData?.answer || null,
              analysis: answerData?.analysis || null,
            };
          });
          
          setQuestions(questionsWithAnswers);
          
          const unansweredQ = questionsWithAnswers.find(q => !q.answer);
          if (unansweredQ) {
            setCurrentQuestion(unansweredQ);
          } else if (questionsWithAnswers.length > 0) {
            setCurrentQuestion(questionsWithAnswers[questionsWithAnswers.length - 1]);
          }
        }
      } else if (res.status === 404) {
        setSession(null);
        setInterviewStatus('STOPPED');
      }
    } catch (err) {
      console.error('Error fetching session:', err);
    }
  };

  const handleStartInterview = async (selectedMode) => {
    setLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:5000/api/jobs/${jobId}/interviews/${applicationId}/start`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ mode: selectedMode }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMode(selectedMode);
        setSession(data.data.session);
        setInterviewStatus('ACTIVE');
        setMessage({ type: 'success', text: 'Interview session started!' });
        setTimeout(() => {
          handleGenerateQuestion();
        }, 500);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to start interview' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to start interview' });
    } finally {
      setLoading(false);
    }
  };

  const handleStopInterview = async () => {
    if (!window.confirm('Stop the interview? Students will no longer be able to submit answers.')) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:5000/api/jobs/${jobId}/interviews/${applicationId}/stop`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (res.ok) {
        setInterviewStatus('STOPPED');
        setMessage({ type: 'success', text: 'Interview stopped' });
        await fetchSession();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to stop interview' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to stop interview' });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuestion = async () => {
    setGeneratingQuestion(true);
    setMessage(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:5000/api/jobs/${jobId}/interviews/${applicationId}/generate-question`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (res.ok) {
        const newQuestion = data.data.question;
        setCurrentQuestion(newQuestion);
        setQuestions((prev) => [...prev, newQuestion]);
        setMessage({ type: 'success', text: 'Question generated!' });
        await fetchSession();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to generate question' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to generate question' });
    } finally {
      setGeneratingQuestion(false);
    }
  };

  const handleCompleteInterview = async () => {
    if (!window.confirm('Complete this interview session?')) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:5000/api/jobs/${jobId}/interviews/${applicationId}/complete`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Interview completed!' });
        setInterviewStatus('COMPLETED');
        if (onRefresh) onRefresh();
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to complete interview' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to complete interview' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">Conduct Interview</h3>
            {application?.student && (
              <p className="text-sm text-gray-600 mt-1">
                Interviewing: {application.student.name}
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
          {message && (
            <div
              className={`mb-4 p-3 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          {!session ? (
            <div className="space-y-6">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Select Interview Mode
                </h4>
                <p className="text-gray-600">
                  Choose the type of interview you want to conduct
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleStartInterview('TECH')}
                  disabled={loading}
                  className="p-6 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Code className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h5 className="font-semibold text-gray-800 mb-2">Technical Interview</h5>
                  <p className="text-sm text-gray-600">
                    Assess technical skills and problem-solving abilities
                  </p>
                </button>

                <button
                  onClick={() => handleStartInterview('HR')}
                  disabled={loading}
                  className="p-6 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Users className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h5 className="font-semibold text-gray-800 mb-2">HR Interview</h5>
                  <p className="text-sm text-gray-600">
                    Evaluate soft skills, communication, and cultural fit
                  </p>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">Mode:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      mode === 'TECH'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {mode === 'TECH' ? 'Technical' : 'HR'}
                  </span>
                  <span className="text-sm text-gray-600">
                    Questions: {questions.length}
                  </span>
                  <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                    interviewStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {interviewStatus}
                  </span>
                </div>
                <div className="flex gap-2">
                  {interviewStatus === 'ACTIVE' && (
                    <button
                      onClick={handleStopInterview}
                      disabled={loading}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      <Square className="w-4 h-4" />
                      Stop Interview
                    </button>
                  )}
                  {interviewStatus === 'STOPPED' && (
                    <button
                      onClick={() => handleStartInterview(mode)}
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Resume Interview
                    </button>
                  )}
                </div>
              </div>

              {currentQuestion && (
                <div className="border-2 border-indigo-200 rounded-lg p-6 bg-indigo-50">
                  <div className="flex items-start justify-between mb-4">
                    <h5 className="font-semibold text-gray-800">
                      Question {currentQuestion.index !== undefined ? currentQuestion.index + 1 : questions.indexOf(currentQuestion) + 1}
                    </h5>
                    {currentQuestion.answer && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <p className="text-gray-700 mb-4">{currentQuestion.question}</p>

                  {currentQuestion.answer ? (
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border">
                        <p className="text-sm font-medium text-gray-700 mb-2">Candidate's Answer:</p>
                        <p className="text-gray-800 whitespace-pre-wrap">{currentQuestion.answer}</p>
                      </div>
                      
                      {currentQuestion.analysis && (
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <p className="text-sm font-medium text-blue-800 mb-2">Analysis & Feedback:</p>
                          {currentQuestion.analysis.content_score !== undefined && (
                            <div className="grid grid-cols-3 gap-4 mb-3">
                              <div>
                                <span className="text-xs text-gray-600">Content Score</span>
                                <p className="text-lg font-bold text-blue-600">
                                  {currentQuestion.analysis.content_score?.toFixed(1) || 'N/A'}/10
                                </p>
                              </div>
                              {currentQuestion.analysis.confidence_score !== undefined && (
                                <div>
                                  <span className="text-xs text-gray-600">Confidence</span>
                                  <p className="text-lg font-bold text-purple-600">
                                    {currentQuestion.analysis.confidence_score?.toFixed(1) || 'N/A'}/10
                                  </p>
                                </div>
                              )}
                              {currentQuestion.analysis.overall_score !== undefined && (
                                <div>
                                  <span className="text-xs text-gray-600">Overall</span>
                                  <p className="text-lg font-bold text-green-600">
                                    {currentQuestion.analysis.overall_score?.toFixed(1) || 'N/A'}/10
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                          {currentQuestion.analysis.feedback && (
                            <p className="text-sm text-gray-700">{currentQuestion.analysis.feedback}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">Waiting for candidate's answer...</p>
                    </div>
                  )}
                </div>
              )}

              {questions.length > 0 && (
                <div>
                  <h5 className="font-semibold text-gray-800 mb-3">All Questions & Answers</h5>
                  <div className="space-y-3">
                    {questions.map((q, idx) => {
                      const qIndex = q.index !== undefined ? q.index : idx;
                      return (
                        <div
                          key={idx}
                          className={`border rounded-lg p-4 bg-white cursor-pointer transition-colors ${
                            currentQuestion === q ? 'border-indigo-500 bg-indigo-50' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setCurrentQuestion(q)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-gray-600">
                                  Q{qIndex + 1}:
                                </span>
                                {q.answer ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <span className="text-xs text-yellow-600">Pending</span>
                                )}
                              </div>
                              <p className="text-gray-700 mb-2">{q.question}</p>
                              {q.answer && (
                                <div className="mt-2 pt-2 border-t">
                                  <p className="text-xs font-medium text-gray-600 mb-1">Answer:</p>
                                  <p className="text-sm text-gray-800 line-clamp-2">{q.answer}</p>
                                  {q.analysis?.overall_score !== undefined && (
                                    <p className="text-xs text-blue-600 mt-1">
                                      Score: {q.analysis.overall_score.toFixed(1)}/10
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={handleGenerateQuestion}
                  disabled={generatingQuestion || interviewStatus !== 'ACTIVE'}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generatingQuestion ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Generate Next Question
                    </>
                  )}
                </button>
                <button
                  onClick={handleCompleteInterview}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-4 h-4" />
                  Complete Interview
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CompanyStartInterview;
