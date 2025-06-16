import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJSON } from '../../api/apiClient';
import { getCurrentUser } from '../../api/userApi';
import EditReportModal from './EditReportModal'; // Adjust path as needed

const BASE_URL =
    process.env.REACT_APP_API_URL || 'http://localhost:8080';

const API_URL = BASE_URL + '/api/v1';

export default function ReportedProblemDetails() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both report and user data
        const [reportData, userData] = await Promise.all([
          getJSON(`${API_URL}/task-report/${reportId}`),
          getCurrentUser()
        ]);
        setReport(reportData);
        setUser(userData);
      } catch (err) {
        setError('Greška prilikom dohvaćanja detalja prijave.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reportId]);

  const handleModalSuccess = (updatedData) => {
    // Update the report with new data
    setReport(prev => ({
      ...prev,
      status: updatedData.status,
      resolutionNote: updatedData.resolutionNote,
      resolvedAt: updatedData.status !== 'OPEN' ? new Date().toISOString() : null
    }));
  };

  if (loading || error || !report) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-green-100 to-blue-200 flex items-center justify-center">
        {loading ? (
            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        ) : error ? (
          <p className="text-red-600 text-lg">{error}</p>
        ) : (
          <p className="text-gray-700 text-lg">Prijava nije pronađena.</p>
        )}
      </div>
    );
  }

  const { task, description, status, createdAt, resolvedAt, resolutionNote } = report;
  const isTeacher = user?.role === 'TEACHER';

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-green-100 to-blue-200 relative">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 bg-white border border-gray-300 text-gray-700 hover:bg-blue-100 shadow-lg rounded-full p-4 text-2xl z-50 transition-all duration-200 ease-in-out transform hover:scale-110"
        title="Natrag"
      >
        ⬅️
      </button>

      {/* Teacher Response Button */}
      {isTeacher && (
        <button
          onClick={() => status === 'OPEN' && setIsModalOpen(true)}
          className={`fixed top-4 right-4 shadow-lg rounded-full px-6 py-3 text-lg z-50 transition-all duration-200 ease-in-out transform font-medium ${
            status === 'OPEN'
              ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          title={status === 'OPEN' ? 'Odgovoriti na prijavu' : 'Prijava je već riješena'}
          disabled={status !== 'OPEN'}
        >
          📝 Riješiti prijavu
        </button>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="card bg-white shadow-lg rounded-2xl border border-gray-300">
          <div className="card-body space-y-6">
            <h2 className="text-3xl font-bold text-gray-700">🛠️ Prijava problema</h2>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
              <p className="text-gray-800"><strong>ID prijave:</strong> {report.taskReportId}</p>
              <p className="text-gray-800"><strong>Status:</strong>{' '}
                <span className={`inline-block px-2 py-1 text-sm font-medium rounded-full ${
                  status === 'REVIEWED'
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : status === 'INVALID'
                    ? 'bg-red-100 text-red-700 border border-red-300'
                    : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                }`}>
                  {status === 'REVIEWED' ? 'Prijava prihvaćena' : 
                   status === 'INVALID' ? 'Neuspješna prijava' : 'U obradi'}
                </span>
              </p>
              <p className="text-gray-800"><strong>Prijavljeno:</strong> {new Date(createdAt).toLocaleString('hr-HR')}</p>
              <p className="text-gray-800"><strong>Riješeno:</strong> {resolvedAt ? new Date(resolvedAt).toLocaleString('hr-HR') : '-'}</p>
              <p className="text-gray-800"><strong>Napomena:</strong> {resolutionNote || '-'}</p>
            </div>

            <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">📋 Opis problema</h3>
              <p className="text-gray-700">{description}</p>
            </div>

            {task && (
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-gray-800">📘 Detalji zadatka</h3>

                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
                  <p className="text-gray-800"><strong>Razred:</strong> {task.gradeName}</p>
                  <p className="text-gray-800"><strong>Tema:</strong> {task.topicName}</p>
                  <p className="text-gray-800"><strong>Lekcija:</strong> {task.lessonName}</p>
                  <p className="text-gray-800"><strong>Pitanje:</strong> {task.question}</p>
                </div>

                {task.svgCode && (
                  <div className="p-4 rounded-xl bg-blue-100 border border-blue-300">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">📐 Ilustracija</h4>
                    <div
                      className="overflow-auto bg-white p-4 rounded border border-gray-300"
                      dangerouslySetInnerHTML={{ __html: task.svgCode }}
                    />
                  </div>
                )}

                {task.hints?.length > 0 && (
                  <div className="p-4 bg-yellow-100 rounded-lg border border-yellow-300">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">💡 Hintovi</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {task.hints
                        .sort((a, b) => a.orderIdx - b.orderIdx)
                        .map((hint) => (
                          <li key={hint.hintId}>{hint.hintText}</li>
                        ))}
                    </ul>
                  </div>
                )}

                {task.explanation && (
                  <div className="p-4 bg-green-100 rounded-lg border border-green-300">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">📖 Objašnjenje</h4>
                    <p className="text-gray-700">{task.explanation}</p>
                  </div>
                )}

                {task.correctAnswer && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">✅ Točan odgovor</h4>
                    <p className="text-gray-700">{task.correctAnswer}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <EditReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reportData={report}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
