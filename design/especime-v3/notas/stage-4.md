# Nota da etapa 4 · a família da leitura

*Construtor D (Claude Opus, `claude-opus-5[1m]`). Ramo `redesenho-v3`, a partir de
`193952e`. Brief: `../briefs/BRIEF-etapa-4.md`, com as quatro decisões da direção
de 21.08.2026, tarde, na sua §2b. Escrita a cada checkpoint, antes da auditoria,
para que um corte de sessão custe uma subetapa. Sem travessões, por escolha deste
documento.*

## 0. Os commits

| commit | subetapa | o quê |
|---|---|---|
| `6b7dab8` | 4-0 | as quatro decisões da direção de 21.08, tarde: a legenda do selo, as frases de Évora, o localizador e o aparelho da convergência |
| (abaixo) | 4a | Correções: o selo da linha como porta de cada entrada, a extensão do portão provada em duas plantas, e a forma riscada em todas as entradas |
| (abaixo) | 4b | Método: as duas frases governadas entram com o sim do diretor de 21.08, tarde, e a linha de prova da cor sai; a porta fica |

---

## 1. Commit 4-0 · as quatro decisões da direção, antes de qualquer subetapa

`6b7dab8`. Nenhum texto governado mexe: nem `src/data/sobre.mjs` nem
`src/data/metodo.mjs`. `DECISIONS.md` §1.54.

### 1.1 · A legenda do selo passa a nomear os dois estados

Item **AB** da §4 (leitura cruzada de 20.08, achado 7: «o selo cheio não diz as
exceções que são de origem»). A legenda dizia o que o glifo é; passa a dizer o
que o estado é:

| | antes | depois |
|---|---|---|
| pt | Quadrado cheio: a proveniência está completa. · Quadrado a tracejado: falta pelo menos um campo, e a linha di-lo. | **proveniência completa** · **um campo por confirmar** |
| en | Filled square: the provenance is complete. · Dashed square: at least one field is missing, and the row says so. | **provenance complete** · **one field unconfirmed** |

Os dois quadrados continuam desenhados ao lado, um em cada item da lista
(`.src-chip-amostra`, cheio e tracejado): a decisão escreve a legenda numa linha
(«■ proveniência completa · □ um campo por confirmar») e a construção mantém os
dois itens, porque com os quadrados `aria-hidden` uma linha só faria um leitor de
ecrã ouvir dois nomes sem saber a qual glifo pertence cada um.

**As duas notas de grupo do índice saíram**, e eram as duas únicas frases de
autorreferência que a régua contava nesta rota: «Todos os campos preenchidos e
conferidos contra a fonte. O selo é um quadrado cheio.» e «Falta pelo menos um
campo de proveniência. O campo fica marcado, e nenhum foi preenchido com um valor
plausível. O selo é um quadrado a tracejado.»

**Medido**, `node scripts/medir-defeitos.mjs`:

| rota | antes | depois |
|---|---|---|
| `/livro-razao` | 16 distintas · conteúdo 12 · navegação 2 · **autorreferência 2** | 14 distintas · conteúdo 12 · navegação 2 · **autorreferência 0** ✓ |
| `/en/ledger` | 16 distintas · conteúdo 12 · navegação 2 · **autorreferência 2** | 14 distintas · conteúdo 12 · navegação 2 · **autorreferência 0** ✓ |

### 1.2 · Évora deixa de se explicar

Itens **Q** («as contagens em palavras da página do município») e **T** («a
página do município promete "Não interpreta" e escreve frases que interpretam»)
da §4. Saíram, nas duas edições:

1. a abertura, `municipio.ledeA` + `ledeB` («Esta página mede o município de
   Évora e mostra de onde vem cada medida. Não interpreta: …»);
2. as contagens por extenso do Relance, `municipio.relanceSub` («Oito medidas.
   Seis vêm de organismos…»);
3. os dois parágrafos por baixo de «Quem responde pelo quê», `municipio.tempoBreve`
   e `municipio.tempoAtribuicaoV`;
4. a sub-linha da Leitura breve, `municipio.breveSub` («Uma frase por medida.
   Todos os números são citações do livro-razão.»);
5. a nota dos trabalhos, `municipio.estudosV`;
6. a segunda frase da descrição do `<head>`, `municipio.metaDescricaoB` («Cada
   valor tem linha no livro-razão, com fonte, documento e data de acesso.»).

Os itens 1 a 3 são os que a decisão nomeia. Os 4 a 6 são a mesma classe e o mesmo
gesto — a segunda metade do 4 é o trabalho do selo dito outra vez em prosa; o 5
descreve as páginas do sítio antes de as dar; o 6 tem o precedente exacto do
commit 3-0, quando a descrição da primeira página foi encurtada pela mesma razão.
Vão listados um a um em `RELOCACOES.md`, «Texto novo · Etapa 4, commit 4-0».

**«Quem responde pelo quê» fica só como nome da secção, por cima da banda dos
mandatos**, e isto é uma leitura, escrita aqui em vez de improvisada. A frase
vivia como `deep-k` de uma entrada da camada de fundo, com dois parágrafos por
baixo. Retirados os parágrafos, restava um rótulo sem corpo, que a
`IDENTIDADE.md` §7 chama um estado não desenhado. Das três leituras possíveis da
frase da decisão — deixar o rótulo vazio; pô-la como `h2` da secção `#tempo`, que
já se chama «Quem administrou, e o que as contas registaram»; ou pô-la como nome
da banda — escolhi a terceira: a entrada da camada de fundo sai inteira, e a
banda dos mandatos passa a ter «Quem responde pelo quê» por cima, no lugar onde
estava «Mandatos, no tempo», que continua a nomear o desenho no `aria-label` do
SVG. Se a cadeira quiser outra das três, é uma linha.

**A relocação R6 fecha a 1 → 0.** A frase de abertura tinha sido duplicada para a
primeira página na etapa 2 (duplicação autorizada), saiu de lá na 2m com a Emenda
15, e sai daqui agora. Não é uma relocação que falhou: é uma cuja origem e cujo
destino foram os dois revogados pela mesma emenda, e o registo di-lo em vez de a
apagar. Medido: `grep -c 'Esta página mede' dist/municipios/evora/index.html` →
**0**, o mesmo com «This page measures» na edição inglesa.

### 1.3 · A contagem de Évora não fecha a zero, e isso fica escrito

**Este é o único ponto do commit 4-0 em que a construção não cumpre o que o brief
escreve, e é uma chamada de conteúdo que não é minha.** O brief diz «o inventário
adiciona `/municipios/evora` e lê 0». A rota entrou; a leitura é:

