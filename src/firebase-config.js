import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_apiKey, 
  authDomain: process.env.REACT_APP_API_authDomain,
  projectId: process.env.REACT_APP_API_projectId,
  storageBucket: process.env.REACT_APP_API_storageBucket,
  messagingSenderId: process.env.REACT_APP_API_messagingSenderId,
  appId: process.env.REACT_APP_API_appId,
  measurementId: process.env.REACT_APP_API_measurementId,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
