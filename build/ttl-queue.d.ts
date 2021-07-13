export interface QueueLike<T> extends Iterable<T> {
    (index: number): T;
    [Symbol.iterator]: () => Iterator<T>;
    push(item: T): void;
    shift(): T;
    length: number;
}
declare function createTtlQueue<T>(ttl: number, now?: () => number, onShift?: (item: T, time: number) => void): QueueLike<T>;
export { createTtlQueue as default, createTtlQueue, };
