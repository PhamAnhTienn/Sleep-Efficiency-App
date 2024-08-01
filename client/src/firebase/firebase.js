import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCEvAcwy60DGc99E8h4SbdH5drOs1FTFjo",
  authDomain: "sleep-efficiency-app.firebaseapp.com",
  projectId: "sleep-efficiency-app",
  storageBucket: "sleep-efficiency-app.appspot.com",
  messagingSenderId: "670936351385",
  appId: "1:670936351385:web:a6b847bc4033401c7c2e08",
  measurementId: "G-BKJ3WY5B5F"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;