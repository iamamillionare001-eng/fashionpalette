/**
 * PRODUCT CARDS & IMAGE GALLERY
 * Step 14: Multi-Image Quick Editor, Admin Inventory Filters/Edit Triggers,
 * Featured Section Renaming & Full Review Drawer.
 */

import { 
  subscribeToProducts, 
  saveProductToCloud, 
  updateProductStockInCloud, 
  deleteProductFromCloud, 
  updateProductsSortOrderInCloud,
  uploadToImgBB 
} from '../07-STORE_SETTINGS_AND_THEME_COLORS/firebase_sync.js';
import { openImageCropperStudio, calculatePsychologicalPricing, openImageLightbox } from '../05-ADMIN_CONTROL_PANEL_AND_PRODUCTS/image_studio.js';

// Curated dropshipping apparel catalog for Ganesh Chaturthi and Festive 2026
const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    sortOrder: 0,
    featured: true,
    cod_available: true,
    is_combo: false,
    supplier_links: {
      top: "https://www.meesho.com/s/p/royal-chanderi-silk-saree",
      bottom: ""
    },
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
    ],
    reviews: [
      {
        id: "rev-101",
        name: "Priya Sharma",
        location: "Mumbai, MH",
        rating: 5,
        date: "Sep 2, 2026",
        verified: true,
        comment: "The Chanderi Silk Saree exceeded my expectations! The zari border is stunning and the drape is so lightweight and royal. Arrived in just 3 days."
      },
      {
        id: "rev-102",
        name: "Meera K.",
        location: "Bengaluru, KA",
        rating: 5,
        date: "Aug 29, 2026",
        verified: true,
        comment: "Authentic silk texture, gorgeous festive color. Packaging was immaculate with protective cover."
      }
    ]
  },
  {
    id: "prod-2",
    sortOrder: 1,
    featured: true,
    cod_available: true,
    is_combo: false,
    supplier_links: {
      top: "https://www.meesho.com/s/p/embroidered-silk-kurta",
      bottom: "https://www.meesho.com/s/p/mens-churidar"
    },
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
    ],
    reviews: [
      {
        id: "rev-201",
        name: "Rahul Mehta",
        location: "Pune, MH",
        rating: 5,
        date: "Sep 1, 2026",
        verified: true,
        comment: "Exceptional stitching and luxury fit. The collar embroidery is subtle and classy. Super comfortable for all-day puja."
      }
    ]
  },
  {
    id: "prod-3",
    sortOrder: 2,
    featured: true,
    cod_available: false,
    is_combo: true,
    supplier_links: {
      male_top: "https://www.meesho.com/s/p/mens-silk-kurta-maroon",
      male_bottom: "https://www.meesho.com/s/p/mens-silk-pyjama",
      female_top: "https://www.meesho.com/s/p/womens-maroon-silk-saree",
      female_bottom: ""
    },
    title: "Twinned Royal Maroon Silk Couple Festive Set",
    category: "Couple",
    price: 4299,
    originalPrice: 7999,
    discountPercentage: 46,
    badge: "Matching Duo",
    description: "Celebrate together in style with our matching festive sets. Features a coordinated maroon silk saree for her and a matching embroidered silk kurta set for him, crafted to perfection.",
    fabricDetails: "Saree: Chanderi Silk | Kurta: Art Silk. Dry clean recommended.",
    sizes: ["Custom 4-Piece Combo"],
    combo_sizes: {
      men_top: ["M", "L", "XL", "2XL"],
      men_bottom: ["30", "32", "34", "36", "L", "XL"],
      women_top: ["XS", "S", "M", "L", "XL", "Free Size"],
      women_bottom: ["XS", "S", "M", "L", "XL", "Free Size"]
    },
    inStock: true,
    images: [
      "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      {
        id: "rev-301",
        name: "Ananya & Dev K.",
        location: "Delhi NCR",
        rating: 5,
        date: "Aug 31, 2026",
        verified: true,
        comment: "Ordered the couple matching set for our family celebration. The colors were 100% identical and we received endless compliments!"
      }
    ]
  },
  {
    id: "prod-4",
    sortOrder: 3,
    featured: false,
    cod_available: true,
    is_combo: false,
    supplier_links: {
      top: "https://www.meesho.com/s/p/boys-handloom-kurta",
      bottom: "https://www.meesho.com/s/p/boys-pre-stitched-dhoti"
    },
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
    ],
    reviews: [
      {
        id: "rev-401",
        name: "Shweta Joshi",
        location: "Ahmedabad, GJ",
        rating: 5,
        date: "Aug 28, 2026",
        verified: true,
        comment: "Soft breathable handloom cotton. The pre-stitched dhoti is effortless for kids to wear without fuss."
      }
    ]
  },
  {
    id: "prod-5",
    sortOrder: 4,
    featured: false,
    cod_available: false,
    is_combo: false,
    supplier_links: {
      top: "https://www.meesho.com/s/p/organic-cotton-kurta",
      bottom: ""
    },
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
    ],
    reviews: [
      {
        id: "rev-501",
        name: "Rameshwar Patel",
        location: "Surat, GJ",
        rating: 5,
        date: "Aug 25, 2026",
        verified: true,
        comment: "Very soft pure cotton. The fit is relaxed and comfortable for all-day prayers and festivities."
      }
    ]
  }
];

