/**
 * O MAPA POR DISTRITOS: a leitura dos artefactos que o motor atravessou.
 *
 * ---------------------------------------------------------------------------
 * O QUE ESTE FICHEIRO É, E O QUE NÃO É
 * ---------------------------------------------------------------------------
 * É a única porta do sítio para `mapa/`, que é o que o motor escreve e o sítio
 * lê (regra da fronteira, DECISIONS §1.31): conteúdo estruturado, nunca saída
 * rendida. Aqui não se calcula geometria nenhuma, não se simplifica nada e não
 * se inventa um número: lê-se o ficheiro, confere-se a forma, e devolve-se.
 *
 * NENHUM NÚMERO DESTE FICHEIRO É ESCRITO À MÃO. O campo, as caixas, os pontos e
 * os caminhos vêm todos do artefacto, e o `viewBox` de qualquer desenho é
 * `0 0 {campo.largura} {campo.altura}` do ficheiro que se está a desenhar. O
 * contrato está em `ResearchHub/publisher/MAPA.md` §1 e §7, e o manifesto
 * repete-o na sua nota: «em cada ficheiro, o campo, as caixas, os pontos e os
 * caminhos vivem todos no mesmo espaço, que é o do viewBox».
 *
 * ---------------------------------------------------------------------------
 * PORQUE É UM LEITOR E NÃO UM `import`
 * ---------------------------------------------------------------------------
 * `mapa/` está na raiz do repositório e não em `src/`: é a pasta de chegada do
 * exportador do motor, e o motor recusa escrever nela se ela não estiver limpa
 * no git. Um `import` de JSON prendia o formato do artefacto à forma de módulo
 * do sítio; um leitor de ficheiros deixa o artefacto ser o que é, e deixa o
 * portão lê-lo pelo mesmo caminho sem passar pela construção.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * A raiz do repositório, procurada a subir.
 *
 * A mesma disciplina de `encontraRaiz()` em `src/lib/prova.mjs`, e pela mesma
 * razão: na construção este módulo é empacotado para dentro de `dist/`, e um
 * caminho relativo ao ficheiro passaria a apontar para lá. A marca por que se
 * procura é a própria pasta do mapa, que é o que este leitor precisa de achar.
 */
function encontraRaiz() {
  const subir = (inicio) => {
    let dir = inicio;
    for (let i = 0; i < 8; i++) {
      if (fs.existsSync(path.join(dir, 'mapa', 'manifest.json'))) return dir;
      const acima = path.dirname(dir);
      if (acima === dir) break;
      dir = acima;
    }
    return null;
  };
  return (
    subir(process.cwd()) ?? subir(path.dirname(fileURLToPath(import.meta.url))) ?? process.cwd()
  );
}

export const RAIZ_DO_MAPA = path.join(encontraRaiz(), 'mapa');

/** Um leitor com uma mensagem que nomeia o ficheiro em falta, e não `ENOENT`. */
function le(rel) {
  const ficheiro = path.join(RAIZ_DO_MAPA, rel);
  if (!fs.existsSync(ficheiro)) {
    throw new Error(
      `mapa: falta ${path.join('mapa', rel)}. ` +
        `Os artefactos vêm do motor (python3 publisher/mapa_distritos.py --write).`,
    );
  }
  return JSON.parse(fs.readFileSync(ficheiro, 'utf8'));
}

let _manifesto = null;
let _pais = null;
const _distritos = new Map();

/** O manifesto: a origem, a licença, a tolerância e a prova de junção. */
export function manifestoDoMapa() {
  if (!_manifesto) _manifesto = le('manifest.json');
  return _manifesto;
}

/** O país: o campo, as duas molduras e as 29 unidades. */
export function paisDoMapa() {
  if (!_pais) _pais = le('pais.json');
  return _pais;
}

/** As 29 unidades, na ordem em que o motor as escreveu (a de `DISTRITOS`). */
export function unidadesDoMapa() {
  return paisDoMapa().unidades;
}

