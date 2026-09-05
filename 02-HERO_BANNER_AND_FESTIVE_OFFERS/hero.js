/**
 * HERO BANNER & FESTIVE OFFERS COMPONENT
 * Step 13: Hero Banner Showcase Studio & Universal On-Page Inline Text Editing
 * Features:
 * - Dynamic Hero Showcase Studio: Single Static Spotlight vs Multi-Product Carousel Slider
 * - 4-Second Automated Carousel with Smooth Transitions, Touch-Swipe & Indicator Navigation
 * - Dynamic Monogram Overlay Badge synchronized with active slide title & price
 * - Direct On-Page Universal Inline Text Editing with Cloud Firestore Sync
 * - Floating Edit HUD & Showcase Studio Modal for Authenticated Admins
 */

import { storeConfig } from '../07-STORE_SETTINGS_AND_THEME_COLORS/store_config.js';
import { getProducts } from '../03-PRODUCT_CARDS_AND_IMAGE_GALLERY/gallery.js';
import { 
  uploadToImgBB, 
  subscribeToHeroSettings, 
  saveHeroSettingsToCloud, 
  subscribeToHomepageContent, 
  saveHomepageContentToCloud 
} from '../07-STORE_SETTINGS_AND_THEME_COLORS/firebase_sync.js';

export const DEFAULT_HERO_SETTINGS = {
  mode: "carousel", // "single" | "carousel"
  selectedProductIds: ["prod-1", "prod-2", "prod-3"],
  customBannerUrl: "",
  customTitle: "",
  customPrice: ""
};

export const DEFAULT_HOMEPAGE_CONTENT = {
  ticker_announcement: "✨ Grand Festive Collection 2026 Live Now | 🚚 Fast Pan-India Shipping on All Orders | 💳 Cash on Delivery Available | 🛡️ Verified Premium Fabric & Easy Returns",
  hero_subtitle: "Festive Collection 2026",
  hero_title: "Grand Festive Collection 2026",
  hero_description: "Celebrate Ganesh Chaturthi and upcoming festivities in pure elegance. Hand-crafted designer kurtas, festive sarees, and coordinated couple sets delivered to your doorstep.",
  hero_cta_text: "Shop Festive Edit",
  hero_cta_link: "#festive",
  hero_secondary_cta_text: "Explore Collection",
  hero_secondary_cta_link: "#catalog",
  hero_promo: "Festive Offer: Use code FESTIVE2026 for 15% off"
};

export const DEFAULT_HERO_CONFIG = {
  headlineTag: DEFAULT_HOMEPAGE_CONTENT.hero_subtitle,
  mainHeading: DEFAULT_HOMEPAGE_CONTENT.hero_title,
  subHeading: DEFAULT_HOMEPAGE_CONTENT.hero_description,
  promoBadgeText: DEFAULT_HOMEPAGE_CONTENT.hero_promo,
  heroImageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
  primaryCtaText: DEFAULT_HOMEPAGE_CONTENT.hero_cta_text,
  primaryCtaLink: DEFAULT_HOMEPAGE_CONTENT.hero_cta_link,
  secondaryCtaText: DEFAULT_HOMEPAGE_CONTENT.hero_secondary_cta_text,
  secondaryCtaLink: DEFAULT_HOMEPAGE_CONTENT.hero_secondary_cta_link
};

export function getHeroConfig() {
  return DEFAULT_HERO_CONFIG;
}

export function getHeroSettings() {
  const cached = localStorage.getItem('fp_hero_settings');
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      return { ...DEFAULT_HERO_SETTINGS, ...parsed };
    } catch (e) {
      console.error("Error parsing fp_hero_settings from localStorage", e);
    }
  }
  return { ...DEFAULT_HERO_SETTINGS };
}

export function getHomepageContent() {
  const cached = localStorage.getItem('fp_homepage_content');
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      return { ...DEFAULT_HOMEPAGE_CONTENT, ...parsed };
    } catch (e) {
      console.error("Error parsing fp_homepage_content from localStorage", e);
    }
  }
  return { ...DEFAULT_HOMEPAGE_CONTENT };
}

// Helper to check if visual live edit mode is active and authenticated
function isLiveEditActive() {
  return sessionStorage.getItem('admin_authenticated') === 'true' && localStorage.getItem('fp_live_edit_mode') === 'true';
}

let activeCategory = 'All Festive';
let carouselTimer = null;
let currentSlideIndex = 0;
let currentSlidesData = [];
let isTouchInteracting = false;
let touchStartX = 0;
let touchEndX = 0;

/**
 * Toast Notification Helper
 */
