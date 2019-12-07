const gravityAssistProgram = require('./2.data.js');
const expect = require('chai').expect;
const runIntcodeProgram = require('./2').runIntcodeProgram;
const runGravityAssist = require('./2').runGravityAssist;
const getNounVerbForTarget = require('./2').getNounVerbForTarget;

describe('runIntcodeProgram', () => {
  it('works - test case 1', () => {
    const program = [1,9,10,3,2,3,11,0,99,30,40,50];
    const result = runIntcodeProgram(program);

    expect(result).to.deep.equal([3500,9,10,70,2,3,11,0,99,30,40,50]);
  });

  it('works - test case 2', () => {
    const program = [1,0,0,0,99];
    const result = runIntcodeProgram(program);

    expect(result).to.deep.equal([2,0,0,0,99]);
  });

  it('works - test case 2', () => {
    const program = [2,3,0,3,99];
    const result = runIntcodeProgram(program);

    expect(result).to.deep.equal([2,3,0,6,99]);
  });

  it('works - puzzle case', () => {
    const puzzle_input = gravityAssistProgram.slice(0);
    puzzle_input[1] = 12;
    puzzle_input[2] = 2;

    const result = runIntcodeProgram(puzzle_input);

    expect(result[0]).to.equal(5098658)
  })
});

describe('runGravityAssist', () => {
  it('works for the puzzle case', () => {
    const result = runGravityAssist(12, 2);
    expect(result).to.equal(5098658);
  });
});

describe('getNounVerbForTarget', () => {
  it('works for the puzzle case', () => {
    const result = getNounVerbForTarget(5098658);
    expect(result).to.deep.equal([12,2]);
  });
});
