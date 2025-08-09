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

function carregarConteudoPagina(page) {
  const conteudoPagina = document.getElementById("conteudoPagina");

  switch (page) {
    case "dashboard":
      carregarConteudoDashboard();
      break;
    case "projetos":
      carregarConteudoProjetos();
      break;
    case "backlog":
      carregarConteudoBacklog();
      break;
    case "calendarioio":
      carregarConteudoCalendario();
      break;
    case "chat":
      carregarConteudoChat();
      break;
    case "equipes":
      loadEquipesContent();
      break;
    case "avisos":
      loadAvisosContent();
      break;
    case "perfil":
      loadPerfilContent();
      break;
    case "configuracoes":
      loadConfiguracoesContent();
      break;
    default:
      carregarConteudoDashboard();
  }
}

// DASHBOARD ////////////////////////////////////////////////////////////
function carregarConteudoDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const conteudoPagina = document.getElementById("conteudoPagina");

  const totalProjetos = projetos.length;

  const hoje = new Date();
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const projetosEsteMes = projetos.filter(
    (p) => new Date(p.createdAt) >= inicioMes
  ).length;

  const prazoProximos7Dias = projetos.filter((p) => {
    const prazo = new Date(p.deadline);
    return (
      prazo >= hoje &&
      prazo <= new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 7)
    );
  }).length;

  conteudoPagina.innerHTML = `
    <div class="welcome-section">
        <h1 class="welcome-title">Bem-vindo de volta, ${user.name}! 👋</h1>
        <p class="welcome-description">Aqui está um resumo do que está acontecendo em seus projetos hoje.</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-info">
            <h3>Projetos Ativos</h3>
            <div class="stat-value">${totalProjetos}</div>
            <div class="stat-change">+${projetosEsteMes} este mês</div>
          </div>
          <div class="stat-icon blue">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 3v5h5M3 21l6-6M21 3a9 9 0 11-9 9"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="stat-card" id="card-tarefas-concluidas">
        <div class="stat-header">
          <div class="stat-info">
            <h3>Tarefas Concluídas</h3>
            <div class="stat-value">0</div>
            <div class="stat-change">+0 esta semana</div>
          </div>
          <div class="stat-icon green">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-info">
            <h3>Membros da Equipe</h3>
            <div class="stat-value">24</div>
            <div class="stat-change">+3 novos</div>
          </div>
          <div class="stat-icon purple">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-info">
            <h3>Prazo Próximo</h3>
            <div class="stat-value">${prazoProximos7Dias}</div>
            <div class="stat-change">próximos 7 dias</div>
          </div>
          <div class="stat-icon orange">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="content-grid">
      <div class="content-section">
        <div class="section-header">
          <h2 class="section-title">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 3v5h5M3 21l6-6M21 3a9 9 0 11-9 9"/>
            </svg>
            Projetos Recentes
          </h2>
          <p class="section-description">Acompanhe o progresso dos seus projetos principais</p>
        </div>
        <div class="section-content">
          ${gerarProjetosRecentes()}
        </div>
      </div>

      <div class="content-section">
        <div class="section-header">
          <h2 class="section-title">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Calendário
          </h2>
        </div>
        <div class="section-content">
          ${gerarCalendario()}
        </div>
      </div>
    </div>

    <div class="content-grid">
      <div class="content-section">
        <div class="section-header">
          <h2 class="section-title">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
            </svg>
            Tarefas Recentes
          </h2>
          <p class="section-description">Últimas tarefas atribuídas à sua equipe</p>
        </div>
        <div class="section-content">
          ${gerarTarefasRecentes()}
        </div>
      </div>

      <div class="content-section">
        <div class="section-header">
          <h2 class="section-title">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            Próximos Eventos
          </h2>
          <p class="section-description">Reuniões e eventos programados</p>
        </div>
        <div class="section-content">
          ${gerarEventosFuturos()}
        </div>
      </div>
    </div>
  `;

  // 🔁 Atualiza os dados do card de tarefas com dados reais
  atualizarCardTarefasConcluidas();
}

function gerarProjetosRecentes() {
  const recentes = projetos
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3); // pega os 3 mais recentes

  return recentes
    .map(
      (projeto) => `
        <div style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <h3 style="font-weight: 600; color: #000000;">${
                  projeto.name
                }</h3>
                <span style="padding: 0.25rem 0.5rem; background-color: #f3f4f6; color: #374151; border-radius: 0.25rem; font-size: 0.75rem;">
                    ${projeto.status}
                </span>
            </div>
            <div style="display: flex; gap: 1rem; margin-bottom: 0.75rem; font-size: 0.875rem; color: #666666;">
                <span>${projeto.equipe.length} membros</span>
                <span>${formatarDataPtBR(projeto.deadline)}</span>
            </div>
            <div style="margin-bottom: 0.5rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 0.25rem;">
                    <span>Progresso</span>
                    <span>${projeto.progress}%</span>
                </div>
                <div style="width: 100%; background-color: #e5e7eb; border-radius: 0.25rem; height: 0.5rem;">
                    <div style="background-color: #000000; height: 100%; border-radius: 0.25rem; width: ${
                      projeto.progress
                    }%;"></div>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

function gerarTarefasRecentes() {
  // Se o array global tarefas não existir ou estiver vazio, retorna mensagem
  if (!tarefas || tarefas.length === 0) {
    return `<p style="color: #9ca3af;">Nenhuma tarefa encontrada.</p>`;
  }

  // Ordena por deadline mais próxima (ou pelo ID como fallback)
  const tarefasOrdenadas = [...tarefas]
    .sort((a, b) => {
      const dateA = new Date(a.deadline);
      const dateB = new Date(b.deadline);
      return dateA - dateB;
    })
    .slice(0, 5); // Mostra as 5 mais recentes

  return tarefasOrdenadas
    .map(
      (task) => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; margin-bottom: 1rem;">
        <div style="flex: 1;">
          <h4 style="font-weight: 500; color: #000000; margin-bottom: 0.25rem;">${
            task.title
          }</h4>
          <p style="font-size: 0.875rem; color: #666666; margin-bottom: 0.25rem;">${
            task.projetos
          }</p>
          <p style="font-size: 0.75rem; color: #9ca3af;">Atribuído a: ${
            task.assignee
          }</p>
        </div>
        <span style="padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 500; ${getPriorityStyle(
          task.priority
        )}">${task.priority}</span>
      </div>
    `
    )
    .join("");
}

function atualizarCardTarefasConcluidas() {
  const concluidas = tarefas.filter((t) => t.status === "concluida");

  const concluidasSemana = concluidas.filter((t) => {
    const data = new Date(t.updatedAt || t.createdAt || t.deadline);
    const hoje = new Date();
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(hoje.getDate() - 7);
    return data >= seteDiasAtras && data <= hoje;
  });

  const card = document.querySelector("#card-tarefas-concluidas");
  if (!card) return;

  card.querySelector(".stat-value").textContent = concluidas.length;
  card.querySelector(
    ".stat-change"
  ).textContent = `+${concluidasSemana.length} esta semana`;
}

function gerarEventosFuturos() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const proximosEventos = eventos
    .map((evento) => {
      const [ano, mes, dia] = evento.date.split("-").map(Number);
      const data = new Date(ano, mes - 1, dia);
      data.setHours(0, 0, 0, 0);

      const diff = Math.floor((data - hoje) / (1000 * 60 * 60 * 24));
      let dataLabel = "";

      if (diff === 0) dataLabel = "Hoje";
      else if (diff === 1) dataLabel = "Amanhã";
      else
        dataLabel = data.toLocaleDateString("pt-BR", {
          weekday: "short",
          day: "2-digit",
          month: "short",
        });

      return {
        ...evento,
        dataLabel,
        dataObj: data,
      };
    })
    .filter((e) => e.dataObj >= hoje)
    .sort((a, b) => a.dataObj - b.dataObj)
    .slice(0, 5); // Máximo de 5 eventos

  if (proximosEventos.length === 0) {
    return `<p style="color: #666;">Nenhum evento futuro agendado.</p>`;
  }

  return proximosEventos
    .map(
      (event) => `
        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; margin-bottom: 1rem;">
            <div style="width: 0.5rem; height: 0.5rem; background-color: #3b82f6; border-radius: 50%;"></div>
            <div style="flex: 1;">
                <h4 style="font-weight: 500; color: #000000; margin-bottom: 0.25rem;">${event.title}</h4>
                <p style="font-size: 0.875rem; color: #666666;">${event.dataLabel} às ${event.time}</p>
            </div>
        </div>
      `
    )
    .join("");
}

function gerarCalendario() {
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();
  const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
  const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  let calendario = `
    <div style="text-align: center; margin-bottom: 1rem;">
      <h3 style="font-weight: 600; color: #000000;">${monthNames[mesAtual]} ${anoAtual}</h3>
    </div>
    <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.25rem; text-align: center;">
      <div style="font-weight: 500; color: #666666; padding: 0.5rem; font-size: 0.75rem;">Dom</div>
      <div style="font-weight: 500; color: #666666; padding: 0.5rem; font-size: 0.75rem;">Seg</div>
      <div style="font-weight: 500; color: #666666; padding: 0.5rem; font-size: 0.75rem;">Ter</div>
      <div style="font-weight: 500; color: #666666; padding: 0.5rem; font-size: 0.75rem;">Qua</div>
      <div style="font-weight: 500; color: #666666; padding: 0.5rem; font-size: 0.75rem;">Qui</div>
      <div style="font-weight: 500; color: #666666; padding: 0.5rem; font-size: 0.75rem;">Sex</div>
      <div style="font-weight: 500; color: #666666; padding: 0.5rem; font-size: 0.75rem;">Sáb</div>
  `;

  // Preenche os dias vazios antes do primeiro dia do mês
  for (let i = 0; i < primeiroDia; i++) {
    calendario += '<div style="padding: 0.5rem;"></div>';
  }

  for (let dia = 1; dia <= diasNoMes; dia++) {
    const eHoje = dia === hoje.getDate();
    const temEvento = eventos.some((event) => {
      const [ano, mes, d] = event.date.split("-").map(Number);
      return d === dia && mes === mesAtual + 1 && ano === anoAtual;
    });

    let style = `
      padding: 0.5rem; 
      ${
        eHoje
          ? "background-color: #000000; color: #ffffff;"
          : "color: #000000; cursor: pointer;"
      } 
      border-radius: 0.25rem; 
      font-weight: 500;
      transition: background-color 0.2s ease;
      position: relative;
    `;

    if (temEvento) {
      style += `
        border-bottom: 3px solid #2563eb; /* azul */
      `;
    }

    calendario += `
      <div style="${style}" 
        onclick="diaSelecionado(${dia}, ${mesAtual}, ${anoAtual})"
        ${
          !eHoje
            ? "onmouseover=\"this.style.backgroundColor='#f3f4f6'\" onmouseout=\"this.style.backgroundColor='transparent'\""
            : ""
        }
      >
        ${dia}
      </div>
    `;
  }

  calendario += "</div>";
  return calendario;
}

