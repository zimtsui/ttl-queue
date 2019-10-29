interface Record<T> {
    element: T;
    time: number;
}
declare class TtlQueue<T> implements ArrayLike<T>, Iterable<T> {
    private ttl;
    private clean_interval?;
    private onShift?;
    private q;
    [index: number]: T;
    constructor(ttl?: number, clean_interval?: number | undefined, onShift?: ((element: T, time: number) => void) | undefined);
    private clean;
    push(...elems: T[]): this;
    pushWithTime(...rs: Record<T>[]): this;
    [Symbol.iterator](): IterableIterator<T>;
    clear(): this;
    readonly length: number;
}
export default TtlQueue;
export { TtlQueue, };
