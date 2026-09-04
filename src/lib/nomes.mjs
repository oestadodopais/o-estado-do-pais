/**
 * O NOME HUMANO DE UMA MEDIDA · a escada, escrita uma vez (bloco F1.4, 04.09.2026).
 *
 * ---------------------------------------------------------------------------
 * O QUE ISTO CORRIGE
 * ---------------------------------------------------------------------------
 * A auditoria de 02.09.2026 mediu o sítio a chamar às medidas o nome da máquina:
 * «6,4 ■ FONTE / crescimento-da-despesa-liquida-2025 / %», em 129 das 149 linhas
 * do índice do livro-razão e em 113 das 131 medidas das páginas de área. O
 * identificador é o nome do ficheiro daquela linha, e um leitor não o lê.
 *
 * O identificador NÃO SAI DA PÁGINA: desce a metadado, ao pé da unidade, onde
 * continua a ser a coisa que se copia para procurar a linha. O que muda é quem
 * encabeça a linha.
 *
 * ---------------------------------------------------------------------------
 * A ESCADA, POR ORDEM, E O QUE CADA DEGRAU É
 * ---------------------------------------------------------------------------
 *   1 · `src/data/figuras.mjs`, o nome do cartão da primeira página. É prosa
 *       declarada da casa, e por isso o elemento leva `data-nome="figuras"`: a
 *       régua da voz vai ao ficheiro e confere, carácter a carácter, que o texto
 *       rendido é um nome que ele publica.
 *   2 · `src/data/dominios.mjs`, o nome da medida de um domínio, pela mesma
 *       marca (`data-nome="medidas"`) e pela mesma conferência. Só a linha
 *       PRINCIPAL de cada medida (`claim`): as linhas irmãs de `claims[]` medem
 *       outra coisa da mesma pergunta (T5 publica o diploma continental e a série
 *       do Eurostat em doze meses) e dar-lhes o nome da medida seria chamar às
 *       duas o mesmo.
 *   3 · `name`, o rótulo que a PRÓPRIA FONTE imprime por cima da figura,
 *       copiado carácter a carácter do ficheiro alojado, com o localizador de
 *       onde nele foi lido (`name_source`). É um campo do livro-razão: rende-se
 *       por `CampoDaLinha`, com a marca `data-linha-campo="name"`, e o portão
 *       confere-o contra a linha.
 *   4 · `document.title`, o título do documento de onde a linha foi lida. É o
 *       degrau que o brief F1.4 §1 nomeia para onde não há nome de cartão, e é
 *       também um campo do livro-razão, com a mesma marca e a mesma conferência.
 *
 * NENHUMA LIMPEZA SE APLICA AO TEXTO DE UM CAMPO, e não é um esquecimento. O
 * brief pedia o título «limpo da gralha da fonte»; procurou-se a gralha nos 19
 * valores distintos de `name` do livro-razão e nos 31 títulos de documento que
 * este degrau usa no índice, e não há nenhuma (o relatório do bloco escreve a
 * lista). E se
 * houvesse, não se corrigia aqui: um campo transcrito rende-se como a fonte o
 * escreveu, o portão compara-o carácter a carácter, e editar a transcrição para
 * a embelezar era o contrário da regra da casa.
 *
 * O QUE ESTA ESCADA NÃO FAZ: inventar. Onde nenhum dos quatro degraus dá texto,
 * devolve `null`, e são 26 das 149 linhas do índice: 22 DERIVADAS, sem fonte e
 * sem documento porque a proveniência delas é a das origens, e 4 cujo único
 * título de documento é o próprio marcador (`avisos-pt2030-abertos`,
 * `avisos-pt2030-pessoas-singulares`, `ciclo-substituicao-condutas`,
 * `saldo-natural-portugal-2025`). Uma linha derivada leva o identificador no seu
 * metadado e a aritmética explicada na sua página; compor-lhe um nome do que ela
 * parece medir era escrever conteúdo que ninguém publicou.
 *
 * NENHUM ALGARISMO NOVO: este ficheiro não compõe números. Devolve texto que já
 * existe noutro ficheiro, e diz de qual.
 */

import { FIGURAS } from '../data/figuras.mjs';
import { MEDIDAS_DO_DOMINIO_1 } from '../data/dominios.mjs';
import { POR_VERIFICAR, documentoDaLinha } from './ledger.mjs';

