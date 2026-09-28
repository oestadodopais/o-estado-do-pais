#!/usr/bin/env node
/**
 * C1: controlos e plantas dos pontos 1, 2 e 6, sem construção de páginas.
 *
 * Todos os HTML e valores deste ensaio são casos sintéticos. As conferências
 * são as mesmas que os portões importam. Os ramos exercem também o resolvedor
 * real e a recomposição independente da K17, com substituições temporárias no
 * Map do livro-razão. Cada objeto original é reposto em finally; nenhum ficheiro
 * de fonte ou linha do livro é escrito. Estes casos não são dados publicados.
 *
 * node tests/confianca/c1.mjs [--json <ficheiro>]
 */
import fs from 'node:fs';
import { parse } from 'node-html-parser';
import { conferirValorUnidade } from '../../scripts/valor-unidade.mjs';
import { conferirVerificacaoLegivel } from '../../scripts/verificacao-legivel.mjs';
import { conferirPaginaDaLeitura, leituraIndependente, normal } from '../cartao/leituras.mjs';
import { leituraDaMedida, textoDaLeitura } from '../../src/lib/leitura-da-medida.mjs';
import { loadClaims } from '../../src/lib/ledger.mjs';
import { reguaDoCartao } from '../../src/lib/enquadramento.mjs';
import { dataDaCasa } from '../../src/lib/datas.mjs';

const controlos = [];
const plantas = [];
const escape = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const controlo = (grupo, nome, erros, prova = {}) => controlos.push({ grupo, nome, passou: erros.length === 0, erros, ...prova });
const planta = (grupo, nome, erros, mordida) => plantas.push({ grupo, nome, codigo: erros.length ? 1 : 0, mordida, passou: erros.some((e) => e.includes(mordida)), erros });

/* Ponto 1. O valor tem espaços internos e um sinal tipográfico num dos casos:
   só conta o separador entre o fim do valor e o início da unidade. */
for (const [tipo, abre, fecha] of [
  ['cartao', '<span class="cartao-medida-quantidade">', '</span>'],
  ['titulo', '<h1 class="linha-valor">', '</h1>'],
]) {
  for (const [valor, unidade] of [['20 600', 'euros por habitante'], ['−50,2', '%']]) {
    for (const [nome, separador] of [['normal', ' '], ['fixo', '\u00a0']]) {
      const html = `${abre}<span data-claim="caso-sintetico">${valor}</span>${separador}<span data-linha-campo="unit">${unidade}</span>${fecha}`;
      const resultado = conferirValorUnidade(parse(html));
      const erros = [...resultado.erros];
      if (resultado.contas.cartoes + resultado.contas.titulos !== 1) erros.push('o controlo não foi contado');
      controlo('valor-unidade', `${tipo}-${valor}-${nome}`, erros, { contas: resultado.contas });
      const colado = html.replace(`</span>${separador}<span`, '</span><span');
      planta('valor-unidade', `${tipo}-${valor}-${nome}-colado`, conferirValorUnidade(parse(colado)).erros, 'cola o valor à unidade');
    }
  }
}

