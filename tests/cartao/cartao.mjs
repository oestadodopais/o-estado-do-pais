#!/usr/bin/env node
/**
 * =============================================================================
 * A RÉGUA DO CARTÃO DE UMA MEDIDA · bloco P2, item 7 (15.09.2026)
 * =============================================================================
 *
 * O §1, item 1, do brief: «as cinco coisas, e só elas, em 100 % dos cartões
 * construídos das duas edições; "Publicado por", "Documento", "Lido na fonte a",
 * "Dados de" a 0 nos cartões (ficam no recibo); a chave a 0 no texto visível».
 *
 * É UM PORTÃO, e corre no `verify`: uma célula vermelha fecha a construção. O
 * que ele mede é o `dist/` construído, e não a declaração: a pergunta é o que a
 * página escreve, e a única maneira de a responder é ler o que ela escreveu.
 *
 * ---------------------------------------------------------------------------
 * AS CÉLULAS
 * ---------------------------------------------------------------------------
 * São treze, e o cabeçalho dizia oito enquanto o guião tinha doze (o mapa do
 * repositório apanhou-o a 21.09.2026). Ficam todas nomeadas: a K11, a K12 e a
 * K13 por baixo das nove que este bloco encontrou escritas.
 *   K1 · **as cinco coisas e só elas** · cada `[data-cartao-medida]` do `dist/`
 *        só tem, ao primeiro nível, os blocos permitidos: o nome, a linha do
 *        valor, a frase e a régua. Um bloco a mais é um campo de recibo a
 *        voltar, e é assim que ele volta: alguém acrescenta uma linha.
 *   K2 · **os rótulos do recibo a 0** · nenhum cartão escreve «Publicado por»,
 *        «Documento», «Lido na fonte a» ou «Dados de», nem os ingleses. As
 *        cadeias saem de `strings.mjs` e não de uma lista escrita aqui: um
 *        rótulo que mude de palavra continuaria a ser procurado.
 *   K3 · **a chave a 0** · nenhum cartão escreve o identificador da linha no
 *        texto visível. Procura-se o id de CADA cartão dentro do próprio cartão,
 *        e não uma expressão que se pareça com um id.
 *   K4 · **cada nome noutra língua diz em que língua está** · o item 4 do brief
 *        pedia «zero cadeias em inglês nos cartões da edição portuguesa», e esta
 *        célula mediu-o assim até 15.09.2026 à noite. **A decisão do lugar de
 *        direção sobre as capturas mudou a regra**: nenhum cartão fica sem nome,
 *        e onde não há nome do projeto nem nome oficial confirmado o cartão mostra
 *        o título que a fonte dá à medida, na língua da fonte e com a marca
 *        `lang`. A célula passa a medir o que a I91 sempre mandou e o que a regra
 *        nova precisa: **o nome de um cartão carrega a língua que as tabelas
 *        declaram para ele**, nem a mais nem a menos. Um nome estrangeiro sem
 *        marca lê-se com a fonética errada; um nome português com marca de
 *        português dentro de uma página portuguesa é ruído para quem ouve.
 *
 *        A pergunta responde-se do TEXTO RENDIDO e das tabelas
 *        (`src/i18n/lingua-dos-titulos.mjs`), e não da função que compõe o nome:
 *        a régua não confirma a função, confere o ficheiro.
 *   K5 · **a régua só com linhas** · cada valor da régua é um `data-claim`, e
 *        cada algarismo que não seja uma linha traz o seu motivo declarado
 *        (`data-nonledger`). Um número escrito à mão na régua não passa.
 *   K6 · **a frase é a declarada** · o texto de `[data-cartao-definicao]` é,
 *        carácter a carácter, `textoDaDefinicao()` da declaração daquela medida
 *        naquela edição. É a mesma conferência que `check:lugar` faz à definição
 *        da página europeia, aplicada onde ela agora também se rende.
 *   K7 · **«limiar» a 0 nos cartões** · a palavra saiu do texto que o leitor vê
 *        (decisão do diretor de 15.09.2026 de manhã), e o cartão é a superfície
 *        deste bloco. Nas duas edições, com «threshold».
 *   K8 · **a legenda da marca e a linha do tipo** · «Governo Constitucional» uma
 *        vez por edição (o índice das áreas), e a legenda da marca fora das
 *        páginas de área.
 *   K10 · **uma marca da fonte por cartão, e a porta que ela abre paga as
 *        outras** · decisão do lugar de direção de 15.09.2026 sobre as capturas:
 *        o cartão tem UMA marca, e os valores da régua não levam marca própria.
 *        Esta célula confere as duas metades: que nenhum cartão tem mais do que
 *        uma marca, e que o recibo da medida lista mesmo, no bloco «O
 *        enquadramento», cada linha que a régua do cartão cita.
 *
 *        **É esta célula que promete a porta, e não o portão de HTML**, e a razão
 *        mediu-se: o `auditaSelo()` do portão já não corre nas páginas de área,
 *        porque a guarda `paginaDoLivro` inclui a rota `area` desde 28.08.2026.
 *        Lá o portão confere cada CAMPO contra a linha, que é mais conferência e
 *        não menos, e a do selo é a que não corre. Sem esta célula, um valor de
 *        régua podia ficar sem porta nenhuma e nada o dizia.
 *   K9 · **o valor de referência tem duas testemunhas, e elas batem certo** · o
 *        algarismo que o cartão desenha vem da declaração de `figuras.mjs`, com o
 *        motivo do registo; o motor lê o mesmo valor na página do painel da
 *        Comissão e escreve-o em `referencias.json`, com a frase verbatim de onde
 *        o leu. São dois registos independentes do mesmo facto, e esta célula
 *        compara-os: os números e o sentido. Um facto com duas origens que não
 *        batem certo é um facto por confirmar, e o cartão não o desenha sem
 *        alguém olhar.
 *   K11 · **um cartão sem nome não é um cartão** · o nome é a primeira das cinco
 *        coisas, e a chave da linha não vale por nome no texto de uma linha sem
 *        nome.
 *   K12 · **o período anterior é a observação anterior da mesma série** · a
 *        régua não emparelha duas linhas que declarem edições ou unidades
 *        diferentes do documento.
 *   K13 · **o grupo etário da linha está escrito na definição** · quando a
 *        linha de uma medida fixa um grupo de idades — a etiqueta `Age class`
 *        no excerto ou o filtro `age=` no endereço do pedido —, a definição das
 *        duas edições escreve-o COMO INTERVALO. Entrou pela I129: o título do
 *        quadro do Eurostat diz «aged 15-24», a série é dos 15 aos 29, e a
 *        definição dizia «um grupo de idades e sexo» sem dizer qual. Não lê
 *        `dist/`: compara a declaração com a linha, que é onde o defeito vive.
 *
 *        **A leitura a frio de 22.09.2026 (achados 6 e 7) mudou-lhe três
 *        coisas**, e as três eram buracos: corre sobre AS LINHAS e não sobre as
 *        definições, para que uma linha sem definição nenhuma deixe de ser
 *        invisível; quando a etiqueta do excerto e o filtro do pedido existem
 *        os dois, COMPARA-OS, porque são dois registos do mesmo facto e um
 *        excerto errado com uma definição igualmente errada passava; e exige o
 *        intervalo escrito como intervalo, porque «os dois algarismos em
 *        qualquer sítio da frase» deixava passar «entre 15 concelhos e 29
 *        freguesias». A catraca está vazia e a asserção de que está vazia corre
 *        em TODA a corrida, não só na prova: uma dívida nova fecha a construção
 *        no acto de ser declarada, que é o único sítio onde alguém a lê.
 *
 *   K14 · **a média europeia calada onde uma decisão a cala** · (bloco R1,
 *        23.09.2026, I138) o cartão da sobrecarga do custo da habitação punha a
 *        média da União ao lado do valor português, e sem a ressalva da Comissão
 *        sobre o regime de ocupação a comparação lê-se ao contrário. A §1.124
 *        mandou calá-la no cartão até o B2 mostrar a medida por regime de
 *        ocupação. Esta célula é a catraca: conhece a medida PELO NOME, escrita
 *        aqui e não importada, e exige três coisas. Nenhum cartão dela rende o
 *        item da União; a declaração de `figuras.mjs` cala exactamente as medidas
 *        desta lista, nem mais nem menos, para que um silêncio novo também
 *        precise de uma decisão; e a linha da União continua no livro-razão, para
 *        que o silêncio seja uma escolha e não uma ausência. O positivo
 *        conhecido: pelo menos um cartão da medida visto no `dist/`.
 *
 * ---------------------------------------------------------------------------
 * O POSITIVO CONHECIDO, E PORQUE ELE É METADE DA RÉGUA
 * ---------------------------------------------------------------------------
 * Um zero só conta depois de a régua ter visto um vermelho. `--prova` monta um
 * `dist/` de mentira com cinco estragos plantados, um por célula que pode
 * morder sobre HTML, e exige que as cinco mordam. Sem isto, uma régua que
 * procurasse a classe errada dizia «0 defeitos» para sempre.
 *
 * AS LINHAS DO ENQUADRAMENTO PROVAM-SE COM LINHAS VERDADEIRAS, e nunca com uma
 * linha falsa: a K5 pergunta a `reguaDaMedida()` por uma medida cuja linha do
 * período anterior NÃO existe (e exige `null`), e prova a outra metade com uma
 * linha que EXISTE, que é a própria linha da medida. É o que o §0.2 do brief
 * manda: «nunca escrevas um valor à mão, nem um valor de exemplo, nem uma linha
 * falsa para testar: testa com as linhas que já existem e com a ausência».
 *
 * Uso:  node tests/cartao/cartao.mjs [--prova] [--json]
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

import { t } from '../../src/i18n/strings.mjs';
import { DEFINICOES_DAS_MEDIDAS, textoDaDefinicao } from '../../src/data/figuras.mjs';
import {
  chavesDoEnquadramento,
  reguaDaMedida,
  mesmaSerie,
  ficheirosDoMotor,
  valorDeReferenciaDoMotor,
  nomeOficial,
} from '../../src/lib/enquadramento.mjs';
import { FIGURAS, ladosDoLimiar } from '../../src/data/figuras.mjs';
import { MEDIDAS_DO_DOMINIO_1 } from '../../src/data/dominios.mjs';
/* AS TABELAS DAS LÍNGUAS, e não a função que compõe o nome: a pergunta desta
   régua é «o texto que a página escreveu diz a língua em que está?», e quem sabe
   a língua de uma cadeia é a tabela onde ela está declarada. */
