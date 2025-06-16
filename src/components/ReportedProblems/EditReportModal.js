import React, { useState, useEffect } from 'react';
import { putJSON } from '../../api/apiClient';

const STATUS_OPTIONS = {
  OPEN: 'U obradi',
  INVALID: 'Neuspješna prijava',
  REVIEWED: 'Prijava prihvaćena',
};

const BASE_URL =
    process.env.REACT_APP_API_URL || 'http://localhost:8080';

const API_URL = BASE_URL + '/api/v1';

export default function EditReportModal({ isOpen, onClose, reportData, onSuccess }) {
  const [status, setStatus] = useState('OPEN');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (reportData) {
      setStatus(reportData.status || 'OPEN');
      setNote(reportData.resolutionNote || '');
    }
  }, [reportData]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setFeedback(null);
    try {
      await putJSON(`${API_URL}/task-report/${reportData.taskReportId}`, {
        status,
        resolutionNote: note,
      });
      onSuccess({ status, resolutionNote: note });
      onClose();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: '❌ Greška prilikom spremanja izmjena.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-gray-300 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">💬 Odgovor na prijavu</h2>

        <label className="block text-gray-700 font-medium mb-2">Status prijave:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 mb-4"
          disabled={submitting}
        >
          {Object.entries(STATUS_OPTIONS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <label className="block text-gray-700 font-medium mb-2">Napomena:</label>
        <textarea
          className="w-full h-28 p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
          placeholder="Dodajte komentar ili napomenu..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
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
            {submitting ? 'Spremanje...' : 'Spremi odgovor'}
          </button>
        </div>
      </div>
    </div>
  );
}
