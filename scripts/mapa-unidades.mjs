#!/usr/bin/env node
/**
 * =============================================================================
 * O SEGUNDO NÍVEL DO MAPA: OS CONCELHOS DE CADA UNIDADE, ONDE O NAVEGADOR OS PEDE
 * =============================================================================
 *
 * Escreve `public/dados/mapa/unidade-<slug>.json`, um por cada uma das 29
 * unidades da Carta, com os bytes EXACTOS de `mapa/distritos/<slug>.json`.
 *
 * ---------------------------------------------------------------------------
 * PORQUE É UMA CÓPIA E NÃO UM CÁLCULO (F1.1e, 08.09.2026)
 * ---------------------------------------------------------------------------
 * O bloco anterior (F1.1d) tinha de CALCULAR o segundo nível: as nove regiões
 * NUTS II não existem em artefacto nenhum, e os concelhos de uma região vinham
 * de unidades diferentes, cada uma desenhada na sua grelha local, que era
 * preciso levar ao campo do país e daí à grelha da região. Eram 49 KB de
 * gerador e três regras de portão para provar que a conta estava certa.
 *
 * O nível da unidade não precisa de conta nenhuma: os concelhos de um distrito
 * ou de uma ilha JÁ ESTÃO desenhados juntos, na grelha daquela unidade, no
 * ficheiro que o motor exportou. O segundo nível do mapa é, byte a byte, o
 * artefacto que a página do distrito já desenha. A única coisa que falta é ele
 * estar onde o navegador o pode pedir, que é `public/`.
 *
 * POR ISSO A CONFERÊNCIA É A MAIS FORTE QUE HÁ: o ficheiro servido é igual ao
 * artefacto, byte a byte, e o artefacto é conferido pelo seu resumo sha256 no
 * manifesto do motor (regra R1 do portão do mapa). Não há aqui uma segunda
 * geometria a poder divergir da primeira.
 *
 * ---------------------------------------------------------------------------
 * PORQUE NÃO SE SERVE `mapa/` DIRECTAMENTE
 * ---------------------------------------------------------------------------
 * `mapa/` é a pasta de chegada do exportador do motor, na raiz do repositório, e
 * a fronteira da casa (DECISIONS §1.31) diz que o sítio a LÊ e não a habita. A
 * pasta que o Astro serve é `public/`, e é uma só. Copiar na construção é o que
 * põe o artefacto onde o navegador o pede sem mudar de quem ele é.
 *
 * ---------------------------------------------------------------------------
 * O USO
 * ---------------------------------------------------------------------------
 *   npm run mapa:unidades              escreve os 29 ficheiros
 *   npm run mapa:unidades -- --verifica  confere sem escrever (está no `verify`)
 *
 * Uma diferença no `git status` depois de uma construção é sempre um artefacto
 * do motor que mudou.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ficheiroDaUnidade } from '../src/lib/mapa.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MAPA = path.join(RAIZ, 'mapa');
const SAIDA = path.join(RAIZ, 'public', 'dados', 'mapa');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

const VERIFICA = process.argv.includes('--verifica');

/* O NOME DO FICHEIRO SERVIDO COMPÕE-SE NUM SÍTIO SÓ, `src/lib/mapa.mjs`, que é
   o mesmo de onde o componente do mapa o lê para o pôr na área. Escrevê-lo aqui
   também era a segunda cópia a divergir da primeira à primeira emenda. */

function falha(linhas) {
  console.error(vermelho('\n  MAPA DAS UNIDADES · ') + linhas[0]);
  for (const l of linhas.slice(1)) console.error('  ' + l);
  console.error('');
  process.exit(1);
}

if (!fs.existsSync(path.join(MAPA, 'pais.json'))) {
  falha([
    'não existe mapa/pais.json.',
    cinza('Os artefactos vêm do motor (python3 publisher/mapa_distritos.py --write).'),
  ]);
}

const pais = JSON.parse(fs.readFileSync(path.join(MAPA, 'pais.json'), 'utf8'));
const unidades = Array.isArray(pais.unidades) ? pais.unidades : [];
if (unidades.length === 0) falha(['mapa/pais.json não traz unidades.']);

/* AS 29 SÃO AS DO PAÍS, E A LISTA NÃO SE ESCREVE AQUI: um segundo lugar com os
   slugs das unidades era a lista a divergir do artefacto à primeira alteração. */
const erros = [];
let escritos = 0;
let bytes = 0;
const feitos = [];

