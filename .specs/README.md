# .specs/ — mapa da documentação viva do orca-api

O código explica o quê. Estes arquivos explicam o porquê. Leia nesta ordem no início de
qualquer sessão de trabalho (ver `CLAUDE.md`).

```
project/
├── PROJECT.md      Visão de produto: o que é o Orça, capacidades do MVP, fluxos, fora de escopo.
├── ROADMAP.md       Épicos e tasks, em ordem. Consulte antes de criar task nova.
├── DECISIONS.md     ADR-lite: DEC-xxx (decisões) e LESSON-xxx (lições). Inclui as em aberto.
└── STATE.md         Estado da última sessão. Fonte de verdade sobre "onde paramos".

codebase/
├── STACK.md         Versões de tudo.
├── ARCHITECTURE.md  Modular monolith: módulos, camadas, fluxo de dados.
├── STRUCTURE.md     Árvore de diretórios anotada.
├── DOMAIN.md        Mapa de módulos de domínio e suas responsabilidades.
├── CONVENTIONS.md   Nomenclatura, imports, DTOs, estilo de código.
├── TESTING.md       O que testar, o que não testar, como.
├── ENVIRONMENTS.md  Ambientes, CI/CD, secrets, deploy.
├── INTEGRATIONS.md  E-mail, WhatsApp, Puppeteer — contratos com serviços externos.
└── CONCERNS.md      Dívida técnica numerada (DEBT-xxx).
```

## Nota de topologia (DEC-011)

`project/` é **único** neste repositório. O `orca-app` não tem seu próprio `project/` — o
`.specs/README.md` de lá aponta para cá. Motivo: uma sessão de trabalho é uma só, não uma
por repositório; duplicar o `STATE.md` criaria dois estados divergentes.

`codebase/` existe nos dois repositórios, cada um descrevendo o próprio código.
