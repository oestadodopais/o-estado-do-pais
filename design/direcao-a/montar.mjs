/* Direção A · Refinamento · montagem dos protótipos.
   Junta as fichas de valor (tokens.css), a folha partilhada (_estilo.css) e o
   corpo de cada página (partes/*.html) num ficheiro por página, sem nenhum
   pedido para fora. Depois monta 06-mobile.html e board.html a partir dos
   ficheiros já montados, embebidos com srcdoc.

   node design/direcao-a/montar.mjs                                          */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const S = 'https://oestadodopaís.pt';
const MARCA = '<!-- Direção A · Refinamento · protótipo de O Estado do País. Sem script, sem pedidos para fora. -->';

const tokens = readFileSync(join(AQUI, 'tokens.css'), 'utf8');
const estilo = readFileSync(join(AQUI, '_estilo.css'), 'utf8');

/* A folha vai inteira para o repositório, com os seus comentários, e vai
   apertada para dentro de cada protótipo: um ficheiro que se abre sozinho não
   pode pedir uma folha a lado nenhum, e cada quadro do painel carrega a sua.
   Cada página leva só as secções que usa, marcadas na folha por nome. */
function apertar(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*([{}:;,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .replace(/\s+/g, ' ')
    .trim();
}
const SECOES = Object.fromEntries(
  estilo.split(/\/\*#([a-z]+)\*\//).slice(1).reduce((acc, v, i, a) => (i % 2 ? acc : [...acc, [v, a[i + 1]]]), [])
);
const TOKENS_MIN = apertar(tokens);
const folhaDe = (nomes) => TOKENS_MIN + nomes.map((n) => apertar(SECOES[n])).join('');



const NAV = [
  ['', 'Início'],
  ['/municipios', 'Municípios'],
  ['/estudos', 'Estudos'],
  ['/livro-razao', 'Livro-razão'],
  ['/agenda', 'Agenda'],
  ['/metodo', 'Método'],
  ['/sobre', 'Sobre'],
];
const RODAPE = [
  ['', 'Início'],
  ['/municipios', 'Municípios'],
  ['/estudos', 'Estudos'],
  ['/livro-razao', 'Livro-razão'],
  ['/agenda', 'Agenda'],
  ['/metodo', 'Método'],
  ['/correcoes', 'Correções'],
  ['/sobre', 'Sobre'],
];

/* O cabeçalho, igual em todas as páginas: barra, marca, linha de método e o
   sinal de tempo. `aqui` marca a entrada corrente; `en` é a rota da outra
   edição; `compacto` é tudo o que não é a primeira página. */
function cabecalho({ aqui = '', en = '/en', compacto = true }) {
  const item = ([rota, rotulo]) =>
    `<a href="${S}${rota}"${rota === aqui ? ' aria-current="page"' : ''}>${rotulo}</a>`;
  const marca = compacto
    ? `<p class="wordmark"><a href="${S}/">O Estado do País</a></p>`
    : `<h1 class="wordmark">O Estado do País</h1>`;
  return `<header class="cabeca-fim">
<div class="topbar">
<nav class="nav" aria-label="Início">${NAV.map(item).join('')}</nav>
<nav class="nav" aria-label="English"><a class="lang" href="${S}${en}" hreflang="en" lang="en">English</a></nav>
</div>
<div class="masthead${compacto ? ' masthead-compact' : ''}">
${marca}
<p class="method-line" lang="pt-PT">Portugal, medido. Cada número tem fonte.</p>
<div class="masthead-furniture" data-sinal-de-tempo>
<span><a href="${S}/#numeros"><span class="sinal-k">Painel europeu reconferido a</span><span class="sinal-v" data-nonledger="data-de-atualizacao">2026-08-12</span></a></span>
<span><span class="sinal-k">Agenda</span><span class="sinal-v"><a class="prova-valor" href="${S}/agenda" data-prova="agenda_em_curso" title="itens da agenda atravessados do motor">3</a> em curso · <a class="prova-valor" href="${S}/agenda" data-prova="agenda_a_seguir" title="itens da agenda atravessados do motor">1</a> a seguir</span></span>
</div>
</div>
</header>`;
}

/* A porta das correções, a mesma componente em todas as páginas. */
function porta(classe = 'porta-correccoes-rodape') {
  return `<div class="porta-correccoes ${classe}" data-porta-correccoes>
<span class="linha-campo-k">Encontrou um erro</span>
<p class="aparelho-nota">Escreva para <a class="ligacao-email" href="mailto:correcoes@oestadodopais.pt">correcoes@oestadodopais.pt</a>. Um erro confirmado entra no registo de correções e na própria linha, com o valor antigo à vista. Nada é apagado.</p>
<p><a href="${S}/correcoes">O registo de correções →</a></p>
</div>`;
}

function rodape(en = '/en') {
  const item = ([rota, rotulo]) => `<a href="${S}${rota}">${rotulo}</a>`;
  return `<footer class="rodape"><nav class="rodape-nav" aria-label="Início">${RODAPE.map(item).join('')}<a href="${S}${en}" hreflang="en">English</a></nav></footer>`;
}

/* O corpo escreve-se com recuos e linhas em branco, para se poder ler; sai sem
   eles, porque cada quadro do painel carrega uma cópia inteira de cada página.
   Nenhum espaço significativo se perde: só o recuo do princípio de cada linha e
   as linhas vazias, e nunca dentro de um bloco pré-formatado. */
function apertarCorpo(html) {
  const guardados = [];
  const marcado = html.replace(/<p class="deep-v verbatim"[\s\S]*?<\/p>/g, (m) => {
    guardados.push(m);
    return `@@PRE${guardados.length - 1}@@`;
  });
  const seco = marcado
    .replace(/^[ \t]+/gm, '')
    .replace(/\n{2,}/g, '\n')
    .replace(/<!--[\s\S]*?-->/g, '');
  return seco.replace(/@@PRE(\d+)@@/g, (_, k) => guardados[Number(k)]);
}

function pagina({ titulo, corpo, folha }) {
  return `${MARCA}
<!DOCTYPE html><html lang="pt-PT"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titulo}</title>
<style>${folha}</style>
</head><body>
<a class="skip" href="#conteudo">Saltar para o conteúdo</a>
<div class="wrap">
${apertarCorpo(corpo)}
</div>
</body></html>
`;
}

/* ------------------------------------------------------------- abreviaturas */
/* O selo e a afirmação escrevem-se dezenas de vezes por página. Aqui têm uma
   forma curta, para que o corpo da página se leia como página e não como
   marcação, e para que a marcação saia sempre igual.
     [[s:id|etiqueta]]        selo compacto
     [[su:id|etiqueta]]       selo compacto, proveniência incompleta
     [[sl:id|etiqueta]]       selo longo (o estudo à vista)
     [[c:id|valor]]           valor citado do livro-razão
     [[cs:id|valor|etiqueta]] valor com o seu selo ao lado
     [[csu:…]]                o mesmo, com proveniência incompleta
     [[pv:chave|valor|rota|titulo]]  número do próprio sítio, com porta
     [[ref:…]] [[esc:…]] [[lim:…]] [[num:…]]  contexto estrutural declarado  */
function selo(id, etiqueta, { incompleta = false, longo = false } = {}) {
  const classes = ['src-chip', longo && 'src-chip-longo', incompleta && 'is-unverified'].filter(Boolean).join(' ');
  const texto = longo
    ? `<span class="src-chip-texto" data-selo-etiqueta>${etiqueta}</span>`
    : `<span class="vh" data-selo-etiqueta>${etiqueta}</span>`;
  const marcador = incompleta ? `<span class="marcador" lang="pt-PT">[a verificar]</span>` : '';
  return `<a class="${classes}" href="${S}/livro-razao/${id}" data-nonledger="proveniencia"><span class="src-chip-palavra">fonte</span>${texto}${marcador}</a>`;
}
const valor = (id, v) => `<span data-claim="${id}" class="claim-value">${v}</span>`;
function abreviaturas(txt) {
  return txt
    .replace(/\[\[csu:([^|\]]+)\|([^|\]]*)\|([^\]]*)\]\]/g, (_, id, v, e) => `<span class="claim claim-com-chip">${valor(id, v)} ${selo(id, e, { incompleta: true })}</span>`)
    .replace(/\[\[cs:([^|\]]+)\|([^|\]]*)\|([^\]]*)\]\]/g, (_, id, v, e) => `<span class="claim claim-com-chip">${valor(id, v)} ${selo(id, e)}</span>`)
    .replace(/\[\[c:([^|\]]+)\|([^\]]*)\]\]/g, (_, id, v) => valor(id, v))
    .replace(/\[\[su:([^|\]]+)\|([^\]]*)\]\]/g, (_, id, e) => selo(id, e, { incompleta: true }))
    .replace(/\[\[slu:([^|\]]+)\|([^\]]*)\]\]/g, (_, id, e) => selo(id, e, { incompleta: true, longo: true }))
    .replace(/\[\[sl:([^|\]]+)\|([^\]]*)\]\]/g, (_, id, e) => selo(id, e, { longo: true }))
    .replace(/\[\[s:([^|\]]+)\|([^\]]*)\]\]/g, (_, id, e) => selo(id, e))
    .replace(/\[\[pv:([^|\]]+)\|([^|\]]*)\|([^|\]]*)\|([\s\S]*?)\]\](?!\])/g, (_, k, v, rota, t) => `<a class="prova-valor" href="${S}${rota}" data-prova="${k}" title="${t}">${v}</a>`)
    .replace(/\[\[ref:([^\]]*)\]\]/g, (_, v) => `<span data-nonledger="data-de-referencia">${v}</span>`)
    .replace(/\[\[esc:([^\]]*)\]\]/g, (_, v) => `<span data-nonledger="escala-de-instrumento">${v}</span>`)
    .replace(/\[\[lim:([^\]]*)\]\]/g, (_, v) => `<span data-nonledger="limiar-do-quadro">${v}</span>`)
    .replace(/\[\[num:([^\]]*)\]\]/g, (_, v) => `<span data-nonledger="numeracao">${v}</span>`)
    .replace(/\[\[ag:([^\]]*)\]\]/g, (_, v) => `<span class="mono" data-nonledger="data-da-agenda">${v}</span>`);
}

