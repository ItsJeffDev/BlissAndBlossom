// ===== CAROUSEL FUNCTIONALITY =====
const carouselSlides = document.querySelectorAll(".carousel-slide");
const indicators = document.querySelectorAll(".indicator");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
let currentSlide = 0;

window.addEventListener("load", () => {
  const heroItems = document.querySelectorAll(".hero-content > *");

  heroItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.25}s`;
  });
});

function showSlide(n) {
  // Remove active class from all slides and indicators
  carouselSlides.forEach((slide) => slide.classList.remove("active"));
  indicators.forEach((indicator) => indicator.classList.remove("active"));

  // Add active class to current slide and indicator
  carouselSlides[n].classList.add("active");
  indicators[n].classList.add("active");
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % carouselSlides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide =
    (currentSlide - 1 + carouselSlides.length) % carouselSlides.length;
  showSlide(currentSlide);
}

// Event listeners for carousel buttons
prevBtn.addEventListener("click", prevSlide);
nextBtn.addEventListener("click", nextSlide);

// Event listeners for indicator dots
indicators.forEach((indicator, index) => {
  indicator.addEventListener("click", () => {
    currentSlide = index;
    showSlide(currentSlide);
  });
});

// Optional: Auto-play carousel every 5 seconds
let autoPlayInterval = setInterval(nextSlide, 5000);

// Pause auto-play on hover, resume on mouse leave
const hero = document.querySelector(".hero");
hero.addEventListener("mouseenter", () => clearInterval(autoPlayInterval));
hero.addEventListener("mouseleave", () => {
  autoPlayInterval = setInterval(nextSlide, 5000);
});

// Initialize carousel
showSlide(currentSlide);

// ===== SHOPPING CART & FAVORITES FUNCTIONALITY =====
class ShoppingCart {
  constructor() {
    this.cartKey = "blissBloomCart";
    this.favoritesKey = "blissBloomFavorites";
    this.loadCart();
    this.loadFavorites();
    this.initializeEventListeners();
    this.updateCartCount();
  }

  loadCart() {
    const saved = localStorage.getItem(this.cartKey);
    this.cart = saved ? JSON.parse(saved) : [];
  }

  loadFavorites() {
    const saved = localStorage.getItem(this.favoritesKey);
    this.favorites = saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
  }

  saveFavorites() {
    localStorage.setItem(this.favoritesKey, JSON.stringify(this.favorites));
  }

  getProductData(card) {
    const title = card.querySelector("h4").textContent;
    const price = card.querySelector(".price").textContent;
    const image = card.querySelector(".product-image img").src;
    const productId =
      card.dataset.productId || title.replace(/\s+/g, "-").toLowerCase();

    return { productId, title, price, image };
  }

  addToCart(card) {
    const product = this.getProductData(card);
    const existingItem = this.cart.find(
      (item) => item.productId === product.productId,
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      product.quantity = 1;
      this.cart.push(product);
    }

    this.saveCart();
    this.showNotification(`${product.title} added to cart!`);
    this.updateCartCount();
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter((item) => item.productId !== productId);
    this.saveCart();
    this.updateCartCount();
  }

  toggleFavorite(card) {
    const product = this.getProductData(card);
    const index = this.favorites.findIndex(
      (fav) => fav.productId === product.productId,
    );
    const heartBtn = card.querySelector(".heart");

    if (index > -1) {
      this.favorites.splice(index, 1);
      this.showNotification(`${product.title} removed from favorites`);
    } else {
      this.favorites.push(product);
      this.showNotification(`${product.title} added to favorites!`);
    }

    this.saveFavorites();
    this.updateHeartIcon(card);
  }

  updateHeartIcon(card) {
    const product = this.getProductData(card);
    const heartBtn = card.querySelector(".heart");
    const isFavorite = this.favorites.some(
      (fav) => fav.productId === product.productId,
    );

    if (isFavorite) {
      heartBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
      heartBtn.style.background = "linear-gradient(135deg, #ff3288, #ff6ba8)";
      heartBtn.style.color = "#fff";
    } else {
      heartBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
      heartBtn.style.background = "linear-gradient(135deg, #ffe6f0, #ffd6e8)";
      heartBtn.style.color = "#ff3288";
    }
  }

  updateHeartIcons() {
    const cards = document.querySelectorAll(".product-card");
    cards.forEach((card) => this.updateHeartIcon(card));
  }

  updateCartCount() {
    const cartIcon = document.querySelector(
      ".icons i.fa-solid.fa-cart-shopping",
    );
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);

    // Remove existing badge if any
    const existingBadge = cartIcon.parentElement.querySelector(".cart-badge");
    if (existingBadge) existingBadge.remove();

    // Add new badge if there are items
    if (totalItems > 0) {
      const badge = document.createElement("span");
      badge.className = "cart-badge";
      badge.textContent = totalItems;
      badge.style.cssText = `
        position: absolute;
        top: -8px;
        right: -8px;
        background: #ff3288;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 700;
      `;
      cartIcon.parentElement.style.position = "relative";
      cartIcon.parentElement.appendChild(badge);
    }
  }

  showNotification(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: linear-gradient(135deg, #ff3288, #ff6ba8);
      color: white;
      padding: 15px 25px;
      border-radius: 50px;
      box-shadow: 0 8px 25px rgba(255, 50, 136, 0.3);
      font-weight: 600;
      z-index: 3000;
      animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  initializeEventListeners() {
    // Add event listeners to all heart buttons
    document.addEventListener("click", (e) => {
      if (e.target.closest(".heart")) {
        const card = e.target.closest(".product-card");
        this.toggleFavorite(card);
      }
    });

    // Add event listeners to all cart buttons
    document.addEventListener("click", (e) => {
      if (e.target.closest(".cart")) {
        const card = e.target.closest(".product-card");
        this.addToCart(card);
      }
    });

    // Add click listener to header cart icon to show cart
    const headerCartIcon = document.querySelector(
      ".icons i.fa-solid.fa-cart-shopping",
    );
    if (headerCartIcon) {
      headerCartIcon.parentElement.addEventListener("click", () => {
        this.showCartModal();
      });
    }

    // Add click listener to header heart icon to show favorites
    const headerHeartIcon = document.querySelector(
      ".icons i.fa-regular.fa-heart",
    );
    if (headerHeartIcon) {
      headerHeartIcon.parentElement.addEventListener("click", () => {
        this.showFavoritesModal();
      });
    }

    // Initialize customization handlers for all popups
    this.initializePopupCustomization();
  }

  initializePopupCustomization() {
    // Handle type button clicks
    document.addEventListener("click", (e) => {
      if (e.target.closest(".type-btn")) {
        const btn = e.target.closest(".type-btn");
        const typeButtons = btn.closest(".type-buttons");

        // Remove active class from all buttons in this group
        typeButtons
          .querySelectorAll(".type-btn")
          .forEach((b) => b.classList.remove("active"));
        // Add active class to clicked button
        btn.classList.add("active");

        // Update price
        const popup = btn.closest(".popup-content");
        this.updateCustomizationPrice(popup);
      }
    });

    // Handle add-on checkbox changes
    document.addEventListener("change", (e) => {
      if (e.target.closest(".addon-item")) {
        const popup = e.target.closest(".popup-content");
        this.updateCustomizationPrice(popup);
      }
    });

    // Handle popup Add to Cart button
    document.addEventListener("click", (e) => {
      if (e.target.closest(".btn-add-to-cart")) {
        const btn = e.target.closest(".btn-add-to-cart");
        const productId = btn.dataset.productId;
        const popup = btn.closest(".popup-content");
        this.addToCartFromPopup(popup, productId);
      }
    });
  }

  updateCustomizationPrice(popupContent) {
    const basePrice = parseInt(
      popupContent
        .querySelector(".base-price")
        .textContent.replace(/[₱,]/g, ""),
    );
    
    const selectedType = popupContent.querySelector(".type-btn.active");
    const typePrice = parseInt(selectedType.dataset.price);

    // Calculate add-ons price
    let addonsPrice = 0;
    const checkedAddons = popupContent.querySelectorAll(".addon-item:checked");
    checkedAddons.forEach((addon) => {
      addonsPrice += parseInt(addon.dataset.price);
    });

    // Update price displays
    popupContent.querySelector(".type-price").textContent = `₱${typePrice}`;
    popupContent.querySelector(".addon-price").textContent = `₱${addonsPrice}`;

    const totalPrice = basePrice + typePrice + addonsPrice;
    popupContent.querySelector(".total-price").textContent =
      `₱${totalPrice.toLocaleString()}`;
  }

  addToCartFromPopup(popupContent, productId) {
    // Get product title and base price from popup
    const title = popupContent.querySelector(".popup-image h2").textContent;
    const basePrice = popupContent.querySelector(".base-price").textContent;
    const image = popupContent.querySelector(".popup-image img").src;

    // Get customization details
    const selectedType = popupContent.querySelector(".type-btn.active");
    const typeUpgrade = selectedType.dataset.type;
    const typePrice = parseInt(selectedType.dataset.price);

    // Get selected add-ons
    const selectedAddons = [];
    const checkedAddons = popupContent.querySelectorAll(".addon-item:checked");
    let addonsPrice = 0;
    checkedAddons.forEach((addon) => {
      selectedAddons.push({
        addon: addon.dataset.addon,
        price: parseInt(addon.dataset.price),
      });
      addonsPrice += parseInt(addon.dataset.price);
    });

    // Get total price
    const totalPrice = popupContent.querySelector(".total-price").textContent;

    // Create cart item with customization
    const product = {
      productId: productId + "-" + Date.now(), // Unique ID for each customized item
      originalId: productId,
      title: title,
      basePrice: basePrice,
      totalPrice: totalPrice,
      image: image,
      quantity: 1,
      customization: {
        type: typeUpgrade,
        typePrice: typePrice,
        addons: selectedAddons,
        addonsPrice: addonsPrice,
        totalCustomizationPrice: typePrice + addonsPrice,
      },
    };

    this.cart.push(product);
    this.saveCart();
    this.showNotification(`${title} with customizations added to cart!`);
    this.updateCartCount();
  }

  showCartModal() {
    const cartModal = document.getElementById("cartModal");
    const cartItemsContainer = document.getElementById("cartItems");
    const cartFooter = document.getElementById("cartFooter");

    if (this.cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty">
          <i class="fa-solid fa-shopping-cart"></i>
          <p>Your cart is empty</p>
        </div>
      `;
      cartFooter.innerHTML = "";
    } else {
      let cartHTML = "";
      let total = 0;

      this.cart.forEach((item) => {
        // Handle both old format (with .price) and new format (with customization)
        let priceNum;
        let itemDisplay = "";

        if (item.customization) {
          // New format with customization
          // Use totalCustomizationPrice if totalPrice is missing
          const totalStr = item.totalPrice || `₱${item.basePrice}`;
          priceNum = parseInt(totalStr.replace(/[₱,]/g, ""));
          const customizationDetails = item.customization.addons
            .map((addon) => addon.addon)
            .join(", ");
          itemDisplay = `
            <div class="cart-item">
              <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}" />
              </div>
              <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">${item.totalPrice}</div>
                <div class="cart-item-quantity">Quantity: ${item.quantity}</div>
                <div class="cart-item-customization" style="font-size: 12px; color: #999; margin-top: 5px;">
                  <div>Type: ${item.customization.type}</div>
                  ${item.customization.addons.length > 0 ? `<div>Add-ons: ${customizationDetails}</div>` : ""}
                </div>
              </div>
              <button class="cart-item-delete" onclick="window.shoppingCart.removeFromCart('${item.productId}'); window.shoppingCart.showCartModal();">Delete</button>
            </div>
          `;
        } else {
          // Old format without customization
          priceNum = parseInt(item.price.replace(/[₱,]/g, ""));
          itemDisplay = `
            <div class="cart-item">
              <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}" />
              </div>
              <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">${item.price}</div>
                <div class="cart-item-quantity">Quantity: ${item.quantity}</div>
              </div>
              <button class="cart-item-delete" onclick="window.shoppingCart.removeFromCart('${item.productId}'); window.shoppingCart.showCartModal();">Delete</button>
            </div>
          `;
        }

        const itemTotal = priceNum * item.quantity;
        total += itemTotal;
        cartHTML += itemDisplay;
      });

      cartItemsContainer.innerHTML = cartHTML;

      cartFooter.innerHTML = `
        <div class="cart-total">
          <span>Total:</span>
          <span>₱${total.toLocaleString()}</span>
        </div>
        <button class="cart-checkout-btn">Proceed to Checkout</button>
      `;
    }

    cartModal.classList.add("active");
  }

  showFavoritesModal() {
    const favoritesModal = document.getElementById("favoritesModal");
    const favoriteItemsContainer = document.getElementById("favoriteItems");

    if (this.favorites.length === 0) {
      favoriteItemsContainer.innerHTML = `
        <div class="cart-empty">
          <i class="fa-solid fa-heart"></i>
          <p>No favorite items yet</p>
        </div>
      `;
    } else {
      let favHTML = "";

      this.favorites.forEach((item) => {
        favHTML += `
          <div class="cart-item">
            <div class="cart-item-image">
              <img src="${item.image}" alt="${item.title}" />
            </div>
            <div class="cart-item-details">
              <div class="cart-item-title">${item.title}</div>
              <div class="cart-item-price">${item.price}</div>
            </div>
            <button class="cart-item-delete" onclick="window.shoppingCart.removeFavorite('${item.productId}'); window.shoppingCart.showFavoritesModal();">Remove</button>
          </div>
        `;
      });

      favoriteItemsContainer.innerHTML = favHTML;
    }

    favoritesModal.classList.add("active");
  }

  removeFavorite(productId) {
    this.favorites = this.favorites.filter(
      (fav) => fav.productId !== productId,
    );
    this.saveFavorites();
    this.updateHeartIcons();
  }
}

