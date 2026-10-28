# OG1-B-d · a segunda correção dirigida, depois da leitura curta (28.10.2026, 23:10 UTC)

*Do lugar de direção (Claude Fable 5.1) para o construtor Codex `gpt-6-astra` a `high`, na mesma sessão e na mesma worktree. A leitura curta do Claude Opus 5.5 (`leitor`, xhigh; 22:57 a 23:05 UTC) apanhou as cinco plantas, fechou as sete perguntas da correção anterior e deixou um Major real e três Minor que mudam o texto, todos nas frases do lugar de direção; e o juízo do editor: a frase do item do Orçamento na primeira página era uma lista de fontes, não a notícia. Esta passagem corrige isso e nada mais. Depois dela, uma leitura curta sobre o diff (M48). Orçamento: sessenta chamadas e quarenta e cinco minutos. Sem travessões.*

## §0 O que se mediu

1. O superlativo: a UTAO (§42, `og1-utao-p42`) diz do combate à fraude nos combustíveis «constitui a medida de maior dimensão do lado da receita» entre as medidas novas; o Quadro 3.2 do relatório tem linhas invariantes maiores. A abertura já diz «entre as medidas novas»; «A comparação» ainda diz «a maior medida de receita», nas duas edições: a página contradiz-se.
2. «Não suficientemente especificadas» é a palavra do Conselho das Finanças Públicas (`og1-cfp-plausivel`); a UTAO di-lo da medida dos combustíveis (§42), ninguém no livro o diz do resto da receita da venda de imóveis. A comparação, a conclusão e a opinião dizem-no na voz do sítio: passa a «segundo o Conselho».
3. Na segunda frase da abertura da Saúde, o ano «2026» de «na despesa efetiva de 2026» liga à linha da despesa total (`oe-2027-saude-despesa-total-consolidada-2026`); a linha da despesa efetiva de 2026 existe (`oe-2027-saude-despesa-efetiva-consolidada-2026`, 18 062,4 milhões de euros, `reference_date` 2026) e é a que a frase descreve.
4. A primeira frase da abertura do Orçamento (a que a primeira página mostra) tinha cerca de setenta palavras, a lista das fontes e uma referência ao próprio item («quando este item foi reescrito»). As duas frases reescrevem-se: a primeira diz o que aconteceu e o que está em jogo; a segunda diz os votos contra, as fontes e a medida dos combustíveis. Factos: o excedente de 0,1 % do PIB (`pm-q3-3-r37-c3`) e o défice de 0,1 % do CFP (`og1-cfp-saldo-2027`), os votos pelo ECO (`og1-votacao-generalidade`) e pela RTP (`og1-votacao-generalidade-rtp`), o resultado oficial não publicado a 28.10.2026 (o arquivo de votações às 18:58 e às 22:53 UTC; `{"periodo": "og1-guiao-votacoes-28"}` renderiza 28.10.2026).

## §1 As frases, edição portuguesa

### 1.1 A abertura do item do Orçamento (dois parágrafos, uma frase cada; a primeira vai à primeira página)
[0] «O Parlamento aprovou a proposta de Orçamento para ⟦periodo pm-q3-3-r37-c3⟧ na generalidade a ⟦periodo og1-votacao-generalidade⟧, com os votos a favor do PSD e do CDS-PP e a abstenção do PS, do PAN e do JPP, e o excedente de ⟦claim pm-q3-3-r37-c3, sufixo " %"⟧ do PIB que o Governo prevê para esse ano é, nas contas do Conselho das Finanças Públicas, um défice de ⟦claim og1-cfp-saldo-2027, sufixo " %"⟧.» Recibos de `abertura[0]`: `['og1-votacao-generalidade']`.
[1] «Votaram contra o Chega, a Iniciativa Liberal, o Livre, o PCP e o Bloco de Esquerda, segundo o ECO (a RTP registou a aprovação, os votos a favor e a abstenção do PS; o resultado oficial da votação não estava publicado a ⟦periodo og1-guiao-votacoes-28⟧), e a diferença entre o Governo e o Conselho está no que o Conselho não conta, a começar pelos ⟦claim pm-q3-2-r8-c0, sufixo " milhões de euros"⟧ do combate à fraude nos combustíveis, «⟦fragmento og1-utao-p42: a medida de maior dimensão do lado da receita⟧» entre as medidas novas segundo a UTAO, a unidade técnica de apoio orçamental do Parlamento, que não encontra na proposta «⟦fragmento og1-utao-p42: informação suficientemente detalhada sobre o seu conteúdo e os mecanismos de implementação⟧».» Recibos de `abertura[1]`: `['og1-votacao-generalidade', 'og1-votacao-generalidade-rtp', 'og1-guiao-votacoes-28']`.

### 1.2 «A comparação» (três trocas de palavras; o resto fica)
«… aponta o preço do petróleo abaixo dos contratos e a maior das medidas novas de receita sem a informação que a fundamente, …» (era «a maior medida de receita»); «… e a diferença está no que o Conselho não conta: as duas medidas que, segundo o Conselho, a proposta não especifica o suficiente, a começar pela dos combustíveis, …» (era «as duas medidas que a proposta não especifica o suficiente»).

