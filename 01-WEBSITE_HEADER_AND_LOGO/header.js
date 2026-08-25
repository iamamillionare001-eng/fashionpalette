/**
 * WEBSITE HEADER & LOGO COMPONENT
 * Renders the sticky luxury navigation, interactive mobile menu drawers,
 * and the custom interlocking "FP" monogram logo badge.
 */

import { storeConfig } from '../07-STORE_SETTINGS_AND_THEME_COLORS/store_config.js';

export function initHeader(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Render Header HTML Structure
  container.innerHTML = `
    <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 luxury-glass border-b border-[var(--color-border-subtle)]" id="main-header">
      <!-- Top Promo / Festive Banner -->
      ${storeConfig.festiveOffers.active ? `
      <div class="bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] py-2 px-4 text-center text-xs tracking-widest uppercase font-medium relative overflow-hidden">
        <div class="animate-pulse inline-block mr-2 w-1.5 h-1.5 rounded-full bg-[var(--color-accent-gold)]"></div>
        <span>${storeConfig.festiveOffers.bannerText}</span>
      </div>
      ` : ''}

      <!-- Main Navigation Bar -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <!-- Mobile Menu Toggle Button (Touch targets strictly >= 44px) -->
        <button 
          id="mobile-menu-btn" 
          class="flex md:hidden items-center justify-center w-11 h-11 text-[var(--color-text-primary)] hover:opacity-75 focus:outline-none"
          aria-label="Toggle Menu"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 8h16M4 16h16" />
          </svg>
        </button>

        <!-- Desktop Navigation Links (Left align) -->
        <nav class="hidden md:flex space-x-8 items-center flex-1">
          ${storeConfig.navigation.map(item => `
            <a 
              href="${item.link}" 
              class="relative py-2 text-xs uppercase tracking-widest text-[var(--color-text-primary)] hover:text-[var(--color-accent-gold)] transition-colors duration-300 font-medium group"
            >
              ${item.label}
              <span class="absolute bottom-0 left-0 w-0 h-[1px] bg-[var(--color-accent-gold)] transition-all duration-300 group-hover:w-full"></span>
            </a>
          `).join('')}
        </nav>

        <!-- Brand Logo & Monogram Badge (Centered) -->
        <a href="#" class="flex items-center space-x-3 justify-center md:flex-initial flex-1 mr-8 md:mr-0 group">
          <!-- Beautiful Custom Interlocking FP Monogram Logo -->
          <div class="relative w-12 h-12 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
            <svg width="48" height="48" viewBox="0 0 100 100" class="w-full h-full text-[var(--color-text-primary)]">
              <!-- Thin Luxury Outer Circles -->
              <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width="1" class="opacity-80" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-accent-gold)" stroke-width="0.75" stroke-dasharray="2,2" class="opacity-60" />
              
              <!-- Serif Overlapping letters F & P -->
              <text x="35" y="62" font-family="'Cormorant Garamond', 'Playfair Display', serif" font-size="44" font-weight="300" fill="currentColor">F</text>
              <text x="50" y="68" font-family="'Cormorant Garamond', 'Playfair Display', serif" font-size="44" font-style="italic" font-weight="300" fill="var(--color-accent-gold)">P</text>
            </svg>
          </div>
          
          <span class="font-serif-luxury text-xl tracking-[0.25em] uppercase font-light text-[var(--color-text-primary)] hidden sm:inline-block">
            ${storeConfig.storeName}
          </span>
        </a>

        <!-- Interactive Utilities (Right align) -->
        <div class="flex items-center space-x-2 sm:space-x-4 flex-1 md:flex-initial justify-end">
          <!-- Search Button (Touch target >= 44px) -->
          <button class="w-11 h-11 flex items-center justify-center text-[var(--color-text-primary)] hover:text-[var(--color-accent-gold)] transition-colors duration-300">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <!-- Cart Button with Count Badge (Touch target >= 44px) -->
          <button class="w-11 h-11 flex items-center justify-center text-[var(--color-text-primary)] hover:text-[var(--color-accent-gold)] transition-colors relative">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span class="absolute top-2 right-2 bg-[var(--color-accent-gold)] text-[var(--color-cta-text)] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold scale-90">
              0
            </span>
          </button>
        </div>

      </div>

      <!-- Mobile Dropdown Menu Drawer -->
      <div id="mobile-menu" class="hidden md:hidden bg-[var(--color-surface-card)] border-b border-[var(--color-border-subtle)]">
        <div class="px-4 pt-2 pb-6 space-y-4 flex flex-col">
          ${storeConfig.navigation.map(item => `
            <a 
              href="${item.link}" 
              class="text-sm uppercase tracking-widest text-[var(--color-text-primary)] hover:text-[var(--color-accent-gold)] py-2 border-b border-gray-50 font-medium"
            >
              ${item.label}
            </a>
          `).join('')}
        </div>
      </div>
    </header>
  `;

  // Setup Event Listeners for mobile drawer toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      if (isHidden) {
        mobileMenu.classList.remove('hidden');
        mobileMenuBtn.innerHTML = `
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        `;
      } else {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.innerHTML = `
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 8h16M4 16h16" />
          </svg>
        `;
      }
    });
  }

  // Smooth scroll shrink header interaction
  const headerElement = document.getElementById('main-header');
  if (headerElement) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        headerElement.classList.add('py-1');
        headerElement.classList.remove('py-2');
      } else {
        headerElement.classList.remove('py-1');
        headerElement.classList.add('py-2');
      }
    });
  }
}
