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
import {
  DEFINICAO_DOS_PAINEIS,
  DEFINICOES_DAS_MEDIDAS,
  origensDaDefinicao,
} from '../src/data/figuras.mjs';
/* O REGISTO DOS ESTUDOS E O DAS LEITURAS (Major 13, 09.09.2026): a régua conta
   quantas superfícies TEM DE haver e compara-as com as que viu, em vez de se
   contentar com «pelo menos uma». Ver `COLECOES_DOS_ESTUDOS`, mais abaixo. */
import { WORKS } from '../src/data/studies.mjs';
/* O REGISTO DAS TRANSCRIÇÕES: o `<head>` de uma página de estudo compõe a
   descrição pública com a frase de abertura do documento, que é transcrição
   registada. Ver `textoDaCabeca()`. */
import { VERBATIM } from '../src/data/verbatim.mjs';
import { dominiosComPagina, medidasDoDominio } from '../src/data/dominios.mjs';
import { temRegisto } from '../src/lib/registos.mjs';
import { documentosDoEstudo } from '../src/lib/documentos.mjs';

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
  /* DESCE DE 6 580 PARA 2 170 a 09.09.2026, com a correção do padrão maior
     (Blocking 3 da leitura a frio, e a emenda de 09.09 ao §5 do brief). A porta
     de uma conferência de linha só se rende quando o que foi lido NÃO é o
     endereço da própria linha: eram 3 606 das 3 625 conferências do livro-razão,
     e a família `linha` desceu de 5 832 páginas para 1 422.

     A L1 É UMA CATRACA, com o horizonte a zero. Este teto não é o fim do
     trabalho: é onde ele está. Só desce, e desce com a data e a razão ao lado,
     como esta. A composição do que falta mede-se com
     `design/especime-v3/medicoes/lugar-2026-09-04/l1-composicao.mjs`, e o padrão
     maior que resta são as 616 páginas de concelho, onde o selo do cartão e o
     selo do pé da leitura que ele abre apontam os dois para a mesma linha. */
  l1_paginas: 2170,
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
     abertura do documento, transcrita.
     DESCE DE 26 PARA 0 a 09.09.2026, com o Major 5 da leitura a frio e a decisão
     do lugar de direção: «"concelho" na voz da casa em todo o lado; o que for
     citação de um título ou de um documento fica como a fonte escreve, marcado
     como tal». Três coisas ao mesmo tempo, e a soma é zero: `blocosDaCasa()`
     passou a fazer o mesmo corte da `textoDaCasa()` (o que está debaixo de uma
     marca de origem é da fonte), duas descrições de estudo passaram a
     «concelho» e as outras duas ficaram como o documento as escreve (estão
     registadas em `verbatim.mjs`, e o portão apanhou a troca no mesmo dia), o
     Método deixou de chamar «trabalhos» aos estudos, e as ocorrências que ficam
     no texto da casa são as duas exceções escritas abaixo, cada uma com a razão.
     O teto é zero, e um zero não tem folga. */
  l3_vocabulario: 0,
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
       «trabalho(s)» como nome de estudo.

       CRESCE A 09.09.2026, com o Major 5 da leitura a frio: a decisão do lugar
       de direção manda que «"concelho" fique na voz da casa em todo o lado» e
       que «a régua diga que ocorrências ficam e porquê». As quatro formas novas
       são as que o `dist/` de 09.09 tem, e nenhuma delas nomeia um estudo:
       «condições de trabalho» é o nome de uma matéria de uma área de governo,
       que vem dos dados; «sem trabalho» e «intensidade de trabalho» são a
       definição do desemprego de longa duração e a do risco de pobreza, tal
       como o Eurostat as escreve; «trabalho de quem não escreveu a linha» e
       «dirige o trabalho» são a palavra no sentido de LABOR, no Método e na
       política de IA. */
    conta: 'trabalho',
    porque: '«trabalho» no sentido de emprego ou de labor, que não é o nome de um estudo',
    padrao: /procuram trabalho|custo unitário do trabalho|custo nominal do trabalho|Trabalho, Solidariedade e Segurança Social|mercado de trabalho|postos de trabalho|condições de trabalho|sem trabalho|intensidade de trabalho|trabalho de quem não escreveu|dirige o trabalho/,
  },
  {
    /* «indicador» A NOMEAR O CAMPO DA FONTE, e não a medida da casa (Major 5,
       09.09.2026). A página do domínio diz, na ausência de um número por
       concelho, que campo é que o publicador dá em vez dele: «O indicador que o
       publicador dá por concelho é um coeficiente de variação do ganho, e não a
       disparidade entre sexos.» A palavra é a do INE, e trocá-la por «medida»
       faria a frase dizer que a casa tem ali uma medida, que é precisamente o
       que ela veio dizer que não tem. Fica, e a régua diz porquê. */
    conta: 'indicador',
    porque: '«indicador» a nomear o campo que o publicador dá, e não uma medida da casa',
    padrao: /O indicador que o publicador dá por concelho/,
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
 * O `<HEAD>` É SUPERFÍCIE PÚBLICA (Major 6 da leitura a frio, 09.09.2026).
 *
 * A L3 começava no `<body>`, e por isso a descrição pública da primeira página
 * continuava a dizer «indicadores» e a descrever os quadros europeus que o item
 * 8.16 tinha tirado dali, sem que régua nenhuma a visse. O `<title>` e as duas
 * descrições (a do motor de busca e a das redes) são escritas pela casa, são
 * lidas por quem nunca abriu a página, e passam a contar como texto da casa.
 *
 * A DESCRIÇÃO DAS REDES É A MESMA CADEIA da `<meta name="description">` em
 * todas as rotas do sítio, e por isso conta uma vez: contá-la duas faria a L3
 * dizer o dobro da mesma frase. A régua junta as duas e tira as repetições.
 *
 * O CORTE DA ORIGEM DECLARADA FAZ-SE AQUI À MÃO, porque um `<meta>` não tem
 * filhos onde pôr uma marca. A descrição de uma página de linha é COMPOSTA a
 * partir dos campos daquela linha (o valor, o publicador, o título do documento
 * e as datas), e o título de um documento é uma transcrição: «Evolução do
 * endividamento total, por município» é como a DGAL escreve, e a casa não edita
 * o que transcreve. A régua vai buscar os campos àquela linha do livro-razão e
 * tira-os do texto antes de contar; o que sobra é a frase da casa. Sem este
 * corte a L3 contava 4 411 ocorrências que são todas nomes de documentos e de
 * organismos, e a medida deixava de medir a voz.
 *
 * @param {import('node-html-parser').HTMLElement} raiz
 * @param {{ key: string, params: Record<string, string> } | null} rota
 */
function textoDaCabeca(raiz, rota) {
  const cabeca = raiz.querySelector('head');
  if (!cabeca) return '';
  /** @type {Set<string>} */
  const partes = new Set();
  const titulo = cabeca.querySelector('title');
  if (titulo) partes.add(titulo.text.replace(/\s+/g, ' ').trim());
  for (const m of cabeca.querySelectorAll('meta[name="description"], meta[property="og:description"]')) {
    const c = (m.getAttribute('content') ?? '').replace(/\s+/g, ' ').trim();
    if (c) partes.add(c);
  }
  let texto = [...partes].join(' · ');
  /* AS TRANSCRIÇÕES REGISTADAS SAEM DO TEXTO DA CASA, TAMBÉM NO `<head>`. A
     descrição pública de uma página de estudo é a frase de abertura do
     documento, palavra por palavra, e está em `src/data/verbatim.mjs`, onde o
     portão de HTML a compara carácter a carácter. Duas delas dizem «município
     de Évora», que é como o documento escreve; a casa não edita o que
     transcreve, e a L3 não conta o que a casa não escreveu. No `<body>` este
     corte já se fazia pela marca `data-verbatim`; um `<meta>` não tem onde a
     pendurar, e por isso faz-se pelo texto. */
  for (const v of Object.values(VERBATIM)) {
    if (typeof v?.text !== 'string') continue;
    const cadeia = v.text.replace(/\s+/g, ' ').trim();
    if (cadeia.length < 20 || !texto.includes(cadeia)) continue;
    texto = texto.split(cadeia).join(' ');
  }
  /* OS IDENTIFICADORES DO ENDEREÇO NÃO SÃO PALAVRAS. A descrição de uma página
     de linha abre com o id da linha («custo-unitario-do-trabalho-2025»), e o id
     é o endereço dela, não uma frase: contar «trabalho» ali seria a régua a
     medir o `slug`. Saem os parâmetros da rota, que é o que eles são. */
  for (const valor of Object.values(rota?.params ?? {})) {
    if (typeof valor === 'string' && valor) texto = texto.split(valor).join(' ');
  }
  const linha = rota?.key === 'linha' ? claims.get(rota.params.slug) : null;
  if (linha) {
    for (const campo of [
      linha.document?.title,
      linha.document?.edition,
      linha.document?.locator,
      linha.source,
      linha.name,
      linha.unit,
    ]) {
      if (typeof campo !== 'string' || !campo) continue;
      texto = texto.split(campo).join(' ');
    }
  }
  return texto;
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

/**
 * OS BLOCOS DA CASA, E SÓ OS DA CASA (segunda passagem, 09.09.2026).
 *
 * Até 09.09 esta função devolvia TODOS os blocos da página, incluindo os que
 * estão debaixo de uma marca de origem declarada, e a `textoDaCasa()` ao lado
 * fazia o corte contrário. As duas leituras discordavam, e a discordância só
 * não se via porque nenhuma transcrição tinha ainda uma das palavras medidas.
 * A segunda passagem trouxe uma: os excertos das definições da página europeia
 * são a Comissão a falar, e três deles dizem «threshold». Contá-los na 8.5
 * seria a régua a exigir que a casa emendasse uma citação.
 *
 * O CORTE É O MESMO DA `textoDaCasa()`: tudo o que está DENTRO de uma marca de
 * origem declarada, ou que a CONTÉM, é da fonte e não da casa. É a regra que o
 * cabeçalho de `ORIGEM_DECLARADA` já escrevia, aplicada agora às duas leituras.
 *
 * @param {import('node-html-parser').HTMLElement} raiz
 */
function blocosDaCasa(raiz) {
  const corpo = raiz.querySelector('body');
  if (!corpo) return [];
  const daFonte = new Set();
  for (const el of corpo.querySelectorAll(ORIGEM_DECLARADA)) {
    daFonte.add(el);
    for (const d of el.querySelectorAll('*')) daFonte.add(d);
  }
  /** @type {string[]} */
  const out = [];
  for (const el of corpo.querySelectorAll(BLOCOS)) {
    if (daFonte.has(el)) continue;
    if (el.querySelector(ORIGEM_DECLARADA)) continue;
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
/** Quantas origens de definição a régua viu (a mesma regra 14). */
let origensVistas = 0;
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
  if (amostras[chave].length < (Number(process.env.AMOSTRA) || 6)) amostras[chave].push(linha);
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
    /* SÓ UM `<details>` FECHADO É UMA ALTERNATIVA EM TEXTO (Major 12 da leitura
       a frio, 09.09.2026). A régua isentava TODOS os descendentes de TODOS os
       `<details>`, sem olhar ao atributo `open`: uma lista dos 308 aberta de
       origem passava verde por estar dentro de uma dobra que nunca fecha. O §1
       do brief deixa a lista lá como «a lista fechada como alternativa em texto
       do mapa», e é a palavra «fechada» que a régua passa a exigir. */
    const dentroDeLista = new Set();
    for (const d of corpo.querySelectorAll('details')) {
      if (d.hasAttribute('open')) continue;
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
    /* A RÉGUA DETETA-SE PELA FORMA, E NÃO SÓ PELO MARCADOR (Major 12,
       09.09.2026). O marcador `data-instrumento="convergencia"` continua a
       contar, porque é a declaração da casa; mas uma cópia da régua com outra
       marca, ou sem marca nenhuma, passava verde, e a planta da L9 que mudava o
       marcador provava só que a régua sabe ler o marcador que ela própria
       escreve. A FORMA é a que o §1 do brief nomeia: «a régua inteira», as nove
       regiões com os seus valores. Um bloco que ligue às nove páginas de região
       e traga nove ou mais valores selados É a régua, chame-se ele como se
       chamar. Uma porta para uma região vizinha não é: são nove destinos
       distintos e nove selos, e nada disso acontece por acaso. */
    const marcadas = new Set(corpo.querySelectorAll('[data-instrumento="convergencia"]'));
    const porForma = [];
    for (const bloco of corpo.querySelectorAll('div,section,figure,table,ul,ol,aside')) {
      if (marcadas.has(bloco)) continue;
      const regioes = new Set();
      for (const a of bloco.querySelectorAll('a[href]')) {
        const href = (a.getAttribute('href') ?? '').split('#')[0];
        const m = href ? matchPath(href) : null;
        if (m?.key === 'regiao') regioes.add(normalizePath(href));
      }
      if (regioes.size < 9) continue;
      if (bloco.querySelectorAll('[data-claim]').length < 9) continue;
      /* CONTA-SE O BLOCO DE FORA, UMA VEZ: os ascendentes vêm primeiro na ordem
         do documento, e um deles a casar com a forma torna todos os que estão
         dentro dele a mesma régua vista de mais perto. Sem isto, uma régua
         contaria tantas vezes quantos os invólucros que tem. */
      if (porForma.some((b) => b.querySelectorAll('*').includes(bloco))) continue;
      porForma.push(bloco);
    }
    const reguas = marcadas.size + porForma.length;
    if (reguas) {
      medidas.l2_reguas += reguas;
      anota(
        'l2_reguas',
        `${url} · ${reguas} régua(s) da convergência` +
          (porForma.length ? ` (${porForma.length} pela forma, sem o marcador)` : ''),
      );
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
    /* O `<head>` entra na L3 como um bloco a mais: é texto da casa, é público,
       e a régua não o via (Major 6, 09.09.2026). */
    const cabeca = textoDaCabeca(raiz, rota);
    const blocos = cabeca ? [cabeca, ...blocosDaCasa(raiz)] : blocosDaCasa(raiz);
    const texto = `${cabeca} ${textoDaCasa(raiz)}`;
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
  /* AS 23, E NÃO AS DUAS (Blocking 1 da leitura a frio, 09.09.2026). A régua
     comparava os dois parágrafos dos painéis e mais nada: as 21 definições das
     medidas e a ORIGEM de todas elas não eram medidas por régua nenhuma, e foi
     nesse silêncio que dez definições viveram meio dia com um excerto que não
     as continha. A decisão do lugar de direção manda comparar as 23 e conferir,
     em cada uma, que a origem tem os quatro campos e que o excerto declarado
     está na página.

     `conferirDefinicao()` faz as duas metades para as duas famílias: o texto
     contra a declaração, e a origem contra `ORIGENS_DAS_DEFINICOES`. */
  const conferirDefinicao = (el, nome, partes, definicao) => {
    definicoesVistas++;
    const declarada = Array.isArray(partes)
      ? partes.map((p) => (typeof p === 'string' ? p : (p.nl ?? p.ref ?? ''))).join('').replace(/\s+/g, ' ').trim()
      : null;
    const rendida = el.text.replace(/\s+/g, ' ').trim();
    if (declarada === null) {
      medidas.d84_definicoes_fora++;
      anota('d84_definicoes_fora', `${url} · «${nome}» não é uma definição declarada`);
      return;
    }
    if (rendida !== declarada) {
      medidas.d84_definicoes_fora++;
      anota(
        'd84_definicoes_fora',
        `${url} · «${nome}»: a página diz «${rendida.slice(0, 60)}…» e a declaração diz «${declarada.slice(0, 60)}…»`,
      );
    }
    /* A ORIGEM AO PÉ DA DEFINIÇÃO. Os blocos da origem são irmãos do parágrafo
       (a definição de um painel) ou vizinhos dele dentro da mesma dobra (a de
       uma medida): a régua procura-os no PAI, que é o invólucro dos dois. */
    const involucro = el.parentNode;
    const rendidas = new Map();
    for (const o of involucro?.querySelectorAll?.('[data-def-origem]') ?? []) {
      rendidas.set(o.getAttribute('data-def-origem') ?? '', o);
    }
    for (const o of origensDaDefinicao(definicao, lang)) {
      origensVistas++;
      const bloco = rendidas.get(o.chave);
      if (!bloco) {
        medidas.d84_definicoes_fora++;
        anota('d84_definicoes_fora', `${url} · «${nome}»: a origem «${o.chave}» não se rende na página`);
        continue;
      }
      const texto = bloco.text.replace(/\s+/g, ' ').trim();
      const porta = bloco
        .querySelectorAll('a[href]')
        .some((a) => (a.getAttribute('href') ?? '') === o.url);
      if (!porta) {
        medidas.d84_definicoes_fora++;
        anota('d84_definicoes_fora', `${url} · «${nome}»: a origem «${o.chave}» não tem porta para «${o.url}»`);
      }
      for (const [campo, valor] of [
        ['o publicador', o.publicador],
        ['o documento', o.documento],
        ['o excerto', o.excerto],
      ]) {
        if (texto.includes(valor.replace(/\s+/g, ' ').trim())) continue;
        medidas.d84_definicoes_fora++;
        anota('d84_definicoes_fora', `${url} · «${nome}»: a origem «${o.chave}» não rende ${campo}`);
      }
      const data = `${o.lido.slice(8, 10)}.${o.lido.slice(5, 7)}.${o.lido.slice(0, 4)}`;
      if (!texto.includes(data)) {
        medidas.d84_definicoes_fora++;
        anota('d84_definicoes_fora', `${url} · «${nome}»: a origem «${o.chave}» não rende a data de leitura`);
      }
    }
  };

  for (const el of corpo.querySelectorAll('[data-contexto-painel]')) {
    const chave = el.getAttribute('data-contexto-painel') ?? '';
    const painel = DEFINICAO_DOS_PAINEIS[chave];
    conferirDefinicao(el, chave, painel?.[lang] ?? null, painel ?? { origens: [] });
  }
  /* AS MEDIDAS, NOS DOIS SÍTIOS ONDE A DEFINIÇÃO SE RENDE. Na página europeia
     ela vive dentro da dobra da leitura (`data-leitura`); na página do domínio
     vive num bloco próprio ao pé do nome (`data-definicao`, decisão 24 de
     09.09.2026). A conferência é a mesma nas duas. */
  for (const dobra of corpo.querySelectorAll('[data-leitura], [data-definicao]')) {
    const id = dobra.getAttribute('data-leitura') ?? dobra.getAttribute('data-definicao') ?? '';
    const d = DEFINICOES_DAS_MEDIDAS[id];
    if (!d) continue;
    const el = dobra.querySelector('.dobra-definicao');
    if (!el) {
      medidas.d84_definicoes_fora++;
      anota('d84_definicoes_fora', `${url} · «${id}»: a leitura não rende a definição`);
      continue;
    }
    conferirDefinicao(el, id, d[lang], d);
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
      /* O TÍTULO É A PORTA, E É A ÚNICA (Major 8, 09.09.2026). O §7.4 manda que
         «o título da lista vá direto ao texto», e até 09.09 o título abria a
         capa e a leitura tinha uma porta separada ao lado: o gesto natural
         continuava a parar onde o item mandou deixar de parar. A régua exige
         agora as três coisas: uma porta só na linha, ELA É O TÍTULO, e aponta
         para uma página que existe em `dist/`. */
      const portas = linha.querySelectorAll('.arquivo-porta');
      if (portas.length !== 1) {
        medidas.d86_estudos_forma++;
        anota('d86_estudos_forma', `${url} · uma linha com ${portas.length} porta(s) da leitura`);
        continue;
      }
      const titulo = linha.querySelector('.arquivo-titulo a');
      if (!titulo || titulo !== portas[0]) {
        medidas.d86_estudos_forma++;
        anota('d86_estudos_forma', `${url} · a porta da linha não é o título`);
        continue;
      }
      const href = (portas[0].getAttribute('href') ?? '').split('#')[0];
      const alvo = path.join(DIST, normalizePath(href).slice(1), 'index.html');
      if (!href.startsWith('/') || !fs.existsSync(alvo)) {
        medidas.d86_estudos_forma++;
        anota('d86_estudos_forma', `${url} · a porta da leitura aponta para "${href}", que não existe em dist/`);
        continue;
      }
      /* E LEVA AO TEXTO, ONDE O TEXTO EXISTE. Sem esta conferência, um título a
         apontar outra vez para a capa passava verde: é o defeito que o Major 8
         encontrou, e é este o sítio onde ele volta a ser vermelho. */
      const m = matchPath(href);
      const slug = m?.params?.slug ?? null;
      const temTexto = slug ? LANGS.some((l) => temRegisto(slug, l)) : false;
      if (temTexto && m?.key !== 'texto') {
        medidas.d86_estudos_forma++;
        anota(
          'd86_estudos_forma',
          `${url} · «${slug}» tem página de leitura e o título abre "${href}"`,
        );
      }
    }
  }

  /* -------------------------------------------------------------------- L5 */
  /* O CAMINHO NO CABEÇALHO, E TRÊS COISAS EM VEZ DE UMA (Major 11 da leitura a
     frio, 09.09.2026). A régua aceitava QUALQUER `<nav>` do corpo com o rótulo
     certo, em qualquer sítio da página e mesmo vazio, e ignorava em silêncio as
     ligações que não começassem por `/`. Um caminho no rodapé, um caminho sem
     migalhas e um caminho com uma ligação relativa partida passavam os três
     verdes. O §2.5 do brief diz o que ele é: «cada página abaixo da primeira
     mostra o seu caminho no cabeçalho, como texto com ligações». A régua passa
     a exigir as três: DENTRO do `<header>`, com pelo menos UMA migalha com
     ligação, e cada ligação a existir em `dist/`, absoluta ou relativa. */
  const primeira = chaveDaRota === 'home';
  if (!primeira && !transcricao) {
    const rotulo = S[lang].nav?.rotuloCaminho;
    const caminho = rotulo
      ? corpo
          .querySelectorAll('nav')
          .find((n) => n.getAttribute('aria-label') === rotulo && daMobilia.has(n))
      : null;
    if (!caminho) {
      medidas.l5_sem_caminho++;
      anota('l5_sem_caminho', url);
    } else {
      const migalhas = caminho.querySelectorAll('a[href]');
      if (migalhas.length === 0) {
        medidas.l5_sem_caminho++;
        anota('l5_sem_caminho', `${url} · o caminho não tem uma migalha com ligação`);
      }
      for (const a of migalhas) {
        const bruto = (a.getAttribute('href') ?? '').split('#')[0];
        if (!bruto) continue;
        /* AS LIGAÇÕES RELATIVAS CONTAM. Uma migalha `../concelhos` resolve-se
           contra a rota desta página, e uma que não resolva é uma porta
           partida como qualquer outra. */
        const href = bruto.startsWith('/')
          ? bruto
          : normalizePath(new URL(bruto, `https://x${url === '/' ? '/' : `${url}/`}`).pathname);
        const rel = normalizePath(href);
        const alvo = rel === '/' ? path.join(DIST, 'index.html') : path.join(DIST, rel.slice(1), 'index.html');
        if (!fs.existsSync(alvo)) {
          falhas.push(`L5 · ${url}: o caminho aponta para "${bruto}", que não existe em dist/.`);
        }
      }
    }
  }

  /* -------------------------------------------------------------------- L6 */
  /* TODOS OS SELOS, E NÃO SÓ OS QUE JÁ TÊM O ATRIBUTO (Major 11, 09.09.2026).
     A régua percorria `[data-selo-etiqueta]`: um selo a quem faltasse o atributo
     não era medido, era invisível, e o mesmo acontecia a um selo com a porta
     partida ou a uma linha sem publicador — os três saíam por `continue` e a
     medida ficava a 0 sem ter olhado para eles. A porta que ela existe para
     guardar é «o selo diz o publicador em 100 % dos selos», e cem por cento
     conta-se sobre TODOS os selos.

     QUATRO DEFEITOS, E TODOS CONTAM:
       1. um selo sem `data-selo-etiqueta`;
       2. um selo cuja porta não é uma página de linha, ou é uma linha que o
          livro-razão não tem;
       3. uma linha sem publicador declarado;
       4. um rótulo que não diz o publicador daquela linha.

     A COMPARAÇÃO É DO RÓTULO INTEIRO. Era `etiqueta.includes(publicador)`, e
     «INE» está dentro de «INEXISTENTE»: um rótulo errado que contivesse o nome
     do publicador por acaso passava. O rótulo tem de SER o publicador, ou o
     publicador com a palavra da casa que o selo já escreve à frente («calculado
     · INE»), que é a única outra forma que a casa rende. */
  for (const selo of corpo.querySelectorAll('a.src-chip')) {
    const etiqueta = selo.getAttribute('data-selo-etiqueta');
    const href = (selo.getAttribute('href') ?? '').split('#')[0];
    const m = href ? matchPath(href) : null;
    const id = m?.key === 'linha' ? m.params.slug : null;
    const linha = id ? claims.get(id) : null;
    /* A PORTA DE UM SELO PODE SER UM ESTUDO desta casa (§2.4: «onde a linha vem
       de um estudo da casa, o selo diz "linha"»). Esses não têm linha do
       livro-razão para comparar, e a régua di-lo em vez de os saltar. */
    const paraEstudo = m?.key === 'estudo' || m?.key === 'texto';
    if (etiqueta === null || etiqueta === undefined) {
      medidas.l6_selos++;
      anota('l6_selos', `${url} · um selo para "${href}" sem data-selo-etiqueta`);
      continue;
    }
    if (paraEstudo) continue;
    if (!linha) {
      medidas.l6_selos++;
      anota('l6_selos', `${url} · o selo «${etiqueta}» aponta para "${href}", que não é uma linha`);
      continue;
    }
    const publicador = typeof linha.source === 'string' ? linha.source.trim() : '';
    const limpo = etiqueta.replace(/\s+/g, ' ').trim();
    const calculado = [S.pt.prov.calculado, S.en.prov.calculado];
    /* UMA LINHA CALCULADA NÃO TEM PUBLICADOR, E O SELO DI-LO. A aritmética é
       desta casa: `source` é `null` de propósito e `derivation` diz a conta. O
       selo escreve «calculado» sozinho, e é a forma certa; o que a régua exige
       é que as duas coisas andem juntas. Uma linha sem publicador e sem conta é
       outra coisa, e essa continua a contar. */
    if (!publicador) {
      const derivada = typeof linha.derivation === 'string' && linha.derivation.trim().length > 0;
      if (derivada && calculado.includes(limpo)) continue;
      medidas.l6_selos++;
      anota(
        'l6_selos',
        `${url} · ${id}: a linha não declara publicador${derivada ? '' : ' nem derivação'}, e o selo diz «${limpo}»`,
      );
      continue;
    }
    const eOPublicador =
      limpo === publicador || calculado.some((c) => limpo === `${c} · ${publicador}`);
    if (eOPublicador) continue;
    medidas.l6_selos++;
    anota('l6_selos', `${url} · ${id}: o selo diz «${limpo}» e o publicador é «${publicador}»`);
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
/* AS DEFINIÇÕES QUE AS PÁGINAS DO DOMÍNIO RENDEM (decisão 24, 09.09.2026): as
   medidas de um domínio COM PÁGINA cuja linha tem definição declarada. Sai da
   mesma declaração que a vista lê, e não de um número escrito à mão: hoje são
   três das dez do primeiro domínio, e o dia em que um domínio novo trouxer uma
   medida com definição a conta muda sozinha dos dois lados. */
const DEFINICOES_NOS_DOMINIOS = dominiosComPagina().reduce(
  (n, d) =>
    n +
    medidasDoDominio(d.slug ?? d).filter((m) => m.claim in DEFINICOES_DAS_MEDIDAS).length,
  0,
);
const MEDIDAS_DOS_DOMINIOS = dominiosComPagina().flatMap((d) =>
  medidasDoDominio(d.slug ?? d).filter((m) => m.claim in DEFINICOES_DAS_MEDIDAS),
);
const DEFINICOES_ESPERADAS =
  (Object.keys(DEFINICAO_DOS_PAINEIS).length +
    Object.keys(DEFINICOES_DAS_MEDIDAS).length +
    DEFINICOES_NOS_DOMINIOS) *
  LANGS.length;
const ORIGENS_ESPERADAS =
  ([
    ...Object.values(DEFINICAO_DOS_PAINEIS),
    ...Object.values(DEFINICOES_DAS_MEDIDAS),
    ...MEDIDAS_DOS_DOMINIOS.map((m) => DEFINICOES_DAS_MEDIDAS[m.claim]),
  ].reduce((n, d) => n + d.origens.length, 0)) * LANGS.length;
console.log(
  `  8.4, o que a régua leu: ${definicoesVistas} definições (esperadas ${DEFINICOES_ESPERADAS}) · ` +
    `${origensVistas} origens (esperadas ${ORIGENS_ESPERADAS})`,
);
if (definicoesVistas !== DEFINICOES_ESPERADAS) {
  falhas.push(
    `8.4 · a régua viu ${definicoesVistas} definição(ões) em dist/, e esperava ` +
      `${DEFINICOES_ESPERADAS} (${Object.keys(DEFINICAO_DOS_PAINEIS).length} painéis mais ` +
      `${Object.keys(DEFINICOES_DAS_MEDIDAS).length} medidas × ${LANGS.length} edições). Uma ` +
      `comparação sobre uma coleção vazia não prova nada.`,
  );
}
if (origensVistas !== ORIGENS_ESPERADAS) {
  falhas.push(
    `8.4 · a régua viu ${origensVistas} origem(ns) de definição em dist/, e esperava ` +
      `${ORIGENS_ESPERADAS}. Uma definição citada sem a sua origem rendida é o defeito que ` +
      `a leitura a frio de 09.09.2026 abriu.`,
  );
}

/* --------------------------------------------------------------- §7.4 e 8.6 */
/**
 * A COLEÇÃO TEM DE TER O TAMANHO QUE OS DADOS DIZEM (Major 13, 09.09.2026).
 *
 * A régua exigia «pelo menos um» de cada coisa, e o relatório afirmava 24
 * páginas de estudo, 8 de leitura, 2 índices, 44 filas de edição e 24 linhas do
 * índice. Perder 23 páginas de estudo ou 43 filas de edição passava verde: a
 * guarda não guardava nenhuma das contagens que o relatório dava por medidas.
 *
 * AS CONTAGENS SAEM DO REGISTO, E NÃO DE UM NÚMERO ESCRITO À MÃO. `WORKS` diz
 * quantos estudos há e que edições cada um tem; `temRegisto()` diz quais têm
 * página de leitura; `documentosDoEstudo()` diz quais têm documento alojado. O
 * dia em que um estudo entrar, a conta muda sozinha nos dois lados, e o que ela
 * continua a proibir é a página que desaparece em silêncio.
 *
 * O QUE CADA COLEÇÃO É:
 *   · `estudo`  · uma página por estudo e por edição do sítio: 12 × 2;
 *   · `texto`   · uma por PAR (estudo, língua) com registo: a página de leitura
 *                 existe na edição do sítio cuja língua tem registo, e só nessa;
 *   · `indice`  · o índice dos estudos, nas duas edições;
 *   · `edicoes` · uma fila por edição de documento, em cada superfície que a
 *                 rende (a página do estudo e a de leitura), nas duas edições;
 *   · `linhas`  · uma linha por estudo em cada índice: 12 × 2.
 */
const COLECOES_DOS_ESTUDOS = (() => {
  const langs = LANGS.length;
  /* Os pares (estudo, língua) que têm página de leitura: são eles as rotas
     `texto` que a construção rende, e não «o estudo nas duas edições». */
  const paresComTexto = WORKS.flatMap((w) => LANGS.filter((l) => temRegisto(w.slug, l)).map((l) => w));
  /* AS FILAS DE EDIÇÃO: `EdicoesDoEstudo.astro` rende uma fila por edição do
     estudo, e rende-se na página do estudo e na de leitura. O número de edições
     de um estudo é o das suas edições declaradas mais os documentos alojados que
     não tenham edição declarada; a régua conta o que a vista conta, lendo a
     mesma fonte. */
  const filasDe = (w) => {
    const linguas = new Set(w.editions.map((e) => e.lang));
    for (const d of documentosDoEstudo(w.slug)) linguas.add(d.lang);
    return linguas.size;
  };
  const filasNaPaginaDoEstudo = WORKS.reduce((n, w) => n + filasDe(w), 0) * langs;
  const filasNaPaginaDeLeitura = paresComTexto.reduce((n, w) => n + filasDe(w), 0);
  return {
    estudo: WORKS.length * langs,
    texto: paresComTexto.length,
    indice: langs,
    edicoes: filasNaPaginaDoEstudo + filasNaPaginaDeLeitura,
    linhas: WORKS.length * langs,
  };
})();
console.log(
  '  §7.4 e 8.6, o que os dados dizem: ' +
    Object.entries(COLECOES_DOS_ESTUDOS)
      .map(([k, n]) => `${k} ${n}`)
      .join(' · '),
);
for (const [nome, n] of Object.entries(vistas)) {
  const esperado = COLECOES_DOS_ESTUDOS[nome];
  if (n === esperado) continue;
  falhas.push(
    `§7.4 e 8.6 · a régua viu ${n} «${nome}» em dist/, e o registo dos estudos diz ` +
      `${esperado}. Uma coleção mais pequena do que os dados é uma família de páginas ` +
      `que desapareceu em silêncio; uma maior é uma segunda apresentação da mesma coisa.`,
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
