'use strict';
import { insertData, selectData, handle } from './ModuleHandleToFirebase.js';

// create url to connect to Firebase
const paths = {
    temp: 'temp',
    hum: 'hum',
    ssCO2: 'ssCO2',
    dustDensity: 'dustDensity',
    votage: 'Votage',
    current: 'Current',
    power: 'Power',
    water: 'Water',
};

/**
 * Loop
 * moi 0.5s lap 1 lan
 */
console.log('******************************');
console.log('*    This app is running     *');
console.log('*    To stop, use Ctrl + C   *');
console.log('******************************');

let phutQK = new Date().getMinutes();

setInterval(function () {
    const today = new Date();
    const gioHienTai = today.getHours();
    const phutHienTai = today.getMinutes();

    // bien nay dung de kiem tra phut qua hien tai co chuyen qua phut moi khong
    let isPhutMoi = phutQK !== phutHienTai;

    // neu co, thi cho no bang nhau de tiep tuc kiem tra o lan lap tiep theo
    if (isPhutMoi) {
        phutQK = phutHienTai;
        console.warn('\n=============== Reading firebase ... ===============');
    }

    selectAndInsertToFirebase(paths.temp, gioHienTai, phutHienTai, isPhutMoi);
    selectAndInsertToFirebase(paths.hum, gioHienTai, phutHienTai, isPhutMoi);
    selectAndInsertToFirebase(paths.ssCO2, gioHienTai, phutHienTai, isPhutMoi);
    selectAndInsertToFirebase(paths.dustDensity, gioHienTai, phutHienTai, isPhutMoi);
    selectAndInsertToFirebase(paths.votage, gioHienTai, phutHienTai, isPhutMoi);
    selectAndInsertToFirebase(paths.current, gioHienTai, phutHienTai, isPhutMoi);
    selectAndInsertToFirebase(paths.power, gioHienTai, phutHienTai, isPhutMoi);
    selectAndInsertToFirebase(paths.water, gioHienTai, phutHienTai, isPhutMoi);
}, 1000);

async function selectAndInsertToFirebase(path, gioHienTai, phutHienTai, isPhutMoi) {
    let value = await selectData(path);

    if (value === null) {
        // them mac dinh
        const newPath = `${path}/${gioHienTai}/${phutHienTai}`;
        insertData(newPath, 0);
        return;
    }

    value = handle(value, gioHienTai, path);

    // kiem tra, neu qua phut moi thi cap nhat lai phut
    if (isPhutMoi) {
        if (phutHienTai == 0) {
            gioHienTai--;
            phutHienTai = 59;
        } else {
            phutHienTai--;
        }
        value[gioHienTai][phutHienTai] = value.now;
        console.warn(path, `${gioHienTai}:${phutHienTai} => ${value.now}`);
    }

    insertData(path, value);
}