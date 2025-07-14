import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDdTyyWQYWMA3VJCNFJiNtdAYC7Rc9gI9k",
  authDomain: "portal-aiche.firebaseapp.com",
  databaseURL: "https://portal-aiche-default-rtdb.firebaseio.com",
  projectId: "portal-aiche",
  storageBucket: "portal-aiche.firebasestorage.app",
  messagingSenderId: "153207665579",
  appId: "1:153207665579:web:b76bdf9ed2c6ff500918ee"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };