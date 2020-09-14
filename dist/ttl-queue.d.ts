import { QueueLike } from 'queue';
import { SetTimeout, ClearTimeout } from 'pollerloop';
import Startable from 'startable';
declare type ConstructorType<T> = new (...args: any[]) => T;
declare type IAQueue<T> = QueueLike<T> & ArrayLike<T> & Iterable<T>;
interface Config<T> {
    ttl: number;
    cleaningInterval?: number;
    onShift?: (element: T, time: number) => void;
    elemCarrierConstructor: ConstructorType<IAQueue<T>>;
    timeCarrierConstructor: ConstructorType<IAQueue<number>>;
}
declare class TtlQueue<T, Timeout> extends Startable implements IAQueue<T> {
    private setTimeout;
    private clearTimeout;
    private times;
    private items;
    private pollerloop;
    [index: number]: T;
    private config;
    constructor(config: number | Partial<Config<T>> | undefined, setTimeout: SetTimeout<Timeout>, clearTimeout: ClearTimeout<Timeout>);
    protected _start(): Promise<void>;
    protected _stop(): Promise<void>;
    push(item: T, time?: number): void;
    shift(num?: number): void;
    get length(): number;
    [Symbol.iterator](): Iterator<T, any, undefined>;
    private clean;
}
export { TtlQueue as default, TtlQueue, IAQueue, };
