const INDENT = '    ';

const printStylish = (result, level = 0) => {
    const strArray = [];
    strArray.push(`{`);
    result.reduce((acc, elem) => {
      if (Array.isArray(elem.value)) {
        acc.push(`${INDENT.repeat(level)}  ${elem.action} ${elem.key}: ${printStylish(elem.value, level + 1)}`);
      } else {
        acc.push(`${INDENT.repeat(level)}  ${elem.action} ${elem.key}: ${elem.value}`);
      }
      return acc;
    }, strArray);
    if (level === 0) strArray.push('}');
    else strArray.push(`${INDENT.repeat(level)}}`)
    return strArray.join('\n');
  };
  
  export { printStylish };