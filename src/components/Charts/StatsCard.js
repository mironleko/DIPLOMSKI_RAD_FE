import React from 'react';

export default function StatsCard({ icon, label, value }) {
  return (
    <div className="card bg-white shadow rounded-lg p-2 flex flex-col items-center text-gray-800">
      <div className="text-3xl">{icon}</div>
      <div className="mt-1 text-sm font-semibold">{label}</div>
      <div className="mt-1 text-xl font-bold">{value}</div>
    </div>
  );
}
