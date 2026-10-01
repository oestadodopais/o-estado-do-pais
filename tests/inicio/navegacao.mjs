/** O portão da navegação N1, chamado na construção e na verificação. */
import fs from 'node:fs';
import { conferirAcertosN1c, plantasDosAcertosN1c } from './n1c.mjs';
import { conferirBlocosUnicos, plantasDosBlocosUnicos } from './blocos-unicos.mjs';
import { conferirEntradas, plantasDasEntradas } from './entradas.mjs';
import { conferirConcelhosNosLugares, plantasDosConcelhos } from './concelhos-nos-lugares.mjs';
/* L2a (01.10.2026, §1.149): o mapa primeiro em «Lugares», as listas dobradas, e a porta com o sinal. */
import { conferirMapaPrimeiro, plantasDoMapaPrimeiro } from './mapa-primeiro.mjs';
const dist = process.env.OEDP_DIST ?? 'dist';
const r = conferirBlocosUnicos(dist);
const entradas = conferirEntradas(dist);
r.erros.push(...entradas.erros);
const concelhos = conferirConcelhosNosLugares(dist);
r.erros.push(...concelhos.erros);
const acertos = conferirAcertosN1c(dist);
r.erros.push(...acertos.erros);
const mapaPrimeiro = conferirMapaPrimeiro(dist);
r.erros.push(...mapaPrimeiro.erros);
const plantas = process.argv.includes('--prova') ? [...plantasDosBlocosUnicos(dist), ...plantasDasEntradas(dist), ...plantasDosConcelhos(dist), ...plantasDosAcertosN1c(dist), ...plantasDoMapaPrimeiro(dist)] : [];
for (const p of plantas) if (!p.mordeu) r.erros.push(`A planta não mordeu: ${p.nome}`);
const relatorio = { ...r, entradas: entradas.contas, concelhos: concelhos.contas, acertos: acertos.medidas, mapa_primeiro: mapaPrimeiro.contas, plantas };
const j = process.argv.indexOf('--json');
if (j >= 0) fs.writeFileSync(process.argv[j + 1], JSON.stringify(relatorio, null, 2) + '\n');
console.log(JSON.stringify(relatorio, null, 2));
process.exitCode = r.erros.length ? 1 : 0;
