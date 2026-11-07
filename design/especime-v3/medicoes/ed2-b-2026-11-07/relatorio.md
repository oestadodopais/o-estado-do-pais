# ED2 B: cabeçalhos conservados e voz da linha por manifesto

A ED2 omitira a atualização dos estudos cuja única edição guardada é posterior à publicação. O cabeçalho voltou a usar a porta «Edição atual» ou «Current edition», a publicação original e a data da edição com `data-estudo-atualizacao`. O texto dos oito cabeçalhos foi comparado com o de main e é igual. As páginas inglesas sem tradução continuam a usar a edição portuguesa, com os rótulos ingleses.

As réguas obtêm a publicação das declarações dos estudos e do ficheiro das datas de entrada, e a edição do manifesto, sem chamar o renderizador. Conferem também o rótulo e o destino da porta de uma só edição. A régua das datas, a das edições e as isenções editoriais usam essa expectativa. A FP3 não foi alterada.

O renderizador usa as chaves já existentes de `rotulos-b1.mjs`. O repertório da voz é calculado a partir das versões do manifesto, com palavras, quantidade e ordem exatas. A composição completa deixou de estar enumerada em quatro linhas fixas do inventário. A medição da voz confere o HTML das linhas antes de o classificar. Uma composição diferente não ganha dispensa por expressão regular. As duas formas antigas dos cabeçalhos de uma só edição foram repostas como vivas; não se acrescentaram frases à superfície pública.

## Códigos

| Conferência | Código |
| --- | ---: |
| `build` | 0 |
| `check:edicoes` | 0 |
| `check:datas` | 0 |
| `check:voz` | 0 |
| `check:lugar` | 0 |
| `check:mortos` | 0 |
| `typecheck` | 0 |
| `comparacao_com_main` | 0 |

A construção completa terminou com código 0. `build-fim.log` conserva as últimas vinte linhas; o registo integral ficou em `<temporario>/ed2b-build.log`. Os outros registos e os códigos estão nesta pasta.

## Plantas

Os processos separados de `tests/edicoes/adenda-b.mjs` devolveram código 1 para cada uma destas alterações:

- `--planta=atualizacao-tirada`: data de atualização retirada de cada um dos oito cabeçalhos.
- `--planta=porta-publicada-falsa`: porta trocada por «Edição tal como foi publicada» ou «Edition as published».
- `--planta=atualizacao-a-mais`: atualização acrescentada a `onde-esta-a-agua`, com o atributo, nas duas línguas.
- `--planta=so-palavra-errada`: só a palavra antes de 06.11.2026 trocada por «atualizado a» ou «updated on», mantendo `data-estudo-correcao` e a data intactos.

A suite dos cabeçalhos tem 12 controlos e 20 plantas recusadas. A suite `tests/edicoes/voz-linha.mjs` usa um manifesto sintético com uma quarta edição de Évora 2027: a composição correta passa a validação da linha, a classificação e a procura das retiradas nas duas línguas. Uma palavra estranha e uma natureza válida colocada no lugar errado são recusadas. São 6 controlos e 6 plantas. O processo `--planta-outra-palavra` devolveu código 1. O comando que exige os cinco processos vermelhos terminou com código 0. A quarta edição só existe nessa prova; não foi acrescentada ao manifesto publicado.

## Comparação com main

Comando, da raiz da worktree:

```sh
python3 design/especime-v3/medicoes/ed2-2026-11-07/medir-cabecalhos.py ../lote7-2026-11-06/dist dist
```

Código 0: 38 páginas de estudo; zero com a data de atualização perdida sem linha das edições. A pasta irmã foi apenas lida. Uma comparação adicional dos oito cabeçalhos confirmou igualdade de texto em todos eles. O texto e o HTML extraídos do novo `dist/` estão em `cabecalhos.json`.

## Cabeçalhos copiados de dist

### evora-orcamentado-pago-devido-2025 (pt)

> Edição atual · publicado a 12.08.2026 · atualizado a 20.08.2026

### evora-orcamentado-pago-devido-2025 (en)

> Current edition · published on 12.08.2026 · updated on 20.08.2026

### evora-prometido-pago-auditado-2026 (pt)

> Edição atual · publicado a 15.08.2026 · atualizado a 20.08.2026

### evora-prometido-pago-auditado-2026 (en)

> Current edition · published on 15.08.2026 · updated on 20.08.2026

### evora-quinze-anos-cinco-mandatos (pt)

> Edição atual · publicado a 12.08.2026 · atualizado a 20.08.2026

### evora-quinze-anos-cinco-mandatos (en)

> Current edition · published on 12.08.2026 · updated on 20.08.2026

### penalizacoes-por-reforma-antecipada-2026 (pt)

> Edição atual · publicado a 24.08.2026 · atualizado a 23.09.2026

### penalizacoes-por-reforma-antecipada-2026 (en)

> Current edition · published on 24.08.2026 · updated on 23.09.2026

## Execução

14 invocações por `curto.sh`: uma construção completa; as seis conferências pedidas, com repetição de `check:mortos` e `typecheck` depois das alterações; duas corridas das provas da voz; uma corrida final das plantas dos cabeçalhos; duas comparações com main; uma corrida que exige os cinco processos vermelhos. O pacote `check:edicoes` e o pacote `check:voz` também incluem as provas novas. Foram 27 chamadas `functions.exec` até guardar este relatório; o total com o commit e a verificação é indicado na resposta final.

Não correram os três portões completos nem capturas. Não houve alterações no motor, na worktree anterior ou na worktree de comparação, nem publicação ou push. Não foi exposta uma linha `tokens used`.
