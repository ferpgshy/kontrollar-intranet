function getSafeUser() {
  let u = JSON.parse(localStorage.getItem("user") || "{}");
  if (!u || !u.name) {
    u = { name: "Usuário", email: "usuario@example.com", role: "user" };
  }
  if (!u.createdAt) {
    if (typeof getDataBrasiliaFormatada === "function") {
      u.createdAt = getDataBrasiliaFormatada();
    } else {
      u.createdAt = new Date().toISOString().split("T")[0];
    }
    localStorage.setItem("user", JSON.stringify(u));
  }
  if (!u.settings) u.settings = {};
  if (!u.settings.theme) u.settings.theme = "system";
  if (!u.settings.timezone) u.settings.timezone = "America/Sao_Paulo";
  if (typeof u.settings.notifyEmail !== "boolean")
    u.settings.notifyEmail = true;
  if (typeof u.settings.notifyDesktop !== "boolean")
    u.settings.notifyDesktop = false;
  return u;
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.removeAttribute("data-theme");
  if (theme === "light" || theme === "dark") {
    root.setAttribute("data-theme", theme);
  }
}

function splitName(fullName = "") {
  const parts = String(fullName).trim().split(/\s+/);
  return {
    first: parts[0] || "",
    last: parts.length > 1 ? parts.slice(1).join(" ") : "",
  };
}

function joinName(first, last) {
  return [first || "", last || ""].filter(Boolean).join(" ").trim();
}

function getInitials(name = "") {
  return (
    String(name)
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() || "")
      .join("") || "U"
  );
}

function maskPhone(v = "") {
  return v
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);
}

function pwdStrengthScore(p = "") {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(s, 5);
}

function computeUserStats(userOrName) {
  const user =
    typeof userOrName === "object" ? userOrName : { name: userOrName };
  const name = String(user.name || "")
    .trim()
    .toLowerCase();
  const email = String(user.email || "")
    .trim()
    .toLowerCase();

  const matches = (m) => {
    if (!m) return false;
    if (typeof m === "string") {
      const s = m.trim().toLowerCase();
      return s && (s === name || (email && s === email));
    }
    if (typeof m === "object") {
      const n = String(m.name || "")
        .trim()
        .toLowerCase();
      const e = String(m.email || "")
        .trim()
        .toLowerCase();
      return (n && n === name) || (email && e === email);
    }
    return false;
  };

  const eqs = Array.isArray(window.equipes) ? window.equipes : [];
  const projs = Array.isArray(window.projetos) ? window.projetos : [];
  const tasks = Array.isArray(window.tarefas) ? window.tarefas : [];

  const equipesDoUsuario = eqs.filter(
    (e) => Array.isArray(e.members) && e.members.some(matches)
  );

  const projetosDoUsuario = projs.filter(
    (p) =>
      (Array.isArray(p.members) && p.members.some(matches)) ||
      (Array.isArray(p.equipe) && p.equipe.some(matches)) ||
      matches(p.responsavel) ||
      matches(p.owner)
  );

  const tarefasUsuario = tasks.filter((t) =>
    matches(t.assignee || t.responsavel || t.atribuidoA)
  );
  const concluidas = tarefasUsuario.filter((t) =>
    String(t.status || "")
      .toLowerCase()
      .includes("concl")
  ).length;
  const pendentes = tarefasUsuario.length - concluidas;

  return {
    equipesCount: equipesDoUsuario.length,
    projetosCount: projetosDoUsuario.length,
    tarefasConcluidas: concluidas,
    tarefasPendentes: pendentes,
    equipesDoUsuario,
    projetosDoUsuario,
  };
}

function formatarDataPtBR(dataIso = "") {
  const [ano, mes, dia] = String(dataIso).split("-");
  if (!ano || !mes || !dia) return dataIso || "";
  return `${dia}/${mes}/${ano}`;
}

