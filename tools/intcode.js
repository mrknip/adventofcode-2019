
// TODO DRY
const PARAMETER_MODES = {
  POSITION: 0,
  IMMEDIATE: 1,
  RELATIVE: 2,
};

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
  UPDATE_RELATIVE_BASE: 9,
}

const OP_DATA = {
  [OP_CODES.END]: {},
  [OP_CODES.ADD]: {
    parameters: 3,
    name: 'ADD',
  },
  [OP_CODES.MULTIPLY]: { parameters: 3, name: 'MULTIPLY',},
  [OP_CODES.SET]: { parameters: 1, name: 'SET', },
  [OP_CODES.RETURN]: { parameters: 1, name: 'RETURN', },
  [OP_CODES.JUMP_IF_TRUE]: { parameters: 2, name: 'JUMP_IF_TRUE', },
  [OP_CODES.JUMP_IF_FALSE]: { parameters: 2, name: 'JUMP_IF_FALSE', },
  [OP_CODES.LESS_THAN]: { parameters: 3, name: 'LESS_THAN' },
  [OP_CODES.EQUALS]: { parameters: 3, name: 'EQUALS', },
  [OP_CODES.UPDATE_RELATIVE_BASE]: { parameters: 1, name: 'UPDATE_RELATIVE_BASE' },
}


function getParameters(array, pointers) {
  const { instructionPointer, relativeBase } = pointers;

  const {opCode, parameterModes} = parseOpCode(array[instructionPointer]);
  const { parameters: quantity } = OP_DATA[opCode];

  return array
    .slice(instructionPointer + 1, instructionPointer + 1 + quantity)
    .map((parameter, index) => {
      if (opCode === OP_CODES.SET) {
        return parameter;
      }

      const mode = parameterModes[index] || 0;

      if (mode === PARAMETER_MODES.RELATIVE) {
        return array[relativeBase + parameter] || 0; // defaults to zero for unset memory
      }

      if (mode === PARAMETER_MODES.POSITION) {
        if (
          index === quantity - 1 &&
          (![OP_CODES.RETURN, OP_CODES.JUMP_IF_TRUE, OP_CODES.JUMP_IF_FALSE].includes(opCode))
        ) {
          return parameter
        }
        return array[parameter] || 0; // defaults to zero for unset memory
      }

      if (mode === PARAMETER_MODES.IMMEDIATE) {
        return parameter;
      }
    });
}
//
// // TODO DRY
// const PARAMETER_MODES = {
//   POSITION: 0,
//   IMMEDIATE: 1,
//   RELATIVE: 2,
// };
//
// const OP_CODES = {
//   END: 99,
//   ADD: 1,
//   MULTIPLY: 2,
//   SET: 3,
//   RETURN: 4,
//   JUMP_IF_TRUE: 5,
//   JUMP_IF_FALSE: 6,
//   LESS_THAN: 7,
//   EQUALS: 8,
// }
//
// const OP_DATA = {
//   [OP_CODES.END]: {},
//   [OP_CODES.ADD]: { parameters: 3 },
//   [OP_CODES.MULTIPLY]: { parameters: 3 },
//   [OP_CODES.SET]: { parameters: 1 },
//   [OP_CODES.RETURN]: { parameters: 1 },
//   [OP_CODES.JUMP_IF_TRUE]: { parameters: 2 },
//   [OP_CODES.JUMP_IF_FALSE]: { parameters: 2 },
//   [OP_CODES.LESS_THAN]: { parameters: 3 },
//   [OP_CODES.EQUALS]: { parameters: 3 },
// }

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

// const gravityAssistProgram = require('./2.data');
// const { OP_CODES, OP_DATA, PARAMETER_MODES } = require('./definitions');

function logState(program, opCode) {
  console.log('===STEP ', program.stepCount, '====');
  console.log('raw', program.memory.slice(program.instructionPointer, program.instructionPointer + OP_DATA[opCode].parameters + 1))
  console.log({opCode}, OP_DATA[opCode].name);
  console.log('parameters', getParameters(program.memory, program));
  // console.log(this.memory.join(','));

  console.log('relativeBase', program.relativeBase);
  console.log('instruction', program.instructionPointer);
  console.log('output', program.output);
  console.log('=======');
  console.log('')
}

function IntcodeProgram(initialMemoryState, options = {}) {
  this.memory = [...initialMemoryState];
  this.instructionPointer = 0;
  this.relativeBase = 0;
  this.output = [];
  this.stepCount = 0;

  this.returnMemoryOnHalt = options.returnMemoryOnHalt ||  false;
  this.forEachInstruction = options.forEachInstruction;
}

