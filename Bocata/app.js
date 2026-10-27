const $ = (id) => document.getElementById(id);
const dinero = (n) => `${NEGOCIO.moneda} ${n.toFixed(2).replace(/\.00$/, "")}`;
const carrito = {}; // "id|opción" -> cantidad
const productos = Object.fromEntries(MENU.flatMap((c) => c.items).map((p) => [p.id, p]));
const linea = (key) => {
  const [id, i] = key.split("|");
  const p = productos[id], o = p.opciones[i];
  return { p, o, nombre: `${p.nombre} (${o.nombre})` };
};

// ---------- Encabezado y redes ----------
$("nombre").textContent = NEGOCIO.nombre;
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

// ---------- Menú ----------
function slug(s) { return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, "-"); }

let grupo = null;
MENU.forEach((cat, i) => {
  // Encabezado del grupo: temporada o lo de siempre
  const g = cat.temporada ? "temporada" : "siempre";
  if (g !== grupo) {
    grupo = g;
    const h = document.createElement("div");
    h.className = `grupo ${g}`;
    h.innerHTML = g === "temporada"
      ? `<span class="badge">De temporada</span><h2>${TEMPORADA}</h2>`
      : `<span class="badge">Lo de siempre</span>`;
    $("menu").append(h);
  }

  const tab = document.createElement("a");
  tab.href = `#${slug(cat.categoria)}`;
  tab.textContent = cat.categoria;
  if (i === 0) tab.classList.add("active");
  $("tabs").append(tab);

  const sec = document.createElement("section");
  sec.id = slug(cat.categoria);
  sec.innerHTML = `<h2>${cat.categoria}</h2><div class="grid"></div>`;
  cat.items.forEach((p) => {
    const card = document.createElement("article");
    card.className = "card";
    const imgTag = (src) =>
      `<img src="${src}" alt="${p.nombre}" loading="lazy"${p.ajuste ? ` class="${p.ajuste}"` : ""} onerror="this.replaceWith(document.createTextNode('🍪'))">`;
    const foto = Array.isArray(p.img)
      ? `<div class="mosaico">${p.img.map(imgTag).join("")}</div>`
      : p.img ? imgTag(p.img) : "🍪";
    card.innerHTML = `
      <div class="foto">${foto}</div>
      <div class="body">
        <h3>${p.nombre}</h3>
        <p>${p.desc}</p>
        ${p.opciones.map((o, idx) => `
          <div class="row">
            <span><span class="opcion">${o.nombre}</span> <span class="precio">${dinero(o.precio)}</span></span>
            <span class="ctrl" data-key="${p.id}|${idx}"></span>
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

// ---------- Carrito ----------
function cambiar(key, delta) {
  carrito[key] = Math.max(0, (carrito[key] || 0) + delta);
  if (!carrito[key]) delete carrito[key];
  render();
}

function controles(key) {
  const n = carrito[key] || 0;
  return n
    ? `<span class="qty"><button data-key="${key}" data-d="-1" aria-label="Quitar">−</button><b>${n}</b><button data-key="${key}" data-d="1" aria-label="Agregar">+</button></span>`
    : `<button class="add" data-key="${key}" data-d="1">Agregar</button>`;
}

function total() { return Object.entries(carrito).reduce((s, [k, n]) => s + linea(k).o.precio * n, 0); }

function render() {
  document.querySelectorAll(".ctrl").forEach((el) => (el.innerHTML = controles(el.dataset.key)));
  const piezas = Object.values(carrito).reduce((a, b) => a + b, 0);
  $("cartBtn").hidden = piezas === 0;
  $("cartCount").textContent = `${piezas} ${piezas === 1 ? "producto" : "productos"}`;
  $("cartTotal").textContent = dinero(total());
  $("sheetTotal").textContent = dinero(total());
  $("cartList").innerHTML = Object.entries(carrito).map(([k, n]) => {
    const { p, o } = linea(k);
    return `<li><span class="nm">${p.nombre}<small>${o.nombre} · ${dinero(o.precio)}</small></span>
      ${controles(k)}<b>${dinero(o.precio * n)}</b></li>`;
  }).join("");
  if (piezas === 0) abrir(false);
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("button[data-key]");
  if (b) cambiar(b.dataset.key, Number(b.dataset.d));
});

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
  const lineas = Object.entries(carrito).map(([k, n]) =>
    `- ${n} x ${linea(k).nombre} — ${dinero(linea(k).o.precio * n)}`);
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

render();
