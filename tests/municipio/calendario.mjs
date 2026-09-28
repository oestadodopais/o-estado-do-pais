#!/usr/bin/env node
/**
 * C1, ponto 7: a série e os mandatos partilham um calendário.
 *
 * A posição esperada sai dos extremos rendidos do eixo dos mandatos e do ano
 * da dívida no livro-razão. Esta conferência não importa a geometria da vista.
 * Confere todos os traços, barras, valores e anos, incluindo as ausências:
 * não admite observações extra nem linhas que unam anos sem valor.
 *
 * A F18 de check:formas chama a conferência e as plantas em memória. A corrida
 * isolada lê as duas edições e pode guardar a prova com --json <ficheiro>.
 * --prova-memoria exerce a célula sem ler nem construir dist/.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import { load as yaml } from 'js-yaml';
import { MUNICIPIOS_COM_PAGINA } from '../../src/data/municipios.mjs';
import { t } from '../../src/i18n/strings.mjs';
import { routePath } from '../../src/lib/routes.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const perto = (a, b) => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) < 0.001;
const numero = (el, atributo) => el?.hasAttribute(atributo) ? Number(el.getAttribute(atributo)) : NaN;
const texto = (el) => el?.text.trim() ?? '';
const periodos = (m) => m.tempo.mandatos.map((mandato) => {
  const [de, ate] = mandato.periodo.split(/[–-]/);
  return { de: Number(de), ate: ate ? Number(ate) : null };
});

export function conferirCalendario(root, municipio, lang, linhas) {
  const erros = [];
  const falha = (msg) => erros.push(`F18: ${msg}`);
  const instrumentos = root.querySelectorAll('[data-instrumento="mandatos"]');
  if (!municipio?.tempo) {
    if (instrumentos.length) falha('instrumento sem mandatos declarados.');
    return { erros, pontos: [] };
  }
  if (instrumentos.length !== 1) {
    falha('o calendário declarado tem de aparecer uma vez.');
    return { erros, pontos: [] };
  }
  const instrumento = instrumentos[0];
  const serie = instrumento.querySelector('.mun-serie-svg');
  const banda = instrumento.querySelector('.mun-banda-svg');
  if (!serie || !banda) {
    falha('faltam a série ou a faixa dos mandatos.');
    return { erros, pontos: [] };
  }
  if (serie.querySelector('[transform]') || banda.querySelector('[transform]')) {
    falha('uma transformação desloca as posições do calendário.');
  }
  const caixa = (svg) => (svg.getAttribute('viewBox') ?? '').split(/\s+/).map(Number);
  const [origemS, , larguraS] = caixa(serie);
  const [origemB, , larguraB] = caixa(banda);
  if (!(larguraS > 0 && larguraB > 0)) falha('os desenhos precisam de uma largura válida.');
  const normalS = (x) => (x - origemS) / larguraS;
  const normalB = (x) => (x - origemB) / larguraB;
  const marcos = banda.querySelectorAll('text[data-nonledger="escala-de-instrumento"]');
  const anos = municipio.tempo.eixo.map(Number);
  if (marcos.length !== anos.length || marcos.some((el, i) => Number(texto(el)) !== anos[i])) {
    falha('os anos da faixa diferem do calendário declarado.');
  }
  const xPrimeiro = normalB(numero(marcos[0], 'x'));
  const xUltimo = normalB(numero(marcos.at(-1), 'x'));
  const primeiro = anos[0];
  const ultimo = anos.at(-1);
  const xEsperado = (ano) => xPrimeiro + (ano - primeiro) * (xUltimo - xPrimeiro) / (ultimo - primeiro);
  if (!(xUltimo > xPrimeiro && ultimo > primeiro)) falha('o calendário não avança da esquerda para a direita.');
  for (const el of marcos) {
    if (!perto(normalB(numero(el, 'x')), xEsperado(Number(texto(el))))) falha('o eixo não é uma escala linear de anos.');
  }

  const observacoes = municipio.tempo.mandatos.flatMap((mandato) => mandato.regulador ?? []);
  const grupos = serie.querySelectorAll('[data-serie-ponto]');
  if (grupos.length !== observacoes.length || serie.querySelectorAll('[data-claim]').length !== observacoes.length) {
    falha('há observações em falta ou desenhadas sem valor declarado.');
  }
  const pontos = [];
  for (const observacao of observacoes) {
    const indice = linhas.get(observacao.indice);
    const divida = linhas.get(observacao.divida);
    const limite = linhas.get(observacao.limite);
    const ano = Number(divida?.reference_date);
    if (!indice?.derived_from?.includes(observacao.divida) ||
        !indice.derived_from.includes(observacao.limite) ||
        !/^\d{4}$/.test(String(divida?.reference_date)) ||
        limite?.reference_date !== divida.reference_date || ano !== Number(observacao.ref)) {
      falha(`${observacao.indice}: o ano não está sustentado pelas origens da conta.`);
    }
    const encontrados = grupos.filter((el) => el.getAttribute('data-serie-ponto') === observacao.indice);
    const grupo = encontrados[0];
    if (encontrados.length !== 1 || grupo?.getAttribute('data-serie-ano') !== String(ano)) {
      falha(`${observacao.indice}: falta o ponto único com o seu ano.`);
      continue;
    }
    const barra = grupo.querySelector('.mun-serie-barra');
    const traco = grupo.querySelector('.mun-serie-valor');
    const valor = grupo.querySelector('[data-claim]');
    const rotulo = grupo.querySelector('text[data-nonledger="escala-de-instrumento"]');
    const centros = [
      numero(barra, 'x') + numero(barra, 'width') / 2,
      (numero(traco, 'x1') + numero(traco, 'x2')) / 2,
      numero(valor, 'x'), numero(rotulo, 'x'),
    ].map(normalS);
    if (valor?.getAttribute('data-claim') !== observacao.indice || texto(rotulo) !== String(ano)) {
      falha(`${observacao.indice}: o valor ou o rótulo pertence a outro ano.`);
    }
    if (centros.some((x) => !perto(x, xEsperado(ano)))) {
      falha(`${observacao.indice}: ponto fora do seu ano (${ano}).`);
    }
    pontos.push({ id: observacao.indice, ano, x: centros[1], esperado: xEsperado(ano) });
  }
  const graficos = serie.querySelectorAll('line, rect, circle, ellipse, path, polyline, polygon, use, image');
  for (const el of graficos) {
    const eixo = el.classList.contains('mun-serie-eixo');
    const referencia = el.classList.contains('mun-serie-ref');
    const observacao = el.closest('[data-serie-ponto]');
    if (eixo || referencia) {
      if (el.tagName !== 'LINE' || !perto(numero(el, 'y1'), numero(el, 'y2'))) {
        falha('uma união entre anos foi apresentada como eixo ou referência.');
      }
    } else if (!observacao ||
      !(el.tagName === 'RECT' && el.classList.contains('mun-serie-barra') ||
        el.tagName === 'LINE' && el.classList.contains('mun-serie-valor') && perto(numero(el, 'y1'), numero(el, 'y2')))) {
      falha('um ano sem valor tem um ponto ou uma linha que o atravessa.');
    }
  }
  if (serie.querySelectorAll('.mun-serie-barra').length !== observacoes.length ||
      serie.querySelectorAll('.mun-serie-valor').length !== observacoes.length ||
      serie.querySelectorAll('.mun-serie-eixo').length !== 1 ||
      serie.querySelectorAll('.mun-serie-ref').length !== 1) falha('a série tem marcas em falta ou a mais.');

  const intervalos = periodos(municipio);
  const segmentos = banda.querySelectorAll('.mun-banda-seg');
  if (segmentos.length !== intervalos.length) falha('faltam segmentos de mandatos.');
  intervalos.forEach((periodo, i) => {
    const seg = segmentos[i];
    if (!perto(normalB(numero(seg, 'x')), xEsperado(periodo.de)) ||
      periodo.ate !== null && !perto(normalB(numero(seg, 'x') + numero(seg, 'width')), xEsperado(periodo.ate))) {
      falha('o segmento de um mandato está fora do seu período.');
    }
    if (Boolean(seg?.classList.contains('is-aberto')) !== (periodo.ate === null)) falha('o estado do mandato em curso perdeu a sua marca.');
  });
  const abertos = intervalos.filter((p) => p.ate === null);
  const estados = banda.querySelectorAll('.mun-banda-estado');
  if (estados.length !== abertos.length || estados.some((el) => texto(el) !== t(lang).municipio.tempoEmFuncoes)) {
    falha('o mandato em curso não tem o seu rótulo.');
  }
  estados.forEach((estado, i) => {
    const seg = segmentos[intervalos.indexOf(abertos[i])];
    const x = numero(estado, 'x');
    if (!(x > numero(seg, 'x') && x < numero(seg, 'x') + numero(seg, 'width'))) {
      falha('o rótulo do mandato em curso está fora do seu segmento.');
    }
  });
  return { erros, pontos };
}

/** Cada estrago corre na mesma célula; o documento recebido não é alterado. */
export function plantasDoCalendario(root, municipio, lang, linhas) {
  const casos = [
    ['ponto-fora-do-ano', 'ponto fora do seu ano', (r) => {
      const el = r.querySelector('.mun-serie-valor');
      el.setAttribute('x1', String(numero(el, 'x1') + 30));
      el.setAttribute('x2', String(numero(el, 'x2') + 30));
    }],
    ['uniao-sobre-lacuna', 'ano sem valor', (r) => r.querySelector('.mun-serie-svg').insertAdjacentHTML('beforeend', '<path d="M 10 30 L 610 70"/>')],
    ['ponto-sem-valor', 'ano sem valor', (r) => r.querySelector('.mun-serie-svg').insertAdjacentHTML('beforeend', '<circle cx="200" cy="70" r="3"/>')],
    ['mandato-sem-rotulo', 'não tem o seu rótulo', (r) => r.querySelector('.mun-banda-estado').remove()],
  ];
  return casos.map(([nome, mordida, estragar]) => {
    const copia = parse(root.toString());
    estragar(copia);
    const { erros } = conferirCalendario(copia, municipio, lang, linhas);
    return { nome, codigo: erros.length ? 1 : 0, mordida, passou: erros.some((e) => e.includes(mordida)), erros };
  });
}

