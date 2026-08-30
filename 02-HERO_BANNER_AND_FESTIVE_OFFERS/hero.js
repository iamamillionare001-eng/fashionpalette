/**
 * HERO BANNER & FESTIVE OFFERS COMPONENT
 * Displays the main editorial splash page, primary luxury collection CTA,
 * and the system verification state indicator confirming base setup.
 */

import { storeConfig } from '../07-STORE_SETTINGS_AND_THEME_COLORS/store_config.js';

export const DEFAULT_HERO_CONFIG = {
  headlineTag: "Festive Collection 2026",
  mainHeading: "Grand Festive Collection 2026",
  subHeading: "Celebrate Ganesh Chaturthi and upcoming festivities in pure elegance. Hand-crafted designer kurtas, festive sarees, and coordinated couple sets delivered to your doorstep.",
  promoBadgeText: "Festive Offer: Use code FESTIVE2026 for 15% off",
  heroImageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
  primaryCtaText: "Shop Festive Edit",
  primaryCtaLink: "#festive",
  secondaryCtaText: "Explore Collection",
  secondaryCtaLink: "#catalog"
};

export function getHeroConfig() {
  const cached = localStorage.getItem('fp_hero_config');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.error("Error parsing fp_hero_config from localStorage", e);
    }
  }
  localStorage.setItem('fp_hero_config', JSON.stringify(DEFAULT_HERO_CONFIG));
  return DEFAULT_HERO_CONFIG;
}

let activeCategory = 'All Festive';

export function initHero(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const config = getHeroConfig();
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
    </style>
    <section class="relative pt-32 pb-20 md:py-40 flex flex-col items-center justify-center min-h-[90vh] overflow-hidden">
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
              Step 3 Festive Collection & Managed Banner Initialized
            </span>
          </div>

          <!-- Luxury Accent and Primary Headings -->
          <div class="space-y-4">
            <span class="text-xs uppercase tracking-[0.4em] text-[var(--color-accent-gold)] font-semibold block" id="hero-tagline-display">
              ${config.headlineTag}
            </span>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[var(--color-text-primary)] leading-[1.15]" id="hero-heading-display">
              ${config.mainHeading}
            </h1>
            <p class="text-sm sm:text-base text-[var(--color-text-secondary)] max-w-xl font-light leading-relaxed" id="hero-subheading-display">
              ${config.subHeading}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a 
              id="hero-primary-cta"
              href="${config.primaryCtaLink}" 
              class="px-8 py-4 bg-[var(--color-cta-fill)] text-[var(--color-cta-text)] text-xs uppercase tracking-widest font-semibold text-center hover:bg-[var(--color-accent-gold)] transition-colors duration-300 rounded-[var(--border-radius-sm)] shadow-md"
            >
              ${config.primaryCtaText}
            </a>
            <a 
              id="hero-secondary-cta"
              href="${config.secondaryCtaLink}" 
              class="px-8 py-4 border border-[var(--color-border-subtle)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)] text-xs uppercase tracking-widest font-semibold text-center hover:border-[var(--color-text-primary)] transition-colors duration-300 rounded-[var(--border-radius-sm)]"
            >
              ${config.secondaryCtaText}
            </a>
          </div>

          <!-- Exclusive Offer Note -->
          ${config.promoBadgeText ? `
          <div class="border-l-2 border-[var(--color-accent-gold)] pl-4 py-1 text-xs text-[var(--color-text-secondary)] tracking-wide" id="hero-promo-display">
            <span class="font-bold text-[var(--color-text-primary)]">${config.promoBadgeText}</span>
          </div>
          ` : ''}

        </div>

        <!-- Graphic Image Column (Right on Desktop) -->
        <div class="lg:col-span-5 flex justify-center items-center w-full">
          <div class="relative w-full aspect-[4/5] sm:max-w-md lg:max-w-full overflow-hidden border border-[var(--color-border-subtle)] bg-stone-100 shadow-2xl group rounded-[var(--border-radius-sm)]">
            <!-- Campaign Graphic -->
            <img 
              id="hero-image-display"
              src="${config.heroImageUrl}" 
              alt="FashionPalette Campaign Editorial" 
              class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            
            <!-- Floating Monogram Badge Over Image -->
            <div class="absolute bottom-6 left-6 luxury-glass px-4 py-3 border border-white/20 flex items-center space-x-3 rounded-[var(--border-radius-sm)]">
              <div class="w-8 h-8 rounded-full border border-[var(--color-accent-gold)] flex items-center justify-center text-[var(--color-accent-gold)] text-[10px] font-bold">
                ${firstInitial}${secondInitial}
              </div>
              <div>
                <p class="text-[9px] uppercase tracking-widest text-[var(--color-text-primary)] font-semibold">Bespoke Design</p>
                <p class="text-[8px] text-[var(--color-text-secondary)]">Handcrafted Quality</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Realistic Dropshipping Ticker -->
    <div class="bg-[#1A1A1A] text-[#F9F8F6] py-3.5 overflow-hidden border-y border-[#C5A880]/30 select-none">
      <div class="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-y-2 gap-x-6 md:gap-x-12 text-[10px] md:text-xs tracking-wider uppercase font-medium text-center">
        <div class="flex items-center space-x-2">
          <span>✨ Grand Festive Collection 2026 Live Now</span>
        </div>
        <div class="hidden sm:block text-[#C5A880]/30">|</div>
        <div class="flex items-center space-x-2">
          <span>🚚 Fast Pan-India Shipping on All Orders</span>
        </div>
        <div class="hidden sm:block text-[#C5A880]/30">|</div>
        <div class="flex items-center space-x-2">
          <span>💳 Cash on Delivery Available</span>
        </div>
        <div class="hidden sm:block text-[#C5A880]/30">|</div>
        <div class="flex items-center space-x-2">
          <span>🛡️ Verified Premium Fabric & Easy Returns</span>
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
      
      // Update visual active state
      pills.forEach(p => {
        const catName = p.getAttribute('data-category');
        if (catName === activeCategory) {
          p.className = "category-pill px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 border bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md";
        } else {
          p.className = "category-pill px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 border bg-white/60 text-[#1A1A1A]/80 border-[#E5E3DF] hover:border-[#1A1A1A] hover:bg-white hover:text-[#1A1A1A]";
        }
      });

      // Dispatch custom event for loose coupling
      window.dispatchEvent(new CustomEvent('fp_category_changed', { 
        detail: { category: selectedCategory } 
      }));
    });
  });
}
