
const firebaseConfig = {
  apiKey: "AIzaSyARl16kTrSueEzj_CGdL2jlmg2k6_bXvUs",
  authDomain: "international-esim.firebaseapp.com",
  projectId: "international-esim",
  storageBucket: "international-esim.firebasestorage.app",
  messagingSenderId: "436978177904",
  appId: "1:436978177904:web:7f4bf60b14dad96e0321b",
  measurementId: "G-9LL2FJL671"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

const db = firebase.firestore();
