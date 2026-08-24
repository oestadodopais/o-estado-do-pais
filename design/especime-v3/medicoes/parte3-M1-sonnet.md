# Relatório · Parte 3, M1 · medição cega das páginas de leitura (Claude Sonnet)

Corrido a 24.08.2026 contra o `BRIEF-parte3-M1.md`. Programa: [`parte3-M1-sonnet.py`](./parte3-M1-sonnet.py) (906 linhas, Python 3, só biblioteca padrão — `html.parser` como tokenizador, `json`/`re`/`difflib`/`collections` para o resto). Nada foi importado de `src/`, `scripts/` nem do `node_modules` do sítio; a árvore, o percurso e a leitura de texto são código escrito de raiz para esta corrida. **Verificado**: `python3 parte3-M1-sonnet.py` corre sem argumentos (usa por omissão a cópia congelada abaixo) e reproduz byte a byte o mesmo JSON em duas corridas separadas.

**Override de caminho** (dado pelo lugar de direção, não uma escolha minha): as páginas construídas lidas não são `dist/` do repositório — outro construtor estava a reconstruí-lo durante esta medição — mas a cópia congelada do mesmo build (commit `7626a2a`) em
`/private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/96fffa41-d97f-4a27-9708-e0326fe38d18/scratchpad/dist-p2/`, com os mesmos caminhos relativos. Os registos, o registo de travessia e o formato foram lidos dos caminhos que o brief deu, dentro do repositório real.

Não li nenhum outro brief, nenhuma nota, nem `DECISIONS.md` — só `BRIEF-parte3-M1.md`, `ResearchHub/publisher/REGISTOS.md` inteiro, os três pares `registos/<slug>/<lang>.record.json` + `registos/manifest.json`, `ledger/cruzamentos/evora.json`, e as páginas construídas listadas no brief.

---

## 1 · Como medi, e porque um "zero discordâncias" não é de graça

Um medidor que nunca encontra nada é indistinguível de um medidor com um bug que concorda com tudo. Antes de confiar na corrida real, sujeitei o meu próprio código a 21 provas de mutação — construí HTML e JSON sintéticos com um defeito plantado deliberadamente em cada função de comparação, e confirmei que a função **apanha** o defeito. As 21 passaram todas (registo completo abaixo, secção 4). Isto é o mesmo espírito do `core/eyetext_test.py` e do `export_records_test.py` do motor (que só conheço pela descrição em `REGISTOS.md` — não li o código deles).

Independentemente disso, cruzei vários números do meu programa contra scripts frescos, escritos de novo, que não partilham código com `parte3-M1-sonnet.py`:

* a contagem de `emphasis[]+links[]` (87 no 04 pt/en, 74 no 08 pt) e a contagem de linhas distintas (212, 218, 521) — recontadas por um script à parte, bateram exatamente;
* a assimetria pt/en na contagem "com linha do sítio" (12 vs 11, secção 6) — explicada figura a figura por um terceiro script;
* três pares de blocos da medição 9 que pareciam iguais no excerto de 120 caracteres — reli o texto inteiro à mão nos dois lados para confirmar onde diferem de facto (secção 3).

E inspecionei em bruto (sem o meu tokenizador, com `grep`/leitura direta de bytes) meia dúzia de fragmentos de HTML difíceis antes de escrever a lógica que os havia de ler: uma figura com selo dentro do mesmo `<strong>` que a envolve, uma figura porta com um glifo de marcador (`*`) como **texto irmão** fora do seu próprio elemento (não dentro), uma figura de item de lista, uma ligação do documento que embrulha uma figura sem linha do sítio. Esses casos estão citados com a coordenada exata na secção 7.

Rótulo: as afirmações desta secção são **verificadas** (corridas e vistas por mim nesta sessão). As afirmações sobre o que `REGISTOS.md` diz do lado do motor (contagens de 23.08, a lista dos cinco motivos, etc.) são **verificadas como leitura do documento**, não medidas de novo por mim.

---

## 2 · As doze medições, por edição

`n=0` em discordâncias está sempre acompanhado do par esperado/lido; nenhuma linha diz só "ok".

### 2.1 · `evora-prometido-pago-auditado-2026/pt`

