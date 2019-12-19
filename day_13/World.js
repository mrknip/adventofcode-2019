module.exports = function (width, height, CONFIG) {
  const emptyCells = () => Array.from({ length: height })
    .fill('')
    .map(() => Array.from({ length: width }).fill(CONFIG.TILES.EMPTY));

  return {
    cells: emptyCells(),
    width: 0,
    height: 0,
    blockCount: 0,
    score: 0,
    ball: {},
    paddle: {},
    frames: [],

    update() {
      this.frames.push({cells: this.cells, score: this.score});
      this.cells = JSON.parse(JSON.stringify(this.cells));

      this.add(this.ball.x, this.ball.y, CONFIG.TILES.EMPTY);
      this.add(this.paddle.x, this.paddle.y, CONFIG.TILES.EMPTY);
    },

    add(x,y,content) {
      if (content === CONFIG.TILES.BLOCK) {
        this.blockCount++;
      }

      if (
        content === CONFIG.TILES.EMPTY &&
          this.cells[y][x] === CONFIG.TILES.BLOCK
      ) {
        this.blockCount--;
      }

      if (content === CONFIG.TILES.BALL) {
        this.ball.x = x;
        this.ball.y = y;
      }

      if (content === CONFIG.TILES.PADDLE) {
        this.paddle.x = x;
        this.paddle.y = y;
      }

      this.cells[y][x] = content;
    },

    render(rawCells) {
      const cells = rawCells || this.cells;

      let outString = '';

      cells.forEach((row) => {
        row.forEach((cell) => {
          outString += CONFIG.DISPLAY[cell];

        });
        outString += '\n';
      });

      console.log(outString);
    },

    renderFrame(frames) {
      if (!frames.length) return;

      console.clear();
      this.render(frames[0].cells);
      console.log(`Score: ${frames[0].score}`);
      setTimeout(() => this.renderFrame(frames.slice(1)), 50);
    },

    animate() {
      this.renderFrame(this.frames);
    }
  };
};
