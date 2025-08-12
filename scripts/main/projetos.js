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

window.abrirMenuProjeto = (projectId) => {
  const card = document.querySelector(`[data-projetos-id="${projectId}"]`);
  if (!card) return;

  let menu = card.querySelector(".projetos-menu-dropdown");

  // Fecha outros menus abertos com limpeza de listeners
  document.querySelectorAll(".projetos-menu-dropdown").forEach((el) => {
    if (el !== menu) {
      if (typeof el._close === "function") el._close();
      else el.remove();
    }
  });

  // Se já está aberto, fecha e sai
  if (menu) {
    if (typeof menu._close === "function") menu._close();
    else menu.remove();
    return;
  }

  // Container do menu (o card tem .projetos-menu envolvendo o botão)
  const menuContainer = card.querySelector(".projetos-menu") || card;
  const cs = getComputedStyle(menuContainer);
  if (cs.position === "static") menuContainer.style.position = "relative";

  // Cria menu
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

  // Helpers de fechar
  const onClickOutside = (ev) => {
    if (!menu.contains(ev.target)) closeMenu();
  };
  const onEsc = (ev) => {
    if (ev.key === "Escape") closeMenu();
  };
  function closeMenu() {
    if (!menu) return;
    // remove listeners globais
    document.removeEventListener("click", onClickOutside);
    document.removeEventListener("keydown", onEsc);
    if (menu.parentNode) menu.parentNode.removeChild(menu);
    menu = null;
  }
  // expõe para terceiros/fechamento programático
  menu._close = closeMenu;

  // Evita que cliques dentro do menu disparem o "fora"
  menu.addEventListener("click", (e) => e.stopPropagation());

  // Botão Apagar
  const apagarBtn = document.createElement("div");
  apagarBtn.innerHTML = `
    <span style="display:flex;align-items:center;gap:0.4rem;font-size:0.875rem;">
      🗑 <span>Apagar</span>
    </span>`;
  apagarBtn.style.padding = "0.5rem";
  apagarBtn.style.cursor = "pointer";
  apagarBtn.style.color = "#b91c1c";

  apagarBtn.addEventListener("click", async () => {
    closeMenu(); // fecha antes do modal
    const confirmar = await confirmarModal({
      title: "Excluir projeto?",
      message: "Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.",
    });
    if (confirmar) {
      if (typeof deletarProjeto === "function") deletarProjeto(projectId);
      else console.warn("deletarProjeto(projectId) não encontrado.");
    }
  });

  menu.appendChild(apagarBtn);
  menuContainer.appendChild(menu);

  // listeners globais (adicionados após o clique atual)
  setTimeout(() => {
    document.addEventListener("click", onClickOutside);
    document.addEventListener("keydown", onEsc);
  }, 0);
};

function gerarCardsProjetos() {
  return gerarArrayProjetosCards(projetos);
}