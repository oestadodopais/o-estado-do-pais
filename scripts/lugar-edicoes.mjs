/** ED1-D: as portas atuais e históricas têm contas e destinos próprios. */
export function conferirPortasDaEdicao(portas, atual, primeira, todas=null) {
  const esperadas=todas??(primeira?[primeira,atual]:[atual]);
  const erros=[];
  if(portas.length!==esperadas.length||portas.some((p,i)=>p!==esperadas[i]))erros.push('faltam as portas das edições nos destinos e na ordem declarados');
  return {edicoes:portas.filter(p=>p===atual).length,primeiras_edicoes:portas.filter(p=>primeira&&p===primeira).length,erros};
}
export function conferirColecoes(vistas, esperadas) {
  return Object.entries(vistas).filter(([nome,n])=>n!==esperadas[nome]).map(([nome,n])=>
    `§7.4 e 8.6 · a régua viu ${n} «${nome}» em dist/, e o registo dos estudos diz ${esperadas[nome]}. Uma coleção mais pequena do que os dados é uma família de páginas que desapareceu em silêncio; uma maior é uma segunda apresentação da mesma coisa.`);
}
