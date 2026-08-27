# BRIEF · O mapa por distritos (Emenda 20, ISSUES I70)

*Escrito a 27.08.2026 pelo lugar de direção (Claude Fable 5) para dois construtores (Claude Opus 5): M1 no motor, M2 no sítio. Decisão do diretor de 27.08 (opção A: o mapa por distritos substitui os pontos na primeira página, nas duas larguras). Ramo do sítio `mapa-distritos-2026-08-27` a partir de `main`. Os factos medidos estão em `medicoes/mapa-distritos-2026-08-27.md` (a cópia do relatório do reconhecimento) e são os que este brief usa; nada aqui foi escrito de memória. Sem travessões na prosa deste ficheiro.*

## 0 · Numa frase

O motor produz, a partir da CAOP 2025 que já aloja, o desenho das 29 unidades e dos 308 concelhos como caminhos SVG em JSON com prova de junção e resumo; o sítio rende o mapa das 29 na primeira página como ligações para 29 páginas de distrito, cada uma com os seus concelhos como áreas e ligações, nas duas edições e nas duas larguras, com a neutralidade da Emenda 10, os portões a conferir os resumos e a junção, e as réguas a medir os alvos.

## 1 · O contrato entre o motor e o sítio (fixo)

* **O que atravessa:** conteúdo estruturado, nunca saída rendida (regra da fronteira, DECISIONS §1.31). O motor escreve no sítio, pelo exportador que já existe para os registos ou por um irmão dele, `mapa/pais.json` e `mapa/distritos/<slug>.json` (29), mais `mapa/manifest.json` com o resumo sha256 de cada ficheiro, a origem (os três GeoPackage da CAOP 2025, os seus resumos, o endereço em dados.gov.pt, a licença CC BY 4.0 e a frase de atribuição da DGT tal como publicada), a tolerância usada e o erro no ecrã que a fixou, e a prova de junção.
* **`mapa/pais.json`:** `{ campo: { largura, altura }, molduras: [{ nome: 'Madeira' | 'Açores', caixa, escala }], unidades: [ { slug, nome, tipo: 'distrito' | 'ilha', parcela: 'continente' | 'madeira' | 'acores', d, caixa, ponto } ] }` com 29 unidades; `d` é o caminho em inteiros ×10 com `l` relativo (a forma `int10` do reconhecimento), o campo é novo e guarda todos os polígonos (o campo dos pontos, 600 × 790, não os guarda: Miranda do Douro sai a leste e as Selvagens ao sul); `ponto` é o ponto representativo dentro da área.
* **`mapa/distritos/<slug>.json`:** `{ unidade: { slug, nome, tipo }, campo, concelhos: [ { slug, nome, d, caixa, ponto } ] }`, cada distrito na sua grelha local (0..2000) e à sua tolerância, derivada de um erro de 0,25 px na página do distrito (o reconhecimento mediu: uma tolerância só dá de 0,26 a 31,3 px de erro conforme o distrito; 29 ficheiros, 376 491 B ao todo, o maior Lisboa 22 841 B).
* **Os slugs dos concelhos** são os de `slugsDaCarta()` do sítio (o motor já reproduz a função no estudo 12 Concelhos); os slugs das 29 unidades definem-se agora, da forma da casa, a partir dos nomes da Carta (`lisboa`, `ilha-da-madeira`, `ilha-de-sao-miguel`…), e a lista fica escrita no manifesto; **`lisboa` é distrito e é concelho**, e por isso as páginas de distrito vivem em `/distritos/<slug>` e nunca em `/municipios/`.
* **A prova de junção** que o manifesto traz e o sítio reconfere: os 308 concelhos aparecem uma vez cada nas 29 unidades; os nomes são as mesmas 308 cadeias da Carta que o sítio tem; o ponto representativo de cada concelho cai dentro da sua área; os quatro casos do centróide no mar ficam nomeados.

## 2 · M1 · o motor

1. Um script do editor (`publisher/mapa_distritos.py`) que lê os três GeoPackage já alojados por `caop_municipios.py` (conferir os resumos contra o manifesto do motor), constrói a topologia dos 308 uma vez (os scripts do reconhecimento em `scratchpad/mapa-distritos/` são ponto de partida: `topojson` 1.10, `shapely` 2.1.2, `pyproj` 3.7.2, a projeção Web Mercator por parcela), simplifica os arcos uma vez (as áreas ficam a 100,00 %; a sobreposição entre vizinhos é 0), deriva as 29 unidades da camada de distritos (dissolver os 308 dá a mesma forma, diferença simétrica 0) e escreve os ficheiros da §1 mais o manifesto. Tolerância do país: a que dá 0,25 px na coluna de 490 px (0,30 u no reconhecimento); a de cada distrito: a que dá 0,25 px na sua página (calculada, não escolhida).
2. Provas: as somas de área antes e depois; a junção (308 uma vez cada; 308 pontos representativos dentro; os nomes iguais); os resumos; três estragos plantados vistos vermelhos (um concelho apagado de um distrito; um nome trocado; um caminho com um vértice fora da caixa); a suíte do motor (o portão de commit) verde; `REGISTOS.md` ou um irmão (`MAPA.md`) com o contrato; `NEXT.md`.
3. O exportador em ensaio contra o sítio (o lugar de direção corre a escrita), com os caminhos e os resumos no relatório.

