import { parseNatural } from 'queue';
declare class TtlQueue<T> implements ArrayLike<T>, Iterable<T> {
    private ttl;
    private clean_interval;
    private onShift?;
    private q;
    [index: number]: T;
    constructor(ttl?: number, clean_interval?: number, onShift?: ((element: T) => void) | undefined);
    private clean;
    push(...elems: T[]): this;
    [Symbol.iterator](): IterableIterator<T>;
    clear(): this;
    readonly length: number;
}
export default TtlQueue;
export { parseNatural, TtlQueue, };