const PAGINAS = [
  { f: '01-primeira.html', titulo: 'O Estado do País · Direção A', aqui: '', en: '/en', compacto: false,
    folha: ['base', 'mosaico', 'instr', 'mapa', 'respostas'] },
  { f: '02-linha.html', titulo: '17,6 variação anual média, % · Livro-razão · Direção A', aqui: '/livro-razao', en: '/en/ledger/precos-da-habitacao-2025',
    folha: ['base', 'aparelho', 'linha', 'respostas'] },
  { f: '03-municipio.html', titulo: 'Évora · Municípios · Direção A', aqui: '/municipios', en: '/en/municipalities/evora',
    folha: ['base', 'mosaico', 'instr', 'aparelho', 'linha', 'municipio', 'metodo', 'respostas'] },
  { f: '04-metodo.html', titulo: 'Método · Direção A', aqui: '/metodo', en: '/en/method',
    folha: ['base', 'instr', 'metodo', 'regras', 'respostas'] },
  { f: '05-agenda.html', titulo: 'Agenda · Direção A', aqui: '/agenda', en: '/en/agenda',
    folha: ['base', 'metodo', 'agenda', 'respostas'] },
];

const pecas = {
  '{{MAPA_PONTOS}}': readFileSync(join(AQUI, 'partes', '_mapa-pontos.html'), 'utf8'),
  '{{REGUA}}': readFileSync(join(AQUI, 'partes', '_regua.html'), 'utf8'),
  '{{MECANISMO}}': readFileSync(join(AQUI, 'partes', '_mecanismo.html'), 'utf8'),
};

