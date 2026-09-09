#!/usr/bin/env node
/**
 * A RÉGUA DO BLOCO F1.10 · «uma coisa, um lugar».
 *
 * Corre DEPOIS do `astro build`, sobre `dist/`, no `verify`.
 *
 * ---------------------------------------------------------------------------
 * O QUE ELA MEDE, E PORQUE É QUE NENHUMA DAS OUTRAS O MEDE
 * ---------------------------------------------------------------------------
 * O `BRIEF-F1.10-uma-coisa-um-lugar.md` fixa uma regra («cada conteúdo tem um
 * lugar de apresentação inteira; em todo o outro sítio aparece como uma porta ou
 * não aparece»), um vocabulário fechado e um caminho no cabeçalho. Nenhuma das
 * outras réguas do sítio sabe nada disto: o portão de HTML confere origens, o da
 * voz confere que cada frase está declarada, o das formas confere o que um
 * desenho pode desenhar. Uma repetição de conteúdo é HTML válido, com origem
 * declarada e frase inventariada, e passa nas três.
 *
 * Sem esta régua, o que o bloco arruma fica guardado pela leitura de quem revê o
 * diff, e volta ao primeiro descuido.
 *
 * ---------------------------------------------------------------------------
 * OS TETOS, E PORQUE É QUE ELES EXISTEM EM VEZ DE UM ZERO
 * ---------------------------------------------------------------------------
 * O bloco é longo e entra por itens: cada item baixa um teto, e o teto é o
 * número MEDIDO no dia em que o item entrou, escrito aqui com a data. Um teto
 * NUNCA sobe sem uma decisão escrita ao lado, e a régua falha quando a medição
 * passa dele — que é o que a torna uma régua e não um relatório.
 *
 * A régua também falha quando a medição fica ABAIXO de um teto que já devia ter
 * descido: `TETO_FROUXO` diz quantas unidades de folga um teto pode ter antes de
 * ser um teto que já não mede nada. Um teto frouxo é uma régua a dormir.
 *
 * UM TETO SÓ SOBE POR UMA RAZÃO, E ELA ESCREVE-SE: o sítio ganhou uma página, e
 * a página nova traz a mesma mobília que todas as outras trazem. Um teto que
 * suba porque uma página ANTIGA piorou é a régua a ser desligada, e isso não se
 * faz: corrige-se a página.
 *
 * ---------------------------------------------------------------------------
 * AS EXCEÇÕES, ESCRITAS POR NOME
 * ---------------------------------------------------------------------------
 * O §3 do brief põe DUAS FAMÍLIAS DE PÁGINAS inteiras fora do bloco: os
 * documentos alojados (rota `documento`) e as páginas de leitura (rota `texto`).
 * São transcrição — o texto de outra pessoa, publicado como ela o escreveu — e a
 * regra da casa é que o que se copia de uma fonte fica como a fonte o escreveu.
 * Saem por NOME DE ROTA, e não por um salto silencioso.
 *
 * As outras três exceções são CADEIAS, e estão em `EXCECOES_DO_VOCABULARIO`,
 * cada uma com a razão e com a origem. A régua exige que cada uma seja ENCONTRADA
 * pelo menos uma vez no `dist/`: uma exceção que já não é precisa é uma porta
 * aberta esquecida, e fecha a construção como uma violação fecharia.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, NodeType } from 'node-html-parser';

import { matchPath, routePath, normalizePath, LANGS } from '../src/lib/routes.mjs';
import { loadClaims } from '../src/lib/ledger.mjs';
import { t } from '../src/i18n/strings.mjs';
/* A DECLARAÇÃO DAS DEFINIÇÕES DOS DOIS PAINÉIS (item 8.4). A régua lê-a em vez
   de guardar uma segunda cópia do texto: os dois lados da comparação deixam de
   ser a mesma frase escrita duas vezes. */
import { DEFINICAO_DOS_PAINEIS } from '../src/data/figuras.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(RAIZ, 'dist');

/* ---------------------------------------------------------------------------
 * AS DUAS FAMÍLIAS DE FORA (§3 do brief)
 * --------------------------------------------------------------------------- */
const ROTAS_DE_TRANSCRICAO = new Set(['documento', 'texto']);

/* A página de erro não tem caminho na tabela de rotas e não é uma página do
   leitor: é o que o servidor devolve quando não há página nenhuma.

   O NOME DO FICHEIRO INGLÊS ESTAVA ERRADO, e ninguém o via (09.09.2026). A lista
   dizia `en/404.html`, e esse ficheiro não existe: a Astro escreve a página de
   erro portuguesa em `dist/404.html`, por ser a da raiz, e a inglesa em
   `dist/en/404/index.html`, como todas as outras. Enquanto NENHUMA página tinha
   caminho, a exceção que falhava não se notava: a página de erro inglesa contava
   como mais uma das 7 213. Com o caminho posto, ficou a ser a única, e o nome
   errado veio à superfície. Conferido no `dist/` antes de se corrigir:
   `ls dist/404.html dist/en/404*`. */
const FICHEIROS_SEM_ROTA = new Set(['404.html', 'en/404/index.html']);

/* ---------------------------------------------------------------------------
 * OS TETOS
 * ---------------------------------------------------------------------------
 * Cada linha diz: a medida, o teto, e a data em que o número foi medido. O
 * número é sempre o que a própria régua imprime, e nunca um palpite.
 */
