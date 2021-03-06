const { expect } = require('chai');
const { getLayers, getCharCount, corruptionCheck, decodeImage }  = require('./index')
const fs = require('fs');

describe('day 8 ', () => {
  describe('getLayers', () => {
    it('extracts the test data', () => {
      const input = '123456789012';
      const width = 3;
      const height = 2;
      const result = getLayers(input, width, height);

      expect(result).to.deep.equal({
        1: '123456',
        2: '789012',
      })
    });
  });

  describe('corruptionCheck', () => {
    it('works with the test data', () => {
      const input = '123456789012';
      const width = 3;
      const height = 2;
      const result = corruptionCheck(input, width, height);

      expect(result).to.equal(1);
    });

    it('solves part 1', () => {
      const data = fs.readFileSync('./day_8/data.txt', 'utf8').trim();

      const width = 25;
      const height = 6;
      const result = corruptionCheck(data, width, height);

      expect(result).to.equal(828);
    });
  });

  describe('getCharCount', () => {
    it('returns the count for a given char', () => {
      const string = '0011223';
      expect(getCharCount(string, '0')).to.equal(2);
    });
  });

  describe('decodeImage', () => {
    it('works with test case', () => {
      const input = '0222112222120000';
      const width = 2;
      const height = 2;
      const result = decodeImage(input, width, height);

      expect(result).to.equal(` @\n@ \n\n`);
    });

    // it('works with test case', () => {
    //   const input = '0222112222120000';
    //   const width = 2;
    //   const height = 2;
    //   const result = decodeImage(input, width, height);
    //
    //   expect(result).to.equal(1);
    // });
  });
});
