import fs from 'node:fs';
import { SECOES } from '../src/data/metodo.mjs';
import { lugarDaIncorporacao } from '../src/lib/lugar-da-incorporacao.mjs';
import { leituraDaIncorporacao, conferirDataDaIncorporacao } from '../src/lib/leitura-da-incorporacao.mjs';
/* Leitura do ER1 pelos portões. Partilha a regra da leitura, mas não o
   compositor do código nem o do JSON. Os nomes e as traduções são declarações comuns; os campos, as datas,
   os bytes e a escolha da releitura são recontados aqui. */
import { allClaims, provenienciaIncompleta } from '../src/lib/ledger.mjs';
import { nomeNoRecibo } from '../src/lib/o-que-e-o-numero.mjs';
import { unidadeDaLinha } from '../src/i18n/unidades.mjs';
import { linguaDaFonte } from '../src/i18n/lingua-dos-titulos.mjs';
import { dataDaCasa } from '../src/lib/datas.mjs';
import { t } from '../src/i18n/strings.mjs';
import { LICENCA } from '../src/data/licenca.mjs';
import { SITE_HOST_DISPLAY } from '../site.config.mjs';
import { parse } from 'node-html-parser';
const leiturasLiterais = new WeakSet();

/* O textarea é texto literal, como no navegador. O analisador genérico elimina
   comentários, o que faria comparar menos caracteres do que o botão copia. */
