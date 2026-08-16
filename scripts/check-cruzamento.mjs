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
  'exported_at',
  'exporter',
  'site_corrections',
];

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
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
      if (actual !== entrada.exported_row_sha256) {
        erros.push(
          `${onde}: os bytes em disco já não são os que atravessaram.\n` +
            `        registo: ${entrada.exported_row_sha256}\n` +
            `        disco:   ${actual}\n` +
            `        Uma linha cruzada não se edita à mão. Ou se volta a cruzar no motor ` +
            `(ResearchHub/publisher/export_site_rows.py --write), ou — se é este sítio a ` +
            `admitir um erro — escreve-se a correcção em corrections[] e corre-se\n` +
            `        node scripts/check-cruzamento.mjs --accept-correction ${id}`,
        );
        continue;
      }

      let linha;
      try {
        linha = load(bytes.toString('utf8'));
      } catch (err) {
        erros.push(`${onde}: YAML inválido: ${err.message}`);
        continue;
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

  const ficheirosCruzados = confereFicheiros(regsDeFicheiros, erros);
  confereRegistoDaTravessia(regsDeFicheiros, erros);
  const itensDaAgenda = confereInvariantes(erros);

  console.log('');
  console.log(
    cinza(
      `  cruzamentos · ${total} linha(s) de origem externa em ${ficheiros} registo(s)` +
        (origem ? ` · ${origem.lidos} conferida(s) contra o motor` : ''),
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
