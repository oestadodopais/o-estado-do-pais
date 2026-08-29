/**
 * A ORDEM, PELA PONDERAÇÃO QUE A ADENDA FIXOU ANTES DE SE MEDIR.
 *
 * A primeira ronda ordenou depois de medir, e declarou decisiva a medida que
 * lhe deu a ordem que queria. A leitura cruzada apanhou-o. A adenda 2 fixou a
 * ponderação por escrito, num ficheiro anterior a estas medidas, e este
 * programa não faz mais nada senão aplicá-la: lê `MEDIDAS-2.json`, classifica
 * cada família em cada medida, soma com os pesos da adenda e escreve o
 * resultado. Não há aqui nenhum número escolhido à luz do que saiu.
 *
 * A PONDERAÇÃO, COPIADA DA ADENDA (§1.2), palavra por palavra:
 *
 *   «(a) a solidez do traço mais fino a 1× (medida 2), lida nas cinco páginas
 *   às sete larguras; (b) as aberturas de «e», «a», «s» a 17 px e 1× (medida
 *   3) [...] a 1×, e se a 1× a medida não distingue as famílias, di-lo e a
 *   medida pesa zero; (c) a densidade de leitura a 390 × 844 (medida 6), para a
 *   prosa e para o instrumento (uma tabela de linha do livro-razão); (d) a
 *   altura de x a 17 px medida no navegador (medida 1); (e) os bytes do sítio
 *   (medida 7), normalizados [...]. Cada medida dá uma classificação de 1 a n
 *   por família; a ordem final é a soma ponderada 5·(a) + 3·(b) + 3·(c) + 2·(d)
 *   + 1·(e), escrita com as classificações ao lado; um empate diz-se empate.»
 *
 * O QUE A ADENDA NÃO FIXOU, E FICA FIXADO AQUI ANTES DA CONTA: o SENTIDO de
 * cada medida, isto é, qual dos extremos é o primeiro lugar. Três deles não têm
 * discussão (mais tinta na haste é melhor; abertura maior é melhor; menos bytes
 * é melhor). Dois são uma escolha, e ficam escritos como escolha:
 *
 *   · (c) a densidade: classifica-se por MAIS caracteres no ecrã ao mesmo corpo
 *     e à mesma entrelinha, porque a folha do sítio fixa os dois e o que a
 *     família muda é só o que cabe. Uma linha mais longa também é mais difícil
 *     de ler, e essa objeção não se resolve com este número: por isso o
 *     resultado vai com uma segunda conta, com o sentido invertido, ao lado.
 *   · (d) a altura de x: classifica-se por MAIOR, porque a 17 px num telemóvel o
 *     que se lê é a altura de x e não o em. Vale a mesma objeção e a mesma
 *     segunda conta.
 *
 * A CLASSIFICAÇÃO É DE COMPETIÇÃO: valores iguais recebem o mesmo lugar e o
 * lugar seguinte salta (1, 2, 2, 4). Um empate é um empate e diz-se.
 *
 * Corre: node design/tipografia/programa/ordem.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..');
const ESTUDO = path.join(RAIZ, 'design', 'tipografia');

/** Os pesos da adenda, e nada mais. */
const PESOS = { a: 5, b: 3, c: 3, d: 2, e: 1 };

/**
 * Classificação de competição sobre uma lista de `{nome, valor}`.
 * `maiorEMelhor` diz o sentido. `null` não se classifica: fica fora e diz-se.
 */
