import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://localhost:3000/user/auth/register', { name, email, password, role });
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="w-1/3 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          className="w-full px-4 py-2 mb-4 border rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          className="w-full px-4 py-2 mb-4 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full px-4 py-2 mb-4 border rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="mb-4">
          <label className="mr-4">Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="customer">Customer</option>
            <option value="staff">Staff</option>
          </select>
        </div>
        <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
