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
import { valorRelidoAqui, conferirVerificacaoLegivel, conferirValorDeProveniencia, conferirHistoricoLegivel } from '../../scripts/verificacao-legivel.mjs';
import { conferirPaginaDaLeitura, leituraIndependente, normal } from '../cartao/leituras.mjs';
import { leituraDaMedida, textoDaLeitura } from '../../src/lib/leitura-da-medida.mjs';
import { loadClaims } from '../../src/lib/ledger.mjs';
import { reguaDoCartao } from '../../src/lib/enquadramento.mjs';
import { LEITURAS_RP1 } from '../../src/data/leituras-rp1.mjs';
import { valorDaReleitura } from '../../src/lib/valor-da-releitura.mjs';
import { dataDaCasa } from '../../src/lib/datas.mjs';

const controlos = [];
const plantas = [];
const escape = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const controlo = (grupo, nome, erros, prova = {}) => controlos.push({ grupo, nome, passou: erros.length === 0, erros, ...prova });
const planta = (grupo, nome, erros, mordida) => plantas.push({ grupo, nome, codigo: erros.length ? 1 : 0, mordida, passou: erros.some((e) => e.includes(mordida)), erros });

/* A data da proveniência muda de escrita, sem ganhar outro dia ou endereço. */
for (const lang of ['pt', 'en']) {
  const data = { kind: 'proveniencia', field: 'access_date', old_value: '2026-09-15' };
  const endereco = { kind: 'proveniencia', field: 'source_url', old_value: 'https://fonte.example/2026-09-15' };
  const erros = (c, texto) => conferirValorDeProveniencia(c, 'old_value', texto).confere ? [] : ['valor de proveniência diferente do livro'];
  controlo('proveniencia', `data-na-forma-da-casa-${lang}`, erros(data, dataDaCasa(data.old_value, lang)));
  controlo('proveniencia', `endereco-literal-${lang}`, erros(endereco, endereco.old_value));
  planta('proveniencia', `dia-errado-${lang}`, erros(data, '16.09.2026'), 'valor de proveniência diferente do livro');
  planta('proveniencia', `iso-por-formatar-${lang}`, erros(data, '2026-09-15'), 'valor de proveniência diferente do livro');
  planta('proveniencia', `endereco-com-os-mesmos-algarismos-${lang}`, erros(endereco, 'https://outra.example/2026-09-15'), 'valor de proveniência diferente do livro');
}

/* C1d: a apresentação agrupada conserva as entradas e cada par antigo/novo. */
{
  const corr = { date: '2026-09-28', kind: 'proveniencia', reason: 'Motivo sintético.', reason_en: 'Synthetic reason.' };
  const linha = { corrections: [{...corr, field:'excerpt'}, {...corr, field:'access_date'}] };
  const html = `<div class="historico-entrada">${['date','kind','reason'].map(c => `<span data-correcao-grupo="0 1" data-correcao-campo="${c}">texto</span>`).join('')}${[0,1].map(n => ['field','old_value','new_value'].map(c => `<span data-correcao-n="${n}" data-correcao-campo="${c}">texto</span>`).join('')).join('')}</div>`;
  const ver = h => conferirHistoricoLegivel(parse(h), linha);
  controlo('historico', 'grupo-inteiro', ver(html));
  planta('historico', 'entrada-retirada-do-grupo', ver(html.replaceAll('0 1','0')), 'perdeu ou misturou entradas');
  planta('historico', 'valor-antigo-retirado', ver(html.replace('data-correcao-n="1" data-correcao-campo="old_value"','data-retirado="1"')), 'perdeu um campo');
  planta('historico', 'motivo-duplicado', ver(html.replace('</div>', '<span data-correcao-grupo="0 1" data-correcao-campo="reason">texto</span></div>')), 'uma só data, natureza e razão');
}

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

