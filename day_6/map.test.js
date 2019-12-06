const data = require('./data.js')
const expect = require('chai').expect;
const { getMap, getMapChecksum, hasChild, getSharedAncestors, getShortestDistance } = require('./map');
const fs = require('fs')

describe('getMap', () => {
  it('handles first addition', () => {
    const input = ['A)B'];
    expect(getMap(input)).to.deep.equal({
      A: { children: ['B'] },
      B: { parent: 'A' }
    })
  });

  it('handles chains', () => {
    const input = ['A)B', 'B)C'];
    expect(getMap(input)).to.deep.equal({
      A: { children: ['B'] },
      B: { parent: 'A', children: ['C']},
      C: { parent: 'B' }
    })
  });

  it('handles chains > 2', () => {
    const input = ['A)B', 'B)C', 'C)D', 'D)E'];
    expect(getMap(input)).to.deep.equal({
      A: { children: ['B'] },
      B: { parent: 'A', children: ['C']},
      C: { parent: 'B', children: ['D']},
      D: { parent: 'C', children: ['E']},
      E: { parent: 'D' },
    })
  });

  it('handles splits at root', () => {
    const input = ['A)B', 'A)C'];
    expect(getMap(input)).to.deep.equal({
      A: {children: ['B', 'C']},
      B: { parent: 'A' },
      C: { parent: 'A' },
    })
  });
});


describe('hasChild', () => {
  it('returns true if has child', () => {
    const input = ['A)B'];
    const map = getMap(input);
    const result = hasChild(map, 'A', 'B');

    expect(result).to.be.true;
  });

  it('returns true if child has child', () => {
    const input = ['A)B', 'B)C'];
    const map = getMap(input);
    const result = hasChild(map, 'A', 'C');

    expect(result).to.be.true;
  });
});

describe('getSharedAncestors', () => {
  it('returns the shared ancestors', () => {
    const input = ['A)B', 'B)C', 'C)D', 'D)E', 'C)F'];
    const map = getMap(input);

    const result = getSharedAncestors(map, 'E', 'F');

    expect(result).to.deep.equal(['C', 'B', 'A'])
  });
});

describe('getShortestDistance', () => {
  it('returns the shortest distance', () => {
    const input = ['A)B', 'B)C', 'C)D', 'D)E', 'C)F'];
    const map = getMap(input);

    const result = getShortestDistance(map, 'E', 'F');

    expect(result).to.equal(3)
  });

  it('gives puzzle answer', () => {
    const input = data.split('\n');
    const map = getMap(input);

    const result = getShortestDistance(map, 'YOU', 'SAN');

    expect(result).to.equal(303)
  });
})

describe('getMapChecksum', () => {
  it('returns 1 for a node on root', () => {
    const input = ['A)B'];
    expect(getMapChecksum(input)).to.equal(1);
  });

  it('returns 2 for two nodes on root', () => {
    const input = ['A)B', 'A)C'];
    expect(getMapChecksum(input)).to.equal(2);
  });

  it('returns 3 for two node cchain', () => {
    const input = ['A)B', 'B)C'];
    expect(getMapChecksum(input)).to.equal(3);
  });


  it('returns 6 for three node chain', () => {
    const input = ['A)B', 'B)C', 'C)D'];
    expect(getMapChecksum(input)).to.equal(6);
  });

  it('returns 6 for split chain', () => {
    const input = ['A)B', 'B)C', 'B)D'];
    expect(getMapChecksum(input)).to.equal(5);
  });

  it('gives an answer for puzzle input', () => {
    const input = data.split('\n');
    expect(getMapChecksum(input)).to.equal(142497);
  });
});
