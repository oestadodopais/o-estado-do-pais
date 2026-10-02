/**
 * ---------------------------------------------------------------------------
 * A CAIXA DAS SUGESTÕES, LIDA PELO PORTÃO DE HTML (bloco S1, 02.10.2026)
 * ---------------------------------------------------------------------------
 * Quatro conferências, que o `gate:html` chama:
 *
 *   PORTA   · `conferirPortaDasSugestoes()`, em todas as páginas que levam a porta
 *             das correções: exatamente uma porta das sugestões, à vista, dentro
 *             do `<footer>` (ou de um `<nav>` com nome), ao lado da das correções,
 *             com uma ligação só, para a página do formulário da edição da
 *             página, com `?de=` igual ao caminho da própria página e o rótulo
 *             declarado em `src/data/sugestoes.mjs`;
 *   PÁGINAS · `conferirPaginaDasSugestoes()`: a página do formulário sem
 *             `noindex`, com o parágrafo, os rótulos, a nota e o botão iguais aos
 *             declarados, o formulário que vai por POST a `/api/sugestoes` com os
 *             seis campos e mais nenhum, o campo armadilhado fora da árvore de
 *             acessibilidade e do teclado, os limites de cada caixa, e nenhum
 *             guião no `<main>`; as quatro do resultado com `noindex, follow`, a
 *             sua frase e as duas portas; e, na página das correções, a frase com
 *             a porta das sugestões;
 *   MAPA    · `conferirMapaDasSugestoes()`: no mapa do sítio construído, a página
 *             do formulário das duas edições e nenhuma das do resultado;
 *   REGRAS  · `conferirRegrasDaBase()`: as palavras que a nota e a página do
 *             limite dizem (cinco por hora, uma hora, noventa dias, um ano) e os
 *             limites de cada caixa são os números do registo da base
 *             (`supabase/migrations/2026-10-02-caixa-das-sugestoes.sql`). Se a base
 *             mudar e a nota não, o leitor lê uma regra falsa, e a construção
 *             fecha.
 *
 * A LISTA DO `noindex` é `ROTAS_SEM_INDICE`: as quatro do resultado, e mais
 * nenhuma desta família. As palavras e os caminhos vêm dos ficheiros declarados
 * (os textos de `src/data/sugestoes.mjs`, a tabela das rotas), que é o que a
 * página tem de render; o resto é leitura própria do HTML, do mapa e do SQL.
 *
 * `plantasDaCaixa()` corre em cada corrida do portão, antes de as conferências
 * contarem: cada planta é uma página ou um SQL estragado em memória, e a
 * conferência tem de a recusar com a queixa esperada. Uma planta que não morde
 * fecha a construção.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { routePath, normalizePath, LANGS } from '../src/lib/routes.mjs';
import { SUGESTOES, ROTAS_DO_RESULTADO, LIMITES_DAS_SUGESTOES } from '../src/data/sugestoes.mjs';
import { ENDERECO_CORRECOES } from '../src/data/metodo.mjs';

/** As páginas desta família que levam `noindex` e ficam fora do mapa do sítio. */
export const ROTAS_SEM_INDICE = new Set(Object.values(ROTAS_DO_RESULTADO));
/** Os campos do formulário, e mais nenhum: o que o leitor manda é só isto. */
export const CAMPOS_DO_FORMULARIO = ['lingua', 'sitio', 'procurou', 'estudo', 'outro', 'contacto'];
const CAIXAS = ['procurou', 'estudo', 'outro'];
const MARCO = 'footer,[role="contentinfo"],nav[aria-label],nav[aria-labelledby]';

const desfaz = (s) =>
  String(s ?? '')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
/** O texto de um nó como o leitor o lê: as entidades desfeitas e os espaços juntos. */
const textoDe = (no) => desfaz(no?.textContent ?? '').replace(/\s+/g, ' ').trim();

/** O antepassado que esconde um nó, se houver: `hidden`, `aria-hidden="true"` ou a classe `vh`. */
function escondidoPor(no) {
  for (let n = no; n && n.nodeType !== undefined; n = n.parentNode) {
    const a = n.attributes ?? {};
    if ('hidden' in a) return 'hidden';
    if ((a['aria-hidden'] ?? '') === 'true') return 'aria-hidden="true"';
    if (/(^|\s)vh(\s|$)/.test(String(a.class ?? ''))) return 'class="vh"';
  }
  return null;
}

