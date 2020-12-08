import { QueueLike } from 'queue';
import Startable from 'startable';
interface Config<T> {
    ttl: number;
    cleaningInterval: number;
    onShift?: (element: T, time: number) => void;
}
declare class TtlQueue<T> extends Startable implements QueueLike<T> {
    private setTimeout;
    private clearTimeout;
    private times;
    private items;
    private pollerloop;
    [index: number]: T;
    private config;
    constructor(config: Partial<Config<T>>, setTimeout?: typeof global.setTimeout, clearTimeout?: typeof global.clearTimeout);
    constructor(ttl: number, setTimeout?: typeof global.setTimeout, clearTimeout?: typeof global.clearTimeout);
    protected _start(): Promise<void>;
    protected _stop(): Promise<void>;
    push(item: T, time?: number): void;
    shift(): void;
    get length(): number;
    [Symbol.iterator](): Iterator<T, any, undefined>;
    private clean;
}
export { TtlQueue as default, TtlQueue, };
