/**
 * O livro-razão.
 *
 * Carrega ledger/claims/*.yml, valida cada linha e serve as afirmações às
 * páginas. É o único sítio de onde um número pode entrar numa página.
 *
 * Regras que este módulo faz cumprir:
 *   1. o nome do ficheiro é o id;
 *   2. nenhum campo obrigatório em falta;
 *   3. uma linha derivada declara de onde deriva e explica a aritmética;
 *   4. uma expressão `check:` é reavaliada no build e tem de dar o valor publicado.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';

import { STUDY_IDS, COUNTS } from '../data/studies.mjs';
import { KINDS, CAMPOS_DE_PROVENIENCIA } from '../data/correcoes.mjs';

/**
 * Onde está o livro-razão.
 *
 * Não pode ser um caminho relativo a este ficheiro: no build, este módulo é
 * empacotado para dist/.prerender/chunks/ e o caminho relativo passaria a
 * apontar para dentro de dist/. Procura-se a subir, primeiro a partir do
 * directório de trabalho e depois a partir do próprio ficheiro.
 */
function encontraLivroRazao() {
  const candidatos = [];
  if (process.env.OEDP_LEDGER_DIR) candidatos.push(process.env.OEDP_LEDGER_DIR);

  const subir = (inicio) => {
    let dir = inicio;
    for (let i = 0; i < 8; i++) {
      candidatos.push(path.join(dir, 'ledger', 'claims'));
      const acima = path.dirname(dir);
      if (acima === dir) break;
      dir = acima;
    }
  };

  subir(process.cwd());
  subir(path.dirname(fileURLToPath(import.meta.url)));

  for (const c of candidatos) {
    try {
      if (fs.statSync(c).isDirectory()) return c;
    } catch {
      /* segue */
    }
  }
  throw new Error(
    'livro-razão: não encontrei ledger/claims a partir de ' +
      process.cwd() +
      '. Corra os comandos a partir da raiz do projecto, ou defina OEDP_LEDGER_DIR.',
  );
}

export const LEDGER_DIR = encontraLivroRazao();

/**
 * O marcador de campo por verificar. É aceite; inventar um valor não é.
 * Uma definição só, em `src/data/marcador.mjs`, reexportada aqui para os
 * sítios que já a pediam a este módulo (DECISIONS §1.40).
 */
export { POR_VERIFICAR } from '../data/marcador.mjs';
import { POR_VERIFICAR } from '../data/marcador.mjs';

/** Uma bandeira da fonte é um caractere qualquer; não pode virar sintaxe. */
function escapaRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const CAMPOS = [
  'id',
  'value',
  'unit',
  'source',
  'document',
  'source_url',
  'access_date',
  'reference_date',
  'excerpt',
  'source_flag',
  'source_flag_note',
  'source_flag_note_en',
  'derivation',
  'derivation_en',
  'derived_from',
  'check',
  'attributed_to',
  'study',
  'note',
  'corrections',
  'verifications',
];

/**
 * As chaves que o bloco `document` aceita, e mais nenhuma.
 *
 * Fechada pela mesma razão que a lista de cima: uma chave mal escrita
 * («localizador» em vez de `locator`, `page` em vez de `locator`) passaria
 * despercebida, e a página da linha não mostraria nada — um campo em falta com
 * cara de campo preenchido. Antes de `locator` existir, este bloco não tinha
 * lista nenhuma: `title` e `edition` eram exigidos e o resto era ignorado.
 */
const CAMPOS_DO_DOCUMENTO = [
  'title',
  'edition',
  'locator',
  'page',
  'kind',
  'url',
  'crop',
  'hosted',
  'computed_over',
];

/**
 * As chaves do recorte, e mais nenhuma. Um mapa de três campos: o ficheiro, o
 * resumo dos seus bytes e a página de onde foi tirado.
 */
const CAMPOS_DO_RECORTE = ['asset', 'sha256', 'page'];

/** 64 hexadecimais em minúsculas: um resumo sha256 e não um prefixo dele. */
const RESUMO_SHA256 = /^[0-9a-f]{64}$/;

/**
 * O teto de um recorte, em bytes.
 *
 * **Cópia própria** do `MAX_IMAGE_BYTES` de `core/pdfproof.py`, que é quem o
 * impõe ao produzir. Existe aqui pela mesma razão que o portão tem a sua cópia
 * das regras que confere: um recorte que chegue acima do teto veio de outro
 * sítio que não uma corrida do pdfproof, e o sítio recusa-o na porta em vez de
 * confiar em quem lho entregou. Um recorte é uma linha impressa, não uma
 * página digitalizada.
 */
const MAX_BYTES_DO_RECORTE = 40_000;

/** Onde vivem os recortes: `public/recortes/`, servidos em `/recortes/`. */
const DIR_RECORTES = path.join(path.dirname(path.dirname(LEDGER_DIR)), 'public', 'recortes');

/**
 * ---------------------------------------------------------------------------
 * `document.hosted`: o ficheiro de dados que este sítio aloja, e de que a linha
 * é contada
 * ---------------------------------------------------------------------------
 *
 * A quarta resposta ao limite 13 (DECISIONS §2.3). Uma linha cujo valor é uma
 * contagem ou uma soma sobre um registo público não tem frase para transcrever:
 * o `excerpt` ficava `[a verificar]`, honesto e incompleto. Fecha-se alojando
 * **aqui** o ficheiro de que a conta é feita, com o resumo dos seus bytes e com
 * o resumo do ficheiro da fonte de onde ele foi extraído, de modo que quem
 * descarregar o original possa provar que o extrato é dele.
 *
 * A licença é lida na página da fonte ANTES de se alojar o que quer que seja, e
 * por quem não escreve o bloco (BRIEF-bloco-T.md §2.4). O campo publica-a, com
 * o endereço da licença e a atribuição na forma que a fonte pede. Um ficheiro
 * alojado sem licença dita é uma reutilização que este sítio não pode defender.
 */
const CAMPOS_DO_ALOJADO = [
  'asset',
  'sha256',
  'bytes',
  'licence',
  'licence_url',
  'attribution',
  'extracted_from',
];

/** As chaves de cada origem de um ficheiro alojado, e mais nenhuma. */
const CAMPOS_DA_EXTRACAO = ['file', 'url', 'sha256', 'bytes'];

/**
 * ---------------------------------------------------------------------------
 * `document.computed_over`: os ficheiros sobre que a conta foi feita, e que
 * este sítio NÃO aloja
 * ---------------------------------------------------------------------------
 *
 * O gémeo honesto do `document.hosted`. Onde a licença da fonte permite alojar,
 * aloja-se e o marcador sai; onde não permite, ou não está verificada, não se
 * aloja nada e a linha diz, pelo menos, sobre que ficheiros foi calculada: o
 * nome que o publicador lhes dá, a data do instantâneo, o resumo de cada um, a
 * coluna somada e o filtro aplicado.
 *
 * **É registo, não prova.** O leitor não pode refazer a conta a partir deste
 * sítio, e por isso o `excerpt` continua `[a verificar]` e a linha continua a
 * contar para a dívida de proveniência. O que muda é que deixa de ser uma soma
 * sobre «um ficheiro» e passa a ser uma soma sobre ficheiros identificados pelo
 * resumo dos seus bytes: quem tiver o instantâneo pode refazê-la.
 *
 * O caso é o PRR: o conjunto em dados.gov.pt declara «Licença não especificada»
 * ao lado de um termo da plataforma que diz que os organismos do Estado
 * publicam sob CC BY 4.0 «exceto se houver uma especificação em contrário».
 * Isso é uma questão jurídica, é da direção, e até ela ser respondida não se
 * redistribui nada (BRIEF-bloco-T.md §2.4).
 */
const CAMPOS_DO_CALCULO = ['files', 'column', 'filter'];

/** As chaves de cada ficheiro sobre que a conta foi feita, e mais nenhuma. */
const CAMPOS_DO_FICHEIRO_CALCULADO = ['file', 'snapshot_date', 'sha256', 'bytes'];

/** Onde vivem os ficheiros de dados alojados: `public/dados/`, servidos em `/dados/`. */
const DIR_DADOS = path.join(path.dirname(path.dirname(LEDGER_DIR)), 'public', 'dados');

/**
 * O ficheiro alojado está completo: existe, os bytes batem, e a licença, o seu
 * endereço e a atribuição estão escritos.
 *
 * É a condição da **porta estreita** do `excerpt: null`; ver `eContadaSobreFicheiro`.
 * Não confere o resumo (isso é trabalho do validador, que lê o disco): confere
 * que a linha declarou tudo o que a porta exige que ela declare.
 */
export function alojamentoCompleto(claim) {
  const h = claim?.document?.hosted;
  if (!h || typeof h !== 'object' || Array.isArray(h)) return false;
  for (const k of ['asset', 'sha256', 'licence', 'licence_url', 'attribution']) {
    if (typeof h[k] !== 'string' || h[k].trim() === '') return false;
  }
  if (!Number.isInteger(h.bytes) || h.bytes < 1) return false;
  if (!Array.isArray(h.extracted_from) || h.extracted_from.length === 0) return false;
  return h.extracted_from.every(
    (e) =>
      e &&
      typeof e === 'object' &&
      !Array.isArray(e) &&
      CAMPOS_DA_EXTRACAO.every((k) => e[k] !== null && e[k] !== undefined && e[k] !== ''),
  );
}

