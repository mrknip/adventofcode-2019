
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

module.exports = {
  PARAMETER_MODES,
  OP_CODES,
  OP_DATA
}
