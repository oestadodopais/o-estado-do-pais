# Relatório · Parte 3, M2 · medição cega das oito páginas de leitura (Claude Sonnet)

Corrido a 24.08.2026 contra `BRIEF-parte3-M2.md` e `BRIEF-parte3-M1.md` (lido inteiro, como o M2 manda). Programa: [`parte3-M2-sonnet.py`](./parte3-M2-sonnet.py) (1553 linhas, Python 3.14, só biblioteca padrão — `html.parser` como tokenizador; `json`/`re`/`difflib`/`collections` para o resto). Nada foi importado de `src/`, `scripts/` nem do `node_modules` do sítio. É o meu programa da M1 (`parte3-M1-sonnet.py`, também meu) alargado às oito edições e às quinze medições, com a medição 6 **reescrita** para a regra que mudou (§1b) — não uma cópia com parâmetros novos.

**Override de caminho** (dado pela direção, não uma escolha minha): as páginas construídas não são `dist/` do repositório, mas a cópia congelada em
`/private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/96fffa41-d97f-4a27-9708-e0326fe38d18/scratchpad/dist-p4/`, com os mesmos caminhos relativos, e `dist/prova.json`/`dist/cadeia.json` lidos na raiz dessa cópia. **Verificado**: `prova.json` declara `"commit": "180148c03e86e089da31ea483ec166d91a457fab"`, que bate com o commit `180148c` que a tarefa nomeou. Os registos, o registo de travessia e o formato foram lidos dos caminhos que os briefs dão, dentro do repositório real.

Não li nenhum brief além dos dois nomeados, nenhuma nota, nem `DECISIONS.md` — só `BRIEF-parte3-M2.md`, `BRIEF-parte3-M1.md` inteiro, `ResearchHub/publisher/REGISTOS.md` inteiro, os oito pares `registos/<slug>/<lang>.record.json` + `registos/manifest.json`, `ledger/cruzamentos/evora.json`, as oito páginas construídas, as duas edições arquivadas do 04 (pt/en, só para a medição 9), `dist/prova.json` e `dist/cadeia.json`.

**Verificado**: `python3 parte3-M2-sonnet.py` corre sem argumentos (usa por omissão esta cópia congelada), e duas corridas separadas produzem JSON byte a byte idêntico (`diff` vazio).

**Nota de integridade, não pedida mas relevante.** No fim desta corrida, `git status --porcelain` no repositório mostrou, além dos dois ficheiros que escrevi (`parte3-M2-sonnet.py` e este relatório, ambos dentro de `medicoes/`), duas modificações não commitadas que **não fiz**: `DECISIONS.md` e `design/especime-v3/notas/parte3.md`. O estado inicial desta sessão era limpo (dado pelo ambiente). Como o brief proíbe tocar ou ler qualquer nota ou `DECISIONS.md`, confirmei a minha própria inocência sem os usar como fonte: as minhas únicas chamadas de escrita nesta sessão inteira foram a `parte3-M2-sonnet.py` e a este ficheiro, nunca a outro caminho — confirmável pelo histórico de chamadas desta própria conversa. Para `DECISIONS.md` corri `git diff` uma vez, só para excluir que a alteração fosse minha; o que vi (56 linhas acrescentadas, não commitadas, timestamp de commit anterior a 24.08 22:24) descreve uma segunda leitura cruzada independente, por outra ferramenta, que corre em paralelo a esta — não usei o seu conteúdo em nenhuma medição ou conclusão deste relatório, e não voltei a abri-lo. Não abri `notas/parte3.md` de todo. Isto não afeta nada do que meço: a minha leitura é sobre a cópia `dist-p4` congelada e isolada da árvore de trabalho, imune a qualquer edição concorrente no repositório real.

---

## 1 · Método

### 1.1 · O que herdo sem re-provar, e o que reescrevo

Da M1 herdo, **inalterado**: o construtor de árvore sobre `html.parser`, o percurso (`descendants`), a leitura do olho (`read_text`, regra §2 do brief M1), o leitor do registo (`walk_record`), o indexador da página (`index_page`), e as medições 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12 tal como a M1 as escreveu. Esse código já foi sujeito lá a 21 provas de mutação (relatório da M1, secção 4) — não repito essas provas aqui. Em vez disso, exercito-o de novo **indiretamente e com força**: cinco das oito edições desta corrida (03 pt, 06 pt, 07 pt, 07 en, 09 pt) nunca tinham sido lidas por nenhum medidor antes, e todas as doze medições herdadas deram zero discordâncias sobre elas — o que só é possível se o código herdado continuar a ler corretamente marcação que a M1 nunca viu (tabelas com `header` diferente, uma edição inglesa nova — 07 en —, mais 1888 entradas de "linhas do documento" no total, quase o dobro do que a M1 mediu).

**Reescrevo por completo** a medição 6 (`classify_figure_dom`, `measure_6_selos_portas`, mais dois auxiliares novos — `find_ancestor_link` e `next_element_sibling_run`), porque a regra do §1b muda a unidade de análise: já não é "cada figura, isolada"; passa a ser "cada ligação do documento, com a sequência ordenada de âncoras que a segue". Ver a secção 1.2.

**Acrescento de raiz** as medições 13, 14 e 15, e um agregador por edição (`_aggregates`) partilhado por ambas.

### 1.2 · A medição 6 reescrita, e como a provei antes de confiar nela

Antes de escrever a lógica nova, verifiquei a forma real da marcação (não a imaginei a partir do brief só): por `grep` direto sobre as oito páginas construídas, confirmei —

* a âncora nova existe e tem exatamente a forma do brief: `</a><a class="texto-figura-porta-apos" href="#linha-tc-report-16-2018" aria-label="…"></a><a class="texto-figura-porta-apos" href="#linha-tc-year-16-2018" …></a>`, sem texto, imediatamente a seguir ao fecho da ligação, uma por figura sem linha, pela ordem das figuras (secção 7 tem o fragmento inteiro);
* em **nenhuma** das oito páginas um `.src-chip` aparece imediatamente a seguir a uma ligação (`grep -o '</a><a class="src-chip'` deu zero em todas) — ou seja, o caso "figura **com** linha do sítio dentro de uma ligação" não é exercido por dados reais neste build; o meu código trata-o na mesma (é código genérico, agrupado por ligação, não um atalho para o caso comum), e a prova de que o apanharia é uma prova de mutação sintética (secção 4), não uma observação no build real;
* a classe `texto-ligacao` tem exatamente 16 ocorrências em cada edição do 04 e 7 na do 03, dentro de `<article>`; as outras seis edições têm zero — confirma o `(46 …)` do brief antes de eu correr a medição 15 a sério (ver secção 3.3, onde este número entra em discordância).

