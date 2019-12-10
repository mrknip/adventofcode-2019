const { expect } = require('chai');
const { IntcodeProgram }  = require('../intcode');
const data = require('./data');

describe('day 9', () => {
  it('handles test case 1 - relative base', () => {
    const input = [109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99];
    const intcodeProgram = new IntcodeProgram(input);

    let result = [];
    let output = intcodeProgram.run();

    expect(output).to.deep.equal(input);
  });

  it('handles test case 2 - large numbers', () => {
    const input = [1102,34915192,34915192,7,4,7,99,0];
    const intcodeProgram = new IntcodeProgram(input);

    let result = [];
    let output = intcodeProgram.run();

    expect(`${output}`.length).to.equal(16);
  });

  it('handles test case 2 - large numbers', () => {
    const input = [104,1125899906842624,99];
    const intcodeProgram = new IntcodeProgram(input);

    let result = [];
    let output = intcodeProgram.run();

    expect(output).to.equal(input[1]);
  });

  it.skip('solves puzzle', () => {
    const intcodeProgram = new IntcodeProgram(data);

    let output = intcodeProgram.runrunsafe(1);

    expect(output).to.equal(1);
  });

  it.skip('solves puzzle 2 ', () => {
    const intcodeProgram = new IntcodeProgram(data);

    let output = intcodeProgram.runrunsafe(2);

    expect(output).to.equal(1);
  });
});
// const fs = require('fs');
