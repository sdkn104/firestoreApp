
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, listCollections } = require('firebase-admin/firestore');

const myKakeibo = require('./myKakeibo.js');

(async function() {
    // Firebase setting
    // for project My Dev Project
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
    console.log(Date(), "init firestore");

    // list all collections
    const colls = await db.listCollections();
    colls.forEach((c)=>{
        console.log(Date(), c.id);
    });


    // modify 16 bank (auto set 費目等)
    const guess = await myKakeibo.guessHimoku(db, "kakeibo");
    ss2= await db.collection("kakeibo").get();
    console.log("got snapshot "+ss2.size)
    docs2 = ss2.docs;
    let updates = []
    let p;
    for(let i=0; i<docs2.length; i++) {
        const doc = docs2[i];
        const dd = doc.data();
        if( true ) {
            const key = myKakeibo.guessHimokuGetKey(dd)
            //console.log(dd.biko, key)
            const g = guess[key];
            if(!dd.himoku && g) { // no himoku, guess exists
                console.log({himoku:g.himoku, utiwake:g.utiwake}, dd)
                p = doc.ref.update({himoku:g.himoku, utiwake:g.utiwake});
            }
            updates.push(p)
        }
    }
    await Promise.all(updates)
})();


