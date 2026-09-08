#!/usr/bin/env node
/**
 * =============================================================================
 * O RESUMO DAS QUATRO RÉGUAS DO F1.1e, GUARDADO COM A DATA
 * =============================================================================
 *
 * Emenda de 08.09.2026 ao brief do F1.1e (segunda passagem), alínea (g). A
 * leitura a frio do Codex escreveu que o relatório dava resultados («94 de 94»,
 * «43 de 43», dezoito plantas, três códigos de saída) sem nada em disco que os
 * reproduzisse: um pacote de leitura recebe os ficheiros e não as corridas, e o
 * leitor não tinha como conferir nenhum desses números (achado 12).
 *
 * ESTE GUIÃO CORRE AS QUATRO RÉGUAS E GUARDA O QUE ELAS DIZEM:
 *
 *   node design/especime-v3/medicoes/resumo-das-reguas.mjs
 *
 * Cada régua corre duas vezes: uma com `--json`, que dá as células e as que
 * falham, e outra com `--vermelhos`, que dá as plantas e as apanhadas. O código
 * de saída de cada corrida entra no ficheiro, e é ele que fecha a conta: uma
 * régua que se declare verde e saia a 1 não passa por aqui.
 *
 * O QUE ELE ESCREVE é `design/especime-v3/medicoes/distritos-medidas.json`: a
 * régua do bloco escreve-o com `--json` (as suas células e as suas medidas), e
 * este guião acrescenta-lhe a chave `reguas` com o resumo das quatro e a data.
 * Nada aqui é contado à mão: as células vêm do JSON de cada régua e as plantas
 * das linhas que cada uma imprime.
 *
 * NÃO É UM PORTÃO e não entra na cadeia do `build`: é a medição de um bloco,
 * como as outras deste directório.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const SAIDA = path.join(RAIZ, 'design/especime-v3/medicoes/distritos-medidas.json');

/** As quatro réguas do bloco, cada uma com o seu nome de leitura. */
const REGUAS = [
  { chave: 'mapa-unidades', nome: 'a régua do bloco', guiao: 'tests/inicio/mapa-unidades.mjs', artefacto: SAIDA },
  { chave: 'lista', nome: 'os nomes ao lado do mapa', guiao: 'tests/inicio/lista.mjs' },
  { chave: 'mapa-distritos', nome: 'o mapa por distritos', guiao: 'tests/inicio/mapa-distritos.mjs' },
  /* A RÉGUA DA NAVEGAÇÃO NÃO TEM PLANTAS, e por isso não se corre duas vezes: o
     que ela mede são as portas do mapa, e os estragos daquilo estão nas outras
     três. Uma segunda corrida sem plantas nenhumas era tempo a dizer zero. */
  { chave: 'mapa-navegacao', nome: 'o mapa é navegação', guiao: 'tests/inicio/mapa-navegacao.mjs', semPlantas: true },
];

const semCores = (s) => String(s ?? '').replace(/\[[0-9;]*m/g, '');
const corre = (args) =>
  spawnSync(process.execPath, args, { cwd: RAIZ, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'reguas-f11e-'));
const reguas = {};
let vermelhas = 0;

for (const r of REGUAS) {
  const destino = r.artefacto ?? path.join(tmp, `${r.chave}.json`);
  const comando = `node ${r.guiao} --json ${path.relative(RAIZ, destino)}`;
  const celulas = corre([path.join(RAIZ, r.guiao), '--json', destino]);
  let n = null;
  let falham = null;
  if (fs.existsSync(destino)) {
    const lido = JSON.parse(fs.readFileSync(destino, 'utf8'));
    const lista = lido.celulas ?? lido.reguas ?? [];
    n = lista.length;
    falham = lista.filter((c) => !(c.passa ?? c.verde ?? false)).length;
  }

  const plantas = r.semPlantas ? null : corre([path.join(RAIZ, r.guiao), '--vermelhos']);
  const texto = plantas ? semCores(`${plantas.stdout ?? ''}${plantas.stderr ?? ''}`) : '';
  const apanhadas = (texto.match(/vermelho ✓/g) ?? []).length;
  const escaparam = (texto.match(/NÃO APANHOU ✗/g) ?? []).length;

  if (celulas.status !== 0 || (plantas && plantas.status !== 0)) vermelhas++;
  reguas[r.chave] = {
    nome: r.nome,
    comandoDasCelulas: comando,
    comandoDasPlantas: plantas ? `node ${r.guiao} --vermelhos` : null,
    celulas: n,
    celulasQueFalham: falham,
    saidaDasCelulas: celulas.status,
    plantas: plantas ? apanhadas + escaparam : null,
    plantasApanhadas: plantas ? apanhadas : null,
    plantasQueEscaparam: plantas ? escaparam : null,
    saidaDasPlantas: plantas ? plantas.status : null,
  };
  console.log(
    `  ${r.chave.padEnd(15)} ${String(n).padStart(3)} células (${falham} falham, saída ${celulas.status}) · ` +
      (plantas
        ? `${apanhadas} de ${apanhadas + escaparam} plantas apanhadas (saída ${plantas.status})`
        : 'sem plantas'),
  );
}

fs.rmSync(tmp, { recursive: true, force: true });

const artefacto = JSON.parse(fs.readFileSync(SAIDA, 'utf8'));
artefacto.reguas = {
  _: 'O resumo das quatro réguas do bloco. Refaz-se com `node design/especime-v3/medicoes/resumo-das-reguas.mjs`.',
  medido: new Date().toISOString(),
  ...reguas,
};
fs.writeFileSync(SAIDA, `${JSON.stringify(artefacto, null, 2)}\n`);
console.log(`\n  escrito ${path.relative(RAIZ, SAIDA)}\n`);
process.exit(vermelhas === 0 ? 0 : 1);
