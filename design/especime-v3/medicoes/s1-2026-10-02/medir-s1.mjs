/**
 * AS MEDIDAS DO BLOCO S1 (a caixa das sugestões), escritas em `medidas.json` ao lado deste guião, com as da
 * passagem S1-b (03.10.2026), que começam por `s1b_`. As medidas do S1 tal como estavam no fim do bloco ficam em
 * `medidas-s1.json`, a cópia do `medidas.json` da cabeça 7fdd4794, que é o que a secção do S1 do relatório cita.
 *
 * Cada medição leva o nome, o valor, o comando que a repete e um conhecido-positivo: uma coisa que o MESMO leitor tem
 * de encontrar, para que um zero ou um valor não seja o silêncio de um leitor cego. O que este guião não conseguir ler
 * fica «NÃO LIDO», com o conhecido-positivo a falso, e nunca com um número escrito à mão.
 *
 * Lê o repositório, a construção em `dist/` (que tem de ser da cabeça atual, pelo `dist/version.json`), as provas desta
 * pasta (a célula da função, a privacidade, a prova do comportamento, a da plataforma, as capturas, os portões) e os
 * dois ficheiros do custo. Não lê a rede nem a base.
 *
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/s1-2026-10-02/medir-s1.mjs
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const RAIZ = process.cwd();
const PASTA = path.join(RAIZ, 'design/especime-v3/medicoes/s1-2026-10-02');
const NAO = 'NÃO LIDO';
const BASE_DO_BLOCO = '62ed13c6';
const medidas = [];
const medicao = (nome, valor, comando, o_que, encontrado) =>
  medidas.push({ nome, valor, comando, conhecido_positivo: { o_que, encontrado: Boolean(encontrado) } });
const le = (f) => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null);
const leJson = (f) => {
  const t = le(f);
  try {
    return t === null ? null : JSON.parse(t);
  } catch {
    return null;
  }
};
const git = (...a) => execFileSync('git', a, { cwd: RAIZ, encoding: 'utf8' }).trim();

const { SUGESTOES, ROTAS_DO_RESULTADO } = await import(pathToFileURL(path.join(RAIZ, 'src/data/sugestoes.mjs')).href);
const { ROUTES, routePath, LANGS } = await import(pathToFileURL(path.join(RAIZ, 'src/lib/routes.mjs')).href);

/* 1 · os textos do brief, à letra: cada texto entre «…» do §5.4 e do §5.5 que é um texto da página, comparado byte a
   byte com a cadeia de `src/data/sugestoes.mjs`. */
{
  const brief = le(path.join(RAIZ, 'design/observatorio/BRIEF-S1-a-caixa-das-sugestoes.md')) ?? '';
  const s5 = brief.includes('## 5 ·') ? brief.slice(brief.indexOf('## 5 ·'), brief.indexOf('## 6 ·')) : '';
  const citados = new Set([...s5.matchAll(/«([^»]*)»/g)].map((m) => m[1]));
  const declarados = [];
  for (const lang of LANGS) {
    declarados.push(SUGESTOES.nota[lang], SUGESTOES.paragrafo[lang], SUGESTOES.botao[lang]);
    for (const r of Object.values(SUGESTOES.rotulos)) declarados.push(r[lang]);
    for (const r of Object.values(SUGESTOES.resultados)) declarados.push(r[lang]);
  }
  const iguais = declarados.filter((d) => citados.has(d)).length;
  medicao('textos_da_pagina_iguais_ao_brief', s5 ? iguais : NAO, 'node design/especime-v3/medicoes/s1-2026-10-02/medir-s1.mjs · os textos de src/data/sugestoes.mjs que são, byte a byte, um texto entre «…» do §5 do brief', 'o parágrafo português do brief é encontrado entre os citados', citados.has(SUGESTOES.paragrafo.pt));
  /* Os dois textos da página do limite que a passagem S1-b mudou, tal como a mensagem do lugar de direção dessa
     passagem os deu (o ponto 4), e que o brief não tem. */
  const DECISAO_S1B = new Set([
    'Chegaram cinco sugestões deste endereço numa hora. Volte mais tarde.',
    'Five suggestions arrived from this address within one hour. Please come back later.',
  ]);
  medicao('s1b_textos_da_pagina_iguais_a_decisao', declarados.filter((d) => DECISAO_S1B.has(d)).length, 'o mesmo guião · os textos de src/data/sugestoes.mjs iguais, byte a byte, aos dois da página do limite da mensagem do lugar de direção da passagem S1-b', 'a frase portuguesa do limite é a da decisão', DECISAO_S1B.has(SUGESTOES.resultados.limite.pt));
  medicao('textos_da_pagina_declarados', declarados.length, 'o mesmo guião · as cadeias do §5.4 e do §5.5 em src/data/sugestoes.mjs, nas duas línguas', 'a nota inglesa está entre as declaradas', declarados.includes(SUGESTOES.nota.en));
}

/* 1b · o §0 do brief, reproduzido pelo guião do brief, num ficheiro temporário, e comparado com o que está escrito. */
{
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'oedp-s1-brief-'));
  let iguais = NAO, total = NAO, positivos = false;
  try {
    execFileSync('python3', ['design/observatorio/medidas/BRIEF-S1.py'], { cwd: RAIZ, env: { ...process.env, OEDP_MEDIDAS_JSON: path.join(tmp, 'b.json') }, stdio: 'ignore' });
    const hoje = leJson(path.join(tmp, 'b.json'))?.medidas ?? [];
    const escrito = leJson(path.join(RAIZ, 'design/observatorio/medidas/BRIEF-S1.json'))?.medidas ?? [];
    total = escrito.length;
    iguais = hoje.filter((m, i) => escrito[i] && escrito[i].nome === m.nome && escrito[i].valor === m.valor).length;
    positivos = hoje.length > 0 && hoje.every((m) => m.conhecido_positivo.encontrado);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  medicao('medicoes_do_brief_escritas', total, 'design/observatorio/medidas/BRIEF-S1.json · as medições', 'o guião do brief corre e escreve medições', positivos);
  medicao('medicoes_do_brief_reproduzidas', iguais, 'OEDP_MEDIDAS_JSON=<temporário> python3 design/observatorio/medidas/BRIEF-S1.py, comparado medição a medição com BRIEF-S1.json', 'cada conhecido-positivo do guião foi encontrado', positivos);
}

