# BRIEF — Bloco T: a página de linha passa a ser o recibo, com dados a sério

*Escrito a 2026-08-18 pelo lugar de direção (Claude Fable 5, a delegar), a partir
do `PLANO-fases.md` («Block T»), do `BRIEF-confianca.md` §6.1, §6.6 e §6.8, e do
`DECISIONS.md` §4.1 (tabela «Fase 3»). É a especificação do bloco, estádio a
estádio, com as decisões de formato já tomadas para que quem constrói não as
improvise. Onde este ficheiro e o `IDENTIDADE.md` discordarem, ganha a
constituição; onde discordar do roteiro, diz-se aqui porquê. Grafia: Acordo de
1990, como o roteiro pede para o que se escreve de novo. Sem travessões.*

## 0. O que o bloco entrega, e como se sabe que entregou

O `BRIEF-confianca.md` §6.8 tem nove testes; os testes **1** e **3** não passam
com desenho e são este bloco:

1. qualquer número → a linha impressa em **uma** ligação, sem descarregar mais de
   1 MB (o recorte visível; a ligação profunda oferecida);
3. qualquer linha → a data da última leitura **e** a data da última reconferência
   independente, visíveis.

Mais o que o roteiro lista: a origem «calculado sobre um ficheiro alojado» fecha
(o marcador sai dessas linhas), as linhas de API mostram a página humana da série
primeiro, o livro-razão descarrega-se como conjunto de dados com licença dita, o
`lastmod` do mapa do sítio vem de um modelo real ou não vem, o extrator de
excertos do motor deixa de cortar a meio de um número.

**As regras que valem em todo o bloco** (`PLANO-fases.md`, «rules»): nenhum
portão novo, só extensões de conferências que existem; toda a conferência nova ou
mudada é provada num estrago plantado antes de contar; estado renderizado e nunca
escrito; nada de inventado, `[a verificar]` para o que não se sabe; sem
travessões; nada público sem leitura cruzada canariada, pré-visualização, palavra
da direção, fusão e `verify:deploy`. O que atravessa a fronteira motor→sítio é
conteúdo estruturado, linhas, **recursos** e um manifesto; nunca saída
renderizada (`ledger/README.md`, «Linhas cruzadas»).

**Ramos.** Sítio: `confianca`, criado de `main` (`fc8f032`). Motor: `master`
(local; nunca se empurra; nunca se põe em palco `.gitignore`,
`.maintenance-locks/`, `content/05 Fund Access Register/`, `indicators/coverage/`,
que é de outra sessão a correr em paralelo). No motor, `git add` só com caminhos
explícitos e `git commit` logo a seguir: a área de palco é partilhada.

## 1. Os estádios, por ordem, e quem os faz

| Estádio | O que fecha | Quem |
| --- | --- | --- |
| **T1** | `document.page` e `verifications[]` no formato, no validador, no exportador, no portão e na página; as entradas da releitura cega de 2026-08-15 escritas nas linhas de Évora a partir do registo do motor; a reconferência semanal do painel a escrever entradas nas 32 linhas de base; a página a mostrar as duas últimas | Opus |
| **T2** | `document.crop`: os recortes atravessam por `publisher/` como recursos + manifesto; o motor produz os que faltam sob `core/pdfproof.py`; a página mostra o recorte em «Onde no documento» com «Abrir na página N»; o portão confere o resumo do recorte e a página | Opus |
| **T3** | a origem «calculado sobre um ficheiro alojado» (PRR e CAOP: licença lida primeiro por um agente cego; ficheiros alojados com resumo; a soma com a aritmética à vista; o marcador sai); a reextração do PRR contra o instantâneo de hoje sob os portões do motor (atualizações tipadas se os valores mexerem); as linhas de API com a página humana da série primeiro (endereços conferidos às cegas); o extrator de largura fixa do motor corrigido (três linhas conhecidas) | Sonnet (leituras cegas) + Opus |
| **T4** | o livro-razão descarregável (CSV e JSON) com a licença dita e JSON por linha (a licença é decisão da direção: até ela existir a secção diz o seu estado e não publica nenhuma); `lastmod` de um modelo real de alteração por página ou nenhum; dentro do portão: a comparação `data-claim` sobre o texto renderizado (sinal, vírgula) e a conferência das citações da constituição como extensão da amarra; registos: `DECISIONS.md` §1.47 fechado, §4 atualizado item a item, `PLANO-fases.md`, `NEXT.md` do motor, `ledger/README.md`, `IDENTIDADE.md` §12 | Opus |
| **Leitura cruzada** | Codex, sem contexto, com estragos plantados: um recorte que não é da página da sua linha, uma verificação com data futura, um valor sem selo, um travessão, uma variante do marcador | Codex |
| Depois | push → pré-visualização Vercel → palavra da direção → fusão → `verify:deploy` → pacote de desenho + DesignSync se algo visual mudou → vault §Tenth block | seat |