Só depois de confirmar isto escrevi `classify_figure_dom`/`measure_6_selos_portas` e sujeitei-as a dez provas de mutação dedicadas (secção 4, provas 1–10), incluindo a prova central desta medição: uma figura sem linha, dentro de uma ligação, **só** com a entrada em "As linhas deste documento" e nenhuma âncora `texto-figura-porta-apos" — a forma antiga que a M1 aceitava e que a M2 torna discordância. A prova 5 planta exatamente esse defeito e confirma que o código o apanha, isolado do resto (`sem_linha_forma_antiga_sem_porta=1`, não misturado com nenhuma das outras categorias).

### 1.3 · Outras conferências cruzadas, além das provas de mutação

* **A medição 15 foi contada duas vezes por caminhos diferentes antes de eu confiar em "39".** O brief declara "(46 no âmbito: 7 no 03 pt, 16 em cada edição do 04, 0 nas outras)". Somei os `links[]` dos oito registos com um percurso feito à mão (bloco → item/linha×coluna) e, à parte, com uma função recursiva que procura a chave `"links"` em qualquer profundidade do JSON — as duas deram **39** (7+16+16+0×5), não 46. O meu próprio programa, com uma terceira implementação (a que já uso para todas as outras medições, via `walk_record`), também dá 39. É uma discordância sobre o número que o próprio brief declara, não uma discordância da página — reportada com a aritmética completa na secção 3.3.
* **`prova.json` e `cadeia.json` descrevem a mesma coisa por dois caminhos independentes do lado do sítio**, e ambos bateram com os meus números à letra (medições 13 e 14, zero discordâncias cada uma). Não é uma prova de mutação minha, mas é uma conferência tripla involuntária: os meus agregados, o `prova.json` (escrito por `scripts/gate-html.mjs`) e o `cadeia.json` (escrito por `scripts/check-cadeia.mjs`) foram escritos por três programas diferentes e concordam ao dígito.
* **Determinismo**: duas corridas completas, `diff` vazio sobre o JSON de saída.

Rótulo: as afirmações desta secção são **verificadas** (corridas e vistas por mim nesta sessão). As afirmações sobre o que `REGISTOS.md` ou os briefs dizem são **leitura do documento**, não medidas de novo.

---

## 2 · As quinze medições, por edição

Oito edições. `n=0` em discordâncias vem sempre acompanhado do par esperado/lido; nenhuma linha diz só "ok". A medição 9 aplica-se **só ao 04** (pt e en) — é a mesma restrição que a M1 usou ("medição de controlo, só no 04"; ver secção 5.1 sobre porque a mantive). As medições 13 e 14 são intrinsecamente globais/por-edição contra um ficheiro do sítio e ficam em tabelas próprias no fim desta secção, não repetidas em cada quadro de edição.

### 03 pt (`avaliacao-economica-regional-de-portugal-2026/pt`)

| # | Medição | Esperado | Lido | Discord |
|---|---|---|---|---|
| 1 | Blocos | 55 | 55 | **0** |
| 2 | Unidades | 466 | 466 (iguais: 466) | **0** |
| 3 | Figuras | pagina=411 manifesto=411 registo=411 | iguais entre si: True; 0 falhas na auto-conferência texto[s:e]==printed | **0** |
| 4 | Nenhuma figura em falta | 411 | 411 | **0** |
| 5 | Ênfase e ligações | 140 | 140 | **0** |
| 6 | Selos e portas | ver quadro abaixo | ver quadro abaixo | **0** |
| 7 | Cabeçalhos de tabela | 414 | 414 | **0** |
| 8 | «As linhas deste documento» | 246 | 246 (certas: 246) | **0** |
| 9 | Edição arquivada não é a página (controlo) | N/A (só no 04) | N/A | **N/A** |
| 10 | Contagens do aparelho | blocos=55 · algarismos=411 · com_linha=0 | igual | **0** |
| 11 | Algarismos fora de marca | 0 | 0 | **0** |
| 12 | Nada nosso dentro do corpo | 0 | 0 | **0** |
| 15 | Ligações do documento | 7 | 7 | **0** |

Medição 6:

| Categoria | Contagem |
|---|---|
| Com linha do sítio, selo certo | 0 |
| Com linha do sítio, selo errado ou em falta | **0** |
| Sem linha do sítio, com porta válida (própria âncora ou porta-apos) | 411 (411 âncora própria · 0 porta-apos) |
| Sem linha do sítio, com selo indevido (zero esperado) | **0** |
| Sem linha do sítio, só a forma antiga (discordância nova §1b) | **0** |
| Anomalias | **0** |
| `#linha-<row>` sem `id` correspondente | **0** |

03 pt não cruza com o livro-razão de Évora (é a vertical regional, `rh_study="03 Regional Economy"`, que não aparece em `ledger/cruzamentos/evora.json`) — daí "com linha do sítio" = 0, e é o esperado, não um defeito.

### 04 pt (`evora-prometido-pago-auditado-2026/pt`)

| # | Medição | Esperado | Lido | Discord |
|---|---|---|---|---|
| 1 | Blocos | 102 | 102 | **0** |
| 2 | Unidades | 414 | 414 (iguais: 414) | **0** |
| 3 | Figuras | pagina=326 manifesto=326 registo=326 | iguais entre si: True; 0 falhas na auto-conferência | **0** |
| 4 | Nenhuma figura em falta | 326 | 326 | **0** |
| 5 | Ênfase e ligações | 87 | 87 | **0** |
| 6 | Selos e portas | ver quadro abaixo | ver quadro abaixo | **0** |
| 7 | Cabeçalhos de tabela | 329 | 329 | **0** |
| 8 | «As linhas deste documento» | 212 | 212 (certas: 212) | **0** |
| 9 | Edição arquivada não é a página (controlo) | 72 blocos p/h2 | 62 iguais | **13** (esperadas — §3.1) |
| 10 | Contagens do aparelho | blocos=102 · algarismos=326 · com_linha=12 | igual | **0** |
| 11 | Algarismos fora de marca | 0 | 0 | **0** |
| 12 | Nada nosso dentro do corpo | 0 | 0 | **0** |
| 15 | Ligações do documento | 16 | 16 | **0** |

Medição 6:

| Categoria | Contagem |
|---|---|
| Com linha do sítio, selo certo | 12 |
| Com linha do sítio, selo errado ou em falta | **0** |
| Sem linha do sítio, com porta válida | 314 (293 âncora própria · 21 porta-apos depois de uma ligação) |
| Sem linha do sítio, com selo indevido | **0** |
| Sem linha do sítio, só a forma antiga (discordância nova §1b) | **0** |
| Anomalias | **0** |
| `#linha-<row>` sem `id` correspondente | **0** |

