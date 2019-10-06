import { Queue, parseInt, Subscript } from 'queue';
declare class TtlQueue<T> implements Queue<T> {
    length: number;
    [index: number]: T;
    push(...elems: T[]): this;
    shift(num?: number): this;
    shiftWhile(pred: (x: T) => boolean): this;
    [Symbol.iterator](): Iterator<T, any, undefined>;
    clear(): this;
    constructor(ttl?: number, clean_interval?: number);
}
export default TtlQueue;
export { parseInt, Subscript, TtlQueue, };
