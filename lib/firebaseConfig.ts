import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBO_BlNWJUNBOD2PsdMSG6OCbIgS8e91-I",
  authDomain: "myapplication-61489870.firebaseapp.com",
  projectId: "myapplication-61489870",
  storageBucket: "myapplication-61489870.firebasestorage.app",
  messagingSenderId: "1011556248856",
  appId: "1:1011556248856:web:4a0557569c122a4b9a826d"
};

// Initialize Firebase




const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);