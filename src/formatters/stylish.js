import _ from 'lodash';

const INDENT = 4;

const printObject = (obj, level = 0) => {
  const indent = ' '.repeat(level * INDENT);

  const mapped = Object.keys(obj).map((key) => {
    if (_.isObject(obj[key])) {
      return `${indent}    ${key}: ${printObject(obj[key], level + 1)}`;
    }
    return `${indent}    ${key}: ${obj[key]}`;
  });
  return `{\n${mapped.join('\n')}\n${indent}}`;
};

const printToArray = (array, level = 0) => {
  const indent = ' '.repeat(level * INDENT);
  const makeValue = (value) => (_.isObject(value) ? printObject(value, level + 1) : value);

  const strArray = array.map((elem) => {
    const value = makeValue(elem.value);
    switch (elem.action) {
      case 'add':
        return `${indent}  + ${elem.key}: ${value}`;
      case 'same':
        return `${indent}    ${elem.key}: ${value}`;
      case 'different':
        return `${indent}  - ${elem.key}: ${makeValue(elem.oldValue)}\n${indent}  + ${elem.key}: ${value}`;
      case 'delete':
        return `${indent}  - ${elem.key}: ${value}`;
      case 'nested':
        return `${indent}    ${elem.key}: {\n${printToArray(elem.children, level + 1)}\n${indent}    }`;
      default:
        return 'action error';
    }
  });

  return strArray.join('\n');
};

const printStylish = (diff) => `{\n${printToArray(diff)}\n}`;

export default printStylish;
