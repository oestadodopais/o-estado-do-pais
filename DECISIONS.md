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
`noindex={true}` em `EstudoStubView.astro`. São duas linhas.

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

**Uma afirmação do texto que o sítio ainda não cumpre.** A secção «O livro-razão»
diz: «Os dados por trás de cada gráfico são descarregáveis.» Hoje não são — não
há um único ficheiro para descarregar em lado nenhum. Não toquei na frase, porque
é cópia final; fica aqui assinalado que ou se constrói a descarga, ou a frase
tem de mudar antes de publicar. **É a única promessa do Método que o código
ainda não sustenta.**

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

---

## 2. Como funciona o portão, e o que ele não vê

### 2.1 Os três portões

| Portão | Quando | O que apanha |
| --- | --- | --- |
| `ledger:check` | antes do build | campos em falta, ids partidos, estudos desconhecidos, aritmética que não bate certo |
| `astro build` | durante | `<Claim id="…">` com um id que não existe — `getClaim()` atira e o build pára |
| `gate:html` | depois do build | algarismos, no HTML construído, sem proveniência declarada |

### 2.2 As cinco origens legítimas de um algarismo numa página

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

---

## 4. O que fica para o director

1. **Fechar o Método.** O texto português está publicado. Falta: resolver os
   quatro marcadores (forma pública do nome, endereço de contacto, modelo de
   financiamento, número exato das autárquicas); rever a tradução inglesa; e
   decidir sobre a frase «os dados por trás de cada gráfico são descarregáveis»,
   que o sítio ainda não cumpre (§1.13).
2. **Migrar os estudos.** Dez trabalhos, vinte páginas de destino (uma por
   língua), cada uma a dizer por palavras que o estudo ainda não foi mudado
   para ali.
3. **Fechar a proveniência.** Vinte afirmações têm campos `[a verificar]`:
   sobretudo o organismo, o documento, o URL e o excerto das séries do PIB per
   capita, e a base de cálculo do ciclo de substituição de condutas.
4. **Datas e descrições do arquivo.** Só «Os Pelouros» tem data de publicação
   confirmada (2026-08-12) e descrição escrita pela direção. Nas outras doze
   entradas a data continua `[a verificar]` e a descrição é reformulação do
   título (§1.7).
5. **Ligar o deploy** e o 301 de `oestadodopais.pt` para o domínio acentuado.
6. **Em fila, já aceite:** localização de exibição dos números por edição
   (§1.6) — cadeia exacta preservada no livro-razão, renderização localizada.
7. **Decidir** sobre: tradução da linha de autoria (§1.5) · botão de tema (§1.9).