/* C1c: a célula também prova que viu o cartão e distingue a marca da unidade. */
for (const [nome, html, mordida] of [
  ['seletor-deixou-de-casar', '<article data-cartao-medida="ensaio"><span class="quantidade-antiga"><span data-claim="ensaio">3</span> <span data-linha-campo="unit">%</span></span></article>', 'seletor não conferiu'],
  ['marca-com-unidade', '<span class="cartao-medida-quantidade"><span class="cartao-medida-marca">sem valor publicado</span> <span data-linha-campo="unit">dias</span></span>', 'marca sem valor publicado'],
  ['quantidade-sem-valor', '<span class="cartao-medida-quantidade"><span data-linha-campo="unit">%</span></span>', 'faltam o valor ou a unidade'],
]) planta('valor-unidade', nome, conferirValorUnidade(parse(html)).erros, mordida);
controlo('valor-unidade', 'marca-sem-unidade', conferirValorUnidade(parse('<span class="cartao-medida-quantidade"><span class="cartao-medida-marca">sem valor publicado</span></span>')).erros);
const camarasSinteticas = '<span class="cartao-medida-quantidade"><span data-prova="camaras_acima_do_limite">3</span> <span class="cartao-medida-unidade">câmaras</span></span>';
controlo('valor-unidade', 'contagem-com-prova-v2', conferirValorUnidade(parse(camarasSinteticas)).erros);
planta('valor-unidade', 'contagem-com-prova-v2-colada', conferirValorUnidade(parse(camarasSinteticas.replace('</span> <span', '</span><span'))).erros, 'cola o valor à unidade');
for (const [valor, pt, en] of [['49.2', '49,2', '49,2'], ['−1234,50', '−1\u00a0234,50', '−1\u00a0234,50']]) {
  controlo('releitura', valor, valorDaReleitura(valor, 'pt') === pt && valorDaReleitura(valor, 'en') === en ? [] : ['formatação alterou os algarismos']);
}

/* A célula usada pelo HTML recusa o ponto decimal, a perda do sinal e a precisão perdida. */
for (const lang of ['pt','en']) {
  const esperado=valorRelidoAqui('−1234.50',lang);
  const ver=texto=>texto===esperado?[]:['forma do valor encontrado diferente da casa'];
  controlo('forma-encontrada',lang,ver(valorDaReleitura('−1234.50',lang)));
  for(const [nome,texto] of [['ponto','−1\u00a0234.50'],['sinal','1\u00a0234,50'],['precisao','−1\u00a0234,5'],['separador','−1234,50']]) planta('forma-encontrada',`${lang}-${nome}`,ver(texto),'forma do valor encontrado');
}

