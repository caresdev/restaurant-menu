// Global variables
let menuData = null;
let cart = [];

// DOM elements
let restaurantNameEl,
  restaurantTaglineEl,
  restaurantSloganEl,
  restaurantDescriptionEl;
let categoryFiltersEl, menuContainerEl, cartSummaryEl, cartItemsEl, cartTotalEl;
let sendWhatsAppBtn, toggleCartBtn;
let cartItemCountExpandedEl, cartToggleIconEl, cartAnnouncementsEl;
let floatingCartBtn, floatingCartBadge, cartOverlayEl;
let restaurantAddressEl,
  restaurantEmailEl,
  restaurantPhoneEl,
  restaurantNameFooterEl,
  restaurantHoursEl,
  currentYearEl;
let checkoutModalEl;

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
  toggleCartBtn = document.getElementById("toggleCart");
  cartItemCountExpandedEl = document.getElementById("cartItemCountExpanded");
  cartToggleIconEl = document.getElementById("cartToggleIcon");
  cartAnnouncementsEl = document.getElementById("cartAnnouncements");
  floatingCartBtn = document.getElementById("floatingCartBtn");
  floatingCartBadge = document.getElementById("floatingCartBadge");
  cartOverlayEl = document.getElementById("cartOverlay");
  restaurantAddressEl = document.getElementById("restaurantAddress");
  restaurantEmailEl = document.getElementById("restaurantEmail");
  restaurantPhoneEl = document.getElementById("restaurantPhone");
  restaurantNameFooterEl = document.getElementById("restaurantNameFooter");
  restaurantHoursEl = document.getElementById("restaurantHours");
  currentYearEl = document.getElementById("currentYear");
  checkoutModalEl = document.getElementById("checkoutModal");

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
    toggleCartBtn,
    cartItemCountExpandedEl,
    cartToggleIconEl,
    cartAnnouncementsEl,
    restaurantAddressEl,
    restaurantEmailEl,
    restaurantPhoneEl,
    restaurantNameFooterEl,
    restaurantHoursEl,
    currentYearEl,
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
    updateCopyright();
    renderMenu();
    renderCategoryNav();
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
  if (restaurantAddressEl) {
    const contact = restaurant.contact || {};
    const street = contact.address || "";
    const cityState = [contact.city, contact.state].filter(Boolean).join(" - ");
    const secondLine = contact.country
      ? [cityState, contact.country].filter(Boolean).join(", ")
      : cityState;
    restaurantAddressEl.innerHTML = street
      ? `${street}<br>${secondLine}`
      : secondLine || "Company Address";
  }
  if (restaurantEmailEl) {
    restaurantEmailEl.textContent =
      restaurant.contact?.email || "company@example.com";
    restaurantEmailEl.href = `mailto:${
      restaurant.contact?.email || "company@example.com"
    }`;
  }
  if (restaurantPhoneEl) {
    const rawPhone = restaurant.contact?.phone || "";
    // Strip country code (55) for display, format as (DD)XXXXX-XXXX
    const digits = rawPhone.replace(/\D/g, "");
    const local = digits.startsWith("55") ? digits.slice(2) : digits;
    const displayPhone =
      local.length === 11
        ? `(${local.slice(0, 2)})${local.slice(2, 7)}-${local.slice(7)}`
        : local.length === 10
          ? `(${local.slice(0, 2)})${local.slice(2, 6)}-${local.slice(6)}`
          : rawPhone;
    restaurantPhoneEl.textContent = displayPhone;
    restaurantPhoneEl.href = `tel:+${digits}`;
  }

  // Update Google Maps embed URL with full address
  const contact = restaurant.contact || {};
  const mapAddress = [
    contact.address,
    contact.city,
    contact.state,
    contact.zip,
    contact.country,
  ]
    .filter(Boolean)
    .join(", ");
  updateGoogleMapsEmbed(mapAddress);

  // Update hours display
  updateHoursDisplay(restaurant.hours);

  // Update social links
  updateSocialLinks(restaurant.social);

  console.log("Restaurant info updated");
}

// Update Google Maps embed URL based on address
function updateGoogleMapsEmbed(address) {
  const googleMapEl = document.getElementById("googleMap");
  if (!googleMapEl) return;

  if (!address) return;
  const targetAddress = address;

  // Create Google Maps embed URL
  const encodedAddress = encodeURIComponent(targetAddress);
  const fallbackUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  googleMapEl.src = fallbackUrl;
  console.log("Google Maps updated for address:", targetAddress);
}

// Update copyright year
function updateCopyright() {
  if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();
}

// Update hours display
function updateHoursDisplay(hours) {
  if (!restaurantHoursEl || !hours) return;

  const daysOrder = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const dayNames = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  };

  // Group consecutive days with same hours
  const groupedHours = [];
  let currentGroup = null;

  daysOrder.forEach((day) => {
    const currentHours = hours[day];

    if (!currentGroup || currentGroup.hours !== currentHours) {
      // Start a new group
      if (currentGroup) {
        groupedHours.push(currentGroup);
      }
      currentGroup = {
        startDay: day,
        endDay: day,
        hours: currentHours,
        days: [day],
      };
    } else {
      // Extend current group
      currentGroup.endDay = day;
      currentGroup.days.push(day);
    }
  });

  // Add the last group
  if (currentGroup) {
    groupedHours.push(currentGroup);
  }

  // Format display
  const hoursHtml = groupedHours
    .map((group) => {
      let dayRange;
      if (group.days.length === 1) {
        dayRange = dayNames[group.startDay];
      } else if (group.days.length === 2) {
        dayRange = `${dayNames[group.startDay]} - ${dayNames[group.endDay]}`;
      } else {
        dayRange = `${dayNames[group.startDay]} - ${dayNames[group.endDay]}`;
      }

      return `<div class="hours-row mb-1">${dayRange}: ${group.hours}</div>`;
    })
    .join("");

  restaurantHoursEl.innerHTML = hoursHtml;
}

