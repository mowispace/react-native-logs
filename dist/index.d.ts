/**
 * REACT-NATIVE-LOGS
 * Onubo s.r.l. - www.onubo.com - info@onubo.com
 * MIT license
 * Simple logger for React-Native with custom transports and levels
 */
/** Import preset transports */
import { consoleSyncTransport, chromeConsoleSyncTransport, chromeConsoleAsyncTransport } from "./transports";
/** Types Declaration */
declare type transportFunctionType = (msg: Object | string | Function, level: {
    power: number;
    text: string;
}, cb?: () => boolean) => boolean;
declare type levelsType = {
    [key: string]: number;
};
declare type configLoggerType = {
    level?: string;
    transport?: transportFunctionType;
    levels?: levelsType;
};
/** Logger Main Class */
declare class logs {
    _levels: {
        [key: string]: number;
    };
    _level: string;
    _transport: transportFunctionType;
    constructor(config?: configLoggerType);
    /**
     * Log messages methods and level filter
     * @param    {string}   level   At witch level you want log
     * @param    {any}      msg     Message you want to log
     * @param    {Function} cb      Optional callback after log (only if log)
     * @returns  {boolean}          Return TRUE if log otherwise FALSE
     */
    log(level: string, msg: any, cb?: () => boolean): any;
    /**
     * setLevel API
     * @param    {string} level   Log level to set
     * @returns  {string}         Return this._level setted
     */
    setLevel(level: string): string;
    /**
     * getLevel API
     * @returns  {string}  Return current log level
     */
    getLevel(): string;
}
/** Extend logs Class with generic types to avoid typescript errors on dynamic log methods */
declare class logTyped extends logs {
    [key: string]: any;
}
declare const logger: {
    createLogger: (config?: configLoggerType | undefined) => logTyped;
};
export { logger, consoleSyncTransport, chromeConsoleSyncTransport, chromeConsoleAsyncTransport, };
