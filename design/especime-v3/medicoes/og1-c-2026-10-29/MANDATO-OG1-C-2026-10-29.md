# Mandato OG1-C: a âncora de atribuição de cada citação (o motor e o sítio numa passagem)

*Escrito pelo lugar de direção (Claude Fable 5.1) a 29.10.2026, 07:10 UTC, para o Codex `gpt-6-astra` a `high`. A worktree de arranque é a do sítio (ramo `og1-c-2026-10-29`, a partir de `main` dd4acb8e6, com o commit OG1-C0 do lugar de direção já lá); a outra pasta com escrita é a worktree do motor (ramo `og1-c-2026-10-29`, a partir de `master` 882bd72). A `Claude-Session` dos commits do sítio: `https://claude.ai/code/session_0136XaqAJ49YQE82SFe5Viwy`. Prosa em português, sem travessões.*

## §0 O que o lugar de direção mediu antes de escrever (29.10.2026, 06:41 a 07:05 UTC)

1. **O erro que motiva a passagem.** Na leitura a frio do bloco OG1-B (28.10.2026), o Opus apanhou uma citação atribuída à pessoa errada: a linha `og1-il-voto` dava ao deputado Mário Amorim Lopes a frase «moderado no alívio de impostos, …», que a RTP atribui ao partido («A Iniciativa Liberal considera este orçamento …»); a frase do deputado era a seguinte («Os portugueses, segundo Mário Amorim Lopes, …»). O motor não tinha nenhuma regra que ligasse quem fala à citação: `extract()` em `publisher/oe2027_generalidade.py` só exigia que cada `anchors` e a `quote` existissem em algum lugar do corpo plano, e `attributed_to` era uma cadeia livre. A decisão do lugar de direção (28.10.2026, 22:52 UTC, à pergunta do financiador sobre citações a cem por cento): a atribuição passa a estrutural, com uma âncora por linha de afirmação, selada com a citação, que o gerador confere no corpo alojado; o sítio não promete «100 %» em lado nenhum.
2. **O corpo plano não tem blocos.** `html_text()` em `publisher/oe2027_analise.py` reduz a página inteira a uma só cadeia normalizada; todas as 16 afirmações estão «no bloco 0 de 1». Para conferir que quem fala está ao pé da citação é preciso partir o HTML em blocos. O lugar de direção partiu com esta expressão, aplicada ao HTML depois de remover `script`, `style` e `head`, substituindo cada etiqueta que casa por uma quebra de linha, removendo as outras etiquetas, desfazendo as entidades HTML e normalizando os espaços de cada bloco (um bloco vazio não conta):

   `<(/?(p|li|h[1-6]|div|section|article|br|tr|blockquote|figcaption|dd|dt)\b[^>]*)>`

   As contagens de blocos que essa partição dá nos dez corpos alojados das 16 afirmações, que o teu `html_blocks()` tem de reproduzir exatamente: `ps.html` 140, `pcp-comunicado.html` 282, `pcp-raimundo.html` 295, `be-dn.html` 86, `il-eco.html` 275, `livre-cm.html` 213, `rtp-audicao.html` 132, `eco-juros.html` 291, `observador-audicao.html` 254, `rtp-aominuto-28.html` 721. Se as tuas contagens diferirem, a partição não é a mesma: para e diz.
