import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      
      setSuccessMsg(`Welcome ${data.username}`);
      setErrorMsg('');
      
      // Redirect to home page after successful login
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg(err.message || 'Login failed');
      setSuccessMsg('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#181818',
        borderRadius: 14,
        boxShadow: '0 2px 16px rgba(0,0,0,0.18)',
        padding: '2.5rem 2.5rem 2rem 2.5rem',
        width: 350,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h2 style={{ color: '#8d2be2', fontWeight: 700, marginBottom: 24 }}>Login</h2>

        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
        {successMsg && <p style={{ color: 'lightgreen' }}>{successMsg}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: 16,
            borderRadius: 6,
            border: '1.5px solid #333',
            background: '#23232a',
            color: '#fff',
            fontSize: '1rem',
            outline: 'none',
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: 24,
            borderRadius: 6,
            border: '1.5px solid #333',
            background: '#23232a',
            color: '#fff',
            fontSize: '1rem',
            outline: 'none',
          }}
        />
        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            background: '#8d2be2',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '12px',
            fontWeight: 600,
            fontSize: '1.1rem',
            marginBottom: 18,
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
