/**
 * GLOBAL FOOTER & FLOATING WHATSAPP CONCIERGE WIDGET
 * Handles value assurance grids, expandable FAQ sections, brand editorial footers,
 * and a bottom-right floating concierge widget for WhatsApp assistance.
 */

import { storeConfig } from '../07-STORE_SETTINGS_AND_THEME_COLORS/store_config.js';

function init() {
  const container = document.getElementById("footer-container");
  if (!container || container.dataset.initialized === "true") return;
  container.dataset.initialized = "true";

  // Add custom styling for FAQ transition and animations
  const style = document.createElement('style');
  style.textContent = `
    .faq-answer {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1), padding 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .faq-answer.open {
      max-height: 160px;
      padding-top: 12px;
      padding-bottom: 4px;
    }
    .faq-chevron {
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .faq-chevron.rotate {
      transform: rotate(180deg);
    }
    .wa-card-transition {
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
  `;
  document.head.appendChild(style);

  // Render HTML Structure
  container.innerHTML = `
    <!-- 1. TRUST ASSURANCE STRIP -->
    <section class="bg-white border-t border-[#E5E3DF] py-16 w-full">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <!-- Assurance 1 -->
          <div class="flex flex-col items-center text-center space-y-2">
            <span class="text-2xl text-[#C5A880]">✨</span>
            <h4 class="text-xs uppercase tracking-widest font-bold text-[#1A1A1A]">Handcrafted Quality</h4>
            <p class="text-[10px] text-[#5A5A5A] max-w-[200px] leading-relaxed font-light">Verified pure Chanderi silks, handloom linens & organic cottons.</p>
          </div>

          <!-- Assurance 2 -->
          <div class="flex flex-col items-center text-center space-y-2">
            <span class="text-2xl text-[#C5A880]">🚚</span>
            <h4 class="text-xs uppercase tracking-widest font-bold text-[#1A1A1A]">Pan-India Shipping</h4>
            <p class="text-[10px] text-[#5A5A5A] max-w-[200px] leading-relaxed font-light">Complimentary tracked delivery serving 19,000+ PIN codes.</p>
          </div>

          <!-- Assurance 3 -->
          <div class="flex flex-col items-center text-center space-y-2">
            <span class="text-2xl text-[#C5A880]">🔄</span>
            <h4 class="text-xs uppercase tracking-widest font-bold text-[#1A1A1A]">Easy Size Exchanges</h4>
            <p class="text-[10px] text-[#5A5A5A] max-w-[200px] leading-relaxed font-light">7-day hassle-free replacement support for the perfect fit.</p>
          </div>

          <!-- Assurance 4 -->
          <div class="flex flex-col items-center text-center space-y-2">
            <span class="text-2xl text-[#C5A880]">💳</span>
            <h4 class="text-xs uppercase tracking-widest font-bold text-[#1A1A1A]">Cash on Delivery</h4>
            <p class="text-[10px] text-[#5A5A5A] max-w-[200px] leading-relaxed font-light">Zero advance transaction fees. Pay at doorstep or via UPI.</p>
          </div>

        </div>
      </div>
    </section>

    <!-- 2. EXPANDABLE FAQ ACCORDION -->
    <section class="bg-[#F5F4F0] border-t border-[#E5E3DF] py-20 w-full">
      <div class="max-w-3xl mx-auto px-4 sm:px-6">
        
        <!-- FAQ Title -->
        <div class="text-center mb-12 space-y-3">
          <span class="text-[9px] uppercase tracking-[0.25em] text-[#C5A880] font-bold block">Assistance & Inquiry</span>
          <h2 class="text-2xl font-serif text-[#1A1A1A] uppercase tracking-wider font-light">Frequently Asked Questions</h2>
          <div class="h-[1px] w-10 bg-[#C5A880] mx-auto mt-2.5"></div>
        </div>

        <!-- FAQ Items -->
        <div class="space-y-4">
          <!-- Item 1 -->
          <div class="border border-[#E5E3DF] rounded-2xl bg-white overflow-hidden shadow-xs">
            <button class="faq-header-btn w-full px-6 py-4.5 text-left flex justify-between items-center focus:outline-none">
              <span class="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">How long will my order take to arrive?</span>
              <svg class="faq-chevron w-4 h-4 text-[#C5A880]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div class="faq-answer px-6 text-xs text-[#5A5A5A] leading-relaxed font-light">
              All luxury garments are dispatched from our Taj Mansingh boulevard facility within 24–48 hours of order confirmation. Pan-India express delivery typically takes 4–7 business days, and complete WhatsApp tracking links will be shared.
            </div>
          </div>

          <!-- Item 2 -->
          <div class="border border-[#E5E3DF] rounded-2xl bg-white overflow-hidden shadow-xs">
            <button class="faq-header-btn w-full px-6 py-4.5 text-left flex justify-between items-center focus:outline-none">
              <span class="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">Is Cash on Delivery (COD) supported?</span>
              <svg class="faq-chevron w-4 h-4 text-[#C5A880]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div class="faq-answer px-6 text-xs text-[#5A5A5A] leading-relaxed font-light">
              Yes, Cash on Delivery is fully supported across all serviceable domestic PIN codes without extra transactional markups. You can also pay the delivery agent via instant UPI upon doorstep package handoff.
            </div>
          </div>

          <!-- Item 3 -->
          <div class="border border-[#E5E3DF] rounded-2xl bg-white overflow-hidden shadow-xs">
            <button class="faq-header-btn w-full px-6 py-4.5 text-left flex justify-between items-center focus:outline-none">
              <span class="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">What if the size doesn't fit?</span>
              <svg class="faq-chevron w-4 h-4 text-[#C5A880]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div class="faq-answer px-6 text-xs text-[#5A5A5A] leading-relaxed font-light">
              We offer a seamless 7-day size replacement and exchange window for all unworn garments with original tags intact. Simply contact our support concierge, and we will coordinate a complimentary reverse pickup from your address.
            </div>
          </div>

          <!-- Item 4 -->
          <div class="border border-[#E5E3DF] rounded-2xl bg-white overflow-hidden shadow-xs">
            <button class="faq-header-btn w-full px-6 py-4.5 text-left flex justify-between items-center focus:outline-none">
              <span class="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">How do sizes work for Couple Matching sets?</span>
              <svg class="faq-chevron w-4 h-4 text-[#C5A880]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div class="faq-answer px-6 text-xs text-[#5A5A5A] leading-relaxed font-light">
              Our Twinned Couple sets allow complete sizing freedom. You can select separate sizes (e.g. Women M and Men XL) on the card/modal size selectors during checkout, or request custom adjustments directly through our styling assistants via the WhatsApp Concierge widget.
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- 3. EDITORIAL GLOBAL FOOTER -->
    <footer class="bg-[#1A1A1A] text-[#F9F8F6]/80 pt-16 pb-12 border-t border-stone-850 w-full mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-stone-800 border-opacity-40">
          
          <!-- Column 1: Monogram & Bio (col-span-4) -->
          <div class="lg:col-span-4 space-y-5">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 flex items-center justify-center border border-[#C5A880] rounded-full">
                <svg width="40" height="40" viewBox="0 0 100 100" class="w-full h-full text-white">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width="1" class="opacity-30" />
                  <text x="32" y="62" font-family="'Playfair Display', serif" font-size="44" font-weight="300" fill="currentColor">F</text>
                  <text x="50" y="68" font-family="'Playfair Display', serif" font-size="44" font-style="italic" font-weight="300" fill="#C5A880">P</text>
                </svg>
              </div>
              <div class="leading-none">
                <span class="font-serif text-lg tracking-[0.2em] uppercase font-light text-white leading-none">
                  ${storeConfig.storeName}
                </span>
                <span class="text-[7px] tracking-[0.22em] uppercase text-[#C5A880] block mt-1">
                  Haute Couture Atelier
                </span>
              </div>
            </div>
            
            <p class="text-[10px] text-[#A3A3A3] leading-relaxed font-light">
              Crafting premium luxury apparel coordinated for Ganesh Chaturthi and festive events. Experience the finest selection of hand-crafted ethnic collections, designed for modern elegance.
            </p>
            
            <!-- Social Placeholder Icons -->
            <div class="flex items-center space-x-4">
              <a href="#" class="w-7 h-7 rounded-full bg-stone-800 flex items-center justify-center hover:bg-[#C5A880] hover:text-[#1A1A1A] transition-colors duration-300">
                <span class="text-[9px] font-bold tracking-tighter text-white">IG</span>
              </a>
              <a href="#" class="w-7 h-7 rounded-full bg-stone-800 flex items-center justify-center hover:bg-[#C5A880] hover:text-[#1A1A1A] transition-colors duration-300">
                <span class="text-[9px] font-bold tracking-tighter text-white">FB</span>
              </a>
              <a href="#" class="w-7 h-7 rounded-full bg-stone-800 flex items-center justify-center hover:bg-[#C5A880] hover:text-[#1A1A1A] transition-colors duration-300">
                <span class="text-[9px] font-bold tracking-tighter text-white">WA</span>
              </a>
            </div>
          </div>

          <!-- Column 2: Departments (col-span-3) -->
          <div class="lg:col-span-3 space-y-4">
            <h4 class="text-[10px] uppercase tracking-[0.2em] text-[#C5A880] font-bold">Departments</h4>
            <ul class="space-y-2 text-[11px] font-light text-[#A3A3A3] list-none p-0 m-0">
              <li><a href="#women" class="hover:text-white transition-colors text-inherit no-underline">Women's Sarees & Couture</a></li>
              <li><a href="#men" class="hover:text-white transition-colors text-inherit no-underline">Men's Designer Kurtas</a></li>
              <li><a href="#couple" class="hover:text-white transition-colors text-inherit no-underline">Coordinated Couple Sets</a></li>
              <li><a href="#kids" class="hover:text-white transition-colors text-inherit no-underline">Kids Traditional Outfits</a></li>
              <li><a href="#elders" class="hover:text-white transition-colors text-inherit no-underline">Elders Organic Linens</a></li>
            </ul>
          </div>

          <!-- Column 3: Customer Care (col-span-3) -->
          <div class="lg:col-span-3 space-y-4">
            <h4 class="text-[10px] uppercase tracking-[0.2em] text-[#C5A880] font-bold">Customer Care</h4>
            <ul class="space-y-2 text-[11px] font-light text-[#A3A3A3] list-none p-0 m-0">
              <li><a href="#order-tracking" class="hover:text-white transition-colors text-inherit no-underline">Track Your Order</a></li>
              <li><a href="#" class="hover:text-white transition-colors text-inherit no-underline">Shipping Policy & Coverage</a></li>
              <li><a href="#" class="hover:text-white transition-colors text-inherit no-underline">Exchange & Refund Guidelines</a></li>
              <li><a href="#" class="hover:text-white transition-colors text-inherit no-underline">Atelier Terms of Service</a></li>
            </ul>
          </div>

          <!-- Column 4: Private Concierge Trigger (col-span-2) -->
          <div class="lg:col-span-2 space-y-4">
            <h4 class="text-[10px] uppercase tracking-[0.2em] text-[#C5A880] font-bold">Administration</h4>
            <div class="pt-1">
              <span 
                id="founder-trigger" 
                class="cursor-pointer border border-stone-800 hover:border-[#C5A880] hover:text-[#C5A880] px-4 py-2.5 rounded-lg text-[9px] uppercase tracking-widest font-bold bg-[#1A1A1A] hover:bg-stone-800 block text-center transition-all duration-300"
              >
                Private Concierge
              </span>
              <p class="text-[8px] text-[#555555] text-center mt-2 leading-relaxed uppercase tracking-wider font-light">Founder Console Login PIN required.</p>
            </div>
          </div>

        </div>

        <!-- Copyright Row -->
        <div class="pt-8 flex flex-col md:flex-row items-center justify-between text-[#8A8A8A] text-[9px] uppercase tracking-widest font-light gap-4">
          <div>
            &copy; 2026 ${storeConfig.storeName} Luxury Group. All Rights Reserved.
          </div>
          <div class="flex space-x-6">
            <a href="#" class="hover:text-white transition-colors text-inherit no-underline">Privacy Policy</a>
            <a href="#" class="hover:text-white transition-colors text-inherit no-underline">Security Terms</a>
          </div>
        </div>

      </div>
    </footer>

    <!-- 4. FLOATING LUXURY WHATSAPP CONCIERGE WIDGET -->
    <div 
      id="wa-concierge-pill" 
      class="fixed bottom-6 right-6 z-[60] flex items-center gap-2 bg-[#105e49] hover:bg-[#075E54] text-white font-semibold text-[10px] uppercase tracking-widest px-4.5 py-3.5 rounded-full shadow-2xl transition-all hover:scale-105 cursor-pointer select-none"
    >
      <!-- Minimal WhatsApp Icon -->
      <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.451L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.59 2.015 14.117.99 11.5.99c-5.441 0-9.866 4.372-9.87 9.802 0 1.706.452 3.375 1.312 4.846l-.996 3.639 3.738-.971zM17.65 14.7c-.305-.152-1.804-.89-2.083-.992-.279-.101-.482-.152-.684.152-.202.304-.783.992-.96 1.193-.178.203-.356.228-.661.076-.305-.152-1.288-.475-2.453-1.514-.908-.81-1.52-1.81-1.698-2.114-.178-.305-.019-.47.133-.62.137-.136.305-.355.457-.533.152-.178.203-.304.305-.507.101-.203.05-.38-.026-.533-.076-.152-.684-1.648-.937-2.257-.247-.594-.497-.514-.684-.523-.178-.009-.38-.01-.583-.01-.203 0-.533.076-.812.38-.279.305-1.066 1.04-1.066 2.537 0 1.497 1.09 2.943 1.242 3.146.152.203 2.146 3.277 5.197 4.594.726.313 1.292.5 1.734.64.728.232 1.39.2 1.913.12.584-.088 1.804-.737 2.058-1.448.254-.71.254-1.32.178-1.448-.076-.127-.279-.203-.583-.355z"/>
      </svg>
      <span>Concierge</span>
    </div>

    <!-- WhatsApp Mini popup Card -->
    <div 
      id="wa-concierge-card" 
      class="wa-card-transition fixed bottom-20 right-6 z-[60] bg-white border border-[#E5E3DF] p-6 w-80 rounded-2xl shadow-2xl flex flex-col gap-4 transform scale-95 opacity-0 pointer-events-none"
    >
      <!-- Monogram Header -->
      <div class="flex items-center space-x-3 border-b border-[#E5E3DF] pb-3">
        <div class="w-8 h-8 rounded-full border border-[#C5A880] flex items-center justify-center text-[#C5A880] font-serif text-[10px] font-bold">
          FP
        </div>
        <div>
          <h4 class="font-serif text-xs tracking-wider uppercase font-semibold text-[#1A1A1A]">Atelier Assistance</h4>
          <p class="text-[8px] text-emerald-600 uppercase tracking-widest mt-0.5 leading-none">● Online &amp; Ready</p>
        </div>
      </div>

      <p class="text-[10px] text-[#5A5A5A] leading-relaxed font-light">
        Welcome to the FashionPalette concierge. Select an option below to initiate a private consultation:
      </p>

      <!-- Direct Assistance Options -->
      <div class="flex flex-col gap-2">
        <button 
          data-wa-option="size"
          class="w-full text-left py-2.5 px-3.5 bg-[#F9F8F6] hover:bg-emerald-50 hover:text-emerald-800 border border-[#E5E3DF] rounded-xl text-[10px] uppercase tracking-widest font-semibold transition-all focus:outline-none flex justify-between items-center"
        >
          <span>Size & Fit Guidance</span>
          <span class="text-xs">📏</span>
        </button>

        <button 
          data-wa-option="track"
          class="w-full text-left py-2.5 px-3.5 bg-[#F9F8F6] hover:bg-emerald-50 hover:text-emerald-800 border border-[#E5E3DF] rounded-xl text-[10px] uppercase tracking-widest font-semibold transition-all focus:outline-none flex justify-between items-center"
        >
          <span>Order Tracking & Status</span>
          <span class="text-xs">📦</span>
        </button>

        <button 
          data-wa-option="stylist"
          class="w-full text-left py-2.5 px-3.5 bg-[#F9F8F6] hover:bg-emerald-50 hover:text-emerald-800 border border-[#E5E3DF] rounded-xl text-[10px] uppercase tracking-widest font-semibold transition-all focus:outline-none flex justify-between items-center"
        >
          <span>Direct Stylist Chat</span>
          <span class="text-xs">👔</span>
        </button>
      </div>

      <p class="text-[8px] text-[#8A8A8A] text-center font-light uppercase tracking-wider">
        Pan-India Delivery in 4-7 Days
      </p>
    </div>
  `;

  // Bind Accordion Listeners
  const faqHeaderBtns = container.querySelectorAll(".faq-header-btn");
  faqHeaderBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const answer = btn.nextElementSibling;
      const chevron = btn.querySelector(".faq-chevron");
      
      const isOpen = answer.classList.contains("open");
      
      // Close all other answers first (Accordion style)
      faqHeaderBtns.forEach(otherBtn => {
        const otherAnswer = otherBtn.nextElementSibling;
        const otherChevron = otherBtn.querySelector(".faq-chevron");
        otherAnswer.classList.remove("open");
        otherChevron.classList.remove("rotate");
      });

      if (!isOpen) {
        answer.classList.add("open");
        chevron.classList.add("rotate");
      }
    });
  });

  // Bind WhatsApp Widget Listeners
  const waPill = document.getElementById("wa-concierge-pill");
  const waCard = document.getElementById("wa-concierge-card");

  function openWaCard() {
    waCard.classList.remove("pointer-events-none", "opacity-0", "scale-95");
    waCard.classList.add("pointer-events-auto", "opacity-100", "scale-100");
  }

  function closeWaCard() {
    waCard.classList.remove("pointer-events-auto", "opacity-100", "scale-100");
    waCard.classList.add("pointer-events-none", "opacity-0", "scale-95");
  }

  if (waPill && waCard) {
    waPill.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = waCard.classList.contains("opacity-100");
      if (isOpen) {
        closeWaCard();
      } else {
        openWaCard();
      }
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!waCard.contains(e.target) && !waPill.contains(e.target)) {
        closeWaCard();
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeWaCard();
      }
    });
  }

  // Bind WhatsApp Option Direct Links
  const waOptions = container.querySelectorAll("[data-wa-option]");
  waOptions.forEach(opt => {
    opt.addEventListener("click", () => {
      const type = opt.getAttribute("data-wa-option");
      let message = "";

      if (type === "size") {
        message = "Hello FashionPalette! I would like some guidance on finding the right size for a garment.";
      } else if (type === "track") {
        message = "Hello FashionPalette! I want to check the delivery status of my order.";
      } else {
        message = "Hello FashionPalette! I would like to chat with a personal stylist.";
      }

      const cleanPhone = storeConfig.contact.phone.replace(/[^0-9]/g, "");
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, "_blank");
      closeWaCard();
    });
  });
}

// Attach event listeners
document.addEventListener("DOMContentLoaded", init);
if (document.readyState === "interactive" || document.readyState === "complete") {
  init();
}
export { init };
