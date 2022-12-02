'use strict';

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, set, get, update, remove, ref, child }
    from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAPjGTsG9PuaAQK1RivTCFpbOsYYMkrjws",
    authDomain: "smartappdb-25c3d.firebaseapp.com",
    databaseURL: "https://smartappdb-25c3d-default-rtdb.firebaseio.com",
    projectId: "smartappdb-25c3d",
    storageBucket: "smartappdb-25c3d.appspot.com",
    messagingSenderId: "173484980207",
    appId: "1:173484980207:web:723c18247e1a892ecda81a",
    measurementId: "G-BF7016Z27L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

// create url to connect to Firebase
const paths = {
    temp: "temp",
    hum: "hum",
    ssCO2: "ssCO2",
    dustDensity: "dustDensity",
    votage: "Votage",
    current: "Current",
    power: "Power",
    water: "Water",
};

// select cac element chua content
const elementShowTime = $("#show-time");
const elements = {
    temp: $("#content-temp"),
    hum: $("#content-hum"),
    ssCO2: $("#content-ssCO2"),
    dustDensity: $("#content-dustDensity"),
    votage: $("#content-Votage"),
    current: $("#content-Current"),
    power: $("#content-Power"),
    water: $("#content-Water"),
};

// insert data to firebase
const insertData = (path, data) => {
    set(ref(db, path), data)
        .then(() => {})
        .catch((error) => console.error("faild:", error));
};

// get data from firebase
const selectData = (path, gio, callBack) => {
    const dbref = ref(db);
    get(child(dbref, path))
        .then((snapshot) => {
            if (snapshot.exists()) {
                // truong hop ton tai du lieu theo path, thi goi callBack truyen du lieu vao xu ly tiep
                callBack(snapshot.val());
            } else {
                insertDefaultData(path + "/" + gio, data);
            }
        })
        .catch((error) => {
            // truong hop loi, khong khong ton tai path trong firebase, thi tao path moi
            console.error("faild - when select data from firebase: ", error);
            insertDefaultData(path + "/" + gio);
        });
};

const insertDefaultData = path => {
    const data = { [phut]: 0 };
    insertData(path, data);
}

// delete data to firebase
// const deleteData = function (data) {
//     remove(ref(db, "people/tuan"))
//         .then(() => console.log("sussefully"))
//         .catch((error) => console.error("faild:", error));
// };

// update data to firebase
// const updateData = function () {
//     update(ref(db, "people/tuan"), {
//         name: data,
//     })
//         .then(() => console.log("sussefully"))
//         .catch((error) => console.error("faild:", error));
// };

/**
 * ham dung de render du lieu ra giao dien
 * @param elementShowTime: la element, noi chua giao dien can hien thi
 * @param object: la doi tuong chua du lieu
 */
const renderTable = (elementContent, object, label, color) => {
    let listGios = Object.keys(object);
    listGios.pop();

    let htmls = `
        <thead>
            <tr>
                <th class="text-center rounded text-white bg-${color}" scope="col" colspan="3">${label}</th>
            </tr>
        </thead>
        <tbody>
            <tr class="text-red">
                <td class="gio">Now</td>
                <td colspan="2">${object.now}</td>
            </tr>
    `;

    listGios.forEach(gio => {
        let listPhuts = Object.keys(object[gio]);
        let now = new Date();

        listPhuts.forEach(phut => {
            htmls += `
                <tr ${
                    now.getHours() == gio &&
                    now.getMinutes() == phut &&
                    'class="text-red"'
                }>
                    <td>${gio}</td>
                    <td>${phut}</td>
                    <td class="value">${object[gio][phut]}</td>
                </tr>
            `;
        });
    });

    htmls += "</tbody>";

    elementContent.html(htmls);
};

const selectAndInsertToFirebase = (paths, gioHienTai, phutHienTai, check, element, lable, color) => {
    // du lieu nhan lai la mot object
    selectData(paths, gioHienTai, (value) => {
        // gan tam thoi gia tri cho now
        // doi khi nap co du lieu ben cam bien thi comment lai
        // value.now = Math.random() * 20 + 20;

        if (!value[gioHienTai]) {
            Object.assign(value, {
                now: Math.random() * 20 + 20,
                [gioHienTai]: {},
            });
        }

        // cap nhat gia thi theo phutHienTai tu gia tri cua key now
        value.now = value.now.toFixed(2);
        if (check && phutHienTai > 0) {
            value[gioHienTai][phutHienTai - 1] = value.now;
        }
        insertData(paths, value);
        renderTable(element, value, lable, color);
    });
};

/**
 * Loop
 * moi 1s lap 1 lan
 * lay now tu firebase, sau do kiem tra, cu moi phut cap nhat vao firebase voi gia tri cua now
 */
let phutQK = new Date().getMinutes();
setInterval(() => {
    const today = new Date();
    const gioHienTai = today.getHours();
    const phutHienTai = today.getMinutes();
    const giayHienTai = today.getSeconds();

    elementShowTime.text(`Thời gian:
                    ${gioHienTai < 10 ? "0" + gioHienTai : gioHienTai} giờ
                    ${phutHienTai < 10 ? "0" + phutHienTai : phutHienTai} phút
                    ${giayHienTai < 10 ? "0" + giayHienTai : giayHienTai} giây`);

    const check = phutQK === phutHienTai;
    if (!check) {
        phutQK = phutHienTai;
    }

    // xu ly cho temp
    selectAndInsertToFirebase(paths.temp, gioHienTai, phutHienTai, !check, elements.temp, "Temp", "success");

    // xu ly cho hum
    selectAndInsertToFirebase(paths.hum, gioHienTai, phutHienTai, !check, elements.hum, "Hum", "warning");

    // xu ly cho ssCO2
    selectAndInsertToFirebase(paths.ssCO2, gioHienTai, phutHienTai, !check, elements.ssCO2, "SsCo2", "secondary");

    // xu ly cho dustDensity
    selectAndInsertToFirebase(paths.dustDensity, gioHienTai, phutHienTai, !check, elements.dustDensity, "DustDenstity", "danger");

    // xu ly cho xu ly cho Votage
    selectAndInsertToFirebase(paths.votage, gioHienTai, phutHienTai, !check, elements.votage, "Votage", "info");

    // xu ly cho xu ly cho current
    selectAndInsertToFirebase(paths.current, gioHienTai, phutHienTai, !check, elements.current, "Current", "dark");

    // xu ly cho xu ly cho power
    selectAndInsertToFirebase(paths.power, gioHienTai, phutHienTai, !check, elements.power, "Power", "warning");

    // xu ly cho xu ly cho water
    selectAndInsertToFirebase(paths.water, gioHienTai, phutHienTai, !check, elements.water, "Water", "primary");
}, 1000);
