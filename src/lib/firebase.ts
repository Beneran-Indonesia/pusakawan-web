import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup } from "firebase/auth";

// const config = {
//     apiKey: process.env.FIRESTORE_API_KEY,
//     authDomain: process.env.FIRESTORE_AUTH_DOMAIN,
//     databaseURL: process.env.FIRESTORE_DATABASE_URL,
//     projectId: process.env.FIRESTORE_PROJECT_ID,
//     storageBucket: process.env.FIRESTORE_STORAGE_BUCKET,
//     messagingSenderId: process.env.FIRESTORE_MESSAGING_SENDER_ID
// };

const config = {
    apiKey: "AIzaSyA9HolUNGi8Pu0rHQ-RFtREqNWhUCsWe2Q",
    authDomain: "pusaka-firebase.firebaseapp.com",
    databaseURL: "https://pusaka-firebase-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "pusaka-firebase",
    storageBucket: "pusaka-firebase.appspot.com",
    messagingSenderId: "929850535065",
    appId: "1:929850535065:web:18b31076e7efb5c3cedc08",
    measurementId: "G-EGWKWYZZE2"
  };
  

const app = initializeApp(config);

import { GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();

const firebaseAuth = getAuth(app);

const signUpWithGoogle = () => {
    signInWithPopup(firebaseAuth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            console.log(result, token, user)
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log(error)
            // ...
        });
}

export { firebaseAuth, app, signUpWithGoogle };