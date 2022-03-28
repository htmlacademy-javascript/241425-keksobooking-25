import '../pristine/pristine.min.js';

const adForm = document.querySelector('.ad-form');
const roomNumber = adForm.querySelector('#room_number');
const capacity = adForm.querySelector('#capacity');
const address = adForm.querySelector('#address');
const addressValue = address.value;
const price = adForm.querySelector('#price');
const roomType = adForm.querySelector('#type');
const sliderElement = document.querySelector('.ad-form__slider');
const TYPES_MIN_PRICES = {
  'bungalow': 0,
  'flat': 1000,
  'hotel': 3000,
  'house': 5000,
  'palace': 10000,
};
const timein = adForm.querySelector('#timein');
const timeout = adForm.querySelector('#timeout');

address.addEventListener('input', (e) => {
  e.target.value = addressValue;
});

const pristine = new Pristine(adForm, {
  classTo: 'ad-form__element',
  errorClass: 'ad-form__element--invalid',
  successClass: 'ad-form__element--valid',
  errorTextParent: 'ad-form__element',
  errorTextTag: 'span',
  errorTextClass: 'ad-form__error'
}, false);

adForm.addEventListener('submit', (e) => {
  const isValid = pristine.validate();

  if (!isValid) {
    e.preventDefault();
  }

});

function validateTitle(value) {
  return value.length >= 30 && value.length <= 100;
}
pristine.addValidator(
  adForm.querySelector('#title'),
  validateTitle,
  'Поле должно содержать от 30 до 100 символов'
);

function validateRoomAndCapacity() {
  if (+roomNumber.value === 100 || +capacity.value === 0) {
    return +roomNumber.value === 100 && +capacity.value === 0;
  }
  return +roomNumber.value >= +capacity.value;
}
function getRoomErrorMessage() {
  if (+roomNumber.value === 100) {
    return 'Это количество комнат не для гостей';
  }
  return `Максимум гостей для этого количества комнат: ${+roomNumber.value}`;
}
function getCapacityErrorMessage() {
  if (+capacity.value === 0) {
    return 'Значение \'не для гостей\' коректно для 100 комнат';
  }
}
pristine.addValidator(
  roomNumber,
  validateRoomAndCapacity,
  getRoomErrorMessage
);
pristine.addValidator(
  capacity,
  validateRoomAndCapacity,
  getCapacityErrorMessage
);

function changeMinUiSlider(min) {
  return {
    range: {
      min: min,
      max: 100000,
    },
    start: 0,
    step: 100,
    format: {
      to: function (value) {
        return value.toFixed(0);
      },
      from: function (value) {
        return parseFloat(value).toFixed(0);
      },
    },
  };
}
noUiSlider.create(sliderElement, changeMinUiSlider(TYPES_MIN_PRICES[roomType.value]));

sliderElement.noUiSlider.on('update', () => {
  price.value = sliderElement.noUiSlider.get();
});

roomType.addEventListener('change', () => {
  price.setAttribute('placeholder', TYPES_MIN_PRICES[roomType.value]);
  sliderElement.noUiSlider.updateOptions(changeMinUiSlider(TYPES_MIN_PRICES[roomType.value]));
});
price.addEventListener('input', (e) => {
  sliderElement.noUiSlider.set(e.target.value);
});
function validateMinPrice(value) {
  return value >= TYPES_MIN_PRICES[roomType.value] && value <= 100000;
}
function getMinPriceErrorMessage() {
  if (price.value < 0) {
    return 'Минимальное значение 0';
  }
  if (price.value < TYPES_MIN_PRICES[roomType.value]) {
    return `Должно быть не менее ${TYPES_MIN_PRICES[roomType.value]}`;
  }
  return 'Максимальное значение 100 000';
}
pristine.addValidator(
  price,
  validateMinPrice,
  getMinPriceErrorMessage
);

timein.addEventListener('change', (e) => {
  timeout.value = e.target.value;
});
timeout.addEventListener('change', (e) => {
  timein.value = e.target.value;
});
