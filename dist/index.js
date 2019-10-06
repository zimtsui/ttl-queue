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
exports.parseInt = queue_1.parseInt;
const pollerloop_1 = require("pollerloop");
const lodash_1 = __importDefault(require("lodash"));
class TtlQueue {
    constructor(ttl = Number.POSITIVE_INFINITY, clean_interval = ttl) {
        this.length = {};
        const q = new queue_1.Queue();
        const polling = (stopping, isRunning, delay) => __awaiter(this, void 0, void 0, function* () {
            for (;;) {
                yield delay(clean_interval);
                if (!isRunning())
                    break;
                const now = Date.now();
                q.shiftWhile(r => r.time < now - ttl);
            }
            stopping();
        });
        if (Number.isFinite(clean_interval))
            new pollerloop_1.Pollerloop(polling).start();
        return new Proxy({}, {
            get: function (target, field, receiver) {
                if (field === 'push')
                    return function (...args) {
                        const time = Date.now();
                        const rs = lodash_1.default.map(args, element => ({
                            element, time,
                        }));
                        q.push(...rs);
                        return receiver;
                    };
                if (field === 'shiftWhile')
                    return function (pred) {
                        q.shiftWhile(r => pred(r.element));
                        return receiver;
                    };
                if (field === Symbol.iterator)
                    return lodash_1.default.map(q, r => r.element)[Symbol.iterator];
                try {
                    const subscript = queue_1.parseInt(field);
                    return q[subscript].element;
                }
                catch (e) {
                    // console.log(field);
                    const member = Reflect.get(q, field, q);
                    if (typeof member === 'function')
                        return function (...args) {
                            const returnValue = member(...args);
                            if (returnValue === q)
                                return receiver;
                            else
                                return returnValue;
                        };
                    else
                        return member;
                }
            }
        });
    }
    push(...elems) { return {}; }
    shift(num = 1) { return {}; }
    shiftWhile(pred) { return {}; }
    [Symbol.iterator]() { return {}; }
    clear() { return {}; }
}
exports.TtlQueue = TtlQueue;
exports.default = TtlQueue;
//# sourceMappingURL=index.js.map