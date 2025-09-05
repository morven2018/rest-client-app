import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDQAFC879YU9rhiOI0B9fTEdt0TVU4xis8',
  authDomain: 'rest-client-app-c8844.firebaseapp.com',
  projectId: 'rest-client-app-c8844',
  storageBucket: 'rest-client-app-c8844.firebasestorage.app',
  messagingSenderId: '433521416875',
  appId: '1:433521416875:web:0d5c0a5fdeaa303f44f5ee',
  measurementId: 'G-T3KHVLHZ1B',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
