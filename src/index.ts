import { Queue, parseInt, Subscript } from 'queue';
import { Polling, Pollerloop } from 'pollerloop';
import _ from 'lodash';

class TtlQueue<T> implements Queue<T> {
    public length = <number>{};
    [index: number]: T;
    public push(...elems: T[]) { return <this>{}; }
    public shift(num = 1) { return <this>{}; }
    public shiftWhile(pred: (x: T) => boolean) { return <this>{}; }
    public [Symbol.iterator]() { return <Iterator<T>>{}; }
    public clear() { return <this>{}; }

    constructor(
        ttl: number = Number.POSITIVE_INFINITY,
        clean_interval: number = ttl,
    ) {
        interface R {
            element: T;
            time: number;
        }
        const q = new Queue<R>();

        const polling: Polling = async (stopping, isRunning, delay) => {
            for (; ;) {
                await delay(clean_interval);
                if (!isRunning()) break;

                const now = Date.now();
                q.shiftWhile(
                    r => r.time < now - ttl
                );
            }
            stopping();
        }
        if (Number.isFinite(clean_interval))
            new Pollerloop(polling).start();

        return new Proxy(<Queue<T>>{}, {
            get: function (
                target,
                field: Subscript,
                receiver: Queue<T>,
            ) {

                if (field === 'push') return function (...args: T[]) {
                    const time = Date.now();
                    const rs = _.map(args, element => ({
                        element, time,
                    }));
                    q.push(...rs);
                    return receiver;
                }

                if (field === 'shiftWhile') return function (
                    pred: (x: T) => boolean
                ) {
                    q.shiftWhile(r => pred(r.element));
                    return receiver;
                }

                if (field === Symbol.iterator)
                    return _.map(q, r => r.element)[Symbol.iterator];

                try {
                    const subscript = parseInt(field);
                    return q[subscript].element;
                } catch (e) {
                    // console.log(field);
                    const member = Reflect.get(q, field, q);
                    if (typeof member === 'function')
                        return function (...args: any[]) {
                            const returnValue = member(...args);
                            if (returnValue === q) return receiver;
                            else return returnValue;
                        }
                    else return member;
                }
            }
        });
    }
}

export default TtlQueue;
export {
    parseInt,
    Subscript,
    TtlQueue,
}