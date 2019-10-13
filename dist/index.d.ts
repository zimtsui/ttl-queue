import { QueueLike, parseNatural } from 'queue';
declare class TtlQueue<T> implements QueueLike<T> {
    private ttl;
    private clean_interval;
    private q;
    [index: number]: T;
    constructor(ttl?: number, clean_interval?: number);
    private clean;
    push(...elems: T[]): this;
    shiftWhile(pred: (x: T) => boolean): this;
    [Symbol.iterator](): IterableIterator<T>;
    shift(num?: number): this;
    clear(): this;
    readonly length: number;
}
export default TtlQueue;
export { parseNatural, TtlQueue, };
