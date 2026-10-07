/** Cópias com estragos para a leitura a frio, sem alterar a declaração nem o HTML construído.
 * Uso: node design/especime-v3/medicoes/rp4n-2026-10-06/plantar-copias.mjs
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {parse} from 'node-html-parser';
import {ORIGENS_DAS_DEFINICOES} from '../../../../src/data/figuras.mjs';
import {auditarPerguntas} from '../../../../tests/cartao/perguntas.mjs';
import {conferirAuditoriaDasFamilias} from '../../../../tests/cartao/familias.mjs';
import {conferirSemMarcadores} from '../../../../scripts/sem-marcadores.mjs';

const pasta = 'design/especime-v3/medicoes/rp4n-2026-10-06/leitura-frio';
fs.mkdirSync(pasta, {recursive:true});
const plantas = [];
for (const [nome, altera] of [
  ['excerto', o => {o.excerto += ' PALAVRA PLANTADA';}],
  ['cliente', o => {o.selo.cliente = 'cliente inventado';}],
  ['pagina', o => {o.extracao.pagina++;}],
]) {
  const copia = structuredClone(ORIGENS_DAS_DEFINICOES);
  altera(copia['rp4n-orcamento']);
  const ficheiro = `${pasta}/${nome}.json`;
  fs.writeFileSync(ficheiro, JSON.stringify(copia,null,2)+'\n');
  const erros = auditarPerguntas({origens:JSON.parse(fs.readFileSync(ficheiro))}).erros;
  const mensagem = 'o excerto ou o selo difere da origem exportada pelo motor';
  assert(erros.some(e => e.includes(mensagem)), `${nome}: a planta não mordeu pela mensagem esperada`);
  plantas.push({ficheiro,mensagem});
}
{
  const copia = JSON.parse(fs.readFileSync('tests/cartao/leituras-provadas.json'));
  copia.familias.find(e => e.chaves?.includes('oe-2026-despesa-funcao-01')).folhas[0].partes[0].apoios.push({declaracao:'nome',lingua:'pt',literal:'orçamentada'});
  const ficheiro = `${pasta}/nome.json`;
  fs.writeFileSync(ficheiro,JSON.stringify(copia,null,2)+'\n');
  const mensagem = 'o nome do projeto não pode apoiar uma frase';
  const erros = conferirAuditoriaDasFamilias({auditoria:JSON.parse(fs.readFileSync(ficheiro))}).erros;
  assert(erros.some(e => e.includes(mensagem)));
  plantas.push({ficheiro,mensagem});
}
{
  const copia = parse(fs.readFileSync('dist/livro-razao/posicao-de-investimento-internacional-2025/index.html','utf8'));
  assert.equal(conferirSemMarcadores(copia),null);
  copia.querySelector('main').insertAdjacentHTML('beforeend','<p>[a <b>verificar</b>]</p>');
  const ficheiro = `${pasta}/marcador.html`;
  fs.writeFileSync(ficheiro,copia.toString());
  const mensagem = 'RP4N: uma página de leitor contém uma marca de informação por confirmar';
  assert.equal(conferirSemMarcadores(parse(fs.readFileSync(ficheiro,'utf8'))),mensagem);
  plantas.push({ficheiro,mensagem});
}
for (const planta of plantas) planta.sha256 = createHash('sha256').update(fs.readFileSync(planta.ficheiro)).digest('hex');
fs.writeFileSync(`${pasta}/plantas.json`,JSON.stringify({comando:'node design/especime-v3/medicoes/rp4n-2026-10-06/plantar-copias.mjs',plantas},null,2)+'\n');
console.log(`Cópias para leitura a frio: PASS, ${plantas.length} plantas com a mensagem afirmada`);
