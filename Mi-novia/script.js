// ===== Configuración de acceso general =====
const ACCESS_KEY = "03-01-2025"; // cámbiala si quieres

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

// Mensaje “ya faltan pocos días ⏰” en la pantalla de acceso
(function showSoonMessage() {
  const startDate = new Date("2025-08-13T00:00:00");
  const now = new Date();
  const days = Math.max(0, Math.ceil((startDate - now) / (1000 * 60 * 60 * 24)));
  const soon = document.getElementById("soon-msg");
  soon.textContent = `⏰ Ya faltan ${days} día${days === 1 ? "" : "s"}...`;
})();

// ===== Cronograma =====
const events = [
  {
    date: "2025-08-13",
    title: "Miércoles 13 de Agosto",
    steps: [
      "Llegada al aeropuerto ✈️",
      "Desayuno en un lugar bonito 🍳",
      "Almuerzo delicioso 🥗",
      "Películas + Pizza 🍕 con misterio y diversión"
    ],
    locked: false
  },
  {
    date: "2025-08-14",
    title: "Jueves 14 de Agosto",
    steps: [
      "Cena elegante 🍽️🎩",
      "Desayuno sorpresa con tickets de regalo 🎟️🎁",
      "Ramo de flores 💐"
    ],
    locked: true,          // Sigue bloqueado por fecha
    requiresPass: true     // y además requiere contraseña al abrir
  },
  {
    date: "2025-08-15",
    title: "Viernes 15 de Agosto",
    steps: [
      "Comida especial 🍽️",
      "Sabores del mundo: Corea 🇰🇷 y México 🇲🇽",
      "Momentos para capturar juntos 📷"
    ],
    locked: false
  },
  {
    date: "2025-08-16",
    title: "Sábado 16 de Agosto",
    steps: ["Este día está sellado, ¡sorpresa! 🤫"],
    locked: true
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

// Contraseña para ver el detalle del Jueves (puedes cambiarla)
const THURSDAY_PASS = "miamor"; 

let pendingOpenCard = null; // tarjeta que espera validación de contraseña

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
      // Si está bloqueado por fecha → popup de espera
      if (card.classList.contains("locked") && today < event.date) {
        openPopup();
        return;
      }
      // Si requiere contraseña (Jueves) → abrir modal y validar
      if (event.requiresPass) {
        pendingOpenCard = card;
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
  if (val === THURSDAY_PASS) {
    if (pendingOpenCard) pendingOpenCard.classList.toggle("open");
    closePassModal();
  } else {
    err.textContent = "Contraseña incorrecta. Intenta de nuevo 💔";
  }
}

// ====== Contador ======
function updateCountdown() {
  const countdownTo = new Date("2025-08-13T00:00:00");
  const now = new Date();
  const timeLeft = countdownTo - now;
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);
  document.getElementById("timer").textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

renderEvents();
setInterval(updateCountdown, 1000);
updateCountdown();
