#!/usr/bin/env node
/**
 * OS ACERTOS DA PRIMEIRA EXPLICAÇÃO (bloco EX1, 05.10.2026, o ponto 3 do mandato: «o texto do §5 ponto 4 do brief, à
 * letra»).
 *
 * Lê o texto do brief (`design/observatorio/BRIEF-EX1-o-espaco-das-explicacoes-e-a-leitura-semanal.md`, §5, ponto 4),
 * passa-o à forma serializada da declaração (cada token entre ⟨⟩, os títulos com «## », as figuras pelo seu
 * marcador), aplica-lhe os acertos X1 a X10 de `ACERTOS`, cada um como uma substituição escrita aqui, e exige que o
 * resultado seja, carácter a carácter, o texto português da declaração (`src/data/explicacoes/dinheiro-do-estado-2026.mjs`)
 * serializado da mesma maneira, com todas as palavras guardadas por condições (a declaração inteira, e não a página de
 * hoje). Cada acerto tem de se exercer pelo menos uma vez: um acerto que já não muda nada é uma porta aberta esquecida.
 *
 * Corre-se da raiz do sítio: node design/especime-v3/medicoes/ex1-2026-10-05/acertos-ex1.mjs [--json <ficheiro>]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DINHEIRO_DO_ESTADO_2026 as E, ACERTOS, PROGRAMAS_DA_EXECUCAO } from '../../../../src/data/explicacoes/dinheiro-do-estado-2026.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '../../../..');
const BRIEF = path.join(RAIZ, 'design/observatorio/BRIEF-EX1-o-espaco-das-explicacoes-e-a-leitura-semanal.md');

/* ---------------------------------------------------------- a declaração, serializada */
/** @param {any} partes */
function serie(partes) {
  return (Array.isArray(partes) ? partes : [partes]).map((p) => {
    if (typeof p === 'string') return p;
    if ('claim' in p) return `⟨claim:${p.claim}⟩${p.sufixo ?? ''}`;
    if ('periodo' in p) return `⟨periodo:${p.periodo}⟩`;
    if ('nome' in p) return `⟨nome:${p.nome}⟩`;
    /* EX1-c: o sinal serializa-se com as palavras dos ramos (positivo|negativo|zero), para que o acerto X16 se veja. */
    if ('sinal' in p) return `⟨sinal:${p.sinal}:${['positivo', 'negativo', 'zero'].map((r) => (r in p ? serie(p[r]) : '')).join('|')}⟩`;
    if ('compara' in p) return `⟨compara:${p.compara.join(',')}⟩`;
    if ('se' in p) return serie(p.partes);
    /* EX1-b: o token `maiores` serializa-se pela frase que o apresenta e pela contagem (as palavras de cada item estão no
       acerto X11, que o descreve). */
    if ('maiores' in p) return `${p.frase}⟨maiores:${p.n} de ${p.maiores.length}⟩`;
    throw new Error(`pedaço desconhecido: ${JSON.stringify(p)}`);
  }).join('');
}
const blocos = [`# ${serie(E.titulo.pt)}`, ...E.abertura.map((/** @type {any} */ p) => serie(p.pt))];
for (const s of E.seccoes) {
  blocos.push(`## ${s.titulo.pt}`);
  for (const b of s.conteudo) blocos.push(b.figura ? `⟨figura:${b.figura.id} «${b.figura.titulo.pt}»⟩` : serie(b.paragrafo.pt));
}
blocos.push('## ⟨cadeia:explicacoes.oQueIstoNaoDiz⟩', ...E.naoDiz.map((/** @type {any} */ p) => serie(p.pt)));
const daDeclaracao = blocos.join('\n\n');

/* ---------------------------------------------------------- o brief, lido e passado à forma */
const linhas = fs.readFileSync(BRIEF, 'utf8').split('\n');
const i = linhas.findIndex((l) => l.trim() === '**Para onde vai o dinheiro do Estado em 2026**');
const f = linhas.findIndex((l, k) => k > i && l.trim().startsWith('*O que isto não diz.*'));
if (i < 0 || f < 0) throw new Error('acertos: não se acha o texto do §5, ponto 4, no brief.');
let t = linhas.slice(i, f + 1).map((l) => l.trim()).join('\n');
/* A forma: os tokens do brief passam aos marcadores da serialização (sem mudar uma palavra). */
const F = (/** @type {string} */ n) => `oe-2026-cem-euros-funcao-${n}`;
t = t.replace(/^\*\*(.+)\*\*$/m, '# $1');
t = t.replace(/`\{claim: ([a-z0-9-]+)\}`/g, (_, id) => `⟨claim:${/^\d\d$/.test(id) ? F(id) : id}⟩`);
t = t.replace(/\[nome: ([a-z0-9-]+)\]/g, (_, id) => `⟨nome:${/^\d\d$/.test(id) ? F(id) : id}⟩`);
t = t.replace(/`\{sinal: ([a-z0-9-]+), positivo: '([^']+)', negativo: '([^']+)'\}`/g, '⟨sinal:$1:$2|$3|⟩');

