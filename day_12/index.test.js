const { expect } = require('chai');
const {  System }  = require('./index');
const fs = require('fs');

describe.only('day 12', () => {
  it('applies gravity correctly', () => {
    const startingData = `<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`;
    const system = new System(startingData);
    expect(system.state[0].position).to.deep.equal({x: -1, y: 0, z: 2});
    system.step();

    expect(system.state[0].position).to.deep.equal({x: 2, y: -1, z: 1});

    expect(system.state[0].velocity).to.deep.equal({x: 3, y: -1, z: -1});
    expect(system.state[1].velocity).to.deep.equal({x: 1, y: 3, z: 3});
    expect(system.state[2].velocity).to.deep.equal({x: -3, y: 1, z: -3});
    expect(system.state[3].velocity).to.deep.equal({x: -1, y: -3, z: 1});

  });

  it('applies gravity correctly - multiple steps', () => {
    const startingData = `<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`;
    const system = new System(startingData);
    expect(system.state[0].position).to.deep.equal({x: -1, y: 0, z: 2});
    system.step(2);

    // expect(system.state[0].position).to.deep.equal({x: 5, y: -3, z: -1});
    expect(system.state[0].velocity).to.deep.equal({x: 3, y: -2, z: -2});

  });

  it('calculates correct energy total', () => {
    const startingData = `<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`;
    const system = new System(startingData);
    expect(system.state[0].position).to.deep.equal({x: -1, y: 0, z: 2});
    system.step(10);

    const total = system.getTotalEnergy();
    expect(system.state[0].velocity).to.deep.equal({x: -3, y: -2, z: 1});
    expect(total).to.equal(179);
  });


  it('solves puzzle', () => {
    const puzzleData = fs.readFileSync(__dirname + '/data.txt', 'utf8');
    const system = new System(puzzleData);
    system.step(1000);

    const total = system.getTotalEnergy();
    // expect(system.state[0].position).to.deep.equal({x: 5, y: -3, z: -1});
    expect(total).to.equal(10189);
  });

  it.only('finds first repeated state', () => {
    const startingData = `<x=-1, y=0, z=2>
    <x=2, y=-10, z=-7>
    <x=4, y=-8, z=8>
    <x=3, y=5, z=-1>`;
    const system = new System(startingData);
    const steps = system.findFirstRepeatedState();

    expect(steps).to.equal(2772);
  });

  it.only('finds first repeated state - big numbers', () => {
    const startingData = `<x=-8, y=-10, z=0>
<x=5, y=5, z=10>
<x=2, y=-7, z=3>
<x=9, y=-8, z=-3>`;
    const system = new System(startingData);
    const steps = system.findFirstRepeatedState();

    expect(steps).to.equal(4686774924);
  });

  it.only('finds first repeated state - puzzle_input', () => {
    const startingData = fs.readFileSync(__dirname + '/data.txt', 'utf8');
    const system = new System(startingData);
    const steps = system.findFirstRepeatedState();

    expect(steps).to.equal(469671086427712);
  });
});