// Helper to check if visual live edit mode is active and authenticated
export function isLiveEditActive() {
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

  let activeCategory = "Featured";
  let searchQuery = "";
  let products = getProducts();

  // Primary rendering method
  function render() {
    const editMode = isLiveEditActive();

    // Filter logic with Featured Fallback
    const catLower = activeCategory.toLowerCase();
    const queryLower = searchQuery.toLowerCase().trim();

    // Determine category matching products
    let categoryFiltered = [];
    if (catLower === "featured") {
      const featuredList = products.filter(p => p.featured === true);
      // Graceful fallback: If no products are explicitly flagged as featured, show all products
      categoryFiltered = featuredList.length > 0 ? featuredList : products;
    } else if (catLower === "all" || catLower === "all festive") {
      categoryFiltered = products;
    } else {
      categoryFiltered = products.filter(p => (p.category && p.category.toLowerCase() === catLower));
    }

    // Apply live search filtering
    const filteredProducts = categoryFiltered.filter(p => {
      if (!queryLower) return true;
      return (p.title && p.title.toLowerCase().includes(queryLower)) || 
             (p.category && p.category.toLowerCase().includes(queryLower)) ||
             (p.description && p.description.toLowerCase().includes(queryLower));
    });

    container.innerHTML = `
      <section id="collection" class="py-20 border-t border-[#E5E3DF] bg-[#F9F8F6]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <!-- Section Header -->
          <div class="text-center max-w-xl mx-auto mb-16 space-y-4">
            <span class="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-semibold block">Curated Selection</span>
            <h2 class="text-3xl sm:text-4xl font-serif font-light tracking-tight text-[#1A1A1A]">
              ${activeCategory === 'Featured' ? 'Featured Masterpieces' : `${activeCategory} Collection`}
            </h2>
            <div class="h-[1.5px] w-12 bg-[#C5A880] mx-auto mt-4"></div>
            <p class="text-xs text-[#5A5A5A] uppercase tracking-widest font-light leading-relaxed">
              ${editMode 
                ? `<span class="text-amber-700 font-semibold">🛠️ Visual Live Edit Active: Drag cards to reorder &bull; Use on-card buttons to edit, toggle stock or delete</span>`
                : `Haute Couture & Festive Apparel &bull; 100% Authentic Handcrafted Quality`}
            </p>
          </div>

          <!-- Product Grid Layout (2 cols mobile, 3 to 4 cols desktop) -->
          ${filteredProducts.length === 0 ? `
            <div class="text-center py-20 bg-white rounded-2xl border border-[#E5E3DF] shadow-xs">
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
                const mainImage = hasMultipleImages ? product.images[0] : (product.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80");
                const isFeatured = product.featured === true;
                const reviewCount = (product.reviews && product.reviews.length) || 0;
                
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
                        <!-- Featured Toggle in Edit Mode -->
                        <button 
                          type="button" 
                          class="card-featured-toggle-btn w-7 h-7 rounded-full flex items-center justify-center transition-all ${isFeatured ? 'text-amber-400 hover:bg-amber-500/20' : 'text-stone-400 hover:bg-stone-700'}"
                          data-action-id="${product.id}"
                          title="${isFeatured ? 'Featured Product (Click to unfeature)' : 'Mark as Featured'}"
                        >
                          <span class="text-xs">${isFeatured ? '⭐' : '☆'}</span>
                        </button>

                        <!-- Stock Toggle -->
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

                        <!-- Quick Edit Modal -->
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

                        <!-- Delete -->
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
                    <div class="aspect-[3/4] w-full bg-stone-100 relative rounded-xl overflow-hidden group/img cursor-pointer preview-card-trigger">
                      <img 
                        src="${mainImage}" 
                        alt="${product.title}" 
                        class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-105"
                      />
                      
                      <!-- Non-Obstructive Bottom-Left Micro-Pill Badges (Keeping model faces completely clear) -->
                      <div class="absolute bottom-2.5 left-2.5 flex flex-wrap items-center gap-[4px] z-10 pointer-events-none max-w-[85%] transition-all">
                        <span style="background: rgba(18, 16, 14, 0.7); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); color: #E5D5BA; border: 1px solid rgba(229, 213, 186, 0.35); font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; padding: 4px 10px; border-radius: 9999px; font-weight: 500; line-height: 1;">
                          ${product.category}
                        </span>
                        ${isFeatured ? `
                          <span style="background: rgba(18, 16, 14, 0.7); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); color: #E5D5BA; border: 1px solid rgba(229, 213, 186, 0.35); font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; padding: 4px 10px; border-radius: 9999px; font-weight: 500; line-height: 1; display: inline-flex; align-items: center; gap: 3px;">
                            ⭐ Featured
                          </span>
                        ` : ''}
                        ${product.badge && product.badge !== 'Featured' ? `
                          <span style="background: rgba(18, 16, 14, 0.7); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); color: #E5D5BA; border: 1px solid rgba(229, 213, 186, 0.35); font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; padding: 4px 10px; border-radius: 9999px; font-weight: 500; line-height: 1;">
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
                          title="Open Product Drawer"
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
                        <div class="flex items-center justify-between text-[10px] text-[#8A8A8A]">
                          <span class="text-amber-500 font-semibold flex items-center gap-0.5">
                            ★ 4.9 <span class="text-[#8A8A8A] font-normal">(${reviewCount > 0 ? reviewCount : '12'})</span>
                          </span>
                        </div>
                        <h3 class="text-xs sm:text-sm font-medium text-[#1A1A1A] line-clamp-1 group-hover:text-[#C5A880] transition-colors cursor-pointer preview-card-trigger">${product.title}</h3>
                        
                        <!-- Pricing Display -->
                        <div class="flex items-center gap-2 flex-wrap pt-0.5">
                          <span class="text-sm font-bold text-[#1A1A1A]">₹${product.price.toLocaleString('en-IN')}</span>
                          <span class="text-[10px] text-[#8A8A8A] line-through">₹${product.originalPrice.toLocaleString('en-IN')}</span>
                          <span class="text-[9px] font-semibold text-emerald-600 uppercase">${discount}% OFF</span>
                        </div>
                      </div>

                      <!-- Size Selector inside Card -->
                      <div class="mt-2.5 sm:mt-3.5 space-y-1">
                        ${(product.is_combo || product.category === "Couple" || Boolean(product.combo_sizes)) ? `
                          <div class="flex items-center justify-between">
                            <p class="text-[8px] uppercase tracking-widest text-[#8A8A8A] font-semibold">4-Piece Sizing</p>
                            <span class="text-[7.5px] uppercase font-bold text-[#C5A880] tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 border border-[#C5A880]/30">Twin Combo</span>
                          </div>
                          <button 
                            type="button" 
                            class="quick-view-btn w-full py-1.5 px-2 bg-stone-50 hover:bg-[#C5A880]/10 border border-[#E5E3DF] hover:border-[#C5A880] rounded-lg text-[9px] font-semibold text-[#1A1A1A] flex items-center justify-between transition-all cursor-pointer"
                            title="Open Granular 4-Piece Sizing Selector"
                          >
                            <span class="flex items-center gap-1 truncate">
                              <span>👨 Men &amp; 👩 Women</span>
                            </span>
                            <span class="text-[#C5A880] font-bold shrink-0">Select ↗</span>
                          </button>
                        ` : `
                          <p class="text-[8px] uppercase tracking-widest text-[#8A8A8A] font-semibold">Select Size</p>
                          <div class="flex flex-nowrap sm:flex-wrap overflow-x-auto no-scrollbar gap-1 size-selector-container py-0.5 max-w-full">
                            ${(product.sizes || []).map((size) => `
                              <button 
                                class="size-pill flex-shrink-0 border border-[#E5E3DF] text-[8px] sm:text-[9px] uppercase font-medium px-2 py-1 rounded-md transition-all hover:border-[#1A1A1A] active:scale-95"
                                data-size="${size}"
                              >
                                ${size}
                              </button>
                            `).join('')}
                          </div>
                        `}
                      </div>

                      <!-- Actions Row: Add to Bag (Charcoal + Champagne) & Circular Eye Preview -->
                      <div class="mt-3 sm:mt-4 flex items-center gap-1.5 sm:gap-2">
                        ${editMode ? `
                          <!-- Direct Quick Edit CTA in Edit Mode -->
                          <button 
                            class="card-quick-edit-btn flex-grow py-2 sm:py-2.5 bg-amber-500/10 hover:bg-[#C5A880] text-[#1A1A1A] hover:text-white border border-[#C5A880] text-[9px] sm:text-[10px] uppercase tracking-widest font-bold rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-1.5 focus:outline-none shadow-xs"
                            data-action-id="${product.id}"
                          >
                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            <span>Quick Edit</span>
                          </button>
                        ` : `
                          <button 
                            class="add-to-bag-btn flex-grow py-2 sm:py-2.5 bg-[#181513] hover:bg-[#C5A880] text-[#E5D5BA] hover:text-[#181513] text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-1 sm:gap-1.5 focus:outline-none shadow-xs active:scale-[0.98]"
                            ${!product.inStock ? 'disabled' : ''}
                          >
                            <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span class="truncate">Add to Bag</span>
                          </button>
                          
                          <button 
                            class="quick-view-btn w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 rounded-full border border-[#DDD5C9] text-[#181513] hover:bg-[#F8F5F0] hover:border-[#181513] flex items-center justify-center transition-all duration-300 focus:outline-none shadow-2xs active:scale-95"
                            title="Quick View Product Details"
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
          sizePills.forEach(p => {
            p.classList.remove('bg-[#1A1A1A]', 'text-white', 'border-[#1A1A1A]');
            p.classList.add('border-[#E5E3DF]');
          });
          pill.classList.remove('border-[#E5E3DF]');
          pill.classList.add('bg-[#1A1A1A]', 'text-white', 'border-[#1A1A1A]', 'active');
        });
      });

      // 2. Add To Bag (Card Quick Action when not in Edit Mode)
      const addToBagBtn = card.querySelector('.add-to-bag-btn');
      if (addToBagBtn) {
        addToBagBtn.addEventListener('click', (e) => {
          e.stopPropagation();

          // If Twin Combo, open the preview modal directly so user can pick all 4 pieces
          if (product.is_combo === true || product.category === "Couple" || Boolean(product.combo_sizes)) {
            showQuickViewModal(product);
            return;
          }

          const activePill = card.querySelector('.size-pill.active');
          let selectedSize = activePill ? activePill.dataset.size : null;

          if (!selectedSize && product.sizes && product.sizes.length === 1) {
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

      // 3. Quick View Trigger / Drawer Trigger
      const qvOverlay = card.querySelector('.quick-view-overlay-btn');
      const qvBtn = card.querySelector('.quick-view-btn');
      const cardTriggers = card.querySelectorAll('.preview-card-trigger');
      
      const openModal = (e) => {
        e.stopPropagation();
        showQuickViewModal(product);
      };

      if (qvOverlay) qvOverlay.addEventListener('click', openModal);
      if (qvBtn) qvBtn.addEventListener('click', openModal);
      cardTriggers.forEach(el => {
        if (!editMode) {
          el.addEventListener('click', openModal);
        }
      });
    });

    // 4. On-Card Admin Actions (Stock Toggle, Featured Toggle, Quick Edit, Delete)
    if (editMode) {
      // Featured toggle
      container.querySelectorAll('.card-featured-toggle-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-action-id');
          const prod = products.find(p => p.id === id);
          if (prod) {
            prod.featured = !prod.featured;
            await saveProductToCloud(prod);
            render();
          }
        });
      });

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
            showQuickEditModal(prod, () => {
              products = getProducts();
              render();
            });
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

          const [movedProduct] = products.splice(draggedIndex, 1);
          products.splice(targetIndex, 0, movedProduct);

          products.forEach((p, idx) => {
            p.sortOrder = idx;
          });

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
    const mainImg = (product.images && product.images.length > 0) ? product.images[0] : (product.image || "");
    const isCombo = product.is_combo === true || product.category === "Couple";
    const supplier_links = product.supplier_links || {};

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
      cart[existingIndex].cod_available = product.cod_available === true;
      cart[existingIndex].is_combo = isCombo;
      cart[existingIndex].supplier_links = supplier_links;
    } else {
      cart.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        size: size,
        quantity: quantity,
        image: mainImg,
        cod_available: product.cod_available === true,
        is_combo: isCombo,
        supplier_links: supplier_links
      });
    }

    localStorage.setItem('fp_cart', JSON.stringify(cart));
    
    // Dispatch global event for header and checkouts to sync
    window.dispatchEvent(new CustomEvent('fp_cart_updated'));
    window.dispatchEvent(new CustomEvent('fp_open_cart'));
  }

  // --- Filtering & Search Synchronization ---
  
  // 1. Listen for search input changes
  window.addEventListener('fp_search_changed', (e) => {
    searchQuery = e.detail.query || "";
    render();
  });

  // 2. Listen for category changes (Hero strip click, etc)
  window.addEventListener('fp_category_changed', (e) => {
    activeCategory = e.detail.category || "Featured";
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
    const hash = window.location.hash;
    if (hash && hash !== "#admin") {
      const cleanHash = hash.replace("#", "").trim().toLowerCase();
      const categories = ["Women", "Men", "Couple", "Kids", "Elders", "Accessories"];
      const matched = categories.find(c => c.toLowerCase() === cleanHash);
      
      if (matched) {
        activeCategory = matched;
        
        const heroPills = document.querySelectorAll('#category-strip-container .category-pill');
        heroPills.forEach(pill => {
          const catAttr = pill.getAttribute('data-category');
          if (catAttr && catAttr.toLowerCase() === cleanHash) {
            pill.className = "category-pill px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 border bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md";
          } else {
            pill.className = "category-pill px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 border bg-white/60 text-[#1A1A1A]/80 border-[#E5E3DF] hover:border-[#1A1A1A] hover:bg-white hover:text-[#1A1A1A]";
          }
        });

        const colSection = document.getElementById("collection");
        if (colSection) {
          colSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else if (!hash) {
      activeCategory = "Featured";
      
      const heroPills = document.querySelectorAll('#category-strip-container .category-pill');
      heroPills.forEach(pill => {
        const catAttr = pill.getAttribute('data-category');
        if (catAttr === 'Featured') {
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

/**
 * QUICK EDIT MODAL (MULTI-IMAGE GALLERY UPLOADER & CLOUD SYNC)
 * Exported so both Visual Live Edit Mode and the Admin Control Panel can invoke it.
 */
export function showQuickEditModal(product, onSaveCallback) {
  const existingModal = document.getElementById('quick-edit-modal');
  if (existingModal) existingModal.remove();

  const modal = document.createElement('div');
  modal.id = 'quick-edit-modal';
  modal.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-[#1A1A1A]/80 backdrop-blur-md p-4 transition-all duration-300 opacity-0 overflow-y-auto';

  const defaultApparelSizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "Free Size"];
  const defaultMenTopSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
  const defaultMenBottomSizes = ["28", "30", "32", "34", "36", "38", "S", "M", "L", "XL"];
  const defaultWomenTopSizes = ["XS", "S", "M", "L", "XL", "2XL", "Free Size"];
  const defaultWomenBottomSizes = ["XS", "S", "M", "L", "XL", "2XL", "Free Size"];

  const modalSelectedSizes = new Set(product.sizes || ["Free Size"]);
  const modalCustomSizes = (product.sizes || []).filter(s => !defaultApparelSizes.includes(s));

  const existingCombo = product.combo_sizes || {};
  const modalComboSizes = {
    men_top: new Set((existingCombo.men_top && existingCombo.men_top.length > 0) ? existingCombo.men_top : ["M", "L", "XL"]),
    men_bottom: new Set((existingCombo.men_bottom && existingCombo.men_bottom.length > 0) ? existingCombo.men_bottom : ["30", "32", "34", "36"]),
    women_top: new Set((existingCombo.women_top && existingCombo.women_top.length > 0) ? existingCombo.women_top : ["S", "M", "L", "XL"]),
    women_bottom: new Set((existingCombo.women_bottom && existingCombo.women_bottom.length > 0) ? existingCombo.women_bottom : ["S", "M", "L", "XL", "Free Size"])
  };

  // Initialize media state
  const rawImages = (product.images && product.images.length > 0) 
    ? [...product.images] 
    : (product.image ? [product.image] : ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"]);

  const rawLinks = product.supplier_links || {};
  let isComboChoice = (product.is_combo === true) || (product.category === "Couple") || Boolean(rawLinks.male_top || rawLinks.female_top);

  let mainImageChoice = rawImages[0];
  let galleryImages = rawImages.slice(1);
  let mainImageMode = "keep"; // "keep" | "upload" | "url"
  let uploadedModalMainImage = "";
  let isFeaturedChoice = product.featured === true;
  let isCodAvailableChoice = product.cod_available === true;

  modal.innerHTML = `
    <div class="bg-white rounded-3xl border border-[#E5E3DF] max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative p-6 sm:p-8 transform scale-95 opacity-0 transition-all duration-300 space-y-6" id="qe-modal-card">
      
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
            <p class="text-[9px] uppercase tracking-wider text-[#C5A880] font-sans font-semibold">Storefront & Admin Live Editor &bull; ID: ${product.id}</p>
          </div>
        </div>
        
        <button id="qe-close-btn" class="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-[#1A1A1A] flex items-center justify-center transition-all focus:outline-none" title="Close">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Edit Form -->
      <form id="quick-edit-form" class="space-y-5" onsubmit="event.preventDefault();">
        <!-- Title -->
        <div>
          <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Product Title</label>
          <input type="text" id="qe-title" required value="${(product.title || '').replace(/"/g, '&quot;')}" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
        </div>

        <!-- Category & Badge & Featured Toggle -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Badge (e.g. Bestseller)</label>
            <input type="text" id="qe-badge" value="${(product.badge || '').replace(/"/g, '&quot;')}" placeholder="e.g. Bestseller" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
          </div>
          <div>
            <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Featured ⭐ Section</label>
            <button type="button" id="qe-featured-toggle-btn" class="w-full py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              isFeaturedChoice ? 'bg-amber-50 text-amber-900 border-amber-300' : 'bg-[#F9F8F6] text-[#5A5A5A] border-[#E5E3DF]'
            }">
              <span>${isFeaturedChoice ? '⭐ Flagged Featured' : '☆ Not Featured'}</span>
            </button>
          </div>
        </div>

        <!-- COD Availability Toggle Option -->
        <div class="p-3.5 bg-[#F9F8F6] border border-[#E5E3DF] rounded-xl flex items-center justify-between">
          <div>
            <label class="block text-[10px] uppercase tracking-wider text-[#1A1A1A] font-bold">Cash on Delivery (COD)</label>
            <p class="text-[9px] text-[#8A8A8A]">Enable doorstep cash payment for this specific product</p>
          </div>
          <button type="button" id="qe-cod-toggle-btn" class="px-3.5 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${
            isCodAvailableChoice ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-white text-stone-500 border-stone-300'
          }">
            ${isCodAvailableChoice ? '✓ COD Enabled' : '✕ Prepaid Only'}
          </button>
        </div>

        <!-- ============================================================== -->
        <!-- STRUCTURED SUPPLIER LINKS (DROPSHIP FULFILLMENT) -->
        <!-- ============================================================== -->
        <div class="p-4 bg-[#F9F8F6] border border-[#E5E3DF] rounded-2xl space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E3DF]/70 pb-2">
            <div>
              <label class="block text-[9px] uppercase tracking-wider text-[#1A1A1A] font-bold">Structured Supplier Links</label>
              <p class="text-[8px] text-[#8A8A8A]">Attached to customer orders at checkout for 1-click supplier fulfillment</p>
            </div>
            <div class="flex items-center gap-3">
              <label class="flex items-center gap-1.5 text-xs font-semibold text-[#1A1A1A] cursor-pointer select-none">
                <input type="radio" name="qe-supplier-type" id="qe-type-single" value="single" ${!isComboChoice ? 'checked' : ''} class="accent-[#1A1A1A] cursor-pointer" />
                <span class="text-[10px]">Individual Item</span>
              </label>
              <label class="flex items-center gap-1.5 text-xs font-semibold text-[#1A1A1A] cursor-pointer select-none">
                <input type="radio" name="qe-supplier-type" id="qe-type-twin" value="twin" ${isComboChoice ? 'checked' : ''} class="accent-[#1A1A1A] cursor-pointer" />
                <span class="text-[10px]">Twin Combo</span>
              </label>
            </div>
          </div>

          <!-- Dynamic Supplier Link Inputs Container -->
          <div id="qe-supplier-links-container">
            <!-- Individual Item (2 fields: Top & Bottom) -->
            <div id="qe-supplier-single-fields" class="${isComboChoice ? 'hidden' : ''} grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[8px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1">Supplier Top Link</label>
                <input type="url" id="qe-supplier-top" placeholder="https://meesho.com/top-kurta/..." value="${(rawLinks.top || '').replace(/"/g, '&quot;')}" class="w-full bg-white border border-[#E5E3DF] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
              </div>
              <div>
                <label class="block text-[8px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1">Supplier Bottom Link</label>
                <input type="url" id="qe-supplier-bottom" placeholder="https://meesho.com/bottom-pant/..." value="${(rawLinks.bottom || '').replace(/"/g, '&quot;')}" class="w-full bg-white border border-[#E5E3DF] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
              </div>
            </div>

            <!-- Twin Combo (4 fields: Male Top, Male Bottom, Female Top, Female Bottom) -->
            <div id="qe-supplier-twin-fields" class="${!isComboChoice ? 'hidden' : ''} grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[8px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1">Supplier Male Top Link</label>
                <input type="url" id="qe-supplier-male-top" placeholder="https://meesho.com/mens-kurta/..." value="${(rawLinks.male_top || '').replace(/"/g, '&quot;')}" class="w-full bg-white border border-[#E5E3DF] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
              </div>
              <div>
                <label class="block text-[8px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1">Supplier Male Bottom Link</label>
                <input type="url" id="qe-supplier-male-bottom" placeholder="https://meesho.com/mens-pyjama/..." value="${(rawLinks.male_bottom || '').replace(/"/g, '&quot;')}" class="w-full bg-white border border-[#E5E3DF] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
              </div>
              <div>
                <label class="block text-[8px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1">Supplier Female Top Link</label>
                <input type="url" id="qe-supplier-female-top" placeholder="https://meesho.com/womens-saree/..." value="${(rawLinks.female_top || '').replace(/"/g, '&quot;')}" class="w-full bg-white border border-[#E5E3DF] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
              </div>
              <div>
                <label class="block text-[8px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1">Supplier Female Bottom Link</label>
                <input type="url" id="qe-supplier-female-bottom" placeholder="https://meesho.com/womens-skirt/..." value="${(rawLinks.female_bottom || '').replace(/"/g, '&quot;')}" class="w-full bg-white border border-[#E5E3DF] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
              </div>
            </div>
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- AUTOMATED PRICING ENGINE WITH RTO & DELIVERY BUFFER -->
        <!-- ============================================================== -->
        <div class="p-4 bg-[#F9F8F6] border border-[#E5E3DF] rounded-2xl space-y-3">
          <div class="flex items-center justify-between">
            <label class="block text-[9px] uppercase tracking-wider text-[#1A1A1A] font-bold">Automated Pricing Engine</label>
            <span class="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              RTO &amp; Buffer Shield
            </span>
          </div>

          <div class="grid grid-cols-3 gap-2.5">
            <div>
              <label class="block text-[8px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1">Supplier Cost (₹)</label>
              <input type="number" id="qe-supplier-cost" placeholder="e.g. 273" value="${product.supplierCost || ''}" min="0" class="w-full bg-white border border-[#E5E3DF] px-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880] font-bold text-[#1A1A1A]" />
            </div>
            <div>
              <label class="block text-[8px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1">Target Profit (₹)</label>
              <input type="number" id="qe-target-profit" value="${product.targetProfit !== undefined ? product.targetProfit : 200}" min="0" class="w-full bg-white border border-[#E5E3DF] px-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880] font-bold text-[#1A1A1A]" />
            </div>
            <div>
              <label class="block text-[8px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1">RTO Buffer (₹)</label>
              <input type="number" id="qe-rto-buffer" value="${product.rtoBuffer !== undefined ? product.rtoBuffer : 100}" min="0" class="w-full bg-white border border-[#E5E3DF] px-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880] font-bold text-[#1A1A1A]" />
            </div>
          </div>

          <!-- Customer-Facing Selling Price & Strike-through MRP -->
          <div class="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label class="block text-[8px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1">Customer Selling Price (₹)</label>
              <input type="number" id="qe-price" required value="${product.price}" min="0" class="w-full min-h-[44px] bg-white border-2 border-[#1A1A1A] px-3 py-2.5 text-sm font-bold rounded-xl focus:outline-none focus:border-[#C5A880] text-[#1A1A1A]" />
            </div>
            <div>
              <label class="block text-[8px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1">Strike-through MRP (₹)</label>
              <input type="number" id="qe-mrp" required value="${product.originalPrice}" min="0" class="w-full min-h-[44px] bg-white border border-[#E5E3DF] px-3 py-2.5 text-sm font-semibold rounded-xl focus:outline-none focus:border-[#C5A880] text-[#8A8A8A]" />
            </div>
          </div>

          <!-- Live Auto Net Margin Display -->
          <div class="p-2.5 bg-white border border-emerald-200/80 rounded-xl flex items-center justify-between text-[9px]">
            <div class="flex items-center gap-1.5 text-emerald-800 font-bold">
              <span>🛡️</span>
              <span id="qe-pricing-net-display">Net Profit: ₹${product.targetProfit || 200} (Protected from RTO)</span>
            </div>
            <span id="qe-pricing-disc-display" class="text-stone-500 font-semibold uppercase">
              ~${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) || 50}% OFF MRP
            </span>
          </div>
        </div>

        <!-- Sizing Section (Dynamic Dual Matrices: Individual vs Twin Combo) -->
        <div class="space-y-3 border-t border-[#E5E3DF]/60 pt-3">
          
          <!-- 1. Individual Sizes Section -->
          <div id="qe-single-sizes-section" class="${isComboChoice ? 'hidden' : ''} space-y-2">
            <div class="flex items-center justify-between">
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold">Standard Sizing Matrix (Select Active Tags)</label>
              <span class="text-[8px] font-semibold text-stone-400 uppercase tracking-wider">Individual Format</span>
            </div>
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

          <!-- 2. Granular 4-Piece Twin Combo Sizing Section -->
          <div id="qe-combo-sizes-section" class="${!isComboChoice ? 'hidden' : ''} space-y-3.5 p-4 bg-stone-50 border border-[#C5A880]/40 rounded-2xl">
            <div class="flex items-center justify-between border-b border-[#E5E3DF] pb-2">
              <div class="flex items-center gap-2">
                <span class="text-xs">👯</span>
                <h5 class="text-[10px] uppercase font-bold text-[#1A1A1A] tracking-wider">Granular 4-Piece Sizing Matrix</h5>
              </div>
              <span class="text-[8px] font-bold uppercase tracking-wider text-[#C5A880] bg-[#C5A880]/15 px-2.5 py-1 rounded-full border border-[#C5A880]/30">
                Twin Combo Active
              </span>
            </div>

            <!-- 1. Men's Top Sizes -->
            <div class="space-y-1.5">
              <p class="text-[9px] uppercase tracking-wider font-bold text-[#1A1A1A] flex items-center gap-1.5">
                <span>👨</span> 1. Men's Top Sizes (Kurtas / Shirts)
              </p>
              <div class="flex flex-wrap gap-1.5" id="qe-combo-men-top"></div>
            </div>

            <!-- 2. Men's Bottom Sizes -->
            <div class="space-y-1.5 border-t border-[#E5E3DF]/50 pt-2.5">
              <p class="text-[9px] uppercase tracking-wider font-bold text-[#1A1A1A] flex items-center gap-1.5">
                <span>👨</span> 2. Men's Bottom Sizes (Pyjamas / Pants / Dhotis)
              </p>
              <div class="flex flex-wrap gap-1.5" id="qe-combo-men-bottom"></div>
            </div>

            <!-- 3. Women's Top Sizes -->
            <div class="space-y-1.5 border-t border-[#E5E3DF]/50 pt-2.5">
              <p class="text-[9px] uppercase tracking-wider font-bold text-[#1A1A1A] flex items-center gap-1.5">
                <span>👩</span> 3. Women's Top Sizes (Kurtis / Blouses / Tops)
              </p>
              <div class="flex flex-wrap gap-1.5" id="qe-combo-women-top"></div>
            </div>

            <!-- 4. Women's Bottom Sizes -->
            <div class="space-y-1.5 border-t border-[#E5E3DF]/50 pt-2.5">
              <p class="text-[9px] uppercase tracking-wider font-bold text-[#1A1A1A] flex items-center gap-1.5">
                <span>👩</span> 4. Women's Bottom Sizes (Skirts / Pants / Sarees)
              </p>
              <div class="flex flex-wrap gap-1.5" id="qe-combo-women-bottom"></div>
            </div>
          </div>

        </div>

        <!-- ============================================================== -->
        <!-- SECTION A: MAIN COVER IMAGE -->
        <!-- ============================================================== -->
        <div class="space-y-2.5 border-t border-[#E5E3DF]/60 pt-3">
          <div class="flex items-center justify-between">
            <label class="block text-[9px] uppercase tracking-wider text-[#1A1A1A] font-bold">Section A &bull; Primary Catalog Cover Image</label>
            <span class="text-[8px] text-[#C5A880] uppercase font-bold">✂️ Interactive Studio</span>
          </div>
          
          <div class="flex items-start gap-3 bg-[#F9F8F6] p-3 rounded-2xl border border-[#E5E3DF]">
            <div class="w-16 h-22 rounded-xl overflow-hidden border-2 border-[#C5A880] bg-stone-100 flex-shrink-0 shadow-sm relative group">
              <img id="qe-current-img-preview" src="${mainImageChoice}" class="w-full h-full object-cover" />
              <!-- Preview Eye Button (👁️) -->
              <button 
                type="button" 
                id="qe-preview-main-img-btn" 
                class="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80 hover:bg-amber-600 text-white text-[10px] flex items-center justify-center font-bold transition-all shadow-md focus:outline-none"
                title="Preview High-Res Enhanced Photo"
              >
                👁️
              </button>
              <span class="absolute bottom-0 inset-x-0 bg-[#1A1A1A]/80 text-[7px] text-amber-200 text-center font-bold uppercase py-0.5 tracking-wider">Main</span>
            </div>
            
            <div class="flex-grow space-y-2">
              <div class="flex gap-2">
                <button type="button" id="qe-img-mode-keep" class="flex-1 py-1.5 px-2 text-[9px] font-semibold uppercase tracking-wider border rounded-lg transition-all bg-[#1A1A1A] text-white border-[#1A1A1A]">Keep Photo</button>
                <button type="button" id="qe-img-mode-upload" class="flex-1 py-1.5 px-2 text-[9px] font-semibold uppercase tracking-wider border rounded-lg transition-all bg-white text-[#5A5A5A] border-[#E5E3DF]">Crop &amp; Upload</button>
                <button type="button" id="qe-img-mode-url" class="flex-1 py-1.5 px-2 text-[9px] font-semibold uppercase tracking-wider border rounded-lg transition-all bg-white text-[#5A5A5A] border-[#E5E3DF]">URL Link</button>
              </div>

              <div id="qe-upload-zone" class="hidden">
                <div class="border-2 border-dashed border-[#C5A880]/50 rounded-xl p-3 text-center cursor-pointer bg-white hover:bg-[#C5A880]/5 relative min-h-[60px] flex flex-col items-center justify-center" id="qe-dropzone">
                  <input type="file" id="qe-file-input" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <p class="text-[9px] font-bold text-[#1A1A1A] uppercase tracking-wider pointer-events-none">Click or Drop new photo to Crop &amp; Auto-Enhance</p>
                </div>
              </div>

              <div id="qe-url-zone" class="hidden">
                <input type="url" id="qe-url-input" placeholder="https://images.unsplash.com/..." value="${mainImageChoice}" class="w-full bg-white border border-[#E5E3DF] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
              </div>
            </div>
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- SECTION B: ADDITIONAL GALLERY IMAGES (MULTI-FILE UPLOADER) -->
        <!-- ============================================================== -->
        <div class="space-y-3 border-t border-[#E5E3DF]/60 pt-3">
          <div class="flex items-center justify-between">
            <label class="block text-[9px] uppercase tracking-wider text-[#1A1A1A] font-bold">Section B &bull; Additional Gallery Images</label>
            <span class="text-[8px] text-[#8A8A8A] uppercase font-semibold" id="qe-gallery-count">${galleryImages.length} Additional Photos</span>
          </div>

          <!-- Dedicated Gallery Dropzone for Multi-Files -->
          <div class="border-2 border-dashed border-[#C5A880]/40 rounded-2xl p-4 bg-[#F9F8F6] hover:bg-[#C5A880]/5 transition-all text-center relative cursor-pointer" id="qe-gallery-dropzone">
            <input type="file" id="qe-gallery-file-input" accept="image/*" multiple class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div id="qe-gallery-dropzone-prompt" class="space-y-1 pointer-events-none">
              <svg class="w-6 h-6 text-[#C5A880] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-[9px] font-bold text-[#1A1A1A] uppercase tracking-wider">Drag & Drop or Click to Crop &amp; Add Gallery Photos</p>
              <p class="text-[8px] text-[#8A8A8A]">Select photos to crop &amp; enhance via Studio</p>
            </div>
          </div>

          <!-- Add by URL input row -->
          <div class="flex gap-2">
            <input type="url" id="qe-gallery-url-input" placeholder="Or enter direct gallery image URL..." class="flex-1 bg-[#F9F8F6] border border-[#E5E3DF] px-3 py-1.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
            <button type="button" id="qe-add-gallery-url-btn" class="px-4 py-1.5 bg-[#1A1A1A] text-white hover:bg-[#C5A880] hover:text-[#1A1A1A] text-[9px] font-semibold uppercase tracking-wider rounded-xl transition-all">
              + Add URL
            </button>
          </div>

          <!-- Interactive Gallery Thumbnail Strip -->
          <div id="qe-gallery-strip-container" class="space-y-1.5">
            <!-- Rendered by renderGalleryThumbnails() -->
          </div>
        </div>

        <!-- Description & Details -->
        <div class="space-y-3 border-t border-[#E5E3DF]/60 pt-3">
          <div>
            <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1">Product Description</label>
            <textarea id="qe-desc" rows="2" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-2 text-xs rounded-xl focus:outline-none focus:border-[#C5A880] resize-none">${(product.description || '').replace(/</g, '&lt;')}</textarea>
          </div>
          <div>
            <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1">Fabric & Care Composition</label>
            <input type="text" id="qe-fabric" value="${(product.fabricDetails || '').replace(/"/g, '&quot;')}" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
          </div>
        </div>

        <!-- Action CTAs -->
        <div class="grid grid-cols-2 gap-3 pt-4 border-t border-[#E5E3DF]">
          <button type="button" id="qe-cancel-btn" class="py-3 border border-[#E5E3DF] text-[#5A5A5A] hover:bg-stone-50 text-xs uppercase tracking-widest font-semibold rounded-xl transition-all focus:outline-none min-h-[44px]">
            Discard
          </button>
          <button type="submit" id="qe-save-btn" class="py-3 bg-[#1A1A1A] hover:bg-[#C5A880] hover:text-[#1A1A1A] text-white text-xs uppercase tracking-widest font-semibold rounded-xl transition-all duration-300 shadow-md focus:outline-none min-h-[44px]">
            Save to Firestore
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

  // ==============================================================
  // PRICING ENGINE AUTO-CALCULATION IN QUICK EDIT MODAL
  // ==============================================================
  function recalculateModalPricing() {
    const costEl = modal.querySelector('#qe-supplier-cost');
    const profitEl = modal.querySelector('#qe-target-profit');
    const bufferEl = modal.querySelector('#qe-rto-buffer');
    const priceEl = modal.querySelector('#qe-price');
    const mrpEl = modal.querySelector('#qe-mrp');
    const netEl = modal.querySelector('#qe-pricing-net-display');
    const discEl = modal.querySelector('#qe-pricing-disc-display');

    if (!costEl || !priceEl || !mrpEl) return;

    const cost = Number(costEl.value) || 0;
    const profit = Number(profitEl?.value) >= 0 ? Number(profitEl.value) : 200;
    const buffer = Number(bufferEl?.value) >= 0 ? Number(bufferEl.value) : 100;

    if (cost > 0) {
      const pricing = calculatePsychologicalPricing(cost, profit, buffer);
      priceEl.value = pricing.sellingPrice;
      mrpEl.value = pricing.mrp;
      if (netEl) netEl.innerText = `Net Profit: ₹${pricing.netProfit} (Protected from RTO)`;
      if (discEl && pricing.mrp > 0) {
        const discountPct = Math.round(((pricing.mrp - pricing.sellingPrice) / pricing.mrp) * 100);
        discEl.innerText = `~${discountPct}% OFF MRP`;
      }
    }
  }

  const qeCostInput = modal.querySelector('#qe-supplier-cost');
  const qeProfitInput = modal.querySelector('#qe-target-profit');
  const qeBufferInput = modal.querySelector('#qe-rto-buffer');

  if (qeCostInput) qeCostInput.addEventListener('input', recalculateModalPricing);
  if (qeProfitInput) qeProfitInput.addEventListener('input', recalculateModalPricing);
  if (qeBufferInput) qeBufferInput.addEventListener('input', recalculateModalPricing);

  // Featured Toggle in modal
  const featuredToggleBtn = modal.querySelector('#qe-featured-toggle-btn');
  if (featuredToggleBtn) {
    featuredToggleBtn.addEventListener('click', () => {
      isFeaturedChoice = !isFeaturedChoice;
      featuredToggleBtn.className = `w-full py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
        isFeaturedChoice ? 'bg-amber-50 text-amber-900 border-amber-300' : 'bg-[#F9F8F6] text-[#5A5A5A] border-[#E5E3DF]'
      }`;
      featuredToggleBtn.innerHTML = `<span>${isFeaturedChoice ? '⭐ Flagged Featured' : '☆ Not Featured'}</span>`;
    });
  }

  // COD Toggle in modal
  const codToggleBtn = modal.querySelector('#qe-cod-toggle-btn');
  if (codToggleBtn) {
    codToggleBtn.addEventListener('click', () => {
      isCodAvailableChoice = !isCodAvailableChoice;
      codToggleBtn.className = `px-3.5 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${
        isCodAvailableChoice ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-white text-stone-500 border-stone-300'
      }`;
      codToggleBtn.innerHTML = `<span>${isCodAvailableChoice ? '✓ COD Enabled' : '✕ Prepaid Only'}</span>`;
    });
  }

  // Supplier Links & Sizing Toggle (Single Item vs Twin Combo)
  const qeTypeSingle = modal.querySelector('#qe-type-single');
  const qeTypeTwin = modal.querySelector('#qe-type-twin');
  const qeSingleFields = modal.querySelector('#qe-supplier-single-fields');
  const qeTwinFields = modal.querySelector('#qe-supplier-twin-fields');
  const qeCategorySelect = modal.querySelector('#qe-category');

  function updateModalSizingVisibility() {
    const singleSizesSec = modal.querySelector('#qe-single-sizes-section');
    const comboSizesSec = modal.querySelector('#qe-combo-sizes-section');

    if (isComboChoice) {
      if (singleSizesSec) singleSizesSec.classList.add('hidden');
      if (comboSizesSec) comboSizesSec.classList.remove('hidden');
      if (qeSingleFields) qeSingleFields.classList.add('hidden');
      if (qeTwinFields) qeTwinFields.classList.remove('hidden');
      renderModalComboSizeChips();
    } else {
      if (singleSizesSec) singleSizesSec.classList.remove('hidden');
      if (comboSizesSec) comboSizesSec.classList.add('hidden');
      if (qeSingleFields) qeSingleFields.classList.remove('hidden');
      if (qeTwinFields) qeTwinFields.classList.add('hidden');
      renderModalSizeChips();
    }
  }

  if (qeTypeSingle && qeTypeTwin) {
    qeTypeSingle.addEventListener('change', () => {
      if (qeTypeSingle.checked) {
        isComboChoice = false;
        updateModalSizingVisibility();
      }
    });
    qeTypeTwin.addEventListener('change', () => {
      if (qeTypeTwin.checked) {
        isComboChoice = true;
        updateModalSizingVisibility();
      }
    });
  }

  if (qeCategorySelect) {
    qeCategorySelect.addEventListener('change', (e) => {
      if (e.target.value === "Couple") {
        if (qeTypeTwin) qeTypeTwin.checked = true;
        isComboChoice = true;
      } else {
        if (qeTypeSingle) qeTypeSingle.checked = true;
        isComboChoice = false;
      }
      updateModalSizingVisibility();
    });
  }

  // Render Single Size chips inside quick-edit modal
  function renderModalSizeChips() {
    const sizesContainer = modal.querySelector('#qe-sizes-container');
    if (!sizesContainer) return;
    const allSizes = Array.from(new Set([...defaultApparelSizes, ...modalCustomSizes]));

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

  // Render Granular 4-Piece Twin Combo Size chips inside quick-edit modal
  function renderModalComboSizeChips() {
    const menTopEl = modal.querySelector('#qe-combo-men-top');
    const menBottomEl = modal.querySelector('#qe-combo-men-bottom');
    const womenTopEl = modal.querySelector('#qe-combo-women-top');
    const womenBottomEl = modal.querySelector('#qe-combo-women-bottom');

    if (!menTopEl || !menBottomEl || !womenTopEl || !womenBottomEl) return;

    const renderCategory = (container, sizes, catKey) => {
      container.innerHTML = sizes.map(sz => {
        const isSelected = modalComboSizes[catKey].has(sz);
        return `
          <button type="button" data-modal-cat="${catKey}" data-modal-size="${sz}" class="qe-combo-chip px-2.5 py-1.5 rounded-xl text-[10px] font-semibold tracking-wider uppercase border transition-all duration-200 flex items-center gap-1 focus:outline-none ${
            isSelected
              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs'
              : 'bg-white text-[#1A1A1A] border-[#E5E3DF] hover:border-[#1A1A1A]'
          }">
            ${isSelected ? '✓ ' : ''}${sz}
          </button>
        `;
      }).join('');
    };

    renderCategory(menTopEl, defaultMenTopSizes, 'men_top');
    renderCategory(menBottomEl, defaultMenBottomSizes, 'men_bottom');
    renderCategory(womenTopEl, defaultWomenTopSizes, 'women_top');
    renderCategory(womenBottomEl, defaultWomenBottomSizes, 'women_bottom');

    modal.querySelectorAll('.qe-combo-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const cat = chip.getAttribute('data-modal-cat');
        const sz = chip.getAttribute('data-modal-size');
        if (modalComboSizes[cat].has(sz)) {
          modalComboSizes[cat].delete(sz);
        } else {
          modalComboSizes[cat].add(sz);
        }
        renderModalComboSizeChips();
      });
    });
  }

  updateModalSizingVisibility();

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

  // Section A Main Image Mode Toggle Listeners
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
      mainImageMode = "keep";
      btnKeep.className = "flex-1 py-1.5 px-2 text-[9px] font-semibold uppercase tracking-wider border rounded-lg transition-all bg-[#1A1A1A] text-white border-[#1A1A1A]";
      btnUpload.className = "flex-1 py-1.5 px-2 text-[9px] font-semibold uppercase tracking-wider border rounded-lg transition-all bg-white text-[#5A5A5A] border-[#E5E3DF]";
      btnUrl.className = "flex-1 py-1.5 px-2 text-[9px] font-semibold uppercase tracking-wider border rounded-lg transition-all bg-white text-[#5A5A5A] border-[#E5E3DF]";
      uploadZone.classList.add('hidden');
      urlZone.classList.add('hidden');
      previewImg.src = mainImageChoice;
    });

    btnUpload.addEventListener('click', () => {
      mainImageMode = "upload";
      btnUpload.className = "flex-1 py-1.5 px-2 text-[9px] font-semibold uppercase tracking-wider border rounded-lg transition-all bg-[#1A1A1A] text-white border-[#1A1A1A]";
      btnKeep.className = "flex-1 py-1.5 px-2 text-[9px] font-semibold uppercase tracking-wider border rounded-lg transition-all bg-white text-[#5A5A5A] border-[#E5E3DF]";
      btnUrl.className = "flex-1 py-1.5 px-2 text-[9px] font-semibold uppercase tracking-wider border rounded-lg transition-all bg-white text-[#5A5A5A] border-[#E5E3DF]";
      uploadZone.classList.remove('hidden');
      urlZone.classList.add('hidden');
    });

    btnUrl.addEventListener('click', () => {
      mainImageMode = "url";
      btnUrl.className = "flex-1 py-1.5 px-2 text-[9px] font-semibold uppercase tracking-wider border rounded-lg transition-all bg-[#1A1A1A] text-white border-[#1A1A1A]";
      btnKeep.className = "flex-1 py-1.5 px-2 text-[9px] font-semibold uppercase tracking-wider border rounded-lg transition-all bg-white text-[#5A5A5A] border-[#E5E3DF]";
      btnUpload.className = "flex-1 py-1.5 px-2 text-[9px] font-semibold uppercase tracking-wider border rounded-lg transition-all bg-white text-[#5A5A5A] border-[#E5E3DF]";
      urlZone.classList.remove('hidden');
      uploadZone.classList.add('hidden');
    });
  }

  async function handleModalMainImageFile(file) {
    if (!file) return;
    try {
      const cdnUrl = await openImageCropperStudio(file);
      if (cdnUrl) {
        uploadedModalMainImage = cdnUrl;
        mainImageChoice = cdnUrl;
        if (previewImg) previewImg.src = cdnUrl;
      }
    } catch (err) {
      console.log("Quick Edit modal crop cancelled or error:", err);
    }
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) handleModalMainImageFile(e.target.files[0]);
    });
  }

  if (urlInput) {
    urlInput.addEventListener('input', (e) => {
      const u = e.target.value.trim();
      if (u) {
        mainImageChoice = u;
        if (previewImg) previewImg.src = u;
      }
    });
  }

  // Preview Main Image Lightbox
  const qePreviewMainBtn = modal.querySelector('#qe-preview-main-img-btn');
  if (qePreviewMainBtn) {
    qePreviewMainBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openImageLightbox(mainImageChoice, `${product.title || 'Product'} • Main Cover Preview`);
    });
  }

  // Section B Gallery Dropzone Multi-Upload & Thumbnail Strip
  const galleryFileInput = modal.querySelector('#qe-gallery-file-input');
  const galleryDropzone = modal.querySelector('#qe-gallery-dropzone');
  const galleryStrip = modal.querySelector('#qe-gallery-strip-container');
  const galleryCountEl = modal.querySelector('#qe-gallery-count');
  const galleryUrlInput = modal.querySelector('#qe-gallery-url-input');
  const addGalleryUrlBtn = modal.querySelector('#qe-add-gallery-url-btn');

  function renderGalleryThumbnailStrip() {
    if (galleryCountEl) {
      galleryCountEl.innerText = `${galleryImages.length} Additional Photo${galleryImages.length === 1 ? '' : 's'}`;
    }

    if (!galleryStrip) return;

    if (galleryImages.length === 0) {
      galleryStrip.innerHTML = `
        <div class="text-center py-3 bg-stone-50 rounded-xl border border-[#E5E3DF]/60 text-[10px] text-[#8A8A8A]">
          No additional gallery photos attached yet.
        </div>
      `;
      return;
    }

    galleryStrip.innerHTML = `
      <div class="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
        ${galleryImages.map((imgUrl, idx) => `
          <div class="group/thumb relative aspect-[3/4] rounded-xl overflow-hidden border border-[#E5E3DF] bg-stone-100 shadow-xs flex flex-col justify-between">
            <img src="${imgUrl}" class="w-full h-full object-cover" />
            
            <!-- Action buttons in top right -->
            <div class="absolute top-1 right-1 flex items-center gap-1 z-10">
              <!-- Preview Eye Button (👁️) -->
              <button 
                type="button" 
                data-preview-idx="${idx}" 
                class="qe-preview-gallery-img-btn w-5 h-5 rounded-full bg-black/80 hover:bg-amber-600 text-white text-[10px] flex items-center justify-center font-bold transition-all shadow-md focus:outline-none"
                title="Preview High-Res Photo"
              >
                👁️
              </button>
              <!-- Delete badge (✕) in top right -->
              <button 
                type="button" 
                data-delete-idx="${idx}" 
                class="qe-delete-gallery-img-btn w-5 h-5 rounded-full bg-black/80 hover:bg-rose-600 text-white text-[9px] flex items-center justify-center font-bold transition-all shadow-md focus:outline-none"
                title="Remove this photo"
              >
                ✕
              </button>
            </div>

            <!-- "Set as Main" Action Button -->
            <button 
              type="button" 
              data-swap-idx="${idx}" 
              class="qe-swap-main-btn absolute inset-x-1 bottom-1 py-1 bg-[#1A1A1A]/90 hover:bg-[#C5A880] text-white hover:text-[#1A1A1A] text-[8px] uppercase font-bold tracking-wider rounded-md transition-all shadow-md opacity-0 group-hover/thumb:opacity-100 focus:outline-none backdrop-blur-xs"
              title="Make this the main cover image"
            >
              ★ Set as Main
            </button>
          </div>
        `).join('')}
      </div>
    `;

    // Hook up preview buttons
    galleryStrip.querySelectorAll('.qe-preview-gallery-img-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-preview-idx'), 10);
        openImageLightbox(galleryImages[idx], `${product.title || 'Product'} • Gallery Photo #${idx + 1}`);
      });
    });

    // Hook up delete buttons
    galleryStrip.querySelectorAll('.qe-delete-gallery-img-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-delete-idx'), 10);
        galleryImages.splice(idx, 1);
        renderGalleryThumbnailStrip();
      });
    });

    // Hook up Swap to Main buttons
    galleryStrip.querySelectorAll('.qe-swap-main-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-swap-idx'), 10);
        const oldMain = mainImageChoice;
        const newMain = galleryImages[idx];
        
        mainImageChoice = newMain;
        galleryImages[idx] = oldMain;
        
        if (previewImg) previewImg.src = mainImageChoice;
        renderGalleryThumbnailStrip();
      });
    });
  }

  async function handleGalleryFilesUpload(files) {
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      try {
        const uploadedUrl = await openImageCropperStudio(files[i]);
        if (uploadedUrl) {
          galleryImages.push(uploadedUrl);
          renderGalleryThumbnailStrip();
        }
      } catch (err) {
        console.log(`Gallery image ${i} crop cancelled or error:`, err);
      }
    }
  }

  if (galleryFileInput) {
    galleryFileInput.addEventListener('change', (e) => {
      if (e.target.files) handleGalleryFilesUpload(e.target.files);
    });
  }

  if (addGalleryUrlBtn && galleryUrlInput) {
    addGalleryUrlBtn.addEventListener('click', () => {
      const u = galleryUrlInput.value.trim();
      if (u) {
        galleryImages.push(u);
        galleryUrlInput.value = '';
        renderGalleryThumbnailStrip();
      }
    });

    galleryUrlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addGalleryUrlBtn.click();
      }
    });
  }

  renderGalleryThumbnailStrip();

  // Submit Changes and Save to Firestore
  const form = modal.querySelector('#quick-edit-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = modal.querySelector('#qe-title').value.trim();
      const category = modal.querySelector('#qe-category').value;
      const badge = modal.querySelector('#qe-badge').value.trim();
      const supplierCost = parseInt(modal.querySelector('#qe-supplier-cost').value) || 0;
      const targetProfit = parseInt(modal.querySelector('#qe-target-profit').value) || 200;
      const rtoBuffer = parseInt(modal.querySelector('#qe-rto-buffer').value) || 100;
      const price = parseInt(modal.querySelector('#qe-price').value);
      const originalPrice = parseInt(modal.querySelector('#qe-mrp').value);
      const description = modal.querySelector('#qe-desc').value.trim();
      const fabricDetails = modal.querySelector('#qe-fabric').value.trim();

      const isTwin = modal.querySelector('#qe-type-twin')?.checked === true;
      let finalSizes = [];
      let finalComboSizes = null;

      if (isTwin) {
        if (
          modalComboSizes.men_top.size === 0 ||
          modalComboSizes.men_bottom.size === 0 ||
          modalComboSizes.women_top.size === 0 ||
          modalComboSizes.women_bottom.size === 0
        ) {
          alert("⚠️ Please select at least one active size in stock for all 4 categories (Men's Top, Men's Bottom, Women's Top, Women's Bottom) in the Twin Combo sizing matrix!");
          return;
        }
        finalComboSizes = {
          men_top: Array.from(modalComboSizes.men_top),
          men_bottom: Array.from(modalComboSizes.men_bottom),
          women_top: Array.from(modalComboSizes.women_top),
          women_bottom: Array.from(modalComboSizes.women_bottom)
        };
        finalSizes = ["Custom 4-Piece Combo"];
      } else {
        if (modalSelectedSizes.size === 0) {
          alert("⚠️ Please select at least one size tag!");
          return;
        }
        finalSizes = Array.from(modalSelectedSizes);
      }

      let finalMainImage = mainImageChoice;
      if (mainImageMode === "upload" && uploadedModalMainImage) {
        finalMainImage = uploadedModalMainImage;
      } else if (mainImageMode === "url") {
        const urlVal = urlInput.value.trim();
        if (urlVal) finalMainImage = urlVal;
      }

      const finalImages = [finalMainImage, ...galleryImages];
      const discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);

      let supplier_links = {};
      if (isTwin) {
        supplier_links = {
          male_top: modal.querySelector('#qe-supplier-male-top')?.value.trim() || '',
          male_bottom: modal.querySelector('#qe-supplier-male-bottom')?.value.trim() || '',
          female_top: modal.querySelector('#qe-supplier-female-top')?.value.trim() || '',
          female_bottom: modal.querySelector('#qe-supplier-female-bottom')?.value.trim() || ''
        };
      } else {
        supplier_links = {
          top: modal.querySelector('#qe-supplier-top')?.value.trim() || '',
          bottom: modal.querySelector('#qe-supplier-bottom')?.value.trim() || ''
        };
      }

      const updatedProduct = {
        ...product,
        title,
        category,
        is_combo: isTwin,
        combo_sizes: finalComboSizes,
        supplier_links,
        supplierCost,
        targetProfit,
        rtoBuffer,
        price,
        originalPrice,
        discountPercentage,
        badge: badge || null,
        featured: isFeaturedChoice,
        cod_available: isCodAvailableChoice,
        description,
        fabricDetails,
        sizes: finalSizes,
        images: finalImages,
        image: finalMainImage
      };

      const saveBtn = modal.querySelector('#qe-save-btn');
      if (saveBtn) {
        saveBtn.innerText = "Saving to Firestore Cloud...";
        saveBtn.disabled = true;
      }

      await saveProductToCloud(updatedProduct);

      closeModal();

      if (typeof onSaveCallback === "function") {
        onSaveCallback(updatedProduct);
      }
    });
  }
}

