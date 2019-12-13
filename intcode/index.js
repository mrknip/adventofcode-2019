const getParameters = require('./getParameters');
const gravityAssistProgram = require('./2.data');
const { OP_CODES, OP_DATA, PARAMETER_MODES } = require('./definitions');

function intcodeStateLog(program, input) {
  const { opCode, parameterModes, getParameterMode } = parseOpCode(program.memory[program.instructionPointer]);

  console.log('===STEP ', program.stepCount, '====');
  console.log('raw', program.memory.slice(program.instructionPointer, program.instructionPointer + OP_DATA[opCode].parameters + 1));
  console.log({opCode}, OP_DATA[opCode].name);

  console.log('parameterModes', parameterModes.map(m => ({
    0: 'position',
    1: 'immediate',
    2: 'relative',
  }[m])));
  console.log('parameters', getParameters(program.memory, program));
  console.log('inputs', input);
  // console.log(this.memory.join(','));

  console.log('relativeBase', program.relativeBase);
  console.log('instruction', program.instructionPointer);
  console.log('output', program.output);
  console.log('=======');
  console.log('');
}

/**
 * A runner
 * @param       {[type]} initialMemoryState [description]
 * @param       {Object} [options={}]       [description]
 * @param       {Object} [options.returnMemoryOnHalt] Will return the state of the memory when program halts or returns
 * @constructor
 */
function IntcodeProgram(initialMemoryState, options = {}) {
  this.memory = [...initialMemoryState];
  this.instructionPointer = 0;
  this.relativeBase = 0;
  this.output = [];
  this.input = [];
  this.stepCount = 0;
  this.running = false;

  this.returnMemoryOnHalt = options.returnMemoryOnHalt ||  false;
  this.forEachInstruction = options.forEachInstruction;
}

IntcodeProgram.prototype.sendOutput = function () {
  this.running = false;

  if (this.returnMemoryOnHalt) {
    return this.memory;
  }

  const outValue = [...this.output];
  this.output = [];

  if (outValue.length <= 1) {
    return outValue[0];
  }

  return outValue;
};

IntcodeProgram.prototype.run = function (input) {
  this.running = true;

  let result = undefined;
  this.input = Array.isArray(input) ? [ ...input ] : [ input ];

  while (this.running) {
    result = this.step(input);
  }

  return result;
};

IntcodeProgram.prototype.step = function () {
  ++this.stepCount;

  const { opCode } = parseOpCode(this.memory[this.instructionPointer]);

  // console.log({opCode});
  if (this.forEachInstruction) {
    this.forEachInstruction(this, opCode);
  }

  // intcodeStateLog(this, this.input);
  // console.log('mem at relativeBase', this.relativeBase, 'is ', this.memory[this.relativeBase]);

  if (opCode === OP_CODES.END) {
    return this.sendOutput();
  }

  if (opCode === OP_CODES.RETURN) {
    const [ newOutput ] = getParameters(this.memory, this);

    if (newOutput === undefined) { // HACK!
      return this.sendOutput();
    }

    this.output.push(newOutput);

    this.instructionPointer += 2;
  }

  if (opCode === OP_CODES.ADD) {
    const [ operandA, operandB, outputIndex ] = getParameters(this.memory, this);
    this.memory[outputIndex] = operandA + operandB;

    this.instructionPointer += 4;
  }

  if (opCode === OP_CODES.MULTIPLY) {
    const [ operandA, operandB, outputIndex ] = getParameters(this.memory, this);

    this.memory[outputIndex] = operandA * operandB;

    this.instructionPointer +=  4;
  }

  if (opCode === OP_CODES.SET) {
    const [ destinationAddress ] = getParameters(this.memory, this);

    if (this.input.filter(v=> v !== undefined).length) { // is this correct?  what does SET do if no input?
      this.memory[+destinationAddress] = this.input.shift();
    } else { // it's blocked, return output and wait.  HACK - should output at 4 command and *then* continue
      return this.sendOutput();
    }

    this.instructionPointer += 2;
  }

  if (opCode === OP_CODES.JUMP_IF_TRUE) {
    const [ operandA, destination ] = getParameters(this.memory, this);
    const passesTest = operandA !== 0;
    this.instructionPointer = passesTest ? destination : this.instructionPointer + 3;
  }

  if (opCode === OP_CODES.JUMP_IF_FALSE) {
    const [ operandA, destination ] = getParameters(this.memory, this);
    const passesTest = operandA === 0;
    this.instructionPointer = passesTest ? destination : this.instructionPointer + 3;
  }

  if (opCode === OP_CODES.LESS_THAN) {
    const [ operandA, operandB, destination ] = getParameters(this.memory, this);
    this.memory[destination] = operandA < operandB ? 1 : 0;
    this.instructionPointer += 4;
  }

  if (opCode === OP_CODES.EQUALS) {
    const [ operandA, operandB, destination ] = getParameters(this.memory, this);
    this.memory[destination] = operandA === operandB ? 1 : 0;
    this.instructionPointer += 4;
  }

  if (opCode === OP_CODES.UPDATE_RELATIVE_BASE) {
    const [ value ] = getParameters(this.memory, this);
    this.relativeBase += value;
    this.instructionPointer += 2;
  }
};

// HELPERS
function runIntcodeProgram(array, input, options = {}) {
  const program = new IntcodeProgram(array, options);

  return program.run(input);
}

function parseOpCode(rawOpCode) {
  const opCodeString = `${rawOpCode}`;
  const opCode = +opCodeString.substr(opCodeString.length - 2);
  const parameterModes = opCodeString
    .substr(0, opCodeString.length - 2)
    .split('')
    .reverse()
    .map(v => +v);

  return {
    opCode: +opCode,
    parameterModes: pad(parameterModes, OP_DATA[opCode].parameters, 0),
  };
}

function pad(array, len, fill) {
  const diff = len - array.length;
  if (diff > 0) {
    return array.concat(new Array(diff).fill(fill));
  }
  return array;
}

// Puzzle-specific functions
function runGravityAssist (noun, verb) {
  const program = gravityAssistProgram.slice(0);
  program[1] = noun;
  program[2] = verb;
  const result = runIntcodeProgram(program, null, { returnMemoryOnHalt: true });

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
};
