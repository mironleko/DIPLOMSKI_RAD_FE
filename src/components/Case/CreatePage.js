import React from 'react';
import { useNavigate } from 'react-router-dom';
import CaseCreateForm from './CaseCreateForm';

export default function CreatePage() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200 p-8">
      <CaseCreateForm onCreated={c => nav(`/case/${c.caseId}`)} />
    </div>
  );
}
