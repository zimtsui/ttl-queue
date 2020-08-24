import {
    default as Queue,
    RandomAccessIterableQueueInterface as RAIQI,
} from 'queue';
import { Poll, Pollerloop } from 'pollerloop';
import Startable from 'startable';
import _ from 'lodash';

interface Config<T> {
    ttl: number;
    cleaningInterval?: number;
    onShift?: (element: T, time: number) => void;
    elemCarrierConstructor: {
        new(...args: any[]): RAIQI<T>;
    };
    timeCarrierConstructor: {
        new(...args: any[]): RAIQI<number>;
    };
}

class TtlQueue<T> extends Startable implements RAIQI<T> {
    private times: RAIQI<number>;
    private elements: RAIQI<T>;
    private pollerloop: Pollerloop;
    [index: number]: T;

    // default configuration
    private config: Config<T> = {
        ttl: Number.POSITIVE_INFINITY,
        elemCarrierConstructor: Array,
        timeCarrierConstructor: Array,
    };

    constructor(
        config: Partial<Config<T>> | number = {},
    ) {
        super();

        if (typeof config === 'number') config = { ttl: config };
        Object.assign(this.config, config);

        this.times = new this.config.timeCarrierConstructor();
        this.elements = new this.config.elemCarrierConstructor();

        const poll: Poll = async (stop, ifShouldBeRunning, delay) => {
            for (; ;) {
                await delay(this.config.cleaningInterval!);
                if (!ifShouldBeRunning()) break;
                this.clean();
            }
            stop();
        }
        this.pollerloop = new Pollerloop(poll);

        return new Proxy(this, {
            get: function (
                target: TtlQueue<T>,
                field: string | symbol | number,
                receiver: TtlQueue<T>,
            ) {
                if (typeof field === 'string') {
                    const index = Number.parseInt(field);
                    if (!Number.isNaN(index)) field = index;
                }
                if (typeof field === 'number') {
                    if (!target.config.cleaningInterval) target.clean();
                    return target.elements[field];
                } else {
                    const returnValue = Reflect.get(target, field, target);
                    if (returnValue === target) return receiver; else return returnValue;
                }
            }
        });
    }

    protected async _start(): Promise<void> {
        if (this.config.cleaningInterval)
            await this.pollerloop.start(this.stop.bind(this));
    }

    protected async _stop(): Promise<void> {
        if (this.config.cleaningInterval)
            await this.pollerloop.stop();
    }

    public push(...items: T[]): void {
        this.elements.push(...items);
        this.times.push(..._.times(items.length, _.constant(Date.now())));
    }

    public shift(num?: number): void {
        this.elements.shift(num);
        this.times.shift(num);
    }

    public get length(): number {
        if (!this.config.cleaningInterval) this.clean();
        return this.elements.length;
    }

    public [Symbol.iterator]() {
        if (!this.config.cleaningInterval) this.clean();
        return this.elements[Symbol.iterator]();
    }

    private clean(): void {
        const now = Date.now();
        for (; this.times.length && this.times[0] < now - this.config.ttl;) {
            const element = this.elements[0];
            const time = this.times[0];
            this.shift();
            if (this.config.onShift) this.config.onShift(
                element, time,
            );
        }
    }
}

export {
    TtlQueue as default,
    TtlQueue,
}