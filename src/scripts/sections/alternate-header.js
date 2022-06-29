/* eslint-disable no-empty-function */

import {register} from '@shopify/theme-sections';

// CART
class Cart {
  constructor(item) {
    this.item = item;

    this.cart = this.item.querySelector('span[aria-hidden=true]');
    this.accessibilityCart = this.item.querySelector(
      'span[aria-live=polite][role=status]',
    );
  }

  addItemsToCart(quantity) {
    this.cart.textContent = `cart (${quantity})`;
    this.accessibilityCart.textContent = `items in cart: ${quantity}`;
  }
}

register('alternate-header', {
  cart: null,

  handleCartUpdate(evt) {
    const header = new DOMParser().parseFromString(
      evt.detail.updatedHeader,
      'text/html',
    );

    const targetSpan = header.querySelector('span[aria-hidden=true]');

    if (targetSpan) {
      const quantity = targetSpan.textContent.match(/\d+/)[0];
      this.cart.addItemsToCart(quantity);
    }
  },

  onLoad() {
    const cartItem = document.querySelector('.site-navigation__item--cart');
    this.cart = new Cart(cartItem);

    window.addEventListener('cart:added', this.handleCartUpdate.bind(this));
  },

  onUnload() {
    window.removeEventListener('cart:added', this.handleCartUpdate);
  },

  onSelect() {},

  onDeselect() {},

  onBlockSelect() {},

  onBlockDeselect() {},
});
