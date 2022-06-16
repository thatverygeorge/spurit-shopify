'use strict';

console.log("You are a curious one, aren't you?");

const QUANTITY_STEP = 1;
const MIN_QUANTITY = 1;
const MAX_QUANTITY = 9;

const INPUT_DEFAULT_WIDTH = 40;

const fieldsetColor = document.querySelector(
  '.order-details-form__fieldset--color'
);

const fieldsetColorLegendSpan = document.querySelector(
  '.order-details-form__fieldset--color legend span'
);

const inputColorChecked = document.querySelector(
  '.order-details-form__input-color:checked'
);

const buttonDecreaseQuantity = document.querySelector(
  '.order-details-form__button-quantity--decrease'
);

const buttonIncreaseQuantity = document.querySelector(
  '.order-details-form__button-quantity--increase'
);

const inputQuantity = document.querySelector(
  '.order-details-form__input-quantity'
);

const quantityError = document.querySelector(
  '.order-details-form__quantity-error'
);

const buttonAddToCart = document.querySelector(
  '.order-details-form__button--add-to-cart'
);

const cart = document.querySelector(
  '.site-navigation__item--cart span[aria-hidden="true"]'
);

const cartHidden = document.querySelector(
  '.site-navigation__item--cart span.visually-hidden'
);

const formOrderDetails = document.querySelector('.order-details-form');

const productDescriptionWrapper = document.querySelector(
  '.product-description__wrapper'
);

fieldsetColorLegendSpan.textContent = inputColorChecked.value;

function showError(message) {
  quantityError.textContent = message;
  quantityError.classList.add('active');
}

function hideError() {
  quantityError.textContent = '';
  quantityError.classList.remove('active');
}

buttonDecreaseQuantity.addEventListener('click', () => {
  if (Number(inputQuantity.value) <= MIN_QUANTITY) {
    showError(
      `You can only select a value that is no less than ${MIN_QUANTITY}.`
    );
  } else {
    inputQuantity.value = Number(inputQuantity.value) - QUANTITY_STEP;
    hideError();
  }
});

buttonIncreaseQuantity.addEventListener('click', () => {
  if (Number(inputQuantity.value) >= MAX_QUANTITY) {
    showError(
      `You can only select a value that is no more than ${MAX_QUANTITY}.`
    );
  } else {
    inputQuantity.value = Number(inputQuantity.value) + QUANTITY_STEP;
    hideError();
  }
});

inputQuantity.addEventListener('input', (evt) => {
  const quantity = Number(evt.target.value);
  if (quantity < MIN_QUANTITY || quantity > MAX_QUANTITY) {
    evt.target.style.width = `${INPUT_DEFAULT_WIDTH * 2}px`;
  } else {
    evt.target.removeAttribute('style');
  }
});

fieldsetColor.addEventListener('change', (evt) => {
  if (evt.target.matches('.order-details-form__input-color')) {
    fieldsetColorLegendSpan.textContent = evt.target.value;
  }
});

buttonAddToCart.addEventListener('click', () => {
  const quantity = Number(inputQuantity.value);

  if (quantity < MIN_QUANTITY) {
    showError(
      `You can only select a value that is no less than ${MIN_QUANTITY}.`
    );
    inputQuantity.focus();
  } else if (quantity > MAX_QUANTITY) {
    showError(
      `You can only select a value that is no more than ${MAX_QUANTITY}.`
    );
    inputQuantity.focus();
  } else {
    hideError();
    cart.textContent = `cart (${inputQuantity.value})`;
    cartHidden.textContent = `items in cart: ${inputQuantity.value}`;
  }
});

formOrderDetails.addEventListener('submit', (evt) => {
  evt.preventDefault();
  hideError();

  const data = new FormData(evt.target);

  const size = data.get('size');
  const color = data.get('color');
  const quantity = Number(data.get('quantity'));
  console.log({ size, color, quantity });
});

productDescriptionWrapper.addEventListener('click', (evt) => {
  const { target } = evt;

  if (!target.matches('.product-description__button')) {
    return;
  }

  const id = target.getAttribute('aria-controls');
  const description = document.getElementById(id);
  const isExpanded =
    target.getAttribute('aria-expanded') === 'true' ? true : false;

  description.style.display = isExpanded ? 'none' : 'block';
  target.setAttribute('aria-expanded', !isExpanded);
});
