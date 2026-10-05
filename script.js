'use strict';

const DISCOUNT = 0.20;
const OFFER_DAYS = 20;
const U = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`;

/* Product data (images are direct URLs; swap any you like) */
const products = [
  { id: 1,  name: 'Organic Face Cream',   category: 'Face Care', price: 899,  icon: '🧴', img: U('1556228720-195a672e8a03'), desc: 'Rich shea and jojoba moisture for soft, glowing skin.' },
  { id: 2,  name: 'Aloe Vera Gel',        category: 'Skin Care', price: 349,  icon: '🌿', img: U('1596462502278-27bfdc403348'), desc: 'Cooling, pure aloe that soothes and hydrates.' },
  { id: 3,  name: 'Herbal Face Wash',     category: 'Face Care', price: 299,  icon: '🍃', img: U('1571781926291-c477ebfd024b'), desc: 'Neem and tulsi cleanser for a fresh, clear face.' },
  { id: 4,  name: 'Organic Rose Water',   category: 'Skin Care', price: 249,  icon: '🌹', img: U('1608248543803-ba4f8c70ae0b'), desc: 'Steam-distilled petals to tone and refresh.' },
  { id: 5,  name: 'Natural Lip Balm',     category: 'Lip Care',  price: 179,  icon: '💄', img: U('1522335789203-aabd1fc54bc9'), desc: 'Beeswax and cocoa butter for soft, smooth lips.' },
  { id: 6,  name: 'Organic Lipstick',     category: 'Makeup',    price: 599,  icon: '💋', img: U('1586495777744-4413f21062fa'), desc: 'Plant-pigment colour with a creamy, comfortable finish.' },
  { id: 7,  name: 'Herbal Shampoo',       category: 'Hair Care', price: 449,  icon: '🧼', img: U('1535585209827-a15fcdbc4c2d'), desc: 'Shikakai and reetha cleanse gently, no sulphates.' },
  { id: 8,  name: 'Organic Hair Oil',     category: 'Hair Care', price: 399,  icon: '🥥', img: U('1526947425960-945c6e72858f'), desc: 'Coconut, amla and hibiscus to strengthen from the root.' },
  { id: 9,  name: 'Natural Body Lotion',  category: 'Body Care', price: 549,  icon: '🧴', img: U('1570194065650-d99fb4b8ccb0'), desc: 'Light, fast-absorbing lotion with almond oil.' },
  { id: 10, name: 'Organic Body Scrub',   category: 'Body Care', price: 499,  icon: '🌾', img: U('1570172619644-dfd03ed5d881'), desc: 'Coffee and sugar polish that buffs away dullness.' },
  { id: 11, name: 'Vitamin C Serum',      category: 'Skin Care', price: 999,  icon: '🍊', img: U('1620916566398-39f1143ab7be'), desc: 'Orange-peel vitamin C to brighten uneven tone.' },
  { id: 12, name: 'Organic Face Mask',    category: 'Face Care', price: 449,  icon: '🌱', img: U('1596755389378-c31d21fd1273'), desc: 'Multani mitti and turmeric clay for a weekly deep clean.' }
];
const categories = [
  { name: 'Face Care', icon: '🌸' }, { name: 'Skin Care', icon: '🌿' }, { name: 'Hair Care', icon: '🥥' },
  { name: 'Lip Care', icon: '🍯' }, { name: 'Body Care', icon: '🧖' }, { name: 'Makeup', icon: '💄' }
];
const why = [
  ['100% Natural Products', 'Made from plants, never from harsh synthetics.'],
  ['Organic Ingredients', 'Sourced from certified organic growers.'],
  ['Skin-Friendly', 'Dermatologically gentle and free of artificial fragrance.'],
  ['Quality Products', 'Small batches, tested before they reach you.'],
  ['Affordable Prices', 'Premium care without the premium price tag.'],
  ['Eco-Friendly', 'Recyclable packaging and cruelty-free always.']
];

let cart = [];                 // cart data lives in this array
let activeCat = 'All';
let query = '';
const $ = id => document.getElementById(id);
const money = n => '₹' + Math.round(n).toLocaleString('en-IN');
const discounted = p => p.price * (1 - DISCOUNT);
const offerActive = () => Date.now() < offerEnd;

/* ---------- Offer countdown (20 days, never resets after it ends) ---------- */
function getOfferStart() {
  try {
    let s = Number(localStorage.getItem('aarthiOfferStart'));
    if (!s) { s = Date.now(); localStorage.setItem('aarthiOfferStart', s); }
    return s;
  } catch (e) { return Date.now(); }
}
const offerEnd = getOfferStart() + OFFER_DAYS * 864e5;

function tick() {
  const left = offerEnd - Date.now();
  if (left <= 0) {
    $('countdown').hidden = true;
    $('offerNote').hidden = true;
    $('expired').hidden = false;
    $('offerNote').parentNode.querySelector('h2').textContent = 'Organic Cosmetics Offer';
    clearInterval(timer);
    renderProducts();
    renderCart();
    return;
  }
  const pad = n => String(n).padStart(2, '0');
  $('cdD').textContent = pad(Math.floor(left / 864e5));
  $('cdH').textContent = pad(Math.floor(left / 36e5) % 24);
  $('cdM').textContent = pad(Math.floor(left / 6e4) % 60);
  $('cdS').textContent = pad(Math.floor(left / 1e3) % 60);
}
const timer = setInterval(tick, 1000);

/* ---------- Rendering ---------- */
function imgFail(img) { img.remove(); }

function renderProducts() {
  const q = query.trim().toLowerCase();
  const list = products.filter(p =>
    (activeCat === 'All' || p.category === activeCat) &&
    (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)));
  const on = offerActive();
  $('grid').innerHTML = list.map(p => `
    <article class="card">
      <div class="pic">${p.icon}${on ? '<span class="off">20% OFF</span>' : ''}
        <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="imgFail(this)"></div>
      <div class="body">
        <span class="cat-tag">${p.category}</span>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="price">${on ? `<del>${money(p.price)}</del><strong>${money(discounted(p))}</strong>` : `<strong>${money(p.price)}</strong>`}</div>
        <button class="btn" data-add="${p.id}">Add to Cart</button>
      </div>
    </article>`).join('');
  $('empty').hidden = list.length > 0;
}

function renderStatic() {
  $('categories').innerHTML = categories.map(c =>
    `<div class="cat" role="button" tabindex="0" data-cat="${c.name}"><span>${c.icon}</span><b>${c.name}</b></div>`).join('');
  $('filters').innerHTML = ['All', ...categories.map(c => c.name)].map(n =>
    `<button data-filter="${n}" class="${n === 'All' ? 'on' : ''}">${n}</button>`).join('');
  $('why').innerHTML = why.map(w => `<div><h3>${w[0]}</h3><p>${w[1]}</p></div>`).join('');
}

function setCategory(name) {
  activeCat = name;
  document.querySelectorAll('#filters button').forEach(b => b.classList.toggle('on', b.dataset.filter === name));
  renderProducts();
}

/* ---------- Cart ---------- */
const unit = p => offerActive() ? discounted(p) : p.price;

function addToCart(id) {
  const item = cart.find(i => i.id === id);
  item ? item.qty++ : cart.push({ id, qty: 1 });
  renderCart();
  toast(products.find(p => p.id === id).name + ' added to cart');
}
function changeQty(id, d) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += d;
  if (item.qty < 1) return removeItem(id);
  renderCart();
}
function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
}
function renderCart() {
  let sub = 0, total = 0, count = 0;
  $('cartItems').innerHTML = cart.length ? cart.map(i => {
    const p = products.find(x => x.id === i.id);
    sub += p.price * i.qty; total += unit(p) * i.qty; count += i.qty;
    return `<div class="item">
      <div class="ph"><img src="${p.img}" alt="" onerror="imgFail(this)"></div>
      <div><b>${p.name}</b><span>${money(unit(p))} each</span>
        <div class="qty"><button data-dec="${p.id}" aria-label="Decrease quantity">−</button><span>${i.qty}</span><button data-inc="${p.id}" aria-label="Increase quantity">+</button></div></div>
      <button class="rm" data-rm="${p.id}">Remove</button></div>`;
  }).join('') : '<p class="noitems">Your cart is empty. Add something you love.</p>';
  $('cartCount').textContent = count;
  $('subtotal').textContent = money(sub);
  $('discount').textContent = '-' + money(sub - total);
  $('total').textContent = money(total);
  $('orderOk').hidden = true;
}
function openCart(open) {
  $('cart').classList.toggle('open', open);
  $('overlay').classList.toggle('on', open);
  $('cart').setAttribute('aria-hidden', String(!open));
}
function checkout() {
  if (!cart.length) return toast('Your cart is empty');
  cart = [];
  renderCart();
  $('orderOk').hidden = false;
  toast('Order Placed Successfully');
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('on'), 2200);
}

/* ---------- Contact form validation ---------- */
function validateForm(e) {
  e.preventDefault();
  const rules = [
    ['cName', v => v.trim().length >= 2, 'Enter your name (at least 2 characters).'],
    ['cEmail', v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), 'Enter a valid email address.'],
    ['cPhone', v => /^[+]?[0-9\s-]{10,15}$/.test(v.trim()), 'Enter a valid phone number (10–15 digits).'],
    ['cMsg', v => v.trim().length >= 10, 'Message should be at least 10 characters.']
  ];
  let ok = true;
  rules.forEach(([id, test, msg]) => {
    const el = $(id), pass = test(el.value);
    el.classList.toggle('bad', !pass);
    el.nextElementSibling.textContent = pass ? '' : msg;
    if (!pass) ok = false;
  });
  $('formOk').hidden = !ok;
  if (ok) { e.target.reset(); toast('Message sent'); }
}

/* ---------- Events ---------- */
function setMenu(open) {
  $('menu').classList.toggle('open', open);
  $('burger').setAttribute('aria-expanded', String(open));
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-add],[data-inc],[data-dec],[data-rm],[data-filter],[data-cat]');
  if (!t) return;
  const d = t.dataset;
  if (d.add) addToCart(+d.add);
  else if (d.inc) changeQty(+d.inc, 1);
  else if (d.dec) changeQty(+d.dec, -1);
  else if (d.rm) removeItem(+d.rm);
  else if (d.filter) setCategory(d.filter);
  else if (d.cat) { setCategory(d.cat); $('products').scrollIntoView(); }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') openCart(false);
  if (e.key === 'Enter' && e.target.matches('.cat')) e.target.click();
});
$('search').addEventListener('input', e => { query = e.target.value; renderProducts(); });
$('cartBtn').addEventListener('click', () => openCart(true));
$('cartClose').addEventListener('click', () => openCart(false));
$('overlay').addEventListener('click', () => openCart(false));
$('checkout').addEventListener('click', checkout);
$('burger').addEventListener('click', () => setMenu(!$('menu').classList.contains('open')));
$('menu').addEventListener('click', e => { if (e.target.tagName === 'A') setMenu(false); });
$('contactForm').addEventListener('submit', validateForm);

/* ---------- Init ---------- */
renderStatic();
renderProducts();
renderCart();
tick();
