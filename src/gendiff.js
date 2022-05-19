import _ from 'lodash';
import { cwd } from 'process';
import path, { resolve } from 'path';
import { readFileSync } from 'fs';
import jsYaml from 'js-yaml';

import printResult from './formatters/index.js';

const compareObjects = (obj1, obj2) => {
  const union = _.union(Object.keys(obj1), Object.keys(obj2));

  const result = union.map((key) => {
    const val1 = obj1[key];
    const val2 = obj2[key];
    if (val1 === undefined) {
      return { key, action: 'add', value: val2 };
    }
    if (val2 === undefined) {
      return { key, action: 'delete', value: val1 };
    }
    if (_.isObject(val1) && _.isObject(val2)) {
      return { key, action: 'nested', children: compareObjects(val1, val2) };
    }
    if (val1 === obj2[key]) {
      return { key, action: 'same', value: val1 };
    }
    return { key, 
      action: 'different', 
      oldValue: val1, 
      value: val2 
    };
  });
  return _.sortBy(result, (e) => e.key);
};

const parseStr = (str, type) => {
  if (type === '.jsn' || type === '.json') {
    return JSON.parse(str);
  }
  if (type === '.yml' || type === '.yaml') {
    return jsYaml.load(str);
  }
  return null;
};

const genDiff = (file1, file2, outputStyle) => {
  const str1 = readFileSync(resolve(cwd(), file1), { encoding: 'ascii', flag: 'r' });
  const str2 = readFileSync(resolve(cwd(), file2), { encoding: 'ascii', flag: 'r' });

  const obj1 = parseStr(str1, path.parse(file1).ext);
  const obj2 = parseStr(str2, path.parse(file2).ext);

  const objCompRes = compareObjects(obj1, obj2);

  return printResult(objCompRes, outputStyle);
};

export default genDiff;