// Update social links
function updateSocialLinks(socialLinks) {
  const socialLinksEl = document.getElementById("socialLinks");
  if (!socialLinksEl || !socialLinks || socialLinks.length === 0) return;

  socialLinksEl.innerHTML = socialLinks
    .map(
      (link) =>
        `<a href="${link.url}" class="btn btn-outline-light btn-floating m-1" title="${link.label}" target="_blank" rel="noopener noreferrer">
          <i class="${link.icon}"></i>
        </a>`,
    )
    .join("");
}

// Render menu — always shows all categories with section IDs
function renderMenu() {
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

  // Remove loading fallback
  const loadingFallback = document.getElementById("loadingFallback");
  if (loadingFallback) {
    loadingFallback.remove();
  }

  menuContainerEl.innerHTML = "";

  menuData.categories.forEach((category) => {
    if (!category.items) return;

    const availableItems = category.items.filter((item) => item.available);
    if (availableItems.length === 0) return;

    // Create category section with ID for anchor navigation
    const section = document.createElement("section");
    section.className = "container menu-category";
    section.id = category.id;

    // Category title
    const title = document.createElement("h2");
    title.className = "category-name text-uppercase";
    title.textContent = category.name;
    section.appendChild(title);

    // Items container
    const itemsContainer = document.createElement("div");
    itemsContainer.className =
      "section-items row row-cols-1 mb-5";

    // Render items
    availableItems.forEach((item) => {
      const article = document.createElement("article");
      article.className = "menu-item col-xl-6";

      // Price display: range for variant items, single price for regular
      let priceDisplay;
      if (item.variants && item.variants.length > 0) {
        const lowestPrice = Math.min(...item.variants.map((v) => v.price));
        const highestPrice = Math.max(...item.variants.map((v) => v.price));
        priceDisplay = `${formatBRL(lowestPrice)} - ${formatBRL(highestPrice)}`;
      } else {
        priceDisplay = formatBRL(item.price || 0);
      }

      article.innerHTML = `
        <div class="row justify-content-md-around">
            <div class="col-md-6 col-lg-5 text-center">
              <img src="${item.image || "images/menu-item.png"}" alt="${
                item.title
              }" class="menu-img"/>
            </div>
            <div class="col-md-6 col-lg-7 item-info mt-3 px-4">
              <div class="row justify-content-between">
                <h4 class="col-8 item-title text-uppercase">${item.title}</h4>
                <h4 class="col-4 item-price">${priceDisplay}</h4>
              </div>
              <p class="item-description">${
                item.description || "No description available"
              }</p>

              <div class="text-end mt-3">
                <button class="btn btn-success rounded-pill add-to-cart"
                  data-item-id="${item.id}">
                  <i class="fas fa-plus me-1"></i>Add
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

// Render category navigation bar with scroll-to-section links
function renderCategoryNav() {
  if (!categoryFiltersEl) return;

  const nav = categoryFiltersEl.querySelector("nav");
  if (!nav) return;

  nav.innerHTML = "";

  if (!menuData || !menuData.categories) return;

  // Calculate scroll offset (navbar + nav bar heights)
  const scrollOffset = 130;

  menuData.categories.forEach((category, index) => {
    const link = document.createElement("a");
    link.className = `btn filter-btn rounded-pill${index === 0 ? " active" : ""}`;
    link.textContent = category.name;
    link.href = `#${category.id}`;
    link.dataset.category = category.id;

    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById(category.id);
      if (target) {
        const y =
          target.getBoundingClientRect().top + window.scrollY - scrollOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }

      // Update active state
      nav
        .querySelectorAll(".filter-btn")
        .forEach((btn) => btn.classList.remove("active"));
      link.classList.add("active");
    });

    nav.appendChild(link);
  });

  // Setup Intersection Observer to highlight active section on scroll
  setupScrollSpy(scrollOffset);
}

