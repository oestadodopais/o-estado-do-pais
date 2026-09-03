# As conferências de 03.09.2026 · o lado do sítio

*Escrito pelo construtor (Claude Opus 5) no ramo `conferencias-2026-09-03`, a partir de `main` em `2ab66578`. Blocos F0.11 e F0.12 do plano de fiabilidade de 02.09; o lado do motor está em `indicators/RELATORIO-conferencias-2026-09-03.md`, no repositório do motor, e traz o F0.2b inteiro, que não toca no sítio. Cada número desta página tem o comando que o mediu. Sem travessões na prosa.*

---

## 1 · O que mudou no sítio, e onde

```
$ git diff --stat -- src tests
 src/data/fontes.mjs       | 23 ++++-
 src/styles/site.css       | 21 +++++
 src/views/LinhaView.astro | 69 ++++++++++++-
 3 files changed, 109 insertions(+), 4 deletions(-)

$ git diff --stat -- ledger/claims
 935 files changed, 3764 insertions(+)

$ git status --short | grep '^??'
?? tests/linha/sem-resposta.mjs
```

As 935 linhas do livro-razão não foram editadas à mão: são reconferências escritas pelo corredor diário, com o autor `corredor-diario`, num bloco (`verifications[]`) que por regra do formato nunca se escreve à mão. `scripts/check-cruzamento.mjs` reconstrói cada linha cruzada tal como estava na travessia, tirando as entradas posteriores, e exige que os bytes reconstruídos dêem o resumo registado. É essa régua que as aceita, e é ela que continua a fechar a construção sobre qualquer outra alteração.

---

## 2 · F0.11 · «sem resposta desde dd.mm.aaaa» no recibo

### As três coisas que faltavam

1. **A data saía em ISO.** O recibo escrevia `2026-09-01`, que é a forma do dado e não a forma da superfície. A regra da casa é uma só («as datas escrevem-se dd.mm.aaaa em todo o lado», `src/lib/datas.mjs`).
2. **O estado só se lia por ENDEREÇO.** `FONTES_SEM_RESPOSTA` tem uma entrada por endereço, e uma linha cujo endereço não foi pedido na última corrida não tem lá entrada nenhuma. A partir do dia em que o corredor pergunta só a alguns anfitriões (o modo do portátil, F0.11), a página desenhava silêncio sobre o silêncio: nada, que é o que ela desenha quando a fonte responde.
3. **O selo fingia frescura.** O estado estava escrito no bloco das verificações, a meia página do número. O selo, sozinho ao lado do valor, lê-se como «isto está conferido», e numa linha cuja fonte deixou de atender essa leitura é falsa.

### O que passou a haver

**`src/data/fontes.mjs`** (ficheiro gerado pelo motor) traz um bloco novo, `ANFITRIOES_SEM_RESPOSTA`: o estado por anfitrião, e só quando **todos** os endereços que o arquivo conhece daquele publicador estão calados. É o estado que o disjuntor por anfitrião do corredor mede.

**`src/views/LinhaView.astro`** lê os dois, pela ordem do mais preciso primeiro (o endereço é uma observação sobre aquele ficheiro; o anfitrião é uma observação sobre a casa que o serve), escreve a data por `dataDaCasa()`, e rende o estado em DOIS sítios:

* `.linha-selo-estado`, na cabeça, logo a seguir ao selo: é o que impede o selo de fingir frescura ao lado do número;
* `.linha-sem-resposta`, no bloco das verificações: é o recibo, e já lá estava.

**Sem cor nova.** A `IDENTIDADE.md` §2 reserva a cor para os limiares de uma medida, e um estado de fonte não é um limiar. O que o torna visível é a POSIÇÃO e a forma de campo que o recibo já usa. **Sem frase nova e sem segundo marcador** (§6): a chave é a MESMA que o bloco das verificações usa (`s.livro.linha.semRespostaK`, «Sem resposta desde» / «No answer since»), e a data leva o mesmo `data-nonledger="data-da-conferencia"` de sempre, porque ela não é um algarismo do livro-razão.

**`src/styles/site.css`** ganha `.linha-selo-estado`, com a letra do identificador que está por baixo, pela mesma razão que ele a tem: é aparelho, não é leitura, e a cabeça já tem uma voz, a do número. Entra também na regra de 12px do ecrã pequeno.

### Como ficou rendido, medido no `dist/`

```
$ grep -o 'linha-selo-estado.\{0,200\}' dist/livro-razao/factor-sustentabilidade-2026/index.html
linha-selo-estado"><span class="linha-campo-k">Sem resposta desde</span>
  <span data-nonledger="data-da-conferencia">01.09.2026</span></p>
```

