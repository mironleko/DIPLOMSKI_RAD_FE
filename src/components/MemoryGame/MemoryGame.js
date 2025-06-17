import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { postJSON, putJSON } from '../../api/apiClient';


const BASE_URL =
    process.env.REACT_APP_API_URL || 'http://localhost:8080';

const API_URL = BASE_URL + '/api/v1';

export default function MemoryGame() {
  const navigate = useNavigate();

  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const [pairs, setPairs] = useState([]);
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [lockBoard, setLockBoard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [memoryGameHistoryId, setMemoryGameHistoryId] = useState(null);
  const [attemptCount, setAttemptCount] = useState(0);

  const hasLoaded = useRef(false);

  const shuffle = list => {
    const arr = [...list];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const resetGame = async () => {
    setLoading(true);
    setLockBoard(false);
    setFlippedIndices([]);
    setAttemptCount(0);

    try {
      const data = await postJSON(`${API_URL}/memory-game/generate-tasks`);
      setRows(data.rows);
      setCols(data.cols);
      setPairs(data.pairs);
      setMemoryGameHistoryId(data.memoryGameHistoryId);

      const cardList = shuffle(
        data.pairs.flatMap(p => [
          {
            cardId: `${p.pairId}-expr`,
            pairId: p.pairId,
            content: p.expression,
            isFlipped: false,
            isMatched: false,
          },
          {
            cardId: `${p.pairId}-ans`,
            pairId: p.pairId,
            content: p.answer,
            isFlipped: false,
            isMatched: false,
          },
        ])
      );

      setCards(cardList);
    } catch (err) {
      console.error('Error loading game data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    resetGame();
  }, []);

  const finishGame = async () => {
    try {
      await putJSON(`${API_URL}/memory-game/history/${memoryGameHistoryId}/finish`, {
        attempts: attemptCount,
      });
      console.log('✅ Game finished and saved');
    } catch (err) {
      console.error('❌ Error finishing game:', err);
    }
  };

  useEffect(() => {
    const allMatched = cards.length > 0 && cards.every(card => card.isMatched);
    if (allMatched && memoryGameHistoryId) {
      finishGame();
    }
  }, [cards, memoryGameHistoryId]);

  const handleClick = idx => {
    if (lockBoard || loading) return;
    const newCards = [...cards];
    const card = newCards[idx];
    if (card.isFlipped || card.isMatched) return;

    card.isFlipped = true;
    const newFlipped = [...flippedIndices, idx];
    setCards(newCards);
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setAttemptCount(prev => prev + 1);

      const [i1, i2] = newFlipped;

      if (newCards[i1].pairId === newCards[i2].pairId) {
        newCards[i1].isMatched = true;
        newCards[i2].isMatched = true;
        setCards(newCards);
        setFlippedIndices([]);
      } else {
        setLockBoard(true);
        setTimeout(() => {
          newCards[i1].isFlipped = false;
          newCards[i2].isFlipped = false;
          setCards(newCards);
          setFlippedIndices([]);
          setLockBoard(false);
        }, 1000);
      }
    }
  };

  const btnClass =
    'bg-white border border-gray-300 text-gray-700 hover:bg-blue-100 shadow-lg rounded-full py-3 px-6 text-lg font-semibold transition-all duration-200 ease-in-out transform hover:scale-105';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
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

      <div className="max-w-2xl mx-auto text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🎴 Memory Game: {rows}×{cols} Math Pairs 🎴
        </h2>
        <p className="text-lg text-gray-700 mb-4">
          🔢 Pokušaji: <strong>{attemptCount}</strong>
        </p>
        <div className="flex justify-center space-x-4 mb-4">
          <button onClick={resetGame} className={btnClass} disabled={loading}>
            {loading ? (
              <span className="loading loading-spinner text-blue-600"></span>
            ) : (
              '🔄 Reset Game'
            )}
          </button>
        </div>
      </div>

      <div
        className="grid gap-4 max-w-2xl mx-auto"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {cards.map((card, idx) => {
          const isFlipped = card.isFlipped || card.isMatched;
          return (
            <div
              key={card.cardId}
              onClick={() => handleClick(idx)}
              className="relative w-full h-32 cursor-pointer perspective"
            >
              <div
                className={`relative w-full h-full rounded-lg shadow-lg transition-all duration-300 ${
                  isFlipped ? 'scale-105' : ''
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transition: 'transform 0.6s',
                }}
              >
                <div
                  className="absolute inset-0 bg-purple-300 rounded-lg flex items-center justify-center border border-gray-200"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <span className="text-4xl text-purple-800">?</span>
                </div>

                <div
                  className={`absolute inset-0 rounded-lg flex items-center justify-center border border-gray-200 ${
                    card.isMatched ? 'bg-green-400' : 'bg-purple-200'
                  }`}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    padding: '0.5rem',
                    overflow: 'hidden',
                    textAlign: 'center',
                  }}
                >
                <span
                  className="font-bold text-gray-800 text-center"
                  style={{
                    fontSize:
                      card.content.length > 50
                        ? '0.65rem'
                        : card.content.length > 40
                        ? '0.75rem'
                        : card.content.length > 30
                        ? '0.85rem'
                        : '1rem',
                    lineHeight: '1.4',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                    padding: '6px',
                    display: 'block',
                  }}
                >
                  {card.content}
                </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
