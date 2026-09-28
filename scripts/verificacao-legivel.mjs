/** A cópia independente da forma da data. Os restantes campos continuam literais. */
export function conferirValorDeProveniencia(correcao, campo, renderizado) {
  const normal = s => String(s).replace(/\s+/g, ' ').trim();
  let esperado = normal(correcao[campo]);
  if (correcao.kind === 'proveniencia' && correcao.field === 'access_date') {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(esperado);
    if (m) esperado = `${m[3]}.${m[2]}.${m[1]}`;
  }
  return { esperado, confere: renderizado === esperado };
}

/** Agrupar a apresentação conserva todos os campos de todas as entradas. */
export function conferirHistoricoLegivel(root, linha) {
  const erros = [];
  const entradas = linha.corrections ?? [];
  const grupos = root.querySelectorAll('.historico-entrada');
  const chave = c => JSON.stringify([c.date, c.kind, c.reason, c.reason_en]);
  const esperados = new Map();
  entradas.forEach((c, n) => esperados.set(chave(c), [...(esperados.get(chave(c)) ?? []), n]));
  if (grupos.length !== esperados.size) erros.push('C1d: a história não agrupa as entradas do mesmo dia e motivo');
  const vistos = [];
  for (const grupo of grupos) {
    const razao = grupo.querySelector('[data-correcao-campo="reason"]');
    const indices = String(razao?.getAttribute('data-correcao-grupo') ?? '').split(' ').map(Number);
    const original = entradas[indices[0]];
    const previsto = original ? esperados.get(chave(original)) : [];
    if (!previsto || JSON.stringify(indices.slice().sort((a,b)=>a-b)) !== JSON.stringify(previsto)) erros.push('C1d: o grupo da história perdeu ou misturou entradas');
    for (const campo of ['date', 'kind', 'reason']) {
      const campos = grupo.querySelectorAll(`[data-correcao-campo="${campo}"]`);
      if (campos.length !== 1 || campos[0].getAttribute('data-correcao-grupo') !== indices.join(' ')) erros.push('C1d: o grupo não partilha uma só data, natureza e razão');
    }
    for (const n of indices) {
      vistos.push(n);
      for (const campo of ['old_value', 'new_value', ...(entradas[n]?.kind === 'proveniencia' ? ['field'] : [])]) {
        if (grupo.querySelectorAll(`[data-correcao-n="${n}"][data-correcao-campo="${campo}"]`).length !== 1) erros.push('C1d: a história perdeu um campo de uma entrada agrupada');
      }
    }
  }
  if (JSON.stringify(vistos.sort((a,b)=>a-b)) !== JSON.stringify(entradas.map((_,n)=>n))) erros.push('C1d: a história não mostra cada entrada uma vez');
  return erros;
}

/** C1: ausência de segunda leitura e porta da atualização, lidas do registo. */
export function conferirVerificacaoLegivel(root, linha, lang) {
  const erros = [];
  const n = v => Number(String(v).replace(/[\s\u202f]/g, '').replace('−', '-').replace(',', '.'));
  const vazio = root.querySelectorAll('[data-sem-segunda-leitura]');
  const sem = lang === 'en' ? 'none yet' : 'ainda nenhuma';
  const tem = (linha.verifications ?? []).length > 0;
  if (tem ? vazio.length !== 0 : vazio.length !== 1 || vazio[0]?.textContent !== sem) {
    erros.push('C1: a ausência de segunda leitura não corresponde ao registo');
  }
  if (!tem && vazio.length === 1 && vazio[0].parentNode.previousElementSibling?.textContent !== (lang === 'en' ? 'Second reading:' : 'Segunda leitura:')) erros.push('C1d: a ausência de releitura não tem o rótulo correspondente');
  for (const el of root.querySelectorAll('[data-linha-verificacao]')) {
    const v = linha.verifications?.[Number(el.getAttribute('data-linha-verificacao'))];
    if (!v) { erros.push('C1: segunda leitura sem entrada no registo'); continue; }
    const uso = el.querySelectorAll('[data-valor-em-uso]');
    const diferente = v.result === 'diverge' && n(v.found) !== n(linha.value);
    const fraseUso = lang === 'en' ? 'This page uses the value shown in the title.' : 'O valor do título é o que esta página usa.';
    if (diferente ? uso.length !== 1 || uso[0]?.textContent !== fraseUso : uso.length !== 0) {
      erros.push('C1c: a divergência não diz corretamente qual é o valor em uso');
    }
    const atualizacao = v.result === 'diverge' ? (linha.corrections ?? []).findIndex(c =>
      c.kind === 'atualizacao' && c.date >= v.date && n(c.new_value) === n(v.found)) : -1;
    const portas = el.querySelectorAll('[data-atualizacao-da-releitura]');
    if (atualizacao < 0 ? portas.length !== 0 : portas.length !== 1 || portas[0]?.getAttribute('href') !== `#alteracao-${atualizacao}`) {
      erros.push('C1: a segunda leitura não aponta para a atualização do valor encontrado');
    }
    if (atualizacao >= 0 && !root.querySelector(`#alteracao-${atualizacao}`)) erros.push('C1: atualização sem destino na história');
    const posterior = v.result === 'igual' ? (linha.corrections ?? []).map((c, i) => ({...c, i})).filter(c => ['atualizacao','correcao'].includes(c.kind) && c.date > v.date).sort((a,b) => a.date.localeCompare(b.date) || a.i-b.i)[0] : null;
    const anterior = el.querySelectorAll('[data-valor-anterior-confirmado]');
    if (posterior ? anterior.length !== 1 || n(anterior[0].textContent) !== n(posterior.old_value) : anterior.length !== 0) erros.push('C1d: a releitura não identifica o valor anterior que confirmou');
    if (v.result === 'inacessivel' && el.querySelector('[data-linha-verificacao-resultado]')?.textContent !== (lang === 'en' ? 'with no answer to that request' : 'sem resposta a esse pedido')) erros.push('C1d: a tentativa sem resposta faz uma afirmação sobre o dia inteiro');
    const esperado = v.result === 'inacessivel' ? (lang === 'en' ? 'Re-read attempted on' : 'Releitura tentada a') : v.by === 'corredor-diario'
      ? (lang === 'en' ? 'Source file read again on' : 'Ficheiro da fonte relido a')
      : (lang === 'en' ? 'Re-read on' : 'Releitura a');
    if (el.previousElementSibling?.textContent !== esperado) erros.push('C1: o recibo não distingue a leitura do número da leitura do ficheiro');
  }
  return erros;
}