/* 2 · as rotas: as chaves da tabela na base do bloco e agora. */
{
  const chavesDe = (texto) => {
    const bloco = texto.slice(texto.indexOf('export const ROUTES = {'));
    return [...bloco.slice(0, bloco.indexOf('\n};')).matchAll(/^\s{2}([a-zA-Z]+): \{/gm)].map((m) => m[1]);
  };
  const antes = chavesDe(git('show', `${BASE_DO_BLOCO}:src/lib/routes.mjs`));
  const agora = Object.keys(ROUTES);
  const novas = agora.filter((k) => !antes.includes(k));
  medicao('rotas_declaradas_antes', antes.length, `git show ${BASE_DO_BLOCO}:src/lib/routes.mjs · as chaves de ROUTES`, 'a das correções é uma delas', antes.includes('correcoes'));
  medicao('rotas_declaradas_agora', agora.length, 'Object.keys(ROUTES) de src/lib/routes.mjs', 'a das sugestões é uma delas', agora.includes('sugestoes'));
  medicao('rotas_novas_do_bloco', novas.length, 'as chaves de agora que a base do bloco não tinha', 'as quatro do resultado estão entre elas', Object.values(ROTAS_DO_RESULTADO).every((k) => novas.includes(k)));
}

/* 3 · a construção: as páginas da caixa, o noindex, o mapa do sítio e a porta do rodapé em todas as páginas. */
{
  const versao = leJson(path.join(RAIZ, 'dist/version.json'));
  const cabeca = git('rev-parse', 'HEAD');
  const daCabeca = versao?.commit === cabeca;
  const chaves = ['sugestoes', ...Object.values(ROTAS_DO_RESULTADO)];
  const ficheiroDe = (k, l) => path.join(RAIZ, 'dist', routePath(k, l).replace(/^\//, ''), 'index.html');
  const paginas = chaves.flatMap((k) => LANGS.map((l) => ficheiroDe(k, l)));
  const construidas = paginas.filter((f) => fs.existsSync(f));
  const comNoindex = construidas.filter((f) => /<meta name="robots" content="noindex, follow">/.test(fs.readFileSync(f, 'utf8')));
  medicao('construcao_da_cabeca', daCabeca ? 1 : 0, 'dist/version.json, o campo commit, contra git rev-parse HEAD', 'o ficheiro tem commit', Boolean(versao?.commit));
  medicao('paginas_da_caixa_construidas', daCabeca ? construidas.length : NAO, 'as cinco rotas da caixa nas duas edições, cada uma com o seu index.html em dist/', 'a página do formulário português existe', fs.existsSync(ficheiroDe('sugestoes', 'pt')));
  medicao('paginas_da_caixa_com_noindex', daCabeca ? comNoindex.length : NAO, 'as páginas da caixa com <meta name="robots" content="noindex, follow">', 'a do obrigado português leva-o', comNoindex.includes(ficheiroDe('sugestoesObrigado', 'pt')));
  const mapa = fs.readdirSync(path.join(RAIZ, 'dist')).filter((f) => /^sitemap-\d+\.xml$/.test(f)).map((f) => fs.readFileSync(path.join(RAIZ, 'dist', f), 'utf8')).join('\n');
  const noMapa = new Set([...mapa.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/\/$/, '') || '/'));
  const formulariosNoMapa = LANGS.filter((l) => noMapa.has(routePath('sugestoes', l))).length;
  const resultadosNoMapa = Object.values(ROTAS_DO_RESULTADO).flatMap((k) => LANGS.map((l) => routePath(k, l))).filter((c) => noMapa.has(c)).length;
  medicao('formularios_no_mapa_do_sitio', daCabeca ? formulariosNoMapa : NAO, 'os <loc> de dist/sitemap-N.xml com o caminho do formulário de cada edição', 'o mapa tem a página das correções', noMapa.has(routePath('correcoes', 'pt')));
  medicao('paginas_do_resultado_no_mapa_do_sitio', daCabeca ? resultadosNoMapa : NAO, 'os <loc> de dist/sitemap-N.xml com o caminho de uma página do resultado', 'o mesmo leitor vê os dois formulários', formulariosNoMapa === 2);
  let comPorta = 0, comCorrecoes = 0, html = 0;
  const anda = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) anda(p);
      else if (e.name.endsWith('.html')) {
        html += 1;
        const s = fs.readFileSync(p, 'utf8');
        if ((s.match(/data-porta-sugestoes(?![\w-])/g) ?? []).length === 1) comPorta += 1;
        if (/data-porta-correccoes/.test(s)) comCorrecoes += 1;
      }
    }
  };
  anda(path.join(RAIZ, 'dist'));
  medicao('paginas_html_construidas', daCabeca ? html : NAO, 'os ficheiros .html de dist/', 'a página do formulário é um deles', fs.existsSync(ficheiroDe('sugestoes', 'pt')));
  medicao('paginas_com_uma_porta_das_sugestoes', daCabeca ? comPorta : NAO, 'os .html de dist/ com exatamente um atributo data-porta-sugestoes', 'a primeira página tem-na', /data-porta-sugestoes(?![\w-])/.test(le(path.join(RAIZ, 'dist/index.html')) ?? ''));
  medicao('paginas_com_a_porta_das_correcoes', daCabeca ? comCorrecoes : NAO, 'os .html de dist/ com data-porta-correccoes', 'a primeira página tem-na', /data-porta-correccoes/.test(le(path.join(RAIZ, 'dist/index.html')) ?? ''));
}

