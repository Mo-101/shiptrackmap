import { initializeApp } from "firebase/app";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "tokyo-scholar-356213.firebaseapp.com",
  projectId: "tokyo-scholar-356213",
  storageBucket: "tokyo-scholar-356213.appspot.com",
  clientId: "Ov23lik9dEt9HUuHTZb7"
};

const app = initializeApp(firebaseConfig);
export const functions = getFunctions(app);