/** Um distrito: a sua unidade, o seu campo local e os seus concelhos. */
export function distritoDoMapa(slug) {
  if (!_distritos.has(slug)) _distritos.set(slug, le(path.join('distritos', `${slug}.json`)));
  return _distritos.get(slug);
}

/** Os slugs das 29, para os `getStaticPaths` das duas edições. */
export function slugsDasUnidades() {
  return unidadesDoMapa().map((u) => u.slug);
}

/** A unidade de um slug, ou `null`. */
export function unidadeDoMapa(slug) {
  return unidadesDoMapa().find((u) => u.slug === slug) ?? null;
}

/**
 * A ATRIBUIÇÃO DA FONTE, LIDA DO MANIFESTO E NUNCA TRANSCRITA.
 *
 * A licença da CAOP 2025 é CC BY 4.0 e a sua única obrigação é a menção de quem
 * é a entidade proprietária da informação. O nome está no manifesto, que o leu
 * das constantes do motor, que as transcreveu da página da DGT: escrevê-lo aqui
 * outra vez seria uma quarta cópia da mesma frase, e a que ficaria por
 * conferir. `check:mapa` exige esta menção onde o mapa está.
 */
export function atribuicaoDoMapa() {
  const m = manifestoDoMapa();
  return {
    entidade: m.fonte.atribuicao,
    licenca: m.fonte.licenca,
    carta: m.fonte.carta,
  };
}

/* ===========================================================================
 * OS ALVOS, E A LISTA QUE A EMENDA 20c MANDA POR BAIXO DA MOLDURA
 * ===========================================================================
 *
 * «O mapa rende-se também no telemóvel: neste, cada distrito é alvo, e onde uma
 * ilha não chegar aos 44 px na moldura, os nomes das ilhas dessa moldura ficam
 * por baixo dela como ligações, uma por linha.»
 *
 * A DECISÃO É DA CONSTRUÇÃO E NÃO DA FOLHA, e tem de o ser: uma construção
 * estática serve o mesmo HTML às duas larguras, e nenhuma largura é conhecida
 * quando ele se escreve. O que se pode saber na construção é a geometria (a
 * caixa de cada unidade, no campo do artefacto) e as larguras que a folha dá ao
 * mapa. Com as duas, o alvo de cada unidade em píxeis é uma regra de três, e a
 * pergunta «chega aos 44?» tem resposta antes de a página existir.
 *
 * A CONDIÇÃO É POR PARCELA E A LISTA É DAS UNIDADES DELA (I81, 27.08.2026).
 * Era por moldura, que é a forma em que a emenda a escreve, e o continente não
 * tem moldura: basta uma unidade da parcela não chegar para que os nomes daquela
 * parcela fiquem por baixo do mapa. Não é o contrário (listar só as que não
 * chegam), porque uma lista com sete nomes de nove é uma lista que deixa o
 * leitor a adivinhar quais são os dois que faltam.
 */

