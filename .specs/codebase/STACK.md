# STACK.md — orca-api

| Camada | Escolha | Versão |
|---|---|---|
| Runtime | Node.js | 22.14.0 (LTS instalada na máquina de desenvolvimento) |
| Framework | NestJS | **a fixar ao rodar `nest new`** |
| Linguagem | TypeScript (`strict: true`) | Nest 11 gera `tsconfig.json` com strict parcial por padrão (`noImplicitAny: false`); trocado para `"strict": true` no Épico 01 para manter a decisão já registrada aqui. |
| Gerenciador de pacotes | **npm** — decidido no Épico 01. Motivo: zero setup extra, é o que a documentação oficial do Nest usa, alinhado com DEC-014 (simplicidade como default). | 11.6.0 |
| Banco | PostgreSQL | **a fixar no Épico 04** |
| ORM | Prisma | **a fixar no Épico 04** |
| PDF | Puppeteer (Chromium headless) | **a fixar no Épico 15** |
| E-mail | Resend ou equivalente transacional | **a decidir no Épico 17** |
| Container | Docker | — |
| CI | GitHub Actions | — |
| Deploy | Render ou Railway (container, não serverless) | — |

**AWS não é requisito.**

## Regra de dependência nova

Antes de adicionar uma lib, verifique se o Nest ou uma lib já usada resolve. Dependência
nova exige justificativa registrada (ver `CONCERNS.md` se ela adicionar risco de upgrade).

## Por que versões não estão fixadas ainda

Este arquivo é gerado no Épico 00 (Fundação documental), antes de qualquer `npm install`
real (Épico 01). Fixar uma versão aqui sem instalar nada seria supor — o próprio prompt de
bootstrap do projeto proíbe isso ("não avance com suposição relevante"). Atualize esta
tabela assim que o Épico 01 rodar.
