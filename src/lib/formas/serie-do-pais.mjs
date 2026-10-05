/**
 * A SÉRIE INTEIRA, NUM EIXO SÓ (RP4).
 * O tempo é o primeiro mês de cada período, em meses de calendário. Assim,
 * janeiro, o primeiro trimestre, o primeiro semestre e o ano têm a mesma
 * origem. Não há janela, amostragem nem interpolação de lacunas.
 *
 * A base do índice é o período que contém janeiro de 2015, para todas as
 * séries. Sem esse ponto, ou com base nula, a linha fica fora com a razão.
 * Só se recusa o desenho quando nenhuma linha tem base utilizável.
 * A escala inclui zero e usa passos 1, 2 ou 5 vezes uma potência de dez.
 * As coordenadas arredondam uma vez, a três casas, só ao sair para o SVG.
 *
 * AS AJUDAS DE LEITURA (bloco RP4-c, 05.10.2026, os pontos 1, 2 e 4 do mandato). Três coisas, e nenhum número que não
 * seja marca de escala ou valor de um ponto com a sua origem:
 *   · o símbolo da unidade nas marcas do eixo dos valores, quando a unidade da série o tem (`simboloDasMarcas`); nas
 *     outras, as marcas ficam sem símbolo e o desenho diz a unidade por extenso numa legenda (`legenda`);
 *   · as décadas no eixo do tempo de uma série que cobre vinte anos ou mais, as que couberem pela regra dos 64 píxeis,
 *     contada da ponta de fora da etiqueta vizinha (`PIXEIS_ATE_A_VIZINHA`, `LARGURA_DE_UM_ANO`);
 *   · a leitura de cada ponto (`leituras`), só nos desenhos que a pedem (`opcoes.leitura`: a primeira página e os
 *     recibos, e nunca os cartões): uma zona por coluna de píxel do campo, contada na menor largura no ecrã, com a
 *     leitura do ponto mais próximo dessa coluna (o ponto marcado, a linha vertical e a etiqueta do valor e do período),
 *     que a folha mostra só ao passar o rato (desde a passagem RP4-c-b; no RP4-c era uma zona por ponto).
 */
import { getSerie, periodoSeguinte } from '../series.mjs';
import { parsePtNumber } from '../ledger.mjs';

export const BASE_DO_INDICE = Object.freeze({ mensal: '2015-01', trimestral: '2015-T1', semestral: '2015-S1', anual: '2015' });
const CADENCIAS = Object.freeze({ mensal: 12, trimestral: 4, semestral: 2, anual: 1 });
/** @param {number} n */
export const coordenada = (n) => String(Number(n.toFixed(3)));

/**
 * A REGRA DOS 64 PÍXEIS DO EIXO DO TEMPO (RP4; contada da ponta de fora da etiqueta vizinha desde o bloco RP4-c,
 * 05.10.2026, o ponto 2 do mandato). Uma marca intermédia só entra a 64 píxeis ou mais da ponta mais afastada da
 * etiqueta de cada marca vizinha. No RP4 as duas marcas das pontas estavam encostadas às pontas do campo (a primeira a
 * começar no primeiro ponto, a última a acabar no último), e por isso a regra media-se das pontas do campo: era a mesma
 * coisa. O RP4-m pôs a última marca em janeiro do último ano, centrada, e a ponta de fora da sua etiqueta deixou de ser
 * a ponta do campo; a regra das séries curtas continua a medir-se das pontas do campo, como o brief manda («nas séries
 * curtas fica a regra de hoje»), e a das décadas mede-se da etiqueta, que é o que a regra sempre guardou: entre duas
 * etiquetas vizinhas ficam pelo menos 64 − 1,5 × `LARGURA_DE_UM_ANO` píxeis.
 */
export const PIXEIS_ATE_A_VIZINHA = 64;

