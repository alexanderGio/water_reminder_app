import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import {environment} from './environment';

// Inicializa o Firebase usando os valores do environment
const app = initializeApp(environment.firebaseConfig);
export const db = getFirestore(app);