/**
 * AS LARGURAS QUE A FOLHA DÁ AO MAPA DA PRIMEIRA PÁGINA.
 *
 * Declaradas aqui porque a construção precisa delas e a folha não se lê de
 * JavaScript na construção. Cada uma está escrita em `src/styles/inicio.css`, e
 * a régua `tests/inicio/mapa-distritos.mjs` mede-as no navegador contra estes
 * números: se a folha mudar e este ficheiro não, a régua sai a vermelho.
 *
 * ---------------------------------------------------------------------------
 * ERAM DUAS E SÃO QUATRO, E AS DUAS QUE FALTAVAM NÃO ERAM UM DETALHE (I81)
 * ---------------------------------------------------------------------------
 * Até 27.08.2026 este objecto dizia `{ larga: 490, estreita: 354 }`, e as duas
 * eram medidas de uma janela só cada: 490 é a coluna a 1280 e 354 era a coluna a
 * 390. A folha dá ao mapa quatro larguras e não duas, e as duas que faltavam são
 * as mais estreitas de todas — que é precisamente onde a pergunta dos 44 px se
 * decide. Medidas no navegador a 27.08, sobre a construção deste ramo:
 *
 *   `estreita` 320 · abaixo de 640 o mapa toma a LARGURA DA JANELA (Emenda 20c
 *             lida com a I81), e a janela mais estreita que a casa serve é a do
 *             iPhone SE, 320 px. Era 354, que é a coluna a 390: uma janela de
 *             320 dava 284, e o número declarado dizia o contrário.
 *   `media`   281 · entre 640 e 1024 a folha fixa `.mapa-tela { width: 281px }`,
 *             que é a largura que o mapa tinha quando a ficha lhe ficava ao
 *             lado. Nenhuma linha deste ficheiro a conhecia.
 *   `larga_minima` 340 · a coluna do instrumento a 1024, medida, que é onde a
 *             regra `width: 100%` começa e onde ela dá o seu valor mais baixo.
 *   `larga`   490 · a mesma coluna a 1280. Medida e não escrita à mão.
 *
 * A MAIS PEQUENA É A QUE MANDA na pergunta dos 44 px: uma unidade que não chega
 * na largura mais estreita precisa da lista, mesmo que chegue nas outras, porque
 * a página é a mesma em todas.
 */
export const LARGURAS_DO_MAPA = { larga: 490, larga_minima: 340, media: 281, estreita: 320 };

/** O maior lado da caixa de uma unidade, em píxeis, a uma largura de mapa. */
export function ladoEmPixeis(unidade, larguraDoMapa, campo) {
  const escala = larguraDoMapa / campo.largura;
  return Math.max(unidade.caixa[2], unidade.caixa[3]) * escala;
}

/** O alvo da casa. Não é uma escolha deste ficheiro: é a regra de 44 px. */
export const ALVO_PX = 44;

/** A caixa que contém todas as caixas de uma lista, no mesmo espaço delas. */
function caixaDe(unidades) {
  const x0 = Math.min(...unidades.map((u) => u.caixa[0]));
  const y0 = Math.min(...unidades.map((u) => u.caixa[1]));
  const x1 = Math.max(...unidades.map((u) => u.caixa[0] + u.caixa[2]));
  const y1 = Math.max(...unidades.map((u) => u.caixa[1] + u.caixa[3]));
  return [x0, y0, x1 - x0, y1 - y0];
}

/**
 * As unidades de uma moldura: as da PARCELA que aquela moldura enquadra.
 *
 * ---------------------------------------------------------------------------
 * PORQUE NÃO É «AS UNIDADES QUE A CAIXA DA MOLDURA CONTÉM»
 * ---------------------------------------------------------------------------
 * Foi a primeira forma desta função, e estava errada. Medido no artefacto: a
 * moldura da Madeira é `[1527, 4526, 1358, 3496]`, alta porque as Selvagens
 * estão lá dentro, e a sua caixa desce até y 8022; as ilhas dos Açores vivem
 * entre y 6096 e 7392, e três delas (Terceira, Santa Maria, São Miguel) caem por
 * acaso dentro daquele rectângulo. A lista da moldura da Madeira saía com cinco
 * nomes e três eram dos Açores.
 *
 * A PERTENÇA É A PARCELA, que o artefacto declara em cada unidade, e a
 * correspondência entre uma moldura e uma parcela é DERIVADA e não escrita: a
 * moldura de uma parcela é, por construção do motor (MAPA.md §2), a caixa dos
 * polígonos dessa parcela, e por isso a caixa da parcela cabe dentro dela.
 * Medido: a caixa dos Açores cabe na moldura dos Açores e não cabe na da
 * Madeira (começa em x 260, e a da Madeira começa em 1527); a da Madeira cabe na
 * dela e não na dos Açores (começa em y 4527, e a dos Açores em 6096). A
 * correspondência é única, e a função morre se deixar de o ser.
 */
