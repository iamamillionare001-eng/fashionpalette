/**
 * HERO BANNER & FESTIVE OFFERS COMPONENT
 * Displays the main editorial splash page, primary luxury collection CTA,
 * and the system verification state indicator confirming base setup.
 */

import { storeConfig } from '../07-STORE_SETTINGS_AND_THEME_COLORS/store_config.js';

export function initHero(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
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
              Step 1 Base Architecture & Responsive Theme Initialized
            </span>
          </div>

          <!-- Luxury Accent and Primary Headings -->
          <div class="space-y-4">
            <span class="text-xs uppercase tracking-[0.4em] text-[var(--color-accent-gold)] font-semibold block">
              Atelier Couture Edition 2026
            </span>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[var(--color-text-primary)] leading-[1.15]">
              Redefining <span class="italic font-serif-luxury text-[var(--color-accent-gold)]">Modern Elegance</span> & Pure Sophistication
            </h1>
            <p class="text-sm sm:text-base text-[var(--color-text-secondary)] max-w-xl font-light leading-relaxed">
              Experience hand-crafted minimalist apparel, tailored with fine linens and premium materials. Experience the ultimate intersection of digital luxury and timeless bespoke style.
            </p>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a 
              href="#collection" 
              class="px-8 py-4 bg-[var(--color-cta-fill)] text-[var(--color-cta-text)] text-xs uppercase tracking-widest font-semibold text-center hover:bg-[var(--color-accent-gold)] transition-colors duration-300 rounded-[var(--border-radius-sm)] shadow-md"
            >
              Explore The Collection
            </a>
            <a 
              href="#atelier" 
              class="px-8 py-4 border border-[var(--color-border-subtle)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)] text-xs uppercase tracking-widest font-semibold text-center hover:border-[var(--color-text-primary)] transition-colors duration-300 rounded-[var(--border-radius-sm)]"
            >
              The Atelier Story
            </a>
          </div>

          <!-- Exclusive Offer Note -->
          ${storeConfig.festiveOffers.active ? `
          <div class="border-l-2 border-[var(--color-accent-gold)] pl-4 py-1 text-xs text-[var(--color-text-secondary)] tracking-wide">
            <span class="font-bold text-[var(--color-text-primary)]">Limited Offer:</span> Use code 
            <span class="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-stone-800 font-semibold">${storeConfig.festiveOffers.promoCode}</span> 
            at checkout for premium gifting benefits.
          </div>
          ` : ''}

        </div>

        <!-- Graphic Image Column (Right on Desktop) -->
        <div class="lg:col-span-5 flex justify-center items-center w-full">
          <div class="relative w-full aspect-[4/5] sm:max-w-md lg:max-w-full overflow-hidden border border-[var(--color-border-subtle)] bg-stone-100 shadow-2xl group rounded-[var(--border-radius-sm)]">
            <!-- Campaign Graphic -->
            <img 
              src="/hero-model.jpg" 
              alt="FashionPalette Campaign Editorial" 
              class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            
            <!-- Floating Monogram Badge Over Image -->
            <div class="absolute bottom-6 left-6 luxury-glass px-4 py-3 border border-white/20 flex items-center space-x-3 rounded-[var(--border-radius-sm)]">
              <div class="w-8 h-8 rounded-full border border-[var(--color-accent-gold)] flex items-center justify-center text-[var(--color-accent-gold)] text-[10px] font-bold">
                ${storeConfig.logoInitials}
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
  `;
}
