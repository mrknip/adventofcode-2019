const { expect } = require('chai');
const { getLayers }  from './index'

describe.only('day 8 ', () => {
  describe('getLayers', () => {
    it('extracts the test data', () => {
      const input = '123456789012';
      const height = 2;
      const width = 3;
      const result  getLayers(input, width, height);

      expect(result).to.deep.equal({
        1: '123456',
        2: '789123',
      })
    });
  });
});
