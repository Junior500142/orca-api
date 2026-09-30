# ROADMAP.md

Ordem revisada por DEC-015 (walking skeleton antecipado). Não crie tasks fora desta ordem
sem explicar o motivo. Onde a informação ainda não existe, a task diz "a detalhar na spec
do épico" em vez de inventar.

Cada épico ganha sua spec própria em `.specs/features/<épico>-<slug>/spec.md` (orca-api) ou
equivalente no orca-app quando for iniciado — este roadmap lista o que cada épico cobre e o
critério de conclusão, não os detalhes de implementação.

---

## 00 — Fundação documental ✅ (esta sessão)

- [x] Criar `orca-api` e `orca-app`, `develop` a partir de `main`.
- [x] `CLAUDE.md` curto nos dois repos.
- [x] `.specs/project/` completo no `orca-api` (este conjunto de arquivos).
- [x] `.specs/codebase/` nos dois repos.
- [x] Blueprint arquivado no `orca-app`.

**Critério de verificação:** ver checklist de validação no prompt de bootstrap original —
repos existem, CLAUDE.md's cabem em ~1,5 tela, DECISIONS.md tem as 15 decisões.

## 01 — Setup e Git

- [ ] `nest new orca-api` (ou equivalente), TypeScript strict.
- [ ] Decidir e fixar gerenciador de pacotes (npm/pnpm/yarn) — **em aberto**, não definido
      no prompt de bootstrap.
- [ ] Fixar versões de Node e Nest em `STACK.md`.
- [ ] ESLint + Prettier.
- [ ] Estrutura de módulos vazia: `auth, users, companies, customers, products, quotes,
      notifications, public, pdf`.
- [ ] Dockerfile mínimo.
- [ ] Primeiro commit em `develop`, PR para revisão do próprio setup.

**Critério de verificação:** `npm run start:dev` sobe a aplicação, lint e typecheck
passam, container builda localmente.

## 02 — SDD e documentação

- [ ] Confirmar fluxo Spec-Driven Development na prática com a primeira feature real.
- [ ] Template de spec de feature (`spec.md`, `tasks.md`, `implementation-notes.md`).

**Critério de verificação:** template usado ao menos uma vez sem exigir retrabalho de
formato.

## 03 — Arquitetura Backend

- [ ] Confirmar módulos do monolito modular e as camadas controller → service →
      repository.
- [ ] Decidir critério explícito para quando introduzir use case / domain entity (DEC-014).

**Critério de verificação:** `ARCHITECTURE.md` reflete decisão tomada, não aspiração.

## 04 — Banco de dados

- [ ] Modelagem detalhada — **em aberto**, a detalhar nesta spec.
- [ ] Resolver DEC-004 (token da página pública).
- [ ] Resolver DEC-005 (numeração sequencial + concorrência).
- [ ] Schema Prisma inicial, primeira migration.

**Critério de verificação:** migration roda limpa, `DEC-004` e `DEC-005` viram DEC com
status "decidida".

## 04.5 — Walking skeleton + CI/CD + deploy (DEC-015, antecipado)

- [ ] Orçamento hardcoded, sem auth, sem clientes, sem produtos.
- [ ] `backend → banco → página pública → botão aprovar → status atualizado`.
- [ ] Pipeline CI (lint, typecheck, testes) no GitHub Actions.
- [ ] Deploy em container (Render ou Railway) funcionando em produção com este esqueleto.

**Critério de verificação:** URL pública em produção mostra o orçamento hardcoded e o botão
aprovar muda o status, deployado via pipeline automatizado.

## 05 — Autenticação

- [ ] Módulo `auth`: registro, login, hash de senha, JWT.
- [ ] Guard que extrai `companyId` do token (base do DEC-001).

**Critério de verificação:** rota protegida rejeita requisição sem token válido; guard
disponibiliza `companyId` ao controller.

## 06 — Onboarding da empresa

