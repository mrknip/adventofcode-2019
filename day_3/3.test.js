const data = require('./3.data.js')
const expect = require('chai').expect;
const { getIntersections, getManhattanDistanceToStartFromIntersection, parsePuzzleData, getShortestSteps } = require('./3.js')

// 0, 0 at top left
describe('getIntersections', () => {
  it('meets the test case', () => {
    const start = {x: 1, y: 8};
    const pathA = ['R8','U5','L5','D3']
    const pathB = ['U7','R6','D4','L4']

    const {intersection, steps} = getIntersections(start, pathA, pathB);
    expect(intersection).to.be.a('Set');
    const result = [...intersection]
    expect(result).to.include("4,5");
    expect(result).to.deep.include("7,3");
    expect(result.length).to.equal(2);
  });
});


describe('getManhattanDistanceToStartFromIntersection', () => {
  it('meets test case 1', () => {
    const start = {x: 1, y: 8};
    const pathA = ['R8','U5','L5','D3']
    const pathB = ['U7','R6','D4','L4']
    const result = getManhattanDistanceToStartFromIntersection(start, pathA, pathB);

    expect(result).to.equal(6);
  })

  it('meets test case 2', () => {
    const start = {x: 1, y: 8};
    const pathA = ['R75','D30','R83','U83','L12','D49','R71','U7','L72']
    const pathB = ['U62','R66','U55','R34','D71','R55','D58','R83']
    const result = getManhattanDistanceToStartFromIntersection(start, pathA, pathB);

    expect(result).to.equal(159);
  })

  it('meets test case 3', () => {
    const start = {x: 1, y: 8};
    const pathA = ['R98','U47','R26','D63','R33','U87','L62','D20','R33','U53','R51']
    const pathB = ['U98','R91','D20','R16','D67','R40','U7','R15','U6','R7']
    const result = getManhattanDistanceToStartFromIntersection(start, pathA, pathB);

    expect(result).to.equal(135);
  })

  it('meets puzzle answer', () => {
    const start = {x: 1, y: 8};
    const puzzleData = parsePuzzleData(data);
    const result = getManhattanDistanceToStartFromIntersection(start, puzzleData[0], puzzleData[1]);

    expect(result).to.equal(1626);
  })

  describe('getShortestSteps', () => {
    it('meets test case 1', () => {
      const start = {x: 1, y: 8};
      const pathA = ['R8','U5','L5','D3']
      const pathB = ['U7','R6','D4','L4']
      const result = getShortestSteps(start, pathA, pathB);

      expect(result).to.equal(30);
    });

    it('meets test case 2', () => {
      const start = {x: 1, y: 8};
      const pathA = ['R75','D30','R83','U83','L12','D49','R71','U7','L72']
      const pathB = ['U62','R66','U55','R34','D71','R55','D58','R83']
      const result = getShortestSteps(start, pathA, pathB);

      expect(result).to.equal(610);
    })

    it('meets test case 3', () => {
      const start = {x: 1, y: 8};
      const pathA = ['R98','U47','R26','D63','R33','U87','L62','D20','R33','U53','R51']
      const pathB = ['U98','R91','D20','R16','D67','R40','U7','R15','U6','R7']
      const result = getShortestSteps(start, pathA, pathB);

      expect(result).to.equal(410);
    })

    it('meets puzzle answer', () => {
      const puzzleData = parsePuzzleData(data);
      const start = Date.now();
      const result = getShortestSteps({x: 0, y: 0}, puzzleData[0], puzzleData[1]);

      expect(result).to.equal(27330);
    })
  });

})
