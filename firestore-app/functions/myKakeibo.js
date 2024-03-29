
//const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
//const { getFirestore, Timestamp, FieldValue, listCollections } = require('firebase-admin/firestore');

class Batcher {
    constructor(db) {
        this.db = db;
        this.count = 0;
        this.batch = db.batch();
    }
    commit()  {
        if( this.count > 0 ) {
            const promise = this.batch.commit();
            this.count = 0;
            this.batch = this.db.batch();
            return promise;
        }
    }
    end() {
        return this.commit();
    }
    delete(docRef) {
        this.batch.delete(docRef);
        this.count++;
        if( this.count >= 500 ) {
            return this.commit();
        }
        return Promise.resolve(true);
    }
    set(docRef, data, options) {
        this.batch.set(docRef, data);
        this.count++;
        if( this.count >= 500 ) {
            return this.commit();
        }
        return Promise.resolve(true);
    }
    update(docRef, data)  {
        this.batch.update(docRef, data);
        this.count++;
        if( this.count >= 500 ) {
            return this.commit();
        }
        return Promise.resolve(true);
    }
}
exports.Batcher = Batcher;

/*
exports.batcher2 = function(db) {
    let count = 0;
    let batch = db.batch();

    return {
        commit: function()  {
            if( count > 0 ) {
                const promise = batch.commit();
                count = 0;
                return promise;
            }
        },
        end: function() {
            return this.commit();
        },
        delete: function(docRef) {
            batch.delete(docRef);
            count++;
            if( count >= 500 ) {
                return this.commit();
            }
            return Promise.resolve(true);
        },
        set: function(docRef, data, options) {
            batch.set(docRef, data);
            count++;
            if( count >= 500 ) {
                return this.commit();
            }
            return Promise.resolve(true);
        },
        update: function(docRef, data)  {
            batch.update(docRef, data);
            count++;
            if( count >= 500 ) {
                return this.commit();
            }
            return Promise.resolve(true);
        },
    }
}
*/

