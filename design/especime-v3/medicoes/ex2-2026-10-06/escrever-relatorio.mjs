/** O relatório inteiro é saída deste guião; medidas e decisões têm ficheiro de origem. */
import fs from 'node:fs';
import path from 'node:path';
const pasta=path.dirname(new URL(import.meta.url).pathname);
const le=f=>JSON.parse(fs.readFileSync(path.join(pasta,f),'utf8'));
const e=le('entrega-b.json'), b=le('base.json'), u=le('unidades.json'), w=le('semana-b.json'), fc=le('frases-compostas-b.json'), passagem=le('passagem-b.json'), pais=le('titulos-plantas-b.json');
const semana=e.paginas.find(p=>p.lang==='pt'&&p.rota==='leituraDaSemana');
const esc=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('|','&#124;').replaceAll('\n',' ');
const plantas=[...w.plantas,...fc.plantas,...pais.filter(p=>p.celula.startsWith('A4')).map(p=>({nome:p.nome,mordeu:p.passou,queixa:p.saida.split('\n').filter(l=>l.includes('A4')).join('\n')}))];
const frases=e.paginas.map(p=>`### ${p.rota}, ${p.lang.toUpperCase()}\n\n`+p.mudancas.map(m=>`- **${m.linha}**. ${m.resumo}${m.frase||m.ausencia?`\n\n  ${m.frase||m.ausencia}`:''}${m.sinais.map(s=>`\n\n  ${s.texto} (Recibo: \`${s.linha}\`.)`).join('')}`).join('\n\n')).join('\n\n');
const tabelaPlantas=ps=>`| Planta | Mordeu | Mensagem observada |\n|---|---|---|\n`+ps.map(p=>`| ${esc(p.nome)} | ${p.aplica===false?'não se aplica':p.mordeu?'sim':'não'} | ${esc(p.queixa??p.queixas?.join(' / '))} |`).join('\n');
const texto=`# EX2 · a leitura da semana diz o que cada número é

A leitura da semana abre com os números que mudaram de valor. O índice usa a mesma gramática: nome da medida, período, unidade antes dos dois pontos, os dois valores, a revisão da fonte e a data. A definição aparece uma vez no fim de cada grupo de linhas consecutivas da mesma medida, seguida pelos sinais que os seus recibos tenham. Nenhuma definição nem sinal foi escrito nesta passagem: vêm de \`oQueEDaLinha\`, e a W4 compara-os com os recibos construídos da mesma edição. A ausência por confirmar continua explícita.

A cabeça do código é \`${e.cabeca_codigo}\`. A base da primeira construção é \`${e.base}\`. Construtor: Codex, identificação pedida no mandato e nos trailers. Não foi observada uma linha «tokens used» nesta sessão; o custo fica por apurar no registo do lançador. A leitura a frio recebida está em [LEITURA-EX2](../../critica/LEITURA-EX2-2026-10-06.md). Falta a leitura curta do diff e a conferência da direção antes de aterrar. Não houve publicação.

## Medidas e decisão da unidade

O comando \`node design/especime-v3/medicoes/ex2-2026-10-06/medir-base.mjs\` produziu [base.json](base.json): ${b.linhas} linhas no livro, ${b.ambito} no âmbito, ${b.unidades_distintas} unidades, ${b.unidades_por_palavra} começadas por palavra. A construção final tem a janela ${e.janela.inicio} a ${e.janela.fim}, ${semana.mudancas.length} mudanças e ${e.por_confirmar_na_semana} ausências por confirmar. Há ${semana.frases} definições na semana portuguesa, uma por grupo; as contagens de cada página estão em [entrega-b.json](entrega-b.json).

**A unidade antes dos dois pontos é a decisão da direção, confirmada pelo mandato desta passagem.** O ensaio \`node design/especime-v3/medicoes/ex2-2026-10-06/medir-unidades.mjs\`, em [unidades.json](unidades.json), não decidiu pela geometria: empatou. Cada forma teve ${u.resumo.antes.amostras} amostras, a ${u.larguras.join(' e ')} px, nas duas edições. A forma antes dos valores teve ${u.resumo.antes.transbordos} transbordos e ${u.resumo.antes.linhas_total} linhas; a forma entre parênteses teve ${u.resumo.parenteses.transbordos} transbordos e ${u.resumo.parenteses.linhas_total} linhas. O desempate usou a contagem de unidades por edição com parênteses aninhados: ${u.resumo.antes.parenteses_aninhados} contra ${u.resumo.parenteses.parenteses_aninhados}. Contadas as amostras em ambas as larguras, são ${passagem.unidades.parenteses_por_amostra.antes} contra ${passagem.unidades.parenteses_por_amostra.parenteses}. Essa distinção está em [passagem-b.json](passagem-b.json), produzida por \`node design/especime-v3/medicoes/ex2-2026-10-06/medir-passagem-b.mjs\`.

O ensaio mede apenas unidade e valores. Não inclui o período. A adjacência do período com o ano de base dos volumes encadeados fica como limite para o bloco dos recibos, juntamente com as referências para dizer se um valor é alto ou baixo. As capturas conferem a frase inteira construída.

A régua das frases compostas leu ${e.fc.paginas} páginas em ${e.fc.passagens} passagens e encontrou ${e.fc.erros.length} falhas. As capturas finais têm ${e.capturas.quantidade} ficheiros, página inteira e recorte, com ${e.capturas.erros.length} transbordos. As anteriores conservam o sufixo \`-antes\` e o [manifesto próprio](capturas-antes.json). Comandos: \`node tests/explicacoes/frases-compostas.mjs --json design/especime-v3/medicoes/ex2-2026-10-06/frases-compostas-b.json\` e \`node design/especime-v3/medicoes/ex2-2026-10-06/captar-ex2.mjs\`. Fontes: [régua](frases-compostas-b.json), [capturas](capturas-b.json).

O guião da entrega encontrou ${e.ficheiros_protegidos_alterados.length} alterações no livro, nas declarações de dados e no recibo. O teto da L1 não mudou. Saiu apenas a dispensa das antigas portas dos marcadores de título, que já não são obrigatórias.

## A passagem EX2-b

As decisões e a ligação entre cada achado e as plantas estão em [passagem-b.json](passagem-b.json).

${passagem.decisoes.map(d=>`- **Achados ${d.achados.join(', ')}.** ${d.feito}${d.plantas.length?` Plantas: ${d.plantas.map(p=>`«${p}»`).join('; ')}.`:''}`).join('\n')}

A medição antes da mudança, \`node design/especime-v3/medicoes/ex2-2026-10-06/medir-titulos-b.mjs\`, está em [titulos-antes-b.json](titulos-antes-b.json). O componente lia \`titleUnverified\` nas edições inglesas dos estudos da água e acrescentava o marcador. As edições portuguesas não tinham essa declaração. A língua do texto já era reconhecida como portuguesa. A falta de tradução não é incerteza sobre o nome publicado.

A cadeia de nenhuma mudança na primeira página já existia desde o EX1: ${passagem.primeira_nenhuma_desde_ex1.map(x=>`\`${x}\``).join('; ')}. O texto efetivamente mostrado nas duas edições consta de [passagem-b.json](passagem-b.json).

