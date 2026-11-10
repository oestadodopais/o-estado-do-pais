import { emEnsaio } from '../site.config.mjs';
import { ENSAIO } from '../src/data/ensaio.mjs';
/** MET1: lista fechada independente da vista, com recibo conferido pelas guardas do livro-razão. */
import fs from 'node:fs';
import { parse } from 'node-html-parser';
import { getClaim } from '../src/lib/ledger.mjs';
import { nomeNoRecibo } from '../src/lib/o-que-e-o-numero.mjs';
import { routePath } from '../src/lib/routes.mjs';
import { ligacoesAoGithub } from './repositorio-no-dist.mjs';
export const APROVADO = JSON.parse(fs.readFileSync(new URL('./metodo-aprovado.json', import.meta.url), 'utf8'));
export const NOMES_DE_MODELOS = /\b(?:Claude|Anthropic|Codex|OpenAI|Opus|Fable)\b|gpt-/i;
const normal = s => s.replace(/\s+/g, ' ').trim();
const partes = ps => ps.map(p => typeof p === 'string' ? p : `{prova:${p.prova}}`).join('');
export function unidades(lang) {
  const a = APROVADO;
  return Object.fromEntries([
    ...['abrir','divida','mudanca','autoria'].map(k => [k, partes(a[k][lang])]),
    ...a.passos.map((p,i) => [`passo-${i}`, partes(p[lang])]),
    ...a.marcas.map((p,i) => [`marca-${i}`, partes(p[lang])]),
    ...a.campos[lang].map((p,i) => [`campo-${i}`,p]),
    ...a.ligacoes[lang].map((p,i) => [`ligacao-${i}`,p]),
    ['mudanca', emEnsaio() ? (lang === 'pt' ? 'A partir do lançamento, cada mudança fica no registo das correções, com a data, o que estava e o que ficou.' : 'From launch onward, each change is recorded in the corrections register, with the date, what was there and what replaced it.') : partes(a.mudanca[lang])],
    ['recibo-nome',nomeNoRecibo(a.recibo.id, lang).texto],
  ]);
}
/** Reconta independente, pela mesma lista declarada que o guião shell lê. */
export function recontarConferencias(scripts = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8')).scripts) {
  let n = 0, temTypecheck = false;
  for (const comando of scripts.verify.split(/&&/)) {
    const m = comando.trim().match(/^npm run ([A-Za-z0-9:._-]+)( -- [^&|;<>`$]+)?$/);
    if (!m) throw new Error('MET1: comando fora da lista admitida.');
    n++; if (comando.trim() === 'npm run typecheck') temTypecheck = true;
  }
  return n + (Object.hasOwn(scripts, 'typecheck') && !temTypecheck ? 1 : 0);
}
export function conferirContagemDaCorrida(root, scripts) {
 const nos=root.querySelectorAll('[data-prova="conferencias_da_corrida"]');
 return nos.length===1 && normal(nos[0].textContent)===String(recontarConferencias(scripts)) ? [] : ['MET1: contagem das conferências diferente da lista executada.'];
}
const CAMPOS = ['reference_date','unit','source','document.title','excerpt','access_date'];
export const campoLocalizadorMet1 = lang => lang === 'en' && getClaim(APROVADO.recibo.id).document.locator_en ? 'document.locator_en' : 'document.locator';
export function campoDoReciboMet1(rota, el, id, campo) {
  return rota === 'metodo' && id === APROVADO.recibo.id && [...CAMPOS,'document.locator','document.locator_en'].includes(campo) && el.closest('[data-met1-recibo]')?.getAttribute('data-met1-recibo') === id;
}
export function conferirLugaresIA(_root, lang, html = null) {
  const root = parse(html ?? _root.toString(), {comment:false,blockTextElements:{script:true,style:true}});
  const erros = [...conferirContagemDaCorrida(root)], u = unidades(lang), main = root.querySelector('main');
  if (ligacoesAoGithub(root).length) erros.push('MET2: ligação ao repositório no Método.');
  if (!main) return ['MET1: falta main.'];
  const marcasEnsaio = main.querySelectorAll('[data-metodo-ensaio]');
  if (emEnsaio() ? marcasEnsaio.length !== 1 || marcasEnsaio[0].textContent !== ENSAIO[lang].metodo : marcasEnsaio.length !== 0) erros.push('REC1 Método: frase de ensaio ausente, repetida ou diferente');
  for (const n of marcasEnsaio) {
    if (n.tagName !== 'P' || n.closest('li') || n.nextElementSibling?.tagName !== 'UL') erros.push('REC1 Método: ensaio fora de parágrafo próprio antes da lista.');
    n.remove();
  }
  const campoLocalizador = campoLocalizadorMet1(lang);
  const linhaLocalizador = getClaim(APROVADO.recibo.id);
  const valorLocalizador = linhaLocalizador.document[campoLocalizador.split('.')[1]];
  const noLocalizador = main.querySelector(`[data-linha-campo="${campoLocalizador}"]`);
  if (!valorLocalizador || normal(noLocalizador?.textContent ?? '') !== normal(valorLocalizador) || !noLocalizador?.closest('dd')?.parentNode.querySelector('dt[data-met1="campo-2"]')) erros.push('MET1: localizador ausente, trocado ou fora do campo.');
  // Inclui noscript: a prosa de quem não usa JavaScript também é conferida.
  for (const n of root.querySelectorAll('script,style,template')) n.remove();
  if (NOMES_DE_MODELOS.test(root.textContent)) erros.push('MET1 nomes: nome de modelo ou fornecedor.');
  const h1 = main.querySelectorAll('h1');
  if (h1.length !== 1 || normal(h1[0].textContent) !== (lang === 'pt' ? 'Método' : 'Method')) erros.push('MET1: título da página alterado.');
  for (const n of main.querySelectorAll('.met1 [title],.met1 [aria-label],.met1 [alt]')) {
    if (!n.hasAttribute('data-prova') && !n.classList.contains('src-chip') && !n.closest('.src-chip')) erros.push('MET1: prosa adicional em atributo.');
  }
  const sections = main.querySelectorAll('.met1 > section');
  if (sections.length !== 4 || sections.map(n=>n.id).join('|') !== 'conferir-um-numero|percurso|marcas|correcoes') erros.push('MET1: quatro secções na ordem decidida.');
  const titulos = main.querySelectorAll('h2');
  if (titulos.length !== 4 || titulos.some((n,i)=>normal(n.textContent)!==APROVADO.titulos[lang][i])) erros.push('MET1: títulos diferentes.');
  if (main.querySelectorAll('.met1-percurso > li').length !== 10) erros.push('MET1: percurso incompleto.');
  const portas = main.querySelectorAll('.met1-portas');
  if (portas.length !== 1 || portas[0].querySelectorAll('a').length !== 1 || !portas[0].querySelector('a[data-met1="ligacao-0"]') || main.querySelectorAll('[data-met1^="ligacao-"]').length !== 1) erros.push('MET2: o parágrafo das portas deve conter apenas a agenda.');
  if (main.querySelector('[data-met1="ligacao-0"]')?.getAttribute('href') !== routePath('agenda',lang)) erros.push('MET1: porta da agenda alterada.');
  if (main.querySelector('[data-met1="mudanca"] a')?.getAttribute('href') !== routePath('correcoes',lang)) erros.push('MET1: porta das correções alterada.');
  for (const [k,esperado] of Object.entries(u)) {
    const ns = main.querySelectorAll(`[data-met1="${k}"]`);
    if (ns.length !== 1) { erros.push(`MET1: unidade ${k} ausente ou repetida.`); continue; }
    const n = ns[0];
    for (const prova of n.querySelectorAll('[data-prova]')) prova.set_content(`{prova:${prova.getAttribute('data-prova')}}`);
    if (normal(n.textContent)!==normal(esperado)) erros.push(`MET1: frase fora da lista fechada (${k}).`);
    n.remove();
  }
  const recibos = main.querySelectorAll('[data-met1-recibo]');
  if (recibos.length !== 1 || recibos[0].getAttribute('data-met1-recibo') !== APROVADO.recibo.id) erros.push('MET1: recibo trocado ou ausente.');
  const campos = main.querySelectorAll('[data-linha-claim],[data-de-linha]');
  const idDoCampo = n => n.getAttribute('data-linha-claim') ?? n.getAttribute('data-de-linha');
  const nomeDoCampo = n => n.getAttribute('data-linha-campo') ?? n.getAttribute('data-de-campo');
  if (campos.map(nomeDoCampo).sort().join('|') !== [...CAMPOS,campoLocalizador].sort().join('|') || campos.some(n=>!campoDoReciboMet1('metodo',n,idDoCampo(n),nomeDoCampo(n)))) erros.push('MET1: campos do recibo incompletos ou fora do exemplo.');
  const linha = getClaim(APROVADO.recibo.id);
  for (const [campo,href] of [['source',linha.source_url],['document.title',linha.document.url]]) {
    if (main.querySelector(`[data-linha-campo="${campo}"]`)?.closest('a')?.getAttribute('href') !== href) erros.push(`MET1: ligação do recibo alterada (${campo}).`);
  }
  const valores = main.querySelectorAll('[data-claim]');
  if (valores.length !== 1 || valores[0].getAttribute('data-claim') !== APROVADO.recibo.id) erros.push('MET1: valor do exemplo alterado.');
  // Os valores, campos e selos continuam sujeitos à comparação literal e à auditoria no gate:html.
  for (const n of main.querySelectorAll('[data-linha-claim],[data-de-linha],[data-claim],.src-chip')) n.remove();
  for (const n of main.querySelectorAll('h1,h2,[data-rotulo-ia]')) n.remove();
  if (normal(main.textContent.replaceAll('·',''))) erros.push('MET1: prosa adicional fora da lista fechada.');
  return erros;
}

/** As frases deslocadas mantêm a comparação literal e a presença obrigatória. */
const LIMITES = JSON.parse(fs.readFileSync(new URL('./sobre-limites-aprovados.json', import.meta.url), 'utf8'));
export function conferirLimitesSobre(root,lang) {
 const nos=root.querySelectorAll('[data-sobre-limite]');
 return nos.length===LIMITES.length && nos.every((n,i)=>n.getAttribute('data-sobre-limite')===lang && normal(n.textContent)===normal(LIMITES[i][lang])) ? [] : ['MET1 Sobre: frases transferidas ausentes ou alteradas.'];
}