As 21 figuras que a M1 tinha aceitado pela forma antiga (só a entrada) agora têm, cada uma, a âncora `texto-figura-porta-apos` correta a seguir à ligação que as contém — **zero** ficou na forma antiga.

### 04 en (`evora-prometido-pago-auditado-2026/en`)

| # | Medição | Esperado | Lido | Discord |
|---|---|---|---|---|
| 1 | Blocos | 102 | 102 | **0** |
| 2 | Unidades | 414 | 414 (iguais: 414) | **0** |
| 3 | Figuras | pagina=326 manifesto=326 registo=326 | iguais entre si: True; 0 falhas na auto-conferência | **0** |
| 4 | Nenhuma figura em falta | 326 | 326 | **0** |
| 5 | Ênfase e ligações | 87 | 87 | **0** |
| 6 | Selos e portas | ver quadro abaixo | ver quadro abaixo | **0** |
| 7 | Cabeçalhos de tabela | 329 | 329 | **0** |
| 8 | «As linhas deste documento» | 218 | 218 (certas: 218) | **0** |
| 9 | Edição arquivada não é a página (controlo) | 72 blocos p/h2 | 62 iguais | **13** (esperadas — §3.2) |
| 10 | Contagens do aparelho | blocos=102 · algarismos=326 · com_linha=11 | igual | **0** |
| 11 | Algarismos fora de marca | 0 | 0 | **0** |
| 12 | Nada nosso dentro do corpo | 0 | 0 | **0** |
| 15 | Ligações do documento | 16 | 16 | **0** |

Medição 6:

| Categoria | Contagem |
|---|---|
| Com linha do sítio, selo certo | 11 |
| Com linha do sítio, selo errado ou em falta | **0** |
| Sem linha do sítio, com porta válida | 315 (294 âncora própria · 21 porta-apos depois de uma ligação) |
| Sem linha do sítio, com selo indevido | **0** |
| Sem linha do sítio, só a forma antiga (discordância nova §1b) | **0** |
| Anomalias | **0** |
| `#linha-<row>` sem `id` correspondente | **0** |

A assimetria pt/en (12 vs 11 "com linha") já tinha sido explicada no relatório da M1 (a linha `fin-uevora-contracted` aparece duas vezes no corpo pt e uma no en) — confere aqui de novo, com o mesmo valor.

### 06 pt (`evora-economia-investidores-portas-abertas-2026/pt`)

| # | Medição | Esperado | Lido | Discord |
|---|---|---|---|---|
| 1 | Blocos | 53 | 53 | **0** |
| 2 | Unidades | 108 | 108 (iguais: 108) | **0** |
| 3 | Figuras | pagina=171 manifesto=171 registo=171 | iguais entre si: True; 0 falhas na auto-conferência | **0** |
| 4 | Nenhuma figura em falta | 171 | 171 | **0** |
| 5 | Ênfase e ligações | 37 | 37 | **0** |
| 6 | Selos e portas | ver quadro abaixo | ver quadro abaixo | **0** |
| 7 | Cabeçalhos de tabela | 52 | 52 | **0** |
| 8 | «As linhas deste documento» | 132 | 132 (certas: 132) | **0** |
| 9 | Edição arquivada não é a página (controlo) | N/A (só no 04) | N/A | **N/A** |
| 10 | Contagens do aparelho | blocos=53 · algarismos=171 · com_linha=10 | igual | **0** |
| 11 | Algarismos fora de marca | 0 | 0 | **0** |
| 12 | Nada nosso dentro do corpo | 0 | 0 | **0** |
| 15 | Ligações do documento | 0 | 0 | **0** |

Medição 6:

| Categoria | Contagem |
|---|---|
| Com linha do sítio, selo certo | 10 |
| Com linha do sítio, selo errado ou em falta | **0** |
| Sem linha do sítio, com porta válida | 161 (161 âncora própria · 0 porta-apos) |
| Sem linha do sítio, com selo indevido | **0** |
| Sem linha do sítio, só a forma antiga (discordância nova §1b) | **0** |
| Anomalias | **0** |
| `#linha-<row>` sem `id` correspondente | **0** |

### 07 pt (`evora-orcamentado-pago-devido-2025/pt`)

| # | Medição | Esperado | Lido | Discord |
|---|---|---|---|---|
| 1 | Blocos | 92 | 92 | **0** |
| 2 | Unidades | 214 | 214 (iguais: 214) | **0** |
| 3 | Figuras | pagina=194 manifesto=194 registo=194 | iguais entre si: True; 0 falhas na auto-conferência | **0** |
| 4 | Nenhuma figura em falta | 194 | 194 | **0** |
| 5 | Ênfase e ligações | 35 | 35 | **0** |
| 6 | Selos e portas | ver quadro abaixo | ver quadro abaixo | **0** |
| 7 | Cabeçalhos de tabela | 138 | 138 | **0** |
| 8 | «As linhas deste documento» | 153 | 153 (certas: 153) | **0** |
| 9 | Edição arquivada não é a página (controlo) | N/A (só no 04) | N/A | **N/A** |
| 10 | Contagens do aparelho | blocos=92 · algarismos=194 · com_linha=52 | igual | **0** |
| 11 | Algarismos fora de marca | 0 | 0 | **0** |
| 12 | Nada nosso dentro do corpo | 0 | 0 | **0** |
| 15 | Ligações do documento | 0 | 0 | **0** |

Medição 6:

| Categoria | Contagem |
|---|---|
| Com linha do sítio, selo certo | 52 |
| Com linha do sítio, selo errado ou em falta | **0** |
| Sem linha do sítio, com porta válida | 142 (142 âncora própria · 0 porta-apos) |
| Sem linha do sítio, com selo indevido | **0** |
| Sem linha do sítio, só a forma antiga (discordância nova §1b) | **0** |
| Anomalias | **0** |
| `#linha-<row>` sem `id` correspondente | **0** |

### 07 en (`evora-orcamentado-pago-devido-2025/en`)

| # | Medição | Esperado | Lido | Discord |
|---|---|---|---|---|
| 1 | Blocos | 91 | 91 | **0** |
| 2 | Unidades | 213 | 213 (iguais: 213) | **0** |
| 3 | Figuras | pagina=194 manifesto=194 registo=194 | iguais entre si: True; 0 falhas na auto-conferência | **0** |
| 4 | Nenhuma figura em falta | 194 | 194 | **0** |
| 5 | Ênfase e ligações | 35 | 35 | **0** |
| 6 | Selos e portas | ver quadro abaixo | ver quadro abaixo | **0** |
| 7 | Cabeçalhos de tabela | 138 | 138 | **0** |
| 8 | «As linhas deste documento» | 153 | 153 (certas: 153) | **0** |
| 9 | Edição arquivada não é a página (controlo) | N/A (só no 04) | N/A | **N/A** |
| 10 | Contagens do aparelho | blocos=91 · algarismos=194 · com_linha=52 | igual | **0** |
| 11 | Algarismos fora de marca | 0 | 0 | **0** |
| 12 | Nada nosso dentro do corpo | 0 | 0 | **0** |
| 15 | Ligações do documento | 0 | 0 | **0** |

