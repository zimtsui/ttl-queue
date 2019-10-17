"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const queue_1 = require("queue");
exports.parseNatural = queue_1.parseNatural;
const pollerloop_1 = require("pollerloop");
const lodash_1 = __importDefault(require("lodash"));
/*
这里不能写 class extends，原因是父类构造函数中调用了 this.push 方法，这个方法会被多态到
Queue 上，而 Queue 的 push 方法引用了 this.q，此时 this.q 还未创建。

从逻辑上说，TtlQueue 和 Queue 本来就不是继承关系，平时写成继承本来就是一种
workaround，是为了方便懒得把成员都写一遍。
*/
class TtlQueue {
    constructor(ttl = Number.POSITIVE_INFINITY, clean_interval, onShift) {
        this.ttl = ttl;
        this.clean_interval = clean_interval;
        this.onShift = onShift;
        this.q = new queue_1.Queue();
        const polling = (stopping, isRunning, delay) => __awaiter(this, void 0, void 0, function* () {
            for (;;) {
                yield delay(clean_interval);
                if (!isRunning())
                    break;
                this.clean();
            }
            stopping();
        });
        if (this.clean_interval)
            new pollerloop_1.Pollerloop(polling).start();
        return new Proxy(this, {
            get: function (target, field, receiver) {
                try {
                    const subscript = queue_1.parseNatural(field);
                    target.clean();
                    return target.q[subscript].element;
                }
                catch (e) {
                    return Reflect.get(target, field, receiver);
                }
            }
        });
    }
    clean() {
        const now = Date.now();
        this.q.shiftWhile(r => {
            if (r.time < now - this.ttl) {
                if (this.onShift)
                    this.onShift(r.element, r.time);
                return true;
            }
            else
                return false;
        });
    }
    push(...elems) {
        this.clean();
        const time = Date.now();
        const rs = elems.map((element) => ({
            element, time,
        }));
        this.q.push(...rs);
        return this;
    }
    pushWithTime(...rs) {
        this.clean();
        this.q.push(...rs);
        return this;
    }
    [Symbol.iterator]() {
        this.clean();
        return lodash_1.default.map(this.q, r => r.element)[Symbol.iterator]();
    }
    clear() {
        this.q.clear();
        return this;
    }
    get length() {
        this.clean();
        return this.q.length;
    }
}
exports.TtlQueue = TtlQueue;
exports.default = TtlQueue;
//# sourceMappingURL=index.js.map