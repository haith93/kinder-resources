
// // src/lib/firebase.js
// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';

// Your Firebase configuration
// Replace these values with your actual Firebase project credentials
// Get these from: Firebase Console > Project Settings > Your Apps > SDK setup and configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCD4yFsJNlFw6E3ezQvBzWXNGSPCzmedl8",
//   authDomain: "kinder-resources.firebaseapp.com",
//   projectId: "kinder-resources",
//   storageBucket: "kinder-resources.firebasestorage.app",
//   messagingSenderId: "579190869280",
//   appId: "1:579190869280:web:52eb38be0caf4c07085b45",
//   measurementId: "G-5GB93SM8VB"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Firestore Database
// export const db = getFirestore(app);

// // Initialize Firebase Authentication (for future use)
// export const auth = getAuth(app);

// export default app;

// src/lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
// IMPORTANT: Replace these values with your actual Firebase project credentials
// Get these from: Firebase Console > Project Settings > Your Apps > SDK setup and configuration
const firebaseConfig = {
  apiKey: "AIzaSyCD4yFsJNlFw6E3ezQvBzWXNGSPCzmedl8",
  authDomain: "kinder-resources.firebaseapp.com",
  projectId: "kinder-resources",
  storageBucket: "kinder-resources.firebasestorage.app",
  messagingSenderId: "579190869280",
  appId: "1:579190869280:web:52eb38be0caf4c07085b45",
  measurementId: "G-5GB93SM8VB"
};


// Validate configuration
// if (firebaseConfig.apiKey === "AIzaSyCD4yFsJNlFw6E3ezQvBzWXNGSPCzmedl8") {
//   console.error("⚠️ Firebase configuration not set up!");
//   console.error("Please update src/lib/firebase.js with your Firebase project credentials.");
//   console.error("Visit: https://console.firebase.google.com/");
// }

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
export const db = getFirestore(app);

// Initialize Firebase Authentication (for future use)
export const auth = getAuth(app);

export default app;