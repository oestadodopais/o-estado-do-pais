/** RP1: as réguas recusam outra série e a data conserva o período publicado. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parse } from 'node-html-parser';
import { loadClaims, validateLedger } from '../../src/lib/ledger.mjs';
import { REGUAS_DECLARADAS, conferirReguaDeclarada, linhasDeEnquadramento, reguaDaMedida } from '../../src/lib/enquadramento.mjs';
import { dataDaCasa } from '../../src/lib/datas.mjs';
import { DOMINIOS_RP1 } from '../../src/data/medidas-rp1.mjs';
import { auditarPerguntas } from './perguntas.mjs';
import { conferirAuditoriaDasLeituras, folhasDaLeitura } from './leituras.mjs';

const linhas = loadClaims();
const plantas = [];
function recusa(nome, trabalho, mensagem) {
  assert.throws(trabalho, mensagem, nome);
  plantas.push({ nome, mordeu: true });
}
for (const [id, regra] of Object.entries(REGUAS_DECLARADAS)) {
  assert.equal(conferirReguaDeclarada(id, regra).anterior, regra.anterior);
  assert.equal(reguaDaMedida(id).anterior?.id, regra.anterior);
  assert.ok(linhasDeEnquadramento().has(regra.anterior));
}
const id = 'ipc-variacao-homologa';
const regra = REGUAS_DECLARADAS[id];
recusa('régua de outra medida', () => conferirReguaDeclarada(id, { ...regra, anterior: 'ipc-alimentacao-variacao-homologa-periodo-anterior' }), /outra série ou unidade/);
const alterada = () => new Map([...linhas].map(([id, l]) => [id, structuredClone(l)]));
let copia = alterada(); copia.get(regra.anterior).unit = 'euros';
recusa('unidade diferente', () => conferirReguaDeclarada(id, regra, copia), /outra série ou unidade/);
copia = alterada(); copia.get(regra.anterior).reference_date = '2026-06';
recusa('salto de mês calado', () => conferirReguaDeclarada(id, regra, copia), /cadência declarada/);
copia = alterada(); copia.delete(regra.anterior);
recusa('período anterior ausente', () => conferirReguaDeclarada(id, regra, copia), /linha ausente/);
const salario = 'remuneracao-bruta-mensal-media';
copia = alterada(); copia.get(REGUAS_DECLARADAS[salario].anterior).reference_date = '2026-T1';
recusa('trimestre imediatamente anterior em vez do homólogo', () => conferirReguaDeclarada(salario, REGUAS_DECLARADAS[salario], copia), /cadência declarada/);
// A forma trimestral é permitida apenas no período da observação.
const observacao = linhas.get(salario);
for (const [campo, valor] of [['reference_date','2026-T5'],['access_date','2026-T2'],['published_at','2026-03-31']]) {
  const antes = observacao[campo];
  try {
    observacao[campo] = valor;
    const erros = validateLedger().errors;
    assert.ok(erros.some(e => e.includes(`[${salario}.yml]`) && e.includes(campo)), campo+': planta não recusada');
    plantas.push({nome: `data recusada: ${campo}=${valor}`,mordeu:true});
  } finally { observacao[campo] = antes; }
}
const datas = [
  ['2026-08','pt','agosto de 2026'], ['2026-08','en','August 2026'],
  ['2026-T2','pt','2.º trimestre de 2026'], ['2026-T2','en','2nd quarter of 2026'],
  ['2025','pt','2025'], ['2026-09-26','en','26.09.2026'],
  ['2026-13','pt','2026-13'], ['2026-T5','en','2026-T5'],
];
for (const [valor, lang, esperado] of datas) assert.equal(dataDaCasa(valor, lang), esperado);
for (const auditar of [auditarPerguntas, conferirAuditoriaDasLeituras]) assert.deepEqual(auditar().erros, []);
// A classe de ligação não pode passar a dispensar conceitos.
const { lerAuditoriaDasLeituras } = await import('./leituras.mjs');
const auditoria = lerAuditoriaDasLeituras();
const parte = auditoria.medidas.find(m => m.id === salario).folhas.find(f => f.pt === 'No ').partes[0];
parte.pt = 'salário';
assert.ok(conferirAuditoriaDasLeituras({ auditoria }).erros.some(e => /as partes juntas/.test(e)));
plantas.push({ nome: 'palavra de conteúdo em vez da ligação auditada', mordeu: true });
recusa('sufixo traduzido não pode trocar a linha', () => folhasDaLeitura([{claim:'proprio',sufixo:' euros por mês'}],[{claim:'anterior',sufixo:' euros a month'}]), /pedaços calculados diferentes/);
const semApoio = lerAuditoriaDasLeituras();
semApoio.medidas.find(m=>m.id===salario).folhas.find(f=>f.pt===' euros por mês').partes[0].apoios=[];
assert.ok(conferirAuditoriaDasLeituras({auditoria:semApoio}).erros.some(e=>e.includes('não tem apoio nenhum')));
plantas.push({nome:'sufixo da unidade sem literal',mordeu:true});
function unidadeAntesDaRessalva(card) {
  const quantidade=card.querySelector('.cartao-medida-quantidade');
  const unidade=quantidade?.querySelector('[data-linha-campo="unit"]');
  const ressalva=quantidade?.querySelector('.claim-provisorio');
  return Boolean(unidade && ressalva && quantidade.innerHTML.indexOf(unidade.toString()) < quantidade.innerHTML.indexOf(ressalva.toString()));
}
let paginas = 0, cartoes = 0;
if (!process.argv.includes('--declaracoes')) {
  for (const [ficheiro, lang] of [['temas/index.html','pt'],['en/themes/index.html','en']]) {
    const root = parse(fs.readFileSync('dist/'+ficheiro,'utf8')); paginas++;
    for (const id of Object.keys(DOMINIOS_RP1)) {
      const card = root.querySelector(`[data-cartao-medida="${id}"]`);
      assert.ok(card, `${ficheiro}: cartão ausente ${id}`);cartoes++;
      assert.equal(card.querySelectorAll('[data-cartao-leitura]').length,1);
      assert.ok(card.querySelector('[data-regua] [data-claim]'),id+': régua ausente');
      assert.ok(card.querySelector('[data-de-campo="reference_date"]'),id+': período ausente');
      const recibo=parse(fs.readFileSync(`dist/${lang==='pt'?'livro-razao':'en/ledger'}/${id}/index.html`,'utf8'));
      const definicao=recibo.querySelectorAll(`[data-definicao="${id}"]`);
      assert.equal(definicao.length,1,id+': pergunta ausente do recibo');
      assert.ok(definicao[0].querySelectorAll('[data-def-origem]').length>0,id+': origens ausentes do recibo');
      if (id===salario) {
        assert.ok(unidadeAntesDaRessalva(card),'unidade antes do provisório');
        const estrago=parse(card.toString());
        const u=estrago.querySelector('[data-linha-campo="unit"]');
        const html=u.toString();u.remove();estrago.querySelector('.cartao-medida-quantidade').insertAdjacentHTML('beforeend',html);
        assert.equal(unidadeAntesDaRessalva(estrago),false);
        plantas.push({nome:'unidade depois do provisório, '+lang,mordeu:true});
        const marcas=card.querySelectorAll('.claim-provisorio');
        assert.equal(marcas.length,2,'valor do cartão e valor da leitura');
        assert.ok(marcas.every(m=>m.textContent===(lang==='pt'?'provisório':'provisional')));
      }
    }
  }
}
const resultado={reguas:Object.keys(REGUAS_DECLARADAS).length,plantas,datas:datas.length,paginas,cartoes};
if(process.argv.includes('--registo'))fs.writeFileSync('design/especime-v3/medicoes/rp1-2026-09-26/plantas-rp1.json',JSON.stringify(resultado,null,2)+'\n');
console.log('RP1: PASS · '+JSON.stringify(resultado));
