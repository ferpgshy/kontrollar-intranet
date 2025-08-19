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
  
      <div id="equipesStats" class="stat-card" style="margin-bottom:1rem;">
        <div class="stat-header" style="display:flex;justify-content:space-between;align-items:center;">
          <div class="stat-info">
            <h3>Membros da Equipe</h3>
            <div class="stat-value">–</div>
            <div class="stat-change">–</div>
          </div>
          <div class="stat-icon purple">
            <!-- seu ícone -->
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(350px,1fr));gap:1.5rem;">
        ${generateTeamCards()}
      </div>
    `;

  setupTeamsFunctionality();
  renderEquipesStats();
}

if (typeof window.sanitizeHTML !== "function") {
  window.sanitizeHTML = function (str) {
    const div = document.createElement("div");
    div.textContent = String(str ?? "");
    return div.innerHTML;
  };
}

if (typeof window.getKnownUsersForEvents !== "function") {
  window.getKnownUsersForEvents = function () {
    try {
      const me = (JSON.parse(localStorage.getItem("user") || "{}") || {}).name;
      const localUsers = JSON.parse(localStorage.getItem("users") || "[]")
        .map((u) => (typeof u === "string" ? u : u?.name))
        .filter(Boolean);
      const chatUsers = Array.isArray(window.chatGrupos)
        ? window.chatGrupos.flatMap((g) => [
            ...(g.members || []),
            ...(g.admins || []),
          ])
        : [];
      const teamUsers = Array.isArray(window.equipes)
        ? window.equipes.flatMap((e) => e.members || [])
        : [];
      const all = [me, ...localUsers, ...chatUsers, ...teamUsers].filter(
        Boolean
      );
      return Array.from(new Set(all)).sort((a, b) => a.localeCompare(b));
    } catch {
      return [];
    }
  };
}

if (typeof window.getKnownProjects !== "function") {
  window.getKnownProjects = function () {
    try {
      const globProjetos = Array.isArray(window.projetos)
        ? window.projetos
        : typeof projetos !== "undefined" && Array.isArray(projetos)
        ? projetos
        : [];

      const fromProjetos = globProjetos.map((p) => p?.name).filter(Boolean);
      const fromTeams = Array.isArray(window.equipes)
        ? window.equipes.flatMap((e) =>
            Array.isArray(e.projetos) ? e.projetos : []
          )
        : [];
      const fromTasks = Array.isArray(window.tarefas)
        ? window.tarefas.map((t) => t?.projetos).filter(Boolean)
        : [];
      const fromLocal = JSON.parse(localStorage.getItem("projects") || "[]");

      const all = [
        ...fromProjetos,
        ...fromTeams,
        ...fromTasks,
        ...(Array.isArray(fromLocal) ? fromLocal : []),
      ]
        .map((s) => String(s).trim())
        .filter(Boolean);

      return Array.from(new Set(all)).sort((a, b) => a.localeCompare(b));
    } catch {
      return [];
    }
  };
}

function renderEquipesStats() {
  const totalEquipes = Array.isArray(equipes) ? equipes.length : 0;
  const totalMembros = Array.isArray(equipes)
    ? equipes.reduce(
        (acc, e) => acc + ((e.members && e.members.length) || 0),
        0
      )
    : 0;

  const wrap = document.getElementById("equipesStats");
  if (!wrap) return;
  const valueEl = wrap.querySelector(".stat-value");
  const changeEl = wrap.querySelector(".stat-change");

  if (valueEl) valueEl.textContent = `${totalMembros}`;
  if (changeEl) changeEl.textContent = `${totalEquipes} equipe(s)`;
}

function setupTeamsFunctionality() {
  const newTeamBtn = document.getElementById("newTeamBtn");
  if (newTeamBtn) {
    newTeamBtn.addEventListener("click", showNewTeamModal);
  }
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
            <h3 style="font-size: 1.25rem; font-weight: 600; color: #000000; margin-bottom: 0.5rem;">${sanitizeHTML(
              equipe.name
            )}</h3>
            <p style="color: #666666; font-size: 0.875rem; margin-bottom: 0.75rem;">${sanitizeHTML(
              equipe.description
            )}</p>
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
            <span style="color: #3b82f6; font-weight: 500;">${sanitizeHTML(
              equipe.leader
            )}</span>
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
            ${(equipe.members || [])
              .map(
                (member) => `
              <span style="background-color: #f3f4f6; color: #374151; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">
                ${sanitizeHTML(member)}
              </span>
            `
              )
              .join("")}
          </div>
        </div>
  
        <div style="margin-bottom: 1rem;">
          <h4 style="font-weight: 500; margin-bottom: 0.5rem; font-size: 0.875rem;">Projetos:</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
            ${(equipe.projetos || [])
              .map(
                (p) => `
              <span style="background-color: #dbeafe; color: #1e40af; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">
                ${sanitizeHTML(p)}
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
  document.querySelectorAll(".edit-equipe-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const teamId = Number.parseInt(
        e.target.closest("[data-equipe-id]").getAttribute("data-equipe-id")
      );
      editTeam(teamId);
    });
  });

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
  const knownUsers = getKnownUsersForEvents();
  const knownProjects = getKnownProjects();

  const selectedMembers = new Map(); 
  let selectedLeader = "";
  const selectedProjects = new Set();

  createModal(
    "Criar Nova Equipe",
    `
      <form id="newTeamForm">
        <div style="margin-bottom:1rem;">
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Nome da Equipe</label>
          <input type="text" id="teamName" required
                 style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
        </div>

        <div style="margin-bottom:1rem;">
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Descrição</label>
          <textarea id="teamDescription" required
            style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;min-height:80px;resize:vertical;"></textarea>
        </div>

        <div style="margin:0.5rem 0;font-weight:600;">Membros e Líder</div>
        <div style="display:flex;gap:0.5rem;margin-bottom:0.75rem;">
          <input type="text" id="teamUserSearch" placeholder="Buscar usuários..."
                 style="flex:1;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
          <input type="text" id="teamManualUser" placeholder="Adicionar manualmente"
                 style="padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
          <button type="button" id="teamAddManualBtn" class="btn btn-outline">Adicionar</button>
        </div>
        <div id="teamUserList"
             style="max-height:240px;overflow:auto;border:1px solid #e5e7eb;border-radius:0.375rem;padding:0.5rem;"></div>

        <div style="margin:1rem 0 0.5rem;font-weight:600;">Projetos</div>
        <div style="display:flex;gap:0.5rem;margin-bottom:0.75rem;">
          <input type="text" id="teamProjectSearch" placeholder="Buscar projetos..."
                 style="flex:1;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
          <input type="text" id="teamManualProject" placeholder="Adicionar projeto manualmente"
                 style="padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
          <button type="button" id="teamAddManualProjectBtn" class="btn btn-outline">Adicionar</button>
        </div>
        <div id="teamProjectList"
             style="max-height:200px;overflow:auto;border:1px solid #e5e7eb;border-radius:0.375rem;padding:0.5rem;"></div>

        <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1rem;">
          <button type="button" onclick="fecharModal()" class="btn btn-outline">Cancelar</button>
          <button type="submit" class="btn btn-primary">Criar Equipe</button>
        </div>
      </form>
    `
  );

  function upsertUserRow(name) {
    const list = document.getElementById("teamUserList");
    if (!list || list.querySelector(`[data-row-user="${CSS.escape(name)}"]`))
      return;

    const row = document.createElement("div");
    row.setAttribute("data-row-user", name);
    row.style.display = "grid";
    row.style.gridTemplateColumns = "1fr auto auto";
    row.style.alignItems = "center";
    row.style.gap = "0.5rem";
    row.style.padding = "0.4rem 0.25rem";
    row.style.borderBottom = "1px dashed #eee";
    row.innerHTML = `
      <div style="min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${sanitizeHTML(
        name
      )}">
        ${sanitizeHTML(name)}
      </div>
      <label style="display:flex;align-items:center;gap:0.35rem;justify-self:end;">
        <input type="checkbox" class="tmIncChk" data-user="${sanitizeHTML(
          name
        )}">
        <span>Membro</span>
      </label>
      <label style="display:flex;align-items:center;gap:0.35rem;justify-self:end;">
        <input type="radio" name="tmLeader" class="tmLeaderRadio" data-user="${sanitizeHTML(
          name
        )}">
        <span>Líder</span>
      </label>
    `;
    list.appendChild(row);

    const chk = row.querySelector(".tmIncChk");
    const radio = row.querySelector(".tmLeaderRadio");

    chk.checked = !!selectedMembers.get(name);
    radio.checked = selectedLeader === name;

    chk.addEventListener("change", () => {
      selectedMembers.set(name, chk.checked);
      if (!chk.checked && selectedLeader === name) {
        selectedLeader = "";
        radio.checked = false;
      }
    });

    radio.addEventListener("change", () => {
      if (radio.checked) {
        selectedLeader = name;
        selectedMembers.set(name, true);
        chk.checked = true;
        document
          .querySelectorAll("#teamUserList .tmLeaderRadio")
          .forEach((r) => {
            if (r !== radio) r.checked = false;
          });
      }
    });
  }

  for (const u of knownUsers) {
    selectedMembers.set(u, false);
    upsertUserRow(u);
  }

  document.getElementById("teamUserSearch").addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll("#teamUserList [data-row-user]").forEach((r) => {
      const name = r.getAttribute("data-row-user") || "";
      r.style.display = name.toLowerCase().includes(q) ? "grid" : "none";
    });
  });

  document.getElementById("teamAddManualBtn").addEventListener("click", () => {
    const input = document.getElementById("teamManualUser");
    const name = (input.value || "").trim();
    if (!name) return;
    if (!selectedMembers.has(name)) {
      selectedMembers.set(name, true);
      upsertUserRow(name);
      const row = document.querySelector(
        `#teamUserList [data-row-user="${CSS.escape(name)}"]`
      );
      row?.querySelector(".tmIncChk")?.setAttribute("checked", "checked");
      row?.querySelector(".tmIncChk")?.dispatchEvent(new Event("change"));
    }
    input.value = "";
    input.focus();
  });

  function upsertProjectRow(p) {
    const list = document.getElementById("teamProjectList");
    if (!list || list.querySelector(`[data-row-project="${CSS.escape(p)}"]`))
      return;

    const row = document.createElement("div");
    row.setAttribute("data-row-project", p);
    row.style.display = "grid";
    row.style.gridTemplateColumns = "1fr auto";
    row.style.alignItems = "center";
    row.style.gap = "0.5rem";
    row.style.padding = "0.4rem 0.25rem";
    row.style.borderBottom = "1px dashed #eee";
    row.innerHTML = `
      <div style="min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${sanitizeHTML(
        p
      )}">
        ${sanitizeHTML(p)}
      </div>
      <label style="display:flex;align-items:center;gap:0.35rem;justify-self:end;">
        <input type="checkbox" class="tpChk" data-project="${sanitizeHTML(p)}">
        <span>Selecionar</span>
      </label>
    `;
    list.appendChild(row);

    const chk = row.querySelector(".tpChk");
    chk.checked = selectedProjects.has(p);
    chk.addEventListener("change", () => {
      if (chk.checked) selectedProjects.add(p);
      else selectedProjects.delete(p);
    });
  }

  for (const p of getKnownProjects()) upsertProjectRow(p);

  document
    .getElementById("teamProjectSearch")
    .addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      document
        .querySelectorAll("#teamProjectList [data-row-project]")
        .forEach((r) => {
          const name = r.getAttribute("data-row-project") || "";
          r.style.display = name.toLowerCase().includes(q) ? "grid" : "none";
        });
    });

  document
    .getElementById("teamAddManualProjectBtn")
    .addEventListener("click", () => {
      const input = document.getElementById("teamManualProject");
      const name = (input.value || "").trim();
      if (!name) return;
      if (!selectedProjects.has(name)) selectedProjects.add(name);
      upsertProjectRow(name);
      const row = document.querySelector(
        `#teamProjectList [data-row-project="${CSS.escape(name)}"]`
      );
      row?.querySelector(".tpChk")?.setAttribute("checked", "checked");
      row?.querySelector(".tpChk")?.dispatchEvent(new Event("change"));
      input.value = "";
      input.focus();
    });

  document.getElementById("newTeamForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("teamName").value.trim();
    const description = document.getElementById("teamDescription").value.trim();

    const members = Array.from(selectedMembers.entries())
      .filter(([, inc]) => inc)
      .map(([n]) => n);

    let leader = selectedLeader;
    if (!leader && members.length) leader = members[0];

    const newTeam = {
      id: Date.now(),
      name,
      description,
      leader: leader || "",
      members: leader ? Array.from(new Set([leader, ...members])) : members,
      projetos: Array.from(selectedProjects),
      createdAt: getDataBrasiliaFormatada(),
    };

    equipes.push(newTeam);
    try {
      localStorage.setItem("equipes", JSON.stringify(equipes));
    } catch {}
    if (
      typeof updateTeamsStatCard === "function" &&
      document.getElementById("teamsStatCard")
    ) {
      updateTeamsStatCard();
    }

    fecharModal();
    loadEquipesContent();
  });
}