Cada estádio termina com: build verde (`npm run build`, `npm run typecheck`,
`npm run ledger:check`, `node scripts/ortografia.mjs --verificar`,
`npm run check:cruzamento -- --with-origin`, e no motor `python3 -m core.gate`
ou o que o repositório correr no pre-commit), a lista dos estragos plantados com
a frase que o portão disse a cada um, os commits nos dois ramos, e a secção do
estádio acrescentada à entrada §1.47 do `DECISIONS.md` (uma entrada para o bloco,
com `Afecta:` e `Texto:`; T1 cria-a, os seguintes acrescentam-lhe). O relatório
final de cada agente traz os tokens que gastou.

## 2. As decisões de formato (tomadas aqui, para não serem improvisadas)

### 2.1 `document.page` (T1)

Inteiro, ≥ 1, opcional, dentro de `document`. **É a página do documento onde
está a frase que o `excerpt` transcreve.** Passa a ser a única origem da página:
o fragmento `#page=N` do `source_url` deriva dela e não do localizador.

O `ledger:check` impõe:

- se `source_url` acaba em `#page=N`, então `document.page` existe e é N;
- se `document.page` existe e o endereço (sem fragmento) acaba em `.pdf` (sem
  distinguir maiúsculas), então `source_url` traz `#page=<document.page>`;
- se `document.locator` existe e traz um padrão `p. N`, então N é
  `document.page`;
- `document.page` numa linha derivada ou da casa é recusado (não têm documento).

A página da linha escreve «Abrir na página N» a partir de `document.page`, com
`data-linha-campo="document.page"`; a conferência `source_url.page` do portão
fica como está (é a leitura do endereço, com a cópia local da regra), e as duas
passam a bater por construção porque o validador as obriga a bater.

No motor: o manifesto declara `page` por linha (as 23 linhas de PDF ganham-no por
um passo único que lê o que `pin_page()` dá hoje e o escreve no manifesto, e a
partir daí `pin_page()` lê `page` e não o localizador). Um `page` declarado é
provado como o localizador é (V7): os seus algarismos existem no texto da linha
do motor ou no `locator_from`. Um localizador com `p. N` e sem `page` declarado é
recusado com «declare-o»: a página não se lê de duas maneiras.

### 2.2 `verifications[]` (T1)

Lista opcional, no fim da linha, a seguir a `corrections`. Cada entrada:

```yaml
verifications:
  - date: "2026-08-15"                 # AAAA-MM-DD, o dia da reconferência
    path: "https://www.ine.pt/…"        # o endereço que foi lido nesse dia
    result: "igual"                     # igual | diverge | inacessivel
    by: "leitura-independente"          # leitura-independente | painel-semanal | revisao-cruzada
    # found: "12,3"                     # só quando result é diverge: o valor como a fonte o imprimiu
```

O `ledger:check` impõe:

- `date` no formato, não anterior a `access_date` quando os dois são datas, e
  **não posterior ao dia da construção** (UTC): uma reconferência no futuro é um
  estrago, e é um dos plantados da leitura cruzada;
- `path` começa por `http://` ou `https://`;
- `result` num dos três valores; `found` obrigatório e com algarismo quando
  `diverge`, proibido nos outros dois;
- `by` num dos três valores;
- a lista está por ordem cronológica crescente; sem entradas iguais
  (`date`, `path`, `by`, `result`);
- recusado numa linha sem `source_url` (derivada ou da casa): não há o que
  reler; a derivada é reconferida pelo `check`, a da casa conta-se a si própria.