/**
 * Uma linha contada sobre um ficheiro alojado por este sítio.
 *
 * A porta estreita do `excerpt: null`, na forma que o BRIEF do bloco T fixou
 * (§2.4) e que a §1.47 regista: **as três coisas, ou nenhuma**. O ficheiro
 * alojado completo, a aritmética escrita nas duas línguas (que coluna, que
 * filtro, o que se contou), e, fora daqui, porque é depois da construção, a
 * reconta mecânica de `scripts/check-dados.mjs` sobre o próprio ficheiro.
 *
 * Sem as três, `[a verificar]` fica. É a mesma disciplina da linha da casa: uma
 * porta larga aqui seria uma maneira de branquear proveniência em falta, que é
 * exactamente o que o marcador existe para impedir.
 */
export function eContadaSobreFicheiro(claim) {
  return (
    claim?.document?.kind === 'ficheiro' &&
    alojamentoCompleto(claim) &&
    !ausente(claim?.derivation) &&
    !ausente(claim?.derivation_en)
  );
}

/**
 * `p. N` dentro de um localizador. A cópia da regra vive aqui, e é a única do
 * lado do sítio: o exportador do motor tem a sua, pela mesma razão pela qual o
 * portão tem a dele.
 */
const PAGINA_NO_LOCALIZADOR = /\bp\.\s?(\d+)\b/;

/** `…#page=N` no fim de um endereço. */
const PAGINA_NO_ENDERECO = /#page=(\d+)$/;

/**
 * O que a fonte É, do ponto de vista de quem a vai abrir.
 *
 * Opcional. Sem ele, a página da linha usa os rótulos genéricos — que é o
 * estado de qualquer linha que ninguém classificou, e não uma omissão a
 * esconder. Existe porque chamar «Documento» a um pedido que devolve uma
 * resposta, e «Excerto» ao campo que ela traz, diz ao leitor que há uma frase
 * impressa algures — e não há.
 *
 * Até 15.08.2026 isto era adivinhado pela forma do endereço, e a adivinha
 * errava: `dados.gov.pt/api/1/datasets/r/…` tem `/api/` no caminho e serve uma
 * folha de cálculo. Um campo lido é melhor do que um padrão que quase sempre
 * acerta.
 */
export const TIPOS_DE_DOCUMENTO = ['pdf', 'html', 'serie', 'ficheiro', 'registo'];

/** Campos de proveniência que só podem ser null numa linha derivada. */
const CAMPOS_PROVENIENCIA = ['source', 'document', 'source_url', 'access_date', 'excerpt'];

/**
 * O separador com que a lista `attributed_to` é escrita numa linha só.
 *
 * A escolha é de rendição, não de conteúdo, e é deliberadamente **uma**: o
 * portão compara o texto renderizado carácter a carácter, e uma lista só pode
 * ser comparada se houver uma maneira única de a escrever. O ponto médio com
 * espaços de cada lado é o que o sítio já usa entre partes de uma mesma linha
 * (o rodapé, a ficha do arquivo), não introduz pontuação nova e não colide com
 * vírgulas dentro de um nome de entidade — «Câmara Municipal de Évora, Divisão
 * de Águas» continua a ser uma entidade, não duas.
 *
 * O portão tem a sua própria cópia desta constante, de propósito. Ver
 * scripts/gate-html.mjs: se as duas divergirem, o build pára — que é o que se
 * quer. Se o portão lesse esta, confirmaria a constante e não o livro-razão.
 */
export const SEPARADOR_ATRIBUICAO = ' · ';

/**
 * A quem o valor é creditado, escrito numa linha só — ou null quando a linha
 * não credita ninguém.
 *
 * O campo é opcional: a maioria das afirmações é uma medição de um organismo
 * de estatística e não é «de» ninguém. Existe para as afirmações em que o
 * crédito faz parte do facto — uma promessa de um executivo, uma verba pedida
 * por uma entidade — e é aí que a atribuição, incluindo um rótulo partidário
 * quando o há, é **registo do que consta**, não juízo nem ordenação. O sítio
 * não faz tabelas classificativas por partido; ver IDENTIDADE.md e a decisão
 * de direcção de 2026-08-15.
 */
export function atribuicaoDaLinha(claim) {
  const lista = claim?.attributed_to;
  if (!Array.isArray(lista) || lista.length === 0) return null;
  return lista.join(SEPARADOR_ATRIBUICAO);
}

/** Uma linha é derivada quando declara de que linhas deriva. */
export function eDerivada(claim) {
  return Array.isArray(claim?.derived_from) && claim.derived_from.length > 0;
}

/** O nome da casa, tal como aparece no campo `source`. */
export const CASA = 'O Estado do País';

/**
 * Uma linha cuja origem é o próprio registo da casa — a contagem das correções
 * publicadas, dos estudos no arquivo, dos municípios com estudo aprofundado.
 *
 * Acrescentado a 2026-08-13. Estas linhas traziam `source_url` e `excerpt` a
 * "[a verificar]" e iam continuar a trazer para sempre: não há documento
 * externo que publique quantas correções esta casa admitiu. O marcador dizia
 * «por confirmar» sobre um campo que não pode ser confirmado, o que inflava a
 * dívida — cinco das vinte e uma linhas eram impossíveis, e uma lista com
 * impossíveis lá dentro é uma lista que se deixa de ler — e mantinha as cinco
 * páginas fora do índice (`noindex`) por uma incompletude que não existia.
 *
 * A correcção NÃO é um segundo marcador. O Método promete ao leitor que
 * `[a verificar]` é o único marcador de incerteza do sítio, e essa promessa
 * fica de pé. É a regra que já existia para as linhas derivadas — `null` não é
 * buraco quando a proveniência está noutro lado — estendida ao caso em que
 * esse outro lado é o próprio livro-razão.
 *
 * A porta é estreita de propósito: exige o nome da casa em `source` E uma
 * `derivation` que explique a contagem. Sem as duas, `null` continua a ser um
 * erro — caso contrário isto seria uma maneira de branquear proveniência em
 * falta, que é exactamente o que o marcador existe para impedir.
 */
export function eDaCasa(claim) {
  return (
    claim?.source === CASA &&
    !ausente(claim?.derivation) &&
    !eDerivada(claim)
  );
}

/**
 * Os campos de proveniência que estão por verificar, pelos nomes do formato.
 *
 * Esta é a ÚNICA definição de «proveniência incompleta»: a etiqueta, a página
 * da linha, o índice do livro-razão, o portão, o sitemap e o relatório do
 * `ledger:check` leem-na daqui. Havia duas — uma dentro do componente da
 * etiqueta e outra dentro do script — e discordavam numa linha.
 *
 * A distinção que importa, e que a versão do componente não fazia:
 *
 *   `null` numa linha derivada  — NÃO é buraco. A proveniência é a das linhas
 *                                 de origem (§1.3), e repeti-la seria convidar
 *                                 as duas a divergir.
 *   `[a verificar]`             — é buraco, esteja onde estiver. Uma linha que
 *                                 declara um campo por confirmar declarou-o.
 *
 * `municipios-portugal-caop-2025` é o caso que separava as duas: deriva de três
 * contagens **e** traz fonte própria, com o excerto por confirmar. Mostrava
 * selo cheio na página e aparecia na dívida do relatório.
 */
export function camposPorVerificar(claim) {
  if (!claim) return [];
  const out = [];
  for (const campo of ['source', 'source_url', 'access_date', 'reference_date', 'excerpt']) {
    if (claim[campo] === POR_VERIFICAR) out.push(campo);
  }
  if (claim.document && typeof claim.document === 'object') {
    if (claim.document.title === POR_VERIFICAR) out.push('document.title');
    if (claim.document.edition === POR_VERIFICAR) out.push('document.edition');
    /* `locator` é opcional: ausente não é buraco — a maior parte das fontes é
       uma página só, e não há onde apontar. Mas escrito como "[a verificar]" é
       buraco, como qualquer outro campo: a linha declarou que o excerto está
       nalgum sítio daquele documento e que ainda não sabe onde. */
    if (claim.document.locator === POR_VERIFICAR) out.push('document.locator');
  }
  return out;
}

/** true quando falta confirmar pelo menos um campo de proveniência. */
export function provenienciaIncompleta(claim) {
  return camposPorVerificar(claim).length > 0;
}

/**
 * A aritmética de uma linha derivada, na língua de uma edição.
 *
 * Mesma regra do motivo de uma correção (§1.17): a explicação da conta é prosa
 * da casa, existe nas duas línguas — `derivation` em português, `derivation_en`
 * em inglês — e **não há recurso à outra língua**. O validador exige as duas;
 * um `null` aqui significa que o livro-razão não passou.
 */
export function derivacaoDaLinha(claim, lang) {
  if (!claim) return null;
  if (lang === 'en') return claim.derivation_en ?? null;
  if (lang === 'pt') return claim.derivation ?? null;
  return null;
}

/**
 * O que a fonte diz sobre o estado do próprio valor, na língua de uma edição.
 *
 * `source_flag` é a bandeira tal como a fonte a escreve — um caractere, e vai
 * já dentro do `excerpt`, porque faz parte do que a fonte diz. Este campo
 * existe para que a página possa **dizer por palavras** o que a bandeira
 * significa, sem inventar um segundo marcador de incerteza (IDENTIDADE.md §6)
 * nem um terceiro estado de selo (§5) nem um acento novo (§2).
 *
 * A nota é prosa da casa e segue a regra de §1.17, como `derivation`: existe
 * nas duas línguas ou em nenhuma, e não há recurso à outra.
 */
