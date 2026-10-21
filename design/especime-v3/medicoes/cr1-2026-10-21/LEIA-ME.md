# CR1-b, o sítio: as linhas do Eurostat de 2024 revistas e a oração do PRR no item da Saúde (21.10.2026)

*Construtor: Claude Opus 5.5 (`construtor`, `high`). Worktree `cr1-2026-10-21`, de `main` 8bbb63978. O motor lido na cabeça b34a675 do CR1-a, sem nenhum commit no motor. Os registos das corridas ficaram fora do repositório; aqui ficam só os códigos, em `codigos/`.*

## O que mudou para o leitor

1. **As trinta linhas `despesa-por-funcao-2024-gf01..gf10-{pt,es,ue}`** foram exportadas pelo manifesto do OE1 (o exportador do motor com `--write`, código 0; 30 alteradas, 156 inalteradas). Duas mudaram de valor: `despesa-por-funcao-2024-gf01-ue` de 6,1 para 6,0 e `despesa-por-funcao-2024-gf10-ue` de 19,6 para 19,5, cada uma com a entrada `atualizacao` de 2026-10-21 e a razão do mandato nas duas línguas. As outras vinte e oito mudaram só o `access_date` (2026-10-21) e o excerto (o `updated` novo, 2026-10-21T23:00:00+0200).
2. **O registo público.** As duas histórias do valor ficaram seladas em `ledger/historias-valores.json` por `scripts/selar-historia-valores.mjs` (o `ledger:check` recusava-as sem selo). A página «O que mudou» (`/correcoes`, `/en/corrections`) passa a listar, a 21.10.2026, sob «União Europeia», as duas atualizações: «Despesa pública em serviços gerais das administrações públicas, em percentagem do PIB, União Europeia 6,1 → 6,0 % do PIB» e «Despesa pública em proteção social, em percentagem do PIB, União Europeia 19,6 → 19,5 % do PIB», com a razão do mandato e o rótulo «atualização» («update» em inglês). O contador público `correcoes-publicadas` não se mexeu: a linha continua a valer 12 e o seu ficheiro não foi tocado, porque uma atualização não é um erro. A leitura da semana (`/explicacoes/leitura-da-semana`, `/en/explainers/weekly-reading`) lista as mesmas duas revisões («de 6,1 para 6,0, a fonte reviu para baixo, em 21.10.2026»).
3. **O lugar das duas linhas.** A construção fechava em `/correcoes` («a linha mudou e nenhuma declaração diz de que lugar é»); as duas linhas entraram em `src/data/lugar-das-linhas.mjs` como `uniao-europeia`, com a razão.
4. **A oração do PRR no item da Saúde**, como o `dist/` a imprime:
   - PT: «Sem o PRR, o Plano de Recuperação e Resiliência, a despesa efetiva consolidada passa de 17 291,3 para 17 803,1, 3,0 %. Em 2027 o quadro tem o mesmo valor com e sem o PRR, 17 803,1 milhões de euros: a coluna sem o PRR não retira nada nesse ano.»
   - EN: «Without the RRP, the Recovery and Resilience Plan, consolidated effective expenditure goes from 17 291,3 to 17 803,1, 3,0 %. In 2027 the table has the same value with and without the PRR, 17 803,1 million euros: the column without the PRR takes nothing out in that year.»

## As decisões pequenas, anotadas

- **A gramática do item tem `compara`.** Os itens resolvem-se por `resolverExplicacao` (`src/lib/explicacoes.mjs`), que aceita `{ compara: [a, b], maior, menor, igual }` com os três ramos obrigatórios. A guarda compara `oe-2027-saude-despesa-efetiva-consolidada-2027` com `oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2027`; `igual` rende «o mesmo valor» / «the same value», `maior` e `menor` rendem «um valor diferente» / «a different value». Os ramos são listas, porque a auditoria das palavras compara a estrutura das duas edições folha a folha.
- **O ano entra por `{ periodo }`.** A gramática recusa algarismos nas palavras fixas («os algarismos entram por { claim } ou { periodo }»), e «Em 2027» escrito à letra fechava a construção; o ano é o `reference_date` da linha sem PRR, e rende o mesmo «2027».
- **A auditoria das palavras** (`tests/discussao/palavras.json`) recebeu as sete folhas novas, classe «leitura», apoiadas no `reference_date` e nos excertos das duas linhas de 2027 (o excerto é o mesmo nas duas, e diz «17 803,1 17 803,1»).
- **O inventário das frases** recebeu o bloco `cr1`: as duas declarações do parágrafo da Saúde (PT e EN) foram substituídas pelos parágrafos completos que o portão da voz recolheu do HTML, e `REVISOES-DO-INVENTARIO.md` tem a entrada `cr1`, por ler.

