export function getRandom(min, max) {
  if (min > max) {
    throw new Error('Invalid parameters: min should be less than max');
  }

  const amountNumbers = max - min + 1;

  return min + Math.floor(Math.random() * amountNumbers);
}

export function getRandomFloat(min, max, signsAmount) {
  const lower = Math.min(Math.abs(min), Math.abs(max));
  const upper = Math.max(Math.abs(min), Math.abs(max));
  const result = Math.random() * (upper - lower) + lower;

  return +result.toFixed(signsAmount);
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

export function createRandomDescription(minWords, maxWords) {
  let desc = Array.from({ length: getRandom(minWords, maxWords) }, () =>
    createRandomWord(3, 10)
  ).join(' ');

  desc = capitalizeFirstLetter(desc);

  return desc;
}

export function createListWithNoRepeats(
  possibleValuesList,
  amountElemToReturn = 1,
  reservedElemList = null
) {
  if (amountElemToReturn >= possibleValuesList) {
    return possibleValuesList;
  }

  const reservedList = reservedElemList ? reservedElemList : new Set();

  const finalElemList = Array.from({ length: amountElemToReturn }).map(() => {
    let isUnique = false;
    let elem = '';

    while (!isUnique) {
      elem = possibleValuesList[getRandom(0, possibleValuesList.length - 1)];

      if (reservedList.has(elem)) {
        continue;
      }

      reservedList.add(elem);
      isUnique = true;
    }
    return elem;
  });

  return finalElemList;
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

  if (template) {
    popup.appendChild(template.cloneNode(true));
    popup.addEventListener('click', () => {
      popup.remove();
    });
    popup.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        popup.remove();
      }
    });
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