3. **As 16 afirmações (os grupos `partidos` e `governo`) e o lugar de quem fala.** Com essa partição, em 8 das 16 a fonte nomeia quem fala no mesmo bloco da citação; em 1 (`og1-governo-rtp-combustiveis`) no bloco imediatamente anterior; em 2 (`og1-governo-rtp-habitacao`, `og1-governo-eco-juros`) a dois ou cinco blocos de distância; em 1 (`og1-chega-voto`) no bloco imediatamente a seguir («O anúncio foi feito por André Ventura …», depois de a RTP escrever «anunciou hoje o líder do partido»); em 3 o documento é da própria pessoa ou do próprio órgão que fala (o comunicado do Comité Central do PCP, a intervenção de Paulo Raimundo, e a nota da Comissão Política Nacional do PS, esta com a citação na mesma frase que nomeia o órgão); e em 1 (`og1-il-prioridades`) a citação é o título de uma entrevista do ECO e quem responde é nomeado no subtítulo, dois blocos abaixo. Daí os três modos do §2.1. Para `og1-governo-rtp-previsoes` a frase que contém a citação nomeia quem fala pelo cargo («o ministro das Finanças»); o nome próprio está no título da notícia e três blocos acima; por isso a lista de aliases dessa linha leva o cargo, declarado.
4. **O que já existe e não se mexe.** Cada linha de afirmação tem `attributed_to` (lista com uma entidade), `attribution_mode` (texto livre), `role`, `party`, `entity_aliases` (o editor), `anchors` (cadeias que têm de existir no corpo) e `note`. O exportador `publisher/og1a_export.py` escreve para cada linha uma prova (`ledger/provas/og1a/provas.json` no sítio) com os campos de uma lista fechada e, para nove linhas, um `speaker_label` (um literal da página alojada com 120 carateres de contexto). O teste do estudo (`publisher/oe2027_generalidade_test.py`, corrido pelo `core.gate`) tem a lista `expected` de quem fala e dos editores das 11 primeiras afirmações, e a conferência «editor distinto da pessoa que fala» com `len(statements)==16`. No sítio, `scripts/afirmacoes-og1.mjs` compara cada linha com a sua prova e, com `RESEARCHHUB_DIR`, relê as linhas no motor; `tests/discussao/og1.mjs` confere os `speaker_label` nos corpos (com `RESEARCHHUB_DIR`) e as formas dos 16 parágrafos de «Como foi dito»; `src/views/LinhaView.astro` imprime a atribuição pela constante `campoDaAtribuicao` e não lê provas. A lista das 16 linhas que o item imprime como citações é `OG1.afirmacoes` em `src/data/discussao-og1.mjs`.
5. **A página «Método»** diz, no parágrafo que começa por «Antes de uma mudança chegar a estas páginas, as mesmas verificações recusam, entre outras coisas, …» (`src/data/metodo.mjs`, nas duas edições), o que os portões recusam, e diz também que «o texto desta página e o da página «Sobre» só mudam com uma decisão registada que carimbe a versão nova»: a decisão registada é a §1.210 do `DECISIONS.md`, de 29.10.2026, que o lugar de direção escreve no fecho deste bloco; o inventário das frases é a lista que carimba a versão nova (§2.7).
6. **O uso antes do lançamento** (`uso.py`, 06:41 UTC): o Claude a 41 % da semana; o Codex a 6,0 % da semana nova.

## §1 O orçamento desta passagem

Uma passagem, setenta e cinco minutos e cento e vinte chamadas, pelo lançador. Correm só as conferências que a mudança toca: no motor, `python3 -m publisher.oe2027_generalidade_test` (por `curto.sh`) e, no fim, o `core.gate` pelo `portoes-pelo-escrivao.sh … motor`; no sítio, `npm run ledger:check`, `npm run check:discussao` e `npm run check:cartao` (por `curto.sh`), e os três portões pelo escrivão uma vez, depois dos commits. A corrida inteira do `verify` e as capturas são do lugar de direção, depois da passagem. Nenhum ficheiro gerado nem registo de portão se imprime inteiro.

## §2 O que muda

### 2.1 O motor: a âncora de atribuição em cada afirmação

Em `publisher/oe2027_analise.py`, uma função `html_blocks(raw)` que devolve a lista dos blocos normalizados de um corpo HTML pela partição do §0.2, exatamente, e nada mais (sem heurísticas de mobília: um bloco «Escolher» ou «VER MAIS» é um bloco).

Em `publisher/oe2027_generalidade.py`, `extract()` lê um campo novo da especificação, `atribuicao`, obrigatório em toda a linha dos grupos `partidos` e `governo` e proibido em qualquer outra linha, com esta forma e estas conferências, cada uma com a sua `require` e a sua mensagem «OG1: …»:

