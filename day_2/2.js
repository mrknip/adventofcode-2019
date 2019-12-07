const gravityAssistProgram = require('./2.data');
const OP_CODES = {
  END: 99,
  ADD: 1,
  MULTIPLY: 2,
}


function runIntcodeProgram(array, startIndex = 0, out) {
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
    return runIntcodeProgram(result, newStartIndex);
  }

  if (opCode ===  OP_CODES.MULTIPLY) {
    const operandIndexA = array[startIndex + 1];
    const operandIndexB = array[startIndex + 2];
    const outputIndex = array[startIndex + 3];

    const operandA = result[operandIndexA];
    const operandB = result[operandIndexB];

    result[outputIndex] = operandA * operandB;

    const newStartIndex = startIndex + 4;

    return runIntcodeProgram(result, newStartIndex);
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

  const result = runIntcodeProgram(program);

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
  runIntcodeProgram: runIntcodeProgram,
  runGravityAssist: runGravityAssist,
  getNounVerbForTarget: getNounVerbForTarget,
}
