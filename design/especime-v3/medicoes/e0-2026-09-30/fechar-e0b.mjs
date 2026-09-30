/** E0b: acrescenta o estado real do mandato, sem transformar uma paragem em aceitação. */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { load } from 'js-yaml';
import { lerCodigoDaCorrida } from './detetores-e0b.mjs';
const pasta = 'design/especime-v3/medicoes/e0-2026-09-30';
const base = '728ffc67a702e4912f4919b8a8b356e28a66ea63';
const json = p => JSON.parse(fs.readFileSync(`${pasta}/${p}`, 'utf8'));
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
execFileSync('node', [`${pasta}/fechar-e0.mjs`]);
const medidas = json('medidas.json');
const detetores = json('detetores-e0b.json');
const anteriores = json('estado-anterior.json');
const e1 = json('prova-e1.json');
const fontes = json('fontes-e0b.json');
const custo = json('custo.json');
const custoOriginal = json('custo-e0-original.json');
const finalE0 = json('custo-final-e0.json');
const capturas = json('capturas-e0.json');
const primeiraPasta = `${pasta}/ensaios/e0b-primeira-corrida`;
const primeira = fs.existsSync(`${primeiraPasta}/cabeca`) ? {
  cabeca: fs.readFileSync(`${primeiraPasta}/cabeca`, 'utf8').trim(),
  codigos: Object.fromEntries(['build', 'verify', 'typecheck'].map(n => [n, Number(fs.readFileSync(`${primeiraPasta}/${n}.codigo`, 'utf8'))]))
} : null;
const interrompidaPasta = `${pasta}/ensaios/e0b-corrida-interrompida`;
const interrompida = fs.existsSync(`${interrompidaPasta}/estado.json`)
  ? JSON.parse(fs.readFileSync(`${interrompidaPasta}/estado.json`, 'utf8')) : null;
