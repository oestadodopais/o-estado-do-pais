# Decisões, desvios e limites

Registo do que foi decidido durante a construção da fundação, e porquê.
Escrito para o director poder rever, e reverter, cada escolha.

Data: 12 de Agosto de 2026 · Astro 7.2.1 · Node 22.23.1

---

## 1. Desvios ao que estava fixado

### 1.1 O mapa passou de `<canvas>` para SVG construído no servidor

**Fixado:** portar o mapa de 308 pontos do estudo de identidade v2.
**Feito:** as posições são exactamente as mesmas, transcritas sem alteração; o
desenho é que passou a ser SVG gerado no servidor, em vez de `<canvas>`
desenhado no cliente.

Razões:

1. **Zero JavaScript de origem.** Em canvas, sem JavaScript não havia mapa
   nenhum — um rectângulo vazio. Em SVG, o mapa existe na página construída, e
   o JavaScript só acrescenta a leitura ponto a ponto.
2. **O tema deixou de precisar de código.** As cores vêm dos tokens por CSS; o
   estudo de identidade tinha de redesenhar o canvas a cada mudança de tema, com
   um `MutationObserver` e um listener de `prefers-color-scheme`. Isso
   desapareceu.
3. **Cada ponto passou a ser um nó com nome** (`data-m`, `data-d`), o que torna
   o instrumento inspeccionável e o portão capaz de o ver.

Custo: cerca de 21 KB de markup por página (307 círculos), contra um array de
coordenadas em JavaScript. Comprime bem e é servido estático. Se o director
preferir o canvas, a troca é local ao `InstrumentoMapa.astro`.

### 1.2 Campos acrescentados ao formato do livro-razão

Ao formato fixado (id, value, unit, source, document, source_url, access_date,
excerpt, derivation, study, corrections) foram acrescentados três campos
opcionais:

- **`reference_date`** — necessário. Sem ele não há como distinguir «lido a
  2026-07-28» de «dados de 2024», e as duas coisas aparecem nos números
  semeados. Sem este campo, uma das duas datas teria de ser inventada ou perdida.
- **`derived_from`** — a lista de afirmações de que uma linha derivada depende.
- **`check`** — a aritmética como expressão, reavaliada a cada build.

`derived_from` e `check` existem para dar dentes ao campo `derivation`: sem
eles, a explicação da conta é prosa que ninguém confere. Com eles, o build
refaz a conta. Treze das vinte e nove linhas passam por essa
re-derivação.

### 1.3 Numa linha derivada, os campos de proveniência podem ser `null`

Uma distância como `18` (= 100 − 82) não tem fonte própria: a fonte é a da
linha de onde deriva. Obrigar a repetir a proveniência do pai seria convidar a
que as duas divergissem.

Regra imposta pelo validador: os campos de proveniência só podem ser `null`
quando `derived_from` não está vazio, e nesse caso `derivation` é obrigatório.

### 1.4 `excerpt` ficou `[a verificar]` em quase todas as linhas semeadas

Os valores semeados foram dados como números; o texto literal das fontes não.
Um excerto é, por definição, a citação palavra por palavra da fonte — escrever
uma paráfrase plausível no campo `excerpt` seria exactamente a fabricação que
este sistema existe para impedir.

Só uma linha tem excerto real: `estudos-evora-publicados`, transcrito do colofão
do estudo de identidade.

A verificação lista, ao fim de cada corrida, as 20 afirmações com campos por
confirmar e que campos são. Não bloqueia o build; impede que se diga que o
livro-razão está fechado.

### 1.5 A linha de método e a linha de autoria não são traduzidas

«Portugal, medido. Cada número tem fonte.» e «Escrito por IA, dirigido por uma
pessoa.» aparecem em português nas duas edições, como o nome. São identidade e
declaração de autoria, não texto corrente.

Na edição inglesa, a linha de autoria leva por baixo, em letra pequena,
«Written by AI, directed by a person.», para que o leitor inglês perceba o que
está a ler sem que a declaração deixe de estar no original.

**Reversível numa linha** em `SiteFooter.astro`, se o director preferir
tradução plena.

### 1.6 Formatação portuguesa dos números nas duas edições — por agora

Estava fixado que `value` é «a cadeia exacta como publicada, formatação PT».
A consequência é que a edição inglesa mostra `77,2` e `26,5%`, com vírgula
decimal, a um leitor que espera ponto.

**Decisão da direção: fica assim por agora.** Não é a forma final.

**Aceite e em fila: localização de exibição por edição.** A ideia não foi
rejeitada — foi adiada. A forma dela é conhecida e não conflitua com nada do
que está feito:

- a linha do livro-razão continua a guardar a **cadeia exacta como publicada**,
  em português. Essa é a prova documental e não se toca;
- a renderização passa a poder localizar essa cadeia por edição — `77,2` em PT,
  `77.2` em EN — a partir do mesmo valor;
- o portão não precisa de afrouxar: já compara **sequências de algarismos**, e
  `77,2` e `77.2` têm a mesma. Apanha um valor trocado tanto num caso como no
  outro. O que passaria a ser preciso é uma verificação a mais, não a menos:
  que a cadeia localizada seja a localização daquela cadeia publicada, e não
  outra qualquer.

Enquanto não estiver feito, a edição inglesa mostra a formatação portuguesa —
o que é defensável, porque é literalmente o que a fonte publicou, mas não é
confortável de ler.


### 1.7 As descrições dos estudos são reformulações do título

Estava pedida «uma linha de descrição» por entrada. Não li os estudos. Uma
descrição do conteúdo seria conteúdo inventado.

Feito: cada descrição reformula o próprio título, sem acrescentar factos e sem
números. Onde o título não determina o objecto — «Onde está a água?» — está
`[descrição em preparação]`.

O arquivo abre com um aviso visível a dizer que datas e descrições não estão
confirmadas e que as descrições não são resumos.

**Excepção:** a descrição de «Évora — Os Pelouros, Quem Os Teve, O Que Fizeram»
veio escrita pela direção e não é minha. É a única do arquivo que descreve o
conteúdo do estudo em vez de reformular o título — e repare-se que é ela
própria a declarar o seu limite: a ligação entre pelouros e despesa é feita
«por este documento, não por fonte oficial».

### 1.8 As páginas de estudo estão fora do índice até à migração

Vinte páginas de destino sem conteúdo (dez trabalhos × duas línguas),
indexadas, seriam um passivo: o sítio passaria a ser, aos olhos de um motor de
busca, maioritariamente páginas vazias. **Recomendação aceite pela direção.**

Feito:

- `<meta name="robots" content="noindex, follow">` nas páginas de destino de
  estudo. O `follow` fica, para que as ligações continuem a contar;
- as mesmas páginas saem do sitemap, por `filter` em `astro.config.mjs`;
- os índices do arquivo — `/estudos` e `/en/studies` — continuam indexados e no
  sitemap;
- o canónico mantém-se em todas: o endereço não muda, só deixa de ser convidado
  ao índice;
- o `Article` JSON-LD continua marcado `creativeWorkStatus: "Draft"`.

O portão de HTML passou a impor as duas metades desta decisão: falha se uma
página de destino de estudo perder o `noindex`, e falha se uma página que é para
ser indexada o ganhar por descuido.

**Levantar na migração:** apagar o `filter` no `astro.config.mjs` e o
`noindex={true}` em `EstudoView.astro`. São duas linhas.

**Actualização (§1.19):** a página de destino deixou de ser um esboço, mas o
`noindex` fica — não por a página estar vazia, mas por ainda não ter a leitura
do observatório sobre o estudo. Levanta-se quando essa for escrita, não quando o
documento for alojado. Os documentos originais também não entram no índice pela
via do sitemap; a decisão sobre a indexação deles é da direção, e faz-se ao
nível do alojamento.

### 1.9 Não há botão de tema

O CSS tem os três estados completos e respeita `data-theme` se alguém o puser.
Não foi acrescentado um botão porque isso seria JavaScript numa página que não
tem instrumento nenhum, e a regra fixada era zero JavaScript de origem. É meia
dúzia de linhas quando o director quiser.

### 1.10 Estudos e edições contam-se em separado

Uma tradução não é investigação nova. O arquivo lista **edições** — é o que o
leitor procura, e é por isso que a edição inglesa de «Orçamentado, Pago, Devido
2025» tem linha própria. Mas o cabeçalho anuncia as duas contagens, **estudos ·
edições**, porque anunciar só o número de edições contaria as traduções como
trabalhos novos.

As duas contagens são afirmações do livro-razão e as duas são reavaliadas
contra `src/data/studies.mjs` a cada build (`check: estudos_no_arquivo` e
`check: edicoes_no_arquivo`). Foi essa amarra que, ao entrar o décimo trabalho,
obrigou a mexer nas três contagens ao mesmo tempo — ver §1.14.


### 1.11 A contagem de Évora: 4 → 3 → 4, e o que isso revelou

O colofão do estudo de identidade dizia «Évora: 4 estudos aprofundados
publicados». Na primeira construção esse valor foi mantido tal como estava, com
uma nota a dizer que a base da contagem não estava reconciliada.

**A direção reconciliou-a:** os quatro artefactos sobre Évora são três estudos
mais a edição inglesa de um deles. Pela distinção entre trabalho e edição que o
arquivo já usava (§1.10), são **três**.

Feito:

- a afirmação `estudos-evora-publicados` passou a `3`;
- deixou de vir do colofão e passa a vir da contagem do próprio arquivo:
  `derivation` nomeia os três trabalhos, e `check: estudos_evora_no_arquivo`
  reavalia a contagem contra `src/data/studies.mjs` a cada build. Se um quarto
  trabalho sobre Évora entrar no arquivo e o número não mudar, o build falha;
- os três trabalhos ganharam `subject: 'evora'` no registo. «Onde está a água?»
  ficou com `subject: null` — o título não diz de que território trata, e a
  direção não o incluiu na reconciliação;
- a nota de base não reconciliada saiu: esta **é** a reconciliação;
- a legenda do mapa passou a «3 estudos aprofundados publicados (um com edição
  em inglês)», nas duas edições;
