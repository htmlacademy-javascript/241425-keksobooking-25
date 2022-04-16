export function getRandom(min, max) {
  if (min > max) {
    throw new Error('Invalid parameters: min should be less than max');
  }

  const amountNumbers = max - min + 1;

  return min + Math.floor(Math.random() * amountNumbers);
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

  function keyDownHadle(e) {
    if (e.key === 'Escape') {
      popup.remove();
      document.removeEventListener('keydown', keyDownHadle);
    }
  }

  if (template) {
    popup.appendChild(template.cloneNode(true));
    popup.addEventListener('click', () => {
      popup.remove();
    });

    document.addEventListener('keydown', keyDownHadle);

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

export function throttle(callback, delayBetweenFrames) {
  let lastTime = 0;

  return (...rest) => {

    const now = new Date();

    if (now - lastTime >= delayBetweenFrames) {
      callback.apply(this, rest);
      lastTime = now;
    }
  };
}