function editTeam(teamId) {
  const equipe = equipes.find((t) => t.id === teamId);
  if (!equipe) return;

  const knownUsers = getKnownUsersForEvents();
  const knownProjects = getKnownProjects();

  const selectedMembers = new Map();
  let selectedLeader = equipe.leader || "";
  const selectedProjects = new Set(equipe.projetos || []);

  (equipe.members || []).forEach((m) => selectedMembers.set(m, true));
  knownUsers.forEach((u) => {
    if (!selectedMembers.has(u)) selectedMembers.set(u, false);
  });

  createModal(
    "Editar Equipe",
    `
      <form id="editTeamForm">
        <div style="margin-bottom:1rem;">
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Nome da Equipe</label>
          <input type="text" id="editTeamName" required
                 style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
        </div>

        <div style="margin-bottom:1rem;">
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Descrição</label>
          <textarea id="editTeamDescription" required
            style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;min-height:80px;resize:vertical;"></textarea>
        </div>

        <div style="margin:0.5rem 0;font-weight:600;">Membros e Líder</div>
        <div style="display:flex;gap:0.5rem;margin-bottom:0.75rem;">
          <input type="text" id="editTeamUserSearch" placeholder="Buscar usuários..."
                 style="flex:1;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
          <input type="text" id="editTeamManualUser" placeholder="Adicionar manualmente"
                 style="padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
          <button type="button" id="editTeamAddManualBtn" class="btn btn-outline">Adicionar</button>
        </div>
        <div id="editTeamUserList"
             style="max-height:240px;overflow:auto;border:1px solid #e5e7eb;border-radius:0.375rem;padding:0.5rem;"></div>

        <div style="margin:1rem 0 0.5rem;font-weight:600;">Projetos</div>
        <div style="display:flex;gap:0.5rem;margin-bottom:0.75rem;">
          <input type="text" id="editTeamProjectSearch" placeholder="Buscar projetos..."
                 style="flex:1;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
          <input type="text" id="editTeamManualProject" placeholder="Adicionar projeto manualmente"
                 style="padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
          <button type="button" id="editTeamAddManualProjectBtn" class="btn btn-outline">Adicionar</button>
        </div>
        <div id="editTeamProjectList"
             style="max-height:200px;overflow:auto;border:1px solid #e5e7eb;border-radius:0.375rem;padding:0.5rem;"></div>

        <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1rem;">
          <button type="button" onclick="fecharModal()" class="btn btn-outline">Cancelar</button>
          <button type="submit" class="btn btn-primary">Salvar Alterações</button>
        </div>
      </form>
    `
  );

  document.getElementById("editTeamName").value = equipe.name || "";
  document.getElementById("editTeamDescription").value =
    equipe.description || "";

  function upsertUserRow(name, listId) {
    const list = document.getElementById(listId);
    if (!list || list.querySelector(`[data-row-user="${CSS.escape(name)}"]`))
      return;

    const row = document.createElement("div");
    row.setAttribute("data-row-user", name);
    row.style.display = "grid";
    row.style.gridTemplateColumns = "1fr auto auto";
    row.style.alignItems = "center";
    row.style.gap = "0.5rem";
    row.style.padding = "0.4rem 0.25rem";
    row.style.borderBottom = "1px dashed #eee";
    row.innerHTML = `
      <div style="min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${sanitizeHTML(
        name
      )}">
        ${sanitizeHTML(name)}
      </div>
      <label style="display:flex;align-items:center;gap:0.35rem;justify-self:end;">
        <input type="checkbox" class="tmIncChk" data-user="${sanitizeHTML(
          name
        )}">
        <span>Membro</span>
      </label>
      <label style="display:flex;align-items:center;gap:0.35rem;justify-self:end;">
        <input type="radio" name="tmLeaderEdit" class="tmLeaderRadio" data-user="${sanitizeHTML(
          name
        )}">
        <span>Líder</span>
      </label>
    `;
    list.appendChild(row);

    const chk = row.querySelector(".tmIncChk");
    const radio = row.querySelector(".tmLeaderRadio");

    chk.checked = !!selectedMembers.get(name);
    radio.checked = selectedLeader === name;

    chk.addEventListener("change", () => {
      selectedMembers.set(name, chk.checked);
      if (!chk.checked && selectedLeader === name) {
        selectedLeader = "";
        radio.checked = false;
      }
    });

    radio.addEventListener("change", () => {
      if (radio.checked) {
        selectedLeader = name;
        selectedMembers.set(name, true);
        chk.checked = true;
        document
          .querySelectorAll("#editTeamUserList .tmLeaderRadio")
          .forEach((r) => {
            if (r !== radio) r.checked = false;
          });
      }
    });
  }

  for (const u of selectedMembers.keys()) upsertUserRow(u, "editTeamUserList");
  for (const u of knownUsers)
    if (!selectedMembers.has(u)) {
      selectedMembers.set(u, false);
      upsertUserRow(u, "editTeamUserList");
    }

  document
    .getElementById("editTeamUserSearch")
    .addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      document
        .querySelectorAll("#editTeamUserList [data-row-user]")
        .forEach((r) => {
          const name = r.getAttribute("data-row-user") || "";
          r.style.display = name.toLowerCase().includes(q) ? "grid" : "none";
        });
    });

  document
    .getElementById("editTeamAddManualBtn")
    .addEventListener("click", () => {
      const input = document.getElementById("editTeamManualUser");
      const name = (input.value || "").trim();
      if (!name) return;
      if (!selectedMembers.has(name)) {
        selectedMembers.set(name, true);
        upsertUserRow(name, "editTeamUserList");
        const row = document.querySelector(
          `#editTeamUserList [data-row-user="${CSS.escape(name)}"]`
        );
        row?.querySelector(".tmIncChk")?.setAttribute("checked", "checked");
        row?.querySelector(".tmIncChk")?.dispatchEvent(new Event("change"));
      }
      input.value = "";
      input.focus();
    });

  function upsertProjectRow(p, listId) {
    const list = document.getElementById(listId);
    if (!list || list.querySelector(`[data-row-project="${CSS.escape(p)}"]`))
      return;

    const row = document.createElement("div");
    row.setAttribute("data-row-project", p);
    row.style.display = "grid";
    row.style.gridTemplateColumns = "1fr auto";
    row.style.alignItems = "center";
    row.style.gap = "0.5rem";
    row.style.padding = "0.4rem 0.25rem";
    row.style.borderBottom = "1px dashed #eee";
    row.innerHTML = `
      <div style="min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${sanitizeHTML(
        p
      )}">
        ${sanitizeHTML(p)}
      </div>
      <label style="display:flex;align-items:center;gap:0.35rem;justify-self:end;">
        <input type="checkbox" class="tpChk" data-project="${sanitizeHTML(p)}">
        <span>Selecionar</span>
      </label>
    `;
    list.appendChild(row);

    const chk = row.querySelector(".tpChk");
    chk.checked = selectedProjects.has(p);
    chk.addEventListener("change", () => {
      if (chk.checked) selectedProjects.add(p);
      else selectedProjects.delete(p);
    });
  }

  const projListId = "editTeamProjectList";
  getKnownProjects().forEach((p) => upsertProjectRow(p, projListId));
  (equipe.projetos || []).forEach((p) => upsertProjectRow(p, projListId));

  document
    .getElementById("editTeamProjectSearch")
    .addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      document
        .querySelectorAll(`#${projListId} [data-row-project]`)
        .forEach((r) => {
          const name = r.getAttribute("data-row-project") || "";
          r.style.display = name.toLowerCase().includes(q) ? "grid" : "none";
        });
    });

  document
    .getElementById("editTeamAddManualProjectBtn")
    .addEventListener("click", () => {
      const input = document.getElementById("editTeamManualProject");
      const name = (input.value || "").trim();
      if (!name) return;
      if (!selectedProjects.has(name)) selectedProjects.add(name);
      upsertProjectRow(name, projListId);
      const row = document.querySelector(
        `#${projListId} [data-row-project="${CSS.escape(name)}"]`
      );
      row?.querySelector(".tpChk")?.setAttribute("checked", "checked");
      row?.querySelector(".tpChk")?.dispatchEvent(new Event("change"));
      input.value = "";
      input.focus();
    });

  document.getElementById("editTeamForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("editTeamName").value.trim();
    const description = document
      .getElementById("editTeamDescription")
      .value.trim();

    const members = Array.from(selectedMembers.entries())
      .filter(([, inc]) => inc)
      .map(([n]) => n);

    let leader = selectedLeader;
    if (!leader && members.length) leader = members[0];

    equipe.name = name;
    equipe.description = description;
    equipe.leader = leader || "";
    equipe.members = leader
      ? Array.from(new Set([leader, ...members]))
      : members;
    equipe.projetos = Array.from(selectedProjects);

    try {
      localStorage.setItem("equipes", JSON.stringify(equipes));
    } catch {}
    if (
      typeof updateTeamsStatCard === "function" &&
      document.getElementById("teamsStatCard")
    ) {
      updateTeamsStatCard();
    }

    fecharModal();
    loadEquipesContent();
  });
}

