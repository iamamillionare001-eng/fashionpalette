/* 
======================================================================
  FOUNDER CONFIGURATION: STORE DETAILS & BUSINESS CONFIG
  ------------------------------------------------------------------
  Change your store settings, currency, and customer support details
  here. These settings dynamically power your checkout, receipts,
  headers, and invoices.
======================================================================
*/

export const storeConfig = {
  // Brand Metadata
  storeName: "FashionPalette",
  tagline: "Ultra-Luxury Haute Couture & Accessories",
  
  // Interlocking Logo Monogram Initials
  logoInitials: "FP",
  
  // Localization Settings
  currency: "₹",
  currencyCode: "INR",
  
  // Customer Service Contact Details
  contact: {
    email: "concierge@fashionpalette.com",
    phone: "+91 98765 43210",
    address: "12, Taj Mansingh Boulevard, Diplomatic Enclave, New Delhi, India",
    instagram: "@fashionpalette.luxury",
  },
  
  // Festive & Promo Banner Settings
  festiveOffers: {
    active: true,
    bannerText: "The Festive Edit: Complimentary Personal Styling & Worldwide Express Delivery on orders above ₹15,000",
    promoCode: "PALETTEGOLD"
  },
  
  // Default Navigation Links
  navigation: [
    { label: "The Collection", link: "#collection" },
    { label: "New Arrivals", link: "#arrivals" },
    { label: "Atelier", link: "#atelier" },
    { label: "Order Tracking", link: "#order-tracking" },
    { label: "Admin Panel", link: "#admin" },
  ]
};
