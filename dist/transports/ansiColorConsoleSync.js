"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Node Console color string constants */
const clientColors = ['', '\x1B[94m', '\x1B[93m', '\x1B[91m'];
const colorEnd = '\x1B[0m';
const ansiColorConsoleSync = (msg, level, options) => {
    /**
     * Control msg type
     * Here we use JSON.stringify so you can pass object, array, string, ecc...
     */
    let stringMsg;
    if (typeof msg === 'string') {
        stringMsg = msg;
    }
    else if (typeof msg === 'function') {
        stringMsg = '[function]';
    }
    else {
        stringMsg = JSON.stringify(msg);
    }
    let dateTxt;
    if (options && options.dateFormat === 'utc') {
        dateTxt = `${new Date().toUTCString()} | `;
    }
    else if (options && options.dateFormat === 'iso') {
        dateTxt = `${new Date().toISOString()} | `;
    }
    else {
        dateTxt = `${new Date().toLocaleString()} | `;
    }
    let levelTxt = `${level.text.toUpperCase()} | `;
    if (options && options.hideDate)
        dateTxt = '';
    if (options && options.hideLevel)
        levelTxt = '';
    let output = `${dateTxt}${levelTxt}${stringMsg}`;
    console.log(`${clientColors[level.severity]}${output}${colorEnd}`);
};
exports.ansiColorConsoleSync = ansiColorConsoleSync;
