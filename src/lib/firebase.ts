import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const config = {
    apiKey: process.env.NEXT_PUBLIC_FIRESTORE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIRESTORE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIRESTORE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIRESTORE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIRESTORE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIRESTORE_MESSAGING_SENDER_ID
};

const app = initializeApp(config);

const provider = new GoogleAuthProvider();

const firebaseAuth = getAuth(app);

const signUpWithGoogle = () => signInWithPopup(firebaseAuth, provider)
    .then((result) => {
        // Return the ID Token to be processed on API.
        const user = result.user.getIdToken();
        return user;
    }).catch((error) => {
        console.error("signUpWithGoogle ERROR:", error)
        return null
    });


export { firebaseAuth, app, signUpWithGoogle };