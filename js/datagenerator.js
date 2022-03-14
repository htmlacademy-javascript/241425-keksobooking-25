import {
  getRandom,
  getRandomFloat,
  createRandomWord,
  createRandomDescription,
  createListWithNoRepeats,
} from './helpers.js';

const USER_ID_AMOUNT = 10;
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

function createLocation() {
  return {
    lat: getRandomFloat(35.65, 35.7, 5),
    lng: getRandomFloat(139.7, 139.8, 5),
  };
}

function createAvatarSrc() {
  const reservedIdsCopy = new Set(reservedIds);

  const numberNoRepeated = createListWithNoRepeats(
    userIds,
    1,
    reservedIdsCopy
  )[0];

  reservedIds.add(numberNoRepeated);

  const userId = (numberNoRepeated < 10 ? '0' : '') + numberNoRepeated;
  const avatarSrc = `img/avatars/user${userId}.png`;
  return avatarSrc;
}

function createAdvert() {
  const location = createLocation();

  const author = {
    avatar: createAvatarSrc(USER_ID_AMOUNT),
  };

  const offer = {
    address: `${location.lat}, ${location.lng}`,
    title: createRandomWord(10, 15, true),
    description: createRandomDescription(2, 7),
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

export function generateData(advertAmount = 1) {
  return Array.from({ length: advertAmount }, createAdvert);
}
