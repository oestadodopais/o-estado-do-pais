#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * OS POSITIVOS CONHECIDOS DAS GUARDAS NOVAS DO 8.4 (14.09.2026)
 * ---------------------------------------------------------------------------
 *
 * A leitura do Codex de 14.09.2026 escreveu, no achado 8, o que faltava à
 * célula 8.4: «An empty `origens: []` passes». E no achado 28: «The
 * `[a verificar]` rule has no positive test case in this block». As duas coisas
 * foram fechadas no mesmo dia, e uma guarda que nunca se viu morder é uma guarda
 * por medir: este guião planta-lhe o defeito que ela existe para apanhar e exige
 * que ela feche.
 *
 * AS GUARDAS QUE CORREM NO `dist/` têm o seu positivo conhecido em
 * `plantas.mjs`, que estraga a página construída e corre a régua inteira. Este
 * guião é para as que correm NA DECLARAÇÃO, antes de haver página nenhuma:
 * `conferirOrigensDeclaradas()`, que fecha a construção quando uma definição não
 * declara origem, e `textoDaDefinicao()`, que resolve os pedaços de uma frase
 * para o texto que a página rende.
 *
 *   node design/especime-v3/medicoes/lugar-2026-09-04/positivos-8-4.mjs
 *
 * Sai a 0 quando todas morderem, e a 1 com a lista das que não morderam.
 */
import { conferirOrigensDeclaradas, textoDaDefinicao } from '../../../../src/data/figuras.mjs';
import { POR_VERIFICAR } from '../../../../src/data/marcador.mjs';

/** @type {{ nome: string, esperado: string, obtido: string, mordeu: boolean }[]} */
const casos = [];

/**
 * @param {string} nome
 * @param {() => void} corre
 * @param {string} pedaco o que a mensagem do erro tem de conter
 */
function fecha(nome, corre, pedaco) {
  let obtido = '(não fechou)';
  let mordeu = false;
  try {
    corre();
  } catch (e) {
    obtido = e instanceof Error ? e.message : String(e);
    mordeu = obtido.includes(pedaco);
  }
  casos.push({ nome, esperado: `fecha com «${pedaco}»`, obtido: obtido.slice(0, 90), mordeu });
}

/**
 * @param {string} nome
 * @param {() => void} corre
 */
function naoFecha(nome, corre) {
  let obtido = '(não fechou)';
  let mordeu = true;
  try {
    corre();
  } catch (e) {
    obtido = e instanceof Error ? e.message : String(e);
    mordeu = false;
  }
  casos.push({ nome, esperado: 'não fecha', obtido: obtido.slice(0, 90), mordeu });
}

/* 1 · A DEFINIÇÃO SEM ORIGEM NENHUMA. É o defeito do achado 8, escrito à letra:
   uma lista vazia não tem chaves para percorrer, e a volta que as percorria dava
   zero iterações e passava. */
fecha(
  'uma definição com `origens: []`',
  () => conferirOrigensDeclaradas('a planta', { plantada: { origens: [] } }),
  'não declara origem nenhuma',
);

/* 2 · A DEFINIÇÃO SEM O CAMPO. O mesmo defeito com outra forma: a declaração não
   diz `origens` de todo. */
fecha(
  'uma definição sem o campo `origens`',
  () => conferirOrigensDeclaradas('a planta', { plantada: {} }),
  'não declara origem nenhuma',
);

/* 3 · A CHAVE QUE NÃO EXISTE. Esta já mordia em `comDefinicao()`, e passa a
   morder também nas definições dos painéis, que nunca lá passaram. */
fecha(
  'uma definição que aponta para uma origem inexistente',
  () => conferirOrigensDeclaradas('a planta', { plantada: { origens: ['nao-existe-nenhuma'] } }),
  'não está em',
);

/* 4 · O CONTROLO. Uma guarda que feche sempre não distingue nada: uma declaração
   boa tem de passar. A chave é uma das reais. */
naoFecha('uma definição com uma origem declarada e existente', () =>
  conferirOrigensDeclaradas('a planta', { plantada: { origens: ['painel-pdm'] } }),
);

/* 5 · O MARCADOR NO TEXTO DECLARADO. É o achado 28: a régua resolvia um
   `{ marcador }` para uma cadeia vazia, e uma definição que publique
   `[a verificar]` ficava diferente da sua declaração sem que ninguém lhe tivesse
   tocado. */
{
  const obtido = textoDaDefinicao([
    'o nome por extenso da sigla permanece ',
    { marcador: 'a verificar', gloss: 'to verify' },
    '.',
  ]);
  casos.push({
    nome: 'o `{ marcador }` resolve-se para o marcador da casa',
    esperado: `contém «${POR_VERIFICAR}»`,
    obtido,
    mordeu: obtido === `o nome por extenso da sigla permanece ${POR_VERIFICAR}.`,
  });
}

/* 6 · O CONTROLO DO 5. Uma frase sem marcador não pode ganhar um. */
{
  const obtido = textoDaDefinicao(['A dívida do setor das administrações públicas, em percentagem do PIB.']);
  casos.push({
    nome: 'uma frase sem marcador não rende o marcador',
    esperado: `não contém «${POR_VERIFICAR}»`,
    obtido,
    mordeu: !obtido.includes(POR_VERIFICAR),
  });
}

const largura = Math.max(...casos.map((c) => c.nome.length));
console.log('os positivos conhecidos das guardas do 8.4\n');
for (const c of casos) {
  console.log(
    `  ${c.mordeu ? 'MORDEU  ' : 'NÃO     '} ${c.nome.padEnd(largura)}  · esperado: ${c.esperado}\n` +
      `           ${' '.repeat(largura)}    obtido: ${c.obtido}`,
  );
}
const falhas = casos.filter((c) => !c.mordeu).length;
console.log(`\n  ${casos.length - falhas} de ${casos.length}`);
process.exit(falhas === 0 ? 0 : 1);
