/** O relatório é composto apenas depois de ler as medidas da entrega. */
import fs from 'node:fs';
import path from 'node:path';
const pasta=path.dirname(new URL(import.meta.url).pathname);
const le=f=>JSON.parse(fs.readFileSync(path.join(pasta,f),'utf8'));
const e=le('entrega.json'),b=le('base.json'),u=le('unidades.json'),w=le('semana.json'),fc=le('frases-compostas.json');
const semana=e.paginas.find(p=>p.lang==='pt'&&p.rota==='leituraDaSemana');
const esc=s=>String(s??'').replaceAll('|','&#124;').replaceAll('\n',' ');
const plantas=[...w.plantas,...fc.plantas];
const frases=e.paginas.filter(p=>p.rota==='leituraDaSemana').map(p=>`### ${p.lang.toUpperCase()}\n\n`+p.mudancas.map(m=>`- **${m.linha}**. ${m.resumo}\n\n  ${m.frase||m.ausencia}`).join('\n\n')).join('\n\n');
const texto=`# EX2 · a leitura da semana diz o que cada número é

A definição provada do recibo aparece num parágrafo próprio sob cada mudança de valor, na leitura da semana e em «O que mudou» do índice. As palavras vêm de \`oQueEDaLinha\`; a conferência compara-as com o recibo construído da mesma linha e edição e confirma o estado na auditoria das famílias. Quando a auditoria diz «por confirmar», aparece a ausência da cadeia da casa.

A cabeça do código é \`${e.cabeca_codigo}\`. A base é \`${e.base}\`. Construção por Codex, com a identificação e os trailers pedidos no mandato. Não foi observada uma linha «tokens used» nesta sessão; o custo fica por apurar no registo do lançador. A leitura a frio do Claude Opus e a conferência pelo lugar de direção ficam pendentes, sem aterragem nem publicação nesta sessão.

## O que se mediu e se escolheu

O comando \`node design/especime-v3/medicoes/ex2-2026-10-06/medir-base.mjs\` produziu [base.json](base.json). O livro tem ${b.linhas} linhas, ${b.ambito} no âmbito, ${b.unidades_distintas} unidades, ${b.unidades_por_palavra} começadas por palavra. A semana construída vai de ${e.janela.inicio} a ${e.janela.fim}: ${semana.mudancas.length} mudanças, ${e.por_confirmar_na_semana} sem frase por confirmar. As mudanças e as frases lidas do HTML estão abaixo e em [entrega.json](entrega.json).

**Na leitura da semana, a unidade vem antes dos dois pontos, imediatamente antes dos valores.** O comando \`node design/especime-v3/medicoes/ex2-2026-10-06/medir-unidades.mjs\` produziu [unidades.json](unidades.json), com todas as unidades nas duas formas candidatas, nas duas edições e a ${u.larguras.join(' e ')} px. Cada forma teve ${u.resumo.antes.amostras} medições. A forma anterior aos valores teve ${u.resumo.antes.transbordos} transbordos e ${u.resumo.antes.linhas_total} linhas de texto; a forma entre parênteses teve ${u.resumo.parenteses.transbordos} transbordos e ${u.resumo.parenteses.linhas_total} linhas. Decidiu o desempate a ausência de parênteses aninhados: ${u.resumo.antes.parenteses_aninhados} na escolhida contra ${u.resumo.parenteses.parenteses_aninhados} na alternativa. O ensaio mede o trecho unidade e valores, com valores reais do livro e a fonte da página. Quando não existe correção, repete o valor atual, explicitamente como ensaio. As capturas conferem a frase inteira da semana construída.

A régua visual lê ${e.fc.paginas} páginas em ${e.fc.passagens} passagens, incluindo os blocos da primeira página, a comparação dos cartões e as suas definições abertas. Encontrou ${e.fc.erros.length} falhas na entrega. As capturas têm ${e.capturas.quantidade} ficheiros, página inteira e recorte das mudanças, com ${e.capturas.erros.length} transbordos: [manifesto das capturas](capturas.json), pasta \`design/especime-v3/capturas/ex2-2026-10-06/\`. Comandos: \`node tests/explicacoes/frases-compostas.mjs --json design/especime-v3/medicoes/ex2-2026-10-06/frases-compostas.json\` e \`node design/especime-v3/medicoes/ex2-2026-10-06/captar-ex2.mjs\`.

O selo da mudança continua a abrir o mesmo recibo. Uma definição que contém um valor só pode reutilizar esse selo para a própria linha, no resumo da mesma entrada e na mesma edição. As palavras, os valores, as datas e as línguas dos pedaços continuam marcados e conferidos. O inventário dispensa apenas parágrafos cujo texto completo a célula da semana confere. A primeira ampliação da régua visual selecionou também os selos dentro da caixa do valor e uma comparação sem pedaços marcados. A seleção foi corrigida para conservar a caixa do valor como peça, como a célula já fazia, e a planta passou a escolher uma frase realmente composta. A corrida inicial está em [ensaios/frases-compostas-primeira.json](ensaios/frases-compostas-primeira.json). Não foi preciso mudar contentores das páginas existentes.

O teto da L1, o recibo e as fontes das definições não foram alterados; o guião da entrega encontrou ${e.ficheiros_protegidos_alterados.length} alterações nos caminhos protegidos que lista.

## Portões e conferências

Comando final: \`sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/ex2-2026-10-06/portoes\`, com \`<worktree>\` substituído pelo caminho absoluto na execução. A tranca foi respeitada. As variáveis \`OEDP_SEMANA_JSON\` e \`OEDP_FRASES_JSON\` guardaram os resultados estruturados das células na corrida final. Os códigos seguintes foram lidos dos ficheiros; as cabeças de início e fim são \`${e.cabeca_portoes}\` e \`${e.cabeca_fim}\`.

| Portão | Código | Ficheiro |
|---|---:|---|
${Object.entries(e.portoes).map(([g,c])=>`| ${g} | ${c} | [${g}.codigo](portoes/${g}.codigo) |`).join('\n')}

As conferências entre commits estão em [conferencias/](conferencias/), produzidas por \`node design/especime-v3/medicoes/ex2-2026-10-06/conferir-ex2.mjs\`. A entrega foi medida com \`node design/especime-v3/medicoes/ex2-2026-10-06/medir-entrega.mjs\`; este relatório foi escrito com \`node design/especime-v3/medicoes/ex2-2026-10-06/escrever-relatorio.mjs\`. O motor não foi usado.

## Plantas e mensagens

As plantas alteram cópias em memória ou o navegador. Cada uma exige o controlo intacto e a mensagem esperada da mesma conferência que julga a página. Os detalhes estão em [semana.json](semana.json) e [frases-compostas.json](frases-compostas.json). A conta da janela também conserva as plantas da cópia do livro, em \`semana.json → w1\`.

| Planta | Mordeu | Mensagem observada |
|---|---|---|
${plantas.map(p=>`| ${esc(p.nome)} | ${p.aplica===false?'não se aplica':p.mordeu?'sim':'não'} | ${esc(p.queixa??p.queixas?.join(' / '))} |`).join('\n')}

## Questões abertas e ponto onde se parou

- **EX2-1. A contagem inicial de páginas da célula no brief está errada.** A medição do código inicial encontrou ${b.fc.paginas_reais} páginas, enquanto o guião do brief conta ${b.fc.paginas_fixadas_no_brief}: omite as rotas acrescentadas por \`EXPLICACOES.map\`. Parou-se na correção desse ponto do brief, que pertence ao lugar de direção. A extensão independente da célula foi construída, sem alterar o brief nem disfarçar a discrepância.
- **EX2-2. Leitura a frio e aterragem pendentes.** O Claude Opus deve ler as páginas construídas, um recibo e as capturas, com os estragos apenas nas cópias do pacote. Deve responder ao teste dos dois minutos e dizer se um editor de um diário português imprimiria as páginas. O lugar de direção confere a entrega antes de aterrar.

## Commits da construção

${e.commits.map(c=>`- \`${c}\``).join('\n')}

## A semana construída, lida do HTML

${frases}
`;
fs.writeFileSync(path.join(pasta,'LEIA-ME.md'),texto);
console.log('LEIA-ME.md escrito a partir das medições.');