// PROJETOS ////////////////////////////////////////////////////////////
function carregarConteudoProjetos() {
  const conteudoPagina = document.getElementById("conteudoPagina");
  conteudoPagina.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <div>
                <h1 style="font-size: 2rem; font-weight: bold; color: #000000; margin-bottom: 0.5rem;">Projetos</h1>
                <p style="color: #666666;">Gerencie todos os seus projetos em um só lugar</p>
            </div>
            <button id="newProjectBtn" class="btn btn-primary">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 5v14M5 12h14"/>
                </svg>
                Novo Projeto
            </button>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                <div style="position: relative; flex: 1;">
                    <svg style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); width: 1rem; height: 1rem; color: #9ca3af;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <input id="projectSearch" type="text" placeholder="Buscar projetos..." style="width: 100%; padding: 0.5rem 0.75rem 0.5rem 2.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
                </div>
                <select id="projectStatusFilter" style="padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
                    <option value="todos">Todos os Status</option>
                    <option value="planejamento">Planejamento</option>
                    <option value="em-andamento">Em Andamento</option>
                    <option value="em-desenvolvimento">Em Desenvolvimento</option>
                    <option value="quase-concluido">Quase Concluído</option>
                    <option value="concluido">Concluído</option>
                </select>
            </div>
        </div>
        
        <div id="projetosGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
            ${gerarCardsProjetos()}
        </div>
    `;

  // Setup projetos functionality
  setupProjetosPage();
}

function setupProjetosPage() {
  // New projetos button
  const newProjectBtn = document.getElementById("newProjectBtn");
  if (newProjectBtn) {
    newProjectBtn.addEventListener("click", mostrarModalProjetoNovo);
  }

  // Search functionality
  const projectSearch = document.getElementById("projectSearch");
  if (projectSearch) {
    projectSearch.addEventListener("input", filterProjetos);
  }

  // Status filter
  const projectStatusFilter = document.getElementById("projectStatusFilter");
  if (projectStatusFilter) {
    projectStatusFilter.addEventListener("change", filterProjetos);
  }

  // projetos card actions
  configAcoesCardProjetos();
}

function filterProjetos() {
  const searchTerm =
    document.getElementById("projectSearch")?.value.toLowerCase() || "";
  const statusFilter =
    document.getElementById("projectStatusFilter")?.value || "todos";

  const filteredProjetos = projetos.filter((projetos) => {
    const matchesSearch =
      projetos.name.toLowerCase().includes(searchTerm) ||
      projetos.description.toLowerCase().includes(searchTerm);
    const matchesStatus =
      statusFilter === "todos" || projetos.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const projetosGrid = document.getElementById("projetosGrid");
  if (projetosGrid) {
    projetosGrid.innerHTML = gerarArrayProjetosCards(filteredProjetos);
    configAcoesCardProjetos();
  }
}

function configAcoesCardProjetos() {
  // Botao de editar projetos
  document.querySelectorAll(".edit-projetos-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const projectId = Number.parseInt(
        e.target.closest("[data-projetos-id]").getAttribute("data-projetos-id")
      );
      editarProjetos(projectId);
    });
  });

  // View details buttons
  document.querySelectorAll(".view-projetos-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const projectId = Number.parseInt(
        e.target.closest("[data-projetos-id]").getAttribute("data-projetos-id")
      );
      viewProjectDetails(projectId);
    });
  });

  // Delete projetos buttons
  document.querySelectorAll(".delete-projetos-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const projectId = Number.parseInt(
        e.target.closest("[data-projetos-id]").getAttribute("data-projetos-id")
      );
      deletarProjeto(projectId);
    });
  });
}

function mostrarModalProjetoNovo() {
  const modal = createModal(
    "Criar Novo Projeto",
    `
    <form id="newProjectForm">
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Nome do Projeto</label>
        <input type="text" id="projectName" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Descrição</label>
        <textarea id="projectDescription" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; min-height: 80px; resize: vertical;"></textarea>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
        <div>
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Status</label>
          <select id="projectStatus" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
            <option value="planejamento">Planejamento</option>
            <option value="em-andamento">Em Andamento</option>
            <option value="em-desenvolvimento">Em Desenvolvimento</option>
          </select>
        </div>
        <div>
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Prioridade</label>
          <select id="projectPriority" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
            <option value="baixa">Baixa</option>
            <option value="media" selected>Média</option>
            <option value="alta">Alta</option>
          </select>
        </div>
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Prazo</label>
        <input type="date" id="projectDeadline" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
      </div>
      <div style="display: flex; gap: 1rem; justify-content: flex-end;">
        <button type="button" onclick="fecharModal()" class="btn btn-outline">Cancelar</button>
        <button type="submit" class="btn btn-primary">Criar Projeto</button>
      </div>
    </form>
  `
  );

  // Espera o próximo ciclo de renderização para garantir que o elemento está no DOM
  setTimeout(() => {
    const form = document.getElementById("newProjectForm");
    if (!form) {
      console.error("Formulário não encontrado no DOM.");
      return;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const novoProjeto = {
        id: Date.now(),
        name: document.getElementById("projectName").value,
        description: document.getElementById("projectDescription").value,
        status: document.getElementById("projectStatus").value,
        priority: document.getElementById("projectPriority").value,
        deadline: document.getElementById("projectDeadline").value,
        progress: 0,
        equipe: [],
        createdAt: getDataBrasiliaFormatada(),
      };

      projetos.push(novoProjeto);
      fecharModal();
      filterProjetos();
    });
  }, 0);
}

function editarProjetos(projectId) {
  const projeto = projetos.find((p) => p.id === projectId);
  if (!projeto) return;

  const modal = createModal(
    "Editar Projeto",
    `
    <form id="editProjectForm">
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Nome do Projeto</label>
        <input type="text" id="editProjectName" value="${
          projeto.name
        }" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Descrição</label>
        <textarea id="editProjectDescription" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; min-height: 80px; resize: vertical;">${
          projeto.description
        }</textarea>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
        <div>
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Status</label>
          <select id="editProjectStatus" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
            <option value="planejamento" ${
              projeto.status === "planejamento" ? "selected" : ""
            }>Planejamento</option>
            <option value="em-andamento" ${
              projeto.status === "em-andamento" ? "selected" : ""
            }>Em Andamento</option>
            <option value="em-desenvolvimento" ${
              projeto.status === "em-desenvolvimento" ? "selected" : ""
            }>Em Desenvolvimento</option>
            <option value="quase-concluido" ${
              projeto.status === "quase-concluido" ? "selected" : ""
            }>Quase Concluído</option>
            <option value="concluido" ${
              projeto.status === "concluido" ? "selected" : ""
            }>Concluído</option>
          </select>
        </div>
        <div>
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Prioridade</label>
          <select id="editProjectPriority" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
            <option value="baixa" ${
              projeto.priority === "baixa" ? "selected" : ""
            }>Baixa</option>
            <option value="media" ${
              projeto.priority === "media" ? "selected" : ""
            }>Média</option>
            <option value="alta" ${
              projeto.priority === "alta" ? "selected" : ""
            }>Alta</option>
          </select>
        </div>
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Progresso (%)</label>
        <input type="number" id="editProjectProgress" value="${
          projeto.progress
        }" min="0" max="100" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Prazo</label>
        <input type="date" id="editProjectDeadline" value="${
          projeto.deadline
        }" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
      </div>
      <div style="display: flex; gap: 1rem; justify-content: flex-end;">
        <button type="button" onclick="fecharModal()" class="btn btn-outline">Cancelar</button>
        <button type="submit" class="btn btn-primary">Salvar Alterações</button>
      </div>
    </form>
  `
  );

  document.getElementById("editProjectForm").addEventListener("submit", (e) => {
    e.preventDefault();

    projeto.name = document.getElementById("editProjectName").value;
    projeto.description = document.getElementById(
      "editProjectDescription"
    ).value;
    projeto.status = document.getElementById("editProjectStatus").value;
    projeto.priority = document.getElementById("editProjectPriority").value;
    projeto.progress = Number.parseInt(
      document.getElementById("editProjectProgress").value
    );
    projeto.deadline = document.getElementById("editProjectDeadline").value;

    fecharModal();
    filterProjetos(); // Refresh the projetos display
  });
}

function viewProjectDetails(projectId) {
  const projeto = projetos.find((p) => p.id === projectId);
  if (!projeto) return;

  const projectTasks = tarefas.filter((t) => t.projetos === projeto.name);

  const modal = createModal(
    `Detalhes do Projeto: ${projeto.name}`,
    `
    <div style="max-height: 400px; overflow-y: auto;">
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Informações Gerais</h3>
        <p style="margin-bottom: 0.5rem;"><strong>Descrição:</strong> ${
          projeto.description
        }</p>
        <p style="margin-bottom: 0.5rem;"><strong>Status:</strong> ${getStatusLabel(
          projeto.status
        )}</p>
        <p style="margin-bottom: 0.5rem;"><strong>Prioridade:</strong> ${
          projeto.priority.charAt(0).toUpperCase() + projeto.priority.slice(1)
        }</p>
        <p style="margin-bottom: 0.5rem;"><strong>Progresso:</strong> ${
          projeto.progress
        }%</p>
        <p style="margin-bottom: 0.5rem;"><strong>Prazo:</strong> ${formatarDataPtBR(
          projeto.deadline
        )}</p>
        <p style="margin-bottom: 0.5rem;"><strong>Equipe:</strong> ${
          projeto.equipe.length
        } membros</p>
      </div>
      
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Progresso</h3>
        <div style="width: 100%; background-color: #e5e7eb; border-radius: 0.25rem; height: 0.75rem;">
          <div style="background-color: #000000; height: 100%; border-radius: 0.25rem; width: ${
            projeto.progress
          }%;"></div>
        </div>
      </div>

      <div>
        <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Tarefas Relacionadas (${
          projectTasks.length
        })</h3>
        ${
          projectTasks.length > 0
            ? projectTasks
                .map(
                  (task) => `
          <div style="padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.375rem; margin-bottom: 0.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h4 style="font-weight: 500; margin-bottom: 0.25rem;">${
                task.title
              }</h4>
              <span style="padding: 0.25rem 0.5rem; background-color: ${getTaskStatusBgColor(
                task.status
              )}; color: ${getTaskStatusTextColor(
                    task.status
                  )}; border-radius: 0.25rem; font-size: 0.75rem;">
                ${getTaskStatusLabel(task.status)}
              </span>
            </div>
            <p style="font-size: 0.875rem; color: #666666; margin-bottom: 0.25rem;">${
              task.description
            }</p>
            <p style="font-size: 0.75rem; color: #9ca3af;">Responsável: ${
              task.assignee
            }</p>
          </div>
        `
                )
                .join("")
            : '<p style="color: #666666; text-align: center; padding: 1rem;">Nenhuma tarefa encontrada</p>'
        }
      </div>
    </div>
    <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
      <button type="button" onclick="editarProjetos(${
        projeto.id
      })" class="btn btn-outline">Editar</button>
      <button type="button" onclick="fecharModal()" class="btn btn-primary">Fechar</button>
    </div>
  `
  );
}

function deletarProjeto(projectId) {
  projetos = projetos.filter((p) => p.id !== projectId);
  filterProjetos();
  showToast("Projeto excluído com sucesso!");
}

function gerarArrayProjetosCards(projetosArray) {
  return projetosArray
    .map(
      (projetos) => `
    <div data-projetos-id="${
      projetos.id
    }" style="background-color: #ffffff; border: 1px solid #e5e7eb; border-left: 4px solid ${getPriorityBorderColor(
        projetos.priority
      )}; border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); transition: box-shadow 0.2s ease;" onmouseover="this.style.boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.1)'" onmouseout="this.style.boxShadow='0 1px 3px 0 rgba(0, 0, 0, 0.1)'">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
        <div style="flex: 1;">
          <h3 style="font-size: 1.125rem; font-weight: 600; color: #000000; margin-bottom: 0.5rem;">${
            projetos.name
          }</h3>
          <span style="padding: 0.25rem 0.5rem; background-color: ${getStatusBgColor(
            getStatusLabel(projetos.status)
          )}; color: ${getStatusTextColor(
        getStatusLabel(projetos.status)
      )}; border-radius: 0.25rem; font-size: 0.75rem;">${getStatusLabel(
        projetos.status
      )}</span>
        </div>
        <div class="projetos-menu" style="position: relative;">
          <button onclick="abrirMenuProjeto(${
            projetos.id
          })" style="background: none; border: none; cursor: pointer; padding: 0.25rem; color: #666666;">
            <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="1"/>
              <circle cx="19" cy="12" r="1"/>
              <circle cx="5" cy="12" r="1"/>
            </svg>
          </button>
        </div>
      </div>
      
      <p style="color: #666666; font-size: 0.875rem; margin-bottom: 1rem;">${
        projetos.description
      }</p>
      
      <div style="margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 0.5rem;">
          <span>Progresso</span>
          <span>${projetos.progress}%</span>
        </div>
        <div style="width: 100%; background-color: #e5e7eb; border-radius: 0.25rem; height: 0.5rem;">
          <div style="background-color: #000000; height: 100%; border-radius: 0.25rem; width: ${
            projetos.progress
          }%;"></div>
        </div>
      </div>
      
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem; color: #666666; margin-bottom: 1rem;">
        <div style="display: flex; align-items: center; gap: 0.25rem;">
          <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
          </svg>
          <span>${projetos.equipe.length} membros</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.25rem;">
          <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>${formatarDataPtBR(projetos.deadline)}</span>
        </div>
      </div>
      
      <div style="display: flex; gap: 0.5rem;">
        <button class="edit-projetos-btn btn btn-outline" style="flex: 1; font-size: 0.875rem;">
          <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Editar
        </button>
        <button class="view-projetos-btn btn btn-outline" style="flex: 1; font-size: 0.875rem;">Ver Detalhes</button>
      </div>
    </div>
  `
    )
    .join("");
}

function getStatusLabel(status) {
  const labels = {
    planejamento: "Planejamento",
    "em-andamento": "Em Andamento",
    "em-desenvolvimento": "Em Desenvolvimento",
    "quase-concluido": "Quase Concluído",
    concluido: "Concluído",
    pausado: "Pausado",
  };
  return labels[status] || status;
}
// FIM PROJETOS ///////////////////////////////////////////////////////////////////////////////////////////////

// BACKLOG ///////////////////////////////////////////////////////////////////////////////////////////////
function carregarConteudoBacklog() {
  const conteudoPagina = document.getElementById("conteudoPagina");
  conteudoPagina.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <div>
                <h1 style="font-size: 2rem; font-weight: bold; color: #000000; margin-bottom: 0.5rem;">Backlog</h1>
                <p style="color: #666666;">Gerencie todas as tarefas dos seus projetos</p>
            </div>
            <button id="newTaskBtn" class="btn btn-primary">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 5v14M5 12h14"/>
                </svg>
                Nova Tarefa
            </button>
        </div>
        
        <div style="display: flex; gap: 1rem; margin-bottom: 2rem;">
            <div style="position: relative; flex: 1;">
                <svg style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); width: 1rem; height: 1rem; color: #9ca3af;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                </svg>
                <input id="taskSearch" type="text" placeholder="Buscar tarefas..." style="width: 100%; padding: 0.5rem 0.75rem 0.5rem 2.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
            </div>
            <select id="taskStatusFilter" style="padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
                <option value="todas">Todos os Status</option>
                <option value="todo">A Fazer</option>
                <option value="em-progresso">Em Progresso</option>
                <option value="em-revisao">Em Revisão</option>
                <option value="concluida">Concluída</option>
                <option value="bloqueada">Bloqueada</option>
            </select>
            <select id="taskPriorityFilter" style="padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
                <option value="todas">Todas as Prioridades</option>
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
            </select>
        </div>
        
        <div id="tarefasContainer" style="display: flex; flex-direction: column; gap: 1rem;">
            ${gerarCardsTarefas()}
        </div>
    `;

  // Setup backlog functionality
  configPaginaBacklog();
}