/**
 * FULL EXPERIENCE PRODUCT DRAWER / MODAL
 * Includes interactive Gallery Swapper, Collapsible Detail Accordions,
 * Verified Customer Reviews, and live Firestore Review Writer.
 */
export function showQuickViewModal(product) {
  const existingModal = document.getElementById('quickview-modal');
  if (existingModal) existingModal.remove();

  const modal = document.createElement('div');
  modal.id = 'quickview-modal';
  modal.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-[#1A1A1A]/80 backdrop-blur-md p-3 sm:p-4 transition-all duration-300 opacity-0 overflow-y-auto';
  
  const discount = product.discountPercentage || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const images = (product.images && product.images.length > 0) ? product.images : [product.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"];
  
  // Default verified reviews fallback
  const defaultReviews = [
    {
      id: "seed-1",
      name: "Priya Sharma",
      location: "Mumbai, MH",
      rating: 5,
      date: "2 days ago",
      verified: true,
      comment: "The handloom craftsmanship is breathtaking. Fabric feels luxurious and authentic. Arrived in just 3 days for Ganesh Chaturthi!"
    },
    {
      id: "seed-2",
      name: "Vikram Sengupta",
      location: "Kolkata, WB",
      rating: 5,
      date: "1 week ago",
      verified: true,
      comment: "Superb quality, rich color depth and pristine finish. Great attention to packaging and speedy delivery."
    }
  ];

  let currentReviews = (product.reviews && product.reviews.length > 0) ? [...product.reviews] : defaultReviews;
  let currentActiveImage = images[0];

  const isCombo = (product.is_combo === true) || (product.category === "Couple") || Boolean(product.combo_sizes);
  const existingCombo = product.combo_sizes || {};
  const comboSizes = {
    men_top: (existingCombo.men_top && existingCombo.men_top.length > 0) ? existingCombo.men_top : ["M", "L", "XL"],
    men_bottom: (existingCombo.men_bottom && existingCombo.men_bottom.length > 0) ? existingCombo.men_bottom : ["30", "32", "34", "36"],
    women_top: (existingCombo.women_top && existingCombo.women_top.length > 0) ? existingCombo.women_top : ["S", "M", "L", "XL"],
    women_bottom: (existingCombo.women_bottom && existingCombo.women_bottom.length > 0) ? existingCombo.women_bottom : ["S", "M", "L", "XL", "Free Size"]
  };

  modal.innerHTML = `
    <div class="bg-white rounded-3xl border border-[#E5E3DF] max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative flex flex-col md:grid md:grid-cols-12 transform scale-95 opacity-0 transition-all duration-300" id="qv-modal-card">
      <!-- Close Button -->
      <button id="qv-close-btn" class="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-[#E5E3DF] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white flex items-center justify-center transition-all shadow-md focus:outline-none">
        <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Left Column: Gallery Showcase & Thumbnail Swapper (md:col-span-6) -->
      <div class="p-6 md:col-span-6 flex flex-col space-y-4 border-r border-[#E5E3DF] bg-[#FAF9F7]">
        <!-- Large Main Image Frame with Swapper Transition -->
        <div class="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-stone-100 relative border border-[#E5E3DF] shadow-xs">
          <img 
            id="qv-main-img" 
            src="${currentActiveImage}" 
            alt="${product.title}" 
            class="w-full h-full object-cover transition-all duration-500 ease-out"
          />
          
          <!-- Badges overlay (Bottom Left Haute Couture Glassmorphism - Face Unobstructed) -->
          <div class="absolute bottom-3 left-3 flex flex-wrap items-center gap-1 z-10 pointer-events-none">
            <span class="inline-flex items-center text-[9px] uppercase tracking-[0.18em] font-medium px-2.5 py-1 rounded-full border shadow-sm" style="background: rgba(18, 16, 14, 0.7); backdrop-filter: blur(8px); color: #E5D5BA; border-color: rgba(229, 213, 186, 0.35);">
              ${product.category}
            </span>
            ${isCombo ? `
              <span class="inline-flex items-center text-[9px] uppercase tracking-[0.18em] font-medium px-2.5 py-1 rounded-full border shadow-sm" style="background: rgba(18, 16, 14, 0.85); backdrop-filter: blur(8px); color: #F5DCA8; border-color: rgba(245, 220, 168, 0.5);">
                👯 4-Piece Twin Combo
              </span>
            ` : ''}
            ${product.featured ? `
              <span class="inline-flex items-center text-[9px] uppercase tracking-[0.18em] font-medium px-2.5 py-1 rounded-full border shadow-sm" style="background: rgba(18, 16, 14, 0.7); backdrop-filter: blur(8px); color: #E5D5BA; border-color: rgba(229, 213, 186, 0.35);">
                ⭐ Featured
              </span>
            ` : ''}
            ${product.badge && product.badge !== 'Featured' ? `
              <span class="inline-flex items-center text-[9px] uppercase tracking-[0.18em] font-medium px-2.5 py-1 rounded-full border shadow-sm" style="background: rgba(18, 16, 14, 0.7); backdrop-filter: blur(8px); color: #E5D5BA; border-color: rgba(229, 213, 186, 0.35);">
                ${product.badge}
              </span>
            ` : ''}
          </div>
        </div>

        <!-- Thumbnails Swapper Strip -->
        ${images.length > 1 ? `
          <div>
            <p class="text-[8px] uppercase tracking-widest font-bold text-[#8A8A8A] mb-1.5">Product Gallery (${images.length} Photos)</p>
            <div class="flex gap-2.5 overflow-x-auto pb-1.5 no-scrollbar" id="qv-thumbnails-row">
              ${images.map((img, idx) => `
                <button 
                  class="qv-thumb-btn w-16 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${idx === 0 ? 'border-[#C5A880] ring-2 ring-[#C5A880]/40 scale-105' : 'border-[#E5E3DF] opacity-75 hover:opacity-100'}"
                  data-img-src="${img}"
                >
                  <img src="${img}" class="w-full h-full object-cover pointer-events-none" />
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Right Column: Details, Accordions, & Verified Reviews (md:col-span-6) -->
      <div class="p-6 md:p-8 md:col-span-6 flex flex-col justify-between space-y-6">
        <div class="space-y-4">
          <!-- Title & Ratings -->
          <div>
            <div class="flex items-center gap-2 text-xs text-amber-500 font-bold mb-1">
              <span>★★★★★</span>
              <span class="text-[10px] text-[#1A1A1A] font-medium">4.9 &bull; Verified Customer Ratings</span>
            </div>
            <h2 class="text-2xl font-serif text-[#1A1A1A] leading-tight font-light">${product.title}</h2>
          </div>

          <!-- Pricing Block -->
          <div class="flex items-baseline gap-3">
            <span class="text-2xl font-bold text-[#1A1A1A]">₹${product.price.toLocaleString('en-IN')}</span>
            <span class="text-xs text-[#8A8A8A] line-through">₹${product.originalPrice.toLocaleString('en-IN')}</span>
            <span class="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md uppercase tracking-wider">${discount}% OFF</span>
          </div>

          <!-- Description -->
          <p class="text-xs text-[#5A5A5A] font-light leading-relaxed">${product.description}</p>

          <!-- Quick Fulfillment Badge -->
          <div class="bg-amber-50/80 border border-amber-200 p-3 rounded-xl text-[10px] text-[#7A6030] space-y-1">
            <div class="flex items-center gap-1.5 font-bold uppercase tracking-wider">
              <span>⚡ Pan-India Express Fulfillment</span>
            </div>
            <p class="leading-relaxed font-medium">Dispatched in 24–48 Hours &bull; Delivery in 4–7 Days &bull; ${product.cod_available === true ? 'Cash on Delivery Available' : 'Prepaid Express Only'}</p>
          </div>

          <!-- Sizing Selection Section (Dynamic: 4-Piece Twin Combo vs Standard Single) -->
          <div class="space-y-3 border-t border-[#E5E3DF]/70 pt-3" id="qv-sizing-block">
            ${isCombo ? `
              <!-- Twin Combo 4-Piece Sizing Matrices -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs">👯</span>
                    <span class="text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A]">Select 4-Piece Coordinated Sizes</span>
                  </div>
                  <span id="qv-combo-progress-badge" class="text-[8px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 transition-all">
                    0/4 Selected
                  </span>
                </div>

                <!-- 1. Men's Top -->
                <div class="space-y-1.5 p-3 bg-[#FAF9F7] rounded-xl border border-[#E5E3DF]/80" id="qv-strip-men-top">
                  <div class="flex justify-between items-center text-[10px]">
                    <span class="font-bold text-[#1A1A1A] flex items-center gap-1">
                      <span>👨</span> 1. Select Men's Top Size (Kurta / Shirt)
                    </span>
                    <span class="text-[9px] text-[#C5A880] font-semibold qv-sel-indicator" id="qv-sel-men-top">Select size</span>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    ${comboSizes.men_top.map(sz => `
                      <button type="button" class="qv-combo-size-chip qv-chip-men-top border border-[#E5E3DF] bg-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-all hover:border-[#1A1A1A] cursor-pointer" data-combo-cat="men_top" data-combo-size="${sz}">
                        ${sz}
                      </button>
                    `).join('')}
                  </div>
                </div>

                <!-- 2. Men's Bottom -->
                <div class="space-y-1.5 p-3 bg-[#FAF9F7] rounded-xl border border-[#E5E3DF]/80" id="qv-strip-men-bottom">
                  <div class="flex justify-between items-center text-[10px]">
                    <span class="font-bold text-[#1A1A1A] flex items-center gap-1">
                      <span>👨</span> 2. Select Men's Bottom Size (Pyjama / Pant)
                    </span>
                    <span class="text-[9px] text-[#C5A880] font-semibold qv-sel-indicator" id="qv-sel-men-bottom">Select size</span>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    ${comboSizes.men_bottom.map(sz => `
                      <button type="button" class="qv-combo-size-chip qv-chip-men-bottom border border-[#E5E3DF] bg-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-all hover:border-[#1A1A1A] cursor-pointer" data-combo-cat="men_bottom" data-combo-size="${sz}">
                        ${sz}
                      </button>
                    `).join('')}
                  </div>
                </div>

                <!-- 3. Women's Top -->
                <div class="space-y-1.5 p-3 bg-[#FAF9F7] rounded-xl border border-[#E5E3DF]/80" id="qv-strip-women-top">
                  <div class="flex justify-between items-center text-[10px]">
                    <span class="font-bold text-[#1A1A1A] flex items-center gap-1">
                      <span>👩</span> 3. Select Women's Top Size (Kurti / Blouse)
                    </span>
                    <span class="text-[9px] text-[#C5A880] font-semibold qv-sel-indicator" id="qv-sel-women-top">Select size</span>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    ${comboSizes.women_top.map(sz => `
                      <button type="button" class="qv-combo-size-chip qv-chip-women-top border border-[#E5E3DF] bg-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-all hover:border-[#1A1A1A] cursor-pointer" data-combo-cat="women_top" data-combo-size="${sz}">
                        ${sz}
                      </button>
                    `).join('')}
                  </div>
                </div>

                <!-- 4. Women's Bottom -->
                <div class="space-y-1.5 p-3 bg-[#FAF9F7] rounded-xl border border-[#E5E3DF]/80" id="qv-strip-women-bottom">
                  <div class="flex justify-between items-center text-[10px]">
                    <span class="font-bold text-[#1A1A1A] flex items-center gap-1">
                      <span>👩</span> 4. Select Women's Bottom Size (Skirt / Pant / Saree)
                    </span>
                    <span class="text-[9px] text-[#C5A880] font-semibold qv-sel-indicator" id="qv-sel-women-bottom">Select size</span>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    ${comboSizes.women_bottom.map(sz => `
                      <button type="button" class="qv-combo-size-chip qv-chip-women-bottom border border-[#E5E3DF] bg-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-all hover:border-[#1A1A1A] cursor-pointer" data-combo-cat="women_bottom" data-combo-size="${sz}">
                        ${sz}
                      </button>
                    `).join('')}
                  </div>
                </div>

                <!-- Sizing Summary Box -->
                <div class="p-2.5 bg-amber-50/50 border border-amber-200/60 rounded-xl text-[9px] text-[#7A6030] leading-snug">
                  <span class="font-bold uppercase tracking-wider">Selection:</span>
                  <span id="qv-combo-summary-text" class="ml-1 font-medium text-[#1A1A1A]">Please select sizes for all 4 pieces</span>
                </div>
              </div>
            ` : `
              <!-- Standard Single Size Selection -->
              <div class="space-y-2">
                <div class="flex justify-between items-center text-[10px] uppercase tracking-wider font-semibold text-[#1A1A1A]">
                  <span>Select Size</span>
                  <span id="qv-selected-size-text" class="text-[#C5A880] normal-case font-normal font-sans">Select a size</span>
                </div>
                
                <div class="flex flex-wrap gap-2" id="qv-size-container">
                  ${product.sizes.map((size) => `
                    <button 
                      class="qv-size-chip border border-[#E5E3DF] text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:border-[#1A1A1A] cursor-pointer"
                      data-size="${size}"
                    >
                      ${size}
                    </button>
                  `).join('')}
                </div>
              </div>
            `}
          </div>

          <!-- Quantity and Add to Bag Row -->
          <div class="flex items-center justify-between gap-3 pt-2">
            <!-- Quantity Selector -->
            <div class="flex items-center border border-[#E5E3DF] rounded-xl overflow-hidden h-11 bg-white">
              <button id="qv-qty-dec" class="w-10 h-full flex items-center justify-center hover:bg-stone-50 font-bold focus:outline-none select-none text-stone-600">-</button>
              <span id="qv-qty-val" class="w-10 text-center font-bold text-xs">1</span>
              <button id="qv-qty-inc" class="w-10 h-full flex items-center justify-center hover:bg-stone-50 font-bold focus:outline-none select-none text-stone-600">+</button>
            </div>

            <!-- CTA Add to bag -->
            <button 
              id="qv-add-btn" 
              class="flex-grow py-3 bg-[#1A1A1A] hover:bg-[#C5A880] hover:text-[#1A1A1A] text-white text-xs uppercase tracking-widest font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 h-11 shadow-md focus:outline-none cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Add to Bag</span>
            </button>
          </div>

          <!-- ========================================================== -->
          <!-- COLLAPSIBLE ACCORDION DETAILS TABS -->
          <!-- ========================================================== -->
          <div class="space-y-2.5 border-t border-[#E5E3DF] pt-4" id="qv-accordions-group">
            <!-- Accordion 1: Fabric & Care Instructions -->
            <div class="border border-[#E5E3DF] rounded-xl overflow-hidden bg-white">
              <button type="button" class="qv-accordion-btn w-full px-4 py-3 text-left text-xs uppercase tracking-wider font-bold text-[#1A1A1A] flex items-center justify-between hover:bg-stone-50 transition-colors focus:outline-none" data-accordion-target="fabric-care">
                <span class="flex items-center gap-2">
                  <span>🧵</span> Fabric &amp; Care Instructions
                </span>
                <span class="accordion-arrow text-stone-400 font-normal transition-transform duration-200">▼</span>
              </button>
              <div id="acc-fabric-care" class="hidden px-4 pb-3.5 pt-1 text-xs text-[#5A5A5A] space-y-1.5 border-t border-[#E5E3DF]/50 bg-[#FAF9F7]">
                <p class="font-medium text-[#1A1A1A]">${product.fabricDetails || "Pure Handcrafted Fabric with Zari Finish."}</p>
                <p class="font-light leading-relaxed">Dry clean recommended for metallic zari threads and genuine handloom silks. Avoid harsh scrubbing and direct prolonged sunlight to maintain vibrant festive luster.</p>
              </div>
            </div>

            <!-- Accordion 2: Size & Fit Guidance -->
            <div class="border border-[#E5E3DF] rounded-xl overflow-hidden bg-white">
              <button type="button" class="qv-accordion-btn w-full px-4 py-3 text-left text-xs uppercase tracking-wider font-bold text-[#1A1A1A] flex items-center justify-between hover:bg-stone-50 transition-colors focus:outline-none" data-accordion-target="size-fit">
                <span class="flex items-center gap-2">
                  <span>📏</span> Size &amp; Fit Guidance
                </span>
                <span class="accordion-arrow text-stone-400 font-normal transition-transform duration-200">▼</span>
              </button>
              <div id="acc-size-fit" class="hidden px-4 pb-3.5 pt-1 text-xs text-[#5A5A5A] space-y-2 border-t border-[#E5E3DF]/50 bg-[#FAF9F7]">
                <p class="font-light leading-relaxed">Designed in classic Indian festive cuts with comfortable ease for day-long celebrations:</p>
                <div class="grid grid-cols-2 gap-2 text-[10px] bg-white p-2.5 rounded-lg border border-[#E5E3DF]">
                  <div><strong>Kurtas:</strong> Chest S=38", M=40", L=42", XL=44", XXL=46"</div>
                  <div><strong>Sarees:</strong> 5.5m + 0.8m unstitched blouse</div>
                </div>
              </div>
            </div>

            <!-- Accordion 3: Pan-India Shipping & COD Details -->
            <div class="border border-[#E5E3DF] rounded-xl overflow-hidden bg-white">
              <button type="button" class="qv-accordion-btn w-full px-4 py-3 text-left text-xs uppercase tracking-wider font-bold text-[#1A1A1A] flex items-center justify-between hover:bg-stone-50 transition-colors focus:outline-none" data-accordion-target="shipping-cod">
                <span class="flex items-center gap-2">
                  <span>🚚</span> Pan-India Shipping &amp; COD Details
                </span>
                <span class="accordion-arrow text-stone-400 font-normal transition-transform duration-200">▼</span>
              </button>
              <div id="acc-shipping-cod" class="hidden px-4 pb-3.5 pt-1 text-xs text-[#5A5A5A] space-y-1.5 border-t border-[#E5E3DF]/50 bg-[#FAF9F7]">
                <p class="font-light leading-relaxed">We provide insured express courier delivery across all 28 states &amp; UTs:</p>
                <ul class="list-disc pl-4 space-y-1 text-[11px]">
                  <li><strong>Fast Dispatch:</strong> Dispatched from atelier in 24–48 hours.</li>
                  ${product.cod_available === true ? `
                    <li><strong>Cash on Delivery (COD):</strong> Available at your doorstep across serviceable PIN codes.</li>
                  ` : `
                    <li><strong>Payment Terms:</strong> Prepaid Express Order Only (Instant UPI / Secure Card Payment). Cash on Delivery is unavailable for this artisanal piece.</li>
                  `}
                  <li><strong>Hassle-Free Returns:</strong> 7-day doorstep replacement support.</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- ========================================================== -->
          <!-- VERIFIED CUSTOMER REVIEWS & STAR RATINGS SECTION -->
          <!-- ========================================================== -->
          <div class="border-t border-[#E5E3DF] pt-4 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-serif text-sm text-[#1A1A1A] font-bold uppercase tracking-wider">Verified Customer Reviews</h3>
                <p class="text-[9px] text-[#8A8A8A]">Real buyer feedback from across India</p>
              </div>
              <button 
                type="button" 
                id="qv-toggle-write-review-btn" 
                class="px-3 py-1.5 border border-[#C5A880] text-[#C5A880] hover:bg-[#C5A880] hover:text-[#1A1A1A] text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all"
              >
                + Write a Review
              </button>
            </div>

            <!-- Collapsible Write Review Form -->
            <div id="qv-write-review-box" class="hidden p-4 bg-[#FAF9F7] border border-[#C5A880]/50 rounded-2xl space-y-3">
              <p class="text-[10px] uppercase font-bold text-[#1A1A1A] tracking-wider">Leave Your Verified Review</p>
              
              <!-- Star picker -->
              <div class="flex items-center gap-2">
                <span class="text-[9px] uppercase font-semibold text-[#5A5A5A]">Rating:</span>
                <div class="flex items-center gap-1 cursor-pointer" id="qv-star-picker">
                  ${[1, 2, 3, 4, 5].map(st => `
                    <button type="button" data-star="${st}" class="qv-star-btn text-amber-400 text-lg hover:scale-125 transition-transform focus:outline-none">★</button>
                  `).join('')}
                </div>
                <span id="qv-star-label" class="text-[10px] font-bold text-amber-700">5 / 5 Stars</span>
              </div>

              <!-- Name -->
              <div>
                <input type="text" id="qv-rev-name" placeholder="Your Name (e.g. Radhika Sharma)" class="w-full bg-white border border-[#E5E3DF] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
              </div>

              <!-- Comment -->
              <div>
                <textarea id="qv-rev-comment" rows="2" placeholder="Share your experience regarding fabric quality, fit, and delivery..." class="w-full bg-white border border-[#E5E3DF] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#C5A880] resize-none"></textarea>
              </div>

              <div class="flex justify-end gap-2">
                <button type="button" id="qv-cancel-rev-btn" class="px-3 py-1.5 text-[9px] uppercase font-bold text-[#5A5A5A] hover:bg-stone-200 rounded-lg">Cancel</button>
                <button type="button" id="qv-submit-rev-btn" class="px-4 py-1.5 bg-[#1A1A1A] text-white hover:bg-[#C5A880] hover:text-[#1A1A1A] text-[9px] uppercase font-bold tracking-wider rounded-lg transition-all">Submit Review</button>
              </div>
            </div>

            <!-- List of Reviews -->
            <div class="space-y-2.5 max-h-48 overflow-y-auto pr-1" id="qv-reviews-list">
              ${currentReviews.map(rev => `
                <div class="p-3 bg-[#FAF9F7] rounded-xl border border-[#E5E3DF]/80 space-y-1">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1.5">
                      <span class="font-bold text-xs text-[#1A1A1A]">${rev.name}</span>
                      <span class="text-amber-500 text-xs">${'★'.repeat(rev.rating || 5)}</span>
                    </div>
                    <span class="text-[9px] text-[#8A8A8A]">${rev.date || 'Recent'}</span>
                  </div>
                  <div class="flex items-center gap-1 text-[8px] text-emerald-700 font-bold uppercase tracking-wider">
                    <span>✓ Verified Buyer</span>
                    ${rev.location ? `<span class="text-stone-400">&bull; ${rev.location}</span>` : ''}
                  </div>
                  <p class="text-xs text-[#5A5A5A] font-light leading-relaxed mt-1">${rev.comment}</p>
                </div>
              `).join('')}
            </div>
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
  const qtyVal = document.getElementById('qv-qty-val');
  const qtyInc = document.getElementById('qv-qty-inc');
  const qtyDec = document.getElementById('qv-qty-dec');
  const qvAddBtn = document.getElementById('qv-add-btn');

  let currentQty = 1;
  let selectedSize = null;
  const selectedCombo = {
    men_top: null,
    men_bottom: null,
    women_top: null,
    women_bottom: null
  };

  // Setup Twin Combo or Single Size event handlers
  if (isCombo) {
    function updateComboSelectionDisplay() {
      const menTopInd = modal.querySelector('#qv-sel-men-top');
      const menBottomInd = modal.querySelector('#qv-sel-men-bottom');
      const womenTopInd = modal.querySelector('#qv-sel-women-top');
      const womenBottomInd = modal.querySelector('#qv-sel-women-bottom');
      const progressBadge = modal.querySelector('#qv-combo-progress-badge');
      const summaryText = modal.querySelector('#qv-combo-summary-text');

      if (menTopInd) menTopInd.innerText = selectedCombo.men_top ? `✓ ${selectedCombo.men_top}` : 'Select size';
      if (menBottomInd) menBottomInd.innerText = selectedCombo.men_bottom ? `✓ ${selectedCombo.men_bottom}` : 'Select size';
      if (womenTopInd) womenTopInd.innerText = selectedCombo.women_top ? `✓ ${selectedCombo.women_top}` : 'Select size';
      if (womenBottomInd) womenBottomInd.innerText = selectedCombo.women_bottom ? `✓ ${selectedCombo.women_bottom}` : 'Select size';

      const count = Object.values(selectedCombo).filter(Boolean).length;
      if (progressBadge) {
        if (count === 4) {
          progressBadge.className = "text-[8px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300";
          progressBadge.innerText = "4/4 Complete ✓";
        } else {
          progressBadge.className = "text-[8px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300";
          progressBadge.innerText = `${count}/4 Selected`;
        }
      }

      if (summaryText) {
        if (count === 4) {
          summaryText.innerText = `Men: Top ${selectedCombo.men_top}, Bottom ${selectedCombo.men_bottom} | Women: Top ${selectedCombo.women_top}, Bottom ${selectedCombo.women_bottom}`;
        } else {
          summaryText.innerText = `Please select all 4 pieces (${4 - count} piece${4 - count === 1 ? '' : 's'} remaining)`;
        }
      }
    }

    modal.querySelectorAll('.qv-combo-size-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const cat = chip.getAttribute('data-combo-cat');
        const sz = chip.getAttribute('data-combo-size');
        const catClass = `qv-chip-${cat.replace('_', '-')}`;

        modal.querySelectorAll(`.${catClass}`).forEach(c => {
          c.className = `qv-combo-size-chip ${catClass} border border-[#E5E3DF] bg-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-all hover:border-[#1A1A1A] cursor-pointer`;
        });

        chip.className = `qv-combo-size-chip ${catClass} border border-[#1A1A1A] bg-[#1A1A1A] text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs active`;
        selectedCombo[cat] = sz;

        updateComboSelectionDisplay();
      });
    });
  } else {
    const qvSizeChips = modal.querySelectorAll('.qv-size-chip');
    const selectedSizeText = document.getElementById('qv-selected-size-text');

    if (product.sizes.length === 1) {
      selectedSize = product.sizes[0];
      const singleChip = modal.querySelector('.qv-size-chip');
      if (singleChip) {
        singleChip.classList.add('bg-[#1A1A1A]', 'text-white', 'border-[#1A1A1A]', 'active');
        if (selectedSizeText) selectedSizeText.innerText = `Selected: ${selectedSize}`;
      }
    }

    qvSizeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        qvSizeChips.forEach(c => c.classList.remove('bg-[#1A1A1A]', 'text-white', 'border-[#1A1A1A]', 'active'));
        chip.classList.add('bg-[#1A1A1A]', 'text-white', 'border-[#1A1A1A]', 'active');
        selectedSize = chip.getAttribute('data-size');
        if (selectedSizeText) selectedSizeText.innerText = `Selected: ${selectedSize}`;
      });
    });
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

  const escListener = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escListener);
    }
  };
  document.addEventListener('keydown', escListener);

  // Gallery Thumbnail Swapper selection
  qvThumbBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.getAttribute('data-img-src');
      if (qvMainImg) {
        qvMainImg.style.opacity = '0.3';
        qvMainImg.style.transform = 'scale(0.98)';
        setTimeout(() => {
          qvMainImg.src = src;
          qvMainImg.style.opacity = '1';
          qvMainImg.style.transform = 'scale(1)';
        }, 150);
      }

      qvThumbBtns.forEach(t => {
        t.className = "qv-thumb-btn w-16 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer border-[#E5E3DF] opacity-75 hover:opacity-100";
      });
      btn.className = "qv-thumb-btn w-16 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer border-[#C5A880] ring-2 ring-[#C5A880]/40 scale-105 opacity-100";
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
    const cart = JSON.parse(localStorage.getItem('fp_cart') || '[]');
    const mainImg = (product.images && product.images.length > 0) ? product.images[0] : (product.image || "");
    const supplier_links = product.supplier_links || {};

    if (isCombo) {
      if (!selectedCombo.men_top || !selectedCombo.men_bottom || !selectedCombo.women_top || !selectedCombo.women_bottom) {
        const sizingBlock = document.getElementById('qv-sizing-block');
        if (sizingBlock) {
          sizingBlock.classList.add('animate-bounce');
          setTimeout(() => sizingBlock.classList.remove('animate-bounce'), 800);
        }
        alert("⚠️ Please select sizes for all 4 pieces (Men's Top & Bottom, Women's Top & Bottom) before adding to bag!");
        return;
      }

      const formattedSize = `Men: Top ${selectedCombo.men_top}, Bottom ${selectedCombo.men_bottom} | Women: Top ${selectedCombo.women_top}, Bottom ${selectedCombo.women_bottom}`;
      const existingIndex = cart.findIndex(item => item.productId === product.id && item.size === formattedSize);

      if (existingIndex > -1) {
        cart[existingIndex].quantity += currentQty;
        cart[existingIndex].cod_available = product.cod_available === true;
        cart[existingIndex].is_combo = true;
        cart[existingIndex].combo_size_breakdown = { ...selectedCombo };
        cart[existingIndex].supplier_links = supplier_links;
      } else {
        cart.push({
          productId: product.id,
          title: product.title,
          price: product.price,
          size: formattedSize,
          combo_size_breakdown: { ...selectedCombo },
          quantity: currentQty,
          image: mainImg,
          cod_available: product.cod_available === true,
          is_combo: true,
          supplier_links: supplier_links
        });
      }

      localStorage.setItem('fp_cart', JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent('fp_cart_updated'));
      window.dispatchEvent(new CustomEvent('fp_open_cart'));

      closeModal();
      return;
    }

    // Individual Item Add to Bag
    if (!selectedSize) {
      const sizeContainer = document.getElementById('qv-size-container');
      if (sizeContainer) {
        sizeContainer.classList.add('animate-bounce');
        setTimeout(() => sizeContainer.classList.remove('animate-bounce'), 1000);
      }
      alert("Please select a size first!");
      return;
    }

    const existingIndex = cart.findIndex(item => item.productId === product.id && item.size === selectedSize);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += currentQty;
      cart[existingIndex].cod_available = product.cod_available === true;
      cart[existingIndex].is_combo = false;
      cart[existingIndex].supplier_links = supplier_links;
    } else {
      cart.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        size: selectedSize,
        quantity: currentQty,
        image: mainImg,
        cod_available: product.cod_available === true,
        is_combo: false,
        supplier_links: supplier_links
      });
    }

    localStorage.setItem('fp_cart', JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('fp_cart_updated'));
    window.dispatchEvent(new CustomEvent('fp_open_cart'));

    closeModal();
  });

  // Accordion Expand/Collapse Listeners
  const accordionBtns = modal.querySelectorAll('.qv-accordion-btn');
  accordionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-accordion-target');
      const targetBody = modal.querySelector(`#acc-${targetId}`);
      const arrow = btn.querySelector('.accordion-arrow');

      if (targetBody) {
        const isHidden = targetBody.classList.contains('hidden');
        if (isHidden) {
          targetBody.classList.remove('hidden');
          if (arrow) arrow.style.transform = 'rotate(180deg)';
        } else {
          targetBody.classList.add('hidden');
          if (arrow) arrow.style.transform = 'rotate(0deg)';
        }
      }
    });
  });

  // Write Review Toggle & Submissions
  const writeRevToggleBtn = modal.querySelector('#qv-toggle-write-review-btn');
  const writeRevBox = modal.querySelector('#qv-write-review-box');
  const cancelRevBtn = modal.querySelector('#qv-cancel-rev-btn');
  const submitRevBtn = modal.querySelector('#qv-submit-rev-btn');
  const starBtns = modal.querySelectorAll('.qv-star-btn');
  const starLabel = modal.querySelector('#qv-star-label');
  let chosenRating = 5;

  if (writeRevToggleBtn && writeRevBox) {
    writeRevToggleBtn.addEventListener('click', () => {
      writeRevBox.classList.toggle('hidden');
    });
  }

  if (cancelRevBtn && writeRevBox) {
    cancelRevBtn.addEventListener('click', () => {
      writeRevBox.classList.add('hidden');
    });
  }

  // Star selector
  starBtns.forEach(sb => {
    sb.addEventListener('click', () => {
      const rating = parseInt(sb.getAttribute('data-star'), 10);
      chosenRating = rating;
      if (starLabel) starLabel.innerText = `${chosenRating} / 5 Stars`;
      starBtns.forEach(s => {
        const val = parseInt(s.getAttribute('data-star'), 10);
        s.style.opacity = val <= chosenRating ? '1' : '0.3';
      });
    });
  });

  if (submitRevBtn) {
    submitRevBtn.addEventListener('click', async () => {
      const nameInput = modal.querySelector('#qv-rev-name');
      const commentInput = modal.querySelector('#qv-rev-comment');

      const name = nameInput ? nameInput.value.trim() : "";
      const comment = commentInput ? commentInput.value.trim() : "";

      if (!name || !comment) {
        alert("Please enter both your name and review comments!");
        return;
      }

      const newReview = {
        id: "rev-" + Date.now(),
        name: name,
        rating: chosenRating,
        comment: comment,
        date: "Just now",
        verified: true,
        location: "India"
      };

      if (!product.reviews) {
        product.reviews = [...defaultReviews];
      }
      product.reviews.unshift(newReview);

      submitRevBtn.innerText = "Submitting...";
      submitRevBtn.disabled = true;

      // Save updated reviews directly to Firestore
      await saveProductToCloud(product);

      // Add to list in modal
      const reviewsList = modal.querySelector('#qv-reviews-list');
      if (reviewsList) {
        const revEl = document.createElement('div');
        revEl.className = 'p-3 bg-amber-50/60 rounded-xl border border-[#C5A880] space-y-1 animate-fadeIn';
        revEl.innerHTML = `
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-xs text-[#1A1A1A]">${newReview.name}</span>
              <span class="text-amber-500 text-xs">${'★'.repeat(newReview.rating)}</span>
            </div>
            <span class="text-[9px] text-[#8A8A8A]">${newReview.date}</span>
          </div>
          <div class="flex items-center gap-1 text-[8px] text-emerald-700 font-bold uppercase tracking-wider">
            <span>✓ Verified Buyer</span>
            <span class="text-stone-400">&bull; India</span>
          </div>
          <p class="text-xs text-[#5A5A5A] font-light leading-relaxed mt-1">${newReview.comment}</p>
        `;
        reviewsList.prepend(revEl);
      }

      writeRevBox.classList.add('hidden');
      nameInput.value = '';
      commentInput.value = '';
      submitRevBtn.innerText = "Submit Review";
      submitRevBtn.disabled = false;
      alert("✨ Thank you! Your verified customer review is now live!");
    });
  }
}
