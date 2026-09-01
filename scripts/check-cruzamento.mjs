#!/usr/bin/env node
/**
 * Conferência de aceitação das linhas cruzadas.
 *
 * O motor de investigação (ResearchHub) produz; este sítio publica. O que
 * atravessa a fronteira são linhas de livro-razão, não páginas construídas — e
 * cada linha que atravessa deixa uma entrada em `ledger/cruzamentos/*.json` com
 * dois resumos criptográficos: o da linha de origem, do lado do motor, e o dos
 * bytes que foram escritos aqui.
 *
 * Este script confere, para cada entrada:
 *
 *   1. o ficheiro da linha existe em ledger/claims/;
 *   2. o resumo dos seus bytes é ainda o que o registo declara — quem editou
 *      uma linha cruzada à mão pára o build;
 *   3. o `study` da linha é um trabalho que consta de src/data/studies.mjs.
 *
 * **Corre sem rede e sem o motor presente**, de propósito: o build acontece num
 * construtor remoto onde o ResearchHub não existe. Uma conferência que só
 * funcionasse na máquina de quem exporta não seria uma conferência de aceitação
 * — seria o produtor a assinar por si próprio.
 *
 * A comparação com o lado da ORIGEM — o resumo da linha do motor contra o
 * livro-razão vivo do motor — é o modo `--with-origin`, que só corre onde o
 * motor está em disco. Não entra no `npm run build`.
 *
 *   node scripts/check-cruzamento.mjs                        conferência local
 *   node scripts/check-cruzamento.mjs --with-origin          + contra o motor
 *   node scripts/check-cruzamento.mjs --accept-correction <id>
 *
 * ### A regra das correcções
 *
 * O resumo prende os bytes exportados, e é isso que o torna útil: uma linha
 * cruzada não se corrige editando-a. Há dois caminhos legítimos, e nenhum é
 * silencioso:
 *
 *   · **Voltar a cruzar** — o valor mudou no motor. Corrige-se lá, corre-se o
 *     exportador, o registo actualiza-se sozinho.
 *   · **Corrigir do lado do sítio** — é este sítio que admite um erro. Escreve-se
 *     a entrada em `corrections[]` da linha, com data, natureza, valor antigo,
 *     valor novo e motivo nas duas línguas, e corre-se
 *     `--accept-correction <id>`. A porta é estreita: exige que a lista de
 *     correcções tenha CRESCIDO desde a exportação e que o `value` publicado
 *     seja o `new_value` da correcção mais recente. Com isso o registo passa a
 *     guardar o resumo novo e a história do que foi aceite. Sem isso, recusa —
 *     de outro modo seria uma maneira de branquear qualquer edição.
 *
 * Uma correcção continua, portanto, possível — e continua a deixar rasto.
 *
 * ### Os dois tipos de registo
 *
 * Há duas coisas que atravessam a fronteira, e cada uma tem o seu registo em
 * `ledger/cruzamentos/`:
 *
 *   · **linhas** — um registo com um mapa `rows`, uma entrada por linha do
 *     livro-razão (`evora.json`). É o de cima.
 *   · **ficheiros** — um registo com um mapa `files`, uma entrada por ficheiro
 *     inteiro (`agenda.json`, escrito por ResearchHub/publisher/export_agenda.py).
 *     A agenda e o calendário das fontes atravessam como ficheiros e não como
 *     linhas: não são valores com proveniência por campo, são dois registos que
 *     a página renderiza inteiros.
 *
 * O tipo lê-se da forma do registo, não do nome do ficheiro. A conferência é a
 * mesma nas duas: o resumo dos bytes em disco contra o resumo que o registo
 * declara, e com `--with-origin` o resumo do lado do motor.
 *
 * ### As invariantes, reconferidas deste lado
 *
 * O exportador do motor confere trinta e uma invariantes antes de escrever.
 * Este portão volta a conferir as que a página precisa para renderizar: o
 * estado é o `para` da última entrada do histórico, todo o item tem histórico,
 * quem sai traz motivo, o que renderiza tem `pt` e `en`, as linhas citadas
 * existem no livro-razão deste sítio, os acontecimentos citados existem no
 * calendário. E, desde 16.08.2026 (§1.42), confere que o próprio registo da
 * travessia traz a sua linha de base: sem `historia` e sem `eventos` não há
 * passado contra que a travessia seguinte se meça, e apagar um campo apagava a
 * promessa. Não é desconfiança do motor: é a regra da casa. Uma conferência de
 * aceitação que confiasse no produtor seria o produtor a assinar por si
 * próprio, que é o que o comentário acima diz do modo offline.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import { load } from 'js-yaml';

import { STUDY_IDS } from '../src/data/studies.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR_CRUZAMENTOS = path.join(RAIZ, 'ledger', 'cruzamentos');
const DIR_CLAIMS = path.join(RAIZ, 'ledger', 'claims');
/** Onde aterram os ficheiros que atravessam inteiros. */
const DIR_DADOS = path.join(RAIZ, 'src', 'data');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const amarelo = (s) => `\x1b[33m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

const CAMPOS_ENTRADA = [
  'rh_study',
  'rh_id',
  'rh_ledger_sha256',
  'origin_row_sha256',
  'exported_row_sha256',
  'corrections_at_export',
  /* Quantas reconferências a linha trazia quando atravessou. Entrou com o
     `verifications[]` (DECISIONS §1.47), e existe pela mesma razão que a
     contagem de correções ao lado: a conferência de aceitação compara o
     ficheiro em disco com o registo, e uma contagem que não está escrita é uma
     contagem com que ninguém pode discordar. */
  'verifications_at_export',
  /* O resumo do recorte que atravessou com a linha, quando há recorte. Mesma
     razão que as duas contagens acima: a conferência de aceitação compara o que
     está em disco com o registo, e uma imagem cujo resumo ninguém escreveu é
     uma imagem com que ninguém pode discordar (DECISIONS §1.47, T2). */
  'crop_sha256',
  'exported_at',
  'exporter',
  'site_corrections',
];

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

/* ------------------------------------------------ a reconferência acrescentada
 *
 * O PROBLEMA, MEDIDO A 01.09.2026. O corredor diário escreve `verificado_em` em
 * todas as linhas que conferiu, e 2 525 das 2 577 linhas com endereço são linhas
 * CRUZADAS. A conferência de aceitação compara os bytes do ficheiro com os que
 * atravessaram, e uma entrada acrescentada muda os bytes: a primeira corrida do
 * corredor fechou a construção com 2 525 «os bytes em disco já não são os que
 * atravessaram».
 *
 * O QUE ESTA CONFERÊNCIA QUER DIZER, escrito na sua própria mensagem de erro:
 * «uma linha cruzada não se edita à mão». O bloco `verifications[]` é, por regra
 * do formato (`ledger/README.md`), o único que NUNCA se escreve à mão: nasce de
 * uma releitura que aconteceu e é escrito por um dos três programas que a fazem.
 * Deixar de o ver seria enfraquecer a régua; o que se faz é o contrário, e é
 * mais apertado do que uma exceção:
 *
 *   1. Se os bytes batem, acabou, e é o caminho de sempre.
 *   2. Se não batem, RECONSTROI-SE o ficheiro tal como estava na travessia,
 *      tirando as entradas que vieram DEPOIS dela (o registo diz quantas havia,
 *      em `verifications_at_export`), e os bytes reconstruídos têm de dar
 *      exactamente o resumo registado. Tudo o que não seja o acrescento continua
 *      a fechar a construção, byte a byte.
 *   3. E cada entrada acrescentada tem de declarar um autor da lista fechada.
 *
 * O QUE O PONTO 3 PROVA, E O QUE NÃO PROVA (leitura a frio de 01.09, M18). Ele
 * prova que o `by` da entrada é **um rótulo permitido**. NÃO prova que um
 * programa a escreveu: `by` é uma cadeia que a própria entrada declara, e quem
 * editar a linha à mão escrevendo `by: "corredor-diario"` passa por aqui. A
 * primeira redacção desta régua dizia «só um programa pode acrescentar», e isso
 * era uma afirmação que nada aqui sustenta.
 *
 * O que de facto sustenta a promessa está noutro sítio e é de outra natureza: o
 * bloco `verifications[]` não se escreve à mão porque o formato o proíbe
 * (`ledger/README.md`), e a prova de que uma conferência aconteceu é a linha do
 * índice do arquivo — com o endereço, a hora UTC, o estado HTTP e o resumo do
 * ficheiro lido — que uma edição à mão do YAML não consegue fabricar. Esta
 * régua é a segunda tranca, não a primeira, e diz agora o que tranca.
 *
 * Provado nesta corrida contra os registos de travessia, e com cinco plantas em
 * `provaDaReconferencia()`.
 */

/** Os rótulos de autor que os programas escrevem. A cópia local da lista de
 *  `src/lib/ledger.mjs`: se esta régua lesse a de lá, confirmava-a em vez de a
 *  conferir. É uma lista de RÓTULOS PERMITIDOS, não uma prova de autoria: ver o
 *  bloco acima. */
const AUTORES_DE_MAQUINA = new Set([
  'painel-semanal',
  'revisao-cruzada',
  'leitura-independente',
  'corredor-diario',
]);

/**
 * O ficheiro tal como estava quando atravessou, se a única diferença for um
 * acrescento ao fim do bloco `verifications:`. `null` quando não se consegue.
 *
 * `n` é quantas entradas havia na travessia. Com `n === 0` sai o bloco inteiro,
 * com o comentário que o precede e a linha em branco que os separa, porque é
 * assim que o escritor o cria numa linha que ainda não tinha nenhum.
 */
function semAsReconferenciasNovas(texto, n) {
  const linhas = texto.split('\n');
  const i = linhas.findIndex((l) => l.trimEnd() === 'verifications:');
  if (i < 0) return null;
  let fim = linhas.length;
  for (let j = i + 1; j < linhas.length; j++) {
    if (linhas[j].trim() && !/^[ \t-]/.test(linhas[j])) {
      fim = j;
      break;
    }
  }
  while (fim > i + 1 && !linhas[fim - 1].trim()) fim--;
  const bloco = linhas.slice(i + 1, fim);
  const inicios = [];
  bloco.forEach((l, k) => {
    if (/^ {2}- /.test(l)) inicios.push(k);
  });
  /* A PODA DAS QUATRO (§1.92(2)) E O QUE ELA FAZ A ESTA RECONSTRUÇÃO. A linha
     guarda as últimas quatro conferências, pelo que um dia as mais velhas saem.
     Para uma linha que atravessou SEM bloco (`n === 0`, que são 2 829 das 2 850
     de hoje), isto não muda nada: tira-se o bloco inteiro e os bytes voltam a
     ser os que atravessaram, hoje e daqui a um ano. Para uma linha que
     atravessou COM entradas (21 de hoje), o dia em que a poda lhe comer a
     primeira, esta reconstrução deixa de bater e a régua fecha com a mensagem
     de sempre — que é o correcto: a partir daí a linha tem de voltar a
     atravessar pelo exportador, que é como uma linha cruzada muda. */
  if (inicios.length < n) return null;
  if (n === 0) {
    let inicio = i;
    while (inicio > 0 && linhas[inicio - 1].startsWith('#')) inicio--;
    while (inicio > 0 && linhas[inicio - 1].trim() === '') inicio--;
    const resto = [...linhas.slice(0, inicio), ...linhas.slice(fim)];
    while (resto.length && resto[resto.length - 1] === '') resto.pop();
    return resto.join('\n') + '\n';
  }
  return [...linhas.slice(0, i + 1), ...bloco.slice(0, inicios[n]), ...linhas.slice(fim)].join('\n');
}

/**
 * A diferença entre o disco e a travessia é SÓ um acrescento de máquina?
 * Devolve `{ ok, novas, motivo }`.
 */
function soAcrescentouReconferencia(texto, entrada, linha) {
  const n = Number(entrada.verifications_at_export ?? 0);
  const reconstruido = semAsReconferenciasNovas(texto, n);
  if (reconstruido === null) {
    return { ok: false, novas: 0, motivo: 'não há bloco de reconferências que explique a diferença' };
  }
  if (sha256(Buffer.from(reconstruido, 'utf8')) !== entrada.exported_row_sha256) {
    return { ok: false, novas: 0, motivo: 'mudou alguma coisa fora das reconferências' };
  }
  const todas = Array.isArray(linha?.verifications) ? linha.verifications : [];
  const novas = todas.slice(n);
  const mao = novas.filter((v) => !AUTORES_DE_MAQUINA.has(String(v?.by)));
  if (mao.length) {
    return {
      ok: false,
      novas: novas.length,
      motivo: `${mao.length} reconferência(s) com um "by" fora da lista dos programas ` +
        `(${[...new Set(mao.map((v) => String(v?.by)))].join(', ')}). Isto confere o ` +
        `rótulo, não a autoria: quem a escreveu prova-se na linha do índice do arquivo`,
    };
  }
  return { ok: true, novas: novas.length, motivo: '' };
}

/**
 * A PLANTA, ANTES DE A RÉGUA CONTAR. Quatro casos, e o verde tem de ser verde:
 * um acrescento de máquina passa; um valor mexido no meio do ficheiro fecha; uma
 * reconferência com autor à mão fecha; e um bloco tirado fecha.
 */
function provaDaReconferencia(erros) {
  const base =
    'id: "f"\nvalue: "10,0"\nunit: "%"\nsource: "F"\n' +
    'source_url: "https://exemplo.invalido/a"\naccess_date: "2026-01-01"\n' +
    'reference_date: "2025"\nexcerpt: "F"\nstudy: "q"\ncorrections: []\n';
  const entrada = (por) =>
    `  - date: "2026-09-01"\n    path: "https://exemplo.invalido/a"\n` +
    `    result: "igual"\n    by: "${por}"\n`;
  const comBloco = (por) =>
    base + '\n# Reconferências. Escritas pelo motor, nunca à mão.\nverifications:\n' + entrada(por) + '\n';
  const reg = { exported_row_sha256: sha256(Buffer.from(base, 'utf8')), verifications_at_export: 0 };
  const casos = [
    {
      nome: 'uma reconferência de máquina acrescentada',
      texto: comBloco('corredor-diario'),
      linha: { verifications: [{ by: 'corredor-diario' }] },
      espera: true,
    },
    {
      nome: 'uma reconferência com autor escrito à mão',
      texto: comBloco('o-nuno'),
      linha: { verifications: [{ by: 'o-nuno' }] },
      espera: false,
    },
    {
      nome: 'o valor mexido, com a reconferência por cima',
      texto: comBloco('corredor-diario').replace('"10,0"', '"11,0"'),
      linha: { verifications: [{ by: 'corredor-diario' }] },
      espera: false,
    },
    {
      nome: 'o ficheiro sem bloco nenhum e com o valor mexido',
      texto: base.replace('"10,0"', '"11,0"'),
      linha: {},
      espera: false,
    },
    {
      /* A PODA DAS QUATRO, numa linha que atravessou sem bloco: continua verde,
         porque a reconstrução tira o bloco INTEIRO. É o caso de 2 829 das 2 850
         linhas cruzadas, e é o que garante que a regra §1.92(2) não fecha a
         construção daqui a quatro dias. */
      nome: 'quatro conferências numa linha que atravessou sem bloco',
      texto:
        base +
        '\n# Reconferências. Escritas pelo motor, nunca à mão.\nverifications:\n' +
        entrada('corredor-diario').repeat(4) +
        '\n',
      linha: { verifications: Array(4).fill({ by: 'corredor-diario' }) },
      espera: true,
    },
  ];
  let vistas = 0;
  for (const c of casos) {
    const r = soAcrescentouReconferencia(c.texto, reg, c.linha);
    if (r.ok !== c.espera) {
      erros.push(
        `a prova da régua das reconferências falhou no caso "${c.nome}": ` +
          `esperava-se ${c.espera ? 'verde' : 'vermelho'} e deu ${r.ok ? 'verde' : 'vermelho'}` +
          `${r.motivo ? ` (${r.motivo})` : ''}. A conferência abaixo deixou de valer.`,
      );
    } else {
      vistas++;
    }
  }
  return vistas;
}

function registos() {
  let ficheiros = [];
  try {
    ficheiros = fs.readdirSync(DIR_CRUZAMENTOS).filter((f) => f.endsWith('.json'));
  } catch {
    return [];
  }
  ficheiros.sort();
  return ficheiros.map((f) => {
    const full = path.join(DIR_CRUZAMENTOS, f);
    return { ficheiro: f, caminho: full, dados: JSON.parse(fs.readFileSync(full, 'utf8')) };
  });
}

/* ------------------------------------------------------- aceitar correcção */

function aceitarCorreccao(id) {
  const erros = [];
  for (const reg of registos()) {
    const entrada = reg.dados.rows?.[id];
    if (!entrada) continue;
    const caminho = path.join(DIR_CLAIMS, `${id}.yml`);
    if (!fs.existsSync(caminho)) {
      erros.push(`${id}: não há ficheiro em ledger/claims/.`);
      break;
    }
    const bytes = fs.readFileSync(caminho);
    const linha = load(bytes.toString('utf8'));
    const antes = Number(entrada.corrections_at_export ?? 0);
    const agora = Array.isArray(linha.corrections) ? linha.corrections.length : 0;
    if (agora <= antes) {
      erros.push(
        `${id}: a lista de correcções não cresceu (${antes} → ${agora}). ` +
          `--accept-correction aceita uma linha que ADMITE um erro, não uma edição qualquer.`,
      );
      break;
    }
    const ultima = linha.corrections[agora - 1];
    /* Numa revisão de proveniência o valor NÃO muda — `old_value` e `new_value`
       são os do campo que mudou, não os do número. Exigir que o valor publicado
       fosse igual ao `new_value` seria exigir que a linha passasse a publicar
       um endereço. A exigência vale para as duas naturezas em que o número se
       move. Ver ledger/README.md, «as três naturezas». */
    if (ultima?.kind !== 'proveniencia' && String(linha.value) !== String(ultima?.new_value)) {
      erros.push(
        `${id}: o valor publicado é "${linha.value}" e a correcção mais recente diz ` +
          `new_value "${ultima?.new_value}". A correcção tem de descrever a alteração que foi feita.`,
      );
      break;
    }
    const novo = sha256(bytes);
    const historia = Array.isArray(entrada.site_corrections) ? entrada.site_corrections : [];
    historia.push({
      date: String(ultima.date),
      kind: String(ultima.kind),
      sha256_antes: entrada.exported_row_sha256,
      sha256_depois: novo,
    });
    entrada.site_corrections = historia;
    entrada.exported_row_sha256 = novo;
    entrada.corrections_at_export = agora;
    fs.writeFileSync(
      reg.caminho,
      JSON.stringify(reg.dados, null, 2).replace(/\n?$/, '\n'),
      'utf8',
    );
    console.log('');
    console.log(
      `  ${verde('✓')} correcção aceite em "${id}" (${antes} → ${agora}) — ` +
        `${reg.ficheiro} atualizado.`,
    );
    console.log(cinza('    O registo guarda o resumo antigo e o novo. Nada foi apagado.'));
    console.log('');
    return 0;
  }
  console.error('');
  console.error(vermelho('  CORRECÇÃO NÃO ACEITE'));
  console.error('');
  for (const e of erros) console.error('    ' + vermelho('✗') + ' ' + e);
  if (!erros.length) {
    console.error(
      '    ' + vermelho('✗') + ` "${id}" não consta de nenhum registo de cruzamento. ` +
        `Uma linha que não atravessou corrige-se como qualquer outra.`,
    );
  }
  console.error('');
  return 1;
}

/* ----------------------------------------- os ficheiros que atravessam inteiros */

const CAMPOS_FICHEIRO = ['origin_path', 'origin_sha256', 'exported_sha256', 'exporter'];

/** Os quatro estados da agenda. Um quinto não tem secção onde renderizar. */
const ESTADOS = ['em_curso', 'a_seguir', 'concluido', 'retirado'];

/**
 * O passado que o registo da travessia tem de carregar.
 *
 * `historia` guarda, por item, quantas entradas de histórico atravessaram e o
 * resumo dessas entradas; `eventos` guarda os ids do calendário; `saidas`
 * guarda os que já saíram dele. É contra estes três que a travessia seguinte
 * recusa um histórico mais curto, uma entrada passada reescrita, um
 * acontecimento que desaparece sem ser declarado e uma saída que é apagada
 * depois de declarada (H4, H5).
 *
 * SEM ELES O EXPORTADOR NÃO TEM PASSADO CONTRA QUE COMPARAR. Apagar `historia`
 * do ficheiro fazia a travessia seguinte ler-se como a primeira, e a promessa
 * de append-only passava a valer sobre nada (revisão cruzada 2, #1). Aqui,
 * deste lado da fronteira, um registo sem eles pára o build offline: o registo
 * da travessia não é um resumo de conveniência, é a linha de base.
 */
const CAMPOS_DO_PASSADO = ['historia', 'eventos', 'saidas'];

function confereRegistoDaTravessia(regs, erros) {
  for (const { ficheiro, dados } of regs) {
    /* O registo da agenda é o que prende `agenda.json`; os outros registos de
       ficheiros não têm histórico de itens para guardar. */
    if (!dados?.files?.['agenda.json']) continue;
    const faltam = CAMPOS_DO_PASSADO.filter((c) => !(c in (dados ?? {})));
    if (faltam.length) {
      erros.push(
        `[${ficheiro}] o registo da travessia perdeu a sua história: falta ` +
          `${faltam.map((c) => `"${c}"`).join(', ')}.\n` +
          `        É contra estes campos que a travessia seguinte recusa um histórico mais ` +
          `curto, uma entrada passada reescrita ou uma saída apagada. Um registo sem eles ` +
          `faz a travessia seguinte parecer a primeira.\n` +
          `        Reponha o ficheiro (git) ou volte a cruzar: ` +
          `python3 publisher/export_agenda.py --destino <sítio>/src/data/`,
      );
    }
  }
}

/**
 * Um registo de ficheiros: os bytes em disco contra o resumo que o registo
 * declara. A mesma conferência das linhas, um nível acima.
 */
function confereFicheiros(regs, erros) {
  let total = 0;
  for (const { ficheiro, dados } of regs) {
    for (const [nome, entrada] of Object.entries(dados.files)) {
      total++;
      const onde = `[${ficheiro}] ${nome}`;
      for (const k of Object.keys(entrada)) {
        if (!CAMPOS_FICHEIRO.includes(k)) erros.push(`${onde}: campo desconhecido "${k}".`);
      }
      for (const k of ['origin_path', 'origin_sha256', 'exported_sha256']) {
        if (!entrada[k]) erros.push(`${onde}: falta "${k}".`);
      }
      const caminho = path.join(DIR_DADOS, nome);
      if (!fs.existsSync(caminho)) {
        erros.push(
          `${onde}: o registo diz que este ficheiro atravessou, e não há ` +
            `src/data/${nome}. Ou o ficheiro voltou a ser exportado, ou foi apagado ` +
            `sem sair do registo.`,
        );
        continue;
      }
      const actual = sha256(fs.readFileSync(caminho));
      if (actual !== entrada.exported_sha256) {
        erros.push(
          `${onde}: os bytes em disco já não são os que atravessaram.\n` +
            `        registo: ${entrada.exported_sha256}\n` +
            `        disco:   ${actual}\n` +
            `        Um ficheiro cruzado não se edita à mão. Corrige-se no motor e ` +
            `volta a atravessar:\n` +
            `        python3 publisher/export_agenda.py --destino <sítio>/src/data/`,
        );
      }
    }
  }
  return total;
}

/**
 * O lado da origem, para ficheiros: o resumo do ficheiro do motor em disco.
 * Fora do build pela mesma razão que o das linhas.
 */
function confereFicheirosNaOrigem(regs, raizMotor, erros) {
  let lidos = 0;
  for (const { ficheiro, dados } of regs) {
    for (const [nome, entrada] of Object.entries(dados.files)) {
      const caminho = path.join(raizMotor, entrada.origin_path ?? '');
      if (!fs.existsSync(caminho)) {
        erros.push(
          `--with-origin: [${ficheiro}] ${nome}: o motor não tem ${entrada.origin_path}.`,
        );
        continue;
      }
      lidos++;
      const actual = sha256(fs.readFileSync(caminho));
      if (actual !== entrada.origin_sha256) {
        erros.push(
          `--with-origin: [${ficheiro}] ${nome} ← ${entrada.origin_path} já não é o ficheiro ` +
            `do motor que atravessou.\n` +
            `        registo: ${entrada.origin_sha256}\n` +
            `        motor:   ${actual}\n` +
            `        Volte a cruzar: python3 publisher/export_agenda.py --destino <sítio>/src/data/`,
        );
      }
    }
  }
  return lidos;
}

/* ------------------------------------- as invariantes que a página precisa */

/**
 * As invariantes do registo da agenda, reconferidas deste lado.
 *
 * O exportador do motor confere-as antes de escrever (publisher/README.md, A1
 * a X3). Estas seis são as que a página precisa para renderizar, e por isso
 * são reconferidas aqui: o portão deste sítio não passa a existir do outro
 * lado da fronteira.
 *
 *   1. o `estado` é o `para` da última entrada do histórico, e é um dos quatro
 *   2. todo o item tem histórico
 *   3. quem vai para `retirado` traz motivo na entrada que o retirou
 *   4. tudo o que renderiza tem `pt` e `en`, e nenhum dos dois vazio
 *   5. cada id em `linhas` existe em ledger/claims/
 *   6. cada `evento` existe no calendário
 *   7. o histórico é uma cadeia: `de` continua o `para` anterior, o primeiro
 *      não vem de lado nenhum, e as datas não andam para trás
 *   8. `entrada` é a data da primeira entrada e `ultima_alteracao` a da última
 *   9. um acontecimento com marcador diz porque não tem data, e a página tem
 *      duas frases diferentes para as duas razões
 *  10. o registo da travessia traz `historia` e `eventos`: a linha de base
 *      contra a qual a travessia seguinte prova que só cresceu
 *
 * As três últimas entraram a 16.08.2026 com a revisão cruzada (§1.41). O motor
 * confere-as antes de escrever (H1, H2, H3, C6); estão aqui pela mesma razão
 * que as outras seis: uma conferência de aceitação que confiasse no produtor
 * seria o produtor a assinar por si próprio.
 */
function confereInvariantes(erros) {
  const fAgenda = path.join(DIR_DADOS, 'agenda.json');
  const fCalendario = path.join(DIR_DADOS, 'calendario.json');
  if (!fs.existsSync(fAgenda) || !fs.existsSync(fCalendario)) return 0;

  let agenda;
  let calendario;
  try {
    agenda = JSON.parse(fs.readFileSync(fAgenda, 'utf8'));
    calendario = JSON.parse(fs.readFileSync(fCalendario, 'utf8'));
  } catch (err) {
    erros.push(`agenda: JSON inválido em src/data/: ${err.message}`);
    return 0;
  }

  const itens = Array.isArray(agenda?.itens) ? agenda.itens : [];
  const eventos = Array.isArray(calendario?.eventos) ? calendario.eventos : [];
  const idsDeEvento = new Set(eventos.map((e) => e?.id));
  const idsDeLinha = new Set(
    fs.existsSync(DIR_CLAIMS)
      ? fs.readdirSync(DIR_CLAIMS).filter((f) => f.endsWith('.yml')).map((f) => f.slice(0, -4))
      : [],
  );

  /** Um par de edições: as duas presentes, nenhuma vazia. */
  const bilingue = (no, onde) => {
    if (!no || typeof no !== 'object') return;
    for (const lingua of ['pt', 'en']) {
      const v = no[lingua];
      if (typeof v !== 'string' || v.trim() === '') {
        erros.push(`${onde}: falta a edição "${lingua}", ou está vazia. A página rende as duas.`);
      }
    }
  };

  for (const item of itens) {
    const id = item?.id ?? '(sem id)';
    const onde = `agenda ${id}`;

    const historico = Array.isArray(item?.historico) ? item.historico : [];
    if (!historico.length) {
      erros.push(
        `${onde}: sem histórico. É o histórico que prova que nada saiu em silêncio; ` +
          `um item sem ele não tem o que a página existe para mostrar.`,
      );
    } else {
      const ultima = historico[historico.length - 1];
      if (item?.estado !== ultima?.para) {
        erros.push(
          `${onde}: o estado é "${item?.estado}" e a última entrada do histórico ` +
            `leva-o a "${ultima?.para}". O estado é o fim da história, não um campo à parte.`,
        );
      }
      for (const [n, entrada] of historico.entries()) {
        if (entrada?.para === 'retirado' && !(entrada?.motivo?.pt ?? '').trim()) {
          erros.push(
            `${onde}: a entrada ${n + 1} do histórico retira o item e não traz motivo. ` +
              `Nada sai desta agenda em silêncio.`,
          );
        }
        if (entrada?.motivo) bilingue(entrada.motivo, `${onde}.historico[${n}].motivo`);
      }

      /* A cadeia: cada entrada continua a anterior, e o tempo anda para a
         frente. Sem isto, um histórico com o número certo de entradas podia
         contar uma história que não fecha. */
      if (historico[0]?.de != null) {
        erros.push(
          `${onde}: a primeira entrada do histórico vem de "${historico[0].de}". ` +
            `A primeira entrada é a entrada: não vem de lado nenhum.`,
        );
      }
      for (let n = 1; n < historico.length; n++) {
        if (historico[n]?.de !== historico[n - 1]?.para) {
          erros.push(
            `${onde}: a entrada ${n + 1} do histórico vem de "${historico[n]?.de}" e a anterior ` +
              `deixou o item em "${historico[n - 1]?.para}". Um histórico com um buraco não é ` +
              `um histórico.`,
          );
        }
        if (String(historico[n]?.data ?? '') < String(historico[n - 1]?.data ?? '')) {
          erros.push(
            `${onde}: a entrada ${n + 1} do histórico é de ${historico[n]?.data} e a anterior ` +
              `de ${historico[n - 1]?.data}. O registo é a ordem por que as coisas aconteceram.`,
          );
        }
      }
      if (item?.entrada !== historico[0]?.data) {
        erros.push(
          `${onde}: entrada é "${item?.entrada}" e a primeira entrada do histórico é de ` +
            `"${historico[0]?.data}".`,
        );
      }
      if (item?.ultima_alteracao !== historico[historico.length - 1]?.data) {
        erros.push(
          `${onde}: ultima_alteracao é "${item?.ultima_alteracao}" e a última entrada do ` +
            `histórico é de "${historico[historico.length - 1]?.data}".`,
        );
      }
    }
    if (!ESTADOS.includes(item?.estado)) {
      erros.push(
        `${onde}: estado "${item?.estado}" desconhecido. Os quatro são ${ESTADOS.join(', ')}, ` +
          `e um quinto não tem secção onde renderizar.`,
      );
    }

    bilingue(item?.titulo, `${onde}.titulo`);
    bilingue(item?.porque, `${onde}.porque`);
    if (item?.pergunta) bilingue(item.pergunta, `${onde}.pergunta`);

    for (const [n, criterio] of (item?.criterios ?? []).entries()) {
      if (criterio?.nota) bilingue(criterio.nota, `${onde}.criterios[${n}].nota`);
      for (const linha of criterio?.linhas ?? []) {
        if (!idsDeLinha.has(linha)) {
          erros.push(
            `${onde}: o critério ${n + 1} aponta para a linha "${linha}", que não existe em ` +
              `ledger/claims/. Um critério que aponta para nada não é um critério.`,
          );
        }
      }
      if (criterio?.tipo === 'calendario_das_fontes' && !idsDeEvento.has(criterio?.evento)) {
        erros.push(
          `${onde}: o critério ${n + 1} nomeia o acontecimento "${criterio?.evento}", que não ` +
            `está no calendário das fontes.`,
        );
      }
    }
  }

  const MOTIVOS_SEM_DATA = ['nao_publica', 'nao_lida'];
  for (const evento of eventos) {
    const onde = `calendário ${evento?.id ?? '(sem id)'}`;
    /* Um marcador sem razão escrita fazia a página dizer «a fonte não publica
       data» sobre uma fonte que não chegou a ser lida. */
    if (evento?.marcador && !MOTIVOS_SEM_DATA.includes(evento?.motivo_sem_data)) {
      erros.push(
        `${onde}: leva o marcador e motivo_sem_data "${evento?.motivo_sem_data}". ` +
          `Tem de ser um de ${MOTIVOS_SEM_DATA.join(', ')}: a página tem uma frase para cada.`,
      );
    }
    if (!evento?.marcador && evento?.motivo_sem_data) {
      erros.push(`${onde}: tem data e motivo_sem_data ao mesmo tempo.`);
    }
    bilingue(evento?.titulo, `${onde}.titulo`);
    if (evento?.evidencia_indireta) bilingue(evento.evidencia_indireta, `${onde}.evidencia_indireta`);
    if (evento?.nota) bilingue(evento.nota, `${onde}.nota`);
  }

  return itens.length;
}

/* ------------------------------------------------------------ conferência */

function main(argv) {
  const idx = argv.indexOf('--accept-correction');
  if (idx !== -1) {
    const id = argv[idx + 1];
    if (!id) {
      console.error(vermelho('\n  --accept-correction precisa do id da linha.\n'));
      return 2;
    }
    return aceitarCorreccao(id);
  }
  const comOrigem = argv.includes('--with-origin');

  const erros = [];
  const avisos = [];
  let total = 0;
  let ficheiros = 0;
  const porEstudo = new Map();

  const regs = registos();
  /* O tipo lê-se da forma do registo: `rows` prende linhas, `files` prende
     ficheiros inteiros. Um registo que não seja nem uma coisa nem outra não se
     adivinha. */
  const regsDeLinhas = regs.filter((r) => r.dados?.rows && typeof r.dados.rows === 'object');
  const regsDeFicheiros = regs.filter((r) => r.dados?.files && typeof r.dados.files === 'object');
  if (!regs.length) {
    console.log('');
    console.log(cinza('  cruzamentos · nenhum registo em ledger/cruzamentos/ — nada a conferir'));
    console.log('');
    return 0;
  }

  for (const { ficheiro, dados } of regs) {
    if (!dados?.rows && !dados?.files) {
      erros.push(
        `[${ficheiro}] não traz nem um mapa "rows" (linhas) nem um mapa "files" (ficheiros).`,
      );
    }
  }

  /* A planta, antes de qualquer conferência: uma régua que ninguém viu falhar
     não é uma régua (regra 14 da casa). */
  const plantasDaReconferencia = provaDaReconferencia(erros);
  let acrescentos = 0;
  let linhasComAcrescento = 0;

  for (const { ficheiro, dados } of regsDeLinhas) {
    ficheiros++;
    const linhas = dados.rows;
    for (const [id, entrada] of Object.entries(linhas)) {
      total++;
      const onde = `[${ficheiro}] ${id}`;

      for (const k of Object.keys(entrada)) {
        if (!CAMPOS_ENTRADA.includes(k)) erros.push(`${onde}: campo desconhecido "${k}".`);
      }
      for (const k of ['rh_study', 'rh_id', 'origin_row_sha256', 'exported_row_sha256']) {
        if (!entrada[k]) erros.push(`${onde}: falta "${k}".`);
      }

      const caminho = path.join(DIR_CLAIMS, `${id}.yml`);
      if (!fs.existsSync(caminho)) {
        erros.push(
          `${onde}: o registo diz que esta linha atravessou, e não há ` +
            `ledger/claims/${id}.yml. Ou a linha voltou a ser exportada, ou foi apagada ` +
            `sem sair do registo.`,
        );
        continue;
      }

      const bytes = fs.readFileSync(caminho);
      const actual = sha256(bytes);

      let linha;
      try {
        linha = load(bytes.toString('utf8'));
      } catch (err) {
        erros.push(`${onde}: YAML inválido: ${err.message}`);
        continue;
      }

      if (actual !== entrada.exported_row_sha256) {
        /* A ÚNICA DIFERENÇA ACEITE É UM ACRESCENTO DE MÁQUINA AO BLOCO DAS
           RECONFERÊNCIAS, e ele prova-se reconstruindo o ficheiro tal como
           atravessou. Ver `soAcrescentouReconferencia()` e a sua planta. */
        const r = soAcrescentouReconferencia(bytes.toString('utf8'), entrada, linha);
        if (!r.ok) {
          erros.push(
            `${onde}: os bytes em disco já não são os que atravessaram.\n` +
              `        registo: ${entrada.exported_row_sha256}\n` +
              `        disco:   ${actual}\n` +
              `        ${r.motivo}.\n` +
              `        Uma linha cruzada não se edita à mão. O bloco verifications[] é a ` +
              `única excepção, e só quando é escrito por um programa. Ou se volta a cruzar ` +
              `no motor (ResearchHub/publisher/export_site_rows.py --write), ou — se é este ` +
              `sítio a admitir um erro — escreve-se a correcção em corrections[] e corre-se\n` +
              `        node scripts/check-cruzamento.mjs --accept-correction ${id}`,
          );
          continue;
        }
        acrescentos += r.novas;
        linhasComAcrescento++;
      }
      if (linha?.id !== id) {
        erros.push(`${onde}: o ficheiro traz id "${linha?.id}".`);
      }
      if (!STUDY_IDS.has(linha?.study)) {
        erros.push(
          `${onde}: "study" é "${linha?.study}", que não consta de src/data/studies.mjs.`,
        );
      } else {
        porEstudo.set(linha.study, (porEstudo.get(linha.study) ?? 0) + 1);
      }
      const nCorr = Array.isArray(linha?.corrections) ? linha.corrections.length : 0;
      if (nCorr !== Number(entrada.corrections_at_export ?? 0)) {
        erros.push(
          `${onde}: a linha tem ${nCorr} correcção(ões) e o registo diz ` +
            `${entrada.corrections_at_export}. Corra --accept-correction ${id}.`,
        );
      }
      /* O recorte: os bytes em public/recortes/ contra o resumo do registo. É a
         mesma conferência que a linha faz de si própria pelo `document.crop`,
         feita aqui a partir do registo da travessia: a linha e o registo são
         dois documentos, e uma imagem trocada tem de desmentir os dois. */
      const resumoDoRecorte = linha?.document?.crop?.sha256 ?? null;
      if ((entrada.crop_sha256 ?? null) !== resumoDoRecorte) {
        erros.push(
          `${onde}: o registo diz que o recorte é "${entrada.crop_sha256 ?? '(nenhum)'}" e a ` +
            `linha publica "${resumoDoRecorte ?? '(nenhum)'}". Um recorte de uma linha cruzada ` +
            `entra pelo exportador do motor e por mais lado nenhum: volte a cruzar.`,
        );
      } else if (entrada.crop_sha256) {
        const imagem = path.join(RAIZ, 'public', 'recortes', `${id}.webp`);
        if (!fs.existsSync(imagem)) {
          erros.push(
            `${onde}: o registo diz que o recorte "${entrada.crop_sha256.slice(0, 12)}…" ` +
              `atravessou e não há ficheiro em public/recortes/${id}.webp.`,
          );
        } else if (sha256(fs.readFileSync(imagem)) !== entrada.crop_sha256) {
          erros.push(
            `${onde}: os bytes de public/recortes/${id}.webp já não são os que atravessaram.\n` +
              `        registo: ${entrada.crop_sha256}\n` +
              `        disco:   ${sha256(fs.readFileSync(imagem))}\n` +
              `        Um recorte não se edita à mão: volte a cruzar no motor.`,
          );
        }
      }
      /* A CONTAGEM DAS RECONFERÊNCIAS. Só pode CRESCER, e o que a faz crescer é
         um programa. Até 01.09.2026 exigia igualdade, porque até aí o único que
         escrevia numa linha cruzada era o exportador; o corredor diário passa a
         escrever também, e o que aqui se guarda é a mesma promessa dita com
         precisão: nada se apaga, e nada entra à mão. Que o resto do ficheiro
         não mexeu já foi provado byte a byte acima, reconstruindo-o. */
      const nVer = Array.isArray(linha?.verifications) ? linha.verifications.length : 0;
      const nExport = Number(entrada.verifications_at_export ?? 0);
      if (nVer < nExport) {
        erros.push(
          `${onde}: a linha tem ${nVer} reconferência(s) e o registo diz ${nExport}. ` +
            `A lista encolheu: uma reconferência escrita não se apaga.`,
        );
      } else if (nVer > nExport) {
        const mao = linha.verifications
          .slice(nExport)
          .filter((v) => !AUTORES_DE_MAQUINA.has(String(v?.by)));
        if (mao.length) {
          erros.push(
            `${onde}: a linha ganhou ${nVer - nExport} reconferência(s) desde a travessia, e ` +
              `${mao.length} delas declara um "by" fora da lista dos programas ` +
              `(${[...new Set(mao.map((v) => String(v?.by)))].join(', ')}). Uma reconferência ` +
              `entra por um programa que releu, e por mais lado nenhum. Esta régua confere o ` +
              `rótulo; a prova de que a releitura aconteceu é a linha do índice do arquivo.`,
          );
        }
      }
    }
  }

  /* O lado da origem. Fora do build de propósito: o construtor remoto não tem o
     motor em disco, e uma conferência que dependesse dele passaria a ser uma
     conferência do ambiente e não do conteúdo. */
  let origem = null;
  if (comOrigem) {
    origem = { lidos: 0, divergentes: [], ausentes: [], ficheiroMudou: [] };
    const raizMotor = process.env.RESEARCHHUB_DIR
      ? path.resolve(process.env.RESEARCHHUB_DIR)
      : path.join(path.dirname(RAIZ), 'ResearchHub');
    if (!fs.existsSync(raizMotor)) {
      erros.push(
        `--with-origin: não encontrei o motor em ${raizMotor}. ` +
          `Defina RESEARCHHUB_DIR, ou corra sem --with-origin.`,
      );
    } else {
      const cacheLedger = new Map();
      origem.ficheirosLidos = confereFicheirosNaOrigem(regsDeFicheiros, raizMotor, erros);
      for (const { ficheiro, dados } of regsDeLinhas) {
        for (const [id, entrada] of Object.entries(dados.rows ?? {})) {
          const caminhoLedger = path.join(raizMotor, 'content', entrada.rh_study, 'ledger.json');
          if (!cacheLedger.has(caminhoLedger)) {
            if (!fs.existsSync(caminhoLedger)) {
              cacheLedger.set(caminhoLedger, null);
            } else {
              const bruto = fs.readFileSync(caminhoLedger);
              const doc = JSON.parse(bruto.toString('utf8'));
              const mapa = new Map(doc.claims.map((c) => [c.id, c]));
              cacheLedger.set(caminhoLedger, { mapa, sha: sha256(bruto) });
            }
          }
          const led = cacheLedger.get(caminhoLedger);
          if (!led) {
            origem.ausentes.push(`${id}: ${entrada.rh_study}/ledger.json não existe no motor`);
            continue;
          }
          const linhaMotor = led.mapa.get(entrada.rh_id);
          if (!linhaMotor) {
            origem.ausentes.push(`${id}: o motor já não tem a linha "${entrada.rh_id}"`);
            continue;
          }
          origem.lidos++;
          if (canonicalSha(linhaMotor) !== entrada.origin_row_sha256) {
            origem.divergentes.push(
              `${id} ← ${entrada.rh_study}/${entrada.rh_id} (${ficheiro})`,
            );
          }
          if (led.sha !== entrada.rh_ledger_sha256 &&
              !origem.ficheiroMudou.includes(entrada.rh_study)) {
            origem.ficheiroMudou.push(entrada.rh_study);
          }
        }
      }
      if (origem.divergentes.length) {
        erros.push(
          `--with-origin: ${origem.divergentes.length} linha(s) já não são a linha do motor ` +
            `que atravessou:\n        ${origem.divergentes.join('\n        ')}\n` +
            `        Volte a cruzar: python3 publisher/export_site_rows.py --write`,
        );
      }
      for (const a of origem.ausentes) erros.push(`--with-origin: ${a}`);
      for (const s of origem.ficheiroMudou) {
        avisos.push(
          `o ledger.json de "${s}" já não é o que atravessou. Por si só isto não quer ` +
            `dizer nada: o ficheiro traz um "built_at" que muda a cada reconstrução. ` +
            `O que prende é o resumo de cada LINHA — se nenhuma foi nomeada acima, ` +
            `nenhuma mudou.`,
        );
      }
    }
  }

  const rotulos = confereRotulos(regsDeLinhas, erros);
  const ficheirosCruzados = confereFicheiros(regsDeFicheiros, erros);
  confereRegistoDaTravessia(regsDeFicheiros, erros);
  const itensDaAgenda = confereInvariantes(erros);

  console.log('');
  console.log(
    cinza(
      `  cruzamentos · ${total} linha(s) de origem externa em ${ficheiros} registo(s)` +
        (origem ? ` · ${origem.lidos} conferida(s) contra o motor` : '') +
        ` · ${linhasComAcrescento} com reconferência de programa acrescentada ` +
        `(${acrescentos} entrada(s)) · ${plantasDaReconferencia} planta(s) vista(s)`,
    ),
  );
  console.log(
    cinza(
      `  rótulos da fonte · ${rotulos.comRotulo} de ${rotulos.ficheiros} linha(s) com "name", ` +
        `todas vindas do motor · ${rotulos.plantas} planta(s) vista(s)`,
    ),
  );
  if (regsDeFicheiros.length) {
    console.log(
      cinza(
        `  cruzamentos · ${ficheirosCruzados} ficheiro(s) inteiro(s) em ` +
          `${regsDeFicheiros.length} registo(s)` +
          (origem ? ` · ${origem.ficheirosLidos ?? 0} conferido(s) contra o motor` : '') +
          (itensDaAgenda ? ` · ${itensDaAgenda} item(ns) da agenda reconferidos` : ''),
      ),
    );
  }
  for (const [estudo, n] of [...porEstudo].sort()) {
    console.log(cinza(`    ${estudo}: ${n}`));
  }

  if (avisos.length) {
    console.log('');
    console.log(amarelo(`  ${avisos.length} aviso(s):`));
    for (const a of avisos) console.log(cinza('    · ' + a));
  }

  if (erros.length) {
    console.log('');
    console.error(vermelho(`  A TRAVESSIA NÃO CONFERE — ${erros.length} erro(s):`));
    console.error('');
    for (const e of erros) console.error('    ' + vermelho('✗') + ' ' + e);
    console.error('');
    return 1;
  }

  console.log('');
  console.log(
    '  ' + verde('✓') +
      ' cada linha e cada ficheiro vindos do motor são, byte a byte, o que atravessou' +
      (origem ? ', e são ainda o que o motor tem.' : '.'),
  );
  console.log('');
  return 0;
}

/**
 * ---------------------------------------------------------------------------
 * O RÓTULO DA FONTE É ORIGEM, E NÃO PROSA DA CASA (29.08.2026)
 * ---------------------------------------------------------------------------
 *
 * `name` é o rótulo com que o publicador imprime a figura, e `name_source` diz
 * onde no ficheiro alojado ele foi lido. Os dois entram pelo exportador do
 * motor e por mais lado nenhum.
 *
 * Para as linhas que atravessaram, a conferência já existia e não muda: o
 * resumo dos bytes do ficheiro contra o resumo que o registo declara. Um rótulo
 * alterado à mão numa linha cruzada muda os bytes, e o resumo desmente-o com a
 * mensagem que já lá está.
 *
 * O que faltava é o outro lado, e é este: **uma linha que NÃO atravessou não
 * pode trazer rótulo.** Sem isto, o campo era uma porta aberta para escrever um
 * nome por cima de um número numa linha da casa — que é exactamente o que a
 * regra proíbe, e o que o `ItemDoLivro.astro` dizia por escrito antes de o
 * campo existir: «escrever um nome por cima de cada linha seria inventar
 * conteúdo que a fonte não publicou».
 *
 * A régua é sobre o registo da travessia, como as outras: uma linha com rótulo
 * cujo id não está em nenhum mapa `rows` fecha a construção.
 */

/** Os ids que atravessaram, de todos os registos de linhas. */
function idsQueAtravessaram(regsDeLinhas) {
  const ids = new Set();
  for (const { dados } of regsDeLinhas) for (const id of Object.keys(dados.rows ?? {})) ids.add(id);
  return ids;
}

/**
 * As linhas com rótulo que não atravessaram. Uma função pura sobre duas listas,
 * para que a planta lhe possa passar um caso feito à mão.
 */
function rotulosSemTravessia(linhas, cruzadas) {
  return linhas.filter((l) => l.temRotulo && !cruzadas.has(l.id)).map((l) => l.id);
}

function confereRotulos(regsDeLinhas, erros) {
  /* A PLANTA, ANTES DE QUALQUER CONTAGEM. Três casos: uma linha com rótulo que
     atravessou (verde), uma com rótulo que não atravessou (vermelho), e uma sem
     rótulo que não atravessou (verde, que é o estado de 1 049 linhas da casa e
     não pode ser confundido com o defeito). */
  const plantas = [
    { nome: 'linha com rótulo que atravessou', linhas: [{ id: 'a', temRotulo: true }], cruzadas: new Set(['a']), espera: 0 },
    { nome: 'linha com rótulo que NÃO atravessou', linhas: [{ id: 'b', temRotulo: true }], cruzadas: new Set(), espera: 1 },
    { nome: 'linha da casa, sem rótulo', linhas: [{ id: 'c', temRotulo: false }], cruzadas: new Set(), espera: 0 },
  ];
  for (const p of plantas) {
    const achado = rotulosSemTravessia(p.linhas, p.cruzadas);
    if (achado.length !== p.espera) {
      erros.push(
        `a prova da régua dos rótulos falhou no caso "${p.nome}": esperavam-se ${p.espera} ` +
          `e encontraram-se ${achado.length}. A contagem abaixo deixou de valer.`,
      );
    }
  }

  const cruzadas = idsQueAtravessaram(regsDeLinhas);
  const linhas = [];
  let ficheiros = 0;
  for (const nome of fs.readdirSync(DIR_CLAIMS).sort()) {
    if (!nome.endsWith('.yml')) continue;
    ficheiros++;
    let doc;
    try {
      doc = load(fs.readFileSync(path.join(DIR_CLAIMS, nome), 'utf8'));
    } catch {
      /* Um YAML inválido é defeito de outra régua (`npm run ledger:check`), e
         dizê-lo duas vezes só faz duas mensagens para um erro. */
      continue;
    }
    const rot = doc?.name;
    linhas.push({
      id: nome.slice(0, -4),
      temRotulo: rot !== null && rot !== undefined && String(rot) !== '',
    });
  }

  const semTravessia = rotulosSemTravessia(linhas, cruzadas);
  if (semTravessia.length) {
    erros.push(
      `${semTravessia.length} linha(s) trazem "name" e não atravessaram: ` +
        `${semTravessia.slice(0, 6).join(', ')}${semTravessia.length > 6 ? ', …' : ''}.\n` +
        `        O rótulo é o que a FONTE imprime por cima da figura, copiado do ficheiro ` +
        `alojado pelo leitor que leu o valor. Não se escreve neste repositório: um nome escrito ` +
        `aqui é a casa a nomear um número que a fonte não nomeou.\n` +
        `        Entra por ResearchHub/publisher/export_site_rows.py --write, ou não entra.`,
    );
  }
  return { ficheiros, comRotulo: linhas.filter((l) => l.temRotulo).length, plantas: plantas.length };
}

/** O resumo da linha do motor: JSON canónico, chaves ordenadas, sem espaços. */
function canonicalSha(row) {
  return sha256(Buffer.from(jsonCanonico(row), 'utf8'));
}

function jsonCanonico(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return '[' + v.map(jsonCanonico).join(',') + ']';
  const chaves = Object.keys(v).sort();
  return '{' + chaves.map((k) => JSON.stringify(k) + ':' + jsonCanonico(v[k])).join(',') + '}';
}

process.exit(main(process.argv.slice(2)));
