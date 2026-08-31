/**
 * INTERACTIVE CART DRAWER & ONE-CLICK COD / WHATSAPP CHECKOUT MODAL
 * Manages the slide-out shopping bag, coupon code validations,
 * streamlined customer detail forms, COD/Prepaid options, and WhatsApp order redirections.
 */

import { storeConfig } from '../07-STORE_SETTINGS_AND_THEME_COLORS/store_config.js';
import { saveOrderToCloud } from '../07-STORE_SETTINGS_AND_THEME_COLORS/firebase_sync.js';

export function initCheckout(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Render base structures for Cart Drawer, Backdrop, Checkout Modal, and Success Modal
  container.innerHTML = `
    <!-- Cart Drawer Backdrop -->
    <div 
      id="cart-drawer-backdrop" 
      class="fixed inset-0 bg-[#1A1A1A]/50 z-[70] opacity-0 pointer-events-none transition-opacity duration-300 backdrop-blur-xs"
    ></div>

    <!-- Slide-Out Cart Drawer (Right Side) -->
    <div 
      id="cart-drawer" 
      class="fixed top-0 right-0 h-full w-full sm:w-[460px] bg-white shadow-2xl z-[80] transform translate-x-full transition-transform duration-300 flex flex-col border-l border-[#E5E3DF]"
    >
      <!-- Cart Header -->
      <div class="p-6 border-b border-[#E5E3DF] flex items-center justify-between flex-shrink-0">
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-[#C5A880]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span class="font-serif text-base tracking-widest text-[#1A1A1A] uppercase">Shopping Bag</span>
          <span id="cart-drawer-count" class="text-[10px] bg-[#C5A880]/10 text-[#C5A880] px-2 py-0.5 rounded-full font-bold">0</span>
        </div>
        <button 
          id="cart-drawer-close" 
          class="w-8 h-8 rounded-full border border-[#E5E3DF] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white flex items-center justify-center transition-all focus:outline-none"
          aria-label="Close Bag"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Cart Items List (Scrollable) -->
      <div id="cart-drawer-items" class="flex-grow overflow-y-auto p-6 space-y-4">
        <!-- Rendered dynamically -->
      </div>

      <!-- Cart Footer Block (Pricing & CTAs) -->
      <div id="cart-drawer-footer" class="p-6 border-t border-[#E5E3DF] bg-stone-50 space-y-4 flex-shrink-0">
        <!-- Coupon Form -->
        <div class="space-y-2">
          <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold">Promo / Coupon Code</label>
          <div class="flex gap-2">
            <input 
              type="text" 
              id="cart-coupon-input" 
              placeholder="e.g. FESTIVE2026" 
              class="flex-grow bg-white border border-[#E5E3DF] px-3.5 py-2 text-xs rounded-xl focus:outline-none uppercase tracking-widest text-[#1A1A1A]"
            />
            <button 
              id="cart-coupon-btn" 
              class="px-4 bg-[#1A1A1A] hover:bg-[#C5A880] hover:text-[#1A1A1A] text-white text-[10px] uppercase tracking-widest font-semibold rounded-xl transition-all focus:outline-none"
            >
              Apply
            </button>
          </div>
          <p id="coupon-feedback" class="text-[9px] font-semibold mt-1 hidden"></p>
        </div>

        <hr class="border-[#E5E3DF]" />

        <!-- Price Details -->
        <div class="space-y-2 text-xs text-[#5A5A5A]">
          <div class="flex justify-between items-center">
            <span>Subtotal</span>
            <span id="cart-subtotal-val" class="font-semibold text-[#1A1A1A]">₹0</span>
          </div>
          <div id="cart-discount-row" class="flex justify-between items-center hidden text-emerald-600 font-semibold">
            <span>Discount (15% OFF)</span>
            <span id="cart-discount-val">-₹0</span>
          </div>
          <div class="flex justify-between items-center">
            <span>Shipping</span>
            <span class="text-emerald-600 font-bold uppercase tracking-wider text-[10px]">Free Express</span>
          </div>
          <div class="border-t border-[#E5E3DF] pt-3 flex justify-between items-center text-sm font-bold text-[#1A1A1A]">
            <span>Total Payable</span>
            <span id="cart-total-val">₹0</span>
          </div>
        </div>

        <!-- CTA Buttons -->
        <button 
          id="cart-checkout-btn" 
          class="w-full py-3.5 bg-[#1A1A1A] hover:bg-[#C5A880] hover:text-[#1A1A1A] text-white text-xs uppercase tracking-widest font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none shadow-md"
        >
          <span>Proceed to Checkout</span>
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>

    <!-- One-Click Checkout Modal -->
    <div 
      id="checkout-modal" 
      class="fixed inset-0 z-[90] flex items-center justify-center bg-[#1A1A1A]/70 backdrop-blur-md p-4 transition-all duration-300 opacity-0 pointer-events-none"
    >
      <div 
        class="bg-white rounded-3xl border border-[#E5E3DF] p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col transform scale-95 opacity-0 transition-all duration-300" 
        id="checkout-modal-card"
      >
        <!-- Close Button -->
        <button 
          id="checkout-modal-close" 
          class="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-white border border-[#E5E3DF] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white flex items-center justify-center transition-all focus:outline-none"
        >
          <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="text-center mb-6">
          <span class="text-[9px] uppercase tracking-[0.25em] text-[#C5A880] font-bold block mb-1">Secure Atelier Portal</span>
          <h2 class="text-xl font-serif text-[#1A1A1A] uppercase tracking-wider font-light">One-Click Checkout</h2>
        </div>

        <form id="checkout-form" class="space-y-5" onsubmit="event.preventDefault();">
          
          <!-- Customer Info -->
          <div class="space-y-3">
            <h3 class="text-[10px] uppercase tracking-widest text-[#1A1A1A] font-bold border-b border-[#E5E3DF] pb-1">1. Delivery Address</h3>
            
            <div>
              <label class="block text-[8px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1">Full Name</label>
              <input type="text" id="chk-name" required placeholder="e.g. Aarav Sharma" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-2 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[8px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1">10-Digit Mobile / WhatsApp</label>
                <div class="flex">
                  <span class="inline-flex items-center px-3 bg-stone-100 border border-r-0 border-[#E5E3DF] text-xs text-[#5A5A5A] font-semibold rounded-l-xl select-none">+91</span>
                  <input type="tel" id="chk-phone" pattern="[0-9]{10}" required placeholder="9876543210" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-2 text-xs rounded-r-xl focus:outline-none focus:border-[#C5A880]" />
                </div>
              </div>
              <div>
                <label class="block text-[8px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1">Delivery Pincode</label>
                <input type="text" id="chk-pincode" pattern="[0-9]{6}" required placeholder="400001" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-2 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
              </div>
            </div>

            <div>
              <label class="block text-[8px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1">Street Address</label>
              <textarea id="chk-address" rows="2" required placeholder="Suite, Flat No., Street, Landmark" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-2 text-xs rounded-xl focus:outline-none focus:border-[#C5A880] resize-none"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[8px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1">City</label>
                <input type="text" id="chk-city" required placeholder="e.g. Mumbai" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-2 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
              </div>
              <div>
                <label class="block text-[8px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1">State</label>
                <input type="text" id="chk-state" required placeholder="e.g. Maharashtra" class="w-full bg-[#F9F8F6] border border-[#E5E3DF] px-3.5 py-2 text-xs rounded-xl focus:outline-none focus:border-[#C5A880]" />
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="space-y-3">
            <h3 class="text-[10px] uppercase tracking-widest text-[#1A1A1A] font-bold border-b border-[#E5E3DF] pb-1">2. Payment Method</h3>
            
            <div class="grid grid-cols-2 gap-3">
              <!-- COD Card Option -->
              <label class="cursor-pointer border border-[#1A1A1A] bg-stone-50 rounded-xl p-3.5 flex flex-col space-y-1.5 transition-all shadow-xs relative" id="pay-cod-card">
                <input type="radio" name="pay-method" value="COD" checked class="absolute top-3 right-3 accent-[#C5A880] h-3.5 w-3.5 cursor-pointer" />
                <span class="text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A]">Cash on Delivery</span>
                <span class="text-[8px] text-[#5A5A5A] leading-tight font-medium">Verify & pay at door</span>
              </label>

              <!-- UPI Card Option -->
              <label class="cursor-pointer border border-[#E5E3DF] bg-white rounded-xl p-3.5 flex flex-col space-y-1.5 transition-all relative hover:border-[#1A1A1A]" id="pay-upi-card">
                <input type="radio" name="pay-method" value="UPI" class="absolute top-3 right-3 accent-[#C5A880] h-3.5 w-3.5 cursor-pointer" />
                <span class="text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A]">Prepaid / UPI</span>
                <span class="text-[8px] text-[#5A5A5A] leading-tight font-medium">Instant QR/UPI ID</span>
              </label>
            </div>

            <!-- UPI Details Box (Conditional) -->
            <div id="upi-details-box" class="bg-stone-50 border border-[#E5E3DF] p-3.5 rounded-xl text-[10px] text-[#5A5A5A] hidden space-y-1.5 text-center animate-fadeIn">
              <p class="font-bold text-[#1A1A1A] uppercase tracking-wider">Scan QR or Transfer to UPI ID</p>
              <p class="font-semibold text-[#C5A880]">pay@fashionpalette</p>
              <div class="w-24 h-24 bg-white border border-[#E5E3DF] mx-auto flex items-center justify-center rounded-lg shadow-inner select-none font-mono text-[8px] text-stone-400 p-2 text-center uppercase tracking-widest">
                QR CODE PLACEHOLDER
              </div>
              <p class="text-[9px] text-[#8A8A8A] font-light">Please complete the transfer and hit the checkout CTA below.</p>
            </div>
          </div>

          <!-- Order Summary Recap -->
          <div class="space-y-3">
            <h3 class="text-[10px] uppercase tracking-widest text-[#1A1A1A] font-bold border-b border-[#E5E3DF] pb-1">3. Order Summary Recap</h3>
            <div id="checkout-recap-items" class="max-h-[120px] overflow-y-auto space-y-2 text-xs">
              <!-- Rendered dynamically -->
            </div>
            <div class="flex justify-between items-center text-sm font-bold text-[#1A1A1A] bg-stone-50 p-3.5 border border-[#E5E3DF] rounded-xl">
              <span>Payable Total</span>
              <span id="checkout-recap-total">₹0</span>
            </div>
          </div>

          <button 
            type="submit" 
            id="checkout-submit-btn" 
            class="w-full py-4 bg-[#1A1A1A] hover:bg-[#C5A880] hover:text-[#1A1A1A] text-white text-xs uppercase tracking-widest font-semibold rounded-xl transition-all duration-300 focus:outline-none shadow-md"
          >
            Place Order via Cash on Delivery
          </button>
        </form>
      </div>
    </div>

    <!-- Success Confirmation Modal -->
    <div 
      id="success-modal" 
      class="fixed inset-0 z-[100] flex items-center justify-center bg-[#1A1A1A]/80 backdrop-blur-md p-4 transition-all duration-300 opacity-0 pointer-events-none"
    >
      <div 
        class="bg-white rounded-3xl border border-[#E5E3DF] p-8 max-w-md w-full text-center shadow-2xl relative transform scale-95 opacity-0 transition-all duration-300"
        id="success-modal-card"
      >
        <div class="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <span class="text-[9px] uppercase tracking-[0.25em] text-[#C5A880] font-bold block mb-1">Congratulations</span>
        <h2 class="text-2xl font-serif text-[#1A1A1A] uppercase tracking-wider font-light mb-4">Order Placed</h2>
        
        <p class="text-xs text-[#5A5A5A] mb-4 font-light leading-relaxed">
          Your luxury apparel reservation is secured. Our logistics team will process it shortly.
        </p>

        <!-- Order details card -->
        <div class="bg-stone-50 border border-[#E5E3DF] p-4.5 rounded-2xl mb-6 text-xs text-[#1A1A1A] space-y-2">
          <div class="flex justify-between border-b border-[#E5E3DF]/50 pb-2">
            <span class="text-[#5A5A5A]">Order ID:</span>
            <span id="success-order-id" class="font-bold text-[#C5A880]">#FP-0000</span>
          </div>
          <div class="flex justify-between border-b border-[#E5E3DF]/50 pb-2">
            <span class="text-[#5A5A5A]">Estimated Delivery:</span>
            <span class="font-semibold text-emerald-600">4–7 Business Days</span>
          </div>
          <div class="flex justify-between">
            <span class="text-[#5A5A5A]">Total Paid/COD:</span>
            <span id="success-order-total" class="font-bold">₹0</span>
          </div>
        </div>

        <!-- WhatsApp CTA -->
        <a 
          id="success-whatsapp-btn" 
          target="_blank"
          class="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-widest font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md focus:outline-none cursor-pointer"
        >
          <svg class="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.451L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.59 2.015 14.117.99 11.5.99c-5.441 0-9.866 4.372-9.87 9.802 0 1.706.452 3.375 1.312 4.846l-.996 3.639 3.738-.971zM17.65 14.7c-.305-.152-1.804-.89-2.083-.992-.279-.101-.482-.152-.684.152-.202.304-.783.992-.96 1.193-.178.203-.356.228-.661.076-.305-.152-1.288-.475-2.453-1.514-.908-.81-1.52-1.81-1.698-2.114-.178-.305-.019-.47.133-.62.137-.136.305-.355.457-.533.152-.178.203-.304.305-.507.101-.203.05-.38-.026-.533-.076-.152-.684-1.648-.937-2.257-.247-.594-.497-.514-.684-.523-.178-.009-.38-.01-.583-.01-.203 0-.533.076-.812.38-.279.305-1.066 1.04-1.066 2.537 0 1.497 1.09 2.943 1.242 3.146.152.203 2.146 3.277 5.197 4.594.726.313 1.292.5 1.734.64.728.232 1.39.2 1.913.12.584-.088 1.804-.737 2.058-1.448.254-.71.254-1.32.178-1.448-.076-.127-.279-.203-.583-.355z"/>
          </svg>
          <span>Send Order Confirmation</span>
        </a>

        <!-- Continue shopping helper -->
        <button 
          id="success-continue-btn" 
          class="w-full mt-3 py-3 border border-[#E5E3DF] text-[#1A1A1A] hover:bg-stone-50 text-xs uppercase tracking-widest font-semibold rounded-xl transition-all focus:outline-none"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  `;

  // --- Element References ---
  const cartDrawer = document.getElementById("cart-drawer");
  const cartDrawerBackdrop = document.getElementById("cart-drawer-backdrop");
  const cartDrawerClose = document.getElementById("cart-drawer-close");
  const cartDrawerItems = document.getElementById("cart-drawer-items");
  const cartDrawerCount = document.getElementById("cart-drawer-count");
  const cartCheckoutBtn = document.getElementById("cart-checkout-btn");
  const cartSubtotalVal = document.getElementById("cart-subtotal-val");
  const cartDiscountRow = document.getElementById("cart-discount-row");
  const cartDiscountVal = document.getElementById("cart-discount-val");
  const cartTotalVal = document.getElementById("cart-total-val");
  const cartCouponInput = document.getElementById("cart-coupon-input");
  const cartCouponBtn = document.getElementById("cart-coupon-btn");
  const couponFeedback = document.getElementById("coupon-feedback");

  const checkoutModal = document.getElementById("checkout-modal");
  const checkoutModalCard = document.getElementById("checkout-modal-card");
  const checkoutModalClose = document.getElementById("checkout-modal-close");
  const checkoutForm = document.getElementById("checkout-form");
  const checkoutSubmitBtn = document.getElementById("checkout-submit-btn");
  const checkoutRecapItems = document.getElementById("checkout-recap-items");
  const checkoutRecapTotal = document.getElementById("checkout-recap-total");

  const successModal = document.getElementById("success-modal");
  const successModalCard = document.getElementById("success-modal-card");
  const successOrderId = document.getElementById("success-order-id");
  const successOrderTotal = document.getElementById("success-order-total");
  const successWhatsappBtn = document.getElementById("success-whatsapp-btn");
  const successContinueBtn = document.getElementById("success-continue-btn");

  // State Management
  let discountMultiplier = 1.0; // 1.0 = no discount, 0.85 = 15% off
  let appliedCoupon = "";

  // --- Cart Drawer Animation Logic ---
  function openCartDrawer() {
    // Re-render items to show fresh data
    renderCartDrawerItems();
    
    cartDrawer.classList.remove("translate-x-full");
    cartDrawerBackdrop.classList.remove("opacity-0", "pointer-events-none");
    cartDrawerBackdrop.classList.add("opacity-100", "pointer-events-auto");
    document.body.classList.add("overflow-hidden");
  }

  function closeCartDrawer() {
    cartDrawer.classList.add("translate-x-full");
    cartDrawerBackdrop.classList.remove("opacity-100", "pointer-events-auto");
    cartDrawerBackdrop.classList.add("opacity-0", "pointer-events-none");
    document.body.classList.remove("overflow-hidden");
  }

  // Bind Open/Close triggers
  window.addEventListener("fp_open_cart", openCartDrawer);
  cartDrawerClose.addEventListener("click", closeCartDrawer);
  cartDrawerBackdrop.addEventListener("click", closeCartDrawer);

  // --- Dynamic Items Rendering ---
  function getCart() {
    return JSON.parse(localStorage.getItem("fp_cart") || "[]");
  }

  function saveCart(cart) {
    localStorage.setItem("fp_cart", JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("fp_cart_updated"));
    renderCartDrawerItems();
  }

  function renderCartDrawerItems() {
    const cart = getCart();
    
    // Total count of items
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartDrawerCount.innerText = totalCount;

    if (cart.length === 0) {
      // Empty State Layout
      cartDrawerItems.innerHTML = `
        <div class="flex flex-col items-center justify-center py-20 text-center space-y-6">
          <div class="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 border border-stone-200 shadow-inner">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div class="space-y-2">
            <h3 class="font-serif text-sm uppercase tracking-widest text-[#1A1A1A]">Your bag is empty</h3>
            <p class="text-[11px] text-[#8A8A8A] font-light leading-relaxed max-w-[200px]">Add hand-crafted luxury items to begin your couture journey.</p>
          </div>
          <button 
            id="cart-drawer-empty-shop-btn" 
            class="px-6 py-3 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-xs uppercase tracking-widest font-semibold rounded-xl transition-all focus:outline-none"
          >
            Start Shopping
          </button>
        </div>
      `;

      // Hide footer pricing blocks & checkout CTA
      document.getElementById("cart-drawer-footer").classList.add("hidden");

      // Bind shop button in empty state
      const startShoppingBtn = document.getElementById("cart-drawer-empty-shop-btn");
      if (startShoppingBtn) {
        startShoppingBtn.addEventListener("click", () => {
          closeCartDrawer();
          const collectionSection = document.getElementById("collection");
          if (collectionSection) {
            collectionSection.scrollIntoView({ behavior: "smooth" });
          }
        });
      }
      return;
    }

    // Show footer block if there are items
    document.getElementById("cart-drawer-footer").classList.remove("hidden");

    // Populate active items list
    cartDrawerItems.innerHTML = cart.map((item, index) => {
      const itemImg = item.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80";
      return `
        <div class="flex items-center gap-4 bg-stone-50 border border-[#E5E3DF] p-3 rounded-2xl group animate-fadeIn">
          <!-- Image -->
          <div class="w-16 h-20 bg-stone-100 rounded-xl overflow-hidden flex-shrink-0 border border-[#E5E3DF]">
            <img src="${itemImg}" class="w-full h-full object-cover" />
          </div>

          <!-- Description and Controls -->
          <div class="flex-grow flex flex-col justify-between h-20 py-0.5">
            <div class="flex justify-between items-start gap-1">
              <div>
                <h4 class="text-xs font-semibold text-[#1A1A1A] line-clamp-1 leading-tight">${item.title}</h4>
                <p class="text-[9px] uppercase tracking-widest text-[#C5A880] font-bold mt-1">Size: ${item.size}</p>
              </div>
              <button 
                class="cart-item-remove-btn text-[#8A8A8A] hover:text-rose-600 transition-colors focus:outline-none text-[10px]" 
                data-index="${index}"
                title="Remove Item"
              >
                ✕
              </button>
            </div>

            <div class="flex justify-between items-center mt-2">
              <!-- Quantity +/- Counter -->
              <div class="flex items-center border border-[#E5E3DF] rounded-lg overflow-hidden h-7 bg-white">
                <button 
                  class="cart-qty-dec w-7 h-full flex items-center justify-center hover:bg-stone-50 font-bold focus:outline-none select-none text-[#5A5A5A]"
                  data-index="${index}"
                >-</button>
                <span class="w-7 text-center font-bold text-[10px] text-[#1A1A1A]">${item.quantity}</span>
                <button 
                  class="cart-qty-inc w-7 h-full flex items-center justify-center hover:bg-stone-50 font-bold focus:outline-none select-none text-[#5A5A5A]"
                  data-index="${index}"
                >+</button>
              </div>

              <!-- Price -->
              <span class="text-xs font-bold text-[#1A1A1A]">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = Math.round(subtotal * (1 - discountMultiplier));
    const totalPayable = subtotal - discount;

    cartSubtotalVal.innerText = `₹${subtotal.toLocaleString('en-IN')}`;
    
    if (discount > 0) {
      cartDiscountRow.classList.remove("hidden");
      cartDiscountVal.innerText = `-₹${discount.toLocaleString('en-IN')}`;
    } else {
      cartDiscountRow.classList.add("hidden");
    }

    cartTotalVal.innerText = `₹${totalPayable.toLocaleString('en-IN')}`;

    // Bind item action listeners
    attachItemListeners();
  }

  function attachItemListeners() {
    const decBtns = cartDrawerItems.querySelectorAll(".cart-qty-dec");
    const incBtns = cartDrawerItems.querySelectorAll(".cart-qty-inc");
    const removeBtns = cartDrawerItems.querySelectorAll(".cart-item-remove-btn");

    decBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.getAttribute("data-index"));
        const cart = getCart();
        if (cart[index].quantity > 1) {
          cart[index].quantity--;
          saveCart(cart);
        }
      });
    });

    incBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.getAttribute("data-index"));
        const cart = getCart();
        cart[index].quantity++;
        saveCart(cart);
      });
    });

    removeBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.getAttribute("data-index"));
        const cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
      });
    });
  }

  // --- Coupon Logic ---
  cartCouponBtn.addEventListener("click", () => {
    const rawVal = cartCouponInput.value.trim().toUpperCase();
    
    if (rawVal === "FESTIVE2026" || rawVal === "PALETTEGOLD") {
      discountMultiplier = 0.85; // 15% off
      appliedCoupon = rawVal;
      couponFeedback.innerText = "✓ 15% OFF Coupon Applied Successfully!";
      couponFeedback.className = "text-[9px] font-semibold mt-1 text-emerald-600 animate-fadeIn";
      couponFeedback.classList.remove("hidden");
    } else if (rawVal === "") {
      discountMultiplier = 1.0;
      appliedCoupon = "";
      couponFeedback.classList.add("hidden");
    } else {
      discountMultiplier = 1.0;
      appliedCoupon = "";
      couponFeedback.innerText = "✕ Invalid promo code. Try FESTIVE2026";
      couponFeedback.className = "text-[9px] font-semibold mt-1 text-rose-600 animate-fadeIn";
      couponFeedback.classList.remove("hidden");
    }

    renderCartDrawerItems();
  });

  // Re-render when cart updating elsewhere
  window.addEventListener("fp_cart_updated", renderCartDrawerItems);

  // --- Checkout Modal Control Logic ---
  function openCheckoutModal() {
    closeCartDrawer();
    
    // Fill order summary recap
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = Math.round(subtotal * (1 - discountMultiplier));
    const totalPayable = subtotal - discount;

    checkoutRecapItems.innerHTML = cart.map(item => `
      <div class="flex justify-between items-center py-1">
        <span class="text-[#5A5A5A] font-light leading-tight truncate max-w-[280px]">
          ${item.title} <span class="text-[#C5A880] font-bold text-[9px] uppercase">(${item.size})</span> x ${item.quantity}
        </span>
        <span class="font-semibold text-[#1A1A1A]">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
      </div>
    `).join("");

    if (discount > 0) {
      checkoutRecapItems.innerHTML += `
        <div class="flex justify-between items-center py-1.5 border-t border-[#E5E3DF] text-emerald-600 font-semibold text-[11px]">
          <span>Discount Applied (${appliedCoupon})</span>
          <span>-₹${discount.toLocaleString('en-IN')}</span>
        </div>
      `;
    }

    checkoutRecapTotal.innerText = `₹${totalPayable.toLocaleString('en-IN')}`;

    // Select default COD card styling
    selectPaymentMethod("COD");

    // Clear form inputs
    checkoutForm.reset();

    // Show modal
    checkoutModal.classList.remove("opacity-0", "pointer-events-none");
    checkoutModal.classList.add("opacity-100", "pointer-events-auto");
    
    setTimeout(() => {
      checkoutModalCard.classList.remove("scale-95", "opacity-0");
      checkoutModalCard.classList.add("scale-100", "opacity-100");
    }, 50);

    document.body.classList.add("overflow-hidden");
  }

  function closeCheckoutModal() {
    checkoutModalCard.classList.remove("scale-100", "opacity-100");
    checkoutModalCard.classList.add("scale-95", "opacity-0");
    
    checkoutModal.classList.remove("opacity-100", "pointer-events-auto");
    checkoutModal.classList.add("opacity-0", "pointer-events-none");
    
    setTimeout(() => {
      document.body.classList.remove("overflow-hidden");
    }, 300);
  }

  cartCheckoutBtn.addEventListener("click", openCheckoutModal);
  checkoutModalClose.addEventListener("click", closeCheckoutModal);

  // Close checkout modal on clicking backdrop
  checkoutModal.addEventListener("click", (e) => {
    if (e.target === checkoutModal) closeCheckoutModal();
  });

  // --- Payment Method Toggle Logic ---
  const payCodCard = document.getElementById("pay-cod-card");
  const payUpiCard = document.getElementById("pay-upi-card");
  const upiDetailsBox = document.getElementById("upi-details-box");

  function selectPaymentMethod(method) {
    const codRadio = payCodCard.querySelector("input");
    const upiRadio = payUpiCard.querySelector("input");

    if (method === "COD") {
      codRadio.checked = true;
      payCodCard.className = "cursor-pointer border border-[#1A1A1A] bg-stone-50 rounded-xl p-3.5 flex flex-col space-y-1.5 transition-all shadow-xs relative";
      payUpiCard.className = "cursor-pointer border border-[#E5E3DF] bg-white rounded-xl p-3.5 flex flex-col space-y-1.5 transition-all relative hover:border-[#1A1A1A]";
      upiDetailsBox.classList.add("hidden");
      checkoutSubmitBtn.innerText = "Place Order via Cash on Delivery";
    } else {
      upiRadio.checked = true;
      payUpiCard.className = "cursor-pointer border border-[#1A1A1A] bg-stone-50 rounded-xl p-3.5 flex flex-col space-y-1.5 transition-all shadow-xs relative";
      payCodCard.className = "cursor-pointer border border-[#E5E3DF] bg-white rounded-xl p-3.5 flex flex-col space-y-1.5 transition-all relative hover:border-[#1A1A1A]";
      upiDetailsBox.classList.remove("hidden");
      checkoutSubmitBtn.innerText = "Place Order via UPI Transfer";
    }
  }

  payCodCard.addEventListener("click", (e) => {
    selectPaymentMethod("COD");
  });

  payUpiCard.addEventListener("click", (e) => {
    selectPaymentMethod("UPI");
  });

  // --- Order Dispatch & Submit Actions ---
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("chk-name").value.trim();
    const phone = document.getElementById("chk-phone").value.trim();
    const pincode = document.getElementById("chk-pincode").value.trim();
    const address = document.getElementById("chk-address").value.trim();
    const city = document.getElementById("chk-city").value.trim();
    const state = document.getElementById("chk-state").value.trim();
    
    // Check validation again (Vite builds require strict checks)
    if (phone.length !== 10 || isNaN(phone)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (pincode.length !== 6 || isNaN(pincode)) {
      alert("Please enter a valid 6-digit delivery pincode.");
      return;
    }

    const payMethod = checkoutForm.elements["pay-method"].value;
    const cart = getCart();

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = Math.round(subtotal * (1 - discountMultiplier));
    const total = subtotal - discount;

    // Generate Order ID (Format #FP-XXXX)
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `#FP-${randomNum}`;

    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('en-IN'),
      customerName: name,
      phone: phone,
      pincode: pincode,
      address: address,
      city: city,
      state: state,
      items: cart,
      total: total,
      paymentMethod: payMethod === "COD" ? "Cash on Delivery (COD)" : "Prepaid / UPI Transfer",
      status: "Pending Dispatch"
    };

    // Save order details directly to Firestore and mirror in localStorage
    saveOrderToCloud(newOrder);

    // Clear cart and dispatch updates
    localStorage.removeItem("fp_cart");
    window.dispatchEvent(new CustomEvent("fp_cart_updated"));
    
    // Reset coupon code settings
    discountMultiplier = 1.0;
    appliedCoupon = "";
    cartCouponInput.value = "";
    couponFeedback.classList.add("hidden");

    // Transition from Checkout Modal to Success Modal
    closeCheckoutModal();
    setTimeout(() => {
      openSuccessModal(newOrder);
    }, 400);
  });

  // --- Success Modal Control Logic ---
  function openSuccessModal(order) {
    successOrderId.innerText = order.id;
    successOrderTotal.innerText = `₹${order.total.toLocaleString('en-IN')}`;

    // Build the WhatsApp confirmation link details
    const itemsText = order.items.map(item => `- ${item.title} (${item.size}) x ${item.quantity} [₹${(item.price * item.quantity).toLocaleString('en-IN')}]`).join("%0A");
    
    const whatsappMessage = `HELLO FASHIONPALETTE! I WOULD LIKE TO CONFIRM MY ORDER:%0A%0A` +
      `ORDER ID: *${order.id}*%0A` +
      `DATE: ${order.date}%0A` +
      `CUSTOMER: *${order.customerName}*%0A` +
      `PHONE: +91 ${order.phone}%0A` +
      `ADDRESS: ${order.address}, ${order.city}, ${order.state} - ${order.pincode}%0A` +
      `PAYMENT: ${order.paymentMethod}%0A%0A` +
      `ITEMS:%0A${itemsText}%0A%0A` +
      `TOTAL PAYABLE: *₹${order.total.toLocaleString('en-IN')}*%0A%0A` +
      `ESTIMATED DISPATCH: 24–48 Hours. Pan-India Delivery in 4–7 Days.`;

    // Clean store business phone number for links
    const cleanPhone = storeConfig.contact.phone.replace(/[^0-9]/g, "");
    successWhatsappBtn.href = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

    // Show Success Modal
    successModal.classList.remove("opacity-0", "pointer-events-none");
    successModal.classList.add("opacity-100", "pointer-events-auto");
    
    setTimeout(() => {
      successModalCard.classList.remove("scale-95", "opacity-0");
      successModalCard.classList.add("scale-100", "opacity-100");
    }, 50);

    document.body.classList.add("overflow-hidden");
  }

  function closeSuccessModal() {
    successModalCard.classList.remove("scale-100", "opacity-100");
    successModalCard.classList.add("scale-95", "opacity-0");
    
    successModal.classList.remove("opacity-100", "pointer-events-auto");
    successModal.classList.add("opacity-0", "pointer-events-none");
    
    setTimeout(() => {
      document.body.classList.remove("overflow-hidden");
    }, 300);
  }

  successContinueBtn.addEventListener("click", () => {
    closeSuccessModal();
    const collectionSection = document.getElementById("collection");
    if (collectionSection) {
      collectionSection.scrollIntoView({ behavior: "smooth" });
    }
  });

  // Initial render on mount
  renderCartDrawerItems();
}