const TETO_FROUXO = 8;
const TETOS = {
  /* L1 · páginas com dois destinos iguais fora do cabeçalho e do rodapé.
     TODOS os tetos desta tabela foram medidos a 08.09.2026 sobre o `dist/` da
     fusão de `origin/main` (43f4b52a) na cabeça `47d957f6`, com
     `node scripts/check-lugar.mjs`, e nenhum foi escrito à mão. */
  /* DESCE DE 6 598 PARA 6 580 a 09.09.2026, e não por se ter medido melhor: as
     24 páginas de estudo tinham as mesmas portas duas vezes (o bloco «O
     documento original» em cima e a fila de cada edição em baixo), e o item 8.6
     fundiu-as numa forma só. Dezoito páginas deixaram de ter dois destinos
     iguais. */
  l1_paginas: 6580,
  /* L2a · páginas, fora de `/municipios`, que ligam a mais de `L2_LIMITE_NOMES`
     concelhos fora de uma lista fechada.
     DESCE DE 2 PARA 0 a 09.09.2026, por decisão do lugar de direção, e a régua
     ganhou três conferências em vez de perder uma: as duas páginas eram `/` e
     `/en`, e os 308 de cada uma são a fila de resultados da busca que o §1 do
     brief autoriza. A fila só sai da conta se ela chegar fechada do servidor e
     se a página tiver o formulário que submete para o índice dos concelhos; a
     razão inteira, e as três condições, estão ao pé do código que as mede. */
  l2_segundas_listas: 0,
  /* L2b · rendições da régua inteira da convergência fora de `/regioes`.
     DESCE DE 18 PARA 0 a 09.09.2026 (§1 e §7.6): a régua saiu das dezoito páginas
     de região, onde era a lista das nove copiada para dentro de cada uma, e no
     lugar dela ficou a porta «Comparar as regiões →». `check:regioes` mede o
     facto do outro lado, linha a linha e desenho a desenho, e exige a porta. */
  l2_reguas: 0,
  /* L2c · sinopses de estudo fora de `/estudos`.
     DESCE DE 10 PARA 0 a 09.09.2026 (§1 e 8.6): a página do concelho listava
     cinco cartões com o título, a sinopse e uma segunda porta; passa a listar os
     TÍTULOS, cada um a abrir o seu estudo, com uma porta para o índice filtrado
     por este concelho. As cinco sinopses (dez, nas duas edições) vivem em
     `/estudos` e na página de cada estudo. */
  l2_sinopses: 0,
  /* L3 · ocorrências do vocabulário fechado no texto da casa, fora das
     exceções e das duas famílias de transcrição.
     DESCE DE 51 PARA 30 a 08.09.2026, com o item 8.4: as duas frases de contexto
     dos painéis saíram (§9.3), e eram elas que rendiam «os indicadores» vinte e
     duas vezes nas duas edições da página europeia. As definições que entraram no
     lugar delas usam o vocabulário fechado («medida»). O que fica são as
     dezoito ocorrências de «município» nas sinopses dos estudos, as duas de
     «indicador» que são campos da fonte na página do domínio, e as dez de
     «trabalho» e «trabalhos» que o §3 do brief e a §A.4 do relatório põem fora
     deste bloco.
     DESCE DE 30 PARA 26 a 09.09.2026, e não por se ter tocado numa palavra: as
     sinopses dos estudos saíram da página do concelho (§1 e 8.6), e com elas as
     quatro ocorrências de «município» que elas rendiam ali. As catorze que ficam
     são as mesmas de sempre, nas páginas dos estudos, onde a sinopse é a frase de
     abertura do documento, transcrita. */
  l3_vocabulario: 26,
  /* L4 · falhas: uma frase de definição ou de hierarquia que não está a 1 onde
     o §2 do brief a manda estar. DESCE DE 10 PARA 0 a 08.09.2026: as cinco
     frases de hierarquia passaram a render-se nos cinco índices, nas duas
     edições, e a de definição já estava a 1 na primeira página. */
  l4_falhas: 0,
  /* L5 · páginas abaixo da primeira sem caminho no cabeçalho.
     DESCE DE 7 213 PARA 0 a 09.09.2026, com o item 5 do encargo (§2.5 do brief):
     o `Caminho.astro` entra no `<header>` de todas as páginas, com os degraus da
     tabela de `src/lib/caminho.mjs` e a folha com a sua marca de origem. As duas
     famílias de transcrição (`documento` e `texto`) ficam de fora pelo §3 do
     brief, e a página de erro fica de fora por não ser uma página do leitor: as
     três exceções estão nomeadas acima, com a razão, e não se saltam em silêncio.

     O NÚMERO DE PARTIDA ESTAVA CERTO E A EXCEÇÃO INGLESA ESTAVA ERRADA: as 7 213
     incluíam a página de erro inglesa, porque `en/404.html` não é o nome do
     ficheiro que a Astro escreve. Com o caminho posto, as 7 212 páginas do leitor
     ficaram a 0 e sobrou ela; a lista das exceções passou a nomear o ficheiro que
     existe, e a medida fecha em 0. */
  l5_sem_caminho: 0,
  /* L6 · selos cuja etiqueta não é o publicador da linha.
     DESCE DE 26 178 PARA 0 a 09.09.2026, com o item 5 do encargo (§2.4 e §7.2 do
     brief): a etiqueta do selo deixa de ser o nome do TRABALHO em que a casa leu
     a linha e passa a ser o nome do PUBLICADOR dela, o campo `source`. Uma linha
     calculada não tem publicador e a etiqueta di-lo com a palavra que já dizia
     («calculado»); as cinco linhas cujo publicador é a própria casa levam a
     palavra «linha» em vez de «fonte», que é o que a §2.4 escreve à letra.
     `scripts/gate-html.mjs` compõe a mesma cadeia do registo e compara-a
     carácter a carácter, e o rótulo do campo na página da linha passou a
     «Publicado por», que é a segunda metade do §7.2.

     O POSITIVO CONHECIDO desta medida está na sua própria história: contou
     26 168, 26 174 e 26 178 em construções deste ramo, com a amostra impressa
     («o selo diz "Quadro institucional de indicadores" e o publicador é
     "Eurostat"»), antes de descer a 0. */
  l6_selos: 0,
  /* 8.5 · blocos com «limiar» sem o qualificador nem a frase ao lado.
     DESCE DE 708 PARA 0 a 08.09.2026, com o item 8.5: cada medida com limiar
     declara quem o fixou (`limiarFixadoPor`, lista fechada em
     `src/data/figuras.mjs`), o cartão e a linha do limiar dizem-no em palavras
     («dentro do limiar da Comissão», «dentro do limite legal», «dentro do limiar
     do Pacto de Estabilidade e Crescimento», «fora do limiar recomendado pelo
     Conselho da UE») e a leitura diz numa frase o que o limiar é e quem o fixou,
     em todos os fixadores menos o `lei`, que já tem a sua frase na página do
     concelho. Os blocos que a casa já qualificava por outra
     via — o Método, a agenda das fontes, a manchete e o cabeçalho da página
     europeia — estão na lista dos qualificadores, escritos por extenso. */
  d85_limiar_sozinho: 0,
  /* 8.8 · «livro-razão» nos menus, nos rodapés e nos títulos das páginas.
     DESCE DE 24 177 PARA 0 a 08.09.2026: o nome visível do índice e da entrada
     do menu passou a «Números e fontes», e os títulos das páginas do livro-razão
     e dos seus concelhos foram com ele. */
  d88_livro_razao: 0,
  /* 8.17 · o cartão localizador dos 308 pontos na página de um concelho.
     Conta, nas 616 páginas de concelho, os pontos do mapa de pontos e as páginas
     sem o mapa de áreas da sua região. Nasce a 0 a 08.09.2026, no commit em que
     o item entra: o mapa da página de um concelho passa a ser o nível da região
     do mapa do F1.1d, e não os 308 pontos. */
  d817_pontos_no_concelho: 0,
  d817_concelhos_sem_mapa: 0,
  /* 8.13 · valores selados na secção dos domínios da primeira página. */
  d813_selos_nos_dominios: 0,
  /* 8.14 · «Relance» e «Leitura breve» nas páginas do leitor. DESCE DE 1 304
     PARA 0 a 08.09.2026: o comando de densidade saiu da primeira página e os
     seis títulos de secção e rótulos de camada que usavam as duas palavras
     passaram a dizer o que a secção tem. As quatro linhas do inventário da voz
     passaram a «retirada» com a razão escrita. */
  d814_densidades: 0,
  /* 8.11 e §7.3 · leituras de aparelho no cabeçalho, somadas sobre as páginas.
     DESCE DE 28 892 PARA 0 a 08.09.2026. Eram quatro por página em 7 223 das
     7 240 (o painel europeu, as fontes, as séries atrasadas e a agenda) e são
     zero: a data da reconferência foi para «Portugal na União Europeia», dentro
     do painel que ela cobre, e a leitura das fontes com o seu contador foi para
     a regra 6 do Método, que é a âncora para onde as portas das três já
     apontavam. As duas contagens da agenda ficam onde já estavam, nas portas da
     primeira página e na regra 8 do Método. O «antes» não foi contado de
     cabeça: correu-se esta régua sobre o `dist/` desta árvore ANTES de se tocar
     no cabeçalho, e ela imprimiu 28 892 em 7 240 páginas. */
  d811_leituras_na_cabeca: 0,
  /* 8.4 · parágrafos `data-contexto-painel` cujo texto não é, carácter a
     carácter, a definição que `DEFINICAO_DOS_PAINEIS` declara para aquele
     painel naquela edição. Nasce a 0 a 08.09.2026, no commit em que a
     comparação entra no `verify`: é a mesma medida da célula A4 de
     `tests/inicio/porta.mjs`, que abre um navegador e não corre em portão
     nenhum, feita aqui sobre o HTML construído. */
  d84_definicoes_fora: 0,
  /* §7.4 e 8.6 · superfícies de estudo que não apresentam as edições na forma
     única, e linhas do índice dos estudos sem a porta da leitura.
     NASCE A 0 a 09.09.2026, no commit em que o item entra. O que ela conta está
     escrito ao pé da medida, no corpo da régua; os cinco defeitos que ela
     apanha são os cinco que a sétima sessão do bloco corrigiu, e a planta da L9
     põe cada um de volta. */
  d86_estudos_forma: 0,
};

