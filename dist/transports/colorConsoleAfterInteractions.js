"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colorConsoleSync_1 = require("./colorConsoleSync");
const colorConsoleAfterInteractions = (msg, level, options) => {
    InteractionManager.runAfterInteractions(() => {
        colorConsoleSync_1.colorConsoleSync(msg, level, options);
    });
};
exports.colorConsoleAfterInteractions = colorConsoleAfterInteractions;
