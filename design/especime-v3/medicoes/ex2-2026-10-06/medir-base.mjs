/** EX2: o livro atual, a janela da construção e a diferença entre a conta do brief e as rotas da FC. */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { allClaims } from '../../../../src/lib/ledger.mjs';
import { linhaDoAmbito, leituraDaSemana } from '../../../../src/lib/leitura-da-semana.mjs';
import { oQueEDaLinha } from '../../../../src/lib/o-que-e-o-numero.mjs';
import { unidadeDaLinha } from '../../../../src/i18n/unidades.mjs';
import { EXPLICACOES } from '../../../../src/data/explicacoes/index.mjs';
import { routePath } from '../../../../src/lib/routes.mjs';

const linhas = allClaims();
const ambito = linhas.filter(linhaDoAmbito);
const semana = leituraDaSemana();
const unidades = [...new Set(ambito.map(c => c.unit))].sort().map(unit => {
  const c = ambito.find(c => c.unit === unit);
  const cor = c.corrections?.find(x => ['correcao', 'atualizacao'].includes(x.kind));
  return { unidade: unit, linha: c.id, antes: cor?.old_value ?? c.value, depois: cor?.new_value ?? c.value,
    origem_dos_valores: cor ? 'uma entrada real do registo' : 'o valor atual, repetido apenas no ensaio da forma',
    edicoes: Object.fromEntries(['pt', 'en'].map(lang => [lang, unidadeDaLinha(unit, lang)])) };
});
const cabecaInicial = 'd1becbf8f167643ca8d53a4479f8f6bbee0f7183';
const fc = execFileSync('git', ['show', `${cabecaInicial}:tests/explicacoes/frases-compostas.mjs`], {encoding: 'utf8'});
const declaracao = fc.match(/const ROTAS = .*?const LARGURAS/s)[0];
const fixas = [...declaracao.matchAll(/routePath\('([a-zA-Z]+)', lang\)/g)].map(m => m[1]);
const paginas = ['pt', 'en'].flatMap(lang => [...fixas.map(key => routePath(key, lang)), ...EXPLICACOES.map(e => routePath('explicacao', lang, {slug: e.slug}))]);
const mudancas = semana.mudancas.map(m => ({...m, frases: Object.fromEntries(['pt', 'en'].map(lang => [lang, oQueEDaLinha(m.linha, lang)]))}));
const saida = { comando: 'node design/especime-v3/medicoes/ex2-2026-10-06/medir-base.mjs', cabeca: execFileSync('git', ['rev-parse', 'HEAD'], {encoding:'utf8'}).trim(),
  linhas: linhas.length, ambito: ambito.length, unidades_distintas: unidades.length,
  unidades_por_palavra: unidades.filter(u => /^[A-Za-zÀ-ÿ]/.test(u.unidade)).length, unidades,
  janela: semana.janela, contagens: semana.contagens, mudancas,
  por_confirmar: mudancas.filter(m => m.frases.pt.porConfirmar).length,
  fc: { paginas_fixadas_no_brief: fixas.length * 2, paginas_reais: paginas.length, paginas,
    divergencia: 'O guião do brief conta as chamadas fixas, mas omite as páginas que EXPLICACOES.map acrescenta.' } };
fs.writeFileSync(new URL('base.json', import.meta.url), JSON.stringify(saida, null, 2)+'\n');
console.log(JSON.stringify({linhas:saida.linhas, ambito:saida.ambito, unidades:saida.unidades_distintas, mudancas:mudancas.length, por_confirmar:saida.por_confirmar, fc:saida.fc}, null, 2));