function configPaginaBacklog() {
  // New task button
  const newTaskBtn = document.getElementById("newTaskBtn");
  if (newTaskBtn) {
    newTaskBtn.addEventListener("click", showNewTaskModal);
  }

  // Search functionality
  const taskSearch = document.getElementById("taskSearch");
  if (taskSearch) {
    taskSearch.addEventListener("input", filterTasks);
  }

  // Status filter
  const taskStatusFilter = document.getElementById("taskStatusFilter");
  if (taskStatusFilter) {
    taskStatusFilter.addEventListener("change", filterTasks);
  }

  // Priority filter
  const taskPriorityFilter = document.getElementById("taskPriorityFilter");
  if (taskPriorityFilter) {
    taskPriorityFilter.addEventListener("change", filterTasks);
  }

  // Task status change functionality
  setupTaskStatusChanges();
}

function filterTasks() {
  const searchTerm =
    document.getElementById("taskSearch")?.value.toLowerCase() || "";
  const statusFilter =
    document.getElementById("taskStatusFilter")?.value || "todas";
  const priorityFilter =
    document.getElementById("taskPriorityFilter")?.value || "todas";

  const filteredTasks = tarefas.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm) ||
      task.description.toLowerCase().includes(searchTerm) ||
      task.projetos.toLowerCase().includes(searchTerm);
    const matchesStatus =
      statusFilter === "todas" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "todas" || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const tarefasContainer = document.getElementById("tarefasContainer");
  if (tarefasContainer) {
    tarefasContainer.innerHTML = gerarArrayCardsTarefas(filteredTasks);
    setupTaskStatusChanges();
  }
}

function setupTaskStatusChanges() {
  document.querySelectorAll(".task-status-select").forEach((select) => {
    select.addEventListener("change", (e) => {
      const taskId = Number.parseInt(e.target.getAttribute("data-task-id"));
      const newStatus = e.target.value;
      updateTaskStatus(taskId, newStatus);
    });
  });

  // Edit task buttons
  document.querySelectorAll(".edit-task-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const taskId = Number.parseInt(
        e.target.closest("[data-task-id]").getAttribute("data-task-id")
      );
      editTask(taskId);
    });
  });

  // Delete task buttons
  document.querySelectorAll(".delete-task-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const taskId = Number.parseInt(
        e.target.closest("[data-task-id]").getAttribute("data-task-id")
      );
      deleteTask(taskId);
    });
  });
}

function updateTaskStatus(taskId, newStatus) {
  const task = tarefas.find((t) => t.id === taskId);
  if (task) {
    task.status = newStatus;
    if (newStatus === "concluida") {
      updateProjectProgress(task.projetos);
    }
  }
  filterTasks();
}

function updateProjectProgress(projectName) {
  const projeto = projetos.find((p) => p.name === projectName);
  if (projeto) {
    const projectTasks = tarefas.filter((t) => t.projetos === projectName);
    const completedTasks = projectTasks.filter((t) => t.status === "concluida");
    const progress =
      projectTasks.length > 0
        ? Math.round((completedTasks.length / projectTasks.length) * 100)
        : 0;
    projeto.progress = progress;
  }
}

function showNewTaskModal() {
  const projectOptions = projetos
    .map((p) => `<option value="${p.name}">${p.name}</option>`)
    .join("");

  const modal = createModal(
    "Criar Nova Tarefa",
    `
    <form id="newTaskForm">
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Título da Tarefa</label>
        <input type="text" id="taskTitle" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Descrição</label>
        <textarea id="taskDescription" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; min-height: 80px; resize: vertical;"></textarea>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
        <div>
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Prioridade</label>
          <select id="taskPriority" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
            <option value="baixa">Baixa</option>
            <option value="media" selected>Média</option>
            <option value="alta">Alta</option>
          </select>
        </div>
        <div>
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Status</label>
          <select id="taskStatus" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
            <option value="todo" selected>A Fazer</option>
            <option value="em-progresso">Em Progresso</option>
            <option value="em-revisao">Em Revisão</option>
          </select>
        </div>
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Projeto</label>
        <select id="taskProject" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
          <option value="">Selecione um projeto</option>
          ${projectOptions}
        </select>
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Responsável</label>
        <input type="text" id="taskAssignee" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;" placeholder="Nome do responsável">
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Prazo</label>
        <input type="date" id="taskDeadline" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
      </div>
      <div style="display: flex; gap: 1rem; justify-content: flex-end;">
        <button type="button" onclick="fecharModal()" class="btn btn-outline">Cancelar</button>
        <button type="submit" class="btn btn-primary">Criar Tarefa</button>
      </div>
    </form>
  `
  );

  document.getElementById("newTaskForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const newTask = {
      id: Date.now(),
      title: document.getElementById("taskTitle").value,
      description: document.getElementById("taskDescription").value,
      priority: document.getElementById("taskPriority").value,
      status: document.getElementById("taskStatus").value,
      projetos: document.getElementById("taskProject").value,
      assignee: document.getElementById("taskAssignee").value,
      deadline:
        document.getElementById("taskDeadline").value ||
        getDataBrasiliaFormatada(),
      createdAt: getDataBrasiliaFormatada(),
    };

    tarefas.push(newTask);
    fecharModal();
    filterTasks(); // Refresh the tarefas display
  });
}

function editTask(taskId) {
  const task = tarefas.find((t) => t.id === taskId);
  if (!task) return;

  const projectOptions = projetos
    .map(
      (p) =>
        `<option value="${p.name}" ${
          p.name === task.projetos ? "selected" : ""
        }>${p.name}</option>`
    )
    .join("");

  const modal = createModal(
    "Editar Tarefa",
    `
    <form id="editTaskForm">
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Título da Tarefa</label>
        <input type="text" id="editTaskTitle" value="${
          task.title
        }" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Descrição</label>
        <textarea id="editTaskDescription" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; min-height: 80px; resize: vertical;">${
          task.description
        }</textarea>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
        <div>
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Prioridade</label>
          <select id="editTaskPriority" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
            <option value="baixa" ${
              task.priority === "baixa" ? "selected" : ""
            }>Baixa</option>
            <option value="media" ${
              task.priority === "media" ? "selected" : ""
            }>Média</option>
            <option value="alta" ${
              task.priority === "alta" ? "selected" : ""
            }>Alta</option>
          </select>
        </div>
        <div>
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Status</label>
          <select id="editTaskStatus" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
            <option value="todo" ${
              task.status === "todo" ? "selected" : ""
            }>A Fazer</option>
            <option value="em-progresso" ${
              task.status === "em-progresso" ? "selected" : ""
            }>Em Progresso</option>
            <option value="em-revisao" ${
              task.status === "em-revisao" ? "selected" : ""
            }>Em Revisão</option>
            <option value="concluida" ${
              task.status === "concluida" ? "selected" : ""
            }>Concluída</option>
            <option value="bloqueada" ${
              task.status === "bloqueada" ? "selected" : ""
            }>Bloqueada</option>
          </select>
        </div>
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Projeto</label>
        <select id="editTaskProject" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
          ${projectOptions}
        </select>
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Responsável</label>
        <input type="text" id="editTaskAssignee" value="${
          task.assignee
        }" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Prazo</label>
        <input type="date" id="editTaskDeadline" value="${
          task.deadline
        }" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
      </div>
      <div style="display: flex; gap: 1rem; justify-content: flex-end;">
        <button type="button" onclick="fecharModal()" class="btn btn-outline">Cancelar</button>
        <button type="submit" class="btn btn-primary">Salvar Alterações</button>
      </div>
    </form>
  `
  );

  document.getElementById("editTaskForm").addEventListener("submit", (e) => {
    e.preventDefault();

    task.title = document.getElementById("editTaskTitle").value;
    task.description = document.getElementById("editTaskDescription").value;
    task.priority = document.getElementById("editTaskPriority").value;
    task.status = document.getElementById("editTaskStatus").value;
    task.projetos = document.getElementById("editTaskProject").value;
    task.assignee = document.getElementById("editTaskAssignee").value;
    task.deadline =
      document.getElementById("editTaskDeadline").value ||
      getDataBrasiliaFormatada();
    fecharModal();
    filterTasks(); // Atualiza a lista de tarefas
  });
}

function deleteTask(taskId) {
  tarefas = tarefas.filter((t) => t.id !== taskId);
  filterTasks(); // Atualiza a exibição
  showToast("Tarefa excluída com sucesso!", "success");
}

window.abrirMenuTarefas = (taskId) => {
  const card = document.querySelector(`[data-task-id="${taskId}"]`);
  let menu = card.querySelector(".tarefas-menu-dropdown");

  // Fecha outros menus abertos
  document.querySelectorAll(".tarefas-menu-dropdown").forEach((el) => {
    if (el !== menu) el.remove();
  });

  if (menu) {
    menu.remove();
    return;
  }

  // Cria o menu
  menu = document.createElement("div");
  menu.className = "tarefas-menu-dropdown";
  menu.style.position = "absolute";
  menu.style.top = "30px";
  menu.style.right = "0";
  menu.style.background = "#fff";
  menu.style.border = "1px solid #e5e7eb";
  menu.style.borderRadius = "0.375rem";
  menu.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
  menu.style.zIndex = "999";

  const apagarBtn = document.createElement("div");
  apagarBtn.innerHTML = `
    <span style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.875rem;">
      🗑 <span>Apagar</span>
    </span>`;
  apagarBtn.style.padding = "0.5rem";
  apagarBtn.style.cursor = "pointer";
  apagarBtn.style.color = "#b91c1c";

  apagarBtn.addEventListener("click", async () => {
    menu.remove(); // Fecha o menu antes

    const confirmar = await confirmarModal({
      title: "Excluir tarefa?",
      message:
        "Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.",
    });

    if (confirmar) {
      deleteTask(taskId); // Isso já chama o showToast
    }
  });

  menu.appendChild(apagarBtn);
  const menuContainer = card.querySelector(".task-menu");
  menuContainer.appendChild(menu);
};

