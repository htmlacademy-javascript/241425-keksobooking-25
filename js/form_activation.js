
export function deactivateElement(selector) {

  const element = document.querySelector(`.${selector}`);

  element.classList.add(`${selector}--disabled`);

  element.querySelectorAll('fieldset').forEach((fieldset) => {
    fieldset.setAttribute('disabled', true);
  });
}

export function activateElement(selector) {

  const element = document.querySelector(`.${selector}`);

  if (element.classList.contains(`${selector}--disabled`)) {
    element.classList.remove(`${selector}--disabled`);
  }

  element.querySelectorAll('fieldset').forEach((fieldset) => {
    fieldset.removeAttribute('disabled');
  });
}

