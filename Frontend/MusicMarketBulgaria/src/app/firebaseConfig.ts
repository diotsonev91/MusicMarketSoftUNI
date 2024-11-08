import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { environment } from '../environments/environment'; // Import environment config

// Initialize Firebase using the environment config
const app = initializeApp(environment.firebaseConfig);

export const auth = getAuth(app);       // Firebase Authentication instance
export const db = getFirestore(app);    // Firestore Database instance
