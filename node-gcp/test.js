
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
    console.log(Date(), "init firestore");

    // list all collections
    const colls = await db.listCollections();
    colls.forEach((c)=>{
        console.log(Date(), c.id);
    });

    // read DB
    let c = 0;
    //const ss = await db.collection("kakeibo").orderBy("date").orderBy("ID").limit(30000).get();
    const ss = await db.collection("kakeibo").get();
    console.log(Date(), ss.size);
    let zandaka = {};
    let summary = {};
    ss.forEach((doc)=>{
        //const ud = myKakeibo.getKakeiboUpdate(dd);
        const data = doc.data();
        // zandaka
        zandaka[data.account_add] = (zandaka[data.account_add] || 0) + (data.shusi);
        if( data.account_sub ) {
            zandaka[data.account_sub] = (zandaka[data.account_sub] || 0) - (data.shusi);
        }
        // summary
        if( ! summary[data.himoku] ) {
            summary[data.himoku] = {};
        }
        if(! data.date) {result.log.push(data)}
        //summary[data.himoku][data.date?.slice(0,7)] = (summary[data.himoku][data.date?.slice(0,7)] || 0) + data.shusi;

        // summary
        const k1 = "himoku"
        const k2 = "account"
        const d1 = "date"
        const dw = 7
        if( ! summary[data[k1]] ) {
            summary[data[k1]] = {};
        }
        if( ! summary[data[k1]][data[k2]] ) {
            summary[data[k1]][data[k2]] = {};
        }
        if( ! summary[data[k1]][data[k2]][data[d1]?.slice(0,dw)] ) {
            summary[data[k1]][data[k2]][data[d1]?.slice(0,dw)] = 0;
        }
        if(! data.date) {result.log.push(data)}
        summary[data[k1]][data[k2]][data[d1]?.slice(0,dw)] += data.shusi;        
    });
    console.log(Date(), zandaka);
    
    // delete and add zandaka    
    await myKakeibo.deleteCollection(db, "kakeibo_zandaka");
    console.log(Date(), "deleted all")
    const coll = db.collection('kakeibo_zandaka');
    await Promise.all(Object.keys(zandaka).map((a)=>(coll.add({account:a, zandaka:zandaka[a]}))))
    console.log(Date(), "added all")

    // summary
    await myKakeibo.deleteCollection(db, "kakeibo_summary");
    console.log(Date(), "deleted all")
    const coll2 = db.collection('kakeibo_summary');
    const dataList = [];
    for(const k1 of Object.keys(summary)) {
        for(const k2 of Object.keys(summary[k1])) {
            for(const k3 of Object.keys(summary[k1][k2])) {
                const v = summary[k1][k2][k3];
                dataList.push({key1:k1, key2:k2, key3:k3, value:v})
            }
        }
    }
    await Promise.all(dataList.map((a)=>(coll2.add(a))))
    console.log(Date(), "added all: "+dataList.length)

})();


