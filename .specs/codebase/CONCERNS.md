# CONCERNS.md — dívida técnica e áreas frágeis

Cada item: id, impacto, sugestão. Quem toca a área consulta o item antes de "resolver" por
conta própria — muitos destes já são decisão consciente, não descuido.

---

### DEBT-001 — Teto do `Int` para valores monetários

**Impacto:** dinheiro em centavos como `Int` (DEC-002) tem teto de R$ 21.474.836,47. Um
orçamento acima disso quebra ou trunca silenciosamente se não houver validação explícita.

**Sugestão:** validar no service de `quotes` que o total calculado não excede o teto,
retornando erro claro em vez de deixar o `Int` estourar silenciosamente. Reavaliar migração
para `BigInt` só se o público-alvo real do produto mudar (hoje é pequeno negócio — o limite
é aceito conscientemente).

---

### DEBT-002 — Tipos duplicados entre `orca-api` e `orca-app`

**Impacto:** contrato de API (DTO) e tipo consumido pelo app não compartilham definição
(DEC-009, decisão consciente, não package compartilhado). Mudança de contrato só é
detectada em runtime ou pelo mapper do app quebrando, não pelo compilador.

**Sugestão:** manter o mapper na fronteira do app (`orca-app/.specs/codebase/ARCHITECTURE.md`)
como a linha de defesa. Se a dor de sincronização crescer muito, reavaliar (não antes) um
pacote de tipos compartilhado — troca sua simplicidade atual por mais uma dependência de
build entre os dois repos.

---

### DEBT-003 — Lead time de publicação no Google Play (DEC-013)

**Impacto:** conta de desenvolvedor pessoal exige teste fechado com 12 testadores por 14
dias consecutivos antes de produção. Se a conta não for aberta cedo, o Épico 22 atrasa em
pelo menos duas semanas.

**Sugestão:** abrir a conta de desenvolvedor assim que o Épico 13 (página pública)
estiver perto de concluir, mesmo sem app pronto para submeter. Confirmar a regra vigente na
documentação oficial do Play antes de contar com o prazo de 14 dias — ela muda com
frequência e não deve ser assumida como fixa.
