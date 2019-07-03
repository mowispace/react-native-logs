declare function chromeConsoleSyncTransport(msg: Object | string | Function, level: {
    power: number;
    text: string;
}, cb?: () => boolean): boolean;
export { chromeConsoleSyncTransport };
