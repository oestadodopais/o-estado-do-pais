# ADENDA 2 · A segunda ronda do estudo tipográfico (29.08.2026)

*Escrita pelo lugar de direção (Claude Fable 5) depois da leitura cruzada da primeira ronda (`LEITURA-CODEX-2026-08-29.md`). O diretor mandou continuar a exploração. Sem travessões na prosa.*

## 0 · O que a segunda ronda corrige

A primeira ronda mediu, mas não como a rubrica mandava, e ordenou depois de medir. A segunda aplica a rubrica à letra, ou declara medida a medida o que não é mensurável, e a ordem sai de uma ponderação escrita aqui, antes de qualquer captura. As colunas do Parnaso (Standard, Small) e da Sebenta ficam vazias e ditas vazias até o pacote de teste da Feliciano Type existir; a ronda corre com as famílias livres e os controlos.

## 1 · A ponderação, fixada antes de olhar

1. **Eliminatórias** (fora da ordem quem falha): algarismos tabulares (`tnum`) para o instrumento; versaletes (`smcp` ou família irmã alojada) para a prosa.
2. **Ordem, por esta importância**: (a) a solidez do traço mais fino a 1× (medida 2), lida nas cinco páginas às sete larguras; (b) as aberturas de «e», «a», «s» a 17 px e 1× (medida 3), pelo método que a primeira ronda encontrou («quanto o traço tem de engordar até a garganta selar») **a 1×**, e se a 1× a medida não distingue as famílias, di-lo e a medida pesa zero; (c) a densidade de leitura a 390 × 844 (medida 6), para a prosa e para o instrumento (uma tabela de linha do livro-razão); (d) a altura de x a 17 px medida no navegador (medida 1); (e) os bytes do sítio (medida 7), normalizados: os mesmos estilos que o sítio usa hoje, cortados ao mesmo subconjunto, sem itálicos que o sítio não usa. Cada medida dá uma classificação de 1 a n por família; a ordem final é a soma ponderada 5·(a) + 3·(b) + 3·(c) + 2·(d) + 1·(e), escrita com as classificações ao lado; um empate diz-se empate.
3. **A leitura cega** (medida 8): as capturas das cinco páginas a 390 e 1280 em cada família, lidas pelo Codex contra esta rubrica, com duas plantas; corre o lugar de direção, depois de entregue.

## 2 · O que se faz

* Reutiliza o interruptor e o programa da primeira ronda; corrige o que a leitura apontou: as medidas 2 e 3 às sete larguras e a 1×; a medida 1 no navegador (`canvas.measureText` de um «x» com o tipo carregado); o JSON célula a célula (família × página × largura × densidade × medida); a medida 6 para o instrumento; os algarismos a 13,5 px, o corpo real da linha do livro-razão; o motor de renderização e a versão declarados (Chromium do Playwright, a versão impressa). Regenerar dá o mesmo ficheiro.
* As pranchas: `PRANCHA-2-390.png` e `PRANCHA-2-1280.png` com as **cinco** páginas por família; `PRANCHA-2-ALGARISMOS.png` a 13,5 px e 1×, ampliada 4×.
* `NOTAS.md`, secção «Segunda ronda»: a tabela completa com as classificações e a soma, o que se viu nas capturas (por família, por página), as medidas que pesaram zero e porquê, os bytes normalizados, e a frase de compra condicional para o Parnaso e a Sebenta: o número a bater em cada medida. Sem elogios.
* Commits com caminhos explícitos e os dois trailers; `npm run typecheck` verde; nada fora de `design/tipografia/` e do interruptor.
