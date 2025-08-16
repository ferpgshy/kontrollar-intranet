# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não Lançado]

### 🔄 Em Desenvolvimento
- Melhorias de acessibilidade
- Otimizações de performance

---

## [3.0.0] - 2025-01-16

### ✨ Adicionado

#### **Sistema de Autenticação (Login)**
- **Inputs padronizados**: Altura fixa de `44px` e largura `100%` aplicada a todos os campos
- **Campo de senha aprimorado**: 
  - Estrutura com `.input-group` para abrigar o botão "olho"
  - `padding-right` aplicado para evitar sobreposição de texto com ícone
- **Botão "olho" melhorado**:
  - Reposicionado com `top: 50%` + `transform: translateY(-50%)`
  - Cor preta forçada (`#000`) com `stroke-width: 2.5` no SVG
  - Hover suave alterando para `#333`

#### **Sistema de Configurações**
- **Confirmações de segurança**: 
  - Ação de "Limpar dados" com `confirmarModal`
  - Exclusão de conta com duas confirmações sequenciais
  - Salvamento de configurações com confirmação
- **Aba flutuante (Assistente Premium)**:
  - Botão convertido em aba lateral retrátil com seta
  - Comportamento acessível: fecha com ESC ou clique fora

#### **Sistema de Avisos**
- **Vínculo com Equipes e Projetos**:
  - Novos campos no modal com checkboxes + busca
  - Renderização de "chips" das equipes/projetos no card
  - Helpers: `getTeamOptions()`, `getProjectOptions()`, `resolveTeamNamesFromIds()`
- **Filtros avançados**: `filterNotices()` com re-renderização dinâmica

#### **Sistema de Perfil**
- **Dados reais do usuário**: Departamento, Cargo, Telefone, Fuso, Notificações
- **Upload de avatar**: Suporte a dataURL e remoção
- **Métricas pessoais**: `computeUserStats()` com tolerância aprimorada

#### **Sistema de Notificações Global**
- **Módulo `Notifs` extraído**: API completa com `initUI()`, `add()`, `addMany()`
- **Badge dinâmico**: Contador que some quando zero
- **Painel com ícones**: Ações de "marcar tudo como lido" e "limpar tudo"
- **Integração com Backlog**: Notificações automáticas para novas tarefas

#### **Sistema de Chats**
- **Seleção de participantes**: Busca por nome e adição manual
- **Política de envio**: Modo "apenas administradores podem enviar"
- **Helpers de usuários**: `getAllKnownUsers()`, `canUserPost()`

### 🔧 Melhorado

#### **Gestão de Datas**
- **Módulo `date-utils.js`**: 
  - `getDataBrasiliaFormatada()` corrige timezone de Brasília
  - `formatarDataPtBR()` para formatação consistente
- **Correção "data -1 dia"**: `publishedAt` usa timezone correto

#### **Dropdowns de Ação**
- **Equipes**: `toggleTeamMenu()` com fechamento por ESC e clique fora
- **Projetos**: `abrirMenuProjeto()` com comportamento consistente  
- **Tarefas**: `abrirMenuTarefas()` com limpeza de listeners

#### **Dashboard**
- **Card "Equipes & Parceiros"**: 
  - Estatísticas com `getTeamsPartnersStats()`
  - Chips por equipe com `updateTeamsStatCard()`

#### **Estado Global e Persistência**
- **Inicialização garantida**: `window.equipes`, `window.projetos`, `window.avisos`
- **Fallback triplo**: Para `getTeamOptions()` e `getProjectOptions()`

### 🐛 Corrigido

#### **Autenticação**
- **Compatibilidade**: Overrides isolados em `auth.css`
- **Herança de estilos**: Removida dependência de `.icon` global

#### **Configurações**  
- **Alertas padronizados**: Todos os `alert()` substituídos por `alertModal`
- **Entrada de fuso horário**: Estilo consistente com outros inputs

#### **Avisos**
- **Bug de criação**: Agora faz `push` correto no array e persiste
- **Sanitização**: Fallback `S_NOTICE` para prevenir XSS
- **Exclusão**: `deleteNotice()` atualiza `window.avisos` e localStorage