**A página** («Verificações», IDENTIDADE §11): «Lido a <access_date>», como hoje,
e a seguir as **duas** entradas mais recentes, da mais nova para a mais velha,
cada uma «Reconferido a <date> · <rótulo de by> · <rótulo de result>» com a porta
para o `path` («Repetir a leitura →» ou o que as cadeias fixarem). Os rótulos
vivem em `src/i18n/strings.mjs`, nas duas edições: `by` → «leitura
independente» / «independent reading», «reconferência semanal do painel» /
«weekly panel re-check», «revisão cruzada» / «cross-family review»; `result` →
«o mesmo valor» / «the same value», «valor diferente: <found>» / «a different
value: <found>», «fonte inacessível nesse dia» / «source unreachable that day».
Cada entrada leva `data-linha-verificacao="<índice na lista da linha>"` com
`data-por` e `data-resultado` crus, e cada campo escrito leva
`data-linha-campo="verifications.<índice>.date"` (e `.found` quando existe). Sem
nenhuma entrada, fica o que hoje há: o marcador com o motivo e a porta para a
regra da releitura no Método. Nada de caixa, nada de espécime (§6).

**O portão** (extensão da conferência dos campos da linha, `campoDaLinha` em
`scripts/gate-html.mjs`): resolve `verifications.<n>.<campo>` contra a linha;
os rótulos comparam-se com a **cópia própria** do portão da tabela de rótulos
(como as três formas da transição da agenda, §1.45), e nunca com a cadeia do
gabarito; os atributos crus comparam-se com a linha; o conjunto renderizado tem
de ser exatamente as min(2, n) entradas mais recentes, nem uma a mais, nem a
mais velha no lugar da mais nova.

**`prova.mjs`**: `releituras_registadas` passa a contar entradas a sério e a sua
descrição deixa de dizer que o campo não existe; entra `linhas_reconferidas`
(linhas com pelo menos uma entrada) e `releituras_divergentes` (entradas
`diverge`), com porta para o livro-razão. Nenhum texto governado se toca em T1:
se a prova de uma regra do Método precisar de outra chave, fica escrito no
relatório para o T4 e não se mexe em `metodo.mjs`.

**De onde vêm as entradas, e é a única maneira de entrarem:**

- **Linhas cruzadas (as 70 de Évora): só pelo exportador**, a partir de um registo
  do motor. O registo da releitura cega de 2026-08-15 já existe:
  `ResearchHub/publisher/verificacoes/2026-08-15-releitura-cega-evora/`
  (`RELATORIO.md` verbatim, `registo.json` transcrito por programa, `conferir.py`
  provado com dois estragos; 25 linhas de tabela, 28 valores impressos, 25
  endereços completos resolvidos da transcrição). Um mapa,
  `publisher/verificacoes/mapa.evora.json`, declara por linha do sítio a
  referência da tabela e o índice do valor: `{"site_id": "…", "registo":
  "2026-08-15-releitura-cega-evora", "ref": "5.24", "valor": 0}`. **O mapa não
  carrega valores.** O exportador: (a) corre a conferência do próprio registo e
  recusa se ela falhar; (b) recusa uma referência ou índice que não exista;
  (c) exige que o `organism` da tabela seja consistente com o `source` da linha
  (um nome não trivial do `source` aparece no `organism`), e que o `period`
  contenha o ano de `reference_date`; (d) exige `url_completo` não nulo, que
  passa a `path`; (e) compara em forma canónica o valor impresso (sem `%`) com o
  valor exportado: igual → `result: igual`; diferente → `result: diverge` com
  `found` = o valor impresso, **e não recusa**: uma divergência é um facto a
  publicar, e o exportador imprime-a em voz alta na corrida; (f) recusa duas
  entradas da mesma linha a partir do mesmo registo; (g) imprime no relatório da
  corrida os valores do registo que **não** foram mapeados («lidos e não
  publicados: n», com as referências), para que nada saia em silêncio. `date` é
  `evento.data` do registo; `by` é `leitura-independente` quando `evento.tipo` é
  `releitura-cega`. Espera-se cerca de 21 linhas com entrada; a contagem certa é
  a que o exportador der. `render_claim()` escreve o bloco à mão, determinista
  (V8), e o registo da travessia ganha `verifications_at_export` por linha.
