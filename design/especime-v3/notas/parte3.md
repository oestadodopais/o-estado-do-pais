# Nota da parte 3 · as páginas de leitura, dos registos de conteúdo do motor

*Ficheiro de notas do bloco. Cada etapa acrescenta a sua secção; esta abre com a
P1. **Todos os números desta nota vêm de um comando que está escrito ao lado
deles.** Sem travessões na prosa; os nomes de ficheiro dentro de crases levam os
caracteres que têm.*

---

## P1 · a travessia dos registos de conteúdo

*Construtor: Claude Opus 5 (`claude-opus-5[1m]`). Sítio: ramo
`parte3-2026-08-24`, a partir de `8d724f2`. Motor: `master`, a partir de
`cbaf7ca`. Brief: `../briefs/BRIEF-parte3-P1.md`, com a §1 da
`../ESTIMATIVA-PARTE3-2026-08-24.md` como contrato e as onze decisões de
`../ESTADO-DO-MAIN-2026-08-24.md` fechadas.*

### Os commits

| repositório | commit | o quê |
|---|---|---|
| motor | `d64a4d2` | `publisher/export_records_site.py`, os oito conhecidos-positivos, o registo em `core/gate.py` e a secção nova do `publisher/REGISTOS.md` |
| sítio | `15063b2` | `registos/`: os oito registos, os oito ficheiros de operações, o `manifest.json` e o `README.md` |
| sítio | `4e8981b` | as seis conferências D1 a D6 e o modo `--with-origin` no `scripts/check-documentos.mjs` |
| sítio | `23385a1` | `src/lib/registos.mjs`, o leitor, para a P2 usar |
| sítio | `b61fa96` | o registo: `DECISIONS.md` §1.64, o `README.md`, esta nota e a `ISSUES.md` |
| sítio | (este) | o relatório do portão passa a nomear os oito registos, um por linha, com o veredicto do D5 na cauda; as seis plantas repetidas sobre o portão mudado |

### O que atravessou, medido

`python3 publisher/export_records_site.py` (ensaio, motor `d64a4d2`):

| edição do motor | slug do sítio · língua | blocos | refs | `prova` | D5 |
|---|---|---:|---:|---|---|
| 03 pt | `avaliacao-economica-regional-de-portugal-2026/pt` | 55 | 411 | `edicao-html` | não corre |
| 04 en | `evora-prometido-pago-auditado-2026/en` | 102 | 326 | `render-sem-graficos` | corre e bate |
| 04 pt | `evora-prometido-pago-auditado-2026/pt` | 102 | 326 | `render-sem-graficos` | corre e bate |
| 06 pt | `evora-economia-investidores-portas-abertas-2026/pt` | 53 | 171 | `edicao-html` | corre e bate |
| 07 en | `evora-orcamentado-pago-devido-2025/en` | 91 | 194 | `edicao-html` | corre e bate |
| 07 pt | `evora-orcamentado-pago-devido-2025/pt` | 92 | 194 | `edicao-html` | corre e bate |
| 08 pt | `evora-quinze-anos-cinco-mandatos/pt` | 179 | 682 | `edicao-html` | corre e bate |
| 09 pt | `evora-os-pelouros-quem-os-teve-o-que-fizeram/pt` | 155 | 297 | `edicao-html` | corre e bate |
| **total** | | **829** | **2 601** | | **corre em 7, não corre em 1** |

As quatro edições do motor sem edição alojada (03 en, 06 en, 08 en, 09 en) não
atravessam, e a corrida nomeia cada uma em voz alta.

**O D5 corre em sete e não em seis.** O brief escreveu «seis edições com
`origin: researchhub`» no texto da §2 e listou **sete** na tabela da mesma
secção. Medido a 24.08 contra o `studies-src/manifest.yml`: sete linhas com
`origin: researchhub` (04 pt, 04 en, 06 pt, 07 pt, 07 en, 08 pt, 09 pt) e uma com
`artifact_url` (03 pt). O `edicao_html_sha256` bate com o `sha256_normalized` nas
sete. A tabela do brief estava certa e o número na prosa era um lapso de
contagem; nada disto contradiz a decisão 7 do diretor, que é o 06 republicado e o
03 a ficar.

`find registos -type f | wc -l` → **17** (dezasseis ficheiros de dados mais o
registo de travessia); `du -sh registos` → **1,5 MB**; mais o `README.md`.

### As seis plantas

Cada uma fechou `node scripts/check-documentos.mjs` com **exit 1**, e foi
revertida do git a seguir, com o portão a voltar a exit 0 e o
`git status --porcelain` limpo antes da planta seguinte.

