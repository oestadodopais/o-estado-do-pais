#!/usr/bin/env node
/* Os resumos dos parágrafos do Método que citam o marcador «[a verificar]», pela conta de `scripts/sem-marcadores.mjs`
   (o texto do parágrafo sem guiões nem folhas, «[to verify]» lido como «[a verificar] (to verify)», os espaços
   colapsados, sha256). O conhecido-positivo: a mesma conta nos parágrafos da regra 5 de antes do bloco ME1 tem de dar
   os dois resumos que `REFERENCIAS_METODO` guardava. uso: node resumos-do-marcador.mjs [dist] */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
const AQUI = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(process.argv[2] ?? path.join(AQUI, '../../../../dist'));
const texto = (n) => (['SCRIPT', 'STYLE'].includes(n.tagName) ? '' : n.nodeType === 3 ? n.textContent : (n.childNodes ?? []).map(texto).join(''));
const resumo = (p) => createHash('sha256').update(texto(p).replaceAll('[to verify]', '[a verificar] (to verify)').replace(/\s+/g, ' ').trim()).digest('hex');
const paragrafos = (html) => parse(html).querySelectorAll('a.marcador').map((a) => a.closest('p'));
const ANTIGOS = ['2c0adb43dabc8b688009f7fdaf06d925d6bf1afe1f5d031365d8416a927c57d9', '9db1e65032c9e887071fae2df91c472656f1d300435daee34fd91f9568e90429'];
const antes = ['metodo.html.gz', 'en-method.html.gz'].flatMap((f) => paragrafos(zlib.gunzipSync(fs.readFileSync(path.join(AQUI, 'antes', f))).toString('utf8')).map(resumo));
const depois = ['metodo/index.html', 'en/method/index.html'].flatMap((f) => paragrafos(fs.readFileSync(path.join(dist, f), 'utf8')).map((p) => ({ pagina: f, resumo: resumo(p) })));
const positivo = JSON.stringify([...antes].sort()) === JSON.stringify([...ANTIGOS].sort());
console.log(JSON.stringify({ conhecido_positivo: { o_que: 'os resumos da regra 5 de antes são os de REFERENCIAS_METODO antes do ME1', antes, encontrado: positivo }, depois }, null, 1));
if (!positivo) process.exitCode = 1;
