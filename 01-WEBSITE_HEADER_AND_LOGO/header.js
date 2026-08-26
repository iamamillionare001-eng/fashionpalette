/**
 * WEBSITE HEADER & LOGO COMPONENT
 * Renders the sticky luxury navigation, interactive mobile menu drawers,
 * and the custom interlocking "FP" monogram logo badge.
 */

import { storeConfig } from '../07-STORE_SETTINGS_AND_THEME_COLORS/store_config.js';

/* FOUNDER CONFIG: Add, remove, or rename menu links here */
export const NAVIGATION_LINKS = [
  { 
    label: "Women", 
    link: "#women", 
    description: "Ethnic, Sarees & Western Couture" 
  },
  { 
    label: "Men", 
    link: "#men", 
    description: "Designer Kurtas & Modern Wear" 
  },
  { 
    label: "Couple's Edit", 
    link: "#couples-edit", 
    badge: "Trending", 
    description: "Curated Coordinated & Twinned Ensembles" 
  },
  { 
    label: "Kids", 
    link: "#kids", 
    description: "Festive & Casual Wear for Boys & Girls" 
  },
  { 
    label: "Elders & Comfort", 
    link: "#elders", 
    description: "Soft Pure Cottons & Relaxed Fits" 
  },
  { 
    label: "Accessories", 
    link: "#accessories", 
    badge: "Coming Soon", 
    description: "Jewelry, Stoles & Footwear" 
  }
];