| planta | o que se mudou | resumo do ficheiro antes | a frase do portão | exit |
|---|---|---|---|---|
| **D1** | um carácter do primeiro `"text"` de `registos/evora-quinze-anos-cinco-mandatos/pt.record.json` | `457ff2c2…64a5` | `D1 registos["evora-quinze-anos-cinco-mandatos/pt"]: os bytes de registos/evora-quinze-anos-cinco-mandatos/pt.record.json não são os que atravessaram.` | 1 |
| **D2** | uma pasta com um slug enganado, `registos/um-slug-enganado/pt.record.json` | (não existia) | `D2: existe registos/um-slug-enganado/pt.record.json e o registo de travessia não o nomeia. Um registo de conteúdo sem entrada no manifesto não tem proveniência: ou ficou de uma edição retirada, ou o slug está enganado.` | 1 |
| **D3** | `registos/evora-orcamentado-pago-devido-2025/pt.cortes.json` apagado | `cee6549b…a628` | `D3 registos["evora-orcamentado-pago-devido-2025/pt"]: falta registos/evora-orcamentado-pago-devido-2025/pt.cortes.json, que são as operações da passagem de voz que fizeram este registo. Volte a atravessar.` | 1 |
| **D4** | o `registos/manifest.json` passa a declarar `evora-quinze-anos-cinco-mandatos/en`, com os dois ficheiros ao lado, e o arquivo do sítio não tem essa edição | `040b3adb…4c11` | `D4 registos["evora-quinze-anos-cinco-mandatos/en"]: o trabalho "evora-quinze-anos-cinco-mandatos" não tem edição "en" no arquivo. Um registo de uma edição que o arquivo não tem não se serve.` | 1 |
| **D5** | o `edicao_html_sha256` do 08 pt no `registos/manifest.json`, de `ceab4d26…` para `0eab4d26…` | `040b3adb…4c11` | `D5 registos["evora-quinze-anos-cinco-mandatos/pt"]: o registo e os bytes alojados são de versões diferentes do documento.` (com os dois resumos e o remédio por baixo) | 1 |
| **D6** | as `referencias` do 04 pt no `registos/manifest.json`, de 326 para 325 | `040b3adb…4c11` | `D6 registos["evora-prometido-pago-auditado-2026/pt"]: o manifesto promete 325 referência(s) e o registo tem 326.` | 1 |

A planta do D4 fechou **dois** erros e não um: com a entrada nova o
`studies-src/manifest.yml` também não tem linha nenhuma para
`evora-quinze-anos-cinco-mandatos/en`, e por isso o segundo ramo do D5 fechou
com ela: `D5 registos["evora-quinze-anos-cinco-mandatos/en"]: não há linha
nenhuma para "evora-quinze-anos-cinco-mandatos/en" em studies-src/manifest.yml.`
É o ramo do D5 que a planta própria do D5 não exercita, e ficou exercitado por
esta.

**A primeira forma da planta do D4 não serviu, e a razão fica escrita.** Retirar
a edição inglesa do 04 de `src/data/studies.mjs` fecha a construção com exit 1,
mas por outra boca: `src/lib/documentos.mjs` **atira** ao encontrar
`studies-src/evora-prometido-pago-auditado-2026/en.html` sem edição declarada, e
esse `throw` acontece na linha 207 do portão, antes de o bloco dos registos
correr. O portão morre com um rasto de pilha em vez de imprimir a sua lista de
erros. É comportamento anterior a esta etapa e o resultado é o certo (a
construção pára, com a frase certa), mas fica registado como `I64` porque
qualquer pessoa que plante o mesmo estrago vai bater no mesmo sítio. A planta do
D4 mudou para onde o D4 a pode ver, que é o próprio registo de travessia, e é
também a forma mais fiel do estrago que o brief descreve: «um registo de uma
edição que o arquivo não tem».

### Os oito conhecidos-positivos do lado do motor

`python3 -m publisher.export_records_site_test --vermelhos` → **PASS, 8 checks**.
Cada um é plantado numa cópia temporária (o motor copiado e feito repositório
git próprio, o sítio sintetizado dos manifestos do motor); `content/` nunca é
escrito e o sítio real nunca é lido nem escrito.

1. manifesto do motor com `estado: rascunho` → recusa;
2. um byte mudado num registo em disco → recusa;
3. `.cortes.json` em falta → recusa;
4. um slug que o `studies.mjs` da cópia não tem → recusa;
5. idempotência: duas escritas seguidas dão 17 ficheiros iguais e o
   `exported_at` não mexe;
6. uma origem que mudou mesmo (registo novo, manifesto do motor a declará-lo)
   reescreve **só** o `pt.record.json` do 06 e o `manifest.json`, com data nova
   nessa entrada e nas outras sete a data antiga;
7. um ficheiro órfão no destino → recusa, nomeia-o, e **não o apaga**;
8. a cópia limpa passa, com o D5 dito edição a edição.

### As corridas verdes

As seis plantas foram corridas **duas vezes**, e a segunda vez sobre o portão
com o relatório mudado: uma conferência que mudou de código e não voltou a
fechar sobre o seu estrago é uma conferência por provar. As frases e os exits são
os mesmos nas duas corridas.

```
motor   python3 -m core.gate                              PASS (74 s), com o export_records_site_test na lista
motor   python3 publisher/export_records_site.py --write  duas vezes, manifest.json byte a byte igual
sítio   npm run build                                     exit 0 · 334 páginas · 33 chaves da prova · 16 documentos
sítio   npm run typecheck                                 exit 0
sítio   node scripts/check-documentos.mjs                 exit 0 · 8 atravessados · D5 correu em 7 e não corre em 1
sítio   node scripts/check-documentos.mjs --with-origin   exit 0 · 8 registos conferidos contra o motor
sítio   RESEARCHHUB_DIR=/tmp/nao-existe … --with-origin   exit 0 · «NÃO CORREU, o motor não está em …»
```

As 334 páginas e as 33 chaves são as mesmas da construção de base: a P1 não
acrescenta página nenhuma, e não devia.

### O que fica por fazer, e é da P2 em diante

* **Nenhum consumidor.** O `src/lib/registos.mjs` não é importado por nenhuma
  página. Quem o vai usar é o renderizador da P2.
