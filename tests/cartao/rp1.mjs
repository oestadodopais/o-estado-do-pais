/** RP1: as réguas recusam outra série e a data conserva o período publicado. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parse } from 'node-html-parser';
import { loadClaims, validateLedger } from '../../src/lib/ledger.mjs';
import { REGUAS_DECLARADAS, conferirReguaDeclarada, linhasDeEnquadramento, reguaDaMedida } from '../../src/lib/enquadramento.mjs';
import { LEITURAS_DAS_MEDIDAS } from '../../src/data/leituras-das-medidas.mjs';
import { conferirLinguaDasOrigens } from '../../scripts/lingua-das-origens.mjs';
import { dataDaCasa } from '../../src/lib/datas.mjs';
import { DOMINIOS_RP1, NOMES_RP1 } from '../../src/data/medidas-rp1.mjs';
import { auditarPerguntas } from './perguntas.mjs';
import { conferirAuditoriaDasLeituras, folhasDaLeitura, conferirPaginaDaLeitura } from './leituras.mjs';

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
  if (regra.ue) {
    assert.equal(reguaDaMedida(id).ue?.id, regra.ue);
    assert.ok(linhasDeEnquadramento().has(regra.ue));
  }
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
const ihpc = 'ihpc-variacao-homologa', regraIHPC = REGUAS_DECLARADAS[ihpc];
copia = alterada(); copia.get(regraIHPC.ue).reference_date = '2026-07';
recusa('União de outro mês', () => conferirReguaDeclarada(ihpc, regraIHPC, copia), /União de outro período/);
copia = alterada(); copia.get(regraIHPC.ue).document.edition = 'outra série';
recusa('União de outra série', () => conferirReguaDeclarada(ihpc, regraIHPC, copia), /União de outra série ou unidade/);
copia = alterada(); copia.get(regraIHPC.ue).unit = 'euros';
recusa('União de outra unidade', () => conferirReguaDeclarada(ihpc, regraIHPC, copia), /União de outra série ou unidade/);
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
// RP1c: os nomes da casa não alteram os títulos transcritos das fontes.
const nomesRP1c = {
  'pensao-media-anual-2025': {pt:'Pensão média anual', en:'Average annual pension'},
  'pensao-media-anual-2024': {pt:'Pensão média anual', en:'Average annual pension'},
  'ipc-alimentacao-variacao-homologa': {pt:'Preços dos alimentos e das bebidas não alcoólicas', en:'Prices of food and non-alcoholic drinks'},
  'ipc-alimentacao-variacao-homologa-periodo-anterior': {pt:'Preços dos alimentos e das bebidas não alcoólicas', en:'Prices of food and non-alcoholic drinks'},
};
for (const [id, nomes] of Object.entries(nomesRP1c)) assert.deepEqual(NOMES_RP1[id], nomes);
const publicacoesNoPeriodo = [];
for (const [id, data] of [[salario, '2026-04-01'], ['ipc-variacao-homologa', '2026-08-15']]) {
  const linha = linhas.get(id), antes = linha.published_at;
  try {
    linha.published_at = data;
    assert.ok(!validateLedger().errors.some(e => e.includes(`[${id}.yml]`) && e.includes('published_at')));
    publicacoesNoPeriodo.push({id, data, aceite:true});
  } finally { linha.published_at = antes; }
}
const excertoIntegro = observacao.excerpt;
try {
  observacao.excerpt = excertoIntegro.split('1 835 &')[0] + '1 835 &';
  assert.ok(validateLedger().errors.some(e => e.includes(`[${salario}.yml]`) && e.includes('excerpt')));
  plantas.push({nome:'objeto do INE cortado dentro da cadeia do valor',mordeu:true});
} finally { observacao.excerpt = excertoIntegro; }
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
const declaracoes = structuredClone(LEITURAS_DAS_MEDIDAS);
const folhaNegacao = auditoria.medidas.find(m => m.id === salario).folhas.find(f => f.pt === 'No ');
folhaNegacao.en = 'There were no';
folhaNegacao.partes[0].en = 'There were no';
declaracoes[salario].en[0] = 'There were no';
const errosNegacao = conferirAuditoriaDasLeituras({ auditoria, leituras: declaracoes }).erros;
assert.ok(errosNegacao.some(e => /ligação.*«no» \(en\)/.test(e)), 'A negação inglesa passou sem literal');
assert.ok(!errosNegacao.some(e => /as partes juntas|não tem auditoria/.test(e)), 'A planta tem de preservar a composição');
plantas.push({ nome: 'There were no: negação inglesa sem literal, composição intacta', mordeu: true });
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
      assert.deepEqual(conferirLinguaDasOrigens(recibo, lang), []);
      if (id === 'ipc-variacao-homologa') {
        for (const seletor of ['.def-origem-doc', '.def-excerto-texto']) {
          const estrago = parse(recibo.toString());
          estrago.querySelector('[data-def-origem="rp1-ipc-homologa"] '+seletor).setAttribute('lang','en');
          assert.ok(conferirLinguaDasOrigens(estrago,lang).some(e=>e.includes('L10') && e.includes(seletor)));
          plantas.push({nome:'origem portuguesa marcada como inglesa: '+lang+' '+seletor,mordeu:true});
        }
      }
      if (id===salario) {
        const titulo = recibo.querySelector('h1.linha-valor');
        const unidade = titulo.querySelector('[data-linha-campo="unit"]');
        const marca = titulo.querySelector('.claim-provisorio');
        assert.ok(titulo.innerHTML.indexOf(unidade.toString()) < titulo.innerHTML.indexOf(marca.toString()));
        assert.equal(marca.textContent,lang==='pt'?' (dado provisório)':' (provisional data)');
        assert.ok(titulo.textContent.includes(' '+unidade.textContent));
        assert.ok(unidadeAntesDaRessalva(card),'unidade antes do provisório');
        const estrago=parse(card.toString());
        const u=estrago.querySelector('[data-linha-campo="unit"]');
        const html=u.toString();u.remove();estrago.querySelector('.cartao-medida-quantidade').insertAdjacentHTML('beforeend',html);
        assert.equal(unidadeAntesDaRessalva(estrago),false);
        plantas.push({nome:'unidade depois do provisório, '+lang,mordeu:true});
        const marcas=card.querySelectorAll('.claim-provisorio');
        assert.equal(marcas.length,2,'valor do cartão e valor da leitura');
        assert.ok(marcas.every(m=>m.textContent===(lang==='pt'?' (dado provisório)':' (provisional data)')));
        for (const seletor of ['.cartao-medida-valor', '[data-cartao-leitura]']) {
          const colada=parse(root.toString());
          const marca=colada.querySelector(`[data-cartao-medida="${salario}"] ${seletor} .claim-provisorio`);
          marca.set_content(marca.textContent.trim());
          assert.ok(conferirPaginaDaLeitura(colada,lang,ficheiro).erros.some(e=>/ressalva.*separador|texto rendido difere/.test(e)), 'I153: bandeira colada aceite');
          plantas.push({nome:'I153: bandeira colada à unidade, '+lang+', '+seletor,mordeu:true});
        }
      }
    }
  }
}
const resultado={reguas:Object.keys(REGUAS_DECLARADAS).length,plantas,nomes:nomesRP1c,publicacoes_no_periodo:publicacoesNoPeriodo,datas:datas.length,paginas,cartoes};
if(process.argv.includes('--registo'))fs.writeFileSync('design/especime-v3/medicoes/rp1-2026-09-26/plantas-rp1.json',JSON.stringify(resultado,null,2)+'\n');
console.log('RP1: PASS · '+JSON.stringify(resultado));
