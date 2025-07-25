// Clave de acceso
const ACCESS_KEY = "03-01-2025"; 

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

// ============================
// Cronograma
// ============================
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
    steps: ["Este día es sorpresa por tu cumpleaños 🎂"],
    locked: true
  },
  {
    date: "2025-08-15",
    title: "Viernes 15 de Agosto",
    steps: [
      "Un día picante y especial 🔥",
      "Comida increíble",
      "Momentos íntimos inolvidables ❤️",
      "Ir a mirar el vestido de grado 👗",
      "¡Habrá una sorpresa oculta! 🎉"
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
      if (card.classList.contains("locked") && today < event.date) {
        openPopup();
      } else {
        card.classList.toggle("open");
      }
    });

    timeline.appendChild(card);
  });
}

function openPopup() {
  document.getElementById("popup").classList.remove("hidden");
}
function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

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
