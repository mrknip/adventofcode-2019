const DIRECTIONS = {
  U: {x: 0, y: -1},
  D: {x: 0, y: 1},
  L: {x: -1, y: 0},
  R: {x: 1, y: 0},
}

function getManhattanDistanceToStartFromIntersection(start, pathA, pathB) {
  const intersections = getIntersections(start, pathA, pathB);

  return intersections
    .map(i => Math.abs(i.x - start.x) + Math.abs(i.y - start.y))
    .reduce((max, v) => (max === null ? v : Math.min(max, v)), null)
}

function getIntersections(start, pathA, pathB) {
  console.log('hiA');
  const aPoints = generatePoints(start, pathA);
  console.log('hiB');
  const bPoints = generatePoints(start, pathB);
  console.log('intersections');
  // let intersections = []
  const aPointLength = aPoints.length;
  // aPoints.forEach((pointA) => {
  //   if (!bPoints.find(pointB => pointsEqual(pointA, pointB))) {
  //
  //   }
  // })
  const intersections = aPoints
    .filter((pointA, i) => {
    console.log('pointA index ', i, '/', aPointLength);
    return bPoints.findIndex(pointB => {
      if (pointB.x !== pointA.x) return false;
      if (pointB.y !== pointA.y) return false;
      return true;
    }) > -1
  })
  console.log({intersections});

  return intersections.filter(point => !pointsEqual(start, point));

  // return intersections;
}

function generatePoints (start, path) {
  return path
    .map(parseInstruction)
    .reduce((points, instruction) => {
      // const newPoints = points.map(p => clone(p));
      const newPoints = points;
      const currentLocation = clone(points[points.length - 1]);
      const unitVector = DIRECTIONS[instruction.direction]

      times(instruction.quantity, (i) => {
        // console.log(instruction.quantity, i);
        currentLocation.x += unitVector.x
        currentLocation.y += unitVector.y

        newPoints.push({x: currentLocation.x, y: currentLocation.y})
      });
      return newPoints;
    }, [
      start
    ]
  );
}

function parseInstruction(instruction) {
  const trimmedInstruction = instruction.trim();
  return {
    direction: trimmedInstruction[0],
    quantity: parseInt(trimmedInstruction.slice(1), 10),
  }
}

function pointsEqual (pointA, pointB) {
  return (
    pointB.x === pointA.x &&
    pointB.y === pointA.y
  );
}

function times (n, cb) {

  return Array(n).fill('').forEach((_, i) => cb(i));
}

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}

function parsePuzzleData(data) {
  return data.split('\n')
    .map(path => path.split(','))
}


module.exports = {
  getIntersections,
  generatePoints,
  parseInstruction,
  getManhattanDistanceToStartFromIntersection,
  parsePuzzleData
}
