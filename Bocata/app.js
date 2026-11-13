const $ = (id) => document.getElementById(id);
const dinero = (n) => `${NEGOCIO.moneda} ${Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const carrito = {};  // "id|opción" o "id|opción|n" (packs armados) -> cantidad
const elegidos = {}; // "id|opción|n" -> ["Golden Cookie", ...] lo que el cliente eligió para el pack
let productos = {};   // id -> producto
const linea = (key) => {
  const [id, i] = key.split("|");
  const p = productos[id], o = p.opciones[i];
  return { p, o, nombre: `${p.nombre} (${o.nombre})`, eleccion: elegidos[key] };
};

// ---------- Encabezado y redes ----------
$("slogan").textContent = NEGOCIO.slogan;
$("year").textContent = new Date().getFullYear();
[["Instagram", NEGOCIO.instagram], ["Facebook", NEGOCIO.facebook], ["TikTok", NEGOCIO.tiktok],
 ["WhatsApp", `https://wa.me/${WHATSAPP_NUMBER}`]]
  .filter(([, url]) => url)
  .forEach(([nombre, url]) => {
    const a = document.createElement("a");
    a.href = url; a.target = "_blank"; a.rel = "noopener"; a.textContent = nombre;
    $("redes").append(a);
  });

// ---------- Datos: Supabase (lo que edita Ana) o el menú fijo de menu.js ----------
async function cargarMenu() {
  const S = window.SUPABASE || {};
  if (!S.URL || !S.KEY || !window.supabase) return { menu: MENU, temporada: TEMPORADA };
  try {
    const db = supabase.createClient(S.URL, S.KEY);
    const [{ data: filas, error }, { data: ajustes }] = await Promise.all([
      // Lo archivado (temporadas pasadas) no se muestra
      db.from("productos").select("*").eq("archivado", false).order("orden").order("id"),
      db.from("ajustes").select("temporada").eq("id", 1).maybeSingle(),
    ]);
    if (error) throw error;
    // Agrupa por categoría: primero las de temporada, en el orden en que Ana las acomodó
    const cats = new Map();
    filas
      .slice()
      .sort((a, b) => (b.temporada - a.temporada) || (a.orden - b.orden))
      .forEach((f) => {
        const clave = `${f.temporada ? 1 : 0}|${f.categoria || "Otros"}`;
        if (!cats.has(clave)) cats.set(clave, { categoria: f.categoria || "Otros", temporada: f.temporada, items: [] });
        cats.get(clave).items.push({
          id: String(f.id), nombre: f.nombre, desc: f.descripcion, opciones: f.opciones || [],
          img: f.foto_url || "", formato: f.ancho ? "ancho" : "", disponible: f.disponible,
          categoria: f.categoria || "Otros", elegir: f.elegir || [],
        });
      });
    return { menu: [...cats.values()], temporada: ajustes?.temporada || TEMPORADA };
  } catch (e) {
    console.error("No se pudo leer Supabase, uso el menú fijo", e);
    return { menu: MENU, temporada: TEMPORADA };
  }
}

// ---------- Menú ----------
function slug(s) { return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, "-"); }

