/**
 * AS MEDIDAS DE TODAS AS COMBINAÇÕES NUM SÓ FICHEIRO, E A TABELA DA RUBRICA.
 *
 * SEGUNDA RONDA. É o ficheiro da primeira corrigido no que a leitura cruzada
 * apontou:
 *
 *   · a medida 1 da tabela passa a ser a do NAVEGADOR, e não `sxHeight/upm` do
 *     ficheiro. A razão do ficheiro fica ao lado, e a diferença entre as duas
 *     vê-se: num tipo com eixo ótico não são a mesma coisa;
 *   · a medida 2 agrega as 35 células de cada família (cinco páginas × sete
 *     larguras, tudo a 1×) e não as duas larguras de antes, e traz a mediana, o
 *     pior e o melhor caso, para que uma vitória média não esconda uma página;
 *   · a medida 3 da tabela é a de 1×, que é a da rubrica. A leitura de 12×
 *     continua no ficheiro das aberturas e vai à tabela dita como contexto,
 *     fora de qualquer ordem;
 *   · a medida 6 traz o lugar do instrumento, medido na ficha do aparelho da
 *     linha do livro-razão;
 *   · a medida 7 é normalizada e a sua soma PARA quando um nome não existe, em
 *     vez de contar zero;
 *   · escreve-se `MEDIDAS-2-celulas.json`, com as células uma a uma. A primeira
 *     ronda declarou 525 células e não as trouxe.
 *
 * Lê `medidas-2/<combinacao>.json` (a régua nas páginas), `MEDIDAS-2-tipo.json`
 * (o que está dentro dos ficheiros), `MEDIDAS-2-aberturas.json` (a medida 3) e
 * `tipos/SUBCONJUNTOS.json` (os bytes).
 *
 * Uma medida que não existe escreve-se `—` e diz-se porquê. Nenhuma célula
 * desta tabela é preenchida por analogia com outra.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { somaDosFicheiros } from './provas.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..');
const ESTUDO = path.join(RAIZ, 'design', 'tipografia');

const COMBINACOES = [
  'spectral+bitter', 'newsreader+bitter', 'sourceserif4+bitter',
  'literata+bitter', 'ledger+bitter', 'spectral+publicsans',
];

/**
 * As famílias da tabela. `deCombinacao` diz de que construção se leem as
 * medidas de página dessa família; `papel` diz a que lugar concorre.
 */
const FAMILIAS = [
  { nome: 'Spectral', papel: 'prosa', chave: 'Spectral', deCombinacao: 'spectral+bitter', qual: 'prosa', nota: 'controlo: o sítio de hoje' },
  { nome: 'Newsreader', papel: 'prosa', chave: 'Newsreader', deCombinacao: 'newsreader+bitter', qual: 'prosa' },
  { nome: 'Source Serif 4', papel: 'prosa', chave: 'Source Serif 4', deCombinacao: 'sourceserif4+bitter', qual: 'prosa' },
  { nome: 'Literata', papel: 'prosa', chave: 'Literata', deCombinacao: 'literata+bitter', qual: 'prosa' },
  { nome: 'Ledger', papel: 'prosa', chave: 'Ledger', deCombinacao: 'ledger+bitter', qual: 'prosa', nota: 'acrescentada pelo lugar de direção depois da adenda 2' },
  { nome: 'Parnaso Standard', papel: 'prosa', chave: null, deCombinacao: null, qual: null, vazio: 'o pacote de teste não existe: só o diretor o pode pedir' },
  { nome: 'Parnaso Small', papel: 'prosa', chave: null, deCombinacao: null, qual: null, vazio: 'o pacote de teste não existe: só o diretor o pode pedir' },
  { nome: 'Bitter', papel: 'instrumento', chave: 'Bitter', deCombinacao: 'spectral+bitter', qual: 'instr', nota: 'controlo: o sítio de hoje' },
  { nome: 'Public Sans', papel: 'instrumento', chave: 'Public Sans', deCombinacao: 'spectral+publicsans', qual: 'instr' },
  { nome: 'IBM Plex Sans', papel: 'instrumento', chave: 'IBM Plex Sans', deCombinacao: null, qual: null, excluida: true },
  { nome: 'Sebenta', papel: 'instrumento', chave: null, deCombinacao: null, qual: null, vazio: 'o pacote de teste não existe: só o diretor o pode pedir' },
];

