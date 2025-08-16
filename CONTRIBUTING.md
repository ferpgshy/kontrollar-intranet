# 🤝 Contribuindo para o Kontrollar

Bem-vindo ao **Kontrollar**! Este guia te ajudará a contribuir de forma efetiva para nosso sistema de intranet.

## 🚀 Início Rápido

### Configuração do Ambiente

# 1. Fork e clone o repositório
git clone https://github.com/ferpgshy/kontrollar.git
cd kontrollar

# 2. Instale as dependências
npm install

# 3. Configure o ambiente
cp .env.example .env
# Edite o .env com suas configurações

# 4. Inicie o servidor
node server.js

### Estrutura do Projeto

KONTROLLAR-INTRANET/
├── ia/            # Servidor e script IA
├── public/                # Arquivos estáticos
├── scripts/
│   ├── main/             # Scripts principais (dashboard, termos, etc.)
│   └── utils/            # Utilitários (modal, data-bus, etc.)
├── styles/               # CSS modularizado
└── *.html               # Páginas da aplicação

## 🎯 Como Contribuir

### 🐛 Reportando Bugs

**Antes de reportar:**
- Verifique se já existe uma issue similar
- Teste na versão mais recente
- Reproduza o erro consistentemente

**Template de Bug:**

## 🐛 Bug Report

**Descrição:** O que aconteceu?
**Esperado:** O que deveria acontecer?
**Passos:** Como reproduzir?
**Ambiente:** Navegador, OS, versão

**Screenshots/Logs:** (se aplicável)


### ✨ Sugerindo Funcionalidades

## 💡 Feature Request

**Problema:** Que problema isso resolve?
**Solução:** Como você imagina a funcionalidade?
**Benefício:** Por que isso é importante?
**Alternativas:** Outras opções consideradas?

### 🔧 Desenvolvendo

#### 1. Preparação

# Crie uma branch para sua feature
git checkout -b feature/nome-da-feature
# ou para correções
git checkout -b fix/nome-do-bug

#### 2. Padrões de Código

**JavaScript:**
// ✅ Use camelCase para variáveis e funções
const userName = 'fernando';
const getUserData = () => { /* ... */ };

// ✅ Use const/let, evite var
const API_URL = 'https://api.example.com';
let currentUser = null;

// ✅ Funções arrow quando apropriado
const handleClick = (event) => {
    event.preventDefault();
    // lógica aqui
};

**CSS:**
/* ✅ Use kebab-case para classes */
.user-dashboard {
    background: var(--bg-primary);
}

/* ✅ Organize por componente */
.dashboard-header { /* ... */ }
.dashboard-content { /* ... */ }
.dashboard-sidebar { /* ... */ }

**HTML:**
<!-- ✅ Use HTML semântico -->
<main class="dashboard-main">
    <header class="dashboard-header">
        <h1>Dashboard</h1>
    </header>
    <section class="dashboard-content">
        <!-- conteúdo -->
    </section>
</main>

#### 3. Commits

Use [Conventional Commits](https://conventionalcommits.org/):

# Tipos principais
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação/CSS
refactor: refatoração de código
perf: melhoria de performance
test: testes

# Exemplos
git commit -m "feat: adiciona filtro de data no dashboard"
git commit -m "fix: corrige bug de login no mobile"
git commit -m "style: melhora responsividade da página de termos"

#### 4. Pull Request

**Checklist antes do PR:**
- [ ] Código testado localmente
- [ ] Segue padrões do projeto
- [ ] Documentação atualizada (se necessário)
- [ ] Commits organizados e descritivos

**Template de PR:**
## 📋 Resumo
Breve descrição das mudanças.

## 🔄 Tipo de Mudança
- [ ] 🐛 Bug fix
- [ ] ✨ Nova funcionalidade  
- [ ] 💄 Melhoria de UI/UX
- [ ] 📚 Documentação
- [ ] ⚡ Performance
- [ ] 🔧 Refatoração

## 🧪 Como Testar
1. Passos para testar
2. Comportamento esperado

## 📸 Screenshots
(se aplicável)

## 📝 Notas Adicionais
Informações extras para os reviewers.

## 🎨 Diretrizes de Design

### Cores
- **Primária:** Preto (#000000)
- **Secundária:** Branco (#FFFFFF)  
- **Acentos:** Tons de cinza (#333, #666, #999)
- **Estados:** Verde (sucesso), Vermelho (erro), Azul (info)

### Tipografia
- **Títulos:** Font-weight 600-700
- **Corpo:** Font-weight 400-500
- **Hierarquia:** h1 > h2 > h3 > p

### Layout
- **Mobile-first:** Sempre comece pelo mobile
- **Espaçamento:** Use múltiplos de 8px (8, 16, 24, 32)
- **Breakpoints:** 768px (tablet), 1024px (desktop)

## 🧪 Testes

### Testes Manuais
- Teste em diferentes navegadores (Chrome, Firefox, Safari)
- Verifique responsividade (mobile, tablet, desktop)
- Teste funcionalidades críticas (login, dashboard, etc.)

### Checklist de Qualidade
- [ ] Funciona em mobile
- [ ] Funciona em diferentes navegadores
- [ ] Performance adequada
- [ ] Acessibilidade básica
- [ ] Sem erros no console

## 📞 Suporte

### Contato
- **Email:** fernando.garcia2505@hotmail.com
- **Issues:** Para bugs e sugestões
- **Discussions:** Para dúvidas gerais

### Tempo de Resposta
- **Issues/PRs:** 24-48 horas
- **Dúvidas:** 1-3 dias úteis

## 🏆 Reconhecimento

Contribuidores são reconhecidos:
- 📝 Lista no README
- 🏷️ Menção em releases
- 🌟 Badge de contribuidor

## 📄 Licença

Ao contribuir, você concorda que suas contribuições seguirão a licença MIT Personalizada do projeto.

---

**Obrigado por contribuir! 🚀**

Sua ajuda torna o Kontrollar melhor para toda a comunidade.
