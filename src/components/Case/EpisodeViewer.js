import React, { useEffect, useState } from 'react';
import { fetchCurrentEpisode, solveEpisode, markCaseCompleted } from '../../api/caseApi';

export default function EpisodeViewer({ caseId, onSolved }) {
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [answer, setAnswer] = useState('');
  const [solved, setSolved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [finalMessage, setFinalMessage] = useState('');
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    loadEpisode();
  }, [caseId]);

  const loadEpisode = async () => {
    setLoading(true);
    try {
      const data = await fetchCurrentEpisode(caseId);
      setEpisode({
        ...data.episode,
        totalEpisodes: data.totalEpisodes
      });
      setAnswer('');
      setFeedback(null);
      setSolved(false);
      setCompleted(false);
    } catch (err) {
      console.error('Greška pri dohvaćanju trenutne epizode:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSolve = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    try {
      const res = await solveEpisode(caseId, episode.episodeNumber, answer);

      if (res.isCorrect) {
        const newCorrect = correctCount + 1;
        setCorrectCount(newCorrect);

        if (episode.episodeNumber === episode.totalEpisodes) {
          await markCaseCompleted(caseId);
          setCompleted(true);
          setFinalMessage(`🎉 Završili ste slučaj! Točno riješeno: ${newCorrect}/${episode.totalEpisodes}.`);
        } else {
          setSolved(true);
          setFeedback({ success: true, message: episode.nextHint || '✅ Točno! Nastavi dalje.' });
        }

      } else if (res.attemptsLeft === 0) {
        let message = `❌ Iscrpljeni pokušaji. Točan odgovor: ${episode.clueAnswer}`;
        if (episode.nextHint) message += `\n💡 Sljedeći trag: ${episode.nextHint}`;

        setFeedback({ success: false, message });
        setSolved(true);

        if (episode.episodeNumber === episode.totalEpisodes) {
          await markCaseCompleted(caseId);
          setCompleted(true);
          setFinalMessage(`🔚 Slučaj završen. Točno riješeno: ${correctCount}/${episode.totalEpisodes}.`);
        }

      } else {
        setFeedback({
          success: false,
          message: res.message || `❌ Netočno. Preostalo pokušaja: ${res.attemptsLeft}`
        });
      }

    } catch (err) {
      console.error('Greška pri provjeri odgovora:', err);

      if (err.response?.status === 400) {
        let message = `❌ Iscrpljeni pokušaji. Sustav ne prihvaća više odgovora.`;
        if (episode.solution) message += ` Točan odgovor: ${episode.solution}`;
        if (episode.nextHint) message += `\n💡 Sljedeći trag: ${episode.nextHint}`;

        setFeedback({ success: false, message });
        setSolved(true);

        if (episode.episodeNumber === episode.totalEpisodes) {
          await markCaseCompleted(caseId);
          setCompleted(true);
          setFinalMessage(`🔚 Slučaj završen. Točno riješeno: ${correctCount}/${episode.totalEpisodes}.`);
        }

      } else {
        setFeedback({
          success: false,
          message: 'Došlo je do greške. Pokušajte ponovno kasnije.'
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200">
        <p className="text-gray-700 text-xl">Epizoda nije pronađena.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-300 max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-700 mb-4">
        Epizoda {episode.episodeNumber} od {episode.totalEpisodes}
      </h3>
      <p className="text-gray-800 mb-4">{episode.sceneText}</p>
      <p className="text-gray-700 font-semibold mb-4">🧩 {episode.cluePrompt}</p>

      {!solved && !completed && (
        <div className="flex gap-4">
          <input
            type="text"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-300 bg-gray-100 text-gray-800"
            placeholder="Upiši svoj odgovor ovdje"
          />
          <button
            onClick={handleSolve}
            disabled={submitting}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-all"
          >
            {submitting ? '...provjera' : 'Potvrdi odgovor'}
          </button>
        </div>
      )}

      {feedback && (
        <div className={`mt-4 p-3 rounded-lg ${feedback.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {feedback.message.split('\n').map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}

      {completed && (
        <div className="mt-6 bg-yellow-100 text-yellow-800 p-4 rounded-lg text-center">
          {finalMessage}
          <button
            onClick={onSolved}
            className="mt-4 bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-all"
          >
            🏠 Povratak na glavni meni
          </button>
        </div>
      )}

      {solved && !completed && (
        <button
          onClick={loadEpisode}
          className="mt-6 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-all w-full"
        >
          🚀 Sljedeća epizoda
        </button>
      )}
    </div>
  );
}
