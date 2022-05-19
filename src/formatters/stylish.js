import _ from 'lodash';

const INDENT = 4;

const printObject = (obj, level = 0) => {
  const res = [];
  const indent = ' '.repeat(level * INDENT);

  res.push('{');
  const mapped = Object.keys(obj).map((key) => {
    if (_.isObject(obj[key])) {
      return `${indent}    ${key}: ${printObject(obj[key], level + 1)}`;
    } else {
      return `${indent}    ${key}: ${obj[key]}`;
    }
  }); 
  res.push(mapped.join('\n'));
  res.push(`${indent}}`);
  return res.join('\n');
};

const printToArray = (array, level = 0) => {
  const indent = ' '.repeat(level * INDENT);
  const makeValue = (value) => _.isObject(value) ? printObject(value, level + 1) : value;

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
    }
    return `action error`;
  });

  return strArray.join('\n');
};

const printStylish = (diff) => {
  const res = [];
  res.push('{');
  res.push(printToArray(diff));
  res.push('}');
  return res.join('\n');
}

export default printStylish;
