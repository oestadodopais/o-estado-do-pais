/** H3: a medida estática da frase «Este sítio não usa cookies nem segue quem o lê» (o §5, decisão 2, do brief H3; o
 * ponto 4 do mandato: a frase só entra se for verdade medida nas páginas construídas).
 *
 * Lê todas as páginas de `dist/` pela mesma função que o portão de HTML passa a correr (`achadosNaPagina()`, em
 * `scripts/privacidade-do-portao.mjs`), os guiões servidos, a configuração da Vercel e as funções de `api/`
 * (`conferirSemCookiesNemSeguimento()`), e escreve `cookies-e-seguimento-<rótulo>.json` nesta pasta, com a cabeça da
 * construção, a cabeça e o estado da árvore em que correu (a M50), as contagens e cada achado. O conhecido-positivo
 * corre primeiro: as plantas em memória da mesma célula (um guião de fora, um guião que escreve cookies, uma imagem e
 * uma folha de outra origem, uma baliza, um `Set-Cookie` na configuração e numa função) têm de ser todas vistas, e as
 * páginas limpas têm de passar.
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/h3-2026-10-05/cookies-e-seguimento.mjs <rótulo>
 * Sai com 0 quando mediu (com achados ou sem eles) e o conhecido-positivo foi visto; 2 quando não foi.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { achadosNaPagina, conferirSemCookiesNemSeguimento, plantasDaPrivacidade } from '../../../../scripts/privacidade-do-portao.mjs';

const rotulo = process.argv[2];
if (!rotulo) throw new Error('uso: cookies-e-seguimento.mjs <rótulo>');
const raiz = process.cwd();
const dist = path.join(raiz, 'dist');
const pasta = 'design/especime-v3/medicoes/h3-2026-10-05';
const versao = JSON.parse(fs.readFileSync(path.join(dist, 'version.json'), 'utf8'));
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const estado = execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], { encoding: 'utf8' });
const proprios = new Set(['xn--oestadodopas-2fb.pt', 'oestadodopais.pt', 'xn--oestadodopas-2fb.pt:443']);

const plantas = plantasDaPrivacidade().filter((p) => p.nome.startsWith('h3-cookies-'));
const positivo = plantas.every((p) => p.mordeu);

const paginas = { lidas: 0, achados: /** @type {{ rel: string, achado: string }[]} */ ([]) };
const anda = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) anda(f);
    else if (e.name.endsWith('.html')) {
      paginas.lidas++;
      for (const a of achadosNaPagina(fs.readFileSync(f, 'utf8'), proprios)) paginas.achados.push({ rel: path.relative(raiz, f), achado: a });
    }
  }
};
anda(dist);
const r = conferirSemCookiesNemSeguimento({ dist, raiz, paginas });
const saida = {
  guiao: `${pasta}/cookies-e-seguimento.mjs`,
  rotulo,
  construcao: versao.commit,
  cabeca,
  arvore_limpa: estado === '',
  medido_em: new Date().toISOString(),
  paginas_lidas: r.contas.paginas,
  guioes_servidos_lidos: r.contas.guioes,
  configuracao_lida: r.contas.configuracao,
  funcoes_lidas: r.contas.funcoes,
  achados: r.contas.achados,
  lista_dos_achados: [...paginas.achados, ...[]].slice(0, 50),
  todos_os_achados_fora_das_paginas: r.erros.length ? r.erros : [],
  frase_no_texto: r.fraseNoTexto,
  conhecido_positivo: { o_que: 'as plantas em memória da célula dos cookies (h3-cookies-*), cada uma vista, e as limpas a passar', plantas, encontrado: positivo },
};
fs.writeFileSync(path.join(pasta, `cookies-e-seguimento-${rotulo}.json`), JSON.stringify(saida, null, 2) + '\n');
console.log(`H3 cookies (${rotulo}): ${r.contas.paginas} página(s), ${r.contas.guioes} guião(ões) servido(s), ${r.contas.configuracao} configuração, ${r.contas.funcoes} função(ões): ${r.contas.achados} achado(s); conhecido-positivo ${positivo ? 'visto' : 'NÃO visto'}.`);
for (const a of paginas.achados.slice(0, 10)) console.log(`  ${a.rel}: ${a.achado}`);
process.exit(positivo ? 0 : 2);
