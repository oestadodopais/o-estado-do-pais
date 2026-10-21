/**
 * A AUDITORIA DAS PALAVRAS DA EXPLICAÇÃO DE 2027 (bloco EX4, 21.10.2026), escrita por guião na secção «explicacoes» de
 * `tests/cartao/leituras-provadas.json`, que a célula X (X1 e X2, `tests/explicacoes/explicacao.mjs`) confere.
 *
 * Cada folha de texto da declaração tem as suas partes: as que só têm pontuação e palavras da lista fechada são
 * «liga» por esta conta; os sufixos dos valores apoiam-se na unidade (ou, nas parcelas e nas variações, na derivação)
 * da própria linha; as palavras dos ramos decididos pelos números são «conta»; as outras estão abaixo, à mão, cada uma
 * com os seus apoios (um literal de um campo selado de uma linha que a explicação nomeia, ou de uma origem declarada).
 * Uma folha sem regra fecha o guião. Corre-se com `node design/especime-v3/medicoes/ex4-2026-10-21/auditoria-ex4.mjs`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { folhasDaExplicacao } from '../../../../tests/explicacoes/explicacao.mjs';
import { EXPLICACOES } from '../../../../src/data/explicacoes/index.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const AUDITORIA = path.join(RAIZ, 'tests', 'cartao', 'leituras-provadas.json');
const SLUG = 'dinheiro-do-estado-2027';
const e = /** @type {any} */ (EXPLICACOES.find((x) => x.slug === SLUG));

const T27 = 'oe-2027-despesa-total-mapa', T26 = 'oe-2026-despesa-total-mapa', CONS27 = 'oe-2027-despesa-total-consolidada-mapa';
const DIV27 = 'oe-2027-despesa-subfuncao-01-7-mapa', SD27 = 'oe-2027-despesa-sem-divida-mapa', SD26 = 'oe-2026-despesa-sem-divida-mapa';
const VT = 'der-oe2027-despesa-total-mapa-variacao-pct', ENT = 'oe-2027-calendario-entrega', PS = 'oe-2027-saude-despesa-total-consolidada-2027';
const E07 = 'oe-2027-despesa-funcao-07-mapa', B26 = 'oe-2026-cem-euros-funcao-01';
const F = (/** @type {string} */ n) => `oe-2027-cem-euros-funcao-${n}-mapa`, S = (/** @type {string} */ n) => `oe-2027-cem-euros-funcao-${n}-sem-divida-mapa`, V = (/** @type {string} */ n) => `der-oe2027-funcao-${n}-variacao-pct`;
const L = (/** @type {string} */ linha, /** @type {string} */ campo, /** @type {string} */ literal) => ({ linha, campo, literal });
const O = (/** @type {string} */ origem, /** @type {string} */ campo, /** @type {string} */ literal) => ({ origem, campo, literal });
const diz = (/** @type {string} */ pt, /** @type {string} */ en, /** @type {any[]} */ apoios) => ({ pt, en, classe: 'diz', apoios });
const leitura = (/** @type {string} */ pt, /** @type {string} */ en, /** @type {string} */ sobre, /** @type {any[]} */ apoios) => ({ pt, en, classe: 'leitura', sobre, apoios });
const leva = [L(F('07'), 'derivation', 'Dividir a despesa desta função')];

