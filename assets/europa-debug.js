/* ========================================================================
   SCRIPT DE DÉBOGAGE POUR EUROPA
   Vérifie que toutes les fonctions nécessaires sont disponibles
   ======================================================================== */

console.log('🔍 EUROPA Debug Script loaded');

// Vérifier après le chargement complet
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    console.log('=== EUROPA DIAGNOSTICS ===');
    
    // Vérifier les fonctions principales
    console.log('📋 Function availability check:');
    console.log('- window.handleAddToCartFormSubmit:', typeof window.handleAddToCartFormSubmit);
    console.log('- window.toggleWishlist:', typeof window.toggleWishlist);
    console.log('- window.updateCartContents:', typeof window.updateCartContents);
    console.log('- window.handleCartItemRemoval:', typeof window.handleCartItemRemoval);
    
    // Vérifier les boutons
    const atcButtons = document.querySelectorAll('.btn-atc, button[type="submit"][name="add"]');
    const wishlistButtons = document.querySelectorAll('.btn-wishlist-add-remove, .btn-wishlist, [data-toggle-wishlist]');
    
    console.log('🔘 Buttons found:');
    console.log('- Add to Cart buttons:', atcButtons.length);
    console.log('- Wishlist buttons:', wishlistButtons.length);
    
    // Vérifier les formulaires
    const productForms = document.querySelectorAll('form[action*="/cart/add"]');
    console.log('📝 Product forms found:', productForms.length);
    
    productForms.forEach((form, index) => {
      const onsubmit = form.getAttribute('onsubmit');
      console.log(`- Form ${index + 1} onsubmit:`, onsubmit);
    });
    
    // Vérifier les offcanvas
    const cartOffcanvas = document.getElementById('offcanvas-cart');
    const wishlistOffcanvas = document.getElementById('offcanvas-wishlist');
    
    console.log('🛒 UI Elements:');
    console.log('- Cart offcanvas:', !!cartOffcanvas);
    console.log('- Wishlist offcanvas:', !!wishlistOffcanvas);
    
    // Vérifier Bootstrap
    console.log('🥾 Bootstrap:', typeof window.bootstrap);
    
    console.log('=== END DIAGNOSTICS ===');
  }, 2000);
});

// Écouter les clics pour déboguer
document.addEventListener('click', function(e) {
  const target = e.target;
  
  // Déboguer les clics sur les boutons Add to Cart
  const atcBtn = target.closest('.btn-atc, button[type="submit"][name="add"]');
  if (atcBtn) {
    console.log('🔘 ATC Button clicked:', atcBtn);
    console.log('- In form:', !!atcBtn.closest('form'));
    console.log('- Form onsubmit:', atcBtn.closest('form')?.getAttribute('onsubmit'));
  }
  
  // Déboguer les clics sur les boutons wishlist
  const wishlistBtn = target.closest('.btn-wishlist-add-remove, .btn-wishlist, [data-toggle-wishlist]');
  if (wishlistBtn) {
    console.log('💖 Wishlist Button clicked:', wishlistBtn);
    console.log('- Product handle:', wishlistBtn.dataset.productHandle);
  }
});
