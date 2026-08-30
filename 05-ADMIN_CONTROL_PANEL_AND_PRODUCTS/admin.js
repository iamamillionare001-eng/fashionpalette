/**
 * ADMIN CONTROL PANEL & PRODUCT MANAGEMENT
 * Serves as the dashboard workspace for founders to add products,
 * adjust pricing tiers, manage orders, and toggle active themes.
 */

import { storeConfig } from '../07-STORE_SETTINGS_AND_THEME_COLORS/store_config.js';
import { initHero, getHeroConfig } from '../02-HERO_BANNER_AND_FESTIVE_OFFERS/hero.js';

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
  // Dispatch custom event to notify storefront (gallery.js)
  window.dispatchEvent(new CustomEvent("fp_products_updated"));
}

export function initAdmin(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let activeTab = "dashboard"; // "dashboard" or "products"

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

      <!-- Luxury Tab Sub-Navigation Bar -->
      <div class="border-b border-[#E5E3DF] bg-white w-full sticky top-[68px] z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-8">
          <button 
            id="tab-btn-dashboard" 
            class="py-4.5 text-[10px] sm:text-xs uppercase tracking-widest font-semibold border-b-2 transition-all focus:outline-none ${
              activeTab === "dashboard" 
                ? "border-[#1A1A1A] text-[#1A1A1A]" 
                : "border-transparent text-[#8A8A8A] hover:text-[#1A1A1A]"
            }"
          >
            Dashboard & Banners
          </button>
          <button 
            id="tab-btn-products" 
            class="py-4.5 text-[10px] sm:text-xs uppercase tracking-widest font-semibold border-b-2 transition-all focus:outline-none ${
              activeTab === "products" 
                ? "border-[#1A1A1A] text-[#1A1A1A]" 
                : "border-transparent text-[#8A8A8A] hover:text-[#1A1A1A]"
            }"
          >
            Manage Store Products
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

    // Tab button click listeners
    const tabDashboard = document.getElementById('tab-btn-dashboard');
    const tabProducts = document.getElementById('tab-btn-products');

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

    // Render the active tab content
    if (activeTab === "dashboard") {
      renderDashboardTab();
    } else {
      renderProductsTab();
    }
  }

  // TAB 1: DASHBOARD & HERO BANNERS
  function renderDashboardTab() {
    const tabContent = document.getElementById('admin-tab-content-container');
    if (!tabContent) return;

    const products = getProducts();
    const totalProductsCount = products.length;

    // Calculate revenue mock or dynamic
    let totalRevenueMock = 134500;
    const cart = JSON.parse(localStorage.getItem('fp_cart') || '[]');
    
    tabContent.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
        
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
                <p class="text-2xl font-light text-[#1A1A1A] mt-1">${totalProductsCount} Active</p>
              </div>
              <div class="bg-[#F9F8F6] p-4 border border-[#E5E3DF] rounded-xl">
                <p class="text-[9px] uppercase tracking-widest text-[#5A5A5A] font-semibold">Total Revenue</p>
                <p class="text-2xl font-light text-[#C5A880] mt-1">${storeConfig.currency}${totalRevenueMock.toLocaleString('en-IN')}</p>
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
        if (confirm("Are you sure you want to reset the hero banner to factory defaults?")) {
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

          <form id="add-product-form" class="space-y-4" onsubmit="event.preventDefault();">
            <div>
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Product Title</label>
              <input type="text" id="prod-title" required placeholder="e.g. Royal Silk Lehenga" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Category</label>
                <select id="prod-category" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]">
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
                <input type="text" id="prod-badge" placeholder="e.g. Bestseller" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Selling Price (₹)</label>
                <input type="number" id="prod-price" required placeholder="2499" min="0" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
              </div>
              <div>
                <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Original Price / MRP (₹)</label>
                <input type="number" id="prod-mrp" required placeholder="4999" min="0" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
              </div>
            </div>

            <div>
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Sizes (Comma separated)</label>
              <input type="text" id="prod-sizes" required placeholder="e.g. M, L, XL or Free Size" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
            </div>

            <div>
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Main Image URL</label>
              <input type="url" id="prod-image-main" required placeholder="https://unsplash.com/..." class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
            </div>

            <div>
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Gallery Image URLs (Comma separated)</label>
              <input type="text" id="prod-image-gallery" placeholder="https://..., https://..." class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
            </div>

            <div>
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Product Description</label>
              <textarea id="prod-desc" required placeholder="Detailed description of product fit and drape..." rows="3" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880] resize-none"></textarea>
            </div>

            <div>
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Fabric & Composition (Optional)</label>
              <input type="text" id="prod-fabric" placeholder="e.g. 100% Pure Georgette Silk. Dry clean only." class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
            </div>

            <button type="submit" id="add-product-submit-btn" class="w-full py-3.5 bg-[#1A1A1A] hover:bg-[#C5A880] hover:text-[#1A1A1A] text-white text-xs uppercase tracking-widest font-semibold transition-all duration-300 rounded-xl focus:outline-none shadow-md">
              Add to Storefront Catalog
            </button>
          </form>
        </div>

        <!-- Right: Active Products Inventory Table (col-span-7) -->
        <div class="lg:col-span-7 bg-white border border-[#E5E3DF] p-6 rounded-2xl space-y-6 shadow-sm overflow-hidden">
          <div>
            <h3 class="text-sm uppercase tracking-wider text-[#1A1A1A] font-bold border-b border-[#E5E3DF] pb-3">
              Product Inventory (${products.length} Items)
            </h3>
          </div>

          <div class="overflow-x-auto">
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
                          class="stock-toggle-badge px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-bold border transition-all ${
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
                          class="delete-product-btn text-rose-600 hover:text-rose-900 border border-rose-200 hover:border-rose-600 rounded-lg px-2.5 py-1.5 bg-rose-50/50 hover:bg-rose-50 text-[9px] uppercase tracking-widest font-bold transition-all focus:outline-none"
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

      </div>
    `;

    // Hook Up Add Product Form Listener
    const form = document.getElementById('add-product-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Retrieve field values
        const title = document.getElementById('prod-title').value.trim();
        const category = document.getElementById('prod-category').value;
        const badge = document.getElementById('prod-badge').value.trim();
        const price = parseInt(document.getElementById('prod-price').value);
        const originalPrice = parseInt(document.getElementById('prod-mrp').value);
        const sizesInput = document.getElementById('prod-sizes').value.trim();
        const mainImage = document.getElementById('prod-image-main').value.trim();
        const galleryInput = document.getElementById('prod-image-gallery').value.trim();
        const description = document.getElementById('prod-desc').value.trim();
        const fabricDetails = document.getElementById('prod-fabric').value.trim() || "Premium luxury fabric. Delicate handling.";

        // Split sizes
        const sizes = sizesInput.split(',').map(s => s.trim()).filter(s => s !== "");
        
        // Split gallery images, prepend main image
        const images = [mainImage];
        if (galleryInput) {
          galleryInput.split(',').map(img => img.trim()).filter(img => img !== "").forEach(img => {
            images.push(img);
          });
        }

        // Generate unique id
        const id = "prod-" + Date.now();

        // Calculate discount percentage
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

        const updatedProducts = [...products, newProduct];
        saveProducts(updatedProducts);
        
        alert(`⚡ Product "${title}" has been successfully added to the catalog!`);
        
        // Re-render tab content
        renderProductsTab();
      });
    }

    // Hook Up Stock Toggle Buttons
    const stockBadges = tabContent.querySelectorAll('.stock-toggle-badge');
    stockBadges.forEach(badge => {
      badge.addEventListener('click', () => {
        const id = badge.getAttribute('data-toggle-id');
        const updatedProducts = products.map(p => {
          if (p.id === id) {
            return { ...p, inStock: !p.inStock };
          }
          return p;
        });
        saveProducts(updatedProducts);
        renderProductsTab();
      });
    });

    // Hook Up Delete Product Buttons
    const deleteBtns = tabContent.querySelectorAll('.delete-product-btn');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-delete-id');
        const prod = products.find(p => p.id === id);
        if (prod && confirm(`Are you sure you want to permanently delete "${prod.title}" from the catalog?`)) {
          const updatedProducts = products.filter(p => p.id !== id);
          saveProducts(updatedProducts);
          renderProductsTab();
        }
      });
    });
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
