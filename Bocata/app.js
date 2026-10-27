const $ = (id) => document.getElementById(id);
const dinero = (n) => `${NEGOCIO.moneda} ${n.toFixed(2).replace(/\.00$/, "")}`;
const carrito = {}; // id -> cantidad
const productos = Object.fromEntries(MENU.flatMap((c) => c.items).map((p) => [p.id, p]));

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

MENU.forEach((cat, i) => {
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
    card.innerHTML = `
      <div class="foto"><img src="${p.img}" alt="${p.nombre}" loading="lazy"
           onerror="this.replaceWith(document.createTextNode('🥪'))"></div>
      <div class="body">
        <h3>${p.nombre}</h3>
        <p>${p.desc}</p>
        <div class="row">
          <span class="precio">${dinero(p.precio)}</span>
          <span class="ctrl" data-id="${p.id}"></span>
        </div>
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
function cambiar(id, delta) {
  carrito[id] = Math.max(0, (carrito[id] || 0) + delta);
  if (!carrito[id]) delete carrito[id];
  render();
}

function controles(id) {
  const n = carrito[id] || 0;
  return n
    ? `<span class="qty"><button data-id="${id}" data-d="-1" aria-label="Quitar">−</button><b>${n}</b><button data-id="${id}" data-d="1" aria-label="Agregar">+</button></span>`
    : `<button class="add" data-id="${id}" data-d="1">Agregar</button>`;
}

function total() { return Object.entries(carrito).reduce((s, [id, n]) => s + productos[id].precio * n, 0); }

function render() {
  document.querySelectorAll(".ctrl").forEach((el) => (el.innerHTML = controles(el.dataset.id)));
  const piezas = Object.values(carrito).reduce((a, b) => a + b, 0);
  $("cartBtn").hidden = piezas === 0;
  $("cartCount").textContent = `${piezas} ${piezas === 1 ? "producto" : "productos"}`;
  $("cartTotal").textContent = dinero(total());
  $("sheetTotal").textContent = dinero(total());
  $("cartList").innerHTML = Object.entries(carrito).map(([id, n]) => `
    <li><span class="nm">${productos[id].nombre}<small>${dinero(productos[id].precio)} c/u</small></span>
      ${controles(id)}<b>${dinero(productos[id].precio * n)}</b></li>`).join("");
  if (piezas === 0) abrir(false);
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("button[data-id]");
  if (b) cambiar(b.dataset.id, Number(b.dataset.d));
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
  const lineas = Object.entries(carrito).map(([id, n]) =>
    `• ${n} x ${productos[id].nombre} — ${dinero(productos[id].precio * n)}`);
  const msg = [
    `¡Hola ${NEGOCIO.nombre}! 👋 Quiero hacer este pedido:`,
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
