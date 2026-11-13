/**
 * As duas naturezas de uma entrada do registo.
 *
 * Não são a mesma coisa e não se mostram da mesma maneira:
 *
 *   correcao      — o valor publicado estava ERRADO. É uma confissão, e é a
 *                   razão de o registo existir. Conta para «N correções
 *                   publicadas».
 *   atualizacao  — o valor publicado estava CERTO e deixou de estar, porque
 *                   aquilo que mede mudou. Não é um erro, e não conta.
 *   proveniencia  — o valor NÃO mudou; mudou a maneira de lá chegar. Uma fonte
 *                   que muda de endereço é o caso típico. Traz um campo a mais,
 *                   `field`, que diz QUAL o campo de proveniência que mudou —
 *                   e `old_value`/`new_value` são os valores desse campo, não
 *                   os do número publicado. Não conta para as correções nem
 *                   para as actualizações: dizer «o valor mudou de X para X»
 *                   era o que a natureza `atualizacao` obrigava a escrever, e
 *                   era falso. Ver ledger/README.md e DECISIONS §1.36.
 *
 * Misturar as duas faria do registo um diário de alterações, e uma confissão
 * diluída vale menos. Ver DECISIONS §1.11.
 *
 * Os identificadores levam a grafia que a direção fixou (`atualizacao`);
 * os rótulos visíveis levam a grafia do texto publicado («atualização»).
 * O portão aceita, para cada natureza, o identificador ou um dos seus rótulos —
 * e mais nada. Uma entrada rotulada «atualização» com `kind: correcao` no
 * livro-razão falha o build.
 */

export const KINDS_DO_LIVRO = /** @type {const} */ (['correcao', 'atualizacao', 'proveniencia']);

export const KINDS = /** @type {const} */ ([...KINDS_DO_LIVRO, 'texto', 'texto_atualizado']);

/** As naturezas que o registo do Método lista uma a uma. Ver RegistoCorrecoes. */
export const KINDS_NO_REGISTO = ['correcao', 'atualizacao'];

/**
 * Os campos de proveniência que uma revisão pode nomear. Lista fechada: um
 * `field` escrito à mão («endereço», «url») passaria a parecer um campo e não
 * seria nenhum.
 */
export const CAMPOS_DE_PROVENIENCIA = /** @type {const} */ ([
  'source',
  'source_url',
  'document.title',
  'document.edition',
  'document.locator',
  'access_date',
  'excerpt',
]);

/** @type {Record<string, ParDeLinguas>} */
export const KIND_LABELS = {
  texto_atualizado: { pt: 'Estudo atualizado', en: 'Study updated' },
  texto: { pt: 'Estudo corrigido', en: 'Study corrected' },
  correcao: { pt: 'correção', en: 'correction' },
  atualizacao: { pt: 'atualização', en: 'update' },
  proveniencia: { pt: 'revisão de proveniência', en: 'provenance revision' },
};

/**
 * Todas as formas que o portão aceita ver renderizadas para uma natureza.
 *
 * @param {string} kind
 */
export function renderizacoesAceites(kind) {
  const labels = KIND_LABELS[kind];
  if (!labels) return [];
  return [kind, ...Object.values(labels)];
}