```
frases da casa · /municipios/evora ..... 63 distinta(s) · conteúdo 82 · navegação 6 · autorreferência 3  ✗
frases da casa · /en/municipalities/evora  64 distinta(s) · conteúdo 83 · navegação 6 · autorreferência 3  ✗
```

Os três blocos, por edição, e onde vivem:

| bloco | onde |
|---|---|
| «Nenhuma decisão deste mandato atravessou para o livro-razão com valor próprio. Um campo em branco seria diferente disto: o que falta é a linha, não a decisão.» | `decidiuNota` de um mandato, `src/data/municipios.mjs` |
| «As decisões desta página vão atribuídas a quem as tomou, com o rótulo da lista que ganhou. Os índices … não vão atribuídos a ninguém: nada do que foi lido fornece o contrafactual que recortaria a parte de um executivo neles.» | entrada de `metodo`, «Um partido é dono das suas decisões, não de uma curva» |
| «Não existe contrafactual para nenhum índice. Nada do que foi lido permite separar a parte de um executivo neles.» | entrada de `naoSabe` |

**Porque não os cortei.** Os três são conteúdo editorial da etapa 3
(`DECISIONS.md` §1.40 e §4 item T), nenhum deles está entre os itens que a
decisão de 21.08 nomeia, e cortá-los é redação e não forma. O primeiro é um
estado vazio desenhado, e a Emenda 15 manda dizer a ausência em duas palavras — mas
as duas palavras que a página já tem para isso («Fora do que foi lido.») querem
dizer outra coisa, e inventar uma terceira formulação seria abrir a segunda
língua que a `IDENTIDADE.md` §6 fecha. Os outros dois são a ressalva que impede a
página de ser lida como uma tabela classificativa de partidos, que é a razão de
existirem. Ficam com a sua classe escrita no inventário e com o pedido em
`ISSUES.md` **I52**. A régua imprime, não falha: a dívida fica à vista em vez de
arredondada.

### 1.4 · O localizador de Évora

Achado **13** da quarta leitura cruzada do Codex. Duas coisas, e a segunda é a que
custa mais a ver:

1. `aria-describedby="mapa-descricao"` era escrito sempre no SVG do mapa, e o
   bloco que leva esse `id` só se constrói na postura «inteiro» (a primeira
   página). Na página do concelho, que rende o cartão localizador do servidor, a
   referência ficava pendurada. Passa a depender da mesma condição, e as duas
   leem-se a três linhas de distância uma da outra, que é o que impede que voltem
   a divergir. Medido: `grep -o 'aria-describedby="mapa-descricao"'` → **0** em
   `dist/municipios/evora/index.html`, **1** em `dist/index.html`;
2. o rótulo do desenho dizia «Mapa de pontos dos municípios de Portugal. **Use as
   setas para percorrer os municípios.**» As setas só percorrem alguma coisa onde
   `inicio.js` está carregado, e a página do concelho carrega `tema.js` e mais
   nada. A instrução sai do rótulo e continua escrita, uma vez só, em
   `tecladoHint`, que vive dentro de `#mapa-descricao` e por isso só se constrói
   onde é verdadeira.

### 1.5 · O aparelho da convergência sai mesmo da primeira página

Achado **7**: `RELOCACOES.md` dizia que o aparelho do Instrumento n.º 1 tinha
saído da primeira página e a construção ainda lá rendia a porta do CSV. Das duas
coisas, a direção mandou corrigir a construção.

A porta desce para `/livro-razao`, ao pé do bloco do conjunto de dados, com a
mesma cadeia (`home.dadosLink`, sem uma palavra mudada) e um rótulo novo que a
nomeia (`livro.convergenciaK`). A declaração de rota de `check-dados.mjs` desce no
mesmo commit: `PORTA_DOS_DADOS.convergencia`, de `home` para `livro`. Relocação
**R13**.

**As duas plantas da conferência mudada**, porque uma declaração que ninguém
provou é um comentário:

1. a declaração volta a `home` com a porta já em `/livro-razao`:
   > ✗ a página "/" (edição "pt") não liga para "/dados/convergencia.csv". Os dados por trás de cada instrumento são descarregáveis nas duas edições, ou não são.
   >
   > ✗ a página "/en" (edição "en") não liga para "/dados/convergencia.csv". […]

   Revertida;
2. a porta sai de `/livro-razao` com a declaração já em `livro`:
   > ✗ a página "/livro-razao" (edição "pt") não liga para "/dados/convergencia.csv". […]
   >
   > ✗ a página "/en/ledger" (edição "en") não liga para "/dados/convergencia.csv". […]

   Revertida.

**A frase que diz o que o índice compara fica** na primeira página. Não é
aparelho: nomeia o que a régua desenha, e sem ela a régua é uma barra sem
grandeza. Está classificada como conteúdo no inventário desde a etapa 2l. A frase
de seleção («Selecione regiões para as pôr na mesma régua.») é a instrução do
instrumento e fica como navegação, também já classificada.

**Medido**: `grep -o 'dados/convergencia.csv' dist/index.html | wc -l` → **0**
(era 1), o mesmo em `dist/en/index.html`; `dist/livro-razao/index.html` → **1**,
`dist/en/ledger/index.html` → **1**.

---

## 2. Subetapa 4a · Correções

A decisão **(c)** da direção, de 20.08.2026: «Sim. Conferência campo a campo mais
o selo da linha como porta.» `DECISIONS.md` §1.55.

### 2.1 · A porta é o selo, e o id deixa de ser ligação

Cada entrada do registo leva agora um `.src-chip` para a sua própria linha, ao pé
do par de valores: **3** correções, **12** atualizações e **9** linhas na lista
das revisões de proveniência, **24** entradas por edição.

Cada uma levava já uma porta — o `<code>` do id embrulhado num `<a>` — e ela sai.
Duas portas para a mesma linha na mesma entrada não são duas portas: são a mesma
dita duas vezes, e a segunda tira sinal à primeira. O selo é a porta desta casa
(`IDENTIDADE.md` §5); o id fica como identificador transcrito, e continua
conferido pelo portão contra a própria afirmação.

`IDENTIDADE.md` §5 ganha o **ponto 6**, que é a frase que o brief pede: no registo
de correções a porta é o selo da LINHA e não o selo de um valor, porque os dois
números de uma entrada não são duas medições com duas linhas, são dois estados do
mesmo valor. Não cita texto governado e por isso não leva marca.

### 2.2 · A extensão do portão, e as duas plantas

