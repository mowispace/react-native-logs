[![Build Status](https://travis-ci.org/onubo/react-native-logs.svg?branch=master)](https://travis-ci.org/onubo/react-native-logs)
![npm](https://img.shields.io/npm/v/react-native-logs.svg)
![GitHub](https://img.shields.io/github/license/onubo/react-native-logs.svg)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/onubo/react-native-logs/issues)

# react-native-logs

Performance-aware simple logger for React-Native with custom levels and transports (colored console, file writing, etc.). 
Each level has its severity: a number that represents its importance in ascending order from the least important to the most
important. Eg. _debug:0, info:1, warn:2, error:3_. By config the logger with a minium severity
level, you will see only the logs that have it highest. Then logs will be managed by transport: the
function that will display/save/send log messages.

## Why another logging library?

After trying the most known logging libraries, like winston and bunyan, we found that for
react-native we needed something simpler, but still flexible, and without dependencies on nodejs (we
don't like the rn-nodeify solution). Comments and suggestions are welcome.

## Installation

```sh
npm install --save react-native-logs
```

OR

```sh
yarn add react-native-logs
```

## Quick Start

```javascript
import { logger } from 'react-native-logs';

var log = logger.createLogger();

log.debug('This is a Debug log');
log.info('This is an Info log');
log.warn('This is a Warning log');
log.error('This is an Error log');
```

By default the `createLogger()` method will create a simple console logger with debug, info, warn
and error levels (when called without arguments).

## Configuration

You can customize the logger by passing a config object to the `createLogger` method (see example
below). All params are optional and will take default values if no corresponding argument is passed.

**Example with default configuration exposed:**

```javascript
import { logger } from 'react-native-logs';
import { consoleSync } from 'react-native-logs/dist/transports/consoleSync';

const defaultConfig = {
  severity: 'debug',
  transport: consoleSync,
  transportOptions: null,
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
};

var log = logger.createLogger(defaultConfig);
```

| Parameter         | Type     | Description                                                | Default                                                     |
| ----------------- | -------- | ---------------------------------------------------------- | ----------------------------------------------------------- |
| severity          | string   | Init logs severity (least important level you want to see) | `debug` (or the first custom level)                         |
| transport         | Function | The transport function for logs (see below for presets)    | The preset transport `consoleSync`                          |
| transportOptions  | Object   | Set custom options for transports                          | null                                                        |
| levels            | Object   | Set custom log levels: {name:power}                        | `{debug: 0, info: 1, warn: 2, error: 3}`                    |

### Custom levels

Log levels have this format: `{ name : severity }` and you can create your personalized list, Eg:

```javascript
import { logger } from 'react-native-logs';

const config = {
  levels: {
    trace: 0,
    info: 1,
    silly: 2,
    error: 3,
    mad: 4,
  },
};

var log = logger.createLogger(config);
```

### Custom transport

You can write your own transport to send logs to a cloud service, save it in to a database, or do
whatever you want. The following parameters are received by the function:

- `msg: any`
- `level: { severity: number; text: string }`
- `options?: any`

You can define your custom trasport as follow (example in typescript):

```javascript
import { logger, transportFunctionType } from 'react-native-logs';

const customTransport: transportFunctionType = (msg, level, options) => {
  // Do here whatever you want with the log message
  // You cas use any options setted in config.transportOptions
  // Eg. a console log: console.log(level.text, msg)
};

const config = {
  transport: customTransport,
};

var log = logger.createLogger(config);
```

### Transport Options
By setting the `transportOptions` parameter you can insert new options that will be passed to transports. You can also overwrite the default options like `loggerName`, `hideDate`, `dateFormat` and `hideLevel` used by preset transports (see preset transports list for details).

```javascript
import { logger } from 'react-native-logs';
import { rnFsFileAsync } from 'react-native-logs/dist/transports/rnFsFileAsync';

const config = {
  transport: rnFsFileAsync,
  transportOptions: {
    hideDate: true,
    dateFormat: 'iso',
    hideLevel: true,
    loggerName: 'myLogsFile',
  },
};

var log = logger.createLogger(config);
```

### Multiple Arguments

Log messages can be concatenated by adding arguments to the log function:

```javascript
var errorObject = {
  staus: 404,
  message: 'Undefined Error',
};
log.error('New error occured', errorObject);
```

### Preset transports

react-native-logs includes some preset transports. You can import the one of your choice from the `dist/transports` dir:
`import { <transportName> } from 'react-native-logs/dist/transports/<transportName>';`

#### Example:
```javascript
import { colorConsoleAfterInteractions } from 'react-native-logs/dist/transports/colorConsoleAfterInteractions';

const config = {
  transport: colorConsoleAfterInteractions,
};

var log = logger.createLogger(config);
```

## List of included preset transports

### **consoleSync**
Simple sync `console.log`.

| name            | type      | description                           | default                    |
| --------------- | --------- | ------------------------------------- | -------------------------- |
| hideDate        | boolean   | hide current date time from logs      | false                      |
| dateFormat      | string    | choose between local, utc or iso      | local                      |
| hideLevel       | boolean   | hide severity level from logs         | false                      |

### **colorConsoleSync**
Sync `console.log` with different colors based on the severity of the level (colors for chrome and
firefox console):
- 0 default (debug)
- 1 blue (info)
- 2 orange (warn)
- 3 red (error)

| name            | type      | description                           | default                    |
| --------------- | --------- | ------------------------------------- | -------------------------- |
| hideDate        | boolean   | hide current date time from logs      | false                      |
| dateFormat      | string    | choose between local, utc or iso      | local                      |
| hideLevel       | boolean   | hide severity level from logs         | false                      |

### **colorConsoleAsync**
Same as `colorConsoleSync` but with `console.log` asynchronously called through
`setTimeout (fn, 0)`, for performance optimization purpose.

### **ansiColorConsoleSync**
Same as `colorConsoleSync` but with ansi color code for terminal console (or VScode terminal);

### **colorConsoleAfterInteractions**
In order to be sure not to freeze any animations, this transport use
`InteractionManager.runAfterInteractions` event of react-native and apply it to `colorConsoleSync`
transport.

### **rnFsFileAsync**
This transport requires the installation of `react-native-fs`
([install tutorial here](https://github.com/itinance/react-native-fs)), and allows you to save the
logs on the `<loggerPath>/<loggerName>.txt` file.

Accepted Options:

| name            | type      | description                           | default                    |
| --------------- | --------- | ------------------------------------- | -------------------------- |
| hideDate        | boolean   | hide current date time from logs      | false                      |
| dateFormat      | string    | choose between local, utc or iso      | local                      |
| hideLevel       | boolean   | hide severity level from logs         | false                      |
| loggerName      | string    | set logs file name                    | rnlogs                     |
| loggerPath      | string    | set logs file path                    | RNFS.DocumentDirectoryPath |

NOTE: Following
[this example](https://github.com/itinance/react-native-fs#file-upload-android-and-ios-only) it will
be possible to upload the file to your remote server

## Methods

#### setSeverity

You can set the severity level by passing the name(string) of the least important level you want to
see. This method will overwrite any `config.severity` option set in logger creation.

```javascript
var log = logger.createLogger();

log.setSeverity('info');
log.debug('This log will not be printed');
log.info('This log will be printed correctly');
log.error('This log will be printed correctly');
```

#### getSeverity

You can get the current severity level setted.

```javascript
var log = logger.createLogger();

var defaultseverity = log.getSeverity(); // severity = debug
log.setSeverity('info');
var severity = log.getSeverity(); // severity = info
log.setSeverity('error');
var newseverity = log.getSeverity(); // newseverity = error
```

## Usage Tips

### Logs only in dvelompment mode

In reacly-native, after you have create your logger, you can set to log only in development using
the `__DEV__` as follows:

```javascript
var log = logger.createLogger();

if (__DEV__) {
  log.setSeverity('debug');
} else {
  log.setSeverity('error');
}
```

This will block all the logs in production, but not the errors, so the app performance will not be
affected.

### Global logger in react-native

In order to have a global logger throughout the app, i recommend using a config.js file to
initialize the logger so it can be imported wherever it is needed. Example:

```javascript
//config.js
import { logger } from 'react-native-logs';
import { colorConsoleAfterInteractions } from 'react-native-logs/dist/transports/colorConsoleAfterInteractions';

const config = {
  transport: colorConsoleAfterInteractions,
};
var log = logger.createLogger(config);

if (__DEV__) {
  log.setSeverity('debug');
} else {
  log.setSeverity('error');
}

export { log };
```

```javascript
//index.js and other app files
import { log } from './config';

log.info('app log test');
```

### Use multiple transports

To use multiple transports for logs, just create a transport function that calls other transport
functions as follows:

```javascript
import { logger } from 'react-native-logs';
import { colorConsoleSync } from 'react-native-logs/dist/transports/colorConsoleSync';
import { rnFsFileAsync } from 'react-native-logs/dist/transports/rnFsFileAsync';

var customTransport = (msg, level, options) => {
  // Do here whatever you want with the log message
  // Eg. a console log: console.log(level.text, msg)
};

const log = logger.createLogger({
  transport: (msg, level, options) => {
    colorConsoleSync(msg, level, options);
    rnFsFileAsync(msg, level, options);
    customTransport(msg, level, options);
  },
});
```
