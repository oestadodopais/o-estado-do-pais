#!/usr/bin/env node
/** B2: as linhas de comparação não ganham cartões próprios nas áreas.
 * Os estragos da edição e da unidade vivem só na memória de processos filhos;
 * não se reescreve uma linha selada para fazer esta prova. */
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
const resultados = [];
function caso(nome, codigo) {
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', codigo], { encoding: 'utf8' });
  const passou = r.status === 0;
  resultados.push({ nome, codigo: r.status, passou, saida: (r.stdout + r.stderr).trim() });
  console.log(`${passou ? 'OK' : 'FALHA'} ${nome}`);
  if (!passou) throw Error(r.stdout + r.stderr);
}
const cabeca = `
import assert from 'node:assert/strict';
import {loadClaims} from './src/lib/ledger.mjs';
import {DOMINIO_DAS_MEDIDAS} from './src/data/dominios.mjs';
const claims=loadClaims();
`;
try {
  caso('comparacoes-nao-sao-cartoes-autonomos', cabeca + `
    const {linhasDeEnquadramento,reguaDaMedida}=await import('./src/lib/enquadramento.mjs');
    const {areasComPagina}=await import('./src/lib/areas.mjs');
    const {indiceDosDominios}=await import('./src/lib/dominios.mjs');
    const {temasDoPais}=await import('./src/lib/pais.mjs');
    const principais=['saldo-das-administracoes-publicas-2025','crescimento-da-despesa-liquida-2025','disparidade-salarial-entre-sexos-2024','sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025'];
    const anteriores=principais.map(id=>reguaDaMedida(id).anterior.id);
    const companheiras=[...anteriores,reguaDaMedida(principais.at(-1)).ue.id];
    const medidas=areasComPagina().flatMap(a=>a.pecas.medidas);
    for(const id of companheiras){assert.ok(linhasDeEnquadramento().has(id),id);assert.equal(medidas.some(m=>m.id===id),false,id);}
    assert.ok(indiceDosDominios('pt').length);
    for(const resumo of [true,false])assert.equal(temasDoPais('pt',resumo).flatMap(t=>t.medidas).some(c=>c.id==='indice-de-divida-limite-legal'),false);
    assert.ok(DOMINIO_DAS_MEDIDAS['indice-de-divida-limite-legal']);
    console.log(JSON.stringify({anteriores,companheiras,autonomas:0,limiteNosCartoes:0}));
  `);
  for (const campo of ['edition','unit']) caso(`comparacao-com-${campo}-diferente-nao-e-excluida`, cabeca + `
    const id='saldo-das-administracoes-publicas-2024';
    ${campo === 'edition' ? "claims.get(id).document.edition='outra série plantada';" : "claims.get(id).unit='unidade plantada';"}
    const {linhasDeEnquadramento,reguaDaMedida}=await import('./src/lib/enquadramento.mjs');
    assert.equal(reguaDaMedida('saldo-das-administracoes-publicas-2025').anterior,null);
    assert.equal(linhasDeEnquadramento().has(id),false);
  `);
  caso('medida-fora-das-declaracoes-nao-e-excluida', cabeca + `
    delete DOMINIO_DAS_MEDIDAS['saldo-das-administracoes-publicas-2025'];
    const {linhasDeEnquadramento}=await import('./src/lib/enquadramento.mjs');
    assert.equal(linhasDeEnquadramento().has('saldo-das-administracoes-publicas-2024'),false);
  `);
} finally {
  const i = process.argv.indexOf('--json');
  if(i!==-1)fs.writeFileSync(process.argv[i+1],JSON.stringify(resultados,null,2)+'\n');
}
