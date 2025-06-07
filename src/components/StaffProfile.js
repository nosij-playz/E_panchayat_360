import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';
import '../styles/Profile.css';
import '../styles/StaffDashboard.css';

function StaffProfile() {
  const location = useLocation();
  const navigate = useNavigate();

  // Step 2: Use local state staff, fallback to localStorage if location.state.staff missing
  const [staff, setStaff] = useState(location.state?.staff || null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    newPassword: ''
  });

  const [userDocId, setUserDocId] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!staff) {
      // Try load from localStorage
      const localStaff = localStorage.getItem('staff');
      if (localStaff) {
        setStaff(JSON.parse(localStaff));
      } else {
        // If still no staff info, redirect to login
        navigate('/staff-login');
      }
    }
  }, [staff, navigate]);

  useEffect(() => {
    if (!staff) return;

    // Save staff info to localStorage for persistence
    localStorage.setItem('staff', JSON.stringify(staff));

    // Fetch staff user data from Firestore
    const fetchStaffData = async () => {
      try {
        const q = query(collection(db, 'staff'), where('email', '==', staff.email));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const docRef = snapshot.docs[0];
          setUserDocId(docRef.id);
          setFormData(prev => ({ ...prev, ...docRef.data() }));
        }
      } catch (error) {
        console.error('Error fetching staff data:', error);
      }
    };

    fetchStaffData();
  }, [staff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!userDocId) return;

    const { name, phone, email, age, gender, newPassword } = formData;

    if (!name || !phone || !email || !age || !gender) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      await updateDoc(doc(db, 'staff', userDocId), {
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

      setFormData(prev => ({ ...prev, newPassword: '' }));
    } catch (err) {
      console.error(err);
      alert('Update failed: ' + err.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('staff');  // Clear stored staff on logout
      alert('Logged out');
      navigate('/staff-login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  if (!staff) return <p>Loading...</p>;

  return (
    <div>
      {/* Sidebar Drawer */}
      <div className={`side-drawer ${drawerOpen ? 'open' : ''}`}>
        <h3>Navigation</h3>
        <ul>
          <li onClick={() => navigate('/staff-dashboard', { state: { staff } })}>Home</li>
          <li onClick={() => navigate('/new-applied', { state: { staff } })}>New Applied</li>
          <li onClick={() => navigate('/staff-profile', { state: { staff } })}>Profile</li>
          <li onClick={() => navigate('/About-')}>About</li>
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
          <button onClick={() => navigate('/staff-profile', { state: { staff } })}>Profile</button>
        </div>
      </div>

      {/* Profile Form */}
      <div className="profile-container">
        <h2>Staff Profile</h2>

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

        <label>Age</label>
        <input
          className="profile-input"
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
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

export default StaffProfile;
