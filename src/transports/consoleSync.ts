import { transportFunctionType } from '../index';

const consoleSyncTransport: transportFunctionType = (msg, level) => {
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

  let output = `${new Date().toLocaleString()} | ${level.text.toUpperCase()}\n${stringMsg}`;
  console.log(output);

  return true;
};

export { consoleSyncTransport };
