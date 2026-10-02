/** K2, item 6: as duas linhas que escreviam menos casas decimais do que o excerto da fonte, corrigidas pelo mecanismo
 * do E0 (`design/especime-v3/medicoes/e0-2026-09-30/atualizar-linhas.mjs`): uma entrada `correcao` datada em cada
 * linha, a história selada pelo selador de sempre (`scripts/selar-historia-valores.mjs`), e o contador das correções
 * recontado por uma entrada `atualizacao`, com as datas da recontagem. Nenhum valor se escreve à mão: o valor novo é o
 * literal do excerto na forma da casa, e o guião recusa correr se o excerto não terminar nesse literal.
 * Uso, da raiz da worktree: node design/especime-v3/medicoes/k2-2026-10-02/corrigir-decimais.mjs
 * Corre uma vez; corrido outra vez, confere que as entradas estão aplicadas e não escreve nada. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { load } from 'js-yaml';

const DIA = '2026-10-02';
const EDICAO = '02.10.2026';
const ids = ['jovens-nem-2025', 'fluxo-de-credito-as-empresas-2025'];
const antes = JSON.parse(fs.readFileSync('ledger/historias-valores.json', 'utf8'));

/** Acrescenta a entrada no fim da lista de correções, muda o valor e sela; nunca reescreve uma entrada que já existe. */
const aplicar = (id, entrada, outros = (t) => t) => {
  const ficheiro = `ledger/claims/${id}.yml`;
  const texto = fs.readFileSync(ficheiro, 'utf8');
  const linha = load(texto);
  if (linha.value === entrada.new_value && JSON.stringify(linha.corrections.at(-1)) === JSON.stringify(entrada)) {
    console.log(`${id}: entrada já aplicada.`);
    return;
  }
  assert.equal(linha.value, entrada.old_value, `${id}: o valor da linha não é o valor anterior da entrada`);
  const campos = Object.entries(entrada).map(([k, v]) => `    ${k}: ${JSON.stringify(v)}`).join('\n').replace(/^    /, '  - ');
  let novo = texto.replace(/^value: .*$/m, `value: ${JSON.stringify(entrada.new_value)}`);
  novo = linha.corrections.length === 0
    ? novo.replace('corrections: []', `corrections:\n${campos}`)
    : novo.replace(/(\ncorrections:\n(?:  - .*\n|    .*\n)+)/, (m) => `${m}${campos}\n`);
  novo = outros(novo);
  const conferida = load(novo);
  assert.deepEqual(conferida.corrections, [...linha.corrections, entrada], `${id}: a lista de correções não ficou como devia`);
  assert.equal(conferida.value, entrada.new_value);
  fs.writeFileSync(ficheiro, novo);
  execFileSync('node', ['scripts/selar-historia-valores.mjs', id], { stdio: 'inherit' });
};

for (const id of ids) {
  const linha = load(fs.readFileSync(`ledger/claims/${id}.yml`, 'utf8'));
  assert.equal(linha.derivation, null, `${id}: a linha tem derivação, e a regra é das linhas sem derivação`);
  const literal = linha.excerpt.match(/2025: (\d+\.\d+)$/)?.[1];
  assert.ok(literal, `${id}: o excerto não termina no literal «2025: N.D»`);
  const novo = literal.replace('.', ',');
  aplicar(id, {
    date: DIA, kind: 'correcao', old_value: linha.corrections.length ? linha.corrections.at(-1).new_value : linha.value, new_value: novo,
    reason: `A apresentação omitira a casa decimal que o excerto da fonte já guardava: «${literal}». Repõe-se essa casa decimal na forma portuguesa, sem alterar a quantidade nem declarar uma revisão da fonte.`,
    reason_en: `The presentation omitted the decimal place already preserved in the source excerpt: «${literal}». That decimal place is restored in the Portuguese number format, without changing the quantity or claiming a source revision.`,
  });
}

const correcoes = fs.readdirSync('ledger/claims').filter((f) => f.endsWith('.yml')).reduce((n, f) =>
  n + (load(fs.readFileSync(`ledger/claims/${f}`, 'utf8')).corrections ?? []).filter((e) => e.kind === 'correcao').length, 0);
const contador = load(fs.readFileSync('ledger/claims/correcoes-publicadas.yml', 'utf8'));
assert.equal(contador.check, 'correcoes_publicadas');
aplicar(contador.id, {
  date: DIA, kind: 'atualizacao', old_value: contador.corrections.length ? contador.corrections.at(-1).new_value : contador.value, new_value: String(correcoes),
  reason: 'Duas correções publicadas a 02.10.2026 repõem a casa decimal dos jovens que não trabalham, não estudam nem estão em formação e do fluxo de crédito às empresas. A contagem passa a incluí-las; a recontagem não é uma correção adicional.',
  reason_en: 'Two corrections published on 02.10.2026 restore the decimal place of young people not in employment, education or training and of the credit flow to corporations. The count now includes them; the recount is not an additional correction.',
}, (t) => t
  .replace(/^(\s*edition: )"[^"]*"$/m, `$1"${EDICAO}"`)
  .replace(/^access_date: "[^"]*"$/m, `access_date: "${DIA}"`)
  .replace(/^reference_date: "[^"]*"$/m, `reference_date: "${DIA}"`)
  .replace(/^note: ".*"$/m, 'note: "Esta edição corresponde à recontagem de 02.10.2026, que incluiu as duas correções da apresentação decimal dos jovens que não trabalham, não estudam nem estão em formação e do fluxo de crédito às empresas, depois das duas do desemprego de 30.09.2026. As datas de referência e de leitura são as dessa recontagem do próprio livro-razão. O valor é reavaliado a cada construção: se entrar uma correção e o contador não mudar, a conferência falha. Os campos que só um documento externo poderia preencher ficam a null, pois a proveniência desta contagem é a sua derivação."'));

const depois = JSON.parse(fs.readFileSync('ledger/historias-valores.json', 'utf8'));
for (const [id, entradas] of Object.entries(antes)) assert.deepEqual(depois[id].slice(0, entradas.length), entradas, `${id}: uma entrada selada mudou`);
const final = load(fs.readFileSync('ledger/claims/correcoes-publicadas.yml', 'utf8'));
assert.equal(final.value, String(correcoes));
console.log(`K2: as duas correções e a recontagem (${final.corrections.at(-2)?.new_value ?? '?'} para ${final.value}) aplicadas pelo mecanismo; as entradas anteriores conservam-se.`);
