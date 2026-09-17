// app.js — Mi Ranchito Application Logic

/* ─── STATE ───────────────────────────────── */
let cart = [];
const WA_NUMBER1 = '573212065148';
const WA_NUMBER2 = '573223669482';
const DELIVERY_FEE = 3000;

/* ─── LOCAL STORAGE HELPERS ───────────────── */
function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem('mr_cart');
    if (saved) cart = JSON.parse(saved) || [];
  } catch (e) {
    cart = [];
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem('mr_cart', JSON.stringify(cart));
  } catch (e) {}
}

function loadCustomerFromStorage() {
  try {
    const saved = localStorage.getItem('mr_customer');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.name) {
        const el = document.getElementById('clientName');
        if (el) el.value = data.name;
      }
      if (data.phone) {
        const el = document.getElementById('clientPhone');
        if (el) el.value = data.phone;
      }
      if (data.address) {
        const el = document.getElementById('clientAddress');
        if (el) el.value = data.address;
      }
      if (data.neighborhood) {
        const el = document.getElementById('clientNeighborhood');
        if (el) el.value = data.neighborhood;
      }
      if (data.notes) {
        const el = document.getElementById('clientNotes');
        if (el) el.value = data.notes;
      }
    }
  } catch (e) {}
}

function saveCustomerToStorage() {
  try {
    const data = {
      name: document.getElementById('clientName')?.value || '',
      phone: document.getElementById('clientPhone')?.value || '',
      address: document.getElementById('clientAddress')?.value || '',
      neighborhood: document.getElementById('clientNeighborhood')?.value || '',
      notes: document.getElementById('clientNotes')?.value || ''
    };
    localStorage.setItem('mr_customer', JSON.stringify(data));
  } catch (e) {}
}

/* ─── DOM READY ───────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadCartFromStorage();
  loadCustomerFromStorage();
  renderAllMenus();
  setupNav();
  setupStickyCategoryBar();
  setupDynamicSearch();
  setupCart();
  setupFilters();
  setupScrollEffects();
  setupReviews();
  updateCartUI();
});

/* ─── RENDER MENUS ────────────────────────── */
function renderAllMenus() {
  renderMenu('asadero', 'all');
  renderMenu('restaurante', 'all');
  renderMenu('panaderia', 'all');
  renderMenu('bebidas', 'all');
}

function renderMenu(section, filter) {
  const grid = document.getElementById('grid-' + section);
  if (!grid || !MENU[section]) return;
  const items = MENU[section].filter(i => filter === 'all' || i.category === filter);
  grid.innerHTML = '';
  if (items.length === 0) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#A09080;padding:40px 0;">No hay productos en esta categoria.</p>';
    return;
  }
  items.forEach((item, idx) => {
    const card = createCard(item, idx);
    grid.appendChild(card);
  });
}

