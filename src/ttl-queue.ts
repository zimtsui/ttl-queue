import {
    Queue,
    QueueLike,
} from 'queue';
import {
    Loop,
    Pollerloop,
    SetTimeout,
    ClearTimeout,
} from 'pollerloop';
import Startable from 'startable';
import _ from 'lodash';

interface Config<T> {
    ttl: number;
    cleaningInterval: number;
    onShift?: (element: T, time: number) => void;
}

class TtlQueue<T> extends Startable implements QueueLike<T> {
    private times = new Queue<number>();
    private items = new Queue<T>();
    private pollerloop: Pollerloop;
    [index: number]: T;

    // default configuration
    private config: Config<T> = {
        ttl: Number.POSITIVE_INFINITY,
        cleaningInterval: 0,
    };

    constructor(
        config: Partial<Config<T>>,
    );
    constructor(
        config: Partial<Config<T>>,
        setTimeout: SetTimeout,
        clearTimeout: ClearTimeout,
        now: () => number,
    );
    constructor(
        ttl: number,
    );
    constructor(
        ttl: number,
        setTimeout: SetTimeout,
        clearTimeout: ClearTimeout,
        now: () => number,
    );
    constructor(
        config: any,
        private setTimeout: SetTimeout = globalThis.setTimeout,
        private clearTimeout: ClearTimeout = globalThis.clearTimeout,
        private now = Date.now,
    ) {
        super();

        if (typeof config === 'number') config = { ttl: config };
        this.config = {
            ...this.config, ...config,
        };

        const loop: Loop = async (sleep) => {
            for (; ;) {
                await sleep(this.config.cleaningInterval!);
                this.clean();
            }
        }
        this.pollerloop = new Pollerloop(loop, this.setTimeout, this.clearTimeout);

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
                    return target.items[field];
                } else {
                    return Reflect.get(target, field, receiver);
                }
            }
        });
    }

    protected async _start(): Promise<void> {
        if (this.config.cleaningInterval)
            await this.pollerloop.start(this.starp);
    }

    protected async _stop(): Promise<void> {
        if (this.config.cleaningInterval)
            await this.pollerloop.stop();
    }

    public push(item: T, time = this.now()): void {
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
        const now = this.now();
        for (; this.times.length && this.times[0] < now - this.config.ttl;) {
            const item = this.items[0];
            const time = this.times[0];
            this.shift();
            if (this.config.onShift) this.config.onShift(item, time);
        }
    }
}

export {
    TtlQueue as default,
    TtlQueue,
}
