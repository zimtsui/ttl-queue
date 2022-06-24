"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TtlQueue = void 0;
const deque_1 = require("@zimtsui/deque");
class TtlQueue {
    /**
     * @param ttl Number.POSITIVE_INFINITY for never removing.
     */
    constructor(ttl, now = Date.now) {
        this.ttl = ttl;
        this.now = now;
        this.q = new deque_1.Deque();
    }
    clean() {
        while (this.q.getSize() &&
            this.now() > this.q.i(0).time + this.ttl)
            this.q.shift();
    }
    /**
     * @throws RangeError
     * @param index - Can be negative.
     */
    i(index) {
        this.clean();
        return this.q.i(index).value;
    }
    slice(start = 0, end = this.getSize()) {
        return this.q.slice(start, end)
            .map(item => item.value);
    }
    push(x) {
        this.q.push({
            value: x,
            time: this.now(),
        });
        this.clean();
    }
    getSize() {
        return this.q.getSize();
    }
    /**
     * Time complexity O(n)
     */
    [Symbol.iterator]() {
        this.clean();
        return [...this.q].map(item => item.value)[Symbol.iterator]();
    }
}
exports.TtlQueue = TtlQueue;
//# sourceMappingURL=ttl-queue.js.map