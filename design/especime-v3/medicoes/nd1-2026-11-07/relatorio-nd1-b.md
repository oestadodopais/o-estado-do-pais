# ND1 B: ausência numa linha calculada

O recibo de uma linha com `derived_from` e uma marca de ausência passa a dizer que o valor não se calcula. A frase anterior atribuía à fonte o índice de dívida de Penedono, que ela não publica. As linhas da fonte conservam a frase do mandato ND1.

A leitura do livro-razão encontrou 12 linhas com a marca: 11 da fonte e apenas uma calculada, `penedono-indice-de-divida-2024`. Não apareceu outra linha calculada com a marca. O livro-razão, os valores, as unidades e os excertos não mudaram.

A régua escolhe a frase a partir de `derived_from` na linha lida do livro, sem consultar a decisão do renderizador. As duas frases novas constam do inventário; a inglesa está na forma espaçada que a régua da voz lê, conforme a adenda A. A página mantém a marca colada às aspas e com `lang="pt-PT"`.

## Cópias do dist/

Os títulos, valores, frases com marcação de língua e excertos seguintes foram lidos dos dois recibos construídos de `penedono-indice-de-divida-2024`:

### pt: `/livro-razao/penedono-indice-de-divida-2024`

Título: N.d. · Números e fontes · O Estado do País

Valor: N.d. Não se calcula: a fonte publica «N.d.» nos valores de que depende.

```html
<span class="linha-valor-ausencia" data-nd1-ausencia data-voz>Não se calcula: a fonte publica «N.d.» nos valores de que depende.</span>
```

Excerto para citar, integral:

```html
<p class="oedp-numero" lang="pt-PT" data-oedp="penedono-indice-de-divida-2024" data-oedp-valor="N.d." data-oedp-lido=""><a href="https://oestadodopaís.pt/livro-razao/penedono-indice-de-divida-2024">Índice de dívida · Penedono, 2024: N.d.</a> · <span lang="pt-PT">calculado por este projeto</span> · O Estado do País, oestadodopaís.pt, CC BY 4.0</p><script async src="https://oestadodopaís.pt/incorporar.js" referrerpolicy="no-referrer" crossorigin="anonymous"></script>
```

### en: `/en/ledger/penedono-indice-de-divida-2024`

Título: N.d. · Numbers and sources · O Estado do País

Valor: N.d. Not calculated: the source publishes «N.d.» for the values it depends on.

```html
<span class="linha-valor-ausencia" data-nd1-ausencia data-voz>Not calculated: the source publishes «<span lang="pt-PT">N.d.</span>» for the values it depends on.</span>
```

Excerto para citar, integral:

```html
<p class="oedp-numero" lang="en" data-oedp="penedono-indice-de-divida-2024" data-oedp-valor="N.d." data-oedp-lido=""><a href="https://oestadodopaís.pt/en/ledger/penedono-indice-de-divida-2024">Debt index · Penedono, 2024: N.d.</a> · <span lang="en">calculated by this project</span> · O Estado do País, oestadodopaís.pt, CC BY 4.0</p><script async src="https://oestadodopaís.pt/incorporar.js" referrerpolicy="no-referrer" crossorigin="anonymous"></script>
```

As medidas guardam também um recibo de uma linha da fonte em cada língua, com a frase original intacta.

## Medição e plantas

A contagem nesta adenda foi zero páginas com marca seguida de unidade antes e zero depois, em 9 825 ficheiros HTML. As medidas anteriores da ND1 conservam a correção original de 24 para zero. Antes da construção nova, a régua atualizada recusou precisamente as duas frases antigas do índice de Penedono; depois recusou zero recibos.

A comparação e as cópias foram obtidas numa chamada:

```sh
npm run check:nd1 -- --antes <temporario>/nd1-b/antes.json --medidas design/especime-v3/medicoes/nd1-2026-11-07/medidas-nd1-b.json
```

| Planta isolada | Código |
| --- | --- |
| titulo | 1 |
| unidade | 1 |
| frase | 1 |
| marca | 1 |
| fonte-na-calculada-pt | 1 |
| fonte-na-calculada-en | 1 |

As duas plantas novas repõem a frase da fonte no recibo calculado, uma em cada língua. A planta inglesa conserva a marcação portuguesa da marca: a recusa é pela frase falsa. Cada planta corre num processo separado, sobre uma cópia em memória; não altera o `dist/`.

## Conferências

| Comando | Código |
| --- | --- |
| `npm run build` | 0 |
| `gate:html`, dentro do build | 0 |
| `check:voz`, dentro do build | 0 |
| `check:lingua`, dentro do build | 0 |
| `check:nd1`, isolado e dentro do build | 0 |
| `npm run typecheck` | 0 |

Os códigos das conferências incluídas no build decorrem da cadeia sequencial por `&&` e do resultado final 0. A lista dos comandos está nas medidas. Nenhuma régua recusou as frases novas.

O `check:cabeca` continua reservado à corrida inteira do lugar de direção fora da sandbox, conforme a adenda A. Não se correram capturas nem a cadeia inteira dos portões nesta passagem.

## Orçamento

Até ao fecho deste relatório: 18 chamadas de ferramentas e quatro corridas por `curto.sh` (build, medição anterior, typecheck e prova ND1). O build executou 29 comandos npm, incluindo os comandos de entrada. As seis plantas correram duas vezes, num total de 12 processos isolados. Zero corridas integrais dos portões.