import {
  linguaDoRotuloDaFonte,
  linguaDoTituloDoDocumento,
} from '../../src/i18n/lingua-dos-titulos.mjs';
import { hasClaim, loadClaims } from '../../src/lib/ledger.mjs';

/**
 * K14 · AS MEDIDAS CUJA MÉDIA EUROPEIA O CARTÃO CALA, e a decisão que o manda.
 * Escrita aqui e não lida da declaração: uma régua que lesse a lista da coisa
 * que mede não media nada. Tirar uma medida daqui, ou pôr outra, é uma decisão
 * escrita em `DECISIONS.md`, e é por isso que a razão vai ao lado.
 * @type {Map<string, string>}
 */
const MEDIA_EUROPEIA_CALADA = new Map([
  [
    'sobrecarga-do-custo-da-habitacao-2025',
    '§1.124 (23.09.2026): a Comissão adverte que a sobrecarga só se lê ao lado do regime de ' +
      'ocupação; a média da União volta ao cartão com a medida por regime de ocupação, no B2',
  ],
]);

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const argv = process.argv.slice(2);
const PROVA = argv.includes('--prova');
const JSON_SAIDA = argv.includes('--json');

const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

/** O bloco de um cartão: a classe de cada peça permitida, e nada mais. */
const PECAS_PERMITIDAS = new Set([
  'cartao-medida-nome',
  'cartao-medida-valor',
  'cartao-medida-frase',
  'cartao-medida-regua',
]);

/**
 * Os rótulos de recibo que um cartão não pode escrever, nas duas edições.
 *
 * SAEM DE `strings.mjs`, e não de uma lista escrita aqui: se um rótulo mudar de
 * palavra, esta régua procura a palavra nova. Uma lista literal continuaria a
 * procurar a antiga e diria zero para sempre.
 */
function rotulosDoRecibo() {
  /** @type {{ lang: 'pt'|'en', texto: string, chave: string }[]} */
  const fora = [];
  for (const lang of /** @type {const} */ (['pt', 'en'])) {
    const s = t(lang);
    for (const chave of ['fonte', 'documento', 'lido', 'referencia', 'edicao']) {
      const texto = s.prov[chave];
      if (typeof texto === 'string' && texto.trim() !== '') fora.push({ lang, texto, chave });
    }
  }
  return fora;
}

/** A palavra que saiu do texto do leitor, nas duas edições. */
const PALAVRA_RETIRADA = { pt: 'limiar', en: 'threshold' };

/**
 * A COPIA DO QUE SE VÊ.
 *
 * O que só um leitor de ecrã ouve não é texto à vista, e esta régua mede o que
 * se vê: a classe `vh` é a da casa para isso e `aria-hidden` é o contrário. A
 * distinção não é decorativa aqui: a marca da fonte leva o nome do publicador
 * num `.vh` (`<span class="vh"> · <span lang="en">Eurostat</span></span>`), e
 * sem esta poda a K4 acusava «Eurostat» como inglês à vista em cada cartão
 * português. O nome de um organismo estrangeiro dito a um leitor de ecrã, com a
 * marca da língua dele, é exactamente o que a I91 manda fazer.
 *
 * @param {import('node-html-parser').HTMLElement} el
 */
function soOQueSeVe(el) {
  const copia = parse(el.outerHTML);
  for (const escondido of copia.querySelectorAll('.vh, [aria-hidden="true"]')) escondido.remove();
  return copia;
}

/** @param {import('node-html-parser').HTMLElement} el */
function textoVisivel(el) {
  return soOQueSeVe(el).text.replace(/\s+/g, ' ').trim();
}

/**
 * Os números de um valor de referência, com sinal, e o sentido dele.
 *
 * Lê as duas formas: a cadeia que o motor copia da página da Comissão («60%»,
 * «-35%», «-4/+6%», «+/-3% (EA)», «-0.2pp») e a declaração estruturada de
 * `figuras.mjs`. Devolve os números por ordem crescente, para que a comparação
 * não dependa de qual das duas escreveu primeiro o lado de baixo.
 *
 * `+/-n` E `-/+n` SÃO DUAS PONTAS E NÃO UMA, e é o caso do câmbio efetivo real:
 * uma expressão regular de números lê «+/-3» como um número só, e a comparação
 * dizia que a declaração tem dois lados e o motor um. Expandem-se antes de ler.
 *
 * @param {string} cru
 * @returns {number[]}
 */
function numerosDoValorDeReferencia(cru) {
  const normal = String(cru)
    .replace(/−/g, '-')
    .replace(/([+]\/[-]|[-]\/[+])\s*(\d+(?:[.,]\d+)?)/g, '-$2/+$2');
  const achados = normal.match(/[+-]?\d+(?:[.,]\d+)?/g) ?? [];
  return achados
    .map((s) => Number(s.replace(/,/g, '.')))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);
}

/**
 * Os números da declaração de `figuras.mjs`, pela mesma forma.
 *
 * @param {ReturnType<typeof ladosDoLimiar>} lados
 * @returns {number[]}
 */
function numerosDaDeclaracao(lados) {
  if (!lados) return [];
  return [lados.inferior, lados.superior]
    .filter((x) => typeof x === 'string' && x !== '')
    .map((x) => Number(String(x).replace(/−/g, '-').replace(/,/g, '.')))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);
}

/**
 * A célula K9, escrita à parte para o `--prova` a poder exercer com um par que
 * NÃO bate certo. Não se planta um estrago num ficheiro de dados do motor: o que
 * se prova é a comparação, com dois valores escritos aqui.
 *
 * @param {string} id
 * @param {{ limiar: string, sentido: string }|null} doMotor
 * @param {ReturnType<typeof ladosDoLimiar>} lados
 * @param {boolean} banda
 * @returns {string|null}  a queixa, ou `null` quando batem certo
 */
export function compararAsDuasTestemunhas(id, doMotor, lados, banda) {
  if (!doMotor) return null;
  const a = numerosDoValorDeReferencia(doMotor.limiar);
  const b = numerosDaDeclaracao(lados);
  if (a.length !== b.length || a.some((n, i) => n !== b[i])) {
    return (
      `K9 · ${id}: o valor de referência tem duas testemunhas e elas não batem certo. ` +
      `A declaração de figuras.mjs diz [${b.join(', ')}] e o motor leu «${doMotor.limiar}» ` +
      `na página do painel, que dá [${a.join(', ')}]`
    );
  }
  const sentidoDeclarado = banda ? 'intervalo' : lados?.inferior ? 'inferior' : 'superior';
  if (doMotor.sentido && doMotor.sentido !== sentidoDeclarado) {
    return (
      `K9 · ${id}: o sentido do valor de referência tem duas testemunhas e elas não batem ` +
      `certo. A declaração de figuras.mjs diz «${sentidoDeclarado}» e o motor diz ` +
      `«${doMotor.sentido}»`
    );
  }
  return null;
}

/**
 * Percorre o `dist/` e mede.
 *
 * @param {string} dist
 */
