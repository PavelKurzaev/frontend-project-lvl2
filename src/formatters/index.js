import  printStylish  from './stylish.js';
import  printPlain  from './plain.js';
import  printJSON  from './json.js';

const printResult = (result, outputStyle) => {
  switch (outputStyle) {
    case 'json':
      return printJSON(result);
    case 'plain':
      return printPlain(result);
    default:
      return printStylish(result);
  }
}

export default printResult;