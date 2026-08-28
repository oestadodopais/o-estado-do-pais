// medicoes/lib/svg.mjs
//
// Um analisador de caminhos SVG (`d`) escrito de raiz, só para normalizar e
// comparar. Não desenha nada, não depende de nenhuma biblioteca de SVG: só
// tokeniza os comandos e números, converte tudo para absoluto, e arredonda.
// A ideia é que dois caminhos GEOMETRICAMENTE iguais, escritos com
// formatações diferentes (espaços contra vírgulas, comandos relativos
// contra absolutos, casas decimais a mais), deem a mesma cadeia canónica; e
// que um caminho genuinamente diferente (uma coordenada mudada) dê uma
// cadeia diferente.

const CONTAGEM_DE_ARGUMENTOS = {
  M: 2,
  L: 2,
  H: 1,
  V: 1,
  C: 6,
  S: 4,
  Q: 4,
  T: 2,
  A: 7,
  Z: 0,
};

function tokenizar(d) {
  const re = /[MLHVCSQTAZmlhvcsqtaz]|[-+]?(?:\d+\.\d+|\.\d+|\d+)(?:[eE][-+]?\d+)?/g;
  const tokens = d.match(re);
  if (!tokens) throw new Error('caminho vazio ou ilegível: ' + JSON.stringify(d));
  return tokens;
}

/**
 * Devolve uma lista de comandos absolutos: [{cmd:'M', args:[x,y]}, ...],
 * todos com o comando em maiúscula e M/L/H/V/A/C/S/Q/T já convertidos para
 * coordenadas absolutas (H e V já viram L, para não ter de repetir o eixo
 * parado na comparação).
 */
