// admin.js — Panel de Administración Mi Ranchito

/* ── CONSTANTS ── */
const ADMIN_EMAIL = 'nicolastrujillorodriguez7@gmail.com';
const ADMIN_PASS  = 'admin1234';
const LS_KEY      = 'mr_admin_menu';
const SS_KEY      = 'adminLoggedIn';

/* ── RUNTIME STATE ── */
let adminMenu   = {};   // working copy of the menu (all sections)
let currentSection = 'asadero';

/* ══════════════════════════════════════════════
   AUTH
══════════════════════════════════════════════ */
function checkLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPass').value;
  const errEl = document.getElementById('loginError');

  if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
    sessionStorage.setItem(SS_KEY, 'true');
    errEl.style.display = 'none';
    showAdminPanel();
  } else {
    errEl.style.display = 'block';
  }
}

function doLogout() {
  if (!confirm('¿Cerrar sesión del panel de administración?')) return;
  sessionStorage.removeItem(SS_KEY);
  document.getElementById('adminPanel').style.display   = 'none';
  document.getElementById('loginScreen').style.display  = 'flex';
}

function showAdminPanel() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminPanel').style.display  = 'block';
  loadProducts();
  renderAllTables();
}

/* ══════════════════════════════════════════════
   PRODUCT STORAGE
══════════════════════════════════════════════ */
function loadProducts() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge: use admin overrides where they exist, original data.js otherwise
      ['asadero', 'panaderia', 'restaurante', 'bebidas'].forEach(sec => {
        adminMenu[sec] = parsed[sec]
          ? parsed[sec]
          : JSON.parse(JSON.stringify(MENU[sec] || []));
      });
    } else {
      // Deep-copy originals
      ['asadero', 'panaderia', 'restaurante', 'bebidas'].forEach(sec => {
        adminMenu[sec] = JSON.parse(JSON.stringify(MENU[sec] || []));
      });
    }
  } catch (err) {
    console.error('loadProducts error:', err);
    ['asadero', 'panaderia', 'restaurante', 'bebidas'].forEach(sec => {
      adminMenu[sec] = JSON.parse(JSON.stringify(MENU[sec] || []));
    });
  }
}

function saveProducts() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(adminMenu));
  } catch (err) {
    console.error('saveProducts error:', err);
    showToast('Error al guardar en localStorage', 'error');
  }
}

/* ══════════════════════════════════════════════
   RENDER TABLES
══════════════════════════════════════════════ */
function renderAllTables() {
  ['asadero', 'panaderia', 'restaurante', 'bebidas'].forEach(sec => {
    renderAdminTable(sec);
  });
}

function renderAdminTable(section) {
  const tbody = document.getElementById('tbody-' + section);
  if (!tbody) return;

  const items = adminMenu[section] || [];
  tbody.innerHTML = '';

  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-table">No hay productos en esta sección. Agrega uno con el botón "➕ Agregar Producto".</td></tr>`;
    return;
  }

  items.forEach(item => {
    const priceDisplay = formatAdminPrice(item);
    const badgeHTML = item.badge
      ? `<span class="badge-pill">${escapeHtml(item.badge)}</span>`
      : '<span style="color:#bbb;font-size:0.8rem;">—</span>';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="td-emoji">${item.emoji || '📦'}</td>
      <td class="td-name">${escapeHtml(item.name)}</td>
      <td class="td-price">${priceDisplay}</td>
      <td>${escapeHtml(item.category || '—')}</td>
      <td>${badgeHTML}</td>
      <td>
        <div class="td-actions">
          <button class="btn-edit" onclick="openProductModal('${section}', '${item.id}')">✏️ Editar</button>
          <button class="btn-del"  onclick="deleteProduct('${section}', '${item.id}')">🗑️ Eliminar</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function formatAdminPrice(item) {
  if (item.priceOptions && item.priceOptions.length > 0) {
    const first = item.priceOptions[0];
    const minPrice = (typeof first === 'object') ? first.price : first;
    return `Desde $${minPrice.toLocaleString('es-CO')}`;
  }
  if (Number.isFinite(item.price) && item.price > 0) {
    return `$${item.price.toLocaleString('es-CO')}`;
  }
  return 'Por confirmar';
}

/* ══════════════════════════════════════════════
   TABS
══════════════════════════════════════════════ */
function switchTab(section) {
  currentSection = section;

  // Toggle tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === section);
  });

  // Toggle section panels
  document.querySelectorAll('.section-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === 'panel-' + section);
  });
}