// Initialize shopping cart
window.shoppingCart = new ShoppingCart();

// Add animation styles
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ===== MODAL CLOSE FUNCTIONALITY =====
function closeModals() {
  const cartModal = document.getElementById("cartModal");
  const favoritesModal = document.getElementById("favoritesModal");

  if (cartModal) cartModal.classList.remove("active");
  if (favoritesModal) favoritesModal.classList.remove("active");
}

// Close modal when clicking close button
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("cart-modal-close")) {
    closeModals();
  }
});

// Close modal when clicking outside
document.addEventListener("click", (e) => {
  const cartModal = document.getElementById("cartModal");
  const favoritesModal = document.getElementById("favoritesModal");

  if (e.target === cartModal) closeModals();
  if (e.target === favoritesModal) closeModals();
});

// Close on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModals();
});

// Update heart icons when page loads
window.addEventListener("load", () => {
  window.shoppingCart.updateHeartIcons();
});

// ===== PRODUCT VISIBILITY =====
const viewAllBtn = document.getElementById("viewAllBtn");
const products = document.querySelectorAll(".product-card");
const ITEMS_TO_SHOW = 6;
let isExpanded = false;

// Navbar Toggle
const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");

menuIcon.onclick = () => {
  menuIcon.classList.toggle("bx-x");
  navbar.classList.toggle("active");
};

