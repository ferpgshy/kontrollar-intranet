document.addEventListener("DOMContentLoaded", () => {
  const cadastroForm = document.getElementById("cadastroForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const acceptTermsCheckbox = document.getElementById("acceptTerms");
  const togglePasswordBtn = document.getElementById("togglePassword");
  const toggleConfirmPasswordBtn = document.getElementById("toggleConfirmPassword");
  const submitBtn = document.getElementById("submitBtn");
  const errorMessage = document.getElementById("errorMessage");
  const API = (window.API_BASE_URL || "") + "/auth";

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
  }
  function hideError() {
    errorMessage.style.display = "none";
    errorMessage.textContent = "";
  }
  async function readJsonSafe(res) {
    const text = await res.text();
    if (!text) return null;
    try { return JSON.parse(text); } catch { return { _raw: text }; }
  }

  function setupPasswordToggle(button, input) {
    if (button && input) {
      button.addEventListener("click", () => {
        const type = input.getAttribute("type") === "password" ? "text" : "password";
        input.setAttribute("type", type);
        const icon = button.querySelector(".icon");
        if (icon) {
          icon.innerHTML = type === "text"
            ? `<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`
            : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
        }
      });
    }
  }

  setupPasswordToggle(togglePasswordBtn, passwordInput);
  setupPasswordToggle(toggleConfirmPasswordBtn, confirmPasswordInput);

  if (cadastroForm) {
    cadastroForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nomeCompleto = nameInput.value.trim();
      const email = emailInput.value.trim();
      const senha = passwordInput.value.trim();
      const confirm = confirmPasswordInput.value.trim();
      const acceptTerms = !!acceptTermsCheckbox?.checked;

      hideError();

      if (!nomeCompleto || !email || !senha || !confirm) {
        return showError("Todos os campos são obrigatórios");
      }
      if (senha !== confirm) return showError("As senhas não coincidem");
      if (senha.length < 6) return showError("A senha deve ter pelo menos 6 caracteres");
      if (!acceptTerms) return showError("Você deve aceitar os Termos de Serviço");

      submitBtn.disabled = true;
      submitBtn.textContent = "Criando conta...";

      try {
        const res = await fetch(`${API}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nomeCompleto, email, senha })
        });
        const data = await readJsonSafe(res);
        if (!res.ok) {
          const msg = data?.error || `Falha ao registrar (${res.status})`;
          throw new Error(msg);
        }

        const user = {
          id: data.id,
          name: [data.nome, data.sobrenome].filter(Boolean).join(" "),
          email: data.email,
          role: data.cargo || "usuario",
          avatar_base64: data.avatar_base64 || null
        };
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "dashboard.html";
      } catch (err) {
        showError(err.message || "Erro ao criar conta");
        submitBtn.disabled = false;
        submitBtn.textContent = "Criar conta";
      }
    });
  }
});
