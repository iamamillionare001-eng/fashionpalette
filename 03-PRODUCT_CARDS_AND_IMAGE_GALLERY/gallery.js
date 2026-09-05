/**
 * PRODUCT CARDS & IMAGE GALLERY
 * Handles the display, filtering, search synchronization, quick-view modal,
 * and Visual Live Edit Mode with Direct On-Card Actions, Drag-and-Drop Reordering,
 * and In-Storefront Quick-Edit Modal.
 */

import { 
  subscribeToProducts, 
  saveProductToCloud, 
  updateProductStockInCloud, 
  deleteProductFromCloud, 
  updateProductsSortOrderInCloud,
  uploadToImgBB 
} from '../07-STORE_SETTINGS_AND_THEME_COLORS/firebase_sync.js';

// Curated dropshipping apparel catalog for Ganesh Chaturthi and Festive 2026
const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    sortOrder: 0,
    title: "Royal Chanderi Silk Zari Saree",
    category: "Women",
    price: 2499,
    originalPrice: 4999,
    discountPercentage: 50,
    badge: "Bestseller",
    description: "Embrace timeless elegance with this Royal Chanderi Silk Saree, featuring intricate Zari weave patterns and a luxurious golden border. Perfect for Ganesh Chaturthi and festive gatherings.",
    fabricDetails: "Pure Chanderi Silk with metallic Zari threads. Dry clean only.",
    sizes: ["Free Size"],
    inStock: true,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "prod-2",
    sortOrder: 1,
    title: "Embroidered Silk Kurta & Churidar Set",
    category: "Men",
    price: 1899,
    originalPrice: 3499,
    discountPercentage: 46,
    badge: "Festive Pick",
    description: "Step into the festive season with sophistication. This art silk kurta is embellished with delicate thread embroidery around the mandarin collar and features a matching comfortable churidar.",
    fabricDetails: "Premium Art Silk blend. Hand wash cold or dry clean.",
    sizes: ["M", "L", "XL", "XXL"],
    inStock: true,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "prod-3",
    sortOrder: 2,
    title: "Twinned Royal Maroon Silk Couple Festive Set",
    category: "Couple",
    price: 4299,
    originalPrice: 7999,
    discountPercentage: 46,
    badge: "Matching Duo",
    description: "Celebrate together in style with our matching festive sets. Features a coordinated maroon silk saree for her and a matching embroidered silk kurta set for him, crafted to perfection.",
    fabricDetails: "Saree: Chanderi Silk | Kurta: Art Silk. Dry clean recommended.",
    sizes: ["Women M / Men L", "Women L / Men XL"],
    inStock: true,
    images: [
      "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "prod-4",
    sortOrder: 3,
    title: "Boys Handloom Kurta Dhoti Set",
    category: "Kids",
    price: 999,
    originalPrice: 1999,
    discountPercentage: 50,
    badge: "Popular",
    description: "A delightful traditional ensemble for young boys. This handloom cotton kurta is breathable and comes paired with a pre-stitched, easy-to-wear dhoti, ensuring comfort all day.",
    fabricDetails: "100% Handloom Cotton. Gentle machine wash.",
    sizes: ["4-5Y", "6-7Y", "8-9Y"],
    inStock: true,
    images: [
      "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "prod-5",
    sortOrder: 4,
    title: "Pure Hand-spun Organic Cotton Kurta",
    category: "Elders",
    price: 1299,
    originalPrice: 2299,
    discountPercentage: 43,
    badge: "Comfort Fit",
    description: "Designed specifically for ultimate ease, this pure hand-spun cotton kurta offers unmatched breathability, a relaxed comfort fit, and soft flat seams suitable for sensitive skin.",
    fabricDetails: "100% Organic Hand-spun Khadi Cotton. Machine wash gentle.",
    sizes: ["M", "L", "XL", "XXL", "3XL"],
    inStock: true,
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
    ]
  }
];

// Helper to check if visual live edit mode is active and authenticated
function isLiveEditActive() {
  return sessionStorage.getItem('admin_authenticated') === 'true' && localStorage.getItem('fp_live_edit_mode') === 'true';
}

// Helper to retrieve catalog from localStorage with sortOrder preserved
export function getProducts() {
  const cached = localStorage.getItem("fp_products_data");
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      parsed.sort((a, b) => {
        const orderA = typeof a.sortOrder === 'number' ? a.sortOrder : 999999;
        const orderB = typeof b.sortOrder === 'number' ? b.sortOrder : 999999;
        return orderA - orderB;
      });
      return parsed;
    } catch (e) {
      console.error("Error parsing fp_products_data", e);
    }
  }
  localStorage.setItem("fp_products_data", JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}

