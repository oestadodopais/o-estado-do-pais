/** B2: conferência independente do cartão da contagem das câmaras.
 * Lê as linhas em YAML e compara cada índice com a linha do limite. A vista
 * não fornece nem a conta nem a frase que se espera encontrar. */
import fs from 'node:fs';
import path from 'node:path';
import { load } from 'js-yaml';
import { parse } from 'node-html-parser';
import { MUNICIPIOS_COM_PAGINA } from '../src/data/municipios.mjs';
const normal = s => String(s ?? '').replace(/\s+/g, ' ').trim();
const lerLinha = id => load(fs.readFileSync(path.join(process.cwd(), 'ledger/claims', `${id}.yml`), 'utf8'));
const numero = v => Number(String(v).replace(/[\s\u00a0]/g, '').replace(/\u2212/g, '-').replace(',', '.'));
/**
 * A RECONTAGEM, sozinha (bloco L1, 24.09.2026): as quatro contagens, o período
 * comum das linhas contadas e a linha de onde ele se lê, a partir das linhas em
 * YAML. A V2 abaixo confere o cartão contra isto, e a K17 do `check:cartao`
 * recompõe com isto a leitura das câmaras, sem chamar o resolvedor da página.
 * @param {(id: string) => any} [linha]
 */
export function recontagemDasCamaras(linha = lerLinha) {
  const limite = linha('indice-de-divida-limite-legal');
  const teto = numero(limite.value);
  const linhas = MUNICIPIOS_COM_PAGINA.map(m => linha(m.distancia.indice));
  const dataDaLinha = (l, vistos = new Set()) => {
    if (!l || vistos.has(l.id)) throw new Error('V2: origem do período ausente ou circular.');
    if (l.reference_date) return { id: l.id, periodo: l.reference_date };
    const datas = (l.derived_from ?? []).map(id => dataDaLinha(linha(id), new Set([...vistos, l.id])));
    if (!datas.length || new Set(datas.map(d => d.periodo)).size !== 1) throw new Error('V2: origens sem período comum.');
    return datas[0];
  };
  const datas = linhas.map(l => dataDaLinha(l));
  const periodos = new Set(datas.map(d => d.periodo));
  const valores = linhas.map(l => numero(l.value));
  return {
    limite, datas, periodos,
    contagens: {
      camaras_acima_do_limite: valores.filter(v => Number.isFinite(v) && v > teto).length,
      municipios_com_pagina: valores.length,
      camaras_dentro_do_limite: valores.filter(v => Number.isFinite(v) && v <= teto).length,
      camaras_sem_valor: valores.filter(v => !Number.isFinite(v)).length,
    },
  };
}