- [ ] Módulo `companies`: dados, logo, identidade visual.
- [ ] Resolver pendência de spec: regras de logo/cor ausentes (ver `DECISIONS.md`).

**Critério de verificação:** empresa criada, editável, campos de identidade visual
persistidos.

## 07 — Clientes

- [ ] Módulo `customers`, isolado por `companyId` (DEC-001).

**Critério de verificação:** CRUD completo, teste de isolamento entre empresas.

## 08 — Produtos e serviços

- [ ] Módulo `products`, isolado por `companyId`.

**Critério de verificação:** CRUD completo, teste de isolamento entre empresas.

## 09 — Orçamentos

- [ ] Módulo `quotes`: criação, cálculo (DEC-002), máquina de estados (DEC-003).
- [ ] Detalhar transições de estado permitidas e proibidas (DEC-003 deixa isso pendente).
- [ ] Testes unitários do cálculo — primeira suíte de testes do projeto.

**Critério de verificação:** cálculo de linha e total bate com os casos de teste definidos
na spec; transição de estado inválida é rejeitada.

## 10 — App: bootstrap + shared/ + tema provisório

Ver roadmap do `orca-app` (a criar quando este épico começar) — cobre os itens 1–16 do
checklist de bootstrap do blueprint.

## 11 — App: feature Auth como referência viva

Feature completa, todas as camadas, para calibrar DEC-008 nas features seguintes.

## 12 — App: demais features de domínio

`Company, Customers, Products, Quotes, Notifications, Profile` — aplicando a calibragem de
DEC-008.

## 13 — Página pública (backend)

- [ ] `GET /q/:token`, template HTML compartilhado com o PDF (DEC-006).

**Critério de verificação:** link abre sem login, mostra todos os campos da Seção "Página
pública" do `PROJECT.md`.

## 14 — Aprovação e recusa

- [ ] Ações da página pública, atualização de status, snapshot de aprovação (DEC-003).
- [ ] Depende da pendência de spec de identidade visual (Épico 06).

**Critério de verificação:** aprovar grava snapshot imutável com data/IP/user agent;
editar orçamento aprovado não altera o snapshot.

## 15 — PDF

- [ ] Puppeteer imprimindo o template da página pública (DEC-007).

**Critério de verificação:** PDF e página pública nunca divergem visualmente para o mesmo
orçamento.

## 16 — WhatsApp

- [ ] Geração de link + mensagem automática (ver `PROJECT.md`).
- [ ] Resolver DEC-010 antes deste épico, se push notification depender de decisão anterior.

**Critério de verificação:** link `wa.me` abre com mensagem pré-preenchida e link correto.

## 17 — Notificações

- [ ] Entidade `Notification` (ver DEC-010).
- [ ] E-mail opcional sobre a mesma entidade.

**Critério de verificação:** evento (visualizado/aprovado/recusado/expirando) gera
notificação persistida; e-mail dispara só se habilitado.

## 18 — Segurança

- [ ] Prisma Client Extension como rede de segurança sobre DEC-001, sem remover o filtro
      explícito.
- [ ] Revisão de validação, autorização, exposição de dados.

**Critério de verificação:** query que "esquece" `companyId` ainda assim não vaza dado
entre empresas.

## 19 — Testes

- [ ] Cobertura de comportamento importante nos módulos já implementados.

**Critério de verificação:** ver `TESTING.md` para o que testar/não testar.

## 20 — Observabilidade

- [ ] Logging estruturado, health checks.

**Critério de verificação:** a detalhar na spec do épico.

## 21 — Polimento

- [ ] A detalhar na spec do épico, conforme dívida acumulada em `CONCERNS.md`.

## 22 — MVP Release

- [ ] Resolver definição de "MVP Release" (publicado na loja vs. teste fechado) — **em
      aberto**.
- [ ] Confirmar regra vigente de lead time do Google Play (DEC-013).

**Critério de verificação:** a detalhar quando a definição acima for resolvida.
