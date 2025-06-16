import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../../api/userApi';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (err) {
        console.error('Greška pri dohvaćanju korisnika:', err);
      }
    };
    loadUser();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-green-100 to-blue-200 flex flex-col items-center">
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 bg-white border border-gray-300 text-gray-700 hover:bg-blue-100 shadow-lg rounded-full p-4 text-2xl z-50 transition-transform transform hover:scale-110"
        title="Natrag"
      >
        ⬅️
      </button>

      <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full mt-10">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-indigo-500 text-white flex items-center justify-center text-3xl font-bold shadow-md mb-6">
            {initials}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">👤 Profil korisnika</h2>
          <div className="w-full space-y-4 text-gray-800 text-lg">
            <div><strong>Ime:</strong> {user.firstName}</div>
            <div><strong>Prezime:</strong> {user.lastName}</div>
            <div><strong>Email:</strong> {user.email}</div>
            <div>
              <strong>Uloga:</strong>{' '}
              <span className={
                user.role === 'TEACHER'
                  ? 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm'
                  : 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm'
              }>
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
