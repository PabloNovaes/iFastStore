// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCHnPlLCxtXNrBjtT9lrOl86zUpcIjGdWo",
  authDomain: "faststore-6f19c.firebaseapp.com",
  projectId: "faststore-6f19c",
  storageBucket: "faststore-6f19c.appspot.com",
  messagingSenderId: "503218684115",
  appId: "1:503218684115:web:fe3a5ea6dabbd123de5426"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)