/** Plantas das funções chamadas por check:cartao e auditaSelo, sem construir. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { parse } from 'node-html-parser';
import { getClaim } from '../../src/lib/ledger.mjs';
import { ladosDoLimiar } from '../../src/data/figuras.mjs';
import { REFERENCIAS_DAS_MEDIDAS } from '../../src/data/referencias-das-medidas.mjs';
import { auditarVeredicto, veredictoEsperado } from './veredicto.mjs';
import { compararAsDuasTestemunhas, referenciaNacionalDaLinha } from './referencias.mjs';
import { seloDoValorDoCartao } from '../../scripts/selo-do-cartao.mjs';

const self = fileURLToPath(import.meta.url);
const pasta = 'design/especime-v3/medicoes/b2-2026-09-23';
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
const casos = [];
for (const lang of ['pt', 'en']) {
  for (const id of ['divida-publica-2025', 'divida-das-familias-2025', 'saldo-da-balanca-corrente-2025']) {
    const e = veredictoEsperado(id, lang);
    const bom = `<article><span class="sq sq-${e.estado}"></span><span class="est-${e.estado}" data-veredicto-referencia="${e.estado}">${e.texto}</span></article>`;
    for (const [nome, mau] of [
      ['cor-sem-palavra', bom.replace(e.texto, '')],
      ['cor-trocada', bom.replace(`sq-${e.estado}`, `sq-${e.estado === 'fora' ? 'dentro' : 'fora'}`)],
      ['direcao-trocada', bom.replace(e.texto, e.texto.replace(/acima de|above|abaixo de|below|entre|between/, 'direção trocada'))],
    ]) casos.push({ nome: `K15-${nome}-${id}-${lang}`, bom, mau, ler: h => auditarVeredicto(parse(h), id, lang) });
  }
}
for (const id of ['saldo-das-administracoes-publicas-2025', 'crescimento-da-despesa-liquida-2025']) {
  const r = REFERENCIAS_DAS_MEDIDAS.get(id);
  const bom = JSON.stringify(getClaim(id));
  const ler = h => {
    const segunda = referenciaNacionalDaLinha(id, JSON.parse(h));
    return !segunda ? ['K9: falta a segunda testemunha'] : [compararAsDuasTestemunhas(id, segunda, ladosDoLimiar(r.limiar), false)].filter(Boolean);
  };
  const linha = JSON.parse(bom);
  const campo = id.startsWith('saldo-') ? 'note' : 'excerpt';
  const mau = JSON.stringify({ ...linha, [campo]: linha[campo].replace(id.startsWith('saldo-') ? 'limiar de 3 %' : 'crescimento de 5%', id.startsWith('saldo-') ? 'limiar de 4 %' : 'crescimento de 6%') });
  casos.push({ nome: `K9-numero-${id}`, bom, mau, ler });
  casos.push({ nome: `K9-sem-testemunha-${id}`, bom, mau: JSON.stringify({ ...linha, note: '', excerpt: '' }), ler });
}
{
  const id = 'precos-da-habitacao-2025', alvo = `/livro-razao/${id}`;
  const bom = `<article data-cartao-medida="${id}"><p class="cartao-medida-valor"><span class="cartao-medida-quantidade"><span data-claim="${id}">${getClaim(id).value}</span><span data-linha-campo="unit" data-linha-claim="${id}">${getClaim(id).unit}</span></span><a class="src-chip" href="${alvo}"></a></p></article>`;
  const ler = h => seloDoValorDoCartao(parse(h).querySelector('[data-claim]'), id, alvo) ? [] : ['auditaSelo: sem selo para a sua própria linha'];
  for (const [nome, mau] of [
    ['retirado', bom.replace(/<a class.*?<\/a>/, '')],
    ['trocado', bom.replace(`href="${alvo}"`, 'href="/livro-razao/divida-publica-2025"')],
    ['afastado', bom.replace(/(<a class.*?<\/a>)(<\/p>)/, '$2$1')],
    ['duplicado', bom.replace('</p>', `<a class="src-chip" href="${alvo}"></a></p>`)],
  ]) casos.push({ nome: `selo-${nome}`, bom, mau, ler });
}
if (process.argv[2] === '--filho') {
  const caso = casos.find(c => c.nome === process.argv[3]);
  if (!caso) throw new Error('planta desconhecida');
  const erros = caso.ler(process.argv[4] === 'mau' ? caso.mau : caso.bom);
  console.log(erros.length ? erros.join('\n') : `${caso.nome}: sem defeito`);
  process.exit(erros.length ? 1 : 0);
}
fs.mkdirSync(pasta, { recursive: true });
const resultados = casos.map(c => {
  const correr = estado => spawnSync(process.execPath, [self, '--filho', c.nome, estado], { encoding: 'utf8' });
  const antes = correr('bom'), planta = correr('mau'), reposto = correr('bom');
  const ficheiro = path.join(pasta, `planta-cartao-${c.nome}.txt`);
  fs.writeFileSync(ficheiro, `Antes (${antes.status})\n${antes.stdout}${antes.stderr}Planta (${planta.status})\n${planta.stdout}${planta.stderr}Reposto (${reposto.status})\n${reposto.stdout}${reposto.stderr}`);
  return { grupo: 'cartao-b2', nome: c.nome, ficheiro, comando: `node tests/cartao/plantas-b2.mjs --filho ${c.nome} mau`, codigo: planta.status, passou: antes.status === 0 && planta.status === 1 && reposto.status === 0, antes: sha(c.bom), reposto: sha(c.bom) };
});
fs.writeFileSync(path.join(pasta, 'plantas-cartao-b2.json'), JSON.stringify(resultados, null, 2) + '\n');
console.log(`${resultados.filter(r => r.passou).length} de ${resultados.length} plantas passaram`);
process.exit(resultados.every(r => r.passou) ? 0 : 1);
