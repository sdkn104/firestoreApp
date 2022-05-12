
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, listCollections } = require('firebase-admin/firestore');

const myKakeibo = require('./myKakeibo.js');

(async function() {
    // Firebase setting
    /* --- for project firebaseSample
    const firebaseConfig = {
        apiKey: "AIzaSyB-AyeURGKny-QG5SPKoum5pUia0xmz-AI",
        authDomain: "fir-sample-c25f9.firebaseapp.com",
        projectId: "fir-sample-c25f9",
        storageBucket: "fir-sample-c25f9.appspot.com",
        messagingSenderId: "268323645130",
        appId: "1:268323645130:web:b23459622031acb9d87633",
        measurementId: "G-JG3TRPTR3W"
    };*/
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

    // list all collections
    const colls = await db.listCollections();
    colls.forEach((c)=>{
        console.log(c.id);
    });

    // read DB
    let c = 0;
    const ss = await db.collection("kakeibo").orderBy("date").orderBy("ID").limit(40000).get();
    console.log(ss.size);
    const ruikei = {};
    ss.forEach((doc)=>{
        const dd = doc.data();
        //console.log("doc data: ", doc.data());
        const ud = myKakeibo.getKakeiboUpdate(dd);

        // compare ud and dd
        if( (dd.income || 0) !== ud.income || (dd.outgo || 0) !== ud.outgo || (dd.shusi || 0) !== ud.shusi || 
             dd.account !== ud.account || dd.account_add !== ud.account_add || dd.account_sub !== ud.account_sub || dd.category_FPlan !== ud.category_FPlan ) {                
            console.log(dd, ud);
        }
        // check null, undefined
        if( ! ud.category_FPlan ) {
            console.log("cat", dd, ud);
        }
        if( ! ud.account_add ) {
            console.log("add", dd, ud);
        }
        if( ud.account_sub === undefined ) {
            console.log("sub", dd, ud);
        }
        if( ! dd.himoku ) {
            console.log("himoku", dd);
        }
        if( ! dd.date.match('^[0-9][0-9][0-9][0-9]/[0-9][0-9]/[0-9][0-9]$') ) {
            console.log("date", dd);
        }

        // calc ruikei        
        ruikei[ud.account_add] = (ruikei[ud.account_add] || 0) + (ud.shusi);
        if( ud.account_sub ) {
            ruikei[ud.account_sub] = (ruikei[ud.account_sub] || 0) - (ud.shusi);
        }

        // check ruikei
        if( ud.account_sub ) {
        //    console.log(dd, ruikei[ud.account_add], ruikei[ud.account_sub])
        }
        if( ruikei[ud.account_add] !== dd.accum_add ) {
            console.log("accum add", dd, ud);
        }
        if( ud.account_sub && ruikei[ud.account_sub] !== dd.accum_sub ) {
            console.log("accum sub", dd, ud);
        }

        // write to 
        /*
        await db.collection("kakeibo_data_newest").updaste(ud);
        c++;
        if( c % 100 === 0 ) { console.log(c); }
        */

    });
    console.log(ruikei);


})();


