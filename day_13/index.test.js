const { expect } = require('chai');
const fs = require('fs');
const { renderGame } = require('./index');

describe.only('day 13', () => {
  describe('renderGame', () => {
    it('works', () => {
      console.log(renderGame());
    });
  });
});
