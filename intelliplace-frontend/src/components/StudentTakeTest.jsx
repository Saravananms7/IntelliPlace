import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle, Lock } from 'lucide-react';

const StudentTakeTest = ({ isOpen, onClose, jobId, onSubmitted }) => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [warnings, setWarnings] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const warningIntervalRef = useRef(null);

  // Enter fullscreen and setup security
  useEffect(() => {
    if (!isOpen || !jobId) return;

    const enterFullscreen = async () => {
      try {
        if (containerRef.current) {
          if (containerRef.current.requestFullscreen) {
            await containerRef.current.requestFullscreen();
          } else if (containerRef.current.webkitRequestFullscreen) {
            await containerRef.current.webkitRequestFullscreen();
          } else if (containerRef.current.msRequestFullscreen) {
            await containerRef.current.msRequestFullscreen();
          }
          setIsFullscreen(true);
        }
      } catch (err) {
        console.error('Fullscreen error:', err);
      }
    };

    enterFullscreen();

    // Prevent context menu (right-click)
    const preventContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Prevent copy, cut, paste
    const preventCopy = (e) => {
      if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a')) {
        e.preventDefault();
        return false;
      }
    };

    // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    const preventDevTools = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Prevent tab switching
    const preventTabSwitch = (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        setWarnings(prev => prev + 1);
        return false;
      }
    };

    // Prevent window close
    const preventClose = (e) => {
      if (!result) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your test progress will be lost.';
        setWarnings(prev => prev + 1);
        return e.returnValue;
      }
    };

    // Monitor visibility changes (tab switching)
    const handleVisibilityChange = () => {
      if (document.hidden && !result) {
        setWarnings(prev => prev + 1);
        // Try to refocus
        window.focus();
      }
    };

    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('keydown', preventCopy);
    document.addEventListener('keydown', preventDevTools);
    document.addEventListener('keydown', preventTabSwitch);
    window.addEventListener('beforeunload', preventClose);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Monitor fullscreen changes
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
      
      if (!isCurrentlyFullscreen && !result) {
        setWarnings(prev => prev + 1);
        // Try to re-enter fullscreen
        enterFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('keydown', preventCopy);
      document.removeEventListener('keydown', preventDevTools);
      document.removeEventListener('keydown', preventTabSwitch);
      window.removeEventListener('beforeunload', preventClose);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      
      // Exit fullscreen on cleanup
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, [isOpen, jobId, result]);

  // Fetch questions and setup timer
  useEffect(() => {
    if (!isOpen || !jobId) return;
    setLoading(true);
    setQuestions([]);
    setAnswers({});
    setError(null);
    setResult(null);
    setWarnings(0);

    const fetchQuestions = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/jobs/${jobId}/aptitude-test/questions/public`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to fetch questions');
        const qs = json.data.questions || [];
        setQuestions(qs);
        // Set timer: 1 minute per question
        setTimeLeft(qs.length * 60);
      } catch (err) {
        setError(err.message || 'Failed to fetch questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [isOpen, jobId]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || result || !isOpen || !questions.length) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          // Auto submit when time runs out
          if (!result && questions.length > 0) {
            handleSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, result, isOpen, questions.length]);

  const handleSelect = (questionId, index) => {
    setAnswers(prev => ({ ...prev, [questionId]: index }));
  };

  const handleSubmit = async () => {
    if (!questions.length) return;
    
    // Warn if not all questions answered
    const missing = questions.filter(q => typeof answers[q.id] !== 'number');
    if (missing.length > 0) {
      if (!window.confirm(`You have ${missing.length} unanswered question(s). Submit anyway?`)) {
        return;
      }
    }

    setLoading(true);
    setError(null);
    try {
      // Fix: Use nullish coalescing to handle 0 as a valid answer index
      const payload = { answers: questions.map(q => ({ 
        questionId: q.id, 
        selectedIndex: answers[q.id] !== undefined && answers[q.id] !== null ? answers[q.id] : -1 
      })) };
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}/aptitude-test/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Submission failed');
      setResult({ score: json.data.score, maxScore: json.data.maxScore, passed: json.data.passed });
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (typeof onSubmitted === 'function') onSubmitted();
      
      // Exit fullscreen after result
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    } catch (err) {
      setError(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = questions.filter(q => typeof answers[q.id] === 'number').length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          ref={containerRef}
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          style={{ userSelect: 'none' }}
        >
          {/* Security Warning Banner */}
          {warnings > 0 && !result && (
            <div className="absolute top-0 left-0 right-0 bg-red-600 text-white p-3 text-center font-semibold z-50 flex items-center justify-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Warning: Unauthorized actions detected ({warnings}). Test integrity may be compromised.</span>
            </div>
          )}

          {/* Fullscreen Status */}
          {!isFullscreen && !result && (
            <div className="absolute top-20 left-0 right-0 bg-yellow-600 text-white p-2 text-center text-sm font-medium z-50">
              <Lock className="w-4 h-4 inline mr-2" />
              Please enter fullscreen mode for secure testing
            </div>
          )}

          <div className="h-full flex flex-col">
            {/* Header - Fixed */}
            <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-red-400" />
                  <h2 className="text-xl font-bold text-white">
                    {result ? 'Test Result' : 'Aptitude Test'}
                  </h2>
                </div>
                {!result && (
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span className={`font-mono font-semibold ${timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                    <div className="text-gray-400">
                      Answered: <span className="text-white font-semibold">{answeredCount}/{questions.length}</span>
                    </div>
                  </div>
                )}
              </div>
              {result && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Close
                </button>
              )}
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto bg-gray-900 p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {loading && (
                  <div className="py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    <p className="mt-4 text-gray-300">Loading questions...</p>
                  </div>
                )}
                
                {error && (
                  <div className="p-4 rounded-lg bg-red-900/50 border border-red-700 text-red-200">
                    {error}
                  </div>
                )}

                {!loading && !questions.length && !error && !result && (
                  <div className="py-12 text-center text-gray-400">
                    No questions are available or you are not eligible to take this test.
                  </div>
                )}

                {questions.length > 0 && !result && (
                  <div className="space-y-6">
                    {questions.map((q, idx) => (
                      <motion.div
                        key={q.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-6 rounded-lg bg-gray-800 border border-gray-700 shadow-lg"
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-white text-lg mb-4">{q.questionText}</div>
                            <div className="space-y-3">
                              {Array.isArray(q.options) ? q.options.map((opt, i) => (
                                <label
                                  key={i}
                                  className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer border-2 transition-all ${
                                    answers[q.id] === i
                                      ? 'bg-red-600/20 border-red-500 shadow-lg shadow-red-500/20'
                                      : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`q-${q.id}`}
                                    checked={answers[q.id] === i}
                                    onChange={() => handleSelect(q.id, i)}
                                    className="w-5 h-5 text-red-600 cursor-pointer"
                                  />
                                  <span className={`text-base flex-1 ${answers[q.id] === i ? 'text-white font-medium' : 'text-gray-300'}`}>
                                    {opt}
                                  </span>
                                </label>
                              )) : null}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {result && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-8 rounded-xl border-2 shadow-2xl"
                    style={{
                      backgroundColor: result.passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      borderColor: result.passed ? '#10b981' : '#ef4444'
                    }}
                  >
                    <div className="text-center">
                      <div className={`text-4xl mb-4 ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                        {result.passed ? '✅' : '❌'}
                      </div>
                      <div className={`text-2xl font-bold mb-4 ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                        {result.passed ? 'Test Passed!' : 'Test Failed'}
                      </div>
                      <div className="text-xl text-gray-300 mb-2">
                        Score: <span className="font-bold text-white">{result.score}/{result.maxScore}</span>
                      </div>
                      <div className={`text-lg mt-4 ${result.passed ? 'text-green-300' : 'text-red-300'}`}>
                        {result.passed
                          ? 'Your application status is now PASSED APTITUDE.'
                          : 'Your application status is now FAILED APTITUDE.'}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Footer - Fixed */}
            {!result && questions.length > 0 && (
              <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Progress: {answeredCount} of {questions.length} answered
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || timeLeft === 0}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg"
                  >
                    {loading ? 'Submitting...' : timeLeft === 0 ? 'Time Up!' : 'Submit Test'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StudentTakeTest;
