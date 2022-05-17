#!/usr/bin/env node

const INDENT = '  ';

const compareObjects = (obj1, obj2) => {
  const result = [];

  obj1.map((elem) => {
    const [key, value] = elem;
    const found = obj2.filter((elem2) => elem2[0] === key && elem2[1] === value).length;
    if (found === 1) { 
      result.push({ action: ' ', key, value });
    } else {
      result.push({ action: '-', key, value });
    }
  });

  obj2.map((elem) => {
    const [key, value] = elem;
    const found = obj1.filter((elem1) => elem1[0] === key && elem1[1] === value).length;
    if (found !== 1) {
      result.push({ action: '+', key, value });
    }
  });

  result.sort((a, b) => {
    if (a.key < b.key) return -1;
    if (a.key === b.key) return a.action > b.action ? -1 : 1;
    return 1;
  });

  return result;
};

const printResult = (result) => {
  const strArray = [];
  strArray.push('{');
  result.reduce((acc, elem) => {
    acc.push(`${INDENT}${elem.action} ${elem.key}: ${elem.value}`);
    return acc;
  }, strArray);
  strArray.push('}');
  return strArray.join('\n');
};

import { cwd } from 'process';
import path, { resolve } from 'path';
import { readFileSync } from 'node:fs';
import { load as YAMLparse } from 'js-yaml';

const genDiff = (file1, file2) => {
  const str1 = readFileSync(resolve(cwd(), file1), { encoding:'ascii', flag:'r' });
  const str2 = readFileSync(resolve(cwd(), file2), { encoding:'ascii', flag:'r' });

  const parseStr = (str, type) => {
    let obj;
    switch (type) {
      case '.jsn':
      case '.json':
        obj = Object.entries(JSON.parse(str));
        break;
      case '.yml':
      case '.yaml':
        obj = Object.entries(YAMLparse(str));
        break;
      default:
        break;
    }
    return obj;
  }

  const obj1 = parseStr(str1, path.parse(file1).ext);
  const obj2 = parseStr(str2, path.parse(file2).ext);

  return printResult(compareObjects(obj1, obj2));
};

export { genDiff, compareObjects, printResult };
