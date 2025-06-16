import React, { useState, useEffect } from 'react';
import {
  getGrades,
  getTopicsByGrade,
  getLessonsByGradeAndTopic,
  searchUserTaskHistory
} from '../../api/taskHistoryApi';
import { useNavigate } from 'react-router-dom';

export default function TaskHistoryPage() {
  const navigate = useNavigate();

  const [taskHistory, setTaskHistory] = useState([]);
  const [filters, setFilters] = useState({
    gradeId: '',
    topicId: '',
    lessonId: '',
    solved: '',
    shownSolution: '',
    createdAfter: '',
    createdBefore: '',
  });
  const [grades, setGrades] = useState([]);
  const [topics, setTopics] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    getGrades().then(setGrades).catch(console.error);
  }, []);

  useEffect(() => {
    if (filters.gradeId) {
      getTopicsByGrade(filters.gradeId).then(setTopics).catch(console.error);
    } else {
      setTopics([]);
      setFilters((f) => ({ ...f, topicId: '', lessonId: '' }));
    }
  }, [filters.gradeId]);

  useEffect(() => {
    if (filters.gradeId && filters.topicId) {
      getLessonsByGradeAndTopic(filters.gradeId, filters.topicId).then(setLessons).catch(console.error);
    } else {
      setLessons([]);
      setFilters((f) => ({ ...f, lessonId: '' }));
    }
  }, [filters.gradeId, filters.topicId]);

  useEffect(() => {
    loadHistory();
  }, [currentPage]);

  const loadHistory = async () => {
    const body = {
      ...(filters.gradeId && { gradeId: Number(filters.gradeId) }),
      ...(filters.topicId && { topicId: Number(filters.topicId) }),
      ...(filters.lessonId && { lessonId: Number(filters.lessonId) }),
      ...(filters.solved !== '' && { solved: filters.solved === 'true' }),
      ...(filters.shownSolution !== '' && { shownSolution: filters.shownSolution === 'true' }),
      ...(filters.createdAfter && { createdAfter: filters.createdAfter }),
      ...(filters.createdBefore && { createdBefore: filters.createdBefore }),
    };

    try {
      const data = await searchUserTaskHistory(body, currentPage, pageSize);
      setTaskHistory(data.content);
      setTotalPages(Math.ceil(data.totalElements / data.pageSize));
    } catch (e) {
      console.error(e);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-green-100 to-blue-200">
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 bg-white border border-gray-300 text-gray-700 hover:bg-blue-100 shadow-lg rounded-full p-4 text-2xl z-50 transition-all duration-200 ease-in-out transform hover:scale-110"
        title="Natrag na Glavni Meni"
      >
        ⬅️
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        📚 Povijest zadataka
      </h1>

      {/* FILTERI */}
      <div className="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto mb-6">
      <h2 className="text-2xl font-bold tracking-wide text-indigo-800 mb-4">🔍 Pretraga po kriterijima</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <select
            value={filters.gradeId}
            onChange={(e) => setFilters({ ...filters, gradeId: e.target.value })}
            className="bg-white text-gray-900 border border-gray-300 rounded-lg p-2"
          >
            <option value="">Razred</option>
            {grades.map((g) => (
              <option key={g.gradeId} value={g.gradeId}>
                {g.name}
              </option>
            ))}
          </select>

          <select
            value={filters.topicId}
            onChange={(e) => setFilters({ ...filters, topicId: e.target.value })}
            disabled={!filters.gradeId}
            className="bg-white text-gray-900 border border-gray-300 rounded-lg p-2"
          >
            <option value="">Tema</option>
            {topics.map((t) => (
              <option key={t.topicId} value={t.topicId}>
                {t.name}
              </option>
            ))}
          </select>

          <select
            value={filters.lessonId}
            onChange={(e) => setFilters({ ...filters, lessonId: e.target.value })}
            disabled={!filters.topicId}
            className="bg-white text-gray-900 border border-gray-300 rounded-lg p-2"
          >
            <option value="">Lekcija</option>
            {lessons.map((l) => (
              <option key={l.lessonId} value={l.lessonId}>
                {l.name}
              </option>
            ))}
          </select>

          <select
            value={filters.solved}
            onChange={(e) => setFilters({ ...filters, solved: e.target.value })}
            className="bg-white text-gray-900 border border-gray-300 rounded-lg p-2"
          >
            <option value="">Riješeno?</option>
            <option value="true">Da</option>
            <option value="false">Ne</option>
          </select>

          <select
            value={filters.shownSolution}
            onChange={(e) => setFilters({ ...filters, shownSolution: e.target.value })}
            className="bg-white text-gray-900 border border-gray-300 rounded-lg p-2"
          >
            <option value="">Rješenje prikazano?</option>
            <option value="true">Da</option>
            <option value="false">Ne</option>
          </select>

          <input
            type="date"
            value={filters.createdAfter}
            onChange={(e) => setFilters({ ...filters, createdAfter: e.target.value })}
            className="bg-white text-gray-900 border border-gray-300 rounded-lg p-2 appearance-none"
          />
          <input
            type="date"
            value={filters.createdBefore}
            onChange={(e) => setFilters({ ...filters, createdBefore: e.target.value })}
            className="bg-white text-gray-900 border border-gray-300 rounded-lg p-2 appearance-none"
          />
        </div>

        <button
          onClick={() => {
            setCurrentPage(0);
            loadHistory();
          }}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
        >
          🔍 Pretraži
        </button>
      </div>

      {/* REZULTATI */}
      <div className="grid gap-4 max-w-4xl mx-auto">
        {taskHistory.map((item) => (
          <div
            key={item.taskHistoryId}
            onClick={() => navigate(`/task-history/${item.taskHistoryId}`)}
            className="p-4 bg-white rounded-lg border border-gray-200 shadow hover:shadow-md cursor-pointer transition"
          >
            <div className="font-semibold text-gray-800">
              📚 {item.task.lessonName}
            </div>
            <div className="text-sm text-gray-600">
              🧠 {item.task.topicName} · 🏫 {item.task.gradeName}
            </div>
            <div className="text-sm mt-1">
              {item.solved ? '✅ Riješeno' : item.shownSolution ? '👁️ Prikazano rješenje' : '🕒 Nije riješeno'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Kreirano: {new Date(item.createdAt).toLocaleString('hr-HR')}
            </div>
          </div>
        ))}
      </div>

      {/* PAGINACIJA */}
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
    </div>
  );
}
