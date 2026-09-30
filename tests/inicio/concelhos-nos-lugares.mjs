/** N1: os dois mapas, as tabelas e a contagem municipal conservam os seus dados. */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { load } from 'js-yaml';
import { unidadeDaLinha } from '../../src/i18n/unidades.mjs';
import { LEITURAS_DAS_MEDIDAS } from '../../src/data/leituras-das-medidas.mjs';
import { SITE_URL } from '../../site.config.mjs';
import { MEDIDAS_DO_CONCELHO } from '../../src/data/concelhos.mjs';
import { MUNICIPIOS_COM_PAGINA } from '../../src/data/municipios.mjs';
import { verificaCartaoDasCamaras, recontagemDasCamaras } from '../../scripts/pais-camaras.mjs';
const linha = (id) => load(fs.readFileSync(`ledger/claims/${id}.yml`, 'utf8'));
const ler = (dist, lang) => parse(fs.readFileSync(path.join(dist, lang === 'pt' ? 'lugares/index.html' : 'en/places/index.html'), 'utf8'));
const normal = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

export function conferirConcelhosNosLugares(dist, trocar = null) {
  const erros = [];
  const contas = { mapas: 0, tabelas: 0, linhas: 0, barras: 0, camaras: 0, contextos: 0, referencias_portugal: 0 };
  for (const lang of ['pt', 'en']) {
    const root = ler(dist, lang);
    trocar?.(root, lang);
    erros.push(...verificaCartaoDasCamaras(root, lang));
    contas.camaras += root.querySelectorAll('[data-cartao-camaras]').length;
    const mapas = root.querySelectorAll('[data-forma="mapa-por-concelho"]');
    if (mapas.length !== 2) erros.push(`N1M ${lang}: faltam mapas ou há mapas repetidos.`);
    for (const chave of ['indice', 'ganho']) {
      const mapa = root.querySelector(`[data-instrumento="mapa-por-concelho-${chave}"]`);
      if (!mapa) { erros.push(`N1M ${lang} ${chave}: falta a marca do mapa.`); continue; }
      contas.mapas++;
      const alvos = new Map(MUNICIPIOS_COM_PAGINA.map((m) => [m.slug, chave === 'indice' ? m.distancia.indice : m.relance.find((r) => r.claim?.includes('-ganho-medio-mensal-'))?.claim]));
      const unidades = [...new Set([...alvos.values()].map((id) => linha(id).unit))];
      const unidade = unidades.length === 1 ? unidadeDaLinha(unidades[0], lang).texto : null;
      for (const seletor of ['thead [data-linha-campo="unit"]', '.forma-mapa-unidade [data-linha-campo="unit"]']) {
        const campo = mapa.querySelector(seletor);
        if (!unidade || normal(campo?.textContent) !== normal(unidade) || ![...alvos.values()].includes(campo?.getAttribute('data-linha-claim'))) erros.push(`N1M ${lang} ${chave}: a unidade do mapa ou da tabela não vem das linhas.`);
      }
      const contexto = root.querySelector(`[data-contexto-municipal="${chave}"]`);
      const datas = chave === 'indice' ? recontagemDasCamaras(linha).datas : [...alvos.values()].map((id) => ({ id, periodo: linha(id).reference_date }));
      const periodos = [...new Set(datas.map((d) => d.periodo))];
      const data = contexto?.querySelector('[data-de-campo="reference_date"]');
      const periodo = periodos.length === 1 ? periodos[0] : null;
      if (!periodo || !data || !datas.some((d) => d.id === data.getAttribute('data-de-linha')) || normal(data.textContent) !== periodo) erros.push(`N1M ${lang} ${chave}: o contexto perdeu o período das linhas.`);
      else contas.contextos++;
      const definicao = chave === 'ganho'
        ? LEITURAS_DAS_MEDIDAS['ganho-medio-mensal-2024'][lang].map((p) => typeof p === 'string' ? p : periodo).join('')
        : `${lang === 'pt' ? 'Em' : 'In'} ${periodo}. ${MEDIDAS_DO_CONCELHO.find((m) => m.chave === chave).nota[lang].join('')}`;
      if (normal(contexto?.querySelector('[data-definicao-municipal]')?.textContent) !== normal(definicao)) erros.push(`N1M ${lang} ${chave}: a definição municipal difere da declaração.`);
      if (chave === 'ganho') {
        const nacional = linha('ganho-medio-mensal-2024');
        const ref = contexto?.querySelector('[data-referencia-portugal]');
        const valor = ref?.querySelector('[data-claim]');
        if (!ref?.textContent.includes('Portugal:') || valor?.getAttribute('data-claim') !== nacional.id || normal(valor?.textContent) !== normal(nacional.value) || normal(ref?.querySelector('.claim-sufixo')?.textContent) !== unidadeDaLinha(nacional.unit, lang).texto || ref?.querySelector('.src-chip')?.getAttribute('href') !== `${lang === 'pt' ? '/livro-razao' : '/en/ledger'}/${nacional.id}` || nacional.reference_date !== periodo) erros.push(`N1M ${lang} ganho: a referência de Portugal perdeu o valor, a unidade, o período ou o selo.`);
        else contas.referencias_portugal++;
      }
      const rows = mapa.querySelectorAll('tbody tr');
      contas.tabelas += mapa.querySelectorAll('table').length;
      contas.linhas += rows.length;
      const ids = rows.map((r) => r.querySelector('[data-claim]')?.getAttribute('data-claim'));
      if (ids.length !== alvos.size || new Set(ids).size !== alvos.size || [...alvos.values()].some((id) => !ids.includes(id))) erros.push(`N1M ${lang} ${chave}: as linhas da tabela diferem dos concelhos declarados.`);
      for (const row of rows) {
        const c = row.querySelector('[data-claim]');
        const id = c?.getAttribute('data-claim');
        if (id && normal(c.textContent) !== normal(linha(id).value)) erros.push(`N1M ${lang} ${chave}: valor da linha ${id} diferente do livro-razão.`);
        const slug = [...alvos].find(([, valor]) => valor === id)?.[0];
        const esperado = `${lang === 'pt' ? '/municipios/' : '/en/municipalities/'}${slug}`;
        if (!slug || row.querySelector('th a')?.getAttribute('href')?.replace(/\/$/, '') !== esperado) erros.push(`N1M ${lang} ${chave}: a linha ${id} perdeu a porta do concelho.`);
      }
      const geometrias = mapa.querySelectorAll('use[data-concelho]');
      if (geometrias.length !== alvos.size || new Set(geometrias.map((g) => g.getAttribute('data-concelho'))).size !== alvos.size) erros.push(`N1M ${lang} ${chave}: a geometria não tem um desenho por concelho.`);
      for (const g of geometrias) if (!root.querySelector(`[id="${g.getAttribute('href')?.slice(1)}"]`)) erros.push(`N1M ${lang} ${chave}: falta a geometria referida pelo mapa.`);
    }
    const barras = root.querySelectorAll('[data-forma="barra-concelho-pais"]');
    contas.barras += barras.length;
    if (barras.length) erros.push(`N1M ${lang}: voltou a barra isolada de um concelho.`);
    const base = MEDIDAS_DO_CONCELHO.find((m) => m.chave === 'indice').nota[lang].join('');
    if (normal(root.querySelector('[data-camaras-base]')?.textContent) !== normal(base)) erros.push(`N1M ${lang}: falta a base da percentagem do limite.`);
    if (root.querySelectorAll('[data-ausencia="T4a"]').length !== 1) erros.push(`N1M ${lang}: falta a ausência declarada da disparidade salarial municipal.`);
  }
  return { erros, contas };
}