function gerarArrayCardsTarefas(tarefasArray) {
  return tarefasArray
    .map(
      (task) => `
    <div data-task-id="${
      task.id
    }" style="background-color: #ffffff; border: 1px solid #e5e7eb; border-left: 4px solid ${getTaskPriorityColor(
        task.priority
      )}; border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); transition: box-shadow 0.2s ease;" onmouseover="this.style.boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.1)'" onmouseout="this.style.boxShadow='0 1px 3px 0 rgba(0, 0, 0, 0.1)'">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <h3 style="font-size: 1.125rem; font-weight: 600; color: #000000;">${
              task.title
            }</h3>
            <span style="display: flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.5rem; background-color: ${getTaskStatusBgColor(
              task.status
            )}; color: ${getTaskStatusTextColor(
        task.status
      )}; border-radius: 0.25rem; font-size: 0.75rem;">
              ${getPriorityBorderColor(task.status)}
              ${getTaskStatusLabel(task.status)}
            </span>
            <span style="padding: 0.25rem 0.5rem; background-color: ${getTaskPriorityBgColor(
              task.priority
            )}; color: ${getTaskPriorityTextColor(
        task.priority
      )}; border-radius: 0.25rem; font-size: 0.75rem;">
              ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          </div>
          <p style="color: #666666; margin-bottom: 0.75rem;">${
            task.description
          }</p>
          <div style="display: flex; align-items: center; gap: 1rem; font-size: 0.875rem; color: #9ca3af;">
            <span style="font-weight: 500; color: #3b82f6;">${
              task.projetos
            }</span>
            <div style="display: flex; align-items: center; gap: 0.25rem;">
              <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
              </svg>
              <span>${task.assignee}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.25rem;">
              <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>${formatarDataPtBR(task.deadline)}</span>
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <select class="task-status-select" data-task-id="${
            task.id
          }" style="padding: 0.375rem 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.875rem;">
            <option value="todo" ${
              task.status === "todo" ? "selected" : ""
            }>A Fazer</option>
            <option value="em-progresso" ${
              task.status === "em-progresso" ? "selected" : ""
            }>Em Progresso</option>
            <option value="em-revisao" ${
              task.status === "em-revisao" ? "selected" : ""
            }>Em Revisão</option>
            <option value="concluida" ${
              task.status === "concluida" ? "selected" : ""
            }>Concluída</option>
            <option value="bloqueada" ${
              task.status === "bloqueada" ? "selected" : ""
            }>Bloqueada</option>
          </select>
          <div class="task-menu" style="position: relative;">
            <button onclick="abrirMenuTarefas(${
              task.id
            })" style="background: none; border: none; cursor: pointer; padding: 0.25rem; color: #666666;">
              <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="19" cy="12" r="1"/>
                <circle cx="5" cy="12" r="1"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

// FIM BACKLOG /////////////////////////////////////////////////////////////////////////////////////////////////////////

window.fecharModal = fecharModal;

window.editarProjetos = editarProjetos;

window.abrirMenuProjeto = (projectId) => {
  const card = document.querySelector(`[data-projetos-id="${projectId}"]`);
  let menu = card.querySelector(".projetos-menu-dropdown");

  // Fecha outros menus abertos
  document.querySelectorAll(".projetos-menu-dropdown").forEach((el) => {
    if (el !== menu) el.remove();
  });

  if (menu) {
    menu.remove(); // Fecha se já estiver aberto
    return;
  }

  // Cria o menu com apenas "Apagar"
  menu = document.createElement("div");
  menu.className = "projetos-menu-dropdown";
  menu.style.position = "absolute";
  menu.style.top = "30px";
  menu.style.right = "0";
  menu.style.background = "#fff";
  menu.style.border = "1px solid #e5e7eb";
  menu.style.borderRadius = "0.375rem";
  menu.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
  menu.style.zIndex = "999";

  const apagarBtn = document.createElement("div");
  apagarBtn.innerHTML = `<span style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.875rem;">
  🗑 <span>Apagar</span></span>`;
  apagarBtn.style.padding = "0.5rem";
  apagarBtn.style.cursor = "pointer";
  apagarBtn.style.color = "#b91c1c";

  apagarBtn.addEventListener("click", async () => {
    const confirmar = await confirmarModal({
      title: "Excluir projeto?",
      message:
        "Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.",
    });

    if (confirmar) {
      deletarProjeto(projectId);
    }

    menu.remove(); // fecha o menu de qualquer forma
  });

  menu.appendChild(apagarBtn);

  const menuContainer = card.querySelector(".projetos-menu");
  menuContainer.appendChild(menu);
};

// CALENDARIO /////////////////////////////////////////////////////////////////////////////////////////////////////////
function carregarConteudoCalendario() {
  const conteudoPagina = document.getElementById("conteudoPagina");
  const mesAtual = dataAtualCalendario.getMonth();
  const anoAtual = dataAtualCalendario.getFullYear();

  conteudoPagina.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <div>
          <h1 style="font-size: 2rem; font-weight: bold; color: #000000; margin-bottom: 0.5rem;">Calendário</h1>
          <p style="color: #666666;">Gerencie eventos, reuniões e prazos</p>
        </div>
        <button id="newEventBtn" class="btn btn-primary">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Novo Evento
        </button>
      </div>
  
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
        <div style="background-color: #ffffff; border-radius: 0.5rem; border: 1px solid #e5e7eb; padding: 1.5rem;">
          <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 1rem;">
            <button id="prevMonth" style="background: none; border: none; cursor: pointer; padding: 0.5rem;">
              <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <h2 id="currentMonthYear" style="font-size: 1.25rem; font-weight: 600; flex: 1; text-align: center;"></h2>
            <button id="nextMonth" style="background: none; border: none; cursor: pointer; padding: 0.5rem;">
              <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
          <div id="calendarioGrid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background-color: #e5e7eb; border: 1px solid #e5e7eb;">
            <!-- Calendario will be generated here -->
          </div>
        </div>
  
        <div style="background-color: #ffffff; border-radius: 0.5rem; border: 1px solid #e5e7eb; padding: 1.5rem;">
          <h3 style="font-weight: 600; margin-bottom: 1rem;">Próximos Eventos</h3>
          <div id="upcomingEvents">
            ${gerarProximoEvento()}
          </div>
        </div>
      </div>
    `;

  configFuncionalidadeCalendario();
  gerarGridCalendario(mesAtual, anoAtual);
}

function configFuncionalidadeCalendario() {
  const newEventBtn = document.getElementById("newEventBtn");
  if (newEventBtn) {
    newEventBtn.addEventListener("click", mostrarNovoEventoModal);
  }

  const prevMonth = document.getElementById("prevMonth");
  const nextMonth = document.getElementById("nextMonth");

  if (prevMonth && nextMonth) {
    prevMonth.addEventListener("click", () => {
      dataAtualCalendario.setMonth(dataAtualCalendario.getMonth() - 1);
      gerarGridCalendario(
        dataAtualCalendario.getMonth(),
        dataAtualCalendario.getFullYear()
      );
    });

    nextMonth.addEventListener("click", () => {
      dataAtualCalendario.setMonth(dataAtualCalendario.getMonth() + 1);
      gerarGridCalendario(
        dataAtualCalendario.getMonth(),
        dataAtualCalendario.getFullYear()
      );
    });
  }
}

function gerarGridCalendario(mes, ano) {
  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const currentMonthYear = document.getElementById("currentMonthYear");
  if (currentMonthYear) {
    currentMonthYear.textContent = `${monthNames[mes]} ${ano}`;
  }

  const calendarioGrid = document.getElementById("calendarioGrid");
  if (!calendarioGrid) return;

  const primeiroDia = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const hoje = new Date();

  let calendarioHTML = `
      <div style="background-color: #f9fafb; padding: 0.75rem; text-align: center; font-weight: 500; font-size: 0.875rem;">Dom</div>
      <div style="background-color: #f9fafb; padding: 0.75rem; text-align: center; font-weight: 500; font-size: 0.875rem;">Seg</div>
      <div style="background-color: #f9fafb; padding: 0.75rem; text-align: center; font-weight: 500; font-size: 0.875rem;">Ter</div>
      <div style="background-color: #f9fafb; padding: 0.75rem; text-align: center; font-weight: 500; font-size: 0.875rem;">Qua</div>
      <div style="background-color: #f9fafb; padding: 0.75rem; text-align: center; font-weight: 500; font-size: 0.875rem;">Qui</div>
      <div style="background-color: #f9fafb; padding: 0.75rem; text-align: center; font-weight: 500; font-size: 0.875rem;">Sex</div>
      <div style="background-color: #f9fafb; padding: 0.75rem; text-align: center; font-weight: 500; font-size: 0.875rem;">Sáb</div>
    `;

  // Empty cells for days before the first dia of the mes
  for (let i = 0; i < primeiroDia; i++) {
    calendarioHTML +=
      '<div style="background-color: #ffffff; padding: 0.75rem; min-height: 80px;"></div>';
  }

  // Days of the mes
  for (let dia = 1; dia <= diasNoMes; dia++) {
    const eHoje =
      dia === hoje.getDate() &&
      mes === hoje.getMonth() &&
      ano === hoje.getFullYear();
    const diaFormatado = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(
      dia
    ).padStart(2, "0")}`;
    const diaEventos = eventos.filter((event) => event.date === diaFormatado);

    const dayStyle = eHoje
      ? "background-color: #000000; color: #ffffff; font-weight: 600;"
      : "background-color: #ffffff; color: #000000;";

    calendarioHTML += `
        <div style="${dayStyle} padding: 0.75rem; min-height: 80px; cursor: pointer; position: relative;" onclick="diaSelecionado(${dia}, ${mes}, ${ano})">
          <div style="margin-bottom: 0.5rem;">${dia}</div>
          ${diaEventos
            .map(
              (event) => `
            <div style="background-color: #3b82f6; color: white; font-size: 0.75rem; padding: 0.125rem 0.25rem; border-radius: 0.25rem; margin-bottom: 0.125rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${event.title}">
              ${event.title}
            </div>
          `
            )
            .join("")}
        </div>
      `;
  }

  calendarioGrid.innerHTML = calendarioHTML;
}

function diaSelecionado(dia, mes, ano) {
  const dataSelecionada = new Date(ano, mes, dia);
  dataSelecionada.setHours(0, 0, 0, 0); // Zera hora

  const eventosDoDia = eventos.filter((evento) => {
    const [anoEvt, mesEvt, diaEvt] = evento.date.split("-");
    const dataEvento = new Date(
      parseInt(anoEvt),
      parseInt(mesEvt) - 1,
      parseInt(diaEvt)
    );
    dataEvento.setHours(0, 0, 0, 0);

    return dataEvento.getTime() === dataSelecionada.getTime();
  });

  if (eventosDoDia.length > 0) {
    const conteudoModal = eventosDoDia
      .map((evento) => {
        const [anoEvt, mesEvt, diaEvt] = evento.date.split("-");
        const dataFormatada = new Date(
          parseInt(anoEvt),
          parseInt(mesEvt) - 1,
          parseInt(diaEvt)
        ).toLocaleDateString("pt-BR");

        return `
        <div style="padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.375rem; margin-bottom: 0.5rem;">
          <h4 style="font-weight: 500; margin-bottom: 0.25rem;">${
            evento.title
          }</h4>
          <p style="font-size: 0.875rem; color: #666666; margin-bottom: 0.25rem;">
            ${dataFormatada} às ${evento.time}
          </p>
          <p style="font-size: 0.75rem; color: #9ca3af;">
            ${evento.participants?.length || 0} participantes
          </p>
        </div>
      `;
      })
      .join("");

    createModal(
      `Eventos em ${dataSelecionada.toLocaleDateString("pt-BR")}`,
      conteudoModal
    );
  } else {
    createModal(
      `Sem eventos em ${dataSelecionada.toLocaleDateString("pt-BR")}`,
      `<p style="color: #666666;">Nenhum evento agendado para esta data.</p>`
    );
  }
}

function gerarProximoEvento() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0); // zera a hora

  const eventosFuturos = eventos
    .filter((event) => {
      const [ano, mes, dia] = event.date.split("-");
      const dataEvento = new Date(
        parseInt(ano),
        parseInt(mes) - 1,
        parseInt(dia)
      );
      dataEvento.setHours(0, 0, 0, 0); // também zera a hora

      return dataEvento >= hoje;
    })
    .sort((a, b) => {
      const [ay, am, ad] = a.date.split("-");
      const [by, bm, bd] = b.date.split("-");
      return (
        new Date(parseInt(ay), parseInt(am) - 1, parseInt(ad)) -
        new Date(parseInt(by), parseInt(bm) - 1, parseInt(bd))
      );
    })
    .slice(0, 5);

  return eventosFuturos
    .map((event) => {
      const [ano, mes, dia] = event.date.split("-");
      const dataFormatada = new Date(
        parseInt(ano),
        parseInt(mes) - 1,
        parseInt(dia)
      ).toLocaleDateString("pt-BR");

      return `
        <div style="padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.375rem; margin-bottom: 0.5rem;">
          <h4 style="font-weight: 500; margin-bottom: 0.25rem;">${
            event.title
          }</h4>
          <p style="font-size: 0.875rem; color: #666666; margin-bottom: 0.25rem;">
            ${dataFormatada} às ${event.time}
          </p>
          <p style="font-size: 0.75rem; color: #9ca3af;">
            ${event.participants?.length || 0} participantes
          </p>
        </div>
      `;
    })
    .join("");
}

function mostrarNovoEventoModal() {
  const modal = createModal(
    "Criar Novo Evento",
    `
      <form id="newEventForm">
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Título do Evento</label>
          <input type="text" id="eventTitle" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Descrição</label>
          <textarea id="eventDescription" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; min-height: 80px; resize: vertical;"></textarea>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Data</label>
            <input type="date" id="eventDate" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
          </div>
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Horário</label>
            <input type="time" id="eventTime" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
          </div>
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Tipo</label>
          <select id="eventType" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
            <option value="meeting">Reunião</option>
            <option value="review">Revisão</option>
            <option value="presentation">Apresentação</option>
            <option value="deadline">Prazo</option>
            <option value="other">Outro</option>
          </select>
        </div>
        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <button type="button" onclick="fecharModal()" class="btn btn-outline">Cancelar</button>
          <button type="submit" class="btn btn-primary">Criar Evento</button>
        </div>
      </form>
    `
  );

  document.getElementById("newEventForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const dateInput = document.getElementById("eventDate").value;
    const [ano, mes, dia] = dateInput.split("-");

    const localDate = new Date();
    localDate.setFullYear(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
    localDate.setHours(12, 0, 0, 0);

    const dateOnly = `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;

    const novoEvento = {
      id: Date.now(),
      title: document.getElementById("eventTitle").value,
      description: document.getElementById("eventDescription").value,
      date: dateOnly,
      time: document.getElementById("eventTime").value,
      type: document.getElementById("eventType").value,
      participants: [],
    };

    eventos.push(novoEvento);
    fecharModal();
    carregarConteudoCalendario(); // Refresh calendario
  });
}

