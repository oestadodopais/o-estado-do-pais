import {NodeType} from 'node-html-parser';
import {t} from '../src/i18n/strings.mjs';
import {ENDERECO_CORRECOES} from '../src/data/metodo.mjs';
import {SUGESTOES,pedacosDaFrase} from '../src/data/sugestoes.mjs';
const normal=s=>s.replace(/\s+/g,' ').trim();
/** O texto integral entre o título e o registo, incluindo a caixa conservada. */
export function conferirSuperficieCorrecoes(root,lang){
 const erros=[],r=t(lang).correcoes,main=root.querySelector('main');
 const h=main?.querySelector('h1'),registo=main?.querySelector('#registo');
 if(!h||!registo)return ['EV3-G: título ou registo ausente'];
 const partes=[];let ativo=false,fim=false;
 function visitar(n){
  if(n===h){ativo=true;return;}
  if(n===registo){fim=true;return;}
  if(fim)return;
  if(['script','style'].includes(n.rawTagName))return;
  if(n.nodeType===NodeType.TEXT_NODE){if(ativo&&normal(n.text))partes.push(n.text);return;}
  for(const filho of n.childNodes??[])visitar(filho);
 }
 visitar(main);
 const sugestao=pedacosDaFrase(SUGESTOES.portaNasCorrecoes[lang],SUGESTOES.portaDaFraseNasCorrecoes[lang]);
 const esperado=[r.politicaK,r.politicaV,r.enderecoA,ENDERECO_CORRECOES,r.enderecoB,r.direitoDeResposta,`${r.metodoLink} →`,r.caixaTitulo,...sugestao,r.caixaTitulo,r.caixaNota,r.caixaBotao,r.caixaVazia,r.caixaComoFunciona];
 if(normal(partes.join(' '))!==normal(esperado.join(' ')))erros.push(`EV3-G: texto entre o título e o registo diferente em ${lang}`);
 if(root.querySelector('#politica .metodo-lista')||main.querySelector('.lede'))erros.push(`EV3-G: lede ou lista de naturezas reposta em ${lang}`);
 if(root.querySelector('meta[name="description"]')?.getAttribute('content')!==r.metaDescription)erros.push(`EV3-G: descrição diferente em ${lang}`);
 return erros;
}
