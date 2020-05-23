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
