#!/usr/bin/env node
/* As medidas do bloco G1 (21.10.2026), escritas por guião: corre o inventário dos gráficos sobre o `dist/` da cabeça,
   a régua dos gráficos e as suas três plantas, e escreve `medidas.json` ao lado, com o nome, o valor, o comando e o
   conhecido-positivo de cada medida. Uso, da raiz da worktree, depois de `npm run build`:
   node design/especime-v3/medicoes/g1-2026-10-21/medir.mjs */
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const AQUI = 'design/especime-v3/medicoes/g1-2026-10-21';
const corre = (args) => {
  const r = spawnSync('node', args, { encoding: 'utf8' });
  return { codigo: r.status, cauda: (r.stdout + r.stderr).trim().split('\n').slice(-3) };
};
const versao = JSON.parse(readFileSync('dist/version.json', 'utf8'));
const inv = corre(['scripts/graficos-inventario.mjs', '--json', join(AQUI, 'inventario-depois.json')]);
const antes = JSON.parse(readFileSync(join(AQUI, 'inventario-antes.json'), 'utf8'));
const depois = JSON.parse(readFileSync(join(AQUI, 'inventario-depois.json'), 'utf8'));
const regua = corre(['tests/graficos/interacao.mjs']);
const plantas = Object.fromEntries(['sem-marca', 'aria-label', 'sem-guiao', 'serie-sem-camada', 'decorativo-sem-aria'].map((n) => [n, corre(['tests/graficos/interacao.mjs', '--plantar', n])]));
/* A contagem estrita recomposta das categorias, com a mesma regra para os dois inventários: um desenho sem leitura ao
   toque e sem os valores escritos nele. O campo `semToque` do inventário de antes foi escrito por uma primeira forma
   da regra (sem os valores escritos fora de um grupo), antes de o guião ganhar as categorias; por isso não se lê. */
const estrita = (inv) => Object.values(inv.componentes).reduce((s, k) => s + k.graficos - (k.categorias['valores-escritos'] ?? 0) - k.toque, 0);
const medidas = {
  cabeca_do_dist: versao.commit,
  medidas: [
    { nome: 'gráficos que escondem valores e não os mostram ao toque, antes', valor: antes.semToqueComValoresEscondidos, comando: 'node scripts/graficos-inventario.mjs --json inventario-antes.json (dist de a39afdc3b)', conhecido_positivo: 'o gráfico da inflação da primeira página (/), a I230' },
    { nome: 'gráficos que escondem valores e não os mostram ao toque, depois', valor: depois.semToqueComValoresEscondidos, comando: 'node scripts/graficos-inventario.mjs --json inventario-depois.json', conhecido_positivo: 'a contagem de antes, com o mesmo guião, deu mais de zero', codigo: inv.codigo },
    { nome: 'desenhos sem leitura ao toque e sem valores escritos (contagem estrita), antes', valor: estrita(antes), comando: 'recomposta de inventario-antes.json: Σ graficos − valores-escritos − toque', conhecido_positivo: 'o campo semToque de depois, escrito pelo guião, é igual à recomposta de depois' },
    { nome: 'desenhos sem leitura ao toque e sem valores escritos (contagem estrita), depois', valor: estrita(depois), campo_semToque_do_guiao: depois.semToque, comando: 'recomposta de inventario-depois.json', conhecido_positivo: 'idem' },
    { nome: 'desenhos por categoria, antes e depois', valor: [antes.porCategoria, depois.porCategoria], comando: 'campo porCategoria', conhecido_positivo: 'o gráfico da inflação de / está em valores-escondidos' },
    { nome: 'desenhos no dist, antes e depois', valor: [antes.graficos, depois.graficos], comando: 'idem, campo graficos', conhecido_positivo: 'idem' },
    { nome: 'séries no tempo por sítio e forma, depois (a correção G1-b)', valor: Object.fromEntries(Object.entries(depois.componentes).filter(([c]) => c.startsWith('SerieDoPais')).map(([c, k]) => [c, k.graficos])), comando: 'campo componentes de inventario-depois.json', conhecido_positivo: 'pela mesma classificação, o dist de a743d51be dá 32 séries de cartão e 2 de página sem leitura (inventario-a743d51be-corrigido.json)' },
    { nome: 'check:graficos na cabeça', valor: regua.codigo, cauda: regua.cauda, comando: 'node tests/graficos/interacao.mjs', conhecido_positivo: 'as cinco plantas abaixo saem com 1' },
    ...Object.entries(plantas).map(([n, r]) => ({ nome: `planta ${n}`, valor: r.codigo, cauda: r.cauda, comando: `node tests/graficos/interacao.mjs --plantar ${n}`, conhecido_positivo: 'morde quando sai com 1 e a cauda diz «mordeu»' })),
  ],
};
writeFileSync(join(AQUI, 'medidas.json'), JSON.stringify(medidas, null, 1) + '\n');
console.log(JSON.stringify(medidas.medidas.map((m) => [m.nome, m.valor])));