export function lerPaginaComCodigo(html, opcoes = {}) {
  const blocos = opcoes.blockTextElements ?? { script: true, noscript: true, style: true, pre: true };
  const root = parse(html, { ...opcoes, blockTextElements: { ...blocos, textarea: true } });
  leiturasLiterais.add(root);
  return root;
}
const linhas = new Map(allClaims().map(c => [c.id, c]));
const escape = x => String(x ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');

export function dadosEsperados(c, lang) {
  const palavras = t(lang).incorporar;
  const un = unidadeDaLinha(c.unit, lang);
  const lugar = lugarDaIncorporacao(c, lang);
  let mudanca = '';
  for (const entrada of c.corrections ?? []) {
    if (entrada.kind !== 'proveniencia' && entrada.new_value === c.value && entrada.date > mudanca) mudanca = entrada.date;
  }
  let dia = /^\d{4}-\d{2}-\d{2}$/.test(c.access_date ?? '') ? c.access_date : '';
  for (const entrada of c.verifications ?? []) {
    if (entrada.result === 'igual' && entrada.date >= mudanca && entrada.date > dia) dia = entrada.date;
  }
  return {
    nome: nomeNoRecibo(c.id, lang).texto + (lugar ? ` · ${lugar.nome}` : ''),
    periodo: c.reference_date ? dataDaCasa(c.reference_date, lang) : palavras.periodoEmFalta,
    valor: String(c.value), unidade: un.texto, unidadeLang: un.lingua || t(lang).lang,
    fonte: c.source || palavras.calculado, fonteLang: (c.source && linguaDaFonte(c.source, lang)) || t(lang).lang,
    data: dia, leitura: leituraDaIncorporacao(c, lang, dia),
    atribuicao: LICENCA ? LICENCA.atribuicao + ', ' + LICENCA.nome : '',
    notas: [c[lang === 'en' ? 'source_flag_note_en' : 'source_flag_note'], c[lang === 'en' ? 'ressalva_en' : 'ressalva']].filter(Boolean).join(' '),
    atualizacao: mudanca ? palavras.atualizado + ' ' + dataDaCasa(mudanca, lang) : '',
  };
}

// ER1-d: a elegibilidade vem da definição única do livro, também usada pelo Método.
export function provenienciaConfirmada(c) {
  return Boolean(c && !provenienciaIncompleta(c));
}

export function codigoEsperado(c, lang) {
  const d = dadosEsperados(c, lang);
  const origem = 'https://' + SITE_HOST_DISPLAY;
  const href = origem + (lang === 'en' ? '/en/ledger/' : '/livro-razao/') + c.id;
  const lido = leituraDaIncorporacao(c, lang);
  const valor = c.texto_documental === true ? `<span lang="pt-PT">${escape(c.value)}</span>` : escape(c.value);
  return `<p class="oedp-numero" lang="${t(lang).lang}" data-oedp="${escape(c.id)}" data-oedp-valor="${escape(c.value)}" data-oedp-lido="${escape(c.access_date)}"><a href="${href}">${escape(d.nome)}, ${escape(d.periodo)}: ${valor} <span lang="${d.unidadeLang}">${escape(d.unidade)}</span></a> · <span lang="${d.fonteLang}">${escape(d.fonte)}</span>${d.fonte === lido ? '' : ', ' + escape(lido)} · ${escape(d.atribuicao)}${d.notas ? ` · <span>${escape(d.notas)}</span>` : ''}</p><script async src="${origem}/incorporar.js" referrerpolicy="no-referrer" crossorigin="anonymous"></script>`;
}

/* Os estados condicionais também têm palavras aprovadas. Não se tornam
   frases vivas obrigatórias em páginas onde o estado não ocorre. */
export function conferirInventarioIncorporacao(texto) {
  const erros = [];
  const cadeias = Object.entries(t('pt').incorporar).map(([chave, pt]) =>
    ['incorporar.'+chave, pt, t('en').incorporar[chave]]);
  // ME1 (15.10.2026): a porta do recibo de exemplo vive na secção do recibo de cada número.
  const exemplo = SECOES.find(r => r.id === 'livro-razao').ligacoes.find(l => l.rota === 'linha');
  cadeias.push(['metodo.exemplo', exemplo.rotulo.pt, exemplo.rotulo.en]);
  for (const [chave, pt, en] of cadeias) {
    const linha = '| `' + chave + '` | ' + pt + ' | ' + en + ' |';
    if (!texto.split('\n').some(l => l.startsWith(linha)))
      erros.push('ER1 inventário: falta a cadeia aprovada ' + chave + ' nas duas edições.');
  }
  return erros;
}
const errosDoInventario = conferirInventarioIncorporacao(fs.readFileSync(new URL('../design/especime-v3/INVENTARIO-FRASES.md', import.meta.url), 'utf8'));

export function conferirExemploNoMetodo(root, lang) {
  const href = (lang === 'en' ? '/en/ledger/' : '/livro-razao/') + 'divida-publica-2025';
  // ME1 (15.10.2026): as palavras da porta são as do mandato do bloco, escritas aqui e não importadas.
  const texto = lang === 'en' ? 'See an example receipt' : 'Ver um recibo de exemplo';
  return root.querySelectorAll('#livro-razao a').some(a => a.getAttribute('href') === href && a.textContent.trim() === texto + ' →')
    ? [] : ['ER1 Método: falta a porta para o recibo de exemplo da edição.'];
}

export function conferirCodigo(root, rota, livro = linhas) {
  const erros = [...errosDoInventario, ...(rota?.key === 'metodo' ? conferirExemploNoMetodo(root, rota.lang) : [])];
  const campos = root.querySelectorAll('[data-incorporar-codigo]');
  if (campos.length && !leiturasLiterais.has(root)) erros.push('ER1 código: falta a leitura literal do campo.');
  const linha = rota?.key === 'linha' ? livro.get(rota.params.slug) : null;
  if (linha && conferirDataDaIncorporacao(linha).length) return [...erros, ...conferirDataDaIncorporacao(linha)];
  for (const campo of campos) if (/\[a verificar\]/i.test(campo.textContent))
    erros.push('ER1 código: uma marca por confirmar não se incorpora.');
  if (linha && LICENCA && !provenienciaConfirmada(linha)) {
    if (campos.length || root.querySelector('[data-incorporar-bloco] textarea, [data-incorporar-bloco] button'))
      erros.push('ER1 código: proveniência por confirmar oferece código.');
    const blocos = root.querySelectorAll('[data-incorporar-bloco]');
    const aviso = blocos[0]?.querySelector('[data-incorporar-aviso]');
    if (blocos.length !== 1 || aviso?.textContent !== t(rota.lang).incorporar.indisponivel ||
        blocos[0]?.querySelector('.linha-campo-k')?.textContent !== t(rota.lang).incorporar.titulo)
      erros.push('ER1 aviso: falta a recusa de incorporação da edição.');
    return erros;
  }
  if (linha && LICENCA && campos.length !== 1) erros.push('ER1 código: falta o único código do recibo.');
  if (linha && LICENCA) {
    const blocos = root.querySelectorAll('[data-incorporar-bloco]');
    const bloco = blocos[0];
    if (bloco?.querySelector('textarea') !== campos[0])
      erros.push('ER1 código: o campo conferido não é o que o botão copia.');
    const label = bloco?.querySelector('label');
    const botao = bloco?.querySelector('button');
    const s = t(rota.lang).incorporar;
    if (blocos.length !== 1 || bloco.querySelectorAll('textarea').length !== 1 ||
        label?.textContent !== s.titulo || label?.getAttribute('for') !== 'codigo-incorporar' ||
        bloco.querySelector('textarea')?.getAttribute('id') !== 'codigo-incorporar' ||
        botao?.textContent !== s.copiar || botao?.getAttribute('data-copiado') !== s.copiado ||
        botao?.getAttribute('data-selecionado') !== s.selecionado)
      erros.push('ER1 comando: o rótulo ou a cópia não corresponde à edição.');
  }
  for (const campo of campos) {
    if (!linha || !LICENCA || campo.getAttribute('data-incorporar-codigo') !== linha.id ||
        campo.rawTagName !== 'textarea' || !campo.hasAttribute('readonly') || campo.childNodes.some(n => n.nodeType === 1)) {
      erros.push('ER1 código: marca fora do campo do recibo da própria linha.');
    } else if (linha.texto_documental && campo.getAttribute('lang') !== 'pt-PT') {
      erros.push('ER1 código: a transcrição portuguesa exige a língua declarada no campo de cópia.');
    } else if (campo.textContent !== codigoEsperado(linha, rota.lang)) {
      erros.push('ER1 código: o pedaço difere da linha, carácter a carácter.');
    }
  }
  return erros;
}

export function conferirJson(doc, c, lang) {
  const errosData = conferirDataDaIncorporacao(c);
  if (errosData.length) return errosData;
  if (doc?.linha?.id !== c.id || doc?.linha?.value !== c.value)
    return ['ER1 JSON: a apresentação difere da linha.'];
  const presente = Object.hasOwn(doc ?? {}, 'incorporacao');
  if (!provenienciaConfirmada(c)) return presente
    ? ['ER1 JSON: proveniência por confirmar oferece incorporação.'] : [];
  if (!presente) return ['ER1 JSON: falta a incorporação da linha com código.'];
  const d = doc?.incorporacao?.[lang];
  const esperado = dadosEsperados(c, lang);
  return doc?.linha?.id === c.id && doc?.linha?.value === c.value && d &&
    Object.keys(d).length === Object.keys(esperado).length &&
    Object.entries(esperado).every(([k,v])=>d[k]===v)
    ? [] : ['ER1 JSON: a apresentação difere da linha.'];
}

/* A retirada do código da prosa só acontece depois da comparação integral,
   na mesma corrida de cada portão que a usa. Uma marca falsa não é dispensa. */
export function tirarCodigoConferido(root, rota) {
  const erros = conferirCodigo(root, rota);
  if (erros.length) throw Error(erros.join('\n'));
  for (const campo of root.querySelectorAll('[data-incorporar-codigo]')) campo.remove();
}

export function conferirCors(respostas) {
  const erros = [];
  for (const r of respostas) {
    const permitido = /^\/livro-razao\/[^/]+\.json$/.test(r.caminho) ||
      ['/livro-razao.json','/livro-razao.csv','/incorporar.js'].includes(r.caminho);
    // A Vercel envia Access-Control-Allow-Origin: * em todas as respostas de ficheiros
    // estáticos (medido a 12.10.2026 no sítio, no 404 e no robots.txt, e em react.dev,
    // nextjs.org e vercel.com): a conferência exige o cabeçalho nos quatro caminhos do
    // recibo incorporável e não afirma a sua ausência nos outros (§1.184, terceiro acrescento).
    if (r.estado !== 200 || (permitido && r.cors !== '*'))
      erros.push(`ER1 CORS: ${r.caminho} tem estado ou cabeçalho incorreto.`);
    if (r.frame !== 'SAMEORIGIN') erros.push(`ER1 moldura: ${r.caminho} perdeu SAMEORIGIN.`);
  }
  return erros;
}
