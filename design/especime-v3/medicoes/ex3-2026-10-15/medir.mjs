/** EX3, segunda correção: frases lidas no HTML e provas copiadas das corridas reais. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {parse} from 'node-html-parser';
import {loadClaims} from '../../../../src/lib/ledger.mjs';
import {conferirAuditoriaDasExplicacoes} from '../../../../tests/explicacoes/explicacao.mjs';
const aqui=path.dirname(new URL(import.meta.url).pathname),root=path.resolve(aqui,'../../../..');
const motor=process.env.RESEARCHHUB_DIR,portoes=process.env.EX3_PORTOES,ensaios=process.env.EX3_ENSAIOS,capturas=process.env.EX3_CAPTURAS;
if(!motor||!portoes||!ensaios||!capturas)throw Error('Faltam RESEARCHHUB_DIR, EX3_PORTOES, EX3_ENSAIOS ou EX3_CAPTURAS');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const git=(cwd,...args)=>execFileSync('git',args,{cwd,encoding:'utf8'}).trim();
const limpar=s=>s.replaceAll(motor,'<motor>').replaceAll(root,'<worktree>').replaceAll('/private/tmp/','<temporario>/').replaceAll('/tmp/','<temporario>/');
const destino=path.join(aqui,'segunda-correcao');fs.mkdirSync(destino,{recursive:true});
const copiar=(p,nome)=>fs.writeFileSync(path.join(destino,nome),limpar(read(p)));
const codigos={};
for(const k of ['build','verify','typecheck','motor']){const p=path.join(k==='motor'?(process.env.EX3_MOTOR_PORTOES??portoes):portoes,k+'.codigo');codigos[k]=read(p).trim();copiar(p,k+'.codigo');}
for(const k of ['series','cruzamento','plantas-sitio','plantas-motor']){const p=path.join(ensaios,k+'.codigo');codigos[k]=read(p).trim();copiar(p,k+'.codigo');copiar(path.join(ensaios,k+'.log'),k+'.log');}
for(const k of ['cabeca','cabeca.fim'])copiar(path.join(portoes,k),k);
const portasMotor=process.env.EX3_MOTOR_PORTOES??portoes;
const cabecaMotor=read(path.join(portasMotor,'motor.cabeca')).trim();
if(cabecaMotor!==git(motor,'rev-parse','HEAD'))throw Error('O código do motor pertence a outra cabeça');
copiar(path.join(portasMotor,'motor.cabeca'),'motor.cabeca');
const manifest=json(path.join(capturas,'capturas.json'));
for(const r of manifest.resultados)for(const c of [r,...r.recortes])if(sha(path.join(capturas,c.ficheiro))!==c.sha256)throw Error('Captura com resumo diferente: '+c.ficheiro);
copiar(path.join(capturas,'capturas.json'),'capturas.json');
if(manifest.resultados.some(r=>r.documento>r.largura||r.corpo>r.largura))throw Error('Captura com transbordo horizontal');
const versao=json(path.join(root,'dist/version.json'));
if(manifest.cabeca!==versao.commit||read(path.join(portoes,'cabeca')).trim()!==versao.commit||read(path.join(portoes,'cabeca.fim')).trim()!==versao.commit)throw Error('HTML, portões e capturas não têm a mesma cabeça');
const seletores={abertura:'[data-explicacao-paragrafo="abertura[0]"]',figuraFuncoes:'#explicacao-figura-funcoes figcaption',p1:'[data-explicacao-paragrafo="seccoes[0].conteudo[2].paragrafo"]',p2:'[data-explicacao-paragrafo="seccoes[0].conteudo[3].paragrafo"]',ministerios:'[data-explicacao-paragrafo="seccoes[1].conteudo[0].paragrafo"]'};
const frases={};
for(const lang of ['pt','en']){
 const pagina=path.join(root,'dist',lang==='pt'?'explicacoes':'en/explainers','dinheiro-do-estado-2026/index.html'),doc=parse(read(pagina));
 frases[lang]={pagina:path.relative(root,pagina),sha256:sha(pagina),textos:{}};
 for(const [k,seletor] of Object.entries(seletores)){
  const el=k==='figuraFuncoes'?doc.querySelector('[data-explicacao-secao="por-funcao"] figcaption'):doc.querySelector(seletor);
  if(!el)throw Error('Texto ausente: '+k);
  el.querySelectorAll('.src-chip, .claim-provisorio-chip').forEach(x=>x.remove());
  frases[lang].textos[k]=el.textContent.replace(/\s+/g,' ').trim();
 }
}
const linhas=[...loadClaims().values()].filter(x=>x.id.startsWith('nato-defesa-portugal-'));
const celulas=json(path.join(motor,'content/21 Defesa NATO/provas.json'));
const m={passagem:'segunda-correcao-2026-10-19',base:'fdfcc9f3',cabeca:versao.commit,motor:git(motor,'rev-parse','HEAD'),codigos,linhas,celulas,frases,auditoria:conferirAuditoriaDasExplicacoes().contas,capturas:{cabeca:manifest.cabeca,larguras:manifest.larguras,resultados:manifest.resultados.length,falhas:manifest.falhas,pasta:'<temporario>/'+path.basename(capturas)},inspecaoVisual:process.env.EX3_VISTAS==='1'};
fs.writeFileSync(path.join(aqui,'medicoes.json'),JSON.stringify(m,null,2)+'\n');
let out='\n\n## A segunda passagem de correção de 19.10.2026\n\n';
out+='Esta secção substitui o estado da primeira correção: as fusões já chegaram pelo lugar de direção. Nesta passagem não se executou merge nem push. As secções anteriores conservam o registo histórico e as suas medições, incluindo as formas entretanto corrigidas.\n\n';
out+='- Achado 5: P1 diz que a definição da NATO inclui pensões e P2 compara NATO e Eurostat no mesmo ano. A frase das pensões é a terceira frase literal da origem selada `nato-definicao-despesa-defesa`; o setor e a contabilidade do Eurostat são os da linha `despesa-por-funcao-2024-gf02-pt`. A linha nova vem de `Table 3!L27`, com o mesmo documento, recibo e direitos.\n';
out+='- Achado 6: o montante das Finanças volta a seguir à sua parcela por cem euros. O total antes da consolidação é extraído do excerto de `rp4n-total-ministerios` pelo token `verbatim`, com comparação independente da página e planta de valor trocado. Conserva-se a enumeração dos ministérios seguintes como frase separada.\n';
out+='- Achado 7: a abertura, a figura das funções e P1 recebem a glosa da família nas duas edições, apoiada em `rp4n-despesa-efetiva` e `rp4n-consolidacao`.\n';
out+='- Achado 8: o compositor deixa de atribuir apoios genéricos de `pib-2026` a P1. A X13 exige que a parte imediatamente junto de cada valor e o seu sufixo citem a linha desse token. As plantas trocam os apoios dos euros, da percentagem e do sufixo. Os preços constantes, os preços correntes, os períodos e as estimativas têm apoios próprios.\n';
out+='- Achado 13: as percentagens usam o cabeçalho literal `Share of real GDP (%)`, lido em `Table 3!A3`, em vez do título de duas medidas. A navegação, as línguas e a régua dos localizadores acompanham-no. O recibo de 2024 tem uma definição sem a palavra estimativa.\n';
out+='- Achado 15: cada valor estimado conserva uma só marca entre parênteses, em minúscula e sem ponto. A prosa usa apenas as expressões fixadas no mandato. A célula de 2024 não recebe marca.\n';
out+='- Achado 18: `printed_cell` lê o valor e o `number_format`. O formato `General` dos euros dá os algarismos da célula; a apresentação agrupada do PDF deriva desses mesmos algarismos. A forma impressa do montante não está escrita à mão no gerador. As plantas alteram a célula e o formato.\n';
out+='- Achado 11, parte incluída: `DESPESA TOTAL` tem `lang="pt-PT"` na frase dos ministérios, incluindo a edição inglesa.\n';
out+='- Achados 20 e 21, parte incluída: os códigos, os registos das plantas e o manifesto das capturas estão em `segunda-correcao/`; `medicoes.json` e este relatório são escritos por `medir.mjs`, a partir da construção e das provas. As imagens ficam fora do repositório.\n\n';
out+='### As células lidas pelo motor\n\n| Linha | Célula | Valor | Formato | Cabeçalho do ano | Forma da célula | Forma do PDF |\n| --- | --- | --- | --- | --- | --- | --- |\n';
for(const c of celulas)out+=`| ${c.id} | ${c.folha}!${c.celula} | ${c.valor} | ${c.number_format} | ${c.cabecalho_periodo} | ${c.forma_celula} | ${c.impresso} |\n`;
out+='\nComandos: `python3 -m publisher.ex3 --site <worktree>`; `python3 -m publisher.export_site_rows --manifest publisher/manifest.ex3.json --site <worktree> --write`; `node design/especime-v3/medicoes/ex3-2026-10-15/compor.mjs`. A extração de 2024 lê o ano sem sufixo, por isso não o classifica como estimativa. As páginas do PDF indicadas na tabela foram renderizadas por `pdftoppm` e inspecionadas nesta passagem; a linha de Portugal confirma as formas do Excel e o agrupamento dos euros no PDF. A definição já continha as três frases na cópia alojada; não foi necessário outro pedido HTTP.\n\n### As frases construídas\n\n';
for(const lang of ['pt','en']){out+=`#### ${lang.toUpperCase()}\n\n`;for(const [k,v] of Object.entries(frases[lang].textos))out+=`${k}: ${v}\n\n`;}
out+='A primeira corrida desta passagem recusou o inventário das contagens do livro, que ainda tinha o total anterior, e uma indexação sem tipo no novo token de origem. As contagens foram relidas do HTML, o inventário e o registo foram atualizados e a indexação ficou restrita à chave autorizada. A vírgula depois do montante das Finanças foi reposta nas duas edições, tal como no mandato. As páginas foram reconstruídas e os portões repetidos.\n\n';
out+='### As provas e as cabeças\n\n';
out+=`Cabeça da construção, dos portões e das capturas: \`${m.cabeca}\`. Motor: \`${m.motor}\`.\n\n| Conferência | Código lido |\n| --- | --- |\n`;
for(const [k,v] of Object.entries(codigos))out+=`| ${k} | ${v} |\n`;
out+=`\nCapturas: ${m.capturas.resultados} páginas, larguras ${m.capturas.larguras.join(', ')} px, ${manifest.falhas.length} falhas. Pasta: \`${m.capturas.pasta}\`. Os resumos de todas as imagens e recortes foram conferidos. `;
out+=m.inspecaoVisual?'P1, P2, a abertura e a frase dos ministérios foram inspecionados nas duas edições a 390 e 1280 px.\n':'Inspeção visual: por executar.\n';
out+=`\nO código do motor foi lido de \`<temporario>/${path.basename(portasMotor)}/motor.codigo\`, com a cabeça conferida contra \`motor.cabeca\`. O registo do lançador foi preservado em \`<temporario>/ex3-segunda-lancador/\`, fora da worktree e dos commits.\n`;
out+='\nA corrida depois do commit do relatório fica em `<temporario>/ex3-segunda-portoes-final/`, com as cabeças e os códigos próprios; não altera o conteúdo. As capturas finais ficam em `<temporario>/ex3-segunda-capturas-final/`.\n';
out+='\n### O que fica para a higiene\n\nOs achados 10, 12, 14, 16, 17 e 19, e as partes dos achados 11 e 20 que não cabem nesta correção, ficam para a higiene como o mandato determina. Não foram corrigidos nesta passagem. A leitura curta do diff pelo Opus e a aterragem pertencem ao lugar de direção.\n\n';
out+=`Estado: ${Object.values(codigos).every(x=>x==='0')&&!manifest.falhas.length&&m.inspecaoVisual?'concluído no âmbito do construtor, sujeito à leitura curta do diff':'em verificação, não concluído'}.\n\ntokens used: não disponível\n`;
const relatorio=path.join(aqui,'RELATORIO.md'),anterior=read(relatorio).split('\n\n## A segunda passagem de correção de 19.10.2026')[0];
fs.writeFileSync(relatorio,anterior.trimEnd()+out);
console.log('EX3: relatório e medições escritos dos códigos, células, HTML e capturas. '+JSON.stringify(codigos));