function showHeroToast(message, isError = false) {
  const existing = document.getElementById('fp-hero-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'fp-hero-toast';
  toast.className = `fixed bottom-6 right-6 z-[120] flex items-center gap-2 px-5 py-3 rounded-full text-xs font-semibold shadow-2xl backdrop-blur-md transition-all duration-300 animate-fadeIn ${
    isError 
      ? 'bg-rose-900/95 text-rose-100 border border-rose-500' 
      : 'bg-[#1A1A1A]/95 text-amber-200 border border-[#C5A880]'
  }`;
  toast.innerHTML = `
    <span>${isError ? '⚠️' : '✨'}</span>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/**
 * MAIN INITIALIZATION FOR HERO SECTION
 */
export function initHero(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const content = getHomepageContent();
  const firstInitial = storeConfig.logoInitials ? storeConfig.logoInitials[0] : 'F';
  const secondInitial = storeConfig.logoInitials ? storeConfig.logoInitials[1] : 'P';

  container.innerHTML = `
    <style>
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeIn {
        animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      .hero-carousel-track {
        display: flex;
        transition: transform 0.65s cubic-bezier(0.25, 1, 0.5, 1);
        width: 100%;
        height: 100%;
      }
    </style>
    <section class="relative pt-32 pb-20 md:py-40 flex flex-col items-center justify-center min-h-[90vh] overflow-hidden" id="hero-main-section">
      <!-- Sophisticated subtle background grid patterns -->
      <div class="absolute inset-0 bg-[var(--color-bg-primary)] opacity-95 -z-10"></div>
      <div class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[rgba(197,168,128,0.12)] via-transparent to-transparent"></div>
      <div class="absolute top-0 left-1/4 w-[1px] h-full bg-[var(--color-border-subtle)] opacity-40 -z-10"></div>
      <div class="absolute top-0 right-1/4 w-[1px] h-full bg-[var(--color-border-subtle)] opacity-40 -z-10"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <!-- Text Columns (Left on Desktop) -->
        <div class="lg:col-span-7 flex flex-col justify-center space-y-8 text-left">
          
          <!-- System Status Indicator Badge -->
          <div class="inline-flex items-center space-x-2 self-start bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] px-3 py-1.5 rounded-[var(--border-radius-full)] shadow-sm">
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span class="text-[10px] tracking-widest uppercase font-semibold text-[var(--color-text-secondary)]">
              Step 13 Hero Studio & Universal Inline Editing Live
            </span>
          </div>

          <!-- Luxury Accent and Primary Headings with Editable Tags -->
          <div class="space-y-4">
            <span 
              class="text-xs uppercase tracking-[0.4em] text-[var(--color-accent-gold)] font-semibold block transition-all" 
              data-fp-editable="hero_subtitle" 
              id="hero-tagline-display"
            >
              ${content.hero_subtitle}
            </span>
            <h1 
              class="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[var(--color-text-primary)] leading-[1.15] transition-all" 
              data-fp-editable="hero_title" 
              id="hero-heading-display"
            >
              ${content.hero_title}
            </h1>
            <p 
              class="text-sm sm:text-base text-[var(--color-text-secondary)] max-w-xl font-light leading-relaxed transition-all" 
              data-fp-editable="hero_description" 
              id="hero-subheading-display"
            >
              ${content.hero_description}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a 
              id="hero-primary-cta"
              href="${content.hero_cta_link}" 
              class="px-8 py-4 bg-[var(--color-cta-fill)] text-[var(--color-cta-text)] text-xs uppercase tracking-widest font-semibold text-center hover:bg-[var(--color-accent-gold)] transition-colors duration-300 rounded-[var(--border-radius-sm)] shadow-md group relative inline-block"
            >
              <span data-fp-editable="hero_cta_text" id="hero-cta-text-display">${content.hero_cta_text}</span>
            </a>
            <a 
              id="hero-secondary-cta"
              href="${content.hero_secondary_cta_link}" 
              class="px-8 py-4 border border-[var(--color-border-subtle)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)] text-xs uppercase tracking-widest font-semibold text-center hover:border-[var(--color-text-primary)] transition-colors duration-300 rounded-[var(--border-radius-sm)] group relative inline-block"
            >
              <span data-fp-editable="hero_secondary_cta_text" id="hero-secondary-cta-text-display">${content.hero_secondary_cta_text}</span>
            </a>
          </div>

          <!-- Exclusive Offer Note -->
          <div class="border-l-2 border-[var(--color-accent-gold)] pl-4 py-1 text-xs text-[var(--color-text-secondary)] tracking-wide" id="hero-promo-container">
            <span class="font-bold text-[var(--color-text-primary)]" data-fp-editable="hero_promo" id="hero-promo-display">
              ${content.hero_promo}
            </span>
          </div>

        </div>

        <!-- Graphic Image Column (Right on Desktop) -->
        <div class="lg:col-span-5 flex justify-center items-center w-full">
          <div 
            id="hero-showcase-container" 
            class="relative w-full aspect-[4/5] sm:max-w-md lg:max-w-full overflow-hidden border border-[var(--color-border-subtle)] bg-stone-100 shadow-2xl group rounded-[var(--border-radius-sm)] select-none"
          >
            <!-- Hero Showcase Sub-component rendered here -->
            <div id="hero-showcase-viewport" class="w-full h-full relative overflow-hidden"></div>
          </div>
        </div>

      </div>
    </section>

    <!-- Realistic Dropshipping Ticker with Editable Text -->
    <div class="bg-[#1A1A1A] text-[#F9F8F6] py-3.5 overflow-hidden border-y border-[#C5A880]/30 select-none">
      <div class="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-y-2 gap-x-6 md:gap-x-12 text-[10px] md:text-xs tracking-wider uppercase font-medium text-center">
        <div class="flex items-center space-x-2">
          <span data-fp-editable="ticker_announcement" id="hero-dropship-ticker">${content.ticker_announcement}</span>
        </div>
      </div>
    </div>

    <!-- Quick-Jump Category Filter Strip -->
    <div class="bg-transparent py-6 border-b border-[var(--color-border-subtle)]">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex overflow-x-auto whitespace-nowrap gap-3 pb-2 justify-start md:justify-center no-scrollbar" id="category-strip-container">
          ${['All Festive', 'Women', 'Men', 'Couple', 'Kids', 'Elders'].map(cat => {
            const isActive = cat === activeCategory;
            return `
              <button 
                data-category="${cat}"
                class="category-pill px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 border ${
                  isActive 
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md' 
                    : 'bg-white/60 text-[#1A1A1A]/80 border-[#E5E3DF] hover:border-[#1A1A1A] hover:bg-white hover:text-[#1A1A1A]'
                }"
              >
                ${cat}
              </button>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  // Attach Category Filter Listeners
  const pills = container.querySelectorAll('.category-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const selectedCategory = pill.getAttribute('data-category');
      activeCategory = selectedCategory;
      
      pills.forEach(p => {
        const catName = p.getAttribute('data-category');
        if (catName === activeCategory) {
          p.className = "category-pill px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 border bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md";
        } else {
          p.className = "category-pill px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 border bg-white/60 text-[#1A1A1A]/80 border-[#E5E3DF] hover:border-[#1A1A1A] hover:bg-white hover:text-[#1A1A1A]";
        }
      });

      window.dispatchEvent(new CustomEvent('fp_category_changed', { 
        detail: { category: selectedCategory } 
      }));
    });
  });

  // Render Hero Showcase (Single vs Multi Carousel)
  renderHeroShowcase();

  // Initialize On-Page Universal Inline Text Editing Engine
  initUniversalInlineEditing();
}

/**
 * RENDER HERO SHOWCASE (SINGLE SPOTLIGHT VS MULTI-PRODUCT CAROUSEL)
 */
export function renderHeroShowcase() {
  const showcaseContainer = document.getElementById('hero-showcase-container');
  const viewport = document.getElementById('hero-showcase-viewport');
  if (!showcaseContainer || !viewport) return;

  // Clear any active carousel interval
  if (carouselTimer) {
    clearInterval(carouselTimer);
    carouselTimer = null;
  }

  const settings = getHeroSettings();
  const allProducts = getProducts();
  const isEditMode = isLiveEditActive();

  const firstInitial = storeConfig.logoInitials ? storeConfig.logoInitials[0] : 'F';
  const secondInitial = storeConfig.logoInitials ? storeConfig.logoInitials[1] : 'P';

  // Remove any pre-existing floating studio edit button
  const oldEditBtn = showcaseContainer.querySelector('.fp-hero-studio-btn');
  if (oldEditBtn) oldEditBtn.remove();

  // Inject Floating "⚙️ Edit Hero Showcase" button if live edit mode is active
  if (isEditMode) {
    const editBtn = document.createElement('button');
    editBtn.className = 'fp-hero-studio-btn absolute top-3 right-3 z-30 flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1A]/90 hover:bg-[#1A1A1A] text-amber-200 border border-[#C5A880] rounded-full text-[10px] uppercase font-bold tracking-wider shadow-2xl backdrop-blur-md cursor-pointer transition-all hover:scale-105';
    editBtn.innerHTML = `
      <span class="text-xs">⚙️</span>
      <span>Edit Showcase</span>
    `;
    editBtn.title = "Configure Hero Spotlight or Multi-Product Carousel";
    editBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showHeroStudioModal();
    });
    showcaseContainer.appendChild(editBtn);
  }

  // Resolve slides data based on mode
  if (settings.mode === 'single') {
    // 1. Single Static Spotlight Mode
    let targetProduct = null;
    if (settings.selectedProductIds && settings.selectedProductIds.length > 0) {
      targetProduct = allProducts.find(p => p.id === settings.selectedProductIds[0]);
    }
    if (!targetProduct && allProducts.length > 0) {
      targetProduct = allProducts[0];
    }

    const imageUrl = settings.customBannerUrl || (targetProduct ? (targetProduct.images?.[0] || targetProduct.image) : DEFAULT_HERO_CONFIG.heroImageUrl);
    const titleText = settings.customTitle || (targetProduct ? targetProduct.title : "Bespoke Design");
    const priceText = settings.customPrice || (targetProduct ? `₹${targetProduct.price.toLocaleString('en-IN')}` : "Handcrafted Quality");

    viewport.innerHTML = `
      <div class="relative w-full h-full">
        <img 
          id="hero-image-display"
          src="${imageUrl}" 
          alt="${titleText}" 
          class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        
        <!-- Floating Monogram Badge Over Image -->
        <div class="absolute bottom-6 left-6 luxury-glass px-4 py-3 border border-white/20 flex items-center space-x-3 rounded-[var(--border-radius-sm)] max-w-[85%] backdrop-blur-md bg-white/70 shadow-lg">
          <div class="w-8 h-8 rounded-full border border-[var(--color-accent-gold)] flex items-center justify-center text-[var(--color-accent-gold)] text-[10px] font-bold shrink-0">
            ${firstInitial}${secondInitial}
          </div>
          <div class="truncate">
            <p class="text-[9px] uppercase tracking-widest text-[var(--color-text-primary)] font-semibold truncate" id="hero-badge-title">${titleText}</p>
            <p class="text-[8px] text-[var(--color-text-secondary)] truncate" id="hero-badge-price">${priceText} • Handcrafted Quality</p>
          </div>
        </div>
      </div>
    `;

  } else {
    // 2. Multi-Product Carousel Slider Mode
    let selectedProducts = [];
    if (settings.selectedProductIds && settings.selectedProductIds.length > 0) {
      selectedProducts = settings.selectedProductIds
        .map(id => allProducts.find(p => p.id === id))
        .filter(Boolean);
    }
    if (selectedProducts.length === 0) {
      selectedProducts = allProducts.slice(0, 4);
    }

    currentSlidesData = selectedProducts;
    currentSlideIndex = 0;

    viewport.innerHTML = `
      <div class="relative w-full h-full overflow-hidden">
        <!-- Carousel Track -->
        <div class="hero-carousel-track" id="hero-carousel-track">
          ${selectedProducts.map((prod, idx) => {
            const img = prod.images?.[0] || prod.image || DEFAULT_HERO_CONFIG.heroImageUrl;
            return `
              <div class="min-w-full h-full relative shrink-0">
                <img 
                  src="${img}" 
                  alt="${prod.title}" 
                  class="w-full h-full object-cover"
                  loading="${idx === 0 ? 'eager' : 'lazy'}"
                />
              </div>
            `;
          }).join('')}
        </div>

        <!-- Left / Right Navigation Arrows -->
        <button 
          id="hero-carousel-prev" 
          aria-label="Previous Slide" 
          class="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1A1A1A]/60 hover:bg-[#1A1A1A] text-white flex items-center justify-center text-sm transition-all opacity-0 group-hover:opacity-100 z-20 backdrop-blur-xs cursor-pointer border border-white/20"
        >
          ‹
        </button>
        <button 
          id="hero-carousel-next" 
          aria-label="Next Slide" 
          class="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1A1A1A]/60 hover:bg-[#1A1A1A] text-white flex items-center justify-center text-sm transition-all opacity-0 group-hover:opacity-100 z-20 backdrop-blur-xs cursor-pointer border border-white/20"
        >
          ›
        </button>

        <!-- Dynamic Monogram Badge Synchronized with Active Slide -->
        <div class="absolute bottom-6 left-6 luxury-glass px-4 py-3 border border-white/20 flex items-center space-x-3 rounded-[var(--border-radius-sm)] max-w-[75%] backdrop-blur-md bg-white/75 shadow-lg z-20 transition-all duration-300">
          <div class="w-8 h-8 rounded-full border border-[var(--color-accent-gold)] flex items-center justify-center text-[var(--color-accent-gold)] text-[10px] font-bold shrink-0">
            ${firstInitial}${secondInitial}
          </div>
          <div class="truncate">
            <p class="text-[9px] uppercase tracking-widest text-[var(--color-text-primary)] font-semibold truncate" id="hero-badge-title">
              ${selectedProducts[0]?.title || 'Bespoke Design'}
            </p>
            <p class="text-[8px] text-[var(--color-text-secondary)] truncate" id="hero-badge-price">
              ₹${(selectedProducts[0]?.price || 0).toLocaleString('en-IN')} • Handcrafted Quality
            </p>
          </div>
        </div>

        <!-- Clickable Navigation Indicator Dots -->
        <div class="absolute bottom-6 right-6 flex items-center space-x-1.5 z-20 bg-black/40 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-white/10" id="hero-carousel-dots">
          ${selectedProducts.map((_, idx) => `
            <button 
              data-slide-index="${idx}" 
              class="hero-dot w-2 h-2 rounded-full transition-all duration-300 ${idx === 0 ? 'bg-[#C5A880] w-4' : 'bg-white/50 hover:bg-white'}"
              aria-label="Go to slide ${idx + 1}"
            ></button>
          `).join('')}
        </div>
      </div>
    `;

    // Hook up Carousel Controls
    setupCarouselLogic(selectedProducts);
  }
}

/**
 * CAROUSEL LOGIC & EVENT HANDLERS (4s Auto-cycle, Touch-Swipe, Dots, Dynamic Badge)
 */
function setupCarouselLogic(products) {
  if (!products || products.length <= 1) return;

  const track = document.getElementById('hero-carousel-track');
  const dotsContainer = document.getElementById('hero-carousel-dots');
  const prevBtn = document.getElementById('hero-carousel-prev');
  const nextBtn = document.getElementById('hero-carousel-next');
  const showcaseContainer = document.getElementById('hero-showcase-container');
  const badgeTitle = document.getElementById('hero-badge-title');
  const badgePrice = document.getElementById('hero-badge-price');

  function updateSlide(index) {
    if (!track) return;
    currentSlideIndex = (index + products.length) % products.length;
    track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

    // Update Dots
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.hero-dot');
      dots.forEach((dot, idx) => {
        if (idx === currentSlideIndex) {
          dot.className = "hero-dot w-4 h-2 rounded-full transition-all duration-300 bg-[#C5A880]";
        } else {
          dot.className = "hero-dot w-2 h-2 rounded-full transition-all duration-300 bg-white/50 hover:bg-white";
        }
      });
    }

    // Synchronize Overlay Badge Text
    const activeProd = products[currentSlideIndex];
    if (activeProd) {
      if (badgeTitle) badgeTitle.innerText = activeProd.title;
      if (badgePrice) badgePrice.innerText = `₹${activeProd.price.toLocaleString('en-IN')} • Handcrafted Quality`;
    }
  }

  function startAutoPlay() {
    if (carouselTimer) clearInterval(carouselTimer);
    carouselTimer = setInterval(() => {
      updateSlide(currentSlideIndex + 1);
    }, 4000);
  }

  function stopAutoPlay() {
    if (carouselTimer) {
      clearInterval(carouselTimer);
      carouselTimer = null;
    }
  }

  // Button Listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      stopAutoPlay();
      updateSlide(currentSlideIndex - 1);
      startAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      stopAutoPlay();
      updateSlide(currentSlideIndex + 1);
      startAutoPlay();
    });
  }

  // Dot Click Listeners
  if (dotsContainer) {
    const dots = dotsContainer.querySelectorAll('.hero-dot');
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetIdx = parseInt(dot.getAttribute('data-slide-index'), 10);
        stopAutoPlay();
        updateSlide(targetIdx);
        startAutoPlay();
      });
    });
  }

  // Hover Pause & Resume
  if (showcaseContainer) {
    showcaseContainer.addEventListener('mouseenter', stopAutoPlay);
    showcaseContainer.addEventListener('mouseleave', startAutoPlay);

    // Touch-Swipe Support for Mobile
    showcaseContainer.addEventListener('touchstart', (e) => {
      isTouchInteracting = true;
      touchStartX = e.touches[0].clientX;
      stopAutoPlay();
    }, { passive: true });

    showcaseContainer.addEventListener('touchmove', (e) => {
      if (!isTouchInteracting) return;
      touchEndX = e.touches[0].clientX;
    }, { passive: true });

    showcaseContainer.addEventListener('touchend', () => {
      if (!isTouchInteracting) return;
      isTouchInteracting = false;
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 40) {
        if (swipeDistance < 0) {
          // Swipe Left -> Next
          updateSlide(currentSlideIndex + 1);
        } else {
          // Swipe Right -> Prev
          updateSlide(currentSlideIndex - 1);
        }
      }
      startAutoPlay();
    });
  }

  // Start initial auto-cycle
  startAutoPlay();
}

/**
 * HERO SHOWCASE STUDIO MODAL
 * Allows admin to toggle between Single Static Spotlight and Multi-Product Carousel Slider,
 * pick catalog products, or upload custom promotional banners.
 */
export function showHeroStudioModal() {
  const existingModal = document.getElementById('fp-hero-studio-modal');
  if (existingModal) existingModal.remove();

  const currentSettings = getHeroSettings();
  const allProducts = getProducts();

  let selectedMode = currentSettings.mode || 'carousel';
  let chosenProductIds = [...(currentSettings.selectedProductIds || [])];
  let customBannerUrl = currentSettings.customBannerUrl || '';
  let customTitle = currentSettings.customTitle || '';
  let customPrice = currentSettings.customPrice || '';

  const modal = document.createElement('div');
  modal.id = 'fp-hero-studio-modal';
  modal.className = 'fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn';
  
  function renderModalInner() {
    modal.innerHTML = `
      <div class="relative w-full max-w-2xl bg-[#F9F8F6] text-[#1A1A1A] rounded-2xl shadow-2xl border border-[#C5A880]/60 overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Modal Header -->
        <div class="px-6 py-4 bg-[#1A1A1A] text-white flex items-center justify-between border-b border-[#C5A880]/30">
          <div class="flex items-center gap-2.5">
            <span class="text-xl">⚙️</span>
            <div>
              <h3 class="font-serif text-lg tracking-wider text-amber-200">Hero Showcase Studio</h3>
              <p class="text-[10px] text-stone-300 uppercase tracking-widest">Single Spotlight vs Multi-Product Carousel</p>
            </div>
          </div>
          <button id="close-hero-studio-modal" class="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-white flex items-center justify-center text-sm transition-all">
            ✕
          </button>
        </div>

        <!-- Modal Body (Scrollable) -->
        <div class="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          
          <!-- 1. Display Mode Toggle -->
          <div class="space-y-2">
            <label class="block uppercase tracking-widest text-[11px] font-bold text-stone-700">1. Showcase Display Mode</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label class="flex items-start gap-3 p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                selectedMode === 'single' 
                  ? 'border-[#C5A880] bg-amber-50/50 shadow-sm' 
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }">
                <input type="radio" name="studio_mode" value="single" ${selectedMode === 'single' ? 'checked' : ''} class="mt-0.5 accent-[#C5A880]">
                <div>
                  <span class="font-bold text-stone-900 block text-xs">🌟 Single Static Spotlight</span>
                  <span class="text-[10px] text-stone-500 leading-tight block mt-0.5">Feature a single hero product or custom editorial banner without carousel rotation.</span>
                </div>
              </label>

              <label class="flex items-start gap-3 p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                selectedMode === 'carousel' 
                  ? 'border-[#C5A880] bg-amber-50/50 shadow-sm' 
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }">
                <input type="radio" name="studio_mode" value="carousel" ${selectedMode === 'carousel' ? 'checked' : ''} class="mt-0.5 accent-[#C5A880]">
                <div>
                  <span class="font-bold text-stone-900 block text-xs">🎠 Multi-Product Carousel Slider</span>
                  <span class="text-[10px] text-stone-500 leading-tight block mt-0.5">Automated 4-second rotating slide show with indicators and touch-swipe.</span>
                </div>
              </label>
            </div>
          </div>

          <!-- 2. Catalog Product Selector Checklist -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="block uppercase tracking-widest text-[11px] font-bold text-stone-700">
                2. Select Catalog Products to Showcase (${chosenProductIds.length} Selected)
              </label>
              <div class="flex gap-2 text-[10px]">
                <button type="button" id="select-all-prods-btn" class="text-[#C5A880] hover:underline font-bold">Select All</button>
                <span class="text-stone-300">|</span>
                <button type="button" id="clear-prods-btn" class="text-stone-500 hover:underline">Clear</button>
              </div>
            </div>

            <div class="max-h-56 overflow-y-auto space-y-2 pr-1 border border-stone-200 rounded-xl p-2 bg-white">
              ${allProducts.map(prod => {
                const isChecked = chosenProductIds.includes(prod.id);
                const thumb = prod.images?.[0] || prod.image || '';
                return `
                  <label class="flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                    isChecked ? 'bg-amber-50/40 border-[#C5A880]/60' : 'bg-stone-50/40 border-stone-100 hover:border-stone-200'
                  }">
                    <div class="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        data-prod-id="${prod.id}" 
                        ${isChecked ? 'checked' : ''} 
                        class="prod-check-input accent-[#C5A880] rounded"
                      >
                      <img src="${thumb}" alt="${prod.title}" class="w-10 h-10 object-cover rounded-md border border-stone-200 shrink-0">
                      <div>
                        <p class="font-bold text-stone-900 text-[11px] leading-tight line-clamp-1">${prod.title}</p>
                        <p class="text-[9px] text-stone-500 uppercase tracking-wider">${prod.category} • ₹${prod.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <span class="text-[10px] font-bold ${isChecked ? 'text-amber-700' : 'text-stone-400'}">
                      ${isChecked ? '✓ Active' : '+ Include'}
                    </span>
                  </label>
                `;
              }).join('')}
            </div>
          </div>

          <!-- 3. Optional Custom Promotional Banner (ImgBB Upload or URL) -->
          <div class="space-y-3 pt-2 border-t border-stone-200">
            <label class="block uppercase tracking-widest text-[11px] font-bold text-stone-700">
              3. Custom Editorial Banner (Optional Override)
            </label>
            <p class="text-[10px] text-stone-500">Upload a custom promotional banner via ImgBB CDN or enter a direct image URL.</p>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <!-- Upload Area -->
              <div class="space-y-1.5">
                <label class="block text-[10px] font-semibold text-stone-600 uppercase">Upload to Cloud CDN</label>
                <div class="relative flex items-center justify-center border-2 border-dashed border-stone-300 rounded-xl p-3 bg-stone-50 hover:bg-stone-100 transition-all text-center">
                  <input type="file" id="studio-banner-file" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full">
                  <div id="studio-upload-prompt" class="space-y-1">
                    <span class="text-sm">☁️</span>
                    <p class="text-[10px] font-semibold text-stone-700">Click to upload file</p>
                    <p class="text-[8px] text-stone-400">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                </div>
              </div>

              <!-- Direct URL & Metadata -->
              <div class="space-y-2">
                <div>
                  <label class="block text-[10px] font-semibold text-stone-600 uppercase">Or Direct Banner URL</label>
                  <input 
                    type="url" 
                    id="studio-banner-url" 
                    value="${customBannerUrl}" 
                    placeholder="https://images.unsplash.com/..." 
                    class="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-[11px] focus:outline-none focus:border-[#C5A880] bg-white"
                  >
                </div>
                <div>
                  <label class="block text-[10px] font-semibold text-stone-600 uppercase">Custom Badge Title</label>
                  <input 
                    type="text" 
                    id="studio-banner-title" 
                    value="${customTitle}" 
                    placeholder="e.g. Royal Silk Festive Edit" 
                    class="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-[11px] focus:outline-none focus:border-[#C5A880] bg-white"
                  >
                </div>
              </div>
            </div>

            <!-- Preview if custom banner exists -->
            ${customBannerUrl ? `
              <div class="flex items-center gap-3 p-2 bg-stone-100 rounded-lg border border-stone-200">
                <img src="${customBannerUrl}" alt="Banner Preview" class="w-12 h-12 object-cover rounded-md border border-stone-300 shrink-0">
                <div class="truncate flex-1">
                  <p class="font-bold text-[10px] text-stone-800 truncate">${customTitle || 'Custom Editorial Banner'}</p>
                  <p class="text-[8px] text-stone-500 truncate">${customBannerUrl}</p>
                </div>
                <button type="button" id="remove-custom-banner-btn" class="text-rose-600 hover:text-rose-800 text-[10px] font-bold px-2 py-1">
                  Remove
                </button>
              </div>
            ` : ''}
          </div>

        </div>

        <!-- Modal Footer Actions -->
        <div class="px-6 py-4 bg-stone-100 border-t border-stone-200 flex items-center justify-end gap-3">
          <button 
            type="button" 
            id="cancel-hero-studio" 
            class="px-5 py-2 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-200 uppercase tracking-widest font-semibold text-[10px] transition-all"
          >
            Cancel
          </button>
          <button 
            type="button" 
            id="save-hero-studio" 
            class="px-6 py-2 rounded-full bg-[#1A1A1A] hover:bg-[#C5A880] text-white hover:text-[#1A1A1A] uppercase tracking-widest font-bold text-[10px] transition-all shadow-md flex items-center gap-1.5"
          >
            <span>💾</span>
            <span>Save Showcase Settings</span>
          </button>
        </div>
      </div>
    `;

    // Radio Listeners
    const radios = modal.querySelectorAll('input[name="studio_mode"]');
    radios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        selectedMode = e.target.value;
        renderModalInner();
      });
    });

    // Checklist Checkbox Listeners
    const checkInputs = modal.querySelectorAll('.prod-check-input');
    checkInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const prodId = input.getAttribute('data-prod-id');
        if (input.checked) {
          if (!chosenProductIds.includes(prodId)) chosenProductIds.push(prodId);
        } else {
          chosenProductIds = chosenProductIds.filter(id => id !== prodId);
        }
      });
    });

    // Select All / Clear
    const selectAllBtn = modal.querySelector('#select-all-prods-btn');
    if (selectAllBtn) {
      selectAllBtn.addEventListener('click', () => {
        chosenProductIds = allProducts.map(p => p.id);
        renderModalInner();
      });
    }

    const clearBtn = modal.querySelector('#clear-prods-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        chosenProductIds = [];
        renderModalInner();
      });
    }

    // Custom Banner File Upload via ImgBB
    const fileInput = modal.querySelector('#studio-banner-file');
    const promptEl = modal.querySelector('#studio-upload-prompt');
    if (fileInput) {
      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
          if (promptEl) {
            promptEl.innerHTML = `
              <span class="animate-spin inline-block">⏳</span>
              <p class="text-[10px] font-bold text-amber-700">Uploading to ImgBB...</p>
            `;
          }
          const uploadedUrl = await uploadToImgBB(file);
          customBannerUrl = uploadedUrl;
          showHeroToast("Banner uploaded to cloud successfully!");
          renderModalInner();
        } catch (err) {
          console.error("Studio Banner upload error:", err);
          showHeroToast("Failed to upload banner: " + (err.message || "Unknown error"), true);
          renderModalInner();
        }
      });
    }

    // Direct Banner URL Input & Title
    const urlInput = modal.querySelector('#studio-banner-url');
    if (urlInput) {
      urlInput.addEventListener('input', (e) => {
        customBannerUrl = e.target.value.trim();
      });
    }

    const titleInput = modal.querySelector('#studio-banner-title');
    if (titleInput) {
      titleInput.addEventListener('input', (e) => {
        customTitle = e.target.value.trim();
      });
    }

    // Remove custom banner button
    const removeBannerBtn = modal.querySelector('#remove-custom-banner-btn');
    if (removeBannerBtn) {
      removeBannerBtn.addEventListener('click', () => {
        customBannerUrl = '';
        customTitle = '';
        renderModalInner();
      });
    }

    // Close / Cancel
    const closeBtn = modal.querySelector('#close-hero-studio-modal');
    const cancelBtn = modal.querySelector('#cancel-hero-studio');
    if (closeBtn) closeBtn.addEventListener('click', () => modal.remove());
    if (cancelBtn) cancelBtn.addEventListener('click', () => modal.remove());

    // Save Action
    const saveBtn = modal.querySelector('#save-hero-studio');
    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        if (chosenProductIds.length === 0 && !customBannerUrl) {
          chosenProductIds = allProducts.slice(0, 3).map(p => p.id);
        }

        const newSettings = {
          mode: selectedMode,
          selectedProductIds: chosenProductIds,
          customBannerUrl: customBannerUrl,
          customTitle: customTitle,
          customPrice: customPrice
        };

        saveBtn.disabled = true;
        saveBtn.innerHTML = `<span>⏳</span><span>Saving...</span>`;

        await saveHeroSettingsToCloud(newSettings);
        showHeroToast("Hero Showcase updated & synced to cloud!");
        modal.remove();
        renderHeroShowcase();
      });
    }
  }

  renderModalInner();
  document.body.appendChild(modal);
}

/**
 * UNIVERSAL ON-PAGE INLINE TEXT EDITING ENGINE
 * Enables live inline editing across any element marked with [data-fp-editable="<key>"]
 * when fp_live_edit_mode is active. Includes dashed hover outlines, focus outlines,
 * floating [ 💾 Save ] | [ ✕ Cancel ] action pills, and real-time Firestore synchronization.
 */
let inlineStyleElement = null;
let currentEditingElement = null;
let originalTextSnapshot = "";
let floatingActionPill = null;

export function initUniversalInlineEditing() {
  // 1. Inject or update dynamic inline edit CSS styles
  if (!inlineStyleElement) {
    inlineStyleElement = document.createElement('style');
    inlineStyleElement.id = 'fp-inline-edit-styles';
    document.head.appendChild(inlineStyleElement);
  }

  const isEditMode = isLiveEditActive();

  if (!isEditMode) {
    inlineStyleElement.innerHTML = '';
    // Clean up any ongoing editing element
    if (currentEditingElement) {
      currentEditingElement.contentEditable = 'false';
      currentEditingElement.classList.remove('fp-editable-editing');
      currentEditingElement = null;
    }
    if (floatingActionPill) {
      floatingActionPill.remove();
      floatingActionPill = null;
    }
    document.querySelectorAll('[data-fp-editable]').forEach(el => {
      el.contentEditable = 'false';
      el.removeAttribute('title');
      el.classList.remove('fp-editable-live', 'fp-editable-editing');
    });
    return;
  }

  // Set CSS for live edit hover and active states
  inlineStyleElement.innerHTML = `
    .fp-editable-live {
      position: relative;
      outline: 1.5px dashed rgba(197, 168, 128, 0.75) !important;
      outline-offset: 3px !important;
      border-radius: 4px !important;
      cursor: text !important;
      transition: outline-color 0.2s ease, background-color 0.2s ease !important;
    }
    .fp-editable-live:hover {
      outline-color: #C5A880 !important;
      background-color: rgba(197, 168, 128, 0.08) !important;
    }
    .fp-editable-editing {
      outline: 2px solid #C5A880 !important;
      background-color: rgba(255, 255, 255, 0.95) !important;
      color: #1A1A1A !important;
      box-shadow: 0 0 20px rgba(197, 168, 128, 0.4) !important;
      border-radius: 4px !important;
      z-index: 80 !important;
    }
  `;

  // Query all editable elements across storefront
  const editableElements = document.querySelectorAll('[data-fp-editable]');
  editableElements.forEach(el => {
    el.classList.add('fp-editable-live');
    el.title = "Click to edit text directly (Live Edit Mode)";

    // Prevent duplicate event handlers
    if (el.dataset.fpInlineAttached === 'true') return;
    el.dataset.fpInlineAttached = 'true';

    el.addEventListener('click', (e) => {
      if (!isLiveEditActive()) return;
      e.stopPropagation();
      startInlineEditing(el);
    });
  });
}

/**
 * START INLINE EDITING FOR TARGET ELEMENT
 */
function startInlineEditing(el) {
  if (currentEditingElement === el) return;

  // If another element was being edited, commit or cancel it
  if (currentEditingElement) {
    cancelInlineEditing();
  }

  currentEditingElement = el;
  originalTextSnapshot = el.innerText.trim();

  el.contentEditable = 'true';
  el.classList.add('fp-editable-editing');
  el.focus();

  // Create & Position Floating Action Pill
  spawnFloatingActionPill(el);

  // Keydown shortcuts
  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      cancelInlineEditing();
      el.removeEventListener('keydown', handleKeyDown);
    } else if (e.key === 'Enter') {
      const key = el.getAttribute('data-fp-editable');
      // If single-line element (title, subtitle, buttons), Enter triggers Save
      if (key !== 'hero_description' && key !== 'ticker_announcement') {
        e.preventDefault();
        saveInlineEditing();
        el.removeEventListener('keydown', handleKeyDown);
      }
    }
  }
  el.addEventListener('keydown', handleKeyDown);
}

/**
 * SPAWN FLOATING SAVE / CANCEL ACTION PILL
 */
function spawnFloatingActionPill(el) {
  if (floatingActionPill) floatingActionPill.remove();

  const rect = el.getBoundingClientRect();
  const pill = document.createElement('div');
  pill.id = 'fp-inline-action-pill';
  pill.className = 'fixed z-[100] flex items-center gap-2 px-3.5 py-1.5 bg-[#1A1A1A]/95 text-white rounded-full border border-[#C5A880] shadow-2xl text-[10px] uppercase font-bold tracking-wider animate-fadeIn backdrop-blur-md';
  
  // Compute top/left position safely
  let top = rect.top - 42;
  if (top < 10) top = rect.bottom + 10;
  let left = rect.left + (rect.width / 2) - 80;
  if (left < 10) left = 10;
  if (left + 170 > window.innerWidth) left = window.innerWidth - 180;

  pill.style.top = `${top}px`;
  pill.style.left = `${left}px`;

  pill.innerHTML = `
    <span class="text-amber-200">Editing</span>
    <span class="text-stone-500">|</span>
    <button id="fp-inline-save-btn" class="px-2.5 py-1 bg-[#C5A880] hover:bg-[#d4b993] text-[#1A1A1A] rounded-full transition-all cursor-pointer">
      💾 Save
    </button>
    <button id="fp-inline-cancel-btn" class="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-full transition-all cursor-pointer">
      ✕
    </button>
  `;

  document.body.appendChild(pill);
  floatingActionPill = pill;

  const saveBtn = pill.querySelector('#fp-inline-save-btn');
  const cancelBtn = pill.querySelector('#fp-inline-cancel-btn');

  if (saveBtn) {
    saveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      saveInlineEditing();
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      cancelInlineEditing();
    });
  }
}

/**
 * COMMIT INLINE EDIT TO CLOUD FIRESTORE
 */
async function saveInlineEditing() {
  if (!currentEditingElement) return;

  const el = currentEditingElement;
  const key = el.getAttribute('data-fp-editable');
  const updatedText = el.innerText.trim();

  el.contentEditable = 'false';
  el.classList.remove('fp-editable-editing');
  
  if (floatingActionPill) {
    floatingActionPill.remove();
    floatingActionPill = null;
  }
  currentEditingElement = null;

  if (updatedText === originalTextSnapshot) {
    return;
  }

  try {
    await saveHomepageContentToCloud(key, updatedText);
    showHeroToast("✨ Text updated & synced to cloud!");
  } catch (err) {
    console.error("Failed to save inline edit text:", err);
    showHeroToast("Failed to sync text update", true);
  }
}

/**
 * CANCEL INLINE EDIT
 */
function cancelInlineEditing() {
  if (!currentEditingElement) return;

  currentEditingElement.innerText = originalTextSnapshot;
  currentEditingElement.contentEditable = 'false';
  currentEditingElement.classList.remove('fp-editable-editing');

  if (floatingActionPill) {
    floatingActionPill.remove();
    floatingActionPill = null;
  }
  currentEditingElement = null;
}

/**
 * SYNCHRONIZE ALL EDITABLE TEXT DOM NODES WITH LATEST CONTENT PAYLOAD
 */
function syncAllEditableTexts(content) {
  if (!content) return;

  const mapping = {
    hero_subtitle: 'hero-tagline-display',
    hero_title: 'hero-heading-display',
    hero_description: 'hero-subheading-display',
    hero_cta_text: 'hero-cta-text-display',
    hero_secondary_cta_text: 'hero-secondary-cta-text-display',
    hero_promo: 'hero-promo-display',
    ticker_announcement: 'hero-dropship-ticker'
  };

  Object.entries(mapping).forEach(([key, elementId]) => {
    if (content[key] !== undefined) {
      const el = document.getElementById(elementId) || document.querySelector(`[data-fp-editable="${key}"]`);
      if (el && el !== currentEditingElement) {
        el.innerText = content[key];
      }
    }
  });

  // Also update header top ticker if present
  const headerTicker = document.getElementById('header-top-ticker');
  if (headerTicker && content.ticker_announcement && headerTicker !== currentEditingElement) {
    headerTicker.innerText = content.ticker_announcement;
  }
}

/**
 * REAL-TIME SUBSCRIPTIONS & EVENT LISTENERS
 */
subscribeToHeroSettings((settings) => {
  renderHeroShowcase();
});

subscribeToHomepageContent((content) => {
  syncAllEditableTexts(content);
});

window.addEventListener('fp_hero_settings_updated', () => {
  renderHeroShowcase();
});

window.addEventListener('fp_homepage_content_updated', (e) => {
  syncAllEditableTexts(e.detail);
});

window.addEventListener('fp_products_updated', () => {
  renderHeroShowcase();
});

window.addEventListener('fp_edit_mode_toggled', () => {
  renderHeroShowcase();
  initUniversalInlineEditing();
});