/* 4 · a função, a sua célula, a privacidade e os mortos, pelas provas desta pasta. */
{
  const api = fs.readdirSync(path.join(RAIZ, 'api'));
  medicao('ficheiros_na_pasta_das_funcoes', api.length, 'ls api/', 'a função das sugestões está lá', api.includes('sugestoes.js'));
  const celula = leJson(path.join(PASTA, 'celula-da-funcao.json'));
  const plantas = celula?.plantas?.filter((p) => p.nome !== 'controlo-sem-troca') ?? [];
  medicao('casos_da_celula_da_funcao', celula ? celula.casos.length : NAO, 'node tests/sugestoes/funcao.mjs --prova --json design/especime-v3/medicoes/s1-2026-10-02/celula-da-funcao.json', 'o caso da armadilha está entre os casos e passa', celula?.casos?.some((c) => c.caso === 'armadilha' && c.passou));
  medicao('casos_da_celula_da_funcao_verdes', celula ? celula.casos.filter((c) => c.passou).length : NAO, 'o mesmo ficheiro · os casos com passou', 'o caso do limite passa', celula?.casos?.some((c) => c.caso === 'limite' && c.passou));
  medicao('plantas_da_celula_da_funcao', celula ? plantas.length : NAO, 'o mesmo ficheiro · as plantas além do controlo', 'a planta da armadilha invertida mordeu', plantas.some((p) => p.nome === 'armadilha-invertida' && p.mordeu));
  medicao('plantas_da_celula_da_funcao_que_morderam', celula ? plantas.filter((p) => p.mordeu).length : NAO, 'o mesmo ficheiro · as plantas com mordeu', 'a cópia de controlo sem troca passou', celula?.plantas?.some((p) => p.nome === 'controlo-sem-troca' && p.passou));
  const priv = leJson(path.join(PASTA, 'privacidade.json'));
  medicao('privacidade_ficheiros_de_api_lidos', priv ? priv.api.ficheiros : NAO, 'PYTHONDONTWRITEBYTECODE=1 python3 scripts/check-privacidade.py --prova --json design/especime-v3/medicoes/s1-2026-10-02/privacidade.json', 'a chave pública da base é vista', (priv?.api?.chaves_publicas_vistas ?? 0) > 0);
  medicao('privacidade_segredos_em_api', priv ? priv.api.segredos.length : NAO, 'o mesmo ficheiro · os segredos achados em api/', 'a planta da chave secreta mordeu', priv?.api?.plantas?.some((p) => p.id === 'segredo-chave-secreta' && p.mordeu));
  medicao('privacidade_caminhos_e_nomes_em_api', priv ? priv.api.caminhos_e_nomes : NAO, 'o mesmo ficheiro · os caminhos e nomes achados em api/', 'a planta do nome do Git mordeu', priv?.api?.plantas?.some((p) => p.id === 'api-nome-do-git' && p.mordeu));
  medicao('privacidade_plantas_de_api', priv ? priv.api.plantas.length : NAO, 'o mesmo ficheiro · as plantas de api/', 'todas morderam', priv?.api?.plantas?.every((p) => p.mordeu));
  const mortos = le(path.join(PASTA, 'mortos.log'));
  const lidos = mortos?.match(/(\d+) ficheiro\(s\) lidos/);
  medicao('mortos_ficheiros_lidos', lidos ? Number(lidos[1]) : NAO, 'node scripts/check-mortos.mjs --prova > design/especime-v3/medicoes/s1-2026-10-02/mortos.log', 'a prova viu a pasta api/ e o seu morto', /a pasta api\/ lida e com o seu morto visto/.test(mortos ?? ''));
}

/* 5 · o portão de HTML e a célula dos alvos, pelas suas saídas. */
{
  const gate = le(path.join(PASTA, 'portoes/build.log')) ?? '';
  const s1 = gate.match(/S1: (\d+) porta\(s\) das sugestões em (\d+) página\(s\), (\d+) página\(s\) da caixa conferida\(s\), (\d+) endereço\(s\) lidos no mapa do sítio, (\d+) planta\(s\) em memória/);
  medicao('portao_portas_das_sugestoes', s1 ? Number(s1[1]) : NAO, 'npm run build · a linha «S1:» da saída do portão de HTML, em portoes/build.log', 'a linha diz quantas páginas leu', Boolean(s1));
  medicao('portao_paginas_lidas_pela_porta', s1 ? Number(s1[2]) : NAO, 'a mesma linha', 'as portas contadas são as páginas lidas', s1 && s1[1] === s1[2]);
  medicao('portao_paginas_da_caixa_conferidas', s1 ? Number(s1[3]) : NAO, 'a mesma linha', 'o portão leu o mapa do sítio', s1 && Number(s1[4]) > 0);
  medicao('portao_plantas_em_memoria', s1 ? Number(s1[5]) : NAO, 'a mesma linha', 'o portão correu as plantas', s1 && Number(s1[5]) > 0);
  const plantasDist = leJson(path.join(PASTA, 'plantas-portoes-s1.json'));
  medicao('plantas_do_portao_sobre_o_dist', plantasDist ? plantasDist.length : NAO, 'OEDP_MEDICOES=design/especime-v3/medicoes/s1-2026-10-02 node tests/pais/portoes.mjs --prefixo s1-', 'a planta do noindex tirado mordeu', plantasDist?.some((p) => p.nome === 's1-resultado-sem-noindex' && p.passou));
  medicao('plantas_do_portao_sobre_o_dist_que_morderam', plantasDist ? plantasDist.filter((p) => p.passou).length : NAO, 'o mesmo ficheiro · as plantas com passou', 'cada planta repôs os bytes', plantasDist?.every((p) => p.ficheiros.every((f) => f.antes === f.reposto)));
  const lista = leJson(path.join(PASTA, 'plantas-portoes-lista.json'));
  const daVoz = lista?.filter((p) => p.nome.startsWith('s1-voz-')) ?? [];
  medicao('plantas_da_sentinela_da_voz', lista ? daVoz.length : NAO, 'OEDP_MEDICOES=design/especime-v3/medicoes/s1-2026-10-02 node tests/pais/portoes.mjs --lista s1-voz-language-de-volta,s1-voz-nota-mudada-com-language', 'a palavra sozinha voltou a morder', daVoz.some((p) => p.nome === 's1-voz-language-de-volta' && p.passou));
  medicao('plantas_da_sentinela_da_voz_que_morderam', lista ? daVoz.filter((p) => p.passou).length : NAO, 'o mesmo ficheiro · as plantas com passou', 'cada planta repôs os bytes', daVoz.every((p) => p.ficheiros.every((f) => f.antes === f.reposto)));
  const alvos = leJson(path.join(PASTA, 'alvos.json'));
  const h16 = alvos?.celulas?.find((c) => c.nome === 'H16');
  const dv = alvos?.dist_varrido;
  medicao('alvos_paginas_index_lidas', dv ? dv.n : NAO, 'o mesmo ficheiro · dist_varrido.n, as páginas index.html do dist/', 'a varredura contou a porta das correções', (dv?.portaEmMarco ?? 0) > 0);
  medicao('alvos_paginas_com_a_porta_das_sugestoes_no_footer', dv ? dv.sugestoesEmMarco : NAO, 'o mesmo ficheiro · dist_varrido.sugestoesEmMarco', 'a mesma varredura vê a porta das correções no rodapé', (dv?.portaEmMarco ?? 0) > 0);
  medicao('alvos_paginas_sem_a_porta_das_sugestoes', dv ? dv.semPortaDasSugestoes : NAO, 'o mesmo ficheiro · dist_varrido.semPortaDasSugestoes', 'as páginas sem a das correções são as mesmas em número', dv && dv.semPorta === dv.semPortaDasSugestoes);
  medicao('alvos_paginas_com_a_porta_fora_do_footer', dv ? dv.sugestoesForaDeMarco + dv.sugestoesADobrar : NAO, 'o mesmo ficheiro · fora do <footer> mais as que têm mais de uma', 'a varredura leu páginas', (dv?.n ?? 0) > 0);
  medicao('alvos_rotas_medidas', alvos ? alvos.rotas.length : NAO, 'node tests/acessibilidade/alvos.mjs --json design/especime-v3/medicoes/s1-2026-10-02/alvos.json', 'a página do formulário é uma das rotas', alvos?.rotas?.includes('/sugestoes/'));
  medicao('alvos_h16_verde', h16 ? (h16.passa ? 1 : 0) : NAO, 'o mesmo ficheiro · a célula H16', 'a prova da H16 fala do campo armadilhado', /campo armadilhado/.test(h16?.prova ?? ''));
  medicao('alvos_celulas_vermelhas', alvos ? alvos.celulas.filter((c) => !c.passa).length : NAO, 'o mesmo ficheiro · as células que não passam', 'a H1 (o axe) está entre as células', alvos?.celulas?.some((c) => c.nome === 'H1'));
  const plantasAlvos = leJson(path.join(PASTA, 'alvos-plantas.json'));
  const minhas = plantasAlvos?.plantas?.filter((p) => p.nome.startsWith('sugestoes-')) ?? [];
  medicao('plantas_da_h16', plantasAlvos ? minhas.length : NAO, 'node tests/acessibilidade/alvos.mjs --vermelhos --so sugestoes- --json design/especime-v3/medicoes/s1-2026-10-02/alvos-plantas.json', 'a planta do botão a 30 px fez cair a H16', minhas.some((p) => p.nome.startsWith('sugestoes-botao') && p.caiu.includes('H16')));
  medicao('plantas_da_h16_que_pegaram', plantasAlvos ? minhas.filter((p) => p.bom).length : NAO, 'o mesmo ficheiro · as plantas com bom', 'a planta da porta no <main> mudou o HTML', minhas.some((p) => p.nome.startsWith('sugestoes-porta') && p.mudou));
}