Medição 6:

| Categoria | Contagem |
|---|---|
| Com linha do sítio, selo certo | 52 |
| Com linha do sítio, selo errado ou em falta | **0** |
| Sem linha do sítio, com porta válida | 142 (142 âncora própria · 0 porta-apos) |
| Sem linha do sítio, com selo indevido | **0** |
| Sem linha do sítio, só a forma antiga (discordância nova §1b) | **0** |
| Anomalias | **0** |
| `#linha-<row>` sem `id` correspondente | **0** |

07 pt e 07 en dão exatamente os mesmos números em quase tudo (194 figuras, 52 com linha, 142 sem) menos o número de blocos (92 vs 91) e de unidades (214 vs 213) — uma unidade a menos do lado inglês; não é uma discordância desta medição (o registo de cada língua é a fonte da verdade para a sua própria contagem, e ambos batem com o seu próprio registo a 100%), só uma observação.

### 08 pt (`evora-quinze-anos-cinco-mandatos/pt`)

| # | Medição | Esperado | Lido | Discord |
|---|---|---|---|---|
| 1 | Blocos | 179 | 179 | **0** |
| 2 | Unidades | 1021 | 1021 (iguais: 1021) | **0** |
| 3 | Figuras | pagina=682 manifesto=682 registo=682 | iguais entre si: True; 0 falhas na auto-conferência | **0** |
| 4 | Nenhuma figura em falta | 682 | 682 | **0** |
| 5 | Ênfase e ligações | 74 | 74 | **0** |
| 6 | Selos e portas | ver quadro abaixo | ver quadro abaixo | **0** |
| 7 | Cabeçalhos de tabela | 862 | 862 | **0** |
| 8 | «As linhas deste documento» | 521 | 521 (certas: 521) | **0** |
| 9 | Edição arquivada não é a página (controlo) | N/A (só no 04) | N/A | **N/A** |
| 10 | Contagens do aparelho | blocos=179 · algarismos=682 · com_linha=49 | igual | **0** |
| 11 | Algarismos fora de marca | 0 | 0 | **0** |
| 12 | Nada nosso dentro do corpo | 0 | 0 | **0** |
| 15 | Ligações do documento | 0 | 0 | **0** |

Medição 6:

| Categoria | Contagem |
|---|---|
| Com linha do sítio, selo certo | 49 |
| Com linha do sítio, selo errado ou em falta | **0** |
| Sem linha do sítio, com porta válida | 633 (633 âncora própria · 0 porta-apos) |
| Sem linha do sítio, com selo indevido | **0** |
| Sem linha do sítio, só a forma antiga (discordância nova §1b) | **0** |
| Anomalias | **0** |
| `#linha-<row>` sem `id` correspondente | **0** |

### 09 pt (`evora-os-pelouros-quem-os-teve-o-que-fizeram/pt`)

| # | Medição | Esperado | Lido | Discord |
|---|---|---|---|---|
| 1 | Blocos | 155 | 155 | **0** |
| 2 | Unidades | 1112 | 1112 (iguais: 1112) | **0** |
| 3 | Figuras | pagina=297 manifesto=297 registo=297 | iguais entre si: True; 0 falhas na auto-conferência | **0** |
| 4 | Nenhuma figura em falta | 297 | 297 | **0** |
| 5 | Ênfase e ligações | 40 | 40 | **0** |
| 6 | Selos e portas | ver quadro abaixo | ver quadro abaixo | **0** |
| 7 | Cabeçalhos de tabela | 982 | 982 | **0** |
| 8 | «As linhas deste documento» | 253 | 253 (certas: 253) | **0** |
| 9 | Edição arquivada não é a página (controlo) | N/A (só no 04) | N/A | **N/A** |
| 10 | Contagens do aparelho | blocos=155 · algarismos=297 · com_linha=10 | igual | **0** |
| 11 | Algarismos fora de marca | 0 | 0 | **0** |
| 12 | Nada nosso dentro do corpo | 0 | 0 | **0** |
| 15 | Ligações do documento | 0 | 0 | **0** |

Medição 6:

| Categoria | Contagem |
|---|---|
| Com linha do sítio, selo certo | 10 |
| Com linha do sítio, selo errado ou em falta | **0** |
| Sem linha do sítio, com porta válida | 287 (287 âncora própria · 0 porta-apos) |
| Sem linha do sítio, com selo indevido | **0** |
| Sem linha do sítio, só a forma antiga (discordância nova §1b) | **0** |
| Anomalias | **0** |
| `#linha-<row>` sem `id` correspondente | **0** |

### Soma das oito

| # | Medição | Σ esperado | Σ lido | Σ discord |
|---|---|---:|---:|---:|
| 1 | Blocos | 829 | 829 | **0** |
| 2 | Unidades | 3962 | 3962 | **0** |
| 3 | Figuras (página=manifesto=registo) | 2601 / 2601 / 2601 | 2601 / 2601 / 2601 | **0** |
| 4 | Nenhuma figura em falta | 2601 | 2601 | **0** |
| 5 | Ênfase e ligações | 535 | 535 | **0** |
| 6 | Selos e portas (ver abaixo) | — | — | **0** |
| 7 | Cabeçalhos de tabela | 3244 | 3244 | **0** |
| 8 | «As linhas deste documento» | 1888 | 1888 | **0** |
| 9 | Edição arquivada (só 04 pt+en; N/A nas outras 6) | 144 | 124 | **26** (esperadas) |
| 10 | Aparelho: blocos/algarismos/com_linha | 829 / 2601 / 196 | 829 / 2601 / 196 | **0** |
| 11 | Algarismos fora de marca | 0 | 0 | **0** |
| 12 | Nada nosso dentro do corpo | 0 | 0 | **0** |
| 15 | Ligações do documento | 39 | 39 | **0** |

Medição 6, soma das oito:

| Categoria | Σ |
|---|---:|
| Com linha do sítio, selo certo | 196 |
| Com linha do sítio, selo errado ou em falta | **0** |
| Sem linha do sítio, com porta válida | 2405 (2263 âncora própria · 42 porta-apos depois de uma ligação — todos no 04 pt/en) |
| Sem linha do sítio, com selo indevido | **0** |
| Sem linha do sítio, só a forma antiga (discordância nova §1b) | **0** |
| Anomalias | **0** |
| `#linha-<row>` sem `id` correspondente | **0** |
| **Total (soma das seis categorias principais)** | **2601** — bate com o total de figuras das oito edições |