* **Nenhuma rota `texto`/`text`,** nenhuma porta «Ler no sítio», nenhum
  `data-registo`, nenhum recibo do motor: tudo isso é P2 e P3.
* **A régua do inventário de frases não aprendeu a origem `data-registo`.** Está
  na nota da estimativa e continua por fazer; se contar os blocos de prosa
  transcrita como frases da casa, a contagem de autorreferência salta.
* **As 46 ligações do corpo atravessaram dentro dos registos** (7 por edição do
  03, 16 por edição do 04), e nada do lado do sítio as rende ainda.

---

## P2 · o renderizador, a rota `texto` e a nona origem

*Construída a 24.08.2026 pelo construtor (Claude Opus 5) no ramo
`parte3-2026-08-24`, sobre a P1. O brief é
`briefs/BRIEF-parte3-P2.md`; o plano é a `ESTIMATIVA-PARTE3-2026-08-24.md` §2, §3
e §5; as onze decisões do diretor estão em `ESTADO-DO-MAIN-2026-08-24.md` e
nenhuma se reabriu. O registo da etapa é a `DECISIONS.md` §1.64, subsecção P2, e
a nona origem é a `DECISIONS.md` §2.2 item 9.*

### Os commits

| repositório | commit | o quê |
|---|---|---|
| sítio | `581d9dd` | `src/lib/eyetext.mjs`, a leitura do olho portada, e `scripts/provar-eyetext.mjs`, as suas duas provas |
| sítio | `056a797` | a rota `texto`: o renderizador, a vista, as duas páginas, a folha, as sete conferências no portão, a régua e o inventário |
| sítio | `95c65c4` | o registo: a nona origem na §2.2, a subsecção P2 na §1.64, as duas frases da `IDENTIDADE.md`, as chaves, esta nota, o `README.md` e as duas ISSUES |
| sítio | `d1f3a1b` | o relatório do portão passa a nomear as oito páginas de leitura conferidas |
| sítio | (este) | a lista dos commits nesta nota |

O motor não foi tocado nesta etapa: está em leitura, e o que dele se usa são os
registos que a P1 atravessou e o `core/eyetext.py` como referência de
comportamento.

### As duas provas da leitura do olho

`node scripts/provar-eyetext.mjs` · **157 conferências, exit 0**.

```
evora-economia-investidores-portas-abertas-2026/pt   53 blocos lidos ·  53 no registo ·  104 unidades iguais ·  4 isentas em  4 bloco(s) editado(s) · 0 apagado(s)
evora-orcamentado-pago-devido-2025/en                94 blocos lidos ·  91 no registo ·  206 unidades iguais ·  7 isentas em  4 bloco(s) editado(s) · 3 apagado(s)
evora-orcamentado-pago-devido-2025/pt                95 blocos lidos ·  92 no registo ·  207 unidades iguais ·  7 isentas em  4 bloco(s) editado(s) · 3 apagado(s)
evora-os-pelouros-quem-os-teve-o-que-fizeram/pt     157 blocos lidos · 155 no registo · 1095 unidades iguais · 17 isentas em 17 bloco(s) editado(s) · 2 apagado(s)
evora-quinze-anos-cinco-mandatos/pt                 182 blocos lidos · 179 no registo · 1002 unidades iguais · 19 isentas em 12 bloco(s) editado(s) · 3 apagado(s)
juntas apertadas na 07 pt                            20 · 0 imprimem um espaço

5 edições · 581 blocos lidos · 2668 unidades · 2614 iguais carácter a carácter · 54 isentas
113 operações da passagem de voz: 41 blocos editados e 11 apagados
```

**A ressalva que o brief não podia prever, e que faz esta prova ser honesta.** O
brief §5 pedia que a leitura de `studies-src/<slug>/<lingua>.html` desse, unidade
a unidade, exatamente os `text` do registo. **Medido: não dá, e não pode dar.**
O registo não é a leitura do olho da edição alojada: é
`transform(eyetext(edição))`, onde `transform` são as 113 operações da passagem
de voz que o diretor aprovou e que viajam ao lado do registo em
`<lingua>.cortes.json` (o D3 prende-lhes os bytes). Nos 41 blocos que a voz
editou e nos 11 que apagou por inteiro, a leitura e o registo **têm** de
divergir. Exigir igualdade ali seria exigir que a passagem de voz não tivesse
acontecido, e a prova falhava em quatro das cinco edições.

O que a prova faz em vez disso: compara carácter a carácter os blocos que
nenhuma operação tocou (2 614 unidades), e prova os outros **pelo outro
caminho** — a frase que a voz declara ter tirado está na leitura e não está no
registo, e a que a substituiu está no registo. O alinhamento é por TEXTO e não
por coordenadas: as coordenadas do ficheiro de operações são do rascunho e de
estados intermédios (medido: o 07 pt tem operações com `b_no_registo` 92, 93 e
94 sobre um registo de 92 blocos), e um alinhamento por índice saía de passo à
primeira operação que apaga um bloco.