`scripts/gate-html.mjs`, dentro do bloco que já conferia `data-correcao-*`.
Nenhum portão novo: a mesma conferência, o mesmo laço, a mesma família de marcas,
pela moratória de 2026-08-15.

- cada entrada declara-se com `data-correcao-entrada="<id da linha>"`;
- cada campo `data-correcao-*` tem de viver dentro de uma entrada declarada, e da
  entrada da sua própria linha. Sem esta metade, a marca seria opcional e a
  conferência da porta não conferia nada: bastava não a pôr;
- a entrada tem de conter uma âncora `.src-chip` cujo `href` seja o caminho da sua
  linha, numa das duas edições;
- **fora das páginas do livro-razão**, e pela mesma razão de `auditaSelo()`: na
  página de uma linha, a história daquela linha é a linha, e um selo ali seria uma
  porta para a divisão onde já se está. A decisão (c) é sobre o REGISTO, que é a
  página que junta histórias de linhas diferentes e onde a porta é a única maneira
  de saber de qual.

**Planta 1 · uma entrada sem porta** (a chamada do selo sai do grupo das
correções):

```
✗ a entrada do registo de correções da linha "pib-pc-alentejo-2000" não tem o selo dessa linha por porta.
      esperava-se <a class="src-chip" href="/livro-razao/pib-pc-alentejo-2000"> dentro da própria entrada, ao pé do par de valores.
      A entrada não tem selo nenhum.
      É a decisão (c) da direção, de 20.08.2026: a comparação campo a campo fica, e a entrada ganha a porta.
```

Três entradas fechadas por edição, seis erros no total. **Revertida.**

**Planta 2 · a porta abre outra linha** (o selo passa a apontar
`divida-publica-2025`):

```
✗ a entrada do registo de correções da linha "pib-pc-alentejo-2000" não tem o selo dessa linha por porta.
      esperava-se <a class="src-chip" href="/livro-razao/pib-pc-alentejo-2000"> dentro da própria entrada, ao pé do par de valores.
      A entrada tem selo, e ele abre a linha "divida-publica-2025". Uma porta que abre outra linha não é a porta desta entrada: quem clica quer a história DESTE valor.
      É a decisão (c) da direção, de 20.08.2026: a comparação campo a campo fica, e a entrada ganha a porta.
```

É o caso que nenhuma conferência anterior apanhava: a etiqueta desse selo está
**certa** — é a etiqueta da linha que ele abre — e a conferência de
`data-nonledger="proveniencia"` deixa-a passar. O que falha é a porta estar noutra
parede. **Revertida**, e o portão volta a fechar a zero (`exit 0`).

### 2.3 · A forma, que é a condição da decisão (g)

O valor antigo passa a ir num `<s>` — o elemento que diz «isto já não é exacto», e
não uma classe que risca — em `--g1`, com o novo em tinta ao lado, a data e a
natureza como hoje. Nenhuma cor: o `--oxblood` saiu de `tokens.css` na etapa 1c e
não é substituído por outro acento.

**Um risco não se ouve.** Cada valor leva um prefixo em `.vh` («valor anterior: »
/ «previous value: » e «valor novo: » / «new value: »), **fora** do elemento
marcado com `data-correcao-campo`, para que o portão continue a comparar só o
valor com o do livro-razão. São duas chaves e não uma, e a razão é medida: os
cabeçalhos de coluna do registo são um `<div>` de `<span>`s que não se associa a
célula nenhuma, e nas atualizações a seta entre os dois valores é `aria-hidden` —
sem o segundo prefixo, quem ouve uma entrada recebe dois números seguidos e
nenhuma maneira de saber onde acaba o primeiro. O brief pede o prefixo do valor
antigo; o do novo entra com ele, e vai declarado em `CHAVES-EN.md` como adição.

**Medido**, sobre a construção:

```
grep -o '<s data-correcao' dist/correcoes/index.html | wc -l          → 15
grep -o '<s data-correcao' dist/en/corrections/index.html | wc -l     → 15
grep -o 'data-correcao-entrada' dist/correcoes/index.html | wc -l     → 24
grep -o 'src-chip' dist/correcoes/index.html | wc -l                  → 53
```

15 é o número de entradas com par de valores (3 correções + 12 atualizações): **a
forma rende em todas**, que é a condição que a decisão (g) põe à frase «A cor».
24 é o total de entradas com porta declarada (15 + as 9 linhas com revisão de
proveniência).

### 2.4 · A folha da família da leitura

`src/styles/leitura.css` nasce aqui, importada pela vista e não pelo invólucro:
uma página que não é desta família não carrega uma linha dela. Leva o que a 4a
precisa e mais nada — o `<s>` e o seu risco, o lugar do selo na célula, e a lista
das revisões sem o id como ligação. As regras do registo que já viviam em
`site.css` ficam lá: `site.css` é a folha partilhada e é de outro construtor, e
esta folha estende-a em vez de a mudar.

### 2.5 · O inventário

`/correcoes` e `/en/corrections` entram e leem **0**:

```
frases da casa · /correcoes ......... 21 distinta(s) · conteúdo 18 · navegação 3 · autorreferência 0  ✓
frases da casa · /en/corrections .... 21 distinta(s) · conteúdo 18 · navegação 3 · autorreferência 0  ✓
```

**A classificação está escrita com a sua razão**, e a razão não é indulgência: a
política de correções é o CONTEÚDO desta página, tal como a linha do livro-razão é
o conteúdo do índice — e a régua já classificava assim a lede do índice («Uma
linha por número publicado. Cada linha guarda o valor…»). A Emenda 17 diz-no por
escrito: «a frase da política vive em `/correcoes`.» O que aqui seria
autorreferência é uma frase sobre outra coisa que o sítio faz (o selo, a
cobertura, a verificação de uma linha), e não existe nenhuma. As duas frases da
caixa de correções são navegação: dizem como se usa um comando.

---

## 3. Subetapa 4b · o Método, com o sim do diretor e um corte

**O diretor viu as frases renderizadas e disse que sim, a 21.08.2026 à tarde**,
com um corte: a linha de prova por baixo de «A cor» sai, e a porta fica. A
subetapa estava preparada e não commetida em `4b-pendente.patch`, à espera dessa
palavra; o remendo foi aplicado, cortado e commetido, e **o ficheiro do remendo
foi apagado no mesmo commit**, porque o seu conteúdo passou a ser o commit.

### 3.0 · O corte, e o que ele tira

Saem, nas duas edições: «A forma riscada está no registo de correções, entrada a
entrada, desde antes desta frase ser escrita.» e «The struck-through form is in
the corrections register, entry by entry, from before this sentence was
written.» **Fica a porta**, «O registo de correções →» / «The corrections
register →»: quem lê a afirmação abre o registo e vê a forma, e isso é conferir.
A linha era a prova dita em vez de dada.