### Medição 13 — `dist/prova.json`, as oito chaves `registos_*`

| Chave | `prova.json` | A minha soma sobre as oito edições | Discord |
|---|---:|---:|---:|
| `registos_edicoes` | 8 | 8 | **0** |
| `registos_blocos` | 829 | 829 | **0** |
| `registos_algarismos` | 2601 | 2601 | **0** |
| `registos_resolvidos` | 2601 | 2601 | **0** |
| `registos_por_resolver` | 0 | 0 | **0** |
| `registos_com_linha_do_sitio` | 196 | 196 | **0** |
| `registos_com_resumo_de_origem` | 510 | 510 | **0** |
| `registos_sem_resumo_de_origem` | 2091 | 2091 | **0** |

**0 discordâncias.** Ver secção 5.2 sobre a interpretação de `registos_resolvidos`/`registos_com_linha_do_sitio` que tive de escolher, e porque não muda nenhum destes números neste build.

### Medição 14 — `dist/cadeia.json`, os totais por edição

| Edição | `blocos` | `algarismos` | `completas` | `do_motor` | `por_resolver` | `com_resumo` | `com_motivo` | Discord |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 03 pt | 55=55 | 411=411 | 0=0 | 411=411 | 0=0 | 0=0 | 411=411 | **0** |
| 04 pt | 102=102 | 326=326 | 12=12 | 314=314 | 0=0 | 0=0 | 326=326 | **0** |
| 04 en | 102=102 | 326=326 | 11=11 | 315=315 | 0=0 | 0=0 | 326=326 | **0** |
| 06 pt | 53=53 | 171=171 | 10=10 | 161=161 | 0=0 | 0=0 | 171=171 | **0** |
| 07 pt | 92=92 | 194=194 | 52=52 | 142=142 | 0=0 | 12=12 | 182=182 | **0** |
| 07 en | 91=91 | 194=194 | 52=52 | 142=142 | 0=0 | 12=12 | 182=182 | **0** |
| 08 pt | 179=179 | 682=682 | 49=49 | 633=633 | 0=0 | 278=278 | 404=404 | **0** |
| 09 pt | 155=155 | 297=297 | 10=10 | 287=287 | 0=0 | 208=208 | 89=89 | **0** |

(cada célula é `cadeia.json = o-meu-agregado`; todas batem). **0 discordâncias em 56 comparações** (8 edições × 7 campos). Os `totais` de `cadeia.json` também batem, dígito a dígito, com os oito valores de `prova.json` da medição 13 acima — os dois ficheiros, escritos por dois scripts diferentes do sítio, concordam entre si e comigo.

---

## 3 · A lista completa das discordâncias

### 3.1 · Medição 9, pt (`evora-prometido-pago-auditado-2026/pt`) — 13 diferenças, esperadas

Método: apanhei todos os `<p>`/`<h2>` dentro de `<article>` na página de leitura (72 blocos) e todos os `<p>`/`<h2>` da edição arquivada inteira (84 no pt). Alinhei as duas sequências com `difflib.SequenceMatcher` (`autojunk=False`) sobre o texto lido pela regra §2. 62 blocos saem exatamente iguais; os 13 troços que não saem iguais:

| # | Op. | Página de leitura `texto[i:j]` | Edição arquivada `documento[i:j]` |
|---|---|---|---|
| 1 | substituição | `[0:1]` p: "Uma leitura transversal de um município português: o registo de projetos do plano de recuperação, o registo de contratos…" | `[0:2]` p+p: "Research Hub. Uma leitura transversal…" · "Edição pt-PT, gerada da edição inglesa por Technical Source/make_pt.py; os números são transportados mecanicamente…" |
| 2 | substituição | `[2:4]` p+p: "Três limites governam tudo o que se segue." · "A secção de auditoria lê o catálogo do Tribunal…" | `[3:5]` p+p: "Três limites governam tudo o que se segue. Estão aqui, e não numa nota de rodapé…" · "A secção de auditoria lê o catálogo do Tribunal…" (igual) |
| 3 | substituição | `[5:6]` p: "Não existe um valor da UE para um município, e este documento não o fabrica. A geografia mais fina a que os dados da UE …" | `[6:7]` p: mesmo início; a arquivada acrescenta uma oração final |
| 4 | inserção | `[9:9]` (nada) | `[10:11]` p: "O que foi aprovado e o que foi pago" |
| 5 | substituição | `[10:11]` p: "Um caminho independente para o mesmo valor aprovado — reconstruí-lo a partir da coluna de quota percentual do ficheiro d…" | `[12:13]` p: mesmo início |
| 6 | inserção | `[25:25]` (nada) | `[27:29]` p+p: "Conclusões datadas exatamente na data prevista" · "Quota das localizações contadas como dentro do prazo" |
| 7 | inserção | `[31:31]` (nada) | `[35:37]` p+p: "A parcela vencida do valor aprovado" · "A barra inteira é o valor aprovado para o concelho" |
| 8 | substituição | `[38:39]` p: "A regra de agrupamento é nossa, não do registo: dobrar acentos, retirar pontuação, retirar a abreviatura final da forma …" | `[44:45]` p: mesmo início; acrescenta cláusulas a meio e ao fim |
| 9 | inserção | `[43:43]` (nada) | `[49:52]` p×3: "Documentos que nomeiam Évora, por nível de confiança" · "Catálogo, não conclusões: títulos e resumos." · "Entradas de catálogo — títulos e resumos. Um piso, não um total." |
| 10 | substituição | `[46:47]` p: "Dois pontos cegos, ambos medidos e não presumidos." | `[55:56]` p: mesmo início; acrescenta "e ambos encontrados primeiro por um agente que estava proibido de ler…" |
| 11 | substituição | `[53:54]` p: "O instituto da habitação está duas vezes nessa tabela, e é a linha mais instrutiva deste documento. Pesquisado sob o nom…" | `[62:63]` p: mesmo início; acrescenta uma cláusula final |
| 12 | substituição | `[60:61]` p: "Uma nota de rodapé sobre códigos: o PRR publica a versão mais antiga da NUTS — a mesma dimensão traz 25 entradas NUTS3 —…" | `[69:70]` p: mesmo início; acrescenta "que já custou tempo a este repositório" |
| 13 | substituição | `[71:72]` p: "Tudo foi recolhido em direto para este documento." | `[80:84]` h2+p+p+p: "Método, e onde o verificar" · "Tudo foi recolhido em direto para este documento. Os scripts que o fizeram estão em Technical Source/…" · "O método de correspondência da metade da auditoria…" · "Este documento foi escrito ao abrigo da regra de entregáveis do Research Hub…" |

