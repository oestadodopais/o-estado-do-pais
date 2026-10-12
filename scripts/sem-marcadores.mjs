import { createHash } from 'node:crypto';
import { provenienciaIncompleta } from '../src/lib/ledger.mjs';
import { matchPath } from '../src/lib/routes.mjs';
/** RP4N-1 e RP4N-5: recusa das afirmações; inventário das ausências dos recibos
 * e dos lugares em que a casa explica a própria marca.
 * Uma classe não dá dispensa a uma frase: as superfícies proibidas são lidas primeiro.
 * Os restantes portões continuam a comparar campos e a exigir a proteção I77.
 */
export const TIPOS_RECUSADOS = [
  'o-que-e-linha', 'o-que-e-familia', 'o-que-e-serie', 'nome-medida', 'nome-serie',
  'nome-lugar', 'titulo-estudo', 'leitura-cartao', 'primeira-pagina', 'explicacao', 'fora-dos-tipos',
];
export const TIPOS_ACEITES = [
  'data', 'excerto', 'endereco', 'pessoa-I77', 'referencia-metodo', 'referencia-sobre',
  'selo-proveniencia', 'publicador', 'titulo-documento', 'edicao-documento',
  'referencia-no-livro', 'pagina-da-marca',
];
const MARCA = /\[\s*(?:a\s+verificar|to\s+verify)\s*\]/giu;
// Os parágrafos citados sobre a identidade da I77, conferidos no documento e na transcrição.
// Um nome diferente ou uma frase acrescentada deixa de beneficiar da exceção.
const PESSOA_I77 = new Set([
  '66fcaa654d160d125ca91a72345eee2c317e4fe41189b640a15df9c71a7d8421',
  'bbc69f40487437b8b111dffbcc1edef1116084ef5513cf905a62aadeda14619e',
]);
const REFERENCIAS_METODO = new Set([
  '2c0adb43dabc8b688009f7fdaf06d925d6bf1afe1f5d031365d8416a927c57d9',
  '9db1e65032c9e887071fae2df91c472656f1d300435daee34fd91f9568e90429',
]);
const resumo = n => createHash('sha256').update(texto(n).replace(/\s+/g,' ').trim()).digest('hex');
const GENERICA = 'RP4N: uma página de leitor contém uma marca de informação por confirmar';
const texto = n => ['SCRIPT', 'STYLE'].includes(n.tagName) ? '' : n.nodeType === 3 ? n.textContent : (n.childNodes ?? []).map(texto).join('');
const perto = (n, seletor) => n?.closest?.(seletor);
const valor = (o, campo) => campo.split('.').reduce((v,k) => v?.[k], o);

function recusado(n, rota) {
  if (perto(n, '[data-o-que-e-da-serie], [data-serie-o-que-conta]')) return 'o-que-e-serie';
  const frase = perto(n, '[data-o-que-e]');
  if (frase) return ['familia','concelho'].includes(frase.getAttribute('data-o-que-e-tipo')) ? 'o-que-e-familia' : 'o-que-e-linha';
  if (perto(n, '[data-leitura-parte="o-que-e"], [data-definicao-da-medida], [data-definicao]')) return 'o-que-e-linha';
  if (perto(n, '[data-por-confirmar-na-fonte]')) return 'o-que-e-linha';
  if (perto(n, '[data-nonledger="titulo-de-estudo"], .marcador-de-titulo')) return 'titulo-estudo';
  if (perto(n, '[data-lugar-da-linha], [data-lugar], [data-pais-nome], .municipio-nome, .lugar-nome')) return 'nome-lugar';
  if (perto(n, '.serie-titulo, [data-nome="serie"], [data-serie-campo="name"], [data-serie-tempo-campo="name"]')) return 'nome-serie';
  if (perto(n, '[data-nome], [data-linha-campo="name"], [data-nonledger="nome-oficial-da-medida"]')) return 'nome-medida';
  if (perto(n, '[data-cartao-leitura], .cartao-medida-leitura')) return 'leitura-cartao';
  if (rota?.key === 'home') return 'primeira-pagina';
  if (rota?.key === 'explicacao' || rota?.key === 'explicacoes') return 'explicacao';
  return null;
}

