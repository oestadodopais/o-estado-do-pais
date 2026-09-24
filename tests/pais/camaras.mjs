#!/usr/bin/env node
/** B2: a igualdade, a ausência publicada e as parcelas da contagem.
 * As plantas da função usam cópias em memória das linhas reais. Com --html,
 * planta também no HTML copiado e exige a mordida da V2 do check:pais.
 *
 * L1 (24.09.2026): o cartão das câmaras ganhou uma leitura, que rende três das
 * contagens e o período ANTES da linha do valor e da régua. As plantas da linha
 * do valor passam a escolher o nó fora da leitura (`daLinha`), para morderem o
 * que sempre morderam, e as plantas `l1-camaras-leitura-*` estragam a leitura e
 * exigem as queixas novas da V2. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { parse } from 'node-html-parser';
import { contagensDasCamaras, periodoDasCamaras } from '../../src/lib/prova.mjs';
import { loadClaims, parsePtNumber } from '../../src/lib/ledger.mjs';
import { MUNICIPIOS_COM_PAGINA } from '../../src/data/municipios.mjs';
const resultados = [];
function caso(nome, prova) {
  prova(); resultados.push({ nome, codigo: 0, passou: true }); console.log(`OK ${nome}`);
}
const claims = loadClaims();
const base = contagensDasCamaras(claims);
const id = MUNICIPIOS_COM_PAGINA.find(m => parsePtNumber(claims.get(m.distancia.indice).value) !== null).distancia.indice;
const sem = MUNICIPIOS_COM_PAGINA.find(m => parsePtNumber(claims.get(m.distancia.indice).value) === null).distancia.indice;
const teto = claims.get('indice-de-divida-limite-legal').value;
const copia = (chave, value) => new Map([...claims].map(([k,v]) => [k, k === chave ? { ...v, value } : v]));
try {
  caso('contagem-na-cabeca-de-partida', () => assert.deepEqual(base, { camaras_acima_do_limite: 10, camaras_dentro_do_limite: 297, camaras_sem_valor: 1 }));
  caso('cada-camara-numa-parcela', () => assert.equal(Object.values(base).reduce((a,b) => a+b,0), MUNICIPIOS_COM_PAGINA.length));
  caso('igual-ao-limite-esta-dentro', () => {
    const a = contagensDasCamaras(copia(id, teto));
    const b = contagensDasCamaras(copia(id, String(Number(teto)+1)));
    assert.equal(b.camaras_acima_do_limite, a.camaras_acima_do_limite+1);
    assert.equal(b.camaras_dentro_do_limite, a.camaras_dentro_do_limite-1);
    assert.equal(b.camaras_sem_valor, a.camaras_sem_valor);
  });
  caso('ausencia-publicada-nao-e-zero', () => {
    const n = contagensDasCamaras(copia(sem, '0'));
    assert.equal(n.camaras_sem_valor, base.camaras_sem_valor-1);
    assert.equal(n.camaras_dentro_do_limite, base.camaras_dentro_do_limite+1);
  });
  caso('linha-ausente-nao-e-ausencia-publicada', () => {
    const c = new Map(claims); c.delete(id);
    assert.throws(() => contagensDasCamaras(c), /índice ausente/);
  });
  caso('indice-repetido-fecha', () => assert.throws(() => contagensDasCamaras(claims, [...MUNICIPIOS_COM_PAGINA, MUNICIPIOS_COM_PAGINA[0]]), /índice ausente ou repetido/));
  caso('valor-ilegivel-fecha', () => assert.throws(() => contagensDasCamaras(copia(id, 'texto sem marca da fonte')), /valor ilegível/));
  caso('periodos-diferentes-fecham', () => {
    const c = new Map(claims); c.set(id, { ...c.get(id), reference_date: '2023' });
    assert.throws(() => contagensDasCamaras(c), /não partilham um período/);
    assert.throws(() => periodoDasCamaras(c), /não partilham um período/);
  });
  caso('periodos-das-origens-diferentes-fecham', () => {
    const c = new Map(claims); const origem = 'evora-divida-dgal-2024';
    c.set(origem, { ...c.get(origem), reference_date: '2023' });
    assert.throws(() => contagensDasCamaras(c), /origens não partilham um período/);
  });
  if (process.argv.includes('--html')) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(),'oedp-camaras-'));
    const rotas=['index.html','en/index.html','temas/index.html','en/themes/index.html','correcoes/index.html','en/corrections/index.html','municipios/evora/index.html','en/municipalities/evora/index.html','estudos/index.html','en/studies/index.html'];
    const dist=process.env.OEDP_DIST ?? 'dist';
    const originais=new Map(rotas.map(f=>[f,fs.readFileSync(path.join(dist,f),'utf8')]));
    const sha=s=>createHash('sha256').update(s).digest('hex');
    const repor=()=>{for(const [f,s] of originais){const p=path.join(tmp,f);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,s);}};
    /* O primeiro nó do cartão fora da leitura, que é o da linha do valor ou da régua. */
    const daLinha=(r,sel)=>r.querySelectorAll(`[data-cartao-camaras] ${sel}`).find(n=>!n.closest('[data-cartao-leitura]'));
    const daLeitura=(r,sel)=>r.querySelector(`[data-cartao-camaras] [data-cartao-leitura] ${sel}`);
    function planta(nome,rota,fn,mordida) {
      repor();const alvo=path.join(tmp,rota);const antes=fs.readFileSync(alvo,'utf8');const doc=parse(antes);
      if(fn){fn(doc);assert.notEqual(doc.toString(),antes);fs.writeFileSync(alvo,doc.toString());}
      let r;try { r=spawnSync(process.execPath,['scripts/check-pais.mjs'],{encoding:'utf8',env:{...process.env,OEDP_DIST:tmp},maxBuffer:64*1024*1024}); } finally {repor();}
      const saida=r.stdout+r.stderr;const reposto=sha(fs.readFileSync(alvo));
      const passou=r.status===(mordida?1:0)&&(!mordida||mordida.test(saida))&&sha(antes)===reposto;
      resultados.push({nome,ficheiro:rota,comando:'node scripts/check-pais.mjs',codigo:r.status,mordida:mordida?.source ?? null,passou,antes:sha(antes),reposto,saida:saida.trim()});
      assert.ok(passou,`${nome}: ${saida}`);console.log(`OK ${nome}`);
    }
    try {
      planta('camaras-html-limpo','index.html',null,null);
      for(const chave of Object.keys(base)) planta(`camaras-${chave}-trocada`,'index.html',r=>{
        const el=daLinha(r,`[data-prova="${chave}"]`);el.set_content(String(Number(el.textContent)+1));
      },new RegExp(`V2 pt: ${chave}: a contagem não coincide`));
      planta('camaras-limite-trocado','en/themes/index.html',r=>r.querySelector('[data-cartao-camaras] [data-claim]').set_content('151'),/V2 en: o limite não é o valor selado/);
      planta('camaras-porta-trocada','index.html',r=>r.querySelector('[data-cartao-camaras] .pais-porta-tema a').setAttribute('href','/temas/'),/V2 pt: a porta final/);
      planta('camaras-periodo-trocado','index.html',r=>daLinha(r,'[data-de-campo="reference_date"]').set_content('2023'),/V2 pt: o período não vem das linhas/);
      planta('camaras-unidade-trocada','en/index.html',r=>r.querySelector('[data-cartao-camaras] .cartao-medida-unidade').set_content('municipalities'),/V2 en: o valor principal ou a unidade da contagem difere/);
      planta('camaras-periodo-sem-palavra','temas/index.html',r=>{const n=r.querySelector('[data-cartao-camaras] .cartao-medida-periodo');n.set_content(n.querySelector('[data-de-campo]').outerHTML);},/V2 pt: o período escrito difere/);
      planta('camaras-contagem-com-porta','index.html',r=>{const n=daLinha(r,'[data-prova]'); n.replaceWith(`<a data-prova="${n.getAttribute('data-prova')}" href="/lugares/">${n.textContent}</a>`);},/V2 pt: camaras_acima_do_limite: a contagem deve usar a porta comum/);
      planta('camaras-nome-como-titulo','index.html',r=>{const n=r.querySelector('[data-cartao-camaras] .cartao-medida-nome'); n.replaceWith(`<h3 class="cartao-medida-nome">${n.textContent}</h3>`);},/V2 pt: o nome do cartão deve ser um span/);
      planta('camaras-no-inicio-da-fila','index.html',r=>{
        const c=r.querySelector('[data-cartao-camaras]');const s=c.outerHTML;const pai=c.parentNode;c.remove();pai.insertAdjacentHTML('afterbegin',s);
      },/V2 pt: o cartão das câmaras não fecha a fila/);
      planta('economia-com-cinco-cartoes','index.html',r=>{
        const c=r.querySelector('[data-tema="economia-e-financas-publicas"] [data-cartao-medida]');c.insertAdjacentHTML('afterend',c.outerHTML);
      },/T7 pt: fila vazia ou demasiado longa em economia-e-financas-publicas/);
      planta('habitacao-com-total-primeiro','temas/index.html',r=>{
        const cs=r.querySelectorAll('[data-tema="habitacao"] [data-cartao-medida]');const s=cs[0].outerHTML;cs[0].replaceWith(cs[1].outerHTML);cs[1].replaceWith(s);
      },/T10 pt temas: a habitação não abre com os inquilinos/);
      /* L1: a leitura das câmaras. */
      for(const chave of ['camaras_acima_do_limite','municipios_com_pagina','camaras_sem_valor']) planta(`l1-camaras-leitura-${chave}-trocada`,'index.html',r=>{
        const el=daLeitura(r,`[data-prova="${chave}"]`);el.set_content(String(Number(el.textContent)+1));
      },new RegExp(`V2 pt: ${chave}: a leitura não rende a contagem recontada`));
      planta('l1-camaras-leitura-trocada-en','en/themes/index.html',r=>{
        const el=daLeitura(r,'[data-prova="camaras_acima_do_limite"]');el.set_content(String(Number(el.textContent)-1));
      },/V2 en: camaras_acima_do_limite: a leitura não rende a contagem recontada/);
      planta('l1-camaras-leitura-periodo-trocado','temas/index.html',r=>daLeitura(r,'[data-de-campo="reference_date"]').set_content('2023'),/V2 pt: o período da leitura não vem das linhas contadas/);
      planta('l1-camaras-leitura-com-porta','en/index.html',r=>{const n=daLeitura(r,'[data-prova]'); n.replaceWith(`<a data-prova="${n.getAttribute('data-prova')}" href="/en/places/">${n.textContent}</a>`);},/V2 en: camaras_acima_do_limite: a contagem da leitura deve usar a porta comum/);
      planta('l1-camaras-leitura-com-linha','index.html',r=>{
        const n=daLeitura(r,'[data-prova="camaras_sem_valor"]');n.insertAdjacentHTML('afterend',` <span data-claim="indice-de-divida-limite-legal">${teto}</span>`);
      },/V2 pt: a leitura das câmaras cita uma linha, e só diz contagens/);
      planta('l1-camaras-leitura-chave-alheia','index.html',r=>daLeitura(r,'[data-prova="camaras_sem_valor"]').setAttribute('data-prova','municipios_total'),/V2 pt: a leitura cita a chave «municipios_total», que não é uma contagem das câmaras/);
      planta('l1-camaras-duas-leituras','index.html',r=>{const l=r.querySelector('[data-cartao-camaras] [data-cartao-leitura]');l.insertAdjacentHTML('afterend',l.outerHTML);},/V2 pt: o cartão das câmaras tem 2 leituras; tem uma ou nenhuma/);
      planta('camaras-html-reposto','index.html',null,null);
      planta('limite-legal-como-cartao-do-pais','index.html',r=>{
        const c=r.querySelector('[data-tema="economia-e-financas-publicas"] [data-cartao-medida]');
        c.setAttribute('data-cartao-medida','indice-de-divida-limite-legal');
      },/V2 pt: o limite legal voltou a aparecer como uma medida do país/);
      planta('periodo-anterior-como-cartao-dos-temas','temas/index.html',r=>{
        r.querySelector('[data-cartao-medida="saldo-das-administracoes-publicas-2025"]').setAttribute('data-cartao-medida','saldo-das-administracoes-publicas-2024');
      },/T2 pt temas: saldo-das-administracoes-publicas-2024 sem tema na tabela/);
    } finally {fs.rmSync(tmp,{recursive:true,force:true});}
  }
} finally {
  const i=process.argv.indexOf('--json');if(i!==-1)fs.writeFileSync(process.argv[i+1],JSON.stringify(resultados,null,2)+'\n');
}
