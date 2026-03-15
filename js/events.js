/**
 * RareLoop - Events
 * Event listeners and handlers
 */

const EventHandlers = {
  /**
   * Initialize all event listeners
   */
  init() {
    this.initThemeToggle();
    this.initHeaderScroll();
    this.initMobileNav();
    this.initContactForm();
    this.initCartPage();
    this.initProductDetail();
    this.initWishlistButtons();
  },

  /**
   * Automatic theme switching based on system preferences and time of day
   */
  initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    
    // Function to determine theme based on time and system preference
    const getAutoTheme = () => {
      const hour = new Date().getHours();
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Auto theme: dark from 6 PM to 6 AM, light otherwise
      // But respect system preference as base
      const isNightTime = hour >= 18 || hour < 6;
      
      if (isNightTime) {
        return 'dark';
      }
      
      // During day, respect system preference
      return prefersDark ? 'dark' : 'light';
    };

    // Check for saved manual preference first
    const savedTheme = localStorage.getItem('rareloop-theme');
    
    if (savedTheme && savedTheme !== 'auto') {
      // User has manually set a theme
      if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    } else {
      // Use automatic theme based on time/system
      const autoTheme = getAutoTheme();
      if (autoTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
      // Store the auto setting
      localStorage.setItem('rareloop-theme', 'auto');
    }
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const savedTheme = localStorage.getItem('rareloop-theme');
      if (!savedTheme || savedTheme === 'auto') {
        if (e.matches) {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
      }
    });
    
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      if (newTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      
      localStorage.setItem('rareloop-theme', newTheme);
    });
  },

  /**
   * Header scroll effects
   */
  initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    const handleScroll = Utilities.throttle(() => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
  },

  /**
   * Mobile navigation
   */
  initMobileNav() {
    const toggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const overlay = document.getElementById('overlay');
    
    if (!toggle || !mobileNav || !overlay) return;
    
    toggle.addEventListener('click', () => {
      const isActive = mobileNav.classList.contains('active');
      
      if (isActive) {
        this.closeMobileNav(mobileNav, overlay, toggle);
      } else {
        this.openMobileNav(mobileNav, overlay, toggle);
      }
    });
    
    overlay.addEventListener('click', () => {
      this.closeMobileNav(mobileNav, overlay, toggle);
    });
    
    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        this.closeMobileNav(mobileNav, overlay, toggle);
      }
    });
    
    // Close on nav link click
    mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileNav(mobileNav, overlay, toggle);
      });
    });
  },

  /**
   * Open mobile nav
   */
  openMobileNav(mobileNav, overlay, toggle) {
    mobileNav.classList.add('active');
    overlay.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  },

  /**
   * Close mobile nav
   */
  closeMobileNav(mobileNav, overlay, toggle) {
    mobileNav.classList.remove('active');
    overlay.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  },

  /**
   * Wishlist button handlers
   */
  initWishlistButtons() {
    // Product card wishlist buttons
    document.addEventListener('click', (e) => {
      const wishlistBtn = e.target.closest('.wishlist-btn');
      if (!wishlistBtn) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      const productId = parseInt(wishlistBtn.dataset.id);
      if (!productId) return;
      
      const product = Products.getById(productId);
      if (!product) return;
      
      const added = Wishlist.toggle(product);
      
      if (added) {
        Utilities.showToast(`${product.name} added to wishlist!`, 'success');
      } else {
        Utilities.showToast(`${product.name} removed from wishlist`, 'info');
      }
    });
    
    // Header wishlist toggle button
    const headerWishlistBtn = document.getElementById('wishlist-toggle');
    if (headerWishlistBtn) {
      headerWishlistBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Show wishlist in a modal or navigate to wishlist page
        const wishlistItems = Wishlist.getItems();
        if (wishlistItems.length === 0) {
          Utilities.showToast('Your wishlist is empty', 'info');
        } else {
          // For now, show a toast with count
          Utilities.showToast(`You have ${wishlistItems.length} items in your wishlist!`, 'success');
        }
      });
    }
  },

  /**
   * Contact form handling
   */
  initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleContactSubmit(form);
    });
  },

  /**
   * Handle contact form submission
   * @param {HTMLFormElement} form - Form element
   */
  handleContactSubmit(form) {
    const name = form.querySelector('#name')?.value;
    const email = form.querySelector('#email')?.value;
    const message = form.querySelector('#message')?.value;
    
    // Get submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn?.textContent;
    
    // Show loading state
    if (submitBtn) {
      Utilities.setButtonLoading(submitBtn, true);
      submitBtn.textContent = 'Sending...';
    }
    
    // Simulate form submission
    setTimeout(() => {
      Utilities.showToast(`Thank you, ${name || 'there'}! Your message has been received.`, 'success');
      form.reset();
      
      if (submitBtn) {
        Utilities.setButtonLoading(submitBtn, false);
        submitBtn.textContent = originalText || 'Send Message';
      }
    }, 1000);
  },

  /**
   * Cart page functionality
   */
  initCartPage() {
    if (!document.getElementById('cart-items')) return;
    
    // Render cart on load
    if (typeof CartPage !== 'undefined') {
      CartPage.render();
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (!Cart.isEmpty()) {
          Utilities.showToast('Proceeding to checkout...', 'success');
          // In a real app, redirect to checkout
        }
      });
    }
  },

  /**
   * Product detail page
   */
  initProductDetail() {
    const mainImage = document.getElementById('mainImage');
    if (!mainImage) return;
    
    // Gallery thumbnails
    const thumbs = document.querySelectorAll('.gallery-thumb');
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const src = thumb.querySelector('img')?.src;
        if (src) {
          mainImage.src = src;
          thumbs.forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        }
      });
    });
    
    // Quantity controls
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');
    const qtyValue = document.getElementById('quantity');
    
    let quantity = 1;
    
    if (qtyMinus) {
      qtyMinus.addEventListener('click', () => {
        if (quantity > 1) {
          quantity--;
          if (qtyValue) qtyValue.textContent = quantity;
        }
      });
    }
    
    if (qtyPlus) {
      qtyPlus.addEventListener('click', () => {
        quantity++;
        if (qtyValue) qtyValue.textContent = quantity;
      });
    }
    
    // Add to cart button
    const addToCartBtn = document.getElementById('add-to-cart');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        const productId = Utilities.getUrlParam('id');
        if (productId) {
          const product = Products.getById(productId);
          if (product) {
            // Add multiple quantities
            for (let i = 0; i < quantity; i++) {
              Cart.add(product);
            }
            Utilities.showToast(`${product.name} x${quantity} added to cart!`, 'success');
          }
        }
      });
    }
    
    // Wishlist button on product detail
    const wishlistBtn = document.getElementById('wishlistBtn');
    if (wishlistBtn) {
      wishlistBtn.addEventListener('click', () => {
        const productId = Utilities.getUrlParam('id');
        if (productId) {
          const product = Products.getById(productId);
          if (product) {
            const added = Wishlist.toggle(product);
            if (added) {
              wishlistBtn.classList.add('active');
              Utilities.showToast(`${product.name} added to wishlist!`, 'success');
            } else {
              wishlistBtn.classList.remove('active');
              Utilities.showToast(`${product.name} removed from wishlist`, 'info');
            }
          }
        }
      });
      
      // Update wishlist button state based on current product
      const productId = Utilities.getUrlParam('id');
      if (productId && Wishlist.isInWishlist(parseInt(productId))) {
        wishlistBtn.classList.add('active');
      }
    }
    
    // Update breadcrumb with product name
    const productId = Utilities.getUrlParam('id');
    if (productId) {
      const product = Products.getById(productId);
      const breadcrumbProduct = document.getElementById('breadcrumbProduct');
      const productTitle = document.getElementById('productTitle');
      const productPrice = document.getElementById('productPrice');
      const productDesc = document.getElementById('productDesc');
      
      if (product) {
        if (breadcrumbProduct) breadcrumbProduct.textContent = product.name;
        if (productTitle) productTitle.textContent = product.name;
        if (productPrice) productPrice.textContent = Utilities.formatPrice(product.price);
        if (productDesc) productDesc.textContent = product.description || '';
      }
    }
  }
};

// Make events globally accessible
window.EventHandlers = EventHandlers;