export function initGallery(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let activeCategory = "All";
  let searchQuery = "";
  let products = getProducts();

  // Primary rendering method
  function render() {
    const editMode = isLiveEditActive();

    // Filter logic
    const filteredProducts = products.filter(p => {
      // Category match
      const catLower = activeCategory.toLowerCase();
      const matchesCategory = 
        catLower === "all" || 
        catLower === "all festive" || 
        p.category.toLowerCase() === catLower;
      
      // Search match
      const queryLower = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        queryLower === "" || 
        p.title.toLowerCase().includes(queryLower) || 
        p.category.toLowerCase().includes(queryLower);

      return matchesCategory && matchesSearch;
    });

    container.innerHTML = `
      <section id="collection" class="py-20 border-t border-[#E5E3DF] bg-[#F9F8F6]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <!-- Section Header -->
          <div class="text-center max-w-xl mx-auto mb-16 space-y-4">
            <span class="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-semibold block">Curated Selection</span>
            <h2 class="text-3xl sm:text-4xl font-serif font-light tracking-tight text-[#1A1A1A]">Signature Pieces</h2>
            <div class="h-[1.5px] w-12 bg-[#C5A880] mx-auto mt-4"></div>
            <p class="text-xs text-[#5A5A5A] uppercase tracking-widest font-light leading-relaxed">
              ${editMode 
                ? `<span class="text-amber-700 font-semibold">🛠️ Visual Live Edit Active: Drag cards to reorder &bull; Use on-card buttons to edit or delete</span>`
                : `Step 4 Dropshipping Catalog &bull; Premium Indian Festive Apparel`}
            </p>
          </div>

          <!-- Product Grid Layout (2 cols mobile, 3 to 4 cols desktop) -->
          ${filteredProducts.length === 0 ? `
            <div class="text-center py-20 bg-white rounded-2xl border border-[#E5E3DF]">
              <svg class="w-12 h-12 text-[#C5A880] mx-auto mb-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 class="text-sm font-semibold text-[#1A1A1A] uppercase tracking-widest">No Products Found</h3>
              <p class="text-xs text-[#5A5A5A] mt-2">Try adjusting your filters or search terms.</p>
            </div>
          ` : `
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6" id="products-grid-container">
              ${filteredProducts.map(product => {
                const discount = product.discountPercentage || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
                const hasMultipleImages = product.images && product.images.length > 0;
                const mainImage = hasMultipleImages ? product.images[0] : "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80";
                
                return `
                  <div 
                    class="group bg-white rounded-2xl border ${editMode ? 'border-[#C5A880]/60 ring-1 ring-[#C5A880]/30 shadow-sm cursor-grab active:cursor-grabbing' : 'border-[#E5E3DF]'} p-3 sm:p-4 hover:shadow-md transition-all duration-300 flex flex-col justify-between relative product-card" 
                    data-product-id="${product.id}"
                    draggable="${editMode ? 'true' : 'false'}"
                  >
                    <!-- Drag Grab Handle in Top-Left (Visible in Edit Mode) -->
                    ${editMode ? `
                      <div class="absolute top-2.5 left-2.5 z-30 bg-[#1A1A1A]/90 backdrop-blur-xs text-amber-200 w-8 h-8 rounded-full border border-[#C5A880]/60 flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing select-none" title="Drag to reorder card">
                        <span class="text-sm font-mono tracking-tighter leading-none">⠿</span>
                      </div>
                    ` : ''}

                    <!-- Administrative Floating Action Bar in Top-Right (Visible in Edit Mode) -->
                    ${editMode ? `
                      <div class="absolute top-2.5 right-2.5 z-30 flex items-center gap-1 bg-[#1A1A1A]/90 backdrop-blur-xs p-1 rounded-full border border-[#C5A880]/70 shadow-xl">
                        <!-- Eye / Visibility Toggle (In Stock vs Out of Stock) -->
                        <button 
                          type="button" 
                          class="card-stock-toggle-btn w-7 h-7 rounded-full flex items-center justify-center transition-all ${product.inStock ? 'text-emerald-400 hover:bg-emerald-500/20' : 'text-stone-400 hover:bg-stone-700'}"
                          data-action-id="${product.id}"
                          title="${product.inStock ? 'In Stock (Click to toggle out of stock)' : 'Out of Stock (Click to toggle in stock)'}"
                        >
                          ${product.inStock ? `
                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          ` : `
                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                            </svg>
                          `}
                        </button>

                        <!-- Pencil Icon (Quick Edit Modal) -->
                        <button 
                          type="button" 
                          class="card-quick-edit-btn w-7 h-7 rounded-full text-amber-200 hover:bg-amber-400/20 flex items-center justify-center transition-all"
                          data-action-id="${product.id}"
                          title="Quick Edit Product"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>

                        <!-- Dustbin Icon (Delete) -->
                        <button 
                          type="button" 
                          class="card-delete-btn w-7 h-7 rounded-full text-rose-400 hover:bg-rose-500/20 flex items-center justify-center transition-all"
                          data-action-id="${product.id}"
                          title="Permanently Delete Product"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ` : ''}

                    <!-- Image Frame -->
                    <div class="aspect-[3/4] w-full bg-stone-100 relative rounded-xl overflow-hidden group/img">
                      <img 
                        src="${mainImage}" 
                        alt="${product.title}" 
                        class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-105 pointer-events-none"
                      />
                      
                      <!-- Top Left Badges (Offset if in Edit Mode) -->
                      <div class="absolute ${editMode ? 'top-12' : 'top-2.5'} left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none transition-all">
                        <span class="bg-[#1A1A1A]/90 backdrop-blur-xs text-white text-[8px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
                          ${product.category}
                        </span>
                        ${product.badge ? `
                          <span class="bg-[#C5A880] text-white text-[8px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
                            ${product.badge}
                          </span>
                        ` : ''}
                      </div>

                      <!-- Stock Status overlay if out of stock -->
                      ${!product.inStock ? `
                        <div class="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center z-10">
                          <span class="bg-[#C5A880] text-white text-[10px] uppercase tracking-widest font-semibold px-4 py-2 rounded-md">Out of Stock</span>
                        </div>
                      ` : ''}

                      <!-- Quick View Trigger Overlay (on image hover, desktop only) -->
                      ${product.inStock && !editMode ? `
                        <button 
                          class="quick-view-overlay-btn absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-xs hover:bg-white text-[#1A1A1A] rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-300 shadow-md scale-90 hover:scale-100 focus:outline-none"
                          title="Quick View"
                        >
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      ` : ''}
                    </div>

                    <!-- Details Area -->
                    <div class="mt-4 flex-grow flex flex-col justify-between">
                      <div class="space-y-1">
                        <h3 class="text-xs sm:text-sm font-medium text-[#1A1A1A] line-clamp-1 group-hover:text-[#C5A880] transition-colors">${product.title}</h3>
                        
                        <!-- Pricing Display -->
                        <div class="flex items-center gap-2 flex-wrap">
                          <span class="text-sm font-bold text-[#1A1A1A]">₹${product.price.toLocaleString('en-IN')}</span>
                          <span class="text-[10px] text-[#8A8A8A] line-through">₹${product.originalPrice.toLocaleString('en-IN')}</span>
                          <span class="text-[9px] font-semibold text-emerald-600 uppercase">${discount}% OFF</span>
                        </div>
                      </div>

                      <!-- Size Selector inside Card -->
                      <div class="mt-3.5 space-y-1.5">
                        <p class="text-[8px] uppercase tracking-widest text-[#8A8A8A] font-semibold">Select Size</p>
                        <div class="flex flex-wrap gap-1.5 size-selector-container">
                          ${product.sizes.map((size) => `
                            <button 
                              class="size-pill border border-[#E5E3DF] text-[9px] uppercase font-medium px-2 py-1 rounded-md transition-all hover:border-[#1A1A1A]"
                              data-size="${size}"
                            >
                              ${size}
                            </button>
                          `).join('')}
                        </div>
                      </div>

                      <!-- Actions Row -->
                      <div class="mt-4 flex gap-2">
                        ${editMode ? `
                          <!-- Direct Quick Edit CTA in Edit Mode -->
                          <button 
                            class="card-quick-edit-btn flex-grow py-2.5 bg-amber-500/10 hover:bg-[#C5A880] text-[#1A1A1A] hover:text-white border border-[#C5A880] text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 focus:outline-none shadow-xs"
                            data-action-id="${product.id}"
                          >
                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            <span>Quick Edit</span>
                          </button>
                        ` : `
                          <button 
                            class="add-to-bag-btn flex-grow py-2.5 bg-[#1A1A1A] hover:bg-[#C5A880] hover:text-[#1A1A1A] text-white text-[10px] uppercase tracking-widest font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 focus:outline-none"
                            ${!product.inStock ? 'disabled' : ''}
                          >
                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span>Add to Bag</span>
                          </button>
                          
                          <button 
                            class="quick-view-btn w-9 h-9 border border-[#E5E3DF] text-[#1A1A1A] hover:border-[#1A1A1A] hover:bg-stone-50 rounded-lg flex items-center justify-center transition-all focus:outline-none"
                            title="Quick View"
                          >
                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        `}
                      </div>

                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>
      </section>
    `;

    // Attach Event Listeners to rendered grid elements
    attachCardListeners();
  }

  function attachCardListeners() {
    const editMode = isLiveEditActive();
    const cards = container.querySelectorAll('.product-card');

    cards.forEach(card => {
      const productId = card.getAttribute('data-product-id');
      const product = products.find(p => p.id === productId);
      if (!product) return;

      // 1. Size Pill Selection
      const sizePills = card.querySelectorAll('.size-pill');
      sizePills.forEach(pill => {
        pill.addEventListener('click', (e) => {
          e.stopPropagation();
          // Remove active state from other pills in this card
          sizePills.forEach(p => {
            p.classList.remove('bg-[#1A1A1A]', 'text-white', 'border-[#1A1A1A]');
            p.classList.add('border-[#E5E3DF]');
          });
          // Add active state to clicked pill
          pill.classList.remove('border-[#E5E3DF]');
          pill.classList.add('bg-[#1A1A1A]', 'text-white', 'border-[#1A1A1A]', 'active');
        });
      });

      // 2. Add To Bag (Card Quick Action when not in Edit Mode)
      const addToBagBtn = card.querySelector('.add-to-bag-btn');
      if (addToBagBtn) {
        addToBagBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const activePill = card.querySelector('.size-pill.active');
          let selectedSize = activePill ? activePill.dataset.size : null;

          // Auto-select if there is only 1 size option (e.g. Free Size)
          if (!selectedSize && product.sizes.length === 1) {
            selectedSize = product.sizes[0];
          }

          if (!selectedSize) {
            const sizeContainer = card.querySelector('.size-selector-container');
            if (sizeContainer) {
              sizeContainer.classList.add('animate-bounce');
              setTimeout(() => sizeContainer.classList.remove('animate-bounce'), 1000);
            }
            alert(`Please select a size for ${product.title} first!`);
            return;
          }

          addToBag(product, selectedSize, 1);
        });
      }

      // 3. Quick View Trigger
      const qvOverlay = card.querySelector('.quick-view-overlay-btn');
      const qvBtn = card.querySelector('.quick-view-btn');
      
      const openModal = (e) => {
        e.stopPropagation();
        showQuickViewModal(product);
      };

      if (qvOverlay) qvOverlay.addEventListener('click', openModal);
      if (qvBtn) qvBtn.addEventListener('click', openModal);
    });

    // 4. On-Card Admin Actions (Stock Toggle, Quick Edit, Delete)
    if (editMode) {
      // Stock toggle
      container.querySelectorAll('.card-stock-toggle-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-action-id');
          const prod = products.find(p => p.id === id);
          if (prod) {
            const newStock = !prod.inStock;
            await updateProductStockInCloud(id, newStock);
            prod.inStock = newStock;
            render();
          }
        });
      });

      // Quick edit pencil button
      container.querySelectorAll('.card-quick-edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-action-id');
          const prod = products.find(p => p.id === id);
          if (prod) {
            showQuickEditModal(prod);
          }
        });
      });

      // Delete dustbin button
      container.querySelectorAll('.card-delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-action-id');
          const prod = products.find(p => p.id === id);
          if (prod && confirm(`Delete "${prod.title}" permanently?`)) {
            // Animate removal from DOM in real time
            const targetCard = container.querySelector(`[data-product-id="${id}"]`);
            if (targetCard) {
              targetCard.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
              targetCard.style.transform = 'scale(0.85)';
              targetCard.style.opacity = '0';
            }
            await deleteProductFromCloud(id);
            products = products.filter(p => p.id !== id);
            setTimeout(() => render(), 400);
          }
        });
      });

      // 5. HTML5 Drag-and-Drop Reordering Handlers
      cards.forEach(card => {
        card.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', card.getAttribute('data-product-id'));
          e.dataTransfer.effectAllowed = 'move';
          card.classList.add('opacity-40', 'scale-95', 'border-[#C5A880]', 'border-dashed');
        });

        card.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          card.classList.add('ring-2', 'ring-[#C5A880]', 'scale-[1.02]');
        });

        card.addEventListener('dragleave', () => {
          card.classList.remove('ring-2', 'ring-[#C5A880]', 'scale-[1.02]');
        });

        card.addEventListener('dragend', () => {
          cards.forEach(c => c.classList.remove('opacity-40', 'scale-95', 'border-[#C5A880]', 'border-dashed', 'ring-2', 'ring-[#C5A880]', 'scale-[1.02]'));
        });

        card.addEventListener('drop', async (e) => {
          e.preventDefault();
          card.classList.remove('ring-2', 'ring-[#C5A880]', 'scale-[1.02]');
          const draggedId = e.dataTransfer.getData('text/plain');
          const targetId = card.getAttribute('data-product-id');
          if (!draggedId || draggedId === targetId) return;

          const draggedIndex = products.findIndex(p => p.id === draggedId);
          const targetIndex = products.findIndex(p => p.id === targetId);
          if (draggedIndex === -1 || targetIndex === -1) return;

          // Reorder products array
          const [movedProduct] = products.splice(draggedIndex, 1);
          products.splice(targetIndex, 0, movedProduct);

          // Assign sequential sortOrder values
          products.forEach((p, idx) => {
            p.sortOrder = idx;
          });

          // Sync new visual order to Firestore & localStorage
          await updateProductsSortOrderInCloud(products);
          render();
        });
      });
    }
  }

  // --- Cart Manager ---
  function addToBag(product, size, quantity) {
    const cart = JSON.parse(localStorage.getItem('fp_cart') || '[]');
    const existingIndex = cart.findIndex(item => item.productId === product.id && item.size === size);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        size: size,
        quantity: quantity,
        image: product.images[0] || ""
      });
    }

    localStorage.setItem('fp_cart', JSON.stringify(cart));
    
    // Dispatch global event for header and checkouts to sync
    window.dispatchEvent(new CustomEvent('fp_cart_updated'));
    window.dispatchEvent(new CustomEvent('fp_open_cart'));
  }

  // --- In-Storefront Quick-Edit Modal ---
  function showQuickEditModal(product) {
    const existingModal = document.getElementById('quick-edit-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'quick-edit-modal';
    modal.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-[#1A1A1A]/80 backdrop-blur-md p-4 transition-all duration-300 opacity-0 overflow-y-auto';

    const defaultApparelSizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "Free Size"];
    const defaultCoupleSizes = ["Women M / Men L", "Women L / Men XL", "Custom Pair"];
    const modalSelectedSizes = new Set(product.sizes || ["Free Size"]);
    const modalCustomSizes = (product.sizes || []).filter(s => !defaultApparelSizes.includes(s) && !defaultCoupleSizes.includes(s));

    let mainImageChoice = (product.images && product.images[0]) || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80";
    let modalImageMode = "keep"; // "keep" | "upload" | "url"
    let uploadedModalImage = "";

    modal.innerHTML = `
      <div class="bg-white rounded-3xl border border-[#E5E3DF] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 sm:p-8 transform scale-95 opacity-0 transition-all duration-300 space-y-6" id="qe-modal-card">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-[#E5E3DF] pb-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-amber-500/10 border border-[#C5A880] flex items-center justify-center text-amber-700">
              <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div>
              <h2 class="font-serif text-lg text-[#1A1A1A] font-medium leading-tight">Quick Edit Product</h2>
              <p class="text-[9px] uppercase tracking-wider text-[#C5A880] font-sans font-semibold">Storefront Live Editor &bull; ID: ${product.id}</p>
            </div>
          </div>
          
          <button id="qe-close-btn" class="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-[#1A1A1A] flex items-center justify-center transition-all focus:outline-none" title="Close">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Edit Form -->
        <form id="quick-edit-form" class="space-y-4" onsubmit="event.preventDefault();">
          <!-- Title -->
          <div>
            <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Product Title</label>
            <input type="text" id="qe-title" required value="${(product.title || '').replace(/"/g, '&quot;')}" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
          </div>

          <!-- Category & Badge -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Category</label>
              <select id="qe-category" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880] cursor-pointer">
                <option value="Women" ${product.category === "Women" ? "selected" : ""}>Women</option>
                <option value="Men" ${product.category === "Men" ? "selected" : ""}>Men</option>
                <option value="Couple" ${product.category === "Couple" ? "selected" : ""}>Couple</option>
                <option value="Kids" ${product.category === "Kids" ? "selected" : ""}>Kids</option>
                <option value="Elders" ${product.category === "Elders" ? "selected" : ""}>Elders</option>
                <option value="Accessories" ${product.category === "Accessories" ? "selected" : ""}>Accessories</option>
              </select>
            </div>
            <div>
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Badge (Optional e.g. Bestseller)</label>
              <input type="text" id="qe-badge" value="${(product.badge || '').replace(/"/g, '&quot;')}" placeholder="e.g. Bestseller" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
            </div>
          </div>

          <!-- Pricing Tiers -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Selling Price (₹)</label>
              <input type="number" id="qe-price" required value="${product.price}" min="0" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
            </div>
            <div>
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Original MRP (₹)</label>
              <input type="number" id="qe-mrp" required value="${product.originalPrice}" min="0" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
            </div>
          </div>

          <!-- Sizes Multi-select Chips -->
          <div class="space-y-2 border-t border-[#E5E3DF]/60 pt-3">
            <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold">Sizes (Select Active Tags)</label>
            <div class="flex flex-wrap gap-1.5" id="qe-sizes-container"></div>
            <div class="flex items-center gap-2 pt-1">
              <button type="button" id="qe-add-custom-size-btn" class="px-3 py-1.5 border border-[#C5A880] text-[#C5A880] hover:bg-[#C5A880] hover:text-[#1A1A1A] text-[9px] font-semibold uppercase tracking-wider rounded-lg transition-all">
                + Custom Size
              </button>
              <div id="qe-custom-size-wrapper" class="hidden flex items-center gap-2">
                <input type="text" id="qe-custom-size-input" placeholder="e.g. 4XL" class="bg-[#F9F8F6] border border-[#C5A880] px-2.5 py-1 text-xs rounded-lg focus:outline-none w-24" />
                <button type="button" id="qe-confirm-custom-size-btn" class="px-3 py-1 bg-[#1A1A1A] text-white text-[9px] font-semibold uppercase tracking-wider rounded-lg hover:bg-[#C5A880] hover:text-[#1A1A1A]">Add</button>
              </div>
            </div>
          </div>

          <!-- Dual-Mode Main Image Updater -->
          <div class="space-y-2.5 border-t border-[#E5E3DF]/60 pt-3">
            <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold">Main Product Image</label>
            
            <div class="flex items-start gap-3">
              <div class="w-16 h-20 rounded-xl overflow-hidden border border-[#C5A880] bg-stone-100 flex-shrink-0">
                <img id="qe-current-img-preview" src="${mainImageChoice}" class="w-full h-full object-cover" />
              </div>
              
              <div class="flex-grow space-y-2">
                <div class="flex gap-2">
                  <button type="button" id="qe-img-mode-keep" class="flex-1 py-1.5 px-2 text-[9px] font-semibold uppercase tracking-wider border rounded-lg transition-all bg-[#1A1A1A] text-white border-[#1A1A1A]">Keep Photo</button>
                  <button type="button" id="qe-img-mode-upload" class="flex-1 py-1.5 px-2 text-[9px] font-semibold uppercase tracking-wider border rounded-lg transition-all bg-white text-[#5A5A5A] border-[#E5E3DF]">Upload (ImgBB)</button>
                  <button type="button" id="qe-img-mode-url" class="flex-1 py-1.5 px-2 text-[9px] font-semibold uppercase tracking-wider border rounded-lg transition-all bg-white text-[#5A5A5A] border-[#E5E3DF]">URL Link</button>
                </div>

                <div id="qe-upload-zone" class="hidden">
                  <div class="border-2 border-dashed border-[#C5A880]/50 rounded-xl p-4 text-center cursor-pointer bg-[#F9F8F6] hover:bg-[#C5A880]/5 relative min-h-[70px] flex flex-col items-center justify-center" id="qe-dropzone">
                    <input type="file" id="qe-file-input" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <p class="text-[9px] font-bold text-[#1A1A1A] uppercase tracking-wider pointer-events-none">Click or Drop new photo to upload to ImgBB</p>
                  </div>
                </div>

                <div id="qe-url-zone" class="hidden">
                  <input type="url" id="qe-url-input" placeholder="https://unsplash.com/..." value="${mainImageChoice}" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
                </div>
              </div>
            </div>
          </div>

          <!-- Description & Details -->
          <div class="space-y-3 border-t border-[#E5E3DF]/60 pt-3">
            <div>
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1">Product Description</label>
              <textarea id="qe-desc" rows="2" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-2 text-xs rounded-xl focus:outline-none focus:border-[#C5A880] resize-none">${(product.description || '').replace(/</g, '&lt;')}</textarea>
            </div>
            <div>
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1">Fabric & Composition</label>
              <input type="text" id="qe-fabric" value="${(product.fabricDetails || '').replace(/"/g, '&quot;')}" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
            </div>
          </div>

          <!-- Action CTAs -->
          <div class="grid grid-cols-2 gap-3 pt-4 border-t border-[#E5E3DF]">
            <button type="button" id="qe-cancel-btn" class="py-3 border border-[#E5E3DF] text-[#5A5A5A] hover:bg-stone-50 text-xs uppercase tracking-widest font-semibold rounded-xl transition-all focus:outline-none min-h-[44px]">
              Discard
            </button>
            <button type="submit" id="qe-save-btn" class="py-3 bg-[#1A1A1A] hover:bg-[#C5A880] hover:text-[#1A1A1A] text-white text-xs uppercase tracking-widest font-semibold rounded-xl transition-all duration-300 shadow-md focus:outline-none min-h-[44px]">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.classList.add('overflow-hidden');

    // Trigger Entrance Animation
    setTimeout(() => {
      modal.classList.remove('opacity-0');
      modal.classList.add('opacity-100');
      const card = document.getElementById('qe-modal-card');
      if (card) {
        card.classList.remove('scale-95', 'opacity-0');
        card.classList.add('scale-100', 'opacity-100');
      }
    }, 30);

    function closeModal() {
      const card = document.getElementById('qe-modal-card');
      if (card) {
        card.classList.remove('scale-100', 'opacity-100');
        card.classList.add('scale-95', 'opacity-0');
      }
      modal.classList.remove('opacity-100');
      modal.classList.add('opacity-0');
      setTimeout(() => {
        modal.remove();
        document.body.classList.remove('overflow-hidden');
      }, 300);
    }

    const closeBtn = modal.querySelector('#qe-close-btn');
    const cancelBtn = modal.querySelector('#qe-cancel-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Render Size chips inside quick-edit modal
    function renderModalSizeChips() {
      const sizesContainer = modal.querySelector('#qe-sizes-container');
      if (!sizesContainer) return;
      const allSizes = Array.from(new Set([...defaultApparelSizes, ...defaultCoupleSizes, ...modalCustomSizes]));

      sizesContainer.innerHTML = allSizes.map(sz => {
        const isSel = modalSelectedSizes.has(sz);
        return `
          <button type="button" data-size="${sz}" class="qe-size-chip px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border transition-all ${
            isSel ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-white text-[#1A1A1A] border-[#E5E3DF] hover:border-[#1A1A1A]'
          }">
            ${isSel ? '✓ ' : ''}${sz}
          </button>
        `;
      }).join('');

      sizesContainer.querySelectorAll('.qe-size-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          const sz = btn.getAttribute('data-size');
          if (modalSelectedSizes.has(sz)) {
            modalSelectedSizes.delete(sz);
          } else {
            modalSelectedSizes.add(sz);
          }
          renderModalSizeChips();
        });
      });
    }

    renderModalSizeChips();

    // Custom size adder inside modal
    const addCustomBtn = modal.querySelector('#qe-add-custom-size-btn');
    const customWrapper = modal.querySelector('#qe-custom-size-wrapper');
    const customInput = modal.querySelector('#qe-custom-size-input');
    const confirmCustomBtn = modal.querySelector('#qe-confirm-custom-size-btn');

    if (addCustomBtn && customWrapper && customInput && confirmCustomBtn) {
      addCustomBtn.addEventListener('click', () => {
        addCustomBtn.classList.add('hidden');
        customWrapper.classList.remove('hidden');
        customInput.focus();
      });

      confirmCustomBtn.addEventListener('click', () => {
        const val = customInput.value.trim();
        if (val && !modalCustomSizes.includes(val)) {
          modalCustomSizes.push(val);
          modalSelectedSizes.add(val);
        }
        customInput.value = '';
        customWrapper.classList.add('hidden');
        addCustomBtn.classList.remove('hidden');
        renderModalSizeChips();
      });

      customInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          confirmCustomBtn.click();
        }
      });
    }

    // Image Updater Mode Toggle Listeners
    const btnKeep = modal.querySelector('#qe-img-mode-keep');
    const btnUpload = modal.querySelector('#qe-img-mode-upload');
    const btnUrl = modal.querySelector('#qe-img-mode-url');
    const uploadZone = modal.querySelector('#qe-upload-zone');
    const urlZone = modal.querySelector('#qe-url-zone');
    const dropzone = modal.querySelector('#qe-dropzone');
    const fileInput = modal.querySelector('#qe-file-input');
    const previewImg = modal.querySelector('#qe-current-img-preview');
    const urlInput = modal.querySelector('#qe-url-input');

    if (btnKeep && btnUpload && btnUrl) {
      btnKeep.addEventListener('click', () => {
        modalImageMode = "keep";
        btnKeep.className = "flex-1 py-1.5 px-2 text-[9px] font-semibold uppercase tracking-wider border rounded-lg transition-all bg-[#1A1A1A] text-white border-[#1A1A1A]";
        btnUpload.className = "flex-1 py-1.5 px-2 text-[9px] font-semibold uppercase tracking-wider border rounded-lg transition-all bg-white text-[#5A5A5A] border-[#E5E3DF]";
        btnUrl.className = "flex-1 py-1.5 px-2 text-[9px] font-semibold uppercase tracking-wider border rounded-lg transition-all bg-white text-[#5A5A5A] border-[#E5E3DF]";
        uploadZone.classList.add('hidden');
        urlZone.classList.add('hidden');
        previewImg.src = mainImageChoice;
      });

      btnUpload.addEventListener('click', () => {
        modalImageMode = "upload";
        btnUpload.className = "flex-1 py-1.5 px-2 text-[9px] font-semibold uppercase tracking-wider border rounded-lg transition-all bg-[#1A1A1A] text-white border-[#1A1A1A]";
        btnKeep.className = "flex-1 py-1.5 px-2 text-[9px] font-semibold uppercase tracking-wider border rounded-lg transition-all bg-white text-[#5A5A5A] border-[#E5E3DF]";
        btnUrl.className = "flex-1 py-1.5 px-2 text-[9px] font-semibold uppercase tracking-wider border rounded-lg transition-all bg-white text-[#5A5A5A] border-[#E5E3DF]";
        uploadZone.classList.remove('hidden');
        urlZone.classList.add('hidden');
      });

      btnUrl.addEventListener('click', () => {
        modalImageMode = "url";
        btnUrl.className = "flex-1 py-1.5 px-2 text-[9px] font-semibold uppercase tracking-wider border rounded-lg transition-all bg-[#1A1A1A] text-white border-[#1A1A1A]";
        btnKeep.className = "flex-1 py-1.5 px-2 text-[9px] font-semibold uppercase tracking-wider border rounded-lg transition-all bg-white text-[#5A5A5A] border-[#E5E3DF]";
        btnUpload.className = "flex-1 py-1.5 px-2 text-[9px] font-semibold uppercase tracking-wider border rounded-lg transition-all bg-white text-[#5A5A5A] border-[#E5E3DF]";
        urlZone.classList.remove('hidden');
        uploadZone.classList.add('hidden');
      });
    }

    async function handleModalImageFile(file) {
      if (!file) return;
      if (dropzone) dropzone.innerHTML = `<div class="text-[9px] font-bold text-[#C5A880] uppercase animate-pulse flex items-center gap-1.5 justify-center py-2"><div class="w-3.5 h-3.5 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin"></div> Uploading to ImgBB...</div>`;
      try {
        const url = await uploadToImgBB(file);
        uploadedModalImage = url;
        if (previewImg) previewImg.src = url;
        if (dropzone) dropzone.innerHTML = `<p class="text-[9px] text-emerald-600 font-bold uppercase py-2">✓ Image Uploaded Successfully!</p>`;
      } catch (err) {
        alert("⚠️ ImgBB Upload Failed: " + (err.message || "Network Error"));
        if (dropzone) dropzone.innerHTML = `<input type="file" id="qe-file-input" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" /><p class="text-[9px] font-bold text-[#1A1A1A] uppercase tracking-wider pointer-events-none">Click or Drop new photo to upload</p>`;
      }
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) handleModalImageFile(e.target.files[0]);
      });
    }

    if (urlInput) {
      urlInput.addEventListener('input', (e) => {
        const u = e.target.value.trim();
        if (u && previewImg) previewImg.src = u;
      });
    }

    // Submit Changes
    const form = modal.querySelector('#quick-edit-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = modal.querySelector('#qe-title').value.trim();
        const category = modal.querySelector('#qe-category').value;
        const badge = modal.querySelector('#qe-badge').value.trim();
        const price = parseInt(modal.querySelector('#qe-price').value);
        const originalPrice = parseInt(modal.querySelector('#qe-mrp').value);
        const description = modal.querySelector('#qe-desc').value.trim();
        const fabricDetails = modal.querySelector('#qe-fabric').value.trim();

        if (modalSelectedSizes.size === 0) {
          alert("⚠️ Please select at least one size tag!");
          return;
        }

        let finalMainImage = mainImageChoice;
        if (modalImageMode === "upload") {
          if (uploadedModalImage) finalMainImage = uploadedModalImage;
        } else if (modalImageMode === "url") {
          const urlVal = urlInput.value.trim();
          if (urlVal) finalMainImage = urlVal;
        }

        const otherImages = (product.images || []).slice(1);
        const finalImages = [finalMainImage, ...otherImages];
        const discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);

        const updatedProduct = {
          ...product,
          title,
          category,
          price,
          originalPrice,
          discountPercentage,
          badge: badge || null,
          description,
          fabricDetails,
          sizes: Array.from(modalSelectedSizes),
          images: finalImages
        };

        const saveBtn = modal.querySelector('#qe-save-btn');
        if (saveBtn) {
          saveBtn.innerText = "Saving to Cloud...";
          saveBtn.disabled = true;
        }

        await saveProductToCloud(updatedProduct);

        // Update product in local state
        const idx = products.findIndex(p => p.id === product.id);
        if (idx !== -1) {
          products[idx] = updatedProduct;
        }

        closeModal();
        render();
      });
    }
  }

  // --- Luxury Quick View Modal ---
  function showQuickViewModal(product) {
    // Prevent double modals
    const existingModal = document.getElementById('quickview-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'quickview-modal';
    modal.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-[#1A1A1A]/70 backdrop-blur-md p-4 transition-all duration-300 opacity-0';
    
    const discount = product.discountPercentage || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    const images = product.images || ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"];
    
    modal.innerHTML = `
      <div class="bg-white rounded-3xl border border-[#E5E3DF] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col md:grid md:grid-cols-12 transform scale-95 opacity-0 transition-all duration-300" id="qv-modal-card">
        <!-- Close Button -->
        <button id="qv-close-btn" class="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white border border-[#E5E3DF] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white flex items-center justify-center transition-all shadow-md focus:outline-none">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Left Column: Gallery (md:col-span-6) -->
        <div class="p-6 md:col-span-6 flex flex-col space-y-4 border-r border-[#E5E3DF]">
          <!-- Large Main Image Frame -->
          <div class="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-stone-50 relative border border-[#E5E3DF]">
            <img 
              id="qv-main-img" 
              src="${images[0]}" 
              alt="${product.title}" 
              class="w-full h-full object-cover transition-all duration-500"
            />
            
            <!-- Badges overlay -->
            <div class="absolute top-4 left-4 flex flex-col gap-1.5">
              <span class="bg-[#1A1A1A] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                ${product.category}
              </span>
              ${product.badge ? `
                <span class="bg-[#C5A880] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                  ${product.badge}
                </span>
              ` : ''}
            </div>
          </div>

          <!-- Thumbnails Row -->
          ${images.length > 1 ? `
            <div class="flex gap-2.5 overflow-x-auto pb-1.5 no-scrollbar">
              ${images.map((img, idx) => `
                <button 
                  class="qv-thumb-btn w-16 h-20 rounded-lg overflow-hidden border border-[#E5E3DF] focus:outline-none transition-all flex-shrink-0 ${idx === 0 ? 'ring-2 ring-[#C5A880] border-[#C5A880]' : 'hover:border-[#1A1A1A]'}"
                  data-img-src="${img}"
                >
                  <img src="${img}" class="w-full h-full object-cover" />
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Right Column: Details & Selection (md:col-span-6) -->
        <div class="p-6 md:p-8 md:col-span-6 flex flex-col justify-between space-y-6">
          <div class="space-y-4">
            <div>
              <span class="text-[9px] uppercase tracking-[0.25em] text-[#C5A880] font-bold block mb-1">Festive Apparel</span>
              <h2 class="text-2xl font-serif text-[#1A1A1A] leading-tight font-light">${product.title}</h2>
            </div>

            <!-- Pricing Block -->
            <div class="flex items-baseline gap-3">
              <span class="text-xl font-bold text-[#1A1A1A]">₹${product.price.toLocaleString('en-IN')}</span>
              <span class="text-xs text-[#8A8A8A] line-through">₹${product.originalPrice.toLocaleString('en-IN')}</span>
              <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">${discount}% OFF</span>
            </div>

            <hr class="border-[#E5E3DF]" />

            <!-- Description & Fabric Composition -->
            <div class="space-y-3.5 text-xs text-[#5A5A5A] leading-relaxed">
              <p class="font-light">${product.description}</p>
              
              <div class="bg-stone-50 border border-[#E5E3DF] p-3.5 rounded-xl space-y-2">
                <p class="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-[#C5A880]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Fabric & Composition details
                </p>
                <p class="text-[11px] font-light">${product.fabricDetails || "Premium fabric quality guaranteed."}</p>
              </div>
            </div>

            <!-- Dropshipping Fulfillment Box -->
            <div class="bg-amber-50/70 border border-amber-200/50 p-3.5 rounded-xl text-[10px] text-[#7A6030] space-y-1">
              <div class="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <span>⚡ Quick fulfillment info</span>
              </div>
              <p class="leading-relaxed font-medium">Dispatched in 24–48 Hours | Pan-India Delivery in 4–7 Days | Cash on Delivery Available</p>
            </div>

            <!-- Sizes Selection -->
            <div class="space-y-2">
              <div class="flex justify-between items-center text-[10px] uppercase tracking-wider font-semibold text-[#1A1A1A]">
                <span>Select Size</span>
                <span id="qv-selected-size-text" class="text-[#C5A880] normal-case font-normal font-sans">Select a size</span>
              </div>
              
              <div class="flex flex-wrap gap-2" id="qv-size-container">
                ${product.sizes.map((size) => `
                  <button 
                    class="qv-size-chip border border-[#E5E3DF] text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:border-[#1A1A1A]"
                    data-size="${size}"
                  >
                    ${size}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Quantity and CTAs Row -->
          <div class="space-y-4 pt-4 border-t border-[#E5E3DF]">
            <div class="flex items-center justify-between gap-4">
              <!-- Quantity Selector -->
              <div class="flex items-center border border-[#E5E3DF] rounded-xl overflow-hidden h-11 bg-white">
                <button id="qv-qty-dec" class="w-10 h-full flex items-center justify-center hover:bg-stone-50 font-bold focus:outline-none select-none text-stone-600">-</button>
                <span id="qv-qty-val" class="w-10 text-center font-bold text-xs">1</span>
                <button id="qv-qty-inc" class="w-10 h-full flex items-center justify-center hover:bg-stone-50 font-bold focus:outline-none select-none text-stone-600">+</button>
              </div>

              <!-- CTA Add to bag -->
              <button 
                id="qv-add-btn" 
                class="flex-grow py-3 bg-[#1A1A1A] hover:bg-[#C5A880] hover:text-[#1A1A1A] text-white text-xs uppercase tracking-widest font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 h-11 shadow-md focus:outline-none"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Add to Bag</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.classList.add('overflow-hidden');

    // Trigger Animations
    setTimeout(() => {
      modal.classList.remove('opacity-0');
      modal.classList.add('opacity-100');
      const card = document.getElementById('qv-modal-card');
      if (card) {
        card.classList.remove('scale-95', 'opacity-0');
        card.classList.add('scale-100', 'opacity-100');
      }
    }, 50);

    // Modal Events
    const closeBtn = document.getElementById('qv-close-btn');
    const qvMainImg = document.getElementById('qv-main-img');
    const qvThumbBtns = modal.querySelectorAll('.qv-thumb-btn');
    const qvSizeChips = modal.querySelectorAll('.qv-size-chip');
    const selectedSizeText = document.getElementById('qv-selected-size-text');
    const qtyVal = document.getElementById('qv-qty-val');
    const qtyInc = document.getElementById('qv-qty-inc');
    const qtyDec = document.getElementById('qv-qty-dec');
    const qvAddBtn = document.getElementById('qv-add-btn');

    let currentQty = 1;
    let selectedSize = null;

    // Auto-select if there is only 1 size option
    if (product.sizes.length === 1) {
      selectedSize = product.sizes[0];
      const singleChip = modal.querySelector('.qv-size-chip');
      if (singleChip) {
        singleChip.classList.add('bg-[#1A1A1A]', 'text-white', 'border-[#1A1A1A]', 'active');
        if (selectedSizeText) selectedSizeText.innerText = `Selected: ${selectedSize}`;
      }
    }

    function closeModal() {
      const card = document.getElementById('qv-modal-card');
      if (card) {
        card.classList.remove('scale-100', 'opacity-100');
        card.classList.add('scale-95', 'opacity-0');
      }
      modal.classList.remove('opacity-100');
      modal.classList.add('opacity-0');
      
      setTimeout(() => {
        modal.remove();
        document.body.classList.remove('overflow-hidden');
      }, 300);
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Close on Escape Key
    const escListener = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escListener);
      }
    };
    document.addEventListener('keydown', escListener);

    // Gallery Thumbnail selection
    qvThumbBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const src = btn.getAttribute('data-img-src');
        qvMainImg.src = src;

        // Reset ring borders on thumbnails
        qvThumbBtns.forEach(t => t.classList.remove('ring-2', 'ring-[#C5A880]', 'border-[#C5A880]'));
        btn.classList.add('ring-2', 'ring-[#C5A880]', 'border-[#C5A880]');
      });
    });

    // Size Selection
    qvSizeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        qvSizeChips.forEach(c => c.classList.remove('bg-[#1A1A1A]', 'text-white', 'border-[#1A1A1A]', 'active'));
        chip.classList.add('bg-[#1A1A1A]', 'text-white', 'border-[#1A1A1A]', 'active');
        selectedSize = chip.getAttribute('data-size');
        if (selectedSizeText) selectedSizeText.innerText = `Selected: ${selectedSize}`;
      });
    });

    // Quantity Increment/Decrement
    qtyInc.addEventListener('click', () => {
      currentQty++;
      qtyVal.innerText = currentQty;
    });

    qtyDec.addEventListener('click', () => {
      if (currentQty > 1) {
        currentQty--;
        qtyVal.innerText = currentQty;
      }
    });

    // Add To Bag in Modal
    qvAddBtn.addEventListener('click', () => {
      if (!selectedSize) {
        const sizeContainer = document.getElementById('qv-size-container');
        if (sizeContainer) {
          sizeContainer.classList.add('animate-bounce');
          setTimeout(() => sizeContainer.classList.remove('animate-bounce'), 1000);
        }
        alert("Please select a size first!");
        return;
      }

      addToBag(product, selectedSize, currentQty);
      closeModal();
    });
  }

  // --- Filtering & Search Synchronization ---
  
  // 1. Listen for search input changes
  window.addEventListener('fp_search_changed', (e) => {
    searchQuery = e.detail.query || "";
    render();
  });

  // 2. Listen for category changes (Hero strip click, etc)
  window.addEventListener('fp_category_changed', (e) => {
    activeCategory = e.detail.category || "All";
    render();
  });

  // 3. Listen for changes in localStorage product inventory
  window.addEventListener('fp_products_updated', () => {
    products = getProducts();
    render();
  });

  // 4. Listen for Visual Live Edit Mode toggles
  window.addEventListener('fp_edit_mode_toggled', () => {
    render();
  });

  // 5. Handle hash navigation (e.g. Header clicks)
  function handleHashNavigation() {
    const hash = window.location.hash; // e.g. "#women"
    if (hash && hash !== "#admin") {
      const cleanHash = hash.replace("#", "").trim().toLowerCase();
      const categories = ["Women", "Men", "Couple", "Kids", "Elders", "Accessories"];
      const matched = categories.find(c => c.toLowerCase() === cleanHash);
      
      if (matched) {
        activeCategory = matched;
        
        // Update the Hero strip pills to keep in visual sync if they exist
        const heroPills = document.querySelectorAll('#category-strip-container .category-pill');
        heroPills.forEach(pill => {
          const catAttr = pill.getAttribute('data-category');
          if (catAttr && catAttr.toLowerCase() === cleanHash) {
            pill.className = "category-pill px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 border bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md";
          } else {
            pill.className = "category-pill px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 border bg-white/60 text-[#1A1A1A]/80 border-[#E5E3DF] hover:border-[#1A1A1A] hover:bg-white hover:text-[#1A1A1A]";
          }
        });

        // Scroll smoothly to collection area
        const colSection = document.getElementById("collection");
        if (colSection) {
          colSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else if (!hash) {
      activeCategory = "All";
      
      const heroPills = document.querySelectorAll('#category-strip-container .category-pill');
      heroPills.forEach(pill => {
        const catAttr = pill.getAttribute('data-category');
        if (catAttr === 'All Festive') {
          pill.className = "category-pill px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 border bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md";
        } else {
          pill.className = "category-pill px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 border bg-white/60 text-[#1A1A1A]/80 border-[#E5E3DF] hover:border-[#1A1A1A] hover:bg-white hover:text-[#1A1A1A]";
        }
      });
    }

    render();
  }

  // Subscribe to real-time Cloud Firestore catalog sync with default seeding
  subscribeToProducts((cloudProducts) => {
    products = cloudProducts;
    render();
  }, DEFAULT_PRODUCTS);

  // Initial Render & Hash Check
  handleHashNavigation();
}
