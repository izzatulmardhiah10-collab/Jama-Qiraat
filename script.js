const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const backToTop = document.querySelector(".back-to-top");

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  const isDark = body.classList.contains("dark-mode");
  themeIcon.textContent = isDark ? "☀" : "☾";
  localStorage.setItem("qiraat-theme", isDark ? "dark" : "light");
});

if (localStorage.getItem("qiraat-theme") === "dark") {
  body.classList.add("dark-mode");
  themeIcon.textContent = "☀";
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const item = trigger.closest(".accordion-item");
    document.querySelectorAll(".accordion-item").forEach((accordionItem) => {
      if (accordionItem !== item) accordionItem.classList.remove("active");
    });
    item.classList.toggle("active");
  });
});

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("show", window.scrollY > 600);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const questions = [
  {
    question: "Apakah maksud Jama' Qiraat?",
    answers: [
      "Menghimpunkan beberapa wajah bacaan qiraat dalam satu bacaan",
      "Membaca satu surah tanpa tajwid",
      "Menghafal nama imam sahaja",
      "Menulis semula ayat al-Quran"
    ],
    correct: 0
  },
  {
    question: "Apakah tujuan utama Jama' Qiraat dalam pembelajaran?",
    answers: [
      "Memudahkan perbandingan wajah bacaan antara imam qiraat",
      "Menggantikan bacaan talaqqi",
      "Menghapuskan khilaf qiraat",
      "Memendekkan semua hukum tajwid"
    ],
    correct: 0
  },
  {
    question: "Antara berikut, yang manakah syarat Jama' Qiraat?",
    answers: [
      "Menguasai usul setiap qari'",
      "Mengabaikan rumuz qiraat",
      "Membaca tanpa semakan",
      "Memilih bacaan secara rawak"
    ],
    correct: 0
  },
  {
    question: "Apakah yang perlu dikenal pasti pada langkah pertama analisis kalimah?",
    answers: [
      "Kalimah yang mempunyai khilaf qiraat",
      "Warna mushaf",
      "Bilangan halaman",
      "Nama pencetak"
    ],
    correct: 0
  },
  {
    question: "Selepas mengenal pasti kalimah khilaf, apakah langkah seterusnya?",
    answers: [
      "Menentukan wajah bacaan bagi setiap imam",
      "Menutup kitab rujukan",
      "Meninggalkan bacaan imam lain",
      "Menukar susunan ayat"
    ],
    correct: 0
  },
  {
    question: "Apakah maksud usul dalam konteks qiraat?",
    answers: [
      "Kaedah bacaan umum yang berulang bagi imam atau perawi",
      "Nama tempat belajar",
      "Senarai soalan peperiksaan",
      "Hiasan tulisan Arab"
    ],
    correct: 0
  },
  {
    question: "Mengapa simbol dan rumuz qiraat penting?",
    answers: [
      "Sebagai panduan mengenal imam, perawi, dan wajah bacaan",
      "Untuk mencantikkan halaman sahaja",
      "Untuk menggantikan guru",
      "Untuk menentukan markah tugasan"
    ],
    correct: 0
  },
  {
    question: "Apakah fungsi susunan bacaan dalam Jama' Qiraat?",
    answers: [
      "Mengatur wajah bacaan supaya lebih sistematik",
      "Menghapuskan semua perbezaan",
      "Menjadikan semua imam membaca sama",
      "Mengelakkan tajwid"
    ],
    correct: 0
  },
  {
    question: "Siapakah antara imam qiraat yang disenaraikan dalam susunan bacaan?",
    answers: [
      "Nafi'",
      "Imam al-Ghazali",
      "Ibn Sina",
      "Al-Farabi"
    ],
    correct: 0
  },
  {
    question: "Apakah langkah terakhir dalam proses analisis kalimah?",
    answers: [
      "Semak ketepatan bacaan",
      "Memadam catatan",
      "Menukar contoh bacaan",
      "Membaca tanpa guru"
    ],
    correct: 0
  }
];

let currentQuestion = 0;
const selectedAnswers = Array(questions.length).fill(null);

const questionCounter = document.getElementById("questionCounter");
const currentScore = document.getElementById("currentScore");
const progressBar = document.getElementById("progressBar");
const questionText = document.getElementById("questionText");
const answers = document.getElementById("answers");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const quizContent = document.getElementById("quizContent");
const resultScreen = document.getElementById("resultScreen");
const resultBadge = document.getElementById("resultBadge");
const resultTitle = document.getElementById("resultTitle");
const resultFeedback = document.getElementById("resultFeedback");
const restartBtn = document.getElementById("restartBtn");

function calculateScore() {
  return selectedAnswers.reduce((score, answer, index) => {
    return answer === questions[index].correct ? score + 1 : score;
  }, 0);
}

function renderQuestion() {
  const item = questions[currentQuestion];
  questionCounter.textContent = `Soalan ${currentQuestion + 1} / ${questions.length}`;
  currentScore.textContent = `Skor: ${calculateScore()}`;
  progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  questionText.textContent = item.question;
  answers.innerHTML = "";

  item.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-option";
    button.type = "button";
    button.textContent = answer;
    if (selectedAnswers[currentQuestion] === index) {
      button.classList.add("selected");
    }
    button.addEventListener("click", () => {
      selectedAnswers[currentQuestion] = index;
      renderQuestion();
    });
    answers.appendChild(button);
  });

  prevBtn.disabled = currentQuestion === 0;
  nextBtn.textContent = currentQuestion === questions.length - 1 ? "Lihat Keputusan" : "Seterusnya";
}

function showResult() {
  const score = calculateScore();
  const percentage = Math.round((score / questions.length) * 100);
  let category = "🔄 Perlu Ulang Kaji";
  let feedback = "Teruskan ulang kaji syarat, langkah analisis, dan susunan bacaan Jama' Qiraat.";

  if (percentage >= 90) {
    category = "🌟 Mumtaz";
    feedback = "Tahniah, kefahaman anda sangat cemerlang dan tersusun.";
  } else if (percentage >= 70) {
    category = "👍 Jayyid Jiddan";
    feedback = "Bagus, anda menguasai kebanyakan konsep utama dengan baik.";
  } else if (percentage >= 50) {
    category = "📚 Jayyid";
    feedback = "Baik, namun beberapa topik masih perlu diperkukuh melalui latihan tambahan.";
  }

  quizContent.hidden = true;
  document.querySelector(".quiz-actions").hidden = true;
  resultScreen.hidden = false;
  questionCounter.textContent = "Latihan selesai";
  currentScore.textContent = `Skor: ${score} / ${questions.length}`;
  progressBar.style.width = "100%";
  resultBadge.textContent = category.split(" ")[0];
  resultTitle.textContent = `${category} - ${percentage}%`;
  resultFeedback.textContent = feedback;
}

prevBtn.addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion -= 1;
    renderQuestion();
  }
});

nextBtn.addEventListener("click", () => {
  if (selectedAnswers[currentQuestion] === null) {
    alert("Sila pilih jawapan sebelum meneruskan.");
    return;
  }

  if (currentQuestion === questions.length - 1) {
    showResult();
    return;
  }

  currentQuestion += 1;
  renderQuestion();
});

restartBtn.addEventListener("click", () => {
  currentQuestion = 0;
  selectedAnswers.fill(null);
  quizContent.hidden = false;
  document.querySelector(".quiz-actions").hidden = false;
  resultScreen.hidden = true;
  renderQuestion();
});

renderQuestion();
