import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCkc3fMLBHNm1f7hVMY50XO-S8jzGaMHzk",
  authDomain: "devcomm-10e82.firebaseapp.com",
  projectId: "devcomm-10e82",
  storageBucket: "devcomm-10e82.firebasestorage.app",
  messagingSenderId: "487289032607",
  appId: "1:487289032607:web:0172595f1f36548c9737aa",
  measurementId: "G-H0L3PS753P"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  

export { db };
export const auth = getAuth(app);