/* Ponto 6. Datas, valores, autores e índices abaixo pertencem apenas ao ensaio. */
const linhaSemLeitura = { verifications: [], corrections: [] };
const relida = { verifications: [{ date: '2026-01-01', result: 'igual', by: 'leitor-sintetico' }], corrections: [] };
const ficheiroRelido = { verifications: [{ date: '2026-01-01', result: 'igual', by: 'corredor-diario' }], corrections: [] };
const atualizada = {
  value: '−50,2',
  verifications: [{ date: '2026-01-01', result: 'diverge', found: '−50,2', by: 'leitor-sintetico' }],
  corrections: [{ kind: 'atualizacao', date: '2026-01-02', old_value: '−50,1', new_value: '−50,2' }],
};
const semAtualizacao = { ...atualizada, value: '−50,1', corrections: [] };
const semResposta = { verifications: [{ date: '2026-01-01', result: 'inacessivel', by: 'leitor-sintetico' }], corrections: [] };
for (const lang of ['pt', 'en']) {
  const sem = lang === 'pt' ? 'ainda nenhuma' : 'none yet';
  const numero = lang === 'pt' ? 'Releitura a' : 'Re-read on';
  const ficheiro = lang === 'pt' ? 'Ficheiro da fonte relido a' : 'Source file read again on';
  const vazio = `<dl><dt>${lang === 'pt' ? 'Segunda leitura:' : 'Second reading:'}</dt><dd><span data-sem-segunda-leitura>${sem}</span></dd></dl>`;
  const uso = `<span data-valor-em-uso>${lang === 'pt' ? 'O valor do título é o que esta página usa.' : 'This page uses the value shown in the title.'}</span>`;
  const bloco = (rotulo, porta = '', destino = '') => `<dl><dt>${rotulo}</dt><dd data-linha-verificacao="0"><time datetime="2026-01-01">01.01.2026</time>${porta}</dd></dl>${destino}`;
  const ligacao = '<a data-atualizacao-da-releitura href="#alteracao-0">Atualização sintética</a>';
  const destino = '<div id="alteracao-0"></div>';
  const confere = (html, linha) => conferirVerificacaoLegivel(parse(html), linha, lang);
  controlo('verificacao', `${lang}-ainda-sem-segunda-leitura`, confere(vazio, linhaSemLeitura));
  planta('verificacao', `${lang}-rotulo-vazio-em-desacordo`, confere(vazio.replace(lang === 'pt' ? 'Segunda leitura:' : 'Second reading:', numero), linhaSemLeitura), 'rótulo correspondente');
  planta('verificacao', `${lang}-frase-vazia-em-desacordo`, confere(vazio.replace(sem, lang === 'pt' ? 'nenhuma' : 'no reading'), linhaSemLeitura), 'ausência de segunda leitura');
  const calculada = {...linhaSemLeitura, derived_from:['origem-sintetica']};
  const recalculo = lang === 'pt' ? 'Recalculada em cada construção a partir das suas origens' : 'Recomputed at every build from its sources';
  controlo('verificacao', `${lang}-calculada-em-cada-construcao`, confere(vazio.replace(sem,recalculo),calculada));
  planta('verificacao', `${lang}-calculada-diz-ainda-nenhuma`, confere(vazio,calculada), 'ausência de segunda leitura');
  controlo('verificacao', `${lang}-numero-relido`, confere(bloco(numero), relida));
  controlo('verificacao', `${lang}-ficheiro-relido`, confere(bloco(ficheiro), ficheiroRelido));
  controlo('verificacao', `${lang}-divergencia-com-atualizacao`, confere(bloco(numero, ligacao, destino), atualizada));
  controlo('verificacao', `${lang}-divergencia-ainda-sem-atualizacao`, confere(bloco(numero, uso), semAtualizacao));
  planta('verificacao', `${lang}-omite-valor-em-uso`, confere(bloco(numero), semAtualizacao), 'qual é o valor em uso');
  planta('verificacao', `${lang}-inventa-diferenca-do-valor-em-uso`, confere(bloco(numero, ligacao + uso, destino), atualizada), 'qual é o valor em uso');
  controlo('verificacao', `${lang}-fonte-sem-resposta`, confere(bloco(lang === 'pt' ? 'Releitura tentada a' : 'Re-read attempted on', `<span data-linha-verificacao-resultado>${lang === 'pt' ? 'sem valor lido' : 'no value read'}</span>`), semResposta));
  for(const frase of (lang === 'pt' ? ['sem resposta a esse pedido','não foi possível reler o número nesse dia'] : ['with no answer to that request','the number could not be re-read that day'])) {
    planta('verificacao', `${lang}-tentativa-exagera-${frase}`, confere(bloco(lang === 'pt' ? 'Releitura tentada a' : 'Re-read attempted on', `<span data-linha-verificacao-resultado>${frase}</span>`),semResposta),'ausência de valor lido');
  }

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

/* C1d: uma releitura antiga identifica o valor de então e a tentativa fica no seu pedido. */
for (const lang of ['pt', 'en']) {
  const linha = { value: '49,2', verifications: [{date:'2026-09-21',result:'igual',by:'painel-semanal'}], corrections: [{kind:'atualizacao',date:'2026-09-28',old_value:'49,3',new_value:'49,2'}] };
  const rotulo = lang === 'pt' ? 'Releitura a' : 'Re-read on';
  const html = `<dl><dt>${rotulo}</dt><dd data-linha-verificacao="0"><span data-valor-anterior-confirmado>49,3</span></dd></dl>`;
  controlo('releitura-anterior', lang, conferirVerificacaoLegivel(parse(html),linha,lang));
  planta('releitura-anterior', `${lang}-confirma-o-valor-atual`, conferirVerificacaoLegivel(parse(html.replace('49,3','49,2')),linha,lang), 'valor anterior que confirmou');
  planta('releitura-anterior', `${lang}-omite-o-valor-anterior`, conferirVerificacaoLegivel(parse(html.replace('data-valor-anterior-confirmado','data-omitido')),linha,lang), 'valor anterior que confirmou');
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
  const cita = (alvo, sufixo = '') => {
    const l = linhas.get(alvo);
    const nota = l.source_flag === 'e' ? (lang === 'en' ? l.source_flag_note_en : l.source_flag_note) : l.source_flag === 'p' ? (lang === 'en' ? 'provisional data' : 'dado provisório') : '';
    return `<span data-claim="${alvo}">${escape(l.value)}</span>${escape(sufixo)}${nota ? `<span class="claim-provisorio"> (${escape(nota)})</span>` : ''}`;
  };
  const partes = resolvida.pedacos.map((p) => {
    if (typeof p === 'string') return escape(p);
    if ('claim' in p) return cita(p.claim, p.sufixo ?? '');
    if ('nl' in p) return `<span data-nonledger="${escape(p.motivo)}">${escape(p.nl)}</span>`;
    if ('data' in p) return `<span data-nonledger="data-da-linha" data-de-linha="${p.data.id}" data-de-campo="${p.data.campo}">${escape(dataDaCasa(p.data.valor, lang))}</span>`;
    throw new Error('o ensaio dos preços encontrou um tipo de pedaço que não declara');
  }).join('');
  return parse(`<main><article class="cartao-medida" data-cartao-medida="${id}">
    <span class="cartao-medida-quantidade">${cita(id)} <span data-linha-campo="unit">%</span></span>
    <p data-cartao-leitura="${id}" data-selo-em="${id}">${partes}</p>
    ${Object.entries(regua).filter(([, alvo]) => alvo).map(([tipo, alvo]) => `<span data-regua="${tipo}">${cita(alvo)}</span>`).join('')}
    </article></main>`);
}

for (const lang of ['pt','en']) {
  const id = 'despesa-em-id-2024';
  const reguaCompleta = reguaDoCartao(id);
  const regua = { anterior: reguaCompleta.anterior?.id ?? null, ue: reguaCompleta.ue?.id ?? null };
  const pagina = paginaSintetica(id, lang, leituraDaMedida(id, lang), regua);
  controlo('valor-estimado', lang, conferirPaginaDaLeitura(pagina, lang, '/ensaio-estimativa', linhas).erros);
  for (const marca of pagina.querySelectorAll('.claim-provisorio')) marca.remove();
  planta('valor-estimado', `${lang}-marca-omitida`, conferirPaginaDaLeitura(pagina, lang, '/ensaio-estimativa', linhas).erros, 'bandeira');
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

/* Todos os ramos do sinal do RP1, incluindo trocas coerentes nas duas edições.
   A palavra esperada é independente da declaração e a planta troca as duas
   folhas juntas, que uma comparação entre edições não apanharia. */
function nosDeSinal(p, saida = []) {
  if (Array.isArray(p)) for (const x of p) nosDeSinal(x, saida);
  else if (p && typeof p === 'object') {
    if (p.sinal) saida.push(p.sinal);
    else for (const v of Object.values(p)) nosDeSinal(v, saida);
  }
  return saida;
}
function conferirPalavraDoSinal(id, lang, sinal) {
  const texto = textoDaLeitura(leituraDaMedida(id, lang).pedacos, lang);
  const media = id.includes('media-12-meses');
  const padroes = media
    ? (lang === 'pt' ? { positivo: /subiram /, negativo: /variaram [−-]/, zero: /não variaram/ } : { positivo: /rose /, negativo: /changed by [−-]/, zero: /did not change/ })
    : (lang === 'pt' ? { positivo: /acima d[ao]s de há um ano/, negativo: /abaixo del[ae]s/, zero: /ao mesmo nível/ } : { positivo: /above a year earlier/, negativo: /that is, below/, zero: /at the same level/ });
  return padroes[sinal].test(texto) ? [] : ['a palavra não corresponde ao sinal selado'];
}
for (const [id, leitura] of Object.entries(LEITURAS_RP1)) {
  const pt = nosDeSinal(leitura.pt), en = nosDeSinal(leitura.en);
  if (!pt.length) continue;
  if (pt.length !== en.length) throw new Error('as duas edições têm ramos diferentes');
  for (const sinal of sinais) {
    comValoresSinteticos({ [id]: sinal.valor }, () => {
      for (const lang of ['pt', 'en']) controlo('sinais-rp1', `${id}-${lang}-${sinal.nome}`, conferirPalavraDoSinal(id, lang, sinal.nome));
      for (let i = 0; i < pt.length; i++) {
        const originalPt = { ...pt[i] }, originalEn = { ...en[i] };
        const outro = sinal.nome === 'positivo' ? 'negativo' : 'positivo';
        try {
          [pt[i][sinal.nome], pt[i][outro]] = [pt[i][outro], pt[i][sinal.nome]];
          [en[i][sinal.nome], en[i][outro]] = [en[i][outro], en[i][sinal.nome]];
          for (const lang of ['pt', 'en']) planta('sinais-rp1', `${id}-${lang}-${sinal.nome}-troca-coerente`, conferirPalavraDoSinal(id, lang, sinal.nome), 'palavra não corresponde ao sinal');
        } finally { Object.assign(pt[i], originalPt); Object.assign(en[i], originalEn); }
      }
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
