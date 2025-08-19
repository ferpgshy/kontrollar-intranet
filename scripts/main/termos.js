document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".terms-nav a")
  const sections = document.querySelectorAll(".terms-section")
  const scrollTopBtn = document.getElementById("scrollTop")

  function updateActiveLink() {
    let currentSectionId = ""
    const scrollPosition = window.scrollY + 150

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i]
      const sectionTop = section.offsetTop - 200

      if (scrollPosition >= sectionTop) {
        currentSectionId = `#${section.getAttribute("id")}`
        break
      }
    }

    if (!currentSectionId && sections.length > 0) {
      currentSectionId = `#${sections[0].getAttribute("id")}`
    }

    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === currentSectionId) {
        link.classList.add("active")
      }
    })
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        const headerHeight = document.querySelector(".header").offsetHeight
        const offset = headerHeight + 30

        window.removeEventListener("scroll", scrollHandler)

        window.scrollTo({
          top: targetSection.offsetTop - offset,
          behavior: "smooth",
        })

        navLinks.forEach((a) => a.classList.remove("active"))
        this.classList.add("active")

        setTimeout(() => {
          window.addEventListener("scroll", scrollHandler)
        }, 1000)
      }
    })
  })

  let scrollTimeout
  function scrollHandler() {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }

    scrollTimeout = setTimeout(() => {
      updateActiveLink()

      if (window.scrollY > 400) {
        scrollTopBtn.classList.add("show")
      } else {
        scrollTopBtn.classList.remove("show")
      }
    }, 50)
  }

  window.addEventListener("scroll", scrollHandler)

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1
        entry.target.style.transform = "translateY(0)"

        const animatedElements = entry.target.querySelectorAll(
          ".feature-item, .security-item, .support-item, .compliance-item, .contact-item, .legal-item, .pricing-item",
        )
        animatedElements.forEach((el, index) => {
          setTimeout(() => {
            el.style.opacity = 1
            el.style.transform = "translateY(0)"
          }, index * 100)
        })
      }
    })
  }, observerOptions)

  sections.forEach((section) => {
    section.style.opacity = 0
    section.style.transform = "translateY(30px)"
    section.style.transition = "opacity 0.8s ease, transform 0.8s ease"
    observer.observe(section)

    const animatedElements = section.querySelectorAll(
      ".feature-item, .security-item, .support-item, .compliance-item, .contact-item, .legal-item, .pricing-item",
    )
    animatedElements.forEach((el) => {
      el.style.opacity = 0
      el.style.transform = "translateY(20px)"
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    })
  })

  if (!window.location.hash) {
    const firstLink = document.querySelector(".terms-nav a")
    if (firstLink) {
      firstLink.classList.add("active")
    }
  } else {
    const targetLink = document.querySelector(`.terms-nav a[href="${window.location.hash}"]`)
    if (targetLink) {
      navLinks.forEach((link) => link.classList.remove("active"))
      targetLink.classList.add("active")
    }
  }

  updateActiveLink()
})

const addPrintStyles = () => {
  const printStyles = `
    @media print {
      .terms-nav, .scroll-top, .header, .footer { display: none !important; }
      .terms-wrapper { flex-direction: column; max-width: none; padding: 0; }
      .terms-section { break-inside: avoid; margin-bottom: 2rem; padding: 1rem; }
      .terms-section h2 { break-after: avoid; }
      body { font-size: 12pt; line-height: 1.4; }
    }
  `

  const styleSheet = document.createElement("style")
  styleSheet.textContent = printStyles
  document.head.appendChild(styleSheet)
}

addPrintStyles()
