"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Web Console color string constants */
const clientColors = {
    default: "",
    white: "color: white;font-weight:bold;",
    blue: "color: blue;font-weight:bold;",
    yellow: "color: yellow;font-weight:bold;",
    green: "color: green;font-weight:bold;",
    magenta: "color: magenta;font-weight:bold;",
    cyan: "color: cyan;font-weight:bold;",
    red: "color: red;font-weight:bold;",
    dodgerblue: "color: dodgerblue;font-weight:bold;",
    indianred: "color: indianred;font-weight:bold;",
    orange: "color: orange;font-weight:bold;",
    golden: "color: goldenrod;font-weight:bold;",
    limegreen: "color: limegreen;font-weight:bold;",
};
function transport(msg, level, levelTxt) {
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
    let output = `%c${new Date().toLocaleString()} | ${levelTxt.toUpperCase()}\n${stringMsg}`;
    console.log(output, clientColors[level.color] || clientColors["default"]);
    return true;
}
const consoleAfterInteractions = { transport };
exports.consoleAfterInteractions = consoleAfterInteractions;
