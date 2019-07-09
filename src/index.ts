/**
 * REACT-NATIVE-LOGS
 * Onubo s.r.l. - www.onubo.com - info@onubo.com
 * MIT license
 * Simple logger for React-Native with custom transports and levels
 */

/** Import preset transports */
import {
  consoleSyncTransport,
  chromeConsoleSyncTransport,
  chromeConsoleAsyncTransport,
} from "./transports"

/** Types Declaration */
type transportFunctionType = (
  msg: Object | string | Function,
  level: { power: number; text: string },
  cb?: () => boolean
) => boolean

type levelsType = { [key: string]: number }

type configLoggerType = {
  level?: string
  transport?: transportFunctionType
  levels?: levelsType
}

/** Reserved key log string to avoid overwriting other methods or properties */
const reservedKey = [
  'log',
  'setLevel',
  'getLevel',
  '_levels',
  '_level',
  '_transport'
]

/** Default configuration parameters for logger */
const defaultLogger = {
  level: "trace",
  transport: consoleSyncTransport,
  levels: {
    trace: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
}

/** Logger Main Class */
class logs {
  
  _levels: { [key: string]: number }
  _level: string
  _transport: transportFunctionType

  constructor(config?: configLoggerType) {
    this._level = defaultLogger.level
    this._transport = defaultLogger.transport
    this._levels = defaultLogger.levels

    /** Check if config levels property exist and set it */
    if (config && config.levels && typeof config.levels === "object" && Object.keys(config.levels).length > 0) {
      this._levels = config.levels
    }

    /** Check if config level property exist and set it */
    if (config && config.level) {
      this._level = config.level
    }
    if (!this._levels.hasOwnProperty(this._level)) {
      this._level = Object.keys(this._levels)[0]
    }

    /** Check if config transport property exist and set it */
    if (config && typeof config.transport === "function") {
      this._transport = config.transport
    }

    /** Bind correct log levels methods */
    let _this: any = this
    Object.keys(this._levels).forEach((level: string) => {
      if (reservedKey.indexOf(level) !== -1) {
        throw Error(`react-native-logs: [${level}] is a reserved key, you cannot set it as custom level`)
      } else if (typeof this._levels[level] === "number") {
        _this[level] = this.log.bind(this, level)
      } else {
        throw Error(`react-native-logs: [${level}] wrong level config`)
      }
    }, this)

  }

  /**
   * Log messages methods and level filter
   * @param    {string}   level   At witch level you want log
   * @param    {any}      msg     Message you want to log
   * @param    {Function} cb      Optional callback after log (only if log)
   * @returns  {boolean}          Return TRUE if log otherwise FALSE
   */
  log(level: string, msg: any, cb?: () => boolean): any {
    if (!this._levels.hasOwnProperty(level)) {
      throw Error(`react-native-logs: Level [${level}] not exist`)
    }
    if (this._levels[level] < this._levels[this._level]) {
      return false
    }
    return this._transport(msg, { power: this._levels[level], text: level }, cb)
  }

  /**
   * setLevel API
   * @param    {string} level   Log level to set
   * @returns  {string}         Return this._level setted
   */
  setLevel(level: string): string {
    if (level in this._levels) {
      this._level = level
    } else {
      throw Error(`react-native-logs: Level [${level}] not exist`)
    }
    return this._level
  }

  /**
   * getLevel API
   * @returns  {string}  Return current log level
   */
  getLevel(): string {
    return this._level
  }
}

/** Extend logs Class with generic types to avoid typescript errors on dynamic log methods */
class logTyped extends logs {
  [key: string]: any
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
const createLogger = (config?: configLoggerType) => {
  return new logTyped(config)
}

const logger = {
  createLogger,
}

export {
  logger,
  consoleSyncTransport,
  chromeConsoleSyncTransport,
  chromeConsoleAsyncTransport,
}
