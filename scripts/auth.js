// Funcionalidade de login
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")
  const emailInput = document.getElementById("email")
  const passwordInput = document.getElementById("password")
  const togglePasswordBtn = document.getElementById("togglePassword")
  const submitBtn = document.getElementById("submitBtn")
  const errorMessage = document.getElementById("errorMessage")

  // Alternar visibilidade da senha
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", () => {
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
      passwordInput.setAttribute("type", type)

      const eyeIcon = document.getElementById("eyeIcon")
      if (type === "text") {
        eyeIcon.innerHTML = `
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        `
      } else {
        eyeIcon.innerHTML = `
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        `
      }
    })
  }

  // Envio do formulário
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = emailInput.value.trim()
      const password = passwordInput.value.trim()

      // Limpar erros anteriores
      errorMessage.style.display = "none"
      errorMessage.textContent = ""

      // Validação básica
      if (!email || !password) {
        showError("Email e senha são obrigatórios")
        return
      }

      // Estado de carregamento
      submitBtn.disabled = true
      submitBtn.textContent = "Entrando..."

      // Simulação de autenticação
      setTimeout(() => {
        if (email === "admin@kontrollar.com" && password === "admin123") {
          // Login como administrador
          const user = {
            id: 1,
            name: "Administrador",
            email: "admin@kontrollar.com",
            role: "admin",
          }
          localStorage.setItem("user", JSON.stringify(user))
          window.location.href = "dashboard.html"
        } else if (email && password) {
          // Login como usuário comum
          const user = {
            id: 2,
            name: "Usuário Demo",
            email: email,
            role: "developer",
          }
          localStorage.setItem("user", JSON.stringify(user))
          window.location.href = "dashboard.html"
        } else {
          showError("Credenciais inválidas")
          submitBtn.disabled = false
          submitBtn.textContent = "Entrar"
        }
      }, 1000)
    })
  }

  function showError(message) {
    errorMessage.textContent = message
    errorMessage.style.display = "block"
  }
})
