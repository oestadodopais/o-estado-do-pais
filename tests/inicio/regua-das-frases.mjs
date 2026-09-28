/**
 * AS PLANTAS DA RÉGUA DAS FRASES NAS PÁGINAS DOS BLOCOS (bloco PP1, 28.09.2026)
 *
 * A régua das frases (`scripts/medir-defeitos.mjs`, a medida 8, que o `check:voz` fecha) mudou de forma
 * em duas coisas com este bloco. A marca `data-bloco-declarado` tira texto do inventário, e só na
 * primeira página e nas cinco entradas, onde a célula dos blocos o confere. E numa entrada, um bloco com
 * uma marca de origem dentro de um cartão da medida é saltado como na página dos temas, porque o cartão
 * é o mesmo e o K17 do `check:cartao` confere as leituras dele nas duas.
 *
 * E a frase do veredicto sai do inventário na primeira página, e só lá, porque a V1 a recompõe inteira na
 * mesma corrida do `check:voz` e a linha dela contava as vírgulas da lista das medidas fora.
 *
 * Estas plantas provam que a régua ainda morde onde tem de morder, e que as dispensas não passam dos
 * seus sítios: correm a régua inteira sobre uma construção pequena, copiada do `dist/` para uma
 * pasta temporária fora da árvore e estragada lá, e leem as frases por classificar do JSON dela.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/** As frases plantadas, com um valor de uma linha no meio (a régua lê-as sem ele). */
const FORA = 'Frase plantada fora dos cartões de uma entrada, com um valor ao lado.';
const DENTRO = 'Frase plantada dentro de um cartão de uma entrada, com um valor ao lado.';
const MARCADA_NO_CONCELHO = 'Frase plantada com a marca dos blocos numa página de concelho.';
const MARCADA_NA_PRIMEIRA = 'Frase plantada com a marca dos blocos na primeira página.';
const VEREDICTO_NO_CONCELHO = 'Frase plantada com a marca do veredicto numa página de concelho.';
/** @param {string} frase */
const comValor = (frase) => frase.replace('com um valor ao lado', 'com um valor <span data-claim="ipc-variacao-homologa">2,8</span> ao lado');

/**
 * @param {string} dist
 * @returns {{ nome: string, mordeu: boolean, queixa: string|null }[]}
 */
export function plantasDaReguaDasFrases(dist) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'oedp-regua-das-frases-'));
  try {
    /** @param {string} rel @param {(h: string) => string} estraga */
    const copia = (rel, estraga) => {
      const f = path.join(tmp, rel, 'index.html');
      fs.mkdirSync(path.dirname(f), { recursive: true });
      fs.writeFileSync(f, estraga(fs.readFileSync(path.join(dist, rel, 'index.html'), 'utf8')));
    };
    /** @param {string} h @param {string} p */
    const antesDoFimDoMain = (h, p) => { const i = h.lastIndexOf('</main>'); if (i < 0) throw new Error('a página não tem </main>'); return h.slice(0, i) + p + h.slice(i); };
    const concelho = fs.readdirSync(path.join(dist, 'municipios'), { withFileTypes: true }).find((d) => d.isDirectory() && fs.existsSync(path.join(dist, 'municipios', d.name, 'index.html')));
    if (!concelho) throw new Error('a construção não tem página de concelho nenhuma');
    copia('', (h) => antesDoFimDoMain(h, `<p data-bloco-declarado>${MARCADA_NA_PRIMEIRA}</p>`));
    copia('o-meu-dinheiro', (h) => {
      const i = h.indexOf('data-cartao-medida="');
      const j = h.indexOf('>', i) + 1;
      if (i < 0 || j <= 0) throw new Error('a entrada não tem cartão nenhum');
      const comDentro = h.slice(0, j) + `<p>${comValor(DENTRO)}</p>` + h.slice(j);
      return antesDoFimDoMain(comDentro, `<p>${comValor(FORA)}</p>`);
    });
    copia(path.join('municipios', concelho.name), (h) => antesDoFimDoMain(h, `<p data-bloco-declarado>${MARCADA_NO_CONCELHO}</p><p data-veredicto-pais>${VEREDICTO_NO_CONCELHO}</p>`));
    const saida = execFileSync(process.execPath, [path.join(RAIZ, 'scripts', 'medir-defeitos.mjs'), '--json'], {
      cwd: RAIZ, env: { ...process.env, OEDP_DIST: tmp }, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'],
    });
    const j = JSON.parse(saida.slice(saida.indexOf('{')));
    const porRota = j?.frases_da_casa?.por_rota ?? {};
    /** @param {string} rota */
    const naoClassificados = (rota) => /** @type {string[]} */ (porRota[rota]?.nao_classificados ?? []);
    const rotaDoConcelho = `/municipios/${concelho.name}`;
    const lidas = Object.keys(porRota).length;
    return [
      { nome: 'uma frase com um valor fora dos cartões de uma entrada fica por classificar', mordeu: naoClassificados('/o-meu-dinheiro').includes(FORA), queixa: naoClassificados('/o-meu-dinheiro').includes(FORA) ? `bloco por classificar em /o-meu-dinheiro: «${FORA}»` : `a régua leu ${lidas} rota(s) e não a viu` },
      { nome: 'a marca dos blocos numa página de concelho não tira nada do inventário', mordeu: naoClassificados(rotaDoConcelho).includes(MARCADA_NO_CONCELHO), queixa: naoClassificados(rotaDoConcelho).includes(MARCADA_NO_CONCELHO) ? `bloco por classificar em ${rotaDoConcelho}: «${MARCADA_NO_CONCELHO}»` : `a régua leu ${lidas} rota(s) e não a viu` },
      /* A frase do veredicto só sai do inventário na primeira página, onde a V1 a confere. */
      { nome: 'a marca do veredicto numa página de concelho não tira nada do inventário', mordeu: naoClassificados(rotaDoConcelho).includes(VEREDICTO_NO_CONCELHO), queixa: naoClassificados(rotaDoConcelho).includes(VEREDICTO_NO_CONCELHO) ? `bloco por classificar em ${rotaDoConcelho}: «${VEREDICTO_NO_CONCELHO}»` : `a régua leu ${lidas} rota(s) e não a viu` },
      /* Os dois controlos: a dispensa existe onde foi escrita, e só lá. */
      { nome: 'controlo: dentro de um cartão de uma entrada, a régua faz o que faz na página dos temas', mordeu: !naoClassificados('/o-meu-dinheiro').includes(DENTRO) && porRota['/o-meu-dinheiro'] !== undefined, queixa: naoClassificados('/o-meu-dinheiro').includes(DENTRO) ? 'a frase do cartão ficou por classificar' : null },
      { nome: 'controlo: a marca dos blocos na primeira página tira a frase do inventário', mordeu: !naoClassificados('/').includes(MARCADA_NA_PRIMEIRA) && porRota['/'] !== undefined, queixa: naoClassificados('/').includes(MARCADA_NA_PRIMEIRA) ? 'a frase marcada ficou por classificar' : null },
    ];
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}
