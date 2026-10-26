import { lugarDaIncorporacao } from './lugar-da-incorporacao.mjs';
/* O recibo incorporável. A apresentação acompanha o JSON para nenhuma edição
   ficar com unidade, período ou ressalva de uma publicação anterior. */
import { nomeNoRecibo } from './o-que-e-o-numero.mjs';
import { dataDaCasa } from './datas.mjs';
import { unidadeDaLinha } from '../i18n/unidades.mjs';
import { linguaDaFonte } from '../i18n/lingua-dos-titulos.mjs';
import { t } from '../i18n/strings.mjs';
import { LICENCA } from '../data/licenca.mjs';
import { SITE_HOST_DISPLAY } from '../../site.config.mjs';
import { provenienciaIncompleta, paginaSoComEdicao } from './ledger.mjs';
import { leituraDaIncorporacao } from './leitura-da-incorporacao.mjs';
import { caminhoDaLinha } from './livro.mjs';
import { textoDocumentalConferido, valorImpressoDoPainelConferido } from './prova-efeitos.mjs';

/** @param {unknown} valor */
export function escaparIncorporacao(valor) {
  return String(valor ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** A recusa usa o mesmo predicado da prova do Método (ER1-d).
 * @param {any} c */
export function podeIncorporar(c) {
  return !!c && !provenienciaIncompleta(c);
}

/** A frase de um rótulo dentro de outra frase começa em minúscula.
 * @param {string} texto */
function minusculaInicial(texto) {
  return texto.charAt(0).toLocaleLowerCase('pt-PT') + texto.slice(1);
}

/** @param {any} c @param {'pt'|'en'} lang */
export function dadosDaIncorporacao(c, lang) {
  const s = t(lang).incorporar;
  const nome = nomeNoRecibo(c.id, lang).texto;
  const lugar = lugarDaIncorporacao(c, lang);
  const unidade = unidadeDaLinha(c.unit, lang);
  const unidadeNoValor = valorImpressoDoPainelConferido(c.id, c.value) || textoDocumentalConferido(c);
  const correcoes = (c.corrections ?? []).filter((/** @type {any} */ x) =>
    x.kind !== 'proveniencia' && x.new_value === c.value).sort((/** @type {any} */ a, /** @type {any} */ b) => b.date.localeCompare(a.date));
  const atualizada = correcoes[0]?.date ?? '';
  /* Uma tentativa sem resposta não confirma o número. Uma confirmação anterior
     à última mudança de valor também não confirma o número de agora. */
  const datas = [c.access_date, ...(c.verifications ?? []).filter((/** @type {any} */ v) =>
    v.result === 'igual' && (!atualizada || v.date >= atualizada)).map((/** @type {any} */ v) => v.date)]
    .filter((/** @type {any} */ d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)).sort();
  const data = datas.at(-1) ?? '';
  const fonte = c.source || s.calculado;
  const notas = [lang === 'en' ? c.source_flag_note_en : c.source_flag_note,
    lang === 'en' ? c.ressalva_en : c.ressalva].filter(Boolean).join(' ');
  return {
    nome: nome + (lugar ? ` · ${lugar.nome}` : ''),
    /* HB1-g (22.10.2026): numa linha que só declara a última edição de uma página, a data
       diz-se com o seu nome (a frase do bloco «O que foi conferido», em minúscula inicial)
       e não ocupa o lugar do período. */
    periodo: paginaSoComEdicao(c)
      ? `${minusculaInicial(t(lang).livro.linha.editadoEmK)} ${dataDaCasa(c.published_at, lang)}`
      : (c.period ?? c.reference_date) ? dataDaCasa(c.period ?? c.reference_date, lang) : s.periodoEmFalta,
    valor: String(c.value), unidade: unidadeNoValor ? '' : unidade.texto, unidadeLang: unidade.lingua ?? t(lang).lang,
    fonte, fonteLang: (c.source ? linguaDaFonte(c.source, lang) : null) ?? t(lang).lang,
    data, leitura: leituraDaIncorporacao(c, lang, data),
    atribuicao: LICENCA ? `${LICENCA.atribuicao}, ${LICENCA.nome}` : '', notas,
    atualizacao: atualizada ? `${s.atualizado} ${dataDaCasa(atualizada, lang)}` : '',
  };
}

/** @param {any} c @param {'pt'|'en'} lang */
export function codigoDaIncorporacao(c, lang) {
  if (!podeIncorporar(c)) return null;
  const d = dadosDaIncorporacao(c, lang);
  const e = escaparIncorporacao;
  /* O fallback diz a data guardada na linha. A releitura mais recente só entra
     quando o JSON é recebido com sucesso pelo guião. */
  const leitura = leituraDaIncorporacao(c, lang);
  const origem = `https://${SITE_HOST_DISPLAY}`;
  const valor = textoDocumentalConferido(c) ? `<span lang="pt-PT">${e(d.valor)}</span>` : e(d.valor);
  return `<p class="oedp-numero" lang="${t(lang).lang}" data-oedp="${e(c.id)}" data-oedp-valor="${e(c.value)}" data-oedp-lido="${e(c.access_date)}">` +
    `<a href="${origem}${caminhoDaLinha(c.id, lang)}">${e(d.nome)}, ${e(d.periodo)}: ${valor}${d.unidade ? ` <span lang="${e(d.unidadeLang)}">${e(d.unidade)}</span>` : ''}</a> · ` +
    `<span lang="${e(d.fonteLang)}">${e(d.fonte)}</span>${d.fonte === leitura ? '' : ', ' + e(leitura)} · ${e(d.atribuicao)}` +
    (d.notas ? ` · <span>${e(d.notas)}</span>` : '') +
    `</p><script async src="${origem}/incorporar.js" referrerpolicy="no-referrer" crossorigin="anonymous"></script>`;
}