- `modo`, um de três: `passagem` (a fonte nomeia quem fala na passagem em que cita), `documento` (o documento é da própria pessoa ou do próprio órgão que fala) e `entrevista` (a fonte nomeia quem responde no cabeçalho da entrevista).
- `aliases`, lista não vazia de cadeias, sem algarismos; `aliases[0]` é igual a `attributed_to`; nenhum alias é igual a uma chave ou a um alias de `entity_aliases` (o editor nunca é quem fala).
- `frase`, uma cadeia igual, depois de `norm`, a um bloco inteiro do corpo alojado (`html_blocks` do ficheiro selado), com pelo menos um alias dentro; no máximo 600 carateres.
- `passagem`, obrigatória nos modos `passagem` e `entrevista`, proibida em `documento`: igual, depois de `norm`, à junção por um espaço de blocos consecutivos do corpo, de um primeiro a um último, no máximo oito blocos e 2 000 carateres, que contém o bloco da `frase` e o bloco onde começa a `quote` (a `quote` inteira, normalizada, está na passagem). Dentro da passagem não aparece o nome inteiro (`attributed_to`) de nenhuma outra linha de afirmação do mesmo ficheiro com outro `attributed_to`: a mesma passagem não serve duas pessoas.
- No modo `documento`, o bloco da `frase` precede o bloco da `quote`.
- A saída da linha (`out`) ganha `atribuicao` com `modo`, `aliases`, `frase`, `passagem` (quando existe) e `blocos` (os índices do primeiro e do último bloco da passagem, ou o índice do bloco da frase em `documento`). `anchors`, `attribution_mode`, `role` e `party` ficam como estão.

Em `content/30 Orcamento 2027 Generalidade/extracoes.json`, as 16 especificações dos grupos `partidos` e `governo` ganham o campo `atribuicao` com os valores do §3, copiados sem alterar um carater (as cadeias foram conferidas pelo lugar de direção no corpo alojado pela partição do §0.2; se uma não casar no teu `html_blocks`, a partição é que está diferente: para e diz, não ajustes a cadeia). Depois, `python3 -m publisher.oe2027_generalidade --write` regenera o `ledger.json` (as 112 linhas; só as 16 ganham `atribuicao`; nenhum `value`, `excerpt`, `attributed_to` nem `published_at` muda, e o teu relatório prova-o com o diff do livro).

Em `publisher/oe2027_generalidade_test.py`, as recusas e as conferências novas, com nomes próprios: uma afirmação sem `atribuicao`; `atribuicao` numa linha da UTAO; um `modo` inventado; `aliases[0]` diferente de `attributed_to`; um alias igual ao editor; uma `frase` que não é um bloco (uma frase com uma palavra a mais, e uma frase que junta dois blocos); uma `frase` sem alias; uma `passagem` sem a `quote`; uma `passagem` de nove blocos; uma `passagem` com o nome inteiro de outra pessoa que fala no mesmo ficheiro (usa `og1-pan-abstencao` com «Filipe Sousa» colado à passagem); `documento` com a frase depois da citação; `documento` com `passagem`. E as conferências: as 16 afirmações têm `atribuicao`; 13 em `passagem`, 2 em `documento` (`og1-pcp-comite`, `og1-pcp-raimundo`), 1 em `entrevista` (`og1-il-prioridades`); nenhuma outra linha a tem; cada `frase` está no corpo relido; a lista `expected` do teste ganha, por linha, o `modo` e `aliases[0]`. O teste continua a imprimir a linha «PASS» com o número de checks, e o teu relatório diz esse número antes e depois.

Em `publisher/og1a_export.py`, a prova de cada linha com `atribuicao` ganha `atribuicao` igual ao da linha, mais `source_sha256` do documento; as linhas do sítio (`rows`) não mudam. Em `publisher/oe2027_generalidade_report.py`, a tabela das afirmações do LEIA-ME ganha uma coluna «Atribuição» com o `modo` e a `frase` (regenera o LEIA-ME).

Depois, a exportação para a worktree do sítio: `python3 -m publisher.export_site_rows --manifest publisher/manifest.og1a.json --site <a worktree do sítio> --write`. O resultado esperado no sítio: `ledger/provas/og1a/provas.json` e `ledger/cruzamentos/og1a-provas.json` mudam; nenhum ficheiro de `ledger/claims/` muda (confere com `git status` e diz no relatório). Se um `ledger/claims/*.json` mudar, para e diz.

