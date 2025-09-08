# Dynamic Restaurant Menu Template

A clean, responsive, and dynamic restaurant menu template that preserves the original design while adding powerful interactivity features.

## Features

- **Dynamic Menu Rendering**: Menu items are loaded from `data.json`
- **Category Filtering**: Filter menu items by category with smooth animations
- **Shopping Cart**: Add/remove items with quantity management and cart persistence
- **WhatsApp Integration**: Send orders directly via WhatsApp with formatted messages
- **Responsive Design**: Works perfectly on all device sizes (mobile-first approach)
- **Template-Ready**: Contains only placeholder data, perfect for deployment as a public template

## Files Structure

```
restaurant-menu/
├── index.html          # Main HTML file (minimal skeleton)
├── css/index.css       # All styling (preserves original design)
├── js/index.js         # Dynamic functionality
├── data.json           # Menu data (edit this file to customize)
├── images/
│   ├── menu-item.png   # Placeholder image for all menu items
│   ├── header-bg.png   # Header background
│   ├── header-img.png  # Header product image
│   └── logo.png        # Company logo
└── README.md           # This documentation
```

## How to Customize Your Menu

### 1. Update Restaurant Information

Edit the `restaurant` section in `data.json`:

```json
{
  "restaurant": {
    "name": "Your Restaurant Name",
    "tagline": "Your Tagline",
    "slogan": "Your Captivating Message!",
    "description": "Your description of products/services",
    "phone": "5531999999999",  // WhatsApp phone (international format)
    "contact": {
      "address": "Your Address",
      "email": "your@email.com",
      "phone": "+1 (123) 456-7890"
    }
  }
}
```

### 2. Add New Categories

Add new categories to the `categories` array:

```json
{
  "id": "beverages",           // Unique identifier
  "name": "Beverages",         // Display name
  "items": [...]              // Array of menu items
}
```

### 3. Add New Menu Items

Add items to any category's `items` array:

```json
{
  "id": "item-008",                    // Unique identifier
  "title": "Item Name",               // Display name
  "description": "Item description",   // Full description
  "price": 15.99,                     // Price as number
  "image": "images/menu-item.png",    // Image path (use menu-item.png for template)
  "available": true                   // Whether item is available
}
```

### 4. Manage Item Availability

Set `"available": false` to temporarily hide items without deleting them:

```json
{
  "id": "item-001",
  "title": "Seasonal Item",
  "available": false  // This item won't appear in the menu
}
```

## Example: Adding a New Category

To add a "Beverages" category with 2 drinks:

```json
{
  "id": "beverages",
  "name": "Beverages",
  "items": [
    {
      "id": "drink-001",
      "title": "Fresh Orange Juice",
      "description": "Freshly squeezed orange juice served chilled",
      "price": 5.99,
      "image": "images/menu-item.png",
      "available": true
    },
    {
      "id": "drink-002",
      "title": "Cappuccino",
      "description": "Rich espresso with steamed milk foam",
      "price": 4.99,
      "image": "images/menu-item.png",
      "available": true
    }
  ]
}
```

## Images

- **Template Mode**: Use `images/menu-item.png` for all items (current setup)
- **Custom Images**: Replace with actual food photos, maintain aspect ratio for best results
- **Supported Formats**: JPG, PNG, WebP
- **Recommended Size**: 400x400px minimum

## WhatsApp Integration

1. Update the phone number in `data.json` restaurant section
2. Use international format: country code + number (no spaces, no + symbol)
3. Example: For +1 (555) 123-4567, use: "15551234567"

## Deployment

1. Update `data.json` with your menu data
2. Replace placeholder images with your photos
3. Deploy to any web server (GitHub Pages, Netlify, etc.)
4. The template is ready for production use

## Technologies and Tools

- **Design & Prototype:** Figma, Canva
- **Frontend:** HTML5, CSS3, Vanilla JavaScript, Bootstrap 5.3
- **Icons:** Font Awesome 5.14
- **Fonts:** Google Fonts (Poppins, Bebas Neue, Roboto Condensed)
- **Deployment & Hosting:** Netlify, GitHub Pages, or any static hosting

## Browser Compatibility

- Chrome/Safari/Firefox (modern versions)
- Mobile browsers
- IE11+ (with polyfills if needed)

## Development

To run locally:

```bash
# Start a local server in the project directory
python3 -m http.server 8000
# or
php -S localhost:8000
# or use Live Server in VS Code

# Visit http://localhost:8000
```

## Technical Notes

- Uses vanilla JavaScript (no frameworks required)
- Bootstrap 5.3 for responsive layout
- Font Awesome 5.14 for icons
- Fetches menu data asynchronously
- Preserves original CSS styling and responsive behavior
- Mobile-first responsive design
- Smooth animations and transitions
- Cart data persists during session

## Support

This template maintains the exact look and feel of the original static design while adding powerful dynamic features. All styling is preserved in `css/index.css` and should not be modified unless you want to change the visual design.

## Get in Touch

If you find this project useful or have suggestions for improvements, please reach out or submit a pull request. Thank you for visiting!