// CHAT /////////////////////////////////////////////////////////////////////////////////////////////////////////
function carregarConteudoChat() {
  const conteudoPagina = document.getElementById("conteudoPagina");

  conteudoPagina.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
      <div>
        <h1 style="font-size: 2rem; font-weight: bold; color: #000000; margin-bottom: 0.5rem;">Chat</h1>
        <p style="color: #666666;">Comunicação em tempo real com sua equipe</p>
      </div>
      <button id="newChatBtn" class="btn btn-primary">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Nova Conversa
      </button>
    </div>

    <div style="display: grid; grid-template-columns: 300px 1fr; gap: 1rem; height: 600px;">
      <!-- Lista de Conversas -->
      <div style="background-color: #ffffff; border-radius: 0.5rem; border: 1px solid #e5e7eb; padding: 1rem; display: flex; flex-direction: column;">
        <div style="position: relative; margin-bottom: 1rem;">
          <input 
            type="text" 
            id="chatSearch" 
            placeholder="Buscar conversas..."
            style="width: 100%; padding: 0.5rem 2rem 0.5rem 1rem; border-radius: 0.375rem; border: 1px solid #d1d5db;"
          >
          <svg style="position: absolute; right: 0.75rem; top: 0.5rem; width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="#666666">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3 style="font-weight: 600; margin-bottom: 1rem;">Conversas</h3>
        <div id="chatGruposList" style="overflow-y: auto; flex: 1;">${gerarListaChats()}</div>
      </div>

      <!-- Mensagens -->
      <div style="background-color: #ffffff; border-radius: 0.5rem; border: 1px solid #e5e7eb; display: flex; flex-direction: column;">
        <div id="chatHeader" style="padding: 1rem; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
          <h3 id="currentChatName" style="font-weight: 600;">Selecione uma conversa</h3>
          <button id="leaveChatBtn" style="display: none;" class="btn btn-outline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="margin-right: 4px;">
              <path d="M16 17l5-5m0 0l-5-5m5 5H4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Sair
          </button>
        </div>
        <div id="chatMessages" style="flex: 1; padding: 1rem; overflow-y: auto; background-color: #f9fafb; display: flex; flex-direction: column;">
          <div style="text-align: center; color: #666666; margin-top: 2rem;">
            Selecione uma conversa para começar
          </div>
        </div>
        <div id="chatInput" style="padding: 1rem; border-top: 1px solid #e5e7eb; display: none;">
          <div style="display: flex; gap: 0.5rem;">
            <input type="text" id="messageInput" placeholder="Digite sua mensagem..." style="flex: 1; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
            <button id="clearMessage" class="btn btn-outline" style="padding: 0.5rem;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666666">
                <path d="M6 18L18 6M6 6l12 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button id="sendMessage" class="btn btn-primary">Enviar</button>
          </div>
        </div>
      </div>
    </div>
  `;

  configChatFuncionalidade();
}

function configChatFuncionalidade() {
  document
    .getElementById("newChatBtn")
    ?.addEventListener("click", showNewChatModal);

  // Busca de conversas
  document.getElementById("chatSearch")?.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll(".chat-room-item").forEach((item) => {
      const name = item.querySelector("h4").textContent.toLowerCase();
      item.style.display = name.includes(term) ? "block" : "none";
    });
  });

  // Delegação de eventos para lista de conversas
  document.getElementById("chatGruposList")?.addEventListener("click", (e) => {
    const chatItem = e.target.closest(".chat-room-item");
    if (chatItem) {
      const roomId = parseInt(chatItem.getAttribute("data-room-id"));
      chatSelecionado(roomId);
    }
  });
}

function gerarListaChats() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return chatGrupos
    .map((room) => {
      const lastMessage = room.messages.length
        ? room.messages[room.messages.length - 1].content
        : "Sem mensagens ainda";

      // Calcular mensagens não lidas
      const unreadCount = room.messages.reduce((count, msg) => {
        return msg.sender !== user.name && !msg.read ? count + 1 : count;
      }, 0);

      return `
      <div class="chat-room-item" data-room-id="${room.id}"
        style="padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.375rem; margin-bottom: 0.5rem; cursor: pointer; position: relative;"
        onmouseover="this.style.backgroundColor='#f3f4f6'"
        onmouseout="this.style.backgroundColor='${
          room.id ===
          parseInt(
            localStorage.getItem("ultimoChat") ? "#f3f4f6" : "transparent"
          )
        }'">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="overflow: hidden; width: ${
            unreadCount ? "calc(100% - 30px)" : "100%"
          }">
            <h4 style="font-weight: 500; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${
              room.name
            }</h4>
            <p style="font-size: 0.75rem; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${lastMessage}</p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            ${
              unreadCount > 0
                ? `
              <span style="background-color: #3b82f6; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem;">
                ${unreadCount}
              </span>
            `
                : ""
            }
            <div style="width: 8px; height: 8px; background-color: ${
              room.type === "public" ? "#10b981" : "#3b82f6"
            }; border-radius: 50%;"></div>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

function chatSelecionado(roomId) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const room = chatGrupos.find((r) => r.id === roomId);
  if (!room) return;

  // Salvar último chat aberto
  localStorage.setItem("ultimoChat", roomId);

  // Marcar mensagens como lidas
  room.messages.forEach((msg) => {
    if (msg.sender !== user.name) msg.read = true;
  });

  document.getElementById("currentChatName").textContent = room.name;
  const chatMessages = document.getElementById("chatMessages");
  chatMessages.innerHTML = generateChatMessages(room.messages);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  document.getElementById("chatInput").style.display = "block";

  // Mostrar botão de sair
  const leaveBtn = document.getElementById("leaveChatBtn");
  leaveBtn.style.display = "block";
  leaveBtn.onclick = () => sairDaConversa(roomId);

  setupMessageSending(roomId);

  // Atualizar lista de chats
  atualizarListaChats();
}

function sairDaConversa(roomId) {
  const roomIndex = chatGrupos.findIndex((r) => r.id === roomId);
  if (roomIndex === -1) return;

  // Remover a conversa
  chatGrupos.splice(roomIndex, 1);

  // Resetar a interface do chat
  document.getElementById("currentChatName").textContent =
    "Selecione uma conversa";
  document.getElementById("chatMessages").innerHTML = `
    <div style="text-align: center; color: #666666; margin-top: 2rem;">
      Selecione uma conversa para começar
    </div>
  `;
  document.getElementById("chatInput").style.display = "none";
  document.getElementById("leaveChatBtn").style.display = "none";

  // Limpar último chat salvo
  localStorage.removeItem("ultimoChat");

  // Atualizar a lista de conversas
  atualizarListaChats();
}

function generateChatMessages(messages) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (messages.length === 0) {
    return `
      <div style="text-align: center; color: #666666; margin-top: 2rem;">
        Nenhuma mensagem ainda. Seja o primeiro a enviar!
      </div>
    `;
  }

  let currentDate = "";
  let html = "";
  let lastSender = null;

  messages.forEach((message, index) => {
    const isOwn = message.sender === user.name;
    const messageDate = new Date(message.timestamp).toLocaleDateString("pt-BR");
    const showDate = currentDate !== messageDate;

    if (showDate) {
      currentDate = messageDate;
      html += `
        <div style="text-align: center; margin: 1rem 0; position: relative;">
          <hr style="position: absolute; top: 50%; width: 100%; margin: 0; border-color: #e5e7eb;">
          <span style="background: #f9fafb; position: relative; z-index: 1; padding: 0 1rem; color: #666; font-size: 0.8rem;">
            ${currentDate}
          </span>
        </div>
      `;
    }

    const showSender = !isOwn && lastSender !== message.sender;
    lastSender = message.sender;

    html += `
      <div style="margin-bottom: 0.5rem; display: flex; ${
        isOwn ? "justify-content: flex-end" : "justify-content: flex-start"
      };">
        <div style="max-width: 70%; ${
          isOwn
            ? "background-color: #000000; color: white;"
            : "background-color: white; color: black; border: 1px solid #e5e7eb;"
        } padding: 0.75rem; border-radius: 0.5rem;">
          ${
            showSender && !isOwn
              ? `<div style="font-weight: 500; font-size: 0.875rem; margin-bottom: 0.25rem;">${sanitizeHTML(
                  message.sender
                )}</div>`
              : ""
          }
          <div>${sanitizeHTML(message.content)}</div>
          <div style="font-size: 0.75rem; ${
            isOwn ? "color: #d1d5db" : "color: #9ca3af"
          }; margin-top: 0.25rem; text-align: right;">
            ${new Date(message.timestamp).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    `;
  });

  return html;
}

