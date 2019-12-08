function corruptionCheck(input, w, h) {
  const layers = getLayers(input, w, h);

  let result = 0;
  let minZeroCount = Number.POSITIVE_INFINITY;

  Object.values(layers).forEach((layer) => {
    const zeroCount = getCharCount(layer, '0');
    if (zeroCount < minZeroCount) {
      result = getCharCount(layer, '1') * getCharCount(layer, '2');
      minZeroCount = zeroCount
    }
  });

  return result;
}

function getLayers (input, w, h) {
  let workingInput = input;
  const layers = {}
  let layerId = 1;
  let rowId = 1;
  while(workingInput.length) {

    const rowString = workingInput.substr(0, w);

    layers[layerId] = layers[layerId] || '';
    layers[layerId] += rowString;

    if (rowId === h) {
      rowId = 1;
      layerId += 1
    } else {
      rowId += 1;
    }

    workingInput = workingInput.slice(w);
  }

  return layers;
}

function getCharCount(string, char) {
  return string
    .split('')
    .filter(c => c === `${char}`)
    .length;
}


module.exports = {
  getLayers,
  getCharCount,
  corruptionCheck,
}
