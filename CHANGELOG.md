
# Changelog

**Data:** 2025-08-11

# Avisos

* Corrigido “data -1 dia”: `publishedAt` agora usa `getDataBrasiliaFormatada()` (yyyy-mm-dd) e exibição via `formatarDataPtBR()`.
* Vínculo de Avisos com Equipes e Projetos:

  * Novos campos no modal (criação/edição) com checkboxes + busca.
  * Renderização de “chips” das equipes/projetos no card do aviso.
  * Helpers: `getTeamOptions()`, `getProjectOptions()`, `resolveTeamNamesFromIds()`, `resolveProjectNamesFromIds()`.
* Estado/Persistência:

  * `window.equipes`, `window.projetos`, `window.avisos` inicializados a partir do `localStorage`.
  * `deleteNotice()` refeito para atualizar `window.avisos` + `localStorage`.
* UI/Segurança:

  * `renderNoticeCard()` unificado para gerar cards.
  * Sanitização simples via `S_NOTICE` em campos sensíveis.
* Filtros:

  * `filterNotices()` agora filtra em `window.avisos` e re-renderiza com `generateNoticeCardsFromArray()`.

# Perfil

* Removidas “Preferências” duplicadas (ficam só nas Configurações).
* “Seu resumo” agora puxa dados reais do usuário:

  * Departamento, Cargo, Telefone, Fuso, Notificações (email/push).
* Melhorias de base do usuário:

  * `getSafeUser()` (default + `createdAt` + `settings`).
  * Upload/remoção de avatar (dataURL) e iniciais.
  * Split/join de nome (`splitName`/`joinName`).
  * Máscara de telefone `maskPhone()`.
  * Barra de força de senha (`pwdStrengthScore()` + feedback).
* Métricas pessoais:

  * `computeUserStats()` mais tolerante (match por nome/email e por formatos variados de membros/responsável).

# Configurações

* Mantido como fonte única de preferências (tema, notificações, idioma/fuso etc.).
* Perfil exibe os valores salvos, mas não duplica a edição.

# Notificações (módulo global `Notifs`)

* Extraído para **`notificacao.js`**:

  * API: `Notifs.initUI()`, `Notifs.add()`, `Notifs.addMany()`, `Notifs.readAll()`, `Notifs.clear()`.
  * Badge (contador) dinâmico; some quando 0 (sem “3” hardcoded).
  * Painel com **ícones** de ação no header: “marcar tudo como lido” e “limpar tudo”.
  * Clique nas notificações chama callbacks (ex.: navegar para páginas).
* Integração no app:

  * Em `app.js` trocamos o handler antigo por `Notifs.initUI({ bellSelector, panelSelector, closeSelector, listSelector })`.
  * Confirm de “limpar todas” passou a usar `confirmarModal(...)` (mesmo padrão dos modais do app).

# Backlog (integração com Notificações)

* Ao criar um novo backlog/tarefa, adiciona notificação via `Notifs.add({ type:'task', title:'Nova tarefa', message:..., onClick: () => ... })`.
* Ajustes de persistência/estilo mantidos.

# Datas & Utils

* Criado **`date-utils.js`** com:

  * `getDataBrasiliaFormatada()` (corrige timezone de Brasília, yyyy-mm-dd).
  * `formatarDataPtBR()`.
* Centralização de helpers de label/estilo/modal separados (conforme seus arquivos `utils`).

# Deleções com modal

* Padronizado o padrão de confirmação assíncrona:

  * `deleteNotice()` e outros handlers agora usam `confirmarModal({ title, message })` antes de executar, como no exemplo de projetos/equipes.

# Ordem de scripts (recomendada)

1. `scripts/utils/date-utils.js`
2. (outros utils) `label.js`, `styles.js`, `modal.js`
3. `scripts/notificacao.js`
4. `scripts/app.js`
5. mains: `dashboard.js`, `projetos.js`, `backlogs.js`, `calendario.js`, `chats.js`, `equipes.js`, `avisos.js`, `perfil.js`, `configs.js`

