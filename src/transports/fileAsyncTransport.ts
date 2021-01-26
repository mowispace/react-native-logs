import { transportFunctionType } from '../index';

const EXPOFSappend = async (FS: any, file: string, msg: string) => {
  try {
    const fileInfo = await FS.getInfoAsync(file);
    if (!fileInfo.exists) {
      await FS.writeAsStringAsync(file, msg, { encoding: FS.EncodingTypes.UTF8 });
      return true;
    } else {
      const prevFile = await FS.readAsStringAsync(file, { encoding: FS.EncodingTypes.UTF8 });
      const newMsg = prevFile + msg;
      await FS.writeAsStringAsync(file, newMsg, { encoding: FS.EncodingTypes.UTF8 });
      return true;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

const RNFSappend = async (FS: any, file: string, msg: string) => {
  try {
    await FS.appendFile(file, msg, 'utf8');
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const fileAsyncTransport: transportFunctionType = props => {
  let WRITE: (FS: any, file: string, msg: string) => Promise<boolean>;
  let fileName: string = 'log';
  let filePath: string;

  if (!props?.options?.FS) {
    throw Error(`react-native-logs: fileAsyncTransport - No FileSystem instance provided`);
  }
  if (props.options.FS.DocumentDirectoryPath && props.options.FS.appendFile) {
    WRITE = RNFSappend;
    filePath = props.options.FS.DocumentDirectoryPath;
  } else if (
    props.options.FS.documentDirectory &&
    props.options.FS.writeAsStringAsync &&
    props.options.FS.readAsStringAsync &&
    props.options.FS.getInfoAsync &&
    props.options.FS.EncodingTypes?.UTF8
  ) {
    WRITE = EXPOFSappend;
    filePath = props.options.FS.documentDirectory;
  } else {
    throw Error(`react-native-logs: fileAsyncTransport - FileSystem not supported`);
  }

  if (props?.options?.fileName) fileName = props.options.fileName;
  if (props?.options?.filePath) filePath = props.options.filePath;

  let output = `${props?.msg}\n`;
  var path = filePath + '/' + fileName;

  WRITE(props.options.FS, path, output);
};

export { fileAsyncTransport };
