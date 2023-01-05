'use strict';
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
}

// get data from firebase
export async function selectData(path) {
    const dbref = ref(db);
    try {
        // truong hop ton tai du lieu theo path, thi goi callBack truyen du lieu vao xu ly tiep
        let snapshot = await get(child(dbref, path));
        let value = await snapshot.val();
        return value;
    } catch (error) {
        // truong hop loi, khong khong ton tai path trong firebase, thi tao path moi
        return null;
    }
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

export function handle(value, gioHienTai, path) {
    //doi khi nap co du lieu ben cam bien thi comment lai
    value.now = Math.random() * 20 + 20;

    // truong hop tao gio moi tren firebase
    if (!value[gioHienTai]) {
        const ob = {[gioHienTai]: {}};
        Object.assign(value, ob);
    }

    let now = value.now;

    if (path === "temp") {
        now > 1000 && (now = now / 100);
        now > 100 && (now = now / 10);
    }

    try {
        value.now = now.toFixed(2);
    } catch (e) {
        value.now = now;
    }

    return value;
}