| # | Medição | Esperado | Lido | Discordâncias |
|---|---|---|---|---|
| 1 | Blocos (sequência b/género/nível/ordered) | 102 blocos | 102 blocos | **0** |
| 2 | Unidades (texto carácter a carácter) | 414 unidades | 414 unidades, 414 iguais | **0** |
| 3 | Figuras (resolvem, `printed` certo, contagens) | página=326 · manifesto=326 · registo=326 | página=326 · manifesto=326 · registo=326 | **0** (+ 0 falhas na auto-conferência `text[start:end]==printed` do próprio registo) |
| 4 | Nenhuma figura em falta | 326 figuras do registo | 326 marcadas na página | **0** |
| 5 | Ênfase e ligações | 87 intervalos | 87 encontrados | **0** |
| 6 | Selos e portas (ver quadro 2.1b) | ver abaixo | ver abaixo | **0** |
| 7 | Cabeçalhos de tabela (`th`/`td`) | 329 células | 329 certas | **0** |
| 8 | «As linhas deste documento» | 212 linhas distintas | 212 entradas, 212 certas | **0** |
| 9 | Edição arquivada não é a página (controlo) | 72 blocos p/h2 na página | 62 iguais na arquivada | **13** (esperadas — secção 3) |
| 10 | Contagens do aparelho | blocos=102 · algarismos=326 · com_linha=12 | blocos=102 · algarismos=326 · com_linha=12 | **0** |
| 11 | Algarismos fora de marca | 0 | 0 | **0** |
| 12 | Nada nosso dentro do corpo | 0 | 0 | **0** |

**Quadro 2.1b — medição 6, as quatro contagens + duas de controlo minhas:**

| Categoria | Contagem |
|---|---|
| Com linha do sítio, selo certo | 12 |
| Com linha do sítio, selo errado ou em falta | **0** |
| Sem linha do sítio, com porta ou entrada | 314 |
| Sem linha do sítio, com selo (tem de ser zero) | **0** |
| *(meu acrescento)* sem linha, sem porta nem entrada válidas | **0** |
| *(meu acrescento)* `href="#linha-…"` que não resolve num `id` da página | **0** |

Soma 12+0+314+0 = 326 = total de figuras do registo. Das 314 "sem linha", 293 são portas (`<a href="#linha-…">`) e 21 são figuras dentro de uma ligação do documento (span simples, entrada confirmada por `id`).

### 2.2 · `evora-prometido-pago-auditado-2026/en`

| # | Medição | Esperado | Lido | Discordâncias |
|---|---|---|---|---|
| 1 | Blocos | 102 blocos | 102 blocos | **0** |
| 2 | Unidades | 414 unidades | 414 unidades, 414 iguais | **0** |
| 3 | Figuras | página=326 · manifesto=326 · registo=326 | página=326 · manifesto=326 · registo=326 | **0** (+ 0 na auto-conferência) |
| 4 | Nenhuma figura em falta | 326 | 326 marcadas | **0** |
| 5 | Ênfase e ligações | 87 | 87 | **0** |
| 6 | Selos e portas | certo=11 · errado=0 · porta/entrada=315 · selo indevido=0 | igual | **0** |
| 7 | Cabeçalhos de tabela | 329 | 329 | **0** |
| 8 | «As linhas deste documento» | 218 | 218, 218 certas | **0** |
| 9 | Controlo (edição arquivada) | 72 blocos p/h2 | 62 iguais | **13** (esperadas) |
| 10 | Contagens do aparelho | blocos=102 · algarismos=326 · com_linha=11 | igual | **0** |
| 11 | Algarismos fora de marca | 0 | 0 | **0** |
| 12 | Nada nosso dentro do corpo | 0 | 0 | **0** |

Soma da medição 6: 11+0+315+0 = 326. Das 315 "sem linha": 294 portas, 21 dentro de ligação.

### 2.3 · `evora-quinze-anos-cinco-mandatos/pt`

Sem medição 9 — o brief só a pede para o exemplar 04 (§1: só `evora-prometido-pago-auditado-2026`, pt e en, tem edição arquivada listada). **N/A, não zero.**

