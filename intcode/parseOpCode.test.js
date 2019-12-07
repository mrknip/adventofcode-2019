const expect = require('chai').expect;
const {parseOpCode} = require('./index');

describe('parseOpCode', () => {
  it('returns opCode w/o parameters', () => {
    const opCode = 2;
    const result = parseOpCode(opCode);

    expect(result.opCode).to.equal(2);
  });

  it('returns opCode w/ parameters', () => {
    const opCode = 102;
    const result = parseOpCode(opCode);

    expect(result.opCode).to.equal(2);
  });

  it('returns two digit opCodes', () => {
    const opCode = 99;
    const result = parseOpCode(opCode);

    expect(result.opCode).to.equal(99);
  });

  it('returns two digit opCodes w parameters', () => {
    const opCode = 199;
    const result = parseOpCode(opCode);

    expect(result.opCode).to.equal(99);
  });


    it('returns parameters', () => {
      const opCode = 101;
      const result = parseOpCode(opCode);

      expect(result.parameterModes).to.deep.equal([1]);
    });

    it('returns parameters in correct order', () => {
      const opCode = 32101;
      const result = parseOpCode(opCode);

      expect(result.parameterModes).to.deep.equal([1, 2, 3]);
    });
});
