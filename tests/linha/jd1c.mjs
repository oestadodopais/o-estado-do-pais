/** JD1-c: plantas e conferência das frases nas duas edições. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parse } from 'node-html-parser';
import { oQueEDaLinha } from '../../src/lib/o-que-e-o-numero.mjs';
import { reguaDaMedida } from '../../src/lib/enquadramento.mjs';
import { conferirAuditoriaDasLeituras } from '../cartao/leituras.mjs';
import { ORIGENS_DAS_DEFINICOES } from '../../src/data/figuras.mjs';
export const plantas = [];
for (const [chave, nome] of [['jd1-ine-provisorio', 'Nota de estado sem literal'], ['jd1-eurostat-versao', 'Nota de comparação sem literal']]) {
  const origens = structuredClone(ORIGENS_DAS_DEFINICOES);
  origens[chave].excerto = 'Literal retirado nesta cópia.';
  const erro = conferirAuditoriaDasLeituras({origens}).erros.find(e => e.includes('nota «') && e.includes(`da origem «${chave}»`));
  assert.ok(erro, nome + ': a guarda do apoio não mordeu');
  plantas.push({nome, mensagem: erro, passou: true});
}
function recusa(nome, erros, mensagem) {
  assert.ok(erros.includes(mensagem), nome + ': a planta não mordeu');
  plantas.push({nome, mensagem, passou: true});
}
export function conferirNotas(id, texto, lang, regua = reguaDaMedida(id)) {
  const erros = [];
  if (id.endsWith('2024') && /provis/.test(texto)) erros.push('JD1-c: linha final de 2024 apresentada como provisória');
  if (/A comparação|The comparison/.test(texto) && !(regua.ue || regua.portugal)) erros.push('JD1-c: frase de comparação sem a linha da União');
  return erros;
}
for (const base of ['juros-das-administracoes-publicas', 'pib-nominal-notificacao-setembro', 'juros-das-administracoes-publicas-pib']) for (const year of ['2024','2025']) for (const lang of ['pt','en']) {
  const id = `${base}-${year}`;
  const frase = oQueEDaLinha(id, lang).pedacos.join('');
  assert.deepEqual(conferirNotas(id, frase, lang), []);
  assert.match(frase, year === '2024' ? /final/ : /provis/);
  if (!process.argv.includes('--declaracoes')) {
    const root = parse(fs.readFileSync(`dist/${lang === 'pt' ? 'livro-razao' : 'en/ledger'}/${id}/index.html`, 'utf8'));
    const texto = root.querySelector('[data-o-que-e-parte="o-que-e"]').textContent;
    assert.deepEqual(conferirNotas(id, texto, lang), []);
    assert.match(texto, year === '2024' ? /final/ : /provis/);
  }
  if (year === '2024') {
    recusa(`Estado trocado ${id}/${lang}`, conferirNotas(id, frase.replace(lang === 'pt' ? 'O valor é final' : 'The value is final', lang === 'pt' ? 'O valor é provisório' : 'The value is provisional'), lang), 'JD1-c: linha final de 2024 apresentada como provisória');
    recusa(`Comparação sem União ${id}/${lang}`, conferirNotas(id, frase + (lang === 'pt' ? ' A comparação' : ' The comparison'), lang), 'JD1-c: frase de comparação sem a linha da União');
  }
}
const { parcelaDoFinanciamento, FINANCIAMENTO_JD1, AMORTIZACOES_JD1 } = await import('../../src/lib/frases-jd1.mjs');
function confereParcela(partes) {
  return JSON.stringify(partes.filter(p => typeof p !== 'string' && p.claim).map(p => p.claim)) === JSON.stringify([FINANCIAMENTO_JD1, AMORTIZACOES_JD1])
    ? [] : ['JD1-c: parcela sem os dois montantes por token'];
}
for (const id of [FINANCIAMENTO_JD1, AMORTIZACOES_JD1]) for (const lang of ['pt','en']) {
  const frase = parcelaDoFinanciamento(id, lang);
  assert.deepEqual(confereParcela(frase), []);
  recusa(`Parcela literal/${lang}`, confereParcela(frase.map(p => p.claim === AMORTIZACOES_JD1 ? '56 976' : p)), 'JD1-c: parcela sem os dois montantes por token');
  if (!process.argv.includes('--declaracoes')) {
    const root = parse(fs.readFileSync(`dist/${lang === 'pt' ? 'livro-razao' : 'en/ledger'}/${id}/index.html`, 'utf8'));
    if (id === FINANCIAMENTO_JD1) assert.match(root.querySelector('[data-jd1-parcela]').textContent, lang === 'pt' ? /serviram para reembolsar ou extinguir dívida/ : /were used to repay or extinguish (?:funded )?debt/);
    if (id === AMORTIZACOES_JD1) assert.match(root.querySelector('[data-jd1-parcela]').textContent, lang === 'pt' ? /A parcela foi maior do que a registada na coluna de 2024/ : /The portion was greater than that in the 2024 column/);
    assert.equal(root.querySelector('[data-jd1-parcela]').closest('[data-o-que-e]'), null);
    assert.deepEqual(root.querySelector('[data-jd1-parcela]').querySelectorAll('[data-claim]').map(n => n.getAttribute('data-claim')), [FINANCIAMENTO_JD1, AMORTIZACOES_JD1]);
  }
}
const { evolucaoJd1 } = await import('../../src/lib/enquadramento.mjs');
const { loadClaims, parsePtNumber } = await import('../../src/lib/ledger.mjs');
const idsEvolucao = ['juros-das-administracoes-publicas-2025', 'pib-nominal-notificacao-setembro-2025', 'juros-das-administracoes-publicas-pib-2025', 'juros-e-outros-encargos-execucao-2026-08'];
function confereDirecao(id, palavra) {
  const anterior = reguaDaMedida(id).anterior.id, linhas = loadClaims();
  const delta = parsePtNumber(linhas.get(id).value) - parsePtNumber(linhas.get(anterior).value);
  return palavra === (delta > 0 ? 'subiu' : delta < 0 ? 'desceu' : 'igual') ? [] : ['JD1-c: direção da evolução trocada'];
}
for (const id of idsEvolucao) for (const lang of ['pt','en']) {
  const e = evolucaoJd1(id, lang);
  assert.deepEqual(confereDirecao(id, e.direcao), []);
  assert.deepEqual(e.partes.filter(p => typeof p !== 'string' && p.claim).map(p => p.claim), [e.anterior, id]);
  recusa(`Direção trocada ${id}/${lang}`, confereDirecao(id, e.direcao === 'subiu' ? 'desceu' : 'subiu'), 'JD1-c: direção da evolução trocada');
  const alteradas = structuredClone(loadClaims());
  alteradas.get(id).value = alteradas.get(e.anterior).value;
  assert.equal(evolucaoJd1(id, lang, alteradas).direcao, 'igual');
  if (!process.argv.includes('--declaracoes')) {
    const root = parse(fs.readFileSync(`dist/${lang === 'pt' ? 'livro-razao' : 'en/ledger'}/${id}/index.html`, 'utf8'));
    const rendida = root.querySelector('[data-jd1-evolucao]');
    assert.deepEqual(confereDirecao(id, rendida.getAttribute('data-jd1-evolucao')), []);
    assert.ok(rendida.textContent.startsWith(e.partes[0]));
    const trocada = rendida.textContent.replace(e.partes[0], lang === 'pt' ? (e.direcao === 'subiu' ? 'Desceu de ' : 'Subiu de ') : (e.direcao === 'subiu' ? 'Fell from ' : 'Rose from '));
    assert.ok(!trocada.startsWith(e.partes[0]));
  }
}
for (const lang of ['pt','en']) {
  const frase = oQueEDaLinha('divida-direta-do-estado-2026-08', lang).pedacos.join('');
  assert.match(frase, lang === 'pt' ? /não a dívida de todas as administrações públicas na ótica de Maastricht/ : /not the Maastricht debt of all general government bodies/);
}
if (!process.argv.includes('--declaracoes')) for (const id of ['custo-do-stock-da-divida-direta-2025','custo-da-divida-emitida-2026-08']) for (const lang of ['pt','en']) {
  const root = parse(fs.readFileSync(`dist/${lang === 'pt' ? 'livro-razao' : 'en/ledger'}/${id}/index.html`, 'utf8'));
  const literal = root.querySelector('.linha-excerto-grafico [data-linha-campo="excerpt"]');
  assert.equal(literal.textContent, loadClaims().get(id).excerpt);
  assert.match(root.querySelector('.linha-recorte img').getAttribute('alt'), lang === 'pt' ? /Recorte do gráfico com o rótulo assinalado/ : /Crop of the chart with the label marked/);
}
const { FAMILIAS_JD1 } = await import('../../design/especime-v3/medicoes/jd1-2026-10-06/familias.mjs');
const perimetro = FAMILIAS_JD1.find(f => f.chaves.includes('juros-das-administracoes-publicas')).partes.find(p => p.pt.startsWith(' Exclui'));
assert.ok(perimetro.apoios.every(a => a.origem === 'jd1-ine-contas'));
for (const lang of ['pt','en']) {
  const frase = oQueEDaLinha('custo-do-stock-da-divida-direta-2025', lang).pedacos.join('');
  const termo = lang === 'pt' ? 'juros do subsetor Estado' : 'interest of the State subsector';
  assert.ok(frase.includes(termo));
  recusa(`Subsetor apagado/${lang}`, frase.replace(termo, '').includes(termo) ? [] : ['JD1-c: custo sem o subsetor Estado'], 'JD1-c: custo sem o subsetor Estado');
}
console.log(JSON.stringify({passou: true, plantas}, null, 2));
