/**
 * FIREBASE FIRESTORE & IMGBB CLOUD SYNC ENGINE
 * Production synchronization layer for live multi-device catalog,
 * real-time order ledger, and unlimited cloud image uploads.
 */

const IMGBB_API_KEY = "2c6efaf2e58f9263eda86d678f128017";

/**
 * Upload an image file directly to ImgBB cloud storage
 * @param {File|Blob} file 
 * @returns {Promise<string>} Direct CDN Image URL
 */
export async function uploadToImgBB(file) {
  const apiKey = window.IMGBB_API_KEY || IMGBB_API_KEY;
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson?.error?.message || `ImgBB upload failed with status ${response.status}`);
    }

    const data = await response.json();
    if (data.success && data.data) {
      // Use direct URL or display_url
      return data.data.url || data.data.display_url;
    } else {
      throw new Error(data?.error?.message || "ImgBB returned unsuccessful payload");
    }
  } catch (error) {
    console.error("ImgBB Cloud Upload Error:", error);
    throw error;
  }
}

/**
 * Safe helper to execute Firestore operations once Firebase is initialized
 * @param {Function} callback 
 */
export function withFirestore(callback) {
  if (window.fp_db && window.fp_firestore) {
    callback(window.fp_db, window.fp_firestore);
  } else {
    window.addEventListener("fp_firebase_ready", (e) => {
      callback(e.detail.db || window.fp_db, window.fp_firestore);
    }, { once: true });
  }
}

/**
 * Subscribe to the Firestore products collection in real time
 * @param {Function} onUpdate Callback when catalog updates
 * @param {Array} defaultSeedItems Optional fallback items to seed if empty
 * @returns {Function} Unsubscribe function
 */
export function subscribeToProducts(onUpdate, defaultSeedItems = []) {
  let unsubscribe = () => {};

  withFirestore((db, firestore) => {
    const { collection, onSnapshot, doc, setDoc } = firestore;
    const productsCol = collection(db, "products");

    unsubscribe = onSnapshot(productsCol, async (snapshot) => {
      if (snapshot.empty && defaultSeedItems.length > 0) {
        console.log("🌱 Seeding Firestore products collection with initial Festive catalog...");
        for (const item of defaultSeedItems) {
          try {
            await setDoc(doc(db, "products", item.id), item);
          } catch (e) {
            console.error("Error seeding product", item.id, e);
          }
        }
        return;
      }

      const products = [];
      snapshot.forEach(docSnap => {
        products.push({ id: docSnap.id, ...docSnap.data() });
      });

      // Mirror to localStorage
      localStorage.setItem("fp_products_data", JSON.stringify(products));
      window.dispatchEvent(new CustomEvent("fp_products_updated"));

      if (typeof onUpdate === "function") {
        onUpdate(products);
      }
    }, (error) => {
      console.warn("Firestore products onSnapshot warning:", error);
    });
  });

  return () => unsubscribe();
}

/**
 * Save / update a product in Firestore and mirror to localStorage
 * @param {Object} product 
 */
export async function saveProductToCloud(product) {
  // 1. Optimistically update localStorage
  const cached = JSON.parse(localStorage.getItem("fp_products_data") || "[]");
  const index = cached.findIndex(p => p.id === product.id);
  if (index >= 0) {
    cached[index] = product;
  } else {
    cached.push(product);
  }
  localStorage.setItem("fp_products_data", JSON.stringify(cached));
  window.dispatchEvent(new CustomEvent("fp_products_updated"));

  // 2. Write to Firestore
  withFirestore(async (db, firestore) => {
    try {
      const { doc, setDoc } = firestore;
      await setDoc(doc(db, "products", product.id), product);
      console.log(`☁️ Product ${product.id} synced to Firestore.`);
    } catch (e) {
      console.error("Failed to sync product to Firestore:", e);
    }
  });
}

/**
 * Toggle product stock status in Firestore
 * @param {string} productId 
 * @param {boolean} inStock 
 */
export async function updateProductStockInCloud(productId, inStock) {
  // 1. Optimistic local update
  const cached = JSON.parse(localStorage.getItem("fp_products_data") || "[]");
  const product = cached.find(p => p.id === productId);
  if (product) {
    product.inStock = inStock;
    localStorage.setItem("fp_products_data", JSON.stringify(cached));
    window.dispatchEvent(new CustomEvent("fp_products_updated"));
  }

  // 2. Update Firestore
  withFirestore(async (db, firestore) => {
    try {
      const { doc, setDoc } = firestore;
      await setDoc(doc(db, "products", productId), { inStock }, { merge: true });
      console.log(`☁️ Product stock status ${productId} -> ${inStock} updated in Firestore.`);
    } catch (e) {
      console.error("Failed to update product stock in Firestore:", e);
    }
  });
}

/**
 * Delete a product in Firestore
 * @param {string} productId 
 */
export async function deleteProductFromCloud(productId) {
  // 1. Optimistic local update
  const cached = JSON.parse(localStorage.getItem("fp_products_data") || "[]");
  const filtered = cached.filter(p => p.id !== productId);
  localStorage.setItem("fp_products_data", JSON.stringify(filtered));
  window.dispatchEvent(new CustomEvent("fp_products_updated"));

  // 2. Delete in Firestore
  withFirestore(async (db, firestore) => {
    try {
      const { doc, deleteDoc } = firestore;
      await deleteDoc(doc(db, "products", productId));
      console.log(`☁️ Product ${productId} deleted from Firestore.`);
    } catch (e) {
      console.error("Failed to delete product from Firestore:", e);
    }
  });
}

/**
 * Subscribe to the Firestore orders collection in real time
 * @param {Function} onUpdate Callback when orders change
 * @returns {Function} Unsubscribe function
 */
export function subscribeToOrders(onUpdate) {
  let unsubscribe = () => {};

  withFirestore((db, firestore) => {
    const { collection, onSnapshot } = firestore;
    const ordersCol = collection(db, "orders");

    unsubscribe = onSnapshot(ordersCol, (snapshot) => {
      const orders = [];
      snapshot.forEach(docSnap => {
        orders.push({ id: docSnap.id, ...docSnap.data() });
      });

      // Sort newest first by default if timestamp exists or preserve array
      orders.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      // Mirror to localStorage
      localStorage.setItem("fp_orders_data", JSON.stringify(orders));
      window.dispatchEvent(new CustomEvent("fp_orders_updated"));

      if (typeof onUpdate === "function") {
        onUpdate(orders);
      }
    }, (error) => {
      console.warn("Firestore orders onSnapshot warning:", error);
    });
  });

  return () => unsubscribe();
}

/**
 * Save new customer order to Firestore
 * @param {Object} order 
 */
export async function saveOrderToCloud(order) {
  const orderWithTimestamp = {
    ...order,
    createdAt: Date.now()
  };

  // 1. Optimistic local update
  const cached = JSON.parse(localStorage.getItem("fp_orders_data") || "[]");
  cached.unshift(orderWithTimestamp);
  localStorage.setItem("fp_orders_data", JSON.stringify(cached));
  window.dispatchEvent(new CustomEvent("fp_orders_updated"));

  // 2. Save to Firestore
  withFirestore(async (db, firestore) => {
    try {
      const { doc, setDoc } = firestore;
      await setDoc(doc(db, "orders", order.id), orderWithTimestamp);
      console.log(`☁️ Order ${order.id} saved to Firestore collection 'orders'.`);
    } catch (e) {
      console.error("Failed to save order to Firestore:", e);
    }
  });
}

/**
 * Update order status in Firestore
 * @param {string} orderId 
 * @param {string} status 
 */
export async function updateOrderStatusInCloud(orderId, status) {
  // 1. Optimistic local update
  const cached = JSON.parse(localStorage.getItem("fp_orders_data") || "[]");
  const order = cached.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    localStorage.setItem("fp_orders_data", JSON.stringify(cached));
    window.dispatchEvent(new CustomEvent("fp_orders_updated"));
  }

  // 2. Update Firestore
  withFirestore(async (db, firestore) => {
    try {
      const { doc, setDoc } = firestore;
      await setDoc(doc(db, "orders", orderId), { status }, { merge: true });
      console.log(`☁️ Order status ${orderId} -> ${status} updated in Firestore.`);
    } catch (e) {
      console.error("Failed to update order status in Firestore:", e);
    }
  });
}

/**
 * Delete order from Firestore
 * @param {string} orderId 
 */
export async function deleteOrderFromCloud(orderId) {
  // 1. Optimistic local update
  const cached = JSON.parse(localStorage.getItem("fp_orders_data") || "[]");
  const filtered = cached.filter(o => o.id !== orderId);
  localStorage.setItem("fp_orders_data", JSON.stringify(filtered));
  window.dispatchEvent(new CustomEvent("fp_orders_updated"));

  // 2. Delete in Firestore
  withFirestore(async (db, firestore) => {
    try {
      const { doc, deleteDoc } = firestore;
      await deleteDoc(doc(db, "orders", orderId));
      console.log(`☁️ Order ${orderId} deleted from Firestore.`);
    } catch (e) {
      console.error("Failed to delete order from Firestore:", e);
    }
  });
}
