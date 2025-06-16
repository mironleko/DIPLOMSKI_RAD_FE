import React, { useEffect, useState } from 'react';
import { getJSON } from '../../api/apiClient';
import { useNavigate, useParams } from 'react-router-dom';

export default function MemoryGameHistoryDetailsPage() {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { historyId } = useParams();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getJSON(`/api/v1/memory-game/history/${historyId}`);
        setGameData(data);
      } catch (err) {
        console.error('Error fetching game details:', err);
        setError('An error occurred while fetching the memory game details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [historyId]);

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
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200 flex flex-col items-center justify-center">
        <p className="text-red-600 text-lg">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
        >
          ⬅️ Back to Home
        </button>
      </div>
    );
  }

  const { rows, cols, pairs } = gameData;

  // Create a color map for pair IDs
  const pairColorMap = {};
  pairs.forEach((pair, index) => {
    pairColorMap[pair.pairId] = `pair-color-${(index % 10) + 1}`;
  });

  // Generate cards array
  const cards = pairs.flatMap((pair) => [
    {
      cardId: `${pair.pairId}-expr`,
      pairId: pair.pairId,
      content: pair.expression,
    },
    {
      cardId: `${pair.pairId}-ans`,
      pairId: pair.pairId,
      content: pair.answer,
    },
  ]);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-green-100 to-blue-200 relative">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 bg-white border border-gray-300 text-gray-700 hover:bg-blue-100 shadow-lg rounded-full p-4 text-2xl z-50 transition-all duration-200 ease-in-out transform hover:scale-110"
        title="Back"
      >
        ⬅️
      </button>

      <div className="max-w-2xl mx-auto text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🎴 Memory Game Details #{historyId}
        </h2>
        <p className="text-lg text-gray-700">
          📐 Dimensions: {rows} × {cols}
        </p>
        <p className="text-md text-gray-600 mt-2">
          🧮 Number of Pairs: {pairs.length}
        </p>
      </div>

      <div
        className="grid gap-4 max-w-2xl mx-auto"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {cards.map((card) => (
          <div
            key={card.cardId}
            className={`w-full h-28 border border-gray-300 rounded-lg shadow flex items-center justify-center text-lg font-bold text-gray-800 ${pairColorMap[card.pairId]}`}
          >
            {card.content}
          </div>
        ))}
      </div>

      {pairs.length > 0 && (
        <div className="max-w-3xl mx-auto mt-12 bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            📋 Overview of All Pairs
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pairs
              .sort((a, b) => a.pairId - b.pairId)
              .map((pair, idx) => (
                <div
                  key={idx}
                  className={`border border-gray-200 rounded-lg p-4 shadow-sm ${pairColorMap[pair.pairId]}`}
                >
                  <div className="text-sm text-gray-600 mb-1">🆔 Pair #{pair.pairId}</div>
                  <div className="text-md font-semibold text-gray-800">
                    🧮 {pair.expression}
                  </div>
                  <div className="text-md text-green-700 mt-1">
                    ✅ {pair.answer}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
