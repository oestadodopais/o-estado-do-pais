# Mandato LAR1: nenhuma página desliza para o lado (03.11.2026)

Acrescenta: nada

*Escrito pelo lugar de direção (Claude Opus 5.5, pela palavra do financiador de 02.11.2026). O construtor é o Codex `gpt-6-astra` (`high`), sem rede, na worktree `lote3-2026-11-03`, que parte da cabeça da EV3 (a aterrar hoje). Só o sítio; o motor não muda. É o primeiro bloco do lote 3, com a EV3-p e a FP3 por cima, e aterra depois das 00:00 UTC.*

## §0 Medido (03.11.2026, por este lugar, num navegador, sobre o `dist/` da cabeça da EV3)

O guião e os resultados estão em `design/especime-v3/medicoes/lar1-2026-11-03/antes/` (`medir-largura.mjs`; corre com `PW=<a worktree>/node_modules/playwright/index.mjs node medir-largura.mjs dist <saída.json>`, e com `LISTA=<ficheiro>` mede só as páginas da lista). Para cada página, o guião mede o `scrollWidth` do documento em cada uma das cinco larguras (390, 768, 1 024, 1 280, 1 600) e lista as classes dos elementos folha que passam o ecrã.

1. **As famílias de páginas** (`familias.json`): 78 famílias, até duas páginas de cada, 100 páginas, 500 medidas. 18 medidas mais largas do que o ecrã, em quatro páginas:
   - `/correcoes/` e `/en/corrections/` em todas as larguras (3 427 px a 390, 4 045 px a 1 280, 4 205 px a 1 600);
   - a edição guardada de Évora 2027 nas duas línguas, de 390 a 1 280.
2. **Os documentos dos estudos** (`documentos.json`): as 37 páginas de documento, atuais e guardadas, nas duas línguas; 16 deslizam:
   - as de Évora 2027 (a atual e a guardada) e as de Évora 2027, o que foi prometido, de 390 a 1 280;
   - a 390, as das contas da Câmara de Évora (a atual e a guardada), da economia e do dinheiro público de fora da Câmara, do orçado, pago e devido, de quem governou a Câmara, e das penalizações por reforma antecipada.
3. **As causas**, contadas nos elementos que passam o ecrã:
   - no registo das correções, os valores antigo e novo dentro de `.registo-mudanca-par` (os `s` e os `span`) e os nomes dentro de `.vh`, todos com `white-space: nowrap`, uma regra pensada para pares curtos como «15 → 45» e que hoje leva excertos inteiros e nomes de publicadores;
   - nos documentos, as células das tabelas (`td`, `th`) e as ligações dentro delas, com tabelas mais largas do que o ecrã.

## §1 O que fazes

1. **O registo das correções.** Nenhum valor de texto e nenhum nome passam a largura do ecrã. Um par curto (um número com a sua unidade) pode ficar numa linha; um valor de texto parte-se como o resto do texto, nas duas edições. Decides a forma, e anotas.
2. **As tabelas dos documentos dos estudos.** Uma tabela mais larga do que o ecrã desliza dentro da sua própria caixa, e a página não. A mudança é só de CSS: o HTML servido de cada edição guardada não muda (as edições guardadas servem-se tal como foram publicadas; confere o sha256 do HTML servido de cada edição guardada antes e depois, e são iguais).
3. **A régua, no sítio inteiro e no que vier.** Uma conferência `check:largura` que mede, num navegador, uma amostra por família de páginas do `dist/` (as famílias calculadas do próprio `dist/`, como o guião do §0 faz, para que uma família nova entre sozinha) e todas as páginas de documento dos estudos, nas cinco larguras, e falha quando uma página tem o `scrollWidth` maior do que a largura do ecrã. Planta: um valor de texto longo com `white-space: nowrap` reposto no registo dá vermelho; sem ele, verde. A conferência entra na lista inteira do `verify` (a que o `conferir-tudo.sh` corre). Diz quanto tempo leva; se passar de três minutos, diz porquê e o que corta.
4. **As capturas.** O `scripts/leituras/captar.mjs` falha uma captura cuja página é mais larga do que a largura pedida, e o manifesto diz a largura medida de cada uma.

## §2 Quando paras

Só se uma régua que protege um número, uma fonte ou uma pessoa tiver de enfraquecer (diz qual), ou se a correção das tabelas mudar o HTML servido de uma edição guardada (diz qual e porquê).

## §3 O fim

O `build` inteiro verde; a `check:largura` verde e com a planta vermelha; o guião do §0 corrido de novo depois da mudança, com zero páginas mais largas do que o ecrã nas famílias e nos documentos, e os resultados em `design/especime-v3/medicoes/lar1-2026-11-03/depois/`; os sha256 das edições guardadas antes e depois; as conferências que a mudança toca, com os códigos. Commits só com caminhos explícitos, com os trailers `Co-Authored-By` (o modelo que escreveu) e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`. Quarenta e cinco minutos, sessenta chamadas.
