const program = require('./data');
const { IntcodeProgram } = require('../intcode');
const { BgWhite, FgRed, Bright, Reset} = require('../common/colours');

const DIRECTIONS = {
  NORTH: 0,
  WEST: 1,
  SOUTH: 2,
  EAST: 3,
};

const DIRECTION_OUTPUT = {
  0: '^',
  1: '<',
  2: 'v',
  3: '>',
};

const COLOURS = {
  WHITE: 1,
  BLACK: 0,
};

const COLOUR_OUTPUT = {
  [COLOURS.WHITE]: `${BgWhite}#${Reset}`,
  [COLOURS.BLACK]: '.',
};


/**
 * Intcode runner
 * @param  {[type]} panel [description]
 * @return {[type]}       [description]
 */
function processPanel(panel = 0, { render = false } = {}) {
  const processor = new IntcodeProgram(program);

  let commands = [];
  let count = 0;

  let grid = {};
  let robotOrientation = 0;
  let robotPosition = [0,0];
  let maxX = -Infinity;
  let maxY = -Infinity;

  if (panel === 1) {
    grid['0,0'] = 1;
  }


  while (true) {
    // console.log({previousColour});
    let result;
    const currentPanel = grid[robotPosition.join(',')];
    if (currentPanel) {
      result = processor.run(currentPanel);
    } else {
      result = processor.run(panel);
    }

    // console.log({result});
    // if (count === 2) {
    //   break;
    // }
    count++;

    if (result) {
      const [colour, direction]  = result;
      const newState = applyCommand({ colour, direction}, grid, robotPosition, robotOrientation);
      grid = newState.grid;
      robotPosition = newState.robotPosition;
      robotOrientation = newState.robotOrientation;

      const [robotX, robotY] = robotPosition;
      maxX = Math.max(Math.abs(robotX), maxX);
      maxY = Math.max(Math.abs(robotY), maxY);

      commands.push({colour, direction});
    } else {
      // renderGrid(grid, robotPosition, robotOrientation, {width: maxX * 2 + 1, height: maxY * 2 + 1});

      // console.log({count});
      break;
    }
  }

  if (render) {
    renderCommands(commands);
  }

  return commands;
}

function renderCommands(commands) {
  let grid = {};
  let robotOrientation = 0;
  let robotPosition = [0,0];
  let maxX = -Infinity;
  let maxY = -Infinity;
  let index = 0;

  const renderCommand = (index) => {
    const command = commands[index];

    if (!command) return;

    const { colour, direction } = command;
    const newState = applyCommand({ colour, direction}, grid, robotPosition, robotOrientation);
    grid = newState.grid;
    robotPosition = newState.robotPosition;
    robotOrientation = newState.robotOrientation;

    const [robotX, robotY] = robotPosition;
    maxX = Math.max(Math.abs(robotX), maxX);
    maxY = Math.max(Math.abs(robotY), maxY);

    renderGrid(grid, robotPosition, robotOrientation, { width: maxX + 1, height: 2*maxY + 1, start: [0,0]});

    ++index;
    setTimeout(() => renderCommand(index), 50);
  };

  renderCommand(index);
}

/**
 * Spits out ascii grid
 * @param  {[type]} commands     [description]
 * @param  {Object} [options={}] [description]
 * @return {[type]}              [description]
 */
function renderGrid(gridData, robotPosition, robotOrientation, options = {}) {
  const { width, height, start } = options;
  const grid = new Array(height).fill('').map(() => new Array(width).fill('.'));
  const anchorX = start ? start[0] : Math.floor(width / 2);
  const anchorY = start ? start[1] : Math.floor(height / 2);

  console.log({anchorX, anchorY});
  const robot = `${FgRed}${Bright}${DIRECTION_OUTPUT[robotOrientation]}${Reset}`;
  const robotX = anchorX + robotPosition[0];
  const robotY = anchorY + robotPosition[1];

  Object.keys(gridData)
    .map((coord => coord.split(',').map(n=>+n)))
    .forEach((coord) => {
      const [col, row] = coord;
      const colour = gridData[coord.join(',')];

      grid[anchorY + row][anchorX + col] = COLOUR_OUTPUT[colour];
    });


  if (grid[robotY][robotX] === COLOUR_OUTPUT[COLOURS.WHITE]) {
    grid[robotY][robotX] = BgWhite + robot;
  } else {
    grid[robotY][robotX] = robot;
  }
  const string = grid
    .filter(row => row.find(cell => cell !== '.'))
    .map(row => row.join('')).join('\n');

  console.clear();
  console.log(string, robotPosition);

  return grid.map(row => row.join('')).join('\n') + '\n\n';
}

function applyCommand(command, prevGrid, prevRobotPosition, prevRobotOrientation) {
  const { colour, direction } = command;
  const grid = { ...prevGrid };
  const robotPosition = [...prevRobotPosition];
  let robotOrientation;

  grid[robotPosition.join(',')] = colour;

  // Turn the robot
  if (direction === 0) { // turn left
    robotOrientation = prevRobotOrientation + 1;
    if (robotOrientation > 3) {
      robotOrientation = 0;
    }
  } else if (direction === 1) {
    robotOrientation = prevRobotOrientation - 1;
    if (robotOrientation < 0) {
      robotOrientation = 3;
    }
  }

  // Move the robot
  switch (robotOrientation) {
  case DIRECTIONS.NORTH:
    robotPosition[1] -= 1;
    break;

  case DIRECTIONS.WEST:
    robotPosition[0] -= 1;
    break;

  case DIRECTIONS.SOUTH:
    robotPosition[1] += 1;
    break;

  case DIRECTIONS.EAST:
    robotPosition[0] += 1;
    break;
  }

  return {
    robotPosition,
    robotOrientation,
    grid,
  };
}


function getGridState(commands = [], options = {}) {
  const {returnPanelCount } = options;

  let grid = {};
  let robotPosition = [0,0];
  let robotOrientation = 0;

  commands.forEach((command) => {
    const newState = applyCommand(command, grid, robotPosition, robotOrientation);
    grid = newState.grid;
    robotPosition = newState.robotPosition;
    robotOrientation = newState.robotOrientation;
  });


  if (returnPanelCount) {
    const points = Object.keys(grid).map(point => point.split(',').map(n=>+n));
    return points.length;
  }

  return {
    robotOrientation,
    robotPosition,
    grid,
  };
}

if (module) {
  module.exports = {
    processPanel,
    renderGrid,
    getGridState,
  };

}
