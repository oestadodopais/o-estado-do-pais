/* O recibo incorporável. A apresentação acompanha o JSON para nenhuma edição
   ficar com unidade, período ou ressalva de uma publicação anterior. */
import { nomeNoRecibo, lugarNoRecibo } from './o-que-e-o-numero.mjs';
import { dataDaCasa } from './datas.mjs';
import { unidadeDaLinha } from '../i18n/unidades.mjs';
import { linguaDaFonte } from '../i18n/lingua-dos-titulos.mjs';
import { t } from '../i18n/strings.mjs';
import { LICENCA } from '../data/licenca.mjs';
import { SITE_HOST_DISPLAY } from '../../site.config.mjs';
import { caminhoDaLinha } from './livro.mjs';

/** @param {unknown} valor */
export function escaparIncorporacao(valor) {
  return String(valor ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** @param {any} c @param {'pt'|'en'} lang */
export function dadosDaIncorporacao(c, lang) {
  const s = t(lang).incorporar;
  const nome = nomeNoRecibo(c.id, lang).texto;
  const lugar = lugarNoRecibo(c.id, lang);
  const unidade = unidadeDaLinha(c.unit, lang);
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
    periodo: c.reference_date ? dataDaCasa(c.reference_date, lang) : s.periodoEmFalta,
    valor: String(c.value), unidade: unidade.texto, unidadeLang: unidade.lingua ?? t(lang).lang,
    fonte, fonteLang: (c.source ? linguaDaFonte(c.source, lang) : null) ?? t(lang).lang,
    data, leitura: data ? `${s.lido} ${dataDaCasa(data, lang)}` : s.leituraEmFalta,
    atribuicao: LICENCA ? `${LICENCA.atribuicao}, ${LICENCA.nome}` : '', notas,
    atualizacao: atualizada ? `${s.atualizado} ${dataDaCasa(atualizada, lang)}` : s.atualizadoSemData,
  };
}

/** @param {any} c @param {'pt'|'en'} lang */
export function codigoDaIncorporacao(c, lang) {
  const d = dadosDaIncorporacao(c, lang);
  const e = escaparIncorporacao;
  /* O fallback diz a data guardada na linha. A releitura mais recente só entra
     quando o JSON é recebido com sucesso pelo guião. */
  const leitura = c.access_date ? `${t(lang).incorporar.lido} ${dataDaCasa(c.access_date, lang)}` : t(lang).incorporar.leituraEmFalta;
  const origem = `https://${SITE_HOST_DISPLAY}`;
  return `<p class="oedp-numero" lang="${t(lang).lang}" data-oedp="${e(c.id)}" data-oedp-valor="${e(c.value)}" data-oedp-lido="${e(c.access_date)}">` +
    `<a href="${origem}${caminhoDaLinha(c.id, lang)}">${e(d.nome)}, ${e(d.periodo)}: ${e(d.valor)} <span lang="${e(d.unidadeLang)}">${e(d.unidade)}</span></a> ` +
    `<span lang="${e(d.fonteLang)}">${e(d.fonte)}</span>, ${e(leitura)} · ${e(d.atribuicao)}` +
    (d.notas ? ` <span>${e(d.notas)}</span>` : '') +
    `</p><script async src="${origem}/incorporar.js" referrerpolicy="no-referrer" crossorigin="anonymous"></script>`;
}
