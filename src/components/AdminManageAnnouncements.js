import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/StaffDashboard.css';
import '../styles/Adminannouncement.css'; // Use this CSS

function AdminManageAnnouncements() {
  const [message, setMessage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [editingId, setEditingId] = useState(null);
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
    const q = query(collection(db, 'announcements'), orderBy('startDate', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('admin');
    navigate('/');
  };

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const handleAddOrUpdate = async () => {
    if (!message.trim() || !startDate || !endDate) {
      alert('Please fill in all fields.');
      return;
    }

    const data = {
      message: message.trim(),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      timestamp: serverTimestamp()
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, 'announcements', editingId), data);
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'announcements'), data);
      }

      setMessage('');
      setStartDate('');
      setEndDate('');
    } catch (e) {
      console.error('Error saving announcement:', e);
      alert('Operation failed.');
    }
  };

  const handleEdit = (a) => {
    setMessage(a.message);
    setStartDate(a.startDate.toDate().toISOString().split('T')[0]);
    setEndDate(a.endDate.toDate().toISOString().split('T')[0]);
    setEditingId(a.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      await deleteDoc(doc(db, 'announcements', id));
    }
  };

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
        <div className="left" onClick={toggleDrawer}>
          <span className="hamburger">&#9776;</span>
          <span className="logo">E-panchayat 360</span>
        </div>
        <div className="right">
          <button onClick={() => navigate('/About--')}>About</button>
          <button onClick={() => navigate('/admin-profile', { state: { admin } })}>Profile</button>
        </div>
      </div>

      {/* Main content */}
      <div className="announcement-container">
        <div className="announcement-form">
          <h2>{editingId ? 'Edit Announcement' : 'New Announcement'}</h2>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input-field"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input-field"
          />
          <textarea
            placeholder="Enter announcement message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="textarea-field"
          />
          <button onClick={handleAddOrUpdate} className="primary-button">
            {editingId ? 'Update' : 'Add'} Announcement
          </button>

          <hr className="divider" />

          <h3>All Announcements</h3>
          {announcements.length === 0 ? (
            <p>No announcements available.</p>
          ) : (
            announcements.map((a) => (
              <div key={a.id} className="announcement-item">
                <p><strong>Message:</strong> {a.message}</p>
                <p><strong>Start:</strong> {new Date(a.startDate.seconds * 1000).toDateString()}</p>
                <p><strong>End:</strong> {new Date(a.endDate.seconds * 1000).toDateString()}</p>
                <button onClick={() => handleEdit(a)} className="secondary-button">Edit</button>
                <button onClick={() => handleDelete(a.id)} className="secondary-button">Delete</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminManageAnnouncements;
