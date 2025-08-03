/* ========================================================================
   CORRECTIF CART VS WISHLIST - RÉSOLUTION DES CONFLITS DE BOUTONS
   Propriété de © 2019/2024 Shopiweb.fr
   Corrige les conflits spécifiques entre boutons de produit
   ======================================================================== */

console.log('🔧 Cart-Wishlist Button Fix loaded');

/* =====================
   Initialisation simplifiée et robuste
   ===================== */
window.ShopifixCartWishlist = {
  initialized: false,
  
  init() {
    if (this.initialized) return;
    
    console.log('🚀 Initializing Cart-Wishlist unified system');
    
    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
    
    this.initialized = true;
  },
  
  setup() {
    console.log('🛠️ Setting up Cart-Wishlist event handlers');
    
    // Event delegation pour gérer tous les clics
    document.addEventListener('click', (e) => {
      // WISHLIST: Boutons toggle wishlist
      const wishlistBtn = e.target.closest('.btn-wishlist-add-remove, .btn-wishlist, .product-wishlist, [data-toggle-wishlist]');
      if (wishlistBtn && wishlistBtn.dataset.productHandle) {
        e.preventDefault();
        e.stopPropagation();
        
        const productHandle = wishlistBtn.dataset.productHandle;
        console.log('💖 Wishlist toggle:', productHandle);
        
        if (typeof window.toggleWishlist === 'function') {
          window.toggleWishlist(productHandle, wishlistBtn);
        } else {
          console.warn('⚠️ toggleWishlist function not found');
        }
        return;
      }
      
      // CART: Boutons de suppression d'articles du panier
      const cartRemoveBtn = e.target.closest('[data-remove-line-item]');
      if (cartRemoveBtn && cartRemoveBtn.dataset.lineItemKey) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🗑️ Cart item removal:', cartRemoveBtn.dataset.lineItemKey);
        
        if (typeof window.handleCartItemRemoval === 'function') {
          window.handleCartItemRemoval(cartRemoveBtn);
        } else {
          console.warn('⚠️ handleCartItemRemoval function not found');
        }
        return;
      }
      
      // CART: Boutons quantité +/-
      const cartQtyBtn = e.target.closest('[data-mode]');
      if (cartQtyBtn && cartQtyBtn.dataset.mode && cartQtyBtn.closest('#offcanvas-cart, #cart, .cart-page')) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🔢 Cart quantity button:', cartQtyBtn.dataset.mode);
        
        if (typeof window.onClickQtyPlusMinus === 'function') {
          window.onClickQtyPlusMinus(cartQtyBtn);
        } else {
          console.warn('⚠️ onClickQtyPlusMinus function not found');
        }
        return;
      }
    });
    
    console.log('✅ Cart-Wishlist system setup complete');
  }
};

// Initialiser dès que possible
window.ShopifixCartWishlist.init();

// Backup: initialiser après 1 seconde si pas encore fait
setTimeout(() => {
  if (!window.ShopifixCartWishlist.initialized) {
    window.ShopifixCartWishlist.init();
  }
}, 1000);
