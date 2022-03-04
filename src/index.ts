/**
 * REACT-NATIVE-LOGS
 * Alessandro Bottamedi - a.bottamedi@me.com
 *
 * Performance-aware simple logger for React-Native with custom levels and transports (colored console, file writing, etc.)
 *
 * MIT license
 *
 * Copyright (c) 2021 Alessandro Bottamedi.
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

/** Import preset transports */
import { consoleTransport } from "./transports/consoleTransport";
import { mapConsoleTransport } from "./transports/mapConsoleTransport";
import { fileAsyncTransport } from "./transports/fileAsyncTransport";
import { sentryTransport } from "./transports/sentryTransport";

let asyncFunc: (cb: Function) => any;
try {
  const InteractionManager = require("react-native").InteractionManager;
  asyncFunc = InteractionManager.runAfterInteractions;
} catch (e) {
  asyncFunc = (cb: Function) => {
    setTimeout(() => {
      return cb();
    }, 0);
  };
}

/** Types Declaration */
type transportFunctionType = (props: {
  msg: any;
  rawMsg: any;
  level: { severity: number; text: string };
  extension?: string | null;
  options?: any;
}) => any;
type levelsType = { [key: string]: number };
type logMethodType = (
  level: string,
  extension: string | null,
  ...msgs: any[]
) => boolean;
type levelLogMethodType = (...msgs: any[]) => boolean;
type extendedLogType = { [key: string]: levelLogMethodType | any };
type configLoggerType = {
  severity?: string;
  transport?: transportFunctionType;
  transportOptions?: any;
  levels?: levelsType;
  async?: boolean;
  asyncFunc?: Function;
  dateFormat?: string; //"time" | "local" | "utc" | "iso";
  printLevel?: boolean;
  printDate?: boolean;
  enabled?: boolean;
  enabledExtensions?: string[] | string | null;
};

/** Reserved key log string to avoid overwriting other methods or properties */
const reservedKey: string[] = [
  "extend",
  "enable",
  "disable",
  "getExtensions",
  "setSeverity",
  "getSeverity",
];

/** Default configuration parameters for logger */
const defaultLogger = {
  severity: "debug",
  transport: consoleTransport,
  transportOptions: {},
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  async: false,
  asyncFunc: asyncFunc,
  dateFormat: "time",
  printLevel: true,
  printDate: true,
  enabled: true,
  enabledExtensions: null,
};

/** Logger Main Class */
class logs {
  private _levels: levelsType;
  private _level: string;
  private _transport: transportFunctionType;
  private _transportOptions: any;
  private _asyncFunc: Function;
  private _async: boolean;
  private _dateFormat: string;
  private _printLevel: boolean;
  private _printDate: boolean;
  private _enabled: boolean;

  private _enabledExtensions: string[] | null = null;
  private _extensions: string[] = [];
  private _extendedLogs: { [key: string]: extendedLogType } = {};

  constructor(config: Required<configLoggerType>) {
    this._levels = config.levels;
    this._level = config.severity ?? Object.keys(this._levels)[0];

    this._transport = config.transport;
    this._transportOptions = config.transportOptions;

    this._asyncFunc = config.asyncFunc;
    this._async = config.async;

    this._dateFormat = config.dateFormat;

    this._printLevel = config.printLevel;
    this._printDate = config.printDate;

    this._enabled = config.enabled;

    if (Array.isArray(config.enabledExtensions)) {
      this._enabledExtensions = config.enabledExtensions;
    } else if (typeof config.enabledExtensions === "string") {
      this._enabledExtensions = [config.enabledExtensions];
    }

    /** Bind correct log levels methods */
    let _this: any = this;
    Object.keys(this._levels).forEach((level: string) => {
      if (typeof level !== "string") {
        throw Error(`react-native-logs: levels must be strings`);
      }
      if (level[0] === "_") {
        throw Error(
          `react-native-logs: keys with first char "_" is reserved and cannot be used as levels`
        );
      }
      if (reservedKey.indexOf(level) !== -1) {
        throw Error(
          `react-native-logs: [${level}] is a reserved key, you cannot set it as custom level`
        );
      }
      if (typeof this._levels[level] === "number") {
        _this[level] = this._log.bind(this, level, null);
      } else {
        throw Error(`react-native-logs: [${level}] wrong level config`);
      }
    }, this);
  }

  /** Log messages methods and level filter */
  private _log: logMethodType = (level, extension, ...msgs) => {
    if (this._async) {
      return this._asyncFunc(() => {
        this._sendToTransport(level, extension, msgs);
      });
    } else {
      return this._sendToTransport(level, extension, msgs);
    }
  };

  private _sendToTransport = (
    level: string,
    extension: string | null,
    msgs: any
  ) => {
    if (!this._enabled) return false;
    if (!this._isLevelEnabled(level)) {
      return false;
    }
    if (extension && !this._isExtensionEnabled(extension)) {
      return false;
    }
    let msg = this._formatMsg(level, extension, msgs);
    let transportProps = {
      msg: msg,
      rawMsg: msgs,
      level: { severity: this._levels[level], text: level },
      extension: extension,
      options: this._transportOptions,
    };
    this._transport(transportProps);
    return true;
  };

  private _stringifyMsg = (msg: any): string => {
    let stringMsg = "";
    if (typeof msg === "string") {
      stringMsg = msg + " ";
    } else if (typeof msg === "function") {
      stringMsg = "[function] ";
    } else if (msg && msg.stack && msg.message) {
      stringMsg = msg.message + " ";
    } else {
      try {
        stringMsg = "\n" + JSON.stringify(msg, undefined, 2) + "\n";
      } catch (error) {
        stringMsg += "Undefined Message";
      }
    }
    return stringMsg;
  };

