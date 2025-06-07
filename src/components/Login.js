// src/components/Login.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import '../styles/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <h2 className="welcome-heading">Welcome to <span className="brand-highlight">E-Panchayat360</span></h2>
        <p className="welcome-sub">Empowering citizens through digital governance.</p>
        <ul className="feature-list">
          <li>✔ Access your local records</li>
          <li>✔ Track applications and services</li>
          <li>✔ Transparent governance tools</li>
          <li>✔ Support for residents and staff</li>
        </ul>
      </div>

      <div className="login-right fade-in">
        <form className="login-form" onSubmit={login}>
          <h2 className="form-title">Login to <span className="brand-highlight">E-Panchayat360</span></h2>
          <p className="form-subtitle">Please enter your credentials to access the portal.</p>

          <input
            type="email"
            placeholder="Enter your email"
            required
            onChange={e => setEmail(e.target.value)}
            className="form-input"
          />

          <input
            type="password"
            placeholder="Enter your password"
            required
            onChange={e => setPassword(e.target.value)}
            className="form-input"
          />

          <button type="submit" className="login-btn">
            Login
          </button>

          <button
            type="button"
            onClick={() => navigate('/')} 
            className="secondary-btn"
          >
            Back to Home
          </button>

          <p className="form-footer">
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
