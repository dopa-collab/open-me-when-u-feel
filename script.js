/* =====================================================================
   EDIT ME: your mood messages
   Each mood now holds 4 separate letters — she can flip through them
   with the arrows/dots once a card is open. Edit the strings inside
   each `letters` array. Add or remove strings if you want more or
   fewer than 4 for a given mood (the dots adjust automatically).
   ===================================================================== */
/* =====================================================================
   EDIT ME: the password
   Change the text below (keep the quotes) to whatever you want the
   password to be. Note this is a basic gate, not real security — the
   password lives in this file, so it's fine for keeping casual visitors
   out, but not for anything truly sensitive.
   ===================================================================== */
const SITE_PASSWORD = "bluebell";

/* ===================================================================== */

const MOODS = [
  { key: "sad", icon: "☁", label: "sad", letters: [
      "This feeling won't last forever, even when it feels like it will.",
      "It's okay to not be okay right now.",
      "Indeed, with hardship comes ease.(94:5-6)",
      "Your Lord has not forsaken you, nor does He hate you.(93:3)",
  ]},
  { key: "depressed", icon: "😓", label: "depressed", letters: [
      "Allah will bring about ease after hardship(65:7)",
      "Some days, simply existing is the bravest thing you'll do",
      "Allah does not burden a soul beyond what it can bear(2:286)",
      "You don't have to have it all figured out to keep going",
  ]},
  { key: "anxious", icon: "◌", label: "anxious", letters: [
      "In the remembrance of Allah do hearts find rest.(13:28)",
      "Allah is sufficient for us, and He is the best Disposer of affairs(3:173)",
      "i know its hard and i feel you . theres always a safe place for you and your thoughts",
      "Fear speaks loudly, but it rarely speaks the truth",
  ]},
  { key: "happy", icon: "✺", label: "happy", letters: [
      "happy to know that ur happy . if u r reading this just know im happy for u and u totalyy deserve this happines and more",
      "u smiled ,u made the journy much beauty for the rest of us",
      "just know that u r worthy of all the good things that happens to u and more",
      "Hold onto this feeling — you deserve it",
  ]},
  { key: "stressed", icon: "❋", label: "stressed", letters: [
      "take it easy on ur self its okay to feel this way ,it will be okay in end ",
      "Be patient — Allah is with the patient",
      "You're doing better than you think",
      "never underestimate yourself, u r doing well keepit up and dont give up ",
  ]},
  { key: "lonely", icon: "✦", label: "lonely", letters: [
      "take it easy , u r never alone again,allah with u , im with u ,even without talking theres always someone by ur side and will always have a place for u ",
      "its alright to feel this way ,just give it some time ",
      "You matter, even in the quiet moments",
      "u r remembred and never frgotten , how can anyone forget such an ineffable person like ur self",
  ]},
  { key: "angry", icon: "◈", label: "angry", letters: [
      "It's okay to feel this — just don't let it control you",
      "Those who restrain anger and pardon people — Allah loves them (3:134)",
  ]},
  { key: "tired", icon: "☾", label: "tired / overwhelmed", letters: [
      "Being tired doesn't mean you're weak — it means you've been strong for a while give ur self some time to rest",
      "You don't have to do everything today",
      "Allah does not let the reward of the good-doers go to waste(11:115)",
      "Indeed, with hardship comes ease(94:5-6)",
  ]},
];

/* ===================================================================== */

const screens = {
  password: document.getElementById("screen-password"),
  envelope: document.getElementById("screen-envelope"),
  letter: document.getElementById("screen-letter"),
  theme: document.getElementById("screen-theme"),
  main: document.getElementById("screen-main"),
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("screen--active"));
  screens[name].classList.add("screen--active");
}

/* ---- Password gate ---- */
const passwordForm = document.getElementById("passwordForm");
const passwordInput = document.getElementById("passwordInput");
const passwordError = document.getElementById("passwordError");
const passwordCard = document.querySelector("#screen-password .paper");

passwordForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const entered = passwordInput.value.trim().toLowerCase();

  if (entered === SITE_PASSWORD.trim().toLowerCase()) {
    showScreen("envelope");
  } else {
    passwordError.hidden = false;
    passwordInput.value = "";
    passwordInput.focus();
    passwordCard.classList.remove("is-shaking");
    // restart the shake animation even on repeated wrong guesses
    void passwordCard.offsetWidth;
    passwordCard.classList.add("is-shaking");
  }
});

/* ---- Envelope opening ---- */
const envelope = document.getElementById("envelope");
const waxSeal = document.getElementById("waxSeal");

waxSeal.addEventListener("click", () => {
  envelope.classList.add("is-open");
  waxSeal.disabled = true;
  setTimeout(() => {
    showScreen("letter");
  }, 700);
});

/* ---- Letter -> theme picker ---- */
document.getElementById("closeLetter").addEventListener("click", () => {
  const savedTheme = localStorage.getItem("siteTheme");
  if (savedTheme) {
    applyTheme(savedTheme);
    showScreen("main");
  } else {
    showScreen("theme");
  }
});

/* ---- Theme picker ---- */
function applyTheme(themeClass) {
  document.body.className = themeClass;
  localStorage.setItem("siteTheme", themeClass);
}

document.querySelectorAll(".swatch").forEach(btn => {
  btn.addEventListener("click", () => {
    applyTheme(btn.dataset.theme);
    showScreen("main");
  });
});

/* ---- Mood grid ---- */
const moodGrid = document.getElementById("moodGrid");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalMoodLabel = document.getElementById("modalMoodLabel");
const modalMoodText = document.getElementById("modalMoodText");
const letterDots = document.getElementById("letterDots");
const prevLetterBtn = document.getElementById("prevLetter");
const nextLetterBtn = document.getElementById("nextLetter");

let currentMood = null;
let currentLetterIndex = 0;

MOODS.forEach(mood => {
  const card = document.createElement("button");
  card.className = "mood-card";
  card.innerHTML = `<span class="mood-card__icon" aria-hidden="true">${mood.icon}</span>${mood.label}`;
  card.addEventListener("click", () => openMoodModal(mood));
  moodGrid.appendChild(card);
});

function openMoodModal(mood) {
  currentMood = mood;
  currentLetterIndex = 0;
  renderLetter();
  modalBackdrop.classList.add("is-visible");
}

function renderLetter() {
  const letters = currentMood.letters;
  modalMoodLabel.textContent = currentMood.label;
  modalMoodText.innerHTML = `<p>${letters[currentLetterIndex]}</p>`;

  // dots
  letterDots.innerHTML = "";
  letters.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className = "letter-nav__dot" + (i === currentLetterIndex ? " is-current" : "");
    letterDots.appendChild(dot);
  });

  prevLetterBtn.disabled = currentLetterIndex === 0;
  nextLetterBtn.disabled = currentLetterIndex === letters.length - 1;
}

prevLetterBtn.addEventListener("click", () => {
  if (currentLetterIndex > 0) {
    currentLetterIndex--;
    renderLetter();
  }
});

nextLetterBtn.addEventListener("click", () => {
  if (currentLetterIndex < currentMood.letters.length - 1) {
    currentLetterIndex++;
    renderLetter();
  }
});

document.getElementById("closeModal").addEventListener("click", () => {
  modalBackdrop.classList.remove("is-visible");
});

modalBackdrop.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) modalBackdrop.classList.remove("is-visible");
});

document.addEventListener("keydown", (e) => {
  if (!modalBackdrop.classList.contains("is-visible")) return;
  if (e.key === "Escape") modalBackdrop.classList.remove("is-visible");
  if (e.key === "ArrowLeft") prevLetterBtn.click();
  if (e.key === "ArrowRight") nextLetterBtn.click();
});

/* ---- Footer links on main screen ---- */
document.getElementById("rereadLetter").addEventListener("click", () => {
  showScreen("letter");
});

document.getElementById("changeTheme").addEventListener("click", () => {
  showScreen("theme");
});

/* ---- Initial state ---- */
showScreen("password");
