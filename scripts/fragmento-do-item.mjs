/** OG1-B: um fragmento pertence ao parágrafo e à edição declarados, incluindo a glosa conferida. */
import {ITENS} from '../src/data/discussao.mjs';
import {resolverExplicacao} from '../src/lib/explicacoes.mjs';
const resolvidos=new Map();
export function fragmentoDoItem(el,id,campo,lang){
  if(!['excerpt','document.title'].includes(campo)||!el?.hasAttribute('data-linha-trecho')||
     el.closest('[data-discussao-fragmento]')?.getAttribute('data-discussao-fragmento')!==campo)return false;
  const slug=el.closest('[data-discussao]')?.getAttribute('data-discussao');
  const item=ITENS.find(e=>e.slug===slug);if(!item)return false;
  const chave=slug+':'+lang;
  if(!resolvidos.has(chave))resolvidos.set(chave,resolverExplicacao(item,lang));
  const e=resolvidos.get(chave),caminho=el.closest('[data-discussao-paragrafo]')?.getAttribute('data-discussao-paragrafo');
  const p=[...e.abertura,...e.seccoes.flatMap(s=>s.blocos)].find(p=>p.caminho===caminho);
  return Boolean(p?.pedacos?.some(t=>t?.literal?.fragmento&&t.literal.id===id&&t.literal.campo===campo&&
    t.literal.texto===el.getAttribute('data-linha-trecho')&&t.literal.texto===el.text));
}
