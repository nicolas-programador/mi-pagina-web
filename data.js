// data.js — Datos de Mi Ranchito
// Todas las imagenes provienen de Unsplash (Licencia libre de derechos / Sin copyright)

const NEGOCIO = {
  nombre: "Mi Ranchito",
  nequi: "3212065148",
  whatsapp1: "573212065148",
  whatsapp2: "573223669482",
  ubicacion: "https://www.google.com/maps/search/?api=1&query=4.4547957,-74.6428656",
  mapsEmbed: "https://www.google.com/maps?q=4.4547957,-74.6428656&z=17&output=embed",
  direccion: "Tocaima, Cundinamarca",
  horario: "Lunes a Domingo: 6:30 AM - 8:30 PM"
};

const MENU = {
  panaderia: [
    {
      id: "p1",
      name: "Pan de Rollo",
      emoji: "🥖",
      img: "rollo,500 unidad.jpeg",
      desc: "Pan de rollo suave y esponjoso, horneado fresco cada mañana.",
      price: 500,
      category: "panes",
      tags: ["Por unidad"],
      badge: "Fresco"
    },
    {
      id: "p2",
      name: "Mogolla",
      emoji: "🫓",
      img: "mogojas,unidad 500.jpeg",
      desc: "Tradicional mogolla campesina colombiana de miga suave.",
      price: 500,
      category: "panes",
      tags: ["Por unidad"],
      badge: null
    },
    {
      id: "p3",
      name: "Calentano",
      emoji: "🥐",
      img: "WhatsApp Image 2026-09-04 at 8.32.50 AM (3).jpeg",
      desc: "Pan calentano tradicional, doradito y perfecto para acompañar el tinto.",
      price: 400,
      category: "panes",
      tags: ["Por unidad"],
      badge: "Económico"
    },
    {
      id: "p4",
      name: "Pan Liso",
      emoji: "🍞",
      img: "lisos,500.jpeg",
      desc: "Pan liso grande ideal para compartir en el desayuno familiar.",
      price: 500,
      category: "panes",
      tags: ["Familiar"],
      badge: null
    },
    {
      id: "p5",
      name: "Pan de Queso",
      emoji: "🧀",
      img: "WhatsApp Image 2026-09-04 at 8.32.50 AM (4).jpeg",
      desc: "Delicioso pan artesanal horneado con abundante queso costeño derretido.",
      price: 5000,
      category: "panes",
      tags: ["Queso"],
      badge: "Popular"
    },
    {
      id: "p6",
      name: "Roscón",
      emoji: "🍩",
      img: "WhatsApp Image 2026-09-04 at 8.32.42 AM.jpeg",
      desc: "Roscón dulce horneado tradicional con manjar o bocadillo.",
      price: 1000,
      category: "dulces",
      tags: ["Dulce"],
      badge: null
    },
    {
      id: "p7",
      name: "Mantecada",
      emoji: "🧁",
      img: "WhatsApp Image 2026-09-04 at 8.32.50 AM (2).jpeg",
      desc: "Esponjosa mantecada casera preparada con mantequilla y huevo.",
      price: 2500,
      category: "dulces",
      tags: ["Porción"],
      badge: null
    },
    {
      id: "p8",
      name: "Liberales",
      emoji: "🍰",
      img: "WhatsApp Image 2026-09-04 at 8.32.51 AM (2).jpeg",
      desc: "Tradicional dulce liberal esponjoso relleno de cremosa miel o arequipe.",
      price: 1500,
      category: "dulces",
      tags: ["Tradicional"],
      badge: null
    },
    {
      id: "p9",
      name: "Pera Fresca",
      emoji: "🥖",
      img: "peras,500 unidad.jpeg",
      desc: "Pan pera artesanal, recién horneado y suave por dentro.",
      price: 500,
      category: "panes",
      tags: ["Por unidad"],
      badge: "Fresco"
    },
    {
      id: "g1",
      name: "Galletas de Corazón",
      emoji: "❤️",
      img: "galletas,1500.jpeg",
      desc: "Galletas artesanales recién horneadas, con suave sabor a vainilla.",
      price: 1500,
      category: "galletas",
      tags: ["Por unidad"],
      badge: "Favorito"
    },
    {
      id: "g2",
      name: "Galletas de Avena",
      emoji: "🌾",
      img: "https://unsplash.com/photos/Ir1EmjxRua4/download?force=true&w=600",
      desc: "Galletas crujientes preparadas con avena natural y uvas pasas.",
      price: 1500,
      category: "galletas",
      tags: ["Saludable"],
      badge: null
    },
    {
      id: "g3",
      name: "Galletas Chips Chocolate",
      emoji: "🍫",
      img: "WhatsApp Image 2026-09-04 at 8.32.51 AM (3).jpeg",
      desc: "Deliciosas galletas cargadas de chispas de chocolate real.",
      price: 1500,
      category: "galletas",
      tags: ["Chocolate"],
      badge: "Popular"
    },
    {
      id: "g4",
      name: "Bolsa de Calados",
      emoji: "🥖",
      img: "WhatsApp Image 2026-09-04 at 8.32.51 AM (1).jpeg",
      desc: "Bolsa de calados tostados y crocantes, ideales para el chocolate o café.",
      price: 2000,
      category: "galletas",
      tags: ["Bolsa"],
      badge: null
    }
  ],
  asadero: [
    {
      id: "a1",
      name: "Picada Tradicional (Cerdo + Res)",
      emoji: "🥩",
      img: "picada minimo 30mil,minimo 35 mil solo res, en la normal viene yuca platano papa carne de cerdo y de res y el precio sube de 5 a 5.jpeg",
      desc: "Deliciosa picada artesanal con carne de cerdo y de res, acompañada de yuca, plátano y papa tostada.",
      price: 30000,
      priceOptions: [30000, 35000, 40000, 45000, 50000, 55000, 60000],
      fulfillmentOptions: [
        { value: "local", label: "🏠 En el local" },
        { value: "llevar", label: "🥡 Para llevar" }
      ],
      category: "picadas",
      tags: ["🍖 Domicilio Incluido", "Desde $30.000", "Cerdo y Res"],
      badge: "Especial Asadero",
      hasMeat: true
    },
    {
      id: "a2",
      name: "Picada Solo Res",
      emoji: "🥩",
      img: "picada minimo 30mil,minimo 35 mil solo res, en la normal viene yuca platano papa carne de cerdo y de res y el precio sube de 5 a 5.jpeg",
      desc: "Picada especial con 100% carne de res seleccionada, acompañada de yuca, plátano maduro y papa.",
      price: 35000,
      priceOptions: [35000, 40000, 45000, 50000, 55000, 60000, 65000],
      fulfillmentOptions: [
        { value: "local", label: "🏠 En el local" },
        { value: "llevar", label: "🥡 Para llevar" }
      ],
      category: "picadas",
      tags: ["🍖 Domicilio Incluido", "Desde $35.000", "Solo Res"],
      badge: "Favorito",
      hasMeat: true
    },
    {
      id: "a3",
      name: "Sopita del Día",
      emoji: "🥣",
      img: "sopita.jpeg",
      desc: "Deliciosa y reconfortante sopa casera preparada diariamente en nuestro asadero.",
      price: 8000,
      priceOptions: [
        { price: 8000, label: "$8.000 (En local)" },
        { price: 9000, label: "$9.000 (Para llevar)" }
      ],
      category: "sopas",
      tags: ["Sopa Casera", "En local $8k", "Para llevar $9k"],
      badge: "Reconfortante",
      hasMeat: false
    }
  ],
  bebidas: [
    {
      id: "b1",
      name: "Cerveza Águila",
      emoji: "🍺",
      img: "WhatsApp Image 2026-09-10 at 3.08.01 PM (1).jpeg",
      desc: "Cerveza Águila Original, bien fría.",
      price: 3000,
      category: "bebidas",
      tags: ["Personal"],
      badge: "Helada"
    },
    {
      id: "b2",
      name: "Andina Refajo 1.5L",
      emoji: "🍾",
      img: "WhatsApp Image 2026-09-10 at 3.08.01 PM.jpeg",
      desc: "Refajo Andina hecho con Colombiana, refrescante y dulce.",
      price: 7000,
      category: "bebidas",
      tags: ["Familiar"],
      badge: null
    },
    {
      id: "b3",
      name: "Cola y Pola",
      emoji: "🍺",
      img: "WhatsApp Image 2026-09-10 at 3.08.02 PM.jpeg",
      desc: "Refajo Cola y Pola, dulce y refrescante.",
      price: 3000,
      category: "bebidas",
      tags: ["Personal"],
      badge: null
    },
    {
      id: "b4",
      name: "Freskola",
      emoji: "🥤",
      img: "WhatsApp Image 2026-09-10 at 3.08.02 PM (1).jpeg",
      desc: "Gaseosa Freskola en botella de vidrio 350ml, bien fría.",
      price: 3000,
      category: "bebidas",
      tags: ["Personal"],
      badge: "Fría"
    },
    {
      id: "b5",
      name: "Electrolife Fresa-Kiwi",
      emoji: "🧃",
      img: "WhatsApp Image 2026-09-10 at 3.08.02 PM (2).jpeg",
      desc: "Bebida hidratante Electrolife sabor Fresa-Kiwi 625ml.",
      price: 8500,
      category: "bebidas",
      tags: [],
      badge: null
    },
    {
      id: "b6",
      name: "Quatro Toronja 1.5L",
      emoji: "🍾",
      img: "WhatsApp Image 2026-09-10 at 3.08.02 PM (4).jpeg",
      desc: "Gaseosa Quatro Toronja familiar para compartir.",
      price: 7000,
      category: "bebidas",
      tags: ["Familiar"],
      badge: null
    },
    {
      id: "b7",
      name: "Pepsi Personal",
      emoji: "🥤",
      img: "WhatsApp Image 2026-09-10 at 3.08.02 PM (5).jpeg",
      desc: "Pepsi personal, fría y lista para acompañar.",
      price: 3000,
      category: "bebidas",
      tags: ["Personal"],
      badge: "Fría"
    },
    {
      id: "b8",
      name: "H2OH! Maracuyá",
      emoji: "💧",
      img: "WhatsApp Image 2026-09-10 at 3.08.02 PM (6).jpeg",
      desc: "Agua saborizada H2OH! sabor maracuyá, libre de calorías.",
      price: 3000,
      category: "bebidas",
      tags: [],
      badge: null
    },
    {
      id: "b9",
      name: "Coca-Cola 1.5L",
      emoji: "🥤",
      img: "WhatsApp Image 2026-09-10 at 3.08.02 PM (7).jpeg",
      desc: "Coca-Cola familiar para compartir, bien fría.",
      price: 8000,
      category: "bebidas",
      tags: ["Familiar"],
      badge: "Fría"
    },
    {
      id: "b10",
      name: "Mr. Tea Durazno",
      emoji: "🍵",
      img: "WhatsApp Image 2026-09-10 at 3.08.03 PM (1).jpeg",
      desc: "Té helado Mr. Tea sabor durazno.",
      price: 3000,
      category: "bebidas",
      tags: ["Personal"],
      badge: null
    },
    {
      id: "b11",
      name: "Hit Frutas Tropicales",
      emoji: "🧃",
      img: "WhatsApp Image 2026-09-10 at 3.08.03 PM (2).jpeg",
      desc: "Jugo Hit sabor frutas tropicales, refrescante.",
      price: 3500,
      category: "bebidas",
      tags: ["Personal"],
      badge: null
    },
    {
      id: "b12",
      name: "Pepsi Familiar 2.5L",
      emoji: "🍾",
      img: "WhatsApp Image 2026-09-10 at 3.08.03 PM (3).jpeg",
      desc: "Pepsi familiar para compartir.",
      price: 7000,
      category: "bebidas",
      tags: ["Familiar"],
      badge: null
    },
    {
      id: "b13",
      name: "Hit de Mango (1L)",
      emoji: "🧃",
      img: "WhatsApp Image 2026-09-10 at 3.08.03 PM (4).jpeg",
      desc: "Jugo Hit de mango en caja de 1 litro.",
      price: 5000,
      category: "bebidas",
      tags: ["Familiar"],
      badge: null
    },
    {
      id: "b14",
      name: "Pony Malta 1.5L",
      emoji: "🍺",
      img: "WhatsApp Image 2026-09-10 at 3.08.03 PM (5).jpeg",
      desc: "Pony Malta en botella plástica grande, con menos azúcar.",
      price: 8000,
      category: "bebidas",
      tags: ["Familiar"],
      badge: null
    },
    {
      id: "b15",
      name: "Pony Malta Lata",
      emoji: "🍺",
      img: "WhatsApp Image 2026-09-10 at 3.08.03 PM (6).jpeg",
      desc: "Pony Malta en lata, energía nutritiva.",
      price: 4000,
      category: "bebidas",
      tags: ["Personal"],
      badge: null
    },
    {
      id: "b16",
      name: "Pony Malta Vidrio",
      emoji: "🍺",
      img: "WhatsApp Image 2026-09-10 at 3.08.03 PM.jpeg",
      desc: "Pony Malta en botella de vidrio, bien fría.",
      price: 3000,
      category: "bebidas",
      tags: ["Personal"],
      badge: "Fría"
    },
    {
      id: "b17",
      name: "Agua Cristal",
      emoji: "💧",
      img: "WhatsApp Image 2026-09-10 at 3.08.04 PM (1).jpeg",
      desc: "Agua Cristal 600ml, fría y pura.",
      price: 2500,
      category: "bebidas",
      tags: [],
      badge: null
    },
    {
      id: "b18",
      name: "Coca-Cola Vidrio",
      emoji: "🥤",
      img: "WhatsApp Image 2026-09-10 at 3.08.04 PM (2).jpeg",
      desc: "Coca-Cola en botella de vidrio retornable, bien fría.",
      price: 3000,
      category: "bebidas",
      tags: ["Personal"],
      badge: "Fría"
    },
    {
      id: "b19",
      name: "Gatorade Frutos Tropicales",
      emoji: "⚡",
      img: "WhatsApp Image 2026-09-10 at 3.08.04 PM.jpeg",
      desc: "Bebida hidratante Gatorade sabor frutos tropicales 500ml.",
      price: 5000,
      category: "bebidas",
      tags: [],
      badge: null
    }
  ],
  restaurante: [
    {
      id: "r1",
      name: "Bandeja Sola",
      emoji: "🍚",
      img: "bandeja.jpeg",
      desc: "Contiene arroz, principio al gusto (dependiendo del día) y ensalada",
      price: 12000,
      priceOptions: [
        { price: 12000, label: "$12.000 (En local)" },
        { price: 13000, label: "$13.000 (Para llevar)" }
      ],
      category: "almuerzos",
      hasMeat: false
    },
    {
      id: "r2",
      name: "Almuerzo Completo",
      emoji: "🍽️",
      img: "almuerzo.jpeg",
      desc: "Contiene sopa del día, arroz, principio al gusto, ensalada y limonada",
      price: 15000,
      priceOptions: [
        { price: 15000, label: "$15.000 (En local)" },
        { price: 16000, label: "$16.000 (Para llevar)" }
      ],
      category: "almuerzos",
      hasMeat: false
    },
    {
      id: "r3",
      name: "Sopa del Día",
      emoji: "🍲",
      img: "sopa-almu.jpeg",
      desc: "Sopa casera preparada diariamente en nuestra cocina",
      price: 8000,
      priceOptions: [
        { price: 8000, label: "$8.000 (En local)" },
        { price: 9000, label: "$9.000 (Para llevar)" }
      ],
      category: "almuerzos",
      hasMeat: false
    }
  ]
};

