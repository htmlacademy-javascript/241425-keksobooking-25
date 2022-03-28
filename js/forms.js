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
  if (type === 'activate') {
    formElement.classList.remove(`${formClass}--disabled`);
  } else if (formElement.classList.contains(`.${formClass}--disabled`) && type === 'deactivate') {
    formElement.classList.add(`${formClass}--disabled`);
  }


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
