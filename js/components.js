/**
 * RareLoop - Components
 * UI components: Modal, Cart Page, Mobile Nav
 */

const Components = {
  /**
   * Initialize all components
   */
  init() {
    this.ProductModal.init();
    this.CartPage.init();
  }
};

// ============================================
// Product Modal Component
// ============================================
const ProductModal = {
  isOpen: false,
  currentIndex: 0,
  quantity: 1,

  /**
   * Initialize modal
   */
  init() {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    
    // Close button
    document.getElementById('modal-close')?.addEventListener('click', () => this.close());
    
    // Navigation buttons
    document.getElementById('modal-prev')?.addEventListener('click', () => this.prevImage());
    document.getElementById('modal-next')?.addEventListener('click', () => this.nextImage());
    
    // Quantity controls
    document.getElementById('modal-qty-minus')?.addEventListener('click', () => this.updateQuantity(-1));
    document.getElementById('modal-qty-plus')?.addEventListener('click', () => this.updateQuantity(1));
    
    // Add to cart
    document.getElementById('modal-add-to-cart')?.addEventListener('click', () => this.addToCart());
    
    // Checkout
    document.getElementById('modal-checkout')?.addEventListener('click', () => this.checkout());
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.close();
    });
    
    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
      if (e.key === 'ArrowLeft' && this.isOpen) this.prevImage();
      if (e.key === 'ArrowRight' && this.isOpen) this.nextImage();
    });
  },

  /**
   * Open modal with product
   * @param {number} productIndex - Product index
   */
  open(productIndex = 0) {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    
    this.currentIndex = productIndex;
    this.quantity = 1;
    
    this.render();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.isOpen = true;
  },

  /**
   * Close modal
   */
  close() {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
    this.isOpen = false;
  },

  /**
   * Render modal content
   */
  render() {
    const product = Products.getByIndex(this.currentIndex);
    if (!product) return;
    
    // Update main image
    const mainImage = document.getElementById('modal-main-image');
    if (mainImage && product.image) {
      mainImage.src = product.image;
    }
    
    // Update product info
    const nameEl = document.getElementById('modal-name');
    const categoryEl = document.getElementById('modal-category');
    const priceEl = document.getElementById('modal-price');
    const quantityEl = document.getElementById('modal-quantity');
    const selectedInfoEl = document.getElementById('modal-selected-info');
    
    if (nameEl) nameEl.textContent = product.name;
    if (categoryEl) categoryEl.textContent = product.category;
    if (priceEl) priceEl.textContent = Utilities.formatPrice(product.price);
    if (quantityEl) quantityEl.textContent = this.quantity;
    if (selectedInfoEl) {
      selectedInfoEl.textContent = `Selected: Image ${this.currentIndex + 1} of ${Products.items.length}`;
    }
    
    // Render thumbnails
    this.renderThumbnails();
  },

  /**
   * Render product thumbnails
   */
  renderThumbnails() {
    const container = document.getElementById('modal-all-products');
    if (!container) return;
    
    container.innerHTML = Products.items.map((product, index) => `
      <div class="modal-product-thumb ${index === this.currentIndex ? 'active' : ''}" 
           data-index="${index}">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
    `).join('');
    
    // Add click handlers
    container.querySelectorAll('.modal-product-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        const index = parseInt(thumb.dataset.index);
        this.selectImage(index);
      });
    });
  },

  /**
   * Select image by index
   * @param {number} index - Image index
   */
  selectImage(index) {
    this.currentIndex = index;
    this.render();
  },

  /**
   * Go to previous image
   */
  prevImage() {
    this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : Products.items.length - 1;
    this.render();
  },

  /**
   * Go to next image
   */
  nextImage() {
    this.currentIndex = this.currentIndex < Products.items.length - 1 ? this.currentIndex + 1 : 0;
    this.render();
  },

  /**
   * Update quantity
   * @param {number} delta - Quantity change
   */
  updateQuantity(delta) {
    this.quantity = Math.max(1, this.quantity + delta);
    const quantityEl = document.getElementById('modal-quantity');
    if (quantityEl) {
      quantityEl.textContent = this.quantity;
    }
  },

  /**
   * Add product to cart
   */
  addToCart() {
    const product = Products.getByIndex(this.currentIndex);
    if (!product) return;
    
    // Add multiple quantities
    for (let i = 0; i < this.quantity; i++) {
      Cart.add(product);
    }
    
    Utilities.showToast(`${product.name} x${this.quantity} added to cart!`, 'success');
    this.close();
  },

  /**
   * Proceed to checkout
   */
  checkout() {
    this.addToCart();
    window.location.href = 'cart.html';
  }
};

// ============================================
// Cart Page Component
// ============================================
const CartPage = {
  /**
   * Initialize cart page
   */
  init() {
    this.render();
  },

  /**
   * Render cart
   */
  render() {
    const emptyCart = document.getElementById('empty-cart');
    const cartItems = document.getElementById('cart-items');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (!emptyCart || !cartItems || !cartItemsList) return;
    
    if (Cart.isEmpty()) {
      emptyCart.style.display = 'flex';
      cartItems.style.display = 'none';
      return;
    }
    
    emptyCart.style.display = 'none';
    cartItems.style.display = 'block';
    
    cartItemsList.innerHTML = Cart.getItems().map(item => this.renderCartItem(item)).join('');
    
    if (cartTotal) {
      cartTotal.textContent = Utilities.formatPrice(Cart.getTotal());
    }
    
    if (checkoutBtn) {
      checkoutBtn.disabled = false;
    }
  },

  /**
   * Render cart item
   * @param {Object} item - Cart item
   * @returns {string} HTML string
   */
  renderCartItem(item) {
    const product = Products.getById(item.id);
    const imageSrc = product?.image || '';
    
    return `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-image">
          ${imageSrc 
            ? `<img src="${imageSrc}" alt="${item.name}">`
            : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>`
          }
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.name}</h4>
          <span class="cart-item-price">${Utilities.formatPrice(item.price)}</span>
          <div class="cart-item-quantity">
            <button class="quantity-btn" onclick="CartPage.updateQuantity(${item.id}, ${item.quantity - 1})">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14"/>
              </svg>
            </button>
            <span class="quantity-value">${item.quantity}</span>
            <button class="quantity-btn" onclick="CartPage.updateQuantity(${item.id}, ${item.quantity + 1})">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="CartPage.removeItem(${item.id})" aria-label="Remove item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>
    `;
  },

  /**
   * Update item quantity
   * @param {number} productId - Product ID
   * @param {number} quantity - New quantity
   */
  updateQuantity(productId, quantity) {
    Cart.updateQuantity(productId, quantity);
    this.render();
  },

  /**
   * Remove item from cart
   * @param {number} productId - Product ID
   */
  removeItem(productId) {
    Cart.remove(productId);
    this.render();
    Utilities.showToast('Item removed from cart', 'success');
  }
};

// Make components globally accessible
window.Components = Components;
window.ProductModal = ProductModal;
window.CartPage = CartPage;
