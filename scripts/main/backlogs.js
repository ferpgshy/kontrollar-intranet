function persistTarefasENotificar() {
  try {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
  } catch (e) {}
  document.dispatchEvent(new CustomEvent("data:tarefas:changed"));
}

function getTeamOptions() {
  return (window.equipes || []).map((e) => ({
    id: Number(e.id),
    name: e.name || e.nome || `Equipe ${e.id}`,
  }));
}
function resolveTeamNameById(id) {
  const t = getTeamOptions().find((t) => t.id === Number(id));
  return t ? t.name : "";
}

function carregarConteudoBacklog() {
  const conteudoPagina = document.getElementById("conteudoPagina");

  const teamFilterOptions =
    `<option value="todas">Todas as Equipes</option>` +
    getTeamOptions()
      .map((t) => `<option value="${t.id}">${t.name}</option>`)
      .join("");

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
            <select id="taskTeamFilter" style="padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
              ${teamFilterOptions}
            </select>
        </div>
        
        <div id="tarefasContainer" style="display: flex; flex-direction: column; gap: 1rem;">
            ${gerarCardsTarefas()}
        </div>
    `;

  configPaginaBacklog();
}

function configPaginaBacklog() {
  const newTaskBtn = document.getElementById("newTaskBtn");
  if (newTaskBtn) newTaskBtn.addEventListener("click", showNewTaskModal);

  const taskSearch = document.getElementById("taskSearch");
  if (taskSearch) taskSearch.addEventListener("input", filterTasks);

  const taskStatusFilter = document.getElementById("taskStatusFilter");
  if (taskStatusFilter)
    taskStatusFilter.addEventListener("change", filterTasks);

  const taskPriorityFilter = document.getElementById("taskPriorityFilter");
  if (taskPriorityFilter)
    taskPriorityFilter.addEventListener("change", filterTasks);

  const taskTeamFilter = document.getElementById("taskTeamFilter");
  if (taskTeamFilter) taskTeamFilter.addEventListener("change", filterTasks);

  setupTaskStatusChanges();
}

function filterTasks() {
  const searchTerm = (
    document.getElementById("taskSearch")?.value || ""
  ).toLowerCase();
  const statusFilter =
    document.getElementById("taskStatusFilter")?.value || "todas";
  const priorityFilter =
    document.getElementById("taskPriorityFilter")?.value || "todas";
  const teamFilter =
    document.getElementById("taskTeamFilter")?.value || "todas";

  const filteredTasks = tarefas.filter((task) => {
    const teamName = resolveTeamNameById(task.teamId) || "";
    const matchesSearch =
      (task.title || "").toLowerCase().includes(searchTerm) ||
      (task.description || "").toLowerCase().includes(searchTerm) ||
      (task.projetos || "").toLowerCase().includes(searchTerm) ||
      teamName.toLowerCase().includes(searchTerm);

    const matchesStatus =
      statusFilter === "todas" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "todas" || task.priority === priorityFilter;
    const matchesTeam =
      teamFilter === "todas" || String(task.teamId) === String(teamFilter);

    return matchesSearch && matchesStatus && matchesPriority && matchesTeam;
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

  document.querySelectorAll(".edit-task-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const taskId = Number.parseInt(
        e.target.closest("[data-task-id]").getAttribute("data-task-id")
      );
      editTask(taskId);
    });
  });

  document.querySelectorAll(".delete-task-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const taskId = Number.parseInt(
        e.target.closest("[data-task-id]").getAttribute("data-task-id")
      );
      deleteTask(taskId);
      tarefas = tarefas.filter((t) => t.id !== taskId);
      try {
        localStorage.setItem("tarefas", JSON.stringify(tarefas));
      } catch (e) {}
      filterTasks();
    });
  });
}

function updateTaskStatus(taskId, newStatus) {
  const task = tarefas.find((t) => t.id === taskId);
  if (task) {
    task.status = newStatus;
    task.updatedAt = new Date().toISOString();
    persistTarefasENotificar();

    if (window.Notifs && newStatus === "concluida") {
      Notifs.push({
        type: "task",
        title: `Tarefa concluída: ${task.title}`,
        body: `Projeto: ${task.projetos} • Resp.: ${task.assignee}`,
        page: "backlog",
      });
    }

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
  const projectOptions = (window.projetos || [])
    .map((p) => `<option value="${p.name}">${p.name}</option>`)
    .join("");

  const teamOptions = getTeamOptions()
    .map((t) => `<option value="${t.id}">${t.name}</option>`)
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
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Equipe responsável</label>
        <select id="taskTeam" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
          <option value="">(Opcional) Selecione uma equipe</option>
          ${teamOptions}
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

    const teamIdVal = document.getElementById("taskTeam").value;

    const newTask = {
      id: Date.now(),
      title: document.getElementById("taskTitle").value,
      description: document.getElementById("taskDescription").value,
      priority: document.getElementById("taskPriority").value,
      status: document.getElementById("taskStatus").value,
      projetos: document.getElementById("taskProject").value,
      teamId: teamIdVal ? Number(teamIdVal) : null,
      assignee: document.getElementById("taskAssignee").value,
      deadline:
        document.getElementById("taskDeadline").value ||
        getDataBrasiliaFormatada(),
      createdAt: getDataBrasiliaFormatada(),
    };

    tarefas.push(newTask);
    try {
      localStorage.setItem("tarefas", JSON.stringify(tarefas));
      persistTarefasENotificar();
    } catch (e) {}

    if (window.Notifs) {
      const teamName = resolveTeamNameById(newTask.teamId) || "—";
      Notifs.push({
        type: "task",
        title: `Nova tarefa: ${newTask.title}`,
        body: `Resp.: ${newTask.assignee} • Projeto: ${newTask.projetos} • Equipe: ${teamName} • Prioridade: ${newTask.priority}`,
        page: "backlog",
      });
    }

    fecharModal();
    filterTasks();
  });
}

function editTask(taskId) {
  const task = tarefas.find((t) => t.id === taskId);
  if (!task) return;

  const projectOptions = (window.projetos || [])
    .map(
      (p) =>
        `<option value="${p.name}" ${
          p.name === task.projetos ? "selected" : ""
        }>${p.name}</option>`
    )
    .join("");

  const teamOptions = getTeamOptions()
    .map(
      (t) =>
        `<option value="${t.id}" ${
          Number(t.id) === Number(task.teamId) ? "selected" : ""
        }>${t.name}</option>`
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
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Equipe responsável</label>
        <select id="editTaskTeam" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
          <option value="">(Opcional) Selecione uma equipe</option>
          ${teamOptions}
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
    task.teamId =
      document.getElementById("editTaskTeam").value || ""
        ? Number(document.getElementById("editTaskTeam").value)
        : null;
    task.assignee = document.getElementById("editTaskAssignee").value;
    task.deadline =
      document.getElementById("editTaskDeadline").value ||
      getDataBrasiliaFormatada();

    try {
      localStorage.setItem("tarefas", JSON.stringify(tarefas));
      persistTarefasENotificar();
    } catch (e) {}

    fecharModal();
    filterTasks();
  });
}

function deleteTask(taskId) {
  tarefas = tarefas.filter((t) => t.id !== taskId);
  filterTasks();
  showToast("Tarefa excluída com sucesso!", "success");
}

window.abrirMenuTarefas = (taskId) => {
  const card = document.querySelector(`[data-task-id="${taskId}"]`);
  if (!card) return;

  let menu = card.querySelector(".tarefas-menu-dropdown");

  document.querySelectorAll(".tarefas-menu-dropdown").forEach((el) => {
    if (el !== menu) {
      if (typeof el._close === "function") el._close();
      else el.remove();
    }
  });

  if (menu) {
    if (typeof menu._close === "function") menu._close();
    else menu.remove();
    return;
  }

  const menuContainer = card.querySelector(".task-menu") || card;
  const cs = getComputedStyle(menuContainer);
  if (cs.position === "static") menuContainer.style.position = "relative";

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

  const onClickOutside = (ev) => {
    if (!menu) return;
    if (!menu.contains(ev.target)) closeMenu();
  };
  const onEsc = (ev) => {
    if (ev.key === "Escape") closeMenu();
  };
  function closeMenu() {
    if (!menu) return;
    document.removeEventListener("click", onClickOutside);
    document.removeEventListener("keydown", onEsc);
    if (menu.parentNode) menu.parentNode.removeChild(menu);
    menu = null;
  }
  menu._close = closeMenu;

  menu.addEventListener("click", (e) => e.stopPropagation());

  const apagarBtn = document.createElement("div");
  apagarBtn.innerHTML = `
    <span style="display:flex;align-items:center;gap:0.4rem;font-size:0.875rem;">
      🗑 <span>Apagar</span>
    </span>`;
  apagarBtn.style.padding = "0.5rem";
  apagarBtn.style.cursor = "pointer";
  apagarBtn.style.color = "#b91c1c";

  apagarBtn.addEventListener("click", async () => {
    closeMenu();
    const confirmar = await confirmarModal({
      title: "Excluir tarefa?",
      message:
        "Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.",
    });
    if (confirmar) {
      if (typeof deleteTask === "function") deleteTask(taskId);
      else console.warn("deleteTask(taskId) não encontrado.");
    }
  });

  menu.appendChild(apagarBtn);
  menuContainer.appendChild(menu);

  setTimeout(() => {
    document.addEventListener("click", onClickOutside);
    document.addEventListener("keydown", onEsc);
  }, 0);
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

function gerarCardsTarefas() {
  return gerarArrayCardsTarefas(tarefas);
}
