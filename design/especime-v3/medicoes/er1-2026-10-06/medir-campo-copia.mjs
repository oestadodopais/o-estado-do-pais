/* Sondagem ligada à cabeça medida. O campo marcado pode estar fora do bloco;
   interessa conferir precisamente o campo que o botão copia. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { conferirCodigo, lerPaginaComCodigo } from '../../../../scripts/incorporar-do-portao.mjs';
import { routePath, matchPath } from '../../../../src/lib/routes.mjs';
import { escrever } from './medir.mjs';
const id=JSON.parse(fs.readFileSync(new URL('./capturas-prova.json',import.meta.url),'utf8')).linha;
const rota=routePath('linha','pt',{slug:id});
const root=lerPaginaComCodigo(fs.readFileSync(`dist${rota}/index.html`,'utf8'));
const campo=root.querySelector('[data-incorporar-codigo]');
const fora=lerPaginaComCodigo(campo.outerHTML).querySelector('textarea');
fora.setAttribute('id','codigo-fora');
campo.removeAttribute('data-incorporar-codigo');
campo.set_content('Texto diferente');
root.querySelector('body').appendChild(fora);
const queixas=conferirCodigo(root,matchPath(rota));
assert.deepEqual(queixas,[]);
escrever('campo-copia-antes',{
  comando:'node design/especime-v3/medicoes/er1-2026-10-06/medir-campo-copia.mjs',
  cabeca:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),
  shaDoComparador:createHash('sha256').update(fs.readFileSync('scripts/incorporar-do-portao.mjs')).digest('hex'),
  planta:'Campo correto marcado fora do bloco; campo incorreto dentro do bloco.',
  aceiteIndevidamente:queixas.length===0,queixas,
  textoQueOBotaoCopiaria:root.querySelector('[data-incorporar-bloco] textarea').textContent,
  campoConferidoEOCopiado:root.querySelector('[data-incorporar-codigo]')===root.querySelector('[data-incorporar-bloco] textarea'),
});