exports.getKakeiboUpdate = function(docData) {
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

exports.loggerString = (log1, log2 = "", log3 = "", log4 = "") => {
    const d = new Date();
    return [d, JSON.stringify(log1), JSON.stringify(log2), JSON.stringify(log3), JSON.stringify(log4)].join(" ")
}

exports.loggerConsole = (log1, log2 = "", log3 = "", log4 = "") => {
    console.log(exports.loggerString(log1, log2, log3, log4));
}

exports.loggerBatchGenerator = function() {
    let log = ""
    return function(log1, log2 = "", log3 = "", log4 = "") {
        log += exports.loggerString(log1, log2, log3, log4) + "\n";
        return log;
    }
}

// update row by row calculation
exports.updateKakeiboDB = async (kakeiboDB, collectionName, logger = exports.loggerConsole) => {
    const updates = [];
    // add/update extra columns
    let ss= await kakeiboDB.collection(collectionName).get();
    logger("got snapshot "+ss.size)
    const docs = ss.docs;
    for(let i=0; i<docs.length; i++) {
        const doc = docs[i];
        const dd = doc.data();
        //result.log.push(dd)
        const ud = exports.getKakeiboUpdate(dd);

        let mustUpdate = false
        if( dd.ID === undefined ) {
            //console.log(ud.ID, doc.id)
            ud.ID = doc.id
            mustUpdate = true
        }
        ["mark", "biko", "himoku", "utiwake", "date" ].forEach((key)=>{
            if( ! dd.hasOwnProperty(key) ) {
                ud[key] = ""
                mustUpdate = true
            }
        })
        Object.keys(ud).forEach((key)=>{
            if( dd[key] !== ud[key] ) {
                mustUpdate = true
            }
        })

        //if( mustUpdate || dd.income !== ud.income || dd.outgo !== ud.outgo || dd.shusi !== ud.shusi || dd.account !== ud.account || dd.account_add !== ud.account_add || dd.account_sub !== ud.account_sub || dd.account_all !== ud.account_all || dd.category_FPlan !== ud.category_FPlan ) {                
        if( mustUpdate ) {
            const p = doc.ref.update(ud);
            updates.push(p)
            //logger(ud, dd);
        }
    }
    logger("updates submitted: "+updates.length);
    return updates;
}


exports.updateKakeiboAccum = async (kakeiboDB, collectionName, logger = exports.loggerConsole) => {
    const updates = [];
    // add/update extra columns
    const ss = await kakeiboDB.collection(collectionName).orderBy("date").orderBy("ID").get();
    logger("got snapshot "+ss.size)
    const docs = ss.docs;
    const accum = {}
    for(let i=0; i<docs.length; i++) {
        const doc = docs[i]
        const data = doc.data();
        const updateData = {}
        // accum
        const aadd = data["account_add"]
        const asub = data["account_sub"]
        accum[aadd] = (accum[aadd] || 0) + data["shusi"];
        if( asub ) {
            accum[asub] = (accum[asub] || 0) - data["shusi"];
        }
        updateData.accum_add = accum[aadd];
        updateData.accum_sub = asub ? accum[asub] : null;
        //console.log(updateData, data)
        if( updateData.accum_add !== data["accum_add"] || updateData.accum_sub !== data["accum_sub"] ) {
            const p = doc.ref.update(updateData);
            //console.log(updateData, data)
            updates.push(p)
        }
    }
    logger("updates submitted: "+updates.length);
    return updates;
}

// guess himoku
exports.fillGuessedHimoku = async (kakeiboDB, collectionName, logger = exports.loggerConsole) => {
    logger("fillGuessedHimoku");

    // modify 16 bank (auto set 費目等)
    const guess = await exports.guessHimoku(kakeiboDB, collectionName);
    ss2= await kakeiboDB.collection(collectionName).get();
    logger("got snapshot "+ss2.size);
    docs2 = ss2.docs;
    let updates = []
    let p;
    for(let i=0; i<docs2.length; i++) {
        const doc = docs2[i];
        const dd = doc.data();
        if( true ) {
            const key = exports.guessHimokuGetKey(dd);
            const g = guess[key];
            if(!dd.himoku && g) { // no himoku, guess exists
                //logger({himoku:g.himoku, utiwake:g.utiwake}, dd)
                p = doc.ref.update({himoku:g.himoku, utiwake:g.utiwake});
            }
            updates.push(p)
        }
    }
    logger("updates submitted: "+updates.length);
    return updates;
    //await Promise.all(updates)
}

// update DB and Accum
exports.recalculateDB = async function(kakeiboDB, collectionName) {
    function putlog(v) { 
        console.log(v) 
    }
    const snapshot = await kakeiboDB.collection(collectionName).orderBy("date").orderBy("ID").get();
    putlog(snapshot.size)
    const docs = snapshot.docs;
    const plist = [];
    const accum = {}
    for(let i=0; i<docs.length; i++) {
        const doc = docs[i]
        const data = doc.data();

        const updateData = {}
        // account_add, etc.
        const dd = data;
        const ud = exports.getKakeiboUpdate(dd);
        if( dd.income !== ud.income || dd.outgo !== ud.outgo || dd.shusi !== ud.shusi || dd.account !== ud.account || dd.account_add !== ud.account_add || dd.account_sub !== ud.account_sub || dd.category_FPlan !== ud.category_FPlan ) {                
            updateData = ud;
        }
        // accum
        const aadd = data["account_add"]
        const asub = data["account_sub"]
        accum[aadd] = (accum[aadd] || 0) + ud["shusi"];
        if( asub ) {
            accum[asub] = (accum[asub] || 0) - ud["shusi"];
        }
        updateData.accum_add = accum[aadd];
        updateData.accum_sub = asub ? accum[asub] : null;
        const p = doc.ref.update(updateData);
        //console.log(updateData)
        plist.push(p)
    }
    putlog(plist.length)
    return Promise.all(plist);
}

exports.updateKakeiboZandaka = async (kakeiboDB, collectionName, at = null, logger = exports.loggerConsole) => {
    const updates = [];
    // add/update extra columns
    let q = kakeiboDB.collection(collectionName);
    if( at ) {
        q = q.where("date", "<=", at);
    }
    const ss = await q.limit(40000).get();
    logger("got snapshot "+ss.size)

    const docs = ss.docs;
    let zandaka = {};
    for(let i=0; i<docs.length; i++) {
        const doc = docs[i]
        const data = doc.data();
        // zandaka
        zandaka[data.account_add] = (zandaka[data.account_add] || 0) + (data.shusi);
        if( data.account_sub ) {
            zandaka[data.account_sub] = (zandaka[data.account_sub] || 0) - (data.shusi);
        }
    }
    //logger(zandaka);
    logger("zandaka calculated")

    // delete and add zandaka    
    await exports.deleteCollection(kakeiboDB, "kakeibo_zandaka");
    logger("delete zandaka")
    const coll = kakeiboDB.collection('kakeibo_zandaka');
    const p = await Promise.all(Object.keys(zandaka).map((a)=>(coll.add({account:a, zandaka:zandaka[a]}))))
    logger("added zandaka")
    return p;
};


exports.updateKakeiboSummary = async (db, kakeiboCollectionName, summaryCollectionName, key1, key2, day1, dayFrom = "1900/01/01", dayTo = "2099/12/31", dayWidth = 4) => {
    const result = {log:[]}
    result.log.push(Date()+" start")
    // caluculate zandaka and summary
    let snapShot = await db.collection(kakeiboCollectionName).limit(40000).get();
    let summary = {};
    result.log.push(snapShot.size);
    result.log.push(Date())
    snapShot.forEach((d)=>{
        const data = d.data();
        if( data[day1] >= dayFrom && data[day1] <= dayTo ) {
            // summary
            const k1 = key1
            const k2 = key2
            const d1 = day1
            const dw = dayWidth
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
        }
    });
    result.log.push(Date()+" calculated")

    // summary
    await exports.deleteCollection(db, summaryCollectionName);
    result.log.push(Date()+ "deleted summary")
    const coll2 = db.collection(summaryCollectionName);
    const dataList = [];
    for(const k1 of Object.keys(summary)) {
        for(const k2 of Object.keys(summary[k1])) {
            for(const k3 of Object.keys(summary[k1][k2])) {
                const v = summary[k1][k2][k3];
                dataList.push({key1:k1, key2:k2, key3:k3, value:v})
            }
        }
    }
    result.log.push(Date()+ " added summary: "+dataList.length)
    result.log.push("*** job has been sumitted to background...")
    return await Promise.all(dataList.map((a)=>(coll2.add(a))))
};


exports.guessHimokuGetKey = (data) => {
    function zenkaku2hankaku(str) { // 英数字のみ
        return str?.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });
    }
    return zenkaku2hankaku(data.biko)?.replace(/[0-9]/g, "")?.replace(/ nan/g,"")?.replace(/^##/,"")?.replace(/[　 ]*/g, " ")?.trim();
}

