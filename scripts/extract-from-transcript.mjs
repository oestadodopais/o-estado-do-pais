#!/usr/bin/env node
/**
 * RECUPERAR OS BYTES DE UMA DESCARGA A PARTIR DO REGISTO DA SESSÃO
 *
 * Um caminho de recurso, para um caso e um só: a ferramenta de descarga
 * devolveu o artefacto EM LINHA, na resposta, sem escrever ficheiro nenhum em
 * disco. Os bytes existem — o arranês da sessão gravou a resposta da ferramenta
 * literalmente, em JSON — mas não existem como ficheiro.
 *
 * ---------------------------------------------------------------------------
 * PORQUE É QUE ISTO É LEGÍTIMO E UMA TRANSCRIÇÃO NÃO SERIA
 * ---------------------------------------------------------------------------
 *
 * A alternativa era copiar à mão ~43 KB de HTML a partir do texto da resposta.
 * Isso é texto escrito por nós: um carácter trocado seria uma alteração
 * silenciosa de uma obra publicada, e não haveria como a apanhar.
 *
 * Este caminho não escreve carácter nenhum. `JSON.parse` é uma
 * DESSERIALIZAÇÃO DETERMINISTA: o mesmo registo dá sempre os mesmos bytes,
 * exactamente como a normalização do invólucro dá sempre o mesmo documento. A
 * cadeia de custódia é: o anfitrião serviu → o arranês gravou literalmente →
 * um analisador puro devolveu. Ninguém redigiu nada pelo caminho.
 *
 * ---------------------------------------------------------------------------
 * AS CINCO CONFERÊNCIAS, E PORQUE SÃO ESTAS
 * ---------------------------------------------------------------------------
 *
 *   1. a descarga respondeu 200;
 *   2. o registo guarda a resposta DUAS VEZES — no bloco `tool_result` e em
 *      `toolUseResult.result` — e as duas cópias têm de ser idênticas. É uma
 *      testemunha a confirmar a outra dentro do mesmo registo;
 *   3. o cabeçalho que a ferramenta antepõe está lá, uma só vez, e é retirado
 *      por posição — não por adivinhação sobre onde acaba;
 *   4. o que sobra começa em `<!doctype html>`;
 *   5. **o comprimento em bytes bate certo com o campo `bytes` que o arranês
 *      registou da própria resposta HTTP.** Esta é a que fecha a porta: esse
 *      número não é derivado do texto, foi contado pela ferramenta na altura.
 *      Se o texto tivesse sido truncado, adulterado ou mal desescapado, não
 *      batia.
 *
 * Qualquer uma que falhe é uma PARAGEM. Não há recuperação parcial.
 *
 * O ficheiro do registo é lido linha a linha, e nunca por inteiro para memória.
 *
 * USO
 *   node scripts/extract-from-transcript.mjs <registo.jsonl> <uuid> [<saída>]
 */

import fs from 'node:fs';
import readline from 'node:readline';

/** Erro próprio: distingue «o registo não serve» de «falhou o disco». */
export class TranscriptMismatch extends Error {
  constructor(message) {
    super(message);
    this.name = 'TranscriptMismatch';
  }
}

/** O cabeçalho que a ferramenta antepõe à resposta em linha, e o seu fim. */
const FIM_DO_CABECALHO = 'raw HTML follows]\n';

/**
 * Os bytes de uma descarga, tirados do registo da sessão.
 *
 * @param {string} caminho ficheiro JSONL do registo
 * @param {string} uuid o identificador do artefacto
 * @returns {Promise<{ bytes: Buffer, meta: object }>}
 */