/* Quantos concelhos ligados fora de uma lista fechada fazem uma segunda lista.
   Um punhado de portas para concelhos vizinhos não é um índice; 30 é. */
const L2_LIMITE_NOMES = 30;

/* ---------------------------------------------------------------------------
 * AS PALAVRAS DO VOCABULÁRIO FECHADO (§2.3 do brief; `DECISIONS.md` §1.98)
 * ---------------------------------------------------------------------------
 * A palavra visível do território é «concelho»; o trabalho de autor é um
 * «estudo»; «indicador» e «peça» saem; «Relance» e «Leitura breve» ficam só
 * como os nomes das duas densidades de um cartão.
 *
 * A EDIÇÃO INGLESA NÃO ENTRA NA L3, e a razão está no relatório do bloco:
 * «municipality» é a tradução de «concelho» e não uma segunda palavra para a
 * mesma coisa. O defeito que o leitor de primeira vez mediu é do português. As
 * palavras inglesas que a L3 mede são as que a decisão também fecha em inglês.
 */
const VOCABULARIO = [
  { palavra: 'município', porque: 'o território diz-se «concelho» (§1.98)' },
  { palavra: 'Município', porque: 'o território diz-se «concelho» (§1.98)' },
  { palavra: 'municípios', porque: 'o território diz-se «concelhos» (§1.98)' },
  { palavra: 'Municípios', porque: 'o território diz-se «concelhos» (§1.98)' },
  { palavra: 'indicador', porque: 'o número interpretado é uma «medida» (§1.98)' },
  { palavra: 'indicadores', porque: 'o número interpretado é uma «medida» (§1.98)' },
  { palavra: 'Indicador', porque: 'o número interpretado é uma «medida» (§1.98)' },
  { palavra: 'Indicadores', porque: 'o número interpretado é uma «medida» (§1.98)' },
  { palavra: 'peça', porque: '«peça» sai do vocabulário do sítio (§1.98)' },
  { palavra: 'peças', porque: '«peça» sai do vocabulário do sítio (§1.98)' },
  { palavra: 'trabalho', porque: 'o trabalho de autor é um «estudo» (§1.98)' },
  { palavra: 'trabalhos', porque: 'o trabalho de autor é um «estudo» (§1.98)' },
  { palavra: 'Trabalhos', porque: 'o trabalho de autor é um «estudo» (§1.98)' },
  /* «ARQUIVO» ENTRA A 09.09.2026, com o §7.4: «um só nome para os estudos,
     "estudo", nunca "trabalho" nem "arquivo" como nome de coisa». A palavra
     estava em seis cadeias da casa (a descrição das duas páginas de índice, a
     porta que devolve a lista inteira, a porta de volta da página de um estudo e
     as duas glosas das contagens), e cada uma delas era o segundo nome da mesma
     coisa. A régua passa a contá-la, e a L3 mede-a a 0. */
  { palavra: 'arquivo', porque: 'os estudos chamam-se «estudos» (§7.4 do F1.10)' },
  { palavra: 'Arquivo', porque: 'os estudos chamam-se «estudos» (§7.4 do F1.10)' },
  { palavra: 'arquivos', porque: 'os estudos chamam-se «estudos» (§7.4 do F1.10)' },
  { palavra: 'Arquivos', porque: 'os estudos chamam-se «estudos» (§7.4 do F1.10)' },
];

/* ---------------------------------------------------------------------------
 * OS RÓTULOS QUE SAÍRAM DAS PÁGINAS DE ESTUDO (§7.4 e item 8.6, 09.09.2026)
 * ---------------------------------------------------------------------------
 * «Descarregar · Sem ficheiros» não se imprime quando está vazio, e estava vazio
 * sempre; «O documento original» era o título da primeira das duas apresentações
 * das mesmas portas, e a que fica é a lista das edições. As quatro cadeias
 * saíram de `src/i18n/strings.mjs` no mesmo commit em que esta lista entrou.
 */
const ROTULOS_QUE_SAIRAM = new Set([
  'Descarregar',
  'Downloads',
  'O documento original',
  'The original document',
]);

/* As duas palavras das densidades, que o item 8.14 tira das páginas do leitor. */
const DENSIDADES = ['Relance', 'Leitura breve', 'At a glance', 'Brief reading'];

/* ---------------------------------------------------------------------------
 * AS EXCEÇÕES DO VOCABULÁRIO, POR NOME
 * ---------------------------------------------------------------------------
 * Cada uma é um BLOCO DE TEXTO INTEIRO: a régua compara o bloco que leu com esta
 * lista, e só o dispensa quando ele é um deles por igual. Uma palavra proibida
 * num bloco parecido não passa por semelhança.
 */
const EXCECOES_DO_VOCABULARIO = [
  {
    /* A política de IA copia a `POLITICA-DA-AUTONOMIA.md`, que é o documento
       aprovado pelo diretor, e a regra da casa é que o que se copia de uma fonte
       fica como a fonte o escreveu. As três frases estão em
       `src/data/politica-ia.mjs`. */
    conta: 'peça',
    porque: 'a política de IA copia a POLITICA-DA-AUTONOMIA.md e fica como a fonte a escreveu',
    padrao: /peça a peça|revê cada peça antes de sair|Qualquer peça que nomeie uma pessoa/,
  },
  {
    /* «trabalho» no sentido de EMPREGO não é o nome de um estudo, e a L3 mede
       «trabalho(s)» como nome de estudo. */
    conta: 'trabalho',
    porque: '«trabalho» no sentido de emprego, que não é o nome de um estudo',
    padrao: /procuram trabalho|custo unitário do trabalho|custo nominal do trabalho|Trabalho, Solidariedade e Segurança Social|mercado de trabalho|postos de trabalho/,
  },
];

/* ---------------------------------------------------------------------------
 * A LEITURA DO TEXTO DA CASA
 * ---------------------------------------------------------------------------
 * O mesmo corte que `medir-defeitos.mjs` e a medição do bloco fizeram: tudo o
 * que está debaixo de uma marca de origem declarada é da fonte e não da casa, e
 * a casa não edita o que transcreve.
 */
const ORIGEM_DECLARADA = [
  '[data-claim]',
  '[data-linha-claim]',
  '[data-correcao-claim]',
  '[data-verbatim]',
  '[data-nonledger]',
  '[data-agenda]',
  '[data-registo]',
  '[data-registo-unidade]',
  '[data-registo-linha]',
  '[data-registo-conta]',
  '[data-lugar]',
  '[data-nome]',
  '[data-medida-nome]',
  '[data-medida-unidade]',
].join(',');

/** @param {import('node-html-parser').HTMLElement} raiz */
function textoDaCasa(raiz) {
  const corpo = raiz.querySelector('body');
  if (!corpo) return '';
  const marcados = new Set();
  for (const el of raiz.querySelectorAll(ORIGEM_DECLARADA)) {
    marcados.add(el);
    for (const d of el.querySelectorAll('*')) marcados.add(d);
  }
  /** @type {string[]} */
  const partes = [];
  const anda = (n) => {
    if (!n) return;
    if (n.nodeType === NodeType.TEXT_NODE) return void partes.push(n.rawText);
    const tag = String(n.rawTagName ?? '').toLowerCase();
    if (tag === 'script' || tag === 'style') return;
    if (marcados.has(n)) return;
    for (const f of n.childNodes ?? []) anda(f);
  };
  anda(corpo);
  return partes.join(' ').replace(/\s+/g, ' ');
}

/**
 * O texto da casa, bloco a bloco, para as exceções e para a medida 8.5.
 * Um bloco é uma unidade de leitura: um parágrafo, um item, uma célula, um
 * título. É o mesmo corte de `BLOCOS_DA_VOZ` em `medir-defeitos.mjs`.
 */
