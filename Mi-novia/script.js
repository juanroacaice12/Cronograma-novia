// ===== Acceso general =====
const ACCESS_KEY = "03-01-2025"; // fecha para entrar al cronograma

function checkAccess() {
  const userKey = document.getElementById("access-key").value.trim();
  const errorMessage = document.getElementById("error-message");

  if (userKey === ACCESS_KEY) {
    document.getElementById("access-screen").classList.add("hidden");
    document.getElementById("main-content").classList.remove("hidden");
  } else {
    errorMessage.textContent = "¡Ups! Intenta de nuevo 💔";
  }
}

// ===== Al cargar el DOM =====
window.addEventListener("DOMContentLoaded", () => {
  buildFlagsBackground();    // fondo de banderas fiable (CSS)
  renderEvents();
  setInterval(updateCountdown, 1000);
  updateCountdown();
  showSoonMessage();

  // notificación
  setupNotification();
});

// Mensaje “ya faltan pocos días ⏰” en la pantalla de acceso
function showSoonMessage() {
  const startDate = new Date("2025-08-13T09:00:00"); // Miércoles 9:00 a. m.
  const now = new Date();
  const days = Math.max(0, Math.ceil((startDate - now) / (1000 * 60 * 60 * 24)));
  const soon = document.getElementById("soon-msg");
  if (soon) soon.textContent = `⏰ Ya faltan ${days} día${days === 1 ? "" : "s"}...`;
}

// ===== Cronograma =====
// Nota: el 14 se desbloquea con contraseña; el 16 queda sellado por fecha.
const events = [
  {
    date: "2025-08-13",
    title: "Miércoles 13 de Agosto",
    steps: [
      "Llegada al aeropuerto ✈️",
      "Desayuno en un lugar bonito 🍳",
      "Almuerzo delicioso 🥗",
      "Resolver casos 🕵️‍♀️🧩",
      "Películas + Pizza 🍕 con misterio y diversión"
    ],
    locked: false
  },
  {
    date: "2025-08-14",
    title: "Jueves 14 de Agosto",
    steps: [
      "Llegada a las 10:00 am al Airbnb 🏡",
      "Almuerzo express ⚡",
      "Centro comercial de tu preferencia 🛍️",
      "Cena romántica 🍽️✨"
    ],
    locked: false,        // no por fecha
    requiresPass: true    // requiere contraseña
  },
  {
    date: "2025-08-15",
    title: "Viernes 15 de Agosto",
    steps: [
      "Comida especial 🍽️",
      "Sabores del mundo: Corea 🇰🇷 y México 🇲🇽",
      "Opción: ir a bailar 💃🕺",
      "Momentos para capturar juntos 📷"
    ],
    locked: false
  },
  {
    date: "2025-08-16",
    title: "Sábado 16 de Agosto",
    steps: ["Este día está sellado, ¡sorpresa! 🤫"],
    locked: true          // sellado por fecha
  },
  {
    date: "2025-08-17",
    title: "Domingo 17 de Agosto",
    steps: [
      "Estar juntos todo el día 💑",
      "Disfrutar cada momento hasta el vuelo ✈️"
    ],
    locked: false
  }
];

// Contraseña para el día 14:
const THURSDAY_PASS = "antonella"; 

let pendingOpenCard = null; // tarjeta (DOM) en espera de desbloqueo por pass

function renderEvents() {
  const today = new Date().toISOString().split("T")[0];
  const timeline = document.getElementById("timeline");

  events.forEach((event) => {
    const card = document.createElement("div");
    card.className = "card" + (event.locked && today < event.date ? " locked" : "");

    const title = document.createElement("h3");
    title.textContent = event.title;

    const content = document.createElement("div");
    content.className = "card-content";

    const ul = document.createElement("ul");
    event.steps.forEach(step => {
      const li = document.createElement("li");
      li.textContent = step;
      ul.appendChild(li);
    });
    content.appendChild(ul);

    card.appendChild(title);
    card.appendChild(content);

    card.addEventListener("click", () => {
      // Bloqueado por fecha → popup de espera
      if (card.classList.contains("locked") && today < event.date) {
        openPopup();
        return;
      }
      // Día con contraseña (14) → pedir pass
      if (event.requiresPass) {
        pendingOpenCard = { card, event };
        openPassModal();
        return;
      }
      // Abrir/cerrar normalmente
      card.classList.toggle("open");
    });

    timeline.appendChild(card);
  });
}

