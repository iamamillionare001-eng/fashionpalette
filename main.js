/**
 * MAIN ENTRYPOINT
 * Dynamically imports and initializes each modular architectural component,
 * building the cohesive luxury e-commerce experience.
 */

import { initHeader } from './01-WEBSITE_HEADER_AND_LOGO/header.js';
import { initHero } from './02-HERO_BANNER_AND_FESTIVE_OFFERS/hero.js';
import { initGallery } from './03-PRODUCT_CARDS_AND_IMAGE_GALLERY/gallery.js';
import { initCheckout } from './04-CHECKOUT_AND_COD_FORM/checkout.js';
import { initAdmin } from './05-ADMIN_CONTROL_PANEL_AND_PRODUCTS/admin.js';
import { initLedger } from './06-ORDER_TRACKING_AND_PROFIT_LEDGER/ledger.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize each layout component with its targeting ID
  initHeader('header-container');
  initHero('hero-container');
  initGallery('gallery-container');
  initCheckout('checkout-container');
  initAdmin('admin-view');
  initLedger('ledger-container');
  
  console.log("FashionPalette Brand Base Architecture Initialized Successfully.");
});
