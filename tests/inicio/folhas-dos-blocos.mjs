/**
 * AS FOLHAS DE UM BLOCO DA PRIMEIRA PÁGINA, nas duas edições ao mesmo tempo (bloco PP1).
 *
 * Uma folha é um pedaço de palavras fixas, com o sítio dele na declaração. As duas edições
 * têm de ter a mesma forma (as mesmas partes, os mesmos ramos, as mesmas linhas, os mesmos
 * algarismos declarados), e uma diferença atira: uma edição a dizer uma coisa que a outra não
 * diz é um defeito da declaração, e não uma tradução. É a regra de `folhasDaLeitura()` da K17
 * (`tests/cartao/leituras.mjs`), com a gramática da primeira página: as linhas nomeiam-se pelo
 * identificador, e um nó `compara` tem os ramos `menor`, `maior` e `igual`.
 *
 * Cada folha diz também de que CONDIÇÕES depende a parte onde vive (as do bloco, ou as da peça),
 * para a auditoria poder exigir que uma palavra de conta esteja guardada por uma condição
 * declarada.
 */

/**
 * @typedef {{ caminho: string, pt?: string, en?: string, nl?: string, motivo?: string, dentroDeRamo: boolean, condicoes: 'bloco'|string }} FolhaDoBloco
 */

/**
 * @param {any} b o bloco declarado
 * @returns {FolhaDoBloco[]}
 */
export function folhasDoBloco(b) {
  /** @type {FolhaDoBloco[]} */
  const out = [];
  /** @param {any} a @param {any} x @param {string} c @param {boolean} ramo @param {string} guarda */
  const anda = (a, x, c, ramo, guarda) => {
    if (typeof a === 'string') {
      if (typeof x !== 'string') throw new Error(`${b.id}: as duas edições têm formas diferentes em ${c}`);
      out.push({ caminho: c, pt: a, en: x, dentroDeRamo: ramo, condicoes: guarda });
      return;
    }
    if (Array.isArray(a)) {
      if (!Array.isArray(x)) throw new Error(`${b.id}: as duas edições têm formas diferentes em ${c}`);
      /* A FORMA CANÓNICA: o texto entre dois pedaços calculados, que pode ser vazio numa
         edição e não na outra («… aos 64 anos» e «… to 64»). O que tem de ser igual nas duas
         são os pedaços calculados, pela mesma ordem; o texto entre eles é a folha. */
      const canonica = (/** @type {any[]} */ lista) => {
        const textos = [''], calculados = [];
        for (const p of lista) {
          if (typeof p === 'string') textos[textos.length - 1] += p;
          else { calculados.push(p); textos.push(''); }
        }
        return { textos, calculados };
      };
      const ca = canonica(a), cx = canonica(x);
      if (ca.calculados.length !== cx.calculados.length) throw new Error(`${b.id}: as duas edições têm formas diferentes em ${c}`);
      ca.textos.forEach((ta, i) => {
        const tx = cx.textos[i];
        if (ta !== '' || tx !== '') {
          if (ta === '' || tx === '') out.push({ caminho: `${c}[${2 * i}]`, pt: ta, en: tx, dentroDeRamo: ramo, condicoes: guarda });
          else anda(ta, tx, `${c}[${2 * i}]`, ramo, guarda);
        }
        if (i < ca.calculados.length) anda(ca.calculados[i], cx.calculados[i], `${c}[${2 * i + 1}]`, ramo, guarda);
      });
      return;
    }
    const ka = Object.keys(a ?? {}).sort().join(','), kx = Object.keys(x ?? {}).sort().join(',');
    if (ka !== kx) throw new Error(`${b.id}: as duas edições têm pedaços diferentes em ${c} (${ka} / ${kx})`);
    if ('compara' in a) {
      if (JSON.stringify(a.compara) !== JSON.stringify(x.compara)) throw new Error(`${b.id}: as duas edições comparam linhas diferentes em ${c}`);
      for (const r of ['menor', 'maior', 'igual']) anda(a[r], x[r], `${c}.${r}`, true, guarda);
      return;
    }
    if ('nl' in a) {
      if (a.nl !== x.nl || a.motivo !== x.motivo) throw new Error(`${b.id}: as duas edições têm algarismos diferentes em ${c}`);
      out.push({ caminho: c, nl: a.nl, motivo: a.motivo, dentroDeRamo: ramo, condicoes: guarda });
      return;
    }
    if ('claim' in a && a.sufixo !== x.sufixo) {
      const { sufixo: sa, ...ca } = a, { sufixo: sx, ...cx } = x;
      if (typeof sa !== 'string' || typeof sx !== 'string' || JSON.stringify(ca) !== JSON.stringify(cx)) {
        throw new Error(`${b.id}: as duas edições têm pedaços calculados diferentes em ${c}`);
      }
      out.push({ caminho: `${c}.sufixo`, pt: sa, en: sx, dentroDeRamo: ramo, condicoes: guarda });
      return;
    }
    if (JSON.stringify(a) !== JSON.stringify(x)) throw new Error(`${b.id}: as duas edições têm pedaços calculados diferentes em ${c}`);
  };
  /** @param {any} par @param {string} c @param {string} guarda */
  const duas = (par, c, guarda) => { if (par) anda(par.pt, par.en, c, false, guarda); };
  duas(b.titulo, 'titulo', 'bloco');
  duas(b.frase, 'frase', 'bloco');
  duas(b.desenho?.legenda, 'desenho.legenda', 'bloco');
  for (const [i, p] of (b.desenho?.paineis ?? b.desenho?.pares ?? []).entries()) duas(p.titulo, `desenho.${b.desenho.paineis ? 'paineis' : 'pares'}[${i}].titulo`, 'bloco');
  for (const p of b.pecas ?? []) {
    duas({ pt: p.pt, en: p.en }, `pecas.${p.id}`, `peca:${p.id}`);
    duas(p.titulo, `pecas.${p.id}.titulo`, `peca:${p.id}`);
  }
  duas(b.ressalva, 'ressalva', 'bloco');
  return out;
}
