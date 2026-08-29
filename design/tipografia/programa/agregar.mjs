/**
 * AS MEDIDAS DE TODAS AS COMBINAÇÕES NUM SÓ FICHEIRO, E A TABELA DA RUBRICA.
 *
 * Lê `medidas/<combinacao>.json` (a régua nas páginas), `MEDIDAS-tipo.json` (o
 * que está dentro dos ficheiros) e `tipos/SUBCONJUNTOS.json` (os bytes), e
 * escreve `MEDIDAS.json` com tudo e a tabela das oito linhas da rubrica, por
 * família, em Markdown, para entrar em `NOTAS.md`.
 *
 * Uma medida que não existe escreve-se `—` e diz-se porquê. Nenhuma célula
 * desta tabela é preenchida por analogia com outra.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..');
const ESTUDO = path.join(RAIZ, 'design', 'tipografia');

const COMBINACOES = [
  'spectral+bitter', 'newsreader+bitter', 'sourceserif4+bitter',
  'literata+bitter', 'spectral+publicsans',
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
  { nome: 'Parnaso Standard', papel: 'prosa', chave: null, deCombinacao: null, qual: null, vazio: 'o pacote de teste não existe: só o diretor o pode pedir' },
  { nome: 'Parnaso Small', papel: 'prosa', chave: null, deCombinacao: null, qual: null, vazio: 'o pacote de teste não existe: só o diretor o pode pedir' },
  { nome: 'Bitter', papel: 'instrumento', chave: 'Bitter', deCombinacao: 'spectral+bitter', qual: 'instr', nota: 'controlo: o sítio de hoje' },
  { nome: 'Public Sans', papel: 'instrumento', chave: 'Public Sans', deCombinacao: 'spectral+publicsans', qual: 'instr' },
  { nome: 'IBM Plex Sans', papel: 'instrumento', chave: 'IBM Plex Sans', deCombinacao: null, qual: null, excluida: true },
  { nome: 'Sebenta', papel: 'instrumento', chave: null, deCombinacao: null, qual: null, vazio: 'o pacote de teste não existe: só o diretor o pode pedir' },
];

/** Os ficheiros que o sítio carregaria com cada família no lugar da prosa. */
const CARGA = {
  Spectral: {
    ficheiros: ['spectral/Spectral-Regular-latin.woff2', 'spectral/Spectral-Italic-latin.woff2',
      'spectral/Spectral-Medium-latin.woff2', 'spectral/Spectral-SemiBold-latin.woff2',
      'spectral/Spectral-Bold-latin.woff2', 'spectral-sc/SpectralSC-Regular-latin.woff2',
      'spectral-sc/SpectralSC-SemiBold-latin.woff2'],
    razao: 'cinco estáticos da prosa mais dois das versais: a Spectral não é variável',
  },
  Newsreader: {
    ficheiros: ['newsreader/Newsreader-latin.woff2', 'newsreader/Newsreader-Italic-latin.woff2',
      'spectral-sc/SpectralSC-Regular-latin.woff2', 'spectral-sc/SpectralSC-SemiBold-latin.woff2'],
    razao: 'um variável e o itálico; as versais continuam a ser a Spectral SC, porque a Newsreader não tem `smcp`',
  },
  'Source Serif 4': {
    ficheiros: ['sourceserif4/SourceSerif4-latin.woff2', 'sourceserif4/SourceSerif4-Italic-latin.woff2'],
    razao: 'um variável e o itálico; as versais saem do mesmo ficheiro pelo `smcp`, e não pesam nada',
  },
  Literata: {
    ficheiros: ['literata/Literata-latin.woff2', 'literata/Literata-Italic-latin.woff2'],
    razao: 'um variável e o itálico; as versais saem do mesmo ficheiro pelo `smcp`',
  },
  Bitter: { ficheiros: ['bitter/Bitter-latin.woff2'], razao: 'um variável, todos os pesos' },
  'Public Sans': { ficheiros: ['publicsans/PublicSans-latin.woff2'], razao: 'um variável, todos os pesos' },
  'IBM Plex Sans': { ficheiros: ['ibmplexsans/IBMPlexSans-latin.woff2'], razao: 'um variável; não entra, ver linha 4' },
};

