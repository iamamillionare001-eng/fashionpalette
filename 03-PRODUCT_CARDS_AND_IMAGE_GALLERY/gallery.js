/**
 * PRODUCT CARDS & IMAGE GALLERY PLACEHOLDER
 * Serves as the dynamic workspace for displaying luxury item catalogs,
 * image carousel previewers, and responsive product cards.
 */

export function initGallery(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <section id="collection" class="py-20 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-card)]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Section Header -->
        <div class="text-center max-w-xl mx-auto mb-16 space-y-4">
          <span class="text-xs uppercase tracking-[0.3em] text-[var(--color-accent-gold)] font-medium block">Curated Selection</span>
          <h2 class="text-3xl sm:text-4xl font-light tracking-tight text-[var(--color-text-primary)]">Signature Pieces</h2>
          <div class="h-[1px] w-12 bg-[var(--color-accent-gold)] mx-auto mt-4"></div>
          <p class="text-xs text-[var(--color-text-secondary)] font-light leading-relaxed">
            A premium visual placeholder for your upcoming product catalog. Designed for fluid grid structures and hover-state zoom dynamics.
          </p>
        </div>

        <!-- Product Grid (Responsive: 1 col mobile, 2 tablet, 3 desktop) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <!-- Product Card Placeholder 1 -->
          <div class="group border border-[var(--color-border-subtle)] overflow-hidden bg-[var(--color-bg-primary)] transition-all duration-300 hover:shadow-lg rounded-[var(--border-radius-sm)]">
            <div class="aspect-[3/4] w-full bg-stone-200 relative flex items-center justify-center overflow-hidden">
              <span class="text-xs tracking-widest text-[var(--color-text-secondary)] uppercase opacity-60">Product Image (3:4 Ratio)</span>
              <!-- Subtle gold border overlay on hover -->
              <div class="absolute inset-0 border-0 group-hover:border border-[var(--color-accent-gold)] transition-all duration-300"></div>
            </div>
            <div class="p-6 bg-[var(--color-surface-card)] text-left space-y-2">
              <p class="text-[10px] uppercase tracking-widest text-[var(--color-accent-gold)] font-semibold">Ready-To-Wear</p>
              <h3 class="font-serif-luxury text-lg font-light text-[var(--color-text-primary)]">Linen Wrap Blazer</h3>
              <p class="text-sm font-medium text-[var(--color-text-primary)]">₹18,500</p>
            </div>
          </div>

          <!-- Product Card Placeholder 2 -->
          <div class="group border border-[var(--color-border-subtle)] overflow-hidden bg-[var(--color-bg-primary)] transition-all duration-300 hover:shadow-lg rounded-[var(--border-radius-sm)]">
            <div class="aspect-[3/4] w-full bg-stone-200 relative flex items-center justify-center overflow-hidden">
              <span class="text-xs tracking-widest text-[var(--color-text-secondary)] uppercase opacity-60">Product Image (3:4 Ratio)</span>
              <div class="absolute inset-0 border-0 group-hover:border border-[var(--color-accent-gold)] transition-all duration-300"></div>
            </div>
            <div class="p-6 bg-[var(--color-surface-card)] text-left space-y-2">
              <p class="text-[10px] uppercase tracking-widest text-[var(--color-accent-gold)] font-semibold">Accessories</p>
              <h3 class="font-serif-luxury text-lg font-light text-[var(--color-text-primary)]">Suede Saddle Bag</h3>
              <p class="text-sm font-medium text-[var(--color-text-primary)]">₹14,900</p>
            </div>
          </div>

          <!-- Product Card Placeholder 3 -->
          <div class="group border border-[var(--color-border-subtle)] overflow-hidden bg-[var(--color-bg-primary)] transition-all duration-300 hover:shadow-lg rounded-[var(--border-radius-sm)]">
            <div class="aspect-[3/4] w-full bg-stone-200 relative flex items-center justify-center overflow-hidden">
              <span class="text-xs tracking-widest text-[var(--color-text-secondary)] uppercase opacity-60">Product Image (3:4 Ratio)</span>
              <div class="absolute inset-0 border-0 group-hover:border border-[var(--color-accent-gold)] transition-all duration-300"></div>
            </div>
            <div class="p-6 bg-[var(--color-surface-card)] text-left space-y-2">
              <p class="text-[10px] uppercase tracking-widest text-[var(--color-accent-gold)] font-semibold">Footwear</p>
              <h3 class="font-serif-luxury text-lg font-light text-[var(--color-text-primary)]">Minimalist Loafer</h3>
              <p class="text-sm font-medium text-[var(--color-text-primary)]">₹16,000</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  `;
}