function classifica(entradas, maiorEMelhor) {
  const comValor = entradas.filter((x) => typeof x.valor === 'number');
  const semValor = entradas.filter((x) => typeof x.valor !== 'number');
  const ord = [...comValor].sort((x, y) => (maiorEMelhor ? y.valor - x.valor : x.valor - y.valor));
  const fora = new Map();
  let lugar = 0;
  for (let i = 0; i < ord.length; i++) {
    if (i === 0 || ord[i].valor !== ord[i - 1].valor) lugar = i + 1;
    fora.set(ord[i].nome, lugar);
  }
  const valores = new Set(comValor.map((x) => x.valor));
  return {
    lugares: fora,
    sem_valor: semValor.map((x) => x.nome),
    /**
     * UMA MEDIDA QUE DÁ O MESMO A TODA A GENTE NÃO ORDENA NINGUÉM, e uma que
     * não dá valor a alguém também não. É esta linha que decide o peso zero da
     * adenda, e não uma leitura minha do resultado.
     *
     * A segunda condição não é um pormenor: se uma medida classificasse só as
     * famílias que lhe deram número, as que ficaram de fora não somavam essa
     * parcela e apareciam na frente por lhes faltar uma medida. A regra é
     * uniforme e está escrita antes de se ver o resultado: ou a medida lê todas
     * as candidatas, ou não pesa.
     */
    distingue: valores.size > 1 && semValor.length === 0,
    valores_distintos: valores.size,
    empates: [...new Set([...fora.values()].filter(
      (l, i, t) => t.indexOf(l) !== i))].sort((x, y) => x - y),
  };
}

/** As medidas de cada lugar, com o sentido e a razão do sentido. */
function medidasDoLugar(lugar) {
  const comum = {
    a: {
      chave: 'a', peso: PESOS.a, medida: 2, maiorEMelhor: true,
      rotulo: 'a solidez do traço mais fino a 1× (tinta mediana numa corrida de 1 px)',
      sentido: 'mais tinta na haste de um píxel é melhor: uma haste que o ecrã pousa a 45% imprime-se, a mesma a 12% é um cinzento com forma de letra',
      unidade: 'cobertura de 0 a 1, mediana das células de 1× (cinco páginas × sete larguras)',
    },
    b: {
      chave: 'b', peso: PESOS.b, medida: 3, maiorEMelhor: true,
      rotulo: 'as aberturas de «e», «a» e «s» a 17 px e 1×',
      sentido: 'abertura maior é melhor: uma garganta que fecha a 17 px faz um «e» ler-se como um «o»',
      unidade: 'píxeis, média das três letras a 17 px e 1×',
    },
    c: {
      chave: 'c', peso: PESOS.c, medida: 6, maiorEMelhor: true,
      rotulo: lugar === 'prosa'
        ? 'a densidade de leitura a 390 × 844 (caracteres no ecrã)'
        : 'a densidade do aparelho a 390 × 844 (a altura da ficha da linha do livro-razão)',
      sentido: lugar === 'prosa'
        ? 'mais caracteres no ecrã é melhor, ao mesmo corpo e à mesma entrelinha'
        : 'uma ficha mais baixa é melhor: o mesmo conteúdo, o mesmo corpo, menos ecrã gasto',
      unidade: lugar === 'prosa'
        ? 'caracteres estimados num ecrã de 390 × 844, na página de leitura'
        : 'píxeis de altura da ficha do aparelho',
    },
    d: {
      chave: 'd', peso: PESOS.d, medida: 1, maiorEMelhor: true,
      rotulo: 'a altura de x a 17 px, medida no navegador',
      sentido: 'maior é melhor: a 17 px num telemóvel o que se lê é a altura de x',
      unidade: 'píxeis de altura de x',
    },
    e: {
      chave: 'e', peso: PESOS.e, medida: 7, maiorEMelhor: false,
      rotulo: 'os bytes do sítio, normalizados',
      sentido: 'menos é melhor',
      unidade: lugar === 'prosa' ? 'bytes do sítio inteiro, com a Bitter' : 'bytes da família',
    },
  };
  if (lugar === 'instrumento') comum.c.maiorEMelhor = false;
  return comum;
}