- a correção ficou registada em `corrections[]`, com data, valor antigo, valor
  novo e motivo. É a primeira entrada real da disciplina de correções da casa.

**Segunda correção, no mesmo dia: 3 → 4.** Foi publicado «Évora — Os Pelouros,
Quem Os Teve, O Que Fizeram», e a contagem subiu outra vez. A amarra provou-se:
com o trabalho já no arquivo e a afirmação ainda em `3`, o build parou —
`calculado: 4, publicado: 3`. Não é possível acrescentar um estudo sobre Évora
e esquecer o número que o conta.

**Uma tensão que isto abre, e que é da direção decidir.** O registo passou a ter
duas entradas de natureza diferente:

| data | mudança | o que foi |
| --- | --- | --- |
| 2026-08-12 | 4 → 3 | **correção**: o valor publicado estava errado |
| 2026-08-12 | 3 → 4 | **actualização**: o valor estava certo, o mundo mudou |

O texto do Método define correção como o oposto de corrigir em silêncio — o
remédio para um **erro**. Uma recontagem por ter saído um estudo novo não é um
erro; é o número a acompanhar a realidade. Com as duas coisas no mesmo registo,
com o mesmo aspecto, o registo deixa de ser uma confissão e passa a ser um
diário de alterações — e uma confissão diluída vale menos.

**Aceite pela direção, e feito.** O campo `kind` passou a existir, obrigatório,
com dois valores: `correcao` (o valor publicado estava errado) e `actualizacao`
(estava certo e o que mede mudou). As duas entradas existentes foram
classificadas: `4 → 3` é correção, `3 → 4` é actualização.

**A regra de quando se regista o quê:** uma actualização regista-se quando muda
o **valor de uma afirmação** por razões que não são erro. As recontagens
derivadas que se seguem por arrastamento — as contagens do arquivo, que mudaram
de 9 → 10 e 12 → 13 quando entrou o décimo trabalho — **não** se registam em
separado. Já são reavaliadas pelo build a cada corrida, e enchê-las no registo
abafaria as correções, que é o que o registo existe para mostrar.

**Como se mostram**, em `/metodo`: dois grupos, não uma lista.

- **Correções** vêm primeiro, com peso: barra lateral, título e etiqueta na
  única cor que o sistema tem além do amarelo. O amarelo marca medição; esta
  marca um erro admitido. A contagem — «N correções publicadas» — conta **só**
  as correções, e é ela própria uma afirmação do livro-razão
  (`correcoes-publicadas`, com `check: correcoes_publicadas`): se entrar uma
  correção nova e o número não mudar, o build falha.
- **Atualizações** vêm depois, em surdina: sem cor, sem caixa, uma linha cada.

**A cor.** Foi preciso acrescentar um token — `--oxblood` — a uma identidade que
tinha duas cores e uma regra sobre elas. Fica reservado ao registo de correções
e a mais nada, nos três estados do tema, e o contraste foi medido, não estimado:
**9,45:1** no tema claro (`#7C2333` sobre `--paper`) e **7,22:1** no escuro
(`#D98A95`) — os dois acima de AAA, e na mesma banda do `--muted` que já existia.

**A etiqueta da natureza é redundante de propósito.** Cada entrada mostra
«correção» ou «atualização» ao lado do id, mesmo estando já debaixo do título do
grupo. O título do grupo é texto do gabarito; a etiqueta vem do livro-razão e é
conferida contra ele. Sem ela, reclassificar uma confissão em actualização seria
uma alteração de gabarito que nada apanhava.

**Um buraco que ficou, e que a direção mandou fechar:** o `reason` de cada
entrada estava no livro-razão numa língua só — português, também na edição
inglesa. A proposta era um campo `reason_en` mais uma regra no portão a
conferir as duas versões. **Aceite e feito — ver §1.17.**

Foi por isto que as contagens de estudos (9 → 10) e de edições (12 → 13) **não**
levaram entrada de correção: são recontagens da mesma natureza da segunda, já
verificadas pelo build a cada corrida, e enchê-las no registo agravaria
exactamente o problema descrito acima. Se a direção preferir que toda a mudança
de valor deixe rasto no registo, é uma decisão de uma linha — e então convém
primeiro o campo `kind`.

O registo de correções em `/metodo` deixou de ser um componente vazio: passou a
ser lido do próprio livro-razão. Junta as correções de todas as afirmações, da
mais recente à primeira. Uma correção só aparece ali se existir no ficheiro da
afirmação, e nenhuma pode ser retirada de um sítio sem sair do outro.


### 1.12 Diagnósticos de TypeScript em `astro.config.mjs`

A direção reportou que o servidor de linguagem assinalava, nesse ficheiro, o
import de `.mjs` sem tipos e um parâmetro com `any` implícito.

**Reproduzido** — com os imports por resolver, o ficheiro dava sete
diagnósticos: dois `TS7016` (módulo sem declaração de tipos) e três `TS7006`
(parâmetro com `any` implícito: `page`, `item` e `a`).

**Diagnóstico das causas, que são duas e diferentes:**

- Os `TS7006` eram defeitos a sério: três funções de callback sem tipo. Foram
  corrigidos com JSDoc — `filter`, `serialize` e o `map` das alternativas — e o
  `routes.mjs` ganhou `@typedef` e assinaturas anotadas nas seis funções
  exportadas. Sob o mesmo teste degradado, os `TS7006` passaram de **três a zero**.
- O `TS7016` só aparece quando o verificador não está a aplicar `allowJs`.
  Com `allowJs` desligado, o TypeScript nem aceita um `.mjs` no programa
  (`TS6504`); com ele ligado, o ficheiro fica limpo. O `tsconfig.json` do
  projecto já tinha `allowJs: true` — ficou com um comentário a dizer porque não
  se desliga.

**Mantido o `// @ts-check`.** Vale o que custa: valida o objecto de configuração
do Astro contra `AstroUserConfig`, e apanha um `trailingSlash: 'nevr'` que de
outro modo passaria em silêncio.

**A verificação passou a ser um comando, não uma impressão de editor:**
`npm run typecheck` (`tsc -p tsconfig.check.json`), com o `typescript` fixado
como dependência de desenvolvimento. Dá **zero diagnósticos**.

`astro.config.mjs` é o único ficheiro com `// @ts-check` — foi confirmado por
pesquisa, não assumido. Ligar `checkJs` a todos os `.mjs` levantaria 96
diagnósticos nos scripts do portão e nos módulos de dados, que hoje não são
verificados; endurecê-los é trabalho à parte, e não foi feito.

### 1.13 O texto do Método

O português é **cópia final da direção**, transcrita do rascunho aprovado sem
uma palavra mudada: não foi reescrito, apertado nem alargado. A nota de
integração no topo do rascunho era instrução, não conteúdo, e não entrou.

A fidelidade foi verificada por máquina, não por leitura: 54 frases do rascunho,
54 encontradas no HTML construído, com os marcadores mascarados para a
comparação. A secção «Limites», que o rascunho acrescenta, entrou como sexta
secção.

**A minha própria prosa saiu.** A página tinha um subtítulo que eu tinha escrito
na primeira construção. Foi removido: não faz sentido texto meu ao lado de cópia
final da direção, e o primeiro parágrafo do rascunho já é a abertura certa.

**Os marcadores ficam à vista**, com o mesmo aspecto do marcador do livro-razão
— quem lê uma página e quem lê uma linha do livro-razão vê o mesmo sinal. São
cinco ocorrências, não quatro:

| onde | marcador | o que é |
| --- | --- | --- |
| Quem faz isto | `[a confirmar: forma pública do nome]` | por resolver |
| Correções | `[endereço a confirmar]` | por resolver |
| Limites | `[a confirmar: modelo de financiamento…]` | por resolver |
| Atribuição causal | `[a verificar: número exato antes de publicar]` | por resolver |
| Como se escreve | `[a verificar]` | **menção**, não pendência |

**Julgado por mim, e assinalado:** a quinta é uma menção — a frase «fica marcado
[a verificar], ou é cortado» está a nomear a convenção da casa, não a pedir
verificação. Ficou com o mesmo aspecto das outras porque é literalmente o mesmo
marcador, e mudá-la seria reescrever cópia final. A frase à volta desfaz a
ambiguidade. Se a direção preferir distingui-la, é uma linha.

**O único número do texto** é o ano das autárquicas, e passa pela porta
`data-nonledger="data-de-referencia"` — é a data da leitura, não a leitura. A
contagem de câmaras dessa frase continua **por escrever**, como estava: «uma
parte substancial». Verificado no HTML construído: não há nenhum algarismo
junto a «câmaras».

**Inglês: tradução fiel, à espera de revisão.** Mesmas seis secções, mesmos
cinco marcadores — mantidos em português, como na origem, com glosa inglesa ao
lado. A página inglesa abre com um aviso a dizer que a tradução aguarda revisão
da direção; a portuguesa não tem aviso nenhum.

**Uma afirmação do texto que o sítio não cumpria.** A secção «O livro-razão»
diz: «Os dados por trás de cada gráfico são descarregáveis.» Quando o texto foi
integrado, não eram — não havia um único ficheiro para descarregar em lado
nenhum. A frase não foi tocada, porque é cópia final, e ficou assinalado que ou
se construía a descarga, ou a frase tinha de mudar antes de publicar.
**Construiu-se a descarga — ver §1.18.**

### 1.14 O décimo trabalho entrou como uma só alteração

Foi pedido que o novo estudo, a contagem de Évora e as contagens do cabeçalho
fossem commits separados, e que o build ficasse verde em todos. **As duas coisas
não são compatíveis, e é o desenho a funcionar.**

Pôr o trabalho no arquivo sem tocar no livro-razão dá três falhas de uma vez:

```
✗ edicoes-publicadas       calculado: 13  publicado: 12
✗ estudos-evora-publicados calculado: 4   publicado: 3
✗ estudos-publicados       calculado: 10  publicado: 9
```

Um commit intermédio com o arquivo mudado e as contagens por mudar seria um
commit que não constrói. Como «verde em todos» é a garantia mais valiosa das
duas, os três pontos entraram **num commit só**. O quarto — a exclusão
registada em §1.15 — é documentação e foi separado.

