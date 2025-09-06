import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_API_KEY || '',
  authDomain:
    process.env.NEXT_AUTH_DOMAIN || 'rest-client-app-c8844.firebaseapp.com',
  projectId: process.env.NEXT_PROJECT_ID || 'rest-client-app-c8844',
  storageBucket:
    process.env.NEXT_AUTH_DOMAIN || 'rest-client-app-c8844.firebasestorage.app',
  messagingSenderId: process.env.NEXT_SENDER_ID || '',
  appId: process.env.NEXT_APP_ID || '',
  measurementId: process.env.NEXT_MEASUREMENT_ID || '',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
