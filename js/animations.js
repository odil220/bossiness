/**
 * RareLoop - Animations
 * GSAP animations and scroll-triggered effects
 */

const Animations = {
  gsap: null,
  ScrollTrigger: null,

  /**
   * Load GSAP library
   * @returns {Promise} GSAP instance
   */
  async loadGSAP() {
    if (this.gsap) return this.gsap;
    
    return new Promise((resolve) => {
      if (typeof gsap !== 'undefined') {
        this.gsap = gsap;
        resolve(gsap);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
      script.onload = () => {
        this.gsap = window.gsap;
        resolve(window.gsap);
      };
      document.head.appendChild(script);
    });
  },

  /**
   * Load GSAP ScrollTrigger
   * @returns {Promise} ScrollTrigger instance
   */
  async loadScrollTrigger() {
    if (this.ScrollTrigger) return this.ScrollTrigger;
    
    return new Promise((resolve) => {
      if (typeof ScrollTrigger !== 'undefined') {
        this.ScrollTrigger = ScrollTrigger;
        resolve(ScrollTrigger);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
      script.onload = () => {
        this.ScrollTrigger = window.ScrollTrigger;
        resolve(window.ScrollTrigger);
      };
      document.head.appendChild(script);
    });
  },

  /**
   * Initialize all animations
   */
  async init() {
    const gsap = await this.loadGSAP();
    const ScrollTrigger = await this.loadScrollTrigger();
    
    gsap.registerPlugin(ScrollTrigger);
    
    this.initHeroAnimations(gsap);
    this.initHeaderAnimation(gsap);
    this.initSectionAnimations(gsap, ScrollTrigger);
    this.initFooterAnimations(gsap);
    this.initProductCardAnimations(gsap);
    this.initPageTitleAnimation(gsap);
    this.initBreadcrumbAnimation(gsap);
  },

  /**
   * Hero section animations
   * @param {Object} gsap - GSAP instance
   */
  initHeroAnimations(gsap) {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroBtn = document.querySelector('.hero .btn');
    
    if (heroTitle) {
      gsap.from(heroTitle, {
        duration: 1.2,
        y: 60,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.2
      });
    }
    
    if (heroSubtitle) {
      gsap.from(heroSubtitle, {
        duration: 1,
        y: 40,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.4
      });
    }
    
    if (heroBtn) {
      gsap.from(heroBtn, {
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.6
      });
    }
  },

  /**
   * Header animation
   * @param {Object} gsap - GSAP instance
   */
  initHeaderAnimation(gsap) {
    const header = document.querySelector('.header');
    if (!header) return;
    
    gsap.from(header, {
      duration: 0.8,
      y: -60,
      opacity: 0,
      ease: 'power3.out'
    });
  },

  /**
   * Section scroll-triggered animations
   * @param {Object} gsap - GSAP instance
   * @param {Object} ScrollTrigger - ScrollTrigger instance
   */
  initSectionAnimations(gsap, ScrollTrigger) {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        duration: 0.8,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
      });
    });
  },

  /**
   * Footer animations
   * @param {Object} gsap - GSAP instance
   */
  initFooterAnimations(gsap) {
    const footer = document.querySelector('.footer');
    if (!footer) return;
    
    const footerBrand = footer.querySelector('.footer-brand');
    const footerLinks = footer.querySelector('.footer-links');
    const footerCopyright = footer.querySelector('.footer-copyright');
    
    if (footerBrand) {
      gsap.from(footerBrand, {
        duration: 0.8,
        x: -30,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.2
      });
    }
    
    if (footerLinks) {
      gsap.from(footerLinks, {
        duration: 0.8,
        x: 30,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.4
      });
    }
    
    if (footerCopyright) {
      gsap.from(footerCopyright, {
        duration: 0.6,
        y: 20,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.6
      });
    }
  },

  /**
   * Product card 3D tilt effect
   * @param {Object} gsap - GSAP instance
   */
  initProductCardAnimations(gsap) {
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        gsap.to(card, {
          duration: 0.3,
          rotateX: rotateX,
          rotateY: rotateY,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          duration: 0.5,
          rotateX: 0,
          rotateY: 0,
          ease: 'power2.out'
        });
      });
    });
  },

  /**
   * Page title animation
   * @param {Object} gsap - GSAP instance
   */
  initPageTitleAnimation(gsap) {
    const pageTitle = document.querySelector('.page-title');
    if (!pageTitle) return;
    
    gsap.from(pageTitle, {
      duration: 0.8,
      x: -30,
      opacity: 0,
      ease: 'power3.out'
    });
  },

  /**
   * Breadcrumb animation
   * @param {Object} gsap - GSAP instance
   */
  initBreadcrumbAnimation(gsap) {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (!breadcrumb) return;
    
    gsap.from(breadcrumb, {
      duration: 0.6,
      y: -10,
      opacity: 0,
      ease: 'power3.out'
    });
  },

  /**
   * Parallax effect for elements
   * @param {string} selector - Element selector
   * @param {number} speed - Parallax speed
   */
  initParallax(selector, speed = 0.5) {
    this.loadGSAP().then(gsap => {
      this.loadScrollTrigger().then(ScrollTrigger => {
        gsap.registerPlugin(ScrollTrigger);
        
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          gsap.to(el, {
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            },
            y: () => window.innerHeight * speed,
            ease: 'none'
          });
        });
      });
    });
  },

  /**
   * Animate element entrance
   * @param {string} selector - Element selector
   * @param {Object} options - Animation options
   */
  animateEntrance(selector, options = {}) {
    const defaults = {
      duration: 0.8,
      y: 40,
      opacity: 0,
      ease: 'power3.out',
      delay: 0
    };
    
    const config = { ...defaults, ...options };
    
    this.loadGSAP().then(gsap => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        gsap.from(el, config);
      });
    });
  }
};

// Make animations globally accessible
window.Animations = Animations;

// Auto-init when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  Animations.init();
});
