# Digital Menu Template

A ready-to-use, mobile-first digital menu for restaurants, food trucks, bakeries — anything with a menu and a WhatsApp number.

Drop in your data, swap the images, and you're live.

<!-- TODO: Add screenshots/demo GIF here -->

## What you get

- **Data-driven menu** — everything loads from a single `data.json` file
- **Cart + checkout** — add items, customize with options, pick a payment method, send the order via WhatsApp
- **Option groups** — extras, sauces, sizes, toppings — with per-item limits and required selections
- **Item variants** — same item, different sizes/prices (e.g. Small/Medium/Large)
- **Configurable currency** — USD, EUR, BRL, whatever — set the symbol and formatting in your config
- **Responsive** — works on phones, tablets, and desktops out of the box

## Quick start

```bash
# clone it
git clone https://github.com/caresdev/restaurant-menu.git
cd restaurant-menu

# open it
# use Live Server in VS Code, or:
python3 -m http.server 8000
```

Then open `http://localhost:8000` and you should see the sample menu.

## Make it yours

Everything lives in `data.json`. Here's the structure:

### Restaurant info

```json
{
  "restaurant": {
    "name": "Your Place",
    "tagline": "Digital Menu",
    "slogan": "Your catchy headline",
    "description": "A short description of what you serve",
    "ctaText": "Order Now",
    "currency": { "symbol": "$", "decimal": ".", "thousands": "," },
    "contact": {
      "phone": "15551234567",
      "email": "hello@yourplace.com",
      "address": "123 Main St",
      "city": "Springfield",
      "state": "IL",
      "zip": "62701",
      "country": "USA"
    },
    "hours": {
      "monday": "9:00 AM - 9:00 PM",
      "tuesday": "9:00 AM - 9:00 PM"
    },
    "social": [
      { "platform": "whatsapp", "url": "https://wa.me/15551234567", "icon": "fab fa-whatsapp", "label": "WhatsApp" },
      { "platform": "instagram", "url": "https://instagram.com/you", "icon": "fab fa-instagram", "label": "Instagram" }
    ]
  }
}
```

### Adding items

```json
{
  "id": "margherita",
  "title": "Margherita Pizza",
  "description": "Fresh mozzarella, tomato sauce, basil",
  "price": 12.99,
  "image": "images/menu-items/pizzas.jpg",
  "available": true,
  "optionGroupIds": ["pizza-size", "pizza-extras"]
}
```

> Set `"available": false` to hide an item without deleting it.

### Option groups

Define them at the category level, then reference by ID in each item:

```json
{
  "id": "pizza-size",
  "name": "Choose Size",
  "perItemMax": 1,
  "minSelect": 1,
  "options": [
    { "id": "small", "name": "Small (10\")", "priceDelta": 0 },
    { "id": "large", "name": "Large (14\")", "priceDelta": 5.00 }
  ]
}
```

### Variants

For items with size/type options that change the base price:

```json
{
  "id": "burger-combo",
  "title": "Burger Combo",
  "price": 13.99,
  "variants": [
    { "id": "classic", "label": "Classic", "price": 13.99 },
    { "id": "veggie", "label": "Veggie", "price": 15.49 }
  ]
}
```

### Images

Put your item photos in `images/menu-items/`. One image per category works fine, or use individual images per item. JPG, PNG, and WebP are all supported.

### Environment config (optional)

If you want to keep sensitive info out of `data.json`, create a `.env` file (see `.env.example`) and run:

```bash
npm install
npm run build
```

This injects your restaurant name, contact info, and currency settings into `data.json` at build time.

## Project structure

```
├── index.html
├── css/index.css
├── js/
│   ├── index.js           # all the app logic
│   └── make-config.js     # optional build script for .env config
├── data.json              # your menu data
├── images/
│   ├── header-bg.png      # hero background
│   ├── header-img.png     # hero food image
│   ├── logo.png           # your logo
│   └── menu-items/        # item photos
├── .env.example
└── package.json
```

## Built with

HTML, CSS, vanilla JS, [Bootstrap 5.3](https://getbootstrap.com/), [Font Awesome 5](https://fontawesome.com/), [Google Fonts](https://fonts.google.com/) (Poppins, Bebas Neue, Roboto Condensed)

## Deploy

This is a static site. Drop it on [Netlify](https://netlify.com), [GitHub Pages](https://pages.github.com), [Vercel](https://vercel.com), or any web server.

## License

MIT — use it however you want.