function viewTeamDetails(teamId) {
  const equipe = equipes.find((t) => t.id === teamId);
  if (!equipe) return;

  const criadaEm =
    typeof equipe.createdAt === "string"
      ? formatarDataPtBR(equipe.createdAt)
      : new Date(equipe.createdAt).toLocaleDateString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        });

  createModal(
    `Detalhes da Equipe: ${sanitizeHTML(equipe.name)}`,
    `
      <div style="max-height: 400px; overflow-y: auto;">
        <div style="margin-bottom: 1.5rem;">
          <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Informações Gerais</h3>
          <p style="margin-bottom: 0.5rem;"><strong>Descrição:</strong> ${sanitizeHTML(
            equipe.description
          )}</p>
          <p style="margin-bottom: 0.5rem;"><strong>Líder:</strong> ${sanitizeHTML(
            equipe.leader
          )}</p>
          <p style="margin-bottom: 0.5rem;"><strong>Total de Membros:</strong> ${
            equipe.members.length
          }</p>
          <p style="margin-bottom: 0.5rem;"><strong>Projetos Ativos:</strong> ${
            equipe.projetos.length
          }</p>
          <p style="margin-bottom: 0.5rem;"><strong>Criada em:</strong> ${criadaEm}</p>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
          <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Membros da Equipe</h3>
          <div style="display: grid; gap: 0.5rem;">
            ${equipe.members
              .map(
                (member) => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background-color: #f9fafb; border-radius: 0.375rem;">
                <span>${sanitizeHTML(member)}</span>
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
                    (p) => `
              <div style="padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.375rem; margin-bottom: 0.5rem;">
                <h4 style="font-weight: 500;">${sanitizeHTML(p)}</h4>
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

function deleteTeam(teamId) {
  const id = Number(teamId);
  if (!Array.isArray(equipes)) {
    console.warn("Array 'equipes' não está definido.");
    return;
  }

  const idx = equipes.findIndex((e) => Number(e?.id) === id);
  if (idx === -1) {
    console.warn("Equipe não encontrada:", id);
    if (typeof showToast === "function") showToast("Equipe não encontrada.");
    return;
  }

  const [removida] = equipes.splice(idx, 1);
  if (typeof loadEquipesContent === "function") {
    loadEquipesContent();
  }

  if (
    typeof updateTeamsStatCard === "function" &&
    document.getElementById("teamsStatCard")
  ) {
    updateTeamsStatCard();
  }

  if (typeof showToast === "function") {
    showToast(`Equipe "${removida?.name || id}" excluída com sucesso!`);
  }
}

if (
  typeof window.deletarEquipe === "function" &&
  typeof window.deleteTeam !== "function"
) {
  window.deleteTeam = window.deletarEquipe;
}

window.toggleTeamMenu = (teamId) => {
  const card =
    document.querySelector(`[data-team-id="${teamId}"]`) ||
    document.querySelector(`[data-equipe-id="${teamId}"]`);
  if (!card) return;

  let menu = card.querySelector(".team-menu-dropdown");

  document.querySelectorAll(".team-menu-dropdown").forEach((el) => {
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

  const menuContainer =
    card.querySelector(".team-menu") ||
    card.querySelector(".task-menu") ||
    card;

  const cs = getComputedStyle(menuContainer);
  if (cs.position === "static") menuContainer.style.position = "relative";

  menu = document.createElement("div");
  menu.className = "team-menu-dropdown";
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
    if (menu.parentNode) menu.parentNode.removeChild(menu);
    document.removeEventListener("click", onClickOutside);
    document.removeEventListener("keydown", onEsc);
    menu = null;
  }
  menu._close = closeMenu;
  menu.addEventListener("click", (e) => e.stopPropagation());

  const apagarBtn = document.createElement("div");
  apagarBtn.innerHTML = `
    <span style="display:flex;align-items:center;gap:0.4rem;font-size:0.875rem;">
      🗑 <span>Apagar equipe</span>
    </span>`;
  apagarBtn.style.padding = "0.5rem";
  apagarBtn.style.cursor = "pointer";
  apagarBtn.style.color = "#b91c1c";

  apagarBtn.addEventListener("click", async () => {
    closeMenu();
    const confirmar = await confirmarModal({
      title: "Excluir equipe?",
      message:
        "Tem certeza que deseja excluir esta equipe? Esta ação não pode ser desfeita.",
    });
    if (confirmar) {
      if (typeof deleteTeam === "function") deleteTeam(teamId);
      else console.warn("deleteTeam(teamId) não encontrado.");
    }
  });

  menu.appendChild(apagarBtn);
  menuContainer.appendChild(menu);
  setTimeout(() => {
    document.addEventListener("click", onClickOutside);
    document.addEventListener("keydown", onEsc);
  }, 0);
};
