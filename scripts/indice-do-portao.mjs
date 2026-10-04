/**
 * ---------------------------------------------------------------------------
 * AS SETE PORTAS DO RODAPÉ, LIDAS PELO PORTÃO DE HTML (bloco R3, 04.10.2026)
 * ---------------------------------------------------------------------------
 * O brief R3 (§3, ponto 2) manda pôr a porta do índice no rodapé de todas as páginas, nas duas
 * edições, e passar a sete «as células que contam as portas do rodapé». Medido a 04.10.2026 na
 * cabeça `358e3649`: nenhuma célula contava as seis portas da navegação do rodapé
 * (`ROTAS_RODAPE`, em `src/lib/navegacao.mjs`). O portão contava, uma por página, a porta das
 * correções, a das sugestões e a do Sobre; o `check:pais` conta as seis do menu do cabeçalho (N1);
 * e nenhuma régua lia a fila do rodapé. Esta é a célula que faltava, e conta sete.
 *
 * O QUE CONFERE, em todas as páginas que levam a porta das correções (todas, menos os documentos
 * alojados, que saem do laço antes): uma navegação do rodapé, dentro do `<footer>`, com as sete
 * portas pela ordem e com o destino e o nome que cada uma tem nesta edição, e a troca de língua
 * como última ligação. A lista esperada está escrita aqui, e não importada de
 * `src/lib/navegacao.mjs` nem de `src/i18n/strings.mjs`: uma conferência que lesse as mesmas
 * listas que a página usa confirmava-se a si própria (é a regra da N1 do `check:pais`, que escreve
 * as seis portas do menu à mão). Quem mudar uma porta do rodapé muda esta lista no mesmo commit.
 *
 * As plantas em memória (`plantasDasPortasDoRodape()`) correm em cada corrida do portão: um rodapé
 * com seis portas, a porta do índice da outra edição, a ordem trocada e duas trocas de língua têm
 * de ser recusados com a queixa esperada, e o rodapé intacto tem de passar.
 */
import { parse } from 'node-html-parser';

/** As sete portas da navegação do rodapé, por edição e por ordem: o destino e o nome. */
export const PORTAS_DO_RODAPE = {
  pt: [
    ['/', 'Início'],
    ['/livro-razao', 'Números e fontes'],
    ['/metodo', 'Método'],
    ['/correcoes', 'Correções'],
    ['/agenda', 'Agenda'],
    ['/uniao-europeia', 'Portugal na União Europeia'],
    ['/indice', 'Índice'],
  ],
  en: [
    ['/en', 'Home'],
    ['/en/ledger', 'Numbers and sources'],
    ['/en/method', 'Method'],
    ['/en/corrections', 'Corrections'],
    ['/en/agenda', 'Agenda'],
    ['/en/european-union', 'Portugal in the European Union'],
    ['/en/index', 'Index'],
  ],
};

const desfaz = (s) =>
  String(s ?? '')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
/** O texto de um nó como o leitor o lê: as entidades desfeitas e os espaços juntos. */
const textoDe = (no) => desfaz(no?.textContent ?? '').replace(/\s+/g, ' ').trim();

/**
 * As portas do rodapé de uma página.
 * @param {import('node-html-parser').HTMLElement} root
 * @param {{ lang: 'pt'|'en' }} pagina
 * @returns {string[]}
 */
export function conferirPortasDoRodape(root, { lang }) {
  const erros = [];
  const navs = root.querySelectorAll('nav.rodape-nav');
  const noRodape = navs.filter((n) => n.closest('footer') !== null);
  if (navs.length !== 1 || noRodape.length !== 1) {
    erros.push(
      `R3 rodapé: esta página tem ${navs.length} navegação(ões) do rodapé, ${noRodape.length} dentro do <footer>; ` +
        'tem de ter uma, dentro do <footer> (`SiteFooter.astro`).',
    );
    return erros;
  }
  const ligacoes = noRodape[0].querySelectorAll('a[href]');
  const troca = ligacoes.filter((a) => a.hasAttribute('hreflang'));
  const portas = ligacoes.filter((a) => !a.hasAttribute('hreflang'));
  const esperadas = PORTAS_DO_RODAPE[lang === 'en' ? 'en' : 'pt'];
  const lidas = portas.map((a) => [desfaz(a.getAttribute('href')), textoDe(a)]);
  const dizer = (lista) => lista.map(([h, t]) => `«${t}» ${h}`).join(' · ');
  if (lidas.length !== esperadas.length) {
    erros.push(`R3 rodapé: o rodapé tem ${lidas.length} porta(s) e são ${esperadas.length}: ${dizer(lidas)}.`);
  } else {
    esperadas.forEach(([href, texto], i) => {
      const [h, t] = lidas[i];
      if (h !== href || t !== texto) {
        erros.push(`R3 rodapé: a porta ${i + 1} do rodapé é «${t}» para ${h}; nesta edição é «${texto}» para ${href}.`);
      }
    });
  }
  if (troca.length !== 1) erros.push(`R3 rodapé: o rodapé tem ${troca.length} troca(s) de língua; tem uma, a última ligação.`);
  else if (ligacoes[ligacoes.length - 1] !== troca[0]) erros.push('R3 rodapé: a troca de língua não é a última ligação da navegação do rodapé.');
  return erros;
}

/** Um rodapé escrito para as plantas, com as portas dadas e a troca de língua no fim. */
function rodapeDePlanta(lang, portas, trocas = 1) {
  const outra = lang === 'pt' ? ['/en', 'en', 'English'] : ['/', 'pt-PT', 'Português'];
  const fim = Array.from({ length: trocas }, () => `<a href="${outra[0]}" hreflang="${outra[1]}">${outra[2]}</a>`).join(' · ');
  return parse(
    `<html><body><footer class="rodape"><nav class="rodape-nav" aria-label="x">` +
      portas.map(([h, t]) => `<a href="${h}">${t}</a> · `).join('') +
      `${fim}</nav></footer></body></html>`,
  );
}

/**
 * As plantas em memória: cada uma tem de ser recusada com a queixa esperada, e o rodapé intacto
 * tem de passar nas duas edições.
 * @returns {{ nome: string, mordeu: boolean }[]}
 */
export function plantasDasPortasDoRodape() {
  const resultados = [];
  for (const lang of /** @type {const} */ (['pt', 'en'])) {
    const certas = PORTAS_DO_RODAPE[lang];
    const limpo = conferirPortasDoRodape(rodapeDePlanta(lang, certas), { lang });
    resultados.push({ nome: `r3-rodape-intacto-${lang}`, mordeu: limpo.length === 0 });
    const casos = [
      ['r3-rodape-com-seis-portas', certas.slice(0, 6), 1, /tem 6 porta\(s\) e são 7/],
      ['r3-rodape-indice-da-outra-edicao', certas.map(([h, t]) => (t === certas[6][1] ? [PORTAS_DO_RODAPE[lang === 'pt' ? 'en' : 'pt'][6][0], t] : [h, t])), 1, /a porta 7 do rodapé/],
      ['r3-rodape-ordem-trocada', [...certas.slice(0, 5), certas[6], certas[5]], 1, /a porta 6 do rodapé/],
      ['r3-rodape-duas-trocas-de-lingua', certas, 2, /2 troca\(s\) de língua/],
    ];
    for (const [nome, portas, trocas, mordida] of casos) {
      const erros = conferirPortasDoRodape(rodapeDePlanta(lang, portas, trocas), { lang });
      resultados.push({ nome: `${nome}-${lang}`, mordeu: erros.some((e) => mordida.test(e)) });
    }
  }
  return resultados;
}
