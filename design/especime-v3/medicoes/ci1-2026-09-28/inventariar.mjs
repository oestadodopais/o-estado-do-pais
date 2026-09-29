#!/usr/bin/env node
/**
 * O INVENTÁRIO DO QUE CADA CONFERÊNCIA ABRE, ESCREVE E LÊ (bloco CI1,
 * 28.09.2026; as leituras e o cruzamento desde a passagem CI1b, pelo achado 6
 * da leitura a frio). Corre sozinha, uma de cada vez, cada conferência que
 * `scripts/verify-depois-do-build.mjs` corre (a mesma escolha, importada dele),
 * com a sonda ao lado (`sonda.mjs`, pelo `NODE_OPTIONS`), e escreve por
 * conferência:
 *
 *   - os servidores que abre e a porta que pede (0 é efémera);
 *   - os processos que lança, com os que não são Node à parte (a sonda não os
 *     vê por dentro: o Chromium, o `git`, o `cp`, o `python3`, o `sh`);
 *   - o que escreve: em `dist/`, no resto da raiz do sítio (caminho relativo),
 *     nas pastas temporárias do sistema (as que ela própria cria, com nome
 *     único), na casa e fora;
 *   - o que lê e o que consulta, por zona (`dist/`, `src/`, `design-system/`,
 *     as pastas temporárias, a casa...), e quantos dos seus processos Node não
 *     chegaram a escrever as leituras;
 *   - o `dist/` antes e depois, ficheiro a ficheiro (sha256), e o
 *     `git status --porcelain --ignored` antes e depois, que vê também o que um
 *     processo que não é Node escreve na árvore;
 *   - o código de saída, os segundos e a memória máxima (`/usr/bin/time -l`).
 *
 * E O CRUZAMENTO: para cada par de conferências diferentes, o que uma escreve
 * contra o que a outra lê ou consulta (o mesmo caminho, um caminho dentro de
 * uma pasta escrita, ou a listagem de uma pasta onde a outra escreve). O
 * registo que o próprio npm escreve em `<casa>/.npm/_logs` fica de fora, com a
 * razão: é do npm e não de uma conferência, e nenhuma conferência o lê. As
 * listas inteiras (o que cada conferência escreve, lê e consulta) ficam num
 * ficheiro comprimido ao lado da saída, para o cruzamento se poder refazer sem
 * esta máquina.
 *
 * A sonda prova primeiro que vê: o `check:cabeca` abre um servidor, um
 * Chromium e uma pasta temporária, e lê páginas de `dist/`; se a sonda não vir
 * os quatro, o inventário sai com 2 antes de escrever o que quer que seja.
 *
 * Os caminhos da casa reduzem-se à primeira pasta, quando é das escondidas das
 * ferramentas, e ao nome do ficheiro, para nenhum levar a disposição da
 * máquina; o cruzamento faz-se sobre esses caminhos reduzidos, que são os que
 * ficam guardados, e juntar caminhos só pode criar contactos a mais.
 *
 * Uso: node inventariar.mjs <saida.json>   (escreve também <saida>.leituras.json.gz)
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..', '..');
const { restantesDoVerify } = await import(path.join(RAIZ, 'scripts', 'verify-depois-do-build.mjs'));
const saida = process.argv[2];
if (!saida) {
  console.error('uso: node inventariar.mjs <saida.json>');
  process.exit(2);
}
const DIST = path.join(RAIZ, 'dist');
const TMPS = [...new Set([os.tmpdir(), fs.realpathSync(os.tmpdir()), '/tmp', '/private/tmp', '/var/folders', '/private/var/folders'])];
const CASA = os.homedir();
const RAIZES = [...new Set([RAIZ, fs.realpathSync(RAIZ)])];

function resumos() {
  const m = new Map();
  const anda = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) anda(p);
      else if (e.isFile()) m.set(path.relative(DIST, p), crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'));
    }
  };
  anda(DIST);
  return m;
}
const estado = () => execFileSync('git', ['status', '--porcelain', '--ignored', '--untracked-files=all'], { cwd: RAIZ, encoding: 'utf8', maxBuffer: 64 * 2 ** 20 })
  .split('\n').filter((l) => l && !/^!! (dist|node_modules)\//.test(l));

/**
 * Um caminho, sem nada da máquina: relativo à raiz do sítio, ou com a marca
 * da pasta temporária ou da casa à frente.
 * @param {string} p
 */
