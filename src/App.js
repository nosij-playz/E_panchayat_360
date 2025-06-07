// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import StaffLogin from './components/StaffLogin';
import StaffDashboard from './components/StaffDashboard';
import AdminDashboard from './components/AdminDashboard'; 
import AdminManageStaff from './components/AdminManageStaff'; 
import AdminAppliCap from './components/AdminAppliCap';
import AdminViewApplicants from './components/AdminViewApplicants';
import AdminManageAnnouncements from './components/AdminManageAnnouncements';
import Profile from './components/Profile'; // Import Profile component
import AppApply from './components/AppApply';
import ViewApp from './components/ViewApp';
import MonitorCheckedApp from './components/MonitorCheckedApp';
import AdmincheckApps from './components/Adminviewapp'; // Import 
// Import AdmincheckApps component
import CheckStatus from './components/CheckStatus';
import ApplyNew from './components/ApplyNew'; 
import About from './components/About'; // Import About component
import About1 from './components/About_copy'; // Import About component
import StaffProfile from './components/StaffProfile';
import NewApplied from './components/NewApplied';
import AdminProfile from './components/AdminProfile'; // Import AdminProfile component
import AdminAbout from './components/About--'; // Import AdminAbout component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />                {/* Login page at root */}
        <Route path="/register" element={<Register />} />     {/* Register page */}
        <Route path="/dashboard" element={<Dashboard />} />   {/* Dashboard after login */}
        <Route path="/" element={<Home />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        {/* Add more routes as needed */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />{/* Admin Dashboard route */}
        <Route path="/admin-manage-staff" element={<AdminManageStaff />} />
        <Route path="/admin-manage-applications" element={<AdminAppliCap />} />
        <Route path="/admin-view-applicants" element={<AdminViewApplicants />} />
        <Route path="/admin-manage-announcement" element={<AdminManageAnnouncements />} />
        <Route path="/profile" element={<Profile />} /> {/* User Profile route */}
        <Route path="/apply" element={<AppApply />} /> {/* Application Form route */}
        <Route path="/viewapp" element={<ViewApp />} /> {/* View Application route */}
        <Route path="/admin-monitor-status" element={<MonitorCheckedApp />} /> 
        
        <Route path="/admin-view" element={<AdmincheckApps />} />
        <Route path="/check-status" element={<CheckStatus />} /> {/* Admin Check Applications route */}
        <Route path="/applynew" element={<ApplyNew />} />
        <Route path="/about" element={<About />} /> {/* About page route */}
        <Route path="/About-" element={<About1 />} />
        <Route path="/staff-profile" element={<StaffProfile />} /> {/* Staff Profile route */}
        <Route path="/new-applied" element={<NewApplied />} /> {/* New Applied route */}
        <Route path="/admin-profile" element={<AdminProfile />} /> 
        <Route path="/About--" element={<AdminAbout />} /> {/* Admin About route */}
        {/* Add more admin routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