### A régua nova: `tests/linha/sem-resposta.mjs`

Não é um portão: corre fora do `npm run build`, a seguir a ele, porque o que ela mede são as páginas construídas. Sai com 1 quando alguma falha. Reconstrói, do livro-razão e do ficheiro gerado, a decisão que a página toma, e compara-a com as 2 916 páginas de linha. **Duas coisas, e as duas contam:** toda a linha que deve mostrar o estado mostra-o nos dois sítios, e **nenhuma** linha cuja fonte responde o mostra. A segunda metade é a que uma régua distraída não mede: bastava render o estado sempre para a primeira passar.

```
$ node tests/linha/sem-resposta.mjs; echo "exit=$?"
  2916 página(s) de linha lidas em …/dist (0 linha(s) sem página).
  4 linha(s) devem mostrar «sem resposta desde» · 2912 não devem.
  endereços calados: 2 · anfitriões calados: 1

SEM-RESPOSTA: PASS — 5832 conferências (o estado e a sua ausência, em cada página)
exit=0
```

As quatro são as do `www.dgcp.mtsss.gov.pt` (`factor-sustentabilidade-2026` e as três da penalização), cujo único endereço responde `SSLError` desde 01.09.

### O conhecido-positivo, vermelho e depois verde

**A planta:** `--plantar portalautarquico.dgal.gov.pt` acrescenta esse anfitrião ao `ANFITRIOES_SEM_RESPOSTA` do ficheiro gerado. Passam a ser 934 as linhas que devem mostrar o estado (as 4 da DGCP mais as 930 da DGAL).

**VERMELHO** (a régua contra o `dist/` construído antes da planta, isto é, contra páginas que não lêem o bloco por anfitrião):

```
$ node tests/linha/sem-resposta.mjs --plantar portalautarquico.dgal.gov.pt
  PLANTADO  portalautarquico.dgal.gov.pt em ANFITRIOES_SEM_RESPOSTA
$ node tests/linha/sem-resposta.mjs; echo "exit=$?"
  934 linha(s) devem mostrar «sem resposta desde» · 1982 não devem.
SEM-RESPOSTA: FAIL — 1860 problema(s) de 2916 páginas
 - abrantes-divida-dgal-2024: falta o estado na cabeça, ao pé do selo.
 - abrantes-divida-dgal-2024: falta o estado no bloco das verificações.
 …
exit=1
```

**VERDE** (as mesmas páginas construídas outra vez, agora com a leitura por anfitrião):

```
$ npm run build          # exit 0, 302 s
$ node tests/linha/sem-resposta.mjs; echo "exit=$?"
  934 linha(s) devem mostrar «sem resposta desde» · 1982 não devem.
SEM-RESPOSTA: PASS — 5832 conferências
exit=0
```

**E de volta ao estado real:** `--repor` devolve o ficheiro gerado ao que o corredor escreveu, e a construção final volta às 4.

**Um anfitrião que responde não desenha nada.** É a segunda metade da régua, e está provada nas mesmas corridas: as 930 linhas da DGAL, cujo anfitrião respondeu 200 cinco vezes hoje, ficam sem estado nenhum nas 2 912 páginas da corrida limpa, e a régua falharia se alguma delas o desenhasse.

**Uma correção da própria régua, e não da página.** A primeira redacção procurava a forma ISO em todo o HTML e ficou vermelha nas quatro linhas da DGCP. Não era um defeito da página: o recibo rende `verifications.N.date` como CAMPO DO LIVRO-RAZÃO, em ISO e dentro de um `data-linha-campo`, porque é isso que o portão de HTML compara carácter a carácter com o livro. A régua passou a medir a data DENTRO dos dois elementos do estado. Uma régua que confunde o dado com a superfície manda mudar a coisa certa.

---

## 3 · As reconferências que entraram nas linhas

### A DGAL, do portátil (F0.11)

A corrida está medida do lado do motor. O que ela deixou no sítio:

* **930 linhas** com uma entrada nova, `date: 2026-09-03`, `result: igual`, `by: corredor-diario`, `path` igual ao `source_url` da linha;
* **`src/data/fontes.mjs`** com o bloco `CONFERENCIA` **byte a byte como estava** (a corrida foi parcial e não pode assinar a frescura de todas as fontes), e os dois blocos do estado reescritos;
* `ANFITRIOES_SEM_RESPOSTA` com um anfitrião, `www.dgcp.mtsss.gov.pt`, desde 01.09.

