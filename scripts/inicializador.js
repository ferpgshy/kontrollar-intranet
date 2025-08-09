// Funcionalidade da Dashboard
document.addEventListener("DOMContentLoaded", () => {
  // Verificar Auth
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Inicializador
  IniciarDashboard(user);
  carregarConteudoDashboard();
  configurarEventos();
});

function IniciarDashboard(user) {
  // Atualiza o nome do usuário, cargo e avatar
  const userName = document.getElementById("userName");
  const userRole = document.getElementById("userRole");
  const userAvatar = document.getElementById("userAvatar");

  if (userName) userName.textContent = user.name;
  if (userRole) userRole.textContent = cargosLabel(user.role);
  if (userAvatar) userAvatar.textContent = getInitials(user.name);
}

function cargosLabel(role) {
  const roles = {
    admin: "Administrador",
    manager: "Gestor",
    developer: "Desenvolvedor",
    client: "Cliente",
  };
  return roles[role] || "Usuário";
}

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}