### 2.2 O sítio: a régua, o teste e a página da linha

`scripts/afirmacoes-og1.mjs`: `conferirLinhaOg1(c,p,relida)` ganha, quando `p.atribuicao` existe: o `modo` é um dos três; `aliases[0]` é igual a `p.attributed_to[0]` e a `c.attributed_to[0]`; a `frase` contém um alias; no modo `passagem` ou `entrevista` a `passagem` contém a `frase` e o `excerpt` da linha (normalizados); no modo `documento` não há `passagem`; e, com `relida`, `atribuicao` relida igual à prova (acrescenta `atribuicao` à lista das chaves comparadas). `conferirOg1()` exige `atribuicao` em toda a prova cujo `id` está em `OG1.afirmacoes` (importa a lista de `src/data/discussao-og1.mjs`; é a lista fechada do que o item imprime como citação) e recusa-a nas outras. As plantas, no mesmo lugar das atuais: a prova sem `atribuicao` para uma linha da lista; `aliases[0]` trocado; a `frase` sem alias; a `passagem` sem o `excerpt`; um `modo` inventado. Cada planta tem de morder, como as atuais.

`tests/discussao/og1.mjs`: com `RESEARCHHUB_DIR`, a `frase` e a `passagem` de cada prova estão no corpo relido, com os blocos (`html_blocks` pelo mesmo motor) a conferirem que a `frase` é um bloco; nas duas edições, cada uma das 16 páginas de linha (`dist/livro-razao/<id>/` e `dist/en/ledger/<id>/`) imprime a `frase` em `[data-linha-campo="atribuicao.frase"]` igual à prova e a nota do modo igual ao modo; uma planta de frase alterada no HTML e uma de nota de modo trocada são recusadas.

`src/views/LinhaView.astro`: nas linhas com `atribuicao` na prova (lê `ledger/provas/og1a/provas.json`; se preferires um carregador em `src/lib/`, diz porquê no relatório), a seguir ao bloco da atribuição, um campo com o rótulo e a frase do §3.2, nas duas edições, com a `frase` em `lang="pt-PT"` na edição inglesa (como o excerto das linhas da UTAO), e debaixo a nota do modo (§3.3). Nada muda nas outras linhas. A ordem da prova na página não muda.

### 2.3 A página «Método»

Em `src/data/metodo.mjs`, no parágrafo do §0.5, a cláusula do §3.4 entra depois de «um nome ou uma definição que a fonte não dá a essa medida» e antes de «, e qualquer dado pessoal, segredo ou caminho de uma máquina», nas duas edições, palavra por palavra. A versão nova carimba-se pela decisão §1.210 (29.10.2026): a linha do inventário dessa frase cita «§1.210».

### 2.4 As listas fechadas que esta passagem arrasta

`design/especime-v3/INVENTARIO-FRASES.md` (as frases mudadas do Método nas duas edições, e os rótulos e as notas novas da página da linha, no bloco `og1-c`); `design/especime-v3/critica/REVISOES-DO-INVENTARIO.md` (`og1-c` por ler); `design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md` (uma linha para `atribuicao` nas provas OG1 e a régua que o confere; `scripts/leituras/conferir-mapa.py` tem de passar); `design/especime-v3/VOZ-MARCADORES.md` se `check:voz` apanhar uma palavra das notas novas (a tua escolha é mudar a nota, não a lista, a não ser que a palavra seja a certa; diz qual). Se outra lista fechada parar um portão (a língua dos rótulos, a auditoria das palavras, a L1), acrescenta-lhe o que ela exige e anota-o no relatório; a L1 não deve mexer (nenhuma linha nova do livro).

## §3 As frases e os valores que o leitor vê (palavra por palavra)

### 3.1 As 16 âncoras (o campo `atribuicao` de cada especificação em `extracoes.json`)

