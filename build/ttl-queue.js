"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TtlQueue = void 0;
const deque_1 = require("deque");
class TtlQueue {
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
    i(index) {
        this.clean();
        return this.q.i(index).item;
    }
    push(x) {
        this.q.push({
            item: x,
            time: this.now(),
        });
        this.clean();
    }
    getSize() {
        return this.q.getSize();
    }
    [Symbol.iterator]() {
        this.clean();
        return [...this.q].map(elem => elem.item)[Symbol.iterator]();
    }
}
exports.TtlQueue = TtlQueue;
//# sourceMappingURL=ttl-queue.js.map