/**
 * O ÍNDICE DA BUSCA DO LIVRO-RAZÃO · as 2 916 linhas, num ficheiro
 * =============================================================================
 *
 * Segunda passagem do bloco F1.4 (04.09.2026), leitura a frio do Codex, Major 6,
 * com a decisão do bloco F1.10 («uma coisa, um lugar»): a busca do índice cobre
 * o livro-razão INTEIRO, e não as 149 linhas que a página lista.
 *
 * A primeira passagem filtrava só o que estava no documento, e dizia-o; o
 * leitor a frio mediu a distância entre o que o brief pede (2 916) e o que a
 * caixa alcança (149). As 2 767 linhas dos concelhos saíram da LISTA pela
 * decisão D6 de 26.08.2026, e continuam a sair: o que muda é que deixam de sair
 * da BUSCA. Uma coisa (procurar uma linha) num lugar (o índice do livro-razão).
 *
 * ---------------------------------------------------------------------------
 * O QUE O FICHEIRO GUARDA, E O QUE NÃO GUARDA
 * ---------------------------------------------------------------------------
 * Por linha: o identificador, o nome humano (a escada de `src/lib/nomes.mjs`), a
 * fonte e o concelho, quando ela é de um. **Nenhum valor**: um número do
 * livro-razão entra numa página por `<Claim/>`, com o seu selo, e um ficheiro
 * que a busca carrega não é uma página. Quem quer o número abre a linha, que é
 * o que o resultado da busca abre.
 *
 * OS TRÊS CAMPOS DE TEXTO SÃO DICIONARIZADOS, e a razão é o tamanho. Medido
 * sobre a construção de 04.09.2026: **75 nomes distintos** cobrem 2 583 das
 * 2 916 linhas (o mais repetido, «Evolução do endividamento total, por
 * município», é o nome de 614), **19 fontes** cobrem 2 587 (o INE é a de 1 238)
 * e **307 concelhos** cobrem 2 766. Guardar o texto por extenso em cada linha
 * multiplicava o ficheiro por mais de quatro. O dicionário é uma lista, e cada
 * linha guarda o índice dela; `-1` quer dizer «não tem».
 *
 * A NORMALIZAÇÃO VEM FEITA DA CONSTRUÇÃO, E VEM NO DICIONÁRIO. A regra da casa
 * é que o guião normaliza só o que o LEITOR escreve, e nunca o texto do sítio
 * (`public/js/municipios.js`): por isso cada dicionário tem um gémeo já em caixa
 * baixa e sem acentos (`nomesB`, `fontesB`, `concelhosB`). São 75, 19 e 307
 * entradas, e não 2 916. Medido sobre a construção de 04.09.2026: o ficheiro
 * servido pesa **150 070 bytes** em português e **149 824** em inglês; as mesmas
 * 2 916 linhas com os três textos e a cadeia de busca escritos linha a linha
 * pesam **966 546**, seis vezes e meia. O guião junta os pedaços que o
 * dicionário lhe dá e compara; não normaliza nada do sítio.
 *
 * O IDENTIFICADOR NÃO PRECISA DE GÉMEO: é minúsculas, algarismos e hífenes, já
 * normalizado por construção (o validador do livro-razão fecha a construção se
 * não for). O guião troca-lhe os hífenes por espaços para que «poder de compra»
 * o encontre, e trocar um hífen por um espaço não é normalizar um texto: é a
 * mesma cadeia com outro separador.
 *
 * ---------------------------------------------------------------------------
 * A EDIÇÃO É UM CAMPO DO FICHEIRO, DITO UMA VEZ
 * ---------------------------------------------------------------------------
 * Há um ficheiro por edição, porque o nome de 28 linhas muda com ela (o nome do
 * cartão) e porque a porta de cada linha muda de prefixo. A edição e esse
 * prefixo estão escritos no cabeçalho do ficheiro, uma vez, em vez de repetidos
 * 2 916 vezes: é o mesmo facto, e dizê-lo uma vez é o que o torna compacto.
 */

import { allClaims } from './ledger.mjs';
import { linhasDosConcelhos } from './livro-concelhos.mjs';
import { nomeDaMedida } from './nomes.mjs';
import { semAcentos } from './inicio.mjs';
import { routePath } from './routes.mjs';

/**
 * O prefixo da porta de uma linha, nesta edição.
 *
 * Sai da tabela de rotas com um slug de mentira e não de uma cadeia escrita à
 * mão: o dia em que `/livro-razao/` mudar de nome, isto muda com ele.
 *
 * @param {Lingua} lang
 */