function normaliza(p) {
  if (!p) return '<desconhecido>';
  const abs = path.isAbsolute(p) ? path.normalize(p) : path.resolve(RAIZ, p);
  for (const r of RAIZES) if (abs === r || abs.startsWith(r + path.sep)) return path.relative(r, abs) || '.';
  for (const t of TMPS.sort((a, b) => b.length - a.length)) if (abs === t || abs.startsWith(t + path.sep)) return `<tmp>/${path.relative(t, abs)}`;
  /* NA CASA, SÓ O QUE NÃO DIZ NADA DA MÁQUINA: a primeira pasta quando é das
     escondidas das ferramentas (`.npm`, `.nvm`) e o nome do ficheiro. Juntar
     caminhos diferentes numa chave só pode criar um contacto a mais no
     cruzamento, nunca esconder um que exista. */
  if (abs === CASA || abs.startsWith(CASA + path.sep)) {
    const partes = path.relative(CASA, abs).split(path.sep);
    const primeira = partes[0]?.startsWith('.') ? partes[0] : '…';
    return partes.length === 1 ? `<casa>/${partes[0].startsWith('.') ? partes[0] : `…/${partes[0]}`}` : `<casa>/${primeira}/…/${partes[partes.length - 1]}`;
  }
  /* Fora da raiz, das pastas temporárias e da casa, só o nome do ficheiro (o npm procura um `package.json` em cada pasta acima da raiz). */
  return `<fora>/…/${path.basename(abs)}`;
}
/** A zona de um caminho normalizado, para as contagens. */
function zona(n) {
  if (n.startsWith('<tmp>/')) return '<tmp>';
  if (n.startsWith('<casa>/')) return n.startsWith('<casa>/.npm/') || n === '<casa>/.npm' ? '<casa>/.npm' : '<casa>';
  if (n.startsWith('<fora>/')) return '<fora>';
  if (n === '.' || !n.includes('/')) return '(raiz)';
  return `${n.split('/')[0]}/`;
}

