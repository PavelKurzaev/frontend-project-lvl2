// @ts-check
import { test, expect } from '@jest/globals';
import { genDiff, compareObjects, printResult } from '../src/calcdiff.js';

test('test objects empty', () => {
  const res1 = '{\n}';
  const res2 = '{\n  - name: vasya\n}';
  const res3 = '{\n  + name: vasya\n}';

  expect(printResult(compareObjects([], []))).toEqual(res1);
  expect(printResult(compareObjects([["name", "vasya"]], []))).toEqual(res2);
  expect(printResult(compareObjects([], [["name", "vasya"]]))).toEqual(res3);
});

test('objects same key unsorted', () => {
  const obj1 = [
    ["node", "hexlet1"],
    ["ip", "192.172.15.1"],
    ["version", "1.0"]
  ];
  const obj2 = [
    ["node", "hexlet2"],
    ["ip", "192.172.15.1"],
    ["version", "1.1"]
  ];
  const res = '{\n    ip: 192.172.15.1\n  - node: hexlet1\n  + node: hexlet2\n  - version: 1.0\n  + version: 1.1\n}';

  expect(printResult(compareObjects(obj1, obj2))).toEqual(res);
});

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);

test('gendiff file test json', () => {
  const expected = readFileSync(getFixturePath('result.txt'), 'utf-8');

  const result = genDiff(getFixturePath('file1.json'), getFixturePath('file2.json'));
  expect(result).toEqual(expected);
});

test('gendiff file test yaml', () => {
  const expected = readFileSync(getFixturePath('result.txt'), 'utf-8');

  const result = genDiff(getFixturePath('file1.yaml'), getFixturePath('file2.json'));
  expect(result).toEqual(expected);
});

test('gendiff file recursive', () => {
  const expected = readFileSync(getFixturePath('result2.txt'), 'utf-8');

  const result = genDiff(getFixturePath('file11.json'), getFixturePath('file12.json'));
  expect(result).toEqual(expected);
});

test('gendiff file recursive yaml', () => {
  const expected = readFileSync(getFixturePath('result2.txt'), 'utf-8');

  const result = genDiff(getFixturePath('file11.json'), getFixturePath('file12.yml'));
  expect(result).toEqual(expected);
});
