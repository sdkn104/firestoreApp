
<template>
    <div id="app">
        <firestore-crud v-bind:source-list="sourceList"></firestore-crud>
    </div>
</template>



<script>
    //import Vue from 'vue'

    import FirestoreCrud from './components/FirestoreCrud.vue'

    import {db} from './firestore.js'
    import { collection, query, limit, getDocs  } from "firebase/firestore";

/*
    import firebase from 'firebase/app';
    import 'firebase/firestore';
    import 'firebase/auth';

    // ---- Configs ------
    const firebaseConfig = {
        apiKey: "AIzaSyAzC5upkkaduxsYhkGqukXGItb_x00gjcY",
        authDomain: "fresh-catwalk-335010.firebaseapp.com",
        projectId: "fresh-catwalk-335010",
        storageBucket: "fresh-catwalk-335010.appspot.com",
        messagingSenderId: "656639514271",
        appId: "1:656639514271:web:773d44848395e5f5f0b4aa",
        measurementId: "G-L1PTCJS8T2"
    }
    const firebaseSettings = { timestampsInSnapshots: true }

    // Initialize Firebase
    if (firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
    }
    //const analytics = getAnalytics(app);
    firebase.firestore().settings(firebaseSettings);
    
*/


    export default {
        name: 'App',
        components: {
            FirestoreCrud,
        },
        data: function() {
            return {
                sourceList:{ // key = sourceName
                    kakeibo: {
                        collectionName: "kakeibo",
                        sourceFilter:  (a)=>(sortByFields(a, ["date", "ID", "himoku"], [-1,-1])),
                        schema: [
                            {name:"date", list:true}, 
                            {name:"himoku", list:true, getOptions: getOptions_himoku},
                            {name:"utiwake", list:true, getOptions: getOptions_utiwake},
                            {name:"biko", list:true}, 
                            {name:"mark", list:true, getOptions: ()=>(["一時会計", "特別会計"])}, 
                            {name:"income", list:true, type:"number"}, 
                            {name:"outgo", list:true, type:"number"}, 
                            {name:"shusi", type:"number"}, 
                            {name:"account", list:true, getOptions: ()=>(get_docs("kakeibo").then( (r) => (myUniq(r.map(e=>e.data().account)).sort())))}, 
                            {name:"category_FPlan"},
                            {name:"account_add"},
                            {name:"account_sub", list:true, getOptions: ()=>(get_docs("kakeibo").then( (r) => (myUniq(r.map(e=>e.data().account)).sort())))},
                            {name:"account_all", list:true, getOptions: ()=>(get_docs("kakeibo").then( (r) => (myUniq(r.map(e=>e.data().account)).sort())))},
                            {name:"accum_add", list:true, type:"number"},
                            {name:"accum_sub", list:true, type:"number"},
                            {name:"CREATE_TIME"},
                            {name:"ID"},
                        ],
                    },
                    kakeibo_zandaka: {
                        collectionName: "kakeibo_zandaka",
                        sourceFilter:  (a)=>(sortByFields(a, ["zandaka"], [-1])),
                        schema: [
                            {name:"account", list:true}, 
                            {name:"zandaka", list:true}, 
                        ],
                    },
                    kakeibo_summary: {
                        collectionName: "kakeibo_summary",
                        sourceFilter: (a)=>(sortByFields(a, ["key3", "key1", "key2"])),
                        schema: [
                            {name:"key1", list:true}, 
                            {name:"key2", list:true}, 
                            {name:"key3", list:true}, 
                            {name:"value", list:true}
                        ],
                    },
                    kakeibo_himoku: {
                        collectionName: "kakeibo_himoku",
                        sourceFilter:  (a)=>(sortByFields(a, ["key1", "key2"])),
                        schema: [
                            {name:"key1", list:true}, 
                            {name:"key2", list:true}, 
                            {name:"key3"}, 
                            {name:"value"}
                        ],
                    },
                    sampleKey: {
                        collectionName: "sampleKey",
                        sourceFilter: (a)=>(a),
                        schema: [
                            {name:"name", list:true}, 
                            {name:"state", list:true}, 
                            {name:"country", list:true}, 
                            {name:"db_doc_id"}
                        ],
                    },

                },
            }
        },
        methods: {
        },
        computed: {
        },
        watch: {
        },
        mounted: async function() {
        },
    }

    const firestoreQueryLimit = 4000;



    function myUniq(array) {
        return array.filter((elem, index, self) => (self.indexOf(elem) === index));
    }

    // ----- options

    function getOptions_himoku() {
        return get_docdata("kakeibo_himoku").then( (r) => (myUniq(r.map(e=>e.key1)).sort()) );
    }
    function getOptions_utiwake(evt, vueapp) {
        const sc = evt.target.className.split(/ +/).includes("searchCondition_inp");
        const himoku = sc ? vueapp.searchCondition.himoku[0] : vueapp.detailView.data.himoku // TODO
        console.log("himoku value", himoku)
        return get_docs("kakeibo_himoku").then((r)=>{
            return myUniq(r.filter((e)=>(e.data().key1 === himoku)).map(e=>e.data().key2)).sort()
        })
    } 

    // ------ get docs used in getOptions_himoku

    function get_docs(collectionName) {
        const q = query(collection(db, collectionName), limit(firestoreQueryLimit));
        return getDocs(q).then((ss)=>(ss.docs));
    }
    function get_docdata(collectionName) {
        return get_docs(collectionName).then((docs)=>(docs.map((d)=>(d.data()))));
    }

    // sorting by multiple field values
    // const sorted = sortByFields([{, }, ...], ["a", "b"], [1, -1])
    function sortByFields(arr, fields, orders = []){
        const compareBase = (a, b, field) => ((a.data[field] > b.data[field]) ? 1 : (a.data[field] < b.data[field]) ? -1 : 0)
        const compare = (a, b) => {
            for(let i = 0; i < fields.length; i++) {
                const field = fields[i];
                const r = compareBase(a, b, field);
                //console.log(i, field,a, b,  r)
                if( r !== 0 ) {
                    return ( orders[i] ? r * orders[i] : r );
                }
            }
            return 0;
        }
        return arr.sort(compare);
    }
</script>


<style>
</style>
