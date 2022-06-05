export declare class TtlQueue<T> implements Iterable<T> {
    private ttl;
    private now;
    private q;
    constructor(ttl: number, now?: () => number);
    private clean;
    /**
     * @throws RangeError
     * @param index - Can be negative.
     */
    i(index: number): T;
    slice(start?: number, end?: number): T[];
    push(x: T): void;
    getSize(): number;
    /**
     * Time complexity O(n)
     */
    [Symbol.iterator](): IterableIterator<T>;
}