function corre(passo, registo) {
  fs.writeFileSync(registo, '');
  const t0 = Date.now();
  const r = spawnSync('/usr/bin/time', ['-l', 'sh', '-c', passo], {
    cwd: RAIZ,
    env: { ...process.env, OEDP_SONDA_REGISTO: registo, NODE_OPTIONS: `--import=${path.join(AQUI, 'sonda.mjs')}` },
    encoding: 'utf8',
    maxBuffer: 256 * 2 ** 20,
  });
  const segundos = (Date.now() - t0) / 1000;
  const memoria = /(\d+)\s+maximum resident set size/.exec(r.stderr ?? '');
  const eventos = fs.readFileSync(registo, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
  return { codigo: r.status, segundos, memoria_max_mib: memoria ? Math.round(Number(memoria[1]) / 2 ** 20) : null, eventos };
}

/** O que uma conferência fez, a partir dos acontecimentos da sonda. */
function resume(eventos) {
  const servidores = eventos.filter((e) => e.tipo === 'servidor').map((e) => ({ porta: e.porta, anfitriao: e.anfitriao }));
  const processos = eventos.filter((e) => e.tipo === 'processo').map((e) => e.comando);
  const naoNode = {};
  for (const c of processos) {
    const exe = path.basename(c.split(' ')[0]);
    if (/node$/.test(exe) || /npm/.test(c.split(' ')[0])) continue;
    const k = /chrom|headless_shell/i.test(c) ? 'chromium' : exe;
    naoNode[k] = (naoNode[k] ?? 0) + 1;
  }
  const escreve = new Set();
  const criadas = new Set();
  for (const e of eventos.filter((x) => x.tipo === 'escrita')) {
    for (const p of [e.caminho, e.destino].filter(Boolean)) escreve.add(normaliza(p));
    if (e.criado) criadas.add(normaliza(e.criado));
  }
  const le = new Set();
  const consulta = new Set();
  for (const e of eventos.filter((x) => x.tipo === 'leituras')) {
    for (const p of e.le) le.add(normaliza(p));
    for (const p of e.consulta) consulta.add(normaliza(p));
  }
  const comInicio = new Set(eventos.filter((x) => x.tipo === 'inicio').map((x) => x.pid));
  const comLeituras = new Set(eventos.filter((x) => x.tipo === 'leituras').map((x) => x.pid));
  const porZona = (conj) => {
    const z = {};
    for (const n of conj) z[zona(n)] = (z[zona(n)] ?? 0) + 1;
    return z;
  };
  return {
    servidores,
    chromium: naoNode.chromium ?? 0,
    processos_que_nao_sao_node: naoNode,
    escritas_em_dist: [...escreve].filter((n) => n.startsWith('dist/')).sort(),
    escritas_na_raiz: [...escreve].filter((n) => !n.startsWith('<') && !n.startsWith('dist/')).sort(),
    escritas_em_tmp: [...escreve].filter((n) => n.startsWith('<tmp>/')).length,
    pastas_temporarias_criadas: [...criadas].map((n) => path.basename(n).replace(/[A-Za-z0-9]{6}$/, 'XXXXXX')).sort(),
    escritas_na_casa: [...new Set([...escreve].filter((n) => n.startsWith('<casa>/')).map((n) => n.split('/').slice(0, 3).join('/')))].sort(),
    escritas_fora: [...escreve].filter((n) => n.startsWith('<fora>/')).sort(),
    leituras_por_zona: porZona(le),
    consultas_por_zona: porZona(consulta),
    processos_node: comInicio.size,
    processos_node_sem_leituras: [...comInicio].filter((p) => !comLeituras.has(p)).length,
    _listas: { escreve: [...escreve].sort(), cria: [...criadas].sort(), le: [...le].sort(), consulta: [...consulta].sort() },
  };
}

/** O que a escrita de uma toca na leitura da outra: o mesmo caminho, um caminho dentro, ou a listagem da pasta. */
function toca(escrito, lido) {
  return escrito === lido || lido.startsWith(`${escrito}/`) || escrito.startsWith(`${lido}/`);
}
/* O registo do próprio npm (um ficheiro por chamada, e a limpeza dos antigos)
   é do npm e não de uma conferência: fica fora do cruzamento, e diz-se. */
const FORA_DO_CRUZAMENTO = (n) => n.startsWith('<casa>/.npm/') || n === '<casa>/.npm' || n === '<casa>';

/* A SONDA PROVA PRIMEIRO QUE VÊ. */
const reg0 = path.join(os.tmpdir(), `oedp-ci1-sonda-${process.pid}.jsonl`);
const cp0 = resume(corre('npm run check:cabeca', reg0).eventos);
fs.rmSync(reg0, { force: true });
const cpOk = cp0.servidores.length >= 1 && cp0.chromium >= 1 && cp0.pastas_temporarias_criadas.some((n) => n.startsWith('oedp-cabeca-')) && (cp0.leituras_por_zona['dist/'] ?? 0) > 0;
if (!cpOk) {
  console.error('a sonda não viu o servidor, o Chromium, a pasta temporária e as leituras de dist/ do check:cabeca:', JSON.stringify({ ...cp0, _listas: undefined }));
  process.exit(2);
}

const scripts = JSON.parse(fs.readFileSync(path.join(RAIZ, 'package.json'), 'utf8')).scripts;
const restantes = restantesDoVerify(scripts);
const linhas = [];
for (const passo of restantes) {
  const distAntes = resumos();
  const gitAntes = estado();
  const reg = path.join(os.tmpdir(), `oedp-ci1-sonda-${process.pid}.jsonl`);
  const r = corre(passo, reg);
  fs.rmSync(reg, { force: true });
  const distDepois = resumos();
  const gitDepois = estado();
  const mudouDist = [...distAntes].filter(([k, h]) => distDepois.get(k) !== h).map(([k]) => k)
    .concat([...distDepois.keys()].filter((k) => !distAntes.has(k)));
  const antesSet = new Set(gitAntes);
  const depoisSet = new Set(gitDepois);
  const linha = {
    passo,
    codigo: r.codigo,
    segundos: r.segundos,
    memoria_max_mib: r.memoria_max_mib,
    ...resume(r.eventos),
    dist_mudou: mudouDist.slice(0, 20),
    git_antes_e_nao_depois: gitAntes.filter((l) => !depoisSet.has(l)),
    git_depois_e_nao_antes: gitDepois.filter((l) => !antesSet.has(l)),
  };
  linhas.push(linha);
  console.log(`${linha.codigo === 0 ? '✓' : '✗'} ${passo} · ${r.segundos.toFixed(1)} s · ${linha.memoria_max_mib} MiB · servidores ${linha.servidores.length} · chromium ${linha.chromium} · escreve na raiz ${linha.escritas_na_raiz.length} · lê ${Object.entries(linha.leituras_por_zona).map(([z, n]) => `${z}${n}`).join(' ')} · processos Node ${linha.processos_node} (${linha.processos_node_sem_leituras} sem leituras)`);
}

/* O CRUZAMENTO: o que cada uma escreve contra o que cada outra lê ou consulta. */
const cruzamentos = [];
for (const a of linhas) {
  const escritos = a._listas.escreve.filter((n) => !FORA_DO_CRUZAMENTO(n));
  for (const b of linhas) {
    if (a === b) continue;
    const lidos = [...b._listas.le, ...b._listas.consulta].filter((n) => !FORA_DO_CRUZAMENTO(n));
    const achados = [];
    for (const e of escritos) for (const l of lidos) if (toca(e, l)) achados.push({ escrito: e, lido: l });
    if (achados.length) cruzamentos.push({ escreve: a.passo, le: b.passo, casos: achados.slice(0, 10), total: achados.length });
  }
}
const leitoresDoFeixe = linhas
  .filter((c) => c.passo !== 'npm run design:feixe')
  .filter((c) => [...c._listas.le, ...c._listas.consulta].some((n) => n === 'design-system' || n.startsWith('design-system/')))
  .map((c) => c.passo);

/* O que a sonda não vê por dentro, e o que se sabe dele por outra via: o
   `python3` do `check:briefs`, lido no código (nenhum dos seus guiões nomeia
   `design-system`). */
const guioesPython = [path.join(RAIZ, 'scripts', 'check-briefs.py'), ...fs.readdirSync(path.join(RAIZ, 'scripts', 'leituras')).filter((f) => f.endsWith('.py')).map((f) => path.join(RAIZ, 'scripts', 'leituras', f)),
  ...fs.readdirSync(path.join(RAIZ, 'design', 'observatorio', 'medidas')).filter((f) => f.endsWith('.py')).map((f) => path.join(RAIZ, 'design', 'observatorio', 'medidas', f))];
const pythonQueNomeia = guioesPython.filter((f) => fs.readFileSync(f, 'utf8').includes('design-system')).map((f) => path.relative(RAIZ, f));
const conhecidoPositivoDoPython = fs.readFileSync(path.join(RAIZ, 'scripts', 'design-bundle.mjs'), 'utf8').includes('design-system');

const listas = Object.fromEntries(linhas.map((c) => [c.passo, c._listas]));
const zipado = zlib.gzipSync(Buffer.from(JSON.stringify({ o_que: 'o que cada conferência escreveu, criou, leu e consultou, pela sonda, com os caminhos sem nada da máquina', listas }) + '\n'), { level: 9 });
fs.writeFileSync(`${saida.replace(/\.json$/, '')}.leituras.json.gz`, zipado);

fs.writeFileSync(saida, JSON.stringify({
  cabeca: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: RAIZ, encoding: 'utf8' }).trim(),
  maquina: { processador: os.cpus()[0]?.model ?? null, nucleos: os.availableParallelism?.() ?? os.cpus().length },
  conhecido_positivo: { o_que: 'o check:cabeca abre um servidor, um Chromium e uma pasta oedp-cabeca-, e lê páginas de dist/', visto: { ...cp0, _listas: undefined } },
  conferencias: linhas.map(({ _listas, ...resto }) => resto),
  cruzamento: {
    o_que: 'para cada par de conferências diferentes, os caminhos que uma escreve e a outra lê ou consulta (o mesmo, um dentro do outro, ou a listagem da pasta); o registo do npm na casa fica de fora',
    pares_com_contacto: cruzamentos.length,
    pares: cruzamentos,
    leitores_de_design_system: leitoresDoFeixe,
    processos_node_sem_leituras: linhas.reduce((a, c) => a + c.processos_node_sem_leituras, 0),
    python: { guioes_lidos: guioesPython.length, que_nomeiam_design_system: pythonQueNomeia, conhecido_positivo: { o_que: 'o mesmo detetor acha design-system em scripts/design-bundle.mjs', encontrado: conhecidoPositivoDoPython } },
    listas_comprimidas: path.basename(`${saida.replace(/\.json$/, '')}.leituras.json.gz`),
    sha256_das_listas: crypto.createHash('sha256').update(zipado).digest('hex'),
  },
}, null, 1) + '\n');
console.log(`cruzamento: ${cruzamentos.length} par(es) com contacto · leitores de design-system/: ${leitoresDoFeixe.length} · processos Node sem leituras: ${linhas.reduce((a, c) => a + c.processos_node_sem_leituras, 0)} · guiões python que nomeiam design-system: ${pythonQueNomeia.length} de ${guioesPython.length}`);