**O conhecido-positivo**, na forma do `core/eyetext_test.py`: as doze formas
cuja resposta certa não está em dúvida, a recusa de um `<li>` fora de lista e de
uma célula fora de linha, o endereço a ficar na âncora que o trouxe, o mapa do
aperto, e dois estragos plantados numa cópia em memória de um registo real (um
bloco deitado fora, um espaço fantasma numa junta apertada). Com um estrago
plantado no PRÓPRIO leitor — os pedaços juntos com um espaço, que é a leitura do
`visible_text` da casa — a prova fecha com **exit 1** e nomeia seis
conferências, entre elas «uma fronteira de linha dentro de uma palavra: leu
["a ."], esperava ["a."]» e «a leitura imprime 2 espaço(s) fantasma numa junta
apertada, e tem de imprimir zero»; reposto o ficheiro, volta a **exit 0**.

### Os dez estragos plantados e os três controlos

Cada um numa cópia alterada em `dist/`, com o resumo dos bytes registado antes,
a conferência a fechar com o seu próprio nome e **exit 1**, e o ficheiro reposto
e conferido pelo resumo. As frases estão na `DECISIONS.md` §1.64, subsecção P2.

| | o estrago | fecha | exit |
|---|---|---|---:|
| 1 | um carácter mudado num parágrafo do 08 pt | L2 | 1 |
| 2 | um espaço antes de um ponto final, na junta apertada de um `<em>` do 04 pt | L2 | 1 |
| 3 | um bloco `rule` deitado fora | L1 | 1 |
| 4 | um intervalo `strong` deslocado um carácter | L3 | 1 |
| 5 | uma figura a imprimir o `value` (`51.95`) em vez do `printed` (`51,95`) | L2 + L4 | 1 |
| 6 | uma figura sem `data-registo` | L2 + L4 | 1 |
| 7 | uma célula `header` rendida como célula de corpo | L7 | 1 |
| 8 | uma figura sem linha do sítio com um selo ao lado | L6 | 1 |
| 9 | a faixa com «102 blocos» trocado por «103 blocos» | L5 | 1 |
| 10 | uma marca `data-registo` numa página de estudo | a nona origem, fora da rota | 1 |
| 11 | **controlo:** o 04 com a tabela onde a edição arquivada tem gráficos | nada | 0 |
| 12 | **controlo:** uma figura cujo `printed` é igual ao `value` | nada | 0 |
| 13 | **controlo:** os oito registos intactos, a construção inteira | nada | 0 |

O controlo 11, medido: a edição arquivada do 04 pt tem **4 regiões de gráfico**
(`<figure>` com legenda) e 12 tabelas; a página de leitura tem **13 tabelas** e
zero regiões de gráfico, e o bloco 12 é a tabela que o primeiro gráfico
substitui. O controlo 12: **301 das 326** figuras do 04 pt imprimem exatamente o
`value` da sua linha do motor.

### A régua do inventário de frases, antes e depois

| | frases de moldura | rota `texto` |
|---|---|---|
| antes da etapa (318 páginas, a construção da P1) | **90 distintas · 2 530 ocorrências** | a rota não existia |
| com as oito páginas e a régua POR ensinar | **148 distintas · 3 051 ocorrências** | não medida |
| com as oito páginas e a régua ensinada | **91 distintas · 2 542 ocorrências** | 9 distintas · **autorreferência 0** |

As 57 frases distintas que a lição tira da conta são resumos de origem de 64
hexadecimais, nomes de entidades adjudicantes e títulos de relatórios do
Tribunal de Contas: o documento a falar, contado como moldura da casa. O único
acrescento real é «Ler o documento → Ler no sítio →», que é o par de portas da
página do estudo, em 4 páginas.

Nas oito rotas novas o inventário lê **7 blocos por classificar → 0**, com as
catorze cadeias (sete por edição) classificadas em `INVENTARIO-FRASES.md`. As
seis rotas que já tinham blocos por classificar antes (`/estudos`,
`/en/studies`, as duas do livro-razão e as duas do estudo das pensões) continuam
com os mesmos, e **nenhuma outra rota mexeu**.

### As medidas de forma, a 1280 e a 390

`node tests/texto/leitura.mjs` · **26/26**.

* **1280**: a grelha é `544px 300px` com 51,2px de intervalo, dentro do
  invólucro de 1180 — **exatamente a mesma** de `/livro-razao/<id>` e de
  `/municipios/evora`, medida nas três na mesma corrida. A prosa do corpo a
  19px/30,4px. A figura em Bitter com `tabular-nums lining-nums`, a frase em
  Spectral, a mesma tinta nas duas;
* **o selo**: colado à figura sem um nó de texto pelo meio (4px de afastamento,
  dados pela folha), na linha da figura, e nunca dentro de outro alvo;
* **transbordo**: a 320, 390, 768, 1024 e 1280, nas três edições medidas (04 pt,
  03 pt, 08 pt), `document.scrollWidth` é igual a `window.innerWidth`. A 320 e a
  390 há elementos mais largos do que a janela (uma `TABLE` a 552px no 04, a
  738px no 03), e **rolam dentro da sua caixa**: 3 das 13 caixas do 04 pt rolam
  a 390;
* **390**: a coluna do aparelho passa para baixo do corpo; a etiqueta mais longa
  do 03 pt (**283 caracteres**, o próprio endereço) quebra em 8 linhas por
  `overflow-wrap: anywhere` e cabe.

### A leitura do 04 pt contra a edição arquivada

Lida de alto a baixo, com a edição arquivada ao lado. O que se vê:

* **102 blocos**, 414 unidades marcadas, **326 figuras**: um `h1`, 9 `h2`, 4
  `h3`, 63 parágrafos, 10 filetes, 13 tabelas (41 `th`, 288 `td`) e 2 listas. A
  sequência de títulos e de tabelas é a mesma da edição arquivada, na mesma
  ordem;
