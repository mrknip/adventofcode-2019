const data = require('./1.data.js');

function getFuelForMass (mass, includeFuelMass) {
  return Math.floor(mass / 3) - 2;
};

function getFuelForMassRecursive (mass, total = 0) {
  const thisFuelRequired = getFuelForMass(mass);
  if (thisFuelRequired <= 0) return total;

  return getFuelForMassRecursive(thisFuelRequired, total + thisFuelRequired)
}

function getRequiredFuel(masses, includeFuelMass) {
  return masses
    .map(mass => includeFuelMass ? getFuelForMassRecursive(mass) : getFuelForMass(mass))
    .reduce((a,b) => a + b);
}

module.exports = {
  getRequiredFuel: getRequiredFuel,
  getFuelForMass: getFuelForMass,
  getFuelForMassRecursive: getFuelForMassRecursive,
}