```json
{
 "og1-ps-abstencao": {
  "modo": "passagem",
  "aliases": ["Comissão Política Nacional do Partido Socialista"],
  "frase": "A Comissão Política Nacional do Partido Socialista confirmou, esta quarta-feira, o consenso em torno da proposta de José Luís Carneiro para viabilizar o Orçamento do Estado para 2027 mediante a abstenção na votação na generalidade do documento, reafirmando, porém, a oposição firme ao Governo.",
  "passagem": "A Comissão Política Nacional do Partido Socialista confirmou, esta quarta-feira, o consenso em torno da proposta de José Luís Carneiro para viabilizar o Orçamento do Estado para 2027 mediante a abstenção na votação na generalidade do documento, reafirmando, porém, a oposição firme ao Governo."
 },
 "og1-pcp-comite": {
  "modo": "documento",
  "aliases": ["Comité Central do PCP"],
  "frase": "Comunicado do Comité Central do PCP de 18 e 19 Outubro de 2026"
 },
 "og1-pcp-raimundo": {
  "modo": "documento",
  "aliases": ["Paulo Raimundo"],
  "frase": "Intervenção de Paulo Raimundo, Secretário-Geral do PCP, Sessão Pública «Romper com injustiças. Novo rumo para Portugal. Não à degradação, exige-se, no Orçamento do Estado, soluções para uma vida melhor»"
 },
 "og1-be-voto": {
  "modo": "passagem",
  "aliases": ["José Manuel Pureza"],
  "frase": "“Nós não hesitamos. Nós não assinamos o cheque da má governação de Luís Montenegro”, afirmou José Manuel Pureza, à margem de uma visita ao Mercado D. Pedro V, em Coimbra, para falar com vendedores e clientes sobre o custo de vida.",
  "passagem": "“Nós não hesitamos. Nós não assinamos o cheque da má governação de Luís Montenegro”, afirmou José Manuel Pureza, à margem de uma visita ao Mercado D. Pedro V, em Coimbra, para falar com vendedores e clientes sobre o custo de vida."
 },
 "og1-il-prioridades": {
  "modo": "entrevista",
  "aliases": ["Mariana Leitão"],
  "frase": "A Iniciativa Liberal vai concentrar a sua intervenção no OE2027 no alívio fiscal sobre famílias e empresas, com propostas para baixar o IRS e o ISP, revela a presidente do partido, Mariana Leitão",
  "passagem": "“A prioridade é baixar o IRS e o ISP” no Orçamento do Estado para 2027 premium 6 Outubro 2026 A Iniciativa Liberal vai concentrar a sua intervenção no OE2027 no alívio fiscal sobre famílias e empresas, com propostas para baixar o IRS e o ISP, revela a presidente do partido, Mariana Leitão"
 },
 "og1-livre-posicao": {
  "modo": "passagem",
  "aliases": ["Isabel Mendes Lopes"],
  "frase": "\"Vamos esperar pelo documento do Orçamento, pode ser que venha uma grande surpresa e que de repente o Governo altere completamente a sua política, mas não acreditando nisso dificilmente o acompanharemos, como é óbvio\", afirmou Isabel Mendes Lopes, em declarações à Lusa após uma visita à sede da Acreditar - Associação de Pais e Amigos de Crianças com Cancro, em Lisboa.",
  "passagem": "\"Vamos esperar pelo documento do Orçamento, pode ser que venha uma grande surpresa e que de repente o Governo altere completamente a sua política, mas não acreditando nisso dificilmente o acompanharemos, como é óbvio\", afirmou Isabel Mendes Lopes, em declarações à Lusa após uma visita à sede da Acreditar - Associação de Pais e Amigos de Crianças com Cancro, em Lisboa."
 },
 "og1-governo-rtp-combustiveis": {
  "modo": "passagem",
  "aliases": ["Joaquim Miranda Sarmento", "Miranda Sarmento", "o ministro das Finanças"],
  "frase": "Miranda Sarmento defendeu ainda a credibilidade das previsões do Governo, recordando que as estimativas para os últimos dois anos se revelaram mais favoráveis do que as antecipadas por várias instituições nacionais e internacionais.",
  "passagem": "Miranda Sarmento defendeu ainda a credibilidade das previsões do Governo, recordando que as estimativas para os últimos dois anos se revelaram mais favoráveis do que as antecipadas por várias instituições nacionais e internacionais. Sobre os 300 milhões da fraude dos combustíveis, declarou ser uma medida aprovada no parlamento, e “são receita do Estado”."
 },
 "og1-governo-rtp-previsoes": {
  "modo": "passagem",
  "aliases": ["Joaquim Miranda Sarmento", "Miranda Sarmento", "o ministro das Finanças"],
  "frase": "E sobre as revisões das entidades nacionais e internacionais, para a economia nacional, “estão perfeitamente alinhadas com as previsões do Governo, têm diferenças muito pequenas”. Ainda assim, o ministro das Finanças não esconde que \"há riscos, incluindo geopolíticos, que afetam a economia portuguesa\" e defende prudência orçamental para proteger as contas públicas em 2027.",
  "passagem": "E sobre as revisões das entidades nacionais e internacionais, para a economia nacional, “estão perfeitamente alinhadas com as previsões do Governo, têm diferenças muito pequenas”. Ainda assim, o ministro das Finanças não esconde que \"há riscos, incluindo geopolíticos, que afetam a economia portuguesa\" e defende prudência orçamental para proteger as contas públicas em 2027."
 },
 "og1-governo-rtp-habitacao": {
  "modo": "passagem",
  "aliases": ["Joaquim Miranda Sarmento", "Miranda Sarmento", "o ministro das Finanças"],
  "frase": "Quanto aos preços dos combustíveis, Miranda Sarmento indicou que o desconto atualmente aplicado ronda os 23 a 24 cêntimos, acrescentando que o Governo acompanha a evolução dos preços semanalmente.",
  "passagem": "Quanto aos preços dos combustíveis, Miranda Sarmento indicou que o desconto atualmente aplicado ronda os 23 a 24 cêntimos, acrescentando que o Governo acompanha a evolução dos preços semanalmente. “Não deixaremos de acompanhar os preços dos combustíveis e de tomar as decisões que forem necessárias” , afirmou, sem garantir que os preços vão diminuir ou, pelo menos, manter-se. Sobre a Habitação, “foi praticamente tudo feito”, sustentando-se em três pilares: a construção de casas públicas; a redução dos custos da construção nova; e arrendamento e redução do IRS."
 },
 "og1-governo-eco-juros": {
  "modo": "passagem",
  "aliases": ["Joaquim Miranda Sarmento", "Miranda Sarmento", "O ministro das Finanças"],
  "frase": "O ministro das Finanças, Joaquim Miranda Sarmento, afirmou esta sexta-feira que, num “ambiente de turbulência dos mercados da dívida pública na Zona Euro, que tem levado a um agravar das taxas de juro”, Portugal tem escapado a esta tendência .",
  "passagem": "O ministro das Finanças, Joaquim Miranda Sarmento, afirmou esta sexta-feira que, num “ambiente de turbulência dos mercados da dívida pública na Zona Euro, que tem levado a um agravar das taxas de juro”, Portugal tem escapado a esta tendência . Escolha o ECO como fonte preferida no Google Escolher › O responsável das Finanças associou a estabilidade do spread dos juros da dívida nacional a dez anos face à alemã com a mesma maturidade, que serve de métrica de risco no mercado, à trajetória de redução da dívida pública e melhorias de rating da República . “No caso de Portugal, o nosso spread face à dívida alemã tem se mantido estável, a nossa subida das taxas de juro é risco de mercado e não risco de país . Quando as taxas sobem as nossas também sobem, mas é importante mantermos essa estabilidade”, afirmou na audição na Comissão de Orçamento, Finanças e Administração Pública ( COFAP ) que marca o pontapé de saída da discussão na generalidade da proposta de Orçamento do Estado para 2027 ( OE2027 )."
 },
 "og1-governo-observador-saldo": {
  "modo": "passagem",
  "aliases": ["Joaquim Miranda Sarmento", "Miranda Sarmento"],
  "frase": "Joaquim Miranda Sarmento alertou ainda sobre o impacto de manter o prémio salarial (devolução das propinas) cumulativamente com o IRS Jovem. Custará, em 2027, 300 milhões de euros em velocidade cruzeiro. Não está expresso na proposta orçamental porque abate à receita, não é despesa. “Decidimos colocar como opção IRS Jovem ou prémio salarial. O Parlamento tomará a decisão mas esta é uma medida que custa 300 milhões no próximo ano, para um saldo de 270 milhões”, apelando ao PS que cumpra o “compromisso de não desvirtuar o orçamento”.",
  "passagem": "Joaquim Miranda Sarmento alertou ainda sobre o impacto de manter o prémio salarial (devolução das propinas) cumulativamente com o IRS Jovem. Custará, em 2027, 300 milhões de euros em velocidade cruzeiro. Não está expresso na proposta orçamental porque abate à receita, não é despesa. “Decidimos colocar como opção IRS Jovem ou prémio salarial. O Parlamento tomará a decisão mas esta é uma medida que custa 300 milhões no próximo ano, para um saldo de 270 milhões”, apelando ao PS que cumpra o “compromisso de não desvirtuar o orçamento”."
 },
 "og1-livre-voto": {
  "modo": "passagem",
  "aliases": ["Jorge Pinto"],
  "frase": "\"Um Orçamento que é contra o país tem apenas um voto possível que é o voto contra\", anunciou Jorge Pinto, em declarações aos jornalistas no parlamento, depois de a Assembleia do Livre - órgão máximo entre congressos - ter reunido na terça-feira à noite e aprovado a decisão por unanimidade.",
  "passagem": "\"Um Orçamento que é contra o país tem apenas um voto possível que é o voto contra\", anunciou Jorge Pinto, em declarações aos jornalistas no parlamento, depois de a Assembleia do Livre - órgão máximo entre congressos - ter reunido na terça-feira à noite e aprovado a decisão por unanimidade."
 },
 "og1-pan-abstencao": {
  "modo": "passagem",
  "aliases": ["Inês Sousa Real"],
  "frase": "\"Este orçamento tem um problema: contas certas, mas prioridades trocadas\", afirmou Inês Sousa Real, declarando ainda que \"o custo de vida das pessoas tem de caber no orçamento\", assim como o \"futuro dos jovens\".",
  "passagem": "\"Este orçamento tem um problema: contas certas, mas prioridades trocadas\", afirmou Inês Sousa Real, declarando ainda que \"o custo de vida das pessoas tem de caber no orçamento\", assim como o \"futuro dos jovens\"."
 },
 "og1-jpp-abstencao": {
  "modo": "passagem",
  "aliases": ["Filipe Sousa"],
  "frase": "Filipe Sousa, do JPP, anunciou que vai abster-se na votação na generalidade da proposta do Orçamento do Estado para 2027, em sinal de colaboração com o Governo. Ainda assim, “há muito por resolver”.",
  "passagem": "Filipe Sousa, do JPP, anunciou que vai abster-se na votação na generalidade da proposta do Orçamento do Estado para 2027, em sinal de colaboração com o Governo. Ainda assim, “há muito por resolver”."
 },
 "og1-chega-voto": {
  "modo": "passagem",
  "aliases": ["André Ventura"],
  "frase": "O anúncio foi feito por André Ventura em declarações aos jornalistas na Assembleia da República.",
  "passagem": "O Chega vai votar contra o Orçamento do Estado do próximo ano na generalidade, anunciou hoje o líder do partido, argumentando que o Governo \"não consegue reconhecer o momento de dificuldade\" e não apresenta medidas para ajudar os portugueses. O anúncio foi feito por André Ventura em declarações aos jornalistas na Assembleia da República."
 },
 "og1-il-voto": {
  "modo": "passagem",
  "aliases": ["Mário Amorim Lopes"],
  "frase": "Os portugueses, segundo Mário Amorim Lopes, \"não precisam que o Governo lhes recorde que não têm dinheiro, precisam de um Governo que faça a sua parte para viverem melhor\".",
  "passagem": "Os portugueses, segundo Mário Amorim Lopes, \"não precisam que o Governo lhes recorde que não têm dinheiro, precisam de um Governo que faça a sua parte para viverem melhor\"."
 }
}
```

