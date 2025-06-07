// About.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import '../styles/Dashboard.css';
import '../styles/StaffDashboard.css';

function About() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const localAdmin = JSON.parse(localStorage.getItem('admin'));
    const localStaff = JSON.parse(localStorage.getItem('staff'));

    if (auth.currentUser && localAdmin) {
      setUser({
        ...auth.currentUser,
        displayName: localAdmin.name || auth.currentUser.displayName || auth.currentUser.email,
      });
      setUserRole('admin');
    } else if (auth.currentUser && localStaff) {
      setUser({
        ...auth.currentUser,
        displayName: localStaff.name || auth.currentUser.displayName || auth.currentUser.email,
      });
      setUserRole('staff');
    } else if (auth.currentUser) {
      const fetchUserProfile = async () => {
        try {
          let userDocRef = doc(db, 'admin', auth.currentUser.uid);
          let userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUser({
              ...auth.currentUser,
              displayName: userData.name || auth.currentUser.displayName || auth.currentUser.email,
            });
            localStorage.setItem('admin', JSON.stringify(userData));
            setUserRole('admin');
            return;
          }

          userDocRef = doc(db, 'users', auth.currentUser.uid);
          userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUser({
              ...auth.currentUser,
              displayName: userData.name || auth.currentUser.displayName || auth.currentUser.email,
            });
            localStorage.setItem('staff', JSON.stringify(userData));
            setUserRole('staff');
          } else {
            setUser({
              ...auth.currentUser,
              displayName: auth.currentUser.displayName || auth.currentUser.email,
            });
            setUserRole('staff');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };

      fetchUserProfile();
    } else if (localAdmin) {
      setUser({
        displayName: localAdmin.name || localAdmin.email,
        email: localAdmin.email
      });
      setUserRole('admin');
    } else if (localStaff) {
      setUser({
        displayName: localStaff.name || localStaff.email,
        email: localStaff.email
      });
      setUserRole('staff');
    } else {
      navigate('/staff-login');
    }
  }, [navigate]);

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('staff');
      localStorage.removeItem('admin');
      navigate(userRole === 'admin' ? '/staff-login' : '/staff-login');
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
          {userRole === 'staff' ? (
            <>
              <li onClick={() => navigate('/staff-dashboard')}>Home</li>
              <li onClick={() => navigate('/new-applied')}>New Applied</li>
              <li onClick={() => navigate('/staff-profile', { state: { staff: user } })}>Profile</li>
            </>
          ) : (
            <>
              <li onClick={() => navigate('/admin-dashboard', { state: { admin: user } })}>Home</li>
              <li onClick={() => navigate('/admin-profile', { state: { admin: user } })}>Profile</li>
            </>
          )}
          <li onClick={() => navigate('/About--')}>About</li>
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
          <button onClick={() => navigate('/About--')}>About</button>
          <button
            onClick={() =>
              navigate(
                userRole === 'admin' ? '/admin-profile' : '/staff-profile',
                { state: userRole === 'admin' ? { admin: user } : { staff: user } }
              )
            }
          >
            Profile
          </button>
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
    </div>
  );
}

export default About;
