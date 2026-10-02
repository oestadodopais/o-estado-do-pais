import { WORKS, subjectLabel } from '../data/studies.mjs';
import { leituraDe } from '../data/leituras.mjs';
import { DOMINIOS } from '../data/dominios.mjs';
import { dataDaEdicaoNoRepositorio } from './datas-do-repositorio.mjs';
import { routePath } from './routes.mjs';
import { getClaim } from './ledger.mjs';

/** @param {typeof WORKS[number]} work @param {'pt'|'en'} lang */
export function fichaDoEstudo(work, lang) {
  const edicao = work.editions.find(e => e.lang === lang) ?? work.editions[0];
  const data = dataDaEdicaoNoRepositorio(work.slug, edicao.lang);
  const tema = DOMINIOS.find(d => d.slug === work.tema);
  if (!tema) throw new Error(`B1 tema em falta ou desconhecido: ${work.slug}`);
  const leitura = leituraDe(work.id);
  return { work, edicao, data, tema: tema.nome[lang], lugar: subjectLabel(work.subject, lang) ?? 'Portugal',
    /* A MARCA DO VERBATIM SÓ VALE QUANDO O RESUMO É A DESCRIÇÃO (B1, peça 2):
       com leitura escrita, o que se rende são as duas primeiras frases dela, e
       declará-las como a abertura transcrita do documento era dizer que o
       portão compara duas coisas diferentes. */
    temLeitura: Boolean(leitura),
    /* A PERGUNTA A QUE O ESTUDO RESPONDE (bloco E1, 01.10.2026): a da língua da
       edição que a ficha rende, transcrita da leitura de abertura do documento, com
       a chave do `verbatim.mjs` que o portão confere. Um estudo que não a declara
       não a tem, e a ficha fica como estava. */
    pergunta: /** @type {Record<string, string> | undefined} */ (work.pergunta)?.[edicao.lang] ?? null,
    verbatimDaPergunta: /** @type {Record<string, string> | undefined} */ (work.verbatimDaPergunta)?.[edicao.lang] ?? null,
    resumo: primeirasFrases(leitura?.frase[lang] ?? [work.description[lang]]).map(p =>
      typeof p !== 'string' && 'claim' in p && getClaim(p.claim).unit === '%' && !p.sufixo
        /* K2 (02.10.2026, item 5 do brief): o «%» leva o espaço antes dele, como em todos os valores do sítio. */
        ? { ...p, sufixo: ' %' } : p),
    rota: routePath('estudo', lang, { slug: work.slug }) };
}
/** Conserva os objetos Claim e recorta só prosa, sem cortar números de uma linha.
 * @param {PedacoDeFrase[]} partes
 */
export function primeirasFrases(partes) {
  let faltam = 2;
  const saida = [];
  for (const parte of partes) {
    if (!faltam) break;
    if (typeof parte !== 'string') { saida.push(parte); continue; }
    const fins = [...parte.matchAll(/[.!?](?=\s|$)/g)];
    if (fins.length >= faltam) {
      saida.push(parte.slice(0, /** @type {number} */ (fins[faltam - 1].index) + 1));
      break;
    }
    saida.push(parte);
    faltam -= fins.length;
  }
  return saida;
}
/**
 * TODOS OS ESTUDOS, UMA LISTA SÓ, DO MAIS RECENTE PARA O MAIS ANTIGO (bloco R1,
 * 23.09.2026, I144). A lista punha os estudos do país primeiro e os de um lugar
 * atrás de uma secção «Por lugar», e o mais recente de todos (Évora 2027) ficava
 * lá. A estrutura de 17.09.2026, §3, diz uma lista só; o lugar e o tema de cada
 * estudo dizem-se na sua entrada. A data é a mesma que o índice já usava, a de
 * `datas-de-publicacao.json`; num empate, a ordem do arquivo.
 *
 * @param {'pt'|'en'} lang
 */
export function todosOsEstudos(lang) {
  /* Os estudos com sucessor (bloco E1, 01.10.2026) ficam alojados como edições
     datadas e saem da lista: quem os lista agora são os estudos que lhes sucedem. */
  return WORKS.filter(w => !w.sucedidoPor).map(w => fichaDoEstudo(w, lang))
    .sort((a, b) => (b.data ?? '').localeCompare(a.data ?? '') || WORKS.indexOf(a.work) - WORKS.indexOf(b.work));
}
/** @param {string} lugar @param {'pt'|'en'} lang */
export function portaDoLugar(lugar, lang) {
  return routePath(lugar === 'evora' ? 'municipio' : 'regiao', lang, { slug: lugar }) + '#trabalhos';
}
