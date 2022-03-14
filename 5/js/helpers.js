export function getRandom(min, max) {
  if (min > max) {
    throw new Error('Invalid parameters: min should be less than max');
  }

  const amountNumbers = max - min + 1;

  return min + Math.floor(Math.random() * amountNumbers);
}

export function getRandomFloat(min, max, signsAmount) {
  const lower = Math.min(Math.abs(min), Math.abs(max));
  const upper = Math.max(Math.abs(min), Math.abs(max));
  const result = Math.random() * (upper - lower) + lower;

  return +result.toFixed(signsAmount);
}

function capitalizeFirstLetter(str) {
  return str[0].toUpperCase() + str.slice(1);
}

export function createRandomWord(
  minLength = 10,
  maxLength = 20,
  capitalizeFirst = false
) {
  const MIN_NUM_LETTER = 97;
  const MAX_NUM_LETTER = 122;

  let title = Array.from({ length: getRandom(minLength, maxLength) })
    .map(() => String.fromCharCode(getRandom(MIN_NUM_LETTER, MAX_NUM_LETTER)))
    .join('');

  if (capitalizeFirst) {
    title = capitalizeFirstLetter(title);
  }

  return title;
}

export function createRandomDescription(minWords, maxWords) {
  let desc = Array.from({ length: getRandom(minWords, maxWords) }, () =>
    createRandomWord(3, 10)
  ).join(' ');

  desc = capitalizeFirstLetter(desc);

  return desc;
}

export function createListWithNoRepeats(
  possibleValuesList,
  amountElemToReturn = 1,
  reservedElemList = null
) {
  if (amountElemToReturn >= possibleValuesList) {
    return possibleValuesList;
  }

  const reservedList = reservedElemList ? reservedElemList : new Set();

  const finalElemList = Array.from({ length: amountElemToReturn }).map(() => {
    let isUnique = false;
    let elem = '';

    while (!isUnique) {
      elem = possibleValuesList[getRandom(0, possibleValuesList.length - 1)];

      if (reservedList.has(elem)) {
        continue;
      }

      reservedList.add(elem);
      isUnique = true;
    }
    return elem;
  });

  return finalElemList;
}
