/**
 * CHECKOUT & CASH ON DELIVERY (COD) FORM PLACEHOLDER
 * Handles the visual presentation of order checkout summaries,
 * shipping address inputs, and COD verification panels.
 */

import { storeConfig } from '../07-STORE_SETTINGS_AND_THEME_COLORS/store_config.js';

export function initCheckout(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <section id="checkout" class="py-20 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Section Header -->
        <div class="text-center max-w-xl mx-auto mb-16 space-y-4">
          <span class="text-xs uppercase tracking-[0.3em] text-[var(--color-accent-gold)] font-medium block">Secure Purchasing</span>
          <h2 class="text-3xl sm:text-4xl font-light tracking-tight text-[var(--color-text-primary)]">Atelier Checkout</h2>
          <div class="h-[1px] w-12 bg-[var(--color-accent-gold)] mx-auto mt-4"></div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <!-- COD Information Form (Left) -->
          <div class="lg:col-span-7 bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] p-8 rounded-[var(--border-radius-sm)] shadow-sm">
            <h3 class="text-lg font-serif-luxury font-medium text-[var(--color-text-primary)] mb-6">1. Shipping & Cash on Delivery (COD)</h3>
            
            <form class="space-y-6" onsubmit="event.preventDefault();">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)] font-semibold mb-2">First Name</label>
                  <input type="text" placeholder="e.g. Aarav" class="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] px-4 py-3 text-sm rounded-[var(--border-radius-sm)] focus:outline-none focus:border-[var(--color-accent-gold)]" />
                </div>
                <div>
                  <label class="block text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)] font-semibold mb-2">Last Name</label>
                  <input type="text" placeholder="e.g. Sharma" class="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] px-4 py-3 text-sm rounded-[var(--border-radius-sm)] focus:outline-none focus:border-[var(--color-accent-gold)]" />
                </div>
              </div>

              <div>
                <label class="block text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)] font-semibold mb-2">Full Delivery Address</label>
                <textarea rows="3" placeholder="Suite, Street Address, Landmark" class="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] px-4 py-3 text-sm rounded-[var(--border-radius-sm)] focus:outline-none focus:border-[var(--color-accent-gold)]"></textarea>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)] font-semibold mb-2">City</label>
                  <input type="text" placeholder="e.g. Mumbai" class="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] px-4 py-3 text-sm rounded-[var(--border-radius-sm)] focus:outline-none focus:border-[var(--color-accent-gold)]" />
                </div>
                <div>
                  <label class="block text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)] font-semibold mb-2">Pincode</label>
                  <input type="text" placeholder="e.g. 400001" class="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] px-4 py-3 text-sm rounded-[var(--border-radius-sm)] focus:outline-none focus:border-[var(--color-accent-gold)]" />
                </div>
              </div>

              <div>
                <label class="block text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)] font-semibold mb-2">Mobile Phone (For WhatsApp/SMS Tracking)</label>
                <div class="flex">
                  <span class="inline-flex items-center px-4 bg-stone-100 border border-r-0 border-[var(--color-border-subtle)] text-xs text-[var(--color-text-secondary)] font-semibold rounded-l-[var(--border-radius-sm)]">+91</span>
                  <input type="tel" placeholder="9876543210" class="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] px-4 py-3 text-sm rounded-r-[var(--border-radius-sm)] focus:outline-none focus:border-[var(--color-accent-gold)]" />
                </div>
              </div>

              <div class="p-4 bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] rounded-[var(--border-radius-sm)] space-y-2">
                <div class="flex items-center space-x-2">
                  <input type="radio" checked disabled class="accent-[var(--color-accent-gold)] h-4 w-4" />
                  <span class="text-xs uppercase tracking-wider text-[var(--color-text-primary)] font-bold">Cash on Delivery (COD) Verified</span>
                </div>
                <p class="text-[10px] text-[var(--color-text-secondary)] font-light leading-relaxed pl-6">
                  Verify and pay for your luxury apparel with physical cash upon contactless doorstep handoff. Zero advance transaction charges apply.
                </p>
              </div>

              <button type="submit" class="w-full py-4 bg-[var(--color-cta-fill)] text-[var(--color-cta-text)] text-xs uppercase tracking-widest font-semibold hover:bg-[var(--color-accent-gold)] transition-colors duration-300 rounded-[var(--border-radius-sm)]">
                Place Order (COD)
              </button>
            </form>
          </div>

          <!-- Order Summary Container (Right) -->
          <div class="lg:col-span-5 bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] p-8 rounded-[var(--border-radius-sm)] shadow-sm space-y-6">
            <h3 class="text-lg font-serif-luxury font-medium text-[var(--color-text-primary)] border-b border-[var(--color-border-subtle)] pb-4">Order Summary</h3>
            
            <div class="space-y-4">
              <div class="flex justify-between items-center text-xs">
                <span class="text-[var(--color-text-secondary)] font-light">Subtotal (1 Item)</span>
                <span class="text-[var(--color-text-primary)] font-medium">${storeConfig.currency}18,500</span>
              </div>
              <div class="flex justify-between items-center text-xs">
                <span class="text-[var(--color-text-secondary)] font-light">Shipping Delivery</span>
                <span class="text-emerald-600 font-semibold uppercase tracking-wider">Free Express</span>
              </div>
              <div class="border-t border-[var(--color-border-subtle)] pt-4 flex justify-between items-center">
                <span class="text-xs uppercase tracking-wider text-[var(--color-text-primary)] font-bold">Total Amount</span>
                <span class="text-lg text-[var(--color-text-primary)] font-semibold">${storeConfig.currency}18,500</span>
              </div>
            </div>

            <!-- Trust Badges -->
            <div class="pt-4 border-t border-[var(--color-border-subtle)] grid grid-cols-2 gap-4 text-center">
              <div class="p-3 bg-[var(--color-bg-primary)] rounded-[var(--border-radius-sm)]">
                <p class="text-[9px] uppercase tracking-wider text-[var(--color-text-primary)] font-bold">100% Authentic</p>
                <p class="text-[8px] text-[var(--color-text-secondary)]">Direct from Atelier</p>
              </div>
              <div class="p-3 bg-[var(--color-bg-primary)] rounded-[var(--border-radius-sm)]">
                <p class="text-[9px] uppercase tracking-wider text-[var(--color-text-primary)] font-bold">Easy Handoff</p>
                <p class="text-[8px] text-[var(--color-text-secondary)]">No-risk verification</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  `;
}