### 3.2 O rótulo do campo novo na página da linha

- pt: «Quem fala, segundo a fonte»
- en: «Who speaks, according to the source»

O valor é a `frase` da prova, tal e qual, em `[data-linha-campo="atribuicao.frase"]`.

### 3.3 A nota do modo, debaixo da frase

- `passagem`, pt: «A fonte nomeia quem fala na mesma passagem em que cita.» en: «The source names the speaker in the same passage in which it quotes.»
- `documento`, pt: «O documento é da própria pessoa ou do próprio órgão que fala.» en: «The document is the speaker's own.»
- `entrevista`, pt: «Entrevista: a fonte nomeia quem responde no seu cabeçalho.» en: «Interview: the source names the respondent in its heading.»

### 3.4 A cláusula nova do «Método» (dentro da frase existente, no lugar do §2.3)

- pt: «, uma citação de uma pessoa ou de um partido sem a passagem da fonte que nomeia quem fala selada ao lado dela»
- en: «, a quotation from a person or a party without the source passage that names the speaker sealed next to it»

A frase inteira fica, em português: «Antes de uma mudança chegar a estas páginas, as mesmas verificações recusam, entre outras coisas, uma frase copiada de uma fonte que não seja igual à da fonte, um nome ou uma definição que a fonte não dá a essa medida, uma citação de uma pessoa ou de um partido sem a passagem da fonte que nomeia quem fala selada ao lado dela, e qualquer dado pessoal, segredo ou caminho de uma máquina.» O resto do parágrafo não muda.