/** O valor de cada medida, por família, tirado de `MEDIDAS-2.json`. */
function valorDe(f, chave, lugar) {
  switch (chave) {
    case 'a':
      return f.medida2 ? f.medida2.pico_mediano_1px : null;
    case 'b': {
      if (!f.medida3) return null;
      const v = [f.medida3.a_17px_1x.e, f.medida3.a_17px_1x.a, f.medida3.a_17px_1x.s]
        .filter((x) => typeof x === 'number');
      return v.length === 3 ? +(v.reduce((a, b) => a + b, 0) / 3).toFixed(3) : null;
    }
    case 'c':
      return lugar === 'prosa'
        ? (f.medida6 ? f.medida6.caracteres_no_ecra : null)
        : (f.medida6_instrumento ? f.medida6_instrumento.altura_total_px : null);
    case 'd':
      return f.medida1 ? f.medida1.no_navegador_17px : null;
    case 'e':
      if (!f.medida7) return null;
      return lugar === 'prosa'
        ? (f.medida7.total_do_sitio_com_bitter_bytes ?? null)
        : f.medida7.total_bytes;
    default:
      return null;
  }
}

function ordemDoLugar(familias, lugar) {
  const medidas = medidasDoLugar(lugar);
  const candidatas = familias.filter((f) => f.papel === lugar && !f.vazio && !f.excluida_porque);
  const vazias = familias.filter((f) => f.papel === lugar && f.vazio);
  const excluidas = familias.filter((f) => f.papel === lugar && f.excluida_porque);

  const porMedida = {};
  for (const m of Object.values(medidas)) {
    const entradas = candidatas.map((f) => ({ nome: f.familia, valor: valorDe(f, m.chave, lugar) }));
    const r = classifica(entradas, m.maiorEMelhor);
    porMedida[m.chave] = {
      ...m,
      valores: Object.fromEntries(entradas.map((x) => [x.nome, x.valor])),
      lugares: Object.fromEntries(r.lugares),
      distingue: r.distingue,
      valores_distintos: r.valores_distintos,
      sem_valor: r.sem_valor,
      empates_no_lugar: r.empates,
      /* O PESO EFETIVO. A adenda manda pesar zero a medida que não distinguir,
         e a regra vale para qualquer uma e não só para a (b): uma medida em que
         toda a gente lê o mesmo número não ordena ninguém. */
      peso_efetivo: r.distingue ? m.peso : 0,
      porque_zero: r.distingue ? null
        : (r.valores_distintos === 0
          ? 'nenhuma família deu valor a esta medida'
          : (r.sem_valor.length
            ? `a régua não deu valor a ${r.sem_valor.length} das ${entradas.length} famílias `
              + `(${r.sem_valor.join(', ')}), e uma medida que não lê todas as candidatas não as ordena`
            : `todas as famílias leem o mesmo valor (${[...new Set(entradas
              .map((x) => x.valor))].join(', ')})`)),
    };
  }

  const soma = (invertidas = []) => {
    const fora = {};
    for (const f of candidatas) {
      let s = 0;
      const parcelas = [];
      for (const m of Object.values(porMedida)) {
        if (!m.peso_efetivo) continue;
        let l = m.lugares[f.familia];
        if (l === undefined) continue;
        if (invertidas.includes(m.chave)) {
          /* Inverter o sentido é trocar o lugar 1 pelo lugar n. Faz-se sobre a
             mesma lista de valores, e não sobre uma medida nova. */
          const entradas = candidatas.map((g) => ({ nome: g.familia, valor: valorDe(g, m.chave, lugar) }));
          l = classifica(entradas, !m.maiorEMelhor).lugares.get(f.familia);
        }
        s += m.peso_efetivo * l;
        parcelas.push(`${m.peso_efetivo}·${l}`);
      }
      fora[f.familia] = { soma: s, conta: parcelas.join(' + ') };
    }
    return fora;
  };

  const somas = soma();
  const ordenadas = [...candidatas].sort((x, y) => somas[x.familia].soma - somas[y.familia].soma);
  const empatesFinais = [];
  for (let i = 1; i < ordenadas.length; i++) {
    if (somas[ordenadas[i].familia].soma === somas[ordenadas[i - 1].familia].soma) {
      empatesFinais.push([ordenadas[i - 1].familia, ordenadas[i].familia]);
    }
  }

  /* O NÚMERO A BATER, medida a medida: o melhor valor entre as candidatas
     livres. É a frase de compra condicional do Parnaso e da Sebenta. */
  const aBater = {};
  for (const m of Object.values(porMedida)) {
    const vals = Object.values(m.valores).filter((v) => typeof v === 'number');
    if (!vals.length) { aBater[m.chave] = null; continue; }
    const melhor = m.maiorEMelhor ? Math.max(...vals) : Math.min(...vals);
    const dono = Object.entries(m.valores).find(([, v]) => v === melhor)[0];
    aBater[m.chave] = {
      medida: m.medida, rotulo: m.rotulo, unidade: m.unidade,
      valor: melhor, de: dono, sentido: m.maiorEMelhor ? 'maior é melhor' : 'menor é melhor',
      pesa: m.peso_efetivo,
    };
  }

  return {
    lugar,
    candidatas: candidatas.map((f) => f.familia),
    vazias: vazias.map((f) => ({ familia: f.familia, porque: f.vazio })),
    excluidas: excluidas.map((f) => ({ familia: f.familia, porque: f.excluida_porque })),
    eliminatorias: candidatas.map((f) => ({
      familia: f.familia,
      tnum: f.medida4.tem_feature_tnum,
      smcp: f.medida5.tem_smcp,
      passa: lugar === 'instrumento' ? f.medida4.tem_feature_tnum : true,
      nota: lugar === 'prosa' && !f.medida5.tem_smcp
        ? 'sem `smcp`: entra com as versais na Spectral SC e com o custo desses dois ficheiros na medida 7, '
          + 'por decisão do lugar de direção posterior à adenda'
        : null,
    })),
    medidas: porMedida,
    pesos_da_adenda: PESOS,
    peso_total_efetivo: Object.values(porMedida).reduce((a, m) => a + m.peso_efetivo, 0),
    somas,
    ordem: ordenadas.map((f, i) => ({ posicao: i + 1, familia: f.familia, soma: somas[f.familia].soma, conta: somas[f.familia].conta })),
    empates_na_soma: empatesFinais,
    /* A segunda conta, com os dois sentidos escolhidos invertidos. Se a ordem
       não mudar, a escolha do sentido não decidiu nada, e isso diz-se. */
    soma_com_c_e_d_invertidas: soma(['c', 'd']),
    numeros_a_bater: aBater,
  };
}

