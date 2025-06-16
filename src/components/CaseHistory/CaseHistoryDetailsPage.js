import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserCaseHistoryDetails } from '../../api/caseHistoryApi';
import { BsCheckCircle, BsXCircle } from 'react-icons/bs';

export default function CaseHistoryDetailsPage() {
  const { caseHistoryId } = useParams();
  const navigate = useNavigate();
  const [caseDetails, setCaseDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const data = await getUserCaseHistoryDetails(caseHistoryId);
        setCaseDetails(data);
      } catch (err) {
        console.error(err);
        setError('Greška prilikom dohvaćanja detalja slučaja.');
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [caseHistoryId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 font-semibold mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn bg-blue-500 text-white hover:bg-blue-600"
        >
          🔁 Pokušaj ponovo
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200 p-6 relative">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 bg-white border border-gray-300 text-gray-700 hover:bg-blue-100 shadow-lg rounded-full p-4 text-2xl z-50 transition-all"
        title="Natrag"
      >
        ⬅️
      </button>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">🕵️‍♂️ Detalji slučaja: {caseDetails.title}</h1>

        <div className="text-sm text-gray-600 mb-4 space-y-1">
          <p><strong>Predmet:</strong> {caseDetails.subject.name}</p>
          <p><strong>Bodovi:</strong> {caseDetails.score ?? 'N/A'}</p>
          <p><strong>Početak:</strong> {new Date(caseDetails.startedAt).toLocaleString('hr-HR')}</p>
          <p><strong>Završetak:</strong> {caseDetails.finishedAt ? new Date(caseDetails.finishedAt).toLocaleString('hr-HR') : 'U tijeku'}</p>
        </div>

        <div className="mt-6 space-y-6">
          {caseDetails.episodeHistories.map((history) => {
            const ep = history.episode;

            return (
              <div
                key={history.episodeHistoryId}
                className="p-6 bg-blue-50 border-l-4 border-blue-400 rounded-xl shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-bold text-gray-800">
                    📺 Epizoda {ep.episodeNumber}
                  </h2>
                  {history.solved ? (
                    <span className="text-green-600 font-medium flex items-center gap-1">
                      <BsCheckCircle /> Riješena
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium flex items-center gap-1">
                      <BsXCircle /> Nije riješena
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-500 mb-2">
                  ⏱️ {new Date(history.episodeStartedAt).toLocaleString('hr-HR')} —{' '}
                  {new Date(history.episodeFinishedAt).toLocaleString('hr-HR')}
                </p>

                <div className="mt-4 space-y-3">
                  <div>
                    <h3 className="text-md font-semibold text-blue-800 mb-1">🌍 Scena</h3>
                    <p className="text-gray-800 text-sm">{ep.sceneText}</p>
                  </div>

                  <div>
                    <h3 className="text-md font-semibold text-indigo-800 mb-1">🕵️‍♂️ Pitanje</h3>
                    <p className="text-gray-800 text-sm">{ep.cluePrompt}</p>
                  </div>

                  <div>
                    <h3 className="text-md font-semibold text-green-700 mb-1">✅ Točan odgovor</h3>
                    <p className="text-gray-900 font-mono text-base">{ep.clueAnswer}</p>
                  </div>

                  <div>
                    <h3 className="text-md font-semibold text-pink-700 mb-2">📄 Pokušaji učenika</h3>
                    {history.attempts.length > 0 ? (
                      <ul className="space-y-3">
                        {history.attempts.map((a, i) => (
                          <li
                            key={a.episodeAttemptId + '-' + i}
                            className={`border rounded-lg p-4 shadow-sm ${
                              a.correct
                                ? 'bg-green-50 border-green-300'
                                : 'bg-red-50 border-red-300'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold text-gray-800">Pokušaj {i + 1}</span>
                              <span
                                className={`text-sm font-semibold flex items-center gap-1 ${
                                  a.correct ? 'text-green-700' : 'text-red-700'
                                }`}
                              >
                                {a.correct ? <BsCheckCircle /> : <BsXCircle />}
                                {a.correct ? 'Točno' : 'Netočno'}
                              </span>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-md px-4 py-3">
                              <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium text-gray-700">Vrijeme:</span>{' '}
                                {new Date(a.attemptedAt).toLocaleString('hr-HR')}
                              </p>
                              <p className="text-base text-blue-800 font-semibold italic">
                                Odgovor: "{a.providedAnswer}"
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">Nema pokušaja za ovu epizodu.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-md font-semibold text-yellow-600 mb-1">💡 Sljedeći hint</h3>
                    <p className="text-sm text-gray-700">{ep.nextHint}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
