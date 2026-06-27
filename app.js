const WHATSAPP_BASE_URL = 'https://wa.me/573173882325?text=';
const STORAGE_KEY = 'milenitas-shoes-cart';

const products = [
  {
    id: 'modelo-deportivo-1',
    name: 'Mocasín',
    price: 189000,
    category: 'Mocasines',
    tag: 'NUEVO',
    image: './img/2.png'
  },
  {
    id: 'mocasin-gamuza-2',
    name: 'Mocasín Plataforma Celeste',
    price: 189000,
    category: 'Mocasines',
    tag: 'PREMIUM',
    image: './img/3.png'
  },
  {
    id: 'sandalia-cuero-3',
    name: 'Mocasín con Flecos Rosado',
    price: 189000,
    category: 'Sandalias',
    tag: 'LIVIANA',
    image: './img/4.png'
  },
  {
    id: 'bota-urbana-4',
    name: 'Tenis Confort Metalizado',
    price: 209000,
    category: 'Tenis',
    tag: 'BEST SELLER',
    image: './img/5.png'
  },
  {
    id: 'tacon-elegante-5',
    name: 'Zapatilla Animal Print Café',
    price: 229000,
    category: 'Tenis',
    tag: 'ELEGANTE',
    image: './img/6.png'
  },
  {
    id: 'zapatilla-casual-6',
    name: 'Mocasín Deportivo Camel',
    price: 229000,
    category: 'Tenis',
    tag: 'CÓMODO',
    image: './img/7.png'
  },
  {
    id: 'sandalia-plataforma-7',
    name: 'Zapatilla Negra Texturizada',
    price: 229000,
    category: 'Oxfords',
    tag: 'TENDENCIA',
    image: './img/8.png'
  },
  {
    id: 'oxford-clasico-8',
    name: 'Zapato Oxford con Moño',
    price: 239000,
    category: 'Oxfords',
    tag: 'CLÁSICO',
    image: './img/9.png'
  }
];

const moneyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0
});

const cartCount = document.querySelector('#cartCount');
const openCartButton = document.querySelector('#openCart');
const closeCartButton = document.querySelector('#closeCart');
const cartSidebar = document.querySelector('#cartSidebar');
const cartOverlay = document.querySelector('#cartOverlay');
const cartItems = document.querySelector('#cartItems');
const cartEmpty = document.querySelector('#cartEmpty');
const cartTotal = document.querySelector('#cartTotal');
const checkoutButton = document.querySelector('#checkoutButton');
const emptyShopButton = document.querySelector('#emptyShopButton');
const productGrid = document.querySelector('#productGrid');

let cart = loadCart();

function loadCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedCart) ? savedCart : [];
  } catch (error) {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function formatMoney(value) {
  return moneyFormatter.format(value);
}

function getProduct(productId) {
  return products.find((product) => product.id === productId);
}

function getCartQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal() {
  return cart.reduce((total, item) => {
    const product = getProduct(item.id);
    return product ? total + product.price * item.quantity : total;
  }, 0);
}

function addToCart(productId) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart();
  renderCart();
  openCart();
}

function updateQuantity(productId, nextQuantity) {
  const itemIndex = cart.findIndex((item) => item.id === productId);

  if (itemIndex === -1) return;

  if (nextQuantity <= 0) {
    cart.splice(itemIndex, 1);
  } else {
    cart[itemIndex].quantity = nextQuantity;
  }

  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
}

function renderProducts() {
  if (!productGrid) return;

  productGrid.innerHTML = products.map((product, index) => {
    return `
      <article class="product-card">
        <div class="product-visual visual-${index + 1}">
          <span class="product-tag">${product.tag}</span>
          <img src="${product.image}" alt="${product.name}" class="product-image">
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <div class="product-meta">
            <span class="product-price">${formatMoney(product.price)}</span>
            <span class="product-category">${product.category}</span>
          </div>
          <button class="add-button" type="button" data-add="${product.id}">
            AGREGAR AL CARRITO
          </button>
        </div>
      </article>
    `;
  }).join('');
}