## O que fica aberto

- **CR1-1, a explicação de 2026.** O mandato diz que a explicação de 2026 (`dinheiro-do-estado-2026`) cita as linhas da União. No `dist/` construído, as páginas `explicacoes/dinheiro-do-estado-2026/index.html` e `en/explainers/dinheiro-do-estado-2026/index.html` não trazem nenhum dos ids `despesa-por-funcao-2024-gf01-ue` e `gf10-ue` nem os valores 6,1, 6,0, 19,6 e 19,5 (o mesmo extrator encontrou-os em `correcoes` e em `leitura-da-semana`, o conhecido-positivo). Nenhuma frase dessa explicação mudou; as páginas do `dist/` que trazem a linha `gf01-ue` são `correcoes`, `leitura-da-semana`, `livro-razao`, a página da própria linha e `indice`, nas duas edições. O lugar de direção confere onde a explicação de 2026 cita a União.
- **CR1-2, «PRR» na edição inglesa.** O mandato escreve «the PRR» na oração inglesa, e implementou-se à letra; o resto do item inglês diz «the RRP». O lugar de direção decide se a oração inglesa passa a «the RRP».
- **CR1-3, o ramo «um valor diferente».** A guarda muda só as palavras do ramo; se as duas linhas de 2027 deixassem de ser iguais, a oração diria «um valor diferente com e sem o PRR, … milhões de euros: a coluna sem o PRR não retira nada nesse ano», e a última parte deixava de ser verdadeira. Hoje os valores são iguais e o ramo não se rende; a guarda inteira da oração (um `se` sobre toda ela, ou o fim dentro do ramo `igual`) é decisão do lugar de direção.
- **A construção correu duas vezes**, contra a «uma vez» do mandato: a primeira fechou em `/correcoes` (o lugar das duas linhas, código 1 em 13 s); a segunda fechou no `check:voz` (o inventário, código 1 em 293 s), depois de o Astro, os cartões, o `gate:html` e as conferências anteriores ao `check:voz` passarem, com o `dist/` completo. O `check:voz` corrido sozinho depois da correção deu 0; os passos da construção que vêm depois dele (`check:nomes`, `check:lingua`, `check:formato`, `check:navegacao`, `sinais`, `check:discussao`) estão todos na lista do `verify` abaixo. O ficheiro `codigos/build.code` guarda o código da segunda corrida.
- Sem capturas nesta passagem, por mandato.

## As conferências do ponto 7, antes do `verify`

O código lido de cada ficheiro, depois das correções (o `check:discussao` e o `check:explicacoes` precisam do `dist/` e voltam a correr na lista do `verify`):

| Conferência | Código |
|---|---|
| `ledger-check` | 0 |
| `check-cruzamento-with-origin` | 0 |
| `check-registo` | 0 |
| `check-discussao` | 1 |
| `check-explicacoes` | 1 |
| `check-voz` | 0 |
| `typecheck` | 0 |
| `build` | 1 |

## A lista do `verify`, passo a passo

Os 50 passos de `scripts.verify` do `package.json`, cada um corrido sozinho com `RESEARCHHUB_DIR` na worktree do motor do CR1-a, pela ordem do `package.json`:

