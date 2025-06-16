import React, { useEffect, useState, useRef } from 'react';
import { getJSON } from '../../api/apiClient';
import { useNavigate } from 'react-router-dom';

const BASE_URL =
    process.env.REACT_APP_API_URL || 'http://localhost:8080';

const API_URL = BASE_URL + '/api/v1';

export default function MemoryGameHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const fetchHistory = async () => {
      try {
        const data = await getJSON(`${API_URL}/memory-game/history`);
        setHistory(data);
      } catch (err) {
        console.error('Greška pri dohvaćanju povijesti:', err);
        setError('Greška prilikom dohvaćanja povijesti Memory igre.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-green-100 to-blue-200 relative">
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 bg-white border border-gray-300 text-gray-700 hover:bg-blue-100 shadow-lg rounded-full p-4 text-2xl z-50 transition-all duration-200 ease-in-out transform hover:scale-110"
        title="Natrag na glavni meni"
      >
        ⬅️
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        🧠 Povijest Memory Game pokušaja
      </h1>

      {error ? (
        <div className="text-center text-red-600 mb-6">
          {error}
          <div className="mt-4">
            <button
              onClick={() => window.location.reload()}
              className="btn bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
            >
              🔁 Pokušaj ponovo
            </button>
          </div>
        </div>
      ) : loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 max-w-4xl mx-auto">
          {history.map((item, index) => (
            <div
              key={item.memoryGameHistoryId}
              onClick={() => navigate(`/memory-game-history/${item.memoryGameHistoryId}`)}
              className="p-6 bg-white rounded-xl border border-gray-300 shadow hover:shadow-md cursor-pointer transition-all"
            >
              <div className="text-gray-800 text-lg font-semibold">
                🔢 Igra #{index + 1} · {item.rows}×{item.cols}
              </div>
              <div className="text-sm text-gray-700 mb-1">
                🧠 Pokušaji: {item.attempts ?? '–'}
              </div>
              <div className="text-sm text-gray-600">
                🕒 Početak: {item.startedAt?.replace('T', ' ').slice(0, 19)} <br />
                🏁 Završen: {item.finishedAt ? item.finishedAt.replace('T', ' ').slice(0, 19) : '❌ Nedovršeno'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
