import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const {parse}=createRequire(path.resolve('package.json'))('node-html-parser');
const dir='design/especime-v3/medicoes/v2b-2026-10-12/correcao';
const cap='design/especime-v3/capturas/v2b-2026-10-12';
const h=JSON.parse(fs.readFileSync(dir+'/html.json'));
const frases={cabeca:h.cabeca,edicoes:{}};
for(const [lang,e] of Object.entries(h.edicoes)){
 const file=lang==='pt'?'o-que-se-discute/index.html':'en/under-discussion/index.html';
 const root=parse(fs.readFileSync('dist/'+file,'utf8')),porta=root.querySelector('[data-discussao-explicacao]'),alvo=porta.getAttribute('href');
 const caixa=root.querySelector('[data-discussao="parcerias-rodoviarias"] [data-discussao-parte="comparacao"] .claim-com-chip');
 frases.edicoes[lang]={comparacao_saude:e.itens[0].partes.find(x=>x.id==='comparacao').paragrafos,como_foi_dito:e.itens[0].partes[0].paragrafos[0],comparacao_ppp:e.itens[1].partes.find(x=>x.id==='comparacao').paragrafos[0],porta:{texto:porta.text,href:alvo,destino_existe:fs.existsSync(path.join('dist',alvo,'index.html')),navegacao:porta.hasAttribute('data-voz')},ordem_numero_unidade_selo:caixa.childNodes.filter(n=>n.rawTagName).map(n=>n.classNames),unidade_antes_do_selo:caixa.innerHTML.indexOf('claim-sufixo')<caixa.innerHTML.indexOf('src-chip')};
}
fs.writeFileSync(dir+'/frases.json',JSON.stringify(frases,null,2)+'\n');
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const baseline=cap+'/retoma2/capturas.json',b=JSON.parse(fs.readFileSync(baseline));const changed=['o-que-se-discute/index.html','en/under-discussion/index.html'];
const paginas=Object.entries(b.recursos).filter(([p])=>p.endsWith('.html')&&!changed.includes(p)).map(([pagina,sha256_retoma2])=>{const sha256_correcao=sha('dist/'+pagina);return {pagina,sha256_retoma2,sha256_correcao,igual:sha256_retoma2===sha256_correcao};});
fs.writeFileSync(dir+'/paginas-inalteradas.json',JSON.stringify({cabeca:h.cabeca,origem:baseline,paginas_do_manifesto:Object.keys(b.recursos).filter(p=>p.endsWith('.html')).length,paginas_alteradas:changed,paginas_inalteradas:paginas,todas_iguais:paginas.every(p=>p.igual)},null,2)+'\n');
const c=JSON.parse(fs.readFileSync(cap+'/correcao/capturas.json'));
const manifesto={...c,resultados:c.resultados.map(r=>({...r,ficheiro:'correcao/'+r.ficheiro,recortes:r.recortes.map(x=>({...x,ficheiro:'correcao/'+x.ficheiro}))})),anteriores:[{manifesto:'retoma2/capturas.json',cabeca:b.cabeca,sha256:sha(baseline)}],manifesto_da_correcao:{ficheiro:'correcao/capturas.json',sha256:sha(cap+'/correcao/capturas.json')}};
fs.writeFileSync(cap+'/capturas.json',JSON.stringify(manifesto,null,2)+'\n');
const l1=JSON.parse(fs.readFileSync(dir+'/preparacao/l1.json'));l1.cabeca=h.cabeca;
const atual=JSON.parse(fs.readFileSync(dir+'/l1-destinos.json'));
l1.depois=atual.paginas;for(const k of Object.keys(l1.discussao))l1.discussao[k].depois=atual.repetidos_por_pagina[k];
fs.writeFileSync(dir+'/l1.json',JSON.stringify(l1,null,2)+'\n');
console.log(JSON.stringify({cabeca:h.cabeca,frases:Object.values(frases.edicoes).reduce((n,e)=>n+e.comparacao_saude.length+2,0),paginas_inalteradas:paginas.length,sha256_iguais:paginas.filter(p=>p.igual).length,capturas:c.resultados.length,l1:atual.paginas}));
