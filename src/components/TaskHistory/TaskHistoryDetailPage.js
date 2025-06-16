import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTaskHistoryById } from '../../api/taskHistoryApi';
import { BsCheckCircle, BsXCircle } from 'react-icons/bs';

export default function TaskHistoryDetailPage() {
  const { historyId } = useParams();
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState(null);
  const [error, setError] = useState(null);

  const fetchDetails = async () => {
    try {
      const data = await getTaskHistoryById(historyId);
      setTaskData(data);
    } catch (e) {
      setError('Greška prilikom dohvaćanja podataka.');
    }
  };

  if (!taskData && !error) {
    fetchDetails();
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 font-semibold mb-4">{error}</p>
        <button
          onClick={fetchDetails}
          className="btn bg-blue-500 text-white hover:bg-blue-600"
        >
          Pokušaj ponovo
        </button>
      </div>
    );
  }

  if (!taskData) return null;

  const { task, solved, usedHint, shownSolution, attempts } = taskData;
  const {
    gradeName,
    topicName,
    lessonName,
    question,
    explanation,
    hints,
    svgCode,
    correctAnswer,
  } = task;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200 p-6 relative">
      {/* Gumb za natrag gore lijevo */}
      <button
        onClick={() => navigate('/task-history')}
        className="fixed top-4 left-4 bg-white border border-gray-300 text-gray-700 hover:bg-blue-100 shadow-lg rounded-full p-4 text-2xl z-50 transition-all duration-200 ease-in-out transform hover:scale-110"
        title="Natrag na Povijest"
      >
        ⬅️
      </button>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">📘 Detalji zadatka</h1>

        <div className="text-sm text-gray-500 mb-4 space-y-1">
          <p><strong>Razred:</strong> {gradeName}</p>
          <p><strong>Tema:</strong> {topicName}</p>
          <p><strong>Lekcija:</strong> {lessonName}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-blue-700 mb-2">🧠 Zadatak</h2>
          <p className="text-gray-700">{question}</p>
          {svgCode && (
            <div
              className="mt-4 p-2 bg-blue-50 border rounded"
              dangerouslySetInnerHTML={{ __html: svgCode }}
            />
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-yellow-600 mb-2">💡 Hintovi</h2>
          {hints.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {hints
                .sort((a, b) => a.orderIdx - b.orderIdx)
                .map((hint) => (
                  <li key={hint.hintId}>{hint.hintText}</li>
                ))}
            </ul>
          ) : (
            <p className="text-gray-500">Nema dostupnih hintova za ovaj zadatak.</p>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-purple-700 mb-2">📝 Pokušaji</h2>
          <ul className="space-y-2">
            {attempts.map((a) => (
              <li key={a.taskAttemptId} className="flex items-center gap-2 text-sm">
                <span className="text-gray-700 font-medium">Pokušaj {a.attemptNumber}:</span>
                <span className="text-gray-800 italic">"{a.answerText}"</span>
                {a.isCorrect ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <BsCheckCircle /> Točno
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center gap-1">
                    <BsXCircle /> Netočno
                  </span>
                )}
              </li>
            ))}
            {attempts.length === 0 && <p className="text-gray-500">Nema pokušaja.</p>}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-green-700 mb-2">📖 Rješenje</h2>
          {explanation ? (
            <pre className="whitespace-pre-wrap bg-green-100 border border-green-300 rounded p-4 text-sm text-gray-800">
              {explanation}
            </pre>
          ) : (
            <p className="text-gray-500">Nema dodatnog objašnjenja.</p>
          )}
        </div>

        <div className="mt-8 bg-gray-50 border border-gray-300 rounded-lg p-4 text-sm text-gray-800 shadow-inner">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">📊 Status zadatka</h3>
          <ul className="space-y-2">
            <li className="flex items-center justify-between">
              <span>Točno riješeno:</span>
              <span className={solved ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                {solved ? 'Da ✅' : 'Ne ❌'}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>Hint korišten:</span>
              <span className={usedHint ? 'text-yellow-600 font-medium' : 'text-gray-500'}>
                {usedHint ? 'Da 💡' : 'Ne'}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>Rješenje prikazano:</span>
              <span className={shownSolution ? 'text-blue-600 font-medium' : 'text-gray-500'}>
                {shownSolution ? 'Da 📘' : 'Ne'}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>Točan odgovor:</span>
              <span className="text-gray-700 font-semibold">{correctAnswer}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
