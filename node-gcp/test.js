
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


    /*  restore mark, date, himoku, biko from kakeibo_bkup
      --- for 988 data that has ID corresponding to kakeibo_bkup
    let ss= await db.collection("kakeibo_bkup").get();
    console.log("got snapshot "+ss.size)
    const docs = ss.docs;
    const hash = {}
    for(let i=0; i<docs.length; i++) {
        const doc = docs[i];
        const dd = doc.data();
        hash[dd.ID] = {date:dd.date, himoku:dd.himoku, mark:dd.mark, biko:dd.biko}
        if( ! dd.ID ) { console.log("no ID", dd)}
        if( ! dd.date ) { console.log("no date", dd)}

        if(1) {
            //const p = doc.ref.update(ud);
            //updates.push(p)
            //logger(ud, dd);
        }
    }
    console.log("hash count", Object.keys(hash).length)

    let ss2= await db.collection("kakeibo").get();
    console.log("got snapshot "+ss2.size)
    const hash2 = {}
    const docs2 = ss2.docs;
    let noidcnt =0;
    const updates = []
    for(let i=0; i<docs2.length; i++) {
        const doc = docs2[i];
        const dd = doc.data();
        hash2[dd.ID] = dd.date
        if( ! dd.ID ) { console.log("no ID", dd)}
        //if( ! (dd.ID in hash) ) { 
        //    noidcnt++; 
        //    //console.log("no ID in hash", dd)
        //}
        if(dd.ID in hash) {
            const ud = hash[dd.ID]
            //console.log(ud)
            const p = doc.ref.update(ud);
            updates.push(p)
        }
    }
    console.log("hash count", Object.keys(hash2).length)
    //console.log("noid count", noidcnt)
    await Promise.all(updates)
    */

    // 集計
    /*
    let ss= await db.collection("kakeibo").get();
    console.log("got snapshot "+ss.size)
    const docs = ss.docs;
    const data = []
    for(let i=0; i<docs.length; i++) {
        const doc = docs[i];
        const dd = doc.data();
        if( ! dd.date ) { data.push(dd) }
    }
    console.log("no datecount", data.length) // 988
    */

    // 手動登録： 2021/04/01 フェンス工事 135000

    // date = "" を "2022/03/30", biko="#"
    /*
    let ss2= await db.collection("kakeibo").get();
    console.log("got snapshot "+ss2.size)
    const docs2 = ss2.docs;
    const updates = []
    for(let i=0; i<docs2.length; i++) {
        const doc = docs2[i];
        const dd = doc.data();
        if(dd.date === "0000/00/00" ) {
            const p = doc.ref.update({date:"2022/03/29", biko:"#"});
            updates.push(p)
        }
    }
    await Promise.all(updates)
    */

    //backup
    //await myKakeibo.deleteCollection(db, "kakeibo_bkup"); 
    //await myKakeibo.copyCollection(db, "kakeibo", "kakeibo_bkup2");


    /* 
    const guess = await myKakeibo.guessHimoku(db, "kakeibo");
    console.log(guess)
    //sconsole.log(guess["DF．RLタ゛イコウ"])

    let ss2= await db.collection("kakeibo").get();
    console.log("got snapshot "+ss2.size)
    const docs2 = ss2.docs;
    const updates = []
    for(let i=0; i<docs2.length; i++) {
        const doc = docs2[i];
        const dd = doc.data();
        if(dd.biko?.startsWith("##")) {
            const key = myKakeibo.guessHimokuGetKey(dd).replace(/^##/,"")
            //if( key === "DF．RLタ゛イコウ") { console.log("#", dd, guess[key]) }
            //console.log(dd.biko, key)
            const g = guess[key];
            if(!dd.himoku && g) {
                console.log(g, dd)
                //const p = doc.ref.update({date:"2022/03/29", biko:"#"});
                //updates.push(p)
            }    
        }
    }
    //await Promise.all(updates)
    */

    // restore
    //await myKakeibo.deleteCollection(db, "kakeibo"); 
    //await myKakeibo.copyCollection(db, "kakeibo_bkup2", "kakeibo");

    /*
    // remove double redundant
    let ss2= await db.collection("kakeibo").get();
    console.log("got snapshot "+ss2.size)
    let docs2 = ss2.docs;
    let cnt = 0;
    const hash1 = {}
    const updates = []
    for(let i=0; i<docs2.length; i++) {
        const doc = docs2[i];
        const dd = doc.data();
        const key = dd.date+","+dd.himoku+","+dd.utiwake+","+dd.biko+","+dd.mark+","+dd.income+","+dd.outgo+","+dd.account+","+dd.ID
        if( ! hash1[key] ) {
            hash1[key] = 1
            const p = doc.ref.delete()
            updates.push(p)
            //console.log(dd)
            cnt ++
        }
    }
    console.log(cnt)
    await Promise.all(updates)

    let ss2= await db.collection("kakeibo").get();
    console.log("got snapshot "+ss2.size)
    await myKakeibo.copyCollection(db, "kakeibo", "kakeibo_bkup3_removedup");   

    // copy date 
    let ss2= await db.collection("kakeibo").get();
    console.log("got snapshot "+ss2.size)
    let docs2 = ss2.docs;
    const hash1 = {}
    const hash2 = {}
    const dat2 = {}
    for(let i=0; i<docs2.length; i++) {
        const doc = docs2[i];
        const dd = doc.data();
        const key = dd.outgo +","+dd.account + "," + dd.utiwake + "," + dd.mark
        if(dd.biko === "#" ) {
            hash1[key] = hash1[key] ? hash1[key]+1: 1;
        }
        if(dd.biko?.startsWith("##") ) {
            hash2[key] = hash2[key] ? hash2[key]+1: 1;
            dat2[key] = {date: dd.date, himoku:dd.himoku, utiwake:dd.utiwake, mark:dd.mark, biko:"__"+dd.biko }
        }
    }
    console.log(hash1)
    console.log(hash2)
    console.log(dat2)

    ss2= await db.collection("kakeibo").get();
    console.log("got snapshot "+ss2.size)
    docs2 = ss2.docs;
    let updates = []
    for(let i=0; i<docs2.length; i++) {
        const doc = docs2[i];
        const dd = doc.data();
        const key = dd.outgo +","+dd.account + "," + dd.utiwake + "," + dd.mark
        if(dd.biko === "#" ) {
            const dat = dat2[key]
            if( hash1[key] === 1 && hash2[key] === 1 && dd.utiwake === dat2[key].utiwake ) {
                console.log( 1)
                console.log("copy", dat2[key], dd)
                const p = doc.ref.update({date:dat2[key].date});
                updates.push(p)
                // SHOULD delete old...s
            }
        }
    }
    await Promise.all(updates)

    //backup
    //await myKakeibo.deleteCollection(db, "kakeibo_bkup3"); 
    //await myKakeibo.copyCollection(db, "kakeibo", "kakeibo_bkup3");

    ss2= await db.collection("kakeibo").get();
    console.log("got snapshot "+ss2.size)
    docs2 = ss2.docs;
    let updates = []
    let cnt = 0;
    for(let i=0; i<docs2.length; i++) {
        const doc = docs2[i];
        const dd = doc.data();
        if(dd.biko === "#" && dd.date === "2022/03/29" && dd.account === "楽天カード" && dd.himoku === "") {
                console.log("deletwe", dd)
                cnt++
                const p = doc.ref.delete();
                updates.push(p)
        }
    }
    console.log(cnt)
    await Promise.all(updates)


    //backup
    //await myKakeibo.deleteCollection(db, "kakeibo_bkup3"); 
    //await myKakeibo.copyCollection(db, "kakeibo", "kakeibo_bkup4");

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
        if(dd.biko?.startsWith("##") && dd.account == "十六銀行" && dd.date >= "2021/04/01" ) {
                const key = myKakeibo.guessHimokuGetKey(dd).replace(/^##/,"")
                //console.log(dd.biko, key)
                const g = guess[key];
                if(!dd.himoku && g) {
                    console.log({himoku:g.himoku, utiwake:g.utiwake}, dd)
                    p = doc.ref.update({himoku:g.himoku, utiwake:g.utiwake});
                }
                updates.push(p)
        }
    }
    await Promise.all(updates)

    //backup
    await myKakeibo.copyCollection(db, "kakeibo", "kakeibo_bkup5");

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
        if(dd.biko?.startsWith("##") && dd.account == "十六銀行" && dd.date >= "2021/04/01" ) {
                const key = myKakeibo.guessHimokuGetKey(dd)
                //console.log(dd.biko, key)
                const g = guess[key];
                if(!dd.himoku && g) {
                    console.log({himoku:g.himoku, utiwake:g.utiwake}, dd)
                    p = doc.ref.update({himoku:g.himoku, utiwake:g.utiwake});
                }
                updates.push(p)
        }
    }
    await Promise.all(updates)

    //backup
    //await myKakeibo.copyCollection(db, "kakeibo", "kakeibo_bkup6");

    // manual fix on juroku
    //backup
    //await myKakeibo.copyCollection(db, "kakeibo", "kakeibo_bkup7");

    ss2= await db.collection("kakeibo").get();
    console.log("got snapshot "+ss2.size)
    docs2 = ss2.docs;
    let updates = []
    let cnt = 0;
    for(let i=0; i<docs2.length; i++) {
        const doc = docs2[i];
        const dd = doc.data();
        if(dd.biko === "#" && dd.date === "2022/03/29" && dd.account === "イーバンク" && dd.himoku === "") {
                console.log("delete", dd)
                cnt++
                const p = doc.ref.delete();
                updates.push(p)
        }
    }
    console.log(cnt)
    await Promise.all(updates)

    //backup
    await myKakeibo.copyCollection(db, "kakeibo", "kakeibo_bkup8");
    */

    ss2= await db.collection("kakeibo").get();
    console.log("got snapshot "+ss2.size)
    docs2 = ss2.docs;
    let updates = []
    let cnt = 0;
    for(let i=0; i<docs2.length; i++) {
        const doc = docs2[i];
        const dd = doc.data();
        if(dd.biko === "#" && dd.date === "2022/03/29" && dd.himoku === "") {
                console.log("delete", dd)
                cnt++
                const p = doc.ref.delete();
                updates.push(p)
        }
    }
    console.log(cnt)
    await Promise.all(updates)

    //backup
    await myKakeibo.copyCollection(db, "kakeibo", "kakeibo_bkup9");


})();


