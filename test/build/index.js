"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
const ava_1 = require("ava");
const assert = require("assert");
const _ = require("lodash");
const Bluebird = require("bluebird");
(0, ava_1.default)('test array', async (t) => {
    const q = __1.TtlQueue.create(Number.POSITIVE_INFINITY, Date.now);
    q.push(1);
    assert.deepStrictEqual([...q], [1]);
    _.range(2, 9).forEach(q.push.bind(q));
    assert.deepStrictEqual([...q], [1, 2, 3, 4, 5, 6, 7, 8]);
});
(0, ava_1.default)('test ttl array', async (t) => {
    const q = __1.TtlQueue.create(2000, Date.now);
    q.push(1);
    await Bluebird.delay(1000);
    q.push(2);
    await Bluebird.delay(500);
    assert.deepStrictEqual([...q], [1, 2]);
    await Bluebird.delay(1000);
});
(0, ava_1.default)('test ttl queue', async (t) => {
    const q = __1.TtlQueue.create(2000, Date.now);
    q.push(1);
    await Bluebird.delay(1000);
    q.push(2);
    await Bluebird.delay(500);
    assert(q(0) === 1);
    assert(q(1) === 2);
    assert.deepStrictEqual([...q], [1, 2]);
    await Bluebird.delay(1000);
});
//# sourceMappingURL=index.js.map