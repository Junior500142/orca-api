# ARCHITECTURE.md — orca-api

## Estilo: Modular Monolith

Simplicidade, separação de responsabilidades, testabilidade, baixo acoplamento. **Não**
microservices sem necessidade concreta. Não introduzir padrão para demonstrar conhecimento
(DEC-014).

## Módulos (um por domínio de negócio)

```
auth · users · companies · customers · products · quotes · notifications · public · pdf
```

Cada módulo é dono dos seus dados e regras. Comunicação entre módulos: injeção de serviço
do módulo importado (Nest module system), nunca acesso direto ao repositório de outro
módulo.

## Camadas dentro de um módulo

```
Controller → Service → Repository
```

- **Controller** — recebe request, valida entrada (DTO + `class-validator`), delega ao
  service, formata resposta. Não tem regra de negócio.
- **Service** — regra de negócio, orquestração, tratamento de erro de domínio.
- **Repository** — acesso ao Prisma. Todo método recebe `companyId` explícito (DEC-001).

**Use cases e domain entities entram se e quando a complexidade justificar**, não por
default (DEC-014). Critério prático: se um service já está fazendo mais de uma coisa
claramente separável e isso dificulta o teste, é sinal de que um use case paga o preço —
não introduza antes disso acontecer de verdade.

## Fluxo de dados de uma requisição típica

```
HTTP Request
  → Guard (extrai companyId do JWT)
  → Controller (valida DTO)
  → Service (regra de negócio)
  → Repository (Prisma, filtrado por companyId)
  → PostgreSQL
```

O desenvolvedor deve conseguir explicar a cadeia `Código → Prisma → SQL → PostgreSQL` para
qualquer query relevante — o ORM não é caixa-preta.

## Isolamento multi-tenant (DEC-001)

Todo método de repositório que lê ou escreve dado de uma empresa recebe `companyId` como
parâmetro explícito. O guard de autenticação é o único lugar que extrai esse valor do JWT.
Nenhum controller ou service deve aceitar `companyId` vindo do corpo da requisição — isso
permitiria a um usuário autenticado forjar acesso a outra empresa.

## Página pública e PDF (DEC-006, DEC-007)

Módulos `public` e `pdf` compartilham o **mesmo template HTML** de renderização do
orçamento. `public` serve esse HTML diretamente (`GET /q/:token`); `pdf` usa Puppeteer para
imprimir o mesmo HTML em PDF. Nunca duplicar o layout entre os dois — é a decisão que
elimina o risco de página e PDF divergirem.

## Sem BFF (DEC-009)

A API é desenhada diretamente para o `orca-app`. Evite endpoints conversadores: o detalhe
de um orçamento retorna em uma chamada, com itens/cliente/empresa aninhados.
