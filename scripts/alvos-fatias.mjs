// VEL1: partição por família e edição; a união conserva as exigências de existência.
import assert from 'node:assert/strict';
export const EDICOES = ['pt', 'en'];
export const LARGURAS = [390, 641, 768, 1023, 1280];
export const FAMILIAS = [
  ['home', null],
  ['temas', null],
  /* AS PÁGINAS DAS ENTRADAS (bloco PP1, 28.09.2026) são uma família nova, com a mesma vista para as
     cinco; mede-se a que tem mais cartões e mais secções, «O meu dinheiro», nas duas edições. */
  ['entradaDinheiro', null],
  ['lugares', null],
  ['municipio', { slug: 'evora' }],
  /* O ÍNDICE DOS DISTRITOS SAIU DA LISTA COM A PÁGINA (B1, peça 2, 21.09.2026):
     passou a redirecionamento para a página dos lugares, que já está aqui em
     cima. A página de uma unidade fica, e é a linha a seguir. */
  ['distrito', { slug: 'evora' }],
  ['regioes', null],
  ['regiao', { slug: 'alentejo' }],
  ['areas', null],
  ['area', { slug: 'administracao-interna' }],
  ['entradaDinheiro', null],
  ['entradaSalarios', null],
  ['entradaPobreza', null],
  ['entradaTrabalho', null],
  ['entradaCasa', null],
  ['entradaEscolaESaude', null],
  ['entradaEstado', null],
  ['livro', null],
  ['livroConcelhos', null],
  ['livroConcelho', { slug: 'evora' }],
  ['linha', { slug: 'evora-populacao-2025' }],
  ['estudos', null],
  ['estudo', { slug: 'evora-2027-capital-europeia-da-cultura' }],
  /* B1: a amostra de texto longo abre o corpo na rota do estudo. O nome
     «texto» identifica esta medição e conserva as conferências da leitura;
     a terceira coluna diz a rota real, sem pedir um HTML de redirecionamento. */
  ['texto', { slug: 'evora-contas-da-camara-2010-2025' }, 'estudo'],
  // EVB: texto julgado, títulos e quadros nas duas línguas.
  ['textoEvb', { slug: 'evora-2027-capital-europeia-da-cultura' }, 'estudo'],
  ['agenda', null],
  ['metodo', null],
  ['sobre', null],
  ['correcoes', null],
  ['marcador', null],
  /* A CAIXA DAS SUGESTÕES (bloco S1, 02.10.2026): o formulário e uma das quatro páginas do resultado,
     que partilham a mesma vista; a do obrigado é a que um leitor vê quando tudo correu bem. */
  ['sugestoes', null],
  ['sugestoesObrigado', null],
  /* A PÁGINA «PRIVACIDADE» (bloco H3, 05.10.2026): uma página de serviço nova, com o texto e uma porta de correio; o axe
     a zero e os alvos nas larguras desta régua, como as outras. */
  ['privacidade', null],
  /* O ÍNDICE (bloco R3, 04.10.2026, o brief R3, §3, ponto 4): as portas das listas e o resumo de cada gaveta dos
     concelhos com o alvo de 44 px, e o axe a zero, nas larguras desta régua. */
  ['indice', null],
  /* AS EXPLICAÇÕES E A LEITURA DA SEMANA (bloco EX1, 05.10.2026): a lista, a página da semana (as portas das mudanças, o
     selo de cada uma) e a primeira explicação (os selos do texto, as figuras das barras e a lista dobrada dos números de
     cada figura), com o axe a zero e os alvos nas larguras desta régua, como as outras páginas do leitor. */
  ['discussao', null],
  ['dossies', null],
  ['dossie', { slug: 'orcamento-2027' }],
  ['explicacoes', null],
  ['leituraDaSemana', null],
  ['explicacao', { slug: 'dinheiro-do-estado-2026' }],
];

export function fatiaDaFamilia(familia, lang) {
  const chaves = [...new Set(FAMILIAS.flatMap(([f]) => EDICOES.map(l => `${f}/${l}`)))];
  const i = chaves.indexOf(`${familia}/${lang}`);
  assert(i >= 0, 'família ou edição desconhecida');
  return i % 3;
}
export function medidasEsperadas(fatia = null) {
  return FAMILIAS.flatMap(([f]) => EDICOES.flatMap(l =>
    fatia === null || fatiaDaFamilia(f, l) === fatia ? LARGURAS.map(w => `${f}/${l}@${w}`) : []));
}
export const PRESENCAS = ['fichas','buraco','i105','manchetes','unidadesEn','indice','botoes','armadilhas','metodo','portas390','portasLargas'];
export function conferirFatia(p, execucao) {
  assert(p && Number.isInteger(p.fatia) && p.fatia >= 0 && p.fatia < 3, 'fatia inválida');
  assert.equal(p.execucao, execucao, 'fatia de outra execução');
  assert(p.ok, 'fatia vermelha');
  assert.deepEqual([...p.medidas].sort(), medidasEsperadas(p.fatia).sort(), 'fatia omitiu ou repetiu uma família ou largura');
  assert.deepEqual(Object.keys(p.presencas).sort(), [...PRESENCAS].sort(), 'presenças incompletas');
  assert(Object.values(p.presencas).every(n => Number.isSafeInteger(n) && n >= 0), 'contagem de presença inválida');
}
export function juntarAlvos(provas, execucao) {
  assert.equal(provas.length, 3, 'faltam fatias dos alvos');
  assert.deepEqual(provas.map(p => p.fatia).sort(), [0, 1, 2], 'fatia repetida');
  for (const p of provas) conferirFatia(p, execucao);
  assert.deepEqual(provas.flatMap(p => p.medidas).sort(), medidasEsperadas().sort(), 'união diferente da régua inteira');
  const presencas = Object.fromEntries(PRESENCAS.map(k => [k, provas.reduce((n, p) => n + p.presencas[k], 0)]));
  for (const [k, n] of Object.entries(presencas)) assert(n > 0, `alvos: ausência de ${k}`);
  return {ok:true, medidas:provas.reduce((n,p)=>n+p.medidas.length,0), presencas};
}