/* O separador de milhares do sítio é o espaço fino inquebrável (U+202F), e um
   valor citado tem de sair carácter a carácter como está no livro-razão. Os
   corpos escrevem-se com espaço normal e a montagem converte-os, poupando os
   atributos de geometria onde um espaço é sintaxe. */
function espacoFino(txt) {
  const guardados = [];
  const marcado = txt.replace(/\s(?:viewBox|d)="[^"]*"/g, (m) => {
    guardados.push(m);
    return `@@GEO${guardados.length - 1}@@`;
  });
  const convertido = marcado.replace(/(\d) (?=\d)/g, '$1\u202F');
  return convertido.replace(/@@GEO(\d+)@@/g, (_, k) => guardados[Number(k)]);
}

const montadas = {};
for (const p of PAGINAS) {
  let bruto = espacoFino(readFileSync(join(AQUI, 'partes', p.f), 'utf8'));
  for (const [chave, peca] of Object.entries(pecas)) bruto = bruto.replace(chave, peca);
  const corpo = abreviaturas(bruto)
    .replaceAll('{{S}}', S)
    .replace('{{CABECALHO}}', cabecalho(p))
    .replace('{{PORTA}}', porta())
    .replace('{{PORTA_APARELHO}}', porta('aparelho-bloco'))
    .replace('{{RODAPE}}', rodape(p.en));
  const html = pagina({ titulo: p.titulo, corpo, folha: folhaDe(p.folha) });
  writeFileSync(join(AQUI, p.f), html);
  montadas[p.f] = html;
}

