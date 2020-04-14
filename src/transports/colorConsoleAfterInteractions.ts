import { colorConsoleSync } from './colorConsoleSync';
import { transportFunctionType } from '../index';

declare var require: any;

const InteractionManager = require('react-native').InteractionManager;

const colorConsoleAfterInteractions: transportFunctionType = (msg, level, options) => {
  if (!InteractionManager) return false;
  InteractionManager.runAfterInteractions(() => {
    colorConsoleSync(msg, level, options);
  });
};

export { colorConsoleAfterInteractions };