IntcodeProgram.prototype.sendOutput = function () {
  if (this.returnMemoryOnHalt) {
    return this.memory;
  }

  const outValue = [...this.output];
  this.output = [];

  if (outValue.length <= 1) {
    return outValue[0];
  }
  return outValue;
}

IntcodeProgram.prototype.run = function (input) {
  ++this.stepCount
  // if (++this.stepCount >= 90) {
    // console.log(this.output, this.relativeBase);
    // return 'errar'
  // }


  if (this.instructionPointer >= this.memory.length) return 0;

  if (!this.memory.length) return;
  const result = this.memory.slice(0);
  const remainingInput = Array.isArray(input) ? [...input] : [ input ];

  const { opCode, parameterModes, getParameterMode } = parseOpCode(this.memory[this.instructionPointer]);

  if (this.forEachInstruction) {
    this.forEachInstruction({
      program: this,
      step: this.stepCount,
      name: OP_DATA[opCode].name,
      raw: this.memory.slice(this.instructionPointer, this.instructionPointer + OP_DATA[opCode].parameters + 1),
      parameters: getParameters(this.memory, this),
      // TODO parameter modes
    });
  }

  // logState(this, opCode)
  if (opCode === OP_CODES.END) {
    return this.sendOutput();
  }

  if (opCode === OP_CODES.RETURN) {
    const [ newOutput ] = getParameters(this.memory, this);
    if (newOutput === undefined) { // HACK!
      return this.sendOutput();
    }

    this.output.push(newOutput)
    this.instructionPointer += 2;

    return this.run(...remainingInput)
  }

  if (opCode === OP_CODES.ADD) {
    const [ operandA, operandB, outputIndex ] = getParameters(this.memory, this)
    this.memory[outputIndex] = operandA + operandB;

    this.instructionPointer += 4;
    return this.run(...remainingInput);
  }

  if (opCode === OP_CODES.MULTIPLY) {
    const [ operandA, operandB, outputIndex ] = getParameters(this.memory, this)

    this.memory[outputIndex] = operandA * operandB;

    this.instructionPointer +=  4;
    return this.run(...remainingInput);
  }

  if (opCode === OP_CODES.SET) {
    const destinationAddress = this.memory[this.instructionPointer + 1];
    if (remainingInput.filter(v=> v!== undefined).length) { // is this correct?  what does SET do if no input?
      this.memory[destinationAddress] = remainingInput.shift();
    } else { // it's blocked, return output and wait.  HACK - should output at 4 command and *then* continue
      return this.sendOutput();
    }

    this.instructionPointer += 2;
    return this.run(...remainingInput);
  }

  if (opCode === OP_CODES.JUMP_IF_TRUE) {
    const [ operandA, destination ] = getParameters(this.memory, this)
    this.instructionPointer = operandA !== 0 ? destination : this.instructionPointer + 3;

    return this.run(...remainingInput);
  }

  if (opCode === OP_CODES.JUMP_IF_FALSE) {
    const [ operandA, destination ] = getParameters(this.memory, this)
    this.instructionPointer = operandA === 0 ? destination : this.instructionPointer + 3;

    return this.run(...remainingInput);
  }

  if (opCode === OP_CODES.LESS_THAN) {
    const [ operandA, operandB, destination ] = getParameters(this.memory, this)
    this.memory[destination] = operandA < operandB ? 1 : 0;
    this.instructionPointer += 4;

    return this.run(...remainingInput);
  }

  if (opCode === OP_CODES.EQUALS) {
    const [ operandA, operandB, destination ] = getParameters(this.memory, this)
    this.memory[destination] = operandA === operandB ? 1 : 0;
    this.instructionPointer += 4;

    return this.run(...remainingInput);
  }

  if (opCode === OP_CODES.UPDATE_RELATIVE_BASE) {
    const [ value ] = getParameters(this.memory, this);
    this.relativeBase += value;
    this.instructionPointer += 2;

    return this.run(...remainingInput)
  }
}



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
    .reverse();

  return {
    opCode: +opCode,
    parameterModes: parameterModes.map(v => +v),
  }
}
//
// function getParameters(array, startIndex, quantity, parameterModes) {
//   const {opCode} = parseOpCode(array[startIndex]);
//
//   return array
//     .slice(startIndex + 1, startIndex + 1 + quantity)
//     .map((parameter, index) => {
//       const mode = parameterModes[index] || 0;
//
//       if (mode === PARAMETER_MODES.POSITION) {
//         if (
//           index === quantity - 1 &&
//           (![OP_CODES.JUMP_IF_TRUE, OP_CODES.JUMP_IF_FALSE].includes(opCode))
//         ) {
//           return parameter
//         }
//         return array[parameter];
//       }
//
//       if (mode === PARAMETER_MODES.IMMEDIATE) {
//         return parameter;
//       }
//     });
// }

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