/**
 * PORTA · a porta das sugestões de uma página.
 * @param {import('node-html-parser').HTMLElement} root
 * @param {{ caminho: string, lang: Lingua }} pagina
 * @returns {string[]}
 */
export function conferirPortaDasSugestoes(root, { caminho, lang }) {
  const erros = [];
  const portas = root.querySelectorAll('[data-porta-sugestoes]');
  if (portas.length !== 1) {
    erros.push(
      `S1 porta: esta página tem ${portas.length} porta(s) das sugestões; tem de ter exatamente uma, ` +
        'no rodapé, ao lado da das correções (`SiteFooter.astro`).',
    );
    return erros;
  }
  const porta = portas[0];
  const escondida = escondidoPor(porta);
  if (escondida) erros.push(`S1 porta: a porta das sugestões está escondida por ${escondida}.`);
  if (!porta.closest(MARCO)) {
    erros.push('S1 porta: a porta das sugestões não está dentro do <footer> nem de um <nav> com nome.');
  }
  const correcoes = root.querySelector('[data-porta-correccoes]');
  if (correcoes && correcoes.parentNode !== porta.parentNode) {
    erros.push('S1 porta: a porta das sugestões não está ao lado da porta das correções.');
  }
  const ligacoes = porta.querySelectorAll('a[href]');
  if (ligacoes.length !== 1) {
    erros.push(`S1 porta: a porta das sugestões tem ${ligacoes.length} ligação(ões); tem de ter uma.`);
    return erros;
  }
  let destino;
  try {
    destino = new URL(desfaz(ligacoes[0].getAttribute('href')), 'https://portao.invalid');
  } catch {
    erros.push('S1 porta: o endereço da porta das sugestões não se resolve.');
    return erros;
  }
  const formulario = normalizePath(routePath('sugestoes', lang));
  if (normalizePath(destino.pathname) !== formulario) {
    erros.push(`S1 porta: a porta das sugestões leva a "${destino.pathname}", e o formulário desta edição é "${formulario}".`);
  }
  const de = destino.searchParams.get('de');
  const aqui = normalizePath(caminho);
  if (de !== aqui) {
    erros.push(`S1 porta: a porta das sugestões diz ?de=${JSON.stringify(de)}, e o caminho desta página é "${aqui}".`);
  }
  const rotulo = textoDe(ligacoes[0]);
  if (rotulo !== SUGESTOES.titulo[lang]) {
    erros.push(`S1 porta: o rótulo da porta das sugestões é «${rotulo}», e o declarado é «${SUGESTOES.titulo[lang]}».`);
  }
  return erros;
}

/** O que se confere numa ligação dentro de um bloco: o destino e o texto. */
function ligacaoDe(bloco, caminhoEsperado, textoEsperado, oQue, erros, de = undefined) {
  const ligacoes = bloco.querySelectorAll('a[href]');
  if (ligacoes.length !== 1) {
    erros.push(`${oQue}: tem ${ligacoes.length} ligação(ões), e tem de ter uma.`);
    return;
  }
  const u = new URL(desfaz(ligacoes[0].getAttribute('href')), 'https://portao.invalid');
  if (normalizePath(u.pathname) !== normalizePath(caminhoEsperado)) {
    erros.push(`${oQue}: a ligação leva a "${u.pathname}", e devia levar a "${caminhoEsperado}".`);
  }
  if (de !== undefined && u.searchParams.get('de') !== de) {
    erros.push(`${oQue}: a ligação diz ?de=${JSON.stringify(u.searchParams.get('de'))}, e devia dizer ${JSON.stringify(de)}.`);
  }
  if (textoDe(ligacoes[0]) !== textoEsperado) {
    erros.push(`${oQue}: a ligação diz «${textoDe(ligacoes[0])}», e devia dizer «${textoEsperado}».`);
  }
}

/** Um bloco marcado, exatamente uma vez, com o texto declarado. */
function blocoDeclarado(root, seletor, esperado, oQue, erros) {
  const blocos = root.querySelectorAll(seletor);
  if (blocos.length !== 1) {
    erros.push(`${oQue}: a página tem ${blocos.length} bloco(s) ${seletor}, e tem de ter um.`);
    return null;
  }
  const lido = textoDe(blocos[0]);
  if (lido !== esperado) erros.push(`${oQue}: o texto rendido não é o declarado.\n      rendido:   «${lido}»\n      declarado: «${esperado}»`);
  return blocos[0];
}

