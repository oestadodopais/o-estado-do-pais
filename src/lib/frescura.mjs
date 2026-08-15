/**
 * `lastmod` do mapa do sítio — honesto por tipo de página, ou ausente.
 *
 * O mapa do sítio não tinha `lastmod` nenhum. A tentação óbvia é carimbar a
 * data da construção em todas as 260 linhas, e isso seria uma mentira em massa:
 * diria a um motor de busca que 264 páginas de linha mudaram hoje porque o
 * sítio foi reconstruído hoje. **Um carimbo de build não é uma data de
 * alteração.**
 *
 * Por isso cada tipo de página tem a sua data, e cada uma vem de um sítio onde
 * a alteração está mesmo registada:
 *
 * | Tipo | De onde vem |
 * |---|---|
 * | página de linha | a mais recente entre `access_date` e a data da última correcção da linha; numa linha derivada, a mais recente das linhas de origem, que é quando os dados que a produzem foram lidos |
 * | página de estudo | as datas do arquivo (`src/data/studies.mjs`), quando existem |
 * | página de conteúdo | a data do último **commit** que tocou o gabarito ou os dados que a compõem |
 *
 * **E quando não há data honesta, não há `lastmod`.** Uma página de estudo com
 * `date: null` não entra com a data de hoje: fica sem `lastmod`, que é o que o
 * protocolo permite e o que corresponde à verdade — não se sabe. O mesmo se o
 * `git` não estiver disponível onde a construção acontece: nesse caso as
 * páginas de conteúdo ficam todas sem `lastmod`, e nenhuma ganha um carimbo
 * inventado. Ver DECISIONS §1.36, item 10.
 */

import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadClaims } from './ledger.mjs';
import { WORKS } from '../data/studies.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/** AAAA-MM-DD → Date, ou null. Nunca «hoje» como recurso. */
function comoData(iso) {
  if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(iso)) return null;
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function maisRecente(datas) {
  const validas = datas.filter(Boolean);
  if (!validas.length) return null;
  return validas.reduce((a, b) => (a > b ? a : b));
}

/**
 * A data do último commit que tocou qualquer um destes ficheiros.
 *
 * `execFileSync`, sem shell. Se o `git` não existir, se não houver repositório,
 * ou se o ficheiro nunca tiver sido commitado, devolve `null` — e a página fica
 * sem `lastmod`. Não há recurso à data de hoje: era exactamente essa a mentira
 * que este módulo existe para não contar.
 */
const cacheGit = new Map();
function dataDoCommit(ficheiros) {
  const chave = ficheiros.join('|');
  if (cacheGit.has(chave)) return cacheGit.get(chave);
  let out = null;
  try {
    const texto = execFileSync(
      'git',
      ['log', '-1', '--format=%cI', '--', ...ficheiros],
      { cwd: RAIZ, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    ).trim();
    out = texto ? new Date(texto) : null;
    if (out && Number.isNaN(out.getTime())) out = null;
  } catch {
    out = null;
  }
  cacheGit.set(chave, out);
  return out;
}

/** Os ficheiros que compõem cada página de conteúdo. */
const FONTES = {
  home: [
    'src/views/HomeView.astro',
    'src/components/InstrumentoConvergencia.astro',
    'src/components/InstrumentoMapa.astro',
    'src/data/figuras.mjs',
    'src/data/regioes.mjs',
    'src/data/verificacao.mjs',
    'src/i18n/strings.mjs',
  ],
  metodo: ['src/views/MetodoView.astro', 'src/data/metodo.mjs', 'src/data/correcoes.mjs'],
  estudos: ['src/views/EstudosView.astro', 'src/data/studies.mjs'],
  livro: ['src/views/LivroView.astro'],
  municipios: ['src/views/MunicipiosView.astro', 'src/data/caop-centroids.mjs', 'src/data/municipios.mjs'],
  municipio: ['src/views/MunicipioView.astro', 'src/data/municipios.mjs', 'src/data/leituras.mjs'],
  marcador: ['src/views/MarcadorView.astro'],
};

/** A data de uma linha: quando foi lida, ou quando foi corrigida — a mais recente. */
function dataDaLinha(id, claims, vistos = new Set()) {
  const claim = claims.get(id);
  if (!claim || vistos.has(id)) return null;
  vistos.add(id);
  const proprias = [
    comoData(claim.access_date),
    ...(claim.corrections ?? []).map((c) => comoData(c.date)),
  ];
  const dosPais = (claim.derived_from ?? []).map((p) => dataDaLinha(p, claims, vistos));
  return maisRecente([...proprias, ...dosPais]);
}

/** A data de um estudo: a mais recente das datas que o arquivo conhece. */
function dataDoEstudo(slug) {
  const work = WORKS.find((w) => w.slug === slug);
  if (!work) return null;
  return maisRecente(
    work.editions.flatMap((e) => [comoData(e.date), comoData(e.updated)]),
  );
}

/**
 * `lastmod` de uma rota, ou `null`.
 * @param {{key: string, params: {slug?: string}}|null} rota
 * @returns {Date|null}
 */
export function lastmodDe(rota) {
  if (!rota) return null;
  if (rota.key === 'linha') return dataDaLinha(rota.params.slug ?? '', loadClaims());
  if (rota.key === 'estudo') return dataDoEstudo(rota.params.slug ?? '');
  const ficheiros = FONTES[rota.key];
  return ficheiros ? dataDoCommit(ficheiros) : null;
}
