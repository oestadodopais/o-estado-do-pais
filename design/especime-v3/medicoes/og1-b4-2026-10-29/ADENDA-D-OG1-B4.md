# Adenda D ao mandato OG1-B4: as correções da leitura curta (29.10.2026, 17:26 UTC)

*A mesma sessão, a mesma worktree do sítio (ramo `og1b4-2026-10-29`), agora na cabeça 8235f5be5: a OG1-B4 (33977cd47) e a OG1-B4-1 (a linha reexportada do motor com a edição do documento em 2026-10-29, feita pelo lugar de direção por guião, pelo achado 5 da leitura). A leitura curta do Opus (17:12 a 17:22 UTC) apanhou as cinco plantas e deixou achados reais, decididos abaixo. Uma passagem só, commit «OG1-B4-2». Correm só as conferências que a mudança toca; sem os três portões pelo escrivão. A leitura curta do diff é do lugar de direção.*

## 1 · O segundo parágrafo da abertura (`abertura[1]`): a RTP sai da confirmação e a frase parte-se em duas (os achados 6 e 13)

A RTP só registou a aprovação, os votos a favor e a abstenção do PS; dizer que o registo oficial confirma o que «o ECO e a RTP tinham noticiado» dava à RTP os cinco votos contra que ela não deu (a regra 2). E uma frase de noventa palavras a juntar a confirmação ao argumento do Conselho com um «e» não se imprime num diário. Palavra por palavra:

- pt: «Votaram contra o Chega, a Iniciativa Liberal, o Livre, o PCP e o Bloco de Esquerda, segundo o registo oficial da votação de ⟦periodo og1-votacao-generalidade-oficial⟧ na página da iniciativa no sítio do Parlamento, que confirma o que o ECO tinha noticiado. A diferença entre o Governo e o Conselho está no que o Conselho não conta, a começar pelos ⟦claim pm-q3-2-r8-c0, « milhões de euros»⟧ do combate à fraude nos combustíveis, «⟦fragmento og1-utao-p42: a medida de maior dimensão do lado da receita⟧» entre as medidas novas segundo a UTAO, a unidade técnica de apoio orçamental do Parlamento, que não encontra na proposta «⟦fragmento og1-utao-p42: informação suficientemente detalhada sobre o seu conteúdo e os mecanismos de implementação⟧».»
- en: «Chega, Iniciativa Liberal, Livre, PCP and Bloco de Esquerda voted against, according to the official record of the vote of ⟦periodo og1-votacao-generalidade-oficial⟧ on the bill's page on Parliament's website, which confirms what ECO had reported. The difference between the Government and the Council lies in what the Council does not count, starting with the ⟦claim pm-q3-2-r8-c0, « million euros»⟧ of the fight against fuel fraud, «⟦fragmento og1-utao-p42: a medida de maior dimensão do lado da receita⟧» (the largest measure on the revenue side) among the new measures according to the UTAO, Parliament's technical budget support unit, which does not find in the proposal «⟦fragmento og1-utao-p42: informação suficientemente detalhada sobre o seu conteúdo e os mecanismos de implementação⟧» (sufficiently detailed information on its content and implementation mechanisms).»

Se uma régua exigir uma frase só por parágrafo da abertura, pára e diz a linha da régua.

## 2 · A última oração do parágrafo das fontes: o resultado como sujeito, o ECO só, a glosa inglesa sem algarismo (os achados 6, 9 e 13)

No lugar da oração da adenda B, palavra por palavra:

- pt: «; o registo oficial da votação de ⟦periodo og1-votacao-generalidade-oficial⟧, na página da iniciativa no sítio do Parlamento, dá na «⟦fragmento og1-votacao-generalidade-oficial: Reunião Plenária n.º 16⟧» o resultado «⟦fragmento og1-votacao-generalidade-oficial: Aprovado⟧», com os votos a favor do PSD e do CDS-PP, a abstenção do PS, do PAN e do JPP e os votos contra do Chega, da Iniciativa Liberal, do Livre, do PCP e do Bloco de Esquerda, os sentidos de voto que o ECO tinha dado; o processo da iniciativa não ligava ainda o Diário da reunião, e a votação final global está marcada para ⟦periodo oe-2027-calendario-final-global⟧.»
- en: «; the official record of the vote of ⟦periodo og1-votacao-generalidade-oficial⟧, on the bill's page on Parliament's website, gives at the «⟦fragmento og1-votacao-generalidade-oficial: Reunião Plenária n.º 16⟧» (the sixteenth plenary sitting) the result «⟦fragmento og1-votacao-generalidade-oficial: Aprovado⟧» (passed), with PSD and CDS-PP voting in favour, PS, PAN and JPP abstaining and Chega, Iniciativa Liberal, Livre, PCP and Bloco de Esquerda voting against, the positions ECO had given; the bill's file did not yet link the record of the sitting, and the final global vote is scheduled for ⟦periodo oe-2027-calendario-final-global⟧.»

A glosa «(the sixteenth plenary sitting)» não leva algarismo nem fragmento: o parágrafo inglês fica com três selos da linha oficial, como o português.

## 3 · O token da comparação volta ao ECO (o achado 10)

O parágrafo da comparação diz «Na votação de ⟦data⟧, segundo o ECO, o PSD e o CDS-PP votaram a favor…» (e o inglês equivalente): a frase atribui ao ECO, por isso o token `periodo` dessa frase volta à linha `og1-votacao-generalidade` nas duas edições. Os tokens movidos para a linha oficial passam a seis (quatro no item, dois no dossiê); o relatório e `tokens.json` dizem seis.

## 4 · O inventário e o que fica

As linhas vivas dos dois parágrafos no bloco `og1-b4` reescrevem-se no lugar com o texto final (as formas de 33977cd47 nunca chegaram a `main`); a linha em branco que parte a tabela da secção `og1-b4` sai (o achado 12). O que fica para a higiene, registado pelo lugar de direção: a página dos itens não imprime a data da escrita nem a da publicação (o achado 7, anterior a este bloco); as contagens de chamadas do relatório sem ficheiro (o achado 8).

## 5 · O que corre e o relatório

`check:discussao`, `check:cartao`, `check:datas`, `check:voz`, `check:lingua`, `ledger:check`, a auditoria das palavras regenerada, o inventário das frases e a L1 (não deve mudar), um de cada vez, com os códigos lidos dos ficheiros `.codigo`; `npm run build`; o relatório completo da pasta das medições atualizado (os quatro parágrafos copiados do HTML construído, os tokens, os códigos, as contagens do inventário), sem caminhos da máquina; o commit «OG1-B4-2». Paras e dizes se uma régua recusar por uma lista que nenhuma adenda nomeia, ou se um fragmento não existir no excerto.
