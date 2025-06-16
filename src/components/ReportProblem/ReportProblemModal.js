import React, { useState } from 'react';
import { postJSON } from '../../api/apiClient';

export default function ReportProblemModal({ isOpen, onClose, historyId, onReportSuccess }) {
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async () => {
    if (!description.trim()) {
      setFeedback({ type: 'error', message: 'Molimo unesite opis problema.' });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        taskHistoryId: historyId,
        description: description.trim(),
      };
      await postJSON('/api/v1/task-report', payload);
      onReportSuccess(); // 🔥 triggeraj zaključavanje i zatvori modal
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message || '❌ Greška prilikom slanja prijave.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-gray-300 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🛠️ Prijavi problem sa zadatkom</h2>

        <label htmlFor="problem-description" className="block text-gray-700 font-medium mb-2">
          Opišite problem koji ste uočili:
        </label>
        <textarea
          id="problem-description"
          className="w-full h-32 p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100 disabled:text-gray-400 resize-none"
          placeholder="Unesite opis problema ovdje..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={submitting}
        />

        {feedback && (
          <div
            className={`mt-3 text-sm font-medium ${
              feedback.type === 'success'
                ? 'text-green-700 bg-green-100 border border-green-300 rounded-md p-2'
                : 'text-red-700 bg-red-100 border border-red-300 rounded-md p-2'
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition disabled:opacity-50"
            disabled={submitting}
          >
            Zatvori
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? 'Šalje se...' : 'Pošalji prijavu'}
          </button>
        </div>
      </div>
    </div>
  );
}
