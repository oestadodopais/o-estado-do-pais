import assert from 'node:assert/strict';
import {CORRECOES_TEXTO} from '../../src/data/correcoes.mjs';
import {contagensDoRegisto,loadClaims,validateLedger} from '../../src/lib/ledger.mjs';
import {analisa,leMarcadores,leInventario} from '../../scripts/voz.mjs';
import {PALAVRAS_PROIBIDAS} from '../../scripts/voz-palavras.mjs';
let plantas=0;
const linhas=loadClaims(),conta=linhas.get('correcoes-publicadas');
assert.equal(Number(conta.value),contagensDoRegisto().correcoes_publicadas);
const anterior=conta.value;conta.value=String(Number(anterior)-1);
try {assert(validateLedger().errors.some(e=>e.includes('correcoes-publicadas')));plantas++;}finally{conta.value=anterior;}
const inventario=leInventario(process.cwd());
const faltaFrase = (inventario, frase) => !inventario.linhas.some(l=>l.bloco==='ed1' && l.texto===frase);
for(const e of CORRECOES_TEXTO)for(const lang of ['pt','en']) {
 const frase=e.frase[lang],rota=lang==='pt'?'/correcoes':'/en/corrections';
 assert.deepEqual(analisa(frase,rota,leMarcadores(process.cwd()),'correcoes'),[]);
 assert.deepEqual(PALAVRAS_PROIBIDAS.filter(m=>m.marca.test(frase)).map(m=>m.chave),[]);
 assert(analisa(frase+' O projeto verifica tudo.',rota,leMarcadores(process.cwd()),'correcoes').length);plantas++;
 assert(!faltaFrase(inventario,frase),`inventário: ${lang}/${e.slug}`);
 const copia=structuredClone(inventario);copia.linhas=copia.linhas.filter(l=>l.texto!==frase);
 assert(faltaFrase(copia,frase));plantas++;
}
console.log(`ED1 réguas: ${plantas} plantas da contagem, voz e inventário.`);
