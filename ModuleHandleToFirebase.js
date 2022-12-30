'use strict'
import { getDatabase, set, get, update, remove, ref, child } from 'firebase/database';
import { initializeApp } from 'firebase/app';

// config to connect to firebase
const firebaseConfig = {
    apiKey: 'AIzaSyAPjGTsG9PuaAQK1RivTCFpbOsYYMkrjws',
    authDomain: 'smartappdb-25c3d.firebaseapp.com',
    databaseURL: 'https://smartappdb-25c3d-default-rtdb.firebaseio.com',
    projectId: 'smartappdb-25c3d',
    storageBucket: 'smartappdb-25c3d.appspot.com',
    messagingSenderId: '173484980207',
    appId: '1:173484980207:web:723c18247e1a892ecda81a',
    measurementId: 'G-BF7016Z27L',
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getDatabase();

// insert data to firebase
export function insertData(path, data) {
    set(ref(db, path), data)
        .then(() => {})
        .catch((error) => console.error('faild:', error));
};

// get data from firebase
export function selectData(path, gio, callBack) {
    const dbref = ref(db);
    
    get(child(dbref, path))
        .then(snapshot => {
            if (snapshot.exists()) {
                // truong hop ton tai du lieu theo path, thi goi callBack truyen du lieu vao xu ly tiep
                callBack(snapshot.val());
            } else {
                insertDefaultData(path + '/' + gio);
            }
        })
        .catch(error => {
            // truong hop loi, khong khong ton tai path trong firebase, thi tao path moi
            console.error('faild - when select data from firebase: ', error);
            insertDefaultData(path + '/' + gio);
        });
};

function insertDefaultData(path) {
    const phut = new Date().getMinutes();
    const data = { [phut]: 0 };
    insertData(path, data);
}

// delete data to firebase
// const deleteData = function (data) {
//     remove(ref(db, 'people/tuan'))
//         .then(() => console.log('sussefully'))
//         .catch((error) => console.error('faild:', error));
// };

// update data to firebase
// const updateData = function () {
//     update(ref(db, 'people/tuan'), {
//         name: data,
//     })
//         .then(() => console.log('sussefully'))
//         .catch((error) => console.error('faild:', error));
// };