* **a tabela no lugar dos gráficos**: o bloco 12 é a tabela de seis linhas
  («Aprovado e atribuído a Évora · €167 372 756», «Pago · €86 944 669»,
  «Execução · 51,95 %», e as três contagens de localizações) onde a edição
  arquivada desenha o primeiro dos seus quatro gráficos. **É o desenho, não um
  defeito**;
* **as ligações do documento vivas**: 16 âncoras no corpo, todas com
  `rel="noopener"`, das quais **10 para `tcontas.pt`** (as fichas dos relatórios
  do Tribunal de Contas), 3 para `dados.gov.pt`, 1 para `base.gov.pt`, 1 para
  `ine.pt` e 1 para `cohesiondata.ec.europa.eu`. **Nota de rigor:** o brief e o
  plano dizem «as dezasseis ligações do Tribunal de Contas»; medidas, são
  dezasseis ligações no corpo e dez delas do Tribunal;
* **os doze selos**: 12 figuras têm linha neste livro-razão, e cada uma leva o
  selo colado, com o quadrado a tracejado onde a linha tem um campo por
  confirmar. As 12 resolvem em **7 linhas distintas**, e as 7 entradas dessas
  linhas em «As linhas deste documento» levam a porta longa para
  `/livro-razao/<id>`;
* **as portas das outras figuras**: das 326, **293** são âncoras
  `#linha-<row>` para a sua entrada; **21** são figuras dentro de uma ligação do
  documento e ficam em `<span>` sem uma segunda âncora, com a porta na entrada
  da linha (medido: **nenhuma** figura dentro de uma ligação tem linha do sítio,
  nas oito edições);
* **«As linhas deste documento»**: 212 entradas, 636 campos marcados. A entrada
  de `prr-execution-evora` mostra a divergência a preto no branco: «o valor como
  a linha o guarda 51.95» e «como este documento o imprime 51,95». A de
  `comp-c11-locations` mostra duas formas impressas da mesma linha, «3 · 03»;
* **a faixa**: «102 blocos · 326 algarismos · 12 com linha do livro-razão», com
  os três números recontados pelo portão e cada um com a sua porta;
* **o marcador `(inferência)`** aparece 11 vezes, e o Método já o explica
  (§1.63). Nada a fazer aqui;
* **o fim**: a página acaba com a frase «Tudo foi recolhido em direto para este
  documento.» e a tabela das oito fontes, **sem o título** «Método, e onde o
  verificar» que a edição arquivada tem por cima. É a passagem de voz, que
  cortou o título e deixou o corpo da secção. Fica na **I65**.

### As corridas verdes

```
npm run build                      exit 0 · 342 páginas · 33 chaves da prova · 16 documentos · 548 cartões
npm run typecheck                  exit 0
node scripts/provar-eyetext.mjs    exit 0 · 157 conferências
node tests/texto/leitura.mjs       26/26
node scripts/medir-defeitos.mjs    exit 0 · rota `texto` com autorreferência 0 nas oito páginas
```

As 342 páginas são as 334 da P1 mais as oito de leitura. As 33 chaves da prova
não mudaram: as chaves novas são da P3.

### O que fica por fazer, e é da P3 em diante

* **Nenhuma chave nova em `src/lib/prova.mjs`.** As oito contagens do sítio
  inteiro e o `check:cadeia` são a P3; a faixa de cada página conta por si, com
  a recontagem do portão contra o registo em disco.
* **`noindex` e fora do mapa do sítio**, por contrato desta sessão. A decisão de
  indexar é da sessão de UX, e é uma linha do `astro.config.mjs` mais o
  `noindex` da vista.
* **A leitura cruzada do Codex** sobre este par, com as seis plantas da §7 do
  plano, ainda não correu.
* **A I65 e a I66** ficam abertas e escritas: o troço sem título que a passagem
  de voz deixou em cinco das oito páginas, e o selo entre a figura e o resto do
  texto da unidade.

---

## P3 · o `check:cadeia` e as oito chaves na prova

*Construída a 24.08.2026 pelo construtor (Claude Opus 5, `claude-opus-5[1m]`) no
ramo `parte3-2026-08-24`, sobre a P2, a partir de `7626a2a`. O brief é
`briefs/BRIEF-parte3-P3.md`; o plano é a `ESTIMATIVA-PARTE3-2026-08-24.md` §4 e
§0.3; as onze decisões do diretor estão em `ESTADO-DO-MAIN-2026-08-24.md` e
nenhuma se reabriu. O registo da etapa é a `DECISIONS.md` §1.64, subsecção P3.
O motor não foi tocado: esteve em leitura, e só para confirmar o que o seu
manifesto de travessia declara `excluded`.*

### Os commits

| repositório | commit | o quê |
|---|---|---|
| sítio | `a79fb93` | `scripts/check-cadeia.mjs`, as oito chaves em `src/lib/prova.mjs`, as oito recontagens e a vista `registos` no `scripts/gate-html.mjs`, o passo no `package.json` |
| sítio | `1b32984` | a marca sai da lista quando é figura e uma figura sem linha do motor não pára a travessia; o `OEDP_REGISTOS_DIR` no `scripts/check-documentos.mjs` |
| sítio | (este) | o registo: a subsecção P3 na `DECISIONS.md` §1.64, a contagem das vistas na §2.2, o `README.md` e esta nota |

