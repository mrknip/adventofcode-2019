
const Reset = "\x1b[0m";
const Bright = "\x1b[1m";
const Dim = "\x1b[2m";
const Underscore = "\x1b[4m";
const Blink = "\x1b[5m";
const Reverse = "\x1b[7m";
const Hidden = "\x1b[8m";

const FgBlack = "\x1b[30m";
const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const FgYellow = "\x1b[33m";
const FgBlue = "\x1b[34m";
const FgMagenta = "\x1b[35m";
const FgCyan = "\x1b[36m";
const FgWhite = "\x1b[37m";

const BgBlack = "\x1b[40m";
const BgRed = "\x1b[41m";
const BgGreen = "\x1b[42m";
const BgYellow = "\x1b[43m";
const BgBlue = "\x1b[44m";
const BgMagenta = "\x1b[45m";
const BgCyan = "\x1b[46m";
const BgWhite = "\x1b[47m";

const PIXELS = {
  BLACK: '0',
  WHITE: '1',
  TRANSPARENT: '2',
}

const RENDERED_PIXELS = {
  [PIXELS.BLACK]: ' ',
  [PIXELS.WHITE]:`${Bright}${BgBlue} ${Reset}`,
  [PIXELS.TRANSPARENT]: ' ',
}

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

function decodeImage(input, w, h, render = true) {
  const layers = getLayers(input, w, h);
  const layerData = Object.values(layers);
  const image = Array(w * h)
    .fill(PIXELS.TRANSPARENT)
    .map((pixel, ci) => layerData
      .map(layer => layer[ci])
      .find((layerPx) => layerPx !== PIXELS.TRANSPARENT)
    });

  if (render) { // renders for CLI - shouldn't be here really
    let renderedImage = '';

    for (let i = 0; i <= h * w; i += w) {
      renderedImage += image
        .slice(i, i + w)
        .map(px => RENDERED_PIXELS[px])
        .join('') + '\n';
    }

    return renderedImage;
  }
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
  decodeImage,
}
