const TYPES_OF_HOUSE = {
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
  hotel: 'Отель',
};

function createFragment(dataArray, template, addClass = '', attrName = null) {
  if (!dataArray || dataArray.lengtn === 0) {
    return null;
  }

  const fragment = document.createDocumentFragment();
  dataArray.forEach((dataItem) => {
    const item = template.cloneNode();
    if (addClass !== '') {
      item.classList.add(`${addClass}${dataItem}`);
    }
    if (attrName) {
      item.setAttribute(attrName, dataItem);
    }
    fragment.appendChild(item);
  });

  return fragment;
}

export function generateCard({ author, offer }, template) {
  const advert = template.cloneNode(true);

  const photoImgTemplate = advert.querySelector('.popup__photos img');
  const featureItemTemplate = advert.querySelector('.popup__feature');

  function updateAdvert(elemClass, content = '', dependencies = []) {
    const elem = advert.querySelector(elemClass);
    if (elem) {
      const isAllData =
        dependencies.length === 0 ||
        !dependencies.some((item) => item === undefined);

      if (isAllData && content) {
        elem.textContent = content;
      } else {
        elem.remove();
      }
    }
  }

  function updateAdvertAttr(elemClass, attrName = null, attrData) {
    const elem = advert.querySelector(elemClass);
    if (elem) {
      if (attrName && (attrData === '' || attrData)) {
        elem.setAttribute(attrName, attrData);
      } else {
        elem.remove();
      }
    }
  }

  function updateAdvertFragment(parentClass, fragment = null) {
    const parentEl = advert.querySelector(parentClass);
    if (parentEl) {
      if (fragment) {
        parentEl.innerHTML = '';
        parentEl.appendChild(fragment);
      } else {
        parentEl.remove();
      }
    }
  }

  updateAdvertAttr('.popup__avatar', 'src', author.avatar);

  updateAdvert('.popup__title', offer.title);
  updateAdvert('.popup__text--address', offer.address);
  updateAdvert('.popup__text--price', `${offer.price} ₽/ночь`, [offer.price]);
  updateAdvert('.popup__type', TYPES_OF_HOUSE[offer.type], [offer.type]);
  updateAdvert(
    '.popup__text--capacity',
    `${offer.rooms} комнаты для ${offer.guests} гостей`,
    [offer.rooms, offer.guests]
  );
  updateAdvert(
    '.popup__text--time',
    `Заезд после ${offer.checkin}, выезд до ${offer.checkout}`,
    [offer.checkin, offer.checkout]
  );

  const featuresFragment = createFragment(
    offer.features,
    featureItemTemplate,
    'popup__feature--'
  );
  updateAdvertFragment('.popup__features', featuresFragment);

  updateAdvert('.popup__description', offer.description);

  const photosFragment = createFragment(
    offer.photos,
    photoImgTemplate,
    '',
    'src'
  );
  updateAdvertFragment('.popup__photos', photosFragment);

  const card = document.createElement('div');
  card.classList.add('card');
  card.appendChild(advert);

  return card;
}

