# A ORIGEM DE CADA FICHEIRO

*Escrito a 29.08.2026. Nenhum tipo comercial foi buscado. Nenhum byte foi
escrito em `public/tipos`.*

## As candidatas, descarregadas

Todas de `github.com/google/fonts`, no commit **`ade3d1533e06b2b1462ffcde8e08b129627ca360`**, pasta `ofl/<familia>/`,
por `raw.githubusercontent.com`. Cada uma traz o seu `OFL.txt` ao lado, copiado
da mesma pasta e no mesmo commit.

| família | ficheiro de montante | eixos | licença · titular declarado no `OFL.txt` |
|---|---|---|---|
| Newsreader | `ofl/newsreader/Newsreader[opsz,wght].ttf` e o itálico | `opsz`, `wght` | SIL OFL 1.1 · Copyright 2020 The Newsreader Project Authors (Production Type, github.com/productiontype/Newsreader) |
| Source Serif 4 | `ofl/sourceserif4/SourceSerif4[opsz,wght].ttf` e o itálico | `opsz`, `wght` | SIL OFL 1.1 · Copyright 2014 The Source Serif 4 Project Authors (Adobe, github.com/adobe-fonts/source-serif) |
| Literata | `ofl/literata/Literata[opsz,wght].ttf` e o itálico | `opsz`, `wght` | SIL OFL 1.1 · Copyright 2017 The Literata Project Authors (TypeTogether, github.com/googlefonts/literata) |
| Public Sans | `ofl/publicsans/PublicSans[wght].ttf` | `wght` | SIL OFL 1.1 · Copyright 2015 The Public Sans Project Authors (USWDS, github.com/uswds/public-sans) |
| IBM Plex Sans | `ofl/ibmplexsans/IBMPlexSans[wdth,wght].ttf` | `wdth`, `wght` | SIL OFL 1.1 · Copyright © 2017 IBM Corp., com o nome reservado «Plex» |

As três serifas de prosa trazem o eixo `opsz`, que foi a condição da §3 do
brief. O itálico da Public Sans e o da IBM Plex Sans não foram descarregados: o
sítio usa itálico quase em lado nenhum, e nenhuma regra pede itálico ao
instrumento.

## Os controlos, não descarregados

Spectral, Spectral SC e Bitter **não foram buscados à rede**. Os ficheiros que o
estudo mede são os WOFF2 que o sítio já aloja em `public/tipos`, LIDOS de lá e
passados pelo mesmo subconjunto que as candidatas, com a saída escrita aqui. É o
que torna a medida 7 uma comparação: bytes de latim contra bytes de latim, e não
um subconjunto contra um ficheiro inteiro.

As licenças dos controlos ficam onde já estavam, em `public/tipos/<familia>/OFL.txt`,
e são as mesmas SIL OFL 1.1 (Spectral: Copyright 2017 The Spectral Project
Authors; Bitter: Copyright 2011 The Bitter Project Authors, nome reservado
«Bitter Pro»).

## O subconjunto

`design/tipografia/programa/subconjunto.py`, que corre o `fontTools.subset`
(`pyftsubset`) 4.61.1 com `brotli` 1.2.0 para o WOFF2. O intervalo é o `latin`
mais o `latin-ext` do Google Fonts, e a bandeira `--layout-features='*'` guarda
todas as features OpenType: sem ela o `pyftsubset` deixa cair o `tnum` e o
`smcp`, que são as duas medidas que a rubrica exige. Os bytes e o resumo SHA-256
de cada ficheiro de saída estão em `SUBCONJUNTOS.json`.

Os TTF de montante ficam guardados ao lado dos WOFF2, e não só o resultado: quem
quiser refazer o subconjunto com outro intervalo tem a entrada.

## O que fica por descarregar, e porquê

O Parnaso e a Sebenta (Feliciano Type) são comerciais. Não foram buscados, não
foram medidos e o seu lugar na tabela de `NOTAS.md` fica vazio e dito vazio. As
fontes de teste chegam por um formulário que só o diretor preenche.
