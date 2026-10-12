/** Uma migalha final vazia não pode deixar um separador sem destino. */
export function conferirCaminhoFinal(root) {
 return root.querySelectorAll('nav.caminho').filter(n=>n.textContent.trim().endsWith('›')).map(()=> 'RP4N-f: o caminho termina num separador sem destino');
}
