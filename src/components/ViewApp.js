import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/ViewApp.css';

function ViewApp() {
  const location = useLocation();
  const navigate = useNavigate();

  const { applied, application, appliedId, staffId } = location.state || {};

  if (!applied || !application || !appliedId || !staffId) {
    return <p>Invalid request. Missing data.</p>;
  }

  const handleDecision = async (status) => {
    try {
      // Step 1: Save decision to CheckedApp collection
      await setDoc(doc(db, 'CheckedApp', appliedId), {
        appliedId,
        status,
        staffId,
      });

      // Step 2: Update verify field to true in Applied collection
      await updateDoc(doc(db, 'Applied', appliedId), {
        verify: true,
      });

      alert(`Application ${status}`);
      navigate(-1); // go back
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  return (
    <div className="view-app-container">
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

      <div className="view-app-buttons">
        <button className="accept" onClick={() => handleDecision('Accepted')}>✅ Accept</button>
        <button className="reject" onClick={() => handleDecision('Rejected')}>❌ Reject</button>
        <button className="back" onClick={() => navigate(-1)}>🔙 Back</button>
      </div>
    </div>
  );
}

export default ViewApp;