window.onscroll = () => {
  menuIcon.classList.remove("bx-x");
  navbar.classList.remove("active");
};

function updateProductVisibility() {
  products.forEach((product, index) => {
    if (isExpanded || index < ITEMS_TO_SHOW) {
      product.classList.add("show");
    } else {
      product.classList.remove("show");
    }
  });
}

updateProductVisibility();

viewAllBtn.addEventListener("click", function (e) {
  e.preventDefault();
  isExpanded = !isExpanded;

  updateProductVisibility();

  if (isExpanded) {
    viewAllBtn.textContent = "Show Less";
  } else {
    viewAllBtn.textContent = "View All Products";
  }
});

// ===== PRODUCT CUSTOMIZATION & PRICE CALCULATION =====
function setupCustomizationListeners() {
  // Get all popups
  const popups = document.querySelectorAll('.popup');
  
  popups.forEach(popup => {
    const typeBtns = popup.querySelectorAll('.type-btn');
    const addonCheckboxes = popup.querySelectorAll('.addon-item');
    const basePriceElement = popup.querySelector('.base-price');
    const typePriceElement = popup.querySelector('.type-price');
    const addonPriceElement = popup.querySelector('.addon-price');
    const totalPriceElement = popup.querySelector('.total-price');
    
    if (!basePriceElement || !typePriceElement || !addonPriceElement || !totalPriceElement) {
      return; // Skip if elements are missing
    }
    
    // Get base price from the element
    const basePriceText = basePriceElement.textContent.replace(/[₱,]/g, '');
    const basePrice = parseInt(basePriceText);
    
    function calculateTotal() {
      // Get selected type upgrade price
      const activeTypeBtn = popup.querySelector('.type-btn.active');
      const typePrice = activeTypeBtn ? parseInt(activeTypeBtn.dataset.price) : 0;
      
      // Calculate addon total
      let addonTotal = 0;
      addonCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
          addonTotal += parseInt(checkbox.dataset.price);
        }
      });
      
      // Calculate grand total
      const grandTotal = basePrice + typePrice + addonTotal;
      
      // Update display
      typePriceElement.textContent = `₱${typePrice.toLocaleString()}`;
      addonPriceElement.textContent = `₱${addonTotal.toLocaleString()}`;
      totalPriceElement.textContent = `₱${grandTotal.toLocaleString()}`;
    }
    
    // Add event listeners to type buttons
    typeBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        // Remove active class from all buttons
        typeBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        // Recalculate total
        calculateTotal();
      });
    });
    
    // Add event listeners to addon checkboxes
    addonCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', calculateTotal);
    });
    
    // Initial calculation
    calculateTotal();
  });
}

