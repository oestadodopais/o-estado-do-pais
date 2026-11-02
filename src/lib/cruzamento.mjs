import crypto from 'node:crypto';
import { projecaoLinha } from './projecao-linha.mjs';
/**
 * O registo de travessia das LINHAS, lido ao contrário: da linha do motor para
 * a linha do livro-razão deste sítio.
 *
 * `ledger/cruzamentos/<estudo>.json` é escrito por
 * `ResearchHub/publisher/export_site_rows.py` e guarda, por linha do sítio, de
 * que estudo e de que linha do motor ela veio (`rh_study`, `rh_id`). A página de
 * leitura precisa da pergunta ao contrário: **esta linha do motor tem linha
 * neste livro-razão?** — porque é essa a resposta que decide se uma figura leva
 * o selo (que abre a linha) ou a porta (que abre a sua entrada em «As linhas
 * deste documento»).
 *
 * `check-cruzamento.mjs` já confere estes ficheiros a cada construção, e não
 * passa por aqui: uma conferência que usasse o código das páginas confirmava-se
 * a si própria. Este módulo é só a leitura, para as páginas usarem.
 *
 * **É o `row` escolhido que decide, e não os `others[]` de uma figura.** Uma
 * figura cujo valor caberia em mais do que uma linha traz a lista das outras, e
 * o exportador do motor escolheu uma com o contexto documentado no
 * `core/receipts.py`. Ir buscar a linha do sítio por um `others[]` seria a
 * página a escolher outra vez, com menos contexto do que quem escolheu.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * A razão de um erro apanhado, para a frase que se atira por cima dele.
 *
 * Um `catch` recebe o que quer que tenha sido atirado, e não um `Error`: a
 * pergunta faz-se, e o que não for um erro diz-se como está. A versão anterior
 * escrevia `/** @type {any} *\/` no `catch` e lia `.message` às cegas, o que
 * imprimia «undefined» no dia em que alguém atirasse uma cadeia (segunda
 * passagem do bloco F0.4, leitura a frio, Major 16).
 *
 * @param {unknown} erro
 * @returns {string}
 */
function razaoDoErro(erro) {
  return erro instanceof Error ? erro.message : String(erro);
}


const AQUI = path.dirname(fileURLToPath(import.meta.url));

/** A pasta dos registos de travessia, procurada a subir como a dos registos. */
function encontraCruzamentos() {
  /** @type {string[]} */
  const candidatos = [];
  if (process.env.OEDP_CRUZAMENTOS_DIR) candidatos.push(process.env.OEDP_CRUZAMENTOS_DIR);
  /** @param {string} inicio */
  const subir = (inicio) => {
    let dir = inicio;
    for (let i = 0; i < 8; i++) {
      candidatos.push(path.join(dir, 'ledger', 'cruzamentos'));
      const acima = path.dirname(dir);
      if (acima === dir) break;
      dir = acima;
    }
  };
  subir(process.cwd());
  subir(AQUI);
  for (const c of candidatos) {
    try {
      if (fs.statSync(c).isDirectory()) return c;
    } catch {
      /* segue */
    }
  }
  return null;
}

/** @type {Map<string, string> | null} */
let CACHE = null;

/**
 * O mapa `"<rh_study>\0<rh_id>" → <id da linha do sítio>`, lido uma vez.
 *
 * A chave leva o estudo do motor à cabeça porque um identificador de linha do
 * motor só é único dentro do seu estudo: dois estudos podem ter uma linha com o
 * mesmo nome, e uni-las seria prometer uma linha de outro documento.
 */
function mapa() {
  if (CACHE) return CACHE;
  CACHE = new Map();
  const dir = encontraCruzamentos();
  if (!dir) return CACHE;
  for (const ficheiro of fs.readdirSync(dir).sort()) {
    if (!ficheiro.endsWith('.json')) continue;
    let doc;
    try {
      doc = JSON.parse(fs.readFileSync(path.join(dir, ficheiro), 'utf8'));
    } catch (erro) {
      throw new Error(`cruzamento: ${ficheiro} não é JSON legível: ${razaoDoErro(erro)}`);
    }
    for (const [siteId, bruto] of Object.entries(doc?.rows ?? {})) {
      const linha = /** @type {Record<string, any> | null} */ (bruto);
      if (!linha?.rh_study || !linha?.rh_id) continue;
      CACHE.set(`${linha.rh_study}\0${linha.rh_id}`, siteId);
    }
  }
  // HB1: estas quatro linhas partiram do próprio sítio. A cópia só resolve
  // enquanto o conteúdo, fora da história das releituras, continuar igual.
  const prova = path.join(dir, '..', 'provas', 'hb1', 'series.json');
  if (fs.existsSync(prova)) {
    const p = JSON.parse(fs.readFileSync(prova, 'utf8'));
    if (p.rh_study !== '28 Habitacao Estudo') throw new Error('HB1: origem inesperada');
    for (const [id, item] of Object.entries(p.rows)) {
      const r = /** @type {{file:string,sha256:string}} */ (item);
      if (!/^[a-z0-9-]+$/.test(id) || r.file !== `ledger/claims/${id}.yml`) throw new Error('HB1: caminho de série inválido');
      const bytes = fs.readFileSync(path.join(dir, '..', 'claims', `${id}.yml`));
      if (crypto.createHash('sha256').update(projecaoLinha(bytes)).digest('hex') !== r.sha256) throw new Error('HB1: recompor a série alterada '+id);
      CACHE.set(`${p.rh_study}\0${id}`, id);
    }
  }
  return CACHE;
}

/**
 * A pergunta que a página de leitura faz, uma vez por edição.
 *
 * UM ESTUDO COMPOSTO (bloco E1, 01.10.2026) guarda as linhas das verticais de
 * onde veio, byte a byte, e a travessia das linhas continua a nomeá-las pela
 * vertical onde foram medidas. A entrada do seu registo traz `rh_origens`, a
 * vertical de cada linha que atravessa, e é por ela que a chave se faz; uma
 * linha que o mapa não nomeia procura-se no próprio estudo, como antes.
 *
 * @param {string} rhStudy o estudo do motor, como o `registos/manifest.json` o diz
 * @param {Record<string, string>} [origens] a vertical de cada linha de um estudo composto
 * @returns {(row: string) => (string|null)} da linha do motor para a linha do sítio
 */
export function linhaDoSitioDoEstudo(rhStudy, origens = {}) {
  const m = mapa();
  return (row) => m.get(`${origens[row] ?? rhStudy}\0${row}`) ?? null;
}

/** Quantas linhas atravessaram, ao todo. Serve para uma medição, não para uma página. */
export function totalDeLinhasCruzadas() {
  return mapa().size;
}
