/**
 * ORDER TRACKING & PROFIT LEDGER COMPONENT
 * Handles checking shipment state via Order IDs and presents the
 * simple gross profit/margin ledger for store operation transparency.
 */

import { storeConfig } from '../07-STORE_SETTINGS_AND_THEME_COLORS/store_config.js';

export function initLedger(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <section id="order-tracking" class="py-20 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <!-- Order Tracking Lookup (Left) -->
          <div class="lg:col-span-6 bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] p-8 rounded-[var(--border-radius-sm)] shadow-sm space-y-6">
            <div>
              <span class="text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent-gold)] font-medium block mb-2">Concierge Services</span>
              <h2 class="text-2xl font-serif-luxury font-light text-[var(--color-text-primary)]">Track Your Shipment</h2>
              <div class="h-[1px] w-8 bg-[var(--color-accent-gold)] mt-3"></div>
            </div>

            <p class="text-xs text-[var(--color-text-secondary)] font-light leading-relaxed">
              Verify the fulfillment, packing, and dispatch status of your bespoke luxury purchases. Enter your order ID details below.
            </p>

            <form class="space-y-4" onsubmit="event.preventDefault();">
              <div>
                <label class="block text-[9px] uppercase tracking-wider text-[var(--color-text-secondary)] font-bold mb-1.5">Order Tracking Reference ID</label>
                <div class="flex">
                  <input type="text" placeholder="e.g. FP-2026-8947" class="w-full bg-[var(--color-bg-primary)] border border-r-0 border-[var(--color-border-subtle)] px-4 py-3 text-xs rounded-l-[var(--border-radius-sm)] focus:outline-none focus:border-[var(--color-accent-gold)]" />
                  <button type="submit" class="px-6 bg-[var(--color-cta-fill)] text-[var(--color-cta-text)] text-xs uppercase tracking-widest font-semibold hover:bg-[var(--color-accent-gold)] transition-colors rounded-r-[var(--border-radius-sm)]">
                    Query
                  </button>
                </div>
              </div>
            </form>

            <!-- Mock status visualization -->
            <div class="p-4 bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] rounded-[var(--border-radius-sm)] space-y-3">
              <div class="flex justify-between items-center text-xs">
                <span class="font-bold text-[var(--color-text-primary)]">Mock Status: FP-2026-8947</span>
                <span class="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-medium">In Transit</span>
              </div>
              <div class="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                <div class="bg-[var(--color-accent-gold)] h-full w-2/3"></div>
              </div>
              <p class="text-[9px] text-[var(--color-text-secondary)]">Out of New Delhi HUB via BlueDart Express (Expected delivery: August 29, 2026)</p>
            </div>
          </div>

          <!-- Profit Ledger / Gross Margin Console (Right) -->
          <div class="lg:col-span-6 bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] p-8 rounded-[var(--border-radius-sm)] shadow-sm space-y-6">
            <div>
              <span class="text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent-gold)] font-medium block mb-2">Internal Ledger</span>
              <h2 class="text-2xl font-serif-luxury font-light text-[var(--color-text-primary)]">Sales & Profit Ledger</h2>
              <div class="h-[1px] w-8 bg-[var(--color-accent-gold)] mt-3"></div>
            </div>

            <p class="text-xs text-[var(--color-text-secondary)] font-light leading-relaxed">
              Provides shop owners transparent insight into unit economics, materials costs, marketing spending, and calculated margins.
            </p>

            <div class="space-y-3">
              <!-- Item 1 -->
              <div class="flex justify-between items-center text-xs pb-2 border-b border-gray-50">
                <span class="text-[var(--color-text-secondary)] font-light">Gross Sales Revenue:</span>
                <span class="font-semibold text-[var(--color-text-primary)]">${storeConfig.currency}1,34,500</span>
              </div>
              <!-- Item 2 -->
              <div class="flex justify-between items-center text-xs pb-2 border-b border-gray-50">
                <span class="text-[var(--color-text-secondary)] font-light">Atelier Production & Materials Cost:</span>
                <span class="font-semibold text-rose-700">-${storeConfig.currency}42,200</span>
              </div>
              <!-- Item 3 -->
              <div class="flex justify-between items-center text-xs pb-2 border-b border-gray-50">
                <span class="text-[var(--color-text-secondary)] font-light">Doorstep Logistics & COD Fees:</span>
                <span class="font-semibold text-rose-700">-${storeConfig.currency}8,400</span>
              </div>
              <!-- Grand Margin -->
              <div class="flex justify-between items-center pt-2">
                <span class="text-xs uppercase tracking-wider text-[var(--color-text-primary)] font-bold">Net Operating Profit:</span>
                <div class="text-right">
                  <p class="text-base text-emerald-700 font-semibold">${storeConfig.currency}83,900</p>
                  <p class="text-[8px] text-[var(--color-text-secondary)] uppercase tracking-wider">62.3% Profit Margin</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  `;
}
