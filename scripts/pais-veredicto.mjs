/** B2, peça 1. A segunda leitura do veredicto, sobre o HTML construído.
 * A seleção, o estado e a frase são recompostos aqui. Nenhuma função da vista
 * nem de inicio.mjs é importada: uma contagem trocada tem de fechar o portão.
 * O check:pais e a lista fechada da voz conferem este mesmo bloco antes de o
 * aceitar, incluindo os nomes e as portas, e não apenas a sua marca. */
import fs from 'node:fs';
import path from 'node:path';
import { load } from 'js-yaml';
import { FIGURAS_PDM } from '../src/data/figuras.mjs';

const normal = s => String(s ?? '').replace(/\s+/g, ' ').trim();
const lerLinha = id => load(fs.readFileSync(path.join(process.cwd(), 'ledger/claims', `${id}.yml`), 'utf8'));
const numero = v => Number(String(v).replace(/[\s\u00a0]/g, '').replace(/\u2212/g, '-').replace(',', '.'));
function estadoProprio(f, linha) {
  if (!f.limiar) return null;
  const v = numero(linha.value);
  if (!Number.isFinite(v)) return null;
  const limite = l => l ? numero(`${l.sinal ?? ''}${l.nl}`) : null;
  const inf = limite(f.limiar.inferior ?? (f.limiar.lado === 'inferior' ? f.limiar : null));
  const sup = limite(f.limiar.superior ?? (f.limiar.lado === 'superior' ? f.limiar : null));
  return (inf !== null && v < inf) || (sup !== null && v > sup) ? 'fora' : 'dentro';
}

export function verificaVeredictoDoPais(home, indice, lang, linha = lerLinha) {
  const erros = [];
  const falha = mensagem => erros.push(`V1 ${lang}: ${mensagem}`);
  const medidas = FIGURAS_PDM.map(f => ({ ...f, estado: estadoProprio(f, linha(f.claim)) }));
  const fora = medidas.filter(f => f.estado === 'fora');
  const contagens = {
    painel_fora_do_limiar: fora.length,
    painel_com_limiar: medidas.filter(f => f.limiar).length,
    painel_dentro_do_limiar: medidas.filter(f => f.estado === 'dentro').length,
  };
  const blocos = home.querySelectorAll('main [data-veredicto-pais]');
  if (blocos.length !== 1) {
    falha(`a página tem ${blocos.length} frases de veredicto; tem de ter uma.`);
    return erros;
  }
  const bloco = blocos[0];
  const ordem = home.querySelectorAll('main [data-veredicto-pais], main [data-leitura-pais]');
  if (ordem.length !== 2 || ordem[0] !== bloco || !ordem[1].hasAttribute('data-leitura-pais'))
    falha('o veredicto não precede a leitura do país.');
  const provas = bloco.querySelectorAll('[data-prova]');
  if (JSON.stringify(provas.map(n => n.getAttribute('data-prova'))) !== JSON.stringify(Object.keys(contagens)))
    falha('as três chaves da prova não são as declaradas, pela ordem da frase.');
  for (const [chave, valor] of Object.entries(contagens)) {
    const el = provas.find(n => n.getAttribute('data-prova') === chave);
    if (!el || normal(el.textContent) !== String(valor))
      falha(`${chave}: a frase não rende a contagem recontada (${valor}).`);
    const porta = lang === 'pt' ? '/uniao-europeia#painel' : '/en/european-union#painel';
    if (el?.tagName !== 'A' || el?.getAttribute('href') !== porta)
      falha(`${chave}: a contagem perdeu a porta da prova.`);
  }
  const nomes = fora.map(f => {
    const nome = f.nome[lang] ?? f.nome.pt;
    return f.nomeNoVeredicto?.[lang] ?? nome.charAt(0).toLowerCase() + nome.slice(1);
  });
  const portas = bloco.querySelectorAll('[data-veredicto-medida]');
  if (JSON.stringify(portas.map(n => n.getAttribute('data-veredicto-medida'))) !== JSON.stringify(fora.map(f => f.claim)))
    falha('a lista das medidas fora, ou a sua ordem, difere da leitura do livro.');
  fora.forEach((f, i) => {
    const a = portas[i];
    const ancora = `m-${f.claim}`;
    const destino = `${lang === 'pt' ? '/temas/' : '/en/themes/'}#${ancora}`;
    if (a?.tagName !== 'A' || a?.getAttribute('href') !== destino || normal(a?.textContent) !== nomes[i])
      falha(`${f.claim}: o nome ou a porta difere da declaração.`);
    const alvos = indice.querySelectorAll(`[id="${ancora}"]`);
    if (alvos.length !== 1 || alvos[0].getAttribute('data-cartao-medida') !== f.claim)
      falha(`${f.claim}: a porta não abre exatamente o cartão da medida.`);
  });
  const lista = nomes.map((nome, i) => (i ? i === nomes.length - 1 ? lang === 'pt' ? ' e ' : ' and ' : ', ' : '') + nome).join('');
  const a = contagens.painel_fora_do_limiar;
  const b = contagens.painel_com_limiar;
  const c = contagens.painel_dentro_do_limiar;
  const esperada = (lang === 'pt'
    ? `Portugal está fora de ${a} dos ${b} valores de referência da Comissão Europeia e dentro de ${c}`
    : `Portugal is outside ${a} of the ${b} reference values of the European Commission and within ${c}`)
    + (lista ? `: ${lista}` : '') + '.';
  if (normal(bloco.textContent) !== esperada)
    falha('a frase construída difere das contagens e dos nomes recontados.');
  return erros;
}
