import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Hrvatski nazivi i boje za graf
const METRIC_LABELS = {
  totalDone:           'Ukupno odrađeno',
  totalSolved:         'Ukupno riješeno',
  totalSolutionViewed: 'Pregledana rješenja'
};
const COLORS = ['#10B981', '#3B82F6', '#F59E0B'];

export default function TasksBarChart({ totalDone, totalSolved, totalSolutionViewed }) {
  const keys   = Object.keys(METRIC_LABELS);
  const values = [totalDone, totalSolved, totalSolutionViewed];

  const data = {
    labels: keys.map(() => ''), // sakrij label-e na x-osi
    datasets: [{ data: values, backgroundColor: COLORS }]
  };
  const options = {
    plugins: {
      legend:  { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: { display: false },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 5 } // oznake: 0,5,10,15...
      }
    }
  };

  return (
    <>
      <div className="w-full h-64">
        <Bar data={data} options={options} height={300} />
      </div>
      <div className="mt-3 flex justify-center space-x-6">
        {keys.map((k, i) => (
          <div key={k} className="flex items-center space-x-2">
            <span
              className="block w-4 h-4 rounded-sm"
              style={{ backgroundColor: COLORS[i] }}
            />
            <span className="text-gray-700 text-sm">{METRIC_LABELS[k]}</span>
          </div>
        ))}
      </div>
    </>
  );
}