const contador = load(fs.readFileSync('ledger/claims/correcoes-publicadas.yml', 'utf8'));
const commits = execFileSync('git', ['log', '--reverse', '--format=%h|%s', `${base}..HEAD`], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const valor = n => medidas.medidas.find(m => m.nome === n)?.valor;
const finais = medidas.e0b?.restantes_conferidos === true && medidas.cabeca === cabeca;
const nomes = medidas.e0b?.nomes_do_registo ?? [];
const portas = ['build', 'verify', 'typecheck'].map(nome => {
  const f = `${pasta}/portoes/e0b/${nome}.json`;
  const pendente = { nome, codigo: null, cabeca: null, segundos: null };
  if (!fs.existsSync(f)) return pendente;
  const r = JSON.parse(fs.readFileSync(f, 'utf8'));
  const cabecaCorrida = fs.readFileSync(`${pasta}/portoes/e0b/cabeca`, 'utf8').trim();
  const inicio = fs.statSync(`${pasta}/portoes/e0b/${nome}.inicio`).mtimeMs;
  const fim = fs.statSync(`${pasta}/portoes/e0b/${nome}.fim`).mtimeMs;
  const lido = lerCodigoDaCorrida(`${pasta}/portoes/e0b/${nome}.codigo`, inicio, fim);
  return r.cabeca === cabeca && cabecaCorrida === cabeca && r.cabeca_fim === cabeca
    && r.medido_nesta_corrida && !r.codigo_por_registar && lido.medido && lido.codigo === r.codigo
    ? { nome, ...r, codigo: lido.codigo } : pendente;
});
const estado = finais ? 'Os restantes pontos estão conferidos, com os três portões a zero na cabeça final.' : 'Os restantes pontos estão implementados; faltam os portões da cabeça final e as medidas do HTML renovado.';
const inteiro = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const decimal = n => String(n).replace('.', ',');
const dados = { passagem: 'E0b', base, cabeca, medido_em: new Date().toISOString(), completa: false,
  pontos_do_mandato: fs.readFileSync(`${pasta}/prompts/PROMPT-e0b-construtor.md`, 'utf8').match(/^\d+\./gm).length,
  ponto_1: fontes.estado, restantes_conferidos: finais, nomes_conferidos: nomes.length, plantas: valor('plantas_que_mordem')?.total ?? null,
  contador: { valor: contador.value, referencia: contador.reference_date, leitura: contador.access_date, edicao: contador.document.edition },
  provas: { estado_anterior: anteriores.executado_na_cabeca, e1: e1.cabeca ?? null, detetores: detetores.cabeca,
    medidas: medidas.cabeca, capturas: capturas.cabeca }, portoes: portas, custo: custo.e0b ?? null,
  custo_final_e0: finalE0.simbolos_finais, custo_amostra_e0: custoOriginal.construtor.simbolos_sem_cache_mais_saida };
dados.primeira_corrida = primeira;
dados.corrida_interrompida = interrompida;
fs.writeFileSync(`${pasta}/e0b.json`, JSON.stringify(dados, null, 2) + '\n');
const tabelaPortas = portas.map(p => `| \`npm run ${p.nome}\` | ${p.codigo === null ? 'Por correr' : `[${p.codigo}](portoes/e0b/${p.nome}.codigo)`} | ${p.cabeca ? `\`${p.cabeca}\`` : 'Por escrever'} | ${p.segundos === null ? 'Por medir' : decimal(p.segundos)} |`).join('\n');
const secao = `
## E0b

O ponto 1 do mandato está parado por fonte. ${estado} Cabeça desta passagem: \`${cabeca}\`; base: \`${base}\`.

### O mandato e o que se mediu

| # | Mandato | Resultado e prova |
| --- | --- | --- |
| 1 | Limiar do Procedimento no cartão | Parado. A página atual da Comissão lista a taxa com limiar de 10 %. O Eurostat lista a média de três anos entre os indicadores adicionais e publica a fórmula U(t)/LF(t). Não se alteraram o limiar, o veredicto, a ressalva nem a nota do cartão para afirmar o contrário. |
| 2 | Nomes e razões do registo | A declaração da contagem dá Correções publicadas e Published corrections. O componente também imprime os nomes lidos dos campos da fonte, conservando as marcas de campo e de língua. As razões das três entradas usam a fonte e as duas correções publicadas hoje. ${finais ? `A célula conferiu ${nomes.length} nomes de entradas nas duas edições.` : 'A conferência do HTML fica para os portões finais.'} |
| 3 | Positivos do medidor | Os três detetores foram exercitados na cabeça \`${detetores.cabeca}\`. Leem os dois campos excerpt; encontram RegistoCorrecoes no diff real e uma planta do cartão; leem códigos 0 e 1 de processos desta corrida e recusam os mesmos ficheiros envelhecidos. |
| 4 | Datas do contador | Valor ${contador.value}; reference_date e access_date em ${contador.reference_date}; edição ${contador.document.edition}. A nota explica a recontagem. A planta da data antiga exige a queixa E0b datas. |
| 5 | Relatório verificável | Cada prova tem a sua cabeça abaixo. Saiu a atribuição sobre o localizador externo. O alcance do typecheck está escrito acima. As capturas binárias e os dois contadores de custo do E0 estão distinguidos. |
| 6 | Tranca da máquina | Os portões inteiros usam scripts/leituras/portoes.sh, pela M46. A chamada usa a worktree corrente, sem procurar processos. |
| 7 | Portões, capturas e resposta | ${finais ? 'Portões a zero na cabeça final, lidos dos ficheiros da corrida.' : 'Portões finais por correr.'} O captor conserva as larguras e as duas edições. A resposta está em RESPOSTA-construtor-e0b.md. |

### A fonte que faz parar o ponto 1

A [Comissão](https://economy-finance.ec.europa.eu/economic-governance-framework/macroeconomic-imbalance-procedure/scoreboard_en) diz «${fontes.comissao.citacao}». A frase da média móvel de três anos, nessa página, pertence ao saldo da balança corrente. A secção 3.1 dos [metadados do Eurostat](https://ec.europa.eu/eurostat/cache/metadata/en/tipsun20_esms.htm) coloca a média de três anos na lista dos indicadores adicionais. A [fórmula atual do Eurostat](https://ec.europa.eu/eurostat/web/macroeconomic-imbalances-procedure/information-data) divide desempregados pela população ativa no mesmo período. Estas fontes foram lidas em ${fontes.lido_em}; os locais e as citações curtas estão em [fontes-e0b.json](fontes-e0b.json).

A alteração pedida para o cartão atribuía o limiar à média de três anos. Não se encontrou apoio para essa atribuição nas fontes atuais. Aplica-se a regra de paragem nesse ponto, e os outros pontos continuam. Falta uma decisão corrigida ou uma fonte específica do painel que sustente o período pedido. Nenhum dos cinco estragos do pacote foi tratado como defeito do ramo. Os achados do K2 ficaram no K2.

### Plantas e cabeças das provas

As plantas permanentes incluem agora a retirada do nome da recontagem, a retirada do nome da dívida das famílias e a data antiga do contador. ${finais ? `As ${valor('plantas_que_mordem').total} plantas morderam numa corrida que aceita o HTML limpo.` : 'A corrida do HTML limpo e das plantas fica por medir na cabeça final.'} Os detetores do medidor têm ainda plantas de decimal, de caminho de componente e de escrita antiga do código, em [detetores-e0b.json](detetores-e0b.json).

${primeira ? `A primeira corrida dos portões E0b, na cabeça \`${primeira.cabeca}\`, deu build ${primeira.codigos.build}, verify ${primeira.codigos.verify} e typecheck ${primeira.codigos.typecheck}. A guarda de campos do livro recusava o título da fonte fora das páginas do livro. A forma mudou por uma porta estreita: só name e document.title no nome da própria linha, dentro da sua entrada da página do registo. A comparação literal e a auditoria do selo continuam ativas. Uma planta no portão real tenta passar value por esta marca e é recusada; outras retiram o nome, trocam a linha e mudam a página. Os primeiros códigos e registos estão em ensaios/e0b-primeira-corrida.` : ''}

