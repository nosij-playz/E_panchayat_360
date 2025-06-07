import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  const handleToggle = () => {
    setRole((prev) => (prev === 'user' ? 'staff' : 'user'));
  };

  const handleContinue = () => {
    navigate(role === 'user' ? '/login' : '/staff-login');
  };

  return (
    <div className="home-wrapper">
  {/* Left Section */}
  <div className="left-container">
    <h1 className="welcome-text">
      Welcome to <span className="brand-highlight">E-Panchayat360</span>
    </h1>
    <p className="sub-text">
      A unified digital gateway connecting citizens and staff to streamline and empower local governance.
    </p>
    {/* Optional illustration/image */}
    {/* <img src="/assets/village-illustration.png" alt="Village illustration" className="welcome-image" /> */}
  </div>

  {/* Right Section */}
  <div className="right-container">
    <h2 className="title">Get Started</h2>
    <p className="subtitle">Choose your role below to continue</p>

    <div className="toggle-container">
      <label className="role-switch">
        <input
          type="checkbox"
          checked={role === 'staff'}
          onChange={handleToggle}
          aria-label="Toggle role between User and Staff"
        />
        <span
          className="slider-knob"
          data-role={role === 'user' ? 'User' : 'Staff'}
        ></span>
      </label>
    </div>

    <button
      className="continue-btn"
      onClick={handleContinue}
      aria-label="Continue to the next step"
    >
      Continue
    </button>
  </div>
</div>

  );
}

export default Home;
