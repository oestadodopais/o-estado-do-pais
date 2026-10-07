/** Retira apenas os caminhos locais e o nome da conta dos registos da execução. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
const pasta=path.dirname(new URL(import.meta.url).pathname),mudados=[];
const trocas=[[process.cwd(),'<worktree>'],[os.homedir(),'<casa>'],[os.tmpdir(),'<temporario>'],[os.userInfo().username,'<utilizador>']];
function anda(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())anda(f);else if(!e.name.endsWith('.mjs')){const antes=fs.readFileSync(f,'utf8');let depois=antes;for(const [de,para]of trocas)depois=depois.replaceAll(de,para);if(depois!==antes){fs.writeFileSync(f,depois);mudados.push(path.relative(pasta,f));}}}}
anda(pasta);
console.log(JSON.stringify({registos_limpos:mudados}));