function tabela(o) {
  const ms = Object.values(o.medidas);
  let md = `| família | ${ms.map((m) => `(${m.chave}) medida ${m.medida}, peso ${m.peso_efetivo}`).join(' | ')} | soma ponderada |\n`;
  md += '|---'.repeat(ms.length + 2) + '|\n';
  for (const l of o.ordem) {
    const cels = ms.map((m) => {
      const v = o.medidas[m.chave].valores[l.familia];
      const lug = o.medidas[m.chave].lugares[l.familia];
      const val = v === null || v === undefined ? '—' : (Number.isInteger(v) ? v : v.toFixed(3));
      return m.peso_efetivo ? `${lug}.º · ${val}` : `— · ${val}`;
    });
    md += `| ${l.familia} | ${cels.join(' | ')} | **${l.soma}** (${l.conta}) |\n`;
  }
  for (const v of o.vazias) md += `| ${v.familia} | ${ms.map(() => '—').join(' | ')} | — |\n`;
  for (const e of o.excluidas) md += `| ${e.familia} | ${ms.map(() => '—').join(' | ')} | fora |\n`;
  return md;
}

function principal() {
  const M = JSON.parse(fs.readFileSync(path.join(ESTUDO, 'MEDIDAS-2.json'), 'utf8'));
  const prosa = ordemDoLugar(M.familias, 'prosa');
  const instr = ordemDoLugar(M.familias, 'instrumento');

  const fora = {
    ronda: 2,
    adenda: 'design/tipografia/ADENDA-2-segunda-ronda.md',
    pesos: PESOS,
    motor: M.motor,
    nota_dos_sentidos:
      'a adenda fixou os pesos e não os sentidos; os sentidos estão em cada medida, com a razão, '
      + 'e as duas que são escolha (c e d) levam ao lado a soma com o sentido invertido',
    prosa,
    instrumento: instr,
  };
  fs.writeFileSync(path.join(ESTUDO, 'ORDEM-2.json'), JSON.stringify(fora, null, 2) + '\n');
  console.log('escrito design/tipografia/ORDEM-2.json');

  let md = '# A ORDEM DA SEGUNDA RONDA, pela ponderação da adenda\n\n';
  md += '*Gerado por `programa/ordem.mjs` a partir de `MEDIDAS-2.json`. Os pesos são os da '
    + '`ADENDA-2-segunda-ronda.md` §1.2, fixados antes de medir: 5·(a) + 3·(b) + 3·(c) + 2·(d) + 1·(e). '
    + 'A soma mais baixa é o primeiro lugar. Uma medida que dá o mesmo valor a todas as famílias pesa zero, '
    + 'como a adenda manda, e diz-se qual e porquê.*\n\n';
  for (const o of [prosa, instr]) {
    md += `## O lugar ${o.lugar === 'prosa' ? 'da prosa' : 'do instrumento'}\n\n`;
    md += tabela(o) + '\n';
    const zero = Object.values(o.medidas).filter((m) => !m.peso_efetivo);
    if (zero.length) {
      md += '**As medidas que pesaram zero.**\n\n';
      for (const m of zero) {
        md += `* **(${m.chave}) medida ${m.medida}**, ${m.rotulo}: peso ${m.peso} na adenda, **peso 0** aqui. `
          + `${m.porque_zero}.\n`;
      }
      md += `\nO peso total que de facto ordenou foi ${o.peso_total_efetivo} dos `
        + `${Object.values(PESOS).reduce((a, b) => a + b, 0)} da adenda.\n\n`;
    }
    const comEmpate = Object.values(o.medidas).filter((m) => m.peso_efetivo && m.empates_no_lugar.length);
    if (comEmpate.length) {
      md += '**Empates dentro de uma medida:** ';
      md += comEmpate.map((m) => {
        const porLugar = {};
        for (const [fam, lug] of Object.entries(m.lugares)) (porLugar[lug] ||= []).push(fam);
        const pares = Object.entries(porLugar).filter(([, fs]) => fs.length > 1)
          .map(([lug, fs]) => `${fs.join(' e ')} no ${lug}.º lugar`);
        return `(${m.chave}) medida ${m.medida}: ${pares.join('; ')}`;
      }).join('; ') + '. Um empate é um empate.\n\n';
    }
    if (o.empates_na_soma.length) {
      md += '**Empates na soma:** '
        + o.empates_na_soma.map((p) => p.join(' e ')).join('; ') + '. Um empate é um empate.\n\n';
    } else {
      md += '**Sem empates na soma final.**\n\n';
    }
    const inv = o.soma_com_c_e_d_invertidas;
    const ordemInv = Object.entries(inv).sort((a, b) => a[1].soma - b[1].soma).map(([k]) => k);
    const igual = ordemInv.join(' > ') === o.ordem.map((x) => x.familia).join(' > ');
    md += `**Com os sentidos de (c) e (d) invertidos** a ordem seria ${ordemInv.join(' > ')}`
      + (igual ? ', que é a mesma: a escolha do sentido não decidiu nada.\n\n'
        : ', que não é a mesma: a escolha do sentido decide, e por isso está escrita.\n\n');
    md += '**Os números a bater**, para o Parnaso e a Sebenta quando o pacote de teste existir:\n\n';
    md += '| medida | o que é | o número a bater | de quem | sentido | peso |\n|---|---|---|---|---|---|\n';
    for (const [k, v] of Object.entries(o.numeros_a_bater)) {
      if (!v) { md += `| (${k}) | — | — | — | — | — |\n`; continue; }
      md += `| (${k}) medida ${v.medida} | ${v.rotulo} · ${v.unidade} | **${v.valor}** | ${v.de} | `
        + `${v.sentido} | ${v.pesa || '0 · não ordenou nesta ronda'} |\n`;
    }
    md += '\n';
  }
  fs.writeFileSync(path.join(ESTUDO, 'ORDEM-2.md'), md);
  console.log('escrito design/tipografia/ORDEM-2.md');
  console.log('\n' + md);
}

if (import.meta.url === `file://${process.argv[1]}`) principal();