// Intersection Observer for scroll-based active nav highlighting
function setupScrollSpy(offset) {
  const sections = document.querySelectorAll(".menu-category[id]");
  if (sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const nav = categoryFiltersEl.querySelector("nav");
          if (!nav) return;

          nav
            .querySelectorAll(".filter-btn")
            .forEach((btn) => btn.classList.remove("active"));
          const activeLink = nav.querySelector(`[data-category="${id}"]`);
          if (activeLink) {
            activeLink.classList.add("active");
            // Scroll nav to show active button
            activeLink.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
              inline: "center",
            });
          }
        }
      });
    },
    {
      rootMargin: `-${offset}px 0px -60% 0px`,
      threshold: 0,
    },
  );

  sections.forEach((section) => observer.observe(section));
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

  // Add to cart buttons — always open modal
  menuContainerEl.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("add-to-cart") ||
      e.target.parentElement.classList.contains("add-to-cart")
    ) {
      const button = e.target.classList.contains("add-to-cart")
        ? e.target
        : e.target.parentElement;
      addToCartWithOptions(button.dataset.itemId);
    }
  });

  // Floating cart button — opens the drawer
  if (floatingCartBtn)
    floatingCartBtn.addEventListener("click", openCartDrawer);

  // Cart overlay — closes the drawer
  if (cartOverlayEl) cartOverlayEl.addEventListener("click", closeCartDrawer);

  // Cart management
  if (sendWhatsAppBtn)
    sendWhatsAppBtn.addEventListener("click", sendOrderToWhatsApp);
  if (toggleCartBtn) toggleCartBtn.addEventListener("click", closeCartDrawer);

  // Options modal
  const confirmOptionsBtn = document.getElementById("confirmOptionsBtn");
  if (confirmOptionsBtn)
    confirmOptionsBtn.addEventListener("click", confirmOptions);

  // Item quantity controls in modal
  const itemQtyDecrease = document.getElementById("itemQtyDecrease");
  const itemQtyIncrease = document.getElementById("itemQtyIncrease");
  if (itemQtyDecrease)
    itemQtyDecrease.addEventListener("click", () => changeItemQuantity(-1));
  if (itemQtyIncrease)
    itemQtyIncrease.addEventListener("click", () => changeItemQuantity(1));

  // Checkout modal
  const confirmCheckoutBtn = document.getElementById("confirmCheckoutBtn");
  if (confirmCheckoutBtn)
    confirmCheckoutBtn.addEventListener("click", confirmCheckout);

  // Payment method change handler
  document.querySelectorAll('input[name="paymentMethod"]').forEach((radio) => {
    radio.addEventListener("change", handlePaymentMethodChange);
  });

  // Checkout form validation on input
  const checkoutInputs = [
    "checkoutName",
    "checkoutStreet",
    "checkoutNumber",
    "checkoutNeighborhood",
  ];
  checkoutInputs.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", validateCheckoutForm);
  });

  const cardFlagEl = document.getElementById("checkoutCardFlag");
  if (cardFlagEl) cardFlagEl.addEventListener("change", validateCheckoutForm);

  // Keyboard support — Escape closes the drawer or checkout modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (
        checkoutModalEl &&
        checkoutModalEl.style.display !== "none"
      ) {
        closeCheckoutModal();
      } else if (
        cartSummaryEl &&
        !cartSummaryEl.classList.contains("collapsed")
      ) {
        closeCartDrawer();
      }
    }
  });

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
    closeCartDrawer();
  }
}

// Clear cart with confirmation
function confirmClearCart() {
  if (cart.length === 0) return;
  if (!window.confirm("Are you sure you want to clear your cart?")) return;
  cart = [];
  updateCartDisplay();
  closeCartDrawer();
}

