import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
} from 'firebase/firestore';
import '../styles/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      // Fetch user profile from Firestore
      const fetchUserProfile = async () => {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            // Set user object with displayName from Firestore or fallback to auth displayName/email
            setUser({
              ...currentUser,
              displayName: userData.name || currentUser.displayName || currentUser.email,
            });
          } else {
            // No Firestore profile, use auth info
            setUser({
              ...currentUser,
              displayName: currentUser.displayName || currentUser.email,
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser({
            ...currentUser,
            displayName: currentUser.displayName || currentUser.email,
          });
        }
      };
      fetchUserProfile();
    } else {
      navigate('/login');
    }
  }, [navigate]);

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
      alert('Logged out');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
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
    <li onClick={() => navigate('/check-status')}>Check Status</li> {/* New menu item */}
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
        <h2>Welcome, {user.displayName}</h2>

        {/* Announcements Section */}
        <div className="announcements">
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
  );
}

export default Dashboard;