export function notaDeBandeira(claim, lang) {
  if (!claim) return null;
  if (lang === 'en') return claim.source_flag_note_en ?? null;
  if (lang === 'pt') return claim.source_flag_note ?? null;
  return null;
}

/**
 * Os campos de uma entrada do registo de correções. Todos obrigatórios.
 * A lista fechada apanha erros de escrita nas chaves — um "reason-en" em vez
 * de "reason_en" passaria despercebido e a edição inglesa ficaria sem motivo.
 */
const CAMPOS_CORRECAO = ['date', 'kind', 'old_value', 'new_value', 'reason', 'reason_en'];

/**
 * `field` só existe — e é obrigatório — numa entrada `proveniencia`.
 *
 * Numa revisão de proveniência, `old_value` e `new_value` são os valores DO
 * CAMPO que mudou (o endereço velho e o novo), e não os do número publicado.
 * Sem `field`, a entrada dizia «X → Y» sem dizer X e Y de quê.
 */
const CAMPOS_CORRECAO_PROVENIENCIA = [...CAMPOS_CORRECAO, 'field'];

/**
 * ---------------------------------------------------------------------------
 * `verifications[]`: as reconferências independentes de uma linha
 * ---------------------------------------------------------------------------
 *
 * O único campo de tempo que uma linha tinha era `access_date`, «lido a»: a
 * data em que a fonte foi lida pela primeira vez. Uma linha lida uma vez em
 * 2026 e nunca mais é indistinguível de uma linha reconferida ontem, e as duas
 * apareciam com a mesma cara. Este campo guarda a segunda leitura: quando, por
 * que caminho, por quem, e com que resultado.
 *
 * NÃO SE ESCREVE À MÃO. Uma entrada nasce de uma releitura que aconteceu: o
 * exportador do motor escreve as das linhas cruzadas a partir do registo da
 * releitura, e o `indicators/refresh.py` escreve as das linhas de base a partir
 * das canárias que corre. Um campo de reconferência preenchido à mão é a
 * promessa mais fácil de fazer e a mais difícil de desmentir.
 */
const CAMPOS_VERIFICACAO = ['date', 'path', 'result', 'by'];

/** O que a releitura encontrou. Três valores, e a diferença não é cosmética. */
export const RESULTADOS_DA_VERIFICACAO = ['igual', 'diverge', 'inacessivel'];

/** Quem releu. Três caminhos, e cada um vale o que vale. */
export const AUTORES_DA_VERIFICACAO = [
  'leitura-independente',
  'painel-semanal',
  'revisao-cruzada',
];

/**
 * As entradas de uma linha, da mais nova para a mais velha, com o índice que
 * cada uma tem na lista do livro-razão.
 *
 * O índice acompanha a entrada porque é ele que a página marca e o portão
 * resolve: uma entrada renderizada diz que posição da lista é, e o portão vai
 * buscá-la a essa posição. Sem isso a comparação seria por ordem de rendição,
 * que é precisamente o que se quer conferir.
 *
 * A ordenação é estável: a lista está por ordem cronológica crescente (o
 * validador exige-o), e duas entradas do mesmo dia mantêm a ordem em que foram
 * escritas, com a mais recente da lista à frente.
 */
export function verificacoesDaLinha(claim) {
  const lista = Array.isArray(claim?.verifications) ? claim.verifications : [];
  return lista
    .map((v, n) => ({ ...v, __n: n }))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)) || b.__n - a.__n);
}

/** Quantas entradas a página mostra: as duas mais recentes, ou menos. */
export const VERIFICACOES_MOSTRADAS = 2;

let _cache = null;

/** Carrega e devolve Map<id, claim>. Lança se o YAML estiver partido. */
export function loadClaims() {
  if (_cache) return _cache;
  const map = new Map();
  let files = [];
  try {
    files = fs.readdirSync(LEDGER_DIR).filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'));
  } catch (err) {
    throw new Error(`livro-razão: não foi possível ler ${LEDGER_DIR}: ${err.message}`);
  }
  files.sort();
  for (const file of files) {
    const full = path.join(LEDGER_DIR, file);
    let doc;
    try {
      doc = load(fs.readFileSync(full, 'utf8'));
    } catch (err) {
      throw new Error(`livro-razão: YAML inválido em ${file}: ${err.message}`);
    }
    if (!doc || typeof doc !== 'object') {
      throw new Error(`livro-razão: ${file} não contém um mapa YAML.`);
    }
    doc.__file = file;
    if (map.has(doc.id)) {
      throw new Error(`livro-razão: id repetido "${doc.id}" (${file} e ${map.get(doc.id).__file}).`);
    }
    map.set(doc.id, doc);
  }
  _cache = map;
  return map;
}

/** Uma afirmação, pelo id. Lança — em build — se não existir. Este é o portão (a). */
export function getClaim(id) {
  const claims = loadClaims();
  const claim = claims.get(id);
  if (!claim) {
    const parecidos = [...claims.keys()]
      .filter((k) => k.includes(String(id).split('-')[0] ?? ''))
      .slice(0, 5);
    throw new Error(
      `livro-razão: a afirmação "${id}" não existe.\n` +
        `  Nenhuma página pode citar um número que não esteja no livro-razão.\n` +
        `  Crie ledger/claims/${id}.yml ou corrija o id.` +
        (parecidos.length ? `\n  Ids parecidos: ${parecidos.join(', ')}` : ''),
    );
  }
  return claim;
}

export function hasClaim(id) {
  return loadClaims().has(id);
}

/* ------------------------------------------------------------------ números */

/**
 * Lê um valor com formatação portuguesa e devolve um número.
 * "82" -> 82 · "26,5%" -> 26.5 · "77,2" -> 77.2 · "−34 100" -> -34100
 * Devolve null quando não é um número simples (e então `check` não é possível).
 */
