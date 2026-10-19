/** V2-c: lista independente, ordem, nomes e destinos do menu. */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
const PORTAS = {
  pt: [['/','Portugal'],['/lugares/','Lugares'],['/temas/','Temas'],['/estudos','Estudos'],['/explicacoes','Explicações'],['/o-que-se-discute/','O que se discute'],['/uniao-europeia','União Europeia'],['/sobre','Sobre']],
  en: [['/en','Portugal'],['/en/places/','Places'],['/en/themes/','Themes'],['/en/studies','Studies'],['/en/explainers','Explainers'],['/en/under-discussion/','Under discussion'],['/en/european-union','European Union'],['/en/about','About']],
};
export function conferirMenu(root, lang) {
  const vistas = root.querySelectorAll('#nav-principal a').map(a=>[a.getAttribute('href'),a.text.trim()]);
  return JSON.stringify(vistas) === JSON.stringify(PORTAS[lang]) ? [] : [`V2C menu ${lang}: oito portas, ordem, nomes ou destinos errados`];
}
export function conferirMenus(dist, prova) {
  const erros=[], plantas=[];
  for (const lang of ['pt','en']) {
    const html=fs.readFileSync(path.join(dist,lang==='pt'?'index.html':'en/index.html'),'utf8');
    erros.push(...conferirMenu(parse(html),lang));
    if (prova) for (const [nome,estraga] of [
      ['menu sem a discussão',r=>r.querySelectorAll('#nav-principal a')[5].remove()],
      ['ordem trocada',r=>{const a=r.querySelectorAll('#nav-principal a')[5];const s=a.toString();a.remove();r.querySelector('#nav-principal').insertAdjacentHTML('beforeend',s);}],
      ['destino trocado',r=>r.querySelectorAll('#nav-principal a')[5].setAttribute('href','#errado')],
      ['nome trocado',r=>r.querySelectorAll('#nav-principal a')[5].set_content('Discussão')],
    ]) {const root=parse(html);estraga(root);plantas.push({nome,lang,mordeu:conferirMenu(root,lang).length>0});}
  }
  return {erros,plantas};
}
