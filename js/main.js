/**
 * RareLoop - Main Entry Point
 * Initializes all modules and functionality
 * 
 * This is the main entry file that coordinates all modules.
 * For a production build, consider using a bundler like webpack or rollup.
 */

// ============================================
// Module Order Matters!
// ============================================
// 1. Utilities (required by others)
// 2. State (Cart, Wishlist)
// 3. Products (depends on utilities)
// 4. Events (depends on utilities, cart, products)
// 5. Animations (depends on utilities)
// 6. Components (depends on all above)

// The modules are loaded in order via script tags in HTML
// This file provides initialization

const App = {
  /**
   * Initialize the application
   */
  init() {
    console.log('RareLoop - Initializing...');
    
    // Set active nav link
    Utilities.setActiveNavLink();
    
    // Initialize cart state
    CartState.init();
    
    // Initialize wishlist state
    WishlistState.init();
    
    // Initialize event handlers
    EventHandlers.init();
    
    // Initialize UI components
    Components.init();
    
    // Initialize animations
    Animations.init();
    
    // Page-specific initialization
    this.initPage();
    
    console.log('RareLoop - Ready!');
  },

  /**
   * Initialize page-specific functionality
   */
  initPage() {
    const page = Utilities.getCurrentPage();
    
    switch (page) {
      case 'products':
        this.initProductsPage();
        break;
      case 'cart':
        this.initCartPage();
        break;
      case 'product-detail':
        this.initProductDetailPage();
        break;
      case 'index':
      case '':
      default:
        this.initHomePage();
        break;
    }
  },

  /**
   * Initialize home page
   */
  initHomePage() {
    // Render products if grid exists
    const productsGrid = document.getElementById('products-grid') || document.getElementById('featured-products-grid');
    const emptyProducts = document.getElementById('empty-products');
    
    if (productsGrid && emptyProducts) {
      Products.render(productsGrid.id, 'empty-products');
    }
  },

  /**
   * Initialize products page
   */
  initProductsPage() {
    const productsGrid = document.getElementById('products-grid');
    const emptyProducts = document.getElementById('empty-products');
    
    if (productsGrid && emptyProducts) {
      Products.render('products-grid', 'empty-products');
    }
  },

  /**
   * Initialize cart page
   */
  initCartPage() {
    // Cart is already rendered by Components.CartPage.init()
  },

  /**
   * Initialize product detail page
   */
  initProductDetailPage() {
    const productId = Utilities.getUrlParam('id');
    if (!productId) return;
    
    const product = Products.getById(productId);
    if (!product) return;
    
    // Update page elements with product data
    const titleEl = document.getElementById('productTitle');
    const priceEl = document.getElementById('productPrice');
    const descEl = document.getElementById('productDesc');
    const breadcrumbEl = document.getElementById('breadcrumbProduct');
    const mainImage = document.getElementById('mainImage');
    
    if (titleEl) titleEl.textContent = product.name;
    if (priceEl) priceEl.textContent = Utilities.formatPrice(product.price);
    if (descEl) descEl.textContent = product.description || '';
    if (breadcrumbEl) breadcrumbEl.textContent = product.name;
    if (mainImage && product.image) mainImage.src = product.image;
  }
};

// ============================================
// Initialize on DOM Ready
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Make sure all dependencies are loaded
  if (typeof Utilities === 'undefined') {
    console.error('Utilities not loaded');
    return;
  }
  if (typeof CartState === 'undefined') {
    console.error('CartState not loaded');
    return;
  }
  if (typeof Products === 'undefined') {
    console.error('Products not loaded');
    return;
  }
  if (typeof EventHandlers === 'undefined') {
    console.error('EventHandlers not loaded');
    return;
  }
  if (typeof Animations === 'undefined') {
    console.error('Animations not loaded');
    return;
  }
  if (typeof Components === 'undefined') {
    console.error('Components not loaded');
    return;
  }
  
  // Initialize the app
  App.init();
});

// Make App globally accessible
window.App = App;
