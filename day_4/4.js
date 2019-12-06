function getPasswordCandidates(min, max, maxRepeated) {
  const out = [];
  for (let i = min; i <= max; i++) {
    const numberString = `${i}`
    const digits = numberString.split('');
    const sorted = digits.sort().join('');

    if (numberString === sorted && hasRepeatedDigits(digits, maxRepeated)) {
      out.push(i);
    }
  }

  return out;
}


function hasRepeatedDigits (digits, max) {
  let count = 1;
  let hasMatch = false;

  digits.forEach((digit, i) => {
    if (i === 0 || hasMatch) {
      return;
    }

    if (digit === digits[i - 1]) {
      count += 1
    } else {
      if ((!max && count > 1) || count === max) {
        hasMatch = true;
      } else {
        count = 1;
      }
    }
  });

  if ((!max && count > 1) || count === max) {
    hasMatch = true;
  }

  return hasMatch;
}


module.exports = {
  getPasswordCandidates,
}
