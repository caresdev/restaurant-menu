const fs = require("fs");
const path = require("path");

const config = {
  name: process.env.RESTAURANT_NAME || "",
  contact: {
    phone: process.env.PHONE || "",
    address: process.env.ADDRESS || "",
    city: process.env.CITY || "",
    state: process.env.STATE || "",
    zip: process.env.ZIP || "",
    country: process.env.COUNTRY || "",
    email: process.env.EMAIL || "",
  },
};

// Read the base data.json file
const dataPath = path.join(process.cwd(), "data.json");
const menuData = JSON.parse(fs.readFileSync(dataPath, "utf8"));

// Update restaurant info with config values
menuData.restaurant.name = config.name;
menuData.restaurant.contact = config.contact;

// Write to public directory
const outDir = path.join(process.cwd(), "/");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, "data.json"),
  JSON.stringify(menuData, null, 2)
);

console.log("✅ public/data.json generated with runtime config");
