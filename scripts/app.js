// Inicializa a UI de notificações quando o DOM estiver pronto
(function bootNotifs() {
  const start = () => {
    if (!window.Notifs) {
      console.warn("Notifs não encontrado. Verifique a ordem dos <script>.");
      return;
    }
    Notifs.initUI({
      bellSelector:  "#botaoNotificacao",
      panelSelector: "#painelNotificacao",
      closeSelector: "#fecharNotificacao",
      listSelector:  "#listaNotificacoes" // será criado se não existir
    });
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();

function configurarEventos() {
  // Barra Lateral
  const controleSidebar = document.getElementById("controleSidebar");
  const celularcontroleSidebar = document.getElementById("celularcontroleSidebar");
  const sidebar = document.getElementById("sidebar");

  controleSidebar?.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });
  celularcontroleSidebar?.addEventListener("click", () => {
    sidebar.classList.toggle("celular-open");
  });

  // Navegação
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = link.getAttribute("data-page");
      if (page) {
        definirPaginaAtiva(page);
        carregarConteudoPagina(page);
      }
    });
  });

  // Botão "Novo" (cabeçalho)
  configurarBotaoNovoCabecalho();

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      const confirmado = await confirmarModal({
        title: "Confirmação",
        message: "Tem certeza que deseja sair?",
      });
      if (confirmado) {
        localStorage.removeItem("user");
        window.location.href = "login.html";
      }
    });
  }
}


function configurarBotaoNovoCabecalho() {
  // Criar o botão "Novo" no cabeçalho
  const cabecalhoDireita = document.querySelector(".header-right");
  if (cabecalhoDireita) {
    const botaoNovo = cabecalhoDireita.querySelector(".btn-primary");
    if (botaoNovo) {
      botaoNovo.addEventListener("click", (e) => {
        e.stopPropagation();
        exibirDropdownNovoItem(e.target);
      });
    }
  }
}

function exibirDropdownNovoItem(botao) {
  // Remover dropdown existente, se houver
  const dropdownExistente = document.getElementById("newItemDropdown");
  if (dropdownExistente) {
    dropdownExistente.remove();
  }

  // Cria dropdown
  const dropdown = document.createElement("div");
  dropdown.id = "newItemDropdown";
  dropdown.style.cssText = `
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
    z-index: 50;
    min-width: 200px;
    margin-top: 0.5rem;
  `;

  dropdown.innerHTML = `
    <div style="padding: 0.5rem;">
      <button class="dropdown-item" data-action="new-task">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
        </svg>
        Nova Tarefa
      </button>
      <button class="dropdown-item" data-action="new-projetos">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
        </svg>
        Novo Projeto
      </button>
      <button class="dropdown-item" data-action="new-equipe">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
        </svg>
        Nova Equipe
      </button>
      <button class="dropdown-item" data-action="new-notice">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        Novo Aviso
      </button>
    </div>
    `;

  // CSS dos itens do dropdown
  const style = document.createElement("style");
  style.textContent = `
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.5rem 0.75rem;
      background: none;
      border: none;
      text-align: left;
      cursor: pointer;
      border-radius: 0.25rem;
      transition: background-color 0.2s ease;
      font-size: 0.875rem;
    }
    .dropdown-item:hover {
      background-color: #f3f4f6;
    }
    .dropdown-item .icon {
      width: 1rem;
      height: 1rem;
    }
  `;
  document.head.appendChild(style);

  // Posicionamento do dropdown
  const retanguloBotao = botao.getBoundingClientRect();
  const cabecalhoDireita = botao.closest(".header-right");
  cabecalhoDireita.style.position = "relative";
  cabecalhoDireita.appendChild(dropdown);

  // Clique nos itens do dropdown
  dropdown.querySelectorAll(".dropdown-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      const acao = e.currentTarget.getAttribute("data-action");
      lidarComAcaoNovoItem(acao);
      dropdown.remove();
    });
  });
}

function lidarComAcaoNovoItem(acao) {
  switch (acao) {
    case "new-task":
      definirPaginaAtiva("backlog");
      carregarConteudoPagina("backlog");
      break;
    case "new-projetos":
      definirPaginaAtiva("projetos");
      carregarConteudoPagina("projetos");
      break;
    case "new-equipe":
      definirPaginaAtiva("equipes");
      carregarConteudoPagina("equipes");
      break;
    case "new-notice":
      definirPaginaAtiva("avisos");
      carregarConteudoPagina("avisos");
      break;
  }
}


function definirPaginaAtiva(page) {
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("data-page") === page) {
      link.classList.add("active");
    }
  });
}

window.fecharModal = fecharModal;

window.editarProjetos = editarProjetos;
