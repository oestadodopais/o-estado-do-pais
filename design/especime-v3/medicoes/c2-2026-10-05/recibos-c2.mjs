/** C2 (05.10.2026): os dezoito recibos das nove linhas relidas (as duas edições), lidos no `dist/` construído.
 *
 * Para cada recibo confere, com leitor próprio sobre o HTML e o livro-razão (sem chamar as funções da página): o valor
 * do título é o `value` da linha; a história tem a entrada da atualização de 05.10.2026 com a razão na língua da
 * edição, carácter a carácter; a releitura «diverge» de 05.10 abre essa entrada (`data-atualizacao-da-releitura`,
 * com destino na página); a releitura «igual» de 05.10 é a mais recente; e nenhuma frase diz que a página usa um valor
 * diferente do que a fonte publica. Escreve `recibos-c2.json` ao lado, com a construção que leu (`version.json`).
 *
 * Uso (da raiz do sítio): node design/especime-v3/medicoes/c2-2026-10-05/recibos-c2.mjs [dist]
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { load } from 'js-yaml';

const PASTA = 'design/especime-v3/medicoes/c2-2026-10-05';
const dist = path.resolve(process.argv[2] ?? 'dist');
const NOVE = [
  'custo-unitario-do-trabalho-2024', 'despesa-em-id-2024-ue', 'formacao-bruta-de-capital-fixo-2024',
  'formacao-bruta-de-capital-fixo-2025', 'pib-real-per-capita-2024', 'pib-real-per-capita-2025',
  'posicao-de-investimento-internacional-2024', 'posicao-de-investimento-internacional-2025',
  'saldo-da-balanca-corrente-2024',
];
const limpo = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const versao = JSON.parse(fs.readFileSync(path.join(dist, 'version.json'), 'utf8'));
/** A conferência de um recibo, sobre a árvore do HTML; é a mesma para os recibos lidos e para o estragado. */
function conferir(r, linha, lang) {
  const n = linha.corrections.findIndex((c) => c.kind === 'atualizacao' && c.date === '2026-10-05');
  const iDiverge = linha.verifications.findIndex((v) => v.date === '2026-10-05' && v.result === 'diverge');
  const iIgual = linha.verifications.findIndex((v) => v.date === '2026-10-05' && v.result === 'igual');
  const titulo = limpo(r.querySelector('h1.linha-valor [data-claim]')?.textContent);
  const alvo = r.querySelector(`#alteracao-${n}`);
  const razao = alvo ? limpo(alvo.querySelector('[data-correcao-campo="reason"]')?.textContent) : null;
  const esperada = limpo(lang === 'pt' ? linha.corrections[n]?.reason : linha.corrections[n]?.reason_en);
  const diverge = r.querySelector(`[data-linha-verificacao="${iDiverge}"]`);
  const porta = diverge?.querySelector('[data-atualizacao-da-releitura]')?.getAttribute('href') ?? null;
  const mostradas = r.querySelectorAll('[data-linha-verificacao]').map((e) => Number(e.getAttribute('data-linha-verificacao')));
  const ok = {
    valor_no_titulo: titulo === limpo(linha.value),
    entrada_da_atualizacao: n >= 0 && Boolean(alvo),
    razao_na_lingua_da_edicao: razao !== null && razao === esperada,
    diverge_abre_a_atualizacao: porta === `#alteracao-${n}`,
    igual_de_05_10_a_mais_recente: iIgual === linha.verifications.length - 1 && mostradas[0] === iIgual,
    sem_valor_em_uso: r.querySelectorAll('[data-valor-em-uso]').length === 0,
    /* C2-b: o dia em que a fonte publicou, como a linha o declara, na forma da casa (DD.MM.AAAA), escrita aqui. */
    published_at_no_recibo: typeof linha.published_at === 'string'
      && r.querySelectorAll('[data-de-campo="published_at"]').length === 1
      && limpo(r.querySelector('[data-de-campo="published_at"]')?.textContent) === linha.published_at.split('-').reverse().join('.'),
  };
  return { titulo, entrada: n, porta, mostradas, razao, ok };
}
const recibos = [];
for (const id of NOVE) {
  const linha = load(fs.readFileSync(path.join('ledger', 'claims', `${id}.yml`), 'utf8'));
  for (const [lang, rota] of [['pt', `livro-razao/${id}/index.html`], ['en', `en/ledger/${id}/index.html`]]) {
    const c = conferir(parse(fs.readFileSync(path.join(dist, rota), 'utf8')), linha, lang);
    recibos.push({ id, lang, rota, titulo: c.titulo, valor_da_linha: linha.value, entrada: c.entrada, porta: c.porta,
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
  _: 'Escrito por design/especime-v3/medicoes/c2-2026-10-05/recibos-c2.mjs. Não se edita à mão.',
  construcao: versao, recibos_lidos: recibos.length, recibos_certos: recibos.filter((x) => x.todas).length,
  conhecido_positivo: { o_que: 'num recibo estragado em memória (a porta da atualização tirada, a frase do valor em uso posta, o dia da publicação trocado pelo do acesso), as três medidas dão falso', encontrado: vePortaTirada },
  recibos,
};
fs.writeFileSync(path.join(PASTA, 'recibos-c2.json'), JSON.stringify(saida, null, 2) + '\n');
console.log(`C2 recibos: ${saida.recibos_certos} de ${saida.recibos_lidos} certos (construção ${String(versao.commit).slice(0, 8)})`);
for (const x of recibos.filter((y) => !y.todas)) console.log(`  · ${x.rota}: ${JSON.stringify(x.ok)}`);
process.exit(saida.recibos_certos === saida.recibos_lidos && vePortaTirada ? 0 : 1);
