const { expect } = require('chai');
const { processPanel, renderGrid, getGridState }  = require('./index');

describe('day 11', () => {
  describe('processPanel', () => {
    it('returns a color', () => {
      const currentPanelColour = 0;
      const commands = processPanel(currentPanelColour);

      const firstCommand = commands[0];
      expect(firstCommand.colour).to.be.a('number');
      expect(firstCommand.direction).to.be.a('number');
    });
  });

  describe('getGridState', () => {
    it('returns a panel count', () => {
      const instructions = [
        { colour: 1, direction: 0}
      ];
      const result = getGridState(instructions, { returnPanelCount: true });
      expect(result).to.equal(1);
    });

    it('solves puzzle', () => {
      const currentPanelColour = 0;
      const commands = processPanel(currentPanelColour);
      const result = getGridState(commands, { returnPanelCount: true });
      expect(result).to.equal(2018);
    });

    it('solves puzzle', () => {
      const currentPanelColour = 1;
      processPanel(currentPanelColour, { render: true});
      // this renders to the terminal
    });
  });

  describe('renderGrid', () => {
    it('starts with an empty grid', () => {
      const startingState = renderGrid([], {min: 5, max: 5});
      const image = `
.....
.....
..^..
.....
.....`.trim();

      expect(startingState).to.equal(image);
    });

    it('outputs the result of a single command', () => {
      const instructions = [
        { colour: 1, direction: 0}
      ];
      const output = renderGrid(instructions, {min: 5, max: 5});
      const image = `
.....
.....
.<#..
.....
.....`.trim();

      expect(output).to.equal(image);
    });

  });

});