> Objetivo: garantir que utils e Notifs existam antes do app e das telas.

# Base / Helpers

* **Data de Brasília (corrige “um dia antes”)**

  * Trocado uso de `new Date().toISOString().split("T")[0]` por **`getDataBrasiliaFormatada()`** nas criações (equipes, projetos, avisos).
  * Exibição padronizada com **`formatarDataPtBR(yyyy-mm-dd)`**.

* **Sanitização**

  * Adicionado fallback `S_NOTICE` para evitar XSS em strings renderizadas nos avisos.

* **Estado global / persistência**

  * Inicialização garantida (antes de usar qualquer função):

    ```js
    window.equipes  = window.equipes  || JSON.parse(localStorage.getItem("equipes")  || "[]");
    window.projetos = window.projetos || JSON.parse(localStorage.getItem("projetos") || "[]");
    window.avisos   = window.avisos   || JSON.parse(localStorage.getItem("avisos")   || "[]");
    ```
  * Lembrete: sempre que criar/editar/excluir, fazer `localStorage.setItem("<coleção>", JSON.stringify(window.<coleção>))`.

---

# Equipes

* **Dropdown de ações (menu de equipe)**

  * `window.toggleTeamMenu(teamId)` reescrito:

    * Fecha ao clicar fora e ao pressionar **ESC**.
    * Evita conflitos entre múltiplos menus usando `menu._close`.
    * Corrigido seletor para cartões com `data-equipe-id` (antes o código misturava `data-team-id`).
  * Ao confirmar exclusão, chama `deleteTeam(teamId)` (garanta que a função exista com esse nome) e depois re-render:

    * `loadEquipesContent()` e opcionalmente `updateTeamsStatCard()` (dashboard).

* **Criação/edição de equipes**

  * Adicionada lógica (quando implementado no modal) para **selecionar projetos existentes** (checkbox + busca).
  * Bug “não aparecem projetos na criação de equipe” corrigido ao **buscar projetos** de `window.projetos` com fallback para variável global/localStorage (ver seção *Funções utilitárias*).

---

# Projetos

* **Dropdown de ações (menu do projeto)**

  * `window.abrirMenuProjeto(projectId)` atualizado para:

    * Fechar ao **clicar fora** e com **ESC**.
    * Evitar menus múltiplos abertos.
  * Exclusão mantém confirmação e re-render da lista.

---

# Tarefas

* **Dropdown de ações (menu da tarefa)**

  * `window.abrirMenuTarefas(taskId)` idem: fecha ao clicar fora/ESC e garante limpeza de listeners.

---

# Dashboard

* **Novo card “Equipes & Parceiros”**

  * Card com `<span id="totalTeams">` e `<strong id="totalPartners">` + chips por equipe.
  * Novas funções:

    * `_sanitize` (fallback).
    * `getTeamsPartnersStats(equipes)` – total de equipes, soma de membros e breakdown por equipe.
    * `updateTeamsStatCard()` – injeta totais e chips no card.
  * **Chamar** `updateTeamsStatCard()` após `carregarConteudoDashboard()` e sempre que criar/editar/excluir equipes.

---

# Avisos

* **Renderização**

  * `renderNoticeCard(notice)` agora:

    * Mostra **chips de equipes** e **chips de projetos** vinculados.
    * Datas via `formatarDataPtBR`.
    * Sanitização via `S_NOTICE`.

* **Seleção de Equipes/Projetos nos modais**

  * `showNewNoticeModal()` e `editNotice()` agora exibem **listas com busca** (checkbox) para vincular **equipes** e **projetos**.
  * IDs salvos em `notice.teamIds` e `notice.projectIds`.

* **Busca de dados confiável**

  * `getTeamOptions()` e `getProjectOptions()` passaram a ter **fallback**:

    * Usam `window.equipes`/`window.projetos` se existirem e tiverem itens;
    * Senão, usam variáveis globais `equipes`/`projetos` (se existirem);
    * Senão, carregam do `localStorage`.
  * Isso resolveu o “não mostra nada na lista” quando `window.*` ainda não estava populado.