function baseDasLinhas(lang) {
  const comSlug = routePath('linha', lang, { slug: 'x' });
  return comSlug.slice(0, comSlug.length - 'x'.length);
}

/**
 * O concelho de cada linha do estudo dos concelhos, pelo id.
 *
 * A junção é a de `linhasDosConcelhos()`, que é quem sabe que linhas são de que
 * concelho: não se adivinha o concelho do prefixo do identificador, que é uma
 * regra escrita em lado nenhum e que parte no dia em que dois concelhos tiverem
 * o mesmo começo de slug.
 *
 * @param {Lingua} lang
 * @returns {Map<string, string>}
 */
function concelhoPorLinha(lang) {
  /** @type {Map<string, string>} */
  const mapa = new Map();
  for (const grupo of linhasDosConcelhos().grupos) {
    /* O NOME DO GRUPO LÊ-SE COM GUARDA, e não com uma asserção de tipo: o
       `linhasDosConcelhos()` devolve o par de edições, e o que aqui se quer é
       uma cadeia. Se um dia o par mudar de forma, o concelho fica de fora do
       índice em vez de entrar como `undefined`. */
    const par = /** @type {Record<string, unknown>} */ (
      grupo.nome && typeof grupo.nome === 'object' ? grupo.nome : {}
    );
    const nome = typeof par[lang] === 'string' ? par[lang] : par.pt;
    if (typeof nome !== 'string') continue;
    for (const linha of grupo.linhas) {
      const id = /** @type {{ id?: unknown }} */ (linha).id;
      if (typeof id === 'string') mapa.set(id, nome);
    }
  }
  return mapa;
}

/**
 * Um dicionário que devolve o índice de cada texto, criando-o na primeira vez.
 *
 * @returns {{ lista: string[], indice: (texto: string|null) => number }}
 */
function dicionario() {
  /** @type {string[]} */
  const lista = [];
  /** @type {Map<string, number>} */
  const posicoes = new Map();
  return {
    lista,
    indice: (texto) => {
      if (typeof texto !== 'string' || texto === '') return -1;
      const ja = posicoes.get(texto);
      if (ja !== undefined) return ja;
      posicoes.set(texto, lista.length);
      lista.push(texto);
      return lista.length - 1;
    },
  };
}

/**
 * O índice da busca de uma edição.
 *
 * @param {Lingua} lang
 */
export function indiceDaBusca(lang) {
  const concelhos = concelhoPorLinha(lang);
  const nomes = dicionario();
  const fontes = dicionario();
  const lugares = dicionario();

  /** @type {(string|number)[][]} */
  const linhas = [];
  for (const c of allClaims()) {
    const nome = nomeDaMedida(c, lang)?.texto ?? null;
    const fonte = typeof c.source === 'string' ? c.source : null;
    const concelho = concelhos.get(c.id) ?? null;
    linhas.push([c.id, nomes.indice(nome), fontes.indice(fonte), lugares.indice(concelho)]);
  }

  /** O gémeo de um dicionário, já normalizado. @param {string[]} lista */
  const normalizado = (lista) => lista.map((x) => semAcentos(x).replace(/\s+/g, ' '));

  return {
    _: [
      'Índice da busca do livro-razão. FICHEIRO GERADO na construção a partir de ledger/claims/*.yml.',
      'Uma entrada por linha do livro-razão: [id, nome, fonte, concelho].',
      'Os três índices apontam para as listas «nomes», «fontes» e «concelhos»; -1 é «não tem».',
      'As listas «nomesB», «fontesB» e «concelhosB» são as mesmas em caixa baixa e sem acentos: é o sítio que normaliza o seu texto, não o guião.',
      'Nenhum valor do livro-razão entra aqui: um número entra numa página por <Claim/>, com o seu selo.',
    ],
    edicao: lang,
    base: baseDasLinhas(lang),
    campos: ['id', 'nome', 'fonte', 'concelho'],
    nomes: nomes.lista,
    nomesB: normalizado(nomes.lista),
    fontes: fontes.lista,
    fontesB: normalizado(fontes.lista),
    concelhos: lugares.lista,
    concelhosB: normalizado(lugares.lista),
    linhas,
  };
}

/**
 * O índice, em JSON, como o endereço o serve.
 *
 * Sem indentação: é um ficheiro que um navegador carrega, não um ficheiro que
 * alguém lê à mão (quem o quiser ler tem o `livro-razao.json`, que é o conjunto
 * inteiro e vai formatado).
 *
 * @param {Lingua} lang
 */
export function jsonDoIndiceDaBusca(lang) {
  return JSON.stringify(indiceDaBusca(lang));
}