/**
 * PÁGINAS · a página do formulário, as quatro do resultado e a frase da página
 * das correções.
 * @param {import('node-html-parser').HTMLElement} root
 * @param {{ key: string, lang: Lingua } | null} rota
 * @returns {string[]}
 */
export function conferirPaginaDasSugestoes(root, rota) {
  const erros = [];
  if (!rota) return erros;
  const lang = rota.lang;
  const robots = root.querySelectorAll('meta[name="robots"]').map((m) => desfaz(m.getAttribute('content')));

  if (rota.key === 'correcoes') {
    const frase = blocoDeclarado(root, '[data-porta-sugestoes-nas-correcoes]', SUGESTOES.portaNasCorrecoes[lang], 'S1 correções', erros);
    if (frase) {
      if (!frase.closest('main')) erros.push('S1 correções: a frase com a porta das sugestões não está no <main>.');
      ligacaoDe(frase, routePath('sugestoes', lang), SUGESTOES.portaDaFraseNasCorrecoes[lang], 'S1 correções', erros, normalizePath(routePath('correcoes', lang)));
    }
    return erros;
  }

  if (ROTAS_SEM_INDICE.has(rota.key)) {
    if (robots.length !== 1 || robots[0] !== 'noindex, follow') {
      erros.push(`S1 resultado: a página do resultado tem de levar uma marca robots «noindex, follow», e leva ${JSON.stringify(robots)}.`);
    }
    const resultado = /** @type {keyof typeof ROTAS_DO_RESULTADO} */ (
      Object.keys(ROTAS_DO_RESULTADO).find((k) => ROTAS_DO_RESULTADO[/** @type {keyof typeof ROTAS_DO_RESULTADO} */ (k)] === rota.key)
    );
    const frases = root.querySelectorAll('[data-sugestoes-resultado]');
    if (frases.length !== 1 || frases[0].getAttribute('data-sugestoes-resultado') !== resultado) {
      erros.push(`S1 resultado: a página tem de dizer a frase do resultado «${resultado}», uma vez, e mais nenhuma.`);
    } else if (textoDe(frases[0]) !== SUGESTOES.resultados[resultado][lang]) {
      erros.push(`S1 resultado: a frase rendida não é a declarada.\n      rendida:   «${textoDe(frases[0])}»\n      declarada: «${SUGESTOES.resultados[resultado][lang]}»`);
    }
    const main = root.querySelector('main');
    const portas = (main?.querySelectorAll('a[href]') ?? []).map((a) => ({
      caminho: normalizePath(new URL(desfaz(a.getAttribute('href')), 'https://portao.invalid').pathname),
      texto: textoDe(a),
    }));
    const formulario = normalizePath(routePath('sugestoes', lang));
    if (!portas.some((p) => p.caminho === formulario && p.texto === SUGESTOES.voltar[lang])) {
      erros.push(`S1 resultado: falta a porta «${SUGESTOES.voltar[lang]}» para "${formulario}" no <main>.`);
    }
    if (!portas.some((p) => p.caminho === normalizePath(routePath('home', lang)))) {
      erros.push('S1 resultado: falta a porta para a primeira página no <main>.');
    }
    return erros;
  }

  if (rota.key !== 'sugestoes') return erros;

  if (robots.length) erros.push(`S1 formulário: a página do formulário entra no índice, e leva uma marca robots ${JSON.stringify(robots)}.`);
  const paragrafo = blocoDeclarado(root, '[data-sugestoes-paragrafo]', SUGESTOES.paragrafo[lang], 'S1 formulário', erros);
  if (paragrafo) ligacaoDe(paragrafo, routePath('correcoes', lang), SUGESTOES.portaDoParagrafo[lang], 'S1 formulário (a porta das correções)', erros);

  const formularios = root.querySelectorAll('form');
  if (formularios.length !== 1) {
    erros.push(`S1 formulário: a página tem ${formularios.length} formulário(s), e tem de ter um.`);
    return erros;
  }
  const form = formularios[0];
  if ((form.getAttribute('method') ?? '').toLowerCase() !== 'post') erros.push('S1 formulário: o formulário não vai por POST.');
  if (form.getAttribute('action') !== '/api/sugestoes') {
    erros.push(`S1 formulário: o formulário vai para ${JSON.stringify(form.getAttribute('action'))}, e não para "/api/sugestoes".`);
  }
  const nomes = form.querySelectorAll('[name]').map((c) => c.getAttribute('name'));
  if (JSON.stringify([...nomes].sort()) !== JSON.stringify([...CAMPOS_DO_FORMULARIO].sort())) {
    erros.push(`S1 formulário: os campos são ${nomes.join(', ')}, e são só ${CAMPOS_DO_FORMULARIO.join(', ')}.`);
  }
  const lingua = form.querySelector('input[name="lingua"]');
  if (lingua?.getAttribute('type') !== 'hidden' || lingua?.getAttribute('value') !== lang) {
    erros.push(`S1 formulário: o campo escondido da língua tem de valer "${lang}".`);
  }
  /** O rótulo de um campo, pelo `for` do `<label>`. */
  const rotuloDe = (campo) => {
    const id = campo?.getAttribute('id');
    const rotulos = id ? form.querySelectorAll(`label[for="${id}"]`) : [];
    return rotulos.length === 1 ? textoDe(rotulos[0]) : null;
  };
  const armadilha = form.querySelector('input[name="sitio"]');
  if (!armadilha) erros.push('S1 formulário: falta o campo armadilhado.');
  else {
    if (armadilha.getAttribute('tabindex') !== '-1') erros.push('S1 formulário: o campo armadilhado está no caminho do teclado (tabindex).');
    if (armadilha.getAttribute('autocomplete') !== 'off') erros.push('S1 formulário: o campo armadilhado aceita preenchimento automático.');
    if (escondidoPor(armadilha) !== 'aria-hidden="true"') {
      erros.push('S1 formulário: o campo armadilhado não está fora da árvore de acessibilidade (aria-hidden="true"), e um leitor de ecrã anunciava-o.');
    }
    if (rotuloDe(armadilha) !== SUGESTOES.rotulos.sitio[lang]) erros.push('S1 formulário: o rótulo do campo armadilhado não é o declarado.');
  }
  for (const nome of CAIXAS) {
    const caixa = form.querySelectorAll(`textarea[name="${nome}"]`);
    if (caixa.length !== 1) {
      erros.push(`S1 formulário: a caixa "${nome}" aparece ${caixa.length} vez(es).`);
      continue;
    }
    if (caixa[0].getAttribute('maxlength') !== String(LIMITES_DAS_SUGESTOES.texto)) {
      erros.push(`S1 formulário: a caixa "${nome}" aceita ${caixa[0].getAttribute('maxlength')} caracteres, e o limite é ${LIMITES_DAS_SUGESTOES.texto}.`);
    }
    if (rotuloDe(caixa[0]) !== SUGESTOES.rotulos[nome][lang]) erros.push(`S1 formulário: o rótulo da caixa "${nome}" não é o declarado.`);
    if (escondidoPor(caixa[0])) erros.push(`S1 formulário: a caixa "${nome}" está escondida.`);
  }
  const contacto = form.querySelector('input[name="contacto"]');
  if (!contacto || contacto.getAttribute('type') !== 'email') erros.push('S1 formulário: o contacto não é um campo de correio (type="email").');
  else {
    if (contacto.getAttribute('maxlength') !== String(LIMITES_DAS_SUGESTOES.contacto)) erros.push('S1 formulário: o contacto aceita mais do que o limite.');
    if (contacto.hasAttribute('required')) erros.push('S1 formulário: o contacto é opcional, e está obrigatório.');
    if (rotuloDe(contacto) !== SUGESTOES.rotulos.contacto[lang]) erros.push('S1 formulário: o rótulo do contacto não é o declarado.');
  }
  const nota = blocoDeclarado(form, '[data-sugestoes-nota]', SUGESTOES.nota[lang], 'S1 formulário (a nota do que fica guardado)', erros);
  if (nota && !nota.querySelector(`a[href="mailto:${ENDERECO_CORRECOES}"]`)) {
    erros.push('S1 formulário: a nota não tem a porta para o endereço onde se pede o que foi enviado.');
  }
  const botoes = form.querySelectorAll('button[type="submit"]');
  if (botoes.length !== 1 || textoDe(botoes[0]) !== SUGESTOES.botao[lang]) erros.push('S1 formulário: o botão não é o declarado, ou não é um.');
  if (root.querySelector('main')?.querySelector('script')) erros.push('S1 formulário: há um guião no <main>, e o formulário funciona sem JavaScript.');
  return erros;
}

