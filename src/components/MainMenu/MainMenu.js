// src/components/MainMenu/MainMenu.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { AiOutlinePlayCircle, AiOutlineBook } from 'react-icons/ai';
import { GiMagnifyingGlass } from 'react-icons/gi';
import { BsClipboardData, BsBarChart } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { getCurrentUser } from '../../api/userApi';

export default function MainMenu() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (err) {
        console.error('Greška pri dohvaćanju korisnika:', err);
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-8 bg-gradient-to-br from-green-100 to-blue-200 min-h-screen flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-12 text-gray-800">
          🧮 Math Learning Hub
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
          {/* === UČITELJ === */}
          {user?.role === 'TEACHER' && (
            <>
              <motion.div
                className="cursor-pointer p-6 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center hover:shadow-2xl"
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/curriculum')}
              >
                <AiOutlineBook className="text-6xl text-purple-600 mb-4" />
                <span className="text-2xl font-semibold text-gray-700">
                  Pregled Kurikuluma
                </span>
              </motion.div>

              <motion.div
                className="cursor-pointer p-6 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center hover:shadow-2xl"
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/reported-problems')}
              >
                <BsClipboardData className="text-6xl text-red-500 mb-4" />
                <span className="text-2xl font-semibold text-gray-700">
                  Prijavljeni Problemi
                </span>
              </motion.div>
            </>
          )}

          {/* === UČENIK === */}
          {user?.role === 'STUDENT' && (
            <>
              <motion.div
                className="cursor-pointer p-6 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center hover:shadow-2xl"
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/games')}
              >
                <AiOutlinePlayCircle className="text-6xl text-blue-600 mb-4" />
                <span className="text-2xl font-semibold text-gray-700">
                  Memorijska igra 4x4
                </span>
              </motion.div>

              <motion.div
                className="cursor-pointer p-6 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center hover:shadow-2xl"
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/learn-selector')}
              >
                <AiOutlinePlayCircle className="text-6xl text-blue-600 mb-4" />
                <span className="text-2xl font-semibold text-gray-700">
                  Odabir Lekcija za Učenje
                </span>
              </motion.div>

              <motion.div
                className="cursor-pointer p-6 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center hover:shadow-2xl"
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/case/create')}
              >
                <GiMagnifyingGlass className="text-6xl text-green-600 mb-4" />
                <span className="text-2xl font-semibold text-gray-700">
                  Math Detective Igra
                </span>
              </motion.div>

              <motion.div
                className="cursor-pointer p-6 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center hover:shadow-2xl"
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/task-history')}
              >
                <BsClipboardData className="text-6xl text-indigo-600 mb-4" />
                <span className="text-2xl font-semibold text-gray-700">
                  Povijest Zadataka
                </span>
              </motion.div>

              <motion.div
                className="cursor-pointer p-6 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center hover:shadow-2xl"
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/reported-problems')}
              >
                <BsClipboardData className="text-6xl text-red-500 mb-4" />
                <span className="text-2xl font-semibold text-gray-700">
                  Moji Prijavljeni Problemi
                </span>
              </motion.div>

              <motion.div
                className="cursor-pointer p-6 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center hover:shadow-2xl"
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/case-history')}
              >
                <BsClipboardData className="text-6xl text-yellow-600 mb-4" />
                <span className="text-2xl font-semibold text-gray-700">
                  Povijest Math Detective
                </span>
              </motion.div>

              <motion.div
                className="cursor-pointer p-6 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center hover:shadow-2xl"
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/memory-game-history')}
              >
                <AiOutlinePlayCircle className="text-6xl text-pink-600 mb-4" />
                <span className="text-2xl font-semibold text-gray-700">
                  Povijest Memory Igre
                </span>
              </motion.div>
            </>
          )}

          {/* === Statistika Zadataka === */}
          <motion.div
            className="cursor-pointer p-6 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center hover:shadow-2xl"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/stats')}
          >
            <BsBarChart className="text-6xl text-teal-500 mb-4" />
            <span className="text-2xl font-semibold text-gray-700">
              Statistika zadataka
            </span>
          </motion.div>
        </div>
      </div>
    </>
  );
}
