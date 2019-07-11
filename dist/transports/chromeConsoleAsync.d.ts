declare function chromeConsoleAsyncTransport(msg: Object | string | Function, level: {
    severity: number;
    text: string;
}, cb?: () => boolean): boolean;
export { chromeConsoleAsyncTransport };