export function parcelaDaMoldura(moldura, unidades) {
  const [mx, my, mw, mh] = moldura.caixa;
  const cabe = ([x, y, w, h]) => x >= mx && y >= my && x + w <= mx + mw && y + h <= my + mh;

  const parcelas = [...new Set(unidades.map((u) => u.parcela))];
  const candidatas = parcelas.filter((nome) =>
    cabe(caixaDe(unidades.filter((u) => u.parcela === nome))),
  );
  if (candidatas.length !== 1) {
    throw new Error(
      `mapa: a moldura "${moldura.nome}" enquadra ${candidatas.length} parcelas ` +
        `(${candidatas.join(', ') || 'nenhuma'}), e uma moldura é de uma parcela só.`,
    );
  }
  return candidatas[0];
}

/** As unidades da parcela que uma moldura enquadra. */
export function unidadesDaMoldura(moldura, unidades) {
  const parcela = parcelaDaMoldura(moldura, unidades);
  return unidades.filter((u) => u.parcela === parcela);
}

/**
 * AS PARCELAS DO PAÍS, cada uma com as suas unidades e com a resposta à pergunta
 * dos 44 px.
 *
 * ---------------------------------------------------------------------------
 * A LISTA ERA DA MOLDURA E PASSA A SER DA PARCELA (I81, 27.08.2026)
 * ---------------------------------------------------------------------------
 * A Emenda 20c escreve a rede por baixo do mapa na forma em que ela primeiro fez
 * falta: «onde uma ilha não chegar aos 44 px na moldura, os nomes das ilhas
 * dessa moldura ficam por baixo dela como ligações, uma por linha». O continente
 * não tem moldura, e por isso não tinha rede nenhuma — e a I81 mediu o que isso
 * custa: Viana do Castelo chega aos 44 px por 0,5 px numa janela de 390, e
 * abaixo de 386 deixa de ser alvo. Uma regra que só protege as ilhas protege o
 * caso que foi visto primeiro, e não o caso.
 *
 * A REGRA PASSA A SER A DA PARCELA, e a forma é a mesma: a parcela em que uma
 * unidade não chega aos 44 px na largura mais estreita da folha leva os nomes
 * das suas unidades por baixo do mapa, como ligações, uma por linha. As três
 * parcelas da Carta são o continente, a Madeira e os Açores; as duas últimas têm
 * moldura e a primeira não, e o que decide a lista é a parcela e nunca a
 * moldura.
 *
 * A LISTA É DE TODAS AS UNIDADES DA PARCELA, e não só das que não chegam, pela
 * razão que já estava escrita para as ilhas: uma lista com dezasseis nomes de
 * dezoito deixa o leitor a adivinhar quais são os dois que faltam.
 *
 * O CONTINENTE VEM PRIMEIRO, que é a ordem do desenho e a ordem da Carta.
 */
export function parcelasDoMapa() {
  const pais = paisDoMapa();
  const larguras = Object.values(LARGURAS_DO_MAPA);
  const molduraDe = new Map(
    pais.molduras.map((m) => [parcelaDaMoldura(m, pais.unidades), m]),
  );
  const chaves = [...new Set(pais.unidades.map((u) => u.parcela))];
  const semMoldura = chaves.filter((c) => !molduraDe.has(c));
  const ordem = [...semMoldura, ...pais.molduras.map((m) => parcelaDaMoldura(m, pais.unidades))];
  return ordem.map((chave) => {
    const unidades = pais.unidades.filter((u) => u.parcela === chave);
    const menor = Math.min(
      ...unidades.flatMap((u) => larguras.map((l) => ladoEmPixeis(u, l, pais.campo))),
    );
    const moldura = molduraDe.get(chave) ?? null;
    return {
      chave,
      moldura,
      nome: moldura?.nome ?? null,
      unidades,
      menorAlvoPx: menor,
      precisaDaLista: menor < ALVO_PX,
    };
  });
}
