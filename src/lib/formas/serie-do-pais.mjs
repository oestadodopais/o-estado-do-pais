/**
 * A SÉRIE INTEIRA, NUM EIXO SÓ (RP4).
 * O tempo é o primeiro mês de cada período, em meses de calendário. Assim,
 * janeiro, o primeiro trimestre, o primeiro semestre e o ano têm a mesma
 * origem. Não há janela, amostragem nem interpolação de lacunas.
 *
 * A base do índice é o período que contém janeiro de 2015, para todas as
 * séries. Sem esse ponto, ou com base nula, o desenho é recusado com a razão.
 * A escala inclui zero e usa passos 1, 2 ou 5 vezes uma potência de dez.
 * As coordenadas arredondam uma vez, a três casas, só ao sair para o SVG.
 */
import { getSerie, periodoSeguinte } from '../series.mjs';
import { parsePtNumber } from '../ledger.mjs';

export const BASE_DO_INDICE = Object.freeze({ mensal: '2015-01', trimestral: '2015-T1', semestral: '2015-S1', anual: '2015' });
const CADENCIAS = Object.freeze({ mensal: 12, trimestral: 4, semestral: 2, anual: 1 });
/** @param {number} n */
export const coordenada = (n) => String(Number(n.toFixed(3)));

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
 */
export function serieDoPais(ids, modo = 'unidade', largura = 360, altura = 200, lerSerie = getSerie) {
  if (!ids.length || new Set(ids).size !== ids.length) throw new Error('serie-do-pais: a lista de séries está vazia ou repete uma série.');
  if (!['unidade', 'indice'].includes(modo)) throw new Error('serie-do-pais: modo desconhecido.');
  if (![largura, altura].every(Number.isFinite) || largura < 240 || altura < 140) throw new Error('serie-do-pais: dimensões inválidas.');
  const series = ids.map(lerSerie);
  if (series.some((s) => s.eixo !== 'periodo')) throw new Error('serie-do-pais: só entram séries no tempo.');
  if (modo === 'unidade' && new Set(series.map((s) => s.unit)).size !== 1) throw new Error('serie-do-pais: unidades diferentes exigem o modo indice.');
  const linhas = series.map((s) => {
    const cadencia = /** @type {keyof typeof CADENCIAS} */ (s.periodicidade);
    if (!(cadencia in CADENCIAS)) throw new Error(`serie-do-pais: cadência desconhecida em ${s.id}.`);
    const pontos = /** @type {{periodo: string, valor: string}[]} */ (s.pontos);
    if (!pontos?.length) throw new Error(`serie-do-pais: ${s.id} não tem pontos.`);
    const base = BASE_DO_INDICE[cadencia];
    const valorBase = modo === 'indice' ? parsePtNumber(pontos.find((p) => p.periodo === base)?.valor) : 1;
    if (valorBase === null || valorBase === 0) throw new Error(`serie-do-pais: ${s.id} não tem ponto de base não nulo em ${base}.`);
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
      return { periodo: p.periodo, x, valor: modo === 'indice' ? (valor / valorBase) * 100 : valor, quebra };
    });
    return { id: s.id, base: modo === 'indice' ? base : null, dados };
  });
  const todos = linhas.flatMap((l) => l.dados);
  const xMin = Math.min(...todos.map((p) => p.x));
  const xMax = Math.max(...todos.map((p) => p.x));
  const minimo = Math.min(0, ...todos.map((p) => p.valor));
  const maximo = Math.max(0, ...todos.map((p) => p.valor));
  const passo = passoRedondo((maximo - minimo || 1) / 4);
  const yMin = Math.floor(minimo / passo) * passo;
  const yMax = Math.ceil(maximo / passo) * passo || passo;
  const campo = { esquerda: 48, direita: largura - 18, cima: 12, fundo: altura - 30 };
  const x = (/** @type {number} */ n) => coordenada(xMax === xMin ? (campo.esquerda + campo.direita) / 2 : campo.esquerda + (n - xMin) / (xMax - xMin) * (campo.direita - campo.esquerda));
  const y = (/** @type {number} */ n) => coordenada(campo.fundo - (n - yMin) / (yMax - yMin) * (campo.fundo - campo.cima));
  const marcasY = Array.from({ length: Math.round((yMax - yMin) / passo) + 1 }, (_, i) => {
    const valor = Number((yMin + i * passo).toPrecision(12));
    const [inteiro, fracao] = String(valor).replace('-', '−').split('.');
    const texto = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + (fracao ? `,${fracao}` : '');
    return { valor, x: coordenada(campo.esquerda - 8), y: y(valor), texto };
  });
  const primeiroAno = Math.floor(xMin / 12);
  const ultimoAno = Math.floor(xMax / 12);
  const passoAno = Math.max(1, passoRedondo((ultimoAno - primeiroAno || 1) / 4));
  const anos = [primeiroAno];
  for (let a = Math.ceil((primeiroAno + 1) / passoAno) * passoAno; a < ultimoAno; a += passoAno) {
    // As pontas têm âncoras diferentes; reservar espaço para os anos por inteiro.
    const posicao = Number(x(a * 12));
    if (posicao - campo.esquerda >= 64 && campo.direita - posicao >= 64) anos.push(a);
  }
  if (ultimoAno !== primeiroAno) anos.push(ultimoAno);
  const marcasX = anos.map((ano, i) => ({ valor: ano, texto: String(ano), x: x(i === 0 ? xMin : ano === ultimoAno ? xMax : ano * 12), y: coordenada(altura - 8), ancora: i === 0 ? 'start' : i === anos.length - 1 ? 'end' : 'middle' }));
  return {
    modo, largura, altura, campo, marcasX, marcasY,
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
