import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../styles/CheckStatus.css';

function CheckStatus() {
  const [applications, setApplications] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    const fetchStatus = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const appliedQuery = query(
          collection(db, 'Applied'),
          where('userId', '==', user.uid)
        );
        const appliedSnapshot = await getDocs(appliedQuery);

        const statusPromises = appliedSnapshot.docs.map(async (docSnap) => {
          const appliedData = docSnap.data();
          const appliedId = docSnap.id;
          const verify = appliedData.verify;
          const applicationId = appliedData.applicationId;

          let status = 'Just Applied';

          if (verify) {
            const checkedAppDocRef = doc(db, 'CheckedApp', appliedId);
            const checkedAppDocSnap = await getDoc(checkedAppDocRef);

            if (checkedAppDocSnap.exists()) {
              const checkedStatus = checkedAppDocSnap.data().status;
              status = checkedStatus === 'Confirmed'
                ? 'Application Confirmed'
                : 'Application forwarded to rechecking';
            } else {
              status = 'Application Just Viewed';
            }
          }

          let appName = 'Unknown';
          const appDoc = await getDoc(doc(db, 'applications', applicationId));
          if (appDoc.exists()) {
            appName = appDoc.data().name || 'Unnamed Application';
          }

          return {
            id: appliedId,
            appName,
            status,
            message: appliedData.message || ''
          };
        });

        const results = await Promise.all(statusPromises);
        setApplications(results);
      } catch (err) {
        console.error('Error fetching status:', err);
      }
    };

    fetchStatus();
  }, [navigate]);

  return (
    <div>
      {/* Sidebar */}
      <div className={`side-drawer ${drawerOpen ? 'open' : ''}`}>
        <h3>Navigation</h3>
        <ul>
          <li onClick={() => navigate('/dashboard')}>Home</li>
          <li onClick={() => navigate('/applynew')}>Apply New</li>
          <li onClick={() => navigate('/check-status')}>Check Status</li>
          <li onClick={() => navigate('/profile')}>Profile</li>
          <li onClick={() => navigate('/about')}>About</li>
          <li className="logout" onClick={async () => {
            await auth.signOut();
            navigate('/login');
          }}>Logout</li>
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
      <div className="checkstatus-container">
        <h2>Your Application Status</h2>

        {applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          applications.map((app, index) => (
            <div key={index} className="status-card">
              <h4>{app.appName}</h4>
              <p><strong>Status:</strong> {app.status}</p>
              {app.message && <p><strong>Message:</strong> {app.message}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CheckStatus;
