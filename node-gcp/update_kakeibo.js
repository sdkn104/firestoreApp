const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, listCollections } = require('firebase-admin/firestore');

const myKakeibo = require('./myKakeibo.js');

var fs = require('fs');


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

(async function() {
    // Firebase setting
    initializeApp(firebaseConfig);
    const db = getFirestore();

    // list all collections
    /*
    const colls = await db.listCollections();
    colls.forEach((c)=>{
        console.log(c.id);
    });
    */

    // update kakeibo DB
    const logger = myKakeibo.loggerBatchGenerator()
    const ps = myKakeibo.updateKakeiboDB(db, "kakeibo", logger);
    console.log(Date()+" submited update DB")
    await ps;
    console.log(logger(""))
    console.log(Date()+" finish update DB")

    // update kakeibo accum
    const logger2 = myKakeibo.loggerBatchGenerator()
    const ps2 = myKakeibo.updateKakeiboAccum(db, "kakeibo", logger2);
    console.log(Date()+" submited update Accum")
    await ps2;
    console.log(logger2(""))
    console.log(Date()+" finish update Accum")

    // update kakeibo zandaka
    const logger3 = myKakeibo.loggerBatchGenerator()
    const ps3 = myKakeibo.updateKakeiboZandaka(db, "kakeibo", null, logger3);
    console.log(Date()+" submited update Zandaka")
    await ps3;
    console.log(logger3(""))
    console.log(Date()+" finish update Zandaka")
    
})();

