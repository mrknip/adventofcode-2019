// const data = require('./3.data.js')
const expect = require('chai').expect;
const { getPasswordCandidates } = require('./4.js')

// 0, 0 at top left
describe('getPasswordCandidates', () => {
  it('accepts 111111', () => {
    const result = getPasswordCandidates(111111, 111111);
    expect(result.length).to.equal(1);
  });

  it('rejects descending digits w/ repeated digits211111', () => {
    const result = getPasswordCandidates(211111, 211111);
    expect(result.length).to.equal(0);
  });

  it('rejects descending digits - 223450', () => {
    const result = getPasswordCandidates(223450, 223450);
    expect(result.length).to.equal(0);
  });

  it('rejects ascending digits, none repeated', () => {
    const result = getPasswordCandidates(123456, 123456);
    expect(result.length).to.equal(0);
  });

  // TO BEAT 418ms
  it('returns the correct answer for the test input', () => {
    const input = {
      min: 134792,
      max: 675810,
    };

    const result = getPasswordCandidates(input.min, input.max);

    expect(result.length).to.equal(1955);
  });


  it('rules out 111111 when passed a maxRepeated value of 2', () => {
    const result = getPasswordCandidates(111111, 111111, 2);
    expect(result.length).to.equal(0);
  });

  it('accepts 112233 when passed a maxRepeated value of 2', () => {
    const result = getPasswordCandidates(112233, 112233, 2);
    expect(result.length).to.equal(1);
  });

  it('accepts 112444', () => {
    const result = getPasswordCandidates(112444, 112444, 2);
    expect(result.length).to.equal(1);
  });

  it('rejects 123444', () => {
    const result = getPasswordCandidates(123444, 123444, 2);
    expect(result.length).to.equal(0);
  });

  // TO BEAT 381ms
  it('returns the correct answer for the test input', () => {
    const input = {
      min: 134792,
      max: 675810,
    };

    const result = getPasswordCandidates(input.min, input.max, 2);

    expect(result.length).to.equal(1319);
  });
})
