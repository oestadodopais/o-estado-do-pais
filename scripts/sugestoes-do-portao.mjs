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
 *             declarados (desde a passagem de higiene H3, 05.10.2026, a nota é uma
 *             linha e a porta «Como tratamos os seus dados» para a página
 *             «Privacidade», e uma só ligação), o formulário que vai por POST a `/api/sugestoes` com os
 *             cinco campos e mais nenhum (sem o do contacto, que saiu na passagem
 *             S1-c por decisão do diretor), o campo armadilhado fora da árvore de
 *             acessibilidade e do teclado, os limites de cada caixa, e nenhum
 *             guião no `<main>`; as quatro do resultado com `noindex, follow`, a
 *             sua frase e as duas portas; e, na página das correções, a frase com
 *             a porta das sugestões;
 *   MAPA    · `conferirMapaDasSugestoes()`: no mapa do sítio construído, a página
 *             do formulário das duas edições e nenhuma das do resultado;
 *   REGRAS  · `conferirRegrasDaBase()`: desde a passagem S1-b (03.10.2026, o
 *             achado 8 da leitura a frio do Sol), lê todas as migrações de
 *             `supabase/migrations/` por ordem de nome, segue o que cada uma cria,
 *             apaga, agenda e desagenda, e confere as regras em vigor no fim contra
 *             a tabela declarada (`REGRAS_DA_CAIXA`) e contra as palavras que o
 *             leitor lê: a chave exigida (e nenhuma função sem ela viva), a tranca,
 *             o teto do dia, a marca de 64 caracteres, a limpeza das marcas, a
 *             janela de uma hora, cinco por marca, a retenção de noventa dias e de
 *             um ano, e a tarefa que apaga as marcas de hora a hora. Se a base mudar
 *             e o texto não, o leitor lê uma regra falsa, e a construção fecha.
 *             Desde a passagem de higiene H3 (05.10.2026), a janela da marca e a
 *             retenção leem-se no texto da página «Privacidade»
 *             (`src/data/privacidade.mjs`), que é onde a nota passou a dizê-las; o
 *             limite por marca continua na página do limite.
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
import { PRIVACIDADE } from '../src/data/privacidade.mjs';

/** As páginas desta família que levam `noindex` e ficam fora do mapa do sítio. */
export const ROTAS_SEM_INDICE = new Set(Object.values(ROTAS_DO_RESULTADO));
/**
 * Os campos do formulário, e mais nenhum: o que o leitor manda é só isto. O do contacto saiu na passagem
 * S1-c (03.10.2026, decisão do diretor, §1.154): a caixa não tem resposta, e o formulário não o pede.
 */
export const CAMPOS_DO_FORMULARIO = ['lingua', 'sitio', 'procurou', 'estudo', 'outro'];
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
    const frase = blocoDeclarado(root, '[data-sugestoes-nas-correcoes]', SUGESTOES.portaNasCorrecoes[lang], 'S1 correções', erros);
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
  /* S1-c: o campo do contacto saiu por decisão do diretor (§1.154), e a caixa não tem resposta. A lista dos campos
     já o recusa; esta conferência di-lo pelo nome, para que voltar a pô-lo seja uma decisão e não um descuido. */
  if (form.querySelector('[name="contacto"]') || form.querySelector('input[type="email"]')) {
    erros.push('S1 formulário: o formulário pede um contacto, e o campo do contacto saiu por decisão do diretor (S1-c, §1.154): a caixa não tem resposta.');
  }
  /* H3 (05.10.2026, o §5, decisão 1, do brief H3): a nota é uma linha e a porta para a página «Privacidade», que diz o
     resto; uma ligação só, para a página da edição, com as palavras declaradas. Um formulário sem a porta deixava o
     leitor sem o que a lei lhe deve dizer, e fecha a construção. */
  const nota = blocoDeclarado(form, '[data-sugestoes-nota]', `${SUGESTOES.nota[lang]} ${SUGESTOES.portaDaNota[lang]}`, 'S1 formulário (a nota do que fica guardado)', erros);
  if (nota) ligacaoDe(nota, routePath('privacidade', lang), SUGESTOES.portaDaNota[lang], 'H3 formulário (a porta da nota para a página «Privacidade»)', erros);
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
 * AS REGRAS DECLARADAS DA CAIXA (S1-b, 03.10.2026, o achado 8 da leitura a frio do Sol): o que a
 * última definição de cada coisa nas migrações tem de fazer. Os números são os do §0 do brief e da
 * segunda migração; a nota, a página do limite, o formulário e a função dizem ou usam os mesmos, e esta
 * célula confere os dois lados. Mudar uma regra é uma migração nova, esta tabela e os textos, no mesmo
 * commit: se só a base mudar, a construção fecha.
 */
