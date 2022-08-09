<!--- 
    Component FirestoreCrud

    installation

    usage

--->


<template>

    <div id="app">
        <div>
            <button @click="onclick_login">ログイン</button>
            <span>{{currentUser?.displayName}} {{currentUser?.email}}</span>
            <button @click="onclick_logout">ログアウト</button>
        </div>
        <br>
        <div>
            Source: <input type="text" v-model="sourceName" list="source">
            <datalist id="source"><option :value="opt" v-for="opt in Object.keys(sourceList)" v-bind:key="opt"></option></datalist>
            Collection: <input type="text" v-model="collectionName" readonly="readonly">
            Limit: <input type="text" v-model="limit">
        </div>
        <div style="color:red">{{message}}</div>

        <!-- Search Condition -->
        <a href="#" @click="onclick_condition">search condition</a>
        <div v-if="displayConditionForm" class="panel modal_window">
            Search Conditions
            <form>
                <table>
                    <tr v-for="([key, value]) in Object.entries(searchCondition)" v-bind:key="key">
                        <th>{{key}}</th>
                        <td>
                            <input type="text" class="searchCondition_inp" :name="key" v-model="value[0]" :list="key" @focus="setOptions"><!--find((e)=>(e.name === key)) -->
                            <datalist :id="key"><option :value="opt" v-for="opt in (schema.find((e)=>(e.name === key)).options)" v-bind:key="opt"></option></datalist>
                        </td>
                        <td>
                            <input type="text" class="searchCondition_inp" :name="key" v-model="value[1]" :list="key" @focus="setOptions">
                        </td>
                    </tr>
                </table>
                <input type="button" value="Search" v-on:click="onclick_search">
                <input type="button" value="Close" @click="displayConditionForm = false;">
            </form>
        </div>

        <!-- Add Item -->
        <div>
            <a href="#" @click="onclick_add">add item</a>
            <svg  @click="onclick_add" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-square-fill" viewBox="0 0 16 16">
                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z"/>
            </svg>
        </div>
        
        <!-- Deltailed/Edit -->
        <div v-if="Object.keys(this.detailView).length > 0" class="panel modal_window">
            <span v-if="this.detailView.docid">Edit Item</span>
            <span v-else>Add Item</span>
            <form>
                <table>
                    <tr v-for="n in detailNames" v-bind:key="n.name">
                        <th>{{n.name}}</th>
                        <td>
                            <input type="text" class="detailed_inp" :name="n.name" v-model="detailView.data[n.name]" :list="n.name" @focus="setOptions">
                            <!--
                            <input v-if="this.schema?.find((e)=>(e.name===n.name))?.type === 'number'" 
                                type="text" class="detailed_inp" :name="n.name" v-model.number="detailView.data[n.name]" :list="n.name" @focus="setOptions">
                            <input v-else
                                type="text" class="detailed_inp" :name="n.name" v-model="detailView.data[n.name]" :list="n.name" @focus="setOptions">
                            -->
                            <!--- same ID of datalist ?????? -->
                            <datalist :id="n.name"><option :value="opt" v-for="opt in (schema.find((e)=>(e.name === n.name)).options)" v-bind:key="opt"></option></datalist> 
                        </td>
                    </tr>
                </table>
                <input type="button" value="Submit" @click="onclick_submit">
                <input type="button" value="Close" @click="onclick_close">
            </form>
        </div>

        <!-- Resultant List -->
        <div class="add-item container panel">
            Search Results
            <div id="searchResultMessage">{{searchResultMessage}}</div>
            <table border="1">
              <thead>
               <tr>
                   <th>No.</th>
                   <th v-for="n in listNames" v-bind:key="n.name">{{n.name}}</th>
               </tr>
             </thead>
             <tbody> 
                <tr v-for="(item, index) in this.docList" :key="item.docid">
                    <td>{{ index + 1 }}</td>
                    <td v-for="n in listNames" v-bind:key="n.name">{{item.data[n.name]}}</td>
                    <td @click="onclick_edit(index)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/></svg>
                    </td>
                    <td @click="onclick_delete(index)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/></svg>
                    </td>
                </tr>
              </tbody>
            </table>
        </div>

    </div>

</template>