* **Criação de aviso**

  * Corrigido **bug**: agora faz **push** no array e persiste:

    ```js
    (window.avisos ||= []);
    window.avisos.push(newNotice);
    localStorage.setItem("avisos", JSON.stringify(window.avisos));
    ```
  * `publishedAt` agora com **`getDataBrasiliaFormatada()`**.
  * Mantida `expiresAt` do `<input type="date">`.

* **Edição de aviso**

  * Atualiza campos + `teamIds` e `projectIds`.
  * Re-render ao salvar.

* **Filtro e exclusão**

  * `filterNotices()` agora usa `(window.avisos || [])`.
  * `deleteNotice()` atualiza `window.avisos`, **persiste no localStorage** e re-renderiza.

---

# Funções utilitárias adicionadas/ajustadas

* **getTeamOptions() / getProjectOptions()** (com fallback triplo).
* **resolveTeamNamesFromIds() / resolveProjectNamesFromIds()** (mapeiam IDs → nomes).
* **S\_NOTICE** (sanitização simples para HTML).

---

# Pontos de atenção (para não esquecer)

* Depois de **criar/editar/excluir** qualquer coisa em `equipes`, `projetos` ou `avisos`, sempre:

  1. Atualize o array em `window.*`;
  2. Faça `localStorage.setItem(...)`;
  3. Re-renderize a área correspondente (`loadEquipesContent()`, filtros de projetos/avisos, etc.);
  4. Se estiver no dashboard, rode `updateTeamsStatCard()`.

## Adicionado

* **Seleção de participantes na criação do chat**

  * Busca por nome e **adição manual** de usuários.
  * Checkboxes por usuário: **Participa** e **Adm**.
  * O criador entra **automaticamente** e fica **travado como administrador**.
* **Política de envio (“apenas leitura”)**

  * Opção **Apenas administradores podem enviar** (modo leitura) no modal de criação.
  * Envio é bloqueado para não-admins quando ativo.
* **Helpers**

  * `getAllKnownUsers()` — consolida nomes de `localStorage.users`, dos chats existentes e do usuário atual.
  * `canUserPost(chat, userName)` — checa permissão de envio conforme a política.
  * `showToast(msg)` — placeholder para feedback (substituível pelo seu sistema de toast).

## Alterado

* **UI do input de mensagens**

  * Desativa **input** e **botão Enviar** quando o chat está em modo somente admins, com placeholder explicativo.
* **Criação de chat**

  * Persistência dos novos campos no objeto do chat: `admins` e `policies.posting`.
  * Persistência de `chatGrupos` no `localStorage` após criar.
* **Indicador de tipo**

  * Badge do tipo do chat agora possui **tooltip** (“Público” / “Privado”).

## Corrigido / Robustez

* **Prevenção de nulidade no DOM**

  * Guards adicionados em elementos como `currentChatName`, `chatMessages`, `chatInput`, `leaveChatBtn`, evitando erros do tipo “Cannot set properties of null”.

## Modelo de Dados (compatível)

* Objeto `chat` agora inclui:

  * `admins: string[]`
  * `policies: { posting: "all" | "admins" }`
* Campos existentes (`id`, `name`, `type`, `members`, `messages`) **inalterados**.

## Notas de Implementação

* **Fonte de usuários**: `getAllKnownUsers()` usa `localStorage.users` (string\[] ou `{name:string}[]`) + membros/admins dos grupos existentes + usuário atual.
* **Bloqueio de envio**: aplicado em `setupMessageSending()` usando `canUserPost()`.
* **UX**: Em `chatSelecionado()`, input/Enviar são (des)ativados de acordo com a política do chat.

## Quebra de Compatibilidade

* **Nenhuma.** Funciona com dados antigos após a migração acima (ou com defaults implícitos).
