/**
 * A FRASE «O QUE É» DE UMA LINHA DE CADA FAMÍLIA DO PF1 (a correção EX4-b, 21.10.2026), nas duas edições, como
 * `oQueEDaLinha` a devolve (é o que o recibo imprime): os pedaços de texto como estão, o período pelo valor que a linha
 * dá. Não é lida do `dist/`, porque a construção da correção parou antes dos recibos (o relatório diz porquê). Corre-se da
 * raiz: `node design/especime-v3/medicoes/ex4-2026-10-21/familias-ex4b.mjs [--json <ficheiro>]`.
 */
import fs from 'node:fs';
import { oQueEDaLinha } from '../../../../src/lib/o-que-e-o-numero.mjs';
import { getClaim } from '../../../../src/lib/ledger.mjs';

const UMA = ['oe-2027-despesa-funcao-07-mapa', 'oe-2026-despesa-funcao-07-mapa', 'oe-2027-despesa-subfuncao-01-7-mapa', 'oe-2027-despesa-total-mapa',
  'oe-2027-despesa-total-consolidada-mapa', 'oe-2027-cem-euros-funcao-07-mapa', 'oe-2027-cem-euros-funcao-07-sem-divida-mapa',
  'oe-2027-despesa-sem-divida-mapa', 'oe-2027-despesa-funcao-01-sem-divida-mapa', 'der-oe2027-funcao-07-variacao-pct', 'der-oe2027-despesa-total-mapa-variacao-pct'];
const texto = (/** @type {any[]} */ ps) => ps.map((p) => (typeof p === 'string' ? p : p?.data ? p.data.valor : p?.claim ? getClaim(p.claim).value : p?.verbatim ? `[verbatim:${p.verbatim}]` : Array.isArray(p) ? texto(p) : '')).join('');
const out = UMA.map((id) => ({ id, pt: texto(oQueEDaLinha(id, 'pt').pedacos), en: texto(oQueEDaLinha(id, 'en').pedacos) }));
const j = process.argv.indexOf('--json');
if (j > 0) fs.writeFileSync(process.argv[j + 1], JSON.stringify(out, null, 2) + '\n');
for (const x of out) console.log(`${x.id}\n  pt: ${x.pt}\n  en: ${x.en}`);
