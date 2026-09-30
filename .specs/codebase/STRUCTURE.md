# STRUCTURE.md — orca-api

Árvore alvo após o Épico 01 (ainda não existe fisicamente ao final do Épico 00 — este
arquivo é o plano, atualize-o conforme a estrutura real emergir).

```
orca-api/
├── CLAUDE.md
├── .specs/                    ← este diretório
├── .github/workflows/         ← CI (lint, typecheck, test, build)
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── main.ts                ← bootstrap Nest
│   ├── app.module.ts          ← agrega todos os módulos
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── guards/
│   ├── users/
│   ├── companies/
│   ├── customers/
│   ├── products/
│   ├── quotes/
│   │   ├── quotes.controller.ts
│   │   ├── quotes.service.ts
│   │   ├── quotes.repository.ts
│   │   ├── quotes.module.ts
│   │   └── calculation/       ← função pura de cálculo (DEC-002), testada isoladamente
│   ├── notifications/
│   ├── public/                ← GET /q/:token, sem guard de auth
│   ├── pdf/                   ← Puppeteer, reusa o template de public/
│   └── shared/                ← utilitários agnósticos de módulo (ex.: filtros, pipes)
├── test/                      ← testes e2e
├── Dockerfile
└── docker-compose.yml         ← Postgres local para desenvolvimento
```

**Regra de nomenclatura de arquivo:** um arquivo, uma responsabilidade — `*.controller.ts`,
`*.service.ts`, `*.repository.ts`, `*.module.ts`, `*.dto.ts` (ver `CONVENTIONS.md`).

Cada módulo replica o padrão de `auth/` e `quotes/` acima — pastas vazias sem conteúdo não
devem existir (ex.: um módulo sem repository próprio simplesmente não tem o arquivo).
