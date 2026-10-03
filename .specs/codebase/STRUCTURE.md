# STRUCTURE.md — orca-api

Árvore real após o Épico 01. Módulos de domínio existem só como casca (`<nome>.module.ts`
vazio, sem controller/service/repository ainda) — cada um ganha corpo no seu próprio épico.

```
orca-api/
├── CLAUDE.md
├── .specs/
├── .gitignore
├── .dockerignore
├── .prettierrc
├── eslint.config.mjs
├── nest-cli.json
├── tsconfig.json               ← "strict": true (Nest 11 gera parcial por default, ver STACK.md)
├── tsconfig.build.json
├── package.json
├── Dockerfile                  ← multi-stage, node:22-alpine
├── .github/workflows/          ← CI — ainda não criado, Épico 04.5
├── prisma/                     ← ainda não existe, Épico 04
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── main.ts                 ← bootstrap Nest
│   ├── app.module.ts           ← agrega todos os módulos
│   ├── auth/auth.module.ts             ← casca vazia, corpo no Épico 05
│   ├── users/users.module.ts           ← casca vazia
│   ├── companies/companies.module.ts   ← casca vazia, corpo no Épico 06
│   ├── customers/customers.module.ts   ← casca vazia, corpo no Épico 07
│   ├── products/products.module.ts     ← casca vazia, corpo no Épico 08
│   ├── quotes/quotes.module.ts         ← casca vazia, corpo no Épico 09
│   ├── notifications/notifications.module.ts  ← casca vazia, corpo no Épico 17
│   ├── public/public.module.ts         ← casca vazia, corpo no Épico 13
│   ├── pdf/pdf.module.ts               ← casca vazia, corpo no Épico 15
│   └── shared/                 ← ainda não existe — criar quando o primeiro utilitário
│                                  agnóstico de módulo aparecer (ex.: filtro, pipe)
└── test/
    └── jest-e2e.json            ← config e2e; primeiro teste real vem com o walking
                                   skeleton (Épico 04.5) — o placeholder "Hello World"
                                   gerado pelo Nest foi removido, não fazia sentido manter
                                   teste de uma rota que não existe mais.
```

**Regra de nomenclatura de arquivo:** um arquivo, uma responsabilidade — `*.controller.ts`,
`*.service.ts`, `*.repository.ts`, `*.module.ts`, `*.dto.ts` (ver `CONVENTIONS.md`).

Cada módulo replica o padrão de `auth/` e `quotes/` acima — pastas vazias sem conteúdo não
devem existir (ex.: um módulo sem repository próprio simplesmente não tem o arquivo).