/* Ponto 6. Datas, valores, autores e índices abaixo pertencem apenas ao ensaio. */
const linhaSemLeitura = { verifications: [], corrections: [] };
const relida = { verifications: [{ date: '2026-01-01', result: 'igual', by: 'leitor-sintetico' }], corrections: [] };
const ficheiroRelido = { verifications: [{ date: '2026-01-01', result: 'igual', by: 'corredor-diario' }], corrections: [] };
const atualizada = {
  verifications: [{ date: '2026-01-01', result: 'diverge', found: '−50,2', by: 'leitor-sintetico' }],
  corrections: [{ kind: 'atualizacao', date: '2026-01-02', old_value: '−50,1', new_value: '−50,2' }],
};
const semAtualizacao = { ...atualizada, corrections: [] };
const semResposta = { verifications: [{ date: '2026-01-01', result: 'inacessivel', by: 'leitor-sintetico' }], corrections: [] };
for (const lang of ['pt', 'en']) {
  const sem = lang === 'pt' ? 'Ainda sem segunda leitura.' : 'No second reading yet.';
  const numero = lang === 'pt' ? 'Segunda leitura a' : 'Second reading on';
  const ficheiro = lang === 'pt' ? 'Ficheiro da fonte relido a' : 'Source file read again on';
  const vazio = `<p data-sem-segunda-leitura>${sem}</p>`;
  const bloco = (rotulo, porta = '', destino = '') => `<dl><dt>${rotulo}</dt><dd data-linha-verificacao="0"><time datetime="2026-01-01">01.01.2026</time>${porta}</dd></dl>${destino}`;
  const ligacao = '<a data-atualizacao-da-releitura href="#alteracao-0">Atualização sintética</a>';
  const destino = '<div id="alteracao-0"></div>';
  const confere = (html, linha) => conferirVerificacaoLegivel(parse(html), linha, lang);
  controlo('verificacao', `${lang}-ainda-sem-segunda-leitura`, confere(vazio, linhaSemLeitura));
  controlo('verificacao', `${lang}-numero-relido`, confere(bloco(numero), relida));
  controlo('verificacao', `${lang}-ficheiro-relido`, confere(bloco(ficheiro), ficheiroRelido));
  controlo('verificacao', `${lang}-divergencia-com-atualizacao`, confere(bloco(numero, ligacao, destino), atualizada));
  controlo('verificacao', `${lang}-divergencia-ainda-sem-atualizacao`, confere(bloco(numero), semAtualizacao));
  controlo('verificacao', `${lang}-fonte-sem-resposta`, confere(bloco(numero), semResposta));

  planta('verificacao', `${lang}-nega-releitura-registada`, confere(vazio + bloco(numero), relida), 'ausência de segunda leitura');
  planta('verificacao', `${lang}-omite-ainda-sem-segunda-leitura`, confere('', linhaSemLeitura), 'ausência de segunda leitura');
  planta('verificacao', `${lang}-inventa-segunda-leitura`, confere(vazio + bloco(numero), linhaSemLeitura), 'segunda leitura sem entrada');
  planta('verificacao', `${lang}-ficheiro-apresentado-como-numero`, confere(bloco(numero), ficheiroRelido), 'não distingue a leitura do número');
  planta('verificacao', `${lang}-numero-apresentado-como-ficheiro`, confere(bloco(ficheiro), relida), 'não distingue a leitura do número');
  planta('verificacao', `${lang}-falsa-atualizacao`, confere(bloco(numero, ligacao, destino), semAtualizacao), 'não aponta para a atualização');
  planta('verificacao', `${lang}-atualizacao-sem-porta`, confere(bloco(numero, '', destino), atualizada), 'não aponta para a atualização');
  planta('verificacao', `${lang}-atualizacao-com-porta-errada`, confere(bloco(numero, ligacao.replace('#alteracao-0', '#alteracao-1'), destino), atualizada), 'não aponta para a atualização');
  planta('verificacao', `${lang}-atualizacao-sem-destino`, confere(bloco(numero, ligacao), atualizada), 'atualização sem destino');
  planta('verificacao', `${lang}-correcao-apresentada-como-atualizacao`, confere(bloco(numero, ligacao, destino), {
    ...atualizada, corrections: [{ ...atualizada.corrections[0], kind: 'correcao' }],
  }), 'não aponta para a atualização');
  planta('verificacao', `${lang}-atualizacao-de-outro-valor`, confere(bloco(numero, ligacao, destino), {
    ...atualizada, corrections: [{ ...atualizada.corrections[0], new_value: '−50,3' }],
  }), 'não aponta para a atualização');
}

/* Ponto 2. Usa o livro carregado apenas como molde de identidades e períodos.
   Os valores sintéticos são repostos antes de passar ao caso seguinte. */
const linhas = loadClaims();
function comValoresSinteticos(valores, executar) {
  const originais = new Map(Object.keys(valores).map((id) => [id, linhas.get(id)]));
  try {
    for (const [id, valor] of Object.entries(valores)) {
      if (!originais.get(id)) throw new Error(`falta a identidade da linha de ensaio ${id}`);
      linhas.set(id, { ...originais.get(id), value: valor, source_flag: null, source_flag_note: null });
    }
    return executar();
  } finally {
    for (const [id, original] of originais) linhas.set(id, original);
    if ([...originais].some(([id, original]) => linhas.get(id) !== original)) throw new Error('os objetos originais não foram repostos');
  }
}

function paginaSintetica(id, lang, resolvida, regua) {
  const cita = (alvo) => `<span data-claim="${alvo}">${escape(linhas.get(alvo).value)}</span>`;
  const partes = resolvida.pedacos.map((p) => {
    if (typeof p === 'string') return escape(p);
    if ('claim' in p) return cita(p.claim) + escape(p.sufixo ?? '');
    if ('data' in p) return `<span data-nonledger="data-da-linha" data-de-linha="${p.data.id}" data-de-campo="${p.data.campo}">${escape(dataDaCasa(p.data.valor, lang))}</span>`;
    throw new Error('o ensaio dos preços encontrou um tipo de pedaço que não declara');
  }).join('');
  return parse(`<main><article class="cartao-medida" data-cartao-medida="${id}">
    <span class="cartao-medida-quantidade">${cita(id)} <span data-linha-campo="unit">%</span></span>
    <p data-cartao-leitura="${id}" data-selo-em="${id}">${partes}</p>
    ${Object.entries(regua).filter(([, alvo]) => alvo).map(([tipo, alvo]) => `<span data-regua="${tipo}">${cita(alvo)}</span>`).join('')}
    </article></main>`);
}