/* ══════════════════════════════════════════════
   MODAL OPEN / CLOSE
══════════════════════════════════════════════ */
function openProductModal(section, productId) {
  const overlay = document.getElementById('productModalOverlay');
  const titleEl = document.getElementById('modalTitle');
  const hasMeatRow = document.getElementById('hasMeatRow');

  // Show/hide hasMeat only for asadero
  hasMeatRow.style.display = (section === 'asadero') ? 'flex' : 'none';

  if (productId) {
    // EDIT mode
    const item = (adminMenu[section] || []).find(p => p.id === productId);
    if (!item) { showToast('Producto no encontrado', 'error'); return; }

    titleEl.textContent = '✏️ Editar Producto';
    document.getElementById('fSection').value   = section;
    document.getElementById('fProductId').value = productId;
    document.getElementById('fEmoji').value     = item.emoji || '';
    document.getElementById('fName').value      = item.name || '';
    document.getElementById('fDesc').value      = item.desc || '';
    document.getElementById('fPrice').value     = item.price || 0;
    document.getElementById('fCategory').value  = item.category || '';
    document.getElementById('fBadge').value     = item.badge || '';
    document.getElementById('fTags').value      = (item.tags || []).join(', ');
    document.getElementById('fImg').value       = item.img || '';
    document.getElementById('fHasMeat').checked = !!item.hasMeat;

    if (item.priceOptions && item.priceOptions.length > 0) {
      document.getElementById('fPriceOptions').value = JSON.stringify(item.priceOptions, null, 2);
    } else {
      document.getElementById('fPriceOptions').value = '';
    }
  } else {
    // ADD mode
    titleEl.textContent = '➕ Agregar Producto';
    document.getElementById('fSection').value   = section;
    document.getElementById('fProductId').value = '';
    document.getElementById('fEmoji').value     = '';
    document.getElementById('fName').value      = '';
    document.getElementById('fDesc').value      = '';
    document.getElementById('fPrice').value     = '';
    document.getElementById('fCategory').value  = '';
    document.getElementById('fBadge').value     = '';
    document.getElementById('fTags').value      = '';
    document.getElementById('fImg').value       = '';
    document.getElementById('fPriceOptions').value = '';
    document.getElementById('fHasMeat').checked = false;
  }

  overlay.classList.add('open');
}

function closeProductModal() {
  document.getElementById('productModalOverlay').classList.remove('open');
}

// Close on backdrop click
document.getElementById('productModalOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeProductModal();
});

/* ══════════════════════════════════════════════
   FORM SUBMIT → SAVE PRODUCT
══════════════════════════════════════════════ */
function handleFormSubmit(e) {
  e.preventDefault();

  const section   = document.getElementById('fSection').value;
  const productId = document.getElementById('fProductId').value || null;

  const formData = {
    emoji:    document.getElementById('fEmoji').value.trim(),
    name:     document.getElementById('fName').value.trim(),
    desc:     document.getElementById('fDesc').value.trim(),
    price:    parseFloat(document.getElementById('fPrice').value) || 0,
    category: document.getElementById('fCategory').value.trim(),
    badge:    document.getElementById('fBadge').value.trim() || null,
    img:      document.getElementById('fImg').value.trim() || '',
    hasMeat:  document.getElementById('fHasMeat').checked,
    tags:     document.getElementById('fTags').value
                .split(',')
                .map(t => t.trim())
                .filter(t => t.length > 0),
    priceOptions: parsePriceOptions(document.getElementById('fPriceOptions').value.trim())
  };

  saveProduct(section, productId, formData);
}

