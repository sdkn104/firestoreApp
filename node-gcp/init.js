const { BigQuery } = require('@google-cloud/bigquery');

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, listCollections } = require('firebase-admin/firestore');

var fs = require('fs');

const bigquery = new BigQuery({
    projectId: 'fresh-catwalk-335010',
    keyFilename: '../AppEngine/credentials/BigQueryKey.json'
});


(async function() {
    // read BigQuery
    const query = "SELECT * FROM `fresh-catwalk-335010.HOME_IoT.kakeibo_data_newest`";
    const rows = await doBigQuery(query);
    console.log(rows.length);
    
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

    /*
    // read DB
    const coll = db.collection("sampleKey");
    const ss = await coll.get();
    ss.docs.slice(0,10).forEach((doc)=>{
        console.log("doc data: ", doc.data());
    })
    console.log("Document data:", ss.docs[0].data());
    */

    // ADD rows to DB kakei
    db.collection("kakeibo").add({a:1, b:2});
    rows.forEach((row)=>{
        db.collection("kakeibo").add(row);
    })
    // read DB kakei
    const ss2 = await db.collection("kakeibo").get();
    ss2.docs.slice(0,10).forEach((doc)=>{
        console.log("doc data: ", doc.data());
    })

    /*
    // delete collection
    const ss3 = await db.collection("kakei").get();
    ss3.forEach((doc)=>{
        doc.ref.delete();
    })
    */

})();




async function doBigQuery(query){
    try {
        const data = await bigquery.query(query);
        const rows = data[0];
        rows.forEach(row => {
            //console.log(JSON.stringify(row));
        })
        fs.writeFileSync('bq.json', JSON.stringify(rows, null, ' '));;
        return rows;        
    } catch(error) {
        console.log(error);
    }
}

function doBigQueryJob() {
    const options = {
        query: query,
        useLegacySql: false,
    }
    bigquery.createQueryJob(options)
        .then(results => {
            const [job] = results;
            return job.getQueryResults();
        })
        .then(results => {
            const [rows] = results;
            rows.forEach(row => {
                console.log(JSON.stringify(row));
            })
        })
        .catch(error => {
            console.log(error);
        })
}
