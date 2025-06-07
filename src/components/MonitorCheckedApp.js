import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';

function MonitorCheckedApp() {
  const [data, setData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const admin = location.state?.admin;

  useEffect(() => {
    if (!admin) {
      alert('Access denied. Please login as admin.');
      navigate('/staff-login');
    }
  }, [admin, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const checkedSnap = await getDocs(collection(db, 'CheckedApp'));
        const results = [];

        for (const docSnap of checkedSnap.docs) {
          const checked = docSnap.data();
          const appliedId = checked.appliedId;

          const appliedDoc = await getDoc(doc(db, 'Applied', appliedId));
          if (!appliedDoc.exists()) continue;

          const applied = appliedDoc.data();

          const userDoc = await getDoc(doc(db, 'users', applied.userId));
          const user = userDoc.exists() ? userDoc.data() : {};

          const appDoc = await getDoc(doc(db, 'applications', applied.applicationId));
          const application = appDoc.exists() ? appDoc.data() : {};

          results.push({
            id: docSnap.id,
            status: checked.status,
            appliedId,
            name: user.name || 'Unknown',
            phone: user.phone || 'Unknown',
            applicationName: application.name || 'Unknown'
          });
        }

        setData(results);
      } catch (error) {
        console.error(error);
        alert('Failed to fetch checked applications.');
      }
    };

    fetchData();
  }, []);

  const updateStatus = async (id, newStatus, appliedId) => {
    try {
      await updateDoc(doc(db, 'CheckedApp', id), { status: newStatus });
      const verifyValue = newStatus === 'Confirmed';
      await updateDoc(doc(db, 'Applied', appliedId), { verify: verifyValue });

      setData(prev =>
        prev.map(item =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('admin');
    navigate('/');
  };

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  if (!admin) return null;

  return (
    <div>
      {/* Sidebar */}
      <div className={`side-drawer ${drawerOpen ? 'open' : ''}`}>
        <h3>Navigation</h3>
        <ul>
          <li onClick={() => navigate('/admin-dashboard', { state: { admin } })}>Home</li>
          <li onClick={() => navigate('/admin-manage-staff', { state: { admin } })}>Manage Staff</li>
          <li onClick={() => navigate('/admin-manage-applications', { state: { admin } })}>Manage Applications</li>
          <li onClick={() => navigate('/admin-view-applicants', { state: { admin } })}>View Applicants</li>
          <li onClick={() => navigate('/admin-manage-announcement', { state: { admin } })}>Manage Announcements</li>
          <li onClick={() => navigate('/admin-monitor-status', { state: { admin } })}>Monitor Application Status</li>
          <li className="logout" onClick={logout}>Logout</li>
        </ul>
      </div>

      {/* Navbar */}
      <div className="navbar">
        <div className="left" onClick={toggleDrawer} style={{ cursor: 'pointer' }}>
          <span className="hamburger">&#9776;</span>
          <span className="logo">E-panchayat 360</span>
        </div>
        <div className="right">
          <button onClick={() => navigate('/About-')}>About</button>
          <button onClick={() => navigate('/admin-profile', { state: { admin } })}>Profile</button>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 60px)',
          boxSizing: 'border-box',
          marginTop: '10px'
        }}
      >
        <div style={{ width: '700px' }}>
          <h2>Monitor Checked Applications</h2>

          {data.length === 0 ? (
            <p>No checked applications available.</p>
          ) : (
            data.map((item, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid #ccc',
                  padding: '15px',
                  marginBottom: '10px',
                  borderRadius: '8px'
                }}
              >
                <p><strong>Applicant Name:</strong> {item.name}</p>
                <p><strong>Phone:</strong> {item.phone}</p>
                <p><strong>Application:</strong> {item.applicationName}</p>
                <p><strong>Status:</strong> {item.status}</p>

                <button
                  onClick={() => updateStatus(item.id, 'Confirmed', item.appliedId)}
                  style={{
                    marginRight: '10px',
                    padding: '6px 12px',
                    backgroundColor: '#28a745',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Confirm
                </button>
                <button
                  onClick={() => updateStatus(item.id, 'Recheck', item.appliedId)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Recheck
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MonitorCheckedApp;
