# DECISIONS.md — ADR-lite

Formato por item: **Status**, **Decisão**, **Motivo**, **Alternativas consideradas**. Não
reabra uma decisão fechada sem motivo novo explícito — se houver, aponte-o antes de discutir.

---

## DEC-001 — Isolamento entre empresas (multi-tenancy)

**Status:** decidida.

**Decisão:** `companyId` explícito na assinatura de **todo** método de repositório,
extraído do JWT por um guard. Prisma Client Extension entra no Épico 18 como rede de
segurança adicional, **sem** remover o filtro explícito.

**Motivo:** a extension torna o filtro invisível. Fazer explícito primeiro força o
desenvolvedor a internalizar o problema antes de automatizá-lo — quando a extension
chegar, ela resolve uma dor já vivida, não vira mágica não compreendida. Esta é a decisão
de segurança número um do produto.

**Alternativas consideradas:** Row Level Security do PostgreSQL (enforcement mais forte,
no banco, mas exige gerenciar role/sessão por conexão, o que complica com pooling). Client
Extension desde o início (rejeitada pela razão pedagógica acima).

---

## DEC-002 — Representação de dinheiro

**Status:** decidida.

**Decisão:** inteiros em **centavos**, tipo `Int` no Prisma. Nome do campo carrega a
unidade (`unitPriceCents`, `totalCents`, nunca `price`). Quantidade pode ser fracionária;
`unitPriceCents × quantity` arredonda meio-para-cima **no nível da linha**, antes de somar.
Desconto: `discountType` (`PERCENT` | `FIXED`) + `discountValue`, aplicado sobre o
subtotal, mesmo arredondamento. **O cálculo mora em um único lugar, no backend** — o app
pode calcular para preview instantâneo, mas o valor persistido é sempre o do servidor.
Formatação (R$, vírgula, separador de milhar) é responsabilidade exclusiva da camada de
apresentação (`Intl.NumberFormat`).

**Motivo:** somar frações e arredondar no fim dá resultado diferente de arredondar por
linha, e a linha é o que o cliente vê no PDF — ela precisa fechar. `Decimal` do Prisma
vaza objetos Decimal.js para os DTOs e serializa mal em JSON. Float está fora de questão
(`0.1 + 0.2`).

**Limite conhecido:** teto de `Int` é R$ 21.474.836,47 — suficiente para o público-alvo,
documentado como limite (ver `CONCERNS.md`).

**Alternativas consideradas:** `Decimal` do Prisma, `Float`.

**Nota:** o cálculo de orçamento é candidato natural a função pura e à primeira suíte de
testes unitários do projeto.

---

## DEC-003 — Edição após envio e imutabilidade da aprovação

**Status:** decidida.

**Decisão:** ao editar um orçamento já enviado, o sistema pergunta ao dono se deseja
reenviar para aprovação. **Sim** → status volta para `SENT`, cliente avisado, aprova de
novo. **Não** → dono confirma a decisão, fluxo segue. Em ambos os casos, **a aprovação
anterior é imutável**: no momento da aprovação grava-se um snapshot do que foi aprovado
(itens, valores, condições, total) com data, IP e user agent. O orçamento evolui; a
aprovação não.

**Motivo:** sem o snapshot, um orçamento aprovado em R$ 1.000 e editado para R$ 1.200
passaria a constar como aprovado em R$ 1.200 sem o cliente nunca ter visto — problema
comercial que destrói confiança num produto de orçamento.

**Máquina de estados:**

```
DRAFT → SENT → VIEWED → APPROVED
                    └→ REJECTED
                    └→ EXPIRED
```

Transições de volta (ex.: `APPROVED → SENT` na reedição) e as proibidas: detalhar na spec
do Épico 09.

---

## DEC-004 — Token da página pública

**Status:** **em aberto** — decidir no Épico 04.