/* ---------------------------------------------------------------- 06-móvel */
/* Duas molduras de 390px, lado a lado. As regras de meios de comunicação
   correm dentro de cada moldura porque cada uma é uma janela própria. */
const esc = (s) => s.replaceAll('&', '&amp;').replaceAll("'", '&#39;');
const moldura = (f, rotulo, nota) => `<figure class="tel">
<figcaption><span class="tel-k" data-design>390 px</span><span class="tel-t">${rotulo}</span><span class="tel-n">${nota}</span></figcaption>
<iframe title="${rotulo}" srcdoc='${esc(montadas[f])}'></iframe>
</figure>`;

const movel = `${MARCA}
<!DOCTYPE html><html lang="pt-PT"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Móvel · Direção A</title>
<style>${TOKENS_MIN}${apertar(`*,*::before,*::after{box-sizing:border-box}
body{margin:0;background:var(--paper-3);color:var(--ink);font-family:var(--f-sans);font-size:15px;line-height:1.6}
main{max-width:1180px;margin:0 auto;padding:36px 24px 64px}
h1{font-family:var(--f-serif);font-weight:400;font-size:32px;margin:0}
.sub{font-family:var(--f-mono);font-size:11.5px;letter-spacing:.06em;color:var(--muted);margin:8px 0 0}
.telas{display:flex;flex-wrap:wrap;gap:36px;margin-top:32px;align-items:flex-start}
.tel{margin:0;display:grid;gap:10px}
figcaption{display:grid;gap:2px;max-width:390px}
.tel-k{font-family:var(--f-mono);font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}
.tel-t{font-size:16.5px;font-weight:600}
.tel-n{font-size:13.5px;color:var(--muted);line-height:1.45}
iframe{width:390px;height:1400px;border:1px solid var(--rule-strong);background:var(--paper);display:block}
@media (max-width:900px){iframe{width:100%;max-width:390px}}
`)}</style>
</head><body><main>
<h1>Direção A · o telefone</h1>
<p class="sub">A página de uma linha e a primeira página, tal como rendem numa janela estreita. As duas molduras são as páginas montadas, sem alteração: o que muda é a largura da janela.</p>
<div class="telas">
${moldura('02-linha.html', 'A página de uma linha, o recibo', 'A prova sobe: o valor, a frase da fonte, o recorte e o campo devolvido antes de tudo o resto. A ficha de proveniência desce para debaixo do corpo, e a porta das correções fica no fim, sempre à vista.')}
${moldura('01-primeira.html', 'A primeira página', 'Os oito mosaicos passam a uma coluna: oito por um, sem célula vazia. A régua e o mapa rolam dentro da sua caixa; o resto da página não rola de lado.')}
</div>
</main></body></html>
`;
writeFileSync(join(AQUI, '06-mobile.html'), movel);
montadas['06-mobile.html'] = movel;

/* ------------------------------------------------------------------- board */
const legendas = [
  ['01-primeira.html', 'A primeira página', 'Painel, régua, mapa e colofão. A grelha fecha a aritmética: oito mosaicos em quatro colunas, nunca uma célula vazia. O selo compacto liberta a frase.'],
  ['02-linha.html', 'A página de uma linha, como recibo', 'Valor, a frase da fonte por palavras, o recorte da linha impressa, o campo devolvido, as verificações, o histórico. A ficha de proveniência é aparelho, e recua.'],
  ['03-municipio.html', 'Évora', 'Oito mosaicos, a leitura breve com os selos compactos, a distância desenhada, a linha do tempo de quem administrou, e o aparelho reduzido a uma coluna leve.'],
  ['04-metodo.html', 'Método', 'Dez regras. Cada uma acaba numa fita de prova: mono, tabular, sobre o chão do que foi medido. O mecanismo desenhado abre a página a toda a largura.'],
  ['05-agenda.html', 'Agenda', 'Quatro estados com a sua contagem, cada item com o seu critério e o seu histórico, e o calendário das fontes reordenado como aquilo que é: uma coluna de datas.'],
  ['06-mobile.html', 'O telefone', 'A página de uma linha e a primeira página a <span data-design>390 px</span>, nas mesmas regras de meios de comunicação que a folha traz.'],
];