function loadPerfilContent() {
  const user = getSafeUser();
  const conteudoPagina = document.getElementById("conteudoPagina");
  const { first, last } = splitName(user.name);
  const stats = computeUserStats(user);

  applyTheme(user.settings?.theme || "system");

  const avatarStyle = user.avatarDataUrl
    ? `background-image:url('${user.avatarDataUrl}'); background-size:cover; background-position:center; color:transparent;`
    : "";

  conteudoPagina.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;">
      <div>
        <h1 style="font-size:2rem;font-weight:bold;color:#000;margin-bottom:0.5rem;">Perfil</h1>
        <p style="color:#666;">Gerencie suas informações pessoais</p>
      </div>
    </div>

    <div style="display:grid;grid-template-columns: 1fr 2fr; gap: 2rem; align-items:start;">
      <!-- Coluna Esquerda -->
      <div style="background:#fff;border-radius:0.5rem;border:1px solid #e5e7eb;padding:1.5rem;">
        <div style="text-align:center;margin-bottom:1rem;">
          <div id="avatarPreview"
               style="width:6rem;height:6rem;background:#111827;border-radius:9999px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:2rem;margin:0 auto 1rem;${avatarStyle}">
            ${user.avatarDataUrl ? "" : getInitials(user.name)}
          </div>
          <label class="btn btn-outline" style="cursor:pointer;display:inline-block;">
            Alterar foto
            <input id="avatarInput" type="file" accept="image/*" style="display:none">
          </label>
          ${
            user.avatarDataUrl
              ? `<button id="removeAvatarBtn" class="btn btn-outline" style="margin-left:0.5rem;">Remover</button>`
              : ""
          }
        </div>

        <h2 style="font-size:1.25rem;font-weight:600;color:#000;margin-bottom:0.25rem;text-align:center;">${
          user.name
        }</h2>
        <p style="color:#666;text-align:center;margin-bottom:0.25rem;">${
          user.email
        }</p>
        <p style="color:#666;text-align:center;font-size:0.875rem;margin-bottom:1rem;">${
          typeof cargosLabel === "function"
            ? cargosLabel(user.role)
            : user.role || "Usuário"
        }</p>

        <div style="display:grid;gap:0.5rem;">
          <div style="display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid #f3f4f6;">
            <span style="font-weight:500;">Status:</span>
            <span style="color:#10b981;">Ativo</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid #f3f4f6;">
            <span style="font-weight:500;">Membro desde:</span>
            <span>${formatarDataPtBR(user.createdAt)}</span>
          </div>
          ${
            user.lastLoginAt
              ? `
          <div style="display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid #f3f4f6;">
            <span style="font-weight:500;">Último acesso:</span>
            <span>${formatarDataPtBR(user.lastLoginAt)}</span>
          </div>`
              : ""
          }
        </div>

        <!-- Stats Pessoais -->
        <div style="margin-top:1.25rem;">
          <h3 style="font-weight:600;margin-bottom:0.5rem;">Seu resumo</h3>

          <!-- KPIs -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin-bottom:0.75rem;">
            <div style="border:1px solid #e5e7eb;border-radius:0.5rem;padding:0.75rem;">
              <div style="font-size:0.8rem;color:#6b7280;">Equipes</div>
              <div style="font-weight:700;font-size:1.2rem;">${
                stats.equipesCount
              }</div>
            </div>
            <div style="border:1px solid #e5e7eb;border-radius:0.5rem;padding:0.75rem;">
              <div style="font-size:0.8rem;color:#6b7280;">Projetos</div>
              <div style="font-weight:700;font-size:1.2rem;">${
                stats.projetosCount
              }</div>
            </div>
            <div style="border:1px solid #e5e7eb;border-radius:0.5rem;padding:0.75rem;">
              <div style="font-size:0.8rem;color:#6b7280;">Tarefas concl.</div>
              <div style="font-weight:700;font-size:1.2rem;">${
                stats.tarefasConcluidas
              }</div>
            </div>
            <div style="border:1px solid #e5e7eb;border-radius:0.5rem;padding:0.75rem;">
              <div style="font-size:0.8rem;color:#6b7280;">Tarefas pend.</div>
              <div style="font-weight:700;font-size:1.2rem;">${
                stats.tarefasPendentes
              }</div>
            </div>
          </div>

          <!-- Detalhes do perfil (puxa dos campos) -->
          <div style="border:1px solid #e5e7eb;border-radius:0.5rem;padding:0.75rem;">
            <div style="display:grid;row-gap:0.35rem;font-size:0.9rem;color:#374151;">
              <div><strong>Departamento:</strong> ${
                user.department || "—"
              }</div>
              <div><strong>Cargo:</strong> ${user.role || "—"}</div>
              <div><strong>Telefone:</strong> ${user.phone || "—"}</div>
              <div><strong>Fuso horário:</strong> ${
                (user.settings && user.settings.timezone) || "America/Sao_Paulo"
              }</div>
              <div><strong>Notificações:</strong>
                ${
                  (user.settings?.notifyEmail ? "E-mail" : "") +
                    (user.settings?.notifyDesktop
                      ? user.settings?.notifyEmail
                        ? " + Push"
                        : "Push"
                      : "") || "—"
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Coluna Direita -->
      <div style="display:grid;gap:1.5rem;">
        <!-- Informações Pessoais -->
        <div style="background:#fff;border-radius:0.5rem;border:1px solid #e5e7eb;padding:1.5rem;">
          <h3 style="font-weight:600;margin-bottom:1rem;">Informações Pessoais</h3>
          <form id="profileForm">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
              <div>
                <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Nome</label>
                <input type="text" id="profileName" value="${first}" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
              </div>
              <div>
                <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Sobrenome</label>
                <input type="text" id="profileLastName" value="${last}" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
              <div>
                <label style="display:block;margin-bottom:0.5rem;font-weight:500;">E-mail</label>
                <input type="email" id="profileEmail" value="${
                  user.email
                }" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
              </div>
              <div>
                <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Telefone</label>
                <input type="tel" id="profilePhone" value="${
                  user.phone || ""
                }" placeholder="(11) 99999-9999" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
              <div>
                <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Departamento</label>
                <select id="profileDepartment" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
                  <option value="">Selecione</option>
                  ${[
                    "desenvolvimento",
                    "design",
                    "marketing",
                    "vendas",
                    "rh",
                    "financeiro",
                  ]
                    .map(
                      (dep) =>
                        `<option value="${dep}" ${
                          user.department === dep ? "selected" : ""
                        }>${dep[0].toUpperCase() + dep.slice(1)}</option>`
                    )
                    .join("")}
                </select>
              </div>
              <div>
                <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Cargo</label>
                <input type="text" id="profileRole" value="${
                  user.role || ""
                }" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
              </div>
            </div>

            <div style="margin-bottom:1rem;">
              <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Bio</label>
              <textarea id="profileBio" placeholder="Conte um pouco sobre você..." style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;min-height:80px;resize:vertical;">${
                user.bio || ""
              }</textarea>
            </div>

            <hr style="border:none;border-top:1px solid #e5e7eb;margin:1rem 0;">

            <!-- Segurança -->
            <h4 style="font-weight:600;margin-bottom:0.75rem;">Segurança</h4>
            <div style="display:grid;gap:1rem;margin-bottom:1rem;">
              <div>
                <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Senha Atual</label>
                <input type="password" id="currentPassword" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                <div>
                  <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Nova Senha</label>
                  <div style="display:flex;gap:0.5rem;">
                    <input type="password" id="newPassword" style="flex:1;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
                    <button type="button" id="togglePwd" class="btn btn-outline">Mostrar</button>
                  </div>
                  <div style="height:6px;background:#e5e7eb;border-radius:999px;margin-top:0.5rem;overflow:hidden;">
                    <div id="pwdBar" style="height:100%;width:0%;background:#ef4444;"></div>
                  </div>
                  <div id="pwdTip" style="font-size:0.8rem;color:#6b7280;margin-top:0.25rem;"></div>
                </div>
                <div>
                  <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Confirmar Nova Senha</label>
                  <input type="password" id="confirmNewPassword" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
                </div>
              </div>
            </div>

            <div style="display:flex;gap:1rem;justify-content:flex-end;">
              <button type="button" id="cancelProfileBtn" class="btn btn-outline">Cancelar</button>
              <button type="submit" class="btn btn-primary">Salvar Alterações</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  setupProfileFunctionality();
}