- **As 32 linhas de base (`quadro-institucional`): pelo `indicators/refresh.py`**,
  no fim de cada corrida: por linha lida, uma entrada com `date` = o dia da
  corrida (UTC), `path` = o `source_url` pedido, `result` = `igual` se a canária
  do valor passou, `diverge` com `found` (o valor como a fonte o devolveu) se
  mexeu, `inacessivel` se a canária de existência falhou; `by` =
  `painel-semanal`. Escreve **só** o bloco `verifications`, sem tocar num byte do
  resto do ficheiro; não escreve duas vezes a mesma (`date`, `path`, `by`); tal
  como o `verificacao.mjs`, fica por confirmar em disco e é revisto e cometido
  no ciclo do item permanente (o mesmo diff de segunda-feira). O construtor corre
  o `refresh.py` uma vez no fim de T1 para que as 32 linhas fiquem com a entrada
  de hoje, a sério; não se retro-preenche a corrida de 2026-08-17.

### 2.3 `document.crop` (T2)

Mapa opcional dentro de `document`: `{asset, sha256, page}`. `asset` é
`recortes/<id>.webp` e mais nada (um recorte por linha, com o nome da linha; o
ficheiro vive em `public/recortes/`); `sha256` são 64 hexadecimais e é o resumo
dos bytes do ficheiro em disco (o validador lê o ficheiro e recusa se não existir
ou se o resumo não bater); `page` é inteiro e é **igual** a `document.page` (o
recorte é da página do excerto; um recorte de outra página é o estrago que a
leitura cruzada vai receber plantado); o ficheiro tem no máximo 40 000 bytes
(o mesmo teto que `core/pdfproof.py` impõe ao produzir: um recorte é uma linha
impressa e não uma página digitalizada, e o teto do sítio impede que entre por
outra porta o que o motor recusaria). Só existe onde `document.page` existe.

A página mostra o recorte em «Onde no documento»: `<figure>` com a imagem
(`alt` a dizer o que é: «Recorte da linha impressa, página N de <document.title>»,
composto só de campos que existem), a legenda com «página N» marcada
`data-linha-campo="document.crop.page"` e a porta «Abrir na página N →» para o
`#page=`. O portão: o `src` é `/recortes/<id>.webp`, o ficheiro está no `dist/`
com o resumo da linha, a legenda bate. Onde não há recorte, não há caixa: o
excerto transcrito faz o que faz hoje.

No motor: `publisher/recortes/` com o manifesto dos recortes (que linha do sítio,
de que estudo e id do motor veio, o ficheiro fixado e a sua página, o resumo do
recorte); os recortes existentes (168 nos três `snippets.json`) mapeiam-se por
identidade da linha do motor, e os que faltam para linhas de PDF com página e
frase produzem-se por `core/pdfproof.py` sob as suas regras (só correspondência
exata; recusa dita). O exportador escreve os ficheiros em `public/recortes/`,
calcula o resumo dos bytes que escreveu e escreve `document.crop`; recusa um
recorte cuja página registada não seja `document.page`. Nada de base64 dentro de
HTML: ficheiros.

### 2.4 A origem «calculado sobre um ficheiro alojado» (T3)

Sete linhas (`evora-prr-*` três somas, `municipios-total`/CAOP quatro contagens,
ver §4.1) publicam `excerpt: "[a verificar]"` porque não há frase para
transcrever. Fecha-se com o ficheiro de dados fixado **alojado neste sítio**, com
o seu resumo, e a soma mostrada com a aritmética (que linhas, que coluna). Antes
de alojar, **a licença de cada fonte lida na página da fonte por um agente que
não escreve o bloco** (dados.gov.pt e o portal do PRR para a listagem; a DGT para
a CAOP), com o endereço, a data e a frase da licença transcrita: se a licença
não permitir, a linha fica como está e diz-se porquê. Formato: `document.kind:
"ficheiro"` já existe; entra `document.hosted` = `{asset: "dados/<nome>",
sha256, bytes, licence, licence_url}` (nomes a fixar pelo construtor de T3 e a
registar aqui antes de escrever). O marcador sai dessas linhas quando o
`excerpt` passar a ser o **nome da coluna e a linha do ficheiro** ou continuar
`[a verificar]` se nem isso houver: nunca uma frase inventada. A reextração do
PRR corre no motor (`content/04 …/Technical Source/fetch_prr.py`) contra o
instantâneo de hoje, sob os portões do motor; se os valores mudarem, entram como
`atualizacao` tipada pelo manifesto (`__valor__`), nunca à mão.

