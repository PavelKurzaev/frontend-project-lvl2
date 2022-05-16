#!/usr/bin/env node

import _ from 'lodash';

const INDENT = '  ';

const compareObjects = (obj1, obj2) => {
  const result = [];
  result.push('{');

  const listObject = (obj, symbol = ' ') => {
    obj.map((elem) => result.push(`${INDENT}${symbol} ${elem[0]}: ${elem[1]}`));
  };
  
  if (obj1.length === 0 && obj2.length === 0) return '{\n}';
  if (obj1.length === 0 && obj2.length !== 0) {
    listObject(obj2, '+');
  } else if (obj1.length !== 0 && obj2.length === 0) {
    listObject(obj1, '-');
  } else {
    let i2 = 0;
    let [name2, value2] = obj2[0];

    for (const [name1, value1] of obj1) {
      if (i2 < obj2.length) {
        [name2, value2] = obj2[i2];
        while (i2 < obj2.length && name1.localeCompare(name2) > 0) {
          result.push(`${INDENT}+ ${name2}: ${value2}`);
          i2 += 1;
        }
      }
      if (name1.localeCompare(name2) < 0) {
        result.push(`${INDENT}- ${name1}: ${value1}`);
      } else if (name1.localeCompare(name2) === 0) {
        if (value1 == value2) {
          result.push(`${INDENT}  ${name1}: ${value1}`);
        } else {
          result.push(`${INDENT}- ${name1}: ${value1}`);
          result.push(`${INDENT}+ ${name2}: ${value2}`);
        }
        i2 += 1;
      }
    }
  
    while (i2 < obj2.length) {
      [name2, value2] = obj2[i2];
      result.push(`${INDENT}+ ${name2}: ${value2}`);
      i2 += 1;
    }
  }

  result.push('}');
  return result.join('\n');
};

import { cwd } from 'process';
import { resolve } from 'path';
import { readFileSync } from 'node:fs';

const genDiff = (file1, file2) => {
  const str1 = readFileSync(resolve(cwd(), file1), { encoding:'ascii', flag:'r' });
  const str2 = readFileSync(resolve(cwd(), file2), { encoding:'ascii', flag:'r' });
  
  const obj1 = _.sortBy(Object.entries(JSON.parse(str1)), (o) => o[0]);
  const obj2 = _.sortBy(Object.entries(JSON.parse(str2)), (o) => o[0]);
  
  return compareObjects(obj1, obj2);
};

export { genDiff, compareObjects };