/* ---------------------------------------------------------- os acertos, um a um */
/** @type {{ id: string, vezes: number }[]} */
const exercidos = [];
/** @param {string} id @param {RegExp|string} de @param {string|((...a: any[]) => string)} para */
function acerto(id, de, para) {
  let vezes = 0;
  t = t.replace(typeof de === 'string' ? new RegExp(de.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g') : de, (/** @type {any[]} */ ...a) => { vezes++; return typeof para === 'string' ? para.replace(/\$(\d)/g, (/** @type {string} */ _, /** @type {string} */ k) => a[Number(k)] ?? '') : para(...a); });
  exercidos.push({ id, vezes });
}
acerto('X1', '# Para onde vai o dinheiro do Estado em 2026', `# Para onde vai o dinheiro do Estado em ⟨periodo:${F('01')}⟩`);
acerto('X1', 'O Orçamento do Estado para 2026', `O Orçamento do Estado para ⟨periodo:${F('01')}⟩`);
acerto('X1', 'Até agosto de 2026,', 'Até ⟨periodo:execucao-2026-08-despesa-efetiva-administracao-central-seguranca-social⟩,');
acerto('X1', 'No fim de 2025,', 'No fim de ⟨periodo:divida-publica-2025⟩,');
acerto('X2', / \(a fonte desta frase é a classificação das funções das administrações públicas, a divisão 01, que o construtor cita na auditoria da leitura\)/g, '');
acerto('X3', /\*Por função\.\* As dez funções, de cada cem euros: a figura das barras, uma por linha, da maior para a menor\. /g, '## Por função\n\n⟨figura:funcoes «As dez funções, de cada cem euros»⟩\n\n');
acerto('X3', / \(os ids `oe-2026-cem-euros-funcao-NN`\)/g, '');
acerto('X4', `e a ⟨nome:${F('08')}⟩`, `e o ⟨nome:${F('08')}⟩`);
acerto('X5', / A fatia das Finanças é grande porque \[[^\]]+\]\./g, '');
acerto('X6', / A figura das barras dos dezasseis ministérios, da maior para a menor\./g, '\n\n⟨figura:ministerios «Os dezasseis ministérios, de cada cem euros»⟩');
acerto('X7', /(⟨claim:(?:divida-publica-2025|divida-publica-2025-ue|saldo-das-administracoes-publicas-2025)⟩)/g, '$1 %');
acerto('X8', / O detalhe por programa e por ministério, com a fonte de cada número, está no estudo do Orçamento do Estado de 2026\./g, ' O detalhe por programa e por ministério, com a fonte de cada número, está no recibo de cada um, a um toque.');
/* EX1-b: os programas que mais gastaram passam ao token `maiores` (X11); a frase dos dois totais entra a seguir à figura
   dos ministérios (X12); o saldo passa a ter o sinal com o número e a palavra no fim (X13, depois do X7, que põe o « %»). */
acerto('X11', /; os programas que mais gastaram foram o do Trabalho, Solidariedade e Segurança Social \(⟨claim:execucao-2026-08-despesa-programa-016⟩ milhões\), o da Saúde \(⟨claim:execucao-2026-08-despesa-programa-015⟩ milhões\) e o da Gestão da Dívida Pública \(⟨claim:execucao-2026-08-despesa-programa-005⟩ milhões\)/g, `; os programas que mais gastaram foram ⟨maiores:3 de ${PROGRAMAS_DA_EXECUCAO.length}⟩`);
acerto('X10', /^\*(Por ministério|O que já se gastou este ano|A dívida e o saldo)\.\* /gm, '## $1\n\n');
acerto('X12', /(⟨figura:ministerios «Os dezasseis ministérios, de cada cem euros»⟩)/g, '$1\n\nAs duas contas não batem porque medem coisas diferentes: a conta por função soma o que a administração central gasta com cada fim, como a saúde ou a educação, sem as operações financeiras nem as transferências entre os seus serviços; a conta por ministério é o orçamento de cada ministério, com as operações financeiras e as transferências entre serviços do Estado.');
acerto('X13', /com um (⟨sinal:saldo-das-administracoes-publicas-2025:[^⟩]*⟩) de (⟨claim:saldo-das-administracoes-publicas-2025⟩ %) do produto\./g, 'com um saldo de $2 do produto, $1.');
/* EX1-c (06.10.2026, as correções da leitura a frio). */
const MIN = (/** @type {string} */ m) => `oe-2026-cem-euros-ministerio-${m}`;
acerto('X14', 'o maior é o das Finanças, com', `o maior é ⟨nome:${MIN('financas')}⟩, com`);
acerto('X14', `seguem-se a Saúde (⟨claim:${MIN('saude')}⟩), o Trabalho, Solidariedade e Segurança Social (⟨claim:${MIN('trabalho-solidariedade-e-seguranca-social')}⟩) e a Educação, Ciência e Inovação (⟨claim:${MIN('educacao-ciencia-e-inovacao')}⟩)`,
  `seguem-se ⟨nome:${MIN('saude')}⟩ (⟨claim:${MIN('saude')}⟩), ⟨nome:${MIN('trabalho-solidariedade-e-seguranca-social')}⟩ (⟨claim:${MIN('trabalho-solidariedade-e-seguranca-social')}⟩) e ⟨nome:${MIN('educacao-ciencia-e-inovacao')}⟩ (⟨claim:${MIN('educacao-ciencia-e-inovacao')}⟩)`);
acerto('X15', ', contra ⟨claim:divida-publica-2025-ue⟩ % na média da União Europeia,', ', ⟨compara:divida-publica-2025,divida-publica-2025-ue⟩,');
acerto('X16', '⟨sinal:saldo-das-administracoes-publicas-2025:excedente|défice|⟩', '⟨sinal:saldo-das-administracoes-publicas-2025:um excedente (recebeu mais do que gastou)|um défice (gastou mais do que recebeu)|um saldo nulo (recebeu o mesmo que gastou)⟩');
acerto('X17', ' Os juros da dívida não estão ainda no livro-razão deste projeto como linha própria; quando entrarem, esta explicação diz quanto são.', ' Falta aqui o custo dos juros da dívida, que o Orçamento também prevê e que estes números não mostram.');
acerto('X10', /^\*O que isto não diz\.\* /gm, '## ⟨cadeia:explicacoes.oQueIstoNaoDiz⟩\n\n');
/* X9 não muda palavras: as frases que comparam ficam guardadas por condições. Conta-se aqui quantas guardas a declaração tem. */
const guardas = (JSON.stringify(E).match(/"se":\[/g) ?? []).length / 2;
exercidos.push({ id: 'X9', vezes: guardas });

const doBrief = t;
const ids = new Set(ACERTOS.map((a) => a.id));
const erros = [];
for (const id of ids) if (!exercidos.some((x) => x.id === id && x.vezes > 0)) erros.push(`o acerto ${id} está declarado e não se exerceu`);
for (const x of exercidos) if (!ids.has(x.id)) erros.push(`o guião aplica o acerto ${x.id}, que a declaração não tem`);
for (const x of exercidos) if (x.vezes === 0) erros.push(`uma substituição do acerto ${x.id} não se exerceu`);
if (doBrief !== daDeclaracao) {
  const a = doBrief.split('\n\n'), b = daDeclaracao.split('\n\n');
  const k = a.findIndex((x, j) => x !== b[j]);
  erros.push(`o texto do brief com os acertos não é o da declaração; o primeiro bloco diferente é o ${k + 1}:\n  brief:      ${a[k]}\n  declaração: ${b[k]}`);
}
const resumo = { brief: path.relative(RAIZ, BRIEF), declaracao: 'src/data/explicacoes/dinheiro-do-estado-2026.mjs', blocos: daDeclaracao.split('\n\n').length, acertos: exercidos, iguais: doBrief === daDeclaracao, erros };
const j = process.argv.indexOf('--json');
if (j > 0) fs.writeFileSync(process.argv[j + 1], JSON.stringify(resumo, null, 2) + '\n');
console.log(`acertos EX1: ${resumo.blocos} blocos; o texto do brief com os acertos ${resumo.iguais ? 'é' : 'NÃO é'} o da declaração; ${exercidos.map((x) => `${x.id}×${x.vezes}`).join(' ')}`);
if (erros.length) { console.error(erros.map((e) => `  · ${e}`).join('\n')); process.exit(1); }
