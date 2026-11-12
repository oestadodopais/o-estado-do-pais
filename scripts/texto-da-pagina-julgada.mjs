import {parse} from 'node-html-parser';

// Só normalizações da apresentação: espaços (incluindo os inquebráveis),
// U+200B, U+2060 e U+00AD, e os nós dos selos de proveniência acrescentados.
// Conservam-se palavras, números, pontuação e adagas. Cada item e cada célula
// são comparados separadamente, sem juntar unidades nem ordenar os blocos.
const normalizar = texto => texto.replace(/[\u200b\u2060\u00ad]/g, '').replace(/\s+/g, ' ').trim();
function textoImpresso(elemento) {
  const copia = parse(elemento.outerHTML);
  for (const selo of copia.querySelectorAll('a.src-chip[data-nonledger="proveniencia"]')) selo.remove();
  return normalizar(copia.textContent);
}

export function conferirTextoDaPagina(root, registo, par) {
  const erros = [], elementos = root.querySelectorAll('main [data-registo-bloco]');
  const falha = (bloco, campo, pagina, esperado) => erros.push({estudo: par, bloco, campo, pagina, registo: esperado});
  if (elementos.length !== registo.blocks.length) falha(null, 'quantidade de blocos', elementos.length, registo.blocks.length);
  const conferirTexto = (el, unidade, coordenada) => {
    const pagina = textoImpresso(el), esperado = normalizar(unidade.text);
    if (pagina !== esperado) falha(coordenada, 'texto', pagina, esperado);
  };
  registo.blocks.forEach((bloco, indice) => {
    const el = elementos[indice];
    if (!el) return falha(bloco.i, 'bloco ausente', null, bloco.kind);
    if (el.getAttribute('data-registo-bloco') !== String(bloco.i)) falha(bloco.i, 'ordem', el.getAttribute('data-registo-bloco'), String(bloco.i));
    const tag = {heading: `H${bloco.level}`, paragraph: 'P', list: bloco.ordered ? 'OL' : 'UL', table: 'TABLE', rule: 'HR'}[bloco.kind];
    if (!tag || el.tagName !== tag) falha(bloco.i, 'tipo', el.tagName, tag ?? bloco.kind);
    if (['heading', 'paragraph'].includes(bloco.kind)) conferirTexto(el, bloco, bloco.i);
    if (bloco.kind === 'list') {
      const itens = el.querySelectorAll('li');
      if (itens.length !== bloco.items.length) falha(bloco.i, 'quantidade de itens', itens.length, bloco.items.length);
      bloco.items.forEach((item, i) => { if (itens[i]) conferirTexto(itens[i], item, `${bloco.i}.${i}`); });
    }
    if (bloco.kind === 'table') {
      const linhas = el.querySelectorAll('tr');
      if (linhas.length !== bloco.rows.length) falha(bloco.i, 'quantidade de linhas', linhas.length, bloco.rows.length);
      bloco.rows.forEach((linha, r) => {
        if (!linhas[r]) return;
        const celulas = linhas[r].querySelectorAll('th, td');
        if (celulas.length !== linha.length) falha(`${bloco.i}.${r}`, 'quantidade de células', celulas.length, linha.length);
        linha.forEach((celula, c) => {
          if (!celulas[c]) return;
          const coordenada = `${bloco.i}.${r}.${c}`, tag = celula.header ? 'TH' : 'TD';
          if (celulas[c].tagName !== tag) falha(coordenada, 'tipo de célula', celulas[c].tagName, tag);
          conferirTexto(celulas[c], celula, coordenada);
        });
      });
    }
  });
  return erros;
}