#### **Chats**
- **Prevenção de nulidade**: Guards em elementos DOM críticos
- **Bloqueio de envio**: Aplicado corretamente com `canUserPost()`

### 🎨 Design

#### **Padronização Visual**
- **Botões**: Regra global de `min-width` para `.btn`
- **Labels e espaçamento**: `.form-group` padronizado com `margin-bottom: 14px`
- **Foco**: Borda preta + `box-shadow` para feedback claro

### 📋 Estrutura de Arquivos

#### **Ordem de Scripts Recomendada**
1. `scripts/utils/date-utils.js`
2. `scripts/utils/label.js`, `styles.js`, `modal.js`
3. `scripts/notificacao.js`
4. `scripts/app.js`
5. **Mains**: `dashboard.js`, `projetos.js`, `backlogs.js`, `calendario.js`, `chats.js`, `equipes.js`, `avisos.js`, `perfil.js`, `configs.js`

### 🔒 Modelo de Dados

#### **Chat (compatível)**
\`\`\`javascript
{
  id: string,
  name: string,
  type: "public" | "private",
  members: string[],
  admins: string[], // NOVO
  policies: { posting: "all" | "admins" }, // NOVO
  messages: array
}
\`\`\`

#### **Avisos**
\`\`\`javascript
{
  teamIds: string[], // NOVO
  projectIds: string[], // NOVO
  publishedAt: string, // Corrigido timezone
  // ... campos existentes
}
\`\`\`

### ⚠️ Pontos de Atenção

#### **Após Operações CRUD**
1. Atualize o array em `window.*`
2. Execute `localStorage.setItem(...)`
3. Re-renderize a área correspondente
4. Se no dashboard, execute `updateTeamsStatCard()`

#### **Funções Utilitárias Críticas**
- **getSafeUser()**: Default + `createdAt` + `settings`
- **S_NOTICE**: Sanitização simples para HTML
- **maskPhone()**: Máscara de telefone
- **pwdStrengthScore()**: Barra de força de senha

---

## [2.0.0] - 2025-01-16

### ✨ Adicionado
- **Navegação lateral fixa**: Índice permanece visível durante o scroll na lateral esquerda
- **Scroll tracking inteligente**: Navegação automática que acompanha a posição da página
- **Design moderno preto e branco**: Esquema de cores elegante com alto contraste
- **Conteúdo expandido**: 4 novas seções adicionadas aos termos de uso
  - Segurança de Dados e Sistemas
  - Suporte Técnico e Atendimento
  - Conformidade Legal e Regulamentações
  - Casos de Força Maior
- **Cards informativos**: Elementos visuais destacados para melhor organização
- **Responsividade aprimorada**: Layout adaptável para diferentes tamanhos de tela

### 🔧 Melhorado
- **Aproveitamento de espaço**: Cards agora utilizam toda a largura disponível da tela
- **Experiência de navegação**: Transições suaves entre seções
- **Hierarquia visual**: Melhor organização do conteúdo com tipografia aprimorada
- **Performance**: Otimização da detecção de seções ativas durante o scroll

### 🐛 Corrigido
- **Movimentação bugada**: Resolvido problema de scroll que voltava posições aleatoriamente
- **Índice não fixo**: Corrigido posicionamento para manter visibilidade constante
- **Conflitos de scroll**: Removido listener temporariamente durante navegação por clique

---

## [1.0.0] - 2025-01-15
### Inicial
- Versão básica da página de termos
- Estrutura HTML, CSS e JS simples
- Conteúdo básico de termos de uso

---

## 🚀 Guia de Migração

### De 2.x para 3.x
- **Chats**: Novos campos `admins` e `policies` são opcionais (defaults aplicados)
- **Avisos**: Campos `teamIds` e `projectIds` são opcionais
- **Scripts**: Seguir nova ordem de carregamento recomendada

### De 1.x para 2.x
- **CSS**: Verificar compatibilidade com novo esquema de cores
- **JavaScript**: Atualizar referências de navegação se customizadas

---

## 📞 Suporte

Para questões sobre este changelog ou implementação:
- Consulte a documentação técnica do projeto
- Verifique os comentários no código para detalhes específicos
- Teste em ambiente de desenvolvimento antes de produção