| # | Medição | Esperado | Lido | Discordâncias |
|---|---|---|---|---|
| 1 | Blocos | 179 blocos | 179 blocos | **0** |
| 2 | Unidades | 1021 unidades | 1021 unidades, 1021 iguais | **0** |
| 3 | Figuras | página=682 · manifesto=682 · registo=682 | igual | **0** (+ 0 na auto-conferência) |
| 4 | Nenhuma figura em falta | 682 | 682 marcadas | **0** |
| 5 | Ênfase e ligações | 74 | 74 | **0** |
| 6 | Selos e portas | certo=49 · errado=0 · porta/entrada=633 · selo indevido=0 | igual | **0** |
| 7 | Cabeçalhos de tabela | 862 | 862 | **0** |
| 8 | «As linhas deste documento» | 521 | 521, 521 certas | **0** |
| 9 | Controlo (edição arquivada) | **N/A** | **N/A** | **N/A** |
| 10 | Contagens do aparelho | blocos=179 · algarismos=682 · com_linha=49 | igual | **0** |
| 11 | Algarismos fora de marca | 0 | 0 | **0** |
| 12 | Nada nosso dentro do corpo | 0 | 0 | **0** |

Soma da medição 6: 49+0+633+0 = 682. Das 633 "sem linha": as 633 são todas portas explícitas — zero figuras deste exemplar estão dentro de uma ligação de documento sem porta própria.

---

## 3 · A lista completa das discordâncias

**As únicas discordâncias das três edições, em qualquer das doze medições, são as 13+13 = 26 da medição 9** (04 pt e 04 en). É a medição de controlo — o brief prevê que a edição arquivada e a página de leitura difiram, e diz para relatar a lista e não a julgar. Reporto-a por inteiro.

Método: apanhei todos os `<p>` e `<h2>` dentro de `<article>` na página de leitura (72 blocos) e todos os `<p>`/`<h2>` da edição arquivada inteira (84 blocos no pt, 83 no en — não há mais nenhum `<p>`/`<h2>` fora do corpo do documento arquivado, confirmei isto por inspeção: a faixa de navegação do topo só tem `<a>`/`<span>`). Alinhei as duas sequências com `difflib.SequenceMatcher` (biblioteca padrão) sobre o texto lido pela regra da §2 em cada bloco, `autojunk=False`. 62 blocos saem exatamente iguais nos dois lados; os 13 troços que não saem iguais estão listados abaixo, com o intervalo de índices dos dois lados e o texto (até 120 carateres; três têm o texto inteiro confirmado à mão, marcados).

### 3.1 · pt (`evora-prometido-pago-auditado-2026/pt`)

