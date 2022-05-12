const { BigQuery } = require('@google-cloud/bigquery');

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, listCollections } = require('firebase-admin/firestore');

const myKakeibo = require('./myKakeibo.js');

var fs = require('fs');

const bigquery = new BigQuery({
    projectId: 'fresh-catwalk-335010',
    keyFilename: '../AppEngine/credentials/BigQueryKey.json'
});

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

(async function() {
    // read BigQuery
    /*
    const query = "SELECT FORMAT_DATETIME('%Y/%m/%d', date) as date, * EXCEPT (date) FROM `fresh-catwalk-335010.HOME_IoT.kakeibo_ruikei` LIMIT 30000";
    const rows = await doBigQuery(query);
    console.log(rows.length);
    */

    // Firebase setting
    initializeApp(firebaseConfig);
    const db = getFirestore();
    // list all collections
    const colls = await db.listCollections();
    colls.forEach((c)=>{
        console.log(c.id);
    });

    
    // ADD rows to DB kakei
    //const coll = db.collection("kakeibo");
    //await Promise.all(rows.map((row)=>(coll.add(row))))
    
    // modify kakeibo
    /*
    const ss2 = await db.collection("kakeibo").orderBy("date").orderBy("ID").limit(40000).get();
    console.log(ss2.size)
    let updateCount = 0
    const accum = {}
    for( const doc of ss2.docs) {
        const dd = doc.data();
        doc.ref.update({accum1: FieldValue.delete(), accum2: FieldValue.delete()}) // delete field

    }
    console.log(updateCount);
    */

    // update kakeibo
    /*const ps = myKakeibo.recalculateDB(db, "kakeibo");
    console.log(Date()+" submited recalculation")
    await ps;
    console.log(Date()+"finish recalculation")
    */
    
    // copy collection
    /*
    await myKakeibo.deleteCollection(db, "kakeibo_bkup"); 
    console.log("deleted coll")
    await myKakeibo.copyCollection(db, "kakeibo", "kakeibo_bkup");
    console.log("complete copy coll")
    */

    // create summary
    const r = await myKakeibo.updateSummary(db, "kakeibo", "kakeibo_himoku", "himoku", "utiwake", "date", 0);
    console.log("finish creating sumamry", r.log, r.error)
    const r2 = await myKakeibo.updateSummary(db, "kakeibo", "kakeibo_summary", "category_FPlan", "himoku", "date", 7);
    console.log("finish creating sumamry", r2.log, r2.error)
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