function createCard(item, idx) {
  const div = document.createElement('div');
  div.className = 'menu-card';
  div.style.animationDelay = (idx * 0.06) + 's';

  let badgeHTML = '';
  if (item.badge) {
    const cls = item.badge === 'Fresco' || item.badge === 'Favorito' ? 'card-badge-hot' : item.badge === 'Popular' ? 'card-badge-pop' : '';
    badgeHTML = `<span class="card-badge-pop ${cls}">${item.badge}</span>`;
  }

  const tagsHTML = (item.tags || []).map(t => `<span class="card-tag">${t}</span>`).join('');
  const hasPrice = Number.isFinite(item.price);
  const fmtPrice = hasPrice ? formatPrice(item.price) : 'Precio por confirmar';

  let bannerHTML = '';
  if (item.img) {
    bannerHTML = `
      <div class="card-img-banner">
        <img src="${item.img}" alt="${item.name}" loading="lazy" onerror="this.parentElement.innerHTML='<span class=\\'emoji-fallback\\'>${item.emoji}</span>'" />
        ${badgeHTML}
      </div>`;
  } else {
    bannerHTML = `
      <div class="card-emoji-banner">
        <span style="font-size:3.5rem">${item.emoji}</span>
        ${badgeHTML}
      </div>`;
  }

  const itemDataStr = JSON.stringify({
    id: item.id,
    name: item.name,
    price: item.price,
    category: item.category,
    emoji: item.emoji,
    img: item.img || '',
    hasMeat: !!item.hasMeat
  }).replace(/"/g, '&quot;');

  const addButton = hasPrice
    ? `<button class="add-btn" data-item="${itemDataStr}" aria-label="Agregar ${item.name} al carrito">+</button>`
    : `<button class="add-btn" disabled aria-label="Precio de ${item.name} por confirmar">—</button>`;

  let priceHTML = '';
  if (item.priceOptions && item.priceOptions.length > 0) {
    const optsHTML = item.priceOptions.map((p, i) => {
      const val = (typeof p === 'object' && p.label) ? p.price : p;
      const label = (typeof p === 'object' && p.label) ? p.label : formatPrice(p);
      const activeCls = i === 0 ? ' active' : '';
      return `<button type="button" class="option-btn${activeCls}" data-value="${val}" aria-pressed="${i === 0}">${label}</button>`;
    }).join('');
    priceHTML = `<div class="option-group price-options" role="group" aria-label="Seleccionar valor para ${item.name}">${optsHTML}</div>`;
  } else {
    priceHTML = `<span class="card-price">${fmtPrice}</span>`;
  }

  let fulfillmentHTML = '';
  if (item.fulfillmentOptions && item.fulfillmentOptions.length > 0) {
    const fOptsHTML = item.fulfillmentOptions.map((f, i) => {
      const activeCls = i === 0 ? ' active' : '';
      return `<button type="button" class="option-btn${activeCls}" data-value="${f.value}" aria-pressed="${i === 0}">${f.label}</button>`;
    }).join('');
    fulfillmentHTML = `<div class="option-group fulfillment-options" role="group" aria-label="Selecciona en local o para llevar para ${item.name}">${fOptsHTML}</div>`;
  }

  div.innerHTML = `
    ${bannerHTML}
    <div class="card-body">
      <h3 class="card-name">${item.name}</h3>
      <p class="card-desc">${item.desc}</p>
      <div class="card-tags">${tagsHTML}</div>
      ${fulfillmentHTML}
    </div>
    <div class="card-footer">
      ${priceHTML}
      ${addButton}
    </div>
  `;

  /* Toggle logic: only one active button per group */
  div.querySelectorAll('.option-group').forEach(group => {
    group.addEventListener('click', (e) => {
      const btn = e.target.closest('.option-btn');
      if (!btn || !group.contains(btn)) return;
      e.preventDefault();
      e.stopPropagation();
      group.querySelectorAll('.option-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
    });
  });

  if (hasPrice) {
    div.querySelector('.add-btn').addEventListener('click', function() {
      const itemData = JSON.parse(this.dataset.item);
      const priceBtn = div.querySelector('.price-options .option-btn.active');
      const fulfillmentBtn = div.querySelector('.fulfillment-options .option-btn.active');
      let nameSuffix = '';

      if (priceBtn) {
        const selPrice = Number(priceBtn.dataset.value);
        itemData.price = selPrice;
        nameSuffix += ' (' + priceBtn.textContent + ')';
        itemData.id = item.id + '_' + selPrice;
      }

      if (fulfillmentBtn) {
        nameSuffix += ' — ' + fulfillmentBtn.textContent;
        itemData.id += '_' + fulfillmentBtn.dataset.value;
      }

      itemData.name = item.name + nameSuffix;
      addToCart(itemData);
    });
  }

  return div;
}

/* ─── CART LOGIC ──────────────────────────── */
function triggerCartBounce() {
  const badge = document.getElementById('cartBadge');
  const btn = document.getElementById('cartBtn');
  if (badge) {
    badge.classList.remove('bounce');
    void badge.offsetWidth;
    badge.classList.add('bounce');
  }
  if (btn) {
    btn.classList.remove('bounce');
    void btn.offsetWidth;
    btn.classList.add('bounce');
  }
}

function addToCart(item) {
  const existing = cart.find(c => c.id === item.id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCartUI();
  triggerCartBounce();
  showToast(item.emoji + ' ' + item.name + ' agregado', 'success');
}

function removeFromCart(id) {
  const idx = cart.findIndex(c => c.id === id);
  if (idx === -1) return;
  if (cart[idx].qty > 1) {
    cart[idx].qty--;
  } else {
    cart.splice(idx, 1);
  }
  updateCartUI();
}

function deleteFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
}

function setQty(id, qty) {
  const n = Math.floor(Number(qty));
  const item = cart.find(c => c.id === id);
  if (!item) return;
  if (!Number.isFinite(n) || n <= 0) {
    deleteFromCart(id);
    return;
  }
  item.qty = n;
  updateCartUI();
}

function updateCartUI() {
  saveCartToStorage();
  const total = cartTotal();
  const count = cart.reduce((s, c) => s + c.qty, 0);

  // Badges and pill counter
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = count;

  const countPill = document.getElementById('cartCountPill');
  if (countPill) countPill.textContent = count + (count === 1 ? ' producto' : ' productos');

  const isEmpty = cart.length === 0;
  const emptyEl = document.getElementById('cartEmpty');
  const detailsContainer = document.getElementById('cartDetailsContainer');
  const footerEl = document.getElementById('cartFooter');
  const clearBtn = document.getElementById('cartClearBtn');

  if (emptyEl) emptyEl.style.display = isEmpty ? 'flex' : 'none';
  if (detailsContainer) detailsContainer.style.display = isEmpty ? 'none' : 'flex';
  if (footerEl) footerEl.style.display = isEmpty ? 'none' : 'flex';
  if (clearBtn) clearBtn.style.display = isEmpty ? 'none' : 'inline-flex';

  // Render items list
  const list = document.getElementById('cartList');
  if (list) {
    list.innerHTML = '';
    cart.forEach(item => {
      const li = document.createElement('li');
      li.className = 'cart-item';
      const unitPriceHtml = item.qty > 1 ? `<div class="ci-unit-price">${formatPrice(item.price)} c/u</div>` : '';
      li.innerHTML = `
        <div class="ci-emoji">${item.emoji}</div>
        <div class="ci-info">
          <div class="ci-name">${item.name}</div>
          ${unitPriceHtml}
          <div class="ci-price">${formatPrice(item.price * item.qty)}</div>
        </div>
        <div class="ci-controls">
          <div class="ci-stepper">
            <button type="button" class="ci-btn" data-id="${item.id}" data-action="remove" aria-label="Quitar uno">−</button>
            <input type="number" class="ci-qty-input" data-id="${item.id}" min="1" step="1" inputmode="numeric" value="${item.qty}" aria-label="Cantidad">
            <button type="button" class="ci-btn" data-id="${item.id}" data-action="add" aria-label="Agregar uno">+</button>
          </div>
          <button type="button" class="ci-delete-btn" data-id="${item.id}" data-action="delete" title="Eliminar producto" aria-label="Eliminar producto">🗑️</button>
        </div>
      `;
      list.appendChild(li);
    });
  }

  // Delivery Benefit Banner
  const modeOpt = document.querySelector('input[name="fulfillment"]:checked');
  const mode = modeOpt ? modeOpt.value : 'domicilio';
  const hasMeat = cart.some(c => c.hasMeat);

  const bannerEl = document.getElementById('cartBenefitBanner');
  const iconEl = document.getElementById('benefitIcon');
  const titleEl = document.getElementById('benefitTitle');
  const textEl = document.getElementById('benefitText');

  if (bannerEl && iconEl && titleEl && textEl) {
    if (mode === 'recoger') {
      bannerEl.className = 'cart-benefit-banner';
      iconEl.textContent = '🏪';
      titleEl.textContent = 'Recogida en local seleccionada';
      textEl.textContent = 'Tu pedido estará listo para retirar en Tocaima (6:30 AM - 8:30 PM).';
    } else if (hasMeat) {
      bannerEl.className = 'cart-benefit-banner free';
      iconEl.textContent = '🎉';
      titleEl.textContent = '¡Domicilio GRATIS en Tocaima incluido!';
      textEl.textContent = 'Excelente: tu pedido incluye carne o picada de nuestro asadero.';
    } else {
      bannerEl.className = 'cart-benefit-banner';
      iconEl.textContent = '💡';
      titleEl.textContent = '¿Quieres Domicilio GRATIS?';
      textEl.textContent = 'Agrega una picada o plato con carne del Asadero y no pagarás envío en Tocaima.';
    }
  }

  // Values in Summary
  const subEl = document.getElementById('subtotalVal');
  const delEl = document.getElementById('deliveryVal');
  const totEl = document.getElementById('totalVal');
  const msgEl = document.getElementById('deliveryDetailMsg');

  if (subEl) subEl.textContent = formatPrice(total);

  // Update Proceed button in Phase 1
  const btnP1Total = document.getElementById('btnPhase1Total');
  if (btnP1Total) btnP1Total.textContent = formatPrice(total);

  // Toggle Next to Phase 2 button
  const btnNextPhase = document.getElementById('btnNextToPhase2');
  if (btnNextPhase) btnNextPhase.style.display = isEmpty ? 'none' : 'flex';

  if (isEmpty) {
    goToCartPhase(1);
  }

  if (mode === 'recoger') {
    if (delEl) {
      delEl.textContent = 'Gratis ($0)';
      delEl.className = 'delivery-status-text free';
    }
    if (totEl) totEl.textContent = formatPrice(total);
    if (msgEl) {
      msgEl.style.display = 'block';
      msgEl.innerHTML = '🏪 <strong>Recogida en local</strong> — Tocaima (Horario 6:30 AM - 8:30 PM).';
    }
  } else {
    // Domicilio en Tocaima
    if (hasMeat) {
      if (delEl) {
        delEl.textContent = '✨ GRATIS (Incluido por carne)';
        delEl.className = 'delivery-status-text free';
      }
      if (totEl) totEl.textContent = formatPrice(total);
      if (msgEl) {
        msgEl.style.display = 'block';
        msgEl.innerHTML = '🎉 <strong>¡Domicilio GRATIS incluido!</strong> Tu pedido incluye carne/picada artesanal.';
      }
    } else {
      if (delEl) {
        delEl.textContent = 'A convenir';
        delEl.className = 'delivery-status-text negotiable';
      }
      if (totEl) totEl.textContent = formatPrice(total) + ' (+ Domicilio)';
      if (msgEl) {
        msgEl.style.display = 'block';
        msgEl.innerHTML = '📍 <strong>Domicilio en Tocaima:</strong> El costo depende del barrio/vereda y se confirma por WhatsApp.';
      }
    }
  }
}

function cartTotal() {
  return cart.reduce((s, c) => s + c.price * c.qty, 0);
}

/* ─── CART PHASES NAVIGATION ──────────────── */
let currentCartPhase = 1;

function goToCartPhase(phase) {
  if (phase === 2 && cart.length === 0) {
    showToast('Tu carrito está vacío. Agrega productos al menú primero.', 'error');
    return;
  }
  currentCartPhase = phase;
  const phase1 = document.getElementById('cartPhase1');
  const phase2 = document.getElementById('cartPhase2');
  const step1Btn = document.getElementById('phaseStep1Btn');
  const step2Btn = document.getElementById('phaseStep2Btn');
  const actions1 = document.getElementById('actionsPhase1');
  const actions2 = document.getElementById('actionsPhase2');
  const scrollArea = document.getElementById('cartScrollArea');

  if (phase === 1) {
    if (phase1) {
      phase1.style.display = 'flex';
      phase1.classList.add('active');
    }
    if (phase2) {
      phase2.style.display = 'none';
      phase2.classList.remove('active');
    }
    if (step1Btn) step1Btn.classList.add('active');
    if (step2Btn) step2Btn.classList.remove('active');
    if (actions1) actions1.style.display = 'block';
    if (actions2) actions2.style.display = 'none';
  } else {
    if (phase1) {
      phase1.style.display = 'none';
      phase1.classList.remove('active');
    }
    if (phase2) {
      phase2.style.display = 'flex';
      phase2.classList.add('active');
    }
    if (step1Btn) step1Btn.classList.remove('active');
    if (step2Btn) step2Btn.classList.add('active');
    if (actions1) actions1.style.display = 'none';
    if (actions2) actions2.style.display = 'block';
  }
  if (scrollArea) scrollArea.scrollTop = 0;
}

/* ─── FULFILLMENT TOGGLE ──────────────────── */
function toggleFulfillment() {
  const modeOpt = document.querySelector('input[name="fulfillment"]:checked');
  const mode = modeOpt ? modeOpt.value : 'domicilio';
  const addressGroup = document.getElementById('addressGroup');
  const noteEl = document.getElementById('fulfillmentNote');

  if (addressGroup) {
    addressGroup.style.display = mode === 'recoger' ? 'none' : 'block';
  }
  if (noteEl) {
    if (mode === 'recoger') {
      noteEl.textContent = '🏪 Horario de recogida en local: 6:30 AM - 8:30 PM (Tocaima).';
    } else {
      noteEl.textContent = '📍 Domicilios exclusivamente para el municipio de Tocaima (6:30 AM - 8:30 PM).';
    }
  }
  updateCartUI();
}

/* ─── CHECKOUT ────────────────────────────── */
function checkout(targetWaNumber) {
  const waTarget = targetWaNumber || WA_NUMBER1;

  if (cart.length === 0) {
    showToast('El carrito está vacío. Agrega productos al menú.', 'error');
    goToCartPhase(1);
    return;
  }

  const nameInput = document.getElementById('clientName');
  const phoneInput = document.getElementById('clientPhone');
  const addressInput = document.getElementById('clientAddress');
  const neighborhoodInput = document.getElementById('clientNeighborhood');
  const notesInput = document.getElementById('clientNotes');

  const name = nameInput ? nameInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const address = addressInput ? addressInput.value.trim() : '';
  const neighborhood = neighborhoodInput ? neighborhoodInput.value.trim() : '';
  const notes = notesInput ? notesInput.value.trim() : '';

  const modeOpt = document.querySelector('input[name="fulfillment"]:checked');
  const mode = modeOpt ? modeOpt.value : 'domicilio';

  // Validaciones
  if (!name) {
    showToast('Por favor ingresa tu nombre', 'error');
    if (nameInput) {
      nameInput.focus();
      nameInput.classList.add('input-error');
      setTimeout(() => nameInput.classList.remove('input-error'), 3000);
    }
    return;
  }

  if (!phone) {
    showToast('Por favor ingresa tu número celular', 'error');
    if (phoneInput) {
      phoneInput.focus();
      phoneInput.classList.add('input-error');
      setTimeout(() => phoneInput.classList.remove('input-error'), 3000);
    }
    return;
  }

  if (mode === 'domicilio') {
    if (!address) {
      showToast('Por favor ingresa la dirección de entrega en Tocaima', 'error');
      if (addressInput) {
        addressInput.focus();
        addressInput.classList.add('input-error');
        setTimeout(() => addressInput.classList.remove('input-error'), 3000);
      }
      return;
    }
    if (!neighborhood) {
      showToast('Por favor ingresa el barrio o vereda en Tocaima', 'error');
      if (neighborhoodInput) {
        neighborhoodInput.focus();
        neighborhoodInput.classList.add('input-error');
        setTimeout(() => neighborhoodInput.classList.remove('input-error'), 3000);
      }
      return;
    }
  }

  const hasMeat = cart.some(c => c.hasMeat);
  const total = cartTotal();

  let msg = '🔥✨ *¡HOLA! QUIERO REALIZAR UN PEDIDO EN MI RANCHITO* ✨🔥\n';
  msg += '🍖 *Asadero · Restaurante · Panadería Artesanal* 🥖\n';
  msg += '📍 *Tocaima, Cundinamarca* 🇨🇴\n';
  msg += '━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';

  msg += '📋 *DATOS DE ENTREGA* 🛵\n';
  msg += '👤 *Cliente:* ' + name + '\n';
  msg += '📞 *Celular:* ' + phone + '\n';

  if (mode === 'recoger') {
    msg += '🏪 *Modalidad:* Recoger en el local (Tocaima)\n';
  } else {
    msg += '🛵 *Modalidad:* Domicilio en Tocaima\n';
    msg += '📍 *Dirección:* ' + address + '\n';
    msg += '🏙️ *Barrio/Vereda:* ' + neighborhood + '\n';
  }

  if (notes) {
    msg += '📝 *Observaciones:* ' + notes + '\n';
  }

  msg += '\n━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  msg += '🛒 *PRODUCTOS DEL PEDIDO* 🛍️\n\n';
  cart.forEach(item => {
    const itemEmoji = item.emoji ? (item.emoji + ' ') : '▪ ';
    msg += `${itemEmoji}*${item.name}*\n`;
    msg += `   🏷️ Cantidad: x${item.qty} -> *${formatPrice(item.price * item.qty)}*\n`;
  });

  msg += '\n━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  msg += '🧾 *RESUMEN DE CUENTA* 💰\n';
  msg += '💵 *Subtotal:* ' + formatPrice(total) + '\n';

  if (mode === 'recoger') {
    msg += '🛵 *Domicilio:* 🎉 Gratis ($0 - Recogida en local)\n';
    msg += '💰 *TOTAL A PAGAR:* ' + formatPrice(total) + ' ✨\n';
  } else if (hasMeat) {
    msg += '🛵 *Domicilio:* ✨ ¡GRATIS! (Incluye carne de asadero)\n';
    msg += '💰 *TOTAL A PAGAR:* ' + formatPrice(total) + ' ✨\n';
  } else {
    msg += '🛵 *Domicilio:* A convenir según distancia en Tocaima\n';
    msg += '💰 *TOTAL A PAGAR:* ' + formatPrice(total) + ' + domicilio por convenir ✨\n';
  }

  msg += '\n━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  msg += '💳 *PAGO DISPONIBLE:* 💚\n';
  msg += '💚 *Nequi:* 321 206 5148 (Mi Ranchito)\n';
  msg += '💵 *Efectivo contra entrega*\n\n';
  msg += '🙏 ¡Quedo muy atento(a) a su confirmación! ¡Muchas gracias! 😊🎉';

  // Usamos el endpoint directo api.whatsapp.com/send para evitar que el acortador wa.me corrompa los emojis en 
  const waUrl = 'https://api.whatsapp.com/send?phone=' + waTarget + '&text=' + encodeURIComponent(msg);

  // Apertura directa e instantánea de WhatsApp (sin retrasos que activen bloqueadores de popups)
  const opened = window.open(waUrl, '_blank');
  if (!opened || opened.closed || typeof opened.closed === 'undefined') {
    window.location.href = waUrl;
  }

  showToast('¡Redirigiendo a WhatsApp con tu orden lista!', 'success');

  cart = [];
  updateCartUI();
  closeCart();
  goToCartPhase(1);
  if (notesInput) {
    notesInput.value = '';
    saveCustomerToStorage();
  }
}

/* ─── CART DRAWER ─────────────────────────── */
function openCart() {
  document.getElementById('cartDrawer')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('open');
  document.body.classList.add('cart-open');
  document.body.style.overflow = 'hidden';
  goToCartPhase(1);
}
function closeCart() {
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('open');
  document.body.classList.remove('cart-open');
  document.body.style.overflow = '';
}

function setupCart() {
  document.getElementById('cartBtn')?.addEventListener('click', openCart);
  document.getElementById('cartClose')?.addEventListener('click', closeCart);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCart);

  // Vaciar carrito
  document.getElementById('cartClearBtn')?.addEventListener('click', () => {
    if (cart.length === 0) return;
    if (confirm('¿Deseas vaciar todos los productos de tu pedido?')) {
      cart = [];
      updateCartUI();
      showToast('Tu carrito ha sido vaciado', 'info');
    }
  });

  // Explorar menú desde estado vacío
  document.getElementById('cartExploreBtn')?.addEventListener('click', () => {
    closeCart();
    const asaderoSec = document.getElementById('asadero');
    if (asaderoSec) {
      asaderoSec.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Copiar números Nequi (Opciones 1 y 2)
  const bindCopyNequi = (btnId, number, label) => {
    document.getElementById(btnId)?.addEventListener('click', () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(number).then(() => {
          const btn = document.getElementById(btnId);
          if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '✅ Copiado';
            setTimeout(() => { btn.innerHTML = originalText; }, 2000);
          }
          showToast(`Número ${label} (${number}) copiado`, 'success');
        }).catch(() => {
          showToast(`${label}: ${number}`, 'info');
        });
      } else {
        showToast(`${label}: ${number}`, 'info');
      }
    });
  };
  bindCopyNequi('copyNequiBtn', '3212065148', 'Nequi');

  // Guardar datos del cliente en LocalStorage
  ['clientName', 'clientPhone', 'clientAddress', 'clientNeighborhood', 'clientNotes'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', saveCustomerToStorage);
    }
  });

  const list = document.getElementById('cartList');
  if (list) {
    /* Delegación de clicks: funciona para todos los items, incluso tras re-renderizar */
    list.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn || !list.contains(btn)) return;
      e.preventDefault();
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      if (action === 'remove') removeFromCart(id);
      else if (action === 'delete') deleteFromCart(id);
      else if (action === 'add') {
        const found = cart.find(c => c.id === id);
        if (found) addToCart(found);
      }
    });

    /* Cantidad escrita manualmente por el usuario */
    list.addEventListener('change', (e) => {
      const input = e.target.closest('.ci-qty-input');
      if (!input) return;
      setQty(input.dataset.id, input.value);
    });

    /* Evita valores negativos o con letras mientras escribe */
    list.addEventListener('keydown', (e) => {
      if (!e.target.classList.contains('ci-qty-input')) return;
      if (e.key === 'Enter') { e.target.blur(); }
    });
  }
}

