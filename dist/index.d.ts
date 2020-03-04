/**
 * REACT-NATIVE-LOGS
 * Onubo s.r.l. - www.onubo.com - info@onubo.com
 *
 * Simple logger for React-Native with custom transports and levels
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
/** Types Declaration */
declare type transportFunctionType = (msg: Object | string | Function, level: {
    severity: number;
    text: string;
}) => void;
declare type levelsType = {
    [key: string]: number;
};
declare type configLoggerType = {
    severity?: string;
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
    log(level: string, msg: any): any;
    /**
     * setSeverity API
     * @param    {string} level   Log level to set
     * @returns  {string}         Return this._level setted
     */
    setSeverity(level: string): string;
    /**
     * getSeverity API
     * @returns  {string}  Return current log level
     */
    getSeverity(): string;
}
/** Extend logs Class with generic types to avoid typescript errors on dynamic log methods */
declare class logTyped extends logs {
    [key: string]: any;
}
declare const logger: {
    createLogger: (config?: configLoggerType | undefined) => logTyped;
};
export { logger, transportFunctionType, configLoggerType, };
