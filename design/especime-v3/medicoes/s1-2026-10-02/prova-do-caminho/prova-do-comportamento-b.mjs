/**
 * A PROVA DO COMPORTAMENTO DA FUNÇÃO DAS SUGESTÕES, PASSAGEM S1-b (03.10.2026, o ponto 9 da mensagem do lugar
 * de direção). A BASE AQUI É SIMULADA, E A BASE REAL NÃO É CHAMADA.
 *
 * A função nova manda à base a chave que só a Vercel tem (a variável sensível `SUGESTOES_CHAVE`), e a chave não se
 * lê de volta da Vercel, nem pelo construtor nem por ninguém: por isso esta prova não pode correr contra a base
 * real. Corre a função `api/sugestoes.js` importada em Node, com um sal e uma chave de ensaio gerados na corrida
 * (a chave com uma quebra de linha no fim, como a variável pode ter) e nunca escritos, o endereço de documentação
 * 203.0.113.7 (RFC 5737) em `x-forwarded-for`, o relógio controlado, e um `fetch` substituído que faz o que a
 * última definição da função `enviar_sugestao` faz nas migrações (`supabase/migrations/`): recusa a chave errada
 * (`chave`), a sugestão vazia (`vazia`), a língua desconhecida (`lingua`), a marca que não tem 64 caracteres
 * (`marca`), o dia cheio (`cheia`) e a sexta marca da hora (`limite`), e desfaz tudo o que a chamada fez quando
 * recusa, como uma transação que levanta uma exceção. A prova contra a base real fica para depois de aterrar.
 *
 * Os pedidos: o GET; a armadilha; a vazia; um bom em português com o `Referer` da origem do pedido; um bom em
 * inglês; um com o `Referer` de outra origem; um sem `x-forwarded-for`; um sem a chave; seis seguidos, para ver
 * recusado o sexto envio da hora na mesma marca; e um depois de a hora mudar, com a marca nova.
 *
 * O que se grava, em `respostas-b.json` e em `prova-local-b.txt`, ao lado deste guião: por pedido, o instante do
 * relógio simulado, o estado e o `location` da resposta da função, quantas vezes ela chamou a base, o que a base
 * simulada respondeu, e, de cada envio guardado, a língua, a página e os campos preenchidos. Nenhum endereço IP de
 * ninguém, nenhum sal, nenhuma chave e nenhuma marca.
 *
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/s1-2026-10-02/prova-do-caminho/prova-do-comportamento-b.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..', '..', '..');
const ANFITRIAO = 'ensaio.invalid';
const IP_DE_DOCUMENTACAO = '203.0.113.7';

const { GET, POST } = await import(pathToFileURL(path.join(RAIZ, 'api', 'sugestoes.js')).href);

const sha256 = (x) => createHash('sha256').update(x).digest('hex');
const SAL = randomBytes(24).toString('hex');
const CHAVE = `${randomBytes(24).toString('hex')}\n`;

/* A BASE SIMULADA: o estado (as sugestões, as marcas, o resumo da chave) e a função `enviar_sugestao`. */
const base = { sugestoes: [], limites: new Map(), resumoDaChave: sha256(CHAVE.trim()) };
let agora = Date.parse('2026-10-03T10:20:00Z');
const realNow = Date.now;
Date.now = () => agora;
const recusa = (mensagem) => new Response(JSON.stringify({ code: 'P0001', details: null, hint: null, message: mensagem }), { status: 400, headers: { 'content-type': 'application/json' } });
let chamadas = [];
globalThis.fetch = async (url, init) => {
  const p = JSON.parse(String(init?.body ?? '{}'));
  const registo = { url_e_funcao: /\/rest\/v1\/rpc\/enviar_sugestao$/.test(String(url)) };
  chamadas.push(registo);
  const vazio = (x) => x === null || x === undefined || String(x).trim() === '';
  /* A transação: o que muda só fica se nada recusar. */
  const limites = new Map([...base.limites].map(([k, v]) => [k, { ...v }]));
  if (!p.p_chave || sha256(p.p_chave) !== base.resumoDaChave) return (registo.respondeu = 'chave'), recusa('chave');
  if (vazio(p.p_procurou) && vazio(p.p_estudo) && vazio(p.p_outro)) return (registo.respondeu = 'vazia'), recusa('vazia');
  if (!['pt', 'en'].includes(p.p_lingua)) return (registo.respondeu = 'lingua'), recusa('lingua');
  if (!p.p_marca || String(p.p_marca).length !== 64) return (registo.respondeu = 'marca'), recusa('marca');
  if (base.sugestoes.filter((s) => s.criado_em > agora - 24 * 3600 * 1000).length >= 200) return (registo.respondeu = 'cheia'), recusa('cheia');
  for (const [marca, l] of limites) if (l.ate < agora) limites.delete(marca);
  const linha = limites.get(p.p_marca) ?? { contagem: 0, ate: agora + 3600 * 1000 };
  linha.contagem += 1;
  limites.set(p.p_marca, linha);
  if (linha.contagem > 5) return (registo.respondeu = 'limite'), recusa('limite');
  const id = randomUUID();
  base.sugestoes.push({ id, criado_em: agora, lingua: p.p_lingua, pagina: p.p_pagina, preenchidos: ['p_procurou', 'p_estudo', 'p_outro', 'p_contacto'].filter((k) => !vazio(p[k])) });
  base.limites = limites;
  registo.respondeu = 'guardou';
  registo.guardou = { lingua: p.p_lingua, pagina: p.p_pagina, preenchidos: base.sugestoes.at(-1).preenchidos, marcas_vivas: base.limites.size };
  return new Response(JSON.stringify(id), { status: 200, headers: { 'content-type': 'application/json' } });
};