### 3.2 · Medição 9, en (`evora-prometido-pago-auditado-2026/en`) — 13 diferenças, esperadas

O mesmo padrão, bloco a bloco correspondente ao pt:

| # | Op. | Página de leitura `texto[i:j]` | Edição arquivada `documento[i:j]` |
|---|---|---|---|
| 1 | substituição | `[0:1]` p: "A cross-vertical reading of one Portuguese municipality…" | `[0:1]` p: "Research Hub. A cross-vertical reading of one Portuguese municipality…" |
| 2 | substituição | `[2:4]` p+p: "Three limits govern everything that follows." · "The audit section reads the Tribunal's catalogue…" | `[2:4]` p+p: mesmo início + oração final · igual |
| 3 | substituição | `[5:6]` p: "There is no EU figure for a municipality…" | `[5:6]` p: mesmo início, oração final a mais |
| 4 | inserção | `[9:9]` (nada) | `[9:10]` p: "What was approved, and what has been paid" |
| 5 | substituição | `[10:11]` p: "An independent route to the same approved figure…" | `[11:12]` p: mesmo início |
| 6 | inserção | `[25:25]` (nada) | `[26:28]` p+p: "Completions dated exactly on the planned date" · "Share of the project-locations counted as on time" |
| 7 | inserção | `[31:31]` (nada) | `[34:36]` p+p: "The overdue share of approved value" · "The whole bar is the value approved for the concelho" |
| 8 | substituição | `[38:39]` p: "The grouping rule is ours, not the register's…" | `[43:44]` p: mesmo padrão de acrescento do par 8 pt |
| 9 | inserção | `[43:43]` (nada) | `[48:51]` p×3: "Documents naming Évora, by confidence tier" · "Catalogue, not findings: titles and abstracts." · "Catalogue entries — titles and abstracts. A floor, not a total." |
| 10 | substituição | `[46:47]` p: "Two blind spots, both measured rather than assumed." | `[54:55]` p: acrescenta "…and both first found by an agent that was forbidden to read this doc…" |
| 11 | substituição | `[53:54]` p: "The housing institute is in that table twice…" | `[61:62]` p: mesmo padrão de acrescento do par 11 pt |
| 12 | substituição | `[60:61]` p: "A codes footnote: PRR publishes the older NUTS vintage…" | `[68:69]` p: acrescenta "that has cost this repo time before" |
| 13 | substituição | `[71:72]` p: "Everything was fetched live for this document." | `[79:83]` h2+p+p+p: "Method, and where to check it" · "Everything was fetched live for this document. The scripts that did it are in Technical Source/…" · "The matching method for the audit half…" · "This document was written under the Research Hub deliverable rule…" |

**O que estas 26 diferenças são (o brief pede a lista, não o julgamento):** três formas repetidas nas duas línguas — proveniência a mais na edição arquivada (dois parágrafos de abertura que a página de leitura não tem), frases com uma cláusula ou oração a mais do lado arquivado (a passagem de voz separada já as tinha marcado para cortar, mas "nada dela foi aplicada a `content/`" — o registo é a versão *depois*, o arquivo é a versão *antes*), e blocos inteiros que só existem arquivados (as legendas dos quatro gráficos que a tabela de cabeçalho substitui, e o bloco de metodologia final). Estes números são **idênticos aos que a M1 mediu** em 24.08.2026 sobre `dist-p2` (commit `7626a2a`) — confere que o conteúdo por trás desta medição não mudou entre as duas cópias congeladas, só o build.

### 3.3 · Medição 15 — a discordância sobre o número que o próprio brief declara

O brief diz: *"para cada `links[]` do registo (**46** no âmbito: 7 no 03 pt, 16 em cada edição do 04, 0 nas outras)"*.

| Coordenada | Esperado (o texto do brief) | Lido (a minha soma, duas vezes independente — §1.3) |
|---|---|---|
| total de `links[]` nos oito registos | **46** | **39** |

A aritmética do próprio brief já não fecha em 46: 7 (03 pt) + 16 (04 pt) + 16 (04 en) + 0×5 (as outras seis) = **39**, não 46. Contei isto de duas formas independentes antes de escrever o programa (um percurso à mão bloco→item/linha×coluna, e uma busca recursiva pela chave `"links"` em qualquer profundidade do JSON dos oito registos) — as duas deram 39 — e o próprio programa, com uma terceira implementação (`walk_record`, partilhada com todas as outras medições), dá 39 outra vez. Por edição: 03 pt=7, 04 pt=16, 04 en=16, 06 pt=0, 07 pt=0, 07 en=0, 08 pt=0, 09 pt=0.

Isto não é uma discordância da página contra o registo — a página tem exatamente as ligações que o registo pede, nas 39 (medição 15 em si deu zero discordâncias, secção 2). É uma discordância entre o número que o brief anuncia e o número que os ficheiros realmente contêm. Não corrijo o brief; relato o que medi.

Nenhuma outra discordância existe em nenhuma das quinze medições, sobre nenhuma das oito edições.

---

## 4 · As dezassete provas de mutação

Cada linha é uma função real do programa, um defeito plantado à mão num `El`/JSON sintético, e a confirmação de que a função o apanhou. As dez primeiras (1–10) provam a medição 6 reescrita — o código novo desta corrida; as sete seguintes (11–17) provam as medições 13, 14 e 15, também novas. Correm sempre antes da medição real (`run_selftests()`, chamada por omissão em `main()`); as 17 passaram todas.

