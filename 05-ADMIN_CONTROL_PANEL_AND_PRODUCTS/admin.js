/**
 * ADMIN CONTROL PANEL & PRODUCT MANAGEMENT
 * Serves as the dashboard workspace for founders to add products,
 * adjust pricing tiers, manage orders, track estimated profits,
 * configure store settings, and switch brand themes.
 */

import { storeConfig } from '../07-STORE_SETTINGS_AND_THEME_COLORS/store_config.js';
import { initHero, getHeroConfig } from '../02-HERO_BANNER_AND_FESTIVE_OFFERS/hero.js';
import { 
  uploadToImgBB, 
  subscribeToProducts, 
  saveProductToCloud, 
  updateProductStockInCloud, 
  deleteProductFromCloud, 
  subscribeToOrders, 
  saveOrderToCloud, 
  updateOrderStatusInCloud, 
  deleteOrderFromCloud 
} from '../07-STORE_SETTINGS_AND_THEME_COLORS/firebase_sync.js';

// Helper local functions to read/write product catalog
function getProducts() {
  const cached = localStorage.getItem("fp_products_data");
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.error("Error parsing fp_products_data", e);
    }
  }
  return [];
}

function saveProducts(products) {
  localStorage.setItem("fp_products_data", JSON.stringify(products));
  window.dispatchEvent(new CustomEvent("fp_products_updated"));
}

// Helper local functions to read/write orders list
function getOrders() {
  const cached = localStorage.getItem("fp_orders_data");
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.error("Error parsing fp_orders_data", e);
    }
  }
  return [];
}

function saveOrders(orders) {
  localStorage.setItem("fp_orders_data", JSON.stringify(orders));
  window.dispatchEvent(new CustomEvent("fp_orders_updated"));
}

// Helper local functions to read/write store settings
function getStoreSettings() {
  const cached = localStorage.getItem("fp_store_settings");
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.error("Error parsing fp_store_settings", e);
    }
  }
  
  // Return default configurations
  const defaults = {
    storeName: "FashionPalette",
    whatsappPhone: "919876543210",
    supportEmail: "concierge@fashionpalette.com",
    upiId: "pay@fashionpalette",
    theme: "Royale Noir"
  };
  localStorage.setItem("fp_store_settings", JSON.stringify(defaults));
  return defaults;
}

function saveStoreSettings(settings) {
  localStorage.setItem("fp_store_settings", JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent("fp_settings_updated"));
}

// Helper to compress image file using canvas and callback with Base64 URL
function compressAndConvertToBase64(file, callback) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (event) => {
    const img = new Image();
    img.src = event.target.result;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 800;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
      callback(compressedBase64);
    };
  };
}

