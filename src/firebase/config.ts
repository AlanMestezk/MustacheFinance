
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAIo6M1s9c7st6Z5aL0WsfLd8s_QjI5tvg",
  authDomain: "mustachefinances.firebaseapp.com",
  projectId: "mustachefinances",
  storageBucket: "mustachefinances.firebasestorage.app",
  messagingSenderId: "631581700260",
  appId: "1:631581700260:web:f98b17c03b7ba70d08b631",
};

export const app = initializeApp(firebaseConfig);