export function initHeader(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const firstInitial = storeConfig.logoInitials ? storeConfig.logoInitials[0] : 'F';
  const secondInitial = storeConfig.logoInitials ? storeConfig.logoInitials[1] : 'P';

  // Helper function to render elegant badges on desktop navigation
  function getDesktopBadge(item) {
    if (!item.badge) return '';
    if (item.label === "Couple's Edit") {
      return `<span class="ml-1 px-1.5 py-0.5 text-[8px] leading-none uppercase tracking-widest bg-[#C5A880] text-white rounded-full font-semibold inline-block align-middle select-none">Trending</span>`;
    }
    if (item.label === "Accessories") {
      return `<span class="ml-1 px-1.5 py-0.5 text-[8px] leading-none uppercase tracking-widest bg-stone-200 text-stone-500 rounded-full font-medium inline-block align-middle select-none">Soon</span>`;
    }
    return `<span class="ml-1 px-1.5 py-0.5 text-[8px] leading-none uppercase tracking-widest bg-[#C5A880] text-white rounded-full font-semibold inline-block align-middle select-none">${item.badge}</span>`;
  }

  // Render Header HTML Structure
  container.innerHTML = `
    <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md bg-[#F9F8F6]/90 border-b border-[#E5E3DF]" id="main-header">
      <!-- Top Promo / Festive Banner -->
      ${storeConfig.festiveOffers.active ? `
      <div class="bg-[#1A1A1A] text-[#F9F8F6] py-2 px-4 text-center text-[10px] tracking-widest uppercase font-medium relative overflow-hidden select-none">
        <div class="animate-pulse inline-block mr-2 w-1.5 h-1.5 rounded-full bg-[#C5A880]"></div>
        <span>${storeConfig.festiveOffers.bannerText}</span>
      </div>
      ` : ''}

      <!-- Main Navigation Bar -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between transition-all duration-300" id="nav-container">
        
        <!-- Mobile Menu Toggle Button Container (visible on mobile, hidden on desktop >= 768px) -->
        <div class="flex items-center justify-start flex-1 md:hidden">
          <button 
            id="mobile-menu-btn" 
            class="flex items-center justify-center w-11 h-11 text-[#1A1A1A] hover:opacity-75 focus:outline-none"
            aria-label="Open Menu"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 8h16M4 16h16" />
            </svg>
          </button>
        </div>

        <!-- Desktop Navigation Links (Left align) -->
        <nav class="hidden md:flex space-x-4 lg:space-x-6 items-center flex-1">
          ${NAVIGATION_LINKS.map(item => `
            <a 
              href="${item.link}" 
              class="relative py-2 text-[11px] uppercase tracking-widest text-[#1A1A1A] hover:text-[#C5A880] transition-colors duration-300 font-medium group flex items-center"
            >
              <span>${item.label}</span>
              ${getDesktopBadge(item)}
              <span class="absolute bottom-0 left-0 w-full h-[1px] bg-[#1A1A1A] scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-left"></span>
            </a>
          `).join('')}
        </nav>

        <!-- Brand Logo & Monogram Badge (Centered) -->
        <a href="#" id="brand-logo" class="flex items-center space-x-3 justify-center flex-initial group">
          <!-- Beautiful Custom Interlocking FP Monogram Logo -->
          <div class="relative w-12 h-12 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
            <svg width="48" height="48" viewBox="0 0 100 100" class="w-full h-full text-[#1A1A1A]">
              <!-- Thin Luxury Outer Circles -->
              <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width="1" class="opacity-80" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="#C5A880" stroke-width="0.75" stroke-dasharray="2,2" class="opacity-60" />
              
              <!-- Serif Overlapping letters -->
              <text x="32" y="62" font-family="'Playfair Display', 'Cormorant Garamond', serif" font-size="44" font-weight="300" fill="currentColor">${firstInitial}</text>
              <text x="50" y="68" font-family="'Playfair Display', 'Cormorant Garamond', serif" font-size="44" font-style="italic" font-weight="300" fill="#C5A880">${secondInitial}</text>
            </svg>
          </div>
          
          <div class="flex flex-col items-start leading-none select-none">
            <span class="font-serif text-xl tracking-[0.22em] uppercase font-light text-[#1A1A1A] leading-tight hidden min-[480px]:inline-block">
              ${storeConfig.storeName}
            </span>
            <span class="text-[8px] tracking-[0.22em] uppercase text-[#5A5A5A] mt-0.5 leading-none hidden sm:inline-block font-sans">
              Haute Couture & Pret-a-Porter
            </span>
          </div>
        </a>

        <!-- Interactive Utilities (Right align) -->
        <div class="flex items-center space-x-2 sm:space-x-4 flex-1 justify-end">
          <!-- Currency Indicator Pill -->
          <div class="hidden sm:flex items-center border border-[#E5E3DF] px-2.5 py-1 rounded-full text-[10px] tracking-wider uppercase font-semibold text-[#1A1A1A] bg-[#FFFFFF]/50 hover:bg-[#FFFFFF] transition-all cursor-default select-none shadow-xs">
            <span>${storeConfig.currency} ${storeConfig.currencyCode}</span>
          </div>

          <!-- Expanding Search Input Component -->
          <div class="relative flex items-center">
            <input 
              type="text" 
              id="search-input" 
              placeholder="Search collections..." 
              class="w-0 opacity-0 pointer-events-none transition-all duration-300 ease-in-out border-b border-[#1A1A1A] focus:outline-none text-[11px] bg-transparent py-1 uppercase tracking-widest text-[#1A1A1A] placeholder:text-[#5A5A5A]/50"
            />
            <button 
              id="search-btn" 
              class="w-11 h-11 flex items-center justify-center text-[#1A1A1A] hover:text-[#C5A880] transition-colors duration-300 focus:outline-none"
              aria-label="Search"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          <!-- Cart Button with Count Badge (Touch target >= 44px) -->
          <button 
            id="cart-btn" 
            class="w-11 h-11 flex items-center justify-center text-[#1A1A1A] hover:text-[#C5A880] transition-colors relative focus:outline-none"
            aria-label="Shopping Bag"
          >
            <!-- Minimal Luxury Shopping Bag SVG -->
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span 
              id="cart-badge" 
              class="absolute top-2 right-2 bg-[#C5A880] text-[#FFFFFF] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold scale-90"
            >
              0
            </span>
          </button>
        </div>

      </div>
    </header>

    <!-- Mobile Drawer Overlay Backdrop -->
    <div 
      id="mobile-drawer-overlay" 
      class="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ease-in-out opacity-0 pointer-events-none"
    ></div>

    <!-- Mobile Drawer Navigation (Slides from Left) -->
    <div 
      id="mobile-drawer" 
      class="fixed top-0 left-0 bottom-0 z-50 w-[300px] max-w-[85vw] h-full bg-[#F9F8F6] shadow-2xl transition-transform duration-300 ease-in-out -translate-x-full flex flex-col border-r border-[#E5E3DF]"
    >
      <!-- Drawer Header -->
      <div class="px-6 flex items-center justify-between border-b border-[#E5E3DF] h-20 flex-shrink-0">
        <div class="flex items-center space-x-2">
          <!-- Monogram FP Badge -->
          <a href="#" id="drawer-logo" class="flex items-center space-x-2 group">
            <div class="w-8 h-8 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 100 100" class="w-full h-full text-[#1A1A1A]">
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width="1.5" />
                <text x="32" y="62" font-family="'Playfair Display', serif" font-size="44" font-weight="300" fill="currentColor">${firstInitial}</text>
                <text x="50" y="68" font-family="'Playfair Display', serif" font-size="44" font-style="italic" font-weight="300" fill="#C5A880">${secondInitial}</text>
              </svg>
            </div>
            <span class="font-serif text-sm tracking-[0.2em] uppercase font-light text-[#1A1A1A]">${storeConfig.storeName}</span>
          </a>
        </div>
        <button 
          id="mobile-drawer-close" 
          class="w-11 h-11 flex items-center justify-center text-[#1A1A1A] hover:opacity-75 focus:outline-none"
          aria-label="Close menu"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Drawer Links Container (Scrollable) -->
      <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        ${NAVIGATION_LINKS.map(item => {
          let badgeHtml = '';
          if (item.badge) {
            const badgeClass = item.label === 'Accessories' ? 'bg-stone-200 text-stone-500' : 'bg-[#C5A880] text-white';
            const badgeText = item.label === 'Accessories' ? 'Soon' : item.badge;
            badgeHtml = `<span class="px-2 py-0.5 text-[8px] leading-none uppercase tracking-widest rounded-full font-medium select-none ${badgeClass}">${badgeText}</span>`;
          }
          return `
            <a 
              href="${item.link}" 
              class="mobile-drawer-link flex flex-col justify-center min-h-[56px] py-2.5 px-4 text-xs text-[#1A1A1A] hover:bg-[#FFFFFF]/50 transition-colors duration-300 border-b border-[#E5E3DF]/30"
            >
              <div class="flex items-center justify-between w-full">
                <span class="uppercase tracking-widest font-semibold">${item.label}</span>
                ${badgeHtml}
              </div>
              <span class="text-[9px] tracking-wider text-[#5A5A5A] mt-1 normal-case font-normal leading-tight">
                ${item.description}
              </span>
            </a>
          `;
        }).join('')}
      </nav>

      <!-- Drawer Footer -->
      <div class="p-6 border-t border-[#E5E3DF] space-y-4 flex-shrink-0 bg-[#F5F4F0]/50">
        <!-- Mobile Currency Info -->
        <div class="flex items-center justify-between text-[10px] tracking-wider uppercase text-[#5A5A5A]">
          <span>Currency</span>
          <span class="font-bold border border-[#E5E3DF] px-2.5 py-0.5 rounded-full bg-[#FFFFFF] text-[#1A1A1A]">${storeConfig.currency} ${storeConfig.currencyCode}</span>
        </div>
        <div class="text-[10px] text-[#5A5A5A] uppercase tracking-widest text-center mt-2 font-medium">
          ${storeConfig.contact.email}
        </div>
      </div>
    </div>
  `;

  // --- Element References ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileDrawerOverlay = document.getElementById('mobile-drawer-overlay');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');
  const mobileDrawerLinks = document.querySelectorAll('.mobile-drawer-link');
  
  const brandLogo = document.getElementById('brand-logo');
  const drawerLogo = document.getElementById('drawer-logo');

  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');

  const headerElement = document.getElementById('main-header');
  const navContainer = document.getElementById('nav-container');

  // --- Mobile Drawer Toggle Logic ---
  function openDrawer() {
    mobileDrawer.classList.remove('-translate-x-full');
    mobileDrawerOverlay.classList.remove('opacity-0', 'pointer-events-none');
    mobileDrawerOverlay.classList.add('opacity-100', 'pointer-events-auto');
    document.body.classList.add('overflow-hidden');
  }

  function closeDrawer() {
    mobileDrawer.classList.add('-translate-x-full');
    mobileDrawerOverlay.classList.remove('opacity-100', 'pointer-events-auto');
    mobileDrawerOverlay.classList.add('opacity-0', 'pointer-events-none');
    document.body.classList.remove('overflow-hidden');
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openDrawer);
  }
  if (mobileDrawerOverlay) {
    mobileDrawerOverlay.addEventListener('click', closeDrawer);
  }
  if (mobileDrawerClose) {
    mobileDrawerClose.addEventListener('click', closeDrawer);
  }
  mobileDrawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close drawer if screen resizes to desktop width
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      closeDrawer();
    }
  });

  // --- Scroll to Top Logic ---
  function handleLogoClick(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    // Remove hash from URL
    if (window.location.hash) {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  }

  if (brandLogo) {
    brandLogo.addEventListener('click', handleLogoClick);
  }
  if (drawerLogo) {
    drawerLogo.addEventListener('click', (e) => {
      closeDrawer();
      handleLogoClick(e);
    });
  }

  // --- Expanding Search Bar Logic ---
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = searchInput.classList.contains('w-40');
      if (isActive) {
        // If there's content, perform action (or simply close if empty)
        if (searchInput.value.trim() !== "") {
          console.log("Searching for:", searchInput.value);
        } else {
          // Collapse
          searchInput.classList.remove('w-40', 'opacity-100', 'pointer-events-auto', 'px-2');
          searchInput.classList.add('w-0', 'opacity-0', 'pointer-events-none');
        }
      } else {
        // Expand
        searchInput.classList.remove('w-0', 'opacity-0', 'pointer-events-none');
        searchInput.classList.add('w-40', 'opacity-100', 'pointer-events-auto', 'px-2');
        searchInput.focus();
      }
    });

    // Close on escape key
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = "";
        searchInput.classList.remove('w-40', 'opacity-100', 'pointer-events-auto', 'px-2');
        searchInput.classList.add('w-0', 'opacity-0', 'pointer-events-none');
        searchInput.blur();
      }
    });

    // Close when clicking elsewhere
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchBtn.contains(e.target)) {
        if (searchInput.classList.contains('w-40')) {
          searchInput.value = "";
          searchInput.classList.remove('w-40', 'opacity-100', 'pointer-events-auto', 'px-2');
          searchInput.classList.add('w-0', 'opacity-0', 'pointer-events-none');
        }
      }
    });
  }

  // --- Header Shrink on Scroll Logic ---
  if (headerElement && navContainer) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navContainer.classList.remove('h-20');
        navContainer.classList.add('h-16');
      } else {
        navContainer.classList.remove('h-16');
        navContainer.classList.add('h-20');
      }
    });
  }
}
