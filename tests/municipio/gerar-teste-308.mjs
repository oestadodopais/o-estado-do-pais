#!/usr/bin/env node
/**
 * O FICHEIRO DE TESTE DOS 308, COM TODAS AS LINHAS A `null`.
 *
 * ---------------------------------------------------------------------------
 * PORQUE EXISTE, E PORQUE O QUE ELE ESCREVE NÃO ENTRA NO REPOSITÓRIO
 * ---------------------------------------------------------------------------
 * O ficheiro `src/data/concelhos.gerado.json` é escrito pelo exportador do
 * motor, com o id de cada linha do livro-razão. Enquanto essas linhas não
 * existirem, não há ficheiro nenhum — e **o repositório não leva um ficheiro
 * gerado sem dados**: um ficheiro com 308 entradas e 2 464 campos por preencher
 * seria uma promessa de dados que não estão lá.
 *
 * O que este programa escreve é a ESTRUTURA sem os dados: os 308 concelhos da
 * Carta, com o slug que `slugsDaCarta()` lhes dá, o nome e o distrito ou ilha
 * que a Carta lhes dá, e **todas as `linhas` a `null`**. É o estado honesto da
 * Emenda 14 — cada uma das sete peças diz «sem linha ainda» — e não é dado
 * inventado: não há aqui um único algarismo que não venha da Carta.
 *
 * O `dico` fica a `null`, e é a mesma regra: o código do INE de cada concelho é
 * um facto, este repositório não o guarda, e escrevê-lo aqui seria inventá-lo.
 * O sítio não o rende; quem o escreve é o motor, com a tabela que verificou.
 *
 * ---------------------------------------------------------------------------
 * COMO SE USA
 * ---------------------------------------------------------------------------
 *   node tests/municipio/gerar-teste-308.mjs <caminho.json>
 *   CONCELHOS_GERADO=<caminho.json> npm run build
 *
 * O caminho é obrigatório e tem de ficar FORA de `src/data/`: este programa
 * recusa escrever lá dentro, porque um ficheiro de teste em `src/data/` é um
 * ficheiro gerado no repositório com outro nome.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { MUNICIPIOS, DISTRITOS } from '../../src/data/caop-centroids.mjs';
import { slugsDaCarta } from '../../src/lib/inicio.mjs';
import { MEDIDAS_DO_CONCELHO } from '../../src/data/concelhos.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DADOS = path.join(RAIZ, 'src', 'data');

const destino = process.argv[2];
if (!destino) {
  console.error('uso: node tests/municipio/gerar-teste-308.mjs <caminho.json>');
  process.exit(1);
}
const absoluto = path.resolve(process.cwd(), destino);
if (absoluto.startsWith(DADOS + path.sep)) {
  console.error(
    `recusado: "${absoluto}" está dentro de src/data/. O ficheiro de teste vive fora do ` +
      'repositório, e quem escreve src/data/concelhos.gerado.json é o exportador do motor.',
  );
  process.exit(1);
}

const slugs = slugsDaCarta();
const linhasVazias = Object.fromEntries(MEDIDAS_DO_CONCELHO.map((m) => [m.chave, null]));

const lista = MUNICIPIOS.map((m, i) => ({
  slug: slugs[i],
  nome: m[0],
  distritoOuIlha: DISTRITOS[m[1]],
  ilha: /^Ilha\b/.test(DISTRITOS[m[1]]),
  dico: null,
  caopIndex: i,
  linhas: { ...linhasVazias },
}));

fs.mkdirSync(path.dirname(absoluto), { recursive: true });
fs.writeFileSync(absoluto, `${JSON.stringify(lista, null, 2)}\n`, 'utf8');

const repetidos = lista.length - new Set(lista.map((c) => c.slug)).size;
console.log(
  `  ${lista.length} concelhos escritos em ${absoluto} · ${repetidos} slug(s) repetido(s) · ` +
    `${Object.keys(linhasVazias).length} medidas por entrada, todas a null`,
);
