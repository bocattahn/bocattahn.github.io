// ==========================================================
//  CONFIGURACIÓN — edita aquí sin tocar el resto del código
// ==========================================================

// Número de WhatsApp que recibe los pedidos (código de país + número, sin + ni espacios).
// Por ahora: +504 9748-3817. Cámbialo por el de tu primita cuando esté listo.
const WHATSAPP_NUMBER = "50497483817";

const NEGOCIO = {
  nombre: "Bocatta",
  slogan: "Bocatas hechos al momento, con amor 🥖",
  moneda: "L",
  // Pon aquí los enlaces reales de sus redes (deja "" para ocultar el botón)
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/",
  tiktok: "https://tiktok.com/",
};

// Menú: para cambiar una foto, pon el archivo en la carpeta img/ y usa "img/nombre.jpg"
const MENU = [
  {
    categoria: "Bocatas",
    items: [
      { id: "clasico", nombre: "Bocata Clásico", desc: "Jamón, queso, lechuga, tomate y mayonesa de la casa.", precio: 95,
        img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&q=70" },
      { id: "pollo", nombre: "Bocata de Pollo", desc: "Pollo a la plancha, aguacate, queso y salsa chipotle.", precio: 120,
        img: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=600&q=70" },
      { id: "cubano", nombre: "Bocata Cubano", desc: "Cerdo, jamón, queso suizo, pepinillos y mostaza.", precio: 135,
        img: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&q=70" },
      { id: "veggie", nombre: "Bocata Veggie", desc: "Vegetales asados, queso fresco y pesto.", precio: 105,
        img: "https://images.unsplash.com/photo-1540713434306-58505cf1b6fc?w=600&q=70" },
    ],
  },
  {
    categoria: "Acompañantes",
    items: [
      { id: "papas", nombre: "Papas Fritas", desc: "Crujientes, con sal y salsa a elegir.", precio: 45,
        img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=70" },
      { id: "aros", nombre: "Aros de Cebolla", desc: "Empanizados y dorados.", precio: 55,
        img: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&q=70" },
    ],
  },
  {
    categoria: "Bebidas",
    items: [
      { id: "limonada", nombre: "Limonada Natural", desc: "Recién hecha, con hierbabuena.", precio: 35,
        img: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&q=70" },
      { id: "refresco", nombre: "Refresco", desc: "Lata 355 ml.", precio: 25,
        img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=70" },
    ],
  },
];
