// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

const myKakeibo = require('./myKakeibo.js');


exports.helloWorld = functions.https.onRequest((request, response) => {
   functions.logger.info("Hello logs!", {structuredData: true});
   response.send("Hello from Firebase!");
});


exports.updateKakeiboZandaka = functions
    .runWith({
        timeoutSeconds: 120,
        memory: '1GB'
    }).https.onRequest(async (req, res) => {
        const result = {log:[]}
        const at = req.query.at;
        result.at = at;
        let ps;
        try {
            const logger = myKakeibo.loggerBatchGenerator()
            ps = await myKakeibo.updateKakeiboZandaka(admin.firestore(), "kakeibo", at, logger);
            logger("finished: "+new Date());
            result.log.push(logger(""))
        } catch(e) {
            result.errmes = e.message;
            result.error = e;
            result.stack = e.stack;
        } finally {
            res.set('Content-Type', 'text/plain')
            res.send(JSON.stringify(result, null, 2) + "\nlog:\n" + result.log)
            //res.json(result);
            return ps;
        }
});

/* This version is old but matured ....
exports.updateKakeiboZandaka = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;

    const result = {log:[]}
    try {
        result.log.push(Date()+" start")
        // caluculate zandaka and summary
        let snapShot = await admin.firestore().collection('kakeibo').limit(40000).get();
        let zandaka = {};
        let summary = {};
        result.log.push(snapShot.size);
        result.log.push(Date())
        snapShot.forEach((d)=>{
            const data = d.data();
            // zandaka
            zandaka[data.account_add] = (zandaka[data.account_add] || 0) + (data.shusi);
            if( data.account_sub ) {
                zandaka[data.account_sub] = (zandaka[data.account_sub] || 0) - (data.shusi);
            }
        });
        result.log.push(zandaka);
        result.log.push(Date()+" calculated")

        // delete and add zandaka    
        await myKakeibo.deleteCollection(admin.firestore(), "kakeibo_zandaka");
        result.log.push(Date()+ " delete zandaka")
        const coll = admin.firestore().collection('kakeibo_zandaka');
        await Promise.all(Object.keys(zandaka).map((a)=>(coll.add({account:a, zandaka:zandaka[a]}))))
        result.log.push(Date()+" added zandaka")
    } catch(e) {
        result.errmes = e.message;
        result.error = e;
        result.stack = e.stack;
    } finally {
        res.json(result);
    }
});
*/

exports.updateKakeiboSummary = functions
    .runWith({
        timeoutSeconds: 120,
        memory: '1GB'
    }).https.onRequest(async (req, res) => {
        const result = {log:[]}
        const key1 = req.query.key1 || "category_FPlan";
        const key2 = req.query.key2 || "himoku";
        const day1 = req.query.day1 || "date";
        const dayFrom = req.query.dayFrom || "1900/01/01";
        const dayTo = req.query.dayTo || "2099/12/31";
        const dayWidth = req.query.dayWidth || 4;
        result.key1 = key1;
        result.key2 = key2;
        result.day1 = day1;
        result.dayFrom = dayFrom;
        result.dayTo = dayTo;
        result.dayWidth = dayWidth;
        let ps;
        try {
            ps = await myKakeibo.updateKakeiboSummary(admin.firestore(), "kakeibo", "kakeibo_summary", key1, key2, day1, dayFrom, dayTo, dayWidth);
            result.log.push("finish submit summary creation")
        } catch(e) {
            result.errmes = e.message;
            result.error = e;
            result.stack = e.stack;
        } finally {
            res.set('Content-Type', 'text/plain')
            res.send(JSON.stringify(result, null, 2) + "\nlog:\n" + result.log)
            return ps;
        }
});