/** Correções do texto dos estudos. Uma entrada por estudo e data, com as duas línguas. */
export const CORRECOES_TEXTO = [
  {"kind": "texto", "slug": "orcamento-2027-o-que-muda-e-para-quem", "data": "2026-11-13", "frase": {"pt": "O resumo e uma conclusão davam a dez linhas do quadro das medidas o peso de todas as medidas já em vigor, que o relatório soma noutro quadro e num valor maior; o texto dizia que nem o relatório nem a Unidade Técnica de Apoio Orçamental (UTAO) punham essas dez linhas dentro desse conjunto, e o relatório põe, e dava como cálculo da UTAO um total que é do Ministério das Finanças; duas frases davam toda a receita de IRS dos aumentos aos salários do Estado, quando as fontes a dão para salários e pensões, e a percentagem calculada sobre ela saiu; duas frases apresentavam a UTAO a dizer mais do que o seu documento escreve; duas chamavam «todas as medidas» às principais medidas do quadro; os saldos da União Europeia traziam a data de atualização do ficheiro da dívida; e a frase do Partido Comunista Português (PCP) sobre a receita do IRC estava posta ao lado do impacto das medidas, e passou a estar ao lado da receita fiscal que o relatório prevê.", "en": "The summary and one conclusion gave ten rows of the table of measures the weight of all the measures already in force, which the report adds up in another table and at a larger figure; the text said that neither the report nor the Unidade Técnica de Apoio Orçamental (UTAO) placed those ten rows inside that set, and the report does, and it presented as UTAO's calculation a total that is the Ministry of Finance's; two sentences gave all the income-tax revenue from the increases to State wages, when the documents give it for wages and pensions, and the percentage calculated on it was removed; two sentences presented UTAO as saying more than its document writes; two called «all the measures» what are the table's main measures; the European Union balances carried the update date of the debt file; and the sentence of the Portuguese Communist Party (PCP) on corporate income tax revenue was set beside the impact of the measures, and is now set beside the tax revenue the report forecasts."}},
  {"kind": "texto_atualizado", "slug": "orcamento-2027-o-que-muda-e-para-quem", "data": "2026-11-13", "frase": {"pt": "O Parlamento mudou o calendário da discussão do Orçamento na especialidade, e o estudo passou a dizer as datas novas.", "en": "Parliament changed the calendar for the detailed discussion of the Budget, and the study now gives the new dates."}},
  {"kind": "texto", "slug": "penalizacoes-por-reforma-antecipada-2026", "data": "2026-11-13", "frase": {"pt": "O texto chamava «justa» e «correta» à redução que o relatório calcula como atuarialmente neutra, numa estimativa que ele próprio diz preliminar, e apresentava-a como o custo da antecipação para as contas públicas, que o relatório não mede; dizia que o resultado não tinha sido noticiado, o que era falso; dizia que o relatório recomenda três coisas, quando ele enumera sete; dizia, sem fonte, que o princípio do relatório não estava em vigor e que a diferença era «apenas cobrada»; a lista de quem escapa ao fator de sustentabilidade não tinha o regime de antecipação por deficiência; e a comparação vale só para a reforma antecipada pelo regime de flexibilização, o que o estudo e o cartão passaram a dizer.", "en": "The text called «fair» and «correct» the reduction the report calculates as actuarially neutral, in an estimate the report itself calls preliminary, and presented it as the cost of early retirement to the public accounts, which the report does not measure; it said the result had not been reported in the press, which was false; it said the report recommends three things, when it lists seven; it said, with no document behind it, that the report's principle was not in force and that the difference was only charged; the list of those who escape the sustainability factor lacked the early-retirement scheme for disability; and the comparison holds only for early retirement under the flexibilisation scheme, which the study and the card now say."}},
  {"kind": "texto_atualizado", "slug": "penalizacoes-por-reforma-antecipada-2026", "data": "2026-11-13", "frase": {"pt": "O ficheiro do relatório que está em linha deixou de ser igual, byte a byte, à cópia que foi lida: mudou a linha do DOI. O estudo passou a dizê-lo.", "en": "The report file now online is no longer byte-for-byte the copy that was read: the DOI line changed. The study now says so."}},
  {"kind": "texto_atualizado", "slug": "a-casa-em-portugal-e-na-europa", "data": "2026-11-13", "frase": {"pt": "O Eurostat e o Banco de Portugal reviram números que este estudo usa: o índice real dos preços das casas, a sobrecarga do custo da habitação na União Europeia, por regime de ocupação e nos jovens, e as novas operações de crédito à habitação de agosto. O Eurostat mudou também a base do rácio entre os preços e o rendimento e publicou mais um ano; o estudo passou a dizer a subida desse rácio entre dois anos, e a comparação com a média de longo prazo no ano mais recente.", "en": "Eurostat and the Bank of Portugal revised figures this study uses: the real house price index, the housing cost overburden rate in the European Union, by tenure and among the young, and August's new housing loan operations. Eurostat also changed the base of the price-to-income ratio and published one more year; the study now gives the rise of that ratio between two years, and the comparison with the long-term average in the latest year."}},
  {"kind": "texto", "slug": "a-casa-em-portugal-e-na-europa", "data": "2026-11-13", "frase": {"pt": "Uma conclusão dizia que o problema da habitação é o de quem entra agora no mercado, os jovens e quem chega, o que nenhum número do estudo mede, e entre os jovens a sobrecarga é menor em Portugal do que na União; o título de outra dizia que o que o Estado faz é pequeno e que nenhum documento seu o mede, quando o relatório do Orçamento conta casas e beneficiários, e o que nem ele nem o comunicado do Conselho de Ministros fazem é avaliar o efeito nos preços ou nas rendas; a frase do primeiro-ministro sobre os custos nas cidades estava posta ao lado do índice nacional dos preços como se medissem o mesmo, e o texto dizia que nenhuma fonte dava a subida por cidade, quando o Instituto Nacional de Estatística (INE) publica a variação dos preços por município; o texto dizia que o relatório do Orçamento não define «invariante», e ele descreve-o; o preço e a renda por metro quadrado apareciam sem dizer que são medianas, e o crédito novo sem dizer que inclui renegociações; e o nome de um autarca aparecia só dentro do título de uma notícia, sem nenhum ato seu, e o estudo passou a citar o outro título que o jornal dá à mesma notícia.", "en": "One conclusion said that the housing problem is that of those entering the market now, the young and those who arrive, which no number in the study measures, and among the young overburden is lower in Portugal than in the Union; the heading of another said that what the State does is small and that none of its documents measures it, when the Budget report counts homes and beneficiaries, and what neither it nor the Council of Ministers communiqué does is assess the effect on prices or rents; the Prime Minister's sentence on costs in the cities was set beside the national price index as if they measured the same thing, and the text said that no document gave the rise by city, when Statistics Portugal (INE) publishes the change in prices by municipality; the text said that the Budget report does not define «invariante», and it describes it; the price and the rent per square metre appeared without saying they are medians, and the new lending without saying it includes renegotiations; and the name of a mayor appeared only inside the headline of a news report, with no act of his own, and the study now cites the other title the newspaper gives the same report."}},

  {"kind": "texto_atualizado", "slug": "evora-contas-da-camara-2010-2025", "data": "2026-11-13", "frase": {"pt": "Saiu a remissão para um estudo que deixou o arquivo; nenhum número nem nenhuma conclusão mudou.", "en": "The reference to a study that left the archive came out; no number and no conclusion changed."}},
  {"kind": "texto_atualizado", "slug": "evora-2027-capital-europeia-da-cultura", "data": "2026-11-13", "frase": {"pt": "Saiu a remissão para um estudo que deixou o arquivo; nenhum número nem nenhuma conclusão mudou.", "en": "The reference to a study that left the archive came out; no number and no conclusion changed."}},
  { kind: 'texto', slug: 'orcamento-2027-o-que-muda-e-para-quem', data: '2026-11-02', frase: {
    pt: "Cinco citações apresentavam o primeiro-ministro e o Partido Socialista (PS) a dizer palavras que são o relato da comunicação do Governo e da página do partido; passaram a nomear esse documento, e uma frase sobre o emprego público deixou de apresentar a Unidade Técnica de Apoio Orçamental (UTAO) com os dados da Direção-Geral da Administração e do Emprego Público (DGAEP).",
    en: "Five quotations presented the Prime Minister and the Socialist Party (Partido Socialista, PS) as saying words that are the account given by the Government's communication and by the party's web page; they now name that document, and a sentence on public employment no longer presents the Unidade Técnica de Apoio Orçamental (UTAO) as using the data of the Directorate-General for Administration and Public Employment (DGAEP).",
  } },
  { kind: 'texto', slug: 'a-casa-em-portugal-e-na-europa', data: '2026-11-03', frase: {
    pt: "Três contagens da imprensa sobre a intervenção policial no Porto apareciam como palavras da organização, da Polícia de Segurança Pública (PSP) e do comandante dos bombeiros, a do movimento aparecia sem o «pelo menos» com que a notícia a dá, e uma frase dizia que os acampados tinham escrito o que uma notícia lhes atribui; são o relato de notícias, e as frases passaram a nomeá-las.",
    en: "Three press counts on the police intervention in Porto appeared as the words of the organisers, of the Public Security Police (PSP) and of the fire brigade's commander, the movement's count appeared without the «pelo menos» (at least) with which the report gives it, and a sentence said the campers had written what a news report attributes to them; they are news reports' accounts, and the sentences now name them.",
  } },
  { kind: 'texto_atualizado', slug: 'evora-2027-prometido-painel-dinheiro', data: '2026-11-08', frase: {
    pt: 'Saíram as frases em que o estudo falava de si próprio; nenhum número nem nenhuma conclusão mudou.',
    en: 'The sentences in which the study talked about itself came out; no number and no conclusion changed.',
  } },
  { kind: 'texto_atualizado', slug: 'evora-economia-e-dinheiro-publico-de-fora-da-camara', data: '2026-11-08', frase: {
    pt: 'Saíram as frases em que o estudo falava de si próprio; nenhum número nem nenhuma conclusão mudou.',
    en: 'The sentences in which the study talked about itself came out; no number and no conclusion changed.',
  } },
  { kind: 'texto_atualizado', slug: 'evora-orcamentado-pago-devido-2025', data: '2026-11-08', frase: {
    pt: 'Saíram as frases em que o estudo falava de si próprio; nenhum número nem nenhuma conclusão mudou.',
    en: 'The sentences in which the study talked about itself came out; no number and no conclusion changed.',
  } },
  { kind: 'texto_atualizado', slug: 'evora-prometido-pago-auditado-2026', data: '2026-11-08', frase: {
    pt: 'Saíram as frases em que o estudo falava de si próprio; nenhum número nem nenhuma conclusão mudou.',
    en: 'The sentences in which the study talked about itself came out; no number and no conclusion changed.',
  } },
  { kind: 'texto_atualizado', slug: 'evora-economia-investidores-portas-abertas-2026', data: '2026-11-08', frase: {
    pt: 'Saíram as frases em que o estudo falava de si próprio; nenhum número nem nenhuma conclusão mudou.',
    en: 'The sentences in which the study talked about itself came out; no number and no conclusion changed.',
  } },
  {"kind":"texto","slug":"onde-esta-a-agua","data":"2026-11-08","frase":{"pt":"O rácio entre o encargo médio de um utilizador doméstico por metro cúbico, ao consumo de referência da ERSAR, e a tarifa do Alqueva para a rega nos blocos de rega passou de 27 a 53 vezes para 19 a 35 vezes, com o nível médio de encargos da ERSAR de 2024 e as tarifas do Alqueva de 2026, que a edição inglesa dizia não encontradas e estão no edital da EDIA; o encargo de conservação passou aos valores do mesmo edital; a auditoria do Tribunal de Contas de 2016 entrou na edição inglesa; o total nacional de barragens do resumo dos planos de bacia entrou na edição portuguesa; os valores de um boletim semanal da APA que já não se consegue ler saíram, com as marcas de valor por confirmar; a eficiência na adução e distribuição dos aproveitamentos hidroagrícolas passou ao valor da DGADR, 76 %, sem a média ponderada de cerca de 95 %; e os 71 % de agricultores sem contador passaram a dizer de que inquérito são e a quem se aplicam.","en":"The ratio between a household's average charge per cubic metre at ERSAR's reference consumption and Alqueva's irrigation tariff in the irrigation blocks went from 27 to 53 times to 19 to 35 times, using ERSAR's 2024 average charge level and the 2026 Alqueva tariffs, which the English edition said had not been found and are in EDIA's edital; the conservation charge moved to the values in the same edital; the Tribunal de Contas' 2016 audit entered the English edition; the national dam total from the river basin plans' summary entered the Portuguese edition; the values from an APA weekly bulletin that can no longer be read came out, with the markers of values still to be confirmed; conveyance and distribution efficiency in the irrigation schemes moved to DGADR's figure, 76 %, without the weighted average of about 95 %; and the 71 % of farmers without a meter now say which survey they come from and whom they cover."},"partes":{"pt":["O rácio entre o encargo médio de um utilizador doméstico por metro cúbico, ao consumo de referência da ERSAR, e a tarifa do Alqueva para a rega nos blocos de rega passou de ",{"claim":"coragua-historico-racio-minimo"}," a ",{"claim":"coragua-historico-racio-maximo"}," vezes para ",{"claim":"coragua-racio-minimo-2026"}," a ",{"claim":"coragua-racio-maximo-2026"}," vezes, com o nível médio de encargos da ERSAR de ",{"data":{"id":"coragua-ersar-encargo-mensal-2024","campo":"reference_date","valor":"2024"}}," e as tarifas do Alqueva de ",{"data":{"id":"coragua-alqueva-alta-pressao-2026","campo":"reference_date","valor":"2026"}},", que a edição inglesa dizia não encontradas e estão no edital da EDIA; o encargo de conservação passou aos valores do mesmo edital","; a auditoria do Tribunal de Contas de ",{"data":{"id":"coragua-tc-auditoria-ano","campo":"reference_date","valor":"2016"}}," entrou na edição inglesa; o total nacional de barragens do resumo dos planos de bacia entrou na edição portuguesa; os valores de um boletim semanal da APA que já não se consegue ler saíram, com as marcas de valor por confirmar; a eficiência na adução e distribuição dos aproveitamentos hidroagrícolas passou ao valor da DGADR, ",{"claim":"coragua-dgadr-eficiencia-2024"}," %, sem a média ponderada de cerca de ",{"claim":"coragua-historico-eficiencia-95"}," %; e os ",{"claim":"coragua-gulbenkian-sem-contador"}," % de agricultores sem contador passaram a dizer de que inquérito são e a quem se aplicam."],"en":["The ratio between a household's average charge per cubic metre at ERSAR's reference consumption and Alqueva's irrigation tariff in the irrigation blocks went from ",{"claim":"coragua-historico-racio-minimo"}," to ",{"claim":"coragua-historico-racio-maximo"}," times to ",{"claim":"coragua-racio-minimo-2026"}," to ",{"claim":"coragua-racio-maximo-2026"}," times, using ERSAR's ",{"data":{"id":"coragua-ersar-encargo-mensal-2024","campo":"reference_date","valor":"2024"}}," average charge level and the ",{"data":{"id":"coragua-alqueva-alta-pressao-2026","campo":"reference_date","valor":"2026"}}," Alqueva tariffs, which the English edition said had not been found and are in EDIA's edital; the conservation charge moved to the values in the same edital","; the Tribunal de Contas' ",{"data":{"id":"coragua-tc-auditoria-ano","campo":"reference_date","valor":"2016"}}," audit entered the English edition; the national dam total from the river basin plans' summary entered the Portuguese edition; the values from an APA weekly bulletin that can no longer be read came out, with the markers of values still to be confirmed; conveyance and distribution efficiency in the irrigation schemes moved to DGADR's figure, ",{"claim":"coragua-dgadr-eficiencia-2024"}," %, without the weighted average of about ",{"claim":"coragua-historico-eficiencia-95"}," %; and the ",{"claim":"coragua-gulbenkian-sem-contador"}," % of farmers without a meter now say which survey they come from and whom they cover."]}},
  {"kind":"texto","slug":"agua-nao-faturada","data":"2026-11-08","frase":{"pt":"A eficiência na adução e distribuição dos aproveitamentos hidroagrícolas passou ao valor que a DGADR publica, 76 %, sem a média ponderada de 83 a 85 % que era uma conta deste estudo; os 71 % de agricultores sem contador passaram a dizer que vêm de um inquérito da Gulbenkian feito em 2019 a quem rega explorações de 5 hectares ou mais, e não de 2021; e os valores do PRR passaram a ter a data do instantâneo de onde vêm, com os dados da edição inglesa iguais aos da portuguesa.","en":"Conveyance and distribution efficiency in the irrigation schemes moved to the figure DGADR publishes, 76 %, without the 83 to 85 % weighted average that was this study's own calculation; the 71 % of farmers without a meter now say they come from a Gulbenkian survey carried out in 2019 among those who irrigate holdings of 5 hectares or more, not from 2021; and the PRR values now carry the date of the snapshot they come from, with the English edition's data the same as the Portuguese edition's."},"partes":{"pt":["A eficiência na adução e distribuição dos aproveitamentos hidroagrícolas passou ao valor que a DGADR publica, ",{"claim":"coragua-dgadr-eficiencia-2024"}," %, sem a média ponderada de ",{"claim":"coragua-historico-eficiencia-83"}," a ",{"claim":"coragua-historico-eficiencia-85"}," % que era uma conta deste estudo; os ",{"claim":"coragua-gulbenkian-sem-contador"}," % de agricultores sem contador passaram a dizer que vêm de um inquérito da Gulbenkian feito em ",{"data":{"id":"coragua-gulbenkian-inquerito-ano","campo":"reference_date","valor":"2019"}}," a quem rega explorações de ",{"claim":"coragua-gulbenkian-universo-hectares"}," hectares ou mais, e não de ",{"claim":"coragua-historico-inquerito-2021"},"; e os valores do PRR passaram a ter a data do instantâneo de onde vêm, com os dados da edição inglesa iguais aos da portuguesa."],"en":["Conveyance and distribution efficiency in the irrigation schemes moved to the figure DGADR publishes, ",{"claim":"coragua-dgadr-eficiencia-2024"}," %, without the ",{"claim":"coragua-historico-eficiencia-83"}," to ",{"claim":"coragua-historico-eficiencia-85"}," % weighted average that was this study's own calculation; the ",{"claim":"coragua-gulbenkian-sem-contador"}," % of farmers without a meter now say they come from a Gulbenkian survey carried out in ",{"data":{"id":"coragua-gulbenkian-inquerito-ano","campo":"reference_date","valor":"2019"}}," among those who irrigate holdings of ",{"claim":"coragua-gulbenkian-universo-hectares"}," hectares or more, not from ",{"claim":"coragua-historico-inquerito-2021"},"; and the PRR values now carry the date of the snapshot they come from, with the English edition's data the same as the Portuguese edition's."]}},
  {"kind": "texto", "slug": "evora-quinze-anos-cinco-mandatos", "data": "2026-11-08", "frase": {"pt": "O nome legal do presidente interino aparecia com uma marca de valor por confirmar; passou a dizer que está por confirmar na fonte.", "en": "The interim Câmara president's legal name appeared with a marker of a value still to be confirmed; it now says it is yet to be confirmed in the source."}},
  {"kind": "texto", "slug": "alentejo-algarve", "data": "2026-11-08", "frase": {"pt": "Uma frase sobre o que não se apurou trazia uma marca de valor por confirmar; a marca saiu.", "en": "A sentence on what was not established carried a marker of a value still to be confirmed; the marker came out."}},

];

