// src/components/StaffLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import '../styles/StaffLogin.css';

function StaffLogin() {
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    const collectionName = isAdmin ? 'admin' : 'staff';

    try {
      const userRef = doc(db, collectionName, staffId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        alert(`${isAdmin ? 'Admin' : 'Staff'} ID not found`);
        return;
      }

      const user = userSnap.data();
      await signInWithEmailAndPassword(auth, user.email, password);

      const route = isAdmin ? '/admin-dashboard' : '/staff-dashboard';
      navigate(route, { state: { staff: user } });
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  };

  return (
    <div className="staff-wrapper">
      <div className="staff-left">
        <h2 className="welcome-heading">
          {isAdmin ? 'Welcome, Administrator' : 'Welcome, Panchayat Staff'}
        </h2>
        <p className="welcome-sub">
          {isAdmin
            ? 'Manage records, oversee panchayat data, and monitor citizen services.'
            : 'Track applications, manage service delivery, and support local citizens.'}
        </p>
        <ul className="feature-list">
          {isAdmin ? (
            <>
              <li>✔ Access all staff activities</li>
              <li>✔ Modify user and staff roles</li>
              <li>✔ Oversee service statistics</li>
              <li>✔ Generate village-level reports</li>
            </>
          ) : (
            <>
              <li>✔ Manage service applications</li>
              <li>✔ Update citizen records</li>
              <li>✔ Track service requests</li>
              <li>✔ Report issues to admins</li>
            </>
          )}
        </ul>
      </div>

      <div className="staff-right">
        <form className="staff-form" onSubmit={login}>
          <div className="toggle-label">
            <span>Staff</span>
            <label className="switch">
              <input type="checkbox" checked={isAdmin} onChange={() => setIsAdmin(!isAdmin)} />
              <span className="slider round"></span>
            </label>
            <span>Admin</span>
          </div>

          <h2 className="form-title">{isAdmin ? 'Admin Login' : 'Staff Login'}</h2>

          <input
            type="text"
            placeholder={isAdmin ? 'Admin ID' : 'Staff ID'}
            required
            onChange={(e) => setStaffId(e.target.value)}
            className="form-input"
          />

          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
          />

          <button type="submit" className="login-btn">Login</button>

          <button type="button" onClick={() => navigate('/')} className="secondary-btn">
            Back to Home
          </button>
        </form>
      </div>
    </div>
  );
}

export default StaffLogin;
