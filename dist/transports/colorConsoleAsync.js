"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Web Console color string constants */
const clientColors = [
    '',
    'color: dodgerblue;font-weight:bold',
    'color: orange;font-weight:bold;',
    'color: indianred;font-weight:bold;',
];
const log = (msg, level, options) => {
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
    let dateTxt = '';
    let levelTxt = '';
    if (options && options.printDate) {
        dateTxt = `${new Date().toLocaleString()} | `;
    }
    if (options && options.printLevel) {
        levelTxt = `${level.text.toUpperCase()} | `;
    }
    let output = `%c${dateTxt}${levelTxt}${stringMsg}`;
    console.log(output, clientColors[level.severity] || '');
};
const colorConsoleAsync = (msg, level, options) => {
    setTimeout(function () {
        log(msg, level, options);
    }, 0);
    return true;
};
exports.colorConsoleAsync = colorConsoleAsync;
