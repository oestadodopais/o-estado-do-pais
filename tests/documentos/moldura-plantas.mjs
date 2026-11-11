// As mesmas adulterações são verificadas antes e durante a medição no navegador.
export const ESTRAGOS = [
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
    nome: 'texto-da-celula · tirar a regra da cor do texto das células',
    celulas: ['C2'],
    faz: (html) =>
      html.replace(
        /\[data-oedp-moldura\] th,\[data-oedp-moldura\] td\{color:[^}]*\}/,
        '',
      ),
  },
  {
    nome: 'sem-guiao · tirar o guião da moldura',
    celulas: ['C1', 'C3'],
    faz: (html) => html.replace(/<script>\(function\(\)\{var R=[\s\S]*?\}\)\(\);<\/script>/, ''),
  },
];