/* ─── BARRA DINÁMICA DE CATEGORÍAS (STICKY) ─ */
function setupStickyCategoryBar() {
  const pills = document.querySelectorAll('.cat-pill');
  if (pills.length === 0) return;

  pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = pill.dataset.target;
      const targetSec = document.getElementById(targetId);
      if (targetSec) {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const offset = 120;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetSec.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  const sections = ['asadero', 'panaderia', 'restaurante', 'bebidas', 'nosotros', 'contacto'];
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 150;
    sections.forEach(id => {
      const sec = document.getElementById(id);
      if (sec) {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          pills.forEach(p => {
            const isActive = p.dataset.target === id;
            p.classList.toggle('active', isActive);
            if (isActive) {
              p.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
            }
          });
        }
      }
    });
  }, { passive: true });
}

/* ─── BUSCADOR DINÁMICO EN VIVO ───────────── */
function setupDynamicSearch() {
  const searchInput = document.getElementById('menuSearchInput');
  const clearBtn = document.getElementById('searchClearBtn');
  if (!searchInput) return;

  function handleSearch() {
    const q = searchInput.value.trim().toLowerCase();
    if (clearBtn) clearBtn.style.display = q ? 'block' : 'none';

    ['asadero', 'restaurante', 'panaderia', 'bebidas'].forEach(section => {
      const grid = document.getElementById('grid-' + section);
      if (!grid || !MENU[section]) return;

      if (!q) {
        const activeFilterBtn = document.querySelector(`.menu-filters[data-section="${section}"] .filter-btn.active`);
        const filter = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';
        renderMenu(section, filter);
        return;
      }

      const matched = MENU[section].filter(item => {
        const nameMatch = item.name.toLowerCase().includes(q);
        const descMatch = (item.desc || '').toLowerCase().includes(q);
        const tagsMatch = (item.tags || []).some(t => t.toLowerCase().includes(q));
        return nameMatch || descMatch || tagsMatch;
      });

      grid.innerHTML = '';
      if (matched.length === 0) {
        grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#A09080;padding:28px 0;font-size:0.95rem;">No se encontraron resultados para "${q}".</p>`;
      } else {
        matched.forEach((item, idx) => {
          const card = createCard(item, idx);
          grid.appendChild(card);
        });
      }
    });
  }

  searchInput.addEventListener('input', handleSearch);
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      handleSearch();
      searchInput.focus();
    });
  }
}

