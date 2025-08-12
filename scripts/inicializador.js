// ---------- Inicialização da Dashboard ----------
document.addEventListener("DOMContentLoaded", () => {
  // Verificar Auth
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Preenche header do usuário
  IniciarDashboard(user);

  // Eventos de UI (menu, botão Novo, logout, etc.)
  if (typeof configurarEventos === "function") {
    configurarEventos();
  }

  // Deixe o roteador do app.js carregar a página atual pelo hash.
  // Se não houver hash, use a última aba salva ou "dashboard".
  if (!location.hash) {
    const saved = localStorage.getItem("activePage") || "dashboard";
    if (typeof navigate === "function") navigate(saved);
  }
});

// ---------- Header (nome/cargo/avatar) ----------
function IniciarDashboard(user) {
  const userName   = document.getElementById("userName");
  const userRole   = document.getElementById("userRole");
  const userAvatar = document.getElementById("userAvatar");

  if (userName)   userName.textContent = user.name;
  if (userRole)   userRole.textContent = cargosLabel(user.role);
  if (userAvatar) userAvatar.textContent = getInitials(user.name);
}

// ---------- Helpers seguros (evita redefinir se já existem) ----------
if (typeof window.cargosLabel !== "function") {
  window.cargosLabel = function cargosLabel(role) {
    const roles = {
      admin: "Administrador",
      manager: "Gestor",
      developer: "Desenvolvedor",
      client: "Cliente",
    };
    return roles[role] || "Usuário";
  };
}

if (typeof window.getInitials !== "function") {
  window.getInitials = function getInitials(name) {
    return String(name)
      .trim()
      .split(/\s+/)
      .map(n => n[0] || "")
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  };
}

// ---------- Dispatcher de páginas (usado pelo roteador) ----------
function carregarConteudoPagina(page) {
  const conteudoPagina = document.getElementById("conteudoPagina");
  if (!conteudoPagina) return;

  switch (page) {
    case "dashboard":
      if (typeof carregarConteudoDashboard === "function") carregarConteudoDashboard();
      break;
    case "projetos":
      if (typeof carregarConteudoProjetos === "function") carregarConteudoProjetos();
      break;
    case "backlog":
      if (typeof carregarConteudoBacklog === "function") carregarConteudoBacklog();
      break;
    case "calendarioio":
      if (typeof carregarConteudoCalendario === "function") carregarConteudoCalendario();
      break;
    case "chat":
      if (typeof carregarConteudoChat === "function") carregarConteudoChat();
      break;
    case "equipes":
      if (typeof loadEquipesContent === "function") loadEquipesContent();
      break;
    case "avisos":
      if (typeof loadAvisosContent === "function") loadAvisosContent();
      break;
    case "perfil":
      if (typeof loadPerfilContent === "function") loadPerfilContent();
      break;
    case "configuracoes":
      if (typeof loadConfiguracoesContent === "function") loadConfiguracoesContent();
      break;
    default:
      if (typeof carregarConteudoDashboard === "function") carregarConteudoDashboard();
  }
}