// ====== Popups ======
function openPopup() {
  document.getElementById("popup").classList.remove("hidden");
}
function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

function openPassModal() {
  document.getElementById("pass-modal").classList.remove("hidden");
  document.getElementById("thursday-pass-input").value = "";
  document.getElementById("pass-error").textContent = "";
}
function closePassModal() {
  document.getElementById("pass-modal").classList.add("hidden");
  pendingOpenCard = null;
}
function confirmThursdayPass() {
  const val = document.getElementById("thursday-pass-input").value.trim();
  const err = document.getElementById("pass-error");
  if (val.toLowerCase() === THURSDAY_PASS.toLowerCase()) {
    if (pendingOpenCard) {
      // Marcar como desbloqueado definitivo para no volver a pedir la contraseña
      pendingOpenCard.event.requiresPass = false;
      pendingOpenCard.card.classList.add("open");
    }
    closePassModal();
  } else {
    err.textContent = "Contraseña incorrecta. Intenta de nuevo 💔";
  }
}

// ====== Contador ======
function updateCountdown() {
  const countdownTo = new Date("2025-08-13T09:00:00"); // llegada miércoles 9:00 a. m.
  const now = new Date();
  const timeLeft = countdownTo - now;
  const days = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((timeLeft / (1000 * 60 * 60)) % 24));
  const minutes = Math.max(0, Math.floor((timeLeft / (1000 * 60)) % 60));
  const seconds = Math.max(0, Math.floor((timeLeft / 1000) % 60));
  document.getElementById("timer").textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// ====== Fondo de banderas (CSS-based tiles) ======
function buildFlagsBackground() {
  const container = document.getElementById("flagsBg");
  if (!container) return;

  // Decide cuántas celdas necesitamos según la pantalla
  const approxCellW = 100, approxCellH = 66; // tamaño aprox de cada flag
  const cols = Math.ceil(window.innerWidth / (approxCellW + 14));
  const rows = Math.ceil(window.innerHeight / (approxCellH + 14)) + 2;
  const total = cols * rows;

  // Ciclo de banderas
  const classes = ["flag-kr", "flag-co", "flag-cn", "flag-mx", "flag-pe"];

  // Rellenar
  container.innerHTML = "";
  for (let i = 0; i < total; i++) {
    const div = document.createElement("div");
    div.className = `flag ${classes[i % classes.length]}`;
    container.appendChild(div);
  }
}

// Recalcular en resize por si cambia el layout
window.addEventListener("resize", buildFlagsBackground);

// ====== Notificación con “Te amo” en varios idiomas ======
const lovePhrases = [
  "Te amo (Español)",
  "I love you (English)",
  "Saranghae 사랑해 (한국어)",
  "Wo ai ni 我爱你 (中文)",
  "Je t’aime (Français)",
  "Ti amo (Italiano)",
  "Ich liebe dich (Deutsch)",
  "Eu te amo (Português)",
  "Aishiteru 愛してる (日本語)",
  "Ya tebya lyublyu Я тебя люблю (Русский)",
  "Ana uhibbuka/uhibbuki أنا أحبك (العربية)"
];

function setupNotification() {
  const btn = document.getElementById("notifyBtn");
  const toast = document.getElementById("notifyToast");
  const list = document.getElementById("loveList");
  if (!btn || !toast || !list) return;

  // Llenar la lista una sola vez
  list.innerHTML = lovePhrases.map(p => `<li>${p}</li>`).join("");

  btn.addEventListener("click", () => {
    toast.classList.toggle("hidden");
  });
}
function closeToast() {
  const toast = document.getElementById("notifyToast");
  toast.classList.add("hidden");
}
