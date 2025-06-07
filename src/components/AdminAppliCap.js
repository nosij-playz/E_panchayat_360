import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import '../styles/StaffDashboard.css';
import '../styles/AdminAppCap.css';
const predefinedCategories = [
  'Complaints',
  'Certificate',
  'Financial Support',
  'Customer Grievance',
  'Water Connection',
  'Electricity',
  'Housing Scheme'
];

function AdminAppliCap() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const [admin, setAdmin] = useState(null);

  // Get admin from location or localStorage (like in your AdminDashboard)
  useEffect(() => {
    const stateAdmin = location.state?.admin || location.state?.staff;
    const storedAdmin = localStorage.getItem('admin');

    if (stateAdmin) {
      localStorage.setItem('admin', JSON.stringify(stateAdmin));
      setAdmin(stateAdmin);
    } else if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    } else {
      alert('Access denied. Please login as admin.');
      navigate('/staff-login');
    }
  }, [location.state, navigate]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('admin');
    navigate('/');
  };

  const applicationsRef = collection(db, 'applications');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(applicationsRef);
        const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setApplications(apps);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      } finally {
        setLoading(false);
      }
    };
    if (admin) fetchData();
  }, [admin]);

  const updateLocalApplication = (index, key, value) => {
    const updated = [...applications];
    updated[index][key] = value;
    setApplications(updated);
  };

  const addApplication = async () => {
    const newApp = {
      name: '',
      message: '',
      category: predefinedCategories[0],
      status: 'Offline'
    };
    try {
      const docRef = await addDoc(applicationsRef, newApp);
      setApplications([...applications, { id: docRef.id, ...newApp }]);
    } catch (error) {
      alert('Error adding application: ' + error.message);
    }
  };

  const saveApplication = async (index) => {
    const app = applications[index];
    try {
      const appRef = doc(db, 'applications', app.id);
      await updateDoc(appRef, {
        name: app.name,
        message: app.message,
        category: app.category,
        status: app.status
      });
      alert('Application updated successfully.');
    } catch (error) {
      alert('Error updating application: ' + error.message);
    }
  };

  const deleteApplication = async (index) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    const app = applications[index];
    try {
      const appRef = doc(db, 'applications', app.id);
      await deleteDoc(appRef);
      setApplications(applications.filter((_, i) => i !== index));
    } catch (error) {
      alert('Error deleting application: ' + error.message);
    }
  };

  if (!admin) return null;
  if (loading) return <p>Loading...</p>;

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
          <button onClick={() => navigate('/admin-profile', { state: { admin } })}>
            Profile
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-container" style={{ padding: '20px' }}>
        <h2>Manage Applications</h2>

        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Application Name</th>
              <th>Message</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={app.id}>
                <td>
                  <input
                    type="text"
                    value={app.name}
                    onChange={(e) => updateLocalApplication(index, 'name', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={app.message}
                    onChange={(e) => updateLocalApplication(index, 'message', e.target.value)}
                  />
                </td>
                <td>
                  <select
                    value={app.category}
                    onChange={(e) => updateLocalApplication(index, 'category', e.target.value)}
                  >
                    {predefinedCategories.map((cat, i) => (
                      <option key={i} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={app.status}
                    onChange={(e) => updateLocalApplication(index, 'status', e.target.value)}
                  >
                    <option value="Live">Live</option>
                    <option value="Offline">Offline</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => saveApplication(index)}>Update</button>
                  <button onClick={() => deleteApplication(index)} style={{ marginLeft: '10px' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={addApplication} style={{ marginTop: '20px' }}>
          Add New Application
        </button>
      </div>
    </div>
  );
}

export default AdminAppliCap;
