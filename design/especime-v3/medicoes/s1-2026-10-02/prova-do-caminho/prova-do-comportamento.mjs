/**
 * A PROVA DO COMPORTAMENTO DA FUNÇÃO DAS SUGESTÕES CONTRA A BASE REAL (bloco S1, 02.10.2026, ponto 8 do brief).
 *
 * A pré-visualização da Vercel está atrás da autenticação da conta, e por isso o comportamento prova-se como o
 * lugar de direção o provou: a função `api/sugestoes.js` importada em Node (o mesmo `Request` e `Response` da Web
 * que a Vercel passa a um «Web Handler»), um sal de ensaio gerado nesta corrida e nunca escrito, o endereço de
 * documentação 203.0.113.7 (RFC 5737) em `x-forwarded-for`, e a base real, pelo `fetch` de sempre, que este guião
 * só envolve para contar as chamadas e ler o estado de cada resposta.
 *
 * Os pedidos: o GET; o POST com a armadilha; o vazio; um bom em português com o texto «ensaio do construtor S1» e a
 * hora UTC e o `Referer` com `?de=`; um bom em inglês; e seis seguidos, para ver recusado o sexto envio da hora na
 * mesma marca. Cada envio que chega à base leva a palavra «ensaio» e a hora UTC, para o lugar de direção os
 * confirmar na base e os apagar.
 *
 * O que se grava, em `respostas.json` e em `prova-local.txt`, ao lado deste guião: por pedido, o nome, a hora UTC,
 * o estado e o `location` da resposta da função, quantas vezes ela chamou a base e o estado de cada resposta da
 * base (com o identificador que a base devolve a um envio aceite, que é o da linha de ensaio a apagar). Nenhum
 * endereço IP de ninguém, nenhum sal, nenhuma chave: o pedido à base não se grava.
 *
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/s1-2026-10-02/prova-do-caminho/prova-do-comportamento.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..', '..', '..');
const ORIGEM = 'https://ensaio.invalid';
const IP_DE_DOCUMENTACAO = '203.0.113.7';

const { GET, POST } = await import(pathToFileURL(path.join(RAIZ, 'api', 'sugestoes.js')).href);

/* O sal desta corrida: aleatório, só em memória. Uma marca nova em cada corrida, para o limite da hora começar do
   zero e não somar os envios de uma corrida anterior. */
process.env.SUGESTOES_SAL = randomBytes(24).toString('hex');

const fetchDaBase = globalThis.fetch;
let chamadas = [];
globalThis.fetch = async (url, init) => {
  const resposta = await fetchDaBase(url, init);
  const corpo = await resposta.clone().text();
  let lido = null;
  try {
    lido = JSON.parse(corpo);
  } catch {
    lido = null;
  }
  chamadas.push({
    estado: resposta.status,
    /* O identificador da linha que a base guardou (um envio aceite), ou a mensagem com que recusou. */
    devolveu: resposta.ok ? (typeof lido === 'string' ? lido : null) : lido?.message ?? null,
  });
  return resposta;
};

const hora = () => new Date().toISOString().replace(/\.\d+Z$/, 'Z');
const registos = [];

async function pede(nome, { metodo = 'POST', campos = {}, referer = null }) {
  chamadas = [];
  const quando = hora();
  const cabecalhos = { 'x-forwarded-for': IP_DE_DOCUMENTACAO };
  if (referer) cabecalhos.referer = referer;
  const pedido =
    metodo === 'GET'
      ? new Request(`${ORIGEM}/api/sugestoes`, { headers: cabecalhos })
      : new Request(`${ORIGEM}/api/sugestoes`, { method: 'POST', body: new URLSearchParams(campos), headers: cabecalhos });
  const resposta = await (metodo === 'GET' ? GET(pedido) : POST(pedido));
  const registo = {
    nome,
    hora_utc: quando,
    estado: resposta.status,
    location: resposta.headers.get('location'),
    chamadas_a_base: chamadas.length,
    respostas_da_base: chamadas,
  };
  registos.push(registo);
  console.log(`${nome} · ${registo.estado} · ${registo.location} · base ${registo.chamadas_a_base}${chamadas.length ? ` (${chamadas.map((c) => `${c.estado} ${c.devolveu ?? ''}`.trim()).join('; ')})` : ''}`);
  return registo;
}

const inicio = hora();
await pede('01-get', { metodo: 'GET' });
await pede('02-armadilha', { campos: { lingua: 'pt', sitio: 'robo', procurou: `ensaio da armadilha do construtor S1 ${hora()}` } });
await pede('03-vazia', { campos: { lingua: 'pt', procurou: '   ', estudo: '', outro: '', contacto: '' } });
await pede('04-boa-pt', {
  campos: { lingua: 'pt', sitio: '', procurou: `ensaio do construtor S1 ${hora()}`, estudo: '', outro: '', contacto: '' },
  referer: `${ORIGEM}/sugestoes?de=%2Flugares%2Fevora`,
});
await pede('05-boa-en', {
  campos: { lingua: 'en', estudo: `ensaio do construtor S1, edição inglesa ${hora()}` },
  referer: `${ORIGEM}/en/suggestions?de=%2Fen`,
});
for (let i = 1; i <= 6; i += 1) {
  await pede(`06-limite-${i}`, { campos: { lingua: 'pt', outro: `ensaio do limite ${i} do construtor S1 ${hora()}` } });
}
const fim = hora();

const aceites = registos.filter((r) => r.respostas_da_base.some((c) => c.estado === 200));
const saida = {
  bloco: 'S1',
  o_que: 'a função api/sugestoes.js importada em Node contra a base real, com um sal de ensaio desta corrida e o endereço de documentação 203.0.113.7',
  inicio_utc: inicio,
  fim_utc: fim,
  envios_que_a_base_guardou: aceites.map((r) => ({ nome: r.nome, hora_utc: r.hora_utc, id: r.respostas_da_base.find((c) => c.estado === 200)?.devolveu ?? null })),
  respostas: registos,
};
fs.writeFileSync(path.join(AQUI, 'respostas.json'), JSON.stringify(saida, null, 2) + '\n');
fs.writeFileSync(
  path.join(AQUI, 'prova-local.txt'),
  registos.map((r) => `${r.nome} · ${r.estado} · ${r.location} · base ${r.chamadas_a_base}`).join('\n') +
    `\ninício ${inicio} · fim ${fim} · ${aceites.length} envios guardados pela base\n`,
);
console.log(`\n${aceites.length} envios guardados pela base, de ${inicio} a ${fim}.`);
