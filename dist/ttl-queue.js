import { Queue, } from 'queue';
import { Pollerloop, } from 'pollerloop';
import Startable from 'startable';
class TtlQueue extends Startable {
    constructor(config, setTimeout = globalThis.setTimeout, clearTimeout = globalThis.clearTimeout, now = Date.now) {
        super();
        this.setTimeout = setTimeout;
        this.clearTimeout = clearTimeout;
        this.now = now;
        this.times = new Queue();
        this.items = new Queue();
        // default configuration
        this.config = {
            ttl: Number.POSITIVE_INFINITY,
            cleaningInterval: 0,
        };
        if (typeof config === 'number')
            config = { ttl: config };
        this.config = {
            ...this.config, ...config,
        };
        const loop = async (sleep) => {
            for (;;) {
                await sleep(this.config.cleaningInterval);
                this.clean();
            }
        };
        this.pollerloop = new Pollerloop(loop, this.setTimeout, this.clearTimeout);
        return new Proxy(this, {
            get: function (target, field, receiver) {
                if (typeof field === 'string') {
                    const index = Number.parseInt(field);
                    if (!Number.isNaN(index))
                        field = index;
                }
                if (typeof field === 'number') {
                    if (!target.config.cleaningInterval)
                        target.clean();
                    return target.items[field];
                }
                else {
                    return Reflect.get(target, field, receiver);
                }
            }
        });
    }
    async _start() {
        if (this.config.cleaningInterval)
            await this.pollerloop.start(this.starp);
    }
    async _stop() {
        if (this.config.cleaningInterval)
            await this.pollerloop.stop();
    }
    push(item, time = this.now()) {
        this.items.push(item);
        this.times.push(time);
    }
    shift() {
        this.items.shift();
        this.times.shift();
    }
    get length() {
        if (!this.config.cleaningInterval)
            this.clean();
        return this.items.length;
    }
    [Symbol.iterator]() {
        if (!this.config.cleaningInterval)
            this.clean();
        return this.items[Symbol.iterator]();
    }
    clean() {
        const now = this.now();
        for (; this.times.length && this.times[0] < now - this.config.ttl;) {
            const item = this.items[0];
            const time = this.times[0];
            this.shift();
            if (this.config.onShift)
                this.config.onShift(item, time);
        }
    }
}
export { TtlQueue as default, TtlQueue, };
//# sourceMappingURL=ttl-queue.js.map