function setupProfileFunctionality() {
  const user = getSafeUser();

  const avatarInput = document.getElementById("avatarInput");
  const avatarPreview = document.getElementById("avatarPreview");
  const removeAvatarBtn = document.getElementById("removeAvatarBtn");
  if (avatarInput) {
    avatarInput.addEventListener("change", (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        user.avatarDataUrl = reader.result;
        localStorage.setItem("user", JSON.stringify(user));
        loadPerfilContent();
      };
      reader.readAsDataURL(f);
    });
  }
  if (removeAvatarBtn) {
    removeAvatarBtn.addEventListener("click", () => {
      delete user.avatarDataUrl;
      localStorage.setItem("user", JSON.stringify(user));
      loadPerfilContent();
    });
  }

  const phoneEl = document.getElementById("profilePhone");
  if (phoneEl) {
    phoneEl.addEventListener("input", () => {
      phoneEl.value = maskPhone(phoneEl.value);
    });
  }

  const newPwdEl = document.getElementById("newPassword");
  const bar = document.getElementById("pwdBar");
  const tip = document.getElementById("pwdTip");
  const togglePwd = document.getElementById("togglePwd");
  if (togglePwd && newPwdEl) {
    togglePwd.addEventListener("click", () => {
      const t =
        newPwdEl.getAttribute("type") === "password" ? "text" : "password";
      newPwdEl.setAttribute("type", t);
      togglePwd.textContent = t === "password" ? "Mostrar" : "Ocultar";
    });
  }
  if (newPwdEl && bar && tip) {
    const updateStrength = () => {
      const s = pwdStrengthScore(newPwdEl.value);
      const pct = (s / 5) * 100;
      bar.style.width = pct + "%";
      bar.style.background =
        s >= 4 ? "#10b981" : s >= 3 ? "#f59e0b" : "#ef4444";
      tip.textContent =
        s >= 4
          ? "Senha forte"
          : s >= 3
          ? "Senha média"
          : "Use 8+ caracteres, maiúsculas, números e símbolos";
    };
    newPwdEl.addEventListener("input", updateStrength);
    updateStrength();
  }


  document.getElementById("cancelProfileBtn")?.addEventListener("click", () => {
    loadPerfilContent();
  });

  const profileForm = document.getElementById("profileForm");
  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const first = document.getElementById("profileName").value.trim();
      const last = document.getElementById("profileLastName").value.trim();
      const name = joinName(first, last);

      const email = document.getElementById("profileEmail").value.trim();
      const phone = document.getElementById("profilePhone").value.trim();
      const department = document.getElementById("profileDepartment").value;
      const role = document.getElementById("profileRole").value.trim();
      const bio = document.getElementById("profileBio").value.trim();
      const newPassword = document.getElementById("newPassword").value;
      const confirmNewPassword =
        document.getElementById("confirmNewPassword").value;

      if (newPassword || confirmNewPassword) {
        if (newPassword !== confirmNewPassword) {
          alertModal({
            title: "Erro",
            message: "As senhas não coincidem",
          });
          return;
        }
        if (newPassword.length < 8) {
          alertModal({
            title: "Atenção",
            message: "A nova senha deve ter pelo menos 8 caracteres",
          });
          return;
        }
      }

      user.name = name || user.name;
      user.email = email || user.email;
      user.phone = phone;
      user.department = department || "";
      user.role = role || user.role;
      user.bio = bio;

      localStorage.setItem("user", JSON.stringify(user));
      applyTheme(user.settings?.theme || "system");

      alertModal({
        title: "Sucesso",
        message: "Perfil atualizado com sucesso!",
      });

      loadPerfilContent();
    });
  }
}
