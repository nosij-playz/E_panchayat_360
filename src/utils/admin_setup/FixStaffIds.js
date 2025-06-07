// FixStaffIds.js
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');

// ✅ Add your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDpZ3XJBEt16hagwI11CALsCh2jgO-Pk2o",
  authDomain: "digital-e-gram-panchayat-4defc.firebaseapp.com",
  projectId: "digital-e-gram-panchayat-4defc",
  storageBucket: "digital-e-gram-panchayat-4defc.firebasestorage.app",
  messagingSenderId: "349269940213",
  appId: "1:349269940213:web:24a1bca3d9cb7dcc0d72bc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixMissingStaffIds() {
  const snapshot = await getDocs(collection(db, 'staff'));
  let updatedCount = 0;

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();

    if (!data.staffId || data.staffId.trim() === '') {
      const docRef = doc(db, 'staff', docSnap.id);
      await updateDoc(docRef, { staffId: docSnap.id });
      console.log(`✔️ Updated document ${docSnap.id} with missing staffId`);
      updatedCount++;
    }
  }

  console.log(`\n✅ Done. ${updatedCount} document(s) were updated.`);
}

fixMissingStaffIds().catch(console.error);