**Contexto:** URL adivinhável vaza dados de clientes de terceiros. Opções a avaliar: UUID
v4 como id da entidade, token aleatório separado do id, expiração vinculada à validade do
orçamento, revogação.

---

## DEC-005 — Numeração sequencial por empresa e concorrência

**Status:** **em aberto** — decidir no Épico 04.

**Contexto:** "Orçamento nº 42", sequencial **por empresa**. Dois orçamentos criados
simultaneamente precisam de unicidade garantida. Gancho natural para ensinar transaction,
constraint única composta e condições de corrida.

---

## DEC-006 — Página pública servida pelo backend

**Status:** decidida.

**Decisão:** a página pública é renderizada pelo `orca-api` (`GET /q/:token`), sem conta e
sem login.

**Motivo:** o cliente abre o link pelo WhatsApp sem instalar nada, o que um app nativo não
atende. E o mesmo template HTML é o que o Puppeteer imprime para gerar o PDF — o layout do
orçamento existe em um lugar só, eliminando o risco de página e PDF divergirem.

**Alternativas consideradas:** Next.js separado na Vercel (mais flexível, mas duplicaria o
layout ou acoplaria o backend ao frontend web em runtime, mais um repositório e deploy).

---

## DEC-007 — PDF via Puppeteer

**Status:** decidida.

**Decisão:** geração de PDF com Puppeteer, imprimindo o mesmo HTML da página pública.

**Consequência amarrada:** exige Chromium headless, portanto **deploy em container**
(Render/Railway), não serverless — a Vercel não roda isso no runtime serverless. Amarração
clara desde o início, não descoberta no Épico 14.

**Alternativas consideradas:** pdfkit / react-pdf (deploy trivial, mas layout escrito do
zero, diverge da página pública com o tempo — a dor migra da infra para o código,
recorrente).

---

## DEC-008 — Arquitetura em camadas do app, com motivação declarada

**Status:** decidida.

**Decisão:** o `orca-app` segue o blueprint feature-based integralmente.

