import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqfIpdnZ88Xl8BPU1JnYdTSGrVkMvU8Xk",
  authDomain: "yeahtalk-d2de7.firebaseapp.com",
  projectId: "yeahtalk-d2de7",
  storageBucket: "yeahtalk-d2de7.appspot.com",
  messagingSenderId: "964133455702",
  appId: "1:964133455702:web:27743910852293194c38f7",
  measurementId: "G-Y8D9XEGJTB"
};

const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);