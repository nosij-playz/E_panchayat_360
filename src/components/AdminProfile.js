import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut, updatePassword } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import '../styles/Profile.css';
import '../styles/StaffDashboard.css';

function AdminProfile() {
  const location = useLocation();
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(location.state?.admin || null);

  const [formData, setFormData] = useState({
    adminId: '',
    name: '',
    email: '',
    phone: '',
    uid: '',
    newPassword: ''
  });

  const [userDocId, setUserDocId] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!admin) {
      const localAdmin = localStorage.getItem('admin');
      if (localAdmin) {
        setAdmin(JSON.parse(localAdmin));
      } else {
        navigate('/admin-login');
      }
    }
  }, [admin, navigate]);

  useEffect(() => {
    if (!admin) return;

    localStorage.setItem('admin', JSON.stringify(admin));

    const fetchAdminData = async () => {
      try {
        const q = query(collection(db, 'admin'), where('email', '==', admin.email));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const docRef = snapshot.docs[0];
          setUserDocId(docRef.id);
          setFormData(prev => ({ ...prev, ...docRef.data() }));
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchAdminData();
  }, [admin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!userDocId) return;

    const { name, phone, email, newPassword } = formData;

    if (!name || !phone || !email) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      await updateDoc(doc(db, 'admin', userDocId), {
        name,
        phone,
        email
      });

      if (newPassword.trim() !== '') {
        await updatePassword(auth.currentUser, newPassword);
        alert('Profile and password updated successfully!');
      } else {
        alert('Profile updated successfully!');
      }

      setFormData(prev => ({ ...prev, newPassword: '' }));
    } catch (err) {
      console.error(err);
      alert('Update failed: ' + err.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('admin');
      alert('Logged out');
      navigate('/admin-login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  if (!admin) return <p>Loading...</p>;

  return (
    <div>
      {/* Sidebar Drawer */}
      <div className={`side-drawer ${drawerOpen ? 'open' : ''}`}>
        <h3>Navigation</h3>
        <ul>
          <li onClick={() => navigate('/admin-dashboard', { state: { admin } })}>Home</li>
          <li onClick={() => navigate('/admin-profile', { state: { admin } })}>Profile</li>
          <li onClick={() => navigate('/About--')}>About</li>
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

      {/* Profile Form */}
      <div className="profile-container">
        <h2>Admin Profile</h2>

        <label>Admin ID</label>
        <input
          className="profile-input"
          name="adminId"
          value={formData.adminId}
          readOnly
        />

        <label>Name</label>
        <input
          className="profile-input"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          className="profile-input"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <label>Phone</label>
        <input
          className="profile-input"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <label>UID</label>
        <input
          className="profile-input"
          name="uid"
          value={formData.uid}
          readOnly
        />

        <label>
          New Password{' '}
          <span style={{ fontWeight: 'normal', fontSize: '0.9rem' }}>
            (leave empty to keep same)
          </span>
        </label>
        <input
          className="profile-input"
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={handleChange}
        />

        <div className="profile-buttons">
          <button className="update-button" onClick={handleUpdate}>
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
