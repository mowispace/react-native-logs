## [3.0.3] - 12-02-2021

- removed EncodingType reference on fileAsyncTransport

## [3.0.2] - 27-01-2021

- fixed web colors in console transport

## [3.0.1] - 27-01-2021

- fixed ansi colors in console transport

## [3.0.0] - 26-01-2021

This new version introduces many changes, the log management has been modified to allow the creation of namespaced loggers and to simplify the creation of custom transports.
The creation of namespaced loggers is done via the "extend" function on the main logger. This makes it possible to enable or disable logging only for certain parts of the app. The extend function is for now only enabled at the first level, it is not possible to extend an already extended logger in order to avoid loops in the controls that would affect performance.

- complete refactoring
- added namespaced logs via extend function!
- expofs support for file transport (beta)
- sentry transport
- logs concatenation on single line
- bugfix

#### BREAKING CHANGES

To upgrade to version 3 you need to change the logger creation. The default transports have now been reduced, but they support the same functions as before but through options, e.g. to get asynchronous logs you can set the async:true option instead of importing a special transport.
Custom transports also need to change, they now receive a single "props" parameter containing everything you need, the message formatting has been moved out of the transport so you can just output it. It is still possible to format the logs at will. Please refer to the new documentation for details.

## [2.2.1] - 23-05-2020

- added "ansiColorConsoleSync" transport to color logs on terminal (and VScode terminal)

## [2.2.0] - 11-05-2020

- added log messages concatenation "log(msg1,msg2,etc...)"
- added dataFormat transportOptions (thanks @baldur)
- bugfix

## [2.1.2] - 14-04-2020

- fixed bug RNFS wrong require line (thanks @jbreuer95)

## [2.1.0] - 08-04-2020

- added possibility to pass options to transport with transportOptions property

## [2.0.2] - 13-03-2020

- bugfix

## [2.0.1] - 04-03-2020

- remove transport export from main index module to avoid require errors

## [2.0.0] - 23-02-2020

- added preset file transport based on react-native-fs
- added preset transport with react-native AfterInteractions
- bugfix

### Breaking Changes

- removed parameter cb() from transport functions
- preset transport renamed

## [1.0.2] - 12-07-2020

- bugfix

## [1.0.1] - 12-07-2020

- npm release

## [1.0.0] - 12-07-2020

- initial commit