export function analisarCaminho(d) {
  const tokens = tokenizar(d);
  let i = 0;
  let x = 0;
  let y = 0;
  let xInicial = 0;
  let yInicial = 0;
  let controloAnteriorC = null; // último ponto de controlo de C/S, para o reflexo de S
  let controloAnteriorQ = null; // último ponto de controlo de Q/T, para o reflexo de T
  const comandos = [];

  const lerNumero = () => {
    const t = tokens[i];
    if (t === undefined || /^[A-Za-z]$/.test(t)) {
      throw new Error(`esperava um número no índice ${i}, encontrei ${JSON.stringify(t)}`);
    }
    i += 1;
    return Number(t);
  };

  while (i < tokens.length) {
    const letra = tokens[i];
    if (!/^[MLHVCSQTAZmlhvcsqtaz]$/.test(letra)) {
      throw new Error(`esperava um comando no índice ${i}, encontrei ${JSON.stringify(letra)}`);
    }
    i += 1;
    const maiuscula = letra.toUpperCase();
    const relativo = letra !== maiuscula;
    const nArgs = CONTAGEM_DE_ARGUMENTOS[maiuscula];

    if (maiuscula === 'Z') {
      comandos.push({ cmd: 'Z', args: [] });
      x = xInicial;
      y = yInicial;
      controloAnteriorC = null;
      controloAnteriorQ = null;
      continue;
    }

    // Repetição implícita: continua a consumir grupos de nArgs enquanto o
    // próximo token não for uma letra de comando.
    let primeiraVez = true;
    while (i < tokens.length && !/^[A-Za-z]$/.test(tokens[i] ?? '')) {
      let cmdEfetivo = maiuscula;
      if (maiuscula === 'M' && !primeiraVez) cmdEfetivo = 'L'; // moveto extra = lineto implícito
      primeiraVez = false;

      if (cmdEfetivo === 'H') {
        const nx = lerNumero();
        x = relativo ? x + nx : nx;
        comandos.push({ cmd: 'L', args: [x, y] });
      } else if (cmdEfetivo === 'V') {
        const ny = lerNumero();
        y = relativo ? y + ny : ny;
        comandos.push({ cmd: 'L', args: [x, y] });
      } else if (cmdEfetivo === 'A') {
        const rx = lerNumero();
        const ry = lerNumero();
        const rot = lerNumero();
        const largeArc = lerNumero();
        const sweep = lerNumero();
        const nx = lerNumero();
        const ny = lerNumero();
        const ax = relativo ? x + nx : nx;
        const ay = relativo ? y + ny : ny;
        comandos.push({ cmd: 'A', args: [rx, ry, rot, largeArc ? 1 : 0, sweep ? 1 : 0, ax, ay] });
        x = ax;
        y = ay;
      } else if (cmdEfetivo === 'C') {
        const x1 = lerNumero(),
          y1 = lerNumero(),
          x2 = lerNumero(),
          y2 = lerNumero(),
          nx = lerNumero(),
          ny = lerNumero();
        const ax1 = relativo ? x + x1 : x1;
        const ay1 = relativo ? y + y1 : y1;
        const ax2 = relativo ? x + x2 : x2;
        const ay2 = relativo ? y + y2 : y2;
        const ax = relativo ? x + nx : nx;
        const ay = relativo ? y + ny : ny;
        comandos.push({ cmd: 'C', args: [ax1, ay1, ax2, ay2, ax, ay] });
        controloAnteriorC = { x: ax2, y: ay2 };
        x = ax;
        y = ay;
      } else if (cmdEfetivo === 'S') {
        const x2 = lerNumero(),
          y2 = lerNumero(),
          nx = lerNumero(),
          ny = lerNumero();
        const ax2 = relativo ? x + x2 : x2;
        const ay2 = relativo ? y + y2 : y2;
        const ax = relativo ? x + nx : nx;
        const ay = relativo ? y + ny : ny;
        const x1 = controloAnteriorC ? 2 * x - controloAnteriorC.x : x;
        const y1 = controloAnteriorC ? 2 * y - controloAnteriorC.y : y;
        comandos.push({ cmd: 'C', args: [x1, y1, ax2, ay2, ax, ay] });
        controloAnteriorC = { x: ax2, y: ay2 };
        x = ax;
        y = ay;
      } else if (cmdEfetivo === 'Q') {
        const x1 = lerNumero(),
          y1 = lerNumero(),
          nx = lerNumero(),
          ny = lerNumero();
        const ax1 = relativo ? x + x1 : x1;
        const ay1 = relativo ? y + y1 : y1;
        const ax = relativo ? x + nx : nx;
        const ay = relativo ? y + ny : ny;
        comandos.push({ cmd: 'Q', args: [ax1, ay1, ax, ay] });
        controloAnteriorQ = { x: ax1, y: ay1 };
        x = ax;
        y = ay;
      } else if (cmdEfetivo === 'T') {
        const nx = lerNumero(),
          ny = lerNumero();
        const ax = relativo ? x + nx : nx;
        const ay = relativo ? y + ny : ny;
        const x1 = controloAnteriorQ ? 2 * x - controloAnteriorQ.x : x;
        const y1 = controloAnteriorQ ? 2 * y - controloAnteriorQ.y : y;
        comandos.push({ cmd: 'Q', args: [x1, y1, ax, ay] });
        controloAnteriorQ = { x: x1, y: y1 };
        x = ax;
        y = ay;
      } else if (cmdEfetivo === 'M') {
        const nx = lerNumero();
        const ny = lerNumero();
        x = relativo ? x + nx : nx;
        y = relativo ? y + ny : ny;
        xInicial = x;
        yInicial = y;
        comandos.push({ cmd: 'M', args: [x, y] });
      } else if (cmdEfetivo === 'L') {
        const nx = lerNumero();
        const ny = lerNumero();
        x = relativo ? x + nx : nx;
        y = relativo ? y + ny : ny;
        comandos.push({ cmd: 'L', args: [x, y] });
      } else {
        throw new Error(`comando não tratado: ${cmdEfetivo}`);
      }
      if (cmdEfetivo !== 'M') void nArgs; // nArgs só documenta; a leitura acima já consome o número certo
    }
  }
  return comandos;
}

/**
 * A cadeia canónica: comandos absolutos, números arredondados a `casas`
 * casas decimais (o suficiente para não distinguir 404.520000001 de 404.52,
 * e nenhuma a mais: um caminho com uma coordenada 0,01 diferente já dá uma
 * cadeia diferente).
 */
export function normalizarCaminho(d, casas = 2) {
  const comandos = analisarCaminho(d);
  const fmt = (n) => {
    const r = Number(n.toFixed(casas));
    return Object.is(r, -0) ? '0' : String(r);
  };
  return comandos.map((c) => c.cmd + ' ' + c.args.map(fmt).join(',')).join(' ');
}

/** Extrai o(s) atributo(s) `d="..."` de elementos `<path class="tinta" ...>` de um bloco de texto. */
export function extrairCaminhosDeTinta(svgOuHtml) {
  return [...svgOuHtml.matchAll(/<path\b[^>]*\bclass="tinta"[^>]*\bd="([^"]+)"/g)].map((m) => m[1]);
}

/** Extrai todos os `d="..."` de qualquer elemento `<path ...>`, pela ordem em que aparecem. */
export function extrairTodosOsCaminhos(svgOuHtml) {
  return [...svgOuHtml.matchAll(/<path\b[^>]*\bd="([^"]+)"/g)].map((m) => m[1]);
}