### O guião, corrido inteiro

`node scripts/check-cadeia.mjs` · **exit 0**.

```
  03 pt ·  55 blocos · 411 algarismos ·  0 completas · 411 do motor · 0 por resolver ·   0 com resumo de origem · 411 com motivo
  06 pt ·  53 blocos · 171 algarismos · 10 completas · 161 do motor · 0 por resolver ·   0 com resumo de origem · 171 com motivo
  07 en ·  91 blocos · 194 algarismos · 52 completas · 142 do motor · 0 por resolver ·  12 com resumo de origem · 182 com motivo
  07 pt ·  92 blocos · 194 algarismos · 52 completas · 142 do motor · 0 por resolver ·  12 com resumo de origem · 182 com motivo
  09 pt · 155 blocos · 297 algarismos · 10 completas · 287 do motor · 0 por resolver · 208 com resumo de origem ·  89 com motivo
  04 en · 102 blocos · 326 algarismos · 11 completas · 315 do motor · 0 por resolver ·   0 com resumo de origem · 326 com motivo
  04 pt · 102 blocos · 326 algarismos · 12 completas · 314 do motor · 0 por resolver ·   0 com resumo de origem · 326 com motivo
  08 pt · 179 blocos · 682 algarismos · 49 completas · 633 do motor · 0 por resolver · 278 com resumo de origem · 404 com motivo

  as oito chaves da prova, contadas aqui:
    registos_edicoes                    8
    registos_blocos                   829
    registos_algarismos              2601
    registos_resolvidos              2601
    registos_por_resolver               0
    registos_com_linha_do_sitio       196
    registos_com_resumo_de_origem     510
    registos_sem_resumo_de_origem    2091

  das 196 figuras com linha do sítio, 77 imprimem o valor que a linha guarda e 119 imprimem outra cadeia.

  ✓ cada algarismo das páginas de leitura chega ao fim da sua cadeia: 196 até ao selo, 2405 até à entrada do motor.
```

*(as linhas do guião saem sem alinhamento de colunas; aqui vão alinhadas para se
lerem em coluna, e os números são os que o comando imprimiu.)*

Os oito totais batem, número a número, com os que o plano §4.2 mediu, e com o
que o portão reconta em `dist/prova.json`. A ordem das edições é a do registo de
travessia (`slug/lingua`), que é a de todos os outros portões desta casa, e não
a do número do estudo do motor.

### As três diferenças em relação ao brief, medidas

| | o brief | medido | porquê |
|---|---|---|---|
| a linha de exemplo do 04 pt | «63 com resumo de origem · 263 com motivo» | **0 com resumo · 326 com motivo** | a soma é a mesma (326) e a repartição não: nenhuma figura do 04 traz `source_sha256`. Medido nas oito edições, as figuras com resumo repartem-se 0 · 0 · 12 · 12 · 208 · 0 · 0 · 278, e nenhuma edição dá 63 |
| a cadeia do motor | 2 396 figuras (plano §4.1) | **2 405** | 2 601 menos as 196 com linha do sítio. As 9 de diferença são as figuras cujas linhas o manifesto do MOTOR declara `excluded`; deste lado não se distinguem, porque o `ledger/cruzamentos/evora.json` só traz `rows` e as entradas `excluded` do motor nomeiam padrões em prosa |
| a §0.3 | 119 das 196 divergem | **119 divergem, 77 iguais** | recontado pelo guião a cada construção, contra `ledger/claims/<id>.yml` |

### Os sete estragos plantados

Cada um com o resumo do ficheiro registado antes, a conferência a fechar com
**exit 1**, o ficheiro reposto e conferido pelo resumo, e `git status
--porcelain` limpo. As frases estão na `DECISIONS.md` §1.64, subsecção P3.

| | o estrago | fecha | exit |
|---|---|---|---:|
| 1a | uma marca `data-registo` na página com uma coordenada que não é figura nenhuma | L4 + `check:cadeia` C5, nos dois sentidos | 1 |
| 1b | numa cópia do registo com o manifesto refeito, uma figura com `row` vazia | `check:cadeia` C2, com `registos_por_resolver` 1 · e o L6 do portão | 1 |
| 2 | na mesma cópia, uma figura sem resumo e sem motivo, e outra com um motivo fora dos cinco | `check:cadeia` C1, duas vezes | 1 |
| 3a | a faixa do 04 pt com «326 algarismos» trocado por «327» | L5 | 1 |
| 3b | uma marca `data-registo` a mais, que muda o total do sítio | a comparação da prova: «a prova diz que "registos_algarismos" é 2601 e o portão conta 2602 (vista: dist)» | 1 |
| 4 | `167 372 756` trocado pelo `value` da linha, `167 372 755,84` | L4 + `check:cadeia` C5 | 1 |
| 5 | um selo ao lado de uma figura sem linha do sítio | L6 + `check:cadeia` C6 | 1 |

**O controlo que vale a etapa inteira:** nas duas plantas de cópia (1b e 2), o
`check:documentos` corrido sobre a cópia dá **exit 0**. O manifesto da cópia foi
refeito, os bytes batem, e o portão que prende bytes não tem nada a dizer. É o
`check:cadeia` que apanha o estrago. Um resumo prende bytes; não prende sentido.

