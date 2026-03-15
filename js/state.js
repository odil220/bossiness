/**
 * RareLoop - State Management
 * Cart and Wishlist state management with localStorage persistence
 */

const CartState = {
  items: [],
  STORAGE_KEY: 'rareloop-cart',

  /**
   * Initialize cart from localStorage
   */
  init() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.items = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse cart data:', e);
        this.items = [];
      }
    }
    this.updateCartCount();
    return this;
  },

  /**
   * Save cart to localStorage
   */
  save() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
    this.updateCartCount();
  },

  /**
   * Add item to cart
   * @param {Object} product - Product to add
   */
  add(product) {
    const existing = this.items.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
    this.save();
  },

  /**
   * Remove item from cart
   * @param {number} productId - Product ID to remove
   */
  remove(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.save();
  },

  /**
   * Update item quantity
   * @param {number} productId - Product ID
   * @param {number} quantity - New quantity
   */
  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.remove(productId);
      } else {
        item.quantity = quantity;
        this.save();
      }
    }
  },

  /**
   * Get cart total price
   * @returns {number} Total price
   */
  getTotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  /**
   * Get total item count
   * @returns {number} Total count
   */
  getCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  /**
   * Get all cart items
   * @returns {Array} Cart items
   */
  getItems() {
    return [...this.items];
  },

  /**
   * Clear all items from cart
   */
  clear() {
    this.items = [];
    this.save();
  },

  /**
   * Check if cart is empty
   * @returns {boolean} Is empty
   */
  isEmpty() {
    return this.items.length === 0;
  },

  /**
   * Update cart count badge in header
   */
  updateCartCount() {
    const count = this.getCount();
    const badges = document.querySelectorAll('#cart-count');
    
    badges.forEach(badge => {
      if (count > 0) {
        badge.textContent = count;
        badge.classList.remove('hidden');
        badge.style.display = 'inline-flex';
      } else {
        badge.classList.add('hidden');
        badge.style.display = 'none';
      }
    });
  }
};

// Wishlist State Management
const WishlistState = {
  items: [],
  STORAGE_KEY: 'rareloop-wishlist',

  /**
   * Initialize wishlist from localStorage
   */
  init() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.items = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse wishlist data:', e);
        this.items = [];
      }
    }
    this.updateWishlistCount();
    this.updateWishlistButtons();
    return this;
  },

  /**
   * Save wishlist to localStorage
   */
  save() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
    } catch (e) {
      console.error('Failed to save wishlist:', e);
    }
    this.updateWishlistCount();
    this.updateWishlistButtons();
  },

  /**
   * Add item to wishlist
   * @param {Object} product - Product to add
   * @returns {boolean} True if added, false if already exists
   */
  add(product) {
    if (!this.isInWishlist(product.id)) {
      this.items.push({ ...product });
      this.save();
      return true;
    }
    return false;
  },

  /**
   * Remove item from wishlist
   * @param {number} productId - Product ID to remove
   */
  remove(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.save();
  },

  /**
   * Toggle wishlist item
   * @param {Object} product - Product to toggle
   * @returns {boolean} True if added, false if removed
   */
  toggle(product) {
    if (this.isInWishlist(product.id)) {
      this.remove(product.id);
      return false;
    } else {
      this.add(product);
      return true;
    }
  },

  /**
   * Check if product is in wishlist
   * @param {number} productId - Product ID
   * @returns {boolean}
   */
  isInWishlist(productId) {
    return this.items.some(item => item.id === productId);
  },

  /**
   * Get wishlist count
   * @returns {number} Wishlist count
   */
  getCount() {
    return this.items.length;
  },

  /**
   * Get all wishlist items
   * @returns {Array} Wishlist items
   */
  getItems() {
    return [...this.items];
  },

  /**
   * Clear wishlist
   */
  clear() {
    this.items = [];
    this.save();
  },

  /**
   * Update wishlist count badge
   */
  updateWishlistCount() {
    const countEl = document.getElementById('wishlist-count');
    if (countEl) {
      const count = this.getCount();
      countEl.textContent = count;
      if (count > 0) {
        countEl.classList.remove('hidden');
        countEl.style.display = 'inline-flex';
      } else {
        countEl.classList.add('hidden');
        countEl.style.display = 'none';
      }
    }
  },

  /**
   * Update wishlist button states on product cards
   */
  updateWishlistButtons() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
      const productId = parseInt(btn.dataset.id);
      if (this.isInWishlist(productId)) {
        btn.classList.add('active');
        btn.setAttribute('aria-label', 'Remove from wishlist');
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`;
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-label', 'Add to wishlist');
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`;
      }
    });
  }
};

// Alias for backwards compatibility
const Cart = CartState;
const Wishlist = WishlistState;

// Make globally accessible
window.CartState = CartState;
window.WishlistState = WishlistState;
window.Cart = Cart;
window.Wishlist = Wishlist;
