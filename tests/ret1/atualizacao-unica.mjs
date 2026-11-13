import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {load} from 'js-yaml';
import {WORKS} from '../../src/data/studies.mjs';
import {CORRECOES_TEXTO} from '../../src/data/correcoes.mjs';
import {conferirHistoria,conferirTestemunhas} from '../../scripts/historia-edicoes-conferir.mjs';
import {portasDaCorrecao} from '../../src/lib/edicoes.mjs';
const manifesto=load(fs.readFileSync('studies-src/manifest.yml','utf8'));
const args={works:WORKS,manifesto,correcoes:CORRECOES_TEXTO,raiz:'studies-src'};
const ler=(commit,file)=>execFileSync('git',['show',`${commit}:${file}`],{maxBuffer:16*1024*1024});
assert.deepEqual(conferirHistoria(args),[]);
assert.deepEqual(conferirTestemunhas(manifesto,ler).erros,[]);
for(const slug of ['evora-contas-da-camara-2010-2025','evora-2027-capital-europeia-da-cultura']){
 const c=CORRECOES_TEXTO.find(c=>c.slug===slug&&c.data==='2026-11-13');
 assert.equal(c.kind,'texto_atualizado');
 assert.equal(c.frase.pt,'Saiu a remissão para um estudo que deixou o arquivo; nenhum número nem nenhuma conclusão mudou.');
 assert.equal(c.frase.en,'The reference to a study that left the archive came out; no number and no conclusion changed.');
 for(const lang of ['pt','en']){
  const e=manifesto.edicoes.find(e=>e.slug===slug&&e.lang===lang);
  assert.equal(e.edicoes.length,1);assert(!e.primeira_edicao);
  const portas=portasDaCorrecao(slug,lang,c.data);assert.equal(portas.antes,null);assert(portas.depois.rota);
  for(const mutar of [e=>delete e.atualizacao_texto,e=>e.atualizacao_texto.data='2026-11-12',e=>e.atualizacao_texto.anterior.sha256=e.sha256_normalized]){
   const bad=structuredClone(manifesto);mutar(bad.edicoes.find(e=>e.slug===slug&&e.lang===lang));
   assert(conferirHistoria({...args,manifesto:bad}).length);
  }
  const bad=structuredClone(manifesto);bad.edicoes.find(e=>e.slug===slug&&e.lang===lang).atualizacao_texto.anterior.sha256='0'.repeat(64);
  assert(conferirTestemunhas(bad,ler).erros.length);
 }
 const semDatas=structuredClone(manifesto);for(const e of semDatas.edicoes.filter(e=>e.slug===slug))delete e.atualizacao_texto;
 const semDataNaEntrada=CORRECOES_TEXTO.map(x=>x===c?{...x,data:undefined}:x);assert(conferirHistoria({...args,manifesto:semDatas,correcoes:semDataNaEntrada}).length);
 const sem=CORRECOES_TEXTO.filter(x=>x!==c);assert(conferirHistoria({...args,correcoes:sem}).length);
 const natureza=CORRECOES_TEXTO.map(x=>x===c?{...x,kind:'texto'}:x);assert(conferirHistoria({...args,correcoes:natureza}).length);
}
console.log('RET1-B: atualização de edição única com testemunha no Git; falta de registo, data, natureza e resumo adulterados recusados; uma só porta pública.');
