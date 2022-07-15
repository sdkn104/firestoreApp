
import firebase from 'firebase/app';
import 'firebase/firestore';

import 'firebase/auth';

// ---- Configs ------
const firebaseConfig = {
    apiKey: "AIzaSyAzC5upkkaduxsYhkGqukXGItb_x00gjcY",
    authDomain: "fresh-catwalk-335010.firebaseapp.com",
    projectId: "fresh-catwalk-335010",
    storageBucket: "fresh-catwalk-335010.appspot.com",
    messagingSenderId: "656639514271",
    appId: "1:656639514271:web:773d44848395e5f5f0b4aa",
    measurementId: "G-L1PTCJS8T2"
}
const firebaseSettings = { timestampsInSnapshots: true }

// Initialize Firebase
if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}
//const analytics = getAnalytics(app);
firebase.firestore().settings(firebaseSettings);
    

export default firebase
