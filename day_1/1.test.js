const data = require('./1.data.js')
const expect = require('chai').expect;
const getFuelForMass = require('./1').getFuelForMass;
const getFuelForMassRecursive = require('./1').getFuelForMassRecursive;
const getRequiredFuel = require('./1').getRequiredFuel;

describe('getFuelForMass', () => {
  it('handles 12', () => {
    const input = 12;
    const result = getFuelForMass(input);

    expect(result).to.equal(2)
  });

  it('handles 14', () => {
    const input = 14;
    const result = getFuelForMass(input);

    expect(result).to.equal(2)
  });

  it('handles 1969', () => {
    const input = 1969;
    const result = getFuelForMass(input);

    expect(result).to.equal(654)
  });

  it('handles 100756', () => {
    const input = 100756;
    const result = getFuelForMass(input);

    expect(result).to.equal(33583)
  });

  describe('accounting for fuel', () => {
    it('handles 12', () => {
      const input = 12;
      const result = getFuelForMassRecursive(input);

      expect(result).to.equal(2)
    });

    it('handles 14', () => {
      const input = 14;
      const result = getFuelForMassRecursive(input);

      expect(result).to.equal(2)
    });

    it('handles 1969', () => {
      const input = 1969;
      const result = getFuelForMassRecursive(input);

      expect(result).to.equal(966)
    });

    it('handles 100756', () => {
      const input = 100756;
      const result = getFuelForMassRecursive(input);

      expect(result).to.equal(50346)
    });
  });

})

describe('getRequiredFuel', () => {
  it('gives the correct answer - not factor in fuel', () => {
    const input = data.split('\n').map(v => parseInt(v, 10));
    const result = getRequiredFuel(input);

    expect(result).to.equal(3337604)
  });

  it('gives the correct answer - factor in fuel', () => {
    const input = data.split('\n').map(v => parseInt(v, 10));
    const result = getRequiredFuel(input, true);

    expect(result).to.equal(5003530)
  });
});
