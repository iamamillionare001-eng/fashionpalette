/**
 * PRODUCT CARDS & IMAGE GALLERY
 * Handles the display, filtering, search synchronization, and quick-view modal
 * for the luxury product catalog.
 */

// Curated dropshipping apparel catalog for Ganesh Chaturthi and Festive 2026
const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
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

// Helper to retrieve catalog from localStorage
export function getProducts() {
  const cached = localStorage.getItem("fp_products_data");
  if (cached) {
    try {
      return JSON.parse(cached);
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
              Step 4 Dropshipping Catalog &bull; Premium Indian Festive Apparel
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
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              ${filteredProducts.map(product => {
                const discount = product.discountPercentage || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
                const hasMultipleImages = product.images && product.images.length > 0;
                const mainImage = hasMultipleImages ? product.images[0] : "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80";
                
                return `
                  <div class="group bg-white rounded-2xl border border-[#E5E3DF] p-3 sm:p-4 hover:shadow-md transition-all duration-300 flex flex-col justify-between" data-product-id="${product.id}">
                    <!-- Image Frame -->
                    <div class="aspect-[3/4] w-full bg-stone-100 relative rounded-xl overflow-hidden group/img">
                      <img 
                        src="${mainImage}" 
                        alt="${product.title}" 
                        class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-105"
                      />
                      
                      <!-- Top Left Badges -->
                      <div class="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
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
                      ${product.inStock ? `
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
                          ${product.sizes.map((size, idx) => `
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
    const cards = container.querySelectorAll('[data-product-id]');
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

      // 2. Add To Bag (Card Quick Action)
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
            // Shake the size container to notify user
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
                ${product.sizes.map((size, idx) => `
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

  // 4. Handle hash navigation (e.g. Header clicks)
  function handleHashNavigation() {
    const hash = window.location.hash; // e.g. "#women"
    if (hash && hash !== "#admin") {
      // Decode the hash to match categories
      const cleanHash = hash.replace("#", "").trim().toLowerCase();
      // Capitalize first letter (e.g. women -> Women, couple -> Couple)
      const formatted = cleanHash.charAt(0).toUpperCase() + cleanHash.slice(1);
      
      // Check if it's a valid category
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
      
      // Update Hero pills to default active (All Festive)
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

  window.addEventListener('hashchange', handleHashNavigation);

  // Initial Render & Hash Check
  handleHashNavigation();
}
