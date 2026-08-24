# Estimativa da parte 3 · o sítio constrói as páginas de leitura a partir dos registos de conteúdo do motor

*Escrita a 24.08.2026 pelo construtor (Claude Opus 5), no ramo `main` de `~/Instruments/OEstadoDoPais`, árvore limpa. Resposta à secção **B2** de `PEDIDOS-AO-MOTOR-2026-08-22.md` («o sítio (parte 3, etapa própria depois desta) constrói a página do estudo a partir dele») e à **B4a** («`check:cadeia`, um guião da construção do sítio»). Nada foi construído, nada foi editado: este ficheiro é a única coisa que esta corrida escreveu, e não há commit. O documento é plan-gated — o diretor decide sobre ele antes de qualquer construção.*

*Todos os números levam um rótulo: **medido** (corri o comando ou li o ficheiro nesta sessão, e digo qual), **inferido** (raciocinado a partir de prova que nomeio) ou **por confirmar** (não sei, e digo-o). O motor foi lido em modo de leitura; nenhum ficheiro seu foi tocado, e a árvore de `content/11`, onde outra sessão trabalha, foi só listada.*

---

## 0 · A restrição que manda, estabelecida primeiro

Antes de desenhar o renderizador convém saber o que ele vai renderizar, porque a resposta muda o desenho de alto a baixo. São três factos, todos medidos, e o terceiro é o que decide o bloco.

### 0.1 O sítio aloja dezasseis edições, e o registo cobre oito

**Medido** (`python3 -c` sobre `studies-src/manifest.yml`, 24.08.2026): o manifesto declara **16** edições, e não 15. Sete vêm do motor (`origin: researchhub`, com o ficheiro e o commit no `origin_ref`) e nove vieram de artefactos do claude.ai (`artifact_url`). A décima sexta, `penalizacoes-por-reforma-antecipada-2026` pt, entrou a 24.08 do `content/11 Seguranca Social` e é posterior à estimativa do motor, que ainda contava 15.

**Medido** (contagem cruzada com a §0.1 da `ESTIMATIVA-B2-B4b-2026-08-23.md` do motor, mais os doze `.record.json` em disco): os registos de conteúdo cobrem **8** dessas 16 edições.

| # | Edição alojada | Registo do motor | Blocos | Refs | Bytes do registo |
|---|---|---|---:|---:|---:|
| 1 | `avaliacao-economica-regional-de-portugal-2026` pt | 03 pt | 55 | 411 | 157 846 |
| 2 | `evora-prometido-pago-auditado-2026` pt | 04 pt | 102 | 326 | 167 909 |
| 3 | `evora-prometido-pago-auditado-2026` en | 04 en | 102 | 326 | 164 993 |
| 4 | `evora-economia-investidores-portas-abertas-2026` pt | 06 pt | 53 | 171 | 66 716 |
| 5 | `evora-orcamentado-pago-devido-2025` pt | 07 pt | 92 | 194 | 86 566 |
| 6 | `evora-orcamentado-pago-devido-2025` en | 07 en | 91 | 194 | 84 871 |
| 7 | `evora-quinze-anos-cinco-mandatos` pt | 08 pt | 179 | 682 | 362 937 |
| 8 | `evora-os-pelouros-quem-os-teve-o-que-fizeram` pt | 09 pt | 155 | 297 | 261 098 |
| | **Âmbito da parte 3** | | **829** | **2 601** | **1 352 936** |

As oito que ficam de fora: sete por razões estruturais que a §0.2 do motor mediu e nenhuma se resolve neste bloco (livro-razão em falta, fonte que o motor nunca teve, edição retirada, um documento que é um programa e não prosa), mais a décima sexta, que chegou depois. **Medido:** `content/11 Seguranca Social/` tem `ledger.json` e o `.html` alojado, não tem `.md`, não tem `.record.json`, e `core/gate_baselines.json` não a nomeia — logo hoje não tem registo. **Por confirmar:** se o motor a vai passar a provar; é pergunta da §9.

Os quatro registos do motor sem edição alojada (03 en, 06 en, 08 en, 09 en; **medido:** 442 blocos, 1 561 refs, 839 160 bytes) não são âmbito desta parte: atravessam se e quando o sítio decidir alojar essas edições, e é decisão editorial anterior.

### 0.2 A forma do registo, medida em disco e não citada do `REGISTOS.md`

**Medido**, varrendo os doze `content/*/*.record.json` com um contador próprio: 1 271 blocos e 4 162 referências, que batem com a tabela do `publisher/REGISTOS.md`. Por género de bloco: `heading` 240, `paragraph` 729, `rule` 92, `list` 38, `table` 172. Títulos por nível: 12 de nível 1 (exactamente um por edição), 108 de nível 2, 100 de nível 3, 20 de nível 4. Listas: 36 não ordenadas, 2 ordenadas. Tabelas: 172, a maior com 22 linhas, a maior com 176 células, 644 células marcadas `header`.

Onde vivem as figuras — e isto manda no renderizador — **medido**: 2 694 em células de tabela (64,7 %), 1 276 em parágrafos (30,7 %), 192 em itens de lista (4,6 %), **zero** em títulos. Ênfase: 662 `strong`, 130 `em`, 2 `code`.

Proveniência das figuras, **medido**: 993 com `source_sha256` de 64 hexadecimais (`source_digest_em` com o estudo à cabeça; 455 resolvem no `raw/` de um estudo companheiro, proveniência transportada), e **3 169** com `source_sha256: null` e o motivo escrito, repartidos por `derivado` 787, `api-viva` 768, `raw-sem-manifesto` 674, `pdf-sem-resumo` 608, `portal-estatico` 332. A soma bate: 993 + 3 169 = 4 162. Mais 134 figuras com `markers`, 1 040 com `others`, e **zero** com `value_alternate`.

### 0.3 A restrição que decide o bloco: a linha do motor quase nunca é uma linha do sítio

Esta é a medição que o pedido manda fazer, e é a que muda o desenho.

**Medido**, cruzando cada figura dos oito registos do âmbito com `publisher/manifest.evora.json` do motor (o manifesto de travessia, 70 linhas em `rows` e 9 em `excluded`) e com os 136 ficheiros de `ledger/claims/` do sítio:

| | Figuras |
|---|---:|
| No âmbito da parte 3 | **2 601** |
| com uma linha do sítio pelo manifesto de travessia | **196** (7,5 %) |
| com uma linha do sítio por id idêntico, sem manifesto | **0** |
| declaradas `excluded` no manifesto, com razão escrita | 9 |
| **sem linha nenhuma do lado do sítio** | **2 396** (92,1 %) |

Sobre os doze registos inteiros a proporção é a mesma: 264 de 4 162 (6,3 %) com linha do sítio, 3 898 sem nada.

E há uma segunda metade, pior: **das 196 figuras que têm linha do sítio, 119 (60,7 %) imprimem no documento uma cadeia diferente do `value` dessa linha** (medido, comparação carácter a carácter). O censo da divergência, sobre as 264 dos doze registos:

| Como diverge | Figuras |
|---|---:|
| igual, carácter a carácter | 89 |
| o documento arredonda (`167 372 756` contra `167 372 755,84`) | 101 |
| só o espaço fino U+202F do sítio contra o espaço do motor | 40 |
| o `value` do sítio é igual ao `printed` do documento, não ao `value` do motor | 17 |
| só a vírgula decimal (`51,95` contra `51.95`) | 17 |

E, transversalmente, **medido:** 582 das 2 601 figuras do âmbito (22,4 %) têm `printed` diferente de `value` já dentro do próprio registo — é a diferença que o `REGISTOS.md` documenta («a linha `imi-2020` guarda `0.44` e a página imprime `0,44`»).

**O que isto obriga, e é a conclusão da §0.** `<Claim id="…">` escreve `claim.value`, lido do livro-razão do sítio (`src/components/Claim.astro:116` e `:131`), e o portão compara a cadeia dentro de `[data-claim]` com esse mesmo `value`. Se a página de leitura pusesse cada algarismo do documento dentro de um `<Claim>`, então:

1. para 2 396 figuras não haveria `id` nenhum para lhe dar, e `getClaim()` atira e a construção pára;
2. para 119 das 196 restantes a página imprimiria uma cadeia **que o documento não imprime** — e a página de leitura deixaria de ser o documento.