/**
 * MAPA · o mapa do sítio construído: o formulário das duas edições dentro, as
 * páginas do resultado fora.
 * @param {string} dist
 * @returns {{ erros: string[], enderecos: number }}
 */
export function conferirMapaDasSugestoes(dist) {
  const erros = [];
  const ficheiros = fs.existsSync(dist) ? fs.readdirSync(dist).filter((f) => /^sitemap-\d+\.xml$/.test(f)) : [];
  if (!ficheiros.length) return { erros: ['S1 mapa: a construção não tem o mapa do sítio (sitemap-N.xml).'], enderecos: 0 };
  const caminhos = new Set();
  for (const f of ficheiros) {
    const xml = fs.readFileSync(path.join(dist, f), 'utf8');
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      try {
        caminhos.add(normalizePath(new URL(desfaz(m[1].trim())).pathname));
      } catch {
        erros.push(`S1 mapa: um endereço do mapa não se lê: ${m[1]}`);
      }
    }
  }
  for (const lang of LANGS) {
    const formulario = normalizePath(routePath('sugestoes', lang));
    if (!caminhos.has(formulario)) erros.push(`S1 mapa: a página do formulário "${formulario}" não está no mapa do sítio.`);
    for (const chave of ROTAS_SEM_INDICE) {
      const c = normalizePath(routePath(/** @type {ChaveDeRota} */ (chave), lang));
      if (caminhos.has(c)) erros.push(`S1 mapa: a página do resultado "${c}" está no mapa do sítio, e leva noindex.`);
    }
  }
  return { erros, enderecos: caminhos.size };
}