export function initAdmin(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let activeTab = "dashboard"; // "dashboard" | "products" | "ledger" | "settings"

  // Product creation form state (persists across re-renders within the admin session)
  const defaultApparelSizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "Free Size"];
  const defaultCoupleSizes = ["Women M / Men L", "Women L / Men XL", "Custom Pair"];
  const selectedSizes = new Set(["M", "L", "XL"]); // default selections
  const customSizes = []; // user added custom sizes
  let uploadedMainImage = ""; 
  let uploadedGalleryImages = []; 
  let mainImageMode = "upload"; // "upload" | "url"
  let galleryImageMode = "upload"; // "upload" | "url"

  // Order ledger expand state
  const expandedOrders = new Set();

  function isAuthenticated() {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  }

  function isLiveEditMode() {
    return isAuthenticated() && localStorage.getItem('fp_live_edit_mode') === 'true';
  }

  function updateFloatingHUD() {
    const existingHUD = document.getElementById('fp-live-edit-hud');
    const isAuth = isAuthenticated();
    const isEditMode = localStorage.getItem('fp_live_edit_mode') === 'true';
    const isStorefront = window.location.hash !== '#admin';

    if (isAuth && isEditMode && isStorefront) {
      if (!existingHUD) {
        const hud = document.createElement('div');
        hud.id = 'fp-live-edit-hud';
        hud.className = 'fixed top-5 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-3 px-5 py-2.5 bg-[#1A1A1A]/95 text-white backdrop-blur-md rounded-full border border-[#C5A880]/70 shadow-2xl animate-fadeIn text-xs transition-all';
        hud.innerHTML = `
          <div class="flex items-center gap-2 font-serif tracking-wider uppercase text-amber-200">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>🛠️ Visual Edit Mode Active</span>
          </div>
          <span class="text-stone-500 select-none">|</span>
          <button id="hud-exit-edit-btn" class="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded-full text-[10px] uppercase tracking-wider font-semibold border border-stone-600 hover:border-[#C5A880] transition-all cursor-pointer focus:outline-none">
            Exit Edit Mode
          </button>
          <button id="hud-admin-panel-btn" class="px-3.5 py-1.5 bg-[#C5A880] hover:bg-[#d4b993] text-[#1A1A1A] rounded-full text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer focus:outline-none shadow-sm">
            Admin Panel
          </button>
        `;
        document.body.appendChild(hud);

        const exitBtn = document.getElementById('hud-exit-edit-btn');
        if (exitBtn) {
          exitBtn.addEventListener('click', () => {
            localStorage.setItem('fp_live_edit_mode', 'false');
            window.dispatchEvent(new CustomEvent('fp_edit_mode_toggled', { detail: { enabled: false } }));
            updateFloatingHUD();
          });
        }

        const adminBtn = document.getElementById('hud-admin-panel-btn');
        if (adminBtn) {
          adminBtn.addEventListener('click', () => {
            window.location.hash = 'admin';
          });
        }
      }
    } else {
      if (existingHUD) {
        existingHUD.remove();
      }
    }
  }

  // Render the admin console HTML
  function renderAdminConsole() {
    const orders = getOrders();
    const pendingOrdersCount = orders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").length;

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
        
        <div class="flex items-center space-x-3">
          <!-- Visual Live Edit Mode Switch in Top Bar -->
          <div class="flex items-center gap-2 bg-[#262626] border border-[#C5A880]/40 px-3 py-1.5 rounded-full">
            <span class="text-[9px] uppercase tracking-wider font-semibold text-[#E5E3DF] flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full ${isLiveEditMode() ? 'bg-emerald-400 animate-pulse' : 'bg-stone-500'}"></span>
              <span class="hidden sm:inline">Visual</span> Live Edit Mode
            </span>
            <button 
              id="admin-live-edit-toggle-btn"
              type="button"
              class="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isLiveEditMode() ? 'bg-emerald-600' : 'bg-stone-700'}"
              role="switch"
              aria-checked="${isLiveEditMode()}"
              title="Toggle Live On-Storefront Visual Edit Mode"
            >
              <span class="sr-only">Toggle Visual Edit Mode</span>
              <span class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isLiveEditMode() ? 'translate-x-4' : 'translate-x-0'}"></span>
            </button>
          </div>

          <button 
            id="admin-logout-btn" 
            class="flex items-center space-x-2 border border-[#E5E3DF]/30 hover:border-[#C5A880] px-4 py-2 rounded-full text-[10px] tracking-wider uppercase font-semibold text-[#F9F8F6] hover:bg-[#C5A880] hover:text-[#1A1A1A] transition-all duration-300 focus:outline-none"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span class="hidden sm:inline">Exit / Logout to Storefront</span>
            <span class="sm:hidden">Exit</span>
          </button>
        </div>
      </div>

      <!-- Luxury Tab Sub-Navigation Bar (4 Tabs) -->
      <style>
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      </style>
      <div class="border-b border-[#E5E3DF] bg-white w-full sticky top-[60px] sm:top-[68px] z-40 overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-6 sm:space-x-8 overflow-x-auto scrollbar-hide flex-nowrap py-1 sm:py-0">
          <button 
            id="tab-btn-dashboard" 
            class="flex-shrink-0 py-4 sm:py-4.5 text-[10px] sm:text-xs uppercase tracking-widest font-semibold border-b-2 transition-all focus:outline-none min-h-[48px] ${
              activeTab === "dashboard" 
                ? "border-[#1A1A1A] text-[#1A1A1A]" 
                : "border-transparent text-[#8A8A8A] hover:text-[#1A1A1A]"
            }"
          >
            Dashboard & Banners
          </button>
          <button 
            id="tab-btn-products" 
            class="flex-shrink-0 py-4 sm:py-4.5 text-[10px] sm:text-xs uppercase tracking-widest font-semibold border-b-2 transition-all focus:outline-none min-h-[48px] ${
              activeTab === "products" 
                ? "border-[#1A1A1A] text-[#1A1A1A]" 
                : "border-transparent text-[#8A8A8A] hover:text-[#1A1A1A]"
            }"
          >
            Manage Store Products
          </button>
          <button 
            id="tab-btn-ledger" 
            class="flex-shrink-0 py-4 sm:py-4.5 text-[10px] sm:text-xs uppercase tracking-widest font-semibold border-b-2 transition-all focus:outline-none flex items-center min-h-[48px] ${
              activeTab === "ledger" 
                ? "border-[#1A1A1A] text-[#1A1A1A]" 
                : "border-transparent text-[#8A8A8A] hover:text-[#1A1A1A]"
            }"
          >
            <span>Live Orders & Ledger</span>
            ${pendingOrdersCount > 0 ? `
              <span class="ml-2 bg-rose-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full font-sans animate-pulse">
                ${pendingOrdersCount}
              </span>
            ` : ''}
          </button>
          <button 
            id="tab-btn-settings" 
            class="flex-shrink-0 py-4 sm:py-4.5 text-[10px] sm:text-xs uppercase tracking-widest font-semibold border-b-2 transition-all focus:outline-none min-h-[48px] ${
              activeTab === "settings" 
                ? "border-[#1A1A1A] text-[#1A1A1A]" 
                : "border-transparent text-[#8A8A8A] hover:text-[#1A1A1A]"
            }"
          >
            Store Settings & Theme
          </button>
        </div>
      </div>

      <!-- Tab Content Area -->
      <div class="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="admin-tab-content-container">
        <!-- Rendered dynamically -->
      </div>
    `;

    // Hook up exit button inside console
    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    // Hook up Live Edit Toggle button in console
    const liveEditToggleBtn = document.getElementById('admin-live-edit-toggle-btn');
    if (liveEditToggleBtn) {
      liveEditToggleBtn.addEventListener('click', () => {
        const currentlyActive = localStorage.getItem('fp_live_edit_mode') === 'true';
        const nextState = !currentlyActive;
        localStorage.setItem('fp_live_edit_mode', nextState.toString());
        window.dispatchEvent(new CustomEvent('fp_edit_mode_toggled', { detail: { enabled: nextState } }));
        renderAdminConsole();
        updateFloatingHUD();
      });
    }

    // Tab button click listeners
    const tabDashboard = document.getElementById('tab-btn-dashboard');
    const tabProducts = document.getElementById('tab-btn-products');
    const tabLedger = document.getElementById('tab-btn-ledger');
    const tabSettings = document.getElementById('tab-btn-settings');

    if (tabDashboard) {
      tabDashboard.addEventListener('click', () => {
        activeTab = "dashboard";
        renderAdminConsole();
      });
    }
    if (tabProducts) {
      tabProducts.addEventListener('click', () => {
        activeTab = "products";
        renderAdminConsole();
      });
    }
    if (tabLedger) {
      tabLedger.addEventListener('click', () => {
        activeTab = "ledger";
        renderAdminConsole();
      });
    }
    if (tabSettings) {
      tabSettings.addEventListener('click', () => {
        activeTab = "settings";
        renderAdminConsole();
      });
    }

    // Render the active tab content
    if (activeTab === "dashboard") {
      renderDashboardTab();
    } else if (activeTab === "products") {
      renderProductsTab();
    } else if (activeTab === "ledger") {
      renderLedgerTab();
    } else {
      renderSettingsTab();
    }
  }

  // TAB 1: DASHBOARD & HERO BANNERS
  function renderDashboardTab() {
    const tabContent = document.getElementById('admin-tab-content-container');
    if (!tabContent) return;

    const products = getProducts();
    const orders = getOrders();
    const grossRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    tabContent.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
        
        <!-- Top: Visual Live Edit Mode Banner Card -->
        <div class="lg:col-span-12 bg-gradient-to-r from-[#1A1A1A] via-stone-900 to-[#1A1A1A] text-[#F9F8F6] p-6 rounded-2xl border border-[#C5A880]/50 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="space-y-1.5">
            <div class="flex items-center gap-2.5">
              <span class="text-lg">🛠️</span>
              <h3 class="font-serif text-base tracking-wider uppercase text-amber-200">Visual Live Edit Mode</h3>
              <span class="px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-bold ${isLiveEditMode() ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse' : 'bg-stone-800 text-stone-400 border border-stone-700'}">
                ${isLiveEditMode() ? 'Active on Storefront' : 'Inactive'}
              </span>
            </div>
            <p class="text-xs text-[#E5E3DF]/80 font-light leading-relaxed max-w-2xl">
              Enable direct on-storefront visual editing: Quick-edit titles and prices via instant modals, drag-and-drop cards to reorder catalog sequence, toggle stock visibility, and delete items with 1-click cloud sync.
            </p>
          </div>
          <div class="flex items-center gap-3 w-full md:w-auto flex-shrink-0">
            <button 
              id="dashboard-toggle-live-edit-btn"
              class="flex-1 md:flex-none px-5 py-3 ${isLiveEditMode() ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-stone-800 hover:bg-stone-700 text-stone-200'} rounded-xl text-xs uppercase tracking-wider font-semibold border border-[#C5A880]/40 transition-all shadow-sm focus:outline-none min-h-[44px]"
            >
              ${isLiveEditMode() ? '✓ Live Edit Active (Turn Off)' : '⚡ Activate Live Edit Mode'}
            </button>
            <button
              id="dashboard-goto-storefront-btn" 
              class="flex-1 md:flex-none px-5 py-3 bg-[#C5A880] hover:bg-[#b0936b] text-[#1A1A1A] rounded-xl text-xs uppercase tracking-wider font-bold transition-all text-center shadow-sm min-h-[44px]"
            >
              View Storefront ➔
            </button>
          </div>
        </div>

        <!-- Left: Manage Hero & Seasonal Banners -->
        <div class="lg:col-span-7 bg-white border border-[#E5E3DF] p-6 rounded-2xl space-y-6">
          <div>
            <h3 class="text-sm uppercase tracking-wider text-[#1A1A1A] font-bold border-b border-[#E5E3DF] pb-3 flex items-center gap-2">
              <svg class="w-4 h-4 text-[#C5A880]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Manage Hero & Seasonal Banners
            </h3>
          </div>
          
          <form id="hero-manager-form" class="space-y-4" onsubmit="event.preventDefault();">
            <div>
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Tagline (e.g. "Festive Collection 2026")</label>
              <input type="text" id="admin-hero-tagline" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
            </div>
            
            <div>
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Main Headline</label>
              <input type="text" id="admin-hero-headline" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
            </div>

            <div>
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Subtitle / Description</label>
              <textarea id="admin-hero-subtitle" rows="3" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880] resize-none"></textarea>
            </div>

            <div>
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Active Promo Code & Badge Text</label>
              <input type="text" id="admin-hero-promo" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
            </div>

            <div>
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Hero Image URL</label>
              <input type="text" id="admin-hero-image" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
            </div>

            <div class="grid grid-cols-2 gap-3 pt-2">
              <button type="button" id="admin-hero-reset-btn" class="py-3 border border-[#E5E3DF] text-[#5A5A5A] text-xs uppercase tracking-widest font-semibold hover:bg-stone-50 transition-colors rounded-xl focus:outline-none">
                Reset to Defaults
              </button>
              <button type="submit" id="admin-hero-save-btn" class="py-3 bg-[#1A1A1A] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#C5A880] hover:text-[#1A1A1A] transition-colors duration-300 rounded-xl">
                Save Hero Changes
              </button>
            </div>
          </form>
        </div>

        <!-- Right: Stats & Metadata Configuration -->
        <div class="lg:col-span-5 space-y-6">
          <div class="bg-white border border-[#E5E3DF] p-6 rounded-2xl space-y-6">
            <h3 class="text-sm uppercase tracking-wider text-[#1A1A1A] font-bold border-b border-[#E5E3DF] pb-3">
              Store Quick-Stats
            </h3>

            <div class="grid grid-cols-2 gap-4">
              <div class="bg-[#F9F8F6] p-4 border border-[#E5E3DF] rounded-xl">
                <p class="text-[9px] uppercase tracking-widest text-[#5A5A5A] font-semibold">Total Products</p>
                <p class="text-2xl font-light text-[#1A1A1A] mt-1">${products.length} Active</p>
              </div>
              <div class="bg-[#F9F8F6] p-4 border border-[#E5E3DF] rounded-xl">
                <p class="text-[9px] uppercase tracking-widest text-[#5A5A5A] font-semibold">Total Revenue</p>
                <p class="text-2xl font-light text-[#C5A880] mt-1">${storeConfig.currency}${grossRevenue.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <!-- Configuration Summary Table -->
            <div class="bg-[#F9F8F6] border border-[#E5E3DF] rounded-xl p-4 space-y-3">
              <p class="text-[10px] uppercase tracking-wider text-[#1A1A1A] font-bold">Metadata Configurations</p>
              
              <div class="space-y-2.5 text-xs text-[#1A1A1A]">
                <div class="flex justify-between border-b border-[#E5E3DF] pb-2">
                  <span class="text-[#5A5A5A]">Store Name:</span>
                  <span class="font-medium">${storeConfig.storeName}</span>
                </div>
                <div class="flex justify-between border-b border-[#E5E3DF] pb-2">
                  <span class="text-[#5A5A5A]">Concierge Email:</span>
                  <span class="font-medium text-right break-all">${storeConfig.contact.email}</span>
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

    // Hook up Dashboard Live Edit Toggle Button
    const dashToggleBtn = document.getElementById('dashboard-toggle-live-edit-btn');
    if (dashToggleBtn) {
      dashToggleBtn.addEventListener('click', () => {
        const currentlyActive = localStorage.getItem('fp_live_edit_mode') === 'true';
        const nextState = !currentlyActive;
        localStorage.setItem('fp_live_edit_mode', nextState.toString());
        window.dispatchEvent(new CustomEvent('fp_edit_mode_toggled', { detail: { enabled: nextState } }));
        renderDashboardTab();
        updateFloatingHUD();
      });
    }

    const gotoStorefrontBtn = document.getElementById('dashboard-goto-storefront-btn');
    if (gotoStorefrontBtn) {
      gotoStorefrontBtn.addEventListener('click', () => {
        // Exit to storefront
        container.classList.add('hidden');
        const storefront = document.getElementById('storefront-view');
        if (storefront) storefront.classList.remove('hidden');
        history.pushState("", document.title, window.location.pathname + window.location.search);
        updateFloatingHUD();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Populate Hero Manager fields from localStorage config
    const heroConfig = getHeroConfig();
    const taglineInput = document.getElementById('admin-hero-tagline');
    const headlineInput = document.getElementById('admin-hero-headline');
    const subtitleInput = document.getElementById('admin-hero-subtitle');
    const promoInput = document.getElementById('admin-hero-promo');
    const imageInput = document.getElementById('admin-hero-image');

    if (taglineInput) taglineInput.value = heroConfig.headlineTag || '';
    if (headlineInput) headlineInput.value = heroConfig.mainHeading || '';
    if (subtitleInput) subtitleInput.value = heroConfig.subHeading || '';
    if (promoInput) promoInput.value = heroConfig.promoBadgeText || '';
    if (imageInput) imageInput.value = heroConfig.heroImageUrl || '';

    // Register Save listener
    const saveHeroBtn = document.getElementById('admin-hero-save-btn');
    if (saveHeroBtn) {
      saveHeroBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const updatedConfig = {
          headlineTag: taglineInput.value.trim(),
          mainHeading: headlineInput.value.trim(),
          subHeading: subtitleInput.value.trim(),
          promoBadgeText: promoInput.value.trim(),
          heroImageUrl: imageInput.value.trim(),
          primaryCtaText: heroConfig.primaryCtaText || "Shop Festive Edit",
          primaryCtaLink: heroConfig.primaryCtaLink || "#festive",
          secondaryCtaText: heroConfig.secondaryCtaText || "Explore Collection",
          secondaryCtaLink: heroConfig.secondaryCtaLink || "#catalog"
        };
        localStorage.setItem('fp_hero_config', JSON.stringify(updatedConfig));
        
        // Immediately re-render storefront hero
        initHero('hero-container');
        
        // Visual feedback
        const originalText = saveHeroBtn.innerText;
        saveHeroBtn.innerText = "Saved Successfully!";
        saveHeroBtn.classList.remove('bg-[#1A1A1A]', 'text-white');
        saveHeroBtn.classList.add('bg-emerald-600', 'text-white');
        setTimeout(() => {
          saveHeroBtn.innerText = originalText;
          saveHeroBtn.classList.remove('bg-emerald-600');
          saveHeroBtn.classList.add('bg-[#1A1A1A]');
        }, 1500);
      });
    }

    // Register Reset listener
    const resetHeroBtn = document.getElementById('admin-hero-reset-btn');
    if (resetHeroBtn) {
      resetHeroBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm("Are you sure you want to reset the hero banner to defaults?")) {
          const DEFAULT_HERO_CONFIG = {
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
          localStorage.setItem('fp_hero_config', JSON.stringify(DEFAULT_HERO_CONFIG));
          
          // Re-populate fields
          if (taglineInput) taglineInput.value = DEFAULT_HERO_CONFIG.headlineTag;
          if (headlineInput) headlineInput.value = DEFAULT_HERO_CONFIG.mainHeading;
          if (subtitleInput) subtitleInput.value = DEFAULT_HERO_CONFIG.subHeading;
          if (promoInput) promoInput.value = DEFAULT_HERO_CONFIG.promoBadgeText;
          if (imageInput) imageInput.value = DEFAULT_HERO_CONFIG.heroImageUrl;

          // Immediately re-render storefront hero
          initHero('hero-container');
        }
      });
    }
  }

  // TAB 2: MANAGE STORE PRODUCTS
  function renderProductsTab() {
    const tabContent = document.getElementById('admin-tab-content-container');
    if (!tabContent) return;

    const products = getProducts();

    tabContent.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
        
        <!-- Left: Form to Add New Product (col-span-5) -->
        <div class="lg:col-span-5 bg-white border border-[#E5E3DF] p-6 rounded-2xl space-y-6 shadow-sm">
          <div>
            <h3 class="text-sm uppercase tracking-wider text-[#1A1A1A] font-bold border-b border-[#E5E3DF] pb-3 flex items-center gap-2">
              <svg class="w-4.5 h-4.5 text-[#C5A880]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Add New Product
            </h3>
          </div>

          <form id="add-product-form" class="space-y-5" onsubmit="event.preventDefault();">
            <div>
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Product Title</label>
              <input type="text" id="prod-title" required placeholder="e.g. Royal Silk Lehenga" class="w-full min-h-[48px] bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-3 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Category</label>
                <select id="prod-category" class="w-full min-h-[48px] bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-3 text-xs rounded-xl focus:outline-none focus:border-[#C5A880] cursor-pointer">
                  <option value="Women">Women</option>
                  <option value="Men">Men</option>
                  <option value="Couple">Couple</option>
                  <option value="Kids">Kids</option>
                  <option value="Elders">Elders</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
              <div>
                <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Badge (Optional)</label>
                <input type="text" id="prod-badge" placeholder="e.g. Bestseller" class="w-full min-h-[48px] bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-3 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Selling Price (₹)</label>
                <input type="number" id="prod-price" required placeholder="2499" min="0" class="w-full min-h-[48px] bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-3 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
              </div>
              <div>
                <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Original Price / MRP (₹)</label>
                <input type="number" id="prod-mrp" required placeholder="4999" min="0" class="w-full min-h-[48px] bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-3 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
              </div>
            </div>

            <!-- Size selection chips -->
            <div class="space-y-3 border-t border-[#E5E3DF]/50 pt-3">
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold">Sizes (Select Active Tags)</label>
              
              <div>
                <p class="text-[8px] uppercase tracking-widest text-[#8A8A8A] font-semibold mb-1">Standard Sizes</p>
                <div class="flex flex-wrap gap-1.5" id="standard-sizes-chips"></div>
              </div>

              <div>
                <p class="text-[8px] uppercase tracking-widest text-[#8A8A8A] font-semibold mb-1">Couple / Pair Pre-sets</p>
                <div class="flex flex-wrap gap-1.5" id="couple-sizes-chips"></div>
              </div>

              <div class="flex items-center gap-2 pt-1">
                <button type="button" id="quick-add-size-btn" class="px-3.5 py-2.5 border border-[#C5A880] text-[#C5A880] hover:bg-[#C5A880] hover:text-[#1A1A1A] text-[9px] font-semibold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-1.5 focus:outline-none min-h-[40px]">
                  <span>+ Custom</span>
                </button>
                <div id="custom-size-input-wrapper" class="hidden flex items-center gap-2">
                  <input type="text" id="custom-size-input" placeholder="e.g. 4XL" class="bg-[#F9F8F6] border border-[#C5A880] px-3 py-1.5 text-xs rounded-xl focus:outline-none w-24 h-[40px]" />
                  <button type="button" id="confirm-custom-size-btn" class="px-3 py-2 bg-[#1A1A1A] text-white text-[10px] font-semibold uppercase tracking-widest rounded-xl hover:bg-[#C5A880] hover:text-[#1A1A1A] transition-all h-[40px]">Add</button>
                </div>
              </div>
            </div>

            <!-- Main Product Image -->
            <div class="space-y-2 border-t border-[#E5E3DF]/50 pt-3">
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold">Main Product Image</label>
              <div class="flex gap-2 pb-1.5">
                <button type="button" id="main-img-mode-upload" class="flex-1 px-3 py-2 text-[9px] font-semibold uppercase tracking-widest border transition-all rounded-xl focus:outline-none min-h-[40px] ${
                  mainImageMode === 'upload' ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-white text-[#5A5A5A] border-[#E5E3DF]'
                }">Upload File</button>
                <button type="button" id="main-img-mode-url" class="flex-1 px-3 py-2 text-[9px] font-semibold uppercase tracking-widest border transition-all rounded-xl focus:outline-none min-h-[40px] ${
                  mainImageMode === 'url' ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-white text-[#5A5A5A] border-[#E5E3DF]'
                }">Image URL Link</button>
              </div>

              <!-- Dropzone for Upload Mode -->
              <div id="main-image-upload-zone" class="${mainImageMode === 'upload' ? '' : 'hidden'}">
                <div class="border-2 border-dashed border-[#C5A880]/40 rounded-2xl p-6 text-center cursor-pointer bg-[#F9F8F6] hover:bg-[#C5A880]/5 hover:border-[#C5A880] transition-all relative min-h-[120px] flex flex-col justify-center items-center" id="main-image-dropzone">
                  <input type="file" id="main-image-file-input" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div class="space-y-1.5 pointer-events-none">
                    <svg class="w-7 h-7 text-[#C5A880] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p class="text-[9px] font-semibold uppercase tracking-wider text-[#1A1A1A]">Drag & Drop or Click to Upload</p>
                    <p class="text-[8px] text-[#8A8A8A]">Device camera/photo library supported</p>
                  </div>
                </div>
                <!-- Thumbnail Preview -->
                <div id="main-image-preview-container" class="mt-3 hidden"></div>
              </div>

              <!-- Input for URL Mode -->
              <div id="main-image-url-zone" class="${mainImageMode === 'url' ? '' : 'hidden'}">
                <input type="url" id="prod-image-main" placeholder="https://unsplash.com/..." class="w-full min-h-[48px] bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-3 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
              </div>
            </div>

            <!-- Gallery Images -->
            <div class="space-y-2 border-t border-[#E5E3DF]/50 pt-3">
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold">Gallery Images</label>
              <div class="flex gap-2 pb-1.5">
                <button type="button" id="gallery-img-mode-upload" class="flex-1 px-3 py-2 text-[9px] font-semibold uppercase tracking-widest border transition-all rounded-xl focus:outline-none min-h-[40px] ${
                  galleryImageMode === 'upload' ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-white text-[#5A5A5A] border-[#E5E3DF]'
                }">Upload Files</button>
                <button type="button" id="gallery-img-mode-url" class="flex-1 px-3 py-2 text-[9px] font-semibold uppercase tracking-widest border transition-all rounded-xl focus:outline-none min-h-[40px] ${
                  galleryImageMode === 'url' ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-white text-[#5A5A5A] border-[#E5E3DF]'
                }">Image URL Links</button>
              </div>

              <!-- Dropzone for Upload Mode -->
              <div id="gallery-image-upload-zone" class="${galleryImageMode === 'upload' ? '' : 'hidden'}">
                <div class="border-2 border-dashed border-[#C5A880]/40 rounded-2xl p-6 text-center cursor-pointer bg-[#F9F8F6] hover:bg-[#C5A880]/5 hover:border-[#C5A880] transition-all relative min-h-[120px] flex flex-col justify-center items-center" id="gallery-image-dropzone">
                  <input type="file" id="gallery-image-file-input" accept="image/*" multiple class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div class="space-y-1.5 pointer-events-none">
                    <svg class="w-7 h-7 text-[#C5A880] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-[9px] font-semibold uppercase tracking-wider text-[#1A1A1A]">Drag & Drop or Click to Upload Multiple</p>
                    <p class="text-[8px] text-[#8A8A8A]">Camera role / multiple files supported</p>
                  </div>
                </div>
                <!-- Thumbnails Container -->
                <div id="gallery-images-preview-container" class="grid grid-cols-4 gap-2 mt-3 hidden"></div>
              </div>

              <!-- Input for URL Mode -->
              <div id="gallery-image-url-zone" class="${galleryImageMode === 'url' ? '' : 'hidden'}">
                <input type="text" id="prod-image-gallery" placeholder="https://..., https://..." class="w-full min-h-[48px] bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-3 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
              </div>
            </div>

            <div class="border-t border-[#E5E3DF]/50 pt-3">
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Product Description</label>
              <textarea id="prod-desc" required placeholder="Detailed description of product fit and drape..." rows="3" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-3 text-xs rounded-xl focus:outline-none focus:border-[#C5A880] resize-none"></textarea>
            </div>

            <div>
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Fabric & Composition (Optional)</label>
              <input type="text" id="prod-fabric" placeholder="e.g. 100% Pure Georgette Silk. Dry clean only." class="w-full min-h-[48px] bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-3 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
            </div>

            <button type="submit" id="add-product-submit-btn" class="w-full min-h-[48px] bg-[#1A1A1A] hover:bg-[#C5A880] hover:text-[#1A1A1A] text-white text-xs uppercase tracking-widest font-semibold transition-all duration-300 rounded-xl focus:outline-none shadow-md flex items-center justify-center">
              Add to Storefront Catalog
            </button>
          </form>
        </div>

        <!-- Right: Active Products Inventory (col-span-7) -->
        <div class="lg:col-span-7 bg-white border border-[#E5E3DF] p-6 rounded-2xl shadow-sm overflow-hidden">
          <div>
            <h3 class="text-sm uppercase tracking-wider text-[#1A1A1A] font-bold border-b border-[#E5E3DF] pb-3">
              Product Inventory (${products.length} Items)
            </h3>
          </div>

          <!-- Desktop Inventory Table View -->
          <div class="hidden md:block overflow-x-auto mt-4">
            <table class="min-w-full divide-y divide-[#E5E3DF]">
              <thead>
                <tr class="text-[9px] uppercase tracking-widest font-semibold text-[#8A8A8A] text-left">
                  <th scope="col" class="pb-3 w-16">Item</th>
                  <th scope="col" class="pb-3 pl-4">Details</th>
                  <th scope="col" class="pb-3">Category</th>
                  <th scope="col" class="pb-3">Price</th>
                  <th scope="col" class="pb-3">Stock Status</th>
                  <th scope="col" class="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#E5E3DF] text-xs">
                ${products.map(product => {
                  const firstImg = product.images && product.images.length > 0 ? product.images[0] : "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=80&q=80";
                  return `
                    <tr class="align-middle group">
                      <!-- Image Thumbnail -->
                      <td class="py-4">
                        <div class="w-12 h-16 rounded-lg overflow-hidden border border-[#E5E3DF] bg-stone-50">
                          <img src="${firstImg}" class="w-full h-full object-cover" />
                        </div>
                      </td>
                      
                      <!-- Title & ID -->
                      <td class="py-4 pl-4 max-w-[150px]">
                        <p class="font-medium text-[#1A1A1A] truncate">${product.title}</p>
                        <p class="text-[9px] text-[#8A8A8A] font-mono mt-0.5">${product.id}</p>
                      </td>

                      <!-- Category -->
                      <td class="py-4 text-[#5A5A5A] uppercase tracking-wider text-[10px]">
                        ${product.category}
                      </td>

                      <!-- Price/MRP -->
                      <td class="py-4 font-semibold text-[#1A1A1A]">
                        ₹${product.price}
                        <p class="text-[9px] text-[#8A8A8A] line-through font-normal">₹${product.originalPrice}</p>
                      </td>

                      <!-- Stock Status Toggle Badge -->
                      <td class="py-4">
                        <button 
                          data-toggle-id="${product.id}"
                          class="stock-toggle-badge px-4 py-2 min-h-[48px] flex items-center justify-center rounded-full text-[9px] uppercase tracking-widest font-bold border transition-all ${
                            product.inStock 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          }"
                        >
                          ${product.inStock ? "In Stock" : "Out of Stock"}
                        </button>
                      </td>

                      <!-- Actions -->
                      <td class="py-4 text-right">
                        <button 
                          data-delete-id="${product.id}"
                          class="delete-product-btn min-h-[48px] text-rose-600 hover:text-rose-900 border border-rose-200 hover:border-rose-600 rounded-xl px-4 bg-rose-50/50 hover:bg-rose-50 text-[9px] uppercase tracking-widest font-bold transition-all focus:outline-none"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <!-- Mobile Inventory Card View -->
          <div class="block md:hidden mt-4 space-y-4">
            ${products.map(product => {
              const firstImg = product.images && product.images.length > 0 ? product.images[0] : "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=80&q=80";
              return `
                <div class="bg-[#F9F8F6] border border-[#E5E3DF] p-4 rounded-2xl flex items-start gap-4 shadow-xs">
                  <!-- Thumbnail -->
                  <div class="w-16 h-20 rounded-xl overflow-hidden border border-[#E5E3DF] bg-stone-50 flex-shrink-0">
                    <img src="${firstImg}" class="w-full h-full object-cover" />
                  </div>

                  <!-- Details & Actions -->
                  <div class="flex-grow space-y-2.5">
                    <div>
                      <p class="font-medium text-[#1A1A1A] text-xs line-clamp-1">${product.title}</p>
                      <div class="flex items-center justify-between mt-1 text-[10px] text-[#5A5A5A]">
                        <span class="uppercase tracking-widest font-semibold">${product.category}</span>
                        <span class="font-mono text-[8px]">${product.id}</span>
                      </div>
                      <div class="flex items-baseline gap-2 mt-1">
                        <span class="font-semibold text-xs text-[#1A1A1A]">₹${product.price}</span>
                        <span class="text-[9px] text-[#8A8A8A] line-through font-normal">₹${product.originalPrice}</span>
                      </div>
                    </div>

                    <!-- Touch Targets Stock Toggle & Delete Button -->
                    <div class="flex gap-2">
                      <button 
                        data-toggle-id="${product.id}"
                        class="stock-toggle-badge flex-1 min-h-[48px] rounded-xl text-[9px] uppercase tracking-widest font-bold border transition-all flex items-center justify-center ${
                          product.inStock 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }"
                      >
                        ${product.inStock ? "In Stock" : "Out of Stock"}
                      </button>
                      <button 
                        data-delete-id="${product.id}"
                        class="delete-product-btn px-4 min-h-[48px] text-rose-600 hover:text-rose-900 border border-rose-200 hover:border-rose-600 rounded-xl bg-rose-50/50 hover:bg-rose-50 text-[9px] uppercase tracking-widest font-bold transition-all focus:outline-none flex items-center justify-center"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>
    `;

    // 1. Render size selection pills
    function renderSizeChips() {
      const standardContainer = document.getElementById('standard-sizes-chips');
      const coupleContainer = document.getElementById('couple-sizes-chips');
      if (!standardContainer || !coupleContainer) return;

      // Standard chips
      standardContainer.innerHTML = defaultApparelSizes.map(size => {
        const isSelected = selectedSizes.has(size);
        return `
          <button type="button" data-size="${size}" class="size-chip px-3.5 py-2.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border transition-all duration-200 flex items-center gap-1 focus:outline-none min-h-[38px] ${
            isSelected
              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
              : 'bg-white text-[#1A1A1A] border-[#E5E3DF] hover:border-[#1A1A1A]'
          }">
            ${isSelected ? '✓ ' : ''}${size}
          </button>
        `;
      }).join('');

      // Couple and Custom chips
      const allCoupleAndCustom = [...defaultCoupleSizes, ...customSizes];
      coupleContainer.innerHTML = allCoupleAndCustom.map(size => {
        const isSelected = selectedSizes.has(size);
        return `
          <button type="button" data-size="${size}" class="size-chip px-3.5 py-2.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border transition-all duration-200 flex items-center gap-1 focus:outline-none min-h-[38px] ${
            isSelected
              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
              : 'bg-white text-[#1A1A1A] border-[#E5E3DF] hover:border-[#1A1A1A]'
          }">
            ${isSelected ? '✓ ' : ''}${size}
          </button>
        `;
      }).join('');

      // Hook up listeners
      const chips = tabContent.querySelectorAll('.size-chip');
      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          const sz = chip.getAttribute('data-size');
          if (selectedSizes.has(sz)) {
            selectedSizes.delete(sz);
          } else {
            selectedSizes.add(sz);
          }
          renderSizeChips();
        });
      });
    }

    renderSizeChips();

    // Hook up custom size quick-add
    const quickAddBtn = document.getElementById('quick-add-size-btn');
    const inputWrapper = document.getElementById('custom-size-input-wrapper');
    const customSizeInput = document.getElementById('custom-size-input');
    const confirmCustomBtn = document.getElementById('confirm-custom-size-btn');

    if (quickAddBtn && inputWrapper && customSizeInput && confirmCustomBtn) {
      quickAddBtn.addEventListener('click', () => {
        quickAddBtn.classList.add('hidden');
        inputWrapper.classList.remove('hidden');
        customSizeInput.focus();
      });

      confirmCustomBtn.addEventListener('click', () => {
        const val = customSizeInput.value.trim();
        if (val && !defaultApparelSizes.includes(val) && !defaultCoupleSizes.includes(val) && !customSizes.includes(val)) {
          customSizes.push(val);
          selectedSizes.add(val);
        }
        customSizeInput.value = '';
        inputWrapper.classList.add('hidden');
        quickAddBtn.classList.remove('hidden');
        renderSizeChips();
      });

      customSizeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          confirmCustomBtn.click();
        }
      });
    }

    // 2. Direct File Upload & Drag-and-Drop: Main Image Setup
    const mainImgModeUpload = document.getElementById('main-img-mode-upload');
    const mainImgModeUrl = document.getElementById('main-img-mode-url');
    const mainUploadZone = document.getElementById('main-image-upload-zone');
    const mainUrlZone = document.getElementById('main-image-url-zone');
    const mainDropzone = document.getElementById('main-image-dropzone');
    const mainFileInput = document.getElementById('main-image-file-input');
    const mainPreviewContainer = document.getElementById('main-image-preview-container');

    function renderMainPreview() {
      if (uploadedMainImage) {
        mainPreviewContainer.innerHTML = `
          <div class="relative w-24 h-32 rounded-xl overflow-hidden border border-[#C5A880] mt-3">
            <img src="${uploadedMainImage}" class="w-full h-full object-cover" />
            <button type="button" id="remove-main-img-btn" class="absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-black text-white text-[10px] rounded-full flex items-center justify-center font-bold focus:outline-none">✕</button>
          </div>
        `;
        mainPreviewContainer.classList.remove('hidden');
        
        const removeBtn = document.getElementById('remove-main-img-btn');
        if (removeBtn) {
          removeBtn.addEventListener('click', () => {
            uploadedMainImage = "";
            renderMainPreview();
          });
        }
      } else {
        mainPreviewContainer.innerHTML = "";
        mainPreviewContainer.classList.add('hidden');
      }
    }

    if (mainImgModeUpload && mainImgModeUrl) {
      mainImgModeUpload.addEventListener('click', () => {
        mainImageMode = "upload";
        mainImgModeUpload.className = "flex-1 px-3 py-2 text-[9px] font-semibold uppercase tracking-widest border transition-all rounded-xl focus:outline-none min-h-[40px] bg-[#1A1A1A] text-white border-[#1A1A1A]";
        mainImgModeUrl.className = "flex-1 px-3 py-2 text-[9px] font-semibold uppercase tracking-widest border transition-all rounded-xl focus:outline-none min-h-[40px] bg-white text-[#5A5A5A] border-[#E5E3DF]";
        mainUploadZone.classList.remove('hidden');
        mainUrlZone.classList.add('hidden');
      });
      mainImgModeUrl.addEventListener('click', () => {
        mainImageMode = "url";
        mainImgModeUrl.className = "flex-1 px-3 py-2 text-[9px] font-semibold uppercase tracking-widest border transition-all rounded-xl focus:outline-none min-h-[40px] bg-[#1A1A1A] text-white border-[#1A1A1A]";
        mainImgModeUpload.className = "flex-1 px-3 py-2 text-[9px] font-semibold uppercase tracking-widest border transition-all rounded-xl focus:outline-none min-h-[40px] bg-white text-[#5A5A5A] border-[#E5E3DF]";
        mainUrlZone.classList.remove('hidden');
        mainUploadZone.classList.add('hidden');
      });
    }

    async function handleMainImageUpload(file) {
      if (!file) return;
      mainDropzone.innerHTML = `
        <div class="space-y-2 pointer-events-none flex flex-col items-center justify-center py-2">
          <div class="w-6 h-6 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin"></div>
          <p class="text-[10px] font-bold text-[#C5A880] uppercase tracking-wider">Uploading to ImgBB Cloud...</p>
          <p class="text-[8px] text-[#8A8A8A]">Please wait</p>
        </div>
      `;
      try {
        const url = await uploadToImgBB(file);
        uploadedMainImage = url;
        renderMainPreview();
      } catch (err) {
        console.error("Main Image Upload Error:", err);
        alert("⚠️ ImgBB Upload Failed: " + (err.message || "Network Error") + "\nYou can also switch to 'Image URL Link' mode.");
      } finally {
        mainDropzone.innerHTML = `
          <div class="space-y-1.5 pointer-events-none">
            <svg class="w-7 h-7 text-[#C5A880] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-[9px] font-semibold uppercase tracking-wider text-[#1A1A1A]">Drag & Drop or Click to Upload</p>
            <p class="text-[8px] text-[#8A8A8A]">JPG, PNG, WebP supported</p>
          </div>
        `;
      }
    }

    if (mainDropzone && mainFileInput) {
      ['dragenter', 'dragover'].forEach(eventName => {
        mainDropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          mainDropzone.classList.add('bg-[#C5A880]/10', 'border-[#C5A880]');
        }, false);
      });
      ['dragleave', 'drop'].forEach(eventName => {
        mainDropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          mainDropzone.classList.remove('bg-[#C5A880]/10', 'border-[#C5A880]');
        }, false);
      });

      mainDropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files.length > 0) {
          handleMainImageUpload(files[0]);
        }
      });

      mainFileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          handleMainImageUpload(files[0]);
        }
      });
    }

    renderMainPreview();

    // 3. Direct File Upload & Drag-and-Drop: Gallery Setup
    const galleryImgModeUpload = document.getElementById('gallery-img-mode-upload');
    const galleryImgModeUrl = document.getElementById('gallery-img-mode-url');
    const galleryUploadZone = document.getElementById('gallery-image-upload-zone');
    const galleryUrlZone = document.getElementById('gallery-image-url-zone');
    const galleryDropzone = document.getElementById('gallery-image-dropzone');
    const galleryFileInput = document.getElementById('gallery-image-file-input');
    const galleryPreviewContainer = document.getElementById('gallery-images-preview-container');

    function renderGalleryPreviews() {
      if (uploadedGalleryImages.length > 0) {
        galleryPreviewContainer.innerHTML = uploadedGalleryImages.map((img, index) => `
          <div class="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-[#E5E3DF] mt-2">
            <img src="${img}" class="w-full h-full object-cover" />
            <button type="button" data-index="${index}" class="remove-gallery-img-btn absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-black text-white text-[10px] rounded-full flex items-center justify-center font-bold focus:outline-none">✕</button>
          </div>
        `).join('');
        galleryPreviewContainer.classList.remove('hidden');

        galleryPreviewContainer.querySelectorAll('.remove-gallery-img-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-index'));
            uploadedGalleryImages.splice(idx, 1);
            renderGalleryPreviews();
          });
        });
      } else {
        galleryPreviewContainer.innerHTML = "";
        galleryPreviewContainer.classList.add('hidden');
      }
    }

    async function handleGalleryImagesUpload(files) {
      if (!files || files.length === 0) return;
      galleryDropzone.innerHTML = `
        <div class="space-y-2 pointer-events-none flex flex-col items-center justify-center py-2">
          <div class="w-6 h-6 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin"></div>
          <p class="text-[10px] font-bold text-[#C5A880] uppercase tracking-wider">Uploading ${files.length} Image(s) to ImgBB...</p>
          <p class="text-[8px] text-[#8A8A8A]">Please wait</p>
        </div>
      `;
      try {
        for (let i = 0; i < files.length; i++) {
          const url = await uploadToImgBB(files[i]);
          uploadedGalleryImages.push(url);
          renderGalleryPreviews();
        }
      } catch (err) {
        console.error("Gallery Upload Error:", err);
        alert("⚠️ ImgBB Upload Failed: " + (err.message || "Network Error") + "\nYou can also switch to 'Image URL Link' mode.");
      } finally {
        galleryDropzone.innerHTML = `
          <div class="space-y-1.5 pointer-events-none">
            <svg class="w-7 h-7 text-[#C5A880] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-[9px] font-semibold uppercase tracking-wider text-[#1A1A1A]">Drag & Drop or Click to Upload Multiple</p>
            <p class="text-[8px] text-[#8A8A8A]">Camera roll / multiple files supported</p>
          </div>
        `;
      }
    }

    if (galleryImgModeUpload && galleryImgModeUrl) {
      galleryImgModeUpload.addEventListener('click', () => {
        galleryImageMode = "upload";
        galleryImgModeUpload.className = "flex-1 px-3 py-2 text-[9px] font-semibold uppercase tracking-widest border transition-all rounded-xl focus:outline-none min-h-[40px] bg-[#1A1A1A] text-white border-[#1A1A1A]";
        galleryImgModeUrl.className = "flex-1 px-3 py-2 text-[9px] font-semibold uppercase tracking-widest border transition-all rounded-xl focus:outline-none min-h-[40px] bg-white text-[#5A5A5A] border-[#E5E3DF]";
        galleryUploadZone.classList.remove('hidden');
        galleryUrlZone.classList.add('hidden');
      });
      galleryImgModeUrl.addEventListener('click', () => {
        galleryImageMode = "url";
        galleryImgModeUrl.className = "flex-1 px-3 py-2 text-[9px] font-semibold uppercase tracking-widest border transition-all rounded-xl focus:outline-none min-h-[40px] bg-[#1A1A1A] text-white border-[#1A1A1A]";
        galleryImgModeUpload.className = "flex-1 px-3 py-2 text-[9px] font-semibold uppercase tracking-widest border transition-all rounded-xl focus:outline-none min-h-[40px] bg-white text-[#5A5A5A] border-[#E5E3DF]";
        galleryUrlZone.classList.remove('hidden');
        galleryUploadZone.classList.add('hidden');
      });
    }

    if (galleryDropzone && galleryFileInput) {
      ['dragenter', 'dragover'].forEach(eventName => {
        galleryDropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          galleryDropzone.classList.add('bg-[#C5A880]/10', 'border-[#C5A880]');
        }, false);
      });
      ['dragleave', 'drop'].forEach(eventName => {
        galleryDropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          galleryDropzone.classList.remove('bg-[#C5A880]/10', 'border-[#C5A880]');
        }, false);
      });

      galleryDropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files.length > 0) {
          handleGalleryImagesUpload(files);
        }
      });

      galleryFileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          handleGalleryImagesUpload(files);
        }
      });
    }

    renderGalleryPreviews();

    // Hook Up Add Product Form Listener
    const form = document.getElementById('add-product-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Retrieve field values
        const title = document.getElementById('prod-title').value.trim();
        const category = document.getElementById('prod-category').value;
        const badge = document.getElementById('prod-badge').value.trim();
        const price = parseInt(document.getElementById('prod-price').value);
        const originalPrice = parseInt(document.getElementById('prod-mrp').value);
        const description = document.getElementById('prod-desc').value.trim();
        const fabricDetails = document.getElementById('prod-fabric').value.trim() || "Premium luxury fabric. Delicate handling.";

        const sizes = Array.from(selectedSizes);
        if (sizes.length === 0) {
          alert("⚠️ Please select at least one size tag!");
          return;
        }

        // Determine main image URL/Base64
        let mainImage = "";
        if (mainImageMode === "upload") {
          if (!uploadedMainImage) {
            alert("⚠️ Please upload a main product image!");
            return;
          }
          mainImage = uploadedMainImage;
        } else {
          mainImage = document.getElementById('prod-image-main').value.trim();
          if (!mainImage) {
            alert("⚠️ Please enter a main product image URL!");
            return;
          }
        }

        const images = [mainImage];
        if (galleryImageMode === "upload") {
          uploadedGalleryImages.forEach(img => images.push(img));
        } else {
          const galleryInput = document.getElementById('prod-image-gallery').value.trim();
          if (galleryInput) {
            galleryInput.split(',').map(img => img.trim()).filter(img => img !== "").forEach(img => {
              images.push(img);
            });
          }
        }

        const id = "prod-" + Date.now();
        const discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);

        const newProduct = {
          id,
          title,
          category,
          price,
          originalPrice,
          discountPercentage,
          badge: badge || null,
          description,
          fabricDetails,
          sizes,
          inStock: true,
          images
        };

        await saveProductToCloud(newProduct);
        
        alert(`⚡ Product "${title}" has been saved and synchronized with Cloud Firestore!`);

        // Reset state values
        selectedSizes.clear();
        selectedSizes.add("M");
        selectedSizes.add("L");
        selectedSizes.add("XL");
        customSizes.length = 0;
        uploadedMainImage = "";
        uploadedGalleryImages.length = 0;

        renderProductsTab();
      });
    }

    // Hook Up Stock Toggle Buttons (working on both mobile and desktop views)
    const stockBadges = tabContent.querySelectorAll('.stock-toggle-badge');
    stockBadges.forEach(badge => {
      badge.addEventListener('click', async () => {
        const id = badge.getAttribute('data-toggle-id');
        const prod = products.find(p => p.id === id);
        if (prod) {
          await updateProductStockInCloud(id, !prod.inStock);
          renderProductsTab();
        }
      });
    });

    // Hook Up Delete Product Buttons (working on both mobile and desktop views)
    const deleteBtns = tabContent.querySelectorAll('.delete-product-btn');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-delete-id');
        const prod = products.find(p => p.id === id);
        if (prod && confirm(`Are you sure you want to delete "${prod.title}"?`)) {
          await deleteProductFromCloud(id);
          renderProductsTab();
        }
      });
    });
  }

  // TAB 3: LIVE ORDERS & LEDGER VIEW
  function renderLedgerTab() {
    const tabContent = document.getElementById('admin-tab-content-container');
    if (!tabContent) return;

    const orders = getOrders();
    let supplierCostPct = parseInt(localStorage.getItem("fp_supplier_cost_pct") || "50");

    const totalOrdersCount = orders.length;
    const grossRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = totalOrdersCount > 0 ? Math.round(grossRevenue / totalOrdersCount) : 0;
    const estProfit = Math.round(grossRevenue * (1 - supplierCostPct / 100));

    if (orders.length === 0) {
      tabContent.innerHTML = `
        <div class="text-center py-24 bg-white rounded-3xl border border-[#E5E3DF] space-y-4 shadow-xs animate-fadeIn">
          <div class="mx-auto w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center border border-[#E5E3DF] text-[#C5A880]">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 class="font-serif text-sm uppercase tracking-widest text-[#1A1A1A]">No orders received yet</h3>
          <p class="text-xs text-[#5A5A5A] max-w-xs mx-auto font-light leading-relaxed">Transactions placed on the storefront will appear dynamically in this real-time dropshipping console.</p>
        </div>
      `;
      return;
    }

    tabContent.innerHTML = `
      <div class="space-y-8 animate-fadeIn">
        
        <!-- Top Row: Configurable Supplier Cost & Export Tools -->
        <div class="bg-white border border-[#E5E3DF] p-5 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-sm">
          <div class="flex flex-wrap items-center gap-3">
            <label for="supplier-cost-input" class="text-xs uppercase tracking-wider text-[#1A1A1A] font-bold">Estimated Supplier Cost</label>
            <div class="flex items-center bg-[#F9F8F6] border border-[#E5E3DF] rounded-xl overflow-hidden px-3.5 py-3 min-h-[48px]">
              <input 
                type="number" 
                id="supplier-cost-input" 
                min="0" 
                max="100" 
                value="${supplierCostPct}" 
                class="w-12 bg-transparent text-xs font-bold text-center focus:outline-none text-[#1A1A1A]" 
              />
              <span class="text-xs text-[#5A5A5A] font-bold ml-1">%</span>
            </div>
            <p class="text-[10px] text-[#8A8A8A] font-light leading-none">Net Profit = Revenue &times; (${100 - supplierCostPct}%)</p>
          </div>
          
          <button 
            id="csv-export-btn" 
            class="px-5 py-3 min-h-[48px] bg-[#1A1A1A] hover:bg-[#C5A880] hover:text-[#1A1A1A] text-white text-xs uppercase tracking-widest font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none shadow-xs"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export Orders (CSV)</span>
          </button>
        </div>

        <!-- Middle Row: Analytics Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white border border-[#E5E3DF] p-5 rounded-2xl shadow-sm">
            <p class="text-[9px] uppercase tracking-widest text-[#5A5A5A] font-semibold">Total Orders</p>
            <p class="text-2xl font-light text-[#1A1A1A] mt-1">${totalOrdersCount}</p>
          </div>
          <div class="bg-white border border-[#E5E3DF] p-5 rounded-2xl shadow-sm">
            <p class="text-[9px] uppercase tracking-widest text-[#5A5A5A] font-semibold">Gross Revenue</p>
            <p class="text-2xl font-light text-[#1A1A1A] mt-1">₹${grossRevenue.toLocaleString('en-IN')}</p>
          </div>
          <div class="bg-white border border-[#E5E3DF] p-5 rounded-2xl shadow-sm">
            <p class="text-[9px] uppercase tracking-widest text-[#5A5A5A] font-semibold">Average Order Value (AOV)</p>
            <p class="text-2xl font-light text-[#1A1A1A] mt-1">₹${avgOrderValue.toLocaleString('en-IN')}</p>
          </div>
          <div class="bg-white border border-[#E5E3DF] p-5 rounded-2xl shadow-sm bg-emerald-50/20 border-emerald-100">
            <p class="text-[9px] uppercase tracking-widest text-emerald-800 font-bold">Estimated Net Profit</p>
            <p class="text-2xl font-bold text-emerald-600 mt-1">₹${estProfit.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <!-- Bottom Row: Orders Ledger (Desktop View) -->
        <div class="hidden md:block bg-white border border-[#E5E3DF] p-6 rounded-2xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-[#E5E3DF]">
              <thead>
                <tr class="text-[9px] uppercase tracking-widest font-semibold text-[#8A8A8A] text-left">
                  <th scope="col" class="pb-3 pr-2">Order ID</th>
                  <th scope="col" class="pb-3 pr-2">Date</th>
                  <th scope="col" class="pb-3 pr-2">Customer Details</th>
                  <th scope="col" class="pb-3 pr-2">Ordered Items</th>
                  <th scope="col" class="pb-3 pr-2">Payment</th>
                  <th scope="col" class="pb-3 pr-2">Total</th>
                  <th scope="col" class="pb-3 pr-2">Status</th>
                  <th scope="col" class="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#E5E3DF] text-xs">
                ${orders.map(order => {
                  return `
                    <tr class="align-top group">
                      <td class="py-4 font-mono font-bold text-[#C5A880] whitespace-nowrap">
                        ${order.id}
                      </td>
                      <td class="py-4 text-[#5A5A5A] whitespace-nowrap pr-2">
                        ${order.date}
                      </td>
                      <td class="py-4 max-w-[180px] pr-4">
                        <p class="font-semibold text-[#1A1A1A]">${order.customerName}</p>
                        <p class="text-[10px] text-[#5A5A5A] mt-0.5">+91 ${order.phone}</p>
                        <p class="text-[9px] text-[#8A8A8A] mt-1 font-light leading-relaxed truncate" title="${order.address}, ${order.city}, ${order.state} - ${order.pincode}">
                          ${order.city} (${order.pincode})
                        </p>
                      </td>
                      <td class="py-4 max-w-[200px] pr-4">
                        <div class="space-y-1.5">
                          ${order.items.map(item => `
                            <div class="leading-tight">
                              <p class="font-medium text-[#1A1A1A] truncate">${item.title}</p>
                              <p class="text-[9px] text-[#8A8A8A] mt-0.5 uppercase tracking-widest font-semibold">Size: ${item.size} &bull; Qty: ${item.quantity}</p>
                            </div>
                          `).join('')}
                        </div>
                      </td>
                      <td class="py-4 text-[10px] uppercase tracking-wider font-medium text-[#1A1A1A] whitespace-nowrap pr-2">
                        ${order.paymentMethod.replace("Transfer", "").replace("Prepaid", "Prepaid")}
                      </td>
                      <td class="py-4 font-bold text-[#1A1A1A] whitespace-nowrap">
                        ₹${order.total.toLocaleString('en-IN')}
                      </td>
                      <td class="py-4">
                        <select 
                          data-order-status-id="${order.id}" 
                          class="order-status-selector min-h-[48px] text-[9px] uppercase tracking-widest font-bold px-2.5 py-2 rounded-md border focus:outline-none cursor-pointer ${
                            order.status === "Delivered" 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                              : order.status === "Cancelled"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : order.status === "Dispatched"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }"
                        >
                          <option value="Pending Dispatch" ${order.status === "Pending Dispatch" ? "selected" : ""}>Pending Dispatch</option>
                          <option value="Pending Confirmation" ${order.status === "Pending Confirmation" ? "selected" : ""}>Pending Confirmation</option>
                          <option value="Dispatched" ${order.status === "Dispatched" ? "selected" : ""}>Dispatched</option>
                          <option value="Delivered" ${order.status === "Delivered" ? "selected" : ""}>Delivered</option>
                          <option value="Cancelled" ${order.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
                        </select>
                      </td>
                      <td class="py-4 text-right whitespace-nowrap space-x-1">
                        <button 
                          data-chat-id="${order.id}"
                          class="chat-customer-btn min-h-[48px] border border-[#E5E3DF] text-[#1A1A1A] hover:bg-stone-50 rounded-lg px-2.5 py-2 text-[9px] uppercase tracking-widest font-bold transition-all focus:outline-none"
                        >
                          Chat
                        </button>
                        <button 
                          data-print-id="${order.id}"
                          class="print-slip-btn min-h-[48px] border border-[#E5E3DF] text-[#1A1A1A] hover:bg-stone-50 rounded-lg px-2.5 py-2 text-[9px] uppercase tracking-widest font-bold transition-all focus:outline-none"
                        >
                          Slip
                        </button>
                        <button 
                          data-delete-order-id="${order.id}"
                          class="delete-order-btn min-h-[48px] text-rose-600 hover:text-rose-900 border border-rose-200 hover:border-rose-600 rounded-lg px-2.5 py-2 bg-rose-50/50 hover:bg-rose-50 text-[9px] uppercase tracking-widest font-bold transition-all focus:outline-none"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Bottom Row: Orders Ledger (Mobile Card View) -->
        <div class="block md:hidden space-y-4">
          ${orders.map(order => {
            const isExpanded = expandedOrders.has(order.id);
            return `
              <div class="bg-white border border-[#E5E3DF] rounded-2xl shadow-sm p-4 space-y-3" data-order-card-id="${order.id}">
                <!-- Card Header (Always Visible) -->
                <div class="flex items-start justify-between">
                  <div>
                    <p class="font-mono font-bold text-[#C5A880] text-xs">${order.id}</p>
                    <p class="text-[10px] text-[#8A8A8A] mt-0.5">${order.date}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-[#1A1A1A] text-sm">₹${order.total.toLocaleString('en-IN')}</p>
                    <p class="text-[9px] uppercase tracking-wider text-[#8A8A8A] font-semibold">${order.paymentMethod.replace("Transfer", "").replace("Prepaid", "Prepaid")}</p>
                  </div>
                </div>

                <!-- Toggle Collapse Header -->
                <div class="flex justify-between items-center border-t border-[#E5E3DF]/50 pt-2.5">
                  <p class="font-semibold text-xs text-[#1A1A1A]">${order.customerName}</p>
                  <button 
                    data-toggle-expand-id="${order.id}" 
                    class="text-[10px] uppercase tracking-widest font-bold text-[#C5A880] focus:outline-none flex items-center gap-1 min-h-[48px]"
                  >
                    <span>${isExpanded ? "Hide Details" : "Show Details"}</span>
                    <svg class="w-3.5 h-3.5 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                <!-- Card Body (Collapsible Details) -->
                <div class="${isExpanded ? 'block' : 'hidden'} border-t border-[#E5E3DF]/50 pt-3 space-y-3">
                  <!-- Customer Details -->
                  <div class="text-xs text-[#5A5A5A] space-y-1">
                    <p class="font-semibold text-[#1A1A1A]">Shipping Address:</p>
                    <p class="font-light leading-relaxed">${order.address}, ${order.city}, ${order.state} - ${order.pincode}</p>
                    <p class="font-light mt-1">Phone: +91 ${order.phone}</p>
                  </div>

                  <!-- Ordered Items -->
                  <div class="bg-[#F9F8F6] p-3 rounded-xl border border-[#E5E3DF] space-y-2">
                    <p class="text-[9px] uppercase tracking-widest text-[#8A8A8A] font-bold">Ordered Items</p>
                    <div class="divide-y divide-[#E5E3DF]/60 text-xs">
                      ${order.items.map(item => `
                        <div class="py-1.5 first:pt-0 last:pb-0 leading-tight">
                          <p class="font-medium text-[#1A1A1A]">${item.title}</p>
                          <p class="text-[9px] text-[#8A8A8A] mt-0.5 uppercase tracking-widest font-semibold">Size: ${item.size} &bull; Qty: ${item.quantity}</p>
                        </div>
                      `).join('')}
                    </div>
                  </div>

                  <!-- Direct WhatsApp Contact Call-To-Action (Primary Mobile Action) -->
                  <button 
                    data-chat-id="${order.id}"
                    class="chat-customer-btn w-full min-h-[48px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 focus:outline-none transition-all shadow-xs"
                  >
                    <svg class="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.792 1.451 5.405 0 9.803-4.364 9.806-9.728.001-2.597-1.006-5.04-2.836-6.87C16.59 2.188 14.15 1.18 11.56 1.18 6.155 1.18 1.758 5.544 1.755 10.91c-.001 1.744.463 3.447 1.344 4.953l-.973 3.553 3.633-.953z" />
                    </svg>
                    <span>Chat on WhatsApp</span>
                  </button>

                  <!-- 1-Tap Status Selector & Actions -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label class="block text-[8px] uppercase tracking-wider text-[#8A8A8A] font-bold mb-1">Update Status</label>
                      <select 
                        data-order-status-id="${order.id}" 
                        class="order-status-selector w-full min-h-[48px] text-[10px] uppercase tracking-widest font-bold px-3 py-2 rounded-xl border focus:outline-none cursor-pointer ${
                          order.status === "Delivered" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                            : order.status === "Cancelled"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : order.status === "Dispatched"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }"
                      >
                        <option value="Pending Dispatch" ${order.status === "Pending Dispatch" ? "selected" : ""}>Pending Dispatch</option>
                        <option value="Pending Confirmation" ${order.status === "Pending Confirmation" ? "selected" : ""}>Pending Confirmation</option>
                        <option value="Dispatched" ${order.status === "Dispatched" ? "selected" : ""}>Dispatched</option>
                        <option value="Delivered" ${order.status === "Delivered" ? "selected" : ""}>Delivered</option>
                        <option value="Cancelled" ${order.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
                      </select>
                    </div>

                    <div class="flex items-end gap-2">
                      <button 
                        data-print-id="${order.id}"
                        class="print-slip-btn flex-1 min-h-[48px] border border-[#E5E3DF] text-[#1A1A1A] hover:bg-stone-50 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all focus:outline-none flex items-center justify-center"
                      >
                        Print Slip
                      </button>
                      <button 
                        data-delete-order-id="${order.id}"
                        class="delete-order-btn min-h-[48px] text-rose-600 hover:text-rose-900 border border-rose-200 hover:border-rose-600 rounded-xl px-4 bg-rose-50/50 hover:bg-rose-50 text-[10px] uppercase tracking-widest font-bold transition-all focus:outline-none flex items-center justify-center"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

      </div>
    `;

    // Hook Up Supplier Cost Change Listener
    const costInput = document.getElementById("supplier-cost-input");
    if (costInput) {
      costInput.addEventListener("input", (e) => {
        let val = parseInt(e.target.value);
        if (isNaN(val) || val < 0) val = 0;
        if (val > 100) val = 100;
        localStorage.setItem("fp_supplier_cost_pct", val.toString());
        
        const updatedProfit = Math.round(grossRevenue * (1 - val / 100));
        const profitCardText = tabContent.querySelector(".bg-emerald-50\\/20 p.text-2xl");
        if (profitCardText) {
          profitCardText.innerText = `₹${updatedProfit.toLocaleString('en-IN')}`;
        }
      });
    }

    // Hook Up CSV Exporter
    const csvBtn = document.getElementById("csv-export-btn");
    if (csvBtn) {
      csvBtn.addEventListener("click", () => exportOrdersToCSV(orders));
    }

    // Hook Up Status Selectors (working on both mobile and desktop views)
    const statusSelectors = tabContent.querySelectorAll(".order-status-selector");
    statusSelectors.forEach(selector => {
      selector.addEventListener("change", async (e) => {
        const id = selector.getAttribute("data-order-status-id");
        const newStatus = e.target.value;
        await updateOrderStatusInCloud(id, newStatus);
        renderAdminConsole();
      });
    });

    // Hook Up Customer Chat Buttons (working on both mobile and desktop views)
    const chatBtns = tabContent.querySelectorAll(".chat-customer-btn");
    chatBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-chat-id");
        const order = orders.find(o => o.id === id);
        if (order) chatCustomerWhatsApp(order);
      });
    });

    // Hook Up Print Packing Slip Buttons (working on both mobile and desktop views)
    const printBtns = tabContent.querySelectorAll(".print-slip-btn");
    printBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-print-id");
        const order = orders.find(o => o.id === id);
        if (order) generatePackingSlip(order);
      });
    });

    // Hook Up Delete Order Buttons (working on both mobile and desktop views)
    const deleteBtns = tabContent.querySelectorAll(".delete-order-btn");
    deleteBtns.forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-delete-order-id");
        const order = orders.find(o => o.id === id);
        if (order && confirm(`Permanently delete order ${order.id}?`)) {
          await deleteOrderFromCloud(id);
          renderAdminConsole();
        }
      });
    });

    // Hook Up Mobile Expand Collapsible Listener
    const expandBtns = tabContent.querySelectorAll("[data-toggle-expand-id]");
    expandBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const orderId = btn.getAttribute("data-toggle-expand-id");
        if (expandedOrders.has(orderId)) {
          expandedOrders.delete(orderId);
        } else {
          expandedOrders.add(orderId);
        }
        renderLedgerTab();
      });
    });
  }

  // TAB 4: STORE SETTINGS & CUSTOM THEME
  function renderSettingsTab() {
    const tabContent = document.getElementById('admin-tab-content-container');
    if (!tabContent) return;

    // Load active saved configurations
    const settings = getStoreSettings();

    tabContent.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
        <!-- Settings Form (col-span-7) -->
        <div class="lg:col-span-7 bg-white border border-[#E5E3DF] p-6 sm:p-8 rounded-2xl space-y-6 shadow-sm">
          <div>
            <h3 class="text-sm uppercase tracking-wider text-[#1A1A1A] font-bold border-b border-[#E5E3DF] pb-3 flex items-center gap-2">
              <svg class="w-4.5 h-4.5 text-[#C5A880]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Global Store Settings
            </h3>
          </div>

          <form id="store-settings-form" class="space-y-5" onsubmit="event.preventDefault();">
            <div>
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Store Name</label>
              <input type="text" id="settings-store-name" required value="${settings.storeName}" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">WhatsApp Business Number (with Country Code)</label>
                <input type="text" id="settings-whatsapp" required value="${settings.whatsappPhone}" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
              </div>
              <div>
                <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Concierge Support Email</label>
                <input type="email" id="settings-email" required value="${settings.supportEmail}" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
              </div>
            </div>

            <div>
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Prepaid UPI ID / VPA</label>
              <input type="text" id="settings-upi" required value="${settings.upiId}" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
            </div>

            <!-- Theme Preset Selection Cards -->
            <div class="space-y-2.5">
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold">Luxury Theme Preset</label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                <!-- Royale Noir -->
                <label class="cursor-pointer border rounded-2xl p-4 flex flex-col space-y-1.5 transition-all relative ${
                  settings.theme === "Royale Noir" 
                    ? 'border-[#1A1A1A] bg-[#1A1A1A]/5 shadow-xs' 
                    : 'border-[#E5E3DF] bg-white hover:border-[#1A1A1A]'
                }" id="theme-card-noir">
                  <input type="radio" name="settings-theme-select" value="Royale Noir" ${
                    settings.theme === "Royale Noir" ? "checked" : ""
                  } class="absolute top-3 right-3 accent-[#C5A880] cursor-pointer" />
                  <span class="text-xs font-serif font-bold text-[#1a1a1a]">Royale Noir</span>
                  <div class="flex gap-1 mt-1">
                    <span class="w-3.5 h-3.5 rounded-full bg-[#1A1A1A] border border-[#E5E3DF]"></span>
                    <span class="w-3.5 h-3.5 rounded-full bg-[#C5A880] border border-[#E5E3DF]"></span>
                    <span class="w-3.5 h-3.5 rounded-full bg-[#F9F8F6] border border-[#E5E3DF]"></span>
                  </div>
                </label>

                <!-- Festive Crimson -->
                <label class="cursor-pointer border rounded-2xl p-4 flex flex-col space-y-1.5 transition-all relative ${
                  settings.theme === "Festive Crimson" 
                    ? 'border-[#5C061E] bg-[#5C061E]/5 shadow-xs' 
                    : 'border-[#E5E3DF] bg-white hover:border-[#5C061E]'
                }" id="theme-card-crimson">
                  <input type="radio" name="settings-theme-select" value="Festive Crimson" ${
                    settings.theme === "Festive Crimson" ? "checked" : ""
                  } class="absolute top-3 right-3 accent-[#E2B13C] cursor-pointer" />
                  <span class="text-xs font-serif font-bold text-[#5c061e]">Festive Crimson</span>
                  <div class="flex gap-1 mt-1">
                    <span class="w-3.5 h-3.5 rounded-full bg-[#5C061E] border border-[#E5E3DF]"></span>
                    <span class="w-3.5 h-3.5 rounded-full bg-[#E2B13C] border border-[#E5E3DF]"></span>
                    <span class="w-3.5 h-3.5 rounded-full bg-[#FFF5F6] border border-[#E5E3DF]"></span>
                  </div>
                </label>

                <!-- Emerald Atelier -->
                <label class="cursor-pointer border rounded-2xl p-4 flex flex-col space-y-1.5 transition-all relative ${
                  settings.theme === "Emerald Atelier" 
                    ? 'border-[#0F3A2E] bg-[#0F3A2E]/5 shadow-xs' 
                    : 'border-[#E5E3DF] bg-white hover:border-[#0F3A2E]'
                }" id="theme-card-emerald">
                  <input type="radio" name="settings-theme-select" value="Emerald Atelier" ${
                    settings.theme === "Emerald Atelier" ? "checked" : ""
                  } class="absolute top-3 right-3 accent-[#D4AF37] cursor-pointer" />
                  <span class="text-xs font-serif font-bold text-[#0F3A2E]">Emerald Atelier</span>
                  <div class="flex gap-1 mt-1">
                    <span class="w-3.5 h-3.5 rounded-full bg-[#0F3A2E] border border-[#E5E3DF]"></span>
                    <span class="w-3.5 h-3.5 rounded-full bg-[#D4AF37] border border-[#E5E3DF]"></span>
                    <span class="w-3.5 h-3.5 rounded-full bg-[#F4F8F6] border border-[#E5E3DF]"></span>
                  </div>
                </label>

              </div>
            </div>

            <button type="submit" id="save-settings-submit-btn" class="w-full py-3.5 bg-[#1A1A1A] hover:bg-[#C5A880] hover:text-[#1A1A1A] text-white text-xs uppercase tracking-widest font-semibold transition-all duration-300 rounded-xl focus:outline-none shadow-md">
              Save Store Settings
            </button>
          </form>
        </div>

        <!-- Right: Settings Explanation Block (col-span-5) -->
        <div class="lg:col-span-5 space-y-6">
          <div class="bg-white border border-[#E5E3DF] p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 class="text-sm uppercase tracking-wider text-[#1A1A1A] font-bold">Theme & Settings Synchronization</h3>
            <p class="text-xs text-[#5A5A5A] leading-relaxed font-light">
              Saving configurations here dynamically updates store details across header monograms, copyright scripts, and support footers instantly without refreshing the page.
            </p>
            <div class="bg-stone-50 border border-[#E5E3DF] p-4 rounded-xl space-y-2 text-xs">
              <p class="font-bold text-[#1A1A1A] uppercase tracking-wider text-[9px]">What updates automatically?</p>
              <ul class="list-disc list-inside text-[11px] text-[#5A5A5A] space-y-1 font-light pl-1">
                <li>Header monogram text based on initials of Store Name.</li>
                <li>WhatsApp redirect links to your verified phone number.</li>
                <li>Prepaid UPI detail sections and generated receipt templates.</li>
                <li>Global typography accent color tokens (primary button fills, chevrons, highlight borders).</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;

    // Hook Up Theme Card Card Selectors (Visual border highlights)
    const form = document.getElementById("store-settings-form");
    const noirCard = document.getElementById("theme-card-noir");
    const crimsonCard = document.getElementById("theme-card-crimson");
    const emeraldCard = document.getElementById("theme-card-emerald");

    if (noirCard && crimsonCard && emeraldCard) {
      noirCard.addEventListener("click", () => {
        noirCard.className = "cursor-pointer border border-[#1A1A1A] bg-[#1A1A1A]/5 rounded-2xl p-4 flex flex-col space-y-1.5 transition-all relative shadow-xs";
        crimsonCard.className = "cursor-pointer border border-[#E5E3DF] bg-white rounded-2xl p-4 flex flex-col space-y-1.5 transition-all relative hover:border-[#1A1A1A]";
        emeraldCard.className = "cursor-pointer border border-[#E5E3DF] bg-white rounded-2xl p-4 flex flex-col space-y-1.5 transition-all relative hover:border-[#1A1A1A]";
      });

      crimsonCard.addEventListener("click", () => {
        crimsonCard.className = "cursor-pointer border border-[#5C061E] bg-[#5C061E]/5 rounded-2xl p-4 flex flex-col space-y-1.5 transition-all relative shadow-xs";
        noirCard.className = "cursor-pointer border border-[#E5E3DF] bg-white rounded-2xl p-4 flex flex-col space-y-1.5 transition-all relative hover:border-[#1A1A1A]";
        emeraldCard.className = "cursor-pointer border border-[#E5E3DF] bg-white rounded-2xl p-4 flex flex-col space-y-1.5 transition-all relative hover:border-[#1A1A1A]";
      });

      emeraldCard.addEventListener("click", () => {
        emeraldCard.className = "cursor-pointer border border-[#0F3A2E] bg-[#0F3A2E]/5 rounded-2xl p-4 flex flex-col space-y-1.5 transition-all relative shadow-xs";
        noirCard.className = "cursor-pointer border border-[#E5E3DF] bg-white rounded-2xl p-4 flex flex-col space-y-1.5 transition-all relative hover:border-[#1A1A1A]";
        crimsonCard.className = "cursor-pointer border border-[#E5E3DF] bg-white rounded-2xl p-4 flex flex-col space-y-1.5 transition-all relative hover:border-[#1A1A1A]";
      });
    }

    // Hook Up Settings Form Submit
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const storeName = document.getElementById("settings-store-name").value.trim();
        const whatsappPhone = document.getElementById("settings-whatsapp").value.trim().replace(/[^0-9]/g, "");
        const supportEmail = document.getElementById("settings-email").value.trim();
        const upiId = document.getElementById("settings-upi").value.trim();
        const theme = form.elements["settings-theme-select"].value;

        const updatedSettings = {
          storeName,
          whatsappPhone,
          supportEmail,
          upiId,
          theme
        };

        // Save settings to localStorage
        saveStoreSettings(updatedSettings);

        // Visual success feedback
        const submitBtn = document.getElementById("save-settings-submit-btn");
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Settings Saved successfully!";
        submitBtn.className = "w-full py-3.5 bg-emerald-600 text-white text-xs uppercase tracking-widest font-semibold rounded-xl transition-all focus:outline-none";

        setTimeout(() => {
          submitBtn.innerText = originalText;
          submitBtn.className = "w-full py-3.5 bg-[#1A1A1A] hover:bg-[#C5A880] hover:text-[#1A1A1A] text-white text-xs uppercase tracking-widest font-semibold transition-all duration-300 rounded-xl focus:outline-none shadow-md";
          
          // Re-render admin console tab to load modified states
          renderAdminConsole();
        }, 1500);
      });
    }
  }

  // --- CSV Exporter Method ---
  function exportOrdersToCSV(orders) {
    let csv = "Order ID,Customer Name,Phone,Address,City,State,Pincode,Item Title,Size,Quantity,Total Payable,Payment Method,Status,Date\n";
    
    orders.forEach(order => {
      const cleanName = order.customerName.replace(/"/g, '""');
      const cleanAddress = order.address.replace(/"/g, '""');
      const cleanCity = order.city.replace(/"/g, '""');
      const cleanState = order.state.replace(/"/g, '""');
      
      order.items.forEach(item => {
        const cleanTitle = item.title.replace(/"/g, '""');
        csv += `"${order.id}","${cleanName}","+91${order.phone}","${cleanAddress}","${cleanCity}","${cleanState}","${order.pincode}","${cleanTitle}","${item.size}",${item.quantity},${order.total},"${order.paymentMethod}","${order.status}","${order.date}"\n`;
      });
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `fashionpalette_supplier_orders_${Date.now()}.csv`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // --- WhatsApp Customer Chat Method ---
  function chatCustomerWhatsApp(order) {
    const textMessage = `Hello ${order.customerName}! This is FashionPalette Atelier. We are writing to update you on your order *${order.id}*. The current status is: *${order.status}*. Thank you for choosing FashionPalette!`;
    const encoded = encodeURIComponent(textMessage);
    const waUrl = `https://wa.me/91${order.phone}?text=${encoded}`;
    window.open(waUrl, "_blank");
  }

  // --- Packing Slip Generator & Browser Print ---
  function generatePackingSlip(order) {
    const printWindow = window.open('', '_blank', 'width=800,height=800');
    if (!printWindow) {
      alert("Popup blocked! Please allow popups to view and print packing slips.");
      return;
    }

    const itemsRows = order.items.map(item => `
      <tr style="border-bottom: 1px solid #E5E3DF; font-size: 11px;">
        <td style="padding: 12px 0; text-align: left; font-weight: 500; color: #1A1A1A;">
          ${item.title}
          <div style="font-size: 9px; color: #8A8A8A; text-transform: uppercase; margin-top: 2px;">Size: ${item.size}</div>
        </td>
        <td style="padding: 12px 0; text-align: center; color: #1A1A1A;">${item.quantity}</td>
        <td style="padding: 12px 0; text-align: right; font-weight: bold; color: #1A1A1A;">₹${item.price.toLocaleString('en-IN')}</td>
        <td style="padding: 12px 0; text-align: right; font-weight: bold; color: #1A1A1A;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
      </tr>
    `).join("");

    const receiptHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Packing Slip - ${order.id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
          
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: #FFFFFF;
            color: #1A1A1A;
            margin: 0;
            padding: 40px;
            -webkit-print-color-adjust: exact;
          }
          
          .container {
            max-width: 700px;
            margin: 0 auto;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 1.5px solid #C5A880;
            padding-bottom: 24px;
            margin-bottom: 30px;
          }

          .brand-logo-container {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .brand-initials {
            width: 42px;
            height: 42px;
            border: 1px solid #1A1A1A;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Cormorant Garamond', serif;
            font-size: 18px;
            font-weight: 500;
          }

          .brand-name {
            font-family: 'Cormorant Garamond', serif;
            font-size: 22px;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            font-weight: 400;
            line-height: 1;
          }

          .brand-tag {
            font-size: 8px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #5A5A5A;
            margin-top: 4px;
          }

          .invoice-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 24px;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            color: #1A1A1A;
            text-align: right;
            margin: 0;
          }

          .invoice-meta {
            font-size: 10px;
            text-transform: uppercase;
            color: #5A5A5A;
            text-align: right;
            margin-top: 6px;
            line-height: 1.4;
          }

          .address-section {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
            font-size: 11px;
            line-height: 1.5;
          }

          .address-title {
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #8A8A8A;
            border-bottom: 1px solid #E5E3DF;
            padding-bottom: 6px;
            margin-bottom: 10px;
          }

          .customer-name {
            font-size: 12px;
            font-weight: bold;
            color: #1A1A1A;
            margin-bottom: 4px;
          }

          .table-container {
            margin-bottom: 40px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #8A8A8A;
            padding-bottom: 10px;
            border-bottom: 1.5px solid #1A1A1A;
          }

          .pricing-summary {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
          }

          .pricing-table {
            width: 240px;
            font-size: 11px;
            line-height: 2;
          }

          .pricing-row {
            display: flex;
            justify-content: space-between;
          }

          .total-row {
            font-size: 14px;
            font-weight: bold;
            border-top: 1px solid #C5A880;
            padding-top: 8px;
            margin-top: 8px;
            color: #1A1A1A;
          }

          .footer {
            border-top: 1px solid #E5E3DF;
            margin-top: 60px;
            padding-top: 20px;
            text-align: center;
            font-size: 9px;
            color: #8A8A8A;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            line-height: 1.6;
          }

          .print-btn-container {
            margin-top: 30px;
            display: flex;
            justify-content: center;
          }

          .print-btn {
            background: #1A1A1A;
            color: #FFFFFF;
            border: none;
            padding: 10px 24px;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            font-weight: 600;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s;
          }
          
          .print-btn:hover {
            background: #C5A880;
          }

          @media print {
            .print-btn-container {
              display: none;
            }
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          
          <div class="header">
            <div class="brand-logo-container">
              <div class="brand-initials">FP</div>
              <div>
                <div class="brand-name">${storeConfig.storeName}</div>
                <div class="brand-tag">Haute Couture Atelier</div>
              </div>
            </div>
            <div>
              <h1 class="invoice-title">Packing Slip</h1>
              <div class="invoice-meta">
                <div>Order ID: <b>${order.id}</b></div>
                <div>Date: ${order.date}</div>
              </div>
            </div>
          </div>

          <div class="address-section">
            <div>
              <div class="address-title">From (Sender)</div>
              <div class="customer-name">${storeConfig.storeName} Atelier</div>
              <div>Taj Boulevard, Enclave Enclosure</div>
              <div>New Delhi, India</div>
              <div>Phone: ${storeConfig.contact.phone}</div>
            </div>
            <div>
              <div class="address-title">Ship To (Recipient)</div>
              <div class="customer-name">${order.customerName}</div>
              <div>${order.address}</div>
              <div>${order.city}, ${order.state} - <b>${order.pincode}</b></div>
              <div>Phone: +91 ${order.phone}</div>
            </div>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th style="text-align: left; width: 50%;">SKU / Description</th>
                  <th style="text-align: center; width: 10%;">Qty</th>
                  <th style="text-align: right; width: 20%;">Price</th>
                  <th style="text-align: right; width: 20%;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>
          </div>

          <div class="pricing-summary">
            <div class="pricing-table">
              <div class="pricing-row">
                <span>Shipping Delivery</span>
                <span style="font-weight: 600; color: green; text-transform: uppercase; font-size: 9px;">Free Express</span>
              </div>
              <div class="pricing-row">
                <span>Payment Method</span>
                <span style="font-weight: 500; text-transform: uppercase; font-size: 9px;">${order.paymentMethod.replace("Transfer", "").replace("Prepaid", "Prepaid")}</span>
              </div>
              <div class="pricing-row total-row">
                <span>Payable Amount</span>
                <span>₹${order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div class="footer">
            Thank you for shopping at ${storeConfig.storeName} &bull; Private Atelier Concierge Services
            <div style="font-size: 7px; color: #C5A880; margin-top: 6px;">DISPATCHED FROM Taj Mansingh Boulevard Enclave. FOR INQUIRIES EMAIL: ${storeConfig.contact.email}</div>
          </div>

          <div class="print-btn-container">
            <button class="print-btn" onclick="window.print();">Print Packing Slip</button>
          </div>

        </div>
      </body>
      </html>
    `;

    printWindow.document.write(receiptHtml);
    printWindow.document.close();
    printWindow.focus();
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
    updateFloatingHUD();
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_authenticated');
    localStorage.setItem('fp_live_edit_mode', 'false');
    window.dispatchEvent(new CustomEvent('fp_edit_mode_toggled', { detail: { enabled: false } }));
    updateFloatingHUD();
    
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
    updateFloatingHUD();
  }

  window.addEventListener('hashchange', checkRoute);
  window.addEventListener('fp_edit_mode_toggled', updateFloatingHUD);
  
  // Real-time Cloud Firestore subscriptions
  subscribeToProducts(() => {
    if (isAuthenticated() && window.location.hash === '#admin') {
      if (activeTab === 'products') {
        renderProductsTab();
      }
    }
  });

  subscribeToOrders(() => {
    if (isAuthenticated() && window.location.hash === '#admin') {
      renderAdminConsole();
    }
  });

  window.addEventListener('fp_orders_updated', () => {
    if (isAuthenticated() && window.location.hash === '#admin') {
      renderAdminConsole();
    }
  });

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