/**
 * A LARGURA DE UM ANO ESCRITO NA LETRA DOS EIXOS, em unidades do desenho (bloco RP4-c, o ponto 2): quatro algarismos de
 * largura fixa (`tabular-nums`) da Bitter a 12 píxeis, medidos no Chromium com `getComputedTextLength()` nas 50
 * etiquetas de ano dos 16 desenhos da primeira página, da página dos preços e do recibo da inflação, nas duas edições,
 * sobre a construção da cabeça `983b4585` (todas 30,25; o registo é `letra-dos-eixos-antes.json`, na pasta das
 * medições do bloco). Um ano de quatro algarismos mede o mesmo em qualquer ano, pela largura fixa dos algarismos.
 */
export const LARGURA_DE_UM_ANO = 30.25;

/** A partir de quantos anos de calendário cobertos o eixo do tempo marca as décadas (o ponto 2 do mandato). */
export const ANOS_PARA_AS_DECADAS = 20;

/**
 * A MENOR LARGURA NO ECRÃ DE UM DESENHO (a passagem RP4-c-b, 05.10.2026, a decisão do lugar de direção sobre a I208): 354
 * píxeis, a largura com que o desenho de 360 da primeira página e dos recibos se rende num ecrã de 390, a menor largura
 * que o sítio serve (os 390 menos as duas margens de 18 píxeis da casa), medida no Chromium nas capturas do bloco (a
 * largura no ecrã de cada desenho a 390, em `capturas.json` na pasta das medições do bloco). Um desenho mais estreito do
 * que isto (os cartões, de 240) rende-se com a sua largura. As colunas da leitura contam-se nesta largura, para cada
 * zona ter pelo menos um píxel também a 390; quem mudar as margens da casa ou a largura dos desenhos mede-a outra vez.
 */
export const MENOR_LARGURA_NO_ECRA = 354;

/**
 * O SÍMBOLO DA UNIDADE NAS MARCAS (bloco RP4-c, 05.10.2026, o ponto 1 do mandato). Só «%»: «15 %» lê-se, e «20,4 % do
 * PIB» não cabe numa marca e vai para a legenda (a decisão 2 do brief). A marca do zero fica sem símbolo («0»).
 *
 * O EURO FICA SEM SÍMBOLO, E É UMA PARAGEM E NÃO UM ESQUECIMENTO. O brief pede «1 835 €» nas marcas; a decisão 4 da
 * §1.127 diz que o dinheiro se escreve com a palavra da unidade, nunca com o símbolo, e a F5 do `check:formato` recusa
 * o símbolo do euro também ao lado das marcas de escala (`MOTIVOS_SO_DO_SIMBOLO`, em
 * `tests/inicio/formato-dos-numeros.mjs`). As duas decisões do lugar de direção discordam, e escolher entre elas é dele;
 * o relatório do bloco tem a medida. Até lá uma série em euros tem as marcas sem símbolo e a legenda com a unidade por
 * extenso, como as outras unidades sem símbolo.
 *
 * No modo indexado as marcas são do índice, e não levam símbolo nenhum.
 * @param {string[]} unidades as unidades das séries do desenho
 * @param {'unidade'|'indice'} modo
 * @returns {'%'|null}
 */
export function simboloDasMarcas(unidades, modo) {
  return modo === 'unidade' && unidades.length > 0 && unidades.every((u) => u === '%') ? '%' : null;
}

/** @param {string} periodo */
export function mesDoPeriodo(periodo) {
  const m = /^(\d{4})(?:-(0[1-9]|1[0-2])|-T([1-4])|-S([12]))?$/.exec(periodo);
  if (!m) throw new Error(`serie-do-pais: período inválido «${periodo}».`);
  return Number(m[1]) * 12 + (m[2] ? Number(m[2]) - 1 : m[3] ? (Number(m[3]) - 1) * 3 : m[4] ? (Number(m[4]) - 1) * 6 : 0);
}

/** @param {number} alvo */
function passoRedondo(alvo) {
  const potencia = 10 ** Math.floor(Math.log10(alvo));
  return /** @type {number} */ ([1, 2, 5, 10].find((n) => n * potencia >= alvo)) * potencia;
}