function pintarMenu(menu, temporada) {
  productos = Object.fromEntries(menu.flatMap((c) => c.items).map((p) => [p.id, p]));
  let grupo = null;
  menu.forEach((cat, i) => {
    // Encabezado del grupo: temporada o lo de siempre
    const g = cat.temporada ? "temporada" : "siempre";
    if (g !== grupo) {
      grupo = g;
      const h = document.createElement("div");
      h.className = `grupo ${g}`;
      h.innerHTML = g === "temporada"
        ? `<span class="badge">De temporada</span><h2>${esc(temporada)}</h2>`
        : `<span class="badge">Lo de siempre</span>`;
      $("menu").append(h);
    }

    const id = `${g}-${slug(cat.categoria)}`;
    const tab = document.createElement("a");
    tab.href = `#${id}`;
    tab.textContent = cat.categoria;
    if (i === 0) tab.classList.add("active");
    $("tabs").append(tab);

    const sec = document.createElement("section");
    sec.id = id;
    sec.innerHTML = `<h2>${esc(cat.categoria)}</h2><div class="grid"></div>`;
    cat.items.forEach((p) => {
      const card = document.createElement("article");
      card.className = ["card", p.formato, p.disponible === false ? "agotado" : ""].filter(Boolean).join(" ");
      const foto = p.img
        ? `<img src="${esc(p.img)}" alt="${esc(p.nombre)}" loading="lazy" onerror="this.replaceWith(document.createTextNode('🍪'))">`
        : "🍪";
      card.innerHTML = `
        <div class="foto">${foto}${p.disponible === false ? `<span class="sello">Agotado</span>` : ""}</div>
        <div class="body">
          <h3>${esc(p.nombre)}</h3>
          <p>${esc(p.desc)}</p>
          ${p.opciones.map((o, idx) => `
            <div class="row">
              <span><span class="opcion">${esc(o.nombre)}</span> <span class="precio">${dinero(o.precio)}</span></span>
              <span class="ctrl" data-key="${esc(p.id)}|${idx}"></span>
            </div>`).join("")}
        </div>`;
      sec.querySelector(".grid").append(card);
    });
    $("menu").append(sec);
  });

  // Resalta la pestaña de la sección visible
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      document.querySelectorAll(".tabs a").forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`));
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll("main section").forEach((s) => obs.observe(s));
}

// ---------- Carrito ----------
function cambiar(key, delta) {
  carrito[key] = Math.max(0, (carrito[key] || 0) + delta);
  if (!carrito[key]) delete carrito[key];
  render();
}

function controles(key, enTarjeta) {
  const p = productos[key.split("|")[0]];
  if (p?.disponible === false) return `<span class="agotado-txt">Agotado</span>`;
  // Packs donde el cliente elige: en la tarjeta siempre "Elegir" (cada combinación es una línea aparte)
  if (enTarjeta && p?.elegir?.length) return `<button class="add" data-elegir="${key}">Elegir</button>`;
  const n = carrito[key] || 0;
  return n
    ? `<span class="qty"><button data-key="${key}" data-d="-1" aria-label="Quitar">−</button><b>${n}</b><button data-key="${key}" data-d="1" aria-label="Agregar">+</button></span>`
    : `<button class="add" data-key="${key}" data-d="1">Agregar</button>`;
}

function total() { return Object.entries(carrito).reduce((s, [k, n]) => s + linea(k).o.precio * n, 0); }

function render() {
  document.querySelectorAll(".ctrl").forEach((el) => (el.innerHTML = controles(el.dataset.key, true)));
  const piezas = Object.values(carrito).reduce((a, b) => a + b, 0);
  $("cartBtn").hidden = piezas === 0;
  $("cartCount").textContent = `${piezas} ${piezas === 1 ? "producto" : "productos"}`;
  $("cartTotal").textContent = dinero(total());
  $("sheetTotal").textContent = dinero(total());
  $("cartList").innerHTML = Object.entries(carrito).map(([k, n]) => {
    const { p, o, eleccion } = linea(k);
    return `<li><span class="nm">${esc(p.nombre)}<small>${esc(o.nombre)} · ${dinero(o.precio)}</small>
      ${eleccion ? `<small class="eleccion">${esc(eleccion.join(", "))}</small>` : ""}</span>
      ${controles(k)}<b>${dinero(o.precio * n)}</b></li>`;
  }).join("");
  if (piezas === 0) abrir(false);
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("button[data-key]");
  if (b) cambiar(b.dataset.key, Number(b.dataset.d));
  const el = e.target.closest("button[data-elegir]");
  if (el) abrirElegir(el.dataset.elegir);
});

// ---------- Packs: el cliente elige qué postres lleva ----------
// p.elegir = [{ categoria: "Cookies", cantidad: 1 }, ...]; categoria "*" = cualquier postre
// ("cualquier postre" no incluye la categoría del propio pack: ni kits ni boxes)
function opcionesDe(categoria, propia) {
  return Object.values(productos).filter((x) =>
    x.disponible !== false && !x.elegir?.length &&
    (categoria === "*" ? x.categoria !== propia : x.categoria === categoria));
}

let contadorPacks = 0;
function abrirElegir(keyBase) {
  const [id] = keyBase.split("|");
  const p = productos[id];
  const filas = [];
  p.elegir.forEach((r) => {
    const lista = opcionesDe(r.categoria, p.categoria);
    const etiqueta = r.categoria === "*" ? "Postre" : r.categoria;
    for (let n = 1; n <= r.cantidad; n++) {
      filas.push(`<label>${esc(etiqueta)}${r.cantidad > 1 ? ` ${n}` : ""}
        <select required>
          <option value="">Elige…</option>
          ${lista.map((x) => `<option>${esc(x.nombre)}</option>`).join("")}
        </select></label>`);
    }
  });
  const v = document.createElement("div");
  v.className = "elegir-fondo";
  v.innerHTML = `
    <form class="elegir-caja">
      <div class="sheet-head"><h2>${esc(p.nombre)}</h2><button type="button" class="close" aria-label="Cerrar">✕</button></div>
      <p class="elegir-ayuda">Elige qué postres quieres en tu ${esc(p.nombre)}:</p>
      ${filas.join("")}
      <button type="submit" class="wa-btn" style="background:var(--brand);margin-top:16px">Agregar al pedido</button>
    </form>`;
  document.body.append(v);
  const cerrar = () => v.remove();
  v.querySelector(".close").onclick = cerrar;
  v.onclick = (e) => { if (e.target === v) cerrar(); };
  v.querySelector("form").onsubmit = (e) => {
    e.preventDefault();
    const eleccion = [...v.querySelectorAll("select")].map((s) => s.value);
    const key = `${keyBase}|${++contadorPacks}`;
    elegidos[key] = eleccion;
    cambiar(key, 1);
    cerrar();
  };
}

function abrir(si) {
  $("sheet").classList.toggle("open", si);
  $("sheet").setAttribute("aria-hidden", String(!si));
  $("backdrop").hidden = !si;
}
$("cartBtn").onclick = () => abrir(true);
$("closeSheet").onclick = () => abrir(false);
$("backdrop").onclick = () => abrir(false);

$("entrega").onchange = (e) => {
  const domicilio = e.target.value === "A domicilio";
  $("dirWrap").hidden = !domicilio;
  $("dirWrap").querySelector("input").required = domicilio;
};

// ---------- Enviar a WhatsApp ----------
$("orderForm").onsubmit = (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const lineas = Object.entries(carrito).map(([k, n]) => {
    const l = linea(k);
    return `- ${n} x ${l.nombre} — ${dinero(l.o.precio * n)}` + (l.eleccion ? `\n   Lleva: ${l.eleccion.join(", ")}` : "");
  });
  const msg = [
    // Sin emojis: WhatsApp en PC a veces los muestra como un cuadro con "?"
    `¡Hola ${NEGOCIO.nombre}! Quiero hacer este pedido:`,
    "",
    ...lineas,
    "",
    `*Total: ${dinero(total())}*`,
    "",
    `Nombre: ${f.get("nombre")}`,
    `Entrega: ${f.get("entrega")}`,
    f.get("entrega") === "A domicilio" ? `Dirección: ${f.get("direccion")}` : "",
    f.get("notas") ? `Notas: ${f.get("notas")}` : "",
  ].filter((l, i, arr) => l !== "" || arr[i - 1] !== "").join("\n");
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
};

cargarMenu().then(({ menu, temporada }) => {
  pintarMenu(menu, temporada);
  render();
});