Com a linha, o campo `nota` das entradas de fecho ficou sem uso, e **sai
também** — do módulo, da vista (`{e.nota && …}`) e da folha
(`.metodo-fecho-nota`). Um campo de dados sem conteúdo é aparelho à espera de
ser enchido, e a próxima pessoa que o encontrasse enchia-o.

**As quatro cadeias governadas não são tocadas pelo corte**, e continuam a bater
com o brief carácter a carácter: cada uma aparece **uma vez** em
`../briefs/BRIEF-etapa-4.md`, exactamente como está no módulo (conferido por
programa, contra o ficheiro do brief, depois do corte).

### 3.1 · O que o remendo leva

| ficheiro | o quê |
|---|---|
| `src/data/metodo.mjs` | `FECHO`: a entrada de fecho, com as duas linhas rotuladas nas duas edições, a nota da condição de «A cor» e a porta para o registo |
| `src/views/MetodoView.astro` | o sumário no cimo, as dez regras como dobras, e a entrada de fecho depois delas |
| `src/styles/leitura.css` | o sumário, as dobras (com a disposição A a sobreviver ao `<details>`) e a entrada de fecho |
| `src/i18n/strings.mjs` | `metodo.sumarioK`, uma chave nas duas edições |
| `DECISIONS.md` | a entrada §1.56, com `**Afecta:** metodo` e `**Texto:** metodo 3661476ee0c9` |
| `design/especime-v3/notas/stage-4.md` | esta secção |

Mais um, que o remendo não trazia: `tests/inicio/capturas.mjs`, com o modo
`--etapa-4` (adiante, §3.5).

**A linha da amarra**, recalculada depois do corte:

```
**Texto:** metodo 3661476ee0c9
```

É o resumo de `src/data/metodo.mjs` como este commit o deixa: os doze primeiros
hex do SHA-256 do ficheiro com as mudanças de linha normalizadas, calculado como
`resumoDoTexto()` em `scripts/check-ledger.mjs` o calcula. O do remendo era
`b97508921ef3`, e caducou com o corte — se o ficheiro for tocado outra vez, o
resumo muda e a amarra fecha o build, que é para isso que ela existe.

### 3.2 · As duas frases, tal como renderizam

Extraídas da construção, do bloco `#a-forma` das duas páginas, sem uma
transformação:

**`/metodo`**

> **A cor** — A cor aparece só onde a fonte publica um limiar: âmbar quando o
> valor está fora dele, cobalto quando está dentro. Tudo o resto é tinta e
> cinzento, e uma correção diz-se pela forma, com o valor antigo riscado e o novo
> ao lado, nunca por uma cor.
>
> O registo de correções →
>
> **A letra** — Os tipos deste sítio são Spectral, com a sua família de
> versaletes Spectral SC, e Bitter, de licença aberta (SIL Open Font License),
> alojados aqui e servidos por este sítio, sem anfitriões de terceiros.

**`/en/method`**

> **Colour** — Colour appears only where the source publishes a threshold: amber
> when the value is outside it, cobalt when it is within. Everything else is ink
> and grey, and a correction is said by form, with the old value struck through
> and the new one beside it, never by a colour.
>
> The corrections register →
>
> **The type** — This site's typefaces are Spectral, with its small-caps family
> Spectral SC, and Bitter, under an open licence (SIL Open Font License), hosted
> here and served by this site, with no third-party hosts.

**As quatro cadeias batem com o brief carácter a carácter**, conferido por
programa contra `../briefs/BRIEF-etapa-4.md`: cada uma aparece **uma vez** no
brief, exactamente como está no módulo.

### 3.3 · O apóstrofo reto, assinalado e não decidido

A edição inglesa de «A letra» escreve **This site's**, com o apóstrofo **reto**
(U+0027). É o carácter que o texto do diretor traz nas duas cópias que o
repositório guarda — o brief da etapa e a §12 do plano —, e o brief diz «não muda
um carácter». As outras cadeias inglesas desta casa usam o tipográfico (’):
«municipality’s», «executive’s», «publishers’». **Não o troquei**, e fica aqui em
vez de ser resolvido em silêncio: se a direção quiser o tipográfico, é a decisão
dela e um carácter no módulo, com um resumo novo na amarra.

### 3.4 · A página, à volta das duas frases

**O sumário**, no cimo, entre a lede e o instrumento: os dez nomes das regras e a
entrada de fecho, cada um a âncora da sua secção, em duas colunas acima de 640px.
As âncoras já existiam — o que faltava era a lista. `metodo.sumarioK` é a única
cadeia nova («Nesta página» / «On this page»), e nomeia o que a página tem.

**As dobras**: um `<details>` por regra, com o nome no `<summary>`, a primeira
aberta e as restantes fechadas, o mecanismo, o limite e a prova lá dentro, e os
contadores `data-prova` com as suas portas. **Sem uma linha de JavaScript.** Três
coisas que isto obrigou a resolver, e vão escritas:

1. **a disposição A sobrevive à dobra.** `.metodo-secao` era a grelha de duas
   colunas e os seus dois filhos eram a cabeça e o corpo; com o `<details>` pelo
   meio o filho passa a ser um só. A grelha desce para o `<details>`, com as
   mesmas medidas e o mesmo ponto de quebra;
2. **o nível de cabeçalho não desce.** O `<h2>` de cada regra passa para dentro
   do `<summary>`, que é conteúdo válido para uma só etiqueta de cabeçalho, e o
   sumário de cabeçalhos da página fica como estava;
3. **o marcador nativo sai** e o que o substitui é um sinal de tinta à direita do
   nome, `+` fechado e `−` aberto, com estado de foco visível. O triângulo do
   navegador tem o desenho de cada navegador.

**Uma limitação, dita:** uma âncora do sumário leva ao topo da secção da regra e
não abre a dobra — o `id` fica na `<section>`, que é o endereço público que já
existia, e o `<details>` está dentro dela. Quem chega vê o nome da regra e abre-a.
Mudar o `id` de sítio faria os navegadores que expandem uma dobra pelo fragmento
fazê-lo, e mudaria um endereço público (`#correcoes` é citado no Método e no
`DECISIONS.md` §1.29): não vale a troca sem a palavra da cadeira.

**A entrada de fecho não dobra.** São duas frases, e uma dobra por cima de uma
frase é mobília a esconder o que a página fecha a dizer.

### 3.5 · O que ficou verde, as capturas, e o modo que as tira

