<h1 align="center">🧠 Kontrollar</h1>
<p align="center">Tudo no seu <strong>Kontrole</strong> – Uma Intranet Inteligente e Interativa para Gestão de Projetos.</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-em%20desenvolvimento-yellow?style=flat-square" />
  <img src="https://img.shields.io/badge/license-Custom-lightgrey?style=flat-square" />
  <img src="https://img.shields.io/badge/feito%20com-HTML%20%7C%20JS%20%7C%20Node.js-blue?style=flat-square" />
</p>

---

## 🚀 Sobre o Projeto

**Kontrollar** é uma **intranet moderna e responsiva** voltada para **gestão de projetos**, desenvolvida com foco em **eficiência, produtividade e comunicação integrada**.

Com uma interface intuitiva, dashboards inteligentes e uma IA de suporte personalizada, o Kontrollar é a solução ideal para equipes que desejam manter **tudo sob kontrole**.

---

## 🧩 Funcionalidades

- ✅ Dashboard interativa com resumo dos projetos
- 📁 Organização visual por tarefas e status (Backlog, Concluído, etc)
- 🧑‍🤝‍🧑 Chat em tempo real entre membros da equipe
- 🤖 IA de suporte:
  - Gratuita: responde dúvidas sobre o site e navegação
  - Premium: especialista na ferramenta e fluxos internos
- 🗂️ Sistema de criação, edição, filtro e exclusão de projetos/tarefas
- 💾 Persistência via `localStorage` (futuramente banco de dados)
- 💬 Interface dark minimalista com foco na legibilidade
- 🔒 Separação entre arquivos públicos e internos (`/iaAcessoGratuito`, `/iaAcessoPago`)

---

## 🧠 IA de Suporte

### 💬 Gratuita (Landpage)
> Responde perguntas sobre o site, funcionalidades e ajuda com navegação. Ideal para visitantes.

### 👨‍💻 Pago (Dashboard)
> IA treinada com as funcionalidades da intranet. Pode responder sobre o uso da dashboard, atalhos, status de projetos, backlog, etc.

---

## 🧱 Tecnologias Utilizadas

- **HTML5 / CSS3 / JavaScript**
- **Node.js + Express** (servidor da IA)
- **Fetch API** para requisições
- **OpenAI API** (com proteção de chave via `.env`)
- **localStorage** (para persistência local de chats e dados)

---

## 📦 Instalação Local

```bash
# Clone o repositório
git clone https://github.com/ferpgshy/kontrollar-intranet.git

# Acesse a pasta
cd kontrollar-intranet

# Instale dependências
npm install

# Inicie o servidor da IA
node ia/serveria.js

# Abra o index.html com Live Server ou navegador
