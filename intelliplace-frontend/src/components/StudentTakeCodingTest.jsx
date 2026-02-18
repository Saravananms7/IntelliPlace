import { useEffect, useState, useRef, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle, Lock, Play, CheckCircle, XCircle, Loader } from 'lucide-react';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../config.js';

const JUDGE0_LANGUAGES = {
  C: 50,
  'C++': 54,
  PYTHON: 92,
  JAVA: 91
};

const LANGUAGE_NAMES = {
  50: 'C',
  54: 'C++',
  92: 'Python',
  91: 'Java'
};

const MAX_WARNINGS = 2;

const StudentTakeCodingTest = ({ isOpen, onClose, jobId, onSubmitted }) => {
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [code, setCode] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState({});
  const [submissions, setSubmissions] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [warnings, setWarnings] = useState(0);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState({});
  const [runOutput, setRunOutput] = useState(null);

  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const submittingRef = useRef(false);

  /* ---------------- FULLSCREEN ---------------- */
  const enterFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
      }
    } catch {}
  };

  /* ---------------- VIOLATION HANDLER ---------------- */
  const registerViolation = () => {
    if (submittingRef.current) return;

    setWarnings(prev => {
      const next = prev + 1;

      if (next > MAX_WARNINGS) {
        handleFinalSubmit();
        return next;
      }

      setShowSecurityModal(true);
      return next;
    });
  };

  /* ---------------- SECURITY ---------------- */
  useEffect(() => {
    if (!isOpen) return;

    enterFullscreen();

    const preventKeys = e => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && ['c', 'v', 'x', 'u', 'a'].includes(e.key))
      ) {
        e.preventDefault();
        registerViolation();
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) registerViolation();
    };

    const onBlur = () => {
      registerViolation();
    };

    const onFullscreenChange = () => {
      if (!document.fullscreenElement && !submittingRef.current) {
        registerViolation();
      }
    };

    document.addEventListener('keydown', preventKeys);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', onBlur);
    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => {
      document.removeEventListener('keydown', preventKeys);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.exitFullscreen?.();
    };
  }, [isOpen]);

  /* ---------------- FETCH TEST ---------------- */
  useEffect(() => {
    if (!isOpen || !jobId) return;

    setLoading(true);
    setTestData(null);
    setCode({});
    setSelectedLanguage({});
    setSubmissions({});
    setWarnings(0);
    setSubmitting(false);
    submittingRef.current = false;

    fetch(`${API_BASE_URL}/jobs/${jobId}/coding-test`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(async res => {
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.message || 'Failed to load coding test');
        }
        return json;
      })
      .then(json => {
        if (json.success && json.data) {
          const test = json.data;
          setTestData(test);
          setTimeLeft((test.timeLimit || 60) * 60); // Convert minutes to seconds
          
          // Initialize code and language for each question
          const initialCode = {};
          const initialLanguage = {};
          const allowedLangs = Array.isArray(test.allowedLanguages) 
            ? test.allowedLanguages 
            : (typeof test.allowedLanguages === 'string' ? JSON.parse(test.allowedLanguages) : []);
          
          if (allowedLangs.length > 0 && test.questions && test.questions.length > 0) {
            test.questions.forEach(q => {
              initialCode[q.id] = getDefaultCode(allowedLangs[0]);
              initialLanguage[q.id] = allowedLangs[0];
            });
            setCode(initialCode);
            setSelectedLanguage(initialLanguage);
          }
        } else {
          throw new Error(json.message || 'Invalid test data');
        }
      })
      .catch(err => {
        console.error('Error loading coding test:', err);
        Swal.fire('Error', err.message || 'Failed to load coding test. Make sure the test has been started.', 'error');
        onClose();
      })
      .finally(() => setLoading(false));
  }, [isOpen, jobId]);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (!timeLeft || submittingRef.current) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleFinalSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft]);

  /* ---------------- DEFAULT CODE TEMPLATES ---------------- */
  const getDefaultCode = (languageId) => {
    const templates = {
      50: `#include <stdio.h>

int main() {
    // Your code here
    
    return 0;
}`,
      54: `#include <iostream>
using namespace std;

int main() {
    // Your code here
    
    return 0;
}`,
      92: `# Your code here`,
      91: `public class Solution {
    public static void main(String[] args) {
        // Your code here
    }
}`
    };
    return templates[languageId] || '';
  };

  /* ---------------- RUN CODE (TEST WITH SAMPLE) ---------------- */
  const handleRunCode = async (questionId) => {
    const currentCode = code[questionId];
    const currentLang = selectedLanguage[questionId];
    const question = testData.questions.find(q => q.id === questionId);

    if (!currentCode || !currentCode.trim()) {
      Swal.fire('Error', 'Please write some code first', 'error');
      return;
    }

    if (!question.sampleInput) {
      Swal.fire('Info', 'No sample input available for this question', 'info');
      return;
    }

    setRunning(prev => ({ ...prev, [questionId]: true }));
    setRunOutput(null);

    try {
      const res = await fetch(`${API_BASE_URL}/jobs/${jobId}/coding-test/run-sample`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          questionId,
          languageId: currentLang,
          code: currentCode
        })
      });

      const json = await res.json();

      if (json.success) {
        const result = json.data.results?.[0];
        if (!result) {
          setRunOutput({ status: 'error', title: 'No result', message: 'No result returned from sample run' });
          return;
        }
        if (result.passed) {
          setRunOutput({
            status: 'passed',
            title: 'Sample Test Passed!',
            message: result.actual ?? '(no output)',
            details: result.executionTime != null ? `Execution time: ${result.executionTime}s` : null
          });
        } else {
          const isInternalError = result.status === 'INTERNAL_ERROR';
          const mainMsg = result.error || `Expected: ${result.expected ?? '?'}, Got: ${result.actual ?? '?'}`;
          const details = isInternalError
            ? 'Judge0 encountered an error. This may be temporary—try again. Ensure Judge0 Docker is running.'
            : (result.actual !== undefined && result.actual !== '' ? `Your output: ${result.actual}` : null);
          setRunOutput({
            status: 'failed',
            title: isInternalError ? 'Execution Error' : 'Sample Test Failed',
            message: mainMsg,
            details
          });
        }
      } else {
        setRunOutput({ status: 'error', title: 'Error', message: json.message || 'Failed to run code' });
      }
    } catch (err) {
      console.error(err);
      setRunOutput({ status: 'error', title: 'Error', message: err.message || 'Failed to run code' });
    } finally {
      setRunning(prev => ({ ...prev, [questionId]: false }));
    }
  };

  /* ---------------- SUBMIT CODE FOR QUESTION ---------------- */
  const handleSubmitQuestion = async (questionId) => {
    const currentCode = code[questionId];
    const currentLang = selectedLanguage[questionId];

    if (!currentCode || !currentCode.trim()) {
      Swal.fire('Error', 'Please write some code first', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/jobs/${jobId}/coding-test/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          questionId,
          languageId: currentLang,
          code: currentCode
        })
      });

      const json = await res.json();

      if (json.success) {
        setSubmissions(prev => ({
          ...prev,
          [questionId]: json.data.submission
        }));

        const passedCount = json.data.submission.passedCount;
        const totalCount = json.data.submission.totalCount;

        if (passedCount === totalCount) {
          Swal.fire({
            icon: 'success',
            title: 'All Test Cases Passed!',
            text: `Score: ${json.data.submission.score.toFixed(1)}/${testData.questions.find(q => q.id === questionId).points}`,
            confirmButtonColor: '#2563eb'
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Some Test Cases Failed',
            text: `Passed: ${passedCount}/${totalCount}`,
            confirmButtonColor: '#f59e0b'
          });
        }
      } else {
        Swal.fire('Error', json.message || 'Failed to submit code', 'error');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to submit code', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- FINAL SUBMIT ---------------- */
  const handleFinalSubmit = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    setShowSecurityModal(false);

    // Submit all questions that haven't been submitted yet
    const questionsToSubmit = testData.questions.filter(q => !submissions[q.id]);
    
    for (const question of questionsToSubmit) {
      const currentCode = code[question.id];
      const currentLang = selectedLanguage[question.id];
      
      if (currentCode && currentCode.trim()) {
        try {
          await fetch(`${API_BASE_URL}/jobs/${jobId}/coding-test/submit`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              questionId: question.id,
              languageId: currentLang,
              code: currentCode
            })
          });
        } catch (err) {
          console.error('Error submitting question:', err);
        }
      }
    }

    clearInterval(timerRef.current);
    document.exitFullscreen?.();
    
    Swal.fire({
      icon: 'success',
      title: 'Test Submitted',
      text: 'Your solutions have been submitted',
      confirmButtonColor: '#2563eb'
    }).then(() => {
      onSubmitted?.();
      onClose();
    });
  };

  const formatTime = s => {
    const minutes = Math.floor(s / 60);
    const seconds = s % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const currentQuestion = testData?.questions?.[currentQuestionIndex];
  const currentSubmission = currentQuestion ? submissions[currentQuestion.id] : null;
  const currentCodeValue = currentQuestion ? code[currentQuestion.id] || '' : '';
  const currentLangValue = currentQuestion ? selectedLanguage[currentQuestion.id] : null;
  const allowedLangs = useMemo(() => {
    try {
      const raw = testData?.allowedLanguages;
      return Array.isArray(raw) ? raw : (typeof raw === 'string' ? JSON.parse(raw || '[]') : []);
    } catch {
      return [];
    }
  }, [testData?.allowedLanguages]);
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        ref={containerRef}
        className="fixed inset-0 z-[9999] bg-gray-100 text-gray-900 flex flex-col"
      >
        {/* HEADER */}
        <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div className="flex gap-6 items-center">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              {testData?.title || 'Coding Test'}
            </h2>

            {!submittingRef.current && (
              <>
                <span className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  {formatTime(timeLeft)}
                </span>
                <span className="text-sm text-gray-500">
                  Question {currentQuestionIndex + 1}/{testData?.questions.length || 0}
                </span>
              </>
            )}
          </div>

          {submittingRef.current && (
            <button
              onClick={onClose}
              className="bg-blue-600 px-4 py-2 rounded text-white"
            >
              Close
            </button>
          )}
        </div>

        {/* WARNING BAR */}
        {warnings > 0 && !submittingRef.current && (
          <div className="bg-yellow-100 border-b text-yellow-800 text-center py-2 text-sm">
            <AlertTriangle className="inline w-4 h-4 mr-2" />
            Security warnings: {warnings}/{MAX_WARNINGS}
          </div>
        )}

        {/* CONTENT */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : testData ? (
          <div className="flex-1 flex overflow-hidden">
            {/* LEFT SIDEBAR - QUESTIONS */}
            <div className="w-64 bg-white border-r overflow-y-auto">
              <div className="p-4 space-y-2">
                {testData.questions.map((q, idx) => {
                  const submission = submissions[q.id];
                  const isCurrent = idx === currentQuestionIndex;
                  
                  return (
                    <button
                      key={q.id}
                      onClick={() => { setCurrentQuestionIndex(idx); setRunOutput(null); }}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        isCurrent
                          ? 'bg-blue-50 border-blue-500'
                          : submission
                          ? submission.status === 'ACCEPTED'
                            ? 'bg-green-50 border-green-500'
                            : 'bg-yellow-50 border-yellow-500'
                          : 'bg-white border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          Q{idx + 1}. {q.title}
                        </span>
                        {submission && (
                          submission.status === 'ACCEPTED' ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-yellow-600" />
                          )
                        )}
                      </div>
                      {submission && (
                        <div className="text-xs text-gray-500 mt-1">
                          Score: {submission.score?.toFixed(1)}/{q.points}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {currentQuestion && (
                <>
                  {/* QUESTION DESCRIPTION */}
                  <div className="bg-white border-b p-6 overflow-y-auto max-h-64">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">{currentQuestion.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          currentQuestion.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                          currentQuestion.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {currentQuestion.difficulty}
                        </span>
                        <span className="text-sm text-gray-600">
                          {currentQuestion.points} points
                        </span>
                      </div>
                    </div>
                    
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap text-gray-700 mb-4">
                        {currentQuestion.description}
                      </p>
                      
                      {currentQuestion.constraints && (
                        <div className="bg-gray-50 p-3 rounded mb-4">
                          <strong className="text-sm">Constraints:</strong>
                          <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                            {currentQuestion.constraints}
                          </p>
                        </div>
                      )}
                      
                      {currentQuestion.sampleInput && (
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <strong className="text-sm">Sample Input:</strong>
                            <pre className="bg-gray-50 p-3 rounded mt-1 text-sm font-mono overflow-x-auto">
                              {currentQuestion.sampleInput}
                            </pre>
                          </div>
                          {currentQuestion.sampleOutput && (
                            <div>
                              <strong className="text-sm">Sample Output:</strong>
                              <pre className="bg-gray-50 p-3 rounded mt-1 text-sm font-mono overflow-x-auto">
                                {currentQuestion.sampleOutput}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CODE EDITOR */}
                  <div className="flex-1 flex flex-col bg-gray-50">
                    {/* LANGUAGE SELECTOR */}
                    <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <label className="text-sm font-medium">Language:</label>
                        <select
                          value={currentLangValue || ''}
                          onChange={(e) => {
                            const langId = parseInt(e.target.value);
                            setSelectedLanguage(prev => ({
                              ...prev,
                              [currentQuestion.id]: langId
                            }));
                            setCode(prev => ({
                              ...prev,
                              [currentQuestion.id]: getDefaultCode(langId)
                            }));
                          }}
                          className="px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          disabled={!!currentSubmission}
                        >
                          {allowedLangs.map(langId => (
                            <option key={langId} value={langId}>
                              {LANGUAGE_NAMES[langId]}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {currentSubmission && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            currentSubmission.status === 'ACCEPTED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {currentSubmission.status}
                          </span>
                        )}
                        <button
                          onClick={() => handleRunCode(currentQuestion.id)}
                          disabled={running[currentQuestion.id] || !!currentSubmission}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {running[currentQuestion.id] ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                          Run Sample
                        </button>
                        <button
                          onClick={() => handleSubmitQuestion(currentQuestion.id)}
                          disabled={submitting || !!currentSubmission}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submitting ? 'Submitting...' : 'Submit'}
                        </button>
                      </div>
                    </div>

                    {/* RUN OUTPUT PANEL */}
                    {runOutput && (
                      <div
                        className={`border-t px-4 py-3 ${
                          runOutput.status === 'passed'
                            ? 'bg-green-50 border-green-200'
                            : runOutput.status === 'failed'
                            ? 'bg-amber-50 border-amber-200'
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`font-semibold ${
                              runOutput.status === 'passed'
                                ? 'text-green-800'
                                : runOutput.status === 'failed'
                                ? 'text-amber-800'
                                : 'text-red-800'
                            }`}
                          >
                            {runOutput.title}
                          </span>
                          <button
                            onClick={() => setRunOutput(null)}
                            className="ml-auto text-gray-500 hover:text-gray-700 text-sm"
                          >
                            Dismiss
                          </button>
                        </div>
                        <pre className="text-sm font-mono whitespace-pre-wrap break-words text-gray-800 mt-1">
                          {runOutput.message}
                        </pre>
                        {runOutput.details && (
                          <p className="text-xs text-gray-600 mt-2">{runOutput.details}</p>
                        )}
                      </div>
                    )}

                    {/* CODE EDITOR */}
                    <div className="flex-1 p-4 min-h-0 flex flex-col overflow-hidden">
                      <textarea
                        value={currentCodeValue}
                        onChange={(e) => {
                          setCode(prev => ({
                            ...prev,
                            [currentQuestion.id]: e.target.value
                          }));
                        }}
                        disabled={!!currentSubmission}
                        placeholder="Write your code here..."
                        className="w-full h-full p-4 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        style={{ fontFamily: 'monospace', tabSize: 2 }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : null}

        {/* FOOTER */}
        {!submittingRef.current && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-4 flex justify-between z-[9000]">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min((testData?.questions.length || 1) - 1, prev + 1))}
                disabled={currentQuestionIndex === (testData?.questions.length || 1) - 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <button
              onClick={handleFinalSubmit}
              disabled={submitting}
              className="bg-blue-600 px-8 py-3 rounded text-white font-semibold disabled:opacity-50"
            >
              Submit Test
            </button>
          </div>
        )}

        {/* SECURITY MODAL */}
        {showSecurityModal && warnings <= MAX_WARNINGS && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[10000]">
            <div className="bg-white rounded-lg p-6 w-[420px]">
              <h3 className="font-semibold flex gap-2 mb-3">
                <AlertTriangle className="text-yellow-500" />
                Security Alert
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                You attempted to leave fullscreen.
                <br />
                Warnings left: {MAX_WARNINGS - warnings + 1}
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={async () => {
                    setShowSecurityModal(false);
                    await enterFullscreen();
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Continue Test
                </button>
                <button
                  onClick={handleFinalSubmit}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Submit Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default StudentTakeCodingTest;

