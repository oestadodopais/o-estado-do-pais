# O estado de `main` depois do bloco do mapa por distritos (27.08.2026, noite)

*Escrito pelo lugar de direção (Claude Fable 5). O ramo `mapa-distritos-2026-08-27` saiu de `main` e foi trazido a `main` antes de construir; está verde: construção com `check:mapa` na cadeia, `verify`, `typecheck`, `check:voz`, a matriz refeita célula a célula, `mapa-distritos` (22 células) e `mapa-navegacao`. Medido às cegas (Sonnet, M3, numa cópia do repositório) e lido de olhos frescos (Codex, 4 de 4 plantas). A Emenda 20 é a regra; a §1.72 do `DECISIONS.md` é o registo; no motor, `publisher/MAPA.md` é o contrato do artefacto.*

## O que muda no ar

* **A primeira página** mostra as 29 unidades da Carta como áreas iguais, cada uma uma ligação para a sua página de distrito, nas duas larguras (no telemóvel também, ao contrário da forma provisória de 25.08); as ilhas nas suas molduras, com os nomes por baixo como ligações, uma por linha; o selo com a Carta Administrativa Oficial de Portugal 2025, a Direção-Geral do Território e a licença CC BY 4.0. Os 308 pontos saem da primeira página e ficam no cartão localizador das páginas de concelho.
* **29 páginas de distrito** (`/distritos/<slug>`, `/en/districts/<slug>`, e um índice `/distritos`): o mapa do distrito com os seus concelhos como áreas e ligações para as páginas de concelho, a lista dos concelhos, as portas.
* **`/municipios`:** os cabeçalhos dos grupos por distrito são ligações para as páginas de distrito.

## Medido

A 1280, o mapa da primeira página mede 490 × 646 px e 19 das 29 unidades chegam aos 44 px; a 390, 354 × 467 px e as mesmas 19; as dez que não chegam são as nove ilhas dos Açores e o Porto Santo, com as suas listas. O país pesa 29,9 KB de caminhos; o maior distrito (Lisboa) 21,5 KB. A margem mais fina: Viana do Castelo a 44,5 px a 390 (abaixo de uma janela de 386 px deixa de ser alvo; I81).

## O que fica

1. **I80:** o manifesto do mapa guarda contagens por unidade e não a pertença; a próxima geração do motor escreve-a. **I81:** a margem de Viana do Castelo no telemóvel estreito (o mapa à largura da janela, se o diretor quiser).
2. I72, I73 (motor), I74, I78, I79; a terceira passagem de voz (à decisão do diretor); as áreas de governo, a página das regiões; a indexação quando o diretor disser que o sítio está pronto.