function renderCart() {
  const totalQuantity = getCartQuantity();
  const total = getCartTotal();
  const hasItems = cart.length > 0;

  if (cartCount) cartCount.textContent = totalQuantity;
  if (cartTotal) cartTotal.textContent = formatMoney(total);
  if (checkoutButton) checkoutButton.disabled = !hasItems;
  if (cartEmpty) cartEmpty.classList.toggle('hidden', hasItems);
  if (cartItems) cartItems.classList.toggle('hidden', !hasItems);

  if (!hasItems) {
    if (cartItems) {
      cartItems.innerHTML = `
        <div class="cart-empty-state" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; min-height: 80vh; width: 100%; background-color: transparent;">
          <div class="empty-cart-icon" style="font-size: 48px; margin-bottom: 20px; opacity: 0.7;">🛒</div>
          <h3 style="font-size: 24px; font-weight: 700; margin-bottom: 15px; color: #1d1d1f;">Tu carrito está vacío</h3>
          <p style="font-size: 14px; color: #6e6e73; margin-bottom: 25px; max-width: 280px; margin-left: auto; margin-right: auto;">Agrega tus favoritos de la colección para finalizar por WhatsApp.</p>
          <button class="btn btn-dark close-cart-btn" style="background-color: #1d1d1f; color: white; border-radius: 30px; padding: 12px 30px; font-weight: bold; border: none; cursor: pointer;">VER COLECCIÓN</button>
        </div>
      `;
    }
    return;
  }

  if (cartItems) {
    cartItems.innerHTML = cart.map((item) => {
      const product = getProduct(item.id);
      if (!product) return '';

      return `
        <article class="cart-item">
          <div class="cart-item-main">
            <img src="${product.image}" alt="${product.name}" class="cart-item-image">
            <div class="cart-item-details">
              <h3>${product.name}</h3>
              <div class="cart-item-line">
                <span class="cart-price">${formatMoney(product.price * item.quantity)}</span>
                <span class="product-note">${formatMoney(product.price)} c/u</span>
              </div>
              <div class="qty-control" aria-label="Cantidad de ${product.name}">
                <button type="button" data-decrease="${product.id}" aria-label="Disminuir cantidad de ${product.name}">−</button>
                <span>${item.quantity}</span>
                <button type="button" data-increase="${product.id}" aria-label="Aumentar cantidad de ${product.name}">+</button>
              </div>
              <button class="remove-button" type="button" data-remove="${product.id}">Eliminar</button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }
}

function checkoutWhatsApp() {
  if (!cart.length) return;

  const phone = "573173882325";
  let text = "Hola Milenitas Shoes ✨\nQuiero finalizar este pedido:\n\n";

  cart.forEach(item => {
    const product = getProduct(item.id);
    if (product) {
      text += `${product.name} — ${item.quantity} x $ ${product.price.toLocaleString()}\n`;
    }
  });

  text += `\n*Total: $ ${getCartTotal().toLocaleString()}*\n\nMe confirman disponibilidad, talla y datos de envío, por favor.`;

  const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phone}&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;
  window.open(whatsappUrl, '_blank');
}

function openCart() {
  if (!cartSidebar || !cartOverlay) return;
  cartSidebar.classList.add('is-open');
  cartOverlay.classList.add('is-open');
  cartSidebar.setAttribute('aria-hidden', 'false');
  document.body.classList.add('cart-locked');
  if (closeCartButton) closeCartButton.focus();
}

function closeCart() {
  if (!cartSidebar || !cartOverlay) return;
  cartSidebar.classList.remove('is-open');
  cartOverlay.classList.remove('is-open');
  cartSidebar.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('cart-locked');
  if (openCartButton) openCartButton.focus();
}

if (productGrid) {
  productGrid.addEventListener('click', (event) => {
    const addButton = event.target.closest('[data-add]');
    if (!addButton) return;
    addToCart(addButton.dataset.add);
  });
}

if (cartItems) {
  cartItems.addEventListener('click', (event) => {
    const decreaseButton = event.target.closest('[data-decrease]');
    const increaseButton = event.target.closest('[data-increase]');
    const removeButton = event.target.closest('[data-remove]');
    const closeCartBtn = event.target.closest('.close-cart-btn');

    if (closeCartBtn) {
      closeCart();
      const coleccionSection = document.querySelector('#coleccion');
      if (coleccionSection) coleccionSection.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (decreaseButton) {
      const product = getProduct(decreaseButton.dataset.decrease);
      const item = cart.find((cartItem) => cartItem.id === product.id);
      updateQuantity(product.id, item.quantity - 1);
      return;
    }

    if (increaseButton) {
      const product = getProduct(increaseButton.dataset.increase);
      const item = cart.find((cartItem) => cartItem.id === product.id);
      updateQuantity(product.id, item.quantity + 1);
      return;
    }

    if (removeButton) {
      removeFromCart(removeButton.dataset.remove);
    }
  });
}

if (openCartButton) openCartButton.addEventListener('click', openCart);
if (closeCartButton) closeCartButton.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
if (checkoutButton) checkoutButton.addEventListener('click', checkoutWhatsApp);

if (emptyShopButton) {
  emptyShopButton.addEventListener('click', () => {
    closeCart();
    const coleccionSection = document.querySelector('#coleccion');
    if (coleccionSection) coleccionSection.scrollIntoView({ behavior: 'smooth' });
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && cartSidebar && cartSidebar.classList.contains('is-open')) {
    closeCart();
  }
});

const privacyLink = document.querySelector('#privacyLink');
if (privacyLink) {
  privacyLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Milenitas Shoes protege los datos personales de nuestras clientas según la Ley 1581 de 2012 (Habeas Data). No compartimos información con terceros. Solo usamos los datos de contacto para gestionar pedidos y envíos.');
  });
}

renderProducts();
renderCart();

window.addEventListener('scroll', () => {
  if (window.innerWidth < 768) {
    const header = document.querySelector('.site-header');
    const cartSidebar = document.querySelector('.cart-sidebar');

    const isCartOpen = cartSidebar.classList.contains('is-open') || cartSidebar.getAttribute('aria-hidden') === 'false';

    if (window.scrollY === 0 || isCartOpen) {
      header.classList.add('header-oculto');
    } else {
      header.classList.remove('header-oculto');
    }
  }
});

window.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth < 768) {
    document.querySelector('.site-header').classList.add('header-oculto');
  }
});