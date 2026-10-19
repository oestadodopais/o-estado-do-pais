/** EX3: terceira correção, provas lidas da construção e das corridas. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {parse} from 'node-html-parser';
import {loadClaims} from '../../../../src/lib/ledger.mjs';
const aqui=path.dirname(new URL(import.meta.url).pathname),root=path.resolve(aqui,'../../../..');
const motor=process.env.RESEARCHHUB_DIR,portoes=process.env.EX3_PORTOES,ensaios=process.env.EX3_ENSAIOS,capturas=process.env.EX3_CAPTURAS;
assert(motor&&portoes&&ensaios&&capturas,'Faltam as pastas das provas');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const limpar=s=>s.replaceAll(motor,'<motor>').replaceAll(root,'<worktree>').replaceAll('/private/tmp/','<temporario>/').replaceAll('/tmp/','<temporario>/');
const portasMotor=process.env.EX3_MOTOR_PORTOES??portoes;
const destino=path.join(aqui,'terceira-correcao');fs.mkdirSync(destino,{recursive:true});
const copiar=(p,nome)=>fs.writeFileSync(path.join(destino,nome),limpar(read(p)));
const escopo=json(path.join(ensaios,'escopo.json'));assert(escopo.declaracaoForaDeP1Identica&&escopo.apoiosForaDeP1Identicos);copiar(path.join(ensaios,'escopo.json'),'escopo.json');
const codigos={};
for(const k of ['build','verify','typecheck','motor','series','cruzamento','plantas-sitio','plantas-motor']){
 const pasta=k==='motor'?portasMotor:['build','verify','typecheck'].includes(k)?portoes:ensaios;
 const p=path.join(pasta,k+'.codigo');codigos[k]=read(p).trim();copiar(p,k+'.codigo');assert.equal(codigos[k],'0',k);
 if(pasta===ensaios)copiar(path.join(pasta,k+'.log'),k+'.log');
}
for(const k of ['indice','rotulos','lingua','areas'])copiar(path.join(ensaios,k+'.log'),k+'.log');
const cabeca=json(path.join(root,'dist/version.json')).commit,cabecaMotor=read(path.join(portasMotor,'motor.cabeca')).trim();
for(const k of ['cabeca','cabeca.fim']){assert.equal(read(path.join(portoes,k)).trim(),cabeca);copiar(path.join(portoes,k),k);}
assert.equal(cabecaMotor,execFileSync('git',['rev-parse','HEAD'],{cwd:motor,encoding:'utf8'}).trim());copiar(path.join(portasMotor,'motor.cabeca'),'motor.cabeca');
const manifest=json(path.join(capturas,'capturas.json'));assert.equal(manifest.cabeca,cabeca);assert.deepEqual(manifest.falhas,[]);
for(const r of manifest.resultados){assert(r.documento<=r.largura&&r.corpo<=r.largura);for(const c of [r,...r.recortes])assert.equal(sha(path.join(capturas,c.ficheiro)),c.sha256);}
copiar(path.join(capturas,'capturas.json'),'capturas.json');
const linhas=[...loadClaims().values()].filter(x=>/^nato-(defesa|compromisso|cimeira)-/.test(x.id));
const frases={},recibos={};
const texto=el=>{el.querySelectorAll('.src-chip,.claim-provisorio-chip').forEach(x=>x.remove());return el.textContent.replace(/\s+/g,' ').trim();};
for(const lang of ['pt','en']){
 const file=path.join(root,'dist',lang==='pt'?'explicacoes':'en/explainers','dinheiro-do-estado-2026/index.html'),doc=parse(read(file));
 const p1=doc.querySelector('[data-explicacao-paragrafo="seccoes[0].conteudo[2].paragrafo"]');assert(p1);
 const pensoes=lang==='pt'?'e as relativas ao pessoal no ativo.':'and for active personnel.';assert(p1.textContent.includes(pensoes));
 for(const r of linhas.filter(r=>r.id.startsWith('nato-compromisso-')))assert.equal(p1.querySelector(`[data-claim="${r.id}"]`).textContent.trim(),r.value);
 frases[lang]={pagina:path.relative(root,file),sha256:sha(file),p1:texto(p1)};recibos[lang]={};
 for(const r of linhas){
  const file=path.join(root,'dist',lang==='pt'?'livro-razao':'en/ledger',r.id,'index.html'),doc=parse(read(file));
  const literal=doc.querySelector('[data-linha-campo="excerpt"]');assert(literal,'Excerto ausente: '+r.id);
  assert.equal(literal.textContent.trim(),r.excerpt.trim());
  assert.equal(doc.querySelectorAll('main a[href]').filter(a=>!a.closest('[data-rotulo-ia]')&&a.getAttribute('href').split('#')[0]===(lang==='pt'?'/metodo':'/en/method')).length,1,'Porta do Método repetida: '+r.id);
  if(r.id.startsWith('nato-defesa-')){assert(!literal.textContent.includes('PDF, página'));assert(doc.querySelector('#ressalva').textContent.includes(lang==='pt'?'A forma impressa no PDF não foi lida':'The printed form in the PDF was not read'));}
  recibos[lang][r.id]={pagina:path.relative(root,file),sha256:sha(file),excerto:literal.textContent.trim(),ressalva:doc.querySelector('#ressalva')?.textContent.trim()??null};
 }
}
const celulas=json(path.join(motor,'content/21 Defesa NATO/provas.json'));assert(celulas.every(c=>c.impresso===null&&c.ausencia_pdf));
const m={cabeca,escopo,portoesMotor:limpar(portasMotor),motor:cabecaMotor,codigos,celulas,linhas,frases,recibos,capturas:{pasta:limpar(capturas),paginas:manifest.resultados.length,larguras:manifest.larguras,falhas:manifest.falhas.length},inspecaoVisual:process.env.EX3_VISUAL==='1'};
fs.writeFileSync(path.join(destino,'medicoes.json'),JSON.stringify(m,null,2)+'\n');
let out='\n\n## A terceira passagem de correção de 19.10.2026\n\n';
out+='1. A forma do PDF já não deriva da célula. `pdftotext -layout` lê o corpo alojado; o gerador procura a linha de Portugal na página e compara a coluna com o formato da célula. As páginas usadas pelas quatro linhas não têm texto extraível: as quatro linhas omitem a atribuição «PDF, página» e dizem a ausência na nota interna e na ressalva pública das duas edições. A prova sintética de texto extraível passa; as quatro formas divergentes e as quatro células trocadas são recusadas. `publisher.ex3_test` conserva as plantas anteriores.\n\n';
out+='2. A frase das pensões inclui agora o pessoal no ativo nas duas edições. O apoio continua a ser a frase inteira da definição selada. A X6 confere a composição e este guião confere a presença da parte reposta no HTML.\n\n';
out+='3. Os três compromissos da NATO entram pela mesma travessia e com os excertos literais da página alojada. Os recibos das duas edições foram comparados com as linhas exportadas. EX3-12: a gramática recusa algarismos em prosa fixa; `nato-cimeira-haia-2025` é a quarta linha textual autorizada, com «2025 NATO Summit in The Hague» e o período da cimeira, lidos na mesma frase do compromisso. O prazo da linha de Haia continua a ser 2035. As partes novas da auditoria citam as respetivas linhas; P2, ministérios, glosas e os seus apoios mantêm-se.\n\n';
out+='A extração usa os documentos, recibos e direitos já alojados; nenhum novo pedido HTTP. Comandos: `python3 -m publisher.ex3 --site <worktree>`, `python3 -m publisher.export_site_rows --manifest publisher/manifest.ex3.json --site <worktree> --write`, `node design/especime-v3/medicoes/ex3-2026-10-15/compor.mjs`. As medições desta passagem são escritas por `medir-terceira.mjs` em `terceira-correcao/`, preservando as medições anteriores.\n\n';
out+='### Linhas e prova documental\n\n| Linha | Valor | Período | Documento selado |\n| --- | --- | --- | --- |\n';
for(const r of linhas)out+=`| ${r.id} | ${r.value} | ${r.reference_date} | ${r.document.source_sha256} |\n`;
out+='\n### P1 copiado das páginas construídas\n\n';for(const lang of ['pt','en'])out+=`#### ${lang.toUpperCase()}\n\n${frases[lang].p1}\n\n`;
out+='A primeira corrida recusou a falta de cobertura das quatro linhas novas na A7. Foram declaradas fora da distribuição por ministérios, porque são compromissos da Aliança e a data da cimeira. A conferência A7 foi repetida sem mudar a régua. A edição da cópia HTML foi declarada sem língua. O verify detetou ainda o conjunto fechado de rótulos por atualizar, os localizadores HTML por declarar e a porta do Método repetida nos recibos novos. O conjunto inclui agora as linhas efetivamente exportadas, as plantas dos localizadores HTML recusam trocas de identidade, período e rótulo, e os recibos novos têm uma só porta do Método. O teto da L1 foi conservado. Os portões foram repetidos.\n\n';
out+='### Provas e cabeças\n\n';out+=`Construção, portões e capturas: \`${cabeca}\`. Motor: \`${cabecaMotor}\`.\n\n| Conferência | Código lido |\n| --- | --- |\n`;for(const [k,v] of Object.entries(codigos))out+=`| ${k} | ${v} |\n`;
out+=`\nCapturas em \`${m.capturas.pasta}\`: ${m.capturas.paginas} páginas, larguras ${m.capturas.larguras.join(', ')} px, ${m.capturas.falhas} falhas; resumos e largura conferidos por guião. `;
out+=m.inspecaoVisual?'P1 e o recibo de 2024 inspecionados nas duas edições a 390 e 1280 px.\n':'Inspeção visual por executar.\n';
out+='\nO registo do lançador foi preservado em `<temporario>/ex3-terceira-lancador/`, fora dos portões e dos commits. Nenhum PNG no repositório; nenhum push. Leitura curta do diff e aterragem a cargo do lugar de direção. A corrida após o commit deste relatório fica em `<temporario>/ex3-terceira-portoes-final/`, com os códigos e a cabeça próprios; não muda o conteúdo.\n\n';
out+=`Estado: ${m.inspecaoVisual?'concluído no âmbito do construtor, sujeito à leitura curta do diff':'em verificação'}.\n\ntokens used: não disponível\n`;
const relatorio=path.join(aqui,'RELATORIO.md');fs.writeFileSync(relatorio,read(relatorio).split('\n\n## A terceira passagem de correção de 19.10.2026')[0].trimEnd()+out);
console.log('EX3 terceira correção: relatório, frases, recibos e provas conferidos. '+JSON.stringify(codigos));
