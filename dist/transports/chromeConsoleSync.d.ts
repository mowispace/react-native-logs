declare function chromeConsoleSyncTransport(msg: Object | string | Function, level: {
    severity: number;
    text: string;
}, cb?: () => boolean): boolean;
export { chromeConsoleSyncTransport };
