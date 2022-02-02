import {
    Deque,
    QueueLike,
    ElementType,
    DequeLike,
} from 'deque';


/**
 * This is a factory function. Don't prepend a "new".
 */
function TtlQueue<T extends ElementType>(
    ttl: number,
    now: () => number = Date.now,
    onShift?: (item: T, time: number) => void,
): QueueLike<T> {
    const items = Deque<T>();
    const times = Deque<number>();

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

export {
    TtlQueue as default,
    TtlQueue,
    QueueLike,
    ElementType,
    DequeLike,
}
