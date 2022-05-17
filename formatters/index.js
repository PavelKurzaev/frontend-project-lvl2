import { printStylish } from './stylish.js';

const printResult = (result, outputStyle) => {
  switch (outputStyle) {
  case 'fancy':
    break;
  case 'stylish':
  default:
    return printStylish(result);
  }
}

export { printResult };