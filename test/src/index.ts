import TtlQueue from '../..';
import test from 'ava';
import assert from 'assert';
import _ from 'lodash';
import Bluebird from 'bluebird';

test('test queue', t => {
    const q = new TtlQueue<number>();
    q.push(1);
    assert.deepStrictEqual([...q], [1]);
    q.push(2, 3, 4, 5, 6, 7, 8);
    assert.deepStrictEqual([...q], [1, 2, 3, 4, 5, 6, 7, 8]);
});

test('test ttl', async t => {
    const q = new TtlQueue<number>(2000);
    q.push(1);
    await Bluebird.delay(1000);
    q.push(2);
    await Bluebird.delay(500);
    assert.deepStrictEqual([...q], [1, 2]);
    await Bluebird.delay(1000);
    assert.deepStrictEqual([...q], [2]);
});