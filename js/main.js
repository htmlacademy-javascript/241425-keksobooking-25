const ADVERT_AMOUNT = 10;
const USER_ID_AMOUNT = 20;
const userIds = Array.from({ length: USER_ID_AMOUNT }).map((_, ndx) => ndx + 1);
const reservedIds = new Set();
const advertRoomTypes = ['palace', 'flat', 'house', 'bungalow', 'hotel'];
const advertRules = ['12:00', '13:00', '14:00'];
const advertFeatureList = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner',
];
const advertPhotos = [
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/duonguyen-8LrGtIxxa4w.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/brandon-hoogenboom-SNxQGWxZQi0.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/claire-rendall-b6kAwr1i0Iw.jpg',
];

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
    const normalizedNumber =
      type === 'ceil'
        ? Math.ceil(number * mult) / mult
        : Math.floor(number * mult) / mult;
    return normalizedNumber;
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
  const normalizedMin = normalizeNumber(min, signsAmount, 'ceil');
  const normalizedMax = normalizeNumber(max, signsAmount, 'floor');

  if (normalizedMin > normalizedMax) {
    throw new Error('There is no solition for these parametres');
  }

  const randomMultNum = getRandom(
    0,
    (normalizedMax - normalizedMin) * multiplier
  );
  const randomNum = normalizedMin + randomMultNum / multiplier;

  return randomNum.toFixed(signsAmount);
}

getRandom(0, 5);
getRandomFloat(1.2, 3.94, 2);

function createLocation() {
  return {
    lat: getRandomFloat(35.65, 35.7, 5),
    lng: getRandomFloat(139.7, 139.8, 5),
  };
}

function createAvatarSrc(userIdsAmount) {
  let isUniqueId = false;
  let userId;

  while (!isUniqueId) {
    const randomNum = userIds[getRandom(0, userIdsAmount - 1)];

    if (reservedIds.has(randomNum)) {
      continue;
    }

    reservedIds.add(randomNum);
    userId = (randomNum < 10 ? '0' : '') + randomNum;
    isUniqueId = true;
  }

  const avatarSrc = `img/avatars/user${userId}.png`;
  return avatarSrc;
}

function capitalizeFirstLetter(str) {
  return str[0].toUpperCase() + str.slice(1);
}

function createWord(minLength = 10, maxLength = 20, capitalizeFirst = false) {
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

function createDescription(minWords, maxWords) {
  let desc = Array.from({ length: getRandom(minWords, maxWords) }, () =>
    createWord(3, 10)
  ).join(' ');

  desc = capitalizeFirstLetter(desc);

  return desc;
}

function createListWithNoRepeats(fullList, amountElem = 1) {
  if (amountElem >= fullList) {
    return fullList;
  }

  const reservedElemList = new Set();

  const finalElemList = Array.from({ length: amountElem }).map(() => {
    let isUnique = false;
    let elem = '';

    while (!isUnique) {
      elem = fullList[getRandom(0, fullList.length - 1)];

      if (reservedElemList.has(elem)) {
        continue;
      }

      reservedElemList.add(elem);
      isUnique = true;
    }
    return elem;
  });

  return finalElemList;
}

function createAdvert() {
  const location = createLocation();

  const author = {
    avatar: createAvatarSrc(USER_ID_AMOUNT),
  };

  const offer = {
    address: `${location.lat}, ${location.lng}`,
    title: createWord(10, 15, true),
    description: createDescription(2, 7),
    price: getRandom(20, 70) * 100,
    rooms: getRandom(1, 4),
    guests: getRandom(1, 8),
    type: advertRoomTypes[getRandom(0, advertRoomTypes.length - 1)],
    checkin: advertRules[getRandom(0, advertRules.length - 1)],
    checkout: advertRules[getRandom(0, advertRules.length - 1)],
    features: createListWithNoRepeats(
      advertFeatureList,
      getRandom(1, advertRoomTypes.length - 1)
    ),
    photos: createListWithNoRepeats(
      advertPhotos,
      getRandom(0, advertPhotos.length - 1)
    ),
  };

  return {
    location,
    author,
    offer,
  };
}

Array.from({ length: ADVERT_AMOUNT }, createAdvert);
