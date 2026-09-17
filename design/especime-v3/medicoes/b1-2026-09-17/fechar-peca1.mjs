/** Fecha o relatório só depois de ler os códigos e conferir os artefactos. */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { WORKS } from '../../../../src/data/studies.mjs';
const dir = 'design/especime-v3/medicoes/b1-2026-09-17';
const read = f => fs.readFileSync(path.join(dir, f), 'utf8');
const json = f => JSON.parse(read(f));
const sha = b => createHash('sha256').update(b).digest('hex');
const git = (...args) => execFileSync('git', args, {encoding:'utf8'}).trim();
const codigos = Object.fromEntries(['build','verify','typecheck'].map(k => [k, Number(read(`${k}-final.codigo`).trim())]));
if (Object.values(codigos).some(n => n !== 0)) throw new Error('Os três portões ainda não estão a zero.');
for (const f of ['provar-peca1.codigo', 'captar-depois.codigo', 'navegar-peca1.codigo']) if (Number(read(f).trim()) !== 0) throw new Error('Verificação por acabar: '+f);
const plantas = json('plantas-peca1.json');
if (plantas.length !== 16 || plantas.some(p => !p.bateu || p.antes !== p.reposto)) throw new Error('Plantas incompletas.');
const h3 = json('planta-h3-titulo-retirado.json');
if (!h3.antes || h3.planta || !h3.reposto) throw new Error('H3 incompleto.');
const capturas = ['antes','depois'].flatMap(tipo => json(`capturas-${tipo}-peca1.json`).resultados.map(r => ({tipo,...r})));
if (capturas.length !== 40) throw new Error('Não há quarenta capturas.');
for (const c of capturas) {
  const f = path.join('design/especime-v3/capturas/b1-2026-09-17', c.ficheiro);
  if (c.deslocamento !== 0 || sha(fs.readFileSync(f)) !== c.sha256) throw new Error(`Captura alterada: ${f}`);
}
const cabeca = git('rev-parse','HEAD');
if (JSON.parse(fs.readFileSync('dist/version.json','utf8')).commit !== cabeca) throw new Error('Construção de outra cabeça.');
if (json('capturas-depois-peca1.json').cabeca !== cabeca) throw new Error('Capturas de outra cabeça.');
const base = '2bf8b238b912fcb89da74096281305c75f0a3b3c';
const protegidos = ['studies-src','registos','ledger','src/views/HomeView.astro','src/views/MunicipioView.astro','src/views/AreaView.astro'];
const alterados = git('diff','--name-only',base,'--',...protegidos);
if (alterados) throw new Error(`Mudanças fora da peça: ${alterados}`);
if (git('diff','--name-only') || git('diff','--cached','--name-only')) throw new Error('Há alterações de fontes por confirmar.');
const commits = git('log','--reverse','--format=%h|%s',`${base}..HEAD`).split('\n').map(l => l.split('|'));
const corpos = git('log','--format=%B',`${base}..HEAD`);
for (const trailer of ['Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>','Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub']) {
  if (corpos.split(trailer).length-1 !== commits.length) throw new Error(`Falta trailer: ${trailer}`);
}
const fim = process.argv[2];
if (!fim || !Number.isFinite(Date.parse(fim))) throw new Error('Dar a hora UTC lida do relógio.');
const tempo = json('tempo-peca1.json');
const inicio = json('inicio-segunda-retoma-peca1.json').inicio_utc;
const duracao = s => `${Math.floor(s/60)} min ${s%60} s`;
const segundos = Math.round((Date.parse(fim)-Date.parse(inicio))/1000);
const corridas = [...tempo.corridas.slice(0,2), {inicioUTC:inicio,fimUTC:fim,segundos,duracao:duracao(segundos)}];
const soma = corridas.reduce((n,c) => n+c.segundos,0);
fs.writeFileSync(path.join(dir,'tempo-peca1.json'),JSON.stringify({corridas,segundos:soma,duracao:duracao(soma),criterio:'Soma dos tempos medidos nas três corridas, sem os intervalos entre elas.'},null,2)+'\n');
fs.writeFileSync(path.join(dir,'portoes-peca1.txt'),`Cabeça: ${cabeca}\nRamo: ${git('branch','--show-current')}\n\n${Object.entries(codigos).map(([k,v]) => `npm run ${k}\nCódigo: ${v}\nRegisto: ${k}-peca1.log\n`).join('\n')}`);
const tabela = (cab,linhas) => `| ${cab.join(' | ')} |\n|${cab.map(()=>'---').join('|')}|\n${linhas.map(l => '| '+l.join(' | ')+' |').join('\n')}`;
const prova = n => `[planta](planta-${n}.txt)`;
const celulas = [
['check-lugar.mjs:1525, 1913','Frase das portas, caixa e filas de edições; cobertura da coleção','A frase e a caixa saem. Ficam 26 páginas, 10 corpos, 26 portas de edição, duas listas e 12 linhas do país; todos os 13 estudos têm acesso pelo país ou lugar.',prova('pagina-em-falta')+'; '+prova('estudo-sem-acesso')],
['check-lugar.mjs:1550, 1584','O título da lista abre a leitura real','O destino passa de texto a estudo; título único e ficheiro existente continuam exigidos.',prova('pagina-em-falta')],
['gate-html.mjs:4060, 6043','Igualdade do corpo com o registo fixado, número e destino de cada figura','A chamada e a autorização das marcas passam para a rota estudo com registo. L1 a L4 mantêm a conferência integral.',prova('algarismo-na-rota-nova')],
['check-cadeia.mjs:350','C5, texto impresso e cadeia de cada figura','Só muda a rota da leitura; a cadeia continua completa.',prova('cadeia-na-rota-nova')],
['check-datas.mjs:138, 299','Cada data pertence à edição correta','Sai a dependência de caixas e badges. slug, língua, porta e uma data são conferidos em data-estudo-edicao; datas órfãs continuam proibidas.',prova('data-da-edicao')+'; '+prova('data-da-lista')],
['gate-html.mjs:2362, 2378','L5: contagens do manifesto e faixa de contagens impressas','Retirada a célula que exigia as três contagens visíveis e a porta da faixa. Conservadas as contas internas de blocos e figuras; cada algarismo continua conferido. O regresso da faixa é recusado.',prova('algarismo-na-rota-nova')+'; '+prova('faixa-regressa')],
['gate-html.mjs:2130','L6: uma linha por origem, campos exatos e acesso a cada figura','Mantidos id, ordem, valores, impresso, origem e portas. O rótulo é Fontes e verificação; a conferência corre na nova rota.',prova('l6-origem-trocada')],
['gate-html.mjs:4884','Divulgação de IA no topo e no rodapé','Sai a duplicação no topo. O rótulo único no rodapé conserva texto aprovado, visibilidade e ligação à política.',prova('rotulo-ia-retirado')],
['gate-html.mjs:1241','Porta da leitura na moldura da edição fixada','Destino atualizado para o estudo da mesma língua e slug. A porta única conserva data-oedp-voltar e data-oedp-texto quando há registo; bytes da edição intactos.',prova('documento-porta-trocada')],
['gate-html.mjs:4041, 7013','Rotas antigas e destino correto','Célula nova: redirecionamento exato, ligação e canonical coerentes, destino existente e todos os dez endereços conservados. Só depois deixa de exigir mobília de página.',prova('redirecionamento-trocado')],
['check-lugar.mjs:952; medir-defeitos.mjs:1025; check-datas.mjs:138','Mobiliário, frases e datas nas páginas de leitura antigas','Os redirecionamentos deixam de contar como páginas de conteúdo; a nova página continua em todas as conferências e as rotas antigas são verificadas por gate:html.',prova('redirecionamento-trocado')+'; '+prova('pagina-em-falta')],
['tests/acessibilidade/alvos.mjs:1024, 1574; tests/acessibilidade/cabeca-b1.mjs:3','H3: um título principal por página','Mantida para todas as páginas de conteúdo. A exceção exige rota antiga, destino exato e uma única ligação de redirecionamento. O diagnóstico nomeia essa exceção, em vez de afirmar que os redirecionamentos têm um título.', '[planta H3](planta-h3-titulo-retirado.json); '+prova('redirecionamento-trocado')],
['check-lugar.mjs:200, 977','L1: portas duplicadas da casa','As ligações dentro de unidades transcritas deixam de ser tomadas por mobília da casa. O teto desce de 2286 para 2271 páginas, sem alargamento.',prova('segunda-porta')],
['check-lugar.mjs:541, 1007','Origem dos marcadores e títulos citados','Unidades do registo e títulos do índice são citações conferidas pelo corpo e por L8; a prosa acrescentada pela casa continua sujeita à voz.',prova('algarismo-na-rota-nova')+'; '+prova('l8-indice-trocado')+'; '+prova('frase-fora-da-lista')],
['voz-palavras.mjs:215, 224; tests/voz/palavras-proibidas.mjs:187','Palavras proibidas na prosa da casa, com exceção da citação','A exceção segue a rota nova e as unidades/artigos transcritos. O contentor inteiro deixa de ser dispensado. A planta existente procura um estudo com registo e distingue prosa exterior de citação.', '[check:palavras na verificação completa](verify-peca1.log); '+prova('frase-fora-da-lista')],
['check-voz.mjs:106; voz-b1.mjs:23, 46','Tema válido e vocabulário próprio das duas famílias','Célula nova percorre as 28 superfícies. Só admite lista fechada, dados e transcrição conferida; valida unidades contra o livro. Confere a abertura da água contra o documento fixado.',prova('tema-em-falta')+'; '+prova('frase-fora-da-lista')],
['gate-html.mjs:3386; src/lib/prova.mjs:766','Números de estudos junto dos lugares','Novas contagens declaradas a partir de WORKS e recontadas pelo portão nas portas efetivas da página de cada lugar.',prova('contagem-do-lugar')],
['check-lugar.mjs, antigo:466; INVENTARIO-FRASES.md; VOZ-MARCADORES.md','Proibição dos rótulos antigos e classificação da voz','Sai a lista local de quatro rótulos da forma anterior; a lista fechada protege agora toda a superfície. Retiradas inventariadas, rótulos novos confinados ao estudo e à lista.',prova('frase-fora-da-lista')],
];
const saidas = json('cadeias-retiradas-peca1.json');
const grupos = new Map();
for(const s of saidas) { const k=s.familia+'|'+s.razao; grupos.set(k,(grupos.get(k)??0)+1); }
const quadrosCapturas = ['antes','depois'].map(tipo => `**${tipo === 'antes' ? 'Antes' : 'Depois'}**\n\n`+tabela(['Largura','Estudo PT','Estudo EN','Lista PT','Lista EN'],[390,768,1024,1280,1600].map(l => [l,...[['estudo','pt'],['estudo','en'],['estudos','pt'],['estudos','en']].map(([f,lang]) => `[PNG](../../capturas/b1-2026-09-17/${tipo}-${f}-${lang}-${l}.png)`)]))).join('\n\n');
const texto = `${tabela(['Ponto do §1','Medida','Resultado'],[
['Página do estudo, item 4','Fusão, corpo na rota principal e redirecionamentos','Feito: 26 superfícies, dez corpos fixados e dez endereços antigos conservados.'],
['Lista dos estudos, item 5','País por data, seguido de Por lugar','Feito: seis estudos do país; Évora com seis e Alentejo com um. Os treze continuam acessíveis.'],
['Temas, item 7c','Treze temas da maqueta e planta','Feito: temas declarados; tema em falta faz check:voz falhar.'],
['Frases, parte do item 8','Lista fechada, planta e inventário das retiradas','Feito: 28 superfícies conferidas e 84 cadeias retiradas, com razão.'],
])}

A primeira peça está acabada nesta worktree. A página com registo tem, por ordem, título, índice «Nesta página» fechado, leitura quando existe no registo, texto, «Fontes e verificação» e «Edição tal como foi publicada · publicado a &lt;data&gt;». A descrição dos estudos sem registo e a edição fixada permanecem acessíveis. A navegação global pertence às peças seguintes do B1.

A ordem, as dobras fechadas, as portas dos números e os dez redirecionamentos foram exercidos no navegador: [18 verificações](navegacao-peca1.json). Os redirecionamentos da construção estática usam meta refresh para a rota canónica; o navegador confirmou a chegada ao corpo. Não há PDF entre as 18 edições HTML fixadas, e o rótulo não inventa um formato.

A adição à página do Alentejo limita-se à secção de estudos necessária à porta «Por lugar». As páginas do país, do concelho e de área permanecem iguais à cabeça inicial. O corpo dos estudos, o livro-razão, os registos e as edições em studies-src não foram reescritos. [Conferência de integridade](integridade-peca1.json). O título antigo de Évora 2027 continua a ser o do registo fixado; a sua revisão pertence ao B4.

**Células alteradas ou retiradas**

Os nomes dos portões abaixo partem de scripts/, salvo os caminhos explícitos em src/ e tests/ e os inventários em design/especime-v3/. As linhas são as da cabeça final, salvo a indicação «antigo». Nenhuma proteção de número, fonte, pessoa, data da edição ou igualdade do corpo foi retirada. As mudanças de forma são entregues ao lugar de direção para releitura antes de aterrar.

${tabela(['Código','O que protegia','O que ficou','Prova que falha'],celulas)}

L8, em \`scripts/gate-html.mjs:2208\`, ficou intacta, incluindo texto, ordem, destinos e posições. [Comparação SHA-256](l8-intacta-peca1.json). A [entrada do índice trocada](planta-l8-indice-trocado.txt) continua a falhar. O índice está fechado por omissão e colocado imediatamente depois do título.

[As 16 plantas de ficheiro](plantas-peca1.json) deram código diferente de zero com a falha esperada; cada ficheiro foi reposto no seu SHA-256 inicial. A planta H3 retirou o título em memória e foi recusada. As cinco referências limpas e as cinco conferências depois da reposição deram zero. [Corrida das plantas](provar-peca1.log), [reprodutor](provar-peca1.mjs). A verificação completa inclui ainda as plantas existentes de CSS, código morto, palavras, cartões e guardas.

**Cadeias retiradas**

${tabela(['Família','Razão','Cadeias'],[...grupos].map(([k,n]) => [...k.split('|'),n]))}

Total: **84**. A tabela integral, com cada cadeia e a sua razão, está em [REVISOES-DO-INVENTARIO.md](../../critica/REVISOES-DO-INVENTARIO.md#b1-primeira-peça-17092026) e em [JSON](cadeias-retiradas-peca1.json). «[a verificar]» e a definição isolada do marcador português saem destas capas, mas não são proibidos globalmente: continuam a integrar dados incompletos e formulações legítimas noutros lugares. O inventário foi corrigido sem alterar o portão para permitir esse caso.

A [lista fechada](../../../../src/data/rotulos-b1.mjs) contém os rótulos das duas línguas; títulos, lugares, temas, descrições e leituras vêm dos dados. As dispensas de números, datas, índice e transcrições dependem dos portões que os conferem. Nenhum contentor completo do estudo fica dispensado da leitura da voz.

**Temas e abertura transcrita**

${tabela(['Estudo','Tema'],WORKS.map(w => [w.slug,w.tema]))}

A tabela segue \`design/especime-v3/maquetas/b1/fazer.py\`, intacto. [Comparação das treze correspondências](temas-aplicados-peca1.json). \`SUBJECTS\` contém apenas lugares. A [planta do tema em falta](planta-tema-em-falta.txt) corre pelo comando público \`npm run check:voz\`; a [frase acrescentada fora da lista](planta-frase-fora-da-lista.txt) falha no mesmo comando.

«Onde está a água?» usa a primeira frase de \`p.standfirst\` do documento fixado, sem frase nova:

- PT, [fonte, linha 215](../../../../studies-src/onde-esta-a-agua/pt.html#L215): «A água de Portugal: onde está, de onde vem e o que a autonomia exigiria de facto.»
- EN, [fonte, linha 209](../../../../studies-src/onde-esta-a-agua/en.html#L209): «Portugal's water, where it is, where it comes from, and what autonomy would actually take.»

O \`check:voz\` compara a frase com a fonte, com \`VERBATIM\` e com a descrição em \`WORKS\`. Os símbolos de percentagem dos resumos vêm da unidade do livro-razão e são conferidos contra ela.

**Commits e portões**

Ramo \`b1-2026-09-17\`. Cabeça inicial \`${base}\`; cabeça final conferida \`${cabeca}\`.

${tabela(['Commit','Mudança'],commits)}

Os ${commits.length} commits foram feitos por caminhos explícitos e todos têm os dois trailers pedidos:

\`\`\`text
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub
\`\`\`

${tabela(['Comando','Código na cabeça final','Registo'],Object.entries(codigos).map(([k,v]) => ['npm run '+k,v,`[log](${k}-peca1.log)`]))}

[Códigos lidos dos ficheiros](portoes-peca1.txt). A conferência da cadeia mantém dez registos, 1038 blocos e 2976 figuras. A das datas mantém as 18 edições e prende 38 ocorrências em 28 páginas. A forma nova não reduz a coleção para obter um verde.

A implementação está confirmada em Git. Este relatório, medições, plantas e capturas ficam como artefactos locais da peça nas duas pastas indicadas, fora dos commits de código. Não houve push, mudança da árvore principal ou alteração de fontes fora desta worktree. Não foi feita nem alegada uma leitura independente; a releitura das células pelo lugar de direção antecede a integração.

**Capturas**

Vinte «antes» preservadas por SHA-256 e vinte «depois», todas com zero deslocamento lateral. [Medições antes](capturas-antes-peca1.json), [medições depois](capturas-depois-peca1.json). As capturas de janela adicionais a 390 e 1280 ajudaram a conferir título, índice, leitura e disposição da lista; as quarenta abaixo são de página inteira.

${quadrosCapturas}

**Tempo e fecho**

${tabela(['Corrida','Início UTC','Fim UTC','Tempo de parede'],corridas.map((c,i) => [['Primeira','Primeira retoma','Segunda retoma'][i],c.inicioUTC,c.fimUTC,c.duracao]))}

Soma: **${duracao(soma)}**, sem os intervalos. [Registo do tempo](tempo-peca1.json). Os relatórios das paragens anteriores ficam preservados: [primeira corrida](LEIA-ME-peca1-primeira-corrida.md), [primeira retoma](LEIA-ME-primeira-retoma.md). Os verdes e as plantas deste relatório são da implementação concluída, não os da referência anterior.

Não fica trabalho de construção pendente nesta primeira peça. A releitura do lugar de direção e a integração do ramo são os passos seguintes; não foram executados nesta worktree.
`;
if (/[\u2013\u2014]/.test(texto)) throw new Error('Travessão na prosa do relatório.');
fs.writeFileSync(path.join(dir,'LEIA-ME-peca1.md'),texto);
console.log(`Relatório fechado em ${cabeca}; ${codigos.build}/${codigos.verify}/${codigos.typecheck}; 40 capturas conferidas.`);
