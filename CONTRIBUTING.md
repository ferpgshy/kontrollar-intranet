# 🤝 Guia de Contribuição - Kontrollar

Obrigado pelo seu interesse em contribuir com o **Kontrollar**! Este guia fornece todas as informações necessárias para contribuir de forma efetiva e organizada.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Posso Contribuir?](#como-posso-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Processo de Desenvolvimento](#processo-de-desenvolvimento)
- [Padrões de Código](#padrões-de-código)
- [Processo de Pull Request](#processo-de-pull-request)
- [Reportando Bugs](#reportando-bugs)
- [Sugerindo Melhorias](#sugerindo-melhorias)
- [Comunidade](#comunidade)

---

## 📜 Código de Conduta

Este projeto segue um código de conduta para garantir um ambiente acolhedor para todos. Ao participar, você concorda em manter um comportamento respeitoso e profissional.

### Comportamentos Esperados
- Use linguagem acolhedora e inclusiva
- Respeite diferentes pontos de vista e experiências
- Aceite críticas construtivas com elegância
- Foque no que é melhor para a comunidade

---

## 🛠️ Como Posso Contribuir?

### 🐛 Correção de Bugs
- Identifique e corrija bugs existentes
- Melhore tratamento de erros
- Otimize performance

### ✨ Novas Funcionalidades
- Implemente recursos solicitados na roadmap
- Sugira e desenvolva novas funcionalidades
- Melhore funcionalidades existentes

### 📚 Documentação
- Melhore documentação existente
- Crie tutoriais e guias
- Traduza documentação
- Corrija erros de digitação

### 🎨 Interface e UX
- Melhore design e usabilidade
- Implemente responsividade
- Otimize acessibilidade
- Crie componentes reutilizáveis

### 🧪 Testes
- Escreva testes unitários
- Crie testes de integração
- Melhore cobertura de testes
- Teste em diferentes navegadores

### 🤖 Inteligência Artificial
- Melhore prompts do chatbot
- Otimize respostas da IA
- Implemente novos modelos
- Melhore processamento de linguagem natural

---

## ⚙️ Configuração do Ambiente

### Pré-requisitos
- **Node.js** 18.0.0 ou superior
- **npm** ou **yarn**
- **Git**
- Editor de código (recomendado: **VSCode**)

### Configuração Inicial

1. **Fork e Clone**
   \`\`\`bash
   git clone https://github.com/seu-usuario/kontrollar.git
   cd kontrollar
   \`\`\`

2. **Instale Dependências**
   \`\`\`bash
   npm install
   # ou
   yarn install
   \`\`\`

3. **Configuração de Ambiente**
   \`\`\`bash
   cp .env.example .env
   # Configure suas variáveis de ambiente
   \`\`\`

4. **Inicie o Servidor de Desenvolvimento**
   \`\`\`bash
   npm run dev
   # ou
   yarn dev
   \`\`\`

### Estrutura do Projeto
\`\`\`
kontrollar/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/         # Páginas da aplicação
│   ├── styles/        # Arquivos CSS
│   ├── scripts/       # Scripts JavaScript
│   └── assets/        # Imagens e recursos
├── docs/              # Documentação
├── tests/             # Testes automatizados
└── server/            # Servidor Node.js (IA)
\`\`\`

---

## 🚀 Processo de Desenvolvimento

### 1. Planejamento
- Verifique issues existentes
- Discuta grandes mudanças antes de implementar
- Crie ou comente na issue relacionada

### 2. Desenvolvimento
- Crie uma branch específica para sua feature
- Faça commits pequenos e frequentes
- Teste suas mudanças localmente

### 3. Testes
- Execute todos os testes existentes
- Adicione novos testes quando necessário
- Verifique se não há regressões

### 4. Documentação
- Atualize documentação relevante
- Adicione comentários no código quando necessário
- Atualize CHANGELOG.md se aplicável

---

## 📝 Padrões de Código

### JavaScript
- Use **camelCase** para variáveis e funções
- Use **PascalCase** para classes e componentes
- Use **UPPER_SNAKE_CASE** para constantes
- Prefira `const` e `let` ao invés de `var`
- Use arrow functions quando apropriado

\`\`\`javascript
// ✅ Bom
const userName = 'ferpgshy';
const API_BASE_URL = 'https://api.example.com';

const getUserData = async (userId) => {
  // implementação
};

// ❌ Evite
var user_name = 'ferpgshy';
function get_user_data(user_id) {
  // implementação
}
\`\`\`

### CSS
- Use **kebab-case** para classes
- Siga metodologia BEM quando apropriado
- Mantenha especificidade baixa
- Use variáveis CSS para cores e espaçamentos

\`\`\`css
/* ✅ Bom */
.user-profile {
  background-color: var(--primary-color);
}

.user-profile__avatar {
  border-radius: 50%;
}

/* ❌ Evite */
.UserProfile {
  background-color: #000000;
}
\`\`\`

### HTML
- Use HTML semântico
- Mantenha acessibilidade em mente
- Use atributos `alt` em imagens
- Estruture conteúdo logicamente

---

## 🔄 Processo de Pull Request

### 1. Preparação
\`\`\`bash
# Crie uma branch para sua feature
git checkout -b feature/nova-funcionalidade

# ou para correção de bug
git checkout -b fix/correcao-bug
\`\`\`

### 2. Desenvolvimento
\`\`\`bash
# Faça suas mudanças
git add .
git commit -m "feat: adiciona nova funcionalidade de filtro"

# Mantenha sua branch atualizada
git fetch origin
git rebase origin/main
\`\`\`

### 3. Envio
\`\`\`bash
# Envie sua branch
git push origin feature/nova-funcionalidade
\`\`\`

### 4. Pull Request
- Use título descritivo e claro
- Descreva as mudanças realizadas
- Referencie issues relacionadas
- Adicione screenshots se aplicável
- Marque reviewers apropriados

### Template de PR
\`\`\`markdown
## Descrição
Breve descrição das mudanças realizadas.

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## Como Testar
1. Passos para testar
2. Comportamento esperado

## Screenshots
(se aplicável)

## Checklist
- [ ] Código segue padrões do projeto
- [ ] Testes passando
- [ ] Documentação atualizada
\`\`\`

---

## 🐛 Reportando Bugs

### Antes de Reportar
- Verifique se o bug já foi reportado
- Teste na versão mais recente
- Colete informações do ambiente

### Template de Bug Report
\`\`\`markdown
**Descrição do Bug**
Descrição clara e concisa do problema.

**Passos para Reproduzir**
1. Vá para '...'
2. Clique em '...'
3. Role para baixo até '...'
4. Veja o erro

**Comportamento Esperado**
O que deveria acontecer.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente:**
- OS: [ex: Windows 10]
- Navegador: [ex: Chrome 91]
- Versão: [ex: 1.2.3]
\`\`\`

---

## 💡 Sugerindo Melhorias

### Template de Feature Request
\`\`\`markdown
**Sua sugestão está relacionada a um problema?**
Descrição clara do problema.

**Descreva a solução que você gostaria**
Descrição clara e concisa da funcionalidade.

**Descreva alternativas consideradas**
Outras soluções ou funcionalidades consideradas.

**Contexto Adicional**
Qualquer outro contexto ou screenshots.
\`\`\`

---

## 🎯 Convenções de Commit

Use [Conventional Commits](https://www.conventionalcommits.org/):

\`\`\`bash
# Tipos principais
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: tarefas de manutenção

# Exemplos
git commit -m "feat: adiciona filtro por data no dashboard"
git commit -m "fix: corrige bug de validação no formulário"
git commit -m "docs: atualiza guia de instalação"
\`\`\`

---

## 🏷️ Versionamento

O projeto segue [Semantic Versioning](https://semver.org/):
- **MAJOR**: mudanças incompatíveis
- **MINOR**: funcionalidades compatíveis
- **PATCH**: correções compatíveis

---

## 🌟 Reconhecimento

Contribuidores são reconhecidos:
- Lista de contribuidores no README
- Menção em releases
- Badge de contribuidor
- Agradecimentos especiais

---

## 📞 Comunidade e Suporte

### Canais de Comunicação
- **Issues**: Para bugs e sugestões
- **Discussions**: Para perguntas gerais
- **Email**: ferpgshy@example.com

### Horários de Resposta
- Issues: 24-48 horas
- Pull Requests: 48-72 horas
- Discussões: 1-3 dias

---

## 🙏 Agradecimentos

Obrigado por contribuir com o **Kontrollar**! Sua participação ajuda a tornar este projeto melhor para toda a comunidade.

Juntos, vamos construir uma ferramenta de controle e organização excepcional! 🚀

---

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto.
