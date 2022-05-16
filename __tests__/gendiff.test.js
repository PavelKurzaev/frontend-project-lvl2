// @ts-check
import { test, expect } from '@jest/globals';
import { compareObjects } from '../gendiff.js';

const res1 = '{\n}';
const res2 = '{\n  - name: vasya\n}';
const res3 = '{\n  + name: vasya\n}';

test('test empty', () => {
    expect(compareObjects([], [])).toEqual(res1);
    expect(compareObjects([["name", "vasya"]], [])).toEqual(res2);
    expect(compareObjects([], [["name", "vasya"]])).toEqual(res3);
});

test('same key', () => {
    const obj1 = [
        ["node", "hexlet"],
        ["ip", "192.172.15.1"],
        ["version", "1.0"]
    ];
    const obj2 = [
        ["node", "hexlet"],
        ["ip", "192.172.15.1"],
        ["version", "1.1"]
    ];
    const res = '{\n    node: hexlet\n    ip: 192.172.15.1\n  - version: 1.0\n  + version: 1.1\n}';

    expect(compareObjects(obj1, obj2)).toEqual(res);
});


