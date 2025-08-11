// ===== Acceso general =====
const ACCESS_KEY = "03-01-2025"; // fecha para entrar al cronograma

function checkAccess() {
  const userKey = document.getElementById("access-key").value.trim();
  const errorMessage = document.getElementById("error-message");

  if (userKey === ACCESS_KEY) {
    document.getElementById("access-screen").classList.add("hidden");
    document.getElementById("main-content").classList.remove("hidden");
    // Mostrar la notificación de llegada
    scheduleInAppNotification();
  } else {
    errorMessage.textContent = "¡Ups! Intenta de nuevo 💔";
  }
}

// ===== Al cargar el DOM =====
window.addEventListener("DOMContentLoaded", () => {
  buildFlagsBackground();    // fondo de banderas (CSS)
  renderEvents();
  setInterval(updateCountdown, 1000);
  updateCountdown();
  showSoonMessage();

  // Notificación: prepara el toast/lista y botón
  setupNotification();

  // Si ya está visible (tests), programa la notificación
  if (!document.getElementById("main-content").classList.contains("hidden")) {
    scheduleInAppNotification();
  }
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

// Contraseña para el día 14 (case-insensitive):
const THURSDAY_PASS = "antonella";

let pendingOpenCard = null; // tarjeta en espera de desbloqueo por pass

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

// ====== Popups (fecha/contraseña) ======
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
      // Desbloquear definitivo (no vuelve a pedir pass)
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

// ====== Fondo de banderas (CSS tiles) ======
function buildFlagsBackground() {
  const container = document.getElementById("flagsBg");
  if (!container) return;

  const approxCellW = 100, approxCellH = 66;
  const cols = Math.ceil(window.innerWidth / (approxCellW + 14));
  const rows = Math.ceil(window.innerHeight / (approxCellH + 14)) + 2;
  const total = cols * rows;

  const classes = ["flag-kr", "flag-co", "flag-cn", "flag-mx", "flag-pe"];

  container.innerHTML = "";
  for (let i = 0; i < total; i++) {
    const div = document.createElement("div");
    div.className = `flag ${classes[i % classes.length]}`;
    container.appendChild(div);
  }
}
window.addEventListener("resize", buildFlagsBackground);

// ====== Notificación con “Te amo” (20 idiomas, solo la frase) ======
const lovePhrases = [
  "Te amo",                // Español
  "I love you",            // English
  "사랑해",                 // Korean
  "我爱你",                 // Chinese (Simplified)
  "Je t’aime",             // French
  "Ti amo",                // Italian
  "Ich liebe dich",        // German
  "Eu te amo",             // Portuguese
  "愛してる",               // Japanese
  "Я тебя люблю",          // Russian
  "أحبك",                  // Arabic
  "मैं तुमसे प्यार करता हूँ", // Hindi (masc.)
  "Seni seviyorum",        // Turkish
  "אני אוהב אותך",          // Hebrew (masc.)
  "Σ' αγαπώ",              // Greek
  "Ik hou van jou",        // Dutch
  "Jag älskar dig",        // Swedish
  "Kocham cię",            // Polish
  "ฉันรักคุณ",              // Thai
  "Aku cinta kamu"         // Indonesian
];

function setupNotification() {
  const btn = document.getElementById("notifyBtn");
  const toast = document.getElementById("notifyToast");
  const list = document.getElementById("loveList");
  if (!btn || !toast || !list) return;

  list.innerHTML = lovePhrases.map(p => `<li>${p}</li>`).join("");

  // Abrir/cerrar manual desde la campana
  btn.addEventListener("click", () => {
    toast.classList.toggle("hidden");
    if (!toast.classList.contains("hidden")) {
      sessionStorage.setItem("loveMsgShown", "1"); // marcar como visto
      btn.classList.remove("has-badge");
      hidePreview();
    }
  });
}
function closeToast() {
  const toast = document.getElementById("notifyToast");
  toast.classList.add("hidden");
  sessionStorage.setItem("loveMsgShown", "1"); // ya fue visto
  const btn = document.getElementById("notifyBtn");
  if (btn) btn.classList.remove("has-badge");
  hidePreview();
}

// Preview programado tras el acceso
function scheduleInAppNotification() {
  if (sessionStorage.getItem("loveMsgShown")) return;

  const btn = document.getElementById("notifyBtn");
  const preview = document.getElementById("notifyPreview");
  const openBtn = document.getElementById("npOpen");
  const closeBtn = document.getElementById("npClose");
  if (!btn || !preview || !openBtn || !closeBtn) return;

  setTimeout(() => {
    btn.classList.add("has-badge");
    preview.classList.remove("hidden");
    requestAnimationFrame(() => preview.classList.add("show"));
  }, 1200);

  const openToast = () => {
    const toast = document.getElementById("notifyToast");
    if (toast) toast.classList.remove("hidden");
    sessionStorage.setItem("loveMsgShown", "1");
    btn.classList.remove("has-badge");
    hidePreview();
  };

  openBtn.addEventListener("click", openToast);
  // Si toca la campana y hay preview → abrir toast
  btn.addEventListener("click", () => {
    if (!preview.classList.contains("hidden")) openToast();
  });
  closeBtn.addEventListener("click", () => {
    hidePreview();
    sessionStorage.setItem("loveMsgShown", "1"); // si la cierra, lo damos por visto
    btn.classList.remove("has-badge");
  });
}

function hidePreview() {
  const preview = document.getElementById("notifyPreview");
  if (!preview) return;
  preview.classList.remove("show");
  setTimeout(() => preview.classList.add("hidden"), 200);
}