/** As folhas que pedem regra própria, pelo caminho. Uma folha inteira numa parte, salvo onde a frase junta duas coisas. */
const REGRAS = {
  'titulo[0]': (f) => [diz(f.pt, f.en, [L(T27, 'document.title', 'classificação funcional das despesas')])],
  'titulo[2]': (f) => [diz(f.pt, f.en, [L(ENT, 'excerpt', 'Proposta de Lei'), L(ENT, 'excerpt', 'que aprova o Orçamento do Estado para')])],
  'abertura[0][0]': (f) => [diz(f.pt, f.en, [L(ENT, 'excerpt', 'Proposta de Lei'), L(ENT, 'excerpt', 'Orçamento do Estado para')])],
  'abertura[0][2]': (f) => [diz(f.pt, f.en, [L(ENT, 'excerpt', 'foi entregue ao Presidente da Assembleia da República')])],
  'abertura[0][4]': () => [
    diz(', traz, entre os seus mapas, o da classificação funcional das despesas da Administração Central.', ', carries, among its maps, the one of the functional classification of central administration expenditure.', [L(T27, 'document.title', 'Mapa relativo à classificação funcional das despesas do subsetor da Administração Central')]),
    diz(' Esse mapa soma ', ' That map adds up to ', [L(T27, 'name', 'DESPESA TOTAL'), L(T27, 'document.locator', 'linha «DESPESA TOTAL»')]),
  ],
  'abertura[0][8]': () => [
    diz(' desse total são a subfunção a que o mapa chama «operações relacionadas com a dívida pública».', ' of that total are the subfunction the map calls «operations related to public debt».', [L(DIV27, 'document.locator', 'coluna «POR SUBFUNÇÕES»'), L(DIV27, 'name', 'OPERAÇÕES RELACIONADAS COM A DÍVIDA PÚBLICA')]),
    diz(' Tirando essa subfunção, sobram ', ' Taking that subfunction out, ', [L(SD27, 'derivation', 'A despesa total do Mapa 2 menos a subfunção 01.7')]),
  ],
  'abertura[0][10]': (f) => [diz(f.pt, f.en, [L(S('07'), 'derivation', 'pela despesa total do Mapa 2 menos a subfunção 01.7, multiplicar por cem')])],
  'abertura[0][12]': (f) => [diz(f.pt, f.en, [L(S('07'), 'derivation', 'Dividir a despesa desta função')])],
  'seccoes[0].titulo': (f) => [diz(f.pt, f.en, [L(E07, 'document.locator', 'coluna «POR FUNÇÕES»'), L(F('07'), 'derivation', 'pela DESPESA TOTAL do mesmo Mapa 2')])],
  'seccoes[0].conteudo[0].figura.titulo': (f) => [diz(f.pt, f.en, [L(F('01'), 'derivation', 'pela DESPESA TOTAL do mesmo Mapa 2'), L(T27, 'document.title', 'classificação funcional das despesas do subsetor da Administração Central'), L(DIV27, 'name', 'OPERAÇÕES RELACIONADAS COM A DÍVIDA PÚBLICA')])],
  'seccoes[0].conteudo[1].paragrafo[0]': (f) => [diz(f.pt, f.en, [L(F('01'), 'derivation', 'pela DESPESA TOTAL do mesmo Mapa 2')])],
  'seccoes[0].conteudo[1].paragrafo[2]': (f) => [diz(f.pt, f.en, [L(F('01'), 'derivation', 'multiplicar por cem')])],
  'seccoes[0].conteudo[1].paragrafo[4]': (f) => [diz(f.pt, f.en, [L(DIV27, 'excerpt', '01.7 OPERAÇÕES RELACIONADAS COM A DÍVIDA PÚBLICA'), L(S('01'), 'derivation', 'na função 01, a função menos a subfunção 01.7')])],
  'seccoes[0].conteudo[1].paragrafo[6]': (f) => [diz(f.pt, f.en, leva)],
  'seccoes[0].conteudo[1].paragrafo[22]': (f) => [diz(f.pt, f.en, leva)],
  'seccoes[1].titulo': (f) => [diz(f.pt, f.en, [L(SD27, 'derivation', 'menos a subfunção 01.7'), L(DIV27, 'name', 'OPERAÇÕES RELACIONADAS COM A DÍVIDA PÚBLICA')])],
  'seccoes[1].conteudo[0].figura.titulo': (f) => [diz(f.pt, f.en, [L(SD27, 'derivation', 'A despesa total do Mapa 2 menos a subfunção 01.7'), L(S('03'), 'derivation', 'Dividir a despesa desta função'), L(DIV27, 'name', 'OPERAÇÕES RELACIONADAS COM A DÍVIDA PÚBLICA')])],
  'seccoes[1].conteudo[1].paragrafo[0]': () => [
    leitura('Esta conta é deste projeto: a despesa total do mapa menos a subfunção das operações relacionadas com a dívida pública', 'This calculation is this project’s: the map’s total expenditure minus the subfunction of the operations related to public debt', 'que a despesa sem a subfunção das operações relacionadas com a dívida pública é uma conta derivada pelo projeto, e não um valor que o mapa imprime', [L(SD27, 'derivation', 'A despesa total do Mapa 2 menos a subfunção 01.7, como o mapa as imprime'), L(DIV27, 'name', 'OPERAÇÕES RELACIONADAS COM A DÍVIDA PÚBLICA')]),
    diz(', e cada função a dividir por esse resto;', ', and each function divided by that remainder;', [L(S('03'), 'derivation', 'Dividir a despesa desta função')]),
    { pt: ' o recibo de cada linha mostra a conta. A ', en: ' each row’s receipt shows the calculation. ', classe: 'aponta', alvo: 'selos' },
  ],
  'seccoes[1].conteudo[1].paragrafo[2]': (f) => [diz(f.pt, f.en, [L(S('03'), 'derivation', 'Dividir a despesa desta função')])],
  'seccoes[1].conteudo[1].paragrafo[4]': (f) => [diz(f.pt, f.en, [L(S('03'), 'derivation', 'multiplicar por cem')])],
  'seccoes[2].titulo[0]': (f) => [diz(f.pt, f.en, [L(VT, 'derivation', 'Variação da proposta de 2027 sobre a lei aprovada de 2026')])],
  'seccoes[2].titulo[2]': (f) => [diz(f.pt, f.en, [L(VT, 'derivation', 'proposta de 2027 sobre a lei aprovada')])],
  'seccoes[2].titulo[4]': (f) => [diz(f.pt, f.en, [L(ENT, 'excerpt', 'Proposta de Lei')])],
  'seccoes[2].conteudo[0].paragrafo[0]': (f) => [leitura(f.pt, f.en, 'qual é a comparação certa para os valores do mapa funcional da proposta', [L(VT, 'derivation', 'no mesmo Mapa 2 (mesmo título, mesmo subsetor, mesma unidade)'), L(VT, 'derivation', 'lei aprovada de 2026')])],
  'seccoes[2].conteudo[0].paragrafo[2]': (f) => [diz(f.pt, f.en, [L(VT, 'derivation', 'mesmo título, mesmo subsetor, mesma unidade'), L(T26, 'name', 'DESPESA TOTAL')])],
  'seccoes[2].conteudo[0].paragrafo[6]': (f) => [diz(f.pt, f.en, [L(VT, 'derivation', 'Variação da proposta')])],
  'seccoes[2].conteudo[0].paragrafo[8]': (f) => [diz(f.pt, f.en, [L(SD26, 'derivation', 'menos a subfunção 01.7')])],
  'seccoes[2].conteudo[0].paragrafo[14]': (f) => [diz(f.pt, f.en, [L(V('04'), 'derivation', 'Variação da proposta de 2027 sobre a lei aprovada de 2026'), L(E07, 'unit', 'euros')])],
  'seccoes[2].conteudo[0].paragrafo[16]': (f) => [diz(f.pt, f.en, [L(V('04'), 'derivation', 'Variação')])],
  'seccoes[2].conteudo[0].paragrafo[44]': (f) => [{ pt: f.pt, en: f.en, classe: 'aponta', porta: 'estudo' }],
  'seccoes[3].titulo': (f) => [diz(f.pt, f.en, [L(E07, 'name', 'SAÚDE'), L(PS, 'document.locator', 'Saúde (PL15)')])],
  'seccoes[3].conteudo[0].paragrafo[0]': (f) => [diz(f.pt, f.en, [L(E07, 'document.locator', 'função 07')])],
  'seccoes[3].conteudo[0].paragrafo[2]': (f) => [diz(f.pt, f.en, [L(E07, 'document.title', 'Mapa relativo à classificação funcional')])],
  'seccoes[3].conteudo[0].paragrafo[4]': (f) => [leitura(f.pt, f.en, 'que a função 07 do mapa e o programa Saúde do relatório da proposta são contas diferentes', [L(PS, 'document.locator', 'Saúde (PL15), Conta do Pograma Legado'), L(E07, 'document.locator', 'função 07, coluna «POR FUNÇÕES»')])],
  'seccoes[3].conteudo[0].paragrafo[8]': () => [
    diz(': o programa é consolidado e é um programa orçamental;', ': the programme is consolidated and is a budget programme;', [L(PS, 'name', 'Despesa total consolidada'), L(PS, 'document.locator', 'Conta do Pograma Legado')]),
    leitura(' a função é uma classificação da despesa, não consolidada, que conta as transferências entre serviços.', ' the function is a classification of expenditure, unconsolidated, which counts the transfers between services.', 'o que a coluna «POR FUNÇÕES» do mapa conta, ao lado da despesa total consolidada', [L(E07, 'document.title', 'classificação funcional das despesas'), L(CONS27, 'name', 'DESPESA TOTAL CONSOLIDADA'), O('rp4n-consolidada-ministerios', 'excerto', 'exclui os fluxos intrasetoriais e intersetoriais de juros, subsídios, transferências correntes e de capital')]),
    leitura(' As duas contas medem coisas diferentes, e nenhuma está errada.', ' The two accounts measure different things, and neither is wrong.', 'a diferença entre o programa consolidado e a função não consolidada', [L(PS, 'name', 'Despesa total consolidada'), L(E07, 'document.locator', 'coluna «POR FUNÇÕES»')]),
  ],
  'naoDiz[0][0]': (f) => [leitura(f.pt, f.en, 'que a proposta não é a lei aprovada nem a despesa executada', [L(T27, 'document.locator', 'MAPA 2, ano económico de 2027'), L(ENT, 'excerpt', 'Proposta de Lei'), L(PS, 'ressalva', 'Previsão, não execução.'), L(VT, 'derivation', 'proposta de 2027 sobre a lei aprovada de 2026')])],
  'naoDiz[0][1]': () => [
    diz(' O mapa é só o subsetor da Administração Central:', ' The map is only the central administration subsector:', [L(T27, 'document.title', 'das despesas do subsetor da Administração Central')]),
    leitura(' a Segurança Social, com as pensões, tem o seu próprio mapa funcional, que não está aqui.', ' Social Security, with pensions, has its own functional map, which is not here.', 'que a Segurança Social fica fora do mapa, que é só o subsetor da Administração Central', [L(T27, 'document.title', 'Mapa relativo à classificação funcional das despesas do subsetor da Administração Central')]),
  ],
  'naoDiz[0][2].se[0]': (f) => [leitura(f.pt, f.en, 'porque a despesa total do mapa é maior do que a consolidada', [L(T27, 'name', 'DESPESA TOTAL'), L(CONS27, 'name', 'DESPESA TOTAL CONSOLIDADA'), O('rp4n-consolidada-ministerios', 'excerto', 'exclui os fluxos intrasetoriais e intersetoriais de juros, subsídios, transferências correntes e de capital')])],
  'naoDiz[0][3]': () => [
    leitura(' A conta «sem as operações relacionadas com a dívida pública» é deste projeto, declarada no recibo de cada linha;', ' The calculation «without the operations related to public debt» is this project’s, declared in each row’s receipt;', 'que as linhas sem a subfunção 01.7 são derivadas pelo projeto', [L(SD27, 'derivation', 'A despesa total do Mapa 2 menos a subfunção 01.7')]),
    diz(' o mapa só dá o nome a essa subfunção, e esta explicação não diz o que entra nela.', ' the map only names that subfunction, and this explainer does not say what goes into it.', [L(DIV27, 'excerpt', '01.7 OPERAÇÕES RELACIONADAS COM A DÍVIDA PÚBLICA')]),
    diz(' A base da explicação de ', ' The basis of the ', [L(B26, 'derivation', 'despesa efetiva consolidada desta função')]),
  ],
  'naoDiz[0][5]': (f) => [diz(f.pt, f.en, [L(B26, 'derivation', 'despesa efetiva consolidada'), O('dados-gov-oe-despesa-funcional', 'excerto', 'disponibilizados uma vez por ano após a aprovação do OE')])],
  'naoDiz[0][7]': (f) => [leitura(f.pt, f.en, 'quando a base dos dados abertos de 2027 pode existir', [O('dados-gov-oe-despesa-funcional', 'excerto', 'após a aprovação do OE na Assembleia da República')])],
};

