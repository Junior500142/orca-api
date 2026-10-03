# PROJECT.md — Orça

## O que é

SaaS B2B para criação, envio e acompanhamento de orçamentos profissionais.

> Permitir que pequenos negócios criem um orçamento profissional em poucos segundos, enviem
> pelo WhatsApp e acompanhem sua visualização, aprovação ou recusa.

Objetivo do produto: **transformar orçamento em venda**. Simples, rápido, fácil de usar.

## Objetivo duplo do projeto

1. **Produto** — MVP real, com potencial de comercialização.
2. **Educacional** — formação prática em engenharia de software. O desenvolvedor termina
   sabendo explicar arquitetura, decisões técnicas, fluxo de dados, responsabilidades de
   cada classe, modelagem do banco, APIs, autenticação, testes, segurança, deploy e
   trade-offs — não apenas com software funcionando.

Ver `CLAUDE.md` para como isso se traduz em comportamento do agente durante o projeto.

## Capacidades do MVP

- cadastro de usuários
- configuração de empresa (dados, logo, identidade visual)
- clientes
- produtos e serviços
- criação de orçamentos, cálculo de valores
- página pública do orçamento, com rastreamento de visualização
- aprovação e recusa
- histórico
- notificações (in-app + e-mail opcional)
- geração e download de PDF
- compartilhamento via WhatsApp

## Fluxo principal

```
Cliente solicita orçamento
        ↓
Empresário cria orçamento no app
        ↓
Sistema gera o orçamento
        ↓
Página online pública + PDF
        ↓
Envio pelo WhatsApp
        ↓
Cliente visualiza (sem conta, sem login)
        ↓
Cliente aprova ou recusa
        ↓
Sistema atualiza o status
        ↓
Empresário é notificado
```

## Página pública

O cliente final **não cria conta**. Servida pelo `orca-api` (ver DEC-006 em
`DECISIONS.md`). Mostra: empresa, logo, cliente, número do orçamento, data, validade, itens,
quantidades, preços, desconto, total, condições, prazo, observações.

Ações disponíveis: **Aprovar** · **Recusar** · **Tenho uma dúvida** (ver DEC-012).

## PDF

Exportável para todo orçamento, com identidade visual da empresa. Mesmos campos da página
pública, mais dados de contato da empresa. É **alternativa** ao link, não o fluxo principal
— o link permite tracking, visualização, aprovação e histórico, o PDF não. Gerado via
Puppeteer imprimindo o mesmo template HTML da página pública (DEC-006, DEC-007).

## WhatsApp

Canal central do produto. Solução simples: compartilhamento de link, mensagem automática:

```
Olá, {cliente}!
Preparei seu orçamento no valor de {total}.
Você pode visualizar os detalhes e aprovar pelo link:
{link}
```

Sem integração oficial complexa com a API do WhatsApp — não há necessidade concreta no MVP.

## Fora de escopo do MVP

Emissão de nota fiscal, integração bancária, estoque, contas a pagar, contabilidade, ERP,
integração oficial complexa com WhatsApp, app iOS, IA, marketplace. Se surgir solicitação
relacionada, avalie se pertence ao MVP antes de aceitar (ver DEC-014, anti-overengineering).

## Topologia

Dois repositórios, sem BFF:

```
orca-api   NestJS. API REST + página pública do orçamento + geração de PDF.
orca-app   React Native / Expo. App do dono do negócio, distribuído como PWA (DEC-016) —
           mesma base de código Expo mantém aberto o caminho para app nativo Android depois.
```

A página pública é web e vive no `orca-api` porque o cliente final abre um link pelo
WhatsApp sem instalar nada e sem criar conta — um app nativo não atende esse caso.