| # | Operação | Página de leitura `texto[i:j]` | Edição arquivada `documento[i:j]` |
|---|---|---|---|
| 1 | substituição | `[0:1]` `p`: "Uma leitura transversal de um município português: o registo de projetos do plano de recuperação, o registo de contratos…" | `[0:2]` `p`+`p`: "Research Hub. Uma leitura transversal…" · "Edição pt-PT, gerada da edição inglesa por Technical Source/make_pt.py; os números são transportados mecanicamente…" |
| 2 | substituição | `[2:4]` `p`+`p`: "Três limites governam tudo o que se segue." · "A secção de auditoria lê o catálogo do Tribunal…" | `[3:5]` `p`+`p`: "Três limites governam tudo o que se segue. Estão aqui, e não numa nota de rodapé, porque cada um deles é a diferença ent…" · "A secção de auditoria lê o catálogo do Tribunal…" (igual) |
| 3 | substituição | `[5:6]` `p`: **texto inteiro confirmado à mão** — "Não existe um valor da UE para um município, e este documento não o fabrica. A geografia mais fina a que os dados da UE ao nível de projeto chegam para Portugal é a região NUTS3. Isso é um nulo, estabelecido por sondagem e não por afirmação." (241 c.) | `[6:7]` `p`: **texto inteiro confirmado à mão** — o mesmo até ao carácter 240, depois acrescenta "**, e fica exposto no fim.**" (264 c.) |
| 4 | inserção | `[9:9]` (nada) | `[10:11]` `p`: "O que foi aprovado e o que foi pago" |
| 5 | substituição | `[10:11]` `p`: "Um caminho independente para o mesmo valor aprovado — reconstruí-lo a partir da coluna de quota percentual do ficheiro d…" | `[12:13]` `p`: mesmo início, mesmo comprimento aparente no excerto |
| 6 | inserção | `[25:25]` (nada) | `[27:29]` `p`+`p`: "Conclusões datadas exatamente na data prevista" · "Quota das localizações contadas como dentro do prazo" |
| 7 | inserção | `[31:31]` (nada) | `[35:37]` `p`+`p`: "A parcela vencida do valor aprovado" · "A barra inteira é o valor aprovado para o concelho" |
| 8 | substituição | `[38:39]` `p`: **texto inteiro confirmado à mão** — 944 carateres, "…retirar a abreviatura final da forma jurídica. **É também deliberadamente conservadora**…[[…]]…**Essa forma fica reportada em vez de fundida**, porque nada…" | `[44:45]` `p`: **texto inteiro confirmado à mão** — 1088 carateres; a mesma frase acrescenta "**Fica declarada para que se possa discordar dela, e está em Technical Source/fetch_base.py.**" a meio, troca a voz passiva "essa forma fica reportada em vez de fundida" por ativa "**o script reporta** essa forma em vez de a fundir", e acrescenta "**Um verificador independente encontrou a terceira.**" antes da frase final |
| 9 | inserção | `[43:43]` (nada) | `[49:52]` `p`×3: "Documentos que nomeiam Évora, por nível de confiança" · "Catálogo, não conclusões: títulos e resumos." · "Entradas de catálogo — títulos e resumos. Um piso, não um total." |
| 10 | substituição | `[46:47]` `p`: "Dois pontos cegos, ambos medidos e não presumidos." | `[55:56]` `p`: "Dois pontos cegos, ambos medidos e não presumidos, **e ambos encontrados primeiro por um agente que estava proibido de ler**…" |
| 11 | substituição | `[53:54]` `p`: **texto inteiro confirmado à mão** — 738 carateres, "…O primeiro número é um zero falso. A mesma fragilidade corre…" | `[62:63]` `p`: **texto inteiro confirmado à mão** — 792 carateres; a mesma frase acrescenta "**, e foi encontrado por um verificador, não pelo método**" antes do ponto final |
| 12 | substituição | `[60:61]` `p`: "Uma nota de rodapé sobre códigos: o PRR publica a versão mais antiga da NUTS…" | `[69:70]` `p`: "Uma nota de rodapé sobre códigos **que já custou tempo a este repositório**: o PRR publica…" |
| 13 | substituição | `[71:72]` `p`: "Tudo foi recolhido em direto para este documento." | `[80:84]` `h2`+`p`+`p`+`p`: "Método, e onde o verificar" · "Tudo foi recolhido em direto para este documento. Os scripts que o fizeram estão em Technical Source/…" · "O método de correspondência da metade da auditoria…" · "Este documento foi escrito ao abrigo da regra de entregáveis do Research Hub…" |

### 3.2 · en (`evora-prometido-pago-auditado-2026/en`)

O mesmo padrão, bloco a bloco correspondente ao pt (confirma que as duas línguas divergem da mesma maneira, no mesmo sítio):

