import { RandomAccessIterableQueueInterface as RAIQI } from 'queue';
import Startable from 'startable';
interface Config<T> {
    ttl: number;
    cleaningInterval?: number;
    onShift?: (element: T, time: number) => void;
    elemCarrierConstructor: {
        new (...args: any[]): RAIQI<T>;
    };
    timeCarrierConstructor: {
        new (...args: any[]): RAIQI<number>;
    };
}
declare class TtlQueue<T> extends Startable implements RAIQI<T> {
    private times;
    private items;
    private pollerloop;
    [index: number]: T;
    private config;
    constructor(config?: Partial<Config<T>> | number);
    protected _start(): Promise<void>;
    protected _stop(): Promise<void>;
    push(item: T, time?: number): void;
    shift(num?: number): void;
    get length(): number;
    [Symbol.iterator](): Iterator<T, any, undefined>;
    private clean;
}
export { TtlQueue as default, TtlQueue, };
