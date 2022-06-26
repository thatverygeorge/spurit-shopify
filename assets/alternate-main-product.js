'use strict';

console.log("You are a curious one, aren't you?");

// ACCORDION
class Accordion {
  constructor(button) {
    this.button = button;
    this.id = this.button.getAttribute('aria-controls');
    this.description = document.getElementById(this.id);
  }

  init() {
    this.button.addEventListener('click', this.toggleAccordion.bind(this));
  }

  destroy() {
    this.button.removeEventListener('click', this.toggleAccordion);
  }

  openAccordion() {
    this.button.setAttribute('aria-expanded', 'true');
    this.description.style.display = 'block';
  }

  closeAccordion() {
    this.button.setAttribute('aria-expanded', 'false');
    this.description.style.display = 'none';
  }

  toggleAccordion() {
    if (this.button.getAttribute('aria-expanded') === 'true') {
      this.closeAccordion();
    } else {
      this.openAccordion();
    }
  }
}

// OPTION PICKER
class OptionPicker {
  constructor(fieldset) {
    this.fieldset = fieldset;
    this.pickedOption = this.fieldset.querySelector('legend span');
  }

  init() {
    const defaultOption = this.fieldset.querySelector(
      'input[type=radio]:checked'
    );
    this.pickedOption.textContent = defaultOption.value;
    this.fieldset.addEventListener(
      'change',
      this.handleOptionChange.bind(this)
    );
  }

  destroy() {
    this.fieldset.removeEventListener('change', this.handleOptionChange);
  }

  handleOptionChange(evt) {
    if (evt.target.matches('input[type=radio]')) {
      this.pickedOption.textContent = evt.target.value;
    }
  }
}

// QUANTITY PICKER

const QUANTITY_STEP = 1;
const MIN_QUANTITY = 1;
const MAX_QUANTITY = 9;

const INPUT_DEFAULT_WIDTH = 40;
class QuantityPicker {
  constructor(fieldset, buttonDecrease, buttonIncrease) {
    this.fieldset = fieldset;
    this.buttonDecrease = buttonDecrease;
    this.buttonIncrease = buttonIncrease;

    this.input = this.fieldset.querySelector('input[type=number]');
    this.error = this.fieldset.querySelector('span[class$=error--quantity]');
  }

  init() {
    this.input.addEventListener('input', this.handleInput.bind(this));
    this.buttonDecrease.addEventListener(
      'click',
      this.decreaseQuantity.bind(this)
    );
    this.buttonIncrease.addEventListener(
      'click',
      this.increaseQuantity.bind(this)
    );
  }

  destroy() {
    this.input.removeEventListener('input', this.handleInput);
    this.buttonDecrease.removeEventListener('click', this.decreaseQuantity);
    this.buttonIncrease.removeEventListener('click', this.increaseQuantity);
  }

  decreaseQuantity() {
    const quantity = this.getInputValue();

    if (quantity <= MIN_QUANTITY) {
      this.showError();
    } else if (quantity - QUANTITY_STEP > MAX_QUANTITY) {
      this.setInputValue(quantity - QUANTITY_STEP);
    } else {
      this.setInputValue(quantity - QUANTITY_STEP);
      this.hideError();
      this.setInvalidityStyleForInput(false);
    }
  }

  increaseQuantity() {
    const quantity = this.getInputValue();

    if (quantity >= MAX_QUANTITY) {
      this.showError();
    } else if (quantity + QUANTITY_STEP < MIN_QUANTITY) {
      this.setInputValue(quantity + QUANTITY_STEP);
    } else {
      this.setInputValue(quantity + QUANTITY_STEP);
      this.hideError();
      this.setInvalidityStyleForInput(false);
    }
  }

  handleInput() {
    const quantity = this.getInputValue();

    if (quantity < MIN_QUANTITY || quantity > MAX_QUANTITY) {
      this.showError();
      this.setInvalidityStyleForInput(true);
    } else {
      this.hideError();
      this.setInvalidityStyleForInput(false);
    }
  }

