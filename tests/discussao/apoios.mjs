/** Cada frase fixa da explicação dos contratos-programa declara o seu apoio. */
const frases=[
 {linha:'oe-2027-saude-dotacao-reforco-contratos-programa',
  pt:'é nesta rubrica que fica, para a Saúde, a dotação para reforçar os contratos-programa ainda por fechar',
  en:'this line is where the provision to reinforce the contract-programmes still to be closed sits for Health'},
 {linha:'oe-2027-saude-contrato-programa-acss',
  pt:'os acordos entre a Administração Central do Sistema de Saúde e as entidades do Serviço Nacional de Saúde',
  en:"the agreements between the Central Administration of the Health System and the National Health Service's entities"},
];
export function conferirApoiosDaComparacao(auditoria){
 const folhas=auditoria.explicacoes.find(e=>e.slug==='saude-no-orcamento')?.folhas.filter(f=>f.caminho.startsWith('seccoes[2].conteudo[2].paragrafo'))??[];
 const erros=[];
 for(const frase of frases)for(const lang of ['pt','en']){
  const partes=folhas.flatMap(f=>f.partes??[]).filter(p=>p[lang]?.includes(frase[lang]));
  if(partes.length!==1||!partes[0].apoios?.some(a=>a.linha===frase.linha&&a.campo==='excerpt')){
   erros.push(`V2D apoio da frase: ${lang}, ${frase.linha} ausente da frase correspondente`);
  }
 }
 return erros;
}
export function plantasDosApoios(auditoria){
 return frases.map(frase=>{
  const copia=structuredClone(auditoria);
  for(const folha of copia.explicacoes.find(e=>e.slug==='saude-no-orcamento').folhas){
   if(!folha.caminho.startsWith('seccoes[2].conteudo[2].paragrafo'))continue;
   for(const parte of folha.partes)if(parte.pt.includes(frase.pt))parte.apoios=parte.apoios.filter(a=>a.linha!==frase.linha);
  }
  const queixa=conferirApoiosDaComparacao(copia).find(e=>e.includes(frase.linha));
  return {nome:'frase sem o seu apoio: '+frase.linha,mordeu:!!queixa,queixa:queixa??null};
 });
}
