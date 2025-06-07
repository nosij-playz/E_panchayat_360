import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import {
  collection,
  getDocs,
  orderBy,
  query
} from 'firebase/firestore';
import '../styles/Dashboard.css'; // Navbar/Sidebar styling
import '../styles/StaffDashboard.css'; // Staff-specific styling

function StaffDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const staff = location.state?.staff;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    if (!staff) {
      navigate('/staff-login');
    }
  }, [staff, navigate]);

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
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
    navigate('/staff-login');
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  if (!staff) return null;

  return (
    <div>
      {/* Sidebar */}
      <div className={`side-drawer ${drawerOpen ? 'open' : ''}`}>
        <h3>Navigation</h3>
        <ul>
          <li onClick={() => navigate('/staff-dashboard', { state: { staff } })}>Home</li>
          <li onClick={() => navigate('/new-applied', { state: { staff } })}>New Applied</li>
          <li onClick={() => navigate('/staff-profile', { state: { staff } })}>Profile</li>
          <li onClick={() => navigate('/About-')}>About</li>
          <li className="logout" onClick={logout}>Logout</li>
        </ul>
      </div>

      {/* Top Navbar */}
      <div className="navbar">
        <div className="left" onClick={toggleDrawer} style={{ cursor: 'pointer' }}>
          <span className="hamburger">&#9776;</span>
          <span className="logo">E-panchayat 360</span>
        </div>
        <div className="right">
          <button onClick={() => navigate('/About-')}>About</button>
          <button onClick={() => navigate('/staff-profile', { state: { staff } })}>Profile</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-container">
        <div className="staff-dashboard">
          <h2>Welcome, {staff.name}</h2>
          <p><strong>Email:</strong> {staff.email}</p>
          <p><strong>Phone:</strong> {staff.phone}</p>

          {/* Announcements */}
          <div className="announcements" style={{ marginTop: '30px' }}>
            <h3>Announcements</h3>
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
    </div>
  );
}

export default StaffDashboard;

