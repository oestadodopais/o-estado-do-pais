# ND1: a marca de ausência da fonte

> Relatório histórico da ND1 e da adenda A. A atribuição à fonte no recibo da linha calculada foi corrigida pela [adenda B](relatorio-nd1-b.md); as cópias abaixo documentam a construção anterior a essa correção.

O build completo da adenda A terminou com código 0. A linha inglesa do inventário passou a «The source publishes « N.d. » instead of a value.», segundo a forma lida pela régua e a convenção do bloco `pequenas-5`, de 29.08.2026. A página mantém a frase literal com a marca colada às aspas e marcada como português. A régua não mudou.

A paragem inicial pelo §3 ficou resolvida: o portão da voz reconheceu a linha inglesa. O histórico da falha e dos códigos da passagem inicial está em `medidas-nd1.json`, no campo `passagem_inicial`.

A régua ND1 encontrou 24 páginas com marca seguida de unidade antes da mudança e zero depois, em 9 825 ficheiros HTML. As 44 páginas com a marca mantêm-na; os 24 recibos têm a frase literal do mandato nas duas línguas. O livro-razão não foi alterado.

A lista fechada está em `src/lib/marcas-de-ausencia.mjs`. A conferência `check:nd1` faz parte de `gate:html`: lê texto, atributos e o código escapado para citar, exige a frase em cada recibo e recusa valores sem algarismos nem marca conhecida nas unidades de medida. As unidades `texto`, `afirmação` e `data` ficam fora dessa última condição.

## Medição e plantas

A comparação antes/depois e as transcrições abaixo foram obtidas numa chamada. A medição anterior foi recuperada das medidas guardadas na patch, sem inventar uma nova construção inicial:

```sh
node tests/linha/ausencia-nd1.mjs --antes <temporario>/nd1-adenda-a/antes.json --medidas design/especime-v3/medicoes/nd1-2026-11-07/medidas-nd1.json
```

| Planta isolada | Código |
| --- | --- |
| titulo | 1 |
| unidade | 1 |
| frase | 1 |
| marca | 1 |

Cada planta correu num processo separado, sobre uma cópia em memória do recibo ou da lista de linhas. Nenhuma alterou o `dist/` nem o livro-razão.

## Cópias do dist/

### pt: `/livro-razao/aljezur-prazo-medio-de-pagamento-2025-12`

Título: N.d. · Números e fontes · O Estado do País

Valor: N.d. A fonte publica «N.d.» em vez de um valor.

Frase com a marcação de língua:

```html
<span class="linha-valor-ausencia" data-nd1-ausencia data-voz>A fonte publica «N.d.» em vez de um valor.</span>
```

Excerto para citar, integral:

```html
<p class="oedp-numero" lang="pt-PT" data-oedp="aljezur-prazo-medio-de-pagamento-2025-12" data-oedp-valor="N.d." data-oedp-lido="2026-08-26"><a href="https://oestadodopaís.pt/livro-razao/aljezur-prazo-medio-de-pagamento-2025-12">Prazo médio de pagamento · Aljezur, dezembro de 2025: N.d.</a> · <span lang="pt-PT">Direção-Geral das Autarquias Locais (DGAL)</span>, lido a 26.08.2026 · O Estado do País, oestadodopaís.pt, CC BY 4.0</p><script async src="https://oestadodopaís.pt/incorporar.js" referrerpolicy="no-referrer" crossorigin="anonymous"></script>
```

### en: `/en/ledger/aljezur-prazo-medio-de-pagamento-2025-12`

Título: N.d. · Numbers and sources · O Estado do País

Valor: N.d. The source publishes «N.d.» instead of a value.

Frase com a marcação de língua:

```html
<span class="linha-valor-ausencia" data-nd1-ausencia data-voz>The source publishes «<span lang="pt-PT">N.d.</span>» instead of a value.</span>
```

Excerto para citar, integral:

```html
<p class="oedp-numero" lang="en" data-oedp="aljezur-prazo-medio-de-pagamento-2025-12" data-oedp-valor="N.d." data-oedp-lido="2026-08-26"><a href="https://oestadodopaís.pt/en/ledger/aljezur-prazo-medio-de-pagamento-2025-12">Average payment time · Aljezur, December 2025: N.d.</a> · <span lang="pt-PT">Direção-Geral das Autarquias Locais (DGAL)</span>, read on 26.08.2026 · O Estado do País, oestadodopaís.pt, CC BY 4.0</p><script async src="https://oestadodopaís.pt/incorporar.js" referrerpolicy="no-referrer" crossorigin="anonymous"></script>
```

## Conferências

| Comando | Código |
| --- | --- |
| `npm run build` | 0 |
| `gate:html`, dentro do build | 0 |
| `check:voz`, dentro do build | 0 |
| `check:lingua`, isolado e dentro do build | 0 |
| `check:nd1`, dentro de `gate:html` | 0 |
| Medição final e plantas ND1 | 0 |
| `check:cabeca` | reservado à corrida externa da direção |
| CSS, typecheck e incorporação | 0 na passagem inicial; implementação recuperada sem alteração |

Os códigos da cadeia do build decorrem da execução sequencial por `&&` e do código final 0. Os comandos executados estão enumerados nas medidas. A conferência da incorporação da passagem inicial verificou 8 282 recibos, 4 141 JSON e 108 plantas.

O `check:cabeca` não foi repetido: a adenda A reserva-o à corrida inteira do lugar de direção fora da sandbox. A tentativa inicial tinha sido bloqueada por `Error: listen EPERM: operation not permitted 127.0.0.1`.

Não se fizeram capturas, instalação de dependências, alterações no motor ou publicação. Nenhum caminho adicional das quatro formas do mandato foi encontrado com marca seguida de unidade.

## Orçamento

Adenda A, até ao fecho deste relatório: 24 chamadas de ferramentas e três corridas principais por `curto.sh` (build, língua e medição ND1). A cadeia do build executou 29 comandos npm, incluindo os comandos de entrada. As quatro plantas ND1 correram duas vezes, num total de oito processos isolados. Zero corridas integrais dos portões. A passagem inicial registou 50 chamadas, oito corridas principais e uma sonda curta.
