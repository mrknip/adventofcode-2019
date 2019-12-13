const gravityAssistProgram = require('./2.data.js');
const airconDiagnosticProgram = require('./5.data.js');
const expect = require('chai').expect;
const { runIntcodeProgram, runGravityAssist, getNounVerbForTarget} = require('./index');

describe('runIntcodeProgram', () => {
  describe('opcode ADD', () => {
    it('works = addition (immediate)', () => {
      const program = [11101,9,10,0,99];
      const result = runIntcodeProgram(program, undefined, {
        returnMemoryOnHalt: true,
      });
      // console.log({result});
      expect(result).to.deep.equal([19,9,10,0,99]);
    });

    it('works = addition (immediate 2)', () => {
      const ADDR_1 = 10;
      const ADDR_2 = 11;
      const ADDR_3 = 12;
      const program = [1102,2,2,ADDR_3,99,null,null,null,null,null,ADDR_1,ADDR_2,ADDR_3];
      const result = runIntcodeProgram(program, null, {
        returnMemoryOnHalt: true,
      });

      expect(result[ADDR_3]).to.equal(4);
    });

    it('addition (mixed)', () => {
      const ADDR_1 = 10;
      const ADDR_2 = 11;
      const ADDR_3 = 12;
      const program = [102,2,ADDR_2,ADDR_3,99,null,null,null,null,null,ADDR_1,ADDR_2,ADDR_3];
      program[ADDR_2] = 2;
      const result = runIntcodeProgram(program, null, {
        returnMemoryOnHalt: true,
      });

      expect(result[ADDR_3]).to.equal(4);
    });

    it('works = addition (position)', () => {
      const program = [1,5,6,7,99,1,1,7];
      const result = runIntcodeProgram(program, null, {
        returnMemoryOnHalt: true
      });

      expect(result).to.deep.equal([1,5,6,7,99,1,1,2]);
    });
  });


  describe('opcode MULTIPLY', () => {
    it('works - MULTIPLY', () => {
      const program = [1002, 4, 3, 4, 33];
      const result = runIntcodeProgram(program, null, {
        returnMemoryOnHalt: true,
      });

      expect(result).to.deep.equal([1002,4,3,4,99]);
    });
  });

  describe('day 2', () => {
    it('works - day 2 test case 1', () => {
      const program = [1,9,10,3,2,3,11,0,99,30,40,50];
      const result = runIntcodeProgram(program, null, { returnMemoryOnHalt: true });

      expect(result).to.deep.equal([3500,9,10,70,2,3,11,0,99,30,40,50]);
    });

    it('works - day 2 test case 2', () => {
      const program = [1,0,0,0,99];
      const result = runIntcodeProgram(program, null, { returnMemoryOnHalt: true });

      expect(result).to.deep.equal([2,0,0,0,99]);
    });

    it('works - day 2 test case 2', () => {
      const program = [2,3,0,3,99];
      const result = runIntcodeProgram(program, null, { returnMemoryOnHalt: true });

      expect(result).to.deep.equal([2,3,0,6,99]);
    });

    it('works - day 2 puzzle case 1', () => {
      const puzzle_input = gravityAssistProgram.slice(0);
      puzzle_input[1] = 12;
      puzzle_input[2] = 2;

      const result = runIntcodeProgram(puzzle_input, null, { returnMemoryOnHalt: true });

      expect(result[0]).to.equal(5098658);
    });
  });

  describe('optcode SET', () => {
    it('processes optcode 3 - set from input', () => {
      const program = [3,3,99,0];
      const input = 9000;
      const result = runIntcodeProgram(program, input, {
        returnMemoryOnHalt: true,
      });

      expect(result).to.deep.equal([3,3,99,9000]);
    });

    it('works with multiple inputs', () => {
      const ADDR_1 = 100;
      const ADDR_2 = 101;
      const program = [3,ADDR_1,3,ADDR_2,99,0];
      const inputA = 9000;
      const inputB = 9001;
      const result = runIntcodeProgram(program, [inputA, inputB], {
        returnMemoryOnHalt: true,
      });

      expect(result[ADDR_1]).to.equal(inputA);
      expect(result[ADDR_2]).to.equal(inputB);
    });
  });

  it('processes optcode 4 - output from address', () => {
    const program = [4,3,99,9000];
    const result = runIntcodeProgram(program);

    expect(result).to.equal(9000);
  });

  it('handles RETURN with immedate output', () => {
    const program = [104,9000,99];
    const result = runIntcodeProgram(program);
    expect(result).to.equal(9000);
  });

  it('handles RETURN with immedate output of 0', () => {
    const program = [104,0,99];
    const result = runIntcodeProgram(program);
    expect(result).to.equal(0);
  });

  it('handles negative values', () => {
    const program = [1101,100,-1,4,0];
    const result = runIntcodeProgram(program, null, {
      returnMemoryOnHalt: true,
    });

    expect(result).to.deep.equal([1101,100,-1,4,99]);
  });

  it('handles comparison', () => {
    const program = [3,9,8,9,10,9,4,9,99,-1,8];
    const result = runIntcodeProgram(program, 1);
    expect(result).to.equal(0);
    expect(runIntcodeProgram(program, 8)).to.equal(1);
  });

  it('handles less than', () => {
    const program = [3,9,7,9,10,9,4,9,99,-1,8];
    expect(runIntcodeProgram(program, 1)).to.equal(1);
    expect(runIntcodeProgram(program, 8)).to.equal(0);
  });

  it('handles equal to (immediate)', () => {
    const program = [3,3,1108,-1,8,3,4,3,99];
    expect(runIntcodeProgram(program, 1)).to.equal(0);
    expect(runIntcodeProgram(program, 8)).to.equal(1);
  });

  it('handles jump if true', () => {
    const program = [3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9];
    expect(runIntcodeProgram(program, 0)).to.equal(0);
    expect(runIntcodeProgram(program, 8)).to.equal(1);
  });

  it('handles jump if true (immediate)', () => {
    const program = [3,3,1105,-1,9,1101,0,0,12,4,12,99,1];
    expect(runIntcodeProgram(program, 0)).to.equal(0);
    expect(runIntcodeProgram(program, 8)).to.equal(1);
  });

  it('runs longer program', () => {
    const program = [3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,
      1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,
      999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99];
    expect(runIntcodeProgram(program, 0)).to.equal(999);
    expect(runIntcodeProgram(program, 8)).to.equal(1000);
    expect(runIntcodeProgram(program, 9)).to.equal(1001);
  });

});


// TODO test pause on input Command + no input

describe.skip('AOC_5 - diagnostics', () => {
  it('works', () => {
    const program = airconDiagnosticProgram;
    const userInput = 1;
    const result = runIntcodeProgram(program, userInput);

    expect(result).to.equal(0);
  });

  it('works- thermals', () => {
    const program = airconDiagnosticProgram;
    const userInput = 5;

    const result = runIntcodeProgram(program, userInput);
    expect(result).to.equal(7408802);
  });
});

describe('runGravityAssist', () => {
  it('works for the puzzle case', () => {
    const result = runGravityAssist(12, 2);
    expect(result).to.equal(5098658);
  });
});

describe('getNounVerbForTarget', () => {
  it('wosrks for the puzzle case', () => {
    const result = getNounVerbForTarget(5098658);
    expect(result).to.deep.equal([12,2]);
  });
});