const n = (v, casas = 2) => (v === null || v === undefined ? '—' : Number(v).toFixed(casas));
const kb = (b) => (b / 1024).toFixed(1);

function principal() {
  const tipo = JSON.parse(fs.readFileSync(path.join(ESTUDO, 'MEDIDAS-tipo.json'), 'utf8'));
  const sub = JSON.parse(fs.readFileSync(path.join(ESTUDO, 'tipos', 'SUBCONJUNTOS.json'), 'utf8'));
  const abert = JSON.parse(fs.readFileSync(path.join(ESTUDO, 'MEDIDAS-aberturas.json'), 'utf8'));
  const bytes = Object.fromEntries(sub.ficheiros.map((f) => [f.saida.replace('design/tipografia/tipos/', ''), f.bytes]));

  const paginas = {};
  for (const c of COMBINACOES) {
    const f = path.join(ESTUDO, 'medidas', `${c}.json`);
    if (!fs.existsSync(f)) { console.error(`FALTA ${f}`); process.exit(1); }
    paginas[c] = JSON.parse(fs.readFileSync(f, 'utf8'));
  }

  const linhas = [];
  for (const fam of FAMILIAS) {
    const d = { familia: fam.nome, papel: fam.papel };
    if (fam.vazio) { d.vazio = fam.vazio; linhas.push(d); continue; }

    const t = tipo.familias[fam.chave];
    const P = fam.deCombinacao ? paginas[fam.deCombinacao] : null;

    /* 1 · altura de x */
    const cel17 = P ? P.celulas.find((c) => c.pagina === 'leitura' && c.largura === 390 && c.densidade === 1) : null;
    d.medida1 = {
      do_ficheiro_x_em: t.razao_x_altura,
      x_a_17px: t.altura_x_px_17,
      x_a_15px: t.altura_x_px_15,
      no_navegador_17px: cel17 ? cel17.medida1[fam.qual === 'prosa' ? 'prosa_17' : 'instr_17'].x : null,
      no_navegador_15px: cel17 ? cel17.medida1[fam.qual === 'prosa' ? 'prosa_15' : 'instr_15'].x : null,
    };

    /* 2 · o traço mais fino a 1× */
    const alvo = fam.qual === 'prosa' ? 'prosa' : 'numeros';
    const m2 = P ? P.medida2.filter((m) => m.alvo === alvo) : [];
    d.medida2 = m2.length ? {
      recortes: m2.length,
      traco_mais_fino_px: Math.min(...m2.map((m) => m.traco_mais_fino_px ?? Infinity)),
      pico_mediano_1px: +(m2.reduce((a, m) => a + (m.pico_mediano_1px ?? 0), 0) / m2.length).toFixed(4),
      fracao_corridas_palidas: +(m2.reduce((a, m) => a + (m.fracao_corridas_palidas ?? 0), 0) / m2.length).toFixed(4),
      desaparece: m2.some((m) => m.desaparece),
      por_recorte: m2.map((m) => ({ pagina: m.pagina, largura: m.largura, pico_mediano_1px: m.pico_mediano_1px, desaparece: m.desaparece })),
    } : null;

    /* 3 · aberturas
       Lidas de `MEDIDAS-aberturas.json`, que mede POR FAMÍLIA e não por
       combinação: a abertura de um «e» é do desenho e não da página. O número
       de 1× é o que a rubrica pede; o de 12× é o que ordena as famílias, porque
       a 1× todas leem um píxel. */
    const A = abert.familias[fam.nome];
    const emPx = (dsf, l) => (A && A.por_densidade[dsf] ? A.por_densidade[dsf][l].px_de_css : null);
    d.medida3 = A ? {
      peso_medido: A.peso,
      a_17px_1x: { e: emPx('1x', 'e'), a: emPx('1x', 'a'), s: emPx('1x', 's'), o: emPx('1x', 'o') },
      a_17px_3x: { e: emPx('3x', 'e'), a: emPx('3x', 'a'), s: emPx('3x', 's') },
      a_17px_12x: { e: emPx('12x', 'e'), a: emPx('12x', 'a'), s: emPx('12x', 's'), c: emPx('12x', 'c'), o: emPx('12x', 'o') },
    } : null;
    /* A régua da página mediu a mesma coisa a 1× e a 3×, e fica ao lado como
       segunda leitura, feita noutro caminho e com o tipo composto pela folha do
       sítio e não por um espécime. */
    const m3pagina = P ? (fam.qual === 'prosa' ? P.medida3_prosa : P.medida3_instrumento) : null;
    if (m3pagina) d.medida3_pela_regua = m3pagina;

    /* 4 · tabulares */
    /* OS ALGARISMOS DA PÁGINA SÃO DO INSTRUMENTO, e não da prosa. As 143 regras
       que pedem `tabular-nums` compõem-se em `--f-instr`; numa construção
       `literata+bitter` quem desenha os algarismos é a Bitter. A variância
       medida na página só diz respeito à coluna do instrumento, e nas colunas
       de prosa fica vazia com esta razão. O que a coluna de prosa traz é a
       variância lida do FICHEIRO, que é uma propriedade da família. */
    const comNum = (P && fam.papel === 'instrumento')
      ? P.celulas.filter((c) => c.medida4 && c.medida4.com_tabulares_15px) : [];
    if (fam.papel !== 'instrumento') {
      d.medida4_na_pagina_nao_se_aplica =
        'os algarismos das páginas compõem-se em `--f-instr`; nesta construção são da Bitter';
    }
    d.medida4 = {
      tem_feature_tnum: t.tem_tnum,
      variancia_do_ficheiro_15px_padrao: t.variancia_px_15_padrao,
      variancia_do_ficheiro_15px_tnum: t.variancia_px_15_tnum,
      variancia_na_pagina_15px: comNum.length
        ? +(comNum.reduce((a, c) => a + c.medida4.com_tabulares_15px.variancia, 0) / comNum.length).toFixed(6) : null,
      vermelho_sem_tabulares_15px: comNum.length
        ? +(comNum.reduce((a, c) => a + c.medida4.vermelho_sem_tabulares_15px.variancia, 0) / comNum.length).toFixed(6) : null,
      celulas: comNum.length,
      excluida: !t.tem_tnum,
    };

    /* 5 · versaletes */
    d.medida5 = {
      tem_smcp: t.tem_smcp,
      tem_c2sc: (t.features || []).includes('c2sc'),
      como: t.tem_smcp
        ? 'feature `smcp` no próprio ficheiro; o interruptor declara uma família irmã com o descritor `font-feature-settings`'
        : 'sem `smcp` e sem família irmã: as versais ficam na Spectral SC',
    };

    /* 6 · linhas por ecrã a 390 × 844, na página de leitura */
    /* A MEDIDA 6 É DA PROSA, E SÓ DA PROSA. Numa construção `spectral+publicsans`
       o texto corrido continua a ser Spectral: pôr esse número na coluna da
       Public Sans era dar-lhe o crédito da densidade de outra letra. Nas
       colunas de instrumento a célula fica vazia, e a razão fica escrita. */
    const c390 = (P && fam.papel === 'prosa')
      ? P.celulas.find((c) => c.pagina === 'leitura' && c.largura === 390 && c.densidade === 1) : null;
    if (fam.papel !== 'prosa') d.medida6_nao_se_aplica = 'a densidade de leitura é da prosa; este lugar é o do instrumento';
    d.medida6 = c390 && c390.medida6 ? {
      corpo: c390.medida6.corpo, entrelinha: c390.medida6.entrelinha,
      linhas_no_ecra: c390.medida6.linhas_no_ecra,
      caracteres_no_ecra: c390.medida6.caracteres_no_ecra,
      /* Caracteres por linha do CONJUNTO dos parágrafos, e não do primeiro.
         O valor que a régua guarda por parágrafo dava 42,0 tanto à Spectral
         como à Newsreader, que é o que acontece quando se divide o comprimento
         de um parágrafo pelo seu número de linhas e o resultado calha no mesmo
         inteiro. Este divide o total do ecrã pelas linhas do ecrã. */
      caracteres_por_linha: c390.medida6.linhas_no_ecra
        ? +(c390.medida6.caracteres_no_ecra / c390.medida6.linhas_no_ecra).toFixed(2) : null,
      caracteres_por_linha_do_primeiro_paragrafo: c390.medida6.caracteres_por_linha,
    } : null;

    /* 7 · bytes */
    const carga = CARGA[fam.nome];
    d.medida7 = carga ? {
      ficheiros: carga.ficheiros.map((f) => ({ ficheiro: f, bytes: bytes[f] ?? null })),
      total_bytes: carga.ficheiros.reduce((a, f) => a + (bytes[f] ?? 0), 0),
      razao: carga.razao,
    } : null;

    /* 7 bis · o que o sítio inteiro carregaria: esta família mais o instrumento
       de controlo (Bitter), porque é a combinação que as construções mediram. */
    if (d.medida7 && fam.papel === 'prosa') {
      const bitter = CARGA.Bitter.ficheiros.reduce((a, f) => a + (bytes[f] ?? 0), 0);
      d.medida7.total_do_sitio_com_bitter_bytes = d.medida7.total_bytes + bitter;
    }

    /* 8 · a leitura cega */
    d.medida8 = 'fase do lugar de direção: as pranchas ficam feitas, a leitura não é minha';

    if (fam.excluida) d.excluida_porque = 'a medida 4: sem `tnum` no ficheiro de montante';
    if (fam.nota) d.nota = fam.nota;
    linhas.push(d);
  }

  const fora = {
    escrito: new Date().toISOString(),
    rubrica: 'design/tipografia/RUBRICA.md',
    combinacoes: COMBINACOES,
    grelha: {
      larguras: [320, 360, 390, 430, 768, 1024, 1280],
      densidades: [1, 2, 3],
      paginas: ['primeira', 'concelho', 'regiao', 'linha', 'leitura'],
      celulas_medidas: Object.values(paginas).reduce((a, p) => a + p.celulas.length, 0),
    },
    provas_dos_detetores: {
      medida_2_e_3: 'design/tipografia/programa/pixeis.mjs, treze casos conhecidos, corre e pára se algum falhar',
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
  fs.writeFileSync(path.join(ESTUDO, 'MEDIDAS.json'), JSON.stringify(fora, null, 2) + '\n');
  console.log('escrito design/tipografia/MEDIDAS.json');

  /* A tabela das oito linhas, por família. */
  const cols = linhas.map((l) => l.familia);
  const cel = (l, f) => (l.vazio ? '—' : f(l));
  const filas = [
    ['1 · altura de x a 17 px (px)', (l) => n(l.medida1.x_a_17px)],
    ['1 · altura de x a 15 px (px)', (l) => n(l.medida1.x_a_15px)],
    ['1 · x/em', (l) => n(l.medida1.do_ficheiro_x_em, 3)],
    ['2 · traço sólido mais fino a 1× (px)', (l) => (l.medida2 ? n(l.medida2.traco_mais_fino_px, 0) : '—')],
    ['2 · tinta mediana numa corrida de 1 px', (l) => (l.medida2 ? n(l.medida2.pico_mediano_1px, 3) : '—')],
    ['2 · desaparece a 1×', (l) => (l.medida2 ? (l.medida2.desaparece ? 'sim' : 'não') : '—')],
    ['3 · abertura «e» a 17 px (px de CSS, lida a 12×)', (l) => (l.medida3 ? n(l.medida3.a_17px_12x.e) : '—')],
    ['3 · abertura «a» a 17 px (px de CSS, lida a 12×)', (l) => (l.medida3 ? n(l.medida3.a_17px_12x.a) : '—')],
    ['3 · abertura «s» a 17 px (px de CSS, lida a 12×)', (l) => (l.medida3 ? n(l.medida3.a_17px_12x.s) : '—')],
    ['3 · abertura «c» a 17 px (px de CSS, lida a 12×)', (l) => (l.medida3 ? n(l.medida3.a_17px_12x.c) : '—')],
    ['3 · a mesma abertura «e» a 1×, como a rubrica pede', (l) => (l.medida3 ? n(l.medida3.a_17px_1x.e, 0) : '—')],
    ['3 · peso a que a abertura foi medida', (l) => (l.medida3 ? String(l.medida3.peso_medido) : '—')],
    ['4 · feature `tnum`', (l) => (l.medida4.tem_feature_tnum ? 'sim' : 'NÃO · excluída')],
    ['4 · variância de «0»–«9» a 15 px, no ficheiro, com `tnum`', (l) => (l.medida4.variancia_do_ficheiro_15px_tnum === null ? '—' : n(l.medida4.variancia_do_ficheiro_15px_tnum, 4))],
    ['4 · a mesma, sem `tnum` (os algarismos por defeito)', (l) => n(l.medida4.variancia_do_ficheiro_15px_padrao, 4)],
    ['4 · variância na página a 15 px (só o instrumento)', (l) => (l.medida4.variancia_na_pagina_15px === null ? '—' : n(l.medida4.variancia_na_pagina_15px, 4))],
    ['4 · a mesma, tirados os tabulares (o vermelho)', (l) => (l.medida4.vermelho_sem_tabulares_15px === null ? '—' : n(l.medida4.vermelho_sem_tabulares_15px, 4))],
    ['5 · versaletes `smcp`', (l) => (l.medida5.tem_smcp ? 'sim' : 'não · Spectral SC')],
    ['6 · linhas por ecrã a 390 × 844', (l) => (l.medida6 ? String(l.medida6.linhas_no_ecra) : '—')],
    ['6 · caracteres por linha', (l) => (l.medida6 ? n(l.medida6.caracteres_por_linha, 1) : '—')],
    ['6 · caracteres no ecrã', (l) => (l.medida6 ? String(l.medida6.caracteres_no_ecra) : '—')],
    ['7 · ficheiros que o sítio carregaria', (l) => (l.medida7 ? String(l.medida7.ficheiros.length) : '—')],
    ['7 · total em KiB (WOFF2 latino)', (l) => (l.medida7 ? kb(l.medida7.total_bytes) : '—')],
    ['7 · o sítio inteiro, com a Bitter, em KiB', (l) => (l.medida7 && l.medida7.total_do_sitio_com_bitter_bytes ? kb(l.medida7.total_do_sitio_com_bitter_bytes) : '—')],
    ['8 · leitura cega', () => 'direção'],
  ];
  let md = '| medida | ' + cols.join(' | ') + ' |\n';
  md += '|---' .repeat(cols.length + 1) + '|\n';
  for (const [rot, f] of filas) {
    md += `| ${rot} | ` + linhas.map((l) => cel(l, f)).join(' | ') + ' |\n';
  }
  fs.writeFileSync(path.join(ESTUDO, 'TABELA.md'), md);
  console.log('escrito design/tipografia/TABELA.md');
  console.log('\n' + md);
}

principal();
