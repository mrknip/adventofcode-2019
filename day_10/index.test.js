const { expect } = require('chai');
const { getAsteroidCount }  = require('./index');
// const data = require('./data');

describe.only('getAsteroidCount', () => {
  it('detects adjacent asteroids on the horizontal', () => {
    const input = `
      .#
      ..`
    .replace(/\s/g, '');
    console.log({input});

    const result = getAsteroidCount(input, [0,0]);
    expect(result).to.equal(1);


  });
});
