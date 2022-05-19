//import _ from 'lodash';

const makeValue = (object) => {
  if (object === null) return null;
  if (typeof object === 'string') return `'${object}'`;
  if (typeof object === 'object') return '[complex value]';
  return object;
}

const printToArray = (array, parent = '') => {
  const mapped = array.map((elem) => {
    const value = makeValue(elem.value);
    switch (elem.action) {
      case 'add':
        return `Property '${parent}${elem.key}' was added with value: ${value}`;
      case 'different':
        return `Property '${parent}${elem.key}' was updated. From ${makeValue(elem.oldValue)} to ${value}`;
      case 'delete':
        return `Property '${parent}${elem.key}' was removed`;
      case 'nested':
        return `${printToArray(elem.children, `${parent}${elem.key}.`)}`;
      default:
        break;
    }
  });
  return mapped.join('\n');
};

const printPlain = (diff) => printToArray(diff).join('\n');

export default printPlain;
