// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'rajesh-projects-251f9.firebaseapp.com',
  projectId: 'rajesh-projects-251f9',
  storageBucket: 'rajesh-projects-251f9.firebasestorage.app',
  messagingSenderId: '70521516828',
  appId: '1:70521516828:web:d7ad207f29b0c1bc5c40d9',
  measurementId: 'G-NJJHKF5BSL',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)