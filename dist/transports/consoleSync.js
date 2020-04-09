"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consoleSync = (msg, level, options) => {
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
    let dateTxt = `${new Date().toLocaleString()} | `;
    let levelTxt = `${level.text.toUpperCase()} | `;
    if (options && options.hideDate)
        dateTxt = '';
    if (options && options.hideLevel)
        levelTxt = '';
    let output = `${dateTxt}${levelTxt}${stringMsg}`;
    console.log(output);
    return true;
};
exports.consoleSync = consoleSync;
