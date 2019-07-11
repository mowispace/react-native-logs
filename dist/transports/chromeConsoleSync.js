"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Web Console color string constants */
const clientColors = [
    "",
    "color: dodgerblue;font-weight:bold",
    "color: orange;font-weight:bold;",
    "color: indianred;font-weight:bold;",
];
function chromeConsoleSyncTransport(msg, level, cb) {
    /**
     * Control msg type
     * Here we use JSON.stringify so you can pass object, array, string, ecc...
     */
    let stringMsg;
    if (typeof msg === "string") {
        stringMsg = msg;
    }
    else if (typeof msg === "function") {
        stringMsg = "[function]";
    }
    else {
        stringMsg = JSON.stringify(msg);
    }
    let output = `%c${new Date().toLocaleString()} | ${level.text.toUpperCase()}\n${stringMsg}`;
    console.log(output, clientColors[level.severity] || clientColors[level.severity]);
    if (cb) {
        cb();
    }
    return true;
}
exports.chromeConsoleSyncTransport = chromeConsoleSyncTransport;
