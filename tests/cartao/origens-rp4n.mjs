/** RP4-n: o selo documental e o excerto têm de ser os exportados pelo motor.
 * O motor relê os bytes, os recibos, as páginas e os caminhos antes de exportar.
 * Deste lado confere-se também o resumo preso ao registo da travessia.
 */
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';

const caminho = new URL('../../src/data/origens-rp4n.json', import.meta.url);
const registo = new URL('../../ledger/cruzamentos/origens-rp4n.json', import.meta.url);

export function conferirOrigemRP4N(chave, origem) {
  const bytes = fs.readFileSync(caminho);
  const r = JSON.parse(fs.readFileSync(registo, 'utf8')).files['origens-rp4n.json'];
  const resumo = createHash('sha256').update(bytes).digest('hex');
  if (r.exported_sha256 !== resumo || r.origin_sha256 !== resumo || r.origin_path !== 'content/13 Dominios/origens-rp4n.json') {
    return 'a exportação documental difere do registo da travessia';
  }
  const fonte = JSON.parse(bytes)[chave];
  if (!fonte || !isDeepStrictEqual(origem, fonte)) return 'o excerto ou o selo difere da origem exportada pelo motor';
  const s = fonte.selo;
  if (!/^https:\/\/\S+$/.test(fonte.url) || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(s.hora) || fonte.lido !== s.hora.slice(0,10) || !/^[0-9a-f]{64}$/.test(s.sha256) || !s.campo || !s.cliente || !s.motor.startsWith('content/')) {
    return 'a origem exportada não tem o selo completo';
  }
  if (!fonte.extracao || (!fonte.extracao.pagina && !fonte.extracao.caminho)) return 'a origem exportada não identifica a página nem o caminho';
  return null;
}
