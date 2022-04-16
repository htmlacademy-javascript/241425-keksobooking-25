export function showErrorMessage(message) {
  const errorNode = document.createElement('div');
  errorNode.style.zIndex = 100;
  errorNode.style.position = 'fixed';
  errorNode.style.left = 0;
  errorNode.style.top = 0;
  errorNode.style.right = 0;
  errorNode.style.padding = '10px 3px';
  errorNode.style.fontSize = '20px';
  errorNode.style.textAlign = 'center';
  errorNode.style.backgroundColor = 'red';

  errorNode.textContent = message;

  document.body.append(errorNode);

  setTimeout(() => {
    errorNode.remove();
  }, 3000);
}

export function showResultPopup(selector) {
  const popup = document.createElement('div');
  popup.classList.add('container-result');
  const template = document.querySelector(selector).content;

  function keyDownHandle(e) {
    if (e.key === 'Escape') {
      popup.remove();
      document.removeEventListener('keydown', keyDownHandle);
    }
  }

  function clickHandle() {
    popup.remove();
    document.removeEventListener('keydown', keyDownHandle);
  }

  if (template) {
    popup.appendChild(template.cloneNode(true));

    popup.addEventListener('click', clickHandle);

    document.addEventListener('keydown', keyDownHandle);

    const errorBtnNode = popup.querySelector('.error__button');
    if (errorBtnNode) {
      errorBtnNode.addEventListener('click', popup.remove());
    }
    document.body.insertAdjacentElement('beforeend', popup);
  }
}

export function blockSubmitButton(btnSelector, textBtn = 'Сохраняю...') {
  btnSelector.disabled = true;
  btnSelector.classList.add('disabled');
  btnSelector.textContent = textBtn;
}

export function unblockSubmitButton(btnSelector, textBtn = 'Сохранить') {
  btnSelector.disabled = false;
  btnSelector.classList.remove('disabled');
  btnSelector.textContent = textBtn;
}

export function debounce(callback, timeoutDelay = 500) {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
}
