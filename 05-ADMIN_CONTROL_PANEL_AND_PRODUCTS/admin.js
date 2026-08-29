/**
 * ADMIN CONTROL PANEL & PRODUCT MANAGEMENT PLACEHOLDER
 * Serves as the dashboard workspace for founders to add products,
 * adjust pricing tiers, manage orders, and toggle active themes.
 */

import { storeConfig } from '../07-STORE_SETTINGS_AND_THEME_COLORS/store_config.js';

export function initAdmin(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  function isAuthenticated() {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  }

  // Render the admin console HTML
  function renderAdminConsole() {
    container.innerHTML = `
      <!-- Admin Custom Top-Bar -->
      <div class="bg-[#1A1A1A] text-[#F9F8F6] py-4 px-6 sm:px-8 flex items-center justify-between border-b border-[#C5A880] w-full sticky top-0 z-50">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 flex items-center justify-center border border-[#C5A880] rounded-full">
            <span class="font-serif text-xs text-[#C5A880]">FP</span>
          </div>
          <div>
            <h1 class="font-serif text-sm tracking-[0.2em] uppercase font-light leading-none">${storeConfig.storeName}</h1>
            <p class="text-[8px] uppercase tracking-wider text-[#C5A880] mt-1 font-sans leading-none">Founder Administration Console</p>
          </div>
        </div>
        
        <button 
          id="admin-logout-btn" 
          class="flex items-center space-x-2 border border-[#E5E3DF]/30 hover:border-[#C5A880] px-4 py-2 rounded-full text-[10px] tracking-wider uppercase font-semibold text-[#F9F8F6] hover:bg-[#C5A880] hover:text-[#1A1A1A] transition-all duration-300 focus:outline-none"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Exit / Logout to Storefront</span>
        </button>
      </div>

      <div class="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Section Header -->
        <div class="text-center max-w-xl mx-auto mb-12 space-y-4">
          <span class="text-xs uppercase tracking-[0.3em] text-[var(--color-accent-gold)] font-medium block">Control Panel</span>
          <h2 class="text-3xl font-serif font-light tracking-tight text-[var(--color-text-primary)]">Bespoke Storefront Manager</h2>
          <div class="h-[1px] w-12 bg-[var(--color-accent-gold)] mx-auto mt-4"></div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Product Creation Console (Left) -->
          <div class="lg:col-span-6 bg-white border border-[#E5E3DF] p-6 rounded-md space-y-6">
            <h3 class="text-md uppercase tracking-wider text-[#1A1A1A] font-bold border-b border-[#E5E3DF] pb-3">
              Add New Luxury Item
            </h3>
            
            <form class="space-y-4" onsubmit="event.preventDefault();">
              <div>
                <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Product Title</label>
                <input type="text" placeholder="e.g. Silk Tuxedo Jacket" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3 py-2.5 text-xs rounded-md focus:outline-none focus:border-[#C5A880]" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Category</label>
                  <select class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3 py-2.5 text-xs rounded-md focus:outline-none focus:border-[#C5A880]">
                    <option>Ready-To-Wear</option>
                    <option>Accessories</option>
                    <option>Footwear</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Price (${storeConfig.currency})</label>
                  <input type="number" placeholder="18500" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3 py-2.5 text-xs rounded-md focus:outline-none focus:border-[#C5A880]" />
                </div>
              </div>

              <div>
                <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Product Image Asset URL</label>
                <input type="text" placeholder="https://..." class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3 py-2.5 text-xs rounded-md focus:outline-none focus:border-[#C5A880]" />
              </div>

              <button type="submit" class="w-full py-3 bg-[#1A1A1A] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#C5A880] hover:text-[#1A1A1A] transition-colors duration-300 rounded-md">
                Add to Storefront
              </button>
            </form>
          </div>

          <!-- Quick Store Configuration Stats (Right) -->
          <div class="lg:col-span-6 bg-[#F9F8F6] border border-[#E5E3DF] p-6 rounded-md space-y-6">
            <h3 class="text-md uppercase tracking-wider text-[#1A1A1A] font-bold border-b border-[#E5E3DF] pb-3 bg-white px-6 py-4 rounded-t-md -mx-6 -mt-6">
              Store Quick-Stats
            </h3>

            <div class="grid grid-cols-2 gap-4">
              <div class="bg-white p-4 border border-[#E5E3DF] rounded-md">
                <p class="text-[9px] uppercase tracking-widest text-[#5A5A5A]">Total Products</p>
                <p class="text-2xl font-light text-[#1A1A1A] mt-1">3 Active</p>
              </div>
              <div class="bg-white p-4 border border-[#E5E3DF] rounded-md">
                <p class="text-[9px] uppercase tracking-widest text-[#5A5A5A]">Total Revenue</p>
                <p class="text-2xl font-light text-[#C5A880] mt-1">${storeConfig.currency}1,34,500</p>
              </div>
            </div>

            <!-- Configuration Summary Table -->
            <div class="bg-white border border-[#E5E3DF] rounded-md p-4 space-y-3">
              <p class="text-[10px] uppercase tracking-wider text-[#1A1A1A] font-bold">Metadata Configurations</p>
              
              <div class="space-y-2 text-xs text-[#1A1A1A]">
                <div class="flex justify-between border-b border-[#E5E3DF] pb-1.5">
                  <span class="text-[#5A5A5A]">Store Name:</span>
                  <span class="font-medium">${storeConfig.storeName}</span>
                </div>
                <div class="flex justify-between border-b border-[#E5E3DF] pb-1.5">
                  <span class="text-[#5A5A5A]">Concierge Email:</span>
                  <span class="font-medium">${storeConfig.contact.email}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-[#5A5A5A]">Active Currency:</span>
                  <span class="font-medium">${storeConfig.currency} (${storeConfig.currencyCode})</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    `;

    // Hook up exit button inside console
    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }
  }

  function handleSuccessfulUnlock() {
    sessionStorage.setItem('admin_authenticated', 'true');
    const storefront = document.getElementById('storefront-view');
    if (storefront) {
      storefront.classList.add('hidden');
    }
    container.classList.remove('hidden');
    renderAdminConsole();
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (window.location.hash !== '#admin') {
      window.location.hash = 'admin';
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_authenticated');
    
    // Hide admin view
    container.classList.add('hidden');
    container.innerHTML = '';

    // Show storefront view
    const storefront = document.getElementById('storefront-view');
    if (storefront) {
      storefront.classList.remove('hidden');
    }

    // Set hash back to homepage
    history.pushState("", document.title, window.location.pathname + window.location.search);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function showPasswordModal() {
    if (document.getElementById('admin-auth-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'admin-auth-modal';
    modal.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-300';
    modal.innerHTML = `
      <div class="bg-[#F9F8F6] border border-[#E5E3DF] p-8 max-w-sm w-full mx-4 rounded-lg shadow-2xl space-y-6 transform transition-all duration-300 scale-95 opacity-0" id="auth-modal-card">
        <div class="text-center space-y-2">
          <div class="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-stone-100 text-[#C5A880]">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 class="font-serif text-lg tracking-wider text-[#1A1A1A] uppercase">Founder Access</h3>
          <p class="text-[10px] uppercase tracking-widest text-[#5A5A5A]">Private Atelier Console PIN</p>
        </div>
        
        <div class="space-y-4">
          <div>
            <input 
              type="password" 
              id="admin-pin-input" 
              placeholder="Enter PIN" 
              class="w-full text-center tracking-[0.5em] font-mono bg-white border border-[#E5E3DF] px-4 py-3 text-base rounded-md focus:outline-none focus:border-[#C5A880] transition-colors"
              maxlength="10"
              autofocus
            />
            <p id="auth-error-msg" class="text-[10px] text-rose-600 mt-2 text-center hidden font-medium tracking-wide">Invalid Passcode. Access Denied.</p>
          </div>
          
          <div class="grid grid-cols-2 gap-3 pt-2">
            <button 
              id="auth-cancel-btn" 
              class="py-2.5 border border-[#E5E3DF] text-[#5A5A5A] text-[10px] uppercase tracking-widest font-semibold hover:bg-stone-50 transition-colors rounded-md focus:outline-none"
            >
              Cancel
            </button>
            <button 
              id="auth-unlock-btn" 
              class="py-2.5 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest font-semibold hover:bg-[#C5A880] transition-colors rounded-md focus:outline-none"
            >
              Unlock
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    setTimeout(() => {
      const card = document.getElementById('auth-modal-card');
      if (card) {
        card.classList.remove('scale-95', 'opacity-0');
        card.classList.add('scale-100', 'opacity-100');
      }
    }, 10);

    const pinInput = document.getElementById('admin-pin-input');
    const errorMsg = document.getElementById('auth-error-msg');
    const cancelBtn = document.getElementById('auth-cancel-btn');
    const unlockBtn = document.getElementById('auth-unlock-btn');

    function cleanup() {
      const card = document.getElementById('auth-modal-card');
      if (card) {
        card.classList.remove('scale-100', 'opacity-100');
        card.classList.add('scale-95', 'opacity-0');
      }
      setTimeout(() => {
        if (modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
      }, 300);
    }

    function attemptUnlock() {
      const pin = pinInput.value.trim();
      if (pin === "1234") {
        cleanup();
        handleSuccessfulUnlock();
      } else {
        errorMsg.classList.remove('hidden');
        pinInput.value = "";
        pinInput.focus();
        pinInput.classList.add('border-rose-300');
        setTimeout(() => pinInput.classList.remove('border-rose-300'), 500);
      }
    }

    cancelBtn.addEventListener('click', () => {
      cleanup();
      // Reset hash if canceled, showing storefront
      history.pushState("", document.title, window.location.pathname + window.location.search);
      const storefront = document.getElementById('storefront-view');
      if (storefront) {
        storefront.classList.remove('hidden');
      }
      container.classList.add('hidden');
    });

    unlockBtn.addEventListener('click', attemptUnlock);
    pinInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        attemptUnlock();
      }
    });
  }

  function checkRoute() {
    const storefront = document.getElementById('storefront-view');

    if (window.location.hash === '#admin') {
      if (isAuthenticated()) {
        if (storefront) {
          storefront.classList.add('hidden');
        }
        container.classList.remove('hidden');
        renderAdminConsole();
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        if (storefront) {
          storefront.classList.remove('hidden');
        }
        container.classList.add('hidden');
        showPasswordModal();
      }
    } else {
      if (storefront) {
        storefront.classList.remove('hidden');
      }
      container.classList.add('hidden');
      container.innerHTML = '';
      
      const modal = document.getElementById('admin-auth-modal');
      if (modal && modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    }
  }

  window.addEventListener('hashchange', checkRoute);
  checkRoute();

  function setupFounderTrigger() {
    const trigger = document.getElementById('founder-trigger');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = 'admin';
      });
    } else {
      setTimeout(setupFounderTrigger, 500);
    }
  }

  setupFounderTrigger();
}