**A linha do MOTOR não é uma linha do sítio, e a página de leitura não é uma composição da casa: é uma transcrição de um documento fixado.** Todo o desenho da §2 sai daqui.

---

## 1 · A travessia dos registos

### 1.1 O padrão que já existe, e que este bloco só aplica outra vez

O sítio tem hoje **duas** travessias do motor, e nenhuma é nova:

* **Os bytes de um documento** — `studies-src/manifest.yml` com `origin: researchhub` e `origin_ref` a nomear ficheiro e commit («`content/08 Évora Mandates/… (pt-PT).html @ afb8bfbcdb200c6547d3f614c3a3c84d35736019`»), mais `sha256_normalized` conferido em cada construção por `scripts/check-documentos.mjs`. O portão do sítio recusa `origin` sem `origin_ref`: «*dizer que os bytes vieram de outro sistema sem dizer de que ficheiro e de que commit não é proveniência*».
* **As linhas do livro-razão** — `ledger/cruzamentos/evora.json`, escrito por `ResearchHub/publisher/export_site_rows.py`, com `rh_study`, `rh_id`, `rh_ledger_sha256`, `origin_row_sha256`, `exported_row_sha256`, `exported_at` e as contagens de correções e verificações no momento da exportação; conferido por `scripts/check-cruzamento.mjs` antes de cada construção, e com `--with-origin` contra o motor quando ele está presente. **Medido:** 70 linhas, todas de cinco estudos de Évora.

O `DECISIONS.md` §1.49 (linhas 7614 a 8028) é a corrida que estabeleceu a primeira. **Nota de rigor:** a expressão «padrão de travessia» não existe em lado nenhum do repositório — os termos da casa são «a travessia» e «registo de travessia» (medido: `grep -rniE "padr[aã]o de travessia"` dá zero sobre `*.md`, `*.mjs`, `*.yml`, `*.astro`, `*.py`, com `grep -rn "travessia"` a dar 57 acertos como controlo positivo). Este documento usa os termos da casa.

### 1.2 A proposta: um terceiro registo de travessia, com a forma do segundo

Os registos de conteúdo são **conteúdo com resumo**, como as linhas, e não bytes servidos, como os documentos. Por isso seguem o padrão do `ledger/cruzamentos/`, e não o do `studies-src/manifest.yml`.

**Onde vivem, proposta:**

```
registos/<slug>/<lingua>.record.json          o registo, byte a byte como o motor o escreveu
registos/<slug>/<lingua>.cortes.json          o ficheiro de operações da passagem de voz
registos/manifest.json                        o registo de travessia dos registos
```

`registos/` na raiz, ao lado de `studies-src/` e de `ledger/`, e não dentro de nenhum dos dois. **Razão:** `studies-src/` é a pasta dos bytes alojados e o seu portão varre-a inteira e recusa qualquer ficheiro que não seja `pt.html` ou `en.html` (`src/lib/documentos.mjs:122-127`, que **atira** ao ver outro nome); pôr um `.json` lá dentro pararia a construção. E `ledger/` é o livro-razão, cujo `check:ledger` varre `claims/*.yml`; um registo de conteúdo não é uma afirmação.

O nome do ficheiro passa a ser do **sítio** (`<slug>/<lingua>`) e não do motor, pela mesma razão que o motor guarda o nome da edição do motor: cada lado nomeia no seu próprio espaço, e o manifesto é a ponte. Assim o renderizador resolve `slug + lingua → registo` sem varrer o disco nem conhecer os títulos com travessão e parênteses do motor.

**A forma do `registos/manifest.json`, proposta** (uma entrada por edição, ficheiro gerado, escrito pelo exportador do motor e nunca à mão):

```json
{
  "_": ["Registo de travessia — os registos de conteúdo. FICHEIRO GERADO.",
        "Conferido a cada build por scripts/check-documentos.mjs."],
  "exporter": "ResearchHub/publisher/export_records.py",
  "origin": "ResearchHub",
  "registos": {
    "evora-prometido-pago-auditado-2026/pt": {
      "rh_study": "04 Évora Public Money",
      "rh_edition": "Évora — Prometido, Pago, Auditado 2026 (pt-PT)",
      "origin_ref": "content/04 Évora Public Money/Évora — Prometido, Pago, Auditado 2026 (pt-PT).record.json @ <commit>",
      "origin_record_sha256": "e68e979853297bc852252fc10881de8102a219a9bb03edbf3cc099d4642305d7",
      "exported_record_sha256": "<sha256 dos bytes escritos aqui>",
      "origin_cortes_sha256": "ea7956facc8241bd7574c142853490260532d98e4f4fa575091ef7476d0fe918",
      "exported_cortes_sha256": "<sha256 dos bytes escritos aqui>",
      "rh_manifest_sha256": "<sha256 do records.manifest.json do estudo>",
      "edicao_html_sha256": "515c231fcf54827f9595435d61db9b60e5f6dca716c3401d4c25aa7b111b374d",
      "estado": "fixado",
      "fixado_em": "2026-08-24",
      "blocos": 102,
      "referencias": 326,
      "prova": "render-sem-graficos",
      "exported_at": "2026-08-.."
    }
  }
}
```

Os dois `origin_*_sha256` são **medidos hoje** e copiados do `records.manifest.json` do estudo (o do 04 pt está acima, verbatim). Os dois `exported_*_sha256` são os bytes deste lado. **Serem dois e não um é o ponto:** o resumo de origem prova que o ficheiro é o do motor; o resumo exportado prova que ninguém lhe tocou depois de chegar, que é exactamente a assimetria que `check-cruzamento.mjs` já usa nas linhas.

O `edicao_html_sha256` amarra o registo aos bytes que o sítio **já** aloja: é o mesmo `sha256` que o `records.manifest.json` do motor guarda para a edição entregue. Quando as duas coisas concordam, a página de leitura e a edição de registo arquivada são duas vistas do mesmo documento, e isso é uma afirmação conferível e não uma promessa.

### 1.3 O que o `check:documentos` passa a conferir sobre eles

O portão de hoje (241 linhas) confere três coisas sobre os bytes alojados: resumo diferente, ficheiro órfão, linha órfã. Ganha **seis** conferências sobre os registos, na mesma severidade (fecham a construção) e com a mesma forma:

| | O que é provado | O estrago que o fecha |
|---|---|---|
| D1 | cada entrada do manifesto tem ficheiro em `registos/`, e o `sha256` dos bytes é o `exported_record_sha256` | editar um carácter num registo |
| D2 | nenhum ficheiro em `registos/` sem entrada no manifesto | deixar cair um registo de um estudo retirado |
| D3 | o `<lingua>.cortes.json` de cada registo existe e bate com `exported_cortes_sha256` | apagar o ficheiro de operações que fez o registo |
| D4 | o `slug` é um trabalho de `src/data/studies.mjs` e a `<lingua>` é uma edição declarada desse trabalho | um registo de uma edição que o arquivo não tem |
| D5 | o `edicao_html_sha256` do manifesto é igual ao `sha256_normalized` que `studies-src/manifest.yml` declara para o mesmo `slug/lingua`, **quando a edição veio do motor** | um registo de uma versão do documento e bytes alojados de outra |
| D6 | `blocos` e `referencias` do manifesto batem com o que o ficheiro contém | um manifesto que promete 326 referências sobre um registo com 325 |

**D5 é a conferência que vale o bloco.** Sem ela, a página de leitura e a edição arquivada podem afastar-se em silêncio: o motor republica um `.html`, o sítio recebe os bytes novos pelo `origin_ref` e o registo fica velho, ou o contrário. **Medido:** dos oito do âmbito, **seis** têm o documento alojado com `origin: researchhub` (04 pt, 04 en, 07 pt, 07 en, 08 pt, 09 pt) e **dois** têm o documento alojado como artefacto do claude.ai (`avaliacao-economica-regional-de-portugal-2026` pt e `evora-economia-investidores-portas-abertas-2026` pt). **Para esses dois o D5 não pode correr**, porque os bytes alojados não são os bytes do motor: são um artefacto normalizado, com 17 141 bytes de runtime removidos. **Inferido**, da §0.1 da estimativa do motor: o registo do 03 pt é rendido do `.md`, não da cópia alojada. Logo, para essas duas edições, a página de leitura e a edição arquivada são dois documentos que ninguém prova serem o mesmo, e isso tem de ficar escrito na §9 como pergunta, e não resolvido por omissão.