```
npm run build        exit 0
npm run verify       exit 0
npm run ledger:check exit 0   (19 entradas a partir da §1.38, 2 textos governados)
```

**`tests/inicio/capturas.mjs` ganha o modo `--etapa-4`**, e é um ficheiro fora da
lista da §2 do brief: vai escrito aqui em vez de ser improvisado. A alternativa
era um programa de rascunho fora do repositório, e então o comando que tirou as
capturas não existiria em lado nenhum. O precedente é o modo `--etapa-3`, posto
no mesmo ficheiro pela etapa anterior; o modo novo é declarativo (uma lista de
rotas) e não muda uma linha do que os outros modos fazem. Traz duas coisas que a
etapa 3 não precisava:

- **`recorte`**, o selector do que se fotografa. A entrada de fecho é o que a 4b
  entrega, e numa página inteira a 1280 ela tem dois dedos de altura. Se o
  selector não existir, a captura falha em vez de sair uma página inteira com o
  nome de um recorte;
- **`--so=<nome>`**, para refotografar só o que uma subetapa mexeu. Uma captura
  de uma página ainda por reconstruir mente até ao fecho da etapa.

O 404 é uma rota só, e não duas: `src/pages/` tem `404.astro` e a edição inglesa
não tem a sua.

```
node tests/inicio/capturas.mjs --etapa-4 --so=metodo-fecho     → 2 capturas
```

| captura | o quê |
|---|---|
| `../capturas/etapa-4/metodo-fecho-1280-pt-claro.png` | a entrada de fecho, `/metodo`, 1280, **refeita depois do corte** |
| `../capturas/etapa-4/metodo-fecho-1280-en-claro.png` | a entrada de fecho, `/en/method`, 1280, **refeita depois do corte** |
| `../capturas/etapa-4/metodo-1280-pt-claro.png` | a página inteira, `/metodo`, 1280 (antes do corte; refeita no fecho da etapa) |
| `../capturas/etapa-4/metodo-1280-en-claro.png` | a página inteira, `/en/method`, 1280 (idem) |

### 3.6 · `IDENTIDADE.md` §2 não cita «A cor»

A amarra permite-o agora que a frase existe, e a citação seria guardada palavra
por palavra com a marca (`metodo`). Fica **por escrever**, e a razão está na
entrada: a §2 já diz a mesma regra pelas suas próprias palavras, e duas redações
da mesma regra no mesmo ficheiro são duas regras no dia em que uma mudar. É
decisão da cadeira e custa três linhas.

---

## 4. Évora, o que restava · e a regra, escrita uma vez

A direção respondeu ao pedido 3 (o `ISSUES.md` **I52**) a 21.08.2026, à tarde.
`DECISIONS.md` §1.57. **`Afecta: nenhum`**: nenhum texto governado, nenhum valor.

### 4.1 · Os três blocos

| bloco | decisão | o que ficou |
|---|---|---|
| a nota de mandato, `decidiuNota` | as duas palavras da casa ou nada | **«sem linha ainda»** / **«no row yet»**, que é `s.cobertura.semLinhaAinda` — a mesma cadeia com que uma peça vazia da primeira página diz a mesma coisa. Era isto que faltava resolver: não uma terceira formulação, mas a que já existia |
| a entrada «Um partido é dono das suas decisões, não de uma curva», em «Método e ressalvas» | sai | retirada inteira. É a nota de como a página foi feita |
| a entrada de «O que esta página não sabe» | fica | fica, e é **reclassificada como conteúdo** no inventário, com a razão **«limite dos dados»** |

O limite dos dados que a segunda também dizia **não se perde**: está na terceira,
que é onde pertence, e é por isso que cortar a segunda não tira nada ao leitor.

### 4.2 · A régua, antes e depois

`node scripts/medir-defeitos.mjs`:

| rota | antes | depois |
|---|---|---|
| `/municipios/evora` | 63 distintas · conteúdo 82 · navegação 6 · **autorreferência 3** | 62 distintas · conteúdo 84 · navegação 6 · **autorreferência 0** ✓ |
| `/en/municipalities/evora` | 64 distintas · conteúdo 83 · navegação 6 · **autorreferência 3** | 63 distintas · conteúdo 85 · navegação 6 · **autorreferência 0** ✓ |

O conteúdo sobe duas: «sem linha ainda» e «no row yet» entram na conta da rota
(já estavam classificadas, da primeira página), e as duas frases longas que
saíram levavam consigo mais do que uma linha da tabela.

### 4.3 · A regra, escrita uma vez

O diretor deu, na mesma tarde, o teste que decide isto sem perguntar caso a caso:

> **Uma frase sobrevive numa página do leitor se a sua remoção fizesse um leitor
> ler mal um número. Ficam as ressalvas sobre os dados (limites, bandeiras de
> provisório, definições); sai tudo o que existe para mostrar diligência.**

Está escrita **duas vezes e num sítio só**: em `../direcao.md`, por baixo das
Emendas, como nota à Emenda 15; e na cabeça de `../INVENTARIO-FRASES.md`, com a
versão inglesa ao lado, porque é lá que cada classificação se decide. É o teste
das subetapas 4c a 4e, aplicado sem perguntar.

**A §1.3 desta nota fica como está**, e não se reescreve: dizia que a contagem
não fechava a zero e porquê, e a decisão que a fechou está aqui. Uma dívida
apagada depois de paga é uma dívida que ninguém soube que existiu.

---

## 5. Subetapa 4c · a Agenda

`DECISIONS.md` §1.58. **`Afecta: nenhum`**, e **nenhum registo tocado**: a lista
e o calendário atravessaram do motor e continuam como atravessaram. O que muda é
a mobília da casa à volta deles.

### 5.1 · O que saiu, e o que ficou

Seis cadeias, todas em `agenda.*`, nas duas edições, com o antes e o depois em
`../RELOCACOES.md`. **Duas retiradas** (a lede, a nota de origem) e **quatro
encurtadas** (o vazio de «Retirado», o item sem critérios, a lede do calendário,
e as duas notas da pergunta fundidas numa).

**A nota da pergunta é o caso que mostra a regra a funcionar nos dois sentidos.**
Dizia duas coisas: a regra da casa («nos estudos, a pergunta é selada no motor
antes de a recolha começar. Esta está selada.») e um facto sobre o texto que o
leitor tem à frente («o inglês é a forma registada, palavra por palavra»). A
primeira sai — é diligência, e o estado do registo prévio está na linha logo
abaixo, com data. A segunda fica: sem ela, quem lê a edição portuguesa toma a
tradução pelo registo. Ficam as ressalvas sobre os dados; sai o que existe para
mostrar diligência.