export const REGRAS_DA_CAIXA = {
  porMarcaPorHora: 5,
  janelaDaMarcaHoras: 1,
  porDia: 200,
  janelaDoDiaHoras: 24,
  comprimentoDaMarca: 64,
  retencaoDecididaDias: 90,
  retencaoPorDecidirAnos: 1,
};

/** O texto de uma migração sem os comentários de linha (`--`), que não são regra nenhuma. */
const semComentarios = (sql) => sql.replace(/(^|[^:'\w])--[^\n]*/g, '$1');

/** Os tipos de uma lista de parâmetros («p_chave text, p_lingua text» ou «text, text»), normalizados. */
const tiposDe = (parametros) =>
  parametros
    .split(',')
    .map((x) => x.trim().split(/\s+/).pop() ?? '')
    .filter(Boolean)
    .join(',');

/**
 * A HISTÓRIA DAS MIGRAÇÕES, POR ORDEM DE NOME: cada função `public.enviar_sugestao` criada ou apagada, e
 * cada tarefa do `pg_cron` agendada ou desagendada, pela ordem em que as migrações as fazem. Devolve o que
 * fica no fim: as funções vivas (pela assinatura) e as tarefas vivas (pelo nome).
 * @param {{ nome: string, sql: string }[]} migracoes
 */
export function estadoDasMigracoes(migracoes) {
  const ordenadas = [...migracoes].sort((a, b) => (a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0));
  const texto = ordenadas.map((m) => semComentarios(m.sql)).join('\n');
  /** @type {{ i: number, faz: () => void }[]} */
  const eventos = [];
  /** @type {Map<string, { parametros: string, corpo: string }>} */
  const funcoes = new Map();
  /** @type {Map<string, { quando: string, comando: string }>} */
  const tarefas = new Map();
  for (const m of texto.matchAll(/create\s+(?:or\s+replace\s+)?function\s+public\.enviar_sugestao\s*\(([^)]*)\)[\s\S]*?\$\$([\s\S]*?)\$\$/gi)) {
    eventos.push({ i: m.index ?? 0, faz: () => funcoes.set(tiposDe(m[1]), { parametros: m[1].trim(), corpo: m[2] }) });
  }
  for (const m of texto.matchAll(/drop\s+function\s+(?:if\s+exists\s+)?public\.enviar_sugestao\s*\(([^)]*)\)/gi)) {
    eventos.push({ i: m.index ?? 0, faz: () => funcoes.delete(tiposDe(m[1])) });
  }
  for (const m of texto.matchAll(/cron\.schedule\(\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*\$\$([\s\S]*?)\$\$\s*\)/gi)) {
    eventos.push({ i: m.index ?? 0, faz: () => tarefas.set(m[1], { quando: m[2], comando: m[3] }) });
  }
  for (const m of texto.matchAll(/cron\.unschedule\(\s*'([^']+)'\s*\)/gi)) {
    eventos.push({ i: m.index ?? 0, faz: () => tarefas.delete(m[1]) });
  }
  for (const e of eventos.sort((a, b) => a.i - b.i)) e.faz();
  return { funcoes, tarefas, texto, ficheiros: ordenadas.map((m) => m.nome) };
}

/**
 * REGRAS · as regras em vigor no fim das migrações, contra a tabela declarada e contra as palavras que o
 * leitor lê: a chave exigida (e nenhuma função sem ela viva), a tranca, o teto do dia, a marca de 64
 * caracteres, a limpeza das marcas expiradas, a janela de uma hora, o limite por marca, a retenção das
 * sugestões e a tarefa que apaga as marcas de hora a hora; e os limites de cada coluna contra o
 * formulário e a função. A janela da marca e a retenção dizem-se, desde o H3, no texto da página «Privacidade».
 * @param {{ nome: string, sql: string }[]} migracoes
 * @param {typeof SUGESTOES} textos
 * @param {typeof LIMITES_DAS_SUGESTOES} limites
 * @param {{ pt: string, en: string }} privacidade o texto da página «Privacidade» nas duas edições
 * @returns {string[]}
 */
export function conferirRegrasDaBase(migracoes, textos = SUGESTOES, limites = LIMITES_DAS_SUGESTOES, privacidade = PRIVACIDADE.texto) {
  const erros = [];
  if (!migracoes.length) return ['S1 regras: não há migração nenhuma da caixa das sugestões.'];
  const { funcoes, tarefas, texto } = estadoDasMigracoes(migracoes);
  /** Um número de uma expressão num texto, ou null com o erro dito. */
  const numero = (onde, re, oQue) => {
    const m = onde.match(re);
    if (!m) erros.push(`S1 regras: a regra em vigor não diz ${oQue}.`);
    return m ? Number(m[1]) : null;
  };
  /** O número em vigor tem de ser o declarado. */
  const igual = (n, declarado, oQue) => {
    if (n !== null && n !== declarado) erros.push(`S1 regras: ${oQue} é ${n} na regra em vigor, e a regra declarada é ${declarado}.`);
  };
  /** A frase tem de dizer o número por extenso, num dos feitios da tabela. */
  const diz = (n, frase, molde, oQue) => {
    if (n === null) return;
    const formas = POR_EXTENSO[/** @type {1|5|90} */ (n)];
    if (!formas) {
      erros.push(`S1 regras: ${oQue} é ${n}, e esta célula não sabe dizê-lo por extenso; escreva-o na tabela POR_EXTENSO e no texto.`);
      return;
    }
    for (const lang of /** @type {Lingua[]} */ (['pt', 'en'])) {
      if (!formas[lang].some((p) => frase[lang].includes(molde[lang](p)))) {
        erros.push(`S1 regras: ${oQue} é ${n}, e o texto ${lang} não o diz («${frase[lang]}»).`);
      }
    }
  };

  /* A FUNÇÃO: uma só viva, e é a que exige a chave. */
  const vivas = [...funcoes.values()];
  const semChave = vivas.filter((f) => !/^p_chave\s/.test(f.parametros));
  if (semChave.length) erros.push(`S1 regras: há ${semChave.length} função(ões) enviar_sugestao vivas sem a chave como primeiro parâmetro (${semChave.map((f) => `(${f.parametros})`).join('; ')}); a chave exigida é a proteção da base contra quem a chame por fora da Vercel.`);
  if (vivas.length !== 1) erros.push(`S1 regras: há ${vivas.length} função(ões) enviar_sugestao vivas no fim das migrações, e tem de haver uma.`);
  const corpo = vivas.find((f) => /^p_chave\s/.test(f.parametros))?.corpo ?? '';
  if (corpo) {
    if (!/raise\s+exception\s+'chave'/i.test(corpo) || !/digest\(\s*p_chave\s*,/i.test(corpo)) {
      erros.push('S1 regras: a função em vigor não exige a chave (falta a comparação do resumo de p_chave e a recusa «chave»).');
    }
    const tranca = corpo.search(/pg_advisory_xact_lock\s*\(/i);
    const contagem = corpo.search(/into\s+v_dia\b/i);
    if (tranca < 0 || contagem < 0 || tranca > contagem) erros.push('S1 regras: a função em vigor conta o teto do dia sem a tranca antes da contagem, e dois envios ao mesmo tempo passam os dois.');
    igual(numero(corpo, /into\s+v_dia\s+from\s+sugestoes\s+where\s+criado_em\s*>\s*now\(\)\s*-\s*interval\s+'(\d+)\s+hours?'/i, 'a janela do teto do dia'), REGRAS_DA_CAIXA.janelaDoDiaHoras, 'a janela do teto do dia, em horas,');
    igual(numero(corpo, /if\s+v_dia\s*>=\s*(\d+)\s+then\s+raise\s+exception\s+'cheia'/i, 'o teto do dia'), REGRAS_DA_CAIXA.porDia, 'o teto do dia');
    igual(numero(corpo, /length\(\s*p_marca\s*\)\s*<>\s*(\d+)\s+then\s+raise\s+exception\s+'marca'/i, 'o comprimento da marca'), REGRAS_DA_CAIXA.comprimentoDaMarca, 'o comprimento da marca');
    if (!/delete\s+from\s+sugestoes_limites\s+where\s+ate\s*<\s*now\(\)/i.test(corpo)) erros.push('S1 regras: a função em vigor não apaga as marcas expiradas antes de contar (a limpeza).');
    const janela = numero(corpo, /values\s*\(\s*p_marca\s*,\s*1\s*,\s*now\(\)\s*\+\s*interval\s+'(\d+)\s+hours?'\s*\)/i, 'a janela da marca');
    igual(janela, REGRAS_DA_CAIXA.janelaDaMarcaHoras, 'a janela da marca, em horas,');
    diz(janela, privacidade, { pt: (p) => `durante ${p} hora`, en: (p) => `for ${p} hour` }, 'a janela da marca');
    const porMarca = numero(corpo, /if\s+v_n\s*>\s*(\d+)\s+then\s+raise\s+exception\s+'limite'/i, 'o limite por marca e por hora');
    igual(porMarca, REGRAS_DA_CAIXA.porMarcaPorHora, 'o limite por marca e por hora');
    diz(porMarca, textos.resultados.limite, { pt: (p) => `${p} sugestões`, en: (p) => `${p} suggestions` }, 'o limite por marca e por hora');
  }

  /* AS TAREFAS: a retenção das sugestões, e as marcas apagadas de hora a hora. */
  const retencao = tarefas.get('sugestoes-retencao');
  if (!retencao) erros.push('S1 regras: a tarefa da retenção (sugestoes-retencao) não está agendada no fim das migrações.');
  else {
    const dias = numero(retencao.comando, /decidido_em\s*<\s*now\(\)\s*-\s*interval\s+'(\d+)\s+days'/i, 'a retenção de uma sugestão decidida');
    igual(dias, REGRAS_DA_CAIXA.retencaoDecididaDias, 'a retenção de uma sugestão decidida, em dias,');
    diz(dias, privacidade, { pt: (p) => `ao fim de ${p} dias`, en: (p) => `after ${p} days` }, 'a retenção de uma sugestão decidida');
    const anos = numero(retencao.comando, /criado_em\s*<\s*now\(\)\s*-\s*interval\s+'(\d+)\s+years?'/i, 'a retenção de uma sugestão por decidir');
    igual(anos, REGRAS_DA_CAIXA.retencaoPorDecidirAnos, 'a retenção de uma sugestão por decidir, em anos,');
    diz(anos, privacidade, { pt: (p) => `ao fim de ${p} ano`, en: (p) => `after ${p} year` }, 'a retenção de uma sugestão por decidir');
  }
  const marcas = tarefas.get('sugestoes-marcas');
  if (!marcas) erros.push('S1 regras: a tarefa que apaga as marcas de hora a hora (sugestoes-marcas) não está agendada no fim das migrações.');
  else {
    const campos = marcas.quando.trim().split(/\s+/);
    if (campos.length !== 5 || campos.slice(1).some((c) => c !== '*')) erros.push(`S1 regras: a tarefa das marcas corre «${marcas.quando}», e tem de correr de hora a hora.`);
    if (!/delete\s+from\s+public\.sugestoes_limites\s+where\s+ate\s*<\s*now\(\)/i.test(marcas.comando)) erros.push('S1 regras: a tarefa das marcas não apaga as marcas expiradas.');
  }

  /* AS COLUNAS: o que a base guarda, contra o formulário e a função. */
  for (const [coluna, limite] of /** @type {[string, number][]} */ ([
    ['pagina', limites.pagina],
    ['procurou', limites.texto],
    ['estudo', limites.texto],
    ['outro', limites.texto],
    /* A coluna do contacto fica na base como está, e a função manda-a sempre vazia (S1-c): não tem limite a conferir. */
  ])) {
    const n = numero(texto, new RegExp(`char_length\\(${coluna}\\) <= (\\d+)`), `o limite da coluna ${coluna}`);
    if (n !== null && n !== limite) erros.push(`S1 regras: a base guarda até ${n} caracteres em ${coluna}, e o formulário e a função usam ${limite}.`);
  }
  return erros;
}

/**
 * UM FORMULÁRIO ESCRITO PARA AS PLANTAS (H3), com os textos declarados, os campos, os limites e a nota; `comPorta` diz
 * se a nota leva a porta para a página «Privacidade». O de controlo tem de passar inteiro na conferência das páginas.
 * @param {Lingua} lang @param {boolean} comPorta
 */
function formularioDePlanta(lang, comPorta) {
  const r = SUGESTOES.rotulos;
  const [antes, porta, depois] = [SUGESTOES.paragrafo[lang].split(SUGESTOES.portaDoParagrafo[lang])[0], SUGESTOES.portaDoParagrafo[lang], SUGESTOES.paragrafo[lang].split(SUGESTOES.portaDoParagrafo[lang])[1]];
  const caixa = (nome) => `<p><label for="s-${nome}">${r[nome][lang]}</label><textarea id="s-${nome}" name="${nome}" maxlength="${LIMITES_DAS_SUGESTOES.texto}"></textarea></p>`;
  const nota = comPorta
    ? `${SUGESTOES.nota[lang]} <a href="${routePath('privacidade', lang)}">${SUGESTOES.portaDaNota[lang]}</a>`
    : `${SUGESTOES.nota[lang]} ${SUGESTOES.portaDaNota[lang]}`;
  return parse(
    `<html><body><main><h1>${SUGESTOES.titulo[lang]}</h1><p data-sugestoes-paragrafo>${antes}<a href="${routePath('correcoes', lang)}">${porta}</a>${depois}</p>` +
      `<form method="post" action="/api/sugestoes"><input type="hidden" name="lingua" value="${lang}">` +
      `<div aria-hidden="true"><label for="s-sitio">${r.sitio[lang]}</label><input id="s-sitio" name="sitio" type="text" tabindex="-1" autocomplete="off"></div>` +
      `${caixa('procurou')}${caixa('estudo')}${caixa('outro')}<p data-sugestoes-nota>${nota}</p><p><button type="submit">${SUGESTOES.botao[lang]}</button></p></form></main></body></html>`,
  );
}

/**
 * AS PLANTAS DA CAIXA, em memória, em cada corrida: cada uma tem de ser recusada
 * pela conferência com a queixa esperada. Devolve as que não morderam.
 * @param {{ nome: string, sql: string }[]} migracoes
 * @returns {{ nome: string, mordeu: boolean }[]}
 */
export function plantasDaCaixa(migracoes) {
  const ordenadas = [...migracoes].sort((a, b) => (a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0));
  /** Uma cópia das migrações com uma troca num ficheiro; a troca tem de mudar o ficheiro. */
  const troca = (indice, re, por) =>
    ordenadas.map((m, i) => {
      if (i !== indice) return { ...m };
      const sql = m.sql.replace(re, por);
      if (sql === m.sql) throw new Error(`S1: a planta das regras não achou ${re} em ${m.nome}`);
      return { ...m, sql };
    });
  const naUltima = (re, por) => troca(ordenadas.length - 1, re, por);
  const naPrimeira = (re, por) => troca(0, re, por);
  const depoisDaUltima = (sql) => [...ordenadas.map((m) => ({ ...m })), { nome: '9999-12-31-planta.sql', sql }];
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
    { nome: 'regras-controlo', espera: null, erros: () => conferirRegrasDaBase(migracoes) },
    /* S1-b (o achado 8): as plantas mexem na ÚLTIMA definição de cada coisa, ou acrescentam uma migração
       depois da última, que é o que a célula tem de seguir. */
    { nome: 'regras-limite-mudado', espera: /limite por marca e por hora é 10/, erros: () => conferirRegrasDaBase(naUltima(/if v_n > \d+ then/, 'if v_n > 10 then')) },
    { nome: 'regras-limpeza-tirada', espera: /não apaga as marcas expiradas antes de contar/, erros: () => conferirRegrasDaBase(naUltima(/\n\s*delete from sugestoes_limites where ate < now\(\);/, '')) },
    { nome: 'regras-teto-tirado', espera: /o teto do dia é 200000/, erros: () => conferirRegrasDaBase(naUltima(/if v_dia >= \d+ then/, 'if v_dia >= 200000 then')) },
    { nome: 'regras-tranca-tirada', espera: /sem a tranca antes da contagem/, erros: () => conferirRegrasDaBase(naUltima(/\n\s*perform pg_advisory_xact_lock\([^)]*\)\);/, '')) },
    { nome: 'regras-chave-tirada', espera: /não exige a chave/, erros: () => conferirRegrasDaBase(naUltima(/\n\s*raise exception 'chave';/, '')) },
    { nome: 'regras-funcao-antiga-viva', espera: /sem a chave como primeiro parâmetro/, erros: () => conferirRegrasDaBase(naUltima(/drop function if exists public\.enviar_sugestao\([^)]*\);/, '')) },
    { nome: 'regras-retencao-desagendada', espera: /a tarefa da retenção \(sugestoes-retencao\) não está agendada/, erros: () => conferirRegrasDaBase(depoisDaUltima("select cron.unschedule('sugestoes-retencao');")) },
    { nome: 'regras-retencao-mudada', espera: /sugestão decidida, em dias, é 30/, erros: () => conferirRegrasDaBase(naPrimeira(/decidido_em < now\(\) - interval '\d+ days'/, "decidido_em < now() - interval '30 days'")) },
    { nome: 'regras-marcas-diarias', espera: /tem de correr de hora a hora/, erros: () => conferirRegrasDaBase(naUltima(/'sugestoes-marcas', '[^']+'/, "'sugestoes-marcas', '7 4 * * *'")) },
    { nome: 'regras-coluna-mais-curta', espera: /em procurou/, erros: () => conferirRegrasDaBase(naPrimeira(/char_length\(procurou\) <= \d+/, 'char_length(procurou) <= 1000')) },
    /* H3 (05.10.2026): a janela e a retenção dizem-se na página «Privacidade», e um prazo mudado só no texto morde. */
    {
      nome: 'regras-privacidade-com-outro-prazo',
      espera: /a retenção de uma sugestão decidida é 90, e o texto pt não o diz/,
      erros: () => conferirRegrasDaBase(migracoes, SUGESTOES, LIMITES_DAS_SUGESTOES, { ...PRIVACIDADE.texto, pt: PRIVACIDADE.texto.pt.replace('noventa dias', 'trinta dias') }),
    },
    {
      nome: 'regras-privacidade-com-outra-janela',
      espera: /a janela da marca é 1, e o texto en não o diz/,
      erros: () => conferirRegrasDaBase(migracoes, SUGESTOES, LIMITES_DAS_SUGESTOES, { ...PRIVACIDADE.texto, en: PRIVACIDADE.texto.en.replace('for one hour', 'for two hours') }),
    },
    /* E a nota do formulário sem a porta para a página «Privacidade» (a planta que o brief H3 pede, §3, ponto 1). */
    { nome: 'formulario-controlo', espera: null, erros: () => conferirPaginaDasSugestoes(formularioDePlanta(lang, true), { key: 'sugestoes', lang }) },
    { nome: 'formulario-nota-sem-a-porta', espera: /H3 formulário \(a porta da nota para a página «Privacidade»\): tem 0 ligação/, erros: () => conferirPaginaDasSugestoes(formularioDePlanta(lang, false), { key: 'sugestoes', lang }) },
  ];
  return casos.map((c) => {
    const erros = c.erros();
    const mordeu = c.espera === null ? erros.length === 0 : erros.some((e) => c.espera.test(e));
    return { nome: c.nome, mordeu };
  });
}