### 1.3 «A conclusão» (uma troca; o resto fica)
«… está no que o Conselho não conta, as duas medidas que, segundo o Conselho, a proposta não especifica o suficiente, a começar pelos …» (era «as duas medidas que a proposta não especifica o suficiente»).

### 1.4 «A opinião do lugar de direção» (uma troca; o resto fica)
«… não conta a medida dos combustíveis nem o resto da receita da venda de imóveis, porque, diz o Conselho, a proposta não as especifica o suficiente, nem o efeito …» (era «porque a proposta não as especifica o suficiente»).

### 1.5 A abertura do item da Saúde, o segundo parágrafo (só o token do ano muda)
«… a parte do PRR, ⟦claim der-saude-prr-2026, sufixo " milhões de euros"⟧ na despesa efetiva de ⟦periodo oe-2027-saude-despesa-efetiva-consolidada-2026⟧, acaba, …» (era `⟦periodo oe-2027-saude-despesa-total-consolidada-2026⟧`; as palavras ficam).

## §2 As frases, edição inglesa

### 2.1 The Budget opening
[0] «Parliament passed the ⟦periodo pm-q3-3-r37-c3⟧ Budget proposal at the general vote on ⟦periodo og1-votacao-generalidade⟧, with PSD and CDS-PP voting in favour and PS, PAN and JPP abstaining, and the surplus of ⟦claim pm-q3-3-r37-c3, sufixo " %"⟧ of GDP the Government forecasts for that year is, in the Public Finance Council's accounts, a deficit of ⟦claim og1-cfp-saldo-2027, sufixo " %"⟧.»
[1] «Chega, Iniciativa Liberal, Livre, PCP and Bloco de Esquerda voted against, according to ECO (RTP recorded the approval, the votes in favour and the PS abstention; the official record of the vote had not been published on ⟦periodo og1-guiao-votacoes-28⟧), and the difference between the Government and the Council lies in what the Council does not count, starting with the ⟦claim pm-q3-2-r8-c0, sufixo " million euros"⟧ of the fight against fuel fraud, «⟦fragmento og1-utao-p42: a medida de maior dimensão do lado da receita⟧» (the largest measure on the revenue side) among the new measures according to the UTAO, Parliament's technical budget support unit, which does not find in the proposal «⟦fragmento og1-utao-p42: informação suficientemente detalhada sobre o seu conteúdo e os mecanismos de implementação⟧» (sufficiently detailed information on its content and implementation mechanisms).»

### 2.2 «The comparison»
«… points to an oil price below the contracts and to the largest new revenue measure without the information to support it, …» (was «the largest revenue measure»); «… and the difference lies in what the Council does not count: the two measures that, according to the Council, the proposal does not specify sufficiently, starting with the fuel one, …» (was «the two measures the proposal does not specify sufficiently»).

### 2.3 «The conclusion»
«… lies in what the Council does not count, the two measures that, according to the Council, the proposal does not specify sufficiently, starting with the …».

### 2.4 «The editorial seat's opinion»
«… it does not count the fuel measure nor the rest of the revenue from property sales, because, the Council says, the proposal does not specify them sufficiently, nor the effect …».

### 2.5 The Health opening, second paragraph
«… the RRP's share, ⟦claim der-saude-prr-2026, sufixo " million euros"⟧ of effective expenditure in ⟦periodo oe-2027-saude-despesa-efetiva-consolidada-2026⟧, ends, …» (the words stay).

## §3 O que a passagem faz, por esta ordem

1. Aplica os §1 e §2 e os recibos do §1.1; comita por `comitar.sh` com ficheiros explícitos.
2. As listas fechadas que estas frases arrastam: as linhas vivas do inventário dos parágrafos que mudam (bloco `og1-b`, reescritas no lugar), a auditoria das palavras regenerada pelo guião, `frases-construidas.json` e `mandato-frases.json` com esta adenda; o rasto `og1-b` fica «por ler»; nada muda nas famílias, na língua, nas áreas, na L1, em `LINHAS_ESPERADAS` nem no livro.
3. Constrói de cabeça limpa e corre, com o código em ficheiro: `check:discussao`, `check:voz`, `check:palavras`, `check:lingua`, `gate:html`, `check:registo`, `ledger:check`, `check:cruzamento`, `check:rotulos`, `check:cartao`, `typecheck`; `check:frases-compostas` e `check:primeira` pelo escrivão com o perfil `og1-b-navegador`.
4. As capturas pelo escrivão, de novo (a primeira página e as aberturas mudaram), com o manifesto `capturas.json` na pasta do relatório.
5. O `LEIA-ME.md` ganha a secção «OG1-B-d: a segunda correção, depois da leitura curta» (os achados pelo número: o Major 5 e os Minor 8, 9 e 11 da leitura curta; o que mudou; as frases tal como renderizam; os códigos; a cabeça das capturas igual à cabeça do relatório, ou a diferença dita; «sem push»), num commit final.

## §4 O que pára

O mesmo §7 do mandato. Se uma régua recusar uma palavra ou pedir uma declaração que não está aqui, pára e diz.
