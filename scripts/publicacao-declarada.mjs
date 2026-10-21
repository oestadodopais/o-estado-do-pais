/** Régua independente do resolvedor da vista. */
import { parse } from 'node-html-parser';
export function conferirDataDeclarada(work, edition, entrada) {
  if (work?.publication !== 'declared' || edition?.date === null) return [];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(edition?.date ?? '') || !entrada || edition.date < entrada || !diaValido(edition.date))
    return ['data declarada anterior ao commit de entrada ou inválida'];
  return [];
}

function diaValido(iso) {
 const [ano,mes,dia]=iso.split('-').map(Number);
 const dias=mes===2?(ano%4===0&&(ano%100!==0||ano%400===0)?29:28):[4,6,9,11].includes(mes)?30:31;
 return mes>=1&&mes<=12&&dia>=1&&dia<=dias;
}

/** I9: o HTML deve respeitar a declaração, sem confundir entrada com publicação. */
export function conferirPublicacaoDeclaradaNoHtml(work, edition, entrada, html) {
  if (work?.publication !== 'declared') return [];
  // I9 também lê árvores sem head nem scripts para medir a prosa. Aqui é
  // obrigatório o HTML bruto: a publicação é provada no corpo e no JSON-LD.
  if(typeof html!=='string')return ['a publicação exige o HTML bruto da página'];
  const root=parse(html);
  const erros=conferirDataDeclarada(work,edition,entrada);
  if(erros.length)return erros;
  const faixa=root.querySelector(`[data-estudo-edicao="${work.slug}/${edition.lang}"]`);
  if(!faixa)return ['falta a faixa da edição declarada'];
  const datas=faixa.querySelectorAll('time');
  let artigos=[];
  try {
    const juntar=x=>{if(Array.isArray(x))return x.flatMap(juntar);if(x?.['@graph'])return juntar(x['@graph']);return [x];};
    artigos=root.querySelectorAll('script[type="application/ld+json"]').flatMap(el=>juntar(JSON.parse(el.textContent))).filter(x=>x?.['@type']==='Article');
  } catch {erros.push('JSON-LD inválido');}
  if(artigos.length!==1)erros.push('a edição exige um único Article no JSON-LD');
  if(edition.date===null) {
    if(datas.length||/publicado a|published on/i.test(faixa.textContent))erros.push('a edição em preparação imprime publicação');
    for(const artigo of artigos)if(artigo.creativeWorkStatus!=='Draft'||Object.hasOwn(artigo,'datePublished'))erros.push('a edição sem data deve ser Draft e não declarar datePublished');
  } else {
    const iso=edition.date,forma=`${iso.slice(8)}.${iso.slice(5,7)}.${iso.slice(0,4)}`;
    if(datas.length!==1||datas[0]?.getAttribute('datetime')!==iso||datas[0]?.textContent.trim()!==forma)erros.push('a data impressa não é a publicação declarada');
    for(const artigo of artigos) {
      if(Object.hasOwn(artigo,'datePublished')&&artigo.datePublished!==iso)erros.push('datePublished diverge da publicação declarada');
      if(root.querySelector('[data-registo-edicao]')&&artigo.creativeWorkStatus!=='Published')erros.push('a leitura com data declarada deve ser Published');
    }
  }
  return erros;
}