function parsePriceOptions(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch (_) {
    showToast('Opciones de precio: JSON inválido. Se ignorará.', 'error');
  }
  return null;
}

function saveProduct(section, productId, formData) {
  if (!adminMenu[section]) adminMenu[section] = [];

  if (productId) {
    // UPDATE existing
    const idx = adminMenu[section].findIndex(p => p.id === productId);
    if (idx === -1) { showToast('Producto no encontrado para actualizar', 'error'); return; }

    const existing = adminMenu[section][idx];
    adminMenu[section][idx] = {
      ...existing,
      emoji:    formData.emoji    || existing.emoji,
      name:     formData.name,
      desc:     formData.desc,
      price:    formData.price,
      category: formData.category,
      badge:    formData.badge,
      img:      formData.img,
      tags:     formData.tags,
      hasMeat:  formData.hasMeat
    };

    if (formData.priceOptions) {
      adminMenu[section][idx].priceOptions = formData.priceOptions;
    } else {
      delete adminMenu[section][idx].priceOptions;
    }

    showToast('✅ Producto actualizado correctamente', 'success');
  } else {
    // CREATE new
    const newId = section.charAt(0) + '_' + Date.now();
    const newProduct = {
      id:       newId,
      emoji:    formData.emoji || '📦',
      name:     formData.name,
      desc:     formData.desc,
      price:    formData.price,
      category: formData.category,
      badge:    formData.badge,
      img:      formData.img,
      tags:     formData.tags,
      hasMeat:  formData.hasMeat
    };
    if (formData.priceOptions) {
      newProduct.priceOptions = formData.priceOptions;
    }
    adminMenu[section].push(newProduct);
    showToast('✅ Producto agregado correctamente', 'success');
  }

  saveProducts();
  renderAdminTable(section);
  closeProductModal();
}

/* ══════════════════════════════════════════════
   DELETE PRODUCT
══════════════════════════════════════════════ */
function deleteProduct(section, productId) {
  const item = (adminMenu[section] || []).find(p => p.id === productId);
  if (!item) return;
  if (!confirm(`¿Eliminar "${item.name}"? Esta acción no se puede deshacer.`)) return;

  adminMenu[section] = adminMenu[section].filter(p => p.id !== productId);
  saveProducts();
  renderAdminTable(section);
  showToast(`🗑️ "${item.name}" eliminado`, 'success');
}

/* ══════════════════════════════════════════════
   RESET SECTION
══════════════════════════════════════════════ */
function resetSection(section) {
  const label = { asadero: 'Asadero', panaderia: 'Panadería', restaurante: 'Restaurante', bebidas: 'Bebidas' }[section] || section;
  if (!confirm(`¿Restaurar ${label} a los productos originales?\n\nSe perderán todos los cambios realizados en esta sección.`)) return;

  adminMenu[section] = JSON.parse(JSON.stringify(MENU[section] || []));
  saveProducts();
  renderAdminTable(section);
  showToast(`🔄 ${label} restaurado a los datos originales`, 'success');
}

/* ══════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════ */
function showToast(msg, type) {
  const wrap = document.getElementById('toastWrap');
  if (!wrap) return;
  const t = document.createElement('div');
  t.className = 'toast ' + (type || '');
  t.textContent = msg;
  wrap.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.4s'; }, 2800);
  setTimeout(() => { if (t.parentNode) t.parentNode.removeChild(t); }, 3300);
}

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ══════════════════════════════════════════════
   INIT — check session on page load
══════════════════════════════════════════════ */
(function init() {
  if (sessionStorage.getItem(SS_KEY) === 'true') {
    showAdminPanel();
  }
  // Keyboard: close modal on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeProductModal();
  });
})();
