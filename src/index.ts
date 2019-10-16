import {
    Queue,
    parseNatural,
} from 'queue';
import { Polling, Pollerloop } from 'pollerloop';
import _ from 'lodash';

// 这里的 proxy 逻辑上是代理 q，而形式上是继承 NegativeSubscript，
// 所以 q 返回的 this 不会自动多态到 proxy 上，每个方法都要手动写一遍。

interface Record<T> {
    element: T;
    time: number;
}

/*
这里不能写 class extends，原因是父类构造函数中调用了 this.push 方法，这个方法会被多态到
Queue 上，而 Queue 的 push 方法引用了 this.q，此时 this.q 还未创建。

从逻辑上说，TtlQueue 和 Queue 本来就不是继承关系，平时写成继承本来就是一种
workaround，是为了方便懒得把成员都写一遍。
*/

class TtlQueue<T> implements ArrayLike<T>, Iterable<T> {
    private q = new Queue<Record<T>>();
    [index: number]: T;

    constructor(
        private ttl = Number.POSITIVE_INFINITY,
        private clean_interval?: number,
        private onShift?: (element: T, time: number) => void,
    ) {
        const polling: Polling = async (stopping, isRunning, delay) => {
            for (; ;) {
                await delay(clean_interval!);
                if (!isRunning()) break;
                this.clean();
            }
            stopping();
        }
        if (clean_interval && Number.isSafeInteger(ttl))
            new Pollerloop(polling).start();

        return new Proxy(this, {
            get: function (target, field, receiver) {
                try {
                    const subscript = parseNatural(field);
                    if (!target.clean_interval) target.clean();
                    return target.q[subscript].element;
                } catch (e) {
                    return Reflect.get(target, field, receiver);
                }
            }
        });
    }

    private clean(): void {
        const now = Date.now();
        this.q.shiftWhile(r => {
            if (r.time < now - this.ttl) {
                if (this.onShift) this.onShift(
                    r.element,
                    r.time,
                );
                return true;
            } else return false;
        });
    }

    public push(...elems: T[]): this {
        if (!this.clean_interval) this.clean();
        const time = Date.now();
        const rs = elems.map(
            (element): Record<T> => ({
                element, time,
            })
        );
        this.q.push(...rs);
        return this;
    }

    public pushWithTime(...rs: Record<T>[]): this {
        if (!this.clean_interval) this.clean();
        this.q.push(...rs);
        return this;
    }

    public [Symbol.iterator]() {
        if (!this.clean_interval) this.clean();
        return _.map(this.q, r => r.element)[Symbol.iterator]();
    }

    public clear(): this {
        this.q.clear();
        return this;
    }

    public get length(): number {
        if (!this.clean_interval) this.clean();
        return this.q.length;
    }
}

export default TtlQueue;
export {
    parseNatural,
    TtlQueue,
}