/* ─── NEQUI TOGGLE ────────────────────────── */
function toggleNequi() {
  const paymentOpt = document.querySelector('input[name="payment"]:checked');
  const val = paymentOpt ? paymentOpt.value : 'nequi1';
  const isNequi = val.startsWith('nequi');
  const infoEl = document.getElementById('nequiInfo');
  if (infoEl) infoEl.style.display = isNequi ? 'block' : 'none';
}

/* ─── FILTERS ─────────────────────────────── */
function setupFilters() {
  document.querySelectorAll('.menu-filters').forEach(container => {
    const section = container.dataset.section;
    container.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderMenu(section, btn.dataset.filter);
      });
    });
  });
}

/* ─── NAV ─────────────────────────────────── */
function setupNav() {
  const ham = document.getElementById('hamburger');
  const nav = document.getElementById('navLinks');
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    nav.classList.toggle('open');
  });
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      ham.classList.remove('open');
      nav.classList.remove('open');
    });
  });
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    const y = window.scrollY + 100;
    sections.forEach(sec => {
      if (y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${sec.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  });
}

/* ─── SCROLL EFFECTS ──────────────────────── */
function setupScrollEffects() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  });
  const style = document.createElement('style');
  style.textContent = `.anim-in { opacity: 1 !important; transform: translateY(0) !important; }
  .menu-card { opacity: 0; transform: translateY(24px); transition: opacity 0.55s ease, transform 0.55s ease, box-shadow 0.3s ease; }
  .value-card, .visual-card, .qcat-card, .contact-item, .team-card { opacity: 0; transform: translateY(16px); transition: opacity 0.5s ease, transform 0.5s ease; }`;
  document.head.appendChild(style);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('anim-in'), 50);
      }
    });
  }, { threshold: 0.08 });

  function observeNewCards() {
    document.querySelectorAll('.menu-card:not(.observed), .value-card:not(.observed), .visual-card:not(.observed), .qcat-card:not(.observed), .contact-item:not(.observed), .team-card:not(.observed)').forEach(el => {
      el.classList.add('observed');
      observer.observe(el);
    });
  }
  observeNewCards();
  const gridObserver = new MutationObserver(observeNewCards);
  document.querySelectorAll('.menu-grid').forEach(grid => {
    gridObserver.observe(grid, { childList: true });
  });
}

