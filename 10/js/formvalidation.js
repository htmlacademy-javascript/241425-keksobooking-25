import '../pristine/pristine.min.js';
import { sendAdvertData } from './api.js';
import { blockSubmitButton, showResultPopup, unblockSubmitButton } from './helpers.js';
import { closeOpenedBaloon, setStartMainMarker } from './map.js';


const adFormNode = document.querySelector('.ad-form');
const roomNumberNode = adFormNode.querySelector('#room_number');
const capacityNode = adFormNode.querySelector('#capacity');
const addressNode = adFormNode.querySelector('#address');
const addressValue = addressNode.value;
const priceNode = adFormNode.querySelector('#price');
const roomTypeNode = adFormNode.querySelector('#type');
const sliderNode = document.querySelector('.ad-form__slider');
const TYPES_MIN_PRICES = {
  'bungalow': 0,
  'flat': 1000,
  'hotel': 3000,
  'house': 5000,
  'palace': 10000,
};
const timeinNode = adFormNode.querySelector('#timein');
const timeoutNode = adFormNode.querySelector('#timeout');

addressNode.addEventListener('input', (e) => {
  e.target.value = addressValue;
});

const pristine = new Pristine(adFormNode, {
  classTo: 'ad-form__element',
  errorClass: 'ad-form__element--invalid',
  successClass: 'ad-form__element--valid',
  errorTextParent: 'ad-form__element',
  errorTextTag: 'span',
  errorTextClass: 'ad-form__error'
}, false);

adFormNode.addEventListener('submit', (e) => {
  e.preventDefault();

  const isValid = pristine.validate();

  if (isValid) {
    const submitBtnNode = e.target.querySelector('[type="submit"]');
    const submitBtnText = submitBtnNode.textContent;

    blockSubmitButton(submitBtnNode);
    sendAdvertData(
      () => {
        clearForm(e.target);
        unblockSubmitButton(submitBtnNode, submitBtnText);
        showResultPopup('#success');
      },
      () => { showResultPopup('#error'); },
      new FormData(e.target)
    );
  }

});

function clearForm(form) {
  form.reset();
  sliderNode.noUiSlider.set(TYPES_MIN_PRICES[roomTypeNode.value]);
}

adFormNode.addEventListener('reset', () => {
  setStartMainMarker();
  closeOpenedBaloon();
  sliderNode.noUiSlider.set(TYPES_MIN_PRICES[roomTypeNode.value]);
});


function validateTitle(value) {
  return value.length >= 30 && value.length <= 100;
}
pristine.addValidator(
  adFormNode.querySelector('#title'),
  validateTitle,
  'Поле должно содержать от 30 до 100 символов'
);

function validateRoomAndCapacity() {
  if (+roomNumberNode.value === 100 || +capacityNode.value === 0) {
    return +roomNumberNode.value === 100 && +capacityNode.value === 0;
  }
  return +roomNumberNode.value >= +capacityNode.value;
}
function getRoomErrorMessage() {
  if (+roomNumberNode.value === 100) {
    return 'Это количество комнат не для гостей';
  }
  return `Максимум гостей для этого количества комнат: ${+roomNumberNode.value}`;
}
function getCapacityErrorMessage() {
  if (+capacityNode.value === 0) {
    return 'Значение \'не для гостей\' коректно для 100 комнат';
  }
}
pristine.addValidator(
  roomNumberNode,
  validateRoomAndCapacity,
  getRoomErrorMessage
);
pristine.addValidator(
  capacityNode,
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
noUiSlider.create(sliderNode, changeMinUiSlider(TYPES_MIN_PRICES[roomTypeNode.value]));

sliderNode.noUiSlider.on('update', () => {
  priceNode.value = sliderNode.noUiSlider.get();
});

roomTypeNode.addEventListener('change', () => {
  priceNode.setAttribute('placeholder', TYPES_MIN_PRICES[roomTypeNode.value]);
  sliderNode.noUiSlider.updateOptions(changeMinUiSlider(TYPES_MIN_PRICES[roomTypeNode.value]));
});
priceNode.addEventListener('input', (e) => {
  sliderNode.noUiSlider.set(e.target.value);
});

function validateMinPrice(value) {
  return value >= TYPES_MIN_PRICES[roomTypeNode.value] && value <= 100000;
}
function getMinPriceErrorMessage() {
  if (priceNode.value < 0) {
    return 'Минимальное значение 0';
  }
  if (priceNode.value < TYPES_MIN_PRICES[roomTypeNode.value]) {
    return `Должно быть не менее ${TYPES_MIN_PRICES[roomTypeNode.value]}`;
  }
  return 'Максимальное значение 100 000';
}
pristine.addValidator(
  priceNode,
  validateMinPrice,
  getMinPriceErrorMessage
);

timeinNode.addEventListener('change', (e) => {
  timeoutNode.value = e.target.value;
});
timeoutNode.addEventListener('change', (e) => {
  timeinNode.value = e.target.value;
});
