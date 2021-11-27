import { QueueLike } from 'deque';
/**
 * This is a factory function. Don't prepend a "new".
 */
declare function TtlQueue<T>(ttl: number, now?: () => number, onShift?: (item: T, time: number) => void): QueueLike<T>;
export { TtlQueue as default, TtlQueue, QueueLike, };
