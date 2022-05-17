#!/usr/bin/env node
import _ from 'lodash';

const INDENT = '    ';
/*
const printArrayPairs = (obj) => {
  const res = [];
  res.push('[');

  obj.map((elem) => {
    res.push('[');
    res.push(`${elem[0]},`);
    if (Array.isArray(elem[1])) res.push(printArrayPairs(elem[1]));
    else res.push(`${elem[1]}`);
    res.push('], ');
  });

  res.push('] ');
  return res.join(' ');
};
*/
const compareObjects = (obj1, obj2) => {
  const result = [];

  obj1.map((elem) => {
    const [key, value] = elem;
    const found = obj2.filter((elem2) => elem2[0] === key);
    if (Array.isArray(value)) {
      if (found.length === 1 && Array.isArray(found[0][1])) {
        result.push({ action: ' ', key, value: compareObjects(value, found[0][1])});
      } else {
        result.push({ action: '-', key, value: compareObjects(value, value) });
      }
    } else {
      if (found.length === 1 && value === found[0][1]) {
        result.push({ action: ' ', key, value });
      } else {
        result.push({ action: '-', key, value });
      }
    }
  });

  obj2.map((elem) => {
    const [key, value] = elem;
    const found = obj1.filter((elem1) => elem1[0] === key);
    if (Array.isArray(value)) {
      if (found.length !== 1 || !Array.isArray(found[0][1])) {
        result.push({ action: '+', key, value: compareObjects(value, value)});
      }
    } else {
      if (found.length !== 1 || value !== found[0][1]) {
        result.push({ action: '+', key, value });
      }
    }
  });

  result.sort((a, b) => {
    if (a.key < b.key) return -1;
    if (a.key === b.key) return a.action > b.action ? -1 : 1;
    return 1;
  });

  return result;
};

const printResult = (result, level = 0) => {
  const strArray = [];
  strArray.push(`{`);
  result.reduce((acc, elem) => {
    if (Array.isArray(elem.value)) {
      acc.push(`${INDENT.repeat(level)}  ${elem.action} ${elem.key}: ${printResult(elem.value, level + 1)}`);
    } else {
      acc.push(`${INDENT.repeat(level)}  ${elem.action} ${elem.key}: ${elem.value}`);
    }
    return acc;
  }, strArray);
  if (level === 0) strArray.push('}');
  else strArray.push(`${INDENT.repeat(level)}}`)
  return strArray.join('\n');
};

import { cwd } from 'process';
import path, { resolve } from 'path';
import { readFileSync } from 'node:fs';
import { load as YAMLparse } from 'js-yaml';

const genDiff = (file1, file2) => {
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

  const objectToArray = (o) => Object.entries(o).map((e) => {
    if (_.isObject(e[1])) e[1] = objectToArray(e[1]);
    return e;
  });

  const parseObject = (object) => {
    return object.map((elem) => _.isObject(elem[1]) ? [elem[0], [...objectToArray(elem[1])]] : elem);
  };

  const str1 = readFileSync(resolve(cwd(), file1), { encoding:'ascii', flag:'r' });
  const str2 = readFileSync(resolve(cwd(), file2), { encoding:'ascii', flag:'r' });

  const obj1 = parseObject(parseStr(str1, path.parse(file1).ext));
  const obj2 = parseObject(parseStr(str2, path.parse(file2).ext));
  /*
  console.log('object1', printArrayPairs(obj1));
  console.log('object2', printArrayPairs(obj2));
  */
  const objCompRes = compareObjects(obj1, obj2);
  return printResult(objCompRes);
};

export { genDiff, compareObjects, printResult };
