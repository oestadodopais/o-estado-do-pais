/** E0, §1.146: as linhas do projeto, a precisão publicada e a história selada.
 * As plantas chamam os portões reais em processos isolados e só mudam memória. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { load } from 'js-yaml';
import { parse } from 'node-html-parser';
import { mudancasDoRegisto } from '../../src/lib/mudancas.mjs';
import { LUGAR_DECLARADO_DAS_LINHAS } from '../../src/data/lugar-das-linhas.mjs';
const ids = ['taxa-de-desemprego-2025', 'taxa-de-desemprego-mip-2025', 'correcoes-publicadas'];
const normal = s => String(s ?? '').replace(/\s+/g, ' ').trim();
const lerLinha = id => load(fs.readFileSync(`ledger/claims/${id}.yml`, 'utf8'));
const assinatura = e => ({ date: e.date, kind: e.kind, old_value: e.old_value, new_value: e.new_value });
const entradaE0 = c => (c.corrections ?? []).find(e => e.date === '2026-09-30' &&
  e.kind === (c.id === 'correcoes-publicadas' ? 'atualizacao' : 'correcao') &&
  e.old_value === (c.id === 'correcoes-publicadas' ? '3' : '6') && e.new_value === (c.id === 'correcoes-publicadas' ? '5' : '6,0'));
const valorComUnidade = el => {
  const c = lerLinha(el.getAttribute('data-claim'));
  return normal(el.textContent) === c.value && normal(el.parentNode.textContent).includes(`${c.value} %`);
};

export function conferirLinhasDaCasa(dist = 'dist', estragar = null) {
  const erros = [];
  const medidas = { linhas: [], registos: [], valores_visiveis: [] };
  const historias = JSON.parse(fs.readFileSync('ledger/historias-valores.json', 'utf8'));
  const livros = fs.readdirSync('ledger/claims').filter(f => f.endsWith('.yml')).map(f => lerLinha(f.slice(0, -4)));
  const contadas = livros.reduce((n, c) => n + (c.corrections ?? []).filter(e => e.kind === 'correcao').length, 0);
  for (const id of ids) {
    const c = lerLinha(id);
    const entradas = c.corrections.filter(e => ['correcao', 'atualizacao'].includes(e.kind));
    /* A guarda conserva a entrada do E0; uma atualização futura pode crescer
       a lista. A aceitação dos valores deste bloco é medida por medir-e0. */
    const e = entradaE0(c);
    const desemprego = id !== 'correcoes-publicadas';
    const esperado = { date: '2026-09-30', kind: desemprego ? 'correcao' : 'atualizacao',
      old_value: desemprego ? '6' : '3', new_value: desemprego ? '6,0' : '5' };
    if (c.value !== entradas.at(-1)?.new_value || !e || JSON.stringify(assinatura(e)) !== JSON.stringify(esperado))
      erros.push(`E0 valor: ${id} perdeu o valor ou a entrada datada.`);
    if (JSON.stringify(historias[id]) !== JSON.stringify(entradas.map(assinatura)))
      erros.push(`E0 história: ${id} não tem todas as entradas seladas.`);
    if (!e?.reason || !e?.reason_en) erros.push(`E0 motivo: ${id} não tem as duas edições.`);
    if (desemprego && (!e?.reason.includes('6.0') || !e?.reason_en.includes('6.0')))
      erros.push(`E0 fonte: ${id} não conserva a precisão do excerto no motivo.`);
    medidas.linhas.push({ id, valor: c.value, entrada: e && assinatura(e), seladas: historias[id]?.length ?? 0 });
  }
  const contador = lerLinha('correcoes-publicadas');
  if (contador.value !== String(contadas) || contador.check !== 'correcoes_publicadas')
    erros.push('E0 contagem: o contador não coincide com as correções do livro.');
  if (LUGAR_DECLARADO_DAS_LINHAS[contador.id] !== 'o-estado-do-pais') erros.push('E0 declaração: falta o lugar do projeto.');
  medidas.correcoes_contadas = contadas;
  for (const lang of ['pt', 'en']) {
    const esperada = lang === 'pt' ? '/correcoes' : '/en/corrections';
    const registo = parse(fs.readFileSync(path.join(dist, esperada, 'index.html'), 'utf8'));
    estragar?.(registo, lang, 'registo');
    for (const id of ids) {
      const c = lerLinha(id);
      const entrada = entradaE0(c);
      const indice = c.corrections.indexOf(entrada);
      const itens = registo.querySelectorAll(`[data-mudou-registo] [data-correcao-entrada="${id}"]`)
        .filter(li => li.querySelector('[data-correcao-campo="date"]')?.getAttribute('data-correcao-n') === String(indice));
      const porta = itens[0]?.querySelector('.registo-lugar');
      const lugar = id === contador.id ? 'O Estado do País' : 'Portugal';
      const rota = id === contador.id ? esperada : lang === 'pt' ? '/' : '/en';
      if (itens.length !== 1 || normal(porta?.textContent) !== lugar || porta?.getAttribute('href') !== rota)
        erros.push(`E0 registo ${lang}: ${id} perdeu a mudança ou o lugar com a porta.`);
      for (const campo of ['old_value', 'new_value', 'date', 'kind', 'reason']) {
        const el = itens[0]?.querySelector(`[data-correcao-campo="${campo}"]`);
        const texto = campo === 'date' ? '30.09.2026' : campo === 'kind'
          ? (id === contador.id ? (lang === 'pt' ? 'atualização' : 'update') : (lang === 'pt' ? 'correção' : 'correction'))
          : campo === 'reason' ? entrada?.[lang === 'pt' ? 'reason' : 'reason_en'] : entrada?.[campo];
        if (normal(el?.textContent) !== normal(texto)) erros.push(`E0 registo ${lang}: ${id} perdeu o campo ${campo}.`);
      }
      medidas.registos.push({ lang, id, itens: itens.length, lugar: normal(porta?.textContent), porta: porta?.getAttribute('href') });
    }
    const resolvidas = mudancasDoRegisto(lang).filter(e => {
      if (!ids.includes(e.claim)) return false;
      const c = lerLinha(e.claim);
      return e.n === c.corrections.indexOf(entradaE0(c));
    });
    if (resolvidas.length !== 3 || resolvidas.find(e => e.claim === contador.id)?.lugar.chave !== 'o-estado-do-pais')
      erros.push(`E0 resolvedor ${lang}: as mudanças não têm os lugares declarados.`);
    for (const [pagina, rota] of [['primeira', lang === 'pt' ? '/' : '/en/'], ['emprego', lang === 'pt' ? '/emprego/' : '/en/employment/']]) {
      const doc = parse(fs.readFileSync(path.join(dist, rota, 'index.html'), 'utf8'));
      estragar?.(doc, lang, pagina);
      const escopo = pagina === 'emprego' ? doc.querySelector('[data-cartao-medida="taxa-de-desemprego-mip-2025"]') : doc.querySelector('main');
      const valores = escopo?.querySelectorAll('[data-claim]').filter(e => ids.slice(0, 2).includes(e.getAttribute('data-claim'))) ?? [];
      if (!valores.length || valores.some(e => !valorComUnidade(e)))
        erros.push(`E0 visível ${lang} ${pagina}: falta o valor publicado com a unidade.`);
      medidas.valores_visiveis.push({ lang, pagina, valores: valores.map(e => ({ id: e.getAttribute('data-claim'), texto: normal(e.textContent), com_unidade: valorComUnidade(e) })) });
    }
  }
  return { erros, medidas };
}

