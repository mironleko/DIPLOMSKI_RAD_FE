import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import RequireAuth      from './contexts/RequireAuth';

import LoginPage             from './components/LoginPage/LoginPage';
import MainMenu              from './components/MainMenu/MainMenu';
import MemoryGame            from './components/MemoryGame/MemoryGame';
import CurriculumView        from './components/Curriculum/CurriculumView';
import LessonSelector        from './components/Curriculum/LessonSelector';
import TaskView              from './components/TaskView/TaskView';
import TaskHistoryPage       from './components/TaskHistory/TaskHistoryPage';
import TaskHistoryDetailPage from './components/TaskHistory/TaskHistoryDetailPage';
import ReportedProblems      from './components/ReportedProblems/ReportedProblems';
import ReportedProblemDetails from './components/ReportedProblems/ReportedProblemDetails';
import CreatePage            from './components/Case/CreatePage';
import CasePage              from './components/Case/CasePage';
import CaseHistoryPage       from './components/CaseHistory/CaseHistoryPage';
import CaseHistoryDetailsPage from './components/CaseHistory/CaseHistoryDetailsPage';
import MemoryGameHistoryPage  from './components/MemoryGameHistory/MemoryGameHistoryPage';
import MemoryGameHistoryDetailsPage from './components/MemoryGameHistory/MemoryGameHistoryDetailsPage';
import ProfilePage           from './components/ProfilePage/ProfilePage';
import StatsPage             from './components/Charts/StatsPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 1) Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* 2) Everything below is protected */}
          <Route element={<RequireAuth />}>
            <Route path="/"                       element={<MainMenu />} />
            <Route path="/games"                  element={<MemoryGame />} />
            <Route path="/curriculum"             element={<CurriculumView />} />
            <Route path="/learn-selector"         element={<LessonSelector />} />
            <Route path="/learn/:lessonId"        element={<TaskView />} />
            <Route path="/task-history"           element={<TaskHistoryPage />} />
            <Route path="/task-history/:historyId"element={<TaskHistoryDetailPage />} />
            <Route path="/reported-problems"      element={<ReportedProblems />} />
            <Route path="/reported-problems/:reportId" element={<ReportedProblemDetails />} />
            <Route path="/case/create"            element={<CreatePage />} />
            <Route path="/case/:caseId"           element={<CasePage />} />
            <Route path="/case-history"           element={<CaseHistoryPage />} />
            <Route path="/case-history/:caseHistoryId" element={<CaseHistoryDetailsPage />} />
            <Route path="/memory-game-history"    element={<MemoryGameHistoryPage />} />
            <Route path="/memory-game-history/:historyId" element={<MemoryGameHistoryDetailsPage />} />
            <Route path="/profile"                element={<ProfilePage />} />
            <Route path="/stats"                  element={<StatsPage />} />
          </Route>

          {/* 3) Catch-all → redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