function corre(dist) {
  /** @type {string[]} */
  const erros = [];
  /* Os pares «este cartão cita esta linha na régua», recolhidos enquanto se
     percorrem os cartões e conferidos no fim contra os recibos: é a metade que o
     portão de HTML não pode ver, porque ele lê uma página de cada vez. */
  /** @type {{ rota: string, cartao: string, linha: string, lang: string }[]} */
  const enquadradas = [];
  /** @type {Map<string, Set<string>>} */
  const recibos = new Map();
  const contas = {
    paginas: 0,
    cartoes: 0,
    cartoes_pt: 0,
    cartoes_en: 0,
    com_nome: 0,
    com_frase: 0,
    com_regua: 0,
    sem_nome: 0,
    /* AS LINHAS QUE NÃO SE RENDEM COMO CARTÃO (achado 3, 15.09.2026): as que não
       têm nome em degrau nenhum rendem-se como linha do livro-razão, com a sua
       aritmética. Contam-se para que o número esteja no relatório e não numa
       memória. */
    linhas_sem_nome: 0,
    linhas_sem_nome_com_conta: 0,
    /* A RÉGUA DO PERÍODO ANTERIOR, CONFERIDA PAR A PAR (achado 11). */
    regua_periodo_anterior: 0,
    /* O GRUPO ETÁRIO DA LINHA NA DEFINIÇÃO (K13, I129, 22.09.2026). */
    medidas_com_grupo_etario: 0,
    linhas_com_grupo_etario: 0,
    medidas_na_catraca_do_grupo_etario: 0,
    governo_constitucional_pt: 0,
    governo_constitucional_en: 0,
    legenda_da_marca: 0,
    unidade_noutra_lingua: 0,
    marcador_em_portugues: 0,
    nome_noutra_lingua: 0,
    valores_de_regua_sem_marca: 0,
    /* K14, bloco R1: os cartões de uma medida cuja média europeia está calada. */
    cartoes_com_media_calada: 0,
  };
  const rotulos = rotulosDoRecibo();

  /** @param {string} dir */
  const anda = (dir) => {
    for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
      const f = path.join(dir, entrada.name);
      if (entrada.isDirectory()) {
        anda(f);
        continue;
      }
      if (!entrada.name.endsWith('.html')) continue;
      const rota = `/${path.relative(dist, f).replace(/index\.html$/, '').replace(/\\/g, '/')}`;
      const root = parse(fs.readFileSync(f, 'utf8'));
      contas.paginas++;

      /* A LÍNGUA DA PÁGINA sai do `<html lang>`, que é onde o sítio a declara. */
      const langPagina = (root.querySelector('html')?.getAttribute('lang') ?? 'pt').startsWith('en')
        ? 'en'
        : 'pt';

      /* K8 · a linha do tipo e a legenda da marca. */
      const texto = root.text;
      if (texto.includes('Governo Constitucional')) contas.governo_constitucional_pt++;
      if (texto.includes('Constitutional Government')) contas.governo_constitucional_en++;
      if (root.querySelector('.marca-legenda')) {
        contas.legenda_da_marca++;
        if (rota.includes('/areas/') || rota.includes('/en/areas/')) {
          erros.push(`K8 · ${rota}: a legenda da marca da fonte continua numa página de área`);
        }
      }

      /* O RECIBO DE UMA LINHA, e o que o bloco «O enquadramento» dele lista.
         A chave é a rota, que é única por linha e por edição. */
      const bloco = root.querySelector('#enquadramento');
      if (bloco) {
        const citadas = new Set();
        for (const v of bloco.querySelectorAll('[data-claim]')) {
          const x = v.getAttribute('data-claim');
          if (x) citadas.add(x);
        }
        recibos.set(rota.replace(/\/$/, ''), citadas);
      }

      /* AS LINHAS QUE NÃO SE RENDEM COMO CARTÃO (achado 3, 15.09.2026). Contam-se
         e conferem-se: nenhuma delas pode escrever um rótulo de recibo nem a
         chave da linha, que são as mesmas duas proibições do cartão. */
      for (const linha of root.querySelectorAll('[data-linha-sem-nome]')) {
        const id = linha.getAttribute('data-linha-sem-nome') ?? '';
        contas.linhas_sem_nome++;
        if (linha.querySelector('.linha-sem-nome-conta')) contas.linhas_sem_nome_com_conta++;
        const vista = soOQueSeVe(linha);
        const visivel = vista.text.replace(/\s+/g, ' ').trim();
        for (const r of rotulos) {
          if (visivel.includes(r.texto)) {
            erros.push(
              `K11 · ${rota} · ${id}: a linha sem nome escreve o rótulo de recibo «${r.texto}»`,
            );
          }
        }
        if (id && visivel.includes(id)) {
          erros.push(`K11 · ${rota} · ${id}: a chave da linha está no texto visível`);
        }
      }

      for (const cartao of root.querySelectorAll('[data-cartao-medida]')) {
        const id = cartao.getAttribute('data-cartao-medida') ?? '';
        contas.cartoes++;
        contas[langPagina === 'en' ? 'cartoes_en' : 'cartoes_pt']++;

        /* ------------------------------------------------------------ K1 */
        /** @type {string[]} */
        const classes = [];
        for (const filho of cartao.childNodes) {
          const el = /** @type {any} */ (filho);
          if (!el.tagName) continue;
          const classe = (el.getAttribute?.('class') ?? '').split(/\s+/).filter(Boolean);
          const conhecida = classe.find((c) => PECAS_PERMITIDAS.has(c));
          if (!conhecida) {
            erros.push(
              `K1 · ${rota} · ${id}: o cartão tem um bloco que não é uma das cinco coisas ` +
                `(<${String(el.tagName).toLowerCase()} class="${classe.join(' ')}">)`,
            );
            continue;
          }
          classes.push(conhecida);
        }
        if (classes.includes('cartao-medida-nome')) contas.com_nome++;
        else contas.sem_nome++;
        if (classes.includes('cartao-medida-frase')) contas.com_frase++;
        if (classes.includes('cartao-medida-regua')) contas.com_regua++;
        if (!classes.includes('cartao-medida-valor')) {
          erros.push(`K1 · ${rota} · ${id}: o cartão não tem a linha do valor`);
        }
        /* ----------------------------------------------------------- K11 */
        /* UM CARTÃO SEM NOME FECHA A CONSTRUÇÃO (achado 3 da leitura a frio de
           15.09.2026: «The card gate can pass cards missing mandatory content,
           and it did … only raises an error when the value line is absent»). O
           nome é a primeira das cinco coisas, e uma régua que o conta e não o
           exige está a contar o defeito em vez de o fechar.

           O QUE UMA LINHA SEM NOME FAZ, em vez disto, é não se render como
           cartão: rende-se como linha do livro-razão, com a sua aritmética
           (`data-linha-sem-nome`), e essas contam-se noutro sítio. */
        if (!classes.includes('cartao-medida-nome')) {
          erros.push(
            `K11 · ${rota} · ${id}: o cartão rende-se sem nome. O nome é a primeira das cinco ` +
              `coisas; uma linha sem nome em degrau nenhum rende-se como linha do livro-razão, ` +
              `com a sua aritmética, e não como cartão`,
          );
        }

        const vista = soOQueSeVe(cartao);
        const visivel = vista.text.replace(/\s+/g, ' ').trim();

        /* B1, correção de 22.09: a primeira coisa do cartão é o nome da sua
           declaração. K1 só contava a classe; K2 só recusava rótulos de recibo.
           Lemos a tabela do domínio, sem chamar a função que escreve o nome. */
        const declaracao = MEDIDAS_DO_DOMINIO_1.find(m => m.claim === id);
        const titulo = vista.querySelector('.cartao-medida-nome');
        if (declaracao && titulo && titulo.text.replace(/\s+/g, ' ').trim() !== declaracao.nome[langPagina]) {
          erros.push(`K1 · ${rota} · ${id}: o nome do cartão difere da declaração: «${titulo.text.trim()}»; esperado «${declaracao.nome[langPagina]}»`);
        }

        /* ------------------------------------------------------------ K2 */
        for (const r of rotulos) {
          if (visivel.includes(r.texto)) {
            erros.push(
              `K2 · ${rota} · ${id}: o cartão escreve o rótulo de recibo «${r.texto}» ` +
                `(prov.${r.chave}, edição ${r.lang})`,
            );
          }
        }

        /* ------------------------------------------------------------ K3 */
        if (id && visivel.includes(id)) {
          erros.push(`K3 · ${rota} · ${id}: a chave da linha está no texto visível do cartão`);
        }

        /* ------------------------------------------------------------ K4 */
        const nomeEl = vista.querySelector('.cartao-medida-nome');
        if (nomeEl) {
          const texto = nomeEl.text.replace(/\s+/g, ' ').trim();
          const marcada = nomeEl.getAttribute('lang') ?? null;
          /* O NOME OFICIAL É PORTUGUÊS NAS DUAS EDIÇÕES, e as tabelas dos títulos
             não o conhecem porque ele não é um título nem um rótulo: vem do
             ficheiro do motor. A marca esperada sai da mesma regra de sempre, a
             língua do texto contra a língua da página. */
          const esperada =
            nomeEl.getAttribute('data-nome') === 'oficial'
              ? langPagina === 'en'
                ? 'pt-PT'
                : null
              : linguaDoRotuloDaFonte(texto, langPagina) ??
                linguaDoTituloDoDocumento(texto, langPagina);
          if ((esperada ?? null) !== (marcada ?? null)) {
            erros.push(
              `K4 · ${rota} · ${id}: o nome do cartão rende-se com lang=«${marcada ?? '(nenhum)'}» ` +
                `e as tabelas dizem «${esperada ?? '(nenhum)'}»: «${texto.slice(0, 60)}»`,
            );
          }
          if (esperada) contas.nome_noutra_lingua++;
        }
        /* A unidade e o marcador ficam contados, porque as duas são exceções
           declaradas que o relatório do bloco nomeia: a unidade pela I92 («uma
           unidade em português numa página inglesa é honesta») e o marcador pela
           `IDENTIDADE.md` §6 («[a verificar]» fica em português nas duas
           edições). Nenhuma das duas é um defeito, e por isso nenhuma delas dá
           vermelho: o que elas dão é um número no relatório. */
        for (const comLingua of vista.querySelectorAll('[lang]')) {
          const curta = (comLingua.getAttribute('lang') ?? '').toLowerCase().split('-')[0];
          if (!curta || curta === langPagina) continue;
          const classes2 = (comLingua.getAttribute('class') ?? '').split(/\s+/);
          if (classes2.includes('cartao-medida-unidade')) contas.unidade_noutra_lingua++;
          else if (classes2.includes('marcador') || classes2.includes('marcador-gloss')) {
            contas.marcador_em_portugues++;
          }
        }

        /* ------------------------------------------------------------ K5 */
        const regua = cartao.querySelector('.cartao-medida-regua');
        if (regua) {
          for (const n of regua.querySelectorAll('*')) {
            const t2 = n.childNodes
              .filter((x) => x.nodeType === 3)
              .map((x) => x.rawText)
              .join('');
            if (!/\d/.test(t2)) continue;
            if (n.hasAttribute('data-claim') || n.hasAttribute('data-nonledger')) continue;
            erros.push(
              `K5 · ${rota} · ${id}: a régua escreve um algarismo sem linha e sem motivo ` +
                `declarado: «${t2.trim().slice(0, 40)}»`,
            );
          }
        }

        /* ------------------------------------------------------------ K6 */
        const frase = cartao.querySelector('[data-cartao-definicao]');
        if (frase) {
          const daLinha = frase.getAttribute('data-cartao-definicao') ?? '';
          const d = /** @type {any} */ (DEFINICOES_DAS_MEDIDAS)[daLinha];
          if (!d) {
            erros.push(`K6 · ${rota} · ${id}: a frase diz ser de «${daLinha}», que não tem definição declarada`);
          } else {
            const partes = d[langPagina] ?? d.pt;
            const declarada = textoDaDefinicao(partes).replace(/\s+/g, ' ').trim();
            /* B1, peça 3: os temas passam a render as definições com marcador.
               A glosa inglesa e a definição da primeira ocorrência já são
               parte de Frase. Conferem-se antes de separar a frase da medida;
               uma classe sozinha nunca dispensa texto desta comparação. */
            const copia = soOQueSeVe(frase);
            const glosas = copia.querySelectorAll('.marcador-gloss');
            const previstas = langPagina === 'pt' ? [] : partes
              .filter((p) => typeof p !== 'string' && p.marcador && p.gloss)
              .map((p) => `(${p.gloss})`);
            if (JSON.stringify(glosas.map(textoVisivel)) !== JSON.stringify(previstas))
              erros.push(`K6 · ${rota} · ${id}: a glosa do marcador difere da declaração`);
            const avisos = copia.querySelectorAll('.marcador-definicao');
            if (avisos.length > 1 || avisos.some((n) => textoVisivel(n) !== `· ${t(langPagina).marcador.definicao}`))
              erros.push(`K6 · ${rota} · ${id}: a definição do marcador difere da declaração`);
            [...glosas, ...avisos].forEach((n) => n.remove());
            const rendida = copia.text.replace(/\s+/g, ' ').trim();
            if (rendida !== declarada) {
              erros.push(
                `K6 · ${rota} · ${id}: a frase do cartão diz «${rendida.slice(0, 50)}…» e a ` +
                  `declaração diz «${declarada.slice(0, 50)}…»`,
              );
            }
          }
        }

        /* ----------------------------------------------------------- K10 */
        const marcas = vista.querySelectorAll('.src-chip').length;
        if (marcas !== 1) {
          erros.push(
            `K10 · ${rota} · ${id}: o cartão tem ${marcas} marca(s) da fonte, e a decisão de ` +
              `15.09.2026 diz uma`,
          );
        }
        for (const item of cartao.querySelectorAll('[data-selo-em]')) {
          const doCartao = item.getAttribute('data-selo-em');
          if (doCartao !== id) {
            erros.push(
              `K10 · ${rota} · ${id}: um item da régua diz enquadrar «${doCartao}» e está no ` +
                `cartão de «${id}»`,
            );
            continue;
          }
          for (const v of item.querySelectorAll('[data-claim]')) {
            const daRegua = v.getAttribute('data-claim');
            if (daRegua) enquadradas.push({ rota, cartao: id, linha: daRegua, lang: langPagina });
          }
        }

        /* ----------------------------------------------------------- K12 */
        /* O PERÍODO ANTERIOR É A OBSERVAÇÃO ANTERIOR DA MESMA SÉRIE (achado 11
           da leitura a frio de 15.09.2026: «Nothing verifies that a selected
           "previous period" row is the previous observation of the same series
           and unit»). A escolha faz-se em `src/lib/enquadramento.mjs`, por
           `mesmaSerie()`; o que esta célula confere é que o que está NA PÁGINA
           obedece à regra, que é a única maneira de a promessa valer sobre o
           `dist/` e não sobre a intenção do código. */
        for (const item of cartao.querySelectorAll('[data-regua="anterior"]')) {
          contas.regua_periodo_anterior++;
          const v = item.querySelector('[data-claim]');
          const anterior = v?.getAttribute('data-claim') ?? null;
          if (!anterior) {
            erros.push(`K12 · ${rota} · ${id}: o item do período anterior não cita linha nenhuma`);
            continue;
          }
          if (!mesmaSerie(id, anterior)) {
            erros.push(
              `K12 · ${rota} · ${id}: a régua rende «${anterior}» como período anterior, e as duas ` +
                `linhas não declaram a mesma edição do documento e a mesma unidade`,
            );
          }
        }

        /* ----------------------------------------------------------- K14 */
        if (MEDIA_EUROPEIA_CALADA.has(id)) {
          contas.cartoes_com_media_calada++;
          const daUniao = cartao.querySelectorAll('[data-regua="ue"]').length +
            cartao.querySelectorAll(`[data-claim="${id}-ue"]`).length;
          if (daUniao > 0) {
            erros.push(
              `K14 · ${rota} · ${id}: o cartão rende a média europeia, e a decisão que a cala ainda ` +
                `vale: ${MEDIA_EUROPEIA_CALADA.get(id)}`,
            );
          }
        }

        /* ------------------------------------------------------------ K7 */
        const palavra = PALAVRA_RETIRADA[langPagina];
        if (visivel.toLowerCase().includes(palavra)) {
          erros.push(`K7 · ${rota} · ${id}: o cartão escreve «${palavra}», que saiu do texto do leitor`);
        }
      }
    }
  };
  anda(dist);

  /* ------------------------------------------------------------------- K10 */
  /* Cada linha que a régua de um cartão cita tem de estar no bloco «O
     enquadramento» do recibo da medida daquele cartão. É a porta que a marca
     única do cartão paga. */
  for (const e of enquadradas) {
    const recibo = e.lang === 'en' ? `/en/ledger/${e.cartao}` : `/livro-razao/${e.cartao}`;
    const citadas = recibos.get(recibo);
    if (!citadas) {
      erros.push(
        `K10 · ${e.rota} · ${e.cartao}: a régua cita «${e.linha}» sem marca própria, e o recibo ` +
          `«${recibo}» não tem bloco «O enquadramento» nenhum`,
      );
      continue;
    }
    if (!citadas.has(e.linha)) {
      erros.push(
        `K10 · ${e.rota} · ${e.cartao}: a régua cita «${e.linha}» sem marca própria, e o recibo ` +
          `«${recibo}» não a lista: o valor fica sem porta para a sua linha`,
      );
    }
  }
  contas.valores_de_regua_sem_marca = enquadradas.length;

  /* ------------------------------------------------------------------- K13 */
  /* Não lê `dist/`: compara a declaração da definição com a linha do
     livro-razão. Corre aqui para que uma célula vermelha feche a construção
     pelo mesmo caminho das outras. */
  const k13 = celulaK13();
  erros.push(...k13.erros);
  contas.medidas_com_grupo_etario = k13.medidas;
  contas.linhas_com_grupo_etario = k13.linhas;
  contas.medidas_na_catraca_do_grupo_etario = CATRACA_DO_GRUPO_ETARIO.size;

  return { erros, contas };
}

