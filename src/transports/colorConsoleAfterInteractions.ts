import { colorConsoleSync } from './colorConsoleSync';
import { transportFunctionType } from '../index';

declare var InteractionManager: any;

const colorConsoleAfterInteractions: transportFunctionType = (msg, level) => {
  InteractionManager.runAfterInteractions(() => {
    colorConsoleSync(msg, level);
  });
};

export { colorConsoleAfterInteractions };