const BLOCOS = 'p,li,dd,dt,h1,h2,h3,h4,figcaption,summary,blockquote,td,th,caption';

/* ---------------------------------------------------------------------------
 * O QUE QUALIFICA A PALAVRA «LIMIAR» (medida 8.5)
 * ---------------------------------------------------------------------------
 * A lista está ESCRITA AQUI, palavra por palavra, e não lida de
 * `src/i18n/strings.mjs`. É de propósito: uma régua que fosse buscar o seu
 * critério ao mesmo ficheiro que a página lê teria os dois lados da comparação
 * do mesmo lado, e passar a dizer «dentro do limiar» outra vez em `strings.mjs`
 * mudaria a régua e a página ao mesmo tempo, em silêncio. Escrita aqui, a régua
 * fica vermelha no dia em que a cadeia mudar, e quem a muda tem de vir cá dizer
 * porquê.
 *
 * SÃO OS TRÊS FIXADORES DO LIMIAR (F1.10, item 8.5, e `FIXADORES_DO_LIMIAR` em
 * `src/data/figuras.mjs`), nas duas edições, mais as duas formas em que a
 * palavra já se qualificava a si própria: a ausência declarada («sem limiar»)
 * e a frase que diz o que o limiar é («O limiar é …»).
 */
const QUALIFICADORES_DO_LIMIAR = [
  /* os quatro fixadores do limiar, nas duas edições. Eram três, e o
     `porRegistar` («limiar publicado») saiu a 08.09.2026 quando se leram os
     documentos que as suas duas linhas citam: um diz o Pacto de Estabilidade e
     Crescimento, o outro diz o Conselho da União Europeia. A régua conta a
     forma que se rende, e por isso a lista muda com eles. */
  'limiar da comissão',
  'commission threshold',
  'limite legal',
  'legal limit',
  'limiar do pacto de estabilidade e crescimento',
  'stability and growth pact threshold',
  'limiar recomendado pelo conselho da ue',
  'threshold recommended by the council of the eu',
  /* A DEFINIÇÃO DO PAINEL DO PROCEDIMENTO (item 8.4, 08.09.2026) diz de quem os
     limiares são no mesmo bloco: o sujeito da frase é «a Comissão Europeia» e o
     que ela põe em cada medida é «o seu limiar indicativo», que é a palavra da
     página da Comissão («indicative thresholds»). Entra por extenso, como os
     outros blocos que a casa já qualificava por outra via. */
  'com o seu limiar indicativo',
  'with its indicative threshold',
  /* A AUSÊNCIA DECLARADA. «sem limiar» é uma das três palavras do vocabulário
     fechado do estado, e «não tem limiares» é a frase do Painel Social. */
  'sem limiar',
  'no threshold',
  'não tem limiares',
  'has no thresholds',
  /* A FRASE QUE DIZ O QUE O LIMIAR É E QUEM O FIXOU, na leitura de uma medida e
     nos dois lugares onde a casa já a dizia antes deste bloco (o Método e a
     agenda das fontes). */
  'o limiar é',
  'the threshold is',
  'limiar fixado',
  'a fonte publica um limiar',
  'the source publishes a threshold',
  'limiar que a própria comissão publica',
  'threshold the commission itself publishes',
  /* O QUADRO NOMEADO DENTRO DO BLOCO. Um bloco que nomeia o painel do
     Procedimento diz de quem é o limiar de que fala, e é a forma em que a
     manchete da página europeia, o cabeçalho do quadro e a frase de contexto já
     o diziam antes deste bloco. */
  'limiar do procedimento',
  'limiares do procedimento',
  'threshold of the macroeconomic imbalance procedure',
  'thresholds of the macroeconomic imbalance procedure',
  'procedimento relativo aos desequilíbrios macroeconómicos',
  'procedimento dos desequilíbrios macroeconómicos',
  'macroeconomic imbalance procedure',
  "procedure's threshold",
  'limiar do painel europeu',
  'european scoreboard threshold',
];

/** @param {import('node-html-parser').HTMLElement} raiz */
function blocosDaCasa(raiz) {
  const corpo = raiz.querySelector('body');
  if (!corpo) return [];
  /** @type {string[]} */
  const out = [];
  for (const el of corpo.querySelectorAll(BLOCOS)) {
    const txt = el.text.replace(/\s+/g, ' ').trim();
    if (txt) out.push(txt);
  }
  return out;
}

/** @param {string} dir */
function paginasDe(dir) {
  /** @type {string[]} */
  const out = [];
  const anda = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) anda(f);
      else if (e.name.endsWith('.html')) out.push(f);
    }
  };
  anda(dir);
  return out.sort();
}

/** O caminho da rota de um ficheiro de `dist/`. @param {string} ficheiro */
function rotaDe(ficheiro) {
  const rel = path.relative(DIST, ficheiro).split(path.sep).join('/');
  const url = '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '');
  return { rel, url: normalizePath(url), rota: matchPath(normalizePath(url)) };
}

/* ---------------------------------------------------------------------------
 * A CONTAGEM
 * --------------------------------------------------------------------------- */
const falhas = [];
const medidas = {
  l1_paginas: 0,
  l2_segundas_listas: 0,
  l2_reguas: 0,
  l2_sinopses: 0,
  l3_vocabulario: 0,
  l4_falhas: 0,
  l5_sem_caminho: 0,
  l6_selos: 0,
  d85_limiar_sozinho: 0,
  d88_livro_razao: 0,
  d813_selos_nos_dominios: 0,
  d814_densidades: 0,
  d817_pontos_no_concelho: 0,
  d817_concelhos_sem_mapa: 0,
  d811_leituras_na_cabeca: 0,
  d84_definicoes_fora: 0,
  d86_estudos_forma: 0,
};
/** Quantas superfícies de estudo a régua viu (regra 14: zero defeitos sobre
    zero páginas não prova nada). */
const vistas = { estudo: 0, texto: 0, indice: 0, edicoes: 0, linhas: 0 };
/** Quantos parágrafos de definição de painel a régua viu (regra 14: uma
    contagem de zero sobre uma coleção vazia não prova nada). */
let definicoesVistas = 0;
/** As amostras de cada medida, para que um número tenha sempre um sítio. */
const amostras = Object.fromEntries(Object.keys(medidas).map((k) => [k, []]));
/** Quantas vezes cada exceção foi usada: uma exceção a zero é uma porta esquecida. */
const usoDasExcecoes = new Map(EXCECOES_DO_VOCABULARIO.map((e, i) => [i, 0]));
/** As palavras do vocabulário, contadas uma a uma, para o relatório. */
const porPalavra = new Map(VOCABULARIO.map((v) => [v.palavra, 0]));
const porDensidade = new Map(DENSIDADES.map((d) => [d, 0]));

const claims = loadClaims();
const S = { pt: t('pt'), en: t('en') };

/** O caminho de cada índice em que a frase de hierarquia tem de estar (§2.2). */
const INDICES_DA_HIERARQUIA = [];
for (const lang of LANGS) {
  const s = S[lang];
  INDICES_DA_HIERARQUIA.push(
    { url: routePath('municipios', lang), frase: s.hierarquia?.territorio, nome: 'municipios' },
    { url: routePath('distritos', lang), frase: s.hierarquia?.territorio, nome: 'distritos' },
    { url: routePath('regioes', lang), frase: s.hierarquia?.territorio, nome: 'regioes' },
    { url: routePath('dominios', lang), frase: s.hierarquia?.dominio, nome: 'dominios' },
    { url: routePath('areas', lang), frase: s.hierarquia?.area, nome: 'areas' },
  );
}
/** A frase de definição, na primeira página e em mais lado nenhum (§2.1). */
const DEFINICAO = LANGS.map((lang) => ({ url: routePath('home', lang), frase: S[lang].identidade }));

const conta = (texto, agulha) => {
  let i = 0;
  let n = 0;
  while ((i = texto.indexOf(agulha, i)) >= 0) {
    n++;
    i += agulha.length;
  }
  return n;
};

