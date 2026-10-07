/** JD1-b: as ressalvas da fonte não podem desaparecer numa nova redação. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { parse } from 'node-html-parser';
import { oQueEDaLinha, oQueEDaSerie, nomeNoRecibo } from '../../src/lib/o-que-e-o-numero.mjs';

const provisórias = ['juros-das-administracoes-publicas-2025', 'pib-nominal-notificacao-setembro-2025', 'juros-das-administracoes-publicas-pib-2025'];
export function estadoDaFonte(frase, lang) {
  const periodo = lang === 'pt' ? 'dois mil e vinte e cinco' : 'two thousand and twenty-five';
  const estado = lang === 'pt' ? 'provisório' : 'provisional';
  return frase.includes(periodo) && frase.includes(estado) ? [] : ['JD1-b: falta o estado provisório de 2025'];
}
let plantas = 0;
for (const id of provisórias) for (const lang of ['pt', 'en']) {
  const frase = oQueEDaLinha(id, lang).pedacos.join('');
  assert.deepEqual(estadoDaFonte(frase, lang), [], `${id}/${lang}`);
  if (process.argv.includes('--prova')) {
    const danificada = frase.replace(lang === 'pt' ? 'provisório' : 'provisional', 'final');
    assert.deepEqual(estadoDaFonte(danificada, lang), ['JD1-b: falta o estado provisório de 2025']);
    plantas++;
  }
  if (!process.argv.includes('--declaracoes')) {
    const prefixo = lang === 'pt' ? 'livro-razao' : 'en/ledger';
    const html = parse(fs.readFileSync(`dist/${prefixo}/${id}/index.html`, 'utf8'));
    assert.deepEqual(estadoDaFonte(html.querySelector('[data-o-que-e-parte="o-que-e"]').textContent, lang), [], `recibo ${id}/${lang}`);
  }
}
// A marca do INE não se estende ao agregado europeu, cujo corpo não tem status.
for (const lang of ['pt', 'en']) assert.ok(!/provis[oó]ri/.test(oQueEDaLinha('juros-das-administracoes-publicas-2025-ue', lang).pedacos.join('')));
console.log(`JD1-b: estado provisório nas três linhas INE nas duas edições; ${plantas} plantas morderam.`);

// Cada planta apaga uma distinção que mudaria o significado do número.
// Não fixa a redação inteira: exige o conceito e confere também o recibo servido.
const conceitos = [
  ['juros-das-administracoes-publicas-2024', 'despesa e pagamento', /encargo é assumido, mesmo que seja pago noutro ano/, /cost is incurred, even if it is paid in another year/],
  ['pib-nominal-notificacao-setembro-2025', 'bens e serviços finais', /bens e serviços finais produzidos/, /final goods and services produced/],
  ['juros-das-administracoes-publicas-pib-2025', 'versões das contas', /versões das contas são diferentes/, /different versions of the accounts/],
  ['juros-das-administracoes-publicas-2025-ue', 'versões das contas', /versões das contas são diferentes/, /different versions of the accounts/],
  ['juros-e-outros-encargos-execucao-2026-08', 'consolidação', /descontam-se os pagamentos entre as entidades públicas/, /payments between the public bodies covered are removed/],
  ['juros-e-outros-encargos-execucao-2025-08', 'pagamentos', /recebimentos e pagamentos ocorridos no período/, /receipts and payments during the period/],
  ['custo-do-stock-da-divida-direta-2025', 'saldo médio dos dois anos', /saldo médio da dívida direta no fim desse ano e do anterior/, /average direct debt at the end of that year and the previous one/],
  ['custo-da-divida-emitida-2026-08', 'instrumentos por extenso', /Bilhetes do Tesouro, Obrigações do Tesouro, Obrigações do Tesouro de Rendimento Variável e Medium Term Notes/, /Treasury bills, Treasury bonds, floating-rate Treasury bonds and Medium Term Notes/],
  ['divida-direta-do-estado-2026-08', 'perímetro e consolidação', /Maastricht abrange todas as administrações públicas e retira a dívida/, /Maastricht public debt covers all general government bodies and removes debt/],
  ['necessidades-brutas-de-financiamento-2025', 'amortizações e anulações', /reembolsar ou extinguir dívida/, /repay or extinguish debt/],
  ['emissoes-de-divida-fundada-2025', 'dívida fundada', /paga num ano orçamental posterior ao da contratação/, /repaid in a budget year after the year in which it was incurred/],
];
let plantasConceitos = 0;
for (const [id, conceito, pt, en] of conceitos) for (const lang of ['pt', 'en']) {
  const expressao = lang === 'pt' ? pt : en;
  const frase = oQueEDaLinha(id, lang).pedacos.join('');
  assert.ok(expressao.test(frase), `${id}/${lang}: falta ${conceito}`);
  if (process.argv.includes('--prova')) {
    assert.ok(!expressao.test(frase.replace(expressao, '')), `a planta ${conceito} não mordeu`);
    plantasConceitos++;
  }
  if (!process.argv.includes('--declaracoes')) {
    const prefixo = lang === 'pt' ? 'livro-razao' : 'en/ledger';
    const html = parse(fs.readFileSync(`dist/${prefixo}/${id}/index.html`, 'utf8'));
    assert.ok(expressao.test(html.querySelector('[data-o-que-e-parte="o-que-e"]').textContent), `recibo ${id}/${lang}: falta ${conceito}`);
  }
}
console.log(`JD1-b: distinções contabilísticas e financeiras nas duas edições; ${plantasConceitos} plantas morderam.`);

const serie = 'serie-obrigacoes-do-tesouro-10-anos-rendibilidade';
let plantasSerie = 0;
for (const lang of ['pt', 'en']) {
  const frase = oQueEDaSerie(serie, lang).pedacos.join('');
  const expressoes = lang === 'pt'
    ? [/taxa de juro anual/, /compra e venda de obrigações já emitidas/, /dez anos até ao reembolso/]
    : [/annual interest rate/, /trading of bonds already issued/, /ten years remaining until repayment/];
  let rendida = frase;
  if (!process.argv.includes('--declaracoes')) {
    const prefixo = lang === 'pt' ? 'livro-razao' : 'en/ledger';
    const html = parse(fs.readFileSync(`dist/${prefixo}/series/${serie}/index.html`, 'utf8'));
    rendida = html.querySelector('[data-o-que-e-da-serie] .linha-o-que-e-frase').textContent;
  }
  for (const expressao of expressoes) {
    assert.ok(expressao.test(frase) && expressao.test(rendida), `${serie}/${lang}: falta ${expressao}`);
    if (process.argv.includes('--prova')) {
      assert.ok(!expressao.test(frase.replace(expressao, '')));
      plantasSerie++;
    }
  }
}
console.log(`JD1-b: taxa anual, obrigações já emitidas e prazo restante; ${plantasSerie} plantas morderam.`);

// O nome deve permitir distinguir uma despesa das contas nacionais de pagamentos.
const bases = [
  ['juros-das-administracoes-publicas-2024', /administrações públicas.*contas nacionais/, /General government.*national accounts/],
  ['juros-das-administracoes-publicas-2025', /administrações públicas.*contas nacionais/, /General government.*national accounts/],
  ['pib-nominal-notificacao-setembro-2024', /Portugal.*contas nacionais/, /Portugal.*national accounts/],
  ['pib-nominal-notificacao-setembro-2025', /Portugal.*contas nacionais/, /Portugal.*national accounts/],
  ['juros-das-administracoes-publicas-pib-2024', /administrações públicas.*contas nacionais/, /General government.*national accounts/],
  ['juros-das-administracoes-publicas-pib-2025', /administrações públicas.*contas nacionais/, /General government.*national accounts/],
  ['juros-das-administracoes-publicas-2025-ue', /União Europeia.*contas nacionais/, /European Union.*national accounts/],
  ['juros-e-outros-encargos-execucao-2025-08', /administrações públicas.*caixa/, /general government.*cash basis/i],
  ['juros-e-outros-encargos-execucao-2026-08', /administrações públicas.*caixa/, /general government.*cash basis/i],
  ['custo-do-stock-da-divida-direta-2025', /Estado.*contas nacionais/, /State.*national accounts/],
  ['custo-da-divida-emitida-2026-08', /ponderado.*Estado/, /Weighted average.*State/],
  ['divida-direta-do-estado-2026-08', /Estado.*nominal ou descontado/, /State.*nominal or discounted/],
  ['necessidades-brutas-de-financiamento-2025', /Estado.*contabilidade orçamental pública/, /State.*public budget accounts/],
  ['emissoes-de-divida-fundada-2025', /Estado.*contabilidade orçamental pública/, /State.*public budget accounts/],
];
let plantasBases = 0;
assert.equal(bases.length, 14);
for (const [id, pt, en] of bases) for (const lang of ['pt', 'en']) {
  const expressao = lang === 'pt' ? pt : en;
  const nome = nomeNoRecibo(id, lang).texto;
  assert.ok(expressao.test(nome), `${id}/${lang}: nome sem perímetro ou base`);
  if (process.argv.includes('--prova')) {
    const semBase = nome.replace(/contas nacionais|national accounts|caixa|cash basis|ponderado|Weighted average|nominal ou descontado|nominal or discounted|contabilidade orçamental pública|public budget accounts/, '');
    assert.ok(!expressao.test(semBase), `${id}/${lang}: a perda da base não foi recusada`);
    plantasBases++;
  }
  if (!process.argv.includes('--declaracoes')) {
    const prefixo = lang === 'pt' ? 'livro-razao' : 'en/ledger';
    const html = parse(fs.readFileSync(`dist/${prefixo}/${id}/index.html`, 'utf8'));
    assert.ok(expressao.test(html.querySelector('.linha-cabeca h1').textContent), `nome no recibo ${id}/${lang}`);
  }
}
for (const lang of ['pt', 'en']) {
  const frase = oQueEDaLinha('custo-da-divida-emitida-2026-08', lang).pedacos.join('');
  assert.match(frase, lang === 'pt' ? /o Estado pedir dinheiro/ : /State’s borrowing/);
}
console.log(`JD1-b: perímetro e base nos catorze nomes, custo das emissões do Estado; ${plantasBases} plantas morderam.`);
