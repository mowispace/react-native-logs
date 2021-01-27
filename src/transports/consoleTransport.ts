import { transportFunctionType } from "../index";

const webColors: Array<string> = [
  "",
  "color: dodgerblue;font-weight:bold",
  "color: orange;font-weight:bold;",
  "color: indianred;font-weight:bold;",
  "color: #49ed21;font-weight:bold;",
  "color: #d69c51;font-weight:bold;",
  "color: #fc2a66;font-weight:bold;",
  "color: #e2e83a;font-weight:bold;",
  "color: #2e7cd1;font-weight:bold;",
  "color: #4d1bc1;font-weight:bold;",
  "color: #b54ae2;font-weight:bold;",
];

const ansiColors: Array<string> = [
  "",
  "\x1B[94m",
  "\x1B[93m",
  "\x1B[91m",
  "\x1B[96m",
  "\x1B[94m",
  "\x1B[95m",
  "\x1B[35m",
  "\x1B[33m",
  "\x1B[34m",
  "\x1B[32m",
];
const colorEnd = "\x1B[0m";

const consoleTransport: transportFunctionType = (props) => {
  if (props?.options?.colors === "ansi") {
    console.log(
      `${ansiColors[props?.level?.severity]}${props?.msg}${colorEnd}`
    );
  } else if (props?.options?.colors === "web") {
    console.log(`%c${props?.msg}`, webColors[props?.level?.severity] || "");
  } else {
    console.log(props?.msg);
  }
  return true;
};

export { consoleTransport };
