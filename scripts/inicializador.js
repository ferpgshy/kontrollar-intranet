document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  document.body.dataset.userId = String(user.id);
  
  IniciarDashboard(user);
  if (typeof configurarEventos === "function") configurarEventos();

  // NOVO: resolve página inicial de forma determinística
  const pageFromHash = (location.hash || "").replace("#", "");
  const saved = localStorage.getItem("activePage");
  const page = pageFromHash || saved || "dashboard";

  if (typeof navigate === "function") navigate(page);
  else carregarConteudoPagina(page);
});

// NOVO: única função de navegação
if (typeof window.navigate !== "function") {
  window.navigate = function(page) {
    // marca a aba ativa para outros módulos (ex.: perfil.js)
    document.body.dataset.activeTab = page;

    // persiste a última aba
    localStorage.setItem("activePage", page);

    // mantém o hash sincronizado (bom para recarregar direto na aba)
    const hash = "#" + page;
    if (location.hash !== hash) {
      try { history.replaceState(null, "", hash); } catch {}
    }

    // renderiza o conteúdo da aba
    carregarConteudoPagina(page);
  };
}

function IniciarDashboard(user) {
  const userName   = document.getElementById("userName");
  const userRole   = document.getElementById("userRole");
  const userAvatar = document.getElementById("userAvatar");

  if (userName)   userName.textContent = user.name;
  if (userRole)   userRole.textContent = cargosLabel(user.role);
  if (userAvatar) userAvatar.textContent = getInitials(user.name);
}

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

if (typeof window.cargosLabel !== "function") {
  window.cargosLabel = function cargosLabel(role) {
    const map = {
      admin: "Administrador",
      manager: "Gestor",
      developer: "Desenvolvedor",
      client: "Cliente",
      user: "Usuário",
      "Administrador":"Administrador",
      "Gestor":"Gestor",
      "Desenvolvedor":"Desenvolvedor",
      "Cliente":"Cliente",
      "Usuário":"Usuário"
    };
    return map[role] || "Usuário";
  };
}


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

if (typeof window.loadPerfilContent !== 'function') {
  window.loadPerfilContent = function () {
    // garante que o perfil saiba quem é o usuário
    if (!document.body.dataset.userId) {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      if (u?.id) document.body.dataset.userId = String(u.id);
    }
    window.renderPerfil?.({ userId: document.body.dataset.userId });
  };
}
