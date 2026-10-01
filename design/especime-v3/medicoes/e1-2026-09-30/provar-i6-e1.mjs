/** E1: a planta da I6 da régua do índice (tests/livro/indice.mjs). Num dist/ de duas páginas,
 * feito numa pasta temporária a partir do documento alojado do estudo de quem governou a
 * câmara, a cadeia «[a verificar]» dentro da moldura conta como texto do documento, e a mesma
 * página sem a moldura (a casa a escrever a cadeia à mão) é acusada como cadeia solta.
 * Escreve design/especime-v3/medicoes/e1-2026-09-30/prova-i6-e1.json. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const pasta = 'design/especime-v3/medicoes/e1-2026-09-30';
const origem = 'dist/estudos/evora-quem-governou-a-camara-2009-2025/documento/index.html';
const html = fs.readFileSync(origem, 'utf8');
if (!html.includes('data-oedp-moldura') || !html.includes('[a verificar]')) throw new Error('A página de origem já não tem a moldura e a cadeia.');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'e1-i6-'));
try {
  const doc = path.join(tmp, 'estudos/evora-quem-governou-a-camara-2009-2025/documento');
  const planta = path.join(tmp, 'planta-da-casa');
  fs.mkdirSync(doc, { recursive: true });
  fs.mkdirSync(planta, { recursive: true });
  fs.writeFileSync(path.join(doc, 'index.html'), html);
  fs.writeFileSync(path.join(planta, 'index.html'), html.replaceAll(' data-oedp-moldura', ''));
  const json = path.join(tmp, 'indice.json');
  const r = spawnSync('node', ['tests/livro/indice.mjs', '--json', json], { env: { ...process.env, OEDP_DIST: tmp }, encoding: 'utf8' });
  const saida = JSON.parse(fs.readFileSync(json, 'utf8'));
  const i6 = saida.medida.I6;
  const falhas = saida.celulas.find((c) => c.id === 'I6').falhas;
  const soltasNaPlanta = falhas.filter((f) => f.startsWith('/planta-da-casa: a cadeia do marcador escrita sem a marca')).length;
  const soltasNoDocumento = falhas.filter((f) => f.includes('/documento: a cadeia do marcador escrita sem a marca')).length;
  const prova = {
    cabeca: spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim(),
    medido_em: new Date().toISOString(),
    pagina_de_origem: origem.replace(/^dist/, ''),
    codigo_da_regua_no_dist_plantado: r.status,
    i6: { soltos: i6.soltos ?? null, em_documentos_alojados: i6.em_documentos_alojados ?? null },
    acusacoes_na_planta_da_casa: soltasNaPlanta,
    acusacoes_no_documento_alojado: soltasNoDocumento,
    mordeu: soltasNaPlanta === 2 && soltasNoDocumento === 0 && i6.em_documentos_alojados === 2,
  };
  fs.writeFileSync(`${pasta}/prova-i6-e1.json`, JSON.stringify(prova, null, 2) + '\n');
  console.log(JSON.stringify(prova, null, 2));
  process.exitCode = prova.mordeu ? 0 : 1;
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
