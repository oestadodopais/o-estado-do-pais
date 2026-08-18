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

### 1.26 O endereço das correções passou a existir, e é o domínio sem acento

O Método dizia, desde o primeiro dia, que quem encontrar um erro pode escrevê-lo
para `[endereço a confirmar]`. Passou a dizer **correcoes@oestadodopais.pt**, em
ligação `mailto:` e com o endereço à vista, nas duas edições.

**O canal existe mesmo**, e foi conferido pelos cabeçalhos de uma mensagem real:
entrou pelo servidor da PTServidor (`warp9.servidorpt.pt`), com reescrita SRS do
remetente, e foi entregue na caixa de destino. Não é uma promessa nova — é a
promessa antiga a passar a ser verdade.

**Publica-se o domínio SEM acento, e a razão não é estética.** Um endereço num
domínio acentuado obriga o programa de quem envia a convertê-lo para punycode
antes de enviar, e nem todos o fazem: falha em silêncio, do lado de quem
escreve, e ninguém fica a saber. Num canal cuja função é que nada se perca, isso
é o pior modo de falha possível. O domínio acentuado leva o mesmo
reencaminhamento, como rede de segurança para quem o escrever à mão; não é o que
se publica.

**Há uma caixa para escrever, e não é um formulário que envia.** Na secção das
correções há uma área de texto e um botão: o leitor escreve ali e o botão abre o
programa de correio dele com o texto já dentro, endereçado às correções. **Nada
é enviado deste sítio** — compõe-se um `mailto:` e entrega-se ao sistema.

A distinção não é técnica, é editorial. Com correio ficam **dois registos**:
quem escreveu tem a mensagem em «enviados» e pode provar que escreveu; nós temos
a data de chegada. Um formulário que envia para um servidor engole a mensagem, e
se falhar ninguém fica a saber — nem quem escreveu, nem nós. Numa publicação que
existe para dizer que nada desaparece em silêncio, essa assimetria decidiu
sozinha. E um formulário precisaria de servidor ou de terceiro para receber.

**A caixa começa escondida e é o JavaScript que a revela**, o que é deliberado:
sem JavaScript o botão não conseguiria compor nada, e um botão que não faz nada
é pior do que não haver botão. Quem não tiver JavaScript continua a ver o
endereço escrito na frase acima, que é o caminho que funciona sempre. Mesma
disciplina dos dois instrumentos da primeira página: a página está correcta sem
o script, e o script só a torna manejável.

**A promessa de «sem pedidos de rede» mantém-se**, e é preciso ser exacto: o
`/js/correcoes.js` é servido deste domínio, como o `convergencia.js` e o
`mapa.js` que a primeira página já carrega. O que a promessa diz é que nada é
carregado de fora — e continua a não ser.

**Limite honesto:** um `mailto:` não faz nada num computador sem programa de
correio configurado. É por isso que o endereço fica escrito por extenso na frase
acima, e que a caixa o diz por palavras por baixo do botão. Se se vier a saber
que isso trava gente a sério, a alternativa continua a ser um formulário **com
confirmação automática de recepção para quem escreve** — porque só assim uma
correção não pode desaparecer sem que ambos os lados saibam.

Com isto sai também **«endereço a confirmar»**, uma das quatro formulações de
incerteza que a auditoria encontrou em uso ao mesmo tempo (IDENTIDADE.md §6).
Ficam duas: `[a verificar]`, que é a boa, e `[descrição em preparação]` no
arquivo, que é dos defeitos pequenos.

---

### 1.27 A dívida de proveniência tinha impossíveis lá dentro

Vinte e uma afirmações traziam campos `[a verificar]`. Nove eram dívida a sério.
As outras doze não eram dívida nenhuma, por duas razões diferentes.

**Cinco eram linhas da casa.** `correcoes-publicadas`, `edicoes-publicadas`,
`estudos-publicados`, `estudos-evora-publicados`,
`municipios-com-estudo-aprofundado` — contagens do próprio registo, com `source`
a dizer O Estado do País. O marcador prometia uma confirmação contra um documento
externo que não existe e nunca vai existir. Custava duas coisas: inflava a lista,
e uma lista com impossíveis lá dentro é uma lista que se deixa de ler; e mantinha
as cinco páginas com `noindex`, por uma incompletude inexistente.

A correcção **não** foi um segundo marcador — o Método promete ao leitor que
`[a verificar]` é o único, e a promessa fica de pé. Foi estender a regra que já
existia para as derivadas: `null` não é buraco quando a proveniência está noutro
lado. Aqui esse outro lado é o livro-razão. A porta exige `source` com o nome da
casa **e** uma `derivation`; sem as duas, `null` continua a ser erro, para que
isto não sirva de atalho a proveniência em falta.

**Sete eram do PIB per capita**, e o interessante é que duas delas não tinham
fonte porque não podiam ter. Cinco (Portugal 82, Algarve 89, Grande Lisboa 129,
Madeira 88, Península de Setúbal 55) são o índice tal como o Eurostat o publica,
e ficaram com proveniência completa contra a fonte primária — `nama_10r_2gdp`,
com o código NUTS confirmado contra as etiquetas da própria resposta, não
inferido do valor.

As duas do Alentejo — 77,2 em 2024 e 78,3 em 2000 — **não constam de documento
nenhum**. O Eurostat publica o índice arredondado à unidade: 77 e 78. Os números
da casa são derivados, com uma casa decimal: 30 800 / 39 900 × 100 = 77,193 e
14 400 / 18 400 × 100 = 78,261. Procurar-lhes uma fonte era procurar uma coisa
que não existe. Passaram a linhas derivadas, com as quatro linhas de origem
acrescentadas ao livro-razão e a conta reavaliada em cada construção.

Para isso o `check` ganhou `round ( x , n )`: sem arredondamento na expressão, uma
linha publicada com menos casas do que a divisão produz não podia ser verificada
de todo. A alternativa seria uma tolerância na comparação, que é pior — esconderia
precisamente a classe de erro que o `check` existe para apanhar. **O arredondamento
diz-se na expressão; não se presume na comparação.**

Dívida: 21 → 9. Linhas derivadas: 10 → 12. Aritmética reavaliada no build: 14 → 16.

---

### 1.28 A bandeira que a fonte punha e o livro-razão não

As sete linhas do PIB per capita fecharam-se em §1.27 contra a fonte primária, e
passaram de selo tracejado a selo cheio. Fecharam-nas quem as escreveu. O plano
de lançamento dizia, desde 2026-08-13 de manhã, que essas sete precisavam de
**«um verificador que não as tenha escrito»** — e a promessa ficou por cumprir
dentro da própria sessão que as fechou. Antes de publicar, cumpriu-se.

**Como se verificou.** Duas extracções independentes, cegas — nenhuma soube que
valores a casa afirmava, para que nenhuma pudesse confirmar o que nunca viu — e
por vias diferentes de propósito: uma pela API JSON-stat, outra pelo ficheiro
SDMX-TSV a granel. A concordância entre duas vias é ela própria prova; a
discordância teria apontado a linha exacta.

**Os nove valores estão certos**, e com eles três coisas que podiam ter estado
erradas sem se dar por isso:

- **Os dois códigos de unidade não estão trocados.** `PPS_EU27_2020_HAB` é
  *«per inhabitant»* (valor absoluto); `PPS_HAB_EU27_2020` é *«per inhabitant in
  percentage of the EU27 (from 2020) average»* (índice). São quase anagramas um
  do outro e querem dizer coisas diferentes. Cada linha usa o seu.
- **As etiquetas NUTS batem certo** com o dicionário do próprio Eurostat.
- **A data do conjunto bate certo**: `UPDATE_DATA` a 2026-02-10, como a edição diz.

**E apanhou-se o que o portão não pode apanhar.** Todas as células portuguesas de
2024 trazem a bandeira `p` — **provisório** — e o livro-razão não registava
nenhuma. O `excerpt`, cuja função inteira é ser o que a fonte diz palavra por
palavra, dizia `2024: 82` onde a fonte diz `82 p`.

Isto é exactamente o limite 9 de §2.3, a acontecer: *o portão prova que o excerto
da página é o excerto da linha; não prova que o excerto da linha é o que a fonte
diz.* Nenhuma quantidade de portão apanhava isto. Só uma ida à fonte por outro
lado apanhava — que é o argumento da regra que já estava escrita.

**Porque é provisório, e até quando.** Segundo os metadados do próprio Eurostat
para as contas regionais (ESMS `reg_eco10`): os dados regionais chegam a **T+12
meses** e divulgam-se **entre 1 e 15 de Fevereiro** (§14.1, §8.1) — 2024 é a
primeira publicação do ano de referência. O Eurostat **reajusta os valores
regionais ao PIB nacional uma vez por ano** (§18.6), enquanto o nacional é
revisto ao longo do ano, sobretudo entre Maio e Outubro (§15.3). Os números de
2024 estão portanto presos a uma versão do PIB nacional de Fevereiro de 2026, e
serão reajustados a outra em **Fevereiro de 2027**. Não é um risco vago: tem data.

*Limite honesto:* o ESMS não documenta política de bandeira provisória para as
primeiras divulgações — §15.2 só descreve o `b` de quebra de série. A bandeira, as
datas e o reajuste anual estão verificados; que seja o calendário a desencadear o
`p` é leitura da casa, coerente com a prova mas não afirmada pelo Eurostat.

**A assimetria que fica por explicar.** O agregado UE-27 de 2024 **não** leva
bandeira, ao contrário de todas as células portuguesas do mesmo conjunto e do
mesmo ano. As duas vias confirmam-no. Nada do que se leu explica porquê, e a casa
não lhe atribui razão — fica registado como por explicar, na nota da linha.

**O que mudou nos excertos.** Seis passaram a trazer a bandeira na notação da
própria fonte (`82 p`), separada por espaço como o Eurostat a escreve. Dois
excertos da UE-27 perderam uma paráfrase: diziam `(União Europeia (27))` onde o
dicionário do Eurostat diz `European Union - 27 countries (from 2020)` — tradução
da casa dentro do único campo que promete não traduzir nada.

#### A bandeira passou a ser um campo, e a dizer-se por palavras

Um `p` no excerto é fiel e é opaco: quem não conhece as bandeiras do Eurostat lê
uma letra solta. Mas as três saídas óbvias estavam todas fechadas por
`IDENTIDADE.md` — **sem acento novo** (§2), **sem segundo marcador de incerteza**
(§6), **sem terceiro estado de selo** (§5). O que sobra é dizê-lo por palavras, e
é o que o próprio §1 já exemplifica: *«O valor de 2024 é provisório.»*

Então a linha ganhou três campos — `source_flag`, a bandeira tal como a fonte a
escreve; e `source_flag_note` / `source_flag_note_en`, a prosa da casa que a
explica, com a regra de §1.17: as duas línguas ou nenhuma. A nota aparece na
coluna do aparelho da página da linha, sob **«Estado na fonte»**, na camada Fundo
(§4) — não junto ao número, porque o selo já é a porta para aqui (§5.1).

O campo entra pela sexta origem, `data-linha-*`: é conferido carácter a carácter
contra o livro-razão, como todos os outros. A lista de excepções não cresceu.

**A regra que escrevi primeiro não conferia nada.** A primeira versão exigia que
o excerto *contivesse* a bandeira — `excerpt.includes("p")`. Passa sempre: existe
um `p` dentro de `nama_10r_2gdp`. O teste de corrupção apanhou-o à primeira
tentativa, o que é o argumento inteiro para o teste de corrupção existir: uma
conferência que nunca falha é indistinguível de nenhuma conferência, e lê-se na
mesma como diligência. Agora a bandeira confere-se **no fim** do excerto, a seguir
ao valor, que é a única posição em que quer dizer alguma coisa.

Sete corrupções deliberadas, cada uma apanhada: bandeira sem excerto que a traga;
bandeira só dentro de `nama_10r_2gdp`; bandeira sem nota; nota numa só língua;
nota inglesa sem a portuguesa; página a parafrasear a nota; e nota publicada como
se fosse o excerto.

#### A precisão a mais saiu, e é a primeira errata pública

`77,2` publicava um décimo de ponto calculado sobre um numerador provisório e um
denominador que não o é. A aritmética estava certa; a precisão não. O Eurostat
publica **77**, e é isso que se passa a publicar — a linha deixa de ser derivada e
passa a citar a fonte directamente, como as outras cinco do mesmo índice. O mesmo
para **78,3 → 78** em 2000.

Duas entradas `correcao`, e são as primeiras do sítio depois da de origem: o
registo passa de 1 para 3. As duas linhas de distância seguem por arrastamento
(23 e 22) e **não levam entrada própria** — a regra já estava escrita em
`ledger/README.md`: recontagens derivadas que o build reavalia não se registam em
separado, ou abafavam as correções, que é o que o registo existe para mostrar.

Foi o portão a apanhar o arrastamento: `correcoes-publicadas` dizia 1 e a contagem
dava 3, e nada se construía até baterem certo.

Com isto, `round ( x , n )` — acrescentado ontem em §1.27 para sustentar
exactamente a casa decimal que hoje sai — fica sem nenhuma linha a usá-lo. Não se
remove: fica registado que ficou por usar, e que a justificação que o trouxe durou
um dia. Linhas derivadas: 12 → 10. Aritmética reavaliada no build: 16 → 14.

**O que fica para a direcção:** as quatro linhas de PPS por habitante que serviam
de origem à derivação retirada continuam no livro-razão, agora sem nenhuma página
a citá-las. São afirmações válidas com proveniência completa; a decisão de as
manter, citar ou retirar é editorial, não mecânica.

**O que isto ensina sobre o método.** É a primeira vez que a regra de revisão por
outra família apanha um **valor**, e não uma peça de maquinaria (§1.24 apanhou o
portão). E apanhou-o no sítio onde o sistema é estruturalmente cego: a fronteira
entre o que a casa transcreve e o que a fonte diz. A conclusão não é apertar o
portão — é que esta fronteira **só** se atravessa com uma ida à fonte por quem não
escreveu a linha, e que fechar dívida de proveniência sem essa ida não é fechá-la.

---

### 1.29 As quatro linhas que ficaram sem função, e o que custa retirá-las

Decisão da direcção, 2026-08-13: as quatro linhas de PIB per capita em PPS por
habitante — Alentejo e UE-27, 2000 e 2024 — saem do livro-razão. Existiam para
uma coisa só, sustentar a derivação que §1.28 retirou, e não são citadas por
nenhuma página nem por nenhuma outra linha. Conferido antes de mexer: zero
referências em `ledger/`, `src/` e `scripts/`, e nenhum `derived_from` a apontar
para elas.

**O que isto custa, dito em voz alta.** Oito endereços que existiam passam a dar
404 — quatro linhas em duas edições — e estavam no sitemap submetido ontem. Num
sítio cuja promessa é que nada desaparece em silêncio, apagar um endereço
publicado não é um acto neutro.

Fez-se assim mesmo, e por razões datadas: as páginas estiveram no ar cerca de uma
hora, o domínio tem dias e o Google ainda mal o rastreou, e nada em lado nenhum
lhes apontava. Não se puseram redireccionamentos: encaminhar oito endereços que
nunca foram ligados seria maquinaria a fingir que houve leitores. **Se alguma vez
se retirar uma linha que tenha estado no ar tempo a sério, a decisão não é esta** —
é redireccionar, ou deixar a página com o registo do que lá esteve.

Os valores não se perdem: `30 800`, `39 900`, `14 400` e `18 400` ficam escritos
em §1.27 e na aritmética que §1.28 retirou, que é onde um auditor da correcção os
vai procurar.

Afirmações: 66 → 62. Páginas: 174 → 166.

---

### 1.30 A conferência que faltava: o que está no ar contra o que está no repositório

Todos os portões da casa correm sobre `dist/`, antes de publicar. Provam coisas
sobre **a construção**. Nenhum deles pergunta a coisa mais simples: *o que está
publicado é esta construção?*

A 2026-08-13 a resposta foi «não» duas vezes, e das duas foi uma pessoa a reparar:

- de manhã, `main` estava **quatro commits à frente** de `origin/main` — a
  primeira página no ar ainda eram as cinco medidas antigas. Custou mais do que
  um atraso: a auditoria de identidade tinha sido feita **contra o sítio no ar**,
  ou seja contra código de quatro commits atrás, e precisou de errata (§1.23);
- à noite, outra vez, um commit por empurrar com o trabalho de §1.27 lá dentro.

O defeito não é a divergência, que é normal. É **não haver nada que a diga.** Num
sítio onde tudo o resto é conferido, o passo entre «construído» e «publicado» era
o único assente em confiança.

**Duas metades.** `stamp:version` escreve em `dist/version.json` o commit de que a
construção saiu — no Vercel do `VERCEL_GIT_COMMIT_SHA` (confirmado na
documentação: existe em build e em runtime), fora dele do git local.
`verify:deploy` lê esse ficheiro **do sítio publicado** e exige duas igualdades:
o commit no ar é `origin/main`, e o `main` local não está à frente de
`origin/main` — que é exactamente a forma que as duas falhas tiveram.

**Vai para JSON, e não para uma página.** Um SHA numa página seria um algarismo
sem linha no livro-razão, e a saída seria uma dispensa `data-nonledger` — pôr
metadado de construção dentro da disciplina que existe para medições. O portão de
HTML varre `dist/**/*.html`; um ficheiro JSON não lhe passa pela frente e a lista
de excepções não cresce.

**O carimbo nunca adivinha.** As variáveis de sistema do Vercel só existem se a
caixa «Enable access to System Environment Variables» estiver ligada nas
definições do projecto. Se não estiver, não há SHA — e na construção do Vercel
também não há `.git` de onde o tirar. Nesse caso escreve-se `commit: null` **com
o motivo à vista**, e é quem confere que falha, não o build: derrubar o deploy por
uma caixa por ticar seria autoflagelação, mas deixar passar a conferência seria
pior — um carimbo que adivinha faz passar exactamente a verificação que existe
para não passar.

**Não entra no `build`, de propósito.** O build tem de correr sem rede e sem
repositório remoto. Esta conferência precisa das duas coisas, e a pergunta que faz
só faz sentido depois de publicar. É portão de **lançamento**.

### 1.31 O motor e o publicador, e os dois campos que o material de Évora pediu

Este bloco é o primeiro em que **conteúdo real** atravessa do motor de
investigação para o sítio. Trouxe três coisas: uma regra sobre quem faz o quê,
dois campos novos no formato do livro-razão, e o décimo primeiro trabalho no
arquivo. Estão aqui juntos porque foram a mesma decisão.

#### A fronteira: o motor produz, o sítio publica

O [ResearchHub](../ResearchHub) é o **motor**: acesso às fontes, aquisição,
verificação, registo de indicadores, produção dos estudos — tudo local, tudo
dele. Este sítio **publica**.

O que atravessa a fronteira é **conteúdo estruturado, linhas de livro-razão,
recursos e um manifesto**. Nunca saída renderizada. Uma página construída no
motor e servida aqui seria este sítio a garantir uma coisa que não conferiu.

**O sítio mantém os seus portões, e isso não é duplicação.** Um produtor mais
uma conferência de aceitação independente é como se recebe trabalho de outrem;
duplicação seria dois sistemas a **originar** afirmações — e não é o caso: o
motor origina, este sítio aceita ou recusa. Cada linha ou ficheiro que
atravessa traz o resumo criptográfico da sua origem, e o lado de cá confere-o.
Hoje isso está feito para os **documentos** (o manifesto, com `origin` e
`origin_ref` ao commit); para as **linhas** fica para o passo seguinte deste
bloco, quando o tubo for construído. A regra vivia só no cofre de notas; passa
a viver nos dois repositórios — aqui e em `BRIEF.md` §13 do motor.

#### `document.locator` — onde no documento

Opcional; uma cadeia livre. Onde, dentro do documento citado, está a frase que
o `excerpt` transcreve: `"p. 108"`, `"Quadro 4, p. 108"`,
`"mapafluxoscaixa2010.pdf, p. 1"`. `null` ou ausente é o caso normal — a maior
parte das fontes é uma página só.

**Porque foi preciso.** O registo do motor guarda a localização com a citação;
o formato deste sítio não tinha onde a pôr, e o que não tem campo perde-se na
travessia. Um relatório de 400 páginas citado só por `document.title` manda o
leitor para o relatório; com `locator`, manda-o para a frase. É a diferença
entre proveniência e endereço postal.

#### `attributed_to` — a quem o valor é creditado

Opcional; uma **lista** de entidades. Vem do portão de atribuições do motor,
onde já era um campo com verificação própria. A maior parte das afirmações não
credita ninguém — uma taxa de desemprego não é «de» alguém — e por isso o campo
é opcional e não tem valor por defeito.

**Um rótulo partidário aqui é registo do que consta, não juízo nem ordenação.**
É a regra que a direção fixou para a camada de mandatos a 2026-08-15: *sem viés
não é o mesmo que sem atribuição*, e este sítio não faz tabelas classificativas
por partido — territórios que não têm nada em comum não se ordenam. A página da
linha di-lo por palavras ao lado do campo, nas duas edições.

**A rendição é determinista, e é uma só:** os elementos da lista, pela ordem em
que estão no livro-razão, separados por ` · `. Uma lista só se compara carácter
a carácter se houver uma maneira única de a escrever. O ponto médio já é o
separador da casa entre partes de uma mesma linha, não introduz pontuação nova
e não colide com as vírgulas dentro do nome de uma entidade; um nome que o
contenha é recusado pelo validador.

#### O que o portão passou a ver

Nenhum portão novo — a moratória de 2026-08-15 está de pé. Os que já existiam
aprenderam os dois campos:

- `ledger:check` aceita-os e **continua a recusar** o que não conhece. O bloco
  `document` passou a ter lista fechada de chaves (`title`, `edition`,
  `locator`), que antes não tinha nenhuma: `title` e `edition` eram exigidos e
  o resto era ignorado em silêncio. Os tipos são conferidos — `locator` cadeia
  não vazia, `attributed_to` lista não vazia de cadeias não vazias.
- `gate:html` compara os dois **carácter a carácter**, pela origem 6
  (`data-linha-campo="document.locator"` e `data-linha-campo="attributed_to"`),
  com a mesma severidade dos outros catorze campos.
- **O separador está escrito duas vezes, de propósito.** O portão tem a sua
  cópia da constante em vez de ler a do gabarito. Se lesse a do gabarito,
  confirmaria a constante e não o livro-razão — foi esse o erro que
  `campo="study"` cometia antes de sair da tabela (§1.24). Assim, trocar o
  separador pára o build.
- **`[a verificar]` num `locator` conta para a dívida** e leva a linha a
  `noindex`, como qualquer outro campo declarado por confirmar. Ausente não
  conta: não é buraco não haver página para onde apontar.

**Os campos foram vistos a falhar em doze estragos**, um de cada vez, e o
caminho honesto foi visto a passar antes e depois: `locator` com tipo errado;
chave desconhecida dentro de `document`; `attributed_to` como cadeia solta;
`attributed_to` vazio; o separador dentro de um nome de entidade; a chave de
topo mal escrita; o `locator` renderizado com uma página trocada; uma entidade
trocada na lista renderizada; o separador trocado no gabarito; um nome de campo
inventado na marca; `attributed_to` mostrado numa linha que não o tem; e o
`locator` traduzido na edição inglesa — que é transcrição, não prosa da casa.

**Uma nota honesta sobre a suíte de estragos:** não existe, e nunca existiu, um
guião no repositório. Os dezassete estragos de §1.24 e os sete de §1.28 foram
feitos à mão e revertidos; não são reexecutáveis. Estes doze foram feitos da
mesma maneira. Escrever esse guião é trabalho que fica em aberto, e é a única
forma de estas conferências resistirem a uma alteração futura.

**Nenhuma linha publicada traz hoje os dois campos.** São formato à espera do
conteúdo, que chega com o tubo. Foram exercitados numa linha de teste,
construída e revertida.

#### O décimo primeiro trabalho: «Évora — Prometido, Pago, Auditado 2026»

Duas edições, PT e EN, `subject: 'evora'`, slug
`evora-prometido-pago-auditado-2026`. É o primeiro documento do arquivo que
**nunca foi um artefacto**: foi produzido no motor e atravessou como ficheiro.

- **Os bytes não foram tocados.** Os documentos são auto-contidos — zero
  `<script>`, zero referências a recursos externos; os únicos `href` são as
  ligações às fontes citadas. O normalizador não se aplica e não correu: não
  havia invólucro para retirar.
- **A data é a do commit que os escreveu pela última vez** no motor,
  `49758b4c16b483c92fe56b51eb88e6913dd42930`, de **2026-08-04** — o commit que
  acrescentou as conclusões assinadas nas duas línguas. Os dois HTML não
  voltaram a mudar depois dele, e por isso `updated` fica a `null`. A data está
  citada em comentário no arquivo, ao lado da entrada.
- **`artifactUrl: null`**, escrito e não omitido: nunca foi publicado fora
  daqui, e o campo di-lo em vez de o deixar por dizer.
- **A descrição é a frase de abertura do próprio documento**, nas duas edições,
  sem números e sem nada acrescentado. É a segunda excepção à regra de §1.7 —
  a primeira foi «Os Pelouros» — e é melhor do que uma reformulação do título
  porque não é invenção nenhuma: é o documento a dizer o que é.

**O manifesto teve de aprender uma proveniência que não é um artefacto.**
`artifact_url` era obrigatório. Inventar um endereço de anfitrião seria
proveniência fabricada — exactamente o que este portão existe para impedir. A
regra passou a ser **uma das duas, e pelo menos uma**: `artifact_url`, ou
`origin` + `origin_ref` (o sistema de origem e o ficheiro, ao commit). Um
documento com nenhuma das duas continua a parar o build, e um com as duas
também. O portão nomeia estas linhas em voz alta a cada construção, como já
fazia com o campo `via` (§1.21).

**Os dois resumos são iguais, e é a afirmação certa.** Não houve runtime para
retirar, e por isso `bytes_runtime_removed` não aparece: os bytes brutos **são**
os bytes alojados. Onde nos artefactos `sha256_raw` é registo não reproduzível
e `sha256_normalized` é o invariante, aqui os dois são a mesma coisa — e o
manifesto di-lo.

**A amarra das contagens funcionou outra vez.** Pôr o trabalho no arquivo sem
tocar no livro-razão deu três falhas de uma vez, como em §1.14:

```
✗ edicoes-publicadas       calculado: 15  publicado: 13
✗ estudos-evora-publicados calculado: 5   publicado: 4
✗ estudos-publicados       calculado: 11  publicado: 10
```

`estudos-evora-publicados` foi de **4 para 5** com uma entrada
`kind: actualizacao` datada de 2026-08-15, nas duas línguas — o valor estava
certo e o que ele mede mudou. As outras duas contagens mudaram **sem entrada**,
pela regra de §1.11: recontagens que se seguem por arrastamento, já reavaliadas
pelo build a cada corrida, e enchê-las no registo abafaria as correções. As
datas de acesso e a edição do «Arquivo de estudos» das três linhas passaram a
2026-08-15: deixar 12.08.2026 seria dizer que a contagem de onze saiu de um
arquivo que tinha dez.

**A legenda do mapa mudou uma palavra:** «um com edição em inglês» passou a
«dois», porque o novo trabalho traz as duas edições. É prosa do gabarito e o
portão **não a apanha** — números por extenso não têm algarismos (§2.3, limite
4). Fica escrito aqui porque é um sítio onde o registo e a prosa podem divergir
sem ninguém dar por isso.

**Uma coisa para a direção decidir.** Os dois documentos abrem com uma faixa
que diz, com todas as letras, «Cópia de revisão — aguarda aprovação» /
«Review copy — awaiting sign-off». Entraram assim, byte a byte, porque a regra
da casa é que um documento alojado não se edita. As páginas de estudo levam
`noindex` e os documentos estão fora do sitemap, por isso nada disto foi
oferecido a um motor de busca — mas o endereço existe e é público. Ou a direção
aprova o documento e o motor gera uma edição sem a faixa, ou fica assim e
di-lo. **Não foi decidido aqui.**

### 1.32 O tubo: setenta linhas atravessaram, e o sítio confere-as à chegada

§1.31 escreveu a regra de fronteira e os dois campos que o material de Évora
pediu, e deixou uma frase por cumprir: «para as **linhas** fica para o passo
seguinte deste bloco, quando o tubo for construído». Está construído. Setenta
linhas do motor de investigação atravessaram para o livro-razão — o primeiro
conteúdo em escala a fazê-lo — e o livro-razão passou de **62 para 132
afirmações**.

#### Porquê um tubo, e não uma cópia

Os dois formatos não são o mesmo. O registo do motor guarda `source_url`,
`fetched_at`, um excerto que mistura localizador, citação e comentário, e uma
`attributed_to` que é uma **lista de sinónimos para um varredor** — dez nomes
numa linha sobre pelouros. O formato daqui quer `unit`, `source`,
`document.title`, `document.edition`, `access_date`, `reference_date`, e um
`excerpt` que é só a citação. Copiar linha a linha à mão seria transcrição — a
camada exacta onde, a 28 de Julho, entraram valores fabricados por baixo de uma
regra que estava viva e de uma passagem de verificação que os deixou passar.

Por isso a travessia é um programa, e o programa **recusa-se a escrever aquilo
que não consegue provar**:

| | O que é provado antes de escrever |
| --- | --- |
| 1 | cada id nomeado existe no livro-razão do motor |
| 2 | o valor exportado é o valor do motor, ou um dos seus `alternates`, canonicalizado — ou, quando o motor arredondou e nós publicamos a cadeia mais longa da fonte, essa cadeia está **textualmente** dentro do excerto do motor |
| 3 | o excerto é um pedaço textual do excerto do motor, ou vem do ficheiro de prova em bruto que o manifesto nomeia, ou é `[a verificar]` |
| 4 | cada `derived_from` resolve |
| 5 | cada `check` volta a dar o valor publicado — e, numa linha derivada, o valor da expressão tem de bater com o valor que o motor calculou por conta própria |
| 6 | `source` nomeia uma entidade que a linha do motor assume, e `attributed_to` é um subconjunto que **nunca** é o conjunto inteiro quando esse conjunto é uma lista de sinónimos |
| 7 | cada corrida de algarismos do `locator` aparece no texto da linha de origem — uma página lê-se, não se recorda |
| 8 | correr outra vez sem alterações escreve bytes idênticos |

Se qualquer uma falhar, o programa termina com código 1 e **não escreve ficheiro
nenhum**. Não há escrita parcial. O código vive em
`ResearchHub/publisher/`, com o manifesto que o alimenta e a sua própria suíte
de estragos plantados — onze, cada um apanhado, no portão de commit do motor.

#### O que atravessou

Setenta linhas: oito medidas de relance e as suas comparações, os números das
contas de 2025, a espinha dos mandatos com as duas dívidas herdadas de 2013
(**as duas**, porque o relatório de 2021 reexprimiu a de 2013 em alta e escolher
uma em silêncio seria escolher a narrativa), os pelouros por pessoa, e as
manchetes das cinco leituras. Nove são derivadas, com a aritmética escrita nas
duas línguas e reavaliada a cada build.

**O índice de dívida escreve-se sobre três linhas, e nenhuma delas é o 1,5.** A
conta é `dívida ÷ limite × 150`, com o 150 a ser ele próprio uma afirmação com
proveniência (o quadro do Anuário Financeiro). Escrever `÷ 1,5` seria pôr no
livro-razão uma constante que ninguém pode seguir até uma fonte.

**Três linhas do PRR atravessam com o excerto por confirmar**, e é o resultado
certo: o valor é uma soma sobre o registo público e não existe frase para
transcrever. A porta da *linha da casa* não serve aqui — os dados são da
Recuperar Portugal e só a soma é nossa; usá-la seria o branqueamento de
proveniência que o `ledger/README.md` avisa. Ficam a `[a verificar]`, com selo
tracejado e fora do índice, até o formato saber dizer «calculado sobre um
ficheiro de dados alojado» (§2.3, limite 12).

**Nenhum rótulo partidário atravessou.** O plano previa que o empréstimo de
saneamento levasse «Município de Évora, PCP-PEV». A regra fixada admite um
partido **só quando o estudo atribui aquela decisão àquele executivo com uma
linha citada** — e as frases do estudo 08 que fazem essa ligação estão marcadas
*(inferência)* pelo próprio estudo. Uma inferência não entra num campo que o
portão compara carácter a carácter como se fosse proveniência. O partido fica na
prosa e na estrutura da linha do tempo, onde se pode dizer de onde veio.

#### O registo, e as duas conferências

Cada linha que atravessa deixa uma entrada em `ledger/cruzamentos/evora.json`
com o resumo criptográfico da **linha de origem** e o dos **bytes escritos aqui**.
`scripts/check-cruzamento.mjs` confere-o, e está partido em dois de propósito:

- **A conferência que corre no build é local.** Sem rede e sem o motor presente.
  O construtor é remoto e o ResearchHub não existe lá; uma conferência que só
  funcionasse na máquina de quem exporta seria o produtor a assinar por si
  próprio. Confere que o ficheiro existe, que os seus bytes são ainda os que
  atravessaram, e que o `study` é um trabalho do arquivo.
- **A conferência contra a origem é `--with-origin`**, e corre à mão onde o motor
  está em disco. Compara o resumo da linha de origem com o livro-razão vivo do
  motor. **Prende a linha, não o ficheiro:** o `ledger.json` do motor traz um
  `built_at` que muda a cada reconstrução, por isso uma diferença no ficheiro é
  um aviso e uma diferença numa linha é um erro.

**Não é um portão novo.** A moratória de 2026-08-15 continua de pé: isto é o que
a própria regra de fronteira já exigia — «cada linha que atravessa traz o resumo
da sua origem, e o lado de cá confere-o». Sem ele, a frase era uma intenção.

**Uma nota sobre o resumo, encontrada a correr e não a pensar.** Os dois lados
liam a mesma linha e davam resumos diferentes: o Python escreve o flutuante
`3e7` como `30000000.0` e o `JSON.stringify` escreve `30000000`, e trinta e uma
das setenta linhas falhavam por causa de um limiar de sanidade que ninguém
publica. A forma canónica passou a ser escrita por extenso nos dois lados —
número inteiro sem ponto decimal, e todos os outros na forma curta que os dois
idiomas já produzem.

#### A regra das correcções

O resumo prende os bytes, e é isso que o torna útil: uma linha cruzada não se
corrige editando-a — o build pára. Há dois caminhos, e nenhum é silencioso:
voltar a cruzar (o valor mudou no motor), ou escrever a entrada em `corrections[]`
e correr `node scripts/check-cruzamento.mjs --accept-correction <id>`. A porta é
estreita de propósito: exige que a lista de correcções tenha **crescido** e que o
`value` publicado seja o `new_value` da correcção mais recente. Sem as duas,
recusa — de outro modo seria uma maneira de fazer passar qualquer edição por
correcção. O registo guarda o resumo antigo e o novo.

**Uma correcção continua sempre possível.** O que deixa de ser possível é uma
alteração sem rasto. Foi posto à prova nos dois sentidos: uma edição à mão pára o
build; uma correcção honesta é aceita, e a seguir é a amarra de
`correcoes-publicadas` que pára o build até a contagem das confissões ser
reposta — o que é a disciplina de §1.24 a funcionar sobre uma linha que veio de
fora.

#### Oito estragos plantados deste lado, cada um apanhado

Valor editado à mão; ficheiro de linha apagado com a entrada no registo;
`study` que não consta do arquivo (com o resumo remendado, para que só essa
conferência pudesse disparar); campo desconhecido na entrada do registo;
`--accept-correction` sem correcção nova; `--accept-correction` com uma correcção
cujo `new_value` não é o valor publicado; a correcção honesta, aceite; e uma
linha do motor alterada, que o modo local **não** vê — como deve — e o
`--with-origin` nomeia. Como em §1.31, foram feitos à mão e revertidos: o guião
continua por escrever, e continua a ser trabalho em aberto.

#### O que ficou por fazer, dito por palavras

- **Setenta linhas, e nenhuma citada por uma página.** O aviso de afirmações não
  citadas passou de 29 para 99 — exactamente as setenta novas. É o esperado
  enquanto a página do município e as páginas de leitura não existem, e é a
  medida honesta do que falta. Dez das setenta estão marcadas `pending_page` no
  manifesto: não vi onde seriam impressas, e ou o construtor de páginas as
  imprime, ou saem antes da fusão.
- **O plano contou 67 e as suas próprias tabelas somam 70.** Não foi
  acrescentada nenhuma linha fora de §3 do plano; a linha de soma do plano é que
  estava errada. Fica dito em vez de ser calada por três linhas cortadas ao
  acaso.
- **Três linhas tiveram de ser criadas no motor.** O plano dizia que
  `dgal-limite-2014/2017/2021` estavam no livro-razão do 07. Não estavam — só o
  de 2024 estava. Sem elas o índice de dívida daqueles anos não podia ser escrito
  sobre linhas com proveniência. Foram acrescentadas **no motor**, pelo seu
  próprio construtor, lidas da mesma linha da DGAL que a linha da dívida já
  citava, e o portão do motor correu por cima.

### 1.33 A cópia de revisão saiu do décimo primeiro trabalho

§1.31 fechava com uma coisa para a direcção decidir: os dois documentos de 04
abriam com «Cópia de revisão — aguarda aprovação» / «Review copy — awaiting
sign-off», e o endereço, ainda que fora do índice, é público. **Nuno assinou a
2026-08-15.**

A regra da casa é que um documento alojado não se edita. A via legítima é o
motor voltar a gerá-lo, e foi essa: `make_html.py` ganhou uma constante de
assinatura, as duas edições foram regeradas do mesmo `ledger.json`, e o diff
contra as cópias de revisão é **uma linha apagada em cada edição** — aquela
linha, e mais nada. A regra CSS `.review` fica no gabarito: retirá-la mudaria
bytes que a assinatura não autoriza a mudar.

Antes de mexer em nada, o renderizador correu sem alterações e devolveu as duas
edições byte a byte iguais às que estavam em disco. É o que torna o diff
legível: a diferença é a alteração, e não o ruído do gerador.

Aqui entraram os bytes novos, os dois resumos recalculados, o `origin_ref` das
duas linhas do manifesto a apontar para o commit que os escreveu, e o
`fetched_utc` à hora em que estes bytes foram tomados. **O que Nuno aprovou foi a
entrada no arquivo, não uma leitura linha a linha do português** — e o
`VERIFICATION.md` do motor continua a dizê-lo: essa leitura só deixa de estar em
aberto no dia em que ele ler a edição portuguesa na pré-visualização.

### 1.34 O primeiro tipo de página de município, e o que ele se recusa a dizer

Setenta linhas de Évora atravessaram para o livro-razão (§1.32) e nenhuma
página as imprimia. O aviso «esta afirmação não é citada por nenhuma página»
passou de 29 para 99, e essa diferença era a medida exacta do trabalho por
fazer. Fica em 29 outra vez: **todas as setenta linhas são impressas**, nenhuma
foi retirada do manifesto.

**A disposição é a B, e não uma quarta.** `IDENTIDADE.md` §3 dá três, e um tipo
de página novo escolhe uma. Esta escolhe **B · Corpo e aparelho** — a mesma das
páginas de linha do livro-razão, e partilha com elas as regras da grelha em
`site.css` em vez de as copiar. A coluna do aparelho não é espaço a encher: é
onde a página diz que não existe PIB municipal, que duas das oito medidas são o
município a falar de si próprio, que um ano de contas nunca foi certificado e
que ninguém publica dinheiro por pelouro. Metidas no corpo, essas quatro
ressalvas ficavam enterradas. **Não é C** — C é para uma página que *é* um
instrumento, e esta é uma leitura com um instrumento lá dentro. **Não é A** —
a coluna de rótulo de A não tem onde pôr as ressalvas.

**Nenhum acento novo** (`IDENTIDADE.md` §2). O amarelo aparece uma vez, na
barra que desenha a dívida contra o tecto legal, que é uma medição. Tudo o resto
distingue-se com fio, fundo e letra monoespaçada.

**As três camadas abrem-se na própria página** (§4):

| Camada | O que é |
| --- | --- |
| Relance | oito medidas, `.figuras` a quatro por linha, duas linhas cheias |
| Leitura breve | uma frase por medida, e a distância desenhada |
| Fundo | as contas do município, a linha do tempo das administrações, o método, as ressalvas e os cinco trabalhos |

**O estado vazio do mosaico foi desenhado, e ainda não foi exercido.** Um
mosaico sem afirmação mostra o marcador `[a verificar]` no lugar do número, diz
por palavras que nenhuma fonte central publica aquela medida para aquele
concelho, e **não leva selo** — um selo que não abrisse porta nenhuma tornaria
falsa a promessa do Método (§5.1). Évora enche os oito, por isso o estado está
escrito e não está desenhado no ecrã. Isso é uma dívida, e fica dita: exerce-se
no primeiro concelho sem execução orçamental nem prazo de pagamento publicados,
que é o caso de todos os que não tenham prestação de contas lida — as medidas 7
e 8 saem do relatório do próprio município, não de um agregador central, e essa
frase está na linha de cada uma delas.

**A linha do tempo das administrações é um instrumento**, e leva as três
camadas ela própria (§4): relance (o índice do regulador no primeiro ano
legível da série e no último), leitura breve (cinco administrações, contadas
como foram instaladas), fundo (como a linha do tempo é feita, o excesso sobre o
tecto legal, e quem responde pelo quê). Não é um quadro de sete colunas: um
quadro desses não cabe num corpo de 68ch nem num telefone. É um bloco por
mandato, com o período, quem presidiu, a lista, e os campos herdou / decidiu /
deixou / o regulador / pelouros.

**As duas dívidas de 2013 aparecem as duas.** 82 871 522,82 € como reportado
duas semanas depois da mudança de executivo, e 95 082 509,86 € na reexpressão
de um relatório posterior. Escolher uma em silêncio esconderia que a diferença
existe.

**Um campo que a fonte não estabelece diz-se; não fica em branco.** O mandato
de 2009–2013 não tem repartição de pelouros — o trabalho 09 chama-lhe «uma
linha de um mapa, não um mapa», e o presidente desse mandato e todos os outros
membros dele não foram identificados. O mandato de 2017–2021 não tem decisão
com linha própria, e a página diz que o que falta é a linha, não a decisão.

**Origem de cada algarismo** (§2.2), e não há mais nenhuma:

| Classe | Origem |
| --- | --- |
| Toda a medição | `data-claim`, por `<Claim/>` |
| Períodos de mandato, datas de instalação, anos de referência em prosa | `data-nonledger="data-de-referencia"` |
| As marcas do eixo da linha do tempo | `data-nonledger="escala-de-instrumento"` |
| `52.º` e `73/2013` | dois tokens novos em `ledger/allowlist.yml` |
| Etiquetas de selo | `data-nonledger="proveniencia"`, posto por `<Provenance/>` |

**A lista de motivos não cresceu.** Um período de mandato é o período a que os
dados daquela linha se referem, que é exactamente o que `data-de-referencia`
diz. As datas de instalação vêm impressas no trabalho 08 — «são as datas de
instalação, e não as das eleições, que marcam o início efetivo dos mandatos:
2013-10-18, 2017-10-20, 2021-10-15 e 2025-10-31». **Os tokens cresceram por
dois**, cada um justificado por escrito no próprio ficheiro: o nome de uma lei
e o número do seu artigo não são medições e não podem ser escritos sem
algarismos. É o mesmo caso de `UE-27`.

**Não há ilha de dados.** A página não tem JavaScript nenhum, por isso não há
nada do lado do cliente que precise de ler valores. A barra amarela é desenhada
no servidor a partir dos dois valores do livro-razão: se a linha for corrigida,
o desenho muda com ela.

**Os dois rótulos dentro do desenho não levam selo ao lado, e isso é a regra da
casa e não uma excepção.** Um `<a>` dentro de um SVG não é uma porta que se
veja. O selo dos dois valores desenhados está na frase logo por baixo do
desenho — que é onde o instrumento n.º 1 já o punha (`.brief` de
`InstrumentoConvergencia.astro`) — e cada um deles aparece com selo noutro
ponto da mesma página: a dívida no mosaico do relance, o limite na linha do
regulador do mandato de 2021–2025. Nenhum valor desta página existe sem porta.


**A página não publica uma data de frescura, e é decisão.** Cada linha diz em
que dia foi lida, e o selo é a porta para essa data. Uma data ao nível da página
teria de ser ou uma medição sem linha, ou um motivo `data-nonledger` novo para
uma coisa que já está registada linha a linha. A `VERIFICACAO` que a primeira
página mostra é da linha de base institucional e não destas linhas; usá-la aqui
seria dizer que estas foram reconferidas quando não foram.

**As ressalvas, e a frase de cada uma.** Nenhuma vai além do que o trabalho de
onde vem imprime. Ficheiros em `ResearchHub/content/`:

| Ressalva na página | Frase de origem |
| --- | --- |
| Não existe PIB municipal | 06 pt-PT:9 — «Não existe PIB da cidade, e nenhum é inventado aqui.» |
| Duas das oito medidas são o município a falar de si | 07 pt-PT:16 — «A maior parte deste documento é o município a relatar sobre si próprio.» |
| Um ano de contas sem assinatura de fora | 07 pt-PT:33 — «As contas de 2024 nunca foram certificadas.» |
| Duas vozes de fora, não uma | 07 pt-PT:19 — «Existem duas vozes de fora, e ambas estão aqui: a opinião assinada do auditor independente (a Certificação Legal das Contas), e a DGAL…» |
| Nenhuma fonte publica dinheiro por pelouro | 09 pt-PT:11 — «Nenhuma fonte publica dinheiro por pelouro.» · 09 pt-PT:15 — «Descrição, nunca classificações.» |
| Um partido é dono das suas decisões, não de uma curva | 08 pt-PT:23 — «Um partido é dono das suas decisões, não de uma curva.» · 08 pt-PT:1114 — «nada do que aqui foi lido fornece o contrafactual que recortaria a parte de cada executivo neles» |
| O dinheiro do plano de recuperação é atribuído pelo registo | 04 pt-PT:271 — «O endereço da responsabilização, na maior parte dos casos, não são os paços do concelho.» |
| A repartição de pelouros de 2009–2013 não foi estabelecida | 09 pt-PT:19 — «O mandato de 2009–2013 é uma linha de um mapa, não um mapa. […] O presidente desse mandato, e todos os outros membros dele, não foram identificados.» |
| O nome legal do presidente interino está por verificar | 08 pt-PT:324 — «O nome legal completo do presidente interino é uma pequena questão em aberto. […] O nome legal completo é [verify]…» |
| O que o trabalho 04 não abre | 04 pt-PT:13, :15, :17 — «A secção de auditoria lê o catálogo do Tribunal, não as suas auditorias.» · «A secção de contratos é um limite superior sobre uma janela truncada.» · «Não existe um valor da UE para um município, e este documento não o fabrica.» |

**Uma correcção ao plano.** `PLANO-municipio-evora.md` §1.3 escrevia que a série
da DGAL é «a única verificação de fora» sobre a dívida. O trabalho 07 não diz
isso: diz que existem **duas** vozes de fora, o auditor e a DGAL. A página
escreve o que o trabalho escreve. O mesmo §6.7 do plano dizia que 06 não imprime
«uma região pobre» — imprime («Évora é uma cidade relativamente próspera dentro
de uma região pobre», 06 pt-PT:20). A decisão do revisor mantém-se na mesma:
escreve-se «abaixo da média nacional», que é o que os dados dizem e é a leitura
mais estreita das duas.

**O que a página se recusa a dizer.** Não há tabela classificativa de partidos.
Não há atribuição de um índice a ninguém. Não há medida de desempenho por
pessoa. Não há contrafactual. Não há dinheiro por pelouro. Não há PIB municipal.
Cada uma destas recusas está escrita na página, na coluna do aparelho, e não só
aqui.

**A porta.** Chega-se à página pelo ponto aceso do mapa da primeira página e
pelo nome «Évora» na legenda desse instrumento — nenhum algarismo foi
acrescentado por causa disso — e das cinco páginas de leitura, pelo bloco «o
concelho de que trata». A ligação sai do registo dos municípios pela posição na
CAOP, não de um endereço escrito à mão: um ponto aceso sem página não pode dar
um caminho partido.


**Revisão cruzada de 15.08.2026, e o que ela mudou nesta página.** Um revisor de
outra família de modelos, sem contexto deste trabalho, auditou uma cópia da
construção com defeitos plantados: apanhou os sete. As suas outras conclusões
foram por isso tratadas como conclusões, e não como opiniões.

1. **Os selos passaram a estar em todas as ocorrências, e não uma por página.**
   `IDENTIDADE.md` §5.3 diz «onde aparece um valor, aparece o selo — sem
   excepção de página», e as frases da leitura breve, a legenda da distância, o
   «tecto legal» do mosaico do índice e o relance da linha do tempo tinham
   valores sem porta. `Frase.astro` ganhou a propriedade `selos`, que faz de
   cada `{ claim: … }` de uma frase um `<Claim chip>`. Fica opcional porque as
   páginas anteriores a esta data não a usam e não se reescrevem aqui; tudo o
   que este bloco constrói passa `selos`. Conferido depois da construção: **276
   valores nas doze páginas deste bloco, nenhum sem selo** — e o mesmo
   conferidor acusa vinte na primeira página, que é anterior a este bloco.
2. **Os valores desenhados dentro de um SVG levam o selo ao lado do desenho.**
   É a convenção que o instrumento n.º 1 já usa (`.brief` de
   `InstrumentoConvergencia.astro`): um `<a>` dentro de um SVG não se lê como
   porta. A barra da dívida e o fio do tecto legal têm agora a sua fila de
   selos por baixo, rotulada.
3. **A linha do regulador deixou de imprimir uma divisão falsa.** Escrevia
   «dívida € / limite € = índice %», e quem dividisse 77 961 663 por 48 206 020
   obtinha 1,617 e não 242,6 — porque o índice é essa razão vezes o tecto legal,
   e o tecto legal não estava na linha. Passou a «dívida … · limite legal … ·
   índice …», três factos lado a lado; a aritmética completa está na página da
   linha do índice, que é onde ela é conferida a cada construção.
4. **A diferença entre as duas contas da mesma dívida diz agora que está
   arredondada.** Os dois valores impressos diferem em 926,42 e a linha publica
   926. **A revisão pedia que a linha passasse a 926,42 sem arredondamento; isso
   não foi feito, e a razão é dura:** o valor dessa linha é impresso dentro do
   próprio documento do trabalho 07 («difere em €926»), que está alojado neste
   sítio, é conferido byte a byte contra a origem por `check:documentos` e não
   se toca. Mudá-lo no motor mudava o documento publicado. O que se fez foi a
   página dizer o que a linha já dizia na sua aritmética e a página calava: que
   a diferença é publicada arredondada ao euro e que os dois valores acima
   diferem em cêntimos. A alternativa honesta — desarredondar a linha — fica
   para o dia em que o documento 07 for reeditado por outra razão.
5. **A camada 2 do instrumento da linha do tempo passou a ser o que
   `IDENTIDADE.md` §4 pede: «uma frase, e a distância desenhada».** Tinha duas
   frases de atribuição, que são fundo e não leitura breve. Agora tem uma frase
   sobre a mudança medida e um desenho dos quatro índices contra o tecto legal,
   com o amarelo a marcar a medição e nenhuma cor nova. A frase diz «nos quatro
   anos que esta página publica» e não «todos os anos»: só 2014, 2017, 2021 e
   2024 estão aqui. As frases de atribuição passaram para o fundo do
   instrumento.
6. **Duas ressalvas que eram dos trabalhos apareciam como facto nu.** «não
   capta a administração pública, a maior parte da universidade e do hospital»
   é um limite que 06 escreve sobre si próprio, e «a maior parte deste
   documento é o município a relatar sobre si próprio» é a abertura de 07.
   Passam com «como o próprio trabalho adverte» / «como o próprio trabalho abre
   a dizer», nas duas edições.
7. **O «por isso» do bloco de 2021–2025 fica, porque 07 estabelece a causa.**
   A revisão pedia para não afirmar um nexo causal sem fonte. 07 escreve-o duas
   vezes: «foram rejeitadas pela própria Câmara — 2 votos a favor, 5 contra, na
   reunião de 2025-05-28 — **o que forçou** uma Declaração de Impossibilidade de
   Certificação Legal das Contas para 2024» (pt-PT:34) e «e o auditor emitiu
   **por isso** uma Declaração de Impossibilidade…» (pt-PT:374). O nexo é da
   fonte, não da página.


**Segunda revisão cruzada, 15.08.2026 — e uma refetch cega.** O mesmo revisor de
outra família voltou a passar sobre as correcções: 15 de 22 pontos resolvidos,
as duas novas armadilhas apanhadas, e — o que importa mais — **uma refetch cega
de todos os oito valores do relance**, feita contra o INE, o IEFP, a DGAL e o
sítio do município por quem não escreveu as linhas, bateu certo com o
livro-razão em todos. O que dela saiu para esta página:

8. **Duas ressalvas trocaram o quantificador pelo mecanismo.** «não capta a
   administração pública, a maior parte da universidade e do hospital» era a
   frase de 06 dita como se fosse desta página. 06 não estabelece o mecanismo
   («capta-os apenas nas partes que são empresas»), estabelece o
   quantificador — por isso a página passa a dizer primeiro o que o registo
   **é** (as contas das empresas sediadas no concelho, creditadas ao concelho
   da sede, que é o que 06 escreve) e depois cita o quantificador **como
   citação de 06**. E «a maior parte deste trabalho é o município a relatar
   sobre si próprio» passou à forma que a página pode mostrar: as medidas vêm
   da prestação de contas do município, e as duas vozes de fora são o auditor
   e o regulador — as duas estão aqui.
9. **A conclusão de 04 deixou de aparecer como facto desta página.** «O
   endereço da responsabilização, na maior parte dos casos, não são os paços do
   concelho» é a leitura assinada de 04. O que os números mostram é que a
   universidade tem **mais** dinheiro contratado do que a câmara — «mais», não
   «a maior parte». A página do município diz os números e atribui a conclusão
   ao trabalho, que é onde ela vive.
10. **As ressalvas que a própria DGAL escreve nos seus ficheiros passaram a
    estar nas linhas** (a classe de §1.28). A linha de Évora de 2017 termina,
    no ficheiro, com a nota de rodapé `a)` — e o excerto das duas linhas desse
    ano já terminava nela; ganharam `source_flag: "a)"` com a nota nas duas
    línguas. O ficheiro de 2021 rotula-se a si próprio «Dados provisórios» ao
    nível do documento e não da linha, por isso a ressalva entrou onde
    pertence: `document.edition`. Os índices derivados desses anos não mudam —
    os pais é que carregam a ressalva, e é para lá que o selo leva. A coluna do
    aparelho da página do município di-lo por palavras, nas duas edições.
    **A dívida de proveniência não mexeu: continua em 12.** Uma bandeira da
    fonte não é um campo em falta.
    Do lado do motor, `publisher/export_site_rows.py` passou a transportar
    `source_flag` / `source_flag_note` / `source_flag_note_en` do manifesto, e
    recusa-se a escrever uma bandeira que o excerto da linha de origem não
    termine — que é a mesma regra que o validador do sítio já impõe, aplicada
    antes de o ficheiro existir. Não é um portão novo: é o campo a ser provado
    como todos os outros campos deste exportador já são.

### 1.35 As páginas de leitura, e o escudo que passou a ser lido trabalho a trabalho

§1.8 pôs todas as páginas de estudo fora do índice, e escreveu que se levantava
«na migração: apagar o `filter` no `astro.config.mjs` e o `noindex={true}` em
`EstudoView.astro`. São duas linhas.» A migração não acontece de uma vez: cinco
trabalhos ganharam leitura, seis não têm nenhuma. Apagar as duas linhas
ofereceria ao índice onze páginas, seis das quais continuam a dizer que ainda
não têm nada.

**O escudo passou a ser lido de uma lista.** `src/data/leituras.mjs` diz que
trabalhos têm leitura escrita. A página lê-a para saber se leva `noindex`, o
sitemap lê-a para saber se inclui, e o portão de HTML lê-a para impor **as duas
metades**: falha quem esconde uma página que já tem conteúdo, e falha quem
oferece uma que não tem. Não é uma dispensa nem um portão a menos — é a mesma
exigência de §1.8, a deixar de ser «todas» e a passar a ser lida da mesma
origem pelos três sítios. É a disciplina que a página de uma linha já usava com
`provenienciaIncompleta`.

Hoje: **cinco** trabalhos com leitura (04, 06, 07, 08, 09 de Évora), dez páginas
indexáveis a mais, e as seis restantes na mesma. O `creativeWorkStatus` do
JSON-LD acompanha: `Published` onde há leitura, `Draft` onde não há.

**As três camadas de uma página de leitura** (`IDENTIDADE.md` §4): a medida que
faz o trabalho valer a pena, a frase do que concluiu, e o fundo com método,
ressalvas, proveniência e o documento original.

**As frases são prosa da casa e não podem ultrapassar o trabalho.** Cada uma
assenta numa frase impressa nesse trabalho, e foi cortada onde ia mais longe.
Os pares, com a frase de origem:

| Trabalho | Frase da casa | Frase de origem |
| --- | --- | --- |
| 04 | «Do dinheiro do plano de recuperação contratado no concelho, a universidade tem mais do que a câmara — 38 596 975,81 € contra 12 069 012,6 € — e, da soma aprovada para o concelho, 61,64 % está vencida contra 50,36 % paga» / EN em espelho | pt-PT:271 «O endereço da responsabilização, na maior parte dos casos, não são os paços do concelho.» · pt-PT:267 «As localizações de projeto vencidas transportam 61,64 % de tudo o que foi aprovado para o concelho.» |
| 06 | «Évora está acima da média nacional em poder de compra por habitante — 111,47 — dentro de uma região que está abaixo, em 93,86; e a sua economia empresarial está concentrada em poucas mãos: quatro empresas detêm 21,5 % do VAB do concelho, contra 2,56 % no país» / EN em espelho | pt-PT:20 «A própria cidade está **acima** da média nacional no único indicador que existe ao nível do concelho: o índice de poder de compra do INE de 2023 põe Évora em 111,5 (Portugal = 100), com a sua região em 93,9.» · pt-PT:44 «A concentração é o facto estrutural. As quatro maiores empresas detêm 21,5% de todo o VAB empresarial do concelho…» |
| 07 | «O orçamento de Évora afastou-se do dinheiro que chega, e o aperto aparece nas faturas por pagar e na fila de pagamento, não na dívida legal» / “Évora’s budget has drifted from the money that arrives, and the strain shows in unpaid invoices and the payment queue, not in the legal debt” | pt-PT:456 «O orçamento é uma previsão de esperanças; a taxa de execução é o facto.» · pt-PT:452 «O aperto aparece noutro sítio: nas faturas de fornecedores por pagar e na fila de pagamento de 137 dias.» |
| 08 | «Quinze anos de contas mostram uma dívida herdada que demorou anos a ser medida, uma década a desbastá-la, e um último mandato em que a fila de pagamento se alongou, de 22 para 137 dias» / “…and a last term in which the payment queue lengthened, from 22 to 137 days” | pt-PT:1078-1086 «Uma história, três capítulos. O registo lê-se como um arco contínuo: um município … cuja verdadeira dívida herdada ainda estava a ser descoberta anos depois … e que depois passou uma década a desbastar a montanha … No último mandato o desbaste parou e a fila voltou a alongar-se: 22 dias em 2023 e depois 137 em 2025, com pagamentos em atraso de €4 976 172.» |
| 09 | «Os pelouros de Évora ficam, em todos os mandatos que o trabalho conseguiu ler, com a lista do presidente, e as contas do município não são cortadas de maneira que permita dizer quanto gastou cada vereador» / “Évora’s portfolios sit, in every term the study could read, with the president’s own list…” | pt-PT:498 «O executivo real é mais pequeno do que o eleito.» · pt-PT:17 «Todos os pelouros ficam com o bloco que governa.» · pt-PT:11 «Nenhuma fonte publica dinheiro por pelouro.» |

**A frase aparece nas duas línguas em cada edição.** A da edição em primeiro
lugar, a outra por baixo em letra pequena e com `lang` próprio — o mesmo padrão
que as descrições dos trabalhos já usavam. Uma tradução escondida é uma
tradução que ninguém confere.

**Os quatro selos tracejados de 04, e porque estão certos.** As somas sobre o
registo público do plano de recuperação atravessaram com `excerpt:
"[a verificar]"` (§2.3, limite 12): não há frase para transcrever. A página
di-lo por palavras, nas duas línguas, ao lado das duas medidas do relance — e o
selo tracejado aparece ali, ao lado do cheio das outras páginas, que é o que
`IDENTIDADE.md` §5.2 exige de uma distinção para ela existir mesmo.

**A mesma revisão cruzada mudou três frases e duas peças de vocabulário.**

1. **A frase de 08 contradizia os números ao lado dela.** Dizia «um último
   mandato em que o desbaste parou» — e a dívida que a página do município
   mostra continua a cair nesse mandato, de 57 293 550,23 € para
   54 379 034,55 €, com o índice a passar de 141,9 % para 105,5 %. 08 usa
   «o desbaste parou» num sentido que os seus próprios números localizam noutro
   sítio: «a fila voltou a alongar-se: 22 dias em 2023 e depois 137 em 2025,
   com pagamentos em atraso de €4 976 172» (pt-PT:1085). A frase passou a
   dizer isso, com os dois prazos citados do livro-razão. Uma frase da casa não
   pode ser desmentida pelo número que está ao seu lado.
2. **A frase de 09 dizia «sempre».** A mesma página diz que o mandato de
   2009–2013 não foi estabelecido, por isso «sempre» era mais do que o trabalho
   podia. Passou a «em todos os mandatos que o trabalho conseguiu ler» / «in
   every term the study could read». E a segunda metade — «o executivo real é
   mais pequeno do que o eleito» — citava uma comparação que a página não
   mostrava; agora mostra os dois lados, cada um com a sua data: as designações
   do mandato de 2021–2025 e os lugares da câmara instalada em 2025. As duas
   datas estão à vista precisamente porque são dois factos, e não um.
3. **A frase de 07 citava uma dívida e um limite que a página não mostrava.**
   «com a dívida total ainda abaixo do limite» — os dois valores passaram a
   estar impressos no fundo dessa página, com selo.
4. **O fundo de 09 contava linhas que a página não conta.** Dizia «cerca de
   metade das suas linhas recusa» a correspondência; nenhuma dessas linhas
   atravessou para o livro-razão, e uma quantidade sem linha é exactamente o
   que este sítio recusa. Passou a dizer que o próprio trabalho identifica
   quais recusam, e que esta página não as conta.
5. **O marcador de incerteza tem uma cara só.** As datas de publicação e de
   actualização mostravam `[a verificar]` como texto simples, sem a classe
   `.marcador` (`IDENTIDADE.md` §6); passaram a tê-la. A nota de 04 dizia «o
   excerto fica por confirmar», que era uma segunda formulação para a mesma
   coisa; passou a usar o marcador. E a glosa inglesa passou a ser «(to
   verify)», que é a que as páginas de linha já usavam — uma só cara em todo o
   sítio.
6. **A nota «as descrições são reformulações do título» era falsa em dois
   trabalhos.** A de «Os Pelouros» e a de «Prometido, Pago, Auditado» são a
   frase de abertura do próprio documento, e `studies.mjs` já o dizia num
   comentário. Passou a dizê-lo no registo (`descriptionFromDocument`) e a
   página escolhe a nota certa.
7. **O título inglês de «Orçamentado, Pago, Devido» estava abreviado.** O
   documento alojado diz `<title>Évora — Budgeted, Paid, Owed 2025</title>` e o
   arquivo dizia «Budgeted, Paid, Owed 2025». Um título literal não se abrevia
   (§1.7 e o cabeçalho de `studies.mjs`); corrigido para o do documento. O `h1`
   do documento é outra frase e não é o título.

**A segunda revisão cruzada reescreveu mais três frases, pela mesma regra: uma
frase da casa só pode dizer o que a página mostra.**

8. **04** dizia «a maior parte do dinheiro público prometido a Évora é
   administrada e recebida fora da câmara». A página mostra a universidade com
   38 596 975,81 € contratados contra 12 069 012,6 € do município — isso prova
   «mais», não «a maior parte». A frase passou a dizer o que a página mostra, e
   a leitura de 04 ficou no fundo, atribuída a 04 por palavras.
9. **06** dizia «uma cidade próspera». Nem o valor acrescentado empresarial nem
   a concentração estabelecem prosperidade. A frase passou a assentar no único
   indicador que existe ao nível do concelho — o índice de poder de compra —, e
   **os dois valores desse índice passaram a estar impressos nesta página**,
   com selo: o concelho de um lado da média nacional, a sua região do outro.
10. **08** dizia «voltou a alongar-se». O alongamento anterior a que 08 se
    refere — 69 dias em 2022 — não está nesta página, por isso o «voltou a»
    pedia ao leitor que acreditasse num número que não vê. Diz agora «se
    alongou», com os dois prazos que estão à vista.

**O que continua a não estar nestas páginas.** Não há resumo do trabalho, não há
versão curta, e nenhum número entrou copiado do documento a olho: os que
aparecem têm todos linha no livro-razão. As descrições continuam como estavam
(§1.7). O documento original continua alojado ao lado, intacto.

### 1.36 Os dez defeitos que a medição da confiança encontrou, e o que se fez a cada um

`BRIEF-confianca.md` mediu o sítio no ar a 15.08.2026 e não propôs nada: contou.
Deste bloco saem só **defeitos** — coisas que já estavam erradas ou em falta. As
**decisões** que a mesma medição levanta (o redesenho da página de linha, a
voz, a agenda, as extensões de formato) não estão aqui: estão no registo do §4,
com o motivo e a fase a que pertencem.

**A régua.** `scripts/medir-defeitos.mjs` — não é um portão, não falha nada e
não entra no `npm run build`. É uma fita métrica que corre sobre `dist/` e sobre
`ledger/claims/`, para que «antes» e «depois» sejam medidos com o mesmo
instrumento. O «antes» foi obtido construindo `main` numa árvore de trabalho
separada e correndo lá a mesma régua.

| Medida | Antes (`main`, 297 páginas) | Depois (301 páginas) |
| --- | ---: | ---: |
| Páginas com porta de correcções | 0 | **301 de 301** |
| Valores da primeira página sem selo para a sua própria linha | 38 ocorrências · 16 afirmações | **0** |
| …dos quais com selo a apontar para a linha do PAI | 18 ocorrências · 8 afirmações | **0** |
| Frases de moldura distintas | 86 | **83** |
| Ocorrências de frases de moldura | 2 735 | 2 787 — das quais **301 são a porta nova**; sem ela, **2 486** |
| `[descrição em preparação]` | 7 ocorrências, 3 páginas | **0** |
| Linhas com `#page=` no endereço | 0 de 132 | **23 de 132** |
| Localizadores que nomeiam um artefacto interno | 35 | **0** |
| Páginas construídas | 312 | 316 |
| Endereços no mapa do sítio · com `lastmod` | 260 · 0 | 264 · **0 — ver F5** |

A conta das ocorrências merece uma palavra, porque **subiu**. Duas coisas a
empurram para cima e nenhuma delas é moldura no sentido de que se queixava a
medição: a porta das correcções é um bloco de prosa repetido em todas as páginas
e acrescenta **301** ocorrências sozinha; e os três rótulos de estado que a
revisão cruzada mandou repor (F4) acrescentam mais. O que saiu foram 311
ocorrências de máquinas a descrever-se a si próprias — 194 de «a construção do
sítio falha se…», 240 da caixa que declarava proveniência completa, e o resto.
É por isso que a régua imprime as duas contas, e é por isso que o alvo de «≤ 12
frases distintas» do BRIEF §6.3 continua no §4: chegar lá é decidir onde vive
cada política, e isso é a fase da voz.

---

#### 1 · A porta das correcções passou a estar em todas as páginas

**Estava em 2 páginas de 296** — a de Évora e o Método. A chegada mais provável
de quem quer contestar um número sobre si próprio é a página da linha desse
número, vinda de um motor de busca, e era precisamente aí que não havia nenhuma
maneira de o dizer (`BRIEF-confianca` §4.1, o oficial municipal).

`src/components/PortaDeCorreccoes.astro` é o texto que a página de Évora já
dizia, palavra por palavra — não foi reescrito: uma porta que muda de palavras
de página para página é outra porta. Entra pelo invólucro (`Base.astro`) em
todas as páginas; as que têm aparelho próprio põem-na lá e passam
`portaNoRodape={false}`:

| Tipo de página | Onde a porta fica |
| --- | --- |
| primeira página | no colofão «Esta página», que é o aparelho desta página |
| página de linha | na coluna do aparelho, a seguir ao estado da proveniência |
| página de leitura | no fim da coluna de blocos, antes do caminho de volta |
| página de município | na coluna do aparelho, onde já estava |
| todas as outras | antes do rodapé, com um fio a separá-la do corpo |

**Portão (novo, sobre o varrimento que já existia):** *cada página construída
tem exactamente uma porta de correcções.* Exactamente uma, e não «pelo menos
uma»: duas portas na mesma página são duas respostas para a mesma pergunta. Os
documentos de estudo estão fora — são obra citada e já saem do varrimento antes.
**Posto à prova a falhar, e reposto:** uma página sem porta (o portão fecha, «0
porta(s) de correcções») e uma página com duas («2 porta(s)»).

#### 2 · Cada valor da primeira página tem selo, e o selo abre a sua própria linha

`IDENTIDADE.md` §5.3 promete «onde aparece um valor, aparece o selo — sem
excepção de página», e a primeira página nunca cumpriu: 16 afirmações apareciam
sem selo nenhum (as contagens do cabeçalho, as quatro contagens da CAOP, as duas
de cobertura, `estudos-evora-publicados`, `pib-pc-alentejo-2000` e as distâncias),
e onde havia selo na leitura breve **ele apontava para a linha do pai**: quem
clicasse no «18» aterrava na linha do «82».

O que mudou: `Masthead`, `InstrumentoMapa`, `InstrumentoConvergencia` e
`RegistoCorrecoes` passam `chip`; a leitura breve da régua passa
`<Frase … selos>`, que já existia desde §1.34 e não estava a ser usada aqui.
Nenhum valor foi acrescentado nem retirado da página.

**Portão (novo):** a auditoria de selos que se fazia à mão passa a correr a cada
construção. Para cada `data-claim` fora das páginas do próprio livro-razão, tem
de existir uma âncora `.src-chip` cujo `href` é o caminho da linha **daquele**
id, e a procura sobe pelos antepassados e **pára ao atravessar um elemento de
secção** — é isso que dá corpo a «ao lado»: um selo na secção seguinte não é uma
porta ao pé do número. Dentro de um `<svg>` vale a mesma regra e é a mesma
procura, que é a convenção do §1.34: um `<a>` dentro de um desenho não se lê como
porta, por isso o selo vive na legenda do instrumento — o primeiro antepassado
comum. As páginas do livro-razão estão fora: a página de uma linha **é** a linha.
**Posto à prova a falhar, e reposto:** um valor do cabeçalho sem `chip` (o portão
fecha, nomeando a âncora que faltava) e a leitura breve sem `selos` (18 erros —
oito distâncias em duas edições, incluindo a que está dentro do SVG, com a
mensagem a explicar a convenção da legenda).

#### 3 · O segundo marcador saiu, e o único ganhou a página que lhe faltava

`[descrição em preparação]` / `[description pending]` era um segundo marcador que
`IDENTIDADE.md` §6 tinha retirado e que continuava vivo **7 vezes em 3 páginas**.
Vinha de um só sítio: a descrição de «Onde está a água?» em
`src/data/studies.mjs`. Passa a ser `[a verificar]`, e as três vistas que a
imprimem (arquivo, lede da página do trabalho, bloco «Descrições») desenham-na
dentro de `.marcador`, como qualquer outro campo por confirmar. Um sítio com
duas linguagens de incerteza tem, na prática, nenhuma.

E a página que `IDENTIDADE.md` §6 promete — «uma página que o explica» — passou a
existir: **`/a-verificar` · `/en/to-verify`**. Um ecrã: o que é (uma ausência
declarada, não uma estimativa), porque existe, o que acontece à linha que o traz
(selo a tracejado, os campos em falta nomeados, fora do índice e do mapa do
sítio, e o valor publicado não muda por isso), como sai, e porque só há um.
Entra na tabela de rotas, logo tem par `hreflang` e entra no mapa do sítio pela
mesma máquina que todas as outras. Ligada de dois sítios: do bloco «O que falta
nesta linha», na página de cada linha incompleta, e do Método, ao lado da
ligação para o livro-razão.

#### 4 · Os dois endereços mortos

**(a) A listagem de entidades do PRR — 5 linhas.**
O endereço `dados.gov.pt/…/listagem-de-entidades-prr-20260803.xlsx` devolve
**HTTP 404** (conferido a 15.08.2026: `404 application/json 146 bytes`). Fui ver
o que dados.gov.pt serve hoje para o mesmo conjunto de dados. O que encontrei, e
que **não é a mesma coisa**:

- o recurso existe e mudou de nome — `listagem-de-entidades-prr-20260814.xlsx`,
  criado a `2026-08-14T14:27:30Z`. É **um instantâneo posterior**, não o mesmo
  ficheiro noutro sítio: o conjunto declara `frequency: "daily"`, guarda um só
  recurso e substitui-o todos os dias, e o antigo não fica arquivado em lado
  nenhum;
- por isso o endereço datado é rotativo por desenho, e citá-lo garantia o mesmo
  404 amanhã. A linha passa a citar o **endereço permanente do recurso**,
  `https://dados.gov.pt/api/1/datasets/r/896a8911-c542-4e9c-941c-874a377dc5b3`
  (conferido: `200`, 44 330 994 bytes).

**Nenhum valor mudou**, e a diferença fica dita ao leitor e não em rodapé: cada
uma das cinco linhas leva uma entrada `actualizacao` datada de hoje, com o
endereço velho e o novo escritos por extenso e com a frase que importa — *o
valor continua a ser a soma sobre o instantâneo de 2026-08-03, que já não é
servido; o que o endereço novo serve é um instantâneo posterior.* Se os números
de Évora mudaram entre os dois instantâneos é coisa que **não se pode saber**: o
ficheiro antigo desapareceu, e não há diferença para calcular. Isso é dívida, e
está no §4.

**(b) A CAOP — 4 linhas.** `https://geo2.dgterritorio.gov.pt/caop/` devolvia 403.
Foi testado três vezes, como o plano pedia: `curl` simples, `curl` com
cabeçalhos de navegador completos, e uma leitura por WebFetch. **Os três dão
`403`, com o mesmo corpo de 199 bytes** — o 403 genérico do Apache. Não é um
bloqueio a robôs: é uma pasta com listagem desactivada, e os ficheiros por baixo
dela respondem a `curl` sem cabeçalho nenhum (`CAOP_Continente_2025-gpkg.zip`,
`200 application/zip`, 111 647 845 bytes, `Last-Modified` 2026-02-02). Ou seja:
o endereço nunca foi uma página que se pudesse abrir, e portanto nunca foi uma
citação que se pudesse seguir.

As quatro linhas passam a citar o que se pode abrir: cada contagem regional
aponta para o ficheiro de onde foi contada, e a linha do total — que é derivada
— aponta para a página da DGT onde a CAOP 2025 é publicada
(`www.dgterritorio.gov.pt/…/caop`, `200`). As três regionais ganharam também
`document.locator`, que não tinham. Cada uma leva a sua `actualizacao` com os
dois endereços e o motivo.

**Alojar cópias fixadas dos ficheiros** — que é o que fecharia esta classe de
defeito de vez — **fica adiado**: depende de uma verificação de licença por
fonte que ninguém fez. Está no §4.

#### 5 · `#page=` nas 23 linhas de PDF

A página já estava no localizador («p. 119», «p. 140, Quadro 30») e o endereço
mandava o leitor para o princípio de um PDF de 16 MB. O endereço passa a
`…pdf#page=N`, e a página da linha imprime **«Abrir o documento na página N»**
como rótulo da ligação, nas duas edições, com o endereço por baixo em letra
pequena.

**A página é lida do localizador, e de mais lado nenhum.** O exportador do motor
deriva-a com `pin_page()`, só quando o endereço é mesmo um PDF e só quando o
localizador diz uma página — e o localizador já foi provado pela validação V7,
que exige que cada corrida de algarismos dele apareça no texto da própria linha
do motor. Não há campo novo no manifesto onde uma página pudesse ser inventada;
foi essa a escolha, e é a razão dela. Onde o localizador não diz página, o
endereço fica como estava.

Do lado do sítio, o rótulo não é uma dispensa: `source_url.page` entrou na tabela
dos campos que o portão confere, e o portão extrai a página do campo
`source_url` com a **sua própria cópia** da regra — como já fazia com o separador
de `attributed_to` (§1.31). Um rótulo «página 42» sobre um endereço que fixa a
página 24 pára a construção. **Posto à prova a falhar, e reposto:** 46 erros.

#### 6 · Os localizadores passaram a dizer o que um leitor pode procurar

**35 localizadores nomeavam um artefacto interno** — um ficheiro do repositório
do motor ou uma chave de estrutura de dados: `raw/ine_data_populacao_evora.json →
Dados["2025"], geocod 1C40705`, `cm_lists, list='PCP-PEV'`,
`executive_2025.seats[…]`, `mandates['2021-2025'] → …`, `final_recipients, NIF …`,
`total_mandates`, e os oito da DGAL, que nomeiam um `dgal_divida_AAAA.pdf` que
não aparece no endereço. Nenhuma destas cadeias é alcançável a partir do
endereço impresso ao lado. Passam a **0**.

Cada um foi reescrito para o que a fonte publica: «INE, indicador 0012918, Évora
(código 1C40705), dados de 2025»; «IEFP, desemprego registado por concelhos,
dezembro de 2013, linha de Évora»; «SGMAI, autárquicas de 2025, órgão Câmara
Municipal, Évora, lista «PS», mandatos»; «listagem de entidades PRR, beneficiário
final NIF 504828576 (Município de Évora), valor contratado neste concelho».

**As colunas da DGAL foram lidas, não deduzidas.** Os quatro PDF estão no motor,
em `content/07 …/Technical Source/raw/pdfs/`, e foram abertos. As rubricas
impressas, tal como estão:

| Ano | Coluna (1) | Coluna (5) = (2)−(3)−(4) |
| --- | --- | --- |
| 2014 | `Limite 2014 (Art. 52º, nº 1, da Lei 73/2013)` | `Excluindo dívidas não orçamentais e Conta 268126 (FAM)` |
| 2017 | `Limite 2017 (Art. 52º, nº 1, da Lei 73/2013)` | `Dívida total (exclui dívidas não orçamentais, exceções previstas na Lei n.º 73/2013 e no OE/2017 e FAM)` |
| 2021 | `Limite 2021 (Art. 52º, nº 1, da Lei 73/2013)` | `Dívida total (exclui dívidas não orçamentais, exceções previstas na Lei n.º 73/2013 e no OE/2021 e FAM)` |
| 2024 | `Limite 2024 (Art.º 52.º, n.º 1 da Lei n.º 73/2013)` | `Dívida total (Exclui dívidas não orçamentais, exceções previstas na Lei n.º 73/2013, no OE/2024 e FAM)` |

O localizador **não transcreve a rubrica inteira**, e a razão é o portão do
motor: a validação V7 recusa um localizador com uma corrida de algarismos que
não apareça no texto da linha de origem, e as rubricas trazem `52`, `73/2013` e
`268126`, que lá não estão. Podia ter-se afrouxado a V7; não se afrouxou. O
localizador diz, sem algarismos, qual é a coluna — «última coluna do quadro — a
dívida total que exclui as dívidas não orçamentais, as exceções e o FAM» e
«primeira coluna do quadro — o limite legal de endividamento do ano» — e as
rubricas impressas ficam registadas aqui, que é onde um leitor que queira a
palavra exacta as encontra. A distinção que **não** se podia perder é a de
«inclui»/«exclui»: as colunas (2) e (5) chamam-se as duas «Dívida total», e o
que as separa é essa palavra.

**O excerto truncado a meio de um número.** `evora-despesa-paga-2025` terminava
em «… Quadro 14 … Despesas Correntes 77». Não é um caso isolado: o extractor do
motor corta a citação a uma largura fixa. Foram examinados **os 70 excertos
cruzados**; **15** eram prosa cortada a meio de palavra ou de número, e **12**
puderam ser cortados no último ponto final completo, com duas condições provadas
por programa: o novo excerto é um prefixo do antigo (logo, continua a ser um
pedaço textual do excerto do motor, que é o que a validação V3 exige) e **o valor
da linha continua lá dentro**.

| Linha | Antes | Depois |
| --- | ---: | ---: |
| `evora-execucao-da-receita-2021` | 243 | 84 |
| `evora-prazo-medio-de-pagamento-2025` | 201 | 195 |
| `evora-prazo-medio-de-pagamento-2023` | 193 | 150 |
| `evora-pagamentos-em-atraso-2025` | 224 | 67 |
| `evora-receita-cobrada-2025` | 219 | 166 |
| `evora-despesa-paga-2025` | 197 | 96 |
| `evora-divida-total-2025` | 223 | 185 |
| `evora-margem-endividamento-2025` | 218 | 59 |
| `evora-excesso-endividamento-2014` | 264 | 259 |
| `evora-excesso-endividamento-2019` | 264 | 259 |
| `evora-contas-2024-votos-favor` | 210 | 51 |
| `evora-contas-2024-votos-contra` | 210 | 51 |

`evora-despesa-paga-2025` termina agora onde o plano pedia: «…(54.575.385,72€ de
correntes e 10.989.664,15€ de capital).»

**Três ficaram como estavam, e diz-se porquê:** em `evora-execucao-da-receita-2025`,
`evora-orcamento-2025` e `evora-pael-emprestimo` o valor da linha aparece
**depois** do último ponto final completo. Cortar aí tirava a prova do excerto,
e alongar não é possível — o excerto do motor é ele próprio o pedaço cortado,
não há mais texto deste lado da fronteira. Corrigir isto é corrigir o extractor
do motor, e é dívida: §4.

#### 7 · As linhas de série de dados deixaram de se chamar «Documento»

**57 das 132 linhas** têm por endereço um ponto de acesso de dados — o
`json_indicador` do INE, o `api/dissemination` do Eurostat, os ficheiros JSON
estáticos do portal de resultados eleitorais. Um pedido a um destes devolve uma
resposta; não abre uma página. Chamar-lhe «Documento», e ao que ela traz
«Excerto», diz ao leitor que existe uma frase impressa algures, e não existe.

Na página da linha, e **só** nos rótulos: `Documento` → **`Série`**, `Endereço` →
**`Pedido`**, `Excerto` → **`Campo devolvido`**. Nas duas edições, com paridade
de chaves. Nenhum campo, nenhum bloco e nenhuma ordem mudaram.

O critério é um padrão de endereço, e é declaradamente provisório: `json_indicador`
(8 linhas), `/api/` (39) ou um caminho terminado em `.json` (10) — 57 ao todo,
exactamente a contagem que a medição tinha feito por outra via. O campo que devia
decidir isto é `document.kind`, e fica para o redesenho da página de confiança
(§4).

#### 8 · A máquina deixou de se descrever a si própria

Cortes, nas duas edições. Cada um é uma frase em que o sítio explicava o seu
próprio funcionamento a quem só queria ler um número:

| O que saiu | Onde | Ocorrências (PT+EN) |
| --- | --- | ---: |
| «A construção do sítio falha se o texto desta página deixar de ser igual, carácter a carácter…» | página de linha, nota do excerto | 194 |
| «Proveniência completa: todos os campos preenchidos e conferidos contra a fonte.» + a caixa que a continha | página de linha, estado | 240 |
| «Escrever aqui uma paráfrase plausível seria exactamente a fabricação que este sistema existe para impedir.» | página de linha, excerto por confirmar | 24 |
| «É refeita a cada construção do sítio e tem de dar exactamente o valor publicado; se não der, não se constrói nada.» | página de linha, expressão | 46 |
| «Este trabalho já tem a leitura do observatório: a medida…, a frase…, o método e as ressalvas.» | página de leitura | 10 |
| «A frase abaixo é prosa da casa, e não uma citação…» | página de leitura | 10 |
| «As descrições são reformulações do título, não resumos do conteúdo, e aguardam o director.» | página de leitura | 20 |
| «A descrição deste trabalho não é uma reformulação do título…» | página de leitura | 4 |

E dois encurtamentos, de explicação para estado:

- «Este estudo ainda não tem ficheiros para descarregar. Quando tiver, aparecem
  aqui — com a mesma disciplina…» → **«Sem ficheiros para descarregar.»**
- «Alojado aqui na forma exacta em que foi publicado. A única coisa que lhe foi
  acrescentada é uma faixa no topo, com a marca do observatório e o caminho de
  volta a esta página; os estilos, os gráficos e o texto do documento não foram
  tocados.» → **«Alojado aqui na forma exacta em que foi publicado, com uma
  faixa no topo e mais nada.»**

Onde o estado deixou de precisar de nota, a caixa desapareceu com ela: uma linha
com proveniência completa já não desenha um quadrado a dizê-lo — **o selo cheio
já o diz**, e essa era a definição do defeito. A etiqueta da expressão passou de
«Reavaliada na construção» a «Reavaliada em cada construção», que é o estado que
a frase cortada dizia por extenso.

**O que NÃO foi tocado, de propósito:** a política de correcções na página de
linha, a nota de não-ordenação de partidos, as ressalvas da página de Évora e a
linha do domínio no rodapé. São matéria da fase da voz e do Sobre, e não são
defeitos: são decisões editoriais por tomar (§4).

#### 9 · `/municipios` existe, e os 308 concelhos têm nome

`/municipios` devolvia **404**, e a única porta para uma página de município era
um ponto aceso dentro de um SVG. O teste dos dois minutos falhava para 307
concelhos em 308.

`/municipios` · `/en/municipalities`: os **308** concelhos, agrupados pelo
distrito ou ilha que a própria Carta Administrativa lhes dá, pela ordem em que a
carta os regista. Cada um é um nome e um estado — «sem página ainda» — e Évora
leva à sua página. A contagem entra por `<Claim id="municipios-portugal-caop-2025" chip/>`,
a mesma linha que o mapa e o cabeçalho já citavam.

**Os nomes existem**: `src/data/caop-centroids.mjs` guarda, por concelho, nome,
índice do distrito ou ilha e posição — os 308 registos, os mesmos que o mapa
desenha e que `dados/municipios-308.csv` publica. **O que não existe é código do
INE nem código da CAOP por concelho**, e por isso nenhum aparece: escrevê-los de
memória seria inventá-los. Não há aqui **nenhuma medida por concelho**: isso é o
desdobramento, e é outro trabalho.

O mapa da primeira página e o «Voltar ao mapa dos municípios» da página de Évora
passam a levar aqui.

#### 10 · O mapa do sítio continua sem `lastmod`, e agora está dito porquê

Não havia nenhum, e a primeira resposta foi pôr um por tipo de página: a data de
leitura numa linha, a data de publicação num estudo, a data do commit numa página
de conteúdo. **A revisão cruzada mostrou que isso é uma data errada, não uma data
parcial.** `access_date` é quando a FONTE foi lida; a data de um estudo é quando o
TRABALHO saiu. Nenhuma delas responde à pergunta que o campo faz, que é quando
**esta página** mudou — e uma página muda quando muda qualquer uma das suas
entradas, incluindo os componentes que partilha com as outras trezentas.

O campo saiu por inteiro, e `src/lib/frescura.mjs` com ele. Um carimbo de build
diria que 264 páginas mudaram hoje; uma data de leitura diz outra coisa qualquer.
**A ausência é o que o protocolo permite e é a verdade.** O modelo a sério — o
git sobre o conjunto completo de entradas de cada página — fica no §4.

---

#### O que a revisão cruzada apanhou, e o que dela saiu

Uma revisão de outra família de modelos (Codex, em leitura apenas, sobre os dois
ramos) passou por este bloco depois de ele estar escrito. Encontrou dois
bloqueadores e seis defeitos. Todos foram corrigidos aqui; os números do quadro
acima são os de depois.

**B1 · O exportador duplicava as correcções a cada corrida.** O manifesto escreve
`__valor__` onde vai o valor da linha, e o exportador resolvia o sentinela
**depois** de comparar a entrada com o que estava em disco. `__valor__` nunca é
igual a `12 069 012,6`, por isso cada reexportação acrescentava outra cópia do
mesmo acontecimento: as cinco linhas do PRR já a traziam **duas vezes**. Três
correcções: o sentinela resolve-se **antes** da comparação; a identidade de uma
entrada passou a ser a entrada **inteira** (duas revisões no mesmo dia, sobre o
mesmo campo, com razões diferentes, são dois acontecimentos — e uma comparação
por quatro campos engolia a segunda); e o bloco `corrections:` do sítio passou a
ser levantado do ficheiro **linha a linha** e reemitido tal e qual, em vez de ser
lido e recomposto — um motivo escrito num escalar multilinha voltava como uma
cadeia entre aspas, ou seja, o exportador reescrevia o que só devia preservar. As
cinco linhas foram repostas e reexportadas: **uma entrada cada, estável ao fim de
quatro corridas seguidas.** O teste #19 foi reescrito para usar o sentinela a
sério — contra o código antigo, falha.

**B1b · Sair do manifesto não tira a linha do sítio.** Uma linha retirada do
manifesto continuava publicada e saía do registo de travessia: ficava no ar sem a
guarda que prova que os seus bytes são os que atravessaram, e sem ninguém dar por
isso. O exportador passa a recusar (V11); retirar a sério exige uma entrada
`retired: true` com razão escrita.

**B2 · As nove entradas de endereço estavam mal tipadas.** `ledger/README.md`
define `actualizacao` como «o valor mudou», e as nove tinham `old_value` igual a
`new_value` — uma entrada que declara «o valor mudou de X para X», que é falso e
diz ao leitor o contrário do que aconteceu. Entrou uma **terceira natureza,
`proveniencia`**: o valor não mudou, mudou a maneira de lá chegar. Traz um campo
a mais, `field`, e `old_value`/`new_value` são os valores **desse campo** — os
dois endereços. O validador aceita-a e exige o `field` de uma lista fechada; o
portão aprendeu-a e compara os dois endereços **como texto**, não por algarismos;
a história da linha imprime-a. No registo do Método **não é listada**: são muitas
de cada vez e afogariam as confissões — aparecem como as linhas que as trazem,
cada uma com o caminho para a sua história. É a regra em cascata do
`ledger/README.md`. As nove foram retipadas.

E ficou escrita a regra do silêncio, que estava a ser praticada sem estar dita:
**as afinações do ponteiro não entram na história da linha.** Acrescentar
`#page=N`, reescrever um localizador por outras palavras para o mesmo sítio, ou
aparar um excerto no fim de uma frase — nada disso muda a resposta a «onde está
isto», e todas ficam registadas no git e aqui. O critério não é a dimensão da
alteração: é se o ponteiro passa a apontar para **outro sítio**.

**F1 · A porta das correcções era contada e não era lida.** A conferência
contava uma por página e passava com um elemento vazio ou escondido. Passou a
exigir que a porta **diga o endereço** e que não esteja sob `hidden`,
`aria-hidden="true"` ou `.vh`. E ficou escrito, no portão e aqui, que os
documentos de estudo estão fora **por desenho**: são obra já publicada, conferida
carácter a carácter contra a origem, e acrescentar-lhes uma caixa nossa quebrava
essa igualdade — quem quiser corrigir um chega à porta pela página do estudo.

**F2 · A auditoria de selos procurava demasiado longe.** Aceitava um selo em
qualquer antepassado até à secção, e por isso a primeira página passava com
`distancia-portugal-ue27-2024` e `pib-pc-portugal-2024` sem selo nenhum ao pé do
número. Regra nova, em duas metades: fora de um `<svg>`, o selo tem de estar
dentro do **elemento que embrulha o número** — a frase, o mosaico, a célula;
dentro de um `<svg>`, tem de estar numa **legenda declarada** do próprio
instrumento (`data-legenda-selos`), e não num selo qualquer da mesma secção. A
regra apertada apanhou **22 valores** que a anterior deixava passar, todos
corrigidos: a legenda do instrumento n.º 1 e as três da página do município
passaram a estar marcadas, o relance da régua ganhou o selo da região que está a
ser lida, e o relance da linha do tempo passou a levar os selos ao pé dos dois
números em vez de numa fila por baixo. Uma excepção declarada: o bloco «a mesma
frase na outra edição» leva o selo para a linha na **outra** edição, de propósito,
e a conferência aceita a linha daquele id em qualquer das duas.

E passou a apanhar também o caso que faltava: um endereço com `#page=` cuja
página **não é dita** na página da linha — antes só apanhava um rótulo que
discordasse.

**F3 · A heurística do endereço rotulava mal o ficheiro do PRR.** `/api/` no
caminho não faz de uma coisa uma série: `dados.gov.pt/api/1/datasets/r/…` serve
uma folha de cálculo, e as cinco linhas do PRR ficavam rotuladas «Série». O campo
existe agora: **`document.kind`**, com o conjunto fechado
`pdf · html · serie · ficheiro · registo`, validado pelo `ledger:check`, escrito
no manifesto para as linhas cruzadas e directamente nas nativas. A página da
linha lê o campo e nunca a forma do endereço; uma linha sem `kind` fica com os
rótulos genéricos. Contagem: **57 `serie` · 31 `pdf` · 10 `ficheiro` · 6 `html`**
(28 linhas não têm documento — derivadas, da casa, ou com o endereço por
confirmar). `registo` fica declarado e por usar.

**F4 · Três cortes tinham ido longe de mais.** Voltam, como rótulos de uma linha
e não como parágrafos: nas páginas de leitura, «Leitura breve — prosa da casa,
assente numa frase do trabalho», porque ser prosa da casa e não citação é um
facto que sustenta a confiança; no arquivo e na página do trabalho, «Descrição:
reformulação do título», para que uma descrição não seja lida como um resumo do
conteúdo — sai só o recado interno «aguardam o director»; e na página de uma
linha, «Estado da proveniência: completa», porque a página de uma linha é a única
superfície do sítio sem selo para si própria, e sem esta linha o estado não é
dito em lado nenhum. Tudo o resto que foi cortado fica cortado.

**F5 · O `lastmod` do mapa do sítio não era hora de alteração da página.** A data
de leitura de uma fonte é quando a **fonte** foi lida; a data de um estudo é
quando o **trabalho** saiu. Nenhuma delas é «quando esta página mudou» — uma
página muda quando muda qualquer uma das suas entradas, componentes partilhados
incluídos, e esse modelo não está construído. O `lastmod` **saiu por inteiro**, e
`src/lib/frescura.mjs` com ele. Uma ausência honesta vale mais do que uma data
errada; o modelo a sério fica no §4.

**F6 · O aviso do arquivo ainda dizia «aguardam o director».** Ficou «Datas de
publicação por confirmar.», que é o que se sabe.

**Conferido nesta passagem:** `npm run build` fecha com código 0 · `typecheck`
limpo · 316 páginas · 5 423 ligações internas, **0 partidas** (o conferidor foi
posto à prova com uma ligação partida plantada) · `check-cruzamento --with-origin`
confere as 70 linhas contra o motor · livro-razão 132 afirmações, **dívida 12**
(inalterada: nenhum campo `[a verificar]` foi preenchido nem criado) ·
**29 afirmações não citadas** (inalterado) · o portão de HTML posto à prova com
**nove estragos plantados**, cada um apanhado e reposto: página sem porta ·
página com duas portas · porta vazia (301 erros) · porta escondida por
`aria-hidden` num antepassado · valor do cabeçalho sem selo · leitura breve sem
selos · selo na secção mas não ao pé do número · legenda de instrumento
desmarcada · endereço com `#page=` sem rótulo de página (46 erros). Do lado do
motor, `python3 -m core.gate` fecha em PASS e `export_site_rows_test` em
**28 conferências** (eram 17 antes deste bloco, 24 antes da revisão).

### 1.37 O selo do cabeçalho passa a ser só o glifo

A direcção viu no sítio no ar, à meia-noite de 15 para 16 de Agosto, o que os
selos acrescentados de manhã fizeram ao cabeçalho da primeira página: as três
contagens (municípios, estudos, edições) passaram a arrastar o rótulo inteiro do
estudo («O Estado do País — apuramento próprio») e, na contagem CAOP, o marcador
«[a verificar]». Certo pela regra (§1.36 item 2: todo o valor com selo, para a
sua linha), errado naquele lugar.

Feito: uma regra de CSS para `.masthead-furniture` que esconde visualmente o
texto do selo e o marcador (o padrão `.vh`, só ali) e fecha o espaço; o quadrado
fica, com os dois estados desenhados; a ligação continua a apontar para a linha
própria do valor. Nada mudou no portão: o selo continua ao pé do valor com o
`href` certo, que é o que a verificação exige. `IDENTIDADE.md` §5 ganhou o ponto
4, a única excepção ao rótulo visível.

O que este ajuste não decide, e fica para o bloco V: se as contagens ficam no
cabeçalho, e o que o cabeçalho diz em vez de «Edição de …».

### 1.38 A ortografia do sítio passa a ser uma só

**Afecta:** nenhum

*(A regra de fecho 3 de 2026-08-15 passou a mecanismo a 16.08.2026, e a amarra
começa nesta entrada. Esta decisão é sobre como se escreve, e não sobre o que o
Sobre, o Método ou a agenda dizem: não governa nenhum dos três. A conferência
está em `scripts/check-ledger.mjs`, secção «amarra das decisões»; ver §1.40.)*

O sítio escrevia nas duas grafias ao mesmo tempo. Não por descuido de um dia:
por acumulação. «Correções» ao lado de «correcção», «atualização» no rótulo e
`actualizacao` na chave que o produz, «facto» e «exacto» na mesma frase. Um
observatório que promete que cada número tem fonte não pode hesitar sobre como
se escreve a palavra ao lado dele.

*Este registo fica na grafia em que foi escrito. Esta entrada, e as que vierem
depois dela, seguem a grafia que ela fixa.*

**A decisão.** A superfície pública segue o **Acordo Ortográfico de 1990, tal
como é aplicado em Portugal**. A regra inteira está em `IDENTIDADE.md` §9.
Superfície pública é tudo o que rende em HTML nas duas edições; o que é
transcrito nunca se converte; os documentos deste repositório são registo e
ficam como estão.

**A origem, e é preciso dizê-la por inteiro.** Não houve palavra da direção. O
roteiro (`PLANO-fases.md`, fase 1) previa exatamente este caso e fixou o
Acordo como valor por defeito; foi esse valor que se aplicou, a 16.08.2026. Fica
**revogável na pré-visualização**: se o diretor preferir a grafia anterior, a
reversão é uma corrida da ferramenta
(`node scripts/ortografia.mjs --aplicar --sentido=anterior`) e não uma
reescrita. Foi para isso que o mecanismo se construiu com um interruptor de
sentido em vez de uma passagem só.

#### A lista, e a autoridade que a sustenta

`ortografia/formas.yml`: 196 pares, 7 manuais, 50 iguais. Não é uma regra de
substituição por padrão, e a razão é a que o próprio Acordo dá: as consoantes
de `cc`, `cç`, `ct`, `pc`, `pç` e `pt` **ora se conservam, ora se eliminam**,
conforme se pronunciem (Base IV, 1). «Facto» e «exacto» têm a mesma forma e
destinos opostos. Um `sed` sobre o radical estava errado por construção.

Cada par de consoante foi consultado **forma a forma** no Vocabulário
Ortográfico Comum da Língua Portuguesa, na versão VOP, que é a de Portugal
(`voc.cplp.org`, consultado a 16.08.2026): a forma anterior não consta, a forma
do Acordo consta. Onde constam as duas é dupla grafia, e o par diz qual das
duas a casa escreve e porquê. É o caso de `sector`/`setor`, que o vocabulário
regista as duas: a casa escreve «setor». `aspecto` não consta e `aspeto`
consta, apesar de o Priberam lhe chamar dupla grafia; ficou «aspeto», que é o
que o vocabulário atesta.

Três classes não se podem provar pelo vocabulário, porque a pesquisa dele não
distingue diacríticos, e por isso citam a base do próprio Acordo: o acento
circunflexo que cai em «creem, deem, leem, veem» (Base IX, 7), o acento agudo
que cai no ditongo «oi» das palavras graves (Base IX, 3), e os nomes dos meses
e dos dias, que passam a minúscula (Base XIX, 1 b).

A lista `iguais` não é decorativa: quem a lê carrega-a, e uma palavra que esteja
ao mesmo tempo em `pares` e em `iguais` faz a leitura falhar. É o que impede
alguém de «corrigir» facto, contacto, secção, carácter ou artefacto.

**O que não se converte por máquina, e porquê.** Sete trocas cujo sentido
inverso é ambíguo (de «para» não se sabe se veio de «pára») ficam em `manuais`:
assinalam-se, não se aplicam. Uma passagem que não se pode desfazer não é
reversível, e a reversibilidade é a razão de haver aqui uma lista.

#### O que foi convertido

| Classe | O que mudou |
| --- | ---: |
| Cadeias e dados (`src/i18n/strings.mjs`, `src/data/*.mjs`) | 16 palavras |
| Prosa da casa do livro-razão (`derivation`, `note`, `source_flag_note`, `unit`, `reason`) | 54 palavras |
| Travessões reescritos à mão | 146, em 133 linhas de 23 ficheiros, mais 2 em `src/lib/livro.mjs`, que está fora da lista da ferramenta |
| O identificador da natureza | 37 ocorrências em 10 ficheiros |

Medido no que é renderizado, sobre as **301 páginas** que não são documentos de
estudo:

| Medida | Antes | Depois |
| --- | ---: | ---: |
| Formas anteriores ao Acordo (pt-PT) | 209, em 140 páginas | **0** |
| Travessões e meios-traços | 1 042, em 300 páginas | **10**, em 10 páginas |

Do lado da fonte, as mesmas contas: 33 formas anteriores e 147 a reescrever à
mão passam a **0** e **0**; ficam 19 no restante, 45 avisos em `note` e 16
dentro de aspas angulares.

Os travessões não se trocaram por máquina de propósito: cada um pede uma frase
nova, e uma frase nova é escolha de quem escreve. Onde separava partes de uma
mesma linha ficou o ponto médio «·», que já era o separador da casa; onde era
aposto ficaram parênteses, dois pontos ou vírgula. **Nenhuma palavra foi
acrescentada.**

Três coisas que a passagem obrigou a decidir, e ficam ditas. O rótulo do estudo
da casa passou de «O Estado do País — apuramento próprio» a «O Estado do País,
apuramento próprio», na sua origem única. O título de uma página de linha passou
a separar por «·» (`src/lib/livro.mjs`), que é o separador que a descrição da
mesma página já usava. E os títulos publicados que trazem travessão a sério
(«Évora — Os Pelouros, Quem Os Teve, O Que Fizeram») são citação e ficam com
ele: vão marcados como título de estudo, e a conferência sai deles.

#### O que ficou, e a quem pertence

**As 70 linhas cruzadas não se editam deste lado.** Os bytes de cada uma estão
presos pelo resumo em `ledger/cruzamentos/evora.json`, e o `check:cruzamento`
para a construção a quem lhes toque. A prosa da casa delas fica como veio, e
converte-se onde foi escrita, que é o manifesto do motor; depois disso a
reexportação traz os bytes novos. São 19 ocorrências do lado da fonte, das quais
**10 são visíveis nas páginas**: o mesmo travessão numa entrada de correção de
cinco linhas do PRR, nas duas edições. Estão em `ortografia/restantes.yml`, rota
a rota e palavra a palavra, com o motivo escrito.

**`note` não é publicada** (`ledger/README.md`), e por isso não é superfície
pública. As palavras converteram-se na mesma, porque a passagem é de máquina e
não custa nada; os 45 travessões que lá ficam **não** foram reescritos à mão, e
a decisão é minha e não da regra: reescrever à mão texto que ninguém lê é
trabalho sem leitor. A ferramenta conta-os como aviso a cada corrida, para que a
escolha continue à vista.

#### Os dois identificadores

`actualizacao` passa a `atualizacao`, e `data-de-actualizacao` a
`data-de-atualizacao`. Era o único sítio do sistema onde as duas grafias
conviviam por desenho: o rótulo visível dizia «atualização» desde o princípio e
a chave dizia outra coisa (§1.11). Trinta e sete ocorrências deste lado, e zero
fora dos documentos do repositório depois.

**A troca só é atómica na fusão.** O motor escreve o mesmo identificador no
exportador, nos testes e no manifesto. Esse lado é renomeado em paralelo, no
ramo `voz` do ResearchHub, e os dois ramos têm de entrar juntos: com um só, uma
reexportação escreve `actualizacao` numa linha cujo validador já só conhece
`atualizacao`, e a construção para.

Uma coisa que **não** mudou: `document.edition` de sete linhas do Eurostat diz
«nama_10r_2gdp, actualizado 2026-02-10». É campo transcrito, conferido carácter
a carácter contra a fonte, e converter um campo desses era reescrever a prova.

#### A conferência, e os estragos que a provaram

Nenhum portão novo: duas conferências dentro do varrimento do `gate:html`, que é
onde a moratória de 2026-08-15 as manda ficar até o `gate:identidade` existir.
Nas páginas em pt-PT, nenhuma forma anterior ao Acordo; em qualquer página das
duas edições, nenhum travessão. **A lista é a mesma que a ferramenta usa**, lida
do mesmo ficheiro: com duas listas, uma delas ficava para trás à primeira
palavra acrescentada.

Sai do varrimento o que não é prosa da casa: `blockquote`, `q` e `cite`; o que
está marcado `data-verbatim` ou `data-linha-campo`; o título de um trabalho
publicado e a etiqueta do selo, que o `allowlist.yml` já declara como texto
gerado do registo; e o que estiver entre «…», que é a aspa da casa a dizer
citação.

**Posto à prova a falhar, um estrago de cada vez, e cada um reposto:**

| Estrago | O portão |
| --- | --- |
| forma anterior numa cadeia portuguesa («actualizada») | fecha, 120 erros, «grafia anterior ao Acordo: "actualizada" (a forma da casa é "atualizada")» |
| travessão numa cadeia portuguesa | fecha, 120 erros, «travessão no texto renderizado: "—"» |
| travessão numa cadeia inglesa | fecha, 120 erros, a mesma mensagem, nas páginas `/en/` |
| palavras de `iguais` («facto», «secção», «contacto») numa cadeia portuguesa | **passa**, código 0 |
| forma anterior e travessão dentro de um `<blockquote>` | **passa**, código 0 |
| uma entrada retirada de `restantes.yml` com a ocorrência ainda lá | fecha, 1 erro, nomeando `/livro-razao/evora-prr-pago-2026` |

E duas provas da própria lista, que não estavam pedidas e ficam: pôr «exacto» ao
mesmo tempo em `pares` e em `iguais` faz a leitura da lista atirar antes de
qualquer página ser varrida; e mover «facto» de `iguais` para `pares` faz falhar
a prova que a conferência corre sobre si própria a cada construção, em seis
páginas de mentira escritas dentro do portão.

A reversibilidade também foi posta à prova, e o resultado tem duas metades.
Sobre a árvore já convertida, `acordo` não muda nada, `anterior` muda 113
palavras em 25 ficheiros, e `acordo` repõe os bytes **exatamente** os que
estavam. Sobre a árvore de antes, misturada, a ida e volta **não** repõe os
bytes, e não pode: a passagem não tem memória de qual das duas grafias cada
palavra tinha, e por isso `anterior` também converte o que já estava no Acordo.
É essa a diferença que a decisão existe para acabar.

#### Os limites, honestos

1. **A conferência vê texto renderizado, e não vê o que está dentro de um
   elemento transcrito.** É lá que vivem os campos das linhas cruzadas: quatro
   `derivation` com «tecto» rendem nas páginas de linha dentro de
   `data-linha-campo`, e a conferência passa por cima. Contam-se do lado da
   fonte, com `node scripts/ortografia.mjs --verificar`. As duas metades
   cobrem-se uma à outra e nenhuma cobre tudo sozinha.
2. **Uma palavra que não esteja na lista não é vista.** A lista tem 196 pares e
   a língua tem mais. Cobre o que ocorre no repositório e o conjunto comum; não
   é um corrector ortográfico e não pretende ser.
3. **As regras de hífen que não estão na lista não são vistas.** Estão lá os
   pares que ocorrem ou que se esperam; a regra geral do Acordo (Base XVI) não
   está imposta em lado nenhum. E porque, para efeito de procura, uma palavra
   com hífen conta como palavra só, um composto novo precisa de entrada própria.
4. **Texto dentro de imagens e de `<text>` de SVG.** O varrimento lê o texto do
   SVG como qualquer outro; o que está dentro de uma imagem de mapa de bits não
   é lido por ninguém. Não há hoje nenhuma imagem dessas no sítio.
5. **Atributos não são varridos**, como em todo o resto do portão: `title`,
   `alt` e `aria-label` podem trazer um travessão e passam.
6. **O corpo dos documentos de estudo continua fora**, como sempre esteve: é
   obra citada, e é conferida de outra maneira.
7. **A conferência não sabe português.** Sabe comparar cadeias contra uma lista.
   Uma palavra inglesa que por acaso seja uma forma anterior portuguesa
   («director», «actual») é apanhada se aparecer numa página em pt-PT; do lado
   da fonte isso resolve-se pela chave `en` que embrulha o texto inglês, e foi
   preciso resolvê-lo, porque o Método em inglês tem três «director».

### 1.39 O sítio passa a dizer o que é, e o Método a provar o que faz

**Afecta:** sobre · metodo
**Texto:** sobre 44362a8d7409 · metodo 1bcc413daa4d

*(Linhas acrescentadas a 16.08.2026, quando a regra de fecho 3 passou a
mecanismo; §1.40. Os dois resumos são os dos ficheiros como este bloco os
deixou, lidos do commit que o fechou. Os dois textos mudaram neste bloco: o
Sobre nasceu aqui, e o Método passou a dez regras.)*

Havia três coisas ao mesmo tempo. O sítio não tinha página sobre si próprio: a
única superfície «sobre» era o Método, com quatro marcadores por resolver lá
dentro. O Método descrevia o método e não o provava. E tudo o que o sítio dizia
sobre si próprio, quando dizia, estava escrito à mão e podia ficar errado sem
que ninguém desse por isso.

*Este registo segue a grafia que §1.38 fixou.*

#### As quatro páginas, e a disposição de cada uma

| Página | Rotas | Disposição |
| --- | --- | --- |
| Sobre | `/sobre` · `/en/about` | A (`IDENTIDADE.md` §3), a mais magra: o nome na coluna de rótulo, duas frases e uma porta no corpo |
| Método | `/metodo` · `/en/method` | A, a mesma que já tinha, com o instrumento a toda a largura dentro dela |
| Correções | `/correcoes` · `/en/corrections` | A |
| A prova da construção | `/prova.json` | não é uma página: é JSON, como o `version.json` |

Nenhuma quarta disposição, e o instrumento dentro de uma página não é uma: a
primeira página e a página do município já o fazem.

#### O texto decidido, e onde vive

O português do Sobre é **da direção**, escrito por ela em conversa a
2026-08-15 depois de dois rascunhos e uma crítica cega terem sido postos de
lado por explicarem e se desculparem em vez de dizerem o que o projeto é.
Está registado em `VOZ-final.md` e vive em `src/data/sobre.mjs`, carácter a
carácter. O inglês é tradução da casa do mesmo texto, e vai à leitura da
direção na pré-visualização.

Na página não há mais nada: sem contagens, sem aparelho, sem lede a explicar o
que as duas frases já dizem. A porta para o Método leva o rótulo que é a linha
de abertura do próprio Método, com origem única.

A autoria vive aqui, nas palavras da direção («produzido maioritariamente por
inteligência artificial, com o mínimo de intervenção humana»). O nome de quem
dirige está na regra 9, que é onde a intervenção humana se descreve.

#### As dez regras, e as duas coisas que este bloco mudou nelas

As dez foram propostas à direção a 2026-08-15 e estão construídas as dez. **O
corte é dela, na pré-visualização, sobre a página construída**: é para isso
que estão todas lá.

Cada regra rende três linhas: a regra, o **mecanismo** que a impõe (nomeando a
página ou o ficheiro onde se confere) e a **prova**, que são os números desta
construção. Quatro e cinco levam uma quarta linha, **o que isto não apanha**,
que é o §2.3 deste ficheiro dito em quatro linhas ao leitor.

Duas mudanças de facto, e ficam ditas:

1. **Regra 9.** Passa a nomear quem dirige, nas palavras que o Método já usava
   («A direção é de Nuno dos Santos», §1.13). E a frase «a autoria por
   inteligência artificial está declarada em todas as páginas» deixaria de ser
   verdade no momento em que a linha do rodapé saísse: passa a dizer o que é
   verdade, que a autoria está no Sobre e que todas as páginas levam a porta
   para lá.
2. **Regra 10.** Carrega a frase do financiamento que o Método já dava como
   decidida, numa oração só, e a regra da atribuição que estava na secção
   «atribuição causal»: regista-se quem decidiu o quê, com o rótulo partidário
   como facto de registo, e não se fazem médias por partido.

O Método antigo foi dobrado a menos de um terço. `quem-faz-isto` foi à regra 9
e o resto caiu, porque a ideia passou a ter casa no Sobre; `como-se-escreve` aos
mecanismos das regras 1, 2, 4 e 6; `livro-razao` às regras 3 e 5; `correcoes` à
regra 7, com o registo a mudar de casa; `atribuicao-causal` à regra 10;
`limites` às linhas de limite das regras 4 e 5.

**Os quatro marcadores saíram, e três por estarem resolvidos:** o nome
(decidido a 12.08), o endereço (vivo desde §1.26), o financiamento (decidido).
O quarto, a contagem das câmaras que mudaram de presidente por limitação de
mandatos, **não se resolveu**: a frase inteira saiu e o facto espera pela
verificação, no cofre. Um facto que não está verificado não se reescreve com
outras palavras.

**Inglês.** As dez em inglês são prosa da casa e a edição inglesa rende só
inglês. Saiu o aviso «tradução por rever» que a página tinha: fazia sentido
quando o português era cópia final da direção e o inglês uma tradução à espera
de revisão; agora as duas são proposta da casa, e as duas vão à mesma leitura.

#### A prova viva, e porque é que ela não é uma dispensa

`src/lib/prova.mjs` calcula, na construção, tudo o que o Método diz sobre o
estado do sítio: vinte e cinco chaves, cada uma com o valor, a frase que diz
como é obtida e a **porta**, que é a página onde o leitor vê o que ela conta.
Nada disto é escrito à mão em lado nenhum.

Um número desses é marcado `data-prova="<chave>"` e passa a ser a **sétima
origem legítima de um algarismo numa página** (§2.2). O perigo óbvio era o
portão chamar `prova()` e comparar o resultado consigo próprio: seria confirmar
uma função contra ela própria, que é o defeito que `campo="study"` cometia até
§1.24 e que uma auditoria de outra família teve de encontrar.

Por isso há **duas contas para cada chave**, e a do portão é feita do seu
próprio ponto de observação:

| Vista | O que é | Chaves |
| --- | --- | ---: |
| `dist` | contado sobre o que foi construído: páginas de linha que existem, quais levam `noindex`, páginas de estudo e de município, o mapa do sítio, o ficheiro dos concelhos | 9 |
| `ledger` | segunda leitura dos mesmos ficheiros do livro-razão, com o seu próprio código | 11 |
| `modulo` | o mesmo módulo dos dois lados: a data da verificação, o endereço das correções, a contagem das edições do arquivo | 3 |

**A vista `modulo` é fraca e está dita.** Ali o que fica conferido é que a
página rendeu o que o módulo diz, e mais nada. A vista `ledger` apanha um erro
de qualquer um dos dois lados e não apanha um livro-razão errado, que é
trabalho da verificação contra a fonte (§2.3, limite 9). A vista `dist` é a que
vale: a dívida de proveniência, por exemplo, é contada pelas páginas de linha
que levam `noindex`, que é a **promessa** da regra 5, medida onde ela se
cumpre, e não a mesma leitura do livro-razão que a página já fez.

A conferência tem três partes: a conta do portão contra a da prova; a conta do
portão contra os algarismos que cada página rendeu; e a porta, porque um número
sem porta falha. Uma chave desconhecida falha. Um `data-prova` sem algarismos
falha.

**`dist/prova.json`** é escrito pelo portão no fim de um varrimento sem erros,
com todas as chaves e a vista de cada uma, mais o que só o portão sabe: páginas
construídas, páginas de linha, valores auditados e sem selo, ligações internas
conferidas, documentos conferidos, o restante da ortografia, e o commit e a
hora, lidos do `version.json` e não recalculados. Escrito no fim porque metade
destas contas só existe quando o varrimento acaba, e só depois de passar porque
uma prova escrita por uma construção que falhou é prova de nada. Depois de
escrito é **relido**: um ficheiro que se escreve e não se abre é uma suposição.
O Método liga-o uma vez, como porta da prova da regra 4. Não entra no mapa do
sítio, e o `verify-deploy.mjs` não precisa de o conhecer (confere o
`version.json`, que é outra coisa).

#### O instrumento, e a escolha sobre ligações dentro de um desenho

O mecanismo desenhado, no servidor e sem JavaScript, a toda a largura:
FONTES → MOTOR → LIVRO-RAZÃO → CONSTRUÇÃO → PÁGINA → LEITOR, com a agenda a
alimentar o motor, a releitura a alimentar o livro-razão, e a correção que o
leitor escreve a voltar ao livro-razão. Cada nó traz os números de hoje. Sem
cor nova: tinta, fios e papel, porque o amarelo é marca de medição e aqui não
há nenhuma medição de Portugal.

**As portas não vão dentro do desenho.** §1.34 fixou que uma âncora dentro de
um `<svg>` não se lê como porta, e por isso o selo de um valor desenhado vive na
legenda do instrumento. Essa convenção é sobre selos, e estes números não levam
selo: podia abrir-se uma exceção. Não se abriu, por três razões: a convenção
fica inteira em vez de ganhar um caso; os mesmos números aparecem, com a mesma
porta, nas linhas de prova das dez regras, por isso nada fica inacessível; e
uma âncora dentro de um desenho estático tem alvo de toque e foco imprevisíveis,
que é o problema prático que §1.34 descreveu. A legenda por baixo leva
`data-legenda-prova`, e é lá que o portão exige a porta de cada chave desenhada.

**As três camadas** (`IDENTIDADE.md` §4): relance é o desenho com os números,
leitura breve é a frase por baixo («Um número chega ao leitor só se tem linha, e
a linha diz de onde veio.»), fundo são as dez regras.

**Os estados vazios estão desenhados, não deixados.** A agenda ainda não
atravessou do motor: o nó diz «sem registo» e a linha de prova da regra 8 diz
«sem registo nesta construção», em vez de escrever zero. A verificação em
atraso diz-se por palavras, no nó e no cabeçalho. E o nó do leitor **não traz
número nenhum**, e di-lo: este sítio não mede quem o lê.

#### O cabeçalho, o rodapé e a primeira página

Estas são decisões da cadeira, tomadas na ausência de palavra da direção, e são
**revogáveis na pré-visualização**.

**O cabeçalho.** As três contagens saem (§1.37 tinha deixado esta pergunta em
aberto): liam-se como cobertura, e a cobertura deste sítio é um concelho em
trezentos e oito. A dos concelhos já vive no mapa e no índice; as duas do
arquivo passam para `/estudos`, que é a página que elas contam, e continuam a
ser valores do livro-razão com o seu selo (o aviso «não é citada por nenhuma
página» não ganhou nenhuma linha nova: continua em 29).

Sai «Edição de …», e sai a própria `EDITION` de `site.config.mjs`: era escrita
à mão e dizia quando alguém decidiu chamar-lhe uma edição, não quando alguma
coisa foi conferida. A mobília passa a ser **o sinal de tempo**, que é a data
da última reconferência do painel, escrita pelo motor. Está em **todas** as
páginas, porque a data de edição também estava, no rodapé; e o rodapé deixou de
poder levá-la. A conta dos dias é uma só, partilhada com a primeira página. O
espaço da agenda fica preparado e vazio.

**O rodapé** fica navegação e mais nada: Início · Municípios · Estudos ·
Livro-razão · Método · Correções · Sobre, e a troca de língua. Saem a linha de
autoria, a linha do domínio e a data de edição. `/a-verificar` **não** entra, e
é decisão: é a definição de um sinal, alcança-se de onde o sinal aparece (a
linha incompleta, o índice do livro-razão, a regra 5 do Método), e uma lista de
secções não é um glossário.

**A invariante do portão trocou de objeto.** Era «falta a linha de autoria no
rodapé»; passa a ser, em todas as páginas construídas menos os documentos de
estudo, a ligação para `/sobre`. É mais forte: uma porta pode ser seguida, uma
frase de rodapé não. A linha de autoria continua onde é outra coisa: na faixa
por cima de um documento alojado, que não tem rodapé nenhum e não pode ter
(`src/lib/documentos.mjs`, para onde a constante se mudou).

**A primeira página.** Saem `lede1` (dizia por outras palavras o que a linha de
método do cabeçalho já diz, e a ideia passou a ter casa no Sobre), `lede2` (a
máquina a descrever-se) e `numeros.nota` (a página do marcador di-lo, e o selo
a tracejado mostra-o). `numeros.sub` fica a dizer o que o painel é, sem defesa
e sem «nossa». **Nenhum valor mudou, nenhum selo mudou.**

A régua de `scripts/medir-defeitos.mjs`, antes e depois:

| Medida | Antes (301 páginas) | Depois (305 páginas) |
| --- | ---: | ---: |
| Frases de moldura distintas | 83 | **80** |
| Ocorrências | 2 787 | **2 345** |
| …sem a porta das correções | 2 486 | **2 040** |
| Páginas com porta de correções | 301 de 301 | 305 de 305 |
| Valores da primeira página sem selo | 0 | 0 |

#### As correções ganham casa

`/correcoes` é a casa única da política: as três naturezas ditas uma vez, a
caixa para escrever, e o registo lido do livro-razão como sempre foi (correções
primeiro, atualizações a seguir, revisões de proveniência como contagem com o
caminho para as linhas). A porta que está em todas as páginas passa a apontar
para aqui em vez de para uma âncora dentro do Método. `/metodo#correcoes`
continua a existir e é a regra 7: quem lá aterrar encontra a política e o
registo a um clique (§1.29, uma página que esteve no ar ganha reencaminhamento
e não apagamento).

#### O que o portão passou a ver, e os estragos que o provaram

Três conferências novas, todas dentro do varrimento que já existia (a moratória
de 2026-08-15 continua de pé), mais uma quarta que veio de borla com a segunda.

| Estrago plantado | O portão |
| --- | --- |
| um número `data-prova` editado à mão (132 → 133) | fecha: «o número da prova "afirmacoes" foi renderizado como "133" e o portão conta 132» |
| `data-prova` com uma chave que não existe | fecha: «data-prova="linhas_do_livro" não é uma chave de src/lib/prova.mjs», com as 25 nomeadas |
| o mesmo número escrito sem a marca | fecha no varrimento dos algarismos: «algarismos fora do livro-razão: "132"» |
| a porta de um número a apontar para outra página | fecha: «o número da prova "afirmacoes" aparece sem a sua porta» |
| as portas do livro-razão fora da legenda do instrumento | fecha, 7 erros: «está desenhado dentro de um `<svg>` e não tem porta na legenda do seu instrumento» |
| uma frase do Sobre reescrita | fecha: «o texto do Sobre não é o que está decidido em src/data/sobre.mjs», com as duas versões |
| a marca `data-sobre` apagada da página | fecha: «a página do Sobre tem 0 blocos marcados data-sobre» |
| as ligações para `/sobre` retiradas de uma página | fecha: «esta página não tem ligação para "/sobre"» |
| uma ligação interna para um endereço que não existe | fecha: «a ligação interna "/correccoes" não corresponde a nada construído em dist/» |
| `prova.json` escrito com uma chave a menos | fecha, com código 1: «foi escrito com 24 chaves; esperavam-se 25» |
| a prova a contar uma linha a mais do que o portão | fecha: «a prova diz que "afirmacoes" é 133 e o portão conta 132 (vista: dist)» |

A conferência das ligações internas não estava pedida e ficou: o sítio promete
que o selo é uma porta e que a porta abre, e isso estava conferido para os
selos e para mais nada. São 6 731 ligações conferidas nesta construção.

**Um defeito que este trabalho encontrou em si próprio, e fica dito.** A
primeira corrida da prova deu **zero** linhas atravessadas na página e **70** no
portão. A causa: `src/lib/prova.mjs` resolvia a raiz do repositório a partir do
próprio ficheiro, e na construção este módulo é empacotado para dentro de
`dist/`. O portão fechou a construção, que é o que ele existe para fazer, e a
resolução passou a ser a mesma de `encontraLivroRazao()`. É a primeira vez que
uma conferência nova apanha um defeito do código que a acompanha.

#### O que fica para quem vem a seguir

**Para o agente da agenda, neste mesmo ramo:** o ficheiro
`src/data/agenda.json` é lido por `prova()` **se existir**, e as cinco chaves
`agenda_*` ficam a `null` enquanto não existir; a linha da mobília do cabeçalho
tem o seu lugar marcado por comentário em `Masthead.astro`; a porta das chaves
da agenda passa a ser `/agenda` sozinha, no dia em que a rota entrar na tabela
(`portaDaAgenda()` já a procura lá); a linha de prova da regra 8 do Método
enche-se sem tocar em código, e o nó AGENDA do instrumento também; e o
parágrafo da política de correções que se repete nas 264 páginas de linha está
em `src/components/HistoricoDaLinha.astro:101`, com a cadeia em
`src/i18n/strings.mjs`, `livro.linha.historicoNota`.

**Para a direção, na pré-visualização:** o corte das dez regras, sobre a página
construída; a leitura do inglês do Sobre e das dez; e a revogação, se a quiser,
de qualquer das decisões da cadeira acima (as contagens fora do cabeçalho, o
rodapé só com navegação, `/a-verificar` fora dele) e da ortografia (§1.38).

### 1.40 A agenda: o que se mede agora, e nada sai dela em silêncio

**Afecta:** agenda · metodo
**Texto:** metodo 4d218817cc4d
**Agenda:** habitacao 2026-08-16 · evora-pagina-de-municipio 2026-08-16

A regra 8 do Método prometia, desde 16.08.2026, que «a lista do que está em
curso, do que se segue e do porquê é pública, e nada sai dela em silêncio». A
lista não existia. O nó AGENDA do instrumento dizia «sem registo» e a linha de
prova dessa regra dizia «sem registo nesta construção»: um estado vazio
desenhado com honestidade, à espera do outro lado. O motor atravessou-o, e este
bloco é a página que a promessa pedia.

*Este registo segue a grafia que §1.38 fixou.*

#### A travessia: dois registos inteiros, e não linhas

O que atravessa deixou de ser só linhas do livro-razão. A agenda
(`agenda/agenda.json` no motor) e o calendário das fontes
(`indicators/calendar.json`) atravessam como **ficheiros inteiros**: não são
valores com proveniência por campo, são dois registos que a página renderiza
inteiros. Chegam a `src/data/agenda.json` e `src/data/calendario.json`, e o
registo da travessia a `ledger/cruzamentos/agenda.json`, ao lado do `evora.json`.

O exportador do motor escrevia esse registo em `src/data/`, que não é onde este
sítio guarda registos de travessia. Passou a escrevê-lo na casa certa, e a raiz
lê-se do destino: um destino que seja o `src/data` de um sítio tem o sítio por
cima, e qualquer outro destino é a sua própria raiz. Uma regra só, a mesma forma
dos dois lados, e uma reexportação passa a ser um comando em vez de um comando e
um passo à mão. As vinte e duas conferências de `export_agenda_test.py`
continuam verdes, incluindo a da idempotência, que agora lê o registo na casa
nova.

| Ficheiro | Onde | O que leva |
| --- | --- | ---: |
| `src/data/agenda.json` | o sítio | 5 itens |
| `src/data/calendario.json` | o sítio | 16 acontecimentos, 8 sem data publicada |
| `ledger/cruzamentos/agenda.json` | o sítio | os resumos de origem e de chegada, e as contagens |

#### A conferência: dois tipos de registo, uma disciplina

O `check:cruzamento` passou a conhecer os dois tipos, e lê o tipo **da forma do
registo e não do nome do ficheiro**: um mapa `rows` prende linhas, um mapa
`files` prende ficheiros. Offline compara o resumo dos bytes em disco com o que
o registo declara; `--with-origin` compara com o ficheiro do motor. As mesmas
mensagens e a mesma forma da conferência das linhas.

E as invariantes que a página precisa para renderizar são **reconferidas deste
lado**, não aceites do motor: o estado é o `para` da última entrada do
histórico, todo o item tem histórico, quem vai para `retirado` traz motivo, tudo
o que renderiza tem `pt` e `en`, as linhas citadas existem no livro-razão deste
sítio, os acontecimentos citados existem no calendário. O motor confere-as antes
de escrever, e isso não é razão para não as conferir aqui: uma conferência de
aceitação que confiasse no produtor seria o produtor a assinar por si próprio, e
é a mesma frase que já estava escrita sobre o modo offline das linhas.

**Posto à prova a falhar, um estrago de cada vez, e cada um reposto:**

| Estrago | A conferência |
| --- | --- |
| um carácter editado em `src/data/agenda.json` | fecha, código 1: «os bytes em disco já não são os que atravessaram», com os dois resumos |
| um ficheiro do registo em falta em `src/data/` | fecha: «o registo diz que este ficheiro atravessou, e não há src/data/calendario.json» |
| o `agenda/agenda.json` do motor tocado | fecha **só** com `--with-origin`: «já não é o ficheiro do motor que atravessou»; offline passa, código 0, como nas linhas |
| o estado fora do fim do histórico | fecha: «o estado é "concluido" e a última entrada do histórico leva-o a "a_seguir"» |
| um item sem histórico | fecha: «sem histórico. É o histórico que prova que nada saiu em silêncio» |
| um critério a apontar para uma linha que não existe | fecha: «aponta para a linha "precos-da-habitacao-2099", que não existe em ledger/claims/» |
| um critério a nomear um acontecimento fora do calendário | fecha: «nomeia o acontecimento "dgal-endividamento-2099", que não está no calendário das fontes» |

#### A página, e a disposição que escolheu

`/agenda` · `/en/agenda`, **disposição A** (`IDENTIDADE.md` §3). A coluna de
rótulo leva o nome do estado e o corpo leva os itens: é a disposição das páginas
com secções nomeadas, e os quatro estados são exactamente isso. A **B** foi
posta de lado com razão escrita: a sua segunda coluna é o aparelho de *uma*
leitura (proveniência, ressalvas, o que a página não sabe), e aqui o aparelho
pertence a cada item e não à página; uma coluna de 300px vazia, ou a repetir-se
item a item, é o defeito que a §3 existe para impedir. **Sem cor nova**: os
estados são rótulos de texto em monoespaçada, e o que separa um item do seguinte
é fio e fundo.

As secções, por esta ordem: **Em curso · A seguir · Concluído · Retirado**. A
ordem é editorial e não do registo: quem abre a página quer saber o que se está
a fazer. `Retirado` está vazio, e o vazio está **desenhado**, nas duas edições:
«Nada foi retirado desta agenda até hoje. Quando alguma coisa for, fica aqui,
com a data e o motivo: um item não se apaga, muda de estado.»

Cada item traz o título, a pergunta registada, o porquê, os critérios, as datas,
e o histórico inteiro. Três coisas ficam ditas porque são decisões:

1. **A pergunta.** O registo prévio do motor escreve-se em inglês, e a `pergunta.en`
   é a `question` do registo, carácter a carácter, conferida pela A9 do
   exportador. A `pergunta.pt` é a edição portuguesa dessa mesma pergunta. A
   página diz qual é qual, na edição que o leitor tem à frente, em vez de
   deixar as duas parecerem iguais em estatuto.
2. **Os critérios com linhas vazias não se escondem.** Três dos seis quadros
   institucionais do estudo da habitação não têm linha nenhuma no livro-razão, e
   é o registo que o diz, com a razão escrita: a ausência é parte do que o
   estudo vai fechar. A página rende a nota.
3. **O item sem critério nenhum.** A entrada retrospectiva da página de Évora
   veio de uma decisão de direção e não de um quadro, de um calendário, de um
   leitor ou de uma correção. A página rende a ausência por palavras.

O calendário das fontes vai na **mesma página**, e não numa sub-página: quem lê
um item quer ver o acontecimento sem mudar de endereço, e o critério liga-lhe
por âncora. Primeiro o que tem data publicada pela fonte, por ordem de data, com
o endereço onde está escrita, a data em que foi lida e a frase que a diz;
depois o que a fonte não datou.

**O marcador, no calendário, não quer dizer «valor por confirmar».** Quer dizer
que a fonte não publica data nenhuma, e é assim que a página o rende: o marcador
e, ao lado, «a fonte não publica data», com a evidência indirecta por baixo
quando existe. São oito acontecimentos. O caso da ERSAR fica exactamente como
está no registo: nada foi lido, porque `ersar.pt` não respondeu.

Uma coisa que a página **não** rende, e é decisão: o campo `serie` de cada
acontecimento (códigos de conjunto de dados do organismo). É apontador de
máquina, não diz nada a quem lê, e `afecta_linhas` já mostra o que o
acontecimento move, com a porta para cada linha.

#### A oitava origem, e porque é que ela não é uma dispensa

Estados, datas e prosa do registo vão marcados `data-agenda="<id>.<campo>"`, e o
portão compara o texto renderizado com o campo do registo, **carácter a
carácter**. É a origem 6 (`data-linha-*`) aplicada um nível acima: ali um campo
de uma linha do livro-razão na página dessa linha, aqui um campo dos dois
registos que atravessaram na página que os renderiza. Vale **só** na página da
agenda, pela mesma razão que a 6 vale só nas páginas do livro-razão: noutro
sítio seria uma segunda porta para pôr texto de um registo em prosa corrente.

Os acontecimentos levam o prefixo `evento:` porque um item da agenda e um
acontecimento do calendário podem ter o mesmo id, e têm: `dgal-endividamento-2025`
é os dois.

O portão **lê os dois ficheiros com o seu próprio leitor** e traz a sua própria
cópia dos rótulos dos quatro estados. Se lesse `src/lib/agenda.mjs`, que é o
módulo da página, confirmava o módulo e não o registo, que é o erro que
`campo="study"` cometia até §1.24.

**As datas levam ainda `data-nonledger="data-da-agenda"`**, motivo novo em
`ledger/allowlist.yml` e o primeiro desde a página de município. §1.34 fez ponto
de honra de a lista não crescer, e este é um tipo de página com uma classe de
data que nenhum dos motivos existentes descreve: quando um item foi proposto,
decidido, criado e alterado, e quando uma fonte anuncia publicar. Não é uma
dispensa: a comparação prova que a data é a do registo, e o motivo declarado diz
porque é que uma data do registo pode aparecer numa página que só publica
valores medidos. São duas perguntas diferentes, e cada uma tem a sua marca.

**O que não sai do varrimento da ortografia.** `data-agenda` **não** entra na
lista do que a conferência da grafia ignora. A prosa destes registos é prosa da
casa, escrita do outro lado da fronteira mas pela mesma casa, e por isso é
varrida como qualquer outra: nenhuma forma anterior ao Acordo nas páginas em
pt-PT, nenhum travessão em nenhuma das duas edições. O motor já proíbe o
travessão (a sua conferência X2), e o «director» que existe no registo está
dentro da chave `en`, que rende numa página inglesa.

**Estragos plantados, cada um reposto:**

| Estrago | O portão |
| --- | --- |
| o estado renderizado do campo errado | fecha: «o campo "habitacao.estado" não foi transcrito fielmente do registo da agenda» |
| uma data com um dia a mais | fecha, com as duas: «no registo: 2026-08-10 · renderizado: 2026-08-11» |
| um item do registo que a página não rende | fecha três vezes: a contagem total, o item pelo nome, e a contagem daquele estado |
| uma contagem editada no registo da travessia | fecha: «a página rende 3 item(ns) em "Em curso" e o registo da travessia conta 2» |

As contagens do registo são comparadas com o que a página conta, **nunca usadas
como fonte da página**: é o que o contrato do motor pede, e é o que o portão faz
no fim do varrimento, nas duas edições.

#### As costuras que estavam à espera, e as duas que estavam partidas

O cabeçalho ganhou a linha que §1.39 deixou marcada por comentário: «Agenda: N
em curso · N a seguir», nas duas edições, com os dois números marcados
`data-prova` e cada um porta para `/agenda`. A rota entrou na tabela e
`portaDaAgenda()` passou a devolvê-la sem que fosse preciso tocar-lhe. O nó
AGENDA do instrumento encheu-se sozinho.

**Duas costuras estavam partidas, e ficam ditas.** `src/lib/prova.mjs` e o
portão contavam os estados da agenda com hífen (`em-curso`, `a-seguir`) e o
registo do motor escreve-os com traço baixo (`em_curso`, `a_seguir`): com o
ficheiro presente, as duas chaves davam **zero**. Não era possível descobri-lo
antes de existir um ficheiro a sério, que é precisamente o que §4.3 dizia da
agenda («o caminho está construído dos dois lados e nunca correu com um ficheiro
a sério»). Correu, e o caminho tinha um degrau.

**A regra 8 do Método** passa a provar-se com as quatro contagens da agenda, cada
uma porta para a página, e a contagem dos concelhos com página sai dessa linha:
é cobertura, e a regra 8 não é sobre cobertura. A chave continua na prova e vive
onde conta, no mapa e em `/municipios`. A porta da regra deixou de ser «Os
concelhos de Portugal» e passou a ser «A agenda inteira», porque as portas de
uma regra levam ao que a regra prova. E a frase do mecanismo foi lida contra a
página construída e ajustada ao que a página faz, nem mais nem menos: nomeia o
que cada item traz, e diz que onde não há critério, ou não há ainda decisão da
direção, a página di-lo.

#### A amarra das decisões: uma mudança de rumo não sai em silêncio

Regra de fecho 3 da direção, 2026-08-15, passada a mecanismo. Toda a entrada
deste registo **a partir da §1.38** declara, na primeira linha por baixo do
título, o que a decisão governa: `**Afecta:** sobre · metodo · agenda · nenhum`.
Para cada texto nomeado, a entrada carrega o resumo criptográfico do ficheiro
tal como ele estava quando a entrada foi escrita, e ou o texto mudou no bloco,
ou a entrada diz `**Sem alteração:**` com o motivo. Uma entrada que nomeie a
agenda cita a entrada do histórico que regista a mudança.

E depois a conferência que fecha o círculo, dentro do `ledger:check`: a **última**
entrada que governa cada texto tem de trazer o resumo do ficheiro tal como ele
está hoje. Se não trouxer, ou o texto mudou depois da última decisão que o
governa, ou a decisão foi registada contra outro texto.

As entradas anteriores à §1.38 **não** são conferidas, e é honesto: são
anteriores à regra, e carimbá-las agora seria escrever que declararam uma coisa
que ninguém lhes pediu. Só a §1, também: a §2 é como o portão funciona, a §3 é o
que esta construção verificou e a §4 é o registo dos defeitos, e nenhuma delas é
uma decisão a governar um texto.

A §1.38 recebeu `Afecta: nenhum`: é uma decisão sobre como se escreve, e não sobre
o que o Sobre, o Método ou a agenda dizem. A §1.39 recebeu `Afecta: sobre ·
metodo` com os resumos dos ficheiros como esse bloco os deixou, lidos do commit
que o fechou.

**Estragos plantados, cada um reposto:**

| Estrago | A conferência |
| --- | --- |
| um carácter mudado em `src/data/sobre.mjs` sem entrada nova | fecha: «o texto mudou depois da última decisão que o governa», com os dois resumos |
| a linha `Afecta` apagada da §1.39 | fecha duas vezes: a entrada não declara, e nenhuma entrada passa a governar o Sobre |
| `Sem alteração` sem motivo | fecha: «sem motivo escrito. O motivo é a metade que conta» |
| uma data do histórico da agenda que não existe | fecha: «cita "habitacao 2026-08-17" e o histórico desse item não tem essa data (tem 2026-08-16)» |
| uma entrada a nomear o Método com o resumo errado | fecha, nomeando a entrada e os dois resumos |

**A terceira cláusula vive no motor.** `sweeps/decisoes.py` corre no varrimento
mensal, lê o `DECISIONS.md` deste sítio e os dois ficheiros de texto, e imprime,
por texto, a entrada que o governa, o resumo carimbado, o resumo de hoje, e OK
ou DIVERGE. Só relatório, e sai com 0 mesmo quando diverge: o código de saída da
corrida mensal pertence à vigilância que precisa dele. Duplica a conferência do
sítio **de propósito**: uma regra conferida só pela construção que ela governa é
conferida pela coisa que ela existe para constranger. Corrido à mão a
2026-08-16:

```
DECISOES  sobre   §1.39  stamped 44362a8d7409  now 44362a8d7409  ->  OK
DECISOES  metodo  §1.40  stamped 4d218817cc4d  now 4d218817cc4d  ->  OK
DECISOES: 2 governed text(s), each agreeing with the decision that governs it.
```

E com um carácter plantado em `sobre.mjs`, a linha que ele imprime é
`DECISOES  sobre   §1.39  stamped 44362a8d7409  now 7e72fa40afce  ->  DIVERGE`.

#### Os cortes de palavras, e a régua nas duas construções

Três cortes adiados desde o `BRIEF-confianca.md` §6.3. Nenhum muda um valor, um
selo ou uma frase de um trabalho.

1. **A política das correções sai das páginas de linha.** Estava dita por
   inteiro em 132 páginas de linha, nas duas edições, num sítio onde ela não se
   decide. Passa a uma linha e a porta: «Correções: públicas, datadas,
   permanentes · A política inteira →». A porta que o portão conta em todas as
   páginas não mexeu: o que saiu foi o parágrafo, não a porta.
2. **A promessa de não ordenar partidos** vive na regra 10 do Método e na página
   do município, e nas 61 páginas de linha com atribuição fica o rótulo e a
   âncora para a regra 10.
3. **O aparelho de Évora** perde as quatro ressalvas que repetiam, em versão
   curta, o que «Método e ressalvas» já diz por inteiro e com a frase do
   trabalho que a sustenta. Ficam onde estão ditas com a sua prova, e o aparelho
   ganha a porta para a secção, **com o rótulo dela e sem uma palavra nova**. De
   316 palavras para 262 na edição portuguesa, de 305 para 250 na inglesa, e de
   dez itens para seis em «o que esta página não sabe».

A régua passou a saber o que é `data-agenda`: um excerto do calendário das
fontes é a fonte a falar, e contá-lo como moldura da casa mediria a coisa
errada. Entrou na lista das origens declaradas, ao lado de `data-claim` e de
`data-verbatim`. E, porque a régua mudou, foi **corrida nas duas construções**,
a de B e a de agora, sobre uma reconstrução da árvore de B.

| Medida | Antes (B, 305 páginas) | Depois (307 páginas) |
| --- | ---: | ---: |
| Frases de moldura distintas | 80 | **75** |
| Ocorrências | 2 345 | **2 353** |
| …sem a porta das correções | 2 040 | **2 046** |
| Páginas com porta de correções | 305 de 305 | **307 de 307** |
| Palavras de moldura | 31 852 | **24 858** |
| Valores da primeira página sem selo | 0 | **0** |

**Os dois cortes das páginas de linha não movem as distintas, e a razão
importa:** cada frase cortada foi substituída por uma linha, e uma linha com
trinta ou mais carácteres continua a ser uma frase de moldura para esta régua. O
que esses cortes mudaram foram as **palavras**. As cinco distintas que
desaparecem são outra coisa: as descrições dos dois trabalhos que passaram a ser
transcrição (abaixo, nos defeitos pequenos) saíram da conta ao ganharem
`data-verbatim`, que é uma origem declarada. E as oito ocorrências a mais são a
agenda: duas páginas novas, cada uma com a linha do cabeçalho, a porta das
correções e os rótulos das secções.

**Esta é a linha de base** que o `gate:identidade` vai segurar quando for
construído (fase 4): 75 frases distintas, 2 353 ocorrências, 24 858 palavras de
moldura, 307 de 307 páginas com porta de correções. A régua **não mede** frases
de meta-comentário: não tem essa conta e não se inventou uma aqui, porque uma
medida nova sem um «antes» medido com ela não compara nada. Fica por construir,
e é trabalho de quem escrever o `gate:identidade`.

#### A ortografia das linhas cruzadas, fechada na origem

§4.1 deixou isto ao agente que trabalha o motor neste mesmo bloco, e está feito.
A prosa da casa das 70 linhas cruzadas converteu-se onde foi escrita, que é
`publisher/manifest.evora.json`, e voltou por reexportação. Quatro `derivation`
com «tecto» passam a «teto». Cinco entradas de correção do PRR, nas duas
edições, trocam o travessão por dois pontos: é um aposto que explica a oração
anterior. **Nenhuma palavra acrescentada, nenhuma retirada, nenhum valor
tocado**, e campos da casa só: nem um `excerpt`, nem um `document.title`, nem uma
`source`.

Do lado da fonte, de **19 ocorrências para 5**; das visíveis nas páginas, de
**10 para 0**. `ortografia/restantes.yml` fica **vazio**, que é o estado a que uma
lista destas devia chegar, e continua a existir para parar a construção à
primeira ocorrência nova. As cinco que ficam estão todas no campo `note`, que
`ledger/README.md` declara não publicado: duas são o título de um quadro do
documento citado entre plicas, e transcrição não se converte; uma é inglês
(«no actual completion date»); duas são prosa do motor que ninguém lê.

**As correções sobreviveram byte a byte**, e foi conferido linha a linha contra
uma cópia de antes: os seis campos, a data, a natureza, os dois endereços e as
duas edições do motivo, iguais menos o carácter que a passagem foi lá trocar.

**Uma coisa que esta corrida descobriu, e é uma dívida do motor.** A V10 do
exportador de linhas não tem caminho para «a mesma correção, com outra
redação». O bloco `corrections` do lado do sítio é levantado byte a byte e só
entradas novas do manifesto são acrescentadas, por desenho, para não reescrever
o que outra pessoa escreveu. Uma correção **reescrita** no manifesto chega cá
como uma **segunda entrada do mesmo acontecimento**, e foi o que a primeira
reexportação fez, com a duplicação à vista no diff. O caminho que existe é
regenerar a linha, e só é seguro porque o registo mostra `site_corrections`
vazio nas setenta: nenhuma correção nasceu do lado do sítio, por isso nada se
perde ao deixar o exportador reescrever a linha inteira a partir do manifesto.
Foi conferido antes de o fazer. **Com uma correção nascida do lado do sítio,
este caminho perdia-a**, e é isso que fica por resolver do lado do motor.

#### Os defeitos pequenos, fechados

**Duas descrições diziam ser a frase de abertura do documento e não eram.** As
páginas de «Os Pelouros» e de «Prometido, Pago, Auditado» imprimiam «Descrição:
frase de abertura do documento» por cima de uma reformulação. **Isto corrige o
item 6 da §1.35**, que registou o rótulo como se a afirmação fosse verdadeira; o
registo não se reescreve, e a correção fica aqui.

As duas passam a ser a frase, lida do próprio ficheiro em `studies-src/`, e a
frase entra por `src/data/verbatim.mjs`: o portão compara-a com o registo,
carácter a carácter, em todos os sítios onde ela rende. A descrição inglesa de
«Os Pelouros» **não pode** ser a frase, porque o documento não tem edição
inglesa: é tradução da casa, e a página passa a dizer isso. O rótulo passou a ser
**por edição** e não por trabalho, que é a razão de o defeito ter sido possível.

A frase de «Prometido, Pago, Auditado» traz a data da recolha, e é por isso que
entra por `verbatim.mjs` em vez de ser texto corrido. No `<head>` não há markup
onde pendurar a marca, e o portão passa a tolerar lá as citações registadas pela
cadeia exacta, como já tolerava os títulos de estudo: uma frase que não esteja em
`verbatim.mjs` continua a fechar o portão.

**Sete linhas do Eurostat** diziam «nama_10r_2gdp, actualizado 2026-02-10».
§1.38 tinha-as deixado por ser campo transcrito; a leitura estava errada, porque
a palavra é da casa e não do Eurostat, que publica em inglês. Passam a
«atualizado». É um afinamento de apontador (mesmo sítio, outra grafia) e por
isso **não leva entrada de correção**, pela regra do silêncio (§1.36,
`ledger/README.md`). São linhas nativas, não cruzadas, e isso foi conferido antes
de lhes tocar.

**O marcador estava definido duas vezes**, em `src/data/studies.mjs` e em
`src/lib/ledger.mjs`, com os dois valores iguais por sorte e não por construção.
Passa a ter uma casa, `src/data/marcador.mjs`, e os dois módulos reexportam-no.
A identidade diz que há um marcador; agora há uma definição.

**O sinal de tempo do cabeçalho passa a nomear o painel.** Dizia «Painel
reconferido a», e fora da primeira página «o painel» é ambíguo: a página do
município publica de propósito nenhuma data de frescura própria (§1.34). Passa a
«Painel europeu reconferido a» / «European panel re-checked on», e a frase passa
a ser **porta** para a secção da primeira página onde estão os valores que essa
data cobre. É a mesma âncora que a chave `painel_reconferido_em` da prova já
usava.

E a §3 dizia «Treze documentos reais alojados» quando a construção conta quinze.
Essa secção é o registo da construção de hoje, e passou a dizer o que a
construção diz.

#### O teste dos dois minutos, marcado outra vez

Sobre o sítio construído, sem inflação:

| | O que se pede | Hoje |
| --- | --- | --- |
| (a) | perceber o que o sítio é | **passa**. A linha do cabeçalho está em todas as páginas, e `/sobre` diz em duas frases o que é e que é escrito por inteligência artificial |
| (b) | encontrar o seu concelho e ver medidas com fontes | **parcial**. Os 308 estão no índice e no mapa; 307 dizem «sem página ainda». Quem é de Évora vê oito medidas, cada uma com o selo para a sua linha |
| (c) | abrir um estudo e ler a versão curta | **parcial**. 5 dos 11 trabalhos têm leitura escrita, com relance e leitura breve; os outros seis são página de arquivo com o documento |
| (d) | ver quando cada coisa foi conferida e como corrigir | **passa**. O sinal de tempo em todas as páginas, agora com nome e porta; «Lido a» em cada linha; a porta das correções em 307 de 307 páginas e a política em `/correcoes` |

É o que o roteiro esperava. Nada aqui subiu de nota por causa deste bloco, e o
que subiu foi a honestidade de (d): a data deixou de ser ambígua fora da
primeira página.

#### O que fica aberto

Do lado do motor, escrito no contrato da travessia e repetido aqui porque é a
página que o expõe:

1. **Não há histórico do calendário.** Um acontecimento que passa e é
   substituído pelo do ano seguinte não deixa registo do que estava lá antes.
2. **Não há ligação automática entre um acontecimento e a linha que ele move.**
   `afecta_linhas` é escrito à mão e conferido contra o livro-razão: garante-se
   que o que lá está existe, não que esteja completo.
3. **A agenda não sabe quando um item está atrasado.** Não tem prazos.
4. **Oito acontecimentos sem data**, porque a fonte não publica nenhuma, e a
   ERSAR **não foi lida de todo**: `ersar.pt` não respondeu.
5. **A pergunta do estudo da habitação espera a leitura da direção**, e o registo
   prévio está iniciado e **não selado**: selar antes dessa leitura seria
   certificar que a pergunta precedeu a prova quando o que precede a prova ainda
   pode mudar.
6. **A V10 e a correção reescrita**, acima.
7. **A ortografia continua revogável na pré-visualização** (§1.38), e agora a
   revogação também atravessa o manifesto do motor.

E o que a passagem da ortografia deixou de fora, por escolha e com motivo, e que
o agente da ortografia tinha listado como «fora do âmbito»:

- **identificadores internos com grafia anterior**: `taxa-de-actividade-2025`,
  `taxa-de-cambio-efectiva-real-2025`, `data-de-actualizacao` já renomeado. Um id
  é um endereço: mudá-lo parte ligações e obriga a reencaminhamento (§1.29);
- **a «excepção» do próprio `IDENTIDADE.md` §6**, que é documento do repositório
  e fica na grafia em que foi escrito;
- **uma `note` em duas línguas ao mesmo tempo** numa linha do PRR;
- **os quatro travessões em `excluded[].reason`** do manifesto do motor, que é o
  registo sobre o que **não** atravessa e não rende em página nenhuma;
- **as chaves de cadeia mortas** que o agente do Sobre listou, por arrumar.

### 1.41 A revisão cruzada do bloco V, e o que ela mudou

**Afecta:** sobre · metodo
**Texto:** sobre 0507f5f3d6af · metodo 24c5401cfd85

Duas revisões de outra família de modelos leram este ramo: uma leu o `diff`
inteiro, outra leu as quatro páginas novas com quatro defeitos plantados lá
dentro e encontrou os quatro, o que é o que dá crédito ao resto do que disse.
Esta entrada é o que se fez com o resultado: o que foi corrigido, o que foi
lido e mantido com razão escrita, e os limites que ficam por escrito em vez de
ficarem por dizer.

*Este registo segue a grafia que §1.38 fixou.*

#### A prosa da agenda deixa de repetir uma medição

A origem 8 provava que o texto da agenda é, carácter a carácter, o do registo
que atravessou. Não provava a outra coisa: que o registo não trouxesse, em
prosa corrente, um valor que tem linha e selo noutro sítio da mesma página. E
trazia. «A linha publica 17,6» e «O índice de dívida de Évora está em 105,5%»
eram medições sem selo, e a fidelidade da travessia não lhes dá proveniência.

**Do lado do motor**, a prosa foi reescrita para que a medição chegue ao leitor
por onde tem de chegar: pelas linhas do critério, com o selo que abre cada uma.
Saíram o «17,6» restated, o «105,5%» e a cláusula interpretativa que vinha
colada a ele («descer abaixo de cem seria o fim da era de resgate»), a
repetição de «308 concelhos» e «os outros 307», e a citação do estudo que
trazia a votação («2 votes to 5»), substituída pela outra citação que já lá
estava e diz o mesmo facto. As datas escritas por extenso passaram a ISO, que é
como a casa as escreve em todo o lado.

**Do lado do sítio**, o portão passou a recusar: nenhum número dentro de um
elemento `data-agenda` pode ter a sequência de algarismos de um **valor** do
livro-razão, com a mesma normalização com que a origem 1 confere um
`data-claim`. **Estrago plantado:** repôs-se «A linha publica 17,6.» na nota do
critério; o portão fechou com «a prosa da agenda repete um valor do
livro-razão: "17,6" é o valor da linha "precos-da-habitacao-2025"». Reposto.

**O limite, e é estreito de propósito.** A conferência recusa **os valores do
livro-razão**, e mais nada. A prosa da agenda continua a poder trazer
algarismos que não são medições publicadas: códigos de conjuntos de dados
(`tespm140`), ordinais («2.º trimestre»), números de diploma, e um limiar
citado de um quadro institucional que não coincida com nenhum valor publicado
(«with a threshold of 9%» passa porque `9` não é valor de linha nenhuma; se
viesse a ser, a nota teria de citar o limiar pelo campo `note` da linha). E há
uma dispensa declarada, uma só: o campo `origem_da_data.excerto`, que é a frase
da fonte que diz a data, citada palavra por palavra e renderizada em
`<blockquote>`. Reescrevê-la para lhe tirar um algarismo seria reescrever a
prova. **Um valor escondido dentro de um excerto passa por aqui**, e a defesa
que resta é a de sempre: o excerto está preso por resumo criptográfico ao
ficheiro do motor, e o que ele cita é a data e não a medição.

#### O histórico da agenda passa a ser append-only, e o calendário a declarar saídas

O exportador conferia que havia histórico e que o `estado` era o `para` da
última entrada. Não conferia que o histórico fosse uma **cadeia**: as
transições podiam não encaixar, as datas podiam andar para trás, `entrada` e
`ultima_alteracao` podiam dizer qualquer coisa, e uma entrada passada podia ser
reescrita sem deixar rasto. Cinco conferências novas (H1 a H5) e uma do
calendário (C6):

| | O que passou a ser provado |
| --- | --- |
| H1 | `historico[n].de` é o `para` da entrada anterior; a primeira vem de `null` |
| H2 | as datas do histórico nunca andam para trás |
| H3 | `entrada` é a data da primeira entrada e `ultima_alteracao` a da última |
| H4 | o histórico só cresce: o registo da travessia guarda, por item, quantas entradas atravessaram e o resumo dessas entradas, e a travessia seguinte recusa um histórico mais curto ou um prefixo diferente |
| H5 | um acontecimento que sai do calendário sai por `saidas`, com `substituido_por` ou `retirado`, e um motivo |
| C6 | um acontecimento com marcador diz **porquê** não tem data: `nao_publica` ou `nao_lida` |

H4 é a que fecha o defeito de fundo. A A6 comparava esta exportação com o
ficheiro de destino, que qualquer pessoa pode editar; H4 compara-a com o
**registo da travessia**, que é o que o `check:cruzamento` prende, e compara o
passado e não o presente. `ledger/cruzamentos/agenda.json` passou a levar
`historia` (por item: quantas entradas e o resumo delas) e `eventos` (os ids do
calendário).

**Estragos plantados, cada um provado a falhar e reposto** (agora 35
conferências em `publisher/export_agenda_test.py`, 31 delas contra um estrago):
uma entrada de histórico passada reescrita depois de ter atravessado
(«A past entry was rewritten»); um histórico mais curto do que o que atravessou
(«A history only grows»); um acontecimento do calendário a desaparecer em
silêncio («a departure has to be declared»); a mesma saída **declarada**, e
aceite; uma transição partida; uma primeira entrada vinda de um estado; datas
fora de ordem; `ultima_alteracao` a 2099; `entrada` um dia depois da primeira
entrada do histórico; o marcador sem razão; a razão ao lado de uma data.

As três primeiras (cadeia, ordem, limites das datas) e a C6 são **reconferidas
do lado do sítio**, no `check:cruzamento`, pela mesma razão que as outras seis
que já lá estavam: uma conferência de aceitação que confiasse no produtor seria
o produtor a assinar por si próprio.

#### A amarra das decisões: o outro sentido, e o que ela não pode fazer

A `check-ledger.mjs` já recusava o texto que muda sem decisão que o nomeie.
Faltava o inverso: uma entrada que declara `Afecta: metodo`, carimba o **mesmo**
resumo da entrada anterior e não diz `Sem alteração`. Lida à letra, é uma
decisão que governa um texto que não mexeu, sem dizer porquê. **Estrago
plantado:** duplicou-se o carimbo da §1.39 numa entrada nova sem
`Sem alteração`; a amarra fechou com «a decisão diz que afecta o texto e o
texto não mudou; ou muda, ou diz porquê». Reposto.

**O limite, escrito porque a revisão o apontou e tem razão.** Esta amarra corre
sobre o ficheiro que está em disco e sobre o `DECISIONS.md` que está em disco.
O que ela proíbe é a mudança **silenciosa**: o texto mexer sem que nenhuma
entrada o nomeie. O que ela **não** proíbe é a reescrita deliberada da própria
entrada por quem tem direito de escrita no repositório: essa reescreve o
carimbo, e o resumo volta a bater certo. Para isso a linha de defesa é outra, e
é o git: `sweeps/decisoes.py`, no motor, passou a fazer uma **auditoria de
histórico** quando o `.git` do sítio está acessível. Para cada texto governado
compara o commit que mexeu no ficheiro pela última vez com o commit que
introduziu no `DECISIONS.md` a linha do carimbo actual, e diz OK ou DIVERGE. É
report-only por contrato do varrimento mensal, e corre uma vez por mês, de
fora da construção que governa.

#### Todas as páginas construídas levam a porta para o Sobre, e agora é verdade

A regra 9 do Método diz «todas as páginas construídas levam a porta para lá», e
havia **quinze** páginas onde ela não estava: as dos documentos de estudo, que
saem do varrimento antes de a conferência correr. A escolha era entre mudar a
regra e cumprir a regra. Cumpriu-se: **a faixa do observatório passou a levar a
porta para o Sobre**, e o portão passou a exigi-la ali. A faixa é markup nosso
e não entra na comparação com a origem; entra no `esperado` que o portão
recalcula, dos dois lados da igualdade, e por isso a promessa mais forte que o
sítio dá sobre um documento (é o ficheiro de origem mais a faixa, carácter a
carácter) fica intacta. Medido depois: **0 de 322** páginas construídas sem a
porta, contra 15 de 322 antes. **Estrago plantado:** retirou-se a ligação da
faixa; o portão fechou nas quinze páginas de documento com «a faixa do
observatório não tem ligação para "/sobre"». Reposto.

#### O portão da agenda prova o item inteiro, e a secção onde ele está

Renderizar **um** campo de um item dava o item por presente: apagar o bloco do
histórico inteiro deixava a contagem certa e passava. E a secção de cada item
era calculada do **registo**, não da página: um item posto debaixo do cabeçalho
errado passava, desde que o seu rótulo de estado estivesse certo. Duas
conferências novas: os campos obrigatórios de cada item são derivados do
próprio registo (título, estado, porquê, as quatro datas, a pergunta e o estado
do registo prévio onde existem, cada critério com `quadro` ou `nota`, e **cada**
entrada do histórico com a sua data e o seu motivo), e a secção é lida a subir
no DOM. **Estragos plantados:** apagou-se o bloco do histórico de um item, e o
portão fechou com «o item "habitacao" não rende "habitacao.historico[0].data"»;
moveu-se um item para a secção errada, e fechou com «o item
"evora-contas-2026" está na secção "concluido" e o registo põe-no em
"em_curso"». Repostos.

#### A ortografia: os plurais que faltavam, e as formas só de ida

A lista tinha `concepção` e não tinha `concepções`. A conferência era um
vocabulário finito com buracos, e uma flexão óbvia passava. A regra da lista
mudou, e está escrita no seu cabeçalho: **a flexão regular de uma forma
atestada não pede atestação própria**. O plural regular e o feminino regular de
um par já consultado derivam-se pela regra da língua e entram sem consulta
nova; o que continua a exigir consulta forma a forma é uma palavra nova e uma
flexão irregular. De **196 pares para 252**. As contagens sobre a árvore actual
não mexeram: 0 fora da grafia da casa, 5 no restante, 45 avisos em `note`, 16
em citação, antes e depois.

E a reversibilidade prometida em `IDENTIDADE.md` §9 passou a ser dita com
verdade. A passagem inversa convertia `ato → acto` cegamente, e «Eu ato a
corda» é o verbo *atar*. Um par pode agora ser marcado `so_ida: true`: no
sentido «anterior» a ferramenta assinala-o e não lhe toca, como já fazia à
lista `manuais` e aos travessões. Hoje há um: `acto → ato`. A frase da §9 passou
a dizer que **a reversão é uma corrida da ferramenta mais uma passagem à mão
sobre as formas listadas como só de ida**. **Estrago plantado:** uma frase com
«Eu ato a corda.», «O acto foi publicado.», «uma correção» e «uma direção»,
passada pelo comparador inverso. Ele converteu `correção → correcção` e
`direção → direcção`, e sobre `ato` não converteu nada: assinalou-o para a mão,
que é o que `so_ida` faz. `acto` não aparece na conta porque o sentido inverso
procura as formas do Acordo, e `acto` não é uma delas. A frase que aqui estava
até 16.08.2026 dizia que ele tinha sido convertido, e isso não aconteceu
(revisão cruzada 2, #11). Corrigido aqui em vez de apagado.

#### A etiqueta do selo passa a ser comparada, e as dispensas por citação são contadas

`data-nonledger="proveniencia"` era uma dispensa a sério: qualquer prosa
embrulhada nela escapava ao varrimento de algarismos **e** ao da ortografia. O
motivo declarado diz que a etiqueta é «gerada a partir do próprio livro-razão»,
e o portão acreditava na frase. Passa a comparar: o conjunto de rendições
legítimas é finito, calcula-se do registo dos trabalhos, e o que não estiver
nele fecha a construção. **Estrago plantado:** embrulhou-se prosa arbitrária
naquela marca; o portão fechou com «data-nonledger="proveniencia" com texto que
a etiqueta do selo não sabe escrever». Reposto.

A dispensa de «…» fica, porque é a regra da casa sobre citação, e passa a ser
**contada em voz alta** na linha de fecho do portão, para que não cresça em
silêncio: hoje são **8** ocorrências. **O limite:** o que está entre «…» não
precisa de fonte registada; a aspa é uma afirmação de quem escreve, e o que a
conferência garante é que o texto não se converte, não que a citação exista.

#### `data-prova` compara o texto, e `prova.json` é relido inteiro

A comparação era da sequência de algarismos, e por isso «1,32», «-132» ou «132
e picos» comparavam iguais a `132`: o defeito plantado que a §1.39 registou
(132 → 133) falhava, e a vírgula, o sinal e a escala não. Passa a comparar-se o
texto renderizado com o que o portão escreve. E a releitura final de
`dist/prova.json` deixou de contar chaves: relê chave a chave, com o nome, o
valor e a vista. **Estragos plantados:** rendeu-se «1,32» onde o portão conta
`132`, e o portão fechou com «foi renderizado como "1,32" e o portão escreve-o
"132"»; alterou-se um valor no ficheiro depois de escrito, e a releitura fechou
com «"afirmacoes": escrito 999, calculado 132». Repostos.

#### As ligações internas: as relativas e as âncoras

A conferência só via `href` que começassem por `/`. «agenda» e «../sobre» eram
invisíveis, e uma âncora inexistente também. Passa a entrar tudo o que não
traga esquema, um endereço relativo resolve-se contra a página onde está (com a
distinção que o navegador faz entre uma página servida de `<dir>/index.html` e
uma servida de `<nome>.html`), e a âncora é conferida contra os `id` da página
de destino. Hoje: **9142** ligações internas conferidas, **0** relativas (o
sítio escreve-as todas absolutas) e **1030** âncoras. **Estragos plantados:**
uma ligação relativa partida, e o portão fechou com «a ligação interna
"metodo-que-nao-existe" não corresponde a nada construído em dist/ (resolvida
contra "/agenda/" dá "/agenda/metodo-que-nao-existe")»; uma ligação para uma
âncora que não existe, e fechou com «aponta para a âncora "#nao-existe", que
não existe em "/agenda"». Repostos.

#### As palavras que diziam mais do que a prova

- **Regra 2.** A prova dizia «linhas vindas do motor: 70» ao lado de «linhas
  publicadas: 132», e deixava o leitor a concluir que as outras vieram de outro
  lado. Vieram do mesmo sítio: foram escritas antes de o tubo existir, e o que
  lhes falta é o registo da travessia. A prova passa a dizer as duas coisas:
  «linhas atravessadas do motor com registo: 70 · linhas anteriores ao tubo:
  62». A chave nova (`linhas_anteriores_ao_tubo`) é calculada como as outras e
  reconferida pelo portão por conta própria.
- **Regra 10.** O rótulo «valores creditados a quem os decidiu» dizia mais do
  que a contagem estabelece: o campo mostra atribuição, não decisão. Passa a
  «valores com crédito atribuído na linha». E o mecanismo ganhou a cláusula que
  faltava: as frases sobre o financiamento e sobre a publicidade **não têm
  máquina nenhuma por trás**, são regras da casa como a primeira, e valem por
  estarem escritas e por quem responde por elas.
- **Inglês.** «organism» passou a «body» (é uma instituição, não um ser vivo);
  «standing in relation to the world outside» a «position in relation to the
  outside» (a palavra inglesa acrescentava uma avaliação que a portuguesa não
  pede); «what the official sources are about to publish» a «what the official
  sources will publish»; «It does not rank parties» a «It does not rank or
  classify parties».
- **`/agenda`.** A segunda frase da abertura falava de bytes, resumos
  criptográficos e da construção a fechar, e afirmava um comportamento que os
  dois registos não guardam. Passa a «A lista e o calendário são dois registos
  do motor de investigação, publicados tal como atravessaram.»
- **`/correcoes`.** A política era dita três vezes: na abertura, no bloco da
  política e no rodapé. A abertura perdeu a repetição e ficou a frase que não é
  a política: «Corrigir em silêncio é a forma mais barata de mentir.» O bloco
  fica, e a porta de todo o sítio também, que é regra.
- **A pergunta fixada.** O rótulo dizia «A pergunta é fixada no motor antes da
  recolha» ao lado de um histórico que diz que o registo prévio **não foi
  selado**: a mesma página a contradizer-se. O registo passou a carregar
  `registo_previo_estado` e `registo_previo_em`, conferidos contra o ficheiro
  do registo prévio (A10: `selado` exactamente quando existe `core_sha256`), e
  a página tem duas frases, uma para cada estado. Hoje sai a segunda: «A
  pergunta fica fixada no motor antes da recolha; esta ainda não foi selada.»
- **A ERSAR.** A página dizia «a fonte não publica data» sobre uma fonte que
  **não chegou a ser lida**: `ersar.pt` não respondeu. Um tempo esgotado não é
  prova sobre o calendário de ninguém. O registo passou a distinguir as duas
  coisas (C6) e a página tem uma frase para cada: «a fonte não publica data» e
  «a fonte não foi lida».
- **Os caminhos do motor na prosa.** «content/08 Évora Mandates/, edição
  inglesa, linhas 1101 a 1108» é um endereço dentro do motor: não abre, e não
  diz nada a quem lê. Um critério passa a poder nomear `documentos`
  (`slug` + `edicao`), o sítio renderiza-os como porta para
  `/estudos/<slug>/documento` com o título do arquivo, e a A11 confere que o
  ficheiro existe. As citações passaram a ser as do documento **alojado**,
  palavra por palavra. O caminho do registo prévio saiu pela mesma razão, e no
  seu lugar está o estado.

#### Lido, e mantido, com a razão escrita

- **A mobília do cabeçalho no `/sobre`** (o sinal de tempo e a linha da agenda)
  e a porta das correcções no rodapé daquela página. A revisão leu-as como
  contagens e como uma terceira formulação da política numa página que devia
  parar em duas frases. São **mobília por regra**: entram pelo invólucro em
  todas as páginas construídas, e uma excepção para o `/sobre` seria uma página
  fora da regra do sítio. Fica para o juízo da direcção na pré-visualização.
- **`correcoes-publicadas` como linha selada da casa.** A revisão diz que uma
  contagem do próprio sítio devia ser porta (`data-prova`) e não linha com
  selo. As duas coisas são legítimas e estão declaradas: esta contagem é a
  mecanismo mais antigo, tem linha no livro-razão, tem amarra ao registo, e
  trocá-la agora era trocar uma garantia por outra sem ganhar nada. Fica.
- **O zero honesto da regra 6** («releituras independentes registadas: 0», com
  o limite ao lado a dizer que o campo não existe no formato) e **a prova por
  frase da regra 9**. A revisão diz que um zero e uma frase não são provas. São
  o estado, dito como ele é; o corte, se houver, é da direcção na
  pré-visualização, e o registo já diz porquê (§1.39).
- **O mecanismo da regra 1** («não é imposta por uma máquina: é imposta por
  estar à vista»). A revisão chama-lhe confundir inspeccionabilidade com
  imposição. É exactamente o que a frase diz de si própria, e é honesto: a
  regra não tem máquina, e diz que não tem.

#### O que fica aberto, e não foi tocado aqui

- **A antiguidade e a autoridade de uma fonte não são conferidas por máquina.**
  A regra 1 diz «só fontes oficiais»; nenhum validador classifica uma fonte
  como oficial, e as contagens da prova contam fontes e tipos de documento, não
  elegibilidade. Continua a ser o que a regra diz de si própria.
- **Os valores antigo e novo do registo de correcções** aparecem sem selo, com
  a origem 5 a conferi-los campo a campo contra o livro-razão. E **as revisões
  de proveniência** apareciam como nove identificadores sem uma contagem com
  porta. As duas coisas foram apontadas pela revisão e não foram triadas para
  este bloco; a segunda foi fechada na §1.42 (a contagem passou a ser uma porta
  `data-prova`, e cada identificador do registo passou a levar à sua linha), e a
  primeira continua aberta.
- **A prosa da agenda pode trazer algarismos que não são valores do
  livro-razão**, e a dispensa do `origem_da_data.excerto`, ambas acima.
- **A amarra das decisões governa dois ficheiros**, `sobre.mjs` e `metodo.mjs`.
  O resto da superfície pública (as cadeias de `strings.mjs`, os registos da
  agenda, os títulos) não tem decisão que o governe. Os registos da agenda
  ganharam neste bloco a sua própria amarra, que é outra e é criptográfica
  (H4). As cadeias não ganharam nada.
- **Este bloco mudou a prosa dos dois registos da agenda e não mudou nenhum
  estado**: não há entrada nova no histórico de item nenhum, e por isso o
  `Afecta:` desta entrada não nomeia a agenda. O que prende essa prosa é o
  resumo criptográfico da travessia, não esta amarra.

### 1.42 Segunda revisão cruzada do bloco V

**Afecta:** metodo
**Texto:** metodo 986db821f7d1

A mesma família de modelos que leu o ramo na §1.41 voltou a lê-lo depois das
correcções: uma revisão leu o `diff` do que a §1.41 mudou, outra releu as
quatro páginas com dois defeitos plantados lá dentro, e encontrou os dois. O
veredicto foi «não integrável», e as razões eram três: a linha de base da
travessia podia ser apagada, uma unidade colada a um número contornava a
conferência da prosa, e a auditoria do git dizia OK exactamente à mudança que
existe para apanhar. Esta entrada é o que se fez com isso.

*Este registo segue a grafia que §1.38 fixou.*

#### O registo da travessia deixa de poder perder o seu passado

A H4 comparava o histórico de cada item contra o **registo da travessia**, que
é o que prende o passado. Só que o exportador perguntava ao registo «tens
`historia`?», e um registo sem esse campo respondia «não», e a corrida seguia
como se fosse a primeira travessia. Apagar um campo apagava a promessa.

| | O que passou a acontecer |
| --- | --- |
| H4 | a pergunta passou a ser «existe registo?». Um registo em disco sem `historia` ou sem `eventos` **pára a corrida**: perdeu a linha de base, e um passado que não se pode comparar não é um passado |
| H4 | o exportador também recusa **escrever** um registo sem esses campos: o que sai leva sempre com que a travessia seguinte se há-de medir |
| H5 | `eventos` no registo passou a ser **cumulativo** (todos os ids que alguma vez atravessaram, e não só os de hoje) e ganhou `saidas`, também cumulativo. Uma saída declarada numa travessia não pode ser apagada na seguinte |
| X3 | a idempotência passou a comparar o registo da travessia **onde ele é mesmo escrito**. Comparava-o em `<destino>/cruzamentos-agenda.json`, que não existe, e portanto não comparava nada |

O defeito que H5 fechava era subtil e vale escrevê-lo: um acontecimento saía do
calendário com a sua razão escrita, a travessia aceitava; na travessia seguinte
o registo já só guardava os ids de hoje, e apagar a razão passava. O
acontecimento tinha desaparecido com uma nota que já ninguém obrigava a existir.

**Estragos plantados**, todos em `publisher/export_agenda_test.py` e a correr a
cada `sweeps/monthly.sh`: registo sem `historia` e registo sem `eventos` («the
crossing record has no `historia` (H4). The record of the crossing lost its
history»); uma saída declarada e depois apagada («was declared in `saidas` on a
previous crossing and is not declared now (H5)»); o registo em disco diferente
do que a corrida escreveria («cruzamentos-agenda.json: the origin files have not
changed, but this run would write different bytes (X3)»). Do lado do sítio,
`check-cruzamento.mjs` passou a exigir os mesmos campos, e apagar `historia` do
ficheiro fecha a conferência offline com «o registo da travessia perdeu a sua
história: falta "historia"». Repostos. De 26 para 31 conferências no exportador,
e de 34 para 43 casos no ficheiro de saúde, 40 deles contra um estrago plantado.

#### O selo, a data e o documento passaram a ser conferidos pela forma

A A10 aceitava qualquer cadeia não vazia como selo de um registo prévio: com
`core_sha256: "x"` a página dizia «selada». E comparava `registo_previo_em` com
`registered` sem perguntar se algum dos dois era uma data: `"not-a-date"` igual
a `"not-a-date"` passava. Um selo é agora 64 caracteres hexadecimais, e as duas
datas são datas ISO.

A A11 pedia ao sistema de ficheiros, e o sistema de ficheiros responde a um
caminho: `../studies-src/<outro>` existe em disco e não é um trabalho do arquivo
deste sítio. Passou a ler `src/data/studies.mjs`, que é onde o sítio decide o
que aloja, e a exigir três coisas por ordem: o `slug` é um nome do arquivo (sem
separador e sem `..`), a `edicao` é uma das daquele trabalho, e o ficheiro
existe. Só a terceira pergunta é sobre disco.

**Estragos plantados:** `core_sha256: "x"` com `estado: selado` («A seal is the
64 hexadecimal characters of a sha256»); `registered` e `registo_previo_em` a
`"not-a-date"` («is not an ISO date»); `slug:
"../studies-src/evora-economia-investidores-portas-abertas-2026"` («slug … is a
path and not a name (A11)»). Repostos.

#### O limiar da Comissão sai da frase e passa a campo (A12)

«with a threshold of 9%» estava citado dentro de uma nota, e ali era um
algarismo em prosa corrente sem natureza declarada: o varrimento do sítio só vê
uma sequência de algarismos num texto, e a marca `data-agenda` diz de que campo
do registo o texto veio, não que espécie de número é aquele. O registo ganhou um
campo, `limiar`, com o valor, a unidade e a origem (endereço, data da leitura e
o excerto da própria Comissão, palavra por palavra). A página rende «Limiar
publicado pela Comissão: 9 %» com a marca `limiar-do-quadro`, o motivo que a
casa já tinha, com a razão já escrita em `ledger/allowlist.yml`: um limiar é a
régua contra a qual a medição se lê, não uma medição de Portugal. O calendário
deixou de repetir o mesmo número na sua nota. **Estrago plantado:** um `limiar`
sem excerto («limiar.origem.excerto is empty (A12)»). Reposto.

#### A prosa da agenda: a pergunta diz o estado, e o resto perdeu o jargão

- A frase da pergunta contradizia o histórico ao lado. Passou a dizer a regra e
  depois o estado: «Nos estudos, a pergunta é selada no motor antes de a recolha
  começar. Esta está registada e ainda não selada: a direção não a leu.» E «o
  português abaixo» passou a «o português acima», que é onde ele está.
- «a canária dos limiares do motor» passou a «a conferência de limiares do
  motor»; «afecta_linhas fica vazia» passou a «nenhuma linha do sítio depende
  disto», três vezes; a nota da DGAL deixou de dizer que «guarda a prova de que
  não há calendário» e passa a dizer o que observou: «regista que a página não
  anuncia data nenhuma».
- A nota ao lado do 6,3 dizia «está abaixo da média europeia» sem que essa média
  esteja publicada em linha nenhuma deste sítio. **Não há linha da média europeia
  no livro-razão**, e por isso a comparação saiu da nota em vez de ser selada: o
  que fica é a ressalva da própria Comissão, dita como a primeira página já a
  diz («só se lê ao lado do regime de propriedade, e onde a taxa de
  proprietários é alta esta medida não vê quem não conseguiu comprar»), mais a
  frase que declara a ausência.

#### O portão: a unidade colada, o item inteiro, a etiqueta amarrada, a prova relida

**A unidade colada.** A conferência da prosa contra os valores do livro-razão
punha de fora qualquer símbolo com uma letra, e «17,6pp» publicava o valor sem
selo. A regra passou a ser a ordem das letras: um símbolo que **começa** por
algarismo e acaba numa unidade («9%», «17,6pp») é um número com a sua unidade;
um símbolo que **começa** por letra é um código («tipsho20») e continua de fora.
**Estrago plantado:** «A linha publica 17,6pp.» na nota do critério, no registo
e na página; o portão fechou com «a prosa da agenda repete um valor do
livro-razão: "17,6pp" é o valor da linha "precos-da-habitacao-2025"». Reposto.

**O item inteiro, à vista.** A conferência anterior contava marcas: um critério
esvaziado com a marca intacta contava como presente, e um rótulo escrito pela
casa (o estado do registo prévio, a transição do histórico, a razão de um
acontecimento não ter data, o cabeçalho de uma secção) não era comparado com
nada, porque não é um campo do registo. Passou a haver marca de estrutura para
cada um deles, e o portão confere duas coisas em cada: a marca contra o registo,
e a frase visível contra a **sua própria cópia** dos rótulos, que é a mesma
disciplina de `ROTULO_DO_ESTADO`, que existe para o portão conferir o registo e
não o gabarito. Os campos de um critério e de uma entrada do histórico passaram
a ser exigidos **dentro** do critério e da entrada, e não em qualquer sítio do
item. **Estragos plantados**, cinco, um a um na página construída: «Registo
prévio iniciado a» → «selado»; «passa a Em curso» → «passa a Concluído»; a razão
da ERSAR trocada de «a fonte não foi lida» para «a fonte não publica data»; o
cabeçalho «Em curso» trocado por «A seguir» sobre a secção certa; um critério de
calendário esvaziado com a marca no sítio. Os cinco fecharam o portão. Repostos.

**A etiqueta amarrada à sua linha.** A comparação da §1.41 provava que a
etiqueta do selo era **uma** das rendições legítimas; uma etiqueta legítima de
outro trabalho passava, e o selo de um valor podia dizer o nome de outro estudo.
O `href` do selo diz de que linha ele é a porta, e a `auditaSelo()` já obriga
esse `href` a ser o da linha do valor ao lado: as duas amarras juntas fecham o
círculo. A etiqueta passou a ser comparada com a rendição **daquela** linha,
naquela edição, e a comparação deixou de apagar espaços. **Estrago plantado:**
a etiqueta de «Água Não Faturada» posta no selo de `precos-da-habitacao-2025`;
o portão fechou com «a etiqueta do selo que abre a linha
"precos-da-habitacao-2025" não é a etiqueta dessa linha». Reposto.

**A prova, relida por inteiro.** A releitura do `dist/prova.json` comparava o
bloco `prova` chave a chave e ignorava tudo o resto: `portao.valores_sem_selo`
alterado depois de escrito passava. Passou a comparar o documento inteiro
contra o que o varrimento calculou, com uma excepção dita: `construido_em`, que
é o carimbo lido de `version.json` e não uma conta deste varrimento. **Estrago
plantado:** o portão a escrever `portao.valores_sem_selo: 999`; a releitura
fechou com «portao.valores_sem_selo: escrito 999, calculado 0». Reposto.

#### A ortografia, e a conta do `so_ida` corrigida

Faltavam os femininos regulares de `co-autor`: entraram `co-autora` e
`co-autoras`, pela regra que o cabeçalho da lista já fixou (a flexão regular de
uma forma atestada não pede atestação própria). Uma passagem mecânica sobre os
252 pares não encontrou mais nenhum feminino regular em falta: os candidatos que
a regra levanta (`ato`, `objeto`, `teto`, os meses) são substantivos sem
feminino, e o de `ator` é `atriz`, que já é par próprio. De **252 para 254
pares**. As contagens sobre a árvore actual não mexeram: 0 fora da grafia da
casa, 5 no restante, 45 avisos em `note`, 16 em citação. **Estrago plantado:**
«co-autora» numa página construída; o portão fechou com «grafia anterior ao
Acordo: "co-autora" (a forma da casa é "coautora")». Reposto.

E a conta do estrago plantado da §1.41 estava errada, o que é o pior sítio para
uma conta errada estar. Ficou corrigida ali, no seu lugar, e não apagada: a
passagem inversa **não** converteu «O acto foi publicado», porque procura as
formas do Acordo e `acto` não é uma delas; o que ela converteu foram
`correção → correcção` e `direção → direcção`, e sobre `ato` não converteu nada,
assinalou-o para a mão, que é o que `so_ida` faz.

#### O varrimento mensal passa a ver a reescrita da própria decisão

A auditoria do git comparava ordens: o commit que mexeu na prosa tem de ser o
mesmo, ou mais velho, do que o commit que pôs o carimbo em vigor. Só que
reescrever a prosa e a decisão ao mesmo tempo põe as duas no mesmo commit, e um
commit está sempre em ordem consigo próprio: a auditoria dizia OK exactamente à
mudança que existe para apanhar. Passou a fazer a segunda pergunta: **esse
commit escreveu uma decisão nova, ou reescreveu uma que já lá estava?**
`git show <commit> -- DECISIONS.md`, percorrido pedaço a pedaço, à procura de
uma linha `Texto:` **removida** debaixo do cabeçalho daquela secção; onde o
pedaço não chega ao cabeçalho, a mesma pergunta é posta ao ficheiro, nesse
commit e no pai dele. Quando encontra, imprime «entrada reescrita no mesmo
commit» e DIVERGE. Continua report-only, que é o contrato do varrimento.
**Estrago plantado:** um clone descartável do sítio, um commit que muda
`src/data/metodo.mjs` e reescreve a linha `Texto:` da §1.41 com o resumo novo;
a conferência dos resumos disse OK, como Codex tinha previsto, e a auditoria do
git disse «DIVERGE entrada reescrita no mesmo commit: ba208174f094 did not write
a new decision, it rewrote §1.41 and the stamp inside it». Clone apagado.

#### `/correcoes`: cada linha é uma porta, a contagem tem porta, a política diz-se uma vez

- O id de cada correcção e de cada actualização passou a ser uma porta para a
  página da sua linha. Estava lá o identificador e não estava lá o caminho: quem
  quisesse ver a linha tinha de a procurar. As revisões de proveniência já o
  tinham.
- As nove revisões de proveniência eram nove ligações e nenhuma contagem: o
  leitor contava-as à mão. Passou a haver «9 revisões de proveniência» com a
  marca `data-prova` e a porta da secção do registo, recalculada pelo portão.
- A política estava dita duas vezes na mesma página: uma no bloco da política e
  outra na porta que o invólucro põe no rodapé de todas as páginas. Esta página
  faz agora o que a primeira página já fazia: passa `portaNoRodape={false}` e
  põe a porta **dentro** do bloco da política, como o seu último parágrafo.
  Continua a ser exactamente uma por página, que é o que o portão conta.

#### As palavras

- Na edição inglesa do Método: «organisms» passou a «bodies» (a legenda do
  instrumento e a frase da origem da prova; `organismos` é institucional e
  `organisms` são seres vivos) e «sums redone» passou a «arithmetic
  re-evaluated», que é o que `contas refeitas` cobre.
- A prova da regra 2 dizia «linhas anteriores ao tubo», que é jargão de dentro
  numa página pública. Passou a «linhas registadas antes de existir travessia» e
  «rows recorded before any crossing existed».

#### O que fica por fechar, e porquê

**A classe inteira que a revisão nomeia como bloqueante é a mudança deliberada
por quem tem direito de escrita no repositório.** Apagar a linha de base da
travessia; reescrever uma entrada de decisão junto com o texto que ela governa.
Vale a pena dizer isto sem rodeios, porque não é uma falha por fechar: é uma
fronteira.

As conferências da construção proíbem a mudança **silenciosa**: o texto mexer
sem que nenhuma decisão o nomeie, uma medição publicada sem selo, um histórico
encurtado, um acontecimento a desaparecer sem razão. Essas são as que uma
máquina pode julgar, porque tem os dois lados à frente. A mudança **deliberada**
é outra coisa: quem tem direito de escrita pode reescrever qualquer ficheiro
deste repositório, e nenhuma conferência que corra dentro dele pode impedi-lo,
porque a conferência é um dos ficheiros. O que se pode fazer, e é o que se fez, é
**estreitá-la até ela ser visível**:

- o registo da travessia tem de trazer a sua história, e apagá-la pára as duas
  corridas, a do exportador, do lado do motor, e a do `check:cruzamento`, do
  lado do sítio. Não impede o apagamento; obriga-o a ser um acto declarado, com
  o ficheiro a faltar no git;
- as saídas do calendário são cumulativas: apagar uma exige apagar também o
  registo que a guardava, e isso é a mesma porta acima;
- a reescrita de uma decisão no mesmo commit que a prosa passou a ser
  **impressa** pelo varrimento mensal, que corre de fora desta construção e lê o
  git, que é a única memória que uma reescrita não pode reescrever sem deixar
  rasto.

Isso é governação, não maquinaria. O sítio não promete que ninguém pode mentir;
promete que mentir custa um acto visível, com data e autor, num histórico que
fica.

**O que continua aberto e não foi tocado aqui:** as contagens do Método
continuam a contar campos preenchidos e não elegibilidade (a regra 1 diz de si
própria que não tem máquina); as três linhas com `source: "[a verificar]"`
continuam na dívida de proveniência, à vista e contadas; os valores antigo e
novo do registo de correcções continuam sem selo, conferidos campo a campo pela
origem 5 contra o livro-razão; e a amarra das decisões continua a governar dois
ficheiros e não a superfície inteira.

#### O que foi lido e mantido, com a razão

- **A mobília do Sobre** (a contagem da agenda no cabeçalho, a porta das
  correcções no rodapé). É mobília do sítio, entra em todas as páginas por
  regra, e uma excepção para o `/sobre` seria uma página fora da regra da casa.
  Fica para o juízo da direcção na pré-visualização, como já ficava.
- **`correcoes-publicadas` como linha selada da casa.** A revisão volta a dizer
  que devia ser porta e não linha com selo. As duas coisas são legítimas e estão
  declaradas; esta é a mais antiga, tem linha, tem amarra ao registo, e trocá-la
  era trocar uma garantia por outra sem ganhar nada. Fica.
- **As regras 5, 6, 9 e 10 do Método** (fontes elegíveis, cada número com a sua
  origem, a releitura independente com zero registado, a autoria dita no Sobre,
  e as promessas sobre dinheiro e publicidade). A revisão diz que a prova de
  cada uma não estabelece o que a regra afirma. É verdade, e está dito ao lado
  de cada uma: o corte é da direcção na pré-visualização, e o registo já diz
  porquê (§1.39, §1.41).

#### Os limites novos, ditos aqui

- **O ordinal inglês escapa à conferência da prosa.** «2nd quarter» e «1st
  series» começam por algarismo, e a regra da unidade colada apanhá-los-ia. Ficam
  de fora por uma lista fechada de quatro sufixos, que é a mesma dispensa que a
  edição portuguesa já tinha para «2.º». O preço: um valor do livro-razão que por
  acaso seja o número de um ordinal passa por ali.
- **A releitura da prova não confere `construido_em`**, e é dito no código: é o
  carimbo lido de `version.json`, não uma conta do varrimento. Tudo o resto do
  documento é comparado.
- **A etiqueta do selo só se amarra à linha quando é uma porta.** Fora de um
  selo (a legenda de proveniência de um instrumento, que nomeia o trabalho e
  mais nada) continua a valer o conjunto finito de nomes do arquivo, porque não
  há `href` a que a amarrar.

#### A terceira leitura das quatro páginas

O mesmo revisor leu uma terceira cópia com dois estragos plantados (um plural
anterior ao Acordo numa regra do Método; um valor antigo trocado no registo das
correções) e apanhou os dois: oito em oito nas três leituras. Do que persiste,
tudo é decisão registada acima (a mobília do cabeçalho e a porta das correções
no Sobre; a contagem das correções como linha da casa; as regras cujas provas são
mais fracas e a página o diz; a porta por entrada no registo em vez de um selo por
valor histórico). Uma coisa era real e ficou feita: o limiar do quadro
institucional passou a mostrar, ao lado do valor, onde está escrito, quando foi
lido e a frase da fonte (`limiar.origem`, já no registo, agora renderizada), e a
frase da fonte entrou na lista dos campos transcritos que a conferência da prosa
da agenda não lê (`CAMPOS_TRANSCRITOS_DA_AGENDA`), pela mesma razão do excerto
das datas: reescrever a prova para lhe tirar um algarismo seria pior. Posto à
prova depois da alteração: «A linha publica 17,6.» numa nota renderizada faz
parar o portão em duas linhas (fidelidade ao registo, e valor do livro-razão
repetido); reposto por reconstrução.

### 1.43 A identidade v2: a direção S construída

**Afecta:** nenhum

*(Este bloco mudou desenho, folha de estilos, gabaritos e portão, e não mudou
uma palavra de nenhum dos textos governados: o Sobre, as dez regras do Método e
os dois registos da agenda estão como estavam. Por isso a entrada não nomeia
nenhum, e não traz linha `Texto:`.)*

*Esta entrada escreve-se no Acordo de 1990, como a v2 da constituição, e não na
grafia das entradas anteriores. É a mesma razão do §9: uma reescrita inteira é
uma versão nova, e escreve-se na grafia que fixa. O que é citado fica com os
caracteres que tem.*

#### O que é a direção S, e onde foi decidida

A fase 2 construiu três direções de desenho em paralelo, cada uma com cinco
páginas, o móvel, o racional e a sua conferência: `design/direcao-a`
(refinamento), `design/direcao-b` (instrumento à frente), `design/direcao-c`
(editorial generoso). Um crítico de outra família de modelos leu as três contra
os nove testes de aceitação do `BRIEF-confianca.md` §6.8, contra a constituição e
contra as palavras da direção, sem contexto e com as imagens renderizadas: a
crítica está em `design/CRITICA-codex.md`. A decisão está em `design/DECISAO.md`,
16.08.2026, e a direção escolhida, **S**, é a síntese das três e não uma delas:
o chassis de A, a mecânica de prova de B, a cadência de C.

Os três protótipos ficam neste ramo como registo. Não são especificação de
detalhe: a especificação é a decisão, e onde as duas discordarem ganha a
decisão.

A constituição foi reescrita a partir dessa decisão e é a **v2** de
`IDENTIDADE.md`. A v1 fica no git, em `git show e340fa6:IDENTIDADE.md`.

#### As cinco decisões que o lugar de direção fixou antes da construção

1. **A entrelinha da leitura.** A decisão de desenho escreveu 1,55 e a folha de
   hoje tinha 1,6 sobre 16px. O que se fixou foi o intervalo, 1,55 a 1,6, com a
   entrelinha **absoluta** a não descer: `--lh-leitura` fica em 1,58 e
   `--t-leitura` em 17,5px, que dá 27,65px contra os 25,6px de antes.
2. **A agenda fica na disposição A**, e o quadro de estados entra **por cima**,
   como instrumento dentro da página. Não é uma quarta disposição: é o que a §3
   já permite, e o que a §7 já pedia.
3. **O cabeçalho não ganha selo nenhum.** A v1 §5.4 dizia que o selo do
   cabeçalho passava a levar o glifo e a palavra. Só que as contagens saíram do
   cabeçalho a 16.08.2026 (§1.39) e o que lá está é mobília, que leva números do
   sítio com porta e sem selo (§10). A regra revê-se sem que o cabeçalho mude:
   é a §5.5 da v2.
4. **A percentagem escreve-se colada ao número.** O painel já escrevia «limiar
   60%»; a agenda era a última superfície a escrever «9 %» com espaço.
5. **As contagens do quadro de estados entram por `data-prova`**, e a porta de
   cada uma é a âncora da sua secção na mesma página.

#### As fichas v2: os neutros aquecem, e cada par foi medido

O papel deixou de ser azulado e passou a quente, a tinta passou a
castanha-escura, os fios e o eixo seguiram-nos. Os valores são os da direção C,
adotados sem alteração **depois de medidos**. Os dois acentos não se tocaram,
dígito a dígito, nos dois temas: `--yellow` continua a ser a marca de medição e
`--oxblood` o erro admitido, e mexer-lhes na matiz obrigaria a mudar o que o
sítio escreve sobre eles (§2).

A régua é `scripts/medir-contraste.mjs`, escrita neste bloco: mede cada par que
a folha de facto usa, nos dois temas, contra os limiares da WCAG 2.1. Corre à
mão e **não é um portão**. Os números abaixo são os que ela imprime.

**Claro (v1 → v2).** Texto: ink/paper 17,17 → 16,67 · ink/paper-2 16,11 → 15,29 ·
ink/paper-3 14,96 → 13,73 · muted/paper 6,28 → **6,87** · muted/paper-2 5,89 →
6,30 · muted/paper-3 5,47 → 5,66 · oxblood/paper 9,45 → 9,38 · oxblood/paper-2
8,87 → 8,60 · oxblood/paper-3 8,24 → 7,72 · onyellow/yellow 8,50 → 8,32.
Interface: axis/paper 3,45 → **3,56** · dotcol/paper 4,43 → 5,15 · focus/paper
17,17 → 16,67 · yellow/paper 2,02 → 2,00 · yellow/paper-3 1,76 → **1,65**.
Decoração: rule-strong/paper 1,58 → 1,83 · rule/paper 1,23 → 1,29.

**Escuro.** Todos os pares de texto passam AA, de 5,73 a 15,07. axis/paper 4,02 →
3,45 · dotcol/paper 5,65 → 5,00 · yellow/paper 9,04 → 8,88 · yellow/paper-3 7,63
→ 7,67 · rule-strong/paper 1,81 → 1,78. Os dois blocos escuros, o do sistema e o
escolhido, são iguais ficha a ficha, e a régua confere-o.

**Todos os pares de texto passam AA nos dois temas, antes e depois.** Onde mais
se lê, melhorou: `--muted` sobre papel, que é a ficha do aparelho inteiro, subiu
de 6,28 para 6,87.

**A regressão, dita e fechada.** O amarelo sobre `--paper-3`, que é a calha das
barras de composição, desceu de 1,76:1 para 1,65:1. Os dois estão muito abaixo
dos 3:1 e já estavam; procurou-se um `--paper-3` quente que batesse o de hoje sem
perder o terceiro degrau de papel e não existe nenhum. A saída não é mexer no
amarelo: é dar ao preenchimento uma **fronteira desenhada**. A aresta que carrega
a leitura é a direita da barra, e leva 1px de `--muted`, que mede **5,66:1 em
claro e 5,73:1 em escuro** contra a calha. `--axis`, que é o token das arestas de
instrumento e seria o primeiro candidato, mede 2,93:1 e 2,98:1 e não chega aos
3:1 da 1.4.11: foi medido com a mesma régua e recusado por causa disso. O par
usado entrou na lista.

#### O selo: escreve a palavra, e a etiqueta passa a ser declarada

O Método promete, nas duas línguas, que «o selo de proveniência junto a cada
número é a porta para essa linha». A palavra existia **escondida** para leitores
de ecrã, e um leitor com vista via um título de estudo em cinzento a 10,5px: a
promessa mais exposta do sítio era a mais fácil de não ver.

- o selo escreve **«fonte»** em português e **«source»** em inglês, à vista e
  sublinhada, ao lado do quadrado;
- **a unidade compacta inteira é a ligação**, com `min-height: 24px`, que é o
  alvo de toque que as duas normas de plataforma pedem;
- o quadrado desenha o estado, cheio ou a tracejado, e passou a ir em `--axis`
  (**3,56:1** sobre papel) e não em `--rule-strong` (1,83:1): é uma distinção
  que o leitor tem de ver, e por isso é objeto de interface e não arrumação;
- **a etiqueta do estudo sai do texto visível** e passa a três sítios, todos
  conferidos: `data-selo-etiqueta`, o `title`, e o texto oculto para leitores de
  ecrã. Era ela que o cabeçalho teve de esconder à mão a 16.08.2026 (§1.37);
- o marcador não se mexeu: continua ao lado do quadrado a tracejado, e a sua
  conta não desceu por causa disto.

#### O cabeçalho: duas leituras rotuladas, e um fio

O espaço da agenda encheu-se a 16.08.2026 (§1.40) e era microtexto corrido.
Passa a duas leituras de aparelho, cada uma com rótulo e valor em monoespaçada e
cada uma com a sua porta: a reconferência do painel, que abre a secção dos
números da primeira página, e o estado da agenda, cujas duas contagens são
`data-prova` e abrem, desde este bloco, a secção do estado que contam. Sem caixa
à volta do cabeçalho: um fio (§3).

#### A primeira página: a grelha fecha, e o limiar ganha linha própria

A grelha do painel era `repeat(auto-fit, minmax(258px, 1fr))`, e uma grelha de
largura variável é aritmética que não fecha: com oito células e uma largura
qualquer, a última fila fica com uma célula sozinha e ninguém decidiu isso.
Passa a **4/2/1 explícito**, com pontos de quebra escritos (900px e 560px), que
é o que a §7 pede.

**Sem barras por célula.** Barras normalizadas cada uma ao seu limiar convidam a
uma comparação que não é válida. Onde um quadro institucional publica um limiar,
a célula leva uma linha monoespaçada, «limiar 60% · acima», com o limiar debaixo
do motivo `limiar-do-quadro` e a palavra de comparação derivada de dois números
que já existem, por `comparacaoComOLimiar()`. A palavra não é um algarismo: não
acrescenta um dígito à página, e onde um dos dois lados não é um número simples
a função devolve `null` e a célula fica sem ela. Nunca com uma palavra inventada.

#### A página de linha é um recibo, e esta é a ordem

O valor com o seu próprio selo, a unidade e o id; uma frase de atribuição; o
bloco da prova; o campo devolvido ou o excerto; o pedido exato ou o endereço; as
verificações em duas linhas, «Lido a» e «Reconferido a»; as correções. A coluna
do aparelho tem 300px e leva a proveniência em campos, o estado, o acesso aos
dados e a porta das correções. **Sem «como se lê este recibo»**: uma interface
que explica a interface antes de dar a prova está a adiar a prova.

**O selo ao lado do valor de cabeça, na sua própria página** (§5.3). A porta é
uma âncora para o bloco da prova, aqui mesmo: estar já na página certa não
dispensa a porta, dispensa a viagem.

**A frase de atribuição cala-se onde não sabe.** Tratava o marcador como um campo
preenchido, e três linhas rendiam «Publicado por [a verificar], em [a verificar]
([a verificar]) · lido a [a verificar]», que é uma frase com quatro buracos e não
uma frase. Um campo cujo valor **é** o marcador conta como ausente, e sem
organismo não se rende frase nenhuma: a dívida declara-se uma vez, no bloco «O
que falta nesta linha», com o motivo tipado e a porta da página do marcador.
Quatro linhas mudaram, e não três: `avisos-pt2030-abertos`,
`avisos-pt2030-pessoas-singulares` e `ciclo-substituicao-condutas` perdem a frase
inteira, e `saldo-natural-portugal-2025`, que tem organismo e mais nada, passa a
dizer «Publicado por PORDATA» e cala o resto. De **532 para 502** ocorrências da
classe do marcador nas páginas construídas, e de 632 para 602 ocorrências do
texto: quinze peças de quatro linhas, nas duas edições. A dívida de proveniência
não mudou; o que mudou foi dizê-la uma vez em vez de quatro.

#### O município: os mandatos passam a banda

O mosaico já era a grelha 4/2/1 da primeira página, com selo em cada célula e o
estado vazio desenhado, e o aparelho já era o de A: 300px, a proveniência, «o que
esta página não sabe» e a porta das correções. Ficam como estavam, e a prosa de
leitura já vivia em `--t-leitura` e `--lh-leitura`.

A linha do tempo das administrações tinha os anos desenhados e os mandatos não:
uma régua de anos por cima de uma lista. Passa a ser uma **banda**. Cada mandato
ocupa no desenho o pedaço de tempo que ocupou na realidade, sobre um eixo
partilhado; a legenda por baixo leva as portas, uma por mandato, para o bloco
daquele mandato na mesma página, porque uma âncora dentro de um desenho não se lê
como porta. A aresta de cada segmento é o que separa um mandato do seguinte, e
por isso é objeto de interface e não arrumação: `--paper-3` sobre o fundo do
instrumento mede 1,11:1, o preenchimento não desenha nada, e a aresta leva
`--muted`, medido em 6,30:1 contra o fundo e 5,66:1 contra o preenchimento em
claro. Nada é escrito: os anos saem de `tempo.eixo`, os períodos de
`mandato.periodo`, e a geometria é derivada dos dois. Sem acento novo: um mandato
não é uma medição, e a banda distingue-se com fundo, fio e monoespaçada. O
mandato em curso não tem fim publicado e por isso não tem aresta direita: ocupa a
cauda do desenho, que é espaço de desenho e não tempo medido, e fecha a
tracejado, que é a mesma língua com que o selo diz que falta um campo (§7).

#### O Método: a porta de cada número do sítio passa a ver-se

A página já era a que a direção S pede: disposição A, o mecanismo a toda a
largura entre a abertura e as dez regras, e a prova de cada regra numa linha
monoespaçada com as suas portas. **O texto governado das dez regras não foi
tocado**, e é por isso que esta entrada não nomeia `metodo`: nenhum rótulo de
prova precisava de mudar, e mexer-lhe obrigaria a um resumo novo por nada.

O que estava errado era de leitura, e estava na folha. O ponto médio entre duas
provas da mesma regra e o fio que faz de porta debaixo de cada `data-prova`
viviam em `--rule-strong`, que mede 1,83:1 sobre papel: o separador não separava
e a porta lia-se como sublinhado de enfeite. Passam a `--muted`, 6,87:1 em claro
e 6,64:1 em escuro. É a mesma correção que a v2 fez ao selo, e pela mesma razão.

#### A agenda: o quadro no topo, cartões curtos, e o calendário num eixo

**O quadro de estados** (§7 e §11). Quatro colunas, «Em curso · A seguir ·
Concluído · Retirado», cada uma com a sua contagem por `data-prova`, que o portão
recalcula do `dist/` construído. A coluna vazia desenha-se: «Retirado» está a
zero, e um zero é um estado e não uma ausência. A porta de cada contagem é a
âncora da secção que a mostra, nesta mesma página. Nenhuma chave nova: as cinco
`agenda_*` já existiam desde a §1.40; o que mudou foi a porta, em `prova.mjs`, e
por isso a mesma contagem no cabeçalho de qualquer página passa também a abrir a
secção que conta, e não a página inteira.

**Os itens como cartões curtos.** O que se lê primeiro é o que identifica o item:
natureza e estado, título, o «porquê» num parágrafo, os critérios e a linha das
datas. A pergunta registada e o histórico inteiro descem para o fim do cartão,
compactos, sem perder um campo: o portão continua a exigir o item inteiro, cada
critério dentro do seu elemento e cada entrada de histórico dentro do seu.

**O calendário num eixo de tempo**, desenhado no servidor, sem uma linha de
JavaScript. Os meses são a escala, escritos na notação de datas da casa
(`AAAA-MM`), com a marca `escala-de-instrumento`: é a mesma notação com que este
sítio escreve uma data em todo o lado, e por isso não há aqui uma tabela de nomes
de meses em duas línguas para manter. As janelas de publicação vão a amarelo,
porque uma janela é a marca de uma medição de tempo; os dias que uma fonte
publica são marcas sobre o eixo, com o seu rótulo e o seu organismo. Cada data
desenhada leva a marca `data-agenda` do seu campo, como a lista já levava: o
portão compara as duas contra o mesmo registo. A legenda por baixo leva as
portas, uma por acontecimento. A lista datada e a lista sem data ficam onde
estavam, palavra por palavra, com a razão de cada ausência dita como o registo a
diz.

**E a percentagem fechou-se**: «9 %» passa a «9%». Cada campo continua marcado
por si, e é campo a campo que o portão os compara com o registo.

#### As restantes páginas

`/estudos`, `/estudos/<slug>`, `/livro-razao`, `/municipios`, `/sobre`,
`/correcoes`, `/a-verificar` e o 404 receberam as fichas e o selo novo, e mais
nada mudou nelas. **Conferido por renderização e não por suposição**: as oito
foram construídas e lidas, e os selos que têm escrevem «fonte» na edição
portuguesa e «source» na inglesa.

#### O móvel: a 390px nenhuma página rola de lado

Medido, não visto: o `scrollWidth` do documento com o ecrã a 390px. A janela do
Chrome não desce abaixo de 500px no macOS, e por isso a medição faz-se dentro de
um iframe de 390 servido da mesma origem, com a largura do documento lida do DOM.

| Página | Antes (pt · en) | Depois (pt · en) |
| --- | --- | --- |
| primeira página | 438 · 445 | **390 · 390** |
| página de linha | 390 · 390 | 390 · 390 |
| município de Évora | 390 · 390 | 390 · 390 |
| Método | 390 · 390 | 390 · 390 |
| agenda | 574 · 574 | **390 · 390** |

O «antes» é o do estado herdado (`53af3c9`), medido numa construção própria: as
duas transbordâncias já lá estavam, e nenhuma delas veio deste bloco. Nove outras
rotas foram medidas por conta própria e estão todas a 390.

**Duas causas, e nenhuma delas era a que se suspeitava.** Os instrumentos com
`min-width` já rolavam dentro da sua caixa e não empurravam nada.

- Na agenda era **um endereço**. Um endereço de 115 caracteres em monoespaçada
  tem mais de 700px de largura mínima e não parte em lado nenhum: era ele que
  punha a página inteira a 574. Passa a partir onde for preciso, como a
  `.ligacao-externa` já fazia.
- Na primeira página era **o selo**. A coluna do número das barras de composição
  tem 4ch, que chega para «308» e não chega para o selo ao lado dele: a unidade
  saía da célula com `white-space: nowrap` e levava a página com ela. O selo
  passa a poder dobrar de linha por dentro, sem deixar de ser uma só ligação e um
  só grupo visível, e num ecrã estreito a coluna do número passa a ter a largura
  de que precisa, com a barra a encolher.

#### O portão: quatro conferências novas, cada uma sobre um estrago plantado

Todas extensões de conferências que já existem, pela moratória de 15.08.2026:
nenhum portão novo.

| Conferência | Estrago plantado | O que o portão disse |
| --- | --- | --- |
| A etiqueta do selo é **declarada** e é a daquela linha (extensão da `proveniencia`, §1.42) | o atributo em falta | «o selo que abre a linha "…" não declara a sua etiqueta» |
| | a etiqueta de «Água Não Faturada» no selo de `precos-da-habitacao-2025` | «a etiqueta declarada no selo que abre a linha "precos-da-habitacao-2025" não é a etiqueta dessa linha» |
| | o texto visível a dizer outra coisa que não a palavra da edição | «o selo que abre a linha "…" não escreve a palavra desta edição» |
| A porta de um selo pode ser uma **âncora na própria página** (§5.3) | o mesmo estrago da etiqueta, na página da própria linha, onde o selo é `…#prova` | o portão fechou em `livro-razao/precos-da-habitacao-2025/index.html`: o fragmento não impediu a amarra de reconhecer a linha, que é o que esta tolerância tem de garantir |
| A porta de um `data-prova` pode ser uma **âncora na própria página** (§10) | a porta das quatro chaves `agenda_*` a apontar para `#estado-<estado>-que-nao-existe`, com as secções a manter os seus `id` | «a porta do número da prova "agenda_em_curso" aponta para a âncora "#estado-em_curso-que-nao-existe", que não existe em "/agenda"» |
| **Uma ausência nunca se desenha** (§6) | `<div data-exemplo="recorte">Exemplo: …</div>` numa página | «a página rende a marca "data-exemplo", que declara um estado de espécime» e «a página escreve o rótulo "Exemplo: …", que anuncia um estado de espécime» |
| | `<p class="exemplo-k">` | «a página rende a classe "exemplo-k", que desenha um estado de espécime» |
| | *(o controlo)* «Exemplo da falta de civismo…» dentro de um `blockquote` | **não fechou**, e é metade da regra |

Todos repostos, e a construção verde depois de cada um.

**A porta do `data-prova` passou a comparar-se resolvida**, e não carácter a
carácter: `#estado-em_curso` escrito na agenda e `/agenda#estado-em_curso`
escrito no cabeçalho de outra página são a mesma porta, e a igualdade de cadeias
dizia que não. Provado pelo lado positivo: com o quadro a escrever a âncora nua,
a construção fica verde, e a comparação antiga recusava-a.

**A conferência da ausência olha para três superfícies**, a marca, a classe e o
texto, porque um espécime entra por qualquer uma. E metade da regra é o que ela
**não** fecha: «exemplo» é uma palavra portuguesa, e há um documento transcrito
neste sítio que começa por «Exemplo da falta de civismo é demonstrado pelos mais
de 4000 depósitos». Por isso a conferência do texto só olha para rótulos (a
palavra no princípio, seguida de fim, de dois pontos ou do separador da casa) e
nunca dentro de uma citação. Reescrever uma prova para lhe tirar uma palavra
seria pior do que o defeito que isto fecha. `placeholder` **não** está na lista,
e é decisão: ver §4.1.

#### O `verify:deploy` media o que não nomeava

Dizia «o "main" local está N commit(s) à frente de origin/main» e comparava
`HEAD`. De um ramo de trabalho, `HEAD` nunca é `origin/main`: a conferência
acusava sempre, e a acusação era falsa. **Provado nos dois sentidos**, com a
árvore neste ramo e `main` exatamente em `origin/main`: a versão anterior disse
«o "main" local está 21 commit(s) à frente de origin/main» e saiu com erro; a
versão corrigida diz que o que está no ar é o que está no repositório, e mostra
`HEAD` à parte, com a nota de que não decide nada. E com um ramo descartável
criado a partir de `main` com um commit por cima, a conferência voltou a fechar:
«o "_prova-verify" local está 1 commit(s) à frente de origin/main». O ramo
descartável foi apagado e **nenhum commit ficou em `main`**, que continua em
`6cbf0c1`, onde `origin/main` está.

#### A régua dos defeitos, antes e depois

A régua é `scripts/medir-defeitos.mjs`, e o «antes» é o de `main` em `6cbf0c1`.

| | Antes (`main`) | Depois |
| --- | --- | --- |
| páginas construídas | 307 | 307 |
| porta de correções | 307/307 | 307/307 |
| primeira página: valores sem selo · selos para outra linha | 0 · 0 | 0 · 0 |
| frases de moldura | 75 distintas · 2 353 ocorrências | 77 distintas · 2 617 ocorrências |
| `[descrição em preparação]` | 0 | 0 |
| linhas com `#page=` | 23 de 132 | 23 de 132 |
| localizadores internos | 0 | 0 |

**As duas frases de moldura a mais são o preço de uma promessa cumprida**, e
valem a pena ser explicadas: são «[a verificar] A regra da releitura →» e a sua
gémea inglesa, a linha «Reconferido a» que a página de linha passou a desenhar em
todas as 132 linhas, nas duas edições. A régua conta como moldura todo o bloco de
texto com 30 ou mais caracteres que se repita em mais do que uma página, e uma
linha que aparece em 264 páginas é exatamente isso. O aumento das ocorrências, de
2 353 para 2 617, é essa linha vezes as páginas onde ela agora está.

**As cadeias que este bloco acrescentou não entraram nesta conta**, e a razão é
mecânica e não sorte: são rótulos com menos de 30 caracteres, ou aparecem numa
página só. Quem comparar duas construções tem de correr esta régua nas duas.

#### O que este bloco acrescentou e não tem amarra

**19 chaves novas em `src/i18n/strings.mjs`**, 38 cadeias nas duas edições: a
palavra do selo (`selo`); a linha do limiar do painel (`limiar`, `acima`,
`abaixo`, `noLimiar`); a ordem do recibo (`provaK`, `publicadoPor`,
`publicadoEm`, `publicadoPagina`, `publicadoLido`, `verificacoesK`,
`reconferidoK`, `releituraPorta`); a banda dos mandatos (`tempoBandaK`,
`tempoBandaLegendaK`); e a agenda (`quadroDeEstadosK`, `semRegisto`, `eixoK`,
`eixoLegendaK`). **Nenhuma tem decisão registada que a governe**, e é o item 9 da
§4.2: a amarra das decisões governa `sobre.mjs` e `metodo.mjs`, e as cadeias de
`strings.mjs` mudam sem que nada o note. Ficam contadas aqui, que é o mais que
esta entrada pode fazer por elas.

#### O que fica aberto, e é honesto dizê-lo

- **Os testes 1 e 3 do `BRIEF-confianca.md` §6.8 continuam a não passar, e não
  passam com desenho.** O recorte da linha impressa e o campo `verifications[]`
  são dados que não existem no formato, e são o bloco T. O desenho deixou o lugar
  pronto e não inventou nada: onde o recorte não existe não há caixa, há o
  marcador com o seu motivo, e a conferência da ausência passou a ser mecânica.
- **A fronteira da barra de composição resolve a leitura e não resolve o par.**
  O amarelo sobre a calha continua em 1,65:1, e o que passa a estar acima de 3:1
  é a aresta que carrega a leitura, medida em 5,66:1 e 5,73:1. É a saída que a §2
  permite; a outra seria mexer no amarelo, e essa está fechada.
- **O `gate:identidade` continua a não existir.** As regras de folha de estilos
  da §1 e da §2 (nenhum literal de cor fora de `tokens.css`, `--yellow` nunca
  como `color`, a serifada só no `.wordmark`) e o marcador só na sua classe
  continuam a segurar-se por atenção. É a fase 4.
- **O que o portão não vê continua a não ver**: se a segunda coluna está a fazer
  alguma coisa, se um instrumento tem as três camadas, e se um estado vazio foi
  desenhado ou apenas ainda não aconteceu.
- **A leitura cruzada, a pré-visualização e a palavra da direção** são o que se
  segue, e não aconteceram neste bloco.

### 1.44 A revisão cruzada da identidade v2

**Afecta:** nenhum

*(Este bloco corrigiu desenho, folha de estilos, gabaritos, uma linha do
livro-razão e duas frases da prosa da primeira página, e não mudou uma palavra
de nenhum dos textos governados: o Sobre, as dez regras do Método e os dois
registos da agenda estão como estavam. Por isso a entrada não nomeia nenhum, e
não traz linha `Texto:`.)*

*Escreve-se no Acordo de 1990, pela mesma razão que a §1.43: é a continuação do
bloco da v2 da constituição, e a v2 escreve-se na grafia que fixa. O que é
citado fica com os caracteres que tem.*

#### Como a leitura foi feita, e o que ela apanhou

Um revisor de outra família de modelos (Codex), sem contexto do bloco, leu seis
páginas construídas: a primeira página, uma linha do livro-razão com documento
em PDF, a linha da dívida, o município de Évora, o Método e a agenda. Leu o HTML
e as renderizações, em claro e em escuro, a 1280px e a 390px.

Na cópia que lhe foi dada estavam **cinco estragos plantados**: um valor sem
selo, um travessão, um segundo marcador de incerteza a par de `[a verificar]`,
uma caixa de exemplo, e um limiar sem o motivo que o declara. **Apanhou os
cinco.** É a quarta leitura cruzada desta constituição e a primeira sobre a v2;
as três anteriores estão nas §1.41 e §1.42, e o total das quatro é de treze
estragos plantados e treze apanhados.

Das suas observações reais, mais duas do lugar de construção, saíram os onze
itens abaixo. O que foi lido e mantido, com a razão, vem a seguir a eles.

#### O que mudou

**A · O mosaico deixa de aparar um valor.** A 1280px, na célula «Dívida total do
município» de `/municipios/evora`, o valor `54 681 562` media 313,1px numa célula
com 223,8px de conteúdo: via-se «54 681 5», e a descrição ia com ele, tapada pelo
fundo da célula seguinte. Duas causas. A grelha interna de `.figura` não tinha
colunas declaradas e a coluna implícita media-se pelo conteúdo mais largo; passa
a `minmax(0, 1fr)`. E o separador dos milhares é o espaço fino inquebrável
(U+202F), que faz de «54 681 562» uma só palavra para quem parte linhas; a letra
passa a escalar com o comprimento do valor, por `--figura-car`, que o gabarito
escreve a partir do valor publicado (`Claim.astro`, propriedade `escala`), e pela
largura da célula em `cqw`. Partir dentro do número seria pior do que encolhê-lo:
«54 681 5» e «62» em duas linhas lêem-se como dois números. Medido a 1280, 1100,
900 e 640, na primeira página e no município: nenhum `.figura-num` excede a sua
célula. A 1280 o valor longo passa de 313,1px para 213,8px de texto, com a letra
a 35,5px em vez de 52px, e os outros sete ficam nos 52px. As oito células da
primeira página têm valores de três a cinco caracteres e não mudam em largura
nenhuma.

**B · O selo escreve «fonte» também dentro de uma sobrancelha.** Na linha da
medida do mosaico, que é uma sobrancelha em maiúsculas, o selo herdava o
`text-transform` e rendia «PERCENTAGEM, TETO LEGAL = 150 ■ FONTE · 2024». O selo
passa a declarar `text-transform: none`. O HTML não mudou: 463 selos escrevem
«fonte» e 463 escrevem «source» nas páginas construídas, antes e depois.

**C · O excerto que falta deixa de ter caixa.** A linha sem excerto desenhava um
retângulo a tracejado do tamanho de uma prova, com o marcador sozinho lá dentro
e a frase do motivo por baixo, fora da caixa. A §6 diz que uma ausência nunca se
desenha e que a língua é o marcador com o seu motivo e o caminho para a correção.
Passa a uma linha: o marcador, e a seguir «O excerto textual desta linha ainda
não foi transcrito da fonte.», que é a frase que já lá estava. Dois blocos
abaixo, na mesma página, o endereço por confirmar já fazia o certo. As contagens
não desceram, e foram medidas nas duas construções: `class="marcador"` 502 e 502,
«[a verificar]» 602 e 602, e as 218 marcas `data-linha-campo="excerpt"` ficam nas
mesmas 218.

**D · Duas afirmações falsas na prosa da primeira página.** A descrição da
posição de investimento internacional dizia «O que o país deve ao exterior menos
o que tem a haver dele», que é passivo menos ativo e daria +50,2; a medida é
ativo menos passivo e a linha publica −50,2. A frase dizia o contrário do número
que estava por cima dela. Passa a uma definição com o sinal explicado: «O que o
país tem a haver do exterior menos o que lhe deve: negativo quando deve mais do
que tem a haver.» Em inglês, «What the country is owed from abroad minus what it
owes abroad: negative when it owes more than it is owed.» Saem da mesma frase
«É a medida com a maior distância ao limiar», falsa no mesmo ecrã (com os oito
valores e os quatro limiares que a página publica, a dívida pública está 29,7
pontos além dos 60 do seu limiar e esta está 15,2 além dos −35), e «a que mais
tem melhorado», que é uma tendência sem série nenhuma neste sítio. **Nenhum
valor, selo ou limiar mudou.** Não é um valor do livro-razão que estava errado, é
prosa da casa: não há entrada no registo de correções, e o erro fica registado
aqui, que é onde a prosa da casa se corrige.

**E · Sai o colofão «Esta página».** A primeira página fechava com «Sem pedidos
de rede», a lista das três famílias de letra e a regra do amarelo com o literal
da cor. É comentário de implementação numa superfície pública, e o
`BRIEF-confianca.md` §6.3 pede o contrário: mostrar em vez de declarar. Que a
página não faz pedidos de rede prova-se abrindo-a. A secção sai inteira, com as
duas citações que só ela rendia (`sem-pedidos-de-rede` e `regra-do-amarelo`: o
portão exige que uma chave renderizada exista em `verbatim.mjs` e não o
contrário, por isso uma entrada que ninguém rende não guardava nada) e com as
três cadeias `estaPagina` das duas edições. A porta das correções vinha do
colofão e volta ao rodapé pelo invólucro: a página deixa de passar
`portaNoRodape={false}`, e o portão continua a ver exatamente uma porta por
página.

Um resto que fica dito: a legenda transcrita do mapa acaba em «Detalhe completo
no colofão.», e a palavra deixou de ter secção com esse nome na página. O detalhe
continua lá, no bloco «Método, ressalvas e proveniência» do próprio instrumento,
que rende `caop-fonte` e `caop-processamento` inteiros. A frase é transcrita do
estudo de identidade e não se reescreve (§9): fica registada como leitura
imperfeita e não como defeito por corrigir.

**F · O sumário de cabeçalhos do município deixa de saltar.** Ia de `h1` «Évora»
para os oito `h3` das medidas, e o primeiro `h2` só aparecia depois, em «Leitura
breve»: quem navega por cabeçalhos perdia a camada Relance inteira. «Relance»
passa a `<h2 class="eyebrow">` com `id`, e a secção a `aria-labelledby`. O
desenho não muda, e é medido e não visto: a 1280px a sobrancelha fica em x=94,0
y=594,4 w=1092,0 h=17,6, com 11px, entrelinha 17,6px, espaçamento 1,76px e margem
de topo 0, antes e depois, e a página continua com 7918px de altura; na edição
inglesa, «At a glance», a mesma geometria. Varridas as 322 páginas construídas,
sem este salto ficam só dois documentos de estudo alojados, que são obra
publicada e conferida carácter a carácter contra a origem, e por isso não se lhes
mexe (§1.36, item 1).

**G · As fichas da régua já tinham `aria-pressed`, e a observação era falsa.** As
seis fichas de região do instrumento n.º 1 declaram `aria-pressed="true|false"`
no servidor e a passagem alterna-o em `public/js/convergencia.js` onde alterna
`is-read`, desde `f2ed777`, que é anterior a este ramo. Conferido no HTML
construído: as únicas fichas sem `aria-pressed` são as duas de ação, «Todas as
regiões» e «Repor», que não são estados e onde o atributo estaria errado. Nada
mudou. O que fica dito é o que a leitura não viu: `aria-pressed` segue a região
estar **na régua**, e `is-read` segue a região **que está a ser lida**, que são
dois estados diferentes, e o segundo não tem hoje equivalente para quem não vê.
Vai para a §4.1 com o nome acessível dos selos.

**H · As regiões de navegação passam a dizer o que são.** Chamavam-se «Início» ou
«English»: quem percorre uma página por regiões ouvia «navegação Início» na barra
de cima, «navegação Início» no rodapé, e na página de erro uma terceira igual.
Quatro chaves novas em `nav`, oito cadeias nas duas edições: «Navegação
principal» e «Main navigation», «Navegação do rodapé» e «Footer navigation»,
«Idioma» e «Language», e «Por onde continuar» e «Where to continue» para as três
portas da página de erro, que tinha o mesmo defeito e não estava na lista.
Conferido no HTML construído: 154 páginas com «Navegação principal», 153 com
«Main navigation», o mesmo par no rodapé, e nenhuma região com o nome de uma
ligação.

**I · A linha da água não faturada deixa de escrever a unidade duas vezes.** Era
a única das 132 cujo `value` trazia o símbolo da unidade dentro: `value: "26,5%"`
com `unit: "percentagem"`, e a página rendia «26,5% percentagem» no cabeçalho e
no título da aba. Passa a `value: "26,5"` e `unit: "%"`, que é o par que as
outras oito linhas de percentagem já usam. Antes de mexer: nenhuma outra página a
cita, e ela não é das 70 linhas de origem externa que atravessam do motor, por
isso não há prosa a escrever «<Claim/>%» que passasse a dobrar o sinal, nem nada
do lado do motor a contradizer. O valor publicado é o mesmo: mudou onde o sinal
está escrito. É um apontador e não uma medição, e por isso **não entra no registo
de correções**, pela regra do silêncio da §1.36.

E um limite que esta normalização pôs à vista, dito aqui para não voltar a ser
descoberto: o título da aba e a descrição de uma página de linha juntam o valor e
a unidade com um espaço (`tituloDaLinha` e `descricaoDaLinha`, em
`src/lib/livro.mjs`), e por isso nove linhas de percentagem escrevem «6,1 %» ali,
onde a §11 da constituição diz que a percentagem se escreve colada ao número. Já
era assim em oito antes desta mudança e passou a nove; no cabeçalho da página não
acontece, porque ali o valor e a unidade são duas peças do recibo, com a unidade
em rótulo monoespaçado. A saída não é colar sempre, que daria «82índice (UE-27 =
100)»: é distinguir uma unidade que é um símbolo de uma unidade que é uma
palavra, e isso é uma decisão de redação sobre as 132 linhas. Fica escrito e não
fica corrigido aqui.

**J · Um nó do mecanismo com dois valores tem lugar para os dois.** Dois nós
levam dois valores cada um, o livro-razão («132 linhas» e «12 por confirmar») e a
releitura («0 registadas» e «2026-08-17 reconferido a»). Com a caixa a 92 e o
passo entre pares a 24, o segundo número subia por cima da legenda do primeiro:
a página rendia «132» com «linhas» tapado por «12», e «0» com «registadas» tapado
pela data, nas duas edições, nos dois temas, e também na versão que está no ar. O
passo passa a 36, que é o que a subida de um número de 19px pede por cima da
descida de uma legenda de 8,5px, e a caixa a 108, que é o que dois pares pedem
com a mesma folga em cima e em baixo; os afastamentos entre as três filas ficam
como estavam, 22 e 30, e a altura do desenho acompanha, de 350 para 398. Todas as
setas são derivadas destas medidas e nenhuma foi escrita à mão, e o primeiro
valor continua à mesma altura em todos os nós da fila. Conferido por renderização
a 1280 e a 1024, em claro e em escuro, nas duas edições, e no HTML: as dez chaves
`data-prova` desenhadas, as dez portas da legenda e os dez números continuam os
mesmos, «14 70 132 12 23 120 5 0 2026-08-17 3».

**K · A navegação ganha alvo de toque num apontador grosseiro.** O selo já sobe
para 44px em ecrã de toque desde a §1.43; as ligações da barra e do rodapé, que
são as primeiras que qualquer pessoa usa, ficaram nos cerca de 25px que a letra
lhes dava. Passam a 44px dentro de `@media (pointer: coarse)`. A marca da página
atual passa, dentro da mesma regra, de um fio no fundo da caixa a um sublinhado
do texto: com a caixa a 44px o fio ficava a mais de dez pixels do que sublinha. Em
cursor não muda nada, e isso é estrutural e não medido, porque a regra inteira
está dentro da condição na folha construída. Medido do lado de lá, com a condição
reescrita para `(pointer: fine)` numa cópia descartável do `dist`: as ligações
passam de 25,6px para 44,0px de altura com as mesmas posições horizontais.
**Uma renderização de Chrome não é um apontador grosseiro**, e nenhuma opção de
linha de comandos o torna: `--touch-events=enabled` deixa `(pointer: coarse)` em
falso. A emulação está dita como emulação.

#### O que foi lido e mantido, com a razão

- **A linha da dívida não tem excerto nem endereço**, e é uma das doze da dívida
  de proveniência (§4.2, item 3), que é o bloco T. Está à vista, contada, e dita
  na própria página com o marcador e o motivo.
- **Nenhuma linha tem data de reconferência independente.** O campo
  `verifications[]` não existe no formato: não há uma linha do livro-razão com
  ele, e o que o conta no sítio conta-o defensivamente, contra um campo que
  ninguém escreve. É o bloco T, e a página já o diz, com o marcador e a porta
  para a regra da releitura no Método.
- **Três vigilâncias estão «Em curso» com «Sem decisão da direção registada»**
  enquanto o Método diz que é a direção que decide. Conferido no registo: os três
  itens de tipo `vigilancia` têm `decidido_por` e `decidido_em` a nulo, e a
  página rende a frase três vezes. O registo está honesto: a decisão é do
  diretor, e é dele que se espera na pré-visualização. Fica nomeada como tal, e
  não como defeito.
- **O item concluído do município não tem critério**, por registo:
  `evora-pagina-de-municipio` tem zero critérios e `concluido` como estado. O
  registo diz o que tem; inventar-lhe um critério a posteriori seria escrever
  história.
- **Três contagens do sítio entram na primeira página como linhas seladas da
  casa**: `municipios-com-estudo-aprofundado`, `municipios-sem-estudo-aprofundado`
  e `estudos-evora-publicados`. É a decisão em pé da §1.41 e da §1.42, «duas
  garantias legítimas»: têm linha, têm derivação escrita e têm selo, e trocá-las
  por porta seria trocar uma garantia por outra sem ganhar nada. Não muda.
- **«UE-27» e «Lei n.º 73/2013» passam o portão por motivo declarado**, e é a
  lista de exceções que os cobre, cada um com a sua razão escrita:
  `tokens`, `UE-27`, âmbito `any`, «Nome do agregado de referência da União
  Europeia. É um nome, não um valor.»; e `tokens`, `73/2013`, âmbito `body`, «É o
  NOME de uma lei, da mesma classe que "UE-27": não mede nada e não pode ser
  escrito sem algarismos.» O artigo tem a sua própria entrada, `52.º`, pela mesma
  razão. Nenhum é uma dispensa de medição: o limite legal e o índice contra ele
  têm linha própria, ao lado.
- **A redação do Método sobre os números do sítio.** O Método escreve «Um número
  chega ao leitor só se tem linha, e a linha diz de onde veio.» e «Ao lado de cada
  número há um selo que abre a sua linha», e a §10 da constituição diz que uma
  contagem do próprio sítio leva porta e não selo. As duas coisas convivem hoje
  porque as contagens que aparecem com selo são linhas da casa a sério, mas a
  frase, lida à letra, promete mais do que a regra dá. É texto governado: o corte
  é da direção, e vai para a §4.1 como afinação de redação para a leitura do
  Método na pré-visualização.
- **O mosaico não passa a tabela.** É a decisão da direção S: uma grelha de
  células, cada uma um `<article>` com o seu cabeçalho e o seu selo, e não uma
  matriz de linhas e colunas onde se compara medida com medida. Comparar oito
  medidas que não são comparáveis é exatamente o que a §11 recusa.
- **Os cartões da agenda levam todos os campos porque o portão os exige.** Não é
  excesso de zelo do gabarito: a conferência dos textos governados exige o item
  inteiro, cada critério dentro do seu próprio elemento e cada entrada de
  histórico dentro do seu, e esvaziar um deixando a marca fecharia o portão.
- **Os dois identificadores anteriores ao Acordo visíveis na agenda**
  (`taxa-de-actividade-2025` e `taxa-de-cambio-efectiva-real-2025`) são
  endereços, e não texto: a §1.40 fixou que um id é o nome de uma coisa e não
  muda de grafia por a superfície ter mudado.
- **O mapa tem travessia por teclado**, e está em `public/js/mapa.js`: o
  invólucro leva `tabindex="0"`, o `keydown` responde às quatro setas e há um
  `focus` que abre a leitura. A observação leu o HTML construído, onde não
  aparece: quem a fez tinha razão no que viu e não no que concluiu.
- **Os alvos de toque dos selos** já são 24px de altura mínima em cursor e 44px
  num apontador grosseiro desde a §1.43. As renderizações não são apontadores
  grosseiros, e por isso a medição de um e de outro faz-se como no ponto K.

#### O que sai daqui para a §4.1

**As afirmações da prosa da primeira página que nenhuma linha da página
sustenta.** A frase da posição de investimento foi corrigida acima porque estava
**errada**; estas não estão erradas, estão **por provar na página onde são
lidas**, que é outra coisa e é trabalho do portão da prosa, fase 4. Ficam aqui
com as palavras exatas, nas duas edições, para que a próxima leitura não as
redescubra:

| Célula | A afirmação | O que a página não tem |
| --- | --- | --- |
| Dívida pública | «e a descer» · «and falling» | Uma tendência. O sítio publica um valor de 2025 e nenhuma série. |
| Preços da habitação | «O limiar foi ultrapassado em 2024 e o excesso quase duplicou no ano seguinte» · «The threshold was breached in 2024, and the overshoot nearly doubled the following year» | O valor de 2024, e portanto a comparação entre os dois anos. |
| Taxa de emprego | «Está acima da média da União» · «It sits above the Union average» | A média da União. A célula não tem limiar nem comparação derivada. |
| Crianças em creche | «É das medidas em que Portugal mais se destaca no painel social» · «It is one of the measures where Portugal stands out most on the social scoreboard» | As outras medidas do painel social contra as quais o superlativo se mede. |
| Abandono escolar precoce | «Era mais de um terço no início do século» · «It was over a third at the turn of the century» | Um valor do início do século. |
| Sobrecarga do custo da habitação | «Está abaixo da média europeia» · «It is below the European average» | A média europeia. |
| Sobrecarga do custo da habitação | «a própria Comissão adverte que só se lê ao lado do regime de propriedade» · «the Commission itself warns it must be read alongside the tenure structure» | A citação da Comissão. É uma atribuição sem porta. |

E uma de outra natureza, que fica dita por honestidade e não como tendência: o
custo unitário do trabalho diz «A definição por hora é de 2024: antes media-se
por pessoa empregada.» Não compara valores nem afirma um sentido, mas é uma
afirmação sobre a metodologia da fonte que a página não sustenta em lado nenhum.

**O nome acessível dos selos dentro de uma legenda de instrumento.** Na legenda
do instrumento n.º 1 da primeira página há catorze selos e **três** nomes
acessíveis distintos: seis dizem «Linha do livro-razão: calculado · Avaliação
Económica Regional de Portugal 2026 fonte», seis dizem o mesmo sem «calculado», e
dois dizem «Linha do livro-razão: calculado · Alentejo & Algarve — Economy,
Society, Strategy fonte». Quem ouve a lista de ligações de uma página ouve
catorze portas com três nomes. É um defeito real de acessibilidade e não é uma
afinação: distingui-los obriga o texto oculto a levar a linha, e obriga a
conferência (4) da conferência da `proveniencia` em `scripts/gate-html.mjs`, a
que compara o texto inteiro do selo com `seloDaLinha(id, lang).inteiro`, a
aprender a forma nova. É desenho de conferência, e por isso vai para a fase 4 com
o portão da prosa e não para aqui.

#### As duas réguas, antes e depois

A régua dos defeitos (`scripts/medir-defeitos.mjs`) correu nas duas
construções: o «antes» é `04a0133`, construído de propósito para esta comparação
e não copiado da §1.43.

| | Antes (`04a0133`) | Depois |
| --- | --- | --- |
| páginas construídas | 307 | 307 |
| porta de correções | 307/307 | 307/307 |
| primeira página: valores sem selo · selos para outra linha | 0 · 0 | 0 · 0 |
| frases de moldura | 77 distintas · 2 617 ocorrências | **75 distintas · 2 593** |
| `[descrição em preparação]` | 0 | 0 |
| linhas com `#page=` | 23 de 132 | 23 de 132 |
| localizadores internos | 0 | 0 |
| `class="marcador"` | 502 | 502 |
| «[a verificar]» | 602 | 602 |
| `data-linha-campo="excerpt"` | 218 | 218 |

**As duas frases de moldura a menos são as duas citações do colofão**, que
apareciam nas duas edições da primeira página e em mais lado nenhum. As
vinte e quatro ocorrências a menos são essas duas mais as cadeias do colofão que
a régua contava, e a régua conta como moldura todo o bloco de trinta ou mais
caracteres que se repita em mais do que uma página.

E as conferências, todas verdes depois do último item: `npm run build`,
`npm run typecheck`, `node scripts/ortografia.mjs --verificar`,
`npm run check:cruzamento -- --with-origin` e `npm run ledger:check`.

#### O que este bloco acrescentou e não tem amarra

**Quatro chaves novas em `src/i18n/strings.mjs`**, oito cadeias nas duas
edições: os quatro nomes das regiões de navegação (`rotuloPrincipal`,
`rotuloRodape`, `rotuloIdioma`, `rotuloErro`). E **três saíram**, seis cadeias:
as do colofão (`estaPagina.eyebrow`, `.rede`, `.tipos`). Nenhuma tem decisão
registada que a governe, e é o item 9 da §4.2: a amarra governa `sobre.mjs` e
`metodo.mjs`, e as cadeias de `strings.mjs` mudam sem que nada o note. Ficam
contadas aqui, como as dezanove da §1.43.

#### O que fica aberto

- **A leitura cruzada aconteceu; a pré-visualização e a palavra da direção
  não.** Continuam a ser o que se segue, e este ramo continua sem ser fundido.
- **Os testes 1 e 3 do `BRIEF-confianca.md` §6.8 continuam a não passar**, e
  continuam a não passar com desenho: são dados que o formato não tem, e são o
  bloco T.
- **O `gate:identidade` continua a não existir**, e as regras de folha de estilos
  da §1 e da §2 continuam a segurar-se por atenção. É a fase 4, e é onde o portão
  da prosa e o nome acessível dos selos também vão dar.

#### A segunda leitura

O mesmo revisor de outra família de modelos (Codex), outra vez sem contexto do
bloco, leu as mesmas seis páginas depois de corrigidas: a primeira página, uma
linha do livro-razão com documento em PDF, a linha da dívida, o município de
Évora, o Método e a agenda. Na cópia que lhe foi dada estavam **cinco estragos
plantados novos**, das mesmas cinco classes da primeira leitura: um valor sem
selo, um travessão, um segundo marcador de incerteza a par de `[a verificar]`,
uma caixa de exemplo e um limiar sem o motivo que o declara. **Apanhou os
cinco.**

A conta, dita por extenso para não ter de ser refeita: as §1.41 e §1.42 contam
**oito** plantados e oito apanhados em três leituras cruzadas; a primeira
leitura da v2, acima, conta **cinco**; esta conta **cinco**. São **dez em dez
sobre a v2** e **dezoito em dezoito nas cinco leituras cruzadas desta
constituição** (8 + 5 + 5 = 18).

Das observações reais desta segunda leitura saíram os cinco itens abaixo. Nove
ficaram lidos e mantidos, com a razão, a seguir a eles.

**O que mudou**

**1 · A abertura da agenda deixa de prometer o que três itens não têm.** A
entrada dizia «Cada item traz o critério que o pôs aqui, quem o propôs, quem o
decidiu, e o registo de cada mudança de estado.» Conferido na página
construída: três itens rendem «Sem decisão da direção registada» e um rende
«Sem critério de nenhum dos quatro tipos». A frase prometia mais do que o
registo dá, e a saída não é calar o que falta: é a entrada dizer as duas
coisas. Passa a «Cada item traz o critério que o pôs aqui, quem o propôs e quem
o decidiu, ou diz o que ainda lhe falta; e traz o registo de cada mudança de
estado. Nada sai desta lista em silêncio.» Em inglês, «Each item carries the
criterion that put it here, who proposed it and who decided it, or says what it
still lacks; and it carries the record of every change of state. Nothing leaves
this list in silence.» É prosa da casa e não campo do registo: as marcas
`data-agenda` e a comparação carácter a carácter não mudaram.

**2 · «di-lo», e não «diz-lo».** O sub-título do Relance da página do município
escrevia «cada uma dessas diz-lo na sua linha». A ênclise de «dizer» na terceira
pessoa do singular é «di-lo», e era a única ocorrência da forma errada em `src/`.
O `BRIEF-confianca.md` cita a frase antiga na sua §3.4: é a auditoria medida a
15.08.2026 e não se reescreve.

**3 · O euro deixa de ficar colado ao ano.** Nas duas linhas da divergência da
dívida, na camada Fundo do município, o gabarito escrevia o sinal do euro no fim
de uma linha e a data de referência na seguinte, e a moldura come essa mudança
de linha: a página rendia «54 681 562 fonte €2024». Passa a levar o separador da
casa entre a unidade e o ano, «€ · 2024», que é o que as células do mosaico já
escrevem (unidade · ano). Duas ocorrências em cada edição, e nenhum valor mudou.
Medido na construção: nenhum `€<span` em nenhuma das 322 páginas.

**4 · A nota da atribuição deixa de falar de partidos onde não há partido
nenhum.** Ao lado de cada `attributed_to` a página da linha escrevia «Como
consta do documento; o rótulo partidário é facto de registo · Porque não se
ordenam partidos →». Em `evora-orcamento-2025` a atribuição é «Município de
Évora», e a nota falava de uma coisa que não estava na página.

Conferido no livro-razão: **61 das 132 linhas** trazem `attributed_to`, em oito
listas distintas, e todas são organismos: «Município de Évora» (25), «SGMAI»
(10), «INE» (8), «DGAL» (8), «Recuperar Portugal» (5), «IEFP» (2), «Marques,
Cruz & Associados» (2) e «Anuário Financeiro dos Municípios Portugueses» (1).
**Nenhuma credita um partido**, e a §1.31 já tinha registado porquê: «Nenhum
rótulo partidário atravessou», porque a regra admite um partido só quando o
estudo atribui aquela decisão àquele executivo com uma linha citada, e as frases
que fazem essa ligação estão marcadas *(inferência)* pelo próprio estudo.

O formato também não tem campo que marque um elemento da lista como partido, e
por isso uma condição sobre ele seria uma condição sempre falsa: código que
nunca rende nada, que é o que a alínea E acima acabou de tirar de outro sítio.
Fica a frase que é verdadeira nas 61, «Como consta do documento.», nas duas
edições; sai a cláusula do partido e sai a porta que ela abria para a regra do
Método. **Nenhuma página de linha guarda a cláusula do partido, e as 61 linhas
perdem-na, o que são 122 páginas nas duas edições.** A regra continua escrita no
Método, e `/metodo#o-que-nao-faz` continua a existir. A cláusula volta com o
campo que a possa marcar, e não com uma adivinha.

O `ledger/README.md` prometia «a página da linha di-lo por palavras ao lado do
campo, nas duas edições», e essa frase passou a ser falsa: foi reescrita lá,
com a data e o motivo. A frase igual da §1.31 fica como foi escrita, porque era
verdadeira quando o foi, e é aqui que se corrige.

**5 · O sinal de percentagem cola-se ao número, nos dois sítios onde não
colava.** A §11 diz que a percentagem se escreve colada ao número, e a alínea I
acima deixou o caso escrito e por corrigir. Corrige-se aqui, em duas frentes.

*No título e na descrição de uma página de linha.* `tituloDaLinha` e
`descricaoDaLinha` juntavam sempre o valor e a unidade com um espaço. Passam por
`valorComUnidade()`, em `src/lib/livro.mjs`, que distingue **a unidade que
começa por símbolo, que se cola, da que começa por palavra, que fica com o
espaço**. A regra é escrita pela forma da unidade e não por uma lista de
unidades, para não haver uma segunda lista a manter ao lado do livro-razão.
Medido nos títulos construídos: 39 trazem `%`, **36 mudaram em cada edição**, 72
ao todo, e os três cuja unidade só acaba em «%» («variação em três anos, %»,
«variação anual média, %») ficam com o espaço, que é o que a frase pede.
«82 índice (UE-27 = 100)» e «54 681 562 euros» não mudaram um carácter.

*Na prosa.* Numa frase, o sinal vinha depois do selo, porque era um pedaço de
texto da frase e o selo é um elemento: a leitura breve do município lia-se «96
■ fonte % do orçamento». O `Claim.astro` ganha a propriedade `sufixo`, escrita
a seguir ao valor e antes do selo, **dentro do mesmo invólucro**, que é onde
`auditaSelo()` procura a porta, e **fora do elemento `data-claim`**, que
continua a conter exatamente o valor do livro-razão e mais nada. São 36 sítios
em seis páginas: a página do município (dez em cada edição) e dois estudos que
citam as mesmas frases da casa (quatro e quatro em cada edição).

Medido a 1280 e a 390, na página do município: **0px** entre o valor e o sinal
nos dez casos, **10px** entre o sinal e o selo, que é exatamente a folga que um
selo sem sufixo tem hoje, e nenhum par se parte em duas linhas a 390. A regra da
folha vai presa a `:has(.claim-sufixo)`, para que os selos sem sufixo fiquem
como estavam por construção; onde `:has()` não existir, o sinal fica a 10px do
número, que é o que a página já escrevia antes desta correção.

**E o que o portão não vê, dito aqui para não voltar a ser descoberto.** O
estrago plantado que se esperava que fechasse o portão **não o fecha**: com o
sinal metido dentro do elemento `data-claim` («96%» onde o livro-razão diz
«96»), o build fica verde. A conferência é
`digitsOf(renderizado) !== digitsOf(claim.value)`, e `digitsOf` deita fora tudo
o que não é algarismo, por isso «96%» e «96» são a mesma coisa para ela. O que o
portão guarda é o número, não a cadeia. Dois estragos que **fecham**, plantados
para provar que a amarra está inteira: o valor trocado para «69» fecha em 19
sítios com «a afirmação "evora-execucao-da-receita-2021" foi renderizada como
"69" mas o livro-razão diz "96".»; e um algarismo dentro do sufixo novo
(`sufixo: '%9'`) fecha o varrimento com «algarismos fora do livro-razão: "%9"».
O elemento novo está, portanto, dentro do alcance do varrimento e não abriu
buraco nenhum. O que falta é uma conferência da cadeia inteira, e vai para a
§4.1.

**O que foi lido e mantido, com a razão**

- **O mecanismo a 390 não está comprimido: rola dentro da sua caixa.** Medido
  pelo método da §1.43, num iframe de 390 servido da mesma origem: a janela do
  iframe tem 390px e o documento 375px, sem rolamento lateral da página; o
  `.mecanismo-svg` mede **760,00px de largura por 252,06px de altura**, que é o
  `min-width: 760px` da folha com o `viewBox` de `0 0 1200 398` inteiro
  (760 × 398 ÷ 1200 = 252,07); a `.svg-scroll` mostra 337px, tem
  `overflow-x: auto` e rola 423px. Quem leu viu o desenho cortado à direita, que
  é o que uma régua que rola faz, e não o desenho espremido.
- **«A lista e o calendário são dois registos do motor de investigação,
  publicados tal como atravessaram.»** Não é comentário sobre o sítio: é a frase
  de proveniência que a §1.41 escolheu, no lugar de uma que falava de bytes, de
  resumos criptográficos e da construção a fechar, e que afirmava um
  comportamento que os dois registos não guardam.
- **O instrumento n.º 2 sem camada 2** é o caso que a IDENTIDADE §4 já nomeia:
  «leva hoje só duas: não tem camada 2. Ou ganha uma leitura breve, ou declara
  por escrito porque não a tem.» Está nomeado, e é decisão de desenho.
- **As contagens em palavras da página do município.** «Oito medidas. Seis vêm
  de organismos que publicam para todos os concelhos do país; duas só existem
  porque o próprio município as publica, e cada uma dessas di-lo na sua linha.»
  Em inglês, «Eight measures. Six come from bodies that publish for every
  concelho in the country; two exist only because the municipality itself
  publishes them, and each of those says so on its own line.» São estado escrito
  em vez de renderizado: se uma medida entrar ou sair, a frase fica errada e
  nenhum varrimento a apanha, porque a régua dos algarismos não vê palavras.
  Vai para a §4.1 com as palavras exatas.
- **As citações de fonte em inglês sem `lang="en"`.** Numa página portuguesa, o
  excerto de `divida-publica-2025` rende «General government gross debt (EDP
  concept), consolidated - annual data …» dentro de um documento em `pt-PT` e
  sem língua declarada: quem ouve a página ouve inglês lido à portuguesa. Não se
  corrige aqui porque **o registo não tem campo de língua por campo**: pôr
  `lang="en"` a olho seria adivinhar qual dos 132 excertos está em que língua.
  Vai para a §4.1, e é trabalho do motor antes de ser do sítio.
- **Os dois identificadores anteriores ao Acordo como texto de ligação.**
  `taxa-de-actividade-2025` e `taxa-de-cambio-efectiva-real-2025` são dois dos
  132 ids, e aparecem como texto em seis páginas construídas: o índice do
  livro-razão, a sua própria página de linha e a agenda, nas duas edições. A
  §1.40 fixou que um id é o nome de uma coisa e não muda de grafia por a
  superfície ter mudado.
- **As três contagens do sítio como linhas seladas da casa.** É a decisão em pé
  da §1.41 e da §1.42, já dita na lista da primeira leitura: têm linha, têm
  derivação escrita e têm selo, e trocá-las por porta seria trocar uma garantia
  por outra sem ganhar nada.
- **O mapa tem travessia por teclado**, e está em `public/js/mapa.js`: o
  invólucro leva `tabindex="0"` (linha 140), as quatro setas estão declaradas
  (146), o `keydown` responde (148) e há um `focus` que abre a leitura (183).
  A observação repetiu-se porque leu o HTML construído, onde isto não aparece.
- **Os alvos de toque** são os da alínea K: 44px dentro de
  `@media (pointer: coarse)`, e uma renderização de Chrome não é um apontador
  grosseiro.

**As duas réguas desta leitura**

O «antes» é `e97ca23`, a ponta do ramo antes destes cinco itens, construído de
propósito para esta comparação.

| | Antes (`e97ca23`) | Depois |
| --- | --- | --- |
| páginas construídas | 307 | 307 |
| porta de correções | 307/307 | 307/307 |
| primeira página: valores sem selo · selos para outra linha | 0 · 0 | 0 · 0 |
| frases de moldura | 75 distintas · 2 593 ocorrências | **73 distintas · 2 471** |
| `[descrição em preparação]` | 0 | 0 |
| linhas com `#page=` | 23 de 132 | 23 de 132 |
| localizadores internos | 0 | 0 |
| `class="marcador"` | 502 | 502 |
| «[a verificar]» | 602 | 602 |
| `data-linha-campo="excerpt"` | 218 | 218 |

**As duas frases de moldura a menos são as duas notas da atribuição**, uma por
edição, cada uma em 61 páginas: «Como consta do documento; o rótulo partidário é
facto de registo Porque não se ordenam partidos →» e a sua igual inglesa. São
também as 122 ocorrências a menos. A nota que fica tem 25 caracteres e a régua
conta blocos de 30 ou mais: deixa de ser contada por ser mais curta, e não por
ter desaparecido.

E as conferências, todas verdes depois do último item: `npm run build`,
`npm run typecheck`, `node scripts/ortografia.mjs --verificar`,
`npm run check:cruzamento -- --with-origin`, `npm run ledger:check` e
`node scripts/medir-defeitos.mjs`.

**O que esta leitura mexeu em `strings.mjs`, e não tem amarra**

Uma chave saiu, `livro.linha.atribuicaoNotaPorta`, com as suas duas cadeias; e
mudaram onze cadeias sem mudar de chave: a nota da atribuição e a abertura da
agenda nas duas edições, e os quatro pedaços de frase do município que traziam o
sinal de percentagem dentro do texto (`distanciaIndiceB`, `distanciaIndiceD`,
`tempoSerieB`, `tempoSerieD`, nas duas edições, que são oito). Nenhuma tem
decisão registada que a governe, e é o item 9 da §4.2, como as dezanove da §1.43
e as da primeira leitura.

A IDENTIDADE não mudou: nenhuma das cinco correções tornou falsa uma regra dela.
As alíneas 3 e 5 são a §11 a ser cumprida onde não estava.

### 1.45 A direção decide as vigilâncias, sela a pergunta da habitação, e o Método diz «medição»

**Afecta:** metodo · agenda
**Texto:** metodo 67205ce6ebeb
**Agenda:** habitacao 2026-08-18 · dgal-endividamento-2025 2026-08-18 · evora-contas-2026 2026-08-18 · evora-contas-2024-pagina 2026-08-18

*Este registo segue a grafia que §1.38 fixou.*

A 2026-08-18, em conversa, a direção leu as três vigilâncias, a pergunta da
habitação e, do Método, as regras cujas provas a §1.39 dá como mais fracas (1, 6,
9 e 10) e a frase da regra 5, e decidiu sobre as três coisas: manter as
vigilâncias, selar a pergunta, mudar duas palavras e nada mais. Este bloco é o
registo dessas decisões e o mínimo de código que a página precisava para as dizer
sem mentir.

#### As três vigilâncias ficam em curso, e a decisão fica escrita

`dgal-endividamento-2025`, `evora-contas-2026` e `evora-contas-2024-pagina`
entraram na agenda a 2026-08-16, propostas pelo motor, e as três tinham
`decidido_por: null`: a página escrevia «Sem decisão da direção registada», e era
verdade. A direção leu-as e decidiu mantê-las em curso. Passam a
`decidido_por: direcao`, com a data e a fonte, e cada uma leva uma entrada de
histórico do tipo `alteracao` que sai de `em_curso` e chega a `em_curso`.

Uma entrada cujo estado de partida e de chegada é o mesmo pode parecer ruído, e
não é. A regra 8 promete que nada sai desta agenda em silêncio, e o que aconteceu
a 2026-08-18 foi uma mudança de quem responde pelas três, não do que se está a
fazer com elas: sem entrada, a decisão apareceria como um campo que trocou de
valor sozinho. O exportador aceita-a sem precisar de mudança nenhuma, e a razão é
a forma da H1: a continuidade que ela exige é `de` igual ao `para` da entrada
anterior, e é.

#### A entrada que não é uma transição passa a dizê-lo

Com `de` igual a `para`, a página escrevia «Em curso → Em curso». A seta anuncia
uma mudança de estado, e ali não houve nenhuma. A página passa a ter três formas
e não duas: a entrada, que não vem de estado nenhum, «passa a X»; a transição a
sério, `X → Y`; e a entrada de mesmo estado, «estado mantido: X», «state
unchanged: X» na edição inglesa. A marca `data-agenda-transicao` não mudou, e
continua a levar `de` e `para` crus do registo.

O portão ganhou a segunda frase na sua própria cópia dos rótulos, ao lado da
primeira, pela razão de sempre: se lesse a cadeia do gabarito, confirmava o
gabarito. Não é conferência nova, é a mesma a conhecer as três formas.
**Os dois estragos plantados, cada um reposto:**

| Estrago | O portão |
| --- | --- |
| uma entrada de mesmo estado escrita «passa a» | fecha: «a entrada 1 do histórico de "dgal-endividamento-2025" escreve a transição "passa a Em curso" e o registo leva-a de "em_curso" a "em_curso", que se escreve "estado mantido: Em curso"» |
| uma transição a sério escrita «estado mantido:» | fecha: «a entrada 2 do histórico de "habitacao" escreve a transição "estado mantido: Em curso" e o registo leva-a de "a_seguir" a "em_curso", que se escreve "A seguir → Em curso"» |

O segundo estrago precisou de uma transição a sério, que o registo de hoje não
tem: foram plantadas em `habitacao` duas entradas que a levam a `em_curso` e a
trazem de volta, e por isso nenhuma contagem de estado se mexeu. Os dois fecham
nas duas edições, e o ficheiro do registo voltou byte a byte ao que o exportador
escreveu.

#### A pergunta da habitação está selada

A direção leu a pergunta, e `python3 -m core.prereg freeze` selou o registo
prévio do motor: `core_sha256`
`a52898c8638ebf3741bd65d2f46f874dc5f43cfbbd6fffe9ac112df5413bd209`, escrito no
próprio ficheiro do registo ao lado do número de emendas à data do selo. A
pergunta já não muda sem emenda registada, e a recolha ainda não começou. O item
`habitacao` passa a `registo_previo_estado: selado`, e a página deixa de escrever
«esta ainda não foi selada» por baixo da pergunta. A pergunta não foi tocada: o
`freeze` acrescentou dois campos e mais nada.

**A data ao lado do selo era a do registo, e não a do selo. Foi corrigida no
mesmo dia, dos dois lados da fronteira.** Ao construir isto apareceu uma data
falsa: a A10 comparava `registo_previo_em` com o campo `registered` do registo
prévio, que é 2026-08-16, o dia em que a pergunta foi registada, e o `freeze` não
escrevia data nenhuma. A página escreveu, durante a construção, «Registo prévio
selado a 2026-08-16» sobre um selo feito a 2026-08-18. A direção decidiu corrigir
antes de isto sair, e não publicar com a data errada. Está feito assim:

- **O selo passa a ter data própria.** O `freeze` escreve `sealed_at` com o dia
  em que sela, fora do núcleo selado: datar um selo não é mudar a pergunta, e a
  data dentro do resumo faria cada selo mudar aquilo que sela. Um selo feito antes
  desta mudança não é resselado, porque resselar seria certificar hoje uma coisa
  que ninguém fez hoje, e porque moveria a contagem de emendas: é reportado como
  dívida, e a data escreve-se com `python3 -m core.prereg stamp-seal-date`,
  guardado para recusar um registo por selar, um núcleo que se mexeu desde o selo,
  e uma segunda data. O selo da habitação ficou datado por esse caminho, e o
  núcleo não foi tocado.
- **A A10 passa a pedir a data certa.** Um registo selado é datado pelo
  `sealed_at` e um só iniciado pelo `registered`. A recusa nomeia as duas datas,
  porque as duas são reais e estão as duas no ficheiro: quem apenas confira que o
  campo é uma data não vê a troca.
- **A página não precisou de mudar.** O rótulo já escolhia pelo estado, «Registo
  prévio iniciado a» ou «Registo prévio selado a», e o portão já o comparava com a
  sua própria cópia desde a §1.42. O que mudou foi a data que o registo lhe dá. A
  página escreve hoje «Registo prévio selado a 2026-08-18» e «Pre-registration
  sealed on 2026-08-18».

**Os três estragos, cada um reposto:**

| Estrago | O que fecha |
| --- | --- |
| um registo selado sem `sealed_at` | o `core.prereg check` reporta-o: «sealed with no `sealed_at`», e a razão, «the seal has no date, and anything publishing it has to fall back on `registered`, which may be a different day» |
| um registo selado datado pelo dia do registo | o exportador fecha: «registo_previo_em is '2026-08-16' and the registration's `sealed_at` is '2026-08-18' (A10) ... Publishing one date under the other's label is a false date on a public page» |
| a página a escrever «selado a» sobre um registo `iniciado` | o portão fecha, nas duas edições: «o item "habitacao" diz o registo prévio com "Registo prévio selado a 2026-08-18, por selar" e o estado "iniciado" escreve-se "Registo prévio iniciado a"» |

O primeiro não teve de ser plantado: era o estado a sério do ficheiro entre o selo
e a correção, e a frase acima é a que o `check` deu sobre ele. As conferências do
motor ficam em 20 no `prereg_test` e 44 no `export_agenda_test`. Nenhuma entrada
de histórico mudou nesta correção, e por isso os resumos do registo da travessia
ficam onde estavam: para a H4, o que atravessou continua a ser um prefixo.

A primeira entrada do histórico deste item diz que a direção ainda não tinha lido
a pergunta. É história, e fica como foi escrita. O que se acrescenta é a entrada
de 2026-08-18, que diz que leu.

**E uma conferência do motor tinha deixado de conferir.** A conferência 25 de
`export_agenda_test.py` plantava `registo_previo_estado: selado` sobre um registo
por selar; com o registo selado, essa linha deixou de plantar seja o que for, e a
bateria de conferências ficava verde sobre uma que já não podia fechar. Passa a
plantar sempre o contrário do que é verdade no dia, e volta a fechar:
«registo_previo_estado says 'iniciado' and the registration is 'selado' (A10)».

#### As duas palavras do Método

A §1.44 registou o ponto, lido pela revisão cruzada: o Método escreve «Um número
chega ao leitor só se tem linha» e «Ao lado de cada número há um selo que abre a
sua linha», e a §10 da constituição diz que uma contagem do próprio sítio leva
porta e não selo. As contagens `data-prova` da casa são números que chegam ao
leitor sem selo nenhum, e por isso a frase, lida à letra, prometia mais do que a
regra dá.

A direção leu as dez regras e cortou duas palavras: «número» passa a «medição» na
leitura breve do instrumento e na regra 5, nas duas edições. Uma medição é o que
sai do livro-razão com a sua origem; uma contagem que o sítio faz de si próprio
não é uma medição, e é por isso que leva porta. As duas frases passam a ser
verdadeiras à letra.

Uma terceira frase tinha a mesma promessa e escapou a esta leitura. Foi a leitura
cruzada que a encontrou, e o registo dela é a §1.46.

#### O que não mudou

`IDENTIDADE.md` não mudou neste passo, e nenhuma destas decisões torna falsa uma
regra dela: a §10 é a razão do corte do Método e não a sua vítima. Uma citação
dela ficou a citar uma frase que o Método já não diz, e isso é da §1.46. `src/data/sobre.mjs` não mudou, e
por isso esta entrada não o nomeia. As outras nove regras do Método estão como
estavam, palavra por palavra. `src/data/calendario.json` atravessou outra vez e
não mudou um byte, e o registo da travessia só cresceu, que é o que a H4 exige.

### 1.46 A leitura cruzada do bloco da agenda, e a palavra que faltava ao corte

**Afecta:** metodo
**Texto:** metodo 4df6de48cbb1

*Este registo segue a grafia que §1.38 fixou.*

Um leitor de outra família (Codex, com o contexto cortado) leu os dois diffs da
§1.45 e as páginas construídas, e devolveu «fundível depois destas correções».
Onze pontos, todos fechados, e um deles não era um defeito.

#### O que faltava ao corte do Método

A §1.45 mudou «número» para «medição» em duas frases, e deixou uma terceira com a
mesma promessa: a regra 3 dizia «Uma linha por número, com essa origem», que é o
que a regra 5 diz do selo, escrito do lado do livro-razão. Fica «Uma linha por
medição, com essa origem» e «One row per measurement, with that origin». O corte
da direção era «ficam as dez regras, muda a palavra onde ela promete», e esta era
uma delas.

**Uma ocorrência fica, e fica por uma razão.** O limite da regra 5 diz «O selo
prova que o número da página é o da linha». Ali «número» está certo: os algarismos
que aparecem ao lado de um selo são, por construção, uma medição do livro-razão, e
a frase fala desses. A §1.45 dizia que as restantes ocorrências «falam do trabalho
do motor e do varrimento», e a leitura marcou-a como falsa, com razão: esta não
fala. A razão a sério é esta.

#### A constituição citava uma frase que já não existia

A §5 da `IDENTIDADE.md` abria com *«O selo de proveniência junto a cada número é a
porta para essa linha.»*, dado como o que o Método promete nas duas línguas. O
Método não diz isso desde o bloco V, que reescreveu as dez regras: a citação ficou
a citar uma frase que deixou de existir, e ninguém deu por ela porque **nenhuma
conferência lê a constituição**. Passa a citar a regra 5 tal como está hoje,
palavra por palavra: *«Ao lado de cada medição há um selo que abre a sua linha:
cheio quando a origem está completa, a tracejado quando falta um campo.»* Os três
pontos por baixo dela não mudam, porque era essa a promessa que eles já
desdobravam.

Fica dito o que isto é: uma citação da constituição pode voltar a envelhecer no
dia em que o Método mudar, e não há nada construído que o note. Vai para a §4.

#### «Estado mantido» em vez de «mantém-se em»

A frase da entrada de mesmo estado lia-se mal: o rótulo do estado já é um nome, e
a preposição punha duas coisas a concordar que não concordam. Passa a «estado
mantido: Em curso» e «state unchanged: Under way». Os dois estragos plantados
outra vez contra a redação nova, cada um reposto, cada um a fechar nas duas
edições: uma entrada de mesmo estado escrita «passa a» («que se escreve "estado
mantido: Em curso"»), e uma transição a sério escrita «estado mantido:» («que se
escreve "A seguir → Em curso"»).

#### A data do selo, do lado do motor

A §1.45 pôs a data do selo a existir. A leitura mostrou que ela ainda não estava
segura, e são quatro coisas:

- **O `stamp-seal-date` tinha data por omissão.** Hoje é o dia em que se repara
  na falta, e não o dia em que o selo foi feito, e a omissão escrevia o primeiro
  pelo segundo justamente nos ficheiros para que o comando existe. A data passa a
  ser exigida; quem sela lê o dia na história do repositório.
- **A forma da data.** O `date.fromisoformat` aceita `20260818` desde o 3.11, e
  essa cadeia numa página imprimia-se como está. Passa a ser conferida por padrão
  e por calendário.
- **A data não estava atada ao selo.** `seal_sha256` é o resumo de `core_sha256`
  com `sealed_at`. Sem ele, mexer na data mudava o que a página imprime sem que
  nada reparasse. O `check` recusa uma data mexida depois do selo, e a A10
  confere a atadura **na fronteira**, antes de comparar datas, porque é ali que a
  data está prestes a ser publicada: dois campos a concordarem um com o outro não
  são prova, o resumo sobre os dois é.
- **O ficheiro.** O `freeze` e o `stamp` passam a escrever por um só escritor,
  com mudança de linha final, e a conferência do `stamp` julga o ficheiro que ele
  escreveu em vez de acreditar no que ele imprime sobre si próprio.

**Os estragos, cada um reposto:**

| Estrago | O que fecha |
| --- | --- |
| a data do selo mexida depois do selo | o `check` fecha: «the seal date was changed after the seal. `seal_sha256` binds `core_sha256` to `sealed_at`, and this file carries 4d48864dfc7d where the two fields in it make 6d899a19db10» |
| a mesma, vista da fronteira | a A10 fecha: «the registration's seal date was changed after the seal (A10) ... The date this page would print is not the date that was sealed» |
| um selo datado e não atado | a A10 fecha: «the registration is sealed and carries no `seal_sha256` (A10)» |
| `20260818` como data | o `stamp` recusa: «'20260818' is not a date in the form AAAA-MM-DD» |
| o `stamp` sem data | recusa: «this command needs the date the seal was made ... It is not defaulted to today» |
| uma segunda data por cima da primeira | recusa: «already dated 2026-08-18, and this says 2026-08-19. A seal is dated once» |

As conferências do motor ficam em 25 no `prereg_test` e 46 no `export_agenda_test`.
O selo da habitação ficou atado pelo mesmo caminho guardado, `seal_sha256`
4d48864dfc7d, e o `core_sha256` continua a52898c8638e: o resumo é sobre o objecto
e não sobre os bytes.

#### O ponto que não era um defeito

A leitura disse que a dívida «selo sem data» disparava também num registo que
nunca foi selado, por a cadeia não ter guarda. A cadeia é `if/elif` e o primeiro
ramo devolve `core never sealed`, por isso o caso nunca chegava lá. Está
verificado a correr, e não por leitura: com o guarda retirado de propósito, a
bateria fecha e diz «an unsealed registration was reported as an undated seal».
A conferência de controlo negativo fica, plantada, porque uma linha de dívida que
dispara no ficheiro errado ensina a ignorar a lista inteira.

#### A redação, e porque é que esta entrada existe em vez de a §1.45 ser reescrita

Onde os comentários e a §1.45 diziam que a data errada **esteve publicada**,
passam a dizer o que aconteceu: foi renderizada na construção e corrigida antes de
sair. Nada disto chegou ao ar, e escrever que chegou seria uma segunda
imprecisão por cima da primeira.

E o resumo novo do Método veio numa entrada nova, e não por cima da linha
`Texto:` da §1.45. Foi o varrimento do motor que o exigiu: reescrito, o
`sweeps/decisoes.py` respondia «entrada reescrita no mesmo commit: não escreveu
uma decisão nova, reescreveu a §1.45 e o carimbo dentro dela», que é exactamente
a mudança que a conferência do sítio não consegue ver, porque depois dela o
carimbo e o ficheiro voltam a bater certo (§1.40, e a revisão cruzada 2 que a
pôs lá). A §1.45 fica com o resumo que carimbou no dia em que foi escrita, e esta
entrada carrega o de hoje.

E fica dito com precisão, porque o varrimento passa a responder OK e a razão
importa: o resumo `4df6de48cbb1` aparece pela primeira vez no commit que o pôs,
por engano, dentro da §1.45, e este ramo guarda esse commit e a correção que se
lhe seguiu. O varrimento responde OK porque a pergunta que faz é se o commit do
carimbo reescreveu **a entrada que hoje o carrega**, e a §1.46 não existia nesse
commit. A sequência inteira está no ramo, e está escrita aqui, que é o que
distingue uma correção de um apagamento.
### 1.47 O bloco T: a página da linha passa a ser o recibo, com dados a sério

**Afecta:** nenhum

*(O bloco T mudou o formato do livro-razão, o validador, o exportador do motor, o
portão e a página da linha, e não mudou uma palavra de nenhum dos textos
governados: o Sobre, as dez regras do Método e os dois registos da agenda estão
como estavam. Por isso a entrada não nomeia nenhum, e não traz linha `Texto:`.
O que o T1 encontrou no Método, e não corrigiu por ser texto governado, está
escrito no fim da sua secção.)*

*Esta entrada escreve-se no Acordo de 1990, como as entradas a partir da §1.43.
O que é citado fica com os caracteres que tem. Cada estádio do bloco acrescenta
aqui a sua secção; a especificação de todos eles é o `BRIEF-bloco-T.md`.*

#### T1 · `document.page` e `verifications[]`

Os testes 1 e 3 do `BRIEF-confianca.md` §6.8 não passam com desenho: pedem que a
linha impressa se veja numa ligação, e que qualquer linha diga a data da última
leitura **e** a data da última reconferência independente. Os dois pedem campos
que o formato não tinha. O T1 põe os dois no formato, e enche-os com o que já
tinha acontecido e não estava escrito em lado nenhum.

##### `document.page`: a página deixa de se ler de duas maneiras

Até aqui a página de um PDF vivia em dois sítios e em nenhum deles como campo:
em prosa, dentro do `document.locator` («PRESTACAO_CONTAS_2025.pdf, p. 119»), e
como fragmento `#page=119`, dentro do `source_url`. O exportador do motor lia o
número do localizador em tempo de travessia e pendurava-o no endereço. Nenhuma
conferência podia comparar um com o outro, porque nenhum dos dois era um campo.

Entra `document.page`: inteiro maior ou igual a 1, opcional, dentro de
`document`. **É a página do documento onde está a frase que o `excerpt`
transcreve**, e é a única origem da página. O que o `ledger:check` impõe:

| A regra | O caminho que fecha |
| --- | --- |
| endereço com `#page=N` obriga `document.page` e obriga-o a ser N | um fragmento que ninguém declarou |
| campo declarado sobre um `.pdf` obriga o endereço a levar `#page=<campo>` | uma linha que declara uma página e manda o leitor para a capa |
| localizador com `p. N` obriga o campo a ser N | a página escrita duas vezes com dois números |
| numa linha derivada ou da casa é recusado | uma página a apontar para um documento que a linha não cita |

A página da linha escreve «Abrir na página N» a partir do campo, marcada
`data-linha-campo="document.page"`, e o portão compara-a com o campo. A frase de
atribuição continua a escrever «p. N» a partir do endereço, com a marca
`source_url.page` que o portão já conferia com a sua própria cópia da regra do
`#page=`. **As duas batem por construção, porque o validador as obriga a bater**,
e renderizar as duas é o que torna essa obrigação visível na página em vez de
ficar só no validador.

No motor, o manifesto passa a declarar `page` por linha. As 23 linhas de PDF
ganharam-no por um passo único, `publisher/fixar_paginas_no_manifesto.py`, que
lê o que o `pin_page()` dava naquele momento e o escreve no manifesto: nenhum
número foi escrito à mão. A V7 estende-se ao campo, com a mesma exigência que já
fazia ao localizador, e um localizador que diga «p. N» sem `page` declarado é
recusado. Uma página é lida, nunca recordada.

##### `verifications[]`: a linha passa a poder dizer quando foi relida

O único campo de tempo de uma linha era `access_date`, «lido a»: o dia em que a
fonte foi lida pela primeira vez. Uma linha lida uma vez e nunca mais tinha
exactamente a mesma cara de uma linha relida ontem.

Entra `verifications[]`, no fim da linha, a seguir a `corrections`. Cada entrada
é uma releitura que aconteceu: `date`, `path` (o endereço lido nesse dia),
`result` (`igual`, `diverge`, `inacessivel`), `by` (`leitura-independente`,
`painel-semanal`, `revisao-cruzada`), e `found` só numa divergência, que é onde
ele quer dizer alguma coisa. O validador impõe a forma inteira: a data no
formato, nunca depois do dia da construção nem antes do `access_date`; o
endereço com esquema; os três valores de cada lista fechada; `found` obrigatório
numa divergência e proibido nas outras; a lista por ordem cronológica crescente;
sem entradas repetidas no quarteto (data, endereço, quem, resultado); e recusada
numa linha sem endereço, porque a derivada é reconferida pelo `check` a cada
construção e a da casa conta-se a si própria.

**Não se escreve à mão, e é essa regra que sustenta o campo.** Um campo de
reconferência preenchido à mão é a promessa mais fácil de fazer e a mais difícil
de desmentir. Há dois caminhos, e mais nenhum:

- **as linhas cruzadas**, pelo exportador do motor, a partir do registo da
  releitura cega de 2026-08-15 (`publisher/verificacoes/`) e de um mapa,
  `mapa.evora.json`, que diz por linha do sítio que valor de que registo lhe
  corresponde. **O mapa não carrega valores**: um número escrito ali podia ser
  copiado errado e nada o apanhava. A comparação faz-se no exportador. Ele corre
  o `conferir.py` do próprio registo e pára se ele falhar; recusa uma referência
  ou um índice que o registo não tenha; exige que o organismo da tabela seja o
  `source` da linha e que o período contenha o ano de `reference_date`; exige um
  endereço resolvido, que passa a ser o `path`; recusa duas entradas da mesma
  linha a partir do mesmo registo; e no fim diz em voz alta o que o registo leu e
  ninguém publicou. **Uma divergência não é uma recusa**: escreve-se
  `result: diverge` com `found`, e a corrida di-lo. Um tubo que só saiba publicar
  concordância publica concordância;
- **as 32 linhas de base** (`quadro-institucional`), pelo
  `indicators/refresh.py`, no fim de cada corrida das canárias: `igual` se a
  canária do valor passou, `diverge` com `found` se o valor mexeu, `inacessivel`
  se a canária de existência falhou. Escreve só o bloco `verifications` e deixa
  todos os outros bytes do ficheiro onde estavam; não escreve duas vezes a mesma
  (data, endereço, quem). Como o `verificacao.mjs`, fica por confirmar em disco e
  é revisto no mesmo diff de segunda-feira.

**A página** mostra «Lido a», como sempre, e a seguir uma linha por cada uma das
**duas** entradas mais recentes, da mais nova para a mais velha: o dia, quem
releu, o que encontrou, e a porta para repetir a leitura. Sem nenhuma entrada
fica o que já havia, o marcador com a porta para a regra da releitura no Método:
uma reconferência que não aconteceu não se desenha (IDENTIDADE §6).

**O portão confere o conjunto, e não só cada peça.** Cada entrada rendida diz que
posição da lista é, e é a essa posição que ele a vai buscar; os valores crus de
`by` e de `result` vão em atributos e comparam-se com a linha; os dois rótulos
comparam-se com a **cópia própria** do portão da tabela de rótulos, e nunca com a
cadeia do gabarito; e o conjunto rendido tem de ser exactamente as duas mais
recentes. Uma página que mostre a penúltima no lugar da última diz ao leitor que
a linha foi relida noutro dia, e nenhuma marca de campo apanha isso.

A prova ganha `linhas_reconferidas` e `releituras_divergentes`, e a descrição de
`releituras_registadas` deixa de dizer que o campo não existe. O portão reconta
as três por conta própria, sobre os mesmos ficheiros e com código próprio.

##### As contagens, antes e depois

| | Antes do T1 | Depois |
| --- | --- | --- |
| linhas com `document.page` | 0 (o campo não existia) | **23** |
| linhas com pelo menos uma reconferência | 0 | **53** |
| entradas de reconferência | 0 | **53** |
| `igual` · `diverge` · `inacessivel` | 0 · 0 · 0 | **53** · **0** · **0** |
| chaves de prova reconferidas pelo portão | 26 | **28** |

As 53 são 21 linhas de Évora, da releitura cega de 2026-08-15, e as 32 do quadro
institucional, da corrida do painel de 2026-08-18. **Nenhuma divergiu**: as duas
releituras leram o mesmo que o sítio publica. O registo da releitura imprimiu 28
valores; 21 têm linha no sítio e 7 não têm, e o exportador nomeia os sete na
corrida (os totais «inclui» da DGAL, a versão arredondada do poder de compra na
narrativa do INE, a taxa de execução só das receitas correntes, e o limite de
dívida previsto em PSF).

##### Os estragos plantados, cada um reposto

No sítio, o `ledger:check` sobre o formato:

| Estrago | O portão |
| --- | --- |
| `document.page` a discordar do `#page=` | «"document.page" é 118 e o endereço fixa a página 119 ("#page=119"). São a mesma página, e por isso têm de ser o mesmo número.» |
| `document.page` num endereço `.pdf` sem fragmento | «declara "document.page: 119" sobre um PDF e o endereço não leva "#page=119". Quem abre o endereço tem de cair na página que a linha declara.» |
| localizador «p. 7» com `document.page: 8` | «"document.page" é 8 e o localizador diz "p. 7". O localizador e o campo apontam para a mesma página.» |
| `document.page` numa linha derivada | «"document.page" numa linha derivada. Não há documento onde essa página exista: a proveniência está nas linhas de origem.» |
| `document.page` numa linha da casa | «"document.page" numa linha da casa. Não há documento onde essa página exista: a proveniência está no próprio livro-razão.» |
| uma verificação com data futura | «verificação #3: "date" é 2027-01-05 e a construção corre a 2026-08-18. Uma reconferência no futuro não aconteceu.» |
| uma verificação anterior ao `access_date` | «verificação #1: "date" é 2026-08-01 e a linha foi lida a 2026-08-12. Uma releitura é depois da leitura.» |
| `diverge` sem `found` | «verificação #2: "result" é "diverge" e falta "found", o valor como a fonte o imprimiu nesse dia. Uma divergência sem o valor que se encontrou não se pode conferir.» |
| `found` numa entrada `igual` | «verificação #1: campo desconhecido "found". Aceites: date, path, result, by, "found" só existe numa entrada "diverge", onde é o valor como a fonte o imprimiu.» |
| `by` desconhecido | «verificação #3: "by" é "revisao-cruzado". Só pode ser "leitura-independente", "painel-semanal", "revisao-cruzada".» |
| `result` desconhecido | «verificação #3: "result" é "inacessível". Só pode ser "igual", "diverge", "inacessivel".» |
| uma entrada repetida | «verificação #4: repete a entrada de 2026-08-17 sobre "https://exemplo.invalido/c" (revisao-cruzada, inacessivel). A mesma releitura não se escreve duas vezes.» |
| um `path` sem esquema | «verificação #3: "path" é "exemplo.invalido/c". Tem de ser o endereço que foi lido nesse dia, a começar por "http://" ou "https://".» |
| a lista fora de ordem cronológica | «verificação #2: "date" é 2026-08-13 e a entrada anterior é de 2026-08-16. A lista está por ordem cronológica crescente, e a página mostra as duas últimas.» |
| uma verificação numa linha derivada | «tem "verifications" e não tem "source_url". Uma linha derivada não tem o que reler: a derivada é reconferida pelo "check" a cada construção, e a da casa conta-se a si própria.» |

No sítio, o `gate:html` sobre a página construída, os seis nas duas edições:

| Estrago | O portão |
| --- | --- |
| a porta a imprimir outra página que não a declarada | «o campo "document.page" de "evora-despesa-paga-2025" não foi transcrito fielmente do livro-razão.» |
| a página a render uma verificação que a linha não tem | «a página de "taxa-de-desemprego-2025" rende a reconferência "7", que a linha não tem. O índice é a posição da entrada na lista do livro-razão.» |
| um rótulo de quem releu errado | «a reconferência 2 de "taxa-de-desemprego-2025" escreve quem releu como "reconferência semanal do painel" e o registo diz "revisao-cruzada", que se escreve "revisão cruzada".» |
| um rótulo de resultado errado | «a reconferência 1 de "taxa-de-desemprego-2025" escreve o resultado como "the same value 6,4" e o registo diz "diverge", que se escreve "a different value: 6,4".» |
| o atributo cru `data-por` a discordar da linha | «a reconferência 2 de "taxa-de-desemprego-2025" leva data-por="painel-semanal" e o livro-razão diz "revisao-cruzada".» |
| a mais velha no lugar da mais nova | «a página de "taxa-de-desemprego-2025" rende as reconferências [1, 0] e o livro-razão manda render [2, 1], da mais recente para a mais antiga.» |
| uma das duas mais recentes escondida | «a página de "taxa-de-desemprego-2025" rende as reconferências [2] e o livro-razão manda render [2, 1], da mais recente para a mais antiga.» |

No motor, o `export_site_rows_test.py`, que corre no portão de commit:

| Estrago | O exportador |
| --- | --- |
| uma página declarada que ninguém leu | «document.page 444 appears nowhere in the engine row. A page number is read, never remembered.» |
| um localizador que contradiz a página declarada | «document.page is 119 and the locator says "p. 2025". They point at the same page.» |
| um localizador com página e nenhuma declarada | «the locator says "p. 119" and the manifest declares no document.page: declare-o. A page is not read in two ways, the field is the source, and the address fragment comes from it.» |
| uma referência do mapa que não existe | «the map names table reference '9.99', which the record '2026-08-15-releitura-cega-evora' does not have» |
| um índice do mapa que não existe | «the map names value 4 of reference '1', and the record prints 1 value(s) there» |
| um registo que o mapa inventa | «the map names the record '2026-01-01-nao-existe', and … does not exist» |
| uma linha que o manifesto não exporta | «the verification map names 'linha-que-nao-atravessa', which this manifest does not export» |
| duas entradas da mesma linha do mesmo registo | «the map gives it two entries from the record '2026-08-15-releitura-cega-evora'. One re-reading of one row is one entry.» |
| um organismo que não é o `source` da linha | «the row says source 'INE' and the record read 'DGAL'. Two different bodies are not a re-reading of the same measurement.» |
| um período sem o ano da linha | «the row is about '2025' and the record read the period '2023', which does not carry that year.» |
| uma linha do registo com `url_completo` nulo | «the record's row '1' has no resolved `url_completo`, so there is no address to publish as the one that was read.» |
| um registo que falha o seu próprio `conferir` | «the record does not pass its own conferir.py, so nothing is published from it.» |
| uma reconferência que o sítio publica e a corrida não produz | «the site publishes a re-check of '2026-08-16' that this run does not produce. A re-export rewrites this block, so it would be erased. Map it, or find out who wrote it.» |

E a via positiva, que é a que importa não fechar: um valor mudado numa cópia do
registo faz o exportador escrever `result: diverge` com `found`, imprimir
«DIVERGE evora-populacao-2025 publica '58 567' · a releitura de 2026-08-15 leu
'93.86'» e **continuar**.

No motor, o `indicators/refresh.py --prove-gates`, duas conferências novas, as
duas com o seu conhecido-positivo verificado nos dois sentidos: a mesma
reconferência não se escreve duas vezes e o resto da linha fica byte a byte onde
estava; e o `ledger:check` do sítio recusa uma entrada mal formada, provado
plantando uma numa cópia do livro-razão e correndo o portão do sítio sobre a
cópia («falta "found"»).

##### Duas correções de rumo que este estádio fez pelo caminho

**O `exported_at` do registo da travessia tinha uma data fixa.** Estava preso a
2026-08-15, o dia em que o registo nasceu, e qualquer corrida posterior que
mexesse numa linha carimbava um dia em que nada aconteceu, a menos que alguém se
lembrasse do `--exported-at`. É a mesma família de defeito que a §1.45 corrigiu
no selo do registo prévio: uma data debaixo do rótulo de outra. Passa a ser o dia
da corrida, e a opção fica para repetir uma corrida passada de propósito.

**O `check-cruzamento.mjs` aprendeu `verifications_at_export`.** O registo da
travessia passa a contar as reconferências de cada linha, e a conferência de
aceitação compara essa contagem com o ficheiro em disco, como já fazia às
correções. Uma reconferência de uma linha cruzada entra pelo exportador do motor
e por mais lado nenhum.

##### O que o T1 encontrou e não podia corrigir

**A regra 6 do Método passou a dizer uma coisa falsa, e é texto governado.** O
seu limite escreve «A releitura acontece e ainda não fica escrita na linha: o
campo que a guardaria não existe no formato. Enquanto não existir, a conta abaixo
é zero, e é zero por isso.» O campo existe desde hoje, e a prova ao lado dessa
frase diz **53**. A página do Método publica as duas coisas a seguir uma à outra.
Não se toca aqui porque um texto governado é decisão da direção e tem o seu
caminho (§1.38, §1.45): fica para o T4, com a leitura do Método pela direção na
pré-visualização, e é o primeiro item dessa leitura. A prova dessa regra pode
também passar a levar `linhas_reconferidas` e `releituras_divergentes`, que
existem desde hoje.

##### O que fica para os estádios seguintes

O T2 leva o `document.crop`. O T3 leva a origem «calculado sobre um ficheiro
alojado», as linhas de API com a página humana da série, e o extrator de largura
fixa do motor. O T4 leva o livro-razão descarregável, o `lastmod`, as duas
extensões de dentro do portão, e os registos: esta entrada fechada, a §4 item a
item, o `PLANO-fases.md`, o `NEXT.md` do motor. Nenhum destes foi tocado aqui.

#### T2 · `document.crop`

*Por escrever: o estádio T2 acrescenta aqui a sua secção.*

#### T3 · a origem «calculado sobre um ficheiro alojado», as linhas de API, o extrator

*Por escrever: o estádio T3 acrescenta aqui a sua secção.*

#### T4 · o conjunto de dados, o `lastmod`, o portão e os registos

*Por escrever: o estádio T4 acrescenta aqui a sua secção, e fecha esta entrada.*

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

O `gate:html` deixou de ser só sobre algarismos a 15.08.2026: passou a conferir
também **duas promessas de identidade que estavam escritas e não impostas** —
que cada página construída tem exactamente uma porta de correcções, e que cada
valor tem, ao pé de si, o selo que abre a **sua própria** linha. Não são portões
novos: são duas conferências dentro do varrimento que já existia, cada uma
motivada por conteúdo real que quebrou a regra (§1.36, itens 1 e 2).

A 16.08.2026 ganhou mais quatro, pelo mesmo caminho e pela mesma moratória: a
grafia e os travessões (§1.38); o texto do Sobre conferido carácter a carácter
contra `src/data/sobre.mjs`; a porta para o Sobre em todas as páginas
construídas, que substituiu a exigência da linha de autoria no rodapé; e a
sétima origem, `data-prova`, com a sua recontagem (§1.39). O mesmo varrimento
passou também a conferir que uma ligação interna abre alguma coisa, e a
escrever `dist/prova.json` no fim.

`source_url.page` é a única entrada da tabela dos campos que não é um campo do
ficheiro da linha: é uma leitura do `source_url` — o `#page=N` — feita pelo
portão com a **sua própria cópia** da regra, para que ele confira a linha e não
o gabarito. A razão é a mesma do separador de `attributed_to` (§1.31).

### 2.2 As oito origens legítimas de um algarismo numa página

1. `data-claim="<id>"` — veio do livro-razão. O portão confere que os algarismos
   renderizados são os do valor publicado. `<Claim/>` põe esta marca sozinho.
2. `data-verbatim="<chave>"` — citação transcrita. O portão exige que o texto
   renderizado seja **igual, carácter a carácter** (espaços normalizados), ao
   registado em `src/data/verbatim.mjs`. Não é um passe livre: é uma verificação
   de transcrição.
3. `data-nonledger="<motivo>"` — contexto estrutural. O motivo tem de constar de
   `ledger/allowlist.yml`, onde cada um se justifica por escrito. **Um dos
   motivos deixou de ser confiança e passou a ser comparação** (16.08.2026,
   §1.41): a etiqueta do selo, `proveniencia`, é gerada do registo dos trabalhos
   e o portão compara-a com o conjunto finito de rendições que esse registo
   permite. Prosa arbitrária embrulhada nessa marca escapava ao varrimento de
   algarismos e ao da ortografia; agora fecha a construção.
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
   `document.title`, `document.edition`, `document.locator`, `source_url`,
   `source_url.page`, `access_date`, `reference_date`, `excerpt`, `source_flag`,
   `source_flag_note`, `derivation`, `derived_from`, `attributed_to`, `check` e
   `id` — e para mais nada: um campo desconhecido falha o build, e `value` está
   fora de propósito, porque um valor entra por `<Claim/>` e por mais nenhum
   sítio. `derivation` resolve-se na língua da edição, como o motivo de uma
   correção, e `attributed_to` — que é uma lista — resolve-se numa cadeia só,
   com os elementos pela ordem do livro-razão separados por ` · `; o portão tem
   a sua própria cópia desse separador, para conferir o livro-razão e não o
   gabarito (§1.31). **A marca só vale nas páginas do livro-razão** — no índice, ou na
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

7. `data-prova="<chave>"` é um número **do sítio sobre si próprio**: linhas
   publicadas, linhas com um campo por confirmar, correções, concelhos com
   página, a data da última reconferência do painel. Não é uma medição de
   Portugal, não tem linha no livro-razão e não leva selo (`IDENTIDADE.md`
   §10); leva a porta, que é a página onde o leitor vê o que ele conta.

   **Não é uma dispensa, e é a origem em que isso era mais fácil de falsear.**
   Os valores vêm de `src/lib/prova.mjs`, que os calcula na construção a partir
   dos dados do próprio sítio. Se o portão chamasse essa função e comparasse o
   resultado consigo próprio, confirmava a função e não o sítio: é o erro que
   `campo="study"` cometia até §1.24. Por isso o portão **reconta cada chave por
   conta própria**, e faz duas comparações: a sua conta contra a da prova, e a
   sua conta contra os algarismos que a página rendeu.

   O ponto de observação do portão é o `dist/` construído. Nove chaves contam-se
   lá (as páginas de linha que existem, quais levam `noindex`, as páginas de
   estudo e de município, o mapa do sítio, o ficheiro dos concelhos); onze são
   uma **segunda leitura** dos mesmos ficheiros do livro-razão, com código
   próprio; e três leem o mesmo módulo dos dois lados, e nessas o que fica
   conferido é que a página rendeu o que o módulo diz, e mais nada. Cada chave
   escreve a sua vista em `dist/prova.json`, para que a fraqueza de uma vista
   `modulo` não passe por força de uma vista `dist`.

   Uma chave desconhecida falha. Um `data-prova` sem algarismos falha. Um
   `data-prova` sem a sua porta falha; dentro de um `<svg>`, a porta é exigida na
   legenda `data-legenda-prova` do instrumento, pela mesma razão que o selo
   (§1.34). Ver §1.39.

   **A comparação é do TEXTO renderizado, não da sequência de algarismos**
   (16.08.2026, §1.41). Enquanto foi de algarismos, «1,32», «-132» e «132 e
   picos» comparavam iguais a `132`: apanhava-se um valor trocado e não uma
   vírgula, um sinal ou uma escala. E a releitura de `dist/prova.json` no fim do
   varrimento deixou de contar chaves: relê chave a chave, com o nome, o valor e
   a vista, contra o que a construção acabou de calcular.

8. `data-agenda="<id>.<campo>"` — um campo dos dois registos que atravessaram
   do motor (`src/data/agenda.json` e `src/data/calendario.json`), na página que
   os renderiza. O portão compara o texto renderizado com esse campo do registo,
   **carácter a carácter** (espaços normalizados). É a origem 6 aplicada um nível
   acima: ali um campo de uma linha do livro-razão na página dessa linha, aqui um
   campo de um registo na página da agenda.

   Um acontecimento do calendário leva o prefixo `evento:` — um item da agenda e
   um acontecimento podem ter o mesmo id, e têm. Um par de edições (`{pt, en}`)
   resolve-se na língua da página, como o `derivation` de uma linha; uma lista
   resolve-se numa cadeia só com ` · `, e o portão tem a sua própria cópia desse
   separador. O `estado` renderiza-se pelo rótulo da edição, e o portão traz a
   **sua** cópia da tabela dos quatro rótulos, para conferir o registo e não o
   gabarito (§1.31).

   **A marca só vale na página da agenda**, pela mesma disciplina da origem 6:
   noutro sítio seria uma segunda porta para pôr texto de um registo em prosa
   corrente. **Não é uma dispensa** — é comparação. E as datas do registo levam
   **também** `data-nonledger="data-da-agenda"`: a comparação prova que a data é
   a do registo, e o motivo declarado diz porque é que uma data do registo pode
   aparecer numa página que só publica valores medidos. O portão lê os dois
   ficheiros com o seu próprio leitor, e no fim do varrimento compara o que a
   página contou com as contagens do registo da travessia, exigindo cada item e
   cada acontecimento pelo nome. Ver §1.40.

   **Três conferências entraram a 16.08.2026 com a revisão cruzada (§1.41),** e
   fecham o que a fidelidade da travessia não podia fechar sozinha:

   - **a prosa não repete uma medição.** Nenhum número dentro de um elemento
     `data-agenda` pode ter a sequência de algarismos de um **valor** do
     livro-razão (mesma normalização da origem 1). Uma medição chega ao leitor
     por `<Claim/>`, com selo; um registo pode atravessar fielmente e trazer,
     em prosa, um valor que tem linha e selo noutro sítio da mesma página.
     Excepção declarada, uma só: `origem_da_data.excerto`, que é a frase da
     fonte citada palavra por palavra;
   - **o item inteiro.** Os campos obrigatórios de cada item derivam-se do
     próprio registo, e **cada** entrada do histórico é exigida com a sua data
     e o seu motivo. Renderizar um campo já não dá o item por presente;
   - **a secção é lida do DOM.** A secção de estado onde o item está é lida a
     subir na página (`data-agenda-seccao`), e não calculada do registo: um
     item debaixo do cabeçalho errado com o rótulo certo passava.

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
5. **Só compara a sequência de algarismos, fora duas origens.** `22,8` e `22.8`
   são indistinguíveis para a origem 1, que apanha um valor trocado e não uma
   formatação trocada. A origem 7 (`data-prova`) deixou de ser assim a
   16.08.2026 (§1.41): compara o texto renderizado. A origem 8 (`data-agenda`)
   e a origem 6 (`data-linha-*`) sempre compararam texto.
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
11. **As ligações internas passaram a ser conferidas por inteiro** (16.08.2026,
   §1.41): um `href` sem esquema entra na conferência mesmo quando é relativo,
   resolve-se contra a página onde está, e a sua âncora tem de existir na
   página de destino. Antes só entravam os que começavam por `/`, e uma âncora
   inexistente passava sempre. O que continua fora: uma ligação para fora do
   domínio (é uma promessa sobre outra pessoa) e um `href` construído por
   script.
12. **Atributos continuam fora do varrimento, com uma excepção declarada:** o
   `href` da âncora que embrulha o endereço da fonte. Abriu-se porque aí o
   atributo é a afirmação — uma ligação rotulada com o endereço da fonte e a
   apontar para outro sítio é uma mentira que nenhum varrimento de texto apanha.
13. **Não há origem para «calculado sobre um ficheiro de dados alojado».** Uma
   soma sobre um registo público inteiro — os 166 639 411,36 € do PRR atribuídos
   ao concelho — não tem frase para transcrever nem pais no livro-razão que um
   `check` possa somar. O formato tem hoje três respostas, e as três estão
   erradas para este caso: `excerpt` com uma frase inventada (proibido),
   `derivation` com `source: O Estado do País` (branqueia proveniência de
   outrem: os dados são da Recuperar Portugal, só a soma é nossa), ou
   `[a verificar]`. Fica `[a verificar]` — selo tracejado, `noindex`, e conta
   para a dívida — que é honesto e é incompleto. A resposta certa é o sítio
   alojar o ficheiro de dados e o `check` correr sobre ele, o padrão que
   `check:dados` já tem para os gráficos (§1.18) e que o livro-razão ainda não
   tem. Três linhas esperam por isso.
14. **A dispensa da citação entre «…» não exige fonte registada.** A aspa da
   casa marca citação, e o que se cita não se converte nem se de-travessona. O
   que a conferência garante é que o texto não se converte, não que a citação
   exista. Desde 16.08.2026 (§1.41) a linha de fecho do portão **conta** essas
   ocorrências, para que a dispensa não cresça em silêncio.

15. **A conferência da prosa da agenda passou a ler a unidade colada ao número**
   (16.08.2026, §1.42): «17,6pp» é 17,6 com uma unidade, e é recusado; um
   símbolo que começa por letra continua a ser um código e a passar. O que fica
   de fora por lista fechada é o **ordinal inglês** («2nd», «1st», «3rd»,
   «4th»), pela mesma razão por que «2.º» já ficava: é um ordinal e não uma
   medição. O preço é o mesmo dos dois lados: um valor do livro-razão que por
   acaso seja o número de um ordinal escapa ali.
16. **A releitura do `dist/prova.json` compara o documento inteiro** desde
   16.08.2026 (§1.42), e não só o bloco `prova`: as contagens do portão, o
   commit e o cabeçalho entram na comparação. A única excepção é
   `construido_em`, que é o carimbo lido de `version.json` e não uma conta deste
   varrimento.
17. **A etiqueta do selo só se amarra à sua linha quando é uma porta.** Desde
   16.08.2026 (§1.42) uma etiqueta `data-nonledger="proveniencia"` que seja uma
   âncora para a página de uma linha é comparada com a rendição **daquela**
   linha. Fora de um selo (a legenda de proveniência de um instrumento, que
   nomeia o trabalho e mais nada) não há `href` a que a amarrar, e vale o
   conjunto finito de nomes do arquivo.
18. **O portão confere a frase visível de um rótulo da casa contra a sua própria
   cópia dessa frase**, não contra o gabarito: o estado de uma secção da agenda,
   o estado de um registo prévio, a transição de uma entrada do histórico e a
   razão de um acontecimento não ter data. É a disciplina de
   `ROTULO_DO_ESTADO`, alargada em 16.08.2026 (§1.42). O que ela apanha é o
   rótulo trocado; o que não pode apanhar é a mesma frase mal escrita nos dois
   sítios, e por isso a cópia do portão é curta e está toda num sítio só.

O portão apanha o erro comum, um número que se escreveu a correr num gabarito,
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
- **Quinze documentos reais alojados** (§1.20, §1.21; contagem refrescada a
  16.08.2026, §1.40 — dizia treze, que era o que o build de 15.08 imprimia): o
  `check:documentos` conta 15 edições no manifesto e 15 em disco, e o portão de
  HTML reconstrói cada uma contra a origem e encontra-as iguais carácter a
  carácter. A única diferença entre origem e construído é a faixa, entre 1529 e
  1593 bytes conforme a língua e o slug.
- **Os quinze endereços existem no `dist/`** — nove em `/estudos/<slug>/documento`
  e seis em `/en/studies/<slug>/document`. Os treze de 15.08 devolviam
  `200 text/html` no servidor de pré-visualização, e um endereço inexistente
  devolvia 404; os dois que entraram depois não foram servidos a um servidor de
  pré-visualização nesta corrida.
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

## 4. O registo dos defeitos e dos adiamentos

**Defeito registado 2026-08-16 (00:10), encontrado pela direcção no sítio no ar — RESOLVIDO na mesma noite (§1.37, no ar em `4217232`):** os selos acrescentados a 15.08 aos valores do cabeçalho da primeira página (308 · 11 · 15) rendem no cabeçalho com o rótulo inteiro do estudo («O Estado do País — apuramento próprio») e, no caso da contagem CAOP, com o marcador «[a verificar]» ao lado. Certo pela regra (todo o valor tem selo, para a sua linha), errado naquele sítio: no cabeçalho o selo deve ser só o glifo, com o rótulo apenas para leitores de ecrã. **Primeiro item do bloco V**, junto com a saída de «Edição de …», da introdução justificativa da primeira página e de «Estes indicadores não são escolha nossa…» (voz). Sem alteração ao portão: o selo continua ao pé do valor e a apontar para a linha própria.


Esta secção era uma lista de recados para o director, escrita em 12.08.2026 e já
desactualizada em três pontos. Passa a ser outra coisa, e é uma regra e não um
hábito:

> **Um bloco de trabalho não começa enquanto os defeitos que o bloco anterior
> encontrou não estiverem, ou corrigidos, ou adiados aqui por escrito — com o
> motivo e a fase a que pertencem.** Um defeito medido e não registado volta a
> ser descoberto, e da segunda vez custa a mesma coisa.

O que está aqui é, portanto, tudo o que `BRIEF-confianca.md` (Partes 1–5, medido
a 15.08.2026) encontrou e **não** foi fechado no bloco dos defeitos (§1.36), mais
o que continuava aberto de antes. Cada item diz porque não foi feito agora e a
quem pertence.

### 4.1 O que fica adiado — e para que fase

**As citações da constituição não são conferidas por nada** (18.08.2026, §1.46).
A §5 da `IDENTIDADE.md` citou durante dois blocos uma frase do Método que o bloco
V tinha apagado, e nenhuma conferência deu por isso, porque nenhuma lê a
`IDENTIDADE.md`. A citação está corrigida; o buraco não. Toda a citação da
constituição pode voltar a envelhecer no dia seguinte a um bloco tocar num texto
governado. Não se abre um portão novo para isto neste bloco: a amarra das
decisões já sabe ler ficheiros governados e comparar resumos, e o caminho barato
é estendê-la para conferir que uma frase citada entre aspas na constituição existe
no ficheiro que ela diz citar. Fica para o bloco que voltar ao Método.

~~**Bloco V · a ortografia das linhas cruzadas.**~~ **Fechada a 16.08.2026
(§1.40).** Converteu-se em `publisher/manifest.evora.json` e voltou por
reexportação: de 19 ocorrências para 5, e das visíveis nas páginas de 10 para 0.
`ortografia/restantes.yml` está vazio. As cinco que ficam estão todas no campo
`note`, que não é publicado, e cada uma tem motivo escrito para não se mover.
Ficou uma dívida do motor: a V10 do exportador de linhas não tem caminho para «a
mesma correção, com outra redação», e a regeneração da linha só foi segura porque
nenhuma correção nasceu do lado do sítio.

**Fase 3 · o redesenho da página de linha e a travessia dos recibos.** É a fase
onde a página da linha passa a ser a prova, e não uma ficha sobre a prova.

| Item | O que está por fazer | Porque não foi feito aqui |
| --- | --- | --- |
| `verifications[]` | Nenhuma das 132 linhas regista uma reconferência independente. O único campo de tempo é `access_date` («Lido a»). A refetch cega de 15.08.2026 sobre 24 linhas de Évora aconteceu e **não está escrita em lado nenhum**. | É um campo novo no formato do livro-razão, com regras próprias (quem, por que caminho, com que resultado) e o portão a aprender a compará-lo. É desenho, não defeito. |
| A travessia dos recibos | O motor tem **168 recortes** da linha impressa, com `#page=N`, e o sítio serve **216** dentro de `/estudos/*/documento` — em nenhum mapa do sítio e em nenhum menu. A página de linha não os vê. | Precisa de `document.page` e `document.crop` (com o resumo do próprio recorte, que hoje não existe), de os recursos atravessarem por `publisher/` e de o portão aprender a conferir uma imagem. Três extensões de formato. |
| A origem «calculado sobre um ficheiro alojado» | 7 linhas de soma sobre um registo (3 do PRR, 4 da CAOP) publicam `excerpt: "[a verificar]"` porque não há frase para transcrever. É o limite 12 do §2.3, e continua aberto. | Fecha-se alojando o ficheiro de dados e correndo o `check` sobre ele — o padrão que `check:dados` já tem para os gráficos. É construção, não correcção. |
| Cópias fixadas das fontes | A classe de defeito «o endereço morreu» disparou duas vezes num dia (§1.36, item 4). A resposta que a fecha é alojar a cópia fixada com o seu resumo, e a linha ligar as duas. | **Depende de uma verificação de licença por fonte, que ninguém fez.** dados.gov.pt e a CAOP declaram licenças abertas; o município, a DGAL, o IEFP e o INE têm de ser lidos um a um. Alojar primeiro e verificar depois seria a ordem errada. |
| `document.kind` | Hoje a página da linha decide pelo padrão do endereço se uma fonte é uma série de dados ou um documento (§1.36, item 7). Funciona para as 57 linhas de hoje e é uma heurística. | O campo pertence ao redesenho, onde há mais do que duas classes a distinguir (PDF, página, série, registo, ficheiro alojado). |
| `lastmod` no mapa do sítio | O campo não existe. Pô-lo a partir das datas que o sítio tem seria pôr uma data errada: nenhuma delas é «quando esta página mudou». | Precisa de um modelo de alteração por página — o git sobre o **conjunto completo** de entradas de cada página, componentes partilhados incluídos. É construção, e pertence ao redesenho. |
| O extractor de citações do motor corta a meio | 15 excertos cruzados estavam cortados a meio de palavra ou de número; 12 puderam ser aparados no último ponto final, 3 **não** (`evora-execucao-da-receita-2025`, `evora-orcamento-2025`, `evora-pael-emprestimo`), porque o valor da linha aparece depois desse ponto. | O corte é do lado do motor, a uma largura fixa. Alargá-lo muda excertos de estudos já publicados e conferidos byte a byte; é trabalho do motor, não do sítio. |
| O PRR: o instantâneo lido já não é servido | As cinco linhas do PRR foram somadas sobre o ficheiro de 2026-08-03, que devolve 404. O publicador substitui o ficheiro todos os dias e não arquiva o anterior. **Se os valores de Évora mudaram entre esse instantâneo e o de hoje é coisa que não se pode saber.** | Refazer a soma sobre o ficheiro de hoje é uma leitura nova, com data nova, e muda cinco valores publicados. É trabalho de aquisição no motor, com o seu registo de actualização — não um remendo de endereço. |
| A linha do INE que não se conseguiu medir | O `json_indicador` do INE serviu o primeiro pedido e depois devolveu 429 e esgotou o tempo em três tentativas. Não se consegue separar o INE a limitar a nossa sondagem de um bloqueio a quem lê. | Fica **por medir**, e não como defeito. Mede-se com um pedido isolado, noutro dia. |

**Fase 1 e 2 · a voz e o desenho.** Nada disto é defeito; é matéria por decidir,
e por isso não foi tocada neste bloco.

| Item | Estado |
| --- | --- |
| As frases de moldura que ficam | A política de correções e a nota de não-ordenação de partidos saíram das páginas de linha a 16.08.2026 e passaram a rótulo e porta (§1.40): as **palavras** de moldura caem de 31 852 para **24 858**; as frases distintas ficam em **75** e as ocorrências em **2 353**. O alvo do `BRIEF` §6.3 é **≤ 12 frases distintas**, e continua longe: o que resta são rótulos e cabeçalhos de secção, que esta régua conta como moldura e um leitor não lê como tal. Fechar a diferença é decidir se a régua mede a coisa certa, e é trabalho da fase da voz. |
| O aparelho da página de Évora | As quatro ressalvas repetidas saíram a 16.08.2026 (§1.40): cada uma ficou onde é dita com a sua prova, e o aparelho ganhou a porta para lá. De 316 para 262 palavras em português, de 305 para 250 em inglês, e de dez para seis itens em «o que esta página não sabe». O que resta é a prosa que só existe ali. |
| ~~`/sobre` e `/correcoes`~~ | **Construídos a 16.08.2026 (§1.39).** `ABOUT.md` passou a ser a ideia e os apontadores; a política das correções tem casa única. |
| ~~`EDITION` no rodapé~~ | **Retirada a 16.08.2026 (§1.39),** com a própria constante. O cabeçalho passa a mostrar a data da última reconferência do painel, em todas as páginas. |
| ~~`/agenda` e o calendário das fontes~~ | **Construídos a 16.08.2026 (§1.40).** Cinco itens em quatro estados, dezasseis acontecimentos das fontes, oito deles sem data porque a fonte não publica nenhuma. `core/prereg.py` deixou de ter zero registos: o estudo da habitação é o primeiro, **iniciado e não selado**. Ficam abertos o histórico do calendário, a ligação automática entre um acontecimento e a linha que ele move, e os prazos da agenda. |
| A ordenação por partido | Continua a não existir, e é para continuar. Não é dívida: é uma recusa. |

**Fase 2 · o que a construção da direção S mediu e não fechou** (18.08.2026,
§1.43). Dois, os dois medidos com a régua do contraste e nenhum deles corrigido
neste bloco.

| Item | O que foi medido | Porque não foi fechado aqui |
| --- | --- | --- |
| `--rule-strong` sobre papel, nas fronteiras de caixa | 1,83:1 em claro e 1,78:1 em escuro, contra os 3:1 que a 1.4.11 pede a um objeto de interface. São **19 fronteiras** na folha. Três saíram deste par neste bloco, porque nenhuma delas era arrumação: o separador da prova de cada regra, o fio debaixo de cada `data-prova` e a aresta dos segmentos da banda dos mandatos, os três agora em `--muted`. | Uma fronteira de caixa é arrumação e não estado: quem não a vir não perde informação nenhuma, e é por isso que a régua a conta também como decoração, sem limiar. Subi-la a 3:1 mudaria o peso de fio de 19 sítios de uma vez, que é uma decisão de desenho e não uma correção. Fica para o juízo da direção na pré-visualização. |
| A caixa de estado de `/estudos/<slug>` (`.placeholder`) | Um tracejado com fundo às riscas e uma etiqueta de estado («Rascunho · sem conteúdo», «Documento alojado · página por escrever»). A palavra `placeholder` **não** entrou na lista de estados de espécime que o portão recusa (§6), e foi decisão e não esquecimento. | O que a §6 proíbe é desenhar uma **ausência de dados** como espécime. Isto não é isso: é o estado editorial de uma página do arquivo, dito por palavras, sem prometer prova nenhuma e sem número por trás. Mas o vocabulário visual é o do espécime, e a v2 acabou de o proibir noutro sítio. Fica escrito para a direção decidir se a caixa muda de forma ou se o nome muda. |

**Fase 4 · o que a revisão cruzada da v2 encontrou e não se fecha sem uma
conferência nova** (18.08.2026, §1.44). Seis, três de cada leitura, e os seis
são trabalho do `gate:identidade` e do portão da prosa, que ainda não existem
como script.

| Item | O que está por fazer | Porque não foi feito aqui |
| --- | --- | --- |
| As afirmações da prosa da primeira página que a página não sustenta | Sete afirmações em seis das oito células, nas duas edições, com as palavras exactas na tabela da §1.44: «e a descer», «o excesso quase duplicou no ano seguinte», «Está acima da média da União», «É das medidas em que Portugal mais se destaca no painel social», «Era mais de um terço no início do século», «Está abaixo da média europeia» e a advertência atribuída à Comissão sem porta. Mais uma de outra natureza, a mudança de definição do custo unitário do trabalho, que é uma afirmação sobre a metodologia da fonte. Nenhuma é falsa, e por isso nenhuma foi corrigida aqui; todas afirmam uma tendência, uma comparação ou uma atribuição que nenhuma linha **daquela página** prova. | Uma delas foi corrigida neste bloco, e foi a única que estava **errada** (a definição da posição de investimento, com o sinal ao contrário). Estas estão por provar, que é outra coisa: a saída é o portão da prosa, que aprende a exigir de uma frase da casa o mesmo que já exige de um algarismo, e isso é a fase 4. Apagá-las à mão agora deixaria a regra por escrever e a próxima frase a entrar pela mesma porta. |
| O nome acessível de vários selos dentro da mesma legenda | Na legenda do instrumento n.º 1 há **catorze** selos e **três** nomes acessíveis distintos: seis «Linha do livro-razão: calculado · Avaliação Económica Regional de Portugal 2026 fonte», seis o mesmo sem «calculado», e dois de «Alentejo & Algarve». Quem ouve a lista de ligações ouve catorze portas com três nomes. | Distingui-los obriga o texto oculto de cada selo a levar a linha que ele abre, e obriga a conferência (4) da conferência da `proveniencia` em `scripts/gate-html.mjs`, a que compara o texto inteiro do selo com `seloDaLinha(id, lang).inteiro`, a aprender a forma nova. É desenho de conferência e não uma afinação de gabarito. |
| O estado «lido» das fichas da régua não tem equivalente para quem não vê | `aria-pressed` segue a região estar **na régua** e `is-read` segue a região **que está a ser lida**. O segundo é só visual: o parágrafo da leitura breve só é região viva na região com que a página foi construída, e as outras trocam de `hidden` sem anunciar nada. | É comportamento de um instrumento com JavaScript, e a saída certa não é óbvia: ou a leitura breve passa a região viva única, ou o estado entra no nome da própria ficha. As duas mudam o que um leitor de ecrã ouve a cada toque, e isso é decisão de desenho. Encontrado ao conferir a observação da revisão sobre `aria-pressed`, que já estava feita (§1.44, G). |
| As contagens em palavras da página do município | «Oito medidas. Seis vêm de organismos que publicam para todos os concelhos do país; duas só existem porque o próprio município as publica, e cada uma dessas di-lo na sua linha.» Em inglês, «Eight measures. Six come from bodies that publish for every concelho in the country; two exist only because the municipality itself publishes them, and each of those says so on its own line.» As três contagens não vêm de contar nada: são estado escrito, e se uma medida entrar ou sair na página a frase fica errada sem que nada feche. | A régua dos algarismos não vê palavras, e é isso que faz esta classe escapar inteira. Fechá-la é uma de duas coisas, e as duas são desenho: ou a frase passa a derivar das medidas que a página rende, e então precisa de porta como qualquer contagem do próprio sítio (§10), ou o portão da prosa aprende a exigir prova de uma contagem escrita por extenso. Encontrada na segunda leitura cruzada da v2 (§1.44). |
| As citações de fonte em inglês sem língua declarada | Numa página `pt-PT`, o excerto de `divida-publica-2025` rende «General government gross debt (EDP concept), consolidated - annual data …» sem `lang="en"`, e o mesmo vale para o `source` e o `document.title` de qualquer fonte estrangeira. Quem ouve a página ouve inglês lido à portuguesa. | O registo **não tem campo de língua por campo**: nenhuma das 132 linhas diz em que língua está o seu excerto. Pôr o atributo a olho seria adivinhar, e adivinhar bem nas 132 de hoje não impede a 133.ª de entrar sem ele. É trabalho do motor primeiro, e só depois do sítio e do portão. Encontrada na segunda leitura cruzada da v2 (§1.44). |
| O portão compara os algarismos do valor, e não a cadeia | A conferência de um `data-claim` é `digitsOf(renderizado) !== digitsOf(claim.value)`, e `digitsOf` deita fora tudo o que não é algarismo: o sinal menos (U+2212), a vírgula decimal, o espaço fino dos milhares (U+202F) e um símbolo de unidade metido dentro do elemento. Medido com dois estragos plantados de propósito: «96%» onde o livro-razão diz «96» passa e o build fica **verde**; e o valor da posição de investimento internacional sem o sinal menos rende «50,2» na primeira página **sem um único erro nessa página**. O que fechou o segundo foi outra amarra, a do `<head>` da página de linha, que compara a cadeia inteira, e essa só cobre a página de linha. | Passar a comparar cadeias obriga a fixar o que é o valor renderizado e o que é composição, e há casos com resposta por decidir: o valor desenhado dentro de um `<svg>`, o valor com escala (`--figura-car`) e o espaço que a moldura põe à volta de um elemento. É desenho de conferência, e vai com o `gate:identidade`. Até lá, a amarra que existe é o `<head>` da página de linha, e ela não vê as outras páginas. Encontrada na segunda leitura cruzada da v2 (§1.44). |

**Fase 1 · a redacção do Método sobre os números do próprio sítio** (18.08.2026,
§1.44). O Método escreve «Um número chega ao leitor só se tem linha, e a linha
diz de onde veio.» e «Ao lado de cada número há um selo que abre a sua linha», e
a §10 da constituição diz que uma contagem do próprio sítio leva porta e não
selo. Hoje as duas convivem porque as contagens que aparecem com selo são linhas
da casa a sério, com derivação escrita. Mas a frase, lida à letra, promete mais
do que a regra dá. **É texto governado**, e por isso não se afina aqui: vai para
a leitura do Método pela direção na pré-visualização, junto com o que a §4.2,
item 1, já lhe deixou.

### 4.2 O que continua aberto de antes, e não mudou neste bloco

1. ~~**Fechar o Método.**~~ **Fechado a 16.08.2026 (§1.39).** Três dos quatro
   marcadores saíram por estarem resolvidos (nome, endereço, financiamento); o
   quarto, a contagem das autárquicas, saiu com a frase inteira e **o facto
   continua por verificar**, à espera de uma leitura da fonte. Falta a leitura
   da direção sobre as dez regras e sobre o inglês, na pré-visualização.
2. **Datas e descrições do arquivo.** Só «Os Pelouros» tem data de publicação
   confirmada. Nas outras entradas a data é `[a verificar]` — e é essa falta que
   deixa **6 dos 264 endereços do mapa do sítio sem `lastmod`** (§1.36, item 10):
   a consequência da dívida passou a estar à vista, em vez de ser tapada com um
   carimbo. `updated` está por confirmar em todas.
3. **A dívida de proveniência: 12 linhas.** Água não faturada, os dois avisos do
   PT2030, o ciclo de substituição de condutas, o saldo natural, o excerto das
   quatro contagens da CAOP e das três somas do PRR. Nenhuma foi preenchida
   neste bloco, e nenhuma foi criada.
4. **29 afirmações não são citadas por nenhuma página de conteúdo.** São a linha
   de base institucional que a primeira página não desenha toda.
5. **Localização dos números por edição** (§1.6) e as duas decisões em fila:
   tradução da linha de autoria (§1.5) e botão de tema (§1.9).
6. **O 301 de `oestadodopais.pt`** para o domínio acentuado.
7. **O registo de correcções publica valores sem selo** (16.08.2026, apontado
   pela revisão cruzada e **não triado** para este bloco). O valor antigo e o
   valor novo de cada entrada são conferidos campo a campo contra o livro-razão
   pela origem 5, e não levam selo nem porta para a linha. É uma origem
   declarada a fazer o trabalho de outra; se a interface pública de
   proveniência é o selo, ou o registo passa a levá-lo, ou a regra diz que ali
   a porta é outra. Fica escrito para que a próxima leitura não o redescubra.
8. ~~**As revisões de proveniência não têm contagem com porta.**~~ **Fechado a
   16.08.2026 (§1.42).** A secção rende agora «9 revisões de proveniência» com a
   chave `revisoes_de_proveniencia` marcada `data-prova` e a porta da secção do
   registo, e cada identificador da lista, como os das correcções e das
   actualizações, leva à página da sua linha.
9. **A amarra das decisões governa dois ficheiros.** `sobre.mjs` e `metodo.mjs`.
   As cadeias de `src/i18n/strings.mjs`, os títulos e as descrições de página
   não têm decisão registada que os governe, e mudam sem que nada o note. Os
   dois registos da agenda ganharam a sua própria amarra a 16.08.2026, e é
   outra: criptográfica e append-only (§1.41 e §1.42, H4 e H5), com a linha de
   base do registo da travessia a ser ela própria obrigatória desde a §1.42.
10. **A mudança deliberada por quem tem direito de escrita não é fechável por
   máquina** (16.08.2026, §1.42). Apagar a linha de base da travessia, reescrever
   uma entrada de decisão junto com o texto que ela governa: as conferências
   proíbem a versão silenciosa das duas, e a versão deliberada fica visível no
   git e no varrimento mensal, que corre de fora desta construção. É governação,
   não maquinaria, e está escrito na §1.42 em vez de ficar por dizer.

### 4.3 O que este bloco deixou construído e ainda não foi exercido

- **A régua** (`scripts/medir-defeitos.mjs`). Não é um portão. Corre à mão, e é
  ela que torna comparável o «antes» e o «depois» do próximo bloco.
- **A página do marcador** (`/a-verificar`). Está ligada de duas páginas; nenhuma
  outra superfície do sítio lhe aponta ainda.
- **O estado vazio de `/municipios`** — «sem página ainda», 307 vezes. É o
  primeiro uso a sério do estado vazio desenhado em §1.34, e é para ser
  substituído concelho a concelho.
- **`dist/prova.json`** (16.08.2026, §1.39). Está escrito, ligado do Método e
  relido pelo próprio portão, e ainda ninguém o consumiu de fora. É a superfície
  por onde uma auditoria externa pode comparar duas construções sem ler páginas.
- ~~**As cinco chaves `agenda_*` da prova**~~ — **exercidas a 16.08.2026
  (§1.40)**, e o caminho tinha um degrau: duas delas contavam os estados com
  hífen e o registo escreve-os com traço baixo, por isso davam zero. É a
  primeira vez que uma coisa construída e nunca exercida foi exercida, e
  encontrou-se o defeito que só um ficheiro a sério podia encontrar.
- **A lista `saidas` do calendário das fontes** (16.08.2026, §1.41, H5). Está
  construída, provada contra um estrago plantado e contra uma saída declarada,
  e **está vazia**: nenhum acontecimento saiu ainda. O primeiro que sair é o
  primeiro uso a sério.
- **A conferência de ligações relativas** (§1.41). Corre sobre 9142 ligações e
  encontra **zero** relativas, porque o sítio as escreve todas absolutas. O que
  ela impede é a primeira que não for.
- **O campo `documentos` de um critério da agenda** (§1.41, A11). Dois critérios
  o usam hoje, os dois a apontar para a edição portuguesa de dois estudos de
  Évora. A edição inglesa do estudo dos mandatos **não está alojada** neste
  sítio, e por isso a citação inglesa daquela nota não tem porta: a porta que
  existe abre a edição portuguesa do mesmo trabalho.
