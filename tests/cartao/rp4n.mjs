/** RP4-n: os selos, as ausências e a recusa da marca, com a mensagem de cada planta. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {ORIGENS_DAS_DEFINICOES} from '../../src/data/figuras.mjs';
import {loadClaims} from '../../src/lib/ledger.mjs';
import {auditarPerguntas} from './perguntas.mjs';
import {conferirAuditoriaDasLeituras} from './leituras.mjs';
import {conferirAuditoriaDasFamilias, conferirAuditoriaDasSeries, cabecaDoRecibo, conferirCabecaDoRecibo, contextoDasFamilias, reguasDosCartoes} from './familias.mjs';
import {conferirSemMarcadores} from '../../scripts/sem-marcadores.mjs';

const auditoria = JSON.parse(fs.readFileSync('tests/cartao/leituras-provadas.json', 'utf8'));
const plantas = [];
function morde(nome, erros, mensagem) {
  const achado = erros.find(e => e.includes(mensagem));
  assert(achado, `${nome}: não falhou por «${mensagem}»: ${erros.slice(0,2).join('; ')}`);
  plantas.push({nome,mensagem:achado});
  console.log(`PLANTA ${nome}: ${achado}`);
}
assert.deepEqual(auditarPerguntas().erros, []);
// A auditoria completa é afirmada no fim, depois de registar as plantas.
assert.deepEqual(conferirAuditoriaDasSeries().erros, []);

for (const [nome, altera, mensagem] of [
  ['selo com outro cliente', o => {o.selo.cliente = 'cliente inventado';}, 'não identifica um cliente da lista fechada'],
  ['agente do utilizador como cliente', o => {o.selo.cliente = 'OEstadoDoPais/corredor';}, 'não identifica um cliente da lista fechada'],
  ['tipo do selo apagado', o => {delete o.selo.tipo;}, 'não tem o selo completo'],
  ['selo inteiro apagado', o => {delete o.selo;}, 'não tem o selo completo'],
]) {
  const origens = structuredClone(ORIGENS_DAS_DEFINICOES);
  altera(origens['rp4n-orcamento']);
  morde(nome, auditarPerguntas({origens}).erros, mensagem);
}

{
  const a = structuredClone(auditoria);
  a.familias.find(e => e.chaves?.includes('oe-2026-despesa-funcao-01')).folhas[0].partes[0].apoios.push({declaracao:'nome',lingua:'pt',literal:'orçamentada'});
  morde('nome do projeto de volta numa família', conferirAuditoriaDasFamilias({auditoria:a}).erros, 'o nome do projeto não pode apoiar uma frase');
}
{
  const a = structuredClone(auditoria);
  a.series.find(e => e.serie === 'serie-ihpc-rendas-variacao-homologa').folhas[0].partes[0].apoios.push({declaracao:'nome',lingua:'pt',literal:'rendas'});
  morde('nome do projeto de volta numa série', conferirAuditoriaDasSeries({auditoria:a}).erros, 'o nome do projeto não pode apoiar uma frase');
}
{
  const a=structuredClone(auditoria), familias=structuredClone((await import('../../src/data/o-que-e-das-familias.mjs')).FAMILIAS_DAS_LINHAS);
  const e=a.familias.find(e=>e.chaves?.includes('avisos-pt2030-abertos'));
  const p={classe:'ausencia',pt:'A fonte publica este número sem o definir por palavras.',en:'The source publishes this number without defining it in words.'};
  e.folhas[0].partes=[p]; for(const k of e.chaves) familias[k].frase={pt:[p.pt],en:[p.en]};
  morde('ausência atribuída a publicador desconhecido',conferirAuditoriaDasFamilias({auditoria:a,familias}).erros,'a ausência não corresponde à falta do excerto');
  const linhas=structuredClone(loadClaims({includeWithdrawn:true}));
  linhas.get('avisos-pt2030-abertos').source='Publicador conhecido no ensaio';
  assert.deepEqual(conferirAuditoriaDasFamilias({auditoria:a,familias,linhas}).erros,[],'a ausência com publicador conhecido tem de passar');
  linhas.get('avisos-pt2030-abertos').excerpt='A fonte define a medida neste excerto.';
  morde('ausência falsa com excerto existente',conferirAuditoriaDasFamilias({auditoria:a,familias,linhas}).erros,'a ausência não corresponde à falta do excerto');
}
{
  const linhas = structuredClone(loadClaims({ includeWithdrawn: true }));
  linhas.get('evora-prr-aprovado-2026').document.computed_over.files[0].sha256 = '';
  morde('seleção calculada sem resumo do ficheiro', conferirAuditoriaDasFamilias({linhas}).erros, 'a seleção calculada não tem ficheiros selados');
}
for (const aninhada of [false,true]) {
  const a = structuredClone(auditoria);
  const p = a.familias.find(e => e.chaves?.includes('oe-2026-despesa-funcao-01')).folhas[0].partes[0];
  const nome = {declaracao:'nome',lingua:'pt',literal:'orçamentada'};
  p.apoios[0] = {ou:[p.apoios[0], aninhada ? {ou:[nome]} : nome]};
  morde(`nome numa alternativa ${aninhada ? 'aninhada' : 'simples'}`, conferirAuditoriaDasFamilias({auditoria:a}).erros, 'o nome do projeto não pode apoiar uma frase');
}
{
  const a = structuredClone(auditoria);
  const p = a.series.find(e => e.serie === 'serie-ihpc-rendas-variacao-homologa').folhas[0].partes.find(p => p.apoios?.some(a => a.origem));
  p.apoios.find(a => a.origem).declaracao = 'nome';
  morde('nome misturado com uma origem válida', conferirAuditoriaDasSeries({auditoria:a}).erros, 'o nome do projeto não pode apoiar uma frase');
}
for (const lang of ['pt','en']) {
  const caminho = `dist/${lang === 'pt' ? 'livro-razao' : 'en/ledger'}/posicao-de-investimento-internacional-2025/index.html`;
  const html = fs.readFileSync(caminho, 'utf8');
  assert.equal(conferirSemMarcadores(parse(html)), null);
  for (const [nome, marca] of [['texto simples','<p>[a verificar]</p>'],['marca em inglês','<p>[to verify]</p>'],['texto partido','<p>[a <b>verificar</b>]</p>'],['marca sem texto','<span class="marcador"></span>']]) {
    const copia = parse(html);
    copia.querySelector('main').insertAdjacentHTML('beforeend', marca);
    morde(`${nome} numa página construída (${lang})`, [conferirSemMarcadores(copia)].filter(Boolean), 'RP4N: uma página de leitor contém uma marca de informação por confirmar');
  }
}
for (const lang of ['pt','en']) {
  const pasta = `dist/${lang === 'pt' ? 'estudos' : 'en/studies'}`;
  const caminhos = fs.readdirSync(pasta).sort().map(s => `${pasta}/${s}/${lang === 'pt' ? 'documento' : 'document'}/index.html`);
  const caminho = caminhos.find(p => fs.existsSync(p) && conferirSemMarcadores(parse(fs.readFileSync(p,'utf8'))) === null);
  assert(caminho, 'a planta precisa de um documento construído sem marcas');
  const copia = parse(fs.readFileSync(caminho,'utf8'));
  copia.querySelector('body').insertAdjacentHTML('beforeend','<p>[a verificar]</p>');
  morde(`marca num documento citado (${lang})`, [conferirSemMarcadores(copia)].filter(Boolean), 'RP4N: uma página de leitor contém uma marca de informação por confirmar');
}
if (process.argv.includes('--registo')) fs.writeFileSync('design/especime-v3/medicoes/rp4n-2026-10-06/plantas-sitio.json', JSON.stringify({plantas},null,2)+'\n');
console.log(`RP4N: plantas exercitadas, ${plantas.length} plantas com a mensagem afirmada`);

// RP4-n-d: não basta um campo plausível nem um resumo com 64 caracteres.
for (const [nome, altera, mensagem] of [
  ['PRR coluna inventada', l => {l.document.computed_over.column = 'valor_inventado';}, 'não está no cabeçalho selado'],
  ['PRR outro Excel plausível', l => {l.document.computed_over.files[0].sha256 = 'a'.repeat(64);}, 'iguais aos Excel lidos'],
  ['PRR instantâneo alterado', l => {l.document.computed_over.files[0].snapshot_date = '2026-08-20';}, 'iguais aos Excel lidos'],
  ['PRR seleção alargada', l => {l.document.computed_over.filter = 'todos';}, 'seleção da casa difere'],
  ['PRR soma alterada', l => {l.value = '1';}, 'difere da soma conferida'],
]) {
  const linhas = structuredClone(loadClaims({ includeWithdrawn: true })); altera(linhas.get('evora-prr-aprovado-2026'));
  morde(nome, conferirAuditoriaDasFamilias({linhas}).erros, mensagem);
}
{
  const a = structuredClone(auditoria);
  const e = a.familias.find(e => e.chaves?.includes('evora-prr-aprovado'));
  e.folhas[0].partes[0].apoios.push({linha:'propria', campo:'document.computed_over.filter', literal:'Évora'});
  morde('PRR filtro promovido a fonte', conferirAuditoriaDasFamilias({auditoria:a}).erros, 'campo «document.computed_over.filter», que não pode apoiar');
  e.folhas[0].partes[0].apoios.pop();
  e.folhas[0].partes[0].apoios.push({ficheiro:'entidades', campo:'cabecalho', literal:'coluna_inventada'});
  morde('PRR cabeçalho inventado', conferirAuditoriaDasFamilias({auditoria:a}).erros, 'literal não foi lido');
}
console.log(`RP4N-d: plantas exercitadas, ${plantas.length} plantas acumuladas com a mensagem afirmada`);

// A ausência não pode inflacionar a contagem de definições seladas (achado 18).
for (const chave of ['avisos-pt2030-abertos','avisos-pt2030-pessoas-singulares','ciclo-substituicao-condutas']) {
  assert(conferirAuditoriaDasFamilias().contas.lista_da_casa.includes(chave), `${chave}: ausência contada como fonte`);
}
// O recorte mensal não apoia uma linha anual (achado 17).
{
  const a = structuredClone(auditoria);
  for (const e of a.familias) for (const f of e.folhas ?? []) for (const p of f.partes ?? []) for (const ap of p.apoios ?? []) {
    if (ap.origem === 'rp4n-ac-ss-orcamento') ap.origem = 'rp4n-ac-ss';
  }
  morde('recorte mensal numa linha anual', conferirAuditoriaDasFamilias({auditoria:a}).erros, 'recorte de janeiro a agosto não apoia uma linha anual');
}
// A explicação de cada termo conserva a frase definidora da fonte (15 e 16).
for (const chave of ['rp4n-diferencas-consolidacao','rp4n-saldos-gerencia']) {
  const origens = structuredClone(ORIGENS_DAS_DEFINICOES); delete origens[chave];
  morde(`definição retirada: ${chave}`, conferirAuditoriaDasFamilias({origens}).erros, `apoia-se em «${chave}»`);
}
{
  const a = structuredClone(auditoria);
  const vab = a.familias.filter(e => e.chaves?.some(k => ['evora-vab-empresarial','portugal-concentracao-vab4','evora-concentracao-vab4'].includes(k)));
  assert.equal(vab.filter(e => JSON.stringify(e).includes('output valued at basic prices less intermediate consumption')).length, 2);
}
// A auditoria completa é afirmada no fim, depois de registar as plantas.
console.log(`RP4N-d documental: plantas exercitadas, ${plantas.length} plantas e controlos de classificação e de definição`);

// Achado 14: a explicação não selada não pode regressar através da exportação.
for (const l of loadClaims({ includeWithdrawn: true }).values()) {
  assert(!String(l.ressalva ?? '').includes('A despesa bruta inclui operações financeiras'), `${l.id}: regressou a nota não selada`);
  assert(!String(l.ressalva_en ?? '').includes('Gross expenditure includes financial transactions'), `${l.id}: regressou a nota não selada inglesa`);
}
console.log('RP4N-d nota: PASS, ausência da explicação não selada em todas as linhas');
{
  const linhas = structuredClone(loadClaims({ includeWithdrawn: true }));
  const l = linhas.get('penalizacao-antecipacao-um-ano-neutra');
  l.excerpt = l.excerpt.replace('Decrementos por reforma antecipada: caso geral', 'legenda retirada');
  morde('legenda da pensão retirada', conferirAuditoriaDasFamilias({linhas}).erros, 'não está no campo «excerpt»');
}
console.log(`RP4N-d final: plantas exercitadas, ${plantas.length} plantas com mensagem afirmada`);

// RP4-n-e: o excerto da figura conserva o rótulo, o valor e a fonte, sem despejar os eixos.
export function conferirExcertoDaPensao(linha) {
  return linha.excerpt === 'Figura 8.4: Decrementos por reforma antecipada: caso geral' && linha.document?.crop?.page === 273
    ? [] : ['RP4N-f: a pensão exige a legenda contígua e o recorte da figura'];
}
{
  const l = structuredClone(loadClaims({includeWithdrawn:true}).get('penalizacao-antecipacao-um-ano-neutra'));
  assert.deepEqual(conferirExcertoDaPensao(l), []);
  l.excerpt += '\n8.2%';
  morde('emenda do valor à legenda da pensão', conferirExcertoDaPensao(l), 'legenda contígua e o recorte');
}

// RP4-n-e: nem uma paráfrase da ausência, nem uma unidade sem concordância.
{
 const a=structuredClone(auditoria); const e=a.familias.find(e=>e.chaves?.includes('avisos-pt2030-abertos'));
 e.folhas[0].partes[0].pt='Os avisos consultados não definem por palavras esta contagem.';
 const {FAMILIAS_DAS_LINHAS}=await import('../../src/data/o-que-e-das-familias.mjs');
 const familias=structuredClone(FAMILIAS_DAS_LINHAS);
 for(const k of e.chaves) familias[k].frase.pt=[e.folhas[0].partes[0].pt];
 morde('paráfrase da ausência',conferirAuditoriaDasFamilias({auditoria:a,familias}).erros,'a ausência exige a retirada');
 const {unidadeDaLinha}=await import('../../src/i18n/unidades.mjs');
 for(const [lang,um,dois] of [['pt','aviso','avisos'],['en','notice','notices']]) {
  assert.equal(unidadeDaLinha('avisos',lang,'1').texto,um);
  assert.equal(unidadeDaLinha('avisos',lang,'2').texto,dois);
 }
}

// A quota recusa outro denominador, mesmo mantendo as palavras da fonte.
{
 const linhas=structuredClone(loadClaims({includeWithdrawn:true}));
 const l=linhas.get('oe-2026-cem-euros-ministerio-saude');
 l.check=l.check.replace('oe-2026-despesa-bruta-administracao-central','oe-2026-despesa-efetiva-administracao-central');
 morde('ministério dividido por outro total',conferirAuditoriaDasFamilias({linhas}).erros,'não está no campo «check»');
 const origens=structuredClone(ORIGENS_DAS_DEFINICOES);origens['rp4n-total-ministerios'].excerto='DESPESA BRUTA';
 morde('total do mapa trocado por palavras do projeto',conferirAuditoriaDasFamilias({origens}).erros,'não está no campo «excerto»');
}

// RP4-n-e: a linha retirada fica no livro, mas não no carregador de publicação.
{
 const id='ciclo-substituicao-condutas';
 assert.equal(loadClaims({includeWithdrawn:true}).get(id).publication,'withdrawn');
 assert(!loadClaims().has(id),'RP4N-e: uma linha retirada chegou ao compositor');
 for(const lang of ['pt','en']) {
  const base=lang==='pt'?'livro-razao':'en/ledger';
  assert(!fs.existsSync(`dist/${base}/${id}/index.html`),'RP4N-e: uma linha retirada tem página');
  assert(!fs.readFileSync(`dist/${base}/index.html`,'utf8').includes(id),'RP4N-e: uma linha retirada chegou ao índice');
 }
}

// RP4-n-e: o título vencido lê a data da computação e as derivadas conservam a seleção.
{
 const {NOMES_DO_PROJETO}=await import('../../src/data/nomes-das-medidas.mjs');
 const l=loadClaims().get('evora-prr-vencido-aprovado-2026');
 const datas=l.document.computed_over.files.map(f=>f.snapshot_date);
 for(const lang of ['pt','en']) assert(NOMES_DO_PROJETO[l.id][lang].includes(datas[0].split('-').reverse().join('.')));
 try {
  l.document.computed_over.files.forEach(f=>f.snapshot_date='2000-01-02');
  assert(NOMES_DO_PROJETO[l.id].pt.endsWith('02.01.2000'),'RP4N-e: o título PRR não acompanha o campo da computação');
 } finally { l.document.computed_over.files.forEach((f,i)=>f.snapshot_date=datas[i]); }
 for(const id of ['evora-prr-execucao-2026','evora-prr-vencido-quota-2026']) {
  assert(loadClaims().get(id).derivation.includes('intermediários e diretos com sede em Évora'));
 }
}

// RP4-n-e: outro publicador com o mesmo literal é recusado, incluindo recibos incompletos.
{
 const origens=structuredClone(ORIGENS_DAS_DEFINICOES);
 origens['rp4n-orcamento'].publicador='Publicador plantado';
 morde('origem de outro publicador',conferirAuditoriaDasFamilias({origens}).erros,'outro publicador');
 const linhas=structuredClone(loadClaims({includeWithdrawn:true}));
 const l=linhas.get('evora-vab-empresarial-2024');
 delete l.definition_sources;
 morde('segunda fonte sem declaração na linha',conferirAuditoriaDasFamilias({linhas}).erros,'outro publicador');
}

// RP4-n-e: uma referência plantada numa página alheia também fecha a construção.
{
 const {conferirRetiradas}=await import('../../scripts/linhas-retiradas.mjs');
 const linhas=loadClaims({includeWithdrawn:true});
 morde('linha retirada num cartão plantado',conferirRetiradas('<a href="/livro-razao/ciclo-substituicao-condutas/">239</a>',linhas),'uma linha retirada chegou a uma página');
}
{
 const {conferirValorUnidade}=await import('../../scripts/valor-unidade.mjs');
 for(const [lang,errada] of [['pt','avisos'],['en','notices']]) {
  const html=parse(`<html lang="${lang}"><p class="linha-valor"><span data-claim="avisos-pt2030-pessoas-singulares">1</span> <span data-linha-campo="unit">${errada}</span></p></html>`);
  morde(`unidade plural com um aviso (${lang})`,conferirValorUnidade(html,loadClaims({includeWithdrawn:true})).erros,'a unidade dos avisos não concorda');
 }
}
// A definição da água conserva a fonte da medida e a página visível nas duas edições.
{
 const origem=ORIGENS_DAS_DEFINICOES['rp4n-agua-nao-faturada'];
 assert.equal(origem.publicador,loadClaims().get('agua-nao-faturada-portugal-2024').source);
 assert.equal(origem.extracao.pagina,106);
 const outras=structuredClone(ORIGENS_DAS_DEFINICOES);
 outras['rp4n-agua-nao-faturada'].publicador='Agência Portuguesa do Ambiente';
 morde('água novamente atribuída à APA',conferirAuditoriaDasFamilias({origens:outras}).erros,'outro publicador');
 const ctx=contextoDasFamilias(),cartoes=reguasDosCartoes('dist');
 for(const lang of ['pt','en']) {
  const id='agua-nao-faturada-portugal-2024';
  const cabeca=cabecaDoRecibo(fs.readFileSync(`dist/${lang==='pt'?'livro-razao':'en/ledger'}/${id}/index.html`,'utf8'));
  assert.deepEqual(conferirCabecaDoRecibo(cabeca,id,lang,{ctx,cartoes}),[]);
  const semRotulo=cabecaDoRecibo(cabeca.outerHTML);
  semRotulo.querySelector('.linha-nome-da-fonte [data-linha-campo="name"]').setAttribute('data-linha-campo','document.title');
  morde(`título do relatório em vez do rótulo da água (${lang})`,conferirCabecaDoRecibo(semRotulo,id,lang,{ctx,cartoes}),'o nome na fonte não é o rótulo da medida conferido');
  cabeca.querySelector('[data-def-origem="rp4n-agua-nao-faturada"]').remove();
  morde(`origem da água apagada do recibo (${lang})`,conferirCabecaDoRecibo(cabeca,id,lang,{ctx,cartoes}),'a origem visível da definição perdeu o documento ou o excerto');
 }
}
// RP4-n-g: a mesma regra do nome na fonte protege a família da pensão.
{
 const ctx=contextoDasFamilias(),cartoes=reguasDosCartoes('dist');
 const id='penalizacao-antecipacao-um-ano-neutra';
 for(const lang of ['pt','en']) {
  const cabeca=cabecaDoRecibo(fs.readFileSync(`dist/${lang==='pt'?'livro-razao':'en/ledger'}/${id}/index.html`,'utf8'));
  assert.deepEqual(conferirCabecaDoRecibo(cabeca,id,lang,{ctx,cartoes}),[]);
  cabeca.querySelector('.linha-nome-da-fonte [data-linha-campo="name"]').setAttribute('data-linha-campo','document.title');
  morde(`título do relatório em vez do rótulo da pensão (${lang})`,conferirCabecaDoRecibo(cabeca,id,lang,{ctx,cartoes}),'o nome na fonte não é o rótulo da medida conferido');
 }
}
// RP4-n-f: a prova local conserva o excerto, a página e a distinção face à lei.
{
 const origens=structuredClone(ORIGENS_DAS_DEFINICOES);
 origens['pensao-neutralidade'].excerto += ' frase inventada';
 morde('definição local da pensão adulterada',auditarPerguntas({origens}).erros,'o excerto local difere da leitura da página alojada');
 morde('definição local da pensão adulterada na K17',conferirAuditoriaDasLeituras({origens}).erros,'o excerto local difere da leitura da página alojada');
 const l=loadClaims().get('penalizacao-legal-um-ano-antecipacao-2026');
 assert.equal(l.value,'6'); assert(l.excerpt.includes('cerca de 6% por ano')); assert(l.ressalva.includes('Valor aproximado')); 
}
{
 const {conferirPublicacaoRetirada}=await import('../../scripts/linhas-retiradas.mjs');
 const os=await import('node:os'),path=await import('node:path');
 const pasta=fs.mkdtempSync(path.join(os.tmpdir(),'rp4nf-retirada-'));
 try {
  fs.writeFileSync(path.join(pasta,'livro-razao.json'),JSON.stringify([{id:'avisos-pt2030-abertos'}]));
  morde('linha retirada no JSON do conjunto',conferirPublicacaoRetirada(pasta,loadClaims({includeWithdrawn:true})).map(e=>e.mensagem),'uma linha retirada chegou a uma página: avisos-pt2030-abertos');
 }finally{fs.rmSync(pasta,{recursive:true,force:true});}
}
{
 const {conferirCaminhoFinal}=await import('../../scripts/caminho-final.mjs');
 for(const lang of ['pt','en']) {
  const root=parse(fs.readFileSync(`dist/${lang==='pt'?'livro-razao':'en/ledger'}/agua-nao-faturada-portugal-2024/index.html`,'utf8'));
  assert.deepEqual(conferirCaminhoFinal(root),[]);
  root.querySelector('nav.caminho').insertAdjacentHTML('beforeend','<span class="caminho-sep">›</span>');
  morde(`separador final solto (${lang})`,conferirCaminhoFinal(root),'o caminho termina num separador sem destino');
 }
}
// RP4-n-j: uma fonte declarada para validar a frase não altera a lista visível.
{
 const ctx=contextoDasFamilias(),cartoes=reguasDosCartoes('dist');
 const id='custo-do-stock-da-divida-direta-2025';
 for(const lang of ['pt','en']) {
  const cabeca=cabecaDoRecibo(fs.readFileSync(`dist/${lang==='pt'?'livro-razao':'en/ledger'}/${id}/index.html`,'utf8'));
  assert.deepEqual(conferirCabecaDoRecibo(cabeca,id,lang,{ctx,cartoes}),[]);
  cabeca.querySelector('.linha-cabeca').insertAdjacentHTML('beforeend','<div data-def-origem="ine-pde-subsetores"></div>');
  morde(`excerto alheio acrescentado pela segunda fonte (${lang})`,conferirCabecaDoRecibo(cabeca,id,lang,{ctx,cartoes}),'as origens visíveis não são a lista explícita da família');
 }
}
if(process.argv.includes('--registo-g')) fs.writeFileSync('design/especime-v3/medicoes/rp4n-2026-10-06/g/plantas-sitio.json',JSON.stringify({plantas},null,2)+'\n');
if(process.argv.includes('--registo-f')) fs.writeFileSync('design/especime-v3/medicoes/rp4n-2026-10-06/f/plantas-sitio.json',JSON.stringify({plantas},null,2)+'\n');
if(process.argv.includes('--registo-e')) fs.writeFileSync('design/especime-v3/medicoes/rp4n-2026-10-06/e/plantas-sitio.json',JSON.stringify({plantas},null,2)+'\n');
assert.deepEqual(conferirAuditoriaDasFamilias().erros, []);
console.log(`RP4N-e: PASS, ${plantas.length} plantas e auditoria íntegra`);
