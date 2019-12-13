const { expect } = require('chai');
const { getAsteroids, getAsteroidCount, getMaxVisibility, getNthAsteroid, showNAsteroids }  = require('./index');
const data = require('./data');

const makeMap = str => str.trim().split('\n').map(row => row.trim()).join('\n');

describe.skip('day 10', () => {
  describe('getAsteroidCount', () => {
    it('detects adjacent asteroids on the horizontal', () => {
      const input = makeMap(`
##
..`);

      const result = getAsteroidCount(getAsteroids(input), [0,0]);
      expect(result).to.equal(1);
    });

    it('detects adjacent asteroids on the horizontal', () => {
      const input = makeMap(`
.#
.#`);
      const result = getAsteroidCount(getAsteroids(input), [1,0]);
      expect(result).to.equal(1);
    });

    it('detects adjacent asteroids on the diagonal', () => {
      const input = makeMap(`
.#
#.`);
      const result = getAsteroidCount(getAsteroids(input), [1,0]);
      expect(result).to.equal(1);
    });

    it('detects adjacent asteroids on non-1 vectors', () => {
      const input = makeMap(`
.#
..
#.`);
      const result = getAsteroidCount(getAsteroids(input), [1,0]);
      expect(result).to.equal(1);
    });

    it('detects and ignores obscured asteroids', () => {
      const input = makeMap(`
.#
.#
.#`);
      const result = getAsteroidCount(getAsteroids(input), [1,0]);
      expect(result).to.equal(1);
    });

    it('detects and ignores obscured asteroids in multiple directions', () => {
      const input = makeMap(`
###
#..
#..`);
      const result = getAsteroidCount(getAsteroids(input), [0,0]);
      expect(result).to.equal(2);
    });

    it('detects and ignores obscured asteroids in opposite directions', () => {
      const input = makeMap(`
#####`);
      const result = getAsteroidCount(getAsteroids(input), [2,0]);
      expect(result).to.equal(2);
    });
  });

  describe('getBase', () => {
    it('solves test case 1', () => {
      const input = makeMap(`
.#..#
.....
#####
....#
...##`);

      const result = getMaxVisibility(input);

      expect(result).to.equal(8);
    });

    it('solves test case 2', () => {
      const input = makeMap(`
......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####`);

      const result = getMaxVisibility(input);

      expect(result).to.equal(33);
    });

    it('solves test case 3', () => {
      const input = makeMap(`
#.#...#.#.
.###....#.
.#....#...
##.#.#.#.#
....#.#.#.
.##..###.#
..#...##..
..##....##
......#...
.####.###.`);

      const result = getMaxVisibility(input);

      expect(result).to.equal(35);
    });

    it('solves test case 4', () => {
      const input = makeMap(`
.#..#..###
####.###.#
....###.#.
..###.##.#
##.##.#.#.
....###..#
..#.#..#.#
#..#.#.###
.##...##.#
.....#.#..`);

      const result = getMaxVisibility(input);

      expect(result).to.equal(41);
    });

    it('solves test case 4', () => {
      const input = makeMap(`
.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`);

      const result = getMaxVisibility(input);

      expect(result).to.equal(210);
    });

    it('solves puzzle', () => {
      const result = getMaxVisibility(makeMap(data));
      expect(result).to.equal(340);
    });
  });

  describe('getNthAsteroid', () => {
    it('returns the nearest due north first', () => {
      const input = makeMap(`
.#.
.#.
...
  `);
      const result = getNthAsteroid(input, [1,1], 1);
      expect(result).to.equal('1,0');
    });

    it('runs clockwise', () => {
      const input = makeMap(`
.#.
.##
...
  `);

      // getNthAsteroid(getAsteroids(input), [1,1]);
      const resultA = getNthAsteroid(input, [1,1], 1);
      const resultB = getNthAsteroid(input, [1,1], 2);
      expect(resultA).to.equal('1,0');
      expect(resultB).to.equal('2,1');
    });


    it('handles test case 1', () => {
      const input = makeMap(`
.#....#####...#..
##...##.#####..##
##...#...#.#####.
..#.....X...###..
..#.#.....#....##
  `);

      const expected = makeMap(`
.#....###24...#..
##...##.13#67..9#
##...#...5.8####.
..#.....X...###..
..#.#.....#....##
  `);

      const expected2 = makeMap(`
.#....###.....#..
##...##...#.....#
##...#......1234.
..#.....X...5##..
..#.9.....8....76`);

      const expected3 = makeMap(`
.8....###.....#..
56...9#...#.....#
34...7...........
..2.....X....##..
..1..............
  `);

      const expected4 = makeMap(`
......234.....6..
......1...5.....7
.................
........X....89..
.................`);


      const base = [8, 3];

      const images = getNthAsteroid(input, base, 36, { render: true });

      expect(images[0]).to.equal(expected);
      expect(images[1]).to.equal(expected2);
      expect(images[2]).to.equal(expected3);
      expect(images[3]).to.equal(expected4);
    });

    it('handles blocked lines', () => {
      const input = makeMap(`
  .#.
  .##
  .#.
  `);

      const expected = makeMap(`
  .3.
  .12
  .#.
  `);

      const base = [1, 2];

      const images = getNthAsteroid(input, base, 9, { render: true });
      expect(images[0]).to.equal(expected);

    });

    it('handles test case 2', () => {
      const input = makeMap(`
  .#..##.###...#######
  ##.############..##.
  .#.######.########.#
  .###.#######.####.#.
  #####.##.#.##.###.##
  ..#####..#.#########
  ####################
  #.####....###.#.#.##
  ##.#################
  #####.##.###..####..
  ..######..##.#######
  ####.##.####...##..#
  .#####..#.######.###
  ##...#.##########...
  #.##########.#######
  .####.#.###.###.#.##
  ....##.##.###..#####
  .#.#.###########.###
  #.#.#.#####.####.###
  ###.##.####.##.#..##`);

      const base = [11,13];

      expect(getNthAsteroid(input, base, 1)).to.equal('11,12');
      expect(getNthAsteroid(input, base, 2)).to.equal('12,1');
      expect(getNthAsteroid(input, base, 199)).to.equal('9,6');
      expect(getNthAsteroid(input, base, 200)).to.equal('8,2');
      expect(getNthAsteroid(input, base, 201)).to.equal('10,9');
      expect(getNthAsteroid(input, base, 299)).to.equal('11,1');
    });

    it('solves the puzzle', () => {
      const input = makeMap(data);
      const base = [28,29];
      // getNthAsteroid(input, base, 207, { render: true });
      expect(getNthAsteroid(input, base, 200)).to.equal('26,28');
    });
  });

});