| Passo | Ficheiro | Código |
|---|---|---|
| `npm run ledger:check` | `codigos/verify-ledger-check.code` | 0 |
| `npm run check:registo` | `codigos/verify-check-registo.code` | 0 |
| `npm run check:cruzamento` | `codigos/verify-check-cruzamento.code` | 0 |
| `npm run check:documentos` | `codigos/verify-check-documentos.code` | 0 |
| `npm run check:briefs` | `codigos/verify-check-briefs.code` | 0 |
| `npm run check:leituras` | `codigos/verify-check-leituras.code` | 0 |
| `npm run gate:html` | `codigos/verify-gate-html.code` | 0 |
| `npm run check:css` | `codigos/verify-check-css.code` | 0 |
| `npm run check:datas` | `codigos/verify-check-datas.code` | 0 |
| `npm run check:moldura` | `codigos/verify-check-moldura.code` | 0 |
| `npm run check:alvos` | `codigos/verify-check-alvos.code` | 0 |
| `npm run check:cabeca` | `codigos/verify-check-cabeca.code` | 0 |
| `npm run check:fontes` | `codigos/verify-check-fontes.code` | 0 |
| `npm run check:cadeia` | `codigos/verify-check-cadeia.code` | 0 |
| `npm run check:dados` | `codigos/verify-check-dados.code` | 0 |
| `npm run mapa:unidades -- --verifica` | `codigos/verify-mapa-unidades-verifica.code` | 0 |
| `npm run check:mapa` | `codigos/verify-check-mapa.code` | 0 |
| `npm run check:regioes` | `codigos/verify-check-regioes.code` | 0 |
| `npm run check:areas` | `codigos/verify-check-areas.code` | 0 |
| `npm run check:formas` | `codigos/verify-check-formas.code` | 0 |
| `npm run check:alcance` | `codigos/verify-check-alcance.code` | 0 |
| `npm run check:lugares` | `codigos/verify-check-lugares.code` | 0 |
| `npm run check:pais` | `codigos/verify-check-pais.code` | 0 |
| `npm run check:pais:auto-teste` | `codigos/verify-check-pais-auto-teste.code` | 0 |
| `npm run check:voz` | `codigos/verify-check-voz.code` | 0 |
| `npm run check:lingua` | `codigos/verify-check-lingua.code` | 0 |
| `npm run check:formato` | `codigos/verify-check-formato.code` | 0 |
| `npm run check:lugar` | `codigos/verify-check-lugar.code` | 0 |
| `npm run provar:eyetext` | `codigos/verify-provar-eyetext.code` | 0 |
| `npm run provar:guardas` | `codigos/verify-provar-guardas.code` | 0 |
| `npm run check:mortos` | `codigos/verify-check-mortos.code` | 0 |
| `npm run check:indice` | `codigos/verify-check-indice.code` | 0 |
| `npm run check:cartao` | `codigos/verify-check-cartao.code` | 0 |
| `npm run check:navegacao` | `codigos/verify-check-navegacao.code` | 0 |
| `npm run check:primeira` | `codigos/verify-check-primeira.code` | 0 |
| `npm run sinais` | `codigos/verify-sinais.code` | 0 |
| `npm run check:nomes` | `codigos/verify-check-nomes.code` | 0 |
| `npm run check:palavras` | `codigos/verify-check-palavras.code` | 0 |
| `npm run design:feixe` | `codigos/verify-design-feixe.code` | 0 |
| `npm run check:privacidade` | `codigos/verify-check-privacidade.code` | 0 |
| `npm run check:sugestoes` | `codigos/verify-check-sugestoes.code` | 0 |
| `npm run check:rotulos` | `codigos/verify-check-rotulos.code` | 0 |
| `npm run check:series` | `codigos/verify-check-series.code` | 0 |
| `npm run check:indice-do-sitio` | `codigos/verify-check-indice-do-sitio.code` | 0 |
| `npm run check:explicacoes` | `codigos/verify-check-explicacoes.code` | 0 |
| `npm run check:frases-compostas` | `codigos/verify-check-frases-compostas.code` | 0 |
| `npm run check:incorporar` | `codigos/verify-check-incorporar.code` | 0 |
| `npm run check:discussao` | `codigos/verify-check-discussao.code` | 1 |
| `npm run check:eo1` | `codigos/verify-check-eo1.code` | 0 |
| `npm run check:graficos` | `codigos/verify-check-graficos.code` | 0 |

Passos vermelhos: `verify-check-discussao`.

### `verify-check-discussao` (código 1), as últimas trinta linhas

```

> o-estado-do-pais@0.1.0 check:discussao
> node tests/discussao/itens.mjs

node:internal/modules/run_main:123
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: O controlo com sufixo foi recusado

1 !== 0

    at plantasDosSelosConstruidos (file://<sítio>/tests/discussao/planta-selos.mjs:30:16)
    at async file://<sítio>/tests/discussao/itens.mjs:369:15 {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: 1,
  expected: 0,
  operator: 'strictEqual',
  diff: 'simple'
}

Node.js v22.23.1
```


## O custo

Chamadas de ferramenta desta passagem, pelo meu registo: 55 (orçamento 60). Símbolos: o total cumulativo lê-o o lançador do agente; não está num ficheiro a que esta passagem chegue.
