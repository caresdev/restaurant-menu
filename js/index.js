// Global variables
let menuData = null;
let cart = [];
let currentCategory = "all";

// DOM elements
let restaurantNameEl,
  restaurantTaglineEl,
  restaurantSloganEl,
  restaurantDescriptionEl;
let categoryFiltersEl, menuContainerEl, cartSummaryEl, cartItemsEl, cartTotalEl;
let sendWhatsAppBtn, clearCartBtn, toggleCartBtn;
let cartItemCountExpandedEl, cartToggleIconEl, cartAnnouncementsEl;
let restaurantAddressEl,
  restaurantEmailEl,
  restaurantPhoneEl,
  restaurantNameFooterEl;

// Load menu data and initialize app
document.addEventListener("DOMContentLoaded", async () => {
  console.debug("DOM Content Loaded - Initializing app...");

  // Initialize DOM elements
  initializeDOMElements();

  // Check if required elements exist
  if (!menuContainerEl) {
    console.error("DOM elements missing. App cannot initialize.");
    return;
  }

  try {
    console.log("Fetching menu data...");

    let response;
    try {
      response = await fetch("/data.json");
    } catch (e) {
      console.warn("Absolute path failed, trying relative path...", e);
      response = await fetch("./data.json");
    }

    if (!response.ok) {
      throw new Error(`Error fetching menu data. Status: ${response.status}`);
    }

    // parse menu data
    menuData = await response.json();
    console.log("Menu data loaded successfully:", menuData);

    // Validate menu data structure
    if (!menuData || !menuData.restaurant || !menuData.categories) {
      throw new Error("Invalid menu data structure");
    }

    initializeApp();
  } catch (error) {
    console.error("Failed to load menu data:", error);
    if (menuContainerEl) {
      menuContainerEl.innerHTML = `
        <div class="text-center text-danger p-4">
          <h3>Failed to load menu</h3>
          <p>Error: ${error.message}</p>
          <button class="btn btn-primary" onclick="location.reload()">Reload Page</button>
        </div>
      `;
    }
  }
});

// Initialize DOM elements
function initializeDOMElements() {
  restaurantNameEl = document.getElementById("restaurantName");
  restaurantTaglineEl = document.getElementById("restaurantTagline");
  restaurantSloganEl = document.getElementById("restaurantSlogan");
  restaurantDescriptionEl = document.getElementById("restaurantDescription");
  categoryFiltersEl = document.getElementById("categoryFilters");
  menuContainerEl = document.getElementById("menuContainer");
  cartSummaryEl = document.getElementById("cartSummary");
  cartItemsEl = document.getElementById("cartItems");
  cartTotalEl = document.getElementById("cartTotal");
  sendWhatsAppBtn = document.getElementById("sendWhatsApp");
  clearCartBtn = document.getElementById("clearCart");
  toggleCartBtn = document.getElementById("toggleCart");
  cartItemCountExpandedEl = document.getElementById("cartItemCountExpanded");
  cartToggleIconEl = document.getElementById("cartToggleIcon");
  cartAnnouncementsEl = document.getElementById("cartAnnouncements");
  restaurantAddressEl = document.getElementById("restaurantAddress");
  restaurantEmailEl = document.getElementById("restaurantEmail");
  restaurantPhoneEl = document.getElementById("restaurantPhone");
  restaurantNameFooterEl = document.getElementById("restaurantNameFooter");

  // Log missing elements for debugging
  const elements = {
    restaurantNameEl,
    restaurantTaglineEl,
    restaurantSloganEl,
    restaurantDescriptionEl,
    categoryFiltersEl,
    menuContainerEl,
    cartSummaryEl,
    cartItemsEl,
    cartTotalEl,
    sendWhatsAppBtn,
    clearCartBtn,
    toggleCartBtn,
    cartItemCountExpandedEl,
    cartToggleIconEl,
    cartAnnouncementsEl,
    restaurantAddressEl,
    restaurantEmailEl,
    restaurantPhoneEl,
    restaurantNameFooterEl,
  };

  Object.entries(elements).forEach(([name, element]) => {
    if (!element) {
      console.warn(`DOM element missing: ${name}`);
    }
  });
}

// Initialize the application
function initializeApp() {
  console.log("Initializing application...");

  try {
    updateRestaurantInfo();
    renderCategoryFilters();
    renderMenu();
    setupEventListeners();
    console.log("Application initialized successfully!");
  } catch (error) {
    console.error("Error during app initialization:", error);
  }
}

