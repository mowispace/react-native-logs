[![Build Status](https://travis-ci.org/onubo/react-native-logs.svg?branch=master)](https://travis-ci.org/onubo/react-native-logs) [![codecov](https://codecov.io/gh/onubo/react-native-logs/branch/master/graph/badge.svg)](https://codecov.io/gh/onubo/react-native-logs) ![npm](https://img.shields.io/npm/v/react-native-logs.svg) ![GitHub](https://img.shields.io/github/license/onubo/react-native-logs.svg) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/onubo/react-native-logs/issues)

# react-native-logs

Simple logger for React-Native with custom transports and levels.
Each level has its severity: a number that represents its importance in ascending order from the least important to the most important. Eg. *debug:0, info:1, warn:2, error:3*.
By config the logger with a minium severity level, you will see only the logs that have it highest.
Then logs will be managed by transport: the function that will display/save/send log messages.

## Why another logging library?

After trying the most known logging libraries, like winston and bunyan, we found that for react-native we needed something simpler, but still flexible, and without dependencies on nodejs (we don't like the rn-nodeify solution).
Comments and suggestions are welcome.

## Installation

```sh
npm install --save https://github.com/onubo/react-native-logs/tarball/master
```

coming soon on NPM...

## Quick Start

```javascript
import { logger } from "react-native-logs"

var log = logger.createLogger()

log.debug("This is a Debug log")
log.info("This is an Info log")
log.warn("This is a Warning log")
log.error("This is an Error log")
```

By default the `createLogger()` method will create a simple console logger with debug, info, warn and error levels (when called without arguments).


## Configuration

You can customize the logger by passing a config object to the `createLogger` method (see example below). All params are optional and will take default values if no corresponding argument is passed.

**Example with default configuration exposed:**
```javascript
import { logger, consoleSyncTransport } from "react-native-logs"

const defaultConfig = {
  severity: "debug",
  transport: consoleSyncTransport,
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  }
}

var log = logger.createLogger(defaultConfig)
```

| Parameter | Type     | Description                                                | Default                                        |
| --------- | -------- | ---------------------------------------------------------- | ---------------------------------------------- |
| severity  | string   | Init logs severity (least important level you want to see) | `debug` (or the first custom level)            |
| transport | Function | The transport function for logs (see below for presets)    | The preset transport `consoleSyncTransport`    |
| levels    | Object   | Set custom log levels: {name:power}                        | `{debug: 0, info: 1, warn: 2, error: 3}`       |

### Custom levels

Log levels have this format: `{ name : severity }` and you can create your personalized list, Eg:

```javascript
import { logger } from "react-native-logs"

const config = {
  levels: {
    trace: 0,
    info: 1,
    silly: 2,
    error: 3,
    mad: 4
  }
}

var log = logger.createLogger(config)
``` 

### Custom transport

You can write your own transport to send logs to a cloud service, save it in to a database, or do whatever you want. The following parameters are received by the function:

- `msg: any`
- `level: { severity: number; text: string }`
- `cb?: () => boolean`

You can define your custom trasport as follow:

```javascript
import { logger } from "react-native-logs"

var customTransport = (msg, level) => {
  // Do here whatever you want with the log message
  // Eg. a console log: console.log(level.text, msg)
  return true
}

const config = {
  transport: customTransport,
}

var log = logger.createLogger(config)
```

### Preset transports

react-native-logs includes some preset transports. You can import the one of your choice:

**consoleSyncTransport**  
Simple sync `console.log`.

**chromeConsoleSyncTransport**  
Sync `console.log` optimized for chrome console with different colors based on the severity of the level:
 - 0 default (debug)
 - 1 blue (info)
 - 2 orange (warn)
 - 3 red (error)

**chromeConsoleAsyncTransport**  
Same as `chromeConsoleSyncTransport` but with `console.log` asynchronously called through `setTimeout (fn, 0)`, for performance optimization purpose.

More preset are coming...

## Methods

#### setSeverity

You can set the severity level by passing the name(string) of the least important level you want to see.
This method will overwrite any `config.severity` option set in logger creation.

```javascript
var log = logger.createLogger()

log.setSeverity("info")
log.debug("This log will not be printed")
log.info("This log will be printed correctly")
log.error("This log will be printed correctly")
```

#### getSeverity

You can get the current severity level setted.

```javascript
var log = logger.createLogger()

var defaultseverity = log.getSeverity() // severity = debug
log.setSeverity("info")
var severity = log.getSeverity() // severity = info
log.setSeverity("error")
var newseverity = log.getSeverity() // newseverity = error
```

## Usage Tips

### Logs only in dvelompment mode

In reacly-native, after you have create your logger, you can set to log only in development using the `__DEV__` as follows:

```javascript
var log = logger.createLogger()

if (__DEV__) {
  log.setSeverity("debug")
} else {
  log.setSeverity("error")
}
```

This will block all the logs in production, but not the errors, so the app performance will not be affected.

### Global logger in react-native

In order to have a global logger throughout the app, i recommend using a config.js file to initialize the logger so it can be imported wherever it is needed.
Example:

```javascript
//config.js
import { logger, chromeConsoleAsyncTransport } from "react-native-logs"

const config = {
  transport: chromeConsoleAsyncTransport,
}
var log = logger.createLogger(config)

if (__DEV__) {
  log.setSeverity("debug")
} else {
  log.setSeverity("error")
}

export { log }
```

```javascript
//index.js and other app files
import { log } from "./config"

log.info("app log test")
```

### Use multiple transports

To use multiple transports for logs, just create a transport function that calls other transport functions as follows:

```javascript
import { logger, chromeConsoleSyncTransport } from "react-native-logs"

var customTransport = (msg, level) => {
  // Do here whatever you want with the log message
  // Eg. a console log: console.log(level.text, msg)
  return true
}

const log = logger.createLogger({
  transport: (msg, level) => {
    chromeConsoleSyncTransport(msg, level)
    customTransport(msg, level)
    return true
  }
})
```

### Note on RN performance

In order to be sure not to freeze any animations, you can use the `InteractionManager.runAfterInteractions` event of react-native and apply it to a synchronous transport.
Example:

```javascript
import { logger, chromeConsoleSyncTransport } from "react-native-logs"

const log = logger.createLogger({
  transport: (msg, level) => {
    InteractionManager.runAfterInteractions(() => {
      chromeConsoleSyncTransport(msg, level)
    })
    return true
  }
})
```