**O que a leitura cega das licenças encontrou (agente Sonnet, 2026-08-18, 13:05 a
13:27 UTC, sem acesso aos repositórios; 196 237 tokens; o relatório inteiro está
na transcrição da sessão e o essencial fica aqui, verbatim onde é citação):**

- **PRR (dados.gov.pt).** O recurso `896a8911-c542-4e9c-941c-874a377dc5b3` que as
  cinco linhas do PRR citam desde 15.08.2026 devolve hoje **404** na própria API
  («Resource not found», 13:06 UTC): o endereço «permanente» era o recurso de um
  dia, e o conjunto que melhor lhe corresponde, «Dataset Estrutura de Missão PRR -
  Entidades» (`https://dados.gov.pt/datasets/dataset-estrutura-de-missao-prr-entidades-1`,
  organização «Estrutura de Missão Recuperar Portugal», `frequency: daily`),
  regenera o seu único recurso todos os dias com nome datado
  (`listagem-de-entidades-prr-20260817.xlsx` a 17.08) e id novo. A licença
  declarada nesse conjunto é **`notspecified` («Licença não especificada»)**. Os
  termos da plataforma (`https://dados.gov.pt/pt/termos-de-utilizacao`) dizem,
  palavra por palavra: «Todos os dados carregados por organismos do estado são
  publicados ao abrigo de uma licença Creative Commons CC BY 4.0, exceto se
  houver uma especificação em contrário.» e «Os recursos relativos a conjuntos de
  dados estão abrangidos pela licença que se aplica ao conjunto em que estão
  inseridos.» A página de termos do portal Recuperar Portugal
  (`https://recuperarportugal.gov.pt/termos-e-condicoes/`) diz que «Todos os
  conteúdos […] são propriedade da Recuperar Portugal» e não tem termos de
  reutilização. **Decisão do lugar de direção para T3:** a licença do PRR não está
  verificada (um campo «não especificada» ao lado de uma omissão «CC BY 4.0» da
  plataforma é uma questão jurídica, e é da direção, com o `legal/counsel-brief.md`);
  por isso **o instantâneo do PRR não se aloja neste bloco**. O que T3 faz no PRR:
  (a) a morte do endereço é um acontecimento e regista-se como tal, com uma
  `proveniencia` sobre `source_url` do endereço morto para **a página do
  conjunto**, que é o endereço estável, e a razão escrita; (b) a reextração corre
  no motor contra o instantâneo de hoje, e os valores que mexerem entram como
  `atualizacao` tipada; (c) as linhas de soma passam a dizer sobre que ficheiros
  foram calculadas (nome do ficheiro tal como o publicador o nomeia, data do
  instantâneo, sha256 de cada ficheiro, o filtro e a coluna somada) num campo
  `document.computed_over` (lista de `{file, snapshot_date, sha256, bytes}` mais
  `filter` e `column`), sem alojar nada; o excerto continua `[a verificar]` nas
  três somas, porque não há frase nem linha única para transcrever, e a página
  di-lo; (d) fica escrito na §4.1 que o alojamento espera a decisão da direção
  sobre a licença.
- **CAOP (DGT).** Licença **verificada duas vezes**: o campo do conjunto em
  dados.gov.pt (`"license": "cc-by"`, «Creative Commons Attribution 4.0 - CC BY
  4.0», organização «Direção-Geral do Território», nos três conjuntos Continente,
  RAA e RAM) e a página «Dados abertos» da DGT
  (`https://www.dgterritorio.gov.pt/dados-abertos`): «A informação geográfica
  descarregada do Centro de Dados está sujeita a uma licença de utilização CC-BY
  4.0, que permite a utilização livre e gratuita dos dados tendo apenas como
  obrigação a menção de que a entidade proprietária da informação é a
  Direção-Geral do Território.» Sem cláusula de partilha nas mesmas condições nem
  de uso não comercial em nenhuma das páginas lidas. O ficheiro do Continente tem
  111 647 845 bytes (`Last-Modified: 02 Feb 2026`): **não se aloja o zip inteiro**;
  aloja-se o **extrato** de que a contagem é feita (a lista das entidades
  contadas, uma linha por município, com o código e o nome, tirada do GeoPackage
  pela mesma leitura que produziu a contagem), com o sha256 do zip inteiro de
  onde saiu, e a atribuição na forma que a DGT pede. A contagem passa a ser
  `check:dados` sobre o extrato alojado; o marcador sai das quatro linhas da CAOP.
