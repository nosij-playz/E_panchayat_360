import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import '../styles/ApplyNew.css';

function ApplyNew() {
  const [applications, setApplications] = useState([]);
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchApplications = async () => {
      const snapshot = await getDocs(collection(db, 'applications'));
      const liveApps = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(app => app.status === 'Live');
      setApplications(liveApps);
    };
    fetchApplications();
  }, []);

  const goToApply = (appId) => {
    if (!user) return;
    navigate('/apply', {
      state: { user: user.email, applicationId: appId }
    });
  };

  const logout = async () => {
    await auth.signOut();
    alert('Logged out');
    navigate('/login');
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      {/* Sidebar */}
      <div className={`side-drawer ${drawerOpen ? 'open' : ''}`}>
        <h3>Navigation</h3>
        <ul>
          <li onClick={() => navigate('/dashboard')}>Home</li>
          <li onClick={() => navigate('/applynew')}>Apply New</li>
          <li onClick={() => navigate('/profile')}>Profile</li>
          <li onClick={() => navigate('/about')}>About</li>
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
          <button onClick={() => navigate('/about')}>About</button>
          <button onClick={() => navigate('/profile')}>Profile</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-container">
        <h2>Available Applications</h2>

        {applications.length === 0 ? (
          <p className="no-apps">No live applications available.</p>
        ) : (
          applications.map(app => (
            <div key={app.id} className="application-card">
              <p><strong>{app.name}</strong> - {app.category}</p>
              <p>{app.message}</p>
              <button
                className="apply-button"
                onClick={() => goToApply(app.id)}
              >
                Apply Now
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ApplyNew;
