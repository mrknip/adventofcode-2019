const data = require('./data.js')
const expect = require('chai').expect;
const { getMax, getMaxLooped, IntcodeProgram, getResultForPhaseSetting } = require('./index');
const fs = require('fs')

describe('day 7', () => {
  describe('getMax', () => {
    it('works with test case 1', () => {
      const input = [3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0];
      const result = getMax(input, `01234`);

      expect(result).to.equal(43210);
    });

    it('works with test case 1', () => {
      const input = [3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0];
      const result = getMax(input, `01234`);

      expect(result).to.equal(54321);
    });

    it.skip('works with puzzle input', () => {
      const result = getMax(data, '01234');

      expect(result).to.equal(22012);
    });
  });

// TODO have broken one of these
describe.skip('getMaxLooped', () => {
  it('gets the highest value for test case 1', () => {
    const input = [
      //0
      3,26,  // 9 0 5
      // 5
      1001,26,-4,26, // 5 0 5
      // 6 => this should take from output
      3,27, // 5 0 5
      1002,27,2,27, // 5 0 5
      1,27,26,27, // 0 5 5
      //17
      4,27, // =>5
      //19
      1001,28,-1,28,  // 0 5 4
      //22
      1005,28,6, //jift GOTO 6
      //25
      99,
      //26
      0,0,5];
    const result = getMaxLooped(input, `98765`)

    expect(result).to.equal(139629729);
  });

  it('gets the highest value for test case 2', () => {
    const input = [3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10];
    const result = getMaxLooped(input, '98765');

    expect(result).to.equal(18216);
  });

  it('gets the highest value for puzzle case', () => {
    const input = [3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10];
    const result = getMaxLooped(data, '98765');

    expect(result).to.equal(4039164);
  });
});

  describe('getResultForPhaseSetting', () => {
    it('works with the highest result for test case 1', () => {
      const input = [
        //0
        3,26,  // 9 0 5
        // 5
        1001,26,-4,26, // 5 0 5
        // 6 => this should take from output
        3,27, // 5 0 5
        1002,27,2,27, // 5 0 5
        1,27,26,27, // 0 5 5
        //17
        4,27, // =>5
        //19
        1001,28,-1,28,  // 0 5 4
        //22
        1005,28,6, //jift GOTO 6
        //25
        99,
        //26
        0,0,5];
      const result = getResultForPhaseSetting(`98765`, input)

      expect(result).to.equal(139629729);
    });


  });
});