// Update restaurant information in header
function updateRestaurantInfo() {
  if (!menuData || !menuData.restaurant) {
    console.warn("Restaurant data not available");
    return;
  }

  const { restaurant } = menuData;

  if (restaurantNameEl) restaurantNameEl.textContent = restaurant.name;
  if (restaurantTaglineEl) restaurantTaglineEl.textContent = restaurant.tagline;
  if (restaurantSloganEl) restaurantSloganEl.textContent = restaurant.slogan;
  if (restaurantDescriptionEl)
    restaurantDescriptionEl.textContent = restaurant.description;

  // Update footer information
  if (restaurantNameFooterEl)
    restaurantNameFooterEl.textContent = restaurant.name;
  if (restaurantAddressEl)
    restaurantAddressEl.textContent =
      restaurant.contact?.address || "Company Address";
  if (restaurantEmailEl) {
    restaurantEmailEl.textContent =
      restaurant.contact?.email || "company@example.com";
    restaurantEmailEl.href = `mailto:${
      restaurant.contact?.email || "company@example.com"
    }`;
  }
  if (restaurantPhoneEl) {
    const phone = restaurant.contact?.phone || "+1 (123) 456-7890";
    restaurantPhoneEl.textContent = phone;
    restaurantPhoneEl.href = `tel:${phone.replace(/\D/g, "")}`;
  }

  // Update Google Maps embed URL
  updateGoogleMapsEmbed(restaurant.contact?.address);

  console.log("Restaurant info updated");
}

// Update Google Maps embed URL based on address
function updateGoogleMapsEmbed(address) {
  const googleMapEl = document.getElementById("googleMap");
  if (!googleMapEl) return;

  const defaultAddress = "Company Address, New York, NY";
  const targetAddress = address || defaultAddress;

  // Create Google Maps embed URL
  const encodedAddress = encodeURIComponent(targetAddress);
  const fallbackUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  googleMapEl.src = fallbackUrl;
  console.log("Google Maps updated for address:", targetAddress);
}

// Render category filter buttons
function renderCategoryFilters() {
  if (!categoryFiltersEl) {
    console.warn("Category filters element not found");
    return;
  }

  const nav = categoryFiltersEl.querySelector("nav");
  if (!nav) {
    console.warn("Navigation element not found in category filters");
    return;
  }

  // Clear existing buttons
  nav.innerHTML = "";

  // Create "All" button
  const allButton = document.createElement("button");
  allButton.className = "btn filter-btn rounded-pill me-2 mb-2 active";
  allButton.textContent = "All";
  allButton.dataset.category = "all";
  nav.appendChild(allButton);

  // Create category buttons
  if (menuData && menuData.categories) {
    menuData.categories.forEach((category) => {
      const button = document.createElement("button");
      button.className = "btn filter-btn rounded-pill me-2 mb-2";
      button.textContent = category.name;
      button.dataset.category = category.id;
      nav.appendChild(button);
    });
    console.log("Category filters rendered");
  } else {
    console.warn("No categories found in menu data");
  }
}

// Render menu based on current category filter
function renderMenu(categoryFilter = "all") {
  if (!menuContainerEl) {
    console.warn("Menu container element not found");
    return;
  }

  if (!menuData || !menuData.categories) {
    console.warn("Menu data or categories not available");
    menuContainerEl.innerHTML =
      '<p class="text-center text-warning">No menu data available</p>';
    return;
  }

  console.log("Rendering menu with filter:", categoryFilter);

  // Remove loading fallback
  const loadingFallback = document.getElementById("loadingFallback");
  if (loadingFallback) {
    loadingFallback.remove();
  }

  menuContainerEl.innerHTML = "";

  const categoriesToShow =
    categoryFilter === "all"
      ? menuData.categories
      : menuData.categories.filter((cat) => cat.id === categoryFilter);

  if (categoriesToShow.length === 0) {
    menuContainerEl.innerHTML =
      '<p class="text-center text-warning">No categories match the selected filter</p>';
    return;
  }

  categoriesToShow.forEach((category) => {
    if (!category.items) {
      console.warn(`Category ${category.name} has no items`);
      return;
    }

    const availableItems = category.items.filter((item) => item.available);

    if (availableItems.length === 0) return;

    // Create category section
    const section = document.createElement("section");
    section.className = "container menu-category";

    // Category title
    const title = document.createElement("h2");
    title.className = "category-name text-uppercase";
    title.textContent = category.name;
    section.appendChild(title);

    // Items container
    const itemsContainer = document.createElement("div");
    itemsContainer.className =
      "section-items row row-cols-1 justify-content-center mb-5";

    // Render items
    availableItems.forEach((item) => {
      const article = document.createElement("article");
      article.className = "menu-item col-xl-6";

      article.innerHTML = `
        <div class="row justify-content-md-around">
            <div class="col-md-6 col-lg-5 text-center">
              <img src="${item.image || "images/menu-item.png"}" alt="${
        item.title
      }" class="menu-img"/>
            </div>
            <div class="col-md-6 col-lg-5 item-info mt-3 px-4">
              <div class="row justify-content-between">
                <h4 class="col item-title text-uppercase">${item.title}</h4>
                <h4 class="col item-price">$${(item.price || 0).toFixed(2)}</h4>
              </div>
              <p class="item-description">${
                item.description || "No description available"
              }</p>

              <div class="text-end mt-3">
                <button class="btn btn-success rounded-pill add-to-cart" 
                  data-item-id="${item.id}"
                  data-title="${item.title}" 
                  data-price="${item.price || 0}">
                  <i class="fas fa-plus me-1"></i>Add to Cart
                </button>
              </div>
            </div>
        </div>
      `;

      itemsContainer.appendChild(article);
    });

    section.appendChild(itemsContainer);
    menuContainerEl.appendChild(section);
  });

  console.log("Menu rendered successfully");
}

