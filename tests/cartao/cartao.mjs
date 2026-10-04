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
 * As células ficam todas nomeadas, incluindo as que as correções acrescentaram.
 *   K1 · **as cinco coisas e só elas** · cada `[data-cartao-medida]` do `dist/`
 *        só tem, ao primeiro nível, os blocos permitidos: o nome, a linha do
 *        valor, a frase e a régua. Um bloco a mais é um campo de recibo a
 *        voltar, e é assim que ele volta: alguém acrescenta uma linha.
 *        **Desde o UE1 (29.09.2026) há uma sexta coisa, e só onde ela é devida**:
 *        a faixa da União (`cartao-medida-faixa`), uma vez, num cartão cuja linha
 *        tem série de países em `ledger/series/`. Num cartão sem série a faixa é
 *        um bloco a mais e a K1 recusa-a como recusa um campo de recibo; a planta
 *        põe-na num desses cartões. **Desde a UE1d (29.09.2026, §1.140) há a
 *        ressalva da comparação com a União** (`cartao-medida-ressalva`), uma
 *        vez, só num cartão de uma medida que a lista da K14 nomeia.
 *        **Desde o L2b (01.10.2026) há a faixa do concelho**
 *        (`cartao-medida-faixa-concelho`), uma vez, só num cartão de concelho
 *        (`data-medida-chave`) cuja medida a tabela das ordens
 *        (`src/data/faixa-do-concelho.mjs`) declara com faixa: desde a passagem
 *        L2b-b, só as taxas e os rácios, porque uma contagem não se ordena
 *        (§1.143, decisão 4). Num cartão nacional, ou no de uma contagem, é um
 *        bloco a mais.
 *   K19 · **a ordem do cartão, lida no documento** (bloco K2, 02.10.2026) ·
 *        o nome, o valor com a unidade, a comparação e só depois a definição,
 *        dobrada num `<details>` fechado que abre por «O que é este número»;
 *        nos cartões da faixa da página da União, o nome, o valor, a unidade e
 *        o estado. A célula e as sete plantas vivem em `tests/cartao/ordem.mjs`.
 *   K18 · **a faixa da União refeita dos pontos** · a mesma célula que a F19 do
 *        `check:formas` corre na construção (`tests/cartao/faixa.mjs`): a faixa em
 *        cada cartão nacional com série, o desenho com uma marca por país na
 *        posição que o valor dá, as pontas, a frase recomposta das palavras
 *        declaradas e a porta para o recibo da série. Com `--prova`, as plantas
 *        dela correm sobre as páginas dos temas.
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
 *        alguém olhar. **Desde a passagem de correção do L1 (26.09.2026, I151)**,
 *        onde uma terceira fonte diz outra coisa (as descrições de dois conjuntos
 *        do Eurostat), a discordância declara-se ao pé do `limiar`
 *        (`testemunhaDiscordante`) e esta célula exige-lhe o que cada fonte diz,
 *        a data de criação do conjunto, a data de leitura da página da Comissão e
 *        quem manda, com os números de quem manda iguais aos da declaração
 *        (`tests/cartao/referencias.mjs`); as duas medidas conhecem-se pelo nome,
 *        e tirar a testemunha a uma delas fecha a construção. Plantas com
 *        `--prova`: a discordância sem data, sem a data de leitura, sem quem
 *        manda, a Comissão a dizer outro valor, e a discordância escondida.
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
 *   K14 · **a comparação com a União só com a ressalva** · (a §1.140 do lugar
 *        de direção, 29.09.2026, a passagem UE1d; antes, desde o bloco R1 de
 *        23.09.2026, I138, a §1.124 calava a média da União no cartão da
 *        sobrecarga do custo da habitação até o B2 mostrar a medida por regime
 *        de ocupação, e a K14 era a catraca desse silêncio). A condição da §1.124
 *        cumpriu-se, a média da União voltou ao cartão, e a proteção mudou de
 *        forma e não de propósito: a comparação lê-se ao contrário sem a
 *        ressalva da Comissão, e por isso a K14 conhece PELO NOME, escrita aqui e
 *        não importada, cada medida cuja comparação com a União a exige (hoje
 *        uma) e exige a ressalva, com o texto da fonte única
 *        (`src/data/ressalvas-da-uniao.mjs`), em cada cartão e em cada recibo
 *        dessa medida no `dist/`, nas duas edições, que mostre a União: a régua,
 *        a faixa, o enquadramento do recibo da linha e o recibo da série. A
 *        declaração tem as ressalvas exactamente destas medidas, nem mais nem
 *        menos. O positivo conhecido é pelo menos um cartão e um recibo vistos
 *        com a União e com a ressalva; as plantas são um cartão com a União sem
 *        ela e um recibo da série sem ela, e o controlo, um cartão e um recibo
 *        certos, passa.
 *   K15 · **a palavra do veredicto e a cor que a repete** · B2: uma conta
 *        independente lê cada referência e o valor selado, e exige a frase
 *        completa, a direção, os limites e as classes do estado. A faixa
 *        europeia entra na mesma conferência; nos limites legais a palavra
 *        própria continua obrigatória. Planta: a cor fica e a palavra sai,
 *        depois só a cor troca de estado.
 *   K16 · **cada pedaço de cada pergunta tem origem** · B2, segunda passagem de
 *        correção (23.09.2026), achado 8 da leitura a frio: a pergunta do
 *        desemprego de longa duração dizia um denominador que nenhuma origem
 *        declarada dizia, e a K6 não o via, porque compara o texto rendido com
 *        a declaração. A auditoria pedaço a pedaço vive em
 *        `perguntas-provadas.json` e a célula em `perguntas.mjs`: os pedaços
 *        juntos são a pergunta declarada nas duas edições, cada literal está no
 *        campo que cita (de uma origem declarada, ou da linha da própria
 *        medida), cada origem declarada apoia algum pedaço, e cada resposta da
 *        API do Eurostat citada como origem traz o selo do seu pedido no motor.
 *        Não lê `dist/`. Plantas: a origem selada tirada à pergunta (o defeito
 *        que a leitura a frio achou), a pergunta mudada sem nova leitura, um
 *        literal que o campo não tem, um pedaço sem apoio, uma pergunta sem
 *        auditoria, uma origem declarada sem uso, outra linha citada, um literal
 *        curto, o selo tirado e o sha256 tirado.
 *   K17 · **a leitura de cada medida, auditada e recontada** · bloco L1
 *        (24.09.2026), a regra do diretor de 23.09 (I150): por baixo do número
 *        de cada cartão nacional, uma leitura em palavras correntes. A célula vive
 *        em `leituras.mjs`, com a auditoria em `leituras-provadas.json`, e tem
 *        duas metades. A primeira não lê `dist/`: cada folha de cada leitura
 *        declarada tem a sua auditoria, as partes juntas são a folha, cada parte
 *        que diz o que a medida é apoia-se num literal que está mesmo no campo
 *        que cita, cada conta só vive onde a máquina escolhe, cada algarismo tem
 *        o seu literal e o motivo da pergunta da mesma medida, e nenhuma origem
 *        declarada fica sem uso. A segunda lê as páginas onde os cartões se
 *        rendem (os temas e, desde o bloco PP1, as cinco entradas, nas duas
 *        edições): uma leitura por cartão, o texto igual ao do
 *        resolvedor e ao que a célula recompõe por conta própria, com os ramos
 *        escolhidos pela sua conta, nenhum texto de um ramo não escolhido, os
 *        algarismos todos marcados, só as linhas do cartão e da sua régua, e
 *        nenhuma marca da fonte. Plantas (com `--prova`): a origem tirada, a
 *        leitura mudada sem nova leitura, um literal que o campo não tem, um
 *        pedaço sem apoio, um algarismo sem literal, um algarismo escrito à mão,
 *        o ramo trocado, uma linha de outra medida, um cartão sem leitura e a
 *        leitura com a marca da fonte.
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
import { documentoDosAssuntos } from '../inicio/paginas-dos-assuntos.mjs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

