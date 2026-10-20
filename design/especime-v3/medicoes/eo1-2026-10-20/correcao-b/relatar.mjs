/** EO1-b: extrai as frases reais e os códigos guardados, sem os preencher à mão. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {parse} from 'node-html-parser';
const dir='design/especime-v3/medicoes/eo1-2026-10-20',out=dir+'/correcao-b';
const slug='orcamento-2027-o-que-muda-e-para-quem';
const norm=x=>x.replace(/[\u00a0\u202f]/g,' ');
const findings={
 6:['em parte','A comparação errada das taxas foi retirada e as seis linhas da AT dizem que são anteriores a setembro. Não foi identificado nem alojado o diploma de setembro; entrou a alternativa expressa do mandato, atribuída ao relatório e com a ausência declarada.'],
 7:['corrigido','O modificador abs retira o sinal apenas das frases que já dizem a direção. Os recibos conservam os valores originais. Cada uso está listado abaixo.'],
 8:['corrigido','A abertura identifica as dez linhas invariantes com a lista do mandato; a conclusão e a leitura de entrada usam a mesma classificação.'],
 9:['corrigido','A dívida é a preocupação citada pelo ministro; o excedente primário contribui mais, e a aceleração é atribuída sobretudo ao ajustamento défice-dívida.'],
 10:['corrigido','A conclusão distingue a atualização geral das progressões, promoções e acordos de carreira. A comparação com a inflação deixa de afirmar um salário real parado.'],
 11:['corrigido','A glosa da nota do quadro foi retirada. O texto remete para o cenário que a UTAO descreve.'],
 12:['corrigido','As duas datas passam a coincidir com os períodos das linhas. A célula compara o período e a referência em todas as linhas EO1.'],
 13:['corrigido','Os recibos imprimem o período real da linha; os três exemplos legais identificam o ano e o diploma aplicável.'],
 14:['corrigido','Todas as linhas novas e europeias têm nome nas duas línguas. O recibo mostra o nome e o título documental; a exportação recusa nomes ausentes.'],
 15:['corrigido','O literal exige limites de token no compositor, no validador e na célula HTML. A planta 8.º apoiado por 18.º termina com código de recusa nas três camadas.'],
 16:['corrigido','Os valores e literais de datas rendem em inglês pelo formato da casa. As citações integrais mantêm a língua da fonte.'],
 17:['corrigido','A conclusão dos juros compara os crescimentos em contabilidade pública e os montantes em contabilidade nacional, dentro do mesmo perímetro.'],
 18:['corrigido','A expressão do Bloco de Esquerda é um literal provado na linha citada.'],
 19:['corrigido','As expansões foram acrescentadas nas duas edições, antes das citações que usam as siglas. A lista e as frases renderizadas estão abaixo.'],
 20:['corrigido','Os títulos das notícias têm aspas; os títulos do JPP e do CDS só aparecem uma vez; a citação do IRC parte da lei; a conclusão dos juros recupera o título a negrito; a expansão do SIFIDE está no parêntesis mandatado.'],
 21:['corrigido','A frase do saldo inclui as administrações regional e local.'],
 22:['corrigido','A soma das derivadas e o arredondamento das linhas do pessoal estão escritos no documento, com valores vindos das linhas.'],
 23:['corrigido','O CFP identifica medidas de 2026 e as linhas Eurostat usam percentagem do PIB.'],
 24:['corrigido','Os recibos das derivadas imprimem nomes e valores das componentes, operadores e significado do sinal.'],
 25:['corrigido','EO1-3 e EO1-6 foram corrigidas; a comparação do INE distingue os campos ausentes no livro dos metadados presentes na exportação. As notas UTAO reconhecem as chamadas impressas no PDF.'],
 26:['corrigido','Os códigos de selagem, compositor, cruzamento e séries foram guardados e são lidos abaixo, juntamente com os portões.'],
 27:['corrigido','A conferência da prosa numérica, a primeira H2 e a lista fechada de áreas têm plantas. A abertura inglesa usa In brief.'],
 28:['corrigido','A porta aparece apenas nos dois itens mandatados e na explicação do Orçamento. A célula conta as portas por página e planta ausências, duplicações e destinos errados.'],
 29:['não corrigido','O endereço de rede no corpo dos direitos do Eurostat em content/23 ficou para a higiene do motor, como determina este mandato.'],
 30:['não corrigido','O artefacto de listagem do pacote pertence ao empacotador; o recibo da cópia de origem existe. Esta passagem não altera a escolha de cópias pelo empacotador.'],
};
let s='\n<!-- EO1-B -->\n\n## A correção EO1-b\n\n### §0. O que foi corrigido e medido\n\nA correção segue os achados da leitura EO1. A medição está em `correcao-b/medicao.json`; os códigos, os registos das plantas, as frases e as capturas ficam na mesma pasta. As frases abaixo foram extraídas do HTML das duas páginas em cada edição e comparadas com o registo.\n\n';
s+='A pesquisa oficial não confirmou uma lei de setembro com a tabela do artigo do IRS. O [Despacho de outubro](https://diariodarepublica.pt/dr/detalhe/despacho/12523-a-2026-1180337885) refere a autorização parlamentar e trata das retenções. Não foi usado para fingir que a tabela anual tinha sido selada. O texto usa a alternativa do mandato e diz que não conferiu o diploma.\n\n';
s+='### Resposta aos achados\n\n';
for(let n=1;n<=5;n++)s+=`- Achado ${n}: **corrigido** no sentido de conferido sem o estrago. Era uma planta na cópia da leitura; a origem não continha essa alteração. As plantas desta entrega reconferem valores e excertos.\n`;
for(const [n,[state,reason]] of Object.entries(findings))s+=`- Achado ${n}: **${state}**. ${reason}\n`;
s+='\n### Decisões seguintes\n\n- EO1-30. A lei de setembro não foi identificada com prova suficiente: aplica-se a frase alternativa do mandato, sem criar diploma, identificador ou linha plausível.\n- EO1-31. O absoluto é uma regra de apresentação declarada na prova. A linha e o recibo continuam assinados, e retirar o modificador é uma planta recusada.\n- EO1-32. A nova soma usa as duas derivadas existentes. O arredondamento não é corrigido silenciosamente: o total impresso conserva-se ao lado da soma.\n- EO1-33. As linhas da antiga citação do percurso do IRC e do total dos juros da UTAO deixam de atravessar para este estudo porque as frases já não as citam. As linhas permanecem no livro do motor; a retirada da exportação é explícita no manifesto.\n- EO1-34. Os nomes são metadados bilingues da medida; o rótulo original e o localizador continuam conservados na prova. As colunas das células identificam o período, o estado e a unidade.\n- EO1-35. Na conclusão salarial, a frase do mandato mantém o crescimento das despesas com pessoal em contabilidade pública, enquanto a citação da UTAO usa contabilidade nacional. Os valores são de linhas diferentes; a leitura do lugar de direção deve conferir esta passagem nas duas edições.\n- EO1-36. As novas conferências recusam os estragos plantados sem alargar exceções a todas as linhas do estudo. O endereço de rede e o artefacto de listagem mantêm o destino de higiene declarado.\n\n';
const codes=fs.readdirSync(out).filter(f=>f.endsWith('.codigo')).sort();
for(const name of ['build','verify','typecheck','motor','selagem','compositor','cruzamento','series','capturas']) assert.equal(fs.readFileSync(`${out}/${name}.codigo`,'utf8').trim(),'0',`${name} não passou`);
s+='### Códigos lidos dos ficheiros\n\n| Ficheiro | Código |\n| --- | --- |\n';
for(const f of codes){const code=fs.readFileSync(`${out}/${f}`,'utf8').trim();assert(/^\d+$/.test(code));s+=`| correcao-b/${f} | ${code} |\n`;}
s+='\nComandos: `medir.py --selagem`, `python3 -m core.compor_livros_test`, `RESEARCHHUB_DIR=<motor> npm run check:cruzamento -- --with-origin`, `RESEARCHHUB_DIR=<motor> npm run check:series`, os portões pelo escrivão com motor e as capturas pelo escrivão. Os registos completos permanecem na pasta temporária; só os excertos sanitizados e os códigos entram no relatório.\n\n';
const results=[];
for(const lang of ['pt','en']){
 const r=JSON.parse(fs.readFileSync(`registos/${slug}/${lang}.record.json`));
 const old=JSON.parse(execFileSync('git',['show',`84840bcc7:registos/${slug}/${lang}.record.json`],{encoding:'utf8'}));
 const routes=lang==='pt'?[`estudos/${slug}`,`estudos/${slug}/documento`]:[`en/studies/${slug}`,`en/studies/${slug}/document`];
 const page=parse(fs.readFileSync(`dist/${routes[0]}/index.html`,'utf8'));
 const doc=parse(fs.readFileSync(`dist/${routes[1]}/index.html`,'utf8'));
 const actual=doc.querySelector('[data-documento-corpo]')??doc.querySelector('[data-oedp-moldura]');assert(actual);
 for(const b of r.blocks){
  const e=page.querySelector(`[data-registo-unidade="${slug}/${lang}#${b.i}"]`);assert(e);e.querySelectorAll('[data-selo-etiqueta]').forEach(x=>x.remove());assert.equal(norm(e.textContent),norm(b.text));
  assert(norm(actual.textContent).includes(norm(b.text)),`documento diverge ${lang} ${b.i}`);
  const changed=!old.blocks.some(x=>x.text===b.text),abs=(b.proofs??[]).filter(q=>q.modificador==='abs');
  results.push({edicao:lang,unidade:b.i,alterada:changed,texto:norm(e.textContent),absolutos:abs.map(q=>({id:q.id,valor_renderizado:q.texto,valor_na_linha:r.proof_rows[q.id].value}))});
 }
}
fs.writeFileSync(out+'/frases-renderizadas.json',JSON.stringify(results,null,2)+'\n');
s+='### Cada uso de abs, tal como renderiza\n\n';
for(const b of results.filter(b=>b.absolutos.length))s+=`- ${b.edicao}, unidade ${b.unidade}, ${b.absolutos.map(a=>'`'+a.id+'|abs`').join(', ')}: ${b.texto}\n\n`;
s+='A frase de entrada em `leituras.mjs` usa também o absoluto da linha das invariantes nas duas línguas; o selo declara o modificador e o portão compara-o com o valor absoluto da linha.\n\n';
s+='### Siglas\n\nUTAO, CFP, IRS, IRC, IVA, CSI, PRR, PIB, SNS, INE, PS, PSD, PCP, CDS, JPP, PAN, BE, IL, MF, POE, POENMP, QPI, DGAEP, PPP, BdP, CE, OCDE, FMI, PT2030, AD, SMN, RMMG, BOE e SIFIDE. As expansões estão nas frases abaixo; SIFIDE conserva a expansão no parêntesis da secção das medidas, como determina o mandato. Os partidos Chega e Livre são escritos pelo nome.\n\n';
s+='### Frases novas ou mudadas, tal como renderizam\n\n';
for(const lang of ['pt','en']){s+='#### '+lang+'\n\n';for(const b of results.filter(b=>b.edicao===lang&&b.alterada))s+=`**Unidade ${b.unidade}.** ${b.texto}\n\n`;}
const readme=dir+'/LEIA-ME.md',previous=fs.readFileSync(readme,'utf8').split('\n<!-- EO1-B -->')[0];fs.writeFileSync(readme,previous+s);console.log('EO1-b: relatório extraído das duas páginas nas duas línguas; códigos lidos.');
