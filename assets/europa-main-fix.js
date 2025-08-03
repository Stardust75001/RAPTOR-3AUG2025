/* ========================================================================
   CORRECTIF PRINCIPAL EUROPA - UNIFIE CART ET WISHLIST
   Propriété de © 2019/2024 Shopiweb.fr
   Résout tous les conflits entre cart et wishlist
   ======================================================================== */

console.log('🔧 EUROPA Main Fix loaded');

// === ATTENDRE QUE TOUS LES SCRIPTS SOIENT CHARGÉS ===
function waitForScripts() {
  return new Promise((resolve) => {
    const checkScripts = () => {
      const requiredFunctions = [
        'handleAddToCartFormSubmit',
        'toggleWishlist'
      ];
      
      const missing = requiredFunctions.filter(fn => 
        typeof window[fn] !== 'function'
      );
      
      if (missing.length === 0) {
        console.log('✅ All required functions loaded');
        resolve();
      } else {
        console.log('⏳ Waiting for functions:', missing);
        setTimeout(checkScripts, 100);
      }
    };
    
    checkScripts();
  });
}

// === INITIALISATION PRINCIPALE ===
async function initEuropaFix() {
  console.log('🚀 Initializing EUROPA Fix');
  
  // Attendre que tous les scripts soient chargés
  await waitForScripts();
  
  // === BACKUP DES FONCTIONS ORIGINALES ===
  const originalAddToCart = window.handleAddToCartFormSubmit;
  const originalToggleWishlist = window.toggleWishlist;
  
  // === CORRECTION ADD TO CART ===
  window.handleAddToCartFormSubmit = function(form, event) {
    if (event) event.preventDefault();
    
    console.log('🛒 EUROPA handleAddToCartFormSubmit called');
    
    // Utiliser la fonction originale si disponible
    if (originalAddToCart && originalAddToCart !== window.handleAddToCartFormSubmit) {
      return originalAddToCart(form, event);
    }
    
    // Sinon, implémenter une version simple
    const btn = form.querySelector('.btn-atc, button[type="submit"]');
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"></div>';
      
      fetch('/cart/add.js', {
        method: 'POST',
        body: new FormData(form)
      })
      .then(response => response.json())
      .then(data => {
        btn.innerHTML = 'Added!';
        setTimeout(() => btn.innerHTML = originalText, 1500);
        
        // Mettre à jour le panier
        if (typeof window.updateCartContents === 'function') {
          window.updateCartContents({ data });
        }
        
        // Ouvrir l'offcanvas
        const offcanvas = document.getElementById('offcanvas-cart');
        if (offcanvas && window.bootstrap) {
          new bootstrap.Offcanvas(offcanvas).show();
        }
      })
      .catch(error => {
        console.error('Cart error:', error);
        btn.innerHTML = 'Error';
        setTimeout(() => btn.innerHTML = originalText, 1500);
      });
    }
  };
  
  // === CORRECTION WISHLIST ===
  window.toggleWishlist = function(productHandleOrButton, button) {
    console.log('💖 EUROPA toggleWishlist called');
    
    let productHandle, btn;
    
    // Support des deux signatures
    if (typeof productHandleOrButton === 'string') {
      productHandle = productHandleOrButton;
      btn = button;
    } else if (productHandleOrButton?.dataset?.productHandle) {
      btn = productHandleOrButton;
      productHandle = btn.dataset.productHandle;
    }
    
    if (!productHandle) {
      console.error('❌ No product handle found');
      return;
    }
    
    // Utiliser la fonction originale si possible
    if (originalToggleWishlist && originalToggleWishlist !== window.toggleWishlist) {
      return originalToggleWishlist(productHandleOrButton, button);
    }
    
    // Implémentation simple
    const wishlist = JSON.parse(localStorage.getItem('shopiweb_wishlist_v1') || '[]');
    const isInWishlist = wishlist.some(item => item.handle === productHandle);
    
    if (isInWishlist) {
      // Retirer
      const newWishlist = wishlist.filter(item => item.handle !== productHandle);
      localStorage.setItem('shopiweb_wishlist_v1', JSON.stringify(newWishlist));
      console.log('➖ Removed from wishlist');
    } else {
      // Ajouter
      fetch(`/products/${productHandle}.js`)
        .then(response => response.json())
        .then(product => {
          wishlist.push({
            handle: product.handle,
            title: product.title,
            price: product.price,
            image: product.featured_image,
            url: `/products/${product.handle}`,
            variants: product.variants.map(v => ({
              id: v.id,
              title: v.title,
              price: v.price
            }))
          });
          localStorage.setItem('shopiweb_wishlist_v1', JSON.stringify(wishlist));
          console.log('➕ Added to wishlist');
          
          // Mettre à jour l'UI
          updateWishlistUI();
        })
        .catch(error => console.error('Wishlist error:', error));
    }
    
    // Mettre à jour l'UI immédiatement
    updateWishlistUI();
  };
  
  // === HELPER FUNCTION ===
  function updateWishlistUI() {
    const wishlist = JSON.parse(localStorage.getItem('shopiweb_wishlist_v1') || '[]');
    const count = wishlist.length;
    
    // Mettre à jour les badges
    document.querySelectorAll('.wishlist-count-badge').forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
    
    // Mettre à jour les boutons
    document.querySelectorAll('[data-product-handle]').forEach(btn => {
      const handle = btn.dataset.productHandle;
      const isInWishlist = wishlist.some(item => item.handle === handle);
      
      if (btn.classList.contains('btn-wishlist-add-remove') || btn.classList.contains('btn-wishlist')) {
        btn.classList.toggle('active', isInWishlist);
        btn.setAttribute('aria-pressed', isInWishlist);
      }
    });
  }
  
  // === EVENT DELEGATION ===
  document.addEventListener('click', function(e) {
    // Wishlist buttons
    const wishlistBtn = e.target.closest('[data-toggle-wishlist], .btn-wishlist, .btn-wishlist-add-remove');
    if (wishlistBtn && wishlistBtn.dataset.productHandle) {
      e.preventDefault();
      e.stopPropagation();
      window.toggleWishlist(wishlistBtn);
      return;
    }
    
    // Cart remove buttons
    const removeBtn = e.target.closest('[data-remove-line-item]');
    if (removeBtn && removeBtn.dataset.lineItemKey) {
      e.preventDefault();
      e.stopPropagation();
      if (typeof window.handleCartItemRemoval === 'function') {
        window.handleCartItemRemoval(removeBtn);
      }
      return;
    }
  });
  
  // Initialiser l'UI
  updateWishlistUI();
  
  console.log('✅ EUROPA Fix fully initialized');
}

// === AUTO-INIT ===
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEuropaFix);
} else {
  initEuropaFix();
}
