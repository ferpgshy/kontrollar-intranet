document.addEventListener("DOMContentLoaded", () => {
  const cadastroForm = document.getElementById("cadastroForm")
  const nameInput = document.getElementById("name")
  const emailInput = document.getElementById("email")
  const passwordInput = document.getElementById("password")
  const confirmPasswordInput = document.getElementById("confirmPassword")
  const acceptTermsCheckbox = document.getElementById("acceptTerms")
  const togglePasswordBtn = document.getElementById("togglePassword")
  const toggleConfirmPasswordBtn = document.getElementById("toggleConfirmPassword")
  const submitBtn = document.getElementById("submitBtn")
  const errorMessage = document.getElementById("errorMessage")

  function setupPasswordToggle(button, input) {
    if (button && input) {
      button.addEventListener("click", () => {
        const type = input.getAttribute("type") === "password" ? "text" : "password"
        input.setAttribute("type", type)

        const icon = button.querySelector(".icon")
        if (type === "text") {
          icon.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          `
        } else {
          icon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          `
        }
      })
    }
  }

  setupPasswordToggle(togglePasswordBtn, passwordInput)
  setupPasswordToggle(toggleConfirmPasswordBtn, confirmPasswordInput)

  if (cadastroForm) {
    cadastroForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const name = nameInput.value.trim()
      const email = emailInput.value.trim()
      const password = passwordInput.value.trim()
      const confirmPassword = confirmPasswordInput.value.trim()
      const acceptTerms = acceptTermsCheckbox.checked

      errorMessage.style.display = "none"
      errorMessage.textContent = ""

      if (!name || !email || !password || !confirmPassword) {
        showError("Todos os campos são obrigatórios")
        return
      }

      if (password !== confirmPassword) {
        showError("As senhas não coincidem")
        return
      }

      if (password.length < 6) {
        showError("A senha deve ter pelo menos 6 caracteres")
        return
      }

      if (!acceptTerms) {
        showError("Você deve aceitar os Termos de Serviço")
        return
      }

      submitBtn.disabled = true
      submitBtn.textContent = "Criando conta..."

      setTimeout(() => {
        const user = {
          id: Date.now(),
          name: name,
          email: email,
          role: "developer",
        }
        localStorage.setItem("user", JSON.stringify(user))
        window.location.href = "dashboard.html"
      }, 1500)
    })
  }

  function showError(message) {
    errorMessage.textContent = message
    errorMessage.style.display = "block"
  }
})
