const getParameters = require('./getParameters');
const { expect } = require('chai');

describe('getParameters', () => {
  const pointers = {
    instructionPointer: 0,
    relativeBase: 0,
  };

  it('binary op - position', () => {
    const input = [1,10,11,12];
    input[10] = 'foo'
    input[11] = 'bar'
    input[12] = 'NO!'

    // console.log({input});
    const parameters = getParameters(input, pointers);

    const [ operandA, operandB, outputValue] = parameters;

    expect(operandA).to.equal('foo');
    expect(operandB).to.equal('bar');
    expect(outputValue).to.equal(12);
  });

  it('binary op - immediate', () => {
    const input = [1101,10,11,12];
    input[10] = 'foo'
    input[11] = 'bar'
    input[12] = 'NO!'

    const parameters = getParameters(input, pointers);

    const [ operandA, operandB, outputValue] = parameters;

    expect(operandA).to.equal(10);
    expect(operandB).to.equal(11);
  });

  it('binary op - ignores immediate for output value', () => {
    const input = [11101,10,11,12];
    input[10] = 'foo'
    input[11] = 'bar'
    input[12] = 'NO!'

    const parameters = getParameters(input, pointers);

    const [ operandA, operandB, outputValue] = parameters;

    expect(operandA).to.equal(10);
    expect(operandB).to.equal(11);
    expect(outputValue).to.equal(12);
  });

  it('binary op - ignores immediate for output value', () => {
    const input = [11101,10,11,12];
    input[10] = 'foo'
    input[11] = 'bar'
    input[12] = 'NO!'

    const parameters = getParameters(input, pointers);

    const [ operandA, operandB, outputValue] = parameters;

    expect(operandA).to.equal(10);
    expect(operandB).to.equal(11);
    expect(outputValue).to.equal(12);
  });

  it('binary op - returns third parameter as address in position mode', () => {
    const input = [11101,10,11,12];
    input[10] = 'foo'
    input[11] = 'bar'
    input[12] = 'NO!'

    const parameters = getParameters(input, pointers);

    const [ operandA, operandB, outputValue] = parameters;

    expect(operandA).to.equal(10);
    expect(operandB).to.equal(11);
    expect(outputValue).to.equal(12);
  });

  it('unary op - SET - position', () => {
    const input = [3,10];
    const parameters = getParameters(input, pointers);
    const [ outputValue] = parameters;

    expect(outputValue).to.equal(10);
  });

  it('unary op - SET - immediate ignored', () => {
    const input = [103,10];
    const parameters = getParameters(input, pointers);
    const [ outputValue] = parameters;

    expect(outputValue).to.equal(10);
  });

  it('unary op - RETURN - position', () => {
    const input = [4,10];
    input[10] = 'foo';
    const parameters = getParameters(input, pointers);
    const [ outputValue] = parameters;

    expect(outputValue).to.equal('foo');
  });

  it('unary op - RETURN - immedate', () => {
    const input = [104,10];
    input[10] = 'foo';
    const parameters = getParameters(input, pointers);
    const [ outputValue] = parameters;

    expect(outputValue).to.equal(10);
  });

  describe('relative parameters', () => {
    it('binary - add - relative', () => {
      const input = [2201, 1, 2, 10];
      input[9001] = 'foo';
      input[9002] = 'bar';
      const [a,b,c] = getParameters(input, { ...pointers, relativeBase: 9000 })

      expect(a).to.equal('foo');
      expect(b).to.equal('bar');
    });

    it('unary - return - relative', () => {
      const input = [204, 1];
      input[9001] = 'foo';
      const [a,b,c] = getParameters(input, { ...pointers, relativeBase: 9000 })

      expect(a).to.equal('foo');
    });

    it('unary - set - relative', () => {
      const input = [203, 1];
      input[9001] = 'foo';
      const [a,b,c] = getParameters(input, { ...pointers, relativeBase: 9000 })

      expect(a).to.equal(9001);
    });
  });
});