O estrago 3 do brief tinha dois fechos escritos («a recontagem do portão (P2,
L5) e a comparação de `dist/prova.json`») e a faixa sozinha só fecha o primeiro:
a faixa é uma `data-registo-conta` de UMA edição, e as oito chaves são totais do
sítio que nenhuma página rende. O 3b é a metade que faltava, plantada onde ela
existe: no total, e não na faixa.

### As corridas verdes

```
npm run build                      exit 0 · 342 páginas · 41 chaves da prova · 8 páginas de leitura
npm run verify                     exit 0
npm run typecheck                  exit 0
node scripts/check-cadeia.mjs      exit 0 · 8 edições · 2 601 algarismos
node scripts/provar-eyetext.mjs    exit 0 · 157 conferências
```

As 342 páginas não mudaram: a P3 não acrescenta nenhuma. As chaves da prova
passam de 33 a 41, e a repartição por vista fica **dist 16 · ledger 18 ·
registos 4 · modulo 3**.

### O encontro com a primeira leitura cruzada

A leitura cruzada do Codex (`5039858`, sobre a construção `7626a2a`) correu
enquanto esta etapa se construía, e a sua High 3 é a mesma coisa que a escolha
da vista destas duas chaves: **as figuras dentro de uma ligação do documento não
têm porta própria.** Duas medições independentes, uma sobre o `dist/` a contar
saídas e outra a ler as páginas sem contexto, deram no mesmo sítio.

O número exato, medido nas páginas construídas: **21 por edição do 04, 42 no
âmbito**, e não 22 e 44. O relatório conta 18 figuras no bloco 62 e são 17, que
é o que a tabela tem (a linha 1 tem duas células com figura e as linhas 2 a 6
têm três). As coordenadas são `#62.1.1.0` a `#62.6.1.2`, `#69.0.0`, `#69.0.1`,
`#69.1.0` e `#71.0`, iguais nas duas edições do 04. As outras seis edições não
têm figuras dentro de ligações.

A correção («a porta vai imediatamente a seguir à ligação») é da ronda de
correções e não desta etapa. Quando entrar, o passo 6 do `check:cadeia` passa a
exigi-la, e `registos_resolvidos` e `registos_por_resolver` podem passar à vista
`dist`.

### O que fica por fazer, e é da P4 em diante

* **As oito chaves esperam a decisão do diretor sobre o Método.** Existem, saem
  na prova e são recontadas; nenhuma página as rende. Entrarem nas listas
  `prova` de uma regra é uma edição de `src/data/metodo.mjs`, que é texto
  governado.
* **As oito edições sem registo** continuam sem cadeia, porque não têm registo:
  é a P4.
* **A leitura cruzada do Codex** sobre a P2 e a P3, com as plantas da §7 do
  plano, continua por correr.

---

## Correções 1 · a porta a seguir à ligação, depois da M1 e da primeira leitura cruzada

*Construída a 24.08.2026 pelo construtor (Claude Opus 5, `claude-opus-5[1m]`) no
ramo `parte3-2026-08-24`, sobre a P3, a partir de `8f9ca95`. O brief é
`briefs/BRIEF-parte3-correcoes-1.md`, escrito pelo lugar de direção depois da
medição cega M1 (`medicoes/parte3-M1-sonnet.md`) e da primeira leitura cruzada
(`critica/2026-08-24-codex-leitura-parte3-1.md`). O registo é a `DECISIONS.md`
§1.64, subsecção «A medição cega M1 e a primeira leitura cruzada». O motor não
foi tocado.*

### Os commits

| repositório | commit | o quê |
|---|---|---|
| sítio | `60f8cd8` | a porta a seguir à ligação: `registo-html.mjs`, `TextoView.astro`, `texto.css`, a chave `estudos.textoPortaDaLinha`, o L6 do portão, o C6 do `check:cadeia`, as duas chaves na vista `dist`, e as duas contagens da prosa nos dois comentários do código |
| sítio | (este) | o registo: a subsecção na `DECISIONS.md` §1.64, as duas contagens da prosa na §1.64 e na §2.2 item 9, a tabela de vistas da §2.2 item 7, a `CHAVES-EN.md`, esta nota e a `ISSUES.md` (I67 e I68) |

### O achado, medido antes e depois

`node medir-portas.mjs` sobre o `dist/` construído (leitor próprio, só
`node-html-parser`), nas oito páginas de leitura:

| edição | figuras | dentro de uma ligação | portas a seguir à ligação, antes | depois |
|---|---:|---:|---:|---:|
| 03 pt | 411 | 0 | 0 | 0 |
| 04 en | 326 | **21** | 0 | **21** |
| 04 pt | 326 | **21** | 0 | **21** |
| 06 pt | 171 | 0 | 0 | 0 |
| 07 en | 194 | 0 | 0 | 0 |
| 07 pt | 194 | 0 | 0 | 0 |
| 08 pt | 682 | 0 | 0 | 0 |
| 09 pt | 297 | 0 | 0 | 0 |
| **âmbito** | **2 601** | **42** | **0** | **42** |

As coordenadas são as 21 que a P3 nomeou, iguais nas duas edições do 04:
`#62.1.1.0` a `#62.6.1.2` (17), `#69.0.0`, `#69.0.1`, `#69.1.0` e `#71.0`. As
portas do corpo transcrito passam de 2 363 para **2 405**, e os selos ficam em
**196**: 2 405 + 196 = 2 601, que é toda a figura do âmbito com saída própria.

A forma rendida, verbatim de `dist/estudos/evora-prometido-pago-auditado-2026/texto/index.html`
(uma ligação com três figuras, e as três portas na ordem das figuras):

