"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TtlQueue = exports.default = void 0;
const deque_1 = require("deque");
/**
 * This is a factory function. Don't prepend a "new".
 */
function TtlQueue(ttl, now = Date.now, onShift) {
    const items = (0, deque_1.Deque)();
    const times = (0, deque_1.Deque)();
    const clean = () => {
        for (; times.length && now() > times(0) + ttl;) {
            const item = items(0);
            const time = times(0);
            items.shift();
            times.shift();
            if (onShift)
                onShift(item, time);
        }
    };
    const queue = ((i) => {
        clean();
        return items(i);
    });
    queue.push = (item, time = now()) => {
        items.push(item);
        times.push(time);
        clean();
    };
    queue.shift = () => {
        clean();
        times.shift();
        return items.shift();
    };
    queue[Symbol.iterator] = () => {
        clean();
        return items[Symbol.iterator]();
    };
    Reflect.defineProperty(queue, 'length', {
        get() {
            clean();
            return items.length;
        }
    });
    return queue;
}
exports.default = TtlQueue;
exports.TtlQueue = TtlQueue;
//# sourceMappingURL=ttl-queue.js.map