import React, { useEffect, useState } from 'react';
import { fetchSubjects } from '../../api/caseApi';
import { searchUserCaseHistories } from '../../api/caseHistoryApi';
import { useNavigate } from 'react-router-dom';

export default function CaseHistoryPage() {
  const navigate = useNavigate();

  const [histories, setHistories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filters, setFilters] = useState({
    subjectId: '',
    minScore: '',
    maxScore: ''
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pageSize = 10;

  useEffect(() => {
    fetchSubjects().then(setSubjects).catch(console.error);
    loadHistories();
  }, []);

  useEffect(() => {
    loadHistories();
  }, [currentPage]);

  const loadHistories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchUserCaseHistories({
        ...filters,
        subjectId: filters.subjectId ? Number(filters.subjectId) : undefined,
        minScore: filters.minScore ? Number(filters.minScore) : undefined,
        maxScore: filters.maxScore ? Number(filters.maxScore) : undefined,
        page: currentPage,
        size: pageSize,
      });
      setHistories(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (e) {
      console.error(e);
      setError('Greška prilikom dohvaćanja povijesti slučajeva.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-green-100 to-blue-200">
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 bg-white border border-gray-300 text-gray-700 hover:bg-blue-100 shadow-lg rounded-full p-4 text-2xl z-50 transition-all"
        title="Natrag na glavni meni"
      >
        ⬅️
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        🕵️‍♂️ Povijest Math Detective slučajeva
      </h1>

      {/* FILTERI */}
      <div className="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto mb-6">
      <h2 className="text-2xl font-bold tracking-wide text-indigo-800 mb-4">🔍 Pretraga po kriterijima</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <select
            value={filters.subjectId}
            onChange={(e) => setFilters({ ...filters, subjectId: e.target.value })}
            className="bg-white text-gray-900 border border-gray-300 rounded-lg p-2"
          >
            <option value="">Predmet</option>
            {subjects.map((s) => (
              <option key={s.subjectId} value={s.subjectId}>
                {s.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Min bodova"
            value={filters.minScore}
            onChange={(e) => setFilters({ ...filters, minScore: e.target.value })}
            className="bg-white text-gray-900 border border-gray-300 rounded-lg p-2"
          />

          <input
            type="number"
            placeholder="Max bodova"
            value={filters.maxScore}
            onChange={(e) => setFilters({ ...filters, maxScore: e.target.value })}
            className="bg-white text-gray-900 border border-gray-300 rounded-lg p-2"
          />
        </div>

        <button
          onClick={() => {
            setCurrentPage(0);
            loadHistories();
          }}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
        >
          🔍 Pretraži
        </button>
      </div>

      {/* REZULTATI */}
      <div className="grid gap-4 max-w-4xl mx-auto">
        {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        ) : error ? (
          <div className="text-red-600 text-center">{error}</div>
        ) : histories.length === 0 ? (
          <p className="text-center text-gray-600">Nema pronađenih rezultata.</p>
        ) : (
          histories.map((item) => (
            <div
              key={item.caseHistoryId}
              onClick={() => navigate(`/case-history/${item.caseHistoryId}`)}
              className="p-6 bg-white rounded-xl border border-gray-300 shadow hover:shadow-md cursor-pointer transition-all"
            >
              <div className="text-gray-800 text-lg font-semibold">🧩 Naslov: {item.title}</div>
              <div className="text-sm text-gray-700 mb-1">📘 Predmet: {item.subject.name}</div>
              <div className="text-sm text-gray-600">
                🏁 Početak: {new Date(item.startedAt).toLocaleString('hr-HR')} <br />
                🏁 Završen: {new Date(item.finishedAt).toLocaleString('hr-HR')}
              </div>
              <div className="mt-2 text-sm font-semibold text-indigo-700">
                🔢 Bodovi: {item.score}
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAGINACIJA */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-4 bg-white p-4 rounded-lg shadow max-w-max mx-auto">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className={`px-4 py-2 rounded-md border text-sm font-medium transition ${
              currentPage === 0
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200'
            }`}
          >
            ⬅️ Prethodna
          </button>

          <span className="text-gray-700 font-semibold text-sm">
            Stranica <span className="text-blue-700">{currentPage + 1}</span> od {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage + 1 >= totalPages}
            className={`px-4 py-2 rounded-md border text-sm font-medium transition ${
              currentPage + 1 >= totalPages
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200'
            }`}
          >
            Sljedeća ➡️
          </button>
        </div>
      )}
    </div>
  );
}