function lerLinhas(m) {
  const ids = m.tempo.mandatos.flatMap((mandato) => mandato.regulador ?? []).flatMap((r) => [r.indice, r.divida, r.limite]);
  return new Map(ids.map((id) => [id, yaml(fs.readFileSync(path.join(RAIZ, 'ledger/claims', `${id}.yml`), 'utf8'))]));
}

function provaEmMemoria(m, lang, linhas) {
  const eixo = m.tempo.eixo.map(Number);
  const x = (ano) => 10 + (ano - eixo[0]) * 604 / (eixo.at(-1) - eixo[0]);
  const observacoes = m.tempo.mandatos.flatMap((mandato) => mandato.regulador ?? []);
  const html = `<div data-instrumento="mandatos"><svg class="mun-serie-svg" viewBox="0 0 720 132">
    <line class="mun-serie-eixo" x1="10" x2="710" y1="104" y2="104"/>
    <line class="mun-serie-ref" x1="10" x2="710" y1="50" y2="50"/>
    ${observacoes.map((r) => `<g data-serie-ponto="${r.indice}" data-serie-ano="${r.ref}"><rect class="mun-serie-barra" x="${x(Number(r.ref)) - 16}" width="32"/><line class="mun-serie-valor" x1="${x(Number(r.ref)) - 20}" x2="${x(Number(r.ref)) + 20}" y1="60" y2="60"/><text data-claim="${r.indice}" x="${x(Number(r.ref))}"/><text data-nonledger="escala-de-instrumento" x="${x(Number(r.ref))}">${r.ref}</text></g>`).join('')}
    </svg><svg class="mun-banda-svg" viewBox="0 0 720 74">
    ${eixo.map((ano) => `<text data-nonledger="escala-de-instrumento" x="${x(ano)}">${ano}</text>`).join('')}
    ${periodos(m).map(({ de, ate }) => `<rect class="mun-banda-seg${ate === null ? ' is-aberto' : ''}" x="${x(de)}" width="${(ate === null ? 710 : x(ate)) - x(de)}"/>`).join('')}
    <text class="mun-banda-estado" x="${x(eixo.at(-1)) + 8}">${t(lang).municipio.tempoEmFuncoes}</text></svg></div>`;
  const root = parse(html);
  return { ...conferirCalendario(root, m, lang, linhas), plantas: plantasDoCalendario(root, m, lang, linhas) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const memoria = process.argv.includes('--prova-memoria');
  const dist = process.env.OEDP_DIST ?? path.join(RAIZ, 'dist');
  const paginas = [];
  for (const m of MUNICIPIOS_COM_PAGINA.filter((item) => item.tempo)) {
    const linhas = lerLinhas(m);
    for (const lang of ['pt', 'en']) {
      const rota = routePath('municipio', lang, { slug: m.slug });
      const root = memoria ? null : parse(fs.readFileSync(path.join(dist, rota.slice(1), 'index.html'), 'utf8'));
      const resultado = memoria ? provaEmMemoria(m, lang, linhas) : {
        ...conferirCalendario(root, m, lang, linhas), plantas: plantasDoCalendario(root, m, lang, linhas),
      };
      paginas.push({ rota, ...resultado });
    }
  }
  const resultado = { celula: 'F18', modo: memoria ? 'memória' : 'páginas construídas', paginas };
  const saida = process.argv.indexOf('--json');
  if (saida !== -1) fs.writeFileSync(process.argv[saida + 1], JSON.stringify(resultado, null, 2) + '\n');
  console.log(JSON.stringify(resultado, null, 2));
  process.exitCode = paginas.length && paginas.every((p) => !p.erros.length && p.plantas.every((planta) => planta.passou)) ? 0 : 1;
}