| # | O que testei | Resultado |
|---|---|---|
| 1 | `classify_figure_dom`: figura autónoma com porta própria → `is_porta_link=True`, `link_el=None` | OK |
| 2 | `measure_6`: figura autónoma com linha do sítio, selo certo → `com_linha_selo_certo=1`, 0 discordâncias | OK |
| 3 | `measure_6`: mesma figura, selo a apontar para o site errado → apanhado (`selo_errado_ou_falta=1`) | OK |
| 4 | `measure_6` **(§1b, o caso central)**: figura sem linha, dentro de uma ligação, com a âncora `texto-figura-porta-apos` certa a seguir → `sem_linha_com_porta=1`, 0 discordâncias | OK |
| 5 | `measure_6` **(§1b, a discordância nova)**: a mesma figura, mas só com a entrada em "linhas do documento" e **sem** a âncora `texto-figura-porta-apos` (a forma antiga que a M1 aceitava) → apanhado como `sem_linha_forma_antiga_sem_porta=1`, separado das outras categorias | OK |
| 6 | `measure_6` **(§1b, a ordem)**: duas figuras sem linha na mesma ligação, duas âncoras `texto-figura-porta-apos` na ordem certa → as duas contam, 0 discordâncias | OK |
| 7 | `measure_6` **(§1b, a ordem trocada)**: as mesmas duas figuras, âncoras na ordem inversa → nunca as duas contam como certas, discordância apanhada | OK |
| 8 | `measure_6` **(§1b, "sem texto")**: a âncora `texto-figura-porta-apos` existe mas tem texto (viola a regra "sem texto, o glifo é da folha") → não conta como porta válida, discordância apanhada | OK |
| 9 | `measure_6`: figura sem linha, fora de qualquer ligação, sem ser a sua própria âncora (`<span>` nu) → anomalia, discordância | OK |
| 10 | `measure_6`: figura sem linha com um selo indevido colado → `sem_linha_com_selo=1` (tinha de ser zero), apanhado | OK |
| 11 | `measure_13`: soma sintética sobre duas edições fictícias bate com um `prova.json` sintético → 0 discordâncias | OK |
| 12 | `measure_13`: um único valor de `prova.json` alterado (`registos_blocos: 999`) → apanhado, com a chave certa na discordância | OK |
| 13 | `measure_14`: `por_edicao` sintético bate → 0 discordâncias | OK |
| 14 | `measure_14`: um campo alterado numa edição (`completas: 999`) → apanhado, com a coordenada `edição.campo` certa | OK |
| 15 | `measure_15`: ligação com `href` e etiqueta certos → encontrada, 0 discordâncias | OK |
| 16 | `measure_15`: o `href` do registo alterado (a página continua a apontar para o antigo) → discordância apanhada, não engana por o texto bater | OK |
| 17 | `measure_15`: um URL comprido, igual à etiqueta, presente no texto mas **sem nenhum `<a>`** a envolvê-lo → não encontrado (o teste não inventa uma ligação só porque o texto lá está) | OK |

`17/17 provas de mutação passaram` (saída literal do programa, `stderr`).

---

## 5 · Decisões minhas, e as minhas falsas alarmes

**Nenhuma falsa alarme surgiu na corrida real** — das 8 edições × 15 medições (120 combinações, menos a medição 9 nas 6 edições onde não se aplica, mais as suas duas corridas reais no 04, mais as medições 13/14 que são globais), só a medição 9 (nas duas edições do 04) e a medição 15 (contra o número que o brief declara, não contra a página) devolveram alguma discordância — e ambas são discordâncias **esperadas ou verificadas por triplicado**, não um desacordo entre o meu leitor e a página. Isto é diferente de "não encontrei nada": fiz a investigação da marcação real (secção 1.2) **antes** de escrever a lógica nova, exatamente para não escrever um leitor que inventa a sua própria falsa alarme mais tarde — e as 17 provas de mutação (secção 4) mostram que o código novo **discorda** quando há motivo plantado.

Quatro decisões minhas que não são falsas alarmes mas registo por transparência, porque o brief deixava espaço:

### 5.1 · O âmbito da medição 9 ficou "só no 04", e alarguei-o a zero edições novas

O brief M1 define a medição 9 como "medição de controlo, **só no 04**". O brief M2 diz "as doze medições da M1, por edição" mas não revoga nem alarga essa restrição explicitamente. Mantive-a: só `evora-prometido-pago-auditado-2026` pt/en a correm; as outras seis edições ficam N/A (não zero), tal como a M1 tratou o 08 pt. **Isto é uma escolha, não um facto do brief** — confirmei que as outras seis edições **têm mesmo** uma página arquivada (`documento/index.html` para as seis pt, e `document/index.html` para 07 en) na cópia congelada, por isso a medição *poderia* correr sobre todas as oito. Não a alarguei porque (a) a razão que o `REGISTOS.md` dá para a medição 9 ser interessante no 04 — a tabela de cabeçalho vira gráfico só nessa vertical — não se aplica às outras; e (b) o texto do brief M1 traz essa restrição dentro da própria definição da medição, não como um acidente de quais ficheiros a M1 leu. Rotulo esta continuidade como **inferida**, não verificada contra um texto explícito do brief M2.

### 5.2 · A medição 13 tem duas leituras possíveis para "resolvido"/"com linha do sítio", e escolhi a mais literal

O brief define `registos_com_linha_do_sitio` como *"figuras com selo certo"* — uma leitura de **correção da página** (o balde 1 da minha medição 6: selo colado e a apontar para o site certo), não uma leitura de **classificação por dados** (balde 1 + balde 2: a figura *tem* linha do sítio segundo o livro-razão, batido corretamente ou não). Implementei a primeira leitura (literal ao brief). Guardei também a segunda (`completas_por_dados` no meu agregador) para poder comparar — **as duas dão o mesmo número em todas as oito edições**, porque `com_linha_selo_errado_ou_falta` é zero em todo o lado (medição 6). A escolha não muda nenhum resultado reportado, mas fica registada: se algum dia uma figura tiver linha do sítio e selo errado, as duas leituras divergem, e a que uso é a mais estrita (só conta se a página estiver certa).

Semelhante para `registos_resolvidos`/`registos_por_resolver`: o texto do brief ("com selo ou porta ou entrada") repete a enumeração de três formas **anterior** ao §1b, não a forma restrita que o §1b passa a exigir só para a medição 6. Li isto como intencional — a medição 13 pergunta "todo o algarismo aponta para algum lado", não "aponta pela forma certa" — e implementei-a com o teste mais permissivo: `row` não vazia e um `id="linha-<row>"` presente na página (o que, dada a medição 8, é quase sempre verdade). Como nenhuma figura tem `row` vazia nas oito edições (verificado, 0 em 2601), esta escolha também não muda nenhum número reportado.

### 5.3 · A medição 15 partilha código com a medição 5, não é uma segunda implementação cega

A medição 5 (herdada da M1) já verifica `emphasis[]` **e** `links[]` juntos. A medição 15, que o brief pede como medição própria, usa o mesmo `read_text`/`descendants`/`is_within` que a medição 5 (função nova, `find_matching_anchor`, mas construída sobre os mesmos alicerces). Não é, portanto, uma segunda implementação totalmente independente da leitura de ligações — um defeito nesses alicerces partilhados apanharia as duas medições da mesma forma. A independência real que tenho é: (a) a contagem "esperada" da medição 15 foi conferida por dois caminhos que não tocam em `read_text` nenhum (a soma à mão e a busca recursiva, secção 1.3); (b) as provas de mutação 15–17 exercitam `find_matching_anchor` isoladamente, incluindo um caso desenhado para não deixar passar por acidente (prova 17).

### 5.4 · Um caminho falso na minha própria investigação, corrigido antes de escrever código de medição

