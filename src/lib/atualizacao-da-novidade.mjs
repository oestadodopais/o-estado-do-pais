import {routePath} from './routes.mjs';
/** @param {unknown} valor */
const escapar = valor => String(valor ?? '').replace(/[&<>"']/g,c=>(/** @type {Record<string,string>} */ ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]));
/** Os três campos pertencem à mesma entrada do registo; nenhum valor fica sem marca.
 * @param {any} m */
export function htmlDaAtualizacao(m) {
  const campo = (/** @type {string} */ nome, /** @type {unknown} */ valor) => `<span data-correcao-claim="${escapar(m.claim)}" data-correcao-n="${escapar(m.n)}" data-correcao-campo="${nome}">${escapar(valor)}</span>`;
  return campo('reason',m.motivo)+' '+campo('old_value',m.antes)+' → '+campo('new_value',m.depois);
}
/** Uma publicação ou mudança editorial não é uma atualização de valor.
 * @param {any} m @param {'pt'|'en'} lang */
export function atualizacaoDaNovidade(m,lang) {
  if (m?.tipo!=='correcao' || !['correcao','atualizacao'].includes(m.kind)) return null;
  return {id:'atualizacao:registo',tipo:'atualizacao',data:m.data,origem:'mudancas.ultima',rota:routePath('correcoes',lang),atualizacao:m};
}
/** Mesma comparação usada na caixa e na planta: todos os valores e marcas são obrigatórios.
 * @param {any} el @param {any} m */
export function conferirAtualizacao(el,m) {
  const campos=el?.querySelectorAll('[data-correcao-campo]')??[];
  const valores={reason:m.motivo,old_value:m.antes,new_value:m.depois};
  return campos.length===3 && Object.entries(valores).every(([campo,valor])=> {
    const n=campos.find((/** @type {any} */ e)=>e.getAttribute('data-correcao-campo')===campo);
    return n?.getAttribute('data-correcao-claim')===m.claim && n?.getAttribute('data-correcao-n')===String(m.n) && n?.textContent===String(valor??'');
  });
}