const LIGA = { pt: new Set(['a', 'o', 'os', 'as', 'um', 'uma', 'e', 'em', 'de', 'do', 'da', 'dos', 'das', 'para', 'no', 'na', 'com', 'contra']), en: new Set(['the', 'a', 'of', 'and', 'in', 'to', 'for', 'by', 'with', 'on', 'at', 'against']) };
const soLiga = (/** @type {string} */ s, /** @type {'pt'|'en'} */ l) => s.toLowerCase().replace(/[\s.,:;()«»−%’'!?]+/g, ' ').trim().split(/\s+/).filter(Boolean).every((w) => LIGA[l].has(w));

const folhas = folhasDaExplicacao(e).map((f) => {
  const regra = /** @type {any} */ (REGRAS)[f.caminho];
  let partes;
  if (regra) partes = regra(f);
  else if (f.caminho.endsWith('.sufixo')) {
    /* O caminho da célula omite a edição e chama «se» às partes guardadas: a edição portuguesa, pela forma da declaração. */
    const passos = f.caminho.replace(/\.sufixo$/, '').match(/[^.[\]]+/g).flatMap((k, i, l) => (k === 'se' ? ['partes'] : (/^(abertura|naoDiz)$/.test(l[i - 1] ?? '') || k === 'paragrafo') ? [k, 'pt'] : [k]));
    const declaracao = passos.reduce((v, k) => v[k], e);
    const id = declaracao.claim;
    const apoio = f.pt === ' %' ? L(id, 'derivation', id.startsWith('der-') ? 'vezes cem' : 'multiplicar por cem') : L(id, 'unit', f.pt.trim());
    partes = [diz(f.pt, f.en, [apoio])];
  } else if (f.ramo && !soLiga(f.pt, 'pt')) partes = [{ pt: f.pt, en: f.en, classe: 'conta' }];
  else if (soLiga(f.pt, 'pt') && soLiga(f.en, 'en')) partes = [{ pt: f.pt, en: f.en, classe: 'liga' }];
  else throw new Error(`a folha ${f.caminho} («${f.pt}» / «${f.en}») não tem regra`);
  return { caminho: f.caminho, pt: f.pt, en: f.en, partes };
});
for (const k of Object.keys(REGRAS)) if (!folhas.some((f) => f.caminho === k)) throw new Error(`a regra ${k} não tem folha`);
const usadas = [...new Set(folhas.flatMap((f) => f.partes.flatMap((/** @type {any} */ p) => (p.apoios ?? []).map((/** @type {any} */ a) => a.origem)).filter(Boolean)))];
const entrada = {
  slug: SLUG,
  quem: 'Claude Opus 5.5, construtor do EX4 (por ler a frio)',
  quando: '2026-10-21',
  o_que: 'as folhas da declaração dinheiro-do-estado-2027, nas duas edições, escritas pelo guião design/especime-v3/medicoes/ex4-2026-10-21/auditoria-ex4.mjs',
  origens: usadas,
  folhas,
};
const a = JSON.parse(fs.readFileSync(AUDITORIA, 'utf8'));
a.explicacoes = [...a.explicacoes.filter((/** @type {any} */ x) => x.slug !== SLUG), entrada];
fs.writeFileSync(AUDITORIA, JSON.stringify(a, null, 2) + '\n');
console.log(`auditoria EX4: ${folhas.length} folhas, ${folhas.reduce((n, f) => n + f.partes.length, 0)} partes, origens ${usadas.join(', ')}`);
