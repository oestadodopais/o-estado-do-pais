import {loadClaims} from '../src/lib/ledger.mjs';
import {conferirAfirmacoes} from './afirmacoes.mjs';
const r=conferirAfirmacoes(loadClaims({includeWithdrawn:true}));
for(const p of r.plantas) console.log(`PLANTA ${p.nome}: ${p.mensagem}`);
for(const e of r.errors) console.error(e);
console.log(`V2A: ${r.checked} afirmações conferidas, ${r.bodies} corpos lidos, ${r.plantas.length} plantas, ${r.errors.length} erros.`);
process.exitCode=r.errors.length?1:0;
