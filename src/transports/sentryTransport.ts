import { transportFunctionType } from "../index";

const sentryTransport: transportFunctionType = (props) => {
  if (!props) return false;

  if (!props?.options?.SENTRY) {
    throw Error(
      `react-native-logs: sentryTransport - No sentry instance provided`
    );
  }

  if (props.rawMsg && props.rawMsg.stack && props.rawMsg.message) {
    // this is probably a JS error
    props.options.SENTRY.captureException(props.rawMsg);
  } else {
    props.options.SENTRY.captureException(props.msg);
  }

  return true;
};

export { sentryTransport };
