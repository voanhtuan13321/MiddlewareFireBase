'use strict';
import { insertData, selectData } from './moduleHandleToFirebase.js';

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

setInterval(() => {
    const today = new Date();
    const gioHienTai = today.getHours();
    const phutHienTai = today.getMinutes();
    const isPhutMoi = phutQK === phutHienTai;
    
    if (!isPhutMoi) {
        phutQK = phutHienTai;
        console.warn('\n=============== Reading firebase ... ===============');
    }

    selectAndInsertToFirebase(paths.temp, gioHienTai, phutHienTai, !isPhutMoi);
    selectAndInsertToFirebase(paths.hum, gioHienTai, phutHienTai, !isPhutMoi);
    selectAndInsertToFirebase(paths.ssCO2, gioHienTai, phutHienTai, !isPhutMoi);
    selectAndInsertToFirebase(paths.dustDensity, gioHienTai, phutHienTai, !isPhutMoi);
    selectAndInsertToFirebase(paths.votage, gioHienTai, phutHienTai, !isPhutMoi);
    selectAndInsertToFirebase(paths.current, gioHienTai, phutHienTai, !isPhutMoi);
    selectAndInsertToFirebase(paths.power, gioHienTai, phutHienTai, !isPhutMoi);
    selectAndInsertToFirebase(paths.water, gioHienTai, phutHienTai, !isPhutMoi);
}, 500);

function selectAndInsertToFirebase(paths, gioHienTai, phutHienTai, isPhutMoi) {
    // du lieu nhan lai la mot object
    selectData(paths, gioHienTai, (value) => {
        // doi khi nap co du lieu ben cam bien thi comment lai
        value.now = Math.random() * 20 + 20;

        // truong hop tao gio moi tren firebase
        (!value[gioHienTai]) && Object.assign(value, { [gioHienTai]: {} });
        
        if (paths === 'temp') {
            let now = value.now;
            (now > 1000) && (now = now / 100);
            (now > 100) && (now = now / 10);
            
            try {
                value.now = now.toFixed(2);
            } catch (e) {
                value.now = now;
            }
        }

        // kiem tra, neu qua phut moi thi cap nhat lai phut
        if (isPhutMoi) {
            if (phutHienTai == 0) {
                gioHienTai--;
                phutHienTai = 59;
            } else {
                phutHienTai--;
            }
            value[gioHienTai][phutHienTai] = value.now;
            console.warn(paths, `${gioHienTai}:${phutHienTai} => ${value.now}`)
        }

        insertData(paths, value);
    });
};