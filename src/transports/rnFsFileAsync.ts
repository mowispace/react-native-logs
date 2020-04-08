import { transportFunctionType } from '../index';

declare var require: any;

const rnFsFileAsync: transportFunctionType = (msg, level, options) => {
  /**
   * Control msg type
   * Here we use JSON.stringify so you can pass object, array, string, ecc...
   */
  let stringMsg: string;
  if (typeof msg === 'string') {
    stringMsg = msg;
  } else if (typeof msg === 'function') {
    stringMsg = '[function]';
  } else {
    stringMsg = JSON.stringify(msg);
  }

  let dateTxt = '';
  let levelTxt = '';
  let loggerName = 'rnlogs';

  if (options && options.printDate) {
    dateTxt = `${new Date().toLocaleString()} | `;
  }

  if (options && options.printLevel) {
    levelTxt = `${level.text.toUpperCase()} | `;
  }

  if (options && options.loggerName && typeof options.loggerName === 'string') {
    loggerName = options.loggerName;
  }

  let output = `${dateTxt}${levelTxt}${stringMsg}\n`;

  try {
    var RNFS = require('react-native-fs');
  } catch (error) {
    console.error('Unable to load react-native-fs, try "yarn add react-native-fs"');
    return true;
  }

  var path = RNFS.DocumentDirectoryPath + '/'+loggerName+'.txt';

  RNFS.appendFile(path, output, 'utf8')
    .then(() => {})
    .catch((err: any) => {
      console.error(err);
    });
};

export { rnFsFileAsync };