function aceite(n, {rota, claims, municipios = []}) {
  // A marca de água repete a falta de um campo do recibo. A classe sozinha não dá dispensa.
  if (n.hasAttribute?.('data-marca') && n.matches('.marca-agua') && rota?.key === 'linha') {
    const linha = claims?.get(rota.params?.slug);
    const falta = v => v === '[a verificar]';
    if (perto(n, 'section#prova') && falta(linha?.excerpt)) return 'excerto';
    if (perto(n, 'section[aria-labelledby="pedido"]') && falta(linha?.source_url)) return 'endereco';
    const ficha = perto(n, '.aparelho-ficha');
    if (ficha && ficha.querySelectorAll('[data-linha-campo][data-linha-claim]').some(c =>
      c.getAttribute('data-linha-claim') === rota.params.slug &&
      ['source','document.title','document.edition','published_at','access_date','reference_date'].includes(c.getAttribute('data-linha-campo')) &&
      falta(valor(linha, c.getAttribute('data-linha-campo'))) && texto(c).trim() === (rota.lang === 'en' ? '[to verify]' : '[a verificar]'))) return 'selo-proveniencia';
  }
  const campo = perto(n, '[data-linha-campo][data-linha-claim], [data-de-campo][data-de-linha]');
  if (campo) {
    const chave = campo.getAttribute('data-linha-campo') ?? campo.getAttribute('data-de-campo');
    const linha = claims?.get(campo.getAttribute('data-linha-claim') ?? campo.getAttribute('data-de-linha'));
    // O campo que dá a exceção tem de existir no livro e declarar a ausência.
    if (texto(campo).trim() !== (rota?.lang === 'en' && valor(linha,chave) === '[a verificar]' ? '[to verify]' : valor(linha,chave)) || typeof valor(linha, chave) !== 'string' || !/^\[\s*(?:a\s+verificar|to\s+verify)\s*\]$/iu.test(valor(linha, chave))) return null;
    if (['published_at','access_date','reference_date','document.hosted.snapshot_date'].includes(chave) || /^document\.computed_over\.files\.\d+\.snapshot_date$/.test(chave) || /^verifications\.\d+\.date$/.test(chave)) return 'data';
    if (chave === 'excerpt') return 'excerto';
    if (chave === 'source_url' || chave === 'document.url') return 'endereco';
    if (chave === 'source') return 'publicador';
    if (chave === 'document.title') return 'titulo-documento';
    if (chave === 'document.edition') return 'edicao-documento';
  }
  // O selo é a porta de um recibo cuja proveniência está incompleta. A célula
  // própria do selo continua a conferir o texto, a etiqueta e o destino.
  const selo = perto(n, 'a.src-chip[data-nonledger="proveniencia"]');
  const destino = selo && matchPath((selo.getAttribute('href') ?? '').split('#')[0]);
  if (destino?.key === 'linha' && provenienciaIncompleta(claims?.get(destino.params.slug))) return 'selo-proveniencia';
  // No livro, a referência é uma amostra isolada, com a glosa inglesa opcional.
  const referencia = perto(n, '.aparelho-nota');
  if (rota?.key === 'livro' && referencia && /^\[(?:a verificar|to verify)\](?:\s*\(to verify\))?$/.test(texto(referencia).trim())) return 'referencia-no-livro';
  if (rota?.key === 'marcador') return 'pagina-da-marca';
  if (rota?.key === 'agenda' && perto(n, '[data-agenda-sem-data]') && perto(n, '[data-agenda]')) return 'data';
  if (rota?.key === 'municipio') {
    const m = municipios.find(m => m.slug === rota.params.slug);
    const quem = perto(n, '.mun-mandato-quem');
    const mandato = quem && m?.tempo?.mandatos?.find(m => m.quemPorVerificar && perto(quem, `[id="mandato-${String(m.periodo).replace(/[–-]+$/, '').replace(/[–-]/g, '-')}"]`));
    if (mandato) return 'pessoa-I77';
  }
  const paragrafo = perto(n, 'p');
  if (['estudo','documento'].includes(rota?.key) && rota.params?.slug === 'evora-quem-governou-a-camara-2009-2025' && paragrafo && PESSOA_I77.has(resumo(paragrafo))) return 'pessoa-I77';
  if (rota?.key === 'metodo' && paragrafo && REFERENCIAS_METODO.has(createHash('sha256').update(texto(paragrafo).replaceAll('[to verify]', '[a verificar] (to verify)').replace(/\s+/g,' ').trim()).digest('hex'))) return 'referencia-metodo';
  // Uma demonstração isolada da marca, sem uma afirmação ao lado, nos lugares que a explicam.
  if (['metodo','sobre'].includes(rota?.key) && paragrafo && /^\[(?:a verificar|to verify)\]$/.test(texto(paragrafo).trim())) return `referencia-${rota.key}`;
  return null;
}

