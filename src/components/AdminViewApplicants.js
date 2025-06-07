import React, { useState } from 'react';
import '../styles/NewApplied.css';
import '../styles/StaffDashboard.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from '../firebase';
import {
  getDocs,
  collection,
  query,
  where
} from 'firebase/firestore';

// Predefined categories
const predefinedCategories = [
  'Complaints',
  'Certificate',
  'Financial Support',
  'Customer Grievance',
  'Water Connection',
  'Electricity',
  'Housing Scheme'
];

const AdminViewApplicants = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin } = location.state || {};

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [appliedData, setAppliedData] = useState([]);
  const [category, setCategory] = useState('');

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const logout = () => {
    navigate('/admin-login');
  };

  const fetchApplications = async () => {
    if (!category) {
      alert('Please select a category first.');
      return;
    }

    try {
      const appSnap = await getDocs(
        query(collection(db, 'applications'), where('category', '==', category))
      );

      const applicationsMap = {};
      appSnap.forEach(doc => {
        applicationsMap[doc.id] = doc.data();
      });

      const appliedSnap = await getDocs(collection(db, 'Applied'));

      const matched = [];
      for (const docSnap of appliedSnap.docs) {
        const applied = docSnap.data();
        const app = applicationsMap[applied.applicationId];

        if (app) {
          matched.push({
            id: docSnap.id,
            applied,
            application: app
          });
        }
      }

      setAppliedData(matched);
    } catch (err) {
      console.error(err);
      alert('Error fetching applications.');
    }
  };

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

      {/* Top Navbar */}
      <div className="navbar">
        <div className="left" onClick={toggleDrawer} style={{ cursor: 'pointer' }}>
          <span className="hamburger">&#9776;</span>
          <span className="logo">E-panchayat 360</span>
        </div>
        <div className="right">
          <button onClick={() => navigate('/About--', { state: { admin } })}>About</button>
          <button onClick={() => navigate('/admin-profile', { state: { admin } })}>Profile</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="new-applied-container">
        <h2>View Applicants</h2>

        <div className="category-select">
          <label htmlFor="category">Select Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">--Select--</option>
            {predefinedCategories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
          <button onClick={fetchApplications}>View</button>
        </div>

        {appliedData.length > 0 ? (
          <div className="applications-list">
            {appliedData.map((item, index) => (
              <div key={index} className="application-card">
                <p><strong>Applicant Name:</strong> {item.applied.name || 'Unknown'}</p>
                <p><strong>Applicant ID:</strong> {item.applied.userId || 'N/A'}</p>
                <p><strong>Application:</strong> {item.application.name || 'N/A'}</p>
                <p><strong>Scheme:</strong> {item.application.category || 'N/A'}</p>
                <p><strong>Message:</strong> {item.applied.message || 'N/A'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-results">No applications found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default AdminViewApplicants;
