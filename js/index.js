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

  // Add to cart buttons with options support
  menuContainerEl.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("add-to-cart") ||
      e.target.parentElement.classList.contains("add-to-cart")
    ) {
      const button = e.target.classList.contains("add-to-cart")
        ? e.target
        : e.target.parentElement;
      addToCartWithOptions(
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
  
  // Options modal
  const confirmOptionsBtn = document.getElementById('confirmOptionsBtn');
  if (confirmOptionsBtn) confirmOptionsBtn.addEventListener("click", confirmOptions);

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
  const total = cart.reduce((sum, item) => sum + (item.unitPrice || item.price) * item.quantity, 0);

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

  cart.forEach((item, index) => {
    const unitPrice = item.unitPrice || item.price;
    const itemTotal = unitPrice * item.quantity;

    // Build options display
    let optionsHtml = '';
    if (item.options && item.options.length > 0) {
      const optionsByGroup = {};
      item.options.forEach(option => {
        if (!optionsByGroup[option.groupName]) {
          optionsByGroup[option.groupName] = [];
        }
        optionsByGroup[option.groupName].push(option);
      });
      
      Object.keys(optionsByGroup).forEach(groupName => {
        const groupOptions = optionsByGroup[groupName];
        const optionNames = groupOptions.map(opt => {
          let optionText = opt.name;
          if (opt.priceDelta > 0) {
            optionText += ` (+$${opt.priceDelta.toFixed(2)})`;
          }
          return optionText;
        }).join(', ');
        optionsHtml += `<div class="item-option"><strong>${groupName}:</strong> ${optionNames}</div>`;
      });
    }

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item-expanded p-3 mb-2 bg-white rounded border";
    cartItem.innerHTML = `
      <div class="cart-item-content">
        <div class="item-details">
          <h6 class="item-name mb-1">${item.title}</h6>
          <span class="item-unit-price text-muted">$${unitPrice.toFixed(2)} each</span>
          ${optionsHtml ? `<div class="item-options mt-1">${optionsHtml}</div>` : ''}
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
            ${item.options && item.options.length > 0 ? 
              `<button class="btn btn-sm btn-outline-primary edit-item me-1" data-item-index="${index}" title="Edit options">
                <i class="fas fa-edit"></i>
              </button>` : ''
            }
            <button class="btn btn-sm btn-outline-danger remove-item" data-item-id="${
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
    const itemIndex = button.dataset.itemIndex;

    if (button.classList.contains("qty-decrease") && itemId) {
      changeQuantity(itemId, -1);
    } else if (button.classList.contains("qty-increase") && itemId) {
      changeQuantity(itemId, 1);
    } else if (button.classList.contains("remove-item") && itemId) {
      removeFromCart(itemId);
    } else if (button.classList.contains("edit-item") && itemIndex !== undefined) {
      editCartItem(parseInt(itemIndex));
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

// Options Modal Variables
let currentOptionsItem = null;
let currentSelections = {};
let isEditingCartItem = false;
let editingCartItemIndex = -1;

// Options Modal Functions
function openOptionsModal(item, isEdit = false, cartItemIndex = -1) {
  currentOptionsItem = item;
  isEditingCartItem = isEdit;
  editingCartItemIndex = cartItemIndex;
  currentSelections = {};

  // If editing, pre-populate selections
  if (isEdit && cartItemIndex >= 0) {
    const cartItem = cart[cartItemIndex];
    if (cartItem.options) {
      cartItem.options.forEach(option => {
        if (!currentSelections[option.groupId]) {
          currentSelections[option.groupId] = [];
        }
        currentSelections[option.groupId].push(option.id);
      });
    }
  }

  renderOptionsModal(item);
  document.getElementById('optionsModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeOptionsModal() {
  document.getElementById('optionsModal').style.display = 'none';
  document.body.style.overflow = 'auto';
  currentOptionsItem = null;
  currentSelections = {};
  isEditingCartItem = false;
  editingCartItemIndex = -1;
}

function renderOptionsModal(item) {
  // Update item info
  document.getElementById('optionsItemTitle').textContent = item.title;
  document.getElementById('optionsBasePrice').textContent = `$${item.price.toFixed(2)}`;
  
  const container = document.getElementById('optionGroupsContainer');
  container.innerHTML = '';

  if (!item.optionGroups || item.optionGroups.length === 0) {
    container.innerHTML = '<p class="text-muted">No customization options available.</p>';
    return;
  }

  item.optionGroups.forEach(group => {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'option-group';
    
    const isRequired = group.min > 0;
    const groupTitle = group.name + (isRequired ? ' *' : '');
    
    groupDiv.innerHTML = `
      <div class="option-group-header">
        <h6 class="option-group-title${isRequired ? ' required' : ''}">${groupTitle}</h6>
      </div>
      <div class="option-group-body" data-group-id="${group.id}">
        ${group.options.map(option => renderOptionItem(group, option)).join('')}
      </div>
    `;

    container.appendChild(groupDiv);
  });

  updateOptionsTotal();
  validateOptionsSelection();
}

function renderOptionItem(group, option) {
  const inputType = group.type === 'single' ? 'radio' : 'checkbox';
  const inputName = group.type === 'single' ? `option-${group.id}` : '';
  const isChecked = currentSelections[group.id]?.includes(option.id) || false;
  
  const priceText = option.priceDelta > 0 ? 
    `+$${option.priceDelta.toFixed(2)}` : 
    (option.priceDelta < 0 ? `-$${Math.abs(option.priceDelta).toFixed(2)}` : 'Free');

  const priceClass = option.priceDelta === 0 ? 'free' : '';

  return `
    <div class="option-item" onclick="toggleOption('${group.id}', '${option.id}', '${group.type}', ${group.max})">
      <input type="${inputType}" 
             ${inputName ? `name="${inputName}"` : ''} 
             value="${option.id}"
             ${isChecked ? 'checked' : ''}
             onchange="event.stopPropagation()">
      <div class="option-details">
        <div class="option-info">
          <div class="option-name">${option.name}</div>
          ${option.description ? `<div class="option-description">${option.description}</div>` : ''}
        </div>
        <div class="option-price ${priceClass}">${priceText}</div>
      </div>
    </div>
  `;
}

function toggleOption(groupId, optionId, groupType, maxSelections) {
  if (!currentSelections[groupId]) {
    currentSelections[groupId] = [];
  }

  if (groupType === 'single') {
    // Single selection: replace current selection
    currentSelections[groupId] = [optionId];
  } else {
    // Multi selection: toggle
    const currentIndex = currentSelections[groupId].indexOf(optionId);
    if (currentIndex > -1) {
      currentSelections[groupId].splice(currentIndex, 1);
    } else {
      if (currentSelections[groupId].length < maxSelections) {
        currentSelections[groupId].push(optionId);
      } else {
        return; // Max reached, don't add
      }
    }
  }

  // Re-render to update UI
  renderOptionsModal(currentOptionsItem);
}

function updateOptionsTotal() {
  let extraCost = 0;
  
  Object.keys(currentSelections).forEach(groupId => {
    const group = currentOptionsItem.optionGroups.find(g => g.id === groupId);
    if (group) {
      currentSelections[groupId].forEach(optionId => {
        const option = group.options.find(o => o.id === optionId);
        if (option && option.priceDelta) {
          extraCost += option.priceDelta;
        }
      });
    }
  });

  const total = currentOptionsItem.price + extraCost;
  document.getElementById('optionsTotalPrice').textContent = `$${total.toFixed(2)}`;
}

function validateOptionsSelection() {
  let isValid = true;

  if (!currentOptionsItem.optionGroups) {
    document.getElementById('confirmOptionsBtn').disabled = false;
    return;
  }

  currentOptionsItem.optionGroups.forEach(group => {
    const selected = currentSelections[group.id] || [];
    const min = group.min || 0;
    const max = group.max || selected.length;

    if (selected.length < min || selected.length > max) {
      isValid = false;
    }
  });

  document.getElementById('confirmOptionsBtn').disabled = !isValid;
}

function confirmOptions() {
  if (!currentOptionsItem) return;

  const chosenOptions = [];
  let extraCost = 0;

  Object.keys(currentSelections).forEach(groupId => {
    const group = currentOptionsItem.optionGroups.find(g => g.id === groupId);
    if (group) {
      currentSelections[groupId].forEach(optionId => {
        const option = group.options.find(o => o.id === optionId);
        if (option) {
          chosenOptions.push({
            groupId: groupId,
            groupName: group.name,
            id: option.id,
            name: option.name,
            description: option.description,
            priceDelta: option.priceDelta || 0
          });
          if (option.priceDelta) {
            extraCost += option.priceDelta;
          }
        }
      });
    }
  });

  const lineItem = {
    id: generateLineId(currentOptionsItem.id, chosenOptions),
    title: currentOptionsItem.title,
    basePrice: currentOptionsItem.price,
    options: chosenOptions,
    unitPrice: +(currentOptionsItem.price + extraCost).toFixed(2),
    quantity: 1
  };

  if (isEditingCartItem && editingCartItemIndex >= 0) {
    // Update existing cart item
    cart[editingCartItemIndex] = { ...lineItem, quantity: cart[editingCartItemIndex].quantity };
    announceToScreenReader(`Updated ${lineItem.title} in cart`);
  } else {
    // Add new item to cart
    const existingItemIndex = cart.findIndex(item => item.id === lineItem.id);
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
      announceToScreenReader(`Added another ${lineItem.title} to cart. Total: ${cart[existingItemIndex].quantity}`);
    } else {
      cart.push(lineItem);
      announceToScreenReader(`Added ${lineItem.title} to cart`);
    }
  }

  updateCartDisplay();
  showCartSummary();
  closeOptionsModal();
}

function generateLineId(itemId, options) {
  const optionIds = options.map(o => `${o.groupId}:${o.id}`).sort().join('|');
  return `${itemId}${optionIds ? '|' + optionIds : ''}`;
}

// Edit existing cart item
function editCartItem(cartItemIndex) {
  if (cartItemIndex < 0 || cartItemIndex >= cart.length) return;
  
  const cartItem = cart[cartItemIndex];
  
  // Find the original menu item
  let menuItem = null;
  if (menuData && menuData.categories) {
    menuData.categories.forEach(category => {
      const foundItem = category.items.find(item => item.title === cartItem.title);
      if (foundItem) {
        menuItem = foundItem;
      }
    });
  }
  
  if (!menuItem) {
    console.error('Original menu item not found for editing:', cartItem.title);
    return;
  }
  
  openOptionsModal(menuItem, true, cartItemIndex);
}

// Modify existing addToCart function to handle options
function addToCartWithOptions(itemId, title, price) {
  // Find the menu item
  let menuItem = null;
  if (menuData && menuData.categories) {
    menuData.categories.forEach(category => {
      const foundItem = category.items.find(item => item.id === itemId);
      if (foundItem) {
        menuItem = foundItem;
      }
    });
  }

  if (!menuItem) {
    console.error('Menu item not found:', itemId);
    return;
  }

  // Check if item has options
  if (!menuItem.optionGroups || menuItem.optionGroups.length === 0) {
    // No options, add directly to cart as before
    addToCart(itemId, title, price);
    return;
  }

  // Has options, open modal
  openOptionsModal(menuItem);
}

// Send order to WhatsApp with updated format
function sendOrderToWhatsApp() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let message = `Hello! I would like to place an order from ${menuData.restaurant.name}:\n\nOrder:\n`;

  let total = 0;
  cart.forEach((item) => {
    const itemTotal = (item.unitPrice || item.price) * item.quantity;
    total += itemTotal;
    
    message += `- ${item.title} × ${item.quantity} ($${itemTotal.toFixed(2)})\n`;
    
    // Add options if they exist
    if (item.options && item.options.length > 0) {
      const optionsByGroup = {};
      item.options.forEach(option => {
        if (!optionsByGroup[option.groupName]) {
          optionsByGroup[option.groupName] = [];
        }
        optionsByGroup[option.groupName].push(option);
      });
      
      Object.keys(optionsByGroup).forEach(groupName => {
        const groupOptions = optionsByGroup[groupName];
        const optionNames = groupOptions.map(opt => {
          let optionText = opt.name;
          if (opt.priceDelta > 0) {
            optionText += ` (+$${opt.priceDelta.toFixed(2)})`;
          }
          return optionText;
        }).join(', ');
        message += `  • ${groupName}: ${optionNames}\n`;
      });
    }
  });

  message += `\nTotal: $${total.toFixed(2)}\n\nThank you!`;

  const phoneNumber = menuData.restaurant.phone;
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, "_blank");
}