// Setup customization listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', setupCustomizationListeners);

// Also setup when page loads (backup)
window.addEventListener('load', setupCustomizationListeners);
// ===== REVIEWS CAROUSEL FUNCTIONALITY =====
const reviewsTrack = document.querySelector('.reviews-carousel-track');
const reviewCards = document.querySelectorAll('.reviews-carousel-track .review-card');
const reviewsPrevBtn = document.getElementById('reviewsPrevBtn');
const reviewsNextBtn = document.getElementById('reviewsNextBtn');

let reviewsCurrentIndex = 0;
let reviewsPerView = 3; // Default: show 3 reviews at a time

// Function to update reviews per view based on screen size
function updateReviewsPerView() {
  const width = window.innerWidth;
  if (width <= 768) {
    reviewsPerView = 1;
  } else if (width <= 1200) {
    reviewsPerView = 2;
  } else {
    reviewsPerView = 3;
  }
  moveReviewsCarousel(); // Adjust position after changing view count
}

// Function to move the carousel
function moveReviewsCarousel() {
  if (!reviewsTrack) return;
  
  const cardWidth = reviewCards[0].offsetWidth;
  const gap = 30; // Match the gap from CSS
  const moveAmount = (cardWidth + gap) * reviewsCurrentIndex;
  reviewsTrack.style.transform = `translateX(-${moveAmount}px)`;
  
  // Update button states
  updateReviewsButtons();
}

