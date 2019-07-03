declare function transport(msg: Object | string | Function, level: {
    power: number;
    color: string;
}, levelTxt: string): boolean;
declare const consoleAfterInteractions: {
    transport: typeof transport;
};
export { consoleAfterInteractions };
