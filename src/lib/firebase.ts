/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp({
  ...firebaseConfig,
  apiKey: import.meta.env.VITE_PUBLIC_FIREBASE_API_KEY
});

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Test Firestore Connection as required by critical validation instructions
async function validateFirestoreConnection() {
  try {
    // Attempt a secure background server check
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    if (error && error.message && error.message.includes('the client is offline')) {
      console.warn("Firestore status: Client appears to be offline. Local cache will be maintained.");
    }
  }
}

validateFirestoreConnection();
export default app;
