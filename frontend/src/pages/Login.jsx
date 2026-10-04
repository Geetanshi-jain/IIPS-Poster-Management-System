import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('token/', { username, password });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      
      const userRes = await api.get('auth/me/');
      const role = userRes.data.role;
      
      if (role === 'admin') navigate('/admin');
      else if (role === 'reviewer') navigate('/reviewer');
      else navigate('/student');
    } catch (err) {
      setError('Login failed! Check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full border border-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">Welcome Back</h2>
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-5">
          <input className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Username" required value={username} onChange={e => setUsername(e.target.value)} />
          <input className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-all shadow-md">Sign In</button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          New here? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
