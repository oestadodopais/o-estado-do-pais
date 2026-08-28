// medicoes/lib/xml.mjs
//
// Um conferidor de boa formação de XML/SVG escrito de raiz: pilha de
// etiquetas, com aspas simples e duplas respeitadas dentro das etiquetas,
// comentários e declarações `<?...?>`/`<!...>` saltados sem entrar na pilha.
// Não valida esquema nenhum, só a forma: cada etiqueta aberta tem de fechar,
// pela ordem certa.
export function verificarXMLBemFormado(texto) {
  let i = 0;
  const n = texto.length;
  const pilha = [];
  while (i < n) {
    const abre = texto.indexOf('<', i);
    if (abre === -1) break;
    i = abre;
    if (texto.startsWith('<!--', i)) {
      const fim = texto.indexOf('-->', i + 4);
      if (fim === -1) return { bemFormado: false, erro: 'comentário sem fecho' };
      i = fim + 3;
      continue;
    }
    if (texto.startsWith('<![CDATA[', i)) {
      const fim = texto.indexOf(']]>', i);
      if (fim === -1) return { bemFormado: false, erro: 'CDATA sem fecho' };
      i = fim + 3;
      continue;
    }
    if (texto.startsWith('<?', i)) {
      const fim = texto.indexOf('?>', i);
      if (fim === -1) return { bemFormado: false, erro: 'declaração <? ... ?> sem fecho' };
      i = fim + 2;
      continue;
    }
    if (texto.startsWith('<!', i)) {
      const fim = texto.indexOf('>', i);
      if (fim === -1) return { bemFormado: false, erro: 'declaração <! ... > sem fecho' };
      i = fim + 1;
      continue;
    }
    // etiqueta normal: percorre respeitando aspas
    let j = i + 1;
    let emAspas = null;
    while (j < n) {
      const c = texto[j];
      if (emAspas) {
        if (c === emAspas) emAspas = null;
        j++;
        continue;
      }
      if (c === '"' || c === "'") {
        emAspas = c;
        j++;
        continue;
      }
      if (c === '>') break;
      j++;
    }
    if (j >= n) return { bemFormado: false, erro: `etiqueta por fechar a partir do índice ${i}` };
    const corpo = texto.slice(i + 1, j);
    i = j + 1;
    if (corpo.startsWith('/')) {
      const nome = corpo.slice(1).trim().split(/\s/)[0];
      const topo = pilha[pilha.length - 1];
      if (topo !== nome) {
        return {
          bemFormado: false,
          erro: `</${nome}> não bate com o topo da pilha (${topo ?? 'pilha vazia'}), no índice ${i}`,
        };
      }
      pilha.pop();
      continue;
    }
    const autoFechado = corpo.endsWith('/');
    const nome = (autoFechado ? corpo.slice(0, -1) : corpo).trim().split(/\s/)[0];
    if (!nome) continue;
    if (!autoFechado) pilha.push(nome);
  }
  if (pilha.length > 0) return { bemFormado: false, erro: `por fechar ao chegar ao fim: ${pilha.join(', ')}` };
  return { bemFormado: true, erro: null };
}
