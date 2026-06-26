// عناصر التنقل والوضع الليلي
const menuToggle = document.getElementById("menu-toggle");
const navPanel = document.getElementById("nav-panel");
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const themeText = document.querySelector(".theme-text");
const backToTop = document.getElementById("back-to-top");
const navLinks = document.querySelectorAll(".nav-links a");

// القائمة المتجاوبة في الجوال
menuToggle.addEventListener("click", () => {
  const isOpen = navPanel.classList.toggle("open");
  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "إغلاق القائمة" : "فتح القائمة");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navPanel.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "فتح القائمة");
  });
});

// حفظ تفضيل الوضع الليلي محليًا
const savedTheme = localStorage.getItem("jamaat-theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  themeIcon.textContent = "☀";
  themeText.textContent = "الوضع النهاري";
}

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("jamaat-theme", isDark ? "dark" : "light");
  themeIcon.textContent = isDark ? "☀" : "☾";
  themeText.textContent = isDark ? "الوضع النهاري" : "الوضع الليلي";
});

// أكورديون ترتيب القراءات
const accordionItems = document.querySelectorAll(".accordion-item");
accordionItems.forEach((item) => {
  const trigger = item.querySelector(".accordion-trigger");

  trigger.addEventListener("click", () => {
    const isActive = item.classList.contains("active");

    accordionItems.forEach((currentItem) => {
      currentItem.classList.remove("active");
      currentItem.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
    });

    if (!isActive) {
      item.classList.add("active");
      trigger.setAttribute("aria-expanded", "true");
    }
  });
});

// التحقق من نموذج التواصل
const contactForm = document.getElementById("contact-form");
const successMessage = document.getElementById("success-message");

const fields = {
  name: {
    input: document.getElementById("name"),
    error: document.getElementById("name-error"),
    message: "يرجى إدخال الاسم."
  },
  email: {
    input: document.getElementById("email"),
    error: document.getElementById("email-error"),
    message: "يرجى إدخال بريد إلكتروني صحيح."
  },
  message: {
    input: document.getElementById("message"),
    error: document.getElementById("message-error"),
    message: "يرجى كتابة الرسالة."
  }
};

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm() {
  let isValid = true;
  Object.values(fields).forEach(({ error }) => {
    error.textContent = "";
  });

  if (fields.name.input.value.trim().length < 2) {
    fields.name.error.textContent = fields.name.message;
    isValid = false;
  }

  if (!isEmailValid(fields.email.input.value.trim())) {
    fields.email.error.textContent = fields.email.message;
    isValid = false;
  }

  if (fields.message.input.value.trim().length < 8) {
    fields.message.error.textContent = fields.message.message;
    isValid = false;
  }

  return isValid;
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  successMessage.textContent = "";

  if (!validateForm()) {
    return;
  }

  contactForm.reset();
  successMessage.textContent = "تم إرسال رسالتك بنجاح. شكرًا لتواصلك معنا.";
});

// ظهور العناصر عند التمرير
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

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

// تفعيل رابط القسم الحالي وزر العودة للأعلى
const sections = document.querySelectorAll("main section[id]");

function updateScrollState() {
  const scrollPosition = window.scrollY + 120;

  backToTop.classList.toggle("visible", window.scrollY > 520);

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    const link = document.querySelector(`.nav-links a[href="#${section.id}"]`);

    if (link && scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      navLinks.forEach((navLink) => navLink.classList.remove("active"));
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("load", updateScrollState);

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
 