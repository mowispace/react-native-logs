"use strict";
/**
 * REACT-NATIVE-LOGS
 * Onubo s.r.l. - www.onubo.com - info@onubo.com
 * MIT license
 * Simple logger for React-Native with custom transports and levels
 **/
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Import preset transports
 **/
const transports_1 = require("./transports");
exports.consoleSyncTransport = transports_1.consoleSyncTransport;
exports.chromeConsoleSyncTransport = transports_1.chromeConsoleSyncTransport;
exports.chromeConsoleAsyncTransport = transports_1.chromeConsoleAsyncTransport;
/** Default configuration parameters for logger */
const defaultLogger = {
    level: "trace",
    transport: transports_1.consoleSyncTransport,
    levels: {
        trace: 0,
        info: 1,
        warn: 2,
        error: 3,
    },
};
/** Logger Main Class */
class logs {
    constructor(config) {
        this._level = defaultLogger.level;
        this._transport = defaultLogger.transport;
        this._levels = defaultLogger.levels;
        /** Check if config levels property exist and set it */
        if (config && config.levels && typeof config.levels === "object") {
            this._levels = config.levels;
        }
        /** Check if config level property exist and set it */
        if (config && config.level) {
            this._level = config.level;
        }
        if (!this._levels.hasOwnProperty(this._level)) {
            this._level = Object.keys(this._levels)[0];
        }
        /** Check if config transport property exist and set it */
        if (config && typeof config.transport === "function") {
            this._transport = config.transport;
        }
        /** Bind correct log levels methods */
        let _this = this;
        Object.keys(this._levels).forEach((level) => {
            if (typeof this._levels[level] === "number") {
                _this[level] = this.log.bind(this, level);
            }
            else {
                delete this._levels[level];
            }
        }, this);
    }
    /**
     * Log messages methods and level filter
     * @param    {string}   level   At witch level you want log
     * @param    {any}      msg     Message you want to log
     * @param    {Function} cb      Optional callback after log (only if log)
     * @returns  {boolean}          Return TRUE if log otherwise FALSE
     */
    log(level, msg, cb) {
        if (!this._levels.hasOwnProperty(level)) {
            throw Error(`react-native-logs: Level [${level}] not exist`);
        }
        if (this._levels[level] < this._levels[this._level]) {
            return false;
        }
        return this._transport(msg, { power: this._levels[level], text: level }, cb);
    }
    /**
     * setLevel API
     * @param    {string} level   Log level to set
     * @returns  {string}         Return this._level setted
     */
    setLevel(level) {
        if (level in this._levels) {
            this._level = level;
        }
        else {
            throw Error(`react-native-logs: Level [${level}] not exist`);
        }
        return this._level;
    }
    /**
     * getLevel API
     * @returns  {string}  Return current log level
     */
    getLevel() {
        return this._level;
    }
}
/**
 * Create a logger object. All params will take default values if not passed.
 * each levels has its "level" power so we can filter logs with < and > operators
 * all subsequent levels to the one selected (ordered by power asc) will be exposed
 * through the transport
 * @param  {string|undefined}     level      Initialize log level power
 * @param  {Function|undefined}   transport  Set which transport use for logs
 * @param  {Object|undefined}      levels     Set custom log levels
 */
const createLogger = (config) => {
    return new logs(config);
};
const logger = {
    createLogger,
};
exports.logger = logger;
