/**
 * AS MEDIDAS DO EX4 (21.10.2026), escritas em `medidas.json` ao lado: cada uma com o nome, o valor, o comando e um
 * conhecido-positivo. Os códigos dos portões leem-se dos ficheiros `codigos/*.code`, escritos pelo comando de cada um.
 * Corre-se da raiz: `node design/especime-v3/medicoes/ex4-2026-10-21/medidas-ex4.mjs`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..', '..');
const CLAIMS = path.join(RAIZ, 'ledger', 'claims');
const yml = fs.readdirSync(CLAIMS).filter((f) => f.endsWith('.yml')).map((f) => [f, fs.readFileSync(path.join(CLAIMS, f), 'utf8')]);
const doPf1 = yml.filter(([, t]) => /^study: "oe-2027-funcoes"$/m.test(t));
const comPeriod = (/** @type {any[]} */ l) => l.filter(([, t]) => /^period: /m.test(t));
const trimestre = (/** @type {any[]} */ l) => l.filter(([, t]) => /^period: "\d{4}-T[1-4]"$/m.test(t));
const codigos = Object.fromEntries(fs.readdirSync(path.join(AQUI, 'codigos')).filter((f) => f.endsWith('.code')).sort().map((f) => [f.replace(/\.code$/, ''), Number(fs.readFileSync(path.join(AQUI, 'codigos', f), 'utf8').trim())]));
const ler = (/** @type {string} */ f) => JSON.parse(fs.readFileSync(path.join(AQUI, f), 'utf8'));
const medidas = [
  { nome: 'linhas_do_pf1_no_livro', valor: doPf1.length, comando: 'contar ledger/claims/*.yml com study: "oe-2027-funcoes"', conhecido_positivo: { o_que: 'o registo ledger/cruzamentos/pf1.json nomeia as mesmas linhas', valor: Object.keys(ler('../../../../ledger/cruzamentos/pf1.json').rows ?? {}).length } },
  { nome: 'linhas_do_pf1_com_period', valor: comPeriod(doPf1).length, comando: 'das linhas do PF1, as que têm o campo period', conhecido_positivo: { o_que: 'as linhas do livro fora do PF1 com period trimestral, que a regra 7 aceita', valor: trimestre(comPeriod(yml.filter((x) => !doPf1.includes(x)))).length } },
  { nome: 'valores_de_period_do_pf1', valor: Object.fromEntries([...new Set(comPeriod(doPf1).map(([, t]) => /^period: "([^"]*)"/m.exec(t)?.[1]))].map((v) => [v, comPeriod(doPf1).filter(([, t]) => new RegExp(`^period: "${v}"`, 'm').test(t)).length])), comando: 'agrupar o campo period das linhas do PF1', conhecido_positivo: null },
  { nome: 'acertos', valor: ler('acertos-ex4.json'), comando: 'node design/especime-v3/medicoes/ex4-2026-10-21/acertos-ex4.mjs --json acertos-ex4.json', conhecido_positivo: 'as frases fora (figura-1, figura-2, naoDiz-2) só passam porque um acerto as declara' },
  { nome: 'plantas', valor: ler('plantas-ex4.json'), comando: 'node design/especime-v3/medicoes/ex4-2026-10-21/plantas-ex4.mjs --json plantas-ex4.json', conhecido_positivo: 'o controlo sem estrago passa' },
  { nome: 'codigos', valor: codigos, comando: 'cada código escrito pelo comando do portão em codigos/<nome>.code', conhecido_positivo: null },
];
fs.writeFileSync(path.join(AQUI, 'medidas.json'), JSON.stringify({ bloco: 'EX4', data: '2026-10-21', medidas }, null, 2) + '\n');
console.log(medidas.map((m) => `${m.nome}: ${typeof m.valor === 'object' ? JSON.stringify(m.valor).slice(0, 120) : m.valor}`).join('\n'));
