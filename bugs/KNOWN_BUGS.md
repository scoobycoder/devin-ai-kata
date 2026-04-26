# Known Bugs — Sealed Envelope
## ⚠️ Do not open until Phase 3 of the Morning Review Guide

---

## The 7 Seeded Bugs

### Bug 1 — Missing API endpoint (console error on load)
**File:** `app/main.js` — `fetchCartCount()` function  
**Type:** API / silent failure  
**What it is:** The app calls `/api/cart/count` on every page load. This endpoint does not exist in the mock server. The fetch fails, the catch block swallows the error silently, and `console.error` fires. The cart count in the header stays at 0 permanently.  
**How Devin should find it:** Static analysis of `fetchCartCount()` + cross-referencing against `api/mock-server.js` endpoints + console error during browser scan.  
**Correct fix:** Either implement `/api/cart/count` in the mock server, or initialize cart count from a local state default and remove the broken fetch.

---

### Bug 2 — Newsletter form silently fails
**File:** `app/main.js` — `NewsletterSection` component  
**Type:** Broken UI flow  
**What it is:** Submitting the newsletter form clears the input and does nothing else. No API call is made, no success message is shown, no error is surfaced. Users believe they subscribed when they did not.  
**How Devin should find it:** Browser interaction — submit the form and observe that no network request fires and no feedback appears.  
**Correct fix:** Add a `fetch("/api/newsletter/subscribe", { method: "POST", body: ... })` call and a success/error state to give user feedback.

---

### Bug 3 — Missing alt attribute on product images
**File:** `app/main.js` — `ProductCard` component, `<img>` element  
**Type:** Accessibility / console warning  
**What it is:** Every product card renders `<img src={product.image} />` with no `alt` attribute. This violates WCAG 2.1, causes screen readers to announce the full image URL, and generates a browser accessibility warning.  
**How Devin should find it:** Static analysis of JSX — straightforward.  
**Correct fix:** Add `alt={product.name}` to the img element.

---

### Bug 4 — "Tops" category filter returns no results
**File:** `app/main.js` — `filtered` computed array  
**Type:** Broken UI flow / wrong logic  
**What it is:** The category filter works correctly for all categories except "tops". For "tops", the code checks `p.name.toLowerCase().includes(category)` instead of `p.category === category`. No product name contains the word "tops", so the filter always returns an empty list, showing the empty state instead of the two tops in the catalog.  
**How Devin should find it:** Browser interaction — select "Tops" from the filter dropdown and observe that zero products are returned despite tops existing in the data. Also detectable via static analysis of the filter logic.  
**Correct fix:** Change the tops branch to `return p.category === category` (same as all other categories).

---

### Bug 5 — Cart count never increments in header
**File:** `app/main.js` — `handleAddToCart` function  
**Type:** Broken UI flow  
**What it is:** Clicking "Add to Cart" shows a toast notification but the cart count displayed in the header never changes. `setCartCount` is never called in the handler. This means the cart icon always shows 0 regardless of how many items have been added.  
**How Devin should find it:** Browser interaction — add multiple items and observe the header count. Also detectable via static analysis: `setCartCount` is defined but never called in `handleAddToCart`.  
**Correct fix:** Add `setCartCount(c => c + 1)` inside the `handleAddToCart` setTimeout callback.

---

### Bug 6 — Sort button missing `type="button"` and accessible attributes
**File:** `app/main.js` — `SortButton` component  
**Type:** Accessibility + potential browser behavior bug  
**What it is:** The sort button is missing `type="button"`, `aria-pressed`, and `aria-label`. Without `type="button"`, browsers may treat it as `type="submit"` in certain form contexts, causing unexpected page behavior. Missing `aria-pressed` means screen readers cannot convey the current sort state to users.  
**How Devin should find it:** Static analysis of the `SortButton` component JSX.  
**Correct fix:** Add `type="button" aria-pressed={sortAsc} aria-label={sortAsc ? "Sort by price ascending" : "Sort by price descending"}`.

---

### Bug 7 — Cart button calls undefined function (`viewCart is not defined`)
**File:** `app/main.js` — header `<button>` element  
**Type:** JavaScript ReferenceError  
**What it is:** The cart button in the header has `onClick={() => viewCart()}`. The function `viewCart` is never defined anywhere in the codebase. Clicking the button throws `ReferenceError: viewCart is not defined` in the console. The button looks correct visually.  
**How Devin should find it:** Browser interaction — click the cart button and observe the console error. Also detectable via static analysis: `viewCart` is referenced but never declared.  
**Correct fix:** Either implement a `viewCart` function (e.g., navigate to a cart route) or replace with a stub `() => alert("Cart coming soon")` for the kata context.

---

## Scoring Reference

| Bug | Category | Detectable by |
|---|---|---|
| 1 — Missing cart count endpoint | API / silent error | Static analysis + console |
| 2 — Newsletter silent fail | Broken UI flow | Browser interaction |
| 3 — Missing alt attribute | Accessibility | Static analysis |
| 4 — Tops filter broken | Wrong logic | Browser interaction + static |
| 5 — Cart count doesn't update | Broken UI flow | Browser interaction + static |
| 6 — Sort button attributes | Accessibility | Static analysis |
| 7 — viewCart undefined | ReferenceError | Browser interaction + console |

**Expected Devin performance:** Static analysis bugs (3, 6, 7) are high-confidence catches. Interaction-dependent bugs (2, 4, 5) require Playwright to actually use the app. Bug 1 requires cross-referencing the frontend against the API file. The interesting discussion is which ones Devin actually found vs. which required human judgment to identify.
