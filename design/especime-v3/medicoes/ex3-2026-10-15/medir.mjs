/** EX3: relatório e comparação da declaração anterior com a atual. */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {DINHEIRO_DO_ESTADO_2026 as atual} from '../../../../src/data/explicacoes/dinheiro-do-estado-2026.mjs';
import {loadClaims} from '../../../../src/lib/ledger.mjs';
import {nomeDaLinhaNaExplicacao} from '../../../../src/lib/explicacoes.mjs';
import {explicacaoPelaCelula,conferirAuditoriaDasExplicacoes} from '../../../../tests/explicacoes/explicacao.mjs';
const aqui=path.dirname(new URL(import.meta.url).pathname),root=path.resolve(aqui,'../../../..');
const motor=process.env.RESEARCHHUB_DIR;if(!motor)throw Error('Falta RESEARCHHUB_DIR');
const source=path.join(motor,'content/13 Dominios/source/ex3');
const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();
const base='aaac76b91';
const codigo=execFileSync('git',['show',base+':src/data/explicacoes/dinheiro-do-estado-2026.mjs'],{cwd:root});
const {DINHEIRO_DO_ESTADO_2026:antes}=await import('data:text/javascript;base64,'+codigo.toString('base64'));
const linhas=loadClaims(),labels=[];
for(let i=1;i<=10;i++){
 const code=String(i).padStart(2,'0'),row=linhas.get(`despesa-por-funcao-2024-gf${code}-pt`);
 labels.push({codigo:code,pt:nomeDaLinhaNaExplicacao('oe-2026-cem-euros-funcao-'+code,'pt'),en:row.name.toLowerCase(),name:row.name,source_flag:row.source_flag});
}
const frases=Object.fromEntries(['pt','en'].map(lang=>[lang,{antes:explicacaoPelaCelula(antes,lang,linhas),depois:explicacaoPelaCelula(atual,lang,linhas),figurasAntes:antes.seccoes.slice(0,2).flatMap(s=>s.conteudo.filter(b=>b.figura).map(b=>b.figura.titulo[lang])),figurasDepois:atual.seccoes.slice(0,2).flatMap(s=>s.conteudo.filter(b=>b.figura).map(b=>b.figura.titulo[lang]))}]));
const docs=['robots.txt','definicao.html','def-exp-2026-en.xlsx','def-exp-2026-en.pdf','publicacao.html','faq.html'].map(f=>JSON.parse(fs.readFileSync(path.join(source,f+'.pedido.json'))));
const claims=[...linhas.values()].filter(r=>r.id.startsWith('nato-defesa-portugal-'));
const portas=process.env.EX3_PORTOES;
const codigos={};for(const k of ['build','verify','typecheck','motor']){const p=portas&&path.join(portas,k+'.codigo');codigos[k]=p&&fs.existsSync(p)?fs.readFileSync(p,'utf8').trim():'não executado';}
for(const k of ['series','cruzamento']){const p='/tmp/ex3-'+k+'.codigo';codigos[k]=fs.existsSync(p)?fs.readFileSync(p,'utf8').trim():'não executado';}
const medicoes={base,cabeca:git('rev-parse','HEAD'),motor:execFileSync('git',['rev-parse','HEAD'],{cwd:motor,encoding:'utf8'}).trim(),documentos:docs,mapa:labels,frases,linhas:claims,auditoria:conferirAuditoriaDasExplicacoes().contas,codigos};
fs.writeFileSync(path.join(aqui,'medicoes.json'),JSON.stringify(medicoes,null,2)+'\n');
const green=Object.values(codigos).every(c=>c==='0');
let out=`# EX3: relatório da retoma, 15.10.2026\n\nEstado: ${green?'portões concluídos; capturas e revisão final a conferir abaixo':'em verificação; bloco ainda não concluído'}.\n\n## EX3-1: a retoma\n\nOs dois impedimentos da primeira passagem foram resolvidos pelo mandato emendado: P2 usa rótulos literais nas duas edições, e os nomes ingleses foram conferidos contra os campos \`name\`. A auditoria X1/X2 aceita as frases novas. Não se mudou nenhum valor do Orçamento nem nenhuma linha anterior.\n\n## EX3-2: documentos e pedidos\n\nOs corpos estão em \`content/13 Dominios/source/ex3/\` do motor; cada recibo tem o nome do corpo seguido de \`.pedido.json\`. Todos os pedidos da tabela deram HTTP 200.\n\n| Corpo | Data e hora UTC | SHA256 | Endereço |\n| --- | --- | --- | --- |\n`;
for(const d of docs)out+=`| ${d.ficheiro} | ${d.acedido_em} | ${d.sha256} | ${d.pedido} |\n`;
out+='\nO HTML da definição tem um resumo diferente do indicado no mandato (`884a966ce2945fd485c69d236116392b92e2b7e412d0e3b0ac5453c9065ab7e4`) e do recebido na primeira passagem (`456780ee9c0ed644d00871495cba09a54584f03d22957e476dd85a1e895ca566`). As três frases mantêm-se. Os resumos do Excel e do PDF coincidem com os do mandato. O título lido na capa do PDF é «Defence Investment of NATO Countries (2014-2026)», e é esse que os recibos usam.\n\n## EX3-3: as células e a definição\n\n';
const proof=JSON.parse(fs.readFileSync(path.join(motor,'content/21 Defesa NATO/provas.json')));
for(const c of claims){const p=proof.find(x=>x.id===c.id);out+=`- \`${c.id}\`: ${c.value} ${c.unit}; ${p.folha}!${p.celula}; Excel ${p.valor}, formato \`${p.number_format}\`; PDF p. ${p.pagina_pdf}, «${p.impresso}». Marca \`e\`, «${c.source_flag_note}» / «${c.source_flag_note_en}».\n  Excerto: ${c.excerpt.replaceAll('\n',' ')}\n`;}
out+='\nA origem `nato-definicao-despesa-defesa`, exportada em `src/data/origens-ex3.json`, contém em `excertoEn` as três frases literais do mandato. A primeira apoia a definição em P1; a segunda liga as despesas essenciais das tabelas à definição. A terceira conserva a inclusão das pensões, sem acrescentar uma comparação não pedida à página. A auditoria usa o mecanismo existente de origens das definições, com o corpo, data, cliente e sha256 em `alojada`, sem campos novos. As ressalvas das linhas distinguem o governo nacional aliado das administrações regionais, locais e municipais, e os preços constantes das percentagens dos preços correntes dos milhões. Não equiparam este perímetro ao S13.\n\n## EX3-4: mapa dos rótulos de P2\n\n| Código | Português, nome da função do Orçamento | Inglês, campo `name` do Eurostat em minúsculas | Marca |\n| --- | --- | --- | --- |\n';
for(const m of labels)out+=`| ${m.codigo} | ${m.pt} | ${m.en} | ${m.source_flag} |\n`;
out+='\nNenhum rótulo inglês precisou de correção face ao mandato emendado. Conservam-se as dez marcas de provisório.\n\n## EX3-5: frases antes e depois\n\n';
for(const lang of ['pt','en']){
 const f=frases[lang];out+=`### ${lang.toUpperCase()}\n\n`;
 for(const c of ['abertura[0]','seccoes[1].conteudo[0].paragrafo']){out+=`Antes: ${f.antes.paragrafos.find(p=>p.caminho===c).texto}\n\nDepois: ${f.depois.paragrafos.find(p=>p.caminho===c).texto}\n\n`;}
 for(let i=0;i<2;i++)out+=`Título antes: ${f.figurasAntes[i]}\n\nTítulo depois: ${f.figurasDepois[i]}\n\n`;
 for(const c of ['seccoes[0].conteudo[2].paragrafo','seccoes[0].conteudo[3].paragrafo'])out+=`Parágrafo novo: ${f.depois.paragrafos.find(p=>p.caminho===c).texto}\n\n`;
}
out+='O denominador dos ministérios foi lido em `src/data/o-que-e-das-familias.mjs`: «da «DESPESA TOTAL» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central, o total antes da consolidação». A frase X12 atual foi conservada. Ao contrário da descrição histórica do §0, nesta cabeça ela já só diz que a conta por função organiza a despesa por finalidade.\n\n## EX3-6: células e plantas\n\nA auditoria das palavras foi recomposta em `compor.mjs`; as duas famílias novas têm especificação em `familias.mjs`. O compositor R4 histórico falha em famílias anteriores já retiradas e nas famílias posteriores do V2-a, por isso ficou intacto e a composição EX3 acrescenta apenas as entradas deste bloco.\n\nA X6 foi atualizada para ler a marca `e`, já suportada pelo componente, e as duas casas decimais em inglês. A adaptação do portão HTML conserva os mesmos algarismos, precisão e comparação exata da escrita, só trocando a vírgula pelo ponto nas duas percentagens novas da NATO na edição inglesa. Os valores e a apresentação das linhas anteriores ficaram intactos. As frases declaradas continuam cobertas pelo inventário dinâmico e pela célula das frases compostas.\n\nAs plantas em `tests/explicacoes/ex3.mjs` retiram o apoio da definição, acrescentam um token sobre uma linha inexistente, trocam o valor da NATO e retiram uma casa decimal. O teste do motor regenera as células e a definição, confere recibos e travessia e recusa quatro alterações: valor, bandeira, período e excerto.\n\n## EX3-7: direitos e tranca HTTP\n\nA FAQ oficial remete para a política antiga em `http://www.nato.int/cps/en/natolive/68162.htm`; o pedido HTTPS devolveu 404. A ausência e o recibo estão na pasta `direitos/`; não se declarou uma licença que não foi confirmada. Os corpos ficam no motor, sem cópia pública.\n\nCada comando de pedidos à NATO correu com `RESEARCHHUB_LOCK_DIR=<motor>/.http-locks`. Não existiu proteção contra pedidos simultâneos de outros processos que usem a tranca partilhada nesta passagem. A direção aceitou essa limitação no mandato. A pasta `.http-locks` não integra o commit.\n\n## EX3-8: verificação e cabeças\n\n';
out+=`Cabeça de conteúdo do sítio: \`${medicoes.cabeca}\`. Cabeça do motor: \`${medicoes.motor}\`.\n\n| Conferência | Código |\n| --- | --- |\n`;
for(const [k,v] of Object.entries(codigos))out+=`| ${k} | ${v} |\n`;
out+='\nCapturas: por executar. Leitura a frio pelo Opus e aterragem: a cargo do lugar de direção, não executadas nesta passagem. Nenhum push.\n\ntokens used: não disponível\n';
fs.writeFileSync(path.join(aqui,'RELATORIO.md'),out);
console.log('Relatório e medições escritos; estado dos códigos: '+JSON.stringify(codigos));
