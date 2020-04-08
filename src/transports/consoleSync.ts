import { transportFunctionType } from '../index';

const consoleSync: transportFunctionType = (msg, level, options) => {
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

  if (options && options.printDate) {
    dateTxt = `${new Date().toLocaleString()} | `;
  }

  if (options && options.printLevel) {
    levelTxt = `${level.text.toUpperCase()} | `;
  }

  let output = `${dateTxt}${levelTxt}${stringMsg}`;
  console.log(output);

  return true;
};

export { consoleSync };