Não há aqui nada a corrigir: é o efeito pretendido de amarrar as contagens ao
registo. Quem acrescenta um estudo é obrigado, pelo build, a reconciliar tudo o
que o conta.

### 1.15 «Three Seats, One Ledger» fica de fora do arquivo

No mesmo dia foi produzido um artefacto com esse título. **Foi avaliado e
deliberadamente excluído do arquivo.**

Razão: não é um estudo sobre Portugal. É um registo de método e de processo
sobre a infraestrutura de investigação com IA do próprio dono — escrita sobre
como se trabalha, não medição do país. O arquivo é o que este observatório
publica **sobre Portugal**; misturar registos internos de processo com estudos
faria o arquivo deixar de responder à pergunta a que responde.

A decisão está registada em `EXCLUIDOS`, em `src/data/studies.mjs` — ao lado do
arquivo, e não só aqui, porque é ali que quem fizer a migração vai olhar. Um
artefacto nessa lista já foi ponderado; não se volta a ponderar por se ter
esquecido a decisão. **Não é um juízo sobre o valor do documento** — é uma questão de o
arquivo ter um objecto e este documento não ser dele. Se algum dia houver um
sítio para escrita sobre método (a página `/metodo` é sobre o método deste
sítio, não um arquivo), é aí que pertence, não em `/estudos`.

### 1.16 Uma ligação para fora do domínio

Até aqui nenhuma página apontava para fora. «Os Pelouros» está publicado fora
deste sítio enquanto a migração não chega, e o endereço vive no registo do
arquivo (`artifactUrl`), não escrito à mão num gabarito.

A página de destino do estudo passou a mostrar esse endereço como ligação,
rotulada «Publicado fora deste sítio» e com o aviso de que a ligação sai do
domínio. O URL não aparece como texto — só como destino — o que também o mantém
fora do alcance do portão, que varre texto e não atributos.

**A promessa de «nenhum pedido de rede» mantém-se intacta**, e é preciso separar
as duas coisas: continua a não haver um único recurso carregado de fora (nem
tipos, nem scripts, nem imagens). Uma âncora não faz pedido nenhum até alguém
clicar. A verificação passou a distinguir as duas: **recursos externos: nenhum;
âncoras externas: duas** (a página PT e a EN do mesmo estudo).

### 1.17 O motivo de uma correção passou a existir nas duas línguas

Proposto em §1.11, **aceite pela direção e feito**: cada entrada de
`corrections[]` traz agora `reason` (português) e `reason_en` (inglês). Os dois
são **obrigatórios** — `ledger:check` falha se faltar qualquer um.

O que se decidiu, e porquê:

- **Sem recurso à outra língua.** Uma edição inglesa que mostrasse o motivo
  português por falta do inglês seria o defeito original com outra roupagem, e
  seria invisível. Não há fallback: ou o motivo está escrito nas duas línguas,
  ou o build pára antes de construir o que quer que seja.
- **O portão confere a língua da edição, não a existência do texto.** Cada
  página diz de que língua é (`<html lang>`, lido da própria página construída,
  e mapeado pela tabela de rotas). O portão compara o motivo renderizado com o
  motivo **daquela língua**. Uma página inglesa com o motivo português falha;
  uma portuguesa com o inglês também. Testado nos dois sentidos.
- **Só o motivo muda de língua.** Data, natureza, valor antigo e valor novo são
  iguais nas duas edições, porque não são prosa — são o registo.
- **As chaves de uma entrada passaram a ser uma lista fechada.** Um
  `reason-en` em vez de `reason_en` seria aceite em silêncio pelo YAML e a
  edição inglesa ficaria sem motivo; agora é campo desconhecido e falha. É a
  mesma regra que o formato das afirmações já tinha, aplicada um nível abaixo.

**As duas entradas existentes foram traduzidas**, não parafraseadas: o motivo
inglês diz o mesmo que o português, incluindo os títulos citados, que ficam
literais como em todo o lado.

**Um limite honesto:** o portão confere que o motivo renderizado é o campo certo
do livro-razão. Não confere — nem pode — que `reason_en` seja uma tradução fiel
de `reason`. Isso é revisão humana, e é da direção.

### 1.18 Os dados por trás dos gráficos passaram a ser descarregáveis

A frase do Método era, até aqui, a única promessa do texto que o código não
sustentava (§1.13). Passou a sustentar: `/dados/convergencia.csv` e
`/dados/municipios-308.csv`, ligados na camada Fundo de cada instrumento, nas
duas edições.

**Gerados, nunca copiados.** Os dois ficheiros saem das mesmas origens que
desenham os instrumentos — o livro-razão e o módulo das coordenadas — a cada
construção. Uma cópia à mão parece igual no dia em que é feita e diverge na
primeira correção; e um ficheiro de dados que discorda da página é pior do que
não haver ficheiro nenhum.

**A coluna a mais.** Foi pedida a colunagem região, valor, ano, unidade,
estudo. O ficheiro leva mais uma: `afirmacao`, com o id da linha do livro-razão.
Sem ela, quem descarrega fica com números sem porta de entrada para a
proveniência; com ela, cada linha do CSV aponta para o ficheiro YAML que a
justifica. É a mesma disciplina do selo de proveniência, em ficheiro.

**Duas formatações no mesmo par de ficheiros, de propósito:**

- o **valor de uma afirmação** vai exactamente como foi publicado, em
  formatação portuguesa (`"77,2"`), entre aspas para não colidir com a vírgula
  que separa colunas. É a prova documental, e a regra da casa é preservá-la
  (§1.6). Um CSV não é razão para reescrever um valor publicado;
- as **coordenadas** vão com ponto decimal (`396.5`), porque não são valores
  publicados: são geometria, cuja proveniência é a citação transcrita.

As duas convenções estão explicadas no cabeçalho de cada ficheiro, em
comentários `#` — que trazem também a citação da CAOP e a data de acesso, e
dizem onde está a linha do livro-razão de cada valor.

**Um quarto passo no build, e porquê não é um quarto portão.** `check:dados`
corre depois do portão de HTML. Não varre proveniência: confere que os dois
ficheiros existem, que a contagem dos municípios bate certo com **as quatro
afirmações que a publicam** (308 = 278 + 19 + 11, lido do livro-razão e não do
módulo de onde o ficheiro foi gerado), que cada linha da convergência bate certo
com a afirmação que ela própria nomeia, e que as duas edições ligam para os dois
ficheiros. Os três portões não foram tocados.

**O que esta verificação não é.** O ficheiro construído **não** é comparado com
uma segunda chamada ao gerador — isso seria uma tautologia, e passaria com o
gerador errado. É lido do `dist/` e confrontado com as origens.

**Limite honesto:** um CSV servido de `dist/` não passa pelo portão de HTML, que
só vê páginas. A garantia de que os números do ficheiro são os do livro-razão
vem inteira de `check:dados` — e essa verificação existe porque, sem ela, este
seria exactamente o sítio por onde um número sem proveniência entrava.

### 1.19 Os estudos migram para dois sítios, não um

A página de destino de um estudo deixou de ser um esboço e passou a ser uma
página do observatório: título, descrições nas duas línguas, tema, edições com
data de publicação e de última actualização, ligações às edições irmãs, o estado
da migração dito por palavras, o documento original quando existe, e uma secção
de descargas — hoje vazia, e a dizê-lo.

**O que continua a não estar lá, e é decisão e não falta de tempo:** não há
resumo, não há versão curta, não há um único número do estudo. Um resumo escrito
sem ler o estudo é conteúdo inventado; e um número do estudo só entra quando
tiver linha no livro-razão, nunca copiado do documento a olho. Enquanto assim
for, a página mantém-se fora do índice (§1.8).

**A separação que estrutura tudo:**

| | o que é | quem escreveu | algarismos |
| --- | --- | --- | --- |
| `/estudos/<slug>` | a página do observatório **sobre** o trabalho | nós, hoje | livro-razão, como qualquer página |
| `/estudos/<slug>/documento` | o **trabalho**, tal como foi publicado | o documento, no dia em que saiu | dispensados: obra citada |

#### Como um documento entra

Pousar `studies-src/<slug>/pt.html` e construir. **A pasta é a declaração** — não
há registo para actualizar nem rota para escrever. Preferiu-se isto a um campo
em `studies.mjs` por uma razão: um registo que diz que há documento e um disco
que não o tem são duas verdades diferentes sobre a mesma coisa, e mais cedo ou
mais tarde divergem. O disco é a única verdade, e o build recusa-se a aceitar
um documento que o arquivo não conheça — pasta com slug desconhecido, ficheiro
que não é `pt.html` nem `en.html`, ou edição que o trabalho não tem.

**Servido por endpoint, não por gabarito.** Um documento não pode passar por um
gabarito Astro sem risco de lhe ser tocado no `<!doctype>` ou no invólucro. O
endpoint devolve a cadeia exacta, e o que sai é o que se escreveu.

**A faixa é a única alteração.** Entra logo a seguir ao `<body>`: acima dela o
`<head>` do documento fica intacto, abaixo dela o documento fica byte a byte.
Leva a marca do observatório ligada de volta à página do estudo, a nota do que o
leitor está a ver, a linha de autoria da casa e o caminho de volta.

**Porque é escura em qualquer tema.** A faixa não segue o `prefers-color-scheme`
do leitor, ao contrário de todo o resto do sítio. O documento por baixo tem o
fundo que tiver, e uma moldura que muda de cor com o tema podia desaparecer
contra ele. Esta lê-se sempre, e diz sempre a mesma coisa: daqui para baixo, o
que está escrito não é meu. O amarelo da casa não aparece na faixa — o amarelo
marca medição, e a faixa é mobília.

**Nada é injectado no `<head>`.** Nem canónico, nem hreflang, nem `noindex`.
Foi uma escolha: «uma só alteração» significa uma, e o `<head>` de um documento
é dele. **A consequência, que fica assinalada:** os documentos não têm canónico
nem par hreflang, e não estão no sitemap. Se a direção quiser governar a
indexação destes endereços, faz-se ao nível do alojamento (`X-Robots-Tag`) e não
dentro do ficheiro — que é, aliás, como o escudo de pré-lançamento já é feito.