const anota = (chave, linha) => {
  if (amostras[chave].length < 6) amostras[chave].push(linha);
};

const paginas = paginasDe(DIST);
/** O que cada índice viu, para as medidas que se conferem uma vez no fim. */
const vistoNoIndice = new Map();

for (const ficheiro of paginas) {
  const { rel, url, rota } = rotaDe(ficheiro);
  if (FICHEIROS_SEM_ROTA.has(rel)) continue;
  const chaveDaRota = rota?.key ?? null;
  const lang = rota?.lang ?? (rel.startsWith('en/') ? 'en' : 'pt');
  /* As duas famílias de transcrição saem por nome, com a razão no cabeçalho. */
  const transcricao = chaveDaRota !== null && ROTAS_DE_TRANSCRICAO.has(chaveDaRota);

  const cru = fs.readFileSync(ficheiro, 'utf8');
  const raiz = parse(cru);
  const corpo = raiz.querySelector('body');
  if (!corpo) continue;

  const cabecalho = raiz.querySelector('header');
  const rodape = raiz.querySelector('footer');
  const daMobilia = new Set();
  for (const marco of [cabecalho, rodape]) {
    if (!marco) continue;
    daMobilia.add(marco);
    for (const d of marco.querySelectorAll('*')) daMobilia.add(d);
  }

  /* -------------------------------------------------------------------- L1 */
  /* Dois destinos iguais no MESMO ecrã, fora do cabeçalho e do rodapé. O
     fragmento não conta: `#m-x` e `#m-y` são dois sítios da mesma página, e
     `/x#a` e `/x#b` são duas portas para dois sítios da mesma página. */
  const destinos = new Map();
  for (const a of corpo.querySelectorAll('a[href]')) {
    if (daMobilia.has(a)) continue;
    const href = a.getAttribute('href') ?? '';
    if (!href || href.startsWith('#') || href.startsWith('mailto:')) continue;
    const chave = href.split('#')[0];
    if (!chave) continue;
    destinos.set(chave, (destinos.get(chave) ?? 0) + 1);
  }
  const repetidos = [...destinos.entries()].filter(([, n]) => n > 1);
  if (repetidos.length) {
    medidas.l1_paginas++;
    anota('l1_paginas', `${url} · ${repetidos.length} destinos repetidos (ex.: ${repetidos[0][0]} ×${repetidos[0][1]})`);
  }

  /* -------------------------------------------------------------------- L2 */
  if (chaveDaRota !== 'municipios') {
    /* Os 308 nomes ligados fora de `/municipios`, e fora de uma lista fechada:
       um `<details>` fechado é a alternativa em texto de um mapa, e o §1 do
       brief deixa-a lá de propósito. */
    const dentroDeLista = new Set();
    for (const d of corpo.querySelectorAll('details')) {
      for (const x of d.querySelectorAll('*')) dentroDeLista.add(x);
    }
    /* AS ÁREAS DE UM MAPA NÃO SÃO UMA LISTA (F1.10, item 8.17, 08.09.2026). O §1
       do brief decide isto para os 29 nomes da primeira página e para as tabelas
       dos mapas do domínio, com a mesma frase: «uma fonte, duas formas». Um mapa
       com uma área por concelho é o desenho do território, e cada área é a porta
       do lugar que ela desenha; contá-las como um índice dos 308 punha a régua a
       chamar segunda lista ao instrumento que este bloco veio pôr no lugar da
       lista. O que a régua continua a recusar é uma FILA DE NOMES fora de
       `/municipios`, que é o que ela mede em todas as outras páginas. */
    for (const svg of corpo.querySelectorAll('[data-mapa], [data-mapa-concelhos]')) {
      for (const x of svg.querySelectorAll('*')) dentroDeLista.add(x);
    }
    /* -----------------------------------------------------------------------
       A FILA DE RESULTADOS DA BUSCA NÃO É UMA SEGUNDA LISTA (decisão do lugar de
       direção, 09.09.2026, sobre a L2a do F1.10)
       -----------------------------------------------------------------------
       A régua contava 2: `/` e `/en`, cada uma com «308 concelhos ligados fora
       de uma lista fechada». Os 308 são a fila de resultados da busca, que o §1
       do brief autoriza na primeira página («na primeira página, a busca
       (submete para `/municipios`) e o mapa com os 29 nomes»). A decisão do
       lugar de direção diz o que ela é: «a busca em repouso não rende uma lista
       dos 308 no HTML; sem guião, o caminho é o formulário a submeter a consulta
       ao índice dos concelhos (`/municipios` com a consulta), não uma lista; com
       guião, as sugestões aparecem só depois de escrever».

       A EXCEÇÃO NÃO É UM SALTO, É UMA MEDIÇÃO, e é isso que a impede de ser a
       régua a enfraquecer. A fila só sai da conta quando as três coisas que a
       decisão afirma se confirmam NESTA página, uma a uma:

         1. cada uma das portas contadas está dentro da fila (`[data-resultados]`);
         2. a fila chega FECHADA do servidor (o atributo `hidden` no `<ul>`), que
            é o mesmo estado de um `<details>` fechado, e a razão pela qual um já
            estava fora da conta;
         3. a página tem uma busca com destino: um `<form role="search">` com
            `method="get"` e `action` para o índice dos concelhos desta edição.

       Se qualquer uma delas deixar de ser verdade, a fila volta a contar e a L2a
       sobe. Uma lista de 308 nomes escrita à mão numa página, aberta ou sem
       formulário, continua a ser o que a régua veio proibir: a planta da L9
       prova-o. */
    const filaFechadaDaBusca = new Set();
    const formaDaBusca = corpo
      .querySelectorAll('form[role="search"]')
      .find(
        (f) =>
          (f.getAttribute('method') ?? '').toLowerCase() === 'get' &&
          normalizePath(f.getAttribute('action') ?? '') === normalizePath(routePath('municipios', lang)),
      );
    if (formaDaBusca) {
      for (const fila of corpo.querySelectorAll('[data-resultados]')) {
        if (!fila.hasAttribute('hidden')) continue;
        for (const x of fila.querySelectorAll('*')) filaFechadaDaBusca.add(x);
      }
    }
    const nomes = new Set();
    for (const a of corpo.querySelectorAll('a[href]')) {
      if (daMobilia.has(a) || dentroDeLista.has(a) || filaFechadaDaBusca.has(a)) continue;
      const href = (a.getAttribute('href') ?? '').split('#')[0];
      const m = href ? matchPath(href) : null;
      if (m?.key === 'municipio') nomes.add(href);
    }
    if (nomes.size > L2_LIMITE_NOMES) {
      medidas.l2_segundas_listas++;
      anota('l2_segundas_listas', `${url} · ${nomes.size} concelhos ligados fora de uma lista fechada`);
    }
  }
  if (chaveDaRota !== 'regioes') {
    const reguas = corpo.querySelectorAll('[data-instrumento="convergencia"]').length;
    if (reguas) {
      medidas.l2_reguas += reguas;
      anota('l2_reguas', `${url} · ${reguas} régua(s) da convergência`);
    }
  }
  if (chaveDaRota !== 'estudos') {
    const sinopses = corpo.querySelectorAll('.mun-estudo-frase').length;
    if (sinopses) {
      medidas.l2_sinopses += sinopses;
      anota('l2_sinopses', `${url} · ${sinopses} sinopse(s) de estudo`);
    }
  }

  /* --------------------------------------------------------------- L3, 8.14 */
  if (!transcricao) {
    const blocos = blocosDaCasa(raiz);
    const texto = textoDaCasa(raiz);
    for (const { palavra } of VOCABULARIO) {
      if (!texto.includes(palavra)) continue;
      /* Conta por bloco, para que uma exceção possa dispensar o bloco dela. */
      let n = 0;
      for (const b of blocos) {
        const nb = contaPalavra(b, palavra);
        if (!nb) continue;
        const i = EXCECOES_DO_VOCABULARIO.findIndex(
          (e) => palavraDaExcecao(e.conta, palavra) && e.padrao.test(b),
        );
        if (i >= 0) {
          usoDasExcecoes.set(i, (usoDasExcecoes.get(i) ?? 0) + nb);
          continue;
        }
        n += nb;
      }
      if (!n) continue;
      medidas.l3_vocabulario += n;
      porPalavra.set(palavra, (porPalavra.get(palavra) ?? 0) + n);
      anota('l3_vocabulario', `${url} · «${palavra}» ×${n}`);
    }
    for (const d of DENSIDADES) {
      const n = conta(texto, d);
      if (!n) continue;
      medidas.d814_densidades += n;
      porDensidade.set(d, (porDensidade.get(d) ?? 0) + n);
      anota('d814_densidades', `${url} · «${d}» ×${n}`);
    }

    /* --------------------------------------------------------------- 8.5 */
    /* «limiar» nunca sozinho: o bloco que o diz tem de dizer também de quem ele
       é, ou ser a frase que o define. */
    for (const b of blocos) {
      const temLimiar = /limiar|threshold/i.test(b);
      if (!temLimiar) continue;
      const minusculas = b.toLowerCase();
      const qualificado = QUALIFICADORES_DO_LIMIAR.some((q) => minusculas.includes(q));
      if (qualificado) continue;
      medidas.d85_limiar_sozinho++;
      anota('d85_limiar_sozinho', `${url} · ${b.slice(0, 90)}`);
    }
  }

  /* ------------------------------------------------------------------- 8.17 */
  /* O MAPA DA PÁGINA DE UM CONCELHO É O DA SUA UNIDADE, E NÃO OS 308 PONTOS.
     Três coisas, e as três nesta página: nenhum ponto do mapa de pontos; um
     mapa de áreas, e um só; e o concelho DESTA página entre as áreas, com o
     anel e com a porta de cada área a abrir uma página que existe. Uma delas em
     falta é a régua a dizer que o cartão dos pontos voltou, ou que o mapa é o de
     outro sítio.

     A MEDIDA PASSOU DA REGIÃO À UNIDADE, E A MARCA DO ANEL MUDOU COM ELA (item
     8.17b, 08.09.2026). A primeira passagem media o mapa da REGIÃO, que era o
     que o mapa daquele dia tinha, e procurava a marca `data-escolhido` que
     aquele componente escrevia. O F1.1e devolveu o mapa às 29 unidades da Carta
     e reescreveu o componente: a área escolhida distingue-se pela classe
     `uni-escolhida` no seu `<path>`, e quem a nomeia é o `data-concelho-porta` da
     âncora que a embrulha. A régua lê o que o componente escreve hoje; se
     lesse o que ele escrevia ontem contaria zero anéis em 616 páginas que os
     têm, que é a régua a mentir ao contrário. */
  if (chaveDaRota === 'municipio') {
    const pontos = corpo.querySelectorAll('circle.mun').length;
    if (pontos) {
      medidas.d817_pontos_no_concelho += pontos;
      anota('d817_pontos_no_concelho', `${url} · ${pontos} ponto(s) do mapa dos 308`);
    }
    const areas = corpo.querySelectorAll('[data-mapa-concelhos] [data-areas] a.uni-porta');
    const mapas = corpo.querySelectorAll('[data-mapa-concelhos]').length;
    const meu = rota?.params?.slug ?? '';
    const escolhidos = areas.filter((a) =>
      (a.querySelector('path')?.getAttribute('class') ?? '').split(/\s+/).includes('uni-escolhida'),
    );
    const meuEstaLa = escolhidos.some((a) => a.getAttribute('data-concelho-porta') === meu);
    if (mapas !== 1 || areas.length === 0 || escolhidos.length !== 1 || !meuEstaLa) {
      medidas.d817_concelhos_sem_mapa++;
      anota(
        'd817_concelhos_sem_mapa',
        `${url} · ${mapas} mapa(s) de área, ${areas.length} área(s), ` +
          `${escolhidos.length} com anel${meuEstaLa ? '' : ', e nenhum é este concelho'}`,
      );
    }
    for (const a of areas) {
      const href = (a.getAttribute('href') ?? '').split('#')[0];
      if (!href.startsWith('/')) continue;
      if (!fs.existsSync(path.join(DIST, normalizePath(href).slice(1), 'index.html'))) {
        falhas.push(`8.17 · ${url}: a porta de uma área aponta para "${href}", que não existe em dist/.`);
      }
    }
  }

  /* ------------------------------------------------------------------- 8.4 */
  /* A DEFINIÇÃO DE CADA PAINEL, CARÁCTER A CARÁCTER, DENTRO DO `verify`.

     A comparação nasceu na célula A4 de `tests/inicio/porta.mjs`, que abre um
     navegador e não corre nem no `build` nem na CI: a célula foi escrita a
     08.09 e não foi corrida no dia em que mudou de medida. O lugar de direção
     decidiu que ela entra no `verify` ou que a razão de não entrar fica escrita
     na régua, e entra: a comparação não precisa de navegador nenhum, porque é
     texto contra texto sobre o HTML construído.

     A CÉLULA A4 FICA ONDE ESTÁ, e não é uma segunda cópia desta: ela mede o
     mesmo em Chromium, com a página composta e as folhas aplicadas, e é isso
     que uma régua de navegador acrescenta a uma de ficheiro. O que muda é que
     a conferência deixa de depender de alguém se lembrar de a correr.

     E A COLEÇÃO TEM DE TER ELEMENTOS: uma contagem de zero diferenças sobre
     zero parágrafos não prova coisa nenhuma. O total dos parágrafos vistos
     confere-se no fim contra o número que as duas edições têm de render. */
  for (const el of corpo.querySelectorAll('[data-contexto-painel]')) {
    definicoesVistas++;
    const chave = el.getAttribute('data-contexto-painel') ?? '';
    const partes = DEFINICAO_DOS_PAINEIS[chave]?.[lang];
    const declarada = Array.isArray(partes)
      ? partes.join('').replace(/\s+/g, ' ').trim()
      : null;
    const rendida = el.text.replace(/\s+/g, ' ').trim();
    if (declarada === null) {
      medidas.d84_definicoes_fora++;
      anota('d84_definicoes_fora', `${url} · «${chave}» não é um painel declarado`);
    } else if (rendida !== declarada) {
      medidas.d84_definicoes_fora++;
      anota(
        'd84_definicoes_fora',
        `${url} · «${chave}»: a página diz «${rendida.slice(0, 60)}…» e a declaração diz «${declarada.slice(0, 60)}…»`,
      );
    }
  }

  /* ------------------------------------------------------------------ 8.11 */
  /* AS LEITURAS DE APARELHO NO CABEÇALHO DE TODAS AS PÁGINAS.
     O item 8.11 e o §7.3 mandam-nas para a página da medida e para o Método: o
     que esta medida conta é quantas ficaram no `<header>`, página a página.
     Conta ELEMENTOS e não páginas, porque eram quatro por página e uma medida
     por página não distinguiria tirar uma de tirar as quatro. */
  if (cabecalho) {
    const leituras = cabecalho.querySelectorAll('.mob-leitura').length;
    if (leituras) {
      medidas.d811_leituras_na_cabeca += leituras;
      anota('d811_leituras_na_cabeca', `${url} · ${leituras} leitura(s) de aparelho no cabeçalho`);
    }
  }

  /* ------------------------------------------------------- §7.4 e 8.6 · os estudos */
  /* A FORMA ÚNICA DAS EDIÇÕES, E A PORTA DA LEITURA NO ÍNDICE.
     ---------------------------------------------------------------------------
     O diretor viu a 07.09.2026 à noite que a apresentação dos estudos «is a bit
     ambiguous», e o item 8.6 decide a forma: «na página de cada estudo, as
     edições (as línguas, os documentos, a página de leitura) apresentam-se de
     uma só forma em todos os estudos, com uma frase que diga o que cada porta
     abre». O §7.4 acrescenta duas coisas: «o título da lista vai direto ao
     texto; a página de capa deixa de existir como paragem obrigatória» e
     «"Descarregar · Sem ficheiros" não se imprime quando está vazio».

     A MEDIDA CONTA DEFEITOS, e são cinco espécies:
       1. uma página de estudo ou de leitura sem exatamente uma frase das portas;
       2. uma fila de edição com as portas fora da ordem única (a leitura no
          sítio primeiro, o documento a seguir) ou com uma porta que não é
          nenhuma das duas;
       3. um dos rótulos que saíram de volta à página (o bloco «Descarregar» e o
          bloco «O documento original», que era a segunda apresentação das
          mesmas portas);
       4. uma linha do índice dos estudos sem a porta da leitura, ou com mais do
          que uma;
       5. uma porta da leitura que aponta para uma página que não existe.

     OS RÓTULOS QUE SAÍRAM ESTÃO ESCRITOS AQUI À MÃO, e é de propósito: as
     cadeias saíram de `src/i18n/strings.mjs` no mesmo commit, e uma régua que
     lesse a chave que já não existe não media nada. São quatro cadeias fixas, e
     o que elas guardam é o regresso do defeito. */
  if (chaveDaRota === 'estudo' || chaveDaRota === 'texto') {
    vistas[chaveDaRota]++;
    const frases = corpo.querySelectorAll('.edicoes-frase').length;
    if (frases !== 1) {
      medidas.d86_estudos_forma++;
      anota('d86_estudos_forma', `${url} · ${frases} frase(s) das portas (esperada 1)`);
    }
    const s = S[lang];
    const ORDEM = [s.estudos.textoLink, s.estudos.documentoLink];
    for (const fila of corpo.querySelectorAll('.edicao-meta')) {
      vistas.edicoes++;
      const portas = fila
        .querySelectorAll('a')
        .map((a) => (a.text ?? '').replace(/\s+/g, ' ').replace(/\s*→\s*$/, '').trim());
      let i = 0;
      let boa = true;
      for (const porta of portas) {
        const j = ORDEM.indexOf(porta, i);
        if (j < 0) {
          boa = false;
          break;
        }
        i = j + 1;
      }
      if (!boa) {
        medidas.d86_estudos_forma++;
        anota('d86_estudos_forma', `${url} · portas fora da forma única: ${portas.join(' | ')}`);
      }
    }
    for (const k of corpo.querySelectorAll('.log-vazio-k')) {
      const texto = (k.text ?? '').trim();
      if (!ROTULOS_QUE_SAIRAM.has(texto)) continue;
      medidas.d86_estudos_forma++;
      anota('d86_estudos_forma', `${url} · o rótulo «${texto}» voltou à página`);
    }
  }
  if (chaveDaRota === 'estudos') {
    vistas.indice++;
    for (const linha of corpo.querySelectorAll('.arquivo-item')) {
      vistas.linhas++;
      const portas = linha.querySelectorAll('.arquivo-porta');
      if (portas.length !== 1) {
        medidas.d86_estudos_forma++;
        anota('d86_estudos_forma', `${url} · uma linha com ${portas.length} porta(s) da leitura`);
        continue;
      }
      const href = (portas[0].getAttribute('href') ?? '').split('#')[0];
      const alvo = path.join(DIST, normalizePath(href).slice(1), 'index.html');
      if (!href.startsWith('/') || !fs.existsSync(alvo)) {
        medidas.d86_estudos_forma++;
        anota('d86_estudos_forma', `${url} · a porta da leitura aponta para "${href}", que não existe em dist/`);
      }
    }
  }

  /* -------------------------------------------------------------------- L5 */
  const primeira = chaveDaRota === 'home';
  if (!primeira && !transcricao) {
    const rotulo = S[lang].nav?.rotuloCaminho;
    const caminho = rotulo
      ? corpo.querySelectorAll('nav').find((n) => n.getAttribute('aria-label') === rotulo)
      : null;
    if (!caminho) {
      medidas.l5_sem_caminho++;
      anota('l5_sem_caminho', url);
    } else {
      for (const a of caminho.querySelectorAll('a[href]')) {
        const href = (a.getAttribute('href') ?? '').split('#')[0];
        if (!href.startsWith('/')) continue;
        const alvo = path.join(DIST, normalizePath(href).slice(1), 'index.html');
        const alvoRaiz = path.join(DIST, normalizePath(href) === '/' ? 'index.html' : '');
        if (!fs.existsSync(alvo) && !(normalizePath(href) === '/' && fs.existsSync(alvoRaiz))) {
          falhas.push(`L5 · ${url}: o caminho aponta para "${href}", que não existe em dist/.`);
        }
      }
    }
  }

  /* -------------------------------------------------------------------- L6 */
  for (const selo of corpo.querySelectorAll('[data-selo-etiqueta]')) {
    const etiqueta = selo.getAttribute('data-selo-etiqueta') ?? '';
    const href = (selo.getAttribute('href') ?? '').split('#')[0];
    const m = href ? matchPath(href) : null;
    const id = m?.key === 'linha' ? m.params.slug : null;
    const linha = id ? claims.get(id) : null;
    if (!linha) continue;
    const publicador = typeof linha.source === 'string' ? linha.source : null;
    if (!publicador) continue;
    if (etiqueta.includes(publicador)) continue;
    medidas.l6_selos++;
    anota('l6_selos', `${url} · ${id}: o selo diz «${etiqueta}» e o publicador é «${publicador}»`);
  }

  /* ------------------------------------------------------------------- 8.8 */
  /* «livro-razão» nos menus, nos rodapés e nos títulos das páginas do leitor.
     O termo técnico continua a valer no Método, no JSON e nos endereços.

     «LINHA DO LIVRO-RAZÃO» NÃO CONTA, e é a decisão à letra: o item 8.8 escreve
     que «"linha do livro-razão" continua a ser o nome de uma linha dentro do
     Método e das páginas de linha», e o mesmo nome aparece na mobília do
     cabeçalho, no contador das séries atrasadas que o F1.6 lá pôs («278 linhas
     do livro-razão»). O que a medida conta é o NOME DA PÁGINA, e por isso tira
     as ocorrências que são o nome de uma LINHA antes de contar. O inglês segue a
     mesma regra com a sua forma, «ledger row(s)». */
  if (!transcricao && chaveDaRota !== 'metodo') {
    const superficies = [];
    if (cabecalho) superficies.push(cabecalho.text);
    if (rodape) superficies.push(rodape.text);
    const titulo = raiz.querySelector('title');
    if (titulo) superficies.push(titulo.text);
    for (const h of corpo.querySelectorAll('h1')) superficies.push(h.text);
    const junto = superficies
      .join(' ')
      .replace(/linhas? do livro-razão/gi, ' ')
      .replace(/ledger rows?/gi, ' ');
    const n = conta(junto, 'Livro-razão') + conta(junto, 'livro-razão') + conta(junto, 'Ledger');
    if (n) {
      medidas.d88_livro_razao += n;
      anota('d88_livro_razao', `${url} · ×${n}`);
    }
  }

  /* ------------------------------------------------------------------ 8.13 */
  if (primeira) {
    const seccao = corpo.querySelector('#dominios');
    const selos = seccao ? seccao.querySelectorAll('[data-claim]').length : 0;
    if (selos) {
      medidas.d813_selos_nos_dominios += selos;
      anota('d813_selos_nos_dominios', `${url} · ${selos} valores selados na secção dos domínios`);
    }
    vistoNoIndice.set(`definicao:${url}`, conta(corpo.text, S[lang].identidade));
  }

  /* -------------------------------------------------------------------- L4 */
  for (const alvo of INDICES_DA_HIERARQUIA) {
    if (normalizePath(alvo.url) !== url) continue;
    vistoNoIndice.set(`hierarquia:${url}`, alvo.frase ? conta(corpo.text, alvo.frase) : 0);
  }
}

