import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase project configuration
// Get this from Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "AIzaSyBRZ30efVNxgMSHwx8m63vS6RaY7k5SvCo",
  authDomain: "projectmobilepertemuan10.firebaseapp.com",
  projectId: "projectmobilepertemuan10",
  storageBucket: "projectmobilepertemuan10.firebasestorage.app",
  messagingSenderId: "358056690698",
  appId: "1:358056690698:web:33744339d9e5cf0d98cbf3",
  measurementId: "G-1EFVK8WJCD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
