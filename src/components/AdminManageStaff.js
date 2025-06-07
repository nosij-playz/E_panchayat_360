import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import {
  collection, getDocs, setDoc, doc, deleteDoc, updateDoc
} from 'firebase/firestore';
import { signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import '../styles/StaffDashboard.css';
import '../styles/AdminManageStaff.css' // Ensure styles are included
function AdminManageStaff() {
  const navigate = useNavigate();
  const location = useLocation();
  const admin = location.state?.admin;

  const [staffList, setStaffList] = useState([]);
  const [editSalaries, setEditSalaries] = useState({});
  const [showNewRow, setShowNewRow] = useState(false);
  const [newStaff, setNewStaff] = useState({
    staffId: '',
    name: '',
    email: '',
    phone: '',
    salary: ''
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!admin) {
      navigate('/admin-dashboard');
    } else {
      fetchStaff();
    }
  }, [admin, navigate]);

  const fetchStaff = async () => {
    const snapshot = await getDocs(collection(db, 'staff'));
    const staffArray = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setStaffList(staffArray);
  };

  const handleAddStaff = async () => {
    try {
      const password = newStaff.name + '123';
      const userCred = await createUserWithEmailAndPassword(auth, newStaff.email, password);
      const uid = userCred.user.uid;

      await setDoc(doc(db, 'staff', newStaff.staffId), {
        ...newStaff,
        uid
      });

      alert(`Staff added with default password: ${password}`);
      setNewStaff({ staffId: '', name: '', email: '', phone: '', salary: '' });
      setShowNewRow(false);
      fetchStaff();
    } catch (error) {
      alert('Error adding staff: ' + error.message);
    }
  };

  const updateSalary = async (id, salary) => {
    try {
      await updateDoc(doc(db, 'staff', id), { salary });
      alert('Salary updated');
      fetchStaff();
    } catch (error) {
      alert('Error updating salary: ' + error.message);
    }
  };

  const deleteStaff = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    try {
      await deleteDoc(doc(db, 'staff', id));
      alert('Staff deleted');
      fetchStaff();
    } catch (error) {
      alert('Error deleting staff: ' + error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  if (!admin) return null;

  return (
    <div>
      {/* Sidebar */}
      <div className={`side-drawer ${drawerOpen ? 'open' : ''}`}>
        <h3>Navigation</h3>
        <ul>
          <li onClick={() => navigate('/admin-dashboard', { state: { staff: admin } })}>Home</li>
          <li onClick={() => navigate('/admin-manage-staff', { state: { staff: admin } })}>Manage Staff</li>
          <li onClick={() => navigate('/admin-manage-applications', { state: { staff: admin } })}>Manage Applications</li>
          <li onClick={() => navigate('/admin-view-applicants', { state: { staff: admin } })}>View Applicants</li>
          <li onClick={() => navigate('/admin-manage-announcement', { state: { staff: admin } })}>Manage Announcements</li>
          <li onClick={() => navigate('/admin-monitor-status', { state: { staff: admin } })}>Monitor Application Status</li>
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
          <button onClick={() => navigate('/admin-profile', { state: { staff: admin } })}>Profile</button>
        </div>
      </div>

      {/* Main Content */}
<div className="dashboard-container">
  <h1>Manage Staff</h1>
  <p><strong>Admin:</strong> {admin?.name}</p>

  <button onClick={() => setShowNewRow(true)} className="add-staff-btn">
    ➕ Add New Staff
  </button>

  {showNewRow && (
    <table>
      <tbody>
        <tr>
          {['staffId', 'name', 'email', 'phone', 'salary'].map(field => (
            <td key={field}>
              <input
                type="text"
                placeholder={field.toUpperCase()}
                value={newStaff[field]}
                onChange={(e) => setNewStaff({ ...newStaff, [field]: e.target.value })}
              />
            </td>
          ))}
          <td>
            <button onClick={handleAddStaff} className="update-btn">✔️ Add</button>
          </td>
        </tr>
      </tbody>
    </table>
  )}

  <h2>All Staff</h2>
  <table>
    <thead>
      <tr>
        <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Salary</th><th>Update</th><th>Delete</th>
      </tr>
    </thead>
    <tbody>
      {staffList.map((staff) => (
        <tr key={staff.staffId}>
          <td>{staff.staffId}</td>
          <td>{staff.name}</td>
          <td>{staff.email}</td>
          <td>{staff.phone}</td>
          <td>
            <input
              type="text"
              value={editSalaries[staff.staffId] || staff.salary}
              onChange={(e) =>
                setEditSalaries({ ...editSalaries, [staff.staffId]: e.target.value })
              }
            />
          </td>
          <td>
            <button
              onClick={() =>
                updateSalary(staff.staffId, editSalaries[staff.staffId] || staff.salary)
              }
              className="update-btn"
            >
              Update
            </button>
          </td>
          <td>
            <button
              onClick={() => deleteStaff(staff.staffId)}
              className="delete-btn"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
  </div>
  );
}

export default AdminManageStaff;
