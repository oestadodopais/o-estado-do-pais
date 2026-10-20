/** B1: o primeiro H2 abre a leitura, mesmo depois de uma nota editorial. */
export function conferirAberturaB1(root, registo, chave, lang) {
  const erros = [];
  const err = mensagem => erros.push(mensagem);
  const textoTranscrito = el => el.textContent.replace(/\s+/g, ' ').trim();
    const nomes = lang === 'pt'
      ? ['Em resumo', 'O que este projeto conclui', 'O que podia funcionar melhor']
      : ['In brief', 'What this project concludes', 'What could work better'];
    const principais = registo.blocks.filter(b => b.kind === 'heading' && Number(b.level) === 2);
    const leituras = root.querySelectorAll('.estudo-leitura');
    const textos = root.querySelectorAll('.estudo-texto');
    if (textos.length !== 1) err(`B1 leitura ${chave}: deve existir um corpo de texto.`);
    const primeiroConteudo = registo.blocks.find(b => b.i > 0 && b.kind === 'heading' && Number(b.level) === 2);
    if (primeiroConteudo?.kind !== 'heading' || Number(primeiroConteudo.level) !== 2 || primeiroConteudo.text !== nomes[0]) {
      if (leituras.length) err(`B1 leitura ${chave}: registo sem abertura não pode ter leitura.`);

    } else {
      if (nomes.some((nome, i) => principais[i]?.text !== nome) || principais.filter(b => nomes.includes(b.text)).length !== nomes.length)
        err(`B1 leitura ${chave}: os três títulos não estão presentes pela ordem aprovada.`);
      const primeiroDoTexto = principais.find(b => !nomes.includes(b.text));
      const rendidos = leituras[0]?.querySelectorAll('h2[data-registo-unidade]').map(h => textoTranscrito(h)) ?? [];
      if (leituras.length !== 1 || JSON.stringify(rendidos) !== JSON.stringify(nomes))
        err(`B1 leitura ${chave}: a leitura rendida não contém exatamente as três secções.`);
      if (!primeiroDoTexto || textos[0]?.querySelector('[data-registo-bloco]')?.getAttribute('data-registo-bloco') !== String(primeiroDoTexto.i))
        err(`B1 leitura ${chave}: o texto não começa a seguir à terceira secção da leitura.`);
      // Todas as unidades pertencem ao lado certo da fronteira, não só os títulos.
      if (primeiroDoTexto) for (const b of registo.blocks.filter(b => b.i > 0)) {
        const contentor = b.i < primeiroDoTexto.i ? leituras[0] : textos[0];
        if (!contentor?.querySelector(`[data-registo-bloco="${b.i}"]`))
          err(`B1 leitura ${chave}: bloco ${b.i} no lado errado da fronteira.`);
      }
    }
  return erros;
}
