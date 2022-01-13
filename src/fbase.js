import firebase from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    measurementId: process.env.REACT_APP_MEASUREMENTID
};


const app = firebase.initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const firebaseInstance = firebase;
export const authService = firebase.auth();
export const dbService = firebase.firestore();
export const storageService = firebase.storage(); 
export const firebaseDB =  firebase.database();