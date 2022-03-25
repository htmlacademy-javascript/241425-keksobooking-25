import '../pristine/pristine.min.js';

const forms = [
  {
    formSelector: 'ad-form',
    extraSelectors: ['ad-form__slider'],
  },
  {
    formSelector: 'map__filters',
    extraSelectors: [],
  },
];

export function deactivateForms() {
  forms.forEach(({ formSelector, extraSelectors }) => {
    const formElement = document.querySelector(`.${formSelector}`);
    toggleFormActivation(
      'deactivate',
      formElement,
      formSelector,
      extraSelectors
    );
  });
}

export function activateForms() {
  forms.forEach(({ formSelector, extraSelectors }) => {
    const formElement = document.querySelector(`.${formSelector}`);
    toggleFormActivation('activate', formElement, formSelector, extraSelectors);
  });
}

function toggleFormActivation(
  type = 'deactivate',
  formElement,
  formClass,
  selectors = []
) {
  formElement.classList.toggle(`${formClass}--disabled`);

  formElement.querySelectorAll('fieldset').forEach((fieldset) => {
    if (type === 'deactivate') {
      fieldset.setAttribute('disabled', true);
    } else {
      fieldset.removeAttribute('disabled');
    }
  });

  selectors.forEach((selector) => {
    formElement.querySelectorAll(`.${selector}`).forEach((selectElement) => {
      if (type === 'deactivate') {
        selectElement.setAttribute('disabled', true);
      } else {
        selectElement.removeAttribute('disabled', true);
      }
    });
  });
}

const adForm = document.querySelector('.ad-form');
const roomNumber = adForm.querySelector('#room_number');
const capacity = adForm.querySelector('#capacity');
const price = adForm.querySelector('#price');

const pristine = new Pristine(adForm, {
  classTo: 'ad-form__element',
  errorClass: 'ad-form__element--invalid',
  successClass: 'ad-form__element--valid',
  errorTextParent: 'ad-form__element',
  errorTextTag: 'span',
  errorTextClass: 'form__error'
}, false);

adForm.addEventListener('submit', (e) => {
  const isValid = pristine.validate();

  if (!isValid) {
    e.preventDefault();
  }

});

function validateTitle (value) {
  return value.length >= 30 && value.length <= 100;
}
pristine.addValidator(
  adForm.querySelector('#title'),
  validateTitle,
  'Поле должно содержать от 30 до 100 символов'
);

function validatePrice (value) {
  return parseFloat(value) && value > 0 && value <= 100000;
}
function getPriceErrorMessage() {
  if (price.value <= 0) {
    return 'Должно быть положительным числом';
  }
  return 'Должно быть не более 100000';
}
pristine.addValidator(
  price,
  validatePrice,
  getPriceErrorMessage
);

function validateAddress(value) {
  return value.length > 0;
}
pristine.addValidator(
  adForm.querySelector('#address'),
  validateAddress,
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
  return `Это количество комнат максимум для ${+roomNumber.value} гостей `;
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