**Motivo declarado: aprendizado.** Custo real de 14–18 arquivos por feature; com 7–8
features, mais de 120 arquivos de estrutura de domínio, mais os 17 itens de bootstrap do
`shared/` antes da primeira tela existir. A camada Manager ganha pouco quando o backend é
próprio e a maioria das operações é uma chamada só — a justificativa clássica ("mudança de
contrato da API toca um arquivo") é bem mais forte com API de terceiro. Isso **não** é
argumento para abandonar a arquitetura; é registro honesto de por que foi escolhida.

**Calibragem acordada:** feature `Auth` completa como referência viva → reavaliar
honestamente quais camadas pagaram o preço → `sliceStore` só quando houver estado
compartilhado real.

---

## DEC-009 — Sem BFF

**Status:** decidida.

**Decisão:** API REST única, desenhada para consumo do app.

**Cuidado prático:** evitar API conversadora — detalhe de orçamento volta em **uma**
chamada, com itens/cliente/empresa aninhados, não em três. Tipos duplicados entre os
repos: aceito, **não** resolvido por package compartilhado; o mapper na fronteira do app
absorve mudanças de contrato.

---

## DEC-010 — Push notification dentro ou fora do MVP

**Status:** **em aberto** — decidir antes do Épico 15.

**Contexto:** o app tem tela de notificações, usuário pode optar por e-mail. Entidade
existe independentemente da decisão:

```
Notification: id, companyId, type, quoteId, readAt, createdAt, payload
```

Eventos: orçamento visualizado, aprovado, recusado, prestes a expirar. Sistema grava a
notificação **sempre**; e-mail é canal opcional sobre a mesma entidade. Push nativo exige
Expo Notifications + credenciais FCM + token de device — é épico próprio, não detalhe do
15. **Recomendação registrada:** badge por polling no MVP; push depois.

---

## DEC-011 — Topologia de documentação

**Status:** decidida.

**Decisão:** cada repositório tem seu `.specs/codebase/` e `.specs/features/`. `.specs/project/`
(PROJECT, ROADMAP, DECISIONS, STATE) é **único** e mora no `orca-api`. O `.specs/README.md`
do app aponta para lá.

**Motivo:** duplicar o STATE.md criaria dois estados e mataria o propósito dele — uma
sessão de trabalho é uma só, não uma por repositório.

---

## DEC-012 — "Tenho uma dúvida" na página pública

**Status:** decidida.

**Decisão:** o botão abre `wa.me` do dono com mensagem pré-preenchida referenciando o
número do orçamento. Sem backend, sem tabela, sem endpoint público extra.

**Risco aceito conscientemente:** expõe o telefone do dono a qualquer um com o link — para
pequeno negócio é o mesmo número que já consta no orçamento e no cartão.

**Alternativas consideradas:** salvar a pergunta e notificar (exigiria tabela, endpoint
público com rate limiting, dependeria do épico de notificações).

---

## DEC-013 — Distribuição

**Status:** decidida.

**Decisão:** Android primeiro, via Google Play. iOS fora de escopo; Fastlane e as partes
iOS do blueprint ficam parqueadas, não removidas.

**Pendência de lead time:** contas de desenvolvedor pessoais no Google Play exigem teste
fechado com 12 testadores por 14 dias consecutivos antes de liberar produção — é prazo, não
trabalho, mas descobrir no Épico 22 atrasa duas semanas. Abrir a conta cedo mesmo sem usar,
e **confirmar a regra vigente na documentação do Play** antes do Épico 22, pois ela muda com
frequência.

**Atualização (2026-10-03, ver DEC-016):** a distribuição via Google Play foi parqueada —
mesmo tratamento dado aqui ao iOS — em favor de PWA como canal principal por ora. Esta
decisão **não foi descartada**: continua sendo o plano para quando o produto justificar
app nativo publicado em loja.

---

## DEC-014 — Anti-overengineering com válvula de escape

**Status:** decidida.

**Decisão:** a solução mais simples que preserve qualidade e permita evolução é o
**default**. Não introduzir microservices, CQRS, event sourcing, message broker,
Kubernetes, abstrações excessivas ou padrões complexos sem necessidade real. Conceitos
avançados (DDD, Clean Architecture, Value Objects, Ports and Adapters) são **ensinados
quando o problema encostar neles**, não aplicados por default.

**Válvula de escape:** o desenvolvedor pode solicitar a aplicação de qualquer conceito a
qualquer momento — nesse caso: (1) explique o custo real uma vez, (2) apresente a
alternativa mais simples, (3) mantida a decisão, aplique sem resistência adicional, (4)
registre um DEC novo com "motivação de aprendizado" como razão válida e explícita.

**Motivo do registro:** daqui a três meses não dá para lembrar se um padrão entrou porque o
problema pedia ou porque houve vontade de praticar — essa diferença é o que o desenvolvedor
precisa saber explicar depois. Esta decisão resolve a contradição entre "ensinar Clean
Architecture" e "evitar abstração prematura": sem essa hierarquia explícita, o agente
oscila e o desenvolvedor recebe conselhos inconsistentes.

---

## DEC-015 — Deploy e CI antecipados, com walking skeleton

**Status:** decidida.

**Decisão:** CI/CD e deploy saem do fim do backlog para o começo. Logo após o Épico 04
(banco), inserir um **walking skeleton**: orçamento hardcoded, sem auth, sem clientes, sem
produtos, atravessando `backend → banco → página pública → botão aprovar → status
atualizado → deployado`. Feio de propósito; depois dele, voltar e fazer os épicos direito.

**Motivo:**
- *Prática:* "funciona na minha máquina" acumulado por 17 épicos explode de uma vez,
  justamente quando se quer estar polindo produto.
- *Pedagógica:* environment variables, secrets, build, migration em produção e health check
  só ensinam quando doem, e doem cedo se você deployar cedo.
- *Arquitetural:* sem o skeleton, o produto só roda de ponta a ponta lá pelo Épico 12, e
  cada épico até lá é abstrato.

---

## DEC-016 — Distribuição via PWA (Expo Web), em vez de loja, por ora

**Status:** decidida (2026-10-03).

**Decisão:** o `orca-app` continua sendo construído com Expo/React Native e o blueprint
feature-based (DEC-008 não muda). O que muda é o **alvo de distribuição**: em vez de build
nativo publicado no Google Play, o app é exportado para **Expo Web** e servido como PWA
instalável (manifest + service worker, "Adicionar à tela inicial"), hospedado como site
estático. Não existe loja, não existe review, não existe o teste fechado de 14 dias.

**Motivo:** o custo de loja não é principalmente financeiro — o Google Play cobra uma taxa
única de US$ 25, não assinatura. O custo real é **processo e tempo**: conta de
desenvolvedor, teste fechado de 12 testadores por 14 dias consecutivos (DEC-013), review.
PWA elimina essa dependência por completo, sem exigir trocar de stack: o Expo já compila a
mesma base de código para web ("universal app"), então o reaproveitamento da arquitetura já
documentada (DEC-008, o blueprint inteiro) é quase total.

**Consequências técnicas:**
- `expo-secure-store` não existe na web — cai para `localStorage` (ou cookie). Token em
  `localStorage` é mais exposto a XSS do que o Keychain/Keystore do SO. Risco aceito
  conscientemente para o MVP; revisar se/quando migrar para build nativo (ver `DEBT`
  correspondente em `orca-app/.specs/codebase/CONCERNS.md`).
- EAS Build/Submit e Fastlane ficam parqueados — mesmo tratamento que o blueprint já dava
  ao iOS — não removidos. O caminho para nativo continua existindo no mesmo código: é
  questão de voltar a compilar para os alvos iOS/Android quando fizer sentido.
- Deploy passa a ser hospedagem estática (Vercel, Render ou Netlify — **a decidir no Épico
  10**), não mais EAS/loja.
- Gesto e animação precisam ser validados no navegador, não só em device físico (ajusta
  `TESTING.md` do orca-app).

**Alternativas consideradas:**
- Manter app nativo Android via Google Play (DEC-013 original) — parqueado por ora, não
  descartado; motivo acima.
- Reescrever um frontend web do zero (Next.js, Vite+React) — rejeitado. Descartaria DEC-008
  e o blueprint feature-based inteiro sem necessidade real: o Expo já resolve "rodar em
  web" sem abandonar nada do que já foi decidido. Contradiria DEC-014 (simplicidade como
  default) trocar uma solução já validada por uma reescrita completa para o mesmo
  resultado.

**Relação com DEC-013:** este DEC substitui o *alvo* de distribuição de DEC-013 (loja →
PWA), sem revogar a decisão de que Android é a prioridade sobre iOS. Ver nota em DEC-013.

---

## Pendências de spec (não são DEC, mas não podem se perder)

- **Identidade visual por empresa cliente.** Logo e cores no PDF e na página pública.
  Regras a definir no Épico 06: o que acontece sem logo, o que acontece se a cor deixar o
  texto ilegível, quais campos são customizáveis. Influencia o Épico 14.
- **Tema do app.** A *estrutura* (`TTheme.ts`, `theme.ts`, `emotion.d.ts`, cor por `keyof
  TColors`, zero hex solto) é regra. Os *valores* (paleta, tipografia, espaçamentos, raios)
  são provisórios até a identidade visual do Orça ser definida.
- **Duas identidades visuais coexistem:** a do produto (tema do app) e a de cada empresa
  cliente (dado do banco, aplicado no template do orçamento). Sistemas separados.
- **Modelagem detalhada do banco:** em aberto, Épico 04.
- **Definição de "MVP Release":** publicado na loja vs. APK/teste fechado — decidir antes
  do Épico 22.
