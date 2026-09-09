/**
 * SMART DROPSHIP AUTOMATION: IMAGE CROPPER & CANVAS AUTO-ENHANCER STUDIO
 * Provides in-browser interactive cropping via Cropper.js, 
 * luxury 3:4 / 1:1 aspect ratio presets, zoom/rotation controls,
 * touch-gesture support, and 2D canvas auto-enhancement filters (+8% contrast, edge sharpening, light balancing).
 */

import { uploadToImgBB } from '../07-STORE_SETTINGS_AND_THEME_COLORS/firebase_sync.js';

/**
 * Applies a luxury auto-enhancement filter to an HTML5 canvas:
 * 1. Contrast boost (+8%)
 * 2. 3x3 Convolution edge sharpening
 * 3. Balanced lighting & exposure
 * @param {HTMLCanvasElement} canvas 
 * @returns {HTMLCanvasElement}
 */
export function applyCanvasAutoEnhance(canvas) {
  const width = canvas.width;
  const height = canvas.height;
  if (!width || !height) return canvas;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  try {
    const srcData = ctx.getImageData(0, 0, width, height);
    const src = srcData.data;
    const output = ctx.createImageData(width, height);
    const dst = output.data;

    // 3x3 Convolution Sharpening Kernel (Subtle luxury crispness)
    // [  0,   -0.25,   0   ]
    // [ -0.25, 2.00, -0.25 ]
    // [  0,   -0.25,   0   ]
    const k1 = -0.25;
    const k3 = -0.25;
    const k4 = 2.0;
    const k5 = -0.25;
    const k7 = -0.25;
    const contrastFactor = 1.08; // +8% contrast

    for (let y = 1; y < height - 1; y++) {
      const rowOffset = y * width;
      const prevRowOffset = (y - 1) * width;
      const nextRowOffset = (y + 1) * width;

      for (let x = 1; x < width - 1; x++) {
        const dstIdx = (rowOffset + x) * 4;
        
        for (let c = 0; c < 3; c++) {
          const val = 
            k1 * src[(prevRowOffset + x) * 4 + c] +
            k3 * src[(rowOffset + (x - 1)) * 4 + c] +
            k4 * src[(rowOffset + x) * 4 + c] +
            k5 * src[(rowOffset + (x + 1)) * 4 + c] +
            k7 * src[(nextRowOffset + x) * 4 + c];

          // Boost contrast (+8%) and balance lighting (+4 levels)
          const enhanced = contrastFactor * (val - 128) + 128 + 4;
          dst[dstIdx + c] = Math.min(255, Math.max(0, Math.round(enhanced)));
        }
        dst[dstIdx + 3] = src[dstIdx + 3]; // Preserve alpha
      }
    }

    // Copy borders
    for (let x = 0; x < width; x++) {
      for (let c = 0; c < 4; c++) {
        dst[x * 4 + c] = src[x * 4 + c];
        dst[((height - 1) * width + x) * 4 + c] = src[((height - 1) * width + x) * 4 + c];
      }
    }
    for (let y = 0; y < height; y++) {
      for (let c = 0; c < 4; c++) {
        dst[(y * width) * 4 + c] = src[(y * width) * 4 + c];
        dst[(y * width + (width - 1)) * 4 + c] = src[(y * width + (width - 1)) * 4 + c];
      }
    }

    ctx.putImageData(output, 0, 0);
  } catch (err) {
    console.warn("Canvas auto-enhancement warning (skipped):", err);
  }

  return canvas;
}

/**
 * Calculates psychological pricing rounded to ending 99
 * e.g., 273 (cost) + 200 (margin) + 100 (buffer) = 573 -> ₹599
 * Strike-through MRP = Selling Price * 2 (~50% OFF)
 * @param {number} supplierCost 
 * @param {number} targetProfit 
 * @param {number} rtoBuffer 
 * @returns {{ supplierCost: number, targetProfit: number, rtoBuffer: number, sellingPrice: number, mrp: number, netProfit: number }}
 */
