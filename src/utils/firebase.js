// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCf-RCzdc5ziGGSGrQ7SfKaplJH_dOTLsk",
  authDomain: "netflix-gpt-28bb5.firebaseapp.com",
  projectId: "netflix-gpt-28bb5",
  storageBucket: "netflix-gpt-28bb5.appspot.com",
  messagingSenderId: "229563210746",
  appId: "1:229563210746:web:dde428360171a93223e243",
  measurementId: "G-68E2GNRSYF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();