/**
 * OS FICHEIROS QUE O SÍTIO CARREGARIA COM CADA FAMÍLIA, NORMALIZADOS.
 *
 * A leitura cruzada apontou que a comparação de bytes da primeira ronda
 * misturava sete ficheiros estáticos de Spectral com pacotes variáveis e
 * contava itálicos «por examinar». A normalização é esta, e está medida no
 * sítio construído, não suposta:
 *
 *   · os ESTILOS são os que a folha do sítio compõe hoje: `font-weight` 400 (5
 *     regras), 500 (7), 600 (116) e 700 (4) na prosa e no aparelho, mais o
 *     itálico, que as páginas usam em `<em>` e que nenhuma regra desliga (não há
 *     `font-style: normal` fora dos `@font-face`), mais as versais, que a folha
 *     pede em `--f-versal`. Os `<i>` do sítio não contam para o itálico: são
 *     pontos de legenda (`.legend-dot i` põe-lhes `display:block` e
 *     `border-radius:50%`) e não texto inclinado;
 *   · o SUBCONJUNTO é o mesmo para todos, latino mais latino estendido, do
 *     mesmo `pyftsubset` com as mesmas bandeiras (`tipos/SUBCONJUNTOS.json`);
 *   · um ficheiro VARIÁVEL que sirva os quatro pesos conta uma vez, porque é
 *     uma transferência só, e leva ao lado o que carrega a mais (os eixos e os
 *     pesos que o sítio não pede) escrito na coluna da razão.
 *
 * Nenhum nome desta lista pode faltar em `SUBCONJUNTOS.json`: a soma pára em vez
 * de contar zero, e esse vermelho está plantado em `provas.mjs`.
 */
const CARGA = {
  Spectral: {
    ficheiros: ['spectral/Spectral-Regular-latin.woff2', 'spectral/Spectral-Italic-latin.woff2',
      'spectral/Spectral-Medium-latin.woff2', 'spectral/Spectral-SemiBold-latin.woff2',
      'spectral/Spectral-Bold-latin.woff2', 'spectral-sc/SpectralSC-Regular-latin.woff2',
      'spectral-sc/SpectralSC-SemiBold-latin.woff2'],
    razao: 'quatro estáticos (400, 500, 600, 700), o itálico e dois de versais: a Spectral não é variável',
    aMais: 'nada: cada ficheiro serve um estilo que o sítio pede',
  },
  Newsreader: {
    ficheiros: ['newsreader/Newsreader-latin.woff2', 'newsreader/Newsreader-Italic-latin.woff2',
      'spectral-sc/SpectralSC-Regular-latin.woff2', 'spectral-sc/SpectralSC-SemiBold-latin.woff2'],
    razao: 'um variável para os quatro pesos, o itálico variável, e as versais na Spectral SC porque não tem `smcp`',
    aMais: 'os pesos 200 a 800 e o eixo `opsz`, quando o sítio pede quatro pesos',
  },
  'Source Serif 4': {
    ficheiros: ['sourceserif4/SourceSerif4-latin.woff2', 'sourceserif4/SourceSerif4-Italic-latin.woff2'],
    razao: 'um variável para os quatro pesos e o itálico variável; as versais saem do mesmo ficheiro pelo `smcp`',
    aMais: 'os pesos 200 a 900 e o eixo `opsz`',
  },
  Literata: {
    ficheiros: ['literata/Literata-latin.woff2', 'literata/Literata-Italic-latin.woff2'],
    razao: 'um variável para os quatro pesos e o itálico variável; as versais saem do mesmo ficheiro pelo `smcp`',
    aMais: 'os pesos 200 a 900 e o eixo `opsz`',
  },
  Ledger: {
    ficheiros: ['ledger/Ledger-latin.woff2',
      'spectral-sc/SpectralSC-Regular-latin.woff2', 'spectral-sc/SpectralSC-SemiBold-latin.woff2'],
    razao: 'um estático, que é o único peso que a família tem; as versais ficam na Spectral SC porque não tem `smcp`',
    aMais: 'nada, e falta: os pesos 500, 600 e 700 e o itálico não existem no ficheiro e ficam por conta do '
      + 'navegador, que os fabrica engordando e inclinando o regular',
  },
  Bitter: { ficheiros: ['bitter/Bitter-latin.woff2'], razao: 'um variável, todos os pesos', aMais: 'os pesos 100 a 900' },
  'Public Sans': { ficheiros: ['publicsans/PublicSans-latin.woff2'], razao: 'um variável, todos os pesos', aMais: 'os pesos 100 a 900' },
  'IBM Plex Sans': { ficheiros: ['ibmplexsans/IBMPlexSans-latin.woff2'], razao: 'um variável; não entra, ver linha 4', aMais: 'os eixos `wght` e `wdth`' },
};