export async function extractFetch(caminho, uuid) {
  const rl = readline.createInterface({
    input: fs.createReadStream(caminho),
    crlfDelay: Infinity,
  });

  let pedido = null; // { id, url, ts }
  let resposta = null; // { copiaA, copiaB, tur, ts }
  let linha = 0;

  for await (const texto of rl) {
    linha++;
    if (!texto.trim()) continue;
    if (!texto.includes(uuid)) continue;

    let o;
    try {
      o = JSON.parse(texto);
    } catch {
      continue; // uma linha ilegível não é a nossa
    }
    const blocos = o.message?.content;
    if (!Array.isArray(blocos)) continue;

    for (const b of blocos) {
      if (b.type === 'tool_use' && b.name === 'WebFetch' && String(b.input?.url ?? '').includes(uuid)) {
        if (pedido) {
          throw new TranscriptMismatch(
            `extract-from-transcript: há mais do que uma descarga de "${uuid}" no registo. ` +
              `Qual delas seria a boa é uma pergunta que não se responde a olho.`,
          );
        }
        pedido = { id: b.id, url: b.input.url, ts: o.timestamp, linha };
      }
      if (b.type === 'tool_result' && pedido && b.tool_use_id === pedido.id) {
        resposta = {
          copiaA: typeof b.content === 'string' ? b.content : null,
          copiaB: typeof o.toolUseResult?.result === 'string' ? o.toolUseResult.result : null,
          tur: o.toolUseResult ?? {},
          ts: o.timestamp,
          linha,
        };
      }
    }
  }

  if (!pedido) throw new TranscriptMismatch(`extract-from-transcript: não há descarga de "${uuid}" no registo.`);
  if (!resposta) throw new TranscriptMismatch(`extract-from-transcript: a descarga de "${uuid}" não tem resposta no registo.`);

  /* 1 — respondeu 200. */
  if (Number(resposta.tur.code) !== 200) {
    throw new TranscriptMismatch(
      `extract-from-transcript: a descarga respondeu ${resposta.tur.code} ${resposta.tur.codeText ?? ''}, não 200.`,
    );
  }

  /* 2 — as duas cópias do registo dizem o mesmo. */
  if (resposta.copiaA === null || resposta.copiaB === null) {
    throw new TranscriptMismatch(
      'extract-from-transcript: o registo não traz as duas cópias da resposta (tool_result e ' +
        'toolUseResult.result). Sem a segunda testemunha, não se extrai.',
    );
  }
  if (resposta.copiaA !== resposta.copiaB) {
    throw new TranscriptMismatch(
      'extract-from-transcript: as duas cópias da resposta no registo não são iguais ' +
        `(${resposta.copiaA.length} contra ${resposta.copiaB.length} caracteres).`,
    );
  }

  /* 3 — o cabeçalho da ferramenta, uma vez, retirado por posição. */
  const inteiro = resposta.copiaA;
  const i = inteiro.indexOf(FIM_DO_CABECALHO);
  if (i < 0) {
    throw new TranscriptMismatch(
      `extract-from-transcript: a resposta não traz o cabeçalho ${JSON.stringify(FIM_DO_CABECALHO)}. ` +
        `Ou a descarga escreveu ficheiro (e então é esse que se usa), ou o formato mudou.`,
    );
  }
  if (inteiro.indexOf(FIM_DO_CABECALHO, i + FIM_DO_CABECALHO.length) >= 0) {
    throw new TranscriptMismatch('extract-from-transcript: o cabeçalho da ferramenta aparece mais do que uma vez.');
  }
  const html = inteiro.slice(i + FIM_DO_CABECALHO.length);

  /* 4 — o que sobra é um documento servido pelo anfitrião. */
  if (!html.startsWith('<!doctype html>')) {
    throw new TranscriptMismatch(
      `extract-from-transcript: depois do cabeçalho não vem "<!doctype html>", vem ` +
        `${JSON.stringify(html.slice(0, 40))}.`,
    );
  }

  /* 5 — a contagem de bytes da própria resposta HTTP. A conferência que fecha. */
  const bytes = Buffer.from(html, 'utf8');
  const registado = Number(resposta.tur.bytes);
  if (!Number.isFinite(registado)) {
    throw new TranscriptMismatch('extract-from-transcript: o registo não traz o campo "bytes" da resposta.');
  }
  if (bytes.length !== registado) {
    throw new TranscriptMismatch(
      `extract-from-transcript: o extraído tem ${bytes.length} bytes e o registo diz que a resposta ` +
        `tinha ${registado}. Diferença de ${bytes.length - registado}. Não se aloja um documento truncado.`,
    );
  }

  return {
    bytes,
    meta: {
      url: pedido.url,
      artifact_ver: resposta.tur.artifactRead?.ver ?? null,
      http_code: resposta.tur.code,
      fetched_utc: String(resposta.ts).replace(/\.\d{3}Z$/, 'Z'),
      requested_utc: String(pedido.ts).replace(/\.\d{3}Z$/, 'Z'),
      duration_ms: resposta.tur.durationMs ?? null,
      transcript: caminho,
      transcript_line: resposta.linha,
      tool_use_id: pedido.id,
      chars: html.length,
      bytes: bytes.length,
    },
  };
}

/* ---------------------------------------------------------------- linha -- */

const executadoDirectamente =
  process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;

if (executadoDirectamente) {
  const [registo, uuid, saida] = process.argv.slice(2);
  if (!registo || !uuid) {
    console.error('uso: node scripts/extract-from-transcript.mjs <registo.jsonl> <uuid> [<saída>]');
    process.exit(2);
  }
  try {
    const { bytes, meta } = await extractFetch(registo, uuid);
    if (saida) fs.writeFileSync(saida, bytes);
    for (const [k, v] of Object.entries(meta)) console.log(`${k.padEnd(16)} ${v}`);
    console.log(`${'escrito em'.padEnd(16)} ${saida ?? '(nada — não foi pedida saída)'}`);
  } catch (e) {
    console.error(`\n  ${e.message}\n`);
    process.exit(1);
  }
}