### 1.4 O ciclo de re-travessia, quando o motor refixa um registo

O motor já escreveu a sua metade da obrigação (`REGISTOS.md`, R5): *«uma edição que seja rendida outra vez, um `ledger.json` que mude, um ficheiro de operações que se edite, ou uma resposta em bruto que se substitua, tornam o seu registo velho, e um registo velho pára o commit»*. A metade do sítio é simétrica, e são cinco passos, nenhum à mão:

1. o motor corre `python3 publisher/export_records.py --write` e commita; o `records.manifest.json` do estudo passa a ter resumos novos;
2. o exportador do motor escreve os ficheiros e a entrada do `registos/manifest.json` deste lado, com o commit novo no `origin_ref` (é o mesmo padrão do `export_site_rows.py`, que já escreve dentro do repositório do sítio);
3. `npm run check:documentos` recusa a construção enquanto os resumos não baterem dos dois lados;
4. **se o `.html` entregue mudou**, os bytes alojados atravessam pelo caminho de sempre (`_raw/`, `normalize-study.mjs`, linha do manifesto com `origin_ref`), e o D5 volta a bater;
5. o bloco de republicação da §1.49 aplica-se por inteiro: leitura cruzada de outra família com plantas, e a palavra do diretor antes de fundir.

**O que este ciclo não faz, e é deliberado:** não há reconstrução automática nem sincronização. Um registo velho **pára** a construção do sítio, como um documento editado já a pára. Uma segunda cópia do texto de um documento é exactamente a coisa que sai de passo em silêncio, e a única defesa que funciona é a construção recusar-se a correr.

---

## 2 · O renderizador: da estrutura de blocos ao gabarito v3

### 2.1 O mapeamento dos blocos

O registo tem cinco géneros produzidos (o sexto, `note`, existe no esquema e **não é produzido**, decisão escrita do motor). O mapeamento é directo e cabe numa tabela:

| Bloco | Rende como | Notas de composição, da `direcao.md` e da `IDENTIDADE.md` |
|---|---|---|
| `heading` nível 1 | não rende no corpo | é o título do documento; sobe para a cabeça da página, ao lado do rótulo «Leitura publicada» da maqueta `Estudo.dc.html` |
| `heading` níveis 2 a 4 | `<h2>`, `<h3>`, `<h4>` | Spectral (prosa); nível 2 abre secção, nível 3 e 4 dentro dela |
| `paragraph` | `<p>` na coluna de leitura, 68ch | Spectral 19px/1.6, que é a medida da maqueta |
| `list` | `<ul>` ou `<ol>` conforme `ordered` | 36 não ordenadas, 2 ordenadas (medido) |
| `table` | `<table>` com `<th>` onde `header: true` | algarismos tabulares em Bitter; a tabela é conteúdo, não instrumento, e não leva cor de estado |
| `rule` | `<hr>` | o filete de secção; 92 nos doze registos, 70 no âmbito (medido) |

`emphasis[]` e `links[]` são intervalos de pontos de código sobre o `text` da unidade, e rendem por partição do texto em segmentos: ordenar os intervalos, cortar, envolver. Os intervalos de ênfase e de ligação podem sobrepor-se aos de figura, e por isso a partição tem de ser **uma só**, sobre a união de todas as fronteiras — não três passagens sobrepostas, que é como um renderizador ingénuo produz marcação mal aninhada. **Medido:** 794 intervalos de ênfase nos doze registos (662 `strong`, 130 `em`, 2 `code`).

### 2.2 Um defeito medido no motor, que a parte 3 não pode contornar: as ligações perdem-se

**Medido, e é um achado desta corrida.** Os doze registos têm **zero** `links[]` (`grep -c '"links"' content/*/*.record.json` dá 0 em todos). Mas a edição entregue do 04 tem **20 âncoras** com `href` http, das quais 4 em `<figcaption>` (legendas dos gráficos, presentação e correctamente fora do registo) e **16 no corpo**, que são as 16 ligações markdown do `.md` — as fichas dos relatórios do Tribunal de Contas em `tcontas.pt`. A célula do registo guarda o texto e perde o endereço:

```
HTML entregue:  <td class="lab"><a href="https://www.tcontas.pt/…/vic-dgtc-rel016-2018-2s.pdf"
                    rel="noopener">Relatório N.º 16/2018</a></td>
Registo:        { "figures": [ … ], "text": "Relatório N.º 16/2018" }        ← sem links[]
```

**A causa, medida** com uma sonda de leitura sobre `core/eyetext.py`:

```python
>>> eyetext.parse('<p><a href="https://x.pt/a.pdf">R</a> e <strong>n</strong></p>')
[{'kind': 'paragraph', 'unit': {'chunks': ['R', ' e ', 'n'],
   'spans': [['a', None, 0, 1], ['strong', 'https://x.pt/a.pdf', 2, 3]]}}]
```

O `href` fica pendente e é entregue ao **span seguinte**, não ao `<a>` que o trouxe. O `<a>` recebe `None`, e `_emphasis_and_links` (`publisher/export_records.py:419`) só grava a ligação `if href:` — logo não grava nenhuma. Numa célula sem span seguinte, como a de cima, o endereço desaparece por completo. Nenhum portão apanha isto: o R3 compara **texto**, e o texto é o mesmo com ou sem âncora.

**A consequência para a parte 3:** a página de leitura do 04 renderia dezasseis títulos de relatório do Tribunal de Contas como texto morto, enquanto a edição de registo arquivada, ao lado, os tem como portas para os PDF. Uma página de leitura que perde as portas do documento que transcreve não é a mesma leitura. **É trabalho do motor**, não deste bloco, e entra na §9 como pergunta e no §5 como dependência: **inferido**, a correcção é de uma linha na ordem dos eventos do `parse` mais um estrago plantado no `eyetext_test.py`, e obriga a `--write` dos doze registos e a uma nova palavra do diretor sobre o `estado: fixado` (porque os bytes mudam). Não é caro; é bloqueante para o 04.

### 2.3 O `<Claim>`, e o que cada figura mostra

Esta é a secção que a §0.3 obriga.

**O que NÃO se faz, e a razão está medida:** não se põe cada figura dentro de um `<Claim id="…">`. Para 2 396 das 2 601 figuras não existe `id` do sítio; para 119 das 196 que existem, o `value` do sítio não é a cadeia que o documento imprime. Um `<Claim>` a imprimir `167 372 755,84` numa página que transcreve um documento onde está escrito `€167 372 756` é uma página que mente sobre o documento — e o `check:documentos` carácter a carácter, que a §3 desenha, falharia com razão.

**O que se faz: uma nona origem declarada, com a forma da oitava.** O `DECISIONS.md` §2.2 lista oito origens legítimas de um algarismo numa página. A oitava, `data-agenda="<id>.<campo>"`, é o precedente exacto: *«um campo dos dois registos que atravessaram do motor, na página que os renderiza. O portão compara o texto renderizado com esse campo do registo, carácter a carácter. É a origem 6 aplicada um nível acima»*, e *«a marca só vale na página da agenda»*.

**Proposta — origem 9:**

```
data-registo="<slug>/<lingua>#<b>[.<i|r.c>].<f>"
```

onde `b` é o índice do bloco, o troço do meio é o item de lista ou a linha e coluna da célula quando existem, e `f` é o índice da figura dentro da unidade. O portão compara o texto renderizado com o `printed` dessa figura, **carácter a carácter**, e a marca **só vale na página de leitura**, pela mesma disciplina das origens 6 e 8. Não é uma dispensa: é comparação, e a coisa contra a qual compara é um ficheiro fixado por resumo que o D1 já conferiu.

Isto resolve as 2 601 de uma vez, porque a origem do algarismo passa a ser o registo, que é a coisa que a página está a transcrever — e não o livro-razão, que é a coisa que o **motor** usou para o escrever.

**E o selo, que é uma promessa e não uma marca.** A `IDENTIDADE.md` §5.3 diz «onde aparece um valor, aparece o selo, sem excepção de página», e a §10 diz «o selo é do livro-razão e de mais nada: pôr um selo ao lado de uma contagem do sítio seria prometer uma linha que não existe». As duas juntas dão a regra para os dois casos:

* **As 196 com linha do sítio** levam o selo, ■ ou □ conforme a proveniência da linha, ligado a `/livro-razao/<site_id>` como em qualquer outra página. O valor impresso continua a ser o `printed` do documento; o selo abre a linha onde o valor exacto está. **Medido:** 119 dessas 196 mostram no recibo um `value` diferente do que a página imprime, e isso é informação e não defeito — é o documento a arredondar para se ler, com o número exacto a uma porta de distância. A página da linha já tem o campo `derivation` e o excerto para o explicar. **Por confirmar:** se o diretor quer uma palavra ao pé do selo quando as duas cadeias diferem («arredondado»), ou se a porta basta. É pergunta da §9.
* **As 2 396 sem linha do sítio** não podem levar selo, sob pena de prometer uma linha que não existe. Levam **a porta**, que é a saída que a §10 já prescreve para um número sem linha: *«o que estes números levam em vez do selo é a porta: são sempre uma ligação»*, e *«a porta pode ser uma âncora na própria página»*.

### 2.4 O recibo do motor: o desenho da porta para as 2 396

**Proposta:** cada página de leitura ganha, no fim, uma secção **«As linhas deste documento»**, e cada figura sem selo é uma âncora para a sua entrada lá. Uma entrada por linha do motor citada, com quatro campos e mais nenhum:

| Campo | De onde vem | Exemplo medido (04 pt, bloco 12) |
|---|---|---|
| id da linha do motor | `figures[].row` | `prr-approved-evora` |
| o valor como a linha o guarda | `figures[].value` | `167 372 756` |
| como este documento o imprime | `figures[].printed` | `167 372 756` |
| resumo de origem | `source_sha256` + `source_digest_em`, ou o motivo de `source_digest_kind` | `raw-sem-manifesto` |

**Medido**, o tamanho desta secção: 1 527 linhas distintas do motor nas oito edições (03 pt 246, 04 pt/en 222, 06 pt 132, 07 pt/en 153, 08 pt 521, 09 pt 253), das quais 70 já atravessaram para o livro-razão do sítio. Das 2 601 figuras, **510 (19,6 %) trazem resumo de origem inteiro**; as outras 2 091 trazem um dos cinco motivos da lista fechada (`derivado` 457, `api-viva` 531, `raw-sem-manifesto` 449, `pdf-sem-resumo` 493, `portal-estatico` 161).

**Porque é uma secção da própria página e não 1 527 páginas de linha novas.** Fazer página por linha daria 1 527 × 2 línguas ≈ 3 054 páginas novas, contra as 272 páginas de linha que o sítio tem hoje (medido, `dist/prova.json`, chave `paginas_de_linha`). Isso não é uma porta, é um segundo livro-razão — e um segundo livro-razão que o sítio não verifica, porque quem verifica estas linhas é o motor. A secção na própria página diz a verdade exacta: *estas são as linhas do motor que este documento cita, e o motor é quem responde por elas*. A regra 2 do Método («O motor») já é a porta institucional para isso.

**O que a secção NÃO é:** não é um selo, não usa o glifo ■/□, e não afirma que o sítio verificou estas linhas. **Medido**, a razão de o glifo não servir: os dois estados do selo são «origem completa» e «falta um campo», e uma linha que não é do livro-razão do sítio não é nenhum dos dois. Um terceiro estado de um glifo que existe para dizer duas coisas é uma diluição, e a `IDENTIDADE.md` §5.2 pede que os dois estados existam na página lado a lado para serem uma distinção.

### 2.5 A página arquivada, e onde a leitura nasce

A edição de registo continua onde está, **sem mudar um byte e sem mudar de endereço**: `/estudos/<slug>/documento` e `/en/studies/<slug>/document`, servida por `documentoServido()` (o ficheiro de `studies-src/` lido em disco mais a faixa, e mais nada), com o `gate:html` a recomputar `documentoServido(slug, lang)` e a exigir igualdade carácter a carácter com o que foi construído. Nada disto se toca.

**A leitura nasce numa rota nova**, proposta: `/estudos/<slug>/leitura` e `/en/studies/<slug>/reading`, uma entrada nova em `ROUTES` (`src/lib/routes.mjs`), com `getStaticPaths` a sair do `registos/manifest.json` e não de `WORKS` — assim só existem as oito páginas que têm registo, e uma edição sem registo não gera uma página vazia. **Medido:** hoje `/en/studies/<slug>` existe para os 12 trabalhos, incluindo os 8 sem edição inglesa, e `EstudoView.astro:52` cai para a edição portuguesa; a página de leitura não deve herdar esse comportamento, porque uma leitura sem registo não tem o que renderizar.

A página do estudo (`/estudos/<slug>`) fica como está e ganha uma porta para a leitura, ao lado da que já tem para o documento. As três superfícies ficam com papéis distintos e ditos:

| Rota | O que é |
|---|---|
| `/estudos/<slug>` | a página do estudo: o Relance, a Leitura breve da casa, o Método e ressalvas, o aparelho |
| `/estudos/<slug>/leitura` | **novo** — o documento inteiro, no gabarito v3, construído do registo |
| `/estudos/<slug>/documento` | a edição de registo, byte a byte como foi publicada, com a faixa |

**Nenhum redireccionamento, nenhum URL muda, nada quebra.** É acrescento puro. **Por confirmar:** o nome. «Leitura» colide com «Leitura breve», que é uma das duas densidades da Emenda 2 e um rótulo visível na página do estudo. As alternativas são `texto`/`text` e `documento-lido`/`document-read`. É pergunta da §9.

### 2.6 O que o gabarito v3 acrescenta, e o que a Emenda 15 proíbe

A maqueta `maquetas/Estudo.dc.html` é a página **do estudo**, não a de leitura: tem Relance, Leitura breve, Método e ressalvas e a coluna do aparelho, e liga para fora com «Ler o documento →». **Não existe maqueta da página de leitura** (medido: as 34 pranchas de `maquetas/` não têm nenhuma de documento rendido). Isto é uma lacuna real do desenho, e é decisão da direcção se a parte 3 abre com uma prancha ou se compõe directamente das peças que a v3 já fixou. Recomendação na §5.

O que a leitura herda, sem inventar nada:

* a cabeça interior e o rodapé da maqueta, iguais aos das outras páginas interiores;
* a coluna de leitura a 68ch com Spectral 19px/1.6, e o aparelho a 300px à direita, com «O documento original» a ligar para `/documento`;
* os algarismos em Bitter (tabulares), espaço fino como separador de milhares, vírgula decimal, percentagem colada — **excepto** que na página de leitura os algarismos são os que o documento imprime, e não os que a casa formataria. **Medido:** os registos já trazem `printed` com as convenções da edição (`51,95` em pt, `51.95` na linha). A regra da `direcao.md` §2 é da composição da casa; aqui o documento manda, e isso tem de ficar escrito no `IDENTIDADE.md` quando o bloco construir.
* o selo com a palavra «fonte», altura de linha inteira na prosa, unidade compacta inteira como alvo (`IDENTIDADE.md` §5.4).

**A Emenda 15 aplica-se com uma nota.** «Uma página do leitor não leva nenhuma frase sobre o método, a verificação, a honestidade ou as intenções do próprio sítio.» A página de leitura é uma página do leitor, e a mobília obedece. Mas o **conteúdo transcrito** é o documento, e o motor já lhe fez a passagem de voz que tirou as frases sobre o sítio e o ficheiro e deixou as que descrevem os dados (265 operações em cinco estratos, todas com palavra do diretor — medido no `REGISTOS.md`). A régua do `INVENTARIO-FRASES.md` conta frases da casa; um documento transcrito não é a casa a falar, e a régua tem de saber distingui-los, ou passa a contar 829 blocos de prosa de estudo como autorreferência. **Inferido:** é um campo novo na régua (`medir-defeitos.mjs` já exclui blocos com origem declarada, incluindo `data-prova`), e a marca `data-registo` serve de origem declarada da mesma maneira.

---

## 3 · O `check:documentos` dos registos: o texto rendido igual ao registo, carácter a carácter

### 3.1 A leitura do lado do sítio

O portão precisa de ler o HTML construído e devolver, por bloco, exactamente os mesmos caracteres que o registo guarda. O motor tem `core/eyetext.py` como referência de comportamento (**medido:** 359 linhas, com 19 conferências em `core/eyetext_test.py`), e as quatro regras estão escritas no `REGISTOS.md`:

1. os pedaços de texto **dentro de um bloco** juntam-se sem nada pelo meio;
2. um espaço existe onde a fonte tem espaço, e uma corrida de espaço em branco vale um espaço;
3. os blocos separam-se uns dos outros, e nunca se colam;
4. o texto de um bloco não leva espaço à cabeça nem à cauda.

A regra 1 é a que distingue esta leitura da do `visible_text`, e é a que interessa aqui: `<em>(inferência)</em>.` lê-se `(inferência).` e não `(inferência) .`. **Medido pelo motor** e lido no `REGISTOS.md` (a corrida seca imprime os dois números por edição): as doze edições têm 472 juntas apertadas e **zero** imprimem um espaço no registo. Não o re-derivei; a corrida seca do exportador é reproduzível e é a autoridade.

**Proposta de implementação:** `src/lib/eyetext.mjs`, um porte da leitura sobre `node-html-parser`, que o sítio já tem como dependência de desenvolvimento e que `gate-html.mjs` já usa. **Inferido**, o tamanho: entre 150 e 250 linhas, contra as 359 do Python, porque a metade do ficheiro do motor que trata do `Text`, dos `chunks` e do mapa de colapso serve o exportador, e o portão do sítio só precisa de ler.

**A guarda contra um porte que leia de menos.** O motor prova a sua leitura nova contra a leitura da casa (R3b: sem espaços em branco, os dois lados dão os mesmos caracteres). O sítio faz o simétrico e mais forte: o porte é provado contra **os registos fixados**, que são a saída da leitura do motor — se o porte lê de maneira diferente, a comparação falha imediatamente, nas 829 unidades das oito edições. Não há aqui um risco de duas leituras a divergirem em silêncio, porque o registo é o árbitro e está fixado por resumo.

### 3.2 As conferências

Correm sobre `dist/estudos/<slug>/leitura/index.html` e a irmã inglesa, depois da construção, dentro do `gate:html` ou como script próprio. **Recomendação: dentro do `gate:html`**, pela mesma razão que a conferência do documento lá vive: o portão já tem o `dist/` carregado e já tem o ramo que trata as páginas de estudo.

| | O que é provado | O estrago que o fecha |
|---|---|---|
| L1 | a página tem exactamente tantos blocos quanto o registo, na mesma ordem e do mesmo género | apagar um `<p>`; trocar um `<h3>` por um `<h2>` |
| L2 | cada bloco rende, carácter a carácter, o `text` do registo pela leitura do olho | mudar um carácter; deixar cair um espaço fino; colar dois blocos |
| L3 | cada intervalo de `emphasis[]` e de `links[]` cobre exactamente os caracteres que declara | negrito a começar um carácter antes |
| L4 | cada figura tem a sua marca `data-registo`, o texto dentro dela é o `printed`, e as posições `start`/`end` batem com o texto do bloco | imprimir o `value` em vez do `printed`; uma figura sem marca |
| L5 | a contagem de figuras da página é a `referencias` do manifesto, e a de blocos é a `blocos` | uma figura a mais; um bloco a menos |
| L6 | cada figura com linha do sítio tem selo e o selo abre essa linha; cada figura sem linha tem âncora para a sua entrada no recibo do motor | um valor sem porta nenhuma |
| L7 | as tabelas têm `<th>` exactamente onde o registo tem `header: true` | uma linha de cabeçalho rendida como corpo |

**Os estragos plantados que o provam**, na forma da casa (uma cópia alterada, o resumo registado antes, a conferência a fechar com o seu próprio nome). Sete, um por conferência, mais três de controlo negativo:

1. um carácter mudado no meio de um parágrafo do 08 pt (L2);
2. um espaço acrescentado antes de um ponto final, que é a junta apertada (L2);
3. um bloco `rule` deitado fora (L1);
4. um intervalo `strong` deslocado um carácter (L3);
5. uma figura a imprimir o `value` (`51.95`) em vez do `printed` (`51,95`) (L4);
6. uma figura sem `data-registo` (L4);
7. uma célula `header` rendida como célula de corpo (L7);
8. **controlo negativo:** o 04 rendido com a tabela de cabeçalho, que é o que o registo tem, contra a edição arquivada que tem quatro gráficos no lugar dela — as duas páginas **têm** de divergir, e a conferência não deve queixar-se, porque compara a leitura contra o registo e não contra a edição arquivada;
9. **controlo negativo:** uma figura com `printed` igual ao `value` passa;
10. **controlo negativo:** um registo intacto dá zero queixas nas oito edições.

O oitavo merece uma frase, porque é a coisa que mais facilmente se lê como defeito. **Medido:** a edição entregue do 04 tem 4 regiões de gráfico que substituem a tabela de cabeçalho; o registo tem a tabela (bloco 12, com `prr-approved-evora`, `prr-paid-evora` e `prr-execution-evora`), porque o motor rende com `charts=False` de propósito, e o R3(04) do motor prova que nenhum algarismo se perdeu na troca. **A página de leitura do 04 vai mostrar uma tabela onde a edição arquivada mostra gráficos, e isso é o desenho a funcionar**, não uma divergência. Tem de ficar escrito, ou a primeira leitura cruzada abre-o como achado crítico.

---

## 4 · O `check:cadeia` (B4a do contrato)

### 4.1 O que o guião percorre

O contrato pede um guião que, por estudo, percorra: resumo do documento de origem → linha do motor → linha do sítio → posição no registo → `<Claim>` na página rendida. Com a §0.3 medida, a cadeia real tem **duas** formas, e o guião tem de dizer as duas em vez de fingir uma:

**Cadeia completa** (196 figuras do âmbito, medido):

```
resumo de origem (source_sha256 ou o motivo)
  → linha do motor (figures[].row, em content/<estudo>/ledger.json)
  → linha do sítio (manifest.evora.json: rh_id → site_id, em ledger/claims/)
  → posição no registo (bloco, unidade, figura)
  → a marca data-registo na página rendida, com o printed
  → o selo, que abre a página da linha
```

**Cadeia do motor** (2 396 figuras, medido):

```
resumo de origem (source_sha256 ou o motivo)
  → linha do motor (figures[].row)
  → posição no registo
  → a marca data-registo na página rendida, com o printed
  → a âncora, que abre a entrada no recibo do motor
```

Um algarismo **sem** nenhuma das duas é erro, e é o que o guião existe para não deixar passar.

### 4.2 As contagens que entram na prova

Por estudo e por edição, oito chaves novas em `src/lib/prova.mjs`, cada uma com a sua frase bilingue, a sua porta, e a sua recontagem própria em `contasDoPortao()` do `gate-html.mjs` — porque uma chave que o portão não sabe contar é uma dispensa, e a construção recusa-a («*a chave "<chave>" existe na prova e o portão não a sabe contar*»).

| Chave proposta | O que conta | Valor de hoje (medido, âmbito de 8 edições) |
|---|---:|---:|
| `registos_edicoes` | edições com registo atravessado | 8 |
| `registos_blocos` | blocos rendidos nas páginas de leitura | 829 |
| `registos_algarismos` | figuras rendidas | 2 601 |
| `registos_resolvidos` | figuras com linha do motor que resolve | 2 601 |
| `registos_por_resolver` | figuras sem linha (tem de ser 0) | 0 |
| `registos_com_linha_do_sitio` | figuras que também têm linha do livro-razão do sítio | 196 |
| `registos_com_resumo_de_origem` | figuras com `source_sha256` de 64 hexadecimais | 510 |
| `registos_sem_resumo_de_origem` | figuras com motivo da lista fechada | 2 091 |

E, na página de leitura, a faixa por `data-prova`, como a `IDENTIDADE.md` §10 manda: **«102 blocos · 326 algarismos · 12 com linha do livro-razão»** para o 04 pt (medido). Recontada pelo portão, nunca escrita, com porta para a secção do recibo do motor da própria página — que é a regra da âncora na própria página, já escrita na §10.

**Nota sobre a granularidade.** As chaves acima são totais do sítio; a faixa de cada página é por edição. **Inferido:** ou as chaves são por edição (8 × 3 = 24 chaves novas, que é muito para a tabela do Método) ou a faixa lê o `registos/manifest.json` e o portão reconta contra o registo em disco, marcando-a com uma origem própria. Recomendo a segunda, e é pergunta da §9.

### 4.3 Os três estragos do contrato, e mais dois que o desenho pede

