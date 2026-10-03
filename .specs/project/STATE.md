Última atualização: 2026-10-03
Repositório ativo: orca-api (mas sessão também tocou orca-app, só documentação)
Épico atual: 01 — Setup e Git (concluído) — decisão nova (DEC-016) registrada antes do Épico 10
Task atual: commitar e dar push das mudanças de documentação (DEC-016 e cascata)
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
- Commit feito na develop (9e4f498 "feat: setup NestJS project with empty domain modules").
- Pasta temporária orca-api-scaffold removida.
- `docker build` e `docker run` validados de ponta a ponta nesta sessão: imagem builda,
  container sobe, os 9 módulos inicializam, container parado e removido depois do teste.
- STRUCTURE.md e STACK.md atualizados para refletir a estrutura real.
- Remoto `github.com/Junior500142/orca-api` configurado; `main` e `develop` pushadas.
- **DEC-016 registrada:** orca-app passa a ser distribuído como PWA (Expo Web), não app
  nativo em loja, por ora — motivo é processo/tempo do Google Play (não custo: a taxa é
  única, US$ 25), não a arquitetura do app (DEC-008 continua valendo). DEC-013 anotada como
  parqueada, não revogada. Cascata de documentação atualizada: DECISIONS.md, ROADMAP.md
  (Épicos 10 e 22) e PROJECT.md no orca-api; CLAUDE.md, STACK.md, ARCHITECTURE.md e
  CONCERNS.md (DEBT-004 parqueado, DEBT-005 novo: token em localStorage na web) no orca-app.
Faltando para concluir:
- Commitar e dar push dessas mudanças de documentação nos dois repositórios (nenhum commit
  feito ainda desta rodada — aguardando aprovação).
- CI (GitHub Actions) fica para o Épico 04.5 (walking skeleton), não é escopo do Épico 01.
Decisões tomadas:
- Gerenciador de pacotes: npm (registrado em STACK.md dos dois repos).
- tsconfig strict mode: manter "strict": true apesar do default relaxado do Nest 11 (registrado em STACK.md).
- DEC-016: distribuição do orca-app via PWA (Expo Web), em vez de Google Play, por ora.
Dúvidas em aberto:
- As já conhecidas (DEC-004, DEC-005, DEC-010, definição de "MVP Release") seguem no seu
  épico correspondente. A antiga dúvida sobre topologia de repositório (orca x orca-api/orca-app)
  foi resolvida: dois repositórios, orca-api e orca-app, como já estava documentado.
Próximo passo concreto: aprovar e commitar as mudanças de documentação (DEC-016 e cascata)
nos dois repos, dar push. Com isso, Épico 01 conclui de fato e o próximo é o Épico 02 (SDD
e documentação) ou adiantar 03/04, conforme prioridade do desenvolvedor.
