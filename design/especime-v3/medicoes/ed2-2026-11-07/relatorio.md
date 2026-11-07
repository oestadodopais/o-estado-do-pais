# ED2: edições acessíveis e datas por natureza

A cabeça de partida é `450fdafac`. A VOZ-2A e a VOZ-2B pararam antes de alterar os estudos. Por isso o manifesto tem quatro estudos com várias edições e Évora 2027 conserva três, de 01.10, 03.11 e 06.11.2026. Não foi inventada uma edição de 07.11.2026. As únicas naturezas encontradas são `atualizacao` e a ausência de natureza.

O cabeçalho e a faixa de cada versão ligam a todas as outras edições, por ordem do manifesto. A versão que se lê tem `aria-current="page"`, sem ligação. As datas do cabeçalho distinguem a última atualização da última correção, em ordem cronológica. Os estudos com uma só edição e a caixa FP3 mantêm o comportamento anterior.

As réguas leem o manifesto diretamente, sem importar a composição da linha. Conferem a natureza, a data, o destino, a ordem, a quantidade de portas e a página corrente. A publicação declarada e as isenções das datas também validam a linha. As frases novas e as retiradas foram registadas no inventário; só as formas integrais do mandato admitem os fragmentos antigos, cuja ocorrência isolada continua recusada. A leitura cruzada do inventário ficou assinalada como por ler.

## Conferências

`npm run build` completo: código 0, 684 segundos. Incluiu os portões HTML, edições, selos, datas, dados, voz, língua e as restantes conferências da cadeia de construção. Não foi usada a corrida dos três portões. Os códigos estão em `codigos.json` e os registos finais nesta pasta.

`check:edicoes`, `check:voz`, `check:datas`, `check:lugar` e `typecheck`: código 0. A suite ED2 tem 28 controlos e 79 plantas recusadas. As faixas têm mais 80 plantas, sobre todas as edições guardadas e atuais. A FP3 continua conferida pela suite de datas e pelas plantas da natureza das novidades.

As três plantas pedidas correram em processos separados, com o mesmo portão usado no controlo: `--planta=edicao-omitida`, `--planta=natureza-trocada` e `--planta=data-de-correcao-como-atualizacao`, todas com código 1. O comando que exige os três vermelhos terminou com código 0.

`check:cabeca` terminou com código 1 antes de iniciar o navegador: `Error: listen EPERM: operation not permitted 127.0.0.1`. Não foi repetido nem substituído por uma régua mais permissiva. As réguas do cabeçalho editorial foram exercidas por `check:datas`, `check:edicoes` e pelas plantas ED2. A tentativa de observar processos com `ps` também foi recusada pela sandbox, sem afetar a execução das conferências.

## Largura

Capturas pelo escrivão: código 0, 26 páginas nas duas línguas, todas com janela de 390 px e largura documental de 390 px, zero falhas. Cobrem os quatro cabeçalhos e cada versão de cada documento. Os 26 recortes estão nesta pasta, com medidas e impressões digitais em `capturas.json`. As imagens completas ficaram na pasta temporária da captura. O cabeçalho e a faixa atual de Évora 2027 foram também inspecionados visualmente nas duas línguas.

## Contagem por um comando

Da raiz da worktree:

```sh
node design/especime-v3/medicoes/ed2-2026-11-07/contar-portas.mjs
```

Resultado guardado em `contagem.json`: quatro estudos. As contagens abaixo são iguais em português e inglês.

| Estudo | Edições no manifesto | Portas no cabeçalho | Portas em cada faixa |
| --- | ---: | ---: | ---: |
| Contas da câmara de Évora | 2 | 2 | 1 |
| Évora 2027 | 3 | 3 | 2 |
| Orçamento de 2027 | 2 | 2 | 1 |
| A casa em Portugal e na Europa | 2 | 2 | 1 |

## Texto copiado de dist

O HTML exato dos dois cabeçalhos e das seis faixas de Évora 2027 está em `evora-extraido.json`. Seguem o cabeçalho e a faixa atual em cada língua. A separação entre a frase da faixa e a linha das edições conserva os blocos visuais.

### pt: cabeçalho

> Edições: 01.10.2026 (primeira) · 03.11.2026 (atualização) · 06.11.2026 (correção, atual) · publicado a 01.10.2026 · atualizado a 03.11.2026 · corrigido a 06.11.2026

### pt: faixa atual

> Edição atual, de 06.11.2026. A primeira edição é de 01.10.2026.

> Edições: 01.10.2026 (primeira) · 03.11.2026 (atualização) · 06.11.2026 (correção, atual)

### en: cabeçalho

> Editions: 01.10.2026 (first) · 03.11.2026 (update) · 06.11.2026 (correction, current) · published on 01.10.2026 · updated on 03.11.2026 · corrected on 06.11.2026

### en: faixa atual

> Current edition, from 06.11.2026. The first edition is from 01.10.2026.

> Editions: 01.10.2026 (first) · 03.11.2026 (update) · 06.11.2026 (correction, current)

## Execução

Vinte invocações de conferências por `curto.sh`: uma construção completa; três `check:voz`; duas `check:edicoes`; duas `check:datas`; duas `check:lugar`; uma `check:cabeca`; três `typecheck`; duas provas das fontes; duas provas ED2 sobre o HTML; duas corridas das três plantas em processos separados. Houve uma corrida de capturas pelo escrivão e nenhuma corrida dos três portões completos. As tentativas iniciais detetaram uma comparação de nós de texto incorreta, um cabeçalho de executável deslocado e frases novas ainda não declaradas; esses erros foram corrigidos antes das conferências finais.

57 chamadas de ferramentas `functions.exec` até ao fecho deste relatório, incluindo a chamada que o guarda. A contagem total, com o commit e a sua verificação, é indicada na resposta final.

Nenhuma linha `tokens used` foi exposta nesta passagem. O motor não foi alterado. Não houve publicação nem push.
