const Reset = '\x1b[0m';
const Bright = '\x1b[1m';
const Dim = '\x1b[2m';
const Underscore = '\x1b[4m';
const Blink = '\x1b[5m';
const Reverse = '\x1b[7m';
const Hidden = '\x1b[8m';

const FgBlack = '\x1b[30m';
const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
const FgYellow = '\x1b[33m';
const FgBlue = '\x1b[34m';
const FgMagenta = '\x1b[35m';
const FgCyan = '\x1b[36m';
const FgWhite = '\x1b[37m';

const BgBlack = '\x1b[40m';
const BgRed = '\x1b[41m';
const BgGreen = '\x1b[42m';
const BgYellow = '\x1b[43m';
const BgBlue = '\x1b[44m';
const BgMagenta = '\x1b[45m';
const BgCyan = '\x1b[46m';
const BgWhite = '\x1b[47m';

const OBJECTS = {
  ASTEROID: '#',
};

function getNthAsteroid(gridData, baseCoords, n, { render, renderOrder } = {}) {
  const asteroids = getAsteroids(gridData);

  const renderOutputs = [];
  const gridWidth = gridData.split('\n')[0].length;
  const [ baseX, baseY ] = baseCoords;

  const linesFromBasePoint = {};
  let renderOutput = gridData;
  // TODO: there has ro
  let gradsRight = [];
  let gradsLeft = [];

  // set up the map of asteroids on each line
  for (let coords in asteroids) {
    const [ asteroidX, asteroidY ] = coords.split(',').map(toInt);
    if (asteroidX === baseX && asteroidY === baseY) continue;

    const vector = [ asteroidX - baseX, baseY - asteroidY ];
    const manhattanDistance = Math.abs(vector[0]) + Math.abs(vector[1]);
    const gradient = vector[1] / vector[0];

    const vectorDirection = vector.map(n => Math.sign(n));
    const vectorString = [ `x:${vectorDirection[0] || 1},g:${gradient}`].join(',');

    if (vectorDirection[0] >= 0) {
      if (!gradsRight.includes(gradient)) gradsRight.push(gradient);
    } else {
      if (!gradsLeft.includes(gradient)) gradsLeft.push(gradient);
    }
    // const vectorStr = vector.join('');
    if (!linesFromBasePoint[vectorString]) {
      linesFromBasePoint[vectorString] = {
        [manhattanDistance]: coords,
      };
    } else {
      linesFromBasePoint[vectorString] = {
        ...linesFromBasePoint[vectorString],
        [manhattanDistance]: coords,
      };
    }
  }

  gradsRight.sort((a,b) => a > b ? -1 : 1);
  gradsLeft.sort((a,b) => a > b ? -1 : 1);

  let totalGradientLength = gradsRight.length + gradsLeft.length;
  let count = 0;
  let interval = 0;
  let result;

  // loop through the lines
  while (count < (n || totalGradientLength) && totalGradientLength) {
    let vx;
    let gradients;
    let gradientIndex;
    const cycle = (count % 9) + 1;

    let vectors = {};
    let vectorKey;

    const loopedInterval = interval % totalGradientLength;

    // check left or right side?
    if (loopedInterval < gradsRight.length) {
      vx = 1;
      gradients = gradsRight;
      gradientIndex = loopedInterval;
    } else {
      vx = -1;
      gradients = gradsLeft;
      gradientIndex = loopedInterval - gradsRight.length;
    }
    const gradToTry = gradients[gradientIndex];
    vectorKey = `x:${vx},g:${gradToTry}`;
    vectors = linesFromBasePoint[vectorKey];

    // If that line is empty
    // remove the gradient so we don't check it again
    // adjust the interval so it is still relatively correct
    if (!Object.keys(vectors).length) {
      console.log('skipping');
      gradients.splice(loopedInterval, 1);

      totalGradientLength--;

      if (totalGradientLength === 0) {

        if (render) {
          renderOutputs.push(renderOutput);
        }
        break;
      }


      continue;
    }


    const nearestDistance = Math.min(...Object.keys(vectors).map(toInt));
    const coords = linesFromBasePoint[vectorKey][nearestDistance];

    const numericCoords = stringToPoint(coords);
    const renderOutputIndex = +numericCoords[0] + (numericCoords[1] * (gridWidth + 1));

    if (render) {
      renderOutput = renderOutput.substr(0, renderOutputIndex) + `${cycle}` + renderOutput.substr(renderOutputIndex + 1);
    }

    if (count === n - 1) {
      result = coords;
      if (render) {
        renderOutputs.push(renderOutput);
      }
      break;
    }

    delete linesFromBasePoint[vectorKey][nearestDistance];

    if (render && cycle === 9) {
      renderGrid(renderOutput, asteroids, baseCoords);
      renderOutputs.push(renderOutput);
      renderOutput = renderOutput.replace(/[1-9]/g, '.');
    }


    count++;
    interval++;
  }

  if (render) {
    renderGrid(renderOutput, asteroids, baseCoords);
    return renderOutputs;
  } else {
    return result;
  }
}

