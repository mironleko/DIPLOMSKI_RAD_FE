import React, { useState, useEffect } from 'react';
import { useNavigate }           from 'react-router-dom';
import { getCurrentUser }        from '../../api/userApi';
import { getUserTaskStats, 
         getAllTaskStats }       from '../../api/statsApi';
import StatsCard                from './StatsCard';
import TasksBarChart            from './TasksBarChart';
import ReportsBarChart          from './ReportsBarChart';

export default function StatsPage() {
  const navigate = useNavigate();
  const [user,    setUser]    = useState(null);
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    async function load() {
      try {
        // 1) Dohvati usera
        const u = await getCurrentUser();
        setUser(u);

        // 2) Prema role pozovi odgovarajući endpoint
        const fetchStats =
          u.role === 'TEACHER' ? getAllTaskStats : getUserTaskStats;
        const data = await fetchStats();
        setStats(data);

      } catch (err) {
        setError(err.message || 'Greška pri dohvaćanju statistika');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center
                      bg-gradient-to-br from-green-100 to-blue-200">
        <div className="w-16 h-16 border-4 border-blue-400 
                        border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center
                      bg-gradient-to-br from-green-100 to-blue-200">
        <div className="bg-white p-6 rounded-xl shadow max-w-sm text-center">
          <p className="text-red-600 mb-4">❗ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white 
                       px-6 py-2 rounded-lg shadow transition"
          >
            🔁 Pokušaj ponovno
          </button>
        </div>
      </div>
    );
  }

  const {
    totalDone,
    totalSolved,
    totalSolutionViewed,
    totalReported,
    reportStatusOpen,
    reportStatusInvalid,
    reportStatusReviewed
  } = stats;

  return (
    <div className="min-h-screen p-8 font-sans 
                    bg-gradient-to-br from-green-100 to-blue-200 relative">
      {/* ← Back */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 bg-white border border-gray-300 
                   text-gray-800 hover:bg-blue-100 shadow-lg rounded-full 
                   p-4 text-2xl z-50 transition-all duration-200 ease-in-out
                   transform hover:scale-110"
        title="Natrag na glavni meni"
      >
        ⬅️
      </button>

      {/* Naslov */}
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        📊 Statistika zadataka
      </h1>

      {/* === Sekcija 1: Kartice === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
                      lg:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
        <StatsCard icon="📝" label="Ukupno odrađeno"       value={totalDone} />
        <StatsCard icon="✅" label="Ukupno riješeno"        value={totalSolved} />
        <StatsCard icon="🔍" label="Pregledana rješenja"   value={totalSolutionViewed} />
        <StatsCard icon="🚩" label="Ukupno prijava"        value={totalReported} />
        <StatsCard icon="❗" label="Otvorene prijave"       value={reportStatusOpen} />
        <StatsCard icon="⚠️" label="Neispravne prijave"    value={reportStatusInvalid} />
        <StatsCard icon="✔️" label="Pregledane prijave"     value={reportStatusReviewed} />
      </div>

      {/* === Sekcija 2: Dva odvojena grafa === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow">
          <TasksBarChart
            totalDone={totalDone}
            totalSolved={totalSolved}
            totalSolutionViewed={totalSolutionViewed}
          />
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <ReportsBarChart
            totalReported={totalReported}
            open={reportStatusOpen}
            invalid={reportStatusInvalid}
            reviewed={reportStatusReviewed}
          />
        </div>
      </div>
    </div>
  );
}
