// @ts-check
import { test, expect } from '@jest/globals';
import genDiff from '../src/gendiff.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);

/*
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
*/
test('gendiff file recursive yaml plain', () => {
  const expected = readFileSync(getFixturePath('result3.txt'), 'utf-8');

  const result = genDiff(getFixturePath('file11.json'), getFixturePath('file12.yml'), 'plain');
  expect(result).toEqual(expected);
});

test('gendiff file recursive json', () => {
  const result = genDiff(getFixturePath('file11.json'), getFixturePath('file12.yml'), 'json');
  expect(() => JSON.parse(result)).not.toThrow();
});
