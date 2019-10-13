import { parseNatural } from 'queue';
declare class TtlQueue<T> implements ArrayLike<T>, Iterable<T> {
    private ttl;
    private clean_interval;
    private q;
    [index: number]: T;
    constructor(ttl?: number, clean_interval?: number);
    private clean;
    push(...elems: T[]): this;
    [Symbol.iterator](): IterableIterator<T>;
    clear(): this;
    readonly length: number;
}
export default TtlQueue;
export { parseNatural, TtlQueue, };
