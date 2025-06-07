import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

function AdminViewApplications() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the required data from location.state
  const { applied, application, appliedId, staffId } = location.state || {};

  const [admin, setAdmin] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Load admin info like in other components
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

  if (!admin) return null;

  if (!applied || !application || !appliedId || !staffId) {
    return (
      <div style={{ padding: '20px' }}>
        <p>Invalid request. Missing data.</p>
        <button onClick={() => navigate('/admin-view-applicants', { state: { admin } })}>
          Back to Applicants List
        </button>
      </div>
    );
  }

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
          <button onClick={() => navigate('/About--')}>About</button>
          <button onClick={() => navigate('/admin-profile', { state: { admin } })}>Profile</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-container" style={{ padding: '20px', maxWidth: '700px', margin: 'auto' }}>
        <h2>Application Details</h2>

        <h3>📄 Application Info</h3>
        <p><strong>Name:</strong> {application.name}</p>
        <p><strong>Category:</strong> {application.category}</p>
        <p><strong>Message:</strong> {application.message}</p>
        <p><strong>Status:</strong> {application.status}</p>

        <hr />

        <h3>🧾 Applied Info</h3>
        <p><strong>Name:</strong> {applied.name}</p>
        <p><strong>Email:</strong> {applied.email}</p>
        <p><strong>Phone:</strong> {applied.phone}</p>
        <p><strong>Gender:</strong> {applied.gender}</p>
        <p><strong>Age:</strong> {applied.age}</p>
        <p><strong>Occupation:</strong> {applied.occupation}</p>
        <p><strong>Ward:</strong> {applied.ward}</p>
        <p><strong>Family Members:</strong> {applied.familyMembers}</p>
        <p><strong>Land (in cents):</strong> {applied.land}</p>
        <p><strong>Income:</strong> ₹{applied.income}</p>
        <p><strong>ID Type:</strong> {applied.idType}</p>
        <p><strong>ID Number:</strong> {applied.idNumber}</p>
        <p><strong>Applying Date:</strong> {applied.applyingDate}</p>
        <p><strong>Message:</strong> {applied.message}</p>

        <button
          style={{ marginTop: '20px' }}
          onClick={() => navigate('/admin-view-applicants', { state: { admin } })}
        >
          Back to Applicants List
        </button>
      </div>
    </div>
  );
}

export default AdminViewApplications;
