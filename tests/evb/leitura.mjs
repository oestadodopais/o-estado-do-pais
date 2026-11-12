import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {LEITURAS} from '../../src/data/leituras.mjs';
import {leituraJulgada} from '../../scripts/textos-julgados.mjs';
const slug='evora-2027-capital-europeia-da-cultura',l=LEITURAS[slug];
assert.equal(l.medidas.length,2);
for(const lang of ['pt','en']){
 const f=l.frase[lang];
 assert.deepEqual(f.filter(p=>typeof p!=='string'),[{ref:'2025'}]);
 assert(f.filter(p=>typeof p==='string').every(p=>!/[0-9]/.test(p)));
 const file=`studies-src/${slug}/${lang}.html`,lines=fs.readFileSync(file,'utf8').split('\n');
 const n=lines.findIndex(t=>parse(t).textContent===l.origem[lang])+1;
 assert(n>0);assert(l.origem.onde.includes(`${file}:${n} (C005)`));
 const texto=f.map(p=>typeof p==='string'?p:p.ref).join('');
 assert.equal(texto,l.origem[lang]);
 assert.equal(l.origem.troca,undefined);
 const registo=JSON.parse(fs.readFileSync(`registos/${slug}/${lang}.record.json`,'utf8'));
 assert.equal(texto,registo.blocks[4].text);
 console.log(`EVB leitura ${lang}: C005 na linha ${n}, um ano por referência, sem números de linha nem troca de palavras.`);
}

// Os anos da definição têm marca própria; a auditoria continua a prender o ano exato.
const {FAMILIAS_DAS_LINHAS}=await import('../../src/data/o-que-e-das-familias.mjs');
const {errosDasFamilias}=await import('../../src/lib/o-que-e-o-numero.mjs');
const {conferirAuditoriaDasFamilias}=await import('../cartao/familias.mjs');
const chave='evora-2027-pago-pela-cultura';
const alterada=structuredClone(FAMILIAS_DAS_LINHAS);
alterada[chave].frase.pt.find(p=>p.ref).ref='2024';
assert(conferirAuditoriaDasFamilias({familias:alterada}).erros.length);
alterada[chave].frase.pt.find(p=>p.ref).ref='9,7';
assert(errosDasFamilias(alterada).length);
console.log('EVL definições: ano trocado e medição disfarçada de ano recusados.');

