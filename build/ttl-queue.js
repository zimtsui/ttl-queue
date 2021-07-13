"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTtlQueue = exports.default = void 0;
const deque_1 = require("deque");
function createTtlQueue(ttl, now = Date.now, onShift) {
    const items = deque_1.createDeque();
    const times = deque_1.createDeque();
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
exports.default = createTtlQueue;
exports.createTtlQueue = createTtlQueue;
//# sourceMappingURL=ttl-queue.js.map