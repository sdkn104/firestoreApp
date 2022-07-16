
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

    // read DB
    let c = 0;
    //const ss = await db.collection("kakeibo").orderBy("date").orderBy("ID").limit(30000).get();
    const ss = await db.collection("kakeibo").where("shusi", ">", "10000").orderBy("shusi").limit(30).get();
    //const ss = await db.collection("kakeibo").orderBy("himoku").limit(30).get();
    console.log(Date(), ss.size);
    for(let i=0;  i < ss.docs.length; i++ ){
        const doc = ss.docs[i];
        const data = doc.data();
        console.log(data.shusi + " " + data.ID + " " + typeof data.shusi + " " + data.himoku)
    }
    
    /*
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
    */

})();