export function plantasDosConcelhos(dist) {
  return [
    ['marca do mapa retirada', (r) => r.querySelector('[data-forma="mapa-por-concelho"]').removeAttribute('data-instrumento'), /^N1M pt indice: falta a marca/],
    ['unidade da tabela retirada', (r) => r.querySelector('thead [data-linha-campo="unit"]').remove(), /^N1M pt indice: a unidade/],
    ['unidade da legenda retirada', (r) => r.querySelector('[data-instrumento="mapa-por-concelho-ganho"] .forma-mapa-unidade').remove(), /^N1M pt ganho: a unidade/],
    ['base do limite retirada', (r) => r.querySelector('[data-camaras-base]').remove(), /^N1M pt: falta a base/],
    ['porta das câmaras para si própria', (r) => r.querySelector('[data-cartao-camaras]').insertAdjacentHTML('beforeend', '<a href="/lugares/">Os lugares →</a>'), /^V2 pt: o cartão das câmaras não leva porta/],
    ['porta absoluta das câmaras para si própria', (r) => r.querySelector('[data-cartao-camaras]').insertAdjacentHTML('beforeend', `<a href="${new URL('/lugares/', SITE_URL).href}">Os lugares →</a>`), /^V2 pt: o cartão das câmaras não leva porta/],
    ['ano dos ganhos retirado', (r) => r.querySelector('[data-contexto-municipal="ganho"] [data-de-campo]').remove(), /^N1M pt ganho: o contexto/],
    ['ano da dívida trocado', (r) => r.querySelector('[data-contexto-municipal="indice"] [data-de-campo]').set_content('1999'), /^N1M pt indice: o contexto/],
    ['definição dos ganhos retirada', (r) => r.querySelector('[data-contexto-municipal="ganho"] [data-definicao-municipal]').set_content('Ganho médio.'), /^N1M pt ganho: a definição/],
    ['referência de Portugal retirada', (r) => r.querySelector('[data-referencia-portugal]').remove(), /^N1M pt ganho: a referência/],
    ['selo da referência de Portugal retirado', (r) => r.querySelector('[data-referencia-portugal] .src-chip').remove(), /^N1M pt ganho: a referência/],
    ['mapa retirado dos lugares', (r) => r.querySelector('[data-forma="mapa-por-concelho"]').remove(), /^N1M pt: faltam mapas/],
    ['linha retirada da tabela', (r) => r.querySelector('[data-forma="mapa-por-concelho"] tbody tr').remove(), /^N1M pt indice: as linhas/],
    ['valor municipal trocado', (r) => r.querySelector('[data-forma="mapa-por-concelho"] tbody [data-claim]').set_content('999'), /^N1M pt indice: valor da linha/],
    ['geometria municipal retirada', (r) => r.querySelector('[data-forma="mapa-por-concelho"] use[data-concelho]').remove(), /^N1M pt indice: a geometria/],
    ['contagem das câmaras trocada', (r) => r.querySelector('[data-cartao-camaras] [data-prova]').set_content('999'), /^V2 pt: .*contagem/],
    ['selo do limite municipal retirado', (r) => r.querySelector('[data-cartao-camaras] .src-chip').remove(), /^V2 pt: falta a marca da fonte/],
  ].map(([nome, estraga, mordida]) => {
    const r = conferirConcelhosNosLugares(dist, (root, lang) => { if (lang === 'pt') estraga(root); });
    const queixa = r.erros.find((e) => mordida.test(e));
    return { nome, mordeu: Boolean(queixa), queixa: queixa ?? null };
  });
}