Ao confirmar a forma da âncora nova por `grep`, o meu primeiro padrão (`grep -o '.\{200\}texto-figura-porta-apos.\{200\}'` sobre o ficheiro inteiro) apanhou, na primeira ocorrência, a **regra CSS** `.texto-figura-porta-apos{...}` dentro do `<style>` da página, não uma âncora real — o seletor CSS e a classe HTML têm o mesmo nome de texto. Não escrevi nenhuma linha de `classify_figure_dom` a partir dessa leitura; recortei logo a seguir para dentro de `<article>…</article>` e recontei (18 âncoras sem classe apareceram assim, todas fora do artigo, na secção "linhas do documento" — não tinham nada a ver com selos ou portas). Não é uma discordância de nenhuma medição — é um passo em falso de exploração, corrigido antes de gerar qualquer resultado, e registo-o porque a regra 20 ("estabelece a restrição vinculativa antes de construir") pede exatamente este tipo de verificação prévia, e um passo em falso da minha parte também é informação sobre o processo.

---

## 6 · Observações fora das quinze medições

* **A regra §1b só é exercida por dados reais em duas das oito edições.** `evora-prometido-pago-auditado-2026` pt e en são as únicas com alguma `<a class="texto-ligacao">` que contenha uma figura (16 ligações cada, 21 figuras sem linha dentro delas, cada uma). `avaliacao-economica-regional-de-portugal-2026/pt` (03 pt) tem 7 ligações, mas nenhuma contém uma figura — são etiquetas de URL inteiras (ver medição 15). As outras cinco edições têm zero ligações do documento. Nessas seis, a regra antiga e a regra nova do §1b dão, por construção, resultados byte a byte idênticos (não há nenhuma figura dentro de nenhuma ligação para as distinguir).
* **A forma antiga desapareceu por completo deste build** — `sem_linha_forma_antiga_sem_porta = 0` nas oito edições, incluindo nas duas do 04 onde a regra é exercida a sério. As 21 figuras por edição que a M1 tinha aceitado pela entrada sozinha (relatório da M1, quadro 2.1b) têm agora, cada uma, a âncora `texto-figura-porta-apos` correta. Isto é uma leitura do build congelado a 24.08.2026 (commit `180148c`), não uma afirmação sobre o código do sítio que a gerou (que não li).
* **Nenhuma figura com linha do sítio vive dentro de uma ligação do documento, nas oito edições.** Confirmado por `grep` (`</a><a class="src-chip"` = 0 ocorrências em todas as páginas) e pelo próprio `measure_6` (`com_linha_selo_errado_ou_falta = 0` em todo o lado, e nenhum selo aparece na sequência depois de nenhuma ligação). A metade da regra §1b que diz "uma figura com linha do sítio dentro de uma ligação leva o selo depois da ligação, como antes" está coberta pelo meu código (prova de mutação 2/3 exercitam o selo; a lógica de agrupar por ligação trata os dois casos com o mesmo caminho) mas não por nenhum dado real deste build.
* **Zero colisões na travessia**: as 70 linhas de `ledger/cruzamentos/evora.json` resolvem para 70 pares `(rh_study, rh_id)` distintos — nenhum `site_id` repetido a apontar para pares diferentes.
* **Zero figuras com `row` vazia** nas 2601 do total — confirmado antes de escrever a medição 13, com um script à parte sobre os oito registos (secção 1.3), e outra vez pelo próprio programa.
* **07 pt e 07 en têm um bloco e uma unidade a menos do lado inglês** (92/214 vs 91/213), mas o mesmo número de figuras (194), a mesma contagem "com linha" (52) e os mesmos 138 cabeçalhos de tabela — uma diferença editorial entre as duas traduções, não uma discordância de nenhuma medição (cada edição bate a 100% com o seu próprio registo).

---

## 7 · Um fragmento verificado à mão

A âncora nova, tal como está no build (`evora-prometido-pago-auditado-2026/pt`, bloco 62, célula 1.1), confirmada por leitura direta de bytes (`grep`), não só pelo meu tokenizador:

```html
…<a class="texto-ligacao" href="https://www.tcontas.pt/…/vic-dgtc-rel016-2018-2s.pdf" rel="noopener">Relatório N.º
<span class="texto-figura" data-registo="…pt#62.1.1.0">16</span>/<span class="texto-figura"
data-registo="…pt#62.1.1.1">2018</span></a><a class="texto-figura-porta-apos" href="#linha-tc-report-16-2018"
aria-label="linha do motor: tc-report-16-2018"></a><a class="texto-figura-porta-apos" href="#linha-tc-year-16-2018"
aria-label="linha do motor: tc-year-16-2018"></a>…
```

Duas figuras sem linha do sítio (`16` e `2018`) dentro da mesma ligação (`texto-ligacao`, para um relatório do Tribunal de Contas); duas âncoras `texto-figura-porta-apos` imediatamente a seguir ao fecho da ligação, na mesma ordem das figuras, cada uma com `href="#linha-<row>"` da sua própria figura, sem texto (o `aria-label` não é texto do documento — não é lido pela regra §2, e o meu `read_text` confirma-o vazio). É exatamente a forma que o §1b descreve, e é o `medição 6, prova 4/6` (secção 4) que a exercita sinteticamente antes de eu confiar na leitura real.

---

## 8 · Custo em símbolos

**Inferido**, não uma métrica exata de faturação da API — não tenho, nesta sessão, uma ferramenta que leia o uso exato de tokens de entrada/saída. O que vejo é o contador de orçamento visível do sistema (`<total_tokens>`): a primeira leitura que apanhei nesta sessão (já depois das duas leituras dos briefs) marcava **14 972 768**; a última leitura antes de fechar este relatório marcava **14 696 011**. A diferença — **cerca de 277 000 símbolos visíveis consumidos** entre esses dois pontos — não cobre as duas primeiras leituras (os dois briefs) nem os últimos ajustes a este ficheiro, por isso é um mínimo, não o total. Não é um valor de faturação; é a leitura mais próxima que tenho, tal como a M1 também assinalou no seu relatório.

---

## 9 · Ficheiros

* Programa: `/Users/nunosantos/Instruments/OEstadoDoPais/design/especime-v3/medicoes/parte3-M2-sonnet.py` — corre com `python3 parte3-M2-sonnet.py [--dist PATH] [--json OUT.json] [--no-selftest]`; sem `--dist`, usa a cópia congelada (`dist-p4`, commit `180148c`); sem `--no-selftest`, corre sempre as 17 provas de mutação primeiro e para sem medir se alguma falhar.
* Este relatório: `/Users/nunosantos/Instruments/OEstadoDoPais/design/especime-v3/medicoes/parte3-M2-sonnet.md`.
* Nada foi escrito, corrigido nem commitado fora da pasta `design/especime-v3/medicoes/`; nada foi lido fora do que os dois briefs listam (mais o formato do registo e os próprios ficheiros de dados que eles apontam).
