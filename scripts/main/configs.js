// Helpers (usam os já existentes se houver)
const _getUser =
  typeof getSafeUser === "function"
    ? getSafeUser
    : () => {
        let u = JSON.parse(localStorage.getItem("user") || "{}");
        if (!u || !u.name)
          u = { name: "Usuário", email: "usuario@example.com", role: "user" };
        if (!u.settings) u.settings = {};
        if (!u.settings.theme) u.settings.theme = "system";
        if (!u.settings.fontSize) u.settings.fontSize = "medium";
        if (!u.settings.timezone) u.settings.timezone = "America/Sao_Paulo";
        if (typeof u.settings.notifyEmail !== "boolean")
          u.settings.notifyEmail = true;
        if (typeof u.settings.notifyDesktop !== "boolean")
          u.settings.notifyDesktop = false;
        if (typeof u.settings.sound !== "boolean") u.settings.sound = false;
        if (typeof u.settings.publicProfile !== "boolean")
          u.settings.publicProfile = true;
        if (typeof u.settings.onlineStatus !== "boolean")
          u.settings.onlineStatus = true;
        localStorage.setItem("user", JSON.stringify(u));
        return u;
      };

const _applyTheme =
  typeof applyTheme === "function"
    ? applyTheme
    : (theme) => {
        const root = document.documentElement;
        root.removeAttribute("data-theme");
        if (theme === "light" || theme === "dark")
          root.setAttribute("data-theme", theme);
      };

function applyFontSize(size) {
  // small 93.75% (15px), medium 100% (16px), large 112.5% (18px) — ajuste à vontade
  const map = { small: "93.75%", medium: "100%", large: "112.5%" };
  document.documentElement.style.fontSize = map[size] || "100%";
}

// Beep simples para testar som
function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 880;
    o.connect(g);
    g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    o.start();
    setTimeout(() => {
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);
      o.stop(ctx.currentTime + 0.04);
    }, 180);
  } catch {}
}