// A via das primeiras frases conserva os controlos e as plantas.
const prefixo = {
  "mostrarMedidasNoCartao": true,
  "medidas": [
    {
      "claim": "evora-2027-recebido-do-protocolo-ate-2025",
      "nome": {
        "pt": [
          "milhões de euros recebidos do protocolo até ao fim de ",
          {
            "ref": "2025"
          },
          ", pelas contas da Associação Évora 2027"
        ],
        "en": [
          "million euros received under the protocol up to the end of ",
          {
            "ref": "2025"
          },
          ", by the accounts of the Associação Évora 2027"
        ]
      }
    },
    {
      "claim": "evora-2027-transferido-no-relato-ao-painel-2025",
      "nome": {
        "pt": [
          "milhões de euros que o relatório de progresso de Évora 2027 dava como já transferidos em junho de ",
          {
            "ref": "2025"
          },
          ", pelo resumo do painel europeu"
        ],
        "en": [
          "million euros that Évora 2027's progress report gave as already transferred in June ",
          {
            "ref": "2025"
          },
          ", by the European panel's summary"
        ]
      }
    }
  ],
  "frase": {
    "pt": [
      "No dinheiro, as contas da Associação Évora ",
      {
        "ref": "2027"
      },
      " declaram ",
      {
        "claim": "evora-2027-recebido-do-protocolo-ate-2025"
      },
      " milhões recebidos do protocolo de ",
      {
        "ref": "2023"
      },
      " até ao fim de ",
      {
        "ref": "2025"
      },
      ". Em junho de ",
      {
        "ref": "2025"
      },
      ", o resumo que o painel de peritos europeus faz do relatório de progresso dava ",
      {
        "claim": "evora-2027-transferido-no-relato-ao-painel-2025"
      },
      " milhões como já transferidos."
    ],
    "en": [
      "On the money, the accounts of the Associação Évora ",
      {
        "ref": "2027"
      },
      " declare ",
      {
        "claim": "evora-2027-recebido-do-protocolo-ate-2025"
      },
      " million received from the ",
      {
        "ref": "2023"
      },
      " protocol up to the end of ",
      {
        "ref": "2025"
      },
      ". In June ",
      {
        "ref": "2025"
      },
      ", the summary that the panel of European experts makes of the progress report gave ",
      {
        "claim": "evora-2027-transferido-no-relato-ao-painel-2025"
      },
      " million as already transferred."
    ]
  },
  "origem": {
    "pt": "No dinheiro, as contas da Associação Évora 2027 declaram 9,7 milhões recebidos do protocolo de 2023 até ao fim de 2025. Em junho de 2025, o resumo que o painel de peritos europeus faz do relatório de progresso dava 34 milhões como já transferidos.",
    "en": "On the money, the accounts of the Associação Évora 2027 declare 9,7 million received from the 2023 protocol up to the end of 2025. In June 2025, the summary that the panel of European experts makes of the progress report gave 34 million as already transferred.",
    "onde": "studies-src/evora-2027-capital-europeia-da-cultura/pt.html:48 (C004) · studies-src/evora-2027-capital-europeia-da-cultura/en.html:48 (C004)"
  }
};
let plantas=0;
for(const lang of ['pt','en']){
 const file=`studies-src/${slug}/${lang}.html`,lines=fs.readFileSync(file,'utf8').split('\n');
 const n=lines.findIndex(t=>parse(t).textContent.startsWith(prefixo.origem[lang]))+1;
 assert(n>0);assert(prefixo.origem.onde.includes(`${file}:${n} (C004)`));
 const registo=JSON.parse(fs.readFileSync(`registos/${slug}/${lang}.record.json`,'utf8'));
 const unidades=new Set([registo.blocks[3].text]);
 assert.equal(leituraJulgada(prefixo,lang,unidades,slug),prefixo.origem[lang]);
 for(const mudar of [
  e=>{e.frase[lang][0]=e.frase[lang][0].replace(lang==='pt'?'contas':'accounts',lang==='pt'?'livros':'books');},
  e=>{e.frase[lang].find(p=>p.claim).claim=prefixo.medidas[1].claim;},
  e=>{e.frase[lang].find(p=>p.ref==='2025').ref='2024';},
  e=>{e.origem[lang]=e.origem[lang].slice(0,-10);e.frase[lang][e.frase[lang].length-1]=e.frase[lang].at(-1).slice(0,-10);},
 ]){const e=structuredClone(prefixo);mudar(e);assert.equal(leituraJulgada(e,lang,unidades,slug),null);plantas++;}
 console.log(`EVL leitura ${lang}: C004 na linha ${n}; duas medidas e primeiras frases inteiras conferidas.`);
}
console.log(`EVL: ${plantas} plantas de palavra, número, ano e frase incompleta recusadas.`);

// A atribuição inglesa declara a língua sem traduzir o nome.
const {LINGUA_DAS_ATRIBUICOES,linguaDaAtribuicao}=await import('../../src/i18n/lingua-dos-titulos.mjs');
const {allClaims}=await import('../../src/lib/ledger.mjs');
const nomes=new Set(allClaims().flatMap(r=>r.attributed_to??[]));
for(const [nome,lingua] of Object.entries(LINGUA_DAS_ATRIBUICOES)){
 assert(nomes.has(nome));assert.equal(linguaDaAtribuicao(nome,'pt'),lingua);
 assert.equal(linguaDaAtribuicao(nome,'en'),null);
}
