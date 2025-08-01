import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // ✅ Import your Navbar!

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // ✅ Hardcoded credentials
    if (username === 'Ramu' && password === 'ramu123') {
      navigate('/tasks');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <>
      <Navbar /> {/* ✅ Shows the navbar with Home + Login link */}
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          minHeight: '90vh',
          background: 'linear-gradient(135deg, #A8E6CF, #D0F0C0)',
        }}
      >
        <div className="card p-4 shadow" style={{ minWidth: '320px' }}>
          <h3 className="mb-3 text-center">🔒 Login</h3>
          {error && <div className="text-danger mb-2">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Username"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                placeholder="Password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
