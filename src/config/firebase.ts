import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB74qhuHAzo-CozaoF5j2dXI7ldZzDC0JU",
  authDomain: "my-dewi-shop-nc.firebaseapp.com",
  projectId: "my-dewi-shop-nc",
  storageBucket: "my-dewi-shop-nc.firebasestorage.app",
  messagingSenderId: "336216013917",
  appId: "1:336216013917:web:fe2bf267d216d43f6961b4",
  measurementId: "G-D44HKQ9ELF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app;