O contrato nomeia três. Ficam, com o que os fecha:

1. **um algarismo sem linha** — uma figura rendida cujo `row` não existe no `ledger.json` do estudo. Fecha em `registos_por_resolver` ≠ 0 e no L4;
2. **uma linha sem resumo de origem** — uma figura com `source_sha256: null` **e** sem `source_digest_kind`, ou com um motivo fora dos cinco. Fecha na conferência do recibo do motor, que é o R7 do motor lido deste lado;
3. **uma contagem escrita à mão** — a faixa com «102 blocos» escrita no gabarito em vez de vir da prova. Fecha nas duas comparações do `gate-html.mjs`: a conta do portão contra a da prova, e a conta do portão contra os algarismos que a página rendeu.

Mais dois que o desenho pede, e que o contrato não podia prever porque a §0.3 ainda não estava medida:

4. **um valor do sítio impresso no lugar do valor do documento** — trocar o `printed` (`167 372 756`) pelo `value` da linha do sítio (`167 372 755,84`). Este é o estrago que prova que a página de leitura é o documento e não a composição da casa, e é o mais provável de acontecer por engano, porque é o instinto de quem conhece o `<Claim>`;
5. **um selo ao lado de uma figura sem linha do sítio** — prometer uma linha que não existe. Fecha no L6, e é o estrago que prova a §10 da `IDENTIDADE.md` neste contexto novo.

### 4.4 O que o motor tem de exportar para isto

**Nada de novo.** O contrato já o diz («o registo de conteúdo leva, por referência a linha, o resumo de origem que a linha já guarda; nada novo se inventa, só se transporta»), e **medido**, está lá: 993 figuras com `source_sha256` + `source_digest_em`, 3 169 com `source_digest_kind` de uma lista fechada de cinco, zero fora dela. A única coisa que o motor tem de fazer para a parte 3 é a correcção das ligações da §2.2 — que não é exportar mais, é exportar o que já devia estar lá.

---

## 5 · O âmbito e a ordem

### 5.1 Exemplar-primeiro contra tudo-de-uma-vez

**Recomendação: exemplar-primeiro, com o par 04 pt/en como modelo, e as outras seis a seguir num segundo passo.**

As razões, em ordem de peso:

1. **O 04 é o par bilingue que exercita mais caminhos de uma vez.** Há dois pares bilingues com registo (medido: 04 pt/en e 07 pt/en, ambos com `origin: researchhub` nas duas línguas), e o 04 é o único que passa pelo caminho `render-sem-graficos`, o único com a divergência tabela-contra-gráficos, e o único com ligações — que são as dezasseis perdidas da §2.2. Se o desenho aguenta o 04, aguenta os outros.
2. **É o mais pequeno par completo**: 102 blocos e 326 referências por edição, contra os 179 e 682 do 08 pt. Um erro de desenho descobre-se em 204 blocos e não em 829.
3. **O 04 é o que tem as três armadilhas juntas**: a tabela que substitui gráficos, o `printed` diferente do `value` (`51,95` contra `51.95`), e as dezasseis ligações perdidas. Um exemplar que não tem armadilhas não prova nada.
4. A ordem também dá ao diretor uma coisa para ver antes de gastar o resto: duas páginas construídas, com o `check:documentos` e o `check:cadeia` a correr sobre elas, e a leitura cruzada a atacá-las. Se o desenho estiver errado, custa duas edições e não oito.

**Contra tudo-de-uma-vez** há um argumento honesto e devo dizê-lo: o renderizador é o mesmo para as oito, e construí-lo para duas e depois «alargar» é trabalho a dobrar na cablagem (rotas, portão, prova, régua). **Inferido**, com base nas contagens da §8: o sobrecusto do faseamento é uma ronda de Opus, entre 60k e 100k símbolos, e é o preço de o erro custar duas edições em vez de oito. Recomendo pagá-lo.

**A ordem proposta, cinco etapas:**

| Etapa | O que faz | O que a fecha |
|---|---|---|
| P0 | o motor corrige as ligações (§2.2), refaz os doze registos, e o diretor volta a dar a palavra sobre `fixado` | `links[]` não vazio no 04; R5 a passar |
| P1 | a travessia: `registos/`, o `registos/manifest.json`, as seis conferências do `check:documentos` | os seis estragos plantados de D1 a D6 |
| P2 | o renderizador e a rota nova, só para o par 04 pt/en; a leitura do olho do lado do sítio; o `<Claim>` e o recibo do motor | os dez estragos de L1 a L7 e os três controlos negativos |
| P3 | o `check:cadeia` com as contagens na prova e os cinco estragos da §4.3 | a construção a fechar em cada um dos cinco |
| P4 | as outras seis edições, sem código novo, só dados e conferências | as contagens da §4.2 a bater nas oito |

**P0 é bloqueante e é do motor.** Construir P2 sobre registos que perdem as ligações do 04 significa construir a página de leitura do 04 sem as portas para o Tribunal de Contas, e depois refazê-la. A §20 das regras da casa diz o que fazer com isto: estabelecer a restrição antes de construir, não depois.

### 5.2 O que acontece às oito não cobertas

**Nada.** Ficam servidas exactamente como estão: os bytes alojados, byte a byte, com a faixa e o `check:documentos` de hoje; a página do estudo como está; nenhuma página de leitura, porque não há registo para renderizar. A recomendação da §0.2 do motor mantém-se e é a correcta: *«fingir um registo para as sete seria o oposto do que B2 existe para fazer»*.

O que muda é que passam a ser visivelmente diferentes das oito que têm leitura. **Recomendação:** a diferença diz-se por **ausência**, e não por uma frase — a página do estudo de uma edição com registo tem a porta «Ler no sítio →» ao lado de «Ler o documento →»; a de uma edição sem registo tem só a segunda. É a Emenda 15 aplicada («a ausência diz-se em duas palavras, não num parágrafo»), e é o oposto de uma faixa a explicar o que a página ainda não é. **Nota:** a §0.2 da estimativa do motor recomendava «uma frase na faixa do documento a dizer o que a página do estudo ainda não é». Discordo, e digo-o: essa frase é autorreferência do sítio na página do leitor, que é exactamente o que a Emenda 15 proíbe, e a decisão é do diretor.

### 5.3 O que acontece à página de estudo actual

Fica. Nenhum URL muda, nenhum redireccionamento nasce, nenhuma página desaparece. **Medido:** `dist/prova.json` conta hoje 334 páginas construídas, 272 páginas de linha e 16 documentos conferidos; a parte 3 acrescenta 8 páginas de leitura (uma por edição com registo — não 16, porque só 8 têm registo) e não retira nenhuma.

Três coisas mudam na página do estudo, todas pequenas: a porta nova para a leitura; o `temLeitura(work.id)` deixa de ser o único critério de indexação (hoje **medido:** `EstudoView.astro:135` põe `noindex` quando não há `leitura`, e o `astro.config.mjs:73` exclui essas do sitemap — a página de leitura tem de entrar no sitemap por si); e a coluna do aparelho ganha uma linha «o registo de conteúdo», com o resumo e o commit do motor, que é a proveniência do que a leitura mostra.

---

## 6 · A divulgação de autoria de IA em Sobre/Método

### 6.1 A condição, lida na fonte

**Medido**, nos dois ficheiros de cortes do 03 (`content/03 Regional Economy/*.cortes.json`): há **duas** operações com campo `condicao` nos doze ficheiros, e são a mesma frase nas duas línguas.

> **pt** «As frases de avaliação marcadas (inferência) são a leitura que o Claude faz dos números com fonte, não constatações com fonte em si mesmas.»
> **en** «Assessment sentences marked (inference) are Claude's reading of the sourced figures, not sourced findings themselves.»
>
> **`condicao`** «Corte aprovado pelo diretor a 24.08 COM uma condição escrita: a divulgação de autoria de IA tem de viver no Sobre ou no Método do sítio. Se lá não estiver quando a página for construída, esta frase volta ao documento.»

### 6.2 O que o Sobre e o Método dizem hoje

**Medido**, lidos os dois ficheiros (`src/data/sobre.mjs`, 38 linhas; `src/data/metodo.mjs`, 588 linhas). São **texto governado**: o cabeçalho do `sobre.mjs` diz «*texto decidido pela direção (…) está aqui carácter a carácter (…). Não reescrever, não apertar, não acrescentar: o portão de HTML compara o que a página rende com esta cadeia e fecha a construção à primeira diferença*». **Não editei nenhum dos dois**, e não proponho editá-los sem a palavra do diretor.