## §4 Os commits

No motor, um ou dois commits com o prefixo «OG1-C1» e o trailer `Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>` (só esse), por `comitar.sh` na worktree do motor; o `core.gate` corre uma vez no fim pelo escrivão com `motor`, não a cada commit. No sítio, um ou dois commits com o prefixo «OG1-C2», o mesmo `Co-Authored-By` e a linha `Claude-Session` do cabeçalho deste mandato. Só ficheiros, por caminho explícito.

## §5 O relatório

No ficheiro de relatório que o lançador te dá: o que mudou para o leitor (a frase «Quem fala, segundo a fonte» em 16 páginas de linha, nas duas edições, e a cláusula do Método); os comandos corridos com os códigos e as contagens antes e depois (os checks do teste do estudo, os checks de `tests/discussao/og1.mjs`, as plantas que morderam, as 16 âncoras conferidas no corpo, as contagens de blocos dos dez ficheiros pela tua `html_blocks`); o diff do `ledger.json` resumido (quantas linhas mudaram e que campos); o que a exportação mudou no sítio (os ficheiros, com `git status`); as ambiguidades que decidiste, numeradas «OG1-C-1», «OG1-C-2», …, com a razão; o que ficou aberto. Nenhum número no relatório que não venha de um comando que mostras.

## §6 O que não se faz

