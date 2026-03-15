/**
 * RareLoop - Utilities
 * Helper functions and utility methods
 */

const Utilities = {
  /**
   * Format price to currency string
   * @param {number} price - Price value
   * @returns {string} Formatted price
   */
  formatPrice(price) {
    return `$${price.toFixed(2)}`;
  },

  /**
   * Get URL parameter by name
   * @param {string} name - Parameter name
   * @returns {string|null} Parameter value
   */
  getUrlParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  },

  /**
   * Debounce function
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in ms
   * @returns {Function} Debounced function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function
   * @param {Function} func - Function to throttle
   * @param {number} limit - Limit in ms
   * @returns {Function} Throttled function
   */
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Show toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type (success, error, info)
   */
  showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    
    // Remove after delay
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  /**
   * Generate unique ID
   * @returns {string} Unique ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  /**
   * Check if element is in viewport
   * @param {HTMLElement} element - Element to check
   * @returns {boolean} Is in viewport
   */
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * Smooth scroll to element
   * @param {string|HTMLElement} target - Target element or selector
   */
  smoothScrollTo(target) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /**
   * Parse query string to object
   * @returns {Object} Query parameters
   */
  parseQueryString() {
    const params = {};
    const searchParams = new URLSearchParams(window.location.search);
    for (const [key, value] of searchParams) {
      params[key] = value;
    }
    return params;
  },

  /**
   * Add loading state to button
   * @param {HTMLButtonElement} button - Button element
   * @param {boolean} loading - Is loading
   */
  setButtonLoading(button, loading) {
    if (loading) {
      button.classList.add('loading');
      button.disabled = true;
    } else {
      button.classList.remove('loading');
      button.disabled = false;
    }
  },

  /**
   * Get current page name
   * @returns {string} Page name
   */
  getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    return page.replace('.html', '');
  },

  /**
   * Set active nav link
   */
  setActiveNavLink() {
    const currentPage = this.getCurrentPage();
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const linkPage = href?.replace('.html', '') || 'index';
      
      if (linkPage === currentPage || (currentPage === '' && linkPage === 'index')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
};

// Make utilities globally accessible
window.Utilities = Utilities;
