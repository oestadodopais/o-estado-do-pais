/** N1c: unidades, notas junto do cartão e portas com o nome do destino. */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { getClaim } from '../../src/lib/ledger.mjs';
import { nomeDoCartao } from '../../src/lib/nomes.mjs';
import { unidadeDaLinha } from '../../src/i18n/unidades.mjs';
import { medidaPelaChave } from '../../src/data/dominios.mjs';
import { t } from '../../src/i18n/strings.mjs';
const normal = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const pagina = (dist, rota) => parse(fs.readFileSync(path.join(dist, rota, 'index.html'), 'utf8'));
export function conferirAcertosN1c(dist, ler = (rota) => pagina(dist, rota)) {
  const erros = [];
  const medidas = [];
  for (const lang of ['pt', 'en']) {
    const salarios = ler(lang === 'pt' ? 'salarios-pensoes-e-apoios' : 'en/pay-pensions-and-benefits');
    const id = 'retribuicao-minima-mensal-doze-meses-2026';
    const linha = getClaim(id);
    const irmao = salarios.querySelector(`[data-valor-irmao="${id}"]`);
    const unidade = unidadeDaLinha(linha.unit, lang).texto;
    const base = lang === 'pt' ? 'em base de doze meses' : 'on a twelve-month basis';
    const correto = irmao?.closest('[data-caixa-cartao]')?.getAttribute('data-caixa-cartao') === 'retribuicao-minima-mensal-garantida-continente-2026' && normal(irmao.querySelector('[data-nome]')?.textContent) === normal(nomeDoCartao(linha, lang)?.texto) && normal(irmao.querySelector('.claim-sufixo')?.textContent) === unidade && normal(irmao.querySelector('[data-claim]')?.textContent) === normal(linha.value) && irmao.textContent.includes(base);
    if (!correto) erros.push(`N1c ${lang}: o salário irmão perdeu o nome, a unidade, a base ou a sua caixa.`);
    medidas.push({ lang, medida: 'salario_irmao', correto, unidade, texto: normal(irmao?.textContent) });
    const estado = ler(lang === 'pt' ? 'estado-e-economia' : 'en/state-and-economy');
    for (const chave of ['E2', 'E3', 'E4']) {
      const m = medidaPelaChave(chave);
      const nota = estado.querySelector(`[data-referencia-de="${m.claim}"]`);
      if (nota?.closest('[data-caixa-cartao]')?.getAttribute('data-caixa-cartao') !== m.claim || normal(nota?.textContent) !== normal(t(lang).estado[m.limiarFixadoPor].frase)) erros.push(`N1c ${lang}: a atribuição de ${m.claim} perdeu a sua caixa ou a frase.`);
    }
    const emprego = ler(lang === 'pt' ? 'emprego' : 'en/employment');
    if (emprego.querySelector('.entrada-referencia, [data-nonledger="ambito-da-medida"]')) erros.push(`N1c ${lang}: voltou uma faixa etária solta.`);
    for (const root of [salarios, estado, emprego]) if (root.querySelector('.pais-cartoes > p')) erros.push(`N1c ${lang}: uma nota ocupa uma célula solta na grelha.`);
    const uniao = ler(lang === 'pt' ? 'uniao-europeia' : 'en/european-union');
    const portas = uniao.querySelectorAll('.dobra-porta a');
    const esperadas = lang === 'pt' ? [
      ['/estado-e-economia/#m-divida-publica-2025', 'Ver em Estado e economia →'],
      ['/emprego/#m-taxa-de-emprego-2025', 'Ver em Emprego →'],
      ['/emprego/#m-taxa-de-desemprego-mip-2025', 'Ver em Emprego →'],
    ] : [
      ['/en/state-and-economy/#m-divida-publica-2025', 'See in State and economy →'],
      ['/en/employment/#m-taxa-de-emprego-2025', 'See in Employment →'],
      ['/en/employment/#m-taxa-de-desemprego-mip-2025', 'See in Employment →'],
    ];
    const nomes = portas.length === 3 && esperadas.every(([href, texto]) => portas.some((a) => a.getAttribute('href') === href && normal(a.textContent) === texto));
    if (!nomes) erros.push(`N1c ${lang}: as três portas da União não dizem o nome do destino.`);
    medidas.push({ lang, medida: 'portas_da_uniao', correto: nomes, portas: portas.map((a) => ({ href: a.getAttribute('href'), texto: normal(a.textContent) })) });
  }
  return { erros, medidas };
}
export function plantasDosAcertosN1c(dist) {
  return [
    ['salário irmão sem unidade mensal', 'salarios-pensoes-e-apoios', (r) => r.querySelector('[data-valor-irmao] .claim-sufixo').set_content('euros'), /^N1c pt: o salário irmão/],
    ['atribuição fora da caixa do cartão', 'en/state-and-economy', (r) => { const n = r.querySelector('[data-referencia-de]'); r.querySelector('.pais-cartoes').insertAdjacentHTML('beforeend', n.outerHTML); n.remove(); }, /^N1c en: a atribuição/],
    ['idade solta reposta', 'emprego', (r) => r.querySelector('.pais-cartoes').insertAdjacentHTML('beforeend', '<p class="entrada-referencia">dos 20 aos 64 anos</p>'), /^N1c pt: voltou uma faixa/],
    ['nome antigo na porta da União', 'en/european-union', (r) => r.querySelector('.dobra-porta a').set_content('See it in the domain →'), /^N1c en: as três portas/],
  ].map(([nome, rota, estraga, mordida]) => {
    const r = conferirAcertosN1c(dist, (alvo) => { const root = pagina(dist, alvo); if (alvo === rota) estraga(root); return root; });
    const queixa = r.erros.find((e) => mordida.test(e));
    return { nome, mordeu: !!queixa, queixa: queixa ?? null };
  });
}