/**
 * A palavra que uma exceção cobre. `conta` é a raiz («peça», «trabalho») e a
 * palavra medida pode ser o plural ou a maiúscula.
 * @param {string} raizDaExcecao
 * @param {string} palavra
 */
function palavraDaExcecao(raizDaExcecao, palavra) {
  return palavra.toLowerCase().startsWith(raizDaExcecao.toLowerCase());
}

/**
 * Conta uma palavra INTEIRA num texto: «trabalho» não conta dentro de
 * «trabalhos», e «Município» não conta dentro de «Municípios».
 * @param {string} texto
 * @param {string} palavra
 */
function contaPalavra(texto, palavra) {
  const escapada = palavra.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(?<![\\p{L}])${escapada}(?![\\p{L}])`, 'gu');
  return (texto.match(re) ?? []).length;
}

/* -------------------------------------------------------------------- L4 */
for (const { url, frase } of DEFINICAO) {
  const visto = vistoNoIndice.get(`definicao:${normalizePath(url)}`) ?? 0;
  if (visto !== 1) {
    medidas.l4_falhas++;
    anota('l4_falhas', `a frase de definição em ${url}: ${visto} (esperado 1)`);
  }
}
for (const alvo of INDICES_DA_HIERARQUIA) {
  const visto = vistoNoIndice.get(`hierarquia:${normalizePath(alvo.url)}`) ?? 0;
  if (visto !== 1) {
    medidas.l4_falhas++;
    anota('l4_falhas', `a frase de hierarquia em ${alvo.url}: ${visto} (esperado 1)`);
  }
}

/* -------------------------------------------------------------------- 8.4 */
/* A COLEÇÃO TEM DE TER ELEMENTOS. São dois parágrafos por edição da página
   europeia, e duas edições: quatro. Zero diferenças sobre zero parágrafos é
   uma régua cega, e a regra 14 da casa fecha a construção em vez de a deixar
   passar por não ter encontrado nada. */
const DEFINICOES_ESPERADAS = Object.keys(DEFINICAO_DOS_PAINEIS).length * LANGS.length;
if (definicoesVistas !== DEFINICOES_ESPERADAS) {
  falhas.push(
    `8.4 · a régua viu ${definicoesVistas} parágrafo(s) [data-contexto-painel] em dist/, e ` +
      `esperava ${DEFINICOES_ESPERADAS} (${Object.keys(DEFINICAO_DOS_PAINEIS).length} painéis × ` +
      `${LANGS.length} edições). Uma comparação sobre uma coleção vazia não prova nada.`,
  );
}

/* --------------------------------------------------------------- §7.4 e 8.6 */
/* A COLEÇÃO TEM DE TER ELEMENTOS (regra 14 da casa). São doze estudos em duas
   edições (24 páginas de estudo), oito páginas de leitura, dois índices e as
   filas de edição de todas elas. Zero defeitos sobre zero páginas é uma régua
   cega, e a construção fecha em vez de a deixar passar por não ter encontrado
   nada. Os números não estão escritos: o que se exige é que cada coleção tenha
   pelo menos um elemento, e a contagem imprime-se. */
for (const [nome, n] of Object.entries(vistas)) {
  if (n > 0) continue;
  falhas.push(
    `§7.4 e 8.6 · a régua viu 0 «${nome}» em dist/. Uma contagem de defeitos sobre ` +
      `uma coleção vazia não prova nada.`,
  );
}

/* ---------------------------------------------------------------------------
 * O RELATÓRIO
 * --------------------------------------------------------------------------- */
const NOMES = {
  l1_paginas: 'L1 · páginas com dois destinos iguais fora da mobília',
  l2_segundas_listas: 'L2 · segundas listas dos concelhos',
  l2_reguas: 'L2 · réguas da convergência fora de /regioes',
  l2_sinopses: 'L2 · sinopses de estudo fora de /estudos',
  l3_vocabulario: 'L3 · palavras fora do vocabulário fechado',
  l4_falhas: 'L4 · frases de definição e de hierarquia em falta',
  l5_sem_caminho: 'L5 · páginas sem caminho no cabeçalho',
  l6_selos: 'L6 · selos que não dizem o publicador',
  d85_limiar_sozinho: '8.5 · «limiar» sozinho',
  d817_pontos_no_concelho: '8.17 · pontos dos 308 na página de um concelho',
  d817_concelhos_sem_mapa: '8.17 · páginas de concelho sem o mapa da sua unidade',
  d88_livro_razao: '8.8 · «livro-razão» nos menus e nos títulos',
  d813_selos_nos_dominios: '8.13 · valores selados na secção dos domínios de /',
  d814_densidades: '8.14 · «Relance» e «Leitura breve» nas páginas do leitor',
  d811_leituras_na_cabeca: '8.11 · leituras de aparelho no cabeçalho',
  d84_definicoes_fora: '8.4 · definições de painel fora da declaração',
  d86_estudos_forma: '§7.4 e 8.6 · estudos fora da forma única',
};

console.log(`check:lugar · ${paginas.length} páginas em dist/`);
for (const [chave, valor] of Object.entries(medidas)) {
  const teto = TETOS[chave];
  const estado = valor > teto ? 'ACIMA DO TETO' : valor + TETO_FROUXO < teto ? 'teto frouxo' : 'ok';
  console.log(`  ${NOMES[chave].padEnd(58)} ${String(valor).padStart(7)}  (teto ${teto}) ${estado}`);
  for (const a of amostras[chave]) console.log(`      · ${a}`);
  if (valor > teto) {
    falhas.push(`${NOMES[chave]}: ${valor}, acima do teto ${teto}.`);
  } else if (valor + TETO_FROUXO < teto) {
    falhas.push(
      `${NOMES[chave]}: ${valor}, e o teto está em ${teto}. Um teto com mais de ` +
        `${TETO_FROUXO} de folga já não mede nada: baixa-o para ${valor} com a data.`,
    );
  }
}

console.log(
  '  §7.4 e 8.6, o que a régua leu: ' +
    Object.entries(vistas)
      .map(([k, n]) => `${k} ${n}`)
      .join(' · '),
);

console.log('  as exceções, e quantas vezes cada uma foi precisa:');
for (const [i, e] of EXCECOES_DO_VOCABULARIO.entries()) {
  const n = usoDasExcecoes.get(i) ?? 0;
  console.log(`      · «${e.conta}» ${String(n).padStart(5)} · ${e.porque}`);
  if (n === 0) {
    falhas.push(
      `A exceção «${e.conta}» (${e.porque}) não foi precisa uma única vez: uma exceção ` +
        `que já não serve é uma porta aberta esquecida. Tira-a.`,
    );
  }
}

const palavras = [...porPalavra.entries()].filter(([, n]) => n > 0);
if (palavras.length) {
  console.log('  a L3, palavra a palavra:');
  for (const [p, n] of palavras.sort((a, b) => b[1] - a[1])) {
    console.log(`      · ${p.padEnd(14)} ${String(n).padStart(6)}`);
  }
}
const densidades = [...porDensidade.entries()].filter(([, n]) => n > 0);
if (densidades.length) {
  console.log('  a 8.14, palavra a palavra:');
  for (const [p, n] of densidades.sort((a, b) => b[1] - a[1])) {
    console.log(`      · ${p.padEnd(14)} ${String(n).padStart(6)}`);
  }
}

if (falhas.length) {
  console.error(`\ncheck:lugar · ${falhas.length} falha(s):`);
  for (const f of falhas) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log('check:lugar · verde.');