const n = (v, casas = 2) => (v === null || v === undefined ? '—' : Number(v).toFixed(casas));
const kb = (b) => (b / 1024).toFixed(1);

/** A mediana de uma lista de números, `null` se a lista estiver vazia. */
function mediana(a) {
  const b = a.filter((x) => typeof x === 'number').sort((x, y) => x - y);
  if (!b.length) return null;
  const m = b.length >> 1;
  return +(b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2).toFixed(4);
}

function principal() {
  const tipo = JSON.parse(fs.readFileSync(path.join(ESTUDO, 'MEDIDAS-2-tipo.json'), 'utf8'));
  const sub = JSON.parse(fs.readFileSync(path.join(ESTUDO, 'tipos', 'SUBCONJUNTOS.json'), 'utf8'));
  const abert = JSON.parse(fs.readFileSync(path.join(ESTUDO, 'MEDIDAS-2-aberturas.json'), 'utf8'));
  const bytes = Object.fromEntries(sub.ficheiros.map((f) => [f.saida.replace('design/tipografia/tipos/', ''), f.bytes]));

  const paginas = {};
  for (const c of COMBINACOES) {
    const f = path.join(ESTUDO, 'medidas-2', `${c}.json`);
    if (!fs.existsSync(f)) { console.error(`FALTA ${f}`); process.exit(1); }
    paginas[c] = JSON.parse(fs.readFileSync(f, 'utf8'));
  }
  const motores = [...new Set(Object.values(paginas).map((p) => p.motor.versao))];
  if (motores.length !== 1) {
    console.error(`as combinações não correram todas no mesmo motor: ${motores.join(', ')}`);
    process.exit(1);
  }

  const linhas = [];
  for (const fam of FAMILIAS) {
    const d = { familia: fam.nome, papel: fam.papel };
    if (fam.vazio) { d.vazio = fam.vazio; linhas.push(d); continue; }

    const t = tipo.familias[fam.chave];
    const P = fam.deCombinacao ? paginas[fam.deCombinacao] : null;

    /* 1 · a altura de x, LIDA NO NAVEGADOR.
       A célula de onde se lê é a mesma para todas as famílias (página de
       leitura, 390 px, 1×), e o número não depende dela: `canvas.measureText`
       mede o tipo carregado, não a página. Fica dita a célula à mesma. */
    const cel = P ? P.celulas.find((c) => c.pagina === 'leitura' && c.largura === 390 && c.densidade === 1) : null;
    const noNav = (corpo) => {
      if (!cel) return null;
      const k = (fam.qual === 'prosa' ? 'prosa_' : 'instr_') + corpo;
      const m = cel.medida1[k];
      if (!m) return null;
      if (!m.carregou) {
        throw new Error(`medida 1: em ${fam.deCombinacao} o tipo de ${fam.nome} não pesou na composição `
          + `(a pilha «${m.fonte_pedida}» mediu o mesmo que o recuo). Nenhum número sai daqui.`);
      }
      return m;
    };
    const x17 = noNav('17'), x15 = noNav('15'), x135 = noNav('13_5');
    d.medida1 = {
      lida_na_celula: cel ? { pagina: cel.pagina, largura: cel.largura, densidade: cel.densidade } : null,
      no_navegador_17px: x17 ? x17.x : null,
      no_navegador_15px: x15 ? x15.x : null,
      no_navegador_13_5px: x135 ? x135.x : null,
      largura_do_x_17px: x17 ? x17.largura_x : null,
      altura_do_X_17px: x17 ? x17.X : null,
      x_em_no_ecra_17px: x17 ? +(x17.x / 17).toFixed(4) : null,
      x_em_no_ecra_15px: x15 ? +(x15.x / 15).toFixed(4) : null,
      x_em_do_ficheiro: t.razao_x_altura,
      do_ficheiro_x_a_17px: t.altura_x_px_17,
      /* A DIFERENÇA ENTRE AS DUAS LEITURAS, e é ela que justifica a correção.
         Num tipo sem eixo ótico o ficheiro e o ecrã dizem o mesmo; num tipo com
         `opsz` não dizem, porque o desenho de 17 px não é o desenho médio do
         ficheiro. A primeira ronda pôs na tabela a leitura do ficheiro. */
      diferenca_ficheiro_menos_ecra_17px: x17 ? +(t.altura_x_px_17 - x17.x).toFixed(4) : null,
      tem_eixo_optico: Object.keys(t.eixos || {}).includes('opsz'),
    };

    /* 2 · o traço mais fino a 1×, nas cinco páginas e nas sete larguras. */
    const alvo = fam.qual === 'prosa' ? 'prosa' : 'numeros';
    const m2 = P ? P.medida2.filter((m) => m.alvo === alvo) : [];
    const picos = m2.map((m) => m.pico_mediano_1px).filter((v) => typeof v === 'number');
    d.medida2 = m2.length ? {
      celulas: m2.length,
      larguras: [...new Set(m2.map((m) => m.largura))].sort((a, b) => a - b),
      paginas: [...new Set(m2.map((m) => m.pagina))],
      traco_mais_fino_px: Math.min(...m2.map((m) => m.traco_mais_fino_px ?? Infinity)),
      pico_mediano_1px: mediana(picos),
      pico_pior: picos.length ? +Math.min(...picos).toFixed(4) : null,
      pico_melhor: picos.length ? +Math.max(...picos).toFixed(4) : null,
      corridas_de_1px: m2.reduce((a, m) => a + (m.corridas_de_1px || 0), 0),
      fracao_corridas_palidas: mediana(m2.map((m) => m.fracao_corridas_palidas)),
      celulas_que_desaparecem: m2.filter((m) => m.desaparece).length,
      por_celula: m2.map((m) => ({
        pagina: m.pagina, largura: m.largura, pico_mediano_1px: m.pico_mediano_1px,
        corridas_de_1px: m.corridas_de_1px, desaparece: m.desaparece, recorte: m.recorte,
      })),
    } : null;

    /* 3 · aberturas, a 17 px e A 1×, que é o que a rubrica pede.
       A leitura de 12× fica ao lado, dita como contexto e fora da ordem: a
       primeira ronda ordenou por ela, e isso é medir outra coisa. */
    const A = abert.familias[fam.nome];
    const emPx = (dsf, l) => (A && A.por_densidade[dsf] ? A.por_densidade[dsf][l].px_de_css : null);
    d.medida3 = A ? {
      peso_medido: A.peso,
      a_17px_1x: { e: emPx('1x', 'e'), a: emPx('1x', 'a'), s: emPx('1x', 's'), c: emPx('1x', 'c'), o: emPx('1x', 'o') },
      contexto_fora_da_ordem: {
        a_17px_3x: { e: emPx('3x', 'e'), a: emPx('3x', 'a'), s: emPx('3x', 's'), c: emPx('3x', 'c') },
        a_17px_12x: { e: emPx('12x', 'e'), a: emPx('12x', 'a'), s: emPx('12x', 's'), c: emPx('12x', 'c') },
      },
    } : null;
    const m3pagina = P ? (fam.qual === 'prosa' ? P.medida3_prosa : P.medida3_instrumento) : null;
    if (m3pagina) d.medida3_pela_regua = m3pagina.a_17px_1x;

    /* 4 · tabulares.
       OS ALGARISMOS DA PÁGINA SÃO DO INSTRUMENTO, e não da prosa: as regras que
       pedem `tabular-nums` compõem-se em `--f-instr`. Numa construção
       `literata+bitter` quem desenha os algarismos é a Bitter, e pôr esse número
       na coluna da Literata era dar-lhe crédito por uma letra que não é a dela.
       O que a coluna de prosa traz é a variância lida do FICHEIRO. */
    const comNum = (P && fam.papel === 'instrumento')
      ? P.celulas.filter((c) => c.medida4 && c.medida4.com_tabulares_13_5px) : [];
    if (fam.papel !== 'instrumento') {
      d.medida4_na_pagina_nao_se_aplica =
        'os algarismos das páginas compõem-se em `--f-instr`; nesta construção são da Bitter';
    }
    d.medida4 = {
      tem_feature_tnum: t.tem_tnum,
      variancia_do_ficheiro_15px_padrao: t.variancia_px_15_padrao,
      variancia_do_ficheiro_15px_tnum: t.variancia_px_15_tnum,
      variancia_na_pagina_13_5px: comNum.length
        ? +(comNum.reduce((a, c) => a + c.medida4.com_tabulares_13_5px.variancia, 0) / comNum.length).toFixed(6) : null,
      vermelho_sem_tabulares_13_5px: comNum.length
        ? +(comNum.reduce((a, c) => a + c.medida4.vermelho_sem_tabulares_13_5px.variancia, 0) / comNum.length).toFixed(6) : null,
      variancia_na_pagina_15px: comNum.length
        ? +(comNum.reduce((a, c) => a + c.medida4.com_tabulares_15px.variancia, 0) / comNum.length).toFixed(6) : null,
      celulas: comNum.length,
      excluida_do_instrumento: fam.papel === 'instrumento' && !t.tem_tnum,
    };

    /* 5 · versaletes */
    d.medida5 = {
      tem_smcp: t.tem_smcp,
      tem_c2sc: (t.features || []).includes('c2sc'),
      como: t.tem_smcp
        ? 'feature `smcp` no próprio ficheiro; o interruptor declara uma família irmã com o descritor `font-feature-settings`'
        : 'sem `smcp` e sem família irmã: as versais ficam na Spectral SC, e o sítio passa a compor duas letras',
    };

    /* 6 · a densidade.
       A da PROSA é a da rubrica: linhas por ecrã a 390 × 844 na página de
       leitura. A do INSTRUMENTO é a que a adenda acrescentou: a ficha do
       aparelho da linha do livro-razão, que é a tabela dessa página composta em
       `--f-instr`. Cada lugar tem a sua e nenhum tem a do outro. */
    const c390 = (P && fam.papel === 'prosa')
      ? P.celulas.find((c) => c.pagina === 'leitura' && c.largura === 390 && c.densidade === 1) : null;
    if (fam.papel !== 'prosa') d.medida6_nao_se_aplica = 'a densidade de leitura é da prosa; este lugar é o do instrumento';
    d.medida6 = c390 && c390.medida6 ? {
      corpo: c390.medida6.corpo, entrelinha: c390.medida6.entrelinha,
      linhas_no_ecra: c390.medida6.linhas_no_ecra,
      linhas_totais: c390.medida6.linhas_totais,
      caracteres_no_ecra: c390.medida6.caracteres_no_ecra,
      caracteres_por_linha: c390.medida6.caracteres_por_linha,
      paragrafos_medidos: c390.medida6.paragrafos_medidos,
    } : null;

    const cLinha = (P && fam.papel === 'instrumento')
      ? P.celulas.find((c) => c.pagina === 'linha' && c.largura === 390 && c.densidade === 1) : null;
    if (fam.papel !== 'instrumento') {
      d.medida6_instrumento_nao_se_aplica =
        'a ficha do aparelho compõe os valores em `--f-instr`; este lugar é o da prosa';
    }
    d.medida6_instrumento = cLinha && cLinha.medida6_instrumento && cLinha.medida6_instrumento.pares
      ? {
        seletor: cLinha.medida6_instrumento.seletor,
        pares: cLinha.medida6_instrumento.pares,
        altura_total_px: cLinha.medida6_instrumento.altura_total_px,
        pares_no_ecra: cLinha.medida6_instrumento.pares_no_ecra,
        caracteres_no_ecra: cLinha.medida6_instrumento.caracteres_no_ecra,
      } : null;

    /* 7 · bytes, normalizados. A soma pára se um nome não existir. */
    const carga = CARGA[fam.nome];
    d.medida7 = carga ? {
      ficheiros: carga.ficheiros.map((f) => ({ ficheiro: f, bytes: bytes[f] ?? null })),
      total_bytes: somaDosFicheiros(carga.ficheiros, bytes),
      razao: carga.razao,
      carrega_a_mais: carga.aMais,
    } : null;

    /* 7 bis · o que o sítio inteiro carregaria: esta família mais o instrumento
       de controlo (Bitter), porque é a combinação que as construções mediram. */
    if (d.medida7 && fam.papel === 'prosa') {
      const bitter = somaDosFicheiros(CARGA.Bitter.ficheiros, bytes);
      d.medida7.total_do_sitio_com_bitter_bytes = d.medida7.total_bytes + bitter;
    }

    /* 8 · a leitura cega */
    d.medida8 = 'fase do lugar de direção: as pranchas ficam feitas, a leitura não é minha';

    if (fam.excluida) d.excluida_porque = 'a medida 4: sem `tnum` no ficheiro de montante';
    if (fam.nota) d.nota = fam.nota;
    linhas.push(d);
  }

  /* ---------------------------------------------------------------- *
   * O FICHEIRO CÉLULA A CÉLULA
   *
   * A leitura cruzada apontou que o JSON da primeira ronda afirmava 525 células
   * e não trazia nenhuma. Este traz todas, uma linha por (combinação × página ×
   * largura × densidade), com as duas famílias que compõem essa página nomeadas
   * e cada medida do lado do lugar a que pertence.
   * ---------------------------------------------------------------- */
  const celulas = [];
  for (const c of COMBINACOES) {
    const [prosa, instr] = c.split('+');
    const rotulo = { spectral: 'Spectral', newsreader: 'Newsreader', sourceserif4: 'Source Serif 4',
      literata: 'Literata', ledger: 'Ledger', bitter: 'Bitter', publicsans: 'Public Sans' };
    const P = paginas[c];
    const m2 = new Map();
    for (const m of P.medida2) m2.set(`${m.pagina}|${m.largura}|${m.alvo}`, m);
    for (const cel of P.celulas) {
      const chave = `${cel.pagina}|${cel.largura}`;
      const p2 = m2.get(`${chave}|prosa`), n2 = m2.get(`${chave}|numeros`);
      celulas.push({
        combinacao: c,
        familia_prosa: rotulo[prosa],
        familia_instrumento: rotulo[instr],
        pagina: cel.pagina,
        rota: cel.rota,
        largura: cel.largura,
        densidade: cel.densidade,
        captura: cel.captura,
        medida1_prosa_x_17px: cel.medida1.prosa_17.x,
        medida1_prosa_x_15px: cel.medida1.prosa_15.x,
        medida1_prosa_x_13_5px: cel.medida1.prosa_13_5.x,
        medida1_instr_x_17px: cel.medida1.instr_17.x,
        medida1_instr_x_15px: cel.medida1.instr_15.x,
        medida1_instr_x_13_5px: cel.medida1.instr_13_5.x,
        medida1_carregou: cel.medida1.prosa_17.carregou && cel.medida1.instr_17.carregou,
        medida2_prosa_pico_1px: cel.densidade === 1 ? (p2 ? p2.pico_mediano_1px : null) : null,
        medida2_prosa_corridas_1px: cel.densidade === 1 ? (p2 ? p2.corridas_de_1px : null) : null,
        medida2_prosa_traco_mais_fino_px: cel.densidade === 1 ? (p2 ? p2.traco_mais_fino_px : null) : null,
        medida2_prosa_desaparece: cel.densidade === 1 ? (p2 ? p2.desaparece : null) : null,
        medida2_prosa_recorte: cel.densidade === 1 ? (p2 ? p2.recorte : null) : null,
        medida2_instr_pico_1px: cel.densidade === 1 ? (n2 ? n2.pico_mediano_1px : null) : null,
        medida2_instr_corridas_1px: cel.densidade === 1 ? (n2 ? n2.corridas_de_1px : null) : null,
        medida2_instr_recorte: cel.densidade === 1 ? (n2 ? n2.recorte : null) : null,
        medida2_nao_corre: cel.densidade === 1 ? null : 'a medida 2 é a 1×, e esta célula é a ' + cel.densidade + '×',
        medida4_seletor: cel.medida4 ? cel.medida4.seletor : null,
        medida4_corpo_herdado: cel.medida4 ? cel.medida4.com_tabulares.ficha.tamanho : null,
        medida4_variancia_herdada: cel.medida4 ? cel.medida4.com_tabulares.variancia : null,
        medida4_variancia_15px: cel.medida4 ? cel.medida4.com_tabulares_15px.variancia : null,
        medida4_vermelho_15px: cel.medida4 ? cel.medida4.vermelho_sem_tabulares_15px.variancia : null,
        medida4_variancia_13_5px: cel.medida4 ? cel.medida4.com_tabulares_13_5px.variancia : null,
        medida4_vermelho_13_5px: cel.medida4 ? cel.medida4.vermelho_sem_tabulares_13_5px.variancia : null,
        medida6_corpo: cel.medida6 ? cel.medida6.corpo : null,
        medida6_entrelinha: cel.medida6 ? cel.medida6.entrelinha : null,
        medida6_linhas_no_ecra: cel.medida6 ? cel.medida6.linhas_no_ecra : null,
        medida6_caracteres_no_ecra: cel.medida6 ? cel.medida6.caracteres_no_ecra : null,
        medida6_caracteres_por_linha: cel.medida6 ? cel.medida6.caracteres_por_linha : null,
        medida6_instr_altura_px: cel.medida6_instrumento.altura_total_px ?? null,
        medida6_instr_pares_no_ecra: cel.medida6_instrumento.pares_no_ecra ?? null,
        medida6_instr_razao: cel.medida6_instrumento.razao ?? null,
      });
    }
  }
  fs.writeFileSync(path.join(ESTUDO, 'MEDIDAS-2-celulas.json'), JSON.stringify({
    ronda: 2,
    o_que_e: 'uma linha por combinação × página × largura × densidade, com as medidas de cada lugar. '
      + 'As medidas 3, 5 e 7 não estão aqui porque não são da célula: a abertura e os versaletes são do '
      + 'desenho e os bytes são do ficheiro. Estão em MEDIDAS-2.json.',
    motor: Object.values(paginas)[0].motor,
    grelha: {
      combinacoes: COMBINACOES.length, paginas: 5, larguras: 7, densidades: 3,
      celulas_esperadas: COMBINACOES.length * 5 * 7 * 3, celulas_escritas: celulas.length,
    },
    celulas,
  }, null, 2) + '\n');
  console.log(`escrito design/tipografia/MEDIDAS-2-celulas.json (${celulas.length} células)`);

  const fora = {
    ronda: 2,
    rubrica: 'design/tipografia/RUBRICA.md',
    adenda: 'design/tipografia/ADENDA-2-segunda-ronda.md',
    motor: Object.values(paginas)[0].motor,
    combinacoes: COMBINACOES,
    grelha: {
      larguras: [320, 360, 390, 430, 768, 1024, 1280],
      densidades: [1, 2, 3],
      paginas: ['primeira', 'concelho', 'regiao', 'linha', 'leitura'],
      celulas_medidas: Object.values(paginas).reduce((a, p) => a + p.celulas.length, 0),
      celulas_da_medida_2: Object.values(paginas).reduce((a, p) => a + p.medida2.length, 0),
    },
    provas_dos_detetores: {
      todas: 'design/tipografia/programa/provas.mjs, corrido pela régua antes de medir e pelo `correr.sh` antes de tudo',
      medida_2_e_3: 'design/tipografia/programa/pixeis.mjs, treze casos conhecidos',
      medida_4_no_ficheiro: tipo.prova_do_detetor,
      medida_4_na_pagina: Object.fromEntries(
        Object.entries(paginas).map(([k, v]) => [k, v.prova_do_detetor_dos_tabulares.veredicto])),
    },
    familias: linhas,
    por_combinacao: Object.fromEntries(Object.entries(paginas).map(([k, v]) => [k, {
      fichas: v.fichas,
      celulas: v.celulas.length,
      medida6_390: v.celulas.filter((c) => c.largura === 390 && c.densidade === 1 && c.medida6)
        .map((c) => ({ pagina: c.pagina, linhas: c.medida6.linhas_no_ecra, caracteres: c.medida6.caracteres_no_ecra, cpl: c.medida6.caracteres_por_linha })),
    }])),
  };
  fs.writeFileSync(path.join(ESTUDO, 'MEDIDAS-2.json'), JSON.stringify(fora, null, 2) + '\n');
  console.log('escrito design/tipografia/MEDIDAS-2.json');

  /* A tabela das oito linhas, por família. */
  const cols = linhas.map((l) => l.familia);
  const cel = (l, f) => (l.vazio ? '—' : f(l));
  const filas = [
    ['1 · altura de x a 17 px, no navegador (px)', (l) => (l.medida1 ? n(l.medida1.no_navegador_17px) : '—')],
    ['1 · altura de x a 15 px, no navegador (px)', (l) => (l.medida1 ? n(l.medida1.no_navegador_15px) : '—')],
    ['1 · altura de x a 13,5 px, no navegador (px)', (l) => (l.medida1 ? n(l.medida1.no_navegador_13_5px) : '—')],
    ['1 · x/em no ecrã a 17 px', (l) => (l.medida1 ? n(l.medida1.x_em_no_ecra_17px, 3) : '—')],
    ['1 · x/em do ficheiro (para contraste)', (l) => (l.medida1 ? n(l.medida1.x_em_do_ficheiro, 3) : '—')],
    ['1 · o ficheiro menos o ecrã, a 17 px (px)', (l) => (l.medida1 ? n(l.medida1.diferenca_ficheiro_menos_ecra_17px, 3) : '—')],
    ['2 · traço sólido mais fino a 1× (px)', (l) => (l.medida2 ? n(l.medida2.traco_mais_fino_px, 0) : '—')],
    ['2 · tinta mediana numa corrida de 1 px (35 células)', (l) => (l.medida2 ? n(l.medida2.pico_mediano_1px, 3) : '—')],
    ['2 · a pior célula das 35', (l) => (l.medida2 ? n(l.medida2.pico_pior, 3) : '—')],
    ['2 · a melhor célula das 35', (l) => (l.medida2 ? n(l.medida2.pico_melhor, 3) : '—')],
    ['2 · células em que desaparece', (l) => (l.medida2 ? `${l.medida2.celulas_que_desaparecem} de ${l.medida2.celulas}` : '—')],
    ['3 · abertura «e» a 17 px e 1× (px)', (l) => (l.medida3 ? n(l.medida3.a_17px_1x.e, 0) : '—')],
    ['3 · abertura «a» a 17 px e 1× (px)', (l) => (l.medida3 ? n(l.medida3.a_17px_1x.a, 0) : '—')],
    ['3 · abertura «s» a 17 px e 1× (px)', (l) => (l.medida3 ? n(l.medida3.a_17px_1x.s, 0) : '—')],
    ['3 · a mesma «e» a 12×, ÷ 12 (contexto, fora da ordem)', (l) => (l.medida3 ? n(l.medida3.contexto_fora_da_ordem.a_17px_12x.e) : '—')],
    ['3 · peso a que a abertura foi medida', (l) => (l.medida3 ? String(l.medida3.peso_medido) : '—')],
    ['4 · feature `tnum`', (l) => (l.medida4.tem_feature_tnum ? 'sim' : 'NÃO')],
    ['4 · variância de «0»–«9» a 15 px, no ficheiro, com `tnum`', (l) => (l.medida4.variancia_do_ficheiro_15px_tnum === null ? '—' : n(l.medida4.variancia_do_ficheiro_15px_tnum, 4))],
    ['4 · a mesma, sem `tnum` (os algarismos por defeito)', (l) => n(l.medida4.variancia_do_ficheiro_15px_padrao, 4)],
    ['4 · variância na página a 13,5 px (só o instrumento)', (l) => (l.medida4.variancia_na_pagina_13_5px === null ? '—' : n(l.medida4.variancia_na_pagina_13_5px, 4))],
    ['4 · a mesma, tirados os tabulares (o vermelho)', (l) => (l.medida4.vermelho_sem_tabulares_13_5px === null ? '—' : n(l.medida4.vermelho_sem_tabulares_13_5px, 4))],
    ['5 · versaletes `smcp`', (l) => (l.medida5.tem_smcp ? 'sim' : 'não · Spectral SC')],
    ['6 · linhas por ecrã a 390 × 844 (prosa)', (l) => (l.medida6 ? String(l.medida6.linhas_no_ecra) : '—')],
    ['6 · caracteres por linha', (l) => (l.medida6 ? n(l.medida6.caracteres_por_linha, 1) : '—')],
    ['6 · caracteres no ecrã', (l) => (l.medida6 ? String(l.medida6.caracteres_no_ecra) : '—')],
    ['6 · altura da ficha do aparelho a 390 px (instrumento)', (l) => (l.medida6_instrumento ? n(l.medida6_instrumento.altura_total_px, 1) : '—')],
    ['6 · pares dela que cabem no ecrã', (l) => (l.medida6_instrumento ? `${l.medida6_instrumento.pares_no_ecra} de ${l.medida6_instrumento.pares}` : '—')],
    ['7 · ficheiros que o sítio carregaria', (l) => (l.medida7 ? String(l.medida7.ficheiros.length) : '—')],
    ['7 · total em KiB (WOFF2 latino)', (l) => (l.medida7 ? kb(l.medida7.total_bytes) : '—')],
    ['7 · o sítio inteiro, com a Bitter, em KiB', (l) => (l.medida7 && l.medida7.total_do_sitio_com_bitter_bytes ? kb(l.medida7.total_do_sitio_com_bitter_bytes) : '—')],
    ['8 · leitura cega', () => 'direção'],
  ];
  let md = '| medida | ' + cols.join(' | ') + ' |\n';
  md += '|---'.repeat(cols.length + 1) + '|\n';
  for (const [rot, f] of filas) {
    md += `| ${rot} | ` + linhas.map((l) => cel(l, f)).join(' | ') + ' |\n';
  }
  fs.writeFileSync(path.join(ESTUDO, 'TABELA-2.md'), md);
  console.log('escrito design/tipografia/TABELA-2.md');
  console.log('\n' + md);
}

if (import.meta.url === `file://${process.argv[1]}`) principal();
