#!/usr/bin/env node

import { Command } from 'commander';
import { cwd } from 'process';
import { resolve } from 'path';
import { readFileSync } from 'node:fs';
import _ from 'lodash';

const program = new Command();

const INDENT = '  ';

const compareFiles = (file1, file2) => {
  const str1 = readFileSync(resolve(cwd(), file1), { encoding:'ascii', flag:'r' });
  const str2 = readFileSync(resolve(cwd(), file2), { encoding:'ascii', flag:'r' });
  
  const obj1 = _.sortBy(Object.entries(JSON.parse(str1)), (o) => o[0]);
  const obj2 = _.sortBy(Object.entries(JSON.parse(str2)), (o) => o[0]);
  
  const result = [];
  result.push('{');

  let i2 = 0;
  let [name2, value2] = obj2[0];

  for (const [name1, value1] of obj1) {
    if (i2 < obj2.length) {
      [name2, value2] = obj2[i2];
      while (i2 < obj2.length && name1.localeCompare(name2) > 0) {
        result.push(`${INDENT} + ${name2}: ${value2}`);
        i2 += 1;
      }
    }
    if (name1.localeCompare(name2) < 0) {
      result.push(`${INDENT} - ${name1}: ${value1}`);
    } else if (name1.localeCompare(name2) === 0) {
      if (value1 == value2) {
        result.push(`${INDENT}   ${name1}: ${value1}`);
      } else {
        result.push(`${INDENT} - ${name1}: ${value1}`);
        result.push(`${INDENT} + ${name2}: ${value2}`);
      }
      i2 += 1;
    }
  }
 
  while (i2 < obj2.length) {
    [name2, value2] = obj2[i2];
    result.push(`${INDENT} + ${name2}: ${value2}`);
    i2 += 1;
  }

  result.push('}');
  return result.join('\n');
};

program.name('gendiff')
  .description('Compares two configuration files and shows a difference')
  .version('0.1.0')
  .argument('<filepath1>').argument('<filepath2>')
  .option('-f, --format <type>', 'output format')
  .action((filepath1, filepath2) => console.log(compareFiles(filepath1, filepath2)));

program.parse();

export default compareFiles;