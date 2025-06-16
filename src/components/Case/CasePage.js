import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EpisodeViewer from './EpisodeViewer';

export default function CasePage() {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const goHome = () => navigate('/');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200 p-8">
      <EpisodeViewer caseId={caseId} onSolved={goHome} />
    </div>
  );
}
