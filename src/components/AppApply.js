import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  doc, getDoc, collection, addDoc, serverTimestamp, query,
  where, getDocs, updateDoc, deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { auth } from '../firebase';
import '../styles/Apply.css';

function AppApply() {
  const location = useLocation();
  const navigate = useNavigate();
  const { applicationId } = location.state || {};

  const [application, setApplication] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [existingApplication, setExistingApplication] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    income: '',
    ward: '',
    land: '',
    occupation: '',
    familyMembers: '',
    idType: 'Aadhaar',
    idNumber: '',
    applyingDate: today,
    message: ''
  });

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!applicationId || !uid) {
      alert('Invalid Access');
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const appDoc = await getDoc(doc(db, 'applications', applicationId));
        if (!appDoc.exists()) throw new Error('Application not found');
        setApplication(appDoc.data());

        const userQuery = query(collection(db, 'users'), where('email', '==', auth.currentUser.email));
        const userSnap = await getDocs(userQuery);

        if (userSnap.empty) {
          alert('Please complete your profile before applying.');
          navigate('/profile');
          return;
        }

        const userData = userSnap.docs[0];
        const userId = userData.id;
        setUserDoc({ id: userId, ...userData.data() });

        const appQuery = query(
          collection(db, 'Applied'),
          where('applicationId', '==', applicationId),
          where('userId', '==', userId)
        );
        const appliedSnap = await getDocs(appQuery);

        if (!appliedSnap.empty) {
          const existing = appliedSnap.docs[0];
          setExistingApplication({ id: existing.id, ...existing.data() });
          setFormData(prev => ({
            ...prev,
            ...existing.data(),
            applyingDate: existing.data().applyingDate || today
          }));
        }
      } catch (err) {
        console.error(err);
        alert(err.message);
        navigate('/dashboard');
      }
    };

    fetchData();
  }, [applicationId, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const requiredFields = { ...formData };
    delete requiredFields.applyingDate;

    const allFilled = Object.values(requiredFields).every(val => val.trim() !== '');
    if (!allFilled) {
      alert('Please fill in all fields.');
      return;
    }

    const applicationData = {
      applicationId,
      userId: userDoc.id,
      name: userDoc.name,
      email: userDoc.email,
      phone: userDoc.phone,
      ...formData,
      verify: false,
      timestamp: serverTimestamp()
    };

    try {
      if (existingApplication) {
        await updateDoc(doc(db, 'Applied', existingApplication.id), applicationData);
        alert('Application updated!');
      } else {
        await addDoc(collection(db, 'Applied'), applicationData);
        alert('Application submitted!');
      }
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Operation failed.');
    }
  };

  const handleDelete = async () => {
    if (!existingApplication) return;
    const confirm = window.confirm("Are you sure you want to delete your application?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'Applied', existingApplication.id));
      alert('Application deleted.');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Delete failed.');
    }
  };

  if (!application || !userDoc) return <p>Loading...</p>;

  return (
    <div className="apply-container">
      <h2>Apply for: {application.name}</h2>
      <p><strong>Category:</strong> {application.category}</p>
      <p><strong>Status:</strong> {application.status}</p>
      <p><strong>Description:</strong> {application.message}</p>

      <div>
        <h3>Your Details</h3>
        <input type="text" value={userDoc.name} readOnly placeholder="Name" />
        <input type="text" value={userDoc.email} readOnly placeholder="Email" />
        <input type="text" value={userDoc.phone || ''} readOnly placeholder="Phone" />

        <input name="age" placeholder="Age" value={formData.age} onChange={handleChange} />
        <input name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} />
        <input name="income" placeholder="Income" value={formData.income} onChange={handleChange} />
        <input name="ward" placeholder="Ward" value={formData.ward} onChange={handleChange} />
        <input name="land" placeholder="Land Area (e.g., 2 acres)" value={formData.land} onChange={handleChange} />
        <input name="occupation" placeholder="Occupation" value={formData.occupation} onChange={handleChange} />
        <input name="familyMembers" placeholder="Number of Family Members" value={formData.familyMembers} onChange={handleChange} />

        <div className="apply-row apply-split">
          <select name="idType" value={formData.idType} onChange={handleChange}>
            <option value="Aadhaar">Aadhaar</option>
            <option value="Driving License">Driving License</option>
            <option value="Passport">Passport</option>
            <option value="Voter ID">Voter ID</option>
            <option value="Other">Other</option>
          </select>
          <input name="idNumber" placeholder="ID Number" value={formData.idNumber} onChange={handleChange} />
        </div>

        <input name="applyingDate" value={formData.applyingDate} readOnly />

        <textarea
          name="message"
          placeholder="Why are you applying?"
          rows={4}
          value={formData.message}
          onChange={handleChange}
        />

        <div className="apply-actions">
          <button onClick={handleSubmit}>
            {existingApplication ? 'Update Application' : 'Submit Application'}
          </button>

          {existingApplication && (
            <button
              className="apply-danger"
              onClick={handleDelete}
            >
              Delete Application
            </button>
          )}
        </div>

        <button
          className="apply-back-button"
          onClick={() => navigate('/dashboard')}
          style={{ marginTop: '20px' }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default AppApply;
