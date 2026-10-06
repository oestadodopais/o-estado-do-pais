/** B2, peça 1. A segunda leitura do veredicto, sobre o HTML construído.
 * A seleção, o estado e a frase são recompostos aqui. Nenhuma função da vista
 * nem de inicio.mjs é importada: uma contagem trocada tem de fechar o portão.
 * O check:pais e a lista fechada da voz conferem este mesmo bloco antes de o
 * aceitar, incluindo os nomes e as portas, e não apenas a sua marca. */
import fs from 'node:fs';
import path from 'node:path';
import { load } from 'js-yaml';
import { FIGURAS_PDM } from '../src/data/figuras.mjs';
import { ENTRADAS } from '../src/data/primeira-pagina.mjs';

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
  const periodos = new Set(medidas.map(f => linha(f.claim).reference_date));
  if (periodos.size !== 1 || ![...periodos][0]) falha('as linhas não partilham um período.');
  const ano = [...periodos][0];
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
  /* A ORDEM E A CASA DO VEREDICTO (bloco PP1, 28.09.2026). Precedia a leitura do país, que saiu da
     primeira página; passou a viver numa secção sua, depois de «O que se passa», com um título seu e a
     porta da página europeia. O que esta parte protege é a forma, e muda com ela: a frase continua
     recontada abaixo, número a número e nome a nome. */
  const ordem = home.querySelectorAll('main [data-o-que-se-passa], main [data-veredicto-pais]');
  if (ordem.length !== 2 || !ordem[0].hasAttribute('data-o-que-se-passa') || ordem[1] !== bloco)
    falha('o veredicto não vem depois de «O que se passa».');
  const seccao = bloco.closest('[data-veredicto-seccao]');
  const europa = lang === 'pt' ? '/uniao-europeia' : '/en/european-union';
  if (!seccao || !seccao.querySelector('h2') || !seccao.querySelectorAll('a').some(a => a.getAttribute('href') === europa))
    falha('o veredicto não está na sua secção, com o título e a porta da página europeia.');
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
    const entrada = ENTRADAS.find((e) => e.seccoes.some((s) => s.cartoes.includes(f.claim)));
    const destino = `${entrada?.rota[lang]}#${ancora}`;
    if (a?.tagName !== 'A' || a?.getAttribute('href') !== destino || normal(a?.textContent) !== nomes[i])
      falha(`${f.claim}: o nome ou a porta difere da declaração.`);
    const alvos = indice.querySelectorAll(`[id="${ancora}"]`);
    if (alvos.length !== 1 || alvos[0].getAttribute('data-cartao-medida') !== f.claim || alvos[0].closest('[data-pagina-assunto]')?.getAttribute('data-pagina-assunto') !== entrada?.rota[lang])
      falha(`${f.claim}: a porta não abre exatamente o cartão da medida.`);
  });
  const lista = nomes.map((nome, i) => (i ? i === nomes.length - 1 ? lang === 'pt' ? ' e ' : ' and ' : ', ' : '') + nome).join('');
  const a = contagens.painel_fora_do_limiar;
  const b = contagens.painel_com_limiar;
  const c = contagens.painel_dentro_do_limiar;
  const esperada = (lang === 'pt'
    ? `Em ${ano}, Portugal ficou fora de ${a} dos ${b} valores de referência da Comissão Europeia e dentro de ${c}`
    : `In ${ano}, Portugal was outside ${a} of the European Commission’s ${b} reference values and within ${c}`)
    + (lista ? `${lang === 'pt' ? '. Fora: ' : '. Outside: '}${lista}` : '') + '.';
  if (normal(bloco.textContent) !== esperada)
    falha('a frase construída difere das contagens e dos nomes recontados.');
  return erros;
}

/* V1-R4 (05.10.2026, o ponto 4 e a decisão 5 do brief R4): O QUE CADA VALOR DE REFERÊNCIA MEDE E DE QUE LADO PORTUGAL
   FICOU, por baixo do veredicto. Recontado aqui com a mesma leitura própria das linhas e das referências: as medidas
   de fora, pela ordem do painel, numa lista à vista; as de dentro numa porta dobrada; cada uma com o nome do cartão,
   a frase «o que é» igual, carácter a carácter, à metade do cartão da medida na página do seu assunto (a K17 confere
   essa metade contra a sua própria conta), e o lado escolhido por esta conta, com o sinal, e o valor de referência
   pela sua marca, ponta a ponta. Uma medida sem valor de referência não tem explicação. */
