#!/usr/bin/env node
/**
 * RP4-m, ponto 2 do mandato: o que os portões dizem quando a linha do índice
 * harmonizado de Portugal passa para o último ponto da sua série.
 *
 * Corre sobre uma CÓPIA de `ledger/` (com `src/` e `public/` ligados) numa pasta
 * temporária de nome único, e não toca em nada da árvore. Três corridas do `ledger:check`
 * (pela porta `OEDP_LEDGER_DIR` que a casa já usa):
 *
 *   controlo   a cópia intacta, que tem de sair a 0;
 *   item2      a linha `ihpc-variacao-homologa` no ponto 2026-09 da série
 *              (o valor, a marca «e» e a nota que a casa já usa para ela, o
 *              excerto da linha com o mês novo, e `serie:`), e a linha do
 *              período anterior no ponto 2026-08, como o mandato manda;
 *   regua      a régua declarada do cartão (`conferirReguaDeclarada`) sobre a
 *              mesma cópia, chamada noutro processo.
 *
 * Escreve `item2.json` ao lado, com os códigos e as linhas de erro que cada
 * corrida imprimiu. Uso: node design/especime-v3/medicoes/rp4m-2026-10-05/medir-item2.mjs
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '../../../..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rp4m-item2-'));

function copia(nome) {
  const pasta = path.join(tmp, nome, 'ledger');
  fs.mkdirSync(path.join(tmp, nome), { recursive: true });
  fs.cpSync(path.join(RAIZ, 'ledger'), pasta, { recursive: true });
  for (const ligado of ['public', 'src']) fs.symlinkSync(path.join(RAIZ, ligado), path.join(tmp, nome, ligado), 'dir');
  fs.symlinkSync(path.join(RAIZ, 'site.config.mjs'), path.join(tmp, nome, 'site.config.mjs'), 'file');
  return path.join(pasta, 'claims');
}

function corre(claims, args) {
  const r = spawnSync(process.execPath, args, {
    cwd: RAIZ, encoding: 'utf8', env: { ...process.env, OEDP_LEDGER_DIR: claims },
    maxBuffer: 64 * 1024 * 1024,
  });
  const saida = `${r.stdout}\n${r.stderr}`.replace(/\x1b\[[0-9;]*m/g, '');
  return { codigo: r.status, saida };
}

function troca(texto, campo, valor) {
  const re = new RegExp(`^${campo}: .*$`, 'm');
  if (!re.test(texto)) throw new Error(`o campo ${campo} não está na linha`);
  return texto.replace(re, `${campo}: ${JSON.stringify(valor)}`);
}

const lerSerie = (claims) => fs.readFileSync(path.join(path.dirname(claims), 'series', 'serie-ihpc-variacao-homologa.yml'), 'utf8');

// O controlo: a cópia intacta.
const cControlo = copia('controlo');
const controlo = corre(cControlo, ['scripts/check-ledger.mjs']);

// O ponto 2: a linha portuguesa no último ponto da série, e a do período anterior no ponto antes dele.
const cItem2 = copia('item2');
const serie = lerSerie(cItem2);
const pontos = [...serie.matchAll(/^  - periodo: "([^"]+)"\n    valor: "([^"]+)"\n    excerto: (.*)\n    bandeira: (.*)$/gm)]
  .map((m) => ({ periodo: m[1], valor: m[2], bandeira: m[4] === 'null' ? null : JSON.parse(m[4]) }));
const ultimo = pontos.at(-1), penultimo = pontos.at(-2);
const linha = path.join(cItem2, 'ihpc-variacao-homologa.yml');
let t = fs.readFileSync(linha, 'utf8');
const excertoAntes = /^excerpt: "(.*)"$/m.exec(t)[1];
const excertoDepois = excertoAntes.replace(/— (\d{4}-\d{2}): ([^ "]+)$/, `— ${ultimo.periodo}: ${ultimo.valor.replace(',', '.')}${ultimo.bandeira ? ` ${ultimo.bandeira}` : ''}`);
t = troca(t, 'reference_date', ultimo.periodo);
t = troca(t, 'value', ultimo.valor);
t = troca(t, 'excerpt', excertoDepois);
t = t.replace(/^reference_date: .*$/m, (l) => `${l}\nserie: "serie-ihpc-variacao-homologa"`);
if (ultimo.bandeira) {
  t = t.replace(/^excerpt: .*$/m, (l) => `${l}\nsource_flag: "${ultimo.bandeira}"\nsource_flag_note: "valor estimado"\nsource_flag_note_en: "estimated value"`);
}
fs.writeFileSync(linha, t);
const anterior = path.join(cItem2, 'ihpc-variacao-homologa-periodo-anterior.yml');
let a = fs.readFileSync(anterior, 'utf8');
const exA = /^excerpt: "(.*)"$/m.exec(a)[1];
a = troca(a, 'reference_date', penultimo.periodo);
a = troca(a, 'value', penultimo.valor);
a = troca(a, 'excerpt', exA.replace(/— (\d{4}-\d{2}): ([^ "]+)$/, `— ${penultimo.periodo}: ${penultimo.valor.replace(',', '.')}`));
fs.writeFileSync(anterior, a);
const linhaEscrita = fs.readFileSync(linha, 'utf8').split('\n').filter((l) => /^(value|reference_date|serie|excerpt|source_flag|source_flag_note|source_flag_note_en): /.test(l));
const anteriorEscrita = fs.readFileSync(anterior, 'utf8').split('\n').filter((l) => /^(value|reference_date|excerpt): /.test(l));
const item2 = corre(cItem2, ['scripts/check-ledger.mjs']);

// A régua declarada do cartão, sobre a mesma cópia.
const regua = corre(cItem2, ['--input-type=module', '-e', `
  import { REGUAS_DECLARADAS, conferirReguaDeclarada } from './src/lib/enquadramento.mjs';
  try { conferirReguaDeclarada('ihpc-variacao-homologa', REGUAS_DECLARADAS['ihpc-variacao-homologa']); console.log('régua: passa'); }
  catch (e) { console.log('régua: ' + e.message); process.exit(1); }
`]);
// As regras das séries chamadas diretamente sobre a cópia, sem passar pela regra da marca das linhas,
// para se ver o que a faixa dos 27 (a série de países) diz da linha portuguesa num período que já não é o dela.
const programaDasSeries = `
  import { lerSeries, validateSeries, paisesDaUniao } from './src/lib/series.mjs';
  import { loadClaims } from './src/lib/ledger.mjs';
  const leitura = lerSeries();
  const r = validateSeries({ series: leitura.series, claims: loadClaims(), paises: paisesDaUniao() });
  console.log(JSON.stringify(r.errors));
  process.exit(r.errors.length ? 1 : 0);
`;
const seriesItem2 = corre(cItem2, ['--input-type=module', '-e', programaDasSeries]);
const seriesControlo = corre(cControlo, ['--input-type=module', '-e', programaDasSeries]);
// O lado do motor: a travessia das séries (`publisher/export_series.py`, sem `--write`) apontada à cópia.
// O motor nomeia-se por `RESEARCHHUB_DIR`, como no `check:series`; sem ele, a medida diz que não correu.
function travessia(claims) {
  const motor = process.env.RESEARCHHUB_DIR;
  if (!motor) return { codigo: null, saida: 'RESEARCHHUB_DIR não está definido: a travessia do motor não correu' };
  const r = spawnSync('python3', [path.join(motor, 'publisher', 'export_series.py'), '--site', path.dirname(path.dirname(claims))],
    { cwd: motor, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  // Nenhum caminho desta máquina no registo: a pasta temporária escreve-se «<cópia>».
  const linhas = `${r.stdout}\n${r.stderr}`.trim().split('\n').filter((l) => /EXPORT_SERIES/.test(l));
  return { codigo: r.status, saida: linhas.join('\n').split(tmp).join('<cópia>').split(motor).join('<motor>') };
}
const travessiaItem2 = travessia(cItem2);
const travessiaControlo = travessia(cControlo);
const reguaControlo = corre(cControlo, ['--input-type=module', '-e', `
  import { REGUAS_DECLARADAS, conferirReguaDeclarada } from './src/lib/enquadramento.mjs';
  try { conferirReguaDeclarada('ihpc-variacao-homologa', REGUAS_DECLARADAS['ihpc-variacao-homologa']); console.log('régua: passa'); }
  catch (e) { console.log('régua: ' + e.message); process.exit(1); }
`]);

const linhasDe = (s, re) => s.split('\n').map((l) => l.trim()).filter((l) => re.test(l));
const saida = {
  o_que: 'RP4-m, ponto 2: a linha ihpc-variacao-homologa posta no último ponto da sua série, numa cópia do livro',
  ultimo_ponto_da_serie: ultimo,
  ponto_anterior_da_serie: penultimo,
  controlo: { codigo: controlo.codigo, ultima_linha: controlo.saida.trim().split('\n').at(-1) },
  linha_escrita_na_copia: linhaEscrita,
  linha_do_periodo_anterior_na_copia: anteriorEscrita,
  item2: {
    codigo: item2.codigo,
    erros_da_faixa: linhasDe(item2.saida, /ihpc-variacao-homologa-paises/),
    erros_s5: linhasDe(item2.saida, /S5:/),
    erros_s6: linhasDe(item2.saida, /S6:/),
    outras_linhas_de_erro: linhasDe(item2.saida, /✗|ERRO|erro:/i).slice(0, 20),
  },
  series_item2: { codigo: seriesItem2.codigo, erros: JSON.parse(seriesItem2.saida.trim().split('\n')[0] || '[]') },
  series_controlo: { codigo: seriesControlo.codigo, erros: JSON.parse(seriesControlo.saida.trim().split('\n')[0] || '[]') },
  travessia_do_motor_item2: travessiaItem2,
  travessia_do_motor_controlo: travessiaControlo,
  regua: { codigo: regua.codigo, saida: regua.saida.trim() },
  regua_controlo: { codigo: reguaControlo.codigo, saida: reguaControlo.saida.trim() },
};
fs.writeFileSync(path.join(AQUI, 'item2.json'), JSON.stringify(saida, null, 2) + '\n');
fs.rmSync(tmp, { recursive: true, force: true });
console.log(JSON.stringify(saida, null, 2));