const sinais = [
  { nome: 'negativo', valor: '−0,5' },
  { nome: 'zero', valor: '0' },
  { nome: 'positivo', valor: '0,5' },
];
const uniao = [
  { nome: 'maior', valor: '−1,0' },
  { nome: 'menor', valor: '−0,2' },
  { nome: 'igual', valor: '−0,5' },
];

function ensaiarRamo(id, lang, caso, valores) {
  comValoresSinteticos(valores, () => {
    const reguaCompleta = reguaDoCartao(id);
    const regua = { anterior: reguaCompleta.anterior?.id ?? null, ue: reguaCompleta.ue?.id ?? null };
    const propria = leituraIndependente(id, lang, regua, linhas);
    const resolvida = leituraDaMedida(id, lang);
    const pagina = paginaSintetica(id, lang, resolvida, regua);
    const resultado = conferirPaginaDaLeitura(pagina, lang, '/ensaio-sintetico', linhas);
    const erros = [...resultado.erros];
    if (propria.texto !== normal(textoDaLeitura(resolvida.pedacos, lang))) erros.push('a K17 e o resolvedor escolhem leituras diferentes');
    if (propria.nos.find((n) => n.no === 'sinal')?.escolha !== caso.sinal) erros.push('a K17 escolheu o sinal errado');
    if (caso.ue && propria.nos.find((n) => n.no === 'compara-ue')?.escolha !== caso.ue) erros.push('a K17 escolheu a comparação europeia errada');
    const subida = lang === 'pt' ? /subida geral dos preços/ : /general rise in prices/;
    const descida = lang === 'pt' ? /descida geral dos preços/ : /general fall in prices/;
    if (id === 'ipc-variacao-homologa') {
      if (subida.test(propria.texto) !== (caso.sinal === 'positivo')) erros.push('uma frase fixa pressupõe a subida dos preços');
      if (descida.test(propria.texto) !== (caso.sinal === 'negativo')) erros.push('a descida não fica no ramo negativo');
    }
    if (caso.ue) {
      const europeu = propria.nos.find((n) => n.no === 'compara-ue')?.escolhido ?? '';
      if ((lang === 'pt' ? /subida|descida/ : /rise|fall/).test(europeu)) erros.push('a comparação da União pressupõe o sinal das taxas');
      if (!(lang === 'pt' ? /variação/ : /change/).test(europeu)) erros.push('a comparação europeia deixou de nomear a variação');
    }
    const nome = `${lang}-${id}-${caso.nome}`;
    controlo('leituras', nome, erros, { valores_sinteticos: valores, ramos: propria.nos.map(({ no, escolha }) => ({ no, escolha })), texto_sintetico: propria.texto });
    if (caso.sinal === 'negativo') {
      const mudada = parse(pagina.toString());
      const frase = lang === 'pt' ? ' É a subida geral dos preços.' : ' That is the general rise in prices.';
      mudada.querySelector('[data-cartao-leitura]').insertAdjacentHTML('beforeend', frase);
      planta('leituras', `${nome}-frase-positiva-fixa`, conferirPaginaDaLeitura(mudada, lang, '/ensaio-sintetico', linhas).erros, 'os ramos ou os valores rendidos não são os que a conta desta célula manda');
    }
  });
}

for (const lang of ['pt', 'en']) {
  for (const sinal of sinais) {
    ensaiarRamo('ipc-variacao-homologa', lang, { nome: sinal.nome, sinal: sinal.nome }, {
      'ipc-variacao-homologa': sinal.valor,
      'ipc-variacao-homologa-periodo-anterior': '0,2',
    });
  }
  for (const comparacao of uniao) {
    ensaiarRamo('ihpc-variacao-homologa', lang, { nome: `taxas-negativas-${comparacao.nome}`, sinal: 'negativo', ue: comparacao.nome }, {
      'ihpc-variacao-homologa': '−0,5',
      'ihpc-variacao-homologa-periodo-anterior': '−0,8',
      'ihpc-variacao-homologa-ue': comparacao.valor,
    });
  }
}

const resultado = {
  natureza: 'Casos sintéticos em memória. Os valores e as frases deste ensaio não são observações publicadas.',
  contagens: {
    controlos: controlos.length,
    controlos_integros: controlos.filter((c) => c.passou).length,
    plantas: plantas.length,
    plantas_mordidas: plantas.filter((p) => p.passou).length,
  },
  controlos,
  plantas,
};
const saida = process.argv.indexOf('--json');
if (saida !== -1) fs.writeFileSync(process.argv[saida + 1], JSON.stringify(resultado, null, 2) + '\n');
console.log(JSON.stringify(resultado, null, 2));
process.exitCode = controlos.every((c) => c.passou) && plantas.every((p) => p.passou) ? 0 : 1;
