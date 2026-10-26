import {allSeries} from '../../../../../src/lib/series.mjs';
import {nomeDoProjeto} from '../../../../../src/data/nomes-das-medidas.mjs';
import {manifestoDosRegistos,registoDaEdicao} from '../../../../../src/lib/registos.mjs';
import {linhaDoSitioDoEstudo} from '../../../../../src/lib/cruzamento.mjs';
const e=manifestoDosRegistos().registos['a-casa-em-portugal-e-na-europa/pt'];const r=registoDaEdicao('a-casa-em-portugal-e-na-europa','pt');const res=linhaDoSitioDoEstudo(e.rh_study,e.rh_origens??{});
const cit=new Set(r.blocks.flatMap(b=>(b.source_rows??[]).map(res)));
const ligadas=allSeries().flatMap(s=>[s.linha_de_portugal,s.linha_da_uniao].filter(Boolean).map(l=>[s.id,l]));
const hab=ligadas.filter(([s,l])=>cit.has(l));
console.log(JSON.stringify({citadas:cit.size,series_citadas:hab.length,com_nome:hab.filter(([s,l])=>nomeDoProjeto(l)).map(([s,l])=>l).slice(0,6)}));
