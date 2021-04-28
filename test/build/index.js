import { TtlQueue, } from '../../dist/index';
import test from 'ava';
import assert from 'assert';
import _ from 'lodash';
import Bluebird from 'bluebird';
test('test array', async (t) => {
    const q = new TtlQueue({
        ttl: Number.POSITIVE_INFINITY,
    }, setTimeout, clearTimeout, Date.now);
    await q.start(err => { if (err)
        t.log(err); });
    q.push(1);
    assert.deepStrictEqual([...q], [1]);
    _.range(2, 9).forEach(q.push.bind(q));
    assert.deepStrictEqual([...q], [1, 2, 3, 4, 5, 6, 7, 8]);
    await q.stop();
});
test('test ttl array', async (t) => {
    const q = new TtlQueue({
        ttl: 2000,
        cleaningInterval: 100,
    }, setTimeout, clearTimeout, Date.now);
    await q.start(err => { if (err)
        t.log(err); });
    q.push(1);
    await Bluebird.delay(1000);
    q.push(2);
    await Bluebird.delay(500);
    assert.deepStrictEqual([...q], [1, 2]);
    await Bluebird.delay(1000);
    await q.stop();
});
test('test ttl queue', async (t) => {
    const q = new TtlQueue({
        ttl: 2000,
        cleaningInterval: 100,
    }, setTimeout, clearTimeout, Date.now);
    await q.start(err => { if (err)
        t.log(err); });
    q.push(1);
    await Bluebird.delay(1000);
    q.push(2);
    await Bluebird.delay(500);
    assert(q[0] === 1);
    assert(q[1] === 2);
    assert.deepStrictEqual([...q], [1, 2]);
    await Bluebird.delay(1000);
    await q.stop();
});
test('test ttl queue realtime', async (t) => {
    const q = new TtlQueue({
        ttl: 2000,
    }, setTimeout, clearTimeout, Date.now);
    await q.start(err => { if (err)
        t.log(err); });
    q.push(1);
    await Bluebird.delay(1000);
    q.push(2);
    await Bluebird.delay(500);
    assert(q[0] === 1);
    assert(q[1] === 2);
    assert.deepStrictEqual([...q], [1, 2]);
    await Bluebird.delay(1000);
    await q.stop();
});
//# sourceMappingURL=index.js.map