Não se muda nenhuma citação, nenhum `attributed_to`, nenhuma frase dos itens de «O que se discute», nenhum parágrafo de «Como foi dito». Não se cria nenhuma linha nova do livro-razão nem nenhuma entrada no registo público das correções (a âncora é uma prova nova, não uma revisão de um campo). Não se constrói o segundo leitor das citações (fica para outra passagem; a página do Método só diz o que já existe). Não se tocam `indicators/*.json`, `indicators/vintages.json`, `.maintenance-locks/`, `sweeps/` nem `publisher/recortes/manifest.regioes.json`. Não se escreve nenhum caminho de máquina, nome de utilizador nem segredo em ficheiro nenhum. Não se afrouxa nenhuma conferência existente: as nove `speaker_label` ficam e continuam a morder.

## §7 O que pára

Paras e dizes, sem contornar: uma contagem de blocos diferente das do §0.2; uma `frase` ou `passagem` do §3.1 que não case com o corpo pela tua partição; a exportação a mudar um `ledger/claims/*.json`; o exportador a pedir uma `correcao` ou `atualizacao`; qualquer portão que proteja um número, uma fonte ou uma pessoa a dar vermelho por uma causa que não seja um erro teu que corriges. Um portão que encoda mobília (um inventário, um rótulo, um marcador da voz) muda de forma conservando o que protege, com a planta, e anota-se.