/**
 * `lerSerie` é a dependência que as plantas substituem por uma cópia em memória.
 * @param {string[]} ids
 * @param {'unidade'|'indice'} [modo]
 * @param {number} [largura]
 * @param {number} [altura]
 * @param {(id: string) => Serie} [lerSerie]
 * @param {{ leitura?: boolean }} [opcoes] `leitura`: o desenho leva as zonas da leitura de cada ponto (a primeira página
 *   e os recibos; um cartão não as leva, porque é a porta para o recibo, onde a leitura vive)
 */
export function serieDoPais(ids, modo = 'unidade', largura = 360, altura = 200, lerSerie = getSerie, opcoes = {}) {
  if (!ids.length || new Set(ids).size !== ids.length) throw new Error('serie-do-pais: a lista de séries está vazia ou repete uma série.');
  if (!['unidade', 'indice'].includes(modo)) throw new Error('serie-do-pais: modo desconhecido.');
  if (![largura, altura].every(Number.isFinite) || largura < 240 || altura < 140) throw new Error('serie-do-pais: dimensões inválidas.');
  const series = ids.map(lerSerie);
  if (series.some((s) => s.eixo !== 'periodo')) throw new Error('serie-do-pais: só entram séries no tempo.');
  if (modo === 'unidade' && new Set(series.map((s) => s.unit)).size !== 1) throw new Error('serie-do-pais: unidades diferentes exigem o modo indice.');
  /** @type {{id: string, base: string, motivo: 'ausente'|'nula'}[]} */
  const excluidas = [];
  const linhas = series.flatMap((s) => {
    const cadencia = /** @type {keyof typeof CADENCIAS} */ (s.periodicidade);
    if (!(cadencia in CADENCIAS)) throw new Error(`serie-do-pais: cadência desconhecida em ${s.id}.`);
    const pontos = /** @type {{periodo: string, valor: string}[]} */ (s.pontos);
    if (!pontos?.length) throw new Error(`serie-do-pais: ${s.id} não tem pontos.`);
    const base = BASE_DO_INDICE[cadencia];
    const valorBase = modo === 'indice' ? parsePtNumber(pontos.find((p) => p.periodo === base)?.valor) : 1;
    if (valorBase === null || valorBase === 0) {
      excluidas.push({ id: s.id, base, motivo: valorBase === null ? 'ausente' : 'nula' });
      return [];
    }
    const lacunas = new Set((/** @type {{periodo: string}[]} */ (s.lacunas ?? [])).map((l) => l.periodo));
    const dados = pontos.map((p, i) => {
      const valor = parsePtNumber(p.valor);
      if (valor === null || !Number.isFinite(valor)) throw new Error(`serie-do-pais: valor inválido em ${s.id}#${p.periodo}.`);
      const x = mesDoPeriodo(p.periodo);
      if (lacunas.has(p.periodo)) throw new Error(`serie-do-pais: ponto e lacuna no mesmo período de ${s.id}.`);
      let quebra = false;
      if (i) {
        if (x <= mesDoPeriodo(pontos[i - 1].periodo)) throw new Error(`serie-do-pais: períodos fora de ordem em ${s.id}.`);
        for (let per = periodoSeguinte(pontos[i - 1].periodo, cadencia); per !== p.periodo; per = periodoSeguinte(per, cadencia)) {
          if (mesDoPeriodo(per) >= x || !lacunas.has(per)) throw new Error(`serie-do-pais: lacuna por declarar em ${s.id}#${per}.`);
          quebra = true;
        }
      }
      return { periodo: p.periodo, texto: p.valor, x, valor: modo === 'indice' ? (valor / valorBase) * 100 : valor, quebra };
    });
    return [{ id: s.id, base: modo === 'indice' ? base : null, dados }];
  });
  if (!linhas.length) throw new Error('serie-do-pais: nenhuma linha tem período de base não nulo: ' + excluidas.map(l => `${l.id} (${l.base}, ${l.motivo})`).join('; '));
  const todos = linhas.flatMap((l) => l.dados);
  const xMin = Math.min(...todos.map((p) => p.x));
  const xMax = Math.max(...todos.map((p) => p.x));
  const minimo = Math.min(0, ...todos.map((p) => p.valor));
  const maximo = Math.max(0, ...todos.map((p) => p.valor));
  const passo = passoRedondo((maximo - minimo || 1) / 4);
  const yMin = Math.floor(minimo / passo) * passo;
  const yMax = Math.ceil(maximo / passo) * passo || passo;
  const campo = { esquerda: 48, direita: largura - 18, cima: 12, fundo: altura - 30 };
  /* As posições em números, antes de arredondar: as zonas da leitura partem-se a meio entre dois pontos, e o meio
     conta-se sobre as posições por arredondar (RP4-c). */
  const xn = (/** @type {number} */ n) => xMax === xMin ? (campo.esquerda + campo.direita) / 2 : campo.esquerda + (n - xMin) / (xMax - xMin) * (campo.direita - campo.esquerda);
  const x = (/** @type {number} */ n) => coordenada(xn(n));
  const y = (/** @type {number} */ n) => coordenada(campo.fundo - (n - yMin) / (yMax - yMin) * (campo.fundo - campo.cima));
  const simbolo = simboloDasMarcas(series.map((s) => String(s.unit)), modo);
  const marcasY = Array.from({ length: Math.round((yMax - yMin) / passo) + 1 }, (_, i) => {
    const valor = Number((yMin + i * passo).toPrecision(12));
    const [inteiro, fracao] = String(valor).replace('-', '−').split('.');
    /* O SÍMBOLO DA UNIDADE (RP4-c, o ponto 1): no texto da marca, depois do espaço inquebrável, e nunca no zero. */
    const texto = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + (fracao ? `,${fracao}` : '') + (simbolo && valor !== 0 ? `\u00a0${simbolo}` : '');
    return { valor, x: coordenada(campo.esquerda - 8), y: y(valor), texto };
  });
  const primeiroAno = Math.floor(xMin / 12);
  const ultimoAno = Math.floor(xMax / 12);
  const anos = [primeiroAno];
  if (ultimoAno - primeiroAno + 1 >= ANOS_PARA_AS_DECADAS) {
    /* AS DÉCADAS (bloco RP4-c, 05.10.2026, o ponto 2 do mandato): numa série que cobre vinte anos ou mais, o eixo marca
       os anos múltiplos de dez que couberem, da esquerda para a direita, cada um a 64 píxeis ou mais da ponta de fora
       da etiqueta vizinha (`PIXEIS_ATE_A_VIZINHA`): a primeira marca começa no primeiro ponto, e a ponta de fora dela é
       esse ponto; uma década e a última marca estão centradas, e a ponta de fora delas é a metade de um ano escrito
       (`LARGURA_DE_UM_ANO`) para o lado de lá. A última marca fica sempre; a década que ficasse perto dela sai. */
    const metade = LARGURA_DE_UM_ANO / 2;
    const foraDaUltima = xn(ultimoAno * 12) + metade;
    let foraDaVizinha = xn(xMin);
    for (let a = (Math.floor(primeiroAno / 10) + 1) * 10; a < ultimoAno; a += 10) {
      const posicao = xn(a * 12);
      if (posicao - foraDaVizinha >= PIXEIS_ATE_A_VIZINHA && foraDaUltima - posicao >= PIXEIS_ATE_A_VIZINHA) {
        anos.push(a);
        foraDaVizinha = posicao - metade;
      }
    }
  } else {
    /* As séries curtas ficam com a regra de hoje (o RP4 e o RP4-m): os passos redondos, a 64 píxeis das pontas do
       campo. */
    const passoAno = Math.max(1, passoRedondo((ultimoAno - primeiroAno || 1) / 4));
    for (let a = Math.ceil((primeiroAno + 1) / passoAno) * passoAno; a < ultimoAno; a += passoAno) {
      // As pontas têm âncoras diferentes; reservar espaço para os anos por inteiro.
      const posicao = Number(x(a * 12));
      if (posicao - campo.esquerda >= PIXEIS_ATE_A_VIZINHA && campo.direita - posicao >= PIXEIS_ATE_A_VIZINHA) anos.push(a);
    }
  }
  if (ultimoAno !== primeiroAno) anos.push(ultimoAno);
  /* O ÚLTIMO ANO ANCORA-SE EM JANEIRO, COMO OS INTERMÉDIOS (bloco RP4-m, 05.10.2026, o ponto 5 do mandato; o
     achado 5 das leituras do RP4). Até aqui a marca do último ano ficava no último ponto, encostada à direita: no
     recibo da remuneração, «2026» estava no segundo trimestre e não no primeiro, como as outras marcas estão no
     primeiro mês do seu ano. Agora está em janeiro do último ano, centrada, como as intermédias; o primeiro ano
     continua no primeiro ponto, porque o janeiro dele pode estar antes do começo da série. */
  const marcasX = anos.map((ano, i) => ({ valor: ano, texto: String(ano), x: x(i === 0 ? xMin : ano * 12), y: coordenada(altura - 8), ancora: i === 0 ? 'start' : 'middle' }));
  /* A LEITURA DE CADA PONTO (bloco RP4-c, 05.10.2026, o ponto 4 do mandato; por colunas desde a passagem RP4-c-b, a
     decisão do lugar de direção sobre o peso, a I208). Só num desenho que a pede (`opcoes.leitura`: a primeira página e
     os recibos) e de uma série no modo da unidade: no modo indexado o valor publicado do ponto não é o que o eixo diz (o
     eixo diz o índice, que o desenho calcula e não tem origem), e a figura indexada tem a tabela por baixo; um cartão não
     a leva, porque é a porta para o recibo, onde a leitura vive.
     O campo parte-se em colunas de píxel contadas na menor largura no ecrã do desenho (`MENOR_LARGURA_NO_ECRA`), e por
     isso cada coluna tem pelo menos um píxel também a 390; cada coluna lê o ponto mais próximo do seu meio (num empate, o
     primeiro); e as colunas vizinhas que leem o mesmo ponto fazem uma zona só, que é a mesma leitura com menos peso (as
     colunas de um ponto são sempre vizinhas, porque os sítios mais perto de um ponto do que dos outros são um intervalo).
     Cada zona tem, escondidos até o rato passar por ela, o ponto marcado, a linha vertical do campo no x do ponto e a
     etiqueta, com o valor do ponto e o período; a etiqueta vai para o canto de cima do lado de lá do ponto (à direita para
     um ponto na metade esquerda, à esquerda para um da metade direita), para nunca tapar o sítio que se lê nem sair do
     desenho. */
  const meio = (campo.esquerda + campo.direita) / 2;
  const dadosDaLeitura = opcoes.leitura && modo === 'unidade' && linhas.length === 1 ? linhas[0].dados : [];
  const larguraDoCampo = campo.direita - campo.esquerda;
  const colunas = dadosDaLeitura.length ? Math.max(1, Math.floor(larguraDoCampo * Math.min(largura, MENOR_LARGURA_NO_ECRA) / largura)) : 0;
  const passoDaColuna = colunas ? larguraDoCampo / colunas : 0;
  const xsDaLeitura = dadosDaLeitura.map((p) => xn(p.x));
  /** @type {number[]} o ponto mais próximo do meio de cada coluna */
  const pontoDaColuna = [];
  for (let k = 0, j = 0; k < colunas; k++) {
    const centro = campo.esquerda + (k + 0.5) * passoDaColuna;
    /* Um empate (o meio da coluna a meio caminho entre dois pontos igualmente espaçados) desempata-se pelo primeiro, com
       uma tolerância de um milionésimo, para o resultado não depender do ruído das contas de vírgula flutuante. */
    while (j < xsDaLeitura.length - 1 && Math.abs(xsDaLeitura[j + 1] - centro) < Math.abs(xsDaLeitura[j] - centro) - 1e-6) j++;
    pontoDaColuna.push(j);
  }
  /** @type {{periodo: string, valor: string, colunas: [number, number], zona: {x: string, y: string, largura: string, altura: string}, mira: {x: string, y1: string, y2: string}, marca: {cx: string, cy: string, r: string}, etiqueta: {x: string, y: string, ancora: string, dy: string}}[]} */
  const leituras = [];
  for (let k = 0; k < colunas;) {
    const i = pontoDaColuna[k];
    let fim = k;
    while (fim + 1 < colunas && pontoDaColuna[fim + 1] === i) fim++;
    const p = dadosDaLeitura[i];
    const esquerda = campo.esquerda + k * passoDaColuna;
    const direita = campo.esquerda + (fim + 1) * passoDaColuna;
    const doLadoDeLa = xsDaLeitura[i] <= meio;
    leituras.push({
      periodo: p.periodo,
      valor: p.texto,
      colunas: [k, fim],
      zona: { x: coordenada(esquerda), y: String(campo.cima), largura: coordenada(direita - esquerda), altura: String(campo.fundo - campo.cima) },
      mira: { x: x(p.x), y1: String(campo.cima), y2: String(campo.fundo) },
      marca: { cx: x(p.x), cy: y(p.valor), r: '3' },
      etiqueta: { x: coordenada(doLadoDeLa ? campo.direita : campo.esquerda + 6), y: String(campo.cima + 10), ancora: doLadoDeLa ? 'end' : 'start', dy: '14' },
    });
    k = fim + 1;
  }
  return {
    modo, largura, altura, campo, marcasX, marcasY, excluidas, simbolo, leituras, colunas,
    /* A LEGENDA DA UNIDADE (RP4-c, o ponto 1): um desenho no modo da unidade sem símbolo nas marcas diz a unidade por
       extenso por baixo; o indexado tem a legenda da figura. */
    legenda: modo === 'unidade' && simbolo === null,
    linhas: linhas.map((l) => {
      /** @type {string[][]} */
      const segmentos = [];
      for (const p of l.dados) {
        if (!segmentos.length || p.quebra) segmentos.push([]);
        segmentos[segmentos.length - 1].push(`${x(p.x)},${y(p.valor)}`);
      }
      return { id: l.id, base: l.base, primeiro: l.dados[0].periodo, ultimo: l.dados[l.dados.length - 1].periodo, segmentos: segmentos.map((p) => p.join(' ')) };
    }),
  };
}

