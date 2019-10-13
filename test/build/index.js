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
const __1 = __importDefault(require("../.."));
const ava_1 = __importDefault(require("ava"));
const assert_1 = __importDefault(require("assert"));
const lodash_1 = __importDefault(require("lodash"));
const bluebird_1 = __importDefault(require("bluebird"));
ava_1.default('test queue', t => {
    const q = new __1.default();
    q.push(1);
    assert_1.default.deepStrictEqual([...q], [1]);
    q.push(2, 3, 4, 5, 6, 7, 8);
    assert_1.default.deepStrictEqual([...q], [1, 2, 3, 4, 5, 6, 7, 8]);
    assert_1.default(q.shift(1).shift(1)[-1] === 8);
    assert_1.default.deepStrictEqual([...q], [3, 4, 5, 6, 7, 8]);
    q.shiftWhile(x => x < 5);
    assert_1.default.deepStrictEqual([...q], [5, 6, 7, 8]);
    assert_1.default(q[0] === 5);
    assert_1.default(q[q.length - 1] === 8);
    assert_1.default.deepStrictEqual(lodash_1.default.takeWhile(q, x => x < 8), [5, 6, 7]);
    assert_1.default.deepStrictEqual(lodash_1.default.takeRightWhile(q, x => x > 5), [6, 7, 8]);
});
ava_1.default('test ttl', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const q = new __1.default(2000);
    q.push(1);
    yield bluebird_1.default.delay(1000);
    q.push(2);
    yield bluebird_1.default.delay(500);
    assert_1.default.deepStrictEqual([...q], [1, 2]);
    yield bluebird_1.default.delay(1000);
    assert_1.default.deepStrictEqual([...q], [2]);
}));
//# sourceMappingURL=index.js.map