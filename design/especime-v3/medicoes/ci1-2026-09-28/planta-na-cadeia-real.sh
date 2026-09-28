#!/bin/sh
# A PLANTA NA CADEIA REAL (bloco CI1, 28.09.2026). Sobre o package.json e o dist/
# verdadeiros: acrescenta ao verify um passo novo que deixa uma marca numa pasta
# temporária, e planta em dist/index.html uma frase com uma palavra da lista da
# norma §1.3, que o check:palavras recusa em repouso. Corre o verify depois do
# build e exige: o passo novo correu; a corrida fechou com 1; o check:palavras
# saiu diferente de 0 e a célula U nomeia-o. Repõe os dois ficheiros e confere
# os sha256 contra os de antes. Uso, da raiz do sítio: sh <este ficheiro> <saida.json>
set -u
SAIDA="$1"
MARCA=$(mktemp -u "${TMPDIR:-/tmp}/oedp-ci1-planta-nova.XXXXXX")
PK=package.json
PAG=dist/index.html
GUARDA=$(mktemp -d "${TMPDIR:-/tmp}/oedp-ci1-planta.XXXXXX")
cp -p "$PK" "$GUARDA/package.json"
cp -p "$PAG" "$GUARDA/index.html"
PK_ANTES=$(shasum -a 256 "$PK" | cut -d' ' -f1)
PAG_ANTES=$(shasum -a 256 "$PAG" | cut -d' ' -f1)
node -e "
const fs=require('fs');const p=JSON.parse(fs.readFileSync('$PK','utf8'));
p.scripts.verify += ' && node -e \"require(\\'fs\\').writeFileSync(\\'$MARCA\\',\\'\\')\"';
fs.writeFileSync('$PK', JSON.stringify(p,null,2)+'\n');
const h=fs.readFileSync('$PAG','utf8');const i=h.indexOf('<body');const j=h.indexOf('>',i);
fs.rmSync('$PAG');fs.writeFileSync('$PAG', h.slice(0,j+1)+'<p class=\"planta\">As regras da casa estão no Método.</p>'+h.slice(j+1));
"
node scripts/verify-depois-do-build.mjs --json "$SAIDA.corrida.json" > "$SAIDA.log" 2>&1
CODIGO=$?
NOVA=nao; [ -f "$MARCA" ] && NOVA=sim
rm -f "$MARCA"
cp -p "$GUARDA/package.json" "$PK"
cp -p "$GUARDA/index.html" "$PAG"
rm -rf "$GUARDA"
PK_DEPOIS=$(shasum -a 256 "$PK" | cut -d' ' -f1)
PAG_DEPOIS=$(shasum -a 256 "$PAG" | cut -d' ' -f1)
node -e "
const fs=require('fs');const r=JSON.parse(fs.readFileSync('$SAIDA.corrida.json','utf8'));
const pal=r.corridos.find(c=>c.passo==='npm run check:palavras');
const nova=r.corridos.find(c=>c.passo.includes('oedp-ci1-planta-nova'));
const res={codigo_da_corrida:$CODIGO, passo_novo_correu:'$NOVA'==='sim', passo_novo_codigo:nova?nova.codigo:null,
  palavras_codigo:pal?pal.codigo:null, U_nomeia_palavras:r.celulas.U.falhas.some(f=>f.includes('check:palavras')),
  D_ok:r.celulas.D.ok, C_ok:r.celulas.C.ok, vermelhos:r.corridos.filter(c=>c.codigo!==0).map(c=>c.passo),
  package_json_reposto:'$PK_ANTES'==='$PK_DEPOIS', index_reposto:'$PAG_ANTES'==='$PAG_DEPOIS', sha256_package_json:'$PK_DEPOIS', sha256_index:'$PAG_DEPOIS'};
res.mordeu = res.codigo_da_corrida===1 && res.passo_novo_correu && res.passo_novo_codigo===0 && res.palavras_codigo!==0 && res.U_nomeia_palavras && res.package_json_reposto && res.index_reposto;
fs.writeFileSync('$SAIDA', JSON.stringify(res,null,1)+'\n'); console.log(JSON.stringify(res));
"