#### A dispensa do portão, e porque é estreita

Os algarismos do corpo de um documento **não** são varridos. A razão não é
conveniência: é que são de uma obra já publicada, que trouxe a sua própria
proveniência consigo. Varrê-los seria exigir que um documento citado se
reescrevesse para caber nas regras de quem o cita.

Em troca, esse ficheiro é conferido de uma maneira mais apertada do que qualquer
página. A dispensa só se aplica se **tudo** isto for verdade:

1. o endereço é o de um documento de estudo, pela tabela de rotas;
2. o slug é o de um trabalho do arquivo;
3. existe o ficheiro de origem em `studies-src/<slug>/<lingua>.html`;
4. **o ficheiro construído é, carácter a carácter, «origem + faixa»** — é isto
   que prova que o documento foi alojado intacto e que nada nosso entrou por
   baixo da faixa;
5. a faixa existe **uma só vez**, liga para a página deste estudo, diz o nome do
   sítio, e **não tem um único algarismo no texto**.

A regra 5 é a que fecha a porta. Sem ela, a dispensa do corpo seria um sítio
onde um número da casa podia entrar sem proveniência — bastava escrevê-lo na
faixa. Os algarismos do CSS da faixa não contam, porque são estilo e não texto,
e o portão distingue-os (o `<style>` é saltado no varrimento da faixa).

Continua a ser conferido que o documento é **auto-contido**: um `src`, um
`<link>`, um `url(...)` ou um `@import` para fora do domínio falha o build. A
promessa de «nenhum pedido de rede» não abre excepção para documentos. Âncoras
para fora continuam legítimas — um estudo cita as suas fontes.

**As páginas de estudo continuam varridas por inteiro.** Foi verificado a
falhar: dois números metidos na página de estudo dão quarenta erros (dois por
página, vinte páginas), com o documento alojado ao lado a passar.

**O que a dispensa não é.** Não é uma afirmação de que os números do documento
estão certos. Não estão no livro-razão e não vão estar: a sua proveniência é a
do próprio documento, no dia em que foi publicado. Quem quiser um número de um
estudo **na voz do observatório** tem de lhe dar uma linha no livro-razão — e aí
volta a valer a regra da casa inteira.

**Limite conhecido:** a faixa entra na primeira ocorrência de `<body`. Um
documento que trouxesse essa cadeia dentro de um comentário no `<head>`
receberia a faixa no sítio errado. Não foi resolvido porque a saída seria pior
do que o problema (analisar o documento em vez de o tocar minimamente), e
porque o portão apanha o resultado: o ficheiro deixaria de ser «origem + faixa»
na forma esperada e o build pararia.

### 1.20 Os documentos entraram, e trouxeram um contrato de determinismo

As treze edições pedidas estão alojadas — doze por este caminho e a décima
terceira pelo de §1.21. O que este ponto regista não é a entrada delas: é a
máquina que a torna reconferível por quem não estava cá.

#### O invólucro do anfitrião, derivado dos bytes

Um artefacto `claude.ai` não serve o documento do autor: serve-o embrulhado. O
molde foi derivado por medição, não por leitura de documentação, sobre **19
ficheiros descarregados, de 13 artefactos e de duas gerações do invólucro**, e
encaixa em todos sem uma excepção:

```
<!doctype html><html><head>                      27 bytes, constante
<!-- frame-runtime --> …script… <!-- /frame-runtime -->    VARIÁVEL
<meta charset=utf8>…</style></head><body>       263 bytes, constante
…o documento do autor…
</body></html>                                   14 bytes, constante
```

`scripts/normalize-study.mjs` confere as três partes constantes por igualdade de
bytes e apaga **um só intervalo contíguo**: do `<!-- frame-runtime -->` ao
`<!-- /frame-runtime -->`, inclusive. Mais nada. Se algum ficheiro não encaixar,
a função **atira** — não há corte a olho, não há caso por estudo.

**Porque não se tira também o andaime.** Duas razões, e a primeira é decisiva:
em 12 dos 13 documentos o texto do autor **não é um ficheiro HTML completo** —
começa em `<title>` e nunca abre `<body>`. Sem o andaime não sobra um documento,
sobra um fragmento: sem `<body>` onde a faixa entra, e o build pararia. A
alternativa seria escrevermos nós um andaime — HTML nosso por baixo da faixa,
que é exactamente o que §1.19 proíbe. A segunda razão é que o andaime é inerte
(dois `<meta>` e um estilo-base que o documento sobrepõe) e o runtime não é: fala
por `postMessage` com claude.ai e importa módulos de `/_runtime/…` que neste
domínio não existem. A fronteira não é estética — é entre o que o anfitrião
**injecta** e o que ele usa para **servir**.

#### Os dois resumos não têm o mesmo estatuto

Esta é a descoberta que justifica todo o resto, e foi medida, não suposta:

> **O runtime injectado muda sozinho.** Os artefactos `ec1cdb39`, `bc6cb6de` e
> `193481f2` não foram tocados pelo autor entre duas descargas — mesma versão do
> artefacto — e mesmo assim os bytes descarregados cresceram **2570 bytes cada**,
> porque o anfitrião passou de uma geração de runtime de 14 571 bytes para outra
> de 17 141, entre 10 e 12 de Agosto de 2026.

Daí a assimetria que o manifesto declara nas suas próprias palavras:

| Campo | Estatuto |
| --- | --- |
| `sha256_raw` | **Não é reproduzível.** É o registo honesto dos bytes servidos naquele instante. Uma descarga nova deve fazê-lo divergir, e isso não é um defeito. |
| `sha256_normalized` | **É o invariante.** O mesmo documento do autor dá sempre o mesmo resumo, atravesse o runtime as gerações que atravessar. É este que o portão confere. |

Um verificador independente que reconfira por descarga nova vai encontrar
`sha256_raw` diferente e `sha256_normalized` igual. Se encontrar o contrário — o
bruto igual e o normalizado diferente — é a normalização que está errada.

#### `studies-src/_raw/` fica versionado

Os bytes tal como foram descarregados ficam em `studies-src/_raw/<slug>.<lingua>.html`,
**dentro do repositório** (8,5 MB, treze ficheiros). Não foram ignorados, e a
razão é dupla: sem eles, `sha256_raw` seria uma afirmação sobre bytes que já não
existem em lado nenhum — o artefacto a montante muda; e com eles a função de
normalização pode ser **reexecutada sem rede**, o que é a única forma de o
determinismo ser conferível por quem não tem sessão em claude.ai. Uma pasta com
`_` à cabeça não é um trabalho: `todosOsDocumentos()` salta-a, e a severidade de
baixo mantém-se — uma pasta com nome de slug que não é de nenhum trabalho
continua a parar o build.

#### `check:documentos`, e as três coisas que ele apanha

Novo passo do `npm run build`, **antes** do `astro build`, porque confere a
origem e não a saída: se os bytes de `studies-src/` já não são os instalados,
não vale a pena construir por cima deles.

1. **resumo diferente** — o ficheiro em disco não é o que o manifesto declara;
2. **ficheiro órfão** — está em disco e não tem linha no manifesto;
3. **linha órfã** — está no manifesto e não está em disco.

Posto à prova a falhar, um caso de cada vez, e reposto a seguir: um byte trocado
num documento · uma linha apagada do manifesto · um ficheiro alojado sem linha.
Nos três casos o portão fecha com código 1. Confere ainda que a língua e o slug
são de uma edição que o arquivo conhece, e que o ficheiro bruto que sustenta
`sha256_raw` existe.

#### O que ficou de fora nesta passagem, e porquê

**«Évora — Economia, Investidores, Portas Abertas 2026» não entrou aqui.** Não
era uma falha do documento nem do mecanismo: a ferramenta de descarga devolveu
este artefacto — o mais pequeno dos treze — **em linha, sem escrever os bytes em
ficheiro**, ao contrário dos outros doze. Instalá-lo obrigaria a transcrever à
mão cerca de 43 KB de HTML a partir do texto da resposta, e uma transcrição é
texto escrito por nós: um carácter trocado seria uma alteração silenciosa de uma
obra publicada, que é precisamente o defeito que todo este mecanismo existe para
tornar impossível. Preferiu-se a lacuna declarada.

**Entrou a seguir, e não por transcrição** — por um caminho que também é
determinista. Ver §1.21.

#### Duas coisas para a direção decidir

**Os títulos ingleses de dois trabalhos deixaram de ser desconhecidos.** O
arquivo tem `titleUnverified: true` em «Onde está a água?» (EN) e «Água Não
Faturada» (EN), com o título português no lugar do inglês, porque inventá-lo
seria inventar conteúdo (§1.7). Os documentos agora alojados trazem-nos:

- `Onde está a água? — Portugal's water, where it comes from, and what autonomy would take`
- `Água Não Faturada — Portugal's water, what leaks and what was never measured`

Não foram escritos no arquivo. Um `<title>` de página não é necessariamente o
título de um trabalho, e mexer no arquivo é decisão editorial, não mecânica —
mas a prova está agora no repositório e a marca pode cair quando a direção
quiser.

**As páginas de estudo continuam fora do índice.** Alojar o documento não é a
migração estar feita (§1.8, §1.19): falta a página do observatório sobre cada
trabalho. Treze documentos alojados; vinte páginas do observatório por escrever.

#### Limites conhecidos deste passo

- O molde do invólucro está escrito por extenso no normalizador. Se o anfitrião
  o mudar, **o normalizador pára** — de propósito. Terá de ser derivado outra
  vez, dos bytes, e reescrito ali.
- `check:documentos` não confere `sha256_raw` contra os ficheiros de `_raw/`.
  Podia, e daria uma falsa sensação de solidez: o que provaria era que a cópia
  não mudou em disco, não que veio do artefacto. A prova disso é a descarga
  independente.
- O documento de `onde-esta-a-agua` (PT) traz, dentro do corpo, um `<!doctype>` e
  um `<html>` próprios — o autor alojou um documento completo dentro do
  artefacto. Fica assim, byte a byte: é o que foi publicado.

### 1.21 A décima terceira edição, e a diferença entre extrair e transcrever