const quadro = legendas
  .map(
    ([f, t, n], i) => `<section class="peca">
<h2><span class="peca-n" data-design>${String(i + 1).padStart(2, '0')}</span> ${t}</h2>
<p class="peca-n-txt">${n}</p>
<iframe title="${t}" srcdoc='${esc(montadas[f])}'></iframe>
</section>`
  )
  .join('\n');

const board = `${MARCA}
<!DOCTYPE html><html lang="pt-PT"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Direção A · Refinamento</title>
<style>${TOKENS_MIN}${apertar(`*,*::before,*::after{box-sizing:border-box}
body{margin:0;background:var(--paper-3);color:var(--ink);font-family:var(--f-sans);font-size:15px;line-height:1.6}

.capa{max-width:1400px;margin:0 auto;padding:56px 28px 40px}
.capa h1{font-family:var(--f-serif);font-weight:400;font-size:clamp(38px,5vw,60px);line-height:1.02;margin:0;letter-spacing:-.014em}
.capa .marca{font-family:var(--f-mono);font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);margin:0 0 14px}
.capa .frase{font-size:clamp(17px,1.7vw,20px);line-height:1.5;max-width:62ch;margin:20px 0 0}
.quatro{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;background:var(--rule-strong);border:1px solid var(--rule-strong);margin-top:36px}
.quatro > div{background:var(--paper);padding:20px}
.quatro h3{font-family:var(--f-mono);font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin:0 0 10px}
.quatro p{font-size:13.5px;line-height:1.5;margin:0 0 8px}
.quatro p:last-child{margin-bottom:0}
.quatro strong{font-weight:600}
.peca{max-width:1400px;margin:56px auto 0;padding:0 28px 0}
body{padding-bottom:80px}
.peca h2{font-size:20px;font-weight:600;margin:0;letter-spacing:-.01em}
.peca-n{font-family:var(--f-mono);font-size:15px;color:var(--muted);font-weight:600;letter-spacing:.06em}
.peca-n-txt{font-size:14px;color:var(--muted);line-height:1.5;max-width:80ch;margin:6px 0 14px}
iframe{width:100%;height:1180px;border:1px solid var(--rule-strong);background:var(--paper);display:block}
.peca:last-child iframe{height:1560px}
@media (max-width:1100px){.quatro{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:640px){.quatro{grid-template-columns:1fr}}
`)}</style>
</head><body>
<div class="capa">
<p class="marca">Direção A</p>
<h1>Refinamento</h1>
<p class="frase">A identidade que já existe, apertada. As mesmas três famílias de tipos, os mesmos treze valores de cor, as mesmas três disposições. O que muda é o ritmo, a hierarquia, a densidade e a disciplina da grelha, e o lugar de cada coisa. A pergunta a que esta direção responde: até onde chega esta identidade sem trocar nenhuma das suas peças.</p>
<div class="quatro">
<div><h3>O que é</h3><p>Uma revisão de disciplina. Nenhuma família de tipos nova, nenhum valor de cor novo, nenhuma quarta disposição. O que passa a existir é uma escala de corpos, um degrau de espaço, três pesos de fio e um nome para cada coluna.</p></div>
<div><h3>O que muda</h3><p><strong>O selo</strong> mostra a palavra que diz o que faz e guarda o título do estudo para o portão e para o leitor de ecrã.</p><p><strong>O aparelho</strong> recua por corpo e por cor, e deixa de partilhar o chão com a leitura.</p><p><strong>A linha</strong> passa a ser o recibo: prova primeiro, ficha depois.</p><p><strong>A grelha</strong> fecha a aritmética.</p></div>
<div><h3>O que custa</h3><p>Nenhum tipo da rede, nenhum byte novo de tipografia. Os nomes de classe são os do sítio, e por isso a passagem é uma troca de folha mais três componentes: o selo, o marcador e a página da linha.</p><p>O portão tem de aprender a ler a etiqueta do selo num filho nomeado, e não no texto inteiro do elemento.</p></div>
<div><h3>O que guarda de propósito</h3><p>A marca na serifada e só ali. O amarelo só como medição. O oxblood só como erro admitido. As três camadas no sítio. O selo ao lado de cada valor. Um só marcador de incerteza. A primeira página continua a abrir no painel, e não numa capa.</p></div>
</div>
</div>
${quadro}
</body></html>
`;
writeFileSync(join(AQUI, 'board.html'), board);

console.log('montado:', [...PAGINAS.map((p) => p.f), '06-mobile.html', 'board.html'].join(' · '));
