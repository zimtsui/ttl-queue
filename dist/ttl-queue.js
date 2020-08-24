import { Pollerloop } from 'pollerloop';
import Startable from 'startable';
import _ from 'lodash';
class TtlQueue extends Startable {
    constructor(config = {}) {
        super();
        // default configuration
        this.config = {
            ttl: Number.POSITIVE_INFINITY,
            elemCarrierConstructor: Array,
            timeCarrierConstructor: Array,
        };
        if (typeof config === 'number')
            config = { ttl: config };
        Object.assign(this.config, config);
        this.times = new this.config.timeCarrierConstructor();
        this.elements = new this.config.elemCarrierConstructor();
        const poll = async (stop, ifShouldBeRunning, delay) => {
            for (;;) {
                await delay(this.config.cleaningInterval);
                if (!ifShouldBeRunning())
                    break;
                this.clean();
            }
            stop();
        };
        this.pollerloop = new Pollerloop(poll);
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
                    return target.elements[field];
                }
                else {
                    const returnValue = Reflect.get(target, field, target);
                    if (returnValue === target)
                        return receiver;
                    else
                        return returnValue;
                }
            }
        });
    }
    async _start() {
        if (this.config.cleaningInterval)
            await this.pollerloop.start(this.stop.bind(this));
    }
    async _stop() {
        if (this.config.cleaningInterval)
            await this.pollerloop.stop();
    }
    push(...items) {
        this.elements.push(...items);
        this.times.push(..._.times(items.length, _.constant(Date.now())));
    }
    shift(num) {
        this.elements.shift(num);
        this.times.shift(num);
    }
    get length() {
        if (!this.config.cleaningInterval)
            this.clean();
        return this.elements.length;
    }
    [Symbol.iterator]() {
        if (!this.config.cleaningInterval)
            this.clean();
        return this.elements[Symbol.iterator]();
    }
    clean() {
        const now = Date.now();
        for (; this.times.length && this.times[0] < now - this.config.ttl;) {
            const element = this.elements[0];
            const time = this.times[0];
            this.shift();
            if (this.config.onShift)
                this.config.onShift(element, time);
        }
    }
}
export { TtlQueue as default, TtlQueue, };
//# sourceMappingURL=ttl-queue.js.map