${interrompida ? `A corrida seguinte, na cabeça \`${interrompida.cabeca}\`, deu build ${interrompida.build}: a edição do contador faltava na tabela das línguas. A corrida foi interrompida depois desta falha; não há código de conclusão de verify nem de typecheck a atribuir-lhe. A data passou a estar declarada sem língua e a conferência de língua foi repetida. O estado e o código efetivamente escrito estão em ensaios/e0b-corrida-interrompida.` : ''}

| Prova | Cabeça lida do comprovativo |
| --- | --- |
| Estado anterior recomposto | \`${anteriores.executado_na_cabeca}\` |
| Atualização isolada para E1 | ${e1.cabeca ? `\`${e1.cabeca}\`` : 'Não registada no comprovativo antigo; por repetir'} |
| Detetores revistos | \`${detetores.cabeca}\` |
| Medidor e plantas | \`${medidas.cabeca}\` |
| Capturas | \`${capturas.cabeca}\` |

As 12 capturas PNG originais existem no ramo em design/especime-v3/capturas/e0-2026-09-30/. O pacote da leitura a frio omite-as por serem binárias. O captor volta a escrever o cartão e O que mudou nas duas edições, a 390 e a 1 280 px, e regista a cabeça construída no manifesto. Os comprovativos e as capturas renovados depois do commit final ficam na worktree, como no fecho do E0.

### Commits desta passagem

${commits.map(c => { const [h, texto] = c.split('|'); return `- \`${h}\`: ${texto}.`; }).join('\n')}

### Portões da E0b

Chamada: \`sh scripts/leituras/portoes.sh . design/especime-v3/medicoes/e0-2026-09-30/portoes/e0b\`. O guião guarda cabeca, cabeca.fim, início, fim e código de cada comando. O recolhedor recusa códigos cuja escrita não esteja entre os ficheiros de início e fim desta corrida. A duração tem a resolução de segundos do guião, não uma precisão inferida.

| Comando | Código lido | Cabeça | Segundos |
| --- | ---: | --- | ---: |
${tabelaPortas}

### Custo

O E0 acabou em ${inteiro(finalE0.simbolos_finais)} símbolos na linha tokens used, segundo o ponto 5 do mandato. A amostra conservada em [custo-e0-original.json](custo-e0-original.json) tinha ${inteiro(custoOriginal.construtor.simbolos_sem_cache_mais_saida)}; foi lida antes do fim. O terminal original não está no ramo, e o valor final é transcrito do mandato, com essa proveniência em [custo-final-e0.json](custo-final-e0.json).

${custo.e0b ? `Nesta passagem, o início foi lido da mensagem de retoma da sessão: ${custo.e0b.inicio}. A amostra de ${custo.medido_em} mede ${decimal(custo.e0b.segundos_decorridos)} segundos desde a retoma${custo.e0b.simbolos_desde_final_e0 === null ? '' : ` e ${inteiro(custo.e0b.simbolos_desde_final_e0)} símbolos desde o contador final E0`}.` : 'O contador da passagem ainda não tem o início da retoma identificado.'} Modelo lido do contexto da sessão: \`${custo.construtor.modelo}\`. É uma amostra antes do fecho, não uma linha final do terminal.

### O que fica por fazer

O ponto 1 continua parado por fonte. ${finais ? 'Os outros pontos desta passagem estão conferidos.' : 'Faltam os portões da cabeça final, as capturas renovadas e a medição do HTML.'} Falta a nova leitura a frio e a aterragem. Não houve publicação.
`;
fs.appendFileSync(`${pasta}/LEIA-ME.md`, secao);
fs.writeFileSync(`${pasta}/RESPOSTA-construtor-e0b.md`, `# E0b · Resposta do construtor\n\nO ponto 1 está parado: as fontes atuais não confirmam a média de três anos como medida do limiar pedido. ${estado}\n\nCabeça: \`${cabeca}\`. Commits: ${commits.map(c => `\`${c.split('|')[0]}\``).join(', ')}.\n\nCódigos lidos: ${portas.map(p => `${p.nome}: ${p.codigo ?? 'por correr'}`).join('; ')}. Relatório: [LEIA-ME.md](LEIA-ME.md), secção E0b.\n\nFalta resolver a contradição de fonte do ponto 1, a nova leitura a frio e a aterragem.\n`);
console.log(`E0b: relatório escrito na cabeça ${cabeca}; restantes conferidos: ${finais}; ponto 1 parado por fonte.`);
