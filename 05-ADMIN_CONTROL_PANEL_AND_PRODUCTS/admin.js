/**
 * ADMIN CONTROL PANEL & PRODUCT MANAGEMENT PLACEHOLDER
 * Serves as the dashboard workspace for founders to add products,
 * adjust pricing tiers, manage orders, and toggle active themes.
 */

import { storeConfig } from '../07-STORE_SETTINGS_AND_THEME_COLORS/store_config.js';

export function initAdmin(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <section id="admin" class="py-20 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-card)]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Section Header -->
        <div class="text-center max-w-xl mx-auto mb-16 space-y-4">
          <span class="text-xs uppercase tracking-[0.3em] text-[var(--color-accent-gold)] font-medium block">Store Administration</span>
          <h2 class="text-3xl sm:text-4xl font-light tracking-tight text-[var(--color-text-primary)]">Founder Control Panel</h2>
          <div class="h-[1px] w-12 bg-[var(--color-accent-gold)] mx-auto mt-4"></div>
          <p class="text-xs text-[var(--color-text-secondary)] font-light">
            Directly configure store attributes, catalog items, and order logs. Protected workspace for operators.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Product Creation Console (Left) -->
          <div class="lg:col-span-6 bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] p-6 rounded-[var(--border-radius-sm)] space-y-6">
            <h3 class="text-md uppercase tracking-wider text-[var(--color-text-primary)] font-bold border-b border-[var(--color-border-subtle)] pb-3">
              Add New Luxury Item
            </h3>
            
            <form class="space-y-4" onsubmit="event.preventDefault();">
              <div>
                <label class="block text-[9px] uppercase tracking-wider text-[var(--color-text-secondary)] font-bold mb-1.5">Product Title</label>
                <input type="text" placeholder="e.g. Silk Tuxedo Jacket" class="w-full bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] px-3 py-2.5 text-xs rounded-[var(--border-radius-sm)] focus:outline-none focus:border-[var(--color-accent-gold)]" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[9px] uppercase tracking-wider text-[var(--color-text-secondary)] font-bold mb-1.5">Category</label>
                  <select class="w-full bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] px-3 py-2.5 text-xs rounded-[var(--border-radius-sm)] focus:outline-none focus:border-[var(--color-accent-gold)]">
                    <option>Ready-To-Wear</option>
                    <option>Accessories</option>
                    <option>Footwear</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[9px] uppercase tracking-wider text-[var(--color-text-secondary)] font-bold mb-1.5">Price (${storeConfig.currency})</label>
                  <input type="number" placeholder="18500" class="w-full bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] px-3 py-2.5 text-xs rounded-[var(--border-radius-sm)] focus:outline-none focus:border-[var(--color-accent-gold)]" />
                </div>
              </div>

              <div>
                <label class="block text-[9px] uppercase tracking-wider text-[var(--color-text-secondary)] font-bold mb-1.5">Product Image Asset URL</label>
                <input type="text" placeholder="https://..." class="w-full bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] px-3 py-2.5 text-xs rounded-[var(--border-radius-sm)] focus:outline-none focus:border-[var(--color-accent-gold)]" />
              </div>

              <button type="submit" class="w-full py-3 bg-[var(--color-cta-fill)] text-[var(--color-cta-text)] text-xs uppercase tracking-widest font-semibold hover:bg-[var(--color-accent-gold)] transition-colors duration-300 rounded-[var(--border-radius-sm)]">
                Add to Storefront
              </button>
            </form>
          </div>

          <!-- Quick Store Configuration Stats (Right) -->
          <div class="lg:col-span-6 bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] p-6 rounded-[var(--border-radius-sm)] space-y-6">
            <h3 class="text-md uppercase tracking-wider text-[var(--color-text-primary)] font-bold border-b border-[var(--color-border-subtle)] pb-3">
              Store Quick-Stats
            </h3>

            <div class="grid grid-cols-2 gap-4">
              <div class="bg-[var(--color-surface-card)] p-4 border border-[var(--color-border-subtle)] rounded-[var(--border-radius-sm)]">
                <p class="text-[9px] uppercase tracking-widest text-[var(--color-text-secondary)]">Total Products</p>
                <p class="text-2xl font-light text-[var(--color-text-primary)] mt-1">3 Active</p>
              </div>
              <div class="bg-[var(--color-surface-card)] p-4 border border-[var(--color-border-subtle)] rounded-[var(--border-radius-sm)]">
                <p class="text-[9px] uppercase tracking-widest text-[var(--color-text-secondary)]">Total Revenue</p>
                <p class="text-2xl font-light text-emerald-700 mt-1">${storeConfig.currency}1,34,500</p>
              </div>
            </div>

            <!-- Configuration Summary Table -->
            <div class="bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] rounded-[var(--border-radius-sm)] p-4 space-y-3">
              <p class="text-[10px] uppercase tracking-wider text-[var(--color-text-primary)] font-bold">Metadata Configurations</p>
              
              <div class="space-y-2 text-xs">
                <div class="flex justify-between border-b border-gray-50 pb-1.5">
                  <span class="text-[var(--color-text-secondary)]">Store Name:</span>
                  <span class="font-medium">${storeConfig.storeName}</span>
                </div>
                <div class="flex justify-between border-b border-gray-50 pb-1.5">
                  <span class="text-[var(--color-text-secondary)]">Concierge Email:</span>
                  <span class="font-medium">${storeConfig.contact.email}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-[var(--color-text-secondary)]">Active Currency:</span>
                  <span class="font-medium">${storeConfig.currency} (${storeConfig.currencyCode})</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  `;
}
