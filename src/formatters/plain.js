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

const printPlain = (result, parent = '') => {
  const strArray = [];
  result.reduce((acc, elem, index, array) => {
    const hasMinus = array.filter((e) => (e.key === elem.key && e.action === '-'));
    const hasPlus = array.filter((e) => (e.key === elem.key && e.action === '+'));
    const value = makeValue(elem.value);

    switch (elem.action) {
    case '+':
      if (hasMinus.length === 0) {
        acc.push(`Property '${parent}${elem.key}' was added with value: ${value}`);
      } else {
        const minusValue = makeValue(hasMinus[0].value);
        acc.push(`Property '${parent}${elem.key}' was updated. From ${minusValue} to ${value}`);
      }
      break;
    case '-':
      if (hasPlus.length === 0) {
        acc.push(`Property '${parent}${elem.key}' was removed`);
      }
      break;
    }
    if (Array.isArray(elem.value)) {
      const plainArray = printPlain(elem.value, `${parent}${elem.key}.`);
      acc.push([...plainArray]);
    }
    return acc;
  }, strArray);
  return strArray;
};

export { printPlain };
