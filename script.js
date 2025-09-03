// Palabras de la sopa
const words = ["INCREIBLE", "HERMOSA", "FUERTE", "PODEROSA"];
let found = [];

// Config
const gridSize = 12;
const gridElement = document.getElementById("grid");

// Crear matriz
let grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));

// Colocar palabra
function placeWord(word) {
  const dir = Math.random() < 0.5 ? "H" : "V";
  const maxRow = dir === "H" ? gridSize : gridSize - word.length;
  const maxCol = dir === "H" ? gridSize - word.length : gridSize;
  const row = Math.floor(Math.random() * maxRow);
  const col = Math.floor(Math.random() * maxCol);

  for (let i = 0; i < word.length; i++) {
    if (dir === "H") grid[row][col + i] = word[i];
    else grid[row + i][col] = word[i];
  }
}
words.forEach(placeWord);

// Rellenar con letras random
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
for (let r = 0; r < gridSize; r++) {
  for (let c = 0; c < gridSize; c++) {
    if (!grid[r][c]) {
      grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
    }
  }
}

// Pintar la sopa
gridElement.style.gridTemplateColumns = `repeat(${gridSize}, 32px)`;
for (let r = 0; r < gridSize; r++) {
  for (let c = 0; c < gridSize; c++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = grid[r][c];
    gridElement.appendChild(cell);
  }
}

// Selección de letras
let selection = [];
gridElement.addEventListener("click", (e) => {
  if (!e.target.classList.contains("cell")) return;
  e.target.classList.toggle("selected");
  selection.push(e.target.textContent);
  if (selection.length > 15) selection.shift();

  const selectedWord = selection.join("");
  words.forEach((w) => {
    if (selectedWord.includes(w) && !found.includes(w)) {
      found.push(w);
      document.querySelectorAll(".cell.selected").forEach((cell) => {
        cell.classList.remove("selected");
        cell.classList.add("found");
      });
      document.getElementById("foundWords").textContent =
        `Palabras encontradas: ${found.length}/4`;

      if (found.length === words.length) {
        document.getElementById("wordsearch-container").classList.add("hidden");
        document.getElementById("gifts").classList.remove("hidden");
        createFallingEmojis("✨", 50);
      }
    }
  });
});

// Animaciones
function createFallingEmojis(emoji, count = 20) {
  const container = document.getElementById("animation-container");
  for (let i = 0; i < count; i++) {
    const span = document.createElement("span");
    span.textContent = emoji;
    span.classList.add("falling");
    span.style.left = Math.random() * 100 + "vw";
    span.style.animationDuration = (2 + Math.random() * 3) + "s";
    span.style.fontSize = (20 + Math.random() * 20) + "px";
    container.appendChild(span);
    span.addEventListener("animationend", () => span.remove());
  }
}

// 🎶 Quiz musical
const mesCard = document.getElementById("mesCard");
const quiz = document.getElementById("quiz");
const coupon = document.getElementById("coupon");
const song = document.getElementById("song");

mesCard.addEventListener("click", () => {
  quiz.classList.remove("hidden");
  mesCard.classList.add("hidden");
});

document.querySelectorAll("#quiz .option").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.textContent === "Tu Jardín con Enanitos") {
      quiz.classList.add("hidden");
      coupon.classList.remove("hidden");
      song.play();
      createFallingEmojis("💋", 30);
    } else {
      alert("Ups, esa no fue nuestra primera canción 😅");
    }
  });
});

// 🎓 Desbloqueo grado
const unlockDate = new Date("2025-09-05T00:00:00");
if (new Date() >= unlockDate) {
  document.getElementById("gradoLocked").classList.add("hidden");
  document.getElementById("gradoUnlocked").classList.remove("hidden");
  createFallingEmojis("🌹", 40);
}