/* =========================================================================
 * K13 · O GRUPO ETÁRIO DA LINHA ESTÁ ESCRITO NA DEFINIÇÃO
 * =========================================================================
 * A I129: o título que o catálogo do Eurostat dá a `tipslm90` diz «aged 15-24»
 * e a dimensão `age` da resposta ao pedido da linha diz «From 15 to 29 years».
 * O recibo mostrava a primeira coisa ao lado de um valor da segunda, e a
 * definição da medida falava de «um grupo de idades e sexo» sem dizer qual.
 * Nenhum valor estava errado: o que faltava era a linha dizer de quem é o
 * número, e uma definição que não o diz deixa o leitor a supor.
 *
 * O QUE A CÉLULA MEDE. Para cada medida com definição declarada cuja LINHA
 * fixa um grupo de idades — a etiqueta `Age class: From X to Y years` no
 * excerto, ou um filtro `age=` no `source_url` —, a definição das DUAS edições
 * escreve os dois limites desse grupo. Os limites saem da linha e não desta
 * régua: o que aqui está escrito é a expressão que os lê.
 *
 * A CATRACA, DECLARADA, DATADA E VAZIA. Na primeira passagem de 22.09.2026 a
 * célula media quatro medidas e três falhavam, com o mesmo defeito da I129 e
 * não com outro: `taxa-de-emprego` (20-64) e as duas de `taxa-de-desemprego`
 * (15-74). Ficaram NOMEADAS aqui enquanto o excerto das linhas delas não trazia
 * a etiqueta da idade, porque escrever os limites na definição sem os ter na
 * linha era publicar uma frase que o recibo ao lado não mostra. **Na segunda
 * passagem do mesmo dia as três pagaram-se** (a I132): nove linhas reescritas
 * pelo gerador do motor, as três definições com os limites, e a lista ficou
 * vazia. **Fica, e não sai**: é ela que faz a regra ser «todas as medidas»
 * em vez de «as medidas que alguém se lembrou», e as suas duas plantas mordem
 * na mesma. A lista só encolhe, e por isso está vazia: uma medida que falhe e
 * não esteja nela é vermelho, e uma medida que esteja nela e PASSE também é
 * vermelho, para que a dívida não apodreça depois de paga.
 */
const CATRACA_DO_GRUPO_ETARIO = /** @type {Map<string, string>} */ (new Map([]));

/* AS FORMAS EM QUE UM INTERVALO SE ESCREVE, por edição (achado 6 da leitura a
   frio de 22.09.2026). Antes bastava que os dois algarismos aparecessem em
   qualquer sítio da frase, e «entre 15 pessoas e 29 empresas» passava: dois
   números soltos não são um grupo etário. O que a definição tem de escrever é o
   INTERVALO, e estas são as formas que a casa aceita. Uma forma nova
   acrescenta-se aqui, à vista, e não se descobre por uma expressão frouxa. */
const FORMAS_DO_INTERVALO = {
  pt: (a, b) => [
    new RegExp(`\\bdos\\s+${a}\\s+aos\\s+${b}\\s+anos\\b`),
    new RegExp(`\\bentre\\s+os\\s+${a}\\s+e\\s+os\\s+${b}\\s+anos\\b`),
  ],
  en: (a, b) => [
    new RegExp(`\\baged\\s+${a}\\s+to\\s+${b}\\b`),
    new RegExp(`\\bbetween\\s+${a}\\s+and\\s+${b}\\b`),
  ],
};

/** O identificador da medida a que uma linha pertence: sem período e sem `-ue`. */
const familiaDaLinha = (id) => id.replace(/-ue$/, '').replace(/-\d{4}(-\d{2})?$/, '');

/**
 * O grupo de idades que uma linha fixa, pelas DUAS vias, e a discordância entre
 * elas se houver. A leitura a frio: «it accepts the excerpt first and never
 * compares the two; a wrong excerpt plus a matching wrong definition can
 * therefore pass despite a contradictory request». As duas vias são dois
 * registos independentes do mesmo facto, e quando existem as duas comparam-se.
 *
 * @param {{ id: string, excerpt?: unknown, source_url?: unknown }} linha
 */
function grupoEtarioDaLinha(linha) {
  const excerto = typeof linha.excerpt === 'string' ? linha.excerpt : '';
  const endereco = typeof linha.source_url === 'string' ? linha.source_url : '';
  const daEtiqueta = excerto.match(/Age class: From (\d+) to (\d+) years/);
  const doFiltro = endereco.match(/[?&]age=Y?(\d+)-(\d+)/);
  if (!daEtiqueta && !doFiltro) return null;
  const etiqueta = daEtiqueta ? [daEtiqueta[1], daEtiqueta[2]] : null;
  const filtro = doFiltro ? [doFiltro[1], doFiltro[2]] : null;
  return {
    limites: etiqueta ?? filtro,
    etiqueta,
    filtro,
    discordam: !!(etiqueta && filtro && etiqueta.join('-') !== filtro.join('-')),
  };
}

