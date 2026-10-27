// ==========================================================
//  CONFIGURACIÓN — edita aquí sin tocar el resto del código
// ==========================================================

// Número de WhatsApp que recibe los pedidos (código de país + número, sin + ni espacios).
const WHATSAPP_NUMBER = "50495980293"; // +504 9598-0293

const NEGOCIO = {
  nombre: "Bocatta",
  slogan: "Postres hechos con amor 🍪",
  moneda: "L",
  // Enlaces de redes (deja "" para ocultar el botón)
  instagram: "https://www.instagram.com/bocatta.hn/",
  facebook: "",
  tiktok: "",
};

// Precios por paquete. Cada producto puede tener sus propias opciones.
const COOKIE = [{ nombre: "Media docena", precio: 300 }, { nombre: "Docena", precio: 550 }];
const BROWNIE = [{ nombre: "Media docena", precio: 290 }, { nombre: "Docena", precio: 580 }];
const CRISPY = [{ nombre: "Media docena", precio: 300 }, { nombre: "Docena", precio: 600 }];

// Menú. "temporada" agrupa las secciones bajo un aviso de temporada.
// Para cambiar una foto, pon el archivo en la carpeta img/ y usa "img/nombre.jpg".
// Sin foto: deja img: "" y se muestra un dibujito.
const TEMPORADA = "Halloween 🎃";

const MENU = [
  {
    categoria: "Cookies",
    temporada: true,
    items: [
      { id: "cookie-monster", nombre: "Cookie Monster", opciones: COOKIE, img: "img/cookie-monster.jpg",
        desc: "Azul, cargada y fuera de control: trozos de galleta, chispas de chocolate y galleta triturada. ¡Una galleta que come galletas!" },
      { id: "red-web", nombre: "Red Web", opciones: COOKIE, img: "img/red-web.jpg",
        desc: "Roja, dulce y atrapada en una telaraña, con un ojito tenebroso que te observa. Lo spooky nunca supo tan rico." },
      { id: "boo-cookie", nombre: "Boo Cookie", opciones: COOKIE, img: "img/boo-cookie.jpg",
        desc: "Una galleta suavecita embrujada por un fantasmita de malvavisco y su telaraña. Advertencia: es terroríficamente deliciosa." },
      { id: "mummy-cookie", nombre: "Mummy Cookie", opciones: COOKIE, img: "img/mummy-cookie.jpg",
        desc: "Una galleta suavecita envuelta en vendas dulces y con dos ojitos curiosos. ¡Esta momia no asusta, enamora!" },
      { id: "frankie", nombre: "Frankie", opciones: COOKIE, img: "",
        desc: "Verde, dulce y cosida con mucho amor. Este pequeño monstruo está vivo… ¡y listo para que te lo comas!" },
      // OJO: precio y descripción del S'more pendientes de confirmar (no venían en el PDF)
      { id: "midnight-smore", nombre: "Midnight S'more", opciones: COOKIE, img: "img/midnight-smore.jpg",
        desc: "Galleta con chispas de chocolate, malvaviscos tostados y un cuadrito de chocolate, bañada en drizzle blanco. ¡El antojo de medianoche!" },
    ],
  },
  {
    categoria: "Brownies",
    temporada: true,
    items: [
      { id: "mummy-brownie", nombre: "Mummy Brownie", opciones: BROWNIE, img: "img/mummy-brownie.jpg",
        desc: "Un brownie bien fudgy envuelto en vendas dulces y cremosas. ¡Desenvuélvelo bajo tu propio riesgo!" },
      { id: "mallow-monster-brownie", nombre: "Mallow Monster Brownie", opciones: BROWNIE, img: "img/mallow-monster-brownie.jpg",
        desc: "Malvavisco derretido, brownie intenso y demasiados ojos. Tranquilo, solo te miran mientras comes." },
    ],
  },
  {
    categoria: "Rice Crispy",
    temporada: true,
    items: [
      { id: "three-eyed-crispy", nombre: "Three-Eyed Crispy", opciones: CRISPY, img: "img/three-eyed-crispy.jpg",
        desc: "Rice crispy con drizzle naranja, confeti de Halloween y tres ojos que no te pierden de vista. ¡Crujiente y travieso!" },
      { id: "mummy-crispy", nombre: "Mummy Crispy", opciones: CRISPY, img: "img/mummy-crispy.jpg",
        desc: "Crujiente, suavecito y bien envuelto para Halloween. ¡Momia pequeña, crunch gigante!" },
      { id: "zombie-sprinkles", nombre: "Zombie Sprinkles", opciones: CRISPY, img: "img/zombie-crispy.jpg",
        desc: "Un rice crispy zombie cubierto de chispitas moradas, naranjas y negras. ¡Revive de la tumba con todo el sabor!" },
      { id: "frankie-crispy", nombre: "Frankie Crispy", opciones: CRISPY, img: "img/franki-crispy.jpg",
        desc: "El primo crujiente de Frankie: verde, con pelito de chispitas negras y una sonrisa monstruosa." },
    ],
  },
  {
    categoria: "Boxes",
    temporada: true,
    items: [
      // img puede ser una lista de fotos: se muestran como mosaico
      { id: "box-surtida", nombre: "Box Surtida", opciones: [{ nombre: "25 piezas", precio: 1100 }],
        img: ["img/cookie-monster.jpg", "img/mummy-brownie.jpg", "img/three-eyed-crispy.jpg", "img/red-web.jpg"],
        desc: "Una mezcla de galletas, brownies y rice crispy." },
      { id: "box-50", nombre: "Box de 50", opciones: [{ nombre: "50 piezas", precio: 2150 }],
        img: ["img/boo-cookie.jpg", "img/mallow-monster-brownie.jpg", "img/zombie-crispy.jpg", "img/mummy-cookie.jpg"],
        desc: "Para compartir… o para ti solito." },
    ],
  },
  // Lo de siempre: agrega aquí sus categorías (sin "temporada: true") cuando tengan precios.
];