### As cópias arquivadas (F0.12)

* **6 linhas** com uma entrada nova, `result: igual`, e o `path` do `web.archive.org`, porque o `path` de uma conferência é o endereço que foi lido nesse dia e é isso que a régua do sítio exige.

```
$ python3 -c "…"   # sobre ledger/claims/*.yml
entradas de 2026-09-03: {('igual', 'corredor-diario'): 936}
```

---

## 4 · F0.12 · as dez, com a decisão e a prova

Medido no `dist/` construído, e não deduzido do código:

| # | linha | campos `[a verificar]` | no sitemap | `noindex` | marcador na página | decisão |
|---|---|---|---|---|---|---|
| 1 | `evora-prr-aprovado-2026` | `excerpt` | não | sim | 4 | **conferida** contra a cópia arquivada |
| 2 | `evora-prr-municipio-contratado` | nenhum | sim | não | 1 | **conferida** contra a cópia arquivada |
| 3 | `evora-prr-pago-2026` | `excerpt` | não | sim | 4 | **conferida** contra a cópia arquivada |
| 4 | `evora-prr-universidade-contratado` | nenhum | sim | não | 1 | **conferida** contra a cópia arquivada |
| 5 | `evora-prr-vencido-aprovado-2026` | `excerpt` | não | sim | 4 | **conferida** contra DUAS cópias arquivadas |
| 6 | `agua-nao-faturada-portugal-2024` | `source_url`, `excerpt` | não | sim | 6 | **marcador**, e já lá estava |
| 7 | `ciclo-substituicao-condutas` | sete campos | não | sim | 23 | **marcador**, e já lá estava |
| 8 | `avisos-pt2030-abertos` | seis campos | não | sim | 20 | **marcador**, e já lá estava |
| 9 | `avisos-pt2030-pessoas-singulares` | seis campos | não | sim | 20 | **marcador**, e já lá estava |
| 10 | `saldo-natural-portugal-2025` | cinco campos | não | sim | 17 | **marcador**, e já lá estava |

As cinco de baixo têm o `source_url` a `[a verificar]`: não há endereço nenhum para o corredor pedir. O que a casa lhes deve é o que elas já têm, e a coluna do meio prova-o: `provenienciaIncompleta()` em `src/lib/ledger.mjs` vê os campos por confirmar, o `filter` do `astro.config.mjs` tira-as do mapa do sítio e o `LinhaView` põe-lhes `noindex`. O que falta nelas é uma leitura humana da fonte, que é trabalho de conteúdo e não de automação.

As cinco de cima ganharam hoje a reconferência mais forte que a casa sabe fazer: os bytes de hoje contra o sha256 que a **própria linha** declara em `document.computed_over.files[].sha256`. A prova está no relatório do motor.

### O que se decidiu NÃO fazer, e porquê

Duas das dez (`evora-prr-municipio-contratado` e `evora-prr-universidade-contratado`) estavam, antes desta sessão, **no mapa do sítio e sem `noindex`**, com a proveniência completa e sem uma única reconferência. A saída fácil era escrever `[a verificar]` num campo delas para que a régua da proveniência incompleta as apanhasse. **Não se fez, e a razão é a regra 11 ao contrário:** nenhum campo dessas duas está por confirmar. A fonte, o documento, a edição, o localizador, o excerto, a data de acesso, o período: está tudo escrito, e o ficheiro sobre que a conta foi feita está identificado pelo resumo dos seus bytes. Marcar como incerto o que é certo é uma invenção como qualquer outra, só que na direção contrária.

O que elas precisavam era de ser **relidas**, e é o que passaram a ser. Depois desta sessão, as linhas primárias do livro-razão sem uma única reconferência são **zero**.

### O que fica escrito para o lugar de direção

Se um dia houver uma linha primária que **não** se possa reler por meio nenhum (sem cópia arquivada, sem resumo declarado, com a fonte a servir outra coisa), a casa não tem hoje superfície para o dizer. O recibo já rende o marcador ao lado de «Reconferido a» quando a lista está vazia, e isso é a metade visível; a metade que falta é a linha sair do mapa do sítio, e essa vive em `provenienciaIncompleta()` (`src/lib/ledger.mjs`), que hoje pergunta só pelos CAMPOS. O alcance da mudança está medido: uma régua que contasse «primária e nunca relida» como incompleta apanharia **0 linhas** hoje e **0 das 334 derivadas** (as derivadas não têm endereço próprio, e a proveniência delas é a das origens). Fica como decisão e não como remendo, porque `src/lib` é território de outro ramo esta noite (`typecheck-2026-09-03`).

