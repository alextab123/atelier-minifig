const products = [{"id": 1, "name": "Pythor P. Chumsworth", "ref": "njo060", "theme": "Ninjago", "price": 26, "condition": "Très bon état", "status": "Disponible", "accent": "#715A87"}, {"id": 2, "name": "Commando Droid", "ref": "sw0359", "theme": "Star Wars", "price": 9, "condition": "Bon état", "status": "Disponible", "accent": "#535A63"}, {"id": 3, "name": "Darth Maul", "ref": "sw0003", "theme": "Star Wars", "price": 18, "condition": "Incomplète", "status": "Disponible", "accent": "#7B3434"}, {"id": 4, "name": "Kai - Legacy", "ref": "njo0614", "theme": "Ninjago", "price": 12, "condition": "Très bon état", "status": "Disponible", "accent": "#8C483C"}, {"id": 5, "name": "Wolf Warrior", "ref": "njo0817", "theme": "Ninjago", "price": 7, "condition": "Sans casque", "status": "Disponible", "accent": "#6E746E"}, {"id": 6, "name": "Arctic Explorer", "ref": "cty0491", "theme": "City", "price": 5, "condition": "Très bon état", "status": "Disponible", "accent": "#607D8B"}, {"id": 7, "name": "Wolf Mask Guard", "ref": "njo0943", "theme": "Ninjago", "price": 8, "condition": "Sans coiffe", "status": "Disponible", "accent": "#7B6F5B"}, {"id": 8, "name": "Clone Trooper", "ref": "sw1050", "theme": "Star Wars", "price": 15, "condition": "Très bon état", "status": "Disponible", "accent": "#59636C"}];
let cart = [];

const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const themeFilter = document.getElementById("themeFilter");
const conditionFilter = document.getElementById("conditionFilter");
const sortSelect = document.getElementById("sortSelect");
const resultCount = document.getElementById("resultCount");

function formatPrice(value) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}

function isIncomplete(condition) {
  const text = condition.toLowerCase();
  return text.includes("sans") || text.includes("incompl");
}

function filteredProducts() {
  const query = searchInput.value.trim().toLowerCase();
  let result = products.filter(p => {
    const matchesSearch = [p.name, p.ref, p.theme, p.condition].join(" ").toLowerCase().includes(query);
    const matchesTheme = themeFilter.value === "all" || p.theme === themeFilter.value;
    const matchesCondition =
      conditionFilter.value === "all" ||
      (conditionFilter.value === "complete" && !isIncomplete(p.condition)) ||
      (conditionFilter.value === "incomplete" && isIncomplete(p.condition));
    return matchesSearch && matchesTheme && matchesCondition;
  });

  if (sortSelect.value === "price-asc") result.sort((a,b) => a.price - b.price);
  if (sortSelect.value === "price-desc") result.sort((a,b) => b.price - a.price);
  if (sortSelect.value === "name") result.sort((a,b) => a.name.localeCompare(b.name));
  return result;
}

function renderProducts() {
  const list = filteredProducts();
  resultCount.textContent = `${list.length} figurine${list.length > 1 ? "s" : ""}`;

  if (!list.length) {
    grid.innerHTML = `<div class="empty-state">Aucune figurine ne correspond à votre recherche.</div>`;
    return;
  }

  grid.innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-image" onclick="openProduct(${p.id})">
        <img src="assets/${p.ref}.svg" alt="${p.name}">
        <span class="badge">${p.theme}</span>
      </div>
      <div class="product-info">
        <div class="product-topline">
          <div>
            <div class="product-name">${p.name}</div>
            <div class="product-ref">${p.ref}</div>
          </div>
          <div class="product-price">${formatPrice(p.price)}</div>
        </div>
        <div class="product-condition">${p.condition}</div>
        <button class="add-button" onclick="addToCart(${p.id})">Ajouter au panier</button>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  if (!cart.includes(id)) cart.push(id);
  updateCart();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item !== id);
  updateCart();
}

function updateCart() {
  document.getElementById("cartCount").textContent = cart.length;
  const cartItems = document.getElementById("cartItems");
  const selected = cart.map(id => products.find(p => p.id === id));
  document.getElementById("cartTotal").textContent = formatPrice(selected.reduce((sum, p) => sum + p.price, 0));

  if (!selected.length) {
    cartItems.innerHTML = `<p class="empty-state">Votre panier est vide.</p>`;
    return;
  }

  cartItems.innerHTML = selected.map(p => `
    <div class="cart-item">
      <img src="assets/${p.ref}.svg" alt="${p.name}">
      <div>
        <strong>${p.name}</strong>
        <small>${p.ref} · ${p.theme}</small>
        <small>${p.condition}</small>
      </div>
      <div>
        <strong>${formatPrice(p.price)}</strong>
        <button class="remove-item" onclick="removeFromCart(${p.id})">Retirer</button>
      </div>
    </div>
  `).join("");
}

const drawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("drawerOverlay");

function openCart() {
  drawer.classList.add("open");
  overlay.classList.add("open");
}
function closeCart() {
  drawer.classList.remove("open");
  overlay.classList.remove("open");
}

document.getElementById("cartOpen").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

const dialog = document.getElementById("productDialog");
const dialogContent = document.getElementById("dialogContent");

function openProduct(id) {
  const p = products.find(item => item.id === id);
  dialogContent.innerHTML = `
    <div class="dialog-product">
      <img src="assets/${p.ref}.svg" alt="${p.name}">
      <div class="dialog-details">
        <p class="eyebrow">${p.theme}</p>
        <h2>${p.name}</h2>
        <p class="price">${formatPrice(p.price)}</p>
        <p>Exemplaire contrôlé et identifié individuellement. La photographie correspond à la figurine vendue.</p>
        <ul class="detail-list">
          <li><span>Référence</span><strong>${p.ref}</strong></li>
          <li><span>État</span><strong>${p.condition}</strong></li>
          <li><span>Disponibilité</span><strong>${p.status}</strong></li>
          <li><span>Quantité</span><strong>1 exemplaire</strong></li>
        </ul>
        <button class="button primary" onclick="addToCart(${p.id}); dialog.close()">Ajouter au panier</button>
      </div>
    </div>
  `;
  dialog.showModal();
}
document.getElementById("dialogClose").addEventListener("click", () => dialog.close());

[searchInput, themeFilter, conditionFilter, sortSelect].forEach(el => {
  el.addEventListener("input", renderProducts);
  el.addEventListener("change", renderProducts);
});

renderProducts();
updateCart();