/**
 * O nome de uma medida, com a origem dele.
 *
 * `fonte` é o ficheiro de dados que sustenta um `data-nome`, e `campo` é o campo
 * do livro-razão que sustenta um `data-linha-campo`. Exactamente um dos dois é
 * não nulo: um nome ou é prosa declarada da casa, ou é a transcrição de um campo.
 *
 * @typedef {{ texto: string, fonte: 'figuras'|'medidas'|null, campo: 'name'|'document.title'|null }} NomeDaMedida
 */

/**
 * Os nomes de cartão, por linha. Primeiro a ganhar fica: as duas listas
 * coincidem em quatro linhas (a dívida pública, a taxa de emprego, a taxa de
 * desemprego e o saldo), e nessas o nome é o mesmo texto nas duas.
 *
 * @type {Map<string, { nome: ParDeLinguas, fonte: 'figuras'|'medidas' }>}
 */
const CARTOES = new Map();
for (const f of FIGURAS) {
  if (typeof f.claim === 'string' && !CARTOES.has(f.claim)) {
    CARTOES.set(f.claim, { nome: f.nome, fonte: 'figuras' });
  }
}
for (const m of MEDIDAS_DO_DOMINIO_1) {
  if (typeof m.claim === 'string' && !CARTOES.has(m.claim)) {
    CARTOES.set(m.claim, { nome: m.nome, fonte: 'medidas' });
  }
}

/**
 * Um texto que é o marcador de incerteza não é um nome.
 *
 * Quatro linhas têm `document.title: "[a verificar]"`, que é o marcador da casa
 * a dizer que o campo falta. Promovê-lo a nome da medida seria pôr o marcador
 * onde o leitor espera o nome da coisa, e o marcador tem uma página e um sítio.
 *
 * @param {unknown} v
 * @returns {v is string}
 */
function eTextoUtil(v) {
  return typeof v === 'string' && v.trim() !== '' && v !== POR_VERIFICAR;
}

/**
 * O nome com que uma medida se apresenta ao leitor, ou `null`.
 *
 * @param {Linha} claim
 * @param {Lingua} lang
 * @returns {NomeDaMedida|null}
 */
export function nomeDaMedida(claim, lang) {
  const cartao = CARTOES.get(claim.id);
  if (cartao) {
    const texto = cartao.nome[lang] ?? cartao.nome.pt;
    if (eTextoUtil(texto)) return { texto, fonte: cartao.fonte, campo: null };
  }
  if (eTextoUtil(claim.name)) return { texto: claim.name, fonte: null, campo: 'name' };
  const titulo = documentoDaLinha(claim)?.title;
  if (eTextoUtil(titulo)) return { texto: titulo, fonte: null, campo: 'document.title' };
  return null;
}

/**
 * A guarda da forma, provada em `scripts/provar-guardas.mjs`.
 *
 * Existe pela mesma razão que as outras deste sítio: quem consome um
 * `NomeDaMedida` decide markup com ele (uma marca de nome declarado ou uma marca
 * de campo do livro-razão), e um objeto meio construído escolheria a marca
 * errada em silêncio.
 *
 * @param {unknown} x
 * @returns {x is NomeDaMedida}
 */
export function eNomeDeMedida(x) {
  if (typeof x !== 'object' || x === null || Array.isArray(x)) return false;
  const o = /** @type {Record<string, unknown>} */ (x);
  if (typeof o.texto !== 'string' || o.texto === '') return false;
  const fonteOk = o.fonte === null || o.fonte === 'figuras' || o.fonte === 'medidas';
  const campoOk = o.campo === null || o.campo === 'name' || o.campo === 'document.title';
  if (!fonteOk || !campoOk) return false;
  /* Um e só um dos dois: a marca do markup sai daqui. */
  return (o.fonte === null) !== (o.campo === null);
}

/**
 * QUEM CONFERE A MARCA `data-nome` NÃO CHAMA ESTE FICHEIRO, e é de propósito.
 * `scripts/medir-defeitos.mjs` lê `FIGURAS` e `MEDIDAS_DO_DOMINIO_1` por conta
 * própria, como já lia as áreas, as regiões e os domínios: um portão que fosse
 * buscar a lista à mesma função que a escreve confirmava a função e não o
 * ficheiro de dados.
 */