import {
  compararAsDuasTestemunhas,
  referenciaNacionalDaLinha,
  conferirTestemunhaDiscordante,
  conferirDiscordanciasDeclaradas,
} from './referencias.mjs';
import { auditarVeredicto, veredictoEsperado } from './veredicto.mjs';
import { auditarPerguntas, lerAuditoriaDasPerguntas } from './perguntas.mjs';
import { conferirAuditoriaDasLeituras, conferirLeiturasRendidas, plantasDaK17 } from './leituras.mjs';
import { conferirOrdemDaPagina, plantasDaOrdem } from './ordem.mjs';
import { REFERENCIAS_DAS_MEDIDAS } from '../../src/data/referencias-das-medidas.mjs';
import { t } from '../../src/i18n/strings.mjs';
import { DEFINICOES_DAS_MEDIDAS, ORIGENS_DAS_DEFINICOES, textoDaDefinicao } from '../../src/data/figuras.mjs';
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
import { lerSeriesDoPortao, lerPaisesDoPortao, serieDaLinhaDoPortao } from '../../scripts/series-do-portao.mjs';
import { conferirFaixas, plantasDaFaixa, conferirPalavrasDaFaixa, plantasDasPalavrasDaFaixa, plantasDosEmpates } from './faixa.mjs';
import { RESSALVAS_DA_UNIAO } from '../../src/data/ressalvas-da-uniao.mjs';
import { FAIXA_DAS_MEDIDAS_DO_CONCELHO } from '../../src/data/faixa-do-concelho.mjs';
import { UNIDADES_DOS_CARTOES } from '../../src/data/unidades-dos-cartoes.mjs';

/**
 * K14 · A RESSALVA NUM CARTÃO OU NUM RECIBO: uma e uma só marca
 * `data-ressalva-da-uniao` da medida, com o texto da fonte única na língua da
 * página. Devolve o que falta, ou `null`.
 * @param {any} onde @param {string} id @param {'pt'|'en'} lang
 * @returns {string|null}
 */
function conferirRessalva(onde, id, lang) {
  const marcas = onde.querySelectorAll(`[data-ressalva-da-uniao="${id}"]`);
  const esperado = /** @type {Record<string, { pt: string, en: string }>} */ (RESSALVAS_DA_UNIAO)[id]?.[lang] ?? null;
  if (marcas.length !== 1) return `sem a ressalva da Comissão (${marcas.length} marca(s) «data-ressalva-da-uniao»)`;
  const dito = String(marcas[0].text ?? '').replace(/\s+/g, ' ').trim();
  if (esperado === null) return 'a declaração não tem o texto da ressalva desta medida';
  if (dito !== esperado) return `a ressalva diz «${dito.slice(0, 80)}» e a declarada é «${esperado.slice(0, 80)}»`;
  return null;
}

/**
 * K14 · AS MEDIDAS CUJA COMPARAÇÃO COM A UNIÃO EXIGE A RESSALVA, e a decisão que o
 * manda. Escrita aqui e não lida da declaração: uma régua que lesse a lista da
 * coisa que mede não media nada. Tirar uma medida daqui, ou pôr outra, é uma
 * decisão escrita em `DECISIONS.md`, e é por isso que a razão vai ao lado.
 * @type {Map<string, string>}
 */
