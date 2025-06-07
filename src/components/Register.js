// src/components/Register.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import '../styles/Login.css'; // Reuse the same styles

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'users', uid), {
        name,
        email,
        phone,
        role: 'user',
        createdAt: new Date(),
      });

      alert('User registered successfully!');
      navigate('/login');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <h2 className="welcome-heading">Create your <span className="brand-highlight">E-Panchayat360</span> account</h2>
        <p className="welcome-sub">Experience the future of transparent and digital civic services.</p>
        <ul className="feature-list">
          <li>✔ Secure citizen access</li>
          <li>✔ Easy registration process</li>
          <li>✔ Personalized dashboard</li>
          <li>✔ 24/7 access to services</li>
        </ul>
      </div>

      <div className="login-right">
        <form className="login-form" onSubmit={register}>
          <h2 className="form-title">Register an Account</h2>

          <input
            type="text"
            placeholder="Full Name"
            required
            onChange={(e) => setName(e.target.value)}
            className="form-input"
          />

          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />

          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            required
            onChange={(e) => setPhone(e.target.value)}
            className="form-input"
          />

          <button type="submit" className="login-btn">
            Sign Up
          </button>

          <p className="form-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
