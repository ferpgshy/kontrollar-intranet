document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const togglePasswordBtn = document.getElementById("togglePassword");
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
    try { return JSON.parse(text); } catch {  
      return { _raw: text };
    }
  }

  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", () => {
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      const eyeIcon = document.getElementById("eyeIcon");
      if (eyeIcon) {
        eyeIcon.innerHTML = type === "text"
          ? `<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`
          : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      const senha = passwordInput.value.trim();

      hideError();
      if (!email || !senha) return showError("Email e senha são obrigatórios");

      submitBtn.disabled = true;
      submitBtn.textContent = "Entrando...";

      try {
        const res = await fetch(`${API}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha })
        });

        const data = await readJsonSafe(res);
        if (!res.ok) {
          const msg = data?.error || `Falha no login (${res.status})`;
          throw new Error(msg);
        }

        const user = {
          id: data.id,
          name: [data.nome, data.sobrenome].filter(Boolean).join(" "),
          email: data.email,
          role: data.cargo || "user",
          avatar_base64: data.avatar_base64 || null
        };
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "dashboard.html";
      } catch (err) {
        showError(err.message || "Erro ao autenticar");
        submitBtn.disabled = false;
        submitBtn.textContent = "Entrar";
      }
    });
  }
});