- **IEFP.** Nenhuma página de termos de utilização, aviso legal ou licença
  encontrada em iefp.pt (página de estatísticas, página inicial, RGPD; sete
  caminhos plausíveis dão 404). Não se aloja nada do IEFP; as duas linhas
  `kind: ficheiro` do IEFP ficam como estão.

O campo `document.hosted` da versão anterior desta secção passa a chamar-se
**`document.hosted`** só para o que se aloja de facto (CAOP): `{asset:
"dados/<nome>.csv", sha256, bytes, licence: "CC BY 4.0", licence_url,
attribution, extracted_from: [{file, sha256, bytes, url}]}`; e
**`document.computed_over`** para o que se calcula sobre um ficheiro que não se
aloja (PRR). Os dois entram no validador com regras e estragos plantados como os
outros campos deste bloco; o exportador é quem os escreve nas linhas cruzadas.

### 2.5 As linhas de API (T3)

57 linhas `document.kind: "serie"`. A página passa a mostrar, por esta ordem: a
**página humana da série** (a página do indicador no INE, o data browser do
Eurostat) como porta principal, o **pedido exato** (o `source_url` de hoje) a
seguir, e o **campo devolvido** rotulado como tal (já é). A página humana é um
campo novo, `document.url` (o endereço legível por pessoas do mesmo indicador),
preenchido só depois de conferido às cegas por um agente que abre cada endereço
e confirma que a página nomeia o mesmo indicador (código e nome); um endereço
não confirmado fica ausente, e a página não o inventa. Sem heurística de URL,
que já saiu (§1.36).

### 2.6 O conjunto de dados (T4)

`/livro-razao.csv` e `/livro-razao.json` gerados na construção a partir das
linhas (`note` fora, como sempre), e `/livro-razao/<id>.json` por linha, mais a
ligação na página do livro-razão e na página de linha («Esta linha em JSON»). A
**licença** é decisão da direção (recomendada CC BY 4.0, por ser a das fontes que
já se citam e a que permite a reutilização com atribuição). **Até a direção
decidir, nada se publica sob licença nenhuma**: a secção do conjunto de dados
constrói-se e a licença lê-se de uma constante `LICENCA` em `src/data/`, a
`null` por omissão; com `null`, os ficheiros não se ligam de nenhuma página e a
secção diz o estado («conjunto de dados preparado; a licença aguarda decisão da
direção»), que é um estado desenhado e não o marcador. Um só campo a mudar no
dia da decisão.

### 2.7 `lastmod` (T4)

Ou vem de um modelo real por página, ou não vem. O modelo: para cada rota, o
conjunto completo de entradas de que a página depende (a linha, as linhas que
cita, os gabaritos e componentes partilhados, as cadeias, os dados) e a data do
último commit que tocou em qualquer um deles, lida do git na construção. Se a
construção não tiver git (Vercel tem o commit mas pode não ter a história), o
campo não se escreve, e o mapa continua sem ele. Provado: mudar um componente
partilhado tem de mudar o `lastmod` de todas as páginas que o usam.

### 2.8 Dentro do portão (T4)

Duas extensões, nenhum portão novo:

- a comparação de um `data-claim` passa a comparar o **texto renderizado** com o
  `value` da linha (sinal menos, vírgula decimal, espaço fino dos milhares), e
  não só os algarismos; o que é composição (o sufixo, a escala `--figura-car`, o
  espaço da moldura) fica fora do elemento `data-claim`, que é onde já está.
  Plantas: o menos apagado na posição de investimento na primeira página tem de
  fechar; «96%» dentro do elemento onde a linha diz «96» tem de fechar;
- a amarra das decisões aprende a conferir que cada frase citada entre aspas
  latinas «…» na `IDENTIDADE.md` com uma referência a um texto governado existe
  nesse ficheiro tal e qual (extensão de `scripts/check-ledger.mjs`, secção da
  amarra); planta: uma palavra trocada na citação da §5 fecha.

## 3. O que Nuno ainda decide, e o bloco não decide por ele

A licença do conjunto de dados; a ortografia (o silêncio mantém o Acordo); as
decisões de desenho revogáveis da §4.1 (as fronteiras `--rule-strong`, a caixa
`.placeholder`). Nenhuma delas trava o bloco.