/**
 * K13. Corre sobre AS LINHAS do livro-razão que fixam um grupo de idades, e não
 * sobre as definições: era por iterar as definições que uma linha sem definição
 * nenhuma ficava invisível (achado 6). As linhas juntam-se por medida, porque o
 * período anterior e o agregado da União não têm definição própria e leem-se
 * debaixo da definição da linha âncora: se uma delas fixasse outro grupo, o
 * cartão punha um valor de um grupo ao lado da frase de outro.
 *
 * A catraca e as definições entram por argumento para a prova as poder exercer;
 * a lista EM VIGOR confere-se sempre, corra a prova ou não (achado 7).
 *
 * @param {Record<string, { pt: readonly unknown[], en: readonly unknown[] }>} definicoes
 * @param {Map<string, string>} catraca
 * @param {{ id: string, excerpt?: unknown, source_url?: unknown }[]} linhas
 * @returns {{ erros: string[], medidas: number, linhas: number }}
 */
function celulaK13(
  definicoes = /** @type {any} */ (DEFINICOES_DAS_MEDIDAS),
  catraca = CATRACA_DO_GRUPO_ETARIO,
  linhas = [...loadClaims().values()],
) {
  /** @type {string[]} */
  const erros = [];

  /* A LISTA EM VIGOR ESTÁ VAZIA, e isto corre em toda a corrida. A leitura a
     frio: «the assertion that the active ratchet has zero entries exists only
     inside the optional `if (PROVA)` block, so adding a new debt can turn a
     normal check green». Uma dívida nova passa a fechar a construção no acto de
     ser declarada, que é o único sítio onde alguém a lê. */
  if (CATRACA_DO_GRUPO_ETARIO.size !== 0) {
    erros.push(
      `K13 · a catraca do grupo etário tem ${CATRACA_DO_GRUPO_ETARIO.size} entrada(s) ` +
        `(${[...CATRACA_DO_GRUPO_ETARIO.keys()].join(', ')}) e tem de estar vazia. ` +
        `Uma medida cuja linha fixa um grupo de idades escreve-o na definição, ou ` +
        `a regra deixa de valer para todas.`,
    );
  }

  /** @type {Map<string, { id: string, grupo: ReturnType<typeof grupoEtarioDaLinha> }[]>} */
  const porMedida = new Map();
  let comGrupo = 0;
  for (const linha of linhas) {
    const grupo = grupoEtarioDaLinha(linha);
    if (!grupo) continue;
    comGrupo++;
    if (grupo.discordam) {
      erros.push(
        `K13 · ${linha.id}: a etiqueta do excerto diz dos ${grupo.etiqueta.join(' aos ')} ` +
          `anos e o filtro do pedido diz age=Y${grupo.filtro.join('-')}. Os dois são da ` +
          `fonte e não podem discordar: um deles está desactualizado.`,
      );
    }
    const familia = familiaDaLinha(linha.id);
    if (!porMedida.has(familia)) porMedida.set(familia, []);
    porMedida.get(familia).push({ id: linha.id, grupo });
  }

  for (const [familia, doGrupo] of [...porMedida].sort()) {
    /* Todas as linhas de uma medida fixam o MESMO grupo. */
    const grupos = new Set(doGrupo.map((l) => l.grupo.limites.join('-')));
    if (grupos.size > 1) {
      erros.push(
        `K13 · ${familia}: as linhas desta medida fixam grupos diferentes ` +
          `(${doGrupo.map((l) => `${l.id}: ${l.grupo.limites.join('-')}`).join('; ')}). ` +
          `O período anterior e o agregado leem-se debaixo da mesma definição.`,
      );
      continue;
    }
    const [a, b] = doGrupo[0].grupo.limites;

    /* A medida tem de ter uma definição declarada, e é aqui que uma linha sem
       definição nenhuma deixa de ser invisível. */
    const comDefinicao = doGrupo.map((l) => l.id).filter((id) => definicoes[id]);
    if (comDefinicao.length === 0) {
      erros.push(
        `K13 · ${familia}: ${doGrupo.length} linha(s) fixam o grupo dos ${a} aos ${b} anos ` +
          `(${doGrupo.map((l) => l.id).join(', ')}) e nenhuma delas tem definição ` +
          `declarada em DEFINICOES_DAS_MEDIDAS. Um grupo que a linha fixa e que o sítio ` +
          `não escreve deixa o leitor a supor de quem é o número.`,
      );
      continue;
    }

    for (const id of comDefinicao) {
      const naCatraca = catraca.get(id);
      const faltam = [];
      for (const lang of ['pt', 'en']) {
        const texto = textoDaDefinicao(definicoes[id][lang] ?? definicoes[id].pt);
        if (!FORMAS_DO_INTERVALO[lang](a, b).some((forma) => forma.test(texto))) {
          faltam.push({ lang, texto });
        }
      }
      if (faltam.length === 0) {
        if (naCatraca) {
          erros.push(
            `K13 · ${id}: escreve o grupo dos ${a} aos ${b} anos nas duas edições e ` +
              `continua na catraca. Tira-a de CATRACA_DO_GRUPO_ETARIO: uma dívida paga ` +
              `que fica declarada esconde a seguinte.`,
          );
        }
        continue;
      }
      if (naCatraca === `${a}-${b}`) continue;
      for (const { lang, texto } of faltam) {
        erros.push(
          `K13 · ${id} · ${lang}: a linha fixa o grupo dos ${a} aos ${b} anos e a ` +
            `definição não o escreve como intervalo: «${texto}»`,
        );
      }
    }
  }
  return { erros, medidas: porMedida.size, linhas: comGrupo };
}

/* =========================================================================
 * A PROVA: cinco estragos plantados, um por célula que morde sobre HTML
 * ========================================================================= */

function montaAProva() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'oedp-cartao-'));
  /** A marca da fonte, na forma em que o sítio a rende. @param {string} id */
  const chip = (id) =>
    `<a class="src-chip" href="/livro-razao/${id}"><span class="src-chip-texto">fonte</span></a>`;
  fs.mkdirSync(path.join(dir, 'areas', 'x'), { recursive: true });
  const s = t('pt');
  /* A frase declarada de uma medida real, para que o positivo da K6 seja a
     comparação a sério e não uma cadeia inventada. */
  const boa = textoDaDefinicao(DEFINICOES_DAS_MEDIDAS['precos-da-habitacao-2025'].pt);
  fs.writeFileSync(
    path.join(dir, 'areas', 'x', 'index.html'),
    '<!doctype html><html lang="pt"><head><title>x</title></head><body>' +
      /* O cartão SÃO: as cinco coisas, e nada plantado. Prova que a régua não
         grita por tudo. */
      '<article data-cartao-medida="precos-da-habitacao-2025">' +
      '<span class="cartao-medida-nome">Preços da habitação</span>' +
      '<p class="cartao-medida-valor"><span class="cartao-medida-num" data-claim="precos-da-habitacao-2025">17,6</span>' +
      chip('precos-da-habitacao-2025') +
      '<span class="cartao-medida-unidade">variação anual média, %</span></p>' +
      `<p class="cartao-medida-frase" data-cartao-definicao="precos-da-habitacao-2025">${boa}</p>` +
      '<p class="cartao-medida-regua"><span data-nonledger="limiar-do-quadro">9</span>%</p>' +
      '</article>' +
      /* PLANTA 1 (K1 e K2): um bloco a mais, com um rótulo de recibo dentro. */
      '<article data-cartao-medida="divida-publica-2025">' +
      '<span class="cartao-medida-nome">Dívida pública</span>' +
      '<p class="cartao-medida-valor"><span data-claim="divida-publica-2025">117,5</span>' + chip('divida-publica-2025') + '</p>' +
      `<p class="livro-item-campo"><span>${s.prov.lido}</span> 12.08.2026</p>` +
      '</article>' +
      /* PLANTA 2 (K3): a chave no texto visível. */
      '<article data-cartao-medida="taxa-de-desemprego-2025">' +
      '<span class="cartao-medida-nome">Taxa de desemprego</span>' +
      '<p class="cartao-medida-valor"><span data-claim="taxa-de-desemprego-2025">6,4</span>' +
      chip('taxa-de-desemprego-2025') +
      '<code>taxa-de-desemprego-2025</code></p>' +
      '</article>' +
      /* PLANTA 3 (K4): um título de documento em inglês numa página portuguesa,
         SEM a marca da língua. O nome pode ser estrangeiro (é a decisão de 15.09
         à noite); o que ele não pode é não dizer em que língua está. */
      '<article data-cartao-medida="licencas-de-construcao-2025">' +
      '<span class="cartao-medida-nome">Residential building permits - annual data</span>' +
      '<p class="cartao-medida-valor"><span data-claim="licencas-de-construcao-2025">749,7</span>' + chip('licencas-de-construcao-2025') + '</p>' +
      '</article>' +
      /* PLANTA 4 (K5): um algarismo na régua sem linha e sem motivo. */
      '<article data-cartao-medida="custo-unitario-do-trabalho-2025">' +
      '<span class="cartao-medida-nome">Custo unitário do trabalho</span>' +
      '<p class="cartao-medida-valor"><span data-claim="custo-unitario-do-trabalho-2025">14,4</span>' + chip('custo-unitario-do-trabalho-2025') + '</p>' +
      '<p class="cartao-medida-regua"><span>2024: 8,7</span></p>' +
      '</article>' +
      /* PLANTA 5 (K6 e K7): a frase mudada, e a palavra que saiu. */
      '<article data-cartao-medida="taxa-de-emprego-2025">' +
      '<span class="cartao-medida-nome">Taxa de emprego</span>' +
      '<p class="cartao-medida-valor"><span data-claim="taxa-de-emprego-2025">78,2</span>' + chip('taxa-de-emprego-2025') + '</p>' +
      '<p class="cartao-medida-frase" data-cartao-definicao="taxa-de-emprego-2025">Uma frase que ninguém declarou, dentro do limiar.</p>' +
      '</article>' +
      /* PLANTA 7 (K10): duas marcas da fonte num cartão, e um valor de régua sem
         marca própria cujo recibo não lista a linha (aqui não há recibo nenhum,
         que é o caso extremo do mesmo defeito). */
      '<article data-cartao-medida="saldo-da-balanca-corrente-2025">' +
      '<span class="cartao-medida-nome">Saldo da balança corrente</span>' +
      '<p class="cartao-medida-valor"><span data-claim="saldo-da-balanca-corrente-2025">2,2</span>' +
      chip('saldo-da-balanca-corrente-2025') +
      chip('saldo-da-balanca-corrente-2024') +
      '</p>' +
      '<p class="cartao-medida-regua"><span data-regua="anterior" data-selo-em="saldo-da-balanca-corrente-2025">' +
      '<span data-claim="saldo-da-balanca-corrente-2024">1,3</span></span></p>' +
      '</article>' +
      /* PLANTA 8 (K11): um cartão sem nome. É o defeito que a leitura a frio de
         15.09.2026 apanhou na régua («48 nameless cards … yet prints "the five
         things and only them"»), e a célula que ele derruba é a que essa leitura
         obrigou a escrever. */
      '<article data-cartao-medida="jovens-nem-2025">' +
      '<p class="cartao-medida-valor"><span data-claim="jovens-nem-2025">10,5</span>' +
      chip('jovens-nem-2025') + '</p>' +
      '</article>' +
      /* PLANTA 9 (K12): um período anterior que não é da mesma série. O par é
         VERDADEIRO e as duas linhas existem: `evora-divida-dgal-2017` e
         `evora-divida-dgal-2014` declaram edições diferentes do documento («2017»
         e «2014»), e é por isso que a régua deixou de as emparelhar. Nenhuma
         linha falsa se escreve para esta prova. */
      '<article data-cartao-medida="evora-divida-dgal-2017">' +
      '<span class="cartao-medida-nome">Dívida da câmara</span>' +
      '<p class="cartao-medida-valor"><span data-claim="evora-divida-dgal-2017">54 681 562</span>' +
      chip('evora-divida-dgal-2017') + '</p>' +
      '<p class="cartao-medida-regua"><span data-regua="anterior" data-selo-em="evora-divida-dgal-2017">' +
      '<span data-claim="evora-divida-dgal-2014">40 000 000</span></span></p>' +
      '</article>' +
      /* PLANTA 10 (K14): o cartão da sobrecarga com a média europeia de volta. */
      '<article data-cartao-medida="sobrecarga-do-custo-da-habitacao-2025">' +
      '<span class="cartao-medida-nome">Sobrecarga do custo da habitação</span>' +
      '<p class="cartao-medida-valor"><span data-claim="sobrecarga-do-custo-da-habitacao-2025">6,3</span>' +
      chip('sobrecarga-do-custo-da-habitacao-2025') + '</p>' +
      '<p class="cartao-medida-regua"><span data-regua="ue" data-selo-em="sobrecarga-do-custo-da-habitacao-2025">' +
      '<span data-claim="sobrecarga-do-custo-da-habitacao-2025-ue">7,7</span></span></p>' +
      '</article>' +
      /* PLANTA 6 (K8): a legenda da marca numa página de área. */
      '<p class="marca-legenda">Ao pé de cada número, a marca da fonte.</p>' +
      '</body></html>',
  );
  return dir;
}

