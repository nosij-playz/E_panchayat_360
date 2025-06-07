import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  addDoc
} from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';
import '../styles/Profile.css';
import '../styles/Dashboard.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [userDocId, setUserDocId] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    newPassword: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        navigate('/login');
        return;
      }

      setUser(currentUser);

      const q = query(collection(db, 'users'), where('email', '==', currentUser.email));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        // Existing user document found
        const docRef = snapshot.docs[0];
        setUserDocId(docRef.id);
        setFormData(prev => ({ ...prev, ...docRef.data() }));
      } else {
        // No user doc found, create new one with minimal info
        const userData = {
          email: currentUser.email,
          name: '',
          phone: '',
          age: '',
          gender: '',
          createdAt: new Date()
        };
        const docRef = await addDoc(collection(db, 'users'), userData);
        setUserDocId(docRef.id);
        setFormData(prev => ({ ...prev, ...userData }));
      }

      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    if (!userDocId) return;

    const { name, phone, email, age, gender, newPassword } = formData;

    if (!name || !phone || !email || !age || !gender) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', userDocId), {
        name,
        phone,
        email,
        age,
        gender
      });

      if (newPassword.trim() !== '') {
        await updatePassword(auth.currentUser, newPassword);
        alert('Profile and password updated successfully!');
      } else {
        alert('Profile updated successfully!');
      }

      setFormData(prev => ({
        ...prev,
        newPassword: ''
      }));
    } catch (err) {
      console.error(err);
      alert('Update failed: ' + err.message);
    }
  };

  const logout = async () => {
    await auth.signOut();
    alert('Logged out');
    navigate('/login');
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div>
      {/* Sidebar Drawer */}
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

      {/* Navbar */}
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

      {/* Profile Form */}
      <div className="profile-container">
        <h2>My Profile</h2>

        <label>Name</label>
        <input
          className="profile-input"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
        />

        <label>Email</label>
        <input
          className="profile-input"
          name="email"
          value={formData.email}
          readOnly
          style={{ backgroundColor: '#eee', cursor: 'not-allowed' }}
        />

        <label>Phone</label>
        <input
          className="profile-input"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
        />

        <label>Age</label>
        <input
          className="profile-input"
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
          placeholder="Enter your age"
        />

        <label>Gender</label>
        <select
          className="profile-input"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

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

export default Profile;
