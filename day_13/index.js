const { IntcodeProgram } = require('../intcode');
const { FgRed, FgGreen, Bright, Reset} = require('../common/colours');
const intcode = require('./data');
const World = require('./World');

const TILE_IDS = {
  EMPTY: 0,
  WALL: 1,
  BLOCK: 2,
  PADDLE: 3,
  BALL: 4,
};

const CONFIG = {
  TILES: TILE_IDS,
  DISPLAY: {
    [TILE_IDS.EMPTY]: ' ',
    [TILE_IDS.WALL]: '■',
    [TILE_IDS.BLOCK]: `${Bright}${FgGreen}x${Reset}`,
    [TILE_IDS.PADDLE]: `${Bright}=${Reset}`,
    [TILE_IDS.BALL]: `${FgRed}o${Reset}`,
  }
};

module.exports = {
  renderGame: function () {
    const breakout = new IntcodeProgram(intcode);
    breakout.memory[0] = 2;

    let result;
    let command = 0;
    const world = new World(44,24,CONFIG);

    while (true) {
      result = breakout.run(command);

      for (let i = 2; i < result.length; i += 3) {

        const x = result[i - 2];
        const y = result[i - 1];
        const tileId = result[i];

        if (x === -1) {
          world.score = tileId;
        }

        world.add(x, y, tileId);
      }

      if (world.paddle.x < world.ball.x) command = 1;
      if (world.paddle.x > world.ball.x) command = -1;
      if (world.paddle.x === world.ball.x) command = 0;

      world.update();
      if (world.blockCount === 0) break;
    }

    world.animate();
  }
};