A descarga de «Évora — Economia, Investidores, Portas Abertas 2026» devolveu o
artefacto **em linha, sem escrever ficheiro** (§1.20). Os bytes existiam — o
arranês da sessão grava as respostas das ferramentas literalmente, em JSON — mas
não existiam como ficheiro. Foram recuperados daí, por
[`scripts/extract-from-transcript.mjs`](scripts/extract-from-transcript.mjs).

**A distinção que autoriza isto, e que é a única coisa que interessa neste
ponto:** transcrever é escrever; extrair não é. Uma transcrição passa 43 KB de
HTML pela mão de quem a faz, e um carácter trocado no meio não deixa marca
nenhuma. `JSON.parse` é uma **desserialização determinista** — o mesmo registo
dá sempre os mesmos bytes, pela mesma razão que a normalização do invólucro dá
sempre o mesmo documento. A cadeia de custódia é: o anfitrião serviu → o arranês
gravou literalmente → um analisador puro devolveu. **Ninguém redigiu nada pelo
caminho**, e é por isso que este caminho é aceitável e o outro não era.

#### As cinco conferências, e a que fecha a porta

1. a descarga respondeu **200**;
2. o registo guarda a resposta **duas vezes** — no bloco `tool_result` e em
   `toolUseResult.result` — e as duas cópias têm de ser idênticas: uma testemunha
   a confirmar a outra dentro do mesmo registo (são, 43 133 caracteres cada);
3. o cabeçalho que a ferramenta antepõe existe uma só vez e é retirado **por
   posição**, não por adivinhação sobre onde acaba;
4. o que sobra começa em `<!doctype html>`;
5. **o comprimento bate certo com a contagem que o arranês registou da própria
   resposta HTTP**: `bytes: 43765`, e o extraído tem exactamente 43 765 bytes em
   UTF-8 (42 998 caracteres).

A quinta é a que fecha a porta, e vale a pena dizer porquê: esse número **não é
derivado do texto** — foi contado pela ferramenta no momento da descarga, e está
guardado num campo à parte. Se o texto tivesse sido truncado, adulterado ou mal
desescapado, não batia. Qualquer conferência que falhe é uma paragem; não há
recuperação parcial.

#### O registo, para quem quiser lá ir

| | |
| --- | --- |
| artefacto | `7f725a61-beca-4b02-ac03-046ca4eb050a`, versão `1786370144-e1eb` |
| resposta | HTTP 200, 43 765 bytes, 882 ms |
| descarregado | 2026-08-12T13:50:30Z |
| registo | linha 57 do JSONL da sessão, `tool_use_id` `toolu_01L6jFRgpRNBnSCzJwbzm5sr` |

Depois disto o documento seguiu o caminho de toda a gente: normalizado pela mesma
função (invólucro conferido, runtime de 17 141 bytes retirado — a mesma geração
dos outros doze), título conferido contra o arquivo, instalado, e com linha no
manifesto.

#### O que fica dito em voz alta, e não em rodapé

A linha do manifesto leva **`via: transcript-extraction`**, e `check:documentos`
**nomeia-a a cada construção**. Um campo enterrado num ficheiro de dados é uma
nota de rodapé; dito na saída do build, é uma coisa que quem constrói vê.

**Limite honesto, e é real.** Esta linha tem uma cadeia de custódia diferente das
outras doze. Nas outras, os bytes de `_raw/` são o ficheiro que a ferramenta
escreveu; nesta, são o que um analisador tirou do registo da sessão — e o
registo é local à máquina, não está no repositório, e não vai estar. O que
sobrevive aqui é o mesmo que sobrevive para as outras: os bytes em `_raw/`, os
dois resumos, e a possibilidade de descarregar outra vez e comparar. É por isso
que a reconferência por descarga nova é a prova que conta, e não a confiança em
qualquer registo — incluindo este.

### 1.22 Uma ferramenta para quem vier de fora conferir

`check:documentos` prova que o repositório é consistente consigo próprio. Não
prova — e não pode — que o documento alojado é o documento do artefacto. Essa
prova só existe descarregando outra vez, e só a pode fazer quem tiver acesso ao
artefacto. [`scripts/verify-fetch.mjs`](scripts/verify-fetch.mjs) é a ferramenta
dessa pessoa:

```bash
node scripts/verify-fetch.mjs <descarga.html> <slug> <lingua>
```

Normaliza a descarga com a **mesma** função que produziu o ficheiro alojado e
compara o resumo em três sítios — a descarga nova, a linha do manifesto, e os
bytes em disco. Imprime `MATCH` ou `MISMATCH`, com os resumos à vista, e sai com
0 ou 1.

**Porque compara três e não dois.** Duas comparações dizem que alguma coisa está
mal; três dizem **o quê**. É a diferença entre um alarme e um diagnóstico:

| O que concorda | O que se conclui |
| --- | --- |
| manifesto + disco, descarga não | o artefacto mudou a montante — o caso provável, e inocente — ou a normalização mudou |
| manifesto + descarga, disco não | o ficheiro alojado foi alterado (é o que `check:documentos` apanha) |
| disco + descarga, manifesto não | a linha do manifesto está desactualizada |

E há uma coisa que a ferramenta **não** faz falhar: `sha256_raw` diferente. É
impresso, marcado a amarelo, e explicado — o anfitrião muda o runtime que
injecta sem o autor tocar no documento (§1.20), e um verificador que tratasse
isso como adulteração estaria a acusar o inocente todas as semanas. Só o resumo
normalizado decide.

Posto à prova nos cinco caminhos: descarga igual · descarga com o runtime de
outra geração (`MATCH`, com o bruto a divergir e a dizer porquê) · artefacto
diferente · ficheiro alojado alterado · manifesto desactualizado. Nos três
últimos sai `MISMATCH` com o diagnóstico certo, e num sexto caso — invólucro
irreconhecível — pára antes de comparar seja o que for.


### 1.23 A auditoria de identidade, e a regra que dela saiu

A 13.08.2026 o sítio publicado foi conferido contra o estudo de identidade v2,
peça a peça: o estudo inteiro recuperado (85.352 bytes), o sítio percorrido nos
dois temas, a 1440px e a 726px, nos seis tipos de página e nas duas línguas, com
as medições feitas no DOM e não a olho. **34 divergências**, em seis classes —
sustidas (7), sancionadas (6), deriva (7), sem regra (2), por exercer (1),
defeitos (11). O registo completo está no artefacto
`claude.ai/code/artifact/63273249-fddb-4b1a-a070-88a2576b9446`.

Três achados mudaram o plano de trabalho, e ficam aqui porque o artefacto é uma
peça datada e este ficheiro é o registo:

**O selo não é uma porta.** O Método promete, nas duas línguas, que «o selo de
proveniência junto a cada número é a porta para essa linha». Na primeira página
publicada, **0 de 11** selos são ligações, **0 de 35** valores estão dentro de
uma ligação, e o livro-razão **não tem página nenhuma** — nem rota em
`routes.mjs`, nem ficheiro em `dist/`. A interacção central da publicação não
está construída, e o Método descreve-a como se estivesse. É o único defeito que
impede o lançamento, porque não é um defeito de desenho: é uma afirmação falsa
sobre o próprio sítio.

**42% do CSS não tem referência.** 643 das 1.528 linhas de `site.css` estão
debaixo de secções sem correspondência no estudo — arquivo, página de estudo,
método, 404, rodapé, registo de correções, e a grelha `.figuras`. Seis tipos de
página resolvidos um a um. Daí [`IDENTIDADE.md`](IDENTIDADE.md), que é a regra
para o sétimo, e que passa a ganhar ao estudo onde os dois discordem.

**O livro-razão está a dois terços, e a dívida está toda nos instrumentos.**
41 das 62 linhas têm proveniência completa; 21 têm um campo a `[a verificar]`.
Dessas 21, **16 são citadas** por alguma página e **5 estão em stock** — deixaram
de ser citadas quando a primeira página passou para o painel europeu. As 16
dividem-se em **nove baratas** (contagens sobre os próprios ficheiros do sítio e
a CAOP 2025, já conferidas pelo build e já documentadas no colofão do estudo —
nunca deviam ter dito «fonte por confirmar») e **sete verdadeiras**, que são
todas a mesma família: `pib-pc-*`, o PIB per capita regional em PPS que alimenta
a régua da convergência. Uma fonte, um acesso, um padrão de excerto. Exigem
voltar à fonte primária e, pela regra da casa, um verificador que não as
escreveu.

**Correcção ao que esta secção dizia primeiro.** A auditoria foi feita contra o
sítio publicado, e o sítio publicado estava **quatro commits atrás do HEAD** —
`main` estava `ahead 4` de `origin/main`, e o deploy dispara no push. A página
auditada era a das cinco medidas antigas; a página que está no repositório é a
das oito medidas do painel europeu, e **as oito têm proveniência completa**.
Dois achados caem com isso: «11 de 11 selos por confirmar na primeira página»
(no HEAD são zero) e a grelha de cinco peças em quatro colunas (no HEAD são
oito, e oito enchem). O resto da auditoria mantém-se, e isso é verificável:
esses quatro commits **não tocaram em `src/styles/` nem em `src/components/`** —
só em `figuras.mjs`, `HomeView.astro`, `strings.mjs` e no livro-razão. O selo
continua a ser um `<span>`, o livro-razão continua sem rota, e F1 continua a ser
o que impede o lançamento.

**E daí um achado que a auditoria não procurava:** um sítio cuja proposta é a
frescura e a proveniência esteve quatro commits atrás do seu próprio repositório
sem que nada o dissesse. A edição no cabeçalho continuava a anunciar 12.08.2026 e
estava certa a respeito de si própria — não há nada que compare o que está no ar
com o que está em `main`. Entra no portão de lançamento.

**Duas decisões da direção**, 13.08.2026:

1. **O invólucro ganha páginas de leitura.** Os documentos ficam byte a byte na
   identidade em que foram publicados; o observatório escreve as suas próprias
   páginas por cima deles, e o documento passa a ser a fonte por baixo. A
   alternativa — o observatório como camada de índice e proveniência, e mais
   nada — foi considerada e recusada.
