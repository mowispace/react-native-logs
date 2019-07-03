declare function chromeConsoleAsyncTransport(msg: Object | string | Function, level: {
    power: number;
    text: string;
}, cb?: () => boolean): boolean;
export { chromeConsoleAsyncTransport };
