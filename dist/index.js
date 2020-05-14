"use strict";
/**
 * REACT-NATIVE-LOGS
 * Onubo s.r.l. - www.onubo.com - info@onubo.com
 *
 * Performance-aware simple logger for React-Native with custom levels and transports (colored console, file writing, etc.)
 *
 * MIT license
 *
 * Copyright (c) 2019 Onubo s.r.l.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** Import preset transports */
const colorConsoleSync_1 = require("./transports/colorConsoleSync");
/** Reserved key log string to avoid overwriting other methods or properties */
const reservedKey = [
    'log',
    'setSeverity',
    'getSeverity',
    '_levels',
    '_level',
    '_transport',
];
/** Default configuration parameters for logger */
const defaultLogger = {
    severity: 'debug',
    transport: colorConsoleSync_1.colorConsoleSync,
    levels: {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3,
    },
};
/** Logger Main Class */
class logs {
    constructor(config) {
        this._level = defaultLogger.severity;
        this._transport = defaultLogger.transport;
        this._levels = defaultLogger.levels;
        this._transportOptions = null;
        /** Check if config levels property exist and set it */
        if (config &&
            config.levels &&
            typeof config.levels === 'object' &&
            Object.keys(config.levels).length > 0) {
            this._levels = config.levels;
        }
        /** Check if config level property exist and set it */
        if (config && config.severity) {
            this._level = config.severity;
        }
        if (!this._levels.hasOwnProperty(this._level)) {
            this._level = Object.keys(this._levels)[0];
        }
        /** Check if config transport property exist and set it */
        if (config && config.transport) {
            this._transport = config.transport;
        }
        /** Check if config transportOptions property exist and set it */
        if (config && config.transportOptions) {
            this._transportOptions = config.transportOptions;
        }
        /** Bind correct log levels methods */
        let _this = this;
        Object.keys(this._levels).forEach((level) => {
            if (reservedKey.indexOf(level) !== -1) {
                throw Error(`react-native-logs: [${level}] is a reserved key, you cannot set it as custom level`);
            }
            else if (typeof this._levels[level] === 'number') {
                _this[level] = this.log.bind(this, level);
            }
            else {
                throw Error(`react-native-logs: [${level}] wrong level config`);
            }
        }, this);
    }
    /**
     * Log messages methods and level filter
     * @param    {string}   level   At witch level you want log
     * @param    {any}      msgs    Messages you want to log (multiple arguments)
     * @returns  {boolean}          Return TRUE if log otherwise FALSE or throw an error
     */
    log(level, ...msgs) {
        if (!this._levels.hasOwnProperty(level)) {
            throw Error(`react-native-logs: Level [${level}] not exist`);
        }
        if (this._levels[level] < this._levels[this._level]) {
            return false;
        }
        if (!msgs || !msgs[0]) {
            return false;
        }
        for (let i = 0; i < msgs.length; ++i) {
            let msg = msgs[i];
            this._transport(msg, { severity: this._levels[level], text: level }, this._transportOptions);
        }
        return true;
    }
    /**
     * setSeverity API
     * @param    {string} level   Log level to set
     * @returns  {string}         Return this._level setted
     */
    setSeverity(level) {
        if (level in this._levels) {
            this._level = level;
        }
        else {
            throw Error(`react-native-logs: Level [${level}] not exist`);
        }
        return this._level;
    }
    /**
     * getSeverity API
     * @returns  {string}  Return current log level
     */
    getSeverity() {
        return this._level;
    }
}
/** Extend logs Class with generic types to avoid typescript errors on dynamic log methods */
class logTyped extends logs {
}
/**
 * Create a logger object. All params will take default values if not passed.
 * each levels has its level severity so we can filter logs with < and > operators
 * all subsequent levels to the one selected will be exposed (ordered by severity asc)
 * through the transport
 * @param  {string|undefined}     severity   Initialize log level severity
 * @param  {Function|undefined}   transport  Set which transport use for logs
 * @param  {Object|undefined}     levels     Set custom log levels
 */
const createLogger = (config) => {
    return new logTyped(config);
};
const logger = { createLogger };
exports.logger = logger;
