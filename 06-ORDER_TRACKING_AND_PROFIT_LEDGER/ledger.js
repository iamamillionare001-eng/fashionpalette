/**
 * ORDER TRACKING CONCIERGE COMPONENT
 * Handles live shipment state verification and delivery progress lookup for customers.
 * All founder financial ledgers and profit margins reside strictly inside the PIN-locked Admin Console.
 */

import { storeConfig } from '../07-STORE_SETTINGS_AND_THEME_COLORS/store_config.js';

export function initLedger(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <section id="order-tracking" class="py-20 border-t border-[#E5E3DF] bg-[#F9F8F6]">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Order Tracking Lookup Card (Centered Public Customer View) -->
        <div class="bg-white border border-[#E5E3DF] p-6 sm:p-10 rounded-3xl shadow-sm space-y-6">
          <div class="text-center space-y-2">
            <span class="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-bold block">Concierge & Logistics</span>
            <h2 class="text-2xl sm:text-3xl font-serif font-light text-[#1A1A1A]">Track Your Shipment</h2>
            <div class="h-[1.5px] w-10 bg-[#C5A880] mx-auto mt-2"></div>
            <p class="text-xs text-[#5A5A5A] font-light leading-relaxed max-w-md mx-auto pt-2">
              Verify the fulfillment, packing, and dispatch progress of your festive apparel order across India.
            </p>
          </div>

          <form id="tracking-lookup-form" class="space-y-4" onsubmit="event.preventDefault();">
            <div>
              <label class="block text-[9px] uppercase tracking-wider text-[#5A5A5A] font-bold mb-1.5">Order Reference ID</label>
              <div class="flex flex-col sm:flex-row gap-2">
                <input 
                  type="text" 
                  id="tracking-id-input" 
                  placeholder="e.g. #FP-8947" 
                  class="flex-grow bg-[#F9F8F6] border border-[#E5E3DF] px-4 py-3 min-h-[48px] text-xs rounded-xl focus:outline-none focus:border-[#C5A880] uppercase tracking-widest text-[#1A1A1A]" 
                />
                <button 
                  type="submit" 
                  id="tracking-submit-btn" 
                  class="px-8 bg-[#1A1A1A] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#C5A880] hover:text-[#1A1A1A] transition-all min-h-[48px] rounded-xl flex items-center justify-center shadow-xs"
                >
                  Verify Status
                </button>
              </div>
            </div>
          </form>

          <!-- Dynamic Tracking Status Result Card -->
          <div id="tracking-result-box" class="p-5 bg-[#F9F8F6] border border-[#E5E3DF] rounded-2xl space-y-3">
            <div class="flex flex-wrap justify-between items-center gap-2">
              <div>
                <p class="font-bold text-xs text-[#1A1A1A] font-mono" id="tracking-display-id">Sample Order: #FP-8947</p>
                <p class="text-[10px] text-[#8A8A8A]" id="tracking-display-date">Express Pan-India Logistics</p>
              </div>
              <span id="tracking-status-badge" class="text-[10px] uppercase tracking-wider px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-bold">
                In Transit
              </span>
            </div>

            <!-- Progress Bar -->
            <div class="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
              <div id="tracking-progress-bar" class="bg-[#C5A880] h-full w-2/3 transition-all duration-500"></div>
            </div>

            <div class="flex justify-between text-[8px] uppercase tracking-wider text-[#8A8A8A] font-bold">
              <span>Order Received</span>
              <span>Packed & Dispatched</span>
              <span>Delivered</span>
            </div>

            <p id="tracking-details-text" class="text-[10px] text-[#5A5A5A] leading-relaxed pt-1">
              Fulfillment in progress via Express Surface Logistics. Estimated delivery in 3–5 business days.
            </p>
          </div>

          <!-- Help / Direct WhatsApp Contact -->
          <div class="border-t border-[#E5E3DF]/60 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5A5A5A]">
            <span class="text-[11px] font-light">Have questions about your delivery address or dispatch?</span>
            <a 
              href="https://wa.me/${storeConfig.contact.phone.replace(/[^0-9]/g, '')}?text=Hello%20FashionPalette,%20I%20have%20an%20inquiry%20regarding%20my%20order%20shipment." 
              target="_blank" 
              class="text-[#C5A880] hover:text-[#1A1A1A] font-bold text-[10px] uppercase tracking-widest transition-colors flex items-center gap-1.5"
            >
              <span>Contact Concierge</span>
              <span>&rarr;</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  `;

  // Hook up live tracking query lookup
  const form = document.getElementById('tracking-lookup-form');
  const input = document.getElementById('tracking-id-input');
  const displayId = document.getElementById('tracking-display-id');
  const displayDate = document.getElementById('tracking-display-date');
  const statusBadge = document.getElementById('tracking-status-badge');
  const progressBar = document.getElementById('tracking-progress-bar');
  const detailsText = document.getElementById('tracking-details-text');

  if (form && input) {
    form.addEventListener('submit', () => {
      let query = input.value.trim().toUpperCase();
      if (!query) {
        alert("Please enter an Order ID (e.g. #FP-1234)");
        return;
      }
      if (!query.startsWith("#")) {
        query = "#" + query;
      }

      // Check in local/cloud stored orders
      const orders = JSON.parse(localStorage.getItem('fp_orders_data') || '[]');
      const foundOrder = orders.find(o => o.id.toUpperCase() === query);

      if (foundOrder) {
        displayId.innerText = `Order: ${foundOrder.id} (${foundOrder.customerName})`;
        displayDate.innerText = `Placed on ${foundOrder.date} • Total: ₹${foundOrder.total.toLocaleString('en-IN')}`;
        
        const status = foundOrder.status || "Pending Dispatch";
        statusBadge.innerText = status;

        if (status === "Delivered") {
          statusBadge.className = "text-[10px] uppercase tracking-wider px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-bold";
          progressBar.style.width = "100%";
          progressBar.className = "bg-emerald-600 h-full transition-all duration-500";
          detailsText.innerText = `✓ Your parcel has been successfully delivered to ${foundOrder.city}, ${foundOrder.state}. Thank you for choosing ${storeConfig.storeName}.`;
        } else if (status === "Dispatched") {
          statusBadge.className = "text-[10px] uppercase tracking-wider px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full font-bold";
          progressBar.style.width = "66%";
          progressBar.className = "bg-blue-600 h-full transition-all duration-500";
          detailsText.innerText = `Parcel is in transit to ${foundOrder.city} (${foundOrder.pincode}) via Express Logistics Partner. Delivery expected in 24–48 hours.`;
        } else if (status === "Cancelled") {
          statusBadge.className = "text-[10px] uppercase tracking-wider px-3 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-full font-bold";
          progressBar.style.width = "100%";
          progressBar.className = "bg-rose-600 h-full transition-all duration-500";
          detailsText.innerText = `This order was cancelled. Please contact concierge support if you need further assistance.`;
        } else {
          // Pending Dispatch / Pending Confirmation
          statusBadge.className = "text-[10px] uppercase tracking-wider px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-bold";
          progressBar.style.width = "33%";
          progressBar.className = "bg-[#C5A880] h-full transition-all duration-500";
          detailsText.innerText = `Order confirmed and is being quality-checked and packaged at our central fulfillment atelier. Dispatch scheduled within 24 hours.`;
        }
      } else {
        displayId.innerText = `Lookup: ${query}`;
        displayDate.innerText = `Status Query`;
        statusBadge.innerText = "Order In Verification";
        statusBadge.className = "text-[10px] uppercase tracking-wider px-3 py-1 bg-stone-100 text-stone-700 border border-stone-300 rounded-full font-bold";
        progressBar.style.width = "25%";
        progressBar.className = "bg-[#C5A880] h-full transition-all duration-500";
        detailsText.innerText = `Order ID ${query} is currently processing or queued for carrier intake. If you placed this order recently, please allow 1–2 hours for tracking synchronization.`;
      }
    });
  }
}