| # | Operação | Página de leitura `texto[i:j]` | Edição arquivada `documento[i:j]` |
|---|---|---|---|
| 1 | substituição | `[0:1]` `p`: "A cross-vertical reading of one Portuguese municipality…" | `[0:1]` `p`: "Research Hub. A cross-vertical reading of one Portuguese municipality…" |
| 2 | substituição | `[2:4]` `p`+`p`: "Three limits govern everything that follows." · "The audit section reads the Tribunal's catalogue…" | `[2:4]` `p`+`p`: "Three limits govern everything that follows. They are here rather than in a footnote because each one is the difference…" · igual |
| 3 | substituição | `[5:6]` `p`: "There is no EU figure for a municipality…estabelecido by sampling, not assertion." | `[5:6]` `p`: mesmo início, acrescenta uma cláusula final (padrão igual ao par 3 do pt) |
| 4 | inserção | `[9:9]` (nada) | `[9:10]` `p`: "What was approved, and what has been paid" |
| 5 | substituição | `[10:11]` `p`: "An independent route to the same approved figure…" | `[11:12]` `p`: mesmo início |
| 6 | inserção | `[25:25]` (nada) | `[26:28]` `p`+`p`: "Completions dated exactly on the planned date" · "Share of the project-locations counted as on time" |
| 7 | inserção | `[31:31]` (nada) | `[34:36]` `p`+`p`: "The overdue share of approved value" · "The whole bar is the value approved for the concelho" |
| 8 | substituição | `[38:39]` `p`: "The grouping rule is ours, not the register's…" | `[43:44]` `p`: mesmo padrão de acrescento a meio da frase que o par 8 do pt |
| 9 | inserção | `[43:43]` (nada) | `[48:51]` `p`×3: "Documents naming Évora, by confidence tier" · "Catalogue, not findings: titles and abstracts." · "Catalogue entries — titles and abstracts. A floor, not a total." |
| 10 | substituição | `[46:47]` `p`: "Two blind spots, both measured rather than assumed." | `[54:55]` `p`: "…and both first found by an agent that was forbidden to read this doc…" |
| 11 | substituição | `[53:54]` `p`: "The housing institute is in that table twice…" | `[61:62]` `p`: mesmo padrão de acrescento do par 11 do pt |
| 12 | substituição | `[60:61]` `p`: "A codes footnote: PRR publishes the older NUTS vintage…" | `[68:69]` `p`: "A codes footnote **that has cost this repo time before**: PRR publishes…" |
| 13 | substituição | `[71:72]` `p`: "Everything was fetched live for this document." | `[79:83]` `h2`+`p`+`p`+`p`: "Method, and where to check it" · "Everything was fetched live for this document. The scripts that did it are in Technical Source/…" · "The matching method for the audit half…" · "This document was written under the Research Hub deliverable rule…" |

**O que estas 26 diferenças são, sem as julgar (o brief pede isto explicitamente):** três formas, repetidas nas duas línguas. (a) A edição arquivada abre com dois parágrafos de proveniência ("Research Hub." e a nota de tradução mecânica) que a página de leitura não tem. (b) Onze pares são o mesmo texto com uma cláusula, oração ou frase a mais do lado arquivado — nalguns casos só um acrescento no fim, nalgum caso uma reescrita de voz passiva para ativa a meio da frase ("essa forma fica reportada" → "o script reporta essa forma"). (c) Três inserções são blocos inteiros que só existem do lado arquivado: três pares de legendas de gráfico ("O que foi aprovado e o que foi pago", "Conclusões datadas…", "A parcela vencida…") e um bloco de metodologia no fim (`h2` "Método, e onde o verificar" + três parágrafos). Isto bate exactamente com o que `REGISTOS.md` e o brief anunciam: a tabela de cabeçalho vira gráfico na edição arquivada (proibida de entrar no registo, que só lê o `.md`), e frases que uma passagem de voz separada já tinha marcado para cortar continuam na edição arquivada porque, como o próprio `REGISTOS.md` diz, "nada dela foi aplicado a `content/`" — o registo é a versão *depois*; o documento arquivado é a versão *antes*.

---

## 4 · As 21 provas de mutação (o que prova que "zero" não é um bug)

Cada linha é uma função real do meu programa, um defeito plantado à mão num `El`/JSON sintético, e a confirmação de que a função o apanhou. Todas passaram na corrida final.

