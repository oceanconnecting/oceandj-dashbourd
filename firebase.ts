import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCYLroD-Tp9ehzCWfkFIkGgw2Oge20BOOg",
  authDomain: "dj-stage.firebaseapp.com",
  projectId: "dj-stage",
  storageBucket: "dj-stage.appspot.com",
  messagingSenderId: "914866262120",
  appId: "1:914866262120:web:31fe3d09e066f722fcabdd",
  measurementId: "G-NKKJ99MXCM"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };