const data = require('./data.js')
const expect = require('chai').expect;
const { getMax, getMaxLooped } = require('./index');
const fs = require('fs')

describe.only('getMax', () => {
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

describe.only('getMaxLooped', () => {
  it('works with test case 1', () => {
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
    const result = getMaxLooped(input, `56789`)

    expect(result).to.equal(139629729);
  });
});