/** A tabela mantém a cadência inteira; uma célula fora das pontas fica vazia.
 * @param {Serie} s
 */
export function tabelaPorAnos(s) {
  const cadencia = /** @type {keyof typeof CADENCIAS} */ (s.periodicidade);
  const colunas = CADENCIAS[cadencia];
  if (!colunas) throw new Error('serie-do-pais: cadência sem tabela.');
  const pontos = new Map((/** @type {{periodo: string, valor: string, bandeira: string|null}[]} */ (s.pontos)).map((p, i) => [p.periodo, { ...p, indice: i }]));
  const lacunas = new Map((/** @type {{periodo: string, razao: string|null}[]} */ (s.lacunas ?? [])).map((p, i) => [p.periodo, { ...p, indice: i }]));
  const primeiro = Number(String(s.primeiro_periodo).slice(0, 4));
  const ultimo = Number(String(s.ultimo_periodo).slice(0, 4));
  return Array.from({ length: ultimo - primeiro + 1 }, (_, i) => {
    const ano = String(primeiro + i);
    return { ano, celulas: Array.from({ length: colunas }, (_, j) => {
      const periodo = cadencia === 'anual' ? ano : `${ano}-${cadencia === 'mensal' ? String(j + 1).padStart(2, '0') : `${cadencia === 'trimestral' ? 'T' : 'S'}${j + 1}`}`;
      return { periodo, ponto: pontos.get(periodo) ?? null, lacuna: lacunas.get(periodo) ?? null };
    }) };
  });
}

/** Um segmento isolado tem área visível; não é uma linha de um vértice.
 * @param {string} pontos
 * @returns {{tipo: 'ponto', cx: string, cy: string, r: string}|{tipo: 'linha', pontos: string}}
 */
export function segmentoVisivel(pontos) {
  if (pontos.includes(' ')) return { tipo: 'linha', pontos };
  const [cx, cy] = pontos.split(',');
  return { tipo: 'ponto', cx, cy, r: '2' };
}