function loadConfiguracoesContent() {
  const conteudoPagina = document.getElementById("conteudoPagina");
  const user = _getUser();
  // aplica preferências atuais
  _applyTheme(user.settings.theme);
  applyFontSize(user.settings.fontSize);

  conteudoPagina.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;">
      <div>
        <h1 style="font-size:2rem;font-weight:bold;color:#000;margin-bottom:0.5rem;">Configurações</h1>
        <p style="color:#666;">Personalize sua experiência no Kontrollar</p>
      </div>
    </div>

    <div style="display:grid;gap:1.5rem;">
      <!-- Aparência -->
      <div style="background:#fff;border-radius:0.5rem;border:1px solid #e5e7eb;padding:1.5rem;">
        <h3 style="font-weight:600;margin-bottom:1rem;">Aparência</h3>
        <div style="display:grid;gap:1rem;">
          <div>
            <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Tema</label>
            <select id="themeSelect" style="width:100%;max-width:220px;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
              <option value="system" ${
                user.settings.theme === "system" ? "selected" : ""
              }>Seguir o sistema</option>
              <option value="light"  ${
                user.settings.theme === "light" ? "selected" : ""
              }>Claro</option>
              <option value="dark"   ${
                user.settings.theme === "dark" ? "selected" : ""
              }>Escuro</option>
            </select>
          </div>
          <div>
            <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Tamanho da Fonte</label>
            <select id="fontSizeSelect" style="width:100%;max-width:220px;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
              <option value="small"  ${
                user.settings.fontSize === "small" ? "selected" : ""
              }>Pequena</option>
              <option value="medium" ${
                user.settings.fontSize === "medium" ? "selected" : ""
              }>Média</option>
              <option value="large"  ${
                user.settings.fontSize === "large" ? "selected" : ""
              }>Grande</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Notificações -->
      <div style="background:#fff;border-radius:0.5rem;border:1px solid #e5e7eb;padding:1.5rem;">
        <h3 style="font-weight:600;margin-bottom:1rem;">Notificações</h3>
        <div style="display:grid;gap:1rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <h4 style="font-weight:500;margin-bottom:0.25rem;">Notificações por E-mail</h4>
              <p style="color:#666;font-size:0.875rem;">Receba notificações importantes por e-mail</p>
            </div>
            <input type="checkbox" id="emailNotifications" ${
              user.settings.notifyEmail ? "checked" : ""
            }>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <h4 style="font-weight:500;margin-bottom:0.25rem;">Notificações Push</h4>
              <p style="color:#666;font-size:0.875rem;">Receba notificações no navegador</p>
            </div>
            <input type="checkbox" id="pushNotifications" ${
              user.settings.notifyDesktop ? "checked" : ""
            }>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <h4 style="font-weight:500;margin-bottom:0.25rem;">Sons de Notificação</h4>
              <p style="color:#666;font-size:0.875rem;">Reproduzir som quando chegar algo novo</p>
            </div>
            <div style="display:flex;gap:0.5rem;align-items:center;">
              <button id="testSoundBtn" class="btn btn-outline">Testar som</button>
              <input type="checkbox" id="soundNotifications" ${
                user.settings.sound ? "checked" : ""
              }>
            </div>
          </div>
        </div>
      </div>

      <!-- Privacidade -->
      <div style="background:#fff;border-radius:0.5rem;border:1px solid #e5e7eb;padding:1.5rem;">
        <h3 style="font-weight:600;margin-bottom:1rem;">Privacidade</h3>
        <div style="display:grid;gap:1rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <h4 style="font-weight:500;margin-bottom:0.25rem;">Perfil Público</h4>
              <p style="color:#666;font-size:0.875rem;">Permitir que outros usuários vejam seu perfil</p>
            </div>
            <input type="checkbox" id="publicProfile" ${
              user.settings.publicProfile ? "checked" : ""
            }>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <h4 style="font-weight:500;margin-bottom:0.25rem;">Status Online</h4>
              <p style="color:#666;font-size:0.875rem;">Mostrar quando você está online</p>
            </div>
            <input type="checkbox" id="onlineStatus" ${
              user.settings.onlineStatus ? "checked" : ""
            }>
          </div>
        </div>
      </div>

      <!-- Sistema -->
      <div style="background:#fff;border-radius:0.5rem;border:1px solid #e5e7eb;padding:1.5rem;">
        <h3 style="font-weight:600;margin-bottom:1rem;">Sistema</h3>
        <div style="display:grid;gap:1rem;">
          <div>
            <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Idioma</label>
            <select id="languageSelect" style="width:100%;max-width:220px;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
              <option value="pt-BR" selected>Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
            </select>
          </div>

          <div>
            <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Fuso Horário</label>
            <div style="display:flex;gap:0.5rem;align-items:center;">
              <input type="text" id="timezoneSelect" value="${
                user.settings.timezone
              }" placeholder="Ex.: America/Sao_Paulo" style="width:100%;max-width:220px;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
              <button id="detectTZ" class="btn btn-outline">Detectar</button>
            </div>
            <p style="color:#6b7280;font-size:0.8rem;margin-top:0.25rem;">Use um ID IANA (ex.: America/Sao_Paulo). Isso ajuda nas datas.</p>
          </div>
        </div>
      </div>

      <!-- Dados -->
      <div style="background:#fff;border-radius:0.5rem;border:1px solid #e5e7eb;padding:1.5rem;">
        <h3 style="font-weight:600;margin-bottom:1rem;">Gerenciamento de Dados</h3>
        <div style="display:grid;gap:1rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <h4 style="font-weight:500;margin-bottom:0.25rem;">Exportar Dados</h4>
              <p style="color:#666;font-size:0.875rem;">Baixar uma cópia (JSON) de usuário, equipes, projetos, tarefas e avisos</p>
            </div>
            <button id="exportBtn" class="btn btn-outline">Exportar</button>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <h4 style="font-weight:500;margin-bottom:0.25rem;">Limpar Cache</h4>
              <p style="color:#666;font-size:0.875rem;">Zerar dados selecionados do armazenamento local</p>
              <div style="display:flex;gap:0.75rem;margin-top:0.5rem;flex-wrap:wrap;">
                <label><input type="checkbox" class="cc" value="equipes"> Equipes</label>
                <label><input type="checkbox" class="cc" value="projetos"> Projetos</label>
                <label><input type="checkbox" class="cc" value="tarefas"> Tarefas</label>
                <label><input type="checkbox" class="cc" value="avisos"> Avisos</label>
                <label><input type="checkbox" class="cc" value="settings"> Configurações</label>
              </div>
            </div>
            <button id="clearBtn" class="btn btn-outline">Limpar</button>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;padding-top:1rem;border-top:1px solid #e5e7eb;">
            <div>
              <h4 style="font-weight:500;margin-bottom:0.25rem;color:#dc2626;">Excluir Conta</h4>
              <p style="color:#666;font-size:0.875rem;">Remove todos os dados e sai do app</p>
            </div>
            <button class="btn btn-outline" style="color:#dc2626;border-color:#dc2626;" onclick="confirmDeleteAccount()">Excluir</button>
          </div>
        </div>
      </div>

      <div style="display:flex;justify-content:flex-end;">
        <button id="saveSettings" class="btn btn-primary">Salvar Configurações</button>
      </div>
    </div>
  `;

  setupSettingsFunctionality();
}

function setupSettingsFunctionality() {
  const user = _getUser();

  // Live-preview de tema e fonte
  document.getElementById("themeSelect")?.addEventListener("change", (e) => {
    _applyTheme(e.target.value);
  });
  document.getElementById("fontSizeSelect")?.addEventListener("change", (e) => {
    applyFontSize(e.target.value);
  });

  // Detectar fuso horário
  document.getElementById("detectTZ")?.addEventListener("click", () => {
    const tz =
      Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Sao_Paulo";
    const tzEl = document.getElementById("timezoneSelect");
    if (tzEl) tzEl.value = tz;
  });

  // Testar som
  document.getElementById("testSoundBtn")?.addEventListener("click", playBeep);

  // Solicitar permissão de push quando marcar
  const pushEl = document.getElementById("pushNotifications");
  if (pushEl) {
    pushEl.addEventListener("change", async (e) => {
      if (e.target.checked && "Notification" in window) {
        try {
          const perm = await Notification.requestPermission();
          if (perm !== "granted") {
            await alertModal({
              title: "Permissão negada",
              message: "Permissão de notificação negada pelo navegador.",
            });
            e.target.checked = false;
          }
        } catch {
          e.target.checked = false;
        }
      }
    });
  }

  // Salvar
  document
    .getElementById("saveSettings")
    ?.addEventListener("click", async () => {
      const confirmar = await confirmarModal({
        title: "Confirmação",
        message: "Deseja realmente salvar as configurações?",
      });
      if (!confirmar) return;

      const theme = document.getElementById("themeSelect").value;
      const fontSize = document.getElementById("fontSizeSelect").value;
      const notifyEmail = document.getElementById("emailNotifications").checked;
      const notifyDesktop =
        document.getElementById("pushNotifications").checked;
      const sound = document.getElementById("soundNotifications").checked;
      const publicProfile = document.getElementById("publicProfile").checked;
      const onlineStatus = document.getElementById("onlineStatus").checked;
      const language = document.getElementById("languageSelect").value;
      const timezone =
        document.getElementById("timezoneSelect").value.trim() ||
        "America/Sao_Paulo";

      user.settings = {
        ...user.settings,
        theme,
        fontSize,
        notifyEmail,
        notifyDesktop,
        sound,
        publicProfile,
        onlineStatus,
        language,
        timezone,
      };

      localStorage.setItem("user", JSON.stringify(user));

      // aplica imediatamente
      _applyTheme(user.settings?.theme || "system");
      applyFontSize(fontSize);

      await alertModal({
        title: "Sucesso",
        message: "Configurações salvas com sucesso!",
      });
    });

  // Exportar
  document.getElementById("exportBtn")?.addEventListener("click", () => {
    const payload = {
      savedAt: new Date().toISOString(),
      user: _getUser(),
      equipes:
        window.equipes || JSON.parse(localStorage.getItem("equipes") || "[]"),
      projetos:
        window.projetos || JSON.parse(localStorage.getItem("projetos") || "[]"),
      tarefas:
        window.tarefas || JSON.parse(localStorage.getItem("tarefas") || "[]"),
      avisos:
        window.avisos || JSON.parse(localStorage.getItem("avisos") || "[]"),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const y = new Date();
    const ymd = `${y.getFullYear()}${String(y.getMonth() + 1).padStart(
      2,
      "0"
    )}${String(y.getDate()).padStart(2, "0")}`;
    a.href = url;
    a.download = `kontrollar-backup-${ymd}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  // Limpar cache seletivo
  document.getElementById("clearBtn")?.addEventListener("click", async () => {
    const checks = Array.from(document.querySelectorAll(".cc:checked")).map(
      (c) => c.value
    );

    if (!checks.length) {
      await alertModal({
        title: "Atenção",
        message: "Selecione pelo menos um item para limpar.",
      });
      return;
    }

    const confirmar = await confirmarModal({
      title: "Confirmação",
      message: "Tem certeza que deseja limpar os dados selecionados?",
    });
    if (!confirmar) return;

    // limpa dados
    if (checks.includes("equipes")) {
      localStorage.removeItem("equipes");
      window.equipes = [];
    }
    if (checks.includes("projetos")) {
      localStorage.removeItem("projetos");
      window.projetos = [];
    }
    if (checks.includes("tarefas")) {
      localStorage.removeItem("tarefas");
      window.tarefas = [];
    }
    if (checks.includes("avisos")) {
      localStorage.removeItem("avisos");
      window.avisos = [];
    }
    if (checks.includes("settings")) {
      const u = _getUser();
      u.settings = {};
      localStorage.setItem("user", JSON.stringify(u));
    }

    await alertModal({
      title: "Sucesso",
      message: "Dados limpos.",
    });
  });
}

async function confirmDeleteAccount() {
  const confirmar1 = await confirmarModal({
    title: "Confirmação",
    message:
      "Tem certeza que deseja excluir sua conta? Esta ação é irreversível.",
  });
  if (!confirmar1) return;

  const confirmar2 = await confirmarModal({
    title: "Última Confirmação",
    message: "Deseja mesmo excluir TUDO?",
  });
  if (!confirmar2) return;

  // Limpa tudo e volta pra index
  localStorage.clear();

  await alertModal({
    title: "Sucesso",
    message: "Conta excluída com sucesso.",
  });

  window.location.href = "index.html";
}
