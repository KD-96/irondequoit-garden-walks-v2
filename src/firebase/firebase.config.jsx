import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBa1qsIMKudTfUQO_SLE32cKuS3nvmtvRY",
    authDomain: "irondequoit-garden-walks.firebaseapp.com",
    projectId: "irondequoit-garden-walks",
    storageBucket: "irondequoit-garden-walks.firebasestorage.app",
    messagingSenderId: "449628524663",
    appId: "1:449628524663:web:07e6464e607a347d80f672",
    measurementId: "G-L766YTCS1K"
};

// Initialize Firebase App
const firebaseApp = initializeApp(firebaseConfig);

// Export Firestore DB instance
const db = getFirestore(firebaseApp);

export { firebaseApp, db };