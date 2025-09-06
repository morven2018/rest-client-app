import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY || '',
  authDomain:
    process.env.NEXT_PUBLIC_AUTH_DOMAIN ||
    'rest-client-app-c8844.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_ROJECT_ID || 'rest-client-app-c8844',
  storageBucket:
    process.env.NEXT_PUBLIC_AUTH_DOMAIN ||
    'rest-client-app-c8844.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID || '',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
