import { printStylish } from './stylish.js';
import { printPlain } from './plain.js';
import { printJSON } from './json.js';

const printResult = (result, outputStyle) => {
  switch (outputStyle) {
  case 'json':
    return printJSON(result).flat(10).join('\n');
  case 'plain':
    return printPlain(result).flat(10).join('\n');
  case 'stylish':
  default:
    return printStylish(result);
  }
}

export { printResult };