**O Sobre** (`sobre.mjs:27` e `:31`):

> «É produzido maioritariamente por inteligência artificial, com o mínimo de intervenção humana, numa tentativa de explorar as possibilidades tecnológicas do presente e de levar ao limite a independência e o rigor.»
> «It is produced mostly by artificial intelligence, with the minimum of human intervention (…)»

**O Método**, regra 9, «A intervenção humana» (`metodo.mjs:533` e `:538`):

> «A direção é de **Nuno dos Santos**, que escolhe o que se publica e responde por ele; não escreve números. A autoria por inteligência artificial está declarada no Sobre, e todas as páginas construídas levam a porta para lá.»

E a regra 8, «O que se mede a seguir» (`metodo.mjs:475`): «A inteligência artificial propõe o que medir, a partir de critérios declarados (…). A direção decide.»

### 6.3 A leitura honesta, e o que falta

**A condição está literalmente cumprida.** A divulgação de autoria de IA vive no Sobre e no Método, hoje, sem se acrescentar uma linha. Se a condição se lê à letra, a frase do 03 não volta.

**Mas a frase cortada dizia outra coisa, e menor.** Ela não dizia «este documento foi escrito por IA»; dizia o que significa **um marcador concreto que continua impresso no documento**. E o marcador sobrevive: **medido**, `(inferência)` aparece 34 vezes nos seis registos portugueses e `(inference)` 34 vezes nos seis ingleses — 3 no 03, 11 no 04, 8 no 07, 8 no 08, 4 no 09, zero no 06. No âmbito das oito edições alojadas são 34 ocorrências ao todo.

**Medido no âmbito das oito edições alojadas: 53 ocorrências** (03 pt 3, 04 pt 11, 04 en 11, 06 pt 0, 07 pt 8, 07 en 8, 08 pt 8, 09 pt 4).

Ou seja: as páginas de leitura vão imprimir, 53 vezes, um marcador que nenhuma página do sítio explica. O Sobre diz quem escreve; nenhum dos dois textos diz o que `(inferência)` marca dentro de um documento.

**A leitura que recomendo, e é do diretor decidir:** a condição está cumprida na letra e não no espírito, e a maneira barata de a cumprir nas duas é acrescentar **uma frase** ao Método, na regra 9, que é onde a autoria já vive. Não ao Sobre — o Sobre «diz a ideia e pára», e o seu cabeçalho proíbe acrescentos.

### 6.4 A redacção proposta, para o diretor decidir

Acrescento ao fim da `regra` da regra 9 do Método, `src/data/metodo.mjs`, a seguir a «*(…) e todas as páginas construídas levam a porta para lá*»:

> **pt** «Nos documentos de estudo, uma frase marcada «(inferência)» é a leitura que o modelo faz dos números com fonte, e não uma constatação com fonte em si mesma.»
>
> **en** «In the study documents, a sentence marked “(inference)” is the model's reading of the sourced figures, and not a sourced finding in itself.»

Três notas sobre esta redacção, porque cada palavra tem uma razão:

* diz **«o modelo»** e não «o Claude», porque o Método não nomeia modelos em lado nenhum e a `AI Agent Operating Protocol` da casa proíbe inventar identificadores de modelo; a frase do motor dizia «o Claude», e a diferença é deliberada. **Por confirmar:** se o diretor prefere a fidelidade à frase original, escreve-se «o Claude» e a nota cai;
* fica na **regra**, e não no `limite`, porque não é uma coisa que o mecanismo não apanhe: é uma definição;
* não leva algarismos, o que é obrigatório — o cabeçalho do `metodo.mjs` diz que «*nenhum pedaço de texto corrido pode trazer algarismos*».

**O que isto custa em conferências:** o `gate:html` compara o texto rendido do Método com este ficheiro carácter a carácter; acrescentar a frase é acrescentar cadeia dos dois lados de uma vez, como a V17 do motor já exige para as linhas. Uma edição só de um lado fecha a construção, que é o comportamento certo.

**Se o diretor decidir que a condição não está cumprida**, o remédio é do motor e não do sítio: a frase volta aos dois registos do 03, o exportador refaz os doze, e o `estado: fixado` volta a precisar da sua palavra. Custo **inferido**: uma ronda curta no motor, entre 30k e 60k símbolos, mais a re-travessia inteira da P1.

---

## 7 · A leitura cruzada

**Quando.** Duas vezes, e a segunda é a que conta:

1. **ao fim da P2**, sobre o par 04 pt/en construído — antes de gastar as outras seis edições, porque é aí que um erro de desenho ainda é barato;
2. **ao fim da P4**, sobre as oito, antes de fundir.

**Quem.** Codex CLI, `gpt-5.6-sol`, esforço xhigh, `codex exec -s read-only --ephemeral`, sem rede, numa pasta fora dos dois repositórios — que é o procedimento das nove leituras que `design/especime-v3/critica/` já guarda. Outra família, e não a que construiu: a regra de casa.

**O pacote, para esta leitura em particular.** O que a leitura cruzada tem de poder fazer aqui é uma coisa que nenhuma das anteriores fez: **comparar a página rendida com o registo, célula a célula**. Por isso o pacote leva os dois lados e mais nada que os confunda:

* `dist/estudos/evora-prometido-pago-auditado-2026/leitura/index.html` e a irmã inglesa (na segunda leitura, as oito);
* `dist/estudos/evora-prometido-pago-auditado-2026/documento/index.html`, a edição de registo, **para a comparação de conteúdo e não de forma** — e com o aviso escrito de que as duas divergem nos gráficos por desenho (§3.2, controlo negativo 8);
* os `registos/<slug>/<lingua>.record.json` correspondentes e o `registos/manifest.json`;
* `ledger/claims/` inteiro, para poder conferir os selos das figuras com linha do sítio;
* `IDENTIDADE.md`, `design/especime-v3/direcao.md` com as Emendas, `DECISIONS.md` §2.2 (as origens legítimas) e `publisher/REGISTOS.md` do motor, que é o contrato do formato;
* `dist/prova.json`;
* sem notas, sem briefs, sem este documento — a leitura não deve saber o que o construtor pensou.

**As plantas, seis, registadas com o resumo de cada ficheiro alterado antes da leitura** (o procedimento das cinco de 22.08, que foram cinco de cinco):

| planta | o quê | o que deve apanhar |
|---|---|---|
| P1 | um carácter mudado num parágrafo da página de leitura pt | a divergência contra o registo |
| P2 | uma figura a imprimir `167 372 755,84` (o `value` do sítio) em vez de `167 372 756` | o valor do documento trocado pelo do livro-razão |
| P3 | um selo ao lado de uma figura sem linha do sítio | a linha prometida que não existe |
| P4 | a faixa «102 blocos · 326 algarismos» escrita à mão, com um número desfasado | a contagem escrita |
| P5 | uma frase sobre o método acrescentada à mobília da página de leitura | a Emenda 15 |
| P6 | **controlo negativo:** a página do 04 com a tabela onde o documento tem gráficos, intacta | **não** deve ser reportada; se for, o pacote não explicou o desenho |

P6 é o que distingue uma leitura que percebeu o desenho de uma que decorou a regra «a página tem de ser igual ao documento».

---

## 8 · Custo em símbolos, por modelo e por etapa

**A base de cada número.** Os rácios da casa, como o assento os reportou e como o pedido os dá: ferramenta de voz do motor, Opus ≈665k em cinco rondas; etapa 1 dos registos, Opus ≈448k em duas rondas; medições cegas de Sonnet ≈746k (a passagem de voz) e ≈218k (a etapa 1); leituras do Codex ≈265k cada, orçamento próprio, zero símbolos Claude. **Nota medida:** o `NEXT.md` do motor regista que as duas leituras do Codex de 24.08 custaram na verdade 284 900 no total, ou seja ≈142k cada; uso os 265k do pedido como tecto, e digo que a corrida realizada foi mais barata.

**As três âncoras que uso, e porquê.** A P2 (o renderizador) é o análogo da etapa 1 dos registos: código novo com uma suíte de estragos plantados, sobre um formato já fixado — âncora ≈448k. A P1 (a travessia) é o análogo de meia ronda do exportador de linhas: cablagem e um portão, sem desenho — âncora ≈150k. A P3 (o `check:cadeia`) é o análogo do que a etapa 1 gastou só nos portões — âncora ≈120k.

