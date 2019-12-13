const { OP_CODES, OP_DATA, PARAMETER_MODES } = require('./definitions');

module.exports = function getParameters(array, pointers) {
  const { instructionPointer, relativeBase } = pointers;

  const {opCode, parameterModes} = parseOpCode(array[instructionPointer]);
  const { parameters: quantity } = OP_DATA[opCode];

  return array
    .slice(instructionPointer + 1, instructionPointer + 1 + quantity)
    .map((parameter, index) => {
      const mode = parameterModes[index] || 0;

      if (opCode === OP_CODES.SET) {
        if (mode === PARAMETER_MODES.RELATIVE) {
          return relativeBase + parameter;
        }

        return parameter;
      }

      if (mode === PARAMETER_MODES.RELATIVE) {
        if (
          index === quantity - 1 &&
          (![
            OP_CODES.RETURN,
            OP_CODES.UPDATE_RELATIVE_BASE,
            OP_CODES.JUMP_IF_TRUE,
            OP_CODES.JUMP_IF_FALSE
          ].includes(opCode))
        ) {
          return relativeBase + parameter;
        }

        return array[relativeBase + parameter] || 0; // defaults to zero for unset memory
      }


      if (mode === PARAMETER_MODES.POSITION) {
        if (
          index === quantity - 1 &&
          (![
            OP_CODES.RETURN,
            OP_CODES.UPDATE_RELATIVE_BASE,
            OP_CODES.JUMP_IF_TRUE,
            OP_CODES.JUMP_IF_FALSE
          ].includes(opCode))
        ) {
          return parameter;
        }
        return array[parameter] || 0; // defaults to zero for unset memory
      }

      if (mode === PARAMETER_MODES.IMMEDIATE) {
        return parameter;
      }
    });
};
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

function pad(array, len, fill) {
  const diff = len - array.length;

  if (diff > 0) {
    return array.concat(new Array(diff).fill(fill));
  }

  return array;
}

function parseOpCode(rawOpCode) {
  const opCodeString = `${rawOpCode}`;
  const opCode = +opCodeString.substr(opCodeString.length - 2);
  const parameterModes = opCodeString
    .substr(0, opCodeString.length - 2)
    .split('')
    .reverse()
    .map(v => +v);

  const paddedParameterModes = pad(parameterModes, OP_DATA[opCode].parameters, 0);
  return {
    opCode: +opCode,
    parameterModes: paddedParameterModes,
  };
}
