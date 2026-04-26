// Threadline Mock API Server
// AI Club Devin Kata
//
// Run locally: node mock-server.js
// Runs on port 3001 by default.
// The frontend app calls /api/* — in production these would be proxied.
// In the kata, Devin should inspect this file for endpoint inventory.

const express = require("express");
const app = express();
app.use(express.json());

// BUG: Missing CORS headers on all routes.
// Cross-origin requests from the frontend (different origin in dev) will fail.
// A correct implementation would include:
//   app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Content-Type");
//     next();
//   });

// GET /api/products
// Returns all products. Works correctly.
app.get("/api/products", (req, res) => {
  res.json({
    products: [
      { id: 1, name: "Merino Crew Sweater", category: "knitwear", price: 148, inStock: true },
      { id: 2, name: "Tailored Linen Trouser", category: "trousers", price: 195, inStock: true },
      { id: 3, name: "Washed Canvas Jacket", category: "outerwear", price: 320, inStock: true },
      { id: 4, name: "Ribbed Tank Top", category: "tops", price: 58, inStock: false },
      { id: 5, name: "Wide Leg Denim", category: "trousers", price: 175, inStock: true },
    ]
  });
});

// GET /api/products/:id
// Returns a single product. Works correctly.
app.get("/api/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const products = { 1: "Merino Crew Sweater", 2: "Tailored Linen Trouser" };
  if (!products[id]) return res.status(404).json({ error: "Product not found" });
  res.json({ id, name: products[id] });
});

// POST /api/cart
// Adds an item to cart. Works correctly for valid input.
// BUG: When quantity is 0 or negative, returns 500 instead of 400.
// Should validate input and return a proper 400 with an error message.
app.post("/api/cart", (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId) return res.status(400).json({ error: "productId is required" });
  // Missing validation: quantity <= 0 causes divide-by-zero in unit price calc
  const unitPrice = 100 / quantity; // BUG: throws if quantity is 0
  res.json({ success: true, productId, quantity, unitPrice });
});

// POST /api/newsletter/subscribe
app.post("/api/newsletter/subscribe", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "email required" });
  res.json({ success: true });
});

// Keep GET for backward compatibility but prefer POST
app.get("/api/newsletter/subscribe", (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "email required" });
  res.json({ success: true });
});

// NOTE: /api/cart/count is NOT implemented.
// The frontend calls it on load — this will 404 in the real server,
// producing a console error that is silently swallowed.

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Mock API running on :${PORT}`));
