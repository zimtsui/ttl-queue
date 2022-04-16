import {
    Deque,
    QueueLike,
    ElementType,
} from 'deque';


export namespace TtlQueue {
    export function create<T extends ElementType>(
        ttl: number,
        now: () => number = Date.now,
        onShift?: (item: T, time: number) => void,
    ): QueueLike<T> {
        const items = Deque.create<T>();
        const times = Deque.create<number>();

        const clean = (): void => {
            for (; times.length && now() > times(0) + ttl;) {
                const item = items(0);
                const time = times(0);
                items.shift();
                times.shift();
                if (onShift) onShift(item, time);
            }
        }

        const queue = <QueueLike<T>>((i: number) => {
            clean();
            return items(i);
        });
        queue.push = (item: T, time = now()): void => {
            items.push(item);
            times.push(time);
            clean();
        }
        queue.shift = (): T => {
            clean();
            times.shift();
            return items.shift();
        }
        queue[Symbol.iterator] = () => {
            clean();
            return items[Symbol.iterator]();
        }
        Reflect.defineProperty(queue, 'length', {
            get() {
                clean();
                return items.length;
            }
        });

        return queue;
    }
}
