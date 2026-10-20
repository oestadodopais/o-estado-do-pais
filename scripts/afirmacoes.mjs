/** V2-a: palavras, atribuição, data, porta e valor contra o corpo HTTP selado. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {parse} from 'node-html-parser';
import assert from 'node:assert/strict';
import {conferirAfirmacoesV2d} from './afirmacoes-v2d.mjs';

const normal = s => String(s ?? '').replace(/\s+/g, ' ').trim();
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
export function textoDoCorpo(raw) {
  const tree=parse(raw.toString('utf8').replace(/<!--[\s\S]*?-->/g,''));
  tree.querySelectorAll('script,style,head').forEach(e=>e.remove());
  return normal(tree.innerHTML.replace(/<[^>]+>/g,' ').replace(/&(?:#[xX][\da-fA-F]+|#\d+|\w+);/g,e=>parse(e).textContent));
}
export const MESES_PT=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
export function dataDoPcp(text) {
  const m=text.match(new RegExp(`(\\d+) (${MESES_PT.join('|')}) (\\d{4}), Assembleia da República`,'i'));
  if(!m)return null;
  const value=`${m[3]}-${String(MESES_PT.indexOf(m[2].toLowerCase())+1).padStart(2,'0')}-${m[1].padStart(2,'0')}`;
  return !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10)===value ? value : null;
}
export function conferirAfirmacao(c,p,raw) {
  const errors=[];
  if (!p) return ['V2A selo: falta a prova'];
  if (!/^[a-f0-9]{64}$/.test(p.sha256 ?? '') || path.basename(p.file)!==p.file || p.motor_path !== `content/15 Orcamento do Estado 2027/source/v2a/${p.file}` || !/^\d{4}-\d{2}-\d{2}T/.test(p.acedido_em ?? '')) errors.push('V2A referência: falta o selo, a data ou o caminho relativo no motor');
  if (raw && sha(raw)!==p.sha256) errors.push('V2A selo: sha256 diferente do corpo alojado');
  const text=raw ? textoDoCorpo(raw) : null;
  if (normal(c.excerpt)!==normal(p.excerpt) || (text !== null && !text.includes(normal(c.excerpt)))) errors.push('V2A excerto: palavras diferentes do corpo alojado');
  const author=raw && p.attribution_scope==='article-author' ? parse(raw.toString('utf8')).querySelectorAll('[itemprop="author"] [itemprop="name"]').map(x=>x.getAttribute('content')) : null;
  if (JSON.stringify(c.attributed_to)!==JSON.stringify(p.attributed_to) || (text !== null && (author ? author.length!==1 || author[0]!==p.attribution_anchor : !text.includes(p.attribution_anchor)))) errors.push('V2A atribuição: difere da autoria no documento');
  let date=raw ? undefined : p.published_at;
  if (raw && p.file==='pcp-afirmacao.html') {
    date=dataDoPcp(text);
  } else if (raw) date=raw.toString('utf8').match(/<time[^>]+datetime="(\d{4}-\d{2}-\d{2})T/)?.[1];
  if (!date || c.published_at!==date || c.reference_date!==date || p.published_at!==date) errors.push('V2A data: difere da data do documento');
  if (c.source_url!==p.pedido) errors.push('V2A porta: difere do pedido registado');
  const v=normal(c.value).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  if (!v || normal(c.value)!==normal(p.value) || !new RegExp(`(?<![\\d,.])${v}(?![\\d,.])`).test(normal(c.excerpt))) errors.push('V2A valor: não aparece no excerto selado');
  if (c.unit!==p.unit || c.document?.kind!==p.kind) errors.push('V2A medida: unidade ou documento diferente');
  return errors;
}
export function conferirPublicacao(nomes) {
  return nomes.every(n=>n==='provas.json') ? [] : ['V2A direitos: a prova pública só admite excertos e referências em provas.json'];
}
export function conferirAfirmacoes(claims,{plantar=true,motor=process.env.RESEARCHHUB_DIR}={}) {
  const prova=JSON.parse(fs.readFileSync('ledger/provas/v2a/provas.json','utf8'));
  const v2d=conferirAfirmacoesV2d(claims,{plantar,motor,excluir:new Set(Object.keys(prova.rows))});
  const errors=[...conferirPublicacao(fs.readdirSync('ledger/provas/v2a')),...v2d.errors], plantas=[];
  let checked=v2d.checked, bodies=v2d.bodies;
  for(const c of claims.values()) {
    if(!c.afirmacao||v2d.ids.has(c.id)) continue;
    const p=prova.rows[c.id];
    let raw;
    if(motor && p && p.motor_path===`content/15 Orcamento do Estado 2027/source/v2a/${path.basename(p.file)}`) {
      try {raw=fs.readFileSync(path.join(motor,p.motor_path));}
      catch {errors.push(`${c.id}: V2A selo: corpo indisponível no motor indicado`);}
    }
    if(raw)bodies++;
    const found=conferirAfirmacao(c,p,raw);
    errors.push(...found.map(e=>`${c.id}: ${e}`));checked++;
    if(plantar && !plantas.length && !found.length) {
      for(const [nome,altera,mensagem] of [
        ['excerto alterado',d=>{d.excerpt+=' Palavra acrescentada.';},'V2A excerto:'],
        ['atribuição trocada',d=>{d.attributed_to=['Entidade do ensaio'];},'V2A atribuição:'],
        ['data errada',d=>{d.published_at='2026-10-08';},'V2A data:'],
        ['porta trocada',d=>{d.source_url='https://example.invalid/ensaio';},'V2A porta:'],
        ['valor fora do excerto',d=>{d.value='987654321';},'V2A valor:'],
      ]) {
        const copy=structuredClone(c);altera(copy);
        const hit=conferirAfirmacao(copy,p,raw).find(e=>e.startsWith(mensagem));
        assert(hit,`V2A planta sem a mensagem esperada: ${nome}`);plantas.push({nome,mensagem:hit});
      }
    }
  }
  if(plantar) {
    for(const nome of ['pagina.html.gz','parecer.pdf']) {
      const mensagem=conferirPublicacao(['provas.json',nome])[0];
      assert(mensagem?.startsWith('V2A direitos:'));plantas.push({nome:`corpo integral ${nome}`,mensagem});
    }
    const c=[...claims.values()].find(c=>c.afirmacao&&prova.rows[c.id]), p=structuredClone(prova.rows[c.id]);
    p.motor_path='../fora.html';
    const mensagem=conferirAfirmacao(c,p).find(e=>e.startsWith('V2A referência:'));
    assert(mensagem);plantas.push({nome:'caminho fora do motor',mensagem});
  }
  if(plantar) {
    const datas=[['janeiro','2026-01-09'],['fevereiro','2026-02-09'],['março','2026-03-09'],['abril','2026-04-09'],['maio','2026-05-09'],['junho','2026-06-09'],['julho','2026-07-09'],['agosto','2026-08-09'],['setembro','2026-09-09'],['outubro','2026-10-09'],['novembro','2026-11-09'],['dezembro','2026-12-09']];
    const pcp=[...claims.values()].find(c=>c.id.startsWith('afirmacao-pcp-')&&prova.rows[c.id]);
    const provaPcp=prova.rows[pcp.id];
    for(const [mes,expected] of datas) {
      assert.equal(dataDoPcp(`9 ${mes} 2026, Assembleia da República`),expected);
      if(mes==='outubro')continue;
      const raw=Buffer.from(`<p>9 ${mes} 2026, Assembleia da República</p><p>${provaPcp.excerpt} ${provaPcp.attribution_anchor}</p>`);
      const mensagem=conferirAfirmacao(pcp,provaPcp,raw).find(e=>e.startsWith('V2A data:'));
      assert(mensagem,`mês ${mes} não recusado pela célula`);plantas.push({nome:'mês PCP '+mes,mensagem});
    }
    const impossivel=Buffer.from('<p>31 fevereiro 2026, Assembleia da República</p>');
    const recusada=conferirAfirmacao(pcp,provaPcp,impossivel).find(e=>e.startsWith('V2A data:'));
    assert(recusada);plantas.push({nome:'dia impossível no PCP',mensagem:recusada});
    const c=[...claims.values()].find(c=>c.afirmacao&&prova.rows[c.id]),p=structuredClone(prova.rows[c.id]);
    const raw=Buffer.from(`<p>${p.excerpt} ${p.attribution_anchor}</p>`);
    p.attribution_anchor='Autor ausente do ensaio';
    const mensagem=conferirAfirmacao(c,p,raw).find(e=>e.startsWith('V2A atribuição:'));
    assert(mensagem);plantas.push({nome:'âncora trocada por texto ausente',mensagem});
  }
  for(const [id,p] of Object.entries(prova.rows)) if(p.kind==='html' && !claims.get(id)?.afirmacao) errors.push(`${id}: V2A afirmação selada ausente do livro`);
  return {errors,checked,bodies,plantas:[...plantas,...v2d.plantas]};
}
