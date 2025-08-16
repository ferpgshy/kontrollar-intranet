# 🤝 Contribuindo para o Kontrollar

Obrigado por querer contribuir com o **Kontrollar**! Este guia explica **como preparar o ambiente, o fluxo de contribuição, padrões de código, qualidade e PRs**.

> **Resumo rápido:** abra uma *issue* → crie uma *branch* → desenvolva seguindo os padrões → teste → abra um PR pequeno, descritivo e com prints/GIFs.

---

## 🚀 Começando

### Pré-requisitos
- **Git** 2.40+
- **Node.js** LTS (18 ou 20) + **npm** (ou **pnpm/yarn**, se preferir)
- Conta no GitHub com acesso ao repositório

### Clonar e instalar
```bash
# 1) Fork (recomendado) e clone seu fork
git clone https://github.com/ferpgshy/kontrollar-intranet.git
cd kontrollar-intranet

# 2) Instalar dependências
npm install

# 3) Variáveis de ambiente (se aplicável)
cp .env.example .env
# edite o .env com seus valores locais

# 4) Rodar em dev
# Use o script do projeto, se existir:
npm run dev
# ou, se o projeto usar um servidor simples:
node server.js
````

> Se o repo “principal” estiver em `ferpgshy/kontrollar-intranet`, você também pode clonar direto dele:
> `git clone https://github.com/ferpgshy/kontrollar-intranet.git`

---

## 🗂️ Estrutura do projeto (visão geral)

```
kontrollar-intranet/
├── ia/                  # servidor/integrações de IA (Node/Express)
├── public/              # assets estáticos
├── scripts/
│   ├── main/            # módulos principais (dashboard, termos, chat, etc.)
│   └── utils/           # utilitários (modal, sanitizer, data-bus, helpers)
├── styles/              # CSS organizado por componente/página
└── *.html               # páginas estáticas
```

---

## 🎯 Onde contribuir

* **Issues abertas** com labels `good first issue`, `help wanted` ou `bug`.
* Pequenas melhorias de **UX**, **acessibilidade**, **performance** e **documentação** são muito bem-vindas.
* Antes de grandes mudanças, **abra uma issue** para alinharmos escopo.

---

## 🌿 Fluxo de Git

### Branching

* `main`: estável / produção.
* `feature/<slug-descritivo>` para features.
* `fix/<slug-descritivo>` para correções.
* `chore/<slug-descritivo>` para tarefas de manutenção.

```bash
git checkout -b feature/filtro-data-dashboard
# ...codar...
git commit -m "feat(dashboard): adiciona filtro de data com ordenação estável"
git push -u origin feature/filtro-data-dashboard
```

### Commits — Conventional Commits

Tipos comuns: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `build`.

**Exemplos**

```
feat(chat): suporte a grupos privados com badge de não lido
fix(termos): corrige índice com scroll em iOS
docs: adiciona seção de a11y ao CONTRIBUTING
style(css): ajusta espaçamentos (8/16/24px) e tokens de cor
perf(projects): memoiza cards de projetos recentes
```

---

## 🧰 Padrões de código

### JavaScript/TypeScript

* **ESM** + `const`/`let`. Evite `var`.
* **camelCase** para variáveis/funções; **PascalCase** para construtores.
* **Funções puras** e helpers em `scripts/utils`.
* Evite globais; exporte/import módulos.
* **DOM**: `data-attributes` para seleção/estado; sanitize entradas visíveis ao usuário.
* Comentários **curtos e úteis** (o *porquê*, não o *o que*).

```ts
// ✅ Exemplo curto
type TeamId = number;

export const getTeamName = (id: TeamId, map: Map<number, { name: string }>) =>
  map.get(id)?.name ?? "—";
```

### CSS

* Classes em **kebab-case**; agrupar por componente.
* Tokens (cores/spacing) centralizados; escala de **8px** (8, 16, 24, 32).
* Evite `!important`; favoreça especificidade clara.
* Responsividade **mobile-first**.

```css
.notice-card { padding: 16px; border-radius: 12px; }
.notice-card__title { font-weight: 600; }
@media (min-width: 768px) { .notice-grid { grid-template-columns: 1fr 1fr; } }
```

