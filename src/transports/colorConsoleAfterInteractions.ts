import { colorConsoleSync } from './colorConsoleSync';
import { transportFunctionType } from '../index';

declare var InteractionManager: any;
declare var require: any;

try {
  InteractionManager = require('react-native').InteractionManager;
} catch (error) {
  console.error('Unable to load react-native InteractionManager"');
  InteractionManager = null;
}

const colorConsoleAfterInteractions: transportFunctionType = (msg, level, options) => {
  if (!InteractionManager) return false;
  InteractionManager.runAfterInteractions(() => {
    colorConsoleSync(msg, level, options);
  });
};

export { colorConsoleAfterInteractions };