### 5.2 · Abre no sítio

O sumário no cimo (os quatro estados e o calendário, como âncoras que já
existiam) e **cada item como cartão que abre**: `<summary>` com o tipo, o estado
e o título; o porquê, os critérios, as datas, a pergunta e o histórico dentro da
dobra. Sem JavaScript. **O portão não perde nada**: o conteúdo de um `<details>`
fechado está no documento, e a conferência campo a campo continua a encontrar
todos os campos (o `npm run build` corre o portão e ficou a zero). A primeira de
cada secção abre por defeito, como no Método.

O `<article>` continua a ser o elemento que o portão conhece
(`data-agenda-item`), e a dobra vive dentro dele: é a mesma solução que a 4b deu
à disposição A do Método, e por isso a folha é a mesma.

### 5.3 · O último `var(--yellow)` real

`ISSUES.md` **I12**, aberto desde a etapa 1. O atributo `fill` das janelas de
publicação do eixo passa de `var(--yellow)` a `var(--g2)`, e a regra
`.agenda-eixo-svg rect` de `site.css`, que o remapeava, sai no mesmo commit.

**A página não muda de aspecto, e isto está escrito porque é fácil dizer o
contrário.** A folha já ganhava ao atributo desde a 1c: as janelas já eram
cinzentas. Refotografei o eixo antes e depois do commit e a imagem é a mesma
(`../capturas/etapa-4/agenda-eixo-1280-{pt,en}-claro.png`). O que muda é o
gabarito deixar de nomear um token que não existe, e uma regra sem cliente sair.

```
grep -rn "var(--yellow)" src/    → 4 ocorrências, as quatro em comentários
```

`src/styles/site.css` é ficheiro de outro construtor, e foi aberto para tirar
essa regra: é o que o I12 manda («o bloco de remapeamento sai com eles»), é uma
regra que só servia esta vista, e vai escrito aqui em vez de improvisado.

### 5.4 · O inventário

As três rotas da etapa entram na lista (`ROTAS_DO_INVENTARIO`): `/agenda` na 4c,
`/estudos` e `/estudos/<slug>` na 4e.

```
frases da casa · /agenda ....... 21 distinta(s) · conteúdo 31 · navegação 2 · autorreferência 0  ✓
frases da casa · /en/agenda .... 21 distinta(s) · conteúdo 31 · navegação 2 · autorreferência 0  ✓
```

Vinte blocos por edição, classificados um a um em `../INVENTARIO-FRASES.md`, com
a razão da classe escrita por cima da tabela. «Nesta página» é navegação; tudo o
resto é conteúdo, incluindo as duas frases de ausência.

### 5.5 · Uma chave que chegou tarde ao registo

`metodo.sumarioK` nasceu na 4b e **não foi escrita em `../CHAVES-EN.md` no commit
que a criou**, que é o que a regra do brief manda. Fica dita aqui, e o registo
recebeu-a na 4c, já com a casa nova (`leitura.sumarioK`). É um defeito do meu
commit da 4b, não da 4c.

---

## 6. Subetapa 4d · o Sobre, o marcador e o 404

`DECISIONS.md` §1.59. **`Afecta: nenhum`**, e `src/data/sobre.mjs` não é tocado.

### 6.1 · O resultado honesto: não havia o que mudar

O brief pedia «tipo e tokens só». Fui ver, página a página, e as três já estavam
na disposição A, na letra e nos tokens da v3: as etapas 1 e 2 mudaram a folha
inteira, e estas páginas vivem de `.metodo-secao`, `.lede`, `.eyebrow` e dos
tokens de `tokens.css`, que já lá tinham passado. Nenhum literal de cor, nenhuma
pilha de sistema, nenhum token aposentado. **Não inventei trabalho para a
subetapa ter conteúdo.**

O Sobre continua com o seu bloco `data-sobre`, que o portão compara carácter a
carácter com `src/data/sobre.mjs` (`npm run verify` a zero, com o portão a
correr).

### 6.2 · Uma cadeia encurtada

`erro404.corpo`, pela regra da direção. Dizia «…ou a página pode ter mudado de
sítio **enquanto os estudos são mudados para aqui**»; a segunda metade conta o
projecto da casa a quem só quer o caminho de volta. Em `../RELOCACOES.md`.

### 6.3 · Dois achados da fotografia

1. **`ISSUES.md` I53, e é uma rota que falta:** a edição inglesa não tem página
   de erro. `src/pages/` tem `404.astro` e mais nada, e um leitor inglês que caia
   num endereço inexistente recebe a página portuguesa, com o título e as três
   portas em português; a troca de edição no cabeçalho aponta para `/en/404`, que
   não existe e devolve o mesmo ficheiro. As cadeias inglesas já existem em
   `erro404.*`. Não a fiz: é uma rota nova, e o brief desta subetapa é «tipo e
   tokens só». Pedido à cadeira;
2. **o aparelho das capturas pedia uma pasta que não existe.** `/404` devolvia um
   corpo vazio e a captura saía branca, porque `dist/` guarda `404.html` e não
   `404/index.html` — em produção é o anfitrião que serve esse ficheiro para um
   caminho desconhecido. A rota da captura passa a `/404.html`. **A primeira
   captura branca não era um defeito da página**, e teria sido fácil escrevê-lo
   como se fosse.

### 6.4 · Uma coisa observada e não mudada

As duas portas do fim da página do marcador («Ver as linhas que o trazem», «Como
isto é feito») rendem em `.rodape-nav`, que não põe fio nenhum por baixo e as
escreve em `--muted`: leem-se como rótulos e não como portas. **Não mexi**, e a
razão é que `.rodape-nav` é uma classe partilhada por seis vistas e pelo rodapé,
é de outro construtor, e no rodapé — onde é uma fila inteira de ligações — o
contexto resolve. Fica dito para a cadeira decidir se a classe se separa em duas.

---

## 7. Subetapa 4e · o arquivo e as páginas de trabalho

`DECISIONS.md` §1.60. **`Afecta: nenhum`**, e a rota do documento alojado não é
tocada: `check:documentos` continua a provar os bytes de cada ficheiro.

### 7.1 · A caixa às riscas, e o estado dito duas vezes

O item **M** da §4 pedia uma decisão entre mudar a caixa ou mudar o nome, e a
direção escolheu a forma: as palavras ficam, as riscas saem. A fotografar
encontrei o resto do defeito, que o item não nomeava: **o estado dizia-se duas
vezes na mesma página**, no antetítulo por cima do título e outra vez dentro da
caixa. Tirar as riscas e deixar as duas linhas seria trocar um defeito por outro.
Fica **uma** vez, no antetítulo. `.placeholder` e `.placeholder-tag` saem de
`site.css` porque ficaram sem cliente, e a regra `.estudo-estado` que cheguei a
escrever em `leitura.css` saiu com elas — não chegou ao commit.

