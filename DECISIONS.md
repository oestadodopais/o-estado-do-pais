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

A §1.38 recebeu `Afecta: nenhum` — é uma decisão sobre como se escreve, não sobre
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
sítio **de propósito** — uma regra conferida só pela construção que ela governa é
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
`data-verbatim` — e, porque a régua mudou, foi **corrida nas duas construções**,
a de B e a de agora, sobre uma reconstrução da árvore de B.

| Medida | Antes (B, 305 páginas) | Depois (307 páginas) |
| --- | ---: | ---: |
| Frases de moldura distintas | 80 | **80** |
| Ocorrências | 2 345 | **2 349** |
| …sem a porta das correções | 2 040 | **2 042** |
| Páginas com porta de correções | 305 de 305 | **307 de 307** |
| Palavras de moldura | 31 852 | **25 159** |
| Valores da primeira página sem selo | 0 | **0** |

**As distintas não mexem, e a razão importa:** cada frase cortada foi
substituída por uma linha, e uma linha com trinta ou mais carácteres continua a
ser uma frase de moldura para esta régua. O que mudou foram as **palavras**:
menos 6 693, vinte e um por cento. As quatro ocorrências a mais são a agenda:
duas páginas novas, cada uma com a linha do cabeçalho e a porta das correções.

**Esta é a linha de base** que o `gate:identidade` vai segurar quando for
construído (fase 4): 80 frases distintas, 2 349 ocorrências, 25 159 palavras de
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
entradas novas do manifesto são acrescentadas — por desenho, para não reescrever
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
«atualizado». É um afinamento de apontador — mesmo sítio, outra grafia — e por
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
| (a) | perceber o que o sítio é | **passa** — a linha do cabeçalho está em todas as páginas, e `/sobre` diz em duas frases o que é e que é escrito por inteligência artificial |
| (b) | encontrar o seu concelho e ver medidas com fontes | **parcial** — os 308 estão no índice e no mapa; 307 dizem «sem página ainda». Quem é de Évora vê oito medidas, cada uma com o selo para a sua linha |
| (c) | abrir um estudo e ler a versão curta | **parcial** — 5 dos 11 trabalhos têm leitura escrita, com relance e leitura breve; os outros seis são página de arquivo com o documento |
| (d) | ver quando cada coisa foi conferida e como corrigir | **passa** — o sinal de tempo em todas as páginas, agora com nome e porta; «Lido a» em cada linha; a porta das correções em 307 de 307 páginas e a política em `/correcoes` |

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

- **identificadores internos com grafia anterior** — `taxa-de-actividade-2025`,
  `taxa-de-cambio-efectiva-real-2025`, `data-de-actualizacao` já renomeado. Um id
  é um endereço: mudá-lo parte ligações e obriga a reencaminhamento (§1.29);
- **a «excepção» do próprio `IDENTIDADE.md` §6**, que é documento do repositório
  e fica na grafia em que foi escrito;
- **uma `note` em duas línguas ao mesmo tempo** numa linha do PRR;
- **os quatro travessões em `excluded[].reason`** do manifesto do motor, que é o
  registo sobre o que **não** atravessa e não rende em página nenhuma;
- **as chaves de cadeia mortas** que o agente do Sobre listou, por arrumar.

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
12. **Não há origem para «calculado sobre um ficheiro de dados alojado».** Uma
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
| As frases de moldura que ficam | A política de correções e a nota de não-ordenação de partidos saíram das páginas de linha a 16.08.2026 e passaram a rótulo e porta (§1.40): as frases distintas ficam em **80**, as ocorrências em **2 349**, e as **palavras** de moldura caem de 31 852 para **25 159**. O alvo do `BRIEF` §6.3 é **≤ 12 frases distintas**, e continua longe: o que resta são rótulos e cabeçalhos de secção, que esta régua conta como moldura e um leitor não lê como tal. Fechar a diferença é decidir se a régua mede a coisa certa, e é trabalho da fase da voz. |
| O aparelho da página de Évora | As quatro ressalvas repetidas saíram a 16.08.2026 (§1.40): cada uma ficou onde é dita com a sua prova, e o aparelho ganhou a porta para lá. De 316 para 262 palavras em português, de 305 para 250 em inglês, e de dez para seis itens em «o que esta página não sabe». O que resta é a prosa que só existe ali. |
| ~~`/sobre` e `/correcoes`~~ | **Construídos a 16.08.2026 (§1.39).** `ABOUT.md` passou a ser a ideia e os apontadores; a política das correções tem casa única. |
| ~~`EDITION` no rodapé~~ | **Retirada a 16.08.2026 (§1.39),** com a própria constante. O cabeçalho passa a mostrar a data da última reconferência do painel, em todas as páginas. |
| ~~`/agenda` e o calendário das fontes~~ | **Construídos a 16.08.2026 (§1.40).** Cinco itens em quatro estados, dezasseis acontecimentos das fontes, oito deles sem data porque a fonte não publica nenhuma. `core/prereg.py` deixou de ter zero registos: o estudo da habitação é o primeiro, **iniciado e não selado**. Ficam abertos o histórico do calendário, a ligação automática entre um acontecimento e a linha que ele move, e os prazos da agenda. |
| A ordenação por partido | Continua a não existir, e é para continuar. Não é dívida: é uma recusa. |

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
