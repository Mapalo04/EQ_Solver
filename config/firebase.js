// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYNFzODJqnYbMRgA5GZ6TZFrve7OUFnMM",
  authDomain: "eq-solver.firebaseapp.com",
  projectId: "eq-solver",
  storageBucket: "eq-solver.appspot.com",
  messagingSenderId: "704893594997",
  appId: "1:704893594997:web:ccc0d3ccf66b1dd482f73c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore();

