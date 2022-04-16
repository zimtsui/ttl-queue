import { QueueLike, ElementType } from 'deque';
export declare namespace TtlQueue {
    function create<T extends ElementType>(ttl: number, now?: () => number, onShift?: (item: T, time: number) => void): QueueLike<T>;
}
