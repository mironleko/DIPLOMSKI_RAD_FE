// src/components/LoginPage/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AiOutlineLock, AiOutlineMail } from 'react-icons/ai';
import { login }          from '../../api/authService';
import { getCurrentUser } from '../../api/userApi';
import { useAuth }        from '../../contexts/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // where to go after login
  const from = location.state?.from?.pathname || '/';

  const { setUser } = useAuth();     // <— pull your context setter

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      // 1) call your login endpoint (should set cookie/JWT)
      await login(email, password);

      // 2) re-fetch the user or have login() return it
      const currentUser = await getCurrentUser();

      // 3) tell AuthContext who we are
      setUser(currentUser);

      // 4) redirect back to where we came from (or '/')
      navigate(from, { replace: true });
    } catch (errMsg) {
      setError(errMsg.toString());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Prijava</h2>
        {error && (
          <div className="mb-4 text-red-600 text-center">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <div className="flex items-center border border-gray-300 rounded-md bg-white">
              <AiOutlineMail className="text-gray-400 mx-3" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                className="flex-1 px-3 py-2 bg-white text-gray-800 focus:outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">Lozinka</label>
            <div className="flex items-center border border-gray-300 rounded-md bg-white">
              <AiOutlineLock className="text-gray-400 mx-3" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Lozinka"
                className="flex-1 px-3 py-2 bg-white text-gray-800 focus:outline-none"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors"
          >
            Prijava
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Nemate račun?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Registracija
          </Link>
        </p>
      </div>
    </div>
  );
}
