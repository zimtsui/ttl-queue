import {
    createTtlQueue,
} from '../..';
import test from 'ava';
import assert = require('assert');
import _ = require('lodash');
import Bluebird = require('bluebird');

test('test array', async t => {
    const q = createTtlQueue<number>(
        Number.POSITIVE_INFINITY,
        Date.now,
    );
    q.push(1);
    assert.deepStrictEqual([...q], [1]);
    _.range(2, 9).forEach(q.push.bind(q));
    assert.deepStrictEqual([...q], [1, 2, 3, 4, 5, 6, 7, 8]);
});

test('test ttl array', async t => {
    const q = createTtlQueue<number>(
        2000,
        Date.now,
    );
    q.push(1);
    await Bluebird.delay(1000);
    q.push(2);
    await Bluebird.delay(500);
    assert.deepStrictEqual([...q], [1, 2]);
    await Bluebird.delay(1000);
});

test('test ttl queue', async t => {
    const q = createTtlQueue<number>(
        2000,
        Date.now,
    );
    q.push(1);
    await Bluebird.delay(1000);
    q.push(2);
    await Bluebird.delay(500);
    assert(q(0) === 1);
    assert(q(1) === 2);
    assert.deepStrictEqual([...q], [1, 2]);
    await Bluebird.delay(1000);
});
