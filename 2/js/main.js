function getRandom(min, max) {
  if (min > max) {
    throw new Error('Invalid parameters: min should be less than max');
  }

  const amountNumbers = max - min + 1;
  return min + Math.floor(Math.random() * amountNumbers);
}

function getAmountFloatSigns(number) {
  return number.toString().indexOf('.') !== -1
    ? number.toString().split('.')[1].length
    : 0;
}

function normalizeNumber(number, amountSigns, type = 'floor') {
  if (getAmountFloatSigns(number) > amountSigns) {
    const mult = Math.pow(10, amountSigns);
    const normalized =
      type === 'ceil'
        ? Math.ceil(number * mult) / mult
        : Math.floor(number * mult) / mult;
    return normalized;
  }
  return number;
}

function getRandomFloat(min, max, signsAmount) {
  if (min > max || signsAmount === undefined || signsAmount < 0) {
    throw new Error(
      'Invalid parameters: min should be less than max and signsAmount required and should be a positive number'
    );
  }

  const multiplier = Math.pow(10, signsAmount);
  const normalizeMin = normalizeNumber(min, signsAmount, 'ceil');
  const normalizeMax = normalizeNumber(max, signsAmount, 'floor');

  if (normalizeMin > normalizeMax) {
    throw new Error('There is no solition for these parametres');
  }

  const randomMultNum = getRandom(
    0,
    (normalizeMax - normalizeMin) * multiplier
  );
  const randomNum = normalizeMin + randomMultNum / multiplier;

  return randomNum.toFixed(signsAmount);
}

getRandom(0, 5);
getRandomFloat(1.2, 1.9, 0);

// // eslint-disable-next-line
// console.log('getRandom(): ', getRandom(0, 5));
// // eslint-disable-next-line
// console.log('getRandomFloat(): ', getRandomFloat(1.2, 1.9, 0));
