import { useEffect, useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Clock, AlertTriangle, Lock } from "lucide-react";

const MAX_WARNINGS = 2;

const StudentTakeTest = ({ isOpen, onClose, jobId, onSubmitted }) => {
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [warnings, setWarnings] = useState(0);
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  const containerRef = useRef(null);
  const timerRef = useRef(null);

  /* ---------------- HELPERS ---------------- */
  const enterFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
      }
    } catch {}
  };

  const registerViolation = () => {
    if (result) return;

    setWarnings(prev => {
      const next = prev + 1;

      // 🔴 AUTO SUBMIT AFTER 3RD WARNING
      if (next > MAX_WARNINGS) {
        handleSubmit();
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
        e.key === "F12" ||
        (e.ctrlKey && ["c", "v", "x", "u", "a"].includes(e.key))
      ) {
        e.preventDefault();
        registerViolation();
      }
    };

    // TAB SWITCH
    const onVisibilityChange = () => {
      if (document.hidden) registerViolation();
    };

    // MINIMIZE / ALT+TAB
    const onBlur = () => {
      registerViolation();
    };

    // 🔥 ESC FULLSCREEN EXIT
    const onFullscreenChange = () => {
      if (!document.fullscreenElement && !result) {
        registerViolation();
      }
    };

    document.addEventListener("keydown", preventKeys);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);
    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("keydown", preventKeys);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.exitFullscreen?.();
    };
  }, [isOpen, result]);

  /* ---------------- FETCH QUESTIONS ---------------- */
  useEffect(() => {
    if (!isOpen || !jobId) return;

    setLoading(true);
    setError(null);
    setAnswers({});
    setSections([]);
    setWarnings(0);
    setResult(null);

    fetch(
      `http://localhost:5000/api/jobs/${jobId}/aptitude-test/questions/public`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }
    )
      .then(res => res.json())
      .then(json => {
        if (!Array.isArray(json.data?.sections)) {
          throw new Error("Invalid question format");
        }

        setSections(json.data.sections);

        const totalQ = json.data.sections.reduce(
          (sum, s) => sum + s.questions.length,
          0
        );
        setTimeLeft(totalQ * 60);
      })
      .catch(() => setError("Unable to load questions"))
      .finally(() => setLoading(false));
  }, [isOpen, jobId]);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (!timeLeft || result) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft, result]);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (result) return;

    setLoading(true);
    setShowSecurityModal(false);

    const allQuestions = sections.flatMap(s => s.questions);
    const payload = {
      answers: allQuestions.map(q => ({
        questionId: q.id,
        selectedIndex: answers[q.id] ?? -1
      }))
    };

    try {
      const res = await fetch(
        `http://localhost:5000/api/jobs/${jobId}/aptitude-test/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(payload)
        }
      );

      const json = await res.json();
      if (!res.ok) throw new Error();

      setResult(json.data);
      clearInterval(timerRef.current);
      document.exitFullscreen?.();
      onSubmitted?.();
    } catch {
      setError("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = s =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = sections.reduce(
    (sum, s) => sum + s.questions.length,
    0
  );

  if (!isOpen) return null;

  /* ---------------- UI ---------------- */
  return (
    <AnimatePresence>
      <div
        ref={containerRef}
        className="fixed inset-0 z-[9999] bg-gray-100 text-gray-900"
      >
        {/* HEADER */}
        <div className="bg-white border-b px-6 py-4 flex justify-between">
          <div className="flex gap-6 items-center">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              Aptitude Test
            </h2>

            {!result && (
              <>
                <span className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  {formatTime(timeLeft)}
                </span>
                <span className="text-sm text-gray-500">
                  {answeredCount}/{totalQuestions} answered
                </span>
              </>
            )}
          </div>

          {result && (
            <button
              onClick={onClose}
              className="bg-blue-600 px-4 py-2 rounded text-white"
            >
              Close
            </button>
          )}
        </div>

        {/* WARNING BAR */}
        {warnings > 0 && !result && (
          <div className="bg-yellow-100 border-b border-yellow-300 text-yellow-800 text-center py-2 text-sm">
            <AlertTriangle className="inline w-4 h-4 mr-2" />
            Security warnings: {warnings}/{MAX_WARNINGS}
          </div>
        )}

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto h-[calc(100vh-140px)]">
          {loading && <p className="text-center">Loading questions…</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!result &&
            sections.map((section, sIdx) => (
              <div key={sIdx} className="mb-10">
                <h3 className="text-base font-semibold mb-4 border-l-4 border-blue-600 pl-3">
                  Section {sIdx + 1}: {section.title}
                </h3>

                {section.questions.map((q, qIdx) => (
                  <div key={q.id} className="bg-white border rounded p-5 mb-5">
                    <p className="font-medium mb-4">
                      Q{qIdx + 1}. {q.questionText}
                    </p>

                    {q.options.map((opt, i) => (
                      <label
                        key={i}
                        className={`block p-3 border rounded mb-2 cursor-pointer ${
                          answers[q.id] === i
                            ? "border-blue-600 bg-blue-50"
                            : "hover:border-gray-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={answers[q.id] === i}
                          onChange={() =>
                            setAnswers(a => ({ ...a, [q.id]: i }))
                          }
                          className="mr-3"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            ))}
        </div>

        {/* 🔒 SECURITY MODAL */}
        {showSecurityModal && warnings <= MAX_WARNINGS && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[10000]">
            <div className="bg-white rounded-lg shadow-lg w-[420px] p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Security Alert
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                You attempted to leave fullscreen or switch apps.
                <br />
                Warnings remaining: {MAX_WARNINGS - warnings + 1}
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
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Submit Test
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default StudentTakeTest;