export function calculatePsychologicalPricing(supplierCost, targetProfit = 200, rtoBuffer = 100) {
  const cost = Number(supplierCost) || 0;
  const profit = Number(targetProfit) >= 0 ? Number(targetProfit) : 200;
  const buffer = Number(rtoBuffer) >= 0 ? Number(rtoBuffer) : 100;
  const rawSum = cost + profit + buffer;

  if (rawSum <= 0) {
    return {
      supplierCost: 0,
      targetProfit: profit,
      rtoBuffer: buffer,
      sellingPrice: 0,
      mrp: 0,
      netProfit: profit
    };
  }

  const remainder = rawSum % 100;
  let sellingPrice = 0;
  if (remainder <= 99) {
    sellingPrice = Math.floor(rawSum / 100) * 100 + 99;
  } else {
    sellingPrice = Math.floor(rawSum / 100) * 100 + 199;
  }

  const mrp = sellingPrice * 2;
  const netProfit = profit;

  return {
    supplierCost: cost,
    targetProfit: profit,
    rtoBuffer: buffer,
    sellingPrice,
    mrp,
    netProfit
  };
}

/**
 * Opens an in-browser Crop & Enhance Studio modal
 * Supports all image formats: AVIF, WebP, PNG, JPG, JPEG, and camera uploads.
 * @param {File|Blob} file 
 * @param {Object} [options] 
 * @returns {Promise<string>} Uploaded ImgBB URL
 */
export function openImageCropperStudio(file, options = {}) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No image file provided"));
      return;
    }

    // Clean up any existing studio modal
    const existingModal = document.getElementById('crop-enhance-studio-modal');
    if (existingModal) existingModal.remove();

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.onload = (e) => {
      const imageDataUrl = e.target.result;
      showStudioModal(imageDataUrl, resolve, reject, options);
    };
    reader.readAsDataURL(file);
  });
}

