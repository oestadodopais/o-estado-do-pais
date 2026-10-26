/** Mede as frases nas duas edições; antes pelo resolvedor, depois também no HTML. */
import fs from 'node:fs';
import {getClaim} from '../../../../src/lib/ledger.mjs';
import {notaDaBandeira} from '../../../../src/lib/bandeira-da-fonte.mjs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {EXPLICACOES} from '../../../../src/data/explicacoes/index.mjs';
import {ITENS} from '../../../../src/data/discussao.mjs';
import {resolverExplicacao, textoDosPedacosDaExplicacao as texto} from '../../../../src/lib/explicacoes.mjs';
import {idsDosBlocos, blocoResolvido, textoDosPedacos} from '../../../../src/lib/primeira-pagina.mjs';
import {routePath} from '../../../../src/lib/routes.mjs';
const pasta='design/especime-v3/medicoes/cr2-2026-10-26';
const ids=JSON.parse(fs.readFileSync(`${pasta}/ids.json`));
const normal=s=>String(s).replace(/\s+/g,' ').trim();
const modo=process.argv[2];
const frases=[];
for(const lang of ['pt','en']) {
  for(const [familia,lista] of [['explicacao',EXPLICACOES],['discussao',ITENS]]) {
    for(const e of lista) {
      const citadas=ids.filter(id=>JSON.stringify(e).includes(`"${id}"`));
      if(!citadas.length)continue;
      const r=resolverExplicacao(e,lang);
      const rota=routePath(familia,lang,familia==='explicacao'?{slug:e.slug}:{});
      const paragrafos=[...r.abertura,...r.seccoes.flatMap(s=>s.blocos.filter(b=>b.tipo==='paragrafo')),...r.naoDiz];
      for(const p of paragrafos)frases.push({familia,id:e.slug,lang,rota,caminho:p.caminho,citadas,texto:normal(p.pedacos.map(x=>{
        const t=texto([x],lang);
        const nota=typeof x==='object'&&x&&'claim' in x?notaDaBandeira(getClaim(x.claim),lang):'';
        return t+(nota?` (${nota})`:'');
      }).join(''))});
    }
  }
  for(const id of idsDosBlocos()) {
    const b=blocoResolvido(id,lang);
    const citadas=ids.filter(cid=>b.linhas.includes(cid)||b.pecas.some(p=>p.linhas.includes(cid)));
    for(const [caminho,pedacos] of [['frase',b.frase],['ressalva',b.ressalva],...b.pecas.filter(p=>p.mostra).map(p=>[`peca:${p.id}`,p.pedacos])])
      frases.push({familia:'inicio',id,lang,rota:lang==='pt'?'/':'/en/',caminho,citadas,texto:normal(textoDosPedacos(pedacos,lang))});
  }
}
/* As duas observações de 2024 perderam a nota «p» nas réguas dos cartões.
   São texto visível, embora não sejam parágrafos dos resolvedores acima. */
for (const lang of ['pt','en']) for (const [id,pt,en] of [
  ['divida-das-empresas-2024','/estado-e-economia','/en/state-and-economy'],
  ['divida-das-familias-2024','/pobreza-e-desigualdade','/en/poverty-and-inequality'],
]) {
  const c=getClaim(id),nota=notaDaBandeira(c,lang);
  frases.push({familia:'regua',id,lang,rota:lang==='pt'?pt:en,caminho:'anterior',citadas:[id],texto:normal(`${c.reference_date}:${c.value}${nota?` (${nota})`:''}`)});
}
assert(frases.some(f=>f.familia==='explicacao'&&f.citadas.includes('divida-publica-2025')));
const recursivos=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?recursivos(path.join(p,e.name)):[path.join(p,e.name)]);
const fontes=recursivos('src').flatMap(f=>{const s=fs.readFileSync(f,'utf8');const achados=ids.filter(id=>s.includes(id));return achados.length?[{ficheiro:f,ids:achados}]:[];});
const resultado={modo,origem:modo==='depois'?'resolvedores e dist':'resolvedores, sem conferência do HTML',frases,fontes};
if(modo==='depois') {
  const antes=JSON.parse(fs.readFileSync(process.argv[4] ?? `${pasta}/frases-antes.json`));
  const chave=f=>[f.familia,f.id,f.lang,f.caminho].join('|');
  const mapa=new Map(antes.frases.map(f=>[chave(f),f]));
  resultado.comparacao=frases.map(f=>{const anterior=mapa.get(chave(f));assert(anterior);return {...f,antes:anterior.texto,mudou:anterior.texto!==f.texto};});
  const cache=new Map();
  for(const f of resultado.comparacao) {
    const ficheiro=path.join('dist',f.rota,'index.html');
    if(!cache.has(ficheiro))cache.set(ficheiro,parse(fs.readFileSync(ficheiro,'utf8')));
    const r=cache.get(ficheiro);
    const seletor=f.familia==='regua'?`[data-regua="anterior"][data-selo-em="${f.id.replace('-2024','-2025')}"]`:f.familia==='inicio'?`[data-bloco="${f.id}"] ${f.caminho.startsWith('peca:')?`[data-bloco-peca="${f.caminho.slice(5)}"]`:`[data-bloco-${f.caminho}]`}`:`${f.familia==='discussao'?`[data-discussao="${f.id}"] `:''}[data-${f.familia}-paragrafo="${f.caminho}"]`;
    const el=r.querySelector(seletor);
    if(!f.texto&&!el){f.html_confere=true;f.texto_no_dist='';continue;}
    assert(el,`Falta ${seletor} em ${f.rota}`);
    /* As peças em caixa têm um título separado do parágrafo resolvido. */
    const copia=parse((el.querySelector('.pp-caixa-texto') ?? el).outerHTML);
    /* As notas da fonte fazem parte da frase que o leitor vê. */
    f.notas_da_fonte=copia.querySelectorAll('.claim-provisorio').map(x=>normal(x.textContent));
    copia.querySelectorAll('.src-chip, .claim-provisorio-chip').forEach(x=>x.remove());
    f.texto_no_dist=normal(copia.textContent);
    f.texto_comparado=f.texto;
    f.html_confere=f.texto_no_dist===f.texto_comparado;
    assert(f.html_confere,`Texto diferente: ${chave(f)}: ${f.texto_no_dist} / ${f.texto}`);
  }
  resultado.paginas=recursivos('dist').filter(f=>f.endsWith('.html')).flatMap(f=>{
    const html=fs.readFileSync(f,'utf8'), citadas=ids.filter(id=>html.includes(id));
    return citadas.length?[{ficheiro:f,citadas}]:[];
  });
  resultado.conhecido_positivo={explicacao_achada:resultado.comparacao.some(f=>f.familia==='explicacao'&&f.citadas.includes('divida-publica-2025')),recibo_achado:resultado.paginas.some(p=>p.ficheiro==='dist/livro-razao/divida-publica-2025/index.html'),comparador_ve_planta:normal(resultado.comparacao[0].antes)!==normal(resultado.comparacao[0].antes+' planta')};
  assert(Object.values(resultado.conhecido_positivo).every(Boolean));
}
fs.writeFileSync(`${process.argv[3] ?? (modo==='antes'?pasta:`${pasta}/d`)}/frases-${modo}.json`,JSON.stringify(resultado,null,2)+'\n');
console.log(JSON.stringify({frases:frases.length,fontes:fontes.length,mudadas:resultado.comparacao?.filter(f=>f.mudou).length,paginas:resultado.paginas?.length}));
