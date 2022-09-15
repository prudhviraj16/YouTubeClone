import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBN0htHJGEYpje3P7p4_h7WSCZ0ey80ZLU",
  authDomain: "login-c3a1d.firebaseapp.com",
  projectId: "login-c3a1d",
  storageBucket: "login-c3a1d.appspot.com",
  messagingSenderId: "635000715390",
  appId: "1:635000715390:web:6c8385ef83588d324ec02f",
  measurementId: "G-EL1HMFBH1L"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const provider = new GoogleAuthProvider()
export default app