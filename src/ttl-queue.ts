import {
    Queue,
    QueueLike,
} from 'queue';
import {
    Poll,
    Pollerloop,
    SetTimeout,
    ClearTimeout,
} from 'pollerloop';
import Startable from 'startable';
import _ from 'lodash';

interface Config<T> {
    ttl: number;
    cleaningInterval?: number;
    onShift?: (element: T, time: number) => void;
}

class TtlQueue<T, Timeout> extends Startable implements QueueLike<T> {
    private times = new Queue<number>();
    private items = new Queue<T>();
    private pollerloop: Pollerloop<Timeout>;
    [index: number]: T;

    // default configuration
    private config: Config<T> = {
        ttl: Number.POSITIVE_INFINITY,
    };

    constructor(
        config: Partial<Config<T>>,
        setTimeout: SetTimeout<Timeout>,
        clearTimeout: ClearTimeout<Timeout>,
    );
    constructor(
        ttl: number,
        setTimeout: SetTimeout<Timeout>,
        clearTimeout: ClearTimeout<Timeout>,
    );
    constructor(
        configOrTtl: Partial<Config<T>> | number,
        private setTimeout: SetTimeout<Timeout>,
        private clearTimeout: ClearTimeout<Timeout>,
    ) {
        super();

        if (typeof configOrTtl === 'number') configOrTtl = { ttl: configOrTtl };
        Object.assign(this.config, configOrTtl);

        const poll: Poll = async (stop, ifShouldBeRunning, delay) => {
            for (; ;) {
                await delay(this.config.cleaningInterval!);
                if (!ifShouldBeRunning()) break;
                this.clean();
            }
            stop();
        }
        this.pollerloop = new Pollerloop(poll, this.setTimeout, this.clearTimeout);

        return new Proxy(this, {
            get: function (
                target: TtlQueue<T, Timeout>,
                field: string | symbol | number,
                receiver: TtlQueue<T, Timeout>,
            ) {
                if (typeof field === 'string') {
                    const index = Number.parseInt(field);
                    if (!Number.isNaN(index)) field = index;
                }
                if (typeof field === 'number') {
                    if (!target.config.cleaningInterval) target.clean();
                    return target.items[field];
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

    public push(item: T, time = Date.now()): void {
        this.items.push(item);
        this.times.push(time);
    }

    public shift(): void {
        this.items.shift();
        this.times.shift();
    }

    public get length(): number {
        if (!this.config.cleaningInterval) this.clean();
        return this.items.length;
    }

    public [Symbol.iterator]() {
        if (!this.config.cleaningInterval) this.clean();
        return this.items[Symbol.iterator]();
    }

    private clean(): void {
        const now = Date.now();
        for (; this.times.length && this.times[0] < now - this.config.ttl;) {
            const element = this.items[0];
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
