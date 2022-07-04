import { transportFunctionType } from "../index";

interface EXPOqueueitem {
  FS: any;
  file: string;
  msg: string;
}

let EXPOqueue: Array<EXPOqueueitem> = [];
let EXPOelaborate = false;

const EXPOFSreadwrite = async () => {
  EXPOelaborate = true;
  const item = EXPOqueue[0];
  const prevFile = await item.FS.readAsStringAsync(item.file);
  const newMsg = prevFile + item.msg;
  await item.FS.writeAsStringAsync(item.file, newMsg);
  EXPOelaborate = false;
  EXPOqueue.shift();
  if (EXPOqueue.length > 0) {
    await EXPOFSreadwrite();
  }
};

const EXPOcheckqueue = async (FS: any, file: string, msg: string) => {
  EXPOqueue.push({ FS, file, msg });
  if (!EXPOelaborate) {
    await EXPOFSreadwrite();
  }
};

const EXPOFSappend = async (FS: any, file: string, msg: string) => {
  try {
    const fileInfo = await FS.getInfoAsync(file);
    if (!fileInfo.exists) {
      await FS.writeAsStringAsync(file, msg);
      return true;
    } else {
      await EXPOcheckqueue(FS, file, msg);
      return true;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

const RNFSappend = async (FS: any, file: string, msg: string) => {
  try {
    await FS.appendFile(file, msg, "utf8");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const fileAsyncTransport: transportFunctionType = (props) => {
  if (!props) return false;

  let WRITE: (FS: any, file: string, msg: string) => Promise<boolean>;
  let fileName: string = "log";
  let filePath: string;

  if (!props?.options?.FS) {
    throw Error(
      `react-native-logs: fileAsyncTransport - No FileSystem instance provided`
    );
  }
  if (props.options.FS.DocumentDirectoryPath && props.options.FS.appendFile) {
    WRITE = RNFSappend;
    filePath = props.options.FS.DocumentDirectoryPath;
  } else if (
    props.options.FS.documentDirectory &&
    props.options.FS.writeAsStringAsync &&
    props.options.FS.readAsStringAsync &&
    props.options.FS.getInfoAsync
  ) {
    WRITE = EXPOFSappend;
    filePath = props.options.FS.documentDirectory;
  } else {
    throw Error(
      `react-native-logs: fileAsyncTransport - FileSystem not supported`
    );
  }

  if (props?.options?.fileName) {
    let today = new Date();
    let d = today.getDate();
    let m = today.getMonth() + 1;
    let y = today.getFullYear();
    fileName = props.options.fileName;
    fileName = fileName.replace("{date-today}", `${d}-${m}-${y}`);
  }

  if (props?.options?.filePath) filePath = props.options.filePath;

  let output = `${props?.msg}\n`;
  var path = filePath + "/" + fileName;

  WRITE(props.options.FS, path, output);
};

export { fileAsyncTransport };
