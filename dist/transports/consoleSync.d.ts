declare function consoleSyncTransport(msg: Object | string | Function, level: {
    power: number;
    text: string;
}, cb?: () => boolean): boolean;
export { consoleSyncTransport };
