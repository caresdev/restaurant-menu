const fs = require("fs");
const path = require("path");

const config = {
  siteName: process.env.SITE_NAME || "",
  phone: process.env.PHONE || "",
  address: process.env.ADDRESS || "",
  email: process.env.EMAIL || "",
};

// Read the base data.json file
const dataPath = path.join(process.cwd(), "data.json");
const menuData = JSON.parse(fs.readFileSync(dataPath, "utf8"));

// Update restaurant info with config values
menuData.restaurant.name = config.siteName;
menuData.restaurant.phone = config.whatsappPhone;
menuData.restaurant.contact.address = config.city;

// Write to public directory
const outDir = path.join(process.cwd(), "public");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, "data.json"),
  JSON.stringify(menuData, null, 2)
);

console.log("✅ public/data.json generated with runtime config");