| Etapa | Modelo | Símbolos | Base |
|---|---|---:|---|
| **P0** correcção das ligações no motor | Opus | 40k a 80k | **inferido**: uma linha na ordem dos eventos do `parse`, um estrago plantado no `eyetext_test.py`, `--write` dos doze registos e o diff para o diretor. É metade de uma ronda curta |
| **P1** a travessia e as seis conferências | Opus | 130k a 200k | **inferido** da âncora ≈150k: `registos/manifest.json`, o exportador do lado do motor, seis conferências em `check-documentos.mjs` (241 linhas hoje) e seis estragos plantados |
| **P2** o renderizador, a rota, o `<Claim>` e o recibo | Opus | 380k a 560k | **inferido** da âncora ≈448k: a leitura do olho portada (150 a 250 linhas, contra 359 do Python), o renderizador de cinco géneros com partição de intervalos, a rota nova, o recibo do motor, sete conferências e dez estragos. O 04 pt/en como exemplar |
| **P3** o `check:cadeia` e as contagens na prova | Opus | 110k a 170k | **inferido** da âncora ≈120k: oito chaves em `prova.mjs` com recontagem própria em `contasDoPortao()`, a faixa `data-prova`, cinco estragos |
| **P4** as outras seis edições | Opus | 60k a 120k | **inferido**: sem código novo; dados, seis páginas, as contagens a bater. O 08 pt (179 blocos, 682 refs) é o que pode obrigar a voltar ao renderizador |
| | **Opus, total** | **720k a 1 130k** | |
| **M1** medição cega da P2 | Sonnet | 180k a 300k | **inferido**: a medição cega da etapa 1 dos registos custou ≈218k para 4 164 referências; aqui são 652 (o par 04) na primeira e 2 601 na segunda. Código próprio, sem importar o renderizador |
| **M2** medição cega da P4 | Sonnet | 120k a 220k | **inferido** do mesmo rácio, sobre as oito edições |
| | **Sonnet, total** | **300k a 520k** | |
| **C1** leitura do Codex ao fim da P2 | Codex | ≈265k | pedido; orçamento próprio, zero símbolos Claude. **Medido**: as duas leituras de 24.08 custaram 284 900 no total |
| **C2** leitura do Codex ao fim da P4 | Codex | ≈265k | idem |
| | **Codex, total** | **≈530k** | orçamento próprio |

**Total Claude: 1,02M a 1,65M símbolos** (Opus 720k a 1,13M, Sonnet 300k a 520k), mais ≈530k de Codex em orçamento próprio. Para comparação **medida**: o bloco B2 inteiro do motor custou, nas duas etapas, ≈1,11M de Opus (448k + 665k) e ≈964k de Sonnet (218k + 746k).

**O que pode fazer isto estourar, dito à cabeça e não em nota de rodapé:**

* **a partição de intervalos sobrepostos** (§2.1). Ênfase, ligação e figura podem cruzar-se, e um renderizador que faça três passagens produz marcação mal aninhada que só se descobre no portão. **Medido:** 794 intervalos de ênfase e 4 162 figuras nos doze registos; a sobreposição existe (a célula do 04 tem `strong` de 0 a 12 e figura de 1 a 12). Se este pedaço correr mal, come uma ronda inteira de Opus;
* **o 08 pt**: 179 blocos, 682 referências, 362 937 bytes, 22 linhas na maior tabela. É a edição que descobre os limites do renderizador, e está na P4, que é onde já não há orçamento para descobrir nada. **Alternativa a considerar:** trocar o exemplar da P2 para o par 04 **mais** o 08 pt, pagando ≈80k a mais na P2 para não descobrir um problema estrutural na última etapa;
* **a régua do inventário de frases** (§2.6). Se a régua contar os 829 blocos de prosa transcrita como frases da casa, a contagem de autorreferência salta e alguém vai passar uma ronda a perceber porquê. Mais barato ensiná-la antes.

**Rácio desta corrida (a estimativa):** **por confirmar** de dentro; o assento mede-o de fora. As medições correram em comandos de leitura sobre os dois repositórios, mais duas leituras delegadas a Opus (a máquina do sítio e o `DECISIONS.md` §1.49 com a prova), cujos relatórios estão contabilizados nos totais que o assento vê.

---

## 9 · Perguntas para o diretor

1. **A nona origem.** Aceita `data-registo` como nona origem legítima de um algarismo numa página (`DECISIONS.md` §2.2), com a forma da oitava — o portão compara o texto rendido com o `printed` da figura, carácter a carácter, e a marca só vale na página de leitura? A alternativa é obrigar cada figura a ter linha no livro-razão do sítio, o que significa atravessar **1 457 linhas novas** (medido: 1 527 citadas, 70 já atravessadas) contra as 136 que o livro tem hoje — um bloco de investigação inteiro, não uma etapa de renderização.

2. **O selo para as 2 396.** Aceita que uma figura sem linha do sítio leve **a porta e não o selo** (a regra da `IDENTIDADE.md` §10 aplicada a um caso novo), com a porta a abrir a secção «As linhas deste documento» da própria página? Ou quer um terceiro estado do glifo, sabendo que a §5.2 pede que os dois estados existam lado a lado para serem uma distinção?

3. **O valor que diverge.** Quando o documento imprime `167 372 756` e a linha do sítio guarda `167 372 755,84` (medido: 119 das 196 figuras com linha), a página imprime o do documento e o selo abre a linha com o exacto. Quer uma palavra ao pé do selo nesses casos («arredondado»), como a palavra «provisório» faz para a bandeira `p`, ou a porta basta?

4. **As ligações perdidas.** Confirma que a P0 é bloqueante — o motor corrige o `href` no `core/eyetext.py`, refaz os doze registos e o diretor volta a dar a palavra sobre `fixado` — antes de a P2 começar? Ou prefere construir a página de leitura do 04 sem as dezasseis portas para o Tribunal de Contas e voltar depois?

5. **A divulgação de autoria de IA.** A condição do corte do 03 está cumprida à letra (o Sobre e a regra 9 do Método declaram a autoria por IA, medido). Considera-a cumprida, ou quer a frase da §6.4 acrescentada à regra 9 para explicar o marcador `(inferência)`, que aparece 34 vezes por língua e que nenhuma página hoje explica? E, se a quiser: «o modelo» ou «o Claude»?

6. **O nome da rota.** `/estudos/<slug>/leitura` colide com «Leitura breve», que é uma das duas densidades da Emenda 2 e um rótulo visível. Fica `leitura`/`reading`, ou prefere `texto`/`text`?

7. **As duas edições sem D5.** Para `avaliacao-economica-regional-de-portugal-2026` pt e `evora-economia-investidores-portas-abertas-2026` pt os bytes alojados são artefactos do claude.ai e não os do motor (medido), pelo que nada prova que a página de leitura e a edição arquivada sejam o mesmo documento. Fica dito e segue, ou essas duas edições atravessam os bytes do motor primeiro (o que é o bloco de republicação da §1.49 outra vez, para duas edições)?

8. **A décima sexta edição.** `penalizacoes-por-reforma-antecipada-2026` pt entrou a 24.08 e não tem registo (medido: `content/11` tem `ledger.json` e `.html`, não tem `.md` nem `.record.json`, e não está em `core/gate_baselines.json`). Passa a ser âmbito do motor — e desta parte 3 — ou fica servida como está?

9. **A ausência das oito.** A diferença entre uma edição com leitura e uma sem diz-se por ausência da porta «Ler no sítio →» (a minha recomendação, Emenda 15), ou por uma frase na faixa do documento (a recomendação da §0.2 do motor, que eu leio como autorreferência do sítio na página do leitor)?

10. **O exemplar.** A P2 abre com o par 04 pt/en (652 referências), ou com o par 04 mais o 08 pt (1 334 referências, ≈80k de Opus a mais) para que a edição maior não seja descoberta na última etapa?

11. **A maqueta.** Não existe prancha da página de leitura (medido: 34 pranchas em `maquetas/`, nenhuma de documento rendido). A P2 abre com uma prancha nova, ou compõe directamente das peças que a v3 já fixou, medindo o resultado contra a `IDENTIDADE.md`?
