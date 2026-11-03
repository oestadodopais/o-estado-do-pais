# Adenda G ao mandato EV3: a página das correções e a primeira página deixam de se explicar (03.11.2026)

Acrescenta: frases

*A mesma sessão e as mesmas worktrees. A adenda F ficou bem: `check:lugar` a 0 em f8522d245, e a reconstrução deste lugar na cabeça deu verde. Esta adenda entra antes da leitura a frio, porque toca a mesma lista que a EV3 acabou de acrescentar.*

## §0 O que o leitor viu, e a decisão

O financiador, como leitor, mandou às 13:57 UTC três capturas do sítio no ar. A primeira: a caixa "O que há de novo" da primeira página mostra, como primeira peça, a entrada do registo da recontagem das correções publicadas (15 → 45), com o motivo escrito para o registo ("As correções dos campos dos recibos passam a integrar o registo e a sua contagem. A recontagem não é uma correção adicional."). A segunda: a política da página das correções explica a maquinaria (livro-razão, campo do recibo, linha, naturezas, definições). A terceira: a lede da mesma página, "Corrigir em silêncio é a forma mais barata de mentir.", uma frase sobre a honestidade do sítio por baixo do título. Perguntou porque é que o sítio voltou a explicar-se.

A decisão deste lugar: tem razão nas três, e as três vêm de mandatos deste lugar ou passaram por eles. A Emenda 15 (21.08.2026) manda que uma página do leitor leve conteúdo e navegação, e nenhuma frase sobre o método, a verificação, a honestidade ou as intenções do sítio; a página das correções está debaixo dela (`scripts/medir-defeitos.mjs`, na lista que o comentário sobre `/correcoes` abre), mas a política foi declarada conteúdo da página, e foi por aí que a lista das naturezas cresceu (a ED1-E e a OG1-E D, esta semana, e a EV3, hoje). A caixa "O que há de novo" leva a última entrada do registo, seja ela qual for (`src/lib/novidades.mjs`, a chamada a `atualizacaoDaNovidade`), e a última foi uma linha do próprio sítio.

## §1 A medição, por guião deste lugar, no `dist/` de f8522d245

- 9 825 páginas; 30 com uma lede de classe declarada logo a seguir ao `<h1>`; uma só é uma frase sobre o sítio e não sobre a página: a das correções, nas duas edições. As outras (a página de erro, as cinco da caixa das sugestões, o Sobre e o Método) dizem o que a página é ou o que aconteceu ao leitor, e ficam.
- A caixa "O que há de novo" é a única porta por onde uma entrada do registo chega à primeira página (as duas edições).

Mede de novo as três coisas no teu `dist/` antes de mudar e depois de mudar, e diz os números no relatório.

## §2 As frases (as tuas mudanças em `src/i18n/strings.mjs`, chave `correcoes`, nas duas edições)

1. A lede sai, nas duas edições; a página fica com o título e, a seguir, a política. Se o componente exigir uma lede, decides a forma de a página não a ter e anotas.
2. A política (`politicaV`) passa a:
   - pt «Quando o que se publicou aqui está errado, corrige-se à vista: a entrada diz o que estava, o que ficou, a data e o motivo, e nada se apaga. Uma atualização não é um erro: é um valor que mudou porque aquilo que mede mudou, ou um estudo que ganhou documentos novos.»
   - en «When something published here is wrong, it is corrected in the open: the entry says what it was, what it became, the date and the reason, and nothing is deleted. An update is not an error: it is a value that changed because what it measures changed, or a study that gained new documents.»
3. A lista das naturezas (`naturezas`) deixa de se imprimir na política, nas duas edições. As naturezas continuam: cada entrada do registo leva o seu rótulo, como hoje, e as cinco ficam nos dados, na contagem e nas réguas.
4. A descrição da página (`metaDescription`):
   - pt «O registo das correções e das atualizações de O Estado do País: o que estava publicado, o que ficou, a data e o motivo.»
   - en «The register of the corrections and updates of O Estado do País: what was published, what it became, the date and the reason.»
5. O endereço, o crédito, o direito de resposta e a ligação ao Método ficam como estão. Os comentários do código que digam que as naturezas estão ditas na política passam a dizer onde estão.

## §3 A primeira página

A caixa "O que há de novo" leva só peças: estudos, itens de "O que se discute", explicações e dossiês, como a FP1 a desenhou (cinco peças por data). A entrada do registo sai da caixa nas duas edições; o registo continua a um toque pelas duas portas que a primeira página já tem para `/correcoes`. O código que só servia essa entrada sai com ela, e as suas plantas também; nenhuma régua de datas da caixa enfraquece (as datas das peças continuam conferidas como hoje).

## §4 As réguas, que mordem no que há e no que vier

1. **A caixa:** os tipos de peça de "O que há de novo" são uma lista fechada (estudo, discussão, explicação, dossiê); uma peça de outro tipo faz o `build` falhar. Planta: uma entrada do registo empurrada para a lista dá vermelho.
2. **A página das correções:** o texto entre o `<h1>` e o registo é, nas duas edições, exatamente o das frases do §2 e das que o ponto 5 do §2 conserva; uma frase a mais faz o `build` falhar. Planta: a lede antiga reposta dá vermelho.
3. **A contagem:** a função partilhada da contagem, a sua planta e a régua de que uma atualização (de valor ou de estudo) nunca conta como correção ficam exatamente como estão. `tests/edicoes/politica.mjs` deixa de procurar as frases da política antiga e passa a conferir as do §2, conservando a conferência da história declarada.

## §5 Quando paras

Só se uma régua que protege um número, uma fonte ou uma pessoa tiver de enfraquecer (diz qual), ou se uma frase do §2 não puder ficar como está escrita (diz qual e porquê).

## §6 O fim

O `build` inteiro verde; as conferências que esta mudança toca (diz quais e os códigos); as duas plantas do §4 com o vermelho e o verde; o relatório com as medições do §1 antes e depois. Commits só com caminhos explícitos, com o trailer da sessão da adenda D. Trinta minutos, quarenta chamadas.
