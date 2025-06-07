import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import {
  collection,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';
import '../styles/Dashboard.css'; // Ensures announcements styles are included

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [admin, setAdmin] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const stateAdmin = location.state?.staff;
    const storedAdmin = localStorage.getItem('admin');

    if (stateAdmin) {
      localStorage.setItem('admin', JSON.stringify(stateAdmin));
      setAdmin(stateAdmin);
    } else if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    } else {
      navigate('/staff-login');
    }
  }, [location.state, navigate]);

  // 🔽 Fetch Announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const q = query(collection(db, 'announcements'), orderBy('startDate', 'desc'));
        const snapshot = await getDocs(q);
        const ann = snapshot.docs.map(doc => doc.data());
        setAnnouncements(ann);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };
    fetchAnnouncements();
  }, []);

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('admin');
    navigate('/staff-login');
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  if (!admin) return null;

  return (
    <div>
      {/* Sidebar */}
      <div className={`side-drawer ${drawerOpen ? 'open' : ''}`}>
        <h3>Navigation</h3>
        <ul>
          <li onClick={() => navigate('/admin-dashboard', { state: { admin } })}>
            Home
          </li>
          <li onClick={() => navigate('/admin-manage-staff', { state: { admin } })}>
            Manage Staff
          </li>
          <li onClick={() => navigate('/admin-manage-applications', { state: { admin } })}>
            Manage Applications
          </li>
          <li onClick={() => navigate('/admin-view-applicants', { state: { admin } })}>
            View Applicants
          </li>
          <li onClick={() => navigate('/admin-manage-announcement', { state: { admin } })}>
            Manage Announcements
          </li>
          <li onClick={() => navigate('/admin-monitor-status', { state: { admin } })}>
            Monitor Application Status
          </li>
          <li className="logout" onClick={logout}>
            Logout
          </li>
        </ul>
      </div>

      {/* Navbar */}
      <div className="navbar">
        <div className="left" onClick={toggleDrawer} style={{ cursor: 'pointer' }}>
          <span className="hamburger">&#9776;</span>
          <span className="logo">E-panchayat 360</span>
        </div>
        <div className="right">
          <button onClick={() => navigate('/About--')}>About</button>
          <button onClick={() => navigate('/admin-profile', { state: { staff: admin } })}>
            Profile
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-container" style={{ padding: '20px' }}>
        <h1>Welcome, {admin.name} (Admin)</h1>
        <p><strong>Email:</strong> {admin.email}</p>
        <p><strong>Phone:</strong> {admin.phone}</p>

        {/* 🔽 Announcements Section */}
        <div className="announcements">
          <h3>Latest Announcements</h3>
          {announcements.length === 0 ? (
            <p>No announcements available.</p>
          ) : (
            announcements.map((a, idx) => (
              <div key={idx} className="announcement-slide">
                {a.message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