const RESSALVA_COM_A_UNIAO = new Map([
  [
    'sobrecarga-do-custo-da-habitacao-2025',
    '§1.140 (29.09.2026): a média da União voltou ao cartão, e a Comissão adverte que o total só se ' +
      'lê com a estrutura por regime de ocupação; onde a União aparece, a ressalva aparece',
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
  /* L1, 24.09.2026: a leitura do que o número significa, por baixo dele. É o
     bloco novo do bloco, e o único: o que a K17 confere (o texto, os ramos, os
     algarismos e as linhas citadas) vive em `tests/cartao/leituras.mjs`. */
  'cartao-medida-leitura',
  'cartao-medida-frase',
  'cartao-medida-regua',
  /* UE1, 29.09.2026: a faixa da União, só num cartão cuja linha tem série de
     países, e uma vez (a K1 confere as duas coisas abaixo). */
  'cartao-medida-faixa',
  /* UE1d, 29.09.2026 (§1.140): a ressalva da comparação com a União, só num
     cartão de uma medida que a lista da K14 nomeia, e uma vez. */
  'cartao-medida-ressalva',
  /* L2b, 01.10.2026: a faixa do concelho, só num cartão de concelho de uma
     medida da tabela das ordens, e uma vez (a K1 confere as duas coisas). */
  'cartao-medida-faixa-concelho',
  /* K2, 02.10.2026: a definição dobrada, um `<details>` no fim do cartão com a
     pergunta, a frase do que a medida mede e a metade da leitura que diz o que
     o número é. A K1 olha para dentro dela como olha para o primeiro nível (a
     frase conta como frase), e a K19 (`tests/cartao/ordem.mjs`) confere a ordem
     e que nenhuma definição fica fora dela. */
  'cartao-medida-dobra',
]);
/** As séries de países e a tabela dos nomes, pelo leitor próprio dos portões (K1, K18). */
const SERIES_DA_K18 = lerSeriesDoPortao();
const PAISES_DA_K18 = lerPaisesDoPortao();

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
  /* O TETO DO ÍNDICE DE DÍVIDA NA LINHA DO ESTADO (passagem P4-c, 02.10.2026): a régua do cartão cita a linha do limite
     sem marca própria, e a porta dela é a aritmética do recibo da linha do cartão, que liga cada linha de onde o índice
     é calculado. Os pares recolhem-se aqui e conferem-se no fim contra as ligações da aritmética de cada recibo. */
  /** @type {{ rota: string, cartao: string, linha: string, lang: string }[]} */
  const limites = [];
  /** @type {Map<string, Set<string>>} */
  const derivacoes = new Map();
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
    /* K14, UE1d (§1.140): os cartões das medidas cuja comparação com a União
       exige a ressalva, e os cartões e os recibos vistos com a União e com ela. */
    cartoes_da_k14: 0,
    cartoes_com_uniao_e_ressalva: 0,
    recibos_com_uniao_e_ressalva: 0,
    cartoes_com_veredicto: 0,
    /* UE1: os cartões com a faixa da União, e o que a K18 conferiu nelas. */
    cartoes_com_faixa: 0,
    /* L2b: os cartões de concelho com a faixa do concelho (K1). */
    cartoes_com_faixa_do_concelho: 0,
    faixas_k18: 0,
    plantas_k18: 0,
    /* UE1b: as ressalvas das pontas, e as palavras da faixa (F19g, F19h). */
    ressalvas_k18: 0,
    ordinais_k18: 0,
    plantas_das_palavras_k18: 0,
    plantas_dos_empates_k18: 0,
    /* K2: a ordem do cartão (K19). */
    ordem_cartoes: 0,
    ordem_com_dobra: 0,
    ordem_faixa_da_uniao: 0,
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

      /* K18 · a faixa da União, refeita dos pontos (UE1, 29.09.2026). A mesma
         célula da F19 do `check:formas`; as plantas correm com `--prova`, sobre as
         páginas dos temas. */
      const html = fs.readFileSync(f, 'utf8');
      if (html.includes('data-cartao-medida') || html.includes('data-faixa-ue')) {
        const k18 = conferirFaixas(root, langPagina, rota, { series: SERIES_DA_K18, paises: PAISES_DA_K18 });
        for (const e of k18.erros) erros.push(`K18 · ${e}`);
        contas.faixas_k18 += k18.contas.faixas;
        contas.ressalvas_k18 += k18.contas.ressalvas;

      }

      /* K19 · a ordem do cartão, lida no documento (bloco K2, 02.10.2026). */
      if (html.includes('cartao-medida') || html.includes('data-faixa')) {
        const k19 = conferirOrdemDaPagina(root, langPagina, rota);
        erros.push(...k19.erros);
        contas.ordem_cartoes += k19.contas.cartoes;
        contas.ordem_com_dobra += k19.contas.com_dobra;
        contas.ordem_faixa_da_uniao += k19.contas.faixa_da_uniao;
      }

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
      /* P4-c: as linhas que a aritmética do recibo liga (as de onde a linha é calculada), pelo endereço da porta. */
      const ligadas = root.querySelectorAll('a.linha-deriva-ligacao[href]');
      if (ligadas.length) {
        derivacoes.set(rota.replace(/\/$/, ''), new Set(ligadas.map((a) => String(a.getAttribute('href')).replace(/\/$/, '').split('/').pop())));
      }

      /* K14 · OS RECIBOS DAS MEDIDAS DA LISTA QUE MOSTRAM A UNIÃO (UE1d, §1.140):
         o recibo da linha, quando o enquadramento traz a linha da União, e o
         recibo da série, que traz sempre o ponto da União. */
      for (const [idK14, razao] of RESSALVA_COM_A_UNIAO) {
        const serieK14 = serieDaLinhaDoPortao(SERIES_DA_K18, idK14);
        const daLinha = rota === `/livro-razao/${idK14}/` || rota === `/en/ledger/${idK14}/`;
        const daSerie = Boolean(serieK14) && (rota === `/livro-razao/series/${serieK14.id}/` || rota === `/en/ledger/series/${serieK14.id}/`);
        if (!daLinha && !daSerie) continue;
        const mostraUniao = daSerie || root.querySelectorAll(`#enquadramento [data-claim="${idK14}-ue"]`).length > 0;
        if (!mostraUniao) continue;
        const r14 = conferirRessalva(root, idK14, langPagina);
        if (r14) erros.push(`K14 · ${rota} · ${idK14}: o recibo mostra a União e ${r14}: ${razao}`);
        else contas.recibos_com_uniao_e_ressalva++;
      }

      /* K15: a conta independente exige palavra, direção, referência e cor.
         Inclui a faixa europeia, mesmo não usando CartaoDaMedida. */
      for (const cartao of root.querySelectorAll('[data-cartao-medida], [data-faixa] [data-cartao]')) {
        const id = cartao.getAttribute('data-cartao-medida') ?? cartao.getAttribute('data-cartao');
        if (!REFERENCIAS_DAS_MEDIDAS.has(id)) {
          // Os limites legais mantêm a sua palavra própria; a cor também não
          // pode ficar sozinha nesses cartões de lugares.
          for (const estado of ['fora', 'dentro']) {
            if (!cartao.querySelector(`.sq-${estado}, .est-${estado}`)) continue;
            const palavra = textoVisivel(cartao.querySelector(`.est-${estado}`) ?? parse('<span></span>'));
            const formas = langPagina === 'en' ? { fora: /\boutside\b/, dentro: /\bwithin\b/ } : { fora: /\bfora\b/, dentro: /\bdentro\b/ };
            if (!formas[estado].test(palavra)) erros.push(`K15 · ${id}: cor sem a palavra do estado «${estado}» · ${rota}`);
          }
          continue;
        }
        contas.cartoes_com_veredicto++;
        erros.push(...auditarVeredicto(cartao, id, langPagina).map(e => `${e} · ${rota}`));
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
        /* K2: o que está dentro da dobra conta como se estivesse ao primeiro nível, menos a linha que a abre. */
        const dobraDoCartao = cartao.childNodes.find((n) => /** @type {any} */ (n).getAttribute?.('class')?.split(/\s+/).includes('cartao-medida-dobra'));
        const filhosDaDobra = dobraDoCartao ? dobraDoCartao.childNodes.filter((n) => /** @type {any} */ (n).tagName && String(/** @type {any} */ (n).rawTagName).toLowerCase() !== 'summary') : [];
        for (const filho of [...cartao.childNodes, ...filhosDaDobra]) {
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
        /* UE1: a faixa da União é a sexta coisa só num cartão com série de países,
           e uma vez. Noutro cartão é um bloco a mais, como qualquer outro. */
        const faixasNoCartao = classes.filter((c) => c === 'cartao-medida-faixa').length;
        if (faixasNoCartao && !serieDaLinhaDoPortao(SERIES_DA_K18, id)) {
          erros.push(`K1 · ${rota} · ${id}: o cartão tem a faixa da União e a linha não tem série de países em ledger/series/`);
        }
        if (faixasNoCartao > 1) erros.push(`K1 · ${rota} · ${id}: o cartão tem ${faixasNoCartao} faixas da União`);
        if (faixasNoCartao) contas.cartoes_com_faixa++;
        /* UE1d: a ressalva da comparação com a União só nas medidas da K14, e uma vez. */
        const ressalvasNoCartao = classes.filter((c) => c === 'cartao-medida-ressalva').length;
        if (ressalvasNoCartao && !RESSALVA_COM_A_UNIAO.has(id)) {
          erros.push(`K1 · ${rota} · ${id}: o cartão tem a ressalva da comparação com a União e a medida não está na lista da K14`);
        }
        if (ressalvasNoCartao > 1) erros.push(`K1 · ${rota} · ${id}: o cartão tem ${ressalvasNoCartao} ressalvas da comparação com a União`);
        /* L2b: a faixa do concelho só num cartão de concelho de uma medida com faixa, e uma vez.
           L2b-b: uma contagem não tem faixa (a tabela di-lo por medida, com a razão). */
        const faixasDoConcelho = classes.filter((c) => c === 'cartao-medida-faixa-concelho').length;
        const chaveDoConcelho = cartao.getAttribute('data-medida-chave');
        const declaracaoDaFaixa = chaveDoConcelho ? FAIXA_DAS_MEDIDAS_DO_CONCELHO[chaveDoConcelho] : undefined;
        if (faixasDoConcelho && !declaracaoDaFaixa) {
          erros.push(`K1 · ${rota} · ${id}: o cartão tem a faixa do concelho e não é um cartão de concelho de uma medida da tabela das ordens`);
        } else if (faixasDoConcelho && !declaracaoDaFaixa.faixa) {
          erros.push(`K1 · ${rota} · ${id}: o cartão tem a faixa do concelho e a medida «${chaveDoConcelho}» é uma contagem, que não tem faixa`);
        }
        if (faixasDoConcelho > 1) erros.push(`K1 · ${rota} · ${id}: o cartão tem ${faixasDoConcelho} faixas do concelho`);
        if (faixasDoConcelho) contas.cartoes_com_faixa_do_concelho++;
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
            /* L1: a leitura do cartão também cita a linha do próprio cartão, e a
               porta dela é a marca única que a primeira metade desta célula já
               conta; não é uma linha de enquadramento e o recibo não a lista. */
            if (daRegua === id && item.hasAttribute('data-cartao-leitura')) continue;
            /* L2b: a faixa do concelho escreve o valor do próprio cartão, cuja porta
               é a mesma marca única; a linha de Portugal que ela escreve fica
               nas enquadradas, e o recibo tem de a listar. */
            if (daRegua === id && item.hasAttribute('data-faixa-concelho')) continue;
            /* P4-c: o teto na linha do estado do cartão do índice de dívida; a porta é a aritmética do recibo. */
            if (daRegua && item.getAttribute('data-regua') === 'limite') {
              limites.push({ rota, cartao: id, linha: daRegua, lang: langPagina });
              continue;
            }
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
        if (RESSALVA_COM_A_UNIAO.has(id)) {
          contas.cartoes_da_k14++;
          const mostraUniao =
            cartao.querySelectorAll('[data-regua="ue"]').length +
              cartao.querySelectorAll(`[data-claim="${id}-ue"]`).length +
              cartao.querySelectorAll('[data-faixa-ue]').length > 0;
          if (mostraUniao) {
            const r14 = conferirRessalva(cartao, id, langPagina);
            if (r14) erros.push(`K14 · ${rota} · ${id}: o cartão mostra a União e ${r14}: ${RESSALVA_COM_A_UNIAO.get(id)}`);
            else contas.cartoes_com_uniao_e_ressalva++;
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

  /* P4-c: o teto que a linha do estado cita tem de estar ligado na aritmética do recibo da linha do cartão. */
  for (const e of limites) {
    const recibo = e.lang === 'en' ? `/en/ledger/${e.cartao}` : `/livro-razao/${e.cartao}`;
    const ligadas = derivacoes.get(recibo);
    if (!ligadas || !ligadas.has(e.linha)) {
      erros.push(
        `K10 · ${e.rota} · ${e.cartao}: a linha do estado cita o teto «${e.linha}» sem marca própria, e a aritmética do ` +
          `recibo «${recibo}» não o liga: o valor fica sem porta para a sua linha`,
      );
    }
  }
  contas.tetos_na_linha_do_estado = limites.length;

  /* ------------------------------------------------------------------- K18 */
  /* UE1b: as palavras da faixa, uma vez por corrida e sem página (o ordinal
     inglês contra a tabela escrita dos 27, as palavras de cada marca que um
     ponto leva), a mesma função da F19; as plantas correm com `--prova`. */
  const palavrasK18 = conferirPalavrasDaFaixa(SERIES_DA_K18);
  for (const e of palavrasK18.erros) erros.push(`K18 · ${e}`);
  contas.ordinais_k18 = palavrasK18.contas.ordinais;
  if (PROVA && SERIES_DA_K18.size && !palavrasK18.erros.length) {
    for (const planta of plantasDasPalavrasDaFaixa(SERIES_DA_K18)) {
      contas.plantas_das_palavras_k18++;
      if (!planta.passou) erros.push(`K18 · a planta «${planta.nome}» não mordeu (${planta.porque})`);
    }
    /* UE1c: os empates num extremo, em memória. */
    for (const lingua of /** @type {const} */ (['pt', 'en'])) {
      for (const planta of plantasDosEmpates(SERIES_DA_K18, PAISES_DA_K18, lingua)) {
        contas.plantas_dos_empates_k18++;
        if (!planta.passou) erros.push(`K18 · a planta «${planta.nome}» (${lingua}) não mordeu (${planta.porque})`);
      }
    }
  }

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
      `<p class="cartao-medida-regua"><span class="sq sq-fora"></span><span class="est-fora" data-veredicto-referencia="fora">${veredictoEsperado('precos-da-habitacao-2025', 'pt').texto.replace(/(\d+)/g, '<span data-nonledger="limiar-do-quadro">$1</span>')}</span></p>` +
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
      /* PLANTA 10 (K14, UE1d): o cartão da sobrecarga com a média europeia e sem a
         ressalva da Comissão. */
      '<article data-cartao-medida="sobrecarga-do-custo-da-habitacao-2025">' +
      '<span class="cartao-medida-nome">Sobrecarga do custo da habitação</span>' +
      '<p class="cartao-medida-valor"><span data-claim="sobrecarga-do-custo-da-habitacao-2025">6,3</span>' +
      chip('sobrecarga-do-custo-da-habitacao-2025') + '</p>' +
      '<p class="cartao-medida-regua"><span data-regua="ue" data-selo-em="sobrecarga-do-custo-da-habitacao-2025">' +
      '<span data-claim="sobrecarga-do-custo-da-habitacao-2025-ue">7,7</span></span></p>' +
      '</article>' +
      /* PLANTA 11 (K1, UE1): a faixa da União num cartão cuja linha não tem série
         de países. É um bloco a mais, e a K1 recusa-o. */
      '<article data-cartao-medida="formacao-bruta-de-capital-fixo-2025">' +
      '<span class="cartao-medida-nome">Formação bruta de capital fixo</span>' +
      '<p class="cartao-medida-valor"><span data-claim="formacao-bruta-de-capital-fixo-2025">19,8</span>' + chip('formacao-bruta-de-capital-fixo-2025') + '</p>' +
      '<div class="cartao-medida-faixa" data-faixa-ue="divida-publica-2025-paises"></div>' +
      '</article>' +
      /* PLANTA 13 (K1, L2b): a faixa do concelho num cartão nacional, que não é um
         cartão de concelho. É um bloco a mais, e a K1 recusa-o. */
      '<article data-cartao-medida="taxa-de-desemprego-2024">' +
      '<span class="cartao-medida-nome">Taxa de desemprego</span>' +
      '<p class="cartao-medida-valor"><span data-claim="taxa-de-desemprego-2024">6,5</span>' + chip('taxa-de-desemprego-2024') + '</p>' +
      '<div class="cartao-medida-faixa-concelho" data-faixa-concelho="ganho"></div>' +
      '</article>' +
      /* PLANTA 14 (K1, L2b-b): a faixa do concelho no cartão de uma contagem (a
         população de Évora). Uma contagem não se ordena, e a K1 recusa-a. */
      '<article class="cartao-medida" data-cartao-medida="evora-populacao-2025" data-medida-chave="populacao">' +
      '<span class="cartao-medida-nome">População residente</span>' +
      '<p class="cartao-medida-valor"><span data-claim="evora-populacao-2025">58 567</span>' + chip('evora-populacao-2025') + '</p>' +
      '<div class="cartao-medida-faixa-concelho" data-faixa-concelho="populacao"></div>' +
      '</article>' +
      /* PLANTA 6 (K8): a legenda da marca numa página de área. */
      '<p class="marca-legenda">Ao pé de cada número, a marca da fonte.</p>' +
      '</body></html>',
  );
  /* PLANTA 12 (K14, UE1d): o recibo da série da sobrecarga sem a ressalva. */
  fs.mkdirSync(path.join(dir, 'livro-razao', 'series', 'sobrecarga-do-custo-da-habitacao-2025-paises'), { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'livro-razao', 'series', 'sobrecarga-do-custo-da-habitacao-2025-paises', 'index.html'),
    '<!doctype html><html lang="pt"><head><title>x</title></head><body>' +
      '<h1>Sobrecarga do custo da habitação nos países da União</h1>' +
      '<table data-serie-tabela="sobrecarga-do-custo-da-habitacao-2025-paises"><tbody>' +
      '<tr data-serie-ponto="sobrecarga-do-custo-da-habitacao-2025-paises#EU27_2020"><th>União Europeia</th><td>7,7</td></tr>' +
      '</tbody></table></body></html>',
  );
  /* O CONTROLO DA K14 (UE1d): um cartão e um recibo da linha certos, com a União e
     com a ressalva, que não podem dar vermelho. */
  /* Sem a ressalva na declaração, o controlo leva um bloco vazio e dá vermelho
     com a razão («a declaração não tem o texto da ressalva desta medida»), e a
     prova diz porquê em vez de o guião rebentar: a planta da declaração das
     plantas da UE1d fechava a construção com um TypeError nesta linha. */
  const ressalva = RESSALVAS_DA_UNIAO['sobrecarga-do-custo-da-habitacao-2025']?.pt ?? '';
  fs.mkdirSync(path.join(dir, 'areas', 'y'), { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'areas', 'y', 'index.html'),
    '<!doctype html><html lang="pt"><head><title>y</title></head><body>' +
      '<article data-cartao-medida="sobrecarga-do-custo-da-habitacao-2025">' +
      '<span class="cartao-medida-nome">Sobrecarga do custo da habitação</span>' +
      '<p class="cartao-medida-valor"><span data-claim="sobrecarga-do-custo-da-habitacao-2025">6,3</span>' +
      chip('sobrecarga-do-custo-da-habitacao-2025') + '</p>' +
      '<p class="cartao-medida-regua"><span data-regua="ue" data-selo-em="sobrecarga-do-custo-da-habitacao-2025">' +
      '<span data-claim="sobrecarga-do-custo-da-habitacao-2025-ue">7,7</span></span></p>' +
      `<p class="cartao-medida-ressalva" data-ressalva-da-uniao="sobrecarga-do-custo-da-habitacao-2025">${ressalva}</p>` +
      '</article></body></html>',
  );
  fs.mkdirSync(path.join(dir, 'livro-razao', 'sobrecarga-do-custo-da-habitacao-2025'), { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'livro-razao', 'sobrecarga-do-custo-da-habitacao-2025', 'index.html'),
    '<!doctype html><html lang="pt"><head><title>z</title></head><body>' +
      '<section id="enquadramento"><dl><dt>União Europeia</dt><dd><span data-claim="sobrecarga-do-custo-da-habitacao-2025-ue">7,7</span></dd></dl>' +
      `<p class="linha-nota" data-ressalva-da-uniao="sobrecarga-do-custo-da-habitacao-2025">${ressalva}</p></section>` +
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
    ['K14', 'o cartão mostra a União e sem a ressalva'],
    ['K14', 'o recibo mostra a União e sem a ressalva'],
    ['K1', 'a faixa da União e a linha não tem série'],
    ['K1', 'a faixa do concelho e não é um cartão de concelho'],
    ['K1', 'a faixa do concelho e a medida «populacao» é uma contagem'],
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
  /* O CONTROLO DA K14 (UE1d): o cartão e o recibo certos não podem dar vermelho. */
  const noControloK14 = r.erros.filter((e) => e.startsWith('K14 · /areas/y/') || e.startsWith('K14 · /livro-razao/sobrecarga-do-custo-da-habitacao-2025/'));
  if (noControloK14.length > 0) {
    falhas.push(`o controlo da K14 deu ${noControloK14.length} vermelho(s): ${noControloK14[0]}`);
  }
  /* O CARTÃO SÃO NÃO PODE DAR VERMELHO, e é a outra metade da prova: uma régua
     que grite por tudo também diz sempre alguma coisa. */
  const noSao = r.erros.filter((e) => e.includes('precos-da-habitacao-2025'));
  if (noSao.length > 0) {
    falhas.push(`o cartão são deu ${noSao.length} vermelho(s): ${noSao[0]}`);
  }

  /* K15: as quatro formas, igualdade e banda exterior, com linha em memória.
     A planta tira só a palavra e deixa a cor, depois troca só a cor. */
  for (const lang of ['pt', 'en']) {
    for (const [id, valor] of [['saldo-das-administracoes-publicas-2025', null], ['crescimento-da-despesa-liquida-2025', null], ['divida-publica-2025', null], ['divida-das-familias-2025', null], ['saldo-da-balanca-corrente-2025', null], ['saldo-da-balanca-corrente-2025', '7'], ['divida-publica-2025', '60']]) {
      const linha = valor === null ? undefined : { value: valor };
      const esperado = veredictoEsperado(id, lang, linha);
      const html = `<article><span class="sq sq-${esperado.estado}"></span><span class="est-${esperado.estado}" data-veredicto-referencia="${esperado.estado}">${esperado.texto}</span></article>`;
      const ler = h => auditarVeredicto(parse(h), id, lang, linha);
      if (ler(html).length) falhas.push(`K15 recusa ${id} ${lang}`);
      const semPalavra = html.replace(esperado.texto, '');
      if (!ler(semPalavra).some(e => e.includes('veredicto em palavras'))) falhas.push(`K15 não viu cor sem palavra ${id} ${lang}`);
      const semDono = html.replace(/ do Pacto| do Conselho da UE| of the Pact| of the Council of the EU/, '');
      if (semDono !== html && !ler(semDono).some(e => e.includes('veredicto em palavras'))) falhas.push(`K15 não viu referência sem dono ${id} ${lang}`);
      const corTrocada = html.replace(`sq-${esperado.estado}`, `sq-${esperado.estado === 'fora' ? 'dentro' : 'fora'}`);
      if (!ler(corTrocada).some(e => e.includes('cor não repete'))) falhas.push(`K15 não viu a cor trocada ${id} ${lang}`);
      if (ler(html).length) falhas.push(`K15 recusa reposição ${id} ${lang}`);
    }
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

  /* A mesma K6, com as duas glosas: verde antes, vermelha quando se troca cada
     glosa. Nenhum valor de medida entra nesta planta.

     DESDE O BLOCO R1 (23.09.2026, I142) NENHUMA DEFINIÇÃO DECLARADA TRAZ
     MARCADOR: as duas das empresas, que o traziam, escrevem «sociedades não
     financeiras», provadas pela resposta do Eurostat ao pedido da linha. A
     conferência das glosas continua no cartão para o dia em que um marcador
     volte, e esta planta passa a exercê-la com a frase real da medida seguida de
     um marcador, posta na declaração EM MEMÓRIA só durante a prova e reposta no
     `finally`. Sem isto, a planta corria sobre um marcador que já não existe. */
  const glosasDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oedp-cartao-glosas-'));
  const id = 'divida-das-empresas-2025';
  const declaradas = /** @type {any} */ (DEFINICOES_DAS_MEDIDAS);
  const real = declaradas[id];
  try {
    declaradas[id] = { ...real, en: [...real.en.map((p) => typeof p === 'string' ? p.replace(/\.$/, '') : p),
      '; the name behind the words remains ', { marcador: 'a verificar', gloss: 'to verify' }, '.'] };
    fs.mkdirSync(path.join(glosasDir, 'en'));
    const frase = declaradas[id].en.map((/** @type {any} */ p) => typeof p === 'string' ? p :
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
  } finally {
    declaradas[id] = real;
    fs.rmSync(glosasDir, { recursive: true, force: true });
  }

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

  // K9: testemunha nacional verdadeira, número trocado e direção trocada.
  const linhasNacionais = loadClaims();
  for (const id of ['saldo-das-administracoes-publicas-2025', 'crescimento-da-despesa-liquida-2025']) {
    const linha = linhasNacionais.get(id);
    const f = REFERENCIAS_DAS_MEDIDAS.get(id);
    const testemunha = referenciaNacionalDaLinha(id, linha);
    if (!testemunha || compararAsDuasTestemunhas(id, testemunha, ladosDoLimiar(f.limiar), false)) falhas.push(`K9 nacional recusou ${id}`);
    const trocado = { ...f.limiar, nl: String(Number(f.limiar.nl) + 1) };
    if (!compararAsDuasTestemunhas(id, testemunha, ladosDoLimiar(trocado), false)) falhas.push(`K9 nacional não viu valor trocado ${id}`);
    const direcao = { ...testemunha, sentido: testemunha.sentido === 'inferior' ? 'superior' : 'inferior' };
    if (!compararAsDuasTestemunhas(id, direcao, ladosDoLimiar(f.limiar), false)) falhas.push(`K9 nacional não viu direção trocada ${id}`);
    if (referenciaNacionalDaLinha(id, { ...linha, excerpt: '', note: '' })) falhas.push(`K9 nacional aceitou testemunha apagada ${id}`);
  }

  /* -------------------------------------------------------------------- K16
     AS PLANTAS DAS PERGUNTAS, todas em memória: a declaração, a auditoria e as
     origens são cópias, e nada se escreve no disco. A primeira repete o defeito
     que a leitura a frio achou: a pergunta do desemprego de longa duração com a
     única origem que tinha antes, e o denominador sem nada que o diga. */
  let plantasDaK16 = 0;
  {
    const limpa = auditarPerguntas();
    if (limpa.erros.length) falhas.push(`K16 recusa a declaração em vigor: ${limpa.erros[0]}`);
    const base = lerAuditoriaDasPerguntas();
    const definicoes = /** @type {Record<string, any>} */ (DEFINICOES_DAS_MEDIDAS);
    const origensReais = /** @type {Record<string, any>} */ (ORIGENS_DAS_DEFINICOES);
    const unidadesReais = /** @type {Record<string, any>} */ (UNIDADES_DOS_CARTOES);
    /** @param {(a: any) => void} estraga */
    const auditoriaCom = (estraga) => { const c = structuredClone(base); estraga(c); return c; };
    /** @param {any} a @param {string} id */
    const dela = (a, id) => a.perguntas.find((/** @type {any} */ q) => q.id === id);
    /** @type {[string, string, string, Parameters<typeof auditarPerguntas>[0]][]} */
    const plantas = [
      ['a origem selada tirada à pergunta', 'desemprego-de-longa-duracao-2025', 'que a pergunta não declara como origem',
        { definicoes: { ...definicoes, 'desemprego-de-longa-duracao-2025': { ...definicoes['desemprego-de-longa-duracao-2025'], origens: ['glossario-longa-duracao'] } } }],
      ['a pergunta mudada sem nova leitura', 'divida-publica-2025', 'os pedaços juntos',
        { definicoes: { ...definicoes, 'divida-publica-2025': { ...definicoes['divida-publica-2025'], pt: ['Quanto devem as administrações públicas, em percentagem do que o país produz num ano?'] } } }],
      ['um literal que o campo não tem', 'desemprego-de-longa-duracao-2025', 'que não está no campo',
        { auditoria: auditoriaCom((a) => { dela(a, 'desemprego-de-longa-duracao-2025').pedacos[0].apoios[0].literal = 'as a percentage of the labour force'; }) }],
      ['um pedaço sem apoio', 'risco-de-pobreza-ou-exclusao-2025', 'não tem apoio nenhum',
        { auditoria: auditoriaCom((a) => { dela(a, 'risco-de-pobreza-ou-exclusao-2025').pedacos[4].apoios = []; }) }],
      ['uma pergunta sem auditoria', 'jovens-nem-2025', 'não tem auditoria',
        { auditoria: auditoriaCom((a) => { a.perguntas = a.perguntas.filter((/** @type {any} */ q) => q.id !== 'jovens-nem-2025'); }) }],
      /* UE2-b (02.10.2026): a pergunta da dívida pública declara agora também a descrição do PIB do Eurostat, que apoia
         o que o PIB mede; a planta junta a origem sem uso às duas declaradas, para morder só pelo que diz. */
      ['uma origem declarada sem uso', 'divida-publica-2025', 'não apoia pedaço nenhum',
        { definicoes: { ...definicoes, 'divida-publica-2025': { ...definicoes['divida-publica-2025'], origens: ['pdm-divida-publica', 'eurostat-tipsna40-descricao', 'painel-pdm'] } },
          auditoria: auditoriaCom((a) => { dela(a, 'divida-publica-2025').origens = ['pdm-divida-publica', 'eurostat-tipsna40-descricao', 'painel-pdm']; }) }],
      ['outra linha citada', 'taxa-de-emprego-2025', 'só a linha da própria medida conta',
        { auditoria: auditoriaCom((a) => { dela(a, 'taxa-de-emprego-2025').pedacos[1].apoios[0].linha = 'taxa-de-desemprego-2025'; }) }],
      ['um literal curto', 'divida-publica-2025', 'menos de 4 caracteres',
        { auditoria: auditoriaCom((a) => { dela(a, 'divida-publica-2025').pedacos[1].apoios[0].literal = 'GDP'; }) }],
      ['o selo tirado', 'origem «eurostat-tesem130-denominador»', 'não traz o selo do pedido',
        { origens: { ...origensReais, 'eurostat-tesem130-denominador': { ...origensReais['eurostat-tesem130-denominador'], selo: undefined } } }],
      ['o sha256 tirado', 'origem «eurostat-tipspd30»', 'o selo não diz o sha256',
        { origens: { ...origensReais, 'eurostat-tipspd30': { ...origensReais['eurostat-tipspd30'], selo: { ...origensReais['eurostat-tipspd30'].selo, sha256: '' } } } }],
      /* K2-c: a unidade da casa fora da pergunta, e as coordenadas de uma origem que a resposta não escreve. Desde o
         bloco R2 (03.10.2026) a unidade da casa declara-se em `UNIDADES_DOS_CARTOES`, e é aí que a planta a estraga. */
      ['a unidade da casa fora da pergunta', 'disparidade-de-emprego-entre-sexos-2025', 'não é um pedaço da pergunta declarada',
        { unidades: { ...unidadesReais, 'disparidade-de-emprego-entre-sexos-2025': { ...unidadesReais['disparidade-de-emprego-entre-sexos-2025'], pt: ['% da população'] } } }],
      /* R2 (03.10.2026): o apoio de uma unidade da casa num campo da linha que não o tem, numa origem que não o diz, e
         uma unidade sem apoio nenhum. */
      ['um apoio da unidade da casa que a linha não tem', 'jovens-nem-2025', 'no campo «excerpt» da linha, e não está lá',
        { unidades: { ...unidadesReais, 'jovens-nem-2025': { ...unidadesReais['jovens-nem-2025'], apoio: [{ campo: 'excerpt', literal: 'Age class: From 15 to 24 years' }] } } }],
      ['um apoio da unidade da casa que a origem não diz', 'competencias-digitais-2025', 'da origem «eurostat-tepsr_sp410-descricao», e não está lá',
        { unidades: { ...unidadesReais, 'competencias-digitais-2025': { ...unidadesReais['competencias-digitais-2025'], apoio: [{ origem: 'eurostat-tepsr_sp410-descricao', campo: 'excerto', literal: 'individuals aged 15-74' }] } } }],
      ['uma unidade da casa sem apoio', 'licencas-de-construcao-2025', 'não declara apoio nenhum',
        { unidades: { ...unidadesReais, 'licencas-de-construcao-2025': { ...unidadesReais['licencas-de-construcao-2025'], apoio: [] } } }],
      /* R2-b (04.10.2026, achado 6 da leitura a frio): as idades da unidade que o excerto de apoio não diz (21 a 65 com
         o excerto 20 a 64), e o apoio citado de uma origem que não é da linha. */
      ['as idades da unidade que o apoio não diz', 'taxa-de-emprego-2025', 'o número «21» da unidade da casa (pt) não está em nenhum literal de apoio achado',
        { unidades: { ...unidadesReais, 'taxa-de-emprego-2025': { ...unidadesReais['taxa-de-emprego-2025'],
          pt: ['% das pessoas dos ', { nl: '21', motivo: 'escala-de-instrumento' }, ' aos ', { nl: '65', motivo: 'escala-de-instrumento' }, ' anos'],
          en: ['% of people aged ', { nl: '21', motivo: 'escala-de-instrumento' }, ' to ', { nl: '65', motivo: 'escala-de-instrumento' }] } } }],
      ['o apoio de uma origem que não é da linha', 'jovens-nem-2025', 'que não é da linha',
        { unidades: { ...unidadesReais, 'jovens-nem-2025': { ...unidadesReais['jovens-nem-2025'], apoio: [...unidadesReais['jovens-nem-2025'].apoio, { origem: 'eurostat-tepsr_sp410-descricao', campo: 'excerto', literal: 'individuals aged 16-74' }] } } }],
      ['as coordenadas de outra classe etária', 'origem «eurostat-tipslm90-sexo»', 'não são um segmento do excerto',
        { origens: { ...origensReais, 'eurostat-tipslm90-sexo': { ...origensReais['eurostat-tipslm90-sexo'], coordenadas: 'Age class: From 15 to 24 years' } } }],
    ];
    plantasDaK16 = plantas.length;
    for (const [nome, alvo, mordida, entrada] of plantas) {
      const vistos = auditarPerguntas(entrada).erros.filter((e) => e.startsWith(`K16 · ${alvo}:`));
      if (!vistos.some((e) => e.includes(mordida))) {
        falhas.push(`K16 NÃO MORDEU ${nome}: ${vistos[0] ?? 'nenhum vermelho para ' + alvo}`);
      }
    }
    if (auditarPerguntas().erros.length) falhas.push('K16: a declaração em vigor deixou de passar depois das plantas');
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
        `K9 nacional com valor, direção e testemunha plantados; K15 palavras e cor, nas duas línguas, nas quatro formas e na igualdade; K6 com as glosas declaradas e com cada uma das duas trocada; K1 com o nome do limite legal declarado, antigo e reposto nas duas línguas; ` +
        `K13 sobre ${celulaK13().medidas} medidas e ${celulaK13().linhas} linhas com grupo etário, com a ` +
        `declaração em vigor a passar e cinco plantas a morder (o limite trocado, dois algarismos ` +
        `soltos fora do intervalo, uma medida sem definição, a etiqueta a contradizer o filtro e ` +
        `duas linhas da mesma medida com grupos diferentes), mais a catraca vazia nas duas metades; ` +
        `K16 com a declaração em vigor a passar e ${plantasDaK16} plantas a morder, a primeira o defeito da leitura a frio`,
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
    if (PROVA) for (const lang of ['pt', 'en']) for (const planta of plantasDaFaixa(documentoDosAssuntos(DIST, lang).outerHTML, lang, `assuntos-${lang}`, { series: SERIES_DA_K18, paises: PAISES_DA_K18 })) {
  r.contas.plantas_k18++;
  if (!planta.passou) r.erros.push(`K18: a planta «${planta.nome}» não mordeu (${planta.porque}).`);
}

const motor = ficheirosDoMotor();

/* -------------------------------------------------------------------- K14 */
/* A declaração tem as ressalvas exactamente das medidas desta lista, e a linha da
   União de cada uma continua a existir; e o positivo conhecido: pelo menos um
   cartão e um recibo de uma medida da lista vistos com a União e com a ressalva,
   ou a célula mediu coisa nenhuma (UE1d, §1.140). */
{
  const declaradas = new Set(Object.keys(RESSALVAS_DA_UNIAO));
  for (const id of declaradas) {
    if (!RESSALVA_COM_A_UNIAO.has(id)) {
      r.erros.push(`K14 · ressalvas-da-uniao.mjs tem a ressalva de «${id}», e nenhuma decisão escrita nesta célula a pede`);
    }
  }
  for (const [id, razao] of RESSALVA_COM_A_UNIAO) {
    if (!declaradas.has(id)) {
      r.erros.push(`K14 · a medida «${id}» exige a ressalva e a declaração não a tem: ${razao}`);
    }
    if (!hasClaim(`${id}-ue`)) {
      r.erros.push(`K14 · a linha da União «${id}-ue» saiu do livro-razão: a comparação que a ressalva acompanha deixou de existir`);
    }
  }
  if (r.contas.cartoes_com_uniao_e_ressalva === 0) {
    r.erros.push('K14 · nenhum cartão de uma medida da lista foi visto com a União e com a ressalva no dist/: a célula não mediu nada');
  }
  if (r.contas.recibos_com_uniao_e_ressalva === 0) {
    r.erros.push('K14 · nenhum recibo de uma medida da lista foi visto com a União e com a ressalva no dist/: a célula não mediu nada');
  }
}

/* --------------------------------------------------------------------- K9 */
/* As duas testemunhas do valor de referência, comparadas medida a medida. Não
   lê o `dist/`: lê os dois registos, que é onde o facto está. */
let k9Comparadas = 0;
let k9Discordantes = 0;
const linhasK9 = loadClaims();
for (const [id, f] of REFERENCIAS_DAS_MEDIDAS) {
  const nacional = f.limiarFixadoPor === 'pacto' || f.limiarFixadoPor === 'conselho';
  const doMotor = nacional ? referenciaNacionalDaLinha(id, linhasK9.get(id)) : valorDeReferenciaDoMotor(id);
  if (!doMotor) {
    r.erros.push(`K9 · ${id}: a referência declarada não tem segunda testemunha legível`);
    continue;
  }
  k9Comparadas++;
  const queixa = compararAsDuasTestemunhas(
    id,
    doMotor,
    ladosDoLimiar(f.limiar),
    Boolean(f.limiar && (f.limiar.inferior || f.limiar.superior)),
  );
  if (queixa) r.erros.push(queixa);
  /* A TESTEMUNHA DISCORDANTE, onde está declarada (passagem de correção do L1). */
  if (f.testemunhaDiscordante) {
    k9Discordantes++;
    r.erros.push(...conferirTestemunhaDiscordante(id, f.testemunhaDiscordante, ladosDoLimiar(f.limiar), f.limiarFixadoPor));
  }
}
r.contas.valores_de_referencia_comparados = k9Comparadas;
r.contas.testemunhas_discordantes_conferidas = k9Discordantes;
r.erros.push(...conferirDiscordanciasDeclaradas(REFERENCIAS_DAS_MEDIDAS));
if (PROVA) {
  /* AS PLANTAS DA TESTEMUNHA DISCORDANTE, em memória, sobre cópias da
     declaração verdadeira da taxa de câmbio efetiva real. */
  const reer = 'taxa-de-cambio-efectiva-real-2025';
  const f = /** @type {any} */ (REFERENCIAS_DAS_MEDIDAS.get(reer));
  /** @param {(t: any) => void} estraga */
  const com = (estraga) => {
    const c = structuredClone(f.testemunhaDiscordante);
    estraga(c);
    return conferirTestemunhaDiscordante(reer, c, ladosDoLimiar(f.limiar), f.limiarFixadoPor);
  };
  const escondida = new Map([...REFERENCIAS_DAS_MEDIDAS].map(([k, v]) => [k, k === reer ? { ...v, testemunhaDiscordante: undefined } : v]));
  /** @type {[string, string[], string][]} */
  const plantas = [
    ['a discordância sem a data de criação do conjunto', com((t) => { delete t.eurostat.criado; }), 'não diz a data de criação'],
    ['a discordância sem a data de leitura da Comissão', com((t) => { delete t.comissao.lido; }), 'não diz a data de leitura'],
    ['a discordância sem quem manda', com((t) => { delete t.manda; }), 'não diz quem manda'],
    ['a Comissão a dizer outro valor', com((t) => { t.comissao.excerto = t.comissao.excerto.replace('-/+3%', '-/+4%'); t.comissao.limiar = '-/+4%'; }), 'quem manda diz'],
    ['a discordância escondida', conferirDiscordanciasDeclaradas(escondida), 'voltou a estar escondida'],
  ];
  const mordeu = (/** @type {string[]} */ queixas, /** @type {string} */ mordida) => queixas.some((x) => x.includes(mordida));
  for (const [nome, queixas, mordida] of plantas) {
    if (!mordeu(queixas, mordida)) r.erros.push(`K9 NÃO MORDEU ${nome}: ${queixas[0] ?? 'nenhum vermelho'}`);
  }
  r.contas.testemunhas_discordantes_plantas = plantas.length;
  r.contas.testemunhas_discordantes_plantas_mordidas = plantas.filter(([, queixas, mordida]) => mordeu(queixas, mordida)).length;
  r.contas.testemunhas_discordantes_plantas_nomes = plantas.map(([nome]) => nome);
}

/* -------------------------------------------------------------------- K16 */
/* Cada pedaço de cada pergunta com a sua origem. Não lê o `dist/`: lê a
   auditoria, a declaração e o livro-razão, que é onde o apoio vive. */
{
  const k16 = auditarPerguntas();
  r.erros.push(...k16.erros);
  r.contas.perguntas_auditadas = k16.contas.perguntas;
  r.contas.pedacos_auditados = k16.contas.pedacos;
  r.contas.apoios_das_perguntas = k16.contas.apoios;
  r.contas.origens_seladas = k16.contas.origens_seladas;
}

/* -------------------------------------------------------------------- K17 */
/* A leitura de cada medida: a auditoria (sem `dist/`) e as páginas construídas
   onde os cartões se rendem. As plantas correm com `--prova`, sobre cópias em memória. */
{
  const auditoria = conferirAuditoriaDasLeituras();
  r.erros.push(...auditoria.erros);
  const rendidas = conferirLeiturasRendidas(DIST);
  r.erros.push(...rendidas.erros);
  r.contas.leituras_auditadas = auditoria.contas.medidas;
  r.contas.leituras_partes = auditoria.contas.partes;
  r.contas.leituras_apoios = auditoria.contas.apoios;
  r.contas.leituras_algarismos_declarados = auditoria.contas.algarismos;
  r.contas.leituras_origens = auditoria.contas.origens_das_leituras;
  r.contas.leituras_rendidas = rendidas.contas.leituras;
  r.contas.leituras_cartoes = rendidas.contas.cartoes;
  r.contas.leituras_ramos_recontados = rendidas.contas.ramos;
  if (PROVA) {
    const plantas = plantasDaK17(DIST);
    for (const x of plantas) if (!x.mordeu) r.erros.push(`K17 NÃO MORDEU ${x.nome}: ${x.queixa ?? 'nenhum vermelho'}`);
    r.contas.leituras_plantas = plantas.length;
    r.contas.leituras_plantas_mordidas = plantas.filter((x) => x.mordeu).length;
  }
}

/* K19 · AS PLANTAS DA ORDEM DO CARTÃO (bloco K2, 02.10.2026), sobre cópias em memória de páginas construídas. */
if (PROVA) {
  const plantas = plantasDaOrdem((rel) => fs.readFileSync(path.join(DIST, rel), 'utf8'));
  for (const x of plantas) if (!x.mordeu) r.erros.push(`K19 NÃO MORDEU ${x.nome}: ${x.queixa ?? (x.limpa_sem_erros ? 'nenhum vermelho' : 'a página limpa já tinha erros')}`);
  r.contas.ordem_plantas = plantas.length;
  r.contas.ordem_plantas_mordidas = plantas.filter((x) => x.mordeu).length;
}

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
console.log(cinza(`    tetos na linha do estado (P4-c)                       ${r.contas.tetos_na_linha_do_estado ?? 0} (a porta é a aritmética do recibo)`));
console.log(cinza(`    valores de referência, as duas testemunhas comparadas  ${r.contas.valores_de_referencia_comparados}`));
console.log(
  cinza(
    `      com a testemunha discordante declarada e inteira     ${r.contas.testemunhas_discordantes_conferidas}` +
      (PROVA ? ` (${r.contas.testemunhas_discordantes_plantas_mordidas} de ${r.contas.testemunhas_discordantes_plantas} plantas a morder)` : ''),
  ),
);
console.log(cinza(`    cartões com veredicto conferido (K15)                 ${r.contas.cartoes_com_veredicto}`));
console.log(cinza(`    a União com a ressalva (K14): cartões e recibos        ${r.contas.cartoes_com_uniao_e_ressalva} · ${r.contas.recibos_com_uniao_e_ressalva}`));
console.log(cinza(`    cartões com a faixa da União (K1, K18)                 ${r.contas.cartoes_com_faixa}`));
console.log(cinza(`    cartões de concelho com a faixa do concelho (K1)       ${r.contas.cartoes_com_faixa_do_concelho}`));
console.log(cinza(`    faixas refeitas dos pontos (K18)                       ${r.contas.faixas_k18}${PROVA ? ` · ${r.contas.plantas_k18} planta(s) a morder` : ''}`));
console.log(cinza(`    ressalvas nas pontas e ordinais (K18, UE1b)            ${r.contas.ressalvas_k18} · ${r.contas.ordinais_k18}${PROVA ? ` · ${r.contas.plantas_das_palavras_k18} planta(s) das palavras a morder` : ''}`));
console.log(cinza(`    empates num extremo, em memória (K18, UE1c)            ${PROVA ? `${r.contas.plantas_dos_empates_k18} planta(s) a morder` : 'sem --prova'}`));
console.log(cinza(`    a ordem do cartão (K19): cartões, com dobra, da faixa  ${r.contas.ordem_cartoes} · ${r.contas.ordem_com_dobra} · ${r.contas.ordem_faixa_da_uniao}${PROVA ? ` · ${r.contas.ordem_plantas_mordidas} de ${r.contas.ordem_plantas} plantas a morder` : ''}`));
console.log(cinza(`    medidas com nome oficial no recibo                    ${r.contas.medidas_com_nome_oficial}`));
console.log(
  cinza(
    `    perguntas com cada pedaço apoiado (K16)               ${r.contas.perguntas_auditadas} ` +
      `(${r.contas.pedacos_auditados} pedaços, ${r.contas.apoios_das_perguntas} apoios, ` +
      `${r.contas.origens_seladas} origens seladas no motor)`,
  ),
);
console.log(
  cinza(
    `    leituras dos cartões nacionais (K17)                 ${r.contas.leituras_rendidas} em ${r.contas.leituras_cartoes} cartões ` +
      `(${r.contas.leituras_auditadas} declarações auditadas, ${r.contas.leituras_partes} partes, ${r.contas.leituras_apoios} apoios, ` +
      `${r.contas.leituras_origens} origens, ${r.contas.leituras_ramos_recontados} ramos recontados` +
      (PROVA ? `, ${r.contas.leituras_plantas_mordidas} de ${r.contas.leituras_plantas} plantas a morder)` : ')'),
  ),
);
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
