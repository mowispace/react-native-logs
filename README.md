[![Build Status](https://travis-ci.org/onubo/react-native-logs.svg?branch=master)](https://travis-ci.org/onubo/react-native-logs) [![codecov](https://codecov.io/gh/onubo/react-native-logs/branch/master/graph/badge.svg)](https://codecov.io/gh/onubo/react-native-logs) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/onubo/react-native-logs/issues)

# react-native-logs

Simple logger for React-Native with custom transports and levels.

## Installation

```sh
npm install --save https://github.com/onubo/react-native-logs/tarball/master
```

coming soon on NPM

## Usage

### Quick Start

```javascript
import { logger } from "react-native-logs"

var log = logger.createLogger()

log.trace("Trace level log")
```

If you don't pass any configuration parameters to the logger.createLogger() method, it will create a simple console logger with trace, info, warn and error levels.

### Filter logs

Using the setLevel method you can set the minimum log level based on their power.

```javascript
var log = logger.createLogger()

log.setLevel("info")
log.trace("This log will not be printed")
log.info("This log will be printed correctly")
log.error("This log will be printed correctly")
```

### Config options

<<<<<<< HEAD
All params are optional and will take default values if not passed. Each level has its power and all the level with lower power then the setted one will not be shown when the app run.
=======
All params are optional and will take default values if not passed. Each level has its level power and all the level with lower power then the setted one (config.level) wil not be shown.
>>>>>>> acf71c18e06e7a76906d230539981198dacff026

```javascript
import { logger, chromeConsoleAsyncTransport } from "react-native-logs"

const config = {
  level: "trace",
  transport: chromeConsoleAsyncTransport,
  levels: {
    trace: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
}
var log = logger.createLogger(config)
```

| Parameter | Type     | Description                           | Default                                   |
| --------- | -------- | ------------------------------------- | ----------------------------------------- |
| level     | string   | Initialize log level power            | First level ("trace" with default levels) |
| transport | Function | Set the transport function for logs   | consoleSync                               |
| levels    | Object   | Set custom log levels: {name:power}   | {trace: 0, info: 1, warn: 2, error: 3}    |

### Preset Transports

react-native-logs integrates 3 preset transports and you can import it, Eg. `import { chromeConsoleAsyncTransport } from "react-native-logs"`.

- **consoleSyncTransport**: Simple sync console.log
- **chromeConsoleSyncTransport**: Sync console.log optimized for chrome console with different colors based on the power of the level: 1 - blue(info), 2 - orange(warn), 3 - red(error)
- **chromeConsoleAsyncTransport**: Async console.log, called through setTimeout (fn, 0), optimized for chrome console with different colors based on the power of the level: 1 - blue(info), 2 - orange(warn), 3 - red(error)

New presets transports coming soon...

### Custom Transport

You will use the transport function to actually show the log. Eg. you can make a custom transport to send logs to an online service, or write it to a file.
The transport is a function that receives as parameters:

- `msg: Object | string | Function`
- `level: {power: number; text: string}`
- `cb?: () => boolean`

You can define your custom trasport as follow:

```javascript
import { logger } from "react-native-logs"

var customtransport = (msg, level) => {
  console.log(level.text, msg)
  return true
}
const config = {
  transport: customtransport,
}
var log = logger.createLogger(config)
```

## Usage Tips

### Dvelompment Mode

In reacly-native you can show logs only in development mode as follows:

```javascript
if (__DEV__) {
  log.setLevel("trace")
} else {
  log.setLevel("error")
}
```

So in production only error logs will be printed and the others will not affect performance.

### Global logger in react native

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
  log.setLevel("trace")
} else {
  log.setLevel("error")
}

export { log }
```

```javascript
//index.js and other files
import { log } from "./config"

log.info("app log test")
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
  },
})
```

## Why another logging library?

After trying the most famous logging libraries, like winston and bunyan, we realized that for react-native we needed something simpler, but still flexible, and without dependencies on nodejs (we don't like the rn-nodeify solution). Any criticism is welcome.
