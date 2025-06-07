import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import '../styles/Dashboard.css';

function About() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const fetchUserProfile = async () => {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUser({
              ...currentUser,
              displayName: userData.name || currentUser.displayName || currentUser.email,
            });
          } else {
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
    <>
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
        <h1>About This Application</h1>

        <section>
          <h2>Features</h2>
          <ul>
            <li>Browse and apply for various government or organizational applications easily.</li>
            <li>Real-time user authentication and profile management with Firebase Auth.</li>
            <li>Submit, update, or delete your applications smoothly.</li>
            <li>View application statuses and detailed descriptions.</li>
            <li>Interactive and user-friendly UI built with React and Firebase Firestore.</li>
            <li>Secure and efficient data storage and retrieval with Firestore.</li>
            <li>Responsive design to work well on desktop and mobile devices.</li>
          </ul>
        </section>

        <section>
          <h2>Developer</h2>
          <p>
            This app was developed by <strong>Jison Joseph Sebastian</strong>. For updates, queries, or support, please visit the contact page below.
          </p>
          <p>
            <a
              href="https://myporfolio-1o1h.onrender.com/contact"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact Developer
            </a>
          </p>
        </section>
      </div>
    </>
  );
}

export default About;
