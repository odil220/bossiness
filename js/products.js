/**
 * RareLoop - Products
 * Products data and rendering logic
 */

const ProductsData = {
  // Products array - skull caps with user's images
  items: [
    {
      id: 1,
      name: 'Classic Black Skull Cap',
      category: 'Accessories',
      price: 8.00,
      image: 'image/IMG_0111.jpg',
      badge: 'Best Seller',
      description: 'Premium quality skull cap in classic black. Perfect for everyday wear.'
    },
    {
      id: 2,
      name: 'Gray Skull Cap',
      category: 'Accessories',
      price: 8.00,
      image: 'image/IMG_0112.jpg',
      description: 'Sleek gray skull cap with minimalist design.'
    },
    {
      id: 3,
      name: 'Navy Blue Skull Cap',
      category: 'Accessories',
      price: 8.00,
      image: 'image/IMG_0113.jpg',
      description: 'Deep navy blue for a sophisticated look.'
    },
    {
      id: 4,
      name: 'Burgundy Skull Cap',
      category: 'Accessories',
      price: 8.00,
      image: 'image/IMG_0114.jpg',
      badge: 'New',
      description: 'Rich burgundy color for fall and winter.'
    },
    {
      id: 5,
      name: 'Forest Green Skull Cap',
      category: 'Accessories',
      price: 8.00,
      image: 'image/IMG_0115.jpg',
      description: 'Earthy forest green tone.'
    },
    {
      id: 6,
      name: 'Charcoal Skull Cap',
      category: 'Accessories',
      price: 8.00,
      image: 'image/IMG_0116.jpg',
      description: 'Dark charcoal for versatile styling.'
    },
    {
      id: 7,
      name: 'Camel Skull Cap',
      category: 'Accessories',
      price: 8.00,
      image: 'image/IMG_0117.jpg',
      description: 'Warm camel tone for autumn.'
    },
    {
      id: 8,
      name: 'Black Skull Cap',
      category: 'Accessories',
      price: 8.00,
      image: 'image/IMG_0118.jpg',
      badge: 'Classic',
      description: 'Timeless black skull cap.'
    },
    {
      id: 9,
      name: 'Tan Skull Cap',
      category: 'Accessories',
      price: 8.00,
      image: 'image/IMG_0120.jpg',
      description: 'Natural tan color for versatile styling.'
    },
    {
      id: 10,
      name: 'Olive Skull Cap',
      category: 'Accessories',
      price: 8.00,
      image: 'image/IMG_0121.jpg',
      description: 'Classic olive green for everyday wear.'
    }
  ],

  /**
   * Get product by ID
   * @param {number} id - Product ID
   * @returns {Object|undefined} Product
   */
  getById(id) {
    return this.items.find(p => p.id === parseInt(id));
  },

  /**
   * Get product by index
   * @param {number} index - Product index
   * @returns {Object|undefined} Product
   */
  getByIndex(index) {
    return this.items[index];
  },

  /**
   * Check if products exist
   * @returns {boolean} Has products
   */
  hasProducts() {
    return this.items.length > 0;
  },

  /**
   * Render products to grid
   * @param {string} gridId - Grid element ID
   * @param {string} emptyId - Empty state element ID
   */
  render(gridId, emptyId) {
    const grid = document.getElementById(gridId);
    const empty = document.getElementById(emptyId);
    
    if (!grid || !empty) return;
    
    if (!this.hasProducts()) {
      grid.style.display = 'none';
      empty.style.display = 'flex';
      return;
    }
    
    empty.style.display = 'none';
    grid.style.display = 'grid';
    
    grid.innerHTML = this.items.map((product, index) => this.renderProductCard(product, index)).join('');
    
    // Add click handlers for product cards
    this.attachProductCardHandlers(grid);
  },

  /**
   * Render single product card
   * @param {Object} product - Product data
   * @param {number} index - Product index
   * @returns {string} HTML string
   */
  renderProductCard(product, index) {
    const badgeHtml = product.badge 
      ? `<span class="product-badge">${product.badge}</span>` 
      : '';
    
    const imageHtml = product.image
      ? `<img src="${product.image}" alt="${product.name}" loading="lazy">`
      : `<div class="product-image-placeholder" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" style="width: 48px; height: 48px; color: var(--color-text-muted);">
             <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
           </svg>
         </div>`;
    
    return `
      <article class="product-card" data-id="${product.id}" data-index="${index}">
        <a href="product-detail.html?id=${product.id}" class="product-card-link">
          <div class="product-image">
            ${imageHtml}
            ${badgeHtml}
          </div>
          <div class="product-info">
            <span class="product-category">${product.category}</span>
            <h3 class="product-title">${product.name}</h3>
            <span class="product-price">${Utilities.formatPrice(product.price)}</span>
          </div>
        </a>
        <div class="product-actions">
          <button class="product-action-btn" aria-label="Add to wishlist" data-action="wishlist" data-id="${product.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
          </button>
          <button class="product-action-btn" aria-label="Quick view" data-action="quickview" data-index="${index}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        </div>
      </article>
    `;
  },

  /**
   * Attach event handlers to product cards
   * @param {HTMLElement} grid - Grid container
   */
  attachProductCardHandlers(grid) {
    // Quick view buttons
    grid.querySelectorAll('[data-action="quickview"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const index = parseInt(btn.dataset.index);
        if (typeof ProductModal !== 'undefined') {
          ProductModal.open(index);
        }
      });
    });
    
    // Wishlist buttons
    grid.querySelectorAll('[data-action="wishlist"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        this.toggleWishlist(id);
      });
    });
  },

  /**
   * Toggle wishlist
   * @param {number} productId - Product ID
   */
  toggleWishlist(productId) {
    const product = this.getById(productId);
    if (product) {
      Utilities.showToast(`${product.name} added to wishlist`, 'success');
    }
  },

  /**
   * Add to cart with feedback
   * @param {number} productId - Product ID
   */
  addToCart(productId) {
    const product = this.getById(productId);
    if (product) {
      Cart.add(product);
      this.showAddedFeedback(productId);
      Utilities.showToast(`${product.name} added to cart`, 'success');
    }
  },

  /**
   * Show added to cart feedback
   * @param {number} productId - Product ID
   */
  showAddedFeedback(productId) {
    const card = document.querySelector(`.product-card[data-id="${productId}"]`);
    if (card) {
      card.style.transform = 'scale(1.02)';
      setTimeout(() => {
        card.style.transform = '';
      }, 200);
    }
  }
};

// Alias for backwards compatibility
const Products = ProductsData;

// Make products globally accessible
window.ProductsData = ProductsData;
window.Products = Products;
