const DIRECTIONS = {
  U: {x: 0, y: -1},
  D: {x: 0, y: 1},
  L: {x: -1, y: 0},
  R: {x: 1, y: 0},
}

function stringPoint(point) {
  return `${point.x},${point.y}`;
}

function getShortestSteps(start, pathA, pathB) {
  const {intersection, steps} = getIntersections(start, pathA, pathB);

    let out;

    return steps
      .map((_, index) => steps[index])
      .map(steps => steps[0] + steps[1])
      .reduce((max, v) => (max === null ? v : Math.min(max, v)), null)
}

function getManhattanDistanceToStartFromIntersection(start, pathA, pathB) {
  const {intersection, steps} = getIntersections(start, pathA, pathB);

  return [...intersection]
    .map(i => i.split(',').map(v => +v))
    .map(i => Math.abs(i[0] - start.x) + Math.abs(i[1] - start.y))
    .reduce((max, v) => (max === null ? v : Math.min(max, v)), null)
}

function getIntersections(start, pathA, pathB) {
  const aPoints = generatePoints(start, pathA);
  const bPoints = generatePoints(start, pathB);
  const aPointsSet = new Set(generatePoints(start, pathA));
  const bPointsSet = new Set(generatePoints(start, pathB));
  const intersection = new Set();

  const steps = [];
  for (let p of aPointsSet) {
    if (bPointsSet.has(p)) {
      intersection.add(p);

      steps.push([
        aPoints.indexOf(p) + 1,
        bPoints.indexOf(p) + 1
      ])
    }
  }

  return { intersection, steps};
}

function generatePoints (start, path) {
  let currentLocation = { ...start };
  return path
    .map(parseInstruction)
    .reduce((points, instruction) => {
      const newPoints = points;
      const unitVector = DIRECTIONS[instruction.direction]

      times(instruction.quantity, (i) => {
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
  parsePuzzleData,
  getShortestSteps,
}