if (PROVA) {
  const dir = montaAProva();
  let r;
  try {
    r = corre(dir);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  /** @param {string} c */
  const dessaCelula = (c) => r.erros.filter((e) => e.startsWith(`${c} ·`));
  /** @type {string[]} */
  const falhas = [];
  const esperado = [
    ['K1', 'livro-item-campo'],
    ['K2', 'Lido na fonte a'],
    ['K3', 'taxa-de-desemprego-2025'],
    ['K4', 'Residential building permits'],
    ['K5', '2024: 8,7'],
    ['K6', 'taxa-de-emprego-2025'],
    ['K7', 'limiar'],
    ['K8', 'legenda da marca'],
    ['K10', 'marca(s) da fonte'],
    ['K11', 'rende-se sem nome'],
    ['K12', 'não declaram a mesma edição'],
    ['K14', 'rende a média europeia'],
  ];
  for (const [celula, pedaco] of esperado) {
    const vistos = dessaCelula(celula);
    if (vistos.length === 0) {
      falhas.push(`${celula} não viu o estrago plantado`);
      continue;
    }
    if (!vistos.some((e) => e.includes(pedaco))) {
      falhas.push(`${celula} mordeu noutra coisa: ${vistos[0]}`);
    }
  }
  /* O CARTÃO SÃO NÃO PODE DAR VERMELHO, e é a outra metade da prova: uma régua
     que grite por tudo também diz sempre alguma coisa. */
  const noSao = r.erros.filter((e) => e.includes('precos-da-habitacao-2025'));
  if (noSao.length > 0) {
    falhas.push(`o cartão são deu ${noSao.length} vermelho(s): ${noSao[0]}`);
  }

  /* O nome antigo do limite não pode sobreviver à declaração nova, mesmo
     escrito à mão sem data-nome. Positivo, planta e reposição nas duas línguas. */
  const nomesDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oedp-cartao-nome-'));
  try {
    const id = 'indice-de-divida-limite-legal';
    const declarado = MEDIDAS_DO_DOMINIO_1.find(m => m.claim === id).nome;
    for (const [lang, antigo] of [['pt', 'Dívida da câmara contra o limite legal'], ['en', 'Municipal debt against the legal cap']]) {
      const escreve = nome => fs.writeFileSync(path.join(nomesDir, 'index.html'),
        `<html lang="${lang}"><body><article data-cartao-medida="${id}">` +
        `<span class="cartao-medida-nome">${nome}</span>` +
        `<p class="cartao-medida-valor"><a class="src-chip" href="/livro-razao/${id}">fonte</a></p>` +
        '</article></body></html>');
      escreve(declarado[lang]);
      if (corre(nomesDir).erros.length) falhas.push(`K1 nome ${lang}: recusou a declaração`);
      escreve(antigo);
      const mordidas = corre(nomesDir).erros.filter(e => e.startsWith('K1 ·') && e.includes('nome do cartão difere da declaração'));
      if (mordidas.length !== 1) falhas.push(`K1 nome ${lang}: não recusou o nome antigo`);
      escreve(declarado[lang]);
      if (corre(nomesDir).erros.length) falhas.push(`K1 nome ${lang}: a reposição não passou`);
    }
  } finally {
    fs.rmSync(nomesDir, { recursive: true, force: true });
  }

  /* -------------------------------------------------------------------- K13
     AS PLANTAS DO GRUPO ETÁRIO. Nenhuma linha falsa se escreve: as linhas são
     as verdadeiras, e o que se estraga é uma CÓPIA delas ou a DECLARAÇÃO, que
     é o lado que se corrige. As três primeiras vieram da leitura a frio de
     22.09.2026 (achado 6): a definição sem intervalo, a linha sem definição, e
     a etiqueta a contradizer o filtro. */
  {
    const id = 'jovens-nem-2025';
    const reais = [...loadClaims().values()];
    const real = celulaK13();
    if (real.erros.length) {
      falhas.push(`K13 recusa a declaração em vigor: ${real.erros[0]}`);
    }
    if (real.medidas !== 4 || real.linhas !== 12) {
      falhas.push(
        `K13 viu ${real.medidas} medida(s) e ${real.linhas} linha(s) com grupo etário, ` +
          `e o livro-razão tem 4 e 12`,
      );
    }
    if (CATRACA_DO_GRUPO_ETARIO.size !== 0) {
      falhas.push('K13: a catraca em vigor tem entradas e o ficheiro diz que está vazia');
    }
    /* A linha tem de trazer mesmo a etiqueta: sem ela a planta não prova nada. */
    const grupo = grupoEtarioDaLinha(reais.find((l) => l.id === id));
    if (!grupo || grupo.limites.join('-') !== '15-29') {
      falhas.push(`K13: a linha «${id}» não fixa os 15 aos 29`);
    }

    /* PLANTA A: o segundo limite trocado na definição (o defeito da I129). */
    const trocaOSegundoLimite = (partes) =>
      partes.map((p) => (typeof p !== 'string' && p.nl === '29' ? { ...p, nl: '24' } : p));
    const comDefeito = {
      ...DEFINICOES_DAS_MEDIDAS,
      [id]: {
        ...DEFINICOES_DAS_MEDIDAS[id],
        pt: trocaOSegundoLimite(DEFINICOES_DAS_MEDIDAS[id].pt),
        en: trocaOSegundoLimite(DEFINICOES_DAS_MEDIDAS[id].en),
      },
    };
    const mordidas = celulaK13(comDefeito).erros.filter((e) => e.startsWith(`K13 · ${id} ·`));
    if (mordidas.length !== 2) {
      falhas.push(
        `K13 NÃO MORDEU a definição com «dos 15 aos 24 anos»: ${mordidas.length} ` +
          `vermelho(s) em vez de um por edição`,
      );
    }

    /* PLANTA B: os dois algarismos presentes, mas fora do intervalo. É o caso
       que passava antes, porque a régua só procurava os dois números soltos. */
    const soltos = {
      ...DEFINICOES_DAS_MEDIDAS,
      [id]: {
        ...DEFINICOES_DAS_MEDIDAS[id],
        pt: ['Entre ', { nl: '15', motivo: 'escala-de-instrumento' }, ' concelhos e ',
             { nl: '29', motivo: 'escala-de-instrumento' }, ' freguesias.'],
        en: ['Between ', { nl: '15', motivo: 'escala-de-instrumento' }, ' municipalities and ',
             { nl: '29', motivo: 'escala-de-instrumento' }, ' parishes.'],
      },
    };
    const doisSoltos = celulaK13(soltos).erros.filter((e) => e.startsWith(`K13 · ${id} ·`));
    if (doisSoltos.length !== 2) {
      falhas.push(
        `K13 NÃO MORDEU dois algarismos soltos fora do intervalo: ${doisSoltos.length} ` +
          `vermelho(s) em vez de um por edição`,
      );
    }

    /* PLANTA C: uma medida cujas linhas fixam um grupo e que não tem definição
       nenhuma. Era o buraco do achado 6: a régua iterava as definições, e uma
       linha sem definição não era vista por ninguém. */
    const semDefinicao = { ...DEFINICOES_DAS_MEDIDAS };
    delete semDefinicao[id];
    const invisivel = celulaK13(semDefinicao).erros
      .filter((e) => e.startsWith('K13 · jovens-nem:'));
    if (invisivel.length !== 1) {
      falhas.push(
        `K13 NÃO MORDEU uma medida sem definição: ${invisivel.length} vermelho(s)`,
      );
    } else if (!invisivel[0].includes('3 linha(s)')) {
      falhas.push(`K13 contou mal as linhas sem definição: ${invisivel[0]}`);
    }

    /* PLANTA D: a etiqueta do excerto a contradizer o filtro do pedido. A linha
       é a verdadeira, numa CÓPIA com a etiqueta trocada. */
    const contraditoria = reais.map((l) =>
      l.id === 'taxa-de-desemprego-2025'
        ? { ...l, excerpt: String(l.excerpt).replace('From 15 to 74 years', 'From 15 to 64 years') }
        : l);
    const discordancia = celulaK13(DEFINICOES_DAS_MEDIDAS, CATRACA_DO_GRUPO_ETARIO, contraditoria)
      .erros.filter((e) => e.includes('não podem discordar'));
    if (discordancia.length !== 1) {
      falhas.push(
        `K13 NÃO MORDEU a etiqueta a contradizer o filtro: ${discordancia.length} vermelho(s)`,
      );
    }

    /* PLANTA E: duas linhas da mesma medida a fixar grupos diferentes. */
    const desalinhada = reais.map((l) =>
      l.id === 'taxa-de-emprego-2024'
        ? {
            ...l,
            excerpt: String(l.excerpt).replace('From 20 to 64 years', 'From 25 to 64 years'),
            source_url: String(l.source_url).replace('age=Y20-64', 'age=Y25-64'),
          }
        : l);
    const familias = celulaK13(DEFINICOES_DAS_MEDIDAS, CATRACA_DO_GRUPO_ETARIO, desalinhada)
      .erros.filter((e) => e.includes('fixam grupos diferentes'));
    if (familias.length !== 1) {
      falhas.push(
        `K13 NÃO MORDEU duas linhas da mesma medida com grupos diferentes: ` +
          `${familias.length} vermelho(s)`,
      );
    }

    /* AS DUAS METADES DA CATRACA, exercidas com ela VAZIA em vigor: a lista
       entra por argumento porque uma lista vazia não se pode exercer. */
    const paga = new Map([['taxa-de-desemprego-2025', '15-74']]);
    const aviso = celulaK13(DEFINICOES_DAS_MEDIDAS, paga).erros
      .filter((e) => e.includes('continua na catraca'));
    if (aviso.length !== 1) {
      falhas.push('K13: a catraca não reclamou uma dívida paga que ficou declarada');
    }
    const estragadas = {
      ...DEFINICOES_DAS_MEDIDAS,
      'taxa-de-emprego-2025': {
        ...DEFINICOES_DAS_MEDIDAS['taxa-de-emprego-2025'],
        pt: ['Uma definição sem os limites.'],
        en: ['A definition without the bounds.'],
      },
    };
    const dentro = celulaK13(estragadas, new Map([['taxa-de-emprego-2025', '20-64']])).erros
      .filter((e) => e.startsWith('K13 · taxa-de-emprego-2025 ·'));
    const fora = celulaK13(estragadas, new Map()).erros
      .filter((e) => e.startsWith('K13 · taxa-de-emprego-2025 ·'));
    if (dentro.length !== 0) {
      falhas.push('K13: uma medida declarada na catraca deu vermelho na mesma');
    }
    if (fora.length !== 2) {
      falhas.push(
        `K13 NÃO MORDEU fora da catraca: ${fora.length} vermelho(s) em vez de um por edição`,
      );
    }
  }

  /* A mesma K6, com a frase real e as duas glosas: verde antes, vermelha
     quando se troca cada glosa. Nenhum valor de medida entra nesta planta. */
  const glosasDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oedp-cartao-glosas-'));
  try {
    fs.mkdirSync(path.join(glosasDir, 'en'));
    const id = 'divida-das-empresas-2025';
    const frase = DEFINICOES_DAS_MEDIDAS[id].en.map((p) => typeof p === 'string' ? p :
      `<a class="marcador">[${p.marcador}]</a><span class="marcador-gloss"> (${p.gloss})</span>` +
      `<span class="marcador-definicao"> · ${t('en').marcador.definicao}</span>`).join('');
    const boa = `<html lang="en"><body><article data-cartao-medida="${id}"><p data-cartao-definicao="${id}">${frase}</p></article></body></html>`;
    const ficheiro = path.join(glosasDir, 'en', 'index.html');
    fs.writeFileSync(ficheiro, boa);
    if (corre(glosasDir).erros.some((e) => e.startsWith('K6 ·'))) falhas.push('K6 recusa a frase com as glosas declaradas');
    for (const seletor of ['.marcador-gloss', '.marcador-definicao']) {
      const pagina = parse(boa);
      pagina.querySelector(seletor).set_content('Texto plantado.');
      fs.writeFileSync(ficheiro, pagina.toString());
      if (!corre(glosasDir).erros.some((e) => e.startsWith('K6 ·'))) falhas.push(`K6 não vê a glosa trocada em ${seletor}`);
    }
  } finally { fs.rmSync(glosasDir, { recursive: true, force: true }); }

  /* -------------------------------------------------------------------------
     A PROVA DAS LINHAS DO ENQUADRAMENTO: um positivo e um negativo, os dois com
     linhas verdadeiras. Nenhuma linha falsa é escrita para esta prova.
     ------------------------------------------------------------------------- */
  const chaves = chavesDoEnquadramento('precos-da-habitacao-2025');
  if (chaves.anterior !== 'precos-da-habitacao-2024' || chaves.ue !== 'precos-da-habitacao-2025-ue') {
    falhas.push(`as chaves do enquadramento saíram erradas: ${JSON.stringify(chaves)}`);
  }
  /* O POSITIVO: a linha da própria medida existe, e `hasClaim` diz que sim. */
  if (!hasClaim('precos-da-habitacao-2025')) {
    falhas.push('hasClaim() não encontra uma linha que existe: a régua está cega');
  }
  /* O NEGATIVO: uma medida cujo período não é um ano não tem chave nenhuma, e a
     régua não lhe inventa uma. Descer um mês é conhecimento da série, e a série é
     do motor. */
  const semChave = chavesDoEnquadramento('evora-desemprego-registado-2025-12');
  if (semChave.anterior !== null || semChave.ue !== null) {
    falhas.push(
      `a régua inventou uma chave para um período que não é um ano: ${JSON.stringify(semChave)}`,
    );
  }
  /* O POSITIVO E O NEGATIVO DA RÉGUA, com as linhas que o motor selou a 15.09.
     `precos-da-habitacao-2025` tem as duas comparações; uma medida cujo período
     não é um ano não tem chave nenhuma, e é esse o negativo. */
  const regua = reguaDaMedida('precos-da-habitacao-2025');
  if (!regua.anterior || regua.anterior.id !== 'precos-da-habitacao-2024') {
    falhas.push(`a régua não achou a linha do período anterior: ${JSON.stringify(regua)}`);
  }
  if (!regua.ue || regua.ue.id !== 'precos-da-habitacao-2025-ue') {
    falhas.push(`a régua não achou a linha da União: ${JSON.stringify(regua)}`);
  }
  /* A SÉRIE BIENAL: o período anterior não é o ano anterior, e a régua
     procura-o no livro-razão em vez de o calcular. */
  const bienal = reguaDaMedida('competencias-digitais-2025');
  if (!bienal.anterior || bienal.anterior.id !== 'competencias-digitais-2023') {
    falhas.push(
      `a régua calculou o período anterior em vez de o procurar: ` +
        `«competencias-digitais-2025» deu ${JSON.stringify(bienal.anterior)} e a linha selada é ` +
        `«competencias-digitais-2023» (série bienal)`,
    );
  }
  /* A AUSÊNCIA: cinco medidas não têm linha da União, porque o conjunto do
     Eurostat não traz valor no agregado naquele período. O cartão desenha-as sem
     a comparação europeia e não escreve a ausência por palavras. */
  const semUe = reguaDaMedida('saldo-da-balanca-corrente-2025');
  if (semUe.ue !== null) {
    falhas.push(
      'a prova da ausência tem de mudar de alvo: «saldo-da-balanca-corrente-2025» passou a ter ' +
        'linha da União, e a régua tem de continuar a ser provada contra uma medida que não a tenha',
    );
  }

  /* A K9 PROVA-SE COM UM PAR QUE NÃO BATE CERTO, e não com um estrago num
     ficheiro do motor: o que se prova é a comparação. Dois pares, um em cada
     sentido: os números diferentes e o sentido diferente. */
  const parMau = compararAsDuasTestemunhas(
    'a-prova',
    { limiar: '61%', sentido: 'superior' },
    { inferior: null, superior: '60' },
    false,
  );
  if (!parMau || !parMau.includes('não batem certo')) {
    falhas.push('a K9 não vê dois números diferentes');
  }
  const sentidoMau = compararAsDuasTestemunhas(
    'a-prova',
    { limiar: '60%', sentido: 'inferior' },
    { inferior: null, superior: '60' },
    false,
  );
  if (!sentidoMau || !sentidoMau.includes('sentido')) {
    falhas.push('a K9 não vê dois sentidos diferentes');
  }
  const parBom = compararAsDuasTestemunhas(
    'a-prova',
    { limiar: '+/-3% (EA)', sentido: 'intervalo' },
    { inferior: '−3', superior: '3' },
    true,
  );
  if (parBom !== null) {
    falhas.push(`a K9 grita por um par que bate certo: ${parBom}`);
  }

  /* -------------------------------------------------------------------------
     A PROVA DA MESMA SÉRIE (achado 11, 15.09.2026), com dois pares verdadeiros:
     um que bate (a mesma edição do documento e a mesma unidade) e um que não
     bate (duas edições diferentes do mesmo publicador). Nenhuma linha falsa.
     ------------------------------------------------------------------------- */
  if (!mesmaSerie('precos-da-habitacao-2025', 'precos-da-habitacao-2024')) {
    falhas.push(
      'mesmaSerie() recusa um par que bate certo: «precos-da-habitacao-2025» e ' +
        '«precos-da-habitacao-2024» declaram a mesma edição do documento e a mesma unidade',
    );
  }
  if (mesmaSerie('evora-divida-dgal-2017', 'evora-divida-dgal-2014')) {
    falhas.push(
      'mesmaSerie() aceita um par que não bate: «evora-divida-dgal-2017» declara a edição «2017» ' +
        'e «evora-divida-dgal-2014» declara «2014»',
    );
  }
  /* E A RÉGUA DE UMA MEDIDA CUJO PERÍODO ANTERIOR NÃO BATE NÃO RENDE O ITEM. */
  if (reguaDaMedida('evora-divida-dgal-2017').anterior !== null) {
    falhas.push(
      'a régua rende o período anterior de «evora-divida-dgal-2017», cuja linha declara outra ' +
        'edição do documento',
    );
  }

  if (falhas.length > 0) {
    console.error(vermelho('\n  A PROVA DA RÉGUA DO CARTÃO FALHOU\n'));
    for (const f of falhas) console.error(`    ${f}`);
    console.error('');
    process.exit(1);
  }
  console.log(
    cinza(
      `  prova: ${esperado.length} estragos plantados, ${esperado.length} vistos; o cartão são a 0; ` +
        `a régua com as duas comparações de uma medida, a série bienal, a ausência da linha da ` +
        `União e uma chave que não se inventa; as duas testemunhas do valor de referência com um ` +
        `par bom e dois maus; a mesma série com um par que bate e um que não bate; ` +
        `K6 com as glosas declaradas e com cada uma das duas trocada; K1 com o nome do limite legal declarado, antigo e reposto nas duas línguas; ` +
        `K13 sobre ${celulaK13().medidas} medidas e ${celulaK13().linhas} linhas com grupo etário, com a ` +
        `declaração em vigor a passar e cinco plantas a morder (o limite trocado, dois algarismos ` +
        `soltos fora do intervalo, uma medida sem definição, a etiqueta a contradizer o filtro e ` +
        `duas linhas da mesma medida com grupos diferentes), mais a catraca vazia nas duas metades`,
    ),
  );
}

/* ------------------------------------------------------------- a corrida */

const DIST = process.env.OEDP_DIST
  ? path.resolve(RAIZ, process.env.OEDP_DIST)
  : path.join(RAIZ, 'dist');
if (!fs.existsSync(DIST)) {
  console.error(vermelho('\n  A RÉGUA DO CARTÃO · não existe dist/. Corra o build primeiro.\n'));
  process.exit(1);
}

const r = corre(DIST);
const motor = ficheirosDoMotor();

/* -------------------------------------------------------------------- K14 */
/* A declaração cala exactamente as medidas desta lista, e a linha da União de
   cada uma continua a existir; e o positivo conhecido: pelo menos um cartão de
   uma medida calada foi visto, ou a célula mediu coisa nenhuma. */
{
  const declaradas = new Set(FIGURAS.filter((f) => /** @type {any} */ (f).semMediaEuropeia).map((f) => f.claim));
  for (const id of declaradas) {
    if (!MEDIA_EUROPEIA_CALADA.has(id)) {
      r.erros.push(`K14 · figuras.mjs cala a média europeia de «${id}», e nenhuma decisão escrita nesta célula o manda`);
    }
  }
  for (const [id, razao] of MEDIA_EUROPEIA_CALADA) {
    if (!declaradas.has(id)) {
      r.erros.push(`K14 · a declaração de «${id}» deixou de calar a média europeia, e a decisão ainda vale: ${razao}`);
    }
    if (!hasClaim(`${id}-ue`)) {
      r.erros.push(`K14 · a linha da União «${id}-ue» saiu do livro-razão: o silêncio no cartão deixou de ser uma escolha`);
    }
  }
  if (r.contas.cartoes_com_media_calada === 0) {
    r.erros.push('K14 · nenhum cartão de uma medida com a média europeia calada foi visto no dist/: a célula não mediu nada');
  }
}

/* --------------------------------------------------------------------- K9 */
/* As duas testemunhas do valor de referência, comparadas medida a medida. Não
   lê o `dist/`: lê os dois registos, que é onde o facto está. */
let k9Comparadas = 0;
for (const f of FIGURAS) {
  const doMotor = valorDeReferenciaDoMotor(f.claim);
  if (!doMotor) continue;
  k9Comparadas++;
  const queixa = compararAsDuasTestemunhas(
    f.claim,
    doMotor,
    ladosDoLimiar(f.limiar),
    Boolean(f.limiar && (f.limiar.inferior || f.limiar.superior)),
  );
  if (queixa) r.erros.push(queixa);
}
r.contas.valores_de_referencia_comparados = k9Comparadas;

/* Os nomes oficiais que o recibo mostra: só os que o motor marca como a mesma
   medida. A conta escreve-se para o relatório do bloco. */
let comNomeOficial = 0;
for (const f of FIGURAS) if (nomeOficial(f.claim)) comNomeOficial++;
r.contas.medidas_com_nome_oficial = comNomeOficial;

/* K8 · «Governo Constitucional» uma vez por edição. */
if (r.contas.governo_constitucional_pt !== 1) {
  r.erros.push(
    `K8 · «Governo Constitucional» rende-se em ${r.contas.governo_constitucional_pt} página(s) ` +
      `portuguesa(s) e devia render-se em 1 (o índice das áreas)`,
  );
}
if (r.contas.governo_constitucional_en !== 1) {
  r.erros.push(
    `K8 · «Constitutional Government» rende-se em ${r.contas.governo_constitucional_en} página(s) ` +
      `inglesa(s) e devia render-se em 1 (o índice das áreas)`,
  );
}

if (JSON_SAIDA) {
  console.log(JSON.stringify({ contas: r.contas, erros: r.erros, motor }, null, 2));
  process.exit(r.erros.length === 0 ? 0 : 1);
}

console.log('');
console.log('  A RÉGUA DO CARTÃO DE UMA MEDIDA · bloco P2');
console.log('');
console.log(cinza(`    páginas lidas                    ${r.contas.paginas}`));
console.log(cinza(`    cartões                          ${r.contas.cartoes} (${r.contas.cartoes_pt} pt, ${r.contas.cartoes_en} en)`));
/* OS NÚMEROS COMO ELES SÃO (achado 3 da leitura a frio de 15.09.2026). A régua
   imprimia «com a frase do que medem 30» e acabava com «as cinco coisas e só
   elas, em todos os cartões», e as duas coisas não podem ser verdade ao mesmo
   tempo: 30 de 262 não é «em todos». Cada linha passa a dizer a fração, e a
   linha final diz o que a régua conferiu e não o que seria bom que ela tivesse
   conferido. */
console.log(cinza(`    com nome                         ${r.contas.com_nome} de ${r.contas.cartoes}`));
console.log(
  cinza(`    com a frase do que medem         ${r.contas.com_frase} de ${r.contas.cartoes} com frase`),
);
console.log(cinza(`    com régua                        ${r.contas.com_regua} de ${r.contas.cartoes} com régua`));
console.log(
  cinza(
    `    linhas sem nome, como linha do livro-razão             ${r.contas.linhas_sem_nome} ` +
      `(${r.contas.linhas_sem_nome_com_conta} com a aritmética escrita)`,
  ),
);
console.log(
  cinza(`    itens «período anterior», pares conferidos             ${r.contas.regua_periodo_anterior}`),
);
console.log(cinza(`    «Governo Constitucional»         ${r.contas.governo_constitucional_pt} pt · ${r.contas.governo_constitucional_en} en`));
console.log(cinza(`    legenda da marca                 ${r.contas.legenda_da_marca} página(s)`));
console.log(cinza(`    nome na língua da fonte          ${r.contas.nome_noutra_lingua} (com a marca «lang»)`));
console.log(cinza(`    unidade na outra língua          ${r.contas.unidade_noutra_lingua} (a exceção da I92)`));
console.log(cinza(`    o marcador em português          ${r.contas.marcador_em_portugues} (a exceção da IDENTIDADE §6)`));
console.log(cinza(`    valores de régua sem marca própria                    ${r.contas.valores_de_regua_sem_marca} (a porta é a do cartão)`));
console.log(cinza(`    valores de referência, as duas testemunhas comparadas  ${r.contas.valores_de_referencia_comparados}`));
console.log(cinza(`    cartões com a média europeia calada (K14)              ${r.contas.cartoes_com_media_calada}`));
console.log(cinza(`    medidas com nome oficial no recibo                    ${r.contas.medidas_com_nome_oficial}`));
console.log(cinza(`    medidas com grupo etário fixado na linha (K13)         ${r.contas.medidas_com_grupo_etario}`));
console.log(cinza(`      linhas dessas medidas, todas conferidas               ${r.contas.linhas_com_grupo_etario}`));
console.log(cinza(`      delas, na catraca declarada (I132, vazia)           ${r.contas.medidas_na_catraca_do_grupo_etario}`));
console.log(
  cinza(
    `    ficheiros do motor               referencias.json ${motor.referencias ? 'sim' : 'ainda não'} · ` +
      `nomes.json ${motor.nomes ? 'sim' : 'ainda não'}`,
  ),
);
console.log('');
if (r.erros.length > 0) {
  console.error(vermelho(`  ${r.erros.length} defeito(s):`));
  for (const e of r.erros.slice(0, 40)) console.error(`    ${e}`);
  if (r.erros.length > 40) console.error(cinza(`    … e mais ${r.erros.length - 40}`));
  console.error('');
  process.exit(1);
}
console.log(
  verde(
    `  ✓ ${r.contas.cartoes} cartões, todos com nome; nenhum com um bloco a mais, um rótulo de ` +
      `recibo ou a chave à vista; ${r.contas.com_frase} de ${r.contas.cartoes} com frase e ` +
      `${r.contas.com_regua} de ${r.contas.cartoes} com régua, e os ` +
      `${r.contas.regua_periodo_anterior} períodos anteriores da mesma série e da mesma unidade`,
  ),
);
console.log('');