function getMaxVisibility(gridData) {
  const asteroids = getAsteroids(gridData);

  for (let coords in asteroids) {  // loop in a loop!
    const asteroidCoord = stringToPoint(coords);
    asteroids[asteroidCoord].visible = getAsteroidCount(asteroids, asteroidCoord);
  }
  const max = Object.values(asteroids).map(a => a.total).reduce((a,b) => Math.max(a,b), 0);
  const basePoint = Object.keys(asteroids)
    .find((coord) => asteroids[coord].total === max);

  console.log({basePoint});
  renderGrid(gridData, asteroids, stringToPoint(basePoint));
  return max;
}


function getAsteroids(gridData) {
  const grid = gridData.split('\n').map(row => row.split(''));
  const asteroids = {};
  console.log(grid.length);
  // Build asteroid register
  grid.forEach((row, yIndex) => {
    row.forEach((cell, xIndex) => {
      if (grid[yIndex][xIndex] === OBJECTS.ASTEROID) {
        asteroids[`${xIndex},${yIndex}`] = {
          visible: 0,
        };
      }
    });
  });

  return asteroids;
}

/**
 * Get the visible
 * @param  {[type]} gridData [description]
 * @param  {[type]} point    [description]
 * @return {[type]}          [description]
 */
function getAsteroidCount(asteroids, point, returnData) {
  const [baseX, baseY] = point;
  const basePositionString = point.join(',');

  const vectorCounts = {};

  for (let coords in asteroids) {
    const [ asteroidX, asteroidY ] = coords.split(',').map(toInt);

    if (asteroidX === baseX && asteroidY === baseY) continue;

    const vector = [ asteroidX - baseX, asteroidY - baseY ];
    const gradient = vector[1] / vector[0];
    const vectorDirection = vector.map(n => Math.sign(n));
    const vectorString = [ vectorDirection[0], vectorDirection[1], gradient ];

    if (!vectorCounts[vectorString]) vectorCounts[vectorString] = 0;
    vectorCounts[vectorString] += 1;
  }

  const total = Object.keys(vectorCounts).length;

  asteroids[basePositionString] = {
    ...asteroids[basePositionString],
    total,
    vectorCounts,
  };

  if (returnData) {
    return asteroids[basePositionString];
  }
  return asteroids[basePositionString].total;
}


const toInt = v => +v;
const stringToPoint = (string) => string.split(',').map(toInt);

const logJson = (logged, name) => {
  Object.keys(logged).forEach((name) => {
    thisObj = logged[name];

    console.log(name, JSON.stringify(thisObj, null, 2));
  });
};

function renderGrid(gridData, asteroids, basePoint) {
  const grid = gridData.split('\n').map(row => row.split(''));
  const gridWidth = grid[0].length;
  let outStr = '\n/' + Array(gridWidth + 2).fill('-').join('') + '\\\n';

  let basePointStr = basePoint.join(',');


  grid.forEach((row, yIndex) => {
    outStr += '| ';
    row.forEach((cell, xIndex) => {

      const coordString = [xIndex, yIndex].join(',');

      if (coordString === basePointStr) outStr += `${BgWhite}${FgBlack}B${Reset}`;
      else if ('123456789'.indexOf(cell) > -1) outStr += `${Bright}${cell}${Reset}`;
      else if (cell === '#' && asteroids[coordString]) outStr += `${FgRed}#${Reset}`;
      else outStr += `${BgBlack} ${Reset}`;
    });

    outStr += ' |';
    outStr += '\n';
  });


  outStr += '\\' + Array(gridWidth + 2).fill('-').join('') + '/';
  outStr += '\n';
  console.log(outStr);
}

module.exports = {
  getAsteroids,
  getAsteroidCount,
  getMaxVisibility,
  getNthAsteroid,
};
