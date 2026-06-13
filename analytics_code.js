// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgHLVg4TdaF7xoaItXIxj2p1CdNuFunEE",
  authDomain: "armonia-47fa2.firebaseapp.com",
  projectId: "armonia-47fa2",
  storageBucket: "armonia-47fa2.firebasestorage.app",
  messagingSenderId: "700215020857",
  appId: "1:700215020857:web:75c2670006721a7e52ace8",
  measurementId: "G-T2XFVK5GTM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);