/** Conta cada marca textual uma vez, incluindo texto partido e entidades HTML.
 * Classes vazias e declarações sem texto também fecham a porta, sem duplicar a marca textual.
 */
export function inventariarMarcadores(raiz, contexto = {}) {
  const folhas = [];
  let cadeia = '';
  function andar(n) {
    if (['SCRIPT', 'STYLE'].includes(n.tagName)) return;
    if (n.nodeType === 3) { const inicio = cadeia.length; cadeia += n.textContent; folhas.push({n, inicio, fim:cadeia.length}); }
    else for (const c of n.childNodes ?? []) andar(c);
  }
  andar(raiz);
  const nos = [];
  for (const m of cadeia.matchAll(MARCA)) {
    const tocadas = folhas.filter(f => f.fim > m.index && f.inicio < m.index + m[0].length);
    let n = tocadas[0].n.parentNode;
    while (n && !tocadas.every(f => {for(let p=f.n;p;p=p.parentNode) if(p===n)return true; return false;})) n = n.parentNode;
    nos.push({n, folhas:tocadas.map(f=>f.n)});
  }
  for (const n of raiz.querySelectorAll('[data-marca]')) {
    for (const _ of n.getAttribute('data-marca').matchAll(MARCA)) nos.push({n, folhas:[], atributo:'data-marca'});
  }
  for (const n of raiz.querySelectorAll('.marcador, [data-por-confirmar-na-fonte]')) {
    if (!nos.some(p => p.n === n || p.folhas.some(f => {for(let a=f;a;a=a.parentNode)if(a===n)return true;return false;}))) nos.push({n, folhas:[]});
  }
  const aceites = [], recusadas = [];
  for (const {n, folhas, atributo} of nos) {
    const proibido = recusado(n, contexto.rota) ?? folhas.map(f=>recusado(f.parentNode, contexto.rota)).find(Boolean);
    const tipo = proibido ?? aceite(n, contexto) ?? 'fora-dos-tipos';
    const aceita = TIPOS_ACEITES.includes(tipo);
    const campo = perto(n, '[data-linha-campo]')?.getAttribute('data-linha-campo');
    const superficie = campo ?? (perto(n, '.src-chip') ? 'selo-proveniencia' : perto(n, '.linha-alcance') ? 'nota-alcance' : contexto.rota?.key === 'marcador' ? 'pagina-da-marca' : perto(n, '.aparelho-nota') ? 'referencia-no-livro' : tipo);
    (aceita ? aceites : recusadas).push({tipo, superficie, ...(atributo ? {atributo} : {}), mensagem:aceita ? `RP4N: marca aceite provisoriamente (${tipo})` : tipo === 'fora-dos-tipos' ? GENERICA : `RP4N: marca recusada em ${tipo}`, contexto:texto(n.parentNode ?? n).replace(/\s+/g,' ').trim().slice(0,260)});
  }
  return {aceites, recusadas};
}
export function conferirSemMarcadores(raiz, contexto = {}) {
  return inventariarMarcadores(raiz, contexto).recusadas[0]?.mensagem ?? null;
}

export function resumirMarcadores(paginas) {
  const resumir = (estado, tipos) => Object.fromEntries(tipos.map(tipo => {
    const porPagina = paginas.map(p => ({pagina:p.pagina, ocorrencias:p[estado].filter(m => m.tipo === tipo).length})).filter(p => p.ocorrencias);
    return [tipo, {ocorrencias:porPagina.reduce((s,p)=>s+p.ocorrencias,0), paginas:porPagina}];
  }));
  return {aceites:resumir('aceites',TIPOS_ACEITES), recusadas:resumir('recusadas',TIPOS_RECUSADOS)};
}
