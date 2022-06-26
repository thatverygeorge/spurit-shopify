// CART
class Cart {
  constructor(item) {
    this.item = item;

    this.cart = this.item.querySelector('span[aria-hidden=true]');
    this.accessibilityCart = this.item.querySelector(
      'span[aria-live=polite][role=status]'
    );
  }

  addItemsToCart(quantity) {
    this.cart.textContent = `cart (${quantity})`;
    this.accessibilityCart.textContent = `items in cart: ${quantity}`;
  }
}

Shopify.theme.sections.register('alternate-header', {
  cart: null,

  handleCartUpdate: function (evt) {
    const header = new DOMParser().parseFromString(
      evt.detail.updatedHeader,
      'text/html'
    );

    const targetSpan = header.querySelector('span[aria-hidden=true]');

    if (targetSpan) {
      const quantity = targetSpan.textContent.match(/\d+/)[0];
      this.cart.addItemsToCart(quantity);
    }
  },

  onLoad: function () {
    const cartItem = document.querySelector('.site-navigation__item--cart');
    this.cart = new Cart(cartItem);

    window.addEventListener('cart:added', this.handleCartUpdate.bind(this));
  },

  onUnload: function () {
    window.removeEventListener('cart:added', this.handleCartUpdate);
  },

  onSelect: function () {},

  onDeselect: function () {},

  onBlockSelect: function () {},

  onBlockDeselect: function () {},
});