// Function to update button states (enable/disable)
function updateReviewsButtons() {
  if (!reviewsPrevBtn || !reviewsNextBtn) return;
  
  const maxIndex = Math.max(0, reviewCards.length - reviewsPerView);
  
  // Disable prev button if at start
  reviewsPrevBtn.disabled = reviewsCurrentIndex === 0;
  reviewsPrevBtn.style.opacity = reviewsCurrentIndex === 0 ? '0.5' : '1';
  reviewsPrevBtn.style.cursor = reviewsCurrentIndex === 0 ? 'not-allowed' : 'pointer';
  
  // Disable next button if at end
  reviewsNextBtn.disabled = reviewsCurrentIndex >= maxIndex;
  reviewsNextBtn.style.opacity = reviewsCurrentIndex >= maxIndex ? '0.5' : '1';
  reviewsNextBtn.style.cursor = reviewsCurrentIndex >= maxIndex ? 'not-allowed' : 'pointer';
}

// Event listener for next button
if (reviewsNextBtn) {
  reviewsNextBtn.addEventListener('click', () => {
    const maxIndex = Math.max(0, reviewCards.length - reviewsPerView);
    if (reviewsCurrentIndex < maxIndex) {
      reviewsCurrentIndex++;
      moveReviewsCarousel();
    }
  });
}

// Event listener for prev button
if (reviewsPrevBtn) {
  reviewsPrevBtn.addEventListener('click', () => {
    if (reviewsCurrentIndex > 0) {
      reviewsCurrentIndex--;
      moveReviewsCarousel();
    }
  });
}

// Update on window resize
window.addEventListener('resize', () => {
  updateReviewsPerView();
});

// Initialize on page load
if (reviewsTrack) {
  updateReviewsPerView();
}