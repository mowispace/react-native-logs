"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colorConsoleSync_1 = require("./colorConsoleSync");
const InteractionManager = require('react-native').InteractionManager;
const colorConsoleAfterInteractions = (msg, level, options) => {
    if (!InteractionManager)
        return false;
    InteractionManager.runAfterInteractions(() => {
        colorConsoleSync_1.colorConsoleSync(msg, level, options);
    });
};
exports.colorConsoleAfterInteractions = colorConsoleAfterInteractions;
