# Changelog

Todas as mudanças notáveis deste projeto são documentadas aqui.

O formato segue **[Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/)** e o projeto adota **[Versionamento Semântico](https://semver.org/lang/pt-BR/)**.

---

## [Não lançado]

### Added
- Melhorias de acessibilidade (foco visível, navegação por teclado em menus e modais).
- Otimizações de performance (renderização de listas e redução de listeners redundantes).

### Changed
- Revisão de tokens visuais (escala 8/16/24/32px) e contraste para dark mode.

---

## [3.0.0] - 2025-01-16

### Added
- **Autenticação (Login)**
  - Inputs padronizados (`height: 44px`, largura 100%).
  - Campo de senha com `.input-group` e `padding-right` para ícone.
  - Botão “olho” centralizado (`top: 50%` + `transform`) e `stroke-width: 2.5`.

- **Configurações**
  - Fluxo seguro de confirmações: limpar dados, excluir conta (dupla confirmação) e salvar preferências.
  - **Assistente Premium** como aba lateral retrátil (fecha por **ESC**/clique-fora).

- **Avisos**
  - Vínculo com **Equipes/Projetos** (checkbox + busca) e **chips** no card.
  - `filterNotices()` com re-render dinâmico.

- **Perfil**
  - Campos reais (Departamento, Cargo, Telefone, Fuso, Notificações).
  - Upload/remover **avatar** (dataURL).
  - `computeUserStats()` com tolerância a dados incompletos.

- **Notificações Globais**
  - Módulo `Notifs` com `initUI()`, `add()`, `addMany()`.
  - Badge dinâmico e painel com ações: **marcar tudo** / **limpar tudo**.
  - Integração com **Backlog** (notifica novas tarefas).

- **Chats**
  - Seleção de participantes com busca.
  - Política “apenas administradores podem enviar”.
  - Helpers: `getAllKnownUsers()`, `canUserPost()`.

- **Modelo de dados (retrocompatível)**
  - **Chat**: `admins: string[]`, `policies: { posting: "all" | "admins" }`.
  - **Avisos**: `teamIds: string[]`, `projectIds: string[]`, `publishedAt` com timezone corrigido.

### Changed
- **Datas**
  - `date-utils.js`: `getDataBrasiliaFormatada()` e `formatarDataPtBR()`.
  - Corrige “data -1 dia” (timezone de Brasília).

- **Menus/Dropdowns**
  - Equipes: `toggleTeamMenu()` fecha por **ESC** e clique-fora.
  - Projetos: `abrirMenuProjeto()` com comportamento consistente.
  - Tarefas: `abrirMenuTarefas()` com limpeza de listeners.

- **Dashboard**
  - Card “Equipes & Parceiros”: `getTeamsPartnersStats()` e `updateTeamsStatCard()`.

- **Estado/Persistência**
  - Inicialização **confiável** de `window.equipes`, `window.projetos`, `window.avisos` com fallbacks.
  - Ordem recomendada de scripts:
    1) `scripts/utils/date-utils.js`  
    2) `scripts/utils/label.js`, `styles.js`, `modal.js`  
    3) `scripts/notificacao.js`  
    4) `scripts/app.js`  
    5) *mains*: `dashboard.js`, `projetos.js`, `backlogs.js`, `calendario.js`, `chats.js`, `equipes.js`, `avisos.js`, `perfil.js`, `configs.js`

- **Design/UX**
  - Botões com `min-width` global.
  - `form-group` com `margin-bottom: 14px`.
  - Foco com **borda preta** + leve `box-shadow`.

### Fixed
- **Auth**
  - Overrides isolados em `auth.css` (evita interferência de `.icon` global).

- **Configurações**
  - Todos os `alert()` migrados para **`alertModal`**.
  - Campo de fuso com estilo consistente.

- **Avisos**
  - Criação: `push` correto + persistência.
  - Sanitização: `S_NOTICE` para mitigar XSS.
  - Exclusão: `deleteNotice()` atualiza `window.avisos` e `localStorage`.

- **Chats**
  - Guards de nulidade em elementos críticos do DOM.
  - Bloqueio de envio respeitando `canUserPost()`.

---

## [2.0.0] - 2025-01-16

### Added
- **Navegação lateral fixa** com índice que acompanha o conteúdo.
- **Scroll tracking** inteligente.
- **Tema preto & branco** com alto contraste.
- **Conteúdo expandido** em Termos (Segurança de Dados, Suporte, Conformidade, Força Maior).
- **Cards informativos** e **responsividade** aprimorada.

### Changed
- Melhor aproveitamento de largura e hierarquia tipográfica.
- Transições suaves entre seções.
- Otimização da detecção de seção ativa.

### Fixed
- “Movimentação bugada” no scroll (saltos aleatórios).
- Índice não fixo.
- Conflitos de scroll (listener pausado durante navegação por clique).

---

## [1.0.0] - 2025-01-15
### Inicial
- Estrutura base de Termos (HTML/CSS/JS simples).