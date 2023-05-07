
import {getFirestore} from 'firebase/firestore'
import {initializeApp} from 'firebase/app'

const firebaseConfig = {
    apiKey: "AIzaSyAzC5upkkaduxsYhkGqukXGItb_x00gjcY",
    authDomain: "fresh-catwalk-335010.firebaseapp.com",
    projectId: "fresh-catwalk-335010",
    storageBucket: "fresh-catwalk-335010.appspot.com",
    messagingSenderId: "656639514271",
    appId: "1:656639514271:web:773d44848395e5f5f0b4aa",
    measurementId: "G-L1PTCJS8T2"
};
initializeApp(firebaseConfig);
const db = getFirestore();
//console.log(Date(), "init firestore");

export { db }