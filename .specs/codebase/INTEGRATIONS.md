# INTEGRATIONS.md — serviços externos

## E-mail transacional (Épico 17)

**Escolha:** Resend ou equivalente. **Não fixado** — decidir ao chegar no épico.

Uso: notificação opcional sobre eventos de orçamento (visualizado, aprovado, recusado,
prestes a expirar — ver DEC-010). Não é canal obrigatório: a entidade `Notification` é
gravada independente do e-mail sair.

## WhatsApp (Épico 16)

**Não há integração de API.** Compartilhamento via `wa.me` com mensagem pré-preenchida
(ver `PROJECT.md` para o texto exato). Sem webhook, sem número de negócio verificado, sem
custo de mensageria. Decisão deliberada (DEC-012, PROJECT.md) — não introduzir a API
oficial do WhatsApp Business sem necessidade concreta e nova (DEC-014).

## Puppeteer / Chromium (Épico 15, DEC-007)

Não é uma API externa de terceiro, mas é uma dependência de infraestrutura pesada o
suficiente para entrar aqui: exige Chromium headless instalado no container de deploy.
Isso é o que amarra o deploy a Render/Railway em vez de serverless (Vercel functions não
suportam o binário do Chromium no runtime).

Template HTML de renderização do orçamento é **compartilhado** entre `public` e `pdf` — não
duplicar o layout entre os dois consumidores.

## Google Play (Épico 22, DEC-013)

Não é integração de runtime, mas afeta prazo: conta de desenvolvedor pessoal exige teste
fechado com 12 testadores por 14 dias consecutivos antes de produção. Confirmar a regra
vigente na documentação oficial antes do épico — ela muda com frequência.