```html
<a class="texto-ligacao" href="https://www.tcontas.pt/…/rel021-2019-2s.pdf" rel="noopener"><span
class="texto-figura" data-registo="…pt#62.2.1.0">2</span>ª Secção Relatório nº <span
class="texto-figura" data-registo="…pt#62.2.1.1">21</span>/<span
class="texto-figura" data-registo="…pt#62.2.1.2">2019</span></a><a
class="texto-figura-porta-apos" href="#linha-tc-fifth-family-evora" aria-label="linha do motor: tc-fifth-family-evora"></a><a
class="texto-figura-porta-apos" href="#linha-tc-report-21-2019" aria-label="linha do motor: tc-report-21-2019"></a><a
class="texto-figura-porta-apos" href="#linha-tc-year-21-2019" aria-label="linha do motor: tc-year-21-2019"></a>
```

### O alvo de toque e o seu custo, medidos

`node medir-alvo.mjs` e `node medir-custo.mjs`, Chromium sem cabeça sobre o
`dist/` servido, nas duas edições do 04, a 1280 e a 390:

| medida | 1280 | 390 |
|---|---|---|
| caixa da porta | 24 × 24 a 24 × 25 px | 24 × 24 a 24 × 25 px |
| pares de áreas sobrepostas | **0** | **0** |
| tabela do bloco 62, sem a caixa → com a caixa | 594,1 → 697,1 px (+103,1) | 1 298,3 → 1 331,2 px (+32,9) |
| parágrafo do bloco 71 (prosa) | 244,1 → 244,1 px (**+0,0**) | 308,0 → 308,0 px (**+0,0**) |

A caixa de 24px e não a área de 44px do selo: as portas de uma ligação ficam
encostadas, e duas áreas de 44px a 13px uma da outra sobrepõem-se. É a lição
medida que a `site.css` já escreveu ao lado da área do selo. O custo em altura
está na `ISSUES.md` I68, com a alternativa.

### Os quatro estragos plantados

Cada um numa cópia alterada em `dist/`, com o resumo dos bytes registado antes,
a conferência a fechar com **exit 1**, o ficheiro reposto e conferido pelo
resumo, e `git status --porcelain` limpo. As frases estão na `DECISIONS.md`
§1.64, subsecção da ronda.

| | o estrago | fecha | exit |
|---|---|---|---:|
| 1 | uma figura dentro de uma ligação sem a porta a seguir (`#71.0`) | L6 · C6 · **e a prova**: «"registos_resolvidos" é 2601 e o portão conta 2600 (vista: dist)» | 1 |
| 2 | duas portas trocadas de ordem numa ligação com três figuras (`#62.2.1.0` e `.1`) | L6 (duas queixas) · C6 (duas queixas) | 1 |
| 3 | uma porta a mais, que não é a saída de figura nenhuma | L6, no outro sentido | 1 |
| 4 | o glifo escrito no gabarito, dentro da porta | L6 (porta com texto) + L2 | 1 |
| 5 | **controlo:** a construção inteira, intacta | nada | 0 |

O estrago 1 é o que prova a mudança de vista: a mesma planta que fecha o L6
fecha também a comparação da prova, e isso só acontece porque
`registos_resolvidos` passou a contar-se no `dist/`. Antes desta ronda, contava
figuras nos ficheiros do registo e uma porta que faltasse na página não lhe
mexia.

### As duas contagens da prosa

* **2 396 → 2 405**, nos quatro sítios que o diziam: o comentário do
  `scripts/gate-html.mjs`, o da `src/views/TextoView.astro`, a `DECISIONS.md`
  §1.64 e a §2.2 item 9. São 2 601 menos as 196 com linha do sítio; as 9 de
  diferença são as figuras cujas linhas o manifesto do **motor** declara
  `excluded`, e deste lado não se distinguem (`ISSUES.md` I67).
* **A linha de guião do brief da P3** («63 com resumo de origem · 263 com
  motivo») era ilustrativa e estava errada: o medido para o 04 pt é **0 e 326**.
  Não havia nada a corrigir no código; fica como lição na `DECISIONS.md`.

### As corridas verdes

```
npm run build                      exit 0 · 342 páginas · 41 chaves da prova · 8 páginas de leitura
npm run verify                     exit 0
npm run typecheck                  exit 0
node scripts/provar-eyetext.mjs    exit 0 · 157 conferências
node scripts/medir-defeitos.mjs    91 frases distintas · 2 542 ocorrências · autorreferência 0 nas oito rotas `texto`
node scripts/check-cadeia.mjs      exit 0 · 8 edições · 2 601 algarismos · 196 até ao selo, 2 405 até à entrada
```

As 342 páginas não mudaram, e as 41 chaves também não: o que mudou foi a
repartição por vista, de **dist 16 · ledger 18 · registos 4 · modulo 3** para
**dist 18 · ledger 18 · registos 2 · modulo 3**.

### O que fica por fazer

* **A M2** mede a forma nova da porta (a medição 6 da M1 aceitou a antiga,
  porque o brief dela a dava como legítima) e reconta as duas chaves na vista
  nova.
* **A leitura cruzada do Codex** sobre a P2 e a P3, com as plantas da §7 do
  plano, continua por correr.
* **A I66** (o selo que cai entre a figura e o resto da unidade) continua aberta
  de propósito, e a I68 (a altura das linhas das tabelas) é para a sessão de UX.