/** História do ensaio, conservada apenas para conferir a contagem selada. */
export const CORRECOES_TEXTO_ENSAIO = [
  { kind: 'texto_atualizado', slug: 'evora-2027-capital-europeia-da-cultura', data: '2026-11-03', frase: {
    pt: 'Entraram as decisões de outubro da Câmara e da Assembleia Municipal de Évora sobre o Rossio de São Brás, e um licenciamento de obras de conservação requerido pela associação.',
    en: "The October decisions of Évora's Câmara and Assembleia Municipal on the Rossio de São Brás, and a licence for conservation works requested by the association, were added.",
  } },
  { kind: 'texto', slug: 'evora-2027-capital-europeia-da-cultura', data: '2026-11-06', frase: {
    pt: 'A frase sobre o dinheiro do Rossio de São Brás contava dois financiamentos que nenhum documento conta; passou a dizer só o que cada nota da Câmara nomeia.',
    en: "The sentence on the Rossio de São Brás funding counted two financings that no document counts; it now says only what each of the Câmara's notes names.",
  } },
  { kind: 'texto_atualizado', slug: 'evora-2027-capital-europeia-da-cultura', data: '2026-11-08', frase: {
    pt: 'Saíram as frases em que o estudo falava de si próprio; nenhum número nem nenhuma conclusão mudou.',
    en: 'The sentences in which the study talked about itself came out; no number and no conclusion changed.',
  } },
  { kind: 'texto', slug: 'evora-contas-da-camara-2010-2025', data: '2026-10-30', datas: {'2025':'evora-receita-cobrada-2025','2024':'evora-contas-2024-votos-contra'}, frase: {
    pt: "Quatro passagens diziam como facto causas que o relatório de contas de 2025 da Câmara apresenta como leitura ou como explicação parcial; passaram a dizê-lo assim, com a ressalva de que o valor do investimento de 2024 é o que o relatório de 2025 imprime como comparativo, porque as contas de 2024 nunca foram certificadas, e com a explicação de que a receita se compara com o orçamento depois das modificações do ano.",
    en: "Four passages stated as fact causes that the Câmara's 2025 accounts report presents as a reading or as a partial explanation; they now say so, with the caveat that the 2024 investment value is the one the 2025 report prints as a comparative, because the 2024 accounts were never certified, and with the explanation that revenue is compared with the budget after the year's modifications.",
  } },
  { kind: 'texto_atualizado', slug: 'evora-contas-da-camara-2010-2025', data: '2026-11-08', frase: {
    pt: 'Saíram as frases em que o estudo falava de si próprio; nenhum número nem nenhuma conclusão mudou.',
    en: 'The sentences in which the study talked about itself came out; no number and no conclusion changed.',
  } },
];
