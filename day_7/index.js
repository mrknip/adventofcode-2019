const { runIntcodeProgram, IntcodeProgram } = require('../intcode');

function getMaxLooped(inputProgram, startingPhases) {
  const permutations = getPermutations(startingPhases);
  let max = Number.NEGATIVE_INFINITY;

  permutations.forEach((phaseValuePermuation) => {
    const permuationResult = getResultForPhaseSetting(phaseValuePermuation, inputProgram);

    if (permuationResult > max) {
      max = permuationResult;
    }
  });

  return max;
}

function getResultForPhaseSetting(phaseSetting, inputProgram) {
  let result;
  let count = 0;
  let inputs = [];
  let resultThisPass;
  let amplifierPrograms = {
    A: new IntcodeProgram(inputProgram),
    B: new IntcodeProgram(inputProgram),
    C: new IntcodeProgram(inputProgram),
    D: new IntcodeProgram(inputProgram),
    E: new IntcodeProgram(inputProgram),
  };

  while (true) {
    // count ++
    resultThisPass = 0;
    Object.keys(amplifierPrograms).forEach((ampId, index) => {
      console.log({resultThisPass});
      if (resultThisPass === undefined) return;

      inputs = result === undefined ? [+phaseSetting[index]] : [];
      inputs.push(index === 0 ? (result || 0) : resultThisPass);

      resultThisPass = amplifierPrograms[ampId].run(inputs);
    });

    if (!Number.isInteger(resultThisPass)) break;

    result = resultThisPass;
  }

  return result;
}

function runSingleLoop(inputValue, inputProgram) {
  if (inputValue.length === 5) {
    const resultA = runIntcodeProgram(inputProgram, [+inputValue[0], 0]);
    const resultB = runIntcodeProgram(inputProgram, [+inputValue[1], +resultA]);
    const resultC = runIntcodeProgram(inputProgram, [+inputValue[2], +resultB]);
    const resultD = runIntcodeProgram(inputProgram, [+inputValue[3], +resultC]);
    const resultE = runIntcodeProgram(inputProgram, [+inputValue[4], +resultD]);

    return resultE;
  }
}

function getMax(inputProgram, phaseString) {
  let max = Number.NEGATIVE_INFINITY;
  let maxPerm;

  const permutations = getPermutations(phaseString);

  permutations.forEach((perm) => {
    const result = runSingleLoop(perm, inputProgram);

    if (result > max) {
      maxPerm = perm;
    }
    max = Math.max(result, max);
  });


  return max;
}

function getPermutations(phaseSettingsWhole) {
  const phaseSettings = phaseSettingsWhole.split('');
  const permutations = [];
  generatePermutations(phaseSettings, (digit) => {
    permutations.push(digit.map(d => `${d}`).join(''));
  });

  return permutations;
}

function generatePermutations (array, cb, forceN) {
  const n = forceN || array.length;

  if (n === 1) {
    return cb([...array]);
  }

  let finished = false;
  for (let i = 0; i < n; i += 1) {
    finished = generatePermutations(array, cb, n - 1);
    if (finished) return finished;

    if (n % 2 === 0) {
      swap(array, i, n - 1);
    } else {
      swap(array, 0, n - 1);
    }
  }
}

function swap (array, indexA, indexB) {
  const temp = array[indexA];
  array[indexA] = array[indexB];
  array[indexB] = temp;

}

module.exports = {
  getMax,
  getMaxLooped,
  IntcodeProgram,
  getResultForPhaseSetting,
};
