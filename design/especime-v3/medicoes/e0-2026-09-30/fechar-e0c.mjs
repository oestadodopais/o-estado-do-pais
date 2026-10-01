/** E0c: fecha o mandato com provas atuais e conserva o custo histórico E0b. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { load } from 'js-yaml';
import { assinaturaDoValor } from '../../../../src/lib/historia-do-valor.mjs';
import { mudancasDoRegisto } from '../../../../src/lib/mudancas.mjs';
import { lerCodigoDaCorrida } from './detetores-e0b.mjs';
const pasta = 'design/especime-v3/medicoes/e0-2026-09-30';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const json = f => JSON.parse(fs.readFileSync(`${pasta}/${f}`, 'utf8'));
const cabeca = git('rev-parse', 'HEAD');
const base = git('rev-parse', 'a99d45cc');
const medidas = json('medidas.json');
const detetores = json('detetores-e0c.json');
const custo = json('custo.json');
const capturas = json('capturas-e0.json');
const historicoE0b = json('e0b.json');
const contador = load(fs.readFileSync('ledger/claims/correcoes-publicadas.yml', 'utf8'));
const antes = load(git('show', `${base}:ledger/claims/correcoes-publicadas.yml`));
assert.equal(contador.value, antes.value);
assert.deepEqual(contador.corrections.map(assinaturaDoValor), antes.corrections.map(assinaturaDoValor));
assert.equal(fs.readFileSync('ledger/historias-valores.json', 'utf8'), git('show', `${base}:ledger/historias-valores.json`) + '\n');
const portas = ['build', 'verify', 'typecheck'].map(nome => {
  const p = `${pasta}/portoes/e0c/${nome}`;
  const pendente = { nome, codigo: null, cabeca: null, segundos: null };
  if (!fs.existsSync(`${p}.json`)) return pendente;
  const r = JSON.parse(fs.readFileSync(`${p}.json`, 'utf8'));
  const lido = lerCodigoDaCorrida(`${p}.codigo`, fs.statSync(`${p}.inicio`).mtimeMs, fs.statSync(`${p}.fim`).mtimeMs);
  const head = fs.readFileSync(`${pasta}/portoes/e0c/cabeca`, 'utf8').trim();
  return head === cabeca && r.cabeca === cabeca && r.cabeca_fim === cabeca && r.medido_nesta_corrida
    && !r.codigo_por_registar && lido.medido && lido.codigo === r.codigo ? { nome, ...r, codigo: lido.codigo } : pendente;
});
const nomes = medidas.e0c?.nomes_do_registo ?? [];
const nomesDaDivida = ['pt', 'en'].map(lang => ({ lang, ...mudancasDoRegisto(lang).find(e => e.claim === 'divida-das-familias-2025-ue').nome }));
const finais = medidas.e0c?.completa === true && medidas.cabeca === cabeca && capturas.cabeca === cabeca
  && portas.every(p => p.codigo === 0 && p.cabeca === cabeca);
const commits = git('log', '--reverse', '--format=%h|%s', `${base}..HEAD`).split('\n').filter(Boolean);
const plantas = medidas.medidas.find(m => m.nome === 'plantas_que_mordem').valor;
const inteiro = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const decimal = n => String(n).replace('.', ',');
const dados = { passagem: 'E0c', base, cabeca, medido_em: new Date().toISOString(), completa: finais,
  triagem: { fonte: 'prompts/PROMPT-e0c-construtor.md', plantas_do_pacote: [1, 2, 3, 4, 5],
    registados_sem_passagem: [7, 11], guiao_corrigido_antes_da_passagem: 10 },
  nomes_da_divida: nomesDaDivida, nomes_conferidos: nomes.length, plantas: plantas.total,
  detetores: { cabeca: detetores.cabeca, correcoes_publicadas: detetores.correcoes_publicadas,
    historia_anterior_conservada: detetores.historia_anterior_conservada },
  razoes: { pt: contador.corrections.at(-1).reason, en: contador.corrections.at(-1).reason_en },
  valor_conservado: true, assinatura_conservada: true, historia_selada_conservada: true,
  portoes: portas, capturas: { cabeca: capturas.cabeca, total: capturas.capturas, problemas: capturas.problemas },
  custo_e0b: custo.e0b, custo_e0c: custo.e0c, pedido_do_limiar_e0b: 'Retirado na triagem da releitura, sem defeito no cartão.' };
fs.writeFileSync(`${pasta}/e0c.json`, JSON.stringify(dados, null, 2) + '\n');
execFileSync('node', [`${pasta}/fechar-e0.mjs`]);
const tabela = portas.map(p => `| \`npm run ${p.nome}\` | ${p.codigo === null ? 'Por correr' : `[${p.codigo}](portoes/e0c/${p.nome}.codigo)`} | ${p.cabeca ? `\`${p.cabeca}\`` : 'Por escrever'} | ${p.segundos === null ? 'Por medir' : p.segundos} |`).join('\n');
const estado = finais ? 'O mandato E0c está conferido, com os três portões a zero na cabeça final.' : 'Os acertos E0c estão implementados; faltam os portões finais, as capturas e as medidas do HTML renovado.';
const secao = `
## E0b, registo histórico e custo corrigido

A passagem E0b correu na cabeça \`${historicoE0b.cabeca}\`, com os três portões a zero, em portoes/e0b/. O [comprovativo E0b](e0b.json) conserva as cabeças das provas dessa passagem. O pedido sobre a média de três anos foi retirado na [triagem da releitura](../../critica/LEITURA-e0b-2026-09-30.md): o cartão do desemprego está certo, e esse ponto fecha sem defeito.

O nome Correções publicadas, ou Published corrections na edição inglesa, vem de NOMES_DAS_LINHAS_DERIVADAS em src/data/nomes-das-medidas.mjs. A localização continua a vir da derivação declarada.

A amostra E0b de ${custo.e0b.medido_em} dá ${inteiro(custo.e0b.construtor_simbolos)} símbolos do construtor e ${custo.e0b.revisores_automaticos.map(s => inteiro(s.simbolos_sem_cache_mais_saida)).join(' e ')} nas duas sessões do revisor automático. Os revisores somam ${inteiro(custo.e0b.revisores_simbolos)}; o total cobrado na amostra é ${inteiro(custo.e0b.total_cobrado_simbolos)}, ao lado dos ${inteiro(custo.e0b.construtor_simbolos)} do construtor. O tempo medido foi ${decimal(custo.e0b.segundos_decorridos)} segundos. São os contadores lidos de [custo-e0b.json](custo-e0b.json), também no campo e0b de [custo.json](custo.json). A E0c não prolonga essa amostra. O custo final do E0 continua distinguido acima.

## E0c

${estado} Cabeça: \`${cabeca}\`. Base recebida: \`${base}\`.

### Mandato e medidas

| # | Mandato | Resultado e prova |
| --- | --- | --- |
| 1 | Nome da dívida das famílias | A tabela NOMES_DO_PROJETO declara Dívida das famílias e Household debt, os nomes correntes do cartão. O lugar diz União Europeia ou European Union. ${finais ? `A célula conferiu ${nomes.filter(n => n.lang === 'pt').length} nomes em português e ${nomes.filter(n => n.lang === 'en').length} em inglês.` : 'A conferência dos vinte nomes de cada edição fica para a corrida final.'} |
| 2 | Positivos da recontagem e da história | O mesmo detetor da medida reconta ${detetores.correcoes_publicadas.antes} e, sem a correção do PIB do Alentejo numa cópia, ${detetores.correcoes_publicadas.depois}. Alterar new_value de uma entrada selada de Évora numa cópia produz a queixa de história alterada. O livro e a história reais conservaram-se. Prova: detetores-e0c.json, cabeça \`${detetores.cabeca}\`. |
| 3 | Custo completo da E0b | ${inteiro(custo.e0b.construtor_simbolos)} do construtor + ${inteiro(custo.e0b.revisores_simbolos)} dos dois revisores = ${inteiro(custo.e0b.total_cobrado_simbolos)} na amostra, nos ficheiros e na secção histórica acima. |
| 4 | Razão permanente e frases do relatório | A razão diz duas correções publicadas a 30.09.2026, e published on 30.09.2026. Valor, assinatura e ficheiro da história selada conservados. O relatório identifica a tabela do nome e lista todas as ${plantas.total} plantas que conta. |
| 5 | Portões, capturas, relatório e resposta | ${finais ? 'Portões a zero, códigos lidos desta corrida; capturas e medidor da mesma cabeça.' : 'Portões finais por correr.'} A resposta está em RESPOSTA-construtor-e0c.md. |

Os achados 1 a 5 da releitura são as plantas do pacote e ficaram intactos. Os achados 7 e 11 ficam registados sem passagem. O achado 10 já vinha corrigido no guião portoes.sh, que se conservou. O cartão do desemprego e os números do livro ficaram intactos.

### Plantas e capturas

A lista completa das ${plantas.total} plantas está na secção de conferências dirigidas acima, gerada do mesmo comprovativo que conta ${plantas.mordidas} mordidas. Os dois positivos novos estão separados em detetores-e0c.json e usam os detetores que escrevem as medidas, com cópias em memória.

${finais ? `As ${capturas.capturas} capturas foram renovadas na cabeça \`${capturas.cabeca}\`, com ${capturas.problemas.length} problemas. Incluem O que mudou nas duas edições, a 390 e a 1 280 px, e mantêm as capturas da primeira página e do cartão.` : 'O captor existente renovará as doze capturas, incluindo O que mudou nas duas edições e nas duas larguras.'} Os resumos SHA-256 são recalculados pelo medidor.

### Commits E0c

${commits.map(c => { const [h, texto] = c.split('|'); return `- \`${h}\`: ${texto}.`; }).join('\n')}

### Portões E0c

Chamada: \`sh scripts/leituras/portoes.sh . design/especime-v3/medicoes/e0-2026-09-30/portoes/e0c\`. O recolhedor e o medidor recusam códigos antigos, cabeças diferentes ou código por registar. As durações têm a resolução de segundos do guião.

| Comando | Código lido | Cabeça | Segundos |
| --- | ---: | --- | ---: |
${tabela}

### Custo E0c e limite

${custo.e0c ? `A amostra de ${custo.e0c.medido_em} dá ${inteiro(custo.e0c.construtor_simbolos)} símbolos do construtor, ${inteiro(custo.e0c.revisores_simbolos)} dos revisores e ${inteiro(custo.e0c.total_cobrado_simbolos)} no total cobrado; ${decimal(custo.e0c.segundos_decorridos)} segundos desde a retoma de ${custo.e0c.inicio}. O delta começa no último token_count anterior à retoma. O critério dos revisores está em custo.json.` : 'A amostra E0c fica por medir.'} Modelo lido: \`${custo.construtor.modelo}\`. É uma amostra anterior ao fecho. Os mostradores foram lidos antes dos portões e estão em uso-e0c.json.

### O que fica por fazer

${finais ? 'Nenhum ponto do mandato E0c fica por cumprir. Falta a conferência do diff e a aterragem, conforme a triagem; não há pedido de quarta leitura.' : 'Faltam os portões finais, as capturas renovadas e a medição do HTML.'} Os comprovativos e a resposta finais atualizam-se na worktree depois do último commit, conservando a cabeça conferida. Não houve publicação.
`;
fs.appendFileSync(`${pasta}/LEIA-ME.md`, secao);
fs.writeFileSync(`${pasta}/RESPOSTA-construtor-e0c.md`, `# E0c · Resposta do construtor\n\n${estado}\n\nCabeça: \`${cabeca}\`. Commits: ${commits.map(c => `\`${c.split('|')[0]}\``).join(', ')}.\n\nCódigos lidos: ${portas.map(p => `${p.nome}: ${p.codigo ?? 'por correr'}`).join('; ')}. Relatório: [LEIA-ME.md](LEIA-ME.md), secção E0c.\n\n${finais ? 'Falta a conferência do diff e a aterragem. O pedido sobre a média de três anos foi retirado na triagem da releitura E0b.' : 'Faltam os portões finais, as capturas e as medidas do HTML.'}\n`);
console.log(`E0c: relatório na cabeça ${cabeca}; mandato conferido: ${finais}.`);