2. **O livro-razão é publicado antes do lançamento.** Lançar com a interacção
   central por construir obrigaria a enfraquecer a frase do Método à saída, e a
   promessa é o produto.

Daí a ordem de trabalho: a regra (feita) → páginas do livro-razão e selos
ligados → as 21 linhas → portão de identidade → limpeza dos defeitos pequenos →
**sai o `noindex`** → páginas de leitura dos dez estudos. As páginas de leitura
são a direcção, não o portão do lançamento.

### 1.24 O livro-razão passou a ter páginas, e o selo passou a ser uma porta

O defeito F1 da auditoria (§1.23) era uma afirmação falsa do sítio sobre si
próprio: o Método promete, nas duas línguas, que «o selo de proveniência junto a
cada número é a porta para essa linha», e o selo era um `<span>`, e o livro-razão
não tinha rota nem ficheiro. Está construído: **62 linhas × 2 edições = 124
páginas de linha**, mais o índice nas duas línguas, tudo da mesma construção.
Rotas `livro` e `linha` em `routes.mjs`; o slug de uma linha é o id da própria
afirmação, que o validador já obrigava a ser `minusculas-com-hifenes`.

**Disposição B, e nenhuma quarta** (IDENTIDADE.md §3): corpo a 68ch com a prova
— o excerto, a aritmética, a história das correções desta linha — e coluna de
aparelho a 300px com a ficha (fonte, documento, edição, endereço, data de acesso,
data dos dados, estudo) e o estado da proveniência, que é o que a página não
sabe. O índice usa a mesma disposição: as linhas no corpo, e à margem os dois
estados do selo, o marcador e o que o livro-razão não contém.

#### O problema que era preciso resolver antes de escrever uma linha de código

`gate:html` falha em algarismos sem proveniência, e uma página de linha é quase
só algarismos. Quatro dos cinco campos resolviam-se com o que já existia — o
valor por `<Claim/>`, as correções por `data-correcao-*`, as datas de referência
e os códigos de edição pela lista de motivos. **O excerto não.** `data-verbatim`
só conhece `src/data/verbatim.mjs`, e o portão não sabia nada do campo `excerpt`
do livro-razão.

A saída fácil era `data-nonledger="proveniencia"` no excerto. Foi recusada: o
excerto **é a prova** da afirmação, e dispensá-lo do varrimento significaria que
escrever ali uma paráfrase plausível passava no build. O portão ficaria mais
fraco exactamente na página que existe para o tornar credível.

**O que se fez, e é mais do que foi pedido:** em vez de estender `data-verbatim`
a um segundo registo, criou-se `data-linha-*` (origem 6, §2.2) e passaram a ser
conferidos **todos** os campos da linha, não só o excerto — unidade, fonte,
documento, edição, endereço, datas, aritmética, expressão de verificação, lista
de origens, estudo e id. O excerto fica conferido carácter a carácter contra o
campo `excerpt`, que era o pedido; e os outros doze campos deixaram de precisar
de dispensa nenhuma. A lista de motivos de `allowlist.yml` **não cresceu** com
esta secção do sítio, o que era o sinal de alarme a evitar. O molde já existia:
é o que `data-correcao-*` faz ao campo `corrections`, um nível abaixo.

O portão foi visto a fechar em **dezassete estragos**, um de cada vez, sobre o
`dist/` construído: excerto com um algarismo trocado; excerto reescrito com uma
paráfrase plausível; data de acesso adulterada; campo inventado; campo que a
linha não tem (um excerto numa linha derivada); aritmética portuguesa na edição
inglesa; lista `derived_from` com uma linha a mais; `noindex` tirado de uma linha
incompleta; `noindex` posto numa linha completa; título escrito à mão; página de
uma linha em falta; selo a apontar para uma linha que não existe; um espaço do
livro-razão que a página não mostra; um campo de linha citado numa página que não
é do livro-razão; uma página de linha a mostrar o campo de outra linha; a ligação
da fonte a apontar para sítio diferente do endereço escrito; `og:title` adulterado.

#### Os cinco últimos vieram de uma auditoria, e quatro eram buracos a sério

A máquina de conferir foi auditada por um modelo de outra família (Fable, agente
sem contexto: só o artefacto e as perguntas — o gatilho (b) da política de
encaminhamento, «desenhar máquina de conferir»). Encontrou cinco coisas, e
nenhuma delas se via de dentro:

1. **A comparação «carácter a carácter» inventava espaços.** `textoDe()` juntava
   os nós de texto com um espaço — o que é necessário no varrimento do corpo,
   para «UE-27» seguido de «PIB» não colar num token só. Numa comparação de
   transcrição, isso significava que `12<i>340</i>` — que o leitor vê como
   **12340** — comparava igual a **12 340** no livro-razão. A fronteira entre
   elementos valia um espaço, e o agrupamento dos milhares deixava de ter de
   bater certo. Passou a haver duas junções: com espaço para varrer, sem espaço
   para comparar. A correcção alcança também `data-verbatim` e o registo de
   correções, onde o mesmo buraco existia desde o início.
2. **A marca `data-linha-*` funcionava em qualquer página.** A regra estava
   escrita no cabeçalho do ficheiro — «na página dessa linha» — e não estava
   imposta. Qualquer página podia citar qualquer campo de qualquer linha: uma
   segunda porta para pôr texto do livro-razão em prosa corrente, a contornar o
   registo de citações e a regra de que um valor entra por `<Claim/>`. Agora a
   marca só vale nas páginas do livro-razão, e numa página de linha só para a
   sua própria linha.
3. **`campo="study"` era uma tautologia.** A linha guarda o **id** do estudo; a
   página mostra o **título**, que vem de `src/data/studies.mjs` — e o portão
   comparava-o chamando a mesma função que a página tinha chamado. Confirmava a
   função, não o livro-razão, e parecia estar a fazer trabalho porque os títulos
   trazem anos. O campo saiu da tabela; o título é o que sempre foi, uma citação,
   com motivo declarado no `allowlist.yml` desde o primeiro dia.
4. **O destino da ligação da fonte não era conferido.** O texto do endereço era
   comparado; o `href` não. Uma ligação rotulada com o endereço da fonte e a
   apontar para outro sítio passava. O portão não varre atributos — mas aqui o
   atributo **é** a afirmação, e é a única excepção que se abre a essa regra.
5. **O aviso das afirmações não citadas continuava a ser apagado**, por outro
   caminho: a exclusão das páginas do livro-razão tinha sido feita no laço do
   `data-claim` e não no das correções, e a página de uma linha com correções
   marcava a sua própria afirmação como citada.

Duas correcções menores da mesma auditoria: `og:title` e `og:description` de uma
página de linha passaram a ser conferidos como o título e a descrição (batiam
certo «por construção», que é uma garantia que ninguém tinha verificado); e
`validateLedger` contava a dívida de proveniência por uma lista própria, sem
`reference_date` — passou a contar pela mesma função que decide o selo, o
`noindex` e o sitemap, na mesma altura em que se escreveu que havia uma só
definição. **`reference_date` passou também a ser obrigatório numa linha não
derivada:** omiti-lo — não pô-lo a `[a verificar]`, omiti-lo — fazia a linha
contar como proveniência completa e ser publicada como registo citável sem data
dos dados. Nenhuma linha estava nesse estado; a porta ficou fechada na mesma.

#### `derivation_en`: a aritmética passou a existir nas duas línguas

A página publica a aritmética das linhas calculadas, e a aritmética é prosa da
casa. §1.17 já tinha decidido isto para o motivo de uma correção, e a regra
aplica-se sem alteração: os dois campos são obrigatórios, não há recurso à outra
língua, e o portão confere o da língua da edição. **18 linhas** ganharam
`derivation_en`, traduzido e não parafraseado, com os títulos citados literais.

**Um campo ficou por resolver, e diz-se qual: `unit`.** «% do PIB» aparece em
português na edição inglesa, tal como o valor aparece com vírgula decimal
(§1.6). É a mesma dívida e resolve-se na mesma altura — é uma cadeia curta, do
lado do rótulo, e não vale um campo novo antes da localização de exibição.

#### `note` não é publicada

O formato tem um campo `note` e ele **não entra na página**. Duas razões, e
qualquer uma bastava: existe numa só língua, e §1.17 não deixa mostrar prosa
portuguesa na edição inglesa; e o que lá está mistura detalhe de proveniência
com recado interno («preencher a partir das fontes do próprio estudo antes de
qualquer republicação»), que é escrito para quem trabalha na linha e não para
quem a lê. Publicar as duas coisas juntas seria publicar instruções nossas como
se fossem editorial. O que o leitor precisa das notas — que campos faltam — a
página diz por estrutura, campo a campo.

#### Uma linha incompleta não se oferece ao índice

Uma página de linha leva `noindex` **se e só se** a proveniência estiver
incompleta, e sai do sitemap pela mesma condição. Hoje: **41 linhas indexáveis,
21 fora**. Não é preferência de gabarito — é lido do livro-razão em três sítios
pela mesma função (`provenienciaIncompleta`), e o portão confere as duas
direcções: uma linha incompleta sem `noindex` falha, e uma linha completa com
`noindex` também. Uma linha volta ao índice sozinha no dia em que o campo for
preenchido.

O raciocínio é o do stub de estudo (§1.8): não se convida um motor de busca a
indexar uma página que diz, ela própria, que ainda não sabe. Uma linha
incompleta continua a existir, a ter endereço e a ser a porta do seu selo — só
não se oferece como registo citável.

#### Duas definições de «incompleta» que discordavam

`provenienciaIncompleta` estava escrita duas vezes: dentro de
`Provenance.astro` e dentro de `check-ledger.mjs`. Discordavam numa linha —
`municipios-portugal-caop-2025`, que deriva de três contagens **e** traz fonte
própria com o excerto por confirmar: mostrava selo cheio na página e aparecia na
dívida do relatório. Passou a haver uma só definição, em `ledger.mjs`, com a
distinção que a versão do componente não fazia: `null` numa linha derivada não é
buraco (a proveniência é a das origens, §1.3), `[a verificar]` é buraco esteja
onde estiver. Consequência visível: **esse selo passou a aparecer a tracejado na
primeira página**, que é o que sempre esteve escrito na linha.