/** O código e a queixa vêm do portão executado, não de uma cópia da regra. */
export function plantasDasLinhasDaCasa(dist = 'dist') {
  const env = { ...process.env, OEDP_DIST: path.resolve(dist), NO_COLOR: '1' };
  delete env.FORCE_COLOR;
  const executar = (nome, codigo, mordida) => {
    const r = spawnSync('node', ['--input-type=module', '-e', codigo], { encoding: 'utf8', env, maxBuffer: 8 * 1024 * 1024 });
    const saida = (r.stdout + r.stderr).replaceAll(process.cwd(), '[repositorio]').replaceAll(os.homedir(), '[pasta-pessoal]').replaceAll(os.userInfo().username, '[utilizador]');
    return { nome, codigo: r.status, mordida: mordida.source, queixa: saida.split('\n').find(l => mordida.test(l)) ?? null,
      mordeu: r.status === 1 && mordida.test(saida), memoria_isolada: true };
  };
  const plantas = [executar('A: contador sem declaração, A3',
    'import {LUGAR_DECLARADO_DAS_LINHAS as lugares} from "./src/data/lugar-das-linhas.mjs"; delete lugares["correcoes-publicadas"]; await import("./scripts/check-pais.mjs");',
    /A3: .*uma linha do registo sem lugar/),
  executar('A: contador sem declaração, resolvedor',
    'import {LUGAR_DECLARADO_DAS_LINHAS as lugares} from "./src/data/lugar-das-linhas.mjs"; import {mudancasDoRegisto} from "./src/lib/mudancas.mjs"; delete lugares["correcoes-publicadas"]; try {mudancasDoRegisto("pt");} catch(e) {console.log(e.message); process.exitCode=1;}',
    /correcoes-publicadas.*nenhuma declaração diz de que lugar é/),
  executar('declaração falsa de Portugal',
    'import {LUGAR_DECLARADO_DAS_LINHAS as lugares} from "./src/data/lugar-das-linhas.mjs"; lugares["correcoes-publicadas"]="portugal"; await import("./scripts/check-pais.mjs");',
    /A1: correcoes-publicadas é declarado de «portugal» e deriva de «o-estado-do-pais»/)];
  for (const id of ids) plantas.push(executar(`B: ${id} sem entrada selada`,
    `import fs from "node:fs"; const ler=fs.readFileSync; fs.readFileSync=function(f,...a) {const b=ler.call(this,f,...a); if(String(f).endsWith("ledger/historias-valores.json")) {const h=JSON.parse(b); delete h[${JSON.stringify(id)}]; return JSON.stringify(h);} return b;}; await import("./scripts/check-ledger.mjs");`,
    new RegExp(`${id}\\.yml.*história do valor: a lista tem ${lerLinha(id).corrections.filter(e => ['correcao', 'atualizacao'].includes(e.kind)).length} entradas e o registo sela 0`)));
  for (const [nome, estraga, mordida] of [
    ['decimal retirado da primeira', (r, lang, p) => { if (lang === 'pt' && p === 'primeira') {
      const el = r.querySelector('[data-claim="taxa-de-desemprego-mip-2025"]');
      const s = normal(el.textContent);
      el.set_content(s.includes(',') ? s.split(',')[0] : s + '9');
    } }, /E0 visível pt primeira/],
    ['lugar retirado do registo inglês', (r, lang, p) => { if (lang === 'en' && p === 'registo') r.querySelector('[data-mudou-registo] [data-correcao-entrada="correcoes-publicadas"] .registo-lugar').remove(); }, /E0 registo en: correcoes-publicadas perdeu a mudança/],
  ]) {
    const r = conferirLinhasDaCasa(dist, estraga);
    const queixa = r.erros.find(e => mordida.test(e));
    plantas.push({ nome, mordeu: Boolean(queixa), queixa: queixa ?? null, memoria_isolada: true });
  }
  return plantas;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const dist = process.env.OEDP_DIST ?? 'dist';
  const r = conferirLinhasDaCasa(dist);
  r.plantas = process.argv.includes('--prova') ? plantasDasLinhasDaCasa(dist) : [];
  for (const p of r.plantas) if (!p.mordeu) r.erros.push(`E0 planta: ${p.nome} não mordeu.`);
  const j = process.argv.indexOf('--json');
  if (j >= 0) fs.writeFileSync(process.argv[j + 1], JSON.stringify(r, null, 2) + '\n');
  console.log(JSON.stringify(r, null, 2));
  process.exitCode = r.erros.length ? 1 : 0;
}
