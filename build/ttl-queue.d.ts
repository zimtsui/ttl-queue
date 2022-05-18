export declare class TtlQueue<T> implements Iterable<T> {
    private ttl;
    private now;
    private q;
    constructor(ttl: number, now?: () => number);
    private clean;
    i(index: number): T;
    push(x: T): void;
    getSize(): number;
    [Symbol.iterator](): IterableIterator<T>;
}