export function verificaCartaoDasCamaras(doc, lang, linha = lerLinha) {
  const erros = [];
  const falha = s => erros.push(`V2 ${lang}: ${s}`);
  const { limite, datas, periodos, contagens } = recontagemDasCamaras(linha);
  if (periodos.size !== 1 || ![...periodos][0]) falha('as linhas não partilham um período.');
  const periodo = [...periodos][0];
  const cartoes = doc.querySelectorAll('main [data-cartao-camaras]');
  if (cartoes.length !== 1) {
    falha(`a página tem ${cartoes.length} cartões das câmaras; tem de ter um.`);
    return erros;
  }
  const c = cartoes[0];
  if (c.closest('[data-tema]')?.getAttribute('data-tema') !== 'economia-e-financas-publicas')
    falha('o cartão das câmaras não está no tema da economia e finanças públicas.');
  if (c.hasAttribute('data-cartao-medida')) falha('uma contagem aparece como linha publicada.');
  const ordem = c.parentNode.querySelectorAll('[data-cartao-medida], [data-cartao-camaras]');
  if (ordem[ordem.length - 1] !== c) falha('o cartão das câmaras não fecha a fila do tema.');
  /* A LEITURA DAS CÂMARAS (bloco L1, 24.09.2026) diz as contagens por palavras,
     com as mesmas chaves e a mesma porta comum. A ordem das quatro chaves
     continua a ser a da linha do valor e da régua, e confere-se fora da leitura;
     as da leitura conferem-se uma a uma contra a recontagem, como as outras, e
     têm de ser `span` sem porta própria: a porta é a mesma, e é esta função que
     diz ao portão de HTML que ela está lá. */
  const leituras = c.querySelectorAll('[data-cartao-leitura]');
  if (leituras.length > 1) falha(`o cartão das câmaras tem ${leituras.length} leituras; tem uma ou nenhuma.`);
  const daLeitura = new Set(leituras.flatMap(l => l.querySelectorAll('[data-prova]')));
  const provas = c.querySelectorAll('[data-prova]').filter(n => !daLeitura.has(n));
  if (JSON.stringify(provas.map(n => n.getAttribute('data-prova'))) !== JSON.stringify(Object.keys(contagens)))
    falha('as chaves da contagem das câmaras não são as declaradas, pela ordem da frase.');
  for (const el of daLeitura) {
    const chave = el.getAttribute('data-prova');
    if (!(chave in contagens)) {
      falha(`a leitura cita a chave «${chave}», que não é uma contagem das câmaras.`);
      continue;
    }
    if (normal(el.textContent) !== String(contagens[chave])) falha(`${chave}: a leitura não rende a contagem recontada (${contagens[chave]}).`);
    if (el.tagName !== 'SPAN' || el.closest('a')) falha(`${chave}: a contagem da leitura deve usar a porta comum dos lugares.`);
  }
  for (const l of leituras) {
    if (l.querySelectorAll('[data-claim]').length) falha('a leitura das câmaras cita uma linha, e só diz contagens.');
    for (const d of l.querySelectorAll('[data-de-campo="reference_date"]')) {
      if (d.getAttribute('data-de-linha') !== datas[0].id || normal(d.textContent) !== periodo)
        falha('o período da leitura não vem das linhas contadas.');
    }
  }
  const porta = lang === 'pt' ? '/lugares/' : '/en/places/';
  for (const [chave, valor] of Object.entries(contagens)) {
    const el = provas.find(n => n.getAttribute('data-prova') === chave);
    if (!el || normal(el.textContent) !== String(valor)) falha(`${chave}: a contagem não coincide com as linhas do índice de dívida.`);
    if (el?.tagName !== 'SPAN' || el.closest('a')) falha(`${chave}: a contagem deve usar a porta comum dos lugares.`);
  }
  const legal = c.querySelectorAll('[data-claim]');
  if (legal.length !== 1 || legal[0].getAttribute('data-claim') !== limite.id || normal(legal[0].textContent) !== limite.value)
    falha('o limite não é o valor selado da sua linha.');
  const selo = c.querySelectorAll('.src-chip');
  if (selo.length !== 1 || selo[0].getAttribute('href') !== `${lang === 'pt' ? '/livro-razao' : '/en/ledger'}/${limite.id}`)
    falha('falta a marca da fonte da linha do limite.');
  const nome = lang === 'pt' ? 'Câmaras com a dívida acima do limite legal' : 'Councils with debt above the legal limit';
  if (normal(c.querySelector('.cartao-medida-nome')?.textContent) !== nome) falha('o título do cartão difere do aprovado.');
  const regua = c.querySelector('[data-camaras-regua]');
  const copia = regua ? parse(regua.outerHTML) : null;
  copia?.querySelectorAll('.src-chip').forEach(n => n.remove());
  const esperado = lang === 'pt'
    ? `de ${contagens.municipios_com_pagina} câmaras; ${contagens.camaras_dentro_do_limite} dentro do limite legal (${limite.value} ${limite.unit}); ${contagens.camaras_sem_valor} sem valor publicado`
    : `of ${contagens.municipios_com_pagina} councils; ${contagens.camaras_dentro_do_limite} within the legal limit (${limite.value} ${limite.unit}); ${contagens.camaras_sem_valor} with no published value`;
  if (normal(copia?.textContent) !== esperado) falha('a régua difere das contagens e do limite lidos nas linhas.');
  const data = c.querySelector('[data-de-campo="reference_date"]');
  if (data?.getAttribute('data-de-linha') !== datas[0].id || normal(data?.textContent) !== periodo) falha('o período não vem das linhas contadas.');
  if (c.querySelector('.cartao-medida-nome')?.tagName !== 'SPAN') falha('o nome do cartão deve ser um span.');
  /* A LINHA DO VALOR TEM DUAS PARTES, E COMPARA-SE CADA UMA (segunda passagem
     de correção do B2, 23.09.2026): a contagem com a unidade, e o período lido
     das linhas. O texto das duas não leva espaço entre elas, porque é a folha
     que as separa, como em todos os cartões («do PIBem 2025» no texto, «do PIB
     em 2025» no ecrã); comparada como uma frase só, a linha nunca batia. A
     conferência compara parte a parte e exige que a linha não tenha mais nada. */
  const partes = (c.querySelector('.cartao-medida-valor')?.childNodes ?? [])
    .filter(n => n.nodeType === 1 || normal(n.textContent));
  const [quantidade, dataDoCartao] = partes;
  const quantidadeEsperada = `${contagens.camaras_acima_do_limite} ${lang === 'pt' ? 'câmaras' : 'councils'}`;
  const periodoEsperado = `${lang === 'pt' ? 'em' : 'in'} ${periodo}`;
  if (partes.length !== 2 || !quantidade?.classList?.contains('cartao-medida-quantidade') ||
      normal(quantidade.textContent) !== quantidadeEsperada)
    falha('o valor principal ou a unidade da contagem difere.');
  if (!dataDoCartao?.classList?.contains('cartao-medida-periodo') || normal(dataDoCartao.textContent) !== periodoEsperado)
    falha('o período escrito difere do período das linhas contadas.');
  const textoDaPorta = lang === 'pt' ? 'Os lugares →' : 'The places →';
  const portas = c.querySelectorAll('.pais-porta-tema a');
  if (portas.length !== 1 || portas[0].getAttribute('href') !== porta || normal(portas[0].textContent) !== textoDaPorta)
    falha('a porta final não abre os lugares com o nome aprovado.');
  if (doc.querySelector('main [data-cartao-medida="indice-de-divida-limite-legal"]'))
    falha('o limite legal voltou a aparecer como uma medida do país.');
  return erros;
}
