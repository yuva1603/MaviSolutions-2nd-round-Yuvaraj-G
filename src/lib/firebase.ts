import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBAch-Ypq0zcgH_Ae2YQKDhp0Z3IxObAsY",
  authDomain: "civic-help-hub.firebaseapp.com",
  projectId: "civic-help-hub",
  storageBucket: "civic-help-hub.firebasestorage.app",
  messagingSenderId: "754952442522",
  appId: "1:754952442522:web:49c6b91fe6765c34c3c523",
  measurementId: "G-3437Y1ERQG"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