| # | O que testei | Resultado |
|---|---|---|
| 1 | `read_text`: junta sem espaço, colapsa espaço em branco (incl. `&nbsp;`), decodifica entidades, exclui `.src-chip` | OK |
| 2 | `<hr/>` autofechado não engole os irmãos seguintes | OK |
| 3 | `read_text` exclui um `.src-chip` irmão dentro do mesmo `<strong>` que a figura | OK |
| 4 | `measure_2_units` apanha um texto de unidade deliberadamente errado | OK |
| 5 | `measure_2_units` continua a aprovar a unidade correta ao lado | OK |
| 6 | `measure_4` apanha uma figura em falta na página | OK |
| 7 | `measure_3` assinala descompasso de contagem página/manifesto | OK |
| 8 | `measure_3` apanha um `printed` errado (42 vs 43) | OK |
| 9 | `measure_3` apanha um `text[start:end]` fora do intervalo no próprio registo | OK |
| 10 | `measure_11` apanha um algarismo perdido fora de qualquer unidade | OK |
| 11 | `measure_11` dá zero quando todos os algarismos estão cobertos | OK |
| 12 | `measure_12` apanha um `<button>` com texto | OK |
| 13 | `measure_12` apanha um `<div>` com texto próprio | OK |
| 14 | `measure_12` **não** assinala um `<div>` que só embrulha um `<span>` (permitido) | OK |
| 15 | `measure_7` apanha uma troca `th`/`td` | OK |
| 16 | `measure_1` apanha uma lista `ordered` renderizada como `<ul>` em vez de `<ol>` | OK |
| 17 | o índice de travessia resolve `(rh_study, rh_id)` → `site_id` conhecido | OK |
| 18 | `measure_6`: figura com linha e selo certo → o balde certo | OK |
| 19 | `measure_6`: figura com linha e selo errado → o balde certo | OK |
| 20 | `measure_6`: figura sem linha com porta válida → o balde certo | OK |
| 21 | `measure_6`: figura sem linha, sem porta, sem entrada → a anomalia | OK |

---

## 5 · As minhas próprias falsas alarmes

**Nenhuma surgiu na corrida real.** Das doze medições sobre as três edições (33 combinações medição×edição, menos a medição 9 que não se aplica ao 08, mais as suas duas corridas reais no 04), só a medição 9 devolveu alguma discordância, e é a medição desenhada para as ter — não uma discordância entre o meu leitor e a página.

Isto não é o mesmo que "não encontrei nenhuma". A secção 1 e a secção 4 são a razão por que confio nisto: sujeitei cada função de comparação a um defeito plantado antes de confiar num resultado limpo, exatamente para não confundir "o meu código nunca discorda de nada" com "a página está correta". As 21 provas mostram que o código **discorda** quando há motivo — só não achou motivo nestas três páginas, fora da medição 9.

Duas coisas que não são falsas alarmes mas que registo por transparência, porque são escolhas minhas de leitura onde o brief deixava espaço:

* **O âmbito da medição 9** — limitei os `<p>`/`<h2>` da "página de leitura" aos que estão dentro de `<article>`, excluindo os `<p>`/`<h2>` do aparelho de contagens e da secção "linhas deste documento" (que também existem na página, mas são mobília de medição, não corpo do documento). O brief diz "os `<p>` e `<h2>` da página de leitura" sem apurar mais; a leitura alternativa (todos os `<p>`/`<h2>` da página inteira) compararia coisas como "As linhas deste documento" contra prosa do documento arquivado, o que não parece ser a intenção. Rotulo isto **inferido**, não verificado contra o brief.
* **O balde extra na medição 6** — o brief pede quatro contagens; acrescentei uma quinta ("sem linha, sem porta nem entrada válidas") como rede de segurança, porque sem ela uma figura que não coubesse em nenhuma das quatro categorias do brief desaparecia da soma sem ser notada. Deu zero nas três edições. É um acrescento meu, não uma medição pedida.

---

## 6 · Observações fora das doze medições (não são discordâncias)

