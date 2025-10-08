import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAM9iFuBlmHmGR5aXj3FGvodjxmvHAafuk",
  authDomain: "friterie-aide.firebaseapp.com",
  databaseURL: "https://friterie-aide-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "friterie-aide",
  storageBucket: "friterie-aide.firebasestorage.app",
  messagingSenderId: "557495816589",
  appId: "1:557495816589:web:f55162f4fb280252f12dc4",
  measurementId: "G-JD8X7TY3ZP"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