const LEGAL_TEXTS = {
  privacidad: {
    title: "Política de Privacidad",
    content: "<h2>Política de Privacidad y Tratamiento de Datos</h2><p>Mi Ranchito, en cumplimiento de la Ley 1581 de 2012, informa su política de tratamiento de datos personales.</p>"
  },
  terminos: {
    title: "Términos y Condiciones",
    content: "<h2>Términos y Condiciones de Servicio</h2><p>Al realizar un pedido en Mi Ranchito, acepta los términos vigentes.</p>"
  },
  retracto: {
    title: "Derecho de Retracto",
    content: "<h2>Derecho de Retracto — Ley 1480 de 2011</h2><p>Conforme a la normativa colombiana.</p>"
  },
  pqrs: {
    title: "PQRS",
    content: "<h2>Canal de PQRS — Mi Ranchito</h2><p>WhatsApp: 321 206 5148</p>"
  }
};

// RESEÑAS - Local Storage
const REVIEWS_KEY = 'mr_reviews';

function getReviewsFromStorage() {
  try {
    const saved = localStorage.getItem(REVIEWS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

function saveReviewsToStorage(reviews) {
  try {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  } catch (e) {}
}

function addReviewToStorage(name, email, rating, comment) {
  const reviews = getReviewsFromStorage();
  const newReview = {
    id: Date.now(),
    name: name || 'Cliente Anónimo',
    email: email || '',
    rating: Math.min(5, Math.max(1, parseInt(rating))),
    comment: comment || '',
    date: new Date().toLocaleDateString('es-CO')
  };
  reviews.unshift(newReview);
  saveReviewsToStorage(reviews);
  return newReview;
}

function deleteReviewFromStorage(reviewId) {
  const reviews = getReviewsFromStorage();
  const filtered = reviews.filter(r => r.id !== reviewId);
  saveReviewsToStorage(filtered);
  return filtered;
}