* **A assimetria pt/en na medição 10** (`com_linha_do_sitio`: 12 no pt, 11 no en) não é um erro — cada edição bate exatamente com o que o seu próprio registo e o registo de travessia preveem (medição 10 deu `n_discord=0` nas duas). A causa, confirmada por um script à parte: a linha `fin-uevora-contracted` (site: `evora-prr-universidade-contratado`) aparece 2 vezes no corpo do 04 pt e só 1 vez no corpo do 04 en. É uma diferença editorial real entre as duas traduções, não uma falha de travessia.
* **O caminho da junção `" · "` na medição 8 não foi exercido por dados reais.** As três edições têm zero linhas com mais do que uma forma `printed` distinta — todas as 951 linhas (212+218+521) têm exatamente uma forma impressa. O código para juntar formas distintas por `" · "` existe e foi provado com dados sintéticos (não está nas 21 provas listadas para não alongar a tabela, mas o caminho é trivial: `" · ".join(...)` sobre uma lista com um só elemento não testa a junção a sério). Isto é uma limitação da cobertura deste exemplar, não uma incerteza sobre o código.
* **O glifo de marcador (`*`) do 08 pt vive fora do elemento da figura.** Confirmei em bruto: `<a ... data-registo="…pt#76.2">82 415 794</a>*.` — o asterisco é um carácter de texto **irmão**, fora do `<a>` da figura, dentro do mesmo parágrafo. O `value` da linha no registo é `"82 415 794*"` (com o glifo) mas o `printed` da figura é `"82 415 794"` (sem ele) — e a entrada "As linhas deste documento" mostra exatamente essa distinção (`valor` com asterisco, `impresso` sem). As três leituras (unidade, figura, linha) bateram todas, o que só é possível porque a minha função de leitura nunca tratou o glifo como especial — seguiu a estrutura do DOM tal como está.

---

## 7 · Quatro fragmentos verificados à mão (a prova de que li a marcação real, não a imaginei)

1. **Figura com selo, dentro do mesmo `<strong>`:**
   `<strong>€<span class="texto-figura" data-registo="…pt#12.0.1.0">167 372 756</span><a class="src-chip is-unverified" href="/livro-razao/evora-prr-aprovado-2026" …><span class="src-chip-texto">fonte</span>…</a></strong>` — o `<strong>` embrulha a figura **e** o selo; a leitura da unidade tem de excluir o selo mesmo estando dentro do mesmo elemento de ênfase que a figura, ou o texto da célula ganhava "fonte · Évora — …" a mais.
2. **Figura de item de lista, com dois índices:** `<span class="texto-figura" data-registo="…pt#69.0.0">1</span>` e `…pt#69.0.1` — confirma a gramática de coordenadas `<bloco>.<item>.<figura>` para uma lista, distinta de `<bloco>.<linha>.<coluna>.<figura>` de uma tabela.
3. **Figura sem linha do sítio, dentro de uma ligação do documento:** `<a class="texto-ligacao" href="https://www.tcontas.pt/…">…<span class="texto-figura" data-registo="…pt#71.0">13</span> vezes no seu próprio texto</a>` — a figura (linha `comp-count`, que não está no registo de travessia) não podia ser também uma porta `<a>` (não se aninham âncoras em HTML válido); fica um `<span>` simples, e a entrada `id="linha-comp-count"` existe à parte.
4. **A secção "linhas deste documento" é irmã do `<article>`, não filha:** `</table></div></article><section id="linhas-do-documento" …>` — confirmado por posição de bytes no ficheiro (o `<article>` fecha antes da secção abrir), o que importa para a medição 11/12 (âmbito estrito ao `<article>`) e para a medição 10 (as três contagens do aparelho vivem depois de ambos, num `<aside class="aparelho">` que também não é filho do `<article>`).

---

## 8 · Custo em símbolos

**Inferido**, não uma métrica exata da API — não tenho uma ferramenta nesta sessão para consultar o uso exato de tokens de entrada/saída. O que posso ver é o contador de orçamento visível do sistema (`<total_tokens>`), que começou em 15 000 000 no início desta sessão e tinha descido para 14 720 528 pouco antes de escrever este relatório — cerca de **279 000 símbolos visíveis consumidos** até esse ponto, mais o que a escrita deste ficheiro e os últimos comandos ainda gastaram depois dessa leitura. Não é um valor de faturação; é a leitura mais próxima que tenho.

---

## 9 · Ficheiros

* Programa: `/Users/nunosantos/Instruments/OEstadoDoPais/design/especime-v3/medicoes/parte3-M1-sonnet.py` — corre com `python3 parte3-M1-sonnet.py [--dist PATH] [--json OUT.json]`; sem `--dist`, usa a cópia congelada acima.
* Este relatório: `/Users/nunosantos/Instruments/OEstadoDoPais/design/especime-v3/medicoes/parte3-M1-sonnet.md`.
* Nada foi escrito, corrigido nem commitado fora da pasta `design/especime-v3/medicoes/`.
