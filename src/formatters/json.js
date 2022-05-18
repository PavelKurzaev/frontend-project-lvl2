const makeValue = (object) => typeof object === 'object' ? '[complex value]' : String(object);

const printJSON = (result) => {
    const res = [];
    res.push('[');
    res.push([...printJSON1(result)]);
    res.push(']');
    return res;
};

const printJSON1 = (result, parent = '') => {
  const strArray = [];
  result.reduce((acc, elem, index, array) => {
    const hasMinus = array.filter((e) => (e.key === elem.key && e.action === '-'));
    const hasPlus = array.filter((e) => (e.key === elem.key && e.action === '+'));
    const value = makeValue(elem.value);
    const coma = index === (array.length - 1) ? '' : ',';
    
    switch (elem.action) {
    case '+':
      if (hasMinus.length === 0) {
        acc.push(`{ "property": "${parent}${elem.key}", "action": "add", "value": "${value}" }${coma}`);
      } else {
        const minusValue = makeValue(hasMinus[0].value);
        acc.push(`{ "property": "${parent}${elem.key}", "action": "update", "old value": "${minusValue}", "value": "${value}" }${coma}`);
      }
      break;
    case '-':
      if (hasPlus.length === 0) {
        acc.push(`{ "property": "${parent}${elem.key}", "action": "remove" }${coma}"`);
      }
      break;
    }
    if (Array.isArray(elem.value)) {
      const plainArray = printJSON1(elem.value, `${parent}${elem.key}.`);
      acc.push([...plainArray]);
    }
    return acc;
  }, strArray);
  return strArray;
};

export { printJSON };
