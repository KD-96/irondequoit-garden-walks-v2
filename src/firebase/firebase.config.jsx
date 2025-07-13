import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const firebaseConfig = {
    apiKey: "AIzaSyBa1qsIMKudTfUQO_SLE32cKuS3nvmtvRY",
    authDomain: "irondequoit-garden-walks.firebaseapp.com",
    projectId: "irondequoit-garden-walks",
    storageBucket: "irondequoit-garden-walks.firebasestorage.app",
    messagingSenderId: "449628524663",
    appId: "1:449628524663:web:07e6464e607a347d80f672",
    measurementId: "G-L766YTCS1K"
};

const firebaseApp = initializeApp(firebaseConfig);

// const appCheck = initializeAppCheck(firebaseApp, {
//     provider: new ReCaptchaV3Provider('6LcBi4ErAAAAABqSxJWRq1HPt7DN9cVFvTz7UDfO'),
//     isTokenAutoRefreshEnabled: true,
// });

// getToken(appCheck, /* forceRefresh */ true).then(token => {
//     console.log('App Check Token:', token);
// }).catch(err => {
//     console.error('App Check token error:', err);
// });

// ✅ Now initialize Firestore and Storage
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { firebaseApp, db, storage };