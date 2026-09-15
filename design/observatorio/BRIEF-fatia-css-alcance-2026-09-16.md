# A fatia `css-alcance-2026-09-16` · as regras chegam a todas as páginas (a I118)

*Escrito pelo lugar de direção a 15.09.2026, a partir do que a célula C1 da fatia `dominios-css-2026-09-15` achou e pôs em quarentena. Uma fatia (um ramo pequeno, uma leitura a frio curta, um portão), com a regra de 15.09: as capturas antes e depois de cada rota vão ao diretor antes de aterrar. Sem travessões na prosa.*

## 0 · O que a célula mediu

Três famílias de páginas usam classes cujas regras vivem em folhas que essas páginas não ligam (a I118): as 616 páginas de concelho (as formas: `forma`, `forma-svg`, `forma-barra-c`, `forma-barra-num`, `forma-barra-p`, `forma-frase`, `forma-frase-num`, `forma-selo-rot`, com regra em `dominio.css`), as 58 de distrito (`lig`, `mapa-svg`, `mapa-svg-areas`, com regra em `inicio.css`) e o índice dos concelhos do livro-razão (`pesquisa-distrito`, com regra em `inicio.css`). Hoje o leitor vê essas peças sem as regras que as desenharam, ou com regras de outra folha que por acaso as apanham.

## 1 · As decisões

1. **Primeiro medir, depois mexer.** Para cada rota, uma captura a 390 e a 1 280 antes de qualquer mudança (uma página de concelho, uma de distrito, o índice dos concelhos; nas duas edições), e a leitura no navegador das propriedades que as regras em falta declaram (o que está, o que falta).
2. **A regra vive numa folha que chega a quem a usa.** As regras partilhadas por mais de uma família (as formas, o mapa, a busca por distrito) saem da folha de uma vista para folhas próprias importadas pelos componentes que as rendem (como a lista dos domínios ficou), e não por cada vista; as regras de uma só família ficam onde estão. Nenhuma regra muda de valor: muda só de folha. O peso de cada folha nova medido (KB), e o total de CSS por página antes e depois.
3. **O que se vê muda, e diz-se quanto:** as capturas depois, as mesmas propriedades lidas, e a altura de cada página a 390 e a 1 280 antes e depois; se uma página de concelho mudar de aspeto onde o diretor já a viu bem (a página de Évora), a mudança é dita e mostrada antes de aterrar.
4. **A quarentena esvazia-se:** `C1_EM_QUARENTENA` fica vazia e a célula corre estrita sobre as 7 224 páginas; a C2 continua a 0.

## 2 · As medidas de aceitação

| # | medida | como se mede |
|---|---|---|
| A1 | C1 a 0 sem quarentena; C2 a 0 | `scripts/check-css.mjs` |
| A2 | nenhuma regra com valor mudado (o diff das folhas só move blocos) | o diff |
| A3 | as capturas antes e depois das três famílias nas duas edições a 390 e a 1 280, com as alturas e as propriedades lidas | `capturas/css-alcance-2026-09-16/` |
| A4 | as réguas do mapa e dos alvos (F1.1d, F1.1e) e a matriz verdes | os testes |
| A5 | os três portões a 0; o `portão` verde | os comandos; a CI |

Estimativa: Opus, uma passagem, S. Ramo a partir de `main` depois da fatia de 15.09 fundida.
