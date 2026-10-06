/** EX2: ensaio das duas formas, com os valores do livro e os tipos da página, sem escrever páginas do sítio. */
import fs from 'node:fs';
import { chromium } from 'playwright';
const base = JSON.parse(fs.readFileSync(new URL('base.json', import.meta.url)));
const font = fs.readFileSync('public/tipos/spectral/Spectral-Regular.woff2').toString('base64');
const escapar = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const linhas = base.unidades.flatMap(u => ['pt','en'].flatMap(lang => {
  const de = lang === 'pt' ? 'de' : 'from', para = lang === 'pt' ? 'para' : 'to';
  return ['parenteses','antes'].map(forma => ({linha:u.linha, unidade:u.unidade, lang, forma,
    texto: forma === 'parenteses' ? `${de} ${u.antes} ${para} ${u.depois} (${u.edicoes[lang].texto})` : `${u.edicoes[lang].texto}: ${de} ${u.antes} ${para} ${u.depois}`,
    parenteses_dentro_de_parenteses: forma === 'parenteses' && /[()]/.test(u.edicoes[lang].texto)}));
}));
const browser = await chromium.launch({headless:true});
const medidas=[];
try {
  for (const largura of [390,1280]) {
    const page=await browser.newPage({viewport:{width:largura,height:900}});
    await page.setContent(`<style>@font-face{font-family:Spectral;src:url(data:font/woff2;base64,${font})}body{margin:18px}p{font:16px/1.5 Spectral;max-width:65ch;overflow-wrap:break-word}</style>${linhas.map((l,i)=>`<p data-n="${i}">${escapar(l.texto)}</p>`).join('')}`);
    await page.evaluate(()=>document.fonts.ready);
    const ms=await page.evaluate(()=>[...document.querySelectorAll('p')].map(p=>({n:Number(p.dataset.n),altura:p.getBoundingClientRect().height, linhas:p.getBoundingClientRect().height/24, transborda:p.scrollWidth>p.clientWidth+1})));
    medidas.push(...ms.map(m=>({...linhas[m.n],largura,...m})));
    await page.close();
  }
} finally {await browser.close();}
const resumo=Object.fromEntries(['parenteses','antes'].map(forma=>{const m=medidas.filter(m=>m.forma===forma);return [forma,{amostras:m.length,transbordos:m.filter(x=>x.transborda).length,linhas_total:m.reduce((a,b)=>a+b.linhas,0),parenteses_aninhados:linhas.filter(l=>l.forma===forma&&l.parenteses_dentro_de_parenteses).length}]}));
const out={comando:'node design/especime-v3/medicoes/ex2-2026-10-06/medir-unidades.mjs',cabeca:base.cabeca,unidades:base.unidades_distintas,edicoes:['pt','en'],larguras:[390,1280],resumo,medidas,
  escolha:'antes',razao:'A unidade antes dos dois pontos separa o rótulo dos valores e evita acrescentar parênteses a unidades que já os têm. A geometria é um ensaio da frase curta com os tipos da página; as capturas conferem a frase inteira construída.'};
if(resumo.antes.transbordos) throw Error('a forma escolhida transborda');
fs.writeFileSync(new URL('unidades.json',import.meta.url),JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({resumo,escolha:out.escolha},null,2));
