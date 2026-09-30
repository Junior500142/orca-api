# STACK.md — orca-api

| Camada | Escolha | Versão |
|---|---|---|
| Runtime | Node.js | **a fixar no Épico 01** — use a LTS ativa no momento do setup |
| Framework | NestJS | **a fixar no Épico 01** |
| Linguagem | TypeScript (`strict: true`) | acompanha a versão do Nest |
| Gerenciador de pacotes | **a decidir no Épico 01** (npm / pnpm / yarn) | — |
| Banco | PostgreSQL | **a fixar no Épico 01** |
| ORM | Prisma | **a fixar no Épico 01** |
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
