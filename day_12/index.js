const fs = require('fs');
const readline = require('readline');
const DATA_PATH = __dirname + '/data.txt';
const data = fs.readFileSync(__dirname + '/data.txt', 'utf8');

function main() {
  const startingPositions = parseDataFile(data);
  const startingVelocities = Array(4).fill('').map(() => ({ x: 0, y: 0, z: 0}));

  const state = startingPositions.reduce((out, position, index) => ({
    ...out,
    [index]: {
      position,
      velocity: startingVelocities[index],
    }
  }), {});
  // console.log(state);
  step(state);
  // console.log(state);
}

function toStateString(state, axes = ['x', 'y', 'z']) {
  const parts = [];
  for (let moon in state) {
    parts.push(Object.values(state[moon].position).join(''));
    parts.push(Object.values(state[moon].velocity).join(''));
  }
  return parts.join('');
}

function moonToString(moon) {
  return [
    Object.values(moon.position).join(''),
    Object.values(moon.velocity).join('')
  ].join('');
}

function System(startingState) {
  const startingPositions = parseDataFile(startingState);
  const startingVelocities = Array(4).fill('').map(() => ({ x: 0, y: 0, z: 0}));

  const state = startingPositions.reduce((out, position, index) => ({
    ...out,
    [index]: {
      position,
      velocity: startingVelocities[index],
    }
  }), {});

  this.startingState = JSON.parse(JSON.stringify(state));
  this.startingStateString = toStateString(state);
  this.startingMoonStateStrings = {
    0: moonToString(state[0]),
    1: moonToString(state[1]),
    2: moonToString(state[2]),
    3: moonToString(state[3]),
  };
  this.state = state;
}


System.prototype.findFirstRepeatedState = function () {
  const axisIntervals = {};
  let found = false;
  let stepNumber = 1;

  while(!found) {
    this.step();

    const moons = Object.values(this.state);

    ['x', 'y', 'z'].forEach((axis) => {
      if (
        !axisIntervals[axis] &&
        !moons.find((moon, index) => (
          moon.position[axis] !== this.startingState[index].position[axis] ||
          moon.velocity[axis] !== 0
        ))
      ) {
        axisIntervals[axis] = stepNumber;

      }
    });


    stepNumber++;

    if (Object.keys(axisIntervals).length === 3) {
      break;
    }
  }
  const lowestCommonMultiple = lcmArray(Object.values(axisIntervals));

  return lowestCommonMultiple;
};

System.prototype.step = function (count = 1) {
  for (let i = 0; i < count; ++i) {
    step(this.state);
  }
};

System.prototype.getTotalEnergy = function () {
  let total =0;
  for (let moon in this.state) {
    const pe = Object.values(this.state[moon].position)
      .map(v=> Math.abs(v))
      .reduce((a,b)=>a+b);
    const ke = Object.values(this.state[moon].velocity)
      .map(v=> Math.abs(v))
      .reduce((a,b)=>a+b);

    total += pe * ke;
  }

  return total;
};

function step(state, axes = ['x', 'y', 'z']) {
  //todo immutabilise this
  const moons = Object.keys(state);

  // calc velocity
  const checked = [];
  moons.forEach((moon) => {
    const { position } = state[moon];
    const otherMoons = moons
      .filter(n => n !== moon)
      .filter(n => !checked.includes(n));
    checked.push(moon);

    otherMoons.forEach((otherMoon) => {
      const { position: otherPosition } = state[otherMoon];
      axes.forEach((axis) => {
        if (position[axis] > otherPosition[axis]) {
          state[moon].velocity[axis] += -1;
          state[otherMoon].velocity[axis] += 1;
        }
        if (position[axis] < otherPosition[axis]) {
          state[moon].velocity[axis] += 1;
          state[otherMoon].velocity[axis] += -1;
        }
      });
    });
  });

  // update position
  moons.forEach((moon) => {
    axes.forEach((axis) => state[moon].position[axis] += state[moon].velocity[axis]);
  });
}

function parseDataFile(data) {
  return data.split('\n')
    .map(position => position.replace('>', ''))
    .map(position => position.replace('<', ''))
    .filter(position => position.length)
    .map(position => position.split(',')
      .map(prop => prop.trim())
      .map(prop => prop.split('='))
      .reduce((out, propPair) => ({ ...out, [propPair[0]]: +propPair[1] }), {})
    );
}

// Totally cheated here
const gcd = (a, b) => a ? gcd(b % a, a) : b;
const lcm = (a, b) => a * b / gcd(a, b);


function lcmArray(array) {
  return array.reduce((out, el) => lcm(out, el), 1);
}

module.exports = { System };

main();