/* ─── MODAL ───────────────────────────────── */
function showModal(title, msg) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalMsg').textContent = msg;
  document.getElementById('modalOverlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('modalOverlay').style.display = 'none';
  document.body.style.overflow = '';
}

/* ─── LEGAL MODALS ────────────────────────── */
function showLegal(key) {
  const data = LEGAL_TEXTS[key];
  if (!data) return;
  document.getElementById('legalContent').innerHTML = data.content;
  document.getElementById('legalOverlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeLegalModal() {
  document.getElementById('legalOverlay').style.display = 'none';
  document.body.style.overflow = '';
}

/* ─── TOAST ───────────────────────────────── */
function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span> <span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('leaving');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, 3200);
}

/* ─── PHOTO MODAL ─────────────────────────── */
function openPhotoModal(imageSrc, name, role) {
  const modalOverlay = document.getElementById('photoModalOverlay');
  const modalImg = document.getElementById('photoModalImg');
  const modalName = document.getElementById('photoModalName');
  const modalRole = document.getElementById('photoModalRole');
  
  if (modalOverlay && modalImg && modalName && modalRole) {
    modalImg.src = imageSrc;
    modalName.textContent = name;
    modalRole.textContent = role;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closePhotoModal() {
  const modalOverlay = document.getElementById('photoModalOverlay');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ─── HELPERS ─────────────────────────────── */
function formatPrice(n) {
  return '$' + n.toLocaleString('es-CO');
}

/* ─── KEYBOARD ACCESSIBILITY ──────────────── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCart();
    closeModal();
    closeLegalModal();
    closePhotoModal();
  }
});

/* ─── PHOTO MODAL EVENT LISTENERS ────────── */
document.addEventListener('DOMContentLoaded', () => {
  const photoModalOverlay = document.getElementById('photoModalOverlay');
  const photoModalClose = document.getElementById('photoModalClose');
  
  if (photoModalOverlay) {
    photoModalOverlay.addEventListener('click', (e) => {
      if (e.target === photoModalOverlay) {
        closePhotoModal();
      }
    });
  }
  
  if (photoModalClose) {
    photoModalClose.addEventListener('click', closePhotoModal);
  }
});

/* ─── RESEÑAS Y OPINIONES ──────────────── */
function setupReviews() {
  const starsGroup = document.getElementById('starsGroup');
  const reviewRatingInput = document.getElementById('reviewRating');
  const reviewForm = document.getElementById('reviewForm');
  const reviewComment = document.getElementById('reviewComment');
  const charCount = document.getElementById('charCount');

  // Star rating selector
  if (starsGroup) {
    starsGroup.querySelectorAll('.star-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const rating = btn.dataset.rating;
        reviewRatingInput.value = rating;
        
        starsGroup.querySelectorAll('.star-btn').forEach(b => {
          b.classList.remove('active');
        });
        
        starsGroup.querySelectorAll(`.star-btn[data-rating="${rating}"], .star-btn[data-rating="1"], .star-btn[data-rating="2"], .star-btn[data-rating="3"], .star-btn[data-rating="4"], .star-btn[data-rating="5"]`).forEach((b, idx) => {
          if (parseInt(b.dataset.rating) <= parseInt(rating)) {
            b.classList.add('active');
          }
        });
      });
    });
  }

  // Character counter
  if (reviewComment) {
    reviewComment.addEventListener('input', () => {
      charCount.textContent = reviewComment.value.length;
    });
  }

  // Form submission
  if (reviewForm) {
    reviewForm.addEventListener('submit', submitReview);
  }

  // Load and display reviews
  displayReviews();
}