exports.recalculateKakeiboDB = functions
    .runWith({
            timeoutSeconds: 120,
            memory: '1GB'
    }).https.onRequest(async (req, res) => {
        // Grab the text parameter.
        const original = req.query.text;
        const result = {log:[]}
        let ps;
        try {
            const logger = myKakeibo.loggerBatchGenerator()
            ps = await myKakeibo.updateKakeiboDB(admin.firestore(), "kakeibo", logger);
            ps = await myKakeibo.updateKakeiboAccum(admin.firestore(), "kakeibo", logger);
            logger("finished: "+new Date());
            result.log.push(logger(""))
        } catch(e) {
            result.errmes = e.message;
            result.error = e;
            result.stack = e.stack;
        } finally {
            res.set('Content-Type', 'text/plain')
            res.send(JSON.stringify(result, null, 2) + "\nlog:\n" + result.log)
            return ps;
        }
});


exports.updateKakeiboAccum = functions
    .runWith({
        timeoutSeconds: 120,
        memory: '1GB'
    }).https.onRequest(async (req, res) => {
        const result = {log:[]}
        let ps;
        try {
            const logger = myKakeibo.loggerBatchGenerator()
            ps = await myKakeibo.updateKakeiboAccum(admin.firestore(), "kakeibo", logger);
            logger("finished: "+new Date());
            result.log.push(logger(""))
        } catch(e) {
            result.errmes = e.message;
            result.error = e;
            result.stack = e.stack;
        } finally {
            res.set('Content-Type', 'text/plain')
            res.send(JSON.stringify(result, null, 2) + "\nlog:\n" + result.log)
            return ps;
        }
});


exports.fillGuessedHimoku = functions
    .runWith({
            timeoutSeconds: 120,
            memory: '1GB'
    }).https.onRequest(async (req, res) => {
        // Grab the text parameter.
        const original = req.query.text;
        const result = {log:[]}
        let ps;
        try {
            const logger = myKakeibo.loggerBatchGenerator()
            ps = await myKakeibo.fillGuessedHimoku(admin.firestore(), "kakeibo", logger);
            logger("finished: "+new Date());
            result.log.push(logger(""))
        } catch(e) {
            result.errmes = e.message;
            result.error = e;
            result.stack = e.stack;
        } finally {
            res.set('Content-Type', 'text/plain')
            res.send(JSON.stringify(result, null, 2) + "\nlog:\n" + result.log)
            return ps;
        }
});


/*
// https://cloud.google.com/firestore/docs/extend-with-functions?hl=ja
// Listen for updates to any `user` document.
exports.updateKakeibo = functions.firestore
    .document('kakiebo/{Id}')
    .onWrite((change, context) => {
        if( ! change.after.exists ) { // in case of delete
            return true;
        }
        // Retrieve the current and previous value
        const data = change.after.data();
        const update = await getKakeiboUpdate(data);
        return change.after.ref.update(update);
    }, {merge: true});
    */

