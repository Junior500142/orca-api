Última atualização: 2026-09-29
Repositório ativo: orca-api
Épico atual: 01 — Setup e Git
Task atual: validar o Dockerfile (bloqueado, ver abaixo) e revisar/commitar o setup
Status: em andamento
Feito nesta sessão:
- Gerenciador de pacotes decidido: npm (motivo em DECISIONS.md / STACK.md).
- `nest new` rodado em pasta temporária, mesclado em orca-api/ preservando .git, .specs, CLAUDE.md.
- package.json renomeado para "orca-api"; npm install rodado, 0 vulnerabilidades.
- tsconfig.json corrigido para "strict": true (Nest 11 gera parcial: noImplicitAny false por default).
- .gitignore e .dockerignore criados (não vêm com --skip-git).
- App de exemplo (AppController/AppService, teste e2e "Hello World") removido.
- 9 módulos de domínio gerados via `nest g module` (auth, users, companies, customers,
  products, quotes, notifications, public, pdf) — cascas vazias, já registradas em app.module.ts.
- src/main.ts corrigido (`void bootstrap()`) para o warning de floating promise do lint.
- Dockerfile multi-stage (node:22-alpine) criado.
- Build, lint e `start:dev` validados localmente — 0 erros, app sobe e escuta na porta 3000.
- STRUCTURE.md e STACK.md atualizados para refletir a estrutura real.
Faltando para concluir:
- **Bloqueado, depende do desenvolvedor:** validar o Dockerfile com `docker build` — Docker
  Desktop não estava rodando nesta máquina no momento da sessão. Rodar
  `docker build -t orca-api:dev .` na raiz do orca-api assim que o Docker Desktop estiver
  ativo, e reportar se algo quebrar.
- Revisar o diff completo (nada foi commitado ainda) e aprovar o commit.
- CI (GitHub Actions) fica para o Épico 04.5 (walking skeleton), não é escopo do Épico 01.
Decisões tomadas:
- Gerenciador de pacotes: npm (registrado em STACK.md dos dois repos).
- tsconfig strict mode: manter "strict": true apesar do default relaxado do Nest 11 (registrado em STACK.md).
Dúvidas em aberto:
- Nenhuma nova. As já conhecidas (DEC-004, DEC-005, DEC-010, definição de "MVP Release") seguem no seu épico correspondente.
Próximo passo concreto: você validar o `docker build` localmente; depois disso, revisar o
diff e aprovar o commit do Épico 01. Com o commit feito, o próximo épico é o 02 (SDD e
documentação) ou já adiantar o 03/04 conforme prioridade sua.