function submitReview(event) {
  event.preventDefault();

  const name = document.getElementById('reviewName')?.value?.trim() || '';
  const email = document.getElementById('reviewEmail')?.value?.trim() || '';
  const rating = document.getElementById('reviewRating')?.value || 5;
  const comment = document.getElementById('reviewComment')?.value?.trim() || '';

  // Validar correo obligatorio
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    showToast('Por favor ingresa un correo electrónico válido', 'error');
    document.getElementById('reviewEmail')?.focus();
    return;
  }

  if (!rating || rating < 1 || rating > 5) {
    showToast('Por favor selecciona una calificación', 'error');
    return;
  }

  // Add review to storage
  const review = addReviewToStorage(name, email, rating, comment);

  if (review) {
    // Clear form
    document.getElementById('reviewForm').reset();
    document.getElementById('reviewRating').value = 5;
    document.getElementById('charCount').textContent = '0';
    
    // Reset stars
    const starsGroup = document.getElementById('starsGroup');
    if (starsGroup) {
      starsGroup.querySelectorAll('.star-btn').forEach((btn, idx) => {
        btn.classList.toggle('active', idx < 5);
      });
    }

    // Refresh display
    displayReviews();
    showToast('¡Gracias por tu reseña! 🙏', 'success');
  } else {
    showToast('Error al guardar la reseña', 'error');
  }
}

