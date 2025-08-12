let dataAtualCalendario = new Date();

function getDataBrasiliaFormatada() {
  // Horário atual em UTC
  const agoraUTC = new Date();

  // Offset de Brasília (UTC-3). Calcula milissegundos de diferença
  const offsetBrasilia = -3 * 60; // minutos

  // Aplica o offset
  const horaBrasilia = new Date(
    agoraUTC.getTime() + offsetBrasilia * 60 * 1000
  );

  // Gera data no formato yyyy-mm-dd (usado no input date)
  const ano = horaBrasilia.getFullYear();
  const mes = String(horaBrasilia.getMonth() + 1).padStart(2, "0");
  const dia = String(horaBrasilia.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function formatarDataPtBR(dataIso) {
  const [ano, mes, dia] = dataIso.split("-");
  return `${dia}/${mes}/${ano}`;
}

  function configurarEventos() {
    // Barra Lateral toggle
    const controleSidebar = document.getElementById("controleSidebar");
    const celularcontroleSidebar = document.getElementById(
      "celularcontroleSidebar"
    );
    const sidebar = document.getElementById("sidebar");

    if (controleSidebar) {
      controleSidebar.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
      });
    }

    if (celularcontroleSidebar) {
      celularcontroleSidebar.addEventListener("click", () => {
        sidebar.classList.toggle("celular-open");
      });
    }

    // Navegação entre páginas
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const page = this.getAttribute("data-page");
        if (page) {
          definirPaginaAtiva(page);
          carregarConteudoPagina(page);
        }
      });
    });

    // Header "Novo" botão
    configurarBotaoNovoCabecalho();

    // Notificações
    configurarNotificacao();

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

    // Fechar notificações ao clicar fora
    document.addEventListener("click", (e) => {
      const painelNotificacao = document.getElementById("painelNotificacao");
      const botaoNotificacao = document.getElementById("botaoNotificacao");
      if (painelNotificacao && botaoNotificacao) {
        if (
          !botaoNotificacao.contains(e.target) &&
          !painelNotificacao.contains(e.target)
        ) {
          painelNotificacao.style.display = "none";
        }
      }
    });
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

  // Fechar ao clicar fora
  setTimeout(() => {
    document.addEventListener("click", function fecharDropdown(e) {
      if (!dropdown.contains(e.target)) {
        dropdown.remove();
        document.removeEventListener("click", fecharDropdown);
      }
    });
  }, 0);
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

function configurarNotificacao() {
  const botaoNotificacao = document.getElementById("botaoNotificacao");
  const painelNotificacao = document.getElementById("painelNotificacao");
  const fecharNotificacao = document.getElementById("fecharNotificacao");

  if (botaoNotificacao) {
    botaoNotificacao.addEventListener("click", () => {
      painelNotificacao.style.display =
        painelNotificacao.style.display === "none" ? "block" : "none";
    });
  }

  if (fecharNotificacao) {
    fecharNotificacao.addEventListener("click", () => {
      painelNotificacao.style.display = "none";
    });
  }

  // Make notifications clickable
  const itensNotificacao =
    painelNotificacao.querySelectorAll(".notification-item");
  itensNotificacao.forEach((item, index) => {
    item.style.cursor = "pointer";
    item.addEventListener("click", () => {
      lidarComCliqueNotificacao(index);
      painelNotificacao.style.display = "none";
    });
  });
}

function lidarComCliqueNotificacao(index) {
  switch (index) {
    case 0: // Nova tarefa atribuída
      definirPaginaAtiva("backlog");
      carregarConteudoPagina("backlog");
      break;
    case 1: // Reunião em 30 minutos
      definirPaginaAtiva("calendarioio");
      carregarConteudoPagina("calendarioio");
      break;
    case 2: // Projeto atualizado
      definirPaginaAtiva("projetos");
      carregarConteudoPagina("projetos");
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




