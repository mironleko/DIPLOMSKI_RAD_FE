import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { recordAttempt, recordHint, recordSolution } from '../../api/taskHistoryApi';
import ReportProblemModal from '../ReportProblem/ReportProblemModal';
import { fetchLearningMode } from '../../api/learningMode'; // koristiš svoj novi API helper

export default function TaskView() {
  const { lessonId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const gradeId = state?.gradeId;
  const topicId = state?.topicId;
  const difficulty = state?.difficulty;

  const [taskData, setTaskData] = useState(null);
  const [historyId, setHistoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [attemptResult, setAttemptResult] = useState(null);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const hasLoaded = useRef(false);

  const loadTask = async () => {
    if (!gradeId || !topicId || !lessonId || !difficulty) {
      setError('Nisu poslani svi potrebni parametri.');
      return;
    }

    try {
      setLoading(true);
      const data = await fetchLearningMode({
        gradeId: +gradeId,
        topicId: +topicId,
        lessonId: +lessonId,
        difficulty,
        includeSvg: false,
      });
      setTaskData(data);
      setHistoryId(data.historyId);
      setError(null);
    } catch (err) {
      setError(err.message || 'Greška prilikom dohvaćanja zadatka.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    loadTask();
  }, []);

  useEffect(() => {
    if (attemptResult) {
      const { isCorrect, attemptsUsed } = attemptResult;
      if (isCorrect || attemptsUsed >= 3) {
        setShowSolution(true);
      }
    }
  }, [attemptResult]);

  const handleSubmitAnswer = async () => {
    if (!historyId || !userAnswer.trim()) return;

    try {
      const res = await recordAttempt(historyId, userAnswer.trim());
      setAttemptResult(res);
    } catch (e) {
      console.error('Greška kod slanja odgovora:', e);
    }
  };

  const handleHintReveal = async () => {
    if (!showHints && historyId) {
      try {
        await recordHint(historyId);
      } catch (e) {
        console.error('Greška kod bilježenja hinta:', e);
      }
    }
    setShowHints(true);
  };

  const handleShowSolution = async () => {
    if (!showSolution && historyId) {
      try {
        await recordSolution(historyId);
      } catch (e) {
        console.error('Greška kod bilježenja rješenja:', e);
      }
    }
    setShowSolution(true);
  };

  const handleProblemReported = () => {
    setIsReportModalOpen(false);
    setShowHints(true);
    setShowSolution(true);
    setAttemptResult((prev) => ({
      ...prev,
      isCorrect: false,
      attemptsUsed: 3,
      reported: true,
    }));
  };

  const inputDisabled =
    showSolution ||
    (attemptResult &&
      (attemptResult.isCorrect || attemptResult.attemptsUsed >= 3 || attemptResult.reported));

  const reportDisabled = attemptResult?.reported === true;

  if (!taskData && !loading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200">
        <div className="text-center space-y-4">
          <p className="text-lg text-gray-600">Zadatak još nije učitan.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200">
        <div className="alert alert-error shadow-md max-w-md bg-red-100 border-red-500 text-red-800">
          <span>{error}</span>
          <button
            onClick={loadTask}
            className="btn btn-ghost mt-4 bg-white border border-gray-300 text-gray-700 hover:bg-blue-100"
          >
            Pokušaj ponovo
          </button>
        </div>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-green-100 to-blue-200 relative">
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 bg-white border border-gray-300 text-gray-700 hover:bg-blue-100 shadow-lg rounded-full p-4 text-3xl z-50 transition-all duration-200 ease-in-out transform hover:scale-110"
        title="Natrag na Glavni Meni"
      >
        ⬅️
      </button>

      <div className="max-w-3xl mx-auto">
        <div className="card bg-white shadow-lg rounded-2xl border border-gray-300">
          <div className="card-body space-y-6">
            <h2 className="text-3xl font-bold text-gray-700">📝 Zadatak</h2>
            <p className="text-gray-600">{taskData.question}</p>

            <div className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-inner">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">✍️ Unesi svoj odgovor</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <input
                  type="text"
                  className="w-full sm:w-64 text-center py-2 px-4 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100 disabled:text-gray-400"
                  placeholder="Upiši svoj odgovor ovdje..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={inputDisabled}
                />
                <button
                  className="px-6 py-2 rounded-xl shadow-md bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 disabled:opacity-50"
                  onClick={handleSubmitAnswer}
                  disabled={inputDisabled || !userAnswer.trim()}
                >
                  ✅ Predaj odgovor
                </button>
              </div>

              {attemptResult && (
                <div
                  className={`mt-4 p-3 rounded-md text-sm border ${
                    attemptResult.reported
                      ? 'bg-gray-100 text-gray-600 border-gray-300'
                      : attemptResult.isCorrect
                      ? 'bg-green-100 text-green-800 border-green-300'
                      : attemptResult.attemptsUsed >= 3
                      ? 'bg-red-100 text-red-800 border-red-300'
                      : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                  }`}
                >
                  {attemptResult.reported
                    ? '🛠️ Prijavili ste problem. Zadaci su zaključani.'
                    : attemptResult.isCorrect
                    ? '✅ Točno! Bravo!'
                    : attemptResult.attemptsUsed >= 3
                    ? '❌ Iskoristio si sve pokušaje. Pogledaj rješenje dolje.'
                    : `❌ Netočno. Preostalo pokušaja: ${3 - attemptResult.attemptsUsed}`}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                onClick={handleHintReveal}
                disabled={showHints}
                className="btn btn-ghost flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-blue-100 disabled:opacity-50"
              >
                {showHints ? 'Hintovi prikazani' : 'Pokaži hintove'}
              </button>
              <button
                onClick={handleShowSolution}
                disabled={showSolution}
                className="btn btn-ghost flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-blue-100"
              >
                {showSolution ? 'Rješenje prikazano' : 'Pokaži rješenje'}
              </button>
              <button
                onClick={() => setIsReportModalOpen(true)}
                disabled={reportDisabled}
                className="btn btn-ghost flex-1 bg-white border border-gray-300 text-red-600 hover:bg-red-100 disabled:opacity-50"
              >
                {reportDisabled ? '🛠️ Prijava poslana' : '🛠️ Prijavi problem'}
              </button>
            </div>

            {showHints && (
              <div className="p-4 bg-yellow-100 rounded-lg border border-yellow-300 mt-4">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">💡 Hintovi</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {[...taskData.hints]
                    .sort((a, b) => a.orderIdx - b.orderIdx)
                    .map((hint) => (
                      <li key={hint.hintId}>{hint.hintText}</li>
                    ))}
                </ul>
              </div>
            )}

            {showSolution && (
              <div className="p-4 bg-green-100 rounded-lg border border-green-300 mt-4">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">✅ Rješenje</h3>
                <p className="text-gray-600 whitespace-pre-line">{taskData.explanation}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ReportProblemModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onReportSuccess={handleProblemReported}
        historyId={historyId}
      />
    </div>
  );
}