---

## 5 · Os portões

| corrida | quando | exit | segundos |
|---|---|---|---|
| `npm run build`, antes de qualquer alteração | 09:22 | 0 | 300 |
| `npm run build`, com as alterações | 09:35 | 0 | 313 |
| `npm run build`, com a planta do anfitrião | 09:48 | 0 | 302 |
| `npm run build`, final da primeira passagem | 10:02 | **0** | 298 |
| `npm run verify`, primeira passagem | 10:07 | **0** | 59 |
| `npm run typecheck`, primeira passagem | 10:08 | **0** | 1 |
| `npm run build`, **segunda passagem** | 11:02 | **0** | 307 |
| `npm run verify`, **segunda passagem** (já com `check:fontes`) | 11:08 | **0** | 67 |
| `npm run typecheck`, **segunda passagem** | 11:09 | **0** | 0 |

Os três a 0, lidos dos registos antes do commit.

**A régua passou a portão, e o argumento anterior caiu.** A primeira redacção deste relatório justificava deixá-la fora do `verify` assim: «o que ela mede depende de uma corrida do corredor que não acontece dentro da construção». O argumento está errado, e a leitura a frio apanhou-o (Major 7). O que ela mede é o `dist/` contra `src/data/fontes.mjs`, e os dois são ficheiros do repositório: a construção não pergunta nada à rede, e o que o portão confere é que a página diz o que o ficheiro gerado diz. Um portão que corria fora do `verify` era um portão que ninguém era obrigado a correr.

---

## 6 · Segunda passagem, depois da leitura a frio do Codex (03.09.2026)

*A leitura está em `design/especime-v3/critica/2026-09-03-codex-leitura-f0b-conferencias.md`: doze achados, cinco deles plantas do pacote que o leitor viu todas e que não existem nestes ramos, e um que é do próprio pacote. Deste lado mordem quatro: Major 4 e 5 (o que o recibo diz e o que ele não pode fingir), Major 7 (a régua passa a portão) e Major 8 (o que os relatórios afirmavam e nada conferia) e Major 9 (o que a cópia arquivada prova). O lado do motor está no relatório do motor, §5.*

### Major 4 · o recibo aprende dois estados

Uma fonte que não atende e uma fonte que responde `403` não são a mesma coisa, e o sítio dizia «Sem resposta desde» às duas. Chamar «sem resposta» a um 404 diz ao leitor que a fonte se calou, quando o que ela fez foi mudar o endereço.

* `src/i18n/strings.mjs:1256-1279` e `:2274-2278`: `respondeuComErroK` («Respondeu com erro desde» / «Answering with an error since») ao lado do `semRespostaK` que já havia, nas duas edições;
* `src/views/LinhaView.astro:322-331`: `rotuloDoEstado` escolhe um dos dois pelo campo `estado` que o ficheiro gerado agora traz. Uma entrada escrita antes de hoje não o traz, e a falta lê-se pelo que ela é: o que a casa sabia então era só «não se leu», e fica a palavra mais fraca das duas.

**E as duas aparecem nos dados a sério**, o que é a prova de que a separação não é teórica:

```
$ tail -24 src/data/fontes.mjs
  'https://emprego.azores.gov.pt/estatisticas/':  'estado': 'respondeu-com-erro'   (403 da Cloudflare, desde 30.08)
  'https://www.dgcp.mtsss.gov.pt/…':              'estado': 'sem-resposta'         (SSLError, desde 01.09)
```

### Major 5 · quem observou, e o selo que não pode parecer fresco

* **quem observou** (`src/views/LinhaView.astro:333-347`): «a esta máquina: `<nome>`» quando o índice do arquivo sabe a máquina, «ao corredor» quando não. «A DGAL não responde» e «a DGAL não respondeu a esta máquina» são duas frases diferentes, e só a segunda é verdade;
* **o selo** (`src/views/LinhaView.astro:540-560`): a cabeça mostra agora, no MESMO bloco e um a seguir ao outro, **a data da última conferência que correu bem** desta linha e **a data em que a fonte dela começou a falhar**. Um leitor não pode ver uma sem a outra. A data da conferência sai por `CampoDaLinha` com o `data-linha-campo` da entrada, porque é um campo do livro-razão e o portão de HTML compara-a com o livro; a da falha sai por `data-nonledger`, porque não é. **Sem cor nova:** a `IDENTIDADE.md` §2 reserva a cor para os limiares de uma medida.

### Major 9 · o que a cópia arquivada prova, dito ao leitor

