#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * A RÉGUA DO BLOCO P3 · o que cada item do §1 do brief promete, contado no dist/
 * ---------------------------------------------------------------------------
 * Não decide nada e não fecha nada: conta. Os portões que fecham a construção
 * são o `check:voz` (as palavras proibidas e os nomes declarados), o
 * `check:formas` (as três datas) e o `gate:html`. Esta régua existe para o
 * relatório: cada item do mandato tem uma medida de aceitação, e uma medida que
 * ninguém conta é uma promessa.
 *
 *   node design/especime-v3/medicoes/p3-2026-09-16/medir-p3.mjs [--json]
 *
 * As contagens, por item do brief:
 *
 *   1 · os cartões e o degrau de onde o nome vem, por edição;
 *   2 · os três rótulos das datas dentro das dobras das leituras breves;
 *   3 · «a casa» no texto do leitor, fora dos campos transcritos das fontes;
 *   5 · as palavras da lista da norma §1.3 no texto do leitor.
 *
 * O TEXTO DO LEITOR É O QUE SOBRA quando se tiram os campos do livro-razão
 * (`[data-linha-campo]`, `[data-verbatim]`) e o que a página não mostra
 * (`<script>`, `<style>`, o que está em `.vh` continua a contar porque é lido em
 * voz alta). Um campo transcrito de uma fonte fica como a fonte o escreveu, e
 * uma palavra da lista lá dentro não é a casa a escrevê-la.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
/* AS PALAVRAS PROIBIDAS CONTAM-SE PELA DEFINIÇÃO DO PORTÃO, e não por uma
   segunda cópia dela: o que o relatório diz tem de ser o que fecha a construção.
   `scripts/voz-palavras.mjs` é a lista, a definição de «à vista» e as exceções
   por rota, com a razão de cada uma. */
import { palavrasProibidasEm, PALAVRAS_PROIBIDAS } from '../../../../scripts/voz-palavras.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const DIST = process.env.OEDP_DIST ? path.resolve(RAIZ, process.env.OEDP_DIST) : path.join(RAIZ, 'dist');
const JSON_SO = process.argv.includes('--json');

if (!fs.existsSync(DIST)) {
  console.error('não existe dist/. Corra o build primeiro.');
  process.exit(2);
}

const contas = {
  paginas: 0,
  cartoes: { pt: {}, en: {} },
  blocos_sem_nome: { pt: 0, en: 0 },
  rotulos_das_datas_nas_dobras: { pt: 0, en: 0 },
  nome_oficial_no_recibo: 0,
  palavras_proibidas: { achados: 0, paginas: 0, excecoes: 0, por_palavra: {} },
};

/** Os três rótulos que o item 2 manda a zero nas dobras. */
const ROTULOS_DAS_DATAS = ['período de referência', 'lido na fonte a', 'verificado a', 'reference period', 'read at the source on', 'verified on'];

function anda(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) anda(p);
    else if (e.name.endsWith('.html')) le(p);
  }
}

function le(ficheiro) {
  const rel = path.relative(DIST, ficheiro);
  const html = fs.readFileSync(ficheiro, 'utf8');
  const edicao = /(^|\/)en(\/|$)/.test(rel) ? 'en' : 'pt';
  contas.paginas++;

  /* 1 · o degrau de cada cartão */
  for (const m of html.matchAll(/<span([^>]*cartao-medida-nome[^>]*)>/g)) {
    const attrs = m[1];
    const campo = /data-linha-campo="([^"]+)"/.exec(attrs)?.[1] ?? null;
    const fonte = /data-nome="([^"]+)"/.exec(attrs)?.[1] ?? null;
    const degrau = campo ?? fonte ?? 'sem-marca';
    contas.cartoes[edicao][degrau] = (contas.cartoes[edicao][degrau] ?? 0) + 1;
  }
  contas.blocos_sem_nome[edicao] += [...html.matchAll(/data-linha-sem-nome="/g)].length;
  contas.nome_oficial_no_recibo += [...html.matchAll(/data-nonledger="nome-oficial-da-medida"/g)].length;

  const root = parse(html);
  for (const fora of root.querySelectorAll('script, style')) fora.remove();

  /* 2 · os rótulos das datas dentro das dobras */
  for (const dobra of root.querySelectorAll('.dobra-datas, .dominio-datas')) {
    for (const k of dobra.querySelectorAll('.dobra-data-k, .dominio-data-k')) {
      if (ROTULOS_DAS_DATAS.includes(k.textContent.trim())) contas.rotulos_das_datas_nas_dobras[edicao]++;
    }
  }

}

anda(DIST);

/* 3 e 5 · as palavras da norma §1.3 na superfície, pela definição do portão. */
{
  const { achados, paginas, excecoes } = palavrasProibidasEm(DIST);
  contas.palavras_proibidas.achados = achados.length;
  contas.palavras_proibidas.paginas = paginas;
  contas.palavras_proibidas.excecoes = excecoes;
  for (const p of PALAVRAS_PROIBIDAS) contas.palavras_proibidas.por_palavra[p.chave] = 0;
  for (const a of achados) contas.palavras_proibidas.por_palavra[a.chave]++;
}

if (JSON_SO) {
  console.log(JSON.stringify(contas, null, 1));
} else {
  console.log(`páginas lidas: ${contas.paginas}`);
  for (const ed of ['pt', 'en']) {
    const c = contas.cartoes[ed];
    const total = Object.values(c).reduce((a, b) => a + b, 0);
    console.log(`  cartões ${ed}: ${total} · ${Object.entries(c).map(([k, v]) => `${k}=${v}`).join(' · ')} · blocos sem nome: ${contas.blocos_sem_nome[ed]}`);
  }
  console.log(`  rótulos das três datas nas dobras: pt=${contas.rotulos_das_datas_nas_dobras.pt} en=${contas.rotulos_das_datas_nas_dobras.en}`);
  /* O RÓTULO DIZIA «no recibo» E A CONTA ERA DE TODO O `dist/` (achado 5 da
     leitura a frio do Codex, 16.09.2026): as 62 ocorrências são 52 nos recibos e
     10 nos cartões sem nome do projeto. A repartição por lugar, e a conferência
     de que cada uma vem de uma linha «exata», estão em `nomes-oficiais.mjs`. */
  console.log(
    `  nome oficial rendido: ${contas.nome_oficial_no_recibo} vez(es) nas duas edições ` +
      `(a repartição por lugar está em nomes-oficiais.mjs)`,
  );
  const pp = contas.palavras_proibidas;
  console.log(
    `  palavras proibidas: ${pp.achados} achado(s) em ${pp.paginas} página(s) da superfície ` +
      `(${PALAVRAS_PROIBIDAS.length} palavras da norma §1.3; ${pp.excecoes} página(s) de estudo com a superfície ` +
        `estreitada por rota declarada, e nenhuma página saltada)`,
  );
  for (const [p, n] of Object.entries(pp.por_palavra)) if (n) console.log(`    «${p}»: ${n}`);
}
