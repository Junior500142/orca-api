# CONVENTIONS.md — orca-api

## Nomenclatura de arquivo

| Tipo | Padrão | Exemplo |
|---|---|---|
| Controller | `<domínio>.controller.ts` | `quotes.controller.ts` |
| Service | `<domínio>.service.ts` | `quotes.service.ts` |
| Repository | `<domínio>.repository.ts` | `quotes.repository.ts` |
| Module | `<domínio>.module.ts` | `quotes.module.ts` |
| DTO | `<ação><Entidade>.dto.ts` | `create-quote.dto.ts` |
| Guard | `<propósito>.guard.ts` | `jwt-auth.guard.ts` |
| Teste | `<alvo>.spec.ts` | `quotes.service.spec.ts` |

## Nomenclatura de dinheiro (DEC-002)

Todo campo monetário termina em `Cents` e é `Int`: `unitPriceCents`, `totalCents`,
`discountValueCents` (quando `discountType` for `FIXED`). Nunca `price`, `total`, `value`
sem o sufixo — o nome precisa deixar a unidade óbvia no ponto de uso.

## DTOs

- Um DTO de entrada por ação (`CreateQuoteDto`, `UpdateQuoteDto`), validado com
  `class-validator`.
- DTO de saída nunca expõe campo interno que não faz sentido para o consumidor (ex.:
  não vaze `companyId` de volta quando o cliente já é dono do contexto autenticado).
- DTO não é a entidade do Prisma. Se o formato de saída precisa mudar por causa da UI do
  app, o DTO muda — a entidade do banco não necessariamente muda junto.

## Imports

Ordem: módulos do Nest/terceiros → módulos internos de outro domínio (via módulo
exportado, nunca acesso direto a arquivo interno) → módulo local.

## Variáveis e funções

- `camelCase` para variáveis, funções, métodos.
- `UPPER_SNAKE_CASE` para constantes estáticas.
- Handler/método assíncrono de ação de negócio nomeado pelo verbo: `createQuote`,
  `approveQuote`, não `handleCreate`.
- Booleano com prefixo de predicado: `isExpired`, `hasDiscount`.
- Nunca nome de uma letra.

## Extensões

`.ts` para tudo neste projeto — não há JSX no backend.

## Comentários

Sem comentário explicando o que o código faz. Racional de decisão vive em `.specs/`. Um
comentário só se justifica para um workaround não óbvio de uma lib externa ou uma
invariante que não seria óbvia lendo o código.
