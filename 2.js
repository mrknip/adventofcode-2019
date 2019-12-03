const gravityAssistProgram = require('./2.data');
const OP_CODES = {
  END: 99,
  ADD: 1,
  MULTIPLY: 2,
}


function runOpcodeProgram(array, startIndex = 0, out) {
  if (!array.length) return array;
  const result = array.slice(0);

  const opCode = array[startIndex];
  if (opCode === OP_CODES.END) {
    return result;
  }

  // const { operandIndexA, operandIndexB, outputIndex } = getIndices(array, startIndex);

  if (opCode === OP_CODES.ADD) {
    const operandIndexA = array[startIndex + 1];
    const operandIndexB = array[startIndex + 2];
    const outputIndex = array[startIndex + 3];

    const operandA = result[operandIndexA];
    const operandB = result[operandIndexB];
    result[outputIndex] = operandA + operandB;
    const newStartIndex = startIndex + 4;
    return runOpcodeProgram(result, newStartIndex);
  }

  if (opCode ===  OP_CODES.MULTIPLY) {
    const operandIndexA = array[startIndex + 1];
    const operandIndexB = array[startIndex + 2];
    const outputIndex = array[startIndex + 3];

    const operandA = result[operandIndexA];
    const operandB = result[operandIndexB];

    result[outputIndex] = operandA * operandB;

    const newStartIndex = startIndex + 4;

    return runOpcodeProgram(result, newStartIndex);
  }
}

function getIndices(array, startIndex) {
  return {
    opA:  array[startIndex + 1],
    opB:  array[2],
    output:  array[3],
  }
}

function runGravityAssist (noun, verb) {
  const program = gravityAssistProgram.slice(0);
  program[1] = noun;
  program[2] = verb;

  const result = runOpcodeProgram(program);

  return result[0];
}

function getNounVerbForTarget(target, LIMIT = 20) {
  for (let noun = 0; noun < LIMIT; ++noun) {
    for (let verb = 0; verb < LIMIT; ++verb) {
      const result = runGravityAssist(noun, verb);

      if (result === target) {
        return [noun, verb];
      }
    }
  }

  return 'none found';
}

module.exports = {
  runOpcodeProgram: runOpcodeProgram,
  runGravityAssist: runGravityAssist,
  getNounVerbForTarget: getNounVerbForTarget,
}

// const gravityAssistProgram = [1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,1,10,19,2,6,19,23,1,23,5,27,1,27,13,31,2,6,31,35,1,5,35,39,1,39,10,43,2,6,43,47,1,47,5,51,1,51,9,55,2,55,6,59,1,59,10,63,2,63,9,67,1,67,5,71,1,71,5,75,2,75,6,79,1,5,79,83,1,10,83,87,2,13,87,91,1,10,91,95,2,13,95,99,1,99,9,103,1,5,103,107,1,107,10,111,1,111,5,115,1,115,6,119,1,119,10,123,1,123,10,127,2,127,13,131,1,13,131,135,1,135,10,139,2,139,6,143,1,143,9,147,2,147,6,151,1,5,151,155,1,9,155,159,2,159,6,163,1,163,2,167,1,10,167,0,99,2,14,0,0];

// const setProgramValues(program, valueA, valueB, addressA = 1, addressB = 2;) = {
//   const result = program.slice(0);
//   result[addressA] = valueA;
//   result[addressB] = valueB;
//
//   return result;
// }

// const programWithValues = setProgramValues(gravityAssistProgram, )


// Question 2 - don't know how to test for this one.  The noun affects the first half of the number, the verb the second.
// noun 0 starts at 490,
// verb 0 starts at 656, inc 1


// console.log(getNounVerbForTarget(19690720, 100));
// 
// const nv = getNounVerbForTarget(19690720, 100);
// const result = 100 * nv[0] + nv[1];


// console.log(result);
