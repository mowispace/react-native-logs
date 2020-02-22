"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colorConsoleSync_1 = require("./colorConsoleSync");
const colorConsoleAfterInteractions = (msg, level) => {
    InteractionManager.runAfterInteractions(() => {
        colorConsoleSync_1.colorConsoleSync(msg, level);
    });
};
exports.colorConsoleAfterInteractions = colorConsoleAfterInteractions;
