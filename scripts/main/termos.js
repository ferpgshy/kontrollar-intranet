// Índice de navegação
document.querySelectorAll(".terms-nav a").forEach((link) => {
  link.addEventListener("click", function (e) {
    document
      .querySelectorAll(".terms-nav a")
      .forEach((a) => a.classList.remove("active"));
    this.classList.add("active");
  });
});

// Scroll para seções
window.addEventListener("scroll", function () {
  const sections = document.querySelectorAll(".terms-section");
  const navLinks = document.querySelectorAll(".terms-nav a");

  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });

  // Botão de voltar ao topo
  const scrollTopBtn = document.getElementById("scrollTop");
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
});

// Botão de voltar ao topo
document.getElementById("scrollTop").addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Animações ao rolar
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  {
    threshold: 0.1,
  }
);

document.querySelectorAll(".terms-section").forEach((section) => {
  section.style.opacity = 0;
  section.style.transform = "translateY(20px)";
  section.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  observer.observe(section);
});