// Update cart display
function updateCartDisplay() {
  if (!cartItemsEl) return;

  cartItemsEl.innerHTML = "";

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + calculateLineTotal(item), 0);

  // Update cart counter and total
  if (cartItemCountExpandedEl) cartItemCountExpandedEl.textContent = totalItems;
  if (cartTotalEl) cartTotalEl.textContent = formatBRL(total);

  if (cart.length === 0) {
    cartItemsEl.innerHTML =
      '<p class="text-muted text-center py-4">Your cart is empty</p>';
    hideCartSummary();
    return;
  }

  // Show cart when items are added
  showCartSummary();

  cart.forEach((item, index) => {
    const lineTotal = calculateLineTotal(item);
    const basePrice = item.basePrice || item.price;

    // Build options display
    let optionsHtml = "";
    if (item.options && item.options.length > 0) {
      const optionsByGroup = {};
      item.options.forEach((opt) => {
        if (!optionsByGroup[opt.groupName]) {
          optionsByGroup[opt.groupName] = [];
        }
        optionsByGroup[opt.groupName].push(opt);
      });

      Object.keys(optionsByGroup).forEach((groupName) => {
        const groupOptions = optionsByGroup[groupName];
        const optionNames = groupOptions
          .map((opt) => {
            const displayQty = opt.unitsPerSelection
              ? opt.quantity * opt.unitsPerSelection
              : opt.quantity;
            let text = opt.name;
            if (displayQty > 1) text += ` ×${displayQty}`;
            if (opt.priceDelta > 0)
              text += ` (+${formatBRL(opt.priceDelta * opt.quantity)})`;
            return text;
          })
          .join(", ");
        optionsHtml += `<div class="item-option"><strong>${groupName}:</strong> ${optionNames}</div>`;
      });
    }

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item-expanded p-3 mb-2 bg-white rounded border";
    cartItem.innerHTML = `
      <div class="cart-item-content">
        <div class="item-details">
          <h6 class="item-name mb-1">${item.title}${item.variantLabel ? ` — ${item.variantLabel}` : ""}</h6>
          <span class="item-unit-price text-muted">${formatBRL(basePrice)} each</span>
          ${optionsHtml ? `<div class="item-options mt-1">${optionsHtml}</div>` : ""}
        </div>

        <div class="item-controls">
          <div class="quantity-controls">
            <button class="btn btn-sm btn-outline-secondary qty-decrease" data-item-id="${item.id}" ${item.quantity <= 1 ? "disabled" : ""}>
              <i class="fas fa-minus"></i>
            </button>
            <span class="qty-display">${item.quantity}</span>
            <button class="btn btn-sm btn-outline-secondary qty-increase" data-item-id="${item.id}">
              <i class="fas fa-plus"></i>
            </button>
          </div>

          <div class="item-total-section">
            <span class="item-total">${formatBRL(lineTotal)}</span>
            ${
              (item.options && item.options.length > 0) || item.variantId
                ? `<button class="btn btn-sm btn-outline-primary edit-item me-1" data-item-index="${index}" title="Edit options">
                  <i class="fas fa-edit"></i>
                </button>`
                : ""
            }
            <button class="btn btn-sm btn-outline-danger remove-item" data-item-id="${item.id}" title="Remove item">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    cartItemsEl.appendChild(cartItem);
  });

  // Add clear cart button at the bottom
  const clearRow = document.createElement("div");
  clearRow.className = "text-start mt-2 mb-1";
  clearRow.innerHTML = `
    <button class="btn-clear-cart-inline" data-action="clear-cart">
      <i class="fas fa-trash-alt me-1"></i>Clear cart
    </button>
  `;
  cartItemsEl.appendChild(clearRow);

  // Setup quantity control event listeners
  setupQuantityControls();
}

// Update the floating cart button badge and visibility
function updateFloatingCartButton() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (floatingCartBtn) {
    if (totalItems > 0) {
      floatingCartBtn.style.display = "flex";
      if (floatingCartBadge) floatingCartBadge.textContent = totalItems;

      // Pulse animation on update
      floatingCartBtn.classList.remove("pulse");
      void floatingCartBtn.offsetWidth; // trigger reflow
      floatingCartBtn.classList.add("pulse");
    } else {
      floatingCartBtn.style.display = "none";
    }
  }
}

// Open the cart drawer (expanded)
function openCartDrawer() {
  if (!cartSummaryEl || cart.length === 0) return;

  cartSummaryEl.style.display = "block";
  cartSummaryEl.classList.remove("collapsed");
  if (cartOverlayEl) cartOverlayEl.classList.add("active");
  updateToggleIcon(false);
  document.body.style.overflow = "hidden";

  // Hide floating button while drawer is open
  if (floatingCartBtn) floatingCartBtn.style.display = "none";
}

// Close the cart drawer
function closeCartDrawer() {
  if (!cartSummaryEl) return;

  cartSummaryEl.classList.add("collapsed");
  cartSummaryEl.style.display = "none";
  if (cartOverlayEl) cartOverlayEl.classList.remove("active");
  updateToggleIcon(true);
  document.body.style.overflow = "auto";

  // Restore floating button
  updateFloatingCartButton();
}

// Legacy aliases used by updateCartDisplay / confirmOptions
function showCartSummary() {
  updateFloatingCartButton();
}

function hideCartSummary() {
  closeCartDrawer();
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
    } else if (
      button.classList.contains("edit-item") &&
      itemIndex !== undefined
    ) {
      editCartItem(parseInt(itemIndex));
    } else if (button.dataset.action === "clear-cart") {
      confirmClearCart();
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
      `Updated ${item.title} quantity from ${oldQuantity} to ${item.quantity}`,
    );
  }
}

// Format price using restaurant currency settings (defaults to USD)
function formatCurrency(value) {
  const symbol = (menuData && menuData.restaurant && menuData.restaurant.currency && menuData.restaurant.currency.symbol) || "$";
  const decimal = (menuData && menuData.restaurant && menuData.restaurant.currency && menuData.restaurant.currency.decimal) || ".";
  const thousands = (menuData && menuData.restaurant && menuData.restaurant.currency && menuData.restaurant.currency.thousands) || ",";
  const fixed = value.toFixed(2);
  const [intPart, decPart] = fixed.split(".");
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
  return `${symbol}${formattedInt}${decimal}${decPart}`;
}

// Keep backward-compatible alias
const formatBRL = formatCurrency;

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

// ==========================================
// Options Modal Variables
// ==========================================
let currentOptionsItem = null;
let currentOptionGroups = null; // Category-level option groups
let currentSelections = {}; // { groupId: { optionId: quantity, ... } }
let currentItemQuantity = 1;
let currentSelectedVariant = null; // For combo variant items
let isEditingCartItem = false;
let editingCartItemIndex = -1;

// Get effective perItemMax and minSelect for a group, applying variant overrides
function getEffectiveGroupRules(group) {
  let perItemMax = group.perItemMax;
  let minSelect = group.minSelect || 0;
  let unitsPerSelection = group.unitsPerSelection || 0;

  if (currentSelectedVariant && currentSelectedVariant.optionOverrides) {
    const override = currentSelectedVariant.optionOverrides[group.id];
    if (override) {
      if (override.perItemMax !== undefined) perItemMax = override.perItemMax;
      if (override.minSelect !== undefined) minSelect = override.minSelect;
      if (override.unitsPerSelection !== undefined) unitsPerSelection = override.unitsPerSelection;
    }
  }
  return { perItemMax, minSelect, unitsPerSelection };
}

// Validate all required groups meet their minSelect
function validateAllGroups() {
  if (!currentOptionGroups) return true;
  return currentOptionGroups.every((group) => {
    const { minSelect } = getEffectiveGroupRules(group);
    const effectiveMin = minSelect * currentItemQuantity;
    if (effectiveMin <= 0) return true;
    const groupTotal = getGroupTotal(group.id);
    return groupTotal >= effectiveMin;
  });
}

// Find menu item and its category-level optionGroups
function findMenuItemWithOptions(itemId) {
  let menuItem = null;
  let categoryOptionGroups = null;

  if (menuData && menuData.categories) {
    menuData.categories.forEach((category) => {
      const found = category.items.find((item) => item.id === itemId);
      if (found) {
        menuItem = found;
        categoryOptionGroups = category.optionGroups || null;
      }
    });
  }

  return { menuItem, categoryOptionGroups };
}

// All items open the modal (with or without options)
function addToCartWithOptions(itemId) {
  const { menuItem, categoryOptionGroups } = findMenuItemWithOptions(itemId);

  if (!menuItem) {
    console.error("Menu item not found:", itemId);
    return;
  }

  openOptionsModal(menuItem, categoryOptionGroups);
}

// Open options modal
function openOptionsModal(
  item,
  optionGroups = null,
  isEdit = false,
  cartItemIndex = -1,
) {
  currentOptionsItem = item;
  // Filter option groups by item's optionGroupIds if specified
  if (optionGroups && item.optionGroupIds) {
    currentOptionGroups = optionGroups.filter((g) =>
      item.optionGroupIds.includes(g.id),
    );
  } else {
    currentOptionGroups = optionGroups;
  }
  currentItemQuantity = 1;
  currentSelectedVariant = null;
  isEditingCartItem = isEdit;
  editingCartItemIndex = cartItemIndex;
  currentSelections = {};

  // Set default variant if item has variants
  if (item.variants && item.variants.length > 0) {
    currentSelectedVariant = item.variants[0];
    currentItemQuantity = 1; // Variants don't use item qty
  }

  // If editing, pre-populate selections, quantity, and variant
  if (isEdit && cartItemIndex >= 0) {
    const cartItem = cart[cartItemIndex];
    currentItemQuantity = cartItem.quantity || 1;
    if (cartItem.variantId && item.variants) {
      currentSelectedVariant =
        item.variants.find((v) => v.id === cartItem.variantId) ||
        item.variants[0];
    }
    if (cartItem.options) {
      cartItem.options.forEach((opt) => {
        if (!currentSelections[opt.groupId]) {
          currentSelections[opt.groupId] = {};
        }
        currentSelections[opt.groupId][opt.id] = opt.quantity || 1;
      });
    }
  }

  renderOptionsModal();
  document.getElementById("optionsModal").style.display = "flex";
  document.body.style.overflow = "hidden";
}

// Close options modal
function closeOptionsModal() {
  document.getElementById("optionsModal").style.display = "none";
  document.body.style.overflow = "auto";
  currentOptionsItem = null;
  currentOptionGroups = null;
  currentSelections = {};
  currentItemQuantity = 1;
  currentSelectedVariant = null;
  isEditingCartItem = false;
  editingCartItemIndex = -1;
}

// Render options modal content
function renderOptionsModal() {
  const item = currentOptionsItem;
  if (!item) return;

  const activePrice = currentSelectedVariant
    ? currentSelectedVariant.price
    : item.price;

  document.getElementById("optionsItemTitle").textContent = item.title;
  document.getElementById("optionsBasePrice").textContent =
    formatBRL(activePrice);

  // Update item quantity display
  document.getElementById("itemQtyDisplay").textContent = currentItemQuantity;

  // Hide item quantity controls for variant items (variant = size, not quantity)
  const itemQtyControls = document.querySelector(".item-qty-controls");
  if (itemQtyControls) {
    itemQtyControls.style.display = item.variants ? "none" : "flex";
  }

  const container = document.getElementById("optionGroupsContainer");
  container.innerHTML = "";

  // Render variant selector if item has variants
  if (item.variants && item.variants.length > 0) {
    const variantDiv = document.createElement("div");
    variantDiv.className = "variant-selector";
    item.variants.forEach((variant) => {
      const isSelected =
        currentSelectedVariant && currentSelectedVariant.id === variant.id;
      variantDiv.innerHTML += `
        <div class="variant-option${isSelected ? " selected" : ""}"
             onclick="selectVariant('${variant.id}')">
          <div class="variant-label">${variant.label}</div>
          <div class="variant-price">${formatBRL(variant.price)}</div>
        </div>
      `;
    });
    container.appendChild(variantDiv);
  }

  if (currentOptionGroups && currentOptionGroups.length > 0) {
    currentOptionGroups.forEach((group) => {
      const { perItemMax, minSelect } = getEffectiveGroupRules(group);
      const effectiveMax = perItemMax * currentItemQuantity;
      const effectiveMin = minSelect * currentItemQuantity;
      const groupTotal = getGroupTotal(group.id);
      const isInvalid = effectiveMin > 0 && groupTotal < effectiveMin;
      const isRequired = minSelect > 0;

      const groupDiv = document.createElement("div");
      groupDiv.className = `option-group${isInvalid ? " invalid" : ""}`;

      let validationMsg = "";
      if (isRequired && groupTotal < effectiveMin) {
        validationMsg = `<div class="validation-msg">Select at least ${effectiveMin}</div>`;
      }

      groupDiv.innerHTML = `
        <div class="option-group-header">
          <div>
            <h6 class="option-group-title${isRequired ? " required" : ""}">${group.name}</h6>
            ${validationMsg}
          </div>
          <span class="option-group-counter">${groupTotal}/${effectiveMax}</span>
        </div>
        <div class="option-group-body" data-group-id="${group.id}">
          ${group.options.map((option) => renderOptionItem(group, option)).join("")}
        </div>
      `;

      container.appendChild(groupDiv);
    });
  }

  updateOptionsTotal();
}

// Get total selected quantity for a group
function getGroupTotal(groupId) {
  const groupSelections = currentSelections[groupId] || {};
  return Object.values(groupSelections).reduce((sum, qty) => sum + qty, 0);
}

// Render a single option item with +/- qty controls
function renderOptionItem(group, option) {
  const qty =
    (currentSelections[group.id] && currentSelections[group.id][option.id]) ||
    0;
  const { perItemMax, unitsPerSelection } = getEffectiveGroupRules(group);
  const effectiveMax = perItemMax * currentItemQuantity;
  const groupTotal = getGroupTotal(group.id);
  const canIncrease = groupTotal < effectiveMax;

  const priceText =
    option.priceDelta > 0 ? `+ ${formatBRL(option.priceDelta)}` : "";

  const displayQty = unitsPerSelection > 0 ? `${qty * unitsPerSelection} un.` : `${qty}`;

  // Show full controls when qty > 0, otherwise just the + button
  const qtyControls =
    qty > 0
      ? `<div class="option-qty-controls">
        <button class="qty-btn minus" onclick="changeOptionQty('${group.id}','${option.id}',-1)">
          <i class="fas fa-minus"></i>
        </button>
        <span class="option-qty">${displayQty}</span>
        <button class="qty-btn plus" onclick="changeOptionQty('${group.id}','${option.id}',1)" ${!canIncrease ? "disabled" : ""}>
          <i class="fas fa-plus"></i>
        </button>
      </div>`
      : `<div class="option-qty-controls">
        <button class="qty-btn plus" onclick="changeOptionQty('${group.id}','${option.id}',1)" ${!canIncrease ? "disabled" : ""}>
          <i class="fas fa-plus"></i>
        </button>
      </div>`;

  return `
    <div class="option-item${qty > 0 ? " selected" : ""}">
      <div class="option-info">
        <div class="option-name">${option.name}</div>
        ${option.description ? `<div class="option-description">${option.description}</div>` : ""}
        ${priceText ? `<div class="option-price">${priceText}</div>` : ""}
      </div>
      ${qtyControls}
    </div>
  `;
}

// Change option quantity (+/- delta)
function changeOptionQty(groupId, optionId, delta) {
  if (!currentSelections[groupId]) {
    currentSelections[groupId] = {};
  }

  const currentQty = currentSelections[groupId][optionId] || 0;
  const newQty = currentQty + delta;

  // Clamp to 0 minimum
  if (newQty < 0) return;

  // Check group max
  if (delta > 0) {
    const group = currentOptionGroups.find((g) => g.id === groupId);
    if (group) {
      const { perItemMax } = getEffectiveGroupRules(group);
      const effectiveMax = perItemMax * currentItemQuantity;
      const groupTotal = getGroupTotal(groupId);
      if (groupTotal + delta > effectiveMax) return;
    }
  }

  if (newQty === 0) {
    delete currentSelections[groupId][optionId];
    if (Object.keys(currentSelections[groupId]).length === 0) {
      delete currentSelections[groupId];
    }
  } else {
    currentSelections[groupId][optionId] = newQty;
  }

  renderOptionsModal();
}

// Select a variant (for combo items)
function selectVariant(variantId) {
  if (!currentOptionsItem || !currentOptionsItem.variants) return;
  const variant = currentOptionsItem.variants.find((v) => v.id === variantId);
  if (
    !variant ||
    (currentSelectedVariant && currentSelectedVariant.id === variantId)
  )
    return;

  currentSelectedVariant = variant;

  // Trim option selections that exceed new effective max
  if (currentOptionGroups) {
    currentOptionGroups.forEach((group) => {
      const { perItemMax } = getEffectiveGroupRules(group);
      const effectiveMax = perItemMax * currentItemQuantity;
      const groupSelections = currentSelections[group.id];
      if (!groupSelections) return;

      let groupTotal = Object.values(groupSelections).reduce(
        (s, q) => s + q,
        0,
      );
      if (groupTotal > effectiveMax) {
        const optionIds = Object.keys(groupSelections);
        for (
          let i = optionIds.length - 1;
          i >= 0 && groupTotal > effectiveMax;
          i--
        ) {
          const optId = optionIds[i];
          const reduce = Math.min(
            groupSelections[optId],
            groupTotal - effectiveMax,
          );
          groupSelections[optId] -= reduce;
          groupTotal -= reduce;
          if (groupSelections[optId] <= 0) delete groupSelections[optId];
        }
        if (Object.keys(groupSelections).length === 0)
          delete currentSelections[group.id];
      }
    });
  }

  renderOptionsModal();
}

// Change item quantity in modal
function changeItemQuantity(delta) {
  const newQty = currentItemQuantity + delta;
  if (newQty < 1) return;

  currentItemQuantity = newQty;

  // Trim option selections if they exceed new effective max
  if (currentOptionGroups) {
    currentOptionGroups.forEach((group) => {
      const { perItemMax } = getEffectiveGroupRules(group);
      const effectiveMax = perItemMax * currentItemQuantity;
      const groupSelections = currentSelections[group.id];
      if (!groupSelections) return;

      let groupTotal = Object.values(groupSelections).reduce(
        (s, q) => s + q,
        0,
      );

      // Trim from the end until within limit
      if (groupTotal > effectiveMax) {
        const optionIds = Object.keys(groupSelections);
        for (
          let i = optionIds.length - 1;
          i >= 0 && groupTotal > effectiveMax;
          i--
        ) {
          const optId = optionIds[i];
          const reduce = Math.min(
            groupSelections[optId],
            groupTotal - effectiveMax,
          );
          groupSelections[optId] -= reduce;
          groupTotal -= reduce;
          if (groupSelections[optId] <= 0) {
            delete groupSelections[optId];
          }
        }
        if (Object.keys(groupSelections).length === 0) {
          delete currentSelections[group.id];
        }
      }
    });
  }

  renderOptionsModal();
}

// Calculate options extra cost
function calculateOptionsCost() {
  let cost = 0;
  if (!currentOptionGroups) return cost;

  Object.keys(currentSelections).forEach((groupId) => {
    const group = currentOptionGroups.find((g) => g.id === groupId);
    if (!group) return;
    Object.entries(currentSelections[groupId]).forEach(([optionId, qty]) => {
      const option = group.options.find((o) => o.id === optionId);
      if (option && option.priceDelta) {
        cost += option.priceDelta * qty;
      }
    });
  });

  return cost;
}

// Update total price display in modal
function updateOptionsTotal() {
  if (!currentOptionsItem) return;

  const activePrice = currentSelectedVariant
    ? currentSelectedVariant.price
    : currentOptionsItem.price;
  const optionsCost = calculateOptionsCost();
  const total = activePrice * currentItemQuantity + optionsCost;

  const confirmBtn = document.getElementById("confirmOptionsBtn");
  const totalPriceEl = document.getElementById("optionsTotalPrice");
  const isValid = validateAllGroups();

  confirmBtn.disabled = !isValid;
  totalPriceEl.textContent = formatBRL(total);
}

// Confirm and add to cart
function confirmOptions() {
  if (!currentOptionsItem) return;

  const chosenOptions = [];

  if (currentOptionGroups) {
    Object.keys(currentSelections).forEach((groupId) => {
      const group = currentOptionGroups.find((g) => g.id === groupId);
      if (!group) return;
      const { unitsPerSelection } = getEffectiveGroupRules(group);
      Object.entries(currentSelections[groupId]).forEach(([optionId, qty]) => {
        const option = group.options.find((o) => o.id === optionId);
        if (option) {
          const optionData = {
            groupId: groupId,
            groupName: group.name,
            id: option.id,
            name: option.name,
            priceDelta: option.priceDelta || 0,
            quantity: qty,
          };
          if (unitsPerSelection > 0) {
            optionData.unitsPerSelection = unitsPerSelection;
          }
          chosenOptions.push(optionData);
        }
      });
    });
  }

  const activePrice = currentSelectedVariant
    ? currentSelectedVariant.price
    : currentOptionsItem.price;

  const lineItem = {
    id: generateLineId(
      currentOptionsItem.id,
      chosenOptions,
      currentSelectedVariant?.id,
    ),
    title: currentOptionsItem.title,
    variantId: currentSelectedVariant ? currentSelectedVariant.id : null,
    variantLabel: currentSelectedVariant ? currentSelectedVariant.label : null,
    basePrice: activePrice,
    options: chosenOptions,
    quantity: currentItemQuantity,
  };

  if (isEditingCartItem && editingCartItemIndex >= 0) {
    cart[editingCartItemIndex] = lineItem;
    announceToScreenReader(`Updated ${lineItem.title} in cart`);
  } else {
    const existingIndex = cart.findIndex((item) => item.id === lineItem.id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += currentItemQuantity;
      announceToScreenReader(
        `Added ${currentItemQuantity} more ${lineItem.title} to cart.`,
      );
    } else {
      cart.push(lineItem);
      announceToScreenReader(`Added ${lineItem.title} to cart`);
    }
  }

  updateCartDisplay();
  showCartSummary();
  closeOptionsModal();
}

function generateLineId(itemId, options, variantId = null) {
  const variantPart = variantId ? `@${variantId}` : "";
  const optionKey = options
    .map((o) => `${o.groupId}:${o.id}:${o.quantity}`)
    .sort()
    .join("|");
  return `${itemId}${variantPart}${optionKey ? "|" + optionKey : ""}`;
}

// Edit existing cart item
function editCartItem(cartItemIndex) {
  if (cartItemIndex < 0 || cartItemIndex >= cart.length) return;

  const cartItem = cart[cartItemIndex];

  // Find the original menu item and its category-level optionGroups
  let menuItem = null;
  let categoryOptionGroups = null;

  if (menuData && menuData.categories) {
    menuData.categories.forEach((category) => {
      const foundItem = category.items.find(
        (item) => item.title === cartItem.title,
      );
      if (foundItem) {
        menuItem = foundItem;
        categoryOptionGroups = category.optionGroups || null;
      }
    });
  }

  if (!menuItem) {
    console.error("Original menu item not found for editing:", cartItem.title);
    return;
  }

  openOptionsModal(menuItem, categoryOptionGroups, true, cartItemIndex);
}

// ==========================================
// Cart line total calculation
// ==========================================
function calculateLineTotal(item) {
  const optionsCost = item.options
    ? item.options.reduce(
        (sum, opt) => sum + (opt.priceDelta || 0) * (opt.quantity || 1),
        0,
      )
    : 0;
  return (item.basePrice || item.price) * item.quantity + optionsCost;
}

// Send order to WhatsApp — now opens checkout modal first
function sendOrderToWhatsApp() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  openCheckoutModal();
}

// Build order items message (reused by confirmCheckout)
function buildOrderItemsMessage() {
  let message = `Hi! I'd like to place an order at ${menuData.restaurant.name}:\n\n*Order:*\n`;
  let total = 0;

  cart.forEach((item) => {
    const lineTotal = calculateLineTotal(item);
    total += lineTotal;

    const baseCost = (item.basePrice || item.price) * item.quantity;
    const variantSuffix = item.variantLabel ? ` (${item.variantLabel})` : "";
    message += `\n- *${item.title}${variantSuffix}* × ${item.quantity} (${formatBRL(baseCost)})\n`;

    if (item.options && item.options.length > 0) {
      const optionsByGroup = {};
      item.options.forEach((opt) => {
        if (!optionsByGroup[opt.groupName]) {
          optionsByGroup[opt.groupName] = [];
        }
        optionsByGroup[opt.groupName].push(opt);
      });

      Object.keys(optionsByGroup).forEach((groupName) => {
        const groupOptions = optionsByGroup[groupName];
        const optionNames = groupOptions
          .map((opt) => {
            const displayQty = opt.unitsPerSelection
              ? opt.quantity * opt.unitsPerSelection
              : opt.quantity;
            let text = opt.name;
            if (displayQty > 1) text += ` ×${displayQty}`;
            if (opt.priceDelta > 0)
              text += ` (+${formatBRL(opt.priceDelta * opt.quantity)})`;
            return text;
          })
          .join(", ");
        message += `  • ${groupName}: ${optionNames}\n`;
      });
    }
  });

  return { message, total };
}

// Open checkout modal
function openCheckoutModal() {
  if (!checkoutModalEl) return;

  // Update total display
  const total = cart.reduce((sum, item) => sum + calculateLineTotal(item), 0);
  const checkoutTotalEl = document.getElementById("checkoutTotal");
  if (checkoutTotalEl) checkoutTotalEl.textContent = formatBRL(total);

  checkoutModalEl.style.display = "flex";
  document.body.style.overflow = "hidden";
  validateCheckoutForm();
}

// Close checkout modal
function closeCheckoutModal() {
  if (!checkoutModalEl) return;
  checkoutModalEl.style.display = "none";
  document.body.style.overflow = "auto";
}

// Handle payment method change — show/hide conditional fields
function handlePaymentMethodChange() {
  const selected = document.querySelector(
    'input[name="paymentMethod"]:checked'
  );
  const cardFlagSection = document.getElementById("cardFlagSection");
  const changeSection = document.getElementById("changeSection");

  if (!selected) {
    if (cardFlagSection) cardFlagSection.style.display = "none";
    if (changeSection) changeSection.style.display = "none";
    validateCheckoutForm();
    return;
  }

  const isCard =
    selected.value === "credit" || selected.value === "debit";
  const isCash = selected.value === "cash";

  if (cardFlagSection)
    cardFlagSection.style.display = isCard ? "block" : "none";
  if (changeSection)
    changeSection.style.display = isCash ? "block" : "none";

  // Reset hidden fields
  if (!isCard) {
    const flagEl = document.getElementById("checkoutCardFlag");
    if (flagEl) flagEl.value = "";
  }
  if (!isCash) {
    const changeEl = document.getElementById("checkoutChange");
    if (changeEl) changeEl.value = "";
  }

  validateCheckoutForm();
}

// Validate checkout form
function validateCheckoutForm() {
  const name = document.getElementById("checkoutName");
  const street = document.getElementById("checkoutStreet");
  const number = document.getElementById("checkoutNumber");
  const neighborhood = document.getElementById("checkoutNeighborhood");
  const paymentSelected = document.querySelector(
    'input[name="paymentMethod"]:checked'
  );
  const cardFlag = document.getElementById("checkoutCardFlag");
  const confirmBtn = document.getElementById("confirmCheckoutBtn");

  const requiredInputs = [name, street, number, neighborhood];
  let isValid = requiredInputs.every(
    (el) => el && el.value.trim() !== ""
  );

  // Payment must be selected
  if (!paymentSelected) isValid = false;

  // Card flag required if card is selected
  if (
    paymentSelected &&
    (paymentSelected.value === "credit" ||
      paymentSelected.value === "debit")
  ) {
    if (!cardFlag || cardFlag.value === "") isValid = false;
  }

  // Update invalid classes on required inputs
  requiredInputs.forEach((el) => {
    if (!el) return;
    if (el.value.trim() === "" && el.dataset.touched === "true") {
      el.classList.add("invalid");
    } else {
      el.classList.remove("invalid");
    }
  });

  if (confirmBtn) confirmBtn.disabled = !isValid;
  return isValid;
}

// Mark inputs as touched on blur for validation styling
document.addEventListener("focusout", (e) => {
  if (e.target && e.target.closest(".checkout-body")) {
    e.target.dataset.touched = "true";
    validateCheckoutForm();
  }
});

// Confirm checkout and send to WhatsApp
function confirmCheckout() {
  if (!validateCheckoutForm()) return;

  const name = document.getElementById("checkoutName").value.trim();
  const street = document.getElementById("checkoutStreet").value.trim();
  const number = document.getElementById("checkoutNumber").value.trim();
  const neighborhood =
    document.getElementById("checkoutNeighborhood").value.trim();
  const reference =
    document.getElementById("checkoutReference").value.trim();
  const paymentSelected = document.querySelector(
    'input[name="paymentMethod"]:checked'
  );
  const cardFlag = document.getElementById("checkoutCardFlag").value;
  const change = document.getElementById("checkoutChange").value.trim();

  // Build order items
  const { message: orderMessage, total } = buildOrderItemsMessage();

  // Build payment label
  let paymentLabel = "";
  switch (paymentSelected.value) {
    case "credit":
      paymentLabel = `Credit Card (${cardFlag})`;
      break;
    case "debit":
      paymentLabel = `Debit Card (${cardFlag})`;
      break;
    case "cash":
      paymentLabel = "Cash";
      if (change) paymentLabel += ` (Change for ${change})`;
      break;
  }

  // Build address line
  let addressLine = `${street}, ${number} - ${neighborhood}`;
  if (reference) addressLine += `\nDelivery note: ${reference}`;

  // Compose full message
  let fullMessage = orderMessage;
  fullMessage += `\n*Item total: ${formatCurrency(total)}*`;
  fullMessage += `\n_(Delivery fee will be confirmed after address verification)_`;
  fullMessage += `\n\n*Name:* ${name}`;
  fullMessage += `\n*Address:* ${addressLine}`;
  fullMessage += `\n*Payment:* ${paymentLabel}`;
  fullMessage += `\n\nThank you!`;

  const phoneNumber = menuData.restaurant.contact.phone;
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(fullMessage)}`;
  window.open(whatsappUrl, "_blank");

  // Clear cart and reset UI
  cart = [];
  updateCartDisplay();
  closeCheckoutModal();
  closeCartDrawer();
  resetCheckoutForm();
}

// Reset checkout form fields and state
function resetCheckoutForm() {
  const fields = [
    "checkoutName",
    "checkoutStreet",
    "checkoutNumber",
    "checkoutNeighborhood",
    "checkoutReference",
    "checkoutChange",
  ];
  fields.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.value = "";
      el.classList.remove("invalid");
      delete el.dataset.touched;
    }
  });

  const cardFlag = document.getElementById("checkoutCardFlag");
  if (cardFlag) cardFlag.value = "";

  document.querySelectorAll('input[name="paymentMethod"]').forEach((radio) => {
    radio.checked = false;
  });

  const cardFlagSection = document.getElementById("cardFlagSection");
  const changeSection = document.getElementById("changeSection");
  if (cardFlagSection) cardFlagSection.style.display = "none";
  if (changeSection) changeSection.style.display = "none";
}
