import React, { useEffect, useState } from 'react';
import { fetchSubjects, fetchTopics, createCase } from '../../api/caseApi';
import { useNavigate } from 'react-router-dom';

export default function CaseCreateForm({ onCreated }) {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [subjectId, setSubject] = useState('');
  const [topicIds, setTopicIds] = useState([]);

  useEffect(() => {
    Promise.all([fetchSubjects(), fetchTopics()])
      .then(([subs, tops]) => {
        setSubjects(subs);
        setTopics(tops);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (submitting) {
      const preventExit = e => {
        e.preventDefault();
        e.returnValue = '';
      };
      window.addEventListener('beforeunload', preventExit);
      return () => window.removeEventListener('beforeunload', preventExit);
    }
  }, [submitting]);

  const toggleTopic = id => {
    setTopicIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      } else if (prev.length < 3) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (topicIds.length !== 3) {
      alert('⚠️ Molimo odaberite točno 3 matematičke teme.');
      return;
    }
    setSubmitting(true);
    try {
      const newCase = await createCase({ title, subjectId, topicIds });
      onCreated(newCase);
    } catch (err) {
      console.error("Error creating case:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-100 to-blue-200 p-8">
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 bg-white border border-gray-300 text-gray-700 hover:bg-blue-100 shadow-lg rounded-full p-4 text-2xl z-50 transition-all duration-200 ease-in-out transform hover:scale-110"
        title="Natrag na glavni meni"
      >
        ⬅️
      </button>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg space-y-6 border border-gray-300"
      >
        <h2 className="text-3xl font-bold text-gray-700 mb-4">📝 Stvori novi slučaj</h2>

        {/* Naslov */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Naslov:</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-300 bg-gray-100 text-gray-800 placeholder-gray-500"
            placeholder="Unesi naslov slučaja"
          />
        </div>

        {/* Predmet */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Predmet:</label>
          <select
            value={subjectId}
            onChange={e => setSubject(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-300 bg-gray-100 text-gray-800"
          >
            <option value="">— odaberi —</option>
            {subjects.map(s => (
              <option key={s.subjectId} value={s.subjectId}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Teme */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Matematičke teme (točno 3):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topics.map(t => {
              const checked = topicIds.includes(t.topicId);
              const disabled = !checked && topicIds.length >= 3;

              return (
                <label
                  key={t.topicId}
                  className={`flex items-start sm:items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer select-none min-h-12 ${
                    checked
                      ? 'bg-blue-100 border-blue-400'
                      : 'bg-gray-50 border-gray-300 hover:bg-blue-50'
                  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !disabled && toggleTopic(t.topicId)}
                >
                  <div
                    className={`mt-1 w-5 h-5 flex-shrink-0 rounded-sm flex items-center justify-center border transition-all duration-200 ease-in-out ${
                      checked ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400'
                    }`}
                  >
                    {checked && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-gray-800 font-medium break-words">{t.name}</span>
                </label>
              );
            })}
          </div>
          <p
            className={`mt-2 text-sm font-medium ${
              topicIds.length === 3 ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {topicIds.length === 3
              ? '✅ Točno 3 teme odabrane.'
              : `Odabrano: ${topicIds.length} / 3`}
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="bg-white border border-gray-300 text-gray-700 hover:bg-blue-100 shadow-lg rounded-full py-3 px-6 text-lg font-semibold transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50"
        >
          🚀 Generiraj priču
        </button>
      </form>

      {/* Fullscreen loader kada je submitting */}
        {submitting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200 pointer-events-auto">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
    </div>
  );
}
