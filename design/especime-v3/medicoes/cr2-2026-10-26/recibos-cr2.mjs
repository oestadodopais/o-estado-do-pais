/** CR2-d: confere 30 recibos atualizados e quatro pendentes, nas duas edições. */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { load } from 'js-yaml';

const PASTA = 'design/especime-v3/medicoes/cr2-2026-10-26';
const dist = path.resolve(process.argv[2] ?? 'dist');
const NOVE = JSON.parse(fs.readFileSync(`${PASTA}/ids.json`, 'utf8'));
const limpo = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const versao = JSON.parse(fs.readFileSync(path.join(dist, 'version.json'), 'utf8'));
/** A conferência de um recibo, sobre a árvore do HTML; é a mesma para os recibos lidos e para o estragado. */
function conferir(r, linha, lang) {
  const n = linha.corrections.findIndex((c) => c.kind === 'atualizacao' && c.date === '2026-10-26');
  const iDiverge = linha.verifications.findIndex((v) => v.date === '2026-10-26' && v.result === 'diverge');
  const iIgual = linha.verifications.findIndex((v) => v.date === '2026-10-26' && v.result === 'igual');
  const titulo = limpo(r.querySelector('h1.linha-valor [data-claim]')?.textContent);
  const alvo = r.querySelector(`#alteracao-${n}`);
  const razao = alvo ? limpo(alvo.querySelector('[data-correcao-campo="reason"]')?.textContent) : null;
  const esperada = limpo(lang === 'pt' ? linha.corrections[n]?.reason : linha.corrections[n]?.reason_en);
  const diverge = r.querySelector(`[data-linha-verificacao="${iDiverge}"]`);
  const porta = diverge?.querySelector('[data-atualizacao-da-releitura]')?.getAttribute('href') ?? null;
  const mostradas = r.querySelectorAll('[data-linha-verificacao]').map((e) => Number(e.getAttribute('data-linha-verificacao')));
  const pendente = ['divida-publica-2025', 'divida-publica-2025-ue'].includes(linha.id);
  const ok = {
    valor_no_titulo: titulo === limpo(linha.value),
    entrada_da_atualizacao: pendente ? n === -1 && !alvo : n >= 0 && Boolean(alvo),
    razao_na_lingua_da_edicao: pendente ? razao === null : razao !== null && razao === esperada,
    diverge_visivel: iDiverge >= 0 && Boolean(diverge) && limpo(diverge.textContent).includes('26.10.2026'),
    diverge_abre_a_atualizacao: pendente ? porta === null : porta === `#alteracao-${n}`,
    ultima_reconferencia: pendente ? mostradas[0] === iDiverge && iDiverge === linha.verifications.length - 1 : iIgual === linha.verifications.length - 1 && mostradas[0] === iIgual,
    sem_valor_em_uso: r.querySelectorAll('[data-valor-em-uso]').length === 0,
    /* C2-b: o dia em que a fonte publicou, como a linha o declara, na forma da casa (DD.MM.AAAA), escrita aqui. */
    published_at_no_recibo: typeof linha.published_at === 'string'
      && r.querySelectorAll('[data-de-campo="published_at"]').length === 1
      && limpo(r.querySelector('[data-de-campo="published_at"]')?.textContent) === linha.published_at.split('-').reverse().join('.'),
  };
  return { pendente, titulo, entrada: n, porta, mostradas, razao, ok };
}
const recibos = [];
for (const id of NOVE) {
  const linha = load(fs.readFileSync(path.join('ledger', 'claims', `${id}.yml`), 'utf8'));
  for (const [lang, rota] of [['pt', `livro-razao/${id}/index.html`], ['en', `en/ledger/${id}/index.html`]]) {
    const c = conferir(parse(fs.readFileSync(path.join(dist, rota), 'utf8')), linha, lang);
    recibos.push({ id, lang, rota, pendente: c.pendente, titulo: c.titulo, valor_da_linha: linha.value, entrada: c.entrada, porta: c.porta,
      releituras_mostradas: c.mostradas, razao_lida: c.razao, ok: c.ok, todas: Object.values(c.ok).every(Boolean) });
  }
}
/* O conhecido-positivo: a mesma conferência sobre um recibo estragado em memória (a porta da atualização tirada, e a
   frase de que a página usa outro valor posta) tem de dar falso nas duas medidas, e o recibo intacto verdadeiro. */
const primeiro = recibos[0];
const linhaDoPrimeiro = load(fs.readFileSync(path.join('ledger', 'claims', `${primeiro.id}.yml`), 'utf8'));
const estragado = parse(fs.readFileSync(path.join(dist, primeiro.rota), 'utf8'));
estragado.querySelectorAll('[data-atualizacao-da-releitura]').forEach((e) => e.remove());
estragado.querySelector('main')?.insertAdjacentHTML('beforeend', '<span data-valor-em-uso>O valor do título é o que esta página usa.</span>');
/* C2-b: e o dia da publicação trocado pelo dia do acesso. */
estragado.querySelectorAll('[data-de-campo="published_at"]').forEach((e) => e.set_content(linhaDoPrimeiro.access_date.split('-').reverse().join('.')));
const noEstragado = conferir(estragado, linhaDoPrimeiro, primeiro.lang).ok;
const vePortaTirada = primeiro.todas && !noEstragado.diverge_abre_a_atualizacao && !noEstragado.sem_valor_em_uso && !noEstragado.published_at_no_recibo;
const saida = {
  _: 'Escrito por design/especime-v3/medicoes/cr2-2026-10-26/recibos-cr2.mjs. Não se edita à mão.',
  construcao: versao, recibos_lidos: recibos.length, recibos_certos: recibos.filter((x) => x.todas).length,
  conhecido_positivo: { o_que: 'num recibo estragado em memória (a porta da atualização tirada, a frase do valor em uso posta, o dia da publicação trocado pelo do acesso), as três medidas dão falso', encontrado: vePortaTirada },
  atualizados_certos: recibos.filter(x => !x.pendente && x.todas).length,
  pendentes_certos: recibos.filter(x => x.pendente && x.todas).length,
  recibos,
};
fs.writeFileSync(path.join(PASTA, 'd/recibos-cr2.json'), JSON.stringify(saida, null, 2) + '\n');
console.log(`C2 recibos: ${saida.recibos_certos} de ${saida.recibos_lidos} certos (construção ${String(versao.commit).slice(0, 8)})`);
for (const x of recibos.filter((y) => !y.todas)) console.log(`  · ${x.rota}: ${JSON.stringify(x.ok)}`);
process.exit(saida.recibos_certos === saida.recibos_lidos && vePortaTirada ? 0 : 1);