exports.guessHimoku = async (kakeiboDB, collectionName, logger = exports.loggerConsole) => {

    const updates = [];
    let q = kakeiboDB.collection(collectionName).orderBy("date");
    const ss = await q.limit(40000).get();
    logger("got snapshot "+ss.size)    

    const docs = ss.docs;
    let guess = {};
    docs.filter((doc)=>(doc.data().biko && doc.data().himoku && doc.data().utiwake && doc.data().account && doc.data().account !== "現金")).forEach((doc)=>{
        const data = doc.data();
        const key = exports.guessHimokuGetKey(data)
        if(guess[key]) {
            if( guess[key].latest < data.date ) {
                guess[key] = {latest: data.date, himoku: data.himoku, utiwake:data.utiwake }
            }
        } else {
            guess[key] = {latest: data.date, himoku: data.himoku, utiwake:data.utiwake }
        }
    })
    //logger(zandaka);
    return guess;
};


exports.deleteCollection = async function(db, collectionName) {
    const snapshot = await db.collection(collectionName).get();
    const docs = snapshot.docs;
    //console.log("count to delete", snapshot.size)
    const batcher = new Batcher(db);
    //for(let i=0; i<docs.length; i++) {
    //    //await batcher.delete(docs[i].ref);
    //}
    const deletePromises = docs.map((doc)=>(batcher.delete(doc.ref)));
    deletePromises.push(batcher.end());
    //console.log("delete completed")
    return Promise.all(deletePromises);
}

exports.copyCollection = async function(db, collectionNameFrom, collectionNameTo) {
    const snapshot = await db.collection(collectionNameFrom).get();
    const plist = []
    snapshot.forEach((doc)=>{
        const p = db.collection(collectionNameTo).add(doc.data());
        plist.push(p)
    })
    return Promise.all(plist);
}