// Setup event listeners
function setupEventListeners() {
  // Navigation menu toggle
  const navLinks = document.querySelectorAll(".nav-link");
  const navbarToggler = document.querySelector(".navbar-toggler");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navbarToggler.getAttribute("aria-expanded") === "true") {
        navbarToggler.click();
      }
    });
  });

  // Category filter buttons
  categoryFiltersEl.addEventListener("click", (e) => {
    if (e.target.classList.contains("filter-btn")) {
      // Update active button
      document
        .querySelectorAll(".filter-btn")
        .forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");

      // Update current category and render menu
      currentCategory = e.target.dataset.category;
      renderMenu(currentCategory);
    }
  });

  // Add to cart buttons
  menuContainerEl.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("add-to-cart") ||
      e.target.parentElement.classList.contains("add-to-cart")
    ) {
      const button = e.target.classList.contains("add-to-cart")
        ? e.target
        : e.target.parentElement;
      addToCart(
        button.dataset.itemId,
        button.dataset.title,
        parseFloat(button.dataset.price)
      );
    }
  });

  // Cart management
  if (clearCartBtn) clearCartBtn.addEventListener("click", clearCart);
  if (sendWhatsAppBtn)
    sendWhatsAppBtn.addEventListener("click", sendOrderToWhatsApp);
  if (toggleCartBtn) toggleCartBtn.addEventListener("click", toggleCart);

  // Keyboard support for cart
  if (cartSummaryEl) {
    cartSummaryEl.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (!cartSummaryEl.classList.contains("collapsed")) {
          toggleCart();
        }
      }
    });
  }

  // Cart item removal
  if (cartItemsEl) {
    cartItemsEl.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-item")) {
        const itemId = e.target.dataset.itemId;
        removeFromCart(itemId);
      }
    });
  }
}

// Remove item from cart
function removeFromCart(itemId) {
  cart = cart.filter((item) => item.id !== itemId);
  updateCartDisplay();

  if (cart.length === 0) {
    hideCartSummary();
  }
}

// Clear entire cart
function clearCart() {
  cart = [];
  updateCartDisplay();
  hideCartSummary();
}

// Update cart display
function updateCartDisplay() {
  if (!cartItemsEl) return;

  cartItemsEl.innerHTML = "";

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Update cart counter and total
  if (cartItemCountExpandedEl) cartItemCountExpandedEl.textContent = totalItems;
  if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)}`;

  if (cart.length === 0) {
    cartItemsEl.innerHTML =
      '<p class="text-muted text-center py-4">Your cart is empty</p>';
    hideCartSummary();
    return;
  }

  // Show cart when items are added
  showCartSummary();

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item-expanded p-3 mb-2 bg-white rounded border";
    cartItem.innerHTML = `
      <div class="cart-item-content">
        <div class="item-details">
          <h6 class="item-name mb-1">${item.title}</h6>
          <span class="item-unit-price text-muted">$${item.price.toFixed(
            2
          )} each</span>
        </div>
        
        <div class="item-controls">
          <div class="quantity-controls">
            <button class="btn btn-sm btn-outline-secondary qty-decrease" data-item-id="${
              item.id
            }" ${item.quantity <= 1 ? "disabled" : ""}>
              <i class="fas fa-minus"></i>
            </button>
            <span class="qty-display">${item.quantity}</span>
            <button class="btn btn-sm btn-outline-secondary qty-increase" data-item-id="${
              item.id
            }">
              <i class="fas fa-plus"></i>
            </button>
          </div>
          
          <div class="item-total-section">
            <span class="item-total">$${itemTotal.toFixed(2)}</span>
            <button class="btn btn-sm btn-outline-danger remove-item ms-2" data-item-id="${
              item.id
            }" title="Remove item">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    cartItemsEl.appendChild(cartItem);
  });

  // Setup quantity control event listeners
  setupQuantityControls();
}

