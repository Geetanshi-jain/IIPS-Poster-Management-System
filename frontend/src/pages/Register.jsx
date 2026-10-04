import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('auth/register/', { username, email, password, role });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full border border-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-700">Create Account</h2>
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4">{error}</div>}
        <form onSubmit={handleRegister} className="space-y-4">
          <input className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Username" required value={username} onChange={e => setUsername(e.target.value)} />
          <input className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
          <input className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
          <select className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={role} onChange={e => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="reviewer">Reviewer (Faculty)</option>
          </select>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition-all shadow-md">Register</button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}