/* 6 · a voz e o mapa do repositório. */
{
  const inv = le(path.join(RAIZ, 'design/especime-v3/INVENTARIO-FRASES.md')) ?? '';
  const s1 = inv.split('\n').filter((l) => /^\| [a-z]+ \| .* \| s1 \| viva \|/.test(l));
  medicao('linhas_do_inventario_do_bloco', s1.length, 'as linhas de design/especime-v3/INVENTARIO-FRASES.md com o bloco s1', 'a da nota portuguesa é uma delas', s1.some((l) => l.includes('O que fica guardado:')));
  const voz = le(path.join(RAIZ, 'design/especime-v3/VOZ-MARCADORES.md')) ?? '';
  const excecoes = voz.split('\n').filter((l) => /^\| contexto \|/.test(l) && /\| (sugestoes|sugestoesObrigado) \|$/.test(l));
  medicao('excecoes_de_contexto_do_bloco', excecoes.length, 'as linhas «contexto» de design/especime-v3/VOZ-MARCADORES.md com uma rota da caixa', 'a da página de onde veio é uma delas', excecoes.some((l) => l.includes('a página de onde veio')));
  const mapa = le(path.join(PASTA, 'conferir-mapa.txt')) ?? '';
  const ok = mapa.match(/citações conferidas na linha citada \(±7\): (\d+)/);
  const longe = mapa.match(/longe da linha citada: (\d+)/);
  medicao('mapa_citacoes_na_linha', ok ? Number(ok[1]) : NAO, 'python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md > conferir-mapa.txt', 'o guião diz as citações longe da linha', Boolean(longe));
  medicao('mapa_citacoes_longe_da_linha', longe ? Number(longe[1]) : NAO, 'o mesmo ficheiro', 'o guião conferiu citações', ok && Number(ok[1]) > 0);
  /* O mesmo guião sobre a árvore da base do bloco (o commit do brief), extraída para uma pasta temporária: o que já
     estava longe antes de o bloco mexer. */
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'oedp-s1-mapa-'));
  let longeNaBase = NAO, okNaBase = null;
  try {
    execFileSync('sh', ['-c', `git archive d0615da6 scripts tests src design/observatorio | tar -x -C "${tmp}"`], { cwd: RAIZ, stdio: 'ignore' });
    fs.copyFileSync(path.join(RAIZ, 'scripts/leituras/conferir-mapa.py'), path.join(tmp, 'scripts/leituras/conferir-mapa.py'));
    const saidaBase = execFileSync('python3', [path.join(tmp, 'scripts/leituras/conferir-mapa.py'), path.join(tmp, 'design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md')], { encoding: 'utf8' });
    const m = saidaBase.match(/longe da linha citada: (\d+)/);
    okNaBase = saidaBase.match(/citações conferidas na linha citada \(±7\): (\d+)/);
    longeNaBase = m ? Number(m[1]) : NAO;
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  medicao('mapa_citacoes_longe_da_linha_na_base_do_bloco', longeNaBase, 'git archive d0615da6 scripts tests src design/observatorio para uma pasta temporária, e o guião do mapa sobre ela', 'o guião conferiu citações na base', okNaBase && Number(okNaBase[1]) > 0);
  /* AS CORES DO TERMINAL SAEM ANTES DE LER: com elas, a primeira forma desta expressão deixava o código de cor comer
     o primeiro algarismo e lia 5 onde a linha diz 65. O conhecido-positivo é agora a contagem das linhas das duas
     tabelas do ficheiro das marcas, que tem de bater com o número que o portão diz. */
  const semCores = (le(path.join(PASTA, 'portoes/build.log')) ?? '').replace(/\x1b\[[0-9;]*m/g, '');
  const vozLinha = semCores.match(/voz ✓ (\d+) marcadores · (\d+) exceções/);
  const linhasDasMarcas = voz.split('\n').filter((l) => /^\| (raiz|prefixo|palavra) \|/.test(l)).length;
  const linhasDasExcecoes = voz.split('\n').filter((l) => /^\| (contexto|rota|frase|registo) \|/.test(l)).length;
  medicao('voz_marcadores', vozLinha ? Number(vozLinha[1]) : NAO, 'npm run build · a linha «voz ✓» do check:voz, em portoes/build.log, sem as cores do terminal', 'o número é o das linhas da tabela dos marcadores de VOZ-MARCADORES.md', vozLinha && Number(vozLinha[1]) === linhasDasMarcas);
  medicao('voz_excecoes', vozLinha ? Number(vozLinha[2]) : NAO, 'a mesma linha', 'o número é o das linhas da tabela das exceções de VOZ-MARCADORES.md', vozLinha && Number(vozLinha[2]) === linhasDasExcecoes);
}

/* 7 · a prova de caminho: o comportamento contra a base, e a plataforma. */
{
  const prova = leJson(path.join(PASTA, 'prova-do-caminho/respostas.json'));
  const r = prova?.respostas ?? [];
  const sextoRecusado = r.filter((x) => x.nome.startsWith('06-limite-')).findIndex((x) => x.location === routePath('sugestoesLimite', 'pt'));
  medicao('prova_pedidos', prova ? r.length : NAO, 'node design/especime-v3/medicoes/s1-2026-10-02/prova-do-caminho/prova-do-comportamento.mjs', 'o GET levou ao formulário', r.some((x) => x.nome === '01-get' && x.location === routePath('sugestoes', 'pt')));
  medicao('prova_envios_guardados_pela_base', prova ? prova.envios_que_a_base_guardou.length : NAO, 'o mesmo ficheiro · os envios a que a base respondeu 200', 'o bom em português foi guardado', prova?.envios_que_a_base_guardou?.some((e) => e.nome === '04-boa-pt'));
  medicao('prova_chamadas_a_base_da_armadilha_e_da_vazia', prova ? r.filter((x) => ['02-armadilha', '03-vazia'].includes(x.nome)).reduce((t, x) => t + x.chamadas_a_base, 0) : NAO, 'o mesmo ficheiro · as chamadas à base da armadilha e da vazia', 'o bom em inglês chamou a base', r.some((x) => x.nome === '05-boa-en' && x.chamadas_a_base === 1));
  medicao('prova_primeiro_dos_seis_recusado', prova ? sextoRecusado + 1 : NAO, 'o mesmo ficheiro · o primeiro dos seis envios seguidos que a função mandou para a página do limite', 'a base respondeu «limite» a esse envio', r.some((x) => x.respostas_da_base.some((c) => c.devolveu === 'limite')));
  medicao('prova_envios_antes_dos_seis_na_mesma_marca', prova ? r.filter((x) => ['04-boa-pt', '05-boa-en'].includes(x.nome) && x.chamadas_a_base === 1).length : NAO, 'o mesmo ficheiro · os envios bons que somaram à mesma marca antes dos seis', 'os dois foram para o obrigado', r.filter((x) => ['04-boa-pt', '05-boa-en'].includes(x.nome)).every((x) => x.estado === 303));
  const inspect = le(path.join(PASTA, 'prova-do-caminho/vercel-inspect.txt')) ?? '';
  medicao('plataforma_funcao_em_dub1', /api\/sugestoes.*\[dub1\]/.test(inspect) ? 1 : 0, 'vercel inspect <endereço da pré-visualização>, gravado em prova-do-caminho/vercel-inspect.txt', 'o ficheiro diz o estado da implantação', /Ready|Error|Building/.test(inspect));
}

/* 8 · as capturas, os portões e o custo. */
{
  const cap = leJson(path.join(PASTA, 'capturas-s1.json'));
  medicao('capturas', cap ? cap.capturas : NAO, 'node design/especime-v3/medicoes/s1-2026-10-02/captar-s1.mjs · o manifesto capturas-s1.json', 'a do formulário português a 390 está lá', cap?.resultados?.some((x) => x.ficheiro.endsWith('s1-formulario-pt-390.png')));
  medicao('capturas_problemas', cap ? cap.problemas.length : NAO, 'o mesmo manifesto · os problemas', 'o manifesto diz os pedidos de fora recusados', typeof cap?.pedidos_recusados_para_fora === 'number');
  for (const g of ['build', 'verify', 'typecheck']) {
    const c = le(path.join(PASTA, `portoes/${g}.codigo`));
    medicao(`portao_${g}_codigo`, c === null ? NAO : Number(c.trim()), `sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/s1-2026-10-02/portoes · portoes/${g}.codigo`, 'a pasta tem a cabeça da corrida', fs.existsSync(path.join(PASTA, 'portoes/cabeca')));
  }
  const ini = leJson(path.join(PASTA, 'custo-inicio.json'));
  const fim = leJson(path.join(PASTA, 'custo-fim.json'));
  medicao('simbolos_gastos', ini && fim ? ini.simbolos_restantes_no_inicio - fim.simbolos_restantes_no_fim : NAO, 'custo-inicio.json menos custo-fim.json, o contador que a ferramenta mostra ao construtor', 'os dois ficheiros dizem de onde vem o número', Boolean(ini?.o_que && fim?.o_que));
  const segundos = ini && fim ? Math.round((Date.parse(fim.fim_utc) - Date.parse(ini.inicio_utc)) / 1000) : null;
  medicao('segundos_de_parede', segundos ?? NAO, 'fim_utc de custo-fim.json menos inicio_utc de custo-inicio.json', 'o início vem de um relógio lido', Boolean(ini?.inicio_origem));
}

/* 9 · A PASSAGEM S1-b (03.10.2026): cada ponto da mensagem do lugar de direção, pelas suas provas. */
{
  const B = (f) => path.join(PASTA, f);
  const celula = leJson(B('celula-da-funcao-b.json'));
  const plantas = celula?.plantas?.filter((x) => x.nome !== 'controlo-sem-troca') ?? [];
  medicao('s1b_casos_da_celula_da_funcao', celula ? celula.casos.length : NAO, 'node tests/sugestoes/funcao.mjs --prova --json design/especime-v3/medicoes/s1-2026-10-02/celula-da-funcao-b.json', 'o caso da chave em falta está entre os casos e passa', celula?.casos?.some((c) => c.caso === 'sem-chave' && c.passou));
  medicao('s1b_casos_da_celula_da_funcao_verdes', celula ? celula.casos.filter((c) => c.passou).length : NAO, 'o mesmo ficheiro · os casos com passou', 'o caso da marca de hora a hora passa', celula?.casos?.some((c) => c.caso === 'marca-de-hora-a-hora' && c.passou));
  medicao('s1b_plantas_da_celula_da_funcao', celula ? plantas.length : NAO, 'o mesmo ficheiro · as plantas além do controlo', 'a planta da chave invertida mordeu com a queixa esperada', plantas.some((x) => x.nome === 'chave-invertida' && x.mordeu));
  medicao('s1b_plantas_da_celula_que_morderam_com_a_queixa', celula ? plantas.filter((x) => x.mordeu).length : NAO, 'o mesmo ficheiro · as plantas que morderam com a queixa que nomeiam', 'a planta da fuga do sal mordeu', plantas.some((x) => x.nome === 'fuga-do-sal' && x.mordeu));

  const { estadoDasMigracoes, plantasDaCaixa, conferirRegrasDaBase } = await import(pathToFileURL(path.join(RAIZ, 'scripts/sugestoes-do-portao.mjs')).href);
  const pastaDaBase = path.join(RAIZ, 'supabase/migrations');
  const migracoes = fs.readdirSync(pastaDaBase).filter((f) => f.endsWith('.sql')).sort().map((nome) => ({ nome, sql: fs.readFileSync(path.join(pastaDaBase, nome), 'utf8') }));
  const estado = estadoDasMigracoes(migracoes);
  const vivas = [...estado.funcoes.values()];
  medicao('s1b_migracoes_lidas', migracoes.length, 'ls supabase/migrations/*.sql, lidas por ordem de nome por estadoDasMigracoes() de scripts/sugestoes-do-portao.mjs', 'a segunda migração está entre as lidas', estado.ficheiros.includes('2026-10-03-chave-tranca-e-marca-horaria.sql'));
  medicao('s1b_funcoes_vivas_no_fim_das_migracoes', vivas.length, 'estadoDasMigracoes() · as funções enviar_sugestao vivas no fim', 'a viva tem a chave como primeiro parâmetro', vivas.every((f) => /^p_chave\s/.test(f.parametros)));
  medicao('s1b_tarefas_vivas_no_fim_das_migracoes', estado.tarefas.size, 'estadoDasMigracoes() · as tarefas do pg_cron vivas no fim', 'a das marcas de hora a hora está viva', estado.tarefas.has('sugestoes-marcas'));
  const erradas = conferirRegrasDaBase(migracoes);
  const plantasDaCaixaB = plantasDaCaixa(migracoes);
  medicao('s1b_regras_em_falta', erradas.length, 'conferirRegrasDaBase() de scripts/sugestoes-do-portao.mjs sobre as migrações', 'as plantas das regras correm sobre as mesmas migrações', plantasDaCaixaB.length > 0);
  medicao('s1b_plantas_em_memoria_da_caixa', plantasDaCaixaB.length, 'plantasDaCaixa() de scripts/sugestoes-do-portao.mjs, que o portão de HTML corre em cada corrida', 'a planta da chave tirada é uma delas e mordeu', plantasDaCaixaB.some((x) => x.nome === 'regras-chave-tirada' && x.mordeu));
  medicao('s1b_plantas_em_memoria_da_caixa_que_morderam', plantasDaCaixaB.filter((x) => x.mordeu).length, 'a mesma função · as plantas que morderam', 'a planta da limpeza tirada mordeu', plantasDaCaixaB.some((x) => x.nome === 'regras-limpeza-tirada' && x.mordeu));

  const priv = leJson(B('privacidade-b.json'));
  medicao('s1b_privacidade_plantas_de_api', priv ? priv.api.plantas.length : NAO, 'PYTHONDONTWRITEBYTECODE=1 python3 scripts/check-privacidade.py --prova --json design/especime-v3/medicoes/s1-2026-10-02/privacidade-b.json', 'a planta do sal entre aspas mordeu', priv?.api?.plantas?.some((x) => x.id === 'segredo-sal-entre-aspas' && x.mordeu));
  medicao('s1b_privacidade_plantas_de_api_que_morderam', priv ? priv.api.plantas.filter((x) => x.mordeu).length : NAO, 'o mesmo ficheiro · as plantas de api/ que morderam', 'a planta da chave entre aspas mordeu', priv?.api?.plantas?.some((x) => x.id === 'segredo-chave-entre-aspas' && x.mordeu));
  medicao('s1b_privacidade_segredos_em_api', priv ? priv.api.segredos.length : NAO, 'o mesmo ficheiro · os segredos achados em api/', 'a chave pública da base foi vista', (priv?.api?.chaves_publicas_vistas ?? 0) > 0);

  const prefixo = leJson(B('plantas-b/plantas-portoes-s1.json'));
  medicao('s1b_plantas_sobre_o_dist_do_prefixo_s1', prefixo ? prefixo.length : NAO, 'OEDP_MEDICOES=design/especime-v3/medicoes/s1-2026-10-02/plantas-b node tests/pais/portoes.mjs --prefixo s1-, sobre a construção da passagem', 'a planta do campo a mais mordeu', prefixo?.some((x) => x.nome === 's1-campo-a-mais' && x.passou));
  medicao('s1b_plantas_sobre_o_dist_do_prefixo_s1_que_morderam', prefixo ? prefixo.filter((x) => x.passou && x.ficheiros.every((f) => f.antes === f.reposto)).length : NAO, 'o mesmo ficheiro · as plantas que morderam com a queixa e repuseram os bytes', 'a planta do mapa com uma página do resultado mordeu', prefixo?.some((x) => x.nome === 's1-mapa-com-resultado' && x.passou));
  const lista = leJson(B('plantas-b/plantas-portoes-lista.json'));
  medicao('s1b_plantas_da_lista_que_morderam', lista ? lista.filter((x) => x.passou && x.ficheiros.every((f) => f.antes === f.reposto)).length : NAO, 'OEDP_MEDICOES=design/especime-v3/medicoes/s1-2026-10-02/plantas-b node tests/pais/portoes.mjs --lista s1-voz-language-de-volta,s1-voz-nota-mudada-com-language,s1b-limite-antigo-de-volta', 'a planta da frase antiga do limite mordeu', lista?.some((x) => x.nome === 's1b-limite-antigo-de-volta' && x.passou));
  const alvos = leJson(B('alvos-b.json'));
  const dv = alvos?.dist_varrido;
  const semS = new Set(dv?.paginasSemPortaDasSugestoes ?? []);
  const semC = new Set(dv?.paginasSemPortaDasCorrecoes ?? []);
  medicao('s1b_alvos_h16_verde', alvos ? (alvos.celulas.find((c) => c.nome === 'H16')?.passa ? 1 : 0) : NAO, 'node tests/acessibilidade/alvos.mjs --json design/especime-v3/medicoes/s1-2026-10-02/alvos-b.json · a célula H16', 'a varredura guardou as páginas sem cada porta', Array.isArray(dv?.paginasSemPortaDasSugestoes));
  medicao('s1b_alvos_paginas_so_sem_uma_das_portas', dv ? [...semS].filter((x) => !semC.has(x)).length + [...semC].filter((x) => !semS.has(x)).length : NAO, 'o mesmo ficheiro · as páginas que estão num conjunto e não no outro', 'os dois conjuntos têm páginas (os documentos alojados)', semS.size > 0 && semC.size > 0);
  medicao('s1b_alvos_celulas_vermelhas', alvos ? alvos.celulas.filter((c) => !c.passa).length : NAO, 'o mesmo ficheiro · as células que não passam', 'a H16 está entre as células', alvos?.celulas?.some((c) => c.nome === 'H16'));
  const plantasAlvos = leJson(B('alvos-plantas-b.json'));
  const identidades = plantasAlvos?.plantas?.find((x) => x.nome.startsWith('sugestoes-identidades'));
  medicao('s1b_planta_das_identidades_pegou', plantasAlvos ? (identidades?.bom ? 1 : 0) : NAO, 'node tests/acessibilidade/alvos.mjs --vermelhos --so sugestoes-identidades --json design/especime-v3/medicoes/s1-2026-10-02/alvos-plantas-b.json', 'a H16 caiu com ela', identidades?.caiu?.includes('H16'));

  const deploy = (le(B('verify-deploy-b.log')) ?? '').replace(/\x1b\[[0-9;]*m/g, '');
  const controlosVerdes = (deploy.match(/^\s*✓ controlo gravado/gm) ?? []).length;
  medicao('s1b_verify_deploy_controlos_gravados_verdes', controlosVerdes, 'node scripts/verify-deploy.mjs > design/especime-v3/medicoes/s1-2026-10-02/verify-deploy-b.log · as linhas «controlo gravado» com ✓', 'o mesmo registo tem a pergunta da região da função no ar', /api\/sugestoes região da função/.test(deploy));
  medicao('s1b_verify_deploy_controlos_gravados_vermelhos', (deploy.match(/^\s*✗ controlo gravado/gm) ?? []).length, 'o mesmo registo · as linhas «controlo gravado» com ✗', 'o registo tem linhas do controlo', controlosVerdes > 0);

  const prova = leJson(B('prova-do-caminho/respostas-b.json'));
  const rr = prova?.respostas ?? [];
  const seis = rr.filter((x) => x.nome.startsWith('09-limite-'));
  medicao('s1b_prova_pedidos', prova ? rr.length : NAO, 'node design/especime-v3/medicoes/s1-2026-10-02/prova-do-caminho/prova-do-comportamento-b.mjs', 'o guião diz que a base real não foi chamada', prova?.base_real_chamada === false);
  medicao('s1b_prova_envios_guardados_pela_base_simulada', prova ? prova.envios_guardados_pela_base_simulada.length : NAO, 'o mesmo ficheiro · os envios a que a base simulada respondeu «guardou»', 'o bom em português foi guardado com a página do ?de=', rr.some((x) => x.nome === '04-boa-pt' && x.base_simulada.some((b) => b.guardou?.pagina === '/lugares/evora')));
  medicao('s1b_prova_chamadas_a_base_sem_ip_e_sem_chave', prova ? rr.filter((x) => ['07-sem-ip', '08-sem-chave'].includes(x.nome)).reduce((s, x) => s + x.chamadas_a_base, 0) : NAO, 'o mesmo ficheiro · as chamadas à base dos pedidos sem endereço e sem chave', 'os dois foram para o não chegou', rr.filter((x) => ['07-sem-ip', '08-sem-chave'].includes(x.nome)).every((x) => x.location === routePath('sugestoesNaoChegou', 'pt')));
  medicao('s1b_prova_primeiro_dos_seis_recusado', prova ? seis.findIndex((x) => x.location === routePath('sugestoesLimite', 'pt')) + 1 : NAO, 'o mesmo ficheiro · o primeiro dos seis seguidos que a função mandou para a página do limite', 'a base simulada respondeu «limite» a esse envio', seis.some((x) => x.base_simulada.some((b) => b.respondeu === 'limite')));
  medicao('s1b_prova_marcas_vivas_depois_da_hora_mudar', prova ? (rr.find((x) => x.nome === '10-hora-seguinte')?.base_simulada?.[0]?.guardou?.marcas_vivas ?? NAO) : NAO, 'o mesmo ficheiro · as marcas vivas na base simulada depois do envio da hora seguinte', 'o envio da hora seguinte foi guardado', rr.some((x) => x.nome === '10-hora-seguinte' && x.location === routePath('sugestoesObrigado', 'pt')));

  /* O identificador da equipa da Vercel, procurado nos ficheiros do bloco sem estar escrito neste guião: lê-se do
     registo do lugar de direção tal como estava antes da redação (a cabeça 7fdd4794), pela forma do endereço. */
  const antigo = execFileSync('git', ['show', '7fdd4794:design/especime-v3/medicoes/s1-2026-10-02/prova-do-caminho-do-lugar-de-direcao/vercel-inspect.txt'], { cwd: RAIZ, encoding: 'utf8' });
  const equipa = (antigo.match(/o-estado-do-pais-[a-z0-9]+-([a-z0-9-]+)\.vercel\.app/) ?? [])[1] ?? null;
  const doBloco = execFileSync('git', ['ls-files', 'design/especime-v3/medicoes/s1-2026-10-02', 'api', 'tests/sugestoes', 'scripts/sugestoes-do-portao.mjs', 'scripts/verify-deploy.mjs', 'scripts/verify-deploy-regioes.json', 'src/data/sugestoes.mjs'], { cwd: RAIZ, encoding: 'utf8' }).split('\n').filter(Boolean);
  const comEquipa = equipa ? doBloco.filter((f) => (le(path.join(RAIZ, f)) ?? '').includes(equipa)) : [];
  medicao('s1b_ficheiros_do_bloco_com_o_identificador_da_equipa', equipa ? comEquipa.length : NAO, 'o identificador lido do registo antigo do lugar de direção (git show 7fdd4794), procurado nos ficheiros seguidos do bloco', 'o mesmo identificador é achado num ficheiro de outro bloco (BRIEF-decisoes-2026-08-20.md)', equipa && (le(path.join(RAIZ, 'BRIEF-decisoes-2026-08-20.md')) ?? '').includes(equipa));
  medicao('s1b_ficheiros_do_bloco_lidos_na_procura', doBloco.length, 'git ls-files dos caminhos do bloco', 'o guião da prova da plataforma está entre eles', doBloco.includes('design/especime-v3/medicoes/s1-2026-10-02/prova-do-caminho/prova-da-plataforma.sh'));

  /* O nome que a redação do guião do S1 trazia (o princípio do identificador, lido da versão anterior à passagem e
     nunca escrito aqui), nos ficheiros do bloco; e as versões da história do ramo com o identificador ou o nome. */
  const guiaoAntigo = execFileSync('git', ['show', 'cc93092c~1:design/especime-v3/medicoes/s1-2026-10-02/prova-do-caminho/prova-da-plataforma.sh'], { cwd: RAIZ, encoding: 'utf8' });
  const nomeAntigo = (guiaoAntigo.match(/sed -E 's\/([a-z0-9-]+)\[-a-z0-9\]\*\/<equipa>/) ?? [])[1] ?? null;
  const comNome = nomeAntigo ? doBloco.filter((f) => (le(path.join(RAIZ, f)) ?? '').includes(nomeAntigo)) : [];
  medicao('s1b_ficheiros_do_bloco_com_o_nome_da_equipa_do_s1', nomeAntigo ? comNome.length : NAO, 'o nome lido da redação do guião do S1 (git show cc93092c~1), procurado nos ficheiros seguidos do bloco', 'o mesmo nome é achado num ficheiro de outro bloco (BRIEF-decisoes-2026-08-20.md), e é o princípio do identificador', Boolean(nomeAntigo) && Boolean(equipa?.startsWith(nomeAntigo)) && (le(path.join(RAIZ, 'BRIEF-decisoes-2026-08-20.md')) ?? '').includes(nomeAntigo));
  const versoes = [];
  if (equipa && nomeAntigo) {
    for (const c of execFileSync('git', ['rev-list', '--reverse', `${BASE_DO_BLOCO}..HEAD`], { cwd: RAIZ, encoding: 'utf8' }).split('\n').filter(Boolean)) {
      for (const f of execFileSync('git', ['diff-tree', '--no-commit-id', '--name-only', '-r', c], { cwd: RAIZ, encoding: 'utf8' }).split('\n').filter(Boolean)) {
        let texto;
        try { texto = execFileSync('git', ['show', `${c}:${f}`], { cwd: RAIZ, encoding: 'utf8', maxBuffer: 1 << 30, stdio: ['ignore', 'pipe', 'ignore'] }); } catch { continue; }
        if (texto.includes(equipa) || texto.includes(nomeAntigo)) versoes.push({ commit: c.slice(0, 8), ficheiro: f });
      }
    }
  }
  medicao('s1b_versoes_da_historia_do_ramo_com_o_nome_da_equipa', equipa && nomeAntigo ? versoes.length : NAO, `cada ficheiro mudado em cada commit de ${BASE_DO_BLOCO}..HEAD (git diff-tree e git show), com o identificador ou o nome`, 'o registo do lugar de direção no commit do brief é uma delas', versoes.some((v) => v.commit === 'd0615da6'));
  medidas.at(-1).versoes = versoes;

  /* As horas dos envios de ensaio no relatório, ao segundo do registo (o achado 15). */
  const relatorio = le(path.join(PASTA, 'LEIA-ME.md')) ?? '';
  const envios = leJson(B('prova-do-caminho/respostas.json'))?.envios_que_a_base_guardou ?? [];
  const certos = envios.filter((e) => relatorio.split('\n').some((l) => l.includes(e.id) && l.includes(e.hora_utc.slice(11, 19)))).length;
  medicao('s1b_envios_de_ensaio_com_a_hora_do_registo_no_relatorio', certos, 'as linhas do LEIA-ME.md com o identificador de cada envio guardado e a sua hora de respostas.json', 'o registo tem os envios guardados', envios.length > 0);

  for (const g of ['build', 'verify', 'typecheck']) {
    const c = le(B(`portoes-b/${g}.codigo`));
    medicao(`s1b_portao_${g}_codigo`, c === null ? NAO : Number(c.trim()), `sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/s1-2026-10-02/portoes-b · portoes-b/${g}.codigo`, 'a pasta tem a cabeça da corrida', fs.existsSync(B('portoes-b/cabeca')));
  }
  /* A cabeça da corrida final: a mesma no princípio e no fim, a que o portão da construção construiu, uma antepassada
     da cabeça em que o guião corre, e nenhum ficheiro mudado durante a corrida além da própria pasta da corrida. */
  const cabecaDaCorrida = (le(B('portoes-b/cabeca')) ?? '').trim();
  const cabecaNoFim = (le(B('portoes-b/cabeca.fim')) ?? '').trim();
  const construida = leJson(path.join(RAIZ, 'dist/version.json'))?.commit ?? null;
  const antepassada = (de) => { try { execFileSync('git', ['merge-base', '--is-ancestor', de, 'HEAD'], { cwd: RAIZ }); return true; } catch { return false; } };
  const estadoNoFim = le(B('portoes-b/estado.fim'));
  const mudadosNaCorrida = estadoNoFim === null ? null : estadoNoFim.split('\n').filter((l) => l.trim() && !l.includes('design/especime-v3/medicoes/s1-2026-10-02/portoes-b/'));
  medicao('s1b_portao_cabeca_igual_no_fim', cabecaDaCorrida ? (cabecaDaCorrida === cabecaNoFim ? 1 : 0) : NAO, 'portoes-b/cabeca contra portoes-b/cabeca.fim, as duas escritas por portoes.sh', 'a cabeça da corrida é um commit do histórico', Boolean(cabecaDaCorrida) && antepassada(cabecaDaCorrida));
  medicao('s1b_portao_cabeca_e_a_construida', cabecaDaCorrida && construida ? (construida === cabecaDaCorrida ? 1 : 0) : NAO, 'dist/version.json, o campo commit, contra portoes-b/cabeca', 'o ficheiro da construção tem commit', Boolean(construida));
  medicao('s1b_portao_cabeca_antepassada_da_atual', cabecaDaCorrida ? (antepassada(cabecaDaCorrida) ? 1 : 0) : NAO, 'git merge-base --is-ancestor <portoes-b/cabeca> HEAD', 'a cabeça atual é antepassada de si própria', antepassada('HEAD'));
  medicao('s1b_portao_ficheiros_mudados_durante_a_corrida', mudadosNaCorrida === null ? NAO : mudadosNaCorrida.length, 'as linhas de portoes-b/estado.fim (git status --short no fim da corrida) que não são a pasta da própria corrida', 'a pasta da corrida aparece no estado do fim', (estadoNoFim ?? '').includes('portoes-b/'));
  const ini = leJson(B('custo-inicio-b.json'));
  const fim = leJson(B('custo-fim-b.json'));
  medicao('s1b_simbolos_gastos', ini && fim ? ini.simbolos_restantes_no_inicio - fim.simbolos_restantes_no_fim : NAO, 'custo-inicio-b.json menos custo-fim-b.json, o contador que a ferramenta mostra ao construtor', 'os dois ficheiros dizem de onde vem o número', Boolean(ini?.o_que && fim?.o_que));
  medicao('s1b_segundos_de_parede', ini && fim ? Math.round((Date.parse(fim.fim_utc) - Date.parse(ini.inicio_utc)) / 1000) : NAO, 'fim_utc de custo-fim-b.json menos inicio_utc de custo-inicio-b.json', 'o início vem de um relógio lido', Boolean(ini?.inicio_origem));
}

const saida = { bloco: 'S1', guiao: 'design/especime-v3/medicoes/s1-2026-10-02/medir-s1.mjs', cabeca: git('rev-parse', 'HEAD'), medidas };
fs.writeFileSync(path.join(PASTA, 'medidas.json'), JSON.stringify(saida, null, 2) + '\n');
const naoLidas = medidas.filter((m) => m.valor === NAO).map((m) => m.nome);
const semPositivo = medidas.filter((m) => !m.conhecido_positivo.encontrado).map((m) => m.nome);
console.log(`${medidas.length} medidas · não lidas: ${naoLidas.join(', ') || 'nenhuma'} · sem conhecido-positivo: ${semPositivo.join(', ') || 'nenhuma'}`);
process.exitCode = naoLidas.length || semPositivo.length ? 1 : 0;
