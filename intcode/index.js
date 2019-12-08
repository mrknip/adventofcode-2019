const gravityAssistProgram = require('./2.data');

const OP_CODES = {
  END: 99,
  ADD: 1,
  MULTIPLY: 2,
  SET: 3,
  RETURN: 4,
  JUMP_IF_TRUE: 5,
  JUMP_IF_FALSE: 6,
  LESS_THAN: 7,
  EQUALS: 8,
}

const PARAMETER_MODES = {
  POSITION: 0,
  IMMEDIATE: 1,
}

const OP_LENGTH = {
  [OP_CODES.END]: 0,
  [OP_CODES.ADD]: 4, // Command:a:b:outputAddress
  [OP_CODES.MULTIPLY]: 4, // Command:a:b:outputAddress
  [OP_CODES.SET]: 2, // Command:outputAddress
}

function IntcodeProgram(initialMemoryState, options = {}) {
  this.memory = [...initialMemoryState];
  this.instructionPointer = 0;
  this.output = [];

  this.immediateReturn = options.immediateReturn ||  true;
}

IntcodeProgram.prototype.run = function (input) {
  if (this.instructionPointer >= this.memory.length) return 0;

  if (!this.memory.length) return;
  const result = this.memory.slice(0);
  const remainingInput = Array.isArray(input) ? [...input] : [ input ];

  const { opCode, parameterModes, getParameterMode } = parseOpCode(this.memory[this.instructionPointer]);

  if (opCode === OP_CODES.END) {
    return this.memory;
  }

  if (opCode === OP_CODES.RETURN) {
    const output = ret(this.memory, parameterModes, this.instructionPointer);
    this.instructionPointer += 2;

    return output;
  }

  if (opCode === OP_CODES.ADD) {
    const [ operandA, operandB, outputIndex ] = getParameters(this.memory, this.instructionPointer, 3, parameterModes)
    this.memory[outputIndex] = operandA + operandB;

    this.instructionPointer += 4;
    return this.run(...remainingInput);
  }

  if (opCode === OP_CODES.MULTIPLY) {
    const [ operandA, operandB, outputIndex ] = getParameters(this.memory, this.instructionPointer, 3, parameterModes)

    this.memory[outputIndex] = operandA * operandB;

    this.instructionPointer +=  4;
    return this.run(...remainingInput);
  }

  if (opCode === OP_CODES.SET) {
    const destinationAddress = this.memory[this.instructionPointer + 1];
    if (remainingInput.length) { // is this correct?  what does SET do if no input?
      this.memory[destinationAddress] = remainingInput.shift();
    }

    this.instructionPointer += 2;
    return this.run(...remainingInput);
  }

  if (opCode === OP_CODES.JUMP_IF_TRUE) {
    const [ operandA, destination ] = getParameters(this.memory, this.instructionPointer, 2, parameterModes)
    this.instructionPointer = operandA !== 0 ? destination : this.instructionPointer + 3;

    return this.run(...remainingInput);
  }

  if (opCode === OP_CODES.JUMP_IF_FALSE) {
    const [ operandA, destination ] = getParameters(this.memory, this.instructionPointer, 2, parameterModes)
    this.instructionPointer = operandA === 0 ? destination : this.instructionPointer + 3;

    return this.run(...remainingInput);
  }

  if (opCode === OP_CODES.LESS_THAN) {
    const [ operandA, operandB, destination ] = getParameters(this.memory, this.instructionPointer, 3, parameterModes)
    this.memory[destination] = operandA < operandB ? 1 : 0;
    this.instructionPointer += 4;

    return this.run(...remainingInput);
  }

  if (opCode === OP_CODES.EQUALS) {
    const [ operandA, operandB, destination ] = getParameters(this.memory, this.instructionPointer, 3, parameterModes)
    this.memory[destination] = operandA === operandB ? 1 : 0;
    this.instructionPointer += 4;

    return this.run(...remainingInput);
  }
}



// HELPERS
function runIntcodeProgram(array, input) {
  const program = new IntcodeProgram(array);

  return program.run(input);
}

function parseOpCode(rawOpCode) {
  const opCodeString = `${rawOpCode}`;
  const opCode = +opCodeString.substr(opCodeString.length - 2);
  const parameterModes = opCodeString
    .substr(0, opCodeString.length - 2)
    .split('')
    .reverse();

  return {
    opCode: +opCode,
    parameterModes: parameterModes.map(v => +v),
  }
}

function getParameters(array, startIndex, quantity, parameterModes) {
  const {opCode} = parseOpCode(array[startIndex]);

  return array
    .slice(startIndex + 1, startIndex + 1 + quantity)
    .map((parameter, index) => {
      const mode = parameterModes[index] || 0;

      if (mode === PARAMETER_MODES.POSITION) {
        if (
          index === quantity - 1 &&
          (![OP_CODES.JUMP_IF_TRUE, OP_CODES.JUMP_IF_FALSE].includes(opCode))
        ) {
          return parameter
        }
        return array[parameter];
      }

      if (mode === PARAMETER_MODES.IMMEDIATE) {
        return parameter;
      }
    });
}

function getIndices(array, startIndex) {
  return {
    opA:  array[startIndex + 1],
    opB:  array[2],
    output:  array[3],
  }
}

function ret(array, parameterModes, startIndex) {
  const param = array[startIndex + 1];
  const result = parameterModes[0] === PARAMETER_MODES.IMMEDIATE ? param : array[param];

  return result;
}

// Puzzle-specific functions

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
  parseOpCode,
  IntcodeProgram,
}
