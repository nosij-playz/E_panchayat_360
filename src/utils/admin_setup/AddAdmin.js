(async () => {
  // Polyfill fetch, Headers, Response
  const fetchModule = await import('node-fetch');
  global.fetch = (...args) => fetchModule.default(...args);
  global.Headers = fetchModule.Headers;
  global.Response = fetchModule.Response;

  const adminData = require('./adminConfig.json');
  const { initializeApp } = require('firebase/app');
  const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
  const { getFirestore, doc, setDoc } = require('firebase/firestore');

  const firebaseConfig = {
  apiKey: "AIzaSyDpZ3XJBEt16hagwI11CALsCh2jgO-Pk2o",
  authDomain: "digital-e-gram-panchayat-4defc.firebaseapp.com",
  projectId: "digital-e-gram-panchayat-4defc",
  storageBucket: "digital-e-gram-panchayat-4defc.firebasestorage.app",
  messagingSenderId: "349269940213",
  appId: "1:349269940213:web:24a1bca3d9cb7dcc0d72bc"
};


  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  async function addAdmin() {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, adminData.email, adminData.password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'admin', adminData.adminId), {
        uid,
        ...adminData
      });

      console.log('✅ Admin added successfully.');
    } catch (error) {
      console.error('❌ Error adding admin:', error.message);
    }
  }

  await addAdmin();
})();