  getInputValue() {
    return Number(this.input.value);
  }

  setInputValue(newValue) {
    this.input.value = newValue;
  }

  setInvalidityStyleForInput(isInvalid) {
    if (isInvalid) {
      this.input.style.width = `${INPUT_DEFAULT_WIDTH * 2}px`;
    } else {
      this.input.removeAttribute('style');
    }
  }

  showError() {
    this.error.textContent = `You can only select a value between ${MIN_QUANTITY} and ${MAX_QUANTITY}.`;
    this.error.classList.add('active');
  }

  hideError() {
    this.error.textContent = '';
    this.error.classList.remove('active');
  }

  static isQuantityValidForCart(quantity) {
    return quantity >= MIN_QUANTITY && quantity <= MAX_QUANTITY;
  }
}

// FORM
class Form {
  constructor(form, quantityPicker) {
    this.form = form;
    this.quantityPicker = quantityPicker;

    this.error = this.form.querySelector('span[class$=error--form]');
  }

  init() {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  destroy() {
    this.form.removeEventListener('submit', this.handleSubmit);
  }

  showError(message = 'Something went wrong. Please try again later.') {
    this.error.textContent = message;
    this.error.classList.add('active');
  }

  hideError() {
    this.error.textContent = '';
    this.error.classList.remove('active');
  }

  handleSubmit(evt) {
    evt.preventDefault();
    this.quantityPicker.hideError();
    this.hideError();

    const formData = new FormData(evt.target);
    const id = formData.get('id');
    const quantity = formData.get('quantity');

    fetch(Shopify.routes.root + 'cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ id, quantity }],
        sections: 'alternate-header',
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.sections) {
          const event = new CustomEvent('cart:added', {
            detail: {
              updatedHeader: data.sections['alternate-header'],
            },
          });

          window.dispatchEvent(event);
        } else {
          const message = `${data.message} (${data.status}): ${data.description}`;
          throw new Error(message);
        }
      })
      .catch((error) => {
        this.showError(error);
      });
  }
}

Shopify.theme.sections.register('alternate-main-product', {
  accordions: {},
  colorPicker: null,
  quantityPicker: null,
  form: null,

  onLoad: function () {
    const accordionButtons = document.querySelectorAll(
      '.product-description__button'
    );

    for (var i = 0; i < accordionButtons.length; i++) {
      const accordion = new Accordion(accordionButtons[i]);
      this.accordions[accordion.id] = accordion;
      this.accordions[accordion.id].init();
    }

    const colorFieldset = document.querySelector(
      '.order-details-form__fieldset--color'
    );

    this.colorPicker = new OptionPicker(colorFieldset);
    this.colorPicker.init();

    const quantityFieldset = document.querySelector(
      '.order-details-form__fieldset--quantity'
    );
    const buttonDecreaseQuantity = quantityFieldset.querySelector(
      '.order-details-form__button-quantity--decrease'
    );
    const buttonIncreaseQuantity = quantityFieldset.querySelector(
      '.order-details-form__button-quantity--increase'
    );

    this.quantityPicker = new QuantityPicker(
      quantityFieldset,
      buttonDecreaseQuantity,
      buttonIncreaseQuantity
    );
    this.quantityPicker.init();

    const formNode = document.querySelector('.order-details-form');

    this.form = new Form(formNode, this.quantityPicker);
    this.form.init();
  },

  onUnload: function () {
    for (let accordion of Object.values(this.accordions)) {
      accordion.destroy();
    }

    this.colorPicker.destroy();
    this.quantityPicker.destroy();
    this.form.destroy();
  },

  onSelect: function () {},

  onDeselect: function () {},

  onBlockSelect: function (evt) {
    const button = evt.target.querySelector('.product-description__button');
    const id = button.getAttribute('aria-controls');

    this.accordions[id].toggleAccordion();
  },

  onBlockDeselect: function (evt) {
    const button = evt.target.querySelector('.product-description__button');
    const id = button.getAttribute('aria-controls');

    this.accordions[id].toggleAccordion();
  },
});
