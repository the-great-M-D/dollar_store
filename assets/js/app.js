/* ===========================
   DOLLAR STORE — app.js
=========================== */

// ── Cart ──
function getCart() {
  try { return JSON.parse(localStorage.getItem('dollar_cart')) || []; }
  catch(e) { return []; }
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  localStorage.setItem('dollar_cart', JSON.stringify(cart));
  updateCartCount();
  openCartDrawer();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((s, i) => s + (i.qty || 1), 0);
  document.querySelectorAll('#cartCount').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (!drawer) return;
  renderCartDrawer();
  drawer.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (!drawer) return;
  drawer.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function renderCartDrawer() {
  const cart = getCart();
  const body = document.getElementById('cartDrawerBody');
  const total = document.getElementById('drawerTotal');
  if (!body) return;

  if (!cart.length) {
    body.innerHTML = `
      <div style="text-align:center;padding:48px 0;color:var(--text-light);">
        <i class="far fa-shopping-bag" style="font-size:32px;margin-bottom:12px;display:block;"></i>
        <p>Your cart is empty</p>
        <a href="shop.html" style="display:inline-block;margin-top:12px;font-size:12px;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid var(--text-light);">Start Shopping</a>
      </div>`;
    if (total) total.textContent = 'R0.00';
    return;
  }

  body.innerHTML = cart.map(item => `
    <div class="drawer-item">
      <img src="${item.image_url}" alt="${item.name}">
      <div class="drawer-item-info">
        <h6>${item.name}</h6>
        <span>Qty: ${item.qty || 1}</span>
      </div>
      <span class="drawer-item-price">R${(item.price * (item.qty || 1)).toFixed(2)}</span>
    </div>`).join('');

  const sum = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  if (total) total.textContent = `R${sum.toFixed(2)}`;
}

// ── Back to Top ──
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 300);
  });
  btn.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Search Toggle ──
function initSearch() {
  const toggle = document.getElementById('searchToggle');
  const bar = document.getElementById('searchBar');
  if (!toggle || !bar) return;
  toggle.addEventListener('click', () => {
    bar.classList.toggle('open');
    if (bar.classList.contains('open')) bar.querySelector('input').focus();
  });
}

// ── Mobile Nav ──
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mobileNav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.style.display !== 'none';
    nav.style.display = open ? 'none' : 'block';
    toggle.classList.toggle('open', !open);
  });
}

// ── Cart Drawer ──
function initCartDrawer() {
  const overlay = document.getElementById('cartOverlay');
  const closeBtn = document.getElementById('closeDrawer');
  if (overlay) overlay.addEventListener('click', closeCartDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
}

// ── Newsletter ──
function handleNewsletter(e) {
  e.preventDefault();
  const input = e.target.querySelector('input[type=email]');
  const btn = e.target.querySelector('button');
  btn.textContent = 'Subscribed ✓';
  btn.style.background = 'var(--accent)';
  input.value = '';
  setTimeout(() => {
    btn.textContent = 'Subscribe';
    btn.style.background = '';
  }, 3000);
  return false;
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  initBackToTop();
  initSearch();
  initMobileNav();
  initCartDrawer();
});
