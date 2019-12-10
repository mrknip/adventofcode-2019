const { IntcodeProgram } = require('./index');
const { expect } = require('chai');

describe.skip('IntcodeProgram', () => {
  describe('UPDATE_RELATIVE_BASE - opcode 9', () => {
    it('updates relativeBase prop', () => {
      const input = [9,1,99];
      const program = new IntcodeProgram(input);
      program.run();

      expect(program.relativeBase).to.equal(1);
    });
  });

  it('treats unset address as value 0', () => {
    const script = [1001,100,1,999,4,999,99];
    const program = new IntcodeProgram(script);
    const result = program.run();

    expect(result).to.equal(1);
  });

  it('can write to unset address', () => {
    const script = [3, 9000, 4, 9000, 99];
    const program = new IntcodeProgram(script);
    const result = program.run(1);

    expect(result).to.equal(1);
  });
});