const registos = [];
async function pede(nome, { metodo = 'POST', campos = {}, referer = null, comIp = true, comChave = true }) {
  chamadas = [];
  agora += 1000;
  if (comChave) process.env.SUGESTOES_CHAVE = CHAVE;
  else delete process.env.SUGESTOES_CHAVE;
  process.env.SUGESTOES_SAL = SAL;
  const cabecalhos = { 'x-forwarded-proto': 'https' };
  if (comIp) cabecalhos['x-forwarded-for'] = IP_DE_DOCUMENTACAO;
  if (referer) cabecalhos.referer = referer;
  const url = `http://${ANFITRIAO}/api/sugestoes`;
  const pedido = metodo === 'GET' ? new Request(url) : new Request(url, { method: 'POST', body: new URLSearchParams(campos), headers: cabecalhos });
  const resposta = await (metodo === 'GET' ? GET(pedido) : POST(pedido));
  const r = {
    nome,
    instante_simulado: new Date(agora).toISOString().replace(/\.\d+Z$/, 'Z'),
    estado: resposta.status,
    location: resposta.headers.get('location'),
    chamadas_a_base: chamadas.length,
    base_simulada: chamadas.map((c) => ({ respondeu: c.respondeu ?? null, ...(c.guardou ? { guardou: c.guardou } : {}) })),
  };
  registos.push(r);
  console.log(`${nome} · ${r.estado} · ${r.location} · base ${r.chamadas_a_base}${chamadas.length ? ` (${chamadas.map((c) => c.respondeu).join('; ')})` : ''}`);
}

const inicio = new Date(realNow()).toISOString().replace(/\.\d+Z$/, 'Z');
await pede('01-get', { metodo: 'GET' });
await pede('02-armadilha', { campos: { lingua: 'pt', sitio: 'robo', procurou: 'ensaio da armadilha' } });
await pede('03-vazia', { campos: { lingua: 'pt', procurou: '   ', estudo: '', outro: '', contacto: '' } });
await pede('04-boa-pt', { campos: { lingua: 'pt', procurou: 'ensaio do construtor S1-b' }, referer: `https://${ANFITRIAO}/sugestoes?de=%2Flugares%2Fevora` });
await pede('05-boa-en', { campos: { lingua: 'en', estudo: 'ensaio do construtor S1-b, edição inglesa' } });
await pede('06-referer-de-outra-origem', { campos: { lingua: 'pt', outro: 'ensaio de uma proveniência forjada' }, referer: 'https://outro.invalid/sugestoes?de=%2Fforjada' });
await pede('07-sem-ip', { campos: { lingua: 'pt', procurou: 'ensaio sem endereço' }, comIp: false });
await pede('08-sem-chave', { campos: { lingua: 'pt', procurou: 'ensaio sem chave' }, comChave: false });
for (let i = 1; i <= 6; i += 1) await pede(`09-limite-${i}`, { campos: { lingua: 'pt', outro: `ensaio do limite ${i}` } });
agora = Date.parse('2026-10-03T11:00:30Z');
await pede('10-hora-seguinte', { campos: { lingua: 'pt', outro: 'ensaio na hora seguinte' } });
const fim = new Date(realNow()).toISOString().replace(/\.\d+Z$/, 'Z');
Date.now = realNow;

const guardados = registos.filter((r) => r.base_simulada.some((b) => b.respondeu === 'guardou'));
const saida = {
  bloco: 'S1-b',
  o_que: 'a função api/sugestoes.js importada em Node, com um sal e uma chave de ensaio desta corrida, o endereço de documentação 203.0.113.7 e uma base SIMULADA que faz o que a última definição da função enviar_sugestao faz nas migrações; a base real não foi chamada',
  base_real_chamada: false,
  inicio_utc: inicio,
  fim_utc: fim,
  envios_guardados_pela_base_simulada: guardados.map((r) => r.nome),
  respostas: registos,
};
fs.writeFileSync(path.join(AQUI, 'respostas-b.json'), JSON.stringify(saida, null, 2) + '\n');
fs.writeFileSync(
  path.join(AQUI, 'prova-local-b.txt'),
  'a base é simulada pelo guião; a base real não foi chamada\n' +
    registos.map((r) => `${r.nome} · ${r.instante_simulado} · ${r.estado} · ${r.location} · base ${r.chamadas_a_base}${r.base_simulada.length ? ` (${r.base_simulada.map((b) => b.respondeu).join('; ')})` : ''}`).join('\n') +
    `\ncorrida de ${inicio} a ${fim} · ${guardados.length} envios guardados pela base simulada\n`,
);
console.log(`\n${guardados.length} envios guardados pela base simulada; a base real não foi chamada.`);