## 3 · M2 · o sítio

**D1 · A primeira página.** `MapaRespira` na postura da primeira página passa a render o mapa das 29 unidades a partir de `mapa/pais.json`: cada área um `<a href="/distritos/<slug>">` com o nome acessível (a `<title>` e o texto), o contorno igual para todas (Emenda 10 e 20b), o estado de foco e de rato só no contorno, as duas molduras das ilhas à escala mais generosa que couber na coluna, e por baixo de cada moldura, onde uma ilha não chegar aos 44 px, os nomes das ilhas dessa moldura como ligações, uma por linha (Emenda 20c). Sem `role="img"` sobre ligações (o `svg` expõe-nas, como o bloco do mapa fez). O mapa rende-se nas duas larguras; abaixo de 640 a folha deixa de o esconder, e a pesquisa continua por baixo da manchete como está. A legenda «308 concelhos · CAOP 2025 ■ fonte» fica, com a atribuição da DGT no selo.

**D2 · As páginas de distrito.** `/distritos/<slug>` e `/en/districts/<slug>` (29 × 2): a cabeça com o nome da unidade e o seu tipo (distrito, ilha da Região Autónoma), o mapa do distrito a partir de `mapa/distritos/<slug>.json` (cada concelho uma área e uma ligação para `/municipios/<slug>`, o nome ao passar o rato e pelo teclado, o contorno igual para todos), a lista dos seus concelhos (a forma do grupo por distrito de `/municipios`, com os nomes por ordem), as portas (`/municipios`, a primeira página). Nenhum número inventado; as contagens (quantos concelhos) são chaves da prova contadas pelo portão. Um índice `/distritos` com as 29 é opcional; se existir, é a lista, sem mapa.

**D3 · `/municipios`.** Os cabeçalhos dos grupos por distrito passam a ligações para a página do distrito. Nada mais muda.

**D4 · O cartão localizador** das páginas de concelho não muda (Emenda 20d).

**D5 · Os portões.** `check:mapa` na cadeia do `build`: os resumos dos ficheiros de `mapa/` iguais aos do manifesto; a junção reconferida no sítio (308 concelhos uma vez cada nas 29 páginas de distrito, os slugs iguais a `slugsDaCarta()`); cada página de distrito com tantas ligações quantos concelhos; a primeira página com 29 ligações de área; nenhum `<a>` debaixo de `role="img"`; a atribuição da DGT presente onde o mapa está. Cada regra com o seu estrago plantado.

**D6 · As réguas.** Células novas na matriz: a 1280, as 29 áreas com caixa ≥ 44 px ou, para as que não chegam, o nome na lista por baixo da moldura; a 390 (iPhone 13), o mesmo; numa página de distrito, os alvos dos concelhos (o reconhecimento mediu 23 dos 308 abaixo de 44 px no computador e 44 no telemóvel com o distrito aberto: os que não chegam têm a lista por baixo, e a régua diz quantos); o peso da primeira página (o JSON do país ≈35 KB) e de uma página de distrito (≤ 25 KB de caminhos); `medir-defeitos` sem blocos por classificar e autorreferência 0; `check:voz` verde (a legenda nomeia a coisa). Capturas antes e depois a 390 e 1280 (`/`, `/distritos/lisboa`, `/distritos/ilha-de-sao-miguel`, `/municipios`).

**D7 · Os registos.** `DECISIONS.md` `### 1.71 O mapa por distritos` antes de «## 4.», `**Afecta:** nenhum`; `ISSUES.md` I70 fecha com o commit; `notas/mapa-distritos.md`; `CHAVES-EN.md`; o inventário com `bloco: mapa-distritos`; `critica/REVISOES-DO-INVENTARIO.md` com a linha `por ler` para o lugar de direção.

## 4 · O que NÃO muda

Nenhum texto governado; `ledger/`; `registos/`; as páginas de concelho além do cabeçalho de grupo em `/municipios`; a pesquisa; a densidade; as regiões.

## 5 · Verificação cruzada (o lugar de direção trata)

Uma medição cega (Sonnet, numa cópia do repositório, nunca na árvore do construtor): a junção com código próprio sobre os JSON e as páginas construídas, os alvos a 390 e 1280, os pesos, e dez cliques reais em áreas ao acaso na primeira página e numa página de distrito; uma leitura do Codex sobre o diff do inventário, as 29 páginas por amostra e a primeira página, com plantas (um concelho a faltar num distrito; um nome trocado; uma área com cor de estatuto; uma frase de autorreferência).

## 6 · Regras

As da casa; a regra 16 cobre `tests/`; `command grep` nos ficheiros em que o `grep` da casa devolve vazio; quem mede trabalha numa cópia; nunca `git add -A`; os dois trailers; não fundir, não empurrar; onde o brief deixa uma forma em aberto, o padrão mais próximo da casa, e a escolha à cabeça do relatório.