const CADEIAS_DO_LADO = {
  pt: {
    antes: 'Portugal está ',
    acima: 'acima do valor de referência da Comissão Europeia, que é ',
    abaixo: 'abaixo do valor de referência da Comissão Europeia, que é ',
    igual: 'no valor de referência da Comissão Europeia, que é ',
    entre: 'entre os valores de referência da Comissão Europeia, que são ',
    acimaDaBanda: 'acima dos valores de referência da Comissão Europeia, que são ',
    abaixoDaBanda: 'abaixo dos valores de referência da Comissão Europeia, que são ',
    e: ' e ',
  },
  en: {
    antes: 'Portugal is ',
    acima: 'above the European Commission’s reference value, which is ',
    abaixo: 'below the European Commission’s reference value, which is ',
    igual: 'at the European Commission’s reference value, which is ',
    entre: 'between the European Commission’s reference values, which are ',
    acimaDaBanda: 'above the European Commission’s reference values, which are ',
    abaixoDaBanda: 'below the European Commission’s reference values, which are ',
    e: ' and ',
  },
};
const semSelos = el => {
  if (!el) return '';
  const copia = el.clone();
  for (const a of copia.querySelectorAll('a.src-chip')) a.remove();
  return normal(copia.textContent);
};
export function verificaExplicacoesDoVeredicto(home, indice, lang, linha = lerLinha) {
  const erros = [];
  const falha = mensagem => erros.push(`V1-R4 ${lang}: ${mensagem}`);
  const c = CADEIAS_DO_LADO[lang];
  const seccao = home.querySelector('main [data-veredicto-seccao]');
  if (!seccao) { falha('a secção do veredicto não existe.'); return erros; }
  const comReferencia = FIGURAS_PDM.filter(f => f.limiar).map(f => ({ f, l: linha(f.claim) }));
  const itens = seccao.querySelectorAll('[data-veredicto-explica]');
  const vistos = itens.map(n => n.getAttribute('data-veredicto-explica'));
  const fora = comReferencia.filter(m => estadoProprio(m.f, m.l) === 'fora').map(m => m.f.claim);
  const dentro = comReferencia.filter(m => estadoProprio(m.f, m.l) === 'dentro').map(m => m.f.claim);
  if (JSON.stringify(vistos) !== JSON.stringify([...fora, ...dentro])) falha(`as explicações (${vistos.join(', ')}) não são as medidas fora e dentro, pela ordem do painel (${[...fora, ...dentro].join(', ')}).`);
  const porta = seccao.querySelectorAll('details[data-veredicto-dentro]');
  if (dentro.length && porta.length !== 1) falha(`há ${porta.length} porta(s) dobrada(s) com os valores de dentro, e tem de haver uma.`);
  for (const n of itens) {
    const id = n.getAttribute('data-veredicto-explica');
    const m = comReferencia.find(x => x.f.claim === id);
    if (!m) { falha(`«${id}» tem explicação e não é uma medida do painel com valor de referência.`); continue; }
    const estado = estadoProprio(m.f, m.l);
    const naPorta = Boolean(n.closest('details[data-veredicto-dentro]'));
    if ((estado === 'dentro') !== naPorta) falha(`«${id}» está ${estado} e a explicação está ${naPorta ? 'dentro' : 'fora'} da porta dobrada.`);
    /* O LADO, pela conta desta célula, com o sinal. */
    const v = numero(m.l.value);
    const limite = x => x ? numero(`${x.sinal === '−' ? '-' : ''}${x.nl}`) : null;
    const banda = Boolean(m.f.limiar.inferior && m.f.limiar.superior);
    let lado;
    if (banda) {
      const inf = limite(m.f.limiar.inferior), sup = limite(m.f.limiar.superior);
      lado = v > sup ? 'acimaDaBanda' : v < inf ? 'abaixoDaBanda' : 'entre';
    } else {
      const alvo = limite(m.f.limiar);
      lado = v > alvo ? 'acima' : v < alvo ? 'abaixo' : 'igual';
    }
    if (n.getAttribute('data-veredicto-lado') !== lado) falha(`«${id}»: a explicação diz o lado «${n.getAttribute('data-veredicto-lado')}», e a conta desta célula dá «${lado}».`);
    const sufixo = String(m.f.limiar.simbolo).startsWith(' ') ? String(m.f.limiar.simbolo) : ` ${m.f.limiar.simbolo}`;
    const ponta = x => `${x.sinal === '−' ? '−' : ''}${x.nl}${sufixo}`;
    const referencia = banda ? `${ponta(m.f.limiar.inferior)}${c.e}${ponta(m.f.limiar.superior)}` : ponta(m.f.limiar);
    const frase = n.querySelector('[data-veredicto-lado-frase]');
    const esperada = normal(`${c.antes}${c[lado]}${referencia}.`);
    if (normal(frase?.textContent) !== esperada) falha(`«${id}»: a frase do lado é «${normal(frase?.textContent)}» e a conta desta célula escreve «${esperada}».`);
    const marcas = frase ? frase.querySelectorAll('[data-referencia]') : [];
    const pontas = banda ? [m.f.limiar.inferior, m.f.limiar.superior] : [m.f.limiar];
    if (marcas.length !== pontas.length || marcas.some((x, i) => x.getAttribute('data-referencia') !== id || normal(x.textContent) !== pontas[i].nl || x.getAttribute('data-nonledger') !== 'limiar-do-quadro'))
      falha(`«${id}»: o valor de referência não vai pela sua marca, ponta a ponta.`);
    /* O NOME E A FRASE «O QUE É», a do cartão. */
    const nome = n.querySelector(`[data-nome="figuras"][data-de-linha="${id}"]`);
    if (normal(nome?.textContent) !== normal(m.f.nome[lang] ?? m.f.nome.pt)) falha(`«${id}»: o nome não é o do cartão.`);
    const oQueE = n.querySelector(`[data-veredicto-o-que-e="${id}"]`);
    const doCartao = indice.querySelector(`[data-cartao-medida="${id}"] [data-leitura-parte="o-que-e"]`);
    if (!doCartao) falha(`«${id}»: o cartão da medida não tem a metade «o que é» na página do assunto.`);
    else if (semSelos(oQueE) !== semSelos(doCartao)) falha(`«${id}»: a frase «o que é» não é a do cartão («${semSelos(oQueE).slice(0, 60)}» contra «${semSelos(doCartao).slice(0, 60)}»).`);
  }
  return erros;
}
