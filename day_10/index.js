const Reset = '\x1b[0m';
const Bright = '\x1b[1m';
const FgBlack = '\x1b[30m';
const FgRed = '\x1b[31m';
const BgBlack = '\x1b[40m';
const BgWhite = '\x1b[47m';

const OBJECTS = {
  ASTEROID: '#',
};

function getNthAsteroid(gridData, baseCoords, n, { render } = {}) {
  const asteroids = getAsteroids(gridData);
  const gridWidth = gridData.split('\n')[0].length;
  const [ baseX, baseY ] = baseCoords;
  const renderOutputs = [];
  let result;


  const linesFromBasePoint = {};
  let renderOutput = gridData;
  let gradsRight = new Set();
  let gradsLeft = new Set();

  // set up the map of asteroids on each line
  for (let coords in asteroids) {
    const [ asteroidX, asteroidY ] = coords.split(',').map(toInt);
    if (asteroidX === baseX && asteroidY === baseY) continue;

    const vector = [ asteroidX - baseX, baseY - asteroidY ];
    const distance = Math.abs(vector[0]) + Math.abs(vector[1]);
    const gradient = vector[1] / vector[0];

    const vectorDirection = vector.map(n => Math.sign(n));
    const vectorString = `x:${vectorDirection[0] || 1},g:${gradient}`;

    if (vectorDirection[0] >= 0) {
      gradsRight.add(gradient);
    } else {
      gradsLeft.add(gradient);
    }

    if (!linesFromBasePoint[vectorString]) {
      linesFromBasePoint[vectorString] = { [distance]: coords };
    } else {
      linesFromBasePoint[vectorString] = {
        ...linesFromBasePoint[vectorString],
        [distance]: coords,
      };
    }
  }

  gradsRight = [...gradsRight].sort((a,b) => a > b ? -1 : 1).map(g => `x:1,g:${g}`);
  gradsLeft = [...gradsLeft].sort((a,b) => a > b ? -1 : 1).map(g => `x:-1,g:${g}`);

  const gradients = gradsRight.concat(gradsLeft);

  let count = 0;
  let gradientIndex = 0;

  // loop through the lines
  while (count < n) {
    const cycle = (count % 9) + 1;
    const relativeGradientIndex = gradientIndex % gradients.length;
    const vectorKey = gradients[relativeGradientIndex];
    const vectors = linesFromBasePoint[vectorKey];

    const noAsteroidsOnThisLine = !Object.keys(vectors).length;
    if (noAsteroidsOnThisLine) {
      // remove the gradient so we don't check it again
      gradients.splice(relativeGradientIndex, 1);
      // adjust the gradientIndex so it is still relatively correct
      gradientIndex--;

      if (!gradients.length) {
        if (render) renderOutputs.push(renderOutput);
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

      if (cycle === 9) {
        renderGrid(renderOutput, asteroids, baseCoords);
        renderOutputs.push(renderOutput);
        renderOutput = renderOutput.replace(/[1-9]/g, '.');
      }
    }

    delete linesFromBasePoint[vectorKey][nearestDistance];

    result = coords;
    count++;
    gradientIndex++;

    if (count === n) {
      if (render) {
        renderOutputs.push(renderOutput);
      }
      break;
    }
  }

  // We're done
  if (render) {
    renderGrid(renderOutput, asteroids, baseCoords);
    return renderOutputs;
  } else {
    return result;
  }
}

function getAsteroids(gridData) {
  const grid = gridData.split('\n').map(row => row.split(''));
  const asteroids = {};

  // Build asteroid register
  grid.forEach((row, yIndex) => {
    row.forEach((cell, xIndex) => {
      if (grid[yIndex][xIndex] === OBJECTS.ASTEROID) {
        asteroids[`${xIndex},${yIndex}`] = {};
      }
    });
  });

  return asteroids;
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

  renderGrid(gridData, asteroids, stringToPoint(basePoint));
  return max;
}


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