As células do selo da definição e dos pedaços marcados são vazias nesta construção: ${passagem.paginas.reduce((n,p)=>n+p.definicoes_com_algarismos,0)} definições com algarismos e ${passagem.paginas.reduce((n,p)=>n+p.pedacos_marcados,0)} pedaços marcados, entre ${passagem.paginas.reduce((n,p)=>n+p.definicoes,0)} definições. As plantas sintéticas dos auxiliares não provam \`auditaSelo\` numa definição real com valor. Este limite fica declarado, sem aumentar a prova que existe.

## Plantas e mensagens

As plantas estragam cópias em memória ou o navegador. Exigem o controlo intacto e a mensagem da célula que julga a página. Os ficheiros completos são [semana-b.json](semana-b.json), [frases-compostas-b.json](frases-compostas-b.json) e [titulos-plantas-b.json](titulos-plantas-b.json). Comandos: \`node tests/explicacoes/semana.mjs --prova --json design/especime-v3/medicoes/ex2-2026-10-06/semana-b.json\`, a régua visual indicada acima e \`node tests/pais/pais.mjs --json design/especime-v3/medicoes/ex2-2026-10-06/titulos-plantas-b.json\`. As plantas da cópia do livro continuam em \`semana-b.json → w1\`.

${tabelaPlantas(plantas)}

## Portões na cabeça do código

Comando: \`sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/ex2-2026-10-06/portoes-b\`, com o caminho absoluto da worktree na execução. A tranca foi respeitada. As variáveis \`OEDP_SEMANA_JSON\` e \`OEDP_FRASES_JSON\` guardaram as saídas estruturadas da corrida. Cabeça de início: \`${e.cabeca_portoes}\`; cabeça de fim: \`${e.cabeca_fim}\`.

| Portão | Código lido de ficheiro | Ficheiro |
|---|---:|---|
${Object.entries(e.portoes).map(([g,c])=>`| ${g} | ${c} | [${g}.codigo](portoes-b/${g}.codigo) |`).join('\n')}

A entrega foi medida por \`node design/especime-v3/medicoes/ex2-2026-10-06/medir-entrega.mjs\`. Este relatório inteiro foi gerado por \`node design/especime-v3/medicoes/ex2-2026-10-06/escrever-relatorio.mjs\`; não contém secções acrescentadas à mão. A regeneração e os bytes das capturas conferem-se com \`node design/especime-v3/medicoes/ex2-2026-10-06/conferir-artefactos-b.mjs\`, em [artefactos-b.json](artefactos-b.json). A observação visual, escrita pelo construtor, fica em [inspecao-visual-b.json](inspecao-visual-b.json), distinta da leitura a frio.

## Questões e limites

${passagem.questoes.map(q=>`- **${q.id}.** ${q.estado}`).join('\n')}

## Commits desta passagem anteriores às provas finais

${e.commits.map(c=>`- \`${c}\``).join('\n')}

## Páginas construídas, lidas do HTML

${frases}
`;
fs.writeFileSync(path.join(pasta,'LEIA-ME.md'),texto);
console.log('LEIA-ME.md escrito a partir das medições da passagem EX2-b.');
