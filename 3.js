const DIRECTIONS = {
  U: {x: 0, y: -1},
  D: {x: 0, y: 1},
  L: {x: -1, y: 0},
  R: {x: 1, y: 0},
}

function stringPoint(point) {
  return `${point.x},${point.y}`;
}

function getManhattanDistanceToStartFromIntersection(start, pathA, pathB) {
  const intersections = getIntersections(start, pathA, pathB);

  // const aPoints = generatePoints(start, pathA);
  // const intersections = []
  //
  // console.log({});
  // forEachPointOnPath(start, pathB, (pointB) => {
  //   if (aPoints.findIndex(pointA => pointsEqual(pointA, pointB)) > -1) {
  //     if (!pointsEqual(pointB, start)) {
  //       intersections.push(pointB)
  //     }
  //   }
  // })

  console.log({intersections});
  return intersections
    .map(i => i.split(',').map(v => +v))
    .map(i => Math.abs(i[0] - start.x) + Math.abs(i[1] - start.y))
    .reduce((max, v) => (max === null ? v : Math.min(max, v)), null)
}

function forEachPointOnPath(start, path, cb) {
  const currentLocation = { ...start }
  return path
    .map(parseInstruction)
    .forEach((instruction) => {
      const unitVector = DIRECTIONS[instruction.direction]

      times(instruction.quantity, (i) => {
        // console.log(instruction.quantity, i);
        currentLocation.x += unitVector.x
        currentLocation.y += unitVector.y

        cb({...currentLocation});
      });
    });
}

function getIntersections(start, pathA, pathB) {
  console.log('hiA');
  const aPoints = generatePoints(start, pathA);
  console.log('hiB');
  const bPoints = generatePoints(start, pathB);

  const allPoints = aPoints.concat(bPoints);
  const stringStart = stringPoint(start);
  // return allPoints
  //   .filter((point, i) => {
  //     console.log(`${i + 1} of ${allPoints.length}`);
  //     return allPoints.indexOf(point) !== i;
  //   })
  //   .filter(point => point !== stringStart);
  console.log('intersections');
  // let intersections = []
  const aPointLength = aPoints.length;
  // aPoints.forEach((pointA) => {
  //   if (!bPoints.find(pointB => pointsEqual(pointA, pointB))) {
  //
  //   }
  // })
  const intersections = aPoints.filter((pointA, i) => {
    console.log(`pointA ${i + 1} of ${aPoints.length}`);
    return bPoints.indexOf(pointA) > -1;
  })
  console.log({intersections});

  return intersections;

  // return intersections;
}

function generatePoints (start, path) {
  let currentLocation = { ...start };
  return path
    .map(parseInstruction)
    .reduce((points, instruction) => {
      // const newPoints = points.map(p => clone(p));
      const newPoints = points;
      // const currentLocation = points[points.length - 1].splt();
      const unitVector = DIRECTIONS[instruction.direction]

      times(instruction.quantity, (i) => {
        // console.log(instruction.quantity, i);
        currentLocation.x += unitVector.x
        currentLocation.y += unitVector.y

        newPoints.push(stringPoint(currentLocation))
      });
      return newPoints;
    }, [
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
