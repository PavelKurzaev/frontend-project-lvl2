const makeValue = (object) => {
  if (object === null) return null;
  if (typeof object === 'string') return `'${object}'`;
  if (typeof object === 'object') return '[complex value]';
  return object;
};

const printPlain = (array, parent = '') => {
  const mapped = array.filter((e) => e.action !== 'same').map((elem) => {
    const value = makeValue(elem.value);
    switch (elem.action) {
      case 'add':
        return `Property '${parent}${elem.key}' was added with value: ${value}`;
      case 'different':
        return `Property '${parent}${elem.key}' was updated. From ${makeValue(elem.oldValue)} to ${value}`;
      case 'delete':
        return `Property '${parent}${elem.key}' was removed`;
      case 'nested':
        return `${printPlain(elem.children, `${parent}${elem.key}.`)}`;
      default:
        return `error action`;
      }
  });
  return mapped.join('\n');
};

export default printPlain;
