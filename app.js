/* Finanzas de Wendy
   Vanilla JS, sin dependencias. Datos en localStorage. Funciona sin internet.
   Iconos: trazos estilo Lucide (licencia ISC), en línea para no depender de nada externo. */
(() => {
  'use strict';

  const STORE_KEY = 'wendy-finanzas:v1';
  const THEME_KEY = 'wendy-finanzas:tema';
  const MONEDAS = ['MXN', 'USD'];
  const TIPOS = ['ingreso', 'gasto', 'ahorro', 'conversion'];

  /* ---------- Iconos (cuerpo SVG, viewBox 24, trazo 2) ---------- */
  const ICON = {
    wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    piggy: '<path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z"/><path d="M2 9v1c0 1.1.9 2 2 2h1"/><path d="M16 11h.01"/>',
    swap: '<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',
    repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/>',
    pencil: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    arrowIn: '<path d="M17 7 7 17"/><path d="M17 17H7V7"/>',
    chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    taxi: '<path d="M10 2h4"/><path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.65 5H8.4a2 2 0 0 0-1.9 1.26L5 10 3 8"/><path d="M7 14h.01"/><path d="M17 14h.01"/><rect width="18" height="8" x="3" y="10" rx="2"/><path d="M5 18v2"/><path d="M19 18v2"/>',
    shirt: '<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>',
    bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .71-1.53l7-6a2 2 0 0 1 2.58 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    fish: '<path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/><path d="M18 12v.5"/><path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33"/>',
    siren: '<path d="M7 18v-6a5 5 0 1 1 10 0v6"/><path d="M5 21a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1z"/><path d="M21 12h1"/><path d="M2 12h1"/><path d="M12 2v1"/><path d="m4.93 4.93.7.7"/><path d="m19.07 4.93-.7.7"/>',
    milestone: '<path d="M12 13v8"/><path d="M12 3v3"/><path d="M4 6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h13a2 2 0 0 0 1.15-.37l3.43-2.32a1 1 0 0 0 0-1.63l-3.43-2.32A2 2 0 0 0 17 6z"/>',
    briefcase: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
    ellipsis: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    phone: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>'
  };

  /* Respaldo por si data/config.json no se puede leer (por ejemplo abriendo el archivo sin servidor) */
  const CONFIG_RESPALDO = {
    tasaCambioDefault: 18.5,
    categorias: [
      { id: 'comida', nombre: 'Comida', icono: 'utensils' },
      { id: 'taxi', nombre: 'Taxi', icono: 'taxi' },
      { id: 'ropa', nombre: 'Ropa', icono: 'shirt' },
      { id: 'tienda', nombre: 'Tienda', icono: 'bag' },
      { id: 'casa', nombre: 'Casa', icono: 'home' },
      { id: 'pecera', nombre: 'Pecera', icono: 'fish' },
      { id: 'emergencia', nombre: 'Emergencia', icono: 'siren' },
      { id: 'cruce', nombre: 'Cruce', icono: 'milestone' },
      { id: 'trabajo', nombre: 'Trabajo', icono: 'briefcase' },
      { id: 'otros', nombre: 'Otros', icono: 'ellipsis' },
      { id: 'telefono', nombre: 'Teléfono', icono: 'phone' }
    ]
  };

  let config = CONFIG_RESPALDO;
  const state = { movimientos: [], tasa: 18.5 };
  const ui = {
    tab: 'saldo',
    editId: null,
    analisis: 'MXN',
    form: null,
    refs: null
  };

  /* ---------- Utilidades DOM ---------- */
  const $ = (sel) => document.querySelector(sel);

  function h(tag, props, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return el;
  }

  function icon(name, size = 20) {
    const s = document.createElement('span');
    s.className = 'ico';
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      (ICON[name] || ICON.ellipsis) + '</svg>';
    return s;
  }

  /* ---------- Dinero (se calcula en centavos para evitar errores de decimales) ---------- */
  const toCents = (n) => Math.round(n * 100);

  function fmt(cents) {
    const neg = cents < 0;
    const txt = (Math.abs(cents) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return (neg ? '-' : '') + '$' + txt;
  }

  function parseNum(str, decimales) {
    let s = String(str == null ? '' : str).trim().replace(/\s/g, '').replace(/^\$/, '');
    if (!s) return NaN;
    if (/^\d{1,3}(,\d{3})+$/.test(s)) s = s.replace(/,/g, '');
    else if (s.includes(',') && s.includes('.')) s = s.replace(/,/g, '');
    else if (s.includes(',')) s = s.replace(',', '.');
    if (!/^(\d+\.?\d*|\.\d+)$/.test(s)) return NaN;
    const f = Math.pow(10, decimales);
    return Math.round(parseFloat(s) * f) / f;
  }

  function hoy() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function fechaCorta(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }).replace('.', '');
  }

  function nombreMes() {
    const t = new Date().toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  /* ---------- Datos ---------- */
  function limpiarMov(m) {
    if (!m || typeof m !== 'object') return null;
    if (!TIPOS.includes(m.tipo) || !MONEDAS.includes(m.moneda)) return null;
    const monto = Number(m.monto);
    if (!isFinite(monto) || monto <= 0) return null;
    if (typeof m.fecha !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(m.fecha)) return null;
    const out = {
      id: typeof m.id === 'string' && m.id ? m.id : uid(),
      tipo: m.tipo,
      moneda: m.moneda,
      monto: Math.round(monto * 100) / 100,
      categoria: typeof m.categoria === 'string' ? m.categoria.slice(0, 40) : '',
      concepto: typeof m.concepto === 'string' ? m.concepto.slice(0, 80) : '',
      fecha: m.fecha,
      creado: isFinite(Number(m.creado)) ? Number(m.creado) : Date.now()
    };
    if (m.tipo === 'conversion') {
      const t = Number(m.tasaCambio);
      if (!isFinite(t) || t <= 0) return null;
      out.tasaCambio = t;
    }
    return out;
  }

  function cargar() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        state.movimientos = (Array.isArray(d.movimientos) ? d.movimientos : []).map(limpiarMov).filter(Boolean);
        const t = Number(d.tasa);
        if (isFinite(t) && t > 0) state.tasa = t;
        return true;
      }
    } catch (e) { /* datos dañados: se empieza limpio */ }
    return false;
  }

  function guardar() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ movimientos: state.movimientos, tasa: state.tasa }));
    } catch (e) {
      toast('No se pudo guardar. Revisa el espacio o los permisos del navegador.');
    }
  }

  async function cargarConfig() {
    try {
      const r = await fetch('data/config.json', { cache: 'no-cache' });
      if (!r.ok) throw new Error('config');
      const c = await r.json();
      if (Array.isArray(c.categorias) && c.categorias.length) {
        config = {
          tasaCambioDefault: Number(c.tasaCambioDefault) > 0 ? Number(c.tasaCambioDefault) : 18.5,
          categorias: c.categorias.filter((x) => x && typeof x.nombre === 'string')
        };
      }
    } catch (e) { config = CONFIG_RESPALDO; }
  }

  const catPorNombre = (n) => config.categorias.find((c) => c.nombre === n);

  /* ---------- Cálculos ---------- */
  function convDestino(m) {
    const c = toCents(m.monto);
    if (m.moneda === 'USD') return { moneda: 'MXN', cents: Math.round(c * m.tasaCambio) };
    return { moneda: 'USD', cents: Math.round(c / m.tasaCambio) };
  }

  function calcular(excluirId) {
    const mes = hoy().slice(0, 7);
    const r = {
      saldo: { MXN: 0, USD: 0 },
      ahorro: { MXN: 0, USD: 0 },
      mesIng: { MXN: 0, USD: 0 },
      mesGas: { MXN: 0, USD: 0 }
    };
    for (const m of state.movimientos) {
      if (m.id === excluirId) continue;
      const c = toCents(m.monto);
      const enMes = m.fecha.slice(0, 7) === mes;
      if (m.tipo === 'ingreso') {
        r.saldo[m.moneda] += c;
        if (enMes) r.mesIng[m.moneda] += c;
      } else if (m.tipo === 'gasto') {
        r.saldo[m.moneda] -= c;
        if (enMes) r.mesGas[m.moneda] += c;
      } else if (m.tipo === 'ahorro') {
        r.saldo[m.moneda] -= c;
        r.ahorro[m.moneda] += c;
      } else if (m.tipo === 'conversion') {
        r.saldo[m.moneda] -= c;
        const d = convDestino(m);
        r.saldo[d.moneda] += d.cents;
      }
    }
    return r;
  }

  function gastosPorCategoria(scope) {
    const mes = hoy().slice(0, 7);
    const mapa = new Map();
    let total = 0;
    for (const m of state.movimientos) {
      if (m.tipo !== 'gasto' || m.fecha.slice(0, 7) !== mes) continue;
      let c = toCents(m.monto);
      if (scope === 'MXN' && m.moneda !== 'MXN') continue;
      if (scope === 'USD' && m.moneda !== 'USD') continue;
      if (scope === 'ALL' && m.moneda === 'USD') c = Math.round(c * state.tasa);
      const k = m.categoria || 'Otros';
      mapa.set(k, (mapa.get(k) || 0) + c);
      total += c;
    }
    const filas = [...mapa.entries()].map(([nombre, cents]) => ({ nombre, cents })).sort((a, b) => b.cents - a.cents);
    return { filas, total };
  }

  /* ---------- Tema ---------- */
  function temaActual() { return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }

  function aplicarTema(t, persistir) {
    document.documentElement.setAttribute('data-theme', t);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#121212' : '#F6F7F9');
    if (persistir) { try { localStorage.setItem(THEME_KEY, t); } catch (e) { /* sin permiso de almacenamiento */ } }
    const b = $('#btnTema');
    b.replaceChildren(icon(t === 'dark' ? 'sun' : 'moon', 20));
    b.setAttribute('aria-label', t === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
  }

  /* ---------- Aviso y hoja ---------- */
  let toastTimer = null;

  function toast(msg, accion) {
    const t = $('#toast');
    const partes = [h('span', { text: msg })];
    if (accion) partes.push(h('button', { class: 'toast-btn', type: 'button', text: accion.label, onclick: () => { accion.fn(); ocultarToast(); } }));
    t.replaceChildren(...partes);
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(ocultarToast, accion ? 6000 : 2600);
  }

  function ocultarToast() { $('#toast').hidden = true; }

  function abrirHoja(nodo) {
    const sheet = $('#sheet');
    const panel = h('div', { class: 'sheet-panel', role: 'dialog', 'aria-modal': 'true', tabindex: '-1' },
      h('div', { class: 'grabber' }), nodo);
    sheet.replaceChildren(h('div', { class: 'sheet-backdrop', onclick: cerrarHoja }), panel);
    sheet.hidden = false;
    document.body.classList.add('no-scroll');
    panel.focus();
  }

  function cerrarHoja() {
    const sheet = $('#sheet');
    sheet.hidden = true;
    sheet.replaceChildren();
    document.body.classList.remove('no-scroll');
  }

  /* ---------- Navegación ---------- */
  const TABS = [
    { id: 'saldo', titulo: 'Saldo', icono: 'wallet' },
    { id: 'ahorro', titulo: 'Ahorro', icono: 'piggy' },
    { id: 'movimientos', titulo: 'Movimientos', icono: 'swap' }
  ];

  function construirNav() {
    $('#tabbar').replaceChildren(...TABS.map((t) =>
      h('button', {
        class: 'tab', type: 'button', 'data-tab': t.id,
        onclick: () => { ui.tab = t.id; window.scrollTo(0, 0); render(); }
      }, icon(t.icono, 24), h('span', { text: t.titulo }))
    ));
  }

  function render() {
    const tab = TABS.find((t) => t.id === ui.tab);
    $('#titulo').textContent = tab.titulo;
    document.querySelectorAll('.tab').forEach((b) => {
      if (b.dataset.tab === ui.tab) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
    ui.refs = null;
    const view = $('#view');
    if (ui.tab === 'saldo') renderSaldo(view);
    else if (ui.tab === 'ahorro') renderAhorro(view);
    else renderMovimientos(view);
  }

  function refrescar() {
    if (ui.tab === 'movimientos' && ui.refs) {
      renderLista();
      renderAnalisis();
    } else {
      render();
    }
  }

  /* ---------- Pantalla: Saldo ---------- */
  function renderSaldo(view) {
    const r = calcular();

    const tarjeta = (cur, nombre) => h('section', { class: 'card' },
      h('div', { class: 'balance-top' },
        h('div', { class: 'who' }, h('span', { class: 'badge' }, icon('wallet', 20)), h('span', { class: 'label', text: nombre })),
        h('span', { class: 'chip', text: cur })),
      h('p', { class: 'amount' + (r.saldo[cur] < 0 ? ' neg' : ''), 'aria-label': 'Saldo disponible en ' + cur }, fmt(r.saldo[cur])),
      h('p', { class: 'small-text muted', style: 'margin-top:6px', text: 'Saldo disponible' })
    );

    // % gastado del mes: ingresos y gastos de ambas monedas expresados en MXN al tipo de cambio guardado
    const ing = r.mesIng.MXN + Math.round(r.mesIng.USD * state.tasa);
    const gas = r.mesGas.MXN + Math.round(r.mesGas.USD * state.tasa);
    const pct = ing > 0 ? (gas / ing) * 100 : (gas > 0 ? 100 : 0);
    const clase = pct >= 100 ? 'bad' : pct >= 75 ? 'warn' : '';
    const usaUSD = r.mesIng.USD > 0 || r.mesGas.USD > 0;

    const tarjetaPct = h('section', { class: 'card' },
      h('div', { class: 'card-head' },
        h('h2', { class: 'card-title', text: 'Gastado este mes' }),
        h('span', { class: 'label', text: nombreMes() })),
      h('div', { class: 'pct' },
        h('strong', { text: Math.round(pct) + '%' }),
        h('span', { class: 'label', text: ing > 0 ? 'de tus ingresos' : (gas > 0 ? 'sin ingresos este mes' : 'sin movimientos') })),
      h('div', { class: 'bar ' + clase, role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(Math.min(100, Math.round(pct))) },
        h('i', { style: 'width:' + Math.min(100, pct).toFixed(1) + '%' })),
      h('div', { class: 'pct-meta' },
        h('span', {}, h('span', { class: 'muted' }, 'Gastos '), h('b', { text: fmt(gas) })),
        h('span', {}, h('span', { class: 'muted' }, 'Ingresos '), h('b', { text: fmt(ing) }))),
      usaUSD && h('p', { class: 'small-text muted', style: 'margin-top:10px', text: 'En pesos: los dólares se suman a $' + state.tasa.toFixed(2) + ' por dólar.' })
    );

    const inputArchivo = h('input', {
      type: 'file', accept: '.json,application/json', hidden: true,
      onchange: (e) => { const f = e.target.files && e.target.files[0]; e.target.value = ''; if (f) importar(f); }
    });

    const respaldo = h('section', { class: 'card' },
      h('div', { class: 'card-head' }, h('h2', { class: 'card-title', text: 'Respaldo' })),
      h('p', { class: 'small-text muted', style: 'margin-bottom:12px', text: 'Guarda un archivo con todos tus movimientos o recupéralo en otro teléfono.' }),
      h('div', { class: 'btn-row' },
        h('button', { class: 'btn btn-secondary', type: 'button', onclick: exportar }, icon('download', 18), 'Exportar'),
        h('button', { class: 'btn btn-secondary', type: 'button', onclick: () => inputArchivo.click() }, icon('upload', 18), 'Importar')),
      inputArchivo
    );

    view.replaceChildren(
      tarjeta('MXN', 'Pesos mexicanos'),
      tarjeta('USD', 'Dólares'),
      h('button', { class: 'btn btn-primary btn-block', type: 'button', onclick: () => abrirConversion(null) }, icon('repeat', 20), 'Convertir / Ferear'),
      tarjetaPct,
      respaldo
    );
  }

  /* ---------- Pantalla: Ahorro ---------- */
  function renderAhorro(view) {
    const r = calcular();
    const tarjeta = (cur, nombre) => h('section', { class: 'card' },
      h('div', { class: 'balance-top' },
        h('div', { class: 'who' }, h('span', { class: 'badge' }, icon('piggy', 20)), h('span', { class: 'label', text: nombre })),
        h('span', { class: 'chip', text: cur })),
      h('p', { class: 'amount', 'aria-label': 'Ahorro en ' + cur }, fmt(r.ahorro[cur])),
      h('p', { class: 'small-text muted', style: 'margin-top:6px', text: 'Ahorrado' })
    );
    view.replaceChildren(tarjeta('MXN', 'Ahorro en pesos'), tarjeta('USD', 'Ahorro en dólares'));
  }

  /* ---------- Pantalla: Movimientos ---------- */
  function formNuevo() {
    return { tipo: 'gasto', moneda: 'MXN', categoria: '', monto: '', concepto: '', fecha: hoy(), error: '' };
  }

  function renderMovimientos(view) {
    if (!ui.form) ui.form = formNuevo();
    const formWrap = h('section', { class: 'card', id: 'formWrap' });
    const lista = h('section', { class: 'card' });
    const analisis = h('section', { class: 'card' });
    ui.refs = { formWrap, lista, analisis };
    view.replaceChildren(formWrap, lista, analisis);
    renderForm();
    renderLista();
    renderAnalisis();
  }

  function seg(opciones, actual, onPick, etiqueta) {
    return h('div', { class: 'seg', role: 'group', 'aria-label': etiqueta },
      opciones.map((o) => h('button', {
        type: 'button', 'aria-pressed': String(o.valor === actual),
        onclick: () => onPick(o.valor)
      }, o.texto)));
  }

  function renderForm() {
    const f = ui.form;
    const editando = !!ui.editId;
    const wrap = ui.refs.formWrap;

    const campoCategoria = f.tipo === 'gasto' && h('div', { class: 'field' },
      h('span', { class: 'label', text: 'Categoría' }),
      h('div', { class: 'cats' }, config.categorias.map((c) => h('button', {
        class: 'cat', type: 'button', 'aria-pressed': String(f.categoria === c.nombre),
        onclick: () => { f.categoria = c.nombre; f.error = ''; renderForm(); }
      }, icon(c.icono, 22), h('span', { class: 't', text: c.nombre })))));

    const form = h('form', {
      class: 'form', novalidate: true,
      onsubmit: (e) => { e.preventDefault(); guardarForm(); }
    },
      h('div', { class: 'field' }, h('span', { class: 'label', text: 'Tipo' }),
        seg([{ valor: 'ingreso', texto: 'Ingreso' }, { valor: 'gasto', texto: 'Gasto' }, { valor: 'ahorro', texto: 'Ahorro' }],
          f.tipo, (v) => { f.tipo = v; f.error = ''; renderForm(); }, 'Tipo de movimiento')),
      campoCategoria,
      h('div', { class: 'two' },
        h('div', { class: 'field' },
          h('label', { for: 'fMonto', text: 'Monto' }),
          h('input', {
            id: 'fMonto', class: 'input money', type: 'text', inputmode: 'decimal', autocomplete: 'off',
            placeholder: '0.00', value: f.monto, oninput: (e) => { f.monto = e.target.value; }
          })),
        h('div', { class: 'field' }, h('span', { class: 'label', text: 'Moneda' }),
          seg(MONEDAS.map((m) => ({ valor: m, texto: m })), f.moneda, (v) => { f.moneda = v; renderForm(); }, 'Moneda'))),
      h('div', { class: 'field' },
        h('label', { for: 'fConcepto', text: 'Concepto (opcional)' }),
        h('input', {
          id: 'fConcepto', class: 'input', type: 'text', maxlength: '60', autocomplete: 'off',
          placeholder: 'Ej. Despensa', value: f.concepto, oninput: (e) => { f.concepto = e.target.value; }
        })),
      h('div', { class: 'field' },
        h('label', { for: 'fFecha', text: 'Fecha' }),
        h('input', {
          id: 'fFecha', class: 'input', type: 'date', value: f.fecha,
          oninput: (e) => { f.fecha = e.target.value; }
        })),
      f.error && h('p', { class: 'error', role: 'alert', text: f.error }),
      h('button', { class: 'btn btn-primary btn-block', type: 'submit' },
        icon(editando ? 'pencil' : 'plus', 18), editando ? 'Guardar cambios' : 'Agregar movimiento'),
      editando && h('button', { class: 'btn btn-ghost btn-block', type: 'button', onclick: cancelarEdicion }, 'Cancelar edición')
    );

    wrap.replaceChildren(
      h('div', { class: 'card-head' }, h('h2', { class: 'card-title', text: editando ? 'Editar movimiento' : 'Nuevo movimiento' })),
      form
    );
  }

  function cancelarEdicion() {
    ui.editId = null;
    ui.form = formNuevo();
    renderForm();
  }

  function guardarForm() {
    const f = ui.form;
    const monto = parseNum(f.monto, 2);
    let err = '';
    if (!(monto > 0)) err = 'Escribe un monto mayor a 0.';
    else if (f.tipo === 'gasto' && !f.categoria) err = 'Elige una categoría para el gasto.';
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(f.fecha)) err = 'Elige una fecha válida.';
    if (err) { f.error = err; renderForm(); return; }

    const base = {
      tipo: f.tipo,
      moneda: f.moneda,
      monto,
      categoria: f.tipo === 'gasto' ? f.categoria : '',
      concepto: f.concepto.trim(),
      fecha: f.fecha
    };

    if (ui.editId) {
      const i = state.movimientos.findIndex((m) => m.id === ui.editId);
      if (i >= 0) state.movimientos[i] = Object.assign({}, state.movimientos[i], base);
      ui.editId = null;
    } else {
      state.movimientos.push(Object.assign({ id: uid(), creado: Date.now() }, base));
    }
    guardar();
    ui.form = Object.assign(formNuevo(), { tipo: f.tipo, moneda: f.moneda });
    renderForm();
    renderLista();
    renderAnalisis();
    toast('Movimiento guardado');
  }

  function ordenados() {
    return state.movimientos.slice().sort((a, b) =>
      a.fecha === b.fecha ? b.creado - a.creado : (a.fecha < b.fecha ? 1 : -1));
  }

  function filaMov(m) {
    const cat = catPorNombre(m.categoria);
    const c = toCents(m.monto);
    let ic = 'ellipsis', titulo = '', clase = '', valor = '', valor2 = '', sub = '';
    const base = (m.concepto ? m.concepto + ' · ' : '') + fechaCorta(m.fecha);

    if (m.tipo === 'gasto') {
      ic = cat ? cat.icono : 'ellipsis'; titulo = m.categoria || 'Gasto'; clase = 'out';
      valor = '-' + fmt(c) + ' ' + m.moneda; sub = base;
    } else if (m.tipo === 'ingreso') {
      ic = 'arrowIn'; titulo = 'Ingreso'; clase = 'in';
      valor = '+' + fmt(c) + ' ' + m.moneda; sub = base;
    } else if (m.tipo === 'ahorro') {
      ic = 'piggy'; titulo = 'Ahorro'; clase = '';
      valor = fmt(c) + ' ' + m.moneda; sub = base;
    } else {
      const d = convDestino(m);
      ic = 'repeat'; titulo = 'Conversión'; clase = '';
      valor = '-' + fmt(c) + ' ' + m.moneda; valor2 = '+' + fmt(d.cents) + ' ' + d.moneda;
      sub = fechaCorta(m.fecha) + ' · tasa ' + m.tasaCambio.toFixed(2);
    }

    return h('div', { class: 'row' },
      h('span', { class: 'badge ' + clase }, icon(ic, 20)),
      h('div', { class: 'txt' }, h('div', { class: 'ttl', text: titulo }), h('div', { class: 'sub', text: sub })),
      h('div', { class: 'end' },
        h('div', {}, h('div', { class: 'val' + (clase === 'in' ? ' pos' : ''), text: valor }), valor2 && h('div', { class: 'val2', text: valor2 })),
        h('div', { class: 'acts' },
          h('button', { class: 'icon-btn small', type: 'button', 'aria-label': 'Editar movimiento', onclick: () => editarMov(m.id) }, icon('pencil', 16)),
          h('button', { class: 'icon-btn small danger', type: 'button', 'aria-label': 'Borrar movimiento', onclick: () => borrarMov(m.id) }, icon('trash', 16))))
    );
  }

  function renderLista() {
    const ult = ordenados().slice(0, 5);
    ui.refs.lista.replaceChildren(
      h('div', { class: 'card-head' }, h('h2', { class: 'card-title', text: 'Últimos movimientos' })),
      ult.length
        ? h('div', { class: 'list' }, ult.map(filaMov))
        : h('p', { class: 'empty', text: 'Todavía no hay movimientos. Agrega el primero arriba.' })
    );
  }

  function editarMov(id) {
    const m = state.movimientos.find((x) => x.id === id);
    if (!m) return;
    if (m.tipo === 'conversion') { abrirConversion(m); return; }
    ui.editId = id;
    ui.form = {
      tipo: m.tipo, moneda: m.moneda, categoria: m.categoria || '',
      monto: String(m.monto), concepto: m.concepto || '', fecha: m.fecha, error: ''
    };
    renderForm();
    ui.refs.formWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function borrarMov(id) {
    const i = state.movimientos.findIndex((m) => m.id === id);
    if (i < 0) return;
    const [quitado] = state.movimientos.splice(i, 1);
    if (ui.editId === id) { ui.editId = null; ui.form = formNuevo(); if (ui.refs) renderForm(); }
    guardar();
    refrescar();
    toast('Movimiento eliminado', {
      label: 'Deshacer',
      fn: () => { state.movimientos.push(quitado); guardar(); refrescar(); }
    });
  }

  function renderAnalisis() {
    const scope = ui.analisis;
    const { filas, total } = gastosPorCategoria(scope);
    const cur = scope === 'USD' ? 'USD' : 'MXN';
    const max = filas.length ? filas[0].cents : 0;

    let resumen = null;
    if (filas.length) {
      const top = filas[0];
      resumen = h('p', { class: 'insight' },
        'Este mes lo que más se fue: ', h('b', { text: top.nombre }),
        ' (' + Math.round((top.cents / total) * 100) + '% de tus gastos).');
    }

    ui.refs.analisis.replaceChildren(
      h('div', { class: 'card-head' },
        h('h2', { class: 'card-title', text: '¿A dónde se fue más?' }),
        h('span', { class: 'label', text: nombreMes() })),
      seg([{ valor: 'MXN', texto: 'MXN' }, { valor: 'USD', texto: 'USD' }, { valor: 'ALL', texto: 'Todo (MXN)' }],
        scope, (v) => { ui.analisis = v; renderAnalisis(); }, 'Moneda del análisis'),
      h('div', { style: 'height:14px' }),
      filas.length
        ? h('div', {},
          resumen,
          h('div', { class: 'bars' }, filas.map((fila, i) => {
            const c = catPorNombre(fila.nombre);
            return h('div', { class: 'brow' + (i === 0 ? ' top' : '') },
              h('div', { class: 'brow-top' },
                h('span', { class: 'nm' }, icon(c ? c.icono : 'ellipsis', 18), h('span', { text: fila.nombre })),
                h('span', { class: 'vl', text: fmt(fila.cents) + ' ' + cur + ' · ' + Math.round((fila.cents / total) * 100) + '%' })),
              h('div', { class: 'bar' }, h('i', { style: 'width:' + Math.max(3, (fila.cents / max) * 100).toFixed(1) + '%' })));
          })),
          scope === 'ALL' && h('p', { class: 'small-text muted', style: 'margin-top:12px', text: 'Los dólares se convierten a $' + state.tasa.toFixed(2) + ' por dólar.' }))
        : h('p', { class: 'empty', text: 'Aún no hay gastos este mes' + (scope === 'ALL' ? '.' : ' en ' + scope + '.') })
    );
  }

  /* ---------- Convertir / Ferear ---------- */
  function abrirConversion(editar) {
    const st = {
      dir: editar ? editar.moneda : 'USD',
      monto: editar ? String(editar.monto) : '',
      tasa: String(editar ? editar.tasaCambio : state.tasa),
      fecha: editar ? editar.fecha : hoy(),
      error: ''
    };
    const saldoBase = calcular(editar ? editar.id : null).saldo;
    const cont = h('div');

    function dibujar() {
      const destino = st.dir === 'USD' ? 'MXN' : 'USD';
      const preview = h('strong', { text: '$0.00' });
      const aviso = h('p', { class: 'note', hidden: true });
      const err = h('p', { class: 'error', role: 'alert', hidden: !st.error, text: st.error });

      const actualizar = () => {
        const m = parseNum(st.monto, 2), t = parseNum(st.tasa, 4);
        if (m > 0 && t > 0) {
          const recibe = st.dir === 'USD' ? Math.round(toCents(m) * t) : Math.round(toCents(m) / t);
          preview.textContent = fmt(recibe);
          const sobra = toCents(m) > saldoBase[st.dir];
          aviso.hidden = !sobra;
          if (sobra) aviso.textContent = 'Este monto es mayor a tu saldo en ' + st.dir + ' (' + fmt(saldoBase[st.dir]) + ').';
        } else {
          preview.textContent = '$0.00';
          aviso.hidden = true;
        }
      };

      cont.replaceChildren(
        h('h2', { class: 'sheet-title', text: editar ? 'Editar conversión' : 'Convertir / Ferear' }),
        h('form', {
          class: 'form', novalidate: true,
          onsubmit: (e) => { e.preventDefault(); guardarConversion(); }
        },
          h('div', { class: 'field' }, h('span', { class: 'label', text: 'Dirección' }),
            seg([{ valor: 'USD', texto: 'USD a MXN' }, { valor: 'MXN', texto: 'MXN a USD' }], st.dir,
              (v) => { st.dir = v; st.error = ''; dibujar(); }, 'Dirección de la conversión')),
          h('div', { class: 'field' },
            h('label', { for: 'cMonto', text: 'Monto a convertir (' + st.dir + ')' }),
            h('input', {
              id: 'cMonto', class: 'input money', type: 'text', inputmode: 'decimal', autocomplete: 'off',
              placeholder: '0.00', value: st.monto, oninput: (e) => { st.monto = e.target.value; actualizar(); }
            })),
          h('div', { class: 'two' },
            h('div', { class: 'field' },
              h('label', { for: 'cTasa', text: 'Tipo de cambio (MXN por USD)' }),
              h('input', {
                id: 'cTasa', class: 'input', type: 'text', inputmode: 'decimal', autocomplete: 'off',
                value: st.tasa, oninput: (e) => { st.tasa = e.target.value; actualizar(); }
              })),
            h('div', { class: 'field' },
              h('label', { for: 'cFecha', text: 'Fecha' }),
              h('input', { id: 'cFecha', class: 'input', type: 'date', value: st.fecha, oninput: (e) => { st.fecha = e.target.value; } }))),
          h('div', { class: 'preview' }, h('span', { text: 'Recibes en ' + destino }), preview),
          aviso,
          err,
          h('div', { class: 'actions' },
            h('button', { class: 'btn btn-primary btn-block', type: 'submit' }, icon('repeat', 18), editar ? 'Guardar cambios' : 'Convertir'),
            h('button', { class: 'btn btn-ghost btn-block', type: 'button', onclick: cerrarHoja }, 'Cancelar'))
        )
      );
      actualizar();
    }

    function guardarConversion() {
      const monto = parseNum(st.monto, 2), tasa = parseNum(st.tasa, 4);
      let err = '';
      if (!(monto > 0)) err = 'Escribe el monto que vas a convertir.';
      else if (!(tasa > 0)) err = 'Escribe un tipo de cambio mayor a 0.';
      else if (!/^\d{4}-\d{2}-\d{2}$/.test(st.fecha)) err = 'Elige una fecha válida.';
      if (err) { st.error = err; dibujar(); return; }

      const destino = st.dir === 'USD' ? 'MXN' : 'USD';
      const base = {
        tipo: 'conversion', moneda: st.dir, monto, categoria: '',
        concepto: 'Conversión ' + st.dir + ' a ' + destino, fecha: st.fecha, tasaCambio: tasa
      };
      if (editar) {
        const i = state.movimientos.findIndex((m) => m.id === editar.id);
        if (i >= 0) state.movimientos[i] = Object.assign({}, state.movimientos[i], base);
      } else {
        state.movimientos.push(Object.assign({ id: uid(), creado: Date.now() }, base));
      }
      state.tasa = tasa;
      guardar();
      cerrarHoja();
      refrescar();
      toast('Conversión guardada');
    }

    dibujar();
    abrirHoja(cont);
  }

  /* ---------- Respaldo ---------- */
  function exportar() {
    const datos = {
      app: 'finanzas-wendy',
      version: 1,
      exportado: new Date().toISOString(),
      tasa: state.tasa,
      movimientos: state.movimientos
    };
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = h('a', { href: url, download: 'finanzas-wendy-' + hoy() + '.json' });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast('Respaldo exportado');
  }

  async function importar(archivo) {
    let datos;
    try {
      datos = JSON.parse(await archivo.text());
    } catch (e) {
      toast('El archivo no es un respaldo válido.');
      return;
    }
    const lista = Array.isArray(datos) ? datos : (datos && Array.isArray(datos.movimientos) ? datos.movimientos : null);
    if (!lista) { toast('El archivo no tiene movimientos.'); return; }
    const validos = lista.map(limpiarMov).filter(Boolean);
    if (!validos.length) { toast('No se encontraron movimientos válidos.'); return; }
    const descartados = lista.length - validos.length;
    const tasaImp = datos && Number(datos.tasa) > 0 ? Number(datos.tasa) : null;

    const combinar = () => {
      const ids = new Set(state.movimientos.map((m) => m.id));
      const nuevos = validos.filter((m) => !ids.has(m.id));
      state.movimientos.push(...nuevos);
      guardar(); cerrarHoja(); refrescar();
      toast('Se agregaron ' + nuevos.length + ' movimientos.');
    };
    const reemplazar = () => {
      state.movimientos = validos;
      if (tasaImp) state.tasa = tasaImp;
      ui.editId = null; ui.form = null;
      guardar(); cerrarHoja(); render();
      toast('Respaldo restaurado: ' + validos.length + ' movimientos.');
    };

    abrirHoja(h('div', {},
      h('h2', { class: 'sheet-title', text: 'Importar respaldo' }),
      h('p', { class: 'muted', style: 'margin-bottom:14px', text:
        'El archivo tiene ' + validos.length + ' movimientos' + (descartados ? ' (' + descartados + ' se ignoraron por estar incompletos)' : '') +
        '. Ahora tienes ' + state.movimientos.length + '.' }),
      h('div', { class: 'actions' },
        h('button', { class: 'btn btn-primary btn-block', type: 'button', onclick: combinar }, 'Combinar (agrega los que faltan)'),
        h('button', { class: 'btn btn-secondary btn-block', type: 'button', onclick: reemplazar }, 'Reemplazar todo'),
        h('button', { class: 'btn btn-ghost btn-block', type: 'button', onclick: cerrarHoja }, 'Cancelar'))
    ));
  }

  /* ---------- Inicio ---------- */
  async function iniciar() {
    const habiaDatos = cargar();
    await cargarConfig();
    if (!habiaDatos) state.tasa = config.tasaCambioDefault;

    construirNav();
    aplicarTema(temaActual(), false);
    $('#btnTema').addEventListener('click', () => aplicarTema(temaActual() === 'dark' ? 'light' : 'dark', true));

    if (window.matchMedia) {
      matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        let guardado = null;
        try { guardado = localStorage.getItem(THEME_KEY); } catch (err) { /* sin acceso */ }
        if (!guardado) aplicarTema(e.matches ? 'dark' : 'light', false);
      });
    }

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#sheet').hidden) cerrarHoja(); });

    render();

    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  iniciar();
})();
