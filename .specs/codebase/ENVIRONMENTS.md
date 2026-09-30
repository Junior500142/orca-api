# ENVIRONMENTS.md — orca-api

## Ambientes

| Ambiente | Origem | Deploy |
|---|---|---|
| development | local, `feature/*` | `docker-compose up`, Postgres local |
| staging | `release/*` | container em Render/Railway, banco separado |
| production | `main` | container em Render/Railway |

**AWS não é requisito** — Render/Railway resolvem o container por conta do Puppeteer
(DEC-007), sem gerenciar infra própria.

## Variáveis de ambiente

`.env.template` versionado; `.env` real fora do git. Nenhum segredo real em variável
exposta ao cliente — não há variável "pública" no backend como há no app (aqui tudo é
servidor).

Variáveis previstas (nomes exatos a confirmar no Épico 01/04):

```
DATABASE_URL
JWT_SECRET
JWT_EXPIRATION
RESEND_API_KEY (ou equivalente de e-mail — Épico 17)
PORT
NODE_ENV
```

## CI/CD (walking skeleton, DEC-015)

Pipeline GitHub Actions a partir do Épico 04.5:

```
lint → typecheck → test → build imagem Docker → deploy (staging automático, production manual)
```

Migration em produção: **nunca automática sem confirmação explícita** — ver `CLAUDE.md`,
seção de ações que exigem aprovação.

## Health check

A detalhar no Épico 20 (Observabilidade). Endpoint mínimo esperado: `GET /health`
verificando conexão com o banco.