### HTML

* **Semântico** (use `<main>`, `<header>`, `<section>`…).
* Atributos `aria-*` para componentes interativos.
* Texto visível para ícones com `aria-label`/`title` quando aplicável.

---

## 🧪 Qualidade e testes manuais

### Checklist mínimo (marque antes do PR)

* [ ] Sem erros no console.
* [ ] Responsivo: **320px**, **768px**, **1024px+**.
* [ ] Acessibilidade básica: foco visível, navegação por **tab**, `aria-label` em botões icônicos.
* [ ] Performance: sem *layouts thrashing*; imagens otimizadas; listas grandes com renderização eficiente.
* [ ] Dados sensíveis **não** commitados (`.env`, tokens); use placeholders em `.env.example`.
* [ ] Sem regressões nas áreas: **login**, **dashboard**, **avisos**, **projetos**, **chat**.

### Como testar (exemplos)

* **Dashboard/Projetos**: cards populam com dados do `localStorage`? filtros/sort aplicam corretamente?
* **Avisos**: criação/edição exclusão persistem? chips de equipes/projetos renderizam ok?
* **Chat**: criação de grupos, última mensagem na listagem, badges de não lido e persistência.
* **Termos**: índice acompanha o scroll (sem `position: fixed` indevido).

---

## 🐛 Reportando bugs (template)

```md
## 🐛 Bug Report
**Descrição:** o que aconteceu?
**Esperado:** o que deveria acontecer?
**Passos para reproduzir:**
1. …
2. …
3. …
**Ambiente:** navegador/versão, OS
**Evidências:** screenshots/logs
```

## 💡 Sugerindo funcionalidades (template)

```md
## 💡 Feature Request
**Problema a resolver:** …
**Proposta:** (o que muda, UX resumida, impacto)
**Alternativas consideradas:** …
**Notas adicionais:** mocks/links se houver
```

---

## 🔁 Pull Requests

**Antes de abrir o PR**

* [ ] Rebase/sync com `main` e resolva conflitos.
* [ ] PR **pequeno e focado** (ideal: < 300 LoC).
* [ ] Inclua **prints/GIF** do antes/depois quando for UI.
* [ ] Atualize docs/`CHANGELOG` se relevante.

**Descrição do PR (modelo)**

```md
## 📋 Resumo
Breve descrição do que foi feito e por quê.

## 🔄 Tipo
- [ ] 🐛 Bug fix
- [ ] ✨ Feature
- [ ] 💄 UI/UX
- [ ] 📚 Docs
- [ ] ⚡ Perf
- [ ] 🔧 Refactor

## 🧪 Como testar
Passos claros de validação.

## 📸 Evidências
(coloque imagens/GIFs)

## 📝 Notas
Riscos, limitações, próximos passos.
```

---

## 🎨 Diretrizes de design (rápidas)

* **Cores**: Primária **#000**, secundária **#FFF**, cinzas `#111/#333/#666/#999`; estados padrão (verde sucesso, vermelho erro, azul info).
* **Tipografia**: Títulos 600–700, corpo 400–500.
* **Espaçamento**: **8/16/24/32px**.
* **Dark mode**: priorizar contraste AA+.

---

## 🔐 Segurança & privacidade

* Nunca comitar **secrets** (tokens, chaves, cookies).
* Não logar dados sensíveis no console.
* Sanitizar entradas/HTML gerado; evitar `innerHTML` sem necessidade.
* Dados de sessão temporários → `sessionStorage`; persistentes e não sensíveis → `localStorage`.

---

## 🗣️ Comunicação

* **Issues/PRs**: resposta em **24–48h**.
* Dúvidas arquiteturais: abra uma **Discussion** curta com contexto e proposta.

---

## 🏆 Reconhecimento

Contribuidores são reconhecidos em:

* README (seção de contribuidores)
* Notas de release
* Badges/menções

---

## 📄 Licença

Ao contribuir, você concorda com a **Licença MIT Personalizada** do projeto. Veja `LICENSE`.

---

**Obrigado por contribuir!** Sua ajuda melhora o Kontrollar para toda a comunidade. 🚀

```