/** Os números que a nota e a página do limite dizem por extenso, nas duas línguas. */
const POR_EXTENSO = {
  1: { pt: ['uma', 'um'], en: ['one', 'a'] },
  5: { pt: ['cinco'], en: ['Five', 'five'] },
  90: { pt: ['noventa'], en: ['ninety'] },
};

/**
 * REGRAS · os números do registo da base contra as palavras que o leitor lê.
 * @param {string} sql o texto do registo da base
 * @param {typeof SUGESTOES} textos
 * @param {typeof LIMITES_DAS_SUGESTOES} limites
 * @returns {string[]}
 */
export function conferirRegrasDaBase(sql, textos = SUGESTOES, limites = LIMITES_DAS_SUGESTOES) {
  const erros = [];
  const numero = (re, oQue) => {
    const m = sql.match(re);
    if (!m) erros.push(`S1 regras: o registo da base não diz ${oQue} (${re}).`);
    return m ? Number(m[1]) : null;
  };
  /** A frase tem de dizer o número por extenso, num dos feitios da tabela. */
  const diz = (n, frase, molde, oQue) => {
    if (n === null) return;
    const formas = POR_EXTENSO[/** @type {1|5|90} */ (n)];
    if (!formas) {
      erros.push(`S1 regras: ${oQue} é ${n} no registo da base, e esta célula não sabe dizê-lo por extenso; escreva-o na tabela POR_EXTENSO e no texto.`);
      return;
    }
    for (const lang of /** @type {Lingua[]} */ (['pt', 'en'])) {
      if (!formas[lang].some((p) => frase[lang].includes(molde[lang](p)))) {
        erros.push(`S1 regras: ${oQue} é ${n} no registo da base, e o texto ${lang} não o diz («${frase[lang]}»).`);
      }
    }
  };
  diz(numero(/if v_n > (\d+) then/, 'o limite por marca e por hora'), textos.resultados.limite, { pt: (p) => `${p} sugestões`, en: (p) => `${p} suggestions` }, 'o limite por marca e por hora');
  diz(numero(/interval '(\d+) hours?'\)\s*\n\s*on conflict/, 'o prazo da marca'), textos.nota, { pt: (p) => `durante ${p} hora`, en: (p) => `for ${p} hour` }, 'o prazo da marca');
  diz(numero(/decidido_em < now\(\) - interval '(\d+) days'/, 'a retenção de uma sugestão decidida'), textos.nota, { pt: (p) => `ao fim de ${p} dias`, en: (p) => `after ${p} days` }, 'a retenção de uma sugestão decidida');
  diz(numero(/criado_em < now\(\) - interval '(\d+) years?'/, 'a retenção de uma sugestão por decidir'), textos.nota, { pt: (p) => `ao fim de ${p} ano`, en: (p) => `after ${p} year` }, 'a retenção de uma sugestão por decidir');
  for (const [coluna, limite] of /** @type {[string, number][]} */ ([
    ['pagina', limites.pagina],
    ['procurou', limites.texto],
    ['estudo', limites.texto],
    ['outro', limites.texto],
    ['contacto', limites.contacto],
  ])) {
    const n = numero(new RegExp(`char_length\\(${coluna}\\) <= (\\d+)`), `o limite da coluna ${coluna}`);
    if (n !== null && n !== limite) erros.push(`S1 regras: a base guarda até ${n} caracteres em ${coluna}, e o formulário e a função usam ${limite}.`);
  }
  return erros;
}