// Show cart summary
function showCartSummary() {
  if (cartSummaryEl) {
    cartSummaryEl.style.display = "block";

    // Start with cart items collapsed on first show
    if (!cartSummaryEl.hasAttribute("data-initialized")) {
      cartSummaryEl.classList.add("collapsed");
      cartSummaryEl.setAttribute("data-initialized", "true");
      updateToggleIcon(true); // Chevron up for collapsed state
    }
  }
}

// Hide cart summary
function hideCartSummary() {
  if (cartSummaryEl) {
    cartSummaryEl.style.display = "none";
    cartSummaryEl.removeAttribute("data-initialized");
  }
}

// Toggle cart items visibility
function toggleCart() {
  if (!cartSummaryEl) return;

  const isCollapsed = cartSummaryEl.classList.contains("collapsed");

  if (isCollapsed) {
    // Expand: show cart items
    cartSummaryEl.classList.remove("collapsed");
    updateToggleIcon(false); // Chevron down for expanded state
  } else {
    // Collapse: hide cart items
    cartSummaryEl.classList.add("collapsed");
    updateToggleIcon(true); // Chevron up for collapsed state
  }
}

// Setup quantity control event listeners
function setupQuantityControls() {
  // Remove existing listeners to avoid duplicates
  if (cartItemsEl.quantityListenerAdded) return;

  cartItemsEl.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;

    const itemId = button.dataset.itemId;
    if (!itemId) return;

    if (button.classList.contains("qty-decrease")) {
      changeQuantity(itemId, -1);
    } else if (button.classList.contains("qty-increase")) {
      changeQuantity(itemId, 1);
    } else if (button.classList.contains("remove-item")) {
      removeFromCart(itemId);
    }
  });

  cartItemsEl.quantityListenerAdded = true;
}

// Change item quantity
function changeQuantity(itemId, delta) {
  const item = cart.find((item) => item.id === itemId);
  if (!item) return;

  const oldQuantity = item.quantity;
  item.quantity += delta;

  if (item.quantity <= 0) {
    removeFromCart(itemId);
  } else {
    updateCartDisplay();
    announceToScreenReader(
      `Updated ${item.title} quantity from ${oldQuantity} to ${item.quantity}`
    );
  }
}

// Add to cart with announcement
function addToCart(itemId, title, price) {
  const existingItem = cart.find((item) => item.id === itemId);

  if (existingItem) {
    existingItem.quantity += 1;
    announceToScreenReader(
      `Added another ${title} to cart. Total: ${existingItem.quantity}`
    );
  } else {
    cart.push({
      id: itemId,
      title: title,
      price: price,
      quantity: 1,
    });
    announceToScreenReader(`Added ${title} to cart`);
  }

  updateCartDisplay();
  showCartSummary();
}

// Screen reader announcements
function announceToScreenReader(message) {
  if (cartAnnouncementsEl) {
    cartAnnouncementsEl.textContent = message;
    // Clear after announcement
    setTimeout(() => {
      cartAnnouncementsEl.textContent = "";
    }, 1000);
  }
}

// Update toggle icon
function updateToggleIcon(isCollapsed) {
  if (cartToggleIconEl) {
    cartToggleIconEl.className = isCollapsed
      ? "fas fa-chevron-down"
      : "fas fa-chevron-up";
  }
}

// Send order to WhatsApp
function sendOrderToWhatsApp() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let message = `Hello! I would like to place an order from ${menuData.restaurant.name}:\n\n`;

  let total = 0;
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    message += `• ${item.title} × ${item.quantity} - $${itemTotal.toFixed(
      2
    )}\n`;
  });

  message += `\nTotal: $${total.toFixed(2)}\n\nThank you!`;

  const phoneNumber = menuData.restaurant.phone;
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  window.open(whatsappUrl, "_blank");
}