// Prevenção contra XSS
function sanitizeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function setupMessageSending(roomId) {
  const messageInput = document.getElementById("messageInput");
  const sendButton = document.getElementById("sendMessage");
  const clearButton = document.getElementById("clearMessage");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Função para limpar o campo
  clearButton.onclick = () => {
    messageInput.value = "";
    messageInput.focus();
  };

  const send = () => {
    const content = messageInput.value.trim();
    if (!content) return;

    const room = chatGrupos.find((r) => r.id === roomId);
    if (!room) return;

    const message = {
      id: Date.now(),
      sender: user.name,
      content,
      timestamp: new Date().toISOString(),
      type: "text",
      read: false,
    };

    room.messages.push(message);
    messageInput.value = "";
    messageInput.focus();

    // Atualizar apenas as mensagens
    const chatMessages = document.getElementById("chatMessages");
    chatMessages.innerHTML = generateChatMessages(room.messages);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Atualizar lista de chats
    atualizarListaChats();
  };

  sendButton.onclick = send;
  messageInput.onkeypress = (e) => {
    if (e.key === "Enter") send();
  };
}

function showNewChatModal() {
  const modal = createModal(
    "Nova Conversa",
    `
    <form id="newChatForm">
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Nome da Conversa</label>
        <input type="text" id="chatName" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Tipo</label>
        <select id="chatType" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
          <option value="public">Público</option>
          <option value="private">Privado</option>
        </select>
      </div>
      <div style="display: flex; gap: 1rem; justify-content: flex-end;">
        <button type="button" onclick="fecharModal()" class="btn btn-outline">Cancelar</button>
        <button type="submit" class="btn btn-primary">Criar Conversa</button>
      </div>
    </form>
    `
  );

  document.getElementById("newChatForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const newChat = {
      id: Date.now(),
      name: document.getElementById("chatName").value,
      type: document.getElementById("chatType").value,
      members: [user.name],
      messages: [],
    };

    chatGrupos.push(newChat);
    fecharModal();

    // Atualizar apenas a lista de chats
    atualizarListaChats();

    // Selecionar o novo chat automaticamente
    setTimeout(() => chatSelecionado(newChat.id), 100);
  });
}

// Função para atualizar apenas a lista de chats
function atualizarListaChats() {
  const container = document.getElementById("chatGruposList");
  if (container) {
    container.innerHTML = gerarListaChats();
  }
}

// Carregar último chat aberto ao iniciar
window.addEventListener("DOMContentLoaded", () => {
  // Primeiro monta a interface do chat
  carregarConteudoChat();

  // Depois tenta carregar o último chat aberto
  const ultimoChat = localStorage.getItem("ultimoChat");
  if (ultimoChat) {
    setTimeout(() => {
      const roomExists = chatGrupos.some((r) => r.id === parseInt(ultimoChat));
      if (roomExists) chatSelecionado(parseInt(ultimoChat));
    }, 100);
  }
});

// FIM CHAT /////////////////////////////////////////////////////////////////////////////////////////////////////////

// EQUIPES /////////////////////////////////////////////////////////////////////////////////////////////////////////
function loadEquipesContent() {
  const conteudoPagina = document.getElementById("conteudoPagina");

  conteudoPagina.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <div>
          <h1 style="font-size: 2rem; font-weight: bold; color: #000000; margin-bottom: 0.5rem;">Equipes</h1>
          <p style="color: #666666;">Gerencie grupos e permissões</p>
        </div>
        <button id="newTeamBtn" class="btn btn-primary">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Nova Equipe
        </button>
      </div>
  
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">
        ${generateTeamCards()}
      </div>
    `;

  setupTeamsFunctionality();
}

function setupTeamsFunctionality() {
  const newTeamBtn = document.getElementById("newTeamBtn");
  if (newTeamBtn) {
    newTeamBtn.addEventListener("click", showNewTeamModal);
  }

  // Setup equipe card actions
  setupTeamCardActions();
}

function generateTeamCards() {
  return equipes
    .map(
      (equipe) => `
      <div data-equipe-id="${
        equipe.id
      }" style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); transition: box-shadow 0.2s ease;" onmouseover="this.style.boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.1)'" onmouseout="this.style.boxShadow='0 1px 3px 0 rgba(0, 0, 0, 0.1)'">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
          <div style="flex: 1;">
            <h3 style="font-size: 1.25rem; font-weight: 600; color: #000000; margin-bottom: 0.5rem;">${
              equipe.name
            }</h3>
            <p style="color: #666666; font-size: 0.875rem; margin-bottom: 0.75rem;">${
              equipe.description
            }</p>
          </div>
          <button onclick="toggleTeamMenu(${
            equipe.id
          })" style="background: none; border: none; cursor: pointer; padding: 0.25rem; color: #666666;">
            <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="1"/>
              <circle cx="19" cy="12" r="1"/>
              <circle cx="5" cy="12" r="1"/>
            </svg>
          </button>
        </div>
  
        <div style="margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-weight: 500; font-size: 0.875rem;">Líder:</span>
            <span style="color: #3b82f6; font-weight: 500;">${
              equipe.leader
            }</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-weight: 500; font-size: 0.875rem;">Membros:</span>
            <span>${equipe.members.length}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 500; font-size: 0.875rem;">Projetos:</span>
            <span>${equipe.projetos.length}</span>
          </div>
        </div>
  
        <div style="margin-bottom: 1rem;">
          <h4 style="font-weight: 500; margin-bottom: 0.5rem; font-size: 0.875rem;">Membros da Equipe:</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
            ${equipe.members
              .map(
                (member) => `
              <span style="background-color: #f3f4f6; color: #374151; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">
                ${member}
              </span>
            `
              )
              .join("")}
          </div>
        </div>
  
        <div style="margin-bottom: 1rem;">
          <h4 style="font-weight: 500; margin-bottom: 0.5rem; font-size: 0.875rem;">Projetos:</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
            ${equipe.projetos
              .map(
                (projetos) => `
              <span style="background-color: #dbeafe; color: #1e40af; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">
                ${projetos}
              </span>
            `
              )
              .join("")}
          </div>
        </div>
  
        <div style="display: flex; gap: 0.5rem;">
          <button class="edit-equipe-btn btn btn-outline" style="flex: 1; font-size: 0.875rem;">
            <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Editar
          </button>
          <button class="view-equipe-btn btn btn-outline" style="flex: 1; font-size: 0.875rem;">Ver Detalhes</button>
        </div>
      </div>
    `
    )
    .join("");
}

function setupTeamCardActions() {
  // Edit equipe buttons
  document.querySelectorAll(".edit-equipe-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const teamId = Number.parseInt(
        e.target.closest("[data-equipe-id]").getAttribute("data-equipe-id")
      );
      editTeam(teamId);
    });
  });

  // View details buttons
  document.querySelectorAll(".view-equipe-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const teamId = Number.parseInt(
        e.target.closest("[data-equipe-id]").getAttribute("data-equipe-id")
      );
      viewTeamDetails(teamId);
    });
  });
}

function showNewTeamModal() {
  const modal = createModal(
    "Criar Nova Equipe",
    `
      <form id="newTeamForm">
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Nome da Equipe</label>
          <input type="text" id="teamName" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Descrição</label>
          <textarea id="teamDescription" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; min-height: 80px; resize: vertical;"></textarea>
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Líder da Equipe</label>
          <input type="text" id="teamLeader" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;" placeholder="Nome do líder">
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Membros (separados por vírgula)</label>
          <textarea id="teamMembers" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; min-height: 60px; resize: vertical;" placeholder="João Silva, Maria Santos, Pedro Costa"></textarea>
        </div>
        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <button type="button" onclick="fecharModal()" class="btn btn-outline">Cancelar</button>
          <button type="submit" class="btn btn-primary">Criar Equipe</button>
        </div>
      </form>
    `
  );

  document.getElementById("newTeamForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const membersText = document.getElementById("teamMembers").value;
    const members = membersText
      ? membersText
          .split(",")
          .map((m) => m.trim())
          .filter((m) => m)
      : [];
    const leader = document.getElementById("teamLeader").value;

    // Add leader to members if not already included
    if (!members.includes(leader)) {
      members.unshift(leader);
    }

    const newTeam = {
      id: Date.now(),
      name: document.getElementById("teamName").value,
      description: document.getElementById("teamDescription").value,
      leader: leader,
      members: members,
      projetos: [],
      createdAt: getDataBrasiliaISO(),
    };

    equipes.push(newTeam);
    fecharModal();
    loadEquipesContent(); // Refresh equipes
  });
}

function editTeam(teamId) {
  const equipe = equipes.find((t) => t.id === teamId);
  if (!equipe) return;

  const modal = createModal(
    "Editar Equipe",
    `
      <form id="editTeamForm">
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Nome da Equipe</label>
          <input type="text" id="editTeamName" value="${
            equipe.name
          }" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Descrição</label>
          <textarea id="editTeamDescription" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; min-height: 80px; resize: vertical;">${
            equipe.description
          }</textarea>
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Líder da Equipe</label>
          <input type="text" id="editTeamLeader" value="${
            equipe.leader
          }" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Membros (separados por vírgula)</label>
          <textarea id="editTeamMembers" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; min-height: 60px; resize: vertical;">${equipe.members.join(
            ", "
          )}</textarea>
        </div>
        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <button type="button" onclick="fecharModal()" class="btn btn-outline">Cancelar</button>
          <button type="submit" class="btn btn-primary">Salvar Alterações</button>
        </div>
      </form>
    `
  );

  document.getElementById("editTeamForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const membersText = document.getElementById("editTeamMembers").value;
    const members = membersText
      ? membersText
          .split(",")
          .map((m) => m.trim())
          .filter((m) => m)
      : [];
    const leader = document.getElementById("editTeamLeader").value;

    // Add leader to members if not already included
    if (!members.includes(leader)) {
      members.unshift(leader);
    }

    equipe.name = document.getElementById("editTeamName").value;
    equipe.description = document.getElementById("editTeamDescription").value;
    equipe.leader = leader;
    equipe.members = members;

    fecharModal();
    loadEquipesContent(); // Refresh equipes
  });
}

function viewTeamDetails(teamId) {
  const equipe = equipes.find((t) => t.id === teamId);
  if (!equipe) return;

  const modal = createModal(
    `Detalhes da Equipe: ${equipe.name}`,
    `
      <div style="max-height: 400px; overflow-y: auto;">
        <div style="margin-bottom: 1.5rem;">
          <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Informações Gerais</h3>
          <p style="margin-bottom: 0.5rem;"><strong>Descrição:</strong> ${
            equipe.description
          }</p>
          <p style="margin-bottom: 0.5rem;"><strong>Líder:</strong> ${
            equipe.leader
          }</p>
          <p style="margin-bottom: 0.5rem;"><strong>Total de Membros:</strong> ${
            equipe.members.length
          }</p>
          <p style="margin-bottom: 0.5rem;"><strong>Projetos Ativos:</strong> ${
            equipe.projetos.length
          }</p>
          <p style="margin-bottom: 0.5rem;"><strong>Criada em:</strong> ${new Date(
            equipe.createdAt
          ).toLocaleDateString("pt-BR")}</p>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
          <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Membros da Equipe</h3>
          <div style="display: grid; gap: 0.5rem;">
            ${equipe.members
              .map(
                (member) => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background-color: #f9fafb; border-radius: 0.375rem;">
                <span>${member}</span>
                ${
                  member === equipe.leader
                    ? '<span style="background-color: #3b82f6; color: white; padding: 0.125rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">Líder</span>'
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>
        </div>
  
        <div>
          <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Projetos</h3>
          ${
            equipe.projetos.length > 0
              ? equipe.projetos
                  .map(
                    (projetos) => `
              <div style="padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.375rem; margin-bottom: 0.5rem;">
                <h4 style="font-weight: 500;">${projetos}</h4>
              </div>
            `
                  )
                  .join("")
              : '<p style="color: #666666; text-align: center; padding: 1rem;">Nenhum projeto atribuído</p>'
          }
        </div>
      </div>
      <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
        <button type="button" onclick="editTeam(${
          equipe.id
        })" class="btn btn-outline">Editar</button>
        <button type="button" onclick="fecharModal()" class="btn btn-primary">Fechar</button>
      </div>
    `
  );
}

// Notices functionality
function loadAvisosContent() {
  const conteudoPagina = document.getElementById("conteudoPagina");

  conteudoPagina.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <div>
          <h1 style="font-size: 2rem; font-weight: bold; color: #000000; margin-bottom: 0.5rem;">Avisos</h1>
          <p style="color: #666666;">Comunicados e notificações importantes</p>
        </div>
        <button id="newNoticeBtn" class="btn btn-primary">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Novo Aviso
        </button>
      </div>
  
      <div style="display: flex; gap: 1rem; margin-bottom: 2rem;">
        <select id="noticePriorityFilter" style="padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
          <option value="todas">Todas as Prioridades</option>
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>
        <select id="noticeTypeFilter" style="padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
          <option value="todos">Todos os Tipos</option>
          <option value="policy">Política</option>
          <option value="maintenance">Manutenção</option>
          <option value="announcement">Anúncio</option>
          <option value="urgent">Urgente</option>
        </select>
      </div>
  
      <div id="avisosContainer" style="display: flex; flex-direction: column; gap: 1rem;">
        ${generateNoticeCards()}
      </div>
    `;

  setupNoticesFunctionality();
}

