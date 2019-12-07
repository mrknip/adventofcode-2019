const { runIntcodeProgram } = require('../intcode');


function getMaxLooped(inputProgram, startingPhases) {
  const permutations = getPermutations(startingPhases);

  let halted;
  let max = Number.NEGATIVE_INFINITY;
  let result;

  // const testPerm = permutations[0];

  const testPerm = '98765'
  console.log({testPerm});

  let amplifierPrograms = {
    A: [...inputProgram],
    B: [...inputProgram],
    C: [...inputProgram],
    D: [...inputProgram],
    E: [...inputProgram],
  }

  let count = 0;
  while (!halted && count < 5) {
    count++
    if (result) {
      console.log('n', { result });
      const resultA = runIntcodeProgram(amplifierPrograms.A, +result);
      if (!resultA) halted = true;
      const resultB = runIntcodeProgram(amplifierPrograms.B, +resultA);
      if (!resultB) {
        halted = true;
      }
      const resultC = runIntcodeProgram(amplifierPrograms.C, +resultB);
      if (!resultC) {
        halted = true;
      }
      const resultD = runIntcodeProgram(amplifierPrograms.D, +resultC);
      if (!resultD) {
        halted = true;
      }
      const resultE = runIntcodeProgram(amplifierPrograms.E, +resultD);
      if (!resultE) {
        halted = true;
      }
      result = resultE;
    } else {
      console.log('first run', +testPerm[0], amplifierPrograms.A);
      const resultA = runIntcodeProgram(amplifierPrograms.A, [+testPerm[0], 0]).split(',').map(v => +v).filter(n => !Number.isNaN(n));
      console.log({resultA, testPerm});
      const resultB = runIntcodeProgram(inputProgram, [+testPerm[1], ...resultA]);
      const resultC = runIntcodeProgram(inputProgram, [+testPerm[2], +resultB]);
      const resultD = runIntcodeProgram(inputProgram, [+testPerm[3], +resultC]);
      const resultE = runIntcodeProgram(inputProgram, [+testPerm[4], +resultD]);
      result = resultE;
    }
  }


  console.log({result});
}

function runSingleLoop(inputValue, inputProgram) {
  if (inputValue.length === 5) {
    const resultA = runIntcodeProgram(inputProgram, [+inputValue[0], 0]);
    // if (!resultA) return;
    const resultB = runIntcodeProgram(inputProgram, [+inputValue[1], +resultA]);
    // if (!resultB) return;
    const resultC = runIntcodeProgram(inputProgram, [+inputValue[2], +resultB]);
    // if (!resultC) return;
    const resultD = runIntcodeProgram(inputProgram, [+inputValue[3], +resultC]);
    // if (!resultD) return;
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
    // const resultA = runIntcodeProgram(inputProgram, [+perm[0], 0]);
    // const resultB = runIntcodeProgram(inputProgram, [+perm[1], +resultA]);
    // const resultC = runIntcodeProgram(inputProgram, [+perm[2], +resultB]);
    // const resultD = runIntcodeProgram(inputProgram, [+perm[3], +resultC]);
    // const resultE = runIntcodeProgram(inputProgram, [+perm[4], +resultD]);
    // halt will need to happen on A.
    //
    // console.log({resultE, max, perm});

    if (result > max) {
      maxPerm = perm;
    }
    max = Math.max(result, max);
  })


  return max;
}

function getPermutations(phaseSettingsWhole) {
  const phaseSettings = phaseSettingsWhole.split('');
  const permutations = [];
  generatePermutations(phaseSettings, (digit) => {
    permutations.push(digit.map(d => `${d}`).join(''))
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
}