  private _formatMsg = (
    level: string,
    extension: string | null,
    msgs: any
  ): string => {
    let nameTxt: string = "";
    if (extension) {
      nameTxt = `${extension} | `;
    }

    let dateTxt: string = "";
    if (this._printDate) {
      switch (this._dateFormat) {
        case "time":
          dateTxt = `${new Date().toLocaleTimeString()} | `;
          break;
        case "local":
          dateTxt = `${new Date().toLocaleString()} | `;
          break;
        case "utc":
          dateTxt = `${new Date().toUTCString()} | `;
          break;
        case "iso":
          dateTxt = `${new Date().toISOString()} | `;
          break;
        default:
          break;
      }
    }

    let levelTxt = "";
    if (this._printLevel) {
      levelTxt = `${level.toUpperCase()} : `;
    }

    let stringMsg: string = dateTxt + nameTxt + levelTxt;

    if (Array.isArray(msgs)) {
      for (let i = 0; i < msgs.length; ++i) {
        stringMsg += this._stringifyMsg(msgs[i]);
      }
    } else {
      stringMsg += this._stringifyMsg(msgs);
    }

    return stringMsg;
  };

  /** Return true if level is enabled */
  private _isLevelEnabled = (level: string): boolean => {
    if (this._levels[level] < this._levels[this._level]) {
      return false;
    }
    return true;
  };

  /** Return true if extension is enabled */
  private _isExtensionEnabled = (extension: string): boolean => {
    if (!this._enabledExtensions) {
      return true;
    }
    if (this._enabledExtensions.includes(extension)) {
      return true;
    }
    return false;
  };

  /** Extend logger with a new extension */
  extend = (extension: string): extendedLogType => {
    if (this._extensions.includes(extension)) {
      return this._extendedLogs[extension];
    }
    this._extendedLogs[extension] = {};
    this._extensions.push(extension);
    let extendedLog = this._extendedLogs[extension];
    Object.keys(this._levels).forEach((level: string) => {
      extendedLog[level] = (...msgs: any) => {
        this._log(level, extension, ...msgs);
      };
      extendedLog["extend"] = (extension: string) => {
        throw Error(
          `react-native-logs: you cannot extend a logger from an already extended logger`
        );
      };
      extendedLog["enable"] = () => {
        throw Error(
          `react-native-logs: You cannot enable a logger from extended logger`
        );
      };
      extendedLog["disable"] = () => {
        throw Error(
          `react-native-logs: You cannot disable a logger from extended logger`
        );
      };
      extendedLog["getExtensions"] = () => {
        throw Error(
          `react-native-logs: You cannot get extensions from extended logger`
        );
      };
      extendedLog["setSeverity"] = (level: string) => {
        throw Error(
          `react-native-logs: You cannot set severity from extended logger`
        );
      };
      extendedLog["getSeverity"] = () => {
        throw Error(
          `react-native-logs: You cannot get severity from extended logger`
        );
      };
    });
    return extendedLog;
  };

  /** Enable logger or extension */
  enable = (extension?: string): boolean => {
    if (!extension) {
      this._enabled = true;
      return true;
    }

    if (this._extensions.includes(extension)) {
      if (this._enabledExtensions) {
        if (!this._enabledExtensions.includes(extension)) {
          this._enabledExtensions.push(extension);
          return true;
        } else {
          return true;
        }
      } else {
        this._enabledExtensions = [];
        this._enabledExtensions.push(extension);
        return true;
      }
    } else {
      throw Error(`react-native-logs: Extension [${extension}] not exist`);
    }
  };

  /** Disable logger or extension */
  disable = (extension?: string): boolean => {
    if (!extension) {
      this._enabled = false;
      return true;
    }
    if (this._extensions.includes(extension)) {
      if (this._enabledExtensions) {
        let extIndex = this._enabledExtensions.indexOf(extension);
        if (extIndex > -1) {
          this._enabledExtensions.splice(extIndex, 1);
        }
        return true;
      } else {
        return true;
      }
    } else {
      throw Error(`react-native-logs: Extension [${extension}] not exist`);
    }
  };

  /** Return all created extensions */
  getExtensions = (): string[] => {
    return this._extensions;
  };

  /** Set log severity API */
  setSeverity = (level: string): string => {
    if (level in this._levels) {
      this._level = level;
    } else {
      throw Error(`react-native-logs: Level [${level}] not exist`);
    }
    return this._level;
  };

  /** Get current log severity API */
  getSeverity = (): string => {
    return this._level;
  };
}

type levelMethods<levels extends string> = {
  [key in levels]: (data: any) => void;
}

type extendMethod<levels extends string> = {
  extend: (namespace: string) => levelMethods<levels>
}

/**
 * Create a logger object. All params will take default values if not passed.
 * each levels has its level severity so we can filter logs with < and > operators
 * all subsequent levels to the one selected will be exposed (ordered by severity asc)
 * through the transport
 */
const createLogger = (config?: configLoggerType) => {
  const mergedConfig = { ...defaultLogger, ...config };
  type levels = keyof typeof mergedConfig['levels']

  return new logs(mergedConfig) as unknown as Omit<logs, 'extend'> & levelMethods<levels> & extendMethod<levels>;
}

const logger = { createLogger };

export {
  logger,
  consoleTransport,
  mapConsoleTransport,
  fileAsyncTransport,
  sentryTransport,
};

export type { transportFunctionType, configLoggerType };