### 7.2 · O que saiu, e o que ficou

Seis cadeias retiradas e uma encurtada, em `../RELOCACOES.md` com o antes e o
depois nas duas edições. As duas que custam mais a ver:

- **«Leitura publicada» sai.** Era a casa a dizer de si que tinha acabado o
  trabalho, por cima de uma página onde o trabalho está à vista. Os outros dois
  estados ficam, porque são ausências declaradas;
- **duas frases saem de dentro de blocos que ficaram** (`src/data/leituras.mjs`).
  A nota que explica porque é que dois selos aparecem tracejados acabava em
  «Inventar uma frase seria pior do que mostrar a falta.» O limite fica — sem ele,
  quem vê o selo tracejado lê mal o valor ao lado —, o cuidado sai. **É a regra a
  funcionar nos dois sentidos dentro da mesma frase**, e é por isso que não bastou
  classificar o bloco: classificá-lo como conteúdo fechava a contagem a zero com
  a frase lá dentro, que era ganhar a régua sem cumprir a regra.

`src/data/leituras.mjs` é ficheiro fora da lista da §2 do brief, aberto para essa
frase e mais nada.

### 7.3 · A data do arquivo, e a planta que a prova

O índice rende `e.date ?? [a verificar]`, lido do registo e de mais lado nenhum.
Hoje há três edições com data e doze sem.

**A primeira planta não provava o que era preciso provar**, e vai escrito: pus
`date: null` numa edição com data e o marcador apareceu — mas essa edição tinha
`updated: null`, e portanto a planta não dizia nada sobre o `updated` ser lido no
lugar da data. **A segunda:** `date: null` **e** `updated: '2026-08-12'` na mesma
edição.

```
antes:   12 × «Publicação: [a verificar]» · 2 × 2026-08-04 · 1 × 2026-08-12
planta:  13 × «Publicação: [a verificar]» · 2 × 2026-08-04
         «2026-08-12» não aparece uma única vez em dist/estudos/index.html
```

**Revertida** (`git diff --stat src/data/studies.mjs` sem diferenças), e a
construção volta às doze.

### 7.4 · O inventário

Vinte e quatro rotas — o índice e onze trabalhos, nas duas edições — **todas a
zero**, e nenhum bloco por classificar. Cento e seis blocos distintos entraram no
inventário um a um; a esmagadora maioria são nomes de medidas, unidades escritas,
descrições de trabalhos e as ressalvas dos próprios trabalhos sobre o que as suas
fontes permitem estabelecer. **As ressalvas ficam todas**, por mais longas que
sejam: são limites dos dados.

### 7.5 · Um defeito que a etapa criou, e que não escondo

`ISSUES.md` **I54**: a casa passou a ter **dois sinais para a mesma dobra**. O
`.deep` (a camada de fundo da página de concelho e da página de um trabalho)
desenha um triângulo que roda ao abrir, e é anterior a esta etapa; as dobras que
a 4b e a 4c criaram desenham `+` e `−`. A Emenda 10 fecha exactamente esta porta.
Não unifiquei: o `+`/`−` foi visto pela direção nas capturas da 4b, o triângulo é
de outro construtor e está em duas páginas, e escolher entre os dois é forma.

---

## 8. Subetapa 4f · o fecho

### 8.1 · Um defeito da 4c, apanhado a fotografar a 390

O sumário do Método rendia **«1As fontes»**, sem goma entre o número e o nome, e
só no telemóvel. A causa foi minha, na 4c: para tirar a coluna do número ao
sumário da Agenda escrevi `.metodo-sumario-lista li:not([class])`, e as dez
regras do Método também são `li` sem classe — a regra apanhou-as e desligou-lhes
a caixa flexível. O selector passa a ser a etiqueta da lista, que é o que
distingue mesmo as duas: **o Método numera e escreve `<ol>`, a Agenda não numera
e escreve `<ul>`**.

Vai escrito aqui porque é a lição e não o erro: uma regra escrita a partir do que
o marcador **não tem** apanha tudo o que não o tem.

### 8.2 · As réguas

```
npm run build         exit 0
npm run verify        exit 0
npm run ledger:check  exit 0   (24 entradas a partir da §1.38, 2 textos governados)
node scripts/medir-defeitos.mjs      exit 0
node scripts/medir-contraste.mjs     exit 0
node scripts/medir-tipos.mjs         exit 0
node scripts/medir-invariancia.mjs --chaves   → 20 chaves iguais nas duas edições
node scripts/ortografia.mjs          exit 1   (ver 8.4)
```

**O inventário**, `medir-defeitos.mjs`: **36 rotas inventariadas, as 36 a zero de
autorreferência, e nenhum bloco por classificar em nenhuma delas.** A lista
declarada tem 413 entradas, onde a etapa 3 a deixou com 267. A etapa entrou com
`/agenda`, `/estudos` e as vinte e duas rotas de trabalho.

**O contraste**, `medir-contraste.mjs`: 0 falhas de texto, 4 objetos de interface
abaixo de 3:1, os mesmos da etapa 1 e nenhum desta. Nenhuma cor nova entrou na
etapa 4: a única mudança de cor foi um `fill` que passou a nomear o cinzento que
a folha já pintava.

**As chaves**, `medir-invariancia.mjs --chaves`: **20**, o mesmo número da 2m.
A etapa não criou nenhuma identidade nova — `leitura.sumarioK` é «Nesta página» /
«On this page», que são cadeias diferentes.

### 8.3 · A invariância, contra a construção da 4a

Construção da linha de base num `git worktree` em `3a51cb8` (o commit da 4a),
comparada com a de agora:

```
322 rotas · 293 idênticas em texto · 29 com diferenças
```

**As 29 são exactamente as rotas que a etapa reconstruiu**, e nenhuma outra:

| rota(s) | o quê |
|---|---|
| `/metodo`, `/en/method` | `+27 −0` |
| `/agenda`, `/en/agenda` | `+10 −6` |
| `/municipios/evora`, `/en/municipalities/evora` | `+1 −3` |
| `/404` | `+1 −1` |
| as 22 rotas de trabalho (11 × 2 edições) | `+0 −4`, `+0 −3` ou `+1 −4` |