function setupNoticesFunctionality() {
  const newNoticeBtn = document.getElementById("newNoticeBtn");
  if (newNoticeBtn) {
    newNoticeBtn.addEventListener("click", showNewNoticeModal);
  }

  // Filters
  const priorityFilter = document.getElementById("noticePriorityFilter");
  const typeFilter = document.getElementById("noticeTypeFilter");

  if (priorityFilter) {
    priorityFilter.addEventListener("change", filterNotices);
  }

  if (typeFilter) {
    typeFilter.addEventListener("change", filterNotices);
  }

  setupNoticeActions();
}

function generateNoticeCards() {
  return avisos
    .map(
      (notice) => `
      <div data-notice-id="${
        notice.id
      }" style="background-color: #ffffff; border: 1px solid #e5e7eb; border-left: 4px solid ${getNoticePriorityColor(
        notice.priority
      )}; border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <h3 style="font-size: 1.25rem; font-weight: 600; color: #000000;">${
                notice.title
              }</h3>
              <span style="padding: 0.25rem 0.5rem; background-color: ${getNoticePriorityBgColor(
                notice.priority
              )}; color: ${getNoticePriorityTextColor(
        notice.priority
      )}; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 500;">
                ${notice.priority.toUpperCase()}
              </span>
              <span style="padding: 0.25rem 0.5rem; background-color: ${getNoticeTypeBgColor(
                notice.type
              )}; color: ${getNoticeTypeTextColor(
        notice.type
      )}; border-radius: 0.25rem; font-size: 0.75rem;">
                ${getNoticeTypeLabel(notice.type)}
              </span>
            </div>
            <p style="color: #666666; margin-bottom: 0.75rem; line-height: 1.5;">${
              notice.content
            }</p>
            <div style="display: flex; align-items: center; gap: 1rem; font-size: 0.875rem; color: #9ca3af;">
              <div style="display: flex; align-items: center; gap: 0.25rem;">
                <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
                </svg>
                <span>Por: ${notice.author}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 0.25rem;">
                <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>Publicado: ${new Date(
                  notice.publishedAt
                ).toLocaleDateString("pt-BR")}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 0.25rem;">
                <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                <span>Expira: ${new Date(notice.expiresAt).toLocaleDateString(
                  "pt-BR"
                )}</span>
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="edit-notice-btn btn btn-outline" style="font-size: 0.875rem;">Editar</button>
            <button class="delete-notice-btn btn btn-outline" style="font-size: 0.875rem; color: #dc2626; border-color: #dc2626;">Excluir</button>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

function setupNoticeActions() {
  // Edit notice buttons
  document.querySelectorAll(".edit-notice-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const noticeId = Number.parseInt(
        e.target.closest("[data-notice-id]").getAttribute("data-notice-id")
      );
      editNotice(noticeId);
    });
  });

  // Delete notice buttons
  document.querySelectorAll(".delete-notice-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const noticeId = Number.parseInt(
        e.target.closest("[data-notice-id]").getAttribute("data-notice-id")
      );
      deleteNotice(noticeId);
    });
  });
}

function filterNotices() {
  const priorityFilter =
    document.getElementById("noticePriorityFilter")?.value || "todas";
  const typeFilter =
    document.getElementById("noticeTypeFilter")?.value || "todos";

  const filteredNotices = avisos.filter((notice) => {
    const matchesPriority =
      priorityFilter === "todas" || notice.priority === priorityFilter;
    const matchesType = typeFilter === "todos" || notice.type === typeFilter;
    return matchesPriority && matchesType;
  });

  const avisosContainer = document.getElementById("avisosContainer");
  if (avisosContainer) {
    avisosContainer.innerHTML = generateNoticeCardsFromArray(filteredNotices);
    setupNoticeActions();
  }
}

function generateNoticeCardsFromArray(avisosArray) {
  return avisosArray
    .map(
      (notice) => `
      <div data-notice-id="${
        notice.id
      }" style="background-color: #ffffff; border: 1px solid #e5e7eb; border-left: 4px solid ${getNoticePriorityColor(
        notice.priority
      )}; border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <h3 style="font-size: 1.25rem; font-weight: 600; color: #000000;">${
                notice.title
              }</h3>
              <span style="padding: 0.25rem 0.5rem; background-color: ${getNoticePriorityBgColor(
                notice.priority
              )}; color: ${getNoticePriorityTextColor(
        notice.priority
      )}; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 500;">
                ${notice.priority.toUpperCase()}
              </span>
              <span style="padding: 0.25rem 0.5rem; background-color: ${getNoticeTypeBgColor(
                notice.type
              )}; color: ${getNoticeTypeTextColor(
        notice.type
      )}; border-radius: 0.25rem; font-size: 0.75rem;">
                ${getNoticeTypeLabel(notice.type)}
              </span>
            </div>
            <p style="color: #666666; margin-bottom: 0.75rem; line-height: 1.5;">${
              notice.content
            }</p>
            <div style="display: flex; align-items: center; gap: 1rem; font-size: 0.875rem; color: #9ca3af;">
              <div style="display: flex; align-items: center; gap: 0.25rem;">
                <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
                </svg>
                <span>Por: ${notice.author}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 0.25rem;">
                <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>Publicado: ${new Date(
                  notice.publishedAt
                ).toLocaleDateString("pt-BR")}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 0.25rem;">
                <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                <span>Expira: ${new Date(notice.expiresAt).toLocaleDateString(
                  "pt-BR"
                )}</span>
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="edit-notice-btn btn btn-outline" style="font-size: 0.875rem;">Editar</button>
            <button class="delete-notice-btn btn btn-outline" style="font-size: 0.875rem; color: #dc2626; border-color: #dc2626;">Excluir</button>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

function showNewNoticeModal() {
  const modal = createModal(
    "Criar Novo Aviso",
    `
      <form id="newNoticeForm">
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Título do Aviso</label>
          <input type="text" id="noticeTitle" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Conteúdo</label>
          <textarea id="noticeContent" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; min-height: 120px; resize: vertical;"></textarea>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Prioridade</label>
            <select id="noticePriority" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
              <option value="baixa">Baixa</option>
              <option value="media" selected>Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Tipo</label>
            <select id="noticeType" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
              <option value="announcement">Anúncio</option>
              <option value="policy">Política</option>
              <option value="maintenance">Manutenção</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Data de Expiração</label>
          <input type="date" id="noticeExpires" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
        </div>
        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <button type="button" onclick="fecharModal()" class="btn btn-outline">Cancelar</button>
          <button type="submit" class="btn btn-primary">Publicar Aviso</button>
        </div>
      </form>
    `
  );

  document.getElementById("newNoticeForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    const newNotice = {
      id: Date.now(),
      title: document.getElementById("noticeTitle").value,
      content: document.getElementById("noticeContent").value,
      priority: document.getElementById("noticePriority").value,
      type: document.getElementById("noticeType").value,
      author: user.name,
      publishedAt: new Date().toISOString().split("T")[0],
      expiresAt: document.getElementById("noticeExpires").value,
    };

    avisos.push(newNotice);
    fecharModal();
    loadAvisosContent(); // Refresh avisos
  });
}

function editNotice(noticeId) {
  const notice = avisos.find((n) => n.id === noticeId);
  if (!notice) return;

  const modal = createModal(
    "Editar Aviso",
    `
      <form id="editNoticeForm">
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Título do Aviso</label>
          <input type="text" id="editNoticeTitle" value="${
            notice.title
          }" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Conteúdo</label>
          <textarea id="editNoticeContent" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; min-height: 120px; resize: vertical;">${
            notice.content
          }</textarea>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Prioridade</label>
            <select id="editNoticePriority" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
              <option value="baixa" ${
                notice.priority === "baixa" ? "selected" : ""
              }>Baixa</option>
              <option value="media" ${
                notice.priority === "media" ? "selected" : ""
              }>Média</option>
              <option value="alta" ${
                notice.priority === "alta" ? "selected" : ""
              }>Alta</option>
            </select>
          </div>
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Tipo</label>
            <select id="editNoticeType" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
              <option value="announcement" ${
                notice.type === "announcement" ? "selected" : ""
              }>Anúncio</option>
              <option value="policy" ${
                notice.type === "policy" ? "selected" : ""
              }>Política</option>
              <option value="maintenance" ${
                notice.type === "maintenance" ? "selected" : ""
              }>Manutenção</option>
              <option value="urgent" ${
                notice.type === "urgent" ? "selected" : ""
              }>Urgente</option>
            </select>
          </div>
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Data de Expiração</label>
          <input type="date" id="editNoticeExpires" value="${
            notice.expiresAt
          }" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
        </div>
        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <button type="button" onclick="fecharModal()" class="btn btn-outline">Cancelar</button>
          <button type="submit" class="btn btn-primary">Salvar Alterações</button>
        </div>
      </form>
    `
  );

  document.getElementById("editNoticeForm").addEventListener("submit", (e) => {
    e.preventDefault();

    notice.title = document.getElementById("editNoticeTitle").value;
    notice.content = document.getElementById("editNoticeContent").value;
    notice.priority = document.getElementById("editNoticePriority").value;
    notice.type = document.getElementById("editNoticeType").value;
    notice.expiresAt = document.getElementById("editNoticeExpires").value;

    fecharModal();
    loadAvisosContent(); // Refresh avisos
  });
}

function deleteNotice(noticeId) {
  if (
    confirm(
      "Tem certeza que deseja excluir este aviso? Esta ação não pode ser desfeita."
    )
  ) {
    avisos = avisos.filter((n) => n.id !== noticeId);
    loadAvisosContent(); // Refresh avisos
  }
}

