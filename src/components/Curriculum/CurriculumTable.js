// src/components/Curriculum/CurriculumTable.jsx
import React, { useState, useEffect } from 'react';
import {
  AiOutlinePlusCircle,
  AiOutlineMinusCircle,
  AiOutlineArrowLeft
} from 'react-icons/ai';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { postJSON } from '../../api/apiClient';

const topicColor  = "bg-blue-600 text-white";
const lessonColor = "bg-blue-100 text-gray-800";

const BASE_URL =
    process.env.REACT_APP_API_URL || 'http://localhost:8080';

const API_URL = BASE_URL + '/api/v1';


export default function CurriculumTable({ viewMode = "VIEW" }) {
  const navigate = useNavigate();

  // default na 5. razred
  const [selectedGrade, setSelectedGrade] = useState('1');

  // svaki topic ima flag "expanded" koji je po defaultu false
  const [curriculum, setCurriculum] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  // svaki put kad se promijeni razred, očisti selekciju i reload
  useEffect(() => {
    setSelectedLesson(null);
    setSelectedDifficulty('');
    fetchCurriculum(selectedGrade);
  }, [selectedGrade]);

  const fetchCurriculum = async gradeId => {
    try {
      const data = await postJSON(`${API_URL}/curriculum/search`, {
        gradeId: Number(gradeId),
      });
      // default expanded: false
      const withFlags = data.topics.map(t => ({ ...t, expanded: false }));
      setCurriculum(withFlags);
    } catch (err) {
      console.error('Greška pri dohvaćanju kurikuluma:', err);
    }
  };

  const handleLessonClick = (lesson, topicId) => {
    if (viewMode === "SELECT") {
      setSelectedLesson({ ...lesson, topicId });
      setSelectedDifficulty('');
    }
  };

  const handleStartLearning = () => {
    if (!selectedLesson || !selectedDifficulty) return;
    navigate(`/learn/${selectedLesson.lessonId}`, {
      state: {
        gradeId:        selectedGrade,
        topicId:        selectedLesson.topicId,
        difficulty:     selectedDifficulty
      }
    });
  };

  return (
    <div className="relative min-h-screen px-8 pt-24 pb-8
                    bg-gradient-to-br from-blue-100 to-green-100">

      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 bg-white border border-gray-300 text-gray-700 hover:bg-blue-100 shadow-lg rounded-full p-4 text-3xl z-50 transition-all duration-200 ease-in-out transform hover:scale-110"
        title="Natrag na Glavni Meni"
      >
        ⬅️
      </button>

      <label htmlFor="grade-select"
             className="block mb-6 font-bold text-2xl text-purple-900">
        🎓 Odaberi razred:
      </label>
      <select
        id="grade-select"
        className="mb-6 p-3 border rounded-md shadow-md bg-white
                   text-purple-900 text-lg"
        value={selectedGrade}
        onChange={e => setSelectedGrade(e.target.value)}
      >
        <option value="1">6. razred</option>
      </select>

      <table className="w-full border-collapse rounded-lg shadow-lg overflow-hidden">
        <thead>
          <tr>
            <th className="border-b p-4 bg-blue-800 text-white font-bold text-lg">
              Teme i lekcije
            </th>
          </tr>
        </thead>
        <tbody>
          {curriculum.map(topic => (
            <React.Fragment key={topic.topicId}>
              <tr className={`${topicColor} transition-colors duration-200`}>
                <td className="border-b p-4 font-bold flex items-center text-lg">
                  <span className="flex-grow">{topic.name}</span>
                  <button
                    onClick={() => {
                      setCurriculum(curr =>
                        curr.map(t =>
                          t.topicId === topic.topicId
                            ? { ...t, expanded: !t.expanded }
                            : t
                        )
                      );
                    }}
                    className="ml-4 px-4 py-2 bg-white text-blue-800
                               rounded-md shadow-md hover:bg-gray-100
                               transition-all duration-300 flex items-center"
                  >
                    {topic.expanded
                      ? <AiOutlineMinusCircle className="text-xl" />
                      : <AiOutlinePlusCircle className="text-xl" />}
                  </button>
                </td>
              </tr>

              {topic.expanded && topic.lessons.map(lesson => (
                <motion.tr
                  key={lesson.lessonId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td
                    className={`border-b p-4 pl-12 ${lessonColor}
                                text-md rounded-md shadow-md
                                transition-colors duration-300
                                hover:bg-blue-200 cursor-pointer`}
                    onClick={() => handleLessonClick(lesson, topic.topicId)}
                  >
                    📚 {lesson.name}
                  </td>
                </motion.tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {selectedLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-40
                        flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl w-80">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Odaberi težinu zadatka
            </h3>
            <select
              className="w-full p-2 mb-4 border rounded-md
                         bg-gray-50 text-gray-800"
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
            >
              <option value="">-- Odaberi --</option>
              <option value="EASY">Lako</option>
              <option value="MEDIUM">Srednje</option>
              <option value="HARD">Teško</option>
            </select>
            <button
              onClick={handleStartLearning}
              disabled={!selectedDifficulty}
              className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600
                         text-white rounded-lg shadow-md disabled:opacity-50"
            >
              ✅ Započni
            </button>
            <button
              onClick={() => setSelectedLesson(null)}
              className="w-full mt-2 px-4 py-2 bg-gray-200 hover:bg-gray-300
                         rounded-lg text-gray-700"
            >
              Odustani
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