#### O aviso das afirmações não citadas ia desaparecer sem ninguém dar por isso

O portão avisa quando uma afirmação não é citada por nenhuma página — é o que
mede quanto do livro-razão está mesmo em uso (24 das 32 linhas do quadro
institucional, à data da auditoria). Publicar o livro-razão apagava esse aviso
para sempre: toda a linha passa a ser citada pela sua própria página e pelo
índice. Agora as citações **nas páginas do próprio livro-razão não contam** para
esse aviso. Continua a dizer o que dizia: hoje, 33 de 62 citadas fora do
livro-razão, 29 por citar.

#### O resto do que mudou

- **O selo é uma âncora, e o marcador é um só.** A etiqueta dizia «fonte por
  confirmar» — uma das quatro formulações que IDENTIDADE.md §6 mandou reduzir a
  uma. Passou a mostrar `[a verificar]`, o mesmo marcador que a linha mostra no
  campo em falta, com a mesma classe `.marcador`. `.tbv` foi retirada.
- **Os dois estados do selo passaram a existir na mesma página** (§5.2), no
  índice: os grupos são por estado, e a coluna do aparelho mostra os dois
  quadrados lado a lado, explicados.
- **`Livro-razão` entrou na navegação** e no rodapé. Uma secção publicada que só
  se alcança por um selo não está publicada.
- **O Método ganhou uma ligação para o índice**, na coluna do rótulo da secção
  «O livro-razão» — fora da cópia da direção, que se transcreve sem alterações.
- **O endereço da fonte passou a aparecer como texto**, e não só como destino da
  ligação. §1.16 tinha-o deixado fora do alcance do portão de propósito; aqui é o
  contrário — está no texto e é conferido carácter a carácter, porque uma página
  de proveniência que esconde o endereço que diz ter não serve para nada.
- **Uma invariante nova no portão:** se o livro-razão tem N linhas, o `dist/` tem
  de ter N×2 páginas de linha e 2 índices. Um selo que aponte para uma página que
  não foi construída é uma porta que não abre, e é melhor falhar a construção.
- **Outra:** a língua declarada em `<html lang>` tem de ser a do endereço. É a
  língua da página que decide que motivo e que aritmética são conferidos; uma
  edição inglesa construída com as palavras portuguesas passava despercebida.

**O que isto não fecha.** As 21 linhas com campos por confirmar continuam por
confirmar — é o passo seguinte, e sete delas (a família `pib-pc-*`) exigem voltar
à fonte primária com um verificador que não as escreveu. E `gate:identidade`
(IDENTIDADE.md §8) continua por construir: a regra «todo o `.src-chip` é uma
âncora» está cumprida hoje — 152 selos, 152 âncoras, 0 ligações internas
quebradas em 2.563 — mas ainda não está imposta por máquina.

### 1.25 O escudo saiu: o sítio passou a poder ser indexado

**Decisão da direção, 13.08.2026.** O `X-Robots-Tag: noindex` que cobria todos os
endereços desde o primeiro dia foi retirado do domínio canónico. Foi tomada
antes das últimas etapas do plano de lançamento — as 21 linhas com dívida de
proveniência, o `gate:identidade`, os defeitos pequenos — e o raciocínio fica
escrito, porque é o contrário da ordem que estava planeada:

- **o que não está pronto exclui-se sozinho.** As 21 linhas incompletas levam
  `noindex` e ficam fora do sitemap por leitura do próprio livro-razão (§1.24);
  as páginas de estudo por escrever levam `noindex` desde §1.8. Das 166 páginas
  construídas, **62 não se oferecem ao índice e 104 oferecem-se**, das quais 90
  estão no sitemap;
- **o que falta é de aparência, não de honestidade** — defeitos de desenho e o
  instrumento do mapa sem selos. Nada do que fica indexado é falso;
- **a indexação demora a começar e é refeita.** Um motor de busca revisita; nada
  do que for indexado hoje fica preso errado amanhã. O escudo custava tempo que
  não se recupera.

**O alias `*.vercel.app` mantém o escudo.** É a mesma página no mesmo servidor,
e sem isso passava a concorrer com o domínio nos motores de busca. O `canonical`
de cada página já apontava para o domínio acentuado; o cabeçalho fecha a porta em
vez de a deixar entreaberta com um sinal.

**Os 13 documentos de estudo ficam indexáveis e fora do sitemap.** São obra já
publicada, alojada aqui intacta: quem os encontrar encontra o estudo, que é o
que existe para ser lido. Quando as páginas de leitura forem escritas, passam
elas a ser o endereço canónico e o documento passa a apontar-lhes.

---

## 2. Como funciona o portão, e o que ele não vê

### 2.1 Os três portões

| Portão | Quando | O que apanha |
| --- | --- | --- |
| `ledger:check` | antes do build | campos em falta, ids partidos, estudos desconhecidos, aritmética que não bate certo |
| `astro build` | durante | `<Claim id="…">` com um id que não existe — `getClaim()` atira e o build pára |
| `gate:html` | depois do build | algarismos, no HTML construído, sem proveniência declarada |

São os três que governam os algarismos. O `npm run build` corre hoje mais dois,
que não são sobre algarismos e por isso não estão na tabela: `check:documentos`
antes do build (§1.20) e `check:dados` depois (§1.18).

### 2.2 As seis origens legítimas de um algarismo numa página

1. `data-claim="<id>"` — veio do livro-razão. O portão confere que os algarismos
   renderizados são os do valor publicado. `<Claim/>` põe esta marca sozinho.
2. `data-verbatim="<chave>"` — citação transcrita. O portão exige que o texto
   renderizado seja **igual, carácter a carácter** (espaços normalizados), ao
   registado em `src/data/verbatim.mjs`. Não é um passe livre: é uma verificação
   de transcrição.
3. `data-nonledger="<motivo>"` — contexto estrutural. O motivo tem de constar de
   `ledger/allowlist.yml`, onde cada um se justifica por escrito.
4. Um token em `ledger/allowlist.yml` — nomes próprios com algarismos
   (`UE-27`, `PT2030`).

5. `data-correcao-*` — uma entrada do registo de correções. Data, **natureza**,
   valor antigo, valor novo, motivo e id são **todos** conferidos contra o campo
   `corrections` da afirmação. A natureza aceita o identificador ou um dos seus
   rótulos traduzidos, e mais nada: uma entrada rotulada «atualização» com
   `kind: correcao` no livro-razão falha o build. O motivo é prosa livre e pode citar números («o valor 4 vinha
   do colofão…»), por isso é comparado por igualdade de texto, não dispensado:
   reescrever a história de uma correção falha o build. O motivo é conferido na
   **língua da edição** — `reason` na página portuguesa, `reason_en` na inglesa
   (§1.17).

6. `data-linha-*` — um campo de uma linha do livro-razão, na página dessa linha.
   `data-linha-claim` diz a afirmação e `data-linha-campo` diz o campo; o portão
   compara o texto renderizado com esse campo da afirmação, **carácter a
   carácter** (espaços normalizados). Vale para `unit`, `source`,
   `document.title`, `document.edition`, `source_url`, `access_date`,
   `reference_date`, `excerpt`, `derivation`, `derived_from`, `check`, `study` e
   `id` — e para mais nada: um campo desconhecido falha o build, e `value` está
   fora de propósito, porque um valor entra por `<Claim/>` e por mais nenhum
   sítio. `derivation` resolve-se na língua da edição, como o motivo de uma
   correção. **A marca só vale nas páginas do livro-razão** — no índice, ou na
   página daquela linha, e aí só para a sua própria linha; noutro sítio qualquer
   seria uma segunda porta para pôr texto do livro-razão em prosa corrente. É a
   mesma disciplina da origem 5, aplicada um nível acima: no registo de correções
   o portão confere o campo `corrections` da afirmação; aqui confere a afirmação
   inteira. **Não é uma dispensa** — é a única origem, além da 2, que compara
   texto em vez de o deixar passar.

   O **título do estudo** não entra por aqui, e a razão importa: a linha guarda
   o id do estudo, não o título. Comparar o título renderizado com
   `studyLabel(...)` seria o portão a conferir uma função contra ela própria. O
   título é uma citação e vai marcado como tal (`titulo-de-estudo`, origem 3).

As ilhas de dados `<script type="application/json" data-ledger-json>` têm regra
própria: cada número precisa de um irmão `<x>_claim`, e é conferido contra o
livro-razão; `<x>_texto` tem de ser igual ao `value` publicado; `<x>_ref` igual
ao `reference_date`. A geometria do instrumento vive num ramo `estrutura`,
dispensado mediante um `estrutura_motivo` declarado.

### 2.3 O que o portão NÃO apanha — limites honestos

1. **Só vê texto.** Números dentro de `<script>` e `<style>` não são varridos.
   A excepção são as ilhas `data-ledger-json`, conferidas valor a valor. Um
   número escrito à mão dentro de um `<script>` normal passa.
2. **Não vê atributos.** `title`, `alt`, `aria-label` e conteúdo gerado por CSS
   (`content:`) não são varridos.
3. **`data-nonledger` é confiança.** O portão confere que o motivo é um dos
   declarados; **não** confere que o número lá dentro seja mesmo estrutural.
   Quem escreve o gabarito pode marcar uma medição como «data de edição» e
   passa. É por isso que a lista de motivos é curta, cada um se justifica por
   escrito, e o crescimento dessa lista deve ser tratado como sinal de alarme.
4. **Números por extenso passam.** «vinte e seis por cento» não tem algarismos.
5. **Só compara a sequência de algarismos.** `22,8` e `22.8` são
   indistinguíveis para o portão — ele apanha um valor trocado, não uma
   formatação trocada.
6. **Só varre `dist/`.** Um número num ficheiro de `public/` servido tal como
   está não é varrido.
7. **No `<head>`** só são varridos `<title>` e `<meta name="description">`, e as
   cadeias estruturais toleradas são as calculadas do registo (títulos de
   estudos, nome do sítio, data de edição), não uma lista escrita à mão.
