# TESTING.md — orca-api

## A pergunta que decide se um teste deve existir

> Se este comportamento quebrar em produção, alguém percebe (cliente, dono do negócio, ou
> integridade do dado)?

Se não, o teste não se paga.

## O que testar, e primeiro

1. **Cálculo de orçamento (DEC-002)** — função pura, primeira suíte de testes do projeto.
   Casos: arredondamento por linha, desconto percentual e fixo, quantidade fracionária.
2. **Isolamento multi-tenant (DEC-001)** — todo repository que recebe `companyId` tem
   teste garantindo que dado de outra empresa não vaza.
3. **Máquina de estados do orçamento (DEC-003)** — transições permitidas e proibidas,
   imutabilidade do snapshot de aprovação.
4. **Guards e autenticação** — rota protegida rejeita token ausente/inválido.
5. **Mappers e serialização de DTO** — contrato de saída não vaza campo interno.

## Tipos de teste

| Tipo | Quando | Ferramenta |
|---|---|---|
| Unitário | Service, cálculo, mapper — lógica isolável | Jest |
| Integração | Repository contra banco real (não mockado) | Jest + banco de teste |
| E2E | Fluxo HTTP completo de um caso crítico | Supertest |

## O que não testar

- Configuração estática do Nest (decorators de módulo, DI wiring óbvio).
- Comportamento de framework/lib (Prisma, class-validator fazendo o que documentam fazer).
- "Sobe sem erro" como único teste — se outro teste do arquivo já exercita o código, isso
  já está coberto.

## Estrutura

```
src/quotes/
├── quotes.service.ts
├── quotes.service.spec.ts
└── calculation/
    ├── calculate-quote-total.ts
    └── calculate-quote-total.spec.ts
```

Teste ao lado do arquivo que testa, não em árvore paralela — mais fácil de achar e manter
sincronizado.

## Consolidar em vez de multiplicar

Vários cenários da mesma regra cabem em um `it` com array de casos, não um `it` por
cenário. Ver exemplo equivalente em `orca-app/.specs/codebase/TESTING.md`.
