import {
    default as Queue,
    RandomAccessIterableQueueInterface,
} from 'queue';
import { Poll, Pollerloop } from 'pollerloop';
import _ from 'lodash';



class TtlQueue<T> extends Queue<T> implements QueueLike<T> {
    private pushingTime = new Queue<number>();
    [index: number]: T;

    constructor(
        private ttl = Number.POSITIVE_INFINITY,
        private clean_interval?: number,
        private onShift?: (element: T, time: number) => void,
    ) {
        super();
        const polling: Poll = async (stop, shouldBeRunning, delay) => {
            for (; ;) {
                await delay(clean_interval!);
                if (!shouldBeRunning) break;
                this.clean();
            }
            stop();
        }
        if (this.clean_interval)
            new Pollerloop(polling).start();

        return new Proxy(this, {
            get: function (
                target,
                field: string | symbol,
                receiver
            ) {
                let subscript: number;
                if (
                    typeof field === 'string'
                    && !Number.isNaN(subscript = Number.parseInt(field))
                ) {
                    target.clean();
                    return target.q.n(subscript).element;
                } else
                    return Reflect.get(target, field, receiver);
            }
        });
    }

    public push(...elems: T[]): this {
        const now = Date.now();
        super.push(...elems);
        this.pushingTime.push(..._.times(elems.length, _.constant(now));
        return this;
    }

    public shift(num?: number): this {
        super.shift(num);
        this.pushingTime.shift(num);
        return this;
    }

    private clean(): this {
        const now = Date.now();
        for (; this.length && this.pushingTime[0] < now - this.ttl;) {
            if (this.onShift) this.onShift(
                this[0], this.pushingTime[0],
            );
            this.shift();
            this.pushingTime.shift();
        }
        return this;
    }
}

export default TtlQueue;
export {
    TtlQueue,
}