function showStudioModal(imageDataUrl, resolve, reject, options) {
  const modal = document.createElement('div');
  modal.id = 'crop-enhance-studio-modal';
  modal.className = 'fixed inset-0 z-[110] flex items-center justify-center bg-[#1A1A1A]/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-fadeIn';

  let currentAspectRatio = 3 / 4; // Default 3:4 portrait (Fashion standard)
  let cropperInstance = null;
  let scaleX = 1;

  modal.innerHTML = `
    <div class="bg-white rounded-3xl border border-[#E5E3DF] max-w-3xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-scaleUp">
      
      <!-- Studio Header -->
      <div class="bg-[#1A1A1A] text-[#F9F8F6] px-5 py-3.5 flex items-center justify-between border-b border-[#C5A880]/60 flex-shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-[#C5A880]/20 border border-[#C5A880] flex items-center justify-center text-[#C5A880]">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 class="font-serif text-base uppercase tracking-wider text-[#F9F8F6] leading-none">Crop & Enhance Studio</h3>
            <p class="text-[9px] uppercase tracking-wider text-[#C5A880] font-sans mt-0.5 font-semibold">Haute Couture Image Optimizer &bull; Touch & Mouse Ready</p>
          </div>
        </div>

        <button id="studio-close-btn" class="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-all focus:outline-none" title="Cancel">
          ✕
        </button>
      </div>

      <!-- Controls Toolbar (Aspect Presets & Transformations) -->
      <div class="bg-[#F9F8F6] border-b border-[#E5E3DF] p-3 flex flex-wrap items-center justify-between gap-2.5 text-xs flex-shrink-0">
        <!-- Aspect Ratio Presets -->
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="text-[9px] uppercase tracking-wider font-bold text-[#5A5A5A] mr-1">Aspect Ratio:</span>
          <button type="button" id="aspect-3-4" class="aspect-btn px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all bg-[#1A1A1A] text-white border border-[#1A1A1A] shadow-xs">
            3:4 Portrait (Fashion)
          </button>
          <button type="button" id="aspect-1-1" class="aspect-btn px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all bg-white text-[#5A5A5A] border border-[#E5E3DF] hover:border-[#1A1A1A]">
            1:1 Square
          </button>
          <button type="button" id="aspect-free" class="aspect-btn px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all bg-white text-[#5A5A5A] border border-[#E5E3DF] hover:border-[#1A1A1A]">
            Free Crop
          </button>
        </div>

        <!-- Transformation Tools (Zoom, Rotate, Flip, Reset) -->
        <div class="flex items-center gap-1.5">
          <button type="button" id="tool-zoom-in" class="p-2 bg-white border border-[#E5E3DF] hover:border-[#1A1A1A] rounded-lg text-[#1A1A1A] text-xs font-bold transition-all" title="Zoom In (+)">
            🔍+
          </button>
          <button type="button" id="tool-zoom-out" class="p-2 bg-white border border-[#E5E3DF] hover:border-[#1A1A1A] rounded-lg text-[#1A1A1A] text-xs font-bold transition-all" title="Zoom Out (-)">
            🔍-
          </button>
          <button type="button" id="tool-rotate-left" class="p-2 bg-white border border-[#E5E3DF] hover:border-[#1A1A1A] rounded-lg text-[#1A1A1A] text-xs font-bold transition-all" title="Rotate -90°">
            ↺ -90°
          </button>
          <button type="button" id="tool-rotate-right" class="p-2 bg-white border border-[#E5E3DF] hover:border-[#1A1A1A] rounded-lg text-[#1A1A1A] text-xs font-bold transition-all" title="Rotate +90°">
            ↻ +90°
          </button>
          <button type="button" id="tool-flip-h" class="p-2 bg-white border border-[#E5E3DF] hover:border-[#1A1A1A] rounded-lg text-[#1A1A1A] text-xs font-bold transition-all" title="Flip Horizontal">
            ⇄ Flip
          </button>
          <button type="button" id="tool-reset" class="px-2.5 py-2 bg-stone-200 hover:bg-stone-300 border border-stone-300 rounded-lg text-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider transition-all" title="Reset View">
            Reset
          </button>
        </div>
      </div>

      <!-- Main Cropper Viewport Container -->
      <div class="relative flex-grow bg-stone-900 overflow-hidden flex items-center justify-center min-h-[280px] sm:min-h-[380px] max-h-[55vh]">
        <div class="w-full h-full flex items-center justify-center p-2">
          <img id="cropper-target-img" src="${imageDataUrl}" class="max-w-full max-h-full block" />
        </div>

        <!-- Loading / Enhancing Overlay -->
        <div id="studio-loading-overlay" class="absolute inset-0 bg-[#1A1A1A]/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center space-y-3 hidden">
          <div class="w-8 h-8 border-3 border-[#C5A880] border-t-transparent rounded-full animate-spin"></div>
          <p class="text-xs font-bold text-amber-200 uppercase tracking-widest font-serif">Applying Auto-Enhancement & Uploading...</p>
          <p class="text-[10px] text-stone-400 font-sans">+8% Contrast &bull; 3x3 Edge Sharpen &bull; ImgBB CDN</p>
        </div>
      </div>

      <!-- Studio Footer Options & Actions -->
      <div class="bg-white border-t border-[#E5E3DF] p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 flex-shrink-0">
        
        <!-- Auto-Enhance Feature Toggle -->
        <label class="flex items-center gap-2.5 cursor-pointer select-none bg-[#F9F8F6] px-3.5 py-2 rounded-xl border border-[#E5E3DF]">
          <input type="checkbox" id="studio-auto-enhance-toggle" checked class="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-[#1A1A1A]" />
          <div class="text-left">
            <span class="text-xs font-bold text-[#1A1A1A] flex items-center gap-1">
              <span>⚡ Auto-Enhance on Export</span>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900">+8% Contrast &amp; Sharpen</span>
            </span>
            <p class="text-[8px] text-[#8A8A8A]">Runs HTML5 2D Canvas edge convolution and balanced lighting filter</p>
          </div>
        </label>

        <!-- CTA Action Buttons -->
        <div class="flex items-center gap-2.5">
          <button type="button" id="studio-cancel-btn" class="flex-1 sm:flex-none px-5 py-3 border border-[#E5E3DF] hover:bg-stone-50 text-[#5A5A5A] text-xs uppercase tracking-widest font-semibold rounded-xl transition-all focus:outline-none min-h-[44px]">
            Cancel
          </button>
          <button type="button" id="studio-confirm-btn" class="flex-1 sm:flex-none px-6 py-3 bg-[#1A1A1A] hover:bg-[#C5A880] hover:text-[#1A1A1A] text-white text-xs uppercase tracking-widest font-bold rounded-xl transition-all duration-300 shadow-md focus:outline-none flex items-center justify-center gap-2 min-h-[44px]">
            <span>Confirm &amp; Enhance</span>
            <span class="text-sm font-sans">&rarr;</span>
          </button>
        </div>

      </div>

    </div>
  `;

  document.body.appendChild(modal);
  document.body.classList.add('overflow-hidden');

  // Initialize Cropper.js instance on target image
  const imgEl = modal.querySelector('#cropper-target-img');
  
  function initCropper() {
    if (typeof window.Cropper === 'undefined') {
      console.warn("Cropper.js library not yet loaded, retrying in 100ms...");
      setTimeout(initCropper, 100);
      return;
    }

    cropperInstance = new window.Cropper(imgEl, {
      aspectRatio: currentAspectRatio,
      viewMode: 1,
      autoCropArea: 0.95,
      responsive: true,
      zoomOnTouch: true,
      zoomOnWheel: true,
      movable: true,
      rotatable: true,
      scalable: true,
      background: true,
      cropBoxMovable: true,
      cropBoxResizable: true,
      toggleDragModeOnDblclick: true
    });
  }

  // Slight timeout to allow DOM to render image before Cropper attaches
  setTimeout(initCropper, 50);

  // Close & Cleanup
  function closeModal() {
    if (cropperInstance) {
      cropperInstance.destroy();
      cropperInstance = null;
    }
    modal.remove();
    document.body.classList.remove('overflow-hidden');
  }

  const closeBtn = modal.querySelector('#studio-close-btn');
  const cancelBtn = modal.querySelector('#studio-cancel-btn');
  if (closeBtn) closeBtn.addEventListener('click', () => {
    closeModal();
    reject(new Error("Image crop cancelled by user"));
  });
  if (cancelBtn) cancelBtn.addEventListener('click', () => {
    closeModal();
    reject(new Error("Image crop cancelled by user"));
  });

  // Aspect Ratio Preset Buttons
  const aspect34 = modal.querySelector('#aspect-3-4');
  const aspect11 = modal.querySelector('#aspect-1-1');
  const aspectFree = modal.querySelector('#aspect-free');
  const aspectBtns = [aspect34, aspect11, aspectFree];

  function setActiveAspectBtn(activeBtn) {
    aspectBtns.forEach(btn => {
      if (btn === activeBtn) {
        btn.className = "aspect-btn px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all bg-[#1A1A1A] text-white border border-[#1A1A1A] shadow-xs";
      } else {
        btn.className = "aspect-btn px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all bg-white text-[#5A5A5A] border border-[#E5E3DF] hover:border-[#1A1A1A]";
      }
    });
  }

  if (aspect34) {
    aspect34.addEventListener('click', () => {
      currentAspectRatio = 3 / 4;
      setActiveAspectBtn(aspect34);
      if (cropperInstance) cropperInstance.setAspectRatio(3 / 4);
    });
  }

  if (aspect11) {
    aspect11.addEventListener('click', () => {
      currentAspectRatio = 1;
      setActiveAspectBtn(aspect11);
      if (cropperInstance) cropperInstance.setAspectRatio(1);
    });
  }

  if (aspectFree) {
    aspectFree.addEventListener('click', () => {
      currentAspectRatio = NaN;
      setActiveAspectBtn(aspectFree);
      if (cropperInstance) cropperInstance.setAspectRatio(NaN);
    });
  }

  // Transformation Buttons
  const zoomInBtn = modal.querySelector('#tool-zoom-in');
  const zoomOutBtn = modal.querySelector('#tool-zoom-out');
  const rotLeftBtn = modal.querySelector('#tool-rotate-left');
  const rotRightBtn = modal.querySelector('#tool-rotate-right');
  const flipHBtn = modal.querySelector('#tool-flip-h');
  const resetBtn = modal.querySelector('#tool-reset');

  if (zoomInBtn) zoomInBtn.addEventListener('click', () => cropperInstance && cropperInstance.zoom(0.1));
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => cropperInstance && cropperInstance.zoom(-0.1));
  if (rotLeftBtn) rotLeftBtn.addEventListener('click', () => cropperInstance && cropperInstance.rotate(-90));
  if (rotRightBtn) rotRightBtn.addEventListener('click', () => cropperInstance && cropperInstance.rotate(90));
  if (flipHBtn) flipHBtn.addEventListener('click', () => {
    if (cropperInstance) {
      scaleX = scaleX === 1 ? -1 : 1;
      cropperInstance.scaleX(scaleX);
    }
  });
  if (resetBtn) resetBtn.addEventListener('click', () => {
    if (cropperInstance) {
      scaleX = 1;
      cropperInstance.reset();
    }
  });

  // Confirm & Enhance CTA
  const confirmBtn = modal.querySelector('#studio-confirm-btn');
  const loadingOverlay = modal.querySelector('#studio-loading-overlay');
  const autoEnhanceToggle = modal.querySelector('#studio-auto-enhance-toggle');

  if (confirmBtn) {
    confirmBtn.addEventListener('click', async () => {
      if (!cropperInstance) return;

      if (loadingOverlay) loadingOverlay.classList.remove('hidden');
      confirmBtn.disabled = true;

      try {
        // 1. Extract high-resolution cropped canvas
        let croppedCanvas = cropperInstance.getCroppedCanvas({
          maxWidth: 1600,
          maxHeight: 2000,
          imageSmoothingEnabled: true,
          imageSmoothingQuality: 'high'
        });

        if (!croppedCanvas) {
          throw new Error("Unable to extract cropped canvas");
        }

        // 2. Apply HTML5 2D Canvas Auto-Enhance Filter if toggled
        if (autoEnhanceToggle && autoEnhanceToggle.checked) {
          croppedCanvas = applyCanvasAutoEnhance(croppedCanvas);
        }

        // 3. Convert output to clean standard JPEG blob
        croppedCanvas.toBlob(async (blob) => {
          if (!blob) {
            if (loadingOverlay) loadingOverlay.classList.add('hidden');
            confirmBtn.disabled = false;
            alert("⚠️ Failed to generate image blob");
            return;
          }

          try {
            // 4. Upload directly to ImgBB CDN
            const cdnUrl = await uploadToImgBB(blob);
            closeModal();
            resolve(cdnUrl);
          } catch (uploadErr) {
            console.error("Studio ImgBB Upload Error:", uploadErr);
            if (loadingOverlay) loadingOverlay.classList.add('hidden');
            confirmBtn.disabled = false;
            alert("⚠️ Cloud upload failed: " + (uploadErr.message || "Network Error"));
          }
        }, 'image/jpeg', 0.92);

      } catch (err) {
        console.error("Studio Process Error:", err);
        if (loadingOverlay) loadingOverlay.classList.add('hidden');
        confirmBtn.disabled = false;
        alert("⚠️ Processing error: " + err.message);
      }
    });
  }
}