function displayReviews() {
  const reviewsList = document.getElementById('reviewsList');
  if (!reviewsList) return;

  const reviews = getReviewsFromStorage();

  if (reviews.length === 0) {
    reviewsList.innerHTML = `
      <div class="reviews-empty">
        <div style="font-size: 2.5rem; margin-bottom: 12px;">⭐</div>
        <p>Aún no hay reseñas. ¡Sé el primero en dejar una!</p>
      </div>
    `;
    return;
  }

  reviewsList.innerHTML = reviews.map((review, idx) => {
    const stars = '⭐'.repeat(review.rating);
    return `
      <div class="review-card" style="animation-delay: ${idx * 0.1}s">
        <div class="review-header">
          <span class="review-name">${escapeHtml(review.name)}</span>
          <span class="review-date">${review.date}</span>
        </div>
        <div class="review-stars">${stars}</div>
        ${review.comment ? `<p class="review-comment">${escapeHtml(review.comment)}</p>` : ''}
        <button type="button" class="review-delete-btn" onclick="handleDeleteReview(${review.id})" aria-label="Eliminar esta reseña">🗑️ Eliminar</button>
      </div>
    `;
  }).join('');
}

function handleDeleteReview(reviewId) {
  if (!confirm('¿Seguro que quieres eliminar esta reseña? Esta acción no se puede deshacer.')) return;
  deleteReviewFromStorage(reviewId);
  displayReviews();
  showToast('Reseña eliminada', 'info');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
