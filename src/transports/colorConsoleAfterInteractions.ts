import { colorConsoleSync } from './colorConsoleSync';
import { transportFunctionType } from '../index';

declare var InteractionManager: any;

const colorConsoleAfterInteractions: transportFunctionType = (msg, level, options) => {
  InteractionManager.runAfterInteractions(() => {
    colorConsoleSync(msg, level, options);
  });
};

export { colorConsoleAfterInteractions };