**O `+27 −0` do Método vale a explicação**, porque um número grande sem nada
retirado parece um erro de leitura. A régua imprime só cinco linhas por rota, e
por isso recontei o diferencial inteiro com uma extracção própria, que dá o mesmo
27: **20** são o sumário (os dez números e os dez nomes das regras passam a
aparecer **duas** vezes na página, e a régua conta ocorrências) e **7** são a
entrada de fecho («A forma» duas vezes, «A cor» e a sua frase, a porta, «A letra»
e a sua frase). **Nada saiu do Método**, e é isso que o `−0` diz.

**O `/estudos` e o `/en/studies` não aparecem na lista**, e está certo: a 4e
mexeu nas páginas de trabalho e na folha, e não numa palavra do índice.

### 8.4 · A régua da ortografia falha, e não é desta etapa

`node scripts/ortografia.mjs` sai a **1**, com uma forma fora da grafia da casa:

```
src/components/inicio/Peca.astro:216:32  tecto → teto
    … {regua.rotulo === 'tecto' && ( <Fragment slot="refer…
```

**Corri a mesma régua na construção da linha de base** (`3a51cb8`) e ela falha lá
exactamente da mesma maneira: é anterior a esta etapa. É uma comparação de
cadeias dentro de um componente da primeira página, que é de outro construtor, e
**não é texto publicado**: `grep -o tecto dist/` dá três ficheiros, e os três são
o nome de uma classe de CSS (`mun-tecto-rot`), nunca uma palavra que um leitor
veja. A régua não entra no `npm run build`. Fica escrita aqui em vez de corrigida
à socapa num ficheiro que não é meu.

### 8.5 · As capturas

`node tests/inicio/capturas.mjs --etapa-4` → **38 capturas** em
`../capturas/etapa-4/`, todas no tema claro, a 1280 e a 390, nas duas edições:

| rota | ficheiro |
|---|---|
| `/metodo` · `/en/method` | `metodo-{1280,390}-{pt,en}-claro.png` |
| a entrada de fecho, recorte | `metodo-fecho-1280-{pt,en}-claro.png` |
| `/agenda` · `/en/agenda` | `agenda-{1280,390}-{pt,en}-claro.png` |
| o eixo do calendário, recorte | `agenda-eixo-1280-{pt,en}-claro.png` |
| `/correcoes` · `/en/corrections` | `correcoes-{1280,390}-{pt,en}-claro.png` |
| `/sobre` · `/en/about` | `sobre-{1280,390}-{pt,en}-claro.png` |
| `/estudos` · `/en/studies` | `estudos-{1280,390}-{pt,en}-claro.png` |
| `/estudos/agua-nao-faturada` (documento alojado, página por escrever) | `estudo-agua-{1280,390}-{pt,en}-claro.png` |
| `/estudos/evora-prometido-pago-auditado-2026` (leitura publicada) | `estudo-leitura-{1280,390}-{pt,en}-claro.png` |
| `/a-verificar` · `/en/to-verify` | `marcador-{1280,390}-{pt,en}-claro.png` |
| `/404` (uma edição só) | `nao-encontrado-{1280,390}-pt-claro.png` |

Duas coisas que a lista do brief não tinha e que entraram com razão: o **recorte**
da entrada de fecho e do eixo, porque numa página inteira a 1280 as duas peças da
etapa medem dois dedos; e a **segunda página de trabalho**, porque a página tem
dois estados e uma captura só mostrava um.

---

## 9. O que fica pedido

| # | pedido | a quem |
|---|---|---|
| 1 | ~~A palavra do diretor sobre as duas frases renderizadas~~ **Respondido a 21.08.2026, tarde: sim, com o corte da linha de prova da cor.** Feito na 4b | direção |
| 2 | **O apóstrofo reto de «This site's»** (§3.3): fica como o diretor o escreveu; se quiser o tipográfico, é um carácter | direção |
| 3 | ~~Os três blocos de autorreferência de `/municipios/evora`~~ **Respondido a 21.08.2026, tarde.** Feito na subetapa a seguir (§4 abaixo) | direção, cadeira |
| 4 | **A leitura de «Quem responde pelo quê»** (§1.2): das três possíveis, escolhi a que põe a frase por cima da banda dos mandatos. Se a cadeira quiser outra, é uma linha | cadeira |
| 5 | **`IDENTIDADE.md` §2 a citar «A cor»** com a marca, se a cadeira quiser a amarra a guardá-la (§3.6) | cadeira |
| 6 | **A edição inglesa não tem página de erro** (`ISSUES.md` I53, §6.3): as cadeias já existem em `erro404.*`, o que falta é a rota. Um ficheiro de página e uma declaração | cadeira |
| 7 | **Dois sinais para a mesma dobra** (`ISSUES.md` I54, §7.5): o triângulo do `.deep` e o `+`/`−` das dobras novas. A Emenda 10 fecha esta porta, e escolher entre os dois é forma | cadeira |
| 8 | **As duas portas do fim da página do marcador** (§6.4) rendem sem fio e em cinzento, porque `.rodape-nav` é do rodapé. Se a classe se separar em duas, é uma regra | cadeira |
| 9 | **`ortografia.mjs` falha, e é anterior a esta etapa** (§8.4): `tecto` numa comparação de cadeias em `src/components/inicio/Peca.astro`, que não é meu e não é texto publicado | construtor A |

---

## 10. Modelo e gasto

| | |
|---|---|
| modelo | Claude Opus, `claude-opus-5[1m]` |
| commits | `6b7dab8` (4-0), `3a51cb8` (4a), `66a2866` (4b), `0e0b274` (Évora, I52), `156b256` (4c), `ecd14f7` (4d), `1fec8f8` (4e), e o do fecho |
| ficheiros abertos fora da lista da §2 do brief, e porquê | `tests/inicio/capturas.mjs` (o modo `--etapa-4`, §5.5 do brief não o previa; precedente do modo `--etapa-3`), `src/styles/site.css` (a regra `.agenda-eixo-svg rect` e as duas do `.placeholder`, que ficaram sem cliente — é o que o I12 e o item M mandam), `src/data/leituras.mjs` (uma frase, §7.2), `src/data/municipios.mjs` e `src/views/MunicipioView.astro` (a decisão da direção sobre Évora, §4), `src/i18n/strings.mjs` famílias `livro.*` e `municipio.*` no commit 4-0 |
| plantas provadas e revertidas | duas na 4a (a porta do selo), duas no commit 4-0 (a porta do CSV), duas na 4e (a data do arquivo, e a primeira não provava o que era preciso) |

**O que esta etapa deixou por fazer, e é do brief:** nada da §3. As cinco
subetapas e o fecho estão commetidas. O que fica são os nove pedidos da §9, que
são decisões e não construção.
