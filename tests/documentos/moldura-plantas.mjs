// As mesmas adulterações são verificadas antes e durante a medição no navegador.
// Caso fixo: a obra deixa texto branco sobre branco. A regra da moldura tem
// de lhe repor a tinta; removê-la volta a esconder o texto da célula.
export const amostraTextoDaCelula = html => `<!doctype html><html lang="pt"><head>
<meta charset="utf-8"><title>Planta fixa da cor da célula</title>
<style>td{color:#fff;background:#fff}</style>
${(html.match(/<style\b[^>]*>[\s\S]*?<\/style>/g) ?? []).join('')}
</head><body><main data-oedp-moldura><h1>Planta fixa</h1>
<table><caption>Texto da célula</caption><tbody><tr><td>Texto de ensaio</td></tr></tbody></table>
</main></body></html>`;
export const textoDasCelulasPassa = celulas => celulas.length > 0 && celulas.every(([razao])=>razao >= 4.5);
export const ESTRAGOS = [
  {
    nome: 'texto-da-celula-sem-regra · tirar a regra da cor do texto das células',
    celulas: ['C2'],
    amostra: amostraTextoDaCelula,
    faz: html => html.replace(/\[data-oedp-moldura\] th,\[data-oedp-moldura\] td\{color:[^}]*\}/, ''),
  },
  {
    nome: 'moldura-fora · tirar a abertura da moldura',
    celulas: ['C4', 'C5'],
    faz: (html) => html.replace('<main data-oedp-moldura>', '').replace('<div data-oedp-moldura>', ''),
  },
  {
    nome: 'filete-turquesa · o filete da grelha volta à cor de fora da paleta',
    celulas: ['C2', 'C5'],
    faz: (html) => html.replace(/--oedp-g2:#[0-9a-f]{6}/g, '--oedp-g2:#16556E'),
  },
  {
    nome: 'texto-da-celula · tornar transparente o texto das células',
    celulas: ['C2'],
    faz: (html) =>
      html.replace(
        /\[data-oedp-moldura\] th,\[data-oedp-moldura\] td\{color:[^}]*\}/,
        '[data-oedp-moldura] th,[data-oedp-moldura] td{color:rgba(0,0,0,0)!important}',
      ),
  },
  {
    nome: 'sem-guiao · tirar o guião da moldura',
    celulas: ['C1', 'C3'],
    faz: (html) => html.replace(/<script>\(function\(\)\{var R=[\s\S]*?\}\)\(\);<\/script>/, ''),
  },
];