// Profile functionality
function loadPerfilContent() {
  const user = JSON.parse(localStorage.getItem("user"));
  const conteudoPagina = document.getElementById("conteudoPagina");

  conteudoPagina.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <div>
          <h1 style="font-size: 2rem; font-weight: bold; color: #000000; margin-bottom: 0.5rem;">Perfil</h1>
          <p style="color: #666666;">Gerencie suas informações pessoais</p>
        </div>
      </div>
  
      <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 2rem;">
        <!-- Profile Picture and Basic Info -->
        <div style="background-color: #ffffff; border-radius: 0.5rem; border: 1px solid #e5e7eb; padding: 1.5rem;">
          <div style="text-align: center; margin-bottom: 1.5rem;">
            <div style="width: 6rem; height: 6rem; background-color: #000000; color: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 2rem; margin: 0 auto 1rem;">
              ${getInitials(user.name)}
            </div>
            <h2 style="font-size: 1.5rem; font-weight: 600; color: #000000; margin-bottom: 0.25rem;">${
              user.name
            }</h2>
            <p style="color: #666666; margin-bottom: 0.25rem;">${user.email}</p>
            <p style="color: #666666; font-size: 0.875rem;">${cargosLabel(
              user.role
            )}</p>
          </div>
          
          <div style="space-y: 0.5rem;">
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #f3f4f6;">
              <span style="font-weight: 500;">Status:</span>
              <span style="color: #10b981;">Ativo</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #f3f4f6;">
              <span style="font-weight: 500;">Membro desde:</span>
              <span>Janeiro 2025</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #f3f4f6;">
              <span style="font-weight: 500;">Último acesso:</span>
              <span>Hoje</span>
            </div>
          </div>
        </div>
  
        <!-- Profile Form -->
        <div style="background-color: #ffffff; border-radius: 0.5rem; border: 1px solid #e5e7eb; padding: 1.5rem;">
          <h3 style="font-weight: 600; margin-bottom: 1.5rem;">Informações Pessoais</h3>
          
          <form id="profileForm">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Nome</label>
                <input type="text" id="profileName" value="${
                  user.name
                }" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
              </div>
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Sobrenome</label>
                <input type="text" id="profileLastName" value="" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
              </div>
            </div>
            
            <div style="margin-bottom: 1rem;">
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">E-mail</label>
              <input type="email" id="profileEmail" value="${
                user.email
              }" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Telefone</label>
                <input type="tel" id="profilePhone" value="" placeholder="(11) 99999-9999" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
              </div>
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Departamento</label>
                <select id="profileDepartment" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
                  <option value="">Selecione</option>
                  <option value="desenvolvimento">Desenvolvimento</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="vendas">Vendas</option>
                  <option value="rh">Recursos Humanos</option>
                  <option value="financeiro">Financeiro</option>
                </select>
              </div>
            </div>
            
            <div style="margin-bottom: 1rem;">
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Bio</label>
              <textarea id="profileBio" placeholder="Conte um pouco sobre você..." style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; min-height: 80px; resize: vertical;"></textarea>
            </div>
            
            <div style="margin-bottom: 1.5rem;">
              <h4 style="font-weight: 600; margin-bottom: 1rem;">Alterar Senha</h4>
              <div style="display: grid; gap: 1rem;">
                <div>
                  <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Senha Atual</label>
                  <input type="password" id="currentPassword" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                  <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Nova Senha</label>
                    <input type="password" id="newPassword" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
                  </div>
                  <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Confirmar Nova Senha</label>
                    <input type="password" id="confirmNewPassword" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
                  </div>
                </div>
              </div>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
              <button type="button" class="btn btn-outline">Cancelar</button>
              <button type="submit" class="btn btn-primary">Salvar Alterações</button>
            </div>
          </form>
        </div>
      </div>
    `;

  setupProfileFunctionality();
}

function setupProfileFunctionality() {
  const profileForm = document.getElementById("profileForm");
  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const user = JSON.parse(localStorage.getItem("user"));
      const newPassword = document.getElementById("newPassword").value;
      const confirmNewPassword =
        document.getElementById("confirmNewPassword").value;

      // Validate password change if provided
      if (newPassword || confirmNewPassword) {
        if (newPassword !== confirmNewPassword) {
          alert("As senhas não coincidem");
          return;
        }
        if (newPassword.length < 6) {
          alert("A nova senha deve ter pelo menos 6 caracteres");
          return;
        }
      }

      // Update user data
      user.name = document.getElementById("profileName").value;
      user.email = document.getElementById("profileEmail").value;

      localStorage.setItem("user", JSON.stringify(user));

      alert("Perfil atualizado com sucesso!");
      loadPerfilContent(); // Refresh profile
    });
  }
}

// Settings functionality
function loadConfiguracoesContent() {
  const conteudoPagina = document.getElementById("conteudoPagina");

  conteudoPagina.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <div>
          <h1 style="font-size: 2rem; font-weight: bold; color: #000000; margin-bottom: 0.5rem;">Configurações</h1>
          <p style="color: #666666;">Personalize sua experiência no Kontrollar</p>
        </div>
      </div>
  
<!-- <div style="display: grid; gap: 1.5rem;">
  <div style="background-color: #ffffff; border-radius: 0.5rem; border: 1px solid #e5e7eb; padding: 1.5rem;">
    <h3 style="font-weight: 600; margin-bottom: 1rem;">Aparência</h3>
    
    <div style="display: grid; gap: 1rem;">
      <div>
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Tema</label>
        <select id="themeSelect" style="width: 100%; max-width: 200px; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
          <option value="light">Claro</option>
          <option value="dark">Escuro</option>
          <option value="auto">Automático</option>
        </select>
      </div>
      
      <div>
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Tamanho da Fonte</label>
        <select id="fontSizeSelect" style="width: 100%; max-width: 200px; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
          <option value="small">Pequena</option>
          <option value="medium" selected>Média</option>
          <option value="large">Grande</option>
        </select>
      </div>
    </div>
  </div> -->
  
        <!-- Notification Settings -->
        <div style="background-color: #ffffff; border-radius: 0.5rem; border: 1px solid #e5e7eb; padding: 1.5rem;">
          <h3 style="font-weight: 600; margin-bottom: 1rem;">Notificações</h3>
          
          <div style="display: grid; gap: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h4 style="font-weight: 500; margin-bottom: 0.25rem;">Notificações por E-mail</h4>
                <p style="color: #666666; font-size: 0.875rem;">Receba notificações importantes por e-mail</p>
              </div>
              <label style="position: relative; display: inline-block; width: 60px; height: 34px;">
                <input type="checkbox" id="emailNotifications" checked style="opacity: 0; width: 0; height: 0;">
                <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
              </label>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h4 style="font-weight: 500; margin-bottom: 0.25rem;">Notificações Push</h4>
                <p style="color: #666666; font-size: 0.875rem;">Receba notificações no navegador</p>
              </div>
              <label style="position: relative; display: inline-block; width: 60px; height: 34px;">
                <input type="checkbox" id="pushNotifications" checked style="opacity: 0; width: 0; height: 0;">
                <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
              </label>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h4 style="font-weight: 500; margin-bottom: 0.25rem;">Sons de Notificação</h4>
                <p style="color: #666666; font-size: 0.875rem;">Reproduzir sons para novas notificações</p>
              </div>
              <label style="position: relative; display: inline-block; width: 60px; height: 34px;">
                <input type="checkbox" id="soundNotifications" style="opacity: 0; width: 0; height: 0;">
                <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
              </label>
            </div>
          </div>
        </div>
  
        <!-- Privacy Settings -->
        <div style="background-color: #ffffff; border-radius: 0.5rem; border: 1px solid #e5e7eb; padding: 1.5rem;">
          <h3 style="font-weight: 600; margin-bottom: 1rem;">Privacidade</h3>
          
          <div style="display: grid; gap: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h4 style="font-weight: 500; margin-bottom: 0.25rem;">Perfil Público</h4>
                <p style="color: #666666; font-size: 0.875rem;">Permitir que outros usuários vejam seu perfil</p>
              </div>
              <label style="position: relative; display: inline-block; width: 60px; height: 34px;">
                <input type="checkbox" id="publicProfile" checked style="opacity: 0; width: 0; height: 0;">
                <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
              </label>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h4 style="font-weight: 500; margin-bottom: 0.25rem;">Status Online</h4>
                <p style="color: #666666; font-size: 0.875rem;">Mostrar quando você está online</p>
              </div>
              <label style="position: relative; display: inline-block; width: 60px; height: 34px;">
                <input type="checkbox" id="onlineStatus" checked style="opacity: 0; width: 0; height: 0;">
                <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
              </label>
            </div>
          </div>
        </div>
  
        <!-- <div style="background-color: #ffffff; border-radius: 0.5rem; border: 1px solid #e5e7eb; padding: 1.5rem;">
          <h3 style="font-weight: 600; margin-bottom: 1rem;">Sistema</h3>
          
          <div style="display: grid; gap: 1rem;">
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Idioma</label>
              <select id="languageSelect" style="width: 100%; max-width: 200px; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
                <option value="pt-BR" selected>Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </select>
            </div>
            
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Fuso Horário</label>
              <select id="timezoneSelect" style="width: 100%; max-width: 300px; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
                <option value="America/Sao_Paulo" selected>São Paulo (GMT-3)</option>
                <option value="America/New_York">New York (GMT-5)</option>
                <option value="Europe/London">London (GMT+0)</option>
              </select>
            </div>
          </div>
        </div>
  
        <!-- Data Management -->
        <div style="background-color: #ffffff; border-radius: 0.5rem; border: 1px solid #e5e7eb; padding: 1.5rem;">
          <h3 style="font-weight: 600; margin-bottom: 1rem;">Gerenciamento de Dados</h3>
          
          <div style="display: grid; gap: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h4 style="font-weight: 500; margin-bottom: 0.25rem;">Exportar Dados</h4>
                <p style="color: #666666; font-size: 0.875rem;">Baixar uma cópia dos seus dados</p>
              </div>
              <button class="btn btn-outline">Exportar</button>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h4 style="font-weight: 500; margin-bottom: 0.25rem;">Limpar Cache</h4>
                <p style="color: #666666; font-size: 0.875rem;">Limpar dados temporários armazenados</p>
              </div>
              <button class="btn btn-outline">Limpar</button>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
              <div>
                <h4 style="font-weight: 500; margin-bottom: 0.25rem; color: #dc2626;">Excluir Conta</h4>
                <p style="color: #666666; font-size: 0.875rem;">Excluir permanentemente sua conta e todos os dados</p>
              </div>
              <button class="btn btn-outline" style="color: #dc2626; border-color: #dc2626;" onclick="confirmDeleteAccount()">Excluir</button>
            </div>
          </div>
        </div>
  
        <!-- Save Button -->
        <div style="display: flex; justify-content: flex-end;">
          <button id="saveSettings" class="btn btn-primary">Salvar Configurações</button>
        </div>
      </div>
    `;

  setupSettingsFunctionality();
}

function setupSettingsFunctionality() {
  const saveSettings = document.getElementById("saveSettings");
  if (saveSettings) {
    saveSettings.addEventListener("click", () => {
      // Save settings to localStorage
      const settings = {
        theme: document.getElementById("themeSelect").value,
        fontSize: document.getElementById("fontSizeSelect").value,
        emailNotifications:
          document.getElementById("emailNotifications").checked,
        pushNotifications: document.getElementById("pushNotifications").checked,
        soundNotifications:
          document.getElementById("soundNotifications").checked,
        publicProfile: document.getElementById("publicProfile").checked,
        onlineStatus: document.getElementById("onlineStatus").checked,
        language: document.getElementById("languageSelect").value,
        timezone: document.getElementById("timezoneSelect").value,
      };

      localStorage.setItem("kontrollarSettings", JSON.stringify(settings));
      alert("Configurações salvas com sucesso!");
    });
  }

  // Load existing settings
  loadSettings();
}

function loadSettings() {
  const settings = JSON.parse(
    localStorage.getItem("kontrollarSettings") || "{}"
  );

  if (settings.theme)
    document.getElementById("themeSelect").value = settings.theme;
  if (settings.fontSize)
    document.getElementById("fontSizeSelect").value = settings.fontSize;
  if (settings.emailNotifications !== undefined)
    document.getElementById("emailNotifications").checked =
      settings.emailNotifications;
  if (settings.pushNotifications !== undefined)
    document.getElementById("pushNotifications").checked =
      settings.pushNotifications;
  if (settings.soundNotifications !== undefined)
    document.getElementById("soundNotifications").checked =
      settings.soundNotifications;
  if (settings.publicProfile !== undefined)
    document.getElementById("publicProfile").checked = settings.publicProfile;
  if (settings.onlineStatus !== undefined)
    document.getElementById("onlineStatus").checked = settings.onlineStatus;
  if (settings.language)
    document.getElementById("languageSelect").value = settings.language;
  if (settings.timezone)
    document.getElementById("timezoneSelect").value = settings.timezone;
}

function confirmDeleteAccount() {
  if (
    confirm(
      "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos os seus dados serão perdidos permanentemente."
    )
  ) {
    if (confirm("Esta é sua última chance. Confirma a exclusão da conta?")) {
      localStorage.clear();
      alert("Conta excluída com sucesso.");
      window.location.href = "index.html";
    }
  }
}

function gerarCardsProjetos() {
  return gerarArrayProjetosCards(projetos);
}

function gerarCardsTarefas() {
  return gerarArrayCardsTarefas(tarefas);
}