for (const u of unidades) {
  const origem = path.join(MAPA, 'distritos', `${u.slug}.json`);
  if (!fs.existsSync(origem)) {
    erros.push(`falta mapa/distritos/${u.slug}.json, que é o segundo nível de ${u.nome}.`);
    continue;
  }
  const bruto = fs.readFileSync(origem);
  /* A FORMA CONFERE-SE ANTES DE COPIAR, e não depois: o que se serve tem de ter
     o campo e os concelhos com nome, slug e caminho, que é o que o guião lê. */
  let lido;
  try {
    lido = JSON.parse(bruto.toString('utf8'));
  } catch {
    erros.push(`mapa/distritos/${u.slug}.json não é JSON.`);
    continue;
  }
  const bem =
    lido &&
    lido.campo &&
    typeof lido.campo.largura === 'number' &&
    typeof lido.campo.altura === 'number' &&
    Array.isArray(lido.concelhos) &&
    lido.concelhos.length > 0 &&
    lido.concelhos.every(
      (c) => typeof c.slug === 'string' && typeof c.nome === 'string' && typeof c.d === 'string',
    );
  if (!bem) {
    erros.push(`mapa/distritos/${u.slug}.json não traz campo e concelhos com slug, nome e d.`);
    continue;
  }
  const destino = path.join(RAIZ, 'public', ficheiroDaUnidade(u.slug));
  const igual = fs.existsSync(destino) && fs.readFileSync(destino).equals(bruto);
  if (!igual) {
    if (VERIFICA) {
      erros.push(
        `public/${ficheiroDaUnidade(u.slug)} ${fs.existsSync(destino) ? 'não é' : 'não existe e tem de ser'} ` +
          `igual a mapa/distritos/${u.slug}.json.`,
      );
    } else {
      fs.mkdirSync(SAIDA, { recursive: true });
      fs.writeFileSync(destino, bruto);
      escritos++;
    }
  }
  bytes += bruto.length;
  feitos.push({ slug: u.slug, concelhos: lido.concelhos.length, bytes: bruto.length });
}

/* ---------------------------------------------------------------------------
 * DE QUEM É ESTA PASTA (F1.1e, segunda passagem, 08.09.2026)
 * ---------------------------------------------------------------------------
 * A primeira forma disto apagava, em modo de escrita, TUDO o que estivesse em
 * `public/dados/mapa/` e não fosse uma das 29 unidades. A pasta não é deste
 * bloco: é a pasta dos dados do mapa que o sítio serve, e um artefacto que lá
 * viesse a viver com outro nome desaparecia em silêncio na construção seguinte,
 * sem uma linha a dizê-lo (leitura a frio do Codex de 08.09.2026, achado 11).
 *
 * A REGRA PASSA A SER O PADRÃO, e é a mesma da regra R8 do portão do mapa: este
 * gerador e aquela regra são donos de `unidade-*.json` e de mais nada.
 *
 *   · um `unidade-*.json` que não seja de uma das 29 SAI, com a linha a dizê-lo
 *     (é geometria servida que ninguém desenha, e um leitor que a peça pelo
 *     endereço recebe-a);
 *   · qualquer outro ficheiro da pasta NÃO SE TOCA NEM SE CONTA.
 *
 * O conhecido-positivo está na célula U11 de `tests/inicio/mapa-unidades.mjs`,
 * e é em disco: um ficheiro estranho na pasta sobrevive ao gerador e ao portão,
 * e um `unidade-*.json` a mais sai com a linha.
 */
const NOSSO = /^unidade-.*\.json$/;
const apagados = [];
if (fs.existsSync(SAIDA)) {
  const querem = new Set(unidades.map((u) => `unidade-${u.slug}.json`));
  for (const nome of fs.readdirSync(SAIDA)) {
    if (!NOSSO.test(nome) || querem.has(nome)) continue;
    if (VERIFICA) erros.push(`public/dados/mapa/${nome} não corresponde a unidade nenhuma.`);
    else {
      fs.unlinkSync(path.join(SAIDA, nome));
      apagados.push(nome);
    }
  }
}

if (erros.length) {
  falha([
    `${erros.length} ${erros.length === 1 ? 'diferença' : 'diferenças'} entre os artefactos e o que se serve:`,
    ...erros.map((e) => cinza('· ') + e),
    '',
    cinza('Escreve-se com `npm run mapa:unidades`.'),
  ]);
}

const concelhos = feitos.reduce((n, f) => n + f.concelhos, 0);
console.log(
  verde('  ✓ mapa das unidades · ') +
    `${feitos.length} ficheiros · ${concelhos} concelhos · ` +
    `${bytes.toLocaleString('pt-PT')} B em public/dados/mapa/ · ` +
    (VERIFICA ? 'conferidos' : escritos === 0 ? 'nenhum mudou' : `${escritos} escritos`),
);
/* UM FICHEIRO APAGADO NUNCA É SILENCIOSO. */
for (const nome of apagados) {
  console.log(
    cinza('    · ') +
      `public/dados/mapa/${nome} não corresponde a unidade nenhuma da Carta: apagado.`,
  );
}