8. **O `<head>` de uma página de linha é conferido por reprodução.** O portão
   recompõe o título e a descrição a partir do livro-razão com as **mesmas**
   funções que a página usou (`src/lib/livro.mjs`). Isso apanha um cabeçalho
   escrito à mão, um cabeçalho da linha errada e um cabeçalho da língua errada;
   não pode apanhar uma frase mal composta, porque a composição é a mesma dos
   dois lados. A alternativa — a mesma frase escrita em dois sítios — divergiria
   na primeira alteração e daria uma garantia falsa, que é pior.
9. **`data-linha-*` confere a transcrição, não a fonte.** Que o excerto na
   página é o excerto da linha, prova-se; que o excerto da linha é o que a fonte
   diz, não — isso é a verificação contra a fonte, e é trabalho de quem não
   escreveu a linha.
10. **O portão confere o campo, não o rótulo ao lado dele.** A ficha de uma
   linha põe «Lido a» ao lado de `access_date` porque o gabarito assim o
   escreveu; trocar os rótulos entre dois campos conferidos passa. O que está
   conferido é que cada cadeia é o campo que **declara** ser.
11. **Atributos continuam fora do varrimento, com uma excepção declarada:** o
   `href` da âncora que embrulha o endereço da fonte. Abriu-se porque aí o
   atributo é a afirmação — uma ligação rotulada com o endereço da fonte e a
   apontar para outro sítio é uma mentira que nenhum varrimento de texto apanha.

O portão apanha o erro comum — um número que se escreveu a correr num gabarito —
e não apanha a fraude determinada. Serve para tornar o caminho honesto o mais
fácil, não para tornar o desonesto impossível.

---

## 3. Verificado nesta construção

- `npm run build` termina com código 0: 27 páginas, 30/30 afirmações citadas.
- A disciplina de correções foi posta à prova em quatro pontos, cada um a
  falhar como devia: entrada sem `kind`; `kind` inventado; contagem de
  correções fora do registo; e um gabarito a rotular uma correção como
  actualização — este último apanhado nas duas línguas.
- A amarra entre arquivo e livro-razão foi posta à prova nos dois sentidos:
  pôr o décimo trabalho sem mexer nas contagens dá três falhas; repor a
  contagem de Évora em `3` com o estudo já publicado dá `calculado: 4,
  publicado: 3`. Nos dois casos o build pára.
- Recursos carregados de fora do domínio: **nenhum**. Âncoras para fora:
  **duas**, ambas para o mesmo estudo publicado noutro sítio (§1.16).
- O portão **falha** (código 1), testado um a um e depois removido:
  id de afirmação inexistente · algarismos em prosa (`2024`, `41,7%`, `913`) ·
  valor renderizado diferente do publicado (`97` contra `82`) · citação
  transcrita adulterada · `data-nonledger` com motivo não declarado · campo
  obrigatório em falta · aritmética derivada que não bate certo (`21` contra
  `100 − 82`).
- As 27 páginas têm `<link rel="canonical">`, todas em
  `https://xn--oestadodopas-2fb.pt/…`; nenhuma fora do domínio canónico.
- Pares hreflang PT↔EN mais `x-default` nas páginas emparelhadas, no HTML e no
  sitemap, gerados da mesma tabela de rotas.
- **Nenhum pedido externo:** o único anfitrião que aparece em qualquer atributo
  `src`/`href` é o próprio domínio canónico. Tipos são pilhas de sistema.
- O padrão de tema de três estados está no CSS construído, com o
  `:root:not([data-theme=light])` a proteger o ramo do sistema.
- `color: var(--yellow)` não existe no CSS construído. O amarelo aparece só como
  `background`, `border-color` e `fill`.
- `/`, `/en/`, `/metodo`, `/en/method`, `/estudos`, `/en/studies`,
  `/estudos/<slug>`, `/robots.txt` e `/sitemap-index.xml` devolvem 200 no
  servidor de pré-visualização; um endereço inexistente devolve 404.
- As duas edições da primeira página trazem os valores semeados com a
  formatação publicada: `82` · `129` · `55` · `89` · `88` · `77,2` · `78,3` ·
  `26,5%` · `1` de `211` · `−34 100` · `239` · `308` = `278` + `19` + `11`.
- A contagem 278/19/11/308 foi **reproduzida a partir das coordenadas**, não
  copiada: `contagens()` conta os 308 registos por região e dá o mesmo que o
  livro-razão.
- Os dados descarregáveis foram postos à prova a falhar, um a um e depois
  repostos: uma linha a menos no CSV construído · um valor trocado · uma edição
  com a ligação apontada a um ficheiro que não existe · um ficheiro apagado.
  Nos quatro casos, `check:dados` fecha com código 1.
- O motivo de uma correção foi posto à prova nas duas línguas: entrada sem
  `reason_en` e chave `reason-en` mal escrita param o `ledger:check`; a edição
  inglesa a renderizar o motivo português fecha o portão de HTML (§1.17).
- **O mecanismo dos documentos de estudo foi verificado com um documento
  sintético, nas duas línguas, e o documento foi removido no fim.** Construiu
  em `/estudos/<slug>/documento` e `/en/studies/<slug>/document`; a única
  diferença entre o ficheiro de origem e o construído é uma linha — a faixa,
  logo a seguir ao `<body>`. Os dois endereços devolvem `200 text/html` no
  servidor de pré-visualização, e os dois CSV devolvem `200 text/csv`.
- O mecanismo foi posto à prova a falhar, um caso de cada vez: documento
  adulterado depois de construído · algarismo no texto da faixa · pasta com um
  slug que não é de nenhum trabalho · edição inglesa num trabalho que não a tem
  · nome de ficheiro que não é uma edição · documento a carregar recursos de
  fora do domínio · documento construído sem ficheiro de origem. Nos sete casos,
  o build pára.
- **A dispensa não afrouxou o varrimento das páginas:** com o documento
  sintético alojado, dois números metidos na página de estudo deram quarenta
  erros — dois por página, nas vinte páginas de estudo.
- **Treze documentos reais alojados** (§1.20, §1.21): o build fecha a 40 páginas,
  com o portão de HTML a reconstruir os treze contra a origem e a encontrá-los
  iguais carácter a carácter. A única diferença entre origem e construído é a
  faixa, entre 1529 e 1593 bytes conforme a língua e o slug.
- **Os treze endereços existem no `dist/`** e devolvem `200 text/html` no
  servidor de pré-visualização — sete em `/estudos/<slug>/documento` e seis em
  `/en/studies/<slug>/document`; um endereço inexistente devolve 404.
- **O título de cada documento foi conferido contra o trabalho a que foi
  atribuído**, lido do próprio ficheiro instalado, antes de qualquer instalação.
  Nenhuma correspondência ficou por confirmar.
- **O molde do invólucro do anfitrião encaixa em 19 ficheiros de 13 artefactos**,
  incluindo dois de duas gerações diferentes do runtime — prefixo, cabeça e
  sufixo iguais byte a byte em todos.
- **`check:documentos` **falha** (código 1), testado um a um e depois reposto:
  um byte trocado num documento alojado · uma linha apagada do manifesto · um
  documento em disco sem linha no manifesto.
- **O runtime injectado muda sem o documento mudar:** três artefactos intocados
  cresceram 2570 bytes cada entre duas descargas. É a medição que separa
  `sha256_raw` de `sha256_normalized` (§1.20).
- **A invariância foi medida, não deduzida.** Montou-se o mesmo documento de
  autor com as duas gerações do runtime — a de 14 571 bytes e a de 17 141 — e
  normalizaram-se as duas. `sha256_raw` diverge (`6f610a89…` contra `38b1eea0…`);
  `sha256_normalized` é o mesmo byte a byte (`e84c4047…`, 31 142 bytes nos dois
  casos). É esta a experiência que sustenta a assimetria dos dois campos.
- **O normalizador pára em vez de improvisar**, testado em quatro invólucros
  adulterados — sem runtime · cabeça do anfitrião alterada num byte · sufixo
  alterado · runtime declarado duas vezes. Nos quatro sai com código 1 e não
  escreve nada.
- **A normalização é determinista**, conferida nos treze ficheiros brutos: duas
  execuções seguidas dão o mesmo resumo em todos.
- **A extracção do registo também é determinista** (§1.21): duas execuções dão
  ficheiros idênticos byte a byte, e o comprimento bate certo com a contagem que
  a própria ferramenta registou da resposta HTTP.

---

## 4. O que fica para o director

1. **Fechar o Método.** O texto português está publicado. Falta: resolver os
   quatro marcadores (forma pública do nome, endereço de contacto, modelo de
   financiamento, número exato das autárquicas) e rever a tradução inglesa. A
   frase «os dados por trás de cada gráfico são descarregáveis» deixou de estar
   por cumprir (§1.18).
2. **Migrar os estudos.** A metade mecânica está feita: **as treze edições estão
   alojadas**, com manifesto e portão próprio (§1.20, §1.21). Falta a outra
   metade, que é escrita e não mecânica: a página do observatório sobre cada
   trabalho — a leitura curta, os números do estudo com linha no livro-razão, a
   proveniência de cada um. É essa que levanta o `noindex`, e são vinte: dez
   trabalhos em duas línguas.
3. **Fechar a proveniência.** Vinte afirmações têm campos `[a verificar]`:
   sobretudo o organismo, o documento, o URL e o excerto das séries do PIB per
   capita, e a base de cálculo do ciclo de substituição de condutas.
4. **Datas e descrições do arquivo.** Só «Os Pelouros» tem data de publicação
   confirmada (2026-08-12) e descrição escrita pela direção. Nas outras doze
   entradas a data continua `[a verificar]` e a descrição é reformulação do
   título (§1.7). A data de **última actualização** (`updated`) está por
   confirmar nas treze — pousar o documento de um estudo não a descobre.
5. **Ligar o deploy** e o 301 de `oestadodopais.pt` para o domínio acentuado.
6. **Em fila, já aceite:** localização de exibição dos números por edição
   (§1.6) — cadeia exacta preservada no livro-razão, renderização localizada.
7. **Decidir** sobre: tradução da linha de autoria (§1.5) · botão de tema (§1.9).