<script>
    import Vue from 'vue'

    import {db} from '@/config/firebase.js'  // @ is the project home of webpack
    import { collection, doc, setDoc, addDoc, query, where, limit, getDocs, deleteDoc } from "firebase/firestore";
    import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider  } from "firebase/auth";

    const auth = getAuth()
    
/*
    import firebase from 'firebase/app';
    import 'firebase/firestore';
    import 'firebase/auth';

    // ---- Firebase Configs ------
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
        name: 'FirestoreCrud',
        components: {
        },
        props: {
            sourceList: Object,
        },
        data: function() {
            return {
                // auth
                currentUser: null,

                // --- data on page ------
                sourceName:"",
                limit:"obsoleted",
                searchCondition:{},  // {fieldName1:[value1, value2], ...}
                docList:[],          // [{docid:id, data:{field1:value1, ...}}, ...]
                detailView:{},       // an element of docList
                message:"",
                searchResultMessage:"",

                // -- control on page ----
                displayConditionForm:false,

                // ---- others ------
                schema: [],

                test:{},
            }
        },
        methods: {
                onclick_login: onclick_login,
                onclick_logout: onclick_logout,
                onclick_condition: onclick_condition,
                onclick_search: function(){onclick_search(this)},
                onclick_add: onclick_add,
                onclick_edit: onclick_edit,
                onclick_delete: onclick_delete,
                onclick_submit: onclick_submit,
                onclick_close: onclick_close,
                setOptions: setOptions,
        },

        computed: {
                listNames: function () {
                    return this.schema?.filter((e)=>(e.list));
                },
                detailNames: function () {
                    return this.schema;
                },
                collectionName: function() {
                    return this.sourceList[this.sourceName]?.collectionName
                },
        },
        watch: {
                sourceName: async function(){
                    this.message = "processing..."
                    this.searchCondition = {}; 
                    this.docList = []; 
                    this.detailView = {};
                    this.displayConditionForm = false
                    this.schema = await getSchema(this.sourceList[this.sourceName]); 
                    this.message = ""
                },
        },
        mounted: async function() {
            console.log("mounted this = ", this)
            const that = this;
            // init auth
            onAuthStateChanged(auth, function(user) {
                if (user) {
                    console.log('login now', user?.displayName);
                    that.currentUser = user;
                } else {
                    console.log('logout now');
                    that.currentUser = null;
                }
            });

            // init schema
            this.schema = await getSchema(this.sourceList[this.sourceName]); 

            // init item in page
            this.sourceName = Object.keys(this.sourceList)[0];
        },
    }

    const firestoreQueryLimit = 4000;

    // ----- login / logout
                    
    function onclick_login() {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider).then(result => {
            const user = result.user
            console.log("login success, user = ", user)
            this.currentUser = user;
        }).catch(function(err) {
            console.log("login error")
            console.error(err)
            // エラー処理
        })
    }
    function onclick_logout() {
        auth.signOut().then(() => {
            console.log("logout success")
            this.currentUser = null;
        }).catch(function(err) {
            console.log("logout error")
            console.error(err)
        })
    }

    // ----- options


    // set option data to the item in panel
    async function setOptions(evt){
        console.log("setOptions")
        const key = evt.target.name;
        console.log(key)
        //console.log(this.sourceList[this.sourceName])
        const s = this.schema.find((e)=>(e.name === key));
        //console.log(s)
        if(s.getOptions) {
            Vue.set(s, "options", await s.getOptions(evt, this));
        } else {
            Vue.set(s, "options", [])
        }
        console.log("options", s.options)
    }




    async function onclick_condition(){
        if( Object.keys(this.searchCondition).length === 0 && this.schema.length > 0 ) {
            console.log("opening condition panel", this.schema)
            const ent = this.schema.map((e)=>([e.name, ["",""]]));
            this.searchCondition = Object.fromEntries(ent)
        }
        this.displayConditionForm = true; 
    }

    // 
    async function get_search_docdata(collectionName, vueapp) {
        const conditionEqual = Object.entries(vueapp.searchCondition).filter((e)=>(e[1][0] !== "" && e[1][1] === ""))
        const conditionUnEqual = Object.entries(vueapp.searchCondition).filter((e)=>(e[1][0] !== "" && e[1][1] !== ""))
        const conditionRegExp = Object.entries(vueapp.searchCondition).filter((e)=>(e[1][0] === "" && e[1][1] !== ""))
        let q = query(collection(db, collectionName), limit(firestoreQueryLimit)); // limit for preventing error lock
        // set server-side filtering
        conditionEqual.forEach((e)=>{
            const k = e[0]
            const v = e[1]
            q = query(q, where(k, "==", v[0] ));
            console.log("add db filter condition: " + k + " == " + v[0])
        });
        if( conditionEqual.length === 0 ) {
            const p = conditionUnEqual.pop();
            if(p) {
                let lower = p[1][0]
                let upper = p[1][1]
                if( vueapp.schema?.find((e)=>(e.name===p[0]))?.type === 'number' ) {
                    lower = Number(lower)
                    upper = Number(upper)
                }
                console.log(typeof lower)
                console.log(typeof upper)
                q = query(q, where(p[0], ">=", lower ), where(p[0], "<=", upper ));
                console.log("add db filter condition: unequal for " + p[0])
            }
        }
        // query
        const querySnapshot = await getDocs(q);
        let docs = querySnapshot.docs.map((d)=>({docid:d.id, data:d.data()}));
        // create doc list
        const docList = [];
        docs.forEach((doc) => {
            const cond1 = conditionRegExp.every((e)=>{
                const name = e[0]
                const value = e[1]
                return (String(doc.data[name]).match(value[1]));
            });
            const cond2 = conditionUnEqual.every((e)=>{
                const name = e[0]
                const value = e[1]
                return (doc.data[name] >= value[0] && doc.data[name] <= value[1]);
            });
            if(cond1 && cond2) {
                //console.log(doc.docid, " => ", doc.data);
                docList.push(doc);
            }
        });

        // set message
        vueapp.searchResultMessage = `result ${docList.length} (db result ${querySnapshot.size}, limit ${firestoreQueryLimit}) `
                + (querySnapshot.size === firestoreQueryLimit ? " ERROR: search results exceeded the limit " : "");

        return docList;
    }

    async function onclick_search(that1 = null) {
        const that = that1 || this
        console.log("searching by condition", that.searchCondition)
        that.message = "processing..."
        console.log(that)
        try {
            const docList = await get_search_docdata(that.sourceName, that);
            that.docList = await that.sourceList[that.sourceName].sourceFilter(docList);
            that.displayConditionForm = false;
        } catch(error) {
            console.log("Error getting documents: ", error);
        } finally {
            that.message = ""
        }
    }


    async function onclick_add(){
        this.detailView = {
            data:Object.fromEntries(this.detailNames.map((e)=>([e,""]))),
            docid:null
        }
    }

    function onclick_edit(index){
        console.log("edit "+index)
        this.detailView = this.docList[index];
    }

    function onclick_delete(index){
        console.log("delete "+index);
        const docid = this.docList[index].docid;

        this.$bvModal.msgBoxConfirm('Are you sure to delete?')
        .then(value => {
                console.log(value)
                if(value){
                    this.docList.splice(index, 1);
                    deleteDoc(doc(db, this.collectionName, docid));                    
                }
        })
        .catch(err => {
            alert(err)
        })
    }

    async function onclick_submit(){
        const obj = this.detailView.data;
        if( this.detailView.docid ) { // edit
            await setDoc(doc(db, this.collectionName, this.detailView.docid), obj);
        } else { // add
            await addDoc(collection(db, this.collectionName), obj);
        }
        onclick_search(this);
        this.detailView = {};
    } 

    function onclick_close(){
        this.detailView = {};
    } 



    // get schema of current source in sourceList
    async function getSchema(source){
        if( source?.schema ) {
            return source.schema;
        } else if( source ) {
            // auto create
            console.log("automatically creating schema...")
            //const ds = await source.source();
            const docList = await get_search_docdata(source.collectionName, this);
            const ds = await source.sourceFilter(docList);
            if(ds.length === 0) { console.log("cannot get data of source = ", source); return []; }
            const sc = Object.keys(ds[0]).sort().map((k)=>({name:k, list:true}));
            return sc;
        }
    }


</script>


<style>
    .panel { 
          padding: 30px; margin:5px; border:solid 1px black; 
    }
    .modal_window {
        position: fixed;
        z-index: 999;
        background-color: lightgray;
    }

</style>

