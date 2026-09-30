# DOMAIN.md — mapa de módulos

| Módulo | Responsabilidade | Depende de |
|---|---|---|
| `auth` | Registro, login, hash de senha, emissão/validação de JWT, guard que extrai `companyId`. | `users` |
| `users` | Usuário do sistema (dono do negócio), vínculo com `companies`. | — |
| `companies` | Dados da empresa, logo, identidade visual. Unidade de isolamento multi-tenant (DEC-001). | — |
| `customers` | Clientes de cada empresa. Isolado por `companyId`. | `companies` |
| `products` | Produtos/serviços de cada empresa. Isolado por `companyId`. | `companies` |
| `quotes` | Orçamentos: criação, cálculo (DEC-002), máquina de estados (DEC-003), numeração sequencial (DEC-005). | `companies`, `customers`, `products` |
| `notifications` | Entidade `Notification` (DEC-010), eventos de orçamento, e-mail opcional. | `quotes` |
| `public` | Página pública do orçamento, sem autenticação (DEC-006). Resolve token (DEC-004). | `quotes` |
| `pdf` | Geração de PDF via Puppeteer, reusa o template de `public` (DEC-007). | `public` |

## Por que esse recorte

Um módulo por domínio de negócio, não por tipo técnico — não existe módulo "utils" ou
"common" com regra de negócio dentro. Utilitário agnóstico de domínio vive em
`src/shared/`, e `shared/` nunca conhece um módulo de domínio.

## Fronteira mais sensível: `companyId`

`companies` é o módulo cuja chave (`companyId`) atravessa quase todos os outros como
parâmetro de isolamento. Qualquer novo módulo que leia ou escreva dado pertencente a uma
empresa precisa dessa mesma disciplina (DEC-001) — isso não é opcional nem specific de um
módulo, é regra transversal.
