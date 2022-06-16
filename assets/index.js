'use strict';

console.log("You are a curious one, aren't you?");

(() => {
  const QUANTITY_STEP = 1;
  const MIN_QUANTITY = 1;
  const MAX_QUANTITY = 9;

  const INPUT_DEFAULT_WIDTH = 40;

  // COLOR

  const colorFieldset = document.querySelector(
    '.order-details-form__fieldset--color'
  );

  const colorLegend = document.querySelector(
    '.order-details-form__fieldset--color legend span'
  );

  const colorInputChecked = document.querySelector(
    '.order-details-form__input-color:checked'
  );

  colorLegend.textContent = colorInputChecked.value;

  colorFieldset.addEventListener('change', (evt) => {
    if (evt.target.matches('.order-details-form__input-color')) {
      colorLegend.textContent = evt.target.value;
    }
  });

  // DESCRIPTION

  const descriptionWrapper = document.querySelector(
    '.product-description__wrapper'
  );

  descriptionWrapper.addEventListener('click', (evt) => {
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

  // QUANTITY

  const quantityError = document.querySelector(
    '.order-details-form__quantity-error'
  );

  function showError() {
    quantityError.textContent = `You can only select a value between ${MIN_QUANTITY} and ${MAX_QUANTITY}.`;
    quantityError.classList.add('active');
  }

  function hideError() {
    quantityError.textContent = '';
    quantityError.classList.remove('active');
  }

  const inputQuantity = document.querySelector(
    '.order-details-form__input-quantity'
  );

  function setInvalidStyle(isInvalid) {
    if (isInvalid) {
      inputQuantity.style.width = `${INPUT_DEFAULT_WIDTH * 2}px`;
    } else {
      inputQuantity.removeAttribute('style');
    }
  }

  function getQuantity() {
    return Number(inputQuantity.value);
  }

  function setQuantity(newValue) {
    inputQuantity.value = newValue;
  }

  inputQuantity.addEventListener('input', (evt) => {
    const quantity = Number(evt.target.value);

    if (quantity < MIN_QUANTITY || quantity > MAX_QUANTITY) {
      showError();
      setInvalidStyle(true);
    } else {
      hideError();
      setInvalidStyle(false);
    }
  });

  const buttonDecreaseQuantity = document.querySelector(
    '.order-details-form__button-quantity--decrease'
  );

  buttonDecreaseQuantity.addEventListener('click', () => {
    const quantity = getQuantity();

    if (quantity <= MIN_QUANTITY) {
      showError();
    } else if (quantity - QUANTITY_STEP > MAX_QUANTITY) {
      setQuantity(quantity - QUANTITY_STEP);
    } else {
      setQuantity(quantity - QUANTITY_STEP);
      hideError();
      setInvalidStyle(false);
    }
  });

  const buttonIncreaseQuantity = document.querySelector(
    '.order-details-form__button-quantity--increase'
  );

  buttonIncreaseQuantity.addEventListener('click', () => {
    const quantity = getQuantity();

    if (quantity >= MAX_QUANTITY) {
      showError();
    } else if (quantity + QUANTITY_STEP < MIN_QUANTITY) {
      setQuantity(quantity + QUANTITY_STEP);
    } else {
      setQuantity(quantity + QUANTITY_STEP);
      hideError();
      setInvalidStyle(false);
    }
  });

  // ADD TO CART

  const buttonAddToCart = document.querySelector(
    '.order-details-form__button--add-to-cart'
  );

  const cart = document.querySelector(
    '.site-navigation__item--cart span[aria-hidden="true"]'
  );

  const cartHidden = document.querySelector(
    '.site-navigation__item--cart span.visually-hidden'
  );

  buttonAddToCart.addEventListener('click', () => {
    const quantity = getQuantity();

    if (quantity >= MIN_QUANTITY && quantity <= MAX_QUANTITY) {
      hideError();
      cart.textContent = `cart (${quantity})`;
      cartHidden.textContent = `items in cart: ${quantity}`;
    }
  });

  // FORM

  const form = document.querySelector('.order-details-form');

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    hideError();

    const data = new FormData(evt.target);

    const size = data.get('size');
    const color = data.get('color');
    const quantity = Number(data.get('quantity'));
    console.log({ size, color, quantity });
  });
})();
