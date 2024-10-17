import { transportFunctionType } from "../index";

const crashlyticsTransport: transportFunctionType = (props) => {
  if (!props) return false;

  if (!props?.options?.CRASHLYTICS) {
    throw Error(
      `react-native-logs: crashlyticsTransport - No crashlytics instance provided`
    );
  }

  let isError = true;

  if (props?.options?.errorLevels) {
    isError = false;
    if (Array.isArray(props?.options?.errorLevels)) {
      if (props.options.errorLevels.includes(props.level.text)) {
        isError = true;
      }
    } else {
      if (props.options.errorLevels === props.level.text) {
        isError = true;
      }
    }
  }

  try {
    if (isError) {
      props.options.CRASHLYTICS.recordError(props.msg);
    } else {
      props.options.CRASHLYTICS.log(props.msg);
    }
    return true;
  } catch (error) {
    throw Error(
      `react-native-logs: crashlyticsTransport - Error on send msg to crashlytics`
    );
  }
};

export { crashlyticsTransport };