export function parsePtNumber(value) {
  if (typeof value !== 'string') return null;
  let s = value.trim();
  s = s.replace(/−/g, '-'); // sinal de menos tipográfico
  s = s.replace(/[    \s]/g, ''); // espaços de milhares
  s = s.replace(/%$/, '').replace(/×$/, '');
  if (!/^-?[\d.,]+$/.test(s)) return null;
  const temVirgula = s.includes(',');
  const temPonto = s.includes('.');
  if (temVirgula && temPonto) s = s.replace(/\./g, '').replace(',', '.');
  else if (temVirgula) s = s.replace(',', '.');
  else if (temPonto && /^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/** Só os algarismos de um texto — usado para comparar o que foi renderizado com o livro-razão. */
export function digitsOf(s) {
  return String(s).replace(/\D+/g, '');
}

/* --------------------------------------------------- avaliação de `check:` */

/**
 * Avalia uma expressão de verificação.
 * Aceita: números, ids de afirmações, nomes de contagens, + - * / e parênteses.
 * Os operadores e os parênteses TÊM de estar separados por espaços — os ids
 * contêm hífenes, e sem essa regra "a - b" seria ambíguo.
 */
export function evaluateCheck(expr, { claims, env = COUNTS, selfId = null } = {}) {
  const bruto = String(expr).replace(/([(),])/g, ' $1 ');
  const tokens = bruto.split(/\s+/).filter(Boolean);
  let i = 0;

  const peek = () => tokens[i];
  const next = () => tokens[i++];

  function valorDe(token) {
    if (/^-?\d+(\.\d+)?$/.test(token)) return Number(token);
    if (Object.prototype.hasOwnProperty.call(env, token)) return Number(env[token]);
    if (token === selfId) {
      throw new Error(`a expressão check refere-se a si própria ("${token}")`);
    }
    const claim = claims.get(token);
    if (!claim) throw new Error(`a expressão check refere "${token}", que não existe no livro-razão`);
    const n = parsePtNumber(claim.value);
    if (n === null) {
      throw new Error(`a expressão check refere "${token}", cujo valor "${claim.value}" não é um número simples`);
    }
    return n;
  }

  function primary() {
    const t = next();
    if (t === undefined) throw new Error('expressão check truncada');
    if (t === '(') {
      const v = expression();
      if (next() !== ')') throw new Error('falta um ) na expressão check');
      return v;
    }
    if (t === '-') return -primary();
    /* `round ( x , n )` — acrescentado a 2026-08-13. Sem isto, uma linha
       derivada publicada com menos casas do que a divisão produz não podia ser
       verificada de todo: 30 800 / 39 900 × 100 = 77,19298…, e o valor publicado
       é 77,2. A alternativa seria uma tolerância na comparação, que é pior —
       esconderia precisamente a classe de erro que o check existe para apanhar.
       O arredondamento diz-se na expressão, não se presume na comparação.
       Meio para longe do zero, simétrico: Math.round() sozinho trata −0,5 e 0,5
       de maneiras diferentes. */
    if (t === 'round') {
      if (next() !== '(') throw new Error('falta um ( depois de round na expressão check');
      const v = expression();
      if (next() !== ',') throw new Error('falta a vírgula das casas decimais em round( … , n )');
      const casas = next();
      if (!/^\d+$/.test(String(casas))) {
        throw new Error(`round( … , n ) precisa de um número inteiro de casas, não "${casas}"`);
      }
      if (next() !== ')') throw new Error('falta um ) a fechar round na expressão check');
      const f = Math.pow(10, Number(casas));
      return Math.sign(v) * Math.round(Math.abs(v) * f) / f;
    }
    return valorDe(t);
  }

  function term() {
    let v = primary();
    while (peek() === '*' || peek() === '/') {
      const op = next();
      const r = primary();
      v = op === '*' ? v * r : v / r;
    }
    return v;
  }

  function expression() {
    let v = term();
    while (peek() === '+' || peek() === '-') {
      const op = next();
      const r = term();
      v = op === '+' ? v + r : v - r;
    }
    return v;
  }

  const resultado = expression();
  if (i !== tokens.length) {
    throw new Error(`a expressão check tem lixo depois do fim: "${tokens.slice(i).join(' ')}"`);
  }
  return resultado;
}

/**
 * Contagens do próprio registo de correções, para as expressões `check`.
 * Só as correções contam para `correcoes_publicadas`: uma actualização não é
 * um erro admitido, e o número que a página anuncia é o das confissões.
 */
export function contagensDoRegisto(claims = loadClaims()) {
  let correcoes = 0;
  let atualizacoes = 0;
  let revisoes = 0;
  for (const c of claims.values()) {
    for (const corr of c.corrections ?? []) {
      if (corr.kind === 'correcao') correcoes++;
      else if (corr.kind === 'atualizacao') atualizacoes++;
      else if (corr.kind === 'proveniencia') revisoes++;
    }
  }
  return {
    correcoes_publicadas: correcoes,
    atualizacoes_publicadas: atualizacoes,
    revisoes_de_proveniencia: revisoes,
  };
}


/**
 * O motivo de uma entrada do registo, na língua de uma edição.
 *
 * O motivo é prosa da casa e existe nas duas línguas: português em `reason`,
 * inglês em `reason_en`. **Não há recurso à outra língua.** Uma edição inglesa
 * a mostrar o motivo português é exactamente o buraco que o campo `reason_en`
 * veio fechar — e o validador exige os dois campos, por isso um `null` aqui
 * significa que o livro-razão não passou.
 */
export function motivoDaEntrada(corr, lang) {
  if (!corr) return null;
  if (lang === 'en') return corr.reason_en ?? null;
  if (lang === 'pt') return corr.reason ?? null;
  return null;
}

/**
 * Todas as entradas do registo, de todas as afirmações, da mais recente à
 * primeira. É daqui que a página do método lê — nunca de texto escrito à mão.
 */
export function entradasDoRegisto(kind = null) {
  const out = [];
  for (const claim of allClaims()) {
    (claim.corrections ?? []).forEach((corr, n) => {
      if (kind && corr.kind !== kind) return;
      out.push({ claimId: claim.id, n, ...corr });
    });
  }
  return out.sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

/* -------------------------------------------------------------- validação */

function ausente(v) {
  return v === null || v === undefined || (typeof v === 'string' && v.trim() === '');
}

/**
 * Valida o livro-razão inteiro.
 * Devolve { errors: string[], warnings: string[], stats }.
 */
export function validateLedger() {
  const claims = loadClaims();
  // As expressões `check` também podem contar o próprio registo de correções.
  const env = { ...COUNTS, ...contagensDoRegisto(claims) };
  const errors = [];
  const warnings = [];
  let porVerificar = 0;
  let derivadas = 0;
  let verificadas = 0;

  if (claims.size === 0) errors.push('livro-razão: não há nenhuma afirmação em ledger/claims/.');

  for (const [id, c] of claims) {
    const onde = `[${c.__file}]`;

    // 1 — nome do ficheiro é o id
    const esperado = String(id) + '.yml';
    if (c.__file !== esperado) {
      errors.push(`${onde} o nome do ficheiro tem de ser o id: esperado "${esperado}".`);
    }
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(String(id))) {
      errors.push(`${onde} id inválido "${id}": só minúsculas, algarismos e hífenes.`);
    }

    // 2 — campos desconhecidos (apanha erros de escrita nas chaves)
    for (const k of Object.keys(c)) {
      if (k === '__file') continue;
      if (!CAMPOS.includes(k)) errors.push(`${onde} campo desconhecido "${k}".`);
    }

    // 3 — valor e unidade
    if (typeof c.value !== 'string' || c.value.trim() === '') {
      errors.push(`${onde} "value" tem de ser uma string não vazia, com o valor tal como publicado.`);
    } else if (!/\d/.test(c.value)) {
      errors.push(`${onde} "value" ("${c.value}") não contém nenhum algarismo.`);
    }
    if (ausente(c.unit)) errors.push(`${onde} falta "unit".`);

    // 4 — proveniência
    const derivada = Array.isArray(c.derived_from) && c.derived_from.length > 0;
    if (derivada) derivadas++;
    if (!Array.isArray(c.derived_from)) {
      errors.push(`${onde} "derived_from" tem de ser uma lista (use [] quando não deriva de nada).`);
    }
    for (const dep of c.derived_from ?? []) {
      if (!claims.has(dep)) {
        errors.push(`${onde} "derived_from" aponta para "${dep}", que não existe no livro-razão.`);
      }
    }
    if (derivada && ausente(c.derivation)) {
      errors.push(`${onde} deriva de outras linhas mas não explica a aritmética em "derivation".`);
    }
    /* A aritmética é prosa da casa, e a página da linha publica-a nas duas
       edições. Mesma regra do motivo de uma correção (§1.17): as duas línguas
       ou nenhuma — sem recurso à outra, que seria o mesmo defeito disfarçado. */
    if (!ausente(c.derivation) && ausente(c.derivation_en)) {
      errors.push(
        `${onde} tem "derivation" mas não tem "derivation_en". A aritmética aparece na página ` +
          `da linha nas duas edições: escreva-a em português em "derivation" e em inglês em ` +
          `"derivation_en". Não há recurso à outra língua.`,
      );
    }
    if (ausente(c.derivation) && !ausente(c.derivation_en)) {
      errors.push(`${onde} tem "derivation_en" sem "derivation". A linha portuguesa é a primeira.`);
    }
    /* A bandeira da fonte. Mesma regra das duas línguas — e mais uma: uma nota
       sem bandeira é a casa a dizer que a fonte marcou alguma coisa sem dizer o
       que a fonte escreveu, e uma bandeira sem nota é um caractere solto que o
       leitor não tem como interpretar. */
    if (!ausente(c.source_flag_note) && ausente(c.source_flag_note_en)) {
      errors.push(
        `${onde} tem "source_flag_note" mas não tem "source_flag_note_en". A nota aparece na ` +
          `página da linha nas duas edições. Não há recurso à outra língua.`,
      );
    }
    if (ausente(c.source_flag_note) && !ausente(c.source_flag_note_en)) {
      errors.push(
        `${onde} tem "source_flag_note_en" sem "source_flag_note". A linha portuguesa é a primeira.`,
      );
    }
    if (!ausente(c.source_flag) && ausente(c.source_flag_note)) {
      errors.push(
        `${onde} declara a bandeira "${c.source_flag}" da fonte e não a explica em ` +
          `"source_flag_note". Uma bandeira que o leitor não sabe ler não é proveniência.`,
      );
    }
    if (ausente(c.source_flag) && !ausente(c.source_flag_note)) {
      errors.push(
        `${onde} explica uma bandeira em "source_flag_note" sem dizer, em "source_flag", ` +
          `qual é a bandeira que a fonte escreve.`,
      );
    }
    /* A bandeira faz parte do que a fonte diz: se está declarada, tem de estar
       no excerto, que é a transcrição. Sem isto, uma linha podia declarar a
       bandeira no campo novo e continuar a transcrever a fonte sem ela — que é
       exactamente o defeito que este campo veio fechar (§1.28). */
    if (!ausente(c.source_flag) && typeof c.excerpt === 'string' && c.excerpt !== POR_VERIFICAR) {
      /* A bandeira vem DEPOIS do valor, separada por um espaço — é assim que a
         fonte a escreve, e é a única posição em que ela quer dizer alguma coisa.
         Procurá-la em qualquer sítio da cadeia não conferia nada: um "p" existe
         dentro de "nama_10r_2gdp", e a primeira versão desta regra dava-se por
         satisfeita com ele. Uma conferência que passa sempre não é conferência. */
      if (!new RegExp(`\\s${escapaRegex(String(c.source_flag))}$`).test(c.excerpt.trimEnd())) {
        errors.push(
          `${onde} declara a bandeira "${c.source_flag}" mas o "excerpt" não termina com ela. ` +
            `A fonte escreve a bandeira a seguir ao valor, separada por um espaço: transcreva-a assim.`,
        );
      }
    }
    /* Uma linha da casa (contagem do próprio registo) pode deixar em `null` os
       campos que só um documento externo poderia preencher. Ver eDaCasa(): a
       porta exige o nome da casa em `source` E uma `derivation`, para que isto
       não sirva de atalho a proveniência em falta. `source` e `reference_date`
       continuam obrigatórios — a casa é a fonte, e a data a que a contagem se
       refere existe sempre. */
    const daCasa = eDaCasa(c);
    const NULO_NA_CASA = new Set(['source_url', 'excerpt', 'document']);
    /* A porta estreita da §2.4: uma linha contada sobre um ficheiro que este
       sítio aloja pode deixar `excerpt` a null, porque não há frase para
       transcrever: há um ficheiro, com o seu resumo, e uma conta escrita nas
       duas línguas. Só o `excerpt`: a fonte, o endereço, a data de leitura e o
       documento continuam obrigatórios, e é isso que separa esta porta de uma
       maneira de branquear proveniência em falta. */
    const contadaSobreFicheiro = eContadaSobreFicheiro(c);

    for (const campo of CAMPOS_PROVENIENCIA) {
      const v = c[campo];
      if (derivada && v === null) continue; // legítimo: a proveniência é a das origens
      if (daCasa && v === null && NULO_NA_CASA.has(campo)) continue;
      if (contadaSobreFicheiro && v === null && campo === 'excerpt') continue;
      if (campo === 'document') {
        if (v === null || typeof v !== 'object') {
          errors.push(`${onde} falta "document" (precisa de title e edition).`);
        } else {
          if (ausente(v.title)) errors.push(`${onde} falta "document.title".`);
          if (ausente(v.edition)) errors.push(`${onde} falta "document.edition".`);
          if (v.title === POR_VERIFICAR) porVerificar++;
          if (v.edition === POR_VERIFICAR) porVerificar++;
        }
        continue;
      }
      if (ausente(v)) {
        errors.push(
          `${onde} falta "${campo}". Se não é conhecido, escreva "${POR_VERIFICAR}" — nunca um valor plausível.`,
        );
      }
    }

    /* As chaves do bloco `document`, e o tipo de `locator`.
       Fora do laço de cima de propósito: aquele salta as linhas derivadas e as
       da casa, e uma chave mal escrita continua a ser um engano numa linha
       derivada que traga documento próprio. */
    if (c.document !== null && c.document !== undefined) {
      if (typeof c.document !== 'object' || Array.isArray(c.document)) {
        errors.push(`${onde} "document" tem de ser um mapa com title e edition.`);
      } else {
        for (const k of Object.keys(c.document)) {
          if (!CAMPOS_DO_DOCUMENTO.includes(k)) {
            errors.push(
              `${onde} chave desconhecida "document.${k}". ` +
                `Aceites: ${CAMPOS_DO_DOCUMENTO.join(', ')}.`,
            );
          }
        }
        const tipo = c.document.kind;
        if (tipo !== null && tipo !== undefined && !TIPOS_DE_DOCUMENTO.includes(tipo)) {
          errors.push(
            `${onde} "document.kind" é "${tipo}". Só pode ser ` +
              `${TIPOS_DE_DOCUMENTO.map((k) => `"${k}"`).join(', ')} — ou nenhum, e a página usa ` +
              `os rótulos genéricos.`,
          );
        }
        const loc = c.document.locator;
        if (loc !== null && loc !== undefined) {
          if (typeof loc !== 'string' || loc.trim() === '') {
            errors.push(
              `${onde} "document.locator" tem de ser uma cadeia não vazia — onde no documento ` +
                `está o excerto ("p. 108", "Quadro 4, p. 108"). Se não se sabe, ou se escreve ` +
                `"${POR_VERIFICAR}", ou não se escreve o campo.`,
            );
          }
        }

      }
    }

    /* -----------------------------------------------------------------------
     * `document.page`: a página onde está a frase que o excerto transcreve
     * -----------------------------------------------------------------------
     *
     * Passa a ser a ÚNICA origem da página. Até 18.08.2026 o número era lido
     * do localizador e de mais lado nenhum, e o fragmento `#page=N` do endereço
     * derivava daí; hoje é o contrário: o campo declara-se, o fragmento tem de
     * o repetir, e o localizador não pode dizer outra coisa. Uma página não se
     * lê de duas maneiras.
     *
     * Fora do bloco de cima de propósito: a conferência do endereço vale mesmo
     * numa linha sem `document`, porque um `#page=` sem campo que o declare é
     * o mesmo defeito com uma cara diferente.
     */
    {
      const pag = c.document && typeof c.document === 'object' ? c.document.page : undefined;
      const temPagina = pag !== null && pag !== undefined;
      if (temPagina) {
        if (typeof pag !== 'number' || !Number.isInteger(pag) || pag < 1) {
          errors.push(
            `${onde} "document.page" é ${JSON.stringify(pag)}. Tem de ser um inteiro ≥ 1, ` +
              `a página do documento onde está a frase que o "excerpt" transcreve.`,
          );
        }
        /* Uma linha derivada e uma linha da casa não têm documento: uma página
           ali seria uma prova a apontar para um documento que a linha não cita. */
        if (derivada || eDaCasa(c)) {
          errors.push(
            `${onde} "document.page" numa linha ${derivada ? 'derivada' : 'da casa'}. ` +
              `Não há documento onde essa página exista: a proveniência está ` +
              `${derivada ? 'nas linhas de origem' : 'no próprio livro-razão'}.`,
          );
        }
      }

      const endereco = typeof c.source_url === 'string' ? c.source_url : '';
      const noEndereco = endereco.match(PAGINA_NO_ENDERECO)?.[1] ?? null;
      const semFragmento = endereco.split('#')[0];

      if (noEndereco !== null) {
        if (!temPagina) {
          errors.push(
            `${onde} o endereço fixa a página ${noEndereco} ("#page=${noEndereco}") e a linha ` +
              `não declara "document.page". O fragmento deriva do campo, e não o contrário.`,
          );
        } else if (String(pag) !== noEndereco) {
          errors.push(
            `${onde} "document.page" é ${pag} e o endereço fixa a página ${noEndereco} ` +
              `("#page=${noEndereco}"). São a mesma página, e por isso têm de ser o mesmo número.`,
          );
        }
      } else if (temPagina && semFragmento.toLowerCase().endsWith('.pdf')) {
        errors.push(
          `${onde} declara "document.page: ${pag}" sobre um PDF e o endereço não leva ` +
            `"#page=${pag}". Quem abre o endereço tem de cair na página que a linha declara.`,
        );
      }

      /* ---------------------------------------------------------------------
       * `document.crop`: o recorte da linha impressa
       * ---------------------------------------------------------------------
       *
       * A prova documental deixa de ser uma transcrição e passa a ser também
       * uma imagem da linha impressa, produzida no motor por `core/pdfproof.py`
       * e atravessada como ficheiro (DECISIONS §1.47, T2). Um recorte é a coisa
       * mais convincente que este sítio publica: mostrado ao lado da linha
       * errada, ou tirado de outra página, seria um recibo falso com uma
       * fotografia agarrada. Por isso o validador confere tudo o que se pode
       * conferir sem sair do disco: o nome, o ficheiro, os bytes e a página.
       */
      {
        const recorte = c.document && typeof c.document === 'object' ? c.document.crop : undefined;
        if (recorte !== null && recorte !== undefined) {
          if (typeof recorte !== 'object' || Array.isArray(recorte)) {
            errors.push(
              `${onde} "document.crop" tem de ser um mapa com "asset", "sha256" e "page".`,
            );
          } else {
            for (const k of Object.keys(recorte)) {
              if (!CAMPOS_DO_RECORTE.includes(k)) {
                errors.push(
                  `${onde} chave desconhecida "document.crop.${k}". ` +
                    `Aceites: ${CAMPOS_DO_RECORTE.join(', ')}.`,
                );
              }
            }
            /* Um recorte é de uma página, e uma linha sem página declarada não
               tem página de que ele seja. Também não há documento onde uma
               página exista numa linha derivada ou da casa: a regra acima já o
               diz da página, e o recorte herda-a por vir agarrado a ela. */
            if (!temPagina) {
              errors.push(
                `${onde} tem "document.crop" e não declara "document.page". Um recorte é a ` +
                  `imagem de UMA página: sem o campo que diz qual, ninguém pode conferir que ` +
                  `é a página que o excerto transcreve.`,
              );
            } else if (recorte.page !== pag) {
              errors.push(
                `${onde} "document.crop.page" é ${JSON.stringify(recorte.page)} e ` +
                  `"document.page" é ${pag}. O recorte é da página onde está a frase que o ` +
                  `"excerpt" transcreve, e por isso são o mesmo número.`,
              );
            }

            const esperado = `recortes/${c.id}.webp`;
            if (recorte.asset !== esperado) {
              errors.push(
                `${onde} "document.crop.asset" é ${JSON.stringify(recorte.asset)} e tem de ser ` +
                  `"${esperado}". Um recorte por linha, com o nome da linha: um nome livre ` +
                  `deixava duas linhas apontar para a mesma imagem.`,
              );
            } else if (typeof recorte.sha256 !== 'string' || !RESUMO_SHA256.test(recorte.sha256)) {
              errors.push(
                `${onde} "document.crop.sha256" é ${JSON.stringify(recorte.sha256)}. Tem de ser ` +
                  `o resumo sha256 dos bytes do ficheiro, 64 hexadecimais em minúsculas.`,
              );
            } else {
              const ficheiro = path.join(DIR_RECORTES, `${c.id}.webp`);
              let octetos = null;
              try {
                octetos = fs.readFileSync(ficheiro);
              } catch {
                errors.push(
                  `${onde} declara o recorte "${recorte.asset}" e não há ficheiro em ` +
                    `public/${recorte.asset}. Um recorte que a linha promete e o sítio não ` +
                    `serve é uma prova que não abre.`,
                );
              }
              if (octetos) {
                if (octetos.length > MAX_BYTES_DO_RECORTE) {
                  errors.push(
                    `${onde} o recorte "${recorte.asset}" tem ${octetos.length} bytes, acima do ` +
                      `teto de ${MAX_BYTES_DO_RECORTE}. Um recorte é uma linha impressa, não ` +
                      `uma página digitalizada.`,
                  );
                }
                const resumo = crypto.createHash('sha256').update(octetos).digest('hex');
                if (resumo !== recorte.sha256) {
                  errors.push(
                    `${onde} o recorte "${recorte.asset}" não é o que a linha declara.\n` +
                      `      no livro-razão: ${recorte.sha256}\n` +
                      `      em disco:       ${resumo}\n` +
                      `      Uma imagem trocada depois da travessia é a prova a dizer outra ` +
                      `coisa sem que nada mude no texto.`,
                  );
                }
              }
            }
          }
        }
      }

      /* ---------------------------------------------------------------------
       * `document.hosted`: o ficheiro de dados de que esta linha é contada
       * ---------------------------------------------------------------------
       *
       * A prova de uma contagem não é uma frase, é o conjunto contado. Alojá-lo
       * aqui é o que permite ao leitor refazer a conta; e é também o que obriga
       * este sítio a saber o que está a redistribuir, por isso a licença, o seu
       * endereço e a atribuição são campos e não comentários.
       *
       * O que se confere sem sair do disco: o nome, o ficheiro, os bytes, o
       * tamanho, e a forma de cada origem. O resumo do ficheiro de ORIGEM
       * (o zip da DGT) não se pode conferir aqui: o sítio não o aloja, e é
       * essa a razão de o publicar: quem o descarregar confere-o.
       */
      {
        const alojado = c.document && typeof c.document === 'object' ? c.document.hosted : undefined;
        if (alojado !== null && alojado !== undefined) {
          if (typeof alojado !== 'object' || Array.isArray(alojado)) {
            errors.push(
              `${onde} "document.hosted" tem de ser um mapa com ` +
                `${CAMPOS_DO_ALOJADO.join(', ')}.`,
            );
          } else {
            for (const k of Object.keys(alojado)) {
              if (!CAMPOS_DO_ALOJADO.includes(k)) {
                errors.push(
                  `${onde} chave desconhecida "document.hosted.${k}". ` +
                    `Aceites: ${CAMPOS_DO_ALOJADO.join(', ')}.`,
                );
              }
            }
            /* Um ficheiro alojado é o que o endereço serve. Numa linha que
               diga que a sua fonte é uma página, uma série ou um PDF, o campo
               estaria a prometer que o documento citado É o ficheiro que este
               sítio aloja, e não é. */
            if (c.document.kind !== 'ficheiro') {
              errors.push(
                `${onde} tem "document.hosted" e "document.kind" é ` +
                  `${JSON.stringify(c.document.kind ?? null)}. Um ficheiro alojado é o extrato ` +
                  `de um ficheiro: declare "kind: ficheiro", ou o campo está na linha errada.`,
              );
            }
            const asset = alojado.asset;
            if (typeof asset !== 'string' || !/^dados\/[A-Za-z0-9._-]+$/.test(asset)) {
              errors.push(
                `${onde} "document.hosted.asset" é ${JSON.stringify(asset)} e tem de ser ` +
                  `"dados/<nome>", o ficheiro em public/dados/ que o sítio serve em /dados/.`,
              );
            } else if (
              typeof alojado.sha256 !== 'string' ||
              !RESUMO_SHA256.test(alojado.sha256)
            ) {
              errors.push(
                `${onde} "document.hosted.sha256" é ${JSON.stringify(alojado.sha256)}. Tem de ` +
                  `ser o resumo sha256 dos bytes do ficheiro, 64 hexadecimais em minúsculas.`,
              );
            } else {
              const ficheiro = path.join(DIR_DADOS, asset.slice('dados/'.length));
              let octetos = null;
              try {
                octetos = fs.readFileSync(ficheiro);
              } catch {
                errors.push(
                  `${onde} declara o ficheiro "${asset}" e não há nada em public/${asset}. ` +
                    `Um ficheiro que a linha promete e o sítio não serve é uma conta que ` +
                    `ninguém pode refazer.`,
                );
              }
              if (octetos) {
                const resumo = crypto.createHash('sha256').update(octetos).digest('hex');
                if (resumo !== alojado.sha256) {
                  errors.push(
                    `${onde} o ficheiro "${asset}" não é o que a linha declara.\n` +
                      `      no livro-razão: ${alojado.sha256}\n` +
                      `      em disco:       ${resumo}\n` +
                      `      Um ficheiro trocado depois de alojado é a conta a dar outro ` +
                      `resultado sem que nada mude no texto.`,
                  );
                }
                if (!Number.isInteger(alojado.bytes) || alojado.bytes !== octetos.length) {
                  errors.push(
                    `${onde} "document.hosted.bytes" é ${JSON.stringify(alojado.bytes)} e o ` +
                      `ficheiro "${asset}" tem ${octetos.length} bytes.`,
                  );
                }
              }
            }
            for (const [campo, rotulo] of [
              ['licence', 'a licença sob a qual a fonte publica'],
              ['licence_url', 'o endereço onde a licença está escrita'],
              ['attribution', 'a atribuição na forma que a fonte pede'],
            ]) {
              if (typeof alojado[campo] !== 'string' || alojado[campo].trim() === '') {
                errors.push(
                  `${onde} falta "document.hosted.${campo}": ${rotulo}. Um ficheiro ` +
                    `redistribuído sem a licença dita é uma reutilização que este sítio não ` +
                    `pode defender.`,
                );
              }
            }
            if (
              typeof alojado.licence_url === 'string' &&
              alojado.licence_url.trim() !== '' &&
              !/^https?:\/\//.test(alojado.licence_url)
            ) {
              errors.push(
                `${onde} "document.hosted.licence_url" é "${alojado.licence_url}". Tem de ser ` +
                  `um endereço, a começar por "http://" ou "https://".`,
              );
            }
            const origens = alojado.extracted_from;
            if (!Array.isArray(origens) || origens.length === 0) {
              errors.push(
                `${onde} "document.hosted.extracted_from" tem de ser uma lista, não vazia, dos ` +
                  `ficheiros da fonte de onde este extrato saiu, cada um com ` +
                  `${CAMPOS_DA_EXTRACAO.join(', ')}. Sem ela, o extrato não se liga a nada.`,
              );
            } else {
              origens.forEach((e, n) => {
                const rot = `${onde} "document.hosted.extracted_from[${n}]"`;
                if (!e || typeof e !== 'object' || Array.isArray(e)) {
                  errors.push(`${rot}: tem de ser um mapa com ${CAMPOS_DA_EXTRACAO.join(', ')}.`);
                  return;
                }
                for (const k of Object.keys(e)) {
                  if (!CAMPOS_DA_EXTRACAO.includes(k)) {
                    errors.push(
                      `${rot}: chave desconhecida "${k}". Aceites: ${CAMPOS_DA_EXTRACAO.join(', ')}.`,
                    );
                  }
                }
                if (typeof e.file !== 'string' || e.file.trim() === '') {
                  errors.push(`${rot}: falta "file", o nome do ficheiro tal como a fonte o nomeia.`);
                }
                if (typeof e.url !== 'string' || !/^https?:\/\//.test(e.url)) {
                  errors.push(
                    `${rot}: "url" é ${JSON.stringify(e.url)}. Tem de ser o endereço de onde o ` +
                      `ficheiro foi descarregado.`,
                  );
                }
                if (typeof e.sha256 !== 'string' || !RESUMO_SHA256.test(e.sha256)) {
                  errors.push(
                    `${rot}: "sha256" é ${JSON.stringify(e.sha256)}. Tem de ser o resumo dos ` +
                      `bytes do ficheiro da fonte, 64 hexadecimais em minúsculas: é ele que ` +
                      `liga o extrato ao original.`,
                  );
                }
                if (!Number.isInteger(e.bytes) || e.bytes < 1) {
                  errors.push(`${rot}: "bytes" é ${JSON.stringify(e.bytes)}, e tem de ser o ` +
                    `tamanho do ficheiro da fonte, um inteiro ≥ 1.`);
                }
              });
            }
          }
        }
      }

      /* ---------------------------------------------------------------------
       * `document.url`: a página humana de uma série de dados
       * ---------------------------------------------------------------------
       *
       * 57 linhas citam uma série: um pedido a uma API que devolve um campo, e
       * não um documento com uma frase impressa. A página dava ao leitor o
       * pedido, que é o endereço de uma máquina. Este campo é o endereço de uma
       * pessoa: a página do indicador, no sítio de quem o publica.
       *
       * Só existe onde `document.kind` é `serie`. Noutra linha o endereço já é
       * legível por pessoas, e um segundo endereço «humano» ao lado seria dois
       * endereços a prometer a mesma coisa.
       *
       * **Escreve-se só depois de provado**, e a prova é do motor
       * (`publisher/series_pages.py`): para o Eurostat, o código responde 200 à
       * API de disseminação e tem título no catálogo oficial; para o SGMAI, a
       * página lê o território do endereço e o ficheiro emparelhado da mesma
       * origem nomeia o concelho, com uma chave inventada a dar 404. Um endereço
       * não confirmado fica ausente, e a página não o inventa.
       */
      {
        const humana = c.document && typeof c.document === 'object' ? c.document.url : undefined;
        if (humana !== null && humana !== undefined) {
          if (typeof humana !== 'string' || !/^https?:\/\//.test(humana)) {
            errors.push(
              `${onde} "document.url" é ${JSON.stringify(humana)}. Tem de ser a página do ` +
                `indicador legível por pessoas, a começar por "http://" ou "https://".`,
            );
          }
          if (c.document.kind !== 'serie') {
            errors.push(
              `${onde} tem "document.url" e "document.kind" é ` +
                `${JSON.stringify(c.document.kind ?? null)}. A página humana existe onde o ` +
                `endereço é um pedido a uma API: numa linha que já cita um documento, o ` +
                `endereço é a página, e um segundo seria a mesma promessa escrita duas vezes.`,
            );
          }
        }
      }

      /* ---------------------------------------------------------------------
       * `document.computed_over`: os ficheiros de que a conta foi feita
       * ---------------------------------------------------------------------
       *
       * Registo e não prova: o sítio não aloja estes ficheiros, e por isso o
       * excerto continua por confirmar e a linha continua a contar para a
       * dívida. O que se confere aqui é a forma: um ficheiro sem resumo, sem
       * data de instantâneo ou sem tamanho não identifica nada, e uma soma sem
       * coluna e sem filtro não diz o que somou nem sobre o quê.
       */
      {
        const calc = c.document && typeof c.document === 'object' ? c.document.computed_over : undefined;
        if (calc !== null && calc !== undefined) {
          if (typeof calc !== 'object' || Array.isArray(calc)) {
            errors.push(
              `${onde} "document.computed_over" tem de ser um mapa com ` +
                `${CAMPOS_DO_CALCULO.join(', ')}.`,
            );
          } else {
            for (const k of Object.keys(calc)) {
              if (!CAMPOS_DO_CALCULO.includes(k)) {
                errors.push(
                  `${onde} chave desconhecida "document.computed_over.${k}". ` +
                    `Aceites: ${CAMPOS_DO_CALCULO.join(', ')}.`,
                );
              }
            }
            if (c.document.kind !== 'ficheiro') {
              errors.push(
                `${onde} tem "document.computed_over" e "document.kind" é ` +
                  `${JSON.stringify(c.document.kind ?? null)}. Uma soma faz-se sobre ficheiros: ` +
                  `declare "kind: ficheiro", ou o campo está na linha errada.`,
              );
            }
            for (const campo of ['column', 'filter']) {
              if (typeof calc[campo] !== 'string' || calc[campo].trim() === '') {
                errors.push(
                  `${onde} falta "document.computed_over.${campo}". Uma soma diz que coluna ` +
                    `somou e sobre que linhas do ficheiro: sem as duas, não se pode refazer.`,
                );
              }
            }
            if (!Array.isArray(calc.files) || calc.files.length === 0) {
              errors.push(
                `${onde} "document.computed_over.files" tem de ser uma lista, não vazia, dos ` +
                  `ficheiros sobre que a conta foi feita, cada um com ` +
                  `${CAMPOS_DO_FICHEIRO_CALCULADO.join(', ')}.`,
              );
            } else {
              calc.files.forEach((f, n) => {
                const rot = `${onde} "document.computed_over.files[${n}]"`;
                if (!f || typeof f !== 'object' || Array.isArray(f)) {
                  errors.push(
                    `${rot}: tem de ser um mapa com ${CAMPOS_DO_FICHEIRO_CALCULADO.join(', ')}.`,
                  );
                  return;
                }
                for (const k of Object.keys(f)) {
                  if (!CAMPOS_DO_FICHEIRO_CALCULADO.includes(k)) {
                    errors.push(
                      `${rot}: chave desconhecida "${k}". ` +
                        `Aceites: ${CAMPOS_DO_FICHEIRO_CALCULADO.join(', ')}.`,
                    );
                  }
                }
                if (typeof f.file !== 'string' || f.file.trim() === '') {
                  errors.push(`${rot}: falta "file", o nome que o publicador dá ao ficheiro.`);
                }
                if (!/^\d{4}-\d{2}-\d{2}$/.test(String(f.snapshot_date ?? ''))) {
                  errors.push(
                    `${rot}: "snapshot_date" é ${JSON.stringify(f.snapshot_date)}. Tem de ser ` +
                      `AAAA-MM-DD, a data do instantâneo em que o ficheiro foi lido: um ` +
                      `publicador que substitui o ficheiro todos os dias serve um ficheiro ` +
                      `diferente com o mesmo nome.`,
                  );
                }
                if (typeof f.sha256 !== 'string' || !RESUMO_SHA256.test(f.sha256)) {
                  errors.push(
                    `${rot}: "sha256" é ${JSON.stringify(f.sha256)}. Tem de ser o resumo dos ` +
                      `bytes do ficheiro, 64 hexadecimais em minúsculas: sem ele, o nome do ` +
                      `ficheiro não identifica nada.`,
                  );
                }
                if (!Number.isInteger(f.bytes) || f.bytes < 1) {
                  errors.push(`${rot}: "bytes" é ${JSON.stringify(f.bytes)}, e tem de ser o ` +
                    `tamanho do ficheiro, um inteiro ≥ 1.`);
                }
              });
            }
          }
        }
      }

      const localizador = c.document && typeof c.document === 'object' ? c.document.locator : null;
      const noLocalizador =
        typeof localizador === 'string'
          ? (localizador.match(PAGINA_NO_LOCALIZADOR)?.[1] ?? null)
          : null;
      if (noLocalizador !== null) {
        if (!temPagina) {
          errors.push(
            `${onde} o localizador diz "p. ${noLocalizador}" e a linha não declara ` +
              `"document.page". Declare-o: a página não se lê de duas maneiras.`,
          );
        } else if (String(pag) !== noLocalizador) {
          errors.push(
            `${onde} "document.page" é ${pag} e o localizador diz "p. ${noLocalizador}". ` +
              `O localizador e o campo apontam para a mesma página.`,
          );
        }
      }
    }

    /* `attributed_to` — a quem o valor é creditado. Opcional, e por isso a
       regra é sobre a forma e não sobre a presença: uma lista de cadeias não
       vazias, ou campo nenhum. Uma cadeia solta (`attributed_to: "PS"`) é o
       engano provável, e passaria a ser renderizada carácter a carácter como
       uma entidade chamada "PS" — que por acaso até estaria certo, e é
       exactamente por isso que não se aceita: a forma tem de ser uma só. */
    if (c.attributed_to !== null && c.attributed_to !== undefined) {
      if (!Array.isArray(c.attributed_to)) {
        errors.push(
          `${onde} "attributed_to" tem de ser uma lista de nomes de entidades ` +
            `(use — Município de Évora — em lista, não uma cadeia solta).`,
        );
      } else if (c.attributed_to.length === 0) {
        errors.push(
          `${onde} "attributed_to" está vazio. Uma linha que não credita ninguém não traz o campo.`,
        );
      } else {
        c.attributed_to.forEach((quem, n) => {
          if (typeof quem !== 'string' || quem.trim() === '') {
            errors.push(`${onde} "attributed_to[${n}]" tem de ser o nome de uma entidade.`);
          } else if (quem.includes(SEPARADOR_ATRIBUICAO.trim())) {
            /* O separador da rendição não pode aparecer dentro de um nome: a
               página escreve a lista numa linha só, e o portão compara-a
               carácter a carácter — um nome com o separador lá dentro tornaria
               a lista ambígua para quem a lê. */
            errors.push(
              `${onde} "attributed_to[${n}]" contém "${SEPARADOR_ATRIBUICAO.trim()}", ` +
                `que é o separador com que a página escreve a lista. Separe as entidades em ` +
                `elementos da lista.`,
            );
          }
        });
      }
    }

    /* A data a que os dados se referem é obrigatória numa linha publicada.
       Sem ela, uma linha passava a contar como proveniência completa — selo
       cheio, indexada, no sitemap — sendo um registo citável sem data. Numa
       linha derivada pode ser null, como o resto da proveniência (§1.3). */
    if (!derivada && (c.reference_date === null || c.reference_date === undefined)) {
      errors.push(
        `${onde} falta "reference_date": a que período se referem os dados. ` +
          `Se não é conhecido, escreva "${POR_VERIFICAR}".`,
      );
    }

    /* A contagem da dívida é a mesma que decide o selo, o noindex e o sitemap.
       Estava a ser contada aqui por uma lista própria, sem reference_date. */
    porVerificar += camposPorVerificar(c).length;

    // 5 — estudo
    if (ausente(c.study)) errors.push(`${onde} falta "study".`);
    else if (!STUDY_IDS.has(c.study)) {
      errors.push(
        `${onde} "study" é "${c.study}", que não consta de src/data/studies.mjs.\n` +
          `    Estudos aceites: ${[...STUDY_IDS].join(', ')}`,
      );
    }

    // 6 — correcções
    if (!Array.isArray(c.corrections)) {
      errors.push(`${onde} "corrections" tem de ser uma lista (use [] quando não há correcções).`);
    } else {
      c.corrections.forEach((corr, n) => {
        const rot = `${onde} correcção #${n + 1}`;
        if (!corr || typeof corr !== 'object') {
          errors.push(`${rot}: tem de ser um mapa com date, kind, old_value, new_value, reason e reason_en.`);
          return;
        }
        const aceites =
          corr.kind === 'proveniencia' ? CAMPOS_CORRECAO_PROVENIENCIA : CAMPOS_CORRECAO;
        for (const k of Object.keys(corr)) {
          if (!aceites.includes(k)) {
            errors.push(
              `${rot}: campo desconhecido "${k}". Aceites: ${aceites.join(', ')}` +
                (k === 'field' ? ' — "field" só existe numa entrada "proveniencia".' : '.'),
            );
          }
        }
        /* A revisão de proveniência tem de dizer QUAL o campo que mudou, e o
           campo tem de ser um dos que a proveniência tem. */
        if (corr.kind === 'proveniencia') {
          if (ausente(corr.field)) {
            errors.push(
              `${rot}: uma entrada "proveniencia" tem de trazer "field" — qual o campo de ` +
                `proveniência que mudou. Sem ele, "old_value → new_value" não diz de quê.`,
            );
          } else if (!CAMPOS_DE_PROVENIENCIA.includes(corr.field)) {
            errors.push(
              `${rot}: "field" é "${corr.field}". Só pode ser ` +
                `${CAMPOS_DE_PROVENIENCIA.map((k) => `"${k}"`).join(', ')}.`,
            );
          }
        }
        for (const campo of ['date', 'kind', 'old_value', 'new_value', 'reason']) {
          if (ausente(corr[campo])) errors.push(`${rot}: falta "${campo}".`);
        }
        /* O motivo tem de existir nas duas línguas. A edição inglesa mostra
           "reason_en"; sem ele, mostraria o motivo em português — que foi o
           buraco que este campo veio fechar. Não há tradução automática nem
           recurso à outra língua: ou está escrito, ou o build pára. */
        if (ausente(corr.reason_en)) {
          errors.push(
            `${rot}: falta "reason_en". O motivo tem de estar escrito nas duas línguas — ` +
              `"reason" em português, "reason_en" em inglês. A edição inglesa mostra o segundo.`,
          );
        }
        if (!ausente(corr.kind) && !KINDS.includes(corr.kind)) {
          errors.push(
            `${rot}: "kind" é "${corr.kind}". Só pode ser ${KINDS.map((k) => `"${k}"`).join(' ou ')}.\n` +
              `    "correcao" = o valor publicado estava errado. "atualizacao" = estava certo e o que mede mudou.\n` +
              `    "proveniencia" = o valor não mudou; mudou a maneira de lá chegar.`,
          );
        }
        if (corr.date && !/^\d{4}-\d{2}-\d{2}$/.test(String(corr.date))) {
          errors.push(`${rot}: "date" tem de ser AAAA-MM-DD.`);
        }
      });
    }

    /* 6b — as reconferências independentes.
       Opcional: uma linha sem entradas é uma linha que ainda não foi relida, e
       a página di-lo com o marcador. O que não é opcional é a forma de uma
       entrada que exista. */
    if (c.verifications !== null && c.verifications !== undefined) {
      if (!Array.isArray(c.verifications)) {
        errors.push(
          `${onde} "verifications" tem de ser uma lista (não escreva o campo quando não há ` +
            `nenhuma reconferência: uma lista vazia e campo nenhum dizem o mesmo).`,
        );
      } else {
        /* Uma linha sem endereço não tem o que reler. A derivada é reconferida
           pelo `check` a cada construção, e a da casa conta-se a si própria:
           uma entrada de releitura numa dessas prometia uma leitura de uma
           fonte que não existe. */
        if (c.verifications.length && ausente(c.source_url)) {
          errors.push(
            `${onde} tem "verifications" e não tem "source_url". Uma linha ${
              derivada ? 'derivada' : 'sem endereço'
            } não tem o que reler: a derivada é reconferida pelo "check" a cada construção, e ` +
              `a da casa conta-se a si própria.`,
          );
        }
        /* O dia da construção, em UTC. Uma reconferência no futuro é um
           estrago: ninguém releu ainda uma coisa que ainda não aconteceu. */
        const hoje = new Date().toISOString().slice(0, 10);
        const vistas = new Set();
        let anterior = null;
        c.verifications.forEach((v, n) => {
          const rot = `${onde} verificação #${n + 1}`;
          if (!v || typeof v !== 'object' || Array.isArray(v)) {
            errors.push(`${rot}: tem de ser um mapa com date, path, result e by.`);
            return;
          }
          const aceites =
            v.result === 'diverge' ? [...CAMPOS_VERIFICACAO, 'found'] : CAMPOS_VERIFICACAO;
          for (const k of Object.keys(v)) {
            if (!aceites.includes(k)) {
              errors.push(
                `${rot}: campo desconhecido "${k}". Aceites: ${aceites.join(', ')}` +
                  (k === 'found'
                    ? ' — "found" só existe numa entrada "diverge", onde é o valor como a fonte o imprimiu.'
                    : '.'),
              );
            }
          }
          for (const campo of CAMPOS_VERIFICACAO) {
            if (ausente(v[campo])) errors.push(`${rot}: falta "${campo}".`);
          }

          if (v.date !== null && v.date !== undefined) {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(String(v.date))) {
              errors.push(`${rot}: "date" tem de ser AAAA-MM-DD.`);
            } else {
              if (String(v.date) > hoje) {
                errors.push(
                  `${rot}: "date" é ${v.date} e a construção corre a ${hoje}. Uma reconferência ` +
                    `no futuro não aconteceu.`,
                );
              }
              if (/^\d{4}-\d{2}-\d{2}$/.test(String(c.access_date ?? '')) &&
                  String(v.date) < String(c.access_date)) {
                errors.push(
                  `${rot}: "date" é ${v.date} e a linha foi lida a ${c.access_date}. Uma ` +
                    `releitura é depois da leitura.`,
                );
              }
              if (anterior !== null && String(v.date) < anterior) {
                errors.push(
                  `${rot}: "date" é ${v.date} e a entrada anterior é de ${anterior}. A lista ` +
                    `está por ordem cronológica crescente, e a página mostra as duas últimas.`,
                );
              }
              anterior = String(v.date);
            }
          }

          if (!ausente(v.path) && !/^https?:\/\//.test(String(v.path))) {
            errors.push(
              `${rot}: "path" é "${v.path}". Tem de ser o endereço que foi lido nesse dia, a ` +
                `começar por "http://" ou "https://".`,
            );
          }

          if (!ausente(v.by) && !AUTORES_DA_VERIFICACAO.includes(v.by)) {
            errors.push(
              `${rot}: "by" é "${v.by}". Só pode ser ` +
                `${AUTORES_DA_VERIFICACAO.map((k) => `"${k}"`).join(', ')}.`,
            );
          }

          if (!ausente(v.result) && !RESULTADOS_DA_VERIFICACAO.includes(v.result)) {
            errors.push(
              `${rot}: "result" é "${v.result}". Só pode ser ` +
                `${RESULTADOS_DA_VERIFICACAO.map((k) => `"${k}"`).join(', ')}.\n` +
                `    "igual" = a fonte diz o mesmo. "diverge" = diz outra coisa, e "found" ` +
                `guarda-a. "inacessivel" = a fonte não respondeu nesse dia.`,
            );
          }
          if (v.result === 'diverge') {
            if (ausente(v.found)) {
              errors.push(
                `${rot}: "result" é "diverge" e falta "found" — o valor como a fonte o imprimiu ` +
                  `nesse dia. Uma divergência sem o valor que se encontrou não se pode conferir.`,
              );
            } else if (!/\d/.test(String(v.found))) {
              errors.push(
                `${rot}: "found" ("${v.found}") não contém nenhum algarismo. É um valor, não ` +
                  `uma descrição do que aconteceu.`,
              );
            }
          }

          /* A identidade é o quarteto. Duas releituras do mesmo endereço, no
             mesmo dia, pelo mesmo caminho e com o mesmo resultado são a mesma
             releitura escrita duas vezes, e inflam a contagem que a página
             publica. */
          const chave = [v.date, v.path, v.by, v.result].join(' ');
          if (vistas.has(chave)) {
            errors.push(
              `${rot}: repete a entrada de ${v.date} sobre "${String(v.path).slice(0, 60)}" ` +
                `(${v.by}, ${v.result}). A mesma releitura não se escreve duas vezes.`,
            );
          }
          vistas.add(chave);
        });
      }
    }

    // 7 — datas
    for (const campo of ['access_date', 'reference_date']) {
      const v = c[campo];
      if (v === null || v === undefined || v === POR_VERIFICAR) continue;
      if (!/^\d{4}(-\d{2}(-\d{2})?)?$/.test(String(v))) {
        errors.push(`${onde} "${campo}" = "${v}": use AAAA, AAAA-MM, AAAA-MM-DD ou "${POR_VERIFICAR}".`);
      }
    }

    // 8 — reavaliação da aritmética
    if (!ausente(c.check)) {
      const publicado = parsePtNumber(c.value);
      if (publicado === null) {
        errors.push(`${onde} tem "check" mas "value" ("${c.value}") não é um número simples.`);
      } else {
        try {
          const calculado = evaluateCheck(c.check, { claims, env, selfId: id });
          if (Math.abs(calculado - publicado) > 1e-9) {
            errors.push(
              `${onde} a aritmética não bate certo.\n` +
                `    check: ${c.check}\n` +
                `    calculado: ${calculado}\n` +
                `    publicado: ${c.value} (${publicado})`,
            );
          } else {
            verificadas++;
          }
        } catch (err) {
          errors.push(`${onde} "check" inválido: ${err.message}`);
        }
      }
    } else if (derivada) {
      warnings.push(
        `${onde} é derivada mas não traz uma expressão "check". A aritmética não é reavaliada no build.`,
      );
    }
  }

  return {
    errors,
    warnings,
    stats: {
      total: claims.size,
      derivadas,
      verificadas,
      porVerificar,
    },
  };
}

/** Todas as afirmações, ordenadas por id. */
export function allClaims() {
  return [...loadClaims().values()].sort((a, b) => String(a.id).localeCompare(String(b.id)));
}
