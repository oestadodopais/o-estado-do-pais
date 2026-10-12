/** EX1-e: os dez ramos dos saldos, nas duas edições, com valores sintéticos apenas em memória. */
import { parse } from 'node-html-parser';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { DINHEIRO_DO_ESTADO_2026 as e } from '../../src/data/explicacoes/dinheiro-do-estado-2026.mjs';
import { getClaim, loadClaims, parsePtNumber } from '../../src/lib/ledger.mjs';
import { explicacaoResolvida, textoDosPedacosDaExplicacao } from '../../src/lib/explicacoes.mjs';

export function conferirCenariosDosSaldos({ explicacaoPelaCelula, conferirRamosDasExplicacoes, conferirContabilidadeDosRamos }) {
  const token = e.seccoes[2].conteudo[1].paragrafo.pt.find(p => p.comparaSaldos);
  const [exec, oe] = token.comparaSaldos;
  const a = getClaim(exec), b = getClaim(oe), antes = [a.value, b.value];
  const pequeno = Math.min(Math.abs(parsePtNumber(a.value)), Math.abs(parsePtNumber(b.value)));
  const grande = Math.max(Math.abs(parsePtNumber(a.value)), Math.abs(parsePtNumber(b.value)));
  assert(grande > pequeno && pequeno > 0, 'os valores de base têm de permitir comparar módulos diferentes');
  const cenarios = [
    [-pequeno, -grande, 'deficitMenor'], [-grande, -pequeno, 'deficitMaior'], [-pequeno, -pequeno, 'deficitIgual'],
    [pequeno, grande, 'excedenteMenor'], [grande, pequeno, 'excedenteMaior'], [pequeno, pequeno, 'excedenteIgual'],
    [0, 0, 'nulos'], [pequeno, -grande, 'diferentesNegativo'], [-pequeno, grande, 'diferentesPositivo'],
    [-pequeno, 0, 'diferentesZero'], [pequeno, 0, 'diferentesZero'],
    [0, -grande, 'diferentesNegativo'], [0, grande, 'diferentesPositivo'],
  ];
  const resultados = [];
  const norm = x => x.replace(/\s+/g, ' ').trim();
  const coexistencia = [];
  for (const lang of ['pt', 'en']) {
    const ps = explicacaoPelaCelula(e, lang, loadClaims()).paragrafos;
    const root = parse('<main>' + ps.map(p => `<p data-explicacao-paragrafo="${p.caminho}">${p.texto}</p>`).join('') + '</main>');
    const erros = conferirContabilidadeDosRamos(root, e, lang, loadClaims());
    assert.deepEqual(erros, [], 'as duas contas corretas têm de coexistir');
    const contas = ps.filter(p => ['seccoes[2].conteudo[1].paragrafo', 'seccoes[3].conteudo[0].paragrafo'].includes(p.caminho));
    assert.equal(contas.length, 2);
    coexistencia.push({ lang, contas, erros });
  }
  try {
    for (const [x, y, ramo] of cenarios) {
      a.value = String(x).replace('.', ','); b.value = String(y).replace('.', ',');
      for (const lang of ['pt', 'en']) {
        const p = e.seccoes[2].conteudo[1].paragrafo[lang];
        const t = p.find(x => x.comparaSaldos);
        const rendido = norm(textoDosPedacosDaExplicacao(explicacaoResolvida(e.slug, lang).seccoes[2].blocos[1].pedacos, lang));
        const esperado = explicacaoPelaCelula(e, lang, loadClaims()).paragrafos.find(x => x.caminho === 'seccoes[2].conteudo[1].paragrafo').texto;
        assert.equal(rendido, esperado, `${lang}, ${ramo}: resolvedor e célula discordam`);
        assert(rendido.includes(t[ramo][0]), `${lang}: não escolheu ${ramo}`);
        resultados.push({ execucao: a.value, previsao: b.value, lang, ramo, texto: rendido });
      }
    }
    // Cada ramo de cada token é retirado isoladamente: a X10 tem de o nomear.
    const ramos = [];
    const visitar = (x, caminho = []) => {
      if (!x || typeof x !== 'object') return;
      const chave = ['sinal', 'compara', 'comparaSaldos'].find(k => k in x);
      if (chave) for (const ramo of Object.keys(x).filter(k => k !== chave && k !== 'palavras')) {
        const copia = structuredClone(e);
        const alvo = caminho.reduce((v, k) => v[k], copia);
        delete alvo[ramo];
        const erros = conferirRamosDasExplicacoes({ explicacoes: [copia] }).erros;
        assert(erros.some(q => q.startsWith('X10 ·') && q.includes(`«${ramo}»`)), `X10 não exigiu ${chave}.${ramo}`);
        ramos.push({ token: chave, caminho: caminho.join('.'), ramo, mensagem: erros[0] });
      }
      for (const [k, v] of Object.entries(x)) visitar(v, [...caminho, k]);
    };
    visitar(e);
    return { coexistencia, cenarios: resultados, ramos, erros: [] };
  } finally { [a.value, b.value] = antes; }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const r = conferirCenariosDosSaldos(await import('./explicacao.mjs'));
  console.log(`EX1-e: ${r.cenarios.length} cenários de saldos e ${r.ramos.length} ramos retirados isoladamente, sem erros.`);
}
