/**
 * service/firebase_init.js
 * Inizializzazione di Firebase per l'app.
 */

const firebaseConfig = {
  apiKey: "AIzaSyAgHLVg4TdaF7xoaItXIxj2p1CdNuFunEE",
  authDomain: "armonia-47fa2.firebaseapp.com",
  projectId: "armonia-47fa2",
  storageBucket: "armonia-47fa2.firebasestorage.app",
  messagingSenderId: "700215020857",
  appId: "1:700215020857:web:75c2670006721a7e52ace8"
};

// Inizializza Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

window.fcmMessaging = messaging;
