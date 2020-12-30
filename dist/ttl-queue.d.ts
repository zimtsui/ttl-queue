import { QueueLike } from 'queue';
import Startable from 'startable';
interface Config<T> {
    ttl: number;
    cleaningInterval: number;
    onShift?: (element: T, time: number) => void;
}
interface SetTimeout {
    (cb: () => void, ms: number): any;
}
interface ClearTimeout {
    (timerId: any): void;
}
declare class TtlQueue<T> extends Startable implements QueueLike<T> {
    private setTimeout;
    private clearTimeout;
    private now;
    private times;
    private items;
    private pollerloop;
    [index: number]: T;
    private config;
    constructor(config: Partial<Config<T>>, setTimeout?: SetTimeout, clearTimeout?: ClearTimeout, now?: () => number);
    constructor(ttl: number, setTimeout?: SetTimeout, clearTimeout?: ClearTimeout, now?: () => number);
    protected _start(): Promise<void>;
    protected _stop(): Promise<void>;
    push(item: T, time?: number): void;
    shift(): void;
    get length(): number;
    [Symbol.iterator](): Iterator<T, any, undefined>;
    private clean;
}
export { TtlQueue as default, TtlQueue, };
