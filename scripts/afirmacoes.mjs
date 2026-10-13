/** V2-a: palavras, atribuição, data, porta e valor contra o corpo HTTP selado. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {parse} from 'node-html-parser';
import assert from 'node:assert/strict';

const normal = s => String(s ?? '').replace(/\s+/g, ' ').trim();
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
export function textoDoCorpo(raw) {
  const tree=parse(raw.toString('utf8').replace(/<!--[\s\S]*?-->/g,''));
  tree.querySelectorAll('script,style,head').forEach(e=>e.remove());
  return normal(tree.innerHTML.replace(/<[^>]+>/g,' ').replace(/&(?:#[xX][\da-fA-F]+|#\d+|\w+);/g,e=>parse(e).textContent));
}
export function conferirAfirmacao(c,p,raw) {
  const errors=[];
  if (!p || !raw) return ['V2A selo: falta o corpo alojado ou a prova'];
  if (sha(raw)!==p.sha256) errors.push('V2A selo: sha256 diferente do corpo alojado');
  const text=textoDoCorpo(raw);
  if (normal(c.excerpt)!==normal(p.excerpt) || !text.includes(normal(c.excerpt))) errors.push('V2A excerto: palavras diferentes do corpo alojado');
  if (JSON.stringify(c.attributed_to)!==JSON.stringify(p.attributed_to) || !text.includes(p.attribution_anchor)) errors.push('V2A atribuição: difere da autoria no documento');
  let date;
  if (p.file==='pcp-afirmacao.html') {
    const m=text.match(/(\d+) Outubro (\d{4}), Assembleia da República/);
    if(m) date=`${m[2]}-10-${m[1].padStart(2,'0')}`;
  } else date=raw.toString('utf8').match(/<time[^>]+datetime="(\d{4}-\d{2}-\d{2})T/)?.[1];
  if (!date || c.published_at!==date || c.reference_date!==date || p.published_at!==date) errors.push('V2A data: difere da data do documento');
  if (c.source_url!==p.pedido) errors.push('V2A porta: difere do pedido registado');
  const v=normal(c.value).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  if (!v || normal(c.value)!==normal(p.value) || !new RegExp(`(?<![\\d,.])${v}(?![\\d,.])`).test(normal(c.excerpt))) errors.push('V2A valor: não aparece no excerto selado');
  if (c.unit!==p.unit || c.document?.kind!==p.kind) errors.push('V2A medida: unidade ou documento diferente');
  return errors;
}
export function conferirAfirmacoes(claims,{plantar=true}={}) {
  const prova=JSON.parse(fs.readFileSync('ledger/provas/v2a/provas.json','utf8'));
  const errors=[], plantas=[];
  let checked=0;
  for(const c of claims.values()) {
    if(!c.afirmacao) continue;
    const p=prova.rows[c.id];
    let raw;
    if(p && path.basename(p.file)===p.file) raw=gunzipSync(fs.readFileSync(path.join('ledger/provas/v2a',p.file+'.gz')));
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
  for(const [id,p] of Object.entries(prova.rows)) if(p.kind==='html' && !claims.get(id)?.afirmacao) errors.push(`${id}: V2A afirmação selada ausente do livro`);
  return {errors,checked,plantas};
}
