/* Observa a espera sem tocar na tranca comum ou nos outros construtores. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { limpar, escrever } from './medir.mjs';
const comum=execFileSync('git',['rev-parse','--path-format=absolute','--git-common-dir'],{encoding:'utf8'}).trim();
const f=path.join(comum,'oedp-construcao.lock');
const agora=new Date();
const presente=fs.existsSync(f);
escrever('tranca-observada',{
  comando:'node design/especime-v3/medicoes/er1-2026-10-06/medir-tranca.mjs',
  agora,presente,
  ...(presente?{modificada:fs.statSync(f).mtime,idadeSegundos:Math.floor((agora-fs.statSync(f).mtime)/1000),conteudo:limpar(fs.readFileSync(f,'utf8')).replace(/<casa>\/[^ \n;]+/g,'<worktree>')}:{}),
});
