/**
 * ADMIN CONTROL PANEL & PRODUCT MANAGEMENT PLACEHOLDER
 * Serves as the dashboard workspace for founders to add products,
 * adjust pricing tiers, manage orders, and toggle active themes.
 */

import { storeConfig } from '../07-STORE_SETTINGS_AND_THEME_COLORS/store_config.js';

export function initAdmin(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Render the admin console HTML
  function renderAdminConsole() {
    container.innerHTML = `
      <section id="admin" class="py-20 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-card)]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <!-- Section Header -->
          <div class="text-center max-w-xl mx-auto mb-16 space-y-4">
            <span class="text-xs uppercase tracking-[0.3em] text-[var(--color-accent-gold)] font-medium block">Store Administration</span>
            <h2 class="text-3xl sm:text-4xl font-light tracking-tight text-[var(--color-text-primary)]">Founder Control Panel</h2>
            <div class="h-[1px] w-12 bg-[var(--color-accent-gold)] mx-auto mt-4"></div>
            <p class="text-xs text-[var(--color-text-secondary)] font-light">
              Directly configure store attributes, catalog items, and order logs. Protected workspace for operators.
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- Product Creation Console (Left) -->
            <div class="lg:col-span-6 bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] p-6 rounded-[var(--border-radius-sm)] space-y-6">
              <h3 class="text-md uppercase tracking-wider text-[var(--color-text-primary)] font-bold border-b border-[var(--color-border-subtle)] pb-3">
                Add New Luxury Item
              </h3>
              
              <form class="space-y-4" onsubmit="event.preventDefault();">
                <div>
                  <label class="block text-[9px] uppercase tracking-wider text-[var(--color-text-secondary)] font-bold mb-1.5">Product Title</label>
                  <input type="text" placeholder="e.g. Silk Tuxedo Jacket" class="w-full bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] px-3 py-2.5 text-xs rounded-[var(--border-radius-sm)] focus:outline-none focus:border-[var(--color-accent-gold)]" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[9px] uppercase tracking-wider text-[var(--color-text-secondary)] font-bold mb-1.5">Category</label>
                    <select class="w-full bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] px-3 py-2.5 text-xs rounded-[var(--border-radius-sm)] focus:outline-none focus:border-[var(--color-accent-gold)]">
                      <option>Ready-To-Wear</option>
                      <option>Accessories</option>
                      <option>Footwear</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-[9px] uppercase tracking-wider text-[var(--color-text-secondary)] font-bold mb-1.5">Price (${storeConfig.currency})</label>
                    <input type="number" placeholder="18500" class="w-full bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] px-3 py-2.5 text-xs rounded-[var(--border-radius-sm)] focus:outline-none focus:border-[var(--color-accent-gold)]" />
                  </div>
                </div>

                <div>
                  <label class="block text-[9px] uppercase tracking-wider text-[var(--color-text-secondary)] font-bold mb-1.5">Product Image Asset URL</label>
                  <input type="text" placeholder="https://..." class="w-full bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] px-3 py-2.5 text-xs rounded-[var(--border-radius-sm)] focus:outline-none focus:border-[var(--color-accent-gold)]" />
                </div>

                <button type="submit" class="w-full py-3 bg-[var(--color-cta-fill)] text-[var(--color-cta-text)] text-xs uppercase tracking-widest font-semibold hover:bg-[var(--color-accent-gold)] transition-colors duration-300 rounded-[var(--border-radius-sm)]">
                  Add to Storefront
                </button>
              </form>
            </div>

            <!-- Quick Store Configuration Stats (Right) -->
            <div class="lg:col-span-6 bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] p-6 rounded-[var(--border-radius-sm)] space-y-6">
              <h3 class="text-md uppercase tracking-wider text-[var(--color-text-primary)] font-bold border-b border-[var(--color-border-subtle)] pb-3">
                Store Quick-Stats
              </h3>

              <div class="grid grid-cols-2 gap-4">
                <div class="bg-[var(--color-surface-card)] p-4 border border-[var(--color-border-subtle)] rounded-[var(--border-radius-sm)]">
                  <p class="text-[9px] uppercase tracking-widest text-[var(--color-text-secondary)]">Total Products</p>
                  <p class="text-2xl font-light text-[var(--color-text-primary)] mt-1">3 Active</p>
                </div>
                <div class="bg-[var(--color-surface-card)] p-4 border border-[var(--color-border-subtle)] rounded-[var(--border-radius-sm)]">
                  <p class="text-[9px] uppercase tracking-widest text-[var(--color-text-secondary)]">Total Revenue</p>
                  <p class="text-2xl font-light text-emerald-700 mt-1">${storeConfig.currency}1,34,500</p>
                </div>
              </div>

              <!-- Configuration Summary Table -->
              <div class="bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] rounded-[var(--border-radius-sm)] p-4 space-y-3">
                <p class="text-[10px] uppercase tracking-wider text-[var(--color-text-primary)] font-bold">Metadata Configurations</p>
                
                <div class="space-y-2 text-xs">
                  <div class="flex justify-between border-b border-gray-50 pb-1.5">
                    <span class="text-[var(--color-text-secondary)]">Store Name:</span>
                    <span class="font-medium">${storeConfig.storeName}</span>
                  </div>
                  <div class="flex justify-between border-b border-gray-50 pb-1.5">
                    <span class="text-[var(--color-text-secondary)]">Concierge Email:</span>
                    <span class="font-medium">${storeConfig.contact.email}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-[var(--color-text-secondary)]">Active Currency:</span>
                    <span class="font-medium">${storeConfig.currency} (${storeConfig.currencyCode})</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
    `;
  }

  function isAuthenticated() {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  }

  function handleSuccessfulUnlock() {
    sessionStorage.setItem('admin_authenticated', 'true');
    container.classList.remove('hidden');
    renderAdminConsole();
    // Scroll to container
    container.scrollIntoView({ behavior: 'smooth' });
    // Update hash
    if (window.location.hash !== '#admin') {
      window.location.hash = 'admin';
    }
  }

  function showPasswordModal() {
    // If modal already exists, don't create another
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

    // Animation entry
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
      // Reset hash if canceled
      if (window.location.hash === '#admin') {
        history.pushState("", document.title, window.location.pathname + window.location.search);
      }
    });

    unlockBtn.addEventListener('click', attemptUnlock);
    pinInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        attemptUnlock();
      }
    });
  }

  function checkRoute() {
    if (window.location.hash === '#admin') {
      if (isAuthenticated()) {
        container.classList.remove('hidden');
        renderAdminConsole();
        container.scrollIntoView({ behavior: 'smooth' });
      } else {
        showPasswordModal();
      }
    } else {
      if (!isAuthenticated()) {
        container.classList.add('hidden');
        container.innerHTML = '';
      }
    }
  }

  // Monitor URL hash routing
  window.addEventListener('hashchange', checkRoute);
  
  // Check immediately on initialize
  checkRoute();

  // Setup discrete founder trigger listener in footer
  function setupFounderTrigger() {
    const trigger = document.getElementById('founder-trigger');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        if (isAuthenticated()) {
          container.classList.remove('hidden');
          renderAdminConsole();
          container.scrollIntoView({ behavior: 'smooth' });
          if (window.location.hash !== '#admin') {
            window.location.hash = 'admin';
          }
        } else {
          showPasswordModal();
        }
      });
    } else {
      setTimeout(setupFounderTrigger, 500);
    }
  }

  setupFounderTrigger();
}