`src/views/LinhaView.astro:363-377` e `:1069-1082`: uma conferência cujo `path` é um endereço de `web.archive.org` passa a render **«contra a cópia arquivada de dd.mm.aaaa»**, com a data do instantâneo tirada dos catorze algarismos do próprio endereço. O `result` continua `igual` e o `path` continua o endereço do arquivo, porque foi ele que se leu; o que muda é que o leitor deixa de poder confundir uma conferência de integridade da cópia com uma releitura da fonte viva. As cinco linhas do PRR são exactamente esse caso: o publicador já não serve o instantâneo sobre que a conta foi feita.

### Major 7 · a régua passa a portão

A primeira redacção corria fora do `verify`, contava as páginas em falta e seguia em frente, media só a edição portuguesa, comparava a classe e a data mas não o texto do rótulo, e importava o formatador da produção para conferir a produção. Cinco defeitos numa régua, e cada um deles é uma maneira de ela dizer que sim sem ter olhado.

| o que mudou | onde |
|---|---|
| entra no `npm run verify`, a seguir ao `gate:html` | `package.json` (`check:fontes`) |
| uma página de linha que falta é uma FALHA | `tests/linha/sem-resposta.mjs:212-222` |
| mede as DUAS edições (`/livro-razao/<id>` e `/en/ledger/<id>`) | `tests/linha/sem-resposta.mjs:76-90` |
| compara o TEXTO LITERAL do rótulo nas duas línguas, e que o outro rótulo NÃO está lá | `tests/linha/sem-resposta.mjs:255-275` |
| escreve a data pela sua PRÓPRIA regra, sem importar `dataDaCasa()` | `tests/linha/sem-resposta.mjs:92-97` |

A tabela dos rótulos é uma segunda cópia da de `src/i18n/strings.mjs`, e é de propósito: uma régua que lesse a tabela da produção confirmava a tabela e não a página.

### Major 8 · o que se afirmava passa a conferir-se

Os dois relatórios diziam que as linhas de proveniência incompleta levam `noindex` e ficam fora do mapa do sítio, e nada o conferia. `tests/linha/sem-resposta.mjs:296-322` confere-o sobre o `dist/` construído e sobre o `dist/sitemap-0.xml` que ele traz, nos dois sentidos: uma linha incompleta que esteja no mapa é uma falha, e uma linha completa que esteja fora dele também.

```
$ node tests/linha/sem-resposta.mjs; echo "exit=$?"
  5832 página(s) de linha lidas em …/dist, nas duas edições (2916 linha(s) × 2).
  4 linha(s) devem mostrar o estado da fonte · 2912 não devem · 8 de proveniência
  incompleta, fora do mapa e com noindex.
  endereços em falha: 2 · anfitriões em falha: 1

FONTES: PASS — 17496 conferências
exit=0
```

As 8 são as 5 sem endereço nenhum mais as 3 do PRR cujo `excerpt` é o marcador.

### Os conhecidos-positivos deste portão, vermelhos e depois verdes

Plantados sobre o `dist/` construído, que é o que este portão mede, e desfeitos a seguir.

| # | a planta | o que o portão disse | exit |
|---|---|---|---|
| 1 | uma página de linha apagada do `dist/` | `abrantes-divida-dgal-2024 (pt): não há página construída em …` | 1 |
| 2 | a edição INGLESA com o rótulo português | `factor-sustentabilidade-2026 (en): a cabeça não escreve o rótulo «No answer since»` (e o mesmo para o recibo) | 1 |
| 3 | a data em ISO dentro do bloco do estado | `a cabeça não escreve «01.09.2026» … sai em ISO («2026-09-01») e a regra da casa é dd.mm.aaaa` | 1 |
| 4 | uma linha incompleta acrescentada ao `sitemap-0.xml` | `saldo-natural-portugal-2025: proveniência incompleta e no mapa do sítio` | 1 |
| — | as quatro desfeitas | `FONTES: PASS — 17496 conferências` | 0 |

A planta 1 ficou MUDA na primeira tentativa: o portão rebentava com uma excepção ao ler a página em falta no bloco do mapa, e um portão que rebenta não diz o que falhou, diz que ele próprio falhou. Consertado em `tests/linha/sem-resposta.mjs:300-306`, e a planta repetida deu a mensagem acima.

E o portão apanhou um defeito SEU na primeira corrida a sério: o recorte de um `<dd>` não continha o rótulo, porque o rótulo vive no `<dt>` ao lado. Oito falhas sobre um recibo que estava certo. Consertado em `tests/linha/sem-resposta.mjs:152-166`.
