/* A data tem a mesma regra no código estático, no JSON e no portão. */
import { eDerivada } from './ledger.mjs';
import { dataDaCasa } from './datas.mjs';
import { t } from '../i18n/strings.mjs';

/** @param {any} c */
export function conferirDataDaIncorporacao(c) {
  return !c.access_date && !eDerivada(c)
    ? ['ER1 livro: uma linha não derivada não tem data de leitura.'] : [];
}

/** A releitura confirmada pode substituir a data no JSON. Não transforma
 * uma linha sem data de origem numa linha válida do livro.
 * @param {any} c @param {'pt'|'en'} lang @param {string} [data] */
export function leituraDaIncorporacao(c, lang, data = c.access_date) {
  const erros = conferirDataDaIncorporacao(c);
  if (erros.length) throw Error(erros[0]);
  const s = t(lang).incorporar;
  return data ? `${s.lido} ${dataDaCasa(data, lang)}` : eDerivada(c) ? s.calculado : '';
}