/**
 * AS PLANTAS DA CAIXA, em memória, em cada corrida: cada uma tem de ser recusada
 * pela conferência com a queixa esperada. Devolve as que não morderam.
 * @param {string} sql
 * @returns {{ nome: string, mordeu: boolean }[]}
 */
export function plantasDaCaixa(sql) {
  const lang = /** @type {Lingua} */ ('pt');
  const formulario = routePath('sugestoes', lang);
  const pagina = (porta) => parse(`<html><body><main><h1>x</h1></main><footer><span data-porta-correccoes>c</span>${porta}</footer></body></html>`);
  const boa = `<span data-porta-sugestoes><a href="${formulario}?de=%2Flugares">${SUGESTOES.titulo[lang]}</a></span>`;
  const casos = [
    { nome: 'porta-controlo', espera: null, erros: () => conferirPortaDasSugestoes(pagina(boa), { caminho: '/lugares', lang }) },
    { nome: 'porta-a-dobrar', espera: /exatamente uma/, erros: () => conferirPortaDasSugestoes(pagina(boa + boa), { caminho: '/lugares', lang }) },
    { nome: 'porta-com-outro-de', espera: /\?de=/, erros: () => conferirPortaDasSugestoes(pagina(boa), { caminho: '/temas', lang }) },
    { nome: 'porta-da-outra-edicao', espera: /formulário desta edição/, erros: () => conferirPortaDasSugestoes(pagina(boa), { caminho: '/lugares', lang: 'en' }) },
    {
      nome: 'porta-no-main',
      espera: /dentro do <footer>/,
      erros: () =>
        conferirPortaDasSugestoes(parse(`<html><body><main>${boa}</main><footer><span data-porta-correccoes>c</span></footer></body></html>`), { caminho: '/lugares', lang }),
    },
    { nome: 'porta-escondida', espera: /escondida/, erros: () => conferirPortaDasSugestoes(pagina(boa.replace('<span data-porta-sugestoes>', '<span data-porta-sugestoes hidden>')), { caminho: '/lugares', lang }) },
    { nome: 'regras-controlo', espera: null, erros: () => conferirRegrasDaBase(sql) },
    { nome: 'regras-limite-mudado', espera: /limite por marca/, erros: () => conferirRegrasDaBase(sql.replace(/if v_n > \d+ then/, 'if v_n > 10 then')) },
    { nome: 'regras-retencao-mudada', espera: /sugestão decidida/, erros: () => conferirRegrasDaBase(sql.replace(/decidido_em < now\(\) - interval '\d+ days'/, "decidido_em < now() - interval '30 days'")) },
    { nome: 'regras-coluna-mais-curta', espera: /em procurou/, erros: () => conferirRegrasDaBase(sql.replace(/char_length\(procurou\) <= \d+/, 'char_length(procurou) <= 1000')) },
  ];
  return casos.map((c) => {
    const erros = c.erros();
    const mordeu = c.espera === null ? erros.length === 0 : erros.some((e) => c.espera.test(e));
    return { nome: c.nome, mordeu };
  });
}
