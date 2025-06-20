// src/environments/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { environment } from './environment';

const app = initializeApp(environment.firebaseConfig);
const db = getFirestore(app);

export { db };
