"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TtlQueue = void 0;
const deque_1 = require("deque");
var TtlQueue;
(function (TtlQueue) {
    function create(ttl, now = Date.now, onShift) {
        const items = deque_1.Deque.create();
        const times = deque_1.Deque.create();
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
    TtlQueue.create = create;
})(TtlQueue = exports.TtlQueue || (exports.TtlQueue = {}));
//# sourceMappingURL=ttl-queue.js.map