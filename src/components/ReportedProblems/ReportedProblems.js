import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../api/userApi';
import { postJSON } from '../../api/apiClient';

const STATUS_LABELS = {
  OPEN: 'U obradi',
  INVALID: 'Neuspješna prijava',
  REVIEWED: 'Prijava prihvaćena',
};


export default function ReportedProblems() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  const [filters, setFilters] = useState({
    status: '',
    createdAtFrom: '',
    createdAtTo: '',
    resolvedAtFrom: '',
    resolvedAtTo: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (err) {
        setError('Greška prilikom dohvaćanja korisnika.');
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadReports();
    }
  }, [user, currentPage]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const body = {
        ...(filters.status && { status: filters.status }),
        ...(filters.createdAtFrom && { createdAtFrom: filters.createdAtFrom }),
        ...(filters.createdAtTo && { createdAtTo: filters.createdAtTo }),
        ...(filters.resolvedAtFrom && { resolvedAtFrom: filters.resolvedAtFrom }),
        ...(filters.resolvedAtTo && { resolvedAtTo: filters.resolvedAtTo }),
      };

      const query = `?page=${currentPage}&size=${pageSize}`;
      const endpoint = user.role === 'TEACHER'
        ? `/api/v1/task-report/search${query}`
        : `/api/v1/user/task-report/search${query}`;

      const data = await postJSON(endpoint, body);
      setReports(data.content);
      setTotalPages(Math.ceil(data.totalElements / data.pageSize));
    } catch (err) {
      setError('Greška prilikom dohvaćanja prijava.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const truncateText = (text, maxLength = 100) =>
    text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-green-100 to-blue-200 relative">
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 bg-white border border-gray-300 text-gray-800 hover:bg-blue-100 shadow-lg rounded-full p-4 text-2xl z-50 transition-all duration-200 ease-in-out transform hover:scale-110"
        title="Natrag na glavni meni"
      >
        ⬅️
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        🛠️ {user?.role === 'TEACHER' ? 'Prijavljeni problemi' : 'Moje prijave problema'}
      </h1>

      {/* FILTER SECTION */}
      <div className="bg-white p-6 rounded-xl shadow mb-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold tracking-wide text-indigo-800 mb-4">🔍 Pretraga po kriterijima</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 appearance-none"
            >
              <option value="">Svi statusi</option>
              <option value="OPEN">U obradi</option>
              <option value="INVALID">Neuspješna prijava</option>
              <option value="REVIEWED">Prijava prihvaćena</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prijavljeno od</label>
            <input
              type="date"
              value={filters.createdAtFrom}
              onChange={(e) => setFilters({ ...filters, createdAtFrom: e.target.value })}
              className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 appearance-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prijavljeno do</label>
            <input
              type="date"
              value={filters.createdAtTo}
              onChange={(e) => setFilters({ ...filters, createdAtTo: e.target.value })}
              className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 appearance-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Riješeno od</label>
            <input
              type="date"
              value={filters.resolvedAtFrom}
              onChange={(e) => setFilters({ ...filters, resolvedAtFrom: e.target.value })}
              className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 appearance-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Riješeno do</label>
            <input
              type="date"
              value={filters.resolvedAtTo}
              onChange={(e) => setFilters({ ...filters, resolvedAtTo: e.target.value })}
              className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 appearance-none"
            />
          </div>
        </div>

        <button
          onClick={() => {
            setCurrentPage(0);
            loadReports();
          }}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition"
        >
          🔍 Pretraži
        </button>
      </div>

      {/* RESULTS */}
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
        <>
          <div className="grid gap-6 max-w-4xl mx-auto">
            {reports.map((report) => (
              <div
                key={report.taskReportId}
                onClick={() => navigate(`/reported-problems/${report.taskReportId}`)}
                className="p-6 bg-white rounded-xl border border-gray-300 shadow hover:shadow-md cursor-pointer transition-all"
              >
                <div className="text-gray-800 font-semibold text-lg mb-1">
                  📚 Lekcija: {report.task.lessonName}
                </div>
                <div className="text-sm text-gray-700 mb-1">🧠 Tema: {report.task.topicName}</div>
                <div className="text-sm text-gray-700 mb-1">🏫 Razred: {report.task.gradeName}</div>
                <div className="text-sm text-gray-600 italic mb-2">
                  {truncateText(report.description)}
                </div>
                <div className="text-sm mb-1 text-gray-800">
                  <strong>Status:</strong>{' '}
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      report.status === 'REVIEWED'
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : report.status === 'INVALID'
                        ? 'bg-red-100 text-red-700 border border-red-300'
                        : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                    }`}
                  >
                    {STATUS_LABELS[report.status] || report.status}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  Prijavljeno: {new Date(report.createdAt).toLocaleString('hr-HR')}
                  <br />
                  Riješeno:{' '}
                  {report.resolvedAt
                    ? new Date(report.resolvedAt).toLocaleString('hr-HR')
                    : '-'}
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center space-x-4 bg-white p-4 rounded-lg shadow max-w-max mx-auto">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className={`flex items-center gap-1 px-4 py-2 rounded-md border text-sm font-medium transition 
                  ${currentPage === 0
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200'}
                `}
              >
                ⬅️ Prethodna
              </button>

              <span className="text-gray-700 font-semibold text-sm">
                Stranica <span className="text-blue-700">{currentPage + 1}</span> od {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage + 1 >= totalPages}
                className={`flex items-center gap-1 px-4 py-2 rounded-md border text-sm font-medium transition 
                  ${currentPage + 1 >= totalPages
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200'}
                `}
              >
                Sljedeća ➡️
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
