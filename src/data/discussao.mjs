/** V2-b: palavras do mandato de 15.10, retoma de 19.10. Dois itens; o CFP espera pelo LR1. */
export const DISCUSSAO = {
  titulo: { pt: 'O que se discute', en: 'Under discussion' },
  ambito: { pt: 'As afirmações públicas, ao lado do que as fontes dizem.', en: 'Public statements, next to what the sources say.' },
  porta: { pt: 'O que se discute sobre isto →', en: 'What is being discussed about this →' },
};
export const PARTES = [
  ['como-foi-dito', 'Como foi dito', 'As it was said'],
  ['fontes', 'O que as fontes dizem', 'What the sources say'],
  ['comparacao', 'A comparação', 'The comparison'],
  ['conclusao', 'A conclusão', 'The conclusion'],
  ['recomendacao', 'A recomendação', 'The recommendation'],
  ['opiniao', 'A opinião do lugar de direção', "The editorial seat's opinion"],
];
const saude = 'oe-2027-saude-despesa-';
const ppp = 'oe-2027-ppp-';
export const AMARO = 'afirmacao-leitao-amaro-saude-oe2027-2026-10-09';
export const RTP = 'afirmacao-rtp-saude-queda-oe2027-2026-10-09';
export const PCP = 'afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09';
/** @param {string} id */
const valor = (id) => id.endsWith('-variacao') ? {claim:id, sufixo:' %'} : {claim:id};
/** @param {string} id */
const periodo = (id) => ({ periodo: id });
/** @param {string} id @param {string} campo */
const literal = (id, campo) => ({ literal: id, campo });
/** @param {string} id */
const excerto = (id) => literal(id, 'excerpt');
/** @param {string} id */
const atribuicao = (id) => literal(id, 'attributed_to');
/** @param {string|any[]} pt @param {string|any[]} en */
const p = (pt, en) => ({ paragrafo: { pt: Array.isArray(pt) ? pt : [pt], en: Array.isArray(en) ? en : [en] } });
/** @param {string} slug @param {[string,string]} titulo @param {string[]} afirmacoes @param {any[][]} conteudos */
const item = (slug, titulo, afirmacoes, conteudos) => ({
  slug, escrita: '2026-10-19', titulo: { pt: [titulo[0]], en: [titulo[1]] },
  afirmacoes, abertura: [], naoDiz: [],
  seccoes: PARTES.map(([id, pt, en], i) => ({ id, titulo: { pt, en }, conteudo: conteudos[i] })),
});
export const ITENS = [
  item('saude-no-orcamento', ['A Saúde no Orçamento: que despesa se está a comparar?', 'Health in the Budget: which expenditure is being compared?'], [AMARO, RTP], [
    [p(['«', excerto(AMARO), '», ', atribuicao(AMARO), ', num documento publicado pela RTP, a ', periodo(AMARO), '. No mesmo dia, ', atribuicao(RTP), ' publicou: «', excerto(RTP), '».'],
       ['«', excerto(AMARO), '», ', atribuicao(AMARO), ', in a document published by RTP, on ', periodo(AMARO), '. On the same day, ', atribuicao(RTP), ' published: «', excerto(RTP), '».'])],
    [p(['O quadro ', {verbatim:'origem-v2a-saude-consolidada-quadro'}, ' do relatório do Orçamento, o programa Saúde, em milhões de euros.'], ['Table ', {verbatim:'origem-v2a-saude-consolidada-quadro'}, ' of the Budget report, the Health programme, in million euros.']),
     p(['A despesa total consolidada passa de ', valor(saude+'total-consolidada-2026'), ' em ', periodo(saude+'total-consolidada-2026'), ' para ', valor(saude+'total-consolidada-2027'), ' em ', periodo(saude+'total-consolidada-2027'), ', uma variação de ', valor(saude+'total-consolidada-variacao'), '.'],
       ['Total consolidated expenditure goes from ', valor(saude+'total-consolidada-2026'), ' in ', periodo(saude+'total-consolidada-2026'), ' to ', valor(saude+'total-consolidada-2027'), ' in ', periodo(saude+'total-consolidada-2027'), ', a change of ', valor(saude+'total-consolidada-variacao'), '.']),
     p(['A despesa efetiva consolidada passa de ', valor(saude+'efetiva-consolidada-2026'), ', na estimativa, para ', valor(saude+'efetiva-consolidada-2027'), ', no Orçamento, uma variação de ', valor(saude+'efetiva-consolidada-variacao'), '.'],
       ['Consolidated effective expenditure goes from ', valor(saude+'efetiva-consolidada-2026'), ', in the estimate, to ', valor(saude+'efetiva-consolidada-2027'), ', in the Budget, a change of ', valor(saude+'efetiva-consolidada-variacao'), '.']),
     p(['A despesa efetiva consolidada sem o PRR passa de ', valor(saude+'efetiva-consolidada-sem-prr-2026'), ' para ', valor(saude+'efetiva-consolidada-sem-prr-2027'), ', uma variação de ', valor(saude+'efetiva-consolidada-sem-prr-variacao'), '.'],
       ['Consolidated effective expenditure without the RRP goes from ', valor(saude+'efetiva-consolidada-sem-prr-2026'), ' to ', valor(saude+'efetiva-consolidada-sem-prr-2027'), ', a change of ', valor(saude+'efetiva-consolidada-sem-prr-variacao'), '.'])],
    [p('Há duas diferenças de perímetro: a despesa total ou a efetiva, e a despesa com ou sem o PRR. Para ver a diferença que o PRR faz, compara-se a variação da despesa efetiva consolidada com a da despesa efetiva consolidada sem o PRR.', 'There are two differences of scope: total or effective expenditure, and expenditure with or without the RRP. To see the difference the RRP makes, compare the change in consolidated effective expenditure with the change in consolidated effective expenditure without the RRP.')],
    [p('O quadro dá variações de sinal contrário conforme o perímetro da despesa; comparar exige dizer que medida se usa em cada caso.', 'The table gives changes of opposite sign depending on the scope of expenditure; comparing requires saying which measure is used in each case.')],
    [p('Quem cita o orçamento da Saúde diz o perímetro: a despesa total ou a efetiva, com ou sem o PRR.', 'Whoever quotes the Health budget states the scope: total or effective expenditure, with or without the RRP.')],
    [p('A apresentação pública devia dar o mesmo destaque à despesa total consolidada e à despesa efetiva consolidada, com e sem o PRR. Dizer só a conta que sobe, ou só a que desce, é escolher o que o leitor fica a pensar.', 'Public presentation should give the same prominence to total consolidated expenditure and to consolidated effective expenditure, with and without the RRP. Giving only the count that rises, or only the one that falls, is choosing what the reader is left thinking.')],
  ]),
  item('parcerias-rodoviarias', ['As parcerias rodoviárias: a afirmação e os valores do relatório', "The road partnerships: the statement and the report's figures"], [PCP], [
    [p(['«', excerto(PCP), '», ', atribuicao(PCP), ', na Assembleia da República, a ', periodo(PCP), '.'], ['«', excerto(PCP), '», ', atribuicao(PCP), ', in the Assembleia da República, on ', periodo(PCP), '.'])],
    [p(['O quadro ', {verbatim:'origem-v2a-ppp-setores-quadro'}, ' do relatório do Orçamento, as parcerias público-privadas, ', periodo(ppp+'total-encargos-liquidos-2027'), ', em milhões de euros.'], ['Table ', {verbatim:'origem-v2a-ppp-setores-quadro'}, ' of the Budget report, the public-private partnerships, ', periodo(ppp+'total-encargos-liquidos-2027'), ', in million euros.']),
     p(['Os encargos brutos do setor rodoviário são ', valor(ppp+'rodoviario-encargos-brutos-2027'), '; as receitas, ', valor(ppp+'rodoviario-receitas-2027'), '; os encargos líquidos, ', valor(ppp+'rodoviario-encargos-liquidos-2027'), '. O total líquido impresso para todos os setores das parcerias é ', valor(ppp+'total-encargos-liquidos-2027'), '. ', literal(ppp+'total-encargos-liquidos-2027', 'ressalva'), ' O quadro diz que os valores são de caixa e, quando aplicável, incluem o IVA.'],
       ['Gross charges for the road sector are ', valor(ppp+'rodoviario-encargos-brutos-2027'), '; revenue, ', valor(ppp+'rodoviario-receitas-2027'), '; net charges, ', valor(ppp+'rodoviario-encargos-liquidos-2027'), '. The printed net total for all partnership sectors is ', valor(ppp+'total-encargos-liquidos-2027'), '. ', literal(ppp+'total-encargos-liquidos-2027', 'ressalva'), ' The table says the values are on a cash basis and, where applicable, include VAT.'])],
    [p(['Nenhum dos quatro valores acima é igual a ', valor(PCP), ' milhões de euros.'], ['None of the four values above equals ', valor(PCP), ' million euros.'])],
    [p('O excerto citado não diz se o encargo é bruto ou líquido, nem a que ano se refere.', 'The quoted excerpt does not say whether the charge is gross or net, nor which year it refers to.')],
    [p('Quem cita um encargo com as parcerias diz o quadro, o ano e se é bruto ou líquido.', 'Whoever quotes a charge for the partnerships states the table, the year and whether it is gross or net.')],
    [p('Uma afirmação com um número que o quadro não imprime pede a conta que lhe deu origem; até ela ser mostrada, o leitor fica com os valores do quadro, os brutos, as receitas e os líquidos, sem escolher nenhum deles como o sentido da afirmação.', "A statement with a number the table does not print calls for the calculation behind it; until it is shown, the reader is left with the table's values, gross, revenue and net, without picking any of them as the meaning of the statement.")],
  ]),
];
