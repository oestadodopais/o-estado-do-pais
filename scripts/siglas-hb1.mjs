/** As siglas do bloco, expandidas uma vez na prosa antes do primeiro uso. */
import assert from 'node:assert/strict';
export const expansoesHb1 = {
 INE: ['Instituto Nacional de Estatística', 'National Statistics Institute'],
 IVA: ['imposto sobre o valor acrescentado', 'value added tax'],
 VAT: [null, 'value added tax'],
 IRS: ['imposto sobre o rendimento das pessoas singulares', 'personal income tax'],
 PSP: ['Polícia de Segurança Pública', 'Public Security Police'],
 IGAI: ['Inspeção-Geral da Administração Interna', 'Inspectorate-General of Home Affairs'],
 CGTP: ['Confederação Geral dos Trabalhadores Portugueses', 'General Confederation of Portuguese Workers'],
 PS: ['Partido Socialista', 'Socialist Party'],
 PCP: ['Partido Comunista Português', 'Portuguese Communist Party'],
 BE: ['Bloco de Esquerda', 'Left Bloc'],
 PAN: ['Pessoas-Animais-Natureza', 'People-Animals-Nature'],
 JPP: ['Juntos pelo Povo', 'Juntos pelo Povo'],
 IL: ['Iniciativa Liberal', 'Iniciativa Liberal'],
 PSD: ['Partido Social Democrata', 'Social Democratic Party'],
 'CDS-PP': ['CDS-Partido Popular', 'CDS-Partido Popular'],
 FEH: ['Fundo de Emergência para a Habitação', 'Housing Emergency Fund'],
 IMT: ['imposto municipal sobre as transmissões onerosas de imóveis', 'municipal property transfer tax'],
 IS: ['imposto do selo', 'stamp duty'],
 PRR: ['Plano de Recuperação e Resiliência', 'Recovery and Resilience Plan'],
 CIRS: ['Código do IRS', 'income tax code'],
 RTP: ['Rádio e Televisão de Portugal', 'Rádio e Televisão de Portugal'],
};
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const maskQuotes=s=>{let depth=0;return [...s].map(c=>{if(c==='«'){depth++;return ' ';}if(c==='»'){depth=Math.max(0,depth-1);return ' ';}return depth?' ':c;}).join('');};
export function conferirSiglasHb1(frases,lingua) {
 const idioma=lingua==='pt'?0:1;
 return Object.entries(expansoesHb1).filter(([,nomes])=>nomes[idioma]).map(([sigla,nomes])=>{
  const expansao=nomes[idioma],pattern=new RegExp(`(?<![\\w-])${escape(sigla)}(?![\\w-])`);
  const bloco=frases.findIndex(t=>pattern.test(t));assert(bloco>=0,`${lingua}: sigla ${sigla} ausente`);
  const texto=frases[bloco],posicao=texto.search(pattern),prosa=maskQuotes(texto),inicio=prosa.lastIndexOf(expansao,posicao);
  // HB1-c2: o primeiro uso pode vir de um texto copiado da fonte (a atribuição
  // «dirigente nacional do BE»); vale então a glosa logo a seguir, entre
  // parênteses, «BE (o Bloco de Esquerda, o BE)». Sem uma das duas, recusa.
  const depois=prosa.indexOf(expansao,posicao),glosa=depois>posicao&&/^\s*\((?:(?:o|a|the)\s+)?$/.test(prosa.slice(posicao+sigla.length,depois));
  assert((inicio>=0&&inicio<posicao&&posicao-inicio<expansao.length+35)||glosa,`${lingua}: ${sigla} não expandida ao primeiro uso`);
  // Uma citação literal pode repetir a forma longa. Só a prosa é editável.
  const expansionPattern=new RegExp(escape(expansao)+`(?:'s)?\\s*[, (]+(?:(?:o|a|the)\\s+)?${sigla==='IVA'?'(?:VAT, )?':''}${escape(sigla)}(?![\\w-])`,'g');
  const vezes=frases.reduce((n,t)=>n+[...maskQuotes(t).matchAll(expansionPattern)].length,0);
  assert.equal(vezes,1,`${lingua}: expansão ${sigla} repetida ou sem a forma declarada`);
  return {sigla,expansao,bloco,seletor:`[data-registo-bloco="${bloco}"]`,contexto:glosa&&!(inicio>=0&&inicio<posicao)?texto.slice(posicao,depois+expansao.length):texto.slice(inicio,posicao+sigla.length),expansoes_na_prosa:vezes};
 });
}