/*
async function deleteCollection(db, collectionName) {
    const snapshot = await db.collection(collectionName).get();
    const docs = snapshot.docs;
    console.log(docs.length)
    let batch = db.batch();
    for(let i=0; i<docs.length; i++) {
        //console.log("del ", docs[i].data())
        batch.delete(docs[i].ref);
        if( (i+1) % 500 === 0 ) {
            await batch.commit();
            console.log("delete commit")
            batch = db.batch();
        }
    }
    await batch.commit();
    console.log("delete commit")
}


function getKakeiboUpdate(docData) {
    const update = {};
    
    //update.date = PARSE_DATETIME("%Y/%m/%d", DATE);
    update.income = docData.income ? Number(docData.income) : 0;
    update.outgo = docData.outgo ? Number(docData.outgo) : 0;
    update.shusi = update.income - update.outgo;
    update.account = docData.account ? docData.account : '現金';
    update.account_add = docData.account ? docData.account : '現金';
    update.account_sub =  docData.himoku === '預金引き出し' ? '現金' :
                            docData.himoku === '預金預け入れ' ? '現金' :
                            docData.himoku === '口座間振替' ? docData.utiwake :
                            null ;
    update.category_FPlan = null;
    update.account_all = update.account_add + (update.account_sub ? update.account_sub : '');
    update.category_FPlan = 
        docData.mark?.match('特別会計') ? '11特別会計' :
        docData.mark?.match('一時会計') ? '04一時会計《年単位》' :
        docData.himoku === '車関連費' && docData.utiwake === '自動車税' ? '03固定支出《毎年》' :
        docData.himoku === '住居費' && docData.utiwake === '固都税' ? '03固定支出《毎年》' :
        docData.himoku === '交通通信費' && docData.utiwake === 'ＮＨＫ受信料' ? '03固定支出《毎年》' :
        docData.himoku === '保険料' && docData.utiwake === '生命保険料' ? '03固定支出《毎年》' :
        docData.himoku === '預金引き出し' ? '20振替' :
        docData.himoku === '預金預け入れ' ? '20振替' :
        docData.himoku === '口座間振替' ? '20振替' :
        docData.himoku === '特別収入' && docData.utiwake === '出張旅費精算' ? '06出張通勤会計' :
        docData.himoku === '特別収入' && docData.utiwake === '通勤費補助' ? '06出張通勤会計' :
        docData.himoku === '特別収入' && docData.utiwake === '投資利益' ? '07投資会計' :
        docData.himoku === '特別支出' && docData.utiwake === '通勤《バス》' ? '06出張通勤会計' :
        docData.himoku === '特別支出' && docData.utiwake === '通勤《電車》' ? '06出張通勤会計' :
        docData.himoku === '特別支出' && docData.utiwake === '通勤《駐輪》' ? '06出張通勤会計' :
        docData.himoku === '特別支出' && docData.utiwake === '出張費' ? '06出張通勤会計' :
        docData.himoku === '特別支出' && docData.utiwake === '投資損失' ? '07投資会計' :
        docData.himoku === '住居費' && docData.utiwake === '銀行１融資' ? '05住宅ローン' :
        docData.himoku === '保険料' && docData.utiwake === '個人年金' ? '05貯蓄性支出' :
        docData.himoku === '教養・娯楽費' && docData.utiwake === '新聞' ? '01固定支出《毎月》' :
        docData.himoku === '交通通信費' && docData.utiwake === 'CATV' ? '01固定支出《毎月》' :
        docData.himoku === '交通通信費' && docData.utiwake === '電話料《NTT》' ? '01固定支出《毎月》' :
        docData.himoku === '交通通信費' && docData.utiwake === '電話料《携帯》' ? '01固定支出《毎月》' :
        docData.himoku === '交通通信費' && docData.utiwake === 'internet' ? '01固定支出《毎月》' :
        docData.himoku === 'こども' && docData.utiwake === '授業料' ? '01固定支出《毎月》' :
        docData.himoku === 'こども' && docData.utiwake === '習い事月謝' ? '01固定支出《毎月》' :
        //docData.himoku === '雑費' & docData.utiwake === '香へ' ? '00香へ' :
        docData.himoku === '給与・賞与' ? '10収入' :
        docData.himoku === '雑収入' ? '10収入' :
        docData.himoku === '贈答《受》' ? '10収入' :
        docData.himoku === '出所不明金' ? '10収入' :
        docData.himoku === '特別収入' ? '11特別会計' :
        docData.himoku === '保険料' ? '01固定支出《毎月》' :
        docData.himoku === '車関係費' ? '01固定支出《毎月》' :
        docData.himoku === '住居費' ? '01固定支出《毎月》' :
        docData.himoku === '特別支出' ? '11特別会計' :
        docData.himoku === '税金' ? '08給与賞与控除' :
        docData.himoku === '社会保険料' ? '08給与賞与控除' :
        docData.himoku === '会費' ? '08給与賞与控除' :
        docData.himoku === '預金引き出し' ? '20振替' :
        docData.himoku === '預金預け入れ' ? '20振替' :
        docData.himoku === '口座間振替' ? '20振替' :
        docData.himoku === '水道光熱費' ? '01固定支出《毎月》' :
        '00基本生活費';
    return update;
}
*/
