export declare class TTLQueue<T> implements Iterable<T> {
    private ttl;
    private now;
    private v;
    private front;
    /**
     * @param ttl Number.POSITIVE_INFINITY for never removing.
     * @param now The function to get current timestamp.
     */
    constructor(ttl: number, now?: () => number);
    private clean;
    push(x: T): void;
    getSize(): number;
    [Symbol.iterator](): Generator<T, void, void>;
}
