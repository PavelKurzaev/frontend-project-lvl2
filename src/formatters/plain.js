import _ from 'lodash';

const makeValue = (object) => {
  if (object === null) return null;

  let value;
  switch (typeof object) {
    case 'string': 
      value = `'${object}'`;
      break;
    case 'object':
      value = '[complex value]';
      break;
    default:
      value = object
  }
  return value;
}

const printToArray = (array, parent = '') => {
  const strArray = [];

  array.reduce((acc, elem) => {
    const value = makeValue(elem.value);
    switch (elem.action) {
      case 'add':
        acc.push(`Property '${parent}${elem.key}' was added with value: ${value}`);
        break;
      case 'different':
        acc.push(`Property '${parent}${elem.key}' was updated. From ${makeValue(elem.oldValue)} to ${value}`);
        break;
      case 'delete':
        acc.push(`Property '${parent}${elem.key}' was removed`);
        break;
      case 'nested':
        acc.push([...printToArray(elem.children, `${parent}${elem.key}.`)]);
        break;
    }
    return acc;
  }, strArray);
  return _.flatten(strArray);
};

const printPlain = (diff) => printToArray(diff